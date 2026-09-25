import { parseInvSaveFromAbilities } from '../engine/equipMods';

/**
 * A unit's effective Ward Save, from every source that grants one unconditionally.
 *
 * CORE RULES 1.264: "Ward saves (if available) are unaffected by AP and may be attempted if the
 * normal save fails." A unit can be handed one by four different things, and they are NOT
 * interchangeable — each arrives on a different field:
 *
 *   datasheet   the unit's own printed abilities        Daemon 5+, Greater Daemon 4+, Warded 6+
 *   equipment   something bought from the Armory        Terminator armor 5+, Cataphractii 4+
 *   options     an option-group choice that grants one  Wildork 6+, Fortress on Wheels 5+
 *   traits      an army trait's inv_save effect         Iron Within, Berserk(5+)
 *
 * This lived inside `UnitCard` and nowhere else, so the UNIT CARD was the only place a ward save
 * appeared. The printed datacard read `equipMods.invulnSave` alone — equipment only — and the
 * Battle View did not look at all. Measured before fixing: **163 of 666 datasheets across all 18
 * factions** state a ward save in their own abilities, so every daemon, every Custodian, every
 * Harlequin and every C'tan printed a card with no ward on it and showed none mid-game. Same shape
 * as the Toxin Sacs report the day before, which is why the whole derivation moves out here rather
 * than the one missing source being added to each view.
 *
 * Lower is better, so the best available value wins.
 */
export interface WardSources {
  /** The unit's own datasheet abilities. */
  abilities?: string[] | null;
  /** `equipMods.invulnSave` — from purchased Armory equipment. */
  equipInvSave?: number | null;
  /**
   * Abilities granted by a selected option-group choice (the resolver's `optionAbilities`) --
   * e.g. a Dire Avenger Exarch's purchased Shimmershield. These are gated on the option actually
   * being SELECTED, unlike the datasheet's own `abilities`, which is why they are a separate
   * field rather than folded in with them.
   */
  optionAbilities?: string[] | null;
  /** Trait-granted abilities; an `inv_save` effect arrives as "5+ Ward Save", Berserk as its own name. */
  traitAbilities?: Array<{ name: string }> | null;
}

/**
 * Trait-granted ward saves arrive as an ability NAME, in two shapes: an `inv_save` effect is
 * written "5+ Ward Save" (see resolver.ts), and Berserk(X+) names no save at all -- per the Core
 * Rules it simply IS an X+ ward save, so it has to be recognised on its own.
 */
/**
 * Abilities that ARE a ward save while naming no number, because the value lives in the codex's
 * Index rather than on the datasheet. The datasheet's ability line carries only the NAME, so
 * nothing in the text for `parseInvSaveFromAbilities` to find.
 *
 * ADEPTUS SORORITAS "Shield of Faith" (Adeptus Sororitas 1.01.ods, Index row 16): "The model
 * receives a 6+ ward save." Twenty-three of the faction's twenty-eight datasheets carry it and
 * THIRTEEN showed no ward save at all; the other ten already had a better one from elsewhere, and
 * the best value still wins, so nothing regresses for them.
 *
 * Swept every Index tab in the game for this shape and Shield of Faith is the only one. Checked
 * and REJECTED while looking: the Grey Knights' Aegis(X+) reads like a save and is not one --
 * Core Rules 1.264: "The model can dispel any psychic power directly targeting it on a roll of
 * X+", which is why it is correctly parsed as nothing.
 */
const NAMED_WARD_ABILITIES: Record<string, number> = {
  'shield of faith': 6,
};

function fromNamedAbilities(abilities: string[] | null | undefined): number | null {
  let best: number | null = null;
  for (const a of abilities ?? []) {
    // The line is often a comma-joined list ("Acts of Faith, Shield of Faith"), so match the NAME
    // anywhere in it rather than requiring the whole ability to be that one word.
    for (const [name, value] of Object.entries(NAMED_WARD_ABILITIES)) {
      if (!String(a).toLowerCase().includes(name)) continue;
      if (best === null || value < best) best = value;
    }
  }
  return best;
}

