import { useCallback, useEffect, useState } from 'react';
import * as api from '../lib/api';
import { LeagueSheet } from './LeagueSheet';
import { factionLabel } from '../utils/factionLabel';
import { useT, tpl, useLanguage } from '../i18n';
import { headToHead } from '../lib/headToHead';

/**
 * A translated string with `{name}` placeholders filled in. Every component below takes its own
 * `t` from `useT()` and wraps it in this, so word order can differ freely per language instead
 * of being fixed by where we concatenate.
 */
const fill = (t: (k: Parameters<ReturnType<typeof useT>>[0]) => string) =>
  (k: Parameters<ReturnType<typeof useT>>[0], vars: Record<string, string | number>) => tpl(t(k), vars);

/**
 * Events & Leagues — built to Dominic's requirements doc (2026-09-13), opened to players
 * 2026-09-14 after Dominic, Unwise and atypicalhero ran a league end to end and signed it off.
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

type TabId = 'info' | 'players' | 'games' | 'standings' | 'h2h';

interface Props {
  onClose: () => void;
  /** Current user's name, so the UI can tell "you" from "them" without another round trip. */
  username: string;
  isAdmin: boolean;
  /**
   * May this viewer CREATE an event? The three senior admins only for now, so it is a separate
   * question from `isAdmin` — an Interrogator can create one without having the rest of the
   * admin powers. Enforced server-side too; this only decides whether the button is offered.
   */
  canCreate: boolean;
}

const box = 'w-full bg-zinc-900 border border-zinc-800 px-2 py-1 text-[12px] text-zinc-200 focus:outline-none focus:border-amber-800';
const btn = 'text-[11px] px-3 py-1 border border-zinc-700 text-zinc-300 hover:border-amber-700 hover:text-amber-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed';
const btnPrimary = 'text-[11px] px-3 py-1 border border-amber-800 text-amber-300 hover:bg-amber-950/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed';

/** Postgres COUNT() arrives as a string; render it as a number without pretending it was one. */
const n = (v: string | number | undefined) => Number(v ?? 0);
/** Result as stored -> the translation key for the word a player reads. */
const RESULT_KEY = { win: 'evIWon', draw: 'evDraw', loss: 'evILost' } as const;
/** The stored value is the key; a player thinks in the printed name. */
/** Engagement key -> the translation key for its printed name, so the label follows the reader. */
const ENGAGEMENT_KEY = {
  skirmish: 'prefsEngSkirmish', pitched: 'prefsEngPitched', epic: 'prefsEngEpic',
} as const;

const dateOnly = (v: string | null) => (v ? String(v).slice(0, 10) : '');
/** Today as YYYY-MM-DD, compared as a plain string — the same shape the server's `regOpen`
 *  uses, so the two cannot disagree about which side of a date we are on. */
const todayISO = () => new Date().toISOString().slice(0, 10);

