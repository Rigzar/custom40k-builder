export type { ArchetypeRule } from './base';
import type { ArchetypeRule } from './base';
import { BASE, fastArchetype, dropPodArchetype } from './base';
import { CSM_ARCHETYPES } from '../codex_csm/archetypes/index';
import { CD_ARCHETYPES } from '../codex_chaos_daemons/archetypes/index';
import { SM_ARCHETYPES } from '../codex_space_marines/archetypes/index';
import { HH_ARCHETYPES } from '../codex_horus_heresy/archetypes';
import { KNIGHT_HOUSEHOLD_ARCHETYPES } from '../codex_knight_households/archetypes';

const ARCHETYPE_RULES: Record<string, ArchetypeRule> = {
  ...CSM_ARCHETYPES,
  ...CD_ARCHETYPES,
  ...SM_ARCHETYPES,
  ...HH_ARCHETYPES,
  ...KNIGHT_HOUSEHOLD_ARCHETYPES,

  // ── Adeptus Custodes ──────────────────────────────────────────────────────
  'Kataphraktoi': { ...BASE,
    troopsRemap: ['Vertus Praetors'],
    lowMoveMustEmbark: {},
    notes: [
      'Vertus Praetors count as Troops.',
      'Units with M<12" must start the game as passengers inside a transport.',
      'Units with M<12" that have no transport option cannot be selected.',
    ],
  },

  'Tharanatoi': { ...BASE,
    troopsRemap: ['Allarus Custodians', 'Aquilon Custodians'],
    demoteOtherTroops: true,
    notes: [
      'Allarus Custodians and Aquilon Custodians count as Troops.',
      'Custodian Guard and Sisters of Silence are moved to the Elites slot.',
    ],
  },

  // ── Adeptus Mechanicus ────────────────────────────────────────────────────
  'Cybernetica Cohort': { ...BASE,
    troopsRemap: ['Kastelan Robots'],
    troopsCount: 'remap',
    requiresHqUpgrade: { unitNameContains: 'Magos', choiceName: 'Datasmith' },
    notes: [
      'Kastelan Robots count as Troops.',
      'Only Robot units count towards the 25% Troops requirement.',
      'Must take at least one Magos or Archmagos with the Datasmith upgrade.',
      'Access to Robot and Taghmata units from the HH Mechanicum supplement (not yet available in builder).',
    ],
  },

  'Dark Mechanicum': { ...BASE, noLegacy: true, grantsMarkPurchase: true,
    // Escalation (Dominic, 2026-10-23): a Chaos army may take the War Dog as an Elite, an Imperial army the Armiger. This archetype makes the army Chaos.
    unlocksUnits: ['War Dog'], bannedUnits: ['Armiger'],
    armoryOnlyFaction: 'chaos_space_marines',
    // Creator ruling 2026-10-24 (Rigzar): "Dark Mechanicum are treated like \"Chaos Space Marines\" in the Ally matrix."
    // The sheet still says "become Allies of Convenience for Chaos Space Marines" (one cell); the whole row is now rewritten, as for Traitor Guard.
    alliedMatrixAs: 'chaos_space_marines',
    alliedFaction: 'chaos_space_marines', alliedMarkFilter: 'all',
    alliedUnitsOnly: ['Venomcrawler', 'Defiler', 'Forgefiend', 'Maulerfiend', 'Heldrake'],
    notes: [
      'Treated as Chaos Space Marines in the Ally matrix (uses the CSM row for all ally relationships).',
      'All units may purchase a Mark of Chaos: +1 pt/model/Wound Khorne or Slaanesh, +2 pts/model/Wound Nurgle or Tzeentch; vehicles +10 pts flat (any mark).',
      'A Mark of Chaos counts as the unit\'s veteran ability, same as Adeptus Mechanicus.',
      'Models with Armory access may also use the Chaos Space Marine Armory.',
      'Venomcrawlers, Defilers, Forgefiends, Maulerfiends, and Heldrakes may be taken from the Chaos Space Marine army list.',
      'No Legacy may be selected.',
    ],
  },

  'Ordo Reductor Covenant': { ...BASE,
    troopsCount: 'remap',
    requiresHqUpgrade: { unitNameContains: 'Magos', choiceName: 'Myrmidax' },
    notes: [
      'Must take at least one Magos or Archmagos with the Myrmidax upgrade.',
      'Only Ordo Reductor units count towards the 25% Troops requirement.',
      'Access to Ordo Reductor and Taghmata units from the HH Mechanicum supplement (not yet available in builder).',
    ],
  },

  'Servitor Maniple': { ...BASE,
    troopsRemap: ['Servitors'],
    requiresEscortPerTroopsUnit: { troopsUnit: 'Servitors', escortUnit: 'Tech-Priest' },
    notes: [
      'Servitors count as Troops.',
      'Each Servitor Troops unit must be accompanied by a Tech-priest (does not use an Elite slot).',
    ],
  },

  // Renamed from "Titan Legion" in the 2026-08 codex, and rewritten with it: the Secutarii no
  // longer live in the AdMech codex at all, so the archetype no longer remaps named units into
  // Troops — it opens the supplement, whose own Troops are the ones that count. Saved armies
  // that still carry the old name are mapped onto this rule by getArchetypeRule.
  'Taghmata': { ...BASE,
    alliedFaction: 'legio_titanicus', alliedMarkFilter: 'all',
    // Same alliedFaction-key-doubling as CSM/SM's "Legion" -> horus_heresy (see that archetype's
    // comment): without this, native Adeptus Mechanicus units under Taghmata had NO tab at all
    // for the Legio Titanicus armory this archetype's own notes promise — only Taghmata-injected
    // units (Secutarii Hoplites/Peltasts, Tech-thralls, ...) could reach it, via their own
    // General tab resolving to the supplement's data. A Tech-Priest's Armory showed only
    // General + Forge World, nothing from the supplement (Discord, Rigzar).
    armoryOnlyFaction: 'legio_titanicus',
    notes: [
      'Access to everything in the Horus Heresy Forces of the Machine God supplement.',
      'Only Troops from that supplement count towards the 25% Troops requirement.',
    ],
  },

  // ── Adeptus Sororitas ─────────────────────────────────────────────────────
  'Holy Vanguard': { ...BASE,
    troopsRemap: ['Dominion Squad'], troopsCount: 'remap',
    notes: [
      'Dominion Squads count as Troops.',
      'Only Dominion units count towards the 25% Troops requirement.',
      'All Dominion models must start the game as passengers inside a transport.',
    ],
  },

  'Penitent Crusade': { ...BASE,
    troopsRemap: ['Arco-flagellants', 'Repentia Squad', 'Penitent Engines'],
    demoteOtherTroops: true,
    troopsModelRatioCap: { sourceUnits: ['Arco-flagellants'], modelsPerUnit: 10, cappedUnit: 'Penitent Engines' },
    notes: [
      'Arco-flagellants and Repentia count as Troops. For every 10 Arco-flagellant models, one Penitent Engines unit may also count as Troops.',
      'Battle Sisters and Sisters Novitiate are moved to the Elites slot.',
    ],
  },

  'Shrine Wardens': { ...BASE,
    troopsRemap: ['Celestian Squad'], demoteOtherTroops: true,
    bannedUnits: ['Arco-flagellants', 'Repentia Squad', 'Penitent Engines'],
    notes: [
      'Celestian Squad counts as Troops.',
      'Battle Sisters and Sisters Novitiate are moved to the Elites slot.',
      'Arco-flagellants, Repentia and Penitent Engines cannot be selected.',
    ],
  },

  // ── Dark Eldar ────────────────────────────────────────────────────────────
  'Coordinated Raid': { ...BASE,
    hqOverride: [1, 3],
    archetypeTraitBonus: 1,
    notes: [
      'The army gets a third HQ slot and must feature one Dracon, one Haemonculus, and one Succubus (or their upgraded variants).',
      'The army gets a third trait and must pick one trait each for <Coven>, <Kabal>, and <Wyches>.',
    ],
  },

  // DE 1.01: the three sub-faction-purity archetypes were rewritten. They no longer grant
  // "+1 Ld + double weapon swaps"; instead each lets its named Elite unit be taken as Troops and
  // removes its one-per-HQ limit. Normal Troops are unaffected (no demoteOtherTroops).
  'Trueborn Raid': { ...BASE, allowedKeywords: ['Kabal'],
    troopsRemap: ['Kabalite Trueborn'],
    liftsUniqueLimit: ['Kabalite Trueborn'],
    notes: [
      'The army may only consist of <Kabal> units.',
      'Kabalite Trueborn can be taken as Troops and are no longer limited to one per Dracon.',
    ],
  },

  'Haemoxyte Raid': { ...BASE, allowedKeywords: ['Coven'],
    troopsRemap: ['Haemoxytes'],
    liftsUniqueLimit: ['Haemoxytes'],
    notes: [
      'The army may only consist of <Coven> units.',
      'Haemoxytes can be taken as Troops and are no longer limited to one per Haemonculus.',
    ],
  },

  'Bloodbride Raid': { ...BASE, allowedKeywords: ['Cult'],
    troopsRemap: ['Hekatrix Bloodbrides'],
    liftsUniqueLimit: ['Hekatrix Bloodbrides'],
    notes: [
      'The army may only consist of <Cult> units.',
      'Hekatrix Bloodbrides can be taken as Troops and are no longer limited to one per Succubus.',
    ],
  },


  // ── Eldar ─────────────────────────────────────────────────────────────────
  'Aspect Focus': { ...BASE,
    // Eldar 1.01: Dark Reapers are exempted from Aspect Focus and no longer count as Troops ("With the
    // exception of Dark Reapers, <Aspect> units can be taken as Troops").
    troopsRemap: ['Dire Avengers', 'Fire Dragons', 'Howling Banshees', 'Shadow Spectres', 'Striking Scorpions', 'Shining Spears', 'Swooping Hawks', 'Warp Spiders'],
    // Eldar 1.7 adds "Dark Reapers become Elite choices." (they used to stay Heavy Support).
    elitesRemap: ['Dark Reapers'],
    demoteOtherTroops: true,
    notes: [
      'All Aspect Warrior units except Dark Reapers count as Troops; Dark Reapers become Elite choices.',
      'Non-Aspect Troops are moved to the Elites slot.',
    ],
  },

  'Exemplars of the Shrines': { ...BASE,
    exarchPowersCount: 2,
    notes: [
      'All Exarchs must gain two Exarch powers.',
      'Exarch powers are no longer unique — multiple units may share the same power.',
    ],
  },

  'LIIVI': { ...BASE,
    requiresHqUnit: 'Farseer',
    notes: [
      'The army has access to a single Vindicare Assassin.',
      'One HQ selection must be a Farseer.',
    ],
  },

  'Windhost': fastArchetype(['Windriders']),

  'Wraithhost': { ...BASE,
    troopsRemap: ['Wraithblades', 'Wraithguard', 'Wraithlord'], demoteOtherTroops: true,
    // October 2026: "For every 4 Wraithblade or every 3 Wraithguard models, one Wraithlord unit can be taken as Troops."
    troopsModelRatioCap: { sourceUnits: ['Wraithblades'], modelsPerUnit: 4, cappedUnit: 'Wraithlord', also: [{ sourceUnits: ['Wraithguard'], modelsPerUnit: 3 }] },
    notes: [
      'Wraithblades and Wraithguard count as Troops.',
      'For every 4 Wraithblade or every 3 Wraithguard models, one Wraithlord unit counts as Troops.',
      'Non-Wraith Troops are moved to the Elites slot.',
    ],
  },

  // ELDAR **AND** DARK ELDAR both call this archetype "Ynnari", in their sheets and in their
  // `archetypes.json`. It used to live under 'Ynnari (Eldar)' and 'Ynnari (Dark Eldar)', which
  // `getArchetypeRule` could never reach -- it looks the name up verbatim -- so the archetype
  // did nothing at all: the "no Legacy" restriction went unenforced and the Ynnari Armory was
  // never offered. (The Revenant discipline worked throughout, because PsychicModal gates it on
  // the archetype STRING rather than on this object, which is why the rest went unnoticed.)
  // The two old objects were identical apart from a parenthetical, so one entry serves both.
  //
  // `sharedSupplementArmory` is the existing mechanism for "this archetype opens an armoury to
  // the whole army"; Eldar already loads the file under exactly this key. Dark Eldar does not
  // ship an Ynnari armoury of its own and its sheet says "(see Eldar)" -- that cross-faction
  // half is recorded in known-issues rather than guessed at here.
  'Ynnari': { ...BASE, noLegacy: true,
    sharedSupplementArmory: 'Ynnari',
    // Both codices say it, each pointing at the other: Eldar's "Ynnari become \"Battle Brothers\"
    // for Dark Eldar", Dark Eldar's "...for Eldar". One entry serves both armies, so it carries
    // both keys; the one that names its own faction is a harmless no-op.
    alliedRelationshipOverrides: { eldar: 'G', dark_eldar: 'G' },
    notes: [
      'Allied to Eldar as Battle Brothers.',
      'Access to the Ynnari Armory and the Revenant discipline.',
      'No Legacy may be selected.',
    ],
  },

  // ── Genestealer Cults ─────────────────────────────────────────────────────
  'The First Curse': { ...BASE,
    troopsRemap: ['Purestrain Genestealers'], troopsCount: 'remap',
    requiresHqUnit: 'Patriarch',
    notes: [
      'Purestrain Genestealers count as Troops.',
      'Only Purestrain Genestealers count towards the 25% Troops requirement.',
      'The army must include at least one Patriarch as HQ.',
    ],
  },

  'Outlander Claw': fastArchetype(['Atalan Jackals']),

  // ── Grey Knights ──────────────────────────────────────────────────────────
  'Chamber of Purity': { ...BASE,
    troopsRemap: ['Purifier Squad'], demoteOtherTroops: true,
    liftsUniqueLimit: ['Purifier Squad'],  // GK 1.01: no longer limited to 1 per army
    notes: [
      'Purifier Squads count as Troops and are no longer limited to 1 per army.',
      'All other Troops choices are moved to the Elites slot.',
    ],
  },

  'Hall of Champions': { ...BASE,
    troopsRemap: ['Paladin Squad'], demoteOtherTroops: true,
    liftsUniqueLimit: ['Paladin Squad'],  // GK 1.01: no longer limited to 1 per army
    notes: [
      'Paladin Squads count as Troops and are no longer limited to 1 per army.',
      'All other Troops choices are moved to the Elites slot.',
    ],
  },

  // Shared across GK/Sororitas/SM — each binds to a different Ordo (see
  // CHAMBER_MILITANT_ORDO in engine/keywords.ts); the exact Ordo name is shown in the
  // per-faction archetypes.json `desc`, so it's left out of these generic notes.
  'Chamber Militant': { ...BASE,
    notes: [
      'The army has access to units from Codex: Assassins.',
      'The army has access to units from Codex: Inquisition, as part of its own army.',
      'Treat the Inquisition units as if the bound Ordo Legacy was selected (see Archetype description).',
    ],
  },

  // ── Imperial Guard ────────────────────────────────────────────────────────
  'Cavalry Regiment': fastArchetype(['Rough Riders']),

  'Mechanised Company': { ...BASE,
    bannedUnits: ['Leman Russ Tank Commander', 'Leman Russ Commissar'],
    lowMoveMustEmbark: { creatureOnly: true },
    slotCapOverride: { slot: 'Heavy Support', max: 1 },
    notes: [
      'Transport vehicles from Mechanised Infantry squads count at 75% of their points toward the 25% Troops requirement (50% by default without this archetype).',
      'All creature units with M<12" must start the game as passengers inside a transport.',
      'May only take a single Heavy Support selection.',
      'Leman Russ Tank Commander and Leman Russ Commissar cannot be selected.',
    ],
  },

  'Ogryn Regiment': { ...BASE,
    troopsRemap: ['Bullgryns', 'Ogryns', 'Ogryn Brutes'], demoteOtherTroops: true,
    notes: [
      'Bullgryns, Ogryns and Ogryn Brutes count as Troops.',
      'All other Troops are moved to the Elites slot.',
    ],
  },

  'Tempestus Scions': { ...BASE,
    troopsRemap: ['Stormtroopers'],
    allowedUnitsOnly: ['Lord Commissar', 'Commissar', 'Stormtrooper Command Squad', 'Stormtroopers', 'Taurox', 'Valkyrie'],
    notes: [
      'Only: Lord Commissars, Commissars, Stormtroopers, Stormtrooper Command Squads, Taurox and Valkyries may be selected.',
      'Stormtroopers count as Troops.',
      'All units receive the "Objective secured!" ability.',
    ],
  },

  'Veteran Company': { ...BASE,
    troopsRemap: ['Veterans'], requireVetAbilities: true, grantVetAbilitiesToAll: true,
    notes: [
      'Veterans count as Troops.',
      'All units gain access to veteran abilities and must select at least one.',
    ],
  },

  // Renamed from "War Hawks" in the 2026-09-17 sheet; the effect text is unchanged.
  'Airborne Assault Company': { ...BASE,
    bannedSlots: ['Heavy Support'],
    notes: [
      'The army doubles the number of units that may arrive from reserves each round.',
      'No Heavy Support units may be selected.',
    ],
  },

  // SOURCE — Ratling Company (Imperial Guard 1.05, Army Customisation):
  // "- All Creature units gain +1 Ballistic Skill.
  //   - All Creature units suffer -1 Strength and -1 Toughness.
  //   - Bullgryns, Ogryns, Ogryn Bodyguard, Ogryn Brutes, Stormtroopers and Stormtrooper
  //     Command Squads may not be selected."
  // BS is a "X+" stat, so its +1 bonus is stored as -1 (see statMods' own doc comment).
  // The banned names are spelled as the DATASHEETS spell them, which is why the sheet's
  // plural "Stormtrooper Command Squads" is listed here in the singular.
  'Ratling Company': { ...BASE,
    bannedUnits: [
      'Bullgryns', 'Ogryns', 'Ogryn Bodyguard', 'Ogryn Brutes',
      'Stormtroopers', 'Stormtrooper Command Squad',
    ],
    statMods: [
      { stat: 'BS', delta: -1, creatureOnly: true },
      { stat: 'S',  delta: -1, creatureOnly: true },
      { stat: 'T',  delta: -1, creatureOnly: true },
    ],
    notes: [
      'All creature units gain +1 Ballistic Skill.',
      'All creature units suffer -1 Strength and -1 Toughness.',
      'Bullgryns, Ogryns, Ogryn Bodyguard, Ogryn Brutes, Stormtroopers and Stormtrooper Command Squads may not be selected.',
    ],
  },

  'Whiteshields': { ...BASE,
    troopsRatioCap: { anchorUnit: 'Conscript Infantry Platoon', perAnchor: 1 },
    notes: [
      'Conscript Infantry Platoons may be taken without a Platoon Command Squad.',
      'Only one other Troop selection is allowed per Conscript Infantry Platoon in the army.',
    ],
  },

  'Jungle Fighters': { ...BASE,
    notes: [
      'All units gain Move through Cover and Use Cover.',
      'All creature units additionally gain Infiltrate.',
      'All creature units have their armor save reduced by -1.',
    ],
  },

  'Brood Brothers': { ...BASE,
    forcedAbility: { name: 'Ambush', pointsPerWound: 1, creatureOnly: true },
    armoryOnlyFaction: 'genestealer_cults',
    // ods-verbatim: "Brood Brothers are treated like \"Genestealer Cults\" in the Ally matrix."
    // GSC<->GSC is G, so this is Battle Brothers -- the old note said Allies of Convenience, which
    // was wrong as well as unimplemented.
    alliedMatrixAs: 'genestealer_cults',
    notes: [
      'Treated as Genestealer Cults in the Ally matrix, so Battle Brothers with them.',
      'All creature units must gain the "Ambush" ability at +1 pt per Wound (no opt-out).',
      'Models with Armory access may also use the Genestealer Cult Armory.',
    ],
  },

  'Gue\'vesa': { ...BASE,
    forcedAbility: { name: 'Supporting Fire', pointsPerWound: 1, pointsPerHull: 2 },
    armoryOnlyFaction: 'tau_empire',
    // ods-verbatim: "Gue'vesa are treated like \"Tau\" in the Ally matrix." Tau<->Tau is G.
    alliedMatrixAs: 'tau_empire',
    notes: [
      'Treated as Tau in the Ally matrix, so Battle Brothers with them.',
      'All units must gain "Supporting Fire" at +1 pt per Wound or +2 pts per Hull point (no opt-out).',
      'Creature units equipped with a Lasgun may exchange it for a Pulse rifle at +3 pts per model.',
      'Creature units equipped with a Hot-shot lasgun may exchange it for a Pulse rifle at +2 pts per model.',
    ],
  },

  'Traitor Guard': { ...BASE, noLegacy: true, grantsMarkPurchase: true,
    unlocksUnits: ['War Dog'], bannedUnits: ['Armiger'],   // Chaos army: War Dog yes, Armiger no (Escalation, Dominic 2026-10-23)
    armoryOnlyFaction: 'chaos_space_marines', grantsMarkArmory: true,
    // ods-verbatim: "Traitor Guard are treated like \"Chaos Space Marines\" in the Ally matrix."
    // CSM<->CSM is G. The note below has said this since the archetype was written; it was display
    // text only, the same shape as the Demiurg bug (GH#83).
    alliedMatrixAs: 'chaos_space_marines',
    notes: [
      'Treated as Chaos Space Marines in the Ally matrix (uses the CSM row for all ally relationships).',
      'All units may purchase a Mark of Chaos: +1 pt/model/Wound Khorne or Slaanesh, +2 pts/model/Wound Nurgle or Tzeentch; vehicles +10 pts flat (any mark).',
      'A Mark of Chaos counts as the unit\'s veteran ability, same as Chaos Space Marines.',
      'Models with Armory access may also use the Chaos Space Marine Armory.',
      'With a Mark of a God, Armory access also reaches the Armory of that god, and a Psyker '
        + 'also reaches the psychic discipline of that god.',
      'The "Animosity of the Gods" and "Summoning" rules both apply, as for Chaos Space Marines.',
      'No Legacy may be selected.',
    ],
  },

  // ── Leagues of Votann ─────────────────────────────────────────────────────
  'Demiurg': { ...BASE,
    // Votann 1.02, Army Customisation, verbatim: "This army and the Tau consider each other
    // Battle Brothers (Green allies)." Without the override the matrix's standing Y (Allies of
    // Convenience) stood and the ally showed yellow (GitHub #83).
    alliedRelationshipOverrides: { tau_empire: 'G' },
    alliedOnlyTo: 'tau_empire',   // Votann 1.5: "Can only be taken as an allied detachment for T'au Empire."
    notes: [
      'Allied to Tau Empire as Battle Brothers.',
      'The army must either take an Allied Tau detachment, or be an Allied detachment to a Tau primary army.',
    ],
  },

  'Einhyr Guard': { ...BASE,
    troopsRemap: ['Einhyr Hearthguard'], demoteOtherTroops: true,
    hqAllowed: ['Kâhl', 'High Kâhl'],
    notes: [
      'Einhyr Hearthguard count as Troops.',
      'A Kâhl or High Kâhl must be taken as HQ.',
      'Hearthkyn Warriors are moved to the Elites slot.',
    ],
  },

  'Hearthfyre Arsenal': { ...BASE,
    pointsBasedHqFree: { unitName: 'Brôkhyr Iron-master', perPoints: 500 },
    troopsCountExclude: ['Hearthkyn Warriors'],
    notes: [
      'For every 500 pts of game size, one Brokhyr Iron-master may be included without occupying an HQ slot.',
      'Hearthkyn Warriors do not count towards the 25% Troops requirement.',
    ],
  },

  'Persecution Prospect': fastArchetype(['Hernkyn Yaegirs']),

  // ── Necrons ───────────────────────────────────────────────────────────────
  // The 2026-08 Necrons sheet DELETED the line "Cryptek specialisations are no longer unique",
  // so `liftsUniqueChoices` went with it — each specialisation is once per army again, as it is
  // for every other archetype.
  'Canoptek Court': { ...BASE,
    hqAllowed: ['Cryptek'],
    hqUnitsPerSlot: { unitName: 'Cryptek', per: 2 },
    notes: [
      'Only Crypteks may be taken as HQ. Up to 2 Crypteks may be taken per HQ slot.',
      'Canoptek units gain the "Objective secured!" ability.',
    ],
  },

  'Destroyer Cult': { ...BASE,
    troopsRemap: ['Skorpekh Destroyers'],
    allowedUnitsOnly: [
      'Ancient Destructor Lord', "C'tan Shard",
      'Canoptek Doomstalker', 'Canoptek Reanimator', 'Canoptek Scarabs',
      'Canoptek Spyders', 'Canoptek Wraiths', 'Cryptek', 'Flayed Ones',
      'Lokhust Destroyers', 'Lord', 'Ophydian Destroyers', 'Plasmacyte',
      'Skorpekh Destroyers', 'Skorpekh Lord',
    ],
    notes: [
      'Restricted unit list — only: Crypteks/Lords with Destroyer bodies, Skorpekh Lords, Flayed Ones, Canoptek units, C\'tan Shards, Plasmacytes, Skorpekh Destroyers, Lokhust Destroyers, Ophydian Destroyers.',
      'Skorpekh Destroyers count as Troops.',
    ],
  },

  'Obeisance Phalanx': { ...BASE,
    // The sheet is explicit and it is a BAN, not a demotion: "- Lychguard and Triarch
    // Praetorians can be taken as Troops. - No other Troop units may be selected."
    troopsRemap: ['Lychguard', 'Triarch Praetorians'], banOtherTroops: true,
    requiresHqUnit: 'Lord',
    notes: [
      'Lychguard and Triarch Praetorians count as Troops. No other Troops may be selected.',
      'A Lord or Overlord must be taken as HQ.',
    ],
  },

  'Yngir': { ...BASE,
    troopsRemap: ['Pariahs'],
    // Sheet 1.9: "It loses the "Mindless" ability and gains the "Fearless" ability."
    unitPatch: { units: ["C'tan Shard"], dropAbilityNames: ['Mindless'] },
    grantsAbility: { ability: 'Fearless', units: ["C'tan Shard"] },
    notes: [
      "The C'tan Shard counts as an HQ selection and may select up to five upgrades (three otherwise). It loses \"Mindless\" and gains \"Fearless\"; its powers gain +6\" range and it knows \"Time's Arrow\". Costs +30 pts.",
      'Pariahs count as Troops.',
    ],
  },

  // ── Orks ──────────────────────────────────────────────────────────────────
  'Krumpa Kompany': { ...BASE,
    troopsRemap: ['Nobz'],
    allowedUnitsOnly: ['Boss', 'Big Mek', 'Mekboyz', 'Mekboy Junka', 'Painboyz', 'Nobz', 'Battlewagon', 'Deff Dreads'],
    notes: [
      'Restricted unit list — only: Boss, Big Mek, Mekboyz, Painboyz, Nobz, Battlewagon, Deff Dreads.',
      'Nobz count as Troops. All models that can must be equipped with Mega armor.',
      'All units gain "Objective secured!".',
    ],
  },

  'Speedfreaks': fastArchetype(['Stormboyz', 'Warbikers']),

  // Orks 1.5. Gretchins and Snotlings are Grot units without a Grot keyword, hence the by-name list. Not modelled: the
  // Runtherd ban and the loss of "Cowardly" (both are unit-model rules; see known-issues).
  'Gretchin Revolutionary Committee': { ...BASE,
    allowedKeywords: ['Grot', 'Vehicle'],
    allowedKeywordUnits: ['Gretchins', 'Snotlings'],
    troopsMinRatio: 0.15,
    grantsAbility: { ability: 'Mob', units: ['Gretchins', 'Snotlings'] },
    unitPatch: { units: ['Gretchins', 'Snotlings'], dropModels: ['Runtherd'], dropAbilityPrefixes: ['Cowardly:', 'Squig hound:'] },
    notes: [
      'Only Grot and Vehicle units may be taken.',
      'The army only needs to spend 15% of its points on Troops.',
      'All Grot units gain the "Mob" ability.',
      'Gretchin and Snotlings lose the "Cowardly" ability, and their units may not take Runtherds (removed from the units while this archetype is active).',
    ],
  },

  // ── Tau Empire ────────────────────────────────────────────────────────────
  'Farsight Enclave': { ...BASE,
    troopsRemap: ['Crisis Battlesuits'], demoteOtherTroops: true,
    bannedUnits: ['Ethereal', 'Ethereal Guard'],
    // "One unit each of Broadside Battlesuits and Riptide Battlesuits can be taken with an HQ slot if they consist of a single model."
    hqPromotion: { unitNameContains: 'Broadside', unitNameAlso: ['Riptide'], singleModel: true },
    notes: [
      'Crisis Battlesuits count as Troops. All other Troops become Elites.',
      'Ethereals may not be selected.',
      'A single Broadside or Riptide Battlesuit (1 model) may be taken in an HQ slot.',
    ],
  },

  'Kroot Hunting Pack': { ...BASE,
    // Only Kroot Carnivores are Troops (the other Kroot keep their own slots; confirmed by the author's
    // team 2026-10-08). The sheet's "only Kroot units count towards the 25% Troops limitation" is what
    // troopsCount 'remap' (an inclusion list) expresses. This list used to hold all seven Kroot units, which
    // moved every Kroot Elite, Fast Attack and Heavy Support into Troops (Troops 10/6 on the list below).
    troopsRemap: ['Kroot Carnivores'],
    troopsCount: 'remap',
    // Tau 1.4 dropped "Only Kroot units count towards mandatory unit minimums in the AOP" (and moved the Shaman to the
    // Master Shaper's own list), so `minimumsOnlyKeyword` is gone: every unit counts towards the minimums again.
    notes: [
      'For every 1,000 points of game size, or part thereof, you gain one Kroot Hunting Blind (3" x 3" abstract terrain, Light Cover, deployed as Infiltrators; not modelled in the builder).',
      'Kroot Farstalkers gain the "Objective secured!" ability.',
      'Only Kroot units count towards the 25% Troops requirement.',
    ],
  },

  'Stealth Cadre': { ...BASE,
    troopsRemap: ['Stealth Battlesuits', 'Ghostkeel Battlesuits'], demoteOtherTroops: true,
    requiresHqUpgrade: { unitNameContains: 'Commander', choiceName: 'XV22 Stalker battlesuit' },
    troopsModelRatioCap: { sourceUnits: ['Stealth Battlesuits'], modelsPerUnit: 6, cappedUnit: 'Ghostkeel Battlesuits' },
    notes: [
      'Stealth Battlesuits count as Troops. All other Troops become Elites.',
      'Must include at least one Commander equipped with an XV22 Stalker battlesuit.',
      'Stealth Battlesuits may equip each model with a Fusion blaster at the regular cost.',
      'For every 6 Stealth Shas\'ui/Shas\'vre models, one Ghostkeel Battlesuit unit may also count as Troops.',
    ],
  },

  // ── Tyranids ──────────────────────────────────────────────────────────────
  'Flying Death': { ...BASE,
    troopsRemap: ['Gargoyle Brood', 'Tyranid Warrior Brood'], troopsCount: 'remap',
    notes: [
      'Gargoyle Broods and Winged Tyranid Warrior Broods count as Troops.',
      'Only these units count towards the 25% Troops requirement.',
      'At least half of these models must start the game in reserves.',
    ],
  },

  /*
   * The four archetypes below are transcribed from Tyranids 1.08, Army Customisation (GH#168:
   * "Megafauna, subterranean assault, swarming masses, and vanguard onslaught ... change the
   * battlefield roles of various tyranids but this isn't applied yet in the app").
   *
   * Three of them were missing from the app entirely; Megafauna had its Troops half and not its
   * HQ half.
   */
  'Megafauna': { ...BASE,
    troopsRemap: ['Carnifex Brood'], troopsCount: 'remap',
    // "One Carnifex must be taken with the Regeneration(1) Special Biomorph and it becomes a HQ
    // selection." The biomorph is bought from the shared Armory, not from the datasheet's own
    // option groups, so the promotion is not gated on a choice name here — the note carries the
    // requirement and the validator would need the Armory selection to check it.
    // Tyranids 1.10 added: "The model gains the 'Fearless' and 'Synapse' abilities" and "The model costs +36 points".
    // "The model gains access to the Hive Fleet Armory": grantsArmoryAccess. It is the same armory a Hive Tyrant
    // reaches with "May additionally select items from the Hive Fleet Armory" -- the Legacy's, not all five (Discord, Unwise 2026-10-21).
    hqPromotion: { unitNameContains: 'Carnifex', requiresChoice: 'Regeneration', abilityUpgrade: { from: 'Regeneration(1)', to: 'Regeneration(2)' },
      extraPoints: 36, grantsAbilities: ['Fearless', 'Synapse'], grantsArmoryAccess: true },
    notes: [
      'One Carnifex with the Regeneration(1) Special Biomorph becomes an HQ selection.',
      'Regeneration(1) becomes Regeneration(2) for that model, and does not block a second Special Biomorph.',
      'The model gains Fearless and Synapse, and costs +36 points.',
      'The model gains access to the Hive Fleet Armory.',
      'Carnifex Broods count as Troops.',
      'Only Carnifex Broods count towards the 25% Troops requirement.',
    ],
  },

  'Subterranean Assault': { ...BASE,
    troopsRemap: ['Ravener Brood', 'Mawloc'], troopsCount: 'remap',
    // "One Trygon must be taken with the Trygon Prime upgrade and it becomes a HQ selection."
    hqPromotion: { unitNameContains: 'Trygon', requiresChoice: 'Trygon Prime', grantsArmoryAccess: true },
    // "For every 4 Ravener models, one Mawloc can be taken as Troops." Models, not units.
    troopsModelRatioCap: { sourceUnits: ['Ravener Brood'], modelsPerUnit: 4, cappedUnit: 'Mawloc' },
    notes: [
      'One Trygon with the Trygon Prime upgrade becomes an HQ selection.',
      'The model gains access to the Hive Fleet Armory.',
      'Ravener Broods count as Troops.',
      'For every 4 Ravener models, one Mawloc may also count as Troops.',
      'Only Ravener Broods and Mawlocs count towards the 25% Troops requirement.',
    ],
  },

  'Swarming Masses': { ...BASE,
    // "Genestealer Broods and Tyranid Warrior Broods become Elite choices." NAMED, so the gaunt
    // broods stay Troops — the same sentence grants them Combat Squad.
    elitesRemap: ['Genestealer Brood', 'Tyranid Warrior Brood'],
    grantsAbility: { ability: 'Combat squads', units: ['Barbgaunt Brood', 'Gargoyle Brood', 'Hormagaunt Brood', 'Neurogaunt Brood', 'Ripper Swarms', 'Termagant Brood'] },
    notes: [
      'Barbgaunt, Gargoyle, Hormagaunt, Neurogaunt, Ripper Swarm and Termagant Broods gain "Combat Squad".',
      'Genestealer Broods and Tyranid Warrior Broods become Elite choices.',
    ],
  },

  'Vanguard Onslaught': { ...BASE,
    troopsRemap: ["Von Ryan's Leaper Brood"], troopsCount: 'remap',
    // "One Deathleaper must be taken and it becomes a HQ selection."
    hqPromotion: { unitNameContains: 'Deathleaper' },
    requiresHqUnit: 'Deathleaper',
    notes: [
      'One Deathleaper must be taken, and it becomes an HQ selection.',
      "Von Ryan's Leaper Broods count as Troops.",
      "Only Von Ryan's Leaper Broods count towards the 25% Troops requirement.",
    ],
  },

  'Tyrannocyte Assault': dropPodArchetype('Tyrannocyte'),

  // ── Chaos Daemons ─────────────────────────────────────────────────────────
  // → see engine/archetypes/chaos_daemons/ (spread via CD_ARCHETYPES above)
};

