import { useEffect, useState } from 'react';
import * as api from '../lib/api';
import { useLanguage, type Language } from '../i18n';
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

/** Local, admin-only translations (kept out of the global TranslationKey union). */
interface AdminTx {
  title: string;
  usersSaved: (u: number, r: number) => string;
  loading: string;
  reload: string;
  recoveryTitle: string;
  pending: (n: number) => string;
  noRequests: string;
  resolve: string;
  resolveConfirm: (u: string) => string;
  statusPending: string; statusResolved: string; statusCollected: string;
  active7: string; active30: string; admins: string; noArmies: string;
  searchPlaceholder: string;
  exportCsv: string;
  colUser: string; colRegistered: string; colLastSeen: string; colArmies: string; colActions: string;
  resetPw: string; makeAdmin: string; revokeAdmin: string; del: string;
  resetPwConfirm: (u: string) => string;
  deleteConfirm: (u: string) => string;
  promoteConfirm: (grant: boolean, u: string) => string;
  tempPw: string; recovery: string; hide: string;
  dataHealthTitle: string; dataHealthDesc: string; check: string; checking: string;
  noFindings: string; findings: (n: number) => string;
  exportDb: string;
  auditTitle: string; auditEmpty: string;
  armies: string; hideArmies: string; userNoArmies: string; publicBadge: string;
  delRoster: string; delRosterConfirm: (name: string) => string;
}

