/**
 * The game's own turn structure, orders, Battleshock and mission scoring, as the Tabletop Simulator table needs them
 * (round tracker, order picker, token reminders, victory-point pad).
 *
 * EVERY line here is copied or condensed from the two rulebooks in Codex/ (Custom40k Core Rules 1.278: "The Battle
 * Round", "Battleshock", "Reinforcement Phase", "Types of Orders", "Meta Orders", "Initiative Phase", "Weapon types";
 * Custom40k Missions: "Scoring points", "Secondary objectives", "Mission list"), none of it from memory. When a
 * rulebook changes, change it here, re-export, and the table follows: the mod itself carries no rules text.
 *
 * Sent inside the TTS export as `game` (see ttsExport.ts); the mod treats it as optional.
 */

export interface TtsPhase { key: string; name: string; summary: string; steps: string[] }
export interface TtsOrder { name: string; prerequisite: string; effects: string[] }
export interface TtsMission {
  engagement: 'Skirmish' | 'Pitched Battle' | 'Epic Battle';
  name: string; setup: string[]; victory: string;
  /** Buttons of the victory-point pad: what scores, how many VP, and how often. */
  scoring: { label: string; vp: number; per: 'round' | 'once' | 'each' }[];
}

export const TTS_GAME = {
  rounds: 5,
  intro: 'Custom40k is played over five battle rounds, each consisting of several phases. In some phases both players act simultaneously.',
  phases: [
    { key: 'rally', name: 'Rally', summary: 'Fleeing or pinned units may attempt to rally.', steps: [
      'Both players take a Leadership test for each unit carrying at least one Battleshock token: roll 2D6 per unit.',
      "A result equal to or lower than the unit's Leadership removes all its Battleshock tokens; it can receive orders in the Command Phase and act normally in the Action Phase.",
      'If the test fails the unit keeps its tokens. A unit that keeps two tokens flees now.',
    ] },
    { key: 'reinforcement', name: 'Reinforcement', summary: 'Units held in reserve attempt to enter the battlefield.', steps: [
      'The controlling player rolls a number of dice equal to the current battle round (see the Reinforcement Chart).',
      'For each 4, 5 or 6, one unit from reserve must receive an order in the Command Phase and may only receive Advance, Charge or Move & Shoot.',
      "It enters from the controlling player's board edge when activated, counts as having moved 6\" and may still make its Advance or Charge move.",
      'From the third battle round one additional unit arrives automatically (two in round 4, three in round 5).',
      'Transports and the units they carry count as one reserve; an attached character and its unit roll one die.',
      'Games above 2500 points: for every additional 2500 points you get the specified dice one more time.',
    ] },
    { key: 'command', name: 'Command', summary: 'Both players assign orders to all units by placing them face down.', steps: [
      'Orders are cards or tokens placed face-down next to each unit, simultaneously. If players cannot agree who places first, roll a die.',
      'A unit does not need to perform every aspect of an order (Doing Nothing).',
      'If one player has more orders than the other, the player with fewer receives one Skip token for every two orders of difference (rounded up): a difference of 1, 3, 5... gives 1, 2, 3... Skip orders.',
    ] },
    { key: 'initiative', name: 'Initiative', summary: 'Determine which player activates the first unit this round.', steps: [
      'Both players roll 2D6; the higher result gains the initiative and activates the first unit in the Action Phase.',
      'On a tie, initiative goes to the player who did not have it in the previous round. In the first round the player who finished deploying first wins the tie.',
    ] },
    { key: 'action', name: 'Action', summary: 'Players alternate activating their units and carrying out their orders.', steps: [
      'The player with the initiative activates one unit and resolves its order, then the other player activates one of theirs, alternating until every unit has been activated.',
      'A unit may Move, make ranged attacks and fight in melee once each per round. Fighting does not depend on an unused order: a unit that already shot may still fight if it is charged later.',
      'A player with no units left to activate passes; the other player activates the rest. When both have activated everything the round ends and the next one starts with the Rally Phase.',
    ] },
  ] as TtsPhase[],
  battleshock: {
    max: 2,
    levels: [
      { tokens: 1, name: 'Pinned', effects: [
        'The unit suffers a -1 penalty to all hit rolls (ranged and melee).',
        'Its movement value is halved.',
        'It may only perform a Disorderly Charge with a Charge order.',
        'It may still receive orders during the next Command Phase.',
      ] },
      { tokens: 2, name: 'Fleeing', effects: [
        'The unit immediately moves D6+6" toward the nearest friendly board edge, ignoring enemy units in its path if no other route is possible.',
        'It cannot receive orders in the following Command Phase and is considered fully activated for all purposes.',
        'It cannot contest or hold mission objectives.',
        'If it reaches the board edge it is removed from the game.',
        'If it enters close combat again in the same battle round it cannot fight, automatically loses the combat, and instead of fleeing again stays in place with 1 Battleshock token.',
      ] },
    ],
    note: 'Units can never have more than two Battleshock tokens at a time. A unit below half Starting Strength takes a permanent -1 penalty to its Leadership.',
  },
  reinforcement: [
    { round: 1, dice: 1, auto: 0 }, { round: 2, dice: 2, auto: 0 }, { round: 3, dice: 3, auto: 1 },
    { round: 4, dice: 4, auto: 2 }, { round: 5, dice: 5, auto: 3 },
  ],
  orders: [
    { name: 'Advance', prerequisite: 'The unit is not engaged in melee combat.', effects: [
      'It may move up to its Movement value, then make a further move of up to 1D6".',
      'It must stay at least 1" from enemy models.',
      'It may declare any number of visible enemy units as targets for ranged attacks (targets may use Take Cover).',
      'It may fire Assault, Pistol or Grenade weapons with a -1 to hit penalty after moving.',
      'It may cast basic psychic powers and similar effects at any point during the activation.',
    ] },
    { name: 'Charge', prerequisite: 'The unit is not engaged in melee combat.', effects: [
      'It may move up to its Movement value (max 12"), then fire Assault, Pistol and Grenade weapons with a -1 to hit penalty.',
      'It may declare enemy units it can see as targets for a Charge move (targets may use Counter-Attack, Defensive Fire or Hold Your Ground).',
      'It may make a further Charge move of up to 6" in a straight line if it can reach base contact with a target.',
      'It must select either +1 Attack or +1 Initiative for all models as a Charge bonus.',
      'It resolves the Fight order.',
      'It may cast basic psychic powers and similar effects at any point during the activation.',
    ] },
    { name: 'Escape', prerequisite: 'The unit is already engaged in melee combat.', effects: [
      'It receives 1 automatic hit from each enemy model in attack range.',
      'It gains two Battleshock tokens and flees.',
      'Enemy units must remain in melee if other units of yours are still in base contact with them, resolving the melee as if all had the Fight order; if none remain, enemy units lose their order, count as activated and may only consolidate.',
    ] },
    { name: 'Fight', prerequisite: 'The unit is already engaged in melee combat.', effects: [
      'The melee is resolved as if all units involved had the Fight order.',
      'It may cast basic psychic powers and similar effects during its initiative step.',
      'It removes all orders from units participating in this melee.',
    ] },
    { name: 'Move & Shoot', prerequisite: 'The unit is not engaged in melee combat.', effects: [
      'It may move up to its Movement value.',
      'It may fire any ranged weapon except Heavy types after moving.',
      'It may declare any number of visible enemy units as targets for ranged attacks (targets may use Take Cover).',
      'It may cast basic and normal psychic powers and similar effects at any point during the activation.',
    ] },
    { name: 'Stand & Shoot', prerequisite: 'The unit is not engaged in melee combat.', effects: [
      'It may not move.',
      'It may fire any ranged weapon, including Heavy types, and reduces the total hit penalty for ranged attacks by 1.',
      'It may declare any number of visible enemy units as targets for ranged attacks (targets may use Take Cover).',
      'It may cast all types of psychic powers and similar effects at any point during the activation.',
    ] },
  ] as TtsOrder[],
  metaOrders: [
    { name: 'Counter-Attack', prerequisite: 'The unit has the Counter-Attack ability, is declared as a charge target and the charger has declared all targets.', effects: ['It is treated as having successfully executed a Charge order, choosing its Charge bonus before the attacker.'] },
    { name: 'Defensive Fire', prerequisite: 'The unit is declared as a charge target (after all targets are declared) or an enemy Flyer has been placed on the battlefield.', effects: ['It may fire ranged weapons at the attacking unit with a -1 to hit penalty, and cast basic and normal psychic powers at it or itself.', 'The attacker automatically passes any Leadership test during Defensive Fire.'] },
    { name: 'Hold Your Ground', prerequisite: 'The unit is declared as a charge target (after all targets are declared).', effects: ["It negates the attacker's Charge bonus. If several units are charged, at least 50% of them must use it."] },
    { name: 'Take Cover', prerequisite: 'The unit is selected as a target for a ranged attack or psychic power (after all ranged targets are declared).', effects: ['+1 to Saving throws against ranged attacks until the enemy activation ends.', 'Ranged attacks against it reduce their AT by 1 (minimum 0).'] },
  ] as TtsOrder[],
  /** Terms the orders refer to (Core Rules 1.279, "Orders"). */
  terms: [
    { name: 'Disorderly Charge', text: 'Some rules refer to a unit only being able to perform a "Disorderly Charge" (Pinned units, a target of the Blind ability, a unit arriving by Deep Strike). The unit may only select a single target for its Charge order and does not gain any Charge bonus or other benefit for charging.' },
    { name: 'Doing Nothing', text: 'A unit does not need to perform every aspect of an order. For example, a unit with Move & Shoot may skip either moving or shooting.' },
    { name: 'Skip Marker', text: 'If one player has more Orders than the other, the player with fewer Orders receives Skip tokens: one for every two Orders of difference, rounded up (a difference of 1, 3, 5... gives 1, 2, 3... tokens).' },
  ],
  metaNote: 'Defensive Reactions need an order-less unit that has not been activated this round, can never be used while engaged in melee, and remove the unit\'s order afterwards.',
  /** Which weapon type may be used with which order (Core Rules, "Weapon types"). */
  weaponOrders: {
    'Stand & Shoot': { Assault: true, Grenade: true, Heavy: true, Melee: false, Pistol: true, 'Rapid Fire': true },
    'Move & Shoot': { Assault: true, Grenade: true, Heavy: false, Melee: false, Pistol: true, 'Rapid Fire': true },
    Advance: { Assault: true, Grenade: true, Heavy: false, Melee: false, Pistol: true, 'Rapid Fire': false },
    Charge: { Assault: true, Grenade: true, Heavy: false, Melee: true, Pistol: true, 'Rapid Fire': false },
    Fight: { Assault: false, Grenade: true, Heavy: false, Melee: true, Pistol: false, 'Rapid Fire': false },
  },
  weaponTypeNotes: [
    'Grenade: one model per unit may use a grenade instead of other eligible weapons. In melee, grenades can only target Vehicles or Monstrous Creatures.',
    'Melee: a model with at least one melee weapon and one pistol gains +1 Attack in melee combat.',
    'Pistol: a model can either fire up to two pistols or other eligible weapons during its activation.',
    "Rapid Fire: if the target is within half the weapon's range it doubles its attacks; without the Stand & Shoot order it can only fire at targets within half range.",
  ],
  scoring: {
    attrition: 'Each unit is worth its point cost in VP; to claim it the unit must be destroyed by the end of the 5th battle round. Units at or below half of their nominal strength are worth 50% of their point cost. Single-model units use their remaining Wounds or Hull Points (3 HP starting, 1 HP left is worth 50%).',
    objectives: 'To capture or hold an objective at least one model of the unit must be within 3" of it while no enemy model is within 3" of the same objective; otherwise it is contested and scores for nobody. Each unit can contest or hold only one objective per turn.',
    winning: 'After the last battle round count all VP for each side. A player wins with at least 100 more points than the other player; otherwise the game is a draw.',
    secondary: [
      { name: 'Hold the Line', text: 'By the end of the 5th battle round no enemy unit may be within your own deployment zone.' },
      { name: 'Linebreaker', text: "By the end of the 5th battle round at least one friendly unit must be within the enemy's deployment zone." },
      { name: 'Relic Hunt', text: 'Missions that use objective markers only. Roll a die when an objective outside any deployment zone is controlled for the first time: on 5+ it becomes a relic, worth +100 VP extra if controlled at the end of the 5th round.' },
      { name: 'Save the Warlord', text: 'Your own HQ unit with the highest point cost must be alive by the end of the 5th battle round.' },
      { name: 'Slay the Warlord', text: 'The enemy HQ unit with the highest point cost must be destroyed by the end of the 5th battle round.' },
    ],
    secondaryVp: 200,
  },
  missions: [
    { engagement: 'Skirmish', name: 'Control', setup: [
      'Divide the board into four quarters and place an objective marker in the middle of each.',
      "Both players roll a die; the highest picks a quarter, the other player's zone is the opposite quarter. Deploy alternately, one unit at a time, winner first.",
      'No unit can be deployed within 9" of the centre of the table.',
    ], victory: 'Control table quarters: a unit must control the mission objectives inside a quarter. At the end of each battle round a player gets 200 VP for each quarter he controls. VP are also awarded for destroyed enemy units (Attrition).',
      scoring: [{ label: 'Table quarter held', vp: 200, per: 'each' }] },
    { engagement: 'Skirmish', name: 'Salvage', setup: [
      'Place 9 mission objectives (wreckage) evenly distributed on the field.',
      'Both players roll a die; the winner chooses a table edge, the opponent gets the opposite one. Deploy alternately, winner first.',
    ], victory: 'Collect wreckage / attrition: a unit in base contact with an objective uses a Stand & Shoot command to pick it up and may do nothing else but fight back in melee. 200 VP per wreckage secured (then it is removed). VP are also awarded for destroyed enemy units.',
      scoring: [{ label: 'Wreckage secured', vp: 200, per: 'each' }] },
    { engagement: 'Pitched Battle', name: 'Frontlines', setup: [
      'Place one command post in each deployment zone (position X:12" Y:12").',
      'Place three mission objectives in one line between both deployment zones.',
      'No model may be deployed within 18" of the enemy command post by any means; enemy units that scatter into the zone from Deep Strike are sent back to reserves.',
      'Both players roll a die; the winner chooses a zone. Deploy alternately, winner first.',
    ], victory: 'Control objectives / sabotage the command post: one objective controlled at the end of a battle round scores 200 VP. A player who occupies the enemy command post wins automatically; if both lose their command posts in the same round the player with most VP wins. VP are also awarded for destroyed enemy units (Attrition).',
      scoring: [{ label: 'Objective held', vp: 200, per: 'each' }] },
    { engagement: 'Pitched Battle', name: 'Take & Hold', setup: [
      'Place one objective in the middle of the table and two in diagonally opposing quarters (12" in, 12" up).',
      'The remaining objectives go in the two empty quarters (24" in, 12" up).',
      'Both players roll a die; the highest chooses a zone. Deploy alternately, winner first. No unit within 9" of the centre at the start.',
    ], victory: 'Control objectives: each objective controlled at the end of a battle round scores 200 VP (up to 600 per round). VP are also awarded for destroyed enemy units (Attrition).',
      scoring: [{ label: 'Objective held', vp: 200, per: 'each' }] },
    { engagement: 'Pitched Battle', name: 'Tug of War', setup: [
      'Place one objective (the relic) in the middle of the table.',
      'Both players roll a die; the highest chooses a zone. Deploy alternately, winner first. No unit within 9" of the centre at the start.',
    ], victory: 'Secure the relic / attrition: a creature unit must end a battle round in base contact with it; the relic moves with the unit (never more than 6" per round) and is contested if the carrier is in melee or both players have units in contact. From the second battle round, controlling it at the end of the round scores 400 VP, or 800 VP in your own deployment zone. VP are also awarded for destroyed enemy units.',
      scoring: [{ label: 'Relic held', vp: 400, per: 'round' }, { label: 'Relic in own zone', vp: 800, per: 'round' }] },
    { engagement: 'Epic Battle', name: 'King of the Hill', setup: [
      'Place one objective in the middle of the table and two on opposing ends at the same height, 6" from the board edge.',
      'Both players roll a die; the highest chooses a zone. Deploy alternately, winner first.',
    ], victory: 'Control objectives: a side objective controlled at the end of a battle round scores 200 VP, the middle objective 400 VP. VP are also awarded for destroyed enemy units (Attrition).',
      scoring: [{ label: 'Side objective held', vp: 200, per: 'each' }, { label: 'Middle objective held', vp: 400, per: 'round' }] },
    { engagement: 'Epic Battle', name: 'Z', setup: [
      'Divide the board into zones as shown in the picture and place a mission objective in the middle of each.',
      'Both players roll a die; the highest chooses a zone. Deploy alternately, winner first.',
    ], victory: 'Control zones: a unit must control the objective inside a zone and can only occupy one zone (roll randomly if spread over several). At the end of each battle round a player gets 200 VP for each zone he controls. VP are also awarded for destroyed enemy units (Attrition).',
      scoring: [{ label: 'Zone held', vp: 200, per: 'each' }] },
  ] as TtsMission[],
};
