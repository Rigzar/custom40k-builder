import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as api from '../lib/api';
import type { GitfindaPost, GitfindaMatch, GitfindaMessage, GitfindaEngagement } from '../lib/api';
import { useT, tpl, useLanguage } from '../i18n';
import { factionLabel } from '../utils/factionLabel';
import { allZones, myZone, offsetLabel, zonedToUtc, formatSlot, ago } from '../lib/gitfindaTime';

/**
 * Gitfinda — "looking for a game" (Dominic's requirements document, 2026-10).
 *
 *   Create Post → Browse Posts → Match → Chat → Play
 *
 * Four screens in one modal, like Events: Browse, Create, My posts, My matches. The server does the
 * rules (api/_lib/gitfinda.js); this file only asks and shows. Times are the one subtle thing: a
 * slot is typed as wall-clock time in the POSTER'S zone, stored as an instant, and shown to every
 * reader converted into the zone they chose (src/lib/gitfindaTime.ts).
 */

/** Same list as ARMIES in api/_lib/gitfinda.js (scripts/_gitfinda_test.mjs checks they agree). */
const GITFINDA_ARMIES = [
  'chaos_space_marines', 'chaos_daemons', 'space_marines', 'imperial_guard', 'adeptus_mechanicus',
  'adeptus_custodes', 'adeptus_sororitas', 'grey_knights', 'inquisition', 'tau_empire', 'necrons',
  'orks', 'eldar', 'dark_eldar', 'genestealer_cults', 'harlequins', 'leagues_of_votann', 'tyranids',
];
const ENGAGEMENTS: GitfindaEngagement[] = ['skirmish', 'pitched', 'epic'];
const ENGAGEMENT_KEY = { skirmish: 'prefsEngSkirmish', pitched: 'prefsEngPitched', epic: 'prefsEngEpic' } as const;
const POINT_CHOICES = [500, 1000, 1500, 2000, 2500, 3000, 4000, 5000];
const LOCALE: Record<string, string> = { en: 'en-GB', de: 'de-DE', es: 'es-ES', ru: 'ru-RU', ja: 'ja-JP' };
const STATUS_KEY = { active: 'gfStatusActive', matched: 'gfStatusMatched', cancelled: 'gfStatusCancelled', expired: 'gfStatusExpired' } as const;
const STATUS_COLOUR = { active: 'text-green-400', matched: 'text-orange-300', cancelled: 'text-zinc-500', expired: 'text-zinc-500' } as const;
const INTRO_KEY = 'c40k_gitfinda_intro_hidden';

type Tab = 'browse' | 'create' | 'posts' | 'matches';
type TFn = ReturnType<typeof useT>;
type TKey = Parameters<TFn>[0];

const field = 'w-full bg-black/60 border border-orange-700/60 text-orange-100 text-[13px] px-2 py-1.5 rounded-sm focus:outline-none focus:border-orange-400';
const cardBox = 'border border-orange-700/50 bg-zinc-950/80 rounded-sm shadow-[0_0_14px_rgba(249,115,22,0.10)]';
const btnOrange = 'inline-flex items-center justify-center gap-1.5 border border-orange-500 bg-gradient-to-b from-orange-600/30 to-orange-900/30 text-orange-200 hover:from-orange-500/40 hover:text-white text-[12px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed';
const btnGhost = 'inline-flex items-center justify-center gap-1.5 border border-orange-800/60 text-orange-300/80 hover:border-orange-500 hover:text-orange-200 text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-sm transition-colors disabled:opacity-40';

/**
 * Icons. Nine come from Dominic's mockup pack (public/gitfinda/*.png). The other eight crops in the
 * pack carry chunks of the mockup's background (arrows, plus, cross, send, the tab pictograms), so
 * those are drawn here as plain strokes that take the surrounding colour.
 */
const GLYPH: Record<string, string> = {
  add_plus: 'M12 5v14M5 12h14',
  back_chevron: 'M15 5l-7 7 7 7',
  button_chevron_right: 'M9 5l7 7-7 7',
  remove_x: 'M6 6l12 12M18 6L6 18',
  send: 'M4 12l16-8-6 16-3-7z M11 13l9-9',
  create_post: 'M7 3h8l4 4v14H7z M15 3v4h4 M11 12h4M13 10v4',
  find_more_gits_users: 'M10 4a6 6 0 100 12 6 6 0 000-12z M15 15l5 5',
  show_my_posts_user: 'M12 4a4 4 0 100 8 4 4 0 000-8z M4 21c0-4 3.5-6 8-6s8 2 8 6',
};
const icon = (name: string, cls = 'w-4 h-4') => GLYPH[name]
  ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={`${cls} inline-block shrink-0`}><path d={GLYPH[name]} /></svg>
  : <img src={`/gitfinda/${name}.png`} alt="" aria-hidden className={`${cls} object-contain inline-block`} draggable={false} />;

