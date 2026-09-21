import type { Unit, Model, FactionData, OptionGroup, Constraint } from '../types/data';
import type { RosterEntry, ArmorySelection, ArmyState } from '../types/army';
import { computeVehicleCombiSurcharge } from './codex_csm/archetypes/weapon-overrides';
import { getArchetypeRule } from './archetypes';
import { getDeploymentUpgrade, unitMayTakeDeploymentUpgrade, deploymentUpgradeCost } from './deploymentUpgrades';

/**
 * Live-recompute an armory selection's cost from the unit's CURRENT size/wounds, instead of
 * trusting the stored `points` as a final value — veteran abilities and per-squadron vehicle
 * upgrades are bought at a base rate that scales with size (see ArmorySelection.scaling), so a
 * stale stored total would be wrong after the squad is resized post-purchase.
 */
/**
 * The one armoury item in the game whose price is a SENTENCE rather than a number.
 *
 * Tau Empire 1.02.ods -> Armory row 46, "Tactical philosophiesᴵ", price cell: "10p per 500p game
 * size". Every other price in all 21 codices is a plain number -- swept to be sure -- so the
 * parser had nowhere to put this and stored null, and the item was bought for FREE. At a
 * 2500-point game it should cost 50.
 *
 * It scales with the GAME SIZE, not with the unit's models or Wounds, which is why it cannot ride
 * on `ArmorySelection.scaling` and needs the point limit threaded in.
 */
const GAME_SIZE_PRICED: Record<string, { points: number; per: number }> = {
  'tactical philosophies': { points: 10, per: 500 },
};

/** Its cost at this game size: "10p per 500p" is a rate, so a 2500-point game pays 5 x 10. */
export function gameSizePrice(itemName: string, pointLimit: number): number | null {
  const key = itemName.replace(/[^ -~]/g, '').trim().toLowerCase();
  const rule = GAME_SIZE_PRICED[key];
  if (!rule || !pointLimit || pointLimit <= 0) return null;
  return Math.ceil(pointLimit / rule.per) * rule.points;
}

export function liveArmoryPoints(a: ArmorySelection, item: RosterEntry, unit: Unit, pointLimit = 0): number {
  const byGameSize = gameSizePrice(a.itemName, pointLimit);
  if (byGameSize !== null) return byGameSize;
  if (a.scaling === 'perModel') return a.points * item.size;
  if (a.scaling === 'perWound') {
    const wStatKey = unit.is_vehicle ? 'HP' : 'W';
    const baseModel = unit.models.find(m => m.max > 0) ?? unit.models[0];
    const woundsPerModel = parseInt(String(baseModel?.stats?.[wStatKey] ?? '1'), 10) || 1;
    return a.points * woundsPerModel * item.size;
  }
  return a.points;
}

/** Resolve a unit from the correct faction source. */
/**
 * The faction whose Army Customisation this roster entry follows. An allied detachment picks its
 * OWN (Core Rules, Allies: "Allies may select their own Army Customisation options"), so an allied
 * entry must be priced against the ALLY's faction, not the primary army's -- otherwise an allied
 * Eldar detachment inside an Ork army would be offered Tellyporta and charged for it.
 */
export function factionForEntry(
  item: { factionSource?: string; nestedFaction?: string },
  data: FactionData,
): string {
  // EVERY read is optional, and that is load-bearing rather than defensive habit. `data` is null
  // until a faction finishes loading, and the saved-army lists price EVERY stored army -- including
  // ones whose faction is not the one currently loaded. Before this function existed
  // `computeUnitPoints` never touched `data` at all, so making it a required argument put a
  // `data.faction` on a path that can legitimately run with nothing loaded: one throw during
  // render is a white screen for the whole app. An empty faction name simply matches no
  // faction-keyed rule, which is the correct answer when we do not yet know the faction.
  const d: any = data as any;
  if (item.factionSource && item.nestedFaction)
    return d?.allied?.[item.factionSource]?.allied?.[item.nestedFaction]?.faction ?? d?.faction ?? '';
  if (item.factionSource) return d?.allied?.[item.factionSource]?.faction ?? d?.faction ?? '';
  return d?.faction ?? '';
}

