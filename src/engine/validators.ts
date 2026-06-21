import type { FactionData } from '../types/data';
import type { ArmyState, RosterEntry } from '../types/army';
import { computeUnitPoints, resolveUnit } from './points';
import { ENGAGEMENTS, SLOT_ORDER, ALLIED_AOP } from './engagements';
import {
  getArchetypeRule, getEffectiveSlot, getEffectiveHqLimits, countsTroops, cleanArchetypeName,
} from './archetypes';
import { applyVariantSlotOverride } from './slotOverrides';
import { validateSpaceMarines } from './validators/index';
import { findArmoryItem, isOptionAvailable, resolveUnitProfile } from './resolver';
import { parseInvSaveFromAbilities } from './equipMods';
import { parseEquipMods, isUniqueItem } from './equipMods';
import { CSM_LEGACY_ITEM_RESTRICTIONS } from './codex_csm/legacies';
import { getAssassinAccessAlignment } from './keywords';
import {
  PLATOON_ANCHOR_UNIT, PLATOON_MEMBER_LIMITS, applyPlatoonSlotOverride, countsTowardOwnSlot,
} from './codex_imperial_guard/platoon';

export interface ValidationItem {
  type: 'error' | 'warn' | 'ok';
  text: string;
}

type Rule = ReturnType<typeof getArchetypeRule>;

function getSlotUsage(
  army: RosterEntry[],
  data: FactionData,
  slot: string,
  rule: Rule,
  alliedFaction?: string,
  countAllied?: boolean,
  engagement?: string,
  excludeFactionSources?: string[],
): number {
  return army.filter(i => {
    if (i.factionSource && excludeFactionSources?.includes(i.factionSource)) return false;
    const isAllied = !!(i.factionSource && i.factionSource === alliedFaction);
    if (countAllied !== undefined && isAllied !== countAllied) return false;
    const u = resolveUnit(i, data);
    if (u?.advisor && engagement !== 'skirmish') return false;
    const baseSlot = applyVariantSlotOverride(i, u ?? undefined, getEffectiveSlot(i.unitName, i.slot, rule));
    const effSlot = applyPlatoonSlotOverride(i, army, baseSlot);
    if (effSlot !== slot) return false;
    // IG Platoon grouping (ki-45b): a member linked to a live Platoon Command Squad is folded
    // into that PCS's single Troops slot — it doesn't cost its own.
    return countsTowardOwnSlot(i, army);
  }).length;
}

/**
 * Strict "Infantry" unit-type check for the Dedicated Transport AOP cap (Custom40k Missions:
 * "ᵀ A dedicated transport vehicle may be chosen for each 'Infantry' type selection"). Per the
 * 2026-06-08 designer clarification, Infantry-ACTING subtypes (Bike, Jump Pack Infantry,
 * Character Model, Jet Bike, Monstrous Infantry, etc.) count as Infantry for other rules but
 * NOT for this one — only an effective unit_type of exactly "Infantry" (no added types via
 * `adds_unit_types`, no replacement via `set_unit_type`) counts.
 */
function isStrictInfantrySelection(item: RosterEntry, data: FactionData, state: ArmyState): boolean {
  const u = resolveUnit(item, data);
  if (!u) return false;
  const rp = resolveUnitProfile(item, u, state, data);
  if (rp.optionAddedUnitTypes.length > 0) return false;
  return (rp.optionSetUnitType ?? u.unit_type).trim() === 'Infantry';
}

/**
 * Count of strict-"Infantry" selections, which derives the dynamic Dedicated Transport AOP cap
 * (see isStrictInfantrySelection). `countAllied` scopes the count to the allied detachment's
 * own selections (its mini-AOP is fully self-contained) vs. the main army (excluding allied
 * units) — mirrors getSlotUsage's countAllied parameter.
 */
function countInfantrySelections(state: ArmyState, data: FactionData, countAllied: boolean): number {
  return state.army.filter(i => {
    const isAllied = !!(i.factionSource && i.factionSource === state.alliedFaction);
    if (isAllied !== countAllied) return false;
    return isStrictInfantrySelection(i, data, state);
  }).length;
}

function getAopRequirement(army: RosterEntry[], data: FactionData, engKey: string, rule: Rule, alliedFaction?: string): number {
  const eng = ENGAGEMENTS[engKey];
  if (!eng.multiAop) return 1;
  let aops = 1;
  for (const slot of SLOT_ORDER) {
    if (slot === 'HQ') continue;
    const [, max] = eng.aop[slot];
    if (max <= 0) continue;
    // Exclude allied units from main AOP calculation
    const used = getSlotUsage(army, data, slot, rule, alliedFaction, false, engKey);
    if (used > max) aops = Math.max(aops, Math.ceil(used / max));
  }
  return aops;
}

function allowedMarks(state: ArmyState, data: FactionData): string[] {
  // Try exact key first, then prefix-match for compound keys like "Undivided / Without"
  if (data.animosity[state.hqMark]) return data.animosity[state.hqMark];
  const match = Object.entries(data.animosity).find(([k]) => k.startsWith(state.hqMark));
  return match ? match[1] : [];
}

/**
 * CD-only: compute HQ and FA slots freed by the three special rules.
 *   Entourage  — per-god: each Greater Daemon grants up to 2 free HQ slots to heralds of the same god.
 *   Herald     — remaining heralds pair up, every 2 sharing 1 HQ slot (save = floor(n/2)).
 *   Bound Beast— each HQ unit with Mark of Khorne frees 1 Slaughterbrute from the FA slot count.
 *
 * Subtract .hq / .fa from getSlotUsage() before comparing to limits.
 * .notes can be surfaced as 'ok' validation messages.
 */
export function computeCdFreeSlots(
  army: RosterEntry[],
  data: FactionData,
  rule: Rule,
): { hq: number; fa: number; notes: string[] } {
  if (data.faction !== 'Chaos Daemons') return { hq: 0, fa: 0, notes: [] };

  const greaterDaemonsByGod: Record<string, number> = {};
  const heraldsByGod: Record<string, number> = {};
  let khorneHqCount = 0;
  let slaughterbruteCount = 0;

  for (const item of army) {
    if (item.factionSource) continue;
    const u = resolveUnit(item, data);
    if (!u) continue;
    const abilities = u.abilities ?? [];

    // Greater Daemon: contributes Entourage quota for its god
    if (abilities.some(a => /\bgreater daemon\b/i.test(a)) && u.locked_mark) {
      greaterDaemonsByGod[u.locked_mark] = (greaterDaemonsByGod[u.locked_mark] ?? 0) + 1;
    }
    // Herald: heralds that can be freed by Entourage or paired by Herald rule
    if (abilities.some(a => /^herald:/i.test(a)) && u.locked_mark) {
      heraldsByGod[u.locked_mark] = (heraldsByGod[u.locked_mark] ?? 0) + 1;
    }
    // Khorne HQ count — for Bound Beast
    const effSlot = applyVariantSlotOverride(item, u, getEffectiveSlot(item.unitName, item.slot, rule));
    if (effSlot === 'HQ') {
      const mark = u.locked_mark ?? item.mark;
      if (mark === 'Khorne') khorneHqCount++;
    }
    // Bound Beast bearers (Slaughterbrutes)
    if (abilities.some(a => /\bbound beast\b/i.test(a))) slaughterbruteCount++;
  }

  const notes: string[] = [];

  // ── Entourage: per-god, each Greater Daemon frees up to 2 heralds of that god ───
  let entourageFree = 0;
  const remainingHeraldsByGod: Record<string, number> = { ...heraldsByGod };
  for (const [god, gdCount] of Object.entries(greaterDaemonsByGod)) {
    const heraldsOfGod = remainingHeraldsByGod[god] ?? 0;
    if (heraldsOfGod === 0) continue;
    const freed = Math.min(heraldsOfGod, gdCount * 2);
    entourageFree += freed;
    remainingHeraldsByGod[god] = heraldsOfGod - freed;
    notes.push(`Entourage (${god}): ${freed} herald(s) occupy no HQ slot.`);
  }

  // ── Herald: remaining heralds pair up, every 2 sharing 1 HQ slot ─────────────
  const totalRemaining = Object.values(remainingHeraldsByGod).reduce((s, n) => s + n, 0);
  const heraldSaving = Math.floor(totalRemaining / 2);
  if (heraldSaving > 0) {
    notes.push(
      `Herald: ${totalRemaining} remaining herald(s) share ${Math.ceil(totalRemaining / 2)} HQ slot(s) (${heraldSaving} free).`,
    );
  }

  // ── Bound Beast: each Khorne HQ frees 1 Slaughterbrute from the FA slot ────────
  const faFree = Math.min(slaughterbruteCount, khorneHqCount);
  if (faFree > 0) {
    notes.push(`Bound Beast: ${faFree} Slaughterbrute(s) occupy no Fast Attack slot.`);
  }

  return { hq: entourageFree + heraldSaving, fa: faFree, notes };
}

/** Unit names of the 4 Assassins (data/parsed/assassins/units.json — Callidus/Culexus/
 *  Eversor/Vindicare, all Elites). Shared by the slot-collapse + composition validator. */
const ASSASSIN_NAMES = ['Callidus', 'Culexus', 'Eversor', 'Vindicare'];

