/**
 * codex_csm — single entry point for everything Chaos Space Marines on the engine side.
 *
 * This barrel re-exports the faction's legacies, traits, archetypes and resolver from one
 * place, so other engine code can do `from '../codex_csm'` instead of reaching into 4
 * different faction barrels (legacies/, traits/, archetypes/, resolvers/).
 *
 * Canonical DATA (units, armory, animosity table, archetype list) is NOT here — it lives in
 * `data/parsed/chaos_space_marines/` (same shared layout as all 19 factions). See digest.md
 * for the exact paths. This folder only holds the engine CODE that interprets that data.
 *
 * Pieces:
 *   - legacies.ts             → CSM_LEGACY_NOTES, CSM_LEGACY_ITEM_RESTRICTIONS
 *   - traits.ts               → CSM_TRAIT_EFFECTS
 *   - archetypes/index.ts     → CSM_ARCHETYPES
 *   - archetypes/rules.ts     → CSM_STRUCTURED_NOTES
 *   - archetypes/weapon-overrides.ts → vehicle/combi-weapon override helpers
 *   - resolver.ts             → csmResolve
 *   - digest.md               → rules-model digest (prose chuleta — audit trail, not migrated)
 *
 * 5-category data model (PLAN_PROYECTO.md §1, agreed 2026-06-08 — SKELETONS, not yet filled
 * or wired into the resolver; content still lives in digest.md until migrated section by section):
 *   - unit-types.ts           → CSM_UNIT_TYPES        (Unit type)
 *   - keywords.ts             → CSM_KEYWORDS          (Keyword — armour/mark/faction/datasheet)
 *   - special-abilities.ts    → CSM_SPECIAL_ABILITIES (Special ability — incl. Psyker)
 *   - weapon-abilities.ts     → CSM_WEAPON_ABILITIES  (Weapon ability)
 *   - slots.ts                → CSM_SLOTS             (Slot — roster per slot)
 */

export { CSM_LEGACY_NOTES, CSM_LEGACY_ITEM_RESTRICTIONS } from './legacies';
export { CSM_TRAIT_EFFECTS } from './traits';
export { CSM_ARCHETYPES } from './archetypes/index';
export { CSM_STRUCTURED_NOTES } from './archetypes/rules';
export {
  COMBI_SURCHARGE,
  applyVehicleWeaponOverrides,
  applyEquippedWithOverride,
  computeVehicleCombiSurcharge,
} from './archetypes/weapon-overrides';
export { csmResolve } from './resolver';
