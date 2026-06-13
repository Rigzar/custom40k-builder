/**
 * codex_adeptus_mechanicus/special-abilities — category 4 of 5 (Special ability).
 *
 * Migrated from `rules-model/adeptus_mechanicus.md` §4-§5 (grounded in the `.ods` canon).
 *
 * Anti-duplication: the 5 archetypes / 7 legacies / 16 traits stay canonical in `archetypes.json`
 * (cross-check 5/7/16 exact); the Forge World armories live in `armory/legion_forge_world.json`;
 * the 13 named Canticles live with the canticle system. This file documents the army-rule
 * MECHANICS + customisation structure.
 */

export interface AdMechSpecialAbilityEntry {
  name: string;
  category: 'army-rule' | 'cast-system' | 'archetype' | 'legacy' | 'trait' | 'gap-note';
  text: string;
}

// Source: rules-model/adeptus_mechanicus.md §4 (army rules) + §5 (archetypes/legacies/traits).
export const ADMECH_SPECIAL_ABILITIES: AdMechSpecialAbilityEntry[] = [
  // --- §4 army rules ---
  {
    name: 'Canticles of the Omnissiah (signature mechanic)',
    category: 'army-rule',
    text: 'Verbatim (Index): "At the start of the Command phase, choose a single Canticle of the ' +
      'Omnissiah. All units with this rule that are partially within 9" of a model with \'Choir ' +
      'Master\' roll a D6; on a 4+, they gain the benefits of the chosen Canticle until the end of ' +
      'the Battle Round." 6 base Canticles: Benediction of Omniscience / Chant of the Remorseless ' +
      'Fist / Incantation of the Iron Soul / Invocation of Machine-might / Litany of the ' +
      'Electromancer / Shroudpsalm. Plus 7 Legacy Canticles (one per Forge World legacy, §5). ' +
      'Carried by 22/29 units.',
  },
  {
    name: 'Choir Master',
    category: 'army-rule',
    text: 'Verbatim (Index): "Units containing this model automatically pass their Canticle of the ' +
      'Omnissiah roll." The proximity anchor (9") + auto-pass for its own unit.',
  },
  {
    name: 'Monotask',
    category: 'army-rule',
    text: 'Verbatim (Index): "This unit does not benefit from Canticles of the Omnissiah unless it ' +
      'is accompanied by a character with \'Choir Master\'." Carried by 5 units: Tech-thralls, ' +
      'Kataphron Breachers, Kataphron Destroyers, Servitors, Kastelan Robots.',
  },
  {
    name: 'Weapon special rules (Cognis / Luminagen / Tesla)',
    category: 'army-rule',
    text: 'Index-listed weapon rules (textual, in coreRules.ts, NOT gates): Cognis (reduces ranged ' +
      'to-hit penalty by 1, min 0), Luminagen (cover -1 + Defensive-fire -1 to hit on the target), ' +
      'Tesla (to-hit 5+ always succeed + 2 extra automatic hits).',
  },

  // --- §5 Archetypes (5) ---
  {
    name: 'Archetypes (5 total)',
    category: 'archetype',
    text: 'Budget 0-1 Archetype. Dark Mechanicum → cross-faction (Allies of Convenience for CSM; ' +
      'buy Marks of Chaos; access CSM Armory + 5 daemon-engines; "no Legacy") — direct analogue of ' +
      'IG\'s Traitor Guard ([[project_traitor_guard_bugfix_0608]]). Cybernetica Cohort (HH ' +
      'Mechanicum Robots/Taghmata; Kastelan→Troops; needs Magos w/ Datasmith) + Ordo Reductor ' +
      'Covenant (HH Mechanicum Ordo Reductor; needs Magos w/ Myrmidax) both pull from the Horus ' +
      'Heresy Mechanicum supplement ([[project_hh_supplement_source]]). Servitor Maniple ' +
      '(Servitors→Troops, each needs an attached Tech-priest), Titan Legion (Secutarii→Troops). ' +
      'Full AOP-remap data canonical in `archetypes.json`.',
  },

  // --- §5 Legacies (7) — each = one Forge World (armory + canticle) ---
  {
    name: 'Legacies (7 total — each = one Forge World)',
    category: 'legacy',
    text: 'Each Legacy unlocks ONE Forge World\'s Armory + one Legacy Canticle (cf. IG legacies = ' +
      'order-grant, GK = power-grant): Gleaming Giant→Metalica / Hollow World→Lucius / Morning ' +
      'Star→Graia / Omnissiah Igvita→Ryza / Red Planet→Mars / Thousand Scars→Agripinaa / ' +
      'Xenarites→Stygies VIII. Forge World armories (relic weapons gated "Forge World X only", e.g. ' +
      'The Adamantine Arm/The Omnissiah\'s Hand/The Red Axe) live in `armory/legion_forge_world.json`.',
  },

  // --- §5 Traits (16) ---
  {
    name: 'Traits (16 total — army-wide, 3-column pricing)',
    category: 'trait',
    text: 'Budget 0-2 Traits. 3-column NORMAL/CHARACTER/MC&V pricing with `*` = per Wound/Hull ' +
      '(same rich shape as IG): Accelerated Actuators / Autosavant Spirits / Combined Explorator ' +
      'Fleet (→"must select a 2nd Legacy") / Djinn Eyes / Masters of the Forge (+1 Canticle roll) / ' +
      'Phased-Plasma Coils / Purgation Protocols / Refusal to Yield / Relentless March / Red in Cog ' +
      'and Claw / Rugged Explorators / Scarifying Weaponry / Shroud Protocols / Solar Blessing / ' +
      'Staunch Defenders / Veteran Maniple ("Any unit with the option to purchase a Doctrina ' +
      'Imperative may purchase a second one" — cross-links to the Doctrina gating, gap-note below). ' +
      'Canonical in `archetypes.json`.',
  },

  // --- §6 gap note (RESOLVED v0.60, see addendum below) ---
  {
    name: 'Doctrina Imperatives — gating (ki-admech-doctrina-gating-01, FIXED v0.60)',
    category: 'gap-note',
    text: 'The 4 Doctrina Imperatives (Aggressor/Bulwark/Conqueror/Protector) are AdMech\'s ' +
      'veteran-ability analogue, gated by the per-datasheet line "The unit may select one Doctrina ' +
      'Imperative" — present on 13 units (Skitarii Rangers/Vanguard, Secutarii Hoplites/Peltasts, ' +
      'Sicaran Infiltrators/Ruststalkers, Sydonian Skatros, Pteraxii Skystalkers/Sterylizors, ' +
      'Serberys Raiders/Sulphurhounds, Sydonian Dragoons, Ironstrider Ballistarii). RESOLVED v0.60: ' +
      'the 13 units now carry `has_veteran_abilities: true` + `veteran_max: 1`, and the 4 items in ' +
      '`armory/general.json` are tagged `category: "veteran"` with `p_veh` from the .ods M&V column ' +
      '(2 for Aggressor/Bulwark/Conqueror, 0 for Protector) + `p_char: null`. Veteran Maniple\'s +1 ' +
      'slot is a separate open item (`ki-admech-veteranmaniple-bonus-unmodelled-01`, no engine ' +
      '`veteran_max` trait-effect mechanism exists yet).',
  },
];
