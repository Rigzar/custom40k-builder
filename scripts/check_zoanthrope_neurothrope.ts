/**
 * Tyranids 1.10: "For every three models, one Zoanthrope may be upgraded to a Neurothrope for +25 points."
 *   npx tsx scripts/check_zoanthrope_neurothrope.ts
 */
const mem: Record<string, string> = {};
(globalThis as any).localStorage = { getItem: (k: string) => mem[k] ?? null, setItem: (k: string, v: string) => { mem[k] = v; }, removeItem: (k: string) => { delete mem[k]; } };
type Any = any;
(async () => {
  const { FACTION_LOADERS } = await import('../src/data/loaders');
  const { computeUnitPoints, variantPromotionCap } = await import('../src/engine/points');
  const d: Any = await (FACTION_LOADERS as Any).tyranids();
  const u = d.units['Zoanthrope Brood'];
  const gi = u.option_groups.findIndex((g: Any) => g.variant_link === 'Neurothrope');
  const g = u.option_groups[gi];
  let bad = 0;
  const ok = (c: boolean, msg: string) => { if (!c) { bad++; console.log('FAIL', msg); } else console.log('ok  ', msg); };
  const cap = (n: number) => variantPromotionCap(g, n);
  ok(cap(1) === 0 && cap(2) === 0 && cap(3) === 1 && cap(5) === 1 && cap(6) === 2 && cap(9) === 3, `caps by squad size: 1->${cap(1)} 3->${cap(3)} 6->${cap(6)} 9->${cap(9)}`);
  const pts = (size: number, qty: number) => computeUnitPoints({ id: 'x', unitName: 'Zoanthrope Brood', slot: u.slot, size, optionQty: qty ? { [gi]: { __inline: qty } } : {}, armory: [], traits: [], powers: [], prayers: [], pacts: [] } as Any, u, '', 'Tyranids', 4000);
  ok(pts(3, 1) - pts(3, 0) === 25, `one Neurothrope costs +25 (got ${pts(3, 1) - pts(3, 0)})`);
  ok(pts(6, 2) - pts(6, 0) === 50, `two Neurothropes in six cost +50 (got ${pts(6, 2) - pts(6, 0)})`);
  ok(pts(3, 3) === pts(3, 1), 'asking for three in a squad of three is clamped to the one it allows');
  console.log(bad ? `${bad} FAILED` : 'ok');
  process.exit(bad ? 1 : 0);
})();
