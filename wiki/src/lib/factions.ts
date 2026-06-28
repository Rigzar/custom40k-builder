export interface FactionConfig {
  key: string;
  label: string;
  symbol: string;
}

export const ALL_FACTIONS: FactionConfig[] = [
  { key: 'chaos_space_marines', label: 'Chaos Space Marines', symbol: 'chaos-space-marines.svg' },
  { key: 'chaos_daemons', label: 'Chaos Daemons', symbol: 'chaos-daemons.svg' },
  { key: 'space_marines', label: 'Space Marines', symbol: 'space-marines.svg' },
  { key: 'imperial_guard', label: 'Imperial Guard', symbol: 'imperial-guard.svg' },
  { key: 'adeptus_mechanicus', label: 'Adeptus Mechanicus', symbol: 'adeptus-mechanicus.svg' },
  { key: 'adeptus_custodes', label: 'Adeptus Custodes', symbol: 'adeptus-custodes.svg' },
  { key: 'adeptus_sororitas', label: 'Adeptus Sororitas', symbol: 'adeptus-sororitas.svg' },
  { key: 'grey_knights', label: 'Grey Knights', symbol: 'grey-knights.svg' },
  { key: 'inquisition', label: 'Inquisition', symbol: 'inquisition.svg' },
  { key: 'assassins', label: 'Assassins', symbol: 'assassins.svg' },
  { key: 'tau_empire', label: 'Tau Empire', symbol: 'tau-empire.svg' },
  { key: 'necrons', label: 'Necrons', symbol: 'necrons.svg' },
  { key: 'orks', label: 'Orks', symbol: 'orks.svg' },
  { key: 'eldar', label: 'Eldar', symbol: 'eldar.svg' },
  { key: 'dark_eldar', label: 'Dark Eldar', symbol: 'dark-eldar.svg' },
  { key: 'genestealer_cults', label: 'Genestealer Cults', symbol: 'genestealer-cults.svg' },
  { key: 'harlequins', label: 'Harlequins', symbol: 'harlequins.svg' },
  { key: 'leagues_of_votann', label: 'Leagues of Votann', symbol: 'leagues-of-votann.svg' },
  { key: 'tyranids', label: 'Tyranids', symbol: 'tyranids.svg' },
];

export function getFactionConfig(key: string): FactionConfig | undefined {
  return ALL_FACTIONS.find(f => f.key === key);
}
