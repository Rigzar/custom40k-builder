/**
 * factionTheme.ts — the colour a unit card wears, by which side of the galaxy it fights for.
 *
 * Asked for on the battle view: *"maybe keep the army color on each unit's tab?"* The builder
 * already tints every unit card — gold for the Imperium, green for Xenos, red for Chaos — and the
 * new view came out uniformly grey, so an army you scroll through mid-game lost the one cue that
 * says at a glance which detachment a unit belongs to. Moved out of UnitCard so both read one copy
 * rather than the battle view carrying a third set of hex values that could drift.
 */
export type FactionCat = 'chaos' | 'imperium' | 'xenos' | 'supp';

export function getFactionCat(faction: string): FactionCat {
  if (/chaos/i.test(faction)) return 'chaos';
  if (/space marines|imperial|mechanicus|custodes|sororitas|grey knights|inquisition/i.test(faction)) return 'imperium';
  if (/tau|necron|ork|eldar|genestealer|harlequin|votann|tyranid/i.test(faction)) return 'xenos';
  return 'supp';
}

/** Header background gradient. */
export const HDR_BG: Record<FactionCat, string> = {
  chaos:   'linear-gradient(135deg, #311212 0%, #1d0a0a 100%)',
  imperium:'linear-gradient(135deg, #27220f 0%, #18150a 100%)',
  xenos:   'linear-gradient(135deg, #0e2016 0%, #090f0c 100%)',
  supp:    'linear-gradient(135deg, #191828 0%, #0f0e1a 100%)',
};

/** Header border / accent colour. */
export const HDR_BORDER: Record<FactionCat, string> = {
  chaos:   '#8b1c1c',
  imperium:'#8b7a1c',
  xenos:   '#1c7a42',
  supp:    '#42427a',
};

/**
 * The faction a ROSTER ENTRY should be coloured by — its own, not the army's.
 *
 * An allied detachment is the case that matters: a Space Marines army with Imperial Guard allies
 * is still all Imperium, but a Chaos Daemons detachment inside a Chaos Space Marines army, or any
 * supplement-injected unit, belongs to a different tint than the host. `factionSource` is set on
 * exactly those entries and is empty for the army's own units.
 */
export function entryFaction(item: { factionSource?: string | null }, armyFaction: string): string {
  return item.factionSource || armyFaction;
}
