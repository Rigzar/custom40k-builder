import type { ArchetypeRule } from './base';
import { BASE, cultArchetype, dropPodArchetype } from './base';
import { CSM_STRUCTURED_NOTES } from './rules/csm-rules';

function withNotes(rule: ArchetypeRule, name: string): ArchetypeRule {
  const sn = CSM_STRUCTURED_NOTES[name];
  return sn ? { ...rule, structuredNotes: sn } : rule;
}

export const CSM_ARCHETYPES: Record<string, ArchetypeRule> = Object.fromEntries(
  Object.entries(_buildCSMArchetypes()).map(([k, v]) => [k, withNotes(v, k)])
);

function _buildCSMArchetypes(): Record<string, ArchetypeRule> {
  return {
  'Blood for the Blood God!': cultArchetype('Khorne', 'Khorne Berzerkers'),
  'All is Dust': {
    ...cultArchetype('Tzeentch', 'Rubric Marines'),
    notes: [
      'All units must carry the Mark of Tzeentch.',
      'Rubric Marines count as Troops.',
      'Only units with locked Mark of Tzeentch count towards the 25% Troops requirement.',
      'Access to Chaos Daemons units with the Mark of Tzeentch.',
      'Legionnaires not allowed. No Legacies or Traits may be chosen.',
      'Vehicle combi weapons are automatically upgraded: Combi-bolter â†’ Inferno combi-bolter (+2 pts), Combi-flamer â†’ Inferno combi-warpflamer (+4 pts), Combi-melta â†’ Inferno combi-melta (+1 pt).',
    ],
  },
  'Ambition for Perfection': cultArchetype('Slaanesh', 'Noise Marines'),
  'Plaguehost': {
    ...cultArchetype('Nurgle', 'Plague Marines'),
    notes: [
      'All units must carry the Mark of Nurgle.',
      'Plague Marines count as Troops.',
      'Only units with locked Mark of Nurgle count towards the 25% Troops requirement.',
      'Access to Chaos Daemons units with the Mark of Nurgle.',
      'Legionnaires not allowed. No Legacies or Traits may be chosen.',
      'Frag grenades on all models are exchanged for Blight grenades at no additional cost.',
      'Vehicle combi weapons are automatically upgraded: Combi-bolter +2 pts (gains Poison 4+), Combi-flamer â†’ Combi-plague belcher +4 pts, Combi-melta +2 pts (gains Poison 4+ on bolter).',
    ],
  },
  'Host Raptorial': { ...BASE,
    troopsRemap: ['Raptors'], troopsCount: 'remap',
    notes: [
      'Raptors count as Troops.',
      'Only Raptor units count towards the 25% Troops requirement.',
      'At least half of Raptor models must start in reserves.',
    ],
  },
  'The Swift Blade': { ...BASE,
    troopsRemap: ['Chaos Bikers'],
    notes: [
      'Chaos Bikers count as Troops.',
      'Outflanking units may deploy on turn 1.',
      'All units with M<12" must start the game as passengers inside a transport.',
      'Units with M<12" and no transport option cannot be selected.',
    ],
  },
  'Sorcerer Circle': { ...BASE,
    hqOverride: [1, 4], hqAllowed: ['Chaos Sorcerer', 'Master of Sorcery'],
    notes: [
      '4 HQ slots (minimum 1, maximum 4).',
      'Only Chaos Sorcerer and Master of Sorcery as HQ.',
      'Chaos Sorcerers gain the "Command squad" ability.',
      'All models must deploy within 12" of each other.',
    ],
  },
  "Abaddon's Chosen": { ...BASE,
    hqOverride: [4, 5], noAnimosity: true,
    notes: [
      '5 HQ slots (minimum 4 must be filled).',
      'Each HQ must have a different Chaos Mark.',
      'Animosity of the Gods rule does not apply.',
    ],
  },
  'Legionnaire Warband': { ...BASE,
    troopsRemap: ['Legionnaires'], requireVetAbilities: true,
    notes: [
      'Legionnaires count as Troops.',
      'All units must have at least 1 veteran ability (Marks do not count).',
      'Units without access to veteran abilities cannot be selected.',
    ],
  },
  'Special Operations': { ...BASE,
    grantVetAbilities: ['Cultists'],
    notes: ['Cultists must choose 2 veteran abilities, one of which must be "Infiltrator".'],
  },
  'Daemonkin': { ...BASE,
    noLegacy: true, noTraits: true,
    alliedFaction: 'chaos_daemons', alliedMarkFilter: 'hq_mark',
    notes: [
      'Access to all Chaos Daemons units (filtered by HQ Mark).',
      'All units must carry the same Chaos Mark.',
      'At least 1 HQ from each Codex (CSM and Daemons).',
      'No Legacies or Traits may be chosen.',
      'â”€â”€ In-game: Blood Tithe (Khorne) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€',
      'Gain Blood points each Command phase equal to the current battle round, +1 per unit that loses its last Wound (friendly or enemy). Spend at any time; unspent points lost at end of last activation.',
      '1pt — Unbound Fury: target unit gains Furious Charge until end of round.',
      '1pt — Obliteration: target unit gains Decimate until end of round.',
      '1pt — Desecration: if within 3" of uncontested objective, seize it (as Objective Secured).',
      '2+xpt — Reborn in Blood: heal 3 Wounds +1 per extra pt spent (dead models may be revived).',
      '4pt — Blood for the Blood God: place 8 Bloodletters within 8" of a Khorne unit via Deep Strike (counts as activated, may still fight in melee).',
      '8pt — Skulls for his Throne: place 1 Bloodthirster within 8" of a Khorne unit via Deep Strike (counts as activated, may still fight in melee).',
      'â”€â”€ In-game: Tally of Pestilence (Nurgle) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€',
      'Track total unsaved Wounds inflicted by Nurgle units. At start of each battle round, all Nurgle models gain the cumulative bonuses:',
      '7+ wounds: +1 Strength.',
      '14+ wounds: +1 Toughness.',
      '21+ wounds: Poison weapons re-roll wound rolls of 1.',
      '28+ wounds: Nurgle models gain Warded.',
      'â”€â”€ In-game: Dark Pledge (Slaanesh) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€',
      'Start of each round: pledge a number of enemy units to destroy. If met, gain that many Pact points. If not, lose 1D3 Pact points. Points carry over between rounds.',
      '1pt — Beautiful Death: target (about to be removed) may fight once more in melee.',
      '1pt — Dance Macabre: place 6 Daemonettes within 6" of a Slaanesh unit via Deep Strike (may still fight in melee).',
      '1pt — Diabolic Majesty: target enemy must pass Leadership test at -2.',
      '1pt — Protection of Dark Prince: target gains Aegis(4+), Warded, cannot be wounded on a 1 or 2.',
      '1pt — Violent Crescendo: target gains Frenzy(2").',
      '3pt — Siren\'s Call: place 1 Keeper of Secrets within 6" of a Slaanesh unit via Deep Strike (may still fight in melee).',
      'â”€â”€ In-game: Cabbalistic Rituals (Tzeentch) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€',
      'Receive 1 Cabal Point (CP) per 500 pts of game size. Restored each Reinforcement phase. Spend when manifesting or denying psychic powers (each effect once per round per model):',
      '1+pt — Enhanced Manifestation: +6" range per CP spent.',
      '1+pt — Brotherhood of Sorcerers: +1 to test result per CP spent.',
      '1pt — Pact from Beyond: ignore Perils of the Warp.',
      '2pt — Cabbalistic Focus: power cannot be denied.',
      '2pt — Psychic Maelstrom: additionally resolve Smite from the caster.',
      '3pt — Residual Magic: until next activation, choose one: +6" range to ranged weapons / +1 Strength / 6+ invulnerability save.',
    ],
  },
  'Dreadclaw Assault': dropPodArchetype('Dreadclaw Drop Pod'),
  'Legion': { ...BASE,
    troopsRemap: ['Legion Breacher Squad', 'Legion Tactical Squad', 'Legion Tactical Support Squad'],
    troopsCount: 'remap',
    alliedFaction: 'horus_heresy', alliedMarkFilter: 'all',
    sharedSupplementArmory: 'Horus Heresy',
    notes: [
      'Access to all Horus Heresy Space Marines supplement units.',
      'Access to the Horus Heresy Armory for the whole army.',
      'Only HH supplement Troops (Breacher, Tactical, Tactical Support) count towards the 25%.',
    ],
  },
  };
}
