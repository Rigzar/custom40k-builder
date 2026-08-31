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

// Third element is the sign to apply to the parsed "+N" value once it reaches statDeltas.
// Most stats here (T/A/S/W/M/I/LD) print as a plain number where a higher value is better, so
// "+1 Strength" is stored as delta +1 and applyDelta() in UnitCard/PrintView adds it directly.
// BS and WS print as a save-style "X+" value where a LOWER printed number is better (same
// convention as SV — see the "stat_mod deltas are already stored in save-number space" comment
// on applyDelta()), so "+1 Ballistic skill" (an improvement) must be stored as delta -1 or it
// reads as +1 to the PRINTED number, i.e. a worse BS, not a better one.
const EQUIP_STAT_MAP: [RegExp, string, number][] = [
  [/\+(\d+)\s+toughness/i,       'T',  1],
  [/\+(\d+)\s+attacks?/i,        'A',  1],
  [/\+(\d+)\s+strength/i,        'S',  1],
  [/\+(\d+)\s+wounds?/i,         'W',  1],
  [/\+(\d+)"\s+movement/i,       'M',  1],
  [/\+(\d+)\s+initiative/i,      'I',  1],
  [/\+(\d+)\s+leadership/i,      'LD', 1],
  // SOURCE: Marksman honours "The model gains +1 Ballistic skill."
  [/\+(\d+)\s+ballistic\s+skill/i, 'BS', -1],
  // SOURCE: Swordsman honours "The model gains +1 Weapon skill."
  [/\+(\d+)\s+weapon\s+skill/i,    'WS', -1],
];

/**
 * NOTE: Eldar's "Paragon of war"/"Paragon of fate" have a shared-prefix stat grant ("+1 Strength,
 * Toughness, Wounds and Attacks") that EQUIP_STAT_MAP's per-stat regexes can only catch the FIRST
 * of. This is already handled WITHOUT a table here: both armory items carry their own
 * `effect.stat_mod` in the production JSON (data/parsed/eldar/armory/general.json), which resolver.ts
 * applies via the separate optionStatMods pipeline (item.armory loop → applyEffect(ai.effect)).
 * A SHARED_PREFIX_STAT_ITEMS table used to live here to patch the same gap from this side — it
 * double-applied T/W/A on top of that existing stat_mod (Autarch + Paragon of war + Heartstrike
 * showed T5/W5/A6 instead of T4/W4/A5, S alone stayed correct at +1). Confirmed via a temporary
 * debug log that equipMods.statDeltas itself was always {S:1,T:1,W:1,A:1} as intended — the extra
 * +1 on T/W/A came from optionStatMods, not from here. Removed 2026-08-29; don't re-add without
 * checking the item's own `effect.stat_mod` first.
 */

// Descriptions that indicate the bonus applies to OTHER units/a WEAPON, not the bearer's stat block.
// "one weapon of the model gains" → bonus goes to a single weapon (e.g. Artifact of Gork ... or Mork),
// not to the model's base stats.
const AURA_PHRASES = /attached unit|friendly unit|friendly model|enemy unit|enemy model|the target|all models of|models in the target|models from an|(?:one|all) (?:melee |ranged )?weapons? of (?:the|this) model/i;

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
  const i = desc.match(/(\d)\+\s+(?:ward|invulnerab(?:le|ility))\s+save/i);
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
  const rawEffective = items.filter(i => !i.armourKeyword || i === activeArmour);

  // GENERAL (GH#66): multiple copies of the SAME item exist because each MODEL in the squad
  // carries its own copy (per-model armory access, e.g. Kill Team Veterans buying one Jump pack
  // per model) — the displayed profile shows ONE model's stats, so a same-named item's stat
  // effect must apply exactly once, never once per copy (3 Jump packs used to show M +18").
  // Safe to dedupe unconditionally: the only "Can be taken multiple times" items with stat text
  // are the weapon-relic gateways ("One weapon of the model gains ..."), which AURA_PHRASES
  // already excludes from bearer stat deltas.
  const seenNames = new Set<string>();
  const effective = rawEffective.filter(i => {
    if (seenNames.has(i.name)) return false;
    seenNames.add(i.name);
    return true;
  });

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
      for (const [re, key, sign] of EQUIP_STAT_MAP) {
        const m = desc.match(re);
        if (m) mods.statDeltas[key] = (mods.statDeltas[key] ?? 0) + parseInt(m[1]) * sign;
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
    const invuln = desc.match(/(\d)\+\s+(?:ward|invulnerab(?:le|ility))\s+save/i);
    if (invuln) { const v = parseInt(invuln[1]); if (mods.invulnSave === null || v < mods.invulnSave) mods.invulnSave = v; }
    // "All [type] weapons gain 'X'" → handled by the weapon table injection in resolver.ts.
    // Don't also add to grantedAbilities — that would duplicate the display.
    const isGlobalWeaponAbility = /\bAll\s+\w*\s*weapons?\b.*\bgain\b/i.test(desc);
    if (!isGlobalWeaponAbility) {
      // Ability names appear in quotes, e.g. gains the ability "Deep strike" / 'Feel no pain'.
      // Match double- and single-quoted names SEPARATELY so an opening ' never pairs with a later
      // " — and guard single quotes so a contraction apostrophe (model's, it's) is NOT read as an
      // opening quote. The old combined /["']…["']/ regex captured a whole sentence fragment from
      // e.g. Shamblerot's desc ("…the model'␣s acitvation, if an enemy vehicle is within 6"…").
      // NO LOOKBEHIND. Safari only learned `(?<!…)` in 16.4, and an unsupported regex is a SYNTAX
      // error, not a runtime one — it kills the whole bundle before a line of it runs. Every
      // browser on iPadOS is WebKit, so an older iPad showed a white page and so did "Firefox" on
      // it, while desktop Firefox and Brave were fine (Discord 2026-08-06).
      // Same rule, expressed forwards: capture the character before the quote and require it to be
      // a non-alphanumeric, so a contraction apostrophe (model's, it's) is not read as an opening
      // quote. `(^|[^A-Za-z0-9])` needs the match to start one character earlier, which is why the
      // captured group is m[2] here.
      // An inches mark is a double quote too. `The model gains +6" movement and the "Jump pack"
      // rule.` made the scanner pair the inches quote with the one that opens "Jump pack", so the
      // item granted an ability literally called `" movement and the "` and the real rule name was
      // never seen. A quote straight after a digit is a measurement, never an opening quote —
      // swap those for the prime character before scanning.
      const quotable = desc.replace(/(\d)"/g, '$1″');
      const quoted = [
        ...Array.from(quotable.matchAll(/"([^"]+)"/g), m => m[1]),
        ...Array.from(quotable.matchAll(/(^|[^A-Za-z0-9])'([^']+?)'(?![A-Za-z0-9])/g), m => m[2]),
      ];
      for (const raw of quoted) {
        // Some descriptions put the sentence punctuation INSIDE the quotes — Exo-armor reads
        // `the abilities "Massive(1)," "Shock Troops," and "Unyielding."` — so the captured name
        // arrives as `Shock Troops,` and was displayed with the comma. Trim trailing sentence
        // punctuation only; a closing bracket is part of the name (Massive(1), Frenzy(1")).
        const ab = raw.replace(/[,.;:]+$/, '').trim();
        if (!ab) continue;
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
 *   "A melee weapon of the model gains..."     → Frost weapon (Space Wolves) — same single-
 *     target shape as "one weapon", just phrased with the indefinite article "a/an" instead of
 *     "one". Found via an armory-wide modifier audit: these 2 items' numeric stat deltas
 *     (+1 Strength, -1 AP/+1 Damage/Overheating) were silently never applied anywhere, because
 *     this check — the gate that makes ArmoryModal show a target-weapon picker at all — never
 *     recognized the wording as needing one in the first place.
 */
export function requiresWeaponTarget(desc: string | undefined): boolean {
  return /\b(?:one|a|an) (?:melee |ranged )?weapon of the model (?:gains|increases its)|on one of its weapons|purchased for each weapon/i.test(desc ?? '');
}

/** Whether a weapon-target item's benefit is a PICK from an enumerated list ("gains one of the
 *  following: Additional +6" Range / +1 Strength / -1 AP / +1 AT") rather than a fixed effect.
 *  ~18 items across nearly every faction (Relic of the Chapter, Chaos artefact/artifact, Regimental
 *  relic/artefact, Vault weapon, Sacred weapon, Cult relic, Shrine relic, Ancestor relic, Tomb
 *  world relic, Relic of the Ordo, Relic of the Black Library, Artifact of Gork...Mork, Prototype
 *  system, Relic of the Forgeworld, Relic of the order, Artefact of Commoragh, Heavenfall blade)
 *  need a SECOND picker (which enhancement) alongside the weapon-target one — see
 *  parseEnumerableWeaponChoices/parseEnhancementDelta below and ArmoryModal.tsx's reuse of the
 *  existing named-choice picker (already built for Eldar's Paragon of war / HH's Crusade weapon). */
export function isEnumerableWeaponChoice(desc: string | undefined): boolean {
  return /gains one of the following/i.test(desc ?? '');
}

/** Extract the enhancement option strings from an enumerable-choice item's own desc text
 *  ("- Additional +6\" Range (only for ranged weapons)" → "+6\" Range"). Read from each item's
 *  OWN text rather than a single hardcoded 4-option pool because not every item offers all 4 —
 *  Heavenfall blade (melee-only) lists just +1 Strength/-1 AP/+1 AT, no Range option. */
export function parseEnumerableWeaponChoices(desc: string): string[] {
  return Array.from(desc.matchAll(/-\s*Additional\s+([^\n(]+?)\s*(?:\(only for ranged weapons\))?\s*(?=\n|$)/gi))
    .map(m => m[1].trim());
}

/** Parse one of the 4 enhancement strings parseEnumerableWeaponChoices produces into the stat
 *  delta it means. AT is handled separately from sDelta/apDelta/rangeDelta (see atDelta on
 *  ChosenWeaponEffect) because it lives inside the weapon's abilities text ("AT(2)"), not a
 *  plain numeric column, and — like Deadly — a real improvement means incrementing whatever
 *  value is already there, not overwriting it. */
export function parseEnhancementDelta(choice: string): { rangeDelta?: number; sDelta?: number; apDelta?: number; atDelta?: number } {
  const range = choice.match(/^\+?(\d+)"?\s*Range/i);
  if (range) return { rangeDelta: parseInt(range[1], 10) };
  const str = choice.match(/^\+?(\d+)\s*Strength/i);
  if (str) return { sDelta: parseInt(str[1], 10) };
  const ap = choice.match(/^(-?\d+)\s*AP/i);
  if (ap) return { apDelta: parseInt(ap[1], 10) };
  const at = choice.match(/^\+?(\d+)\s*AT/i);
  if (at) return { atDelta: parseInt(at[1], 10) };
  return {};
}

export interface ChosenWeaponEffect {
  /** Ability text to add to the chosen weapon (e.g. "Master-crafted", "Suppression"). */
  abilities?: string[];
  sDelta?: number;
  apDelta?: number;
  dDelta?: number;
  rangeDelta?: number;
  /** +N to the weapon's shot count — the trailing number in its `type` field ("Assault 3" → 5),
   *  not a separate characteristic. Ork "More Dakka!" (SOURCE: "increases its number of shots
   *  by 2"). */
  shotsDelta?: number;
  /** +N to the weapon's existing AT(x) value — like deadlyStack, an increment on whatever is
   *  already there (AT(2) + 1 → AT(3)), not a flat floor grant. Higher AT is always better, so
   *  (unlike Deadly) this never needs to compare against mergeWeaponAbilities' own logic. */
  atDelta?: number;
  /** Obsidian blade / Cegorach's Rose: grant Deadly(5+), or improve the weapon's EXISTING
   *  Deadly(x+) by one level if it already has the rule (SOURCE: "If the weapon already has
   *  the rule, increase Deadly(x+) by 1. For example Deadly(5+) becomes Deadly(4+)."). This is
   *  a step-up from whatever the weapon already has, not "grant 5+ and keep the better of the
   *  two" (mergeWeaponAbilities' normal Deadly handling) — a weapon starting at Deadly(4+)
   *  must become Deadly(3+), not stay at 4+. */
  deadlyStack?: boolean;
  /** Crusade weapon's "Solarite" enhancement: set Strength to x3, but ONLY if the weapon's
   *  current Strength is already "x2" (SOURCE: "Only for weapons that have a x2 for their
   *  Strength value.") — narrow enough to model as its own flag rather than a generic set-value
   *  field nothing else needs. */
  solariteX2ToX3?: boolean;
}

/** Horus Heresy "Crusade weapon" (ᵀ): the item's own desc names 5 mutually-exclusive named
 *  enhancements, each with its own effect stated in that same text — a fixed named-choice pool
 *  like Eldar's "Paragon of war" (see CRUSADE_WEAPON_ENHANCEMENTS/ELDAR_EXARCH_POWERS in
 *  ArmoryModal.tsx). Every one of these 5 is fully self-contained in Crusade weapon's own
 *  description, unlike Paragon of war's Exarch Powers (see EXARCH_POWER_EFFECTS below — their
 *  effects live in the Eldar .ods's own "EXARCH POWERS" armoury section, not in Paragon of war's
 *  text, which just says "can choose a single Exarch power"). Keyed by the CHOSEN enhancement
 *  name (`sel.chosenPower`), not the item name — the item itself is also in
 *  CHOSEN_WEAPON_GRANT_ITEMS-style lookup territory but needs its effect picked at purchase time. */
export const CRUSADE_WEAPON_EFFECTS: Record<string, ChosenWeaponEffect> = {
  Chain: { abilities: ['Shred'] },
  Charnabal: { abilities: ['Quick(+1)'] },
  // SOURCE: "The weapon may re-roll all to hit rolls" — stronger than (and thus distinct from)
  // the named "Master-crafted" ability's "a single hit roll can be re-rolled", so it gets its
  // own plain-text tag rather than borrowing that name.
  'Nocturne masterwork': { abilities: ['Re-roll all hit rolls'] },
  Phoenix: { abilities: ['Armor piercing(5+)'] },
  Solarite: { solariteX2ToX3: true },
};

/**
 * Eldar Exarch Powers, granted by "Paragon of war" (Armory) or natively by 10 Aspect Warrior
 * units' own "The Exarch can gain one Exarch Power" option group. SOURCE: read directly from the
 * canonical Eldar .ods's "Armory" sheet, rows 92-109 ("EXARCH POWERS" section) — these had NEVER
 * been defined anywhere in the engine before, for ANY purchase path (confirmed by checking the 10
 * native units' own option_groups: bare `{ name, points }` choices, no `effect` field at all) —
 * not a targeting bug like the rest of this file, a genuinely unresearched rules area until now.
 * Every power costs 5pts and is individually Unique (per the .ods's own "Every Exarch power is
 * unique" note) — points/uniqueness are handled by the existing Armory purchase plumbing already,
 * not modelled here.
 * Three shapes:
 *  - `unitAbility`: a plain named/procedural ability granted to the model (and often its unit),
 *    not tied to any one weapon — shown as a granted ability, same treatment as e.g. Astartes
 *    bionics' "Warded".
 *  - `allWeapons`: "(Ranged|Melee) weapons of the model gain X" — a blanket grant across every
 *    weapon of that type, reusing the SAME mechanism already wired for Armory items worded that
 *    way (e.g. Plague ammunition), just triggered by the chosen power instead of item desc text.
 *  - Six powers (Burning heat, Crack shot, Crushing blows, Defensive stance, Lightning attacks,
 *    Surprise assault) are procedural/situational with no list-building stat to change (e.g.
 *    "may re-roll one to wound roll in melee", "gets Seeking each round") — modelled as
 *    `unitAbility` too (a descriptive reminder, matching how combat drugs' non-stat entries like
 *    Hypex/Serpentin are shown: text only, no mechanical hook).
 *  - Graceful avoidance ("4+ ward save against melee attacks") is genuinely conditional (melee
 *    only) — deliberately NOT wired into the unconditional `invulnSave` field, which would grant
 *    it against ranged attacks too; shown as descriptive text like the procedural six.
 *  - Reaper's reach ("+6\" range... and its attached unit") only applies the model's OWN half —
 *    extending it to the rest of the unit is out of scope here (no existing mechanism reaches
 *    across models for a per-weapon numeric delta); noted in the known issue.
 */
export interface ExarchPowerEffect {
  /** A granted ability shown on the model — a real named ability, OR a plain descriptive
   *  reminder for a purely procedural/conditional power with nothing to persistently apply. */
  unitAbility?: string;
  /** "(Ranged|Melee) weapons of the model gain X" — applies to every weapon of that type. */
  allWeapons?: {
    type: 'melee' | 'ranged';
    ability?: string;
    rangeDelta?: number;
    /** Dragon's bite: "+1 AT, cumulative" — incremented like Deadly-stacking, not a flat floor. */
    atDelta?: number;
    /** Heartstrike: Deadly(5+), or +1 level if the weapon already has Deadly. */
    deadlyStack?: boolean;
  };
}
export const EXARCH_POWER_EFFECTS: Record<string, ExarchPowerEffect> = {
  // SOURCE: "The model and its unit trigger the 'Shuriken' special rule on each to wound roll."
  Bladestorm: { unitAbility: 'Shuriken' },
  // SOURCE: "Ranged weapons of the model gain an additional -1 AP against units in cover." —
  // conditional (only vs. units in cover), so shown as text rather than a blanket AP delta that
  // would apply even outside cover.
  'Burning heat': { unitAbility: 'Ranged weapons gain -1 AP against units in cover' },
  // SOURCE: "One ranged weapon of the model gets the 'Seeking' ability each round." — the
  // player's own tactical pick each round, not a fixed weapon chosen at list-building time.
  'Crack shot': { unitAbility: 'One ranged weapon gains Seeking each round (player\'s choice)' },
  // SOURCE: "The model may re-roll one to wound or armor penetration roll in melee."
  'Crushing blows': { unitAbility: 'Re-roll one to-wound/armor-penetration roll in melee' },
  // SOURCE: "The model may use Defensive fire twice when getting charged."
  'Defensive stance': { unitAbility: 'May use Defensive fire twice when charged' },
  // SOURCE: "Ranged weapons of the model gain a cumulative AT(1)."
  "Dragon's bite": { allWeapons: { type: 'ranged', atDelta: 1 } },
  // SOURCE: "The model and its unit got a 4+ ward save against melee attacks." — conditional
  // (melee only), so shown as text rather than the unconditional invulnSave field.
  'Graceful avoidance': { unitAbility: '4+ ward save against melee attacks (model and unit)' },
  // SOURCE: "Melee attacks of the model gain Deadly(5+). If the model already has the rule,
  // increase Deadly(x+) by 1."
  Heartstrike: { allWeapons: { type: 'melee', deadlyStack: true } },
  // SOURCE: "The model and its unit may consolidate 6\" after winning a melee combat. If it
  // consolidates into an enemy unit, that unit may not use Defensive Fire."
  'Lightning attacks': { unitAbility: 'Consolidate 6" after winning melee; target loses Defensive Fire' },
  // SOURCE: "Melee attacks of the model gain Armor piercing(5+)."
  'Piercing strike': { allWeapons: { type: 'melee', ability: 'Armor piercing(5+)' } },
  // SOURCE: "The model and its unit gain the 'Hit & Run' ability."
  'Rapid redeployment': { unitAbility: 'Hit & Run' },
  // SOURCE: "Ranged weapons of the model and its attached unit gain +6\" range." — only the
  // model's own ranged weapons are modelled; the "and its attached unit" half has no existing
  // mechanism to reach other models for a per-weapon numeric delta.
  "Reaper's reach": { allWeapons: { type: 'ranged', rangeDelta: 6 } },
  // SOURCE: "Melee attacks of the model gain Precision(5+)."
  "Scorpion's sting": { allWeapons: { type: 'melee', ability: 'Precision(5+)' } },
  // SOURCE: "All ranged weapons of the model gain Anti-Air."
  Skyhunter: { allWeapons: { type: 'ranged', ability: 'Anti-Air' } },
  // SOURCE: "The model and its unit gain the 'Objective secured!' ability."
  'Stand firm': { unitAbility: 'Objective secured!' },
  // SOURCE: "If the model used the 'Shunting' ability this round, it may shoot one additional
  // time with each equipped Death spinner. If the model used the 'Sky dive' ability this round,
  // it doubles their shots with a Hawk's talon or Lasblaster." — purely situational.
  'Surprise assault': { unitAbility: 'Extra shots after Shunting (Death spinner) or Sky dive (Hawk\'s talon/Lasblaster)' },
};

/**
 * Named armory items that grant a FIXED (non-enumerable) effect to a chosen weapon: a numeric
 * stat delta, the Deadly-stacking rule, or an ability whose name isn't quoted in its own desc
 * text (so the generic quoted-name extraction can't find it — see extractWeaponGains). Kept as
 * an explicit table, the same pattern resolver.ts already uses for this class of problem
 * (NAMED_WEAPON_BOOST_ITEMS, RANGED_STRENGTH_BOOST_ITEMS) — each of these 16 items reads its own
 * desc text differently enough that one shared parser would be more fragile than listing them.
 * SOURCE bug (Discord, Rigzar): bought Obsidian blade, targeted a weapon in the Armory's own
 * "Apply to" picker, paid the points — no Deadly(5+) ever appeared anywhere on the weapon. Root
 * cause: the whole "apply this item's effect to the chosen weapon" step was wired on the UI side
 * (the dropdown, the stored targetWeapon) but the resolver never consumed it for anything outside
 * the daemon_weapons section (see the chosen-weapon-grant pass in resolver.ts) — every item below
 * was silently a no-op past the points charge, in every faction that has one.
 * Verified every key here against production data by exact string equality — several carry
 * combining/superscript glyphs (ᴵ, ᴱ, ʸ, the curly apostrophe in "Cegorach's Rose") that a
 * retyped-by-hand string would be one keystroke away from silently failing to match.
 */
export const CHOSEN_WEAPON_GRANT_ITEMS: Record<string, ChosenWeaponEffect> = {
  // Generic "may re-roll one to-hit roll per activation, purchased for each weapon separately"
  // reroll items across the factions that describe it in plain prose rather than quoting the
  // ability name — Space Marines' own entry already reads `gains the ability "Master-crafted"`
  // and is picked up by the generic quoted path instead, not listed here.
  'Master-crafted weapon': { abilities: ['Master-crafted'] },
  'Master-crafted weaponᴵ': { abilities: ['Master-crafted'] },
  'Forgewrought weaponᴱ': { abilities: ['Master-crafted'] },
  'Obsidian blade': { deadlyStack: true },
  'Cegorach’s Rose': { deadlyStack: true },
  'Darkstar alloyᴱ': { abilities: ['Deadly(5+)'] },
  'Quake Multigeneratorᴱ': { abilities: ['Suppression'] },
  'Relic blade': { dDelta: 1 },
  'Holy weapon': { dDelta: 1 },
  'Cursed blade': { dDelta: 1 },
  'Maelstrom Weapon': { sDelta: 1 },
  'Reaver Weapon': { sDelta: 1 },
  'Fire blade': { abilities: ['Precision(5+)'], apDelta: -2 },
  'Hungering bladeʸ': { abilities: ['Flurry(4)'] },
  'Silent bladeʸ': { abilities: ['Shield breaker(-2)'] },
  'Sorrow bladeʸ': { abilities: ['Decimate'], sDelta: 1 },
  // Found via an armory-wide modifier audit (2026-08-31): both paid for and correctly targeted
  // a weapon (once requiresWeaponTarget recognized their "a/an weapon" wording above), but their
  // own numeric deltas were never registered here, so the purchase was a silent no-op past the
  // points charge — same shape as the ~35-item bug fixed earlier this version for `targetWeapon`.
  'Frost weapon': { sDelta: 1 },
  'More Zzzap!ᴹ': { apDelta: -1, dDelta: 1, abilities: ['Overheating'] },
  'More Boom!ᴹ': { sDelta: 2 },
  'More Dakka!ᴹ': { shotsDelta: 2 },
  // CSM Daemon Weapons (`section: 'daemon_weapons'`, not 'equipment') — the other quoted-ability
  // ones in this same list (Bloodied/Entropic/Rotting/Sinful/Alacritous/etc.) already apply via
  // the separate weaponTraitMap loop that extracts quoted ability text; these 2 are the only ones
  // with a bare numeric delta instead.
  'Dark': { sDelta: 1 },
  'Wrathful': { sDelta: 2 },
};

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
export function weaponCopiesPerModel(equippedWith: string | undefined, weaponName: string, extraText?: string[]): number {
  const escaped = weaponName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Counts are written either as a digit ("2 Macro-scalpels", Talos) or as a word ("two Plague
  // spewers", Plagueburst Crawler) — both forms appear across the codices, so accept both or the
  // word-form datasheets silently fall back to 1 copy and lose their "2x" in the live profile.
  const re = new RegExp(`\\b(\\d+|${Object.keys(NUMBER_WORDS).join('|')})\\s+${escaped}s?\\b`, 'i');
  const fromText = (text: string | undefined): number | null => {
    const m = text?.match(re);
    if (!m) return null;
    const raw = m[1].toLowerCase();
    return NUMBER_WORDS[raw] ?? parseInt(raw, 10) ?? null;
  };
  // The weapon isn't always in the base loadout: a swap group gated by `requires_choice` (e.g.
  // Galatus Contemptor Dreadnought's "Can swap each Infernus incinerator", only reachable after
  // buying "Achillus dreadspear & 2 Infernus incinerators" from a DIFFERENT option group) grants
  // weapons that never appear in `equipped_with` at all — the count only exists in the granting
  // CHOICE's own name text. Callers pass `g.requires_choice` (the exact choice-name strings) as a
  // fallback source to search when the base loadout has nothing.
  return fromText(equippedWith) ?? (extraText ?? []).reduce<number | null>((found, t) => found ?? fromText(t), null) ?? 1;
}

/** Written-out counts used in `equipped_with` text. */
const NUMBER_WORDS: Record<string, number> = {
  two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
};

/**
 * Parse the best (lowest = strongest) ward save from a unit's base ability strings.
 * Grounded in core_rules_text.txt: Daemon=5+, Greater Daemon=4+, Berserk(X+)=X+, Seal of
 * corruption=4+, Warded=6+ (or improves existing), etc.
 * Returns the numeric value (e.g. 5 for "5+") or null if none found.
 */
export function parseInvSaveFromAbilities(abilities: string[]): number | null {
  let best: number | null = null;
  for (const ab of abilities) {
    // Direct patterns: "X+ ward save" / "X+ ward save"
    const direct = ab.match(/(\d)\+\s+(?:ward|invulnerab(?:le|ility))\s+save/gi);
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

  // "Warded" is the odd one out: not a value but a MODIFIER — "gains a 6+ ward save, or improves
  // an existing ward save by +1 (to a maximum of 4+). Cumulative with itself." It was missing
  // entirely, so a Chaos Terminator with the Mark of Tzeentch kept the 5+ from its armour and the
  // word "Warded" appeared beside it with nothing behind it (Discord report).
  // It has to be applied AFTER the flat sources above, because what it improves is whatever they
  // settled on — and counted, not just detected, since two instances stack.
  const warded = abilities.filter(ab => /(^|[^A-Za-z])Warded\b/i.test(ab)).length;
  if (warded > 0) {
    // No ward save yet: the first instance grants 6+, and each further one improves it.
    let v = best ?? 7;
    v -= warded;
    if (best === null) v = Math.min(6, 7 - warded);
    best = Math.max(4, v);
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
