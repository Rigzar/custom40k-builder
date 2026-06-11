/**
 * codex_dark_eldar/special-abilities — category 4 of 5 (Special ability).
 *
 * Migrated from `rules-model/dark_eldar.md` §4-§5 (grounded in the `.ods` canon).
 *
 * Anti-duplication: the 5 archetypes / 3 legacies / 22 traits stay canonical in `archetypes.json`
 * (cross-check 5/3/22 exact); the Coven/Kabal/Wych sub-faction armories live under `armory/`. The
 * sub-faction keyword axis itself lives in DARK_ELDAR_KEYWORDS (datasheet). This file documents the
 * army-rule MECHANICS + customisation structure.
 */

export interface DarkEldarSpecialAbilityEntry {
  name: string;
  category: 'army-rule' | 'archetype' | 'legacy' | 'trait';
  text: string;
}

// Source: rules-model/dark_eldar.md §4 (army rules) + §5 (archetypes/legacies/traits).
export const DARK_ELDAR_SPECIAL_ABILITIES: DarkEldarSpecialAbilityEntry[] = [
  // --- §4 army rules ---
  {
    name: 'Combat drugs',
    category: 'army-rule',
    text: 'Verbatim (Index): "After all units have been set up, you may pick a combat drug for the ' +
      'unit. Its effect lasts for the remaining battle." 6 drugs: Adrenalight (+1 Attack) / Grave ' +
      'lotus (+1 Strength) / Hypex (auto-advance 6") / Serpentin (+1 to hit melee) / Painbringer ' +
      '(+1 Toughness) / Splintermind (start with a Power-through-Pain token). The Stimulant supply ' +
      'equipment grants an additional drug.',
  },
  {
    name: 'Power through Pain (token economy)',
    category: 'army-rule',
    text: 'Verbatim (Index): "Each time an enemy unit is destroyed, the army gains a \'Power Through ' +
      'Pain\' token, assigned a special rule from the list, distributed to any friendly PtP unit..." ' +
      '6 bonuses: Aegis(4+) / Berserk(4+) / Furious Charge / +1 Initiative / +1 Leadership / +1 ' +
      'Strength. Joined characters pool tokens; split evenly on leaving. (NOTE: "Furious Charge" — ' +
      'a bonus NAME — leaked into the Elites slot index as a phantom unit, ' +
      '`ki-dark-eldar-furiouscharge-phantom-01`.)',
  },
  {
    name: 'Visitors of the Black Library (Harlequin access)',
    category: 'army-rule',
    text: 'Verbatim (Index): "The army has access to Harlequin units. Harlequins cannot be the ' +
      'mandatory HQ selection." A native-ally grant (cross-ref the Harlequins faction).',
  },
  {
    name: 'Webway raid',
    category: 'army-rule',
    text: 'Verbatim (Index): "For each started 1000 points of game size, one infantry unit ' +
      '(including attached character models) may be set up using the rules for Infiltrators for +1 ' +
      'point per wound." A points-scaled Infiltrate grant (cf. Custodes Lightning strike, GK ' +
      'Teleport strike).',
  },

  // --- §5 Archetypes (5) — 3 sub-faction-purity + Coordinated Raid + Ynnari ---
  {
    name: 'Archetypes (5 total)',
    category: 'archetype',
    text: 'Budget 0-1 Archetype. THREE are sub-faction-purity archetypes gating directly on the ' +
      'DARK_ELDAR_KEYWORDS datasheet axis (army restricted to one sub-faction, +1 Ld + double ' +
      'weapon-swap): Trueborn (Kabal-only), Haemoxytes (Coven-only), Bloodbrides (Cult-only). ' +
      'Coordinated Raid (3rd HQ slot, must field one Dracon + Haemonculus + Succubus; 3rd trait, ' +
      'one each for <Coven>/<Kabal>/<Wyches>). Ynnari → cross-faction (Battle Brothers for Eldar; ' +
      'access Ynnari Armory + Revenant discipline; "no Legacy"). Canonical in `archetypes.json`.',
  },

  // --- §5 Legacies (3) — each = one sub-faction armory ---
  {
    name: 'Legacies (3 total — each = one sub-faction armory)',
    category: 'legacy',
    text: 'Butchers of Flesh→Coven Armory / Spectacle of Murder→Wych Armory / Thirst for Power→' +
      'Kabal Armory. (The fourth "Ynnari Armory" comes via the Ynnari archetype, not a Legacy.) ' +
      'Sub-faction armories under `armory/`.',
  },

  // --- §5 Traits (22) — ALL sub-faction-gated ---
  {
    name: 'Traits (22 total — ALL sub-faction-gated)',
    category: 'trait',
    text: 'Budget 0-2 Traits (3 with Coordinated Raid). 3-column NORMAL/CHARACTER/MC&V pricing. ' +
      'EVERY trait is gated by a sub-faction via the `?`/`??` glyph → "Only for <Coven>/<Cult>/' +
      '<Kabal>" (the most granular trait-gating of any faction migrated; many additionally "Only ' +
      'for creatures"). Examples: Acrobatic Display / Dark Technomancers / Masters of Mutagens / ' +
      'Merciless Razorkin (Deflagrate w/ Splinter) / Splinter Blades / The Art of Pain (re-triggers ' +
      'the Power-through-Pain table in melee) / Toxin Crafters. Canonical in `archetypes.json`.',
  },
];
