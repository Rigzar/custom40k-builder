/**
 * pointsCalculator.ts — the game author's own points formula, in code.
 *
 * WHERE THIS COMES FROM: `Codex/Points calculator_v5.4.xlsx`, sheet "Punkterechner v5". Every
 * table below is copied cell for cell from it — rows 21-32 (Strength / Toughness / Initiative /
 * Leadership / Save / Ward Save), rows 34-45 (Movement / BS-WS / Attacks / AP Ranged) and rows
 * 47-72 (Range / S Ranged / S Melee / AP Melee). Each formula was read out of its actual cell
 * (N5, N9, I13, I17), not inferred from the results — which mattered: a vehicle's armour values
 * go in RAW, and vehicles have no armour-save multiplier at all.
 *
 * VERIFIED against the sample row he left in his own sheet: creature 94.375, vehicle 106.667,
 * ranged 136 (90.667 at BS 3+), melee 30 (20 at WS 3+).
 *
 * WHAT IT IS NOT: a judgement. His own warning, and it is the important part — the formula prices
 * stats, it does not read a datasheet. Feed it 1s across the board with Toughness 10, Leadership
 * 10 and a 4+ ward save and it returns under twelve points for what would be the worst roadblock
 * in the game. The number is a starting point for the designer, never the answer.
 *
 * THE TABLES ARE DATA, NOT CONSTANTS. Every function takes the table set as an argument so the
 * designer can retune a cost in the app and immediately see what it does to a model he already
 * knows the price of. `DEFAULT_TABLES` is his v5.4 as shipped, and is what the UI resets to.
 */

/** A lookup where the cost is listed against exact values. */
export type Table = Record<number, number>;

/** Steps up, so a value between two rows takes the next row up. */
export type Ladder = [number, number][];

export interface CalcTables {
  strength: Table; toughness: Table; initiative: Table; leadership: Table;
  save: Table; ward: Table; skill: Table; attacks: Table;
  apRanged: Table; apMelee: Table; sRanged: Table; sMelee: Table;
  movement: Ladder; range: Ladder;
}

