export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  changes: string[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: '0.5',
    date: '2026-05-18',
    title: 'Load armies & army codes',
    changes: [
      'Added "My Armies" button in the builder — load saved armies without leaving the page',
      'Army codes: compact copy/paste code to share armies across devices with no account',
      'This changelog — track every improvement as the app grows',
    ],
  },
  {
    version: '0.4',
    date: '2026-05-18',
    title: 'Army naming & save system',
    changes: [
      'Armies can now be named — click the pencil icon in the header to rename',
      'Auto-assigned name (e.g. "Space Marines Army") if left blank',
      'Save Army button — stores up to many armies in the browser, no account needed',
      'Landing page shows all saved armies with load and delete buttons',
    ],
  },
  {
    version: '0.3',
    date: '2026-05-18',
    title: 'Prayers & Legacy disciplines',
    changes: [
      'Adeptus Sororitas: 5 Battle Hymns added; Missionary, Dogmata, Preacher are now priests',
      'Imperial Guard: same Battle Hymns; Preacher now has prayer access',
      'Space Marines: 5 Legacy disciplines (Geokinesis, Interromancy, Sanguine, Stormspeaking, Tempestus)',
      'Legacy disciplines only appear when an active Legacy is chosen for the army',
    ],
  },
  {
    version: '0.2',
    date: '2026-05-17',
    title: 'Psychic powers for all factions',
    changes: [
      'Eldar: 4 disciplines (Battle, Fate, Revenant, Wraith) with unit-type restrictions in names',
      'Chaos Daemons: 3 mark-only disciplines (Change, Decay, Excess)',
      'Imperial Guard: Psikana I & II disciplines',
      'Inquisition: Heresius & Telesthesia disciplines',
      'Genestealer Cults: Broodmind & Legacy Psychic Powers',
      'Harlequins: Phantasmancy discipline',
      'Leagues of Votann: Skeinwrought discipline',
      'Orks: Waaagh! discipline',
      'Necrons: C\'tan Shard powers (Powers of the C\'tan); Pariahs corrected to non-psyker',
      'Adeptus Custodes: Sisters of Silence and Rhino corrected to non-psyker',
      'Horus Heresy supplement removed from faction selector (it is a supplement, not a faction)',
    ],
  },
  {
    version: '0.1',
    date: '2026-05-17',
    title: 'Initial release',
    changes: [
      '18 playable factions across Chaos, Imperium and Xenos',
      'Unit slots, options, sizes, and points calculation',
      'Archetype and Legacy selection',
      'Veteran traits and armory items per unit',
      'Psychic powers and prayers (CSM, Space Marines, Grey Knights)',
      'Marks of Chaos with discipline filtering',
      'Army validation and print view',
      'Export / Import JSON',
      'App deployed on Vercel with auto-deploy from GitHub',
    ],
  },
];
