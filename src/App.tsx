import { useEffect, useRef, useState } from 'react';
import { useArmyStore, getSerializableState } from './store/army';
import { SlotPanel } from './components/SlotPanel';
import { ArmyConfig } from './components/ArmyConfig';
import { ValidationPanel } from './components/ValidationPanel';
import { ArmyList } from './components/ArmyList';
import { ExportImport } from './components/ExportImport';
import { LandingPage } from './components/LandingPage';
import { FactionSymbol } from './components/FactionSymbol';
import { PrintView } from './components/PrintView';
import { AlliedDetachmentPanel } from './components/AlliedDetachmentPanel';
import { getRelationship, RELATIONSHIP_LABELS, RELATIONSHIP_COLORS, RELATIONSHIP_DESCRIPTIONS } from './data/alliedMatrix';
import { validateArmy } from './engine/validators';
import { computeUnitPoints, resolveUnit, effectiveArchetypeFor } from './engine/points';
import { getArchetypeRule } from './engine/archetypes';
import { getArmySymbolPair } from './utils/getArmySymbolUrl';
import { getAssassinAccessAlignment, chamberMilitantOrdo } from './engine/keywords';
import type { FactionData } from './types/data';
import { FACTION_LOADERS } from './data/loaders';
import { useSavedArmies, type SavedArmy, AUTOSAVE_ID, AUTOSAVE_DISMISSED_KEY } from './hooks/useSavedArmies';
import { SavedArmiesModal } from './components/SavedArmiesModal';
import { BugReportModal } from './components/BugReportModal';
import { LegalFooter } from './components/LegalModal';
import { AuthModal } from './components/AuthModal';
import { CloudSavesModal } from './components/CloudSavesModal';
import { CampaignModal } from './components/CampaignModal';
import { useAuth } from './hooks/useAuth';
import * as api from './lib/api';
import { useT } from './i18n';

type TabId = 'landing' | 'army_config' | 'builder' | 'allied_config';

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
  horus_heresy:         'Horus Heresy Space Marines',
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
function HeaderStatus() {
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
        <div className="w-20 h-1.5 bg-zinc-700 rounded overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${over ? 'bg-red-500' : 'bg-amber-600'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-zinc-500 text-xs tabular-nums">{state.pointLimit} pts</span>
      </div>

      {errors > 0 ? (
        <span className="text-[11px] text-red-400 border border-red-800/70 px-1.5 py-0.5 leading-none">✗ {errors}</span>
      ) : warns > 0 ? (
        <span className="text-[11px] text-amber-400 border border-amber-800/70 px-1.5 py-0.5 leading-none">⚠ {warns}</span>
      ) : (
        <span className="text-[11px] text-green-500 border border-green-800/70 px-1.5 py-0.5 leading-none">✓</span>
      )}
    </div>
  );
}

