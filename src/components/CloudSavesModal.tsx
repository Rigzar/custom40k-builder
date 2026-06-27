import { useEffect, useState } from 'react';
import * as api from '../lib/api';
import { useArmyStore } from '../store/army';

interface Props {
  username: string;
  onClose: () => void;
  onLogout: () => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
}

export function CloudSavesModal({ username, onClose, onLogout }: Props) {
  const {
    army, engagement, hqMark, archetype, legacy, legacy2, traitPool,
    faction, pointLimit, armyName, importRoster,
    alliedFaction, alliedArchetype, alliedLegacy, alliedTraitPool, alliedHqMark,
  } = useArmyStore();

  const [rosters, setRosters] = useState<api.RosterSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [saving, setSaving]   = useState(false);
  const [newName, setNewName] = useState('');

  async function refresh() {
    setLoading(true);
    try {
      const res = await api.listRosters();
      setRosters(res.rosters);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  const stateSnapshot = {
    armyName, faction, engagement, pointLimit, hqMark, archetype, legacy, legacy2, traitPool, army,
    alliedFaction, alliedArchetype, alliedLegacy, alliedTraitPool, alliedHqMark,
  };

  async function handleSaveNew() {
    const name = newName.trim() || armyName.trim() || faction || 'Army';
    setSaving(true); setError('');
    try {
      await api.saveRoster(name, stateSnapshot);
      setNewName('');
      await refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleOverwrite(id: number) {
    setSaving(true); setError('');
    try {
      await api.updateRoster(id, { data: stateSnapshot });
      await refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleLoad(id: number) {
    setError('');
    try {
      const res = await api.loadRoster(id);
      importRoster(JSON.stringify(res.roster.data));
      onClose();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this saved army? This cannot be undone.')) return;
    setError('');
    try {
      await api.deleteRoster(id);
      await refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-start justify-center z-50 p-4 overflow-y-auto"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-zinc-900 border-2 border-amber-800 w-full max-w-xl my-4">
        <div className="flex justify-between items-center px-4 py-3 bg-zinc-800 border-b border-amber-800">
          <h3 className="text-amber-400 uppercase tracking-widest text-sm">Cloud Saves — {username}</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-xl leading-none">✕</button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex gap-2">
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder={armyName.trim() || 'Name this save…'}
              className="flex-1 bg-zinc-800 border border-zinc-700 focus:border-amber-700 text-zinc-200 text-sm px-3 py-2 outline-none"
            />
            <button
              disabled={saving}
              onClick={handleSaveNew}
              className="text-[11px] px-3 py-2 bg-amber-800 border border-amber-600 text-white hover:bg-amber-700 disabled:opacity-50 uppercase tracking-wide"
            >
              Save current army
            </button>
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          {loading ? (
            <p className="text-zinc-500 text-sm text-center py-6">Loading…</p>
          ) : rosters.length === 0 ? (
            <p className="text-zinc-500 italic text-sm text-center py-8">
              No cloud saves yet. Save your current army above.
            </p>
          ) : (
            <div className="space-y-2">
              {rosters.map(r => (
                <div key={r.id} className="bg-zinc-800 border border-zinc-700 border-l-4 border-l-amber-800 p-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-zinc-100 truncate">{r.name}</div>
                    <div className="text-[11px] text-zinc-500 mt-1">Updated {formatDate(r.updated_at)}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => handleLoad(r.id)} className="text-[11px] px-3 py-1.5 bg-amber-900/40 border border-amber-700 text-amber-400 hover:bg-amber-800/50 uppercase tracking-wide">Load</button>
                    <button disabled={saving} onClick={() => handleOverwrite(r.id)} className="text-[11px] px-3 py-1.5 bg-zinc-700 border border-zinc-600 text-zinc-300 hover:bg-zinc-600 disabled:opacity-50 uppercase tracking-wide">Overwrite</button>
                    <button onClick={() => handleDelete(r.id)} className="text-zinc-600 hover:text-red-400 text-xl leading-none" title="Delete">×</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 py-3 border-t border-zinc-700 flex justify-between items-center bg-zinc-800">
          <button
            onClick={async () => { await onLogout(); onClose(); }}
            className="text-[11px] text-red-500/70 hover:text-red-400 uppercase tracking-wide"
          >
            Log out
          </button>
          <button onClick={onClose} className="px-4 py-1.5 bg-zinc-700 border border-zinc-600 text-zinc-200 text-sm hover:bg-zinc-600 uppercase tracking-wide">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
