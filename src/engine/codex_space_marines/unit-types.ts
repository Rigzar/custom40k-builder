/**
 * codex_space_marines/unit-types — category 2 of 5 in the codex.ts data model (Unit type).
 *
 * Static `unit_type` per roster datasheet, extracted programmatically alongside SM_SLOTS in the
 * SAME pass (one combined script run against `data/parsed/space_marines/units/<slot>/*.ts` —
 * cheaper than CD's two separate extraction passes, since both fields live in the same files).
 *
 * Cross-checked against digest §1 "Unit types: Infantry / Vehicle / Monster(Creature) /
 * Character / Bike / Fly. Jump pack adds movement+Jump pack rule, infantry only" — confirms the
 * vocabulary observed (Character Model+Infantry / Vehicle+Walker / Monstrous Creature / Bike /
 * Flyer / Monstrous Infantry / Jump Pack Infantry, all combinations of that base set).
 *
 * IMPORTANT — static field vs. option-driven mutation (do not "fix" Blood Claws to Jump Pack
 * Infantry here): digest §6 documents that Blood Claws/Assault Squad/etc. CHANGE unit_type via
 * `OptionEffect.set_unit_type` when an option is taken — the static datasheet value stays
 * "Infantry" until the option fires (ki-jumppack mechanism, grounded in datasheet verbs, fixed
 * v0.51). This catalogue intentionally records the STATIC value, same convention as CSM_UNIT_TYPES.
 */

export interface SmUnitTypeEntry {
  name: string;
  unit_type: string;
}