const ADMIN_I18N: Record<Language, AdminTx> = {
  en: {
    title: 'Inquisitor Panel',
    usersSaved: (u, r) => `${u} users · ${r} saved armies`,
    loading: 'Loading…',
    reload: 'Reload',
    recoveryTitle: 'Recovery requests',
    pending: n => `${n} pending`,
    noRequests: 'No requests.',
    resolve: 'Resolve',
    resolveConfirm: u => `Resolve request from "${u}"? New credentials will be generated.`,
    statusPending: 'pending', statusResolved: 'resolved', statusCollected: 'collected',
    active7: 'Active 7d', active30: 'Active 30d', admins: 'Inquisitors', noArmies: 'No armies',
    searchPlaceholder: 'Search user…',
    exportCsv: 'export CSV',
    colUser: 'User', colRegistered: 'Registered', colLastSeen: 'Last seen', colArmies: 'Armies', colActions: 'Actions',
    resetPw: 'reset pw', makeAdmin: '+inqui', revokeAdmin: '−inqui', del: 'del',
    resetPwConfirm: u => `Reset password for "${u}"?`,
    deleteConfirm: u => `DELETE account "${u}" and all their saves? This cannot be undone.`,
    promoteConfirm: (grant, u) => `${grant ? 'Grant' : 'Revoke'} Inquisitor for "${u}"?`,
    tempPw: 'Temp pw: ', recovery: 'Recovery: ', hide: 'hide',
    dataHealthTitle: 'Data health',
    dataHealthDesc: 'Checks structural consistency across all factions (empty groups, ghost weapons, dangling references…). Read-only; does not validate rules.',
    check: 'Check', checking: 'Checking…',
    noFindings: 'no findings', findings: n => `${n} finding${n > 1 ? 's' : ''}`,
    exportDb: 'export DB (JSON)',
    auditTitle: 'Audit log', auditEmpty: 'No actions logged yet.',
    armies: 'armies', hideArmies: 'hide', userNoArmies: 'This user has no saved armies.', publicBadge: 'public',
    delRoster: 'del', delRosterConfirm: name => `Delete the army "${name}"? This cannot be undone.`,
  },
  de: {
    title: 'Inquisitor-Panel',
    usersSaved: (u, r) => `${u} Nutzer · ${r} gespeicherte Armeen`,
    loading: 'Lädt…',
    reload: 'Neu laden',
    recoveryTitle: 'Wiederherstellungsanfragen',
    pending: n => `${n} ausstehend`,
    noRequests: 'Keine Anfragen.',
    resolve: 'Bearbeiten',
    resolveConfirm: u => `Anfrage von "${u}" bearbeiten? Es werden neue Zugangsdaten erzeugt.`,
    statusPending: 'ausstehend', statusResolved: 'erledigt', statusCollected: 'abgeholt',
    active7: 'Aktiv 7T', active30: 'Aktiv 30T', admins: 'Inquisitoren', noArmies: 'Ohne Armeen',
    searchPlaceholder: 'Nutzer suchen…',
    exportCsv: 'CSV export',
    colUser: 'Nutzer', colRegistered: 'Registriert', colLastSeen: 'Zuletzt gesehen', colArmies: 'Armeen', colActions: 'Aktionen',
    resetPw: 'PW zurücks.', makeAdmin: '+inqui', revokeAdmin: '−inqui', del: 'lösch.',
    resetPwConfirm: u => `Passwort für "${u}" zurücksetzen?`,
    deleteConfirm: u => `Konto "${u}" und alle Speicherstände LÖSCHEN? Kann nicht rückgängig gemacht werden.`,
    promoteConfirm: (grant, u) => `Inquisitor für "${u}" ${grant ? 'gewähren' : 'entziehen'}?`,
    tempPw: 'Temp-PW: ', recovery: 'Wiederherst.: ', hide: 'verbergen',
    dataHealthTitle: 'Datenintegrität',
    dataHealthDesc: 'Prüft die strukturelle Konsistenz aller Fraktionen (leere Gruppen, Geisterwaffen, ungültige Referenzen…). Nur Lesen; prüft keine Regeln.',
    check: 'Prüfen', checking: 'Prüfe…',
    noFindings: 'keine Befunde', findings: n => `${n} Befund${n > 1 ? 'e' : ''}`,
    exportDb: 'DB export (JSON)',
    auditTitle: 'Aktionsprotokoll', auditEmpty: 'Noch keine Aktionen protokolliert.',
    armies: 'Armeen', hideArmies: 'verbergen', userNoArmies: 'Dieser Nutzer hat keine gespeicherten Armeen.', publicBadge: 'öffentlich',
    delRoster: 'lösch.', delRosterConfirm: name => `Armee "${name}" löschen? Kann nicht rückgängig gemacht werden.`,
  },
  es: {
    title: 'Panel Inquisidor',
    usersSaved: (u, r) => `${u} usuarios · ${r} ejércitos guardados`,
    loading: 'Cargando…',
    reload: 'Recargar',
    recoveryTitle: 'Solicitudes de recuperación',
    pending: n => `${n} pendiente${n > 1 ? 's' : ''}`,
    noRequests: 'Sin solicitudes.',
    resolve: 'Resolver',
    resolveConfirm: u => `¿Resolver solicitud de "${u}"? Se generarán nuevas credenciales.`,
    statusPending: 'pendiente', statusResolved: 'resuelta', statusCollected: 'recogida',
    active7: 'Activos 7d', active30: 'Activos 30d', admins: 'Inquisidores', noArmies: 'Sin ejércitos',
    searchPlaceholder: 'Buscar usuario…',
    exportCsv: 'exportar CSV',
    colUser: 'Usuario', colRegistered: 'Registro', colLastSeen: 'Última vez', colArmies: 'Ejércitos', colActions: 'Acciones',
    resetPw: 'reset pw', makeAdmin: '+inqui', revokeAdmin: '−inqui', del: 'borrar',
    resetPwConfirm: u => `¿Resetear la contraseña de "${u}"?`,
    deleteConfirm: u => `¿BORRAR la cuenta "${u}" y todos sus guardados? No se puede deshacer.`,
    promoteConfirm: (grant, u) => `¿${grant ? 'Otorgar' : 'Retirar'} Inquisidor a "${u}"?`,
    tempPw: 'Contraseña temp: ', recovery: 'Recuperación: ', hide: 'ocultar',
    dataHealthTitle: 'Integridad de datos',
    dataHealthDesc: 'Comprueba consistencia estructural de todas las facciones (grupos vacíos, armas fantasma, referencias colgantes…). Solo lectura; no valida reglas.',
    check: 'Comprobar', checking: 'Analizando…',
    noFindings: 'sin hallazgos', findings: n => `${n} hallazgo${n > 1 ? 's' : ''}`,
    exportDb: 'exportar BD (JSON)',
    auditTitle: 'Registro de acciones', auditEmpty: 'Sin acciones registradas todavía.',
    armies: 'ejércitos', hideArmies: 'ocultar', userNoArmies: 'Este usuario no tiene ejércitos guardados.', publicBadge: 'público',
    delRoster: 'borrar', delRosterConfirm: name => `¿Borrar el ejército "${name}"? No se puede deshacer.`,
  },
};

