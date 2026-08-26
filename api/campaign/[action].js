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
      case 'sector-system': return sectorSetSystem(req, res, userId);
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
      case 'army-list':       return armyList(req, res, userId);
      case 'army-visibility': return armyVisibility(req, res, userId);
      case 'deathstrike-fire': return deathstrikeFire(req, res, userId);
      case 'assassin-use':     return assassinUse(req, res, userId);
      case 'tauva-bonus-draw': return tauvaBonusDraw(req, res, userId);
      case 'tauva-bonus-list': return tauvaBonusList(req, res, userId);
      case 'stratagem-uses':   return stratagemUses(req, res, userId);
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

// Mirrors CampaignMapView.tsx's EDGES (index pairs into DEFAULT_SECTORS / the sector-list array,
// both ordered by id ASC — sectors are only ever created once, in this fixed order, by
// sectorInit, so array-position == DEFAULT_SECTORS index stays valid for the campaign's lifetime).
// Hub (Command Center) connects to all 6 others; the 6 outer sectors form a ring.
const SECTOR_ADJACENCY_EDGES = [
  [0,1],[0,2],[0,3],[0,4],[0,5],[0,6],
  [1,2],[2,3],[3,4],[4,5],[5,6],[6,1],
];

/** Planetary Assault v1.11: "Only adjacent sectors to those the faction already controls can be
 * selected as a target for Skirmishes, Pitched battles and Epic battles" (Kill Team is exempt —
 * "can take place in every sector"). Returns true if targetSectorId is adjacent to (or the same
 * as) a sector attackerFaction currently controls. */
async function isValidAttackTarget(campaignId, targetSectorId, attackerFaction) {
  const rows = await sql`SELECT id, owner_faction FROM campaign_sectors WHERE campaign_id = ${campaignId} ORDER BY id ASC`;
  const idToIndex = new Map(rows.rows.map((r, i) => [r.id, i]));
  const targetIndex = idToIndex.get(targetSectorId);
  if (targetIndex === undefined) return false;
  const controlledIndices = rows.rows
    .filter(r => r.owner_faction === attackerFaction)
    .map(r => idToIndex.get(r.id));
  if (controlledIndices.includes(targetIndex)) return true;
  return SECTOR_ADJACENCY_EDGES.some(([a, b]) => {
    const other = a === targetIndex ? b : (b === targetIndex ? a : null);
    return other !== null && controlledIndices.includes(other);
  });
}

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
  const prior = await sql`SELECT owner_faction FROM campaign_sectors WHERE id = ${sectorId} AND campaign_id = ${campaignId}`;
  // A manual GM override is a settled decision, not a contested one — clears the contested flag
  // and brings the sector's buildings back online, same as an automatic capture would.
  await sql`UPDATE campaign_sectors SET owner_faction = ${owner}, contested = false WHERE id = ${sectorId} AND campaign_id = ${campaignId}`;
  await sql`UPDATE campaign_buildings SET is_active = true WHERE sector_id = ${sectorId} AND campaign_id = ${campaignId}`;
  const campaignTurnRow = await sql`SELECT current_turn FROM campaigns WHERE id = ${campaignId}`;
  const campaignEnded = await checkHqLoss(campaignId, sectorId, prior.rows[0]?.owner_faction ?? null, owner, campaignTurnRow.rows[0]?.current_turn ?? 1);
  res.status(200).json({ ok: true, campaignEnded });
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
  const { current_turn, factions, max_turns, sectors_to_win } = result.rows[0];

  // Credit supply by sector type: city=3, industrial=2, wasteland/ruin=1.
  // NOT FROM THE DOC — v1.11 says only "Supplies get collected" in the War Report phase and never
  // states a formula (checked 2026-08-23, pre-existing from an earlier session). Kept as-is since
  // the campaign needs SOME Supply income to function and this has been live; flagged here rather
  // than presented as a quoted rule. Worth confirming the real formula with the creator.
  // Contested sectors are excluded regardless — "neither faction will be able to make use of the
  // sector's resources" (v1.11) is explicit about that part.
  const SUPPLY_BY_TYPE = { city: 3, industrial: 2, wasteland: 1, ruin: 1 };
  const sectorCounts = await sql`
    SELECT owner_faction, sector_type, COUNT(*)::int AS cnt
    FROM campaign_sectors
    WHERE campaign_id = ${campaignId} AND owner_faction IS NOT NULL AND contested = false
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

  // Contested sectors don't count toward anyone's total — same "can't make use of it" reasoning
  // as the Supply exclusion above. Systems layer: victory counts CAPITAL sectors, not raw ones —
  // a sector with no system_name counts as its own singleton system (so `sectors_to_win`/tiebreak
  // still read as a plain sector count for every campaign that has never assigned a system, which
  // is all of them before this feature existed and any that never use it going forward). Inlined
  // in both queries rather than a shared fragment — @vercel/postgres's `sql` tag doesn't support
  // composing a sub-fragment into another tagged query.
  if (sectors_to_win > 0) {
    const leaders = await sql`
      SELECT owner_faction, COUNT(*)::int AS cnt
      FROM campaign_sectors
      WHERE campaign_id = ${campaignId} AND owner_faction IS NOT NULL AND contested = false
        AND (is_capital = true OR system_name IS NULL OR system_name = '')
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
      WHERE campaign_id = ${campaignId} AND owner_faction IS NOT NULL AND contested = false
        AND (is_capital = true OR system_name IS NULL OR system_name = '')
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

/** POST /api/campaign/sector-system { campaignId, sectorId, systemName, isCapital } -> GM groups
 *  a sector into a "system" and optionally flags it as that system's capital. System owner =
 *  capital owner (turnAdvance's victory check reads is_capital, not raw sector ownership) — see
 *  the systems-layer migration comment in _lib/db.js for the full design. */
