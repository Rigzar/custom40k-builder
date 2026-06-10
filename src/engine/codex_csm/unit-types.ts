/**
 * codex_csm/unit-types — category 1 of 5 in the codex.ts data model (Unit type).
 *
 * Per-datasheet unit-type classification for all 61 roster units (digest.md §4c roster,
 * VALIDATED 2026-06-03 — counts match exactly: 8 HQ / 8 Troops / 22 Elites / 9 Fast Attack /
 * 9 Heavy Support / 2 Dedicated Transport / 2 Fortifications / 1 Flyer).
 *
 * SOURCED FROM PRODUCTION DATA (`unit_type` field, comma-split), not hand-transcribed from
 * the digest's prose tables — per CLAUDE.md "production JSON is canonical" / GOLDEN RULE
 * (don't decide rules data from memory, land in canonical files). Cross-checked against the
 * digest's §4d (HQ: Daemon Prince = Monstrous Creature, Lord Discordant = Character +
 * Monstrous Creature, Helbrute = Walker — all match).
 *
 * Excluded: "War Dog" (present in `units/elites/` but is an Escalation Lords-of-War unit
 * injected into the Elites slot — see [[project_escalation_low]] memory — NOT part of the
 * §4c CSM roster; counting it would break the validated 22-Elites total).
 *
 * `types` holds the verbatim `unit_type` string(s) as they live in production data — this is
 * the STATIC declared type. Type-CHANGING options (e.g. Possessed "Jump packs" → Jump pack
 * infantry, Daemon Prince "wings" → Jump pack infantry) are option-layer effects
 * (`OptionEffect.adds_unit_types` / `set_unit_type`), not part of this static catalogue — see
 * [[project_sm_digest]] (jump-pack TYPE vs RULE distinction) and special-abilities.ts /
 * weapon-abilities.ts for where those option effects get documented.
 */

export interface CsmUnitTypeEntry {
  /** Datasheet name, exact match to data/parsed/chaos_space_marines/units/<slot>/*.ts */
  unitName: string;
  /** Verbatim type string(s), as stored in production `unit_type` (comma-split) — static, declared type only. */
  types: string[];
  /** Slot the unit occupies (cross-ref with slots.ts) */
  slot: string;
}

