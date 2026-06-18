import { useEffect, useRef, useState } from 'react';
import { useArmyStore } from './store/army';
import { SlotPanel } from './components/SlotPanel';
import { ArmyConfig } from './components/ArmyConfig';
import { ValidationPanel } from './components/ValidationPanel';
import { ArmyList } from './components/ArmyList';
import { ReferencePanel } from './components/ReferencePanel';
import { ExportImport } from './components/ExportImport';
import { LandingPage } from './components/LandingPage';
import { FactionSymbol } from './components/FactionSymbol';
import { PrintView } from './components/PrintView';
import { AlliedDetachmentPanel } from './components/AlliedDetachmentPanel';
import { validateArmy } from './engine/validators';
import { computeUnitPoints, resolveUnit } from './engine/points';
import { getArchetypeRule } from './engine/archetypes';
import { getArmySymbolUrl } from './utils/getArmySymbolUrl';
import { getAssassinAccessAlignment, chamberMilitantOrdo } from './engine/keywords';
import type { FactionData } from './types/data';
import { FACTION_LOADERS } from './data/loaders';
import { useSavedArmies, type SavedArmy } from './hooks/useSavedArmies';
import { SavedArmiesModal } from './components/SavedArmiesModal';
import { BugReportModal } from './components/BugReportModal';
import { LegalFooter } from './components/LegalModal';

