/**
 * Dark Eldar Combat Drugs — an army rule, NOT armory gear.
 *
 * SOURCE: Dark Eldar ENG.ods Index "Combat drugs" + the 6 drug entries in
 * data/parsed/dark_eldar/armory/general.json (all priced null/null — free). Any unit with the
 * "Combat drugs" ability picks ONE drug for the battle (free); the "Stimulant supply" equipment
 * lets the bearer pick one additional drug. They were unselectable before: modelled as armory
 * items, so blocked by the null price AND hidden behind has_armory_access (which most drug-bearing
 * units lack). This dedicated list drives a per-unit picker and applies the effect in the resolver.
 */

export interface CombatDrug {
  name: string;
  desc: string;
  /** Unit-wide stat deltas applied to the profile (empty for rules-text-only drugs). */
  statMods: { stat: string; delta: number }[];
  /** True when the effect is a rule shown as an ability rather than a stat delta. */
  ability: boolean;
}

export const DARK_ELDAR_COMBAT_DRUGS: CombatDrug[] = [
  { name: 'Adrenalight', desc: 'The unit gains +1 Attack.',   statMods: [{ stat: 'A', delta: 1 }], ability: false },
  { name: 'Grave lotus', desc: 'The unit gains +1 Strength.', statMods: [{ stat: 'S', delta: 1 }], ability: false },
  { name: 'Painbringer', desc: 'The unit gains +1 Toughness.', statMods: [{ stat: 'T', delta: 1 }], ability: false },
  { name: 'Hypex', desc: 'The unit automatically advances 6" instead of rolling for the distance.', statMods: [], ability: true },
  { name: 'Serpentin', desc: 'The unit gains +1 to hit rolls in melee.', statMods: [], ability: true },
  { name: 'Splintermind', desc: 'The unit starts with an (additional) "Power through Pain" token.', statMods: [], ability: true },
];

export const COMBAT_DRUG_NAMES = DARK_ELDAR_COMBAT_DRUGS.map(d => d.name);

export function getCombatDrug(name: string): CombatDrug | undefined {
  return DARK_ELDAR_COMBAT_DRUGS.find(d => d.name === name);
}

/** Whether a unit may pick combat drugs — it carries the "Combat drugs" ability in its profile. */
export function hasCombatDrugs(abilities: string[] | undefined): boolean {
  return (abilities ?? []).some(a => /\bcombat drugs\b/i.test(a));
}
