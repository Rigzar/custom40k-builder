import type { ArmoryItem, Unit } from '../types/data';
export type { ArmoryItem };
import { MARK_GLYPHS, type ChaosMark } from '../types/keywords';

// Re-export so existing consumers don't need to change their import path.
export { MARK_GLYPHS };

/**
 * Keyword-derivation seam for wargear gating.
 *
 * Single place that derives armour/mark gates from the existing data encoding.
 * See types/keywords.ts for the typed vocabulary (ChaosMark, ArmourKeyword, MARK_GLYPHS).
 * See types/unit-types.ts for canonical unit type strings.
 * See rules-model/_engine.md §10 and engine/codex_csm/digest.md for full docs.
 */

/** The Chaos Mark this item requires (derived from its trailing glyph), or null if unrestricted. */
export function itemRequiredMark(name: string): ChaosMark | null {
  return (MARK_GLYPHS[name.slice(-1)] as ChaosMark) ?? null;
}

/** Item name with any trailing Chaos-Mark glyph stripped (for display). Keep in sync with
 *  MARK_GLYPHS — ᵀ is deliberately NOT here (it is Terminator-compat, not a mark). */
export function stripMarkGlyph(name: string): string {
  return name.replace(/[ˢᴷᴺᶻ]$/, '');
}

/** Names that denote a Terminator-class armour profile (Terminator / Cataphractii / Tartaros). */
const TERM_ARMOUR_RE = /terminator|cataphractii|tartaros/i;
export function isTerminatorArmourName(name: string): boolean {
  return TERM_ARMOUR_RE.test(name);
}

/**
 * Does this model restrict its armory picks to the ᵀ (Terminator-compatible) subset?
 *
 * Rules (grounded, CSM Armory.html): "Models wearing Cataphractii or Terminator armor can only
 * receive equipment with ᵀ." Both armour keywords gate identically to the ᵀ subset — they differ
 * only in the invulnerable save (Cataphractii 4+ / Terminator 5+), not in what wargear they allow.
 *
 * The restriction fires when the model carries a Terminator-class armour keyword, whether
 * INNATE (the datasheet bakes it in — `unit.armourKeyword`) or DYNAMICALLY BOUGHT (the model has
 * purchased a `Terminator armor` / `Cataphractii armor` equipment item — passed in
 * `boughtArmourNames`). The legacy ability-string fallback ("Cataphractii armor …") is kept for
 * any unit not yet carrying an explicit `armourKeyword`.
 */
export function modelRestrictsToTermSubset(unit: Unit, boughtArmourNames: string[] = []): boolean {
  if (unit.armourKeyword && isTerminatorArmourName(unit.armourKeyword)) return true;
  if (boughtArmourNames.some(n => isTerminatorArmourName(n))) return true;
  return (unit.abilities ?? []).some(a => a.toLowerCase().startsWith('cataphractii armor'));
}

/** Names that denote a Gravis armour profile. */
const GRAVIS_ARMOUR_RE = /gravis/i;
export function isGravisArmourName(name: string): boolean {
  return GRAVIS_ARMOUR_RE.test(name);
}

/**
 * Does this model restrict its armory picks to the ᴳ (Gravis-compatible) subset?
 *
 * Rules (grounded, SM Armory.html L69): "Models wearing Gravis armor can only receive equipment
 * with ᴳ." Mirrors the ᵀ/Terminator gate exactly. Fires when the model carries Gravis armour,
 * whether INNATE (datasheet — `unit.armourKeyword` "Gravis", or the baked "Gravis armor" ability)
 * or DYNAMICALLY BOUGHT (a purchased `Gravis armor` equipment item, in `boughtArmourNames`). Gravis
 * and Terminator are mutually exclusive ("not combinable"), so at most one subset gate applies.
 */
export function modelRestrictsToGravisSubset(unit: Unit, boughtArmourNames: string[] = []): boolean {
  if (unit.armourKeyword && isGravisArmourName(unit.armourKeyword)) return true;
  if (boughtArmourNames.some(n => isGravisArmourName(n))) return true;
  return (unit.abilities ?? []).some(a => a.toLowerCase().startsWith('gravis armor'));
}

/**
 * Parse a unit's unit_type string into individual type keywords.
 * e.g. "Character Model, Infantry" → ["Character Model", "Infantry"]
 */
