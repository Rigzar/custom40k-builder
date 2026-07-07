import { useEffect, useState } from 'react';
import type { Unit, Weapon, Model, Armory } from '../types/data';

// Read-only, store-free catalog of a supplement's contents. It NEVER mutates army
// state — it only informs (what the supplement brings + how to activate it) and lets
// the user browse each unit's ficha. Activation stays where the rules put it:
// Horus Heresy = pick the Legion archetype; Escalation/Lords of War = Epic Battle engagement.

export type SupplementKey = 'horus_heresy' | 'escalation' | 'assassins';

interface SupplementDef {
  title: string;
  subtitle: string;
  accentTop: string;   // top border color class
  accentText: string;  // text color class for subtitle
  blurb: string;
  activation: string[]; // bullet steps
  load: () => Promise<{ units: Record<string, Unit>; slots: Record<string, string[]>; armory?: Armory; armoryNote?: string }>;
}

const STAT_KEYS_INF = ['M', 'WS', 'BS', 'S', 'T', 'W', 'I', 'A', 'LD', 'SV'] as const;
const STAT_KEYS_VEH = ['M', 'BS', 'S', 'FRONT', 'SIDE', 'REAR', 'I', 'A', 'HP'] as const;

const SUPPLEMENTS: Record<SupplementKey, SupplementDef> = {
  horus_heresy: {
    title: 'Horus Heresy',
    subtitle: 'Space Marines supplement',
    accentTop: 'border-t-red-800',
    accentText: 'text-red-600',
    blurb:
      'Legiones Astartes at the dawn of the Heresy — a full Legion roster, its own armory and ' +
      'psychic disciplines. These are not an allied faction: when activated, the Legion units count ' +
      'as your own, and their Troops count toward the 25% minimum.',
    activation: [
      'Pick a Chaos Space Marines (or Space Marines) army.',
      'In Army Configuration, choose the **Legion** archetype.',
      'The Horus Heresy units and armory are injected into your roster automatically.',
    ],
    load: async () => {
      const m = (await import('../../data/parsed/_supplements/horus_heresy.json')) as { default: any };
      const j = m.default;
      return {
        units: j.units,
        slots: j.slot_to_units,
        armory: j.armory_general as Armory,
        armoryNote: 'Granted army-wide via the Legion archetype (shared Horus Heresy armory).',
      };
    },
  },
  assassins: {
    title: 'Assassins',
    subtitle: '"Cults Abominatioe" / "Execution Force"',
    accentTop: 'border-t-zinc-500',
    accentText: 'text-zinc-400',
    blurb:
      'A 4-unit catalog (Callidus, Culexus, Eversor, Vindicare) — not a standalone playable ' +
      'army. Their own datasheet carries two universal special rules: "Cults Abominatioe": ' +
      '"Any Chaos army may select either a single Assassin or one of each for a single Elite ' +
      'slot." / "Execution Force": "Any Imperial army may select either a single Assassin or ' +
      'one of each for a single Elite slot." Whichever combination is taken — one Assassin of ' +
      'any type, or one of each of the four — occupies a SINGLE Elite slot, not one each.',
    activation: [
      'Pick any Chaos army (Chaos Space Marines, Chaos Daemons) or any Imperial army (Space Marines, Imperial Guard, Adeptus Mechanicus, Adeptus Custodes, Adeptus Sororitas, Grey Knights, Inquisition) — the Assassins\' own datasheet grants native access (no [Allied] badge, no separate selection step).',
      'The 4 Assassin units appear directly in your Elites roster, grouped under a "Cults Abominatioe" (Chaos) or "Execution Force" (Imperial) header.',
      'Take either a single Assassin (any one of the four types) or one of each — the engine enforces this and counts the whole selection as one Elite slot.',
    ],
    load: async () => {
      const m = await import('../../data/parsed/assassins/units/index');
      return { units: m.units, slots: m.slot_to_units };
    },
  },
  escalation: {
    title: 'Escalation',
    subtitle: 'Lords of War',
    accentTop: 'border-t-amber-700',
    accentText: 'text-amber-600',
    blurb:
      'Super-heavy vehicles, Knights and Titans. Lords of War are unlocked by the largest ' +
      'engagement and are capped at 33% of your total points. Available for Chaos Space Marines, ' +
      'Space Marines, Imperial Guard, Adeptus Sororitas, Eldar, Orks, Necrons and Tau Empire.',
    activation: [
      'Select the **Epic Battle** engagement (4000+ pts) in Army Configuration.',
      'The Lords of War slot unlocks — pick from your faction\'s super-heavy roster.',
      'Total Lords of War spend may not exceed 33% of the army points.',
    ],
    load: async () => {
      const sources: { faction: string; load: () => Promise<{ units: Record<string, Unit>; slot_to_units: Record<string, string[]> }> }[] = [
        { faction: 'Chaos Space Marines', load: async () => {
          const idx = await import('../../data/parsed/chaos_space_marines/units/index');
          return { units: idx.units, slot_to_units: idx.slot_to_units };
        } },
        { faction: 'Space Marines', load: async () => {
          const idx = await import('../../data/parsed/space_marines/units/index');
          return { units: idx.units, slot_to_units: idx.slot_to_units };
        } },
        { faction: 'Adeptus Sororitas', load: async () => {
          const idx = await import('../../data/parsed/adeptus_sororitas/units/index');
          return { units: idx.units, slot_to_units: idx.slot_to_units };
        } },
        { faction: 'Imperial Guard', load: async () => {
          const idx = await import('../../data/parsed/imperial_guard/units/index');
          return { units: idx.units, slot_to_units: idx.slot_to_units };
        } },
        { faction: 'Eldar', load: async () => {
          const idx = await import('../../data/parsed/eldar/units/index');
          return { units: idx.units, slot_to_units: idx.slot_to_units };
        } },
        { faction: 'Orks', load: async () => {
          const idx = await import('../../data/parsed/orks/units/index');
          return { units: idx.units, slot_to_units: idx.slot_to_units };
        } },
        { faction: 'Necrons', load: async () => {
          const idx = await import('../../data/parsed/necrons/units/index');
          return { units: idx.units, slot_to_units: idx.slot_to_units };
        } },
        { faction: 'Tau Empire', load: async () => {
          const idx = await import('../../data/parsed/tau_empire/units/index');
          return { units: idx.units, slot_to_units: idx.slot_to_units };
        } },
      ];

      const units: Record<string, Unit> = {};
      const slots: Record<string, string[]> = {};
      for (const src of sources) {
        const data = await src.load();
        const names: string[] = data.slot_to_units['Lords of War'] ?? [];
        const present = names.filter(n => data.units[n]);
        if (!present.length) continue;
        slots[`Lords of War — ${src.faction}`] = present;
        for (const n of present) units[n] = data.units[n];
      }
      return { units, slots };
    },
  },
};

