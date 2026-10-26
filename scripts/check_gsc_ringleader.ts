/** GH#261: Ringleader units share one HQ slot, and Synaptic Resonance is psyker-only. */
import { FACTION_LOADERS } from '../src/data/loaders';
import { computeRingleaderFreeSlots } from '../src/engine/validators';
import { isPsykerOnlyTrait } from '../src/engine/traitEffects';
(async () => {
  const d: any = await (FACTION_LOADERS as any)['genestealer_cults']();
  const mk = (id: string, n: string): any => ({ id, unitName: n, slot: 'HQ', size: 1, optionQty: {}, armory: [], traits: [], powers: [], prayers: [], pacts: [] });
  const credit = (...n: string[]) => computeRingleaderFreeSlots(n.map((x, i) => mk('u' + i, x)), d).hq;
  const fails: string[] = [];
  if (credit('Magus', 'Primus') !== 1) fails.push('Magus + Primus must share one HQ slot');
  if (credit('Magus', 'Primus', 'Acolyte Iconward') !== 1) fails.push('three Ringleaders fill two slots (credit 1)');
  if (credit('Magus') !== 0) fails.push('a lone Ringleader gets no credit');
  if (credit('Magus', 'Magus') !== 0) fails.push('the same unit twice is not a pair');
  if (!isPsykerOnlyTrait('Synaptic Resonance')) fails.push('Synaptic Resonance must be psyker-only');
  if (d.units['Primus'].is_psyker) fails.push('the Primus is not a psyker');
  if (fails.length) { console.error('FAIL\n' + fails.join('\n')); process.exit(1); }
  console.log('OK  Ringleader pairs share an HQ slot; Synaptic Resonance is psyker-only');
})();
