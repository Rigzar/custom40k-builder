/**
 * Faction data loaders - assembles FactionData from the per-faction folder structure.
 *
 * Layout: data/parsed/<faction>/
 *   units.json           { faction, slot_to_units, units }
 *   armory/general.json  Armory (general, always present)
 *   armory/mark_*.json   one per Chaos mark (Khorne/Nurgle/Slaanesh/Tzeentch)
 *   armory/legion_*.json one per legacy armory (slug of legacy key)
 *   psychic/disciplines.json, pacts.json, prayers.json
 *   psychic/daemonkin.json   only CSM (Daemonkin archetype tables — not a CD concept)
 *   archetypes.json      { archetypes, legacies, traits }
 *   animosity.json       { animosity, allied }  — only CSM/CD (marks animosity table)
 *
 * Supplements: data/parsed/<name>/ (same folder layout as a faction, plus supplement.json for the non-unit parts)
 *
 * The assembled object mirrors the FactionData shape the engine expects unchanged.
 *
 * HOW TO ADD A NEW FACTION:
 *   1. Create data/parsed/<faction>/ with the files above.
 *   2. Add a `case '<faction>'` here that loads and assembles the files.
 *   3. Add the key to FACTION_LOADERS at the bottom.
 *   4. Register in data/factionCatalog.ts (App.tsx auto-picks up via FACTION_LOADERS).
 *   5. Add engine/factions/<faction>/ if it needs a custom resolver/traits/validators.
 */

import type { FactionData } from '../types/data';
import { applyDataOverrides, type DataOverrides } from '../engine/dataOverrides';

type Mod = { default: any };
const d = (m: Mod) => m.default;

async function asm(
  units: Mod, general: Mod, archdata: Mod, rules: Mod,
  marks: Record<string, Mod>, legions: Record<string, Mod>,
  psychic: { pacts?: Mod; prayers?: Mod; daemonkin?: Mod; disciplines?: Mod },
): Promise<FactionData> {
  const u = d(units); const a = d(archdata); const r = d(rules);
  const am: Record<string, any> = {};
  for (const [k, v] of Object.entries(marks)) if (d(v)) am[k] = d(v);
  const al: Record<string, any> = {};
  for (const [k, v] of Object.entries(legions)) if (d(v)) al[k] = d(v);
  return {
    ...u,
    armory_general: d(general),
    armory_marks: am,
    armory_legions: al,
    archetypes: a?.archetypes ?? [],
    legacies: a?.legacies ?? [],
    traits: a?.traits ?? [],
    animosity: r?.animosity ?? {},
    allied: r?.allied ?? {},
    // Defaults must match the DECLARED type, not just be falsy-ish: `disciplines` is a
    // Record and `pacts` is an array. `pacts` used to default to `{}` for the 18 factions
    // with no pacts.json, and because the return is cast `as unknown as FactionData` the
    // compiler never noticed -- `data.pacts.find(...)` then threw "find is not a function"
    // and took down the whole Print View for any unit with a psychic power selected (GH#113).
    disciplines: d(psychic.disciplines ?? { default: {} }) ?? {},
    pacts: d(psychic.pacts ?? { default: [] }) ?? [],
    prayers: d(psychic.prayers ?? { default: [] }) ?? [],
    daemonkin: d(psychic.daemonkin ?? { default: {} }) ?? {},
  } as unknown as FactionData;
}

const noArch = { default: { archetypes: [], legacies: [], traits: [] } };
const noRules = { default: { animosity: {}, allied: {} } };

