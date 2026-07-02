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
      case 'list':          return list(req, res, userId);
      case 'create':        return create(req, res, userId);
      case 'join':          return join(req, res, userId);
      case 'players':       return players(req, res, userId);
      case 'sector-list':   return sectorList(req, res, userId);
      case 'sector-init':   return sectorInit(req, res, userId);
      case 'sector-claim':  return sectorClaim(req, res, userId);
      case 'turn-advance':  return turnAdvance(req, res, userId);
      case 'battle-log':    return battleLog(req, res, userId);
      case 'battle-list':   return battleList(req, res, userId);
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
    SELECT c.id, c.name, c.invite_code, c.factions, c.gm_user_id, c.current_turn, cp.faction, cp.role
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

// ── Sector map ───────────────────────────────────────────────────────────────

const DEFAULT_SECTORS = [
  { name: 'Command Center',    sector_type: 'city',       x: 300, y: 200 },
  { name: 'Northern Outpost',  sector_type: 'wasteland',  x: 300, y:  75 },
  { name: 'Eastern Forge',     sector_type: 'industrial', x: 421, y: 137 },
  { name: 'Southern Ruins',    sector_type: 'ruin',       x: 421, y: 262 },
  { name: 'Southern Outpost',  sector_type: 'wasteland',  x: 300, y: 325 },
  { name: 'Western Forge',     sector_type: 'industrial', x: 179, y: 262 },
  { name: 'Northern Ruins',    sector_type: 'ruin',       x: 179, y: 137 },
];

/** Resolve membership and return the campaign row, or throw 403. */
async function requireMembership(campaignId, userId) {
  const membership = await sql`SELECT cp.role FROM campaign_players cp WHERE cp.campaign_id = ${campaignId} AND cp.user_id = ${userId}`;
  if (membership.rows.length === 0) {
    const err = new Error('You are not a member of this campaign.'); err.statusCode = 403; throw err;
  }
  return membership.rows[0].role;
}

/** GET /api/campaign/sector-list?campaignId=N */
async function sectorList(req, res, userId) {
  if (req.method !== 'GET') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const campaignId = Number(req.query.campaignId);
  if (!Number.isInteger(campaignId)) { res.status(400).json({ error: 'Missing campaignId' }); return; }
  await requireMembership(campaignId, userId);
  const result = await sql`SELECT * FROM campaign_sectors WHERE campaign_id = ${campaignId} ORDER BY id ASC`;
  res.status(200).json({ ok: true, sectors: result.rows });
}

/** POST /api/campaign/sector-init { campaignId } -> GM creates the default 7-sector layout. */
async function sectorInit(req, res, userId) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const { campaignId } = req.body ?? {};
  if (!Number.isInteger(campaignId)) { res.status(400).json({ error: 'Missing campaignId' }); return; }
  const role = await requireMembership(campaignId, userId);
  if (role !== 'gm') { res.status(403).json({ error: 'Only the GM can initialize the map.' }); return; }
  const existing = await sql`SELECT id FROM campaign_sectors WHERE campaign_id = ${campaignId} LIMIT 1`;
  if (existing.rows.length > 0) { res.status(409).json({ error: 'Map already initialized.' }); return; }
  for (const s of DEFAULT_SECTORS) {
    await sql`INSERT INTO campaign_sectors (campaign_id, name, sector_type, x, y) VALUES (${campaignId}, ${s.name}, ${s.sector_type}, ${s.x}, ${s.y})`;
  }
  const result = await sql`SELECT * FROM campaign_sectors WHERE campaign_id = ${campaignId} ORDER BY id ASC`;
  res.status(200).json({ ok: true, sectors: result.rows });
}

/** POST /api/campaign/sector-claim { campaignId, sectorId, ownerFaction } -> GM sets sector owner. */
async function sectorClaim(req, res, userId) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const { campaignId, sectorId, ownerFaction } = req.body ?? {};
  if (!Number.isInteger(campaignId) || !Number.isInteger(sectorId)) { res.status(400).json({ error: 'Missing campaignId or sectorId' }); return; }
  const role = await requireMembership(campaignId, userId);
  if (role !== 'gm') { res.status(403).json({ error: 'Only the GM can claim sectors.' }); return; }
  const owner = typeof ownerFaction === 'string' && ownerFaction.trim() ? ownerFaction.trim() : null;
  await sql`UPDATE campaign_sectors SET owner_faction = ${owner} WHERE id = ${sectorId} AND campaign_id = ${campaignId}`;
  res.status(200).json({ ok: true });
}

