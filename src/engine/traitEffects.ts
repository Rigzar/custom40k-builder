import type { Unit } from '../types/data';

type AppliesTo = 'all' | 'creature' | 'vehicle' | 'character' | 'infantry' | 'monster';

export type TraitEffect =
  | { type: 'stat_mod';       stat: string; delta: number;                                applies_to: AppliesTo }
  | { type: 'inv_save';       value: number;                                               applies_to: AppliesTo }
  | { type: 'unit_ability';   name: string; desc?: string;                                applies_to: AppliesTo }
  | { type: 'weapon_ability'; name: string; weapon_type?: 'ranged' | 'melee' | 'bolt';   applies_to: AppliesTo };

function effectApplies(effect: TraitEffect, unit: Unit): boolean {
  switch (effect.applies_to) {
    case 'all':       return true;
    case 'creature':  return !unit.is_vehicle;
    case 'vehicle':   return unit.is_vehicle;
    case 'character': return unit.is_character;
    case 'infantry':  return !unit.is_vehicle && !unit.is_monster && !unit.is_character;
    case 'monster':   return unit.is_monster;
    default:          return false;
  }
}

/** Returns all TraitEffect entries for the given trait that apply to the given unit. */
export function getTraitEffects(traitName: string, unit: Unit): TraitEffect[] {
  const effects = TRAIT_EFFECTS[traitName];
  if (!effects) return [];
  return effects.filter(e => effectApplies(e, unit));
}

export const TRAIT_EFFECTS: Record<string, TraitEffect[]> = {

  // ── Chaos Space Marines (17 traits) ─────────────────────────────────────────

  '10.000 Years of Horror': [
    { type: 'unit_ability', name: 'Hardened by Millennia', desc: 'This unit ignores all negative modifiers to its Leadership.', applies_to: 'creature' },
  ],

  // Army-level rule only (HQ must take all 4 god marks) — no per-unit stat/ability change.
  'Black Crusade': [],

  'Blood Feud': [
    { type: 'unit_ability', name: 'Blood Feud', desc: '+1 to hit rolls in melee if this unit charged or was charged this turn.', applies_to: 'creature' },
  ],

  'Desecration': [
    { type: 'unit_ability', name: 'Desecration', desc: 'This unit has a 5+ invulnerability save while within 6" of an objective marker.', applies_to: 'creature' },
  ],

  'Fallen': [
    { type: 'unit_ability', name: 'They Shall Know No Fear', desc: 'This unit automatically passes Morale tests and never flees.', applies_to: 'creature' },
  ],

  'Hatred Unleashed': [
    { type: 'weapon_ability', name: '+1 to hit vs. nearest enemy', weapon_type: 'ranged', applies_to: 'all' },
  ],

  'Horrors of the Night': [
    { type: 'unit_ability', name: 'Horrors of the Night', desc: '+1 to hit and wound rolls in melee against Shocked or Outnumbered enemy units.', applies_to: 'creature' },
  ],

  'Iron Within, Iron Without': [
    { type: 'inv_save',     value: 6,                                                                                                          applies_to: 'creature' },
    { type: 'unit_ability', name: 'Iron Repair', desc: 'This vehicle repairs either one Engine Damage or one Weapon Damage during each Rally phase.', applies_to: 'vehicle' },
  ],

  'Laboratory Experiments': [
    { type: 'stat_mod',     stat: 'S', delta: 1,                                                                                                applies_to: 'creature' },
    { type: 'stat_mod',     stat: 'M', delta: 1,                                                                                                applies_to: 'creature' },
    { type: 'unit_ability', name: 'Berserk(5+)', desc: 'When this unit rolls a 5+ to hit in melee, it may make one additional attack against the same target.', applies_to: 'creature' },
  ],

  // Bolt weapons only (ranged weapon_type; filtered further by the player's weapon list).
  'Malicious Volley': [
    { type: 'weapon_ability', name: 'Deflagrate(5+)', weapon_type: 'bolt', applies_to: 'creature' },
  ],

  'Masters of Deception': [
    { type: 'unit_ability', name: 'Masters of Deception', desc: 'This unit counts as being in light cover until the first time it activates.', applies_to: 'all' },
  ],

  // Army-level rule only (grants a second Legacy slot) — no per-unit stat/ability change.
  'Mixed Warband': [],

  'Profane Zeal': [
    { type: 'unit_ability', name: 'Blind Rage', desc: 'This unit must move toward the nearest enemy during its activation and must charge if able.', applies_to: 'creature' },
  ],

  'Siege Experts': [
    { type: 'weapon_ability', name: 'Sunder(1)', weapon_type: 'ranged', applies_to: 'all' },
  ],

  'Superior Battle Tactics': [
    { type: 'unit_ability', name: 'Superior Battle Tactics', desc: 'Reduce any negative modifier to hit rolls for this unit by 1 (minimum 0).', applies_to: 'all' },
  ],

  'Terror Tactics': [
    { type: 'weapon_ability', name: 'Gruesome',       weapon_type: 'melee', applies_to: 'all' },
    { type: 'unit_ability',   name: 'Terrifying(-1)', desc: 'Enemy units within 6" of this unit suffer -1 to their Leadership.', applies_to: 'all' },
  ],

  'Warp Pirates': [
    { type: 'unit_ability', name: 'Frenzy(1")', desc: 'After this unit finishes a melee attack, it may move up to 1" and make an additional attack against another eligible target.', applies_to: 'creature' },
  ],

  // ── Adeptus Mechanicus (16 traits) ──────────────────────────────────────────
  // TODO: fill in per-trait effects

  // ── Adeptus Sororitas (12 traits) ───────────────────────────────────────────
  // TODO: fill in per-trait effects

  // ── Dark Eldar (22 traits) ──────────────────────────────────────────────────
  // TODO: fill in per-trait effects

  // ── Eldar (15 traits) ───────────────────────────────────────────────────────
  // TODO: fill in per-trait effects

  // ── Genestealer Cults (15 traits) ───────────────────────────────────────────
  // TODO: fill in per-trait effects

  // ── Imperial Guard (16 traits) ──────────────────────────────────────────────
  // TODO: fill in per-trait effects

  // ── Leagues of Votann (16 traits) ───────────────────────────────────────────
  // TODO: fill in per-trait effects

  // ── Necrons (17 traits) ─────────────────────────────────────────────────────
  // TODO: fill in per-trait effects

  // ── Orks (14 traits) ────────────────────────────────────────────────────────
  // TODO: fill in per-trait effects

  // ── Space Marines (19 traits) ───────────────────────────────────────────────
  // TODO: fill in per-trait effects

  // ── Tau Empire (17 traits) ──────────────────────────────────────────────────
  // TODO: fill in per-trait effects

};