async function sectorSetSystem(req, res, userId) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const { campaignId, sectorId, systemName, isCapital } = req.body ?? {};
  if (!Number.isInteger(campaignId) || !Number.isInteger(sectorId)) { res.status(400).json({ error: 'Missing campaignId or sectorId' }); return; }
  const role = await requireMembership(campaignId, userId);
  if (role !== 'gm') { res.status(403).json({ error: 'Only the GM can assign systems.' }); return; }
  const name = typeof systemName === 'string' && systemName.trim() ? systemName.trim() : null;
  const capital = !!isCapital;
  // One capital per system: clear any other sector already flagged capital in the SAME system
  // before setting this one, so the rule holds without a DB constraint (system_name isn't unique).
  if (capital && name) {
    await sql`UPDATE campaign_sectors SET is_capital = false WHERE campaign_id = ${campaignId} AND system_name = ${name} AND id != ${sectorId}`;
  }
  await sql`UPDATE campaign_sectors SET system_name = ${name}, is_capital = ${capital} WHERE id = ${sectorId} AND campaign_id = ${campaignId}`;
  const result = await sql`SELECT * FROM campaign_sectors WHERE campaign_id = ${campaignId} ORDER BY id ASC`;
  res.status(200).json({ ok: true, sectors: result.rows });
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
// Planning phase (v1.11): "Select up to 1 sector for an Epic battle / up to 2 for a Pitched
// battle / up to 3 for Skirmishes / up to 3 for Kill Teams" — a per-ATTACKER, per-round cap
// across however many sectors/battles of that type they log, not a per-sector limit.
const PLANNING_PHASE_CAPS = { 'kill-team': 3, skirmish: 3, pitched: 2, epic: 1 };

