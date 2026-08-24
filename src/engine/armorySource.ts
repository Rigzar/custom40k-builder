import type { Armory, ArmoryItem, FactionData } from '../types/data';

/**
 * Which faction's Armory a roster entry shops from.
 *
 * Normally that is simply the entry's own faction. The exception is a supplement whose front page
 * says it is not a codex in its own right — Forces of the Machine God opens with "The following
 * rules can only be used in conjunction with the Adeptus Mechanicus Codex", the Legiones Astartes
 * supplement with the same sentence about Space Marines or Chaos Space Marines — and whose
 * datasheets then lean on the parent codex for whole categories of gear it does not carry:
 *
 *   • "The unit may gain one Veteran ability."          → parent `category: 'veteran'` items
 *   • "Has access to vehicle equipment from the Armory." → parent `category: 'vehicle'` items
 *   • "The unit may select one Doctrina Imperative."     → Adeptus Mechanicus veteran items
 *
 * Neither supplement's own Armory holds a single item of either category, so a Secutarii Axiarch
 * had no Veteran button and a Triaros was offered an Arc lance and a Mag-inverter shield instead
 * of vehicle equipment (user report 2026-08-13). Eleven units across the two supplements were
 * affected, not just the two reported.
 *
 * Opt-in per supplement via `inherits_parent_armory`. A supplement with a codex of its own —
 * Assassins, Inquisition — keeps its Armory and only its Armory.
 */
function mergeArmory(own: Armory | undefined, parent: Armory): Armory {
  if (!own) return parent;
  // Only pull in the specific categories a supplement datasheet actually references from the
  // parent codex (see the file-level comment: "Veteran ability" / "vehicle equipment" are the
  // ONLY things these datasheets lean on the parent for) — not the parent's entire general
  // armory. Without this filter an HH/Legio Titanicus unit's "General" tab showed all 72 CSM (or
  // 67 AdMech) general items, including host-specific gear (Kai gun, Daemonic weapons, Force
  // weapons, ...) that has nothing to do with the "Veteran ability"/"vehicle equipment" grant and
  // was never meant to be reachable from a supplement with its own, much smaller catalog
  // (user report 2026-08-24: "no deberian tener acceso a la armeria de csm normal").
  const NEEDED_CATEGORIES = new Set(['veteran', 'vehicle']);
  const filterNeeded = (items: ArmoryItem[] = []) => items.filter(i => NEEDED_CATEGORIES.has(i.category ?? ''));
  // The supplement's own entry wins a name clash: it is the more specific book.
  const merge = (a: ArmoryItem[] = [], b: ArmoryItem[] = []) => {
    const seen = new Set(a.map(x => x.name.toLowerCase()));
    return [...a, ...filterNeeded(b).filter(x => !seen.has(x.name.toLowerCase()))];
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
