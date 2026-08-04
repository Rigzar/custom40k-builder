/**
 * BOARDING ACTIONS — Custom40k supplement, WORKING DRAFT.
 *
 * PRIVATE. Rendered only inside the admin panel (AdminPanel "Boarding" tab). Nothing here is wired
 * into the builder: there is deliberately NO `boarding` entry in engine/engagements.ts, so no
 * player can select it and no saved list can reference it. When the rules are settled, the
 * engagement goes in that file and this text moves to the public wiki.
 *
 * WHY A SEPARATE MODE AND NOT A KILL-TEAM PORT: Kill Team is played model by model with its own
 * dice engine; every part of this app (points, options, armoury, validators) is built on UNITS and
 * on the Custom40k to-hit / to-wound / save sequence. Boarding Actions keeps both, so the entire
 * mode is a points limit, an AOP and a page of terrain rules — not a second game.
 *
 * Written in English so it can go to the author and, later, straight onto the wiki.
 */

export type BoardingBlock =
  | { p: string }
  | { ul: string[] }
  | { table: { head: string[]; rows: string[][] } }
  | { note: string };

export interface BoardingSection {
  id: string;
  title: string;
  blocks: BoardingBlock[];
}

/** Bumped by hand whenever the draft changes materially, so playtest reports can name a version. */
export const BOARDING_DRAFT = 'draft 0.1 — 2026-08-05';

