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

/**
 * Who has to make the fix. Every finding and gap carries one, because the two live in different
 * places: the spreadsheet is the creator's to edit, the app's data and parser are ours.
 *  - 'sheet'   — the evidence points at the spreadsheet; the action says which tab/cell.
 *  - 'code'    — the app's data or this parser is wrong; nothing for the creator to do.
 *  - 'unknown' — the two disagree and nothing proves which side is wrong; the action says what to
 *                look at to decide. Stated as a suspicion, never as a verdict.
 */
export type FixOwner = 'sheet' | 'code' | 'unknown';

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
  fix: FixOwner;
  /** what to do about it, concretely — where to look and what to change */
  action: string;
}

/** Weapon types the rules actually use — anything else in the sheet is a typo (e.g. "Nahkampf"). */
const VALID_WEAPON_TYPE = /^(-|Melee|Rapid Fire \d+|Assault \d+|Heavy \d+|Grenade \d+|Pistol \d+)$/i;

/** Sanity-check a sheet value; returns why it's suspect, or null if it looks legitimate. */
function sheetIssue(field: string, sheetVal: string, appVal?: string): string | null {
  // Weapon types are proper names in the rules ("Rapid Fire 1", "Heavy 2"). When the only
  // difference is capitalisation, the sheet is writing the same type two ways in different rows —
  // it is not a disagreement about the weapon, and there is nothing to decide.
  if (field === 'type' && appVal && sheetVal !== appVal && sheetVal.toLowerCase() === appVal.toLowerCase()) {
    return `"${sheetVal}" is the same type as the app's "${appVal}", only capitalised differently — the rules write it "${appVal}"`;
  }
  if (field === 'type' && !VALID_WEAPON_TYPE.test(sheetVal)) return `"${sheetVal}" is not a valid weapon type`;
  if (field === 'd' && /^-\d/.test(sheetVal)) return `damage "${sheetVal}" is negative`;
  if (field === 's' && /^-\d/.test(sheetVal)) return `strength "${sheetVal}" is negative`;
  // Armour penetration is 0 or negative — a bare positive number is a dropped minus sign.
  if (field === 'ap' && /^\+?[1-9]\d*$/.test(sheetVal)) return `armour penetration "${sheetVal}" is positive — the minus sign is missing`;
  // There is no "AP(x)" weapon ability; the armour-piercing one is AT(x). Writing AP(x) in the
  // ABILITIES column is a recurring slip (the Quad lascannon on four different tanks).
  if (field === 'abilities' && /\bAP\(\s*\d+\s*\)/i.test(sheetVal)) return `"AP(x)" is not a weapon ability — the armour-piercing one is "AT(x)"`;
  return null;
}

/**
 * Stable identity for a finding or gap, so an admin can mark it "known and accepted" and stop
 * seeing it on every run — a naming convention both sides are happy with, or a unit whose tab
 * lives in another workbook. Built from what the row is ABOUT, never from the values, so an
 * ignored row comes back the moment the underlying disagreement changes.
 */
export interface SourceIgnore {
  key: string;
  /** what the row was, kept readable so the ignore list can be reviewed later */
  label: string;
  by?: string;
  at?: string;
}
/** Ignored rows per faction key. */
export type SourceIgnores = Record<string, SourceIgnore[]>;

export function ignoreKey(row: SourceFinding | SourceGap): string {
  return 'what' in row
    ? ['gap', row.unit, row.kind, row.what].join('|')
    : ['find', row.unit, row.kind, row.target, row.field].join('|');
}

/** Levenshtein distance, used only to tell a typo apart from a genuinely different name. */
function editDistance(a: string, b: string): number {
  const prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = tmp;
    }
  }
  return prev[b.length];
}

const loose = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

/**
 * The tab's "… is equipped with: …" lines. Used to tell two very different cases apart when a
 * weapon is in the app but has no row in the sheet's WEAPON block: if the equipment line names it,
 * the sheet itself is inconsistent (it hands the model a weapon it never gives a profile — the
 * Noise Marines' Bolt pistol, the Dark Commune's Frag grenade); if nothing mentions it, the app is
 * probably carrying a leftover.
 */
