/** GH#255: a Crusaders unit is free of the Elite slot for each Missionary OR Preacher (Sororitas 1.2). Only the Preacher was counted.
 *    npx tsx scripts/check_crusaders_missionary.ts */
import { FACTION_LOADERS } from '../src/data/loaders';
import { computeCrusadersFreeSlots } from '../src/engine/validators';
type Any = any;
(async () => {
  const d: Any = await (FACTION_LOADERS as Any)['adeptus_sororitas']();
  const e = (id: string, unitName: string): Any => ({ id, unitName, size: 1, optionQty: {}, armory: [], traits: [], powers: [], prayers: [], pacts: [] });
  let f = 0;
  const free = (army: Any[]) => computeCrusadersFreeSlots(army, d).elites;
  if (free([e('c', 'Crusaders')]) !== 0) { f++; console.log('  WRONG Crusaders alone should still occupy an Elite slot'); }
  if (free([e('c', 'Crusaders'), e('m', 'Missionary')]) !== 1) { f++; console.log('  WRONG a Missionary should free one Crusaders unit'); }
  if (free([e('c', 'Crusaders'), e('c2', 'Crusaders'), e('m', 'Missionary')]) !== 1) { f++; console.log('  WRONG one Missionary frees only one of two Crusaders'); }
  if (free([e('c', 'Crusaders'), e('p', 'Preacher')]) !== 1) { f++; console.log('  WRONG the Preacher must still free one'); }
  console.log(f ? `\n${f} FAILURE(S)` : '\nOK  Missionary and Preacher both free a Crusaders unit');
  process.exit(f ? 1 : 0);
})();
