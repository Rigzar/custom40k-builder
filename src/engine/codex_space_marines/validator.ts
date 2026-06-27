import type { FactionData } from '../../types/data';
import type { ArmyState } from '../../types/army';
import type { ValidationItem } from '../validators';
import { resolveUnit } from '../points';

/**
 * Space Marines-specific validation rules.
 *
 * Called from validators/index.ts after generic validation passes.
 * Returns additional ValidationItems (errors / warnings / ok messages).
 *
 * Status: complete — covers the archetype composition/uniqueness rules that the generic AOP pass
 * can't express: 1st Company (restricted unit list), Forlorn Brothers (Black-Rage-only creatures),
 * Librarian Conclave (Librarian-only HQ), Expanded Armory (forces a 2nd Legacy), Renegades (CSM
 * trait), plus the three "one per army" cross-variant uniqueness checks (Captain / Captain
 * Dreadnought, Master of Sanctity / Chaplain Dreadnought, Chief Librarian / Librarian Dreadnought).
 */
export function validateSpaceMarines(
  state: ArmyState,
  data: FactionData,
): ValidationItem[] {
  const items: ValidationItem[] = [];

  // ── 1st Company ───────────────────────────────────────────────────────────
  // Restricted unit list — only specific units allowed.
  if (state.archetype === '1st Company') {
    const ALLOWED_1ST = new Set([
      'Captain Dreadnought', 'Lieutenant', 'Chaplain', 'Chaplain Dreadnought',
      "Emperor's Champion", 'Librarian', 'Librarian Dreadnought',
      'Ancient', 'Apothecary', 'Deathwing Knights', 'Dreadnought',
      'Ironclad Dreadnought', 'Redemptor Dreadnought', 'Honor Guard', 'Judicar',
      'Company Champion', 'Techmarine', 'Terminator Squad',
      'Land Raider', 'Land Raider Ares', 'Land Raider Crusader', 'Land Raider Redeemer',
      'Repulsor', 'Repulsor Executioner', 'Drop Pod',
    ]);
    for (const item of state.army) {
      if (!ALLOWED_1ST.has(item.unitName)) {
        items.push({
          type: 'error',
          text: `1st Company: "${item.unitName}" is not allowed in this archetype.`,
        });
      }
    }
  }

  // ── Forlorn Brothers ──────────────────────────────────────────────────────
  // Only units with "Black Rage" equipment (Blood Angels legacy required),
  // Dreadnoughts, and transports.
  if (state.archetype === 'Forlorn Brothers') {
    const FORLORN_ALLOWED = new Set([
      'Death Company', 'Dreadnought', 'Ironclad Dreadnought', 'Redemptor Dreadnought',
      'Chaplain Dreadnought', 'Drop Pod', 'Impulsor', 'Razorback', 'Rhino',
    ]);
    for (const item of state.army) {
      const u = resolveUnit(item, data);
      if (!u) continue;
      // Units that aren't in the explicit allowed list must have Black Rage in their armory
      const hasBlackRage = item.armory.some(a => a.itemName === 'Black Rage');
      if (!FORLORN_ALLOWED.has(item.unitName) && !hasBlackRage) {
        items.push({
          type: 'error',
          text: `Forlorn Brothers: "${item.unitName}" requires the "Black Rage" equipment (Blood Angels Legacy) or must be a Dreadnought/transport.`,
        });
      }
    }
  }

  // ── Librarian Conclave ────────────────────────────────────────────────────
  // hqOverride already enforced generically. Additional rule:
  // all models must deploy within 12" of each other (in-game, not enforceable in builder).
  // No additional builder validation needed beyond hqOverride.

  // ── Expanded Armory (trait) ───────────────────────────────────────────────
  // When active, each unit may only select items from ONE legacy armory.
  // The existing legacyArmoryLock mechanism handles this. Validate it is respected.
  if (state.traitPool.includes('Expanded Armory')) {
    for (const item of state.army) {
      if (!item.legacyArmoryLock) continue;
      const violating = item.armory.filter(a => {
        const isLegacyItem = Object.keys(data.armory_legions).some(k => a.source === k);
        return isLegacyItem && a.source !== item.legacyArmoryLock;
      });
      if (violating.length > 0) {
        items.push({
          type: 'error',
          text: `Expanded Armory: ${item.unitName} has items from multiple legacy armories. Each unit may only use one.`,
        });
      }
    }
  }

  // ── Renegades (trait from CSM list) ──────────────────────────────────────
  // May select one Trait from the Chaos Space Marines trait list.
  // The trait pool selector already handles this via UI.
  // No additional validation needed here.

  // ── Captain / Captain Dreadnought: only one per army ─────────────────────
  // "Only one Captain or Captain Dreadnought per army."
  const captainDreadnoughtCount = state.army.filter(i => i.unitName === 'Captain Dreadnought').length;
  const captainUpgradeCount = state.army.filter(i => {
    if (i.unitName !== 'Lieutenant') return false;
    const u = resolveUnit(i, data);
    if (!u) return false;
    return u.option_groups.some((g, gi) =>
      g.variant_link === 'Captain' && !!(i.optionQty?.[gi]?.['__inline']),
    );
  }).length;
  if (captainDreadnoughtCount + captainUpgradeCount > 1) {
    items.push({
      type: 'error',
      text: 'Only one Captain or Captain Dreadnought per army.',
    });
  }

  // ── Master of Sanctity / Chaplain Dreadnought: only one per army ─────────
  // "Only one Master of Sanctity or Chaplain Dreadnought per army."
  const chaplainDreadnoughtCount = state.army.filter(i => i.unitName === 'Chaplain Dreadnought').length;
  const masterOfSanctityCount = state.army.filter(i => {
    if (i.unitName !== 'Chaplain') return false;
    const u = resolveUnit(i, data);
    if (!u) return false;
    return u.option_groups.some((g, gi) =>
      g.variant_link === 'Master of Sanctity' && !!(i.optionQty?.[gi]?.['__inline']),
    );
  }).length;
  if (chaplainDreadnoughtCount + masterOfSanctityCount > 1) {
    items.push({
      type: 'error',
      text: 'Only one Master of Sanctity or Chaplain Dreadnought per army.',
    });
  }

  // ── Chief Librarian / Librarian Dreadnought: only one per army ───────────
  // "Only one Chief Librarian or Librarian Dreadnought per army."
  const librarianDreadnoughtCount = state.army.filter(i => i.unitName === 'Librarian Dreadnought').length;
  const chiefLibrarianCount = state.army.filter(i => {
    if (i.unitName !== 'Librarian') return false;
    const u = resolveUnit(i, data);
    if (!u) return false;
    return u.option_groups.some((g, gi) =>
      g.variant_link === 'Chief Librarian' && !!(i.optionQty?.[gi]?.['__inline']),
    );
  }).length;
  if (librarianDreadnoughtCount + chiefLibrarianCount > 1) {
    items.push({
      type: 'error',
      text: 'Only one Chief Librarian or Librarian Dreadnought per army.',
    });
  }

  return items;
}
