/**
 * T'au "SUPPORT SYSTEMS" (GH#243). The Armory sheet has a SUPPORT SYSTEMS section apart from EQUIPMENT, and the
 * datasheets cap it: Commander "May pick up to two SUPPORT SYSTEMS from the armory", Crisis Battlesuits "Any model may
 * pick up to two...". Those lines were stored as an option group with no choices, so the unit card showed an empty
 * counter and the Armory never counted anything towards it. This reads the cap from that line and counts the bought
 * items flagged `support_system`, so the card shows n/2 and the Armory stops at the cap.
 */
import type { FactionData, Unit, ArmoryItem } from '../types/data';
import type { RosterEntry } from '../types/army';
import { findArmoryItem } from '../engine/resolver';

type Group = Unit['option_groups'][number];

const WORDS: Record<string, number> = { one: 1, two: 2, three: 3, four: 4 };

/** The datasheet line that caps support systems: no choices of its own, names SUPPORT SYSTEMS and the armory. */
export function isSupportSystemGroup(g: Group): boolean {
  return (g.choices?.length ?? 0) === 0 && /support systems?/i.test(g.header ?? '') && /armou?ry/i.test(g.header ?? '');
}

/** Support systems ONE model may take, from "up to two SUPPORT SYSTEMS" (a bare "a single SUPPORT SYSTEM" is one). */
function perModelCap(g: Group): number {
  const m = (g.header ?? '').match(/up to (\d+|one|two|three|four)\b/i);
  if (!m) return 1;
  return WORDS[m[1].toLowerCase()] ?? (parseInt(m[1], 10) || 1);
}

/** The cap for this roster entry, or null when its datasheet has no such line. */
export function supportSystemCap(
  unit: Unit, item: RosterEntry, data: FactionData, traitPool: string[],
): number | null {
  const g = unit.option_groups.find(isSupportSystemGroup);
  if (!g) return null;
  // "Any model may pick..." is per model; the Commander's line is for its single model.
  const models = /^any\b/i.test((g.header ?? '').trim()) ? Math.max(1, item.size ?? 1) : 1;
  // Army Customisation: "Every model with access to a SUPPORT SYSTEM may pick one additional SUPPORT SYSTEM".
  const advancedMiniaturization = traitPool.includes('Advanced Miniaturization') ? 1 : 0;
  // XV85 Enforcer: "it may select one more weapon or support system". Counted as one more support system, because the
  // choice between the two is not tracked.
  const enforcers = item.armory.filter(a => a.itemName === 'XV85 Enforcer battlesuit').length;
  return (perModelCap(g) + advancedMiniaturization) * models + enforcers;
}

/** How many support systems the entry has bought. */
export function supportSystemsOwned(unit: Unit, item: RosterEntry, data: FactionData): number {
  return item.armory.filter(sel => {
    const found = findArmoryItem(data, sel, !!unit.is_vehicle) as (ArmoryItem & { support_system?: boolean }) | undefined;
    return !!found?.support_system;
  }).length;
}
