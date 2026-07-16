/**
 * sourceCompare.ts — compare production data against the creator's live Google Sheet (same data as
 * the .ods: one workbook per faction, one tab per unit). Fetching is done by the admin API proxy
 * (api/admin/source-sheets, avoids browser CORS); this module only parses the returned CSV and
 * diffs it against the loaded faction data.
 *
 * Compares model POINTS, model STATS (header-driven, so infantry M/WS/BS/S/T/W/I/A/LD/SV and
 * vehicle FRONT/SIDE/REAR/HP both work) and WEAPON profiles (range/type/S/AP/D/abilities).
 *
 * Read-only: it reports differences, it never writes anything.
 *
 * Deliberate rule: a cell the sheet leaves EMPTY is skipped, never reported. The sheet omits values
 * it considers not applicable (e.g. Plague Marine WS/BS), and treating those as "differences" would
 * bury the real findings in noise.
 */
import type { FactionData, Unit } from '../types/data';

export interface SourceFinding {
  unit: string;
  /** 'sheet' = an anomaly in the source itself (e.g. the same weapon listed twice) */
  kind: 'points' | 'stat' | 'weapon' | 'sheet';
  /** model name (points/stat) or weapon name */
  target: string;
  /** 'points', a stat key ('M', 'T', 'FRONT'…), or a weapon field ('range', 'ap'…) */
  field: string;
  source: string;
  prod: string;
}

/** Stat column headers we know how to compare (infantry + vehicle). */
const STAT_KEYS = ['M', 'WS', 'BS', 'S', 'T', 'W', 'I', 'A', 'LD', 'SV', 'FRONT', 'SIDE', 'REAR', 'HP'];

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

const norm = (s: string | number | null | undefined) => String(s ?? '').trim().replace(/\s+/g, ' ');

export interface SourceModel { points: number | null; stats: Record<string, string> }

/** Parse the model block of a unit tab: NAME + stat columns + POINTS, driven by the header row. */
export function extractModels(csv: string): Record<string, SourceModel> {
  const rows = csvRows(csv);
  const out: Record<string, SourceModel> = {};
  const headerIdx = rows.findIndex(r => r.some(c => c.trim().toUpperCase() === 'POINTS'));
  if (headerIdx === -1) return out;
  const header = rows[headerIdx].map(c => c.trim().toUpperCase());
  const pointsCol = header.indexOf('POINTS');
  const nameCol = header.indexOf('NAME') === -1 ? 1 : header.indexOf('NAME');
  const statCols: Record<string, number> = {};
  header.forEach((h, i) => { if (STAT_KEYS.includes(h) && statCols[h] === undefined) statCols[h] = i; });

  for (let i = headerIdx + 1; i < rows.length; i++) {
    const r = rows[i];
    const name = norm(r[nameCol]);
    if (!name) break;                       // blank NAME ends the model block ("Every model…")
    const ptsRaw = norm(r[pointsCol]);
    const pts = parseInt(ptsRaw, 10);
    const stats: Record<string, string> = {};
    for (const [k, col] of Object.entries(statCols)) {
      const v = norm(r[col]);
      if (v) stats[k] = v;                  // skip cells the sheet leaves empty
    }
    out[name] = { points: Number.isNaN(pts) ? null : pts, stats };
  }
  return out;
}

export interface SourceWeapon { range: string; type: string; s: string; ap: string; d: string; abilities: string }

/**
 * Parse the weapon block. Columns after the WEAPON header are unlabeled for S/AP/D, so they're
 * positional: 0 name, 1 range, 2 type, 3 S, 4 AP, 5 D, 6 abilities.
 * A "Plasma gun *" parent row followed by "- Standard" / "- Overcharged" becomes
 * "Plasma gun - Standard" / "Plasma gun - Overcharged", matching how production names them.
 */