async function loadFaction(key: string): Promise<FactionData> {
  switch (key) {

    case 'chaos_space_marines': {
      const [u, g, kh, nu, sl, tz, iron, word, alpha, night, black, redc, arch, rules, pacts, prayers, dk, discs] = await Promise.all([
        import('../../data/parsed/chaos_space_marines/units/index').then(m => ({ default: { faction: m.faction, slot_to_units: m.slot_to_units, units: m.units } })),
        import('../../data/parsed/chaos_space_marines/armory/general.json'),
        import('../../data/parsed/chaos_space_marines/armory/mark_khorne.json'),
        import('../../data/parsed/chaos_space_marines/armory/mark_nurgle.json'),
        import('../../data/parsed/chaos_space_marines/armory/mark_slaanesh.json'),
        import('../../data/parsed/chaos_space_marines/armory/mark_tzeentch.json'),
        import('../../data/parsed/chaos_space_marines/armory/legion_iron_warriors.json'),
        import('../../data/parsed/chaos_space_marines/armory/legion_word_bearers.json'),
        import('../../data/parsed/chaos_space_marines/armory/legion_alpha_legion.json'),
        import('../../data/parsed/chaos_space_marines/armory/legion_night_lords.json'),
        import('../../data/parsed/chaos_space_marines/armory/legion_black_legion.json'),
        import('../../data/parsed/chaos_space_marines/armory/legion_red_corsairs.json'),
        import('../../data/parsed/chaos_space_marines/archetypes.json'),
        import('../../data/parsed/chaos_space_marines/animosity.json'),
        import('../../data/parsed/chaos_space_marines/psychic/pacts.json'),
        import('../../data/parsed/chaos_space_marines/psychic/prayers.json'),
        import('../../data/parsed/chaos_space_marines/psychic/daemonkin.json'),
        import('../../data/parsed/chaos_space_marines/psychic/disciplines.json'),
      ]);
      return asm(u, g, arch, rules,
        { Khorne: kh, Nurgle: nu, Slaanesh: sl, Tzeentch: tz },
        { 'Iron Warriors': iron, 'Word Bearers': word, 'Alpha Legion': alpha, 'Night Lords': night, 'Black Legion': black, 'Red Corsairs': redc },
        { pacts, prayers, daemonkin: dk, disciplines: discs });
    }

    case 'chaos_daemons': {
      const [u, g, kh, nu, sl, tz, arch, rules, discs] = await Promise.all([
        import('../../data/parsed/chaos_daemons/units/index').then(m => ({ default: { faction: m.faction, slot_to_units: m.slot_to_units, units: m.units } })),
        import('../../data/parsed/chaos_daemons/armory/general.json'),
        import('../../data/parsed/chaos_daemons/armory/mark_khorne.json'),
        import('../../data/parsed/chaos_daemons/armory/mark_nurgle.json'),
        import('../../data/parsed/chaos_daemons/armory/mark_slaanesh.json'),
        import('../../data/parsed/chaos_daemons/armory/mark_tzeentch.json'),
        import('../../data/parsed/chaos_daemons/archetypes.json'),
        import('../../data/parsed/chaos_daemons/animosity.json'),
        import('../../data/parsed/chaos_daemons/psychic/disciplines.json'),
      ]);
      return asm(u, g, arch, rules, { Khorne: kh, Nurgle: nu, Slaanesh: sl, Tzeentch: tz }, {}, { disciplines: discs });
    }

    case 'space_marines': {
      const [u, g, arch, prayers, discs, rel, dw, da, ws, sw, fi, bt, ba, br, ih, rg, sa, ul] = await Promise.all([
        import('../../data/parsed/space_marines/units/index').then(m => ({ default: { faction: m.faction, slot_to_units: m.slot_to_units, units: m.units } })),
        import('../../data/parsed/space_marines/armory/general.json'),
        import('../../data/parsed/space_marines/archetypes.json'),
        import('../../data/parsed/space_marines/psychic/prayers.json'),
        import('../../data/parsed/space_marines/psychic/disciplines.json'),
        import('../../data/parsed/space_marines/armory/legion_relictors.json'),
        import('../../data/parsed/space_marines/armory/legion_death_watch.json'),
        import('../../data/parsed/space_marines/armory/legion_dark_angels.json'),
        import('../../data/parsed/space_marines/armory/legion_white_scars.json'),
        import('../../data/parsed/space_marines/armory/legion_space_wolves.json'),
        import('../../data/parsed/space_marines/armory/legion_imperial_fists.json'),
        import('../../data/parsed/space_marines/armory/legion_black_templars.json'),
        import('../../data/parsed/space_marines/armory/legion_blood_angels.json'),
        import('../../data/parsed/space_marines/armory/legion_blood_ravens.json'),
        // Codex 1.04 (September 2026) adds four chapter armouries.
        import('../../data/parsed/space_marines/armory/legion_iron_hands.json'),
        import('../../data/parsed/space_marines/armory/legion_raven_guard.json'),
        import('../../data/parsed/space_marines/armory/legion_salamanders.json'),
        import('../../data/parsed/space_marines/armory/legion_ultramarines.json'),
      ]);
      return asm(u, g, arch, noRules, {},
        { 'Relictors': rel, 'Death Watch': dw, 'Dark Angels': da, 'White Scars': ws, 'Space Wolves': sw, 'Imperial Fists': fi, 'Black Templars': bt, 'Blood Angels': ba, 'Blood Ravens': br,
          'Iron Hands': ih, 'Raven Guard': rg, 'Salamanders': sa, 'Ultramarines': ul },
        { prayers, disciplines: discs });
    }

    case 'imperial_guard': {
      const [u, g, arch, discs, prayers] = await Promise.all([
        import('../../data/parsed/imperial_guard/units/index').then(m => ({ default: { faction: m.faction, slot_to_units: m.slot_to_units, units: m.units } })),
        import('../../data/parsed/imperial_guard/armory/general.json'),
        import('../../data/parsed/imperial_guard/archetypes.json'),
        import('../../data/parsed/imperial_guard/psychic/disciplines.json'),
        import('../../data/parsed/imperial_guard/psychic/prayers.json'),
      ]);
      return asm(u, g, arch, noRules, {}, {}, { disciplines: discs, prayers });
    }

    case 'adeptus_mechanicus': {
      const [u, g, arch, leg, canticles] = await Promise.all([
        import('../../data/parsed/adeptus_mechanicus/units/index').then(m => ({ default: { faction: m.faction, slot_to_units: m.slot_to_units, units: m.units } })),
        import('../../data/parsed/adeptus_mechanicus/armory/general.json'),
        import('../../data/parsed/adeptus_mechanicus/archetypes.json'),
        import('../../data/parsed/adeptus_mechanicus/armory/legion_forge_world.json'),
        import('../../data/parsed/adeptus_mechanicus/canticles.json'),
      ]);
      const data = await asm(u, g, arch, noRules, {}, { 'Forge World': leg }, {});
      return { ...data, canticles: d(canticles) ?? [] };
    }

    case 'adeptus_custodes': {
      const [u, g, arch, leg] = await Promise.all([
        import('../../data/parsed/adeptus_custodes/units/index').then(m => ({ default: { faction: m.faction, slot_to_units: m.slot_to_units, units: m.units } })),
        import('../../data/parsed/adeptus_custodes/armory/general.json'),
        import('../../data/parsed/adeptus_custodes/archetypes.json'),
        import('../../data/parsed/adeptus_custodes/armory/legion_shield_host.json'),
      ]);
      return asm(u, g, arch, noRules, {}, { 'Shield Host': leg }, {});
    }

    case 'adeptus_sororitas': {
      const [u, g, arch, leg, prayers] = await Promise.all([
        import('../../data/parsed/adeptus_sororitas/units/index').then(m => ({ default: { faction: m.faction, slot_to_units: m.slot_to_units, units: m.units } })),
        import('../../data/parsed/adeptus_sororitas/armory/general.json'),
        import('../../data/parsed/adeptus_sororitas/archetypes.json'),
        import('../../data/parsed/adeptus_sororitas/armory/legion_order.json'),
        import('../../data/parsed/adeptus_sororitas/psychic/prayers.json'),
      ]);
      // "Chamber Militant" archetype (replaces the old always-on "Witch hunters" rule):
      // Inquisition units are included "as if part of their own army" — own roster, no
      // [Allied] badge — only when that archetype is selected. See chamberMilitantOrdo().
      return asm(u, g, arch, noRules, {}, { 'Order': leg }, { prayers });
    }

    case 'grey_knights': {
      const [u, g, arch, prayers, discs] = await Promise.all([
        import('../../data/parsed/grey_knights/units/index').then(m => ({ default: { faction: m.faction, slot_to_units: m.slot_to_units, units: m.units } })),
        import('../../data/parsed/grey_knights/armory/general.json'),
        import('../../data/parsed/grey_knights/archetypes.json'),
        import('../../data/parsed/grey_knights/psychic/prayers.json'),
        import('../../data/parsed/grey_knights/psychic/disciplines.json'),
      ]);
      // "Chamber Militant" archetype (replaces the old always-on "Demon Hunters" rule):
      // Inquisition units are included "as if part of their own army" — own roster, no
      // [Allied] badge — only when that archetype is selected. See chamberMilitantOrdo().
      return asm(u, g, arch, noRules, {}, {}, { prayers, disciplines: discs });
    }

    case 'inquisition': {
      // The three Ordo armouries are LEGACY armouries -- `Inquisition 1.01.ods` ships them as
      // their own sheets and each is granted by its own Legacy ("Ordo Hereticus: The army has
      // access to the Ordo Hereticus Armory."). They used to be flattened into general.json,
      // so all 22 items were buyable with no Legacy chosen.
      const [u, g, arch, discs, prayers, her, mal, xen] = await Promise.all([
        import('../../data/parsed/inquisition/units/index').then(m => ({ default: { faction: m.faction, slot_to_units: m.slot_to_units, units: m.units } })),
        import('../../data/parsed/inquisition/armory/general.json'),
        import('../../data/parsed/inquisition/archetypes.json'),
        import('../../data/parsed/inquisition/psychic/disciplines.json'),
        import('../../data/parsed/inquisition/psychic/prayers.json'),
        import('../../data/parsed/inquisition/armory/legion_ordo_hereticus.json'),
        import('../../data/parsed/inquisition/armory/legion_ordo_malleus.json'),
        import('../../data/parsed/inquisition/armory/legion_ordo_xenos.json'),
      ]);
      return asm(u, g, arch, noRules, {},
        { 'Ordo Hereticus': her, 'Ordo Malleus': mal, 'Ordo Xenos': xen },
        { disciplines: discs, prayers });
    }

    case 'assassins': {
      const [u, g] = await Promise.all([
        import('../../data/parsed/assassins/units/index').then(m => ({ default: { faction: m.faction, slot_to_units: m.slot_to_units, units: m.units } })),
        import('../../data/parsed/assassins/armory/general.json'),
      ]);
      return asm(u, g, noArch, noRules, {}, {}, {});
    }

    case 'tau_empire': {
      const [u, g, arch, leg, prayers, drones] = await Promise.all([
        import('../../data/parsed/tau_empire/units/index').then(m => ({ default: { faction: m.faction, slot_to_units: m.slot_to_units, units: m.units } })),
        import('../../data/parsed/tau_empire/armory/general.json'),
        import('../../data/parsed/tau_empire/archetypes.json'),
        import('../../data/parsed/tau_empire/armory/legion_sept.json'),
        import('../../data/parsed/tau_empire/psychic/prayers.json'),
        import('../../data/parsed/tau_empire/drones.json'),
      ]);
      const data = await asm(u, g, arch, noRules, {}, { 'Sept': leg }, { prayers });
      return { ...data, drones: d(drones)?.drones ?? [] };
    }

    case 'necrons': {
      const [u, g, arch, leg, discs] = await Promise.all([
        import('../../data/parsed/necrons/units/index').then(m => ({ default: { faction: m.faction, slot_to_units: m.slot_to_units, units: m.units } })),
        import('../../data/parsed/necrons/armory/general.json'),
        import('../../data/parsed/necrons/archetypes.json'),
        import('../../data/parsed/necrons/armory/legion_dynasty.json'),
        import('../../data/parsed/necrons/psychic/disciplines.json'),
      ]);
      return asm(u, g, arch, noRules, {}, { 'Dynasty': leg }, { disciplines: discs });
    }

    case 'orks': {
      const [u, g, arch, leg, discs] = await Promise.all([
        import('../../data/parsed/orks/units/index').then(m => ({ default: { faction: m.faction, slot_to_units: m.slot_to_units, units: m.units } })),
        import('../../data/parsed/orks/armory/general.json'),
        import('../../data/parsed/orks/archetypes.json'),
        import('../../data/parsed/orks/armory/legion_clan.json'),
        import('../../data/parsed/orks/psychic/disciplines.json'),
      ]);
      return asm(u, g, arch, noRules, {}, { 'Clan': leg }, { disciplines: discs });
    }

    case 'eldar': {
      const [u, g, arch, cw, yn, discs] = await Promise.all([
        import('../../data/parsed/eldar/units/index').then(m => ({ default: { faction: m.faction, slot_to_units: m.slot_to_units, units: m.units } })),
        import('../../data/parsed/eldar/armory/general.json'),
        import('../../data/parsed/eldar/archetypes.json'),
        import('../../data/parsed/eldar/armory/legion_craftworld.json'),
        import('../../data/parsed/eldar/armory/legion_ynnari.json'),
        import('../../data/parsed/eldar/psychic/disciplines.json'),
      ]);
      return asm(u, g, arch, noRules, {}, { 'Craftworld': cw, 'Ynnari': yn }, { disciplines: discs });
    }

    case 'dark_eldar': {
      const [u, g, arch, kabal, wych, coven] = await Promise.all([
        import('../../data/parsed/dark_eldar/units/index').then(m => ({ default: { faction: m.faction, slot_to_units: m.slot_to_units, units: m.units } })),
        import('../../data/parsed/dark_eldar/armory/general.json'),
        import('../../data/parsed/dark_eldar/archetypes.json'),
        import('../../data/parsed/dark_eldar/armory/legion_kabal.json'),
        import('../../data/parsed/dark_eldar/armory/legion_wych.json'),
        import('../../data/parsed/dark_eldar/armory/legion_coven.json'),
      ]);
      return asm(u, g, arch, noRules, {}, { 'Kabal': kabal, 'Wych': wych, 'Coven': coven }, {});
    }

    case 'genestealer_cults': {
      const [u, g, arch, discs] = await Promise.all([
        import('../../data/parsed/genestealer_cults/units/index').then(m => ({ default: { faction: m.faction, slot_to_units: m.slot_to_units, units: m.units } })),
        import('../../data/parsed/genestealer_cults/armory/general.json'),
        import('../../data/parsed/genestealer_cults/archetypes.json'),
        import('../../data/parsed/genestealer_cults/psychic/disciplines.json'),
      ]);
      return asm(u, g, arch, noRules, {}, {}, { disciplines: discs });
    }

    case 'harlequins': {
      const [u, g, discs] = await Promise.all([
        import('../../data/parsed/harlequins/units/index').then(m => ({ default: { faction: m.faction, slot_to_units: m.slot_to_units, units: m.units } })),
        import('../../data/parsed/harlequins/armory/general.json'),
        import('../../data/parsed/harlequins/psychic/disciplines.json'),
      ]);
      return asm(u, g, noArch, noRules, {}, {}, { disciplines: discs });
    }

    case 'leagues_of_votann': {
      const [u, g, arch, leg, discs] = await Promise.all([
        import('../../data/parsed/leagues_of_votann/units/index').then(m => ({ default: { faction: m.faction, slot_to_units: m.slot_to_units, units: m.units } })),
        import('../../data/parsed/leagues_of_votann/armory/general.json'),
        import('../../data/parsed/leagues_of_votann/archetypes.json'),
        import('../../data/parsed/leagues_of_votann/armory/legion_league.json'),
        import('../../data/parsed/leagues_of_votann/psychic/disciplines.json'),
      ]);
      return asm(u, g, arch, noRules, {}, { 'League': leg }, { disciplines: discs });
    }

    case 'tyranids': {
      const [u, g, arch, hiveFleets, discs] = await Promise.all([
        import('../../data/parsed/tyranids/units/index').then(m => ({ default: { faction: m.faction, slot_to_units: m.slot_to_units, units: m.units } })),
        import('../../data/parsed/tyranids/armory/general.json'),
        import('../../data/parsed/tyranids/archetypes.json'),
        import('../../data/parsed/tyranids/armory/legion_hive_fleet.json'),
        import('../../data/parsed/tyranids/psychic/disciplines.json'),
      ]);
      // legion_hive_fleet.json holds one sub-armory PER Hive Fleet ("Hive Fleet Kronos" etc, each
      // with just that fleet's own "<Fleet> only" item) rather than one shared "Hive Fleet" armory
      // with all 5 items pooled together — each Legacy's own `armory_key` in archetypes.json now
      // names its exact fleet, so ArmoryModal's existing activeLegionKeys filter (which already
      // shows only the armory_legions entries matching the selected Legacy, same as every other
      // faction's legion/chapter armory) naturally shows just the one item that Legacy grants,
      // instead of all 5 "Unique... X only" items regardless of which Legacy was picked.
      const legions: Record<string, Mod> = Object.fromEntries(
        Object.entries(d(hiveFleets)).map(([k, v]) => [k, { default: v }]),
      );
      return asm(u, g, arch, noRules, {}, legions, { disciplines: discs });
    }

    // The two Horus Heresy supplements use the same folder layout as every faction (units/<slot>/<unit>.json
    // plus units/index.ts), so the unit update can rewrite them; what is not a unit is in supplement.json.
    case 'horus_heresy': {
      const [u, rest] = await Promise.all([
        import('../../data/parsed/horus_heresy_legiones_astartes/units/index'),
        import('../../data/parsed/horus_heresy_legiones_astartes/supplement.json'),
      ]);
      return { ...d(rest as Mod), faction: u.faction, slot_to_units: u.slot_to_units, units: u.units } as unknown as FactionData;
    }

    case 'legio_titanicus': {
      const [u, rest] = await Promise.all([
        import('../../data/parsed/horus_heresy_forces_of_the_machine_god/units/index'),
        import('../../data/parsed/horus_heresy_forces_of_the_machine_god/supplement.json'),
      ]);
      return { ...d(rest as Mod), faction: u.faction, slot_to_units: u.slot_to_units, units: u.units } as unknown as FactionData;
    }

    default:
      throw new Error('Unknown faction: ' + key);
  }
}

