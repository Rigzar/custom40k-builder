import { useState } from 'react';
import { useArmyStore } from '../store/army';
import { ArmyConfig } from './ArmyConfig';
import { ChangelogModal } from './ChangelogModal';
import { LanguageSelector } from './LanguageSelector';
import { SupplementModal, type SupplementKey } from './SupplementModal';
import { FactionSymbol } from './FactionSymbol';
import { useT, useLanguage, type Language, type TranslationKey } from '../i18n';
import { useAuth } from '../hooks/useAuth';
import type { SavedArmy } from '../hooks/useSavedArmies';
import { CHANGELOG } from '../data/changelog';
import { ENGAGEMENTS } from '../engine/engagements';
import type { EngagementType } from '../types/army';

const ANNOUNCEMENT_KEY = 'c40k_announcement_v140_dismissed';

type AnnouncementLang = { title: string; intro: string; line1: string; line2: string; contrib: string; };
const ANNOUNCEMENT_TEXT: Record<Language, AnnouncementLang> = {
  en: {
    title: 'v1.40: New army creation flow + bug fixes',
    intro: 'Army creation is now a 3-step flow (Battle Setup → Army Config → Builder). Supplements are on the landing page. Plus two bug fixes.',
    line1: '🪖 GENERAL — new hero landing page with a 3-step army creation flow: pick battle type & points (clamped per type: Skirmish 1000–2499, Pitched 2500–3999, Epic 4000+), then choose faction, then configure archetype/legacy/traits. Supplements (Horus Heresy, Escalation, Assassins) are now accessible directly from the landing page.',
    line2: '⚔️ GENERAL — allied units now always show their own faction\'s armory (race condition fixed). Deleting a save and saving with a new name no longer reuses the old save slot. Campaign GMs can now delete a campaign via the campaign list.',
    contrib: '👁️ Spotted a heresy in the data? File it on GitHub — every report is investigated by the Ordo.',
  },
  de: {
    title: 'v1.40: Neuer Armee-Erstellungsablauf + Fehlerbehebungen',
    intro: 'Das Erstellen einer Armee erfolgt nun in 3 Schritten (Schlachtaufbau → Armee-Konfiguration → Builder). Supplemente sind auf der Startseite. Dazu zwei Fehlerbehebungen.',
    line1: '🪖 ALLGEMEIN — neue Startseite mit 3-schrittigem Armee-Erstellungsablauf: Schlachttyp & Punkte wählen (begrenzt: Skirmish 1000–2499, Pitched 2500–3999, Epic 4000+), dann Fraktion, dann Archetyp/Legacy/Merkmale konfigurieren. Supplemente (Horus Heresy, Escalation, Assassinen) sind direkt von der Startseite aus zugänglich.',
    line2: '⚔️ ALLGEMEIN — Verbündete Einheiten zeigen jetzt immer das Armoury ihrer eigenen Fraktion (Race Condition behoben). Das Löschen eines Speicherstands und das erneute Speichern unter neuem Namen verwendet nicht mehr den alten Slot. Kampagnen-GMs können eine Kampagne jetzt über die Kampagnenliste löschen.',
    contrib: '👁️ Eine Ketzerei in den Daten entdeckt? Auf GitHub melden — jeder Bericht wird vom Ordo untersucht.',
  },
  es: {
    title: 'v1.40: Nuevo flujo de creación de ejércitos + correcciones',
    intro: 'La creación de ejércitos ahora tiene 3 pasos (Configuración de batalla → Config. de ejército → Constructor). Los suplementos están en la página de inicio. Más dos correcciones de bugs.',
    line1: '🪖 GENERAL — nueva página de inicio con flujo de 3 pasos: elegir tipo de batalla y puntos (limitados por tipo: Escaramuza 1000–2499, Pitched 2500–3999, Épica 4000+), luego facción, luego configurar arquetipo/legado/rasgos. Los suplementos (Horus Heresy, Escalation, Assassinos) son accesibles directamente desde la página de inicio.',
    line2: '⚔️ GENERAL — las unidades aliadas ahora muestran siempre la armería de su propia facción (race condition corregida). Borrar un guardado y guardar con nombre nuevo ya no reutiliza el slot antiguo. Los GMs de campaña ahora pueden borrar una campaña desde la lista de campañas.',
    contrib: '👁️ ¿Detectaste una herejía en los datos? Repórtala en GitHub — el Ordo investiga cada reporte.',
  },
};

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
    <div className="relative mt-2 mb-6">
      {/* Servo skull floating above card */}
      <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-10 pointer-events-none select-none">
        <img src="/servo-skull.png" alt="" className="w-14 h-14 object-contain drop-shadow-lg" draggable={false} />
      </div>

      {/* Binder clips row */}
      <div className="flex justify-between px-10 mb-0 pointer-events-none select-none relative z-10">
        <ClipSvg /><ClipSvg /><ClipSvg />
      </div>

      {/* Ordo card */}
      <div className="bg-zinc-900 border border-zinc-700 border-t-2 border-t-amber-900/80 px-5 pt-4 pb-4">
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
          <BoldSplitLine text={tx.line1} />
          <BoldSplitLine text={tx.line2} />
          <p className="text-zinc-400">{tx.contrib}</p>
        </div>
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
      { key: 'chaos_space_marines', name: 'Chaos Space Marines', available: true, status: 'complete' },
      { key: 'chaos_daemons',       name: 'Chaos Daemons',       available: true, status: 'complete' },
    ],
  },
  {
    name: 'Imperium',
    icon: '/category-icons/imperium.svg',
    pillFg: '#c8b56a', dividerColor: '#3a3520',
    factions: [
      { key: 'space_marines',      name: 'Space Marines',      available: true, status: 'complete' },
      { key: 'imperial_guard',     name: 'Imperial Guard',     available: true, status: 'testing' },
      { key: 'adeptus_mechanicus', name: 'Adeptus Mechanicus', available: true, status: 'testing' },
      { key: 'adeptus_custodes',   name: 'Adeptus Custodes',   available: true, status: 'testing' },
      { key: 'adeptus_sororitas',  name: 'Adeptus Sororitas',  available: true, status: 'testing' },
      { key: 'grey_knights',       name: 'Grey Knights',       available: true, status: 'testing' },
      { key: 'inquisition',        name: 'Inquisition',        available: true, status: 'testing' },
    ],
  },
  {
    name: 'Xenos',
    icon: '/category-icons/xenos.svg',
    pillFg: '#6ab88a', dividerColor: '#1a3a28',
    factions: [
      { key: 'tau_empire',        name: 'Tau Empire',        available: true, status: 'testing' },
      { key: 'necrons',           name: 'Necrons',           available: true, status: 'testing' },
      { key: 'orks',              name: 'Orks',              available: true, status: 'testing' },
      { key: 'eldar',             name: 'Eldar',             available: true, status: 'testing' },
      { key: 'dark_eldar',        name: 'Dark Eldar',        available: true, status: 'testing' },
      { key: 'genestealer_cults', name: 'Genestealer Cults', available: true, status: 'testing' },
      { key: 'harlequins',        name: 'Harlequins',        available: true, status: 'testing' },
      { key: 'leagues_of_votann', name: 'Leagues of Votann', available: true, status: 'testing' },
      { key: 'tyranids',          name: 'Tyranids',          available: true, status: 'testing' },
    ],
  },
];

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
  hideArmyConfig?: boolean;
}

