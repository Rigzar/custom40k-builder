/**
 * sourceCompare.ts — compare unit POINTS in the production data against the creator's live Google
 * Sheet (the same data as the .ods, one tab per unit). Fetching is done by the admin API proxy
 * (api/admin/source-sheets, avoids browser CORS); this module only parses the returned CSV and
 * diffs it against the loaded faction data. Points-only for now — the highest-value, most reliable
 * signal (it's how hidden re-costs like Genestealer 16→15 get caught).
 */
import type { FactionData, Unit } from '../types/data';

export interface SourceFinding {
  unit: string;
  model: string;
  source: number;
  prod: number;
}

/** Minimal RFC-4180-ish CSV parser (handles quoted fields, escaped "", embedded commas/newlines). */
export function csvRows(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c === '\r') { /* ignore */ }
    else field += c;
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  return rows;
}

/** Extract { modelName: points } from a unit tab's CSV (header row ends in a POINTS column). */
export function extractPoints(csv: string): Record<string, number> {
  const rows = csvRows(csv);
  const out: Record<string, number> = {};
  const headerIdx = rows.findIndex(r => r.some(c => c.trim().toUpperCase() === 'POINTS'));
  if (headerIdx === -1) return out;
  const header = rows[headerIdx].map(c => c.trim().toUpperCase());
  const pointsCol = header.indexOf('POINTS');
  const nameCol = header.indexOf('NAME') === -1 ? 1 : header.indexOf('NAME');
  for (let i = headerIdx + 1; i < rows.length; i++) {
    const r = rows[i];
    const name = (r[nameCol] ?? '').trim();
    if (!name) break;                       // blank NAME ends the model block ("Every model…")
    const pts = parseInt((r[pointsCol] ?? '').trim(), 10);
    if (!Number.isNaN(pts)) out[name] = pts;
  }
  return out;
}

/** Diff production model points vs the source CSVs (keyed by unit name). */
export function comparePoints(faction: FactionData, csvByUnit: Record<string, string | null>): SourceFinding[] {
  const findings: SourceFinding[] = [];
  const units = faction.units as Record<string, Unit>;
  for (const unit of Object.values(units)) {
    const csv = csvByUnit[unit.name];
    if (!csv) continue;                      // no matching tab fetched
    const src = extractPoints(csv);
    for (const m of [...(unit.models ?? []), ...(unit.variant_models ?? [])]) {
      const s = src[m.name];
      if (s != null && s !== m.points) {
        findings.push({ unit: unit.name, model: m.name, source: s, prod: m.points });
      }
    }
  }
  return findings;
}