export const CSM_UNIT_TYPES: CsmUnitTypeEntry[] = [
  // --- HQ (8) ---
  { unitName: 'Adept of Possession', types: ['Character Model', 'Infantry'], slot: 'HQ' },
  { unitName: 'Chaos Lieutenant', types: ['Character Model', 'Infantry'], slot: 'HQ' },
  { unitName: 'Chaos Sorcerer', types: ['Character Model', 'Infantry'], slot: 'HQ' },
  { unitName: 'Daemon Prince', types: ['Monstrous Creature'], slot: 'HQ' },
  { unitName: 'Dark Apostle', types: ['Character Model', 'Infantry'], slot: 'HQ' },
  { unitName: 'Infernal Acolyte', types: ['Character Model', 'Infantry'], slot: 'HQ' },
  { unitName: 'Lord Discordant', types: ['Character Model', 'Monstrous Creature'], slot: 'HQ' },
  { unitName: 'Warpsmith', types: ['Character Model', 'Infantry'], slot: 'HQ' },

  // --- Troops (8) ---
  { unitName: 'Accursed Cultists', types: ['Infantry'], slot: 'Troops' },
  { unitName: 'Chaos Space Marines', types: ['Infantry'], slot: 'Troops' },
  { unitName: 'Cultists', types: ['Infantry'], slot: 'Troops' },
  { unitName: 'Jakhals', types: ['Infantry'], slot: 'Troops' },
  { unitName: 'Mutants', types: ['Infantry'], slot: 'Troops' },
  { unitName: 'Poxwalkers', types: ['Infantry'], slot: 'Troops' },
  { unitName: 'Traitor Guard', types: ['Infantry'], slot: 'Troops' },
  { unitName: 'Tzaangors', types: ['Infantry'], slot: 'Troops' },

  // --- Elites (22) ---
  { unitName: 'Big Mutants', types: ['Monstrous Infantry'], slot: 'Elites' },
  { unitName: 'Blightlord Terminators', types: ['Infantry'], slot: 'Elites' },
  { unitName: 'Chaos Terminators', types: ['Infantry'], slot: 'Elites' },
  { unitName: 'Chosen', types: ['Character Model', 'Infantry', 'Squadron'], slot: 'Elites' },
  { unitName: 'Cultist Firebrand', types: ['Character Model', 'Infantry'], slot: 'Elites' },
  { unitName: 'Dark Commune', types: ['Infantry'], slot: 'Elites' },
  { unitName: 'Deathshroud Terminators', types: ['Infantry'], slot: 'Elites' },
  { unitName: 'Eightbound', types: ['Infantry'], slot: 'Elites' },
  { unitName: 'Exalted Plague Champion', types: ['Character Model', 'Infantry'], slot: 'Elites' },
  { unitName: 'Flawless Blades', types: ['Infantry'], slot: 'Elites' },
  { unitName: 'Helbrute', types: ['Walker'], slot: 'Elites' },
  { unitName: 'Khorne Berzerkers', types: ['Infantry'], slot: 'Elites' },
  { unitName: 'Legionnaires', types: ['Infantry'], slot: 'Elites' },
  { unitName: 'Master of Execution', types: ['Infantry'], slot: 'Elites' },
  { unitName: 'Noise Marines', types: ['Infantry'], slot: 'Elites' },
  { unitName: 'Plague Marines', types: ['Infantry'], slot: 'Elites' },
  { unitName: 'Possessed', types: ['Infantry'], slot: 'Elites' },
  { unitName: 'Red Butcher Terminators', types: ['Infantry'], slot: 'Elites' },
  { unitName: 'Rubric Marines', types: ['Infantry'], slot: 'Elites' },
  { unitName: 'Scarab Occult Terminators', types: ['Infantry'], slot: 'Elites' },
  { unitName: 'Sekhetar Robots', types: ['Monstrous Infantry'], slot: 'Elites' },
  { unitName: 'Tzaangor Shaman', types: ['Character Model', 'Infantry'], slot: 'Elites' },

  // --- Fast Attack (9) ---
  { unitName: 'Chaos Bikers', types: ['Bike'], slot: 'Fast Attack' },
  { unitName: 'Chaos Spawn', types: ['Monstrous Infantry'], slot: 'Fast Attack' },
  { unitName: 'Foetid Bloat-Drone', types: ['Vehicle'], slot: 'Fast Attack' },
  { unitName: 'Juggernaut Hellriders', types: ['Bike'], slot: 'Fast Attack' },
  { unitName: 'Myphitic Blight-Hauler', types: ['Vehicle'], slot: 'Fast Attack' },
  { unitName: 'Raptors', types: ['Jump Pack Infantry'], slot: 'Fast Attack' },
  { unitName: 'Tzaangor Enlightened', types: ['Jetbike'], slot: 'Fast Attack' },
  { unitName: 'Venomcrawler', types: ['Walker'], slot: 'Fast Attack' },
  { unitName: 'Warptalons', types: ['Jump Pack Infantry'], slot: 'Fast Attack' },

  // --- Heavy Support (9) ---
  { unitName: 'Chaos Land Raider', types: ['Vehicle'], slot: 'Heavy Support' },
  { unitName: 'Chaos Predator', types: ['Vehicle'], slot: 'Heavy Support' },
  { unitName: 'Chaos Vindicator', types: ['Vehicle'], slot: 'Heavy Support' },
  { unitName: 'Defiler', types: ['Walker'], slot: 'Heavy Support' },
  { unitName: 'Forgefiend', types: ['Walker'], slot: 'Heavy Support' },
  { unitName: 'Havocs', types: ['Infantry'], slot: 'Heavy Support' },
  { unitName: 'Maulerfiend', types: ['Walker'], slot: 'Heavy Support' },
  { unitName: 'Obliterator', types: ['Monstrous Infantry'], slot: 'Heavy Support' },
  { unitName: 'Plagueburst Crawler', types: ['Vehicle'], slot: 'Heavy Support' },

  // --- Dedicated Transport (2) ---
  { unitName: 'Chaos Rhino', types: ['Vehicle'], slot: 'Dedicated Transport' },
  { unitName: 'Dreadclaw Drop Pod', types: ['Vehicle'], slot: 'Dedicated Transport' },

  // --- Fortifications (2) ---
  { unitName: 'Miasmic Malignifier', types: ['Vehicle'], slot: 'Fortifications' },
  { unitName: 'Noctilith Crown', types: ['Vehicle'], slot: 'Fortifications' },

  // --- Flyers (1) ---
  { unitName: 'Heldrake', types: ['Flyer', 'Vehicle'], slot: 'Flyers' },
];