/** POST /api/campaign/battle-log { campaignId, attackerFaction, defenderFaction, winnerFaction,
 *  engagementType?, sectorId?, notes? }
 *  GM logs a battle. Auto-deducts attacker Supply by engagement type. On a win with a sector:
 *  Kill Team has no automatic sector effect (v1.11: "Varies" — GM narrates it via notes).
 *  Skirmish contests an uncontested sector, or captures (no building loss) an already-contested
 *  one. Pitched captures and destroys 1 random building. Epic captures and destroys every
 *  building. Capturing ends the campaign for whichever faction just lost their HQ's sector. */
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

  const alreadyThisRound = await sql`
    SELECT COUNT(*)::int AS cnt FROM campaign_battles
    WHERE campaign_id = ${campaignId} AND turn = ${turn} AND attacker_faction = ${attackerFaction.trim()} AND engagement_type = ${engType}
  `;
  const cap = PLANNING_PHASE_CAPS[engType];
  if (alreadyThisRound.rows[0].cnt >= cap) {
    res.status(409).json({ error: `${attackerFaction.trim()} already staged ${cap} ${engType} engagement${cap > 1 ? 's' : ''} this round (Planning phase limit).` });
    return;
  }

  // "Only adjacent sectors to those the faction already controls can be selected as a target" —
  // Kill Team is explicitly exempt ("can take place in every sector"); a battle logged without a
  // specific sector (narrative-only) has nothing to check.
  if (sid && engType !== 'kill-team') {
    const valid = await isValidAttackTarget(campaignId, sid, attackerFaction.trim());
    if (!valid) {
      res.status(400).json({ error: `${attackerFaction.trim()} does not control a sector adjacent to this target — pick an adjacent sector or claim territory first.` });
      return;
    }
  }

  const inserted = await sql`
    INSERT INTO campaign_battles (campaign_id, turn, attacker_faction, defender_faction, winner_faction, engagement_type, sector_id, notes)
    VALUES (${campaignId}, ${turn}, ${attackerFaction.trim()}, ${defenderFaction.trim()}, ${winner}, ${engType}, ${sid}, ${noteText})
    RETURNING id
  `;

  let campaignEnded = false;
  if (sid && winner && engType !== 'kill-team') {
    const sectorRow = await sql`SELECT owner_faction, contested FROM campaign_sectors WHERE id = ${sid} AND campaign_id = ${campaignId}`;
    const prior = sectorRow.rows[0];
    if (prior) {
      const wasContested = prior.contested;
      if (engType === 'skirmish' && !wasContested) {
        // First Skirmish over an uncontested sector: contests it, ownership unchanged, its
        // buildings go dormant ("neither faction will be able to make use of the sector's
        // resources or buildings").
        await sql`UPDATE campaign_sectors SET contested = true WHERE id = ${sid} AND campaign_id = ${campaignId}`;
        await sql`UPDATE campaign_buildings SET is_active = false WHERE sector_id = ${sid} AND campaign_id = ${campaignId}`;
      } else {
        // Capture: Skirmish/Pitched/Epic winning an already-contested sector, or Pitched/Epic
        // winning an uncontested one outright.
        await sql`UPDATE campaign_sectors SET owner_faction = ${winner}, contested = false WHERE id = ${sid} AND campaign_id = ${campaignId}`;
        const survivors = await sql`SELECT id FROM campaign_buildings WHERE sector_id = ${sid} AND campaign_id = ${campaignId}`;
        if (engType === 'pitched' && survivors.rows.length) {
          const pick = survivors.rows[Math.floor(Math.random() * survivors.rows.length)];
          await destroyBuilding(campaignId, pick.id);
        } else if (engType === 'epic') {
          for (const b of survivors.rows) await destroyBuilding(campaignId, b.id);
        } else {
          // Skirmish capture destroys nothing — buildings just come back online.
          await sql`UPDATE campaign_buildings SET is_active = true WHERE sector_id = ${sid} AND campaign_id = ${campaignId}`;
        }
        campaignEnded = await checkHqLoss(campaignId, sid, prior.owner_faction, winner, turn);
      }
    }
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

  res.status(200).json({ ok: true, battleId: inserted.rows[0].id, supplyCostDeducted: cost, campaignEnded });
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
    SELECT id, faction, unit_name, unit_slot, xp, wounds, status, notes, trait, equipment_limit, epic_veteran, created_at
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
    RETURNING id, faction, unit_name, unit_slot, xp, wounds, status, notes, trait, equipment_limit, epic_veteran, created_at
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
  const { trait, equipmentLimit, epicVeteran } = req.body ?? {};
  const newTrait  = trait === null ? null : (typeof trait === 'string' && trait.trim() ? trait.trim() : row.trait ?? null);
  // Character models (HQ) don't pick an Infantry/MC/Vehicle trait at all (v1.11) — they get their
  // own equipment-limit upgrade instead (below). A trait request on one is a client bug, not a
  // silent no-op — better to fail loudly than have the picker quietly do nothing.
  if (newTrait && row.unit_slot === 'HQ') {
    res.status(400).json({ error: 'Character models (HQ) don\'t take a Trait — use the equipment limit upgrade instead.' }); return;
  }
  const newEquipLimit = Number.isInteger(equipmentLimit) ? Math.max(0, equipmentLimit) : row.equipment_limit;
  const newEpicVeteran = typeof epicVeteran === 'boolean' ? epicVeteran : row.epic_veteran;

  // Deduct trait upgrade cost when first assigning a trait (Infantry=2⊗, MC/Vehicle=4⊗). Also
  // enforce the Reinforcement phase rule (v1.11): the faction must control the granting building
  // (Barracks for non-vehicle, AdMech Forge for MC/Vehicle) and stay within its per-round cap
  // (2 non-vehicle units per Barracks, 1 MC/Vehicle per Forge, each additional building adding
  // more). "Vehicle-tier" reuses the same FOC-slot heuristic the cost split already relied on —
  // the campaign roster only stores a slot, not a real unit-type, so a Terminator in Elites still
  // reads as vehicle-tier here, same approximation as before.
  let traitCostDeducted = 0;
  const isFirstTrait = newTrait && !row.trait;
  if (isFirstTrait) {
    const VEHICLE_TIER_SLOTS = ['Heavy Support', 'Dedicated Transport', 'Flyers', 'Lords of War', 'Elites'];
    const slot = row.unit_slot ?? '';
    const isVehicleTier = VEHICLE_TIER_SLOTS.includes(slot);
    const requiredBuilding = isVehicleTier ? 'admech-forge' : 'barracks';
    const grantPerBuilding = isVehicleTier ? 1 : 2;
    const traitCost = isVehicleTier ? 4 : 2;

    const campaignRow = await sql`SELECT current_turn FROM campaigns WHERE id = ${campaignId}`;
    const currentTurn = campaignRow.rows[0].current_turn;
    const ownedBuildings = await sql`
      SELECT COUNT(*)::int AS cnt FROM campaign_buildings b
      JOIN campaign_sectors s ON s.id = b.sector_id
      WHERE b.campaign_id = ${campaignId} AND b.building_type = ${requiredBuilding}
        AND s.owner_faction = ${row.faction} AND b.is_active = true AND b.available_from_turn <= ${currentTurn}
    `;
    const buildingCount = ownedBuildings.rows[0].cnt;
    if (buildingCount === 0) {
      res.status(400).json({ error: `${row.faction} does not control an operational ${isVehicleTier ? 'AdMech Forge' : 'Barracks'} — cannot upgrade this unit.` }); return;
    }

    const usedRows = await sql`
      SELECT unit_slot FROM campaign_roster
      WHERE campaign_id = ${campaignId} AND faction = ${row.faction} AND trait_assigned_turn = ${currentTurn}
    `;
    const usedThisTier = usedRows.rows.filter(r => VEHICLE_TIER_SLOTS.includes(r.unit_slot ?? '') === isVehicleTier).length;
    const cap = buildingCount * grantPerBuilding;
    if (usedThisTier >= cap) {
      res.status(409).json({ error: `${row.faction} has already used all ${cap} ${isVehicleTier ? 'MC/Vehicle' : 'non-vehicle'} upgrade slot(s) this round.` }); return;
    }

    traitCostDeducted = traitCost;
    await sql`INSERT INTO campaign_supply (campaign_id, faction, amount) VALUES (${campaignId}, ${row.faction}, 0) ON CONFLICT (campaign_id, faction) DO NOTHING`;
    await sql`UPDATE campaign_supply SET amount = GREATEST(0, amount - ${traitCost}) WHERE campaign_id = ${campaignId} AND faction = ${row.faction}`;
    await sql`
      UPDATE campaign_roster
      SET xp = ${newXp}, wounds = ${newWounds}, status = ${newStatus}, notes = ${newNotes}, unit_name = ${newName}, trait = ${newTrait}, trait_assigned_turn = ${currentTurn},
          equipment_limit = ${newEquipLimit}, epic_veteran = ${newEpicVeteran}
      WHERE id = ${unitId} AND campaign_id = ${campaignId}
    `;
  } else {
    await sql`
      UPDATE campaign_roster
      SET xp = ${newXp}, wounds = ${newWounds}, status = ${newStatus}, notes = ${newNotes}, unit_name = ${newName}, trait = ${newTrait},
          equipment_limit = ${newEquipLimit}, epic_veteran = ${newEpicVeteran}
      WHERE id = ${unitId} AND campaign_id = ${campaignId}
    `;
  }
  const updated = await sql`SELECT id, faction, unit_name, unit_slot, xp, wounds, status, notes, trait, equipment_limit, epic_veteran FROM campaign_roster WHERE id = ${unitId}`;
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
  'research-facility': { label: 'Research Facility',         cost: 3, upgradeable: true,  effect: 'Unlock 1 bonus Army Trait ("Features of..") per round (Lv2: 2 per round)' },
  'satlink':           { label: 'Satlink',                   cost: 2, upgradeable: true,  effect: 'Unlocks Blitz Stratagem (Lv2: +1 reinforcement unit per turn)' },
  'sacrifice-altar':   { label: 'Sacrifice Altar',           cost: 8, upgradeable: false, effect: 'Demon weapon (up to 15pts, escalating). Chaos only' },
  'siege-camp':        { label: 'Siege Camp',                cost: 2, upgradeable: true,  effect: 'Unlocks Artillery Strike Stratagem (Lv2: trigger on 4+)' },
  'space-port':        { label: 'Space Port',                cost: 0, upgradeable: false, effect: 'Draw 2 weekly event cards, pick 1. Unique — cannot be rebuilt' },
  'spec-ops-compound': { label: 'Spec Ops Compound',         cost: 2, upgradeable: true,  effect: 'Unlocks Spy Network Stratagem (Lv2: +1/-1 additional modifier)' },
  'strategium':        { label: 'Strategium',                cost: 2, upgradeable: false, effect: 'Unlocks Nightly Raid Stratagem' },
  'tauva-center':      { label: "Tau'va Unification Center", cost: 6, upgradeable: false, effect: '+1 positive weekly event per round. Tau only' },
  'void-shields':      { label: 'Void Shields',              cost: 4, upgradeable: false, effect: 'Sector immune to Deathstrike Silo attacks' },
};

