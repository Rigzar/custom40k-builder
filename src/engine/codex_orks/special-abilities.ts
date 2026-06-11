/**
 * codex_orks/special-abilities — category 4 of 5 (Special ability).
 *
 * Migrated from `rules-model/orks.md` §4-§5 (grounded in the `.ods` canon).
 *
 * Anti-duplication: the 2 archetypes / 6 legacies / 14 traits stay canonical in `archetypes.json`
 * (cross-check 2/6/14 exact); the 6 Clan armories live in `legion_clan.json`; the Ork (Waaagh!)
 * psychic discipline is NOT in production yet (`ki-orks-psychic-unwired-01`). This file documents
 * the army-rule MECHANICS + customisation structure.
 */

export interface OrkSpecialAbilityEntry {
  name: string;
  category: 'army-rule' | 'cast-system' | 'archetype' | 'legacy' | 'trait' | 'gap-note';
  text: string;
}

// Source: rules-model/orks.md §4 (army rules) + §5 (archetypes/legacies/traits).
export const ORK_SPECIAL_ABILITIES: OrkSpecialAbilityEntry[] = [
  // --- §4 army rules ---
  {
    name: 'Waaagh! (signature mechanic)',
    category: 'army-rule',
    text: 'Verbatim (Index): "Declare a Waaagh! once per game at the start of the Command phase, ' +
      'lasting two battle rounds. Infantry and Walkers with the \'Waaagh!\' rule gain +D6" Movement ' +
      '(not counted for weapon-firing). Other vehicles/Bikes/Jump-pack infantry gain \'Deflect\' ' +
      'instead if they moved their max (≥8"). In Skirmish the effect lasts one round." The defining ' +
      'Ork army-wide rule.',
  },
  {
    name: 'Mob',
    category: 'army-rule',
    text: 'Verbatim (Index): "+1 Leadership per 5 models with this rule; Fearless at 20+ models; a ' +
      'unit reduced below half strength may merge with another Mob unit within 2" during the Rally ' +
      'phase, thereafter acting as one unit with one shared order." The Ork horde mechanic.',
  },
  {
    name: 'Dakka Dakka Dakka',
    category: 'army-rule',
    text: 'Verbatim (Index): "The unit reduces its total ranged to-hit penalty by -1 (min 0). ' +
      'Barrage and Explosive weapons do not benefit." Army-wide.',
  },
  {
    name: 'Tellyporta',
    category: 'army-rule',
    text: 'Verbatim (Index): "For every 1000 points, a unit may be set up for +1/+4 per Wound/Hull ' +
      'Point via Deep strike. All Ork units have this rule." (Same shape as Custodes Lightning ' +
      'strike / GK Teleport strike — but army-wide on ALL units.)',
  },

  // --- §4 cast-system ---
  {
    name: 'Psykers (Weirdboy) + Waaagh! discipline',
    category: 'cast-system',
    text: 'Orks have psyker units (Weirdboy). The `.ods` has an "Ork psychic discipline" (19 rows, ' +
      'the Waaagh! discipline). ⚠ NOT in production — see gap-note below.',
  },

  // --- §5 Archetypes (2) ---
  {
    name: 'Archetypes (2 total)',
    category: 'archetype',
    text: 'Budget 0-1 Archetype. Krumpa Kompany (roster restricted to Boss/Mek/Painboy/Nobs/' +
      'Battlewagons/Deff Dreads; Nobs→Troops; all must take Mega armor; all gain Objective ' +
      'secured!), Speedfreaks (Stormboyz/Warbikers→Troops; <12"M units must start embarked). ' +
      'Canonical in `archetypes.json`.',
  },

  // --- §5 Legacies (6) — each = one Klan ---
  {
    name: 'Legacies (6 total — each = one Klan)',
    category: 'legacy',
    text: 'Each grants one Klan\'s Clan Armory (loaded as the \'Klan\' legacy): Da \'ardest Boyz→Goff ' +
      '/ Da Rich Boyz→Bad Moons / Da Sneaky Gitz→Blood Axes / Da Speedfreaks→Evil Sunz / Da Squig-' +
      'Luvvas→Snakebites / Da Lootaz→Deathskulls. Clan armories in `legion_clan.json`.',
  },

  // --- §5 Traits (14) ---
  {
    name: 'Traits (14 total — army-wide, 3-column pricing)',
    category: 'trait',
    text: 'Budget 0-2 Traits. 3-column NORMAL/CHARACTER/MC&V pricing (`*` = per Wound/Hull; several ' +
      'prose-gated "Only for Gretchins/Flyers"): \'orrible Gitz / Armed To Da Teeth / Big Krumpaz / ' +
      'Big Red Button / Boom Boyz / Flyboyz / Lucky Gitz / Mixed Warband (→"2nd Legacy") / No ' +
      'messing around here / Pyromaniacs / Rascals / Taktiks / The Old Ways / Waaagh! Coast Kustoms ' +
      '(each Kustom job +1 time). Canonical in `archetypes.json`.',
  },

  // --- §6 gap note ---
  {
    name: 'Ork (Waaagh!) psychic discipline not wired (ki-orks-psychic-unwired-01)',
    category: 'gap-note',
    text: 'The `.ods` has an "Ork psychic discipline" (19 rows, the Waaagh! discipline) and Orks ' +
      'have psyker units (Weirdboy), but `loaders.ts` imports only units+general+archetypes+Clan ' +
      'armory (disciplines slot `{}`). Same gap class as IG (`ki-ig-psychic-unwired-01`). Larger ' +
      'separate scope.',
  },
];
