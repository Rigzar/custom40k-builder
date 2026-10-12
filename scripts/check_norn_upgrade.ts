/**
 * GH#235: the Tyranid Norn's "Norn Emissary" upgrade is printed as a bare name with its rules on the lines below it
 * (Psyker 2 powers, Warp Barrier 4+ ward). It showed as an ability that did nothing when clicked, and the lines under it
 * (and the 4+ ward) applied to a Norn that had not bought it.   npx tsx scripts/check_norn_upgrade.ts
 */
const mem: Record<string, string> = {};
(globalThis as any).localStorage = { getItem: (k: string) => mem[k] ?? null, setItem: (k: string, v: string) => { mem[k] = v; }, removeItem: (k: string) => { delete mem[k]; } };
type Any = any;
(async () => {
  const { FACTION_LOADERS } = await import('../src/data/loaders');
  const { buildTtsExport } = await import('../src/utils/ttsExport');
  const { hiddenUpgradeLines } = await import('../src/lib/upgradeGroups');
  const d: Any = await (FACTION_LOADERS as Any).tyranids();
  const u = d.units['Norn'];
  let bad = 0;
  const ok = (c: boolean, msg: string) => { if (!c) { bad++; console.log('FAIL', msg); } else console.log('ok  ', msg); };
  const exportFor = (optionQty: Any) => {
    const item: Any = { id: 'x', unitName: 'Norn', slot: u.slot, size: 1, optionQty, armory: [], traits: [], powers: [], prayers: [], pacts: [] };
    const state: Any = { army: [item], traits: {}, traitPool: [], archetype: null, legacy: null, legacy2: null, hqMark: null, engagement: 'pitched', pointLimit: 3000, armyName: 't', alliedFaction: null, alliedArchetype: null };
    return buildTtsExport(state, d).units[0];
  };
  const gi = u.option_groups.findIndex((g: Any) => g.choices.some((c: Any) => c.name === 'Norn Emissary'));
  const plain = exportFor({});
  const emissary = exportFor({ [gi]: { 0: 1 } });
  ok(plain.wardSave === '5+', `a Norn without the upgrade has the 5+ Psychic Barrier, not 4+ (got ${plain.wardSave})`);
  ok(emissary.wardSave === '4+', `a Norn Emissary has the 4+ Warp Barrier (got ${emissary.wardSave})`);
  ok(!plain.abilities.some((a: string) => /^Warp Barrier/.test(a)) && !plain.abilities.includes('Norn Emissary'), 'the plain Norn lists neither Warp Barrier nor the bare header');
  ok(emissary.abilities.some((a: string) => /^Warp Barrier/.test(a)) && !emissary.abilities.includes('Norn Emissary'), 'the Emissary lists Warp Barrier but not the empty header');
  const hidden = hiddenUpgradeLines(u, { optionQty: {} });
  ok(hidden.includes('Norn Emissary') && hidden.length === 3, `three lines hidden while unbought (got ${hidden.length})`);
  console.log(bad ? `${bad} FAILED` : 'ok');
  process.exit(bad ? 1 : 0);
})();
