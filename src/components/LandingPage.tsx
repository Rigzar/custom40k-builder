import { useArmyStore } from '../store/army';
import { ArmyConfig } from './ArmyConfig';
import type { SavedArmy } from '../hooks/useSavedArmies';

interface FactionDef {
  key: string;
  name: string;
  available: boolean;
}

interface Category {
  name: string;
  borderColor: string;
  labelColor: string;
  factions: FactionDef[];
}

const CATEGORIES: Category[] = [
  {
    name: 'Chaos',
    borderColor: 'border-red-800',
    labelColor: 'text-red-400',
    factions: [
      { key: 'chaos_space_marines', name: 'Chaos Space Marines', available: true },
      { key: 'chaos_daemons',       name: 'Chaos Daemons',       available: true },
    ],
  },
  {
    name: 'Imperium',
    borderColor: 'border-yellow-700',
    labelColor: 'text-yellow-500',
    factions: [
      { key: 'space_marines',      name: 'Space Marines',      available: true },
      { key: 'imperial_guard',     name: 'Imperial Guard',     available: true },
      { key: 'adeptus_mechanicus', name: 'Adeptus Mechanicus', available: true },
      { key: 'adeptus_custodes',   name: 'Adeptus Custodes',   available: true },
      { key: 'adeptus_sororitas',  name: 'Adeptus Sororitas',  available: true },
      { key: 'grey_knights',       name: 'Grey Knights',       available: true },
      { key: 'inquisition',        name: 'Inquisition',        available: true },
      { key: 'assassins',          name: 'Assassins',          available: true },
    ],
  },
  {
    name: 'Xenos',
    borderColor: 'border-green-800',
    labelColor: 'text-green-500',
    factions: [
      { key: 'tau_empire',        name: 'Tau Empire',         available: true },
      { key: 'necrons',           name: 'Necrons',            available: true },
      { key: 'orks',              name: 'Orks',               available: true },
      { key: 'eldar',             name: 'Eldar',              available: true },
      { key: 'dark_eldar',        name: 'Dark Eldar',         available: true },
      { key: 'genestealer_cults', name: 'Genestealer Cults',  available: true },
      { key: 'harlequins',        name: 'Harlequins',         available: true },
      { key: 'leagues_of_votann', name: 'Leagues of Votann',  available: true },
    ],
  },
  {
    name: 'Supplement',
    borderColor: 'border-zinc-600',
    labelColor: 'text-zinc-400',
    factions: [
      { key: 'horus_heresy', name: 'Horus Heresy Space Marines', available: true },
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
}

export function LandingPage({
  selectedFaction, loading, saves,
  onSelectFaction, onBuild, onLoadArmy, onDeleteArmy,
}: Props) {
  const { data } = useArmyStore();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="bg-zinc-900 border-b-2 border-amber-900/60 px-6 py-5 text-center">
        <h1 className="text-amber-500 font-bold uppercase tracking-widest text-2xl mb-1">
          Custom40k Army Builder
        </h1>
        <p className="text-zinc-500 text-sm">
          Select your faction and configure your army to begin
        </p>
      </header>

      <div className="max-w-screen-lg mx-auto px-4 py-8 space-y-10">

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
          <h2 className="text-[11px] uppercase tracking-widest text-amber-700 mb-4">
            Faction
          </h2>
          <div className="space-y-6">
            {CATEGORIES.map(cat => (
              <div key={cat.name}>
                <div className={`text-[10px] uppercase tracking-widest mb-2 font-semibold ${cat.labelColor}`}>
                  {cat.name}
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.factions.map(f => {
                    const isSelected = selectedFaction === f.key;
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
                        <div className="font-semibold">{f.name}</div>
                        {!f.available && (
                          <div className="text-[10px] text-zinc-600 mt-0.5">Coming soon</div>
                        )}
                        {f.available && isSelected && (
                          <div className="text-[10px] text-amber-600 mt-0.5">Selected</div>
                        )}
                        {f.available && !isSelected && (
                          <div className="text-[10px] text-zinc-500 mt-0.5">Available</div>
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
      </div>
    </div>
  );
}
