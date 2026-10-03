import type { useT } from '../i18n';

type T = ReturnType<typeof useT>;

/** The engagement's name and rules line in the reader's language. `ENGAGEMENTS[e].name/.notes` are English engine data: draw them through here. */
export function engName(t: T, e: string): string {
  return e === 'skirmish' ? t('prefsEngSkirmish') : e === 'pitched' ? t('prefsEngPitched') : e === 'epic' ? t('prefsEngEpic') : e;
}
export function engNotes(t: T, e: string, fallback: string): string {
  return e === 'skirmish' ? t('engNoteSkirmish') : e === 'pitched' ? t('engNotePitched') : e === 'epic' ? t('engNoteEpic') : fallback;
}
