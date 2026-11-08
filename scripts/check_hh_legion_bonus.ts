import { FACTION_LOADERS } from '../src/data/loaders';
import fs from 'node:fs';
(async () => {
  for (const [k, book] of [['horus_heresy_loyal', 'loyal'], ['horus_heresy_traitor', 'traitor']] as const) {
    const d: any = await (FACTION_LOADERS as any)[k]();
    // costs from the Index special rules: "<Legion> Legion*: ... Cost: +3 points per model, +6 points for a character model, +10 points for a vehicle."
    const idx: any[][] = JSON.parse(fs.readFileSync(`scratch_cx/hh_codex/_books/${book}/Index.json`, 'utf8'));
    const cost: Record<string, { unit: number; char: number; veh: number }> = {};
    for (const r of idx) for (const c of r) { const m = String(c).match(/^(.+?) Legion\*:.*Cost: \+(\d+) points? per model, \+(\d+) points? for a character model(?: or a squad leader)?, \+(\d+) points? for a vehicle/s); if (m) cost[m[1]] = { unit: +m[2], char: +m[3], veh: +m[4] }; }
    const legions = Object.keys(cost);
    let groups = 0; const bad: string[] = [];
    for (const [name, u] of Object.entries<any>(d.units)) {
      const g = (u.option_groups ?? []).find((x: any) => /benefits of the Legion of the army/i.test(x.header));
      if (!g) continue; groups++;
      if (/Thunderfire|Firestrike/.test(name)) continue;
      const kind = u.is_vehicle ? 'veh' : (u.is_character || u.is_monster) ? 'char' : 'unit';
      const have = new Set((g.choices ?? []).map((c: any) => c.name));
      for (const l of legions) if (!have.has(l)) bad.push(`${name}: missing Legion ${l}`);
      for (const c of g.choices ?? []) {
        const want = cost[c.name]?.[kind];
        if (want == null) { bad.push(`${name}: unknown Legion ${c.name}`); continue; }
        if (c.points !== want && !(kind === 'veh' && c.points === 10)) bad.push(`${name} [${kind}] ${c.name}: ${c.points} pts, Index says ${want}`);
        if (kind === 'unit' && !c.per_model) bad.push(`${name} ${c.name}: squad price not per model`);
        if (!c.effect && kind !== 'veh') bad.push(`${name} ${c.name}: no effect`);
      }
    }
    console.log(k, 'Legions in the Index:', legions.length, '| units with the Legion option:', groups, '| problems:', bad.length);
    bad.slice(0, 25).forEach(b => console.log('  ', b));
  }
})();