// Planetary Assault v1.11: these read "Can only have one X at a time" (or carry the "(unique)"
// tag alongside a "-" construction cost and "if destroyed, can't be rebuilt"). Scoped per
// FACTION, not per campaign — every faction independently gets its own single HQ/Assassin
// Temple/etc, same as every faction needs its own leader.
const UNIQUE_BUILDINGS = new Set([
  'hq', 'assassin-temple', 'sacrifice-altar', 'tauva-center', 'pdc', 'plasteel-refinery', 'space-port',
]);
// The three "(unique)" buildings additionally can never be rebuilt once destroyed, for the rest
// of the campaign (tracked in campaign_destroyed_uniques).
const PERMANENT_LOSS_BUILDINGS = new Set(['pdc', 'plasteel-refinery', 'space-port']);

// v1.11: "Only available for the Imperium/Chaos/Tau faction." Campaign factions are free-text,
// GM-chosen names (doc's own examples: "Chaos", "Imperium", "Renegades" — not army-builder faction
// keys), so this is a case-insensitive substring match against the sector's controlling faction
// name rather than a fixed enum. A couple of common spelling variants are included; anything more
// exotic a GM names their side is a call for them, not something to hardcode further.
const FACTION_RESTRICTED_BUILDINGS = {
  'assassin-temple': ['imperium'],
  'sacrifice-altar': ['chaos'],
  'tauva-center':    ['tau', "t'au"],
};

/** Construction/upgrade cost modifier from an active Corruption(+2)/Streamlined Bureaucracy(-1)
 * weekly event for this faction this round (Planetary Assault v1.11, events #6 and #16). */
async function constructionCostDelta(campaignId, faction, currentTurn) {
  const r = await sql`
    SELECT event_id FROM campaign_events
    WHERE campaign_id = ${campaignId} AND faction = ${faction} AND turn = ${currentTurn}
      AND event_id IN (6, 16)
  `;
  if (!r.rows.length) return 0;
  return r.rows[0].event_id === 6 ? 2 : -1;
}

/** Headquarter rule (Planetary Assault v1.11): "If control over the sector with this building is
 * lost, the faction loses the campaign." Call AFTER a sector's owner_faction has changed, with
 * the owner as it was immediately before. Ends the campaign if that prior owner had an OPERATIONAL
 * HQ there (still-under-construction doesn't count — "constructions... take one campaign round to
 * finish", same as every other building effect). With more than 2 factions the doc doesn't say
 * who "wins" — crediting the new controller is the direct 2-faction reading and the least
 * arbitrary choice for N>2. */
async function checkHqLoss(campaignId, sectorId, priorOwnerFaction, newOwnerFaction, currentTurn) {
  if (!priorOwnerFaction || priorOwnerFaction === newOwnerFaction) return false;
  const hq = await sql`
    SELECT id FROM campaign_buildings
    WHERE sector_id = ${sectorId} AND campaign_id = ${campaignId} AND building_type = 'hq'
      AND is_active = true AND available_from_turn <= ${currentTurn}
    LIMIT 1
  `;
  if (!hq.rows.length) return false;
  await sql`UPDATE campaigns SET status = 'finished', winner_faction = ${newOwnerFaction} WHERE id = ${campaignId} AND status = 'active'`;
  return true;
}

