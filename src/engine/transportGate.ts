/**
 * Generic "low-Movement units must embark" gate (ArchetypeRule.lowMoveMustEmbark — see
 * archetypes/base.ts for grounding). Used at catalog/add time to grey out units that can never
 * satisfy the requirement (Movement <12" and no transport option), per the rules-owner's
 * clarification: block selection, don't just show a note.
 */

import type { Unit } from '../types/data';
import type { ArchetypeRule } from './archetypes/base';

export function unitMovementInches(unit: Unit): number | null {
  const m = unit.models[0]?.stats.M;
  if (!m) return null;
  const n = parseInt(m.replace('"', ''), 10);
  return Number.isNaN(n) ? null : n;
}

/** A unit can embark in a Dedicated Transport if its unit_type contains 'Infantry' (covers
 * 'Infantry', 'Character Model, Infantry', 'Monstrous Infantry') but NOT 'Jump Pack' variants
 * (jump packs prevent embarking). Distinct from validators.ts's strict-Infantry check (which
 * requires exact "Infantry" for the AOP cap) — here we care about physical embark capability. */
export function unitHasTransportOption(unit: Unit): boolean {
  const t = unit.unit_type;
  if (/jump[\s-]*pack/i.test(t)) return false;
  return t.toLowerCase().includes('infantry');
}

/** Returns a disabled-tooltip reason when `rule.lowMoveMustEmbark` blocks this unit from being
 * added at all (Movement <12" + no transport option), or null when the unit is selectable. */
export function lowMoveEmbarkBlockReason(unit: Unit, rule: ArchetypeRule | null): string | null {
  const gate = rule?.lowMoveMustEmbark;
  if (!gate) return null;
  if (gate.creatureOnly && unit.is_vehicle) return null;
  const m = unitMovementInches(unit);
  if (m === null || m >= 12) return null;
  if (unitHasTransportOption(unit)) return null;
  return `Movement ${m}" (<12") and no transport option — this archetype requires units with M<12" to start embarked.`;
}
