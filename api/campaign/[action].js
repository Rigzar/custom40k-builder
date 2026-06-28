import { sql, ensureSchema } from '../_lib/db.js';
import { getSessionUserId } from '../_lib/auth.js';

// Planetary Assault campaign module (ALPHA). Single dynamic route for every /api/campaign/*
// action, same reasoning as api/auth/[action].js — keeps the Vercel Hobby plan's 12-function
// cap from being an issue as this module grows.
export default async function handler(req, res) {
  const userId = getSessionUserId(req);
  if (!userId) {
    res.status(401).json({ error: 'Not logged in' });
    return;
  }

  try {
    await ensureSchema();

    switch (req.query.action) {
      case 'list':    return list(req, res, userId);
      case 'create':  return create(req, res, userId);
      case 'join':    return join(req, res, userId);
      case 'players': return players(req, res, userId);
      default:
        res.status(404).json({ error: 'Unknown campaign action' });
    }
  } catch (err) {
    res.status(err.statusCode ?? 500).json({ error: err.statusCode ? err.message : 'Request failed', detail: String(err) });
  }
}

function generateInviteCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I
  let code = '';
  for (let i = 0; i < 6; i++) code += alphabet[Math.floor(Math.random() * alphabet.length)];
  return code;
}

/** GET /api/campaign/list -> every campaign this user belongs to, with their own role/faction. */
async function list(req, res, userId) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const result = await sql`
    SELECT c.id, c.name, c.invite_code, c.factions, c.gm_user_id, cp.faction, cp.role
    FROM campaigns c
    JOIN campaign_players cp ON cp.campaign_id = c.id
    WHERE cp.user_id = ${userId}
    ORDER BY c.created_at DESC
  `;
  res.status(200).json({ ok: true, campaigns: result.rows });
}

/** POST /api/campaign/create { name, factions: string[] } -> creates the campaign, caller becomes GM. */
async function create(req, res, userId) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { name, factions } = req.body ?? {};
  if (typeof name !== 'string' || !name.trim()) {
    res.status(400).json({ error: 'Campaign name is required.' });
    return;
  }
  if (!Array.isArray(factions) || factions.length < 2 || !factions.every(f => typeof f === 'string' && f.trim())) {
    res.status(400).json({ error: 'At least 2 factions are required.' });
    return;
  }
  const cleanFactions = factions.map(f => f.trim());

  let inviteCode = generateInviteCode();
  for (let attempt = 0; attempt < 5; attempt++) {
    const existing = await sql`SELECT id FROM campaigns WHERE invite_code = ${inviteCode}`;
    if (existing.rows.length === 0) break;
    inviteCode = generateInviteCode();
  }

  const inserted = await sql`
    INSERT INTO campaigns (name, invite_code, factions, gm_user_id)
    VALUES (${name.trim()}, ${inviteCode}, ${JSON.stringify(cleanFactions)}, ${userId})
    RETURNING id, name, invite_code, factions, gm_user_id
  `;
  const campaign = inserted.rows[0];
  await sql`
    INSERT INTO campaign_players (campaign_id, user_id, faction, role)
    VALUES (${campaign.id}, ${userId}, NULL, 'gm')
  `;
  res.status(200).json({ ok: true, campaign: { ...campaign, faction: null, role: 'gm' } });
}

/** POST /api/campaign/join { inviteCode, faction } -> joins an existing campaign as a player. */
async function join(req, res, userId) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { inviteCode, faction } = req.body ?? {};
  if (typeof inviteCode !== 'string' || !inviteCode.trim()) {
    res.status(400).json({ error: 'Invite code is required.' });
    return;
  }
  if (typeof faction !== 'string' || !faction.trim()) {
    res.status(400).json({ error: 'Faction is required.' });
    return;
  }

  const result = await sql`SELECT id, factions FROM campaigns WHERE invite_code = ${inviteCode.trim().toUpperCase()}`;
  const campaign = result.rows[0];
  if (!campaign) {
    res.status(404).json({ error: 'No campaign found with that invite code.' });
    return;
  }
  if (!campaign.factions.includes(faction.trim())) {
    res.status(400).json({ error: 'That faction is not part of this campaign.' });
    return;
  }

  const existing = await sql`SELECT id FROM campaign_players WHERE campaign_id = ${campaign.id} AND user_id = ${userId}`;
  if (existing.rows.length > 0) {
    res.status(409).json({ error: 'You already joined this campaign.' });
    return;
  }

  await sql`
    INSERT INTO campaign_players (campaign_id, user_id, faction, role)
    VALUES (${campaign.id}, ${userId}, ${faction.trim()}, 'player')
  `;
  res.status(200).json({ ok: true, campaignId: campaign.id });
}

/** GET /api/campaign/players?campaignId=N -> every player + faction + role in a campaign you belong to. */
async function players(req, res, userId) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const campaignId = Number(req.query.campaignId);
  if (!Number.isInteger(campaignId)) {
    res.status(400).json({ error: 'Missing or invalid "campaignId" query param.' });
    return;
  }

  const membership = await sql`SELECT id FROM campaign_players WHERE campaign_id = ${campaignId} AND user_id = ${userId}`;
  if (membership.rows.length === 0) {
    res.status(403).json({ error: 'You are not a member of this campaign.' });
    return;
  }

  const result = await sql`
    SELECT u.username, cp.faction, cp.role, cp.joined_at
    FROM campaign_players cp
    JOIN users u ON u.id = cp.user_id
    WHERE cp.campaign_id = ${campaignId}
    ORDER BY cp.joined_at ASC
  `;
  res.status(200).json({ ok: true, players: result.rows });
}
