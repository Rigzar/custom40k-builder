/**
 * Structured archetype rules for Chaos Space Marines.
 *
 * Each entry is a StructuredNote with a category:
 *   troops       — unit slot remapping
 *   requirement  — mandatory rule (validated by engine)
 *   restriction  — something banned/blocked (validated by engine)
 *   mechanic     — special effect applied automatically by the engine
 *   in_game      — pure gameplay rule, informational only (not enforced by builder)
 *
 * To modify a rule: find the archetype by name, edit the relevant note.
 * To add a rule: push a new StructuredNote with the appropriate category.
 */

import type { StructuredNote } from '../../archetypes/base';

export const CSM_STRUCTURED_NOTES: Record<string, StructuredNote[]> = {

  "Abaddon's Chosen": [
    { category: 'requirement', text: '5 HQ slots total — minimum 4 must be filled.' },
    { category: 'requirement', text: 'Each HQ must carry a different Chaos Mark.' },
    { category: 'restriction', text: 'Animosity of the Gods does not apply.' },
  ],

  'All is Dust': [
    { category: 'requirement', text: 'All units must carry the Mark of Tzeentch.' },
    { category: 'troops',      text: 'Rubric Marines count as Troops.' },
    { category: 'restriction', text: 'Only units with a locked Mark of Tzeentch count towards the 25% Troops requirement.' },
    { category: 'restriction', text: 'Legionnaires cannot be selected.' },
    { category: 'restriction', text: 'No Legacies or Traits may be chosen.' },
    { category: 'mechanic',    text: 'Access to Chaos Daemons units with the Mark of Tzeentch.' },
    { category: 'mechanic',    text: 'Vehicle combi weapons upgraded automatically: Combi-bolter → Inferno combi-bolter (+2 pts), Combi-flamer → Inferno combi-warpflamer (+4 pts), Combi-melta → Inferno combi-melta (+1 pt).' },
  ],

  'Ambition for Perfection': [
    { category: 'requirement', text: 'All units must carry the Mark of Slaanesh.' },
    { category: 'troops',      text: 'Noise Marines count as Troops.' },
    { category: 'restriction', text: 'Only units with a locked Mark of Slaanesh count towards the 25% Troops requirement.' },
    { category: 'restriction', text: 'Legionnaires cannot be selected.' },
    { category: 'restriction', text: 'No Legacies or Traits may be chosen.' },
    { category: 'mechanic',    text: 'Access to Chaos Daemons units with the Mark of Slaanesh.' },
  ],

  'Blood for the Blood God!': [
    { category: 'requirement', text: 'All units must carry the Mark of Khorne.' },
    { category: 'troops',      text: 'Khorne Berzerkers count as Troops.' },
    { category: 'restriction', text: 'Only units with a locked Mark of Khorne count towards the 25% Troops requirement.' },
    { category: 'restriction', text: 'Legionnaires cannot be selected.' },
    { category: 'restriction', text: 'No Legacies or Traits may be chosen.' },
    { category: 'mechanic',    text: 'Access to Chaos Daemons units with the Mark of Khorne.' },
  ],

  'Daemonkin': [
    { category: 'mechanic',    text: 'Access to all Chaos Daemons units (filtered by HQ Mark).' },
    { category: 'restriction', text: 'The Summoning rule is ignored — Chaos Daemon units may deploy normally.' },
    { category: 'requirement', text: 'At least 1 HQ selection from each Codex (CSM and Chaos Daemons).' },
    { category: 'requirement', text: 'All units must carry the same Chaos Mark.' },
    { category: 'requirement', text: 'All units must have or purchase the \'Daemon\' or \'Greater Daemon\' ability.' },
    { category: 'restriction', text: 'No more than +1 unit selected from one Codex over the other.' },
    { category: 'restriction', text: 'No Legacies or Traits may be chosen.' },
    { category: 'in_game',     text: 'Blood Tithe (Khorne): Gain Blood points each Command phase equal to the current battle round, +1 per unit destroyed. Spend at any time — 1pt: Unbound Fury (Furious Charge) / Obliteration (Decimate) / Desecration (seize objective); 2+pt: Reborn in Blood (heal 3+x Wounds); 4pt: summon 8 Bloodletters within 8\"; 8pt: summon 1 Bloodthirster within 8\".' },
    { category: 'in_game',     text: 'Tally of Pestilence (Nurgle): Track total unsaved Wounds by Nurgle units. At start of each round — 7+: +1 Str; 14+: +1 T; 21+: Poison weapons re-roll wound 1s; 28+: Warded. Bonuses stack.' },
    { category: 'in_game',     text: 'Dark Pledge (Slaanesh): Each round, pledge a number of enemy units to destroy. If met, gain that many Pact points; if not, lose 1D3. Spend — 1pt: Beautiful Death / Daemonettes Deep Strike / Diabolic Majesty / Protection of Dark Prince / Violent Crescendo; 3pt: Keeper of Secrets Deep Strike.' },
    { category: 'in_game',     text: 'Cabbalistic Rituals (Tzeentch): Receive 1 CP per 500 pts, restored each Reinforcement phase. Spend on psychic actions — 1+pt: +6\\" range per CP / +1 to test per CP; 1pt: ignore Perils; 2pt: power cannot be denied / additionally resolve Smite; 3pt: +6\\" range OR +1 Str OR 6+ inv save until next activation.' },
  ],

  'Dreadclaw Assault': [
    { category: 'requirement', text: 'All units must start the game as passengers inside a Dreadclaw Drop Pod.' },
    { category: 'in_game',     text: 'Half of all Dreadclaw Drop Pods (round up) arrive automatically in round 1. The other half arrives in round 2.' },
  ],

  'Host Raptorial': [
    { category: 'troops',      text: 'Raptors count as Troops.' },
    { category: 'restriction', text: 'Only Raptor units count towards the 25% Troops requirement.' },
    { category: 'in_game',     text: 'At least half of all Raptor models must start the game in reserves, even if the mission does not allow reserves.' },
  ],

  'Legion': [
    { category: 'mechanic',    text: 'Access to all Horus Heresy Space Marines supplement units.' },
    { category: 'restriction', text: 'Only HH Troops (Breacher, Tactical, Tactical Support Squads) count towards the 25% Troops requirement.' },
  ],

  'Legionnaire Warband': [
    { category: 'troops',      text: 'Legionnaires count as Troops.' },
    { category: 'requirement', text: 'All units must be given at least 1 Veteran ability.' },
    { category: 'restriction', text: 'Units without access to Veteran abilities cannot be selected.' },
    { category: 'restriction', text: 'Marks of Chaos do not count as Veteran abilities for this requirement.' },
  ],

  'Plaguehost': [
    { category: 'requirement', text: 'All units must carry the Mark of Nurgle.' },
    { category: 'troops',      text: 'Plague Marines count as Troops.' },
    { category: 'restriction', text: 'Only units with a locked Mark of Nurgle count towards the 25% Troops requirement.' },
    { category: 'restriction', text: 'Legionnaires cannot be selected.' },
    { category: 'restriction', text: 'No Legacies or Traits may be chosen.' },
    { category: 'mechanic',    text: 'Access to Chaos Daemons units with the Mark of Nurgle.' },
    { category: 'mechanic',    text: 'Frag grenades on all models are automatically replaced with Blight grenades at no additional cost.' },
    { category: 'mechanic',    text: 'Vehicle combi weapons upgraded automatically: Combi-bolter +2 pts (gains Poison 4+), Combi-flamer → Combi-plague belcher +4 pts, Combi-melta +2 pts (gains Poison 4+ on bolter).' },
  ],

  'Sorcerer Circle': [
    { category: 'mechanic',    text: '4 HQ slots total (minimum 1). Only Chaos Sorcerers and Masters of Sorcery may be taken as HQ.' },
    { category: 'mechanic',    text: "Chaos Sorcerers gain the 'Command squad' ability while this archetype is active." },
    { category: 'in_game',     text: 'All models must set up within 12\\" of each other at the start of the game.' },
    { category: 'in_game',     text: 'While a Master of Sorcery is within 12\\" of a Chaos Sorcerer, it can manifest all powers known to that Sorcerer and receives +1 to manifesting and dispelling psychic powers.' },
  ],

  'Special Operations': [
    { category: 'requirement', text: "Cultists must select 2 Veteran abilities, one of which must be 'Infiltrator'." },
  ],

  'The Swift Blade': [
    { category: 'troops',      text: 'Chaos Bikers count as Troops.' },
    { category: 'mechanic',    text: 'Outflanking units may deploy on turn 1.' },
    { category: 'in_game',     text: 'All units with M<12\\" must start the game as passengers inside a transport.' },
    { category: 'restriction', text: 'Units with M<12\\" that have no transport option cannot be selected.' },
  ],

};
