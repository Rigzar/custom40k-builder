/**
 * specialRuleCosts.ts — what each special rule costs, from the author's own sheet.
 *
 * SOURCE: `Codex/Points calculator_v5.4.xlsx`, sheet "Sonderregeln & Punkte (neu)", rows 3-207.
 * Copied verbatim, including the entries he wrote as prose ("0,5 * LP", "wie 5+ Rettungswurf",
 * "6+ 0,25, 5+ 0,50, 4+ 1"). They are NOT parsed into numbers and NOT applied automatically:
 * turning "like a 5+ ward save" into arithmetic would be guessing, and a wrong points cost is
 * expensive. This is a reference the designer reads while pricing, not a machine input.
 *
 * "LP" is Lebenspunkte — Wounds. So "0,5 * LP" means half a point per Wound.
 *
 * This table is also the answer to why the creature formula alone does not reproduce a printed
 * unit: a Chaos Space Marine's 37 points are its body, its weapon AND its special rules.
 */

export interface SpecialRuleCost {
  /** English name as printed; falls back to the German one where he left English blank. */
  name: string;
  /** German name, when it differs — he works in German and searches by it. */
  de: string;
  /** Cost for a normal model, his wording. */
  pts: string;
  /** Cost for a monstrous creature or vehicle, his wording. */
  veh: string;
}

