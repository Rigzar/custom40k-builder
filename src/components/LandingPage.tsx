import { useState, useEffect } from 'react';
import * as api from '../lib/api';
import { useArmyStore } from '../store/army';
import { ArmyConfig } from './ArmyConfig';
import { ChangelogModal } from './ChangelogModal';
import { LanguageSelector } from './LanguageSelector';
import { SupplementModal, type SupplementKey } from './SupplementModal';
import { FactionSymbol } from './FactionSymbol';
import { Avatar } from './Avatar';
import { MessagesModal, InquisitorBadge } from './MessagesModal';
import { useT, useLanguage, setTranslationOverrides, type Language, type TranslationKey } from '../i18n';
import { useAuth } from '../hooks/useAuth';
import type { SavedArmy } from '../hooks/useSavedArmies';
import { CHANGELOG } from '../data/changelog';
import { ENGAGEMENTS } from '../engine/engagements';
import type { EngagementType } from '../types/army';

const ANNOUNCEMENT_KEY = 'c40k_announcement_v155b_dismissed';

type AnnouncementLang = { title: string; intro: string; install: string; line1: string; line2: string; line3: string; line4: string; line5: string; line6: string; contrib: string; };
const ANNOUNCEMENT_TEXT: Record<Language, AnnouncementLang> = {
  en: {
    title: 'v1.55: upgrade weapons no longer show unless you take them',
    intro: 'A fix that touches every faction, plus a full re-audit of the Space Marines codex.',
    install: '',
    line6: '',
    line1: '🔫 All factions — a lot of upgrade weapons were shown in a unit\'s profile even when you hadn\'t bought them (vehicle turrets/sponsons, two-mode plasma and melta, the Plagueburst Crawler\'s Entropy cannons, the Daemon Prince\'s Plague spewer, and more). They now stay hidden until you actually take them; your default weapons are unaffected. About 180 phantom entries cleaned up.',
    line2: '⚔ Space Marines — the Indomitus Crusader Squad now has its "Squires" rule: Neophytes are always removed first as casualties and use their own defensive profile, even when they are not the majority. It was missing from the datasheet.',
    line3: '',
    line4: '',
    line5: '',
    contrib: '👁️ Reporting a bug? Please be specific — come to our Discord and explain exactly what happens (which unit, engagement and archetype) with a screenshot. Vague reports like "it says 6 Troops but I have 0" (that "6" is the slot maximum 2-6, not a count) can\'t be reproduced, so we can\'t fix them.',
  },
  de: {
    title: 'v1.55: Ausrüstungswaffen erscheinen nur noch, wenn du sie nimmst',
    intro: 'Eine Korrektur, die jede Fraktion betrifft, plus eine vollständige Nachprüfung des Space-Marines-Codex.',
    install: '',
    line6: '',
    line1: '🔫 Alle Fraktionen — viele Ausrüstungswaffen wurden im Profil angezeigt, obwohl du sie nicht gekauft hattest (Fahrzeug-Türme/-Sponsons, Plasma und Melta mit zwei Modi, die Entropy cannons des Plagueburst Crawlers, der Plague spewer des Daemon Prince und mehr). Sie bleiben jetzt verborgen, bis du sie wirklich nimmst; deine Standardwaffen sind nicht betroffen. Rund 180 Geistereinträge bereinigt.',
    line2: '⚔ Space Marines — die Indomitus Crusader Squad hat jetzt ihre Regel „Squires": Neophyten werden immer zuerst als Verluste entfernt und nutzen ihr eigenes Verteidigungsprofil, auch wenn sie nicht die Mehrheit sind. Sie fehlte im Datenblatt.',
    line3: '',
    line4: '',
    line5: '',
    contrib: '👁️ Einen Fehler gefunden? Bitte sei konkret — komm auf unseren Discord und erkläre genau, was passiert (welche Einheit, Engagement und Archetyp), mit einem Screenshot. Vage Meldungen wie „es zeigt 6 Truppen, ich habe aber 0" (die „6" ist das Slot-Maximum 2-6, keine Anzahl) lassen sich nicht nachstellen und daher nicht beheben.',
  },
  es: {
    title: 'v1.55: las armas de mejora ya no se muestran si no las coges',
    intro: 'Una corrección que afecta a todas las facciones, más una re-auditoría completa del códex Space Marines.',
    install: '',
    line6: '',
    line1: '🔫 Todas las facciones — muchas armas de mejora se mostraban en el perfil de una unidad aunque no las hubieras comprado (torretas y patrocinadores de vehículos, plasma y melta de dos modos, los Entropy cannons del Plagueburst Crawler, el Plague spewer del Daemon Prince y más). Ahora quedan ocultas hasta que las coges de verdad; tus armas por defecto no cambian. Unas 180 entradas fantasma limpiadas.',
    line2: '⚔ Space Marines — la Indomitus Crusader Squad ya tiene su regla "Squires": los Neophytes se retiran siempre primero como bajas y usan su propio perfil defensivo, aunque no sean la mayoría. Faltaba en la hoja de datos.',
    line3: '',
    line4: '',
    line5: '',
    contrib: '👁️ ¿Encontraste un bug? Sé específico, por favor — pásate por nuestro Discord y explica exactamente qué pasa (qué unidad, engagement y arquetipo) con una captura de pantalla. Los reportes vagos como "dice que tengo 6 tropas pero tengo 0" (ese "6" es el máximo del slot 2-6, no un recuento) no se pueden reproducir, así que no podemos arreglarlos.',
  },
};