/**
 * Admin corrections fetched once from /api/settings and applied to every faction as it loads, so
 * a wrong point cost or stat can be fixed from the admin Source-check screen without a redeploy.
 * Fail-soft by design: if the fetch fails the app just uses the bundled data, which is what it did
 * before this existed — the builder must never depend on the network to open a faction.
 */
let overridesPromise: Promise<DataOverrides> | null = null;
function getDataOverrides(): Promise<DataOverrides> {
  if (typeof fetch !== 'function') return Promise.resolve({});
  overridesPromise ??= fetch('/api/settings', { credentials: 'include' })
    .then(r => (r.ok ? r.json() : null))
    .then(j => (j?.dataOverrides ?? {}) as DataOverrides)
    .catch(() => ({} as DataOverrides));
  return overridesPromise;
}

/** A faction exactly as bundled, WITHOUT the admin corrections: what the admin check compares them against. */
export async function loadBundledFaction(key: string): Promise<FactionData> {
  const data = await loadFaction(key);
  aliasRenamedUnits(data, key);   // an override addressed to an old unit name still reaches the renamed unit
  return data;
}

/** Drop the cached corrections so the next faction load re-reads them (used after an admin saves). */
export function refreshDataOverrides(): void { overridesPromise = null; }

/**
 * Units the codex renamed, old name → new name. A saved army stores the unit's NAME, so renaming a
 * unit orphans every list that contains it. Each old name is re-added to `units` as a
 * NON-ENUMERABLE alias for the renamed unit: a lookup by the old name still finds it, while
 * anything that walks the unit list (the pickers, the source check, the health tools) sees the unit
 * exactly once, under its new name.
 */
