import { useArmyStore } from '../store/army';
import { UnitCard } from './UnitCard';
import { SLOT_ORDER } from '../engine/engagements';
import { getArchetypeRule, getEffectiveSlot } from '../engine/archetypes';
import { applyVariantSlotOverride } from '../engine/slotOverrides';
import { resolveUnit, computeUnitPoints } from '../engine/points';
import { SLOT_ICONS } from '../assets/slotIcons';

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

const SLOT_ICON_STYLE: React.CSSProperties = {
  filter: 'brightness(0) invert(1) sepia(1) saturate(2) hue-rotate(-10deg)',
  opacity: 0.65,
};

export function ArmyList() {
  const { army, data, archetype } = useArmyStore();
  if (!data) return null;

  if (army.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center select-none">
        <div className="text-[42px] mb-4 opacity-20">⚔</div>
        <div className="font-cinzel text-[11px] uppercase tracking-widest text-zinc-600">No units deployed</div>
        <div className="text-zinc-700 text-[11px] mt-1.5">Add units from the catalogue on the left.</div>
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
            <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-amber-900/40">
              {SLOT_ICONS[slot] && (
                <img src={SLOT_ICONS[slot]} alt="" className="w-4 h-4 shrink-0" style={SLOT_ICON_STYLE} />
              )}
              <span className="font-cinzel text-amber-600/90 uppercase tracking-widest text-[11px] flex-1">
                {SLOT_LABELS[slot] ?? slot}
              </span>
              <span className="text-zinc-500 text-[11px] tabular-nums">
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