export const SPECIAL_RULE_COSTS: SpecialRuleCost[] = [
  {
    "name": "Aura der Disziplin",
    "de": "",
    "pts": "5",
    "veh": "-"
  },
  {
    "name": "Standrechtliche Hinrichtung",
    "de": "",
    "pts": "5",
    "veh": "-"
  },
  {
    "name": "Orkze verlieren niemals nich",
    "de": "",
    "pts": "2 * LP",
    "veh": "-"
  },
  {
    "name": "Ängstlich",
    "de": "",
    "pts": "",
    "veh": "-"
  },
  {
    "name": "Squig-Hund",
    "de": "",
    "pts": "",
    "veh": "-"
  },
  {
    "name": "Unorkig",
    "de": "",
    "pts": "",
    "veh": "-"
  },
  {
    "name": "Kehlenschlitza",
    "de": "",
    "pts": "0,5 * LP",
    "veh": "-"
  },
  {
    "name": "Panzajäga",
    "de": "",
    "pts": "3,92 * LP",
    "veh": "-"
  },
  {
    "name": "Volle Fahrt voraus!",
    "de": "",
    "pts": "",
    "veh": "-"
  },
  {
    "name": "Stachelramme",
    "de": "",
    "pts": "-",
    "veh": "+3 Attacken + Profil mit KG 1+"
  },
  {
    "name": "Bohrer",
    "de": "",
    "pts": "-",
    "veh": "+3 Attacken + Profil mit KG 1+"
  },
  {
    "name": "Shockk-Tunnel",
    "de": "",
    "pts": "",
    "veh": ""
  },
  {
    "name": "Raketenrucksack",
    "de": "",
    "pts": "2.5",
    "veh": "-"
  },
  {
    "name": "Zusammengetackert",
    "de": "",
    "pts": "",
    "veh": ""
  },
  {
    "name": "Abomination",
    "de": "",
    "pts": "10",
    "veh": ""
  },
  {
    "name": "Abomination (Custodes)",
    "de": "",
    "pts": "1",
    "veh": ""
  },
  {
    "name": "Acts of Faith",
    "de": "Akte des Glaubens",
    "pts": "0,5 * LP",
    "veh": "1 * LP"
  },
  {
    "name": "Aegis(x+)",
    "de": "",
    "pts": "6+ 0,25, 5+ 0,50, 4+ 1",
    "veh": "6+ 0,50, 5+ 1, 4+ 2"
  },
  {
    "name": "Aetheric interception",
    "de": "",
    "pts": "1 * LP",
    "veh": "-"
  },
  {
    "name": "Ambush",
    "de": "",
    "pts": "0,5 * LP",
    "veh": "1 * LP"
  },
  {
    "name": "Anti-Grav",
    "de": "",
    "pts": "Fliegen: Ja",
    "veh": "Fliegen: Ja"
  },
  {
    "name": "Assault ramp",
    "de": "Sturmrampe",
    "pts": "-",
    "veh": "2 * LP"
  },
  {
    "name": "Attention seeker",
    "de": "",
    "pts": "0,5 * LP",
    "veh": "-"
  },
  {
    "name": "Automated weapons",
    "de": "",
    "pts": "-",
    "veh": ""
  },
  {
    "name": "Battle Focus",
    "de": "Kampffokus",
    "pts": "0,5 * LP",
    "veh": "0,5 * LP"
  },
  {
    "name": "Bell of Demise",
    "de": "Glocke des Untergangs",
    "pts": "5",
    "veh": "-"
  },
  {
    "name": "Berserker",
    "de": "",
    "pts": "5+ Rettungswurf * 6/6 bei Widerstand 6, dann je 1 weniger/6",
    "veh": ""
  },
  {
    "name": "Bileblade",
    "de": "",
    "pts": "",
    "veh": ""
  },
  {
    "name": "Bio meltdown",
    "de": "",
    "pts": "LP",
    "veh": ""
  },
  {
    "name": "Blessing of the Omnissiah",
    "de": "Segen des Omnissiah",
    "pts": "5",
    "veh": "5"
  },
  {
    "name": "Blight racks",
    "de": "",
    "pts": "2.5",
    "veh": "-"
  },
  {
    "name": "Blind rage",
    "de": "",
    "pts": "",
    "veh": ""
  },
  {
    "name": "Blitz",
    "de": "",
    "pts": "5",
    "veh": "-"
  },
  {
    "name": "Bodyguard",
    "de": "Leibwache",
    "pts": "0,5 * LP",
    "veh": "-"
  },
  {
    "name": "Brainless",
    "de": "",
    "pts": "0,5 * LP",
    "veh": "-"
  },
  {
    "name": "Brotherhood of Psykers",
    "de": "Bruderschaft der Psioniker",
    "pts": "0,5 * LP",
    "veh": "-"
  },
  {
    "name": "Brutal presence",
    "de": "",
    "pts": "1 * LP",
    "veh": "-"
  },
  {
    "name": "Buried in the earth",
    "de": "",
    "pts": "-",
    "veh": "4 * LP"
  },
  {
    "name": "Charge",
    "de": "",
    "pts": "1",
    "veh": "1"
  },
  {
    "name": "Chariot",
    "de": "",
    "pts": "-",
    "veh": "1"
  },
  {
    "name": "Cloudstrike",
    "de": "",
    "pts": "-",
    "veh": "2"
  },
  {
    "name": "Combat tactics",
    "de": "",
    "pts": "15",
    "veh": ""
  },
  {
    "name": "Combi-weapon",
    "de": "Kombi-Waffe",
    "pts": "wie beide Profile mit -1 BF",
    "veh": "-"
  },
  {
    "name": "Command squad",
    "de": "",
    "pts": "",
    "veh": ""
  },
  {
    "name": "Control jets",
    "de": "",
    "pts": "-",
    "veh": "3 * LP"
  },
  {
    "name": "Counter-attack",
    "de": "Gegenangriff",
    "pts": "1 * LP",
    "veh": "1 * LP"
  },
  {
    "name": "Crisis bodyguard",
    "de": "",
    "pts": "",
    "veh": ""
  },
  {
    "name": "Cyberstimms",
    "de": "",
    "pts": "1 * LP",
    "veh": "-"
  },
  {
    "name": "Dakka Dakka Dakka",
    "de": "",
    "pts": "0,5 * LP",
    "veh": "1 * LP"
  },
  {
    "name": "Deception",
    "de": "",
    "pts": "5",
    "veh": "-"
  },
  {
    "name": "Deep strike",
    "de": "Schocktruppen",
    "pts": "1 * LP, inbuilt with terminator armor",
    "veh": "2 * LP, inbuilt with terminator armor"
  },
  {
    "name": "Deflect",
    "de": "Ablenken",
    "pts": "1 * LP",
    "veh": "1 * LP"
  },
  {
    "name": "Demon",
    "de": "Dämon",
    "pts": "wie 5+ Rettungwurf",
    "veh": "wie 5+ Rettungwurf"
  },
  {
    "name": "Demonic charge",
    "de": "",
    "pts": "0,5 * LP",
    "veh": "-"
  },
  {
    "name": "Demonic corruption",
    "de": "",
    "pts": "10",
    "veh": "-"
  },
  {
    "name": "Demonic instability",
    "de": "Dämonische Instabilität",
    "pts": "-1 * LP",
    "veh": "-"
  },
  {
    "name": "Devastating assault",
    "de": "",
    "pts": "0,5 * LP",
    "veh": "-"
  },
  {
    "name": "Distortion",
    "de": "",
    "pts": "-5",
    "veh": ""
  },
  {
    "name": "Doombell",
    "de": "",
    "pts": "10",
    "veh": "10"
  },
  {
    "name": "Drop Pod Assault",
    "de": "",
    "pts": "-",
    "veh": "2,5 * LP"
  },
  {
    "name": "Effigy",
    "de": "",
    "pts": "-",
    "veh": "15"
  },
  {
    "name": "Effigy",
    "de": "",
    "pts": "2 * LP",
    "veh": ""
  },
  {
    "name": "Etherium",
    "de": "",
    "pts": "20",
    "veh": "-"
  },
  {
    "name": "Eye of the Ancestors",
    "de": "",
    "pts": "0,5 * LP",
    "veh": "1 * LP"
  },
  {
    "name": "Eyes of Mortarion",
    "de": "Augen von Mortarion",
    "pts": "",
    "veh": ""
  },
  {
    "name": "Failure is not an option",
    "de": "",
    "pts": "5",
    "veh": "-"
  },
  {
    "name": "Fast",
    "de": "",
    "pts": "Bewegung 24",
    "veh": "Bewegung 24"
  },
  {
    "name": "Favoured enemy",
    "de": "Erzfeind",
    "pts": "1 * LP",
    "veh": "2 * LP"
  },
  {
    "name": "Fearless",
    "de": "Furchtlos",
    "pts": "0,5 * LP",
    "veh": "1 * LP"
  },
  {
    "name": "Fighting Style",
    "de": "",
    "pts": "5",
    "veh": ""
  },
  {
    "name": "Fire hatches",
    "de": "",
    "pts": "",
    "veh": ""
  },
  {
    "name": "First to the fray",
    "de": "",
    "pts": "0,5 * LP",
    "veh": "0,5 * LP"
  },
  {
    "name": "Fish of Fury",
    "de": "",
    "pts": "-",
    "veh": "5"
  },
  {
    "name": "Foul infusion",
    "de": "",
    "pts": "7.5",
    "veh": "-"
  },
  {
    "name": "Furioso",
    "de": "",
    "pts": "",
    "veh": ""
  },
  {
    "name": "Furious charge",
    "de": "Rasender Angriff",
    "pts": "2 * LP",
    "veh": "4 * LP"
  },
  {
    "name": "Gate of Eternity",
    "de": "",
    "pts": "-",
    "veh": "3 * LP"
  },
  {
    "name": "Genomic enhancement",
    "de": "",
    "pts": "5",
    "veh": "-"
  },
  {
    "name": "Great Illusion",
    "de": "",
    "pts": "-",
    "veh": "1 * LP"
  },
  {
    "name": "Grenades",
    "de": "Granaten",
    "pts": "0.5",
    "veh": "0.5"
  },
  {
    "name": "Grot riggers",
    "de": "",
    "pts": "wie 5+ Rettungwurf",
    "veh": ""
  },
  {
    "name": "Headshot",
    "de": "",
    "pts": "10",
    "veh": ""
  },
  {
    "name": "Hit & Run",
    "de": "",
    "pts": "0,5 * LP",
    "veh": "1 * LP"
  },
  {
    "name": "Honor or death",
    "de": "",
    "pts": "",
    "veh": ""
  },
  {
    "name": "Hover mode",
    "de": "",
    "pts": "",
    "veh": ""
  },
  {
    "name": "Hyper metabolism",
    "de": "",
    "pts": "LP",
    "veh": ""
  },
  {
    "name": "Impossible form",
    "de": "",
    "pts": "1 * LP",
    "veh": "-"
  },
  {
    "name": "Inbuilt access to armory for non HQ",
    "de": "Eingebauter Zugriff auf Rüstkammer für nicht HQ",
    "pts": "5",
    "veh": ""
  },
  {
    "name": "Inevitable death",
    "de": "",
    "pts": "1 * LP",
    "veh": "1 * LP"
  },
  {
    "name": "Infernum halo-launcher",
    "de": "",
    "pts": "5",
    "veh": ""
  },
  {
    "name": "Infiltrator",
    "de": "",
    "pts": "1 * LP",
    "veh": "-"
  },
  {
    "name": "Ion shield",
    "de": "Ionenschild",
    "pts": "-",
    "veh": "Wie Rettungswurf / 4"
  },
  {
    "name": "Khorne necklace",
    "de": "",
    "pts": "-",
    "veh": "2 * LP"
  },
  {
    "name": "Living metal",
    "de": "Lebendes Metall",
    "pts": "-",
    "veh": "3 x LP"
  },
  {
    "name": "Living metal",
    "de": "",
    "pts": "-",
    "veh": "10 * LP"
  },
  {
    "name": "Locus of Khorne",
    "de": "",
    "pts": "10",
    "veh": ""
  },
  {
    "name": "Locus of Nurgle",
    "de": "",
    "pts": "10",
    "veh": ""
  },
  {
    "name": "Locus of Slaanesh",
    "de": "",
    "pts": "10",
    "veh": ""
  },
  {
    "name": "Locus of Tzeentch",
    "de": "",
    "pts": "10",
    "veh": ""
  },
  {
    "name": "Lumbering",
    "de": "",
    "pts": "-",
    "veh": "1 * LP"
  },
  {
    "name": "Lumbering colossus",
    "de": "Schwerfälliger Koloss",
    "pts": "-",
    "veh": "3 * LP"
  },
  {
    "name": "Mark of Dominion",
    "de": "",
    "pts": "-",
    "veh": "20"
  },
  {
    "name": "Mark of Khorne",
    "de": "Mal des Khorne",
    "pts": "Nach Profiländerung",
    "veh": "Nach Profiländerung für Monster, 10 für Fahrzeuge"
  },
  {
    "name": "Mark of Nurgle",
    "de": "Mal des Nurgle",
    "pts": "Nach Profiländerung",
    "veh": "Nach Profiländerung für Monster, 10 für Fahrzeuge"
  },
  {
    "name": "Mark of Slaanesh",
    "de": "Mal des Slaanesh",
    "pts": "Nach Profiländerung",
    "veh": "Nach Profiländerung für Monster, 10 für Fahrzeuge"
  },
  {
    "name": "Mark of Tzeentch",
    "de": "Mal des Tzeentch",
    "pts": "Nach Profiländerung",
    "veh": "Nach Profiländerung für Monster, 10 für Fahrzeuge"
  },
  {
    "name": "Martial superiority",
    "de": "",
    "pts": "10",
    "veh": "-"
  },
  {
    "name": "Master of Magic",
    "de": "",
    "pts": "-",
    "veh": "2 * LP"
  },
  {
    "name": "Miraculous Intervention",
    "de": "",
    "pts": "5",
    "veh": "5"
  },
  {
    "name": "Mob",
    "de": "",
    "pts": "0.5",
    "veh": "-"
  },
  {
    "name": "Mobile defense",
    "de": "",
    "pts": "-",
    "veh": ""
  },
  {
    "name": "Molten body",
    "de": "",
    "pts": "-",
    "veh": "20"
  },
  {
    "name": "Move through cover",
    "de": "Durch Deckung bewegen",
    "pts": "0,5 * LP",
    "veh": "0,5 * LP"
  },
  {
    "name": "Mutated beyond recognition",
    "de": "",
    "pts": "",
    "veh": ""
  },
  {
    "name": "Nanoscarab reanimator beam",
    "de": "",
    "pts": "-",
    "veh": "25"
  },
  {
    "name": "Narthecium",
    "de": "",
    "pts": "5",
    "veh": "-"
  },
  {
    "name": "Oath",
    "de": "",
    "pts": "",
    "veh": ""
  },
  {
    "name": "Omni-visors",
    "de": "",
    "pts": "1 * LP",
    "veh": "-"
  },
  {
    "name": "Orbital Strike",
    "de": "",
    "pts": "Profil wie BF4+",
    "veh": ""
  },
  {
    "name": "Orders (Imperial Guard)",
    "de": "Befehle (Imperiale Armee)",
    "pts": "0,5 * LP, für alle Einheiten",
    "veh": "1 * LP, für alle Einheiten"
  },
  {
    "name": "Outflank",
    "de": "Flankieren",
    "pts": "0,5 * LP",
    "veh": "1 * LP"
  },
  {
    "name": "Panzaplattn",
    "de": "",
    "pts": "wie 4+ Rüstung",
    "veh": "-"
  },
  {
    "name": "Parry",
    "de": "Parieren",
    "pts": "1 * LP",
    "veh": "1 * LP"
  },
  {
    "name": "Pathfinder ambush",
    "de": "",
    "pts": "0,5 * LP",
    "veh": "-"
  },
  {
    "name": "Perfect aim",
    "de": "",
    "pts": "10",
    "veh": ""
  },
  {
    "name": "Perfected warfare",
    "de": "",
    "pts": "5",
    "veh": "-"
  },
  {
    "name": "Poison(x+)",
    "de": "Gift(x+)",
    "pts": "4+ 0,5p per Shot, 3+ 1p per Shot, 2+ 2p per shot",
    "veh": ""
  },
  {
    "name": "Polymorphine",
    "de": "",
    "pts": "0,5 * LP",
    "veh": "-"
  },
  {
    "name": "Power through pain",
    "de": "Macht durch Schmerz",
    "pts": "0,5 * LP",
    "veh": "1 * LP"
  },
  {
    "name": "Prey on the weak",
    "de": "",
    "pts": "1 * LP",
    "veh": "1 * LP"
  },
  {
    "name": "Psionic Abomination",
    "de": "",
    "pts": "1 * LP",
    "veh": "-"
  },
  {
    "name": "Psychic hood",
    "de": "",
    "pts": "5",
    "veh": "-"
  },
  {
    "name": "Putrefying Stink",
    "de": "",
    "pts": "8",
    "veh": "-"
  },
  {
    "name": "Putrescent fog",
    "de": "",
    "pts": "",
    "veh": ""
  },
  {
    "name": "Reanimation Protocols",
    "de": "Reanimationsprotokolle",
    "pts": "5 * LP",
    "veh": "5 * LP"
  },
  {
    "name": "Regeneration(x)",
    "de": "",
    "pts": "x * LP * 3",
    "veh": "x * LP * 5"
  },
  {
    "name": "Reign of Confusion",
    "de": "",
    "pts": "LP",
    "veh": "-"
  },
  {
    "name": "Relentless March",
    "de": "",
    "pts": "20",
    "veh": "-"
  },
  {
    "name": "Repair Barge",
    "de": "",
    "pts": "-",
    "veh": "12"
  },
  {
    "name": "Rites of Reanimation",
    "de": "Riten der Reanimation",
    "pts": "5",
    "veh": "5"
  },
  {
    "name": "Scarab hive",
    "de": "Skarabäenschwarm",
    "pts": "-",
    "veh": "10"
  },
  {
    "name": "Sentinel construct",
    "de": "",
    "pts": "-",
    "veh": "2 * LP"
  },
  {
    "name": "Servant",
    "de": "",
    "pts": "",
    "veh": ""
  },
  {
    "name": "Shield host",
    "de": "",
    "pts": "0,5 * LP",
    "veh": ""
  },
  {
    "name": "Shield of Faith",
    "de": "Schild des Glaubens",
    "pts": "Nach Profiländerung",
    "veh": "Nach Profiländerung"
  },
  {
    "name": "Shred",
    "de": "",
    "pts": "2",
    "veh": ""
  },
  {
    "name": "Shunt",
    "de": "",
    "pts": "0,5 * LP",
    "veh": "1 * LP"
  },
  {
    "name": "Shunting",
    "de": "",
    "pts": "",
    "veh": ""
  },
  {
    "name": "Sky dive",
    "de": "",
    "pts": "1",
    "veh": "-"
  },
  {
    "name": "Slaves of Darkness",
    "de": "",
    "pts": "",
    "veh": ""
  },
  {
    "name": "Soul harvest",
    "de": "",
    "pts": "5",
    "veh": "-"
  },
  {
    "name": "Soul-shredding explosion",
    "de": "",
    "pts": "",
    "veh": ""
  },
  {
    "name": "Squadron",
    "de": "Schwadron",
    "pts": "-",
    "veh": ""
  },
  {
    "name": "Steady Advance",
    "de": "",
    "pts": "",
    "veh": ""
  },
  {
    "name": "Stealth",
    "de": "Tarnung",
    "pts": "+2 besserer Rüstungswurf laut Profil -5 Punkte",
    "veh": "+2 besserer Rüstungswurf laut Profil -5 Punkte"
  },
  {
    "name": "Stim overdrive",
    "de": "",
    "pts": "LP",
    "veh": ""
  },
  {
    "name": "Summoning",
    "de": "",
    "pts": "",
    "veh": ""
  },
  {
    "name": "Supporting Fire",
    "de": "",
    "pts": "0,5 * LP",
    "veh": "0,5 * LP"
  },
  {
    "name": "Surgeon",
    "de": "",
    "pts": "5",
    "veh": "-"
  },
  {
    "name": "Systemic Vigour",
    "de": "",
    "pts": "",
    "veh": ""
  },
  {
    "name": "Tactical philosophies",
    "de": "",
    "pts": "5 Punkte je 500 Punkte Spielgröße",
    "veh": "-"
  },
  {
    "name": "Tainted Narthecium",
    "de": "",
    "pts": "wie 5 Plague Marines mit 6+ Retter",
    "veh": "-"
  },
  {
    "name": "Tank hunter",
    "de": "Panzerjäger",
    "pts": "1 * LP",
    "veh": "1 * LP"
  },
  {
    "name": "Targeting relay",
    "de": "",
    "pts": "-",
    "veh": "5"
  },
  {
    "name": "Teleport strike",
    "de": "",
    "pts": "",
    "veh": "-"
  },
  {
    "name": "Tempor mortis",
    "de": "",
    "pts": "5",
    "veh": "-"
  },
  {
    "name": "Terrifying(-x)",
    "de": "Furchterregend(-x)",
    "pts": "0,5 * x * LP",
    "veh": "1 * x * LP"
  },
  {
    "name": "The Seven-fold Chant",
    "de": "",
    "pts": "5",
    "veh": "-"
  },
  {
    "name": "They Shall Know No Fear",
    "de": "Die keine Furcht kennen",
    "pts": "0,5 * LP",
    "veh": "0,5 * LP"
  },
  {
    "name": "Tidewall shield generator",
    "de": "",
    "pts": "-",
    "veh": "30"
  },
  {
    "name": "Transformed shape",
    "de": "",
    "pts": "1 * LP",
    "veh": "-"
  },
  {
    "name": "Transport",
    "de": "",
    "pts": "-",
    "veh": "1 * Kapazität"
  },
  {
    "name": "Transport (Night Scythe)",
    "de": "",
    "pts": "-",
    "veh": "17"
  },
  {
    "name": "Trophy-taker",
    "de": "",
    "pts": "10",
    "veh": ""
  },
  {
    "name": "Troublemakers",
    "de": "",
    "pts": "-1 * LP",
    "veh": ""
  },
  {
    "name": "Unpredictable mutations",
    "de": "",
    "pts": "1 * LP",
    "veh": "-"
  },
  {
    "name": "Unyielding",
    "de": "",
    "pts": "",
    "veh": ""
  },
  {
    "name": "Upgrade for HQ",
    "de": "Upgrade für HQ",
    "pts": "+15",
    "veh": "-"
  },
  {
    "name": "Upgrade for squad leader",
    "de": "Upgrade für Truppführer",
    "pts": "+5 bis 20 Punkte, sonst +10",
    "veh": "-"
  },
  {
    "name": "Use cover",
    "de": "Deckung nutzen",
    "pts": "0,5 * LP",
    "veh": "0,5 * LP"
  },
  {
    "name": "Vanguard",
    "de": "Vorhut",
    "pts": "1 * LP",
    "veh": "1 * LP"
  },
  {
    "name": "Vector strike",
    "de": "",
    "pts": "",
    "veh": ""
  },
  {
    "name": "Void armor",
    "de": "",
    "pts": "wie +1 RW im Profil, sonst 3,5 * LP",
    "veh": "wie +1 RW im Profil, sonst 3,5 * LP"
  },
  {
    "name": "Waaagh",
    "de": "",
    "pts": "5 Punkte je 500 Punkte Spielgröße",
    "veh": "-"
  },
  {
    "name": "Waaagh!",
    "de": "",
    "pts": "0,5 * LP",
    "veh": "1 * LP"
  },
  {
    "name": "Waaagh! Energy",
    "de": "Waaagh! Energie",
    "pts": "1 * LP",
    "veh": ""
  },
  {
    "name": "Wildork",
    "de": "",
    "pts": "3,92 + LP + 6++ Rettungswurf",
    "veh": "-"
  },
  {
    "name": "Wraithbone",
    "de": "",
    "pts": "wie +1 RW im Profil, sonst 3,5 * LP",
    "veh": "wie +1 RW im Profil, sonst 3,5 * LP"
  },
  {
    "name": "Siphoned Vigour",
    "de": "",
    "pts": "2",
    "veh": "-"
  },
  {
    "name": "Seeker of Divine Arcana",
    "de": "",
    "pts": "5",
    "veh": "-"
  },
  {
    "name": "Servo-skull Uplink",
    "de": "",
    "pts": "5",
    "veh": "-"
  },
  {
    "name": "Battle Protocols",
    "de": "",
    "pts": "10",
    "veh": ""
  },
  {
    "name": "Rad-saturation",
    "de": "",
    "pts": "0,5 * LP",
    "veh": "0,5 * LP"
  },
  {
    "name": "Siege shield",
    "de": "",
    "pts": "-",
    "veh": "2.5"
  },
  {
    "name": "Offizier",
    "de": "",
    "pts": "5 je Befehl",
    "veh": "5 je Befehl"
  },
  {
    "name": "Schwerfälliges Ungetüm",
    "de": "",
    "pts": "-",
    "veh": "wie move through cover"
  },
  {
    "name": "Plasmakanonen",
    "de": "",
    "pts": "Beide Profile Mittelwert, aber Schusszahl immer bei Explosiv immer 4 und bei Geschütz immer 6",
    "veh": "Beide Profile Mittelwert, aber Schusszahl immer bei Explosiv immer 4 und bei Geschütz immer 6"
  },
  {
    "name": "Es ist zu deinem eigenen Besten",
    "de": "",
    "pts": "",
    "veh": "-"
  },
  {
    "name": "Prioritätsbombardement",
    "de": "",
    "pts": "",
    "veh": "-"
  },
  {
    "name": "Wundersames Eingreifen",
    "de": "",
    "pts": "5",
    "veh": "-"
  },
  {
    "name": "Seeking",
    "de": "Suchend",
    "pts": "2 per Shot of the weapon",
    "veh": "-"
  },
  {
    "name": "Smoke grenades",
    "de": "Rauchgranaten",
    "pts": "1",
    "veh": ""
  },
  {
    "name": "Astrale Vorhersehung",
    "de": "",
    "pts": "15",
    "veh": "-"
  },
  {
    "name": "Void shield",
    "de": "",
    "pts": "30 per shield",
    "veh": ""
  },
  {
    "name": "Glory Hogs",
    "de": "",
    "pts": "4.5",
    "veh": "-"
  }
];