const UNIT_RENAMES: Record<string, Record<string, string>> = {
  chaos_space_marines: {
    'Decimator': 'Chaos Decimator',
    'Exalted Plague Champion': 'Foetid Virion',
    'Chaos Biker': 'Chaos Bikers',
  },
  orks: {
    'Cybork Slashaz': 'Cybork Slashas',
    'Deffkoptaz': 'Deffkoptas',
    'Flash Gits': 'Flash Gitz',
    'Killa Rig': 'Kill Rig',
    'Mekboy': 'Mekboyz',
    'Painboy': 'Painboyz',
  },
  genestealer_cults: { 'Abberants': 'Aberrants' },
  eldar: {
    'Corsair Voidreavers': 'Voidreavers',
    'Corsair Voidscarred': 'Voidscarred',
  },
  imperial_guard: {
    'Armoured  Sentinels': 'Armoured Sentinel',
    'Armoured Sentinels': 'Armoured Sentinel',
    'Atlas Recovery Vehicle': 'Atlas',
  },
  adeptus_mechanicus: { 'Tech Thralls': 'Tech-thralls' },
  tau_empire: {
    'Great Knarloc': 'Kroot Great Knarloc',
    'Tidewall Shieldline': 'Tidewall Shieldwall',
  },
  space_marines: { 'Fire Raptor': 'Fire Raptor Gunship' },
};

