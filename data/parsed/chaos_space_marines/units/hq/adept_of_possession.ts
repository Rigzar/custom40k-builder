/**
 * ADEPT OF POSSESSION — HQ
 *
 * SOURCE: Chaos Space Marines ENG / Adept of Possession.html (canonical datasheet)
 * ──────────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME                  M    WS   BS   S  T  W  I  A  LD  SV  PTS
 *   1    Adept of Possession   6"   3+   3+   4  4  4  5  2   8  3+   77
 *   *    Master of Possession  6"   3+   3+   4  4  4  5  3   9  3+   92  (variant, unique per army)
 *
 * EQUIPPED WITH: Frag grenades; Krak grenades.
 *
 * OPTIONS:
 *   May receive a Mark of Chaos:
 *     Undivided +0 pts / Khorne +8 pts / Slaanesh +8 pts / Nurgle +20 pts / Tzeentch +15 pts
 *     NOTE: ALL 5 marks available (unlike Chaos Sorcerer which has no Khorne).
 *   One Adept of Possession per army can be upgraded to Master of Possession for +15 pts.
 *     Upgrade: +1A (2->3), +1LD (8->9). Total: 77 + 15 = 92 pts.
 *   Has access to weapons and gear from the Armory.
 *   May have up to 2 veteran abilities.
 *
 * ABILITIES:
 *   Daemon: 5+ invulnerable save (Core Rules, Daemon ability).
 *
 * PSYKER: NOT a psyker — no "Psyker" ability on the datasheet.
 *
 * KEYWORD: Chaos Space Marine
 * UNIT TYPE: Character Model, Infantry
 *
 * ENGINE STATUS:
 *   All 5 marks wired in option_groups.
 *   Daemon ability (5+ inv save) shown as text in UnitCard.
 *   <Legion> ability is informational text only; no engine action needed.
 *   Daemonic corruption is informational; no builder-side engine effect.
 *   is_psyker: false.
 */

import type { Unit } from '../../../../../src/types/data';

export const adeptOfPossession: Unit = {
  name: 'Adept of Possession',
  slot: 'HQ',
  models: [
    {
      name: 'Adept of Possession',
      points: 77,
      min: 1,
      max: 1,
      stats: { M: '6"', WS: '3+', BS: '3+', S: '4', T: '4', W: '4', I: '5', A: '2', LD: '8', SV: '3+' },
    },
  ],
  variant_models: [
    {
      name: 'Master of Possession',
      points: 92,
      min: 0,
      max: 0,
      stats: { M: '6"', WS: '3+', BS: '3+', S: '4', T: '4', W: '4', I: '5', A: '3', LD: '9', SV: '3+' },
    },
  ],
  equipped_with: 'An Adept of Possession is equipped with: Frag grenades; Krak grenades.',
  weapons: [
    { name: 'Frag grenade', range: '6"', type: 'Grenade 1', s: '4', ap: '0',  d: '1', abilities: 'Explosive' },
    { name: 'Krak grenade', range: '6"', type: 'Grenade 1', s: '6', ap: '-2', d: '1', abilities: '-' },
  ],
  option_groups: [
    {
      header: 'May receive a Mark of Chaos',
      constraint: { type: 'mark' },
      choices: [
        { name: 'Undivided', points: 0  },
        { name: 'Khorne',    points: 8  },
        { name: 'Slaanesh',  points: 8  },
        { name: 'Nurgle',    points: 20 },
        { name: 'Tzeentch',  points: 15 },
      ],
      inline_pts: null,
      variant_link: null,
      is_unique_per_army: false,
    },
    {
      header: 'One Adept of Possession per army can be upgraded to a Master of Possession for +15 points.',
      constraint: { type: 'unique_upgrade' },
      choices: [],
      inline_pts: 15,
      variant_link: 'Master of Possession',
      is_unique_per_army: true,
    },
  ],
  abilities: [
    'Daemon',
    'Daemonic corruption: Roll 2D6 at the start of the activation if this model is accompanied by a unit and set up on the battlefield (being in a transporter does not count towards being on the battlefield for that purpose). Apply following results to that unit permanently: 1=+2" Movement, 2=+1 Strength, 3=+1 Toughness, 4=+1 Initiative, 5=+1 Wound, 6=+1 Attack. If a result is applied for the third time, the unit is destroyed. Place a chaos spawn for every fourth wound (rounded down) within 3" of the model with this ability.',
    'Master of Possession: You may roll 1D6 or 2D6 on the "Daemonic corruption" table.',
  ],
  unit_type: 'Character Model, Infantry',
  keywords: ['Chaos Space Marine'],
  is_vehicle: false,
  is_character: true,
  is_monster: false,
  is_psyker: false,
  has_armory_access: true,
  champion_has_armory: false,
  has_veteran_abilities: true,
  veteran_required: false,
  veteran_max: 2,
  locked_mark: null,
  advisor: false,
  default_size: 1,
  min_cost: 77,
};