export function resolveUnit(item: { unitName: string; factionSource?: string; nestedFaction?: string }, data: FactionData): Unit | undefined {
  if (item.factionSource && item.nestedFaction) {
    return data.allied?.[item.factionSource]?.allied?.[item.nestedFaction]?.units[item.unitName];
  }
  if (item.factionSource) {
    return data.allied?.[item.factionSource]?.units[item.unitName];
  }
  return data.units[item.unitName];
}

/**
 * The archetype actually in effect for a given roster item. An Allied Detachment unit uses the
 * ally's OWN Army Customisation (Core Rules: "Allies may select their own Army Customisation
 * options"), never the primary army's — this used to only be checked correctly inside
 * `resolveBase` (resolver.ts), while every other call site (faction resolvers, the join-target
 * picker, the composition validator) read `state.archetype` raw regardless of the item's scope.
 * Use this helper at every such call site instead of reading `state.archetype`/`alliedArchetype`
 * directly, so the scope check can't be forgotten again.
 */
export function effectiveArchetypeFor(item: { factionSource?: string }, state: Pick<ArmyState, 'archetype' | 'alliedArchetype' | 'alliedFaction'>): string {
  const isAlliedItem = !!item.factionSource && item.factionSource === state.alliedFaction;
  return isAlliedItem ? (state.alliedArchetype ?? '') : state.archetype;
}

/** Same scoping as {@link effectiveArchetypeFor}, for the active Legacy. An Allied Detachment
 *  only ever has one Legacy slot (no 2nd-legacy-via-trait unlock — see ArmyState.alliedLegacy
 *  doc), so there is no allied equivalent of `legacy2`. */
export function effectiveLegacyFor(item: { factionSource?: string }, state: Pick<ArmyState, 'legacy' | 'alliedLegacy' | 'alliedFaction'>): string {
  const isAlliedItem = !!item.factionSource && item.factionSource === state.alliedFaction;
  return isAlliedItem ? (state.alliedLegacy ?? '') : state.legacy;
}

/**
 * The ArchetypeRule actually in effect for a given roster item — same scoping as
 * {@link effectiveArchetypeFor}, but returns the resolved rule object directly since most call
 * sites (getEffectiveSlot, grantsCommandSquad, forcedMark, …) want the rule, not the raw name.
 * A single PRIMARY-scoped `rule` computed once per validation/render pass and then reused for
 * EVERY item (including allied ones) is the most common variant of this bug — looks correct for
 * primary-only checks, silently wrong the moment an allied item reaches the same code path.
 */
export function effectiveRuleFor(item: { factionSource?: string }, state: Pick<ArmyState, 'archetype' | 'alliedArchetype' | 'alliedFaction'>) {
  return getArchetypeRule(effectiveArchetypeFor(item, state));
}

function isMarkGroup(g: { constraint: { type: string } }) {
  return g.constraint.type === 'mark';
}

/**
 * `count` is how many models were promoted. Almost every promotion in the game is a single model
 * ("One model may be upgraded to a Klaivex"), but the Ork Burna Boyz and Lootas read "Up to three
 * … may be upgraded to Spannas" — confirmed by the author 2026-08-16, "up to three per unit". It
 * defaults to 1, so the 104 single-model promotions are priced by exactly the same arithmetic.
 */
type ActiveVariant = { variant: Model; group: { header: string; inline_pts: number | null }; count: number };

/**
 * The constraint that is actually in force for a group, given what the entry has bought.
 *
 * Almost always `group.constraint`. The exception is a promotion that CHANGES an existing group's
 * rule instead of adding a new one — the Hive Tyrant picks one specialisation, the Legendary Hive
 * Tyrant must pick one and may pick two. Read the cap and the `required` flag through here.
 */
