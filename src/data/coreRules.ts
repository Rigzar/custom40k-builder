/**
 * Core Rules glossary — weapon abilities and model special rules.
 * Keys are lowercase, trimmed, with no parameters (parameters are extracted at lookup time).
 * Descriptions use {X} as placeholder for the extracted parameter value.
 */
export interface RuleEntry {
  name: string;
  description: string;
}

/**
 * Exported read-only so the structured query layer (engine/specialRules.ts) can validate
 * keys against the SAME canonical glossary instead of duplicating the ~120-entry vocabulary.
 * One source of truth — the two layers can never drift apart. Do not mutate from outside.
 */
export const RULES: Record<string, RuleEntry> = {
  // ── Weapon abilities ──────────────────────────────────────────────────────
  'ammo': {
    name: 'Ammo({X})',
    description: 'This weapon can only be used {X} times per game.',
  },
  'anti-air': {
    name: 'Anti-Air',
    description: 'Attacks against models with Anti-Grav, Jet Bike, Jump Pack, or the Flyer unit type gain +1 to hit rolls and +1 Strength.',
  },
  // Core Rules L714-718 ("Jump Pack Infantry" type) + designer confirmation (2026-06-12):
  // the "Jump pack" ability referenced standalone at L551 and L1331 is the package granted
  // by the "Jump Pack Infantry" unit type.
  'jump pack': {
    name: 'Jump Pack',
    description: 'The model ignores terrain and vertical movement costs, and gains the "Deep Strike" special rule (the package granted by the "Jump Pack Infantry" unit type).',
  },
  'armorbane': {
    name: 'Armorbane',
    description: 'The weapon rolls an additional 1D6 for armor penetration.',
  },
  'armor piercing': {
    name: 'Armor Piercing({X})',
    description: 'Wound rolls of {X} always succeed and gain an additional -2 AP. Armor penetration rolls of {X} gain +1 AT and roll an extra 1D3 for armor penetration.',
  },
  'at': {
    name: 'AT({X})',
    description: 'Can cause Penetrating Hits. On a Penetrating Hit, roll {X} dice on the Vehicle Damage Chart and apply all results.',
  },
  'barrage': {
    name: 'Barrage',
    description: 'A successful hit generates up to 5 additional hits (6 total) if the target has enough models. A failed hit can be re-rolled once and generates up to 2 additional hits (3 total). Each model can only be hit once per shot.',
  },
  'beam': {
    name: 'Beam',
    description: 'Make a hit roll as normal. If successful, draw a straight line from the shooting model to the target. Make a wound roll against the target and any other units the line passes over.',
  },
  'blind': {
    name: 'Blind',
    description: 'If this weapon scores at least one hit, the target unit does not gain a Charge bonus for executing a Charge order.',
  },
  'blood drinker': {
    name: 'Blood Drinker',
    description: 'When the model causes a Wound loss, it regains 1 Wound, up to its starting value.',
  },
  'bomb': {
    name: 'Bomb',
    description: 'The range of this weapon is unaffected by the range reduction rules for Flyers.',
  },
  'combi': {
    name: 'Combi',
    description: 'A combi-weapon combines two profiles into one. Both profiles can be fired simultaneously at the same target with a -1 penalty to hit.',
  },
  'deadly': {
    name: 'Deadly({X})',
    description: 'Wound rolls of {X} increase the Damage value of the attack by +1.',
  },
  'decimate': {
    name: 'Decimate',
    description: 'Wound rolls gain a +1 bonus. Does not work against Vehicles.',
  },
  'deflagrate': {
    name: 'Deflagrate({X})',
    description: 'Hit rolls of {X} score an additional hit.',
  },
  'explosive': {
    name: 'Explosive',
    description: 'A successful hit generates up to 3 additional hits (4 total) if the target has enough models. A failed hit can be re-rolled once and generates up to 1 additional hit (2 total). Each model can only be hit once per shot.',
  },
  'extra attack': {
    name: 'Extra Attack({X})',
    description: "During each activation, this weapon's profile can be used {X} additional times. You can only make {X} attacks with this weapon per battle round.",
  },
  'flames': {
    name: 'Flames',
    description: 'The weapon hits automatically. Enemy units in cover reduce their cover armor save benefit by a cumulative -1 (minimum 0).',
  },
  'flurry': {
    name: 'Flurry({X})',
    description: 'The model makes {X} additional attacks with this weapon per battle round.',
  },
  'force weapon': {
    name: 'Force Weapon',
    description: 'If the bearer successfully manifests at least one psychic power during their activation, any Force weapon they carry gains +1 Damage for the rest of the battle round.',
  },
  'grav': {
    name: 'Grav',
    description: "Unless it would already be better, the wound roll equals the enemy unit's armor save. Unless already worse, the armor save against this weapon is always 5+. Does not work against Vehicles.",
  },
  'graviton': {
    name: 'Graviton',
    description: 'Creatures hit must pass a Strength test or suffer a wound (S4 AP0 D1; Seeking). If the target is in cover and at least one hit is scored, the terrain becomes difficult and dangerous until the next activation of the unit that caused the hit.',
  },
  'gruesome': {
    name: 'Gruesome',
    description: 'Every wound caused counts as two for combat resolution. Models caught fleeing from close combat suffer an additional automatic wound.',
  },
  'haywire': {
    name: 'Haywire',
    description: 'Each hit causes one automatic penetrating hit against a Vehicle, in addition to any normal damage. Does not work against Creatures.',
  },
  'lance': {
    name: 'Lance({X})',
    description: 'Armor penetration rolls gain a {X} bonus.',
  },
  'life curse': {
    name: 'Life Curse',
    description: 'A single wound roll against Creatures can be re-rolled. If multiple models in a unit have the same weapon with this rule, they can make their wound rolls together — in which case, one wound roll per model may be re-rolled.',
  },
  'indirect': {
    name: 'Indirect',
    description: 'The weapon does not require line of sight. Targets only gain a cover bonus if in a terrain zone. Can only be fired using the Stand & Shoot command.',
  },
  'master-crafted': {
    name: 'Master-crafted',
    description: "A single hit roll can be re-rolled. If the weapon has Barrage, Explosive, or Flames, a single wound or armor penetration roll can be re-rolled instead. If multiple models in a unit have this weapon, one hit roll per model may be re-rolled. Can't be used on \"Grenade\" type weapons with weapons that have the \"Ammo(x)\" ability.",
  },
  'melta': {
    name: 'Melta',
    description: "When targeting units within half the weapon's maximum range, the weapon gains +1 Damage, +2 AT and rolls an extra 1D6 for armor penetration.",
  },
  'monofilament': {
    name: 'Monofilament',
    description: 'If the target is in cover and at least one hit has been scored, the terrain counts as difficult and dangerous until the end of the next activation of the target unit.',
  },
  'overheating': {
    name: 'Overheating',
    description: 'Each roll of a 1 on a hit roll causes the user to suffer a Mortal Wound (or a glancing hit using the AT value, for vehicles). Re-roll abilities do not prevent overheating — the initial roll determines it. For weapons that hit automatically, a roll of 1 on the wound roll triggers the same penalty instead. Wounds caused by Overheating must be allocated first to models equipped with Overheating weapons and cannot spill over to other models, overriding the standard "remove whole models first" rule.',
  },
  'poison': {
    name: 'Poison({X})',
    description: 'To-wound rolls of {X} against Creatures always succeed. If the weapon already has Poison, take the better value.',
  },
  'precision': {
    name: 'Precision({X})',
    description: "To-hit rolls of {X} automatically wound Creatures. Can't be used with Barrage or Explosive weapons.",
  },
  'psi-shock': {
    name: 'Psi-shock',
    description: 'If a creature unit gets hit, a randomly chosen psyker must pass a Leadership test or suffer 1D3 Mortal Wounds. Against vehicles, it suffers 1D3 instances of Critical Damage instead. Each additional hit from the same unit incurs a cumulative -1 penalty. Can only trigger once per activated unit.',
  },
  'quick': {
    name: 'Quick({X})',
    description: 'The model gains {X} to its Initiative.',
  },
  'rending': {
    name: 'Rending({X})',
    description: 'Wound rolls of {X} gain an additional -1 AP bonus.',
  },
  'seeking': {
    name: 'Seeking',
    description: 'Enemy units in cover do not gain any cover benefit against this weapon and are treated as being outside of cover.',
  },
  'shield breaker': {
    name: 'Shield Breaker({X})',
    description: 'Invulnerability saves of enemy models are degraded by {X}.',
  },
  'shred': {
    name: 'Shred',
    description: 'The model may re-roll wound rolls with this weapon.',
  },
  'slow': {
    name: 'Slow({X})',
    description: 'The model suffers {X} to its Initiative.',
  },
  'soul burn': {
    name: 'Soul Burn({X})',
    description: 'Wound rolls of {X} against Creatures inflict 1 Mortal Wound. Does not work against Vehicles.',
  },
  'sunder': {
    name: 'Sunder({X})',
    description: 'Enemy units in cover reduce their cover armor save benefit by {X} (minimum 0).',
  },
  'suppression': {
    name: 'Suppression',
    description: 'Scoring 1 ranged hit forces the target to take a Leadership test. Each additional weapon with this rule fired at the same target adds a cumulative -1 penalty. Barrage adds -2; Explosive adds -1. Leadership penalties from Suppressive Fire and Suppression weapons are cumulative with each other. A failed test gives the target a Battleshock token (if the unit is also forced to test for both Suppressive/Suppression fire and sustaining casualties below half strength in the same activation, it tests only once with all penalties combined, and gains two Battleshock tokens on a fail).',
  },
  'unwieldy': {
    name: 'Unwieldy',
    description: 'The model does not gain an additional attack for having a pistol in close combat. Each model may carry only one Unwieldy item.',
  },

  // ── Weapon types ──────────────────────────────────────────────────────────
  // Source: Custom40k Core Rules.txt L1072-1128 ("Weapon types" — its own canonical
  // glossary category, distinct from Weapon/Model abilities). Order-compatibility
  // table collapsed into prose per type; sub-rule bullets (¹-⁴) appended verbatim.
  'assault': {
    name: 'Assault',
    description: 'May be used with Stand & Shoot, Move & Shoot, Advance and Charge orders. Cannot be used with a Fight order.',
  },
  'grenade': {
    name: 'Grenade',
    description: 'May be used with any order — Stand & Shoot, Move & Shoot, Advance, Charge and Fight. One model per unit may use a grenade instead of other eligible weapons. In melee, grenades have one attack and can only target Vehicles or Monstrous Creatures.',
  },
  'heavy': {
    name: 'Heavy',
    description: 'May only be used with a Stand & Shoot order. Cannot be used with Move & Shoot, Advance, Charge or Fight orders.',
  },
  'melee': {
    name: 'Melee',
    description: 'May only be used with Charge or Fight orders — cannot be fired at range. If a model is equipped with at least one melee weapon and one pistol, it gains +1 Attack in melee combat. Some weapons feature both a melee and a pistol profile; these confer the bonus as well.',
  },
  'pistol': {
    name: 'Pistol',
    description: 'May be used with Stand & Shoot, Move & Shoot, Advance and Charge orders. Cannot be used with a Fight order. A model can either fire up to two pistols (from the datasheet or the armory) or other eligible weapons during its activation.',
  },
  'rapid fire': {
    name: 'Rapid Fire',
    description: 'May be used with Stand & Shoot and Move & Shoot orders only. Doubles its shots when fired at half range. If the unit has not received the "Stand & Shoot" command, it can only fire at half range with Rapid Fire weapons.',
  },

  // ── Model special rules ───────────────────────────────────────────────────
  'acute senses': {
    name: 'Acute Senses',
    description: 'Infiltrators always have to stay 18" apart during deployment, even if there is no direct Line of Sight to this unit.',
  },
  'aegis': {
    name: 'Aegis({X})',
    description: 'The model can dispel any psychic power directly targeting it on a roll of {X}. It can also prevent a Perils of the Warp attack on a roll of {X}. The best Aegis value from all models in the unit is used.',
  },
  'anti-grav': {
    name: 'Anti-Grav',
    description: 'The model ignores terrain, units, and vertical movement costs when moving.',
  },
  'berserk': {
    name: 'Berserk({X})',
    description: 'The model gains a {X} invulnerability save, but it does not work against weapons with Strength 8 or higher. Cannot use the Escape command or Take Cover reaction.',
  },
  'blind rage': {
    name: 'Blind Rage',
    description: 'When not in melee: the unit moves 1D6" toward the nearest enemy instead of taking Leadership tests. When in melee: a failed Leadership test causes 1D3 wounds instead of fleeing. Cannot use the Escape command or Take Cover reaction.',
  },
  'bodyguard': {
    name: 'Bodyguard',
    description: 'Wounds must be assigned to the Bodyguard model before character models can be targeted. In melee, attacks must target the Bodyguard first.',
  },
  'brotherhood of psykers': {
    name: 'Brotherhood of Psykers',
    description: 'If the unit has at least 2 models with this rule, it gains +1 to all psychic cast and deny rolls.',
  },
  'combat squads': {
    name: 'Combat Squads',
    description: 'If the unit has the maximum number of models, it may be split into two equal-sized units during deployment.',
  },
  'command squad': {
    name: 'Command Squad',
    description: 'Models with this ability can join a single character, or a squad that already has a character attached.',
  },
  'counter-attack': {
    name: 'Counter-Attack',
    description: 'The model is able to use the Counter-Attack Meta-Order.',
  },
  'deep strike': {
    name: 'Deep Strike',
    description: 'Models arriving from reserve can be placed anywhere on the battlefield. Place one model, roll a scatter die: on a hit icon it stays, on an arrow it moves 2D6" in that direction. Remaining models form circles around the first. If the first model lands off the table or in base contact with an enemy, roll D6 — on 1-3 return to reserve; on 4-6 the opponent places the unit.',
  },
  'deepstrike': {
    name: 'Deep Strike',
    description: 'Models arriving from reserve can be placed anywhere on the battlefield. Place one model, roll a scatter die: on a hit icon it stays, on an arrow it moves 2D6" in that direction. Remaining models form circles around the first. If the first model lands off the table or in base contact with an enemy, roll D6 — on 1-3 return to reserve; on 4-6 the opponent places the unit.',
  },
  'deflect': {
    name: 'Deflect',
    description: 'Ranged attacks against the model suffer a -1 penalty to hit rolls.',
  },
  'daemon': {
    name: 'Daemon',
    description: 'The model has a 5+ invulnerability save.',
  },
  'daemonic instability': {
    name: 'Daemonic Instability',
    description: 'The unit ignores the effects of a single Battleshock token. Upon gaining a second token, it suffers 1D3 automatic wounds (no saves) and discards all tokens. In close combat, instead of fleeing it suffers 1D3+1 automatic wounds. Cannot use Escape or Take Cover.',
  },
  'fast': {
    name: 'Fast',
    description: 'Vehicles double their movement range (max 24"). The model may fire one additional weapon if it moves up to 12".',
  },
  'fearless': {
    name: 'Fearless',
    description: 'Automatically passes any Leadership test. Cannot use the Escape command or Take Cover defensive reaction.',
  },
  'favoured enemy': {
    name: 'Favoured Enemy',
    description: 'At the start of the first battle round, select a faction. The model reduces its total penalty to hit rolls against that faction by -1 (min 0). Leadership tests caused by this model against that faction suffer a cumulative -1 penalty.',
  },
  'favored enemy': {
    name: 'Favoured Enemy',
    description: 'At the start of the first battle round, select a faction. The model reduces its total penalty to hit rolls against that faction by -1 (min 0). Leadership tests caused by this model against that faction suffer a cumulative -1 penalty.',
  },
  'fire hatches': {
    name: 'Fire Hatches({X})',
    description: 'The vehicle has {X} fire ports. Passengers may fire through them and can also be targeted by enemy ranged attacks.',
  },
  'frenzy': {
    name: 'Frenzy({X})',
    description: 'The Infantry model gains {X} increased movement for Charge movement.',
  },
  'furious charge': {
    name: 'Furious Charge',
    description: 'The model gains +1 Strength and +1 Initiative until the end of the current battle round when making a charge move.',
  },
  'greater daemon': {
    name: 'Greater Daemon',
    description: 'The model has a 4+ invulnerability save.',
  },
  'haste': {
    name: 'Haste({X})',
    description: 'The Infantry model gains {X} increased movement for Advance movement.',
  },
  'hit & run': {
    name: 'Hit & Run',
    description: 'After all models in a melee have been activated (before the result is determined), the unit may move 3D6" away from the enemy in a straight line. Enemy units cannot pursue.',
  },
  'infiltrate': {
    name: 'Infiltrate',
    description: 'After all normal deployment, this unit can be deployed anywhere on the battlefield — maintaining 18" from enemy units in line of sight, or 12" if out of line of sight. Units deployed this way cannot make a Vanguard move.',
  },
  'infiltrator': {
    name: 'Infiltrator',
    description: 'After all normal deployment, this unit can be deployed anywhere on the battlefield — maintaining 18" from enemy units in line of sight, or 12" if out of line of sight. Units deployed this way cannot make a Vanguard move.',
  },
  'massive': {
    name: 'Massive({X})',
    description: 'The model occupies {X} additional spaces in transport vehicles.',
  },
  'mindless': {
    name: 'Mindless',
    description: 'The unit automatically passes every Leadership test. It can contest mission objectives but never hold them.',
  },
  'move through cover': {
    name: 'Move Through Cover',
    description: 'The model does not suffer movement penalties for moving through terrain.',
  },
  'narthecium': {
    name: 'Narthecium',
    description: 'Once per turn, the damage of a wound against the model or attached unit can be reduced by 1. Does not work against weapons with Strength 8 or higher, or against Mortal Wounds.',
  },
  'open': {
    name: 'Open',
    description: 'The vehicle has fire hatches equal to its passenger capacity. Passengers can be targeted for ranged attacks and count as present on the battlefield.',
  },
  'outflank': {
    name: 'Outflank',
    description: 'When arriving from reserves, the unit may also be deployed along the side edges of the battlefield. It must receive a Move & Shoot order and counts as having moved at maximum range.',
  },
  'parry': {
    name: 'Parry',
    description: 'Melee attacks against the model suffer a -1 penalty to hit rolls.',
  },
  'regeneration': {
    name: 'Regeneration({X})',
    description: 'The model regains {X} wounds at the start of each Reinforcement phase.',
  },
  'retribution': {
    name: 'Retribution({X})',
    description: 'Melee hits against the model cause {X} automatic wounds per battle round (S4 AP0 D1) against the attacking unit.',
  },
  'squadron': {
    name: 'Squadron',
    description: 'All models in the selection are treated as independent units during deployment. They receive their own orders and do not need to stay in formation.',
  },
  'stealth': {
    name: 'Stealth',
    description: 'The model always counts as being in Heavy cover.',
  },
  'shrouding': {
    name: 'Shrouding',
    description: 'The model gains "Deflect" against all attacks that are more than 12" away.',
  },
  'they shall know no fear': {
    name: 'They Shall Know No Fear',
    description: 'A pinned or fleeing unit automatically regroups at the start of the turn or when it reaches the edge of the board. It can never use the "Take Cover" Defensive reaction.',
  },
  'true grit': {
    name: 'True Grit',
    description: 'The model may treat all of its ranged weapons during its Activation as "Assault" weapons (e.g. Rapid Fire 2 becomes Assault 2) and gains +1 attack for any combination of a ranged weapon with a melee weapon, not just for Pistols.',
  },
  'swarm': {
    name: 'Swarm',
    description: "Every instance of damage can only ever cause 1 wound loss. Attacks with Barrage or Explosive cause one hit for each Wound remaining on the model.",
  },
  'tank hunter': {
    name: 'Tank Hunter',
    description: 'A single armor penetration roll against a vehicle or wound roll against a Monstrous creature can be re-rolled. If multiple models in a unit have this rule, one roll per model may be re-rolled.',
  },
  'terrifying': {
    name: 'Terrifying({X})',
    description: 'Enemy units within 6" suffer {X} Leadership.',
  },
  'use cover': {
    name: 'Use Cover',
    description: 'Models benefiting from cover impose an additional -1 penalty to hit rolls for ranged attacks.',
  },
  'unique': {
    name: 'Unique',
    description: 'This weapon or wargear may only be included once per army.',
  },
  'unyielding': {
    name: 'Unyielding',
    description: 'Shoot Heavy weapons with a Move & Shoot order. Always shoot Rapid Fire at full range OR twice at half range. Fire all weapon types at -1 hit when executing a Charge order. Cannot receive the Advance order or pursue fleeing units in close combat.',
  },
  'vanguard': {
    name: 'Vanguard',
    description: 'At the start of the first battle round, the unit can move 6" if deployed on the battlefield, or 12" if deployed in a dedicated transport vehicle.',
  },
  'warded': {
    name: 'Warded',
    description: 'The model gains a 6+ invulnerability save, or improves an existing invulnerability save by +1 (maximum 4+). Cumulative with itself.',
  },
  'objective secured': {
    name: 'Objective Secured!',
    description: 'If an objective is captured or controlled by a unit with this rule, the objective remains under the controlling player\'s possession even if no friendly units remain in range. Control is only lost if the opposing player conquers or contests the objective with one of their own units at the end of a battle round. Transport vehicles also benefit from this rule if an embarked unit has it. Automatically granted to every Troop selection; units gain or lose it when switching battlefield role through Archetypes.',
  },
  'objective secured!': {
    name: 'Objective Secured!',
    description: 'If an objective is captured or controlled by a unit with this rule, the objective remains under the controlling player\'s possession even if no friendly units remain in range. Control is only lost if the opposing player conquers or contests the objective with one of their own units at the end of a battle round. Transport vehicles also benefit from this rule if an embarked unit has it. Automatically granted to every Troop selection; units gain or lose it when switching battlefield role through Archetypes.',
  },
  // ── Faction signature rules ────────────────────────────────────────────────
  'supporting fire': {
    name: 'Supporting Fire',
    description: 'If a friendly unit within 6" is the target of a charge and is using Defensive Fire, this unit may also be activated in the same way using an unused order token. That token is consumed.',
  },
  'dakka dakka dakka': {
    name: 'Dakka Dakka Dakka',
    description: 'The unit reduces its total penalty to hit rolls in ranged combat by -1 (minimum 0). Barrage and Explosive weapons do not benefit from this rule.',
  },
  'waaagh!': {
    name: 'Waaagh!',
    description: 'The army may declare a Waaagh! once per game at the start of the Command phase, lasting two battle rounds. Infantry and Walkers gain +D6" movement (not counted for weapon choice). Other vehicles, Bikes and Jump pack infantry gain "Deflect" instead if they moved at their maximum possible speed (at least 8"). In a Skirmish game the effect lasts one battle round.',
  },
  'mob': {
    name: 'Mob',
    description: 'For every 5 models in the unit, it gains +1 Leadership (cumulative). At 20+ models it gains "Fearless". A unit reduced below half its starting strength may merge with another unit that has this rule within 2" during the Rally phase — from that point they act as a single unit with one shared order.',
  },
  'battle focus': {
    name: 'Battle Focus',
    description: '"Assault", "Grenade" and "Pistol" weapons ignore the hit penalty for Advance and Charge orders. "Heavy" weapons can be used without penalty with a Move & Shoot order and with only -1 to hit on Advance/Charge. All psychic powers are treated as Basic.',
  },
  'acts of faith': {
    name: 'Acts of Faith',
    description: 'The unit may perform an Act of Faith each battle round. Each unit may use as many Acts of Faith per round as the army has Faith points, but can only benefit from one effect at a time. Attached character models gain the same benefit if they have this rule.',
  },
  'shield of faith': {
    name: 'Shield of Faith',
    description: 'The model gains a 6+ invulnerability save.',
  },
  'ambush': {
    name: 'Ambush',
    description: 'For each started 500 points of game size, one Ambush marker may be placed after all Infiltrators deploy but before the first battle round — at least 12" from any enemy. Units with Ambush arriving from reserves may deploy within 3" of a marker with any order. Units with Ambush may also embark into a marker like a transport and enter reserves, automatically arriving next Reinforcement phase.',
  },
  'canticles of the omnissiah': {
    name: 'Canticles of the Omnissiah',
    description: 'At the start of the Command phase, choose one Canticle. All units with this rule within 9" of a Choir Master model roll a D6 — on 4+ they gain the chosen Canticle\'s benefit until the end of the battle round.',
  },
  'instinctive behaviour': {
    name: 'Instinctive Behaviour',
    description: 'If the unit is outside Synapse range during the Rally phase and has no Battleshock token, it gains one. This token can only be removed by being in Synapse range during the next Rally phase. If such a unit must flee, it moves toward the nearest Synapse unit.',
  },
  'synapse': {
    name: 'Synapse',
    description: 'Units within 12" of a Synapse model are in Synapse range and: ignore Leadership modifiers; always count as being at starting strength; if they fail a Leadership test they suffer 1 Mortal Wound per point of difference (instead of a Battleshock token) and count as having passed; and lose all existing Battleshock tokens at the start of the Rally phase. A Synapse model that loses its last Wound explodes like a vehicle.',
  },
  'void armor': {
    name: 'Void Armor',
    description: 'Enemy attacks targeting this unit reduce their AT and AP values each by -1 (minimum 0 each).',
  },
  'eye of the ancestors': {
    name: 'Eye of the Ancestors',
    description: 'Each time a friendly unit is removed from the game, place a Judgement token on the enemy unit that caused the last wound (max 2 per enemy unit). All friendly units attacking a target with Judgement tokens gain: 1 token — re-roll 1 hit roll per activation; 2 tokens — also re-roll 1 wound roll per activation. Character models in a unit pool their tokens; tokens split evenly when they leave.',
  },
  'steady advance': {
    name: 'Steady Advance',
    description: 'The unit can never receive an Advance order and gains "Move through cover".',
  },
  'shield host': {
    name: 'Shield Host',
    description: 'The model can contest a mission objective while in the same table quarter and hold one while within 12" (instead of the normal 3"). It gains "Objective secured!" and "Precision(5+)". If it would gain two Battleshock tokens, it is set to one instead.',
  },
  'power through pain': {
    name: 'Power Through Pain',
    description: 'Each time an enemy unit is destroyed, the army gains a Power Through Pain token with a special rule assigned from the list (Aegis(4+), Berserk(4+), Furious Charge, +1 Initiative, +1 Leadership, +1 Strength). Distribute it to any friendly unit with this rule. Multiple tokens with the same bonus do not stack. Characters joining a unit pool tokens together; tokens split evenly when they leave.',
  },
  'combat drugs': {
    name: 'Combat Drugs',
    description: 'After all units have been set up, pick a combat drug for this unit. Its effect lasts for the rest of the battle.',
  },
  'reanimation protocols': {
    name: 'Reanimation Protocols',
    description: 'During the Reinforcement phase, living models with this rule regain all lost wounds. Additionally, roll 1D6 for each wound lost on a slain model: on 5+ the unit restores one wound (damaged models heal before slain ones return). Any model that restores no wounds is permanently destroyed. Restored models are placed in base contact with as many unit models as possible, not in contact with enemies unless already in melee. A unit is only considered destroyed if no Reanimation rolls succeed in the Reinforcement phase.',
  },
  'mark of khorne': {
    name: 'Mark of Khorne',
    description: 'The model gains +1 Attack. Character models and Monstrous Creatures also gain +1 Strength. Vehicles cause double hits on Tank Shocks. Counts as a veteran ability.',
  },
  'mark of nurgle': {
    name: 'Mark of Nurgle',
    description: 'The model gains +1 Toughness. Character models and Monstrous Creatures also gain +1 Wound. Vehicles may roll 2D6 each Reinforcement phase — on 7+ remove one Crew Shaken, Engine Damage, or Weapon Damage result, or restore 1 HP. Counts as a veteran ability.',
  },
  'mark of slaanesh': {
    name: 'Mark of Slaanesh',
    description: 'The model gains +1 Initiative. Character models and Monstrous Creatures also gain +2" Movement. Vehicles reduce the Leadership or close combat result of hostile models within 18" by -1 (within 9" by -2). Counts as a veteran ability.',
  },
  'mark of tzeentch': {
    name: 'Mark of Tzeentch',
    description: 'The model gains the "Warded" ability. Character models and Monstrous Creatures become a Psyker knowing 1 power from any discipline (or manifest/deny 1 additional power if already a Psyker). Vehicles gain a Warpflamer weapon (Range 9", Assault 4, S:4 AP:-1 D:1, Flames). Counts as a veteran ability.',
  },
  'hover mode': {
    name: 'Hover Mode',
    description: 'The flyer can behave like a standard model. It may start in Hover Mode during deployment. It enters Hover Mode by not repositioning during the reserve phase, and exits by being removed during the reserve phase (returning as a normal flyer next round). In Hover Mode the flyer can capture, hold and contest objectives, and can be healed or repaired by other models. When not in Hover Mode, the flyer always counts as having moved 24". Passengers may only disembark while the flyer is in Hover Mode; if the flyer is destroyed by an explosion, passengers suffer double the automatic wounds.',
  },
  // ── Escalation supplement (Gargantuan Creatures & Super-heavy Vehicles) ──────
  'colossal blast': {
    name: 'Colossal Blast',
    description: 'A hit from the weapon can cause up to eight wound rolls. You cannot make more wound rolls than there are models in the target unit. If the first hit roll is unsuccessful, it can be re-rolled and incurs up to four wound rolls.',
  },
  'strength d': {
    name: 'Strength "D"',
    description: 'A to-wound roll of 2+ always wounds a creature or penetrates a vehicle.',
  },
  'gargantuan creature': {
    name: 'Gargantuan Creature',
    description: 'Follows the rules for Monstrous Creatures with these exceptions: can ignore enemy models when moving (unless another super-heavy or gargantuan); need not use Defensive fire or fight in melee when charged (unless by another super-heavy/gargantuan); is never bound in melee unless engaged by another super-heavy/gargantuan; automatically wins melee with a total of +1 (unless the actual result is already better); ignores difficult terrain movement penalties and auto-passes dangerous terrain; invulnerability saves against Strength D can only be taken by other gargantuan or super-heavy models.',
  },
  'super-heavy vehicle': {
    name: 'Super-heavy Vehicle',
    description: 'Follows the rules for vehicles with these exceptions: need not use Defensive fire or fight in melee when charged (unless by another super-heavy/gargantuan); is never bound in melee unless engaged by another super-heavy/gargantuan; automatically wins melee with a total of +1; ignores difficult terrain and auto-passes dangerous terrain; invulnerability saves against Strength D only for other gargantuan/super-heavy models; can always shoot one more weapon than allowed for the distance moved; on losing its last Hull Point, on a 4+ it explodes (2D6" radius, S7 AP-2 D2). Uses its own super-heavy vehicle damage chart.',
  },
  // ── Experimental Rules (Core Rules.txt L1940-1949 — "currently undergoing playtesting and
  // completely optional"; this is the LAST entry in the canonical Core Rules text) ───────────
  'sniper': {
    name: 'Sniper',
    description: 'The model may select a specific character model in the target unit for all hit and wound rolls, using the target\'s individual defensive profile for hitting and wounding it. (Experimental — add this ability to weapons in your army meant to represent a sniper rifle of the respective faction.)',
  },
};

