/**
 * dataHealth.ts — in-browser port of scripts/sanity_sweep.ts.
 *
 * Runs the same structural/data-consistency checks (A–H) the CLI sweep does, but over the data
 * already bundled in the app (loaded via FACTION_LOADERS). Powers the admin "Data Health" panel
 * so the maintainer can spot data bugs (dead option groups, ghost weapons, dangling refs, …)
 * without opening the repo. Pure read-only — never mutates anything.
 *
 * It is NOT a rules checker: it catches wiring/consistency mistakes, not rules-interpretation ones.
 */

import type { FactionData, Unit } from '../types/data';
import { FACTION_LOADERS } from '../data/loaders';
import { getArchetypeRule } from './archetypes';

export interface HealthFinding {
  category: string;   // A–H
  faction: string;
  unit?: string;
  message: string;
}

const CHOICE_CONSTRAINT_TYPES = new Set(['one', 'every', 'per_n', 'fixed_max']);

const INFORMATIONAL_HEADER_RE = new RegExp([
  'per army', 'game size', 'HQ selection', 'HQ choice', 'HQ slot', 'HQ unit',
  'Elite[- ]slot', 'Fast Attack slot', 'Heavy Support slot', 'Troops slot',
  "mandatory (HQ|choice|unit)", 'without using', "does ?n'?t take", 'does not (occupy|take ?up)',
  "can'?t be selected without", 'must select a dedicated transport',
  'Doctrina Imperative', 'Kustom [Jj]ob', 'from the [Aa]rmory',
  "(can|may) (not |only )?('t )?contain (only )?(a |one )?single",
  'can (only )?contain only one', 'can only be taken by',
  'following units can.?must be selected', 'datasheet at the given cost',
  "can'?t be (the )?mandatory", 'mandatory.{0,20}selection',
  'They Shall Know No Fear',
  'the unit may contain', 'per \\d+.*model',
].join('|'), 'i');

const FREE_SLOT_RE = /doesn'?t take (a|an) .*slot|does not (occupy|take up) (a|an) .*slot|without using (a|an|up)/i;
const baseName = (n: string) => n.split(' - ')[0];

/** Load every faction's data and run all checks. Returns findings grouped-friendly (flat list). */
export async function runDataHealth(): Promise<HealthFinding[]> {
  const findings: HealthFinding[] = [];
  const datas: { slug: string; data: FactionData }[] = [];
  for (const [slug, loader] of Object.entries(FACTION_LOADERS)) {
    try { datas.push({ slug, data: await loader() }); }
    catch (e) { findings.push({ category: 'LOAD', faction: slug, message: `failed to load: ${(e as Error).message}` }); }
  }

  // Cross-faction name set (unit names + promoted variant names) for the archetype-ref check.
  const allUnitNames = new Set<string>();
  for (const { data } of datas) {
    for (const [name, unit] of Object.entries(data.units as Record<string, Unit>)) {
      allUnitNames.add(name);
      for (const v of unit.variant_models ?? []) allUnitNames.add(v.name);
    }
  }

  for (const { slug, data } of datas) {
    const units = data.units as Record<string, Unit>;

    for (const unit of Object.values(units)) {
      // A) Dead option groups
      for (const g of unit.option_groups ?? []) {
        if (CHOICE_CONSTRAINT_TYPES.has(g.constraint.type) && g.choices.length === 0 &&
            g.inline_pts == null && g.variant_link == null && !INFORMATIONAL_HEADER_RE.test(g.header)) {
          findings.push({ category: 'A', faction: slug, unit: unit.name, message: `"${g.header}" (${g.constraint.type}) has zero choices` });
        }
      }
      // B) is_character vs unit_type
      const saysCharacter = unit.unit_type.split(',').map(s => s.trim()).includes('Character Model');
      if (saysCharacter && !unit.is_character) {
        findings.push({ category: 'B', faction: slug, unit: unit.name, message: `unit_type says "Character Model" but is_character is false` });
      }
      // C) Free-slot text but advisor:false
      const freeSlot = (unit.abilities ?? []).some(a => FREE_SLOT_RE.test(a) && !INFORMATIONAL_HEADER_RE.test(a)) ||
        (unit.option_groups ?? []).some(g => FREE_SLOT_RE.test(g.header) && !INFORMATIONAL_HEADER_RE.test(g.header));
      if (freeSlot && !unit.advisor) {
        findings.push({ category: 'C', faction: slug, unit: unit.name, message: `free-slot ability/option text but advisor is false` });
      }
      // F) replaces referencing a weapon not on the unit
      const weaponNames = new Set((unit.weapons ?? []).flatMap(w => [w.name, baseName(w.name)]));
      const choiceNames = new Set((unit.option_groups ?? []).flatMap(g => g.choices.map(c => c.name)));
      for (const g of unit.option_groups ?? []) {
        for (const r of g.replaces ?? []) {
          if (!(weaponNames.has(r) || choiceNames.has(r) || (unit.equipped_with?.includes(r) ?? false))) {
            findings.push({ category: 'F', faction: slug, unit: unit.name, message: `"${g.header}".replaces: "${r}" not in weapons[]/choices/equipped_with` });
          }
        }
      }
      // G) variant_link without a matching variant_models entry
      const variantNames = new Set((unit.variant_models ?? []).map(v => v.name));
      for (const g of unit.option_groups ?? []) {
        if (g.variant_link && !variantNames.has(g.variant_link)) {
          findings.push({ category: 'G', faction: slug, unit: unit.name, message: `group "${g.header}".variant_link "${g.variant_link}" has no variant_models entry` });
        }
        for (const c of g.choices ?? []) {
          if (c.variant_link && !variantNames.has(c.variant_link)) {
            findings.push({ category: 'G', faction: slug, unit: unit.name, message: `choice "${c.name}".variant_link "${c.variant_link}" has no variant_models entry` });
          }
        }
      }
      // H) duplicate weapon names
      const seen = new Map<string, number>();
      for (const w of unit.weapons ?? []) seen.set(w.name, (seen.get(w.name) ?? 0) + 1);
      for (const [name, count] of seen) {
        if (count > 1) findings.push({ category: 'H', faction: slug, unit: unit.name, message: `weapon "${name}" appears ${count}× in weapons[]` });
      }
    }

    // E) slot_to_units names with no matching units[] key
    for (const [sl, names] of Object.entries(data.slot_to_units ?? {})) {
      for (const n of names) {
        if (!(n in units)) findings.push({ category: 'E', faction: slug, message: `slot_to_units["${sl}"]: "${n}" has no matching key in units{}` });
      }
    }

    // D) Dangling unit-name references in this faction's archetype rules
    for (const arch of data.archetypes ?? []) {
      const rule = getArchetypeRule(arch.name);
      if (!rule) continue;
      const check = (field: string, names: string[] | undefined) => {
        for (const n of names ?? []) {
          if (!allUnitNames.has(n)) findings.push({ category: 'D', faction: slug, message: `archetype "${arch.name}".${field}: "${n}" matches no unit name` });
        }
      };
      check('troopsRemap', rule.troopsRemap);
      check('bannedUnits', rule.bannedUnits);
      check('hqAllowed', rule.hqAllowed);
      check('grantVetAbilities', rule.grantVetAbilities);
      check('grantsCommandSquad', rule.grantsCommandSquad);
      check('allowedUnitsOnly', rule.allowedUnitsOnly);
      check('troopsCountExclude', rule.troopsCountExclude);
      check('liftsUniqueLimit', rule.liftsUniqueLimit);
    }
  }

  return findings;
}
