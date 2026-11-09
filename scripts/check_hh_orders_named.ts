/**
 * Horus Heresy books (Dark Angels / any Legion): the two weapon rules written on the sheets, read through the real code.
 *  1. Orders of the Hekatonystika: one unique item whose text lists six named orders. The picker reads the names from the text; each order is applied by the resolver
 *     (an ability for the model, or an ability on its melee / all weapons).
 *  2. Crusade weapon: "Can not be applied to named weapons: ..." removes those weapons from the list it may be pointed at; the common weapons stay.
 * Run: npx tsx scripts/check_hh_orders_named.ts
 */
const mem: Record<string, string> = {};
(globalThis as any).localStorage = { getItem: (k: string) => mem[k] ?? null, setItem: (k: string, v: string) => { mem[k] = v; }, removeItem: (k: string) => { delete mem[k]; } };
(globalThis as any).document = { documentElement: {}, addEventListener() {} }; (globalThis as any).window = { addEventListener() {} };
console.warn = () => {}; console.error = () => {};
import { FACTION_LOADERS } from '../src/data/loaders';
import { useArmyStore } from '../src/store/army';
import { resolveUnit } from '../src/engine/points';
import { resolveUnitProfile } from '../src/engine/resolver';
import { parseNamedChoices, namedWeaponsBlockedBy } from '../src/engine/equipMods';
type Any = any;
(async () => {
  const bad: string[] = [];
  const ok = (c: boolean, m: string) => { if (!c) bad.push(m); };
  const d: Any = await (FACTION_LOADERS as Any).horus_heresy_loyal();
  const flat = (a: Any) => [...(a?.equipment ?? []), ...(a?.weapons ?? [])];
  const orders = flat(d.armory_legions?.['Dark Angels'] ?? Object.values(d.armory_legions ?? {}).find((x: Any) => /dark angels/i.test(x.name))).find((x: Any) => /^Orders of the Hekatonystika/i.test(x.name));
  ok(!!orders, 'Orders of the Hekatonystika is in the Dark Angels Armory');
  const names = parseNamedChoices(orders?.desc);
  ok(names.length === 6 && names.includes('Augurs of Weakness') && names.includes('Breakers of Witches'), `the picker reads six order names from the text (got ${names.join(' | ')})`);
  ok(/unique/i.test(orders?.desc ?? ''), 'the item is Unique');

  // buy each order on a Centurion and read the card
  const S = () => useArmyStore.getState();
  const card = (order: string) => {
    S().clearArmy(); S().setData(d); S().setEngagement('pitched'); S().setPointLimit(2500);
    S().addUnit('Centurion', 'HQ');
    const id = S().army[0].id;
    S().addArmoryItem(id, { id: 'o1', itemName: 'Orders of the Hekatonystika', source: 'Dark Angels', section: 'equipment', points: 7, chosenPower: order } as Any);
    S().addArmoryItem(id, { id: 'w1', itemName: 'Power sword', source: 'Armory', section: 'weapons', points: 6 } as Any);
    const e = S().army[0]; const u = resolveUnit(e, S().data!)!;
    return resolveUnitProfile(e, u, S() as Any, S().data!) as Any;
  };
  // what the card prints: the abilities the model gains, and the abilities added to each weapon row (the trait map the weapon table renders)
  const abil = (rp: Any) => [...(rp.equipMods?.grantedAbilities ?? []), ...(rp.injectedRuleNotes ?? [])].join(' | ');
  const fx = (rp: Any, w: Any) => ((rp.weaponTraitMap as Map<string, string[]> | undefined)?.get(w.name) ?? []).join(', ');
  const wabil = (rp: Any, melee: boolean) => (rp.weaponsToShow ?? []).filter((w: Any) => (w.range === '-' || /melee/i.test(w.type ?? '')) === melee).map((w: Any) => `${w.abilities ?? ''} ${fx(rp, w)}`).join(' | ');
  const all = (rp: Any) => (rp.weaponsToShow ?? []).map((w: Any) => `${w.abilities ?? ''} ${fx(rp, w)}`).join(' | ');
  ok(/Armorbane\(1\)/.test(all(card('Augurs of Weakness'))), 'Augurs of Weakness: Armorbane(1) on the weapons');
  ok(/Parry/.test(abil(card('Icons of Resolve'))), 'Icons of Resolve: the model gains Parry');
  ok(/Precision\(6\+\)/.test(wabil(card('Slayers of Kings'), true)), 'Slayers of Kings: Precision(6+) on the melee weapons');
  ok(!/Precision\(6\+\)/.test(wabil(card('Slayers of Kings'), false)), 'Slayers of Kings: not on the ranged ones');
  ok(/Extra Attack\(1\)/.test(wabil(card('Reapers of Hosts'), true)), 'Reapers of Hosts: Extra Attack(1) on the melee weapons');
  ok(/Psi-shock/.test(wabil(card('Breakers of Witches'), true)), 'Breakers of Witches: Psi-shock on the melee weapons');
  ok(/Monstrous creature/i.test(abil(card('Hunters of Beasts'))), 'Hunters of Beasts: the re-roll text is on the card');

  // Crusade weapon: the named weapons are not offered
  for (const k of ['horus_heresy_loyal', 'horus_heresy_traitor']) {
    const dd: Any = await (FACTION_LOADERS as Any)[k]();
    const cw = flat(dd.armory_general ?? dd.armory ?? {}).find((x: Any) => /^Crusade weapon/i.test(x.name));
    const blocked = namedWeaponsBlockedBy(cw?.desc);
    ok(blocked.size >= 8, `${k}: the Crusade weapon names its named weapons (${blocked.size})`);
    ok(!blocked.has('power sword') && !blocked.has('chainglaive') && !blocked.has('power scythe'), `${k}: the common weapons are not on the list`);
  }
  const l: Any = await (FACTION_LOADERS as Any).horus_heresy_loyal();
  const lb = namedWeaponsBlockedBy(flat(l.armory_general ?? l.armory ?? {}).find((x: Any) => /^Crusade weapon/i.test(x.name))?.desc);
  ok(lb.has('terranic greatsword') && lb.has('calibanite warblade'), 'Terranic greatsword and Calibanite warblade cannot take the Crusade weapon');
  console.log(bad.length ? 'PROBLEMS\n' + bad.join('\n') : 'OK  the Orders of the Hekatonystika work through the resolver and the Crusade weapon skips the named weapons');
  process.exit(bad.length ? 1 : 0);
})();
