/**
 * The TTS export carries each unit's Ward Save as a field ("5+" or null), derived like the unit card and Print View do.
 * Asked for on Discord: the value used to live only inside ability / wargear text, so the TTS script could not show it.
 *   npx tsx scripts/check_tts_ward_save.ts
 */
const mem: Record<string, string> = {};
(globalThis as any).localStorage = { getItem: (k: string) => mem[k] ?? null, setItem: (k: string, v: string) => { mem[k] = v; }, removeItem: (k: string) => { delete mem[k]; } };
type Any = any;
(async () => {
  const { FACTION_LOADERS } = await import('../src/data/loaders');
  const { buildTtsExport } = await import('../src/utils/ttsExport');
  let bad = 0;
  const ok = (c: boolean, msg: string) => { if (!c) { bad++; console.log('FAIL', msg); } else console.log('ok  ', msg); };

  const one = async (fk: string, unit: string, armory: string[] = []) => {
    const d: Any = await (FACTION_LOADERS as Any)[fk]();
    const u = d.units[unit];
    const multi = u.models.length > 1;
    const sizes = multi ? Object.fromEntries(u.models.map((m: Any) => [m.name, m.min])) : undefined;
    const size = multi ? Object.values(sizes as Any).reduce((a: any, b: any) => a + b, 0) : (u.default_size || 1);
    const pools: Any[] = [d.armory_general, ...Object.values(d.armory_legions ?? {}), ...Object.values(d.armory_marks ?? {})];
    const bought = armory.map(name => {
      for (const p of pools) for (const sec of ['equipment', 'weapons'] as const) {
        const hit = (p?.[sec] ?? []).find((i: Any) => i.name.replace(/[ᵀᴹᴺᴻˣᴼˢᵂᴽ]/g, '').trim() === name);
        if (hit) return { id: 'a' + name, itemName: hit.name, source: 'General', section: sec, points: 0, isCharacter: !!u.is_character };
      }
      throw new Error('armory item not found: ' + name);
    });
    const item: Any = { id: 'x', unitName: unit, slot: u.slot, size, optionQty: {}, ...(sizes ? { modelSizes: sizes } : {}),
      armory: bought, traits: [], powers: [], prayers: [], pacts: [] };
    const state: Any = { army: [item], traits: {}, traitPool: [], archetype: null, legacy: null, legacy2: null, hqMark: null,
      engagement: 'pitched', pointLimit: 3000, armyName: 't', alliedFaction: null, alliedArchetype: null };
    return buildTtsExport(state, d).units[0];
  };

  // a datasheet ability ("Daemon" = 5+ ward)
  const dae = await one('chaos_daemons', 'Bloodletters');
  ok(dae.wardSave === '5+', `Bloodletters (Daemon) wardSave is "5+" (got ${JSON.stringify(dae.wardSave)})`);
  ok(dae.models.every((m: Any) => m.wardSave === '5+'), 'every Bloodletters model row carries it too');
  // a unit with none
  const none = await one('space_marines', 'Tactical Squad');
  ok(none.wardSave === null, `Tactical Squad has no ward save (got ${JSON.stringify(none.wardSave)})`);
  ok(none.models.every((m: Any) => m.wardSave === null), 'and neither do its model rows');
  // bought equipment (Terminator armor 5+ on a Chaos Lord-type character)
  try {
    const lt = await one('chaos_space_marines', 'Chaos Lieutenant', ['Terminator armor']);
    ok(lt.wardSave === '5+', `a Chaos Lieutenant in Terminator armor gets "5+" from the Armory (got ${JSON.stringify(lt.wardSave)})`);
  } catch (e) { bad++; console.log('FAIL', (e as Error).message); }
  console.log(bad ? `${bad} FAILED` : 'ok');
  process.exit(bad ? 1 : 0);
})();
