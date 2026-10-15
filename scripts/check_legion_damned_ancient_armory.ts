/** GH#241: the Legion of the Damned Ancient has Armory access like the Sergeant: npx tsx scripts/check_legion_damned_ancient_armory.ts */
import { loadBundledFaction } from '../src/data/loaders';
import { championArmoryBuyers, extraArmoryHolders, equipTargetsModel } from '../src/lib/battleProfile';
type Any = any;
let bad = 0; const eq = (l: string, a: unknown, b: unknown) => { if (JSON.stringify(a) !== JSON.stringify(b)) { bad++; console.log('FAIL', l, JSON.stringify(a), '!=', JSON.stringify(b)); } else console.log('ok  ', l); };
(async () => {
  const sm: Any = await loadBundledFaction('space_marines');
  const u = sm.units['Legion of the Damned'];
  eq('the Ancient is an extra holder', extraArmoryHolders(u).map((m: Any) => m.name), ['Legionnaire Ancient']);
  eq('Sergeant alone: one buyer', championArmoryBuyers(u, { Legionnaire: 4, 'Legionnaire Sergeant': 1, 'Legionnaire Ancient': 0 }), 1);
  eq('Sergeant + Ancient: two buyers', championArmoryBuyers(u, { Legionnaire: 4, 'Legionnaire Sergeant': 1, 'Legionnaire Ancient': 1 }), 2);
  eq('the Ancient takes Armory stat changes', equipTargetsModel(u, u.models[2]), true);
  eq('a Legionnaire does not', equipTargetsModel(u, u.models[0]), false);
  const tac = sm.units['Tactical Squad'];
  eq('an ordinary squad has no extra holder', extraArmoryHolders(tac).length, 0);
  process.exit(bad ? 1 : 0);
})();