type TabId = 'landing' | 'army_config' | 'builder';

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
      title="Click to rename army"
      className="text-zinc-300 text-sm hover:text-amber-400 transition-colors truncate max-w-[200px] flex items-center gap-1"
    >
      {armyName || <span className="text-zinc-500 italic">Unnamed Army</span>}
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
    return s + (u ? computeUnitPoints(i, u, state.archetype) : 0);
  }, 0);

  const pct  = Math.min(100, (total / state.pointLimit) * 100);
  const over = total > state.pointLimit;

  const validation = validateArmy(state, data);
  const errors = validation.filter(v => v.type === 'error').length;
  const warns  = validation.filter(v => v.type === 'warn').length;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <span className={`text-sm font-bold tabular-nums ${over ? 'text-red-400' : 'text-amber-400'}`}>
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
  onSwitch, onClose,
}: {
  activeTab: TabId;
  openTabs: TabId[];
  selectedFaction: string | null;
  factionLabel: string;
  armyName: string;
  symbolOverride: string | null;
  onSwitch: (tab: TabId) => void;
  onClose: (tab: TabId) => void;
}) {
  const tabs: { id: TabId; label: string; icon: boolean; closeable: boolean }[] = [
    { id: 'landing',     label: 'Factions',       icon: false, closeable: false },
    ...(openTabs.includes('army_config') ? [{ id: 'army_config' as TabId, label: factionLabel || 'Config', icon: true, closeable: true }] : []),
    ...(openTabs.includes('builder')     ? [{ id: 'builder'     as TabId, label: armyName || 'Army',   icon: true, closeable: true }] : []),
  ];

  return (
    <div className="flex items-stretch bg-zinc-950 border-b border-zinc-800 px-2 overflow-x-auto">
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
                ? 'border-amber-600 text-amber-300 bg-zinc-900/70'
                : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30'
              }
            `}
          >
            {tab.icon && selectedFaction && (
              <FactionSymbol factionKey={selectedFaction} size={13} naked overrideUrl={symbolOverride ?? undefined} />
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
  );
}

// ── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const store = useArmyStore();
  const { setData, data, army, armyName, setArmyName, faction, engagement, pointLimit,
          hqMark, archetype, legacy, legacy2, traitPool, importRoster,
          alliedFaction, setAlliedData, injectArchetypeFaction } = store;

  const hasSession = !!sessionStorage.getItem('selectedFaction');

  const [activeTab, setActiveTab]               = useState<TabId>(hasSession ? 'builder' : 'landing');
  const [openTabs, setOpenTabs]                 = useState<TabId[]>(hasSession ? ['landing', 'army_config', 'builder'] : ['landing']);
  const [selectedFaction, setSelectedFaction]   = useState<string | null>(
    () => sessionStorage.getItem('selectedFaction')
  );
  const [loadingFaction, setLoadingFaction]     = useState(false);
  const [showRef, setShowRef]                   = useState(false);
  const [showPrint, setShowPrint]               = useState(false);
  const [showArmies, setShowArmies]             = useState(false);
  const [showBugReport, setShowBugReport]       = useState(false);
  const [savedMsg, setSavedMsg]                 = useState('');
  const pendingLoad                             = useRef<SavedArmy | null>(null);
  const restoringSession                        = useRef(hasSession);

  const { saves, saveArmy, deleteArmy } = useSavedArmies();

  const loaders = FACTION_LOADERS as Record<string, () => Promise<FactionData>>;

  const armySymbolOverride = getArmySymbolUrl(selectedFaction, archetype ?? null, legacy ?? null, legacy2 ?? null);

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

  function handleSelectFaction(key: string | null) {
    if (key === null) {
      setSelectedFaction(null);
      setOpenTabs(['landing']);
      setActiveTab('landing');
      sessionStorage.removeItem('selectedFaction');
      return;
    }
    const isNewFaction = key !== selectedFaction;
    setSelectedFaction(key);
    setOpenTabs(prev => {
      // Changing faction: close the builder tab
      const base = isNewFaction ? prev.filter(t => t === 'landing') : prev.filter(t => t !== 'builder');
      return base.includes('army_config') ? base : [...base, 'army_config'];
    });
    setActiveTab('army_config');
  }

  function handleBuild() {
    if (!armyName.trim() && selectedFaction) {
      setArmyName(`${FACTION_NAMES[selectedFaction] ?? selectedFaction} Army`);
    }
    if (!data || !selectedFaction) return;
    setOpenTabs(prev => prev.includes('builder') ? prev : [...prev, 'builder']);
    setActiveTab('builder');
  }

  function handleSaveArmy() {
    if (!data || !selectedFaction) return;

    const total = army.reduce((s, i) => {
      const u = resolveUnit(i, data);
      return s + (u ? computeUnitPoints(i, u, archetype) : 0);
    }, 0);

    const name = armyName.trim() || `${FACTION_NAMES[selectedFaction] ?? selectedFaction} Army`;
    const existing = saves.find(s => s.name === name && s.factionKey === selectedFaction);

    const entry: SavedArmy = {
      id: existing?.id ?? `save-${Date.now()}`,
      name,
      factionKey: selectedFaction,
      factionLabel: FACTION_NAMES[selectedFaction] ?? selectedFaction,
      savedAt: Date.now(),
      totalPts: total,
      unitCount: army.length,
      state: { armyName: name, faction, engagement, pointLimit, hqMark, archetype, legacy, legacy2, traitPool, army },
    };

    saveArmy(entry);
    setSavedMsg('Saved!');
    setTimeout(() => setSavedMsg(''), 2000);
  }

  function handleLoadArmy(save: SavedArmy) {
    pendingLoad.current = save;
    setSelectedFaction(save.factionKey);
    setOpenTabs(['landing', 'army_config', 'builder']);
    setActiveTab('builder');
  }

  function handleCloseTab(tab: TabId) {
    setOpenTabs(prev => prev.filter(t => t !== tab));
    if (activeTab === tab) {
      const remaining = openTabs.filter(t => t !== tab);
      setActiveTab(remaining[remaining.length - 1] ?? 'landing');
    }
  }

  const factionLabel = selectedFaction ? (FACTION_NAMES[selectedFaction] ?? selectedFaction) : '';

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">

      {/* ── Tab bar (always sticky at top) ── */}
      <div className="sticky top-0 z-50">
        <TabBar
          activeTab={activeTab}
          openTabs={openTabs}
          selectedFaction={selectedFaction}
          factionLabel={factionLabel}
          armyName={armyName}
          symbolOverride={armySymbolOverride}
          onSwitch={setActiveTab}
          onClose={handleCloseTab}
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
          onDeleteArmy={deleteArmy}
          hideArmyConfig
        />
      </div>

      {/* ── Army Config tab ── */}
      {openTabs.includes('army_config') && (
        <div style={{ display: activeTab === 'army_config' ? 'flex' : 'none' }} className="flex-col flex-1">
          {/* Sub-header */}
          <header className="sticky top-[38px] z-40 bg-zinc-900 border-b-2 border-amber-900/60 px-4 py-2.5">
            <div className="max-w-screen-xl mx-auto flex items-center gap-3">
              {selectedFaction && <FactionSymbol factionKey={selectedFaction} size={28} overrideUrl={armySymbolOverride ?? undefined} />}
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
                <span className="text-sm">Loading faction data…</span>
              </div>
            ) : data ? (
              <>
                <ArmyConfig />
                <div className="flex justify-center mt-8">
                  <button
                    onClick={handleBuild}
                    className="px-12 py-3 bg-amber-800 border-2 border-amber-600 text-white font-bold uppercase tracking-widest text-sm hover:bg-amber-700 transition-colors"
                  >
                    Build Army ▶
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
                {selectedFaction && <FactionSymbol factionKey={selectedFaction} size={28} overrideUrl={armySymbolOverride ?? undefined} />}
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
                    onClick={() => setShowRef(true)}
                    className="text-[11px] text-zinc-400 hover:text-amber-400 uppercase tracking-wide border border-zinc-700 hover:border-amber-800 px-3 py-1 transition-colors"
                  >
                    Reference
                  </button>
                )}
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
              <CollapsiblePanel title="Unit Catalogue" defaultOpen>
                <SlotPanel />
              </CollapsiblePanel>

              <CollapsiblePanel title="Allied Detachment" defaultOpen>
                <AlliedDetachmentPanel primaryFaction={selectedFaction} />
              </CollapsiblePanel>

              <ValidationPanel />

              <CollapsiblePanel title="Army" defaultOpen>
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

      {/* ── Modals ── */}
      {showPrint     && <PrintView onClose={() => setShowPrint(false)} />}
      {showArmies    && <SavedArmiesModal onLoad={save => { handleLoadArmy(save); setShowArmies(false); }} onClose={() => setShowArmies(false)} />}
      {showBugReport && (
        <BugReportModal
          onClose={() => setShowBugReport(false)}
          currentFaction={selectedFaction ? (FACTION_NAMES[selectedFaction] ?? selectedFaction) : undefined}
        />
      )}

      <LegalFooter />

      {showRef && !showArmies && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center p-6 overflow-y-auto"
          onClick={e => e.target === e.currentTarget && setShowRef(false)}
        >
          <div className="w-full max-w-lg relative">
            <button
              onClick={() => setShowRef(false)}
              className="absolute top-2 right-2 z-10 text-zinc-400 hover:text-white text-xl leading-none"
            >
              ✕
            </button>
            <ReferencePanel />
          </div>
        </div>
      )}
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