/**
 * Normalise an ability token for glossary lookup — exported so the structured query layer
 * (engine/specialRules.ts) reuses the exact same "Name(param)" extraction (e.g.
 * "Rending(4+)" -> { key: 'rending', param: '4+' }) instead of re-implementing it.
 */
export function normaliseKey(raw: string): { key: string; param: string | null } {
  const m = raw.trim().match(/^(.+?)\s*\(([^)]+)\)\s*$/);
  if (m) {
    return {
      key: m[1].trim().toLowerCase(),
      param: m[2].trim(),
    };
  }
  return { key: raw.trim().toLowerCase(), param: null };
}

/**
 * Returns the generic (non-parameterized) form of a rule — for reference glossaries
 * where "Terrifying(-1)" and "Terrifying(-2)" should collapse into one "Terrifying(X)" entry.
 */
export function lookupRuleGeneric(token: string): { displayName: string; description: string } | null {
  const { key } = normaliseKey(token);
  const entry = RULES[key];
  if (!entry) return null;
  const clean = (s: string) => s.replace(/\{X\}/g, 'X');
  return { displayName: clean(entry.name), description: clean(entry.description) };
}

/**
 * Look up a weapon profile's `type` string against the "Weapon types" glossary
 * (Assault, Grenade, Heavy, Melee, Pistol, Rapid Fire). Unlike ability tokens
 * ("Ammo(2)"), weapon types carry a trailing shot count with no parentheses
 * ("Rapid Fire 1", "Assault 2", "Heavy 1") — strip it before matching the key.
 */
