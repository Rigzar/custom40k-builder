import type { FactionData, Unit } from '../types/data';
import type { ArchetypeRule } from '../engine/archetypes/base';

export type MarkName = 'Undivided' | 'Khorne' | 'Nurgle' | 'Slaanesh' | 'Tzeentch';

/** The four gods a "Mark of Chaos" purchase covers. Undivided is not one of them — it is the
 *  absence of a god, which a unit with no native mark group expresses by having no mark at all. */
const GODS: MarkName[] = ['Khorne', 'Nurgle', 'Slaanesh', 'Tzeentch'];
const ALL: MarkName[] = ['Undivided', ...GODS];

/**
 * Whether a unit may be given a Mark of Chaos, and which ones.
 *
 * This used to be three conditions inlined in `UnitCard`, and one of them was wrong in a way that
 * no amount of correct data could fix: the picker required `data.animosity` to be non-empty, and
 * `animosity.json` exists ONLY for Chaos Space Marines and Chaos Daemons. Every other faction
 * loads `{}` from the loader's `noRules` default. So the two archetypes that exist precisely to
 * let a non-Chaos army buy Marks — Adeptus Mechanicus' DARK MECHANICUM and Imperial Guard's
 * TRAITOR GUARD — could never show a single Mark button, while the pricing, the validator, the
 * armoury tabs and the resolver all supported them correctly. Reported by DirtyHerbert on Discord
 * for Dark Mechanicum; Traitor Guard was the same bug and nobody had hit it.
 *
 * It lives here, out of the component, so it can be asserted headlessly — the picker is the one
 * place this was wrong and the one place a component test could not reach.
 */
export function markAccess(
  unit: Unit,
  data: FactionData,
  rule: ArchetypeRule | null | undefined,
  slot: string,
  markIsForced: boolean,
  hasMarkGroup: boolean,
): { show: boolean; marks: MarkName[] } {
  // A locked mark is part of the datasheet and a forced one comes from the archetype; neither is
  // the player's to change.
  if (unit.locked_mark || markIsForced) return { show: false, marks: [] };

  const granted = !!rule?.grantsMarkPurchase;

  // The faction can field Marks at all: natively (it has an animosity table, i.e. Chaos) or
  // because the chosen archetype buys the right in.
  const factionHasMarks = Object.keys(data.animosity ?? {}).length > 0 || granted;
  if (!factionHasMarks) return { show: false, marks: [] };

  // WHICH units. A native mark group says so on the datasheet. `grantsMarkPurchase` is codex
  // wording — "ALL units can purchase a Mark of Chaos" — so it is not limited to HQs. The bare
  // HQ fallback stays for Chaos factions, where an HQ may take a Mark without the datasheet
  // spelling out a group.
  const show = hasMarkGroup || granted || slot === 'HQ';
  if (!show) return { show: false, marks: [] };

  const group = unit.option_groups.find(g => g.constraint.type === 'mark');
  if (group) return { show: true, marks: group.choices.map(c => c.name as MarkName) };
  return { show: true, marks: granted ? GODS : ALL };
}
