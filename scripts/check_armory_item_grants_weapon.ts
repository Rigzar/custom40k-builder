// An armoury item that "gains the X weapon" shows X on the unit (print, battle view, builder): the weapon is looked up in the armoury the ITEM comes from.
// Lord of the Silver Tower (Mark of Tzeentch armoury) -> Coruscating beam, which only exists in that Mark armoury (Discord, Archon of the Obsidian Rose).
// npx tsx scripts/check_armory_item_grants_weapon.ts
const mem: Record<string, string> = {};
(globalThis as any).localStorage = { getItem: (k: string) => mem[k] ?? null, setItem: (k: string, v: string) => { mem[k] = v; }, removeItem: (k: string) => { delete mem[k]; } };
import { FACTION_LOADERS } from '../src/data/loaders';
import { useArmyStore } from '../src/store/army';
import { resolveUnitProfile } from '../src/engine/resolver';
type Any = any;
const CASES: [string, string, string, string, string][] = [
  // faction, unit, mark ('' for none), item, weapon that must show
  ['chaos_space_marines', 'Chaos Sorcerer', 'Tzeentch', 'Lord of the Silver Tower', 'Coruscating beam'],
  ['adeptus_custodes', 'Blade Champion', '', 'Halo of the Torchbearer', 'Magnificent Gleam'],
];
(async () => {
  let bad = 0;
  for (const [fk, unitName, mark, itemName, weapon] of CASES) {
    const data: Any = await (FACTION_LOADERS as Any)[fk]();
    const S = () => useArmyStore.getState();
    S().clearArmy(); S().setData(data); S().setEngagement('pitched'); S().setPointLimit(2500);
    S().addUnit(unitName, data.units[unitName].slot ?? 'hq');
    const e = S().army[0];
    if (mark) S().updateUnit(e.id, { mark: mark as Any });
    const pools: [string, Any][] = [['General', data.armory_general], ...Object.entries(data.armory_marks ?? {}), ...Object.entries(data.armory_legions ?? {})] as Any;
    let src = '', sec = '';
    for (const [s, a] of pools) for (const sc of ['equipment', 'weapons']) if (!src && (a?.[sc] ?? []).some((i: Any) => i.name === itemName)) { src = s; sec = sc; }
    if (!src) { console.log('FAIL', itemName, 'not found in any armoury'); bad++; continue; }
    S().addArmoryItem(e.id, { id: 'x', itemName, source: src, section: sec, points: 0, isCharacter: true } as Any);
    const shown = resolveUnitProfile(S().army[0], data.units[unitName], S() as Any, data).weaponsToShow.map((w: Any) => w.name);
    const ok = shown.some((n: string) => n.toLowerCase().includes(weapon.toLowerCase()));
    console.log(ok ? 'OK  ' : 'FAIL', fk, unitName, '+', itemName, '->', ok ? weapon : 'missing ' + weapon + ' (shown: ' + shown.join(', ') + ')');
    if (!ok) bad++;
  }
  if (bad) process.exit(1);
})();