/**
 * The Assassins' OWN canonical "Special rules" (verbatim, data/source/Assassins ENG/
 * Index.html — see keywords.ts `getAssassinAccessAlignment` for full grounding/citation):
 *   "Cults Abominatioe: Any Chaos army may select either a single Assassin or one of each
 *    for a single Elite slot."
 *   "Execution Force: Any Imperial army may select either a single Assassin or one of each
 *    for a single Elite slot."
 * This is a UNIVERSAL grant — ANY Chaos or Imperial army (not just GK/Sororitas; that was
 * a narrower, separate "access to assassins" clause from Demon Hunters/Witch hunters). The
 * army fields EITHER exactly one Assassin (any one of the 4 types) OR one of each (all 4,
 * one copy each) — and whichever combination is taken occupies a SINGLE Elite slot, not N.
 * This collapses N picks → 1 slot (mirrors computeCdFreeSlots' pattern); the legality of
 * the *composition* itself (1 vs one-of-each, no other combo) is enforced by a dedicated
 * validator. Both gate on `getAssassinAccessAlignment` and count only `factionSource ===
 * 'assassins'` entries — the units are injected (own-army, no [Allied] badge) into Elites
 * for any qualifying faction via the generic `data.allied['assassins']` catalog (see
 * SlotPanel.tsx), NOT copied natively per-faction (avoids ~9-faction data duplication).
 */
export function computeAssassinFreeSlots(
  army: RosterEntry[],
  data: FactionData,
): { elites: number; notes: string[] } {
  if (!getAssassinAccessAlignment(data.faction)) {
    return { elites: 0, notes: [] };
  }
  let total = 0;
  for (const item of army) {
    if (item.factionSource !== 'assassins') continue;
    if (ASSASSIN_NAMES.includes(item.unitName)) total++;
  }
  if (total === 0) return { elites: 0, notes: [] };
  return {
    elites: total - 1,
    notes: [`"Cults Abominatioe"/"Execution Force": Assassin selection (${total} unit${total === 1 ? '' : 's'}) occupies a single Elite slot.`],
  };
}

/**
 * Eldar Warlocks: "For every 500 points of game size, a single Warlock may be included in
 * the army that does not take up an Elite slot." (Warlocks.ods) — a composition rule, not a
 * wargear purchase: the option itself costs 0 (see warlocks.ts's inline_pts), and how many
 * Warlock entries can claim the exemption is capped by the army's configured game size
 * (`state.pointLimit`), not by anything purchasable. Mirrors computeAssassinFreeSlots' pattern
 * (collapse N flagged entries → a slot credit), but the credit is additionally capped at
 * floor(pointLimit / 500) rather than unconditional.
 */
export function computeEldarWarlockFreeSlots(
  army: RosterEntry[],
  data: FactionData,
  pointLimit: number,
): { elites: number; notes: string[] } {
  if (data.faction !== 'Eldar') return { elites: 0, notes: [] };
  let flagged = 0;
  for (const item of army) {
    const u = resolveUnit(item, data);
    if (!u || u.name !== 'Warlocks') continue;
    const gi = u.option_groups.findIndex(g => /does not take up an Elite slot/i.test(g.header));
    if (gi < 0) continue;
    if (item.optionQty?.[gi]?.['__inline']) flagged++;
  }
  if (flagged === 0) return { elites: 0, notes: [] };
  const cap = Math.floor(pointLimit / 500);
  const credited = Math.min(flagged, cap);
  const notes = [`Warlocks: ${credited} of ${flagged} "no Elite slot" pick${flagged === 1 ? '' : 's'} credited (1 per 500pts of game size, ${pointLimit}pts → max ${cap}).`];
  if (flagged > cap) {
    notes.push(`Warlocks: ${flagged - cap} extra "no Elite slot" pick${flagged - cap === 1 ? '' : 's'} exceed the game-size cap and still occupy a normal Elite slot.`);
  }
  return { elites: credited, notes };
}

/**
 * Adeptus Sororitas Geminae Superia: "For every Living Saint, the army may include one Geminae
 * Superia unit that does not take up an HQ slot." (Geminae Superia.ods OPTIONS line) — a ratio
 * against a DIFFERENT named unit's count, not the purchasing unit's own model count (so `per_n`
 * doesn't fit) and not unconditional (so the `advisor` flag doesn't fit either). Mirrors
 * computeAssassinFreeSlots/computeEldarWarlockFreeSlots' "collapse N flagged entries → a slot
 * credit" shape, capped by how many Living Saints are actually in the army.
 */
export function computeGeminaeSuperiaFreeSlots(
  army: RosterEntry[],
  data: FactionData,
): { hq: number; notes: string[] } {
  if (data.faction !== 'Adeptus Sororitas') return { hq: 0, notes: [] };
  const geminaeCount = army.filter(i => i.unitName === 'Geminae Superia').length;
  const livingSaintCount = army.filter(i => i.unitName === 'Living Saint').length;
  if (geminaeCount === 0 || livingSaintCount === 0) return { hq: 0, notes: [] };
  const credited = Math.min(geminaeCount, livingSaintCount);
  const notes = [`Geminae Superia: ${credited} of ${geminaeCount} unit${geminaeCount === 1 ? '' : 's'} exempted from the HQ slot (1 per Living Saint, have ${livingSaintCount}).`];
  if (geminaeCount > livingSaintCount) {
    notes.push(`Geminae Superia: ${geminaeCount - livingSaintCount} extra unit${geminaeCount - livingSaintCount === 1 ? '' : 's'} exceed the Living Saint ratio and still occupy a normal HQ slot.`);
  }
  return { hq: credited, notes };
}

/**
 * Adeptus Sororitas Crusaders: "Concession: One unit of Crusaders can be selected for each
 * Preacher that does not occupy an Elite slot." (Crusaders.ods ability text — not even an
 * inert placeholder option_group, just descriptive ability text with zero enforcement
 * anywhere). Same ratio-against-a-sibling-unit shape as computeGeminaeSuperiaFreeSlots, found
 * during that same audit pass.
 */
export function computeCrusadersFreeSlots(
  army: RosterEntry[],
  data: FactionData,
): { elites: number; notes: string[] } {
  if (data.faction !== 'Adeptus Sororitas') return { elites: 0, notes: [] };
  const crusadersCount = army.filter(i => i.unitName === 'Crusaders').length;
  const preacherCount = army.filter(i => i.unitName === 'Preacher').length;
  if (crusadersCount === 0 || preacherCount === 0) return { elites: 0, notes: [] };
  const credited = Math.min(crusadersCount, preacherCount);
  const notes = [`Crusaders: ${credited} of ${crusadersCount} unit${crusadersCount === 1 ? '' : 's'} exempted from the Elite slot (1 per Preacher, have ${preacherCount}).`];
  if (crusadersCount > preacherCount) {
    notes.push(`Crusaders: ${crusadersCount - preacherCount} extra unit${crusadersCount - preacherCount === 1 ? '' : 's'} exceed the Preacher ratio and still occupy a normal Elite slot.`);
  }
  return { elites: credited, notes };
}

/** All 4 datasheets independently say "An army can contain only one C'tan Shard" (ods-verbatim,
 * Necrons "OPTIONS" row) — confirmed army-wide (not per-name) by Yngir's own wording "One C'tan
 * shard (any kind) counts as an HQ selection." Each datasheet's own option_group is a
 * non-functional placeholder (empty choices, no inline_pts) so this is enforced here instead. */
export const CTAN_SHARD_NAMES = [
  "C'tan Shard",
  "C'tan Shard of the Dragon",
  "C'tan Shard of the Deceiver",
  "C'tan Shard of the Nightbringer",
];

/** Returns a disabled-tooltip reason when adding `unitName` would put a 2nd C'tan Shard (any of
 * the 4 names) in the army, or null when the unit is selectable. Catalog/add-time check, mirrors
 * lowMoveEmbarkBlockReason's "grey it out, don't just note it" pattern. */
export function ctanShardCapBlockReason(unitName: string, faction: string, army: RosterEntry[]): string | null {
  if (faction !== 'Necrons' || !CTAN_SHARD_NAMES.includes(unitName)) return null;
  const existing = army.filter(e => CTAN_SHARD_NAMES.includes(e.unitName)).length;
  if (existing === 0) return null;
  return `An army can contain only one C'tan Shard (any kind) — this army already has one.`;
}