export function EventsModal({ onClose, username, isAdmin, canCreate }: Props) {
  const t = useT();
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
            <span className="text-amber-500 text-sm tracking-widest uppercase">⚔ {t('evTitle')}</span>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-200 text-lg leading-none">✕</button>
        </div>

        <div className="p-4 space-y-4">
          {/* Sticky, and it scrolls itself into view. The whole modal scrolls inside the page, so a
              plain line up here was invisible from the Games tab: pressing Send back on a game the
              server then refused looked exactly like the button doing nothing at all. */}
          {error && (
            <p ref={el => el?.scrollIntoView({ block: 'nearest' })}
               className="sticky top-0 z-10 bg-zinc-950 border border-red-900/60 px-2 py-1.5 text-red-400 text-[11px] font-mono">
              {error}
            </p>
          )}

          {openId == null
            ? <EventIndex
                events={events} loading={loading} isAdmin={isAdmin} canCreate={canCreate}
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

function EventIndex({ events, loading, isAdmin, canCreate, onOpen, onRefresh, onError }: {
  events: api.EventSummary[]; loading: boolean; isAdmin: boolean; canCreate: boolean;
  onOpen: (id: number) => void; onRefresh: () => Promise<void>; onError: (m: string) => void;
}) {
  const t = useT();
  const tf = fill(t);
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState(false);
  /** 0 = idle · 1 = "really?" · 2 = "completely sure?" — see handleResetTest. */
  const [resetStep, setResetStep] = useState(0);
  const [form, setForm] = useState<api.NewEvent>({
    name: '', description: '', visibility: 'public', isLeague: true, isTest: false,
  });

  async function handleCreate() {
    if (!form.name.trim()) { onError(t('evNameRequired')); return; }
    setBusy(true); onError('');
    try {
      await api.createEvent(form);
      setForm({ name: '', description: '', visibility: 'public', isLeague: true, isTest: false });
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
          {t('evIntro')}
        </p>
        <div className="flex gap-2 shrink-0">
          {/* Only the organisers start a league for now; everyone else joins one. */}
          {canCreate && (
            <button className={btnPrimary} onClick={() => setCreating(v => !v)}>
              {creating ? t('evCancel') : t('evNew')}
            </button>
          )}
          {isAdmin && resetStep === 0 && (
            <button className={btn} onClick={() => setResetStep(1)} disabled={busy}
                    title={t('evResetTestHint')}>
              {t('evResetTest')}
            </button>
          )}
        </div>
      </div>

      {resetStep > 0 && (
        <div className="border border-red-800 bg-red-950/20 p-3 space-y-2">
          <p className="text-red-300 text-[12px]">
            {resetStep === 1
              ? t('evResetQ1')
              : t('evResetQ2')}
          </p>
          <div className="flex gap-2">
            <button className="text-[11px] px-3 py-1 border border-red-700 text-red-300 hover:bg-red-900/30 disabled:opacity-40"
                    disabled={busy}
                    onClick={() => (resetStep === 1 ? setResetStep(2) : handleResetTest())}>
              {resetStep === 1 ? t('evResetYes1') : busy ? t('evResetting') : t('evResetYes2')}
            </button>
            <button className={btn} disabled={busy} onClick={() => setResetStep(0)}>{t('evResetNo')}</button>
          </div>
        </div>
      )}

      {creating && (
        <div className="border border-zinc-800 p-3 space-y-2">
          <input className={box} placeholder={t('evEventName')} value={form.name}
                 onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <textarea className={`${box} h-16 resize-y`} placeholder={t('evDescription')} value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <div className="grid grid-cols-2 gap-2">
            <label className="text-[10px] text-zinc-500">{t('evStarts')}
              <input type="date" className={box} value={form.startsOn ?? ''}
                     onChange={e => setForm(f => ({ ...f, startsOn: e.target.value || null }))} /></label>
            <label className="text-[10px] text-zinc-500">{t('evEnds')}
              <input type="date" className={box} value={form.endsOn ?? ''}
                     title={t('evNoEndDateHint')}
                     onChange={e => setForm(f => ({ ...f, endsOn: e.target.value || null }))} />
              <span className="block text-zinc-600 text-[9px] mt-0.5">{t('evNoEndDateHint')}</span></label>
            <label className="text-[10px] text-zinc-500">{t('evRegOpens')}
              <input type="date" className={box} value={form.regOpensOn ?? ''}
                     onChange={e => setForm(f => ({ ...f, regOpensOn: e.target.value || null }))} /></label>
            <label className="text-[10px] text-zinc-500">{t('evRegCloses')}
              <input type="date" className={box} value={form.regClosesOn ?? ''}
                     onChange={e => setForm(f => ({ ...f, regClosesOn: e.target.value || null }))} /></label>
          </div>
          {/* The three rules every list in this event has to obey. They are checked server-side
              when a player attaches a list, which is what stops a 4000 point army meeting a 2500
              point one. The cap is a CAP: under it is legal, only over is refused. */}
          <div className="grid grid-cols-2 gap-2">
            <label className="text-[10px] text-zinc-500">{t('evPointLimit')}
              <input type="number" min={0} step={50} className={box} placeholder={t('evNoLimit')}
                     value={form.pointLimit ?? ''}
                     onChange={e => setForm(f => ({ ...f, pointLimit: e.target.value ? Number(e.target.value) : null }))} /></label>
            <label className="text-[10px] text-zinc-500">{t('evEngagement')}
              <select className={box} value={form.engagement ?? ''}
                      onChange={e => setForm(f => ({ ...f, engagement: (e.target.value || null) as api.NewEvent['engagement'] }))}>
                <option value="">{t('evAnyEngagement')}</option>
                <option value="skirmish">{t('prefsEngSkirmish')}</option>
                <option value="pitched">{t('prefsEngPitched')}</option>
                <option value="epic">{t('prefsEngEpic')}</option>
              </select></label>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-zinc-300">
            <label className="flex items-center gap-1.5">
              <input type="checkbox" checked={form.alliesAllowed !== false}
                     onChange={e => setForm(f => ({ ...f, alliesAllowed: e.target.checked }))} />
              {t('evAlliesAllowed')}
            </label>
            <label className="flex items-center gap-1.5">
              <input type="checkbox" checked={form.visibility === 'private'}
                     onChange={e => setForm(f => ({ ...f, visibility: e.target.checked ? 'private' : 'public' }))} />
              {t('evPrivate')} <span className="text-zinc-600">{t('evPrivateHint')}</span>
            </label>
            <label className="flex items-center gap-1.5">
              <input type="checkbox" checked={form.isLeague === true}
                     onChange={e => setForm(f => ({ ...f, isLeague: e.target.checked }))} />
              {t('evLeague')} <span className="text-zinc-600">{t('evLeagueHint')}</span>
            </label>
            {/* Admin tool, and OFF by default. It used to default ON, which was right while the
                module was admin-only and wrong the moment players could reach it: the first league
                anyone made would have been invisible to everyone but admins. */}
            {isAdmin && (
              <label className="flex items-center gap-1.5">
                <input type="checkbox" checked={form.isTest === true}
                       onChange={e => setForm(f => ({ ...f, isTest: e.target.checked }))} />
                {t('evTestData')} <span className="text-zinc-600">{t('evTestDataHint')}</span>
              </label>
            )}
          </div>
          <button className={btnPrimary} onClick={handleCreate} disabled={busy}>
            {busy ? t('evCreating') : t('evCreate')}
          </button>
        </div>
      )}

      {loading
        ? <p className="text-zinc-500 text-[11px]">{t('evLoading')}</p>
        : events.length === 0
          ? <p className="text-zinc-600 text-[11px] italic">{t('evNoEvents')}</p>
          : (
            <div className="space-y-1.5">
              {events.map(ev => (
                <button key={ev.id} onClick={() => onOpen(ev.id)}
                        className="w-full text-left border border-zinc-800 hover:border-amber-800 px-3 py-2 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-zinc-200 text-[13px]">{ev.name}</span>
                    <span className="flex items-center gap-1.5 shrink-0">
                      {ev.is_test && <Tag className="border-zinc-700 text-zinc-500">{t('evTagTest')}</Tag>}
                      {/* Closed is not hidden: the league is listed, and opening it still shows the
                          standings and every game. The tag says only that it cannot be joined. */}
                      {!ev.published && <Tag className="border-zinc-700 text-zinc-500">{t('evTagClosed')}</Tag>}
                      {ev.visibility === 'private' && <Tag className="border-zinc-700 text-zinc-400">{t('evTagPrivate')}</Tag>}
                      {ev.is_league && <Tag className="border-amber-900 text-amber-500">{t('evTagLeague')}</Tag>}
                      {ev.my_status && (
                        <Tag className="border-emerald-900 text-emerald-500">
                          {ev.my_status === 'approved' ? t('evStatusApproved')
                            : ev.my_status === 'rejected' ? t('evStatusRejected') : t('evStatusPending')}
                        </Tag>
                      )}
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                    {ev.organiser} · {tf('evPlayerCount', { n: n(ev.player_count) })}
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
  const t = useT();
  const tf = fill(t);
  // The language the viewer is writing IN, stored with a battle report so a later reader is told
  // what they are about to read rather than being silently machine-translated.
  const language = useLanguage(sel => sel.language);
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
        api.getEvent(eventId, actingAs === '' ? undefined : Number(actingAs)),
        api.listEventPlayers(eventId), api.listEventGames(eventId),
      ]);
      setData(ev); setPlayers(pl.players); setGames(gm.games);
      if (ev.event.is_league) setStandings((await api.getEventStandings(eventId)).standings);
    } catch (err) {
      onError((err as Error).message);
    }
    // actingAs is a dependency on purpose: switching puppet has to re-ask, or the page keeps
    // showing the previous player's registration and army list.
  }, [eventId, onError, actingAs]);

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

  /** The player's own games in THIS event — drives both the tab and its contents. */
  const myGames = games.filter(g => g.reporter === actingName || g.opponent === actingName);

  const TABS: { key: TabId; label: string }[] = [
    { key: 'info', label: 'INFO' },
    { key: 'players', label: `PLAYERS (${players.filter(p => p.status === 'approved').length})` },
    { key: 'games', label: `GAMES (${games.length})` },
    // Only offered once the player has a game here: an empty "who have you played" tab is a
    // question no one asked.
    ...(myGames.length ? [{ key: 'h2h' as TabId, label: t('evH2H').toUpperCase() }] : []),
    ...(ev.is_league ? [{ key: 'standings' as TabId, label: 'STANDINGS' }] : []),
  ];

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <button className={btn} onClick={onBack}>{t('evAllEvents')}</button>
        <div className="flex items-center gap-1.5">
          {/* A league is months of other people's results living in one database, so it gets a copy
              that is not the database — and a sheet you can print or drop in Discord. */}
          <button className={btn} disabled={busy} title={t('evBackupHint')}
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
            {t('evBackup')}
          </button>
          <button className={btn} onClick={() => setShowSheet(true)} title={t('evSheetHint')}>
            {t('evSheet')}
          </button>
          {ev.is_test && <Tag className="border-zinc-700 text-zinc-500">{t('evTagTest')}</Tag>}
          {!data.open && <Tag className="border-zinc-700 text-zinc-500">{t('evTagClosed')}</Tag>}
          {ev.visibility === 'private' && <Tag className="border-zinc-700 text-zinc-400">{t('evTagPrivate')}</Tag>}
          {ev.is_league && <Tag className="border-amber-900 text-amber-500">{t('evTagLeague')}</Tag>}
        </div>
      </div>

      <div>
        <h3 className="text-amber-400 text-[15px]">{ev.name}</h3>
        <p className="text-[10px] text-zinc-500 font-mono">
          {tf('evOrganisedBy', { name: ev.organiser ?? '' })}
          {ev.starts_on && ` · ${dateOnly(ev.starts_on)}${ev.ends_on ? ` → ${dateOnly(ev.ends_on)}` : ''}`}
        </p>
      </div>

      {isAdmin && (
        <div className="border border-red-900/50 bg-red-950/10 p-2 space-y-2">
          <div className="text-[10px] uppercase tracking-widest text-red-400">{t('evAlphaTesting')}</div>
          {puppets.length === 0 ? (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-zinc-400 text-[11px]">{t('evSeedPrompt')}</span>
              <input type="number" min={2} max={12} value={seedCount}
                     onChange={e => setSeedCount(Number(e.target.value))}
                     className="w-16 bg-zinc-900 border border-zinc-800 px-2 py-1 text-[12px] text-zinc-200" />
              <button className={btnPrimary} disabled={busy}
                      onClick={() => act(() => api.seedTestPlayers(ev.id, seedCount))}>
                {t('evSeed')}
              </button>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-zinc-400 text-[11px]">{t('evActingAs')}</span>
                <select className="bg-zinc-900 border border-zinc-800 px-2 py-1 text-[12px] text-zinc-200"
                        value={actingAs} onChange={e => setActingAs(e.target.value ? Number(e.target.value) : '')}>
                  <option value="">{tf('evYou', { name: username })}</option>
                  {puppets.map(p => (
                    <option key={p.user_id} value={p.user_id}>
                      {p.username}{p.faction ? ` — ${factionLabel(p.faction)}` : ''}
                    </option>
                  ))}
                </select>
                <button className={btn} disabled={busy}
                        onClick={() => act(() => api.seedTestPlayers(ev.id, seedCount))}>
                  {t('evSeedMore')}
                </button>
              </div>
              <p className="text-zinc-600 text-[10px]">
                {t('evActingHint')}
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
          {/* Organiser-only. A league runs for months and the dates are the thing most likely to
              move — "can you extend registration to Sunday" is the ordinary case, not an edge one. */}
          {data.canManage && (
            <EventEditPanel ev={ev} busy={busy} onSave={patch => act(() => api.updateEvent(ev.id, patch))} />
          )}

          {ev.description && <p className="text-zinc-300 text-[12px] whitespace-pre-wrap">{ev.description}</p>}

          {/* Stated up front rather than discovered by being refused. */}
          {(ev.point_limit != null || ev.engagement || ev.allies_allowed === false) && (
            <div className="border border-zinc-800 px-3 py-2 space-y-0.5">
              <div className="text-[10px] uppercase tracking-widest text-amber-600">{t('evArmyRules')}</div>
              {ev.point_limit != null && (
                <p className="text-zinc-300 text-[11px]">
                  <strong>{tf('evUpTo', { n: ev.point_limit })}</strong>
                  <span className="text-zinc-600"> {t('evCapHint')}</span>
                </p>
              )}
              {ev.engagement && (
                <p className="text-zinc-300 text-[11px]">
                  <strong>{tf('evBuiltFor', { name: t(ENGAGEMENT_KEY[ev.engagement]) })}</strong>
                </p>
              )}
              {ev.allies_allowed === false && <p className="text-zinc-300 text-[11px]">{t('evNoAllies')}</p>}
            </div>
          )}
          <p className="text-[10px] text-zinc-500 font-mono">
            {!data.open ? t('evLeagueClosedLine')
              : data.registrationOpen ? t('evRegistrationOpen') : t('evRegistrationClosed')}
            {ev.reg_opens_on && ` · ${tf('evFromDate', { date: dateOnly(ev.reg_opens_on) })}`}
            {ev.reg_closes_on && ` · ${tf('evUntilDate', { date: dateOnly(ev.reg_closes_on) })}`}
          </p>

          {/* The league being OPEN and registration being open are two different things, and the
              second is driven purely by dates. Reported when Dominic reopened the league and sign-up
              stayed shut: the panel said "Registration CLOSED" next to an open league and never said
              why, so the only visible control — the open/closed button — looked like the answer.
              Say which date is doing it, and tell the organiser where to change it. */}
          {data.open && !data.registrationOpen && (
            <p className="text-amber-600/80 text-[11px] italic">
              {ev.reg_opens_on && todayISO() < dateOnly(ev.reg_opens_on)
                ? tf(data.canManage ? 'evRegNotYetOpenOrganiser' : 'evRegNotYetOpen',
                     { date: dateOnly(ev.reg_opens_on) })
                : ev.reg_closes_on
                  ? tf(data.canManage ? 'evRegClosedByDateOrganiser' : 'evRegClosedByDate',
                       { date: dateOnly(ev.reg_closes_on) })
                  : ''}
            </p>
          )}

          {/* A closed league is still worth opening: whoever finds it can read the standings and
              every confirmed game, whether the season is over or has not started. Only joining and
              reporting are shut, so say which of the two reasons applies. */}
          {!data.open && (
            <p className="text-zinc-500 text-[11px] italic">
              {!data.canManage ? t('evClosedPlayer') : ev.is_test ? t('evClosedTest') : t('evClosedOrganiser')}
            </p>
          )}

          {/* On a TEST event this says "open" rather than "open to players", because opening one
              never exposes it: `is_test` is what gates who can see it, and it is checked separately
              from `published`. Opening only unlocks registering and reporting. */}
          {data.canManage && (
            <button className={data.open ? btn : btnPrimary} disabled={busy}
                    onClick={() => act(() => api.publishEvent(ev.id, !data.open))}>
              {data.open ? t('evCloseLeague') : ev.is_test ? t('evOpenForReporting') : t('evOpenLeague')}
            </button>
          )}

          {!data.me && data.open && (
            <button className={btnPrimary} disabled={busy || !data.registrationOpen}
                    onClick={() => act(() => api.registerForEvent(ev.id))}>
              {ev.visibility === 'public' ? t('evRegister') : t('evRequestJoin')}
            </button>
          )}
          {data.me?.status === 'pending' && (
            <p className="text-amber-500/80 text-[11px]">{t('evPendingApproval')}</p>
          )}
          {data.me?.status === 'rejected' && (
            <div className="space-y-2">
              <p className="text-red-400 text-[11px]">{t('evRejected')}</p>
              <button className={btn} disabled={busy} onClick={() => act(() => api.registerForEvent(ev.id))}>{t('evAskAgain')}</button>
            </div>
          )}

          {data.me?.status === 'approved' && (() => {
            const registered = data.me.roster_id ?? '';
            const pending = listDraft !== registered;
            const registeredName = myRosters.find(r => r.id === registered)?.name ?? null;
            return (
              <div className="border border-zinc-800 p-3 space-y-2">
                <div className="text-[10px] uppercase tracking-widest text-amber-600">{t('evYourArmyList')}</div>
                <select className={box} value={listDraft} disabled={busy || data.listLock != null}
                        onChange={e => setListDraft(e.target.value ? Number(e.target.value) : '')}>
                  <option value="">{t('evNoneChosen')}</option>
                  {myRosters.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>

                {/* Nothing is registered until this is pressed, and the button says which of the
                    three things pressing it will do. It disables itself once what you picked and
                    what is registered are the same, so it doubles as the state readout. */}
                <button className={pending ? btnPrimary : btn} disabled={busy || !pending || data.listLock != null}
                        onClick={() => act(() => api.assignEventList(ev.id, listDraft === '' ? null : listDraft, as))}>
                  {!pending ? t('evListConfirmed')
                    : listDraft === '' ? t('evWithdrawList')
                    : registered === '' ? t('evConfirmList')
                    : t('evChangeList')}
                </button>

                {data.listLock ? (
                  <p className="text-zinc-500 text-[11px] italic">
                    {data.listLock.key ? t(data.listLock.key as Parameters<typeof t>[0]) : data.listLock.msg}
                    {registeredName && ` ${tf('evYouAreIn', { name: registeredName })}`}
                  </p>
                ) : pending ? (
                  <p className="text-amber-500/80 text-[10px]">
                    {t('evNotRegisteredYet')}
                    {registeredName && ` ${tf('evStillRegisteredWith', { name: registeredName })}`}
                  </p>
                ) : registeredName ? (
                  <p className="text-emerald-500/80 text-[10px]">
                    {tf('evRegisteredWith', { name: registeredName })}
                  </p>
                ) : (
                  <p className="text-zinc-600 text-[10px]">{t('evNoListYet')}</p>
                )}
              </div>
            );
          })()}

          {data.canManage && (
            <button className={btn} disabled={busy}
                    onClick={() => {
                      if (!window.confirm(tf('evDeleteEventQ', { name: ev.name }))) return;
                      void act(async () => { await api.deleteEvent(ev.id); onBack(); });
                    }}>
              {t('evDeleteEvent')}
            </button>
          )}
        </div>
      )}

      {tab === 'players' && (
        <PlayersTab players={players} canManage={data.canManage} busy={busy}
                    eventId={ev.id} username={username}
                    onFixList={(pid, rid) => act(() => api.assignEventList(ev.id, rid, undefined, pid))}
                    onSet={(uid, st) => act(() => api.setEventPlayerStatus(ev.id, uid, st))} />
      )}

      {tab === 'games' && (
        <GamesTab
          games={games} players={players} username={actingName} realUsername={username} busy={busy}
          canReport={data.me?.status === 'approved' || asPlayer != null}
          onReport={g => act(() => api.reportEventGame(ev.id, g, as))}
          onConfirm={(gid, ok, note) => act(() => api.confirmEventGame(gid, ok, note, as))}
          canManage={data.canManage}
          onSettle={(gid, what, result) => act(() => api.settleEventGame(gid, what, result ? { result } : {}))}
          onSaveReport={(gid, text) => act(() => api.writeGameReport(gid, text, language, as))}
          awaitingMe={data.awaitingMe}
        />
      )}

      {tab === 'h2h' && <HeadToHeadTab games={myGames} me={actingName} />}

      {tab === 'standings' && <StandingsTab standings={standings} />}

      {isAdmin && ev.is_test && (
        <p className="text-zinc-600 text-[10px] italic">{t('evTestEventNote')}</p>
      )}

      {showSheet && (
        <LeagueSheet event={ev} standings={standings} players={players} games={games}
                     onClose={() => setShowSheet(false)} />
      )}
    </>
  );
}

// ── tabs ─────────────────────────────────────────────────────────────────────────────────────────

function PlayersTab({ players, canManage, busy, eventId, username, onSet, onFixList }: {
  players: api.EventPlayer[]; canManage: boolean; busy: boolean; eventId: number; username: string;
  onSet: (userId: number, status: api.EventPlayer['status']) => void;
  /** An organiser or admin putting the right army on someone who registered the wrong one. */
  onFixList: (playerUserId: number, rosterId: number | null) => void;
}) {
  // Which player's list is being corrected, and the armies they have to choose from. Fetched on
  // demand rather than with the page: it is a privileged read, so it happens only when an organiser
  // actually opens it for one player.
  const t = useT();
  const tf = fill(t);
  const [fixing, setFixing] = useState<number | null>(null);
  const [theirLists, setTheirLists] = useState<{ id: number; name: string; faction: string | null; total_pts: number | null }[]>([]);
  const [fixError, setFixError] = useState('');

  async function openFix(userId: number) {
    setFixing(userId); setTheirLists([]); setFixError('');
    try {
      setTheirLists((await api.eventPlayerLists(eventId, userId)).rosters);
    } catch (err) {
      setFixError((err as Error).message);
    }
  }

  if (players.length === 0) return <p className="text-zinc-600 text-[11px] italic">{t('evNobodyRegistered')}</p>;
  const pending = players.filter(p => p.status === 'pending');
  const approved = players.filter(p => p.status === 'approved');
  const rejected = players.filter(p => p.status === 'rejected');

  const row = (p: api.EventPlayer) => (
    <div key={p.user_id} className="flex items-center justify-between gap-2 border border-zinc-800 px-3 py-1.5">
      <div className="min-w-0">
        <div className="text-zinc-200 text-[12px]">{p.username}</div>
        <div className="text-[10px] text-zinc-500 font-mono truncate">
          {p.roster_name ?? t('evNoListAssigned')}{p.faction ? ` · ${factionLabel(p.faction)}` : ''}
          {p.is_test && <span className="ml-1.5 text-[9px] text-red-500/80">TEST</span>}
        </div>
      </div>
      {canManage && (
        <div className="flex gap-1 shrink-0">
          {/* Not on yourself: the referee powers exist to fix other people's problems, the same
              reason you cannot settle a game you played in. Another organiser or admin can. */}
          {p.status === 'approved' && p.username !== username && (
            <button className={btn} disabled={busy} onClick={() => openFix(p.user_id)}
                    title={t('evFixListHint')}>
              {t('evFixList')}
            </button>
          )}
          {p.status !== 'approved' && <button className={btn} disabled={busy} onClick={() => onSet(p.user_id, 'approved')}>{t('evApprove')}</button>}
          {p.status !== 'rejected' && <button className={btn} disabled={busy} onClick={() => onSet(p.user_id, 'rejected')}>{t('evReject')}</button>}
        </div>
      )}
    </div>
  );

  const fixPanel = (p: api.EventPlayer) => (
    <div key={`fix-${p.user_id}`} className="border border-amber-900/60 bg-amber-950/10 px-3 py-2 space-y-2">
      <div className="text-[11px] text-zinc-200">
        {tf('evFixListTitle', { name: p.username })}
      </div>
      {fixError && <p className="text-red-400 text-[11px]">{fixError}</p>}
      <select className={box} defaultValue={p.roster_id ?? ''} disabled={busy}
              onChange={e => onFixList(p.user_id, e.target.value ? Number(e.target.value) : null)}>
        <option value="">{t('evNone')}</option>
        {theirLists.map(r => (
          <option key={r.id} value={r.id}>
            {r.name}{r.faction ? ` — ${factionLabel(r.faction)}` : ''}{r.total_pts != null ? ` (${r.total_pts} pts)` : ''}
          </option>
        ))}
      </select>
      <div className="flex gap-1.5">
        <button className={btn} disabled={busy} onClick={() => setFixing(null)}>{t('evDone')}</button>
      </div>
      <p className="text-zinc-600 text-[10px]">
        {t('evFixListRules')}
      </p>
    </div>
  );

  return (
    <div className="space-y-3">
      {canManage && pending.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase tracking-widest text-amber-600">{t('evWaitingApproval')}</div>
          {pending.map(row)}
        </div>
      )}
      <div className="space-y-1.5">
        <div className="text-[10px] uppercase tracking-widest text-zinc-600">{t('evParticipants')}</div>
        {approved.length === 0
          ? <p className="text-zinc-600 text-[11px] italic">{t('evNoneYet')}</p>
          : approved.flatMap(p => (fixing === p.user_id ? [row(p), fixPanel(p)] : [row(p)]))}
      </div>
      {canManage && rejected.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase tracking-widest text-zinc-700">{t('evDeclined')}</div>
          {rejected.map(row)}
        </div>
      )}
    </div>
  );
}

function GamesTab({ games, players, username, realUsername, busy, canReport, canManage, awaitingMe, onReport, onConfirm, onSettle, onSaveReport }: {
  games: api.EventGame[]; players: api.EventPlayer[]; username: string; busy: boolean; canReport: boolean;
  /**
   * The account actually signed in, which is NOT `username` while an admin drives a puppet.
   * Reporting and confirming happen as the puppet; settling happens as the real admin, because
   * `settle-game` takes no acting-as. So "did I play in this game?" has to be asked about the real
   * account, or your own disputed game looks like someone else's and offers buttons the server
   * then refuses.
   */
  realUsername: string;
  /** The organiser is the referee: only they can settle a game the players could not agree on. */
  canManage: boolean;
  onReport: (g: { opponentUserId: number; result: 'win' | 'draw' | 'loss'; mission?: string; playedOn?: string | null }) => void;
  onConfirm: (gameId: number, confirm: boolean, note?: string) => void;
  onSettle: (gameId: number, action: 'confirm' | 'reopen' | 'delete', result?: 'win' | 'draw' | 'loss') => void;
  /** A player saving their OWN battle report on a game they played. */
  onSaveReport: (gameId: number, text: string) => void;
  /**
   * The oldest game still waiting on this viewer, if any. While one exists they cannot report a
   * new game or confirm a different one — the rule the three of them agreed instead of a timer.
   */
  awaitingMe: { id: number; reporter: string; created_at: string } | null;
}) {
  const t = useT();
  const tf = fill(t);
  const [opponentUserId, setOpponent] = useState<number | ''>('');
  const [result, setResult] = useState<'win' | 'draw' | 'loss'>('win');
  const [mission, setMission] = useState('');
  const [playedOn, setPlayedOn] = useState('');

  const opponents = players.filter(p => p.status === 'approved' && p.username !== username);
  /** Games where THIS viewer is the one who has to act — shown first, because nothing else moves. */
  const waitingOnMe = games.filter(g => g.status === 'pending' && g.opponent === username);
  /** Games the players could not settle between them. Nothing moves until a referee rules. */
  const disputed = games.filter(g => g.status === 'disputed');
  /** Every game still waiting on its opponent, for the organiser's own view. */
  const pendingAll = games.filter(g => g.status === 'pending');
  /** How long a game has been sitting unconfirmed, in the reader's language. */
  const waitedFor = (iso: string) => {
    const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
    return days < 1 ? t('evWaitingToday') : tf('evWaitingDays', { n: days });
  };
  /** You never rule on a game you played in — organiser or admin, it makes no difference. */
  const mine = (g: api.EventGame) => g.reporter === realUsername || g.opponent === realUsername;

  return (
    <div className="space-y-3">
      {/* Said before the form, not after a refusal: the reason you cannot report is sitting right
          below, and disputing clears it just as well as confirming. */}
      {awaitingMe && (
        <div className="border border-amber-900/60 bg-amber-950/10 px-3 py-2 space-y-0.5">
          <div className="text-[11px] text-amber-300">{tf('evAwaitingYou', { name: awaitingMe.reporter })}</div>
          <p className="text-zinc-400 text-[10px]">{t('evAwaitingYouWhy')}</p>
        </div>
      )}

      {canReport && !awaitingMe && (
        <div className="border border-zinc-800 p-3 space-y-2">
          <div className="text-[10px] uppercase tracking-widest text-amber-600">{t('evReportGame')}</div>
          <div className="grid grid-cols-2 gap-2">
            <select className={box} value={opponentUserId} onChange={e => setOpponent(e.target.value ? Number(e.target.value) : '')}>
              <option value="">{t('evOpponentPick')}</option>
              {opponents.map(p => (
                <option key={p.user_id} value={p.user_id}>
                  {p.username}{p.faction ? ` — ${factionLabel(p.faction)}` : ''}{p.roster_name ? ` (${p.roster_name})` : ''}
                </option>
              ))}
            </select>
            <select className={box} value={result} onChange={e => setResult(e.target.value as typeof result)}>
              <option value="win">{t('evIWon')}</option>
              <option value="draw">{t('evDraw')}</option>
              <option value="loss">{t('evILost')}</option>
            </select>
            <input className={box} placeholder={t('evMission')} value={mission} onChange={e => setMission(e.target.value)} />
            <input type="date" className={box} value={playedOn} onChange={e => setPlayedOn(e.target.value)} />
          </div>
          <button className={btnPrimary} disabled={busy || opponentUserId === ''}
                  onClick={() => {
                    onReport({ opponentUserId: Number(opponentUserId), result, mission, playedOn: playedOn || null });
                    setOpponent(''); setMission(''); setPlayedOn('');
                  }}>
            {t('evSubmit')}
          </button>
          <p className="text-zinc-600 text-[10px]">
            {t('evReportHint')}
          </p>
        </div>
      )}

      {waitingOnMe.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase tracking-widest text-amber-600">{t('evWaitingOnYou')}</div>
          {waitingOnMe.map(g => (
            <div key={g.id} className="border border-amber-900/60 bg-amber-950/10 px-3 py-2 space-y-1.5">
              <div className="text-[12px] text-zinc-200">
                {tf('evReportedAgainstYou', { name: g.reporter, result: t(RESULT_KEY[g.result]) })}
                {g.mission ? ` · ${g.mission}` : ''}
              </div>
              <div className="text-[10px] text-zinc-400 font-mono">
                {g.reporter_roster_name ?? t('evNoList')}{g.reporter_faction ? ` (${factionLabel(g.reporter_faction)})` : ''}
                {' vs '}
                {g.opponent_roster_name ?? t('evNoList')}{g.opponent_faction ? ` (${factionLabel(g.opponent_faction)})` : ''}
              </div>
              <div className="flex gap-1.5">
                <button className={btnPrimary} disabled={busy} onClick={() => onConfirm(g.id, true)}>{t('evConfirm')}</button>
                <button className={btn} disabled={busy}
                        onClick={() => onConfirm(g.id, false, window.prompt(t('evDisputePrompt')) ?? undefined)}>
                  {t('evDispute')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dominic: the organiser should SEE an unconfirmed game and talk to the players, not decide
          it. The one action allowed is removing a game that should never have been reported. */}
      {canManage && pendingAll.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase tracking-widest text-zinc-500">{t('evPendingForOrganiser')}</div>
          {pendingAll.map(g => (
            <div key={g.id} className="flex items-center justify-between gap-2 border border-zinc-800 px-3 py-1.5">
              <div className="min-w-0">
                <div className="text-[12px] text-zinc-300">
                  {g.reporter} <span className="text-zinc-600">→</span> {g.opponent}
                </div>
                <div className="text-[10px] text-zinc-500 font-mono truncate">
                  {tf('evWaitingOn', { name: g.opponent })} · {waitedFor(g.created_at)}
                </div>
              </div>
              {!mine(g) && (
                <button className={btn} disabled={busy} title={t('evDeleteGameQ')}
                        onClick={() => { if (window.confirm(t('evDeleteGameQ'))) onSettle(g.id, 'delete'); }}>
                  {t('evDelete')}
                </button>
              )}
            </div>
          ))}
          <p className="text-zinc-600 text-[10px] italic">{t('evPendingOrganiserHint')}</p>
        </div>
      )}

      {canManage && disputed.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase tracking-widest text-red-400">{t('evDisputedWaiting')}</div>
          {disputed.map(g => (
            <div key={g.id} className="border border-red-900/60 bg-red-950/10 px-3 py-2 space-y-1.5">
              <div className="text-[12px] text-zinc-200">
                {tf('evReportedAgainst', { a: g.reporter, b: g.opponent, result: t(RESULT_KEY[g.result]) })}
                {g.mission ? ` · ${g.mission}` : ''}
              </div>
              <div className="text-[10px] text-zinc-400 font-mono">
                {g.reporter_roster_name ?? t('evNoList')}{g.reporter_faction ? ` (${factionLabel(g.reporter_faction)})` : ''}
                {' vs '}
                {g.opponent_roster_name ?? t('evNoList')}{g.opponent_faction ? ` (${factionLabel(g.opponent_faction)})` : ''}
              </div>
              {g.dispute_note && <div className="text-[11px] text-red-300/90">“{g.dispute_note}”</div>}
              {mine(g) && (
                <p className="text-zinc-500 text-[11px] italic">
                  {t('evCannotSettleOwn')}
                </p>
              )}
              {/* Three ways out, and the labels say which is which from the REPORTER's side, since
                  that is how the result is stored. Correcting it to the other way round is one
                  press rather than a delete and a re-report by the other player. */}
              <div className="flex gap-1.5 flex-wrap" hidden={mine(g)}>
                <button className={btnPrimary} disabled={busy} onClick={() => onSettle(g.id, 'confirm')}>
                  {tf('evUphold', { result: t(RESULT_KEY[g.result]) })}
                </button>
                {g.result !== 'draw' && (
                  <button className={btn} disabled={busy}
                          onClick={() => onSettle(g.id, 'confirm', g.result === 'win' ? 'loss' : 'win')}>
                    {tf('evOverturn', { result: t(g.result === 'win' ? 'evILost' : 'evIWon') })}
                  </button>
                )}
                <button className={btn} disabled={busy} onClick={() => onSettle(g.id, 'confirm', 'draw')}>
                  {t('evRuleDraw')}
                </button>
                <button className={btn} disabled={busy} onClick={() => onSettle(g.id, 'reopen')}
                        title={t('evSendBackHint')}>
                  {t('evSendBack')}
                </button>
                <button className={btn} disabled={busy}
                        onClick={() => { if (window.confirm(t('evDeleteGameQ'))) onSettle(g.id, 'delete'); }}>
                  {t('evDelete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-1.5">
        <div className="text-[10px] uppercase tracking-widest text-zinc-600">{t('evAllGames')}</div>
        {games.length === 0
          ? <p className="text-zinc-600 text-[11px] italic">{t('evNoGames')}</p>
          : games.map(g => (
            <div key={g.id} className="flex items-center justify-between gap-2 border border-zinc-800 px-3 py-1.5">
              <div className="min-w-0">
                <div className="text-[12px] text-zinc-300">
                  {g.reporter} <span className="text-zinc-600">{g.result === 'draw' ? t('evDrewWith') : g.result === 'win' ? t('evBeat') : t('evLostTo')}</span> {g.opponent}
                </div>
                {/* Both armies, always. With two players on the same faction a bare "X beat Y" is
                    the line most likely to be misread, and a draw reads the same either way round. */}
                <div className="text-[10px] text-zinc-400 font-mono truncate">
                  {g.reporter_roster_name ?? t('evNoList')}{g.reporter_faction ? ` (${factionLabel(g.reporter_faction)})` : ''}
                  {' vs '}
                  {g.opponent_roster_name ?? t('evNoList')}{g.opponent_faction ? ` (${factionLabel(g.opponent_faction)})` : ''}
                </div>
                <div className="text-[10px] text-zinc-500 font-mono truncate">
                  {g.mission || t('evNoMission')}{g.played_on ? ` · ${dateOnly(g.played_on)}` : ''}
                  {g.dispute_note ? ` · “${g.dispute_note}”` : ''}
                </div>
                <BattleReports game={g} username={username} busy={busy} onSave={onSaveReport} />
              </div>
              <span className="flex items-center gap-1.5 shrink-0">
                {/* An organiser also has to be able to undo a game both players confirmed and then
                    realised was wrong — otherwise the only fix is a second, opposite game. */}
                {/* Your own report, nobody has confirmed it: take it back yourself rather than
                    making your opponent dispute your mistake. */}
                {g.status !== 'confirmed' && g.reporter === realUsername && (
                  <button className={btn} disabled={busy} title={t('evWithdrawHint')}
                          onClick={() => { if (window.confirm(t('evWithdrawQ'))) onSettle(g.id, 'delete'); }}>
                    {t('evWithdraw')}
                  </button>
                )}
                {canManage && g.status === 'confirmed' && !mine(g) && (
                  <button className={btn} disabled={busy} title={t('evUndoHint')}
                          onClick={() => onSettle(g.id, 'reopen')}>
                    {t('evUndo')}
                  </button>
                )}
                <Tag className={
                  g.status === 'confirmed' ? 'border-emerald-900 text-emerald-500'
                    : g.status === 'disputed' ? 'border-red-900 text-red-400'
                      : 'border-zinc-700 text-zinc-500'}>
                  {g.status === 'confirmed' ? t('evStatusConfirmed')
                    : g.status === 'disputed' ? t('evStatusDisputed') : t('evStatusPending')}
                </Tag>
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

/**
 * Per-player head-to-head for ONE event: each opponent the player has faced, how often, the record
 * and every game behind it.
 *
 * Event-specific by construction — it is handed only this event's games, which is what was asked
 * for ("The history is meant to be event specific").
 */
function HeadToHeadTab({ games, me }: { games: api.EventGame[]; me: string }) {
  const t = useT();
  const [open, setOpen] = useState<string | null>(null);
  // The mirroring and the tallying live in `lib/headToHead.ts` so they can be tested directly —
  // reading a game from the wrong side turns a loss into a win, quietly and plausibly.
  const rows = headToHead(games, me);

  if (!rows.length) return <p className="text-zinc-500 text-[12px] italic">{t('evH2HNone')}</p>;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-zinc-500 text-[11px] leading-snug">{t('evH2HHint')}</p>
      {rows.map(r => (
        <div key={r.opponent} className="border border-zinc-800">
          <button
            className="w-full flex items-center gap-2 px-2 py-1.5 text-left hover:bg-zinc-900/60"
            onClick={() => setOpen(open === r.opponent ? null : r.opponent)}
          >
            <span className="text-zinc-200 text-[12px] flex-1">{r.opponent}</span>
            <span className="text-zinc-400 text-[11px] tabular-nums">{r.played} {t('evH2HPlayed')}</span>
            <span className="text-zinc-500 text-[10px] uppercase tracking-wide">{t('evH2HRecord')}</span>
            <span className="text-zinc-300 text-[11px] tabular-nums">{r.wins}–{r.draws}–{r.losses}</span>
            {r.pending > 0 && (
              <span className="text-amber-600/80 text-[10px] italic">{r.pending} {t('evH2HPending')}</span>
            )}
            <span className="text-zinc-600 text-[10px] w-3 text-center">{open === r.opponent ? '−' : '+'}</span>
          </button>
          {open === r.opponent && (
            <ul className="border-t border-zinc-800 divide-y divide-zinc-900">
              {r.games.map(m => {
                const tone = m.game.status !== 'confirmed' ? 'text-amber-600/80'
                  : m.result === 'win' ? 'text-emerald-500'
                  : m.result === 'loss' ? 'text-red-500' : 'text-zinc-400';
                return (
                  <li key={m.game.id} className="flex items-center gap-2 px-2 py-1 text-[11px]">
                    <span className={`uppercase tracking-wide w-10 shrink-0 ${tone}`}>{m.result}</span>
                    <span className="text-zinc-400 flex-1">{m.game.mission}</span>
                    <span className="text-zinc-500">
                      {m.myFaction ?? '?'} <span className="text-zinc-700">vs</span> {m.theirFaction ?? '?'}
                    </span>
                    {m.game.status !== 'confirmed' && (
                      <span className="text-amber-600/80 italic">{t('evH2HPending')}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Organiser-only editing of an event that already exists — chiefly its dates.
 *
 * Folded open on demand rather than always shown: most visits to the Info tab are to READ the
 * event, and a form sitting above the description turns every one of them into a chance to change
 * it by accident.
 *
 * The server is still the authority. It refuses anyone who is not the organiser and refuses a
 * registration date later than the start date, so this form cannot produce a state the API would
 * not accept on its own.
 */
function EventEditPanel({ ev, busy, onSave }: {
  ev: api.EventSummary;
  busy: boolean;
  onSave: (patch: Partial<api.NewEvent>) => void;
}) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const day = (v: string | null | undefined) => (v ? String(v).slice(0, 10) : '');
  const [form, setForm] = useState({
    name: ev.name,
    description: ev.description ?? '',
    startsOn: day(ev.starts_on),
    endsOn: day(ev.ends_on),
    regOpensOn: day(ev.reg_opens_on),
    regClosesOn: day(ev.reg_closes_on),
  });

  const box = 'w-full bg-zinc-950 border border-zinc-800 px-2 py-1 text-[12px] text-zinc-200';

  if (!open) {
    return (
      <button className="text-[11px] px-3 py-1 border border-zinc-700 text-zinc-300 hover:bg-zinc-900/60"
              onClick={() => setOpen(true)}>
        {t('evEditEvent')}
      </button>
    );
  }

  return (
    <div className="border border-zinc-800 p-3 space-y-2">
      <div className="text-[10px] uppercase tracking-widest text-amber-600">{t('evEditEvent')}</div>
      <p className="text-zinc-500 text-[11px] leading-snug">{t('evEditEventHint')}</p>
      <input className={box} value={form.name}
             onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
      <textarea className={`${box} h-16 resize-y`} value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
      <div className="grid grid-cols-2 gap-2">
        <label className="text-[10px] text-zinc-500">{t('evStarts')}
          <input type="date" className={box} value={form.startsOn}
                 onChange={e => setForm(f => ({ ...f, startsOn: e.target.value }))} /></label>
        <label className="text-[10px] text-zinc-500">{t('evEnds')}
          <input type="date" className={box} value={form.endsOn}
                 onChange={e => setForm(f => ({ ...f, endsOn: e.target.value }))} /></label>
        <label className="text-[10px] text-zinc-500">{t('evRegOpens')}
          <input type="date" className={box} value={form.regOpensOn}
                 onChange={e => setForm(f => ({ ...f, regOpensOn: e.target.value }))} /></label>
        <label className="text-[10px] text-zinc-500">{t('evRegCloses')}
          <input type="date" className={box} value={form.regClosesOn}
                 onChange={e => setForm(f => ({ ...f, regClosesOn: e.target.value }))} /></label>
      </div>
      <div className="flex gap-2">
        <button className="text-[11px] px-3 py-1 border border-amber-700 text-amber-300 hover:bg-amber-900/30 disabled:opacity-40"
                disabled={busy || !form.name.trim()}
                onClick={() => {
                  onSave({
                    name: form.name.trim(),
                    description: form.description,
                    // A cleared date must reach the server as null, not as "" — the update action
                    // writes the value straight through, so an empty string would be stored.
                    startsOn: form.startsOn || null,
                    endsOn: form.endsOn || null,
                    regOpensOn: form.regOpensOn || null,
                    regClosesOn: form.regClosesOn || null,
                  } as Partial<api.NewEvent>);
                  setOpen(false);
                }}>
          {t('evSave')}
        </button>
        <button className="text-[11px] px-3 py-1 border border-zinc-700 text-zinc-300 hover:bg-zinc-900/60"
                disabled={busy} onClick={() => setOpen(false)}>
          {t('evCancel')}
        </button>
      </div>
    </div>
  );
}

/**
 * One game's battle reports: yours to write, theirs to read.
 *
 * Each player has their own slot, so this shows a box for the side the viewer is on and plain text
 * for the other. Every report carries the language it was WRITTEN in, stated above it — nothing is
 * translated for the reader, because a report is someone's own words. The browser's own translate
 * handles it for anyone who wants that, free and on their side.
 */
function BattleReports({ game, username, busy, onSave }: {
  game: api.EventGame; username: string; busy: boolean;
  onSave: (gameId: number, text: string) => void;
}) {
  const t = useT();
  const tf = fill(t);
  const side = game.reporter === username ? 'reporter' : game.opponent === username ? 'opponent' : null;
  const mineText = side === 'reporter' ? game.reporter_report : side === 'opponent' ? game.opponent_report : null;
  const [draft, setDraft] = useState(mineText ?? '');
  // Re-sync when the game reloads under us (a save, or switching puppet), but never while typing.
  useEffect(() => { setDraft(mineText ?? ''); }, [mineText]);

  const locked = game.status === 'confirmed';
  const others: { who: string; text: string; lang: string | null }[] = [];
  if (side !== 'reporter' && game.reporter_report) {
    others.push({ who: game.reporter, text: game.reporter_report, lang: game.reporter_report_lang });
  }
  if (side !== 'opponent' && game.opponent_report) {
    others.push({ who: game.opponent, text: game.opponent_report, lang: game.opponent_report_lang });
  }
  if (!side && others.length === 0) return null;

  const langName = (l: string | null) =>
    l === 'de' ? t('evLangDe') : l === 'es' ? t('evLangEs') : l === 'en' ? t('evLangEn') : null;

  return (
    <div className="border-t border-zinc-900 mt-1.5 pt-1.5 space-y-2">
      <div className="text-[10px] uppercase tracking-widest text-zinc-600">{t('evBattleReport')}</div>

      {others.map(o => (
        <div key={o.who} className="space-y-0.5">
          <div className="text-[10px] text-zinc-500">
            {o.who}
            {langName(o.lang) && <span className="text-zinc-700"> · {tf('evWrittenIn', { lang: langName(o.lang) ?? '' })}</span>}
          </div>
          <p className="text-zinc-300 text-[11px] whitespace-pre-wrap">{o.text}</p>
        </div>
      ))}

      {side && (locked ? (
        mineText ? (
          <div className="space-y-0.5">
            <div className="text-[10px] text-zinc-500">{t('evYourReport')}</div>
            <p className="text-zinc-300 text-[11px] whitespace-pre-wrap">{mineText}</p>
          </div>
        ) : null
      ) : (
        <div className="space-y-1">
          <textarea className={`${box} h-20 resize-y`} value={draft} disabled={busy}
                    placeholder={t('evReportPlaceholder')}
                    onChange={e => setDraft(e.target.value)} />
          <div className="flex items-center gap-2">
            <button className={btn} disabled={busy || draft === (mineText ?? '')}
                    onClick={() => onSave(game.id, draft)}>
              {draft === (mineText ?? '') && mineText ? t('evReportSaved') : t('evSaveReport')}
            </button>
            <span className="text-zinc-600 text-[10px]">{t('evReportHintEdit')}</span>
          </div>
        </div>
      ))}

      {locked && (mineText || others.length > 0) && (
        <p className="text-zinc-700 text-[10px] italic">{t('evReportFinalNote')}</p>
      )}
      {others.some(o => o.lang) && (
        <p className="text-zinc-700 text-[10px] italic">{t('evWrittenInHint')}</p>
      )}
    </div>
  );
}

function StandingsTab({ standings }: { standings: api.EventStanding[] }) {
  const t = useT();
  if (standings.length === 0) return <p className="text-zinc-600 text-[11px] italic">{t('evNoneYet')}</p>;
  return (
    <table className="w-full text-[11px] font-mono">
      <thead>
        <tr className="text-zinc-600 text-[10px] uppercase tracking-widest">
          <th className="text-left py-1">#</th>
          <th className="text-left">{t('evColPlayer')}</th>
          <th className="text-left">{t('evColFaction')}</th>
          <th className="text-right">{t('evColPlayed')}</th>
          <th className="text-right">{t('evColWins')}</th><th className="text-right">{t('evColDraws')}</th>
          <th className="text-right">{t('evColLosses')}</th>
          <th className="text-right">{t('evColWinPct')}</th>
          <th className="text-right">{t('evColPoints')}</th>
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