export function extractWeapons(csv: string): { weapons: Record<string, SourceWeapon>; duplicates: string[] } {
  const rows = csvRows(csv);
  const out: Record<string, SourceWeapon> = {};
  const duplicates: string[] = [];
  const headerIdx = rows.findIndex(r => norm(r[0]).toUpperCase() === 'WEAPON');
  if (headerIdx === -1) return { weapons: out, duplicates };
  let parent = '';
  for (let i = headerIdx + 1; i < rows.length; i++) {
    const r = rows[i];
    const c0 = norm(r[0]);
    if (!c0) break;                                    // blank ends the weapon block
    if (c0.startsWith('*')) break;                     // footnote ("* Choose one of the following")
    if (/^(OPTIONS|ABILITIES|SPECIAL RULES|KEYWORDS)$/i.test(c0)) break;   // next section

    const isSub = c0.startsWith('-');
    const name = isSub ? `${parent} - ${norm(c0.replace(/^-\s*/, ''))}` : c0.replace(/\s*\*$/, '').trim();
    const w: SourceWeapon = {
      range: norm(r[1]), type: norm(r[2]), s: norm(r[3]), ap: norm(r[4]), d: norm(r[5]), abilities: norm(r[6]),
    };
    if (!isSub) {
      parent = name;
      // a bare parent row (only a name, no profile) just heads its sub-profiles — not a weapon
      if (!w.range && !w.type && !w.s && !w.ap && !w.d && !w.abilities) continue;
    }
    // Keep the FIRST row for a name and flag the repeat. The sheet sometimes repeats a name for a
    // different weapon (e.g. a Krak grenade row mislabelled "Frag grenade"); last-wins would hide
    // that behind a bogus "this weapon differs" diff instead of naming the real problem.
    if (out[name]) { if (!duplicates.includes(name)) duplicates.push(name); continue; }
    out[name] = w;
  }
  return { weapons: out, duplicates };
}

/** Diff production (models: points + stats, weapons: full profile) vs the source CSVs by unit name. */
export function compareFaction(faction: FactionData, csvByUnit: Record<string, string | null>): SourceFinding[] {
  const findings: SourceFinding[] = [];
  const units = faction.units as Record<string, Unit>;

  for (const unit of Object.values(units)) {
    const csv = csvByUnit[unit.name];
    if (!csv) continue;                                // no matching tab fetched

    // ── models: points + stats ──
    const srcModels = extractModels(csv);
    for (const m of [...(unit.models ?? []), ...(unit.variant_models ?? [])]) {
      const sm = srcModels[m.name];
      if (!sm) continue;                               // name doesn't line up — skip, don't guess
      if (sm.points != null && sm.points !== m.points) {
        findings.push({ unit: unit.name, kind: 'points', target: m.name, field: 'points', source: String(sm.points), prod: String(m.points) });
      }
      for (const [k, sv] of Object.entries(sm.stats)) {
        const pv = norm((m.stats as Record<string, string>)?.[k]);
        if (!pv) continue;                             // production doesn't track this stat here
        if (norm(sv) !== pv) {
          findings.push({ unit: unit.name, kind: 'stat', target: m.name, field: k, source: sv, prod: pv });
        }
      }
    }

    // ── weapons: range / type / S / AP / D / abilities ──
    const { weapons: srcWeapons, duplicates } = extractWeapons(csv);
    for (const dup of duplicates) {
      findings.push({ unit: unit.name, kind: 'sheet', target: dup, field: 'duplicate row', source: 'listed more than once', prod: '—' });
    }
    for (const w of unit.weapons ?? []) {
      const sw = srcWeapons[w.name];
      if (!sw) continue;
      const pairs: [string, string, string][] = [
        ['range', sw.range, norm(w.range)],
        ['type', sw.type, norm(w.type)],
        ['s', sw.s, norm(w.s)],
        ['ap', sw.ap, norm(w.ap)],
        ['d', sw.d, norm(w.d)],
        ['abilities', sw.abilities, norm(w.abilities)],
      ];
      for (const [field, sv, pv] of pairs) {
        if (!sv) continue;                             // sheet left it blank → nothing to compare
        if (norm(sv) !== pv) {
          findings.push({ unit: unit.name, kind: 'weapon', target: w.name, field, source: sv, prod: pv });
        }
      }
    }
  }
  return findings;
}
