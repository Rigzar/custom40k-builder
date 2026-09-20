/**
 * The five "set up by Deep Strike / Infiltrators for points per Wound" army rules.
 *
 * Every codex Index tab that has one writes it the same way: for each STARTED 1000 points of game
 * size, one unit may be set up using a different deployment rule, paid for per Wound (or per Hull
 * Point). They had only ever existed in the app as rules TEXT in each faction's
 * `special-abilities.ts`, so there was no way to buy one — reported by a player asking how to
 * spend the point per Wound for the Eldar Webway strike, and the answer was that he could not.
 *
 * ODS-VERBATIM, Index tab of each codex:
 *   Eldar / Harlequins "Webway strike", Dark Eldar "Webway raid":
 *     "For each started 1000 points of game size, one infantry unit (including attached character
 *      models) may be set up using the rules for Infiltrators for +1 point per Wound."
 *   Adeptus Custodes "Lightning strike":
 *     "...one Infantry/Walker unit (including attached character models) may be set up using the
 *      rules for Deep Strike for +1/+4 point(s) per Wound/Hull Point."
 *   Orks "Tellyporta":
 *     "For every 1000 points of game size or part thereof, a unit may be set up for +1 point per
 *      Wound according to the rules for Deep strike. Vehicles and monstrous creatures may be set up
 *      for +4 points per Hull Point / Wound... Individual models from a squadron are treated as
 *      independent units. All Ork units have this rule."
 *
 * "For each STARTED 1000 points" and "or part thereof" are the same thing and both mean CEIL — the
 * distinction that has bitten this codebase before ("for every 500 points" is floor, "for each
 * started 500 points" is ceil), so the cap is Math.ceil and nothing else.
 *
 * OPEN WITH THE AUTHOR (asked 2026-09-20), and the assumptions made meanwhile are marked below:
 *   - Orks: what "All Ork units have this rule" means, whether the cap is still one per 1000, and
 *     whether a squadron's models each consume a slot.
 *   - whether an attached character's Wounds add to the price.
 *   - whether an allied detachment may take one, and whether it shares the primary army's cap.
 */
import type { Unit } from '../types/data';

export type DeploymentAbility = 'Infiltrators' | 'Deep Strike';
export type Eligibility = 'infantry' | 'infantryOrWalker' | 'any';

export interface DeploymentUpgrade {
  /** The rule's own name, as the Index tab prints it. */
  name: string;
  /** What the unit gains — shown on the card as an ability. */
  ability: DeploymentAbility;
  /** Points per Wound for a creature. */
  pointsPerWound: number;
  /** Points per Hull Point for a vehicle, where the rule prices one; absent = vehicles cannot. */
  pointsPerHull?: number;
  /** Orks price monstrous CREATURES at the vehicle rate too ("per Hull Point / Wound"). */
  monsterUsesHullRate?: boolean;
  /** Which units may be chosen. */
  eligible: Eligibility;
  /** One unit per this many points of game size, rounded UP. */
  perPoints: number;
}

/** Keyed by the app's faction display name, as `FactionData.faction` carries it. */
export const DEPLOYMENT_UPGRADES: Record<string, DeploymentUpgrade> = {
  'Eldar':            { name: 'Webway strike',   ability: 'Infiltrators', pointsPerWound: 1, eligible: 'infantry', perPoints: 1000 },
  'Harlequins':       { name: 'Webway strike',   ability: 'Infiltrators', pointsPerWound: 1, eligible: 'infantry', perPoints: 1000 },
  'Dark Eldar':       { name: 'Webway raid',     ability: 'Infiltrators', pointsPerWound: 1, eligible: 'infantry', perPoints: 1000 },
  'Adeptus Custodes': { name: 'Lightning strike', ability: 'Deep Strike', pointsPerWound: 1, pointsPerHull: 4, eligible: 'infantryOrWalker', perPoints: 1000 },
  'Orks':             { name: 'Tellyporta',      ability: 'Deep Strike',  pointsPerWound: 1, pointsPerHull: 4, monsterUsesHullRate: true, eligible: 'any', perPoints: 1000 },
};

export function getDeploymentUpgrade(faction: string | null | undefined): DeploymentUpgrade | null {
  if (!faction) return null;
  return DEPLOYMENT_UPGRADES[faction] ?? null;
}

/**
 * May this unit take it?
 *
 * ASSUMPTION, pending the author: "one infantry unit" is read as any unit whose type CONTAINS
 * Infantry — plain Infantry, Character Model Infantry, Jump Pack Infantry and Monstrous Infantry —
 * on the 2026-06-08 designer clarification that Infantry-acting subtypes count as Infantry for
 * rules OTHER than the Dedicated Transport cap, which is the one place that needs a strict match.
 */
export function unitMayTakeDeploymentUpgrade(unit: Unit, up: DeploymentUpgrade): boolean {
  const t = (unit.unit_type ?? '').toLowerCase();
  switch (up.eligible) {
    case 'any':              return true;
    case 'infantry':         return t.includes('infantry');
    case 'infantryOrWalker': return t.includes('infantry') || t.includes('walker');
    default:                 return false;
  }
}

/**
 * The cost for one roster entry: rate x the model's Wounds (or Hull Points) x how many models.
 * A vehicle pays the hull rate; Orks additionally price a monstrous CREATURE at that rate, which
 * is what "per Hull Point / Wound" in their sentence means.
 */
export function deploymentUpgradeCost(unit: Unit, size: number, up: DeploymentUpgrade): number {
  const usesHullRate = !!unit.is_vehicle || (!!up.monsterUsesHullRate && !!unit.is_monster);
  const rate = usesHullRate ? (up.pointsPerHull ?? up.pointsPerWound) : up.pointsPerWound;
  const statKey = unit.is_vehicle ? 'HP' : 'W';
  const per = parseInt(unit.models[0]?.stats[statKey] ?? '1', 10) || 1;
  return rate * per * Math.max(1, size);
}

/** How many units the army may set up this way: one per STARTED `perPoints`, so ceil. */
export function deploymentUpgradeCap(pointLimit: number, up: DeploymentUpgrade): number {
  if (!pointLimit || pointLimit <= 0) return 0;
  return Math.ceil(pointLimit / up.perPoints);
}
