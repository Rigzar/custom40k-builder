/**
 * statPipeline.ts — the printed value of one stat on one model, after everything that changes it.
 *
 * Reported on the new battle view the day it shipped: *"Toxin Sacs doesn't increase the strength
 * in the battle view, but works good in the normal view."* Right, and the reason is the obvious
 * one — the battle view applied Mark bonuses and nothing else, while the unit card applied six
 * sources in a fixed order. Rather than add the missing one and wait for the next report about
 * traits or wargear, the whole chain lives here and both views run it.
 *
 * ORDER MATTERS and is preserved exactly as the unit card had it, because these are not all plain
 * additions: a "set" (Living vehicle's WS → 4+) and an armour-save floor only apply when they are
 * BETTER than what the value has already become, so moving them would change results.
 *
 *   1. Mark bonuses            (blue)    — vehicles get abilities instead, never stat deltas
 *   2. Favoured squad leader   (blue)    — +1 Attack on that one row
 *   3. Trait stat mods         (green)
 *   4. Wargear deltas + armour save, on the row entitled to them  (violet)
 *   5. Trait-granted wargear, on EVERY row (a trait equips the whole unit)  (violet)
 *   6. Wargear "set" values, if better  (violet)
 *   7. Option stat mods and the C'tan save floor  (cyan)
 */
import { markStatMods } from './markMods';

export interface StatMod { stat: string; delta: number }
export interface EquipLike {
  statDeltas: Record<string, number>;
  statSets: Record<string, string | undefined>;
  armorSave: number | null;
}
export interface StatSource {
  mark: boolean;
  trait: boolean;
  equip: boolean;
  option: boolean;
}
export interface StatPipelineInput {
  unit: { is_vehicle?: boolean; is_character?: boolean; is_monster?: boolean };
  /** Usually one Mark; a Black Crusade champion carries all four. */
  marks: string[];
  /** This row is the favoured squad leader, who gains +1 Attack. */
  favouredLeader: boolean;
  traitStatMods: StatMod[];
  optionStatMods: StatMod[];
  equipMods: EquipLike;
  traitEquipMods: EquipLike;
  /** Does this row actually carry the Armory purchases? (A champion's gear is the champion's.) */
  isEquipTarget: boolean;
  ctanYngirActive?: boolean;
}

/**
 * Add `delta` to a printed stat, in the three shapes stats are written in: a plain number, an
 * inches value, and a roll target ("3+", floored at 2+ — the best the game prints anywhere).
 * `modified` says whether the value could actually take the change; "-" never can.
 */
export function applyStatDelta(value: string, delta: number): { display: string; modified: boolean } {
  if (!value || value === '-' || value === '–') return { display: value, modified: false };
  if (/^\d+$/.test(value)) return { display: String(parseInt(value, 10) + delta), modified: true };
  const inch = value.match(/^(\d+)"$/);
  if (inch) return { display: `${parseInt(inch[1], 10) + delta}"`, modified: true };
  // A save or skill ("3+"): SV deltas are already stored in save-number space (a "+1 to save"
  // ability is delta -1, since a LOWER printed number is the better save), so the same plain
  // addition applies. Floored at 2+.
  const save = value.match(/^(\d+)\+$/);
  if (save) return { display: `${Math.max(2, parseInt(save[1], 10) + delta)}+`, modified: true };
  return { display: value, modified: false };
}

/** The value this stat should print as, and which kind of thing changed it. */
export function resolveStatValue(
  raw: string,
  k: string,
  input: StatPipelineInput,
): { display: string; source: StatSource } {
  let display = raw;
  const src: StatSource = { mark: false, trait: false, equip: false, option: false };
  const step = (delta: number, flag: keyof StatSource) => {
    if (!delta) return;
    const r = applyStatDelta(display, delta);
    if (r.modified) { display = r.display; src[flag] = true; }
  };
  const floorSave = (value: number | null, flag: keyof StatSource) => {
    if (k !== 'SV' || value == null) return;
    const existing = display.match(/(\d+)\+/);
    if (!existing || value < parseInt(existing[1], 10)) { display = `${value}+`; src[flag] = true; }
  };

  // 1 — Marks. Vehicles get ability-based benefits, never stat deltas.
  if (!input.unit.is_vehicle) {
    for (const m of input.marks) {
      for (const mod of markStatMods(m, input.unit)) {
        if (mod.stat === k) step(mod.delta, 'mark');
      }
    }
  }
  // 2 — Favoured squad leader
  if (input.favouredLeader && k === 'A') step(1, 'mark');
  // 3 — Traits
  step(input.traitStatMods.filter(s => s.stat === k).reduce((a, s) => a + s.delta, 0), 'trait');
  // 4 — Wargear this row actually carries
  if (!input.unit.is_vehicle && input.isEquipTarget) {
    step(input.equipMods.statDeltas[k] ?? 0, 'equip');
    floorSave(input.equipMods.armorSave, 'equip');
  }
  // 5 — Wargear a TRAIT granted, which equips the whole unit rather than one model
  if (!input.unit.is_vehicle) {
    step(input.traitEquipMods.statDeltas[k] ?? 0, 'equip');
    floorSave(input.traitEquipMods.armorSave, 'equip');
  }
  // 6 — "Set" values, only when better than what the value has become by now
  const setVal = input.isEquipTarget ? input.equipMods.statSets[k] : undefined;
  if (setVal) {
    const cur = display.match(/^(\d+)\+/)?.[1];
    const set = setVal.match(/^(\d+)\+/)?.[1];
    if (cur && set && parseInt(set, 10) < parseInt(cur, 10)) { display = setVal; src.equip = true; }
    else if (!cur || display === '-') { display = setVal; src.equip = true; }
  }
  // 7 — Options (Toxin Sacs +1 Strength, Daemon Prince wings +6" Movement) and the C'tan floor
  step(input.optionStatMods.filter(s => s.stat === k).reduce((a, s) => a + s.delta, 0), 'option');
  if (input.ctanYngirActive) floorSave(2, 'option');

  return { display, source: src };
}