/* canvas-smoke placeholder — wire up here when user provides the effect */

function BoldSplitLine({ text }: { text: string }) {
  const parts = text.split(' — ');
  if (parts.length < 2) return <p>{text}</p>;
  return <p><strong className="text-emerald-400">{parts[0]}</strong> — {parts.slice(1).join(' — ')}</p>;
}

function ClipSvg() {
  return (
    <svg width="14" height="22" viewBox="0 0 14 22" fill="none" aria-hidden="true">
      <rect x="1.5" y="0.5" width="11" height="15" rx="2.5" stroke="#52525b" strokeWidth="1.5" fill="#27272a"/>
      <rect x="4"   y="7"   width="6"  height="15" rx="1.5" stroke="#3f3f46" strokeWidth="1.5" fill="#3f3f46"/>
    </svg>
  );
}

function CommunityAnnouncement() {
  const { language } = useLanguage();
  const tx = ANNOUNCEMENT_TEXT[language];
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(ANNOUNCEMENT_KEY) === 'true'
  );
  if (dismissed) return null;
  return (
    <div className="relative mb-6">
      {/* Space for skull above the card */}
      <div className="h-14" />

      {/* Servo skull — large, centered, appears to hold the card from above */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 pointer-events-none select-none">
        <div className="relative inline-block w-28 h-28">
          <img
            src="/servo-skull.png"
            alt=""
            className="w-28 h-28 object-contain drop-shadow-[0_4px_20px_rgba(180,83,9,0.45)]"
            draggable={false}
          />
          <div className="servo-eye" aria-hidden="true" />
        </div>
      </div>

      {/* Binder clips at card top edge, connecting skull to document */}
      <div className="absolute top-14 left-0 right-0 flex justify-between px-8 z-10 pointer-events-none select-none">
        <ClipSvg /><ClipSvg /><ClipSvg />
      </div>

      {/* Ordo card — pt-14 so content clears the skull overlap */}
      <div className="bg-zinc-900 border border-zinc-700 border-t-2 border-t-amber-900/80 px-5 pt-14 pb-4">
        <div className="flex justify-between items-start gap-4">
          <div className="text-[10px] text-amber-600 uppercase tracking-widest font-semibold mb-2 flex items-center gap-1.5">
            <span className="opacity-60">⚙</span>
            {tx.title}
          </div>
          <button
            onClick={() => { localStorage.setItem(ANNOUNCEMENT_KEY, 'true'); setDismissed(true); }}
            className="text-zinc-600 hover:text-zinc-300 text-lg leading-none shrink-0 transition-colors"
            title="Dismiss"
          >
            ×
          </button>
        </div>
        <div className="text-[12px] text-zinc-300 leading-relaxed space-y-2">
          <p>{tx.intro}</p>
          {/* `install` is a highlighted block used only when a release leads with the PWA/offline
              news; empty on releases that don't (skipped so it leaves no gap). */}
          {tx.install && (
            <p className="border-l-2 border-emerald-600/70 bg-emerald-950/20 pl-3 py-2 text-zinc-200">
              {tx.install}
            </p>
          )}
          {[tx.line6, tx.line1, tx.line2, tx.line3, tx.line4, tx.line5]
            .filter(Boolean)
            .map((line, i) => <BoldSplitLine key={i} text={line} />)}
          <p className="text-zinc-400">{tx.contrib}</p>
        </div>
      </div>
    </div>
  );
}

