/** The swap tables on the unit card must find the weapon an option names however the sheet capitalises or counts it (Mekboy Junka). */
import { loadBundledFaction } from '../src/data/loaders';
import { resolveChoiceWeapons } from '../src/utils/weaponName';
type Any = any;
let bad = 0; const eq = (l: string, a: unknown, b: unknown) => { if (a !== b) { bad++; console.log('FAIL', l, a, '!=', b); } else console.log('ok  ', l); };
(async () => {
  const orks: Any = await loadBundledFaction('orks');
  const u = orks.units['Mekboy Junka'];
  const g = u.option_groups.find((x: Any) => /big gun/i.test(x.header));
  for (const c of g.choices) eq('Junka big gun "' + c.name + '" has a profile', resolveChoiceWeapons(u.weapons, c.name).weapons.length > 0, true);
  eq('"Big Zzappa" -> "Big zzappa"', resolveChoiceWeapons(u.weapons, 'Big Zzappa').weapons[0]?.name, 'Big zzappa');
  eq('"Two Grot bomms" -> "Grot bomm"', resolveChoiceWeapons(u.weapons, 'Two Grot bomms').weapons[0]?.name, 'Grot bomm');
  // multi-profile and compound spellings keep working
  const csm: Any = await loadBundledFaction('chaos_space_marines');
  const cs = csm.units['Chaos Space Marines'];
  eq('multi-profile "Plasma gun"', resolveChoiceWeapons(cs.weapons, 'Plasma gun').weapons.length, 2);
  eq('nothing invented for an unknown name', resolveChoiceWeapons(cs.weapons, 'Banana cannon').weapons.length, 0);
  if (bad) process.exit(1);
})();
