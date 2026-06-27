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
  schemaReady = true;
}

export { sql };