function ArmyBadge({ army, size = 'w-9 h-9' }: { army: string; size?: string }) {
  return (
    <img src={`/faction-symbols/${army.replace(/_/g, '-')}.svg`} alt="" aria-hidden
      className={`${size} object-contain shrink-0 opacity-90 [filter:invert(62%)_sepia(80%)_saturate(1800%)_hue-rotate(345deg)_brightness(1.05)]`} />
  );
}

interface Props { onClose: () => void; username: string }

/** The latest value, readable from a hook that must not restart when it changes. */
function useLatest<T>(value: T) {
  const ref = useRef(value);
  useEffect(() => { ref.current = value; });
  return ref;
}

export function GitfindaModal({ onClose, username }: Props) {
  const t = useT();
  const language = useLanguage(s => s.language);
  const locale = LOCALE[language] ?? 'en-GB';
  const [tab, setTab] = useState<Tab>('browse');
  const [intro, setIntro] = useState(() => { try { return localStorage.getItem(INTRO_KEY) !== '1'; } catch { return true; } });
  const [introHide, setIntroHide] = useState(false);
  const [unread, setUnread] = useState(0);
  const [openMatch, setOpenMatch] = useState<number | null>(null);

  const refreshUnread = useCallback(() => {
    api.gitfindaUnread().then(r => setUnread(r.unread)).catch(() => {});
  }, []);
  useEffect(() => {
    refreshUnread();
    const id = setInterval(refreshUnread, 30000);
    return () => clearInterval(id);
  }, [refreshUnread]);

  const subtitle: Record<Tab, TKey> = { browse: 'gfSubBrowse', create: 'gfSubCreate', posts: 'gfSubPosts', matches: 'gfSubMatches' };
  const nav: { id: Tab; key: TKey; img: string }[] = [
    { id: 'browse', key: 'gfNavBrowse', img: 'find_more_gits_users' },
    { id: 'create', key: 'gfNavCreate', img: 'create_post' },
    { id: 'posts', key: 'gfNavPosts', img: 'show_my_posts_user' },
    { id: 'matches', key: 'gfNavMatches', img: 'matched_gits_users' },
  ];

  if (intro) {
    return (
      <Shell onClose={onClose}>
        <div className="p-6 max-w-lg mx-auto text-center">
          <div className="text-2xl font-extrabold text-orange-400 tracking-wide mb-1">{t('gfIntroTitle')}</div>
          <p className="text-[13px] text-orange-100/80 leading-relaxed text-left my-4">{t('gfIntroBody')}</p>
          <div className="text-orange-300 font-bold uppercase tracking-[0.3em] text-sm mb-5">{t('gfIntroTag')}</div>
          <label className="flex items-center justify-center gap-2 text-[12px] text-orange-200/70 mb-4 cursor-pointer">
            <input type="checkbox" checked={introHide} onChange={e => setIntroHide(e.target.checked)} /> {t('gfIntroHide')}
          </label>
          <button className={btnOrange} onClick={() => {
            if (introHide) { try { localStorage.setItem(INTRO_KEY, '1'); } catch { /* private window: it just shows again */ } }
            setIntro(false);
          }}>{t('gfIntroContinue')} {icon('button_chevron_right')}</button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell onClose={onClose}>
      <div className="px-4 pt-3 pb-2 text-center border-b border-orange-800/40">
        <div className="text-3xl font-black text-orange-400 tracking-wide leading-none">Gitfinda <span className="align-middle border border-orange-500/70 text-orange-300 text-[10px] font-bold tracking-widest px-1.5 py-0.5 rounded-sm">BETA</span></div>
        <div className="text-[11px] uppercase tracking-[0.3em] text-orange-300/80 mt-1">{t(subtitle[tab])}</div>
        <div className="flex justify-center mt-1">{icon('small_skull_divider', 'w-6 h-4')}</div>
      </div>
      <div className="flex border-b border-orange-800/40 text-[11px] uppercase tracking-wider overflow-x-auto">
        {nav.map(n => (
          <button key={n.id} onClick={() => setTab(n.id)}
            className={`flex-1 min-w-[96px] px-2 py-2 flex items-center justify-center gap-1.5 border-b-2 whitespace-nowrap ${tab === n.id ? 'border-orange-400 text-orange-300 bg-orange-950/30' : 'border-transparent text-orange-200/50 hover:text-orange-200'}`}>
            {icon(n.img, 'w-4 h-4')} {t(n.key)}
            {n.id === 'matches' && unread > 0 && <span className="ml-1 bg-orange-500 text-black rounded-full px-1.5 text-[10px] font-bold">{unread}</span>}
          </button>
        ))}
      </div>
      <div className="p-3 sm:p-4">
        {tab === 'browse' && <BrowseTab t={t} locale={locale} onMatched={id => { setOpenMatch(id); setTab('matches'); refreshUnread(); }} goCreate={() => setTab('create')} goPosts={() => setTab('posts')} goMatches={() => setTab('matches')} />}
        {tab === 'create' && <CreateTab t={t} locale={locale} onDone={() => setTab('posts')} />}
        {tab === 'posts' && <PostsTab t={t} locale={locale} goMatches={() => setTab('matches')} goCreate={() => setTab('create')} />}
        {tab === 'matches' && <MatchesTab t={t} locale={locale} username={username} initialId={openMatch} onRead={refreshUnread} goBrowse={() => setTab('browse')} />}
      </div>
    </Shell>
  );
}

/** A calendar day in the player's own time zone, as YYYY-MM-DD (what a date input wants). */
function localDay(d: Date) {
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function Shell({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  const t = useT();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-start sm:items-center justify-center overflow-y-auto" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label="Gitfinda"
        className="gf-dialog relative w-full sm:max-w-3xl my-0 sm:my-6 bg-[#0b0806] border-2 border-orange-600/70 sm:rounded-md shadow-[0_0_40px_rgba(249,115,22,0.25)] min-h-screen sm:min-h-0"
        onClick={e => e.stopPropagation()}>
        <button onClick={onClose} aria-label={t('close')} className="absolute top-2 right-3 text-orange-300/70 hover:text-orange-200 text-xl leading-none z-10">×</button>
        {children}
      </div>
    </div>
  );
}

/** "Display times in" — My time zone (the default), UTC, or any zone. */
function ZonePicker({ t, value, onChange }: { t: TFn; value: string; onChange: (z: string) => void }) {
  const zones = useMemo(() => allZones(), []);
  return (
    <label className="flex items-center gap-2 text-[11px] text-orange-200/70">
      {icon('time_zone_globe')} <span className="uppercase tracking-wider">{t('gfDisplayIn')}</span>
      <select className={`${field} !w-auto`} value={value} onChange={e => onChange(e.target.value)}>
        <option value="my">{t('gfMyZone')} ({myZone()})</option>
        {zones.map(z => <option key={z} value={z}>{z}</option>)}
      </select>
    </label>
  );
}

function Slots({ post, zone, locale }: { post: GitfindaPost; zone: string; locale: string }) {
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-0.5">
      {post.slots.map((s, i) => <span key={i} className="text-orange-100 whitespace-nowrap">{formatSlot(s.start, s.end, zone, locale)}</span>)}
    </div>
  );
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="text-[9px] uppercase tracking-[0.2em] text-orange-400/60">{label}</div>
      <div className="text-[12px] text-orange-100 font-semibold">{children}</div>
    </div>
  );
}