/**
 * Archetypes the author has renamed. A saved army stores the archetype by name, so without this
 * every list built before the rename would silently lose its archetype — its supplement units
 * would go unrecognised and its slot maths would change. Keep entries here forever; they cost
 * nothing and removing one breaks somebody's saved list.
 */
const RENAMED_ARCHETYPES: Record<string, string> = {
  'Titan Legion': 'Taghmata',           // Adeptus Mechanicus, 2026-08 codex
  'Sector Protector': 'Sector Lord',    // Inquisition, 2026-09 codex (1.01)
  'War Hawks': 'Airborne Assault Company',  // Imperial Guard, 2026-09-17 sheet
  'Legion (Space Marines)': 'Legion SM',   // Space Marines, October 2026: the two Legion archetypes got distinct names
  'Legion': 'Legion CSM',                  // Chaos Space Marines (the Space Marines one was "Legion (Space Marines)")
  'Bloodbrides': 'Bloodbride Raid',        // Dark Eldar, 1.01 codex
  'Haemoxytes': 'Haemoxyte Raid',          // Dark Eldar, 1.01 codex
  'Trueborn': 'Trueborn Raid',             // Dark Eldar, 1.01 codex
};

/**
 * Legacies the author has renamed (same reasoning as RENAMED_ARCHETYPES: a saved list stores the name).
 */
