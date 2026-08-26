import type { Armory, ArmoryItem, FactionData } from '../types/data';

/**
 * Which faction's Armory a roster entry shops from.
 *
 * Normally that is simply the entry's own faction. The exception is a supplement whose front page
 * says it is not a codex in its own right — Forces of the Machine God opens with "The following
 * rules can only be used in conjunction with the Adeptus Mechanicus Codex", the Legiones Astartes
 * supplement with the same sentence about Space Marines or Chaos Space Marines. A unit from one of
 * these supplements has full access to the HOST codex's basic Armory, not just its own supplement
 * catalog (confirmed by the ruleset's author, Dominic, on Discord 2026-08-26: "HH supplement when
 * u add to an army they got the basic army armory?? — Yes").
 *
 * Between 2026-08-13 and 2026-08-26 this instead merged ONLY the parent's `category: 'veteran'`/
 * `'vehicle'` items (fixing a real gap — a Secutarii Axiarch had no Veteran button, a Triaros was
 * offered infantry gear instead of vehicle equipment) plus a category FILTER on top of that, added
 * 2026-08-24 on a report that turned out to be a misunderstanding ("no deberian tener acceso a la
 * armeria de csm normal") — Dominic's answer above retracts it: the full host Armory, general
 * weapons and equipment included, is correct. The filter is gone; only the opt-in mechanism
 * (`inherits_parent_armory`) remains, doing what it always did — merging the WHOLE parent
 * `armory_general` in, with the supplement's own entries winning any name clash since it's the
 * more specific book.
 *
 * A supplement with a codex of its own — Assassins, Inquisition — keeps its Armory and only its
 * Armory; this merge never runs for them (`inherits_parent_armory` is unset).
 */
function mergeArmory(own: Armory | undefined, parent: Armory): Armory {
  if (!own) return parent;
  const merge = (a: ArmoryItem[] = [], b: ArmoryItem[] = []) => {
    const seen = new Set(a.map(x => x.name.toLowerCase()));
    return [...a, ...(b ?? []).filter(x => !seen.has(x.name.toLowerCase()))];
  };
  return {
    ...own,
    weapons: merge(own.weapons as ArmoryItem[], parent.weapons as ArmoryItem[]),
    equipment: merge(own.equipment as ArmoryItem[], parent.equipment as ArmoryItem[]),
    daemon_weapons: merge(own.daemon_weapons as ArmoryItem[], parent.daemon_weapons as ArmoryItem[]),
  };
}

/**
 * The FactionData an entry's Armory UI should read. Everything except the `armory_*` fields is
 * left exactly as it was — a supplement keeps its own units, disciplines and archetypes.
 */
export function armoryDataFor(
  item: { factionSource?: string },
  data: FactionData,
  alliedFaction: string | undefined | null,
  alliedData: FactionData | null | undefined,
  supplementData: Record<string, FactionData>,
): FactionData {
  if (!item.factionSource) return data;
  // The user-picked Allied Detachment is a separate army with its own codex — never merged.
  if (item.factionSource === alliedFaction && alliedData) return alliedData;

  const supp = supplementData[item.factionSource];
  if (!supp) return data;
  if (!supp.inherits_parent_armory) return supp;

  return {
    ...supp,
    armory_general: mergeArmory(supp.armory_general, data.armory_general),
    armory_marks: { ...data.armory_marks, ...supp.armory_marks },
    armory_legions: { ...data.armory_legions, ...supp.armory_legions },
  };
}
