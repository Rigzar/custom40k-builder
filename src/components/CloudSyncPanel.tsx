import { useState, useRef } from 'react';
import { useCloudSync } from '../hooks/useCloudSync';
import { useSavedArmies } from '../hooks/useSavedArmies';

export function CloudSyncPanel() {
  const { syncKey, status, lastSync, push, pull, enabled } = useCloudSync();
  const { saves, saveArmy } = useSavedArmies();
  const [importing, setImporting] = useState(false);
  const [importKey, setImportKey] = useState('');
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleCopy() {
    try { await navigator.clipboard.writeText(syncKey); }
    catch { inputRef.current?.select(); }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handlePush() { await push(saves); }

  async function handlePull() {
    const armies = await pull();
    if (armies) armies.forEach(a => saveArmy(a));
  }

  async function handleImportKey() {
    if (!importKey.trim()) return;
    const armies = await pull(importKey.trim().toUpperCase());
    if (armies) { armies.forEach(a => saveArmy(a)); setImporting(false); setImportKey(''); }
  }

  if (!enabled) {
    return (
      <div className="mt-3 border-t border-zinc-700 pt-3">
        <div className="text-[10px] text-zinc-600 space-y-1 leading-relaxed">
          <div className="text-zinc-500 font-semibold uppercase tracking-wide text-[10px] mb-1">Cloud Sync — not configured</div>
          <p>To sync armies across devices, connect a free Supabase database:</p>
          <ol className="list-decimal list-inside space-y-0.5 pl-1">
            <li>Create a free project at <span className="text-amber-700">supabase.com</span></li>
            <li>Run this SQL in the SQL editor:</li>
          </ol>
          <pre className="bg-zinc-800 text-zinc-400 text-[9px] p-2 rounded overflow-x-auto leading-tight mt-1">{SQL_SETUP}</pre>
          <ol className="list-decimal list-inside space-y-0.5 pl-1" start={3}>
            <li>In Vercel, add env vars:</li>
          </ol>
          <pre className="bg-zinc-800 text-zinc-400 text-[9px] p-2 rounded mt-1 leading-tight">VITE_SUPABASE_URL{'\n'}VITE_SUPABASE_ANON_KEY</pre>
          <p className="text-zinc-600">Values are in your Supabase project → Settings → API.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 border-t border-zinc-700 pt-3 space-y-2">
      <div className="text-[10px] text-zinc-500 uppercase tracking-wide">Cloud Sync</div>

      {/* Sync key */}
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          readOnly
          value={syncKey}
          className="flex-1 bg-zinc-800 border border-zinc-600 text-amber-400 text-[11px] font-mono px-2 py-1 min-w-0 focus:outline-none"
        />
        <button
          onClick={handleCopy}
          className={`shrink-0 text-[10px] px-2 py-1 border uppercase tracking-wide transition-colors ${copied ? 'text-green-400 border-green-700' : 'text-zinc-400 border-zinc-600 hover:text-amber-400 hover:border-amber-800'}`}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <p className="text-[10px] text-zinc-600">This is your sync key — save it to access armies on other devices.</p>

      {/* Push / Pull */}
      <div className="flex gap-2">
        <button
          onClick={handlePush}
          disabled={status === 'syncing'}
          className="flex-1 text-[11px] px-2 py-1.5 bg-zinc-800 border border-zinc-600 text-amber-500 hover:bg-zinc-700 uppercase tracking-wide disabled:opacity-40 transition-colors"
        >
          {status === 'syncing' ? '…' : '↑ Push'}
        </button>
        <button
          onClick={handlePull}
          disabled={status === 'syncing'}
          className="flex-1 text-[11px] px-2 py-1.5 bg-zinc-800 border border-zinc-600 text-amber-500 hover:bg-zinc-700 uppercase tracking-wide disabled:opacity-40 transition-colors"
        >
          {status === 'syncing' ? '…' : '↓ Pull'}
        </button>
      </div>

      {/* Status */}
      {status === 'ok' && lastSync && (
        <div className="text-[10px] text-green-500">Synced {lastSync.toLocaleTimeString()}</div>
      )}
      {status === 'error' && (
        <div className="text-[10px] text-red-400">Sync failed — check connection</div>
      )}

      {/* Import from different key */}
      {importing ? (
        <div className="flex gap-2">
          <input
            value={importKey}
            onChange={e => setImportKey(e.target.value.toUpperCase())}
            placeholder="Enter sync key…"
            maxLength={12}
            className="flex-1 bg-zinc-800 border border-zinc-600 text-zinc-200 text-[11px] font-mono px-2 py-1 min-w-0 focus:outline-none focus:border-amber-600"
          />
          <button onClick={handleImportKey} className="text-[10px] px-2 py-1 bg-amber-800 border border-amber-600 text-white uppercase tracking-wide hover:bg-amber-700 transition-colors">
            Import
          </button>
          <button onClick={() => setImporting(false)} className="text-[10px] px-2 py-1 border border-zinc-600 text-zinc-400 uppercase hover:bg-zinc-700 transition-colors">
            ✕
          </button>
        </div>
      ) : (
        <button onClick={() => setImporting(true)} className="text-[10px] text-zinc-600 hover:text-zinc-400 underline underline-offset-2">
          Pull from a different sync key
        </button>
      )}
    </div>
  );
}

const SQL_SETUP = `CREATE TABLE army_saves (
  sync_key text PRIMARY KEY,
  armies jsonb NOT NULL DEFAULT '[]',
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE army_saves ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public" ON army_saves
  FOR ALL USING (true) WITH CHECK (true);`;