const RENAMED_LEGACIES: Record<string, string> = {
  'Legacy of the Damned': 'Legacy of the Relic Hunters',   // Space Marines 1.11 (the name went to the Legion of the Damned supplement)
};

/** The current name for a legacy, for saved armies written before a rename. */
export function currentLegacyName(legacy: string): string {
  return RENAMED_LEGACIES[legacy] ?? legacy;
}

export function getArchetypeRule(archetype: string): ArchetypeRule | null {
  return ARCHETYPE_RULES[archetype] ?? ARCHETYPE_RULES[RENAMED_ARCHETYPES[archetype]] ?? null;
}

/** The current name for an archetype, for saved armies written before a rename. */
export function currentArchetypeName(archetype: string): string {
  return RENAMED_ARCHETYPES[archetype] ?? archetype;
}

/** Strip trailing god superscripts (ˢ ᴷ ᵀ ᴺ) from archetype names for display. */
export function cleanArchetypeName(name: string): string {
  // The Space Marines and Chaos Space Marines sheets both call their Horus Heresy archetype "Legiones Astartes"; the app keeps
  // two internal names (the rule table is keyed by name) and shows the sheet's.
  if (name === 'Legion SM' || name === 'Legion CSM') return 'Legiones Astartes';
  return name.replace(/ \(HH\)$/, '').replace(/[ˢᴷᵀᴺ]+$/, '');
}

