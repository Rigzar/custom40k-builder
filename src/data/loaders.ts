/**
 * Faction data loaders - assembles FactionData from the per-faction folder structure.
 *
 * Layout: data/parsed/<faction>/
 *   units.json           { faction, slot_to_units, units }
 *   armory/general.json  Armory (general, always present)
 *   armory/mark_*.json   one per Chaos mark (Khorne/Nurgle/Slaanesh/Tzeentch)
 *   armory/legion_*.json one per legacy armory (slug of legacy key)
 *   psychic/disciplines.json, pacts.json, prayers.json, daemonkin.json
 *   archetypes.json      { archetypes, legacies, traits }
 *   rules.json           { animosity, allied }
 *
 * Supplements: data/parsed/_supplements/<name>.json
 *
 * The assembled object mirrors the FactionData shape the engine expects unchanged.
 *
 * HOW TO ADD A NEW FACTION:
 *   1. Create data/parsed/<faction>/ with the files above.
 *   2. Add a `case '<faction>'` here that loads and assembles the files.
 *   3. Add the key to FACTION_LOADERS at the bottom.
 *   4. Register in LandingPage.tsx (App.tsx auto-picks up via FACTION_LOADERS).
 *   5. Add engine/factions/<faction>/ if it needs a custom resolver/traits/validators.
 */

import type { FactionData } from '../types/data';

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
    disciplines: d(psychic.disciplines ?? { default: [] }) ?? [],
    pacts: d(psychic.pacts ?? { default: {} }) ?? {},
    prayers: d(psychic.prayers ?? { default: [] }) ?? [],
    daemonkin: d(psychic.daemonkin ?? { default: {} }) ?? {},
  } as unknown as FactionData;
}

const noArch = { default: { archetypes: [], legacies: [], traits: [] } };
const noRules = { default: { animosity: {}, allied: {} } };

