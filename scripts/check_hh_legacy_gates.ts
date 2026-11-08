import { FACTION_LOADERS } from '../src/data/loaders';
import { archetypeRequiredLegacy, legionTraitAllowed } from '../src/lib/legacyGatedChoices';
(async () => {
  let bad = 0;
  for (const k of ['horus_heresy_loyal', 'horus_heresy_traitor']) {
    const d: any = await (FACTION_LOADERS as any)[k]();
    const names = new Set(d.legacies.map((l: any) => l.name));
    for (const a of d.archetypes) { const n = archetypeRequiredLegacy(a, d.faction); if (n && !names.has(n)) { console.log('UNKNOWN LEGACY', a.name, n); bad++; } }
    for (const l of d.legacies) {
      const ok = d.traits.filter((t: any) => legionTraitAllowed(t, [l]));
      console.log(k, l.name.padEnd(32), 'traits', ok.length, 'archetypes', d.archetypes.filter((a: any) => { const n = archetypeRequiredLegacy(a, d.faction); return !n || n === l.name; }).length);
    }
    const open = d.traits.filter((t: any) => legionTraitAllowed(t, [])).length;
    console.log(k, 'no legacy -> traits', open, 'of', d.traits.length);
    if (open !== d.traits.length) { console.log('TRAITS ARE NOT OPEN TO EVERY LEGION'); bad++; }
  }
  process.exit(bad ? 1 : 0);
})();