/** "Already converted to your time zone (America/Edmonton)": the slots a poster typed in their own
 *  zone are shown in the viewer's, and nothing on the card said so (Unwise asked for exactly this). */
function zoneNote(t: TFn, zone: string): string {
  return tpl(t(zone === myZone() ? 'gfSlotsYourZone' : 'gfSlotsInZone'), { zone });
}

function PostCard({ t, locale, post, zone, action }: { t: TFn; locale: string; post: GitfindaPost; zone: string; action?: React.ReactNode }) {
  const a = ago(post.createdAt);
  const agoKey = a.unit === 'm' ? 'gfAgoM' : a.unit === 'h' ? 'gfAgoH' : 'gfAgoD';
  return (
    <div className={`${cardBox} p-3`}>
      <div className="flex items-start gap-3">
        <ArmyBadge army={post.army} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-orange-300 font-bold text-[14px]">{post.username}</span>
            <span className="text-orange-100/90 text-[13px]">{factionLabel(post.army)}</span>
            <span className="text-[10px] text-orange-200/40 ml-auto">{tpl(t(agoKey), { n: a.n })}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
            <Meta label={t('gfFEngagement')}>{t(ENGAGEMENT_KEY[post.engagement])}</Meta>
            <Meta label={t('gfFPoints')}>{post.points}</Meta>
            <Meta label={t('gfFZone')}>{offsetLabel(post.timezone)}</Meta>
          </div>
          <div className="mt-2 text-[12px]">
            <div className="text-[9px] uppercase tracking-[0.2em] text-orange-400/60">{t('gfFSlots')} <span className="normal-case tracking-normal text-orange-300/60">· {zoneNote(t, zone)}</span></div>
            <Slots post={post} zone={zone} locale={locale} />
          </div>
          {post.eventName && <div className="mt-1 text-[11px] text-orange-300/80">{icon('engagement_crossed_swords', 'w-3.5 h-3.5')} {post.eventName}</div>}
        </div>
        {action && <div className="shrink-0 self-center">{action}</div>}
      </div>
    </div>
  );
}

// ── Browse ──────────────────────────────────────────────────────────────────────────────────────

