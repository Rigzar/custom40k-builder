import type { FactionData } from '../../types/data';
import type { ArmyState } from '../../types/army';
import type { ValidationItem } from '../validators';
import { t, tpl } from '../../i18n';
import type { Language } from '../../i18n';

// Trait name suffix glyphs by sub-faction (from archetypes.json)
const COVEN_GLYPH = 'ᶜᵒ';
const KABAL_GLYPH = 'ᴷ';
const CULT_GLYPH  = 'ᶜᵘ';

export function validateDarkEldar(
  state: ArmyState,
  _data: FactionData,
  language: Language = 'en',
): ValidationItem[] {
  const T = (key: Parameters<typeof t>[1], vars?: Record<string, string | number>) => tpl(t(language, key), vars ?? {});
  const items: ValidationItem[] = [];

  if (state.archetype !== 'Coordinated Raid') return items;

  // ── HQ composition ───────────────────────────────────────────────────────
  // "must feature one Dracon, one Haemonculus and one Succubus (or their upgraded variants)"
  // Variant upgrades are inline option_groups on the same unit (variant_link), so unitName
  // stays "Dracon"/"Haemonculus"/"Succubus" regardless of whether the upgrade is taken.
  const hq = state.army.filter(e => !e.factionSource);
  const hasDracon      = hq.some(e => e.unitName === 'Dracon');
  const hasHaemonculus = hq.some(e => e.unitName === 'Haemonculus');
  const hasSuccubus    = hq.some(e => e.unitName === 'Succubus');

  if (!hasDracon)      items.push({ type: 'error', text: T('valDeCoordRaidNoDracon') });
  if (!hasHaemonculus) items.push({ type: 'error', text: T('valDeCoordRaidNoHaemonculus') });
  if (!hasSuccubus)    items.push({ type: 'error', text: T('valDeCoordRaidNoSuccubus') });

  // ── Trait sub-faction distribution ───────────────────────────────────────
  // "must pick one trait each for <Coven>, <Kabal>, and <Wyches>"
  const pool = state.traitPool;
  const hasCoven = pool.some(n => n.endsWith(COVEN_GLYPH));
  const hasKabal = pool.some(n => n.endsWith(KABAL_GLYPH));
  const hasCult  = pool.some(n => n.endsWith(CULT_GLYPH));

  if (!hasCoven) items.push({ type: 'error', text: T('valDeCoordRaidTraitCoven') });
  if (!hasKabal) items.push({ type: 'error', text: T('valDeCoordRaidTraitKabal') });
  if (!hasCult)  items.push({ type: 'error', text: T('valDeCoordRaidTraitCult') });

  return items;
}