/**
 * Does this unit satisfy a `requires_keyword` gate?
 *
 * Matches the unit's KEYWORDS and its UNIT TYPE, because the codex gates on both: "Advanced
 * Bioform" is a keyword, while the Living Battering Ram's "Can only be taken by Monstrous
 * Creatures" names a unit type. The type line can hold several ("Flyer, Monstrous Creature"), so
 * it is split before matching.
 *
 * It lives here, and is the ONLY implementation, because the first version of this rule was
 * written into the picker alone: the validator kept matching keywords only and told every
 * Monstrous Creature to remove a biomorph it was entitled to. One rule, one place.
 */
export function unitMatchesKeyword(
  unit: { keywords?: string[]; unit_type?: string }, keyword: string,
): boolean {
  if ((unit.keywords ?? []).includes(keyword)) return true;
  return String(unit.unit_type ?? '').split(',').map(t => t.trim()).includes(keyword);
}

export function groupConstraint(group: OptionGroup, item: RosterEntry, unit: Unit): Constraint {
  const vc = group.variant_constraint;
  if (!vc) return group.constraint;
  return getActiveVariant(item, unit)?.variant.name === vc.variant ? vc.constraint : group.constraint;
}

function getActiveVariant(item: RosterEntry, unit: Unit): ActiveVariant | null {
  for (const [gi, g] of unit.option_groups.entries()) {
    const qty = item.optionQty?.[gi];
    if (g.variant_link && qty?.['__inline']) {
      const variant = unit.variant_models.find(v => v.name === g.variant_link) ?? null;
      if (!variant) return null;
      const cap = g.constraint?.type === 'fixed_max' ? (g.constraint.max ?? 1) : 1;
      return { variant, group: g, count: Math.max(1, Math.min(Number(qty['__inline']) || 1, cap)) };
    }
    // Per-choice variant_link: a multi-choice group (e.g. Necrons Cryptek's 5-way "one of the
    // following" specialisation pick) where only ONE named choice promotes the model to its
    // own variant profile; sibling choices in the same group are plain ability grants.
    for (const [ci, choice] of g.choices.entries()) {
      if (!choice.variant_link || !qty?.[ci]) continue;
      const variant = unit.variant_models.find(v => v.name === choice.variant_link) ?? null;
      if (variant) return { variant, group: g, count: 1 };
    }
  }
  return null;
}

/** The base model group a variant promotes from — derived from the option group's own
 * wording ("One Traitor Guardsman may be promoted to…") rather than array position, since
 * the promoted group isn't always last in `unit.models` (e.g. Traitor Guard's Ogryn group). */
function getPromotedModel(unit: Unit, active: ActiveVariant): Model {
  const { variant, group } = active;
  // Prefer the most specific (longest name) match — e.g. "Grey Hunter Pack Leader" over
  // "Grey Hunter" when both are substrings of the option-group header.
  const nameMatches = unit.models.filter(m => group.header.includes(m.name));
  if (nameMatches.length > 0) {
    return nameMatches.reduce((a, b) => (b.name.length > a.name.length ? b : a));
  }
  return unit.models.find(m => m.points === variant.points - (group.inline_pts ?? 0))
    ?? unit.models.find(m => m.max > m.min && m.min === 0)
    ?? unit.models[0];
}

/**
 * `faction` is REQUIRED and deliberately has no default: it is only needed for the deployment
 * rules (Webway strike / Webway raid / Lightning strike / Tellyporta), which are keyed by faction,
 * and a defaulted parameter would let a forgotten call site under-charge in silence. Making it
 * required means the compiler names every one of the ten places that sum unit points.
 */
