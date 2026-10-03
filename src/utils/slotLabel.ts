import { t, type Language, type TranslationKey } from '../i18n';

/** The army-list slot as the reader's language names it. Slot names are engine keys; only draw them through this. */
const SLOT_LABEL_KEY: Record<string, TranslationKey> = {
  'HQ': 'hq', 'Troops': 'troops', 'Elites': 'elites', 'Fast Attack': 'fastAttack',
  'Heavy Support': 'heavySupport', 'Dedicated Transport': 'transport', 'Transport': 'transport',
  'Fortifications': 'fortifications', 'Flyers': 'flyers', 'Lords of War': 'lordsOfWar',
};

export function slotLabel(language: Language, slot: string): string {
  const key = SLOT_LABEL_KEY[slot];
  return key ? t(language, key) : slot;
}
