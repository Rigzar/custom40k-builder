import type { ArmoryItem, FactionData, Unit } from '../types/data';

/**
 * Armory items whose own text restricts the buyer ("Kroot only", "Only for Infantry", "Painboy only") but carry no gate in
 * the data, so any unit with Armory access could buy them (Birdy 2026-11-15: a R'varna with Knarloc steed, Wings and
 * Pech'ra). The gate is read from the item's own sentence at load time, so a sheet update keeps it. An item that already
 * carries a gate is left alone. Legacy restrictions ("Vior'la Sept only") are a different mechanism: legacyItemAllowed.
 *
 * Three kinds of gate come out of a sentence:
 *  - keywords (unit type / flag): requires_keywords (any), requires_all_keywords (all), excludes_keywords;
 *  - role names ("Painboy only", "Only for Librarians"): requires_unit_names, matched against the unit, its models and its
 *    active promotion ("Legion Praetor only" is a promoted Centurion, "Spanna only" a promoted Loota);
 *  - another item on the same model ("Exo-armor only", "Only for models on a Jetbike"): requires_owned_item.
 * A role sentence is only turned into a gate when at least one unit of the faction answers to it, so a misspelt name on a
 * sheet never locks an item away from everyone (it is reported instead: scratch_cx/_only_left.ts).
 */

type Gate = Pick<ArmoryItem, 'requires_keywords' | 'requires_all_keywords' | 'excludes_keywords' | 'requires_unit_names' | 'requires_owned_item'>;

/** Whole-sentence keyword gates (the sentence with its final period removed). */
const KEYWORD_SENTENCES: Array<[RegExp, Gate]> = [
  [/^Kroot infantry only$/i, { requires_all_keywords: ['Kroot', 'Infantry'] }],
  [/^Kroot only$/i, { requires_keywords: ['Kroot'] }],
  [/^(?:Only for infantry|Infantry only|For infantry only)$/i, { requires_keywords: ['Infantry'] }],
  [/^Only for Infantry and Jump pack units$/i, { requires_keywords: ['Infantry', 'Jump pack', 'Jump Pack Infantry'] }],
  [/^Only for infantry characters$/i, { requires_all_keywords: ['Infantry', 'Character'] }],
  // "Only for characters in Terminator armor": the armour is often bought, which the static keyword set cannot see; the
  // character half is the part that can be checked here.
  [/^Only for characters in Terminator armou?r$/i, { requires_keywords: ['Character'] }],
  // Dominic 2026-11-15: characters, plus any model in a unit called "Command Squad" (keyword from the unit name, keywords.ts).
  [/^Only for characters and Command squads$/i, { requires_keywords: ['Character', 'Command Squad'] }],
  [/^(?:Psyker only|Only for psykers)$/i, { requires_keywords: ['Psyker'] }],
  [/^Only for Ethereals$/i, { requires_keywords: ['Ethereal'] }],
  [/^(?:Only for Bikes|Bikes? only)$/i, { requires_keywords: ['Bike'] }],
  [/^(?:Only for characters|Characters? only|Only for Character models)$/i, { requires_keywords: ['Character'] }],
  [/^Gravis armou?r only$/i, { requires_keywords: ['Gravis'] }],
  [/^Vehicle only$/i, { requires_keywords: ['Vehicle'] }],
  [/^(?:Walker only|Only for Walkers)$/i, { requires_keywords: ['Walker', 'Super-heavy Walker'] }],
  [/^Non-walker or aircraft vehicle only$/i, { requires_keywords: ['Vehicle', 'Super-heavy Vehicle'], excludes_keywords: ['Walker', 'Super-heavy Walker', 'Flyer'] }],
  [/^Only for models in Cataphractii or Terminator armou?r$/i, { requires_keywords: ['Cataphractii', 'Terminator', 'Tartaros'] }],
  [/^Only for models with the Mark of (Khorne|Nurgle|Slaanesh|Tzeentch)$/i, {}],
  [/^Only for units without the Flyer type$/i, { excludes_keywords: ['Flyer'] }],
  // another item on the same model
  [/^Exo-armou?r only$/i, { requires_owned_item: 'Exo-armor' }],
  [/^Only for models on a Jetbike$/i, { requires_owned_item: 'Eldar jetbike' }],
  // "Only for models with a Cult icon" (GSC Pennant of Ascension): the author answered "a unit that has taken the Cult icon
  // option", but no unit with that option has Armory access, so a gate would make the item unbuyable. Left open, asked again.
  // atypicalhero 2026-11-15: any vehicle with a transport capacity ('Transport' keyword, keywords.ts).
  [/^Transport vehicle only$/i, { requires_all_keywords: ['Vehicle', 'Transport'] }],
  [/^Only for Kroot Shapers with Krootox steed$/i, { requires_unit_names: ['shaper'], requires_owned_item: 'Krootox steed' }],
  [/^Mek in Mega armou?r only$/i, { requires_unit_names: ['mekboy'], requires_owned_item: 'Mega armor' }],
];

