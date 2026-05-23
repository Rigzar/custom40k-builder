import type { FactionResolverFn } from './resolver';

/**
 * Chaos Daemons faction resolver.
 *
 * Handles CD-specific unit display transformations.
 * Rules to implement here:
 *
 *   - Daemonic instability display notes
 *   - Greater Daemon / Fearless distinction
 *   - Entourage: "For each Greater Daemon of the same god, up to 2 heralds don't use an HQ slot"
 *   - Herald: "Up to 2 units with this rule can be taken as a single HQ choice"
 *   - Bound Beast: "For every HQ with Mark of Khorne, 1 Slaughterbrute costs no FA slot"
 *   - Ascended Daemon Prince: moves to HQ slot, upgrades stats
 *   - Archetype effects (Goretide wound-on-death, Popping Plague explosion, etc.)
 */
export const cdResolve: FactionResolverFn = (base, _item, _unit, _state) => {
  // Placeholder — rules will be implemented here
  return base;
};