function aliasRenamedUnits(data: FactionData, factionKey: string): void {
  for (const [oldName, newName] of Object.entries(UNIT_RENAMES[factionKey] ?? {})) {
    const unit = data.units[newName];
    if (!unit || data.units[oldName]) continue;
    Object.defineProperty(data.units, oldName, { value: unit, enumerable: false, configurable: true });
  }
}

/**
 * The unit update sets `is_monster` with a case-sensitive test for "Monstrous Creature", so a sheet that writes
 * "Monstrous creature" (the Daemon Prince) came out with is_monster false and lost every Monstrous Creature rule
 * (greater Mark bonus, psyker, armory pricing). Derive it here, case-insensitively, so the sheet's spelling
 * cannot matter. Only ever turns it on: a unit the file already flags keeps its flag.
 */
function normaliseMonsterFlag(data: FactionData): void {
  for (const unit of Object.values(data.units)) {
    if (!unit.is_monster && /monstrous\s+creature/i.test(unit.unit_type ?? '')) unit.is_monster = true;
  }
}

/**
 * The unit update reads a multi-profile weapon from a header row ending in " *" followed by "- Mode" rows, and
 * writes the profiles as "Name - Mode". A header typed without the space ("Kroot carbine*") comes out as
 * "Kroot carbine- Melee": it no longer matches the option that names the weapon, so every Kroot unit showed both
 * carbine profiles and both scattergun profiles all the time (Tau 1.3, reported by Dennis_W). The sheets are
 * the author's to fix, but a player should not see a broken unit meanwhile: where several weapons share the
 * prefix before a "- ", write it the way the rest of the data does.
 */