export const DEFAULT_TABLES: CalcTables = {
  strength:   { 1: 0.5, 2: 1.5, 3: 2.5, 4: 3.5, 5: 4.5, 6: 5.5, 7: 6.5, 8: 7.5, 9: 8.5, 10: 9.5 },
  toughness:  { 1: 2, 2: 2.8333333333, 3: 3.5, 4: 4.3333333333, 5: 5, 6: 5.6666666667, 7: 6, 8: 6.5, 9: 6.8333333333, 10: 7.3333333333 },
  initiative: { 1: 0.5, 2: 1.5, 3: 2.5, 4: 3.5, 5: 4.5, 6: 5.5, 7: 6.5, 8: 7.5, 9: 8.5, 10: 9.5 },
  leadership: { 2: 1.5, 3: 2.5, 4: 3.5, 5: 4.5, 6: 5.5, 7: 6.5, 8: 7.5, 9: 8.5, 10: 9.5 },
  /** Armour save, as the number in "3+". 1 = no save. */
  save:       { 1: 1, 2: 0.8333333333, 3: 0.6666666667, 4: 0.5, 5: 0.3333333333, 6: 0.1666666667 },
  /** Ward save, as the number in "4+". 0 = none. */
  ward:       { 0: 1, 2: 1.8333333333, 3: 1.6666666667, 4: 1.5, 5: 1.3333333333, 6: 1.1666666667 },
  /** Weapon or Ballistic skill, as the number in "3+". */
  skill:      { 1: 1, 2: 0.8333333333, 3: 0.6666666667, 4: 0.5, 5: 0.3333333333, 6: 0.1666666667 },
  attacks:    { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10 },
  /** Armour penetration for a RANGED weapon, as a positive number (AP-3 is 3). */
  apRanged:   { 0: -2, 1: 1, 2: 3, 3: 5, 4: 7, 5: 9, 6: 11 },
  apMelee:    { 0: -2, 1: 0.5, 2: 1.5, 3: 2.5, 4: 3.5, 5: 4.5, 6: 5.5 },
  /** Strength of a ranged weapon — the jump at 8 is his, not a typo. */
  sRanged:    { 1: 0.5, 2: 1.5, 3: 2.5, 4: 3.5, 5: 4.5, 6: 5.5, 7: 6.5, 8: 15, 9: 17, 10: 19 },
  sMelee:     { 1: 0.5, 2: 1.5, 3: 2.5, 4: 3.5, 5: 4.5, 6: 5.5, 7: 6.5, 8: 7.5, 9: 8.5, 10: 9.5 },
  movement: [[6, 1], [8, 2], [10, 3], [12, 4], [14, 5], [16, 6], [18, 7], [20, 8], [22, 9], [24, 10]],
  range: [
    [6, 0.5], [9, 1], [12, 1.5], [15, 2], [18, 2.5], [21, 3], [24, 3.5], [27, 4], [30, 4.5], [33, 5],
    [36, 6], [39, 7], [42, 8], [45, 9], [48, 10.5], [51, 12], [54, 13.5], [57, 15], [60, 16.5],
    [63, 18], [66, 19.5], [69, 21], [72, 22.5],
  ],
};

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
export function creaturePoints(c: CreatureInput, T: CalcTables = DEFAULT_TABLES): number {
  const base =
    fromTable(T.strength, c.s) +
    fromTable(T.toughness, c.t) +
    fromTable(T.initiative, c.i) +
    fromTable(T.attacks, c.a) +
    fromTable(T.leadership, c.ld) +
    fromLadder(T.movement, c.move) * (c.flying ? 2 : 1);
  return base * Math.max(1, c.w) * fromTable(T.save, c.sv, 1) * fromTable(T.ward, c.ward, 1);
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
export function vehiclePoints(v: VehicleInput, T: CalcTables = DEFAULT_TABLES): number {
  const base =
    fromTable(T.strength, v.s) +
    v.front + v.side + v.back +
    fromTable(T.initiative, v.i) +
    fromTable(T.attacks, v.a) +
    fromLadder(T.movement, v.move) * (v.antiGrav ? 2 : 1);
  return base * Math.max(1, v.hp) * fromTable(T.ward, v.ward, 1) + v.transport;
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
export function rangedPoints(w: RangedInput, T: CalcTables = DEFAULT_TABLES): number {
  const bracket = fromLadder(T.range, w.range) + fromTable(T.sRanged, w.s) + fromTable(T.apRanged, w.ap);
  return bracket * w.shots * w.damage * fromTable(T.skill, w.bs, 1);
}

export interface MeleeInput {
  s: number; ap: number; damage: number;
  /** Weapon skill as its number: 3 for "3+". */
  ws: number;
}

/** (Strength + AP) x Damage x WeaponSkillMultiplier — no range term, which is why a melee
 *  weapon costs the same at any board size. */
export function meleePoints(w: MeleeInput, T: CalcTables = DEFAULT_TABLES): number {
  return (fromTable(T.sMelee, w.s) + fromTable(T.apMelee, w.ap)) * w.damage * fromTable(T.skill, w.ws, 1);
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

/** How each editable table is labelled and where it sits in his workbook — used by both the
 *  editor and the exporter, so the two can never drift apart. */
export const TABLE_META: { key: keyof CalcTables; label: string; note?: string }[] = [
  { key: 'strength',   label: 'Strength' },
  { key: 'toughness',  label: 'Toughness' },
  { key: 'initiative', label: 'Initiative' },
  { key: 'leadership', label: 'Leadership' },
  { key: 'save',       label: 'Save',       note: '1 = no save' },
  { key: 'ward',       label: 'Ward save',  note: '0 = none' },
  { key: 'skill',      label: 'BS / WS' },
  { key: 'attacks',    label: 'Attacks' },
  { key: 'movement',   label: 'Movement',   note: 'inches, steps up' },
  { key: 'apRanged',   label: 'AP ranged' },
  { key: 'range',      label: 'Range',      note: 'inches, steps up' },
  { key: 'sRanged',    label: 'S ranged' },
  { key: 'sMelee',     label: 'S melee' },
  { key: 'apMelee',    label: 'AP melee' },
];

export const isLadder = (k: keyof CalcTables): boolean => k === 'movement' || k === 'range';
