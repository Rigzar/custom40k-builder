import type { FactionData } from '../types/data';
import type { ArmyState, RosterEntry } from '../types/army';
import { computeUnitPoints, resolveUnit } from './points';
import { ENGAGEMENTS, SLOT_ORDER, ALLIED_AOP } from './engagements';
import {
  getArchetypeRule, getEffectiveSlot, getEffectiveHqLimits, countsTroops,
} from './archetypes';

export interface ValidationItem {
  type: 'error' | 'warn' | 'ok';
  text: string;
}

type Rule = ReturnType<typeof getArchetypeRule>;

function getSlotUsage(
  army: RosterEntry[],
  data: FactionData,
  slot: string,
  rule: Rule,
  alliedFaction?: string,
  countAllied?: boolean,
): number {
  return army.filter(i => {
    const isAllied = !!(i.factionSource && i.factionSource === alliedFaction);
    if (countAllied !== undefined && isAllied !== countAllied) return false;
    const u = resolveUnit(i, data);
    if (u?.advisor) return false;
    return getEffectiveSlot(i.unitName, i.slot, rule) === slot;
  }).length;
}

function getAopRequirement(army: RosterEntry[], data: FactionData, engKey: string, rule: Rule, alliedFaction?: string): number {
  const eng = ENGAGEMENTS[engKey];
  if (!eng.multiAop) return 1;
  let aops = 1;
  for (const slot of SLOT_ORDER) {
    if (slot === 'HQ') continue;
    const [, max] = eng.aop[slot];
    if (max <= 0) continue;
    // Exclude allied units from main AOP calculation
    const used = getSlotUsage(army, data, slot, rule, alliedFaction, false);
    if (used > max) aops = Math.max(aops, Math.ceil(used / max));
  }
  return aops;
}

function allowedMarks(state: ArmyState, data: FactionData): string[] {
  // Try exact key first, then prefix-match for compound keys like "Undivided / Without"
  if (data.animosity[state.hqMark]) return data.animosity[state.hqMark];
  const match = Object.entries(data.animosity).find(([k]) => k.startsWith(state.hqMark));
  return match ? match[1] : [];
}

