import type { CalcTables } from '../data/pointsCalculator';
import { SPECIAL_RULE_COSTS } from '../data/specialRuleCosts';

/**
 * calcWorkbook.ts — write a working copy of the author's points calculator.
 *
 * Not a dump of numbers: the exported file carries the SAME formulas as his, in the SAME cells,
 * so it behaves like the original — type a stat into row 5 and the points appear in N5. That is
 * the whole point of the export. If it were only values he would have a report, not a calculator.
 *
 * The layout mirrors `Points calculator_v5.4.xlsx`, sheet "Punkterechner v5", cell for cell:
 *   rows 4-5    creature inputs, points in N5
 *   rows 8-9    vehicle inputs, points in N9
 *   rows 12-13  ranged weapon, one column per Ballistic skill (I..N)
 *   rows 16-17  melee weapon, one column per Weapon skill (I..N)
 *   rows 21-32  Strength / Toughness / Initiative / Leadership / Save / Ward
 *   rows 34-45  Movement / BS-WS / Attacks / AP ranged
 *   rows 47-72  Range / S ranged / S melee / AP melee
 * Because the addresses match, his formulas can be copied verbatim rather than re-derived — and
 * because the tables keep their row counts, editing a cost never moves a lookup range.
 *
 * SheetJS is imported dynamically: it is about a megabyte, and nobody who is not exporting a
 * spreadsheet should pay for it on load.
 */

type Row = (string | number | null)[];
/** Column letters by 0-based index, A..N — enough for this sheet. */
const COL = 'ABCDEFGHIJKLMN'.split('');

/** Cell address from 0-based column and 1-based row. */
const at = (c: number, r: number) => `${COL[c]}${r}`;

/** His four formulas, verbatim from N5 / N9 / I13 / I17. `FALSE()` and the ranges are his. */
const F_CREATURE =
  '(((VLOOKUP(B5,B23:C32,2,FALSE())+VLOOKUP(C5,D23:E32,2,FALSE())+VLOOKUP(E5,F23:G32,2,FALSE())' +
  '+VLOOKUP(F5,F36:G45,2,FALSE())+VLOOKUP(G5,H23:I31,2,FALSE())' +
  '+(IF(K5="No",VLOOKUP(J5,B36:C45,2,FALSE()),VLOOKUP(J5,B36:C45,2,FALSE())*2)))*D5)' +
  '*VLOOKUP(H5,J23:K28,2,FALSE()))*VLOOKUP(I5,L23:M28,2,FALSE())';

const F_VEHICLE =
  '(VLOOKUP(B9,B23:C32,2,FALSE())+C9+D9+E9+VLOOKUP(F9,F23:G32,2,FALSE())+VLOOKUP(G9,F36:G45,2,FALSE())' +
  '+(IF(L9="No",VLOOKUP(J9,B36:C45,2,FALSE()),VLOOKUP(J9,B36:C45,2,FALSE())*2)))' +
  '*H9*VLOOKUP(I9,L23:M28,2,FALSE())+K9';

const F_RANGED =
  '(VLOOKUP(B13,B49:C72,2,FALSE())+VLOOKUP(D13,D49:E58,2,FALSE())+VLOOKUP(E13,H36:I42,2,FALSE()))*C13*F13';

const F_MELEE =
  '(VLOOKUP(D17,F49:G58,2,FALSE())+VLOOKUP(E17,H49:I55,2,FALSE()))*F17';

/** Skill columns I..N are the base formula scaled 6/6, 5/6 … 1/6 — his own pattern. */
function skillColumns(base: string): string[] {
  return [6, 5, 4, 3, 2, 1].map(n => (n === 6 ? base : `${base}*${n}/6`));
}

function put(rows: Row[], r: number, c: number, v: string | number) {
  const i = r - 1;
  while (rows.length <= i) rows.push([]);
  const row = rows[i];
  while (row.length <= c) row.push(null);
  row[c] = v;
}

/** Write a two-column Value/Cost block starting at `col`, `firstRow` being the first data row. */
function putTable(rows: Row[], col: number, firstRow: number, title: string,
                  entries: [number | string, number][]) {
  put(rows, firstRow - 2, col, title);
  put(rows, firstRow - 1, col, 'Value');
  put(rows, firstRow - 1, col + 1, 'Cost');
  entries.forEach(([v, cost], i) => {
    put(rows, firstRow + i, col, v);
    put(rows, firstRow + i, col + 1, cost);
  });
}

const pairs = (t: Record<number, number>): [number, number][] =>
  Object.keys(t).map(Number).sort((a, b) => a - b).map(k => [k, t[k]]);

/**
 * Build the workbook and hand back a Blob ready to download.
 * `tables` are whatever the designer currently has in the editor — his originals, or his edits.
 */
