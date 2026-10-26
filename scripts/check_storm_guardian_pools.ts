/**
 * GH#257: Storm Guardians. One group swaps the chainsword AND the pistol together, two more swap only the chainsword and only the pistol.
 * The cross-group pool check pooled every group sharing ANY weapon, so 4 + 6 chainsword swaps plus 6 pistol swaps read as "16 chainsword
 * swaps, only 10 models". Each weapon has its own pool: 4 + 6 = 10 chainswords and 4 + 6 = 10 pistols is a legal full squad.
 *   npx tsx scripts/check_storm_guardian_pools.ts
 */
import { FACTION_LOADERS } from '../src/data/loaders';
import { validateArmy } from '../src/engine/validators';

type Any = any;
(async () => {
  const d: Any = await (FACTION_LOADERS as Any)['eldar']();
  const u: Any = d.units['Storm Guardians'];
  let failures = 0;
  const base: Any = { traits: {}, traitPool: [], archetype: null, legacy: null, legacy2: null, hqMark: null, engagement: 'pitched', pointLimit: 2000, alliedFaction: null, alliedArchetype: null };
  const run = (optionQty: Any) => {
    const item: Any = { id: 'x', unitName: u.name, slot: u.slot, size: 10, optionQty, armory: [], traits: [], powers: [], prayers: [], pacts: [] };
    const res: Any = validateArmy({ ...base, army: [item] }, d, d);
    return ((res?.items ?? res) as Any[]).filter(i => /swaps selected across multiple options/.test(String(i.text)));
  };
  // group 1: choice 0 (Aeldari flamer) x4; group 2 (Power sword) x6; group 3 (Sun pistol) x6
  if (run({ 1: { 0: 4 }, 2: { 0: 6 }, 3: { 0: 6 } }).length) { failures++; console.log('  WRONG a full squad (4 special + 6 power swords + 6 sun pistols) is flagged'); }
  if (!run({ 1: { 0: 4 }, 2: { 0: 10 }, 3: { 0: 6 } }).length) { failures++; console.log('  WRONG 4 + 10 chainsword swaps on ten models is not flagged, the probe measures nothing'); }
  console.log(failures ? `\n${failures} FAILURE(S)` : '\nOK  one pool per replaced weapon');
  process.exit(failures ? 1 : 0);
})();