export const BOARDING_RULES: BoardingSection[] = [
  {
    id: 'what',
    title: '1. What this is',
    blocks: [
      { p: 'A Boarding Action is a Custom40k battle fought inside a ship, a space hulk or a sealed installation: a cramped board of corridors, chambers and hatchways where nothing has line of sight for very long and no one can bring numbers to bear.' },
      { p: 'It uses the Custom40k Core Rules unchanged — same orders, same to-hit, to-wound and save sequence, same AP and AT, same special rules glossary. This document only lists what is DIFFERENT. If something is not written here, play it exactly as the Core Rules say.' },
      { note: 'Everything below is a first draft written to be played and argued with. The numbers in particular (points limit, model bands, hatchway test) are starting values, not decisions.' },
    ],
  },

  {
    id: 'measuring',
    title: '2. Measuring',
    blocks: [
      { p: 'Distances use the gauge shapes, because almost every distance in a boarding action is short and repeated:' },
      { table: { head: ['Shape', 'Distance'], rows: [['▲ triangle', '1"'], ['● circle', '2"'], ['■ square', '3"'], ['⬟ pentagon', '6"']] } },
      { p: 'Longer distances are written as multiples: 12" is 2⬟, 9" is ■ + ⬟. Weapon ranges stay in inches on the datasheets — the shapes are for the rules in this document, where they are quicker to read and quicker to check on the table.' },
    ],
  },

  {
    id: 'building',
    title: '3. Building a boarding party',
    blocks: [
      { p: 'A boarding party is 500 points. Agree a different limit between 400 and 600 if you want a shorter or longer game.' },
      { p: 'Choose ONE of the three boarding rosters below. The roster sets which slots you may take and how many models the party may contain. The model band is the important half: in a game of alternating activations, the number of models — not the points — decides how often you get to act.' },
      { table: {
        head: ['Roster', 'Models', 'HQ', 'Troops', 'Elites', 'Fast Attack'],
        rows: [
          ['Sabotage', '4–10', '0–1', '0–1', '1–3', '0–1'],
          ['Assault', '8–14', '1', '0–2', '1–2', '0–1'],
          ['Patrol', '12–20', '0–1', '1–3', '0–1', '0–1'],
        ],
      } },
      { p: 'Troops have NO minimum and there is no 25% Troops requirement. A boarding party is a hand-picked strike force, not a line formation — and in several codices the veterans who would actually be sent (Plague Marines, Noise Marines, Terminators) are Elites, so a Troops floor would make whole armies unplayable in this mode.' },
      { ul: [
        'No vehicles and no monstrous creatures.',
        'No Fortifications, Flyers, Dedicated Transports or Lords of War.',
        'No Archetypes, no Legacies, no Army Traits, no army customisation of any kind.',
        'Wargear may be bought from the general Armory and from your Mark\'s Armory only.',
        'One model in the party is nominated as the Leader. If the party contains a Character, it must be the Leader.',
      ] },
      { p: 'Marks of Chaos are bought as normal and matter as much as ever — a Death Guard boarding party is Plague Marines with the Mark of Nurgle and the Nurgle Armory, an Emperor\'s Children one is Noise Marines with the Mark of Slaanesh and the Slaanesh Armory. That is exactly why the Mark armouries stay in while everything else is switched off.' },
    ],
  },

  {
    id: 'splitting',
    title: '4. Splitting squads',
    blocks: [
      { p: 'A unit of 10 or more models is split into groups of 5 when the party is assembled. Each group is a separate unit from that point on: it activates on its own, takes its own Leadership tests and holds objectives on its own.' },
      { p: 'A group keeps the whole unit\'s special rules and abilities. Weapons bought "per 5 models" are distributed one group at a time — a group never ends up with two special weapons because the parent squad had two.' },
      { note: 'Open question: whether a Character may join a group, or only the parent unit. Playtest both.' },
    ],
  },

  {
    id: 'board',
    title: '5. The board',
    blocks: [
      { p: 'The board is divided into chambers by WALLS, connected by HATCHWAYS.' },
      { ul: [
        'WALLS are impassable and block line of sight completely. No model may move through a wall, and no distance may be measured through one — measure around it, following a path a model could actually walk.',
        'HATCHWAYS are either open or closed. An open hatchway can be moved through and seen through. A closed one can be neither.',
        'A model touching a wall on the side facing the shooter is in cover.',
      ] },
      { p: 'ENTRY ZONES are the marked squares at the board edges. Reinforcements arrive there, never anywhere else.' },
    ],
  },

  {
    id: 'hatchways',
    title: '6. Hatchways',
    blocks: [
      { p: 'A unit not engaged in melee and within ▲ of a hatchway may open it or close it as part of its activation, instead of firing a weapon.' },
      { p: 'If an enemy unit is also within ▲ of that hatchway, the hatchway is contested: both players roll 1D6 and add the Strength of one model of their choice within ▲. The higher total decides whether the hatchway ends up open or closed. On a tie, nothing happens.' },
      { p: 'Engagement range extends through an open hatchway at ● horizontal distance, so a model standing in a doorway can be fought from the far side.' },
      { note: 'Open question: whether closing a hatchway on a model standing in it is legal, and what happens if it is. Suggested starting rule — it is not legal.' },
    ],
  },

  {
    id: 'changes',
    title: '7. Changes to the Core Rules',
    blocks: [
      { p: 'Movement' },
      { ul: [
        'No model has the "Anti-Grav" or "Jump pack" movement benefit for the duration of the battle: everyone walks the corridors. Models keep any other part of those rules.',
        'No model may move more than 2⬟ in a single activation, whatever its Movement characteristic and whatever order it receives.',
        'Every distance is measured around walls and closed hatchways, never through them.',
      ] },
      { p: 'Shooting and line of sight' },
      { ul: [
        'Line of sight is a straight line that passes through no wall, no closed hatchway and no model that is not part of the target unit.',
        'Weapons with "Barrage" or "Explosive" count only the models you can actually see when working out how many additional hits they generate.',
        '"Indirect" weapons may not be used at all. There is no sky to fire into.',
      ] },
      { p: 'Charging and melee' },
      { ul: [
        'A unit may only charge an enemy it can see at the moment the Charge order is given.',
        'Pile-in and consolidation moves may only be made towards an enemy the model can see.',
      ] },
      { p: 'Deployment and reserves' },
      { ul: [
        'At least half the party, counted in models, must be deployed on the board at the start.',
        '"Infiltrate" and any rule that deploys a unit outside your own deployment area do not work.',
        '"Deep Strike" may only be used in battle rounds 2 and 3, one unit per round, and the unit arrives in an Entry Zone rather than scattering. Anything still in reserve at the end of round 3 is lost.',
      ] },
    ],
  },

  {
    id: 'stratagems',
    title: '8. Stratagems',
    blocks: [
      { p: 'Boarding actions use a short, shared list — not the full army list. The Command Points are generated as normal.' },
      { note: 'To write: 5 or 6 generic boarding stratagems (suggested — seal a hatchway, breach a hatchway, defensive fire in a corridor, a re-roll, a second wind for a Leader) plus at most 2 per Mark. Deliberately left empty until the terrain rules above have been played once.' },
    ],
  },

  {
    id: 'missions',
    title: '9. Missions and scoring',
    blocks: [
      { p: 'Five battle rounds. Objectives are placed in chambers, never in corridors.' },
      { p: 'A unit holds an objective if it is within ■ of it and no enemy unit is. Scoring is checked at the end of each round, not only at the end of the game, so a party that is wiped out in round 4 can still win.' },
      { note: 'To write: 3 symmetric missions and 2 asymmetric (attacker / defender) ones, short enough to fit on one page together. The existing Custom40k Missions document is the model to follow.' },
    ],
  },

  {
    id: 'open',
    title: '10. Open questions',
    blocks: [
      { ul: [
        'Points limit: 500 is the starting value. Death Guard elites are expensive in Custom40k (Blightlord Terminators are 109 a model), so 500 buys a Leader plus one veteran squad plus chaff. If that feels too thin in play, go to 600.',
        'Model bands per roster are derived from what real 500-point parties actually come to (4 to 16 models across Death Guard and Emperor\'s Children). They will need adjusting once a third army is tried.',
        'Whether the movement cap of 2⬟ should instead be "Movement characteristic, to a maximum of 2⬟" — the second is fairer to slow armies and reads better on the datasheet.',
        'Whether Poxwalkers and other cheap chaff need a cap of their own, or whether the model band already handles it.',
      ] },
    ],
  },
];

/** Reference lists priced from live production data — kept so the numbers above can be checked. */
export const BOARDING_SAMPLE_LISTS: { name: string; total: number; models: number; lines: string[] }[] = [
  {
    name: 'Death Guard — Assault roster, 500 pts',
    total: 362,
    models: 16,
    lines: [
      'Foetid Virion — 62',
      '5 Plague Marines — ~270',
      '10 Poxwalkers — 30',
      '≈138 points left for special weapons and the Nurgle Armory',
    ],
  },
  {
    name: "Emperor's Children — Assault roster, 500 pts",
    total: 476,
    models: 11,
    lines: [
      'Chaos Lieutenant with the Mark of Slaanesh — 81',
      '5 Noise Marines — ~200',
      '5 Chaos Space Marines with the Mark of Slaanesh — ~195',
      'The party is smaller but every model is a veteran — the flavour falls out of the points, not out of a hand-written team list',
    ],
  },
];
