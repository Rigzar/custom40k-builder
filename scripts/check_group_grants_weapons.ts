/**
 * A grants_weapons written on the option GROUP (not on each choice) must hide the weapon until a choice of that group is bought, and show
 * it afterwards. The resolver honoured the group-level grant only on the selection side, so the weapon showed unbought.
 * Takes the real Servitors, moves the Shock charger grant from its ten choices to the group, and asserts the claim through computeWeaponsToShow.
 *   npx tsx scripts/check_group_grants_weapons.ts
 */
import { computeWeaponsToShow } from '../src/engine/resolver';
import { readFileSync } from 'node:fs';
const servitors = JSON.parse(readFileSync('data/parsed/adeptus_mechanicus/units/elites/servitors.json', 'utf8'));

const unit: any = JSON.parse(JSON.stringify(servitors));
const gi = unit.option_groups.findIndex((g: any) => g.header.includes('Any model may swap'));
const g = unit.option_groups[gi];
const moved = new Set<string>();
for (const c of g.choices) for (const w of c.effect?.grants_weapons ?? []) moved.add(w);
for (const c of g.choices) if (c.effect) { delete c.effect.grants_weapons; if (!Object.keys(c.effect).length) delete c.effect; }
g.effect = { ...(g.effect ?? {}), grants_weapons: [...moved] };
const shown = (optionQty: any) => computeWeaponsToShow(unit.weapons, unit, { unitName: unit.name, size: 4, optionQty, armory: [], traits: [] } as any).map((w: any) => w.name);
let bad = 0;
if (!moved.has('Shock charger')) { console.log('  WRONG setup: no Shock charger grant found'); bad++; }
if (shown({}).includes('Shock charger')) { console.log('  WRONG group grant: Shock charger shown with nothing bought'); bad++; }
const ci = g.choices.findIndex((c: any) => c.name === 'Meltagun');
if (!shown({ [gi]: { [ci]: 1 } }).includes('Shock charger')) { console.log('  WRONG group grant: Shock charger missing after the swap'); bad++; }
console.log(bad ? `\n${bad} FAILURE(S)` : '\nOK  group-level grants_weapons honoured');
process.exit(bad ? 1 : 0);
