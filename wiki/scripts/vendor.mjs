// Copies the canonical data files this pilot needs into wiki/src/vendor/, mirroring their
// repo-root-relative paths exactly so the copied files' own internal relative imports keep
// working unmodified. Runs fresh before every dev/build — never hand-edited, never committed
// (wiki/.gitignore excludes src/vendor/) — so the wiki can be deployed as a single self-contained
// Vercel project (its own Root Directory) while still reading the live canonical data, not a
// stale duplicate.
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const wikiRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const repoRoot = dirname(wikiRoot);
const vendorRoot = join(wikiRoot, 'src', 'vendor');

// On Vercel, only wiki/ itself is uploaded (deploying from inside this folder) — the sibling
// src/ and data/ folders this script normally copies from don't exist remotely. In that case
// src/vendor/ must already be present (vendored locally and uploaded as part of the deploy),
// so just leave it alone instead of wiping it out.
if (!existsSync(join(repoRoot, 'src', 'types', 'data.ts'))) {
  console.log('[vendor] repo root not found (remote build) — using the vendor/ already in the deploy bundle');
  process.exit(0);
}

rmSync(vendorRoot, { recursive: true, force: true });

const FACTIONS = [
  'chaos_space_marines', 'chaos_daemons', 'space_marines', 'imperial_guard', 'adeptus_mechanicus',
  'adeptus_custodes', 'adeptus_sororitas', 'grey_knights', 'inquisition', 'assassins', 'tau_empire',
  'necrons', 'orks', 'eldar', 'dark_eldar', 'genestealer_cults', 'harlequins', 'leagues_of_votann',
  'tyranids',
];

const copies = [
  ['src/types/data.ts', 'src/types/data.ts'],
  ['src/data/coreRules.ts', 'src/data/coreRules.ts'],
  ...FACTIONS.map(f => [`data/parsed/${f}`, `data/parsed/${f}`]),
  ['data/parsed/_supplements', 'data/parsed/_supplements'],
];

for (const [from, to] of copies) {
  const src = join(repoRoot, from);
  const dest = join(vendorRoot, to);
  mkdirSync(dirname(dest), { recursive: true });
  cpSync(src, dest, { recursive: true });
}

// The codex version printed on each faction hub used to be a second, hand-typed map inside the
// wiki, and 11 of its 19 entries had gone stale (Space Marines read 1.01 against a real 1.05).
// Generate it from the app's own catalogue instead, in the same pass that copies everything else,
// so bumping a version in one place is the whole job.
//
// `factionCatalog.ts` is not vendored wholesale because it imports a type from `src/i18n`, which
// would drag zustand and the entire translation table into a wiki that needs neither.
const catalogue = readFileSync(join(repoRoot, 'src/data/factionCatalog.ts'), 'utf8');
const versions = {};
for (const m of catalogue.matchAll(/key: '([a-z_]+)',[^}]*?version: '([\d.]+)'/g)) versions[m[1]] = m[2];
if (Object.keys(versions).length < 15) {
  throw new Error(`[vendor] parsed only ${Object.keys(versions).length} faction versions from `
    + 'factionCatalog.ts — the catalogue\'s shape changed and the wiki would print stale numbers');
}
writeFileSync(join(vendorRoot, 'factionVersions.json'), JSON.stringify(versions, null, 2) + '\n');

console.log(`[vendor] copied ${copies.length} canonical source paths into ${vendorRoot}`);
console.log(`[vendor] generated factionVersions.json (${Object.keys(versions).length} factions)`);