function equipText(csv: string): string {
  return csvRows(csv)
    // "<X> is equipped with:" only. "Can be equipped with one of the following: +11 points Storm
    // bolter" is an OPTION, and counting it here made the report say a weapon was handed out for
    // free when it is something you pay for.
    .filter(r => /\b(is|are)\s+(additionally\s+)?equipped with\b/i.test(r[0] ?? ''))
    .filter(r => !/^\s*[•\-]/.test(r[0] ?? ''))
    .map(r => r[0])
    .join(' | ')
    .toLowerCase();
}

/**
 * Find the name on the other side that this one is almost certainly a misspelling of. A near match
 * ("Parasite of Mortex" vs "Parasite of Mortrex") means a typo — someone has to fix one spelling.
 * No near match means the entry genuinely exists on one side only, which is a different problem
 * with a different fix, so the two must never be reported the same way.
 */
function nearMatch(name: string, candidates: string[]): string | null {
  const a = loose(name);
  if (a.length < 4) return null;
  let best: { name: string; d: number } | null = null;
  for (const c of candidates) {
    const d = editDistance(a, loose(c));
    if (!best || d < best.d) best = { name: c, d };
  }
  // allow ~1 character per 8, minimum 1 — enough for a dropped letter or a swapped pair
  return best && best.d > 0 && best.d <= Math.max(1, Math.floor(a.length / 8)) ? best.name : null;
}

/**
 * A weapon name split into the weapon itself and its firing-mode label. Both sides write these two
 * parts the same way in principle and differently in practice:
 *
 *     sheet "Missile launcher - Frag missile"   app "Missile launcher - Frag"
 *     sheet "Bolt rifle - Bolt ammo"            app "Bolt rifle (Bolt ammo)"
 *     sheet "Plasma gun - Standard"             app "Plasma gun (Standard)"
 *
 * Matched literally, none of those pair up, so the weapon looks missing on BOTH sides at once and
 * its Range/Type/S/AP/D/Abilities are never compared — over a hundred Space Marine weapons were in
 * exactly that state. Splitting the name lets the profiles be compared, which is the whole point:
 * this is not softening a difference, it is what makes the real differences visible.
 */
function splitProfile(name: string): { base: string; profile: string } {
  const n = norm(name).replace(/\.$/, '');            // some sheet rows end in a stray full stop
  const paren = n.match(/^(.*?)\s*\(([^)]*)\)\s*$/);
  if (paren) return { base: loose(paren[1]), profile: loose(paren[2]) };
  const dash = n.split(' - ');
  return dash.length > 1
    ? { base: loose(dash[0]), profile: loose(dash.slice(1).join(' - ')) }
    : { base: loose(n), profile: '' };
}

/** Profiles match when they are the same, or when one is a shortening of the other
 *  ("Frag" ⊂ "Frag missile", "Standard" ⊂ "Plasma gun (Standard)"). */
function profilesMatch(a: string, b: string): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  return a.includes(b) || b.includes(a);
}

