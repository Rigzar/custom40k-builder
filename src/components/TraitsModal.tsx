import { useState } from 'react';
import type { RosterEntry } from '../types/army';
import type { Unit } from '../types/data';
import { useArmyStore } from '../store/army';

interface Props {
  item: RosterEntry;
  unit: Unit;
  markUsesSlot?: boolean;
  onClose: () => void;
}

/**
 * Conflict-resolution modal: shown only when the army has more unit traits than
 * this unit's effective veteran-ability slots can hold. The player chooses which
 * subset of the army's unit traits to assign to this unit.
 */
export function TraitsModal({ item, unit, markUsesSlot = false, onClose }: Props) {
  const { data, traitPool, setUnitTraitChoice } = useArmyStore();
  if (!data) return null;

  const maxTraits = Math.max(0, (unit.veteran_max ?? 2) - (markUsesSlot ? 1 : 0));

  // Only show unit traits (those with per-unit costs)
  const unitTraitDefs = data.traits.filter(t => {
    if (!traitPool.includes(t.name)) return false;
    // Children of Prophecy (Eldar): "Only for Psykers" — hide for non-psyker units
    if (t.name === 'Children of Prophecy' && !unit.is_psyker) return false;
    // Iron Within, Iron Without (CSM): "Only for creature models that do not already have an
    // invulnerability save" — hide for creature units whose datasheet already grants one
    if (t.name === 'Iron Within, Iron Without' && !unit.is_vehicle) {
      const hasInvSave = (unit.abilities ?? []).some(a => /invulnerab(le|ility) save/i.test(a));
      if (hasInvSave) return false;
    }
    return [t.pts_unit, t.pts_char, t.pts_veh].some(
      v => v && v !== '-' && v.toLowerCase() !== 'special',
    );
  });

  const [selected, setSelected] = useState<string[]>(
    item.traits.map(t => t.name),
  );

  function toggle(name: string) {
    setSelected(prev => {
      if (prev.includes(name)) return prev.filter(n => n !== name);
      if (prev.length >= maxTraits) return prev;
      return [...prev, name];
    });
  }

  function save() {
    setUnitTraitChoice(item.id, selected);
    onClose();
  }

  const atMax = selected.length >= maxTraits;

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-start justify-center z-50 p-6 overflow-y-auto"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-zinc-900 border-2 border-amber-800 w-full max-w-xl flex flex-col max-h-[80vh]">
        <div className="flex justify-between items-center px-4 py-3 bg-zinc-800 border-b border-amber-800">
          <h3 className="text-amber-400 uppercase tracking-widest text-sm">
            Traits — {unit.name} ({selected.length}/{maxTraits})
          </h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-xl">✕</button>
        </div>

        <div className="px-4 py-2 bg-zinc-800/50 border-b border-zinc-700 text-[11px] text-zinc-400">
          This unit can only take <span className="text-amber-400">{maxTraits}</span> of the{' '}
          {unitTraitDefs.length} army traits. Choose which to apply.
          {markUsesSlot && (
            <span className="text-zinc-500 ml-1">(1 slot = Mark)</span>
          )}
        </div>

        <div className="overflow-y-auto flex-1 p-3 space-y-1">
          {unitTraitDefs.map(t => {
            const isSelected = selected.includes(t.name);
            const raw = unit.is_vehicle ? t.pts_veh : unit.is_character ? t.pts_char : t.pts_unit;
            const applicable = raw && raw !== '-' && raw.toLowerCase() !== 'special';
            return (
              <button
                key={t.name}
                onClick={() => applicable && toggle(t.name)}
                disabled={!isSelected && (atMax || !applicable)}
                className={`w-full flex justify-between items-start px-3 py-2 border text-left gap-2 transition-colors
                  ${isSelected
                    ? 'bg-amber-900/30 border-amber-700 text-amber-300'
                    : !applicable
                      ? 'bg-zinc-800 border-zinc-700 opacity-30 cursor-not-allowed'
                      : atMax
                        ? 'bg-zinc-800 border-zinc-700 opacity-40 cursor-not-allowed'
                        : 'bg-zinc-800 border-zinc-700 hover:border-amber-700 hover:bg-zinc-700 text-zinc-200'
                  }`}
              >
                <div>
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">{t.desc}</div>
                  {!applicable && (
                    <div className="text-[10px] text-zinc-600 mt-0.5 italic">Not applicable to this unit type</div>
                  )}
                </div>
                {applicable && (
                  <span className="text-amber-500 font-bold text-sm whitespace-nowrap">+{raw} pts</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="px-4 py-3 border-t border-zinc-700 flex justify-between bg-zinc-800">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-700 border border-zinc-600 text-zinc-200 text-sm hover:bg-zinc-600 uppercase tracking-wide"
          >
            Cancel
          </button>
          <button
            onClick={save}
            className="px-4 py-1.5 bg-amber-800 border border-amber-600 text-white text-sm hover:bg-amber-700 uppercase tracking-wide"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