export function getUnitTypes(unit: Unit): string[] {
  return unit.unit_type.split(/[,;]/).map(s => s.trim()).filter(Boolean);
}

/**
 * Role keywords derived from unit name — catches legacy units whose keywords[] is empty
 * but whose name encodes their role (e.g. SM "Librarian", "Chaplain Dreadnought").
 * Mirrors BSData's explicit categoryLinks for units that pre-date the keyword model.
 */
const ROLE_KW_FROM_NAME: Array<[RegExp, string]> = [
  [/librarian/i,      'Psyker'],
  [/sorcerer/i,       'Psyker'],
  // Distinct from the 'Psyker' line above — some Armory items (CSM "Familiar": "Only for
  // Sorcerers") name the SPECIFIC unit, not the broader Psyker role, which would wrongly also
  // cover Tzaangor Shaman/Rubric Marines/Scarab Occult Terminators/Dark Commune (also is_psyker).
  [/sorcerer/i,       'Sorcerer'],
  [/shaman/i,         'Psyker'],
  [/dark commune/i,   'Psyker'],
  [/rubric/i,         'Psyker'],
  [/scarab occult/i,  'Psyker'],
  [/dark apostle/i,   'Priest'],
  [/warpsmith/i,      'Warpsmith'],
  [/lieutenant/i,     'Lieutenant'],
  [/apothecary/i,     'Apothecary'],
  [/\bchaplain\b/i,   'Chaplain'],
  [/\bancient\b/i,    'Ancient'],
  [/techmarine/i,     'Techmarine'],
  [/dreadnought/i,    'Dreadnought'],
  [/herald/i,         'Herald'],
];

function roleKeywordsFromName(unitName: string): string[] {
  return ROLE_KW_FROM_NAME
    .filter(([re]) => re.test(unitName))
    .map(([, kw]) => kw);
}

/**
 * Compute the full effective keyword set for a unit at list-building time.
 * Mirrors BattleScribe's categoryLinks: the union of everything the unit "is".
 *
 * Sources (merged, normalised to lowercase, deduplicated):
 *   1. unit.keywords        — faction + explicit roles: ["Chaos Space Marine", "Psyker"…]
 *   2. unit_type parsed     — type strings: ["Infantry", "Character Model"…]
 *   3. boolean flags        — is_psyker → "Psyker", is_priest → "Priest", etc.
 *   4. name-derived roles   — ROLE_KW_FROM_NAME regex table (legacy units w/ empty keywords[])
 *   5. unit.armourKeyword   — INNATE armour class: "Terminator", "Cataphractii", "Gravis"…
 *                             (Blightlords have Cataphractii innately; Chaos Terminators have Terminator)
 *   6. selectedMark         — e.g. "Mark of Nurgle"
 *   7. boughtArmourKws      — armour BOUGHT from armory: ["Cataphractii"…]
 */
export function effectiveKeywords(
  unit: Unit,
  selectedMark?: string | null,
  boughtArmourKws: string[] = [],
): string[] {
  const kws: string[] = [
    ...(unit.keywords ?? []),
    ...getUnitTypes(unit),
    ...(unit.armourKeyword ? [unit.armourKeyword] : []),
    // Cataphractii and Tartaros are sub-types of Terminator armor — a unit wearing either
    // also counts as "Terminator" for equipment requirements (BSData: sub-category).
    // This lets Blightlords (Cataphractii) pass requires_keywords: ["Terminator"] checks.
    ...(unit.armourKeyword && isTerminatorArmourName(unit.armourKeyword) &&
        unit.armourKeyword.toLowerCase() !== 'terminator' ? ['Terminator'] : []),
    // Derived from boolean flags (works even when keywords[] is empty)
    ...(unit.is_psyker  ? ['Psyker']   : []),
    ...(unit.is_priest  ? ['Priest']   : []),
    ...(unit.is_vehicle ? ['Vehicle']  : []),
    ...(unit.is_monster ? ['Monster']  : []),
    ...(unit.is_character ? ['Character'] : []),
    // Role keywords derived from unit name (legacy SM/CD units with empty keywords[])
    ...roleKeywordsFromName(unit.name),
    ...(selectedMark ? [selectedMark] : []),
    ...boughtArmourKws,
  ];
  return [...new Set(kws.map(k => k.toLowerCase()))];
}

