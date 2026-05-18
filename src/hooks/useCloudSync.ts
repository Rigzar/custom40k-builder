import { useState } from 'react';
import { cloudEnabled, cloudPush, cloudPull } from '../lib/supabaseSync';
import type { SavedArmy } from './useSavedArmies';

const SYNC_KEY_STORAGE = 'custom40k-sync-key';

function makeSyncKey(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(5));
  return Array.from(bytes).map(b => b.toString(36).toUpperCase().padStart(2, '0')).join('').slice(0, 8);
}

function getSyncKey(): string {
  const stored = localStorage.getItem(SYNC_KEY_STORAGE);
  if (stored) return stored;
  const key = makeSyncKey();
  localStorage.setItem(SYNC_KEY_STORAGE, key);
  return key;
}

export type SyncStatus = 'idle' | 'syncing' | 'ok' | 'error';

export function useCloudSync() {
  const [syncKey] = useState(getSyncKey);
  const [status, setStatus] = useState<SyncStatus>('idle');
  const [lastSync, setLastSync] = useState<Date | null>(null);

  async function push(armies: SavedArmy[]) {
    if (!cloudEnabled) return;
    setStatus('syncing');
    try {
      await cloudPush(syncKey, armies);
      setLastSync(new Date());
      setStatus('ok');
    } catch {
      setStatus('error');
    }
  }

  async function pull(key = syncKey): Promise<SavedArmy[] | null> {
    if (!cloudEnabled) return null;
    setStatus('syncing');
    try {
      const result = await cloudPull(key);
      setLastSync(new Date());
      setStatus(result ? 'ok' : 'error');
      return result;
    } catch {
      setStatus('error');
      return null;
    }
  }

  return { syncKey, status, lastSync, push, pull, enabled: cloudEnabled };
}
