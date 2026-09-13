import { useCallback, useEffect, useState } from 'react';
import * as api from '../lib/api';
import { LeagueSheet } from './LeagueSheet';
import { factionLabel } from '../utils/factionLabel';

/**
 * Events & Leagues (ALPHA) — built to Dominic's requirements doc (2026-09-13).
 *
 * One modal covers the whole feature because the nine requirements are really two screens: an INDEX
 * of events, and one EVENT with four tabs. Splitting it further would mean threading the same
 * event id and refresh callbacks through several files for no gain.
 *
 * An event and a league are the same thing here, exactly as in the API: `is_league` only decides
 * whether the STANDINGS tab appears.
 *
 * The one rule worth remembering while reading this: a reported game shows up immediately but
 * counts for nothing until the OPPONENT confirms it, so the Games tab has to make the difference
 * between "reported" and "confirmed" obvious, and the person who must act has to see that it is
 * their turn.
 */

type TabId = 'info' | 'players' | 'games' | 'standings';

interface Props {
  onClose: () => void;
  /** Current user's name, so the UI can tell "you" from "them" without another round trip. */
  username: string;
  isAdmin: boolean;
}

const box = 'w-full bg-zinc-900 border border-zinc-800 px-2 py-1 text-[12px] text-zinc-200 focus:outline-none focus:border-amber-800';
const btn = 'text-[11px] px-3 py-1 border border-zinc-700 text-zinc-300 hover:border-amber-700 hover:text-amber-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed';
const btnPrimary = 'text-[11px] px-3 py-1 border border-amber-800 text-amber-300 hover:bg-amber-950/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed';

/** Postgres COUNT() arrives as a string; render it as a number without pretending it was one. */
const n = (v: string | number | undefined) => Number(v ?? 0);

const dateOnly = (v: string | null) => (v ? String(v).slice(0, 10) : '');

export function EventsModal({ onClose, username, isAdmin }: Props) {
  const [events, setEvents] = useState<api.EventSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openId, setOpenId] = useState<number | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const r = await api.listEvents();
      setEvents(r.events);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  return (
    <div
      className="fixed inset-0 bg-black/90 flex items-start justify-center z-50 p-4 overflow-y-auto"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-zinc-950 border border-zinc-700 w-full max-w-3xl my-4">
        <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="text-amber-500 text-sm tracking-widest uppercase">⚔ Events &amp; Leagues</span>
            <span className="text-[9px] px-1.5 py-0.5 border border-red-800 text-red-400 tracking-wide">ALPHA</span>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-200 text-lg leading-none">✕</button>
        </div>

        <div className="p-4 space-y-4">
          {error && <p className="text-red-400 text-[11px] font-mono">{error}</p>}

          {openId == null
            ? <EventIndex
                events={events} loading={loading} isAdmin={isAdmin}
                onOpen={setOpenId} onRefresh={refresh} onError={setError}
              />
            : <EventDetail
                eventId={openId} username={username} isAdmin={isAdmin}
                onBack={() => { setOpenId(null); void refresh(); }} onError={setError}
              />}
        </div>
      </div>
    </div>
  );
}

// ── index ────────────────────────────────────────────────────────────────────────────────────────