/**
 * instanceOf gate — mirrors BattleScribe's condition type="instanceOf".
 *
 * Returns true (BLOCKED) when item.requires_keywords is set and NONE of the required
 * keywords are present in the buyer's effective keyword set (OR semantics).
 *
 * OR semantics: requires_keywords: ["Cataphractii","Terminator"] passes if the unit has
 * EITHER keyword. This matches "Only for Cataphractii or Terminator armor."
 *
 * Items with no requires_keywords are never blocked by this gate.
 */
export function isItemRequirementsBlocked(
  item: ArmoryItem,
  unitEffectiveKeywords: string[],
): boolean {
  if (!item.requires_keywords?.length) return false;
  return !item.requires_keywords.some(req =>
    unitEffectiveKeywords.includes(req.toLowerCase())
  );
}

/**
 * Army-wide gate (distinct from isItemRequirementsBlocked, which checks the BUYER's own
 * keywords): is `item.requires_army_item` set, and does NO unit anywhere in the roster
 * (rosterArmoryItemNames — flattened item names from every entry's `armory[]`) carry it?
 *
 * Models "<X> grants the model and further units from this codex access to <X> equipment/units"
 * (e.g. Inquisition Ordo Hereticus/Malleus/Xenos): picking the unlock item on ANY model opens
 * the gated equipment for the WHOLE army, not just the buyer. Takes a minimal structural shape
 * so it works for both ArmoryItem and Unit (both carry `requires_army_item`).
 *
 * (v0.66: the old "Ordo X Warband" Troops units — gated this way — were replaced by the single
 * Ordo-agnostic "Henchman Warband"; this gate now only matters for armory items.)
 *
 * Items/units with no requires_army_item are never blocked by this gate.
 */
export function isArmyItemGateBlocked(
  item: { requires_army_item?: string | null },
  rosterArmoryItemNames: string[],
): boolean {
  if (!item.requires_army_item) return false;
  return !rosterArmoryItemNames.includes(item.requires_army_item);
}

/**
 * Inquisition Army Customisation Legacies (Ordo Hereticus/Malleus/Xenos/Minoris) — replaces
 * the old per-model "Ordo Hereticus/Malleus/Xenos" armory-item pick (FAQ #5-grounded
 * Informacion/Inquisition.ods "Army Customisation" sheet, 2026-06-13).
 *
 * "The army has access to the Ordo X Armory and Ordo X Warbands" / Ordo Minoris "every
 * character may select a single item from either the Ordo Hereticus, Malleus or Xenos
 * Armory... the army may include a single Ordo Hereticus, Malleus or Xenos Warband" — for
 * gating purposes (requires_army_item: "Ordo X") both forms unlock the same set of names.
 * The Ordo Minoris per-character "single item"/"single warband" caps are NOT enforced here
 * (ki-inquisition-ordo-minoris-caps-unenforced-01) — this only controls whether the gated
 * items/units are SHOWN at all.
 *
 * Returns the "Ordo X" names that should be treated as present in rosterArmoryItemNames for
 * isArmyItemGateBlocked, given the army's selected Legacy.
 */
export function inquisitionLegacyOrdoUnlocks(legacy: string | undefined): string[] {
  switch (legacy) {
    case 'Ordo Hereticus':
    case 'Ordo Malleus':
    case 'Ordo Xenos':
      return [legacy];
    case 'Ordo Minoris':
      return ['Ordo Hereticus', 'Ordo Malleus', 'Ordo Xenos'];
    default:
      return [];
  }
}

/**
 * "Chamber Militant" archetype (Grey Knights/Adeptus Sororitas/Space Marines "Army
 * Customisation" sheet, R5/R5/R6 — 2026-06-14 .ods, replaces the old always-on "Demon
 * Hunters"/"Witch hunters"/"Legacy of the Alien Hunters" Inquisition-access rules):
 * "The army has access to units from Codex: Inquisition... Treat the Inquisition units as if
 * '<Ordo>' was selected as Legacy." Maps the faction to its bound Ordo Legacy.
 */
export const CHAMBER_MILITANT_ORDO: Record<string, string> = {
  'Grey Knights': 'Ordo Malleus',
  'Adeptus Sororitas': 'Ordo Hereticus',
  'Space Marines': 'Ordo Xenos',
};