async function loadFaction(key: string): Promise<FactionData> {
  switch (key) {

    case 'chaos_space_marines': {
      const [u, g, kh, nu, sl, tz, iron, word, alpha, night, black, arch, rules, pacts, prayers, dk] = await Promise.all([
        import('../../data/parsed/chaos_space_marines/units.json'),
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
        import('../../data/parsed/chaos_space_marines/archetypes.json'),
        import('../../data/parsed/chaos_space_marines/rules.json'),
        import('../../data/parsed/chaos_space_marines/psychic/pacts.json'),
        import('../../data/parsed/chaos_space_marines/psychic/prayers.json'),
        import('../../data/parsed/chaos_space_marines/psychic/daemonkin.json'),
      ]);
      return asm(u, g, arch, rules,
        { Khorne: kh, Nurgle: nu, Slaanesh: sl, Tzeentch: tz },
        { 'Iron Warriors': iron, 'Word Bearers': word, 'Alpha Legion': alpha, 'Night Lords': night, 'Black Legion': black },
        { pacts, prayers, daemonkin: dk });
    }

    case 'chaos_daemons': {
      const [u, g, tz, arch, rules, dk] = await Promise.all([
        import('../../data/parsed/chaos_daemons/units.json'),
        import('../../data/parsed/chaos_daemons/armory/general.json'),
        import('../../data/parsed/chaos_daemons/armory/mark_tzeentch.json'),
        import('../../data/parsed/chaos_daemons/archetypes.json'),
        import('../../data/parsed/chaos_daemons/rules.json'),
        import('../../data/parsed/chaos_daemons/psychic/daemonkin.json'),
      ]);
      return asm(u, g, arch, rules, { Tzeentch: tz }, {}, { daemonkin: dk });
    }

    case 'space_marines': {
      const [u, g, arch, prayers, dk, rel, dw, da, ws, sw, fi, bt, ba, br] = await Promise.all([
        import('../../data/parsed/space_marines/units.json'),
        import('../../data/parsed/space_marines/armory/general.json'),
        import('../../data/parsed/space_marines/archetypes.json'),
        import('../../data/parsed/space_marines/psychic/prayers.json'),
        import('../../data/parsed/space_marines/psychic/daemonkin.json'),
        import('../../data/parsed/space_marines/armory/legion_relictors.json'),
        import('../../data/parsed/space_marines/armory/legion_death_watch.json'),
        import('../../data/parsed/space_marines/armory/legion_dark_angels.json'),
        import('../../data/parsed/space_marines/armory/legion_white_scars.json'),
        import('../../data/parsed/space_marines/armory/legion_space_wolves.json'),
        import('../../data/parsed/space_marines/armory/legion_imperial_fists.json'),
        import('../../data/parsed/space_marines/armory/legion_black_templars.json'),
        import('../../data/parsed/space_marines/armory/legion_blood_angels.json'),
        import('../../data/parsed/space_marines/armory/legion_blood_ravens.json'),
      ]);
      return asm(u, g, arch, noRules, {},
        { 'Relictors': rel, 'Death Watch': dw, 'Dark Angels': da, 'White Scars': ws, 'Space Wolves': sw, 'Imperial Fists': fi, 'Black Templars': bt, 'Blood Angels': ba, 'Blood Ravens': br },
        { prayers, daemonkin: dk });
    }

    case 'imperial_guard': {
      const [u, g, arch, dk] = await Promise.all([
        import('../../data/parsed/imperial_guard/units.json'),
        import('../../data/parsed/imperial_guard/armory/general.json'),
        import('../../data/parsed/imperial_guard/archetypes.json'),
        import('../../data/parsed/imperial_guard/psychic/daemonkin.json'),
      ]);
      return asm(u, g, arch, noRules, {}, {}, { daemonkin: dk });
    }

    case 'adeptus_mechanicus': {
      const [u, g, arch, leg, dk] = await Promise.all([
        import('../../data/parsed/adeptus_mechanicus/units.json'),
        import('../../data/parsed/adeptus_mechanicus/armory/general.json'),
        import('../../data/parsed/adeptus_mechanicus/archetypes.json'),
        import('../../data/parsed/adeptus_mechanicus/armory/legion_forge_world.json'),
        import('../../data/parsed/adeptus_mechanicus/psychic/daemonkin.json'),
      ]);
      return asm(u, g, arch, noRules, {}, { 'Forge World': leg }, { daemonkin: dk });
    }

    case 'adeptus_custodes': {
      const [u, g, arch, leg, dk] = await Promise.all([
        import('../../data/parsed/adeptus_custodes/units.json'),
        import('../../data/parsed/adeptus_custodes/armory/general.json'),
        import('../../data/parsed/adeptus_custodes/archetypes.json'),
        import('../../data/parsed/adeptus_custodes/armory/legion_shield_host.json'),
        import('../../data/parsed/adeptus_custodes/psychic/daemonkin.json'),
      ]);
      return asm(u, g, arch, noRules, {}, { 'Shield Host': leg }, { daemonkin: dk });
    }

    case 'adeptus_sororitas': {
      const [u, g, arch, leg, dk] = await Promise.all([
        import('../../data/parsed/adeptus_sororitas/units.json'),
        import('../../data/parsed/adeptus_sororitas/armory/general.json'),
        import('../../data/parsed/adeptus_sororitas/archetypes.json'),
        import('../../data/parsed/adeptus_sororitas/armory/legion_order.json'),
        import('../../data/parsed/adeptus_sororitas/psychic/daemonkin.json'),
      ]);
      return asm(u, g, arch, noRules, {}, { 'Order': leg }, { daemonkin: dk });
    }

    case 'grey_knights': {
      const [u, g, arch, prayers, dk] = await Promise.all([
        import('../../data/parsed/grey_knights/units.json'),
        import('../../data/parsed/grey_knights/armory/general.json'),
        import('../../data/parsed/grey_knights/archetypes.json'),
        import('../../data/parsed/grey_knights/psychic/prayers.json'),
        import('../../data/parsed/grey_knights/psychic/daemonkin.json'),
      ]);
      return asm(u, g, arch, noRules, {}, {}, { prayers, daemonkin: dk });
    }

    case 'inquisition': {
      const [u, g, dk] = await Promise.all([
        import('../../data/parsed/inquisition/units.json'),
        import('../../data/parsed/inquisition/armory/general.json'),
        import('../../data/parsed/inquisition/psychic/daemonkin.json'),
      ]);
      return asm(u, g, noArch, noRules, {}, {}, { daemonkin: dk });
    }

    case 'assassins': {
      const [u, g, dk] = await Promise.all([
        import('../../data/parsed/assassins/units.json'),
        import('../../data/parsed/assassins/armory/general.json'),
        import('../../data/parsed/assassins/psychic/daemonkin.json'),
      ]);
      return asm(u, g, noArch, noRules, {}, {}, { daemonkin: dk });
    }

    case 'tau_empire': {
      const [u, g, arch, leg, dk] = await Promise.all([
        import('../../data/parsed/tau_empire/units.json'),
        import('../../data/parsed/tau_empire/armory/general.json'),
        import('../../data/parsed/tau_empire/archetypes.json'),
        import('../../data/parsed/tau_empire/armory/legion_sept.json'),
        import('../../data/parsed/tau_empire/psychic/daemonkin.json'),
      ]);
      return asm(u, g, arch, noRules, {}, { 'Sept': leg }, { daemonkin: dk });
    }

    case 'necrons': {
      const [u, g, arch, leg, dk] = await Promise.all([
        import('../../data/parsed/necrons/units.json'),
        import('../../data/parsed/necrons/armory/general.json'),
        import('../../data/parsed/necrons/archetypes.json'),
        import('../../data/parsed/necrons/armory/legion_dynasty.json'),
        import('../../data/parsed/necrons/psychic/daemonkin.json'),
      ]);
      return asm(u, g, arch, noRules, {}, { 'Dynasty': leg }, { daemonkin: dk });
    }

    case 'orks': {
      const [u, g, arch, leg, dk] = await Promise.all([
        import('../../data/parsed/orks/units.json'),
        import('../../data/parsed/orks/armory/general.json'),
        import('../../data/parsed/orks/archetypes.json'),
        import('../../data/parsed/orks/armory/legion_clan.json'),
        import('../../data/parsed/orks/psychic/daemonkin.json'),
      ]);
      return asm(u, g, arch, noRules, {}, { 'Klan': leg }, { daemonkin: dk });
    }

    case 'eldar': {
      const [u, g, arch, cw, yn, dk] = await Promise.all([
        import('../../data/parsed/eldar/units.json'),
        import('../../data/parsed/eldar/armory/general.json'),
        import('../../data/parsed/eldar/archetypes.json'),
        import('../../data/parsed/eldar/armory/legion_craftworld.json'),
        import('../../data/parsed/eldar/armory/legion_ynnari.json'),
        import('../../data/parsed/eldar/psychic/daemonkin.json'),
      ]);
      return asm(u, g, arch, noRules, {}, { 'Craftworld': cw, 'Ynnari': yn }, { daemonkin: dk });
    }

    case 'dark_eldar': {
      const [u, g, arch, kabal, wych, coven, dk] = await Promise.all([
        import('../../data/parsed/dark_eldar/units.json'),
        import('../../data/parsed/dark_eldar/armory/general.json'),
        import('../../data/parsed/dark_eldar/archetypes.json'),
        import('../../data/parsed/dark_eldar/armory/legion_kabal.json'),
        import('../../data/parsed/dark_eldar/armory/legion_wych.json'),
        import('../../data/parsed/dark_eldar/armory/legion_coven.json'),
        import('../../data/parsed/dark_eldar/psychic/daemonkin.json'),
      ]);
      return asm(u, g, arch, noRules, {}, { 'Kabal': kabal, 'Wych': wych, 'Coven': coven }, { daemonkin: dk });
    }

    case 'genestealer_cults': {
      const [u, g, arch, dk] = await Promise.all([
        import('../../data/parsed/genestealer_cults/units.json'),
        import('../../data/parsed/genestealer_cults/armory/general.json'),
        import('../../data/parsed/genestealer_cults/archetypes.json'),
        import('../../data/parsed/genestealer_cults/psychic/daemonkin.json'),
      ]);
      return asm(u, g, arch, noRules, {}, {}, { daemonkin: dk });
    }

    case 'harlequins': {
      const [u, g, dk] = await Promise.all([
        import('../../data/parsed/harlequins/units.json'),
        import('../../data/parsed/harlequins/armory/general.json'),
        import('../../data/parsed/harlequins/psychic/daemonkin.json'),
      ]);
      return asm(u, g, noArch, noRules, {}, {}, { daemonkin: dk });
    }

    case 'leagues_of_votann': {
      const [u, g, arch, leg, dk] = await Promise.all([
        import('../../data/parsed/leagues_of_votann/units.json'),
        import('../../data/parsed/leagues_of_votann/armory/general.json'),
        import('../../data/parsed/leagues_of_votann/archetypes.json'),
        import('../../data/parsed/leagues_of_votann/armory/legion_league.json'),
        import('../../data/parsed/leagues_of_votann/psychic/daemonkin.json'),
      ]);
      return asm(u, g, arch, noRules, {}, { 'League': leg }, { daemonkin: dk });
    }

    case 'tyranids': {
      const [u, g, arch, leg, dk] = await Promise.all([
        import('../../data/parsed/tyranids/units.json'),
        import('../../data/parsed/tyranids/armory/general.json'),
        import('../../data/parsed/tyranids/archetypes.json'),
        import('../../data/parsed/tyranids/armory/legion_hive_fleet.json'),
        import('../../data/parsed/tyranids/psychic/daemonkin.json'),
      ]);
      return asm(u, g, arch, noRules, {}, { 'Hive Fleet': leg }, { daemonkin: dk });
    }

    case 'horus_heresy':
      return import('../../data/parsed/_supplements/horus_heresy.json').then(m => d(m as Mod));

    default:
      throw new Error('Unknown faction: ' + key);
  }
}

/** Public loader map - used by App.tsx for both primary and allied faction loading. */
export const FACTION_LOADERS: Record<string, () => Promise<FactionData>> = Object.fromEntries(
  ['chaos_space_marines', 'chaos_daemons', 'space_marines', 'imperial_guard', 'adeptus_mechanicus',
   'adeptus_custodes', 'adeptus_sororitas', 'grey_knights', 'inquisition', 'assassins', 'tau_empire',
   'necrons', 'orks', 'eldar', 'dark_eldar', 'genestealer_cults', 'harlequins', 'leagues_of_votann',
   'tyranids', 'horus_heresy'].map(k => [k, () => loadFaction(k)])
);
