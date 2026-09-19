import type { ArmoryItem, Trait } from '../types/data';

/**
 * Several factions put ALL their Legacy armouries in ONE file and separate the items with a
 * sentence in each item's own text — "Dread Host only.", "Forge World Metalica only.", "Order of
 * the Bloody Rose only.", "Alaitoc only.", "Ymyr Conglomerate only." Every Legacy in such a faction
 * carries the SAME `armory_key`, so the tab loads the whole file, and nothing enforced the line:
 * pick League of Warriors and you could buy the Ymyr Conglomerate relic.
 *
 * Eight factions are built this way — Adeptus Custodes, Adeptus Mechanicus, Adeptus Sororitas,
 * Eldar, Leagues of Votann, Necrons, Orks, Tau Empire — about 48 Legacies and 50 unique relics.
 *
 * THE MAPPING IS ALREADY IN THE DATA and is not hand-written per faction: each Legacy's own
 * description names its armoury ("The army has access to the Ymyr Conglomerate armory"), so the
 * gate is derived from the text.
 *
 * ONLY a gate naming one of THIS faction's own Legacy armouries is enforced. An item is free to say
 * "Psyker only.", "One use only." or "Terminator only." — those are different restrictions, handled
 * elsewhere or not at all, and eating them would hide items that should be on the list.
 */

/**
 * The sub-faction a Legacy's own text grants, which is what the item gates name.
 *
 * The codices write this two ways and the richer one has to be tried FIRST, or the shorter pattern
 * swallows it and returns the shared armoury instead of the sub-faction:
 *
 *   "access to equipment from the Order of the Valorous Heart in the Order Armory"  -> the Order
 *   "access to equipment from the Alaitoc Craftworld in the Craftworld Armory"      -> the Craftworld
 *   "access to the Ymyr Conglomerate armory"                                        -> the League
 *
 * Five factions use the first shape (Sororitas, Eldar, Necrons, Orks, Tau) and three the second
 * (Custodes, Adeptus Mechanicus, Leagues of Votann).
 */
export function legacyArmouryName(legacy: Pick<Trait, 'desc'>): string | null {
  const desc = String(legacy.desc ?? '');
  const nested = desc.match(/equipment from the\s+(.+?)\s+in the\s+.+?\s+[Aa]rmou?ry/);
  if (nested) return nested[1].trim();
  const plain = desc.match(/(?:access to|from) the\s+(.+?)\s+[Aa]rmou?ry/);
  return plain ? plain[1].trim() : null;
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

/** Every "<name> only." clause in an item's text. An item can carry several. */
function gatesOf(item: ArmoryItem): string[] {
  const text = `${(item as { abilities?: string }).abilities ?? ''} ${item.desc ?? ''}`;
  return [...text.matchAll(/([A-Z][A-Za-z'’ -]+?)\s+only\./g)].map(m => norm(m[1]));
}

/**
 * A predicate for the Legacy-armoury tab: does this item belong to one of the ACTIVE legacies?
 *
 * `legacies` is the faction's whole list (to learn which gate words are Legacy names at all) and
 * `activeNames` the one or two the army has actually taken.
 */
export function legacyItemAllowed(
  legacies: Array<Pick<Trait, 'name' | 'desc'>>,
  activeNames: string[],
): (item: ArmoryItem) => boolean {
  // Every armoury name this faction's legacies can grant, and which of them are switched on.
  const all = new Set<string>();
  const active = new Set<string>();
  for (const l of legacies) {
    const armoury = legacyArmouryName(l);
    if (!armoury) continue;
    all.add(norm(armoury));
    if (activeNames.includes(l.name)) active.add(norm(armoury));
  }
  if (!all.size) return () => true;

  /** A gate matches an armoury name loosely: the sheets write "Metalica" and "Forge World
   *  Metalica", "Ymyr Conglomerate" both ways. Substring either direction, never across words. */
  const hits = (gate: string, names: Set<string>) =>
    [...names].some(n => n === gate || n.endsWith(' ' + gate) || gate.endsWith(' ' + n)
      || n.startsWith(gate + ' ') || gate.startsWith(n + ' '));

  return (item: ArmoryItem) => {
    const gates = gatesOf(item);
    // Only the gates that name one of this faction's Legacy armouries are ours to enforce.
    const ours = gates.filter(g => hits(g, all));
    if (!ours.length) return true;                 // "Psyker only.", "One use only.", ungated
    return ours.some(g => hits(g, active));
  };
}
