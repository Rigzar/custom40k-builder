/**
 * An upgrade that is printed as a BARE name in the abilities block, with its rules on the lines below it.
 *
 * Tyranid Norn (GH#235): the sheet lists `Norn Emissary`, then `Psyker: ... 2 powers ...` and `Warp Barrier: ... 4+ ward
 * save`. The name has no text of its own, so it showed as an ability that did nothing when clicked, and the two lines
 * under it were shown (and the 4+ ward counted) on a Norn that had not bought the upgrade. The existing label-based
 * hiding only understands `Name: text` lines.
 *
 * A line with no colon whose name matches one of the datasheet's own option choices is such a header. It is never shown
 * (it has nothing to say); the lines below it, up to the next header, are shown only when the choice is bought.
 * Measured before writing this: it matches exactly one datasheet in the game (the Norn), so the rule is deliberately
 * narrow.
 */
const norm = (x: string) => x.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, ' ').trim();

export function hiddenUpgradeLines(
  u: { abilities?: string[] | null; option_groups?: Array<{ choices?: Array<{ name: string }> }> | null },
  item: { optionQty?: Record<number, Record<number, number>> | null },
): string[] {
  const all = new Set<string>();
  const bought = new Set<string>();
  (u.option_groups ?? []).forEach((g, gi) => (g.choices ?? []).forEach((c, ci) => {
    all.add(norm(c.name));
    if ((item.optionQty?.[gi]?.[ci] ?? 0) > 0) bought.add(norm(c.name));
  }));
  const abilities = u.abilities ?? [];
  const hidden: string[] = [];
  let current: { header: string; bought: boolean } | null = null;
  for (const line of abilities) {
    const isHeader = !line.includes(':') && all.has(norm(line));
    if (isHeader) {
      current = { header: line, bought: bought.has(norm(line)) };
      hidden.push(line);
    } else if (current && !current.bought) {
      hidden.push(line);
    }
  }
  return hidden;
}