/** GET /api/campaign/building-list?campaignId=N */
async function buildingList(req, res, userId) {
  if (req.method !== 'GET') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const campaignId = Number(req.query.campaignId);
  if (!Number.isInteger(campaignId)) { res.status(400).json({ error: 'Missing campaignId' }); return; }
  await requireMembership(campaignId, userId);
  const campaignRow = await sql`SELECT current_turn FROM campaigns WHERE id = ${campaignId}`;
  const result = await sql`
    SELECT b.id, b.campaign_id, b.sector_id, b.building_type, b.level, b.is_active, b.available_from_turn, b.level2_from_turn, b.created_at,
           s.name AS sector_name, s.owner_faction
    FROM campaign_buildings b
    JOIN campaign_sectors s ON s.id = b.sector_id
    WHERE b.campaign_id = ${campaignId}
    ORDER BY s.name ASC, b.created_at ASC
  `;
  res.status(200).json({ ok: true, buildings: result.rows, currentTurn: campaignRow.rows[0]?.current_turn ?? 1 });
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

  // "Only available for the Imperium/Chaos/Tau faction."
  const requiredAliases = FACTION_RESTRICTED_BUILDINGS[buildingType];
  if (requiredAliases) {
    const ownerLower = ownerFaction.toLowerCase();
    if (!requiredAliases.some(alias => ownerLower.includes(alias))) {
      res.status(400).json({ error: `${BUILDING_DEFS[buildingType].label} is only available to a faction aligned with ${requiredAliases[0]}.` }); return;
    }
  }

  // "Can only have one X at a time" — one per faction, across all their controlled sectors.
  if (UNIQUE_BUILDINGS.has(buildingType)) {
    const dupe = await sql`
      SELECT b.id FROM campaign_buildings b
      JOIN campaign_sectors s ON s.id = b.sector_id
      WHERE b.campaign_id = ${campaignId} AND b.building_type = ${buildingType} AND s.owner_faction = ${ownerFaction}
      LIMIT 1
    `;
    if (dupe.rows.length) {
      res.status(409).json({ error: `${ownerFaction} already has a ${BUILDING_DEFS[buildingType].label} — only one at a time.` }); return;
    }
  }
  // The 3 "(unique)" buildings can never be rebuilt once destroyed, for the rest of the campaign.
  if (PERMANENT_LOSS_BUILDINGS.has(buildingType)) {
    const lost = await sql`
      SELECT 1 FROM campaign_destroyed_uniques
      WHERE campaign_id = ${campaignId} AND faction = ${ownerFaction} AND building_type = ${buildingType}
    `;
    if (lost.rows.length) {
      res.status(409).json({ error: `${BUILDING_DEFS[buildingType].label} was destroyed and can't be rebuilt for the rest of the campaign.` }); return;
    }
  }

  // Deduct supply cost from owning faction (cost-0 buildings: PDC, Plasteel, Space Port skip),
  // adjusted by an active Corruption/Streamlined Bureaucracy event this round.
  const campaignTurn = await sql`SELECT current_turn FROM campaigns WHERE id = ${campaignId}`;
  const delta = await constructionCostDelta(campaignId, ownerFaction, campaignTurn.rows[0].current_turn);
  const buildCost = Math.max(0, BUILDING_DEFS[buildingType].cost + (BUILDING_DEFS[buildingType].cost > 0 ? delta : 0));
  if (buildCost > 0) {
    await sql`INSERT INTO campaign_supply (campaign_id, faction, amount) VALUES (${campaignId}, ${ownerFaction}, 0) ON CONFLICT (campaign_id, faction) DO NOTHING`;
    await sql`UPDATE campaign_supply SET amount = GREATEST(0, amount - ${buildCost}) WHERE campaign_id = ${campaignId} AND faction = ${ownerFaction}`;
  }

  // "Constructions... take one campaign round to finish" (v1.11) — not operational until next round.
  const inserted = await sql`
    INSERT INTO campaign_buildings (campaign_id, sector_id, building_type, level, is_active, available_from_turn)
    VALUES (${campaignId}, ${sectorId}, ${buildingType}, 1, true, ${campaignTurn.rows[0].current_turn + 1})
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

  const sectorRow = await sql`SELECT owner_faction FROM campaign_sectors WHERE id = ${building.sector_id} AND campaign_id = ${campaignId}`;
  const upgradeOwner = sectorRow.rows[0]?.owner_faction;
  const campaignTurn = await sql`SELECT current_turn FROM campaigns WHERE id = ${campaignId}`;
  const currentTurn = campaignTurn.rows[0].current_turn;
  // Can't upgrade a building that's itself still under construction — its own first round hasn't
  // finished yet.
  if (building.available_from_turn > currentTurn) {
    res.status(400).json({ error: 'This building is still under construction and can\'t be upgraded yet.' }); return;
  }

  // Deduct upgrade cost (same as construction cost) from sector's owner faction, adjusted by an
  // active Corruption/Streamlined Bureaucracy event this round.
  const delta = upgradeOwner ? await constructionCostDelta(campaignId, upgradeOwner, currentTurn) : 0;
  const upgradeCost = Math.max(0, def.cost + delta);
  if (upgradeOwner && upgradeCost > 0) {
    await sql`INSERT INTO campaign_supply (campaign_id, faction, amount) VALUES (${campaignId}, ${upgradeOwner}, 0) ON CONFLICT (campaign_id, faction) DO NOTHING`;
    await sql`UPDATE campaign_supply SET amount = GREATEST(0, amount - ${upgradeCost}) WHERE campaign_id = ${campaignId} AND faction = ${upgradeOwner}`;
  }
  // "Constructions and upgrades take one campaign round to finish" — the level-2 benefit isn't
  // recognised until next round (level2_from_turn), but available_from_turn is deliberately left
  // untouched: the building's existing level-1 effect must keep working while the upgrade pends.
  await sql`UPDATE campaign_buildings SET level = 2, level2_from_turn = ${currentTurn + 1} WHERE id = ${buildingId}`;
  res.status(200).json({ ok: true, supplyCostDeducted: upgradeCost });
}

/** Shared by the manual "remove building" GM action and the automatic Pitched/Epic
 * capture-destroys-buildings result — keeps outpost-slot bookkeeping and permanent-loss
 * tracking consistent between both paths. Returns the deleted row's info, or null if not found. */
async function destroyBuilding(campaignId, buildingId) {
  const row = await sql`
    SELECT b.sector_id, b.building_type, s.owner_faction
    FROM campaign_buildings b JOIN campaign_sectors s ON s.id = b.sector_id
    WHERE b.id = ${buildingId} AND b.campaign_id = ${campaignId}
  `;
  if (!row.rows.length) return null;
  const { sector_id, building_type, owner_faction } = row.rows[0];

  if (building_type === 'outpost') {
    await sql`UPDATE campaign_sectors SET building_slots = GREATEST(1, building_slots - 1) WHERE id = ${sector_id}`;
  }
  if (PERMANENT_LOSS_BUILDINGS.has(building_type) && owner_faction) {
    await sql`
      INSERT INTO campaign_destroyed_uniques (campaign_id, faction, building_type)
      VALUES (${campaignId}, ${owner_faction}, ${building_type})
      ON CONFLICT DO NOTHING
    `;
  }
  await sql`DELETE FROM campaign_buildings WHERE id = ${buildingId} AND campaign_id = ${campaignId}`;
  return { sector_id, building_type, owner_faction };
}

/** POST /api/campaign/building-remove { campaignId, buildingId } → GM destroys/removes a building */
async function buildingRemove(req, res, userId) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const { campaignId, buildingId } = req.body ?? {};
  if (!Number.isInteger(campaignId) || !Number.isInteger(buildingId)) { res.status(400).json({ error: 'Missing campaignId or buildingId' }); return; }
  const role = await requireMembership(campaignId, userId);
  if (role !== 'gm') { res.status(403).json({ error: 'Only the GM can remove buildings.' }); return; }

  const destroyed = await destroyBuilding(campaignId, buildingId);
  if (!destroyed) { res.status(404).json({ error: 'Building not found' }); return; }
  res.status(200).json({ ok: true });
}

/** POST /api/campaign/deathstrike-fire { campaignId, buildingId, targetSectorId } → GM fires an
 * operational Deathstrike Silo (v1.11): "Once per campaign round... select any sector on the
 * campaign map and roll 1D6. On a 5+ a random building in that sector is destroyed." Each silo
 * can fire once per round (reuses campaign_stratagem_uses with a synthetic key, same "once per
 * building per round" shape the Stratagems already use). Void Shields make a sector immune. */
async function deathstrikeFire(req, res, userId) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const { campaignId, buildingId, targetSectorId } = req.body ?? {};
  if (!Number.isInteger(campaignId) || !Number.isInteger(buildingId) || !Number.isInteger(targetSectorId)) {
    res.status(400).json({ error: 'campaignId, buildingId, targetSectorId required' }); return;
  }
  const role = await requireMembership(campaignId, userId);
  if (role !== 'gm') { res.status(403).json({ error: 'Only the GM can fire a Deathstrike Silo.' }); return; }

  const turnRes = await sql`SELECT current_turn FROM campaigns WHERE id = ${campaignId}`;
  const turn = turnRes.rows[0]?.current_turn ?? 1;

  const siloRow = await sql`
    SELECT b.id, s.owner_faction FROM campaign_buildings b
    JOIN campaign_sectors s ON s.id = b.sector_id
    WHERE b.id = ${buildingId} AND b.campaign_id = ${campaignId} AND b.building_type = 'deathstrike-silo'
      AND b.available_from_turn <= ${turn}
  `;
  if (!siloRow.rows.length) { res.status(404).json({ error: 'Operational Deathstrike Silo not found.' }); return; }
  const faction = siloRow.rows[0].owner_faction;

  const usedKey = `deathstrike-silo-${buildingId}`;
  const usedRes = await sql`
    SELECT COUNT(*)::int AS cnt FROM campaign_stratagem_uses
    WHERE campaign_id = ${campaignId} AND faction = ${faction} AND turn = ${turn} AND stratagem_key = ${usedKey}
  `;
  if (usedRes.rows[0].cnt > 0) { res.status(409).json({ error: 'This Deathstrike Silo has already fired this round.' }); return; }

  const targetSector = await sql`SELECT id FROM campaign_sectors WHERE id = ${targetSectorId} AND campaign_id = ${campaignId}`;
  if (!targetSector.rows.length) { res.status(404).json({ error: 'Target sector not found.' }); return; }
  const voidShielded = await sql`
    SELECT 1 FROM campaign_buildings
    WHERE sector_id = ${targetSectorId} AND campaign_id = ${campaignId} AND building_type = 'void-shields' AND is_active = true
  `;
  if (voidShielded.rows.length) { res.status(400).json({ error: 'Target sector is protected by Void Shields.' }); return; }

  await sql`INSERT INTO campaign_stratagem_uses (campaign_id, faction, turn, stratagem_key) VALUES (${campaignId}, ${faction}, ${turn}, ${usedKey})`;

  const roll = Math.floor(Math.random() * 6) + 1;
  let destroyedBuilding = null;
  if (roll >= 5) {
    const candidates = await sql`SELECT id, building_type FROM campaign_buildings WHERE sector_id = ${targetSectorId} AND campaign_id = ${campaignId}`;
    if (candidates.rows.length) {
      const pick = candidates.rows[Math.floor(Math.random() * candidates.rows.length)];
      await destroyBuilding(campaignId, pick.id);
      destroyedBuilding = pick.building_type;
    }
  }
  res.status(200).json({ ok: true, roll, destroyedBuilding });
}

// The 4 named units of codex Assassins (Assassins ENG.ods, one sheet each) — a fixed list, same
// shape as WEEKLY_EVENTS/STRATAGEM_DEFS being hardcoded reference data rather than pulled live
// from the army-builder engine (this building just tracks WHICH one was fielded, it doesn't touch
// list validation).
const ASSASSIN_DEFS = {
  callidus:  { label: 'Callidus',  pts: 142 },
  culexus:   { label: 'Culexus',   pts: 181 },
  eversor:   { label: 'Eversor',   pts: 125 },
  vindicare: { label: 'Vindicare', pts: 189 },
};

/** POST /api/campaign/assassin-use { campaignId, assassinKey } → GM records an Assassin Temple
 * fielding (v1.11): "field a single unit from codex Assassins... for up to 4 engagements (Pitched
 * battles and Epic battles only) per campaign round. The same Assassin can't be selected multiple
 * times per round." Reuses campaign_stratagem_uses with a synthetic key, same pattern as the
 * Deathstrike Silo. */
async function assassinUse(req, res, userId) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const { campaignId, assassinKey } = req.body ?? {};
  if (!Number.isInteger(campaignId) || !ASSASSIN_DEFS[assassinKey]) {
    res.status(400).json({ error: 'campaignId and a valid assassinKey required' }); return;
  }
  const role = await requireMembership(campaignId, userId);
  if (role !== 'gm') { res.status(403).json({ error: 'Only the GM can record an Assassin fielding.' }); return; }

  const turnRes = await sql`SELECT current_turn FROM campaigns WHERE id = ${campaignId}`;
  const turn = turnRes.rows[0]?.current_turn ?? 1;

  const templeRow = await sql`
    SELECT s.owner_faction FROM campaign_buildings b
    JOIN campaign_sectors s ON s.id = b.sector_id
    WHERE b.campaign_id = ${campaignId} AND b.building_type = 'assassin-temple' AND b.available_from_turn <= ${turn}
    LIMIT 1
  `;
  if (!templeRow.rows.length) { res.status(400).json({ error: 'No faction controls an operational Assassin Temple.' }); return; }
  const faction = templeRow.rows[0].owner_faction;

  const usedThisAssassinKey = `assassin-${assassinKey}`;
  const alreadyThisOne = await sql`
    SELECT 1 FROM campaign_stratagem_uses
    WHERE campaign_id = ${campaignId} AND faction = ${faction} AND turn = ${turn} AND stratagem_key = ${usedThisAssassinKey}
  `;
  if (alreadyThisOne.rows.length) { res.status(409).json({ error: `${ASSASSIN_DEFS[assassinKey].label} was already fielded this round — the same Assassin can't be selected twice.` }); return; }

  const totalThisRound = await sql`
    SELECT COUNT(*)::int AS cnt FROM campaign_stratagem_uses
    WHERE campaign_id = ${campaignId} AND faction = ${faction} AND turn = ${turn} AND stratagem_key LIKE 'assassin-%'
  `;
  if (totalThisRound.rows[0].cnt >= 4) { res.status(409).json({ error: `${faction} has already fielded 4 Assassins this round (the maximum).` }); return; }

  await sql`INSERT INTO campaign_stratagem_uses (campaign_id, faction, turn, stratagem_key) VALUES (${campaignId}, ${faction}, ${turn}, ${usedThisAssassinKey})`;
  res.status(200).json({ ok: true, assassin: assassinKey, faction });
}

