import { useState } from 'react';
import { useArmyStore } from '../store/army';
import { SLOT_ORDER, ENGAGEMENTS } from '../engine/engagements';
import { getArchetypeRule, getEffectiveSlot, isUnitAllowed, getEffectiveHqLimits } from '../engine/archetypes';
import type { FactionData } from '../types/data';
import type { RosterEntry } from '../types/army';

interface SlotEntry {
  name: string;
  factionSource?: string;
  minCost: number;
}

function getSlotUsage(
  army: RosterEntry[],
  data: FactionData,
  slot: string,
  rule: ReturnType<typeof getArchetypeRule>,
): number {
  return army.filter(i => {
    const u = i.factionSource
      ? data.allied?.[i.factionSource]?.units[i.unitName]
      : data.units[i.unitName];
    if (u?.advisor) return false;
    return getEffectiveSlot(i.unitName, i.slot, rule) === slot;
  }).length;
}

/** Mirrors the validator's AOP multiplier so the slot panel shows correct limits. */
function computeAopMult(
  army: RosterEntry[],
  data: FactionData,
  aop: Record<string, [number, number]>,
  multiAop: boolean,
  rule: ReturnType<typeof getArchetypeRule>,
): number {
  if (!multiAop) return 1;
  let aops = 1;
  for (const slot of SLOT_ORDER) {
    if (slot === 'HQ') continue;
    const max = aop[slot][1];
    if (max <= 0) continue;
    const used = getSlotUsage(army, data, slot, rule);
    if (used > max) aops = Math.max(aops, Math.ceil(used / max));
  }
  return aops;
}

export function SlotPanel() {
  const { data, army, engagement, archetype, hqMark, addUnit } = useArmyStore();
  const [open, setOpen] = useState<Record<string, boolean>>({ Troops: true, HQ: true });

  if (!data) return null;
  const eng = ENGAGEMENTS[engagement];
  const rule = getArchetypeRule(archetype);

  // Build effective slot→units map: filter banned units, remap slots
  const effectiveSlotUnits: Record<string, SlotEntry[]> = {};
  for (const slot of SLOT_ORDER) effectiveSlotUnits[slot] = [];

  // Primary faction units
  for (const [originalSlot, names] of Object.entries(data.slot_to_units)) {
    for (const name of names) {
      const u = data.units[name];
      if (!u) continue;
      if (!isUnitAllowed(name, u, rule)) continue;
      const effSlot = getEffectiveSlot(name, originalSlot, rule);
      if (effectiveSlotUnits[effSlot]) {
        effectiveSlotUnits[effSlot].push({ name, minCost: u.min_cost });
      }
    }
  }

  // Allied faction units (unlocked by archetype)
  if (rule?.alliedFaction && data.allied?.[rule.alliedFaction]) {
    const alliedData = data.allied[rule.alliedFaction];
    for (const [originalSlot, names] of Object.entries(alliedData.slot_to_units)) {
      for (const name of names) {
        const u = alliedData.units[name];
        if (!u) continue;

        if (rule.alliedMarkFilter === 'forced') {
          // Only units whose locked_mark matches the forced mark
          if (!u.locked_mark || u.locked_mark !== rule.forcedMark) continue;
        } else if (rule.alliedMarkFilter === 'hq_mark') {
          // Units with matching locked_mark or no locked mark
          if (u.locked_mark && u.locked_mark !== hqMark) continue;
        }
        // 'all': no filter

        const effSlot = getEffectiveSlot(name, originalSlot, rule);
        if (effectiveSlotUnits[effSlot]) {
          effectiveSlotUnits[effSlot].push({ name, factionSource: rule.alliedFaction, minCost: u.min_cost });
        }
      }
    }
  }

  const aopMult = computeAopMult(army, data, eng.aop as unknown as Record<string, [number, number]>, eng.multiAop, rule);

  return (
    <div className="space-y-1">
      {SLOT_ORDER.map(slot => {
        const [engMin, engMax] = eng.aop[slot];
        const [min, rawMax] = slot === 'HQ'
          ? getEffectiveHqLimits(rule, eng.aop.HQ)
          : [engMin, engMax];
        // Scale by AOP multiplier (same logic as validators), except HQ with override
        const max = (slot === 'HQ' && rule?.hqOverride)
          ? rawMax
          : eng.multiAop ? rawMax * aopMult : rawMax;

        const units = effectiveSlotUnits[slot] ?? [];
        if (rawMax === 0 && units.length === 0) return null;

        const used = getSlotUsage(army, data, slot, rule);
        const isFull = used >= max && max > 0;
        const isUnder = used < min;
        const countColor = isFull ? 'text-red-400' : isUnder ? 'text-amber-400' : 'text-zinc-400';

        return (
          <div key={slot} className="bg-zinc-800 border border-zinc-700 border-l-2 border-l-amber-800">
            <button
              className="w-full flex justify-between items-center px-3 py-2 text-left hover:bg-zinc-700 transition-colors"
              onClick={() => setOpen(o => ({ ...o, [slot]: !o[slot] }))}
            >
              <span className="text-[11px] uppercase tracking-widest text-amber-600">{slot}</span>
              <span className={`text-[11px] ${countColor}`}>
                {used}/{max} <span className="text-zinc-600">(min {min})</span>
              </span>
            </button>

            {open[slot] && (
              <div className="border-t border-zinc-700 py-1">
                {units.length === 0 ? (
                  <div className="text-[11px] text-zinc-600 px-3 py-1 italic">No units</div>
                ) : (
                  units.map((entry: SlotEntry) => {
                    const originalSlot = entry.factionSource
                      ? data.allied?.[entry.factionSource]?.units[entry.name]?.slot ?? slot
                      : data.units[entry.name]?.slot ?? slot;
                    return (
                      <button
                        key={`${entry.factionSource ?? 'csm'}::${entry.name}`}
                        onClick={() => addUnit(entry.name, originalSlot, entry.factionSource)}
                        className="w-full flex justify-between items-center px-3 py-1.5 text-left text-[12px] border-b border-zinc-700/50 hover:bg-zinc-700 hover:text-amber-400 transition-colors group"
                      >
                        <div>
                          <span className="text-zinc-200 group-hover:text-amber-400">{entry.name}</span>
                          {entry.factionSource && (
                            <span className="text-[10px] text-zinc-500 ml-1">[Allied]</span>
                          )}
                        </div>
                        <span className="text-zinc-500 text-[11px]">{entry.minCost ?? '?'} pts</span>
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
