/**
 * Army-wide special rules per faction.
 * Source: "Special rules" / "Army specific Rules:" section of each faction's Index sheet in the canonical .ods files.
 */

export type RuleTag = 'signature' | 'ally' | 'deployment' | 'weapon' | 'universal';

export interface ArmyRule {
  name: string;
  description: string;
  tag?: RuleTag;
}

export const ARMY_RULES: Record<string, ArmyRule[]> = {

  // ── CHAOS ──────────────────────────────────────────────────────────────────

  chaos_space_marines: [
    {
      name: 'Animosity of the Gods',
      description: 'See the "Animosity of the Gods" sheet for the full compatibility matrix governing which Marks of Chaos may coexist in the same squad.',
      tag: 'signature',
    },
    {
      name: 'Favored Units',
      description: "If a unit has a Mark of Chaos and starts the game with a number of models equal to the deity's sacred number (or a multiple thereof), it counts as favored. Squad leaders receive +1 attack and a personal icon. Squad leaders are single models within a unit that have sole access to the armory. The sacred numbers are as follow: 9 for Tzeentch, 8 for Khorne, 7 for Nurgle and 6 for Slaanesh.",
      tag: 'signature',
    },
    {
      name: 'Mark of Chaos Undivided',
      description: 'The first time this model kills an enemy unit, it receives the benefits of one Mark of Chaos like a non-character model. If it kills a second unit, it gains the additional benefit like a character model would. After the third kill it receives one Daemon weapon ability from the chosen god. After the fourth kill the model\'s base stats are replaced by those of a Daemon Prince of the chosen god. If the model loses its last Wound before getting at least one Mark of Chaos benefit, it is replaced with a Chaos Spawn under the control of the opposing player.',
      tag: 'universal',
    },
    {
      name: 'Mark of Khorne',
      description: 'The model gains +1 Attack. A character model or Monstrous Creature gains additionally +1 Strength. Vehicles cause double hits when performing a Tank Shock. Counts as a veteran ability.',
      tag: 'universal',
    },
    {
      name: 'Mark of Nurgle',
      description: "The model gains +1 Toughness. A character model or Monstrous Creature gains additionally +1 Wound. Vehicles may roll 2D6 during each Reinforcement phase. On a roll of 7+ they may either remove a \"Crew Shaken\" result, or one \"Engine Damage\" or one \"Weapon Damage\" or restore one lost HP. Counts as a veteran ability.",
      tag: 'universal',
    },
    {
      name: 'Mark of Slaanesh',
      description: "The model gains +1 Initiative. A character model or Monstrous Creature additionally gains additionally +2\" Movement. Vehicles lower the Ld or close combat result of hostile models by -1 within a 18\" range and by -2 within 9\". Counts as a veteran ability.",
      tag: 'universal',
    },
    {
      name: 'Mark of Tzeentch',
      description: "The model gains the \"Warded\" ability. A character model or Monstrous Creature becomes a psyker and knows 1 power from any discipline. If the model is already a psyker, instead it can manifest and deny an additional power per battle round. Vehicles get a Warpflamer weapon (Range: 9\", Type: Assault 4, S: 4, AP: -1, Dmg: 1, Auto Hit, Sunder(1)). Counts as a veteran ability.",
      tag: 'universal',
    },
    {
      name: 'Summoning',
      description: "If the army contains any units from the \"Chaos Daemons\" codex, these units must start the game as reserve, with the exception of Nurglings who can be deployed regularely. Character models are not allowed to join a unit from the Chaos Daemons codex. Chaos Daemons can not be used to fulfill mandatory AOP selections.",
      tag: 'ally',
    },
  ],

  chaos_daemons: [
    {
      name: 'Favored Units',
      description: "If a unit has a Mark of Chaos and starts the game with a number of models equal to the deity's sacred number (or a multiple thereof), it counts as favored. Squad leaders receive +1 attack and a personal icon. Squad leaders are single models within a unit that have sole access to the armory. The sacred numbers are as follow: 9 for Tzeentch, 8 for Khorne, 7 for Nurgle and 6 for Slaanesh.",
      tag: 'signature',
    },
    {
      name: 'Mark of Khorne',
      description: 'The model gains +1 Attack. A character model or Monstrous Creature gains additionally +1 Strength. Vehicles cause double hits when performing a Tank Shock. Counts as a veteran ability.',
      tag: 'universal',
    },
    {
      name: 'Mark of Nurgle',
      description: "The model gains +1 Toughness. A character model or Monstrous Creature gains additionally +1 Wound. Vehicles may roll 2D6 during each Reinforcement phase. On a roll of 7+ they may either remove a \"Crew Shaken\" result, or one \"Engine Damage\" or one \"Weapon Damage\" or restore one lost HP. Counts as a veteran ability.",
      tag: 'universal',
    },
    {
      name: 'Mark of Slaanesh',
      description: "The model gains +1 Initiative. A character model or Monstrous Creature additionally gains additionally +2\" Movement. Vehicles lower the Ld or close combat result of hostile models by -1 within a 18\" range and by -2 within 9\". Counts as a veteran ability.",
      tag: 'universal',
    },
    {
      name: 'Mark of Tzeentch',
      description: "The model gains the \"Warded\" ability. A character model or Monstrous Creature becomes a psyker and knows 1 power from any discipline. If the model is already a psyker, instead it can manifest and deny an additional power per turn. Vehicles get a Warpflamer weapon (Range: 9\", Type: Assault 4, S: 4, AP: -1, Dmg: 1, Auto Hit, Sunder(1)). Counts as a veteran ability.",
      tag: 'universal',
    },
  ],

  // ── IMPERIUM ───────────────────────────────────────────────────────────────

  space_marines: [
    {
      name: 'They Shall Know No Fear',
      description: "A pinned or fleeing unit automatically regroups at the start of the turn or when it reaches the edge of the board. It may never use the \"Take cover\" Defensive reaction.",
      tag: 'universal',
    },
  ],

  imperial_guard: [
    {
      name: 'Orders',
      description: "- For each model with the \"Officer\" rule in your army, that is not currently fleeing (two Battleshock tokens), you may select one or more Orders during the Reinforcement phase, that are in effect for your army for the remaining battle round.\n- Each of the Imperial Guard's own units (= units selected from this codex OR from the Imperial Guard units in the Escalation supplement) can use one of the previously selected orders at the specified time, as long as it is within 12\" of any Officer at the start of its activation.\n- An order is not consumed and any number of units can use the same order in a turn.\n- Unless otherwise stated, the effect of the order lasts until the end of the unit's activation.\n- Each unit can only benefit from a single order per turn.\n- An Officer knows all orders from the list of orders.",
      tag: 'signature',
    },
    {
      name: 'Weapon Team Crews',
      description: 'Some units have the option to have their models form a "Heavy weapons team". These models use the "Heavy Weapon Squad" profile.',
      tag: 'universal',
    },
  ],

  grey_knights: [
    {
      name: 'They Shall Know No Fear',
      description: 'A pinned or fleeing unit automatically regroups at the start of the turn or when it reaches the edge of the board. It can never use the "Take cover" Defensive reaction.',
      tag: 'universal',
    },
    {
      name: 'Nemesis Warding Stave',
      description: 'If one model of the unit is equipped with this weapon, all models of the unit gain "Parry".',
      tag: 'weapon',
    },
    {
      name: 'Psykers and Force Weapons',
      description: 'If the entire unit can cast a psychic power, a specific model in the squad must be chosen for each attempt. Only that model can activate their Force weapon and suffer "Perils of the Warp" attacks.',
      tag: 'universal',
    },
    {
      name: 'Shrouding',
      description: 'The model gains "Deflect" against all attacks that are more than 12" away.',
      tag: 'universal',
    },
    {
      name: 'Teleport Strike',
      description: 'For every full 2500 points of game size, the army gains 3 teleportation tokens. For each token, a Grey Knights creature unit (including attached character models) or Dreadnought that is not currently in melee may be removed from the table at the start of its activation and immediately deployed according to the rules for Deep Strike. The unit\'s command is changed to "Move & Shoot" and it counts as having moved at maximum range.',
      tag: 'deployment',
    },
    {
      name: 'True Grit',
      description: "The model may treat all of its ranged weapons during its Activation as \"Assault\" weapons (f.e. Rapid Fire 2 becomes Assault 2) and gains +1 attack for any combination of a ranged weapon with a melee weapon, not just for Pistols.",
      tag: 'universal',
    },
  ],

  adeptus_mechanicus: [
    {
      name: 'Canticles of the Omnissiah',
      description: 'At the start of the Command phase, choose a single Canticle of the Omnissiah. All units with this rule that are partially within 9" of a model with "Choir Master" roll a D6; on a 4+, they gain the benefits of the chosen Canticle until the end of the Battle Round.',
      tag: 'signature',
    },
    {
      name: 'Choir Master',
      description: 'Units containing this model automatically pass their Canticle of the Omnissiah roll.',
      tag: 'universal',
    },
    {
      name: 'Cognis',
      description: 'The weapon reduces its total penalty to hit rolls in ranged combat by -1, down to a minimum of 0.',
      tag: 'weapon',
    },
    {
      name: 'Luminagen',
      description: "A unit that suffers one or more unsaved Wounds, glancing or penetrating hits caused by a weapon with this special rule counts its cover saves as being 1 point worse than normal until the end of the battle round. Furthermore, they suffer an additional -1 to hit penalty for Defensive fire.",
      tag: 'weapon',
    },
    {
      name: 'Monotask',
      description: 'This unit does not benefit from Canticles of the Omnissiah unless it is accompanied by a character with "Choir Master".',
      tag: 'universal',
    },
    {
      name: 'Tesla',
      description: 'To hit rolls of 5+ are always successful and the target suffers 2 additional automatic hits.',
      tag: 'weapon',
    },
  ],

  adeptus_sororitas: [
    {
      name: 'Acts of Faith',
      description: 'The unit may perform an Act of Faith. Each unit can use as many Acts of Faith per battle round as the army has Faith points, but can only benefit from one effect at a time. Attached character models gain the same benefit if they have this rule. Even though character models are treated as their own unit in close combat, they benefit from the Act of Faith of the other participating unit.',
      tag: 'signature',
    },
    {
      name: 'Pious',
      description: 'The unit generates the specified number of Faith Points for the army once during the first Rally phase and then again immediately when it is removed as a casualty.',
      tag: 'universal',
    },
    {
      name: 'Shield of Faith',
      description: "The model receives Ward(6+)",
      tag: 'universal',
    },
  ],

  adeptus_custodes: [
    {
      name: 'Shield Host',
      description: "- Any model with this rule can contest a mission objective while being in the same table quarter and hold a mission objective while being within 12\" of it, instead of the regular 3\".\n- Additionally, the model gains the \"Objective secured!\" ability.\n- Additionally, if the model would gain two Battleshock tokens, it instead is set to one token.\n- Additionally, if the model would lose a Melee combat, the result is changed to a draw.\n- Additionally, the model may never receive the \"Escape\" order or \"Take Cover\" Meta order.\n- Additionally, all attacks gain the \"Precision(5+)\" ability.",
      tag: 'signature',
    },
    {
      name: 'Lightning Strike',
      description: 'For each started 1000 points of game size, one Infantry/Walker unit (including attached character models) may be set up using the rules for Deep Strike for +1/+4 point(s) per Wound/Hull Point.',
      tag: 'deployment',
    },
  ],

  inquisition: [
    {
      name: 'Legendary Retinue',
      description: "You may select up to 4 models chosen from the HQ section of the following armies: Adeptus Mechanicus, Adeptus Sororitas, Imperial Guard, Space Marines. You can't select more than one unit from each faction and none of the models may be unique per army. The model must start out with the \"Infantry\" type, though it may change its type from purchased equipment. The chosen units may only purchase equipment from their own respective armories and may not select any unique equipment. The Retinue is one HQ choice.",
      tag: 'signature',
    },
    {
      name: 'Authority of the Inquisition',
      description: "Every model in the army with access to the Armory may select a single item from any Imperial faction. Does not apply to \"Legendary Retinue\".",
      tag: 'signature',
    },
  ],

  imperial_navy: [
    {
      name: 'Legendary Retinue',
      description: "You may select up to 4 models chosen from the HQ section of the following armies: Adeptus Mechanicus, Adeptus Sororitas, Imperial Guard, Space Marines. You can't select more than one unit from each faction and none of the models may be unique per army. The model must start out with the \"Infantry\" type, though it may change its type from purchased equipment. The chosen units may only purchase equipment from their own respective armories and may not select any unique equipment. The Retinue is one HQ choice.",
      tag: 'signature',
    },
    {
      name: 'Warrant of Trade',
      description: 'Allied Troop units from "Allies of Convenience" retain their "Objective Secured!" ability. Additionally, the army doubles its available slots for allied detachments.',
      tag: 'signature',
    },
  ],

  assassins: [
    {
      name: 'Execution Force',
      description: 'Any Imperial army may select either a single Assassin or one of each for a single Elite slot.',
      tag: 'ally',
    },
    {
      name: 'Cults Abominatioe',
      description: 'Any Chaos army may select either a single Assassin or one of each for a single Elite slot.',
      tag: 'ally',
    },
  ],

  // ── XENOS ─────────────────────────────────────────────────────────────────

  eldar: [
    {
      name: 'Battle Focus',
      description: '"Assault", "Grenade" and "Pistol" type weapons ignore the to hit penalty for "Advance" and "Charge" orders. "Heavy" weapons can be used without penalty with a "Move & Shoot" order and with a -1 to hit penalty with "Advance" and "Charge" orders. All psychic powers are treated as "Basic".',
      tag: 'signature',
    },
    {
      name: 'Shuriken',
      description: 'To wound rolls of 5+ gain additional -2 AP.',
      tag: 'weapon',
    },
    {
      name: 'Visitors of the Black Library',
      description: 'The army has access to Harlequin units. Harlequins cannot be the mandatory HQ selection.',
      tag: 'ally',
    },
    {
      name: 'Webway Strike',
      description: 'For each started 1000 points of game size, one infantry unit (including attached character models) may be set up using the rules for Infiltrators for +1 point per Wound.',
      tag: 'deployment',
    },
  ],

  dark_eldar: [
    {
      name: 'Combat Drugs',
      description: 'After all units have been set up, you may pick a combat drug for the unit. Its effect lasts for the remaining battle.',
      tag: 'signature',
    },
    {
      name: 'Power through Pain',
      description: "Each time an enemy unit is destroyed, the army gains a \"Power Through Pain\" token, which is assigned a special rule from the list. Then distribute the token to any friendly unit with the \"Power Through Pain\" special rule. All models in a unit benefit from the bonus, but multiple markers with the same bonus don't stack. Effects:\n- Aegis(4+)\n- Berserk(5+)\n- Furious Charge\n- +1 Initiative\n- +1 Leadership\n- +1 Strength",
      tag: 'signature',
    },
    {
      name: 'Visitors of the Black Library',
      description: 'The army has access to Harlequin units. Harlequins cannot be the mandatory HQ selection.',
      tag: 'ally',
    },
    {
      name: 'Webway Raid',
      description: 'For each started 1000 points of game size, one infantry unit (including attached character models) may be set up using the rules for Infiltrators for +1 point per wound.',
      tag: 'deployment',
    },
  ],

  harlequins: [
    {
      name: 'Shuriken',
      description: 'To wound rolls of 5+ gain additional -2 AP.',
      tag: 'weapon',
    },
    {
      name: 'Webway Strike',
      description: 'For each started 1000 points of game size, one infantry unit (including attached character models) may be set up using the rules for Infiltrators for +1 point per Wound.',
      tag: 'deployment',
    },
  ],

  tau_empire: [
    {
      name: 'Markerlight',
      description: "During each Reinforcement phase, place a number of Markerlight tokens next to each unit equal to the number of \"Markerlight“ shots they have. These Markerlight tokens can be assigned to enemy units that are targeted by the activated unit. Friendly units that are in range and line of sight of the target may assign their Markerlight tokens to it as well during the same activation. Markerlight tokens can be spent to gain a number of benefits (see table).\n\n# Token/Cost - Effect\n1 - Re-roll a single wound roll.\n1 - One Seeker missile equipped by the unit may automatically hit the target.\n1 - Reduce the enemy Leadership by a cumulative 1 until the end of the battle round.\n2 - Attacks gain the cumulative \"Sunder(1)\" ability.\n2 - Reduce the to hit penalty for Defensive Fire by 1.\n2 - Re-roll ranged to hit rolls of 1 .\n2 - Re-roll a single armor penetration roll.\n3 - The target must pass a Leadership test or gain a Battleshock token.\n3 - The target is hit by a Seeker missile (see Armory) from outside the battlefield. Vehicles are hit on the side the unit would normally be able to hit.\n\nExample: A unit that wants to re-roll ranged to hit rolls of 1 and reduce the cover bonus for the enemy by 1 must remove a total of 4 tokens from the target unit.\n\nLimitations:\n- Markerlight tokens cannot be assigned to units that are locked in melee combat.\n- A maximum of 5 Markerlight tokens may be assigned per activation.\n- A unit must declare which Markerlight effects it wishes to use before making any Hit rolls.\n- A unit must spend its own Markerlight tokens before using tokens from friendly units.\n- Each Markerlight token may only be spent on a single effect from the table. Any unused tokens are discarded at the end of the battle round.\n\nNote that Markerlights are never \"shot\" like other ranged weapons and can be used regardless of the order of a unit. Some units have Markerlights shown in their profile with the \"Heavy\" type, but that is only for lore reasons.",
      tag: 'signature',
    },
    {
      name: 'Supporting Fire',
      description: "If a friendly unit within 6\" is the target of a charge and is using Defensive Fire, this unit may be activated in the same way to use Defensive fire at the charging enemy. Note that this is only doable with an unused order token and will use up that same token.",
      tag: 'universal',
    },
  ],

  necrons: [
    {
      name: 'Gauss',
      description: 'To wound rolls of 5+ against creatures are always successful. Armor penetration rolls of 5+ against vehicles gain a cumulative +1 AT and always inflict a Glancing Hit, unless the result is already sufficient for a Penetrating Hit.',
      tag: 'weapon',
    },
    {
      name: 'Tesla',
      description: 'To hit rolls of 5+ are always successful and the target suffers 2 additional automatic hits.',
      tag: 'weapon',
    },
    {
      name: 'Reanimation Protocols',
      description: 'The army receives 3 Reanimation Points (RPoints) for every 500 points of game size. During the Reinforcement phase, each unit must be allocated at least as many RPoints as the number of wounds it has lost (including slain models). Roll one die per RPoint: on a 4+, the unit regains one wound and the RPoint is retained; on a 3, no wound but the RPoint is retained; on a 1–2, no wound and the RPoint is lost. Damaged models must be healed before slain models can return. If a unit is completely wiped out, leave the last model on the field until the next Reinforcement phase; such units take a -1 penalty on the roll. If not revived, the unit is permanently removed. Restored models must be placed in base contact with as many remaining models as possible. A model killed by a weapon of at least twice its own Toughness cannot use Reanimation Protocols.',
      tag: 'signature',
    },
  ],

  orks: [
    {
      name: 'Dakka Dakka Dakka',
      description: "The unit reduces its total penalty to hit rolls in ranged combat by -1, down to a minimum of 0. Blast(x) weapons do not benefit from this rule.",
      tag: 'universal',
    },
    {
      name: 'Mob',
      description: "For every 5 models in your squad with this rule, the unit receives a cumulative bonus of +1 to its Leadership value. As long as a unit contains 20 or more models, it receives the \"Fearless\" special rule. In addition, any unit reduced to less than half of its starting strength may merge with another unit that has this rule for the remainder of the game. To do so, it must begin the battle round within 2\" of the unit it wishes to join. The merge occurs during the Rally phase, before any Leadership tests are taken. From that point on, the two units act as a single unit and receive only one shared order.",
      tag: 'signature',
    },
    {
      name: 'Tellyporta',
      description: "For each started 1000 points of game size, one unit may be set up for +1 point per Wound according to the rules for Deep strike. Vehicles and Monstrous Creatures may be set up for +4 points per Hull Point / Wound according to the rules for Deep strike. Individual models from a squadron are treated as independent units.",
      tag: 'deployment',
    },
    {
      name: 'Waaagh!',
      description: "The army may declare a Waaagh! once per game at the beginning of the Command phase, lasting two battle rounds. Infantry and Walkers with the \"Waaagh!\" rule gain an additional Movement of 1D6\", which is not taken into account when determining which weapons they may fire. Other vehicles, Bikes and Jump pack infantry gain the \"Deflect\" ability instead if they have moved with their maximum possible movement value (but at least 8\"). In a \"Skirmish\" game the effect only lasts one battle round.",
      tag: 'signature',
    },
  ],

  tyranids: [
    {
      name: 'Synapse',
      description: "Units with this ability explode like a vehicle upon losing their last Wound.\nUnits within 12\" of a model with this ability are in Synapse range:\n- They ignore modifiers to their Leadership value.\n- They always count as being at starting strength.\n- All Leadership tests are treated as successful, regardless of the result.\n- However, if the unit has suffered at least 1 unsaved Wound before taking the test and the result would normally fail, it suffers 1 Mortal Wound for each point by which the result exceeds its Leadership value. The unit does not receive a Battleshock token and is still treated as having passed the Leadership test for all rules purposes.\n- They lose all existing Battleshock tokens at the start of the Rally phase.",
      tag: 'signature',
    },
    {
      name: 'Shadow in the Warp',
      description: "Enemy psykers suffer a -1 penalty to manifest and deny psychic powers. Enemy units suffer a -1 penalty to their Leadership starting in the 3rd battle round. Both penalties are doubled for enemy units that are within Synapse range.",
      tag: 'universal',
    },
    {
      name: 'Instinctive Behaviour',
      description: "If the unit is outside of Synapse range during the Rally phase and has no Battleshock marker, it gains one. This marker can only be removed by being in Synapse range during the next Rally phase. If a unit outside of Synapse range has to flee, it moves towards the closest Synapse unit. Units that start off the board as reserves count as being within Synapse range during the Rally phase.",
      tag: 'universal',
    },
    {
      name: 'Psychic Feedback',
      description: "Whenever a model in your army would roll on the Perils of the Warp table, it instead suffers 1 Mortal Wound.",
      tag: 'universal',
    },
  ],

  genestealer_cults: [
    {
      name: 'Ambush',
      description: "For each started 500 points of game size, one \"Ambush marker\" may be set up on the battlefield after all Infiltrators have been deployed, but before the first battle round starts.\n\n- The marker must be set up at least 12\" away from any enemy unit and at least 6\" away from a mission objective or another Ambush marker.\n- Units entering play from reserves with the \"Ambush\" rule may be set up within 3\" of it and be given any kind of order.\n- Any creature unit with the \"Ambush\" rule may \"embark\" into a marker like a transport vehicle, be removed from the field and put into reserves.\n- Units that enter reserves in this way automatically arrive during the Reinforcemente phase in the next battle round.\n- They do count towards the limit of how many units may arrive from reserves each round.\n- If an enemy unit is within 3\" of an Ambush marker during the Reinforcement phase, the marker is removed for the rest of the game.",
      tag: 'deployment',
    },
  ],

  leagues_of_votann: [
    {
      name: 'Eye of the Ancestors',
      description: "Everytime a friendly unit is removed from the game, place a Judgement token next to the enemy unit that caused the last wound. An enemy unit can't have more than 2 Judgement tokens at the same time. All friendly units attacking a target with at least 1 Judgement token gain the following, cumulative benefits:",
      tag: 'signature',
    },
    {
      name: 'Steady Advance',
      description: 'The unit can never receive an "Advance" order and gains the "Move through cover" ability.',
      tag: 'universal',
    },
    {
      name: 'Void Armor',
      description: 'Enemy attacks reduce their AT and AP value by -1, to a minimum of 0 each.',
      tag: 'universal',
    },
  ],

  // ── SUPPLEMENTS ────────────────────────────────────────────────────────────
  // HH supplement and Escalation use the rules of the parent codex (SM/CSM and faction codices respectively).
  horus_heresy: [],
  legio_titanicus: [],
  legion_of_the_damned: [],
  escalation: [],
};