/** Separate, admin-authored announcement banner (from the DB), shown BELOW the release-notes card. */
/** Stable 32-bit hash of a string — used to key an announcement's dismissal by its CONTENT. */
function hashString(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

function AdminAnnouncement({ setting }: { setting: api.AnnouncementSetting | null }) {
  const { language } = useLanguage();
  // Key the dismissal off the announcement's CONTENT, not its `version` field. `version` is
  // optional in the admin form, so it fell back to the literal 'default' — dismissing one
  // announcement then hid EVERY future one forever, because the key never changed. Hashing the
  // text means any edit (or a brand-new announcement) produces a new key and shows again, while
  // re-dismissing the same text keeps it hidden. `version` still participates when it is set.
  const dismissKey = setting
    ? `c40k_admin_ann_${hashString((setting.version || '') + JSON.stringify(setting.text ?? {}))}_dismissed`
    : 'c40k_admin_ann_pending';
  const [dismissed, setDismissed] = useState(false);

  // The setting arrives asynchronously from /api/settings, so the key is not known on first
  // render. Re-read the stored flag whenever the key changes, or the initial (keyless) state
  // would stick and a fresh announcement would stay hidden.
  useEffect(() => {
    setDismissed(localStorage.getItem(dismissKey) === 'true');
  }, [dismissKey]);

  if (!setting || setting.enabled === false) return null;
  const t = setting.text?.[language] ?? setting.text?.en;
  const lines = (t?.lines ?? []).filter(Boolean);
  if (!t || (!t.title && !t.intro && lines.length === 0)) return null;   // nothing to show
  if (dismissed) return null;
  return (
    <div className="relative mb-6 bg-zinc-900 border border-sky-900/70 border-l-2 border-l-sky-500/80 px-5 py-4">
      <div className="flex justify-between items-start gap-4">
        <div className="text-[10px] text-sky-400 uppercase tracking-widest font-semibold mb-2 flex items-center gap-1.5">
          <span className="opacity-80">📣</span>
          {t.title}
        </div>
        <button
          onClick={() => { localStorage.setItem(dismissKey, 'true'); setDismissed(true); }}
          className="text-zinc-600 hover:text-zinc-300 text-lg leading-none shrink-0 transition-colors"
          title="Dismiss"
        >×</button>
      </div>
      <div className="text-[12px] text-zinc-300 leading-relaxed space-y-2">
        {t.intro && <p>{t.intro}</p>}
        {lines.map((line, i) => <BoldSplitLine key={i} text={line} />)}
        {t.contrib && <p className="text-zinc-400">{t.contrib}</p>}
        {setting.author && (
          <p className="text-[11px] text-zinc-500 flex items-center gap-1.5 pt-1">
            — <span className="text-amber-400">{setting.author}</span>
            <InquisitorBadge label="Inquisitor" />
          </p>
        )}
      </div>
    </div>
  );
}

type FactionStatus = 'complete' | 'testing' | 'inreview' | 'unreviewed';

interface FactionDef {
  key: string;
  name: string;
  available: boolean;
  status: FactionStatus;
  /** Codex document version (from the faction's canonical .ods title), shown on the button. */
  version?: string;
}

interface Category {
  name: string;
  icon: string;
  pillFg: string;
  dividerColor: string;
  factions: FactionDef[];
}

const STATUS_DOT: Record<FactionStatus, string> = {
  complete:   'bg-green-500',
  testing:    'bg-amber-400',
  inreview:   'bg-orange-500',
  unreviewed: 'bg-red-500',
};

const STATUS_I18N_KEY: Record<FactionStatus, TranslationKey> = {
  complete:   'fullyReviewed',
  testing:    'needsTesting',
  inreview:   'inReview',
  unreviewed: 'notReviewed',
};

const CATEGORIES: Category[] = [
  {
    name: 'Chaos',
    icon: '/category-icons/chaos.svg',
    pillFg: '#cc8888', dividerColor: '#3a1a1a',
    factions: [
      { key: 'chaos_space_marines', name: 'Chaos Space Marines', available: true, status: 'complete', version: '1.00' },
      { key: 'chaos_daemons',       name: 'Chaos Daemons',       available: true, status: 'complete', version: '1.00' },
    ],
  },
  {
    name: 'Imperium',
    icon: '/category-icons/imperium.svg',
    pillFg: '#c8b56a', dividerColor: '#3a3520',
    factions: [
      { key: 'space_marines',      name: 'Space Marines',      available: true, status: 'complete', version: '1.01' },
      { key: 'imperial_guard',     name: 'Imperial Guard',     available: true, status: 'complete', version: '1.02' },
      { key: 'adeptus_mechanicus', name: 'Adeptus Mechanicus', available: true, status: 'testing', version: '1.00' },
      { key: 'adeptus_custodes',   name: 'Adeptus Custodes',   available: true, status: 'testing', version: '1.00' },
      { key: 'adeptus_sororitas',  name: 'Adeptus Sororitas',  available: true, status: 'testing', version: '1.00' },
      { key: 'grey_knights',       name: 'Grey Knights',       available: true, status: 'complete', version: '1.01' },
      { key: 'inquisition',        name: 'Inquisition',        available: true, status: 'testing', version: '1.00' },
    ],
  },
  {
    name: 'Xenos',
    icon: '/category-icons/xenos.svg',
    pillFg: '#6ab88a', dividerColor: '#1a3a28',
    factions: [
      { key: 'tau_empire',        name: 'Tau Empire',        available: true, status: 'testing', version: '1.00' },
      { key: 'necrons',           name: 'Necrons',           available: true, status: 'complete', version: '1.01' },
      { key: 'orks',              name: 'Orks',              available: true, status: 'complete', version: '1.01' },
      { key: 'eldar',             name: 'Eldar',             available: true, status: 'complete', version: '1.01' },
      { key: 'dark_eldar',        name: 'Dark Eldar',        available: true, status: 'complete', version: '1.01' },
      { key: 'genestealer_cults', name: 'Genestealer Cults', available: true, status: 'testing', version: '1.00' },
      { key: 'harlequins',        name: 'Harlequins',        available: true, status: 'testing', version: '1.00' },
      { key: 'leagues_of_votann', name: 'Leagues of Votann', available: true, status: 'complete', version: '1.02' },
      { key: 'tyranids',          name: 'Tyranids',          available: true, status: 'complete', version: '1.02' },
    ],
  },
];

/** Flat {key,name,defaultAvailable} list of every faction — used by the admin availability toggles. */
export const ALL_FACTIONS: { key: string; name: string; defaultAvailable: boolean }[] =
  CATEGORIES.flatMap(c => c.factions.map(f => ({ key: f.key, name: f.name, defaultAvailable: f.available })));

function formatDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
}

