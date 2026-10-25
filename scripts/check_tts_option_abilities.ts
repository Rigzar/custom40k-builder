/**
 * Unwise (Discord): a Malanthrope that bought "Regeneration" (a Special Biomorph) showed no Regeneration in the army JSON the
 * Tabletop Simulator mod reads. An option choice's own effect.grants_abilities is `rp.optionAbilities`; the card, the print view
 * and the battle profile list it, the TTS export did not.   npx tsx scripts/check_tts_option_abilities.ts
 */
const mem: Record<string, string> = {};
(globalThis as any).localStorage = { getItem: (k: string) => mem[k] ?? null, setItem: (k: string, v: string) => { mem[k] = v; }, removeItem: (k: string) => { delete mem[k]; } };
type Any = any;
(async () => {
  const { FACTION_LOADERS } = await import('../src/data/loaders');
  const { buildTtsExport } = await import('../src/utils/ttsExport');
  const d: Any = await (FACTION_LOADERS as Any).tyranids();
  const u = d.units['Malanthrope'];
  let bad = 0;
  const ok = (c: boolean, msg: string) => { if (!c) { bad++; console.log('FAIL', msg); } else console.log('ok  ', msg); };
  const exportFor = (optionQty: Any) => {
    const item: Any = { id: 'x', unitName: 'Malanthrope', slot: u.slot, size: 1, optionQty, armory: [], traits: [], powers: [], prayers: [], pacts: [] };
    const state: Any = { army: [item], traits: {}, traitPool: [], archetype: null, legacy: null, legacy2: null, hqMark: null, engagement: 'pitched', pointLimit: 3000, armyName: 't', alliedFaction: null };
    return buildTtsExport(state, d).units[0];
  };
  const gi = u.option_groups.findIndex((g: Any) => g.choices.some((c: Any) => c.name === 'Regeneration'));
  const ci = u.option_groups[gi].choices.findIndex((c: Any) => c.name === 'Regeneration');
  const plain = exportFor({});
  const regen = exportFor({ [gi]: { [ci]: 1 } });
  ok(!plain.abilities.some((a: string) => /^Regeneration/.test(a)), 'a Malanthrope that bought nothing lists no Regeneration');
  ok(regen.abilities.some((a: string) => /^Regeneration/.test(a)), `a Malanthrope with the Regeneration biomorph lists it (got ${JSON.stringify(regen.abilities.filter((a: string) => /regen/i.test(a)))})`);
  ok(regen.ruleNames.some((n: string) => /regeneration/i.test(n)), 'and the rule name reaches ruleNames, so the mod can show its text');
  console.log(bad ? `${bad} FAILED` : 'ok');
  process.exit(bad ? 1 : 0);
})();