export function computeUnitPoints(item: RosterEntry, unit: Unit, archetype: string, faction: string, pointLimit: number): number {
  let total = 0;
  const active = getActiveVariant(item, unit);

  if (active) {
    const { variant } = active;
    const fixedBase = unit.models.reduce((s, m) => s + m.min, 0);
    if (fixedBase === 1 && item.size === 1) {
      total = variant.points;
    } else if (item.modelSizes) {
      // Multi-group unit: bill each group at its own price; the promoted model comes
      // out of its base group's count (one fewer at base price, plus the variant's price).
      const promoted = getPromotedModel(unit, active);
      const promotedCount = active.count;
      for (const m of unit.models) {
        const count = item.modelSizes[m.name] ?? m.min;
        if (m === promoted) {
          total += Math.max(0, count - promotedCount) * m.points + variant.points * promotedCount;
        } else {
          total += count * m.points;
        }
      }
    } else {
      const grunt = unit.models.find(m => m.max > m.min && m.min === 0) ?? unit.models[0];
      total += variant.points * active.count;
      const effectiveSize = Math.max(item.size, grunt.min);
      const extra = Math.max(0, effectiveSize - active.count);
      total += extra * grunt.points;
    }
  } else if (item.modelSizes) {
    // Multi-group unit: each group billed at its own per-model price.
    for (const m of unit.models) {
      const count = item.modelSizes[m.name] ?? m.min;
      total += count * m.points;
    }
  } else {
    const fixed = unit.models.reduce((s, m) => s + m.min, 0);
    const variable = unit.models.find(m => m.max > m.min && m.min === 0) ?? unit.models[0];
    for (const m of unit.models) total += m.min * m.points;
    const extra = Math.max(0, item.size - fixed);
    total += extra * (variable?.points ?? 0);
  }

  if (item.blackCrusadeHQ) {
    // Black Crusade champion pays the combined cost of all four god marks
    const mg = unit.option_groups.find(isMarkGroup);
    if (mg) {
      const CHAOS_MARKS_ALL = ['Khorne', 'Nurgle', 'Slaanesh', 'Tzeentch'];
      for (const markName of CHAOS_MARKS_ALL) {
        const c = mg.choices.find(ch => ch.name === markName);
        if (c) total += c.points * item.size;
      }
    }
  } else {
    // A mark forced by the army's archetype (e.g. Plaguehost → Mark of Nurgle) still costs
    // points even when the player never explicitly picked it on this unit (item.mark stays
    // null) — mirrors resolver.ts's effectiveMark, which already grants the forced mark's
    // keyword/abilities for free. Without this, forced-mark armies silently undercharge
    // every unit that didn't get an explicit per-unit mark selection.
    const rule = getArchetypeRule(archetype);
    const effMark = unit.locked_mark ?? (rule?.forcedMark as string | null) ?? item.mark ?? null;
    if (effMark) {
      const mg = unit.option_groups.find(isMarkGroup);
      if (mg) {
        const c = mg.choices.find(c => c.name === effMark);
        if (c) total += c.points * item.size;
      } else if (rule?.grantsMarkPurchase) {
        // Traitor Guard (IG units have no native mark group of their own) — ods-verbatim
        // "point cost per model and per Wound": Khorne/Slaanesh +1, Nurgle/Tzeentch +2,
        // vehicles flat +10 regardless of which mark.
        if (unit.is_vehicle) {
          total += 10 * item.size;
        } else {
          const wStat = unit.models[0]?.stats.W;
          const woundsPerModel = parseInt(wStat ?? '1', 10) || 1;
          const rate = (effMark === 'Nurgle' || effMark === 'Tzeentch') ? 2 : 1;
          total += rate * woundsPerModel * item.size;
        }
      }
    }
  }

  for (const [gi, ch] of Object.entries(item.optionQty ?? {})) {
    const g = unit.option_groups[Number(gi)];
    if (!g || isMarkGroup(g)) continue;
    if (g.variant_link) continue;
    for (const [ci, qty] of Object.entries(ch)) {
      if (ci === '__inline') {
        // Per-model inline upgrades ("…for +X points per model") scale with unit size; flat
        // one-off inline options (promote one Sergeant, etc.) are charged once. (per_model flag)
        if (qty && g.inline_pts) total += g.inline_pts * (g.per_model ? item.size : 1);
        continue;
      }
      const choice = g.choices[parseInt(ci)];
      // A choice with its own `variant_link` (e.g. Cryptek's "Dynasty Scion") is already fully
      // priced by `variant.points` in the `active` branch above — adding its own choice.points
      // here would double-charge it.
      if (choice?.variant_link && active) continue;
      // A choice-level `per_model` multiplies exactly like the group-level one. Both mean "this
      // one purchase covers the whole unit and is priced by headcount", which is what the Tyranid
      // Armory's own footnote says ("Point costs are paid per model") and what the author's worked
      // example gives: Infrasonic Roar at 1 point on a 30-model Gargoyle Brood is 30, bought once.
      // It is NOT a per-model adoption count - see the cap of 1 in UnitCard/validators.
      if (choice) total += choice.points * qty * (g.per_model || choice.per_model ? item.size : 1);
    }
  }

  for (const it of item.armory ?? []) total += liveArmoryPoints(it, item, unit, pointLimit);
  // army.ts already filters which units receive traits (CSM keyword check, faction check, etc.)
  // so item.traits is always the correct pre-filtered list — just sum it here.
  for (const t of item.traits ?? []) {
    if (t.perWound) {
      const wStatKey = unit.is_vehicle ? 'HP' : 'W';
      const wStat = unit.models[0]?.stats[wStatKey];
      const woundsPerModel = parseInt(wStat ?? '1', 10) || 1;
      total += t.points * woundsPerModel * item.size;
    } else {
      total += t.points;
    }
  }

  total += computeVehicleCombiSurcharge(item, unit, archetype);

  // Archetype-forced mandatory ability, no opt-out (Brood Brothers' Ambush, Gue'vesa's
  // Supporting Fire — both ods-verbatim "All [creature] units must gain... for X pt/Wound [or
  // Y pt/Hull point]"). Main-faction units only — allied/injected units don't pay it.
  if (!item.factionSource) {
    const rule = getArchetypeRule(archetype);
    const fa = rule?.forcedAbility;
    if (fa && !(fa.creatureOnly && unit.is_vehicle)) {
      const wStatKey = unit.is_vehicle ? 'HP' : 'W';
      const wStat = unit.models[0]?.stats[wStatKey];
      const woundsPerModel = parseInt(wStat ?? '1', 10) || 1;
      const rate = unit.is_vehicle ? (fa.pointsPerHull ?? fa.pointsPerWound) : fa.pointsPerWound;
      total += rate * woundsPerModel * item.size;
    }
  }

  // Gue'vesa: optional per-model Lasgun/Hot-shot lasgun → Pulse rifle swap (ods-verbatim
  // "+3 points"/"+2 points" — per model swapping, not a flat unit-wide cost).
  total += (item.gueVesaLasgunSwaps ?? 0) * 3 + (item.gueVesaHotshotSwaps ?? 0) * 2;

  // Yngir: "One C'tan shard (any kind) counts as an HQ selection... It costs an additional
  // +85 points" (ods-verbatim, Necrons Army Customisation). Flat surcharge, not per-model —
  // C'tan Shards are always a single model (default_size 1).
  if (item.ctanYngirUpgrade) total += 85;
  // Deployment rule bought on this entry (Webway strike / Webway raid / Lightning strike /
  // Tellyporta): rate x Wounds-or-Hull-Points x models, exactly as the Index tab prices it.
  if (item.deploymentUpgrade) {
    const up = getDeploymentUpgrade(faction);
    if (up && unitMayTakeDeploymentUpgrade(unit, up)) {
      total += deploymentUpgradeCost(unit, item.size, up);
    }
  }

  return total;
}

export { getActiveVariant, getPromotedModel };
export type { ActiveVariant };