/**
 * When "Chamber Militant" is active, the army gains its own Inquisition units (no [Allied]
 * badge — own roster, mirrors the old intrinsic_allies injection) plus the Ordo-gated Armory
 * unlock bound to that faction (see CHAMBER_MILITANT_ORDO).
 */
export function chamberMilitantOrdo(faction: string, archetype: string | null | undefined): string | null {
  if (archetype !== 'Chamber Militant') return null;
  return CHAMBER_MILITANT_ORDO[faction] ?? null;
}

/**
 * Does this item pass the Terminator-class armour gate (ᵀ)?
 *
 * Phase 1: checks `item.armour_compat` (keyword model — migrated factions).
 * Fallback: `item.term_compat` boolean (legacy — non-migrated factions).
 */
export function isItemTermCompat(item: ArmoryItem): boolean {
  if (item.armour_compat?.length) {
    return item.armour_compat.some(k => isTerminatorArmourName(k) || k.toLowerCase() === 'terminator');
  }
  return item.term_compat;
}

/**
 * Does this item pass the Gravis armour gate (ᴳ)?
 *
 * Phase 1: checks `item.armour_compat` (keyword model — migrated factions).
 * Fallback: `item.gravis_compat` boolean (legacy — non-migrated factions).
 */
export function isItemGravisCompat(item: ArmoryItem): boolean {
  if (item.armour_compat?.length) {
    return item.armour_compat.some(k => isGravisArmourName(k) || k.toLowerCase() === 'gravis');
  }
  return item.gravis_compat ?? false;
}

/**
 * Assassins' OWN canonical "Special rules" (data/source/Assassins ENG/Index.html, verbatim):
 *   "Cults Abominatioe: Any Chaos army may select either a single Assassin or one of each
 *    for a single Elite slot."
 *   "Execution Force: Any Imperial army may select either a single Assassin or one of each
 *    for a single Elite slot."
 * This is a UNIVERSAL grant from the Assassins' own datasheet — NOT the narrower GK "Demon
 * Hunters"/Sororitas "Witch hunters" "access to assassins" clause (Inquisition.ods). It
 * applies to ANY Chaos army or ANY Imperial army. Faction lists below mirror the existing
 * landing-page categories (LandingPage.tsx CATEGORIES — "Chaos"/"Imperium"), confirmed
 * against the user 2026-06-07: Inquisition counts as Imperial; the Horus Heresy/Escalation
 * supplements do NOT (they enter via archetype injection with their own separate rules, not
 * as standalone "armies").
 */
const CHAOS_ARMY_FACTIONS = ['Chaos Space Marines', 'Chaos Daemons'];
const IMPERIAL_ARMY_FACTIONS = [
  'Space Marines', 'Imperial Guard', 'Adeptus Mechanicus', 'Adeptus Custodes',
  'Adeptus Sororitas', 'Grey Knights', 'Inquisition',
];

/** Does this faction count as a "Chaos army" / "Imperial army" for the Assassins' own
 *  "Cults Abominatioe"/"Execution Force" grant? Returns null if neither (e.g. Xenos). */
export function getAssassinAccessAlignment(factionName: string): 'chaos' | 'imperial' | null {
  if (CHAOS_ARMY_FACTIONS.includes(factionName)) return 'chaos';
  if (IMPERIAL_ARMY_FACTIONS.includes(factionName)) return 'imperial';
  return null;
}

/** Display label for the Assassins' grouping section, per alignment. */
export function assassinAccessGroupLabel(alignment: 'chaos' | 'imperial'): string {
  return alignment === 'chaos' ? 'Cults Abominatioe' : 'Execution Force';
}

export interface MarkGateCtx {
  /**
   * When true the armory source carries no Chaos Marks, so a trailing ᵀ must NOT be read as Mark of
   * Tzeentch (e.g. the Horus Heresy supplement, where ᵀ means Terminator-compatible). See
   * ki-hh-tcollision-01.
   */
  markless?: boolean;
  /** The model's effective Chaos Mark (locked / archetype-forced / chosen). */
  effectiveMark?: string | null;
}

/** True when the item requires a Chaos Mark the model doesn't carry (so it cannot be bought). */
export function isItemMarkBlocked(arm: ArmoryItem, ctx: MarkGateCtx): boolean {
  if (ctx.markless) return false;
  const req = itemRequiredMark(arm.name);
  if (!req) return false;
  return req !== (ctx.effectiveMark ?? null);
}