export function lookupWeaponType(raw: string): { displayName: string; description: string } | null {
  const key = raw.trim().toLowerCase().replace(/\s+\d+$/, '');
  const entry = RULES[key];
  if (!entry) return null;
  return { displayName: entry.name, description: entry.description };
}

/** Look up a single ability token. Returns null if not in the glossary. */
export function lookupRule(token: string): { displayName: string; description: string } | null {
  const { key, param } = normaliseKey(token);
  const entry = RULES[key];
  if (!entry) return null;

  const sub = (s: string) => param ? s.replace(/\{X\}/g, param) : s;
  return {
    displayName: sub(entry.name),
    description: sub(entry.description),
  };
}

/**
 * Parse an ability string into renderable parts.
 *
 * Two formats exist in the data:
 *  1. "Name: description text" — custom rule with its own description
 *  2. "Rule1, Rule2(x), Rule3" — comma-separated list of core rule references
 */
export interface AbilityPart {
  displayName: string;
  description: string | null;
  isCustom: boolean;
}

export function parseAbility(raw: string): AbilityPart[] {
  const trimmed = raw.trim();

  // Detect "Name: Description" format: colon-space before a long description
  // Heuristic: colon occurs in the first 60 chars and there's substantial text after it
  const colonIdx = trimmed.indexOf(': ');
  if (colonIdx > 0 && colonIdx < 70 && trimmed.length - colonIdx > 10) {
    const name = trimmed.slice(0, colonIdx).trim();
    const desc = trimmed.slice(colonIdx + 2).trim();
    return [{ displayName: name, description: desc, isCustom: true }];
  }

  // Otherwise: comma-separated rule tokens
  return trimmed.split(',').map(token => {
    const t = token.trim();
    if (!t) return null;
    const found = lookupRule(t);
    if (found) {
      return { displayName: found.displayName, description: found.description, isCustom: false };
    }
    return { displayName: t, description: null, isCustom: false };
  }).filter(Boolean) as AbilityPart[];
}
