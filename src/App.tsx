import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { useArmyStore, getSerializableState } from './store/army';
import { SlotPanel } from './components/SlotPanel';
import { ArmyConfig } from './components/ArmyConfig';
import { ValidationPanel } from './components/ValidationPanel';
import { ArmyList } from './components/ArmyList';
import { LandingPage } from './components/LandingPage';
import { FactionStep } from './components/FactionStep';
import { ReviewStep } from './components/ReviewStep';
import { StepBar, type Step } from './components/StepBar';
import { FactionSymbol } from './components/FactionSymbol';
import { AlliedDetachmentPanel } from './components/AlliedDetachmentPanel';
import { getRelationship, RELATIONSHIP_LABELS, RELATIONSHIP_COLORS, RELATIONSHIP_DESCRIPTIONS } from './data/alliedMatrix';
import { validateArmy } from './engine/validators';
import { ENGAGEMENTS } from './engine/engagements';
import { computeUnitPoints, resolveUnit, effectiveArchetypeFor } from './engine/points';
import { getArchetypeRule } from './engine/archetypes';
import { getArmySymbolPair } from './utils/getArmySymbolUrl';
import { getAssassinAccessAlignment, chamberMilitantOrdo } from './engine/keywords';
import type { FactionData } from './types/data';
import { FACTION_LOADERS } from './data/loaders';
import { useSavedArmies, type SavedArmy, AUTOSAVE_ID, AUTOSAVE_DISMISSED_KEY } from './hooks/useSavedArmies';
import { LegalFooter } from './components/LegalModal';
import { useAuth } from './hooks/useAuth';
import * as api from './lib/api';
import { useT, setTranslationOverrides } from './i18n';
import { usePrefs, autosaveDelayMs } from './hooks/usePrefs';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PwaUpdatePrompt } from './components/PwaUpdatePrompt';
const PrintView        = lazy(() => import('./components/PrintView').then(m => ({ default: m.PrintView })));
const CheatSheetModal  = lazy(() => import('./components/CheatSheetModal').then(m => ({ default: m.CheatSheetModal })));
const SavedArmiesModal = lazy(() => import('./components/SavedArmiesModal').then(m => ({ default: m.SavedArmiesModal })));
const BugReportModal   = lazy(() => import('./components/BugReportModal').then(m => ({ default: m.BugReportModal })));
const AuthModal        = lazy(() => import('./components/AuthModal').then(m => ({ default: m.AuthModal })));
const CloudSavesModal  = lazy(() => import('./components/CloudSavesModal').then(m => ({ default: m.CloudSavesModal })));
const CampaignModal    = lazy(() => import('./components/CampaignModal').then(m => ({ default: m.CampaignModal })));
const PrefsModal       = lazy(() => import('./components/PrefsModal').then(m => ({ default: m.PrefsModal })));
const AdminPanel       = lazy(() => import('./components/AdminPanel').then(m => ({ default: m.AdminPanel })));

/**
 * Where the player is. `screen` is the front door vs the build flow; `step` is which of the four
 * steps of the flow (see StepBar.tsx). This replaced an `openTabs`/`activeTab` pair that modelled
 * the screens as closeable browser tabs — a metaphor that hid the first half of the flow entirely,
 * put the config step in two different places depending on how you got there, and let a back
 * button silently close the tab holding your army.
 */
type Screen = 'home' | 'flow';

/** Which detachment the Units step is showing. The ally used to be a tab of its own. */
type Detachment = 'primary' | 'allied';

export const FACTION_NAMES: Record<string, string> = {
  chaos_space_marines:  'Chaos Space Marines',
  chaos_daemons:        'Chaos Daemons',
  space_marines:        'Space Marines',
  imperial_guard:       'Imperial Guard',
  adeptus_mechanicus:   'Adeptus Mechanicus',
  adeptus_custodes:     'Adeptus Custodes',
  adeptus_sororitas:    'Adeptus Sororitas',
  grey_knights:         'Grey Knights',
  inquisition:          'Inquisition',
  assassins:            'Assassins',
  tau_empire:           'Tau Empire',
  necrons:              'Necrons',
  orks:                 'Orks',
  eldar:                'Eldar',
  dark_eldar:           'Dark Eldar',
  genestealer_cults:    'Genestealer Cults',
  harlequins:           'Harlequins',
  leagues_of_votann:    'Leagues of Votann',
  tyranids:             'Tyranids',
  horus_heresy:         'Horus Heresy Legiones Astartes',
  legio_titanicus:      'Horus Heresy Forces of the Machine God',
};

// ── Inline army name editor ─────────────────────────────────────────────────
function ArmyNameEditor() {
  const t = useT();
  const { armyName, setArmyName } = useArmyStore();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function startEdit() {
    setDraft(armyName);
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  }

  function commit() {
    const name = draft.trim();
    if (name) setArmyName(name);
    setEditing(false);
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        autoFocus
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') setEditing(false);
        }}
        className="bg-zinc-800 border border-amber-700 text-amber-300 text-sm px-2 py-0.5 outline-none w-44 min-w-0"
        maxLength={60}
      />
    );
  }

  return (
    <button
      onClick={startEdit}
      title={t('clickToRenameArmy')}
      className="text-zinc-300 text-sm hover:text-amber-400 transition-colors truncate max-w-[200px] flex items-center gap-1"
    >
      {armyName || <span className="text-zinc-500 italic">{t('unnamedArmy')}</span>}
      <span className="text-zinc-600 text-[10px]">✎</span>
    </button>
  );
}

