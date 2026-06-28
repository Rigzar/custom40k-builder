const SLOT_ICONS: Record<string, string> = {
  'HQ': 'hq-battlefield-role.svg',
  'Troops': 'troops-battlefield-role.svg',
  'Elites': 'elites-battlefield-role.svg',
  'Fast Attack': 'fast-attack-battlefield-role.svg',
  'Heavy Support': 'heavy-support-battlefield-role.svg',
  'Dedicated Transport': 'dedicated-transport-battlefield-role.svg',
  'Flyers': 'flyer-battlefield-role.svg',
  'Fortifications': 'fortification-battlefield-role.svg',
  'Lords of War': 'lord-of-war-battlefield-role.svg',
};

export function getSlotIcon(slot: string): string | null {
  const file = SLOT_ICONS[slot];
  return file ? `/icons/slots/${file}` : null;
}
