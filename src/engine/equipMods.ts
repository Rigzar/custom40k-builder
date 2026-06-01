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

export function parseEquipMods(items: { name: string; desc: string }[]): EquipMods {
  const mods: EquipMods = { statDeltas: {}, armorSave: null, invulnSave: null, grantedAbilities: [] };
  for (const { desc } of items) {
    if (!desc) continue;
    // Only apply stat deltas when the bonus clearly applies to the bearer, not an aura for other units
    if (!AURA_PHRASES.test(desc)) {
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
