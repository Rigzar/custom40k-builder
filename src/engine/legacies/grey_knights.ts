// Grey Knights — Legacy powers
// Each legacy grants ALL psykers in the army one fixed always-known power.
// Pattern mirrors how Smite is always-known for any psyker unit.
// Source: Grey Knights ENG.ods → "Grey Knight psychic discipline" → Legacy section

import type { Power } from '../../types/data';

// Maps each legacy name to the power it grants
export const GK_LEGACY_POWER_MAP: Record<string, string> = {
  'Blades of Victory':    'Inescapable Pursuit',
  'Exactors':             'Purge Soul',
  'Prescient Brethren':   'Fatal Precognition',
  'Preservers':           'Aegis Eternal',
  'Rapiers':              'Symphonic Strike',
  'Silver Blades':        'Temporal Accuracy',
  'Swordbearers':         'Empyric Lodestone',
  'Wardmakers':           'Projection of Purity',
};

// Full details for each legacy power
export const GK_LEGACY_POWER_DETAILS: Record<string, Power> = {
  'Inescapable Pursuit': {
    name:       'Inescapable Pursuit',
    type:       'Augmentation',
    range:      '-',
    target:     'Self + attached unit',
    cast_value: '6',
    effect:     'The target gains +3" charge range.',
    duration:   "Until the caster's next activation",
    complexity: 'Basic',
  },
  'Purge Soul': {
    name:       'Purge Soul',
    type:       'Witchfire',
    range:      '18"',
    target:     'Enemy model',
    cast_value: '7',
    effect:     'Select one enemy model within range. Both the caster and the target roll 1D6 and add their Leadership values to their rolls. If the caster\'s roll is equal or higher, the target suffers one Mortal Wound plus one for each point of difference (minimum one damage).',
    duration:   'Instant',
    complexity: 'Normal',
  },
  'Fatal Precognition': {
    name:       'Fatal Precognition',
    type:       'Augmentation',
    range:      '-',
    target:     '-',
    cast_value: '5',
    effect:     'The army receives a cumulative +1 bonus to rolls during the next Reinforcement and Initiative phase. Stacks with itself.',
    duration:   "Until the caster's next activation",
    complexity: 'Complex',
  },
  'Aegis Eternal': {
    name:       'Aegis Eternal',
    type:       'Augmentation',
    range:      '-',
    target:     'Self + attached unit',
    cast_value: '6',
    effect:     'The target gains the (cumulative) "Narthecium" ability.',
    duration:   "Until the caster's next activation",
    complexity: 'Basic',
  },
  'Symphonic Strike': {
    name:       'Symphonic Strike',
    type:       'Augmentation',
    range:      '-',
    target:     'Self + attached unit',
    cast_value: '7',
    effect:     'All melee attacks of the target gain the "Precision(5+)" ability.',
    duration:   "Until the caster's next activation",
    complexity: 'Basic',
  },
  'Temporal Accuracy': {
    name:       'Temporal Accuracy',
    type:       'Augmentation',
    range:      '-',
    target:     'Self + attached unit',
    cast_value: '7',
    effect:     'All models in the target unit gain the "Deflagrate(5+)" ability.',
    duration:   "Until the caster's next activation",
    complexity: 'Basic',
  },
  'Empyric Lodestone': {
    name:       'Empyric Lodestone',
    type:       'Augmentation',
    range:      '18"',
    target:     'Friendly unit',
    cast_value: '7',
    effect:     'Ranged attacks of the target gain (cumulative) -2 AP and AT(2).',
    duration:   "Until the caster's next activation",
    complexity: 'Basic',
  },
  'Projection of Purity': {
    name:       'Projection of Purity',
    type:       'Augmentation',
    range:      '-',
    target:     'Self + attached unit',
    cast_value: '7',
    effect:     'All melee attacks of the target gain the (cumulative) "Shield breaker(-2)" ability.',
    duration:   "Until the caster's next activation",
    complexity: 'Basic',
  },
};

/**
 * Returns the legacy power granted to all GK psykers when this legacy is active.
 * Returns null if legacyName is not a GK legacy (or is empty).
 */
export function getGKLegacyPower(legacyName: string): { name: string; details: Power } | null {
  const powerName = GK_LEGACY_POWER_MAP[legacyName];
  if (!powerName) return null;
  const details = GK_LEGACY_POWER_DETAILS[powerName];
  if (!details) return null;
  return { name: powerName, details };
}
