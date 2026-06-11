/**
 * codex_eldar/special-abilities — category 4 of 5 (Special ability).
 *
 * Migrated from `rules-model/eldar.md` §4-§5 (grounded in the `.ods` canon).
 *
 * Anti-duplication: the 6 archetypes / 5 legacies / 15 traits stay canonical in `archetypes.json`
 * (cross-check 6/5/15 exact); the Craftworld/Ynnari armories live under `armory/`; the Eldar
 * psychic discipline + Revenant are NOT in production yet (`ki-eldar-psychic-unwired-01`). This
 * file documents the army-rule MECHANICS + customisation structure.
 */

export interface EldarSpecialAbilityEntry {
  name: string;
  category: 'army-rule' | 'cast-system' | 'archetype' | 'legacy' | 'trait' | 'gap-note';
  text: string;
}

// Source: rules-model/eldar.md §4 (army rules) + §5 (archetypes/legacies/traits).
export const ELDAR_SPECIAL_ABILITIES: EldarSpecialAbilityEntry[] = [
  // --- §4 army rules ---
  {
    name: 'Battle Focus (signature army rule)',
    category: 'army-rule',
    text: 'Verbatim (Index): "\'Assault\', \'Grenade\' and \'Pistol\' weapons ignore the to-hit ' +
      'penalty for \'Advance\' and \'Charge\' orders. \'Heavy\' weapons can be used without penalty ' +
      'with \'Move & Shoot\' and at -1 with \'Advance\'/\'Charge\'. All psychic powers are treated ' +
      'as \'Basic\'." The defining Eldar mobility + psychic rule.',
  },
  {
    name: 'Shuriken',
    category: 'army-rule',
    text: 'Verbatim (Index): "To wound rolls of 5+ gain additional -2 AP." The signature Eldar ' +
      'weapon rule (the Hail of Doom trait grants Shuriken a further -1 AP).',
  },
  {
    name: 'Visitors of the Black Library (Harlequin access)',
    category: 'army-rule',
    text: 'Verbatim (Index): "Access to Harlequin units. Harlequins cannot be the mandatory HQ ' +
      'selection." Native-ally grant (identical to Dark Eldar\'s).',
  },
  {
    name: 'Webway strike',
    category: 'army-rule',
    text: 'Verbatim (Index): "For each started 1000 points, one infantry unit may be set up using ' +
      'Infiltrators for +1 point per Wound." (Same shape as Dark Eldar\'s Webway raid / Custodes ' +
      'Lightning strike.)',
  },

  // --- §4 cast-system ---
  {
    name: 'Psykers + Eldar psychic discipline',
    category: 'cast-system',
    text: 'Eldar has 6 `is_psyker` units (Farseer/Spiritseer/Wraithseer/Warlocks/Yncarne/+1) and a ' +
      'large faction discipline (`.ods` "Eldar psychic discipline", 64 rows) + the Ynnari "Revenant" ' +
      'discipline (via the Ynnari archetype). ⚠ NOT in production — see gap-note below.',
  },

  // --- §5 Archetypes (6) ---
  {
    name: 'Archetypes (6 total)',
    category: 'archetype',
    text: 'Budget 0-1 Archetype. Aspect Focus (<Aspect> units→Troops; non-<Aspect> Troops→Elite) + ' +
      'Wraithhost (Wraithblades/Wraithguard→Troops; non-<Wraith> Troops→Elite) gate on sub-types ' +
      'NOT currently in production `keywords[]` (gap-note below). Exemplars of the Shrines (Exarchs ' +
      'gain two powers, no longer unique). LIIVI (access a single Vindicare assassin; one HQ must ' +
      'be a Farseer — cross-ref the universal Assassins system). Windhost (Windriders→Troops; ' +
      '<12"M units must start embarked). Ynnari → cross-faction (Battle Brothers for Dark Eldar; ' +
      'access Ynnari Armory + Revenant discipline; "no Legacy"). Canonical in `archetypes.json`.',
  },

  // --- §5 Legacies (5) — each = one Craftworld ---
  {
    name: 'Legacies (5 total — each = one Craftworld)',
    category: 'legacy',
    text: 'Fieldcraft→Alaitoc / Foresight of the Damned→Ulthwé / Stoic Endurance→Iyanden / ' +
      'Swordwind→Biel-Tan / Wild Host→Saim-Hann. Each grants that Craftworld\'s Armory (under ' +
      '`armory/legion_craftworld.json`).',
  },

  // --- §5 Traits (15) ---
  {
    name: 'Traits (15 total — army-wide, 3-column pricing)',
    category: 'trait',
    text: 'Budget 0-2 Traits. 3-column NORMAL/CHARACTER/MC&V pricing (`*` = per Wound/Hull): Black ' +
      'Guardians / Children of Khaine / Children of Morai-Heg / Children of Prophecy (psyker ' +
      're-roll) / Children of the Open Skies / Combined War Host (→"2nd Legacy") / Elite Citizenry / ' +
      'Expert Crafters / Grim / Hail of Doom (boosts Shuriken) / Masterful Shots / Masters of ' +
      'Concealment / Mobile Fighters / Savage Blades / Students of Vaul. Canonical in `archetypes.json`.',
  },

  // --- §6 gap notes ---
  {
    name: '<Aspect>/<Wraith> sub-types not keyword-modelled (ki-eldar-aspect-wraith-keyword-01)',
    category: 'gap-note',
    text: 'Aspect Focus + Wraithhost archetypes gate on `<Aspect>`/`<Wraith>` (per the `.ods`), but ' +
      'all 38 units carry `keywords: []` — so these sub-types are not keyword-tagged (unlike Dark ' +
      'Eldar\'s Kabal/Coven/Cult which ARE). Candidate: tag the Aspect Warriors (Dire Avengers/Fire ' +
      'Dragons/Howling Banshees/Striking Scorpions/Dark Reapers/Swooping Hawks/Warp Spiders/Shining ' +
      'Spears/Shadow Spectres) "Aspect" + the Wraith units (Wraithblades/Wraithguard/Wraithlord/' +
      'Wraithseer) "Wraith", bringing Eldar in line with the Dark Eldar keyword model.',
  },
  {
    name: 'Eldar psychic discipline + Revenant not wired (ki-eldar-psychic-unwired-01)',
    category: 'gap-note',
    text: 'The `.ods` has a large "Eldar psychic discipline" (64 rows) + the Ynnari Revenant ' +
      'discipline, and Eldar has 6 psyker units, but `loaders.ts` loads only units+general+' +
      'archetypes+Craftworld+Ynnari armories — no psychic-discipline file (disciplines slot `{}`). ' +
      'Same gap class as IG (`ki-ig-psychic-unwired-01`). Larger separate scope.',
  },
];
