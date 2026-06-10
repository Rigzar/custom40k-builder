import type { Unit } from '../../types/data';
import type { FactionData } from '../../types/data';
import type { ArmyState } from '../../types/army';
import type { RosterEntry } from '../../types/army';
import type { ResolvedProfile, FactionResolverFn } from '../resolver';

/**
 * Space Marines faction resolver.
 *
 * A faction resolver injects per-unit profile changes DERIVED FROM ARMY STATE on top of the base
 * resolved profile — e.g. CSM injects Chaos-Mark ability reminders, vehicle weapon overrides and
 * the "favored" flag (see resolver-csm.ts). Space Marines have NONE of those state-derived triggers:
 * no marks, no favored mechanic, and no archetype that rewrites a unit's weapons or stats. So this
 * resolver is an INTENTIONAL passthrough — not a stub awaiting work.
 *
 * SM faction rules are all handled in their dedicated layers, not here:
 *  - Army rule "They Shall Know No Fear" — static, baked into each unit's `abilities` in the data.
 *  - Archetypes (1st Company, Death from Above, Drop Pod Assault, Forlorn Brothers, Legion, Librarian
 *    Conclave, Renegades, Swift as the Wind) — slot/troops/composition rules → engine/archetypes/space_marines/index.ts
 *    (+ Legion's army-wide Horus Heresy armory grant via sharedSupplementArmory).
 *  - Legacies (9 chapters) — armory + psychic-discipline access (incl. Black Templars → Crusader
 *    prayers) → engine/legacies/space_marines.ts, surfaced in ArmoryModal / power pickers.
 *  - Traits (incl. Red Thirst, Black Rage interactions) → engine/traits/space_marines.ts (applied via
 *    the shared trait-effects pipeline in resolver.ts).
 *  - Forlorn Brothers "Black Rage" composition + uniqueness rules → engine/validators/space_marines.ts.
 *  - Gravis (ᴳ) / Terminator (ᵀ) armour gating → engine/keywords.ts (keyword seam) + ArmoryModal.
 *  - Jump-pack unit-type options → OptionEffect (set_unit_type / adds_unit_types) on the data, applied
 *    by the shared option-effect pass in resolver.ts.
 *
 * If a future SM rule needs to change the resolved PROFILE based on army state (a chapter combat
 * doctrine, a legacy that buffs a stat army-wide, …) it belongs here. Nothing today does.
 */
export const smResolve: FactionResolverFn = (
  base: ResolvedProfile,
  _item: RosterEntry,
  _unit: Unit,
  _state: ArmyState,
  _data: FactionData,
): ResolvedProfile => base;
