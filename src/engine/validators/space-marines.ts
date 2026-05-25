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
 * Status: skeleton — rules to be filled in after unit audit.
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
      'Company Champion', 'Techmarine', 'Terminator Squad', 'Terminator Assault Squad',
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

  return items;
}
