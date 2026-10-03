/** npx tsx scripts/_tts_one.ts <faction> "<unit>" '<optionQty json>' [size] */
import { FACTION_LOADERS } from '../src/data/loaders';
import { resolveUnitProfile } from '../src/engine/resolver';
import { buildTtsExport } from '../src/utils/ttsExport';
type Any = any;
(async () => {
  const [fk, uname, oq = '{}', sz, msz] = process.argv.slice(2);
  const d: Any = await (FACTION_LOADERS as Any)[fk]();
  const u = d.units[uname];
  const multi = u.models.length > 1;
  const sizes = msz ? JSON.parse(msz) : multi ? Object.fromEntries(u.models.map((m: Any) => [m.name, m.min])) : undefined;
  const size = sz ? Number(sz) : multi ? Object.values(sizes as Any).reduce((a: any, b: any) => a + b, 0) : (u.default_size || 1);
  const item: Any = { id: 'x', unitName: uname, slot: u.slot, size, optionQty: JSON.parse(oq),
    ...(sizes ? { modelSizes: sizes } : {}), armory: [], traits: [], powers: [], prayers: [], pacts: [] };
  const state: Any = { army: [item], traits: {}, traitPool: [], archetype: null, legacy: null, legacy2: null,
    hqMark: null, engagement: 'pitched', pointLimit: 2000, armyName: 't', alliedFaction: null, alliedArchetype: null };
  console.log('models:', u.models.map((m: Any) => `${m.name} ${m.min}-${m.max}`).join(' | '), '| size', size);
  console.log('equipped_with:', u.equipped_with);
  (u.option_groups ?? []).forEach((g: Any, gi: number) => console.log(`  og${gi} ${g.header} :: ${(g.choices ?? []).map((c: Any, ci: number) => `${ci}=${c.name}`).join(', ')}`));
  const r: Any = resolveUnitProfile(item, u, state, d);
  console.log('modelsToShow:', r.modelsToShow.map((m: Any) => m.name), 'modelCounts:', r.modelCounts);
  for (const g of r.weaponGroups) console.log(' group', JSON.stringify(g.label), g.count, [...(g.countOverrides ?? [])], g.weapons.map((w: Any) => w.name));
  try {
    const out = buildTtsExport(state, d).units[0];
    console.log(JSON.stringify({ exact: out.loadoutsExact, notes: out.loadoutNotes, models: out.models.map(m => ({ n: m.name, c: m.count, l: m.loadoutName, w: m.modelWeapons.map(x => x.weaponId + (x.count ? 'x' + x.count : '')) })) }, null, 1));
  } catch (e) { console.log('THREW', (e as Error).stack); }
})();
