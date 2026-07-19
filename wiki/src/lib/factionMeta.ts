// Category grouping mirrors src/components/LandingPage.tsx's CATEGORIES array exactly, so the
// wiki home page is organised the same way as the main app's faction picker.

export interface FactionCategory {
  name: string;
  icon: string;
  pillFg: string;
  dividerColor: string;
  factionKeys: string[];
}

export const CATEGORIES: FactionCategory[] = [
  {
    name: 'Chaos',
    icon: '/category-icons/chaos.svg',
    pillFg: '#cc8888',
    dividerColor: '#3a1a1a',
    factionKeys: ['chaos_space_marines', 'chaos_daemons'],
  },
  {
    name: 'Imperium',
    icon: '/category-icons/imperium.svg',
    pillFg: '#c8b56a',
    dividerColor: '#3a3520',
    factionKeys: [
      'space_marines', 'imperial_guard', 'adeptus_mechanicus', 'adeptus_custodes',
      'adeptus_sororitas', 'grey_knights', 'inquisition',
    ],
  },
  {
    name: 'Xenos',
    icon: '/category-icons/xenos.svg',
    pillFg: '#6ab88a',
    dividerColor: '#1a3a28',
    factionKeys: [
      'tau_empire', 'necrons', 'orks', 'eldar', 'dark_eldar',
      'genestealer_cults', 'harlequins', 'leagues_of_votann', 'tyranids',
    ],
  },
  {
    name: 'Supplements',
    icon: '/category-icons/imperium.svg',
    pillFg: '#9a9aa8',
    dividerColor: '#28283a',
    factionKeys: ['assassins', 'horus_heresy', 'escalation'],
  },
];

/** Factions with Lords of War access via the Escalation supplement (Epic Battle engagement) —
 *  mirrors src/components/SupplementModal.tsx's escalation.load() faction list exactly. */
export const ESCALATION_FACTIONS = [
  'chaos_space_marines', 'space_marines', 'adeptus_sororitas', 'imperial_guard',
  'eldar', 'orks', 'necrons', 'tau_empire',
];

