import { useArmyStore } from '../store/army';
import { UnitCard } from './UnitCard';
import { SLOT_ORDER } from '../engine/engagements';
import { getArchetypeRule, getEffectiveSlot } from '../engine/archetypes';
import { applyVariantSlotOverride } from '../engine/slotOverrides';
import { resolveUnit, computeUnitPoints } from '../engine/points';

const SLOT_LABELS: Record<string, string> = {
  'HQ':                   'HQ',
  'Troops':               'Troops',
  'Elites':               'Elites',
  'Fast Attack':          'Fast Attack',
  'Heavy Support':        'Heavy Support',
  'Dedicated Transport':  'Dedicated Transport',
  'Fortifications':       'Fortifications',
  'Flyers':               'Flyers',
  'Lords of War':         'Lords of War',
};

export function ArmyList() {
  const { army, data, archetype } = useArmyStore();
  if (!data) return null;

  if (army.length === 0) {
    return (
      <div className="text-center text-zinc-600 mt-20 italic text-sm">
        No units yet. Add units from the catalogue.
      </div>
    );
  }

  const rule = getArchetypeRule(archetype);

  return (
    <div>
      {SLOT_ORDER.map(slot => {
        const slotUnits = army.filter(item => {
          const u = data.units[item.unitName];
          return applyVariantSlotOverride(item, u, getEffectiveSlot(item.unitName, item.slot, rule)) === slot;
        });
        if (slotUnits.length === 0) return null;

        const slotPts = slotUnits.reduce((s, item) => {
          const u = resolveUnit(item, data);
          return s + (u ? computeUnitPoints(item, u, archetype) : 0);
        }, 0);

        return (
          <div key={slot} className="mb-6">
            <div className="flex justify-between items-center mb-2 pb-1 border-b-2 border-amber-900/50">
              <span className="text-amber-600 uppercase tracking-widest text-[12px] font-bold">
                {SLOT_LABELS[slot] ?? slot}
              </span>
              <span className="text-zinc-500 text-[11px]">
                {slotUnits.length} {slotUnits.length === 1 ? 'unit' : 'units'} · {slotPts} pts
              </span>
            </div>
            {slotUnits.map(item => <UnitCard key={item.id} item={item} />)}
          </div>
        );
      })}
    </div>
  );
}
