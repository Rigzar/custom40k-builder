import { useState } from 'react';
import { useArmyStore } from '../store/army';
import { ArmyConfig } from './ArmyConfig';
import { ChangelogModal } from './ChangelogModal';
import { LegalFooter } from './LegalModal';
import type { SavedArmy } from '../hooks/useSavedArmies';
import { CHANGELOG } from '../data/changelog';

const ANNOUNCEMENT_KEY = 'c40k_announcement_v3_dismissed';

function CommunityAnnouncement() {
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(ANNOUNCEMENT_KEY) === 'true'
  );
  if (dismissed) return null;
  return (
    <div className="bg-zinc-900 border-l-4 border-amber-700 border border-zinc-700 px-5 py-4 mb-6">
      <div className="flex justify-between items-start gap-4">
        <div className="text-[11px] text-amber-600 uppercase tracking-widest font-semibold mb-2">
          Developer Update — from rigzar
        </div>
        <button
          onClick={() => { localStorage.setItem(ANNOUNCEMENT_KEY, 'true'); setDismissed(true); }}
          className="text-zinc-600 hover:text-zinc-300 text-lg leading-none shrink-0"
          title="Dismiss"
        >
          ×
        </button>
      </div>
      <div className="text-[12px] text-zinc-300 leading-relaxed space-y-2">
        <p>
          Hello everyone! I'm rigzar. The engine required to properly support{' '}
          <strong className="text-amber-400">Archetypes</strong>,{' '}
          <strong className="text-amber-400">Legacies</strong>, and <strong className="text-amber-400">Traits</strong>{' '}
          is significantly more complex than expected — every faction has unique rules, stat changes, abilities
          and restrictions that all need to interact correctly. I'm building it faction by faction.
        </p>
        <p>
          <strong className="text-emerald-400">✓ Chaos Space Marines</strong> — fully implemented.
          Archetypes, Legacies, Traits, Black Crusade, armory and all engine rules are live.
        </p>
        <p>
          <strong className="text-emerald-400">✓ Chaos Daemons</strong> — fully implemented.
          All 6 archetypes, Entourage / Herald / Bound Beast slot rules, god disciplines, psyker
          access per unit, mark restrictions, and all weapon profiles are live. Needs player testing.
        </p>
        <p>
          <strong className="text-orange-400">→ Space Marines</strong> — currently under review.
          Archetypes, Legacies and Traits are now active. Report any issues you find!
        </p>
        <p>
          <strong className="text-zinc-200">What this means:</strong>{' '}
          Archetype, Legacy, and Trait selection is temporarily{' '}
          <span className="text-amber-500">disabled for all other factions</span>.
          Army building (units, equipment, points) remains fully functional for everyone.
        </p>
        <p>
          Bugs and suggestions for any faction stay on the list. Thank you for your patience!
        </p>
      </div>
    </div>
  );
}

/** yellow = needs player testing · orange = en revisión · red = not yet reviewed */
type FactionStatus = 'testing' | 'inreview' | 'unreviewed';

interface FactionDef {
  key: string;
  name: string;
  available: boolean;
  status: FactionStatus;
}

interface Category {
  name: string;
  borderColor: string;
  labelColor: string;
  factions: FactionDef[];
}

const STATUS_BADGE: Record<FactionStatus, { dot: string; label: string; title: string }> = {
  testing:    { dot: 'bg-amber-400',   label: 'text-amber-400',   title: 'Needs player testing' },
  inreview:   { dot: 'bg-orange-500',  label: 'text-orange-400',  title: 'In review' },
  unreviewed: { dot: 'bg-red-500',     label: 'text-red-500',     title: 'Not yet reviewed' },
};

const CATEGORIES: Category[] = [
  {
    name: 'Chaos',
    borderColor: 'border-red-800',
    labelColor: 'text-red-400',
    factions: [
      { key: 'chaos_space_marines', name: 'Chaos Space Marines', available: true, status: 'testing' },
      { key: 'chaos_daemons',       name: 'Chaos Daemons',       available: true, status: 'testing' },
    ],
  },
  {
    name: 'Imperium',
    borderColor: 'border-yellow-700',
    labelColor: 'text-yellow-500',
    factions: [
      { key: 'space_marines',      name: 'Space Marines',      available: true, status: 'inreview' },
      { key: 'imperial_guard',     name: 'Imperial Guard',     available: true, status: 'unreviewed' },
      { key: 'adeptus_mechanicus', name: 'Adeptus Mechanicus', available: true, status: 'unreviewed' },
      { key: 'adeptus_custodes',   name: 'Adeptus Custodes',   available: true, status: 'unreviewed' },
      { key: 'adeptus_sororitas',  name: 'Adeptus Sororitas',  available: true, status: 'unreviewed' },
      { key: 'grey_knights',       name: 'Grey Knights',       available: true, status: 'unreviewed' },
      { key: 'inquisition',        name: 'Inquisition',        available: true, status: 'unreviewed' },
      { key: 'assassins',          name: 'Assassins',          available: true, status: 'unreviewed' },
    ],
  },
  {
    name: 'Xenos',
    borderColor: 'border-green-800',
    labelColor: 'text-green-500',
    factions: [
      { key: 'tau_empire',        name: 'Tau Empire',         available: true, status: 'unreviewed' },
      { key: 'necrons',           name: 'Necrons',            available: true, status: 'unreviewed' },
      { key: 'orks',              name: 'Orks',               available: true, status: 'unreviewed' },
      { key: 'eldar',             name: 'Eldar',              available: true, status: 'unreviewed' },
      { key: 'dark_eldar',        name: 'Dark Eldar',         available: true, status: 'unreviewed' },
      { key: 'genestealer_cults', name: 'Genestealer Cults',  available: true, status: 'unreviewed' },
      { key: 'harlequins',        name: 'Harlequins',         available: true, status: 'unreviewed' },
      { key: 'leagues_of_votann', name: 'Leagues of Votann',  available: true, status: 'unreviewed' },
      { key: 'tyranids',          name: 'Tyranids',           available: true, status: 'unreviewed' },
    ],
  },
];

function formatDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
}

interface Props {
  selectedFaction: string | null;
  loading: boolean;
  saves: SavedArmy[];
  onSelectFaction: (key: string) => void;
  onBuild: () => void;
  onLoadArmy: (save: SavedArmy) => void;
  onDeleteArmy: (id: string) => void;
  onShowChangelog: () => void;
}

export function LandingPage({
  selectedFaction, loading, saves,
  onSelectFaction, onBuild, onLoadArmy, onDeleteArmy, onShowChangelog,
}: Props) {
  const { data } = useArmyStore();
  const [showChangelog, setShowChangelog] = useState(false);
  const latestVersion = CHANGELOG[0]?.version ?? '';

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <header className="bg-zinc-900 border-b-2 border-amber-900/60 px-6 py-5">
        <div className="flex items-center justify-between max-w-screen-lg mx-auto">
          <div className="flex-1 text-center">
            <h1 className="text-amber-500 font-bold uppercase tracking-widest text-2xl mb-1">
              Custom40k Army Builder
            </h1>
            <p className="text-zinc-500 text-sm">
              Select your faction and configure your army to begin
            </p>
          </div>
          <button
            onClick={() => { setShowChangelog(true); onShowChangelog(); }}
            className="shrink-0 ml-4 text-[11px] uppercase tracking-wide border border-zinc-700 hover:border-amber-800 text-zinc-400 hover:text-amber-400 px-3 py-1.5 transition-colors"
          >
            Updates <span className="text-amber-700">v{latestVersion}</span>
          </button>
        </div>
      </header>

      {showChangelog && <ChangelogModal onClose={() => setShowChangelog(false)} />}

      <div className="max-w-screen-lg mx-auto px-4 py-8 space-y-10">

        <CommunityAnnouncement />

        {/* ── Saved armies ── */}
        {saves.length > 0 && (
          <section>
            <h2 className="text-[11px] uppercase tracking-widest text-amber-700 mb-4">
              Saved Armies
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {saves.map(save => (
                <div
                  key={save.id}
                  className="bg-zinc-900 border border-zinc-700 border-l-4 border-l-amber-800 p-3 flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between gap-2 min-w-0">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-zinc-100 truncate">{save.name}</div>
                      <div className="text-[10px] text-amber-700 uppercase tracking-wide mt-0.5">{save.factionLabel}</div>
                    </div>
                    <button
                      onClick={() => onDeleteArmy(save.id)}
                      className="text-zinc-600 hover:text-red-400 text-lg leading-none shrink-0 transition-colors"
                      title="Delete save"
                    >
                      ×
                    </button>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                    <span>{save.unitCount} units</span>
                    <span>·</span>
                    <span>{save.totalPts} pts</span>
                    <span>·</span>
                    <span>{formatDate(save.savedAt)}</span>
                  </div>

                  <button
                    onClick={() => onLoadArmy(save)}
                    className="mt-1 w-full text-center text-[11px] uppercase tracking-wide py-1.5 bg-amber-900/30 border border-amber-800/60 text-amber-400 hover:bg-amber-800/40 transition-colors"
                  >
                    Load Army
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Faction selection ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[11px] uppercase tracking-widest text-amber-700">Faction</h2>
            <div className="flex items-center gap-3 text-[10px] text-zinc-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Needs testing</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500 inline-block" /> In review</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Not reviewed</span>
            </div>
          </div>
          <div className="space-y-6">
            {CATEGORIES.map(cat => (
              <div key={cat.name}>
                <div className={`text-[10px] uppercase tracking-widest mb-2 font-semibold ${cat.labelColor}`}>
                  {cat.name}
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.factions.map(f => {
                    const isSelected = selectedFaction === f.key;
                    const badge = STATUS_BADGE[f.status];
                    return (
                      <button
                        key={f.key}
                        onClick={() => f.available && onSelectFaction(f.key)}
                        disabled={!f.available}
                        className={`
                          relative px-4 py-3 border-2 text-sm transition-all text-left min-w-[160px]
                          ${!f.available
                            ? 'border-zinc-700 bg-zinc-900 text-zinc-600 cursor-not-allowed'
                            : isSelected
                              ? `${cat.borderColor} bg-zinc-800 text-amber-400 ring-1 ring-amber-700`
                              : `${cat.borderColor} bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100`
                          }
                        `}
                      >
                        {/* Status badge */}
                        {f.available && (
                          <div
                            className="absolute top-1.5 right-1.5 flex items-center gap-1"
                            title={badge.title}
                          >
                            <div className={`w-2 h-2 rounded-full ${badge.dot}`} />
                          </div>
                        )}
                        <div className="font-semibold">{f.name}</div>
                        {!f.available && (
                          <div className="text-[10px] text-zinc-600 mt-0.5">Coming soon</div>
                        )}
                        {f.available && isSelected && (
                          <div className="text-[10px] text-amber-600 mt-0.5">Selected</div>
                        )}
                        {f.available && !isSelected && (
                          <div className={`text-[10px] mt-0.5 ${badge.label}`}>{badge.title}</div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Army configuration — shown after faction selected ── */}
        {selectedFaction && (
          <section>
            <h2 className="text-[11px] uppercase tracking-widest text-amber-700 mb-4">
              Army Configuration
            </h2>

            {loading || !data ? (
              <div className="flex items-center gap-3 text-zinc-500 py-8">
                <div className="w-5 h-5 border-2 border-amber-700 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Loading faction data…</span>
              </div>
            ) : (
              <div className="bg-zinc-900 border border-zinc-700 border-l-4 border-l-amber-800 p-4">
                <ArmyConfig />
              </div>
            )}
          </section>
        )}

        {/* ── Build button ── */}
        {data && selectedFaction && (
          <div className="flex justify-center pt-2">
            <button
              onClick={onBuild}
              className="px-10 py-3 bg-amber-800 border-2 border-amber-600 text-white font-bold uppercase tracking-widest text-sm hover:bg-amber-700 transition-colors"
            >
              Build Army ▶
            </button>
          </div>
        )}

        {/* ── Supplements ── */}
        <section>
          <h2 className="text-[11px] uppercase tracking-widest text-amber-700 mb-1">Supplements</h2>
          <p className="text-zinc-600 text-[11px] mb-4">
            Expansion rule sets that add new units and options to the core game.
          </p>
          <div className="flex flex-wrap gap-3">

            {/* Horus Heresy */}
            <div className="bg-zinc-900 border-2 border-zinc-700 border-l-4 border-l-red-900 p-4 min-w-[220px] flex-1 max-w-xs flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-zinc-100 font-bold text-sm uppercase tracking-wide">Horus Heresy</div>
                  <div className="text-red-700 text-[10px] uppercase tracking-widest mt-0.5">Space Marines</div>
                </div>
                <span className="text-[10px] border border-green-800 text-green-600 px-1.5 py-0.5 uppercase tracking-wide shrink-0">Available</span>
              </div>
              <p className="text-zinc-500 text-[12px] leading-snug">
                Legiones Astartes at the dawn of the Heresy. Full unit roster, Legion armory, and psychic disciplines.
              </p>
              <button
                onClick={() => onSelectFaction('horus_heresy')}
                className="mt-auto w-full text-center text-[11px] uppercase tracking-wide py-1.5 bg-red-900/20 border border-red-900/50 text-red-400 hover:bg-red-900/40 transition-colors"
              >
                Browse Supplement ▶
              </button>
            </div>

            {/* Escalation — Coming Soon */}
            <div className="bg-zinc-900 border-2 border-zinc-800 border-l-4 border-l-zinc-700 p-4 min-w-[220px] flex-1 max-w-xs flex flex-col gap-2 opacity-60">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-zinc-400 font-bold text-sm uppercase tracking-wide">Escalation</div>
                  <div className="text-zinc-600 text-[10px] uppercase tracking-widest mt-0.5">Lords of War</div>
                </div>
                <span className="text-[10px] border border-zinc-700 text-zinc-600 px-1.5 py-0.5 uppercase tracking-wide shrink-0">Coming Soon</span>
              </div>
              <p className="text-zinc-600 text-[12px] leading-snug">
                Super-heavy vehicles, Lords of War, and Titans for all factions. New engagement rules for massive battles.
              </p>
              <div className="mt-auto w-full text-center text-[11px] uppercase tracking-wide py-1.5 border border-zinc-800 text-zinc-700 cursor-not-allowed">
                Not Yet Available
              </div>
            </div>

          </div>
        </section>
      </div>

      <LegalFooter />
    </div>
  );
}