function normaliseProfileNames(data: FactionData): void {
  for (const unit of Object.values(data.units)) {
    const ws = unit.weapons ?? [];
    const prefixOf = (n: string) => n.match(/^(.*\S)- (\S.*)$/);
    const counts = new Map<string, number>();
    for (const w of ws) { const m = prefixOf(w.name); if (m && !w.name.includes(' - ')) counts.set(m[1], (counts.get(m[1]) ?? 0) + 1); }
    for (const w of ws) {
      const m = prefixOf(w.name);
      if (m && !w.name.includes(' - ') && (counts.get(m[1]) ?? 0) >= 2) w.name = `${m[1]} - ${m[2]}`;
    }
  }
}

/** Public loader map - used by App.tsx for both primary and allied faction loading. */
export const FACTION_LOADERS: Record<string, () => Promise<FactionData>> = Object.fromEntries(
  ['chaos_space_marines', 'chaos_daemons', 'space_marines', 'imperial_guard', 'adeptus_mechanicus',
   'adeptus_custodes', 'adeptus_sororitas', 'grey_knights', 'inquisition', 'assassins', 'tau_empire',
   'necrons', 'orks', 'eldar', 'dark_eldar', 'genestealer_cults', 'harlequins', 'leagues_of_votann',
   'tyranids', 'horus_heresy', 'legio_titanicus'].map(k => [k, async () => {
     const data = await loadFaction(k);
     aliasRenamedUnits(data, k);
     normaliseMonsterFlag(data);
     normaliseProfileNames(data);
     // The supplements are not regenerated from a sheet by the unit update, so their corrections still apply.
     applyDataOverrides(data, (await getDataOverrides())[k], !['horus_heresy', 'legio_titanicus', 'escalation'].includes(k));
     return data;
   }])
);