/** Find the sheet's row for an app weapon, tolerating the two sides' profile spellings. */
export function findSourceWeapon<T>(appName: string, sheet: Record<string, T>): T | undefined {
  if (sheet[appName]) return sheet[appName];
  const a = splitProfile(appName);
  const exact: T[] = [];
  const loose: T[] = [];
  for (const [sName, sw] of Object.entries(sheet)) {
    const s = splitProfile(sName);
    if (s.base !== a.base) continue;
    if (s.profile === a.profile) exact.push(sw);
    else if (profilesMatch(a.profile, s.profile)) loose.push(sw);
  }
  if (exact.length === 1) return exact[0];
  // Only accept a shortened profile when it can mean ONE row. The Hellblaster's plasma incinerator
  // has "Standard", "Assault standard" and "Heavy standard": pairing "Standard" with whichever of
  // those came first would compare two different profiles and invent differences in every field.
  return loose.length === 1 ? loose[0] : undefined;
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

/**
 * Model names the tab uses twice. Only the last row survives the parse, so the other model's points
 * and stats vanish silently — the Crimson Hunter's tab calls both its rows "Crimson Hunter Exarch"
 * (388 pts at BS 3+ and 443 at BS 2+), and the 388 one is really the base model.
 */
export function duplicateModelNames(csv: string): string[] {
  const rows = csvRows(csv);
  const headerIdx = rows.findIndex(r => r.some(c => c.trim().toUpperCase() === 'POINTS'));
  if (headerIdx === -1) return [];
  const header = rows[headerIdx].map(c => c.trim().toUpperCase());
  const nameCol = header.indexOf('NAME') === -1 ? 1 : header.indexOf('NAME');
  const seen = new Set<string>();
  const dups: string[] = [];
  for (let i = headerIdx + 1; i < rows.length; i++) {
    const name = norm(rows[i][nameCol]);
    if (!name) break;
    if (seen.has(name)) { if (!dups.includes(name)) dups.push(name); }
    else seen.add(name);
  }
  return dups;
}

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
/** Does the next non-empty row start with "-"? That, and only that, makes row `i` a profile header. */
function nextRowIsSubProfile(rows: string[][], i: number): boolean {
  for (let j = i + 1; j < rows.length; j++) {
    const c = norm(rows[j][0]);
    if (!c) return false;                 // blank row ends the block, so nothing follows
    return c.startsWith('-') && c !== '-';   // a lone "-" is the "no weapons" placeholder
  }
  return false;
}

export function extractWeapons(csv: string): { weapons: Record<string, SourceWeapon>; duplicates: string[]; hasBlock: boolean } {
  const rows = csvRows(csv);
  const out: Record<string, SourceWeapon> = {};
  const duplicates: string[] = [];
  const headerIdx = rows.findIndex(r => norm(r[0]).toUpperCase() === 'WEAPON');
  // An empty result means two different things — the tab has no WEAPON block, or it has one that
  // correctly says the unit carries no weapons (a row of dashes: the Necron Lord, the Cryptek, the
  // Tzaangor Shaman and a dozen more). Only the first is a problem, so say which happened.
  if (headerIdx === -1) return { weapons: out, duplicates, hasBlock: false };
  let parent = '';
  for (let i = headerIdx + 1; i < rows.length; i++) {
    const r = rows[i];
    const c0 = norm(r[0]);
    if (!c0) break;                                    // blank ends the weapon block
    if (c0.startsWith('*')) break;                     // footnote ("* Choose one of the following")
    // A legend row explaining a marker ("ˣ = Experimental weapons are unique"). It normally sits
    // after a blank row, which would end the block — but the CSV export drops empty rows, so the
    // legend lands straight after the last weapon and would be read as one.
    // (a leading "-" is a sub-profile and a leading "'" starts Ork weapons like "'Urty klaw")
    if (/\s=\s/.test(c0) || /^[^A-Za-z0-9"'(-]/.test(c0)) break;
    if (/^(OPTIONS?|OPTIONEN|OPCIONES|ABILITIES|SPECIAL RULES|KEYWORDS)$/i.test(c0)) break;  // next section
    // The options list starts with bullets ("• Can replace the Rothail volley gun:"). Stop there
    // too: some tabs write the section header in another language (the Plagueburst Crawler's says
    // "OPTIONEN"), and without this the whole options list is read as weapons — the option lines
    // become weapon names, and each "- <choice>" under them becomes one of their sub-profiles.
    if (c0.startsWith('•')) break;
    // A row that is nothing but dashes is the sheet's "this unit has no weapons" placeholder
    // (Neurogaunt Brood: "Every model is equipped with: -." then a row of "-"). Without this it
    // parses as a sub-profile of a non-existent parent and invents a weapon literally named " - ".
    if (r.slice(0, 7).every(c => { const v = norm(c); return v === '' || v === '-'; })) continue;

    const isSub = c0.startsWith('-');
    const name = isSub ? `${parent} - ${norm(c0.replace(/^-\s*/, ''))}` : c0.replace(/\s*\*$/, '').trim();
    const w: SourceWeapon = {
      range: norm(r[1]), type: norm(r[2]), s: norm(r[3]), ap: norm(r[4]), d: norm(r[5]), abilities: norm(r[6]),
    };
    if (!isSub) {
      parent = name;
      // A row is a header only when sub-profile rows actually follow it — that is what makes it
      // one. Judging by its own cells instead does not work in either direction: a header often
      // carries a note meant for the profiles under it ("Only for Techmarines" in ABILITIES on the
      // Contemptor's Conversion beamer, "If you use this weapon, pick one profile:" in RANGE on the
      // Stormsurge's Pulse blastcannon), while a real weapon can leave S/AP/D empty because its
      // ability defines them (the Voidreavers' Neuro disruptor, the Talos' ichor injector) — and
      // dropping THOSE reports a weapon as missing from a sheet that does list it.
      // The trailing "*" is the sheet's own header marker, paired with a "* Choose one of the
      // following profiles" footnote. The Razorwing Jetfighter's "Razorwing missiles*" needs it:
      // its profiles are listed as plain rows, not "- " sub-rows, so there is nothing else to go on.
      if (c0.endsWith('*') || nextRowIsSubProfile(rows, i)) continue;
    }
    // Keep the FIRST row for a name and flag the repeat. The sheet sometimes repeats a name for a
    // different weapon (e.g. a Krak grenade row mislabelled "Frag grenade"); last-wins would hide
    // that behind a bogus "this weapon differs" diff instead of naming the real problem.
    if (out[name]) { if (!duplicates.includes(name)) duplicates.push(name); continue; }
    out[name] = w;
  }
  return { weapons: out, duplicates, hasBlock: true };
}

/**
 * A place where the comparison could NOT run, rather than a difference it found. `compareFaction`
 * is deliberately silent about these (it skips a unit with no tab, a model whose name doesn't line
 * up, a weapon the sheet doesn't list), which means a whole datasheet can quietly go unchecked and
 * look like "no differences". This is the visible counterpart: it says what was skipped and why.
 */
export interface SourceGap {
  unit: string;
  kind:
    | 'tab'              // no CSV came back for this unit's tab
    | 'block'            // tab fetched but a whole block failed to parse (no POINTS / no WEAPON header)
    | 'name-mismatch'    // the same thing spelled differently on each side — one spelling is a typo
    | 'missing-in-app'   // on the sheet, nothing like it in the app
    | 'missing-in-sheet';// in the app, nothing like it on the sheet
  fix: FixOwner;
  /** what is wrong */
  what: string;
  /** what to do about it — names the tab, the row and which side to change */
  action: string;
}

const GAP_ORDER: SourceGap['kind'][] = ['tab', 'block', 'name-mismatch', 'missing-in-app', 'missing-in-sheet'];

/**
 * Report what `compareFaction` had to skip for this faction — unfetched tabs, unparsed blocks, and
 * names that don't line up. This is where most real damage hides: a name that doesn't match means
 * that model's points and stats, or that weapon's whole profile, are never compared at all, and the
 * faction still reports "no differences".
 *
 * Each gap says who has to fix it. The distinction that makes it actionable is near-match: a name
 * one letter off its counterpart ("Parasite of Mortex" vs "Parasite of Mortrex") is a typo someone
 * has to correct, while a name with no counterpart at all is an entry that genuinely exists on one
 * side only. Same symptom, opposite fixes.
 */
export function coverageGaps(faction: FactionData, csvByUnit: Record<string, string | null>): SourceGap[] {
  const gaps: SourceGap[] = [];
  // A weapon sold by the Armory carries its profile there, so a datasheet that merely offers it
  // ("Can buy up to two Hunter-seeker missiles") has no reason to repeat the row. Reporting those
  // as missing from the sheet is noise — the Tau Piranha's Seeker missile is the example.
  const armoryWeapons = new Set<string>();
  for (const a of [faction.armory_general, ...Object.values(faction.armory_marks ?? {}), ...Object.values(faction.armory_legions ?? {})]) {
    for (const list of [a?.weapons, a?.equipment, a?.daemon_weapons]) {
      for (const it of list ?? []) armoryWeapons.add(loose(it.name));
    }
  }
  for (const unit of Object.values(faction.units as Record<string, Unit>)) {
    const csv = csvByUnit[unit.name];
    if (!csv) {
      gaps.push({
        unit: unit.name, kind: 'tab', fix: 'unknown',
        what: 'nothing was read for this unit — it was not compared at all',
        action: `This workbook has no tab named exactly "${unit.name}" (or that one tab failed to download — re-run once to rule that out). Usual causes: singular vs plural or a spelling difference in the tab name, or the unit belongs to a supplement and its tab lives in that other workbook.`,
      });
      continue;
    }
    const srcModels = extractModels(csv);
    const { weapons: srcWeapons, hasBlock: hasWeaponBlock } = extractWeapons(csv);
    if (Object.keys(srcModels).length === 0) {
      gaps.push({
        unit: unit.name, kind: 'block', fix: 'sheet',
        what: 'no model block found — points and stats were not compared',
        action: `On tab "${unit.name}", the header row with NAME … POINTS is missing or renamed. Restore it so the model rows can be read.`,
      });
    }
    // Only when the block is absent. A block that reads "-" is the sheet saying this unit carries
    // no weapons, which is an answer, not a gap.
    if (!hasWeaponBlock) {
      gaps.push({
        unit: unit.name, kind: 'block', fix: 'sheet',
        what: 'no weapon block found — no weapon profile was compared',
        action: `On tab "${unit.name}", the row starting with WEAPON is missing or renamed. Restore it so the weapon rows can be read.`,
      });
    }

    const appModels = [...(unit.models ?? []), ...(unit.variant_models ?? [])].map(m => m.name);
    const sheetModels = Object.keys(srcModels);
    if (sheetModels.length > 0) {
      const pairedApp = new Set<string>();
      for (const name of sheetModels) {
        if (appModels.includes(name)) continue;
        const twin = nearMatch(name, appModels.filter(m => !srcModels[m]));
        if (twin) {
          pairedApp.add(twin);
          gaps.push({
            unit: unit.name, kind: 'name-mismatch', fix: 'sheet',
            what: `model spelled "${name}" on the sheet, "${twin}" in the app`,
            action: `Almost certainly a typo in the NAME cell on tab "${unit.name}". Fix it there and this model's points and stats start being compared — right now none of them are.`,
          });
        } else {
          gaps.push({
            unit: unit.name, kind: 'missing-in-app', fix: 'code',
            what: `the sheet has a model "${name}" the app doesn't`,
            action: 'Nothing to do on the sheet — the app is missing this model and we have to add it.',
          });
        }
      }
      for (const name of appModels) {
        if (srcModels[name] || pairedApp.has(name)) continue;
        gaps.push({
          unit: unit.name, kind: 'missing-in-sheet', fix: 'unknown',
          what: `the app has a model "${name}" the sheet doesn't list`,
          action: `Check the model rows on tab "${unit.name}": either a row is missing there, or the app is carrying a model from an older version that we have to remove.`,
        });
      }
    }

    const appWeapons = (unit.weapons ?? []).map(w => w.name);
    const sheetWeapons = Object.keys(srcWeapons);
    if (sheetWeapons.length > 0) {
      // Pair the two sides on weapon + firing mode first (see findSourceWeapon) — a weapon the app
      // writes "Bolt rifle (Bolt ammo)" and the sheet "Bolt rifle - Bolt ammo" is one weapon, not
      // one missing on each side.
      const appByName = Object.fromEntries(appWeapons.map(n => [n, n]));
      const unmatchedApp = appWeapons.filter(n => !findSourceWeapon(n, srcWeapons));
      const unmatchedSheet = sheetWeapons.filter(n => !findSourceWeapon(n, appByName));

      const pairedApp = new Set<string>();
      for (const name of unmatchedSheet) {
        const twin = nearMatch(name, unmatchedApp);
        if (twin) {
          pairedApp.add(twin);
          gaps.push({
            unit: unit.name, kind: 'name-mismatch', fix: 'sheet',
            what: `weapon spelled "${name}" on the sheet, "${twin}" in the app`,
            action: `Almost certainly a typo in the WEAPON column on tab "${unit.name}". Until the two spellings match, this weapon's Range/Type/S/AP/D/Abilities are never compared.`,
          });
        } else {
          gaps.push({
            unit: unit.name, kind: 'missing-in-app', fix: 'code',
            what: `the sheet has a weapon "${name}" the app doesn't`,
            action: 'Nothing to do on the sheet — the app never got this weapon and we have to add it.',
          });
        }
      }
      const equipped = equipText(csv);
      for (const name of unmatchedApp) {
        if (pairedApp.has(name) || armoryWeapons.has(loose(name))) continue;
        // The equipment line handing the model this weapon, with no profile row for it, is the
        // sheet contradicting itself — we can say which side is wrong instead of guessing.
        const inEquipLine = equipped.includes(name.toLowerCase().replace(/s$/, ''));
        gaps.push({
          unit: unit.name, kind: 'missing-in-sheet', fix: inEquipLine ? 'sheet' : 'unknown',
          what: inEquipLine
            ? `"${name}" is handed out by the equipment line but has no WEAPON row`
            : `the app has a weapon "${name}" the sheet doesn't list`,
          action: inEquipLine
            ? `Tab "${unit.name}" says the model is equipped with "${name}", but the WEAPON block has no row for it, so its profile can never be checked. Add the row.`
            : `Check the WEAPON block on tab "${unit.name}". If the weapon really shouldn't exist, it is a leftover in the app from an older version and we remove it — that kind of leftover shows on every model's profile even though nothing can select it.`,
        });
      }
    }
  }
  return gaps.sort((a, b) => GAP_ORDER.indexOf(a.kind) - GAP_ORDER.indexOf(b.kind) || a.unit.localeCompare(b.unit));
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
        findings.push({
          unit: unit.name, kind: 'points', target: m.name, field: 'points',
          source: String(sm.points), prod: String(m.points), fix: 'unknown',
          action: `Tab "${unit.name}", row "${m.name}", POINTS column. If the sheet is right, press Apply and the app matches it immediately; if the app is right, change the cell.`,
        });
      }
      for (const [k, sv] of Object.entries(sm.stats)) {
        const pv = norm((m.stats as Record<string, string>)?.[k]);
        if (!pv) continue;                             // production doesn't track this stat here
        if (norm(sv) !== pv) {
          findings.push({
            unit: unit.name, kind: 'stat', target: m.name, field: k, source: sv, prod: pv, fix: 'unknown',
            action: `Tab "${unit.name}", row "${m.name}", column ${k}. If the sheet is right, press Apply; if the app is right, change the cell.`,
          });
        }
      }
    }

    for (const dup of duplicateModelNames(csv)) {
      findings.push({
        unit: unit.name, kind: 'sheet', target: dup, field: 'duplicate model row',
        source: 'listed more than once', prod: '—', fix: 'sheet',
        action: `Tab "${unit.name}" names more than one model row "${dup}". Only the last one is read, so the other model's points and stats are never compared — rename it to what that model actually is.`,
      });
    }

    // ── weapons: range / type / S / AP / D / abilities ──
    const { weapons: srcWeapons, duplicates } = extractWeapons(csv);
    for (const dup of duplicates) {
      findings.push({
        unit: unit.name, kind: 'sheet', target: dup, field: 'duplicate row',
        source: 'listed more than once', prod: '—', fix: 'sheet',
        action: `Tab "${unit.name}" lists "${dup}" on more than one WEAPON row. One of them is probably a different weapon that got the wrong name — only the first row is read, so the other weapon is invisible to the check. Rename it.`,
      });
    }
    for (const w of unit.weapons ?? []) {
      const sw = findSourceWeapon(w.name, srcWeapons);
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
          const why = sheetIssue(field, sv, pv);
          findings.push({
            unit: unit.name, kind: 'weapon', target: w.name, field, source: sv, prod: pv,
            fix: why ? 'sheet' : 'unknown',
            action: why
              // the sheet's own value fails a sanity check, so we can name the problem outright
              ? `Tab "${unit.name}", weapon "${w.name}", column ${field.toUpperCase()}: ${why}. Fix the cell — there is no correct value to copy into the app.`
              : `Tab "${unit.name}", weapon "${w.name}", column ${field.toUpperCase()}. If the sheet is right, press Apply and the app matches it immediately; if the app is right, change the cell.`,
          });
        }
      }
    }
  }
  return findings;
}
