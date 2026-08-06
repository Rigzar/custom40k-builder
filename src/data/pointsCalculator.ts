/**
 * pointsCalculator.ts — the game author's own points formula, in code.
 *
 * WHERE THIS COMES FROM: `Codex/Points calculator_v5.4.xlsx`, sheet "Punkterechner v5". Every
 * table below is copied cell for cell from it — rows 21-32 (Strength / Toughness / Initiative /
 * Leadership / Save / Ward Save), rows 34-45 (Movement / BS-WS / Attacks / AP Ranged) and rows
 * 47-58 (Range / S Ranged / S Melee / AP Melee). Nothing here was derived or estimated.
 *
 * WHAT IT IS FOR: pricing a unit he is writing, while he writes it. It reproduces his printed
 * points closely enough to lean on — a Chaos Cultist comes to 5.0 against a printed 5, a Chaos
 * Space Marine 36.8 against 37, a Legionnaire 38.1 against 38.
 *
 * WHAT IT IS NOT: a judgement. His own warning, and it is the important part — the formula prices
 * stats, it does not read a datasheet. Feed it 1s across the board with Toughness 10, Leadership
 * 10 and a 4+ ward save and it returns under twelve points for what would be the worst roadblock
 * in the game. The number is a starting point for the designer, never the answer.
 */

/** A lookup where the cost is listed against exact values. */
type Table = Record<number, number>;

/** Steps up in threes, so a value between two rows takes the next row up. */
type Ladder = [number, number][];

export const T_STRENGTH: Table = { 1: 0.5, 2: 1.5, 3: 2.5, 4: 3.5, 5: 4.5, 6: 5.5, 7: 6.5, 8: 7.5, 9: 8.5, 10: 9.5 };
export const T_TOUGHNESS: Table = { 1: 2, 2: 2.8333333333, 3: 3.5, 4: 4.3333333333, 5: 5, 6: 5.6666666667, 7: 6, 8: 6.5, 9: 6.8333333333, 10: 7.3333333333 };
export const T_INITIATIVE: Table = { 1: 0.5, 2: 1.5, 3: 2.5, 4: 3.5, 5: 4.5, 6: 5.5, 7: 6.5, 8: 7.5, 9: 8.5, 10: 9.5 };
export const T_LEADERSHIP: Table = { 2: 1.5, 3: 2.5, 4: 3.5, 5: 4.5, 6: 5.5, 7: 6.5, 8: 7.5, 9: 8.5, 10: 9.5 };
/** Armour save, as the number in "3+". 1 = no save. */
export const T_SAVE: Table = { 1: 1, 2: 0.8333333333, 3: 0.6666666667, 4: 0.5, 5: 0.3333333333, 6: 0.1666666667 };
/** Ward save, as the number in "4+". 0 = none. */
export const T_WARD: Table = { 0: 1, 2: 1.8333333333, 3: 1.6666666667, 4: 1.5, 5: 1.3333333333, 6: 1.1666666667 };
/** Weapon or Ballistic skill, as the number in "3+". */
export const T_SKILL: Table = { 1: 1, 2: 0.8333333333, 3: 0.6666666667, 4: 0.5, 5: 0.3333333333, 6: 0.1666666667 };
export const T_ATTACKS: Table = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10 };
/** Armour penetration for a RANGED weapon, as a positive number (AP-3 is 3). */
export const T_AP_RANGED: Table = { 0: -2, 1: 1, 2: 3, 3: 5, 4: 7, 5: 9, 6: 11 };
/** Armour penetration for a MELEE weapon. */
export const T_AP_MELEE: Table = { 0: -2, 1: 0.5, 2: 1.5, 3: 2.5, 4: 3.5, 5: 4.5, 6: 5.5 };
/** Strength of a ranged weapon — note the jump at 8, which is his, not a typo. */
export const T_S_RANGED: Table = { 1: 0.5, 2: 1.5, 3: 2.5, 4: 3.5, 5: 4.5, 6: 5.5, 7: 6.5, 8: 15, 9: 17, 10: 19 };
export const T_S_MELEE: Table = { 1: 0.5, 2: 1.5, 3: 2.5, 4: 3.5, 5: 4.5, 6: 5.5, 7: 6.5, 8: 7.5, 9: 8.5, 10: 9.5 };

export const L_MOVEMENT: Ladder = [[6, 1], [8, 2], [10, 3], [12, 4], [14, 5], [16, 6], [18, 7], [20, 8], [22, 9], [24, 10]];
export const L_RANGE: Ladder = [
  [6, 0.5], [9, 1], [12, 1.5], [15, 2], [18, 2.5], [21, 3], [24, 3.5], [27, 4], [30, 4.5], [33, 5],
  [36, 6], [39, 7], [42, 8], [45, 9], [48, 10.5], [51, 12], [54, 13.5], [57, 15], [60, 16.5],
  [63, 18], [66, 19.5], [69, 21], [72, 22.5],
];

