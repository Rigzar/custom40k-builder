/**
 * Shared choices list for every "Drone controller" option group (Commander, Sub-commander,
 * Ethereal, Strike/Breacher/Pathfinder Team, Crisis/Crisis Honor Guard/Hazard/Stealth/Broadside/
 * Riptide Battlesuits, Tidewall Droneport) — all of them let the model buy "up to N Tau Drones in
 * any combination" from the same canonical Tau Drones datasheet (drones.json). One shared source
 * avoids 13 separately-typed-out copies of the same names/points drifting out of sync.
 *
 * Stealth Drone is last on purpose: `optionQty` stores the choice INDEX, so a new choice goes at the end.
 */
import type { Choice } from '../../../src/types/data';

export const TAU_DRONE_CHOICES: Choice[] = [
  { name: 'Grav Inhibitor Drone', points: 10 },
  { name: 'Gun Drone', points: 12 },
  { name: 'Marker Drone', points: 10 },
  { name: 'Pulse Accelerator Drone', points: 10 },
  { name: 'Recon Drone', points: 16 },
  { name: 'Shield Drone', points: 5 },
  { name: 'Missile Drone', points: 21 },
  { name: 'Sniper Drone', points: 24 },
  { name: 'Warscaper Drone', points: 5 },
  { name: 'Stealth Drone', points: 15 },
];