export const SM_UNIT_TYPES: SmUnitTypeEntry[] = [
  // HQ (7)
  { name: 'Captain Dreadnought', unit_type: 'Vehicle, Walker' },
  { name: 'Chaplain', unit_type: 'Character Model, Infantry' },
  { name: 'Chaplain Dreadnought', unit_type: 'Vehicle, Walker' },
  { name: "Emperor's Champion", unit_type: 'Character Model, Infantry' },
  { name: 'Librarian', unit_type: 'Character Model, Infantry' },
  { name: 'Librarian Dreadnought', unit_type: 'Vehicle, Walker' },
  { name: 'Lieutenant', unit_type: 'Character Model, Infantry' },

  // Troops (9)
  { name: 'Assault Intercessor Squad', unit_type: 'Infantry' },
  { name: 'Blood Claws', unit_type: 'Infantry' },          // → set_unit_type "Jump Pack Infantry" via option (digest §6, ki-jumppack)
  { name: 'Grey Hunters', unit_type: 'Infantry' },
  { name: 'Heavy Intercessor Squad', unit_type: 'Infantry' },
  { name: 'Indomitus Crusader Squad', unit_type: 'Infantry' },
  { name: 'Infiltrator Squad', unit_type: 'Infantry' },
  { name: 'Intercessor Squad', unit_type: 'Infantry' },
  { name: 'Scout Squad', unit_type: 'Infantry' },
  { name: 'Tactical Squad', unit_type: 'Infantry' },

  // Elites (17)
  { name: 'Aggressor Squad', unit_type: 'Infantry' },
  { name: 'Ancient', unit_type: 'Character Model, Infantry' },
  { name: 'Apothecary', unit_type: 'Character Model, Infantry' },
  { name: 'Company Champion', unit_type: 'Character Model, Infantry' },
  { name: 'Death Company', unit_type: 'Infantry' },         // sheet says only "+9 pts" for Jump pack — no type change (digest §6, faithful no-op)
  { name: 'Deathwing Knights', unit_type: 'Infantry' },
  { name: 'Dreadnought', unit_type: 'Vehicle, Walker' },
  { name: 'Honor Guard', unit_type: 'Infantry' },
  { name: 'Invictor Battlesuit', unit_type: 'Monstrous Creature' },
  { name: 'Ironclad Dreadnought', unit_type: 'Vehicle, Walker' },
  { name: 'Judicar', unit_type: 'Character Model, Infantry' },
  { name: 'Kill Team Veterans', unit_type: 'Infantry' },
  { name: 'Redemptor Dreadnought', unit_type: 'Vehicle, Walker' },
  { name: 'Reiver Marines', unit_type: 'Infantry' },
  { name: 'Techmarine', unit_type: 'Character Model, Infantry' },
  { name: 'Terminator Squad', unit_type: 'Infantry' },       // carries armourKeyword:"Terminator" — catalogued in SM_KEYWORDS' armour axis (Paso 3), not here
  { name: 'Wolf Scout Squad', unit_type: 'Infantry' },

  // Fast Attack (12)
  { name: 'Assault Squad', unit_type: 'Jump Pack Infantry' },     // innate; remove-option → set_unit_type "Infantry" + M-6 (digest §6)
  { name: 'Bike Squad', unit_type: 'Bike' },
  { name: 'Inceptor Squad', unit_type: 'Jump Pack Infantry' },    // innate; relabelled from "Infantry, Jump pack" shorthand (digest §6)
  { name: 'Infernus Squad', unit_type: 'Infantry' },
  { name: 'Invader-Quad', unit_type: 'Bike' },
  { name: 'Land Speeder', unit_type: 'Vehicle' },
  { name: 'Outrider Bikes', unit_type: 'Bike' },
  { name: 'Ravenwing Black Knights', unit_type: 'Bike' },
  { name: 'Razorback Rikarius', unit_type: 'Vehicle' },
  { name: 'Storm Speeder', unit_type: 'Vehicle' },
  { name: 'Suppressor Squad', unit_type: 'Jump Pack Infantry' },  // innate; relabelled from shorthand, same as Inceptor
  { name: 'Wolf Companions', unit_type: 'Bike' },

  // Heavy Support (18)
  { name: 'Centurion Devastator Squad', unit_type: 'Infantry' },
  { name: 'Desolation Squad', unit_type: 'Infantry' },
  { name: 'Devastator Squad', unit_type: 'Infantry' },
  { name: 'Eliminator Squad', unit_type: 'Infantry' },
  { name: 'Eradicator Squad', unit_type: 'Infantry' },
  { name: 'Firestrike Servo-turret', unit_type: 'Monstrous Infantry' },
  { name: 'Gladiator', unit_type: 'Vehicle' },
  { name: 'Hellblaster Squad', unit_type: 'Infantry' },
  { name: 'Land Raider', unit_type: 'Vehicle' },
  { name: 'Land Raider Ares', unit_type: 'Vehicle' },
  { name: 'Land Raider Crusader', unit_type: 'Vehicle' },
  { name: 'Land Raider Redeemer', unit_type: 'Vehicle' },
  { name: 'Predator', unit_type: 'Vehicle' },
  { name: 'Repulsor', unit_type: 'Vehicle' },
  { name: 'Repulsor Executioner', unit_type: 'Vehicle' },
  { name: 'Thunderfire Cannon', unit_type: 'Monstrous Infantry' },
  { name: 'Vindicator', unit_type: 'Vehicle' },
  { name: 'Whirlwind', unit_type: 'Vehicle' },

  // Dedicated Transport (5)
  { name: 'Drop Pod', unit_type: 'Vehicle' },
  { name: 'Impulsor', unit_type: 'Vehicle' },
  { name: 'Land Speeder Storm', unit_type: 'Vehicle' },
  { name: 'Razorback', unit_type: 'Vehicle' },
  { name: 'Rhino', unit_type: 'Vehicle' },

  // Fortifications (1) — buildings carry no creature unit_type, same convention as CD/CSM
  { name: 'Hammerfall Bunker', unit_type: 'Vehicle' },

  // Flyers (5)
  { name: 'Fire Raptor', unit_type: 'Flyer' },
  { name: 'Nephilim Jetfighter', unit_type: 'Flyer' },
  { name: 'Stormhawk Interceptor', unit_type: 'Flyer' },
  { name: 'Stormraven Gunship', unit_type: 'Flyer' },
  { name: 'Stormtalon Gunship', unit_type: 'Flyer' },
];
