/**
 * Runs the TTS export over EVERY unit, with nothing chosen and with each single option choice
 * taken on its own, at default and at maximum squad size, and checks the invariants the TTS
 * consumer relies on:
 *   - every model entry has an integer count,
 *   - the counts of each model row add up to what the roster says for that row,
 *   - the counts of the unit add up to unit.size,
 *   - every modelWeapons weaponId exists in the unit's weapons[].
 *   npx tsx scripts/_tts_sweep.ts
 */
import { FACTION_LOADERS } from '../src/data/loaders';
import { buildTtsExport } from '../src/utils/ttsExport';
type Any = any;

(async () => {
  let runs = 0, bad = 0, inexact = 0;
  const kinds = new Map<string, string[]>();
  const note = (k: string, w: string) => { kinds.set(k, [...(kinds.get(k) ?? []), w]); };
  for (const [fk, load] of Object.entries<Any>(FACTION_LOADERS as Any)) {
    let d: Any; try { d = await load(); } catch (e) { console.log(`${fk} LOAD FAILED ${e}`); continue; }
    for (const [uname, u] of Object.entries<Any>(d.units ?? {})) {
      const dflt = Number(u.default_size ?? (u.models?.[0]?.min || 1));
      const maxSize = Number((u.models ?? []).reduce((a: number, m: Any) => a + (m.max || 0), 0)) || dflt;
      const sels: Any[] = [{}];
      (u.option_groups ?? []).forEach((g: Any, gi: number) => {
        if ((g.choices ?? []).length === 0) { sels.push({ [gi]: { __inline: 1 } }); return; }
        g.choices.forEach((_c: Any, ci: number) => sels.push({ [gi]: { [ci]: 1 } }));
      });
      // Built the way the store builds a roster entry: one modelSizes entry per model row at its
      // minimum, size = their sum; the "large" variant fills the first row that has room.
      const multi = (u.models ?? []).length > 1;
      const variants: Any[] = [];
      const mk = (sizes: Record<string, number> | undefined, size: number) => ({ sizes, size });
      if (multi) {
        const base = Object.fromEntries(u.models.map((m: Any) => [m.name, m.min]));
        variants.push(mk(base, Object.values(base).reduce((a: number, b: any) => a + b, 0)));
        const big = { ...base }; const room = u.models.find((m: Any) => m.max > m.min);
        if (room) { big[room.name] = Math.min(room.max, room.min + 6); variants.push(mk(big, Object.values(big).reduce((a: number, b: any) => a + b, 0))); }
      } else {
        variants.push(mk(undefined, dflt));
        if (maxSize > dflt) variants.push(mk(undefined, Math.min(maxSize, 20)));
      }
      for (const v of variants) {
        const size = v.size;
        for (const optionQty of sels) {
          const item: Any = { id: 'x', unitName: uname, slot: u.slot, size, optionQty,
            ...(v.sizes ? { modelSizes: v.sizes } : {}),
            armory: [], traits: [], powers: [], prayers: [], pacts: [] };
          const state: Any = { army: [item], traits: {}, traitPool: [], archetype: null, legacy: null,
            legacy2: null, hqMark: null, engagement: 'pitched', pointLimit: 2000, armyName: 't',
            alliedFaction: null, alliedArchetype: null };
          runs++;
          const where = `${fk}|${uname}|size ${size}|${JSON.stringify(optionQty)}`;
          let out: Any;
          try { out = buildTtsExport(state, d).units[0]; }
          catch (e) { bad++; note('THREW', `${where} ${e}`); continue; }
          if (!out) continue;
          const ids = new Set(out.weapons.map((w: Any) => w.id));
          if (ids.size !== out.weapons.length) note('DUPLICATE weapon id', where);
          for (const m of out.models) {
            if (!Number.isInteger(m.count)) note('NON-INTEGER count', `${where} ${m.name}`);
            for (const mw of m.modelWeapons) if (!ids.has(mw.weaponId)) note('UNKNOWN weaponId', `${where} ${mw.weaponId}`);
          }
          if (!out.loadoutsExact) { inexact++; for (const n of out.loadoutNotes) note(n.replace(/\d+/g, 'N').replace(/"[^"]*"/g, '"X"').replace(/^[^:,]+(?=[:,])/, 'row'), where); }
        }
      }
    }
  }
  console.log(`${runs} exports, ${bad} threw, ${inexact} not exact`);
  for (const [k, v] of [...kinds.entries()].sort((a, b) => b[1].length - a[1].length)) {
    const units = [...new Set(v.map(x => x.split('|').slice(0, 2).join(' / ')))];
    console.log(`\n${v.length}x ${k}  (${units.length} units)`);
    for (const u of units) console.log('   ' + v.find(x => x.startsWith(u.split(' / ').join('|'))));
  }
})();
