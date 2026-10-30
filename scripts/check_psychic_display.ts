/**
 * Guard: a selected psychic power must be able to TELL YOU WHAT IT DOES, everywhere it is shown.
 *
 * Reported 2026-09-20 by a player via Rigzar: "TODOS los poderes psiquicos en la app no muestran
 * la info completa (distancias etc), ni en las hojas para imprimir ni nada." True, and it had TWO
 * independent causes, which is why the previous fix (v1.70, prayers and pacts) did not cover it:
 *
 *   A. `findPowerByName` searched `data.prayers`, `data.pacts` and `data.disciplines` only.
 *      GENERAL_DISCIPLINES -- the six disciplines EVERY psyker in the game may pick from -- lives
 *      in its own module and is not part of FactionData, so all 31 of its powers resolved to
 *      nothing in all 19 factions: 589 name/faction pairs with no range, cast value, target,
 *      duration or effect anywhere in the app.
 *   B. The UNIT CARD never ran powers through the formatter at all. v1.70 gave prayers and pacts
 *      their full line and left the powers block printing `name (discipline)`.
 *
 * PART 1 asserts the data path: every power a player can actually select resolves to a non-empty
 * meta line. PART 2 asserts the RENDER SITES, because part 1 stayed green all the while the unit
 * card was ignoring the formatter -- a library being correct proves nothing about its callers
 * (the lesson from check_ward_save.ts). Comments are stripped before searching for exactly the
 * same reason that guard needed four attempts: this file's own prose names the functions it looks
 * for, and so do the comments in the components.
 *
 *   npx tsx scripts/check_psychic_display.ts
 */
import * as fs from 'fs';
import { GENERAL_DISCIPLINES } from '../src/data/generalDisciplines';
import { findPowerByName, powerMetaLine } from '../src/utils/psychicFormat';

const FACTIONS = ['adeptus_custodes','adeptus_mechanicus','adeptus_sororitas','assassins','chaos_daemons',
  'chaos_space_marines','dark_eldar','eldar','genestealer_cults','grey_knights','harlequins','imperial_guard',
  'inquisition','leagues_of_votann','necrons','orks','space_marines','tau_empire','tyranids'];

type Any = any;
let failures = 0;
const fail = (msg: string) => { failures++; console.log('  WRONG ' + msg); };

/** Strip // and block comments so a guard cannot pass on the strength of a comment. */
function code(path: string): string {
  return fs.readFileSync(path, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1 ');
}

(async () => {
  // ── PART 1: every selectable power resolves to a meta line ──────────────────
  let checked = 0, unresolved = 0, emptyMeta = 0;
  for (const f of FACTIONS) {
    let disciplines: Any = {}, prayers: Any = [];
    try { disciplines = (await import(`../data/parsed/${f}/psychic/disciplines.json`)).default ?? {}; } catch {}
    try { prayers = (await import(`../data/parsed/${f}/psychic/prayers.json`)).default ?? []; } catch {}
    const data: Any = { faction: f, prayers, pacts: [], disciplines };

    const pools: [string, Any[]][] = [
      ...Object.entries<Any>(disciplines).map(([d, ps]) => [`${f}/${d}`, ps] as [string, Any[]]),
      ...Object.entries<Any>(GENERAL_DISCIPLINES).map(([d, ps]) => [`${f}/GENERAL ${d}`, ps] as [string, Any[]]),
    ];
    for (const [label, powers] of pools) {
      for (const p of powers) {
        checked++;
        const hit = findPowerByName(p.name, data);
        if (!hit) { fail(`${label} / "${p.name}" resolves to nothing`); unresolved++; continue; }
        if (!powerMetaLine(hit)) { fail(`${label} / "${p.name}" resolves but its meta line is empty`); emptyMeta++; }
      }
    }
  }

  // ── PART 2: the three render sites actually call the formatter FOR POWERS ───
  const card = code('src/components/UnitCard.tsx');
  if (!/powerMetaByName\(\s*p\.powerName/.test(card))
    fail('UnitCard.tsx: the powers block does not pass p.powerName through powerMetaByName');
  if (!/powerEffectByName\(\s*p\.powerName/.test(card))
    fail('UnitCard.tsx: the powers block does not pass p.powerName through powerEffectByName');

  // The sheet and the battle view no longer format a power themselves: both print the book of powers (utils/powerBook.ts), whose entries come from powerMetaLine.
  const print = code('src/components/PrintView.tsx');
  if (!/collectPowerBook\(/.test(print))
    fail('PrintView.tsx: no call to collectPowerBook');

  const play = code('src/components/PlayView.tsx');
  if (!/collectPowerBook\(/.test(play))
    fail('PlayView.tsx (the battle view): no call to collectPowerBook');

  const book = code('src/utils/powerBook.ts');
  if (!/powerMetaLine\(/.test(book))
    fail('powerBook.ts: the book entries are not built with powerMetaLine');

  const fmt = code('src/utils/psychicFormat.ts');
  if (!/Object\.values\(\s*GENERAL_DISCIPLINES\s*\)/.test(fmt))
    fail('psychicFormat.ts: GENERAL_DISCIPLINES is not one of the lookup pools');

  console.log(`\nchecked ${checked} selectable powers across ${FACTIONS.length} factions`);
  console.log(`  unresolvable        : ${unresolved}`);
  console.log(`  resolved, meta empty: ${emptyMeta}`);
  console.log(failures === 0 ? '\nALL OK' : `\n${failures} FAILURES`);
  process.exit(failures === 0 ? 0 : 1);
})();