export async function buildCalculatorWorkbook(tables: CalcTables): Promise<Blob> {
  const XLSX = await import('xlsx');
  const rows: Row[] = [];

  put(rows, 2, 1, 'Points calculator');
  put(rows, 2, 3, 'Exported from the Custom40k army builder');

  // ── the four calculators ───────────────────────────────────────────────────
  put(rows, 3, 1, 'Kreaturen / Creatures');
  ['S', 'T', 'W', 'I', 'A', 'LD', 'Sv', 'Ward Sv', 'Movement', 'Flying'].forEach((h, i) => put(rows, 4, 1 + i, h));
  put(rows, 4, 13, 'Points');
  [4, 6, 3, 4, 4, 8, 2, 4, 6].forEach((v, i) => put(rows, 5, 1 + i, v));
  put(rows, 5, 10, 'No');

  put(rows, 7, 1, 'Fahrzeuge / Vehicles');
  ['S', 'Front', 'Side', 'Back', 'I', 'A', 'HP', 'Invul Sv', 'Movement', 'Transport', 'Anti-Grav']
    .forEach((h, i) => put(rows, 8, 1 + i, h));
  put(rows, 8, 13, 'Points');
  [5, 11, 11, 10, 2, 1, 2, 5, 6, 0].forEach((v, i) => put(rows, 9, 1 + i, v));
  put(rows, 9, 11, 'No');

  put(rows, 11, 1, 'Fernkampfwaffen / Ranged weapons');
  ['Range', 'Shots', 'Strength', 'AP', 'Damage'].forEach((h, i) => put(rows, 12, 1 + i, h));
  put(rows, 12, 7, 'Points');
  ['BS 1', 'BS 2', 'BS 3', 'BS 4', 'BS 5', 'BS 6'].forEach((h, i) => put(rows, 12, 8 + i, h));
  [24, 4, 7, 4, 2].forEach((v, i) => put(rows, 13, 1 + i, v));

  put(rows, 15, 1, 'Nahkampfwaffen / Melee weapons');
  ['Strength', 'AP', 'Damage'].forEach((h, i) => put(rows, 16, 3 + i, h));
  put(rows, 16, 7, 'Points');
  ['WS 1', 'WS 2', 'WS 3', 'WS 4', 'WS 5', 'WS 6'].forEach((h, i) => put(rows, 16, 8 + i, h));
  [8, 3, 3].forEach((v, i) => put(rows, 17, 3 + i, v));

  // ── the lookup tables, at the addresses the formulas point at ─────────────
  putTable(rows, 1,  23, 'Strength',    pairs(tables.strength));
  putTable(rows, 3,  23, 'Toughness',   pairs(tables.toughness));
  putTable(rows, 5,  23, 'Initiative',  pairs(tables.initiative));
  putTable(rows, 7,  23, 'Ld',          pairs(tables.leadership));
  putTable(rows, 9,  23, 'Save',        pairs(tables.save));
  putTable(rows, 11, 23, 'Ward Save',   pairs(tables.ward));

  putTable(rows, 1,  36, 'Movement',    tables.movement.map(([v, c]) => [v, c] as [number, number]));
  putTable(rows, 3,  36, 'BS/WS',       pairs(tables.skill).filter(([v]) => v >= 1));
  putTable(rows, 5,  36, 'Attacks',     pairs(tables.attacks));
  putTable(rows, 7,  36, 'AP Ranged',   pairs(tables.apRanged));

  // His Range block runs 49-72: every 3" step, then a final "72+" row.
  const rangeRows: [number | string, number][] = tables.range.map(([v, c]) => [v, c]);
  rangeRows.push(['72+', (tables.range[tables.range.length - 1]?.[1] ?? 22.5) + 1.5]);
  putTable(rows, 1,  49, 'Range',       rangeRows);
  putTable(rows, 3,  49, 'S Ranged',    pairs(tables.sRanged));
  putTable(rows, 5,  49, 'S Melee',     pairs(tables.sMelee));
  putTable(rows, 7,  49, 'AP Melee',    pairs(tables.apMelee));

  const ws = XLSX.utils.aoa_to_sheet(rows as unknown[][]);

  // ── the formulas, written last so nothing overwrites them ────────────────
  // A cached `v` is required as well as `f`: SheetJS drops a cell that carries only a formula,
  // which is how the first export came out as a spreadsheet full of empty result cells. The 0 is
  // replaced the moment the file is opened and recalculated.
  const formula = (f: string) => ({ t: 'n' as const, f, v: 0 });
  ws[at(13, 5)] = formula(F_CREATURE);
  ws[at(13, 9)] = formula(F_VEHICLE);
  skillColumns(F_RANGED).forEach((f, i) => { ws[at(8 + i, 13)] = formula(f); });
  skillColumns(F_MELEE).forEach((f, i) => { ws[at(8 + i, 17)] = formula(f); });

  ws['!ref'] = `A1:N${Math.max(rows.length, 73)}`;
  ws['!cols'] = [{ wch: 3 }, ...Array.from({ length: 13 }, () => ({ wch: 11 }))];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Punkterechner v5');

  // Second sheet: his special-rule price list, in his own two-column shape.
  const rules: Row[] = [['', 'Regel', 'Rule', 'Punkte / Points', 'Punkte Monströse Kreatur / Fahrzeug']];
  for (const r of SPECIAL_RULE_COSTS) rules.push(['', r.de, r.name, r.pts, r.veh]);
  const ws2 = XLSX.utils.aoa_to_sheet(rules as unknown[][]);
  ws2['!cols'] = [{ wch: 3 }, { wch: 28 }, { wch: 28 }, { wch: 30 }, { wch: 34 }];
  XLSX.utils.book_append_sheet(wb, ws2, 'Sonderregeln & Punkte (neu)');

  const out = XLSX.write(wb, { bookType: 'xlsx', type: 'array' }) as ArrayBuffer;
  return new Blob([out], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