export const FACTION_DESCRIPTIONS: Record<string, string> = {
  chaos_space_marines:
    'Once the Emperor\'s finest warriors, the Chaos Space Marines fell to darkness during the Horus Heresy ten thousand years ago. Bound to the Chaos Gods or driven by bitter hatred of the Imperium, they wage eternal war from the Eye of Terror aboard ancient vessels crewed by slaves and daemons.',
  chaos_daemons:
    'Creatures of pure Warp energy, Daemons are the physical manifestations of Chaos itself. Called forth by blood rituals and psychic ruptures, they bleed into realspace as living weapons of the Dark Gods — each a reflection of their patron\'s nature, from the frenzied Bloodletters of Khorne to the iridescent Horrors of Tzeentch.',
  space_marines:
    'The Space Marines are the Emperor\'s Angels of Death — posthuman warriors engineered to be the finest soldiers in the galaxy. Clad in ceramite power armour and bearing the finest weapons the Imperium can produce, each Chapter is a brotherhood apart, its own traditions and heraldry forged across ten thousand years of unending war.',
  imperial_guard:
    'The Imperial Guard — the Astra Militarum — is the hammer of the Imperium. Billions of ordinary human soldiers, drawn from a million worlds, hold the line against horrors that would shatter lesser minds. What they lack in superhuman ability they compensate with sheer numbers, massed artillery, and an iron will born of faith.',
  adeptus_mechanicus:
    'The Tech-Priests of Mars worship the Omnissiah and tend the sacred mysteries of the machine. They maintain the galaxy-spanning infrastructure of the Imperium, trading their flesh for augmetics and their memories for data-codices. On the battlefield their Skitarii cohorts and towering war-robots crush anything that dares threaten the Omnissiah\'s works.',
  adeptus_custodes:
    'Created by the Emperor\'s own hand using gene-craft beyond that of the Primarchs, the Adeptus Custodes are each a match for a hundred Space Marines. The Ten Thousand stand eternal vigil over the Golden Throne, and when they march to war their golden spears leave no enemy standing.',
  adeptus_sororitas:
    'The Sisters of Battle are the militant arm of the Ecclesiarchy — fanatic warrior-nuns clad in blessed power armour, driven by an unshakeable faith that manifests as miraculous Acts of Faith on the battlefield. Wherever heresy festers they bring bolter and flame, for the Emperor\'s will is written in fire.',
  grey_knights:
    'A secret Chapter known only to the highest levels of the Inquisition, the Grey Knights are humanity\'s last bulwark against daemonic incursion. Every Battle-Brother is a formidable psyker, and their very names are wards against possession. Their blades are forged with daemon-banishing rituals older than the Imperium itself.',
  inquisition:
    'The Inquisition is the secret police of the Imperium — autonomous agents empowered to root out heresy, xenos corruption, and daemonic influence by any means necessary. An Inquisitor operates above the law, commanding acolyte warbands, mercenaries, and specialist troops as they pursue their purges without oversight.',
  tau_empire:
    'A young and rapidly expanding interstellar civilisation, the Tau Empire is united under the doctrine of the Greater Good. Where other races make war through brute force, the Tau combine coordinated firepower, aerial supremacy, and sophisticated battlesuits into a military that punches far above its apparent weight.',
  necrons:
    'Sixty million years ago the Necrontyr surrendered their flesh to become immortal machines of living metal. They slept while galaxies burned and now they wake, methodically reclaiming tomb worlds buried under human cities and alien civilisations, their deathless legions driven by the cold will of undying nobility.',
  orks:
    'The Orks are a fungal species that live for one thing: the fight. Every Ork is born knowing how to wield a weapon and thirsts for brutal combat above all else. Their ramshackle technology works because they believe it will, and wherever enough Orks gather a WAAAGH! erupts — a tide of green violence that sweeps whole sectors into ruin.',
  eldar:
    'The Eldar are an ancient civilisation that once ruled the galaxy before their Fall birthed the Chaos God Slaanesh and shattered their empire. The survivors live on vast craftworld-ships, their psychically gifted warriors following paths of discipline that channel their superhuman potential into elegant and lethal battlefield roles.',
  dark_eldar:
    'The Drukhari inhabit Commorragh, a city hidden within the webway, sustained by an eternal feast of pain and suffering stolen from across the galaxy. Raiders by nature, they strike without warning and vanish before a response can be mounted, dragging captives back to fuel the dark pleasures that stave off Slaanesh\'s hunger.',
  genestealer_cults:
    'A Genestealer Cult is a slow-burning infection that hollows out a world from within. Over generations, Genestealer Patriarch broods infiltrate society — spreading their xenos gene-seed through the population, building fanatical congregations that wait patiently for the Hive Fleet\'s arrival before rising in bloody insurrection.',
  harlequins:
    'The Harlequins are wandering performers and deadly warriors who serve Cegorach, the Laughing God. Unbound by Craftworld politics, they travel the webway in masked troupes, putting on performances that retell the great myths of Eldar history — and fighting with an acrobatic ferocity that leaves entire armies broken in their wake.',
  leagues_of_votann:
    'The Leagues of Votann are a confederation of clone-forged warriors descended from humanity\'s oldest stellar pioneers. Short of stature but long of memory, the Kin pursue ancient claims to distant resource-rich worlds with pragmatic efficiency, backed by technology that puts the Adeptus Mechanicus to shame.',
  tyranids:
    'The Tyranids are a vast inter-galactic swarm driven by a single insatiable hunger: to consume all biomass in the galaxy and grow stronger. Countless alien organisms purpose-evolved by the Hive Mind advance in waves that can blot out the sky, absorbing and adapting to every resistance until nothing is left but bare rock.',
  assassins:
    'The Officio Assassinorum maintains six Temples, each training killers of unmatched lethality in a single specialisation — Vindicare marksmen, Callidus shape-changers, Eversor berserkers, Culexus soul-eaters, Vanus information-ghosts, and Venenum poisoners. A single Assassin can topple a planetary government; a full Execution Force has ended wars.',
  horus_heresy:
    'Ten thousand years ago the Emperor\'s most beloved son, Horus Warmaster, turned against his father and plunged the Imperium into a catastrophic civil war. The Horus Heresy supplement covers the Legiones Astartes of that age — Space Marine Legions before the Codex Astartes split them into Chapters, fielding Primarchs, massive Terminator formations, and weaponry since lost to the Long Night. These rules allow you to field armies from the Age of Darkness alongside or against contemporary forces.',
  escalation:
    'The Escalation supplement unlocks Lords of War — the mightiest war engines and most powerful individual combatants available to eight major factions. From the Chaos Space Marines\' towering Daemon Engines to the Necrons\' monolithic Tesseract Vaults and the Orks\' rampaging Stompas, these are the apocalyptic centrepieces reserved for Epic Battle engagements where the stakes demand nothing less than total annihilation.',
};

export function getFactionDescription(key: string): string {
  return FACTION_DESCRIPTIONS[key] ?? 'Description coming soon.';
}

/** Codex document version, from each faction's canonical .ods title. Only factions whose .ods
 *  carries a version in its title are listed; others render without a version badge. */
export const FACTION_VERSIONS: Record<string, string> = {
  imperial_guard: '1.02',
  grey_knights: '1.01',
  orks: '1.01',
  eldar: '1.01',
  dark_eldar: '1.01',
  tyranids: '1.02',
  // all other audited factions default to their first published version
  chaos_space_marines: '1.00',
  chaos_daemons: '1.00',
  space_marines: '1.00',
  adeptus_mechanicus: '1.00',
  adeptus_custodes: '1.00',
  adeptus_sororitas: '1.00',
  inquisition: '1.00',
  tau_empire: '1.00',
  necrons: '1.01',
  genestealer_cults: '1.00',
  harlequins: '1.00',
  leagues_of_votann: '1.02',
};

export function getFactionVersion(key: string): string | undefined {
  return FACTION_VERSIONS[key];
}
