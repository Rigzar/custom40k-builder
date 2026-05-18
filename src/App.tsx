import { useEffect, useState } from 'react';
import { useArmyStore } from './store/army';
import { SlotPanel } from './components/SlotPanel';
import { ArmyConfig } from './components/ArmyConfig';
import { ValidationPanel } from './components/ValidationPanel';
import { ArmyList } from './components/ArmyList';
import { ReferencePanel } from './components/ReferencePanel';
import { ExportImport } from './components/ExportImport';
import { LandingPage } from './components/LandingPage';
import { PrintView } from './components/PrintView';
import { validateArmy } from './engine/validators';
import { computeUnitPoints, resolveUnit } from './engine/points';
import type { FactionData } from './types/data';

type Page = 'landing' | 'builder';

const FACTION_NAMES: Record<string, string> = {
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
  horus_heresy:         'Horus Heresy Space Marines',
};

// ── Compact status bar shown in the sticky header ──────────────────────────
function HeaderStatus() {
  const { data, ...state } = useArmyStore();
  if (!data || state.army.length === 0) return null;

  const total = state.army.reduce((s, i) => {
    const u = resolveUnit(i, data);
    return s + (u ? computeUnitPoints(i, u) : 0);
  }, 0);

  const pct  = Math.min(100, (total / state.pointLimit) * 100);
  const over = total > state.pointLimit;

  const validation = validateArmy(state, data);
  const errors = validation.filter(v => v.type === 'error').length;
  const warns  = validation.filter(v => v.type === 'warn').length;

  return (
    <div className="flex items-center gap-3">
      {/* Points bar */}
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

      {/* Validation badge */}
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
  const { setData, data } = useArmyStore();
  const [page, setPage]                   = useState<Page>('landing');
  const [selectedFaction, setSelectedFaction] = useState<string | null>(null);
  const [loadingFaction, setLoadingFaction]   = useState(false);
  const [showRef, setShowRef]             = useState(false);
  const [showPrint, setShowPrint]         = useState(false);

  useEffect(() => {
    if (!selectedFaction) return;
    setLoadingFaction(true);

    const loaders: Record<string, () => Promise<unknown>> = {
      chaos_space_marines:  () => import('../data/parsed/chaos_space_marines.json'),
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
      horus_heresy:         () => import('../data/parsed/horus_heresy.json'),
    };

    const loader = loaders[selectedFaction];
    if (!loader) { setLoadingFaction(false); return; }

    loader()
      .then(m => {
        setData((m as { default: unknown }).default as FactionData);
        setLoadingFaction(false);
      })
      .catch(e => {
        console.error('Error loading faction data', e);
        setLoadingFaction(false);
      });
  }, [selectedFaction, setData]);

  if (page === 'landing') {
    return (
      <LandingPage
        selectedFaction={selectedFaction}
        loading={loadingFaction}
        onSelectFaction={setSelectedFaction}
        onBuild={() => setPage('builder')}
      />
    );
  }

  const factionLabel = selectedFaction ? (FACTION_NAMES[selectedFaction] ?? selectedFaction) : '';

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">

      {/* ── Sticky header ── */}
      <header className="sticky top-0 z-40 bg-zinc-900 border-b-2 border-amber-900/60 px-4 py-2.5">
        <div className="max-w-screen-xl mx-auto flex items-center gap-3 flex-wrap">
          {/* Title */}
          <div className="flex items-baseline gap-2 mr-auto min-w-0">
            <h1 className="text-amber-500 font-bold uppercase tracking-widest text-base leading-none shrink-0">
              Custom40k
            </h1>
            <span className="text-zinc-400 text-sm truncate">{factionLabel}</span>
          </div>

          {/* Points + validation */}
          <HeaderStatus />

          {/* Actions */}
          <div className="flex items-center gap-2">
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
                Print List
              </button>
            )}
            <button
              onClick={() => setPage('landing')}
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
          {/* 1. Unit Catalogue — open by default (most-used) */}
          <CollapsiblePanel title="Unit Catalogue" defaultOpen>
            <SlotPanel />
          </CollapsiblePanel>

          {/* 2. Configuration — collapsed by default (already set on landing) */}
          <CollapsiblePanel title="Configuration">
            <ArmyConfig />
          </CollapsiblePanel>

          {/* 3. Validation — has its own dynamic border color, self-collapsible */}
          <ValidationPanel />

          {/* 4. Export / Import */}
          <div className="bg-zinc-900 border border-zinc-700 border-l-4 border-l-amber-800 px-3 pb-3">
            <div className="text-[11px] uppercase tracking-widest text-amber-600 py-2 border-b border-zinc-700 mb-1">
              Army
            </div>
            <ExportImport />
          </div>
        </aside>

        {/* ── Army list ── */}
        <main>
          <ArmyList />
        </main>
      </div>

      {/* ── Print view ── */}
      {showPrint && <PrintView onClose={() => setShowPrint(false)} />}

      {/* ── Reference modal ── */}
      {showRef && (
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
