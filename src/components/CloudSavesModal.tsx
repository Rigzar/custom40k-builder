import { useEffect, useState } from 'react';
import * as api from '../lib/api';
import { useArmyStore } from '../store/army';
import { resolveUnit, computeUnitPoints, effectiveArchetypeFor } from '../engine/points';

interface Props {
  username: string;
  onClose: () => void;
  onLogout: () => void;
  activeRosterId: number | null;
  onActiveRosterIdChange: (id: number | null) => void;
  onOpenAdmin?: () => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
}

export function CloudSavesModal({ username, onClose, onLogout, activeRosterId, onActiveRosterIdChange, onOpenAdmin }: Props) {
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

  // Account security: recovery code (eye-icon reveal) + secret question management.
  const [showSecurity, setShowSecurity]   = useState(false);
  const [recoveryCode, setRecoveryCode]   = useState<string | null>(null);
  const [codeRevealed, setCodeRevealed]   = useState(false);
  const [codeLoading, setCodeLoading]     = useState(false);
  const [secQuestion, setSecQuestion]     = useState<string | null>(null);
  const [editQuestion, setEditQuestion]   = useState('');
  const [editAnswer, setEditAnswer]       = useState('');
  const [secBusy, setSecBusy]             = useState(false);
  const [secError, setSecError]           = useState('');
  const [secMsg, setSecMsg]               = useState('');

  async function loadSecurity() {
    setCodeLoading(true);
    try {
      const codeRes = await api.getRecoveryCode();
      setRecoveryCode(codeRes.hasCode ? codeRes.code : null);
      const qRes = await api.getSecretQuestion(username);
      setSecQuestion(qRes.hasSecretQuestion ? qRes.question : null);
    } catch (err) {
      setSecError((err as Error).message);
    } finally {
      setCodeLoading(false);
    }
  }

  function toggleSecurity() {
    const next = !showSecurity;
    setShowSecurity(next);
    if (next && recoveryCode === null && secQuestion === null) loadSecurity();
  }

  async function handleSaveSecretQuestion() {
    setSecBusy(true); setSecError(''); setSecMsg('');
    try {
      if (!editQuestion.trim()) {
        await api.setSecretQuestion(null);
        setSecQuestion(null);
      } else {
        if (!editAnswer.trim()) { setSecError('Answer is required.'); return; }
        await api.setSecretQuestion(editQuestion.trim(), editAnswer.trim());
        setSecQuestion(editQuestion.trim());
      }
      setEditQuestion(''); setEditAnswer('');
      setSecMsg('Saved!');
      setTimeout(() => setSecMsg(''), 2000);
    } catch (err) {
      setSecError((err as Error).message);
    } finally {
      setSecBusy(false);
    }
  }

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

  const store = useArmyStore();
  const totalPts = store.data
    ? army.reduce((sum, e) => {
        const u = resolveUnit(e, store.data!);
        return sum + (u ? computeUnitPoints(e, u, effectiveArchetypeFor(e, store)) : 0);
      }, 0)
    : 0;

  const stateSnapshot = {
    armyName, faction, engagement, pointLimit, hqMark, archetype, legacy, legacy2, traitPool, army,
    alliedFaction, alliedArchetype, alliedLegacy, alliedTraitPool, alliedHqMark,
    totalPts,
  };

  async function handleSaveNew() {
    const name = newName.trim() || armyName.trim() || faction || 'Army';
    setSaving(true); setError('');
    try {
      const res = await api.saveRoster(name, stateSnapshot);
      onActiveRosterIdChange(res.roster.id);
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
      const name = armyName.trim() || faction || 'Army';
      await api.updateRoster(id, { name, data: stateSnapshot });
      onActiveRosterIdChange(id);
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
      onActiveRosterIdChange(id);
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
          <div className="flex items-center gap-2">
            <h3 className="text-amber-400 uppercase tracking-widest text-sm">Cloud Saves — {username}</h3>
            {onOpenAdmin && (
              <button
                onClick={() => { onClose(); onOpenAdmin(); }}
                className="text-zinc-700 hover:text-zinc-500 text-xs leading-none select-none"
                tabIndex={-1}
                aria-hidden
              >◈</button>
            )}
          </div>
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
                <div key={r.id} className={`bg-zinc-800 border p-3 flex items-center gap-3 ${
                  r.id === activeRosterId ? 'border-amber-500 border-l-4' : 'border-zinc-700 border-l-4 border-l-amber-800'
                }`}>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-zinc-100 truncate">
                      {r.name}
                      {r.id === activeRosterId && <span className="ml-2 text-[10px] text-amber-500 normal-case">(currently open)</span>}
                    </div>
                    {r.faction_label && (
                      <div className="text-[10px] text-amber-700 uppercase tracking-wide mt-0.5">{r.faction_label}</div>
                    )}
                    <div className="text-[11px] text-zinc-500 mt-1">
                      {r.total_pts != null ? <span className="text-zinc-400 mr-2">{r.total_pts} pts</span> : null}
                      {formatDate(r.updated_at)}
                    </div>
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

          <div className="border-t border-zinc-700 pt-3">
            <button
              onClick={toggleSecurity}
              className="text-[11px] text-zinc-500 hover:text-amber-400 uppercase tracking-wide flex items-center gap-1"
            >
              {showSecurity ? '▾' : '▸'} Account security
            </button>

            {showSecurity && (
              <div className="mt-3 space-y-4 bg-zinc-950/40 border border-zinc-800 p-3">
                {secError && <p className="text-red-400 text-xs">{secError}</p>}

                <div>
                  <div className="text-[11px] uppercase tracking-widest text-amber-600 mb-1">Recovery code</div>
                  {codeLoading ? (
                    <p className="text-zinc-500 text-xs">Loading…</p>
                  ) : recoveryCode ? (
                    <div className="flex items-center gap-2">
                      <div
                        className={`bg-zinc-950 border border-amber-700 text-amber-400 font-mono text-sm px-3 py-2 tracking-widest flex-1 select-all ${
                          codeRevealed ? '' : 'blur-sm'
                        }`}
                      >
                        {recoveryCode}
                      </div>
                      <button
                        onClick={() => setCodeRevealed(v => !v)}
                        title={codeRevealed ? 'Hide' : 'Reveal'}
                        className="text-lg px-2 text-zinc-400 hover:text-amber-400"
                      >
                        {codeRevealed ? '🙈' : '👁'}
                      </button>
                    </div>
                  ) : (
                    <p className="text-zinc-500 text-xs italic">
                      No code on file yet — reset your password once to get one, or use "Lost your
                      recovery code?" from the login screen.
                    </p>
                  )}
                </div>

                <div>
                  <div className="text-[11px] uppercase tracking-widest text-amber-600 mb-1">Secret question</div>
                  {secQuestion && !editQuestion && (
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-zinc-300 text-sm">{secQuestion}</span>
                      <button
                        onClick={() => setEditQuestion(secQuestion)}
                        className="text-[11px] text-zinc-500 hover:text-amber-400 underline underline-offset-2 shrink-0"
                      >
                        Change
                      </button>
                    </div>
                  )}
                  {(!secQuestion || editQuestion) && (
                    <div className="space-y-2">
                      {!secQuestion && (
                        <p className="text-zinc-500 text-[11px] italic">
                          Not set. Optional — if set, it's required (along with your recovery code)
                          to reset your password.
                        </p>
                      )}
                      <input
                        value={editQuestion}
                        onChange={e => setEditQuestion(e.target.value)}
                        placeholder="e.g. What was your first army's faction?"
                        className="w-full bg-zinc-800 border border-zinc-700 focus:border-amber-700 text-zinc-200 text-sm px-3 py-2 outline-none"
                      />
                      {editQuestion.trim() && (
                        <input
                          value={editAnswer}
                          onChange={e => setEditAnswer(e.target.value)}
                          placeholder="Answer"
                          className="w-full bg-zinc-800 border border-zinc-700 focus:border-amber-700 text-zinc-200 text-sm px-3 py-2 outline-none"
                        />
                      )}
                      <div className="flex gap-2">
                        <button
                          disabled={secBusy}
                          onClick={handleSaveSecretQuestion}
                          className="text-[11px] px-3 py-1.5 bg-amber-800 border border-amber-600 text-white hover:bg-amber-700 disabled:opacity-50 uppercase tracking-wide"
                        >
                          {secMsg || 'Save'}
                        </button>
                        {secQuestion && (
                          <button
                            onClick={() => { setEditQuestion(''); setEditAnswer(''); }}
                            className="text-[11px] px-3 py-1.5 bg-zinc-700 border border-zinc-600 text-zinc-300 hover:bg-zinc-600 uppercase tracking-wide"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
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
