import type { SavedArmy } from '../hooks/useSavedArmies';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const cloudEnabled = !!(SUPABASE_URL && SUPABASE_KEY);

function headers() {
  return {
    apikey: SUPABASE_KEY!,
    Authorization: `Bearer ${SUPABASE_KEY!}`,
    'Content-Type': 'application/json',
  };
}

export async function cloudPush(syncKey: string, armies: SavedArmy[]): Promise<void> {
  if (!cloudEnabled) return;
  await fetch(`${SUPABASE_URL}/rest/v1/army_saves`, {
    method: 'POST',
    headers: { ...headers(), Prefer: 'resolution=merge-duplicates' },
    body: JSON.stringify({ sync_key: syncKey, armies, updated_at: new Date().toISOString() }),
  });
}

export async function cloudPull(syncKey: string): Promise<SavedArmy[] | null> {
  if (!cloudEnabled) return null;
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/army_saves?sync_key=eq.${encodeURIComponent(syncKey)}&select=armies`,
    { headers: headers() },
  );
  if (!res.ok) return null;
  const rows = await res.json() as { armies: SavedArmy[] }[];
  return rows?.[0]?.armies ?? null;
}
