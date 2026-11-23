/**
 * Check that vehicles and/or monsters with traits that are only valid for vehicles and/or monsters do not have points for the other case.
 * Necrons trait Interplanetary Invasors should only apply to vehicles, but currently applies to monsters too (Sophtym, 2026-11-21).
 *   npx tsx scripts/check_vehicle_monster_only_traits.ts
 */
import { FACTION_LOADERS } from '../src/data/loaders';
import { FactionData, Trait } from '../src/types/data';

let failures = 0;
let failuresInfo: string[] = [];
const fail = (m: string) => { 
  failures++; 
  failuresInfo.push(m);
  console.log('  WRONG ' + m); 
};

(async () => {
  for (const faction of Object.keys(FACTION_LOADERS)) {
    const data: FactionData = await (FACTION_LOADERS)[faction]();
    console.log(`Checking faction ${faction} with ${data.traits.length} traits`);
    data.traits.forEach((trait: Trait) => {
      const hasMonsterPts = !!trait.pts_monster && trait.pts_monster !== '-';
      const hasVehiclePts = !!trait.pts_veh && trait.pts_veh !== '-';
      if (hasMonsterPts || hasVehiclePts) {
        console.log(`  Checking trait ${trait.name} with monster points ${trait.pts_monster} and vehicle points ${trait.pts_veh}`);
        const isMonsterOnly = trait.desc.match(/only for monsters/i);
        if (isMonsterOnly && hasVehiclePts) {
          fail(`trait ${trait.name} in faction ${faction} is marked only for monsters but has vehicle points`);
          return;
        }
        const isVehicleOnly = trait.desc.match(/only for vehicles/i);
        if (isVehicleOnly && hasMonsterPts) {
          fail(`trait ${trait.name} in faction ${faction} is marked only for vehicles but has monster points`);
          return;
        }
        if (hasMonsterPts && hasVehiclePts && (isMonsterOnly || isVehicleOnly)) {
          fail(`trait ${trait.name} in faction ${faction} is marked only for monsters and only for vehicles but does not have both points`);
        }
      }    
    });
  }
  console.log(`\nFinished checking traits.`);
  if (failures > 0) {
    console.log(`Found ${failures} failures:`);
    failuresInfo.forEach((info) => console.log(`  --> ${info}`));
  } else {
    console.log('No failures found.');
  }
  process.exit(failures ? 1 : 0);
})();
