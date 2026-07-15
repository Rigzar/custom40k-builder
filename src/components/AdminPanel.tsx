import { useEffect, useState } from 'react';
import * as api from '../lib/api';
import { runDataHealth, type HealthFinding } from '../engine/dataHealth';

interface Props { onClose: () => void }

function fmt(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString(undefined, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

type SortKey = 'username' | 'created_at' | 'last_seen_at' | 'roster_count';
const daysAgo = (n: number) => Date.now() - n * 86_400_000;
const seenWithin = (iso: string | null, days: number) => iso != null && new Date(iso).getTime() >= daysAgo(days);

function usersToCsv(users: api.AdminUserRow[]): string {
  const esc = (v: string | number | boolean) => `"${String(v).replace(/"/g, '""')}"`;
  const head = ['id', 'username', 'is_admin', 'roster_count', 'created_at', 'last_seen_at', 'last_login_at'];
  const rows = users.map(u => [u.id, u.username, u.is_admin, u.roster_count, u.created_at, u.last_seen_at ?? '', u.last_login_at].map(esc).join(','));
  return [head.join(','), ...rows].join('\r\n');
}

function downloadText(filename: string, text: string, mime = 'text/csv') {
  const blob = new Blob([text], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function AdminPanel({ onClose }: Props) {
  const [stats, setStats]     = useState<api.AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg]         = useState('');
  const [revealed, setRevealed] = useState<Record<number, { pw: string; rc: string }>>({});
  const [requests, setRequests] = useState<api.RecoveryRequest[]>([]);
  const [resolving, setResolving] = useState<number | null>(null);
  const [health, setHealth]   = useState<HealthFinding[] | null>(null);
  const [healthRunning, setHealthRunning] = useState(false);
  const [filter, setFilter]   = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  async function load() {
    setLoading(true);
    try {
      const [s, r] = await Promise.all([api.adminStats(), api.adminListRecoveryRequests()]);
      setStats(s);
      setRequests(r.requests);
    } catch (e) { setMsg(String(e)); }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleResolve(requestId: number, username: string) {
    if (!confirm(`¿Resolver solicitud de "${username}"? Se generarán nuevas credenciales.`)) return;
    setResolving(requestId);
    try {
      await api.adminResolveRecovery(requestId);
      setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'resolved' as const } : r));
    } catch (e) { setMsg(String(e)); }
    finally { setResolving(null); }
  }

  async function handleResetPw(userId: number, username: string) {
    if (!confirm(`Reset password for "${username}"?`)) return;
    try {
      const r = await api.adminResetPw(userId);
      setRevealed(prev => ({ ...prev, [userId]: { pw: r.tempPassword, rc: r.recoveryCode } }));
      await load();
    } catch (e) { setMsg(String(e)); }
  }

  async function handleDelete(userId: number, username: string) {
    if (!confirm(`DELETE account "${username}" and all their saves? This cannot be undone.`)) return;
    try {
      await api.adminDelUser(userId);
      await load();
    } catch (e) { setMsg(String(e)); }
  }

  async function handleRunHealth() {
    setHealthRunning(true);
    try { setHealth(await runDataHealth()); }
    catch (e) { setMsg(String(e)); }
    finally { setHealthRunning(false); }
  }

  async function handlePromote(userId: number, username: string, makeAdmin: boolean) {
    if (!confirm(`${makeAdmin ? 'Grant' : 'Revoke'} Inquisidor for "${username}"?`)) return;
    try {
      await api.adminPromote(userId, makeAdmin);
      await load();
    } catch (e) { setMsg(String(e)); }
  }

  function toggleSort(key: SortKey) {
    if (key === sortKey) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir(key === 'username' ? 'asc' : 'desc'); }
  }

  const allUsers = stats?.users ?? [];
  const q = filter.trim().toLowerCase();
  const visibleUsers = allUsers
    .filter(u => q === '' || u.username.toLowerCase().includes(q))
    .sort((a, b) => {
      let d: number;
      if (sortKey === 'username') d = a.username.localeCompare(b.username);
      else if (sortKey === 'roster_count') d = a.roster_count - b.roster_count;
      else {
        const av = a[sortKey] ? new Date(a[sortKey] as string).getTime() : 0;
        const bv = b[sortKey] ? new Date(b[sortKey] as string).getTime() : 0;
        d = av - bv;
      }
      return sortDir === 'asc' ? d : -d;
    });
  const active7  = allUsers.filter(u => seenWithin(u.last_seen_at, 7)).length;
  const active30 = allUsers.filter(u => seenWithin(u.last_seen_at, 30)).length;
  const adminCount = allUsers.filter(u => u.is_admin).length;
  const emptyCount = allUsers.filter(u => u.roster_count === 0).length;
  const arrow = (key: SortKey) => (key === sortKey ? (sortDir === 'asc' ? ' ▲' : ' ▼') : '');

  return (
    <div className="fixed inset-0 bg-black/90 flex items-start justify-center z-[60] p-4 overflow-y-auto" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-zinc-950 border border-zinc-700 w-full max-w-4xl my-4">

        <div className="flex justify-between items-center px-4 py-3 bg-zinc-900 border-b border-zinc-700">
          <div className="flex items-center gap-3">
            <span className="text-zinc-300 text-sm font-mono uppercase tracking-widest">Panel Inquisidor</span>
            {stats && (
              <span className="text-zinc-500 text-xs font-mono">
                {stats.totalUsers} users · {stats.totalRosters} saved armies
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white text-xl">✕</button>
        </div>

        {msg && <div className="mx-4 mt-3 text-red-400 text-xs font-mono bg-red-950/30 border border-red-800/50 px-3 py-2">{msg}</div>}

        {loading ? (
          <div className="p-8 text-center text-zinc-600 text-sm">Loading…</div>
        ) : !stats ? null : (
          <div className="p-4 space-y-6">
            {/* Recovery requests */}
            <div>
              <div className="text-[10px] uppercase tracking-widest text-amber-600 mb-2 flex items-center gap-2">
                Solicitudes de recuperación
                {requests.filter(r => r.status === 'pending').length > 0 && (
                  <span className="bg-amber-800 text-amber-200 px-1.5 py-0.5 text-[9px] rounded">
                    {requests.filter(r => r.status === 'pending').length} pendiente{requests.filter(r => r.status === 'pending').length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              {requests.length === 0 ? (
                <p className="text-zinc-600 text-xs font-mono italic">Sin solicitudes.</p>
              ) : (
                <div className="space-y-1.5">
                  {requests.map(r => (
                    <div key={r.id} className={`flex items-start gap-3 p-2 border text-xs font-mono ${
                      r.status === 'pending' ? 'border-amber-800/60 bg-amber-950/20' : 'border-zinc-800 opacity-50'
                    }`}>
                      <div className="flex-1 min-w-0">
                        <span className="text-amber-400">{r.username}</span>
                        <span className="text-zinc-600 ml-2">{fmt(r.created_at)}</span>
                        {r.message && <p className="text-zinc-400 text-[10px] mt-0.5 truncate">{r.message}</p>}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[9px] uppercase px-1 ${
                          r.status === 'pending' ? 'text-amber-500' : r.status === 'resolved' ? 'text-green-500' : 'text-zinc-500'
                        }`}>{r.status}</span>
                        {r.status === 'pending' && (
                          <button
                            onClick={() => handleResolve(r.id, r.username)}
                            disabled={resolving === r.id}
                            className="text-[10px] px-2 py-0.5 border border-amber-700 text-amber-400 hover:bg-amber-900/30 disabled:opacity-50"
                          >{resolving === r.id ? '…' : 'Resolver'}</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Activity summary */}
            <div className="flex flex-wrap gap-2 text-[10px] font-mono">
              {[
                { label: 'Activos 7d', value: active7 },
                { label: 'Activos 30d', value: active30 },
                { label: 'Inquisidores', value: adminCount },
                { label: 'Sin ejércitos', value: emptyCount },
              ].map(s => (
                <div key={s.label} className="border border-zinc-800 bg-zinc-900/50 px-3 py-1.5">
                  <span className="text-zinc-500">{s.label}: </span>
                  <span className="text-zinc-200">{s.value}</span>
                </div>
              ))}
            </div>

            {/* Users table */}
            <div>
            <div className="flex items-center gap-2 mb-2">
              <input
                value={filter}
                onChange={e => setFilter(e.target.value)}
                placeholder="Buscar usuario…"
                className="flex-1 bg-zinc-900 border border-zinc-800 px-2 py-1 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-800"
              />
              <span className="text-zinc-600 text-[10px] font-mono">{visibleUsers.length}/{allUsers.length}</span>
              <button
                onClick={() => downloadText(`custom40k-users-${new Date().toISOString().slice(0, 10)}.csv`, usersToCsv(allUsers))}
                className="text-[11px] px-2 py-1 border border-zinc-700 text-zinc-400 hover:text-amber-400 hover:border-amber-800"
              >export CSV</button>
            </div>
            <table className="w-full text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th onClick={() => toggleSort('username')} className="text-left py-2 pr-3 text-zinc-500 font-normal cursor-pointer hover:text-zinc-300 select-none">User{arrow('username')}</th>
                  <th onClick={() => toggleSort('created_at')} className="text-left py-2 pr-3 text-zinc-500 font-normal cursor-pointer hover:text-zinc-300 select-none">Registered{arrow('created_at')}</th>
                  <th onClick={() => toggleSort('last_seen_at')} className="text-left py-2 pr-3 text-zinc-500 font-normal cursor-pointer hover:text-zinc-300 select-none">Last seen{arrow('last_seen_at')}</th>
                  <th onClick={() => toggleSort('roster_count')} className="text-center py-2 pr-3 text-zinc-500 font-normal cursor-pointer hover:text-zinc-300 select-none">Armies{arrow('roster_count')}</th>
                  <th className="py-2 text-zinc-500 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleUsers.map(u => (
                  <>
                    <tr key={u.id} className="border-b border-zinc-900 hover:bg-zinc-900/50">
                      <td className="py-2 pr-3">
                        <span className={u.is_admin ? 'text-amber-400' : 'text-zinc-200'}>{u.username}</span>
                        {u.is_admin && <span className="ml-1 text-[10px] text-amber-600">inqui</span>}
                      </td>
                      <td className="py-2 pr-3 text-zinc-500">{fmt(u.created_at)}</td>
                      <td className="py-2 pr-3 text-zinc-400">{fmt(u.last_seen_at)}</td>
                      <td className="py-2 pr-3 text-center text-zinc-300">{u.roster_count}</td>
                      <td className="py-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleResetPw(u.id, u.username)}
                            className="text-[11px] px-2 py-0.5 border border-zinc-700 text-zinc-400 hover:text-amber-400 hover:border-amber-800"
                          >reset pw</button>
                          <button
                            onClick={() => handlePromote(u.id, u.username, !u.is_admin)}
                            className="text-[11px] px-2 py-0.5 border border-zinc-700 text-zinc-400 hover:text-amber-400 hover:border-amber-800"
                          >{u.is_admin ? '−inqui' : '+inqui'}</button>
                          <button
                            onClick={() => handleDelete(u.id, u.username)}
                            className="text-[11px] px-2 py-0.5 border border-red-900/50 text-red-700 hover:text-red-400 hover:border-red-700"
                          >del</button>
                        </div>
                      </td>
                    </tr>
                    {revealed[u.id] && (
                      <tr key={`${u.id}-rev`} className="bg-zinc-900/60">
                        <td colSpan={5} className="px-3 py-2 text-[11px]">
                          <span className="text-zinc-500">Temp pw: </span>
                          <span className="text-green-400 select-all">{revealed[u.id].pw}</span>
                          <span className="text-zinc-500 ml-4">Recovery: </span>
                          <span className="text-amber-400 select-all">{revealed[u.id].rc}</span>
                          <button onClick={() => setRevealed(p => { const n={...p}; delete n[u.id]; return n; })} className="ml-4 text-zinc-600 hover:text-zinc-400">hide</button>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
            </div>

            {/* Data Health */}
            <div>
              <div className="text-[10px] uppercase tracking-widest text-amber-600 mb-2 flex items-center gap-2">
                Integridad de datos
                {health && (
                  <span className={`px-1.5 py-0.5 text-[9px] rounded ${health.length === 0 ? 'bg-green-900 text-green-300' : 'bg-amber-800 text-amber-200'}`}>
                    {health.length === 0 ? 'sin hallazgos' : `${health.length} hallazgo${health.length > 1 ? 's' : ''}`}
                  </span>
                )}
              </div>
              <p className="text-zinc-600 text-[10px] font-mono mb-2">
                Comprueba consistencia estructural de todas las facciones (grupos vacíos, armas fantasma, referencias colgantes…). Solo lectura; no valida reglas.
              </p>
              <button
                onClick={handleRunHealth}
                disabled={healthRunning}
                className="text-[11px] px-3 py-1 border border-zinc-700 text-zinc-300 hover:text-amber-400 hover:border-amber-800 disabled:opacity-50 mb-2"
              >{healthRunning ? 'Analizando…' : 'Comprobar'}</button>
              {health && health.length > 0 && (
                <div className="space-y-0.5 max-h-72 overflow-y-auto border border-zinc-800 p-2">
                  {health.map((f, i) => (
                    <div key={i} className="text-[10px] font-mono flex gap-2">
                      <span className="text-amber-700 shrink-0 w-4">{f.category}</span>
                      <span className="text-zinc-500 shrink-0">{f.faction}{f.unit ? ` · ${f.unit}` : ''}</span>
                      <span className="text-zinc-400">{f.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
