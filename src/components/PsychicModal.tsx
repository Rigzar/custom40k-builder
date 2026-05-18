import { useState } from 'react';
import type { RosterEntry } from '../types/army';
import type { Unit, Power } from '../types/data';
import { useArmyStore } from '../store/army';
import { getArchetypeRule } from '../engine/archetypes';

interface Props { item: RosterEntry; unit: Unit; onClose: () => void; }

type ModalTab = 'powers' | 'prayers';

const MARK_NAMES = ['khorne', 'tzeentch', 'nurgle', 'slaanesh'] as const;

/** True when the discipline name explicitly restricts itself to one mark (e.g. "Change (Tzeentch only)"). */
function isMarkOnlyDisc(name: string): boolean {
  const lc = name.toLowerCase();
  return MARK_NAMES.some(m => lc.includes(m) && lc.includes('only'));
}

/** True when the discipline is for "Cult initiates only" (not mark-based). */
function isCultOnlyDisc(name: string): boolean {
  const lc = name.toLowerCase();
  return lc.includes('cult') && lc.includes('only');
}

export function PsychicModal({ item, unit, onClose }: Props) {
  const { data, archetype, addPower, removePower, addPrayer, removePrayer } = useArmyStore();
  if (!data) return null;

  const rule = getArchetypeRule(archetype);
  const effectiveMark = unit.locked_mark ?? (rule?.forcedMark ?? null) ?? item.mark;
  const hasPrayers = unit.is_priest && (data.prayers ?? []).length > 0;
  const hasPowers = unit.is_psyker && Object.keys(data.disciplines ?? {}).length > 0;

  const [tab, setTab] = useState<ModalTab>(hasPowers ? 'powers' : 'prayers');

  // ── Discipline filtering ──────────────────────────────────────────────────
  // Fixed logic:
  // 1. Mark-only disciplines (e.g. "Change (Tzeentch only)"): only for psykers with that mark
  // 2. Cult-only disciplines: only for units with a specific (non-Undivided) locked mark
  // 3. Everything else: available to all psykers
  const allowedDiscs = Object.entries(data.disciplines ?? {}).filter(([name]) => {
    if (isMarkOnlyDisc(name)) {
      // Must have the matching specific mark
      if (!effectiveMark || effectiveMark === 'Undivided') return false;
      const lc = name.toLowerCase();
      return MARK_NAMES.some(m => lc.includes(m) && effectiveMark.toLowerCase() === m);
    }
    if (isCultOnlyDisc(name)) {
      // Only for locked-mark cult units
      return !!(unit.locked_mark && unit.locked_mark !== 'Undivided');
    }
    // General disciplines — available to all psykers
    return true;
  });

  function isPowerSelected(disc: string, power: string) {
    return item.powers.some(p => p.disciplineName === disc && p.powerName === power);
  }

  function togglePower(disc: string, power: string) {
    if (isPowerSelected(disc, power)) removePower(item.id, disc, power);
    else addPower(item.id, disc, power);
  }

  function isPrayerSelected(prayerName: string) {
    return item.prayers.includes(prayerName);
  }

  function togglePrayer(prayerName: string) {
    if (isPrayerSelected(prayerName)) removePrayer(item.id, prayerName);
    else addPrayer(item.id, prayerName);
  }

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-start justify-center z-50 p-6 overflow-y-auto"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-zinc-900 border-2 border-amber-800 w-full max-w-2xl flex flex-col max-h-[85vh]">
        <div className="flex justify-between items-center px-4 py-3 bg-zinc-800 border-b border-amber-800">
          <h3 className="text-amber-400 uppercase tracking-widest text-sm">
            {hasPowers && hasPrayers ? 'Powers & Prayers' : hasPrayers ? 'Prayers' : 'Psychic Powers'} — {unit.name}
          </h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-xl">✕</button>
        </div>

        {/* Tab selector — only shown when unit has both powers and prayers */}
        {hasPowers && hasPrayers && (
          <div className="flex border-b border-zinc-700">
            {(['powers', 'prayers'] as ModalTab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-[11px] uppercase tracking-wide border-b-2 transition-colors
                  ${tab === t
                    ? 'border-amber-600 text-amber-400'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
              >
                {t === 'powers'
                  ? `Psychic Powers (${item.powers.length})`
                  : `Prayers (${item.prayers.length})`
                }
              </button>
            ))}
          </div>
        )}

        <div className="overflow-y-auto flex-1 p-3 space-y-4">
          {/* ── Psychic Powers ── */}
          {(tab === 'powers' || !hasPrayers) && hasPowers && (
            allowedDiscs.length === 0 ? (
              <div className="text-zinc-500 italic text-sm text-center py-8">
                No disciplines available for this unit's mark.
              </div>
            ) : (
              allowedDiscs.map(([discName, powers]) => (
                <div key={discName}>
                  <div className="text-[11px] text-amber-700 uppercase tracking-widest border-b border-zinc-700 pb-1 mb-2">
                    {discName}
                  </div>
                  <div className="space-y-1">
                    {(powers as Power[]).map(p => {
                      const sel = isPowerSelected(discName, p.name);
                      return (
                        <button
                          key={p.name}
                          onClick={() => togglePower(discName, p.name)}
                          className={`w-full text-left px-3 py-2 border transition-colors
                            ${sel
                              ? 'bg-amber-900/30 border-amber-700 text-amber-300'
                              : 'bg-zinc-800 border-zinc-700 hover:border-amber-700 hover:bg-zinc-700 text-zinc-200'
                            }`}
                        >
                          <div className="text-sm font-medium">{p.name}</div>
                          <div className="text-[10px] text-zinc-500 mt-0.5">
                            {[p.type, p.range, p.cast_value ? `Cast: ${p.cast_value}` : null]
                              .filter(Boolean).join(' · ')}
                          </div>
                          {p.effect && (
                            <div className="text-[11px] text-zinc-400 mt-1">{p.effect}</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )
          )}

          {/* ── Prayers ── */}
          {(tab === 'prayers' || !hasPowers) && hasPrayers && (
            <div className="space-y-1">
              {(data.prayers as Power[]).map(p => {
                const sel = isPrayerSelected(p.name);
                return (
                  <button
                    key={p.name}
                    onClick={() => togglePrayer(p.name)}
                    className={`w-full text-left px-3 py-2 border transition-colors
                      ${sel
                        ? 'bg-amber-900/30 border-amber-700 text-amber-300'
                        : 'bg-zinc-800 border-zinc-700 hover:border-amber-700 hover:bg-zinc-700 text-zinc-200'
                      }`}
                  >
                    <div className="text-sm font-medium">{p.name}</div>
                    {p.effect && (
                      <div className="text-[11px] text-zinc-400 mt-1">{p.effect}</div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-4 py-3 border-t border-zinc-700 flex justify-end bg-zinc-800">
          <button onClick={onClose} className="px-4 py-1.5 bg-zinc-700 border border-zinc-600 text-zinc-200 text-sm hover:bg-zinc-600 uppercase tracking-wide">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
