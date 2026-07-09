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
      case 'supply-list':   return supplyList(req, res, userId);
      case 'supply-adjust': return supplyAdjust(req, res, userId);
      case 'sector-rename': return sectorRename(req, res, userId);
      case 'roster-list':   return rosterList(req, res, userId);
      case 'roster-add':    return rosterAdd(req, res, userId);
      case 'roster-update': return rosterUpdate(req, res, userId);
      case 'roster-remove': return rosterRemove(req, res, userId);
      case 'delete':        return deleteCampaign(req, res, userId);
      case 'building-list':   return buildingList(req, res, userId);
      case 'building-add':    return buildingAdd(req, res, userId);
      case 'building-upgrade':return buildingUpgrade(req, res, userId);
      case 'building-remove': return buildingRemove(req, res, userId);
      case 'stratagem-use':   return stratagemUse(req, res, userId);
      case 'event-draw':      return eventDraw(req, res, userId);
      case 'event-confirm':   return eventConfirm(req, res, userId);
      case 'event-list':      return eventList(req, res, userId);
      case 'event-resolve':   return eventResolve(req, res, userId);
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
    SELECT c.id, c.name, c.invite_code, c.factions, c.gm_user_id, c.current_turn,
           c.max_turns, c.sectors_to_win, c.status, c.winner_faction, cp.faction, cp.role
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
  const maxTurns = Number.isInteger(req.body?.maxTurns) ? Math.max(0, req.body.maxTurns) : 0;
  const sectorsToWin = Number.isInteger(req.body?.sectorsToWin) ? Math.max(0, req.body.sectorsToWin) : 0;

  let inviteCode = generateInviteCode();
  for (let attempt = 0; attempt < 5; attempt++) {
    const existing = await sql`SELECT id FROM campaigns WHERE invite_code = ${inviteCode}`;
    if (existing.rows.length === 0) break;
    inviteCode = generateInviteCode();
  }

  const inserted = await sql`
    INSERT INTO campaigns (name, invite_code, factions, gm_user_id, max_turns, sectors_to_win)
    VALUES (${name.trim()}, ${inviteCode}, ${JSON.stringify(cleanFactions)}, ${userId}, ${maxTurns}, ${sectorsToWin})
    RETURNING id, name, invite_code, factions, gm_user_id, max_turns, sectors_to_win, status, winner_faction
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

/** POST /api/campaign/turn-advance { campaignId } -> GM increments current_turn and credits supply. */
async function turnAdvance(req, res, userId) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const { campaignId } = req.body ?? {};
  if (!Number.isInteger(campaignId)) { res.status(400).json({ error: 'Missing campaignId' }); return; }
  const role = await requireMembership(campaignId, userId);
  if (role !== 'gm') { res.status(403).json({ error: 'Only the GM can advance the turn.' }); return; }

  const result = await sql`
    UPDATE campaigns SET current_turn = current_turn + 1
    WHERE id = ${campaignId} AND status = 'active'
    RETURNING current_turn, factions, max_turns, sectors_to_win, status
  `;
  if (!result.rows.length) {
    const camp = await sql`SELECT current_turn, status, winner_faction FROM campaigns WHERE id = ${campaignId}`;
    const r = camp.rows[0];
    res.status(200).json({ ok: true, current_turn: r.current_turn, status: r.status, winner_faction: r.winner_faction });
    return;
  }
  const { current_turn, factions, max_turns, sectors_to_win, status } = result.rows[0];

  // Credit supply by sector type: city=3, industrial=2, wasteland/ruin=1
  const SUPPLY_BY_TYPE = { city: 3, industrial: 2, wasteland: 1, ruin: 1 };
  const sectorCounts = await sql`
    SELECT owner_faction, sector_type, COUNT(*)::int AS cnt
    FROM campaign_sectors
    WHERE campaign_id = ${campaignId} AND owner_faction IS NOT NULL
    GROUP BY owner_faction, sector_type
  `;
  const earnedMap = {};
  for (const { owner_faction, sector_type, cnt } of sectorCounts.rows) {
    earnedMap[owner_faction] = (earnedMap[owner_faction] ?? 0) + (SUPPLY_BY_TYPE[sector_type] ?? 1) * cnt;
  }
  for (const faction of factions) {
    const earned = earnedMap[faction] ?? 0;
    await sql`
      INSERT INTO campaign_supply (campaign_id, faction, amount)
      VALUES (${campaignId}, ${faction}, ${earned})
      ON CONFLICT (campaign_id, faction) DO UPDATE SET amount = campaign_supply.amount + ${earned}
    `;
  }

  // Victory check
  let winner = null;
  let finished = false;

  if (sectors_to_win > 0) {
    const leaders = await sql`
      SELECT owner_faction, COUNT(*)::int AS cnt
      FROM campaign_sectors
      WHERE campaign_id = ${campaignId} AND owner_faction IS NOT NULL
      GROUP BY owner_faction
      HAVING COUNT(*) >= ${sectors_to_win}
      ORDER BY cnt DESC LIMIT 1
    `;
    if (leaders.rows.length > 0) { winner = leaders.rows[0].owner_faction; finished = true; }
  }

  if (!finished && max_turns > 0 && current_turn >= max_turns) {
    const leaders = await sql`
      SELECT owner_faction, COUNT(*)::int AS cnt
      FROM campaign_sectors
      WHERE campaign_id = ${campaignId} AND owner_faction IS NOT NULL
      GROUP BY owner_faction
      ORDER BY cnt DESC LIMIT 2
    `;
    if (leaders.rows.length > 0) {
      const top = leaders.rows[0], second = leaders.rows[1];
      if (!second || top.cnt > second.cnt) winner = top.owner_faction;
    }
    finished = true;
  }

  if (finished) {
    await sql`UPDATE campaigns SET status = 'finished', winner_faction = ${winner} WHERE id = ${campaignId}`;
  }

  res.status(200).json({ ok: true, current_turn, status: finished ? 'finished' : 'active', winner_faction: winner });
}

/** POST /api/campaign/sector-rename { campaignId, sectorId, name, sectorType } -> GM renames/retypes a sector. */
async function sectorRename(req, res, userId) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const { campaignId, sectorId, name, sectorType } = req.body ?? {};
  if (!Number.isInteger(campaignId) || !Number.isInteger(sectorId)) { res.status(400).json({ error: 'Missing campaignId or sectorId' }); return; }
  if (typeof name !== 'string' || !name.trim()) { res.status(400).json({ error: 'name required' }); return; }
  const VALID_TYPES = ['city', 'industrial', 'wasteland', 'ruin'];
  const type = VALID_TYPES.includes(sectorType) ? sectorType : 'wasteland';
  const role = await requireMembership(campaignId, userId);
  if (role !== 'gm') { res.status(403).json({ error: 'Only the GM can rename sectors.' }); return; }
  await sql`UPDATE campaign_sectors SET name = ${name.trim()}, sector_type = ${type} WHERE id = ${sectorId} AND campaign_id = ${campaignId}`;
  res.status(200).json({ ok: true });
}

/** GET /api/campaign/supply-list?campaignId=N */
async function supplyList(req, res, userId) {
  if (req.method !== 'GET') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const campaignId = Number(req.query.campaignId);
  if (!Number.isInteger(campaignId)) { res.status(400).json({ error: 'Missing campaignId' }); return; }
  await requireMembership(campaignId, userId);
  const result = await sql`SELECT faction, amount FROM campaign_supply WHERE campaign_id = ${campaignId} ORDER BY amount DESC, faction ASC`;
  // Ensure all campaign factions appear even before first turn-advance
  const campaign = await sql`SELECT factions FROM campaigns WHERE id = ${campaignId}`;
  const known = new Set(result.rows.map(r => r.faction));
  const rows = [...result.rows];
  for (const f of campaign.rows[0].factions) {
    if (!known.has(f)) rows.push({ faction: f, amount: 0 });
  }
  res.status(200).json({ ok: true, supply: rows });
}

/** POST /api/campaign/supply-adjust { campaignId, faction, delta } -> GM adjusts a faction's supply. */
async function supplyAdjust(req, res, userId) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const { campaignId, faction, delta } = req.body ?? {};
  if (!Number.isInteger(campaignId) || typeof faction !== 'string' || !Number.isInteger(delta)) {
    res.status(400).json({ error: 'Missing campaignId, faction, or delta' }); return;
  }
  const role = await requireMembership(campaignId, userId);
  if (role !== 'gm') { res.status(403).json({ error: 'Only the GM can adjust supply.' }); return; }
  await sql`
    INSERT INTO campaign_supply (campaign_id, faction, amount)
    VALUES (${campaignId}, ${faction}, ${Math.max(0, delta)})
    ON CONFLICT (campaign_id, faction) DO UPDATE SET amount = GREATEST(0, campaign_supply.amount + ${delta})
  `;
  const result = await sql`SELECT amount FROM campaign_supply WHERE campaign_id = ${campaignId} AND faction = ${faction}`;
  res.status(200).json({ ok: true, amount: result.rows[0]?.amount ?? 0 });
}

// ── Battle reports ────────────────────────────────────────────────────────────

const ENGAGEMENT_SUPPLY_COST = { 'kill-team': 0, skirmish: 1, pitched: 3, epic: 6 };

/** POST /api/campaign/battle-log { campaignId, attackerFaction, defenderFaction, winnerFaction,
 *  engagementType?, sectorId?, notes? }
 *  GM logs a battle. Auto-claims sector on win. Auto-deducts attacker Supply by engagement type. */
async function battleLog(req, res, userId) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const { campaignId, attackerFaction, defenderFaction, winnerFaction, engagementType, sectorId, notes } = req.body ?? {};
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
  const engType = Object.keys(ENGAGEMENT_SUPPLY_COST).includes(engagementType) ? engagementType : 'pitched';

  const inserted = await sql`
    INSERT INTO campaign_battles (campaign_id, turn, attacker_faction, defender_faction, winner_faction, engagement_type, sector_id, notes)
    VALUES (${campaignId}, ${turn}, ${attackerFaction.trim()}, ${defenderFaction.trim()}, ${winner}, ${engType}, ${sid}, ${noteText})
    RETURNING id
  `;

  // Auto-claim the sector if there's a winner and a sector
  if (sid && winner) {
    await sql`UPDATE campaign_sectors SET owner_faction = ${winner} WHERE id = ${sid} AND campaign_id = ${campaignId}`;
  }

  // Auto-deduct Supply from attacker (kill-team = 0, skirmish = 1, pitched = 3, epic = 6)
  const cost = ENGAGEMENT_SUPPLY_COST[engType] ?? 0;
  if (cost > 0) {
    await sql`
      INSERT INTO campaign_supply (campaign_id, faction, amount) VALUES (${campaignId}, ${attackerFaction.trim()}, 0)
      ON CONFLICT (campaign_id, faction) DO NOTHING
    `;
    await sql`
      UPDATE campaign_supply SET amount = GREATEST(0, amount - ${cost})
      WHERE campaign_id = ${campaignId} AND faction = ${attackerFaction.trim()}
    `;
  }

  res.status(200).json({ ok: true, battleId: inserted.rows[0].id, supplyCostDeducted: cost });
}

/** GET /api/campaign/battle-list?campaignId=N -> all battles for a campaign, newest first. */
async function battleList(req, res, userId) {
  if (req.method !== 'GET') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const campaignId = Number(req.query.campaignId);
  if (!Number.isInteger(campaignId)) { res.status(400).json({ error: 'Missing campaignId' }); return; }
  await requireMembership(campaignId, userId);
  const result = await sql`
    SELECT b.id, b.turn, b.attacker_faction, b.defender_faction, b.winner_faction,
           b.engagement_type, b.sector_id, s.name AS sector_name, b.notes, b.recorded_at
    FROM campaign_battles b
    LEFT JOIN campaign_sectors s ON s.id = b.sector_id
    WHERE b.campaign_id = ${campaignId}
    ORDER BY b.recorded_at DESC
  `;
  res.status(200).json({ ok: true, battles: result.rows });
}

// ── Roster ────────────────────────────────────────────────────────────────────

const VALID_SLOTS = ['HQ', 'Troops', 'Elites', 'Fast Attack', 'Heavy Support', 'Dedicated Transport', 'Flyers', 'Lords of War'];
const VALID_STATUSES = ['active', 'wounded', 'dead'];

/** GET /api/campaign/roster-list?campaignId=N */
async function rosterList(req, res, userId) {
  if (req.method !== 'GET') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const campaignId = Number(req.query.campaignId);
  if (!Number.isInteger(campaignId)) { res.status(400).json({ error: 'Missing campaignId' }); return; }
  await requireMembership(campaignId, userId);
  const result = await sql`
    SELECT id, faction, unit_name, unit_slot, xp, wounds, status, notes, created_at
    FROM campaign_roster
    WHERE campaign_id = ${campaignId}
    ORDER BY faction ASC, created_at ASC
  `;
  res.status(200).json({ ok: true, roster: result.rows });
}

/** POST /api/campaign/roster-add { campaignId, faction, unitName, unitSlot, notes } */
async function rosterAdd(req, res, userId) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const { campaignId, faction, unitName, unitSlot, notes } = req.body ?? {};
  if (!Number.isInteger(campaignId)) { res.status(400).json({ error: 'Missing campaignId' }); return; }
  if (typeof faction !== 'string' || !faction.trim()) { res.status(400).json({ error: 'faction required' }); return; }
  if (typeof unitName !== 'string' || !unitName.trim()) { res.status(400).json({ error: 'unitName required' }); return; }

  const role = await requireMembership(campaignId, userId);
  if (role !== 'gm') {
    // Players can only add to their own faction
    const myFaction = await sql`SELECT faction FROM campaign_players WHERE campaign_id = ${campaignId} AND user_id = ${userId}`;
    if (myFaction.rows[0]?.faction !== faction.trim()) {
      res.status(403).json({ error: 'You can only add units to your own faction.' }); return;
    }
  }

  const slot = VALID_SLOTS.includes(unitSlot) ? unitSlot : 'HQ';
  const noteText = typeof notes === 'string' && notes.trim() ? notes.trim() : null;

  const inserted = await sql`
    INSERT INTO campaign_roster (campaign_id, faction, unit_name, unit_slot, notes)
    VALUES (${campaignId}, ${faction.trim()}, ${unitName.trim()}, ${slot}, ${noteText})
    RETURNING id, faction, unit_name, unit_slot, xp, wounds, status, notes, created_at
  `;
  res.status(200).json({ ok: true, unit: inserted.rows[0] });
}

/** POST /api/campaign/roster-update { campaignId, unitId, xp?, wounds?, status?, notes?, unitName? } */
async function rosterUpdate(req, res, userId) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const { campaignId, unitId, xp, wounds, status, notes, unitName } = req.body ?? {};
  if (!Number.isInteger(campaignId) || !Number.isInteger(unitId)) { res.status(400).json({ error: 'Missing campaignId or unitId' }); return; }

  const role = await requireMembership(campaignId, userId);
  const cur = await sql`SELECT * FROM campaign_roster WHERE id = ${unitId} AND campaign_id = ${campaignId}`;
  if (!cur.rows.length) { res.status(404).json({ error: 'Unit not found.' }); return; }
  const row = cur.rows[0];

  if (role !== 'gm') {
    const myFaction = await sql`SELECT faction FROM campaign_players WHERE campaign_id = ${campaignId} AND user_id = ${userId}`;
    if (myFaction.rows[0]?.faction !== row.faction) {
      res.status(403).json({ error: 'You can only edit your own faction\'s units.' }); return;
    }
  }

  const newXp     = Number.isInteger(xp) ? Math.max(0, xp) : row.xp;
  const newWounds = Number.isInteger(wounds) ? Math.max(0, wounds) : row.wounds;
  const newStatus = typeof status === 'string' && VALID_STATUSES.includes(status) ? status : row.status;
  const newNotes  = typeof notes === 'string' ? (notes.trim() || null) : row.notes;
  const newName   = typeof unitName === 'string' && unitName.trim() ? unitName.trim() : row.unit_name;
  const { trait } = req.body ?? {};
  const newTrait  = trait === null ? null : (typeof trait === 'string' && trait.trim() ? trait.trim() : row.trait ?? null);

  // Deduct trait upgrade cost when first assigning a trait (Infantry=2⊗, MC/Vehicle=4⊗)
  let traitCostDeducted = 0;
  const isFirstTrait = newTrait && !row.trait;
  if (isFirstTrait) {
    const slot = row.unit_slot ?? '';
    const vehicleSlots = ['Heavy Support', 'Dedicated Transport', 'Flyers', 'Lords of War'];
    const traitCost = (vehicleSlots.includes(slot) || slot === 'Elites') ? 4 : 2;
    traitCostDeducted = traitCost;
    await sql`INSERT INTO campaign_supply (campaign_id, faction, amount) VALUES (${campaignId}, ${row.faction}, 0) ON CONFLICT (campaign_id, faction) DO NOTHING`;
    await sql`UPDATE campaign_supply SET amount = GREATEST(0, amount - ${traitCost}) WHERE campaign_id = ${campaignId} AND faction = ${row.faction}`;
  }

  await sql`
    UPDATE campaign_roster
    SET xp = ${newXp}, wounds = ${newWounds}, status = ${newStatus}, notes = ${newNotes}, unit_name = ${newName}, trait = ${newTrait}
    WHERE id = ${unitId} AND campaign_id = ${campaignId}
  `;
  const updated = await sql`SELECT id, faction, unit_name, unit_slot, xp, wounds, status, notes, trait FROM campaign_roster WHERE id = ${unitId}`;
  res.status(200).json({ ok: true, unit: updated.rows[0], traitCostDeducted });
}

/** POST /api/campaign/roster-remove { campaignId, unitId } */
async function rosterRemove(req, res, userId) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const { campaignId, unitId } = req.body ?? {};
  if (!Number.isInteger(campaignId) || !Number.isInteger(unitId)) { res.status(400).json({ error: 'Missing campaignId or unitId' }); return; }

  const role = await requireMembership(campaignId, userId);
  const unitRow = await sql`SELECT faction FROM campaign_roster WHERE id = ${unitId} AND campaign_id = ${campaignId}`;
  if (!unitRow.rows.length) { res.status(404).json({ error: 'Unit not found.' }); return; }

  if (role !== 'gm') {
    const myFaction = await sql`SELECT faction FROM campaign_players WHERE campaign_id = ${campaignId} AND user_id = ${userId}`;
    if (myFaction.rows[0]?.faction !== unitRow.rows[0].faction) {
      res.status(403).json({ error: 'You can only remove your own faction\'s units.' }); return;
    }
  }

  await sql`DELETE FROM campaign_roster WHERE id = ${unitId} AND campaign_id = ${campaignId}`;
  res.status(200).json({ ok: true });
}

/** POST /api/campaign/delete { campaignId, confirmName } -> GM deletes the campaign and all its data. */
async function deleteCampaign(req, res, userId) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const { campaignId, confirmName } = req.body ?? {};
  if (!Number.isInteger(campaignId)) { res.status(400).json({ error: 'Missing campaignId' }); return; }
  if (typeof confirmName !== 'string' || !confirmName.trim()) { res.status(400).json({ error: 'confirmName required' }); return; }

  const role = await requireMembership(campaignId, userId);
  if (role !== 'gm') { res.status(403).json({ error: 'Only the GM can delete a campaign.' }); return; }

  const result = await sql`SELECT name FROM campaigns WHERE id = ${campaignId}`;
  if (!result.rows.length) { res.status(404).json({ error: 'Campaign not found.' }); return; }
  if (result.rows[0].name !== confirmName.trim()) {
    res.status(400).json({ error: 'Campaign name does not match.' }); return;
  }

  // Delete in dependency order
  await sql`DELETE FROM campaign_events WHERE campaign_id = ${campaignId}`;
  await sql`DELETE FROM campaign_buildings WHERE campaign_id = ${campaignId}`;
  await sql`DELETE FROM campaign_roster WHERE campaign_id = ${campaignId}`;
  await sql`DELETE FROM campaign_battles WHERE campaign_id = ${campaignId}`;
  await sql`DELETE FROM campaign_supply WHERE campaign_id = ${campaignId}`;
  await sql`DELETE FROM campaign_sectors WHERE campaign_id = ${campaignId}`;
  await sql`DELETE FROM campaign_players WHERE campaign_id = ${campaignId}`;
  await sql`DELETE FROM campaigns WHERE id = ${campaignId}`;

  res.status(200).json({ ok: true });
}

// ── Buildings ─────────────────────────────────────────────────────────────────

const BUILDING_DEFS = {
  'admech-forge':      { label: 'AdMech Forge',              cost: 4, upgradeable: false, effect: 'Upgrade 1 vehicle/MC unit per round (+1 per extra forge)' },
  'assassin-temple':   { label: 'Assassin Temple',           cost: 8, upgradeable: false, effect: 'Field 1 Assassin per 4 Pitched/Epic engagements (Imperium only)' },
  'barracks':          { label: 'Barracks',                  cost: 4, upgradeable: false, effect: 'Upgrade 2 non-vehicle units per round (+2 per extra barracks)' },
  'construction-center':{ label: 'Construction Center',      cost: 2, upgradeable: true,  effect: 'Unlocks Fortified Positions Stratagem (Lv2: fortify 2 extra units)' },
  'deathstrike-silo':  { label: 'Deathstrike Silo',          cost: 6, upgradeable: false, effect: 'Roll 1D6 per round: on 5+ destroy random building in any sector' },
  'hq':                { label: 'Headquarter',               cost: 4, upgradeable: true,  effect: 'Losing this sector = losing the campaign (Lv2: Unique equipment)' },
  'hospital':          { label: 'Hospital',                  cost: 1, upgradeable: true,  effect: 'Roll for 2 destroyed non-vehicle units: 5+ keep upgrade (Lv2: 4+)' },
  'machine-workshop':  { label: 'Machine Workshop',          cost: 1, upgradeable: true,  effect: 'Roll for 2 destroyed MCs/Vehicles: 5+ keep upgrade (Lv2: 4+)' },
  'outpost':           { label: 'Outpost',                   cost: 2, upgradeable: false, effect: '+1 building slot (permanent, not using a slot itself)' },
  'pdc':               { label: 'Planetary Defense Cannon',  cost: 0, upgradeable: false, effect: 'Roll twice for Fleet Supremacy. Unique — cannot be rebuilt' },
  'plasteel-refinery': { label: 'Plasteel Refinery',         cost: 0, upgradeable: false, effect: '+1D6 Supply per round. Unique — cannot be rebuilt' },
  'radio-tower':       { label: 'Radio Tower',               cost: 2, upgradeable: true,  effect: 'Unlocks Jammer Stratagem (Lv2: no enemy reinforcements turn 1)' },
  'research-facility': { label: 'Research Facility',         cost: 3, upgradeable: true,  effect: 'Unlock 1 "Features of.." per round (Lv2: 2 per round)' },
  'satlink':           { label: 'Satlink',                   cost: 2, upgradeable: true,  effect: 'Unlocks Blitz Stratagem (Lv2: +1 reinforcement unit per turn)' },
  'sacrifice-altar':   { label: 'Sacrifice Altar',           cost: 8, upgradeable: false, effect: 'Demon weapon (up to 15pts, escalating). Chaos only' },
  'siege-camp':        { label: 'Siege Camp',                cost: 2, upgradeable: true,  effect: 'Unlocks Artillery Strike Stratagem (Lv2: trigger on 4+)' },
  'space-port':        { label: 'Space Port',                cost: 0, upgradeable: false, effect: 'Draw 2 weekly event cards, pick 1. Unique — cannot be rebuilt' },
  'spec-ops-compound': { label: 'Spec Ops Compound',         cost: 2, upgradeable: true,  effect: 'Unlocks Spy Network Stratagem (Lv2: +1/-1 additional modifier)' },
  'strategium':        { label: 'Strategium',                cost: 2, upgradeable: false, effect: 'Unlocks Nightly Raid Stratagem' },
  'tauva-center':      { label: "Tau'va Unification Center", cost: 6, upgradeable: false, effect: '+1 positive weekly event per round. Tau only' },
  'void-shields':      { label: 'Void Shields',              cost: 4, upgradeable: false, effect: 'Sector immune to Deathstrike Silo attacks' },
};

/** GET /api/campaign/building-list?campaignId=N */
async function buildingList(req, res, userId) {
  if (req.method !== 'GET') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const campaignId = Number(req.query.campaignId);
  if (!Number.isInteger(campaignId)) { res.status(400).json({ error: 'Missing campaignId' }); return; }
  await requireMembership(campaignId, userId);
  const result = await sql`
    SELECT b.id, b.campaign_id, b.sector_id, b.building_type, b.level, b.is_active, b.created_at,
           s.name AS sector_name, s.owner_faction
    FROM campaign_buildings b
    JOIN campaign_sectors s ON s.id = b.sector_id
    WHERE b.campaign_id = ${campaignId}
    ORDER BY s.name ASC, b.created_at ASC
  `;
  res.status(200).json({ ok: true, buildings: result.rows });
}

/** POST /api/campaign/building-add { campaignId, sectorId, buildingType } */
async function buildingAdd(req, res, userId) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const { campaignId, sectorId, buildingType } = req.body ?? {};
  if (!Number.isInteger(campaignId) || !Number.isInteger(sectorId)) { res.status(400).json({ error: 'Missing campaignId or sectorId' }); return; }
  if (!BUILDING_DEFS[buildingType]) { res.status(400).json({ error: 'Unknown building type' }); return; }
  const role = await requireMembership(campaignId, userId);
  if (role !== 'gm') { res.status(403).json({ error: 'Only the GM can construct buildings.' }); return; }

  // Check building slot capacity (Outpost does not occupy a slot)
  const sector = await sql`SELECT building_slots, owner_faction FROM campaign_sectors WHERE id = ${sectorId} AND campaign_id = ${campaignId}`;
  if (!sector.rows.length) { res.status(404).json({ error: 'Sector not found' }); return; }
  const slots = sector.rows[0].building_slots ?? 2;
  const current = await sql`SELECT COUNT(*)::int AS cnt FROM campaign_buildings WHERE sector_id = ${sectorId} AND building_type != 'outpost'`;
  const countNonOutpost = current.rows[0].cnt ?? 0;
  const isOutpost = buildingType === 'outpost';
  if (!isOutpost && countNonOutpost >= slots) {
    res.status(409).json({ error: `Sector has no free building slots (${countNonOutpost}/${slots} used). Build an Outpost to expand.` }); return;
  }

  // Enforce sector ownership: can only build in controlled sectors
  const ownerRow = sector.rows[0];
  if (!ownerRow.owner_faction) {
    res.status(400).json({ error: 'Can only construct buildings in a controlled sector.' }); return;
  }
  const ownerFaction = ownerRow.owner_faction;

  // Deduct supply cost from owning faction (cost-0 buildings: PDC, Plasteel, Space Port skip)
  const buildCost = BUILDING_DEFS[buildingType].cost;
  if (buildCost > 0) {
    await sql`INSERT INTO campaign_supply (campaign_id, faction, amount) VALUES (${campaignId}, ${ownerFaction}, 0) ON CONFLICT (campaign_id, faction) DO NOTHING`;
    await sql`UPDATE campaign_supply SET amount = GREATEST(0, amount - ${buildCost}) WHERE campaign_id = ${campaignId} AND faction = ${ownerFaction}`;
  }

  const inserted = await sql`
    INSERT INTO campaign_buildings (campaign_id, sector_id, building_type, level, is_active)
    VALUES (${campaignId}, ${sectorId}, ${buildingType}, 1, true)
    RETURNING *
  `;
  // If outpost, increase building_slots on the sector
  if (isOutpost) {
    await sql`UPDATE campaign_sectors SET building_slots = building_slots + 1 WHERE id = ${sectorId}`;
  }
  const supplyRow = await sql`SELECT amount FROM campaign_supply WHERE campaign_id = ${campaignId} AND faction = ${ownerFaction}`;
  res.status(200).json({ ok: true, building: inserted.rows[0], supplyCostDeducted: buildCost, newSupply: supplyRow.rows[0]?.amount ?? null });
}

/** POST /api/campaign/building-upgrade { campaignId, buildingId } → max level 2 */
async function buildingUpgrade(req, res, userId) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const { campaignId, buildingId } = req.body ?? {};
  if (!Number.isInteger(campaignId) || !Number.isInteger(buildingId)) { res.status(400).json({ error: 'Missing campaignId or buildingId' }); return; }
  const role = await requireMembership(campaignId, userId);
  if (role !== 'gm') { res.status(403).json({ error: 'Only the GM can upgrade buildings.' }); return; }

  const row = await sql`SELECT * FROM campaign_buildings WHERE id = ${buildingId} AND campaign_id = ${campaignId}`;
  if (!row.rows.length) { res.status(404).json({ error: 'Building not found' }); return; }
  const building = row.rows[0];
  const def = BUILDING_DEFS[building.building_type];
  if (!def?.upgradeable) { res.status(400).json({ error: 'This building cannot be upgraded.' }); return; }
  if (building.level >= 2) { res.status(400).json({ error: 'Building already at maximum level.' }); return; }

  // Deduct upgrade cost (same as construction cost) from sector's owner faction
  const sectorRow = await sql`SELECT owner_faction FROM campaign_sectors WHERE id = ${building.sector_id} AND campaign_id = ${campaignId}`;
  const upgradeOwner = sectorRow.rows[0]?.owner_faction;
  const upgradeCost = def.cost;
  if (upgradeOwner && upgradeCost > 0) {
    await sql`INSERT INTO campaign_supply (campaign_id, faction, amount) VALUES (${campaignId}, ${upgradeOwner}, 0) ON CONFLICT (campaign_id, faction) DO NOTHING`;
    await sql`UPDATE campaign_supply SET amount = GREATEST(0, amount - ${upgradeCost}) WHERE campaign_id = ${campaignId} AND faction = ${upgradeOwner}`;
  }
  await sql`UPDATE campaign_buildings SET level = 2 WHERE id = ${buildingId}`;
  res.status(200).json({ ok: true, supplyCostDeducted: upgradeCost });
}

/** POST /api/campaign/building-remove { campaignId, buildingId } → GM destroys/removes a building */
async function buildingRemove(req, res, userId) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const { campaignId, buildingId } = req.body ?? {};
  if (!Number.isInteger(campaignId) || !Number.isInteger(buildingId)) { res.status(400).json({ error: 'Missing campaignId or buildingId' }); return; }
  const role = await requireMembership(campaignId, userId);
  if (role !== 'gm') { res.status(403).json({ error: 'Only the GM can remove buildings.' }); return; }

  const row = await sql`SELECT sector_id, building_type FROM campaign_buildings WHERE id = ${buildingId} AND campaign_id = ${campaignId}`;
  if (!row.rows.length) { res.status(404).json({ error: 'Building not found' }); return; }

  // If removing an outpost, decrease building_slots (min 1)
  if (row.rows[0].building_type === 'outpost') {
    await sql`UPDATE campaign_sectors SET building_slots = GREATEST(1, building_slots - 1) WHERE id = ${row.rows[0].sector_id}`;
  }

  await sql`DELETE FROM campaign_buildings WHERE id = ${buildingId} AND campaign_id = ${campaignId}`;
  res.status(200).json({ ok: true });
}

// ── Weekly events ────────────────────────────────────────────────────────────

const WEEKLY_EVENTS = [
  { id: 1,  name: 'Asset',                   effect: 'Kill Team mission difficulty −1 this round' },
  { id: 2,  name: 'Blackstone Mine',          effect: '+1 Supply permanently to a random sector under your control' },
  { id: 3,  name: 'Blessing of Machine God',  effect: 'Upgrade 1 Vehicle unit for free this round' },
  { id: 4,  name: 'Breakthrough!',            effect: 'Gain one "Features of.." ability of your choice' },
  { id: 5,  name: 'Calm Before the Storm',    effect: 'Nothing happens' },
  { id: 6,  name: 'Corruption',               effect: 'Construction costs +2 this round' },
  { id: 7,  name: 'Gather Your Forces',       effect: 'No Pitched Battles or Epic Battles this round' },
  { id: 8,  name: 'Heightened Security',      effect: 'Enemy Kill Team mission difficulty +1 this round' },
  { id: 9,  name: 'High Funding',             effect: 'Gain +1D6 Supply' },
  { id: 10, name: 'Low Funding',              effect: 'Lose 1D6 Supply' },
  { id: 11, name: 'Rapid Evolution',          effect: 'Upgrade 1 Monstrous Creature unit for free this round' },
  { id: 12, name: 'Rebellion!',               effect: 'A random sector you control becomes contested this round' },
  { id: 13, name: 'Scrambled Communications', effect: 'First mission this round is randomly determined (not chosen by Attacker)' },
  { id: 14, name: 'Seasoned Reinforcements',  effect: 'Upgrade 1 Infantry unit for free this round' },
  { id: 15, name: 'STC',                      effect: 'Gain a random building in a free slot under your control' },
  { id: 16, name: 'Streamlined Bureaucracy',  effect: 'Construction costs −1 this round' },
  { id: 17, name: 'Total War',                effect: 'First Epic Battle this round costs 0 Supply' },
  { id: 18, name: 'Void Supremacy',           effect: 'Access to "Lance Strike" Stratagem for one engagement' },
];

/** POST /api/campaign/event-draw { campaignId, faction } → GM draws a random event for a faction this turn */
async function eventDraw(req, res, userId) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const { campaignId, faction } = req.body ?? {};
  if (!Number.isInteger(campaignId) || typeof faction !== 'string' || !faction.trim()) {
    res.status(400).json({ error: 'campaignId and faction required' }); return;
  }
  const role = await requireMembership(campaignId, userId);
  if (role !== 'gm') { res.status(403).json({ error: 'Only the GM can draw events.' }); return; }

  const turnRes = await sql`SELECT current_turn FROM campaigns WHERE id = ${campaignId}`;
  const turn = turnRes.rows[0]?.current_turn ?? 1;

  // Space Port: GM may call this twice for the same faction/turn; we allow re-draw up to 2 events
  // For simplicity, we just upsert (re-draw) on conflict
  // Space Port: if faction controls a sector with a Space Port, draw 2 cards and let them pick
  const spacePort = await sql`
    SELECT b.id FROM campaign_buildings b
    JOIN campaign_sectors s ON s.id = b.sector_id
    WHERE b.campaign_id = ${campaignId} AND b.building_type = 'space-port' AND s.owner_faction = ${faction.trim()}
    LIMIT 1
  `;
  const hasSpacePort = spacePort.rows.length > 0;

  if (hasSpacePort) {
    // Draw 2 distinct random events, return candidates without inserting — client picks
    const shuffled = [...WEEKLY_EVENTS].sort(() => Math.random() - 0.5);
    const candidates = [shuffled[0], shuffled[1]];
    return res.status(200).json({ ok: true, requiresChoice: true, candidates, event: null });
  }

  const event = WEEKLY_EVENTS[Math.floor(Math.random() * WEEKLY_EVENTS.length)];
  await sql`
    INSERT INTO campaign_events (campaign_id, faction, turn, event_id, event_name, event_effect)
    VALUES (${campaignId}, ${faction.trim()}, ${turn}, ${event.id}, ${event.name}, ${event.effect})
    ON CONFLICT (campaign_id, faction, turn) DO UPDATE SET event_id = ${event.id}, event_name = ${event.name}, event_effect = ${event.effect}
  `;
  res.status(200).json({ ok: true, requiresChoice: false, candidates: null, event: { id: event.id, event_name: event.name, event_effect: event.effect } });
}

// Stratagem definitions (supplement-canonical)
const STRATAGEM_DEFS = {
  'fortified-positions': { label: 'Fortified Positions', cost: 2, building: 'construction-center', usable: 'Defender' },
  'blitz':               { label: 'Blitz',               cost: 2, building: 'satlink',             usable: 'Attacker' },
  'jammer':              { label: 'Jammer',               cost: 2, building: 'radio-tower',         usable: 'Both' },
  'artillery-strike':    { label: 'Artillery Strike',     cost: 2, building: 'siege-camp',          usable: 'Both' },
  'nightly-raid':        { label: 'Nightly Raid',         cost: 2, building: 'strategium',          usable: 'Attacker' },
  'spy-network':         { label: 'Spy Network',          cost: 2, building: 'spec-ops-compound',   usable: 'Both' },
  'low-orbital-strike':  { label: 'Low Orbital Strike',   cost: 0, building: null,                  usable: 'Both' },
  'lance-strike':        { label: 'Lance Strike',         cost: 0, building: null,                  usable: 'Both' },
};

/** POST /api/campaign/stratagem-use { campaignId, faction, stratagemKey } → deduct Supply and confirm availability */
async function stratagemUse(req, res, userId) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const { campaignId, faction, stratagemKey } = req.body ?? {};
  if (!Number.isInteger(campaignId) || typeof faction !== 'string' || typeof stratagemKey !== 'string') {
    res.status(400).json({ error: 'campaignId, faction, stratagemKey required' }); return;
  }
  const role = await requireMembership(campaignId, userId);
  if (role !== 'gm') { res.status(403).json({ error: 'Only the GM can use stratagems.' }); return; }

  const strat = STRATAGEM_DEFS[stratagemKey];
  if (!strat) { res.status(400).json({ error: 'Unknown stratagem' }); return; }

  // If stratagem requires a building, verify faction controls a sector with that building
  if (strat.building) {
    const check = await sql`
      SELECT b.id FROM campaign_buildings b
      JOIN campaign_sectors s ON s.id = b.sector_id
      WHERE b.campaign_id = ${campaignId} AND b.building_type = ${strat.building} AND s.owner_faction = ${faction.trim()}
      LIMIT 1
    `;
    if (!check.rows.length) {
      res.status(400).json({ error: `Faction does not control a sector with a ${strat.label} building.` }); return;
    }
  }

  let newSupply = null;
  if (strat.cost > 0) {
    await sql`INSERT INTO campaign_supply (campaign_id, faction, amount) VALUES (${campaignId}, ${faction.trim()}, 0) ON CONFLICT (campaign_id, faction) DO NOTHING`;
    await sql`UPDATE campaign_supply SET amount = GREATEST(0, amount - ${strat.cost}) WHERE campaign_id = ${campaignId} AND faction = ${faction.trim()}`;
    const supplyRow = await sql`SELECT amount FROM campaign_supply WHERE campaign_id = ${campaignId} AND faction = ${faction.trim()}`;
    newSupply = supplyRow.rows[0]?.amount ?? 0;
  }
  res.status(200).json({ ok: true, supplyCostDeducted: strat.cost, newSupply });
}

/** GET /api/campaign/event-list?campaignId=N&faction=X → events visible to this player */
async function eventList(req, res, userId) {
  if (req.method !== 'GET') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const campaignId = Number(req.query.campaignId);
  const faction = req.query.faction ?? '';
  if (!Number.isInteger(campaignId)) { res.status(400).json({ error: 'Missing campaignId' }); return; }
  const role = await requireMembership(campaignId, userId);
  // GMs see all events; players only see their own faction's events
  let result;
  if (role === 'gm') {
    result = await sql`SELECT * FROM campaign_events WHERE campaign_id = ${campaignId} ORDER BY turn DESC, faction ASC`;
  } else {
    const myFaction = await sql`SELECT faction FROM campaign_players WHERE campaign_id = ${campaignId} AND user_id = ${userId}`;
    const f = myFaction.rows[0]?.faction ?? faction;
    result = await sql`SELECT * FROM campaign_events WHERE campaign_id = ${campaignId} AND faction = ${f} ORDER BY turn DESC`;
  }
  res.status(200).json({ ok: true, events: result.rows });
}

/** POST /api/campaign/event-confirm { campaignId, faction, eventId } → GM confirms chosen event (Space Port: pick 1 of 2) */
async function eventConfirm(req, res, userId) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const { campaignId, faction, eventId } = req.body ?? {};
  if (!Number.isInteger(campaignId) || typeof faction !== 'string' || !Number.isInteger(eventId)) {
    res.status(400).json({ error: 'campaignId, faction, eventId required' }); return;
  }
  const role = await requireMembership(campaignId, userId);
  if (role !== 'gm') { res.status(403).json({ error: 'Only the GM can confirm events.' }); return; }

  const event = WEEKLY_EVENTS.find(e => e.id === eventId);
  if (!event) { res.status(400).json({ error: 'Invalid eventId' }); return; }

  const turnRes = await sql`SELECT current_turn FROM campaigns WHERE id = ${campaignId}`;
  const turn = turnRes.rows[0]?.current_turn ?? 1;

  await sql`
    INSERT INTO campaign_events (campaign_id, faction, turn, event_id, event_name, event_effect)
    VALUES (${campaignId}, ${faction.trim()}, ${turn}, ${event.id}, ${event.name}, ${event.effect})
    ON CONFLICT (campaign_id, faction, turn) DO UPDATE SET event_id = ${event.id}, event_name = ${event.name}, event_effect = ${event.effect}
  `;
  res.status(200).json({ ok: true, event: { id: event.id, event_name: event.name, event_effect: event.effect } });
}

/** POST /api/campaign/event-resolve { campaignId, eventId } → GM marks event as resolved */
async function eventResolve(req, res, userId) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const { campaignId, eventId } = req.body ?? {};
  if (!Number.isInteger(campaignId) || !Number.isInteger(eventId)) { res.status(400).json({ error: 'Missing ids' }); return; }
  const role = await requireMembership(campaignId, userId);
  if (role !== 'gm') { res.status(403).json({ error: 'Only the GM can resolve events.' }); return; }
  await sql`UPDATE campaign_events SET resolved = true WHERE id = ${eventId} AND campaign_id = ${campaignId}`;
  res.status(200).json({ ok: true });
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
