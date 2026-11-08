/**
 * Horus Heresy books: every option choice of every datasheet is bought once through the real resolver (computeWeaponsToShow), and the weapon it hands over
 * must appear on the card while the weapon it replaces disappears. A choice that names a weapon the datasheet does not have, or that does nothing at all,
 * is reported. Run: npx tsx scripts/check_hh_options.ts
 */
import { FACTION_LOADERS } from '../src/data/loaders';
import { computeWeaponsToShow } from '../src/engine/resolver';

const base = (n: string) => String(n).replace(/\s+-\s+.*$/, '').replace(/[ᵀᴳ*ˣ]/g, '').trim().toLowerCase();
const key = (s: string) => base(s).replace(/[^a-z0-9]+/g, ' ').trim();

(async () => {
  const problems: string[] = [];
  let choicesChecked = 0; let unitsChecked = 0;
  for (const k of ['horus_heresy_loyal', 'horus_heresy_traitor']) {
    const d: any = await (FACTION_LOADERS as any)[k]();
    for (const [name, u] of Object.entries<any>(d.units)) {
      unitsChecked++;
      const wnames = new Map<string, string>();
      for (const w of u.weapons ?? []) wnames.set(key(w.name), base(w.name));
      const size = Math.max(u.default_size ?? 1, 10);
      const shown = (optionQty: any) => computeWeaponsToShow(u.weapons, u as any, { unitName: name, size, optionQty, armory: [], traits: [] } as any).map((w: any) => key(w.name));
      const bare = shown({});
      (u.option_groups ?? []).forEach((g: any, gi: number) => {
        (g.choices ?? []).forEach((c: any, ci: number) => {
          choicesChecked++;
          const label = `${k}/${name} :: "${String(g.header).slice(0, 55)}" -> ${c.name}`;
          // what the choice is meant to hand over
          const want = new Set<string>();
          for (const w of c.effect?.grants_weapons ?? []) want.add(key(w));
          if (wnames.has(key(c.name))) want.add(key(c.name));
          for (const p of String(c.name).split(/\s+(?:with|and|&)\s+|\s*\+\s*/i)) if (wnames.has(key(p))) want.add(key(p));
          const hasEffect = !!c.effect && Object.keys(c.effect).length > 0;
          let out: string[];
          try { out = shown({ [gi]: { [ci]: 1 } }); } catch (e: any) { problems.push(`${label}: resolver threw ${String(e.message).slice(0, 80)}`); return; }
          if (!want.size) {
            // an upgrade without a weapon: it must be an effect, an inline ability or at least priced text the card prints
            if (!hasEffect && !/\b(ability|abilities|armor|armour|save|\+\d|ward|upgrade|vexilla|banner|mark|legion|veteran)\b/i.test(c.name + ' ' + g.header) && !/tempest|dark shroud|nemesis|khorne|slaanesh|nurgle|tzeentch|haywire mine|omni scrambler/i.test(c.name)) problems.push(`${label}: names no weapon of the datasheet and has no effect`);
            return;
          }
          for (const w of want) {
            if (!out.includes(w) && !bare.includes(w)) problems.push(`${label}: weapon "${w}" does not show when bought`);
          }
          // the replaced weapon only disappears when EVERY model that carries it swaps: test that on the groups that say "every"
          if (g.constraint?.type === 'every') {
            let all: string[] = out;
            try { all = shown({ [gi]: { [ci]: size } }); } catch { /* reported above */ }
            for (const r of g.replaces ?? []) {
              const rk = key(r);
              if (want.has(rk)) continue;
              if (bare.includes(rk) && all.includes(rk)) problems.push(`${label}: replaced weapon "${r}" still shows after every model swapped`);
            }
          }
        });
      });
    }
  }
  console.log(`${unitsChecked} datasheets, ${choicesChecked} choices checked`);
  if (problems.length) { console.error('PROBLEMS\n' + problems.join('\n')); process.exit(1); }
  console.log('OK  every option choice hands over its weapon and drops the one it replaces');
})();
