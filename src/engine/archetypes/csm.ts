/**
 * CSM Archetype engine rules.
 *
 * SOURCE: Chaos Space Marines — Army Customisation sheet (canonical)
 * ─────────────────────────────────────────────────────────────────
 * "Army Customisation allows you to further individualise your force. Archetypes change
 *  how you build your army by moving around units in the Army Organisation Plan (AOP) or
 *  letting you take more of a unit than you would normally be allowed to."
 *
 * You may select: 0-1 Archetype, 0-1 Legacy, 0-2 Traits.
 * "Traits in this army can only apply to models with the 'Chaos Space Marine' keyword."
 *
 * ENGINE NOTE: each archetype has its canonical rule text as a comment above the object.
 * The engine flags (noLegacy, noTraits, forcedMark, etc.) must stay faithful to that text.
 * When the canonical text and the flags diverge, fix the flags.
 */

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

  // ── Cult archetypes (shared pattern via cultArchetype helper) ──────────────
  //
  // SOURCE — Blood for the Blood God!:
  // - The army gets access to all units from this codex that can take the Mark of Khorne
  //   and all units must take it.
  // - The army gets access to all units from the "Chaos Daemons" codex with the Mark of Khorne.
  // - Khorne Berzerkers can be taken as Troops.
  // - Only models that already come equipped with the Mark of Khorne count towards the 25% Troops.
  // - Legionnaires can not be taken at all.
  // - May not select any Legacy or Traits.
  'Blood for the Blood God!': cultArchetype('Khorne', 'Khorne Berzerkers'),

  // SOURCE — All is Dust:
  // - The army gets access to all units from this codex that can take the Mark of Tzeentch
  //   and all units must take it.
  // - The army gets access to all units from the "Chaos Daemons" codex with the Mark of Tzeentch.
  // - Rubric Marines can be taken as Troops.
  // - Only models that already come equipped with the Mark of Tzeentch count towards the 25% Troops.
  // - Legionnaires can not be taken at all.
  // - Vehicles must upgrade Combi-bolters to Inferno combi-bolters for +2 pts each,
  //   Combi-flamers to Inferno combi-warpflamers for +4 pts each,
  //   and Combi-melta to Inferno combi-melta for +1 pt each.
  // - May not select any Legacy or Traits.
  'All is Dust': {
    ...cultArchetype('Tzeentch', 'Rubric Marines'),
    notes: [
      'All units must carry the Mark of Tzeentch.',
      'Rubric Marines count as Troops.',
      'Only units with locked Mark of Tzeentch count towards the 25% Troops requirement.',
      'Access to Chaos Daemons units with the Mark of Tzeentch.',
      'Legionnaires not allowed. No Legacies or Traits may be chosen.',
      'Vehicle combi weapons are automatically upgraded: Combi-bolter → Inferno combi-bolter (+2 pts), Combi-flamer → Inferno combi-warpflamer (+4 pts), Combi-melta → Inferno combi-melta (+1 pt).',
    ],
  },

  // SOURCE — Ambition for Perfection:
  // - The army gets access to all units from this codex that can take the Mark of Slaanesh
  //   and all units must take it.
  // - The army gets access to all units from the "Chaos Daemons" codex with the Mark of Slaanesh.
  // - Noise Marines can be taken as Troops.
  // - Only models that already come equipped with the Mark of Slaanesh count towards the 25% Troops.
  // - Legionnaires can not be taken at all.
  // - May not select any Legacy or Traits.
  'Ambition for Perfection': cultArchetype('Slaanesh', 'Noise Marines'),

  // SOURCE — Plaguehost:
  // - The army gets access to all units from this codex that can take the Mark of Nurgle
  //   and all units must take it.
  // - The army gets access to all units from the "Chaos Daemons" codex with the Mark of Nurgle.
  // - Plague Marines can be taken as Troops.
  // - Only models that already come equipped with the Mark of Nurgle count towards the 25% Troops.
  // - Legionnaires can not be taken at all.
  // - Frag grenades for all models are exchanged with Blight grenades at no additional cost.
  // - Vehicles must upgrade Combi-bolters for +2 pts each to gain "Poison(4+)",
  //   Combi-flamers to Combi-plague belcher for +4 pts each,
  //   and Combi-melta for +2 pts each to gain "Poison(4+)" on the bolter part.
  // - May not select any Legacy or Traits.
  'Plaguehost': {
    ...cultArchetype('Nurgle', 'Plague Marines'),
    notes: [
      'All units must carry the Mark of Nurgle.',
      'Plague Marines count as Troops.',
      'Only units with locked Mark of Nurgle count towards the 25% Troops requirement.',
      'Access to Chaos Daemons units with the Mark of Nurgle.',
      'Legionnaires not allowed. No Legacies or Traits may be chosen.',
      'Frag grenades on all models are exchanged for Blight grenades at no additional cost.',
      'Vehicle combi weapons are automatically upgraded: Combi-bolter +2 pts (gains Poison 4+), Combi-flamer → Combi-plague belcher +4 pts, Combi-melta +2 pts (gains Poison 4+ on bolter).',
    ],
  },

  // ── Non-cult archetypes ────────────────────────────────────────────────────

  // SOURCE — Host Raptorial:
  // - Raptor units can be taken as Troops.
  // - Only Raptor units count towards the 25% Troops limitation.
  // - At least half of all Raptor models must start the game in reserves,
  //   even if the mission does not allow reserves.
  'Host Raptorial': { ...BASE,
    troopsRemap: ['Raptors'], troopsCount: 'remap',
    notes: [
      'Raptors count as Troops.',
      'Only Raptor units count towards the 25% Troops requirement.',
      'At least half of Raptor models must start in reserves.',
    ],
  },

  // SOURCE — The Swift Blade:
  // - Chaos Bikers can be taken as Troops.
  // - Outflanking units may be deployed on turn 1.
  // - All units with less than 12" Movement must start the game as passengers inside a transport.
  // - Units that have no transport option and less than 12" Movement cannot be taken at all.
  'The Swift Blade': { ...BASE,
    troopsRemap: ['Chaos Bikers'],
    notes: [
      'Chaos Bikers count as Troops.',
      'Outflanking units may deploy on turn 1.',
      'All units with M<12" must start the game as passengers inside a transport.',
      'Units with M<12" and no transport option cannot be selected.',
    ],
  },

  // SOURCE — Sorcerer Circle:
  // - The army gets 4 HQ slots in total and has only access to Chaos Sorcerers and Masters
  //   of Sorcery as HQ models. Chaos Sorcerers gain the "Command squad" ability.
  // - All of these models must be set up within 12" of each other.
  // - While a Master of Sorcery is within 12" of a Chaos Sorcerer, they can manifest all
  //   powers known to the Chaos Sorcerer and receive a +1 bonus to manifesting and dispelling.
  'Sorcerer Circle': { ...BASE,
    hqOverride: [1, 4], hqAllowed: ['Chaos Sorcerer', 'Master of Sorcery'],
    notes: [
      '4 HQ slots (minimum 1, maximum 4).',
      'Only Chaos Sorcerer and Master of Sorcery as HQ.',
      'Chaos Sorcerers gain the "Command squad" ability.',
      'All models must deploy within 12" of each other.',
    ],
  },

  // SOURCE — Abaddon's Chosen:
  // - The army gains 3 additional HQ slots (5 in total) and must use them to field at least
  //   4 HQ selections. Each of them must have a Mark of Chaos and all Marks must be different.
  // - The "Animosity of the Gods" rule does not apply for the army.
  "Abaddon's Chosen": { ...BASE,
    hqOverride: [4, 5], noAnimosity: true,
    notes: [
      '5 HQ slots (minimum 4 must be filled).',
      'Each HQ must have a different Chaos Mark.',
      'Animosity of the Gods rule does not apply.',
    ],
  },

  // SOURCE — Legionnaire Warband:
  // - Legionnaires can be taken as Troops.
  // - All units in the army must be given at least one Veteran ability.
  // - Units who can't take a Veteran ability may not be selected.
  // - Marks of Chaos do not count as Veteran abilities in relation to fulfilling this requirement.
  'Legionnaire Warband': { ...BASE,
    troopsRemap: ['Legionnaires'], requireVetAbilities: true,
    notes: [
      'Legionnaires count as Troops.',
      'All units must have at least 1 veteran ability (Marks do not count).',
      'Units without access to veteran abilities cannot be selected.',
    ],
  },

  // SOURCE — Special Operations:
  // - Cultists must pick two Veteran abilities, one of which has to be "Infiltrator".
  'Special Operations': { ...BASE,
    grantVetAbilities: ['Cultists'],
    notes: ['Cultists must choose 2 veteran abilities, one of which must be "Infiltrator".'],
  },

  // SOURCE — Daemonkin:
  // - The army gains access to all Chaos Daemon units.
  // - The army may use the Daemonkin table for the respective god.
  // - The army ignores the "Summoning" rule.
  // - The army must have at least one HQ selection from each codex (Chaos Daemons and CSM).
  // - All units in the army must have a Mark of Chaos and it must be the same Mark.
  // - All units in the army must have or purchase the "Daemon" or "Greater Daemon" ability.
  // - The army may not have more than +1 unit selected from codex CSM over codex Chaos Daemons
  //   and vice versa.
  // - May not select any Legacy or Traits.
  //
  // IN-GAME: Daemonkin tables (informational — not enforced by the builder):
  //   Blood Tithe (Khorne): gain Blood pts each Command phase = battle round number, +1 per unit
  //     losing its last Wound. Spend at any time (1pt=Unbound Fury / Obliteration / Desecration,
  //     2+pt=Reborn in Blood, 4pt=8 Bloodletters via DS, 8pt=1 Bloodthirster via DS).
  //   Tally of Pestilence (Nurgle): track total Wounds inflicted; cumulative bonuses at 7/14/21/28+.
  //   Dark Pledge (Slaanesh): pledge enemy units to destroy each round; meet target = Pact pts.
  //   Cabbalistic Rituals (Tzeentch): 1 Cabal pt per 500 game pts; spend when manifesting/denying.
  'Daemonkin': { ...BASE,
    noLegacy: true, noTraits: true,
    alliedFaction: 'chaos_daemons', alliedMarkFilter: 'hq_mark',
    notes: [
      'Access to all Chaos Daemons units (filtered by HQ Mark).',
      'All units must carry the same Chaos Mark.',
      'At least 1 HQ from each Codex (CSM and Daemons).',
      'All units must have or purchase the "Daemon" or "Greater Daemon" ability.',
      'No more than +1 unit from one Codex over the other.',
      'No Legacies or Traits may be chosen.',
      '── In-game: Blood Tithe (Khorne) ────────────────────────────',
      'Gain Blood pts each Command phase = current round number, +1 per unit losing its last Wound (friendly or enemy). Spend at any time; unspent pts lost at end of last activation.',
      '1pt — Unbound Fury: target unit gains Furious Charge until end of round.',
      '1pt — Obliteration: target unit gains Decimate until end of round.',
      '1pt — Desecration: if within 3" of uncontested objective, seize it (as Objective Secured).',
      '2+xpt — Reborn in Blood: heal 3 Wounds +1 per extra pt spent (dead models may be revived).',
      '4pt — Blood for the Blood God: place 8 Bloodletters within 8" of a Khorne unit via Deep Strike.',
      '8pt — Skulls for his Throne: place 1 Bloodthirster within 8" of a Khorne unit via Deep Strike.',
      '── In-game: Tally of Pestilence (Nurgle) ───────────────────',
      'Track total unsaved Wounds inflicted by Nurgle units. Cumulative bonuses per round: 7+=+1 S, 14+=+1 T, 21+=Poison re-rolls 1s, 28+=Nurgle models gain Warded.',
      '── In-game: Dark Pledge (Slaanesh) ────────────────────────',
      'Start of each round: pledge enemy units to destroy. If met, gain that many Pact pts. If not, lose 1D3 Pact pts. 1pt=Beautiful Death / Dance Macabre / Diabolic Majesty / Protection of Dark Prince / Violent Crescendo. 3pt=Siren\'s Call.',
      '── In-game: Cabbalistic Rituals (Tzeentch) ─────────────────',
      'Receive 1 Cabal pt per 500 game pts; restored each Reinforcement phase. 1pt=Enhanced Manifestation / Brotherhood of Sorcerers / Pact from Beyond. 2pt=Cabbalistic Focus / Psychic Maelstrom. 3pt=Residual Magic.',
    ],
  },

  // SOURCE — Dreadclaw Assault:
  // - All units must start the game as passengers inside a Dreadclaw Drop Pod.
  // - Half of all Drop Pods in the army (round up) arrive automatically in the first battle
  //   round as reinforcements. The other half arrives automatically in the second battle round.
  'Dreadclaw Assault': dropPodArchetype('Dreadclaw Drop Pod'),

  // SOURCE — Legion:
  // - The army has access to everything from the Horus Heresy Space Marines supplement.
  // - Only Troops from the Horus Heresy Space Marine Supplement count towards the 25% Troops.
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