function getFactionName(key: string): string {
  for (const cat of CATEGORIES) {
    const f = cat.factions.find(f => f.key === key);
    if (f) return f.name;
  }
  return key;
}

interface Props {
  selectedFaction: string | null;
  loading: boolean;
  saves: SavedArmy[];
  onSelectFaction: (key: string | null) => void;
  onBuild: () => void;
  onLoadArmy: (save: SavedArmy) => void;
  onDeleteArmy: (id: string) => void;
  onShowAuth: () => void;
  onShowCloudSaves?: () => void;
  onShowCommunity?: () => void;
  hideArmyConfig?: boolean;
}

export function LandingPage({
  selectedFaction, loading, saves,
  onSelectFaction, onBuild, onLoadArmy, onDeleteArmy, onShowAuth, onShowCloudSaves, onShowCommunity,
}: Props) {
  const { data, engagement, pointLimit, setEngagement, setPointLimit } = useArmyStore();
  const [view, setView] = useState<'hero' | 'setup' | 'config'>('hero');
  const [showChangelog, setShowChangelog] = useState(false);
  // The fog is now STATIC. Animating the feTurbulence baseFrequency re-rendered a full-screen
  // fractalNoise + displacement filter every update — even throttled it kept the CPU at ~12% idle
  // and spun up fans. The static turbulence renders once and then just composites, so idle CPU
  // drops to ~0 while the fog still looks the same. (No rAF loop, no per-frame recompute.)
  const [openSupplement, setOpenSupplement] = useState<SupplementKey | null>(null);
  // Admin-editable overrides fetched from the DB (fail-soft: defaults from code if this never loads).
  const [announcement, setAnnouncement] = useState<api.AnnouncementSetting | null>(null);
  const [factionFlags, setFactionFlags] = useState<api.FactionFlags | null>(null);
  const [showMessages, setShowMessages] = useState(false);
  const [unread, setUnread] = useState(0);
  useEffect(() => {
    api.getPublicSettings()
      .then(s => {
        setAnnouncement(s.announcement);
        setFactionFlags(s.factionFlags);
        setTranslationOverrides(s.translations);   // apply admin-edited UI strings app-wide
      })
      .catch(() => { /* keep code defaults */ });
  }, []);
  const latestVersion = CHANGELOG[0]?.version ?? '';
  const t = useT();
  const { loggedIn, username, avatar } = useAuth();
  const refreshUnread = () => { api.getUnreadCount().then(r => setUnread(r.count)).catch(() => {}); };
  useEffect(() => { if (loggedIn) refreshUnread(); else setUnread(0); }, [loggedIn]);

  const displaySaves = saves.filter(s => s.id !== 'autosave-session' && !s.id.startsWith('autosave'));

  const engKeys = Object.keys(ENGAGEMENTS) as EngagementType[];

  function handleSetEngagement(e: EngagementType) {
    const eng = ENGAGEMENTS[e];
    setEngagement(e);
    if (pointLimit < eng.min) setPointLimit(eng.min);
    else if (pointLimit > eng.max) setPointLimit(eng.max);
  }

  function handleSelectFactionInSetup(key: string | null) {
    onSelectFaction(key);
    if (key) setView('config');
  }

  // ── Hero view ───────────────────────────────────────────────────────────────
  if (view === 'hero') {
    return (
      <div className="relative min-h-screen bg-zinc-950 text-zinc-100 flex flex-col overflow-hidden">
        {/* SVG fog filter */}
        <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
          <defs>
            <filter id="c40k-fog" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="3" />
              <feDisplacementMap in="SourceGraphic" scale="55" />
            </filter>
          </defs>
        </svg>
        <div className="fog-layer" />

        {/* Top bar */}
        <div className="relative z-10 flex justify-between items-center px-5 py-3 border-b border-zinc-900">
          <LanguageSelector />
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowChangelog(true)}
              className="text-[11px] uppercase tracking-wide text-zinc-500 hover:text-amber-400 transition-colors"
            >
              v{latestVersion}
            </button>
          </div>
        </div>

        {showChangelog && <ChangelogModal onClose={() => setShowChangelog(false)} />}
        {showMessages && <MessagesModal onClose={() => { setShowMessages(false); refreshUnread(); }} />}

        {/* Center content */}
        <div className="relative z-10 flex flex-col items-center pt-14 pb-8 px-6">

          {/* Logo */}
          <img
            src="/custom40k-logo.png"
            alt="Custom40k"
            className="w-64 sm:w-80 mb-8 object-contain select-none logo-glitch"
            draggable={false}
          />

          {/* Ornamental divider */}
          <div className="flex items-center gap-3 w-full max-w-xs mb-8 anim-divider anim-delay-1">
            <div className="flex-1 h-px bg-amber-900/50" />
            <div className="w-1.5 h-1.5 bg-amber-800 rotate-45 shrink-0" />
            <div className="flex-1 h-px bg-amber-900/50" />
          </div>

          {/* Announcement — always first after title */}
          <div className="w-full mb-2 anim-fade-up anim-delay-2">
            <CommunityAnnouncement />
            <AdminAnnouncement setting={announcement} />
          </div>

          {/* Quick-load: saved armies */}
          {displaySaves.length > 0 && (
            <div className="w-full max-w-xs mb-6 anim-fade-up anim-delay-3">
              <div className="text-[10px] uppercase tracking-widest text-zinc-600 mb-2 text-center">
                {t('savedArmies')}
              </div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {displaySaves.slice(0, 4).map(save => (
                  <button
                    key={save.id}
                    onClick={() => onLoadArmy(save)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 bg-zinc-900 border border-zinc-800 hover:border-amber-800/60 hover:bg-zinc-800 transition-colors text-left"
                  >
                    <FactionSymbol factionKey={save.factionKey} size={22} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] text-zinc-200 truncate">{save.name}</div>
                      <div className="text-[10px] text-zinc-500">{save.totalPts} pts · {formatDate(save.savedAt)}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons 2×2 */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-xs anim-fade-up anim-delay-4">
            <a
              href="https://custom40k-wiki.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-sweep flex items-center justify-center gap-2 py-3 px-4 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-zinc-100 text-[12px] uppercase tracking-wider transition-colors"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              Wiki
            </a>

            <button
              onClick={() => loggedIn ? onShowCloudSaves?.() : onShowAuth()}
              className="btn-sweep flex items-center justify-center gap-2 py-3 px-4 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-zinc-100 text-[12px] uppercase tracking-wider transition-colors"
            >
              {loggedIn && username
                ? <Avatar username={username} avatar={avatar} size={18} />
                : <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              }
              {loggedIn ? (username ?? 'Account') : 'Login / Sign in'}
            </button>

            {loggedIn && (
              <button
                onClick={() => setShowMessages(true)}
                className="btn-sweep relative flex items-center justify-center gap-2 py-3 px-4 border border-zinc-700 hover:border-amber-700 text-zinc-300 hover:text-amber-300 text-[12px] uppercase tracking-wider transition-colors"
              >
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                Messages
                {unread > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-amber-700 text-amber-100 text-[9px] rounded-full px-1.5 py-0.5 leading-none">{unread}</span>
                )}
              </button>
            )}

            <a
              href="https://custom40k-wiki.vercel.app/glossary"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-sweep flex items-center justify-center gap-2 py-3 px-4 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-zinc-100 text-[12px] uppercase tracking-wider transition-colors"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              Glossary
            </a>

            <button
              onClick={() => setView('setup')}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-amber-800 border-2 border-amber-600 hover:bg-amber-700 text-white text-[12px] uppercase tracking-wider font-bold transition-colors"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              {t('buildArmy')}
            </button>

            <button
              onClick={() => onShowCommunity ? onShowCommunity() : (loggedIn ? onShowCloudSaves?.() : onShowAuth())}
              className="col-span-2 btn-sweep flex items-center justify-center gap-2 py-3 px-4 border border-zinc-700 hover:border-amber-700 text-zinc-400 hover:text-amber-300 text-[12px] uppercase tracking-wider transition-colors"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              Community Armies
            </button>
          </div>

          {/* Discord */}
          <a
            href="https://discord.com/invite/wnGAB3TYAY"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 flex items-center gap-2 text-[11px] text-zinc-600 hover:text-indigo-400 transition-colors uppercase tracking-wider anim-fade-up anim-delay-5"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Discord
          </a>

        </div>

        {/* Supplements */}
        <div className="px-6 pb-6 max-w-sm mx-auto w-full anim-fade-up anim-delay-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 shrink-0">{t('supplements')}</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setOpenSupplement('horus_heresy')}
              className="btn-sweep relative flex items-center gap-4 px-5 py-5 w-full bg-zinc-900 border border-zinc-800 border-l-[4px] border-l-red-900 hover:bg-zinc-800/70 hover:border-zinc-700 hover:border-l-red-700 transition-all text-left group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-950/30 to-transparent pointer-events-none" />
              <img src="/faction-symbols/horus-heresy.svg" alt="" className="relative z-10 shrink-0" style={{ width: 54, height: 54, filter: 'brightness(0) invert(1) opacity(0.75)' }} draggable={false} />
              <div className="relative z-10 flex-1 min-w-0">
                <div className="text-zinc-100 text-[13px] font-bold uppercase tracking-wide mb-0.5">Horus Heresy</div>
                <div className="text-zinc-500 text-[10px] leading-relaxed">Space Marine legions of the Age of Darkness</div>
                <div className="text-red-900 group-hover:text-red-600 text-[10px] uppercase tracking-widest mt-1.5 transition-colors">Legiones Astartes</div>
              </div>
              <svg className="relative z-10 w-4 h-4 text-red-900 group-hover:text-red-500 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => setOpenSupplement('escalation')}
              className="btn-sweep relative flex items-center gap-4 px-5 py-5 w-full bg-zinc-900 border border-zinc-800 border-l-[4px] border-l-amber-800 hover:bg-zinc-800/70 hover:border-zinc-700 hover:border-l-amber-600 transition-all text-left group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-950/30 to-transparent pointer-events-none" />
              <img src="/faction-symbols/escalation.svg" alt="" className="relative z-10 shrink-0" style={{ width: 54, height: 54, filter: 'brightness(0) invert(1) opacity(0.75)' }} draggable={false} />
              <div className="relative z-10 flex-1 min-w-0">
                <div className="text-zinc-100 text-[13px] font-bold uppercase tracking-wide mb-0.5">Escalation</div>
                <div className="text-zinc-500 text-[10px] leading-relaxed">Super-heavy vehicles and Gargantuan Creatures</div>
                <div className="text-amber-800 group-hover:text-amber-600 text-[10px] uppercase tracking-widest mt-1.5 transition-colors">Lords of War</div>
              </div>
              <svg className="relative z-10 w-4 h-4 text-amber-800 group-hover:text-amber-500 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => setOpenSupplement('assassins')}
              className="btn-sweep relative flex items-center gap-4 px-5 py-5 w-full bg-zinc-900 border border-zinc-800 border-l-[4px] border-l-zinc-600 hover:bg-zinc-800/70 hover:border-zinc-600 hover:border-l-zinc-400 transition-all text-left group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-800/40 to-transparent pointer-events-none" />
              <img src="/faction-symbols/assassins.svg" alt="" className="relative z-10 shrink-0" style={{ width: 54, height: 54, filter: 'brightness(0) invert(1) opacity(0.75)' }} draggable={false} />
              <div className="relative z-10 flex-1 min-w-0">
                <div className="text-zinc-100 text-[13px] font-bold uppercase tracking-wide mb-0.5">Assassins</div>
                <div className="text-zinc-500 text-[10px] leading-relaxed">Operatives of the Officio Assassinorum</div>
                <div className="text-zinc-500 group-hover:text-zinc-300 text-[10px] uppercase tracking-widest mt-1.5 transition-colors">Execution Force</div>
              </div>
              <svg className="relative z-10 w-4 h-4 text-zinc-600 group-hover:text-zinc-300 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Supplement drawer — rendered at root level to escape any container z-index/overflow */}
        {openSupplement && <SupplementModal supplement={openSupplement} onClose={() => setOpenSupplement(null)} />}

      </div>
    );
  }

  // ── Config view — Army Config (archetype / legacy / traits) ─────────────────
  if (view === 'config') {
    const factionName = selectedFaction ? getFactionName(selectedFaction) : '';
    const engData = ENGAGEMENTS[engagement];
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">

        {/* Sub-header */}
        <header className="bg-zinc-900 border-b-2 border-amber-900/60 px-4 py-3 sticky top-0 z-30">
          <div className="max-w-screen-lg mx-auto flex items-center justify-between gap-4">
            <button
              onClick={() => { onSelectFaction(null); setView('setup'); }}
              className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-zinc-400 hover:text-amber-400 transition-colors"
            >
              ← {t('selectFaction')}
            </button>
            <h1 className="font-cinzel text-sm uppercase tracking-widest text-amber-700">
              {t('armyConfiguration')}
            </h1>
            <LanguageSelector />
          </div>
        </header>

        {showChangelog && <ChangelogModal onClose={() => setShowChangelog(false)} />}
        {showMessages && <MessagesModal onClose={() => { setShowMessages(false); refreshUnread(); }} />}

        <div className="max-w-screen-lg mx-auto px-4 py-8 space-y-6 w-full">

          {/* Faction + battle summary */}
          {selectedFaction && (
            <div className="flex items-center gap-4 px-4 py-3 bg-zinc-900 border border-zinc-700 border-l-4 border-l-amber-800">
              <FactionSymbol factionKey={selectedFaction} size={40} />
              <div>
                <div className="text-sm font-semibold text-zinc-100">{factionName}</div>
                <div className="text-[11px] text-amber-700 uppercase tracking-wide mt-0.5">
                  {engData.name} · {pointLimit} pts
                </div>
              </div>
            </div>
          )}

          {/* Army Config */}
          {loading || !data ? (
            <div className="flex items-center gap-3 text-zinc-500 py-8">
              <div className="w-5 h-5 border-2 border-amber-700 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">{t('loadingFactionData')}</span>
            </div>
          ) : (
            <ArmyConfig showBattleSetup={false} />
          )}

          {/* Add Troops button */}
          {data && selectedFaction && (
            <div className="flex justify-center pt-2 pb-8">
              <button
                onClick={() => onBuild()}
                className="px-10 py-3 bg-amber-800 border-2 border-amber-600 text-white font-bold uppercase tracking-widest text-sm hover:bg-amber-700 transition-colors"
              >
                {t('addTroops')} →
              </button>
            </div>
          )}

        </div>
      </div>
    );
  }

  // ── Setup view — Battle Setup + Faction selection ───────────────────────────
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">

      {/* Sub-header */}
      <header className="bg-zinc-900 border-b-2 border-amber-900/60 px-4 py-3 sticky top-0 z-30">
        <div className="max-w-screen-lg mx-auto flex items-center justify-between gap-4">
          <button
            onClick={() => { setView('hero'); onSelectFaction(null); }}
            className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-zinc-400 hover:text-amber-400 transition-colors"
          >
            ← Home
          </button>
          <h1 className="font-cinzel text-sm uppercase tracking-widest text-amber-700">
            {t('buildArmy')}
          </h1>
          <LanguageSelector />
        </div>
      </header>

      {showChangelog && <ChangelogModal onClose={() => setShowChangelog(false)} />}
      {openSupplement && <SupplementModal supplement={openSupplement} onClose={() => setOpenSupplement(null)} />}
      {showMessages && <MessagesModal onClose={() => { setShowMessages(false); refreshUnread(); }} />}

      <div className="max-w-screen-lg mx-auto px-4 py-8 space-y-10 w-full">

        {/* ── Battle Setup ── */}
        <section>
          <h2 className="text-[11px] uppercase tracking-widest text-amber-700 mb-4">
            {t('battleSetup')}
          </h2>
          <div className="border border-zinc-800 bg-zinc-900/50">
            <div className="p-4 space-y-4">

              {/* Engagement type */}
              <div>
                <div className="text-[10px] text-zinc-400 uppercase tracking-widest mb-2">{t('battleType')}</div>
                <div className="grid grid-cols-3 gap-2">
                  {engKeys.map(e => (
                    <button
                      key={e}
                      onClick={() => handleSetEngagement(e)}
                      className={`py-2.5 font-cinzel text-[10px] uppercase tracking-wide border transition-colors
                        ${engagement === e
                          ? 'bg-amber-900/50 border-amber-600 text-amber-300'
                          : 'bg-zinc-800/60 border-zinc-700 text-zinc-400 hover:text-amber-400 hover:border-zinc-600'
                        }`}
                    >
                      {ENGAGEMENTS[e].name}
                    </button>
                  ))}
                </div>
                {ENGAGEMENTS[engagement].notes && (
                  <div className="mt-2 text-[10px] text-zinc-500 border-l-2 border-amber-900/50 pl-2 leading-relaxed">
                    {ENGAGEMENTS[engagement].notes}
                  </div>
                )}
              </div>

              {/* Points limit */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest">{t('pointsLimit')}</span>
                <input
                  type="number"
                  value={pointLimit}
                  min={ENGAGEMENTS[engagement].min}
                  max={ENGAGEMENTS[engagement].max}
                  step={250}
                  onChange={e => {
                    const v = Number(e.target.value);
                    const eng = ENGAGEMENTS[engagement];
                    setPointLimit(Math.min(eng.max, Math.max(eng.min, v)));
                  }}
                  onBlur={e => {
                    const v = Number(e.target.value);
                    const eng = ENGAGEMENTS[engagement];
                    setPointLimit(Math.min(eng.max, Math.max(eng.min, v)));
                  }}
                  className="w-28 bg-zinc-950 border border-zinc-700 text-amber-300 px-3 py-1.5 text-sm
                    focus:outline-none focus:border-amber-600 text-center tabular-nums"
                />
                <span className="text-[10px] text-zinc-600">pts</span>
                <span className="text-[10px] text-zinc-600">({ENGAGEMENTS[engagement].range})</span>
              </div>

            </div>
          </div>
        </section>

        {/* ── Saved armies ── */}
        {displaySaves.length > 0 && (
          <section>
            <h2 className="text-[11px] uppercase tracking-widest text-amber-700 mb-4">
              {t('savedArmies')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {displaySaves.map(save => (
                <div
                  key={save.id}
                  className="bg-zinc-900 border border-zinc-700 border-l-4 border-l-amber-800 p-3 flex flex-col gap-2 rounded-sm"
                >
                  <div className="flex items-start justify-between gap-2 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <FactionSymbol factionKey={save.factionKey} size={28} />
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-zinc-100 truncate">{save.name}</div>
                        <div className="text-[10px] text-amber-700 uppercase tracking-wide mt-0.5">{save.factionLabel}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteArmy(save.id)}
                      className="text-zinc-600 hover:text-red-400 text-lg leading-none shrink-0 transition-colors"
                      title={t('delete')}
                    >
                      ×
                    </button>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                    <span>{save.unitCount} {t('models')}</span>
                    <span>·</span>
                    <span>{save.totalPts} {t('points')}</span>
                    <span>·</span>
                    <span>{formatDate(save.savedAt)}</span>
                  </div>
                  <button
                    onClick={() => onLoadArmy(save)}
                    className="mt-1 w-full text-center text-[11px] uppercase tracking-wide py-1.5 bg-amber-900/30 border border-amber-800/60 text-amber-400 hover:bg-amber-800/40 transition-colors"
                  >
                    {t('loadArmy')}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Faction selection ── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[11px] uppercase tracking-widest text-amber-700">{t('selectFaction')}</h2>
            <div className="flex items-center gap-3 text-[10px] text-zinc-500">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" />{t('fullyReviewed')}</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />{t('needsTesting')}</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />{t('inReview')}</span>
            </div>
          </div>

          <div className="space-y-7">
            {CATEGORIES.map(cat => (
              <div key={cat.name}>
                <div className="flex items-center gap-2.5 mb-3">
                  <img
                    src={cat.icon}
                    alt={cat.name}
                    className="shrink-0"
                    style={{ width: cat.name === 'Imperium' ? 68 : 52, height: cat.name === 'Imperium' ? 68 : 52, filter: 'brightness(0) invert(1)', opacity: 0.60 }}
                  />
                  <span
                    className="font-cinzel text-[11px] uppercase tracking-widest shrink-0"
                    style={{ color: cat.pillFg }}
                  >
                    {cat.name}
                  </span>
                  <div className="flex-1 h-px" style={{ background: cat.dividerColor }} />
                </div>

                <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))' }}>
                  {cat.factions.map(fDef => {
                    // availability can be overridden by the admin faction-flags setting
                    const f = { ...fDef, available: factionFlags?.[fDef.key] ?? fDef.available };
                    return (
                    <button
                      key={f.key}
                      onClick={() => { if (f.available) { handleSelectFactionInSetup(f.key); } }}
                      disabled={!f.available}
                      onMouseMove={f.available ? (e) => {
                        const r = e.currentTarget.getBoundingClientRect();
                        const x = (e.clientX - r.left) / r.width - 0.5;
                        const y = (e.clientY - r.top) / r.height - 0.5;
                        e.currentTarget.style.setProperty('--tilt-x', `${y * -10}deg`);
                        e.currentTarget.style.setProperty('--tilt-y', `${x * 10}deg`);
                        e.currentTarget.style.setProperty('--shine-x', `${(x + 0.5) * 100}%`);
                        e.currentTarget.style.setProperty('--shine-y', `${(y + 0.5) * 100}%`);
                      } : undefined}
                      onMouseLeave={f.available ? (e) => {
                        e.currentTarget.style.setProperty('--tilt-x', '0deg');
                        e.currentTarget.style.setProperty('--tilt-y', '0deg');
                      } : undefined}
                      className={`
                        relative flex flex-col items-center gap-2 pt-4 pb-3 px-2 border rounded-lg text-center transition-all
                        ${!f.available
                          ? 'border-zinc-800 bg-zinc-900/50 cursor-not-allowed opacity-40'
                          : 'border-zinc-700 bg-zinc-900 hover:border-amber-600 hover:bg-zinc-800 cursor-pointer faction-tilt'
                        }
                      `}
                    >
                      {f.available && (
                        <div
                          className={`absolute top-2 right-2 w-2 h-2 rounded-full ${STATUS_DOT[f.status]}`}
                          title={t(STATUS_I18N_KEY[f.status])}
                        />
                      )}
                      <FactionSymbol factionKey={f.key} size={40} />
                      <span className="text-[11px] leading-tight text-zinc-300">
                        {f.name}
                      </span>
                      {f.version && (
                        <span className="font-cinzel text-[8px] uppercase tracking-widest text-amber-600/80 -mt-1">
                          v{f.version}
                        </span>
                      )}
                    </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>


      </div>
    </div>
  );
}
