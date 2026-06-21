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

/** Mirrors validators.ts's strict-Infantry definition for the Dedicated Transport AOP cap — a
 * unit can only ever embark in a Dedicated Transport if its (unmodified) unit_type is exactly
 * "Infantry". Static/pre-resolution check, intentionally not option-aware (this runs against
 * catalog entries that haven't been added to the roster yet). */
export function unitHasTransportOption(unit: Unit): boolean {
  return unit.unit_type === 'Infantry';
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