function BrowseTab({ t, locale, onMatched, goCreate, goPosts, goMatches }: {
  t: TFn; locale: string; onMatched: (matchId: number) => void; goCreate: () => void; goPosts: () => void; goMatches: () => void;
}) {
  const [posts, setPosts] = useState<GitfindaPost[] | null>(null);
  const [events, setEvents] = useState<{ id: number; name: string }[]>([]);
  const [err, setErr] = useState('');
  const [q, setQ] = useState('');
  const [army, setArmy] = useState('');
  const [engagement, setEngagement] = useState('');
  const [eventId, setEventId] = useState<number | ''>('');
  const [sort, setSort] = useState('newest');
  const [zone, setZone] = useState('my');
  const [busy, setBusy] = useState<number | null>(null);
  const shownZone = zone === 'my' ? myZone() : zone;
  const tr = useLatest(t);

  useEffect(() => { api.gitfindaEvents().then(r => setEvents(r.events)).catch(() => {}); }, []);
  useEffect(() => {
    // Typing in the search box should not fire a request per key.
    const id = setTimeout(() => {
      api.gitfindaList({ q, army, engagement, eventId, sort })
        .then(r => { setPosts(r.posts); setErr(''); })
        .catch(e => { setErr(e instanceof Error ? e.message : tr.current('gfLoadFail')); setPosts([]); });
    }, 250);
    return () => clearTimeout(id);
  }, [q, army, engagement, eventId, sort, tr]);

  const doMatch = async (p: GitfindaPost) => {
    setBusy(p.id); setErr('');
    try { const r = await api.gitfindaMatch(p.id); onMatched(r.matchId); }
    catch (e) { setErr(e instanceof Error ? e.message : t('gfLoadFail')); }
    finally { setBusy(null); }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <label className="col-span-2 sm:col-span-4 relative">
          <span className="absolute left-2 top-1/2 -translate-y-1/2">{icon('search')}</span>
          <input className={`${field} pl-8`} placeholder={t('gfSearchPh')} value={q} onChange={e => setQ(e.target.value)} maxLength={60} />
        </label>
        <select className={field} value={army} onChange={e => setArmy(e.target.value)}>
          <option value="">{t('gfAllArmies')}</option>
          {GITFINDA_ARMIES.map(a => <option key={a} value={a}>{factionLabel(a)}</option>)}
        </select>
        <select className={field} value={engagement} onChange={e => setEngagement(e.target.value)}>
          <option value="">{t('gfAllTypes')}</option>
          {ENGAGEMENTS.map(e => <option key={e} value={e}>{t(ENGAGEMENT_KEY[e])}</option>)}
        </select>
        <select className={field} value={eventId} onChange={e => setEventId(e.target.value ? Number(e.target.value) : '')}>
          <option value="">{t('gfAllEvents')}</option>
          {events.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
        <select className={field} value={sort} onChange={e => setSort(e.target.value)}>
          <option value="newest">{t('gfSortNewest')}</option>
          <option value="oldest">{t('gfSortOldest')}</option>
          <option value="soonest">{t('gfSortSoonest')}</option>
          <option value="points">{t('gfSortPoints')}</option>
        </select>
      </div>
      <ZonePicker t={t} value={zone} onChange={setZone} />
      {err && <div className="text-red-400 text-[12px] border border-red-900/60 bg-red-950/30 px-2 py-1">{err}</div>}
      {posts === null && <div className="text-orange-200/60 text-[12px]">{t('gfLoading')}</div>}
      {posts && posts.length === 0 && !err && (
        <div className="text-orange-200/60 text-[13px] text-center py-8">{q || army || engagement || eventId ? t('gfNoPostsFiltered') : t('gfNoPosts')}</div>
      )}
      <div className="space-y-2">
        {posts?.map(p => (
          <PostCard key={p.id} t={t} locale={locale} post={p} zone={shownZone}
            action={p.mine
              ? <button className={btnGhost} onClick={goPosts}>{t('gfYourPost')}</button>
              : p.matchedByMe
                ? <button className={btnGhost} onClick={goMatches}>{t('gfMatched')} ✓</button>
                : p.canMatch === false
                  // A game tied to an event or league is only for that event's players.
                  ? <span className="text-[11px] text-orange-200/60 max-w-[160px] text-right leading-tight">{t('gfNeedsEvent')}</span>
                  : <button className={btnOrange} disabled={busy === p.id} onClick={() => doMatch(p)}>{t('gfMatch')} {icon('button_chevron_right', 'w-3 h-3')}</button>} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button className={btnOrange} onClick={goCreate}>{icon('create_post')} {t('gfNavCreate')}</button>
        <button className={btnOrange} onClick={goPosts}>{icon('show_my_posts_user')} {t('gfShowMyPosts')}</button>
      </div>
    </div>
  );
}

// ── Create ──────────────────────────────────────────────────────────────────────────────────────

interface DraftSlot { start: string; end: string }

function CreateTab({ t, locale, onDone }: { t: TFn; locale: string; onDone: () => void }) {
  const zones = useMemo(() => allZones(), []);
  const [army, setArmy] = useState('');
  const [engagement, setEngagement] = useState<GitfindaEngagement | ''>('');
  const [points, setPoints] = useState<number | 'custom'>(2000);
  const [customPoints, setCustomPoints] = useState('');
  const [zone, setZone] = useState(myZone());
  const [eventId, setEventId] = useState<number | ''>('');
  const [events, setEvents] = useState<{ id: number; name: string }[]>([]);
  const [slots, setSlots] = useState<DraftSlot[]>([]);
  const [today] = useState(() => localDay(new Date()));
  const [date, setDate] = useState(() => localDay(new Date(Date.now() + 86400000)));
  const [from, setFrom] = useState('19:00');
  const [to, setTo] = useState('22:00');
  const [slotErr, setSlotErr] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => { api.gitfindaEvents().then(r => setEvents(r.events)).catch(() => {}); }, []);

  const addSlot = () => {
    setSlotErr('');
    const start = zonedToUtc(date, from, zone);
    // A slot that ends "before" it starts runs past midnight: the end is on the next day.
    const endDate = to <= from ? new Date(new Date(date + 'T12:00:00Z').getTime() + 86400000).toISOString().slice(0, 10) : date;
    const end = zonedToUtc(endDate, to, zone);
    if (!start || !end) return setSlotErr(t('gfSlotNoSuchTime'));
    if (end <= start) return setSlotErr(t('gfSlotEndBeforeStart'));
    if (end.getTime() <= Date.now()) return setSlotErr(t('gfSlotInPast'));
    setSlots(s => [...s, { start: start.toISOString(), end: end.toISOString() }].sort((a, b) => a.start.localeCompare(b.start)));
  };

  const submit = async () => {
    setErr('');
    if (!army) return setErr(t('gfErrArmy'));
    if (!engagement) return setErr(t('gfErrEngagement'));
    if (slots.length === 0) return setErr(t('gfSlotNone'));
    const pts = points === 'custom' ? Number(customPoints) : points;
    setBusy(true);
    try {
      await api.gitfindaCreate({ army, engagement, points: pts, timezone: zone, eventId: eventId === '' ? null : eventId, slots });
      onDone();
    } catch (e) { setErr(e instanceof Error ? e.message : t('gfLoadFail')); }
    finally { setBusy(false); }
  };

  const row = (img: string, label: TKey, help: TKey, control: React.ReactNode) => (
    <div className="grid grid-cols-[28px_1fr] sm:grid-cols-[28px_190px_1fr] gap-x-3 gap-y-1 py-2 border-b border-orange-900/30 items-center">
      <div>{icon(img, 'w-6 h-6')}</div>
      <div><div className="text-[12px] font-bold uppercase tracking-wider text-orange-300">{t(label)}</div><div className="text-[10px] text-orange-200/50">{t(help)}</div></div>
      <div className="col-span-2 sm:col-span-1">{control}</div>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto">
      {row('army_horned_skull', 'gfFArmy', 'gfHelpArmy',
        <select className={field} value={army} onChange={e => setArmy(e.target.value)}>
          <option value="">—</option>
          {GITFINDA_ARMIES.map(a => <option key={a} value={a}>{factionLabel(a)}</option>)}
        </select>)}
      {row('engagement_crossed_swords', 'gfFEngagement', 'gfHelpEngagement',
        <select className={field} value={engagement} onChange={e => setEngagement(e.target.value as GitfindaEngagement)}>
          <option value="">—</option>
          {ENGAGEMENTS.map(e => <option key={e} value={e}>{t(ENGAGEMENT_KEY[e])}</option>)}
        </select>)}
      {row('point_size_skull', 'gfFPoints', 'gfHelpPoints',
        <div className="flex gap-2">
          <select className={field} value={points} onChange={e => setPoints(e.target.value === 'custom' ? 'custom' : Number(e.target.value))}>
            {POINT_CHOICES.map(p => <option key={p} value={p}>{p}</option>)}
            <option value="custom">{t('gfCustom')}</option>
          </select>
          {points === 'custom' && <input className={field} type="number" min={100} max={20000} value={customPoints} onChange={e => setCustomPoints(e.target.value)} />}
        </div>)}
      {row('time_zone_globe', 'gfFZone', 'gfHelpZone',
        <select className={field} value={zone} onChange={e => setZone(e.target.value)}>
          {zones.map(z => <option key={z} value={z}>{z} ({offsetLabel(z)})</option>)}
        </select>)}
      {row('available_time_calendar', 'gfFSlots', 'gfHelpSlots',
        <div className="space-y-2">
          <div className="space-y-1">
            {slots.map((s, i) => (
              <div key={i} className="flex items-center justify-between border border-orange-700/50 bg-black/50 px-2 py-1 text-[12px] text-orange-100">
                <span>{formatSlot(s.start, s.end, zone, locale)}</span>
                <button aria-label={t('gfRemove')} title={t('gfRemove')} onClick={() => setSlots(x => x.filter((_, k) => k !== i))}>{icon('remove_x', 'w-3.5 h-3.5')}</button>
              </div>
            ))}
          </div>
          <div className="border border-dashed border-orange-700/50 p-2 space-y-2">
            <div className="text-[11px] text-orange-300/80">{icon('add_plus', 'w-3.5 h-3.5')} {t('gfAddSlot')}</div>
            <div className="grid grid-cols-3 gap-2 text-[10px] text-orange-200/60 uppercase">
              <label>{t('gfSlotDate')}<input className={field} type="date" value={date} min={today} onChange={e => setDate(e.target.value)} /></label>
              <label>{t('gfSlotFrom')}<input className={field} type="time" value={from} onChange={e => setFrom(e.target.value)} /></label>
              <label>{t('gfSlotTo')}<input className={field} type="time" value={to} onChange={e => setTo(e.target.value)} /></label>
            </div>
            {slotErr && <div className="text-red-400 text-[11px]">{slotErr}</div>}
            <button className={btnGhost} onClick={addSlot}>{t('gfAdd')}</button>
          </div>
        </div>)}
      {events.length > 0 && row('engagement_crossed_swords', 'gfFEvent', 'gfNoEvent',
        <select className={field} value={eventId} onChange={e => setEventId(e.target.value ? Number(e.target.value) : '')}>
          <option value="">{t('gfNoEvent')}</option>
          {events.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>)}
      {err && <div className="text-red-400 text-[12px] border border-red-900/60 bg-red-950/30 px-2 py-1 mt-3">{err}</div>}
      <button className={`${btnOrange} w-full mt-4 py-2.5 text-[14px]`} disabled={busy} onClick={submit}>{t('gfCreateBtn')} {icon('button_chevron_right', 'w-3.5 h-3.5')}</button>
    </div>
  );
}

// ── My posts ────────────────────────────────────────────────────────────────────────────────────

function PostsTab({ t, locale, goMatches, goCreate }: { t: TFn; locale: string; goMatches: () => void; goCreate: () => void }) {
  const [posts, setPosts] = useState<GitfindaPost[] | null>(null);
  const [err, setErr] = useState('');
  const [asking, setAsking] = useState<number | null>(null);
  const [zone, setZone] = useState('my');
  const tr = useLatest(t);
  const load = useCallback(() => {
    api.gitfindaMyPosts().then(r => { setPosts(r.posts); setErr(''); }).catch(e => { setErr(e instanceof Error ? e.message : tr.current('gfLoadFail')); setPosts([]); });
  }, [tr]);
  useEffect(load, [load]);
  const shownZone = zone === 'my' ? myZone() : zone;

  const cancel = async (id: number) => {
    try { await api.gitfindaCancel(id); setAsking(null); load(); }
    catch (e) { setErr(e instanceof Error ? e.message : t('gfLoadFail')); }
  };

  return (
    <div className="space-y-3">
      <ZonePicker t={t} value={zone} onChange={setZone} />
      {err && <div className="text-red-400 text-[12px] border border-red-900/60 bg-red-950/30 px-2 py-1">{err}</div>}
      {posts === null && <div className="text-orange-200/60 text-[12px]">{t('gfLoading')}</div>}
      {posts && posts.length === 0 && !err && (
        <div className="text-center py-8 text-orange-200/60 text-[13px]">{t('gfNoMyPosts')}<div className="mt-3"><button className={btnOrange} onClick={goCreate}>{t('gfNavCreate')}</button></div></div>
      )}
      {posts?.map(p => (
        <div key={p.id}>
          <PostCard t={t} locale={locale} post={p} zone={shownZone}
            action={
              <div className="text-right space-y-1.5">
                <div className={`text-[11px] font-bold uppercase tracking-wider ${STATUS_COLOUR[p.status]}`}>{t(STATUS_KEY[p.status])}</div>
                {(p.matchCount ?? 0) > 0 && <button className="block text-[11px] text-orange-300 underline" onClick={goMatches}>{tpl(t('gfMatchedBy'), { n: p.matchCount ?? 0 })}</button>}
                {(p.status === 'active' || p.status === 'matched') && asking !== p.id && (
                  <button className={btnGhost} onClick={() => setAsking(p.id)}>{t('gfCancelPost')}</button>
                )}
              </div>} />
          {asking === p.id && (
            <div className="border border-red-900/60 bg-red-950/30 px-3 py-2 mt-1 text-[12px] text-red-200 flex flex-wrap items-center gap-2">
              <span className="flex-1 min-w-[200px]">{t('gfCancelAsk')}</span>
              <button className={btnOrange} onClick={() => cancel(p.id)}>{t('gfCancelPost')}</button>
              <button className={btnGhost} onClick={() => setAsking(null)}>{t('gfKeepPost')}</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── My matches + chat ───────────────────────────────────────────────────────────────────────────

function MatchesTab({ t, locale, username, initialId, onRead, goBrowse }: {
  t: TFn; locale: string; username: string; initialId: number | null; onRead: () => void; goBrowse: () => void;
}) {
  const [matches, setMatches] = useState<GitfindaMatch[] | null>(null);
  const [selected, setSelected] = useState<number | null>(initialId);
  const [err, setErr] = useState('');
  const [zone, setZone] = useState('my');
  const shownZone = zone === 'my' ? myZone() : zone;
  const tr = useLatest(t);

  const load = useCallback(() => {
    api.gitfindaMyMatches().then(r => { setMatches(r.matches); setErr(''); }).catch(e => { setErr(e instanceof Error ? e.message : tr.current('gfLoadFail')); setMatches([]); });
  }, [tr]);
  useEffect(() => {
    load();
    const id = setInterval(load, 15000);
    return () => clearInterval(id);
  }, [load]);

  const current = matches?.find(m => m.id === selected) ?? null;
  // On a phone the screen is a flow: list → details + chat. On a wide screen both are shown.
  const showDetailOnly = selected !== null && current !== null;

  return (
    <div className="space-y-3">
      <ZonePicker t={t} value={zone} onChange={setZone} />
      {err && <div className="text-red-400 text-[12px] border border-red-900/60 bg-red-950/30 px-2 py-1">{err}</div>}
      {matches === null && <div className="text-orange-200/60 text-[12px]">{t('gfLoading')}</div>}
      {matches && matches.length === 0 && !err && (
        <div className="text-center py-8 text-orange-200/60 text-[13px]">{t('gfNoMatches')}<div className="mt-3"><button className={btnOrange} onClick={goBrowse}>{t('gfBackToBrowse')}</button></div></div>
      )}
      {matches && matches.length > 0 && (
        <div className="md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-3">
          <div className={`${showDetailOnly ? 'hidden md:block' : ''} space-y-2`}>
            <div className="text-[11px] uppercase tracking-wider text-orange-300">{icon('matched_gits_users', 'w-4 h-4')} {tpl(t('gfMatchedGits'), { n: matches.length })}</div>
            {matches.map(m => (
              <button key={m.id} onClick={() => { setSelected(m.id); onRead(); }}
                className={`${cardBox} w-full text-left p-2.5 ${selected === m.id ? '!border-orange-400 bg-orange-950/30' : ''} ${m.post.status === 'cancelled' || m.post.status === 'expired' ? 'opacity-60' : ''}`}>
                <div className="flex items-center gap-2">
                  <ArmyBadge army={m.post.army} size="w-7 h-7" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2"><span className="text-orange-300 font-bold text-[13px] truncate">{m.opponent}</span>
                      {(m.post.status === 'cancelled' || m.post.status === 'expired') && (
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${STATUS_COLOUR[m.post.status]}`}>{t(STATUS_KEY[m.post.status])}</span>
                      )}
                      {m.unread > 0 && <span className="bg-orange-500 text-black rounded-full px-1.5 text-[10px] font-bold">{m.unread}</span>}
                    </div>
                    <div className="text-[11px] text-orange-100/70 truncate">{factionLabel(m.post.army)} · {t(ENGAGEMENT_KEY[m.post.engagement])} · {m.post.points}</div>
                    <div className="text-[11px] text-orange-200/50 truncate">{m.lastMessage ?? t('gfNewMatch')}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className={`${showDetailOnly ? '' : 'hidden md:block'}`}>
            {current ? (
              <MatchDetail key={current.id} t={t} locale={locale} username={username} match={current} zone={shownZone} onBack={() => setSelected(null)} onRead={() => { onRead(); load(); }} onGone={() => { setSelected(null); onRead(); load(); }} />
            ) : <div className="hidden md:flex items-center justify-center h-full text-orange-200/40 text-[12px] border border-dashed border-orange-900/50 min-h-[200px]">{icon('chat', 'w-8 h-8 opacity-50')}</div>}
          </div>
        </div>
      )}
    </div>
  );
}

function MatchDetail({ t, locale, username, match, zone, onBack, onRead, onGone }: {
  t: TFn; locale: string; username: string; match: GitfindaMatch; zone: string; onBack: () => void; onRead: () => void; onGone: () => void;
}) {
  const [askingUnmatch, setAskingUnmatch] = useState(false);
  const withdraw = async () => {
    try { await api.gitfindaUnmatch(match.id); onGone(); }
    catch (e) { setErr(e instanceof Error ? e.message : t('gfLoadFail')); setAskingUnmatch(false); }
  };
  const [msgs, setMsgs] = useState<GitfindaMessage[]>([]);
  const [text, setText] = useState('');
  const [err, setErr] = useState('');
  const [sending, setSending] = useState(false);
  const lastId = useRef(0);
  const box = useRef<HTMLDivElement>(null);
  const matchId = match.id;
  const onReadRef = useLatest(onRead);
  const tr = useLatest(t);

  const pull = useCallback(async (first = false) => {
    try {
      const r = await api.gitfindaMessages(matchId, first ? 0 : lastId.current);
      if (r.messages.length) {
        lastId.current = r.messages[r.messages.length - 1].id;
        setMsgs(m => first ? r.messages : [...m, ...r.messages]);
        onReadRef.current();
      } else if (first) setMsgs([]);
    } catch (e) { setErr(e instanceof Error ? e.message : tr.current('gfLoadFail')); }
  }, [matchId, onReadRef, tr]);

  useEffect(() => {
    lastId.current = 0;
    void pull(true);
    // New messages arrive by asking again every few seconds; Vercel functions cannot hold a socket open.
    const id = setInterval(() => { if (!document.hidden) void pull(false); }, 4000);
    return () => clearInterval(id);
  }, [matchId, pull]);
  useEffect(() => { box.current?.scrollTo({ top: box.current.scrollHeight }); }, [msgs.length]);

  const send = async () => {
    const body = text.trim();
    if (!body || sending) return;
    setSending(true); setErr('');
    try { await api.gitfindaSend(matchId, body); setText(''); await pull(false); }
    catch (e) { setErr(e instanceof Error ? e.message : t('gfLoadFail')); }
    finally { setSending(false); }
  };

  const p = match.post;
  const time = (iso: string) => new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(iso));
  return (
    <div className="space-y-2">
      <button className="md:hidden text-[11px] text-orange-300 uppercase tracking-wider" onClick={onBack}>{icon('back_chevron', 'w-3.5 h-3.5')} {t('gfBack')}</button>
      <div className={`${cardBox} p-3`}>
        <div className="flex items-center gap-2 mb-2"><ArmyBadge army={p.army} size="w-9 h-9" />
          <div><div className="text-orange-300 font-bold">{match.opponent}</div><div className="text-[12px] text-orange-100/80">{factionLabel(p.army)}</div></div></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <Meta label={t('gfFEngagement')}>{t(ENGAGEMENT_KEY[p.engagement])}</Meta>
          <Meta label={t('gfFPoints')}>{p.points}</Meta>
          <Meta label={t('gfFZone')}>{offsetLabel(p.timezone)}</Meta>
        </div>
        <div className="mt-2 text-[12px]"><div className="text-[9px] uppercase tracking-[0.2em] text-orange-400/60">{t('gfAvailability')} <span className="normal-case tracking-normal text-orange-300/60">· {zoneNote(t, zone)}</span></div><Slots post={p} zone={zone} locale={locale} /></div>
        {p.eventName && <div className="mt-1 text-[11px] text-orange-300/80">{icon('engagement_crossed_swords', 'w-3.5 h-3.5')} {p.eventName}</div>}
        {/* Only the player who matched can take it back; the post's owner has Cancel for the whole post. */}
        {!match.iAmOwner && (askingUnmatch
          ? (
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px]">
              <span className="flex-1 min-w-[160px]">{t('gfUnmatchAsk')}</span>
              <button className={btnOrange} onClick={withdraw}>{t('gfUnmatch')}</button>
              <button className={btnGhost} onClick={() => setAskingUnmatch(false)}>{t('gfKeep')}</button>
            </div>
          )
          : <div className="mt-2"><button className={btnGhost} onClick={() => setAskingUnmatch(true)}>{t('gfUnmatch')}</button></div>)}
      </div>
      <div className={`${cardBox} flex flex-col`}>
        <div className="px-3 py-1.5 border-b border-orange-800/40 text-[11px] uppercase tracking-wider text-orange-300">{icon('chat')} {tpl(t('gfChatWith'), { name: match.opponent })}</div>
        <div ref={box} className="h-64 overflow-y-auto p-2 space-y-1.5" aria-live="polite">
          {msgs.length === 0 && <div className="text-center text-orange-200/40 text-[12px] pt-8">{t('gfNoMessages')}</div>}
          {msgs.map(m => (
            <div key={m.id} className={`max-w-[85%] px-2 py-1 text-[12px] rounded-sm ${m.mine ? 'ml-auto bg-orange-700/30 border border-orange-600/50' : 'bg-zinc-800/80 border border-zinc-700'}`}>
              <div className="text-[9px] text-orange-200/50 flex gap-2"><span>{m.mine ? t('gfYou') : m.username || username}</span><span>{time(m.createdAt)}</span></div>
              {/* Rendered as plain text by React: a message can never inject markup. */}
              <div className="text-orange-50 whitespace-pre-wrap break-words">{m.body}</div>
            </div>
          ))}
        </div>
        {err && <div className="text-red-400 text-[11px] px-2">{err}</div>}
        {(p.status === 'cancelled' || p.status === 'expired') && (
          <div className="px-3 py-2 border-t border-orange-800/40 text-[12px] text-zinc-400">{t('gfChatClosed')}</div>
        )}
        <div className={`flex gap-2 p-2 border-t border-orange-800/40 ${p.status === 'cancelled' || p.status === 'expired' ? 'hidden' : ''}`}>
          <input className={field} value={text} maxLength={1000} placeholder={t('gfTypeMessage')}
            onChange={e => setText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void send(); } }} />
          <button className={btnOrange} disabled={sending || !text.trim()} onClick={send} aria-label={t('gfSend')}>{icon('send', 'w-4 h-4')}</button>
        </div>
      </div>
    </div>
  );
}
