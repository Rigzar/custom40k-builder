/**
 * A unit the codex moved to another slot is moved in saved lists too.
 *
 * Tyranids 1.09 moved the Trygon from Fast Attack to Heavy Support. Slot counts read the slot stored
 * on each roster entry, so a list saved before kept the Trygon in Fast Attack while the catalogue
 * offered it under Heavy Support. Asserted through the same function the store runs on load.
 *
 *   npx tsx scripts/check_unit_slot_moves.ts
 */
import { applyUnitRenames } from '../src/engine/unitRenames';

const fails: string[] = [];
const e = (unitName: string, slot: string) => ({ id: unitName + slot, unitName, slot });

const saved = [e('Trygon', 'Fast Attack'), e('Gargoyle Brood', 'Fast Attack'), e('Hive Tyrant', 'HQ')];
const out = applyUnitRenames('Tyranids', saved);
if (out[0].slot !== 'Heavy Support') fails.push(`the saved Trygon is in ${out[0].slot}, want Heavy Support`);
if (out[1].slot !== 'Fast Attack') fails.push('another Fast Attack unit was moved');
if (out[2].slot !== 'HQ') fails.push('an HQ was moved');

const already = [e('Trygon', 'Heavy Support')];
if (applyUnitRenames('Tyranids', already) !== already) fails.push('a list already correct was rebuilt (the store would see a change)');

const promoted = [e('Trygon', 'HQ')];
if (applyUnitRenames('Tyranids', promoted)[0].slot !== 'HQ') fails.push('a Trygon the archetype put in HQ was moved');

const other = [e('Trygon', 'Fast Attack')];
if (applyUnitRenames('Space Marines', other)[0].slot !== 'Fast Attack') fails.push('another faction\'s unit named Trygon was moved');

for (const f of fails) console.log('  ' + f);
if (fails.length) { console.error(`\nFAIL: ${fails.length} problem(s).`); process.exit(1); }
console.log('OK — a unit the codex moved is moved in saved lists, and only that unit.');
