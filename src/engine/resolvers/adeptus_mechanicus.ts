import type { FactionResolverFn } from '../resolver';

/**
 * Legacy Canticle auto-injection (ki-admech-canticles-unwired-01 follow-up). Each Forge World
 * Legacy's `desc` (archetypes.json) grants its armory PLUS one named Canticle of the Omnissiah
 * outright — not a per-unit pick, the same "grant on selection" shape as a Legacy's armory access.
 * Mirrors Chaos Daemons' Locus-aura injection (resolvers/chaos_daemons.ts): find the matching
 * Canticle data entry and surface its verbatim effect text as an ability, on every unit whose
 * datasheet carries the "Canticles of the Omnissiah" ability (per the .ods, 22 of 29 units —
 * Monotask units don't). Only the 7 Legacy Canticles work this way; the 6 base Canticles are a
 * genuine per-Command-phase pick with no engine/UI support yet (see Canticle doc comment,
 * types/data.ts) and are NOT injected here.
 */
export const admechResolve: FactionResolverFn = (base, _item, unit, state, data) => {
  const hasCanticles = (unit.abilities ?? []).some(a => /canticles of the omnissiah/i.test(a));
  if (!hasCanticles || !state.legacy || !data.canticles) return base;

  const granted = data.canticles.find(c => c.type === 'legacy' && c.grantedByLegacy === state.legacy);
  if (!granted) return base;

  return {
    ...base,
    injectedAbilities: [...base.injectedAbilities, `${granted.name} (Legacy Canticle): ${granted.effect}`],
  };
};