function EventIndex({ events, loading, isAdmin, onOpen, onRefresh, onError }: {
  events: api.EventSummary[]; loading: boolean; isAdmin: boolean;
  onOpen: (id: number) => void; onRefresh: () => Promise<void>; onError: (m: string) => void;
}) {
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState(false);
  /** 0 = idle · 1 = "really?" · 2 = "completely sure?" — see handleResetTest. */
  const [resetStep, setResetStep] = useState(0);
  const [form, setForm] = useState<api.NewEvent>({
    name: '', description: '', visibility: 'public', isLeague: true, isTest: true,
  });

  async function handleCreate() {
    if (!form.name.trim()) { onError('Give the event a name.'); return; }
    setBusy(true); onError('');
    try {
      await api.createEvent(form);
      setForm({ name: '', description: '', visibility: 'public', isLeague: true, isTest: true });
      setCreating(false);
      await onRefresh();
    } catch (err) {
      onError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  /**
   * Two questions, both in the page rather than a browser dialog.
   *
   * This throws away every test event, every puppet player and their armies at once, and a single
   * dialog is one stray Enter away from doing it. The second step is also deliberately NOT a
   * `confirm()`: a suppressed dialog returns false silently in some embedded browsers, so a
   * destructive action should never depend on one.
   */
  async function handleResetTest() {
    setBusy(true); onError('');
    try {
      const r = await api.resetTestEvents();
      onError(`${r.deleted} test event(s) and ${r.deletedUsers} test account(s) deleted.`);
      setResetStep(0);
      await onRefresh();
    } catch (err) {
      onError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <p className="text-zinc-500 text-[10px] italic">
          Early preview — organisers can run events and leagues, players register and report games.
        </p>
        <div className="flex gap-2 shrink-0">
          <button className={btnPrimary} onClick={() => setCreating(v => !v)}>
            {creating ? 'Cancel' : '+ New event'}
          </button>
          {isAdmin && resetStep === 0 && (
            <button className={btn} onClick={() => setResetStep(1)} disabled={busy}
                    title="Delete every event, player and army flagged as test data">
              Reset test data
            </button>
          )}
        </div>
      </div>

      {resetStep > 0 && (
        <div className="border border-red-800 bg-red-950/20 p-3 space-y-2">
          <p className="text-red-300 text-[12px]">
            {resetStep === 1
              ? 'Do you really want to reset the league? This deletes every test event, every test player and their armies.'
              : 'Are you completely sure? This cannot be undone.'}
          </p>
          <div className="flex gap-2">
            <button className="text-[11px] px-3 py-1 border border-red-700 text-red-300 hover:bg-red-900/30 disabled:opacity-40"
                    disabled={busy}
                    onClick={() => (resetStep === 1 ? setResetStep(2) : handleResetTest())}>
              {resetStep === 1 ? 'Yes, reset' : busy ? 'Resetting\u2026' : 'Yes, delete everything'}
            </button>
            <button className={btn} disabled={busy} onClick={() => setResetStep(0)}>No, cancel</button>
          </div>
        </div>
      )}

      {creating && (
        <div className="border border-zinc-800 p-3 space-y-2">
          <input className={box} placeholder="Event name" value={form.name}
                 onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <textarea className={`${box} h-16 resize-y`} placeholder="Description" value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <div className="grid grid-cols-2 gap-2">
            <label className="text-[10px] text-zinc-500">Starts
              <input type="date" className={box} value={form.startsOn ?? ''}
                     onChange={e => setForm(f => ({ ...f, startsOn: e.target.value || null }))} /></label>
            <label className="text-[10px] text-zinc-500">Ends
              <input type="date" className={box} value={form.endsOn ?? ''}
                     onChange={e => setForm(f => ({ ...f, endsOn: e.target.value || null }))} /></label>
            <label className="text-[10px] text-zinc-500">Registration opens
              <input type="date" className={box} value={form.regOpensOn ?? ''}
                     onChange={e => setForm(f => ({ ...f, regOpensOn: e.target.value || null }))} /></label>
            <label className="text-[10px] text-zinc-500">Registration closes
              <input type="date" className={box} value={form.regClosesOn ?? ''}
                     onChange={e => setForm(f => ({ ...f, regClosesOn: e.target.value || null }))} /></label>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-zinc-300">
            <label className="flex items-center gap-1.5">
              <input type="checkbox" checked={form.visibility === 'private'}
                     onChange={e => setForm(f => ({ ...f, visibility: e.target.checked ? 'private' : 'public' }))} />
              Private <span className="text-zinc-600">(you approve each player)</span>
            </label>
            <label className="flex items-center gap-1.5">
              <input type="checkbox" checked={form.isLeague === true}
                     onChange={e => setForm(f => ({ ...f, isLeague: e.target.checked }))} />
              League <span className="text-zinc-600">(keeps a leaderboard)</span>
            </label>
            <label className="flex items-center gap-1.5">
              <input type="checkbox" checked={form.isTest === true}
                     onChange={e => setForm(f => ({ ...f, isTest: e.target.checked }))} />
              Test data <span className="text-zinc-600">(wiped by Reset)</span>
            </label>
          </div>
          <button className={btnPrimary} onClick={handleCreate} disabled={busy}>
            {busy ? 'Creating…' : 'Create event'}
          </button>
        </div>
      )}

      {loading
        ? <p className="text-zinc-500 text-[11px]">Loading…</p>
        : events.length === 0
          ? <p className="text-zinc-600 text-[11px] italic">No events yet.</p>
          : (
            <div className="space-y-1.5">
              {events.map(ev => (
                <button key={ev.id} onClick={() => onOpen(ev.id)}
                        className="w-full text-left border border-zinc-800 hover:border-amber-800 px-3 py-2 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-zinc-200 text-[13px]">{ev.name}</span>
                    <span className="flex items-center gap-1.5 shrink-0">
                      {ev.is_test && <Tag className="border-zinc-700 text-zinc-500">TEST</Tag>}
                      {/* Closed is not hidden: the league is listed, and opening it still shows the
                          standings and every game. The tag says only that it cannot be joined. */}
                      {!ev.published && <Tag className="border-zinc-700 text-zinc-500">CLOSED</Tag>}
                      {ev.visibility === 'private' && <Tag className="border-zinc-700 text-zinc-400">PRIVATE</Tag>}
                      {ev.is_league && <Tag className="border-amber-900 text-amber-500">LEAGUE</Tag>}
                      {ev.my_status && <Tag className="border-emerald-900 text-emerald-500">{ev.my_status.toUpperCase()}</Tag>}
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                    {ev.organiser} · {n(ev.player_count)} player(s)
                    {ev.starts_on && ` · ${dateOnly(ev.starts_on)}${ev.ends_on ? ` → ${dateOnly(ev.ends_on)}` : ''}`}
                  </div>
                </button>
              ))}
            </div>
          )}
    </>
  );
}

function Tag({ children, className }: { children: React.ReactNode; className: string }) {
  return <span className={`text-[9px] px-1.5 py-0.5 border tracking-wide ${className}`}>{children}</span>;
}

// ── one event ────────────────────────────────────────────────────────────────────────────────────

function EventDetail({ eventId, username, isAdmin, onBack, onError }: {
  eventId: number; username: string; isAdmin: boolean;
  onBack: () => void; onError: (m: string) => void;
}) {
  const [tab, setTab] = useState<TabId>('info');
  const [data, setData] = useState<Awaited<ReturnType<typeof api.getEvent>> | null>(null);
  const [players, setPlayers] = useState<api.EventPlayer[]>([]);
  const [games, setGames] = useState<api.EventGame[]>([]);
  const [standings, setStandings] = useState<api.EventStanding[]>([]);
  const [myRosters, setMyRosters] = useState<{ id: number; name: string }[]>([]);
  const [busy, setBusy] = useState(false);
  // Closed alpha: an admin can drive any PUPPET player in this event, so the whole report →
  // confirm loop can be exercised alone instead of logging in and out of real accounts.
  const [actingAs, setActingAs] = useState<number | ''>('');
  const [seedCount, setSeedCount] = useState(4);
  const [showSheet, setShowSheet] = useState(false);
  // Reported by a player: picking a list in the dropdown used to save it on the spot, so there was
  // nothing to press and no moment where you were told you had registered it. The dropdown is now
  // only a DRAFT; `listDraft` is what you have picked, `data.me.roster_id` is what is registered,
  // and the button between them is the confirmation.
  const [listDraft, setListDraft] = useState<number | ''>('');

  const load = useCallback(async () => {
    onError('');
    try {
      const [ev, pl, gm] = await Promise.all([
        api.getEvent(eventId), api.listEventPlayers(eventId), api.listEventGames(eventId),
      ]);
      setData(ev); setPlayers(pl.players); setGames(gm.games);
      if (ev.event.is_league) setStandings((await api.getEventStandings(eventId)).standings);
    } catch (err) {
      onError((err as Error).message);
    }
  }, [eventId, onError]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { setListDraft(data?.me?.roster_id ?? ''); }, [data?.me?.roster_id, actingAs]);
  useEffect(() => {
    // Only needed for the list picker, and only once the player is actually approved.
    if (data?.me?.status !== 'approved') return;
    void api.listRosters().then(r => setMyRosters(r.rosters.map(x => ({ id: x.id, name: x.name })))).catch(() => {});
  }, [data?.me?.status]);

  if (!data) return <p className="text-zinc-500 text-[11px]">Loading…</p>;
  const ev = data.event;

  const act = async (fn: () => Promise<unknown>) => {
    setBusy(true); onError('');
    try { await fn(); await load(); } catch (err) { onError((err as Error).message); } finally { setBusy(false); }
  };

  const puppets = players.filter(p => p.is_test);
  /** undefined when acting as yourself — the API only accepts the override from an admin. */
  const as = actingAs === '' ? undefined : Number(actingAs);
  const asPlayer = puppets.find(p => p.user_id === as);
  /** Who the Games tab should treat as "me" when deciding whose turn it is to confirm. */
  const actingName = asPlayer?.username ?? username;

  const TABS: { key: TabId; label: string }[] = [
    { key: 'info', label: 'INFO' },
    { key: 'players', label: `PLAYERS (${players.filter(p => p.status === 'approved').length})` },
    { key: 'games', label: `GAMES (${games.length})` },
    ...(ev.is_league ? [{ key: 'standings' as TabId, label: 'STANDINGS' }] : []),
  ];

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <button className={btn} onClick={onBack}>← All events</button>
        <div className="flex items-center gap-1.5">
          {/* A league is months of other people's results living in one database, so it gets a copy
              that is not the database — and a sheet you can print or drop in Discord. */}
          <button className={btn} disabled={busy} title="Download the whole league as a .json backup"
                  onClick={() => act(async () => {
                    const data = await api.exportEvent(ev.id);
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${ev.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-league.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  })}>
            ⤓ Backup
          </button>
          <button className={btn} onClick={() => setShowSheet(true)} title="Printable sheet — print or save as PDF">
            🖨 Sheet
          </button>
          {ev.is_test && <Tag className="border-zinc-700 text-zinc-500">TEST</Tag>}
          {!data.open && <Tag className="border-zinc-700 text-zinc-500">CLOSED</Tag>}
          {ev.visibility === 'private' && <Tag className="border-zinc-700 text-zinc-400">PRIVATE</Tag>}
          {ev.is_league && <Tag className="border-amber-900 text-amber-500">LEAGUE</Tag>}
        </div>
      </div>

      <div>
        <h3 className="text-amber-400 text-[15px]">{ev.name}</h3>
        <p className="text-[10px] text-zinc-500 font-mono">
          organised by {ev.organiser}
          {ev.starts_on && ` · ${dateOnly(ev.starts_on)}${ev.ends_on ? ` → ${dateOnly(ev.ends_on)}` : ''}`}
        </p>
      </div>

      {isAdmin && (
        <div className="border border-red-900/50 bg-red-950/10 p-2 space-y-2">
          <div className="text-[10px] uppercase tracking-widest text-red-400">Alpha testing</div>
          {puppets.length === 0 ? (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-zinc-400 text-[11px]">Fill this event with fake players and armies:</span>
              <input type="number" min={2} max={12} value={seedCount}
                     onChange={e => setSeedCount(Number(e.target.value))}
                     className="w-16 bg-zinc-900 border border-zinc-800 px-2 py-1 text-[12px] text-zinc-200" />
              <button className={btnPrimary} disabled={busy}
                      onClick={() => act(() => api.seedTestPlayers(ev.id, seedCount))}>
                Seed players
              </button>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-zinc-400 text-[11px]">Acting as:</span>
                <select className="bg-zinc-900 border border-zinc-800 px-2 py-1 text-[12px] text-zinc-200"
                        value={actingAs} onChange={e => setActingAs(e.target.value ? Number(e.target.value) : '')}>
                  <option value="">{username} (you)</option>
                  {puppets.map(p => (
                    <option key={p.user_id} value={p.user_id}>
                      {p.username}{p.faction ? ` — ${factionLabel(p.faction)}` : ''}
                    </option>
                  ))}
                </select>
                <button className={btn} disabled={busy}
                        onClick={() => act(() => api.seedTestPlayers(ev.id, seedCount))}>
                  + more
                </button>
              </div>
              <p className="text-zinc-600 text-[10px]">
                Everything you do below happens as that player — report a game as one, then switch and
                confirm it as the other. Fake players and their armies are deleted by “Reset test data”.
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-1 flex-wrap border-b border-zinc-800 pb-2">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
                  className={`text-[10px] px-2.5 py-1 border font-mono uppercase tracking-wider ${
                    tab === t.key ? 'border-amber-700 text-amber-400 bg-amber-950/20' : 'border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'info' && (
        <div className="space-y-3">
          {ev.description && <p className="text-zinc-300 text-[12px] whitespace-pre-wrap">{ev.description}</p>}
          <p className="text-[10px] text-zinc-500 font-mono">
            {!data.open ? 'League CLOSED' : `Registration ${data.registrationOpen ? 'OPEN' : 'CLOSED'}`}
            {ev.reg_opens_on && ` · from ${dateOnly(ev.reg_opens_on)}`}
            {ev.reg_closes_on && ` · until ${dateOnly(ev.reg_closes_on)}`}
          </p>

          {/* A closed league is still worth opening: whoever finds it can read the standings and
              every confirmed game, whether the season is over or has not started. Only joining and
              reporting are shut, so say which of the two reasons applies. */}
          {!data.open && (
            <p className="text-zinc-500 text-[11px] italic">
              This league is closed — {!data.canManage
                ? 'the organiser has not opened it yet. You can still read the standings and the games played.'
                : ev.is_test
                  ? 'so no games can be reported into it yet. Open it below — a test event stays admin-only either way.'
                  : 'open it below when you are ready for players to join.'}
            </p>
          )}

          {/* On a TEST event this says "open" rather than "open to players", because opening one
              never exposes it: `is_test` is what gates who can see it, and it is checked separately
              from `published`. Opening only unlocks registering and reporting. */}
          {data.canManage && (
            <button className={data.open ? btn : btnPrimary} disabled={busy}
                    onClick={() => act(() => api.publishEvent(ev.id, !data.open))}>
              {data.open ? 'Close league' : ev.is_test ? 'Open for reporting' : 'Open league to players'}
            </button>
          )}

          {!data.me && data.open && (
            <button className={btnPrimary} disabled={busy || !data.registrationOpen}
                    onClick={() => act(() => api.registerForEvent(ev.id))}>
              {ev.visibility === 'public' ? 'Register' : 'Request to join'}
            </button>
          )}
          {data.me?.status === 'pending' && (
            <p className="text-amber-500/80 text-[11px]">Your request is waiting for the organiser.</p>
          )}
          {data.me?.status === 'rejected' && (
            <div className="space-y-2">
              <p className="text-red-400 text-[11px]">Your request was declined.</p>
              <button className={btn} disabled={busy} onClick={() => act(() => api.registerForEvent(ev.id))}>Ask again</button>
            </div>
          )}

          {data.me?.status === 'approved' && (() => {
            const registered = data.me.roster_id ?? '';
            const pending = listDraft !== registered;
            const registeredName = myRosters.find(r => r.id === registered)?.name ?? null;
            return (
              <div className="border border-zinc-800 p-3 space-y-2">
                <div className="text-[10px] uppercase tracking-widest text-amber-600">Your army list</div>
                <select className={box} value={listDraft} disabled={busy || data.listLock != null}
                        onChange={e => setListDraft(e.target.value ? Number(e.target.value) : '')}>
                  <option value="">— none chosen —</option>
                  {myRosters.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>

                {/* Nothing is registered until this is pressed, and the button says which of the
                    three things pressing it will do. It disables itself once what you picked and
                    what is registered are the same, so it doubles as the state readout. */}
                <button className={pending ? btnPrimary : btn} disabled={busy || !pending || data.listLock != null}
                        onClick={() => act(() => api.assignEventList(ev.id, listDraft === '' ? null : listDraft, as))}>
                  {!pending ? 'Army list confirmed'
                    : listDraft === '' ? 'Withdraw my army list'
                    : registered === '' ? 'Confirm this army list'
                    : 'Change to this army list'}
                </button>

                {data.listLock ? (
                  <p className="text-zinc-500 text-[11px] italic">
                    {data.listLock}
                    {registeredName && ` You are in with “${registeredName}”.`}
                  </p>
                ) : pending ? (
                  <p className="text-amber-500/80 text-[10px]">
                    Not registered yet — press the button to confirm.
                    {registeredName && ` You are still registered with “${registeredName}”.`}
                  </p>
                ) : registeredName ? (
                  <p className="text-emerald-500/80 text-[10px]">
                    ✓ Registered for this event with “{registeredName}”.
                  </p>
                ) : (
                  <p className="text-zinc-600 text-[10px]">You have no army list registered for this event yet.</p>
                )}
              </div>
            );
          })()}

          {data.canManage && (
            <button className={btn} disabled={busy}
                    onClick={() => {
                      if (!window.confirm(`Delete "${ev.name}"? Its players and reported games go with it.`)) return;
                      void act(async () => { await api.deleteEvent(ev.id); onBack(); });
                    }}>
              Delete event
            </button>
          )}
        </div>
      )}

      {tab === 'players' && (
        <PlayersTab players={players} canManage={data.canManage} busy={busy}
                    onSet={(uid, st) => act(() => api.setEventPlayerStatus(ev.id, uid, st))} />
      )}

      {tab === 'games' && (
        <GamesTab
          games={games} players={players} username={actingName} busy={busy}
          canReport={data.me?.status === 'approved' || asPlayer != null}
          onReport={g => act(() => api.reportEventGame(ev.id, g, as))}
          onConfirm={(gid, ok, note) => act(() => api.confirmEventGame(gid, ok, note, as))}
          canManage={data.canManage}
          onSettle={(gid, what, result) => act(() => api.settleEventGame(gid, what, result ? { result } : {}))}
        />
      )}

      {tab === 'standings' && <StandingsTab standings={standings} />}

      {isAdmin && ev.is_test && (
        <p className="text-zinc-600 text-[10px] italic">Test event — removed by “Reset test data” on the index.</p>
      )}

      {showSheet && (
        <LeagueSheet event={ev} standings={standings} players={players} games={games}
                     onClose={() => setShowSheet(false)} />
      )}
    </>
  );
}

// ── tabs ─────────────────────────────────────────────────────────────────────────────────────────

function PlayersTab({ players, canManage, busy, onSet }: {
  players: api.EventPlayer[]; canManage: boolean; busy: boolean;
  onSet: (userId: number, status: api.EventPlayer['status']) => void;
}) {
  if (players.length === 0) return <p className="text-zinc-600 text-[11px] italic">Nobody has registered yet.</p>;
  const pending = players.filter(p => p.status === 'pending');
  const approved = players.filter(p => p.status === 'approved');
  const rejected = players.filter(p => p.status === 'rejected');

  const row = (p: api.EventPlayer) => (
    <div key={p.user_id} className="flex items-center justify-between gap-2 border border-zinc-800 px-3 py-1.5">
      <div className="min-w-0">
        <div className="text-zinc-200 text-[12px]">{p.username}</div>
        <div className="text-[10px] text-zinc-500 font-mono truncate">
          {p.roster_name ?? 'no list assigned'}{p.faction ? ` · ${factionLabel(p.faction)}` : ''}
          {p.is_test && <span className="ml-1.5 text-[9px] text-red-500/80">TEST</span>}
        </div>
      </div>
      {canManage && (
        <div className="flex gap-1 shrink-0">
          {p.status !== 'approved' && <button className={btn} disabled={busy} onClick={() => onSet(p.user_id, 'approved')}>Approve</button>}
          {p.status !== 'rejected' && <button className={btn} disabled={busy} onClick={() => onSet(p.user_id, 'rejected')}>Reject</button>}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-3">
      {canManage && pending.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase tracking-widest text-amber-600">Waiting for approval</div>
          {pending.map(row)}
        </div>
      )}
      <div className="space-y-1.5">
        <div className="text-[10px] uppercase tracking-widest text-zinc-600">Participants</div>
        {approved.length === 0 ? <p className="text-zinc-600 text-[11px] italic">None yet.</p> : approved.map(row)}
      </div>
      {canManage && rejected.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase tracking-widest text-zinc-700">Declined</div>
          {rejected.map(row)}
        </div>
      )}
    </div>
  );
}

function GamesTab({ games, players, username, busy, canReport, canManage, onReport, onConfirm, onSettle }: {
  games: api.EventGame[]; players: api.EventPlayer[]; username: string; busy: boolean; canReport: boolean;
  /** The organiser is the referee: only they can settle a game the players could not agree on. */
  canManage: boolean;
  onReport: (g: { opponentUserId: number; result: 'win' | 'draw' | 'loss'; mission?: string; playedOn?: string | null }) => void;
  onConfirm: (gameId: number, confirm: boolean, note?: string) => void;
  onSettle: (gameId: number, action: 'confirm' | 'reopen' | 'delete', result?: 'win' | 'draw' | 'loss') => void;
}) {
  const [opponentUserId, setOpponent] = useState<number | ''>('');
  const [result, setResult] = useState<'win' | 'draw' | 'loss'>('win');
  const [mission, setMission] = useState('');
  const [playedOn, setPlayedOn] = useState('');

  const opponents = players.filter(p => p.status === 'approved' && p.username !== username);
  /** Games where THIS viewer is the one who has to act — shown first, because nothing else moves. */
  const waitingOnMe = games.filter(g => g.status === 'pending' && g.opponent === username);
  /** Games the players could not settle between them. Nothing moves until the organiser rules. */
  const disputed = games.filter(g => g.status === 'disputed');

  return (
    <div className="space-y-3">
      {canReport && (
        <div className="border border-zinc-800 p-3 space-y-2">
          <div className="text-[10px] uppercase tracking-widest text-amber-600">Report a game</div>
          <div className="grid grid-cols-2 gap-2">
            <select className={box} value={opponentUserId} onChange={e => setOpponent(e.target.value ? Number(e.target.value) : '')}>
              <option value="">— opponent —</option>
              {opponents.map(p => (
                <option key={p.user_id} value={p.user_id}>
                  {p.username}{p.faction ? ` — ${factionLabel(p.faction)}` : ''}{p.roster_name ? ` (${p.roster_name})` : ''}
                </option>
              ))}
            </select>
            <select className={box} value={result} onChange={e => setResult(e.target.value as typeof result)}>
              <option value="win">I won</option>
              <option value="draw">Draw</option>
              <option value="loss">I lost</option>
            </select>
            <input className={box} placeholder="Mission" value={mission} onChange={e => setMission(e.target.value)} />
            <input type="date" className={box} value={playedOn} onChange={e => setPlayedOn(e.target.value)} />
          </div>
          <button className={btnPrimary} disabled={busy || opponentUserId === ''}
                  onClick={() => {
                    onReport({ opponentUserId: Number(opponentUserId), result, mission, playedOn: playedOn || null });
                    setOpponent(''); setMission(''); setPlayedOn('');
                  }}>
            Submit
          </button>
          <p className="text-zinc-600 text-[10px]">
            Your opponent has to confirm it before it counts toward the standings.
          </p>
        </div>
      )}

      {waitingOnMe.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase tracking-widest text-amber-600">Waiting for you to confirm</div>
          {waitingOnMe.map(g => (
            <div key={g.id} className="border border-amber-900/60 bg-amber-950/10 px-3 py-2 space-y-1.5">
              <div className="text-[12px] text-zinc-200">
                {g.reporter} reported a <strong>{g.result}</strong> against you{g.mission ? ` · ${g.mission}` : ''}
              </div>
              <div className="text-[10px] text-zinc-400 font-mono">
                {g.reporter_roster_name ?? 'no list'}{g.reporter_faction ? ` (${factionLabel(g.reporter_faction)})` : ''}
                {' vs '}
                {g.opponent_roster_name ?? 'no list'}{g.opponent_faction ? ` (${factionLabel(g.opponent_faction)})` : ''}
              </div>
              <div className="flex gap-1.5">
                <button className={btnPrimary} disabled={busy} onClick={() => onConfirm(g.id, true)}>Confirm</button>
                <button className={btn} disabled={busy}
                        onClick={() => onConfirm(g.id, false, window.prompt('Why is this wrong? (the organiser sees this)') ?? undefined)}>
                  Dispute
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {canManage && disputed.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase tracking-widest text-red-400">Disputed — waiting on you</div>
          {disputed.map(g => (
            <div key={g.id} className="border border-red-900/60 bg-red-950/10 px-3 py-2 space-y-1.5">
              <div className="text-[12px] text-zinc-200">
                {g.reporter} reported a <strong>{g.result}</strong> against {g.opponent}
                {g.mission ? ` · ${g.mission}` : ''}
              </div>
              <div className="text-[10px] text-zinc-400 font-mono">
                {g.reporter_roster_name ?? 'no list'}{g.reporter_faction ? ` (${factionLabel(g.reporter_faction)})` : ''}
                {' vs '}
                {g.opponent_roster_name ?? 'no list'}{g.opponent_faction ? ` (${factionLabel(g.opponent_faction)})` : ''}
              </div>
              {g.dispute_note && <div className="text-[11px] text-red-300/90">“{g.dispute_note}”</div>}
              {/* Three ways out, and the labels say which is which from the REPORTER's side, since
                  that is how the result is stored. Correcting it to the other way round is one
                  press rather than a delete and a re-report by the other player. */}
              <div className="flex gap-1.5 flex-wrap">
                <button className={btnPrimary} disabled={busy} onClick={() => onSettle(g.id, 'confirm')}>
                  Uphold as {g.result}
                </button>
                {g.result !== 'draw' && (
                  <button className={btn} disabled={busy}
                          onClick={() => onSettle(g.id, 'confirm', g.result === 'win' ? 'loss' : 'win')}>
                    Overturn to {g.result === 'win' ? 'loss' : 'win'}
                  </button>
                )}
                <button className={btn} disabled={busy} onClick={() => onSettle(g.id, 'confirm', 'draw')}>
                  Rule a draw
                </button>
                <button className={btn} disabled={busy} onClick={() => onSettle(g.id, 'reopen')}
                        title="Clear the dispute and send it back to the opponent">
                  Send back
                </button>
                <button className={btn} disabled={busy}
                        onClick={() => { if (window.confirm('Delete this game? It is gone for good.')) onSettle(g.id, 'delete'); }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-1.5">
        <div className="text-[10px] uppercase tracking-widest text-zinc-600">All reported games</div>
        {games.length === 0
          ? <p className="text-zinc-600 text-[11px] italic">No games reported yet.</p>
          : games.map(g => (
            <div key={g.id} className="flex items-center justify-between gap-2 border border-zinc-800 px-3 py-1.5">
              <div className="min-w-0">
                <div className="text-[12px] text-zinc-300">
                  {g.reporter} <span className="text-zinc-600">{g.result === 'draw' ? 'drew with' : g.result === 'win' ? 'beat' : 'lost to'}</span> {g.opponent}
                </div>
                {/* Both armies, always. With two players on the same faction a bare "X beat Y" is
                    the line most likely to be misread, and a draw reads the same either way round. */}
                <div className="text-[10px] text-zinc-400 font-mono truncate">
                  {g.reporter_roster_name ?? 'no list'}{g.reporter_faction ? ` (${factionLabel(g.reporter_faction)})` : ''}
                  {' vs '}
                  {g.opponent_roster_name ?? 'no list'}{g.opponent_faction ? ` (${factionLabel(g.opponent_faction)})` : ''}
                </div>
                <div className="text-[10px] text-zinc-500 font-mono truncate">
                  {g.mission || 'no mission'}{g.played_on ? ` · ${dateOnly(g.played_on)}` : ''}
                  {g.dispute_note ? ` · “${g.dispute_note}”` : ''}
                </div>
              </div>
              <span className="flex items-center gap-1.5 shrink-0">
                {/* An organiser also has to be able to undo a game both players confirmed and then
                    realised was wrong — otherwise the only fix is a second, opposite game. */}
                {canManage && g.status === 'confirmed' && (
                  <button className={btn} disabled={busy} title="Send this back to the opponent as unconfirmed"
                          onClick={() => onSettle(g.id, 'reopen')}>
                    Undo
                  </button>
                )}
                <Tag className={
                  g.status === 'confirmed' ? 'border-emerald-900 text-emerald-500'
                    : g.status === 'disputed' ? 'border-red-900 text-red-400'
                      : 'border-zinc-700 text-zinc-500'}>
                  {g.status.toUpperCase()}
                </Tag>
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

function StandingsTab({ standings }: { standings: api.EventStanding[] }) {
  if (standings.length === 0) return <p className="text-zinc-600 text-[11px] italic">No approved players yet.</p>;
  return (
    <table className="w-full text-[11px] font-mono">
      <thead>
        <tr className="text-zinc-600 text-[10px] uppercase tracking-widest">
          <th className="text-left py-1">#</th>
          <th className="text-left">Player</th>
          <th className="text-left">Faction</th>
          <th className="text-right">P</th>
          <th className="text-right">W</th><th className="text-right">D</th><th className="text-right">L</th>
          <th className="text-right">Win%</th>
          <th className="text-right">Pts</th>
        </tr>
      </thead>
      <tbody>
        {standings.map((s, i) => (
          <tr key={s.user_id} className="border-t border-zinc-900">
            <td className="py-1 text-zinc-600">{i + 1}</td>
            <td className="text-zinc-200">{s.username}</td>
            <td className="text-zinc-500 truncate">{factionLabel(s.faction) || '—'}</td>
            <td className="text-right text-zinc-500 tabular-nums">{n(s.played)}</td>
            <td className="text-right text-zinc-300 tabular-nums">{n(s.wins)}</td>
            <td className="text-right text-zinc-300 tabular-nums">{n(s.draws)}</td>
            <td className="text-right text-zinc-300 tabular-nums">{n(s.losses)}</td>
            <td className="text-right text-zinc-500 tabular-nums">
              {n(s.played) ? Math.round((n(s.wins) / n(s.played)) * 100) + '%' : '—'}
            </td>
            <td className="text-right text-amber-400 tabular-nums">{n(s.points)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
