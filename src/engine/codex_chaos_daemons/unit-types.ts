/**
 * codex_chaos_daemons/unit-types — category 2 of 5 in the codex.ts data model (Unit type).
 *
 * Each roster datasheet's static `unit_type` string, extracted PROGRAMMATICALLY from the
 * production `.ts` files in `data/parsed/chaos_daemons/units/<slot>/` (NOT hand-transcribed —
 * GOLDEN RULE), cross-checked against `rules-model/chaos_daemons.md` §4d-4i (matches; digest
 * confirms e.g. "all 12 HQ are single models with locked_mark"). Fortifications (Feculent
 * Gnarlmaw) carries `unit_type: ""` — buildings have no creature/model type, same as CSM's
 * Fortifications entries (Miasmic Malignifier / Noctilith Crown).
 *
 * **Bug caught + fixed mid-extraction (production data, not just digest):** the Elites
 * datasheet's army-list `name` was "Demon Brutes" (typo, missing "a") while its OWN model
 * inside the same file is correctly "Daemon Brute", and the canonical HTML source
 * (`data/source/Chaos Daemons ENG/Index.html`) verbatim says "Daemon Brutes" — fixed the
 * production unit name (daemon_brutes.ts) + a stale comment in resolvers/chaos_daemons.ts.
 */

export interface CdUnitTypeEntry {
  /** Unit name, verbatim from production (post-fix — see header note on "Daemon Brutes") */
  name: string;
  /** Static `unit_type` string from the datasheet, e.g. "Character Model, Infantry" */
  unit_type: string;
}

// Source: data/parsed/chaos_daemons/units/<slot>/*.ts `unit_type` field, extracted
// programmatically 2026-06-08. 37/37 units, matches CD_SLOTS roster exactly.
export const CD_UNIT_TYPES: CdUnitTypeEntry[] = [
  // HQ (12) — digest §4d: all single-model Character/Monstrous Creature, locked_mark
  { name: 'Bloodmaster', unit_type: 'Character Model, Infantry' },
  { name: 'Bloodthirster', unit_type: 'Monstrous Creature, Jump Pack Infantry' },
  { name: 'Changecaster', unit_type: 'Character Model, Infantry' },
  { name: 'Contorted Epitome', unit_type: 'Character Model, Infantry' },
  { name: 'Great Unclean One', unit_type: 'Monstrous Creature' },
  { name: 'Infernal Enrapturess', unit_type: 'Character Model, Infantry' },
  { name: 'Keeper of Secrets', unit_type: 'Monstrous Creature' },
  { name: 'Lord of Change', unit_type: 'Monstrous Creature, Jump Pack Infantry' },
  { name: 'Poxbringer', unit_type: 'Character Model, Infantry' },
  { name: 'Sloppity Bilepiper', unit_type: 'Character Model, Infantry' },
  { name: 'Spoilpox Scrivener', unit_type: 'Character Model, Infantry' },
  { name: 'Tranceweaver', unit_type: 'Character Model, Infantry' },

  // Troops (6) — digest §4e: locked-mark Infantry squads, no champion
  { name: 'Bloodletters', unit_type: 'Infantry' },
  { name: 'Blue Horrors', unit_type: 'Infantry' },
  { name: 'Daemonettes', unit_type: 'Infantry' },
  { name: 'Nurglings', unit_type: 'Infantry' },
  { name: 'Pink Horrors', unit_type: 'Infantry' },
  { name: 'Plaguebearers', unit_type: 'Infantry' },

  // Elites (5) — digest §4f: multi-model squads, none have armory access
  { name: 'Beasts of Nurgle', unit_type: 'Monstrous Infantry' },
  { name: 'Bloodcrushers', unit_type: 'Bike' },
  { name: 'Daemon Brutes', unit_type: 'Monstrous Infantry' },
  { name: 'Fiends', unit_type: 'Bike' },
  { name: 'Flamers', unit_type: 'Jump Pack Infantry' },

  // Fast Attack (8) — digest §4g
  { name: 'Flesh Hounds', unit_type: 'Bike' },
  { name: 'Furies', unit_type: 'Jump Pack Infantry' },
  { name: 'Hellflayer', unit_type: 'Bike' },
  { name: 'Plague Drones', unit_type: 'Jump Pack Infantry' },
  { name: 'Screamers', unit_type: 'Jet Bike' },
  { name: 'Seeker Chariot', unit_type: 'Bike' },
  { name: 'Seekers', unit_type: 'Bike' },
  { name: 'Slaughterbrute', unit_type: 'Monstrous Creature' },

  // Heavy Support (5) — digest §4h, "richest slot" (Daemon prince's slot-shift HS→HQ)
  { name: 'Burning Chariot', unit_type: 'Jet Bike' },
  { name: 'Daemon prince', unit_type: 'Monstrous Creature' },
  { name: 'Mutalith Vortex Beast', unit_type: 'Monstrous Creature' },
  { name: 'Skull Cannon', unit_type: 'Bike' },
  { name: 'Soul Grinder', unit_type: 'Walker' },

  // Fortifications (1) — digest §4i: zero wargear options, no creature unit_type
  { name: 'Feculent Gnarlmaw', unit_type: '' },
];
