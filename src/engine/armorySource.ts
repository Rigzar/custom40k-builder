import type { FactionData } from '../types/data';

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
 * Between 2026-08-13 and 2026-08-26 this MERGED the parent's `armory_general` (weapons/equipment/
 * daemon_weapons) directly into the supplement's own General tab, so a Legion Tactical Squad's one
 * "General" list quietly contained both Horus Heresy's 5 items and every Chaos Space Marines item —
 * mixed together with no way to tell which was which. Rigzar, live 2026-08-26 after both merge
 * fixes had shipped: "se tiene que ver como se ve ahi [Scout Squad] no la armeria general mezclada
 * con la de hh" — a NATIVE unit shows the host's basic Armory and an archetype-granted foreign
 * armory as two clearly separate tabs (GENERAL / HORUS HERESY LEGIONES ASTARTES ARMOURY); an HH-
 * sourced unit should look the same way, not have them flattened into one list. The merge is gone —
 * `armory_general` here stays the supplement's own, untouched. `ArmoryModal.tsx` now renders the
 * host's `armory_general` as its own extra tab (labelled plain "General") whenever `inherits_parent_
 * armory` is set, mirroring the existing archetype-armory-tab mechanism instead of merging data.
 *
 * `armory_marks`/`armory_legions` still merge below — those already render as their OWN tabs (Mark,
 * Legacy), so combining the two sources behind the scenes doesn't create the same mixed-list problem;
 * only `armory_general` needed splitting apart.
 *
 * A supplement with a codex of its own — Assassins, Inquisition — keeps its Armory and only its
 * Armory; this merge never runs for them (`inherits_parent_armory` is unset).
 */
function withParentArmory(supp: FactionData, data: FactionData): FactionData {
  if (!supp.inherits_parent_armory) return supp;
  return {
    ...supp,
    armory_marks: { ...data.armory_marks, ...supp.armory_marks },
    armory_legions: { ...data.armory_legions, ...supp.armory_legions },
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
  // The user-picked Allied Detachment is normally a separate army with its own codex — never
  // touched. The one exception is Horus Heresy/Legio Titanicus picked directly as the Allied
  // Detachment (rather than granted by the primary's own "Legion"/"Taghmata" archetype): its
  // `inherits_parent_armory` flag means the same thing here as it does below — access to a host
  // codex's basic Armory (shown as its own separate tab by ArmoryModal, see withParentArmory's
  // doc comment), and that host is the PRIMARY faction, same as the archetype path.
  if (item.factionSource === alliedFaction && alliedData) return withParentArmory(alliedData, data);

  const supp = supplementData[item.factionSource];
  if (!supp) return data;
  return withParentArmory(supp, data);
}
