/**
 * Shared choices list for every "Drone controller" option group (Commander, Sub-commander,
 * Ethereal, Strike/Breacher/Pathfinder Team, Crisis/Crisis Honor Guard/Hazard/Stealth/Broadside/
 * Riptide Battlesuits, Tidewall Droneport) — all of them let the model buy "up to N Tau Drones in
 * any combination" from the same canonical Tau Drones datasheet (drones.json). One shared source
 * avoids 13 separately-typed-out copies of the same names/points drifting out of sync.
 *
 * Stealth Drone is excluded — its .ods POINTS column reads "-" (drones.json: points: null), it's
 * never bought standalone through a Drone controller, only bundled into specific named grants
 * (e.g. Ghostkeel's "2 Stealth Drones").
 */
import type { Choice } from '../../../src/types/data';

export const TAU_DRONE_CHOICES: Choice[] = [
  { name: 'Grav Inhibitor Drone', points: 10 },
  { name: 'Gun Drone', points: 12 },
  { name: 'Marker Drone', points: 10 },
  { name: 'Pulse Accelerator Drone', points: 10 },
  { name: 'Recon Drone', points: 16 },
  { name: 'Shield Drone', points: 20 },
  { name: 'Missile Drone', points: 16 },
  { name: 'Sniper Drone', points: 24 },
  { name: 'Warscaper Drone', points: 5 },
];
