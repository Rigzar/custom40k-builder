/**
 * Weapon ability merging — when an item grants an ability that already exists on a weapon
 * with a different value, keep only the better one.
 *
 * SOURCE principle (Armory, general rule): if a weapon already has Poison(4+) and gains
 * Poison(3+) from equipment, use Poison(3+) — the better value. Never stack the same
 * ability type with different values; only the best matters.
 *
 * Comparison rules (grounded in ability definitions):
 *   Poison(X+)          → lower X = better (triggers on more rolls)
 *   Deflagrate(X+)      → lower X = better
 *   Armor piercing(X+)  → lower X = better
 *   Sunder(X)           → higher X = better (more cover reduction)
 *   AT(X)               → higher X = better (more penetrating rolls)
 *   Flurry(X)           → higher X = better (more extra attacks)
 *   Slow(-X)            → more negative = worse for attacker; compare absolute value, LOWER = better for defender
 *   Shield breaker(-X)  → more negative = better
 *
 * Abilities not in this list are always additive (just append).
 */

type CompareMode = 'lower_better' | 'higher_better';

const MERGEABLE_ABILITIES: Record<string, CompareMode> = {
  'poison':         'lower_better',
  'deflagrate':     'lower_better',
  'armor piercing': 'lower_better',
  'sunder':         'higher_better',
  'at':             'higher_better',
  'flurry':         'higher_better',
  'shield breaker': 'lower_better',  // more negative = better, but we compare absolute value
  // Slow(-X): lower absolute X = less Initiative penalty = better for the bearer
  // e.g. Slow(-1) better than Slow(-5). Spineshiver Blade "reduces Slow(x) by 1".
  'slow':           'lower_better',
  'deadly':         'lower_better',  // Deadly(4+) is better than Deadly(5+)
  'precision':      'lower_better',  // Precision(4+) better than Precision(5+) (Sinful daemon weapon)
};

/** Extract the numeric value from an ability string like "Poison(3+)" → { name: "poison", value: 3 } */
function parseAbilityValue(ab: string): { key: string; value: number; original: string } | null {
  const m = ab.match(/^([A-Za-z\s]+)\(?[-–]?(\d+)[+)]/);
  if (!m) return null;
  const key = m[1].trim().toLowerCase();
  if (!(key in MERGEABLE_ABILITIES)) return null;
  return { key, value: parseInt(m[2]), original: ab.trim() };
}

/** Returns true if newAbility is better than existing (should replace it). */
function isBetter(key: string, newVal: number, existingVal: number): boolean {
  const mode = MERGEABLE_ABILITIES[key];
  if (!mode) return false;
  return mode === 'lower_better' ? newVal < existingVal : newVal > existingVal;
}

/**
 * Merge incoming weapon ability additions into the existing abilities string.
 * Returns { merged: string, improved: string[] } where `improved` lists abilities
 * that were upgraded (so they can be displayed with ◆ marker).
 *
 * @param existing  The weapon's current abilities string, e.g. "Poison(4+), AT(2)"
 * @param additions Array of new ability strings from equipment, e.g. ["Poison(3+)"]
 */
export function mergeWeaponAbilities(
  existing: string,
  additions: string[],
): { merged: string; improved: string[]; added: string[] } {
  if (!additions.length) return { merged: existing, improved: [], added: [] };

  // Parse existing abilities into a map of key → { value, original }
  const existingParts = existing ? existing.split(',').map(s => s.trim()).filter(Boolean) : [];
  const existingMap = new Map<string, { value: number; original: string; index: number }>();
  existingParts.forEach((ab, i) => {
    const parsed = parseAbilityValue(ab);
    if (parsed) existingMap.set(parsed.key, { value: parsed.value, original: ab, index: i });
  });

  const resultParts = [...existingParts];
  const improved: string[] = [];   // replaced existing with better value
  const added: string[] = [];      // new ability not previously present

  for (const add of additions) {
    const parsed = parseAbilityValue(add);
    if (!parsed) {
      // Non-mergeable ability — just append if not already present
      if (!existing.toLowerCase().includes(add.toLowerCase())) {
        added.push(add);
      }
      continue;
    }

    const existing_ = existingMap.get(parsed.key);
    if (!existing_) {
      // Not present yet — new addition
      added.push(add);
    } else if (isBetter(parsed.key, parsed.value, existing_.value)) {
      // New value is better — replace the existing one
      resultParts[existing_.index] = add;
      existingMap.set(parsed.key, { value: parsed.value, original: add, index: existing_.index });
      improved.push(add);
    }
    // If existing is already better or equal → skip (don't add, don't mark)
  }

  const finalParts = [...resultParts, ...added].filter(Boolean);
  return {
    merged: finalParts.join(', ') || '-',
    improved,
    added,
  };
}
