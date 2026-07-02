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

  // Turn counter on campaigns (ALTER is idempotent)
  await sql`ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS current_turn INTEGER NOT NULL DEFAULT 1`;

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

  schemaReady = true;
}

export { sql };
