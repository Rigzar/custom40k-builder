import { useArmyStore } from '../store/army';
import { UnitCard } from './UnitCard';
import { SLOT_ORDER } from '../engine/engagements';
import { getArchetypeRule, getEffectiveSlot } from '../engine/archetypes';
import { applyVariantSlotOverride } from '../engine/slotOverrides';
import { applyPlatoonSlotOverride } from '../engine/codex_imperial_guard/platoon';
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

/**
 * `scope` splits the roster view in two — "primary" (the main faction's own army, plus any
 * archetype/legacy-injected intrinsic ally, e.g. CSM's auto-unlocked Chaos Daemons, which shares
 * the primary's own AOP/Customisation) vs "allied" (the player-picked Allied Detachment, which
 * has its own AOP and its own Archetype/Legacy/Traits — Core Rules: "Allied units are treated as
 * separate armies on the battlefield"). Each scope uses its OWN archetype rule for slot-remapping
 * and points, so e.g. a unit promoted to Troops by the ally's own archetype is grouped correctly
 * here too, not by the primary's archetype.
 */
export function ArmyList({ scope = 'primary' }: { scope?: 'primary' | 'allied' }) {
  const { army, data, archetype, alliedFaction, alliedArchetype } = useArmyStore();
  if (!data) return null;

  const scopedArmy = scope === 'allied'
    ? army.filter(item => !!alliedFaction && item.factionSource === alliedFaction)
    : army.filter(item => !alliedFaction || item.factionSource !== alliedFaction);
  const effectiveArchetype = scope === 'allied' ? (alliedArchetype ?? '') : archetype;

  if (scopedArmy.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center select-none">
        <div className="text-[42px] mb-4 opacity-20">⚔</div>
        <div className="font-cinzel text-[11px] uppercase tracking-widest text-zinc-600">No units deployed</div>
        <div className="text-zinc-700 text-[11px] mt-1.5">Add units from the catalogue on the left.</div>
      </div>
    );
  }

  const rule = getArchetypeRule(effectiveArchetype);

  return (
    <div>
      {SLOT_ORDER.map(slot => {
        const slotUnits = scopedArmy.filter(item => {
          const u = resolveUnit(item, data);
          const baseSlot = applyVariantSlotOverride(item, u, getEffectiveSlot(item.unitName, item.slot, rule));
          return applyPlatoonSlotOverride(item, scopedArmy, baseSlot) === slot;
        });
        if (slotUnits.length === 0) return null;

        const slotPts = slotUnits.reduce((s, item) => {
          const u = resolveUnit(item, data);
          return s + (u ? computeUnitPoints(item, u, effectiveArchetype) : 0);
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