/**
 * The same answer for a roster ENTRY, which can carry a slot change of its own.
 *
 * Yngir (Necrons, ods-verbatim): "One C'tan shard (any kind) counts as an HQ selection... It costs
 * an additional +85 points." That is a per-ENTRY choice, not a per-NAME remap, so it cannot live in
 * `troopsRemap` and `getEffectiveSlot` below cannot see it. The resolver re-slotted the chosen shard
 * to HQ for the unit card and the slot panel, but every slot count in `validators.ts` went through
 * the name-only function and still saw an Elite — so the shard filled an Elite slot and never
 * satisfied the HQ minimum (GH#129).
 *
 * Keyed on the flag alone, exactly as `points.ts` charges the +85, and the flag is cleared when the
 * army leaves the Yngir archetype (`setArchetype`).
 */
/** The part of `hqPromotion` (main name or one of `unitNameAlso`) that matches this unit, lower-cased, or null. Each fragment is claimed by one entry. */
export function promotionFragment(promo: { unitNameContains: string; unitNameAlso?: string[] }, unitName: string): string | null {
  const n = unitName.toLowerCase();
  return [promo.unitNameContains, ...(promo.unitNameAlso ?? [])].map(f => f.toLowerCase()).find(f => n.includes(f)) ?? null;
}