/** Role words whose unit is called something else ("Mek" is the Mekboy; a Big Mek is a separate role, see "Mek and Big Mek only"). */
const ROLE_ALIASES: Record<string, string[]> = {
  mek: ['mekboy'],
  'mek junka': ['mekboy junka'],
  shaper: ['shaper'],
  'kroot shaper': ['shaper'],
};

/** lowercase, apostrophes and hyphens unified, a leading "Legion" dropped, a plural ending dropped. */
export function normRole(s: string): string {
  let t = s.toLowerCase().replace(/[’`]/g, "'").replace(/[-‐]/g, ' ').replace(/<|>/g, '').replace(/\s+/g, ' ').trim();
  t = t.replace(/^legion /, '').replace(/ (?:units?|models?)$/, '');
  return t.split(' ').map(w => w.length > 3 ? w.replace(/ies$/, 'y').replace(/(?<!s)[sz]$/, '') : w).join(' ');
}

/** The names a buyer answers to: the unit, its models, and its active promotion. */
export function buyerRoleNames(unit: Unit, activeVariantName?: string | null): string[] {
  return [unit.name, ...(unit.models ?? []).map(m => m.name), ...(activeVariantName ? [activeVariantName] : [])].map(normRole);
}

export function roleMatches(required: string[], names: string[]): boolean {
  return required.some(r => names.some(n => n === r || n.endsWith(' ' + r)));
}

/** Is the named item (glyphs and case ignored) already on this model? */
export function ownsItem(required: string, boughtNames: Iterable<string>): boolean {
  const k = (s: string) => s.toLowerCase().replace(/[^\x20-\x7e]/g, '').trim();
  const want = k(required);
  for (const n of boughtNames) if (k(n) === want || k(n).startsWith(want + ' (')) return true;
  return false;
}

/** Has the unit taken a datasheet option whose header or choice names the item ("...replace their Autopistol with a Cult icon")? */
export function ownsOption(unit: Unit, optionQty: Record<string, Record<string, number | boolean>> | undefined, required: string): boolean {
  const want = required.toLowerCase();
  return (unit.option_groups ?? []).some((g, gi) => {
    const q = optionQty?.[gi] ?? optionQty?.[String(gi)];
    if (!q) return false;
    if (g.choices?.length) return g.choices.some((c, ci) => Number(q[ci] ?? 0) > 0 && c.name.toLowerCase().includes(want));
    return !!q['__inline'] && (g.header ?? '').toLowerCase().includes(want);
  });
}

function sentencesOf(desc: string): string[] {
  return desc.split(/(?<=[.!])["”]?\s+/).map(s => s.replace(/["”]/g, '').replace(/[.!]\s*$/, '').trim()).filter(Boolean);
}

export function applyTextGates(data: FactionData): void {
  const allNames = Object.values(data.units).flatMap(unitNamesWithVariants);   // vehicles take Kustom Jobs without has_armory_access
  const arms = [data.armory_general, ...Object.values(data.armory_marks ?? {}), ...Object.values(data.armory_legions ?? {})];
  for (const a of arms) {
    if (!a) continue;
    for (const sec of ['weapons', 'equipment', 'daemon_weapons'] as const) {
      for (const it of ((a as unknown as Record<string, ArmoryItem[] | undefined>)[sec] ?? [])) {
        if (it.category || it.requires_keywords?.length || it.requires_all_keywords?.length || it.excludes_keywords?.length
          || it.requires_unit_names?.length || it.requires_owned_item) continue;
        for (const s of sentencesOf(`${it.desc ?? ''} ${it.abilities ?? ''}`)) {
          const kw = KEYWORD_SENTENCES.find(([re]) => re.test(s));
          if (kw) {
            const god = s.match(/Mark of (Khorne|Nurgle|Slaanesh|Tzeentch)$/i)?.[1];
            Object.assign(it, god ? { requires_keywords: [god, `Mark of ${god}`] } : structuredClone(kw[1]));
            break;
          }
          const role = s.match(/^Only for (?:the )?(.+)$/i)?.[1] ?? s.match(/^(.+?) only$/i)?.[1];
          if (!role || /\b(?:with|in|without|from|type|weapons?|armou?r|army|game|sept|world|order|host|league|fleet)\b/i.test(role)) continue;
          const parts = role.split(/\s*,\s*(?:and\s+|or\s+)?|\s+and\s+|\s+or\s+/).map(normRole).filter(Boolean);
          const req = parts.flatMap(p => ROLE_ALIASES[p] ?? [p]);
          if (req.length && roleMatches(req, allNames)) { it.requires_unit_names = req; break; }
        }
      }
    }
  }
}

function unitNamesWithVariants(u: Unit): string[] {
  return [u.name, ...(u.models ?? []).map(m => m.name), ...(u.variant_models ?? []).map(v => v.name)].map(normRole);
}