function fromTraitAbilities(traits: Array<{ name: string }> | null | undefined): number | null {
  let best: number | null = null;
  for (const t of traits ?? []) {
    const ward = t.name.match(/^(\d)\+\s+(?:Ward|Invulnerability)/i);
    const berserk = t.name.match(/^Berserk\((\d)\+\)/i);
    const m = ward ?? berserk;
    if (!m) continue;
    const v = parseInt(m[1], 10);
    if (best === null || v < best) best = v;
  }
  return best;
}

export function wardSave(src: WardSources): number | null {
  const candidates = [
    parseInvSaveFromAbilities(src.abilities ?? []),
    fromNamedAbilities(src.abilities),
    src.equipInvSave ?? null,
    parseInvSaveFromAbilities(src.optionAbilities ?? []),
    fromNamedAbilities(src.optionAbilities),
    fromTraitAbilities(src.traitAbilities),
  ].filter((v): v is number => v !== null);
  return candidates.length ? Math.min(...candidates) : null;
}

/**
 * The same answer, plus each source's own value, so a caller can say WHICH one won without
 * re-deriving any of them. The unit card's little source marker has its own tie-breaking rule
 * (equipment wins a tie with the datasheet, a trait does not win a tie with equipment) and that
 * rule is the card's, not this module's — so the values are handed back rather than a verdict.
 */
export function wardSources(src: WardSources): {
  value: number | null;
  datasheet: number | null;
  equipment: number | null;
  option: number | null;
  trait: number | null;
} {
  const datasheet = parseInvSaveFromAbilities(src.abilities ?? []);
  const equipment = src.equipInvSave ?? null;
  const option = parseInvSaveFromAbilities(src.optionAbilities ?? []);
  const trait = fromTraitAbilities(src.traitAbilities);
  const present = [datasheet, equipment, option, trait].filter((v): v is number => v !== null);
  return { value: present.length ? Math.min(...present) : null, datasheet, equipment, option, trait };
}

/**
 * The datasheet abilities that actually apply to THIS roster entry.
 *
 * A datasheet prints its optional wargear's rule text in the same `abilities` block as its innate
 * rules, prefixed with the item's name — "Weavefield crest: The model gains a 4+ ward save." sits
 * one line under "Exo-armor: The model gains a 5+ ward save.", and only the second is free. The
 * Abilities SECTION already hides the unbought ones (`selectedAbilities`, which drops any line
 * whose label matches an unselected choice), but the ward derivation read the raw list, so four
 * units handed out a save you are supposed to pay for: Impulsor/Shield dome, Stormsurge/Shield
 * generator, Voidreavers/Mistshield and Einhyr Hearthguard/Weavefield crest (the last one upgrading
 * a real innate 5+ to a free 4+).
 *
 * Kept here rather than reusing `selectedAbilities` because that needs a fully resolved profile and
 * this needs only the option selections — the unit card derives the ward long before it builds its
 * abilities list.
 */
export function ownWardAbilities(
  u: { abilities?: string[] | null; option_groups?: Array<{ choices?: Array<{ name: string }> }> | null },
  item: { optionQty?: Record<number, Record<number, number>> | null },
): string[] {
  const unbought = new Set<string>();
  (u.option_groups ?? []).forEach((g, gi) => {
    (g.choices ?? []).forEach((c, ci) => {
      if (!(item.optionQty?.[gi]?.[ci] ?? 0)) unbought.add(c.name.trim().toLowerCase());
    });
  });
  if (unbought.size === 0) return u.abilities ?? [];
  return (u.abilities ?? []).filter(ab => {
    const colon = ab.indexOf(':');
    if (colon < 1) return true;
    const label = ab.slice(0, colon).trim();
    if (unbought.has(label.toLowerCase())) return false;
    // A specialisation prints its own name on a LINE OF ITS OWN above the rule it grants, so the
    // label spans two lines and matched no choice name. An unbought Magos specialisation
    // ("Technoarchaeologist" / "Seekers of Divine Arcana", which grants "Warded") therefore
    // improved the Magos's innate 5+ ward to a free 4+ (GH#139).
    const firstLine = label.split(/\r?\n/)[0].trim().toLowerCase();
    return !unbought.has(firstLine);
  });
}
