/**
 * Postgres access layer (Vercel Postgres / Neon — POSTGRES_URL env var auto-injected once the
 * project is linked to a Vercel Postgres database from the dashboard).
 *
 * `ensureSchema()` is idempotent (CREATE TABLE IF NOT EXISTS) and called at the top of every
 * handler that touches the DB — there is no separate migration step to remember to run.
 */
import { sql } from '@vercel/postgres';

let schemaReady = false;

export async function ensureSchema() {
  if (schemaReady) return;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      recovery_code_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      last_login_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  // recovery_code_encrypted: reversible (AES) copy of the current recovery code, for the
  // account page's "view code" eye-icon reveal — recovery_code_hash stays the one-way hash used
  // for actual verification. NULL for accounts created before this column existed (their original
  // code can't be recovered retroactively; they get a fresh one next time they reset/regenerate).
  // secret_question/secret_answer_hash: optional extra recovery factor, set by the user, blank
  // for everyone until they opt in.
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS recovery_code_encrypted TEXT`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS secret_question TEXT`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS secret_answer_hash TEXT`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT false`;
  // Limited admin rank, one step below a full admin ("Inquisitor") — themed "Interrogator" in the
  // Users tab. Scoped to translation work only: the i18n editor and the (client-side, read-only)
  // faction-data search. Enforced server-side in api/admin/[action].js, not just hidden in the UI.
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_interrogator BOOLEAN NOT NULL DEFAULT false`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMPTZ`;
  await sql`UPDATE users SET is_admin = true WHERE LOWER(username) = 'rigzar' AND is_admin = false`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS social_links JSONB`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS social_public BOOLEAN NOT NULL DEFAULT false`;
  await sql`
    CREATE TABLE IF NOT EXISTS rosters (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      data JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS rosters_user_id_idx ON rosters(user_id)`;
  await sql`ALTER TABLE rosters ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT false`;
  await sql`ALTER TABLE rosters ADD COLUMN IF NOT EXISTS source_roster_id INTEGER`;
  await sql`ALTER TABLE rosters ADD COLUMN IF NOT EXISTS source_username TEXT`;
  // A view-only share link — deliberately separate from is_public (which lists the roster in the
  // Community Armies feed). This is a capability URL: nobody can browse to it, but anyone holding
  // the exact token can view a read-only copy without an account, same model as "anyone with the
  // link" sharing. NULL until the owner explicitly generates one.
  await sql`ALTER TABLE rosters ADD COLUMN IF NOT EXISTS share_token TEXT`;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS rosters_share_token_idx ON rosters(share_token) WHERE share_token IS NOT NULL`;
  await sql`
    CREATE TABLE IF NOT EXISTS friends (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      friend_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ DEFAULT now(),
      UNIQUE(user_id, friend_id)
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS friends_user_idx ON friends(user_id)`;
  // Request/accept flow (added after friend-add had been instant + one-directional in
  // production for a while — Discord: two players had no way to share an army without both
  // making it fully public). 'accepted' is the column DEFAULT specifically so this ALTER
  // back-fills every row that already existed as accepted — nobody who already had a friend
  // loses them; only NEW requests go through pending -> accepted/deleted.
  await sql`ALTER TABLE friends ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'accepted'`;
  await sql`CREATE INDEX IF NOT EXISTS friends_friend_status_idx ON friends(friend_id, status)`;

  // One roster shared with one specific other user, independent of is_public — the targeted
  // "just let my friend see this one list" the public/private toggle alone couldn't do.
  await sql`
    CREATE TABLE IF NOT EXISTS roster_shares (
      id SERIAL PRIMARY KEY,
      roster_id INTEGER NOT NULL REFERENCES rosters(id) ON DELETE CASCADE,
      shared_with_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE(roster_id, shared_with_user_id)
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS roster_shares_user_idx ON roster_shares(shared_with_user_id)`;

  await sql`
    CREATE TABLE IF NOT EXISTS roster_votes (
      id SERIAL PRIMARY KEY,
      roster_id INTEGER NOT NULL REFERENCES rosters(id) ON DELETE CASCADE,
      user_id  INTEGER NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
      vote     INTEGER NOT NULL CHECK (vote IN (1, -1)),
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE(roster_id, user_id)
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS roster_votes_roster_idx ON roster_votes(roster_id)`;

  await sql`
    CREATE TABLE IF NOT EXISTS recovery_requests (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL,
      message TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      temp_password_enc TEXT,
      new_recovery_code_enc TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      resolved_at TIMESTAMPTZ
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS recovery_requests_username_idx ON recovery_requests(username)`;
  await sql`CREATE INDEX IF NOT EXISTS recovery_requests_status_idx  ON recovery_requests(status)`;

  // Admin action audit log: one row per privileged action (reset pw, delete, promote, resolve, …).
  // admin_id kept as SET NULL so the log survives an admin account deletion; usernames stored
  // denormalised so the log stays readable even after the referenced rows are gone.
  await sql`
    CREATE TABLE IF NOT EXISTS admin_actions (
      id SERIAL PRIMARY KEY,
      admin_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      admin_username TEXT,
      action TEXT NOT NULL,
      target_user_id INTEGER,
      target_username TEXT,
      detail TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS admin_actions_created_idx ON admin_actions(created_at)`;

  // App settings: small key→JSONB store for admin-editable, publicly-readable config
  // (currently the landing announcement banner and per-faction availability flags).
  await sql`
    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  // Direct messages between users. read_at NULL = unread.
  await sql`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      from_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      to_user_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      body TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      read_at TIMESTAMPTZ
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS messages_to_idx ON messages(to_user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS messages_pair_idx ON messages(from_user_id, to_user_id)`;
  // 'text' = a normal DM, rendered as a plain bubble. 'friend_request' = an auto-sent message
  // that the inbox/thread UI renders with Accept/Reject buttons instead of a text bubble — the
  // request itself lives in `friends` (status='pending'); this row is only the notification the
  // user actually asked for ("que le llegue una notificación a sus mensajes").
  await sql`ALTER TABLE messages ADD COLUMN IF NOT EXISTS kind TEXT NOT NULL DEFAULT 'text'`;

  // Planetary Assault campaign module (ALPHA). `factions` is a JSONB array of faction-name
  // strings the GM defines at creation (e.g. ["Chaos","Imperium"]) — players pick one when
  // joining via campaign_players.faction. The GM's own row has faction = NULL unless they also
  // choose to play a side.
  await sql`
    CREATE TABLE IF NOT EXISTS campaigns (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      invite_code TEXT UNIQUE NOT NULL,
      factions JSONB NOT NULL,
      gm_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS campaign_players (
      id SERIAL PRIMARY KEY,
      campaign_id INTEGER NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      faction TEXT,
      role TEXT NOT NULL DEFAULT 'player',
      joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE(campaign_id, user_id)
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS campaign_players_user_idx ON campaign_players(user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS campaign_players_campaign_idx ON campaign_players(campaign_id)`;

  // Sector map: each sector belongs to a campaign, has a type, grid position, and optional owner.
  await sql`
    CREATE TABLE IF NOT EXISTS campaign_sectors (
      id SERIAL PRIMARY KEY,
      campaign_id INTEGER NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      sector_type TEXT NOT NULL DEFAULT 'wasteland',
      owner_faction TEXT,
      x INTEGER NOT NULL DEFAULT 0,
      y INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS campaign_sectors_campaign_idx ON campaign_sectors(campaign_id)`;

  // Turn counter + victory conditions on campaigns (ALTERs are idempotent)
  await sql`ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS current_turn INTEGER NOT NULL DEFAULT 1`;
  await sql`ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS max_turns INTEGER NOT NULL DEFAULT 0`;
  await sql`ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS sectors_to_win INTEGER NOT NULL DEFAULT 0`;
  await sql`ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active'`;
  await sql`ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS winner_faction TEXT`;

  // Battle reports: GM logs results; sector_id auto-claims the sector to winner_faction.
  await sql`
    CREATE TABLE IF NOT EXISTS campaign_battles (
      id SERIAL PRIMARY KEY,
      campaign_id INTEGER NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
      turn INTEGER NOT NULL DEFAULT 1,
      attacker_faction TEXT NOT NULL,
      defender_faction TEXT NOT NULL,
      winner_faction TEXT,
      sector_id INTEGER REFERENCES campaign_sectors(id) ON DELETE SET NULL,
      notes TEXT,
      recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS campaign_battles_campaign_idx ON campaign_battles(campaign_id)`;

  // Supply ledger: one row per faction per campaign, cumulative total.
  await sql`
    CREATE TABLE IF NOT EXISTS campaign_supply (
      id SERIAL PRIMARY KEY,
      campaign_id INTEGER NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
      faction TEXT NOT NULL,
      amount INTEGER NOT NULL DEFAULT 0,
      UNIQUE(campaign_id, faction)
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS campaign_supply_campaign_idx ON campaign_supply(campaign_id)`;

  // Persistent roster: units/heroes that survive between battles, track XP + wounds.
  await sql`
    CREATE TABLE IF NOT EXISTS campaign_roster (
      id SERIAL PRIMARY KEY,
      campaign_id INTEGER NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
      faction TEXT NOT NULL,
      unit_name TEXT NOT NULL,
      unit_slot TEXT NOT NULL DEFAULT 'HQ',
      xp INTEGER NOT NULL DEFAULT 0,
      wounds INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'active',
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS campaign_roster_campaign_idx ON campaign_roster(campaign_id)`;

  // Extra columns added in v1.46 — all idempotent via ADD COLUMN IF NOT EXISTS
  await sql`ALTER TABLE campaign_battles ADD COLUMN IF NOT EXISTS engagement_type TEXT NOT NULL DEFAULT 'pitched'`;
  await sql`ALTER TABLE campaign_roster  ADD COLUMN IF NOT EXISTS trait TEXT`;
  await sql`ALTER TABLE campaign_sectors ADD COLUMN IF NOT EXISTS building_slots INTEGER NOT NULL DEFAULT 2`;

  // Character models (HQ-slot roster units) don't pick an Infantry/MC/Vehicle Trait at all
  // (v1.11) — instead each engagement they take part in raises their own equipment points limit
  // by +5, from a base of 25; losing 5 back on a 1-3 if they die in a game. Tracked the same
  // manual, GM/player-driven way XP already is (+/- buttons), not auto-derived from battle logs —
  // campaign_battles has no per-unit participation record to derive it from.
  await sql`ALTER TABLE campaign_roster ADD COLUMN IF NOT EXISTS equipment_limit INTEGER NOT NULL DEFAULT 25`;
  // "After taking part in an Epic battle, a CM may use 'once per army' upgrades" — informational
  // flag only; the once-per-army mechanic itself already lives in the army builder proper.
  await sql`ALTER TABLE campaign_roster ADD COLUMN IF NOT EXISTS epic_veteran BOOLEAN NOT NULL DEFAULT false`;

  // Buildings: each sector can host buildings up to its building_slots limit.
  await sql`
    CREATE TABLE IF NOT EXISTS campaign_buildings (
      id SERIAL PRIMARY KEY,
      campaign_id INTEGER NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
      sector_id   INTEGER NOT NULL REFERENCES campaign_sectors(id) ON DELETE CASCADE,
      building_type TEXT NOT NULL,
      level INTEGER NOT NULL DEFAULT 1,
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS campaign_buildings_campaign_idx ON campaign_buildings(campaign_id)`;
  await sql`CREATE INDEX IF NOT EXISTS campaign_buildings_sector_idx   ON campaign_buildings(sector_id)`;

  // "Constructions and upgrades take one campaign round to finish" (v1.11, Construction phase).
  // Two SEPARATE gates, not one: `available_from_turn` says whether the building exists at all
  // (a fresh construction isn't operational until next round); `level2_from_turn` says whether an
  // in-progress upgrade's NEW level-2 benefit is recognised yet — the building's existing level-1
  // effect must keep working while the upgrade is pending, so upgrading must never touch
  // available_from_turn. Both default 0 so buildings that already existed before this migration
  // stay operational (0 <= any current_turn), not retroactively "under construction".
  await sql`ALTER TABLE campaign_buildings ADD COLUMN IF NOT EXISTS available_from_turn INTEGER NOT NULL DEFAULT 0`;
  await sql`ALTER TABLE campaign_buildings ADD COLUMN IF NOT EXISTS level2_from_turn INTEGER NOT NULL DEFAULT 0`;

  // Weekly events: one row per faction per turn. GM draws; stays hidden from other factions.
  await sql`
    CREATE TABLE IF NOT EXISTS campaign_events (
      id SERIAL PRIMARY KEY,
      campaign_id INTEGER NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
      faction TEXT NOT NULL,
      turn INTEGER NOT NULL,
      event_id INTEGER NOT NULL,
      event_name TEXT NOT NULL,
      event_effect TEXT NOT NULL,
      resolved BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE(campaign_id, faction, turn)
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS campaign_events_campaign_idx ON campaign_events(campaign_id)`;

  // A roster can be created directly from a campaign's Roster tab, tagging it as that campaign's
  // (faction's) army list. Private to its owner and the campaign's GM by default — the GM decides
  // whether to reveal it to the rest of the campaign via campaign_visible, independent of the
  // regular global is_public toggle.
  await sql`ALTER TABLE rosters ADD COLUMN IF NOT EXISTS campaign_id INTEGER REFERENCES campaigns(id) ON DELETE SET NULL`;
  await sql`ALTER TABLE rosters ADD COLUMN IF NOT EXISTS campaign_faction TEXT`;
  await sql`ALTER TABLE rosters ADD COLUMN IF NOT EXISTS campaign_visible BOOLEAN NOT NULL DEFAULT false`;
  await sql`CREATE INDEX IF NOT EXISTS rosters_campaign_idx ON rosters(campaign_id)`;

  // Tracks the "unique" buildings (PDC, Plasteel refinery, Space port — Planetary Assault
  // rules v1.11) that were destroyed and, per the supplement, can never be rebuilt for the
  // rest of the campaign. A row here is a permanent block on that (campaign, faction,
  // building_type) triple, independent of whether the faction currently owns one.
  await sql`
    CREATE TABLE IF NOT EXISTS campaign_destroyed_uniques (
      campaign_id INTEGER NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
      faction TEXT NOT NULL,
      building_type TEXT NOT NULL,
      destroyed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY (campaign_id, faction, building_type)
    )
  `;

  // Planetary Assault v1.11 — Skirmish result: "the sector is now contested... if one Attacker
  // wins a Skirmish, Pitched or Epic battle in a contested sector, control switches over" (a
  // separate state from plain unclaimed — a contested sector keeps its owner_faction on record
  // but neither faction can use its resources/buildings until it's actually captured).
  await sql`ALTER TABLE campaign_sectors ADD COLUMN IF NOT EXISTS contested BOOLEAN NOT NULL DEFAULT false`;
  // Which campaign round a roster unit's upgrade Trait was first assigned, so the Barracks/AdMech
  // Forge per-round upgrade caps can be counted correctly ("2 (additional) non-vehicle units per
  // campaign round" etc — a cap that only makes sense against upgrades granted THIS round).
  await sql`ALTER TABLE campaign_roster ADD COLUMN IF NOT EXISTS trait_assigned_turn INTEGER`;

  // "Stratagems are available once per (controlled) related building per campaign round" (v1.11)
  // — a faction with 2 Siege Camps gets to use Artillery Strike twice a round, not once total.
  // One row per successful use, so the count is exact and survives re-reads (no in-memory cap).
  await sql`
    CREATE TABLE IF NOT EXISTS campaign_stratagem_uses (
      id SERIAL PRIMARY KEY,
      campaign_id INTEGER NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
      faction TEXT NOT NULL,
      turn INTEGER NOT NULL,
      stratagem_key TEXT NOT NULL,
      used_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS campaign_stratagem_uses_lookup_idx ON campaign_stratagem_uses(campaign_id, faction, turn, stratagem_key)`;

  // Tau'va Unification Center: "The controlling faction gets an additional, positive weekly
  // effect each campaign round" (v1.11, Tau only). A genuinely separate draw from the normal
  // weekly event — deliberately its OWN table rather than a second row in campaign_events, which
  // has a UNIQUE(campaign_id, faction, turn) constraint the normal draw/upsert flow depends on;
  // altering that live constraint was a bigger risk than a small additional table. The "once per
  // round" cap is enforced in application code (COUNT before INSERT), same pattern already used
  // elsewhere in this file, not by a DB constraint.
  await sql`
    CREATE TABLE IF NOT EXISTS campaign_bonus_events (
      id SERIAL PRIMARY KEY,
      campaign_id INTEGER NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
      faction TEXT NOT NULL,
      turn INTEGER NOT NULL,
      event_id INTEGER NOT NULL,
      event_name TEXT NOT NULL,
      event_effect TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS campaign_bonus_events_lookup_idx ON campaign_bonus_events(campaign_id, faction, turn)`;

  // Systems layer (design locked 2026-07-11, built 2026-08-26): a sector optionally belongs to a
  // GM-defined "system" grouping, with one sector per system flagged as its capital. System owner
  // = capital owner (reuses sector ownership, no new capture mechanic) and campaign victory counts
  // CAPITALS controlled instead of raw sectors. NULL system_name = the sector counts as its own
  // singleton system for victory purposes, so every existing campaign (nothing has a system_name
  // yet) keeps behaving exactly as before this migration — one sector, one vote, same as always.
  await sql`ALTER TABLE campaign_sectors ADD COLUMN IF NOT EXISTS system_name TEXT`;
  await sql`ALTER TABLE campaign_sectors ADD COLUMN IF NOT EXISTS is_capital BOOLEAN NOT NULL DEFAULT false`;

  schemaReady = true;
}

export { sql };
