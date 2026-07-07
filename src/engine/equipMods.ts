// Shared equipment-mod parsing used by both UnitCard (live view) and PrintView.

export interface EquipMods {
  statDeltas: Partial<Record<string, number>>;
  /** Stat values SET to a fixed value (e.g. "WS → 4+"). Applied only if better than current.
   *  Values are stored as strings matching the stat format ("4+", "3+", "-", etc.). */
  statSets: Partial<Record<string, string>>;
  armorSave: number | null;
  invulnSave: number | null;
  grantedAbilities: string[];
}

const EQUIP_STAT_MAP: [RegExp, string][] = [
  [/\+(\d+)\s+toughness/i,       'T'],
  [/\+(\d+)\s+attacks?/i,        'A'],
  [/\+(\d+)\s+strength/i,        'S'],
  [/\+(\d+)\s+wounds?/i,         'W'],
  [/\+(\d+)"\s+movement/i,       'M'],
  [/\+(\d+)\s+initiative/i,      'I'],
  [/\+(\d+)\s+leadership/i,      'LD'],
  // SOURCE: Marksman honours "The model gains +1 Ballistic skill."
  [/\+(\d+)\s+ballistic\s+skill/i, 'BS'],
  // SOURCE: Swordsman honours "The model gains +1 Weapon skill."
  [/\+(\d+)\s+weapon\s+skill/i,    'WS'],
];

// Descriptions that indicate the bonus applies to OTHER units/a WEAPON, not the bearer's stat block.
// "one weapon of the model gains" → bonus goes to a single weapon (e.g. Artifact of Gork ... or Mork),
// not to the model's base stats.
const AURA_PHRASES = /attached unit|friendly unit|friendly model|enemy unit|enemy model|the target|all models of|models in the target|models from an|one (?:melee |ranged )?weapon of the model/i;

// Quoted words that name a UNIT TYPE, not an ability. When an item says "gains the unit type 'Bike'"
// the type system (ArmoryItem.effect → adds_unit_types) owns it — it must NOT also be listed as a
// granted ability, or it would show twice (once as a type, once as an ability).
const UNIT_TYPE_WORDS = new Set([
  'bike', 'jet bike', 'jump pack infantry', 'monstrous creature', 'monstrous infantry',
  'walker', 'character model',
]);
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
/** Set of normalized base-ability names (split on commas; described abilities use the part before ':'). */
function baseAbilitySet(baseAbilities: string[]): Set<string> {
  const set = new Set<string>();
  for (const a of baseAbilities) {
    for (const part of a.split(/[,;]/)) set.add(norm(part.split(':')[0]));
  }
  return set;
}

/** Lower save = better. Extract (armorSave, invulnSave) from a description for ranking armour. */
function readSaves(desc: string): { sv: number; inv: number } {
  const a = desc.match(/(\d)\+\s+armou?r\s+save/i);
  const i = desc.match(/(\d)\+\s+invulnerable\s+save/i);
  return { sv: a ? parseInt(a[1]) : 99, inv: i ? parseInt(i[1]) : 99 };
}

/** Parse a stat value string to a numeric comparison value (lower = better for saves/skills).
 *  "4+" → 4, "-" → 99 (effectively can't do it), "1+" → 1 */
function parseSaveValue(v: string): number {
  const m = v.match(/^(\d+)\+/);
  return m ? parseInt(m[1]) : 99;
}

export function parseEquipMods(
  items: { name: string; desc: string; armourKeyword?: string }[],
  innateArmour?: string,
  baseAbilities: string[] = [],
): EquipMods {
  const mods: EquipMods = { statDeltas: {}, statSets: {}, armorSave: null, invulnSave: null, grantedAbilities: [] };
  const baseSet = baseAbilitySet(baseAbilities);

  // Single-slot armour: a model wears at most ONE armour. If several armour items are present
  // (an invalid build the validator flags), apply only the most protective one's profile so the
  // displayed stats never stack (+stats/saves) — the armour overrides, it does not accumulate.
  const armourItems = items.filter(i => i.armourKeyword);
  let activeArmour: typeof items[number] | null = null;
  for (const it of armourItems) {
    if (!activeArmour) { activeArmour = it; continue; }
    const a = readSaves(it.desc), b = readSaves(activeArmour.desc);
    if (a.sv < b.sv || (a.sv === b.sv && a.inv < b.inv)) activeArmour = it;
  }
  const effective = items.filter(i => !i.armourKeyword || i === activeArmour);

  for (const it of effective) {
    const desc = it.desc;
    if (!desc) continue;
    // A bought armour on a unit that ALREADY wears armour innately is a SWAP, not an addition:
    // the base profile already bakes in the shared armour bonuses (+1 T / +1 A / Sv), so only the
    // save/invuln may change. Suppress the bought armour's stat deltas so they do not double-apply.
    const isArmourSwap = !!it.armourKeyword && !!innateArmour;
    // Only apply stat deltas when the bonus clearly applies to the bearer, not an aura for other units
    if (!isArmourSwap && !AURA_PHRASES.test(desc)) {
      // Positive stat deltas: "gains +N Stat"
      for (const [re, key] of EQUIP_STAT_MAP) {
        const m = desc.match(re);
        if (m) mods.statDeltas[key] = (mods.statDeltas[key] ?? 0) + parseInt(m[1]);
      }
      // SET stat: "improves its X value to Y" / "improves its X to Y" (e.g. Living vehicle "WS to 4+")
      // Applied only when the new value is better (lower number for saves/skills).
      // SOURCE patterns: "improves its WS value to 4+, unless it is already better"
      const setMatch = desc.match(/improves? its\s+(\w+)(?:\s+value)?\s+to\s+([\d+\-]+)/i);
      if (setMatch) {
        const statKey = setMatch[1].toUpperCase();
        const setValue = setMatch[2].includes('+') ? setMatch[2] : setMatch[2] + '+';
        if (!mods.statSets[statKey] || parseSaveValue(setValue) < parseSaveValue(mods.statSets[statKey]!)) {
          mods.statSets[statKey] = setValue;
        }
      }

      // Negative stat deltas: "reduces its X and Y values by N" (e.g. Daemonic possession)
      // SOURCE: Daemonic possession — "reduces its BS and WS values by -1"
      const reduceMatch = desc.match(/reduces? its\s+([\w\s]+)\s+values?\s+by\s+[-–]?(\d+)/i);
      if (reduceMatch) {
        const delta = -parseInt(reduceMatch[2]);
        // Parse individual stat names from "BS and WS" or "BS"
        const statNames = reduceMatch[1].split(/\s+and\s+|\s*,\s*/i);
        for (const sn of statNames) {
          const snTrim = sn.trim().toUpperCase();
          if (snTrim === 'BS' || snTrim === 'WS' || snTrim === 'S' || snTrim === 'T' || snTrim === 'A' || snTrim === 'I' || snTrim === 'LD') {
            mods.statDeltas[snTrim] = (mods.statDeltas[snTrim] ?? 0) + delta;
          }
        }
      }
    }
    const armor = desc.match(/(\d)\+\s+armou?r\s+save/i);
    if (armor) { const v = parseInt(armor[1]); if (mods.armorSave === null || v < mods.armorSave) mods.armorSave = v; }
    const invuln = desc.match(/(\d)\+\s+invulnerab(?:le|ility)\s+save/i);
    if (invuln) { const v = parseInt(invuln[1]); if (mods.invulnSave === null || v < mods.invulnSave) mods.invulnSave = v; }
    // "All [type] weapons gain 'X'" → handled by the weapon table injection in resolver.ts.
    // Don't also add to grantedAbilities — that would duplicate the display.
    const isGlobalWeaponAbility = /\bAll\s+\w*\s*weapons?\b.*\bgain\b/i.test(desc);
    if (!isGlobalWeaponAbility) {
      // Match both double-quotes "X" and single-quotes 'X' (armory items use both)
      for (const match of Array.from(desc.matchAll(/["']([^"']+)["']/g))) {
        const ab = match[1];
        // A quoted unit-type word is handled by the type system, not shown as an ability.
        if (UNIT_TYPE_WORDS.has(ab.toLowerCase().trim())) continue;
        // Only add what the model doesn't already have (don't re-grant a base ability).
        if (baseSet.has(norm(ab))) continue;
        if (!mods.grantedAbilities.includes(ab)) mods.grantedAbilities.push(ab);
      }
    }
  }
  return mods;
}

/** Whether a daemon-weapon trait's description applies to a chosen weapon.
 *  SOURCE pattern: "The weapon gains X." (Dark, Unstoppable) */
export function isWeaponTrait(desc: string | undefined): boolean {
  return /\bthe weapon gains\b/i.test(desc ?? '');
}

/** Whether a daemon-weapon or vehicle upgrade grants the model a NEW weapon.
 *  Patterns:
 *   "The model gains the 'X' ranged weapon." (Kai daemon weapon)
 *   "The model gains a X."                   (Hunter-killer missile vehicle upgrade)
 *   "The model gains the 'X' weapon"          (Living vehicle vehicle upgrade)
 *   "The vehicle/model receives an additional weapon: X." (Orks vehicle equipment)
 */
export function isGrantWeapon(desc: string | undefined): boolean {
  return /\bthe model gains (?:the ['"][^'"]+['"]\s+\w+\s+weapon|a [\w\s-]+(?:missile|weapon|gun|cannon))\b|\bthe (?:model|vehicle) receives an additional weapon:/i
    .test(desc ?? '');
}

/** Extract the weapon name granted by an item with isGrantWeapon=true. */
export function extractGrantedWeaponName(desc: string): string | null {
  // Pattern 1: "The model gains the 'X' ... weapon"
  const m1 = desc.match(/\bthe model gains the ['"]([^'"]+)['"]\s+\w+\s+weapon/i);
  if (m1) return m1[1];
  // Pattern 2: "The model gains a X." (X = weapon name ending in known suffixes)
  const m2 = desc.match(/\bthe model gains a ([\w\s-]+(?:missile|weapon|gun|cannon))\b/i);
  if (m2) return m2[1].trim();
  // Pattern 3: "The vehicle/model receives an additional weapon: X."
  const m3 = desc.match(/\bthe (?:model|vehicle) receives an additional weapon:\s*([^.]+)\./i);
  if (m3) return m3[1].trim();
  return null;
}

/** Whether an item may only be taken once (has "Unique" in description). */
export function isUniqueItem(desc: string | undefined): boolean {
  return /\bUnique\b/.test(desc ?? '');
}

/** Whether an item carries the "Unwieldy" weapon ability — Core Rules glossary: "each model may
 *  carry only one Unwieldy item" (a per-model cap, distinct from "Unique"'s per-army cap). */
export function isUnwieldyItem(desc: string | undefined): boolean {
  return /\bUnwieldy\b/.test(desc ?? '');
}

/** Whether an equipment item must target a specific weapon when purchased.
 *  SOURCE patterns (Armory.html):
 *   "One weapon of the model gains..."         → Chaos artifact, Cursed blade
 *   "One melee weapon of the model gains..."   → Cursed blade
 *   "The model may re-roll...Must be purchased for each weapon separately." → Master-crafted
 *   "The model gains Deadly(x+) on one of its weapons." → Obsidian blade
 */
export function requiresWeaponTarget(desc: string | undefined): boolean {
  return /\bone (?:melee |ranged )?weapon of the model gains|on one of its weapons|purchased for each weapon/i.test(desc ?? '');
}

/** Whether an equipment item explicitly allows multiple copies per unit.
 *  SOURCE patterns (Armory.html):
 *   "Can be taken multiple times."                        → Chaos artifact, Psychic training
 *   "Must be purchased for each weapon separately."       → Master-crafted weapon
 */
export function isMultipleAllowed(desc: string | undefined): boolean {
  return /can be taken multiple times|purchased for each weapon/i.test(desc ?? '');
}

/** "May be taken up to N times per model" (e.g. Tau Seeker missile: up to 2) — the once-per-model
 *  cap multiplies by N instead of being a flat single copy. Defaults to 1 (the ordinary single-copy
 *  case) when the item's desc doesn't state an explicit multiplier. */
export function multiplesPerModel(desc: string | undefined): number {
  const m = (desc ?? '').match(/up to (\d+) times per model/i);
  return m ? parseInt(m[1], 10) : 1;
}

/** The 16 named Ork "Kustom Job" armory items (Armory.html, unit-gated by prose — "Vehicle only" /
 *  "Mek only" / "Walker only" / "Spanna only" / "Warbuggy only" — not by a structural data field, so
 *  there's no other way to identify them than this canonical name list). The "Waaagh! Coast
 *  Kustoms" Army Trait lets each be taken one additional time — see isOrkKustomJob's only caller. */
const ORK_KUSTOM_JOB_NAMES = new Set([
  'Bionik Oiler', 'Da Booma', 'Eavy armour cabin', 'Enhanced Runt-Sucker', 'Extra-Kustom Weapon',
  'Fortress on Wheels', 'Gyroscopic Whirlygig', 'More Dakka', 'Nitro Squigs', 'Press the Button',
  'Shokka Hull', 'Smoky Gubbinz', 'Souped-up Speshul', 'Squig-hide Tyres', 'Stompamatic Pistons',
  'Zzapkrumpaz',
]);

export function isOrkKustomJob(name: string): boolean {
  return ORK_KUSTOM_JOB_NAMES.has(name);
}

/** How many copies of a named weapon each model starts with, parsed from the unit's
 *  `equipped_with` text (e.g. "A Talos is equipped with: 2 Macro-scalpels; Twin splinter rifle."
 *  → 2 for "Macro-scalpel"). Defaults to 1 when no leading count is found — the overwhelmingly
 *  common case of a single copy per model. Needed because the `replaces` hide-threshold and the
 *  displayed remaining-count both assume 1 copy/model unless told otherwise (ki-replaces-swap-
 *  manual-review-01's Talos/Carnifex Brood — each has 2 copies of the same melee weapon per
 *  model, with independent swap groups for each copy). */
export function weaponCopiesPerModel(equippedWith: string | undefined, weaponName: string): number {
  if (!equippedWith) return 1;
  const escaped = weaponName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const m = equippedWith.match(new RegExp(`(\\d+)\\s+${escaped}s?\\b`, 'i'));
  return m ? parseInt(m[1], 10) : 1;
}

/**
 * Parse the best (lowest = strongest) invulnerability save from a unit's base ability strings.
 * Grounded in core_rules_text.txt: Daemon=5+, Greater Daemon=4+, Berserk(X+)=X+, Seal of
 * corruption=4+, Warded=6+ (or improves existing), etc.
 * Returns the numeric value (e.g. 5 for "5+") or null if none found.
 */
export function parseInvSaveFromAbilities(abilities: string[]): number | null {
  let best: number | null = null;
  for (const ab of abilities) {
    // Direct patterns: "X+ invulnerable save" / "X+ invulnerability save"
    const direct = ab.match(/(\d)\+\s+invulnerab(?:le|ility)\s+save/gi);
    if (direct) {
      for (const m of direct) {
        const v = parseInt(m);
        if (!isNaN(v) && (best === null || v < best)) best = v;
      }
    }
    // Named ability patterns (canonical from core rules):
    // "Daemon" ability → 5+ inv
    if (/^Daemon\b/i.test(ab.trim())) {
      if (best === null || 5 < best) best = 5;
    }
    // "Greater Daemon" → 4+
    if (/^Greater Daemon\b/i.test(ab.trim())) {
      if (best === null || 4 < best) best = 4;
    }
    // "Berserk(X+)" → X+
    const berserk = ab.match(/\bBerserk\((\d)\+\)/i);
    if (berserk) {
      const v = parseInt(berserk[1]);
      if (!isNaN(v) && (best === null || v < best)) best = v;
    }
  }
  return best;
}

// isUnitRestrictionBlocked removed — replaced by isItemRequirementsBlocked in engine/keywords.ts.
// Restrictions are now stored as explicit fields on ArmoryItem:
//   requires_unit_types, requires_armour_keywords, requires_unit_name_contains.

/**
 * Extract the traits a weapon gains from a daemon-weapon description.
 * "The weapon gains 'Blood drinker'. Unique." → ["Blood drinker"]
 * "The weapon gains +1 Strength. Unique."     → ["+1 Strength"]
 */
export function extractWeaponGains(desc: string): string[] {
  const quoted = Array.from(desc.matchAll(/"([^"]+)"/g)).map(m => m[1]);
  if (quoted.length > 0) return quoted;
  const m = desc.match(/[Tt]he weapon gains\s+([^.]+)/i);
  if (m) return [m[1].replace(/\s*Unique\.?\s*$/, '').trim()];
  return [];
}
