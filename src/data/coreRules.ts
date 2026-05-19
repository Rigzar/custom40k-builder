/**
 * Core Rules glossary — weapon abilities and model special rules.
 * Keys are lowercase, trimmed, with no parameters (parameters are extracted at lookup time).
 * Descriptions use {X} as placeholder for the extracted parameter value.
 */
export interface RuleEntry {
  name: string;
  description: string;
}

const RULES: Record<string, RuleEntry> = {
  // ── Weapon abilities ──────────────────────────────────────────────────────
  'ammo': {
    name: 'Ammo({X})',
    description: 'This weapon can only be used {X} times per game.',
  },
  'anti-air': {
    name: 'Anti-Air',
    description: 'Attacks against models with Anti-Grav, Jet Bike, Jump Pack, or the Flyer unit type gain +1 to hit rolls and +1 Strength.',
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
    description: 'A single wound roll against Creatures can be re-rolled. If multiple models in a unit have this weapon, one wound roll per model may be re-rolled.',
  },
  'indirect': {
    name: 'Indirect',
    description: 'The weapon does not require line of sight. Targets only gain a cover bonus if in a terrain zone. Can only be fired using the Stand & Shoot command.',
  },
  'master-crafted': {
    name: 'Master-crafted',
    description: "A single hit roll can be re-rolled. If the weapon has Barrage, Explosive, or Flames, a single wound or armor penetration roll can be re-rolled instead. If multiple models in a unit have this weapon, one hit roll per model may be re-rolled.",
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
    description: 'Each roll of a 1 on a hit roll causes the user to suffer a Mortal Wound (or a glancing hit for vehicles). Re-roll abilities do not prevent overheating — the initial roll determines it.',
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
    description: 'Enemy units in cover do not gain any cover benefit against this weapon.',
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
    description: 'Scoring 1 ranged hit forces the target to take a Leadership test. Each additional weapon with this rule fired at the same target adds a cumulative -1 penalty. Barrage adds -2; Explosive adds -1. A failed test gives the target a Battleshock token.',
  },
  'unwieldy': {
    name: 'Unwieldy',
    description: 'The model does not gain an additional attack for having a pistol in close combat. Each model may carry only one Unwieldy item.',
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
};

/** Normalise an ability token for glossary lookup. */
function normaliseKey(raw: string): { key: string; param: string | null } {
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
