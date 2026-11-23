/**
 * C'tan Shard: knows ALL the C'tan powers (nothing to pick); Time's Arrow only under Yngir, never the General disciplines;
 * and under Yngir every power's range is +6" in the power book (Print View / battle view).
 *   npx tsx scripts/check_ctan_powers.ts
 */
import { loadBundledFaction } from '../src/data/loaders';
import { withKnownPowers, knowsEveryPower } from '../src/engine/knownPowers';
import { collectPowerBook } from '../src/utils/powerBook';
type Any = any;
let bad = 0; const eq = (l: string, a: unknown, b: unknown) => { if (JSON.stringify(a) !== JSON.stringify(b)) { bad++; console.log('FAIL', l, JSON.stringify(a), '!=', JSON.stringify(b)); } else console.log('ok  ', l); };
(async () => {
  const nec: Any = await loadBundledFaction('necrons');
  const u = nec.units["C'tan Shard"];
  eq('the shard knows every power', knowsEveryPower(u), true);
  const mk = (flag: boolean): Any => ({ id: 'x', unitName: "C'tan Shard", slot: 'Elites', size: 1, ctanYngirUpgrade: flag, optionQty: {}, armory: [], traits: [], powers: [], prayers: [], pacts: [] });
  const plain = withKnownPowers(mk(false), u, nec, '');
  const yngir = withKnownPowers(mk(true), u, nec, 'Yngir');
  eq('plain: 5 powers, no Time\'s Arrow, no General', plain.powers.map((p: Any) => p.powerName).some((n: string) => /arrow|smite/i.test(n)), false);
  eq('plain count', plain.powers.length, 5);
  eq('Yngir count', yngir.powers.length, 6);
  eq('Yngir has Time\'s Arrow', yngir.powers.some((p: Any) => /arrow/i.test(p.powerName)), true);
  // leaving Yngir drops it again
  eq('leaving Yngir drops Time\'s Arrow', withKnownPowers({ ...yngir, ctanYngirUpgrade: false }, u, nec, '').powers.length, 5);
  // Power book ranges
  const ranges = (it: Any) => collectPowerBook([it], nec).powers.flatMap(d => d.entries.map(e => e.meta.match(/\d+"/)?.[0]));
  const rp = ranges(plain), ry = ranges(yngir);
  eq('plain ranges are 12"', rp, ['12"','12"','12"','12"','12"']);
  eq('Yngir ranges are 18" (+6)', ry, Array(6).fill('18"'));
  console.log('plain ranges', rp.join(' '), '| yngir ranges', ry.join(' '));
  process.exit(bad ? 1 : 0);
})();
