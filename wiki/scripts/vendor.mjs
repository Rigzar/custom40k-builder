// Copies the canonical data files this pilot needs into wiki/src/vendor/, mirroring their
// repo-root-relative paths exactly so the copied files' own internal relative imports keep
// working unmodified. Runs fresh before every dev/build — never hand-edited, never committed
// (wiki/.gitignore excludes src/vendor/) — so the wiki can be deployed as a single self-contained
// Vercel project (its own Root Directory) while still reading the live canonical data, not a
// stale duplicate.
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
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

const copies = [
  ['src/types/data.ts', 'src/types/data.ts'],
  ['src/data/coreRules.ts', 'src/data/coreRules.ts'],
  ['data/parsed/orks', 'data/parsed/orks'],
  ['data/parsed/necrons', 'data/parsed/necrons'],
];

for (const [from, to] of copies) {
  const src = join(repoRoot, from);
  const dest = join(vendorRoot, to);
  mkdirSync(dirname(dest), { recursive: true });
  cpSync(src, dest, { recursive: true });
}

console.log(`[vendor] copied ${copies.length} canonical source paths into ${vendorRoot}`);