export function AdminPanel({ onClose }: Props) {
  const { language } = useLanguage();
  const L = ADMIN_I18N[language] ?? ADMIN_I18N.en;

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
  const [auditLog, setAuditLog] = useState<api.AdminAction[]>([]);
  const [expandedUser, setExpandedUser] = useState<number | null>(null);
  const [userRosters, setUserRosters] = useState<Record<number, api.AdminRosterRow[]>>({});
  const [exporting, setExporting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [s, r, a] = await Promise.all([
        api.adminStats(),
        api.adminListRecoveryRequests(),
        api.adminActions().catch(() => ({ actions: [] })),
      ]);
      setStats(s);
      setRequests(r.requests);
      setAuditLog(a.actions);
    } catch (e) { setMsg(String(e)); }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const statusLabel = (s: api.RecoveryRequest['status']) =>
    s === 'pending' ? L.statusPending : s === 'resolved' ? L.statusResolved : L.statusCollected;

  async function handleResolve(requestId: number, username: string) {
    if (!confirm(L.resolveConfirm(username))) return;
    setResolving(requestId);
    try {
      await api.adminResolveRecovery(requestId);
      setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'resolved' as const } : r));
    } catch (e) { setMsg(String(e)); }
    finally { setResolving(null); }
  }

  async function handleResetPw(userId: number, username: string) {
    if (!confirm(L.resetPwConfirm(username))) return;
    try {
      const r = await api.adminResetPw(userId);
      setRevealed(prev => ({ ...prev, [userId]: { pw: r.tempPassword, rc: r.recoveryCode } }));
      await load();
    } catch (e) { setMsg(String(e)); }
  }

  async function handleDelete(userId: number, username: string) {
    if (!confirm(L.deleteConfirm(username))) return;
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
    if (!confirm(L.promoteConfirm(makeAdmin, username))) return;
    try {
      await api.adminPromote(userId, makeAdmin);
      await load();
    } catch (e) { setMsg(String(e)); }
  }

  async function handleExport() {
    setExporting(true);
    try {
      const data = await api.adminExport();
      downloadText(`custom40k-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(data, null, 2), 'application/json');
    } catch (e) { setMsg(String(e)); }
    finally { setExporting(false); }
  }

  async function toggleUserRosters(userId: number) {
    if (expandedUser === userId) { setExpandedUser(null); return; }
    setExpandedUser(userId);
    if (!userRosters[userId]) {
      try {
        const r = await api.adminUserRosters(userId);
        setUserRosters(prev => ({ ...prev, [userId]: r.rosters }));
      } catch (e) { setMsg(String(e)); }
    }
  }

  async function handleDelRoster(rosterId: number, userId: number, name: string) {
    if (!confirm(L.delRosterConfirm(name))) return;
    try {
      await api.adminDelRoster(rosterId);
      setUserRosters(prev => ({ ...prev, [userId]: (prev[userId] ?? []).filter(r => r.id !== rosterId) }));
      setStats(prev => prev && { ...prev, totalRosters: prev.totalRosters - 1, users: prev.users.map(u => u.id === userId ? { ...u, roster_count: Math.max(0, u.roster_count - 1) } : u) });
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
  const pendingCount = requests.filter(r => r.status === 'pending').length;

  const toolbarBtn = 'text-[11px] px-3 py-1 border border-zinc-700 text-zinc-300 hover:text-amber-400 hover:border-amber-800 disabled:opacity-50';

  return (
    <div className="fixed inset-0 bg-black/90 flex items-start justify-center z-[60] p-4 overflow-y-auto" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-zinc-950 border border-zinc-700 w-full max-w-4xl my-4">

        <div className="flex justify-between items-center px-4 py-3 bg-zinc-900 border-b border-zinc-700">
          <div className="flex items-center gap-3">
            <span className="text-zinc-300 text-sm font-mono uppercase tracking-widest">{L.title}</span>
            {stats && (
              <span className="text-zinc-500 text-xs font-mono">{L.usersSaved(stats.totalUsers, stats.totalRosters)}</span>
            )}
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white text-xl">✕</button>
        </div>

        {/* Options toolbar — every action visible on entry */}
        <div className="flex flex-wrap items-center gap-2 px-4 py-2 border-b border-zinc-800 bg-zinc-900/40">
          <button onClick={load} disabled={loading} className={toolbarBtn}>↻ {L.reload}</button>
          <button onClick={handleRunHealth} disabled={healthRunning} className={toolbarBtn}>{healthRunning ? L.checking : L.dataHealthTitle}</button>
          <button
            onClick={() => downloadText(`custom40k-users-${new Date().toISOString().slice(0, 10)}.csv`, usersToCsv(allUsers))}
            disabled={allUsers.length === 0}
            className={toolbarBtn}
          >{L.exportCsv}</button>
          <button onClick={handleExport} disabled={exporting} className={toolbarBtn}>{L.exportDb}</button>
          {pendingCount > 0 && (
            <span className="bg-amber-800 text-amber-200 px-1.5 py-0.5 text-[9px] rounded font-mono">{L.pending(pendingCount)}</span>
          )}
        </div>

        {msg && <div className="mx-4 mt-3 text-red-400 text-xs font-mono bg-red-950/30 border border-red-800/50 px-3 py-2">{msg}</div>}

        {loading ? (
          <div className="p-8 text-center text-zinc-600 text-sm">{L.loading}</div>
        ) : !stats ? null : (
          <div className="p-4 space-y-6">
            {/* Recovery requests */}
            <div>
              <div className="text-[10px] uppercase tracking-widest text-amber-600 mb-2 flex items-center gap-2">
                {L.recoveryTitle}
                {pendingCount > 0 && (
                  <span className="bg-amber-800 text-amber-200 px-1.5 py-0.5 text-[9px] rounded">{L.pending(pendingCount)}</span>
                )}
              </div>
              {requests.length === 0 ? (
                <p className="text-zinc-600 text-xs font-mono italic">{L.noRequests}</p>
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
                        }`}>{statusLabel(r.status)}</span>
                        {r.status === 'pending' && (
                          <button
                            onClick={() => handleResolve(r.id, r.username)}
                            disabled={resolving === r.id}
                            className="text-[10px] px-2 py-0.5 border border-amber-700 text-amber-400 hover:bg-amber-900/30 disabled:opacity-50"
                          >{resolving === r.id ? '…' : L.resolve}</button>
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
                { label: L.active7, value: active7 },
                { label: L.active30, value: active30 },
                { label: L.admins, value: adminCount },
                { label: L.noArmies, value: emptyCount },
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
                placeholder={L.searchPlaceholder}
                className="flex-1 bg-zinc-900 border border-zinc-800 px-2 py-1 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-800"
              />
              <span className="text-zinc-600 text-[10px] font-mono">{visibleUsers.length}/{allUsers.length}</span>
            </div>
            <table className="w-full text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th onClick={() => toggleSort('username')} className="text-left py-2 pr-3 text-zinc-500 font-normal cursor-pointer hover:text-zinc-300 select-none">{L.colUser}{arrow('username')}</th>
                  <th onClick={() => toggleSort('created_at')} className="text-left py-2 pr-3 text-zinc-500 font-normal cursor-pointer hover:text-zinc-300 select-none">{L.colRegistered}{arrow('created_at')}</th>
                  <th onClick={() => toggleSort('last_seen_at')} className="text-left py-2 pr-3 text-zinc-500 font-normal cursor-pointer hover:text-zinc-300 select-none">{L.colLastSeen}{arrow('last_seen_at')}</th>
                  <th onClick={() => toggleSort('roster_count')} className="text-center py-2 pr-3 text-zinc-500 font-normal cursor-pointer hover:text-zinc-300 select-none">{L.colArmies}{arrow('roster_count')}</th>
                  <th className="py-2 text-zinc-500 font-normal text-right">{L.colActions}</th>
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
                            onClick={() => toggleUserRosters(u.id)}
                            disabled={u.roster_count === 0}
                            className="text-[11px] px-2 py-0.5 border border-zinc-700 text-zinc-400 hover:text-amber-400 hover:border-amber-800 disabled:opacity-40"
                          >{expandedUser === u.id ? L.hideArmies : `${L.armies} (${u.roster_count})`}</button>
                          <button
                            onClick={() => handleResetPw(u.id, u.username)}
                            className="text-[11px] px-2 py-0.5 border border-zinc-700 text-zinc-400 hover:text-amber-400 hover:border-amber-800"
                          >{L.resetPw}</button>
                          <button
                            onClick={() => handlePromote(u.id, u.username, !u.is_admin)}
                            className="text-[11px] px-2 py-0.5 border border-zinc-700 text-zinc-400 hover:text-amber-400 hover:border-amber-800"
                          >{u.is_admin ? L.revokeAdmin : L.makeAdmin}</button>
                          <button
                            onClick={() => handleDelete(u.id, u.username)}
                            className="text-[11px] px-2 py-0.5 border border-red-900/50 text-red-700 hover:text-red-400 hover:border-red-700"
                          >{L.del}</button>
                        </div>
                      </td>
                    </tr>
                    {revealed[u.id] && (
                      <tr key={`${u.id}-rev`} className="bg-zinc-900/60">
                        <td colSpan={5} className="px-3 py-2 text-[11px]">
                          <span className="text-zinc-500">{L.tempPw}</span>
                          <span className="text-green-400 select-all">{revealed[u.id].pw}</span>
                          <span className="text-zinc-500 ml-4">{L.recovery}</span>
                          <span className="text-amber-400 select-all">{revealed[u.id].rc}</span>
                          <button onClick={() => setRevealed(p => { const n={...p}; delete n[u.id]; return n; })} className="ml-4 text-zinc-600 hover:text-zinc-400">{L.hide}</button>
                        </td>
                      </tr>
                    )}
                    {expandedUser === u.id && (
                      <tr key={`${u.id}-arm`} className="bg-zinc-900/40">
                        <td colSpan={5} className="px-3 py-2">
                          {(userRosters[u.id] ?? []).length === 0 ? (
                            <p className="text-zinc-600 text-[10px] font-mono italic">{L.userNoArmies}</p>
                          ) : (
                            <div className="space-y-1">
                              {(userRosters[u.id] ?? []).map(r => (
                                <div key={r.id} className="flex items-center gap-2 text-[10px] font-mono">
                                  <span className="text-zinc-200 flex-1 truncate">{r.name}</span>
                                  {r.faction && <span className="text-zinc-500">{r.faction}</span>}
                                  {r.is_public && <span className="text-green-600">{L.publicBadge}</span>}
                                  <span className="text-zinc-600">{fmt(r.updated_at)}</span>
                                  <button
                                    onClick={() => handleDelRoster(r.id, u.id, r.name)}
                                    className="px-1.5 py-0.5 border border-red-900/50 text-red-700 hover:text-red-400 hover:border-red-700"
                                  >{L.delRoster}</button>
                                </div>
                              ))}
                            </div>
                          )}
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
                {L.dataHealthTitle}
                {health && (
                  <span className={`px-1.5 py-0.5 text-[9px] rounded ${health.length === 0 ? 'bg-green-900 text-green-300' : 'bg-amber-800 text-amber-200'}`}>
                    {health.length === 0 ? L.noFindings : L.findings(health.length)}
                  </span>
                )}
              </div>
              <p className="text-zinc-600 text-[10px] font-mono mb-2">{L.dataHealthDesc}</p>
              <button
                onClick={handleRunHealth}
                disabled={healthRunning}
                className="text-[11px] px-3 py-1 border border-zinc-700 text-zinc-300 hover:text-amber-400 hover:border-amber-800 disabled:opacity-50 mb-2"
              >{healthRunning ? L.checking : L.check}</button>
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

            {/* Audit log */}
            <div>
              <div className="text-[10px] uppercase tracking-widest text-amber-600 mb-2">{L.auditTitle}</div>
              {auditLog.length === 0 ? (
                <p className="text-zinc-600 text-xs font-mono italic">{L.auditEmpty}</p>
              ) : (
                <div className="space-y-0.5 max-h-72 overflow-y-auto border border-zinc-800 p-2">
                  {auditLog.map(a => (
                    <div key={a.id} className="text-[10px] font-mono flex gap-2">
                      <span className="text-zinc-600 shrink-0">{fmt(a.created_at)}</span>
                      <span className="text-amber-500 shrink-0">{a.admin_username ?? '—'}</span>
                      <span className="text-zinc-300 shrink-0">{a.action}</span>
                      <span className="text-zinc-400 truncate">{a.target_username ?? ''}{a.detail ? ` · ${a.detail}` : ''}</span>
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
