/**
 * Faction resolver barrel.
 * Each faction that needs per-unit profile changes beyond the base resolver gets its own file.
 */
export { csmResolve } from '../codex_csm/resolver';
export { cdResolve, SACRED_NUMBERS } from './chaos_daemons';
export { smResolve } from './space_marines';
