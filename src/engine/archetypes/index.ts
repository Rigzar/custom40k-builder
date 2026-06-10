export type { ArchetypeRule } from './base';
import type { ArchetypeRule } from './base';
import { BASE, fastArchetype, dropPodArchetype } from './base';
import { CSM_ARCHETYPES } from '../codex_csm/archetypes/index';
import { CD_ARCHETYPES } from './chaos_daemons/index';
import { SM_ARCHETYPES } from './space_marines/index';

const ARCHETYPE_RULES: Record<string, ArchetypeRule> = {
  ...CSM_ARCHETYPES,
  ...CD_ARCHETYPES,
  ...SM_ARCHETYPES,

  // ── Adeptus Custodes ──────────────────────────────────────────────────────
  'Kataphraktoi': { ...BASE,
    troopsRemap: ['Jetbike Custodians'],
    notes: [
      'Jetbike Custodians count as Troops.',
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
    notes: [
      'Kastelan Robots count as Troops.',
      'Only Robot units count towards the 25% Troops requirement.',
      'Must take at least one Magos or Archmagos with the Datasmith upgrade.',
      'Access to Robot and Taghmata units from the HH Mechanicum supplement (not yet available in builder).',
    ],
  },

  'Dark Mechanicum': { ...BASE,
    notes: [
      'Allied to Chaos Space Marines as Allies of Convenience.',
      'All units may purchase a Mark of Chaos: +1 pt/Wound Khorne or Slaanesh, +2 pts/Wound Nurgle or Tzeentch.',
    ],
  },

  'Ordo Reductor Covenant': { ...BASE,
    troopsCount: 'remap',
    notes: [
      'Must take at least one Magos or Archmagos with the Myrmidax upgrade.',
      'Only Ordo Reductor units count towards the 25% Troops requirement.',
      'Access to Ordo Reductor and Taghmata units from the HH Mechanicum supplement (not yet available in builder).',
    ],
  },

  'Servitor Maniple': { ...BASE,
    troopsRemap: ['Servitors'],
    notes: [
      'Servitors count as Troops.',
      'Each Servitor Troops unit must be accompanied by a Tech-priest (does not use an Elite slot).',
    ],
  },

  'Titan Legion': { ...BASE,
    troopsRemap: ['Secutarii Hoplites', 'Secutarii Peltasts'], troopsCount: 'remap',
    notes: [
      'Secutarii Hoplites and Peltasts count as Troops.',
      'Only Secutarii units count towards the 25% Troops requirement.',
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
    notes: [
      'Arco-flagellants and Repentia count as Troops. For every 10 Arco-flagellant models, one Penitent Engines unit may also count as Troops.',
      'Battle Sisters and Sisters Novitiate are moved to the Elites slot.',
    ],
  },

  'Shrine Wardens': { ...BASE,
    troopsRemap: ['Celestian Sacresants'], demoteOtherTroops: true,
    bannedUnits: ['Arco-flagellants', 'Repentia Squad', 'Penitent Engines'],
    notes: [
      'Celestian Sacresants count as Troops.',
      'Battle Sisters and Sisters Novitiate are moved to the Elites slot.',
      'Arco-flagellants, Repentia and Penitent Engines cannot be selected.',
    ],
  },

  // ── Dark Eldar ────────────────────────────────────────────────────────────
  'Ynnari (Dark Eldar)': { ...BASE, noLegacy: true,
    notes: [
      'Allied to Eldar as Battle Brothers.',
      'Access to the Ynnari Armory and Revenant discipline (see Eldar).',
      'No Legacy may be selected.',
    ],
  },

  // ── Eldar ─────────────────────────────────────────────────────────────────
  'Aspect Focus': { ...BASE,
    demoteOtherTroops: true,
    notes: [
      'All Aspect Warrior units count as Troops.',
      'Non-Aspect Troops are moved to the Elites slot.',
    ],
  },

  'Exemplars of the Shrines': { ...BASE,
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
    troopsRemap: ['Wraithblades', 'Wraithguard'], demoteOtherTroops: true,
    notes: [
      'Wraithblades and Wraithguard count as Troops.',
      'Non-Wraith Troops are moved to the Elites slot.',
    ],
  },

  'Ynnari (Eldar)': { ...BASE, noLegacy: true,
    notes: [
      'Allied to Eldar as Battle Brothers.',
      'Access to the Ynnari Armory and Revenant discipline.',
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
    notes: [
      'Purifier Squads count as Troops.',
      'All other Troops choices are moved to the Elites slot.',
    ],
  },

  'Hall of Champions': { ...BASE,
    troopsRemap: ['Paladin Squad'], demoteOtherTroops: true,
    notes: [
      'Paladin Squads count as Troops.',
      'All other Troops choices are moved to the Elites slot.',
    ],
  },

  // ── Imperial Guard ────────────────────────────────────────────────────────
  'Cavalry Regiment': fastArchetype(['Rough Riders']),

  'Mechanised Company': { ...BASE,
    bannedUnits: ['Leman Russ Tank Commander', 'Leman Russ Commissar'],
    notes: [
      'Dedicated Transports from Mechanised Infantry squads count at 50% of their points toward the 25% Troops requirement.',
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
    troopsRemap: ['Veterans'], requireVetAbilities: true,
    notes: [
      'Veterans count as Troops.',
      'All units must select at least one veteran ability.',
    ],
  },

  'War Hawks': { ...BASE,
    bannedSlots: ['Heavy Support'],
    notes: [
      'The army doubles the number of units that may arrive from reserves each round.',
      'No Heavy Support units may be selected.',
    ],
  },

  'Whiteshields': { ...BASE,
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
    notes: [
      'Treated as Allies of Convenience for Genestealer Cults.',
      'All units must gain the "Ambush" ability at +1 pt per Wound.',
      'Models with Armory access may also use the Genestealer Cult Armory.',
    ],
  },

  'Gue\'vesa': { ...BASE,
    notes: [
      'Treated as Allies of Convenience for Tau Empire.',
      'All units must gain "Supporting Fire" at +1 pt per Wound or +2 pts per Hull point.',
      'Creature units equipped with a Lasgun may exchange it for a Pulse rifle at +3 pts.',
    ],
  },

  'Traitor Guard': { ...BASE,
    notes: [
      'Treated as Allies of Convenience for Chaos Space Marines.',
      'All units may purchase a Mark of Chaos: +1 pt/model Khorne or Slaanesh, +2 pts/model Nurgle or Tzeentch; vehicles +10 pts.',
    ],
  },

  // ── Leagues of Votann ─────────────────────────────────────────────────────
  'Demiurg': { ...BASE,
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
    notes: [
      'For every 500 pts of game size, one Brokhyr Iron-master may be included without occupying an HQ slot.',
      'Hearthkyn Warriors do not count towards the 25% Troops requirement.',
    ],
  },

  'Persecution Prospect': fastArchetype(['Hernkyn Yaegirs']),

  // ── Necrons ───────────────────────────────────────────────────────────────
  'Canoptek Court': { ...BASE,
    hqAllowed: ['Cryptek'],
    notes: [
      'Only Crypteks may be taken as HQ. Up to 2 Crypteks may be taken per HQ slot.',
      'Canoptek units gain the "Objective secured!" ability.',
    ],
  },

  'Destroyer Cult': { ...BASE,
    troopsRemap: ['Skorpekh Destroyers'],
    allowedUnitsOnly: [
      'Ancient Destructor Lord', "C'tan Shard", "C'tan Shard of the Deceiver",
      "C'tan Shard of the Dragon", "C'tan Shard of the Nightbringer",
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
    troopsRemap: ['Lychguard', 'Triarch Praetorians'], demoteOtherTroops: true,
    requiresHqUnit: 'Lord',
    notes: [
      'Lychguard and Triarch Praetorians count as Troops. No other Troops may be selected.',
      'A Lord or Overlord must be taken as HQ.',
    ],
  },

  'Yngir': { ...BASE,
    troopsRemap: ['Pariahs'],
    notes: [
      'One C\'tan Shard counts as an HQ selection. It gains +1 Str, +1 T, +1 I, +1 A, 2+ save, +6" range on powers, and knows "Time\'s Arrow". Costs +85 pts.',
      'Pariahs count as Troops.',
    ],
  },

  // ── Orks ──────────────────────────────────────────────────────────────────
  'Krumpa Kompany': { ...BASE,
    troopsRemap: ['Nobz'],
    allowedUnitsOnly: ['Boss', 'Big Mek', 'Mekboy', 'Mekboy Junka', 'Painboy', 'Nobz', 'Battlewagon', 'Deff Dreads'],
    notes: [
      'Restricted unit list — only: Boss, Big Mek, Mekboy, Painboy, Nobz, Battlewagon, Deff Dreads.',
      'Nobz count as Troops. All models that can must be equipped with Mega armor.',
      'All units gain "Objective secured!".',
    ],
  },

  'Speedfreaks': fastArchetype(['Stormboyz', 'Warbikers']),

  // ── Tau Empire ────────────────────────────────────────────────────────────
  'Farsight Enclave': { ...BASE,
    troopsRemap: ['Crisis Battlesuits'], demoteOtherTroops: true,
    bannedUnits: ['Ethereal', 'Ethereal Guard'],
    notes: [
      'Crisis Battlesuits count as Troops. All other Troops become Elites.',
      'Ethereals may not be selected.',
      'A single Broadside or Riptide Battlesuit (1 model) may be taken in an HQ slot.',
    ],
  },

  'Kroot Hunting Pack': { ...BASE,
    troopsRemap: ['Kroot Carnivores', 'Kroot Farstalkers', 'Kroot Hounds', 'Kroot Trackers',
                  'Kroot Vultures', 'Krootox Riders', 'Krootox Rampagers'],
    troopsCount: 'remap',
    notes: [
      'Kroot Farstalkers gain the "Objective secured!" ability.',
      'One Kroot Master Shaper may be upgraded to a Shaman for +10 pts (Psyker, 1 cast/1 deny, knows 2 powers from Biomancy or Divination).',
      'Only Kroot units count towards the 25% Troops requirement.',
    ],
  },

  'Stealth Cadre': { ...BASE,
    troopsRemap: ['Stealth Battlesuits'], demoteOtherTroops: true,
    requiresHqUnit: 'Commander',
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

  'Megafauna': { ...BASE,
    troopsRemap: ['Carnifex Brood'], troopsCount: 'remap',
    notes: [
      'Carnifex Broods count as Troops.',
      'Only Carnifex Broods count towards the 25% Troops requirement.',
    ],
  },

  'Tyrannocyte Assault': dropPodArchetype('Tyrannocyte'),

  // ── Chaos Daemons ─────────────────────────────────────────────────────────
  // → see engine/archetypes/chaos_daemons/ (spread via CD_ARCHETYPES above)
};

export function getArchetypeRule(archetype: string): ArchetypeRule | null {
  return ARCHETYPE_RULES[archetype] ?? null;
}

/** Strip trailing god superscripts (ˢ ᴷ ᵀ ᴺ) from archetype names for display. */
export function cleanArchetypeName(name: string): string {
  return name.replace(/[ˢᴷᵀᴺ]+$/, '');
}

export function getEffectiveSlot(
  unitName: string,
  originalSlot: string,
  rule: ArchetypeRule | null,
): string {
  if (rule && rule.troopsRemap.includes(unitName)) return 'Troops';
  if (rule?.demoteOtherTroops && originalSlot === 'Troops' && !rule.troopsRemap.includes(unitName)) return 'Elites';
  return originalSlot;
}

export function isUnitAllowed(
  unitName: string,
  unit: { locked_mark: string | null; has_veteran_abilities: boolean },
  rule: ArchetypeRule | null,
  originalSlot?: string,
): boolean {
  if (!rule) return true;
  if (rule.bannedUnits.includes(unitName)) return false;
  if (originalSlot && rule.bannedSlots.includes(originalSlot)) return false;
  if (rule.requireForcedMarkOnly && rule.forcedMark) {
    if (unit.locked_mark && unit.locked_mark !== rule.forcedMark) return false;
  }
  if (rule.requireVetAbilities && !unit.has_veteran_abilities) return false;
  if (rule.allowedUnitsOnly.length > 0 && !rule.allowedUnitsOnly.includes(unitName)) return false;
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
  if (!rule || rule.troopsCount === 'all') return true;
  if (rule.troopsCount === 'locked') {
    return lockedMark === rule.forcedMark;
  }
  if (rule.troopsCount === 'remap') {
    return rule.troopsRemap.includes(unitName);
  }
  return true;
}