// ── Turn tracker ─────────────────────────────────────────────────────────────

/** POST /api/campaign/turn-advance { campaignId } -> GM increments current_turn by 1. */
async function turnAdvance(req, res, userId) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const { campaignId } = req.body ?? {};
  if (!Number.isInteger(campaignId)) { res.status(400).json({ error: 'Missing campaignId' }); return; }
  const role = await requireMembership(campaignId, userId);
  if (role !== 'gm') { res.status(403).json({ error: 'Only the GM can advance the turn.' }); return; }
  const result = await sql`UPDATE campaigns SET current_turn = current_turn + 1 WHERE id = ${campaignId} RETURNING current_turn`;
  res.status(200).json({ ok: true, current_turn: result.rows[0].current_turn });
}

// ── Battle reports ────────────────────────────────────────────────────────────

/** POST /api/campaign/battle-log { campaignId, attackerFaction, defenderFaction, winnerFaction, sectorId?, notes? }
 *  GM logs a battle. If sectorId + winnerFaction → auto-claims that sector. */
async function battleLog(req, res, userId) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const { campaignId, attackerFaction, defenderFaction, winnerFaction, sectorId, notes } = req.body ?? {};
  if (!Number.isInteger(campaignId)) { res.status(400).json({ error: 'Missing campaignId' }); return; }
  if (typeof attackerFaction !== 'string' || !attackerFaction.trim()) { res.status(400).json({ error: 'attackerFaction required' }); return; }
  if (typeof defenderFaction !== 'string' || !defenderFaction.trim()) { res.status(400).json({ error: 'defenderFaction required' }); return; }
  const role = await requireMembership(campaignId, userId);
  if (role !== 'gm') { res.status(403).json({ error: 'Only the GM can log battles.' }); return; }

  const turnRes = await sql`SELECT current_turn FROM campaigns WHERE id = ${campaignId}`;
  const turn = turnRes.rows[0]?.current_turn ?? 1;
  const winner = typeof winnerFaction === 'string' && winnerFaction.trim() ? winnerFaction.trim() : null;
  const sid = Number.isInteger(sectorId) ? sectorId : null;
  const noteText = typeof notes === 'string' && notes.trim() ? notes.trim() : null;

  const inserted = await sql`
    INSERT INTO campaign_battles (campaign_id, turn, attacker_faction, defender_faction, winner_faction, sector_id, notes)
    VALUES (${campaignId}, ${turn}, ${attackerFaction.trim()}, ${defenderFaction.trim()}, ${winner}, ${sid}, ${noteText})
    RETURNING id
  `;

  // Auto-claim the sector if there's a winner and a sector
  if (sid && winner) {
    await sql`UPDATE campaign_sectors SET owner_faction = ${winner} WHERE id = ${sid} AND campaign_id = ${campaignId}`;
  }

  res.status(200).json({ ok: true, battleId: inserted.rows[0].id });
}

/** GET /api/campaign/battle-list?campaignId=N -> all battles for a campaign, newest first. */
async function battleList(req, res, userId) {
  if (req.method !== 'GET') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const campaignId = Number(req.query.campaignId);
  if (!Number.isInteger(campaignId)) { res.status(400).json({ error: 'Missing campaignId' }); return; }
  await requireMembership(campaignId, userId);
  const result = await sql`
    SELECT b.id, b.turn, b.attacker_faction, b.defender_faction, b.winner_faction,
           b.sector_id, s.name AS sector_name, b.notes, b.recorded_at
    FROM campaign_battles b
    LEFT JOIN campaign_sectors s ON s.id = b.sector_id
    WHERE b.campaign_id = ${campaignId}
    ORDER BY b.recorded_at DESC
  `;
  res.status(200).json({ ok: true, battles: result.rows });
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