export function LandingPage({
  selectedFaction, loading, saves,
  onSelectFaction, onBuild, onLoadArmy, onDeleteArmy, onShowAuth,
}: Props) {
  const { data, engagement, pointLimit, setEngagement, setPointLimit } = useArmyStore();
  const [view, setView] = useState<'hero' | 'setup' | 'config'>('hero');
  const [showChangelog, setShowChangelog] = useState(false);
  const [openSupplement, setOpenSupplement] = useState<SupplementKey | null>(null);
  const latestVersion = CHANGELOG[0]?.version ?? '';
  const t = useT();
  const { loggedIn, username } = useAuth();

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
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">

        {/* Top bar */}
        <div className="flex justify-between items-center px-5 py-3 border-b border-zinc-900">
          <LanguageSelector />
          <button
            onClick={() => setShowChangelog(true)}
            className="text-[11px] uppercase tracking-wide text-zinc-500 hover:text-amber-400 transition-colors"
          >
            v{latestVersion}
          </button>
        </div>

        {showChangelog && <ChangelogModal onClose={() => setShowChangelog(false)} />}

        {/* Center content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">

          {/* Logo */}
          <img
            src="/custom40k-logo.png"
            alt="Custom40k"
            className="w-64 sm:w-80 mb-8 object-contain select-none anim-emerge"
            draggable={false}
          />

          {/* Ornamental divider */}
          <div className="flex items-center gap-3 w-full max-w-xs mb-8 anim-divider anim-delay-1">
            <div className="flex-1 h-px bg-amber-900/50" />
            <div className="w-1.5 h-1.5 bg-amber-800 rotate-45 shrink-0" />
            <div className="flex-1 h-px bg-amber-900/50" />
          </div>

          {/* Quick-load: saved armies */}
          {saves.length > 0 && (
            <div className="w-full max-w-xs mb-6 anim-fade-up anim-delay-2">
              <div className="text-[10px] uppercase tracking-widest text-zinc-600 mb-2 text-center">
                {t('savedArmies')}
              </div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {saves.slice(0, 4).map(save => (
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
          <div className="grid grid-cols-2 gap-3 w-full max-w-xs anim-fade-up anim-delay-3">
            <a
              href="https://custom40k-wiki.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 px-4 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-zinc-100 text-[12px] uppercase tracking-wider transition-colors"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              Wiki
            </a>

            <button
              onClick={onShowAuth}
              className="flex items-center justify-center gap-2 py-3 px-4 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-zinc-100 text-[12px] uppercase tracking-wider transition-colors"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              {loggedIn ? (username ?? 'Account') : 'Login / Sign in'}
            </button>

            <a
              href="https://custom40k-wiki.vercel.app/glossary"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 px-4 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-zinc-100 text-[12px] uppercase tracking-wider transition-colors"
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
          </div>

          {/* Discord */}
          <a
            href="https://discord.com/invite/wnGAB3TYAY"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 flex items-center gap-2 text-[11px] text-zinc-600 hover:text-indigo-400 transition-colors uppercase tracking-wider anim-fade-up anim-delay-4"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Discord
          </a>

        </div>

        {/* Supplements */}
        <div className="px-6 pb-4 max-w-screen-sm mx-auto w-full anim-fade-up anim-delay-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-zinc-800 text-zinc-500 shrink-0">
              {t('supplements')}
            </span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setOpenSupplement('horus_heresy')} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-red-900/60 hover:border-red-700 text-zinc-300 hover:text-red-300 transition-colors text-[12px] uppercase tracking-wide">
              <img src="/faction-symbols/horus-heresy.svg" alt="" style={{ width: 14, height: 14, filter: 'brightness(0) invert(1) opacity(0.7)' }} draggable={false} />
              Horus Heresy
            </button>
            <button onClick={() => setOpenSupplement('escalation')} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-amber-900/60 hover:border-amber-700 text-zinc-300 hover:text-amber-300 transition-colors text-[12px] uppercase tracking-wide">
              <img src="/faction-symbols/escalation.svg" alt="" style={{ width: 14, height: 14, filter: 'brightness(0) invert(1) opacity(0.7)' }} draggable={false} />
              Escalation
            </button>
            <button onClick={() => setOpenSupplement('assassins')} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-zinc-100 transition-colors text-[12px] uppercase tracking-wide">
              <img src="/faction-symbols/assassins.svg" alt="" style={{ width: 14, height: 14, filter: 'brightness(0) invert(1) opacity(0.7)' }} draggable={false} />
              Assassins
            </button>
          </div>
          {openSupplement && <SupplementModal supplement={openSupplement} onClose={() => setOpenSupplement(null)} />}
        </div>

        {/* Bottom announcement */}
        <div className="px-6 pb-6 max-w-screen-sm mx-auto w-full anim-fade-up anim-delay-6">
          <CommunityAnnouncement />
        </div>

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
                onClick={onBuild}
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
        {saves.length > 0 && (
          <section>
            <h2 className="text-[11px] uppercase tracking-widest text-amber-700 mb-4">
              {t('savedArmies')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {saves.map(save => (
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
                  {cat.factions.map(f => (
                    <button
                      key={f.key}
                      onClick={() => f.available && handleSelectFactionInSetup(f.key)}
                      disabled={!f.available}
                      className={`
                        relative flex flex-col items-center gap-2 pt-4 pb-3 px-2 border rounded-lg text-center transition-all
                        ${!f.available
                          ? 'border-zinc-800 bg-zinc-900/50 cursor-not-allowed opacity-40'
                          : 'border-zinc-700 bg-zinc-900 hover:border-amber-600 hover:bg-zinc-800 cursor-pointer'
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
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>


      </div>
    </div>
  );
}
