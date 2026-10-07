/**
 * A hand-made correction must not hide what the unit update wrote from the sheet.
 *
 * 2026-10-07: Biovore Brood updated to 41 points in the file, and an admin override from 21 September
 * ("Biovore = 110") kept every player at 110. The unit files are regenerated from the sheets, so for
 * those factions a points/stat/weapon override can only repeat the file or contradict it, and the
 * file wins. Upgrade costs and the supplements keep their overrides.
 *
 *   npx tsx scripts/check_overrides_do_not_hide_sheet.ts
 */
import { applyDataOverrides, type DataOverride } from '../src/engine/dataOverrides';

const fails: string[] = [];
const mk = () => ({
  units: {
    'Biovore Brood': {
      models: [{ name: 'Biovore', points: 41, stats: { S: '4' } }], variant_models: [], min_cost: 41,
      weapons: [{ name: 'Spore mine launcher', abilities: 'Blast(4)' }],
      option_groups: [{ choices: [{ name: 'Aerial spore mine', points: 37 }] }],
    },
  },
}) as any;
const O = (o: Partial<DataOverride>): DataOverride => ({ unit: 'Biovore Brood', kind: 'points', target: 'Biovore', field: 'points', value: '110', ...o });

let d = mk();
applyDataOverrides(d, [O({})], true);
if (d.units['Biovore Brood'].models[0].points !== 41 || d.units['Biovore Brood'].min_cost !== 41) fails.push('a stale points override hid the sheet value for a sheet-owned faction');

d = mk(); applyDataOverrides(d, [O({ kind: 'stat', target: 'Biovore', field: 'S', value: '9' })], true);
if (d.units['Biovore Brood'].models[0].stats.S !== '4') fails.push('a stat override hid the sheet value');

d = mk(); applyDataOverrides(d, [O({ kind: 'weapon', target: 'Spore mine launcher', field: 'abilities', value: 'Barrage' })], true);
if (d.units['Biovore Brood'].weapons[0].abilities !== 'Blast(4)') fails.push('a weapon override hid the sheet value');

d = mk(); applyDataOverrides(d, [O({ kind: 'option', target: 'Aerial spore mine', field: 'points', value: '40' })], true);
if (d.units['Biovore Brood'].option_groups[0].choices[0].points !== 40) fails.push('an upgrade-cost override stopped applying (the script does not own options)');

d = mk(); applyDataOverrides(d, [O({})], false);
if (d.units['Biovore Brood'].models[0].points !== 110) fails.push('a supplement\'s correction stopped applying');

for (const f of fails) console.log('  ' + f);
if (fails.length) { console.error(`\nFAIL: ${fails.length} problem(s).`); process.exit(1); }
console.log('OK — for sheet-owned factions the file wins over points/stat/weapon overrides; options and supplements keep theirs.');
