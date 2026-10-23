/**
 * Escalation (Dominic, 2026-10-23): "let any of them take both or none at all" -> a Chaos army may take the War Dog as an Elite, an Imperial army
 * the Armiger, anything else neither. Chaos Daemons do not count as Chaos for this. The archetypes that make another army Chaos (IG Traitor
 * Guard, SM Renegades, AdMech Dark Mechanicum) swap the Armiger for the War Dog. An ally is judged by its own codex and archetype.
 *
 *   npx tsx scripts/check_escalation_war_dog_armiger.ts
 */
import { FACTION_LOADERS } from '../src/data/loaders';
import { getArchetypeRule, isUnitAllowed } from '../src/engine/archetypes';
import { validateArmy } from '../src/engine/validators';

type Any = any;
let ok = true;
const check = (label: string, got: Any, want: Any) => {
  const good = JSON.stringify(got) === JSON.stringify(want);
  ok = ok && good;
  console.log(`  ${good ? 'ok   ' : 'WRONG'} ${label.padEnd(58)} ${JSON.stringify(got)}`
    + (good ? '' : `  (expected ${JSON.stringify(want)})`));
};

async function offered(faction: string, archetype: string): Promise<string[]> {
  const d: Any = await (FACTION_LOADERS as Any)[faction]();
  const rule = getArchetypeRule(archetype);
  const out: string[] = [];
  for (const name of ['Armiger', 'War Dog']) {
    const u = d.units[name];
    if (u && isUnitAllowed(name, u, rule, u.slot)) out.push(name);
  }
  return out;
}

async function main() {
  const NONE = '';
  console.log('Imperial codices: Armiger yes, War Dog no');
  for (const f of ['space_marines', 'imperial_guard', 'adeptus_mechanicus', 'adeptus_custodes', 'adeptus_sororitas', 'grey_knights', 'inquisition', 'imperial_navy'])
    check(f, await offered(f, NONE), ['Armiger']);

  console.log('\nChaos Space Marines: War Dog yes, Armiger no');
  check('chaos_space_marines', await offered('chaos_space_marines', NONE), ['War Dog']);

  console.log('\nArchetypes that make an Imperial army Chaos: War Dog replaces Armiger');
  check('imperial_guard / Traitor Guard', await offered('imperial_guard', 'Traitor Guard'), ['War Dog']);
  check('space_marines / Renegades', await offered('space_marines', 'Renegades'), ['War Dog']);
  check('adeptus_mechanicus / Dark Mechanicum', await offered('adeptus_mechanicus', 'Dark Mechanicum'), ['War Dog']);

  console.log('\nNeither Chaos Daemons nor the xenos codices');
  for (const f of ['chaos_daemons', 'necrons', 'orks', 'tau_empire', 'eldar', 'tyranids', 'leagues_of_votann'])
    check(f, await offered(f, NONE), []);

  console.log('\nThe validator reports a War Dog that is in a list without a Chaos archetype');
  const ig: Any = await (FACTION_LOADERS as Any).imperial_guard();
  const state = (archetype: string): Any => ({
    archetype, legacy: '', legacy2: '', engagement: 'epic', pointLimit: 3000,
    army: [{ id: 'w', unitName: 'War Dog', slot: 'Elites', size: 1, mark: null, optionQty: {}, armory: [], traits: [], powers: [], prayers: [] }],
    traitPool: [], alliedFaction: null, alliedArchetype: '', alliedLegacy: '', alliedTraitPool: [], campaignTraitBonus: 0,
  });
  const has = (a: string) => validateArmy(state(a), ig, null).some((v: Any) => /only Chaos armies may take it/.test(String(v.text)));
  check('IG + no archetype: error', has(''), true);
  check('IG + Traitor Guard: no error', has('Traitor Guard'), false);

  console.log(ok ? '\nAll checks passed.' : '\nSOME CHECKS FAILED.');
  process.exit(ok ? 0 : 1);
}
main();