export function validateArmy(state: ArmyState, data: FactionData): ValidationItem[] {
  const eng = ENGAGEMENTS[state.engagement];
  const rule = getArchetypeRule(state.archetype);
  const items: ValidationItem[] = [];

  const total = state.army.reduce((s, i) => {
    const u = resolveUnit(i, data);
    return s + (u ? computeUnitPoints(i, u, state.archetype) : 0);
  }, 0);

  // Point range warnings
  if (state.engagement === 'skirmish') {
    if (total < 1000) items.push({ type: 'warn', text: `Skirmish recommended 1000–1500 pts (current: ${total}).` });
    if (total > 1500) items.push({ type: 'warn', text: `Skirmish cap 1500 pts (current: ${total}).` });
  } else if (state.engagement === 'pitched') {
    if (total < 2500) items.push({ type: 'warn', text: `Pitched Battle recommended 2500–3500 pts (current: ${total}).` });
    if (total > 3500) items.push({ type: 'warn', text: `Pitched Battle cap 3500 pts (current: ${total}).` });
  } else {
    if (total < 4000) items.push({ type: 'warn', text: `Epic Battle recommended 4000+ pts (current: ${total}).` });
  }

  // Hard point limit
  if (total > state.pointLimit) {
    items.push({ type: 'error', text: `Over points limit (${total}/${state.pointLimit}).` });
  } else if (state.army.length > 0) {
    items.push({ type: 'ok', text: `Within limit (${total}/${state.pointLimit}).` });
  }

  // ── Required option group validation ─────────────────────────────────────
  for (const item of state.army) {
    const u = resolveUnit(item, data);
    if (!u) continue;
    for (const [gi, g] of u.option_groups.entries()) {
      if (!g.constraint.required) continue;
      const hasSelection = g.choices.some((_, ci) => (item.optionQty?.[gi]?.[ci] ?? 0) > 0);
      if (!hasSelection) {
        items.push({
          type: 'error',
          text: `${u.name}: "${g.header}" — a selection is required.`,
        });
      }
    }
  }

  // ── Single-slot armour (one armour per model) ────────────────────────────
  // A model wears at most one armour (Terminator / Cataphractii / …). Selecting two does not
  // stack — it is an invalid build. See _engine.md §10 (single-slot primitive).
  for (const item of state.army) {
    const armours = item.armory
      .map(a => findArmoryItem(data, a)?.armourKeyword)
      .filter((k): k is string => !!k);
    if (armours.length > 1) {
      const u = resolveUnit(item, data);
      items.push({
        type: 'error',
        text: `${u?.name ?? item.unitName}: only one armour per model (${armours.join(', ')}).`,
      });
    }
  }

  // ── Character joining (only one per unit, unless "Command Squad") ────────
  // Core Rules glossary, "Command Squad": "Models with this ability can join a squad, or
  // attach to a single character on its own" — the GENERAL rule remains the inverse: only
  // one character may be attached to a unit at a time, and any additional character
  // joining the same unit needs this ability.
  {
    const joinTargets = new Map<string, RosterEntry[]>();
    for (const item of state.army) {
      if (!item.joinedToUnit) continue;
      const list = joinTargets.get(item.joinedToUnit) ?? [];
      list.push(item);
      joinTargets.set(item.joinedToUnit, list);
    }
    for (const [targetId, joiners] of joinTargets) {
      if (joiners.length < 2) continue;
      const target = state.army.find(e => e.id === targetId);
      const targetName = target ? (resolveUnit(target, data)?.name ?? target.unitName) : '?';
      const withoutCommandSquad = joiners.filter(j => {
        const u = resolveUnit(j, data);
        const hasAbility = !!u?.abilities?.some(a => /Command Squad/i.test(a));
        const grantedByArchetype = !!rule?.grantsCommandSquad?.includes(j.unitName);
        return !hasAbility && !grantedByArchetype;
      });
      if (withoutCommandSquad.length > 1) {
        const names = joiners.map(j => j.customName || j.unitName).join(', ');
        items.push({
          type: 'error',
          text: `${targetName}: only one character may be attached to a unit at a time (currently joined by ${joiners.length}: ${names}) — additional characters need the "Command Squad" ability.`,
        });
      }
    }
  }

  // ── Archetype validation ──────────────────────────────────────────────────
  if (rule) {
    // Banned units
    for (const item of state.army) {
      if (rule.bannedUnits.includes(item.unitName)) {
        items.push({
          type: 'error',
          text: `Archetype "${cleanArchetypeName(state.archetype)}": ${item.unitName} is not allowed.`,
        });
      }
    }

    // Whitelist — only specific units allowed (e.g. Krumpa Kompany, Tempestus Scions)
    if (rule.allowedUnitsOnly.length > 0) {
      for (const item of state.army) {
        if (!item.factionSource && !rule.allowedUnitsOnly.includes(item.unitName)) {
          items.push({
            type: 'error',
            text: `Archetype "${cleanArchetypeName(state.archetype)}": ${item.unitName} is not in the allowed unit list.`,
          });
        }
      }
    }

    // Banned slots (e.g. War Hawks: no Heavy Support)
    if (rule.bannedSlots.length > 0) {
      for (const item of state.army) {
        if (!item.factionSource && rule.bannedSlots.includes(item.slot)) {
          items.push({
            type: 'error',
            text: `Archetype "${cleanArchetypeName(state.archetype)}": ${item.slot} units are not allowed (${item.unitName}).`,
          });
        }
      }
    }

    // Required HQ unit type (e.g. LIIVI needs a Farseer, The First Curse needs a Patriarch)
    if (rule.requiresHqUnit) {
      const hasRequiredHq = state.army.some(item => {
        const effSlot = getEffectiveSlot(item.unitName, item.slot, rule);
        return effSlot === 'HQ' && item.unitName.toLowerCase().includes(rule!.requiresHqUnit!.toLowerCase());
      });
      if (!hasRequiredHq) {
        items.push({
          type: 'error',
          text: `Archetype "${cleanArchetypeName(state.archetype)}": requires at least 1 ${rule.requiresHqUnit} as HQ.`,
        });
      }
    }

    // Units banned because they have no vet abilities (Legionnaire Warband)
    if (rule.requireVetAbilities) {
      for (const item of state.army) {
        const u = resolveUnit(item, data);
        if (u && !u.has_veteran_abilities) {
          items.push({
            type: 'error',
            text: `Legionnaire Warband: ${item.unitName} has no veteran abilities and cannot be included.`,
          });
        }
      }
    }

    // Forced mark: validate all units have the correct mark
    if (rule.forcedMark) {
      for (const item of state.army) {
        const u = resolveUnit(item, data);
        if (!u) continue;
        const lockedMark = u.locked_mark;
        if (lockedMark && lockedMark !== rule.forcedMark) {
          items.push({
            type: 'error',
            text: `Archetype "${cleanArchetypeName(state.archetype)}": ${item.unitName} has a locked mark (${lockedMark}) incompatible with ${rule.forcedMark}.`,
          });
        }
      }
    }

    // HQ unit restrictions (Sorcerer Circle)
    if (rule.hqAllowed.length > 0) {
      for (const item of state.army) {
        const effSlot = getEffectiveSlot(item.unitName, item.slot, rule);
        if (effSlot === 'HQ') {
          const allowed = rule.hqAllowed.some(name =>
            item.unitName.toLowerCase().includes(name.toLowerCase()),
          );
          if (!allowed) {
            items.push({
              type: 'error',
              text: `Archetype "${cleanArchetypeName(state.archetype)}": ${item.unitName} cannot be HQ (only ${rule.hqAllowed.join(', ')}).`,
            });
          }
        }
      }
    }

    // Abaddon's Chosen: each HQ must have a different mark
    if (state.archetype === "Abaddon's Chosen") {
      const hqMarks: string[] = [];
      for (const item of state.army) {
        const effSlot = getEffectiveSlot(item.unitName, item.slot, rule);
        if (effSlot !== 'HQ') continue;
        const u = resolveUnit(item, data);
        const m = u?.locked_mark ?? item.mark ?? '';
        if (!m) {
          items.push({ type: 'warn', text: `Abaddon's Chosen: ${item.unitName} needs a Chaos Mark.` });
        } else if (hqMarks.includes(m)) {
          items.push({ type: 'error', text: `Abaddon's Chosen: Mark ${m} repeated (each HQ needs a different mark).` });
        } else {
          hqMarks.push(m);
        }
      }
    }

    // Special Operations: Cultists need 2 vet abilities including Infiltrator
    // Veteran abilities are armory items with category='veteran', NOT item.traits (army traits)
    if (state.archetype === 'Special Operations') {
      for (const item of state.army) {
        if (item.unitName === 'Cultists') {
          const vetItems = item.armory.filter(a => {
            const found = data.armory_general.equipment.find(e => e.name === a.itemName);
            return found?.category === 'veteran';
          });
          if (vetItems.length < 2) {
            items.push({ type: 'error', text: `Special Operations: Cultists need 2 veteran abilities (have ${vetItems.length}).` });
          } else if (!vetItems.some(a => a.itemName.toLowerCase().includes('infiltrator'))) {
            items.push({ type: 'error', text: 'Special Operations: Cultists must include the "Infiltrator" ability.' });
          }
        }
      }
    }

    // Legionnaire Warband: every eligible unit must have at least 1 veteran ability selected.
    // Marks of Chaos do not count (rule 4). Vet abilities live in item.armory with category='veteran'.
    if (state.archetype === 'Legionnaire Warband') {
      for (const item of state.army) {
        const u = resolveUnit(item, data);
        if (!u?.has_veteran_abilities) continue; // already caught by requireVetAbilities above
        const vetCount = item.armory.filter(a => {
          const found = data.armory_general.equipment.find(e => e.name === a.itemName);
          return found?.category === 'veteran';
        }).length;
        if (vetCount < 1) {
          items.push({ type: 'warn', text: `Legionnaire Warband: ${item.unitName} must have at least 1 veteran ability (Marks of Chaos do not count).` });
        }
      }
    }

    // Mechanised Company: only 1 Heavy Support unit allowed
    if (state.archetype === 'Mechanised Company') {
      const hsCount = state.army.filter(item =>
        !item.factionSource && getEffectiveSlot(item.unitName, item.slot, rule) === 'Heavy Support',
      ).length;
      if (hsCount > 1) {
        items.push({ type: 'error', text: `Mechanised Company: only 1 Heavy Support unit allowed (have ${hsCount}).` });
      }
    }

    // Whiteshields: "only one other Troop selection per Conscript Infantry Platoon" (rules-owner
    // clarification 2026-06-22: 1 OTHER Troops slot PER CIP, not a single flat +1 — 2 CIPs allow
    // 2 other Troops selections; the CIP itself doesn't count toward that "other" total).
    if (state.archetype === 'Whiteshields') {
      const cipCount = state.army.filter(i => !i.factionSource && i.unitName === 'Conscript Infantry Platoon').length;
      const otherTroopsCount = state.army.filter(i =>
        !i.factionSource &&
        i.unitName !== 'Conscript Infantry Platoon' &&
        getEffectiveSlot(i.unitName, i.slot, rule) === 'Troops' &&
        countsTowardOwnSlot(i, state.army)
      ).length;
      if (otherTroopsCount > cipCount) {
        items.push({
          type: 'error',
          text: `Whiteshields: only 1 other Troop selection per Conscript Infantry Platoon (have ${otherTroopsCount} other Troops, ${cipCount} Conscript Infantry Platoon).`,
        });
      }
    }

    // No legacy/traits when archetype forbids them
    if (rule.noLegacy && (state.legacy || state.legacy2)) {
      items.push({ type: 'error', text: `Archetype "${cleanArchetypeName(state.archetype)}": no Legacy is allowed.` });
    }
    if (rule.noTraits && state.traitPool.length > 0) {
      items.push({ type: 'error', text: `Archetype "${cleanArchetypeName(state.archetype)}": no Traits are allowed.` });
    }

    // Daemonkin: all units must share the same Chaos Mark
    if (state.archetype === 'Daemonkin') {
      const marks = new Set<string>();
      for (const item of state.army) {
        const u = resolveUnit(item, data);
        const m = u?.locked_mark ?? item.mark;
        if (m) marks.add(m);
      }
      if (marks.size > 1) {
        items.push({
          type: 'error',
          text: `Daemonkin: all units must share the same Chaos Mark (found: ${[...marks].join(', ')}).`,
        });
      }
      // At least 1 HQ from each codex (CSM and allied Daemons)
      const hasMainHq = state.army.some(i =>
        !i.factionSource && getEffectiveSlot(i.unitName, i.slot, rule) === 'HQ',
      );
      const hasAlliedHq = state.army.some(i =>
        !!i.factionSource && getEffectiveSlot(i.unitName, i.slot, rule) === 'HQ',
      );
      if (state.army.length > 0 && !(hasMainHq && hasAlliedHq)) {
        items.push({
          type: 'warn',
          text: 'Daemonkin: requires at least 1 HQ from each Codex (CSM and Daemons).',
        });
      }
      // Codex balance: no more than +1 unit from one codex over the other
      const mainCount = state.army.filter(i => !i.factionSource).length;
      const alliedCount = state.army.filter(i => !!i.factionSource).length;
      if (Math.abs(mainCount - alliedCount) > 1) {
        const more = mainCount > alliedCount ? 'CSM' : 'Daemons';
        const less = mainCount > alliedCount ? 'Daemons' : 'CSM';
        items.push({
          type: 'error',
          text: `Daemonkin: ${more} has ${Math.abs(mainCount - alliedCount) - 1} more unit(s) than ${less} — max difference is 1.`,
        });
      }
    }
  }

  // Chosen: limited to 1 unit per HQ selection ("For every HQ selection, 1 Chosen unit allowed")
  const chosenCount = state.army.filter(i => !i.factionSource && i.unitName === 'Chosen').length;
  if (chosenCount > 0) {
    const hqCount = state.army.filter(i =>
      !i.factionSource && getEffectiveSlot(i.unitName, i.slot, rule) === 'HQ',
    ).length;
    if (chosenCount > hqCount) {
      items.push({
        type: 'error',
        text: `Chosen: you may include ${hqCount} Chosen unit(s) — one per HQ selection (have ${chosenCount}).`,
      });
    }
  }

  // Poxwalkers: Slaves of Darkness — cannot outnumber Plague Marine units
  if (data.faction === 'Chaos Space Marines') {
    const poxCount = state.army.filter(i => !i.factionSource && i.unitName === 'Poxwalkers').length;
    if (poxCount > 0) {
      const plagueCount = state.army.filter(i => !i.factionSource && i.unitName === 'Plague Marines').length;
      if (poxCount > plagueCount) {
        items.push({
          type: 'error',
          text: `Slaves of Darkness: Poxwalkers units (${poxCount}) cannot exceed Plague Marine units (${plagueCount}).`,
        });
      }
    }
  }

  // Iron Within, Iron Without: only for creature models without an existing invulnerability save
  const ironWithinActive = state.traitPool.includes('Iron Within, Iron Without');
  if (ironWithinActive) {
    // Armory items that grant an invulnerability save
    const INV_SAVE_ARMORY_ITEMS = new Set(['Bionics', 'Daemonic aura', 'Daemonic possession', 'Cataphractii armor', 'Terminator armor']);
    for (const item of state.army) {
      const u = resolveUnit(item, data);
      if (!u || u.is_vehicle) continue; // vehicles use the Iron Repair effect, not inv save
      // Check datasheet abilities for inv save — uses parseInvSaveFromAbilities for consistency
      // with the InvSv stat display (same source of truth).
      const hasInvFromDatasheet = parseInvSaveFromAbilities(u.abilities ?? []) !== null;
      // Check armory selections for inv-save items
      const hasInvFromArmory = item.armory.some(a => INV_SAVE_ARMORY_ITEMS.has(a.itemName));
      if (hasInvFromDatasheet || hasInvFromArmory) {
        items.push({
          type: 'warn',
          text: `Iron Within, Iron Without: ${item.unitName} already has an invulnerability save and cannot benefit from this trait (rule: only for models without an existing inv save).`,
        });
      }
    }
  }

  // Choice mark restrictions — "(X only)" in choice names (e.g. "Plague spewer (Nurgle only)")
  for (const item of state.army) {
    const u = resolveUnit(item, data);
    if (!u) continue;
    const mark = u.locked_mark ?? (rule?.forcedMark ?? null) ?? item.mark;
    u.option_groups.forEach((g, gi) => {
      g.choices.forEach((c, ci) => {
        if ((item.optionQty?.[gi]?.[ci] ?? 0) === 0) return;
        const restriction = c.name.match(/\((\w+)\s+only\)/i)?.[1];
        if (!restriction) return;
        if (restriction.toLowerCase() !== (mark ?? '').toLowerCase()) {
          items.push({
            type: 'error',
            text: `${item.unitName}: "${c.name}" requires Mark of ${restriction} (current: ${mark ?? 'none'}).`,
          });
        }
      });
    });
  }

  // Keyword-gated option groups (available_if): a selected option whose condition fails is invalid.
  for (const item of state.army) {
    const u = resolveUnit(item, data);
    if (!u) continue;
    // Use the same priority as the resolver: locked mark > archetype forcedMark > chosen mark
    const mark = u.locked_mark ?? (rule?.forcedMark ?? null) ?? item.mark;
    u.option_groups.forEach((g, gi) => {
      if (!g.available_if) return;
      const selected = Object.entries(item.optionQty?.[gi] ?? {}).some(([, v]) => (v ?? 0) > 0);
      if (selected && !isOptionAvailable(g.available_if, mark, u.keywords, data.faction, state.archetype)) {
        const reason = g.available_if.scope === 'unit'
          ? `not available with Mark of ${g.available_if.keyword}`
          : g.available_if.scope === 'archetype'
            ? `requires the "${g.available_if.keyword}" archetype`
            : `only available in a ${g.available_if.keyword} army`;
        items.push({
          type: 'error',
          text: `${item.unitName}: "${g.header}" is ${reason} — deselect one.`,
        });
      }
    });
  }

  // Black Crusade trait: one chosen HQ carries all four Chaos god marks simultaneously
  const blackCrusadeActive = state.traitPool.includes('Black Crusade');
  if (blackCrusadeActive) {
    const bcChampions = state.army.filter(item => {
      if (item.factionSource) return false;
      const effSlot = getEffectiveSlot(item.unitName, item.slot, rule);
      return effSlot === 'HQ' && item.blackCrusadeHQ;
    });

    if (bcChampions.length === 0) {
      items.push({
        type: 'warn',
        text: 'Black Crusade: designate one HQ as the champion — open its unit card and toggle "Black Crusade Champion" to grant it all four Chaos god marks.',
      });
    } else if (bcChampions.length > 1) {
      items.push({
        type: 'error',
        text: `Black Crusade: only 1 HQ may be the champion (currently ${bcChampions.length} are designated).`,
      });
    } else {
      const champion = bcChampions[0];
      const u = resolveUnit(champion, data);
      if (u?.locked_mark) {
        items.push({
          type: 'error',
          text: `Black Crusade: ${champion.unitName} has a locked mark and cannot carry all four god marks — choose a different HQ.`,
        });
      } else {
        items.push({
          type: 'ok',
          text: `Black Crusade: ${champion.unitName} is the champion, bearing all four Chaos god marks.`,
        });
      }
    }
  }

  // 2nd legacy requires a "enables_second_legacy" trait to be active
  if (state.legacy2 && !state.traitPool.some(n => data.traits.find(t => t.name === n)?.enables_second_legacy)) {
    items.push({ type: 'error', text: '2nd Legacy requires the second-legion trait to be active.' });
  }

  // Legacy mark restriction: Alpha Legion, Iron Warriors, Night Lords can only take Undivided or no-mark units.
  const MARK_RESTRICTED_LEGACIES = new Set(['Legacy of the Hydra', 'Legacy of the Iron Lord', 'Legacy of the Night Haunter']);
  const activeMarkRestrictedLegacy = [state.legacy, state.legacy2].find(l => l && MARK_RESTRICTED_LEGACIES.has(l));
  if (activeMarkRestrictedLegacy) {
    const FORBIDDEN_MARKS = new Set(['Khorne', 'Nurgle', 'Slaanesh', 'Tzeentch']);
    for (const item of state.army) {
      if (item.factionSource) continue;
      const u = resolveUnit(item, data);
      const mark = u?.locked_mark ?? item.mark;
      if (mark && FORBIDDEN_MARKS.has(mark)) {
        items.push({
          type: 'error',
          text: `${activeMarkRestrictedLegacy}: ${item.unitName} has the Mark of ${mark} — only Undivided or no mark is allowed with this Legacy.`,
        });
      }
    }
  }

  // Mixed Warband: each unit may only select items from ONE legacy armory
  const isMixedWarbandActive = state.traitPool.some(n =>
    data.traits.find(t => t.name === n)?.enables_second_legacy
  );
  if (isMixedWarbandActive && state.legacy2) {
    const legacyArmoryKeys = new Set(
      [state.legacy, state.legacy2]
        .filter(Boolean)
        .map(name => data.legacies.find(l => l.name === name)?.armory_key)
        .filter((k): k is string => !!k && k in data.armory_legions)
    );
    for (const entry of state.army) {
      const legionSources = new Set(
        entry.armory
          .filter(a => legacyArmoryKeys.has(a.source))
          .map(a => a.source)
      );
      if (legionSources.size > 1) {
        items.push({
          type: 'error',
          text: `Mixed Warband: ${entry.unitName} has items from multiple legacy armories. Each unit may only use one.`,
        });
      }
    }
  }

  // Legacy of the Alien Hunters: RETIRED v0.71 — the 2026-06-14 .ods redefined this Legacy to
  // be a plain armory+universal-equipment grant only ("The army has access to the Death Watch
  // Armory and each model may receive the 'Special ammunition' equipment..."), no longer
  // mentioning Inquisitors/Inquisition/Ordo Xenos at all. The old "must select Ordo Xenos"
  // validator and `grants_faction: 'inquisition'` are both removed; Inquisition access now
  // comes from the new "Chamber Militant" archetype below (see chamberMilitantOrdo() in
  // engine/keywords.ts).

  // Chamber Militant (Space Marines): "Must select 'Legacy of the Alien Hunters'."
  // SOURCE: 2026-06-14 .ods Army Customisation sheet R6.
  if (state.archetype === 'Chamber Militant' && data.faction === 'Space Marines') {
    if (![state.legacy, state.legacy2].includes('Legacy of the Alien Hunters')) {
      items.push({
        type: 'error',
        text: 'Chamber Militant: must select "Legacy of the Alien Hunters" as Legacy.',
      });
    }
  }

  // Demon Hunters (Grey Knights): RETIRED v0.71 — superseded by the "Chamber Militant"
  // archetype (2026-06-14 .ods Army Customisation sheet R5), which is opt-in and grants
  // Inquisition access "as if 'Ordo Malleus' was selected as Legacy" automatically (no
  // per-model armory pick required). See chamberMilitantOrdo() in engine/keywords.ts.

  // Witch hunters (Adepta Sororitas): RETIRED v0.71 — superseded by the "Chamber Militant"
  // archetype (2026-06-14 .ods Army Customisation sheet R5), which is opt-in and grants
  // Inquisition access "as if 'Ordo Hereticus' was selected as Legacy" automatically (no
  // per-model armory pick required). See chamberMilitantOrdo() in engine/keywords.ts.

  // Inquisition: Ordo allegiance items are mutually exclusive per model.
  // SOURCE: each Ordo item's desc — "Every model can only pick one Ordo allegiance."
  // Unlike CSM/CD Marks (a single selectedMark attribute, structurally exclusive), Ordo
  // allegiance is 3 plain unrelated armory items — nothing stops picking 2-3 at once
  // without this explicit check (ki-inquisition-ordo-exclusivity-01).
  {
    const ORDO_ITEMS = ['Ordo Hereticus', 'Ordo Malleus', 'Ordo Xenos'];
    for (const item of state.army) {
      const picked = ORDO_ITEMS.filter(name => item.armory.some(a => a.itemName === name));
      if (picked.length > 1) {
        items.push({
          type: 'error',
          text: `${item.customName || item.unitName}: can only pick one Ordo allegiance (has ${picked.join(', ')}).`,
        });
      }
    }
  }

  // Inquisition: Ordo Minoris — each Character may select at most 1 item total from the
  // combined Ordo Hereticus/Malleus/Xenos Armory.
  // SOURCE: archetypes.json Legacy "Ordo Minoris" — "Every character model in the army may
  // select a single item from either the Ordo Hereticus, Malleus or Xenos Armory."
  // (The Legacy's second clause — "...the army may include a single Ordo Hereticus, Malleus
  // or Xenos Warband" — is now MOOT: v0.66 merged the 3 per-Ordo Warbands into one
  // Ordo-agnostic "Henchman Warband" with no Ordo gating, so there is nothing left to cap;
  // see ki-inquisition-ordo-minoris-caps-unenforced-01 resolution.)
  if (data.faction === 'Inquisition' && [state.legacy, state.legacy2].includes('Ordo Minoris')) {
    const ORDO_GATED_ITEMS = new Set<string>();
    for (const section of ['weapons', 'equipment', 'daemon_weapons'] as const) {
      for (const item of data.armory_general[section] ?? []) {
        if (item.requires_army_item && ['Ordo Hereticus', 'Ordo Malleus', 'Ordo Xenos'].includes(item.requires_army_item)) {
          ORDO_GATED_ITEMS.add(item.name);
        }
      }
    }
    for (const item of state.army) {
      const u = resolveUnit(item, data);
      if (!u?.is_character) continue;
      const picked = item.armory.filter(a => ORDO_GATED_ITEMS.has(a.itemName));
      if (picked.length > 1) {
        items.push({
          type: 'error',
          text: `${item.customName || item.unitName}: Ordo Minoris allows only 1 item from the Ordo Hereticus/Malleus/Xenos Armory (has ${picked.map(a => a.itemName).join(', ')}).`,
        });
      }
    }
  }

  // Henchman Warband: dynamic specialist-model cap (6, or 12 if attached to an Inquisitor Lord).
  // SOURCE: Inquisition.ods "Henchman Warband" — "An Inquisitor may select up to 6 specialist
  // models for their Warband. An Inquisitor Lord may select up to 12 specialist models for
  // their Warband."
  {
    const hasInquisitorLord = state.army.some(item => {
      if (item.unitName !== 'Inquisitor') return false;
      const u = resolveUnit(item, data);
      if (!u) return false;
      return u.option_groups.some((g, gi) =>
        g.variant_link === 'Inquisitor Lord' && !!(item.optionQty?.[gi]?.['__inline']),
      );
    });
    const cap = hasInquisitorLord ? 12 : 6;
    for (const item of state.army) {
      if (item.unitName !== 'Henchman Warband') continue;
      if (item.size > cap) {
        items.push({
          type: 'error',
          text: `Henchman Warband: up to ${cap} specialist models${hasInquisitorLord ? ' (Inquisitor Lord)' : ''} (have ${item.size}).`,
        });
      }
    }
  }

  // Legacy armory item restrictions — "Only for X" text in armory items (grounded in each armory HTML).
  // e.g. Iron Warriors: "Only for Warpsmiths"; Word Bearers: "Only for Dark Apostles";
  //      Black Legion: "Only for models with the Mark of Khorne".
  // Applies when the relevant legacy is active (primary or secondary).
  for (const [armoryKey, restrictions] of Object.entries(CSM_LEGACY_ITEM_RESTRICTIONS)) {
    const legacyActive = [state.legacy, state.legacy2].some(leg => {
      const l = data.legacies.find(x => x.name === leg);
      return l?.armory_key === armoryKey;
    });
    if (!legacyActive) continue;
    for (const { itemName, restriction, unitFilter } of restrictions) {
      for (const entry of state.army) {
        if (!entry.armory.some(a => a.itemName === itemName && a.source === armoryKey)) continue;
        const unit = resolveUnit(entry, data);
        if (!unit) continue;
        // Mark-based restriction (Heavy bolter Black Legion)
        if (armoryKey === 'Black Legion' && itemName === 'Heavy bolter') {
          const effMark = unit.locked_mark ?? entry.mark;
          if (effMark !== 'Khorne') {
            items.push({ type: 'error', text: `${armoryKey} armory — "${itemName}": only for models with the Mark of Khorne (${entry.unitName} has Mark of ${effMark ?? 'none'}).` });
          }
          continue;
        }
        // Unit-name restriction (Only for Warpsmiths / Only for Dark Apostles)
        if (!unitFilter(entry.unitName)) {
          items.push({ type: 'error', text: `${armoryKey} armory — "${itemName}": ${restriction} (cannot be equipped on ${entry.unitName}).` });
        }
      }
    }
  }

  // Units that are inherently unique (is_unique_per_army group with no variant_link) — e.g. Greater Daemons
  const uniqueUnitCounts: Record<string, number> = {};
  for (const item of state.army) {
    const u = resolveUnit(item, data);
    if (!u) continue;
    const isUniqueUnit = u.option_groups.some(
      g => g.is_unique_per_army && !g.variant_link && g.constraint.type === 'unique_upgrade',
    );
    if (isUniqueUnit) {
      uniqueUnitCounts[item.unitName] = (uniqueUnitCounts[item.unitName] ?? 0) + 1;
    }
  }
  for (const [name, count] of Object.entries(uniqueUnitCounts)) {
    if (count > 1) {
      items.push({
        type: 'error',
        text: `${name}: only 1 allowed per army (have ${count}).`,
      });
    }
  }

  // Unique variant upgrades: only 1 per army (e.g. Chaos Lord, Master of Possession)
  const uniqueVariantCounts: Record<string, number> = {};
  for (const item of state.army) {
    const u = resolveUnit(item, data);
    if (!u) continue;
    u.option_groups.forEach((g, gi) => {
      if (!g.is_unique_per_army || !g.variant_link) return;
      if (item.optionQty?.[gi]?.['__inline']) {
        uniqueVariantCounts[g.variant_link] = (uniqueVariantCounts[g.variant_link] ?? 0) + 1;
      }
    });
  }
  for (const [variant, count] of Object.entries(uniqueVariantCounts)) {
    if (count > 1) {
      items.push({
        type: 'error',
        text: `${variant}: only 1 may be upgraded per army (have ${count}).`,
      });
    }
  }

  // Unique CHOICES per army (e.g. Necrons Cryptek: "Each specialisation is unique per army" —
  // multiple Crypteks are fine, just never two with the SAME named choice). Keyed by
  // (unitName, choice.name) so it never collides with an unrelated unit's same-named choice.
  const uniqueChoiceCounts: Record<string, number> = {};
  for (const item of state.army) {
    const u = resolveUnit(item, data);
    if (!u) continue;
    u.option_groups.forEach((g, gi) => {
      g.choices.forEach((c, ci) => {
        if (!c.unique_per_army) return;
        if (item.optionQty?.[gi]?.[ci]) {
          const key = `${item.unitName}::${c.name}`;
          uniqueChoiceCounts[key] = (uniqueChoiceCounts[key] ?? 0) + 1;
        }
      });
    });
  }
  for (const [key, count] of Object.entries(uniqueChoiceCounts)) {
    if (count > 1) {
      const [unitName, choiceName] = key.split('::');
      items.push({
        type: 'error',
        text: `${unitName}: only 1 may take "${choiceName}" per army (have ${count}).`,
      });
    }
  }

  // Yngir: "One C'tan shard (any kind)" — defense in depth alongside the UI toggle's
  // disable-the-other-instances guard (ods-verbatim, only 1 per army regardless of how many
  // C'tan Shards are fielded).
  if (state.archetype === 'Yngir') {
    const ctanYngirCount = state.army.filter(i => i.ctanYngirUpgrade && /^C'tan Shard/.test(i.unitName)).length;
    if (ctanYngirCount > 1) {
      items.push({
        type: 'error',
        text: `Yngir: only 1 C'tan Shard may take the HQ upgrade per army (have ${ctanYngirCount}).`,
      });
    }
  }

  // "An army can contain only one C'tan Shard" (any kind, ods-verbatim on all 4 datasheets) —
  // defense in depth alongside the catalogue's ctanShardCapBlockReason disable.
  if (data.faction === 'Necrons') {
    const ctanShardCount = state.army.filter(i => CTAN_SHARD_NAMES.includes(i.unitName)).length;
    if (ctanShardCount > 1) {
      items.push({
        type: 'error',
        text: `An army can contain only one C'tan Shard, any kind combined (have ${ctanShardCount}).`,
      });
    }
  }

  // CD special rules: Entourage / Herald / Bound Beast
  const cdFree = computeCdFreeSlots(state.army, data, rule);
  for (const note of cdFree.notes) {
    items.push({ type: 'ok', text: note });
  }

  // "Cults Abominatioe"/"Execution Force" — Assassin selection collapses to a single
  // Elite slot (any Chaos or Imperial army — the Assassins' OWN universal grant)
  const assassinFree = computeAssassinFreeSlots(state.army, data);
  for (const note of assassinFree.notes) {
    items.push({ type: 'ok', text: note });
  }

  // Eldar Warlocks: "1 free per 500pts of game size" Elite-slot exemption (Warlocks.ods)
  const warlockFree = computeEldarWarlockFreeSlots(state.army, data, state.pointLimit);
  for (const note of warlockFree.notes) {
    items.push({ type: 'ok', text: note });
  }

  // Sororitas Geminae Superia: "1 free HQ slot per Living Saint" (Geminae Superia.ods)
  const geminaeSuperiaFree = computeGeminaeSuperiaFreeSlots(state.army, data);
  for (const note of geminaeSuperiaFree.notes) {
    items.push({ type: 'ok', text: note });
  }

  // Sororitas Crusaders: "1 free Elite slot per Preacher" (Crusaders.ods Concession ability)
  const crusadersFree = computeCrusadersFreeSlots(state.army, data);
  for (const note of crusadersFree.notes) {
    items.push({ type: 'ok', text: note });
  }

  // "Cults Abominatioe"/"Execution Force" (Assassins' OWN canonical special rules,
  // data/source/Assassins ENG/Index.html, verbatim): the army may field EITHER a single
  // Assassin (any one of the 4 types, exactly one model) OR one of each of the 4 — no
  // other combination is legal. (The slot-collapse above only models the "counts as a
  // single Elite slot" half of the rule; this enforces the composition itself.)
  const assassinAlignment = getAssassinAccessAlignment(data.faction);
  if (assassinAlignment) {
    const assassinCounts: Record<string, number> = {};
    for (const item of state.army) {
      if (item.factionSource !== 'assassins') continue;
      if (ASSASSIN_NAMES.includes(item.unitName)) {
        assassinCounts[item.unitName] = (assassinCounts[item.unitName] ?? 0) + 1;
      }
    }
    const assassinTypes = Object.keys(assassinCounts);
    const assassinTotal = Object.values(assassinCounts).reduce((a, b) => a + b, 0);
    const isSingleAssassin = assassinTotal === 1;
    const isOneOfEach = assassinTypes.length === 4 && Object.values(assassinCounts).every(c => c === 1);
    if (assassinTotal > 0 && !isSingleAssassin && !isOneOfEach) {
      const ruleName = assassinAlignment === 'chaos' ? 'Cults Abominatioe' : 'Execution Force';
      items.push({
        type: 'error',
        text: `"${ruleName}": select either a single Assassin (Callidus/Culexus/Eversor/Vindicare) or one of each — no other combination.`,
      });
    }
  }

  // AOP slot mins (main faction only — exclude allied units)
  // Summoning (CSM, digest §4b): "Daemons can't fill mandatory AOP selections" — Chaos Daemons
  // codex units (own-army native access via cult archetypes' alliedFaction injection, not a true
  // Allied Detachment, so they aren't caught by the state.alliedFaction/countAllied exclusion
  // above) must not count toward these minimums. Daemonkin explicitly "ignores Summoning"
  // (its ≥1-HQ-from-each-codex rule requires the Daemon HQ to count), so it's exempted.
  const summoningExcl = (data.faction === 'Chaos Space Marines' && state.archetype !== 'Daemonkin')
    ? ['chaos_daemons']
    : undefined;
  const aopMult = getAopRequirement(state.army, data, state.engagement, rule, state.alliedFaction);
  for (const slot of SLOT_ORDER) {
    if (slot === 'Lords of War') continue; // Escalation: Epic-only + 33% pts cap, handled separately
    const hqLimits = getEffectiveHqLimits(rule, eng.aop.HQ);
    const min = slot === 'HQ' ? hqLimits[0] : eng.aop[slot][0];
    const rawUsed = getSlotUsage(state.army, data, slot, rule, state.alliedFaction, false, state.engagement, summoningExcl);
    const slotAdj = slot === 'HQ' ? cdFree.hq + geminaeSuperiaFree.hq
      : slot === 'Fast Attack' ? cdFree.fa
      : slot === 'Elites' ? assassinFree.elites + warlockFree.elites + crusadersFree.elites
      : 0;
    const used = Math.max(0, rawUsed - slotAdj);
    const scaledMin = eng.multiAop ? min * aopMult : min;
    if (scaledMin > 0 && used < scaledMin) {
      items.push({ type: 'error', text: `Need at least ${scaledMin} ${slot} (have ${used}).` });
    }
  }

  // Troops 25% — archetype may restrict which Troops count (main faction only)
  if (state.army.length > 0 && total > 0) {
    const baseTroopsPts = state.army
      .filter(i => {
        // Exclude allied units from the 25% Troops calculation
        if (state.alliedFaction && i.factionSource === state.alliedFaction) return false;
        const u = resolveUnit(i, data);
        if (!u) return false;
        if (getEffectiveSlot(i.unitName, i.slot, rule) !== 'Troops') return false;
        return countsTroops(i.unitName, u.locked_mark, rule);
      })
      .reduce((s, i) => {
        const u = resolveUnit(i, data);
        return s + (u ? computeUnitPoints(i, u, state.archetype) : 0);
      }, 0);
    // Mechanised Company: Dedicated Transports count at 50% toward the Troops 25%
    const transportBonus = state.archetype === 'Mechanised Company'
      ? state.army
          .filter(i => {
            if (state.alliedFaction && i.factionSource === state.alliedFaction) return false;
            return i.slot === 'Dedicated Transport';
          })
          .reduce((s, i) => {
            const u = resolveUnit(i, data);
            return s + (u ? Math.floor(computeUnitPoints(i, u, state.archetype) * 0.5) : 0);
          }, 0)
      : 0;
    const troopsPts = baseTroopsPts + transportBonus;
    const ratio = troopsPts / total;
    const label = (rule && rule.troopsCount !== 'all')
      ? `Qualifying Troops (${rule.troopsCount === 'locked' ? 'locked mark' : rule.troopsRemap.join('/')})`
      : 'Troops';
    if (ratio < eng.minTroopsRatio) {
      items.push({
        type: 'error',
        text: `${label} must be ≥25% of total (${(ratio * 100).toFixed(1)}%, need ${Math.ceil(total * eng.minTroopsRatio)} pts).`,
      });
    } else {
      items.push({ type: 'ok', text: `${label}: ${(ratio * 100).toFixed(1)}% (≥25%).` });
    }
  }

  // Skirmish stat caps
  // Grounded in missions_text.txt L17-31 (Skirmish restrictions) + core L868 (Unique = once per army).
  if (eng.statCaps) {
    // "Unique" armory items: only 1 across the whole army (missions L17; core L868).
    const uniqueArmoryCount: Record<string, number> = {};
    for (const item of state.army) {
      for (const sel of item.armory) {
        const ai = findArmoryItem(data, sel);
        if (ai && isUniqueItem(ai.desc)) {
          uniqueArmoryCount[ai.name] = (uniqueArmoryCount[ai.name] ?? 0) + 1;
        }
      }
    }
    // Only 1 unique item across the entire army (missions L17 "select one unique item from the Armory").
    const totalUnique = Object.values(uniqueArmoryCount).reduce((s, n) => s + n, 0);
    if (totalUnique > 1) {
      const names = Object.keys(uniqueArmoryCount).join(', ');
      items.push({ type: 'error', text: `Skirmish: only 1 Unique armory item allowed per army (have ${totalUnique}: ${names}).` });
    }

    for (const item of state.army) {
      const u = resolveUnit(item, data);
      if (!u) continue;
      const pts = computeUnitPoints(item, u, state.archetype);
      const effSlot = getEffectiveSlot(item.unitName, item.slot, rule);
      if (effSlot === 'HQ' && pts > 150) {
        items.push({ type: 'error', text: `Skirmish: HQ ${item.unitName} exceeds 150 pts (${pts}).` });
      }
      if (effSlot !== 'Troops' && pts > 300) {
        items.push({ type: 'error', text: `Skirmish: ${item.unitName} exceeds 300 pts (${pts}).` });
      }
      if (u.is_squadron && item.size > 1) {
        items.push({ type: 'error', text: `Skirmish: ${item.unitName} is a Squadron — maximum 1 model (have ${item.size}).` });
      }

      // Combined armour value cap (Missions.txt L82, ki-skirmish-restrictions-unenforced-01 #2):
      // "No unit may have a combined armour value of 34 or better (sum of Front + Side + Rear;
      // include Quantum Shielding for Necron vehicles)." Static datasheet check — no engine
      // mechanism modifies FRONT/SIDE/REAR (grepped: zero stat_mod entries target them, and
      // "Quantum Shielding" doesn't exist as an item/ability in any faction's data), so the
      // canonical "include Quantum Shielding" clause is a no-op here; base stats are final.
      const vStats = u.models[0]?.stats;
      if (vStats?.FRONT && vStats?.SIDE && vStats?.REAR) {
        const combined = parseInt(vStats.FRONT) + parseInt(vStats.SIDE) + parseInt(vStats.REAR);
        if (combined >= 34) {
          items.push({ type: 'error', text: `Skirmish: ${item.unitName} has a combined armour value of ${combined} (Front ${vStats.FRONT} + Side ${vStats.SIDE} + Rear ${vStats.REAR}) — max 33.` });
        }
      }

      // Equipment stat/profile caps (missions L26-31): a unit may not GAIN via equipment:
      //  - 2+ armour save or better  → Terminator armor, Daemonic armor, Master-crafted armor
      //  - 4+ invuln save or better  → Iron halo, Daemonic aura, etc.
      //  - Toughness 8 or higher (base T + equipment delta)
      //  - Weapon Damage 3 or higher on any bought weapon
      // These only fire when something was actually bought — units that START with these stats
      // aren't blocked (the rule is about what equipment GRANTS, not the datasheet profile).
      if (item.armory.length > 0) {
        const equipItems = item.armory
          .filter(a => a.section === 'equipment')
          .map(a => {
            const found = findArmoryItem(data, a);
            return { name: a.itemName, desc: found?.desc ?? '', armourKeyword: found?.armourKeyword };
          });
        const mods = parseEquipMods(equipItems, u.armourKeyword);

        // 2+ armour save gained from equipment
        if (mods.armorSave !== null && mods.armorSave <= 2) {
          const culprit = item.armory.find(a => {
            const ai = findArmoryItem(data, a);
            return ai?.desc && /2\+\s+armo/i.test(ai.desc);
          });
          items.push({ type: 'error', text: `Skirmish: ${item.unitName} gains a 2+ armour save from "${culprit?.itemName ?? 'equipment'}" — not allowed.` });
        }

        // 4+ or better invuln save gained from equipment
        if (mods.invulnSave !== null && mods.invulnSave <= 4) {
          const culprit = item.armory.find(a => {
            const ai = findArmoryItem(data, a);
            return ai?.desc && /(\d)\+\s+invulnerable/i.test(ai.desc ?? '') &&
              parseInt((ai.desc.match(/(\d)\+\s+invulnerable/i)?.[1] ?? '9')) <= 4;
          });
          items.push({ type: 'error', text: `Skirmish: ${item.unitName} gains a 4+ or better invulnerable save from "${culprit?.itemName ?? 'equipment'}" — not allowed.` });
        }

        // Toughness 8+ from equipment delta
        const baseT = parseInt(String(u.models[0]?.stats?.T ?? '0'));
        const gainedT = mods.statDeltas['T'] ?? 0;
        if (baseT > 0 && baseT + gainedT >= 8) {
          items.push({ type: 'error', text: `Skirmish: ${item.unitName} reaches T${baseT + gainedT} from equipment — max T7.` });
        }

        // Weapon Damage 3+ from any bought weapon item
        for (const sel of item.armory.filter(a => a.section === 'weapons')) {
          const ai = findArmoryItem(data, sel);
          if (!ai) continue;
          const checkD = (d: string | undefined) => d && parseInt(d) >= 3;
          if (checkD(ai.d) || (ai.profiles ?? []).some(p => checkD(p.d))) {
            items.push({ type: 'error', text: `Skirmish: ${item.unitName} equips "${sel.itemName}" with Damage 3 or higher — not allowed.` });
          }
        }
      }
    }
  }

  // Per_n and fixed_max constraint sums
  for (const item of state.army) {
    const u = resolveUnit(item, data);
    if (!u) continue;
    u.option_groups.forEach((g, gi) => {
      if (g.constraint?.type === 'per_n') {
        // Mirrors UnitCard.tsx's groupMax: per_n_pool overrides the divisor to a model-group
        // subset (e.g. Kroot Farstalkers' "every 5 non-Kroot-hound models" excludes Kroot
        // Hounds), and applies_to_model caps the numerator to whoever can actually receive it.
        const poolSize = (g.per_n_pool && item.modelSizes)
          ? g.per_n_pool.reduce((s, n) => s + (item.modelSizes![n] ?? 0), 0)
          : item.size;
        const applyNames = Array.isArray(g.applies_to_model) ? g.applies_to_model : g.applies_to_model ? [g.applies_to_model] : null;
        const modelCap = (applyNames && item.modelSizes)
          ? applyNames.reduce((s, n) => s + (item.modelSizes![n] ?? 0), 0)
          : null;
        const perNRaw = (g.constraint.count_per_n ?? 1) * Math.floor(poolSize / (g.constraint.per_n ?? 1));
        const max = modelCap !== null ? Math.min(perNRaw, modelCap) : perNRaw;
        const used = Object.entries(item.optionQty?.[gi] ?? {}).reduce((s, [k, v]) => {
          return k === '__inline' ? s : s + (v ?? 0);
        }, 0);
        if (used > max) {
          items.push({
            type: 'error',
            text: `${item.unitName}: "${g.header.substring(0, 50)}" — ${used} swaps, only ${max} allowed for squad of ${item.size}.`,
          });
        }
      }
      if (g.constraint?.type === 'fixed_max') {
        const used = Object.entries(item.optionQty?.[gi] ?? {}).reduce((s, [k, v]) => {
          return k === '__inline' ? s : s + (v ?? 0);
        }, 0);
        if (used > (g.constraint.max ?? 0)) {
          items.push({
            type: 'error',
            text: `${item.unitName}: "${g.header.substring(0, 50)}" — ${used} swaps, maximum ${g.constraint.max}.`,
          });
        }
      }
    });
  }

  // Disjoint legal size range ("1 or 4-10" — see Model.squad_min): defense in depth alongside
  // the stepper's min↔squad_min jump, for sizes that land in the illegal gap some other way
  // (e.g. an externally-edited/pasted army JSON).
  for (const item of state.army) {
    const u = resolveUnit(item, data);
    const squadMin = u && u.models.length === 1 ? u.models[0].squad_min : undefined;
    if (squadMin && item.size > u!.models[0].min && item.size < squadMin) {
      items.push({
        type: 'error',
        text: `${item.unitName}: squad size must be ${u!.models[0].min} or ${squadMin}-${u!.models[0].max} (have ${item.size}).`,
      });
    }
  }

  // Dynamic ratio cap for a secondary model group (see Model.ratio_per_n/ratio_of, e.g. CSM
  // Traitor Guard "1 Chaos Ogryn per 10 Traitor Guardsman"): defense in depth alongside the
  // stepper's dynamic max, for counts that exceed the ratio some other way (e.g. the primary
  // model group was reduced after the secondary count was already set, or a pasted army JSON).
  for (const item of state.army) {
    const u = resolveUnit(item, data);
    if (!u || !item.modelSizes) continue;
    for (const m of u.models) {
      if (!m.ratio_per_n || !m.ratio_of) continue;
      const primaryCount = item.modelSizes[m.ratio_of] ?? 0;
      const ratioMax = Math.floor(primaryCount / m.ratio_per_n);
      const have = item.modelSizes[m.name] ?? 0;
      if (have > ratioMax) {
        items.push({
          type: 'error',
          text: `${item.unitName}: ${m.name} requires ${m.ratio_per_n} ${m.ratio_of} per model (have ${have}, only ${ratioMax} allowed with ${primaryCount} ${m.ratio_of}).`,
        });
      }
    }
  }

  // Cross-group shared pool over-allocation (defense in depth alongside UnitCard's
  // groupRemaining math) — independent option groups that replace the SAME base weapon on the
  // SAME scoped model group draw from one shared pool, e.g. Traitor Guard's "every Lasgun may
  // be replaced" + "for each 10 models, one Lasgun may be replaced by a special weapon" both
  // consume Lasgun-carrying Traitor Guardsmen and together must not exceed that model count.
  for (const item of state.army) {
    const u = resolveUnit(item, data);
    if (!u) continue;
    const seen = new Set<number>();
    u.option_groups.forEach((g, gi) => {
      if (seen.has(gi) || !g.replaces?.length || !['per_n', 'every'].includes(g.constraint.type)) return;
      const applyNames = Array.isArray(g.applies_to_model) ? g.applies_to_model : g.applies_to_model ? [g.applies_to_model] : null;
      const sameScope = (other: typeof g) => {
        const otherNames = Array.isArray(other.applies_to_model) ? other.applies_to_model : other.applies_to_model ? [other.applies_to_model] : null;
        return (applyNames === null && otherNames === null) ||
          (applyNames !== null && otherNames !== null && applyNames.length === otherNames.length && applyNames.every(n => otherNames!.includes(n)));
      };
      const cluster = u.option_groups
        .map((other, oi) => ({ other, oi }))
        .filter(({ other }) => ['per_n', 'every'].includes(other.constraint.type) && other.replaces?.some(w => g.replaces!.includes(w)) && sameScope(other));
      if (cluster.length < 2) return;
      cluster.forEach(({ oi }) => seen.add(oi));
      const poolSize = (applyNames && item.modelSizes)
        ? applyNames.reduce((s, n) => s + (item.modelSizes![n] ?? 0), 0)
        : item.size;
      const used = cluster.reduce((s, { oi }) => s + Object.entries(item.optionQty?.[oi] ?? {}).reduce(
        (s2, [k, v]) => k === '__inline' ? s2 : s2 + (v ?? 0), 0
      ), 0);
      if (used > poolSize) {
        items.push({
          type: 'error',
          text: `${item.unitName}: ${used} ${g.replaces![0]} swaps selected across multiple options, but only ${poolSize} models can be swapped.`,
        });
      }
    });
  }

  // ── Lords of War (Escalation): Epic Battle only + 33% of points cap ──────────
  // missions_text.txt: only Epic has the "0+ Lords of War" slot; "A total of 33% of the
  // point limit may be spent on Lord of War units."
  {
    const lowUnits = state.army.filter(i => {
      const u = resolveUnit(i, data);
      const effSlot = applyVariantSlotOverride(i, u ?? undefined, getEffectiveSlot(i.unitName, i.slot, rule));
      return effSlot === 'Lords of War';
    });
    if (lowUnits.length > 0) {
      if (state.engagement !== 'epic') {
        items.push({
          type: 'error',
          text: `Lords of War are only allowed in Epic Battle (have ${lowUnits.length}).`,
        });
      } else {
        const lowPts = lowUnits.reduce((s, i) => {
          const u = resolveUnit(i, data);
          return s + (u ? computeUnitPoints(i, u, state.archetype) : 0);
        }, 0);
        const cap = Math.floor(total * 0.33);
        if (lowPts > cap) {
          items.push({
            type: 'error',
            text: `Lords of War exceed 33% of points (${lowPts}/${cap}).`,
          });
        } else {
          items.push({
            type: 'ok',
            text: `Lords of War: ${lowPts} pts (≤33% = ${cap}).`,
          });
        }
      }
    }
  }

  // ── Imperial Guard "Platoon" grouping ratios (ki-45b) ────────────────────────
  // Rules-owner clarification 2026-06-20: per Platoon Command Squad, 2-5 Infantry Squads,
  // 0-1 Conscript Infantry Platoon, 0-2 Special Weapon Squads, 0-3 Heavy Weapon Teams may be
  // linked — together they occupy that PCS's single Troops slot. Validate the linked counts
  // per PCS instance (unlinked members aren't part of any platoon, so they're not checked here
  // — they each cost their own normal slot per countsTowardOwnSlot()).
  {
    const pcsUnits = state.army.filter(i => i.unitName === PLATOON_ANCHOR_UNIT && !i.factionSource);
    for (const pcs of pcsUnits) {
      for (const [memberName, { min, max }] of Object.entries(PLATOON_MEMBER_LIMITS)) {
        const linkedCount = state.army.filter(i => i.unitName === memberName && i.platoonId === pcs.id).length;
        if (linkedCount < min || linkedCount > max) {
          items.push({
            type: 'error',
            text: `${pcs.unitName} (${pcs.customName ?? pcs.id.slice(0, 6)}): ${linkedCount} linked ${memberName} (allowed ${min}-${max}).`,
          });
        }
      }
    }
  }

  // AOP slot maxes (main faction only — exclude allied units)
  for (const slot of SLOT_ORDER) {
    if (slot === 'Lords of War') continue; // Escalation: handled by the dedicated block above
    const hqLimits = getEffectiveHqLimits(rule, eng.aop.HQ);
    const engMax = slot === 'HQ' ? hqLimits[1] : eng.aop[slot][1];
    const rawUsed = getSlotUsage(state.army, data, slot, rule, state.alliedFaction, false, state.engagement);
    const slotAdj = slot === 'HQ' ? cdFree.hq + geminaeSuperiaFree.hq
      : slot === 'Fast Attack' ? cdFree.fa
      : slot === 'Elites' ? assassinFree.elites + warlockFree.elites + crusadersFree.elites
      : 0;
    const used = Math.max(0, rawUsed - slotAdj);
    // Dedicated Transport's Pitched/Epic cap is dynamic ("1 per Infantry-type selection"), not
    // the flat eng.aop value (Skirmish's flat "0-1" is correct as-is and untouched).
    const effMax = (slot === 'Dedicated Transport' && (state.engagement === 'pitched' || state.engagement === 'epic'))
      ? countInfantrySelections(state, data, false)
      : (slot === 'HQ' && rule?.hqOverride)
        ? engMax
        : (eng.multiAop ? engMax * aopMult : engMax);
    if (used > effMax) {
      items.push({ type: 'error', text: `${slot} over maximum (${used}/${effMax}).` });
    }
  }
  if (eng.multiAop && aopMult > 1) {
    items.push({ type: 'ok', text: `Using ${aopMult} AOPs.` });
  }

  // Allied detachment AOP validation
  if (state.alliedFaction) {
    const alliedUnits = state.army.filter(e => e.factionSource === state.alliedFaction);
    if (alliedUnits.length > 0) {
      for (const slot of SLOT_ORDER) {
        const [min, max] = ALLIED_AOP[slot];
        const used = getSlotUsage(state.army, data, slot, rule, state.alliedFaction, true, state.engagement);
        if (min > 0 && used < min) {
          items.push({ type: 'error', text: `Allied detachment: need at least ${min} ${slot} (have ${used}).` });
        }
        if (slot === 'Dedicated Transport') {
          const alliedMax = countInfantrySelections(state, data, true);
          if (used > alliedMax) {
            items.push({ type: 'error', text: `Allied detachment: Dedicated Transport over maximum (${used}/${alliedMax}).` });
          }
        } else if (max === 0 && used > 0) {
          items.push({ type: 'error', text: `Allied detachment: ${slot} not allowed (have ${used}).` });
        } else if (max > 0 && used > max) {
          items.push({ type: 'error', text: `Allied detachment: ${slot} over maximum (${used}/${max}).` });
        }
      }
      // Elites / Fast Attack / Heavy Support limited to 1 each, but +1 per Troop unit beyond 1
      const alliedTroops = getSlotUsage(state.army, data, 'Troops', rule, state.alliedFaction, true, state.engagement);
      for (const slot of ['Elites', 'Fast Attack', 'Heavy Support'] as const) {
        const used = getSlotUsage(state.army, data, slot, rule, state.alliedFaction, true, state.engagement);
        if (used > alliedTroops) {
          items.push({ type: 'error', text: `Allied: ${slot} (${used}) exceeds Troops (${alliedTroops}) — 1 ${slot} per Troop unit.` });
        }
      }
    }
  }

  // Animosity / mark checks — skipped for Black Crusade (it has its own 4-mark validation above)
  if (!rule?.noAnimosity && !blackCrusadeActive) {
    const allowed = allowedMarks(state, data);
    for (const item of state.army) {
      if (item.mark && !allowed.includes(item.mark)) {
        items.push({
          type: 'error',
          text: `${item.unitName}: Mark ${item.mark} not allowed (HQ is ${state.hqMark}).`,
        });
      }
      const u = resolveUnit(item, data);
      if (u?.locked_mark && !allowed.includes(u.locked_mark)) {
        if (!rule?.requireForcedMarkOnly) {
          items.push({
            type: 'error',
            text: `${item.unitName}: Locked mark ${u.locked_mark} incompatible with HQ ${state.hqMark}.`,
          });
        }
      }
    }
  }

  // Army trait limit (max 2)
  if (state.traitPool.length > 2) {
    items.push({ type: 'error', text: `Only 2 Army Traits allowed (have ${state.traitPool.length}).` });
  }

  // veteran_required: unit must have at least 1 veteran ability bought from the armory
  for (const item of state.army) {
    const u = resolveUnit(item, data);
    if (u?.veteran_required) {
      const hasVetItem = item.armory.some(sel => findArmoryItem(data, sel)?.category === 'veteran');
      if (!hasVetItem) {
        items.push({ type: 'error', text: `${item.unitName}: requires at least 1 veteran ability.` });
      }
    }
  }

  // Legacy mark restriction (Hydra, Iron Lord, Night Haunter = Undivided only)
  const undividedLegacies = ['Legacy of the Hydra', 'Legacy of the Iron Lord', 'Legacy of the Night Haunter'];
  const legacies = [state.legacy, state.legacy2].filter(Boolean);
  const hasUndividedLegacy = legacies.some(l => undividedLegacies.includes(l));
  if (hasUndividedLegacy) {
    for (const item of state.army) {
      const u = resolveUnit(item, data);
      const m = u?.locked_mark ?? item.mark;
      if (m && m !== 'Undivided') {
        const restrictingLegacy = legacies.find(l => undividedLegacies.includes(l));
        items.push({
          type: 'error',
          text: `${restrictingLegacy}: ${item.unitName} must be Undivided (current: ${m}).`,
        });
      }
    }
  }

  // Iron Within, Iron Without: warn if unit already has an invulnerability save from its datasheet
  if (data.faction === 'Chaos Space Marines' && state.traitPool.includes('Iron Within, Iron Without')) {
    const INV_SAVE_PATTERNS = /invulnerab(le|ility) save/i;
    for (const entry of state.army) {
      if (!entry.traits.some(t => t.name === 'Iron Within, Iron Without')) continue;
      const u = resolveUnit(entry, data);
      if (!u || u.is_vehicle) continue; // vehicle portion (repair) always applies
      if (u.abilities.some(a => INV_SAVE_PATTERNS.test(a))) {
        items.push({
          type: 'warn',
          text: `Iron Within, Iron Without: ${entry.unitName} already has an invulnerability save — the 6+ inv save bonus does not apply (rules restriction).`,
        });
      }
    }
  }

  // Skirmish: no archetypes, no allied detachment
  if (state.engagement === 'skirmish' && state.archetype) {
    items.push({ type: 'error', text: 'Skirmish: Archetypes are not allowed.' });
  }
  if (state.engagement === 'skirmish' && state.alliedFaction) {
    items.push({ type: 'error', text: 'Skirmish: Allied detachments are not allowed.' });
  }

  // ── Faction-specific validators ──────────────────────────────────────────
  if (state.faction === 'Space Marines') {
    items.push(...validateSpaceMarines(state, data));
  }

  if (items.length === 0) items.push({ type: 'ok', text: 'Army is valid.' });
  return items;
}

export { getSlotUsage, allowedMarks };
