/** GH#219: Armory stat changes land on the character, never on its attendants (Animal Companion, Servitors, E-COGs, CORVs). */
import { loadBundledFaction } from '../src/data/loaders';
import { equipTargetsModel, isAttendantModel } from '../src/lib/battleProfile';
type Any = any;
let bad = 0; const eq = (l: string, a: unknown, b: unknown) => { if (a !== b) { bad++; console.log('FAIL', l, a, '!=', b); } else console.log('ok  ', l); };
(async () => {
  const ig: Any = await loadBundledFaction('imperial_guard');
  const hero = ig.units['Company Hero'];
  eq('Company Hero row takes Armory', equipTargetsModel(hero, hero.models[0], null), true);
  eq('Animal Companion row does not', equipTargetsModel(hero, hero.models[1], null), false);
  const eng = ig.units['Engineseer'];
  eq('Servitor does not', equipTargetsModel(eng, eng.models[1], null), false);
  const vot: Any = await loadBundledFaction('leagues_of_votann');
  const grim = vot.units['Grimnyr'];
  eq('CORV does not', equipTargetsModel(grim, grim.models[1], null), false);
  eq('Grimnyr does', equipTargetsModel(grim, grim.models[0], null), true);
  const tac = ig.units['Infantry Squad'];
  eq('an ordinary squad member still does', isAttendantModel(tac, tac.models[0]), false);
  if (bad) process.exit(1);
})();