export function getEffectiveSlotFor(
  item: { unitName: string; slot: string; size?: number; ctanYngirUpgrade?: boolean; archetypeHqUpgrade?: boolean },
  rule: ArchetypeRule | null,
): string {
  if (item.ctanYngirUpgrade && /^C'tan Shard/.test(item.unitName)) return 'HQ';
  // The archetype's own HQ promotion, claimed by one entry (GH#168). Keyed on the flag alone,
  // exactly like the Yngir C'tan above; the flag is cleared when the archetype changes.
  if (item.archetypeHqUpgrade && rule?.hqPromotion
    && promotionFragment(rule.hqPromotion, item.unitName)
    && !(rule.hqPromotion.singleModel && (item.size ?? 1) !== 1)) return 'HQ';
  return getEffectiveSlot(item.unitName, item.slot, rule);
}

export function getEffectiveSlot(
  unitName: string,
  originalSlot: string,
  rule: ArchetypeRule | null,
): string {
  if (rule && rule.troopsRemap.includes(unitName)) return 'Troops';
  // Named demotion, read before the blanket one: an archetype that moves two units by name has
  // said nothing about the rest (Tyranid Swarming Masses).
  if (rule?.elitesRemap?.includes(unitName)) return 'Elites';
  if (rule?.demoteOtherTroops && originalSlot === 'Troops' && !rule.troopsRemap.includes(unitName)) return 'Elites';
  return originalSlot;
}

export function isUnitAllowed(
  unitName: string,
  unit: { locked_mark: string | null; has_veteran_abilities: boolean; keywords?: string[]; is_vehicle?: boolean; requires_archetype_unlock?: boolean },
  rule: ArchetypeRule | null,
  originalSlot?: string,
): boolean {
  if (unit.requires_archetype_unlock && !(rule?.unlocksUnits ?? []).includes(unitName)) return false;
  if (!rule) return true;
  if (rule.bannedUnits.includes(unitName)) return false;
  // "No other Troop units may be selected" (Necrons Obeisance Phalanx). Checked against the
  // PRINTED slot, like `bannedSlots` just below, so it is read before any remap moves the unit.
  if (rule.banOtherTroops && originalSlot === 'Troops' && !rule.troopsRemap.includes(unitName)) return false;
  if (originalSlot && rule.bannedSlots.includes(originalSlot)) return false;
  if (rule.requireForcedMarkOnly && rule.forcedMark) {
    if (unit.locked_mark && unit.locked_mark !== rule.forcedMark) return false;
  }
  // ...unless the archetype hands that access out itself (see grantVetAbilitiesToAll).
  if (rule.requireVetAbilities && !rule.grantVetAbilitiesToAll && !unit.has_veteran_abilities) return false;
  if (rule.allowedUnitsOnly.length > 0 && !rule.allowedUnitsOnly.includes(unitName)) return false;
  if (rule.allowedKeywords.length > 0) {
    // A Vehicle carries no keyword of its own: the type counts ("Only Grot and Vehicle units may be taken").
    const kws = [...(unit.keywords ?? []), ...(unit.is_vehicle ? ['Vehicle'] : [])];
    // "-" = Swords for hire: unit gains the army keyword automatically
    if (!kws.includes('-') && !kws.some(k => rule.allowedKeywords.includes(k)) && !(rule.allowedKeywordUnits ?? []).includes(unitName)) return false;
  }
  return true;
}

export function getEffectiveHqLimits(
  rule: ArchetypeRule | null,
  engagementHq: [number, number],
): [number, number] {
  if (rule?.hqOverride) return rule.hqOverride;
  return engagementHq;
}

export function countsTroops(
  unitName: string,
  lockedMark: string | null,
  rule: ArchetypeRule | null,
): boolean {
  if (!rule) return true;
  if (rule.troopsCountExclude?.includes(unitName)) return false;
  if (rule.troopsCount === 'all') return true;
  if (rule.troopsCount === 'locked') {
    return lockedMark === rule.forcedMark;
  }
  if (rule.troopsCount === 'remap') {
    return rule.troopsRemap.includes(unitName);
  }
  return true;
}