// ── Compact status bar shown in the sticky header ──────────────────────────
// The error/warning chip is a button: it is the permanent way into step ④, so a player who sees
// "✗ 2" is one click from being told what the two problems are. It used to be dead text, and the
// only copy of the validation list was a collapsible in the builder's left sidebar.
function HeaderStatus({ onOpenReview }: { onOpenReview: () => void }) {
  const { data, ...state } = useArmyStore();
  if (!data || state.army.length === 0) return null;

  const total = state.army.reduce((s, i) => {
    const u = resolveUnit(i, data);
    return s + (u ? computeUnitPoints(i, u, effectiveArchetypeFor(i, state)) : 0);
  }, 0);

  const pct  = Math.min(100, (total / state.pointLimit) * 100);
  const over = total > state.pointLimit;

  const validation = validateArmy(state, data, state.alliedData);
  const errors = validation.filter(v => v.type === 'error').length;
  const warns  = validation.filter(v => v.type === 'warn').length;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <span className={`text-sm font-bold tabular-nums ${over ? 'text-red-400 pts-over-glow' : 'text-amber-400'}`}>
          {total}
        </span>
        <div className="hidden sm:block w-20 h-1.5 bg-zinc-700 rounded overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${over ? 'bg-red-500' : 'bg-amber-600'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="hidden sm:inline text-zinc-500 text-xs tabular-nums">/ {state.pointLimit}</span>
      </div>

      <button
        onClick={onOpenReview}
        className={`text-[11px] border px-1.5 py-0.5 leading-none transition-colors ${
          errors > 0 ? 'text-red-400 border-red-800/70 hover:bg-red-900/30'
          : warns > 0 ? 'text-amber-400 border-amber-800/70 hover:bg-amber-900/30'
          : 'text-green-500 border-green-800/70 hover:bg-green-900/30'
        }`}
      >
        {errors > 0 ? `✗ ${errors}` : warns > 0 ? `⚠ ${warns}` : '✓'}
      </button>
    </div>
  );
}

// ── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const t = useT();
  const store = useArmyStore();
  const { setData, data, army, armyName, setArmyName, faction, engagement, pointLimit, setEngagement, setPointLimit,
          hqMark, archetype, legacy, legacy2, traitPool, importRoster,
          alliedFaction, alliedData, alliedArchetype, alliedLegacy, alliedTraitPool, alliedHqMark, setAlliedData,
          injectArchetypeFaction, injectAlliedArchetypeFaction } = store;

  // Always land on the front door on a fresh page load/reload — never auto-resume straight
  // into the builder, even if a prior session left a faction selected in sessionStorage.
  const [screen, setScreen]                     = useState<Screen>('home');
  const [step, setStep]                         = useState<Step>('faction');
  const [detachment, setDetachment]             = useState<Detachment>('primary');
  const [selectedFaction, setSelectedFaction]   = useState<string | null>(null);
  const [loadingFaction, setLoadingFaction]     = useState(false);
  const [showPrint, setShowPrint]               = useState(false);
  const [showCheatSheets, setShowCheatSheets]   = useState(false);
  const [showArmies, setShowArmies]             = useState(false);
  const [showBugReport, setShowBugReport]       = useState(false);
  const [showAuth, setShowAuth]                 = useState(false);
  const [showCloudSaves, setShowCloudSaves]     = useState(false);
  const [cloudSavesDefaultTab, setCloudSavesDefaultTab] = useState<'armies' | 'community' | 'friends' | 'preferences' | 'account'>('armies');
  const [showCampaign, setShowCampaign]         = useState(false);
  // Set when opened via the Account tab's "My Campaigns" quick-open, so CampaignModal expands
  // straight to that campaign instead of the plain index.
  const [campaignInitialOpenId, setCampaignInitialOpenId] = useState<number | undefined>(undefined);
  const { username, loggedIn, isAdmin, avatar, socialLinks, socialPublic, refresh: refreshAuth, logout } = useAuth();
  const [showAdmin, setShowAdmin] = useState(false);
  const [savedMsg, setSavedMsg]                 = useState('');
  const pendingLoad                             = useRef<SavedArmy | null>(null);
  // Admin-editable public settings — fetched once here (the landing page used to fetch them, which
  // meant the Faction step needed its own second call to the same endpoint).
  const [announcement, setAnnouncement]         = useState<api.AnnouncementSetting | null>(null);
  const [factionFlags, setFactionFlags]         = useState<api.FactionFlags | null>(null);
  const [codexVersions, setCodexVersions]       = useState<api.CodexVersions | null>(null);
  useEffect(() => {
    api.getPublicSettings()
      .then(s => {
        setAnnouncement(s.announcement);
        setFactionFlags(s.factionFlags);
        setCodexVersions(s.codexVersions);
        setTranslationOverrides(s.translations);   // apply admin-edited UI strings app-wide
      })
      .catch(() => { /* keep code defaults */ });
  }, []);
  // Shared-army link (?share=TOKEN): loads a read-only copy of someone's list with no login
  // needed, same "view a copy" semantics as Community Armies (handleLoadCommunityArmy, defined
  // below — a hoisted function declaration, so it's callable from this earlier effect). A query
  // param rather than a path segment on purpose: the app has no router and no SPA-fallback
  // rewrite in vercel.json, but a query string on "/" always serves index.html regardless, so
  // this needed zero deploy-config changes. Strips the param from the URL once consumed so a
  // later refresh/Save doesn't keep reloading over the visitor's own edits.
  const [shareLinkError, setShareLinkError] = useState('');
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('share');
    if (!token) return;
    params.delete('share');
    const cleanUrl = window.location.pathname + (params.toString() ? `?${params}` : '') + window.location.hash;
    window.history.replaceState(null, '', cleanUrl);
    api.getSharedRoster(token)
      .then(res => handleLoadCommunityArmy(res.roster.data))
      .catch(() => setShareLinkError('This share link is invalid or has been revoked.'));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Tracks which save (cloud roster id, or local save id) the "Save" button currently updates
  // in place. Cleared whenever a genuinely new army is started, so the next quick-save creates
  // a fresh entry instead of silently overwriting whatever was last bound.
  const [activeCloudRosterId, setActiveCloudRosterId] = useState<number | null>(null);
  // Ref so the beforeunload/autosave handlers always see the current login state without stale closure.
  const loggedInRef = useRef(false);
  useEffect(() => { loggedInRef.current = loggedIn; }, [loggedIn]);
  const [activeLocalSaveId, setActiveLocalSaveId]     = useState<string | null>(null);

  const { prefs, setPrefs } = usePrefs();
  // Ref so the beforeunload handler sees current prefs without stale closure.
  const prefsRef = useRef(prefs);
  useEffect(() => { prefsRef.current = prefs; }, [prefs]);

  // A new screen starts at the top. The browser keeps the scroll offset of the page you left, so on
  // a phone — where the whole thing is one long column — picking a faction or pressing "Add Troops"
  // dropped you into the middle of the new screen with the Archetype selector off-screen above,
  // looking like it wasn't there (Discord report).
  useEffect(() => { window.scrollTo({ top: 0 }); }, [screen, step, detachment]);
  const [showPrefs, setShowPrefs] = useState(false);

  const { saves, saveArmy, deleteArmy } = useSavedArmies();

  const loaders = FACTION_LOADERS as Record<string, () => Promise<FactionData>>;

  const { primary: armySymbolOverride, secondary: armySymbolSecondary } =
    getArmySymbolPair(selectedFaction, archetype ?? null, legacy ?? null, legacy2 ?? null);

  // Faction loader
  useEffect(() => {
    if (!selectedFaction) return;
    sessionStorage.setItem('selectedFaction', selectedFaction);
    setLoadingFaction(true);

    const loader = loaders[selectedFaction];
    if (!loader) { setLoadingFaction(false); return; }

    loader()
      .then(m => {
        setData(m as FactionData);
        setLoadingFaction(false);
        if (pendingLoad.current) {
          const save = pendingLoad.current;
          pendingLoad.current = null;
          importRoster(JSON.stringify(save.state));
        }
      })
      .catch(e => {
        console.error('Error loading faction data', e);
        setLoadingFaction(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFaction]);

  // Allied faction data loader
  useEffect(() => {
    if (!alliedFaction) {
      setAlliedData(null);
      return;
    }
    const loader = loaders[alliedFaction];
    if (!loader) return;
    loader()
      .then(m => setAlliedData(m as FactionData))
      .catch(e => console.error('Error loading allied faction data', e));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alliedFaction]);

  // Picking an allied detachment switches the Units step over to it, so the catalogue you are
  // looking at is the one you just chose. Removing it switches back. The ally used to get a tab of
  // its own next to "Home" — two documents and two steps on the same row — and that tab had a ×
  // that hid it while the ally stayed in the list, with no obvious way back in.
  // Skips the very first run (mount/page-load): zustand persists alliedFaction across reloads,
  // and the app must always cold-start on the front door regardless of what was persisted.
  const skipFirstAlliedEffect = useRef(true);
  useEffect(() => {
    if (skipFirstAlliedEffect.current) {
      skipFirstAlliedEffect.current = false;
      return;
    }
    setDetachment(alliedFaction ? 'allied' : 'primary');
    if (alliedFaction) setStep('units');
  }, [alliedFaction]);

  // Archetype / legacy / native-ally faction loader
  useEffect(() => {
    if (!data) return;
    const rule = getArchetypeRule(archetype);
    const legacyGrant = [legacy, legacy2]
      .map(name => data.legacies.find(l => l.name === name)?.grants_faction)
      .find((k): k is string => !!k);
    const assassinKey = getAssassinAccessAlignment(data.faction) ? 'assassins' : null;
    const chamberMilitantKey = chamberMilitantOrdo(data.faction, archetype) ? 'inquisition' : null;
    const keys = [...new Set(
      [rule?.alliedFaction, legacyGrant, ...(data.intrinsic_allies ?? []), assassinKey, chamberMilitantKey]
        .filter((k): k is string => !!k)
    )];
    for (const key of keys) {
      if (data.allied?.[key]) continue;
      const loader = loaders[key];
      if (!loader) continue;
      const sharedArmoryLabel = rule?.alliedFaction === key ? rule.sharedSupplementArmory : undefined;
      loader()
        .then(m => injectArchetypeFaction(key, m as FactionData, sharedArmoryLabel))
        .catch(e => console.error('Error loading archetype/legacy/native-ally faction data', e));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [archetype, legacy, legacy2, data?.faction]);

  // Archetype-granted FOREIGN ARMORY (armory-only, no units): IG "Traitor Guard"/AdMech "Dark
  // Mechanicum" → CSM, "Brood Brothers" → GSC, "Gue'vesa" → Tau. ArmoryModal loads this faction
  // for its own tab, but the resolver needs it in the store too, otherwise items bought there
  // cost points and grant nothing (Discord 2026-07-18: CSM Daemon weapon on Traitor Guard).
  useEffect(() => {
    if (!data) return;
    const archRule = getArchetypeRule(archetype);
    const fk = archRule?.armoryOnlyFaction;
    if (!fk || !loaders[fk]) { store.injectArchetypeArmory(null); return; }
    loaders[fk]()
      .then(m => store.injectArchetypeArmory(m as FactionData, !!archRule?.grantsMarkPurchase))
      .catch(e => console.error('Error loading archetype-granted armory faction', e));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [archetype, data?.faction]);

  // Red Corsairs "Reaver Lord" (CSM 1.03): "Select a single item from any Space Marine or Chaos
  // Space Marine Armory for the stated cost." The Chaos armouries are already loaded; the Space
  // Marine ones are another codex, so they are fetched only when the Legacy that unlocks the Red
  // Corsairs Armory is actually chosen, and parked as BORROW-ONLY — no tab, nothing purchasable
  // on its own, just reachable so the borrowed item resolves and prices like any other.
  useEffect(() => {
    if (!data || data.faction !== 'Chaos Space Marines' || legacy !== 'Legacy of the Tyrant') {
      store.injectBorrowableArmories(null);
      return;
    }
    loaders['space_marines']()
      .then(m => {
        const sm = m as FactionData;
        const out: Record<string, import('./types/data').Armory> = {
          'Space Marines — General': sm.armory_general,
        };
        for (const [k, v] of Object.entries(sm.armory_legions ?? {})) out[`Space Marines — ${k}`] = v;
        store.injectBorrowableArmories(out);
      })
      .catch(e => console.error('Error loading the Space Marine armoury for the Reaver Lord', e));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [legacy, data?.faction]);

  // Mirrors the effect above, but for the Allied Detachment's OWN archetype-granted intrinsic
  // ally (e.g. CSM "Plaguehost" chosen as the ally's archetype → Chaos Daemons with Mark of
  // Nurgle) — the ally's catalogue needs the exact same lazy-load, keyed on the ally's own
  // archetype instead of the primary's.
  useEffect(() => {
    if (!alliedData) return;
    const rule = getArchetypeRule(alliedArchetype ?? '');
    const key = rule?.alliedFaction;
    if (!key || alliedData.allied?.[key]) return;
    const loader = loaders[key];
    if (!loader) return;
    loader()
      .then(m => injectAlliedArchetypeFaction(key, m as FactionData))
      .catch(e => console.error('Error loading allied detachment\'s own archetype-granted ally faction data', e));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alliedArchetype, alliedData?.faction]);

  // One-time migration: if the old localStorage 'custom40k-army' key has an army (left over
  // from before the sessionStorage switch), rescue it as an autosave so the user doesn't lose
  // their work, then remove the orphaned key.
  useEffect(() => {
    try {
      const raw = localStorage.getItem('custom40k-army');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const s = parsed?.state as Record<string, unknown> | undefined;
      if (!s?.faction || !Array.isArray(s.army) || (s.army as unknown[]).length === 0) {
        localStorage.removeItem('custom40k-army');
        return;
      }
      const SAVES_KEY = 'custom40k-saved-armies';
      const saves: SavedArmy[] = JSON.parse(localStorage.getItem(SAVES_KEY) ?? '[]');
      // s.faction is the display label; reverse-map to the snake_case loader key.
      const fLabel = s.faction as string;
      const fKey = Object.entries(FACTION_NAMES).find(([, v]) => v === fLabel)?.[0] ?? fLabel;
      const rescueEntry: SavedArmy = {
        id: 'autosave-session',
        name: `↩ ${FACTION_NAMES[fKey] ?? fKey}`,
        factionKey: fKey,
        factionLabel: FACTION_NAMES[fKey] ?? fKey,
        savedAt: Date.now(),
        totalPts: 0,
        unitCount: (s.army as unknown[]).length,
        state: s as unknown as SavedArmy['state'],
      };
      const existingIdx = saves.findIndex(x => x.id === 'autosave-session');
      if (existingIdx >= 0) saves[existingIdx] = rescueEntry; else saves.unshift(rescueEntry);
      localStorage.setItem(SAVES_KEY, JSON.stringify(saves));
      localStorage.removeItem('custom40k-army');
    } catch { /* malformed data — just clean up */ }
   
  }, []);

  // Auto-save the active session to 'custom40k-saved-armies' when the user closes/navigates
  // away. Uses a fixed id so it overwrites itself (never accumulates). Reads fresh zustand
  // state at fire time — no stale-closure risk since getState() is always current.
  useEffect(() => {
    function handleBeforeUnload() {
      try {
        if (!loggedInRef.current) return;
        if (prefsRef.current.autosaveInterval === 'off') return;
        if (sessionStorage.getItem(AUTOSAVE_DISMISSED_KEY)) return;
        const st = useArmyStore.getState();
        if (!st.faction || st.army.length === 0) return;
        // st.faction stores the display label ('Chaos Space Marines'); reverse-map to the
        // snake_case loader key ('chaos_space_marines') so handleLoadArmy can find it.
        const fKey = Object.entries(FACTION_NAMES).find(([, v]) => v === st.faction)?.[0] ?? st.faction;
        const SAVES_KEY = 'custom40k-saved-armies';
        const saves: SavedArmy[] = JSON.parse(localStorage.getItem(SAVES_KEY) ?? '[]');
        const totalPts = st.data
          ? st.army.reduce((sum, e) => {
              const u = resolveUnit(e, st.data!);
              return sum + (u ? computeUnitPoints(e, u, effectiveArchetypeFor(e, st)) : 0);
            }, 0)
          : 0;
        const entry: SavedArmy = {
          id: AUTOSAVE_ID,
          name: `↩ ${FACTION_NAMES[fKey] ?? fKey}`,
          factionKey: fKey,
          factionLabel: FACTION_NAMES[fKey] ?? fKey,
          savedAt: Date.now(),
          totalPts,
          unitCount: st.army.length,
          state: getSerializableState(st),
        };
        const idx = saves.findIndex(x => x.id === AUTOSAVE_ID);
        if (idx >= 0) saves[idx] = entry; else saves.unshift(entry);
        localStorage.setItem(SAVES_KEY, JSON.stringify(saves));
      } catch { /* ignore — private browsing or storage quota exceeded */ }
    }
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);


  // Crash-recovery: write a backup to localStorage after army changes (delay = autosave interval pref).
  // Only for logged-in users — the one-time migration effect on the next load picks it up as an autosave entry.
  useEffect(() => {
    const delay = autosaveDelayMs(prefs.autosaveInterval);
    if (!loggedIn || !faction || army.length === 0 || delay === null) {
      localStorage.removeItem('custom40k-army');
      return;
    }
    const timer = setTimeout(() => {
      try {
        const st = useArmyStore.getState();
        if (!st.faction || st.army.length === 0) return;
        localStorage.setItem('custom40k-army', JSON.stringify({ state: getSerializableState(st) }));
      } catch { /* quota exceeded */ }
    }, delay);
    return () => clearTimeout(timer);
   
  }, [army, faction, loggedIn, prefs.autosaveInterval]);

  /**
   * Picking a faction on step ①. Changing to a DIFFERENT faction with units already on the table
   * is the one destructive move in the flow, so it asks first — the old faction's units cannot
   * resolve against the new catalogue and would silently rot in the list.
   */
  function handlePickFaction(key: string) {
    const isNewFaction = key !== selectedFaction;
    // Whether this actually orphans a list is decided by the faction the UNITS belong to, not by
    // `selectedFaction`: a page reload resets `selectedFaction` to null while zustand still holds
    // the army, so comparing against it would offer to wipe the list for re-picking its own
    // faction. `store.faction` is the display label, hence the reverse-map.
    const armyFactionKey = faction
      ? (FACTION_NAMES[faction] ? faction : Object.entries(FACTION_NAMES).find(([, v]) => v === faction)?.[0] ?? faction)
      : null;
    const orphansTheList = army.length > 0 && !!armyFactionKey && armyFactionKey !== key;
    if (orphansTheList && !confirm(t('changeFactionConfirm'))) return;
    if (isNewFaction) {
      if (orphansTheList) store.clearArmy();
      sessionStorage.removeItem(AUTOSAVE_DISMISSED_KEY);
      setActiveCloudRosterId(null);
      setActiveLocalSaveId(null);
      // Apply default engagement / points when starting a fresh army.
      if (army.length === 0) {
        if (prefs.defaultEngagement) setEngagement(prefs.defaultEngagement as import('./types/army').EngagementType);
        if (prefs.defaultPoints !== '') setPointLimit(prefs.defaultPoints as number);
      }
    }
    setSelectedFaction(key);
    setStep('config');
  }

  /** Moving on from the Config step. Names the army if the player never did. */
  function handleBuild() {
    if (!armyName.trim() && selectedFaction) {
      setArmyName(`${FACTION_NAMES[selectedFaction] ?? selectedFaction} Army`);
    }
    if (!data || !selectedFaction) return;
    setStep('units');
  }

  /** Jump into the flow at a given step — used by every "load an army" path. */
  function enterFlow(s: Step) {
    setScreen('flow');
    setStep(s);
    setDetachment('primary');
  }

  /** Windows-Explorer-style dedup: "Name" -> "Name (1)" -> "Name (2)" against a list of names
   *  already in use elsewhere (excluding whatever this save is already bound to). */
  function uniqueName(base: string, takenNames: string[]): string {
    if (!takenNames.includes(base)) return base;
    let n = 1;
    while (takenNames.includes(`${base} (${n})`)) n++;
    return `${base} (${n})`;
  }

  async function handleSaveArmy() {
    if (!data || !selectedFaction) return;

    const total = army.reduce((s, i) => {
      const u = resolveUnit(i, data);
      return s + (u ? computeUnitPoints(i, u, effectiveArchetypeFor(i, store)) : 0);
    }, 0);

    const baseName = armyName.trim() || `${FACTION_NAMES[selectedFaction] ?? selectedFaction} Army`;
    const stateSnapshot = {
      armyName: baseName, faction, engagement, pointLimit, hqMark, archetype, legacy, legacy2, traitPool, army,
      campaignTraitBonus: store.campaignTraitBonus, campaignId: store.campaignId, campaignFaction: store.campaignFaction,
      alliedFaction, alliedArchetype, alliedLegacy, alliedTraitPool, alliedHqMark,
    };

    if (loggedIn) {
      try {
        if (activeCloudRosterId != null) {
          await api.updateRoster(activeCloudRosterId, { name: baseName, data: stateSnapshot });
        } else {
          const { rosters } = await api.listRosters();
          const name = uniqueName(baseName, rosters.map(r => r.name));
          if (name !== baseName) setArmyName(name);
          const res = await api.saveRoster(name, { ...stateSnapshot, armyName: name }, store.campaignId, store.campaignFaction);
          setActiveCloudRosterId(res.roster.id);
        }
        setSavedMsg('Saved to cloud!');
      } catch {
        setSavedMsg('Save failed');
      }
      setTimeout(() => setSavedMsg(''), 2000);
      return;
    }

    // Not logged in: fall back to the local, per-browser "My Armies" list.
    // If activeLocalSaveId refers to a deleted save (no longer in the list), treat this as new.
    const saveStillExists = activeLocalSaveId != null && saves.some(s => s.id === activeLocalSaveId);
    let name = baseName;
    if (!saveStillExists) {
      name = uniqueName(baseName, saves.filter(s => s.factionKey === selectedFaction).map(s => s.name));
      if (name !== baseName) setArmyName(name);
    }
    const id = saveStillExists ? activeLocalSaveId! : `save-${Date.now()}`;
    setActiveLocalSaveId(id);

    const entry: SavedArmy = {
      id,
      name,
      factionKey: selectedFaction,
      factionLabel: FACTION_NAMES[selectedFaction] ?? selectedFaction,
      savedAt: Date.now(),
      totalPts: total,
      unitCount: army.length,
      state: getSerializableState({ armyName: name, faction, engagement, pointLimit, hqMark, archetype, legacy, legacy2, traitPool, army, campaignTraitBonus: store.campaignTraitBonus, campaignId: store.campaignId, campaignFaction: store.campaignFaction, alliedFaction, alliedArchetype, alliedLegacy, alliedTraitPool, alliedHqMark }),
    };

    saveArmy(entry);
    setSavedMsg('Saved!');
    setTimeout(() => setSavedMsg(''), 2000);
  }

  /** The faction-loader effect only fires when `selectedFaction` CHANGES — loading a save of the
   *  SAME faction as the open army never re-ran it, so pendingLoad was silently ignored and the
   *  old roster stayed on screen. Consume the pending load directly in that case. */
  function consumePendingLoadIfSameFaction(fKey: string) {
    if (fKey === selectedFaction && data && pendingLoad.current) {
      const save = pendingLoad.current;
      pendingLoad.current = null;
      importRoster(JSON.stringify(save.state));
    }
  }

  function handleLoadArmy(save: SavedArmy) {
    pendingLoad.current = save;
    setActiveLocalSaveId(save.id);
    setActiveCloudRosterId(null);
    // Normalize: old saves stored the display label as factionKey; new ones store the snake_case key.
    const fKey = FACTION_NAMES[save.factionKey]
      ? save.factionKey
      : Object.entries(FACTION_NAMES).find(([, v]) => v === save.factionKey)?.[0] ?? save.factionKey;
    consumePendingLoadIfSameFaction(fKey);
    setSelectedFaction(fKey);
    enterFlow('units');
  }

  function handleLoadCloudRoster(data: Record<string, unknown>, rosterId: number) {
    const fLabel = data.faction as string;
    const fKey = FACTION_NAMES[fLabel]
      ? fLabel
      : Object.entries(FACTION_NAMES).find(([, v]) => v === fLabel)?.[0] ?? fLabel;
    pendingLoad.current = {
      id: `cloud-${rosterId}`,
      factionKey: fKey,
      factionLabel: FACTION_NAMES[fKey] ?? fKey,
      name: '',
      state: data as unknown as SavedArmy['state'],
      savedAt: Date.now(),
      totalPts: (data.totalPts as number) ?? 0,
      unitCount: ((data.army as unknown[])?.length) ?? 0,
    };
    setActiveCloudRosterId(rosterId);
    setActiveLocalSaveId(null);
    consumePendingLoadIfSameFaction(fKey);
    setSelectedFaction(fKey);
    enterFlow('units');
    setShowCloudSaves(false);
  }

  /** "Create Army" from a campaign's Roster tab — starts a fresh list tagged to that
   *  campaign+faction, so saving it links the roster row instead of creating a plain army. */
  function handleCreateCampaignArmy(campaignId: number, campaignFaction: string) {
    store.clearArmy();
    store.setCampaignLink(campaignId, campaignFaction);
    setActiveCloudRosterId(null);
    setActiveLocalSaveId(null);
    setShowCampaign(false);
    setScreen('flow');
    setStep('faction');
  }

  /** Viewing a campaign-mate's army from the Roster tab — same non-owning "load a copy of the
   *  state, don't bind to their roster id" semantics as viewing a Community army. */
  function handleViewCampaignArmy(data: Record<string, unknown>) {
    handleLoadCommunityArmy(data);
    setShowCampaign(false);
  }

  function handleLoadCommunityArmy(data: Record<string, unknown>) {
    const fLabel = data.faction as string;
    const fKey = FACTION_NAMES[fLabel]
      ? fLabel
      : Object.entries(FACTION_NAMES).find(([, v]) => v === fLabel)?.[0] ?? fLabel;
    pendingLoad.current = {
      id: 'community-view',
      factionKey: fKey,
      factionLabel: FACTION_NAMES[fKey] ?? fKey,
      name: '',
      state: data as unknown as SavedArmy['state'],
      savedAt: Date.now(),
      totalPts: (data.totalPts as number) ?? 0,
      unitCount: ((data.army as unknown[])?.length) ?? 0,
    };
    setActiveCloudRosterId(null);
    consumePendingLoadIfSameFaction(fKey);
    setSelectedFaction(fKey);
    enterFlow('units');
    setShowCloudSaves(false);
  }

  const factionLabel = selectedFaction ? (FACTION_NAMES[selectedFaction] ?? selectedFaction) : '';
  const alliedFactionLabel = alliedFaction ? (FACTION_NAMES[alliedFaction] ?? alliedFaction) : '';

  /** Steps ②-④ need a faction whose catalogue has finished loading. */
  const flowUnlocked = !!selectedFaction && !!data;
  const showAlly = !!alliedFaction && detachment === 'allied';
  const accentBorder = showAlly ? 'border-emerald-900/60' : 'border-amber-900/60';

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">

      {/* ── Cheat Sheets — floating button, always visible on every screen ── */}
      <button
        onClick={() => setShowCheatSheets(true)}
        title="Cheat Sheets"
        className="fixed bottom-4 right-4 z-[60] flex items-center gap-1.5 bg-zinc-900/90 hover:bg-amber-800 text-amber-400 hover:text-white border border-amber-800/70 hover:border-amber-500 px-3 py-2 text-[11px] uppercase tracking-wide shadow-lg backdrop-blur transition-colors print:hidden"
      >
        <span>📜</span>
        <span className="hidden sm:inline">Cheat Sheets</span>
      </button>

      {/* ── Navigation chrome — one sticky block for the whole flow ──
           Row 1 is the four steps, row 2 is the army it applies to. Hidden on the front door,
           which has its own header.
           paddingTop = safe-area inset so on an installed PWA (viewport-fit=cover) the bar sits
           BELOW the system status bar instead of under the clock/signal icons; the app-coloured bg
           fills the inset strip. */}
      {screen === 'flow' && (
        <div
          className="sticky top-0 z-50"
          style={{ paddingTop: 'env(safe-area-inset-top)', background: '#18171a' }}
        >
          <StepBar
            step={step}
            unlocked={flowUnlocked}
            onGo={setStep}
            onHome={() => setScreen('home')}
            loggedIn={loggedIn}
            username={username}
            onAccountClick={() => loggedIn ? setShowCloudSaves(true) : setShowAuth(true)}
          />

          {/* Army bar — the same identity strip on every step past the faction grid, instead of
              the three near-identical sub-headers the old tabs each carried. */}
          {step !== 'faction' && selectedFaction && (
            <header className={`bg-zinc-900 border-b-2 ${accentBorder} px-4 py-2`}>
              <div className="max-w-screen-xl mx-auto flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 mr-auto min-w-0">
                  <div className="flex items-center gap-1">
                    <FactionSymbol factionKey={selectedFaction} size={24} overrideUrl={armySymbolOverride ?? undefined} />
                    {armySymbolSecondary && <FactionSymbol factionKey={selectedFaction} size={24} overrideUrl={armySymbolSecondary} />}
                  </div>
                  <span className="hidden sm:inline text-zinc-600 text-xs shrink-0">{factionLabel} ·</span>
                  <ArmyNameEditor />
                </div>

                <HeaderStatus onOpenReview={() => setStep('review')} />

                <div className="flex items-center gap-1.5 flex-wrap">
                  {data && (
                    <button
                      onClick={handleSaveArmy}
                      className={`text-[11px] uppercase tracking-wide border px-2.5 py-1 transition-colors
                        ${savedMsg
                          ? 'text-green-400 border-green-700 bg-green-900/20'
                          : 'text-zinc-400 hover:text-amber-400 border-zinc-700 hover:border-amber-800'
                        }`}
                    >
                      {savedMsg || t('save')}
                    </button>
                  )}
                  {!loggedIn && (
                    <button
                      onClick={() => setShowArmies(true)}
                      title="My Armies"
                      className="text-[11px] text-zinc-400 hover:text-amber-400 uppercase tracking-wide border border-zinc-700 hover:border-amber-800 px-2 py-1 transition-colors"
                    >
                      <span className="sm:hidden">📋</span>
                      <span className="hidden sm:inline">My Armies</span>
                    </button>
                  )}
                  {data && (
                    <button
                      onClick={() => setShowPrint(true)}
                      title="Print"
                      className="text-[11px] text-zinc-400 hover:text-amber-400 uppercase tracking-wide border border-zinc-700 hover:border-amber-800 px-2 py-1 transition-colors"
                    >
                      <span className="sm:hidden">🖨</span>
                      <span className="hidden sm:inline">{t('print')}</span>
                    </button>
                  )}
                  <button
                    onClick={() => setShowPrefs(true)}
                    title="Preferences"
                    className="text-[11px] text-zinc-400 hover:text-amber-400 uppercase tracking-wide border border-zinc-700 hover:border-amber-800 px-2 py-1 transition-colors"
                  >
                    ⚙
                  </button>
                  <button
                    onClick={() => setShowBugReport(true)}
                    title="Report a bug"
                    className="text-[11px] text-red-500/70 hover:text-red-400 uppercase tracking-wide border border-red-900/50 hover:border-red-700 px-2 py-1 transition-colors"
                  >
                    <span className="sm:hidden">🐛</span>
                    <span className="hidden sm:inline">Bug</span>
                  </button>
                </div>
              </div>
            </header>
          )}
        </div>
      )}

      {/* ── Front door ── */}
      {screen === 'home' && (
        <LandingPage
          saves={saves}
          announcement={announcement}
          canResume={flowUnlocked && army.length > 0}
          onStart={() => { setScreen('flow'); setStep('faction'); }}
          onResume={() => { setScreen('flow'); setStep('units'); }}
          onLoadArmy={handleLoadArmy}
          onShowAuth={() => setShowAuth(true)}
          onShowCloudSaves={loggedIn ? () => { setCloudSavesDefaultTab('armies'); setShowCloudSaves(true); } : undefined}
          onShowCommunity={loggedIn
            ? () => { setCloudSavesDefaultTab('community'); setShowCloudSaves(true); }
            : () => setShowAuth(true)
          }
          onShowCampaign={loggedIn ? () => setShowCampaign(true) : () => setShowAuth(true)}
          onShowCheatSheets={() => setShowCheatSheets(true)}
        />
      )}

      {/* ── ① Faction ── */}
      {screen === 'flow' && step === 'faction' && (
        <FactionStep
          selectedFaction={selectedFaction}
          saves={saves}
          factionFlags={factionFlags}
          codexVersions={codexVersions}
          onPickFaction={handlePickFaction}
          onLoadArmy={handleLoadArmy}
          onDeleteArmy={(id) => { deleteArmy(id); if (id === activeLocalSaveId) setActiveLocalSaveId(null); }}
          onContinue={() => setStep('config')}
        />
      )}

      {/* ── ② Configuration — everything about the army that is not a unit ── */}
      {screen === 'flow' && step === 'config' && (
        <div className="max-w-screen-md mx-auto w-full px-4 py-6 space-y-5">
          {loadingFaction ? (
            <div className="flex items-center gap-3 text-zinc-500 py-8">
              <div className="w-5 h-5 border-2 border-amber-700 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">{t('loadingFactionData')}</span>
            </div>
          ) : data ? (
            <>
              {/* Battle setup is step ①'s — shown here as a summary with a way back, rather than a
                  second copy of the same two controls. */}
              <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-zinc-900 border border-zinc-800 border-l-4 border-l-amber-800">
                <span className="text-[11px] text-zinc-400">
                  <span className="text-amber-600 uppercase tracking-wide">{ENGAGEMENTS[engagement].name}</span>
                  <span className="text-zinc-600"> · </span>
                  <span className="tabular-nums">{pointLimit} pts</span>
                </span>
                <button
                  onClick={() => setStep('faction')}
                  className="text-[10px] uppercase tracking-wide text-zinc-500 hover:text-amber-400 transition-colors shrink-0"
                >
                  {t('changeLabel')}
                </button>
              </div>

              <ArmyConfig showBattleSetup={false} />

              {/* The allied detachment is part of configuring the army, not of picking units — it
                  used to live in the builder's left sidebar, four collapsibles down. */}
              <div className="border border-zinc-800 bg-zinc-900/50">
                <div className="px-4 py-2.5 border-b border-zinc-800 bg-zinc-900">
                  <span className="font-cinzel text-[11px] uppercase tracking-widest text-amber-400">
                    {t('alliedDetachmentPanelTitle')}
                  </span>
                </div>
                <div className="p-3 space-y-3">
                  <AlliedDetachmentPanel primaryFaction={selectedFaction} />
                  {alliedFaction && (
                    <div className="pt-1 border-t border-zinc-800">
                      <ArmyConfig scope="allied" alliedFactionLabel={alliedFactionLabel} />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-center pt-2 pb-6">
                <button
                  onClick={handleBuild}
                  className="px-12 py-3 bg-amber-800 border-2 border-amber-600 text-white font-bold uppercase tracking-widest text-sm hover:bg-amber-700 transition-colors"
                >
                  {t('addTroops')} →
                </button>
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* ── ③ Units — kept mounted so the catalogue's open sections survive a trip to ④ ── */}
      {screen === 'flow' && flowUnlocked && (
        <div style={{ display: step === 'units' ? 'flex' : 'none' }} className="flex-col flex-1">
          <div className="max-w-screen-xl mx-auto px-4 py-4 w-full flex-1">

            {/* Detachment switch — only once there is a second detachment to switch to. */}
            {alliedFaction && (
              <div className="flex items-stretch gap-1 mb-3 border border-zinc-800 bg-zinc-900/50 p-1 w-fit">
                <button
                  onClick={() => setDetachment('primary')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] uppercase tracking-wide font-cinzel transition-colors
                    ${detachment === 'primary'
                      ? 'bg-amber-900/40 border border-amber-700 text-amber-300'
                      : 'border border-transparent text-zinc-500 hover:text-zinc-300'}`}
                >
                  <FactionSymbol factionKey={selectedFaction!} size={13} naked overrideUrl={armySymbolOverride ?? undefined} />
                  {t('detachmentPrimary')}
                </button>
                <button
                  onClick={() => setDetachment('allied')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] uppercase tracking-wide font-cinzel transition-colors
                    ${detachment === 'allied'
                      ? 'bg-emerald-900/40 border border-emerald-700 text-emerald-300'
                      : 'border border-transparent text-zinc-500 hover:text-zinc-300'}`}
                >
                  <span>🤝</span>
                  <FactionSymbol factionKey={alliedFaction} size={13} naked />
                  {alliedFactionLabel}
                </button>
              </div>
            )}

            {showAlly && (
              <p className="text-[11px] text-zinc-500 leading-snug border-l-2 border-emerald-800 pl-3 mb-3">
                {t('alliedSeparateDetachment')} {factionLabel}.
                {selectedFaction && (() => {
                  const rel = getRelationship(selectedFaction, alliedFaction!, getArchetypeRule(archetype)?.alliedRelationshipOverrides);
                  return rel ? ` ${RELATIONSHIP_DESCRIPTIONS[rel]}` : '';
                })()}
                {selectedFaction && (() => {
                  const rel = getRelationship(selectedFaction, alliedFaction!, getArchetypeRule(archetype)?.alliedRelationshipOverrides);
                  return rel ? (
                    <span className={`ml-1.5 font-semibold uppercase tracking-wide ${RELATIONSHIP_COLORS[rel]}`}>
                      {RELATIONSHIP_LABELS[rel]}
                    </span>
                  ) : null;
                })()}
              </p>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
              <aside className="space-y-2">
                <CollapsiblePanel title={t('unitCatalogue')} defaultOpen>
                  {showAlly
                    ? <SlotPanel scope="allied" alliedFactionKey={alliedFaction!} />
                    : <SlotPanel />}
                </CollapsiblePanel>

                <ValidationPanel />

                {/* Doctrine/traits are step ②'s — say where they went instead of leaving the
                    player hunting for the archetype dropdown that used to be one tab away. */}
                <button
                  onClick={() => setStep('config')}
                  className="w-full text-left text-[11px] text-zinc-500 hover:text-amber-400 border border-zinc-800 hover:border-amber-900 px-3 py-2 transition-colors"
                >
                  ← {t('backToConfig')}
                </button>
              </aside>

              <main>
                <ArmyList scope={showAlly ? 'allied' : 'primary'} />
                <div className="flex justify-center py-6">
                  <button
                    onClick={() => setStep('review')}
                    className="px-10 py-3 bg-amber-800 border-2 border-amber-600 text-white font-bold uppercase tracking-widest text-sm hover:bg-amber-700 transition-colors"
                  >
                    {t('reviewList')} →
                  </button>
                </div>
              </main>
            </div>
          </div>
        </div>
      )}

      {/* ── ④ Review ── */}
      {screen === 'flow' && step === 'review' && flowUnlocked && (
        <ReviewStep
          onPrint={() => setShowPrint(true)}
          onSave={handleSaveArmy}
          savedMsg={savedMsg}
          onBack={() => setStep('units')}
        />
      )}

      {/* ── Modals (lazy-loaded) ── */}
      <Suspense fallback={null}>
        {showPrint     && (
          <ErrorBoundary label="Print View" onClose={() => setShowPrint(false)}>
            <PrintView onClose={() => setShowPrint(false)} />
          </ErrorBoundary>
        )}
        {showCheatSheets && (
          <ErrorBoundary label="Cheat Sheets" onClose={() => setShowCheatSheets(false)}>
            <CheatSheetModal onClose={() => setShowCheatSheets(false)} />
          </ErrorBoundary>
        )}
        {showArmies    && <SavedArmiesModal onLoad={save => { handleLoadArmy(save); setShowArmies(false); }} onClose={() => setShowArmies(false)} />}
        {showPrefs     && <PrefsModal prefs={prefs} loggedIn={loggedIn} onSave={setPrefs} onClose={() => setShowPrefs(false)} />}
        {showBugReport && (
          <BugReportModal
            onClose={() => setShowBugReport(false)}
            currentFaction={selectedFaction ? (FACTION_NAMES[selectedFaction] ?? selectedFaction) : undefined}
          />
        )}
        {showAuth && (
          <AuthModal
            onClose={() => setShowAuth(false)}
            onLoggedIn={async () => { await refreshAuth(); setShowAuth(false); }}
          />
        )}
        {showAdmin     && <AdminPanel onClose={() => setShowAdmin(false)} />}
        {/* onOpenCampaign intentionally not passed below — Campaign is alpha-gated (see
            LandingPage's disabled home button); this was the OLD entry point ("My Campaigns"
            quick-open in the Account tab) and must stay a no-op too, so there's exactly one gate
            to lift later, not two. */}
        {showCloudSaves && username && (
          <CloudSavesModal
            username={username}
            avatar={avatar}
            socialLinks={socialLinks}
            socialPublic={socialPublic}
            onClose={() => setShowCloudSaves(false)}
            onLogout={async () => { await logout(); }}
            onOpenAdmin={isAdmin ? () => { setShowCloudSaves(false); setShowAdmin(true); } : undefined}
            activeRosterId={activeCloudRosterId}
            onActiveRosterIdChange={id => { setActiveCloudRosterId(id); if (id != null) setActiveLocalSaveId(null); }}
            onProfileUpdate={() => refreshAuth()}
            onLoadCommunityArmy={handleLoadCommunityArmy}
            onLoadCloudRoster={handleLoadCloudRoster}
            defaultTab={cloudSavesDefaultTab}
          />
        )}
        {showCampaign && (
          <CampaignModal
            onClose={() => { setShowCampaign(false); setCampaignInitialOpenId(undefined); }}
            onCreateArmy={handleCreateCampaignArmy}
            onViewArmy={handleViewCampaignArmy}
            initialOpenId={campaignInitialOpenId}
          />
        )}
      </Suspense>

      <LegalFooter />

      {shareLinkError && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[70] bg-red-950/95 border border-red-700 text-red-300 text-xs px-4 py-2.5 shadow-lg flex items-center gap-3 print:hidden">
          <span>⚠ {shareLinkError}</span>
          <button onClick={() => setShareLinkError('')} className="text-red-400 hover:text-red-200 leading-none">✕</button>
        </div>
      )}

      {/* Service-worker update / offline-ready toast. Outside <Suspense> so it can surface even
          while a lazy modal is loading, and print:hidden so it never lands on a printed sheet. */}
      <PwaUpdatePrompt />
    </div>
  );
}

// ── Collapsible panel ───────────────────────────────────────────────────────
function CollapsiblePanel({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-zinc-800 bg-zinc-900/50">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex justify-between items-center px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800/60 transition-colors"
      >
        <span className="font-cinzel text-[11px] uppercase tracking-widest text-amber-400">{title}</span>
        <span className="text-zinc-600 text-[10px]">{open ? '▲' : '▼'}</span>
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}