// ── Tab bar ─────────────────────────────────────────────────────────────────
function TabBar({
  activeTab, openTabs, selectedFaction, factionLabel, armyName, symbolOverride,
  alliedFactionKey, alliedFactionLabel,
  onSwitch, onClose,
  loggedIn, username, onAccountClick, onCampaignClick,
}: {
  activeTab: TabId;
  openTabs: TabId[];
  selectedFaction: string | null;
  factionLabel: string;
  armyName: string;
  symbolOverride: string | null;
  alliedFactionKey?: string | null;
  alliedFactionLabel?: string;
  onSwitch: (tab: TabId) => void;
  onClose: (tab: TabId) => void;
  loggedIn: boolean;
  username: string | null;
  onAccountClick: () => void;
  onCampaignClick: () => void;
}) {
  const t = useT();
  const tabs: { id: TabId; label: string; icon: boolean; closeable: boolean; allied?: boolean }[] = [
    { id: 'landing',     label: t('tabFactions'),       icon: false, closeable: false },
    ...(openTabs.includes('army_config') ? [{ id: 'army_config' as TabId, label: factionLabel || t('tabConfig'), icon: true, closeable: true }] : []),
    ...(openTabs.includes('builder')     ? [{ id: 'builder'     as TabId, label: armyName || t('tabArmy'),   icon: true, closeable: true }] : []),
    // Distinct icon/label/accent so it's unmistakably "the other army", not a sub-section of the primary's.
    ...(openTabs.includes('allied_config') ? [{ id: 'allied_config' as TabId, label: `${t('tabAllied')}: ${alliedFactionLabel || ''}`, icon: true, closeable: true, allied: true }] : []),
  ];

  return (
    <div className="flex items-stretch h-[38px] bg-zinc-950 border-b border-zinc-800 px-2">
      <div className="flex items-stretch overflow-x-auto flex-1 min-w-0">
      {tabs.map(tab => {
        const active = activeTab === tab.id;
        return (
          <div
            key={tab.id}
            onClick={() => onSwitch(tab.id)}
            className={`
              flex items-center gap-1.5 px-3 py-2 text-[11px] uppercase tracking-wide font-cinzel
              cursor-pointer select-none shrink-0 border-b-2 transition-colors
              ${active
                ? (tab.allied ? 'border-emerald-500 text-emerald-300 bg-zinc-900/70' : 'border-amber-600 text-amber-300 bg-zinc-900/70')
                : (tab.allied ? 'border-transparent text-emerald-700/70 hover:text-emerald-400 hover:bg-zinc-900/30' : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30')
              }
            `}
          >
            {tab.allied && <span className="text-[12px] leading-none">🤝</span>}
            {tab.icon && !tab.allied && selectedFaction && (
              <FactionSymbol factionKey={selectedFaction} size={13} naked overrideUrl={symbolOverride ?? undefined} />
            )}
            {tab.icon && tab.allied && alliedFactionKey && (
              <FactionSymbol factionKey={alliedFactionKey} size={13} naked />
            )}
            <span>{tab.label}</span>
            {tab.closeable && (
              <span
                onClick={e => { e.stopPropagation(); onClose(tab.id); }}
                className="ml-0.5 text-zinc-600 hover:text-red-400 transition-colors leading-none text-sm"
              >
                ×
              </span>
            )}
          </div>
        );
      })}
      </div>
      <button
        onClick={onCampaignClick}
        title={t('campaignAlphaTooltip')}
        className="flex items-center shrink-0 gap-1 px-3 text-[11px] uppercase tracking-wide font-cinzel text-zinc-500 hover:text-red-400 transition-colors border-l border-zinc-800"
      >
        ⚔ {t('campaign')} <span className="text-[9px] text-red-500/70">ALPHA</span>
      </button>
      <button
        onClick={onAccountClick}
        className="flex items-center shrink-0 gap-1.5 px-3 text-[11px] uppercase tracking-wide font-cinzel text-zinc-400 hover:text-amber-400 transition-colors border-l border-zinc-800"
      >
        {loggedIn ? `☁ ${username}` : t('login')}
      </button>
    </div>
  );
}

// ── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const t = useT();
  const store = useArmyStore();
  const { setData, data, army, armyName, setArmyName, faction, engagement, pointLimit,
          hqMark, archetype, legacy, legacy2, traitPool, importRoster,
          alliedFaction, alliedData, alliedArchetype, alliedLegacy, alliedTraitPool, alliedHqMark, setAlliedData,
          injectArchetypeFaction, injectAlliedArchetypeFaction } = store;

  // Always land on the Factions tab on a fresh page load/reload — never auto-resume straight
  // into the builder, even if a prior session left a faction selected in sessionStorage.
  const [activeTab, setActiveTab]               = useState<TabId>('landing');
  const [openTabs, setOpenTabs]                 = useState<TabId[]>(['landing']);
  const [selectedFaction, setSelectedFaction]   = useState<string | null>(null);
  const [loadingFaction, setLoadingFaction]     = useState(false);
  const [showPrint, setShowPrint]               = useState(false);
  const [showArmies, setShowArmies]             = useState(false);
  const [showBugReport, setShowBugReport]       = useState(false);
  const [showAuth, setShowAuth]                 = useState(false);
  const [showCloudSaves, setShowCloudSaves]     = useState(false);
  const [showCampaign, setShowCampaign]         = useState(false);
  const { username, loggedIn, refresh: refreshAuth, logout } = useAuth();
  const [savedMsg, setSavedMsg]                 = useState('');
  const pendingLoad                             = useRef<SavedArmy | null>(null);
  const restoringSession                        = useRef(false);
  // Tracks which save (cloud roster id, or local save id) the "Save" button currently updates
  // in place. Cleared whenever a genuinely new army is started, so the next quick-save creates
  // a fresh entry instead of silently overwriting whatever was last bound.
  const [activeCloudRosterId, setActiveCloudRosterId] = useState<number | null>(null);
  const [activeLocalSaveId, setActiveLocalSaveId]     = useState<string | null>(null);

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
        if (restoringSession.current) {
          restoringSession.current = false;
          setOpenTabs(['landing', 'army_config', 'builder']);
          setActiveTab('builder');
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

  // Opens its own "Allied: <faction>" tab the moment an allied detachment is picked, and jumps
  // straight to it — same pattern as Build Army opening the builder tab. Closes (and switches
  // away from) it automatically when the ally is removed, so the tab can never outlive the ally.
  // Skips the very first run (mount/page-load): zustand persists alliedFaction across reloads,
  // and the app must always cold-start on the Factions tab regardless of what was persisted —
  // this effect should only react to the player actively picking/removing an ally afterwards.
  const skipFirstAlliedTabEffect = useRef(true);
  useEffect(() => {
    if (skipFirstAlliedTabEffect.current) {
      skipFirstAlliedTabEffect.current = false;
      return;
    }
    if (alliedFaction) {
      setOpenTabs(prev => prev.includes('allied_config') ? prev : [...prev, 'allied_config']);
      setActiveTab('allied_config');
    } else {
      setOpenTabs(prev => prev.filter(t => t !== 'allied_config'));
      setActiveTab(prev => prev === 'allied_config' ? 'builder' : prev);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save the active session to 'custom40k-saved-armies' when the user closes/navigates
  // away. Uses a fixed id so it overwrites itself (never accumulates). Reads fresh zustand
  // state at fire time — no stale-closure risk since getState() is always current.
  useEffect(() => {
    function handleBeforeUnload() {
      try {
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

  // Crash-recovery: write a backup to localStorage every 5 s after the army changes.
  // The one-time migration effect on the next load picks it up as an autosave entry.
  useEffect(() => {
    if (!faction || army.length === 0) {
      localStorage.removeItem('custom40k-army');
      return;
    }
    const timer = setTimeout(() => {
      try {
        const st = useArmyStore.getState();
        if (!st.faction || st.army.length === 0) return;
        localStorage.setItem('custom40k-army', JSON.stringify({ state: getSerializableState(st) }));
      } catch { /* quota exceeded */ }
    }, 5000);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [army, faction]);

  function handleSelectFaction(key: string | null) {
    if (key === null) {
      setSelectedFaction(null);
      setOpenTabs(['landing']);
      setActiveTab('landing');
      sessionStorage.removeItem('selectedFaction');
      sessionStorage.removeItem(AUTOSAVE_DISMISSED_KEY);
      return;
    }
    const isNewFaction = key !== selectedFaction;
    if (isNewFaction) sessionStorage.removeItem(AUTOSAVE_DISMISSED_KEY);
    if (isNewFaction) {
      setActiveCloudRosterId(null);
      setActiveLocalSaveId(null);
    }
    setSelectedFaction(key);
    if (activeTab === 'landing') {
      // Faction picked from the landing pick-view — config is inline there, stay on landing.
      if (isNewFaction) setOpenTabs(['landing']);
    } else {
      // Faction changed from inside the builder (e.g. via a future settings panel).
      setOpenTabs(prev => {
        const base = isNewFaction ? prev.filter(t => t === 'landing') : prev.filter(t => t !== 'builder');
        return base.includes('army_config') ? base : [...base, 'army_config'];
      });
      setActiveTab('army_config');
    }
  }

  function handleBuild() {
    if (!armyName.trim() && selectedFaction) {
      setArmyName(`${FACTION_NAMES[selectedFaction] ?? selectedFaction} Army`);
    }
    if (!data || !selectedFaction) return;
    setOpenTabs(prev => {
      const withBuilder: TabId[] = prev.includes('builder') ? prev : [...prev, 'builder'];
      // Re-open the allied tab too if an ally was already configured (e.g. resuming a saved
      // army) — otherwise the sidebar's "open the Allied tab" pointer would lead nowhere.
      return alliedFaction && !withBuilder.includes('allied_config')
        ? [...withBuilder, 'allied_config']
        : withBuilder;
    });
    setActiveTab('builder');
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
          const res = await api.saveRoster(name, { ...stateSnapshot, armyName: name });
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
      state: getSerializableState({ armyName: name, faction, engagement, pointLimit, hqMark, archetype, legacy, legacy2, traitPool, army, alliedFaction, alliedArchetype, alliedLegacy, alliedTraitPool, alliedHqMark }),
    };

    saveArmy(entry);
    setSavedMsg('Saved!');
    setTimeout(() => setSavedMsg(''), 2000);
  }

  function handleLoadArmy(save: SavedArmy) {
    pendingLoad.current = save;
    setActiveLocalSaveId(save.id);
    setActiveCloudRosterId(null);
    // Normalize: old saves stored the display label as factionKey; new ones store the snake_case key.
    const fKey = FACTION_NAMES[save.factionKey]
      ? save.factionKey
      : Object.entries(FACTION_NAMES).find(([, v]) => v === save.factionKey)?.[0] ?? save.factionKey;
    setSelectedFaction(fKey);
    setOpenTabs(['landing', 'army_config', 'builder']);
    setActiveTab('builder');
  }

  function handleCloseTab(tab: TabId) {
    // Closing a tab's × is always a UI-only action — it hides the tab, it never deletes data.
    // The allied detachment's units stay intact in the background even with its tab closed;
    // re-opening it (sidebar's "Allied: X" widget) shows the same roster exactly as left it.
    // The ONLY ways to actually delete the ally are the dedicated "Remove" button (just the
    // ally) or "Clear" (the whole army, which cascades to the ally too).
    setOpenTabs(prev => prev.filter(t => t !== tab));
    if (activeTab === tab) {
      const remaining = openTabs.filter(t => t !== tab);
      setActiveTab(remaining[remaining.length - 1] ?? 'landing');
    }
  }

  const factionLabel = selectedFaction ? (FACTION_NAMES[selectedFaction] ?? selectedFaction) : '';
  const alliedFactionLabel = alliedFaction ? (FACTION_NAMES[alliedFaction] ?? alliedFaction) : '';

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">

      {/* ── Tab bar — hidden on landing hero (hero has its own header) ── */}
      <div className="sticky top-0 z-50" style={{ display: activeTab === 'landing' ? 'none' : 'block' }}>
        <TabBar
          activeTab={activeTab}
          openTabs={openTabs}
          selectedFaction={selectedFaction}
          factionLabel={factionLabel}
          armyName={armyName}
          symbolOverride={armySymbolOverride}
          alliedFactionKey={alliedFaction}
          alliedFactionLabel={alliedFactionLabel}
          onSwitch={setActiveTab}
          onClose={handleCloseTab}
          loggedIn={loggedIn}
          username={username}
          onAccountClick={() => loggedIn ? setShowCloudSaves(true) : setShowAuth(true)}
          onCampaignClick={() => loggedIn ? setShowCampaign(true) : setShowAuth(true)}
        />
      </div>

      {/* ── Landing tab ── */}
      <div style={{ display: activeTab === 'landing' ? 'contents' : 'none' }}>
        <LandingPage
          selectedFaction={selectedFaction}
          loading={loadingFaction}
          saves={saves}
          onSelectFaction={handleSelectFaction}
          onBuild={handleBuild}
          onLoadArmy={handleLoadArmy}
          onDeleteArmy={(id) => { deleteArmy(id); if (id === activeLocalSaveId) setActiveLocalSaveId(null); }}
          onShowAuth={() => setShowAuth(true)}
        />
      </div>

      {/* ── Army Config tab ── */}
      {openTabs.includes('army_config') && (
        <div style={{ display: activeTab === 'army_config' ? 'flex' : 'none' }} className="flex-col flex-1">
          {/* Sub-header */}
          <header className="sticky top-[38px] z-40 bg-zinc-900 border-b-2 border-amber-900/60 px-4 py-2.5">
            <div className="max-w-screen-xl mx-auto flex items-center gap-3">
              {selectedFaction && (
                <div className="flex items-center gap-1">
                  <FactionSymbol factionKey={selectedFaction} size={28} overrideUrl={armySymbolOverride ?? undefined} />
                  {armySymbolSecondary && <FactionSymbol factionKey={selectedFaction} size={28} overrideUrl={armySymbolSecondary} />}
                </div>
              )}
              <h1 className="text-amber-500 font-bold uppercase tracking-widest text-base leading-none font-bankgothic">
                {factionLabel}
              </h1>
            </div>
          </header>

          {/* Config content */}
          <div className="max-w-screen-md mx-auto w-full px-4 py-6">
            {loadingFaction ? (
              <div className="flex items-center gap-3 text-zinc-500 py-8">
                <div className="w-5 h-5 border-2 border-amber-700 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">{t('loadingFactionData')}</span>
              </div>
            ) : data ? (
              <>
                <ArmyConfig />
                <div className="flex justify-center mt-8">
                  <button
                    onClick={handleBuild}
                    className="px-12 py-3 bg-amber-800 border-2 border-amber-600 text-white font-bold uppercase tracking-widest text-sm hover:bg-amber-700 transition-colors"
                  >
                    {t('buildArmy')}
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* ── Builder tab ── */}
      {openTabs.includes('builder') && (
        <div style={{ display: activeTab === 'builder' ? 'flex' : 'none' }} className="flex-col flex-1">

          {/* Builder sticky header */}
          <header className="sticky top-[38px] z-40 bg-zinc-900 border-b-2 border-amber-900/60 px-4 py-2.5">
            <div className="max-w-screen-xl mx-auto flex items-center gap-3 flex-wrap">
              {/* Symbol + title + army name */}
              <div className="flex items-center gap-2 mr-auto min-w-0">
                {selectedFaction && (
                  <div className="flex items-center gap-1">
                    <FactionSymbol factionKey={selectedFaction} size={28} overrideUrl={armySymbolOverride ?? undefined} />
                    {armySymbolSecondary && <FactionSymbol factionKey={selectedFaction} size={28} overrideUrl={armySymbolSecondary} />}
                  </div>
                )}
                <h1 className="text-amber-500 font-bold uppercase tracking-widest text-base leading-none shrink-0 font-bankgothic">
                  Custom40k
                </h1>
                <span className="text-zinc-600 text-xs shrink-0">{factionLabel} ·</span>
                <ArmyNameEditor />
              </div>

              {/* Points + validation */}
              <HeaderStatus />

              {/* Actions */}
              <div className="flex items-center gap-2 flex-wrap">
                {data && (
                  <button
                    onClick={handleSaveArmy}
                    className={`text-[11px] uppercase tracking-wide border px-3 py-1 transition-colors
                      ${savedMsg
                        ? 'text-green-400 border-green-700 bg-green-900/20'
                        : 'text-zinc-400 hover:text-amber-400 border-zinc-700 hover:border-amber-800'
                      }`}
                  >
                    {savedMsg || 'Save'}
                  </button>
                )}
                <button
                  onClick={() => setShowArmies(true)}
                  className="text-[11px] text-zinc-400 hover:text-amber-400 uppercase tracking-wide border border-zinc-700 hover:border-amber-800 px-3 py-1 transition-colors"
                >
                  My Armies
                </button>
                {data && (
                  <button
                    onClick={() => setShowPrint(true)}
                    className="text-[11px] text-zinc-400 hover:text-amber-400 uppercase tracking-wide border border-zinc-700 hover:border-amber-800 px-3 py-1 transition-colors"
                  >
                    Print
                  </button>
                )}
                <button
                  onClick={() => setShowBugReport(true)}
                  className="text-[11px] text-red-500/70 hover:text-red-400 uppercase tracking-wide border border-red-900/50 hover:border-red-700 px-3 py-1 transition-colors"
                >
                  Bug
                </button>
              </div>
            </div>
          </header>

          {/* Builder layout */}
          <div className="max-w-screen-xl mx-auto px-4 py-4 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 flex-1">
            <aside className="space-y-2">
              <CollapsiblePanel title={t('battleSetup')} defaultOpen={false}>
                <div className="px-3 py-3">
                  <ArmyConfig onlyBattleSetup />
                </div>
              </CollapsiblePanel>

              <CollapsiblePanel title={t('unitCatalogue')} defaultOpen>
                <SlotPanel />
              </CollapsiblePanel>

              <CollapsiblePanel title={t('alliedDetachmentPanelTitle')} defaultOpen>
                <AlliedDetachmentPanel primaryFaction={selectedFaction}
                  tabOpen={openTabs.includes('allied_config')}
                  onOpenTab={() => {
                    setOpenTabs(prev => prev.includes('allied_config') ? prev : [...prev, 'allied_config']);
                    setActiveTab('allied_config');
                  }} />
              </CollapsiblePanel>

              <ValidationPanel />

              <CollapsiblePanel title={t('armyPanelTitle')} defaultOpen>
                <div className="p-3">
                  <ExportImport onPrint={() => setShowPrint(true)} />
                </div>
              </CollapsiblePanel>
            </aside>

            <main>
              <ArmyList />
            </main>
          </div>
        </div>
      )}

      {/* ── Allied Detachment tab — its own army: Customisation + catalogue, full width ── */}
      {openTabs.includes('allied_config') && alliedFaction && (
        <div style={{ display: activeTab === 'allied_config' ? 'flex' : 'none' }} className="flex-col flex-1">
          <header className="sticky top-[38px] z-40 bg-zinc-900 border-b-2 border-emerald-900/60 px-4 py-2.5">
            <div className="max-w-screen-xl mx-auto flex items-center gap-3">
              <FactionSymbol factionKey={alliedFaction} size={28} />
              <h1 className="text-emerald-500 font-bold uppercase tracking-widest text-base leading-none font-bankgothic">
                🤝 Allied: {alliedFactionLabel}
              </h1>
              {selectedFaction && (() => {
                const rel = getRelationship(selectedFaction, alliedFaction);
                return rel ? (
                  <span className={`text-[10px] font-semibold uppercase tracking-wide ${RELATIONSHIP_COLORS[rel]}`}>
                    {RELATIONSHIP_LABELS[rel]}
                  </span>
                ) : null;
              })()}
            </div>
          </header>

          <div className="max-w-screen-xl mx-auto px-4 py-4 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 flex-1">
            <aside className="space-y-2">
              <p className="text-[11px] text-zinc-500 leading-snug border-l-2 border-emerald-800 pl-3">
                This is a separate detachment from {factionLabel}'s army — its own Army
                Organisation Plan, its own Army Customisation, sharing only the total point limit.
                {selectedFaction && (() => {
                  const rel = getRelationship(selectedFaction, alliedFaction);
                  return rel ? ` ${RELATIONSHIP_DESCRIPTIONS[rel]}` : '';
                })()}
              </p>

              <ArmyConfig scope="allied" alliedFactionLabel={alliedFactionLabel} />

              <div className="border border-zinc-800 bg-zinc-900/50">
                <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-zinc-800 bg-zinc-900">
                  <span className="font-cinzel text-[11px] uppercase tracking-widest text-emerald-400">
                    {alliedFactionLabel} — {t('unitCatalogue')}
                  </span>
                </div>
                <div className="p-3">
                  <SlotPanel scope="allied" alliedFactionKey={alliedFaction} />
                </div>
              </div>

              <ValidationPanel />
            </aside>

            <main>
              <ArmyList scope="allied" />
            </main>
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      {showPrint     && <PrintView onClose={() => setShowPrint(false)} />}
      {showArmies    && <SavedArmiesModal onLoad={save => { handleLoadArmy(save); setShowArmies(false); }} onClose={() => setShowArmies(false)} />}
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
      {showCloudSaves && username && (
        <CloudSavesModal
          username={username}
          onClose={() => setShowCloudSaves(false)}
          onLogout={async () => { await logout(); }}
          activeRosterId={activeCloudRosterId}
          onActiveRosterIdChange={id => { setActiveCloudRosterId(id); if (id != null) setActiveLocalSaveId(null); }}
        />
      )}
      {showCampaign && <CampaignModal onClose={() => setShowCampaign(false)} />}

      <LegalFooter />


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
