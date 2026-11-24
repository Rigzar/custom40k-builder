/**
 * Free Veteran abilities ("can assign (a | two) free Veteran abilit(y|ies) to himself and a friendly unit"): the cap read from the
 * unit's own text, the picker's options from the faction's Armory, and the chosen ones reaching the resolved profile.
 *   npx tsx scripts/check_free_veterans.ts
 */
import { FACTION_LOADERS } from '../src/data/loaders';
import { resolveUnitProfile } from '../src/engine/resolver';
import { freeVeteranCap, veteranAbilityItems } from '../src/engine/freeVeterans';
type Any = any;
let failed = 0;
const check = (ok: boolean, msg: string) => { console.log((ok ? 'ok   ' : 'FAIL ') + msg); if (!ok) failed++; };

(async () => {
  const cases: [string, string, number][] = [
    ['adeptus_custodes', 'Shield-Captain', 2], ['adeptus_custodes', 'Shield-Captain on Jetbike', 2],
    ['chaos_space_marines', 'Chaos Lieutenant', 1], ['grey_knights', 'Captain', 2], ['grey_knights', 'Captain in Nemesis Armor', 2],
    ['space_marines', 'Lieutenant', 1], ['space_marines', 'Captain Dreadnought', 2],
  ];
  for (const [fk, name, cap] of cases) {
    const d: Any = await FACTION_LOADERS[fk as keyof typeof FACTION_LOADERS]();
    const u = d.units[name];
    check(!!u && freeVeteranCap(u.abilities) === cap, `${fk} / ${name}: cap ${cap}`);
    const opts = veteranAbilityItems(d.armory_general);
    check(opts.length === 8, `${fk}: ${opts.length} Veteran abilities to pick from (8 expected)`);
    const state: Any = { faction: d.faction, army: [], traits: {}, traitPool: [], archetype: null, legacy: null, legacy2: null, hqMark: null, engagement: 'pitched', pointLimit: 2000, alliedFaction: null, alliedArchetype: null };
    const mk = (freeVeterans?: string[]): Any => ({ id: 'x', unitName: name, slot: u.slot, size: 1, optionQty: {}, armory: [], traits: [], powers: [], prayers: [], pacts: [], mark: null, freeVeterans });
    const run = (it: Any) => resolveUnitProfile(it, u, { ...state, army: [it] }, d).equipMods.grantedAbilities as string[];
    check(run(mk()).length === 0 || !run(mk()).some(a => /furious|vanguard|outflank/i.test(a)), `${name}: nothing granted without a pick`);
    const picked = run(mk(['Furious charge', 'Vanguard', 'Outflank']));
    check(picked.some(a => /furious charge/i.test(a)), `${name}: first pick reaches the profile (${picked.join(', ')})`);
    check(picked.length === cap, `${name}: capped at ${cap} (got ${picked.length})`);
  }
  // a unit without the rule offers nothing and grants nothing
  const sm: Any = await FACTION_LOADERS.space_marines();
  const tac = sm.units['Tactical Squad'] ?? Object.values<Any>(sm.units)[0];
  check(freeVeteranCap(tac.abilities) === 0, `${tac.name}: no free Veteran abilities`);
  console.log(failed ? `\n${failed} failure(s)` : '\nall ok');
  process.exit(failed ? 1 : 0);
})();