// ── Weekly events ────────────────────────────────────────────────────────────

const WEEKLY_EVENTS = [
  { id: 1,  name: 'Asset',                   effect: 'Kill Team mission difficulty −1 this round' },
  { id: 2,  name: 'Blackstone Mine',          effect: '+1 Supply permanently to a random sector under your control' },
  { id: 3,  name: 'Blessing of Machine God',  effect: 'Upgrade 1 Vehicle unit for free this round' },
  { id: 4,  name: 'Breakthrough!',            effect: 'Gain one bonus Army Trait ("Features of..") of your choice' },
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

// Tau'va Unification Center draws from "positive" effects only — the doc never tags which of the
// 18 events count as positive, so this is an interpretation of each event's own plain-English
// effect (unambiguously beneficial to the drawing faction), not a quoted rule. Corruption/Gather
// Your Forces/Low Funding/Rebellion!/Scrambled Communications read as negative; Calm Before the
// Storm ("nothing happens") is excluded as neutral rather than assumed positive. Worth confirming
// with the creator if this ever becomes contentious at the table.
const POSITIVE_WEEKLY_EVENT_IDS = [1, 2, 3, 4, 8, 9, 11, 14, 15, 16, 17, 18];

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
      AND b.available_from_turn <= ${turn}
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

  const turnRes = await sql`SELECT current_turn FROM campaigns WHERE id = ${campaignId}`;
  const turn = turnRes.rows[0]?.current_turn ?? 1;
  const f = faction.trim();

  // If stratagem requires a building, verify the faction controls at least one OPERATIONAL sector
  // with it ("constructions take one campaign round to finish"), and enforce the doc's actual cap:
  // "Stratagems are available once per (controlled) related building per campaign round" — 2 Siege
  // Camps means Artillery Strike twice a round, not once total.
  if (strat.building) {
    const owned = await sql`
      SELECT COUNT(*)::int AS cnt FROM campaign_buildings b
      JOIN campaign_sectors s ON s.id = b.sector_id
      WHERE b.campaign_id = ${campaignId} AND b.building_type = ${strat.building} AND s.owner_faction = ${f}
        AND b.available_from_turn <= ${turn}
    `;
    const buildingCount = owned.rows[0].cnt;
    if (buildingCount === 0) {
      res.status(400).json({ error: `Faction does not control an operational sector with a ${strat.label} building.` }); return;
    }
    const usedRes = await sql`
      SELECT COUNT(*)::int AS cnt FROM campaign_stratagem_uses
      WHERE campaign_id = ${campaignId} AND faction = ${f} AND turn = ${turn} AND stratagem_key = ${stratagemKey}
    `;
    if (usedRes.rows[0].cnt >= buildingCount) {
      res.status(409).json({ error: `${f} has already used ${strat.label} ${buildingCount} time${buildingCount > 1 ? 's' : ''} this round (one per ${strat.building.replace(/-/g, ' ')}).` }); return;
    }
  }

  // Lance strike (Planetary Assault v1.11) is not a standing free stratagem like Low Orbital
  // Strike — it's granted only "for one engagement" by the Void Supremacy weekly event (#18).
  // Consume that grant: it must exist, unresolved, for this faction this round, and using the
  // stratagem marks it resolved so it can't be reused.
  if (stratagemKey === 'lance-strike') {
    const grant = await sql`
      SELECT id FROM campaign_events
      WHERE campaign_id = ${campaignId} AND faction = ${f} AND turn = ${turn}
        AND event_id = 18 AND resolved = false
    `;
    if (!grant.rows.length) {
      res.status(400).json({ error: 'Faction has not gained access to Lance Strike this round (requires the Void Supremacy event).' }); return;
    }
    await sql`UPDATE campaign_events SET resolved = true WHERE id = ${grant.rows[0].id}`;
  }

  let newSupply = null;
  if (strat.cost > 0) {
    await sql`INSERT INTO campaign_supply (campaign_id, faction, amount) VALUES (${campaignId}, ${f}, 0) ON CONFLICT (campaign_id, faction) DO NOTHING`;
    await sql`UPDATE campaign_supply SET amount = GREATEST(0, amount - ${strat.cost}) WHERE campaign_id = ${campaignId} AND faction = ${f}`;
    const supplyRow = await sql`SELECT amount FROM campaign_supply WHERE campaign_id = ${campaignId} AND faction = ${f}`;
    newSupply = supplyRow.rows[0]?.amount ?? 0;
  }
  await sql`INSERT INTO campaign_stratagem_uses (campaign_id, faction, turn, stratagem_key) VALUES (${campaignId}, ${f}, ${turn}, ${stratagemKey})`;
  res.status(200).json({ ok: true, supplyCostDeducted: strat.cost, newSupply });
}

