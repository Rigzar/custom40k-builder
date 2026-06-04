// Shared equipment-mod parsing used by both UnitCard (live view) and PrintView.

export interface EquipMods {
  statDeltas: Partial<Record<string, number>>;
  armorSave: number | null;
  invulnSave: number | null;
  grantedAbilities: string[];
}

const EQUIP_STAT_MAP: [RegExp, string][] = [
  [/\+(\d+)\s+toughness/i, 'T'],
  [/\+(\d+)\s+attacks?/i,  'A'],
  [/\+(\d+)\s+strength/i,  'S'],
  [/\+(\d+)\s+wounds?/i,   'W'],
  [/\+(\d+)"\s+movement/i, 'M'],
  [/\+(\d+)\s+initiative/i,'I'],
  [/\+(\d+)\s+leadership/i,'LD'],
];

// Descriptions that indicate the bonus applies to OTHER units, not the bearer
const AURA_PHRASES = /attached unit|friendly unit|friendly model|enemy unit|enemy model|the target|all models of|models in the target|models from an/i;

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

export function parseEquipMods(
  items: { name: string; desc: string; armourKeyword?: string }[],
  innateArmour?: string,
  baseAbilities: string[] = [],
): EquipMods {
  const mods: EquipMods = { statDeltas: {}, armorSave: null, invulnSave: null, grantedAbilities: [] };
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
      for (const [re, key] of EQUIP_STAT_MAP) {
        const m = desc.match(re);
        if (m) mods.statDeltas[key] = (mods.statDeltas[key] ?? 0) + parseInt(m[1]);
      }
    }
    const armor = desc.match(/(\d)\+\s+armou?r\s+save/i);
    if (armor) { const v = parseInt(armor[1]); if (mods.armorSave === null || v < mods.armorSave) mods.armorSave = v; }
    const invuln = desc.match(/(\d)\+\s+invulnerable\s+save/i);
    if (invuln) { const v = parseInt(invuln[1]); if (mods.invulnSave === null || v < mods.invulnSave) mods.invulnSave = v; }
    for (const match of Array.from(desc.matchAll(/"([^"]+)"/g))) {
      const ab = match[1];
      // A quoted unit-type word is handled by the type system, not shown as an ability.
      if (UNIT_TYPE_WORDS.has(ab.toLowerCase().trim())) continue;
      // Only add what the model doesn't already have (don't re-grant a base ability).
      if (baseSet.has(norm(ab))) continue;
      if (!mods.grantedAbilities.includes(ab)) mods.grantedAbilities.push(ab);
    }
  }
  return mods;
}

/** Whether a daemon-weapon trait's description applies to a chosen weapon. */
export function isWeaponTrait(desc: string | undefined): boolean {
  return /\bthe weapon gains\b/i.test(desc ?? '');
}

/** Whether an item may only be taken once (has "Unique" in description). */
export function isUniqueItem(desc: string | undefined): boolean {
  return /\bUnique\b/.test(desc ?? '');
}

/** Whether an equipment item explicitly allows multiple copies per unit. */
export function isMultipleAllowed(desc: string | undefined): boolean {
  return /can be taken multiple times/i.test(desc ?? '');
}

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