export function validateArmy(state: ArmyState, data: FactionData): ValidationItem[] {
  const eng = ENGAGEMENTS[state.engagement];
  const rule = getArchetypeRule(state.archetype);
  const items: ValidationItem[] = [];

  const total = state.army.reduce((s, i) => {
    const u = resolveUnit(i, data);
    return s + (u ? computeUnitPoints(i, u, state.archetype) : 0);
  }, 0);

  // Point range warnings
  if (state.engagement === 'skirmish') {
    if (total < 1000) items.push({ type: 'warn', text: `Skirmish recommended 1000–1500 pts (current: ${total}).` });
    if (total > 1500) items.push({ type: 'warn', text: `Skirmish cap 1500 pts (current: ${total}).` });
  } else if (state.engagement === 'pitched') {
    if (total < 2500) items.push({ type: 'warn', text: `Pitched Battle recommended 2500–3500 pts (current: ${total}).` });
    if (total > 3500) items.push({ type: 'warn', text: `Pitched Battle cap 3500 pts (current: ${total}).` });
  } else {
    if (total < 4000) items.push({ type: 'warn', text: `Epic Battle recommended 4000+ pts (current: ${total}).` });
  }

  // Hard point limit
  if (total > state.pointLimit) {
    items.push({ type: 'error', text: `Over points limit (${total}/${state.pointLimit}).` });
  } else if (state.army.length > 0) {
    items.push({ type: 'ok', text: `Within limit (${total}/${state.pointLimit}).` });
  }

  // ── Archetype validation ──────────────────────────────────────────────────
  if (rule) {
    // Banned units
    for (const item of state.army) {
      if (rule.bannedUnits.includes(item.unitName)) {
        items.push({
          type: 'error',
          text: `Archetype "${state.archetype}": ${item.unitName} is not allowed.`,
        });
      }
    }

    // Whitelist — only specific units allowed (e.g. Krumpa Kompany, Tempestus Scions)
    if (rule.allowedUnitsOnly.length > 0) {
      for (const item of state.army) {
        if (!item.factionSource && !rule.allowedUnitsOnly.includes(item.unitName)) {
          items.push({
            type: 'error',
            text: `Archetype "${state.archetype}": ${item.unitName} is not in the allowed unit list.`,
          });
        }
      }
    }

    // Banned slots (e.g. War Hawks: no Heavy Support)
    if (rule.bannedSlots.length > 0) {
      for (const item of state.army) {
        if (!item.factionSource && rule.bannedSlots.includes(item.slot)) {
          items.push({
            type: 'error',
            text: `Archetype "${state.archetype}": ${item.slot} units are not allowed (${item.unitName}).`,
          });
        }
      }
    }

    // Required HQ unit type (e.g. LIIVI needs a Farseer, The First Curse needs a Patriarch)
    if (rule.requiresHqUnit) {
      const hasRequiredHq = state.army.some(item => {
        const effSlot = getEffectiveSlot(item.unitName, item.slot, rule);
        return effSlot === 'HQ' && item.unitName.toLowerCase().includes(rule!.requiresHqUnit!.toLowerCase());
      });
      if (!hasRequiredHq) {
        items.push({
          type: 'error',
          text: `Archetype "${state.archetype}": requires at least 1 ${rule.requiresHqUnit} as HQ.`,
        });
      }
    }

    // Units banned because they have no vet abilities (Legionnaire Warband)
    if (rule.requireVetAbilities) {
      for (const item of state.army) {
        const u = resolveUnit(item, data);
        if (u && !u.has_veteran_abilities) {
          items.push({
            type: 'error',
            text: `Legionnaire Warband: ${item.unitName} has no veteran abilities and cannot be included.`,
          });
        }
      }
    }

    // Forced mark: validate all units have the correct mark
    if (rule.forcedMark) {
      for (const item of state.army) {
        const u = resolveUnit(item, data);
        if (!u) continue;
        const lockedMark = u.locked_mark;
        if (lockedMark && lockedMark !== rule.forcedMark) {
          items.push({
            type: 'error',
            text: `Archetype "${state.archetype}": ${item.unitName} has a locked mark (${lockedMark}) incompatible with ${rule.forcedMark}.`,
          });
        }
      }
    }

    // HQ unit restrictions (Sorcerer Circle)
    if (rule.hqAllowed.length > 0) {
      for (const item of state.army) {
        const effSlot = getEffectiveSlot(item.unitName, item.slot, rule);
        if (effSlot === 'HQ') {
          const allowed = rule.hqAllowed.some(name =>
            item.unitName.toLowerCase().includes(name.toLowerCase()),
          );
          if (!allowed) {
            items.push({
              type: 'error',
              text: `Archetype "${state.archetype}": ${item.unitName} cannot be HQ (only ${rule.hqAllowed.join(', ')}).`,
            });
          }
        }
      }
    }

    // Abaddon's Chosen: each HQ must have a different mark
    if (state.archetype === "Abaddon's Chosen") {
      const hqMarks: string[] = [];
      for (const item of state.army) {
        const effSlot = getEffectiveSlot(item.unitName, item.slot, rule);
        if (effSlot !== 'HQ') continue;
        const u = resolveUnit(item, data);
        const m = u?.locked_mark ?? item.mark ?? '';
        if (!m) {
          items.push({ type: 'warn', text: `Abaddon's Chosen: ${item.unitName} needs a Chaos Mark.` });
        } else if (hqMarks.includes(m)) {
          items.push({ type: 'error', text: `Abaddon's Chosen: Mark ${m} repeated (each HQ needs a different mark).` });
        } else {
          hqMarks.push(m);
        }
      }
    }

    // Special Operations: Cultists need 2 vet abilities including Infiltrator
    if (state.archetype === 'Special Operations') {
      for (const item of state.army) {
        if (item.unitName === 'Cultists') {
          if (item.traits.length < 2) {
            items.push({ type: 'error', text: `Special Operations: Cultists need 2 veteran abilities (have ${item.traits.length}).` });
          } else if (!item.traits.some(t => t.name.toLowerCase().includes('infiltrator'))) {
            items.push({ type: 'error', text: 'Special Operations: Cultists must include the "Infiltrator" ability.' });
          }
        }
      }
    }

    // Legionnaire Warband: all units with vet abilities must have at least 1
    if (state.archetype === 'Legionnaire Warband') {
      for (const item of state.army) {
        const u = resolveUnit(item, data);
        if (u?.has_veteran_abilities && item.traits.length === 0) {
          items.push({ type: 'warn', text: `Legionnaire Warband: ${item.unitName} must have at least 1 veteran ability.` });
        }
      }
    }

    // Mechanised Company: only 1 Heavy Support unit allowed
    if (state.archetype === 'Mechanised Company') {
      const hsCount = state.army.filter(item =>
        !item.factionSource && getEffectiveSlot(item.unitName, item.slot, rule) === 'Heavy Support',
      ).length;
      if (hsCount > 1) {
        items.push({ type: 'error', text: `Mechanised Company: only 1 Heavy Support unit allowed (have ${hsCount}).` });
      }
    }

    // No legacy/traits when archetype forbids them
    if (rule.noLegacy && (state.legacy || state.legacy2)) {
      items.push({ type: 'error', text: `Archetype "${state.archetype}": no Legacy is allowed.` });
    }
    if (rule.noTraits && state.traitPool.length > 0) {
      items.push({ type: 'error', text: `Archetype "${state.archetype}": no Traits are allowed.` });
    }

    // Daemonkin: all units must share the same Chaos Mark
    if (state.archetype === 'Daemonkin') {
      const marks = new Set<string>();
      for (const item of state.army) {
        const u = resolveUnit(item, data);
        const m = u?.locked_mark ?? item.mark;
        if (m) marks.add(m);
      }
      if (marks.size > 1) {
        items.push({
          type: 'error',
          text: `Daemonkin: all units must share the same Chaos Mark (found: ${[...marks].join(', ')}).`,
        });
      }
      // At least 1 HQ from each codex (CSM and allied Daemons)
      const hasMainHq = state.army.some(i =>
        !i.factionSource && getEffectiveSlot(i.unitName, i.slot, rule) === 'HQ',
      );
      const hasAlliedHq = state.army.some(i =>
        !!i.factionSource && getEffectiveSlot(i.unitName, i.slot, rule) === 'HQ',
      );
      if (state.army.length > 0 && !(hasMainHq && hasAlliedHq)) {
        items.push({
          type: 'warn',
          text: 'Daemonkin: requires at least 1 HQ from each Codex (CSM and Daemons).',
        });
      }
      // Codex balance: no more than +1 unit from one codex over the other
      const mainCount = state.army.filter(i => !i.factionSource).length;
      const alliedCount = state.army.filter(i => !!i.factionSource).length;
      if (Math.abs(mainCount - alliedCount) > 1) {
        const more = mainCount > alliedCount ? 'CSM' : 'Daemons';
        const less = mainCount > alliedCount ? 'Daemons' : 'CSM';
        items.push({
          type: 'error',
          text: `Daemonkin: ${more} has ${Math.abs(mainCount - alliedCount) - 1} more unit(s) than ${less} — max difference is 1.`,
        });
      }
    }
  }

  // Black Crusade trait: one HQ per Chaos god (all 4 marks must be present, no repeats)
  const blackCrusadeActive = state.traitPool.includes('Black Crusade');
  if (blackCrusadeActive) {
    if (!state.hqMark.startsWith('Undivided')) {
      items.push({
        type: 'warn',
        text: 'Black Crusade: set the Army HQ Mark to "Undivided" so all four god marks can coexist in the army.',
      });
    }
    const hqMarks: string[] = [];
    for (const item of state.army) {
      const effSlot = getEffectiveSlot(item.unitName, item.slot, rule);
      if (effSlot !== 'HQ') continue;
      const u = resolveUnit(item, data);
      const m = u?.locked_mark ?? item.mark ?? '';
      if (!m) {
        items.push({ type: 'warn', text: `Black Crusade: ${item.unitName} has no Chaos Mark (each HQ must carry a different god's mark).` });
      } else if (hqMarks.includes(m)) {
        items.push({ type: 'error', text: `Black Crusade: Mark of ${m} appears more than once among HQs (each must be different).` });
      } else {
        hqMarks.push(m);
      }
    }
    const CHAOS_MARKS = ['Khorne', 'Nurgle', 'Slaanesh', 'Tzeentch'];
    const missingMarks = CHAOS_MARKS.filter(m => !hqMarks.includes(m));
    if (missingMarks.length > 0) {
      items.push({
        type: 'error',
        text: `Black Crusade: missing an HQ with mark(s) of ${missingMarks.join(', ')}.`,
      });
    }
  }

  // 2nd legacy requires a "enables_second_legacy" trait to be active
  if (state.legacy2 && !state.traitPool.some(n => data.traits.find(t => t.name === n)?.enables_second_legacy)) {
    items.push({ type: 'error', text: '2nd Legacy requires the second-legion trait to be active.' });
  }

  // Unique variant upgrades: only 1 per army (e.g. Chaos Lord, Master of Possession)
  const uniqueVariantCounts: Record<string, number> = {};
  for (const item of state.army) {
    const u = resolveUnit(item, data);
    if (!u) continue;
    u.option_groups.forEach((g, gi) => {
      if (!g.is_unique_per_army || !g.variant_link) return;
      if (item.optionQty?.[gi]?.['__inline']) {
        uniqueVariantCounts[g.variant_link] = (uniqueVariantCounts[g.variant_link] ?? 0) + 1;
      }
    });
  }
  for (const [variant, count] of Object.entries(uniqueVariantCounts)) {
    if (count > 1) {
      items.push({
        type: 'error',
        text: `${variant}: only 1 may be upgraded per army (have ${count}).`,
      });
    }
  }

  // AOP slot mins (main faction only — exclude allied units)
  for (const slot of SLOT_ORDER) {
    const hqLimits = getEffectiveHqLimits(rule, eng.aop.HQ);
    const min = slot === 'HQ' ? hqLimits[0] : eng.aop[slot][0];
    const used = getSlotUsage(state.army, data, slot, rule, state.alliedFaction, false);
    if (min > 0 && used < min) {
      items.push({ type: 'error', text: `Need at least ${min} ${slot} (have ${used}).` });
    }
  }

  // Troops 25% — archetype may restrict which Troops count (main faction only)
  if (state.army.length > 0 && total > 0) {
    const baseTroopsPts = state.army
      .filter(i => {
        // Exclude allied units from the 25% Troops calculation
        if (state.alliedFaction && i.factionSource === state.alliedFaction) return false;
        const u = resolveUnit(i, data);
        if (!u) return false;
        if (getEffectiveSlot(i.unitName, i.slot, rule) !== 'Troops') return false;
        return countsTroops(i.unitName, u.locked_mark, rule);
      })
      .reduce((s, i) => {
        const u = resolveUnit(i, data);
        return s + (u ? computeUnitPoints(i, u, state.archetype) : 0);
      }, 0);
    // Mechanised Company: Dedicated Transports count at 50% toward the Troops 25%
    const transportBonus = state.archetype === 'Mechanised Company'
      ? state.army
          .filter(i => {
            if (state.alliedFaction && i.factionSource === state.alliedFaction) return false;
            return i.slot === 'Dedicated Transport';
          })
          .reduce((s, i) => {
            const u = resolveUnit(i, data);
            return s + (u ? Math.floor(computeUnitPoints(i, u, state.archetype) * 0.5) : 0);
          }, 0)
      : 0;
    const troopsPts = baseTroopsPts + transportBonus;
    const ratio = troopsPts / total;
    const label = (rule && rule.troopsCount !== 'all')
      ? `Qualifying Troops (${rule.troopsCount === 'locked' ? 'locked mark' : 'Raptors/Legionnaires'})`
      : 'Troops';
    if (ratio < eng.minTroopsRatio) {
      items.push({
        type: 'error',
        text: `${label} must be ≥25% of total (${(ratio * 100).toFixed(1)}%, need ${Math.ceil(total * eng.minTroopsRatio)} pts).`,
      });
    } else {
      items.push({ type: 'ok', text: `${label}: ${(ratio * 100).toFixed(1)}% (≥25%).` });
    }
  }

  // Skirmish stat caps
  if (eng.statCaps) {
    for (const item of state.army) {
      const u = resolveUnit(item, data);
      if (!u) continue;
      const pts = computeUnitPoints(item, u, state.archetype);
      const effSlot = getEffectiveSlot(item.unitName, item.slot, rule);
      if (effSlot === 'HQ' && pts > 150) {
        items.push({ type: 'error', text: `Skirmish: HQ ${item.unitName} exceeds 150 pts (${pts}).` });
      }
      if (effSlot !== 'Troops' && pts > 300) {
        items.push({ type: 'error', text: `Skirmish: ${item.unitName} exceeds 300 pts (${pts}).` });
      }
      if (u.is_squadron && item.size > 1) {
        items.push({ type: 'error', text: `Skirmish: ${item.unitName} is a Squadron — maximum 1 model (have ${item.size}).` });
      }
    }
  }

  // Per_n and fixed_max constraint sums
  for (const item of state.army) {
    const u = resolveUnit(item, data);
    if (!u) continue;
    u.option_groups.forEach((g, gi) => {
      if (g.constraint?.type === 'per_n') {
        const max = (g.constraint.count_per_n ?? 1) * Math.floor(item.size / (g.constraint.per_n ?? 1));
        const used = Object.entries(item.optionQty?.[gi] ?? {}).reduce((s, [k, v]) => {
          return k === '__inline' ? s : s + (v ?? 0);
        }, 0);
        if (used > max) {
          items.push({
            type: 'error',
            text: `${item.unitName}: "${g.header.substring(0, 50)}" — ${used} swaps, only ${max} allowed for squad of ${item.size}.`,
          });
        }
      }
      if (g.constraint?.type === 'fixed_max') {
        const used = Object.entries(item.optionQty?.[gi] ?? {}).reduce((s, [k, v]) => {
          return k === '__inline' ? s : s + (v ?? 0);
        }, 0);
        if (used > (g.constraint.max ?? 0)) {
          items.push({
            type: 'error',
            text: `${item.unitName}: "${g.header.substring(0, 50)}" — ${used} swaps, maximum ${g.constraint.max}.`,
          });
        }
      }
    });
  }

  // AOP slot maxes (main faction only — exclude allied units)
  const aopMult = getAopRequirement(state.army, data, state.engagement, rule, state.alliedFaction);
  for (const slot of SLOT_ORDER) {
    const hqLimits = getEffectiveHqLimits(rule, eng.aop.HQ);
    const engMax = slot === 'HQ' ? hqLimits[1] : eng.aop[slot][1];
    const used = getSlotUsage(state.army, data, slot, rule, state.alliedFaction, false);
    const effMax = (slot === 'HQ' && rule?.hqOverride)
      ? engMax
      : (eng.multiAop ? engMax * aopMult : engMax);
    if (used > effMax) {
      items.push({ type: 'error', text: `${slot} over maximum (${used}/${effMax}).` });
    }
  }
  if (eng.multiAop && aopMult > 1) {
    items.push({ type: 'ok', text: `Using ${aopMult} AOPs.` });
  }

  // Allied detachment AOP validation
  if (state.alliedFaction) {
    const alliedUnits = state.army.filter(e => e.factionSource === state.alliedFaction);
    if (alliedUnits.length > 0) {
      for (const slot of SLOT_ORDER) {
        const [min, max] = ALLIED_AOP[slot];
        const used = getSlotUsage(state.army, data, slot, rule, state.alliedFaction, true);
        if (min > 0 && used < min) {
          items.push({ type: 'error', text: `Allied detachment: need at least ${min} ${slot} (have ${used}).` });
        }
        if (max === 0 && used > 0) {
          items.push({ type: 'error', text: `Allied detachment: ${slot} not allowed (have ${used}).` });
        } else if (max > 0 && slot !== 'Dedicated Transport' && used > max) {
          items.push({ type: 'error', text: `Allied detachment: ${slot} over maximum (${used}/${max}).` });
        }
      }
      // Elites / Fast Attack / Heavy Support limited to 1 each, but +1 per Troop unit beyond 1
      const alliedTroops = getSlotUsage(state.army, data, 'Troops', rule, state.alliedFaction, true);
      for (const slot of ['Elites', 'Fast Attack', 'Heavy Support'] as const) {
        const used = getSlotUsage(state.army, data, slot, rule, state.alliedFaction, true);
        if (used > alliedTroops) {
          items.push({ type: 'error', text: `Allied: ${slot} (${used}) exceeds Troops (${alliedTroops}) — 1 ${slot} per Troop unit.` });
        }
      }
    }
  }

  // Animosity / mark checks — skipped for Black Crusade (it has its own 4-mark validation above)
  if (!rule?.noAnimosity && !blackCrusadeActive) {
    const allowed = allowedMarks(state, data);
    for (const item of state.army) {
      if (item.mark && !allowed.includes(item.mark)) {
        items.push({
          type: 'error',
          text: `${item.unitName}: Mark ${item.mark} not allowed (HQ is ${state.hqMark}).`,
        });
      }
      const u = resolveUnit(item, data);
      if (u?.locked_mark && !allowed.includes(u.locked_mark)) {
        if (!rule?.requireForcedMarkOnly) {
          items.push({
            type: 'error',
            text: `${item.unitName}: Locked mark ${u.locked_mark} incompatible with HQ ${state.hqMark}.`,
          });
        }
      }
    }
  }

  // Army trait limit (max 2)
  if (state.traitPool.length > 2) {
    items.push({ type: 'error', text: `Only 2 Army Traits allowed (have ${state.traitPool.length}).` });
  }

  // veteran_required: unit must have at least 1 army trait assigned
  for (const item of state.army) {
    const u = resolveUnit(item, data);
    if (u?.veteran_required && item.traits.length === 0) {
      items.push({ type: 'error', text: `${item.unitName}: requires at least 1 army trait.` });
    }
  }

  // Legacy mark restriction (Hydra, Iron Lord, Night Haunter = Undivided only)
  const undividedLegacies = ['Legacy of the Hydra', 'Legacy of the Iron Lord', 'Legacy of the Night Haunter'];
  const legacies = [state.legacy, state.legacy2].filter(Boolean);
  const hasUndividedLegacy = legacies.some(l => undividedLegacies.includes(l));
  if (hasUndividedLegacy) {
    for (const item of state.army) {
      const u = resolveUnit(item, data);
      const m = u?.locked_mark ?? item.mark;
      if (m && m !== 'Undivided') {
        const restrictingLegacy = legacies.find(l => undividedLegacies.includes(l));
        items.push({
          type: 'error',
          text: `${restrictingLegacy}: ${item.unitName} must be Undivided (current: ${m}).`,
        });
      }
    }
  }

  // Skirmish: no archetypes
  if (state.engagement === 'skirmish' && state.archetype) {
    items.push({ type: 'error', text: 'Skirmish: Archetypes are not allowed.' });
  }

  if (items.length === 0) items.push({ type: 'ok', text: 'Army is valid.' });
  return items;
}

export { getSlotUsage, allowedMarks };
