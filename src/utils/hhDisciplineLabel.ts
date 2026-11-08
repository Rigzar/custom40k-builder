/**
 * Horus Heresy books: the discipline key carries its gate ("Stormcalling (White Scars)", "Bladesinging (Khenetai upgrade)"), the sheet writes it
 * differently ("Stormcalling (Legacy)", "Bladesinging (Khenetai upgrade only)"). The label is what the sheet says; the key stays what PsychicModal gates on.
 * Only the tags the two books produce are rewritten, so no other faction's discipline name is touched.
 */
const LEGIONS = new Set([
  'Dark Angels', 'White Scars', 'Space Wolves', 'Imperial Fists', 'Blood Angels', 'Iron Hands', 'Ultramarines', 'Salamanders', 'Raven Guard',
  "Emperor's Children", 'Iron Warriors', 'Night Lords', 'World Eaters', 'Death Guard', 'Thousand Sons', 'Sons of Horus', 'Word Bearers', 'Alpha Legion', 'Blackshields',
]);

export function hhDisciplineLabel(key: string): string {
  const m = /^(.+?) \(([^)]+)\)$/.exec(key);
  if (!m) return key;
  const [, base, tag] = m;
  if (tag === 'Anathemata') return base;
  if (LEGIONS.has(tag)) return `${base} (Legacy)`;
  if (tag === 'Legion Tactical Squad') return `${base} (Legion Tactical Squad leaders only)`;
  if (/^(Khenetai|Ammitara) upgrade$/.test(tag)) return `${base} (${tag} only)`;
  return key;
}
