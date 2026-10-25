const mem: Record<string, string> = {};
(globalThis as any).localStorage = { getItem: (k: string) => mem[k] ?? null, setItem: (k: string, v: string) => { mem[k] = v; }, removeItem: (k: string) => { delete mem[k]; } };
import { FACTION_LOADERS } from '../src/data/loaders';
import { resolveUnitProfile } from '../src/engine/resolver';
const unitMinSize = (u: any) => u.models.filter((m: any) => m.max !== 0).reduce((a: number, m: any) => a + m.min, 0);
const unitMaxSize = (u: any) => u.models.filter((m: any) => m.max !== 0).reduce((a: number, m: any) => a + m.max, 0);
type Any = any;
const SACRED: Record<string, number> = { Khorne: 8, Nurgle: 7, Slaanesh: 6, Tzeentch: 9 };
(async () => {
  for (const key of ['chaos_space_marines', 'chaos_daemons']) {
    const data: Any = await (FACTION_LOADERS as Any)[key]();
    let checked = 0, favored = 0; const bad: string[] = []; const noLeader: string[] = [];
    for (const [name, u] of Object.entries<Any>(data.units)) {
      const marks = u.locked_mark ? [u.locked_mark] : Object.keys(SACRED);
      const lo = unitMinSize(u), hi = unitMaxSize(u);
      for (const mark of marks) for (let size = lo; size <= hi; size++) {
        const it: Any = { id: 'x', unitName: name, slot: u.slot, size, mark: u.locked_mark ? null : mark, optionQty: {}, armory: [], traits: [], powers: [], prayers: [], pacts: [] };
        if (u.models.length > 1) { it.modelSizes = {}; let left = size; u.models.forEach((m: Any, i: number) => { const n = i === 0 ? Math.max(m.min, size - (u.models.length - 1) * Math.max(1, u.models[1]?.min ?? 1)) : (m.min); it.modelSizes[m.name] = i === 0 ? n : m.min; }); }
        const st: Any = { army: [it], faction: data.faction, data, traits: {}, traitPool: [], archetype: '', legacy: '', legacy2: '', hqMark: null, engagement: 'epic', pointLimit: 4000, alliedFaction: null, alliedArchetype: '', alliedLegacy: '', alliedTraitPool: [], campaignTraitBonus: 0 };
        let r: Any; try { r = resolveUnitProfile(it, u, st, data); } catch (e) { bad.push(`${name} ${mark} ${size}: THROW`); continue; }
        checked++;
        const em = r.effectiveMark; const mult = SACRED[em] && size % SACRED[em] === 0;
        const expectedBase = !!em && em !== 'Undivided' && !!mult;
        if (r.isFavored) { favored++; if (!expectedBase) bad.push(`${name} ${mark} ${size}: favored but mark ${em} size%n=${mult}`); if (r.squadLeaderIdx < 0) noLeader.push(`${name} ${mark} ${size}`); }
        else if (expectedBase && key === 'chaos_space_marines' && (u.has_armory_access || u.champion_has_armory)) bad.push(`${name} ${mark} ${size}: expected favored, not`);
      }
    }
    console.log(key, 'checked', checked, 'favored', favored, 'bad', bad.length, 'favored-without-leader', noLeader.length);
    console.log(bad.slice(0, 12).join('\n')); console.log('noLeader sample:', [...new Set(noLeader.map(s => s.split(' ')[0] + ' ' + s.split(' ')[1]))].slice(0, 25).join(' | '));
  }
})();