/** GET /api/campaign/stratagem-uses?campaignId=N → this round's usage rows (faction, stratagem_key),
 * for the client to compute "X of Y uses left" against each stratagem's building count. */
async function stratagemUses(req, res, userId) {
  if (req.method !== 'GET') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const campaignId = Number(req.query.campaignId);
  if (!Number.isInteger(campaignId)) { res.status(400).json({ error: 'Missing campaignId' }); return; }
  await requireMembership(campaignId, userId);
  const turnRes = await sql`SELECT current_turn FROM campaigns WHERE id = ${campaignId}`;
  const turn = turnRes.rows[0]?.current_turn ?? 1;
  const result = await sql`
    SELECT faction, stratagem_key FROM campaign_stratagem_uses
    WHERE campaign_id = ${campaignId} AND turn = ${turn}
  `;
  res.status(200).json({ ok: true, uses: result.rows });
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

/** POST /api/campaign/tauva-bonus-draw { campaignId, faction } → GM draws the Tau'va Unification
 * Center's extra positive weekly effect for this faction this round (v1.11, Tau only). */
async function tauvaBonusDraw(req, res, userId) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const { campaignId, faction } = req.body ?? {};
  if (!Number.isInteger(campaignId) || typeof faction !== 'string' || !faction.trim()) {
    res.status(400).json({ error: 'campaignId and faction required' }); return;
  }
  const role = await requireMembership(campaignId, userId);
  if (role !== 'gm') { res.status(403).json({ error: 'Only the GM can draw events.' }); return; }
  const f = faction.trim();

  const turnRes = await sql`SELECT current_turn FROM campaigns WHERE id = ${campaignId}`;
  const turn = turnRes.rows[0]?.current_turn ?? 1;

  const tauva = await sql`
    SELECT b.id FROM campaign_buildings b
    JOIN campaign_sectors s ON s.id = b.sector_id
    WHERE b.campaign_id = ${campaignId} AND b.building_type = 'tauva-center' AND s.owner_faction = ${f}
      AND b.available_from_turn <= ${turn}
    LIMIT 1
  `;
  if (!tauva.rows.length) { res.status(400).json({ error: `${f} does not control an operational Tau'va Unification Center.` }); return; }

  const already = await sql`
    SELECT 1 FROM campaign_bonus_events WHERE campaign_id = ${campaignId} AND faction = ${f} AND turn = ${turn}
  `;
  if (already.rows.length) { res.status(409).json({ error: 'Bonus event already drawn for this faction this round.' }); return; }

  const pool = WEEKLY_EVENTS.filter(e => POSITIVE_WEEKLY_EVENT_IDS.includes(e.id));
  const event = pool[Math.floor(Math.random() * pool.length)];
  await sql`
    INSERT INTO campaign_bonus_events (campaign_id, faction, turn, event_id, event_name, event_effect)
    VALUES (${campaignId}, ${f}, ${turn}, ${event.id}, ${event.name}, ${event.effect})
  `;
  res.status(200).json({ ok: true, event: { id: event.id, event_name: event.name, event_effect: event.effect } });
}

