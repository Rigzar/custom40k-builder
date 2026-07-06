/** General psychic disciplines available to all psyker factions (except Necrons). */
export interface WikiPower {
  name: string;
  type?: string;
  range?: string;
  target?: string;
  cast_value?: string;
  duration?: string;
  complexity?: string;
  effect?: string;
}

export const GENERAL_DISCIPLINES: Record<string, WikiPower[]> = {
  'General': [
    {
      name: 'Smite',
      type: 'Witchfire', range: '18"', target: 'Enemy unit',
      cast_value: '5', duration: 'Instant', complexity: 'Normal',
      effect: 'The target suffers three automatic hits with Strength: 5 AP: -1 D: 1; Seeking.',
    },
  ],
  'Biomancy': [
    {
      name: 'Bleed',
      type: 'Witchfire', range: '12"', target: 'Enemy unit (Creature)',
      cast_value: '5', duration: 'Instant', complexity: 'Normal',
      effect: 'Roll 1D6 per model of the target unit. For every 4+, it suffers an automatic wound with Strength: 4 AP: 0 D: 1; Seeking.',
    },
    {
      name: 'Endurance',
      type: 'Augmentation', range: '18"', target: 'Friendly unit (Creature)',
      cast_value: '6', duration: "Until the caster's next activation", complexity: 'Basic',
      effect: 'The target gains the "Berserk(4+)" and "Move through cover" abilities.',
    },
    {
      name: 'Life Steal',
      type: 'Witchfire', range: '12"', target: 'Enemy unit (Creature)',
      cast_value: '6', duration: 'Instant', complexity: 'Normal',
      effect: 'The target suffers an automatic wound with Strength: 4 AP: -4 D: 1; Seeking. The caster regains one lost Wound.',
    },
    {
      name: 'Steeled Body',
      type: 'Augmentation', range: '-', target: 'Self (Creature)',
      cast_value: '6', duration: "Until the caster's next activation", complexity: 'Basic',
      effect: 'The target gains +1 Strength, +1 Toughness and +1 to its Saving throw.',
    },
    {
      name: 'Weaken',
      type: 'Malediction', range: '18"', target: 'Enemy unit (Creature)',
      cast_value: '6', duration: "Until the caster's next activation", complexity: 'Basic',
      effect: 'The target suffers -1 to its Strength and is treated as moving through difficult terrain, even if it would normally ignore its effect.',
    },
    {
      name: 'Unnatural Speed',
      type: 'Augmentation', range: '-', target: 'Self (Creature)',
      cast_value: '7', duration: "Until the caster's next activation", complexity: 'Basic',
      effect: 'The target gains +2 Initiative and "Frenzy(6")".',
    },
  ],
  'Divination': [
    {
      name: 'Psionic Guidance',
      type: 'Augmentation', range: '-', target: 'Self',
      cast_value: '4', duration: 'Instant', complexity: 'Basic',
      effect: 'In the next Reinforcement phase, one friendly unit appears automatically without having to roll for it.',
    },
    {
      name: 'Perfect Timing',
      type: 'Augmentation', range: '12"', target: 'Friendly unit',
      cast_value: '5', duration: "Until the caster's next activation", complexity: 'Basic',
      effect: 'The target may change the result of a single die roll to any result during their own activation.',
    },
    {
      name: 'Premonition',
      type: 'Augmentation', range: '12"', target: 'Friendly unit',
      cast_value: '5', duration: "Until the caster's next activation", complexity: 'Basic',
      effect: 'The target gains the "Counter-attack" ability and ignores the penalty for Defensive fire.',
    },
    {
      name: 'Foresight',
      type: 'Augmentation', range: '12"', target: 'Friendly unit',
      cast_value: '6', duration: "Until the caster's next activation", complexity: 'Basic',
      effect: 'The target gains a 5+ invulnerability save.',
    },
    {
      name: 'Misfortune',
      type: 'Malediction', range: '18"', target: 'Enemy unit',
      cast_value: '6', duration: "Until the caster's next activation", complexity: 'Basic',
      effect: 'All attacks against the target gain the "Armor piercing(5+)" ability.',
    },
    {
      name: 'Gaze Into The Future',
      type: 'Augmentation', range: '-', target: 'Self',
      cast_value: '7', duration: "Until the caster's next activation", complexity: 'Basic',
      effect: 'The target may re-roll all rolls.',
    },
  ],
  'Pyromancy': [
    {
      name: 'Burning Hands',
      type: 'Witchfire', range: '9"', target: 'Enemy unit',
      cast_value: '5', duration: 'Instant', complexity: 'Basic',
      effect: 'The target suffers four automatic hits with Strength: 5 AP: -2 D: 1; Seeking.',
    },
    {
      name: 'Flame Blade',
      type: 'Augmentation', range: '-', target: 'Self',
      cast_value: '5', duration: "Until the caster's next activation", complexity: 'Basic',
      effect: 'The target gains +1 Strength and -1 AP for one melee weapon.',
    },
    {
      name: 'Flame Shield',
      type: 'Augmentation', range: '-', target: 'Self',
      cast_value: '6', duration: "Until the caster's next activation", complexity: 'Basic',
      effect: 'All attacks reduce their Strength and AP by 1 against the target.',
    },
    {
      name: 'Inferno',
      type: 'Malediction', range: '24"', target: 'Terrain piece',
      cast_value: '6', duration: 'Until the end of the game', complexity: 'Normal',
      effect: 'The terrain piece becomes dangerous terrain.',
    },
    {
      name: 'Magma Beam',
      type: 'Witchfire', range: '24"', target: 'Enemy unit',
      cast_value: '6', duration: 'Instant', complexity: 'Normal',
      effect: 'The target suffers one hit with Strength: 8 AP: -5 D: 2; AT(4), Melta, Seeking.',
    },
    {
      name: 'Fireball',
      type: 'Witchfire', range: '36"', target: 'Enemy unit',
      cast_value: '7', duration: 'Instant', complexity: 'Normal',
      effect: 'The target suffers one automatic hit with Strength: 8 AP: -3 D: 1; AT(2), Barrage, Seeking.',
    },
  ],
  'Telekinesis': [
    {
      name: 'Projectile Assault',
      type: 'Witchfire', range: '24"', target: 'Enemy unit',
      cast_value: '5', duration: 'Instant', complexity: 'Normal',
      effect: 'Six automatic hits with S: 5 AP: -2 D: 1; Seeking, Suppression.',
    },
    {
      name: 'Telekinetic Blast',
      type: 'Witchfire', range: '18"', target: 'Enemy unit',
      cast_value: '5', duration: 'Instant', complexity: 'Normal',
      effect: 'The target is pushed 1D6" away from the caster in a straight line.',
    },
    {
      name: 'Force Field',
      type: 'Augmentation', range: '-', target: 'Self + attached unit',
      cast_value: '6', duration: "Until the caster's next activation", complexity: 'Basic',
      effect: 'The target gains the benefit of cover.',
    },
    {
      name: 'Levitation',
      type: 'Augmentation', range: '12"', target: 'Friendly unit',
      cast_value: '6', duration: "Until the caster's next activation", complexity: 'Basic',
      effect: 'The target gains +6" Movement (to a maximum of 12") and the "Anti-Grav" ability.',
    },
    {
      name: 'Mechanical Blockade',
      type: 'Witchfire', range: '18"', target: 'Enemy unit (Vehicle)',
      cast_value: '6', duration: 'Instant', complexity: 'Normal',
      effect: 'The target suffers 3 glancing hits.',
    },
    {
      name: 'Psionic Storm',
      type: 'Witchfire', range: '18"', target: 'Enemy unit',
      cast_value: '7', duration: 'Instant', complexity: 'Complex',
      effect: 'The target suffers one automatic hit with Strength: 9 AP: -3 D: 1; AT(2), Barrage, Seeking, Suppression.',
    },
  ],
  'Telepathy': [
    {
      name: 'Courage',
      type: 'Augmentation', range: '24"', target: 'Friendly unit (Creature)',
      cast_value: '4', duration: "Until the caster's next activation", complexity: 'Basic',
      effect: "The target can't gain Battleshock tokens by any means and loses all current tokens.",
    },
    {
      name: 'Damnation',
      type: 'Malediction', range: '24"', target: 'Enemy unit (Creature)',
      cast_value: '5', duration: "Until the caster's next activation", complexity: 'Basic',
      effect: 'The target suffers a -2 penalty to its Leadership.',
    },
    {
      name: 'Shrouding',
      type: 'Augmentation', range: '12"', target: 'Friendly unit',
      cast_value: '6', duration: "Until the caster's next activation", complexity: 'Basic',
      effect: 'The target gains the "Deflect" and "Parry" abilities.',
    },
    {
      name: 'Psychic Shriek',
      type: 'Witchfire', range: '12"', target: 'Enemy unit (Creature)',
      cast_value: '6', duration: 'Instant', complexity: 'Normal',
      effect: "Roll 3D6 and subtract the target's Leadership. If the result is >0, the target suffers 1 Mortal Wound and gains a Battleshock token.",
    },
    {
      name: 'Dominate',
      type: 'Malediction', range: '18"', target: 'Enemy unit (Creature)',
      cast_value: '7', duration: "Until the caster's next activation", complexity: 'Normal',
      effect: 'Select one weapon of the target. It automatically hits one enemy unit of your choice within range (can be the unit itself) with a single attack or shot. Can only be successfully manifested once per round and per psyker.',
    },
    {
      name: 'Hallucinate',
      type: 'Malediction', range: '18"', target: 'Enemy unit',
      cast_value: '7', duration: 'Instant', complexity: 'Basic',
      effect: 'Assign a randomly chosen command face down to the target.',
    },
  ],
};