function renderActivation(step: string) {
  const parts = step.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**')
      ? <strong key={i} className="text-amber-300">{p.slice(2, -2)}</strong>
      : <span key={i}>{p}</span>
  );
}

function StatTable({ unit }: { unit: Unit }) {
  const keys = unit.is_vehicle ? STAT_KEYS_VEH : STAT_KEYS_INF;
  const models: Model[] = unit.models;
  if (!models.length) return null;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[11px] border-collapse">
        <thead>
          <tr className="text-zinc-500 uppercase tracking-wide">
            <th className="text-left font-normal pr-2 pb-1">Model</th>
            {keys.map(k => <th key={k} className="px-1 pb-1 font-normal text-center">{k}</th>)}
            <th className="px-1 pb-1 font-normal text-right">Pts</th>
          </tr>
        </thead>
        <tbody>
          {models.map((m, mi) => (
            <tr key={mi} className="border-t border-zinc-800">
              <td className="text-zinc-200 pr-2 py-1">{m.name}</td>
              {keys.map(k => <td key={k} className="px-1 py-1 text-center text-zinc-300">{m.stats[k] ?? '-'}</td>)}
              <td className="px-1 py-1 text-right text-amber-400">{m.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WeaponTable({ weapons }: { weapons: Weapon[] }) {
  if (!weapons.length) return null;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[11px] border-collapse">
        <thead>
          <tr className="text-zinc-500 uppercase tracking-wide">
            <th className="text-left font-normal pr-2 pb-1">Weapon</th>
            <th className="px-1 pb-1 font-normal text-center">Rng</th>
            <th className="px-1 pb-1 font-normal text-center">Type</th>
            <th className="px-1 pb-1 font-normal text-center">S</th>
            <th className="px-1 pb-1 font-normal text-center">AP</th>
            <th className="px-1 pb-1 font-normal text-center">D</th>
            <th className="text-left px-1 pb-1 font-normal">Abilities</th>
          </tr>
        </thead>
        <tbody>
          {weapons.map((w, wi) => (
            <tr key={wi} className="border-t border-zinc-800">
              <td className="text-zinc-200 pr-2 py-1">{w.name}</td>
              <td className="px-1 py-1 text-center text-zinc-300">{w.range}</td>
              <td className="px-1 py-1 text-center text-zinc-300">{w.type}</td>
              <td className="px-1 py-1 text-center text-zinc-300">{w.s}</td>
              <td className="px-1 py-1 text-center text-zinc-300">{w.ap}</td>
              <td className="px-1 py-1 text-center text-zinc-300">{w.d}</td>
              <td className="px-1 py-1 text-zinc-400">{w.abilities}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UnitFiche({ unit }: { unit: Unit }) {
  return (
    <div className="bg-zinc-950/60 border-t border-zinc-800 px-3 py-3 space-y-3">
      <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-wide">
        <span className="text-zinc-500">Type:</span>
        <span className="text-violet-400">{unit.unit_type}</span>
      </div>

      <StatTable unit={unit} />

      {unit.equipped_with && (
        <p className="text-[11px] text-zinc-400 leading-snug">{unit.equipped_with}</p>
      )}

      <WeaponTable weapons={unit.weapons} />

      {unit.abilities.length > 0 && (
        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-wide text-zinc-500">Abilities</div>
          {unit.abilities.map((a, ai) => (
            <p key={ai} className="text-[11px] text-zinc-400 leading-snug">{a}</p>
          ))}
        </div>
      )}

      {unit.option_groups.length > 0 && (
        <div className="space-y-2">
          <div className="text-[10px] uppercase tracking-wide text-zinc-500">Options</div>
          {unit.option_groups.map((g, gi) => (
            <div key={gi} className="text-[11px]">
              <p className="text-zinc-300 leading-snug">{g.header}</p>
              {g.choices.length > 0 && (
                <ul className="mt-0.5 ml-3 space-y-0.5">
                  {g.choices.map((c, ci) => (
                    <li key={ci} className="text-zinc-500 flex justify-between gap-3">
                      <span>{c.name}</span>
                      <span className="text-amber-700 shrink-0">{c.points >= 0 ? `+${c.points}` : c.points} pts</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface Props {
  supplement: SupplementKey;
  onClose: () => void;
}

export function SupplementModal({ supplement, onClose }: Props) {
  const def = SUPPLEMENTS[supplement];
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<Awaited<ReturnType<SupplementDef['load']>> | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger slide-in on mount
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    def.load()
      .then(c => { if (alive) { setContent(c); setLoading(false); } })
      .catch(e => { console.error('Error loading supplement', e); if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [supplement]);

  // Close with Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <>
      {/* Backdrop — click to close */}
      <div
        className="fixed inset-0 bg-black/60 z-[200]"
        style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.25s ease' }}
        onClick={onClose}
      />

      {/* Drawer — slides in from the right */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-[201] flex flex-col bg-zinc-900 border-l border-zinc-700 border-t-4 ${def.accentTop} shadow-2xl`}
        style={{
          width: 'min(480px, 100vw)',
          transform: visible ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.28s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header — fixed at top of drawer */}
        <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-zinc-800 shrink-0">
          <div>
            <div className="text-zinc-100 font-bold uppercase tracking-widest text-base">{def.title}</div>
            <div className={`${def.accentText} text-[10px] uppercase tracking-widest mt-0.5`}>{def.subtitle}</div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800 transition-colors rounded shrink-0"
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="1" y1="1" x2="13" y2="13" />
              <line x1="13" y1="1" x2="1" y2="13" />
            </svg>
          </button>
        </div>

        {/* Body — the only scrollable area */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

          <p className="text-zinc-400 text-[12px] leading-relaxed">{def.blurb}</p>

          {/* How to activate */}
          <div className="bg-zinc-950/60 border border-zinc-800 px-4 py-3">
            <div className="text-[10px] uppercase tracking-widest text-amber-600 mb-2">How to activate</div>
            <ol className="space-y-1.5 list-decimal list-inside">
              {def.activation.map((step, i) => (
                <li key={i} className="text-[12px] text-zinc-300 leading-snug">{renderActivation(step)}</li>
              ))}
            </ol>
          </div>

          {/* Catalog */}
          <div>
            <div className="text-[10px] uppercase tracking-widest text-amber-700 mb-2">Catalog</div>
            {loading && (
              <div className="flex items-center gap-2 text-zinc-500 text-[12px] py-2">
                <div className="w-3.5 h-3.5 border border-amber-700 border-t-transparent rounded-full animate-spin" />
                Loading…
              </div>
            )}
            {!loading && content && (
              <div className="space-y-4">
                {Object.entries(content.slots).map(([slot, names]) => {
                  const present = names.filter(n => content.units[n]);
                  if (!present.length) return null;
                  return (
                    <div key={slot}>
                      <div className="text-[10px] uppercase tracking-widest text-zinc-600 mb-1">{slot}</div>
                      <div className="border border-zinc-800 divide-y divide-zinc-800">
                        {present.map(name => {
                          const unit = content.units[name];
                          const isOpen = expanded === name;
                          const minPts = unit.min_cost ?? unit.models[0]?.points ?? 0;
                          return (
                            <div key={name}>
                              <button
                                type="button"
                                onClick={() => setExpanded(isOpen ? null : name)}
                                className="w-full flex items-center justify-between gap-3 px-3 py-2 text-left hover:bg-zinc-800/40 transition-colors"
                              >
                                <span className="flex items-center gap-2 min-w-0">
                                  <span className="text-zinc-500 text-[10px] w-3 shrink-0">{isOpen ? '▾' : '▸'}</span>
                                  <span className="text-zinc-100 text-[13px] truncate">{name}</span>
                                  <span className="text-zinc-600 text-[10px] uppercase tracking-wide shrink-0">{unit.unit_type}</span>
                                </span>
                                <span className="text-amber-700 text-[11px] shrink-0">from {minPts} pts</span>
                              </button>
                              {isOpen && <UnitFiche unit={unit} />}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Armory */}
          {!loading && content?.armory && (
            <div>
              <div className="text-[10px] uppercase tracking-widest text-amber-700 mb-1">Armory</div>
              {content.armoryNote && <p className="text-zinc-500 text-[11px] mb-2">{content.armoryNote}</p>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {content.armory.weapons.length > 0 && (
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-zinc-600 mb-1">Weapons</div>
                    <ul className="space-y-0.5">
                      {content.armory.weapons.map((it, i) => (
                        <li key={i} className="text-[11px] text-zinc-400">{it.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {content.armory.equipment.length > 0 && (
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-zinc-600 mb-1">Equipment</div>
                    <ul className="space-y-0.5">
                      {content.armory.equipment.map((it, i) => (
                        <li key={i} className="text-[11px] text-zinc-400">{it.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
