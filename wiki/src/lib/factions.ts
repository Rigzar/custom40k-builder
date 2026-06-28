export interface FactionConfig {
  key: string;
  label: string;
  symbol: string;
}

export const PILOT_FACTIONS: FactionConfig[] = [
  { key: 'orks', label: 'Orks', symbol: 'orks.svg' },
  { key: 'necrons', label: 'Necrons', symbol: 'necrons.svg' },
];

export function getFactionConfig(key: string): FactionConfig | undefined {
  return PILOT_FACTIONS.find(f => f.key === key);
}