/** GET /api/campaign/tauva-bonus-list?campaignId=N → Tau'va bonus events, same visibility as event-list */
async function tauvaBonusList(req, res, userId) {
  if (req.method !== 'GET') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const campaignId = Number(req.query.campaignId);
  if (!Number.isInteger(campaignId)) { res.status(400).json({ error: 'Missing campaignId' }); return; }
  const role = await requireMembership(campaignId, userId);
  let result;
  if (role === 'gm') {
    result = await sql`SELECT * FROM campaign_bonus_events WHERE campaign_id = ${campaignId} ORDER BY turn DESC, faction ASC`;
  } else {
    const myFaction = await sql`SELECT faction FROM campaign_players WHERE campaign_id = ${campaignId} AND user_id = ${userId}`;
    result = await sql`SELECT * FROM campaign_bonus_events WHERE campaign_id = ${campaignId} AND faction = ${myFaction.rows[0]?.faction ?? ''} ORDER BY turn DESC`;
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

/** GET /api/campaign/army-list?campaignId=N -> saved army lists tagged to this campaign, visible
 * to the caller: their own always, the GM sees every one, everyone else only what the GM has
 * marked campaign_visible. */
async function armyList(req, res, userId) {
  if (req.method !== 'GET') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const campaignId = Number(req.query.campaignId);
  if (!Number.isInteger(campaignId)) { res.status(400).json({ error: 'Missing campaignId' }); return; }
  const role = await requireMembership(campaignId, userId);
  const result = await sql`
    SELECT r.id, r.name, r.updated_at, r.campaign_faction, r.campaign_visible, r.user_id,
      u.username, CAST(NULLIF(r.data->>'totalPts','') AS INTEGER) AS total_pts,
      r.data->>'faction' AS faction_label
    FROM rosters r JOIN users u ON u.id = r.user_id
    WHERE r.campaign_id = ${campaignId}
      AND (r.user_id = ${userId} OR ${role === 'gm'} OR r.campaign_visible = true)
    ORDER BY r.campaign_faction ASC, r.updated_at DESC
  `;
  res.status(200).json({ ok: true, armies: result.rows.map(r => ({
    id: r.id, name: r.name, updated_at: r.updated_at, campaignFaction: r.campaign_faction,
    campaignVisible: r.campaign_visible, isOwn: r.user_id === userId,
    username: r.username, total_pts: r.total_pts, faction_label: r.faction_label,
  })) });
}

/** POST /api/campaign/army-visibility { campaignId, rosterId, visible } -> GM decides whether a
 * campaign-tagged army list becomes visible to the rest of the campaign. */
async function armyVisibility(req, res, userId) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const { campaignId, rosterId, visible } = req.body ?? {};
  if (!Number.isInteger(campaignId) || !Number.isInteger(rosterId) || typeof visible !== 'boolean') {
    res.status(400).json({ error: 'campaignId, rosterId, visible required' }); return;
  }
  const role = await requireMembership(campaignId, userId);
  if (role !== 'gm') { res.status(403).json({ error: 'Only the GM can change an army\'s campaign visibility.' }); return; }
  const result = await sql`
    UPDATE rosters SET campaign_visible = ${visible} WHERE id = ${rosterId} AND campaign_id = ${campaignId}
    RETURNING id
  `;
  if (!result.rows.length) { res.status(404).json({ error: 'Army not found in this campaign.' }); return; }
  res.status(200).json({ ok: true });
}
