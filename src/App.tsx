import { useEffect, useRef, useState } from 'react';
import { useArmyStore } from './store/army';
import { SlotPanel } from './components/SlotPanel';
import { ArmyConfig } from './components/ArmyConfig';
import { ValidationPanel } from './components/ValidationPanel';
import { ArmyList } from './components/ArmyList';
import { ReferencePanel } from './components/ReferencePanel';
import { ExportImport } from './components/ExportImport';
import { LandingPage } from './components/LandingPage';
import { PrintView } from './components/PrintView';
import { AlliedDetachmentPanel } from './components/AlliedDetachmentPanel';
import { validateArmy } from './engine/validators';
import { computeUnitPoints, resolveUnit } from './engine/points';
import { getArchetypeRule } from './engine/archetypes';
import type { FactionData } from './types/data';
import { useSavedArmies, type SavedArmy } from './hooks/useSavedArmies';
import { SavedArmiesModal } from './components/SavedArmiesModal';
import { BugReportModal } from './components/BugReportModal';
import { LegalFooter } from './components/LegalModal';

type Page = 'landing' | 'builder';

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

// ── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const store = useArmyStore();
  const { setData, data, army, armyName, setArmyName, faction, engagement, pointLimit,
          hqMark, archetype, legacy, legacy2, traitPool, importRoster,
          alliedFaction, setAlliedData, injectArchetypeFaction } = store;

  const [page, setPage]                         = useState<Page>('landing');
  const [selectedFaction, setSelectedFaction]   = useState<string | null>(
    () => sessionStorage.getItem('selectedFaction')
  );
  const [loadingFaction, setLoadingFaction]     = useState(false);
  const [showRef, setShowRef]                   = useState(false);
  const [showPrint, setShowPrint]               = useState(false);
  const [showArmies, setShowArmies]             = useState(false);
  const [showBugReport, setShowBugReport]       = useState(false);
  const [savedMsg, setSavedMsg]                 = useState('');
  const pendingLoad = useRef<SavedArmy | null>(null);
  const restoringSession = useRef(!!sessionStorage.getItem('selectedFaction'));

  const { saves, saveArmy, deleteArmy } = useSavedArmies();

  // Shared faction data loaders (used for both primary and allied faction loading)
  const loaders: Record<string, () => Promise<unknown>> = {
    chaos_space_marines: () => Promise.all([
      import('../data/parsed/chaos_space_marines_units.json'),
      import('../data/parsed/chaos_space_marines_armory.json'),
      import('../data/parsed/chaos_space_marines_rules.json'),
    ]).then(([u, a, r]) => ({ default: { ...(u as any).default, ...(a as any).default, ...(r as any).default } })),
    chaos_daemons:        () => import('../data/parsed/chaos_daemons.json'),
    space_marines:        () => import('../data/parsed/space_marines.json'),
    imperial_guard:       () => import('../data/parsed/imperial_guard.json'),
    adeptus_mechanicus:   () => import('../data/parsed/adeptus_mechanicus.json'),
    adeptus_custodes:     () => import('../data/parsed/adeptus_custodes.json'),
    adeptus_sororitas:    () => import('../data/parsed/adeptus_sororitas.json'),
    grey_knights:         () => import('../data/parsed/grey_knights.json'),
    inquisition:          () => import('../data/parsed/inquisition.json'),
    assassins:            () => import('../data/parsed/assassins.json'),
    tau_empire:           () => import('../data/parsed/tau_empire.json'),
    necrons:              () => import('../data/parsed/necrons.json'),
    orks:                 () => import('../data/parsed/orks.json'),
    eldar:                () => import('../data/parsed/eldar.json'),
    dark_eldar:           () => import('../data/parsed/dark_eldar.json'),
    genestealer_cults:    () => import('../data/parsed/genestealer_cults.json'),
    harlequins:           () => import('../data/parsed/harlequins.json'),
    leagues_of_votann:    () => import('../data/parsed/leagues_of_votann.json'),
    tyranids:             () => import('../data/parsed/tyranids.json'),
    horus_heresy:         () => import('../data/parsed/horus_heresy.json'),
  };

  // Faction loader
  useEffect(() => {
    if (!selectedFaction) return;
    sessionStorage.setItem('selectedFaction', selectedFaction);
    setLoadingFaction(true);

    const loader = loaders[selectedFaction];
    if (!loader) { setLoadingFaction(false); return; }

    loader()
      .then(m => {
        setData((m as { default: unknown }).default as FactionData);
        setLoadingFaction(false);
        // If there's a pending army to restore, do it now
        if (pendingLoad.current) {
          const save = pendingLoad.current;
          pendingLoad.current = null;
          importRoster(JSON.stringify(save.state));
        }
        // Restore builder page after a page refresh
        if (restoringSession.current) {
          restoringSession.current = false;
          setPage('builder');
        }
      })
      .catch(e => {
        console.error('Error loading faction data', e);
        setLoadingFaction(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFaction]);

  // Allied faction data loader — watches alliedFaction and injects data into the store
  useEffect(() => {
    if (!alliedFaction) {
      setAlliedData(null);
      return;
    }
    const loader = loaders[alliedFaction];
    if (!loader) return;
    loader()
      .then(m => setAlliedData((m as { default: unknown }).default as FactionData))
      .catch(e => console.error('Error loading allied faction data', e));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alliedFaction]);

  // Auto-load faction data required by the active archetype (e.g. Legion → horus_heresy)
  useEffect(() => {
    const rule = getArchetypeRule(archetype);
    if (!rule?.alliedFaction || !data) return;
    const key = rule.alliedFaction;
    if (data.allied?.[key]) return; // already loaded
    const loader = loaders[key];
    if (!loader) return;
    loader()
      .then(m => injectArchetypeFaction(key, (m as { default: unknown }).default as FactionData, rule.sharedSupplementArmory))
      .catch(e => console.error('Error loading archetype faction data', e));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [archetype, data?.faction]);

  function handleBuild() {
    // Auto-assign name if empty
    if (!armyName.trim() && selectedFaction) {
      setArmyName(`${FACTION_NAMES[selectedFaction] ?? selectedFaction} Army`);
    }
    setPage('builder');
  }

  function handleSaveArmy() {
    if (!data || !selectedFaction) return;

    const total = army.reduce((s, i) => {
      const u = resolveUnit(i, data);
      return s + (u ? computeUnitPoints(i, u, archetype) : 0);
    }, 0);

    const name = armyName.trim() || `${FACTION_NAMES[selectedFaction] ?? selectedFaction} Army`;

    // Find existing save with same name+faction to overwrite
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
    setPage('builder');
  }

  if (page === 'landing') {
    return (
      <LandingPage
        selectedFaction={selectedFaction}
        loading={loadingFaction}
        saves={saves}
        onSelectFaction={setSelectedFaction}
        onBuild={handleBuild}
        onLoadArmy={handleLoadArmy}
        onDeleteArmy={deleteArmy}
      />
    );
  }

  const factionLabel = selectedFaction ? (FACTION_NAMES[selectedFaction] ?? selectedFaction) : '';

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">

      {/* ── Sticky header ── */}
      <header className="sticky top-0 z-40 bg-zinc-900 border-b-2 border-amber-900/60 px-4 py-2.5">
        <div className="max-w-screen-xl mx-auto flex items-center gap-3 flex-wrap">
          {/* Title + faction + editable army name */}
          <div className="flex items-baseline gap-2 mr-auto min-w-0">
            <h1 className="text-amber-500 font-bold uppercase tracking-widest text-base leading-none shrink-0">
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
            <button
              onClick={() => { sessionStorage.removeItem('selectedFaction'); setPage('landing'); }}
              className="text-[11px] text-zinc-400 hover:text-amber-400 uppercase tracking-wide border border-zinc-700 hover:border-amber-800 px-3 py-1 transition-colors"
            >
              ← Faction
            </button>
          </div>
        </div>
      </header>

      {/* ── Layout ── */}
      <div className="max-w-screen-xl mx-auto px-4 py-4 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">

        {/* ── Sidebar ── */}
        <aside className="space-y-2">
          <CollapsiblePanel title="Unit Catalogue" defaultOpen>
            <SlotPanel />
          </CollapsiblePanel>

          <CollapsiblePanel title="Allied Detachment" defaultOpen>
            <AlliedDetachmentPanel primaryFaction={selectedFaction} />
          </CollapsiblePanel>

          <CollapsiblePanel title="Configuration">
            <ArmyConfig />
          </CollapsiblePanel>

          <ValidationPanel />

          <div className="bg-zinc-900 border border-zinc-700 border-l-4 border-l-amber-800 px-3 pb-3">
            <div className="text-[11px] uppercase tracking-widest text-amber-600 py-2 border-b border-zinc-700 mb-1">
              Army
            </div>
            <ExportImport onPrint={() => setShowPrint(true)} />
          </div>
        </aside>

        {/* ── Army list ── */}
        <main>
          <ArmyList />
        </main>
      </div>

      {showPrint    && <PrintView onClose={() => setShowPrint(false)} />}
      {showArmies   && <SavedArmiesModal onLoad={save => { handleLoadArmy(save); setShowArmies(false); }} onClose={() => setShowArmies(false)} />}
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
    <div className="bg-zinc-900 border border-zinc-700 border-l-4 border-l-amber-800">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex justify-between items-center text-[11px] uppercase tracking-widest text-amber-600 px-3 py-2 border-b border-zinc-700 hover:bg-zinc-800 transition-colors"
      >
        <span>{title}</span>
        <span className="text-zinc-500 text-[10px]">{open ? '▲' : '▼'}</span>
      </button>
      {open && <div className="p-3">{children}</div>}
    </div>
  );
}
