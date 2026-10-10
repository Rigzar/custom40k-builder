/** Every model row and weapon row carries its count, even 1 (Rigzar, 2026-10-10). npx tsx scripts/check_row_counts.ts */
const mem: Record<string,string> = {};
(globalThis as any).localStorage = { getItem:(k:string)=>mem[k]??null, setItem:(k:string,v:string)=>{mem[k]=v}, removeItem:(k:string)=>{delete mem[k]} };
import { FACTION_LOADERS } from '../src/data/loaders';
import { useArmyStore } from '../src/store/army';
import { resolveUnit } from '../src/engine/points';
import { resolveUnitProfile } from '../src/engine/resolver';
const want: Record<string,string> = {
  'Tactical Squad': '9x Tactical Marine + 1x Tactical Sergeant',
  'Lord': '1x Overlord',
  'Lootas': '4x Loota + 3x Spanna',
  'Rhino': '1x Rhino',
};
(async()=>{
  let bad = 0;
  for (const [fac, unit, slot, size, vq] of [['space_marines','Tactical Squad','Troops',10,0],['necrons','Lord','HQ',1,1],['orks','Lootas','Heavy Support',7,3],['space_marines','Rhino','Dedicated Transport',1,0]] as any[]) {
    const d:any = await (FACTION_LOADERS as any)[fac]();
    const S=()=>useArmyStore.getState();
    S().clearArmy(); S().setData(d); S().setPointLimit(3000);
    S().addUnit(unit, slot); const id=S().army[0].id;
    if (size>1) { const ms=d.units[unit].models.filter((m:any)=>m.max>0); if (ms.length>1) S().updateModelSize(id, ms[0].name, size-ms.slice(1).reduce((a:number,m:any)=>a+m.min,0)); else S().updateUnit(id,{size} as any); }
    if (vq) { const gi=d.units[unit].option_groups.findIndex((g:any)=>g.variant_link); S().setOptionQty(id,gi,'__inline',vq); }
    const e=S().army[0]; const u=resolveUnit(e,S().data!)!; const r:any=resolveUnitProfile(e,u,S() as any,S().data!);
    const got = r.modelsToShow.map((m:any,i:number)=>r.modelRowCounts[i]+'x '+m.name).join(' + ');
    if (got !== want[unit]) { bad++; console.log('FAIL', unit, got, '!=', want[unit]); }
    for (const g of r.weaponGroups) if (g.count == null) { bad++; console.log('FAIL uncounted weapon group', unit); }
  }
  console.log(bad ? bad+' FAILED' : 'ok');
  process.exit(bad ? 1 : 0);
})();
