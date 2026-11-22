// Sheet 1.7/1.6 (2026-11-22): AdM "Xenarites" ally levels + Inquisition Heretic/Iconoclast retinue.
import { getRelationship, allySide } from '../src/data/alliedMatrix';
import { getArchetypeRule } from '../src/engine/archetypes';
import { retinueFactionKeys } from '../src/engine/legendaryRetinue';
let bad = 0;
const ok = (c: boolean, m: string) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) bad++; };
const x = allySide(getArchetypeRule('Xenarites'));
for (const f of ['adeptus_custodes', 'adeptus_sororitas', 'imperial_guard', 'imperial_navy', 'space_marines'])
  ok(getRelationship('adeptus_mechanicus', f, x) === 'Y', `Xenarites vs ${f} = Allies of Convenience`);
ok(getRelationship('adeptus_mechanicus', 'space_marines') === 'G', 'plain AdM vs SM stays Battle Brothers');
ok(getRelationship('adeptus_mechanicus', 'necrons', x) === 'Y', 'Xenarites vs Necrons unchanged (Y)');
ok(getRelationship('adeptus_mechanicus', 'chaos_daemons', x) === 'R', 'Xenarites vs Chaos Daemons unchanged (R)');
for (const a of ['Heretic', 'Iconoclast']) {
  const k = retinueFactionKeys('Inquisition', a);
  ok(!k.includes('space_marines') && !k.includes('adeptus_sororitas'), `${a}: no SM / Sororitas in the retinue`);
  ok(k.includes('imperial_guard') && k.includes('adeptus_mechanicus'), `${a}: IG and AdM stay`);
}
ok(retinueFactionKeys('Inquisition', null).includes('space_marines'), 'no archetype: SM allowed');
process.exit(bad ? 1 : 0);
// Imperial Navy 1.3 uses the same Heretic / Iconoclast wording (no SM / Sororitas in the retinue) via retinueFactionKeys.
