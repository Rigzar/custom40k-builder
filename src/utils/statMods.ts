import type { EquipMods } from '../engine/equipMods';
import { capStat } from '../lib/statPipeline';
/** Core Rules maxima and minima (Strength, Toughness, Initiative, Attacks, Leadership 1-10) on every stat of a modified profile. */
const capAll = (r: Record<string, string>) => { for (const k of Object.keys(r)) r[k] = capStat(k, r[k]); return r; };

/**
 * Stat-block modifier maths, shared by Print View and the Tabletop Simulator export.
 *
 * MOVED here verbatim from PrintView.tsx rather than copied: `applyDelta` already existed
 * in two places (PrintView and UnitCard) and the TTS export needed the same maths, which would
 * have made three. UnitCard keeps its own variant because it returns `{ display, modified }` to
 * drive the "◆ = equipment" highlight in the live view; this pair is the plain-value version.
 */

/** Apply a numeric delta to a printed stat value, respecting each stat's own notation. */
export function applyDelta(val: string, delta: number): string {
  if (!val || val === '-') return val;
  if (/^\d+$/.test(val)) return String(parseInt(val) + delta);
  const m = val.match(/^(\d+)"$/);
  if (m) return `${parseInt(m[1]) + delta}"`;
  // A save/skill value ("3+") — see the matching fix in UnitCard.tsx's own applyDelta for why
  // this is plain addition (stat_mod deltas for SV are already stored in save-number space, e.g.
  // Tyranid "Hardened Carapace" is delta: -1). Floored at 2+.
  const save = val.match(/^(\d+)\+$/);
  if (save) return `${Math.max(2, parseInt(save[1]) + delta)}+`;
  return val;
}

/** Apply an EquipMods bundle (stat deltas + an armour-save floor) to a model's stat block. */
export function applyEquipDeltas(
  stats: Record<string, string>, mods: EquipMods, isVehicle: boolean,
): Record<string, string> {
  const result = { ...stats };
  for (const [key, delta] of Object.entries(mods.statDeltas)) {
    // A vehicle takes none of the model-stat bonuses except its Movement and its firing / fighting skill (same rule as
    // lib/statPipeline.ts, which the unit card and the battle view use; the print used to apply every one of them).
    if (isVehicle && key !== 'M' && key !== 'BS' && key !== 'WS') continue;
    if (result[key] !== undefined) result[key] = applyDelta(result[key], delta!);
  }
  if (!isVehicle && mods.armorSave !== null) {
    const existing = result.SV?.match(/(\d+)\+/);
    if (!existing || mods.armorSave < parseInt(existing[1])) result.SV = `${mods.armorSave}+`;
  }
  return capAll(result);
}

/** Apply a list of `{ stat, delta }` entries (option effects, army traits, C'tan Yngir, ...). */
export function applyStatMods(
  stats: Record<string, string>, mods: Array<{ stat: string; delta: number }>,
): Record<string, string> {
  const result = { ...stats };
  for (const { stat, delta } of mods) {
    if (result[stat] !== undefined) result[stat] = applyDelta(result[stat], delta);
  }
  return capAll(result);
}