function fromTable(t: Table, v: number, fallback = 0): number {
  return t[Math.round(v)] ?? fallback;
}

function fromLadder(l: Ladder, v: number): number {
  for (const [at, cost] of l) if (v <= at) return cost;
  return l[l.length - 1][1] + (v > 72 ? 1.5 : 0);
}

export interface CreatureInput {
  s: number; t: number; w: number; i: number; a: number; ld: number;
  /** Armour save as its number: 3 for "3+", 1 for none. */
  sv: number;
  /** Ward save as its number: 4 for "4+", 0 for none. */
  ward: number;
  move: number;
  flying: boolean;
}

/**
 * (S + T + I + A + LD + Movement) x Wounds x SaveMultiplier x WardMultiplier.
 * A flying model pays its movement twice.
 */
export function creaturePoints(c: CreatureInput): number {
  const base =
    fromTable(T_STRENGTH, c.s) +
    fromTable(T_TOUGHNESS, c.t) +
    fromTable(T_INITIATIVE, c.i) +
    fromTable(T_ATTACKS, c.a) +
    fromTable(T_LEADERSHIP, c.ld) +
    fromLadder(L_MOVEMENT, c.move) * (c.flying ? 2 : 1);
  return base * Math.max(1, c.w) * fromTable(T_SAVE, c.sv, 1) * fromTable(T_WARD, c.ward, 1);
}

export interface VehicleInput {
  s: number; front: number; side: number; back: number; i: number; a: number; hp: number;
  /** Ward save as its number: 5 for "5+", 0 for none. */
  ward: number;
  move: number;
  /** Models it can carry — added flat at the end. */
  transport: number;
  antiGrav: boolean;
}

/**
 * (S + Front + Side + Back + I + A + Movement) x HP x WardMultiplier, plus transport capacity.
 *
 * The three armour values go in RAW — they are not looked up in any table, unlike every other
 * stat. That is what his cell does (N9 adds C9+D9+E9 directly) and it is why a vehicle's armour
 * dominates its price. There is no armour-save multiplier for vehicles at all.
 */
export function vehiclePoints(v: VehicleInput): number {
  const base =
    fromTable(T_STRENGTH, v.s) +
    v.front + v.side + v.back +
    fromTable(T_INITIATIVE, v.i) +
    fromTable(T_ATTACKS, v.a) +
    fromLadder(L_MOVEMENT, v.move) * (v.antiGrav ? 2 : 1);
  return base * Math.max(1, v.hp) * fromTable(T_WARD, v.ward, 1) + v.transport;
}

export interface RangedInput {
  range: number; shots: number; s: number;
  /** As a positive number: AP-3 is 3. */
  ap: number;
  damage: number;
  /** Ballistic skill as its number: 3 for "3+". */
  bs: number;
}

/** (Range + Strength + AP) x Shots x Damage x BallisticSkillMultiplier. */
export function rangedPoints(w: RangedInput): number {
  const bracket = fromLadder(L_RANGE, w.range) + fromTable(T_S_RANGED, w.s) + fromTable(T_AP_RANGED, w.ap);
  return bracket * w.shots * w.damage * fromTable(T_SKILL, w.bs, 1);
}

export interface MeleeInput {
  s: number; ap: number; damage: number;
  /** Weapon skill as its number: 3 for "3+". */
  ws: number;
}

/** (Strength + AP) x Damage x WeaponSkillMultiplier — no range term, which is why a melee
 *  weapon costs the same at any board size. */
export function meleePoints(w: MeleeInput): number {
  return (fromTable(T_S_MELEE, w.s) + fromTable(T_AP_MELEE, w.ap)) * w.damage * fromTable(T_SKILL, w.ws, 1);
}

/**
 * The author's homebrew notes, printed next to the calculator so the person using it applies them.
 * These are his words in substance, kept short enough to read on screen.
 */
export const CALC_NOTES: string[] = [
  'Only the most expensive profile of a multi-mode weapon is paid for.',
  'A pistol is free on a model that already has a melee weapon; otherwise it costs half.',
  'An overheating weapon is priced as the average of its two modes.',
  'Explosive counts as 2.7425 shots; Barrage counts as 3.8395.',
  'A weapon that hits automatically pays the INVERTED Ballistic skill — a 2+ model pays the 5+ multiplier.',
  '"Fast" doubles the movement value before it is looked up.',
  'Grenades cost 0.5 per type.',
  'Melee Strength is relative to the user: U is the model\'s own, +2 is user plus two, x2 is user doubled.',
];
