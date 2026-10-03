/** Lists, per unit, equipped_with clause labels that name no model row of the unit. */
import { FACTION_LOADERS } from '../src/data/loaders';
type Any = any;
(async () => {
  for (const [fk, load] of Object.entries<Any>(FACTION_LOADERS as Any)) {
    const d: Any = await load();
    for (const [uname, u] of Object.entries<Any>(d.units ?? {})) {
      const names = [...(u.models ?? []), ...(u.variant_models ?? [])].map((m: Any) => String(m.name).toLowerCase());
      const clauses = [...String(u.equipped_with ?? '').matchAll(
        /(?:Every|Each|The|An?) ([^.]+?) is (?:a single character model and |a single model and |a single model |a single character and |a character model and |a character and |)equipped with:\s*([^.]+)\./g)];
      if (clauses.length < 2 && !(clauses.length === 1 && u.models.length > 1)) continue;
      for (const c of clauses) {
        const label = c[1].trim().toLowerCase();
        const parts = label.split(/\s*\band\b\s*/);
        if (names.includes(label) || (parts.length > 1 && parts.every(p => names.includes(p)))) continue;
        console.log(`${fk} / ${uname}: clause says "${c[1].trim()}" — models are: ${(u.models ?? []).map((m: Any) => m.name).join(' | ')}`);
      }
    }
  }
})();
