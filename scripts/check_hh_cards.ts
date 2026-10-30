/** Horus Heresy books: the unit cards read as rules and options, not as stray tick-boxes; no unit is a psyker without its own Psyker ability. */
import { existsSync } from 'node:fs';
import { FACTION_LOADERS } from '../src/data/loaders';
import { resolveUnitProfile } from '../src/engine/resolver';
import { factionSymbolFile } from '../src/utils/factionLabel';
(async () => {
  const fails: string[] = [];
  for (const k of ['horus_heresy_loyal', 'horus_heresy_traitor']) {
    const d: any = await (FACTION_LOADERS as any)[k]();
    if (!existsSync('public' + factionSymbolFile(d.faction))) fails.push(`${k}: emblem file ${factionSymbolFile(d.faction)} does not exist`);
    for (const [name, u] of Object.entries<any>(d.units)) {
      for (const g of u.option_groups) if ((g.choices ?? []).length === 0 && g.inline_pts == null && !g.variant_link) fails.push(`${k}/${name}: "${String(g.header).slice(0, 60)}" is a text line left as an option`);
      const item: any = { id: 'x', unitName: name, slot: u.slot, size: u.default_size ?? 1, optionQty: {}, armory: [], traits: [], powers: [], prayers: [], pacts: [] };
      const r: any = resolveUnitProfile(item, u, { army: [item], traits: {}, traitPool: [], archetype: null, legacy: null, legacy2: null, hqMark: null, engagement: 'pitched', pointLimit: 2500, alliedFaction: null, alliedArchetype: null } as any, d);
      if (r.effectivePsyker) fails.push(`${k}/${name}: shows psychic powers with nothing bought`);
    }
    const jump = d.units['Legion Assault Squad']?.option_groups.find((g: any) => /remove their Jump packs/i.test(g.header));
    if (!jump || jump.inline_pts >= 0) fails.push(`${k}: removing the Jump packs must be a discount (inline_pts ${jump?.inline_pts})`);
    for (const n of ['Legion Contemptor Dreadnought', 'Centurion Command Squad']) if (!d.units[n]?.advisor) fails.push(`${k}/${n}: should carry the Advisor ability`);
  }
  if (fails.length) { console.error('FAIL\n' + fails.join('\n')); process.exit(1); }
  console.log('OK  HH cards: no text options, no stray psychic, emblem, Jump pack discount, Advisor');
})();
