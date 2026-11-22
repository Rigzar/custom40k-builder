// Daemonic possession: "reduces its BS and WS values by 1 (to a maximum of 4+)".
import { resolveStatValue } from '../src/lib/statPipeline';
let bad = 0;
const ok = (c: boolean, m: string) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) bad++; };
const mk = (): any => ({ unit: {}, marks: [], favouredLeader: false, traitStatMods: [], optionStatMods: [], equipMods: { statDeltas: { BS: 1 }, statSets: {}, armorSave: null, skillCap: { BS: 4 } }, traitEquipMods: { statDeltas: {}, statSets: {}, armorSave: null }, isEquipTarget: true });
ok(resolveStatValue('3+', 'BS', mk()).display === '4+', 'BS 3+ becomes 4+');
ok(resolveStatValue('4+', 'BS', mk()).display === '4+', 'BS 4+ stays 4+ (the cap)');
ok(resolveStatValue('6+', 'BS', mk()).display === '6+', 'BS 6+ is already worse than the cap and is left alone');
process.exit(bad ? 1 : 0);
