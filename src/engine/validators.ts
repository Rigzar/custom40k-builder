import type { FactionData, Unit } from '../types/data';
import type { ArmyState, RosterEntry } from '../types/army';
import { computeUnitPoints, resolveUnit, effectiveArchetypeFor, effectiveRuleFor } from './points';
import { t, tpl, type Language } from '../i18n';
import { ENGAGEMENTS, SLOT_ORDER, ALLIED_AOP } from './engagements';
import {
  getArchetypeRule, getEffectiveSlot, getEffectiveHqLimits, countsTroops, cleanArchetypeName,
} from './archetypes';
import { applyVariantSlotOverride } from './slotOverrides';
import { validateSpaceMarines } from './codex_space_marines/validator';
import { validateDarkEldar } from './codex_dark_eldar/validator';
import { findArmoryItem, isOptionAvailable, resolveUnitProfile } from './resolver';
import { parseInvSaveFromAbilities } from './equipMods';
import { parseEquipMods, isUniqueItem } from './equipMods';
import { CSM_LEGACY_ITEM_RESTRICTIONS } from './codex_csm/legacies';
import { getAssassinAccessAlignment } from './keywords';
import { GENERAL_DISCIPLINES } from '../data/generalDisciplines';
import { SM_LEGACY_DISC_MAP } from './codex_space_marines/legacies';
import {
  PLATOON_ANCHOR_UNIT, PLATOON_MEMBER_LIMITS, applyPlatoonSlotOverride, countsTowardOwnSlot,
} from './codex_imperial_guard/platoon';

export interface ValidationItem {
  type: 'error' | 'warn' | 'ok';
  text: string;
}

type Rule = ReturnType<typeof getArchetypeRule>;

// ── F1 helpers: mirrors PsychicModal's discipline-filtering logic ─────────────
const _MARK_NAMES = ['khorne', 'tzeentch', 'nurgle', 'slaanesh'] as const;
function _psyDiscIsMarkOnly(name: string): boolean {
  const lc = name.toLowerCase();
  return _MARK_NAMES.some(m => lc.includes(m) && lc.includes('only'));
}
function _psyDiscIsCultOnly(name: string): boolean {
  const lc = name.toLowerCase();
  return lc.includes('cult') && lc.includes('only');
}
function _psyDiscIsLegacy(name: string): boolean {
  return name.includes('(Legacy)');
}
function _getAllowedDiscKeys(
  unit: { name: string; abilities?: string[]; locked_mark?: string; is_cult_initiate?: boolean },
  item: { mark?: string; armory: { itemName: string }[] },
  data: FactionData,
  archetype: string,
  legacy: string,
  legacy2: string,
): Set<string> {
  const rule = getArchetypeRule(archetype);
  const effectiveMark = unit.locked_mark ?? (rule?.forcedMark ?? null) ?? item.mark;
  const hasActiveLegacy = !!(legacy || legacy2);
  const isCultInitiate = !!unit.is_cult_initiate || item.armory.some(a => a.itemName === 'Cult initiate');
  const isSMFaction = data.faction === 'Space Marines';

  const factionDiscs = Object.entries(data.disciplines ?? {}).filter(([name]) => {
    if (_psyDiscIsCultOnly(name)) return isCultInitiate;
    if (isCultInitiate) return false;
    if (_psyDiscIsMarkOnly(name)) {
      if (!effectiveMark || effectiveMark === 'Undivided') return false;
      const lc = name.toLowerCase();
      return _MARK_NAMES.some(m => lc.includes(m) && effectiveMark.toLowerCase() === m);
    }
    if (_psyDiscIsLegacy(name)) {
      if (isSMFaction) {
        const required = SM_LEGACY_DISC_MAP[name];
        if (!required) return hasActiveLegacy;
        return legacy === required || legacy2 === required;
      }
      return hasActiveLegacy;
    }
    return true;
  });

  const generalDiscs = isCultInitiate ? [] : Object.entries(GENERAL_DISCIPLINES);
  let allowed = [...generalDiscs, ...factionDiscs];

  if (data.faction === 'Chaos Daemons') {
    const psykerLine = (unit.abilities ?? []).find(a => /^psyker:/i.test(a)) ?? '';
    const lc = psykerLine.toLowerCase();
    if (!lc.includes('chosen discipline')) {
      const allowsGenerals = lc.includes('all general disciplines');
      allowed = allowed.filter(([discName]) => {
        if (Object.prototype.hasOwnProperty.call(GENERAL_DISCIPLINES, discName)) return allowsGenerals;
        const dn = discName.toLowerCase();
        if (dn.includes('change')) return lc.includes('discipline of change');
        if (dn.includes('decay'))  return lc.includes('discipline of decay');
        if (dn.includes('excess')) return lc.includes('discipline of excess');
        return true;
      });
    }
  }

  if (data.faction === 'Necrons') {
    allowed = allowed.filter(([discName]) => !Object.prototype.hasOwnProperty.call(GENERAL_DISCIPLINES, discName));
  }

  if (data.faction === 'Eldar') {
    allowed = allowed.filter(([discName]) => {
      const lc = discName.toLowerCase();
      if (lc.includes('warlocks only')) return unit.name === 'Warlocks';
      if (lc.includes('farseers only')) return unit.name === 'Farseer';
      if (lc.includes('wraithseer only')) return unit.name === 'Wraithseer';
      if (lc.includes('ynnari only')) return archetype === 'Ynnari';
      return true;
    });
  }

  return new Set(allowed.map(([discName]) => discName));
}

/**
 * Advisor units' literal datasheet text is "For every HQ selection, one <X> may be selected
 * without taking up a [slot]" (e.g. Orks Mekboy/Painboy, SM Techmarine, CSM Master of Execution)
 * — a 1-per-HQ ratio keyed to that specific unit NAME (or `unit.advisorRatio` copies per HQ for
 * the rare exception, e.g. CSM Exalted Plague Champion's "up to 5 per HQ unit"). Core Rules
 * doesn't define a generic "Advisor" special rule; `advisor: true` just flags this per-unit
 * pattern, so the ratio has to be enforced here rather than read off a shared rule. Returns the
 * RosterEntry ids exempt from slot occupancy: the first N copies of each advisor unit name in a
 * given allied/primary scope, capped at (HQ selections in that SAME scope) × ratio — extra copies
 * beyond the ratio occupy their slot like any other unit (GitHub #10: Mekboy/Painboy never took
 * up a slot regardless of HQ count, because the old check exempted advisor units unconditionally).
 */
export function advisorExemptIds(
  army: RosterEntry[],
  data: FactionData,
  rule: Rule,
  alliedFaction?: string,
): Set<string> {
  const hqCountCache = new Map<boolean, number>();
  function hqCount(isAllied: boolean): number {
    if (!hqCountCache.has(isAllied)) {
      const n = army.filter(j => {
        const jIsAllied = !!(j.factionSource && j.factionSource === alliedFaction);
        if (jIsAllied !== isAllied) return false;
        if (getEffectiveSlot(j.unitName, j.slot, rule) !== 'HQ') return false;
        const u = resolveUnit(j, data);
        return !u?.advisor; // advisors don't count as HQ selections for their own ratio cap
      }).length;
      hqCountCache.set(isAllied, n);
    }
    return hqCountCache.get(isAllied)!;
  }
  const seen = new Map<string, number>();
  const exempt = new Set<string>();
  for (const i of army) {
    const u = resolveUnit(i, data);
    if (!u?.advisor) continue;
    const isAllied = !!(i.factionSource && i.factionSource === alliedFaction);
    const key = `${isAllied}:${i.unitName}`;
    const n = seen.get(key) ?? 0;
    seen.set(key, n + 1);
    if (n < hqCount(isAllied) * (u.advisorRatio ?? 1)) exempt.add(i.id);
  }
  return exempt;
}

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
  const exemptIds = engagement === 'skirmish' ? new Set<string>() : advisorExemptIds(army, data, rule, alliedFaction);
  return army.filter(i => {
    if (i.factionSource && excludeFactionSources?.includes(i.factionSource)) return false;
    const isAllied = !!(i.factionSource && i.factionSource === alliedFaction);
    if (countAllied !== undefined && isAllied !== countAllied) return false;
    if (exemptIds.has(i.id)) return false;
    const u = resolveUnit(i, data);
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

// Animosity of the Gods only exists as a mechanic for factions that actually carry a
// `data.animosity` table (CSM/CD) — explicit `mark` param + `data` pair instead of always reading
// `state.hqMark`/the PRIMARY `data`, so the SAME function can validate an Allied Detachment's own
// CSM/CD units against its own `alliedHqMark`/`alliedData`, not the primary's.
function allowedMarksFor(mark: string, data: FactionData): string[] {
  // Try exact key first, then prefix-match for compound keys like "Undivided / Without"
  if (data.animosity[mark]) return data.animosity[mark];
  const match = Object.entries(data.animosity).find(([k]) => k.startsWith(mark));
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
  if (!pointLimit) return { elites: flagged, notes: [] };
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

/**
 * Adeptus Mechanicus Servitors: "For each Magos, Archmagos, or Tech-Priest selection, one
 * Servitor squad may be selected that does not occupy an Elite slot." (servitors.ts' own
 * option_group header — an inert placeholder, empty choices, same unenforced shape as Crusaders'
 * before computeCrusadersFreeSlots). Archmagos is a variant promotion of Magos (same RosterEntry
 * unitName "Magos"), so counting Magos covers it already. Same ratio-against-a-sibling-unit
 * shape, except the anchor is the SUM of two different unit names, not one.
 */
export function computeServitorFreeSlots(
  army: RosterEntry[],
  data: FactionData,
): { elites: number; notes: string[] } {
  if (data.faction !== 'Adeptus Mechanicus') return { elites: 0, notes: [] };
  const servitorCount = army.filter(i => i.unitName === 'Servitors').length;
  const anchorCount = army.filter(i => i.unitName === 'Magos' || i.unitName === 'Tech-Priest').length;
  if (servitorCount === 0 || anchorCount === 0) return { elites: 0, notes: [] };
  const credited = Math.min(servitorCount, anchorCount);
  const notes = [`Servitors: ${credited} of ${servitorCount} unit${servitorCount === 1 ? '' : 's'} exempted from the Elite slot (1 per Magos/Tech-Priest, have ${anchorCount}).`];
  if (servitorCount > anchorCount) {
    notes.push(`Servitors: ${servitorCount - anchorCount} extra unit${servitorCount - anchorCount === 1 ? '' : 's'} exceed the Magos/Tech-Priest ratio and still occupy a normal Elite slot.`);
  }
  return { elites: credited, notes };
}

/**
 * Genestealer Cults: 8 named Elites characters (Abominant, Biophagus, Clamavus, Kelermorph,
 * Locus, Nexos, Sanctus, Reductus Saboteur) each independently say "For every 500 points of game
 * size, one <name> may be included in the army that does not take up an Elite slot" — found as
 * an inert empty-choices option_group on every one of them (no per-unit inline flag like Eldar
 * Warlocks have, so every copy is eligible up to the cap, same as Geminae Superia/Servitors —
 * just points-capped instead of unit-ratio-capped). Each unit's cap is computed independently
 * (not pooled), per its own ods-verbatim wording.
 */
const GSC_POINTS_FREE_ELITES = ['Abominant', 'Biophagus', 'Clamavus', 'Kelermorph', 'Locus', 'Nexos', 'Sanctus', 'Reductus Saboteur'];
export function computeGscEliteFreeSlots(
  army: RosterEntry[],
  data: FactionData,
  pointLimit: number,
): { elites: number; notes: string[] } {
  if (data.faction !== 'Genestealer Cults') return { elites: 0, notes: [] };
  if (!pointLimit) {
    const elites = GSC_POINTS_FREE_ELITES.reduce((sum, name) => sum + army.filter(i => i.unitName === name).length, 0);
    return { elites, notes: [] };
  }
  const cap = Math.floor(pointLimit / 500);
  let elites = 0;
  const notes: string[] = [];
  for (const name of GSC_POINTS_FREE_ELITES) {
    const count = army.filter(i => i.unitName === name).length;
    if (count === 0) continue;
    const credited = Math.min(count, cap);
    elites += credited;
    notes.push(`${name}: ${credited} of ${count} unit${count === 1 ? '' : 's'} exempted from the Elite slot (1 per 500pts of game size, ${pointLimit}pts → max ${cap}).`);
    if (count > cap) {
      notes.push(`${name}: ${count - cap} extra unit${count - cap === 1 ? '' : 's'} exceed the game-size cap and still occupy a normal Elite slot.`);
    }
  }
  return { elites, notes };
}

/**
 * Leagues of Votann Einhyr Champion: "For every unit of Einhyr Hearthguard taken in an Elite
 * slot, a single Einhyr Champion may be included that does not take up an Elite slot." Same
 * ratio-against-a-sibling-unit shape as Crusaders/Preacher.
 */
export function computeEinhyrChampionFreeSlots(
  army: RosterEntry[],
  data: FactionData,
): { elites: number; notes: string[] } {
  if (data.faction !== 'Leagues of Votann') return { elites: 0, notes: [] };
  const championCount = army.filter(i => i.unitName === 'Einhyr Champion').length;
  const hearthguardCount = army.filter(i => i.unitName === 'Einhyr Hearthguard').length;
  if (championCount === 0 || hearthguardCount === 0) return { elites: 0, notes: [] };
  const credited = Math.min(championCount, hearthguardCount);
  const notes = [`Einhyr Champion: ${credited} of ${championCount} unit${championCount === 1 ? '' : 's'} exempted from the Elite slot (1 per Einhyr Hearthguard, have ${hearthguardCount}).`];
  if (championCount > hearthguardCount) {
    notes.push(`Einhyr Champion: ${championCount - hearthguardCount} extra unit${championCount - hearthguardCount === 1 ? '' : 's'} exceed the Einhyr Hearthguard ratio and still occupy a normal Elite slot.`);
  }
  return { elites: credited, notes };
}

/**
 * Tyranids Tyrant Guard Brood: "For every Hive Tyrant or Swarmlord selection, the army may
 * include one Tyrant Guard Brood that does not take up an HQ slot." Same shape, HQ instead of
 * Elites (Tyrant Guard Brood's own printed slot is HQ).
 */
export function computeTyrantGuardFreeSlots(
  army: RosterEntry[],
  data: FactionData,
): { hq: number; notes: string[] } {
  if (data.faction !== 'Tyranids') return { hq: 0, notes: [] };
  const guardCount = army.filter(i => i.unitName === 'Tyrant Guard Brood').length;
  const anchorCount = army.filter(i => i.unitName === 'Hive Tyrant' || i.unitName === 'Swarmlord').length;
  if (guardCount === 0 || anchorCount === 0) return { hq: 0, notes: [] };
  const credited = Math.min(guardCount, anchorCount);
  const notes = [`Tyrant Guard Brood: ${credited} of ${guardCount} unit${guardCount === 1 ? '' : 's'} exempted from the HQ slot (1 per Hive Tyrant/Swarmlord, have ${anchorCount}).`];
  if (guardCount > anchorCount) {
    notes.push(`Tyrant Guard Brood: ${guardCount - anchorCount} extra unit${guardCount - anchorCount === 1 ? '' : 's'} exceed the Hive Tyrant/Swarmlord ratio and still occupy a normal HQ slot.`);
  }
  return { hq: credited, notes };
}

/**
 * Chaos Space Marines Cultist Firebrand: "For each Cultists unit, one Cultist Firebrand unit may
 * be selected that does not occupy an Elite slot." Same shape again.
 */
export function computeCultistFirebrandFreeSlots(
  army: RosterEntry[],
  data: FactionData,
): { elites: number; notes: string[] } {
  if (data.faction !== 'Chaos Space Marines') return { elites: 0, notes: [] };
  const firebrandCount = army.filter(i => i.unitName === 'Cultist Firebrand').length;
  const cultistsCount = army.filter(i => i.unitName === 'Cultists').length;
  if (firebrandCount === 0 || cultistsCount === 0) return { elites: 0, notes: [] };
  const credited = Math.min(firebrandCount, cultistsCount);
  const notes = [`Cultist Firebrand: ${credited} of ${firebrandCount} unit${firebrandCount === 1 ? '' : 's'} exempted from the Elite slot (1 per Cultists, have ${cultistsCount}).`];
  if (firebrandCount > cultistsCount) {
    notes.push(`Cultist Firebrand: ${firebrandCount - cultistsCount} extra unit${firebrandCount - cultistsCount === 1 ? '' : 's'} exceed the Cultists ratio and still occupy a normal Elite slot.`);
  }
  return { elites: credited, notes };
}

/**
 * Imperial Guard Commissar: ability text/flag says `advisor: true` (copied from the per-HQ
 * "Advisor:" pattern), but its OWN datasheet ratio is "For each Infantry type unit selection,
 * one Commissar may be selected that does not occupy an Elite slot" — anchored to Infantry-type
 * SELECTIONS army-wide, not HQ count. `advisorExemptIds` hardcodes the HQ-count anchor, so it was
 * silently mis-crediting Commissar (e.g. exempting one with 1 HQ and 0 Infantry units, or
 * capping at HQ count regardless of how many Infantry selections are actually present). Fixed at
 * the data level (commissar.ts: `advisor: false`) and given its own correctly-anchored function,
 * reusing the same "strict Infantry selection" definition as the Dedicated Transport AOP cap.
 */
export function computeCommissarFreeSlots(
  army: RosterEntry[],
  data: FactionData,
  state: ArmyState,
): { elites: number; notes: string[] } {
  if (data.faction !== 'Imperial Guard') return { elites: 0, notes: [] };
  const commissarCount = army.filter(i => i.unitName === 'Commissar').length;
  if (commissarCount === 0) return { elites: 0, notes: [] };
  const infantryCount = countInfantrySelections(state, data, false);
  const credited = Math.min(commissarCount, infantryCount);
  const notes = [`Commissar: ${credited} of ${commissarCount} unit${commissarCount === 1 ? '' : 's'} exempted from the Elite slot (1 per Infantry-type selection, have ${infantryCount}).`];
  if (commissarCount > infantryCount) {
    notes.push(`Commissar: ${commissarCount - infantryCount} extra unit${commissarCount - infantryCount === 1 ? '' : 's'} exceed the Infantry-selection ratio and still occupy a normal Elite slot.`);
  }
  return { elites: credited, notes };
}

/**
 * T'au Sub-Commander: had `advisor: true` (assumes a per-HQ-count ratio), but its OWN
 * option_group header says "For every unit of Commander or Ethereal, one Sub-Commander unit may
 * be taken without using a HQ slot" — anchored to Commander+Ethereal count specifically, NOT
 * every HQ selection (Tau has other HQ units, e.g. Ethereal Guard, that shouldn't count). Same
 * wrong-anchor bug class as Commissar.
 */
export function computeSubCommanderFreeSlots(
  army: RosterEntry[],
  data: FactionData,
): { hq: number; notes: string[] } {
  if (data.faction !== 'Tau Empire') return { hq: 0, notes: [] };
  const subCount = army.filter(i => i.unitName === 'Sub-Commander').length;
  const anchorCount = army.filter(i => i.unitName === 'Commander' || i.unitName === 'Ethereal').length;
  if (subCount === 0 || anchorCount === 0) return { hq: 0, notes: [] };
  const credited = Math.min(subCount, anchorCount);
  const notes = [`Sub-Commander: ${credited} of ${subCount} unit${subCount === 1 ? '' : 's'} exempted from the HQ slot (1 per Commander/Ethereal, have ${anchorCount}).`];
  if (subCount > anchorCount) {
    notes.push(`Sub-Commander: ${subCount - anchorCount} extra unit${subCount - anchorCount === 1 ? '' : 's'} exceed the Commander/Ethereal ratio and still occupy a normal HQ slot.`);
  }
  return { hq: credited, notes };
}

/**
 * T'au Ethereal Guard: same wrong-anchor bug — "1 unit of Ethereal Guard can be taken for each
 * Ethereal. Does not occupy an HQ slot", anchored to Ethereal count specifically, not any HQ.
 */
export function computeEtherealGuardFreeSlots(
  army: RosterEntry[],
  data: FactionData,
): { hq: number; notes: string[] } {
  if (data.faction !== 'Tau Empire') return { hq: 0, notes: [] };
  const guardCount = army.filter(i => i.unitName === 'Ethereal Guard').length;
  const etherealCount = army.filter(i => i.unitName === 'Ethereal').length;
  if (guardCount === 0 || etherealCount === 0) return { hq: 0, notes: [] };
  const credited = Math.min(guardCount, etherealCount);
  const notes = [`Ethereal Guard: ${credited} of ${guardCount} unit${guardCount === 1 ? '' : 's'} exempted from the HQ slot (1 per Ethereal, have ${etherealCount}).`];
  if (guardCount > etherealCount) {
    notes.push(`Ethereal Guard: ${guardCount - etherealCount} extra unit${guardCount - etherealCount === 1 ? '' : 's'} exceed the Ethereal ratio and still occupy a normal HQ slot.`);
  }
  return { hq: credited, notes };
}

/**
 * T'au Kroot Lone-Spear / Krootox Riders / Krootox Rampagers: all 3 had `advisor: true` but
 * their own option_group header is "For every unit of Kroot Carnivores, one <name> may be
 * taken without using a[n] <own slot> slot" — anchored to Kroot Carnivores count, not HQ.
 * Krootox Riders/Rampagers' header text said "ELITE slot" (copy-pasted from Lone-Spear, which IS
 * an Elites unit) despite being Heavy Support/Fast Attack themselves — corrected the text to
 * match each unit's own printed slot, since every sibling in this mechanic family exempts itself
 * from its OWN slot, never a foreign one.
 */
export function computeKrootCarnivoreEscortFreeSlots(
  army: RosterEntry[],
  data: FactionData,
): { elites: number; fa: number; hs: number; notes: string[] } {
  if (data.faction !== 'Tau Empire') return { elites: 0, fa: 0, hs: 0, notes: [] };
  const carnivoreCount = army.filter(i => i.unitName === 'Kroot Carnivores').length;
  let elites = 0, fa = 0, hs = 0;
  const notes: string[] = [];
  const escorts: Array<{ name: string; slotKey: 'elites' | 'fa' | 'hs'; slotLabel: string }> = [
    { name: 'Kroot Lone-Spear', slotKey: 'elites', slotLabel: 'Elite' },
    { name: 'Krootox Riders', slotKey: 'hs', slotLabel: 'Heavy Support' },
    { name: 'Krootox Rampagers', slotKey: 'fa', slotLabel: 'Fast Attack' },
    // GH#16: same shape as Krootox Rampagers — "For every unit of Kroot Carnivores, one unit of
    // Kroot Hounds may be taken without using a FAST ATTACK slot." Missed by the 2026-06-26 sweep
    // because its option_group header says "without using" rather than "without taking/occupying".
    { name: 'Kroot Hounds', slotKey: 'fa', slotLabel: 'Fast Attack' },
  ];
  for (const { name, slotKey, slotLabel } of escorts) {
    const count = army.filter(i => i.unitName === name).length;
    if (count === 0 || carnivoreCount === 0) continue;
    const credited = Math.min(count, carnivoreCount);
    if (slotKey === 'elites') elites += credited; else if (slotKey === 'fa') fa += credited; else hs += credited;
    notes.push(`${name}: ${credited} of ${count} unit${count === 1 ? '' : 's'} exempted from the ${slotLabel} slot (1 per Kroot Carnivores, have ${carnivoreCount}).`);
    if (count > carnivoreCount) {
      notes.push(`${name}: ${count - carnivoreCount} extra unit${count - carnivoreCount === 1 ? '' : 's'} exceed the Kroot Carnivores ratio and still occupy a normal ${slotLabel} slot.`);
    }
  }
  return { elites, fa, hs, notes };
}

/**
 * T'au Kroot Shaper (GH#17): "For every Master Shaper or unit of Kroot Carnivores, one Kroot
 * Shaper may be taken without using an Elite slot." Structurally different from the other Kroot
 * escorts above — the anchor is (Master Shaper count + Kroot Carnivores count) COMBINED, not
 * Carnivores alone, so it can't reuse computeKrootCarnivoreEscortFreeSlots' per-name loop.
 */
export function computeKrootShaperFreeSlots(
  army: RosterEntry[],
  data: FactionData,
): { elites: number; notes: string[] } {
  if (data.faction !== 'Tau Empire') return { elites: 0, notes: [] };
  const shaperCount = army.filter(i => i.unitName === 'Kroot Shaper').length;
  const anchorCount = army.filter(i => i.unitName === 'Kroot Master Shaper' || i.unitName === 'Kroot Carnivores').length;
  if (shaperCount === 0 || anchorCount === 0) return { elites: 0, notes: [] };
  const credited = Math.min(shaperCount, anchorCount);
  const notes = [`Kroot Shaper: ${credited} of ${shaperCount} unit${shaperCount === 1 ? '' : 's'} exempted from the Elite slot (1 per Master Shaper/Kroot Carnivores, have ${anchorCount}).`];
  if (shaperCount > anchorCount) {
    notes.push(`Kroot Shaper: ${shaperCount - anchorCount} extra unit${shaperCount - anchorCount === 1 ? '' : 's'} exceed the Master Shaper/Kroot Carnivores ratio and still occupy a normal Elite slot.`);
  }
  return { elites: credited, notes };
}

/**
 * Necrons Plasmacyte: "For each started 500 points game size, one Plasmacyte may be taken
 * without using up an Elite slot." Same points-capped (not ratio-capped) shape as
 * computeGscEliteFreeSlots, found unwired during the 2026-06-28 cross-faction free-slot sweep.
 */
export function computeNecronPlasmacyteFreeSlots(
  army: RosterEntry[],
  data: FactionData,
  pointLimit: number,
): { elites: number; notes: string[] } {
  if (data.faction !== 'Necrons') return { elites: 0, notes: [] };
  const count = army.filter(i => i.unitName === 'Plasmacyte').length;
  if (count === 0) return { elites: 0, notes: [] };
  if (!pointLimit) return { elites: count, notes: [] };
  const cap = Math.floor(pointLimit / 500);
  const credited = Math.min(count, cap);
  const notes = [`Plasmacyte: ${credited} of ${count} unit${count === 1 ? '' : 's'} exempted from the Elite slot (1 per 500pts of game size, ${pointLimit}pts → max ${cap}).`];
  if (count > cap) {
    notes.push(`Plasmacyte: ${count - cap} extra unit${count - cap === 1 ? '' : 's'} exceed the game-size cap and still occupy a normal Elite slot.`);
  }
  return { elites: credited, notes };
}

/**
 * Eldar Spiritseer: "For every unit of Wraithblades, Wraithguard or Wraithlord, one Spiritseer
 * may be selected without using a HQ slot." Same ratio-against-sibling-units shape as
 * computeEinhyrChampionFreeSlots, except the anchor is the SUM of three unit names (mirrors
 * computeKrootShaperFreeSlots/computeServitorFreeSlots' combined-anchor pattern). Found unwired
 * during the 2026-06-28 cross-faction free-slot sweep.
 */
export function computeSpiritseerFreeSlots(
  army: RosterEntry[],
  data: FactionData,
): { hq: number; notes: string[] } {
  if (data.faction !== 'Eldar') return { hq: 0, notes: [] };
  const spiritseerCount = army.filter(i => i.unitName === 'Spiritseer').length;
  const anchorCount = army.filter(i => i.unitName === 'Wraithblades' || i.unitName === 'Wraithguard' || i.unitName === 'Wraithlord').length;
  if (spiritseerCount === 0 || anchorCount === 0) return { hq: 0, notes: [] };
  const credited = Math.min(spiritseerCount, anchorCount);
  const notes = [`Spiritseer: ${credited} of ${spiritseerCount} unit${spiritseerCount === 1 ? '' : 's'} exempted from the HQ slot (1 per Wraithblades/Wraithguard/Wraithlord, have ${anchorCount}).`];
  if (spiritseerCount > anchorCount) {
    notes.push(`Spiritseer: ${spiritseerCount - anchorCount} extra unit${spiritseerCount - anchorCount === 1 ? '' : 's'} exceed the Wraith ratio and still occupy a normal HQ slot.`);
  }
  return { hq: credited, notes };
}

/**
 * Necrons Cryptothralls: "For every Cryptek you may select a unit of [Cryptothralls] that take
 * up no Elite-slot." Ratio-against-Cryptek pattern. Source: Cryptothralls option_group header.
 */
export function computeCryptothrallsFreeSlots(
  army: RosterEntry[],
  data: FactionData,
): { elites: number; notes: string[] } {
  if (data.faction !== 'Necrons') return { elites: 0, notes: [] };
  const cryptothrallCount = army.filter(i => i.unitName === 'Cryptothralls' && !i.factionSource).length;
  if (cryptothrallCount === 0) return { elites: 0, notes: [] };
  const cryptekCount = army.filter(i => i.unitName === 'Cryptek' && !i.factionSource).length;
  if (cryptekCount === 0) return { elites: 0, notes: [] };
  const credited = Math.min(cryptothrallCount, cryptekCount);
  const notes = [`Cryptothralls: ${credited} of ${cryptothrallCount} unit${cryptothrallCount === 1 ? '' : 's'} exempted from Elite slot (1 per Cryptek, have ${cryptekCount}).`];
  if (cryptothrallCount > cryptekCount) {
    notes.push(`Cryptothralls: ${cryptothrallCount - cryptekCount} extra unit${cryptothrallCount - cryptekCount === 1 ? '' : 's'} exceed the ratio and still occupy a normal Elite slot.`);
  }
  return { elites: credited, notes };
}

/**
 * Necrons Hexmark Destroyer: "Royal Assassin — For each Lord or Skorpekh Lord, a Hexmark
 * Destroyer can be chosen that does not occupy an Elite slot." Ratio-against-sibling pattern,
 * same as computeKrootShaperFreeSlots. Source: Hexmark Destroyer ability text (datasheet).
 */
export function computeHexmarkDestroyerFreeSlots(
  army: RosterEntry[],
  data: FactionData,
): { elites: number; notes: string[] } {
  if (data.faction !== 'Necrons') return { elites: 0, notes: [] };
  const hexmarkCount = army.filter(i => i.unitName === 'Hexmark Destroyer' && !i.factionSource).length;
  if (hexmarkCount === 0) return { elites: 0, notes: [] };
  const anchorCount = army.filter(i => (i.unitName === 'Lord' || i.unitName === 'Skorpekh Lord') && !i.factionSource).length;
  if (anchorCount === 0) return { elites: 0, notes: [] };
  const credited = Math.min(hexmarkCount, anchorCount);
  const notes = [`Royal Assassin: ${credited} of ${hexmarkCount} Hexmark Destroyer${hexmarkCount === 1 ? '' : 's'} exempted from Elite slot (1 per Lord/Skorpekh Lord, have ${anchorCount}).`];
  if (hexmarkCount > anchorCount) {
    notes.push(`Royal Assassin: ${hexmarkCount - anchorCount} extra Hexmark Destroyer${hexmarkCount - anchorCount === 1 ? '' : 's'} exceed the ratio and still occupy a normal Elite slot.`);
  }
  return { elites: credited, notes };
}

/**
 * Necrons Royal Court: Crypteks, Royal Wardens, and Lords can be taken without using an HQ slot
 * when an Overlord (= a Lord that took the Overlord upgrade, option_groups[0] __inline) or a
 * Lord is present.
 *   • Overlord present → up to 4 Crypteks free + up to 4 Royal Wardens free + up to 4 extra Lords free
 *   • Lord present (no Overlord) → up to 2 Crypteks free + up to 2 Royal Wardens free
 * Source: ability text on Cryptek, Royal Warden, and Lord datasheets.
 */
export function computeRoyalCourtFreeSlots(
  army: RosterEntry[],
  data: FactionData,
): { hq: number; notes: string[] } {
  if (data.faction !== 'Necrons') return { hq: 0, notes: [] };
  const hasAnyLord = army.some(i => i.unitName === 'Lord' && !i.factionSource);
  if (!hasAnyLord) return { hq: 0, notes: [] };
  // Overlord = a Lord that activated its Overlord upgrade (option_groups[0], __inline)
  const hasOverlord = army.some(i => i.unitName === 'Lord' && !i.factionSource && !!i.optionQty?.[0]?.['__inline']);
  const label = hasOverlord ? 'Overlord' : 'Lord';
  const cap = hasOverlord ? 4 : 2;
  const notes: string[] = [];
  let hq = 0;

  const cryptekCount = army.filter(i => i.unitName === 'Cryptek' && !i.factionSource).length;
  if (cryptekCount > 0) {
    const free = Math.min(cryptekCount, cap);
    hq += free;
    notes.push(`Royal Court (${label}): ${free} of ${cryptekCount} Cryptek${cryptekCount === 1 ? '' : 's'} exempted from HQ slot (max ${cap}).`);
    if (cryptekCount > cap) notes.push(`Royal Court: ${cryptekCount - cap} extra Cryptek${cryptekCount - cap === 1 ? '' : 's'} exceed the cap and still occupy a normal HQ slot.`);
  }

  const wardenCount = army.filter(i => i.unitName === 'Royal Warden' && !i.factionSource).length;
  if (wardenCount > 0) {
    const free = Math.min(wardenCount, cap);
    hq += free;
    notes.push(`Royal Court (${label}): ${free} of ${wardenCount} Royal Warden${wardenCount === 1 ? '' : 's'} exempted from HQ slot (max ${cap}).`);
    if (wardenCount > cap) notes.push(`Royal Court: ${wardenCount - cap} extra Royal Warden${wardenCount - cap === 1 ? '' : 's'} exceed the cap and still occupy a normal HQ slot.`);
  }

  // Lords: if Overlord present, up to 4 other Lords (non-Overlord) are free
  if (hasOverlord) {
    const extraLords = army.filter(i => i.unitName === 'Lord' && !i.factionSource && !i.optionQty?.[0]?.['__inline']).length;
    if (extraLords > 0) {
      const lordCap = 4;
      const free = Math.min(extraLords, lordCap);
      hq += free;
      notes.push(`Royal Court (Overlord): ${free} of ${extraLords} extra Lord${extraLords === 1 ? '' : 's'} exempted from HQ slot (max ${lordCap}).`);
      if (extraLords > lordCap) notes.push(`Royal Court: ${extraLords - lordCap} extra Lord${extraLords - lordCap === 1 ? '' : 's'} exceed the cap and still occupy a normal HQ slot.`);
    }
  }

  return { hq, notes };
}

/**
 * Generic version of computeEldarWarlockFreeSlots' "1 free per 500pts of game size" shape, for
 * archetypes (not unit abilities) that grant it — e.g. Votann Hearthfyre Arsenal's
 * `pointsBasedHqFree`. Every copy of the named unit is eligible (no per-unit inline flag to
 * gate on, unlike Warlocks).
 */
export function computeArchetypeHqFreeSlots(
  army: RosterEntry[],
  rule: Rule,
  pointLimit: number,
): { hq: number; notes: string[] } {
  if (!rule?.pointsBasedHqFree) return { hq: 0, notes: [] };
  const { unitName, perPoints } = rule.pointsBasedHqFree;
  const count = army.filter(i => !i.factionSource && i.unitName === unitName).length;
  if (count === 0) return { hq: 0, notes: [] };
  if (!pointLimit) return { hq: count, notes: [] };
  const cap = Math.floor(pointLimit / perPoints);
  const credited = Math.min(count, cap);
  const notes = [`${unitName}: ${credited} of ${count} unit${count === 1 ? '' : 's'} exempted from the HQ slot (1 per ${perPoints}pts of game size, ${pointLimit}pts → max ${cap}).`];
  if (count > cap) {
    notes.push(`${unitName}: ${count - cap} extra unit${count - cap === 1 ? '' : 's'} exceed the game-size cap and still occupy a normal HQ slot.`);
  }
  return { hq: credited, notes };
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

/** Returns a disabled-tooltip reason for a unit gated to a specific engagement (e.g. CSM "War
 * Dog" — Escalation.ods's own "Elite" ability grants it an Elite-slot pick instead of the normal
 * Lords of War slot, but it's still an Escalation-supplement unit and must not be selectable
 * outside Epic Battle, the only engagement where Escalation content is active). Mirrors
 * lowMoveEmbarkBlockReason's "grey it out, don't just note it" pattern. */
export function engagementGateBlockReason(unit: Unit, engagement: string): string | null {
  if (!unit.requires_engagement || unit.requires_engagement === engagement) return null;
  return `Requires the Escalation supplement (Epic Battle engagement) — not available in ${engagement === 'skirmish' ? 'Skirmish' : 'Pitched Battle'}.`;
}

export function validateArmy(state: ArmyState, data: FactionData, alliedData?: FactionData | null, language: Language = 'en'): ValidationItem[] {
  const eng = ENGAGEMENTS[state.engagement];
  const rule = getArchetypeRule(state.archetype);
  const items: ValidationItem[] = [];

  // True when the primary archetype grants a supplement faction (HH, future similar supplements)
  // whose units should be treated as part of the primary army — no Allied-Detachment separation.
  // Legion (CSM) and Legion (SM) both set rule.alliedFaction = 'horus_heresy'.
  const isIntegratedSuppl = !!(rule?.alliedFaction && state.alliedFaction && rule.alliedFaction === state.alliedFaction);
  // Helper: is this item an integrated supplement unit?
  const isSupplItem = (item: { factionSource?: string | null }) =>
    isIntegratedSuppl && item.factionSource === state.alliedFaction;
  const T = (key: Parameters<typeof t>[1], vars?: Record<string, string | number>) => tpl(t(language, key), vars ?? {});

  const total = state.army.reduce((s, i) => {
    const u = resolveUnit(i, data);
    return s + (u ? computeUnitPoints(i, u, effectiveArchetypeFor(i, state)) : 0);
  }, 0);

  // Point range warnings
  if (state.engagement === 'skirmish') {
    if (total < 1000) items.push({ type: 'warn', text: T('valSkirmishRecommended', { total }) });
    if (total > 1500) items.push({ type: 'warn', text: T('valSkirmishCap', { total }) });
  } else if (state.engagement === 'pitched') {
    if (total < 2500) items.push({ type: 'warn', text: T('valPitchedRecommended', { total }) });
    if (total > 3500) items.push({ type: 'warn', text: T('valPitchedCap', { total }) });
  } else {
    if (total < 4000) items.push({ type: 'warn', text: T('valEpicRecommended', { total }) });
  }

  // Hard point limit
  if (total > state.pointLimit) {
    items.push({ type: 'error', text: T('valOverPointsLimit', { total, limit: state.pointLimit }) });
  } else if (state.army.length > 0) {
    items.push({ type: 'ok', text: T('valWithinLimit', { total, limit: state.pointLimit }) });
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
          text: T('valSelectionRequired', { unit: u.name, header: g.header }),
        });
      }
    }
  }

  // ── "If no Heavy weapons team is formed, another Guardsman may take a Special weapon" ──────
  // (Imperial Guard Infantry Squad/Mechanised Infantry, GH#23) — the 2nd special-weapon slot is
  // conditional on the Heavy weapons team group being empty; the data has no cross-group
  // condition primitive for this, so enforce it generically by header text instead.
  for (const item of state.army) {
    const u = resolveUnit(item, data);
    if (!u) continue;
    const conditionalGi = u.option_groups.findIndex(g => /^If no Heavy weapons team is formed/i.test(g.header));
    if (conditionalGi < 0) continue;
    const conditionalHasSelection = u.option_groups[conditionalGi].choices.some(
      (_, ci) => (item.optionQty?.[conditionalGi]?.[ci] ?? 0) > 0,
    );
    if (!conditionalHasSelection) continue;
    const heavyGi = u.option_groups.findIndex((g, gi) => gi !== conditionalGi && /Heavy weapons team/i.test(g.header));
    if (heavyGi < 0) continue;
    const heavyHasSelection = u.option_groups[heavyGi].choices.some(
      (_, ci) => (item.optionQty?.[heavyGi]?.[ci] ?? 0) > 0,
    );
    if (heavyHasSelection) {
      items.push({
        type: 'error',
        text: `${item.customName || u.name}: the second Special weapon requires no Heavy weapons team to be formed.`,
      });
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
        text: T('valOnlyOneArmour', { unit: u?.name ?? item.unitName, armours: armours.join(', ') }),
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
        // Each joiner's OWN scope's archetype grants this, not necessarily the primary's.
        const jRule = getArchetypeRule(effectiveArchetypeFor(j, state));
        const grantedByArchetype = !!jRule?.grantsCommandSquad?.includes(j.unitName);
        return !hasAbility && !grantedByArchetype;
      });
      if (withoutCommandSquad.length > 1) {
        const names = joiners.map(j => j.customName || j.unitName).join(', ');
        items.push({
          type: 'error',
          text: T('valOnlyOneCharacterAttached', { unit: targetName, count: joiners.length, names }),
        });
      }
    }

    // Cross-faction join: a character may not attach to a unit from a different faction scope.
    // Exception: integrated supplements (HH) — a primary-army character joining a supplement unit
    // or vice versa is fine because they're treated as one army.
    for (const [targetId, joiners] of joinTargets) {
      const target = state.army.find(e => e.id === targetId);
      if (!target) continue;
      for (const joiner of joiners) {
        if ((joiner.factionSource ?? '') !== (target.factionSource ?? '')) {
          // Allow cross-join if both sides belong to the same integrated supplement pool
          const joinerIsSuppl = isSupplItem(joiner);
          const targetIsSuppl = isSupplItem(target);
          if (isIntegratedSuppl && (joinerIsSuppl || !joiner.factionSource) && (targetIsSuppl || !target.factionSource)) {
            continue;
          }
          const targetName = resolveUnit(target, data)?.name ?? target.unitName;
          items.push({
            type: 'error',
            text: `${joiner.unitName} cannot join ${targetName}: characters may not attach to units from a different faction.`,
          });
        }
      }
    }
  }

  // ── Archetype validation ──────────────────────────────────────────────────
  // `rule` (above) is the PRIMARY army's archetype — every check in this block must only ever
  // evaluate the PRIMARY's own units. An Allied Detachment has its own, separate archetype-
  // composition pass further below (search `allyRule`); without the `!item.factionSource` guard
  // here, the primary's archetype restrictions (banned units, forced mark, etc.) used to wrongly
  // apply to the ally's units too.
  if (rule) {
    // Banned units
    for (const item of state.army) {
      if (!item.factionSource && rule.bannedUnits.includes(item.unitName)) {
        items.push({
          type: 'error',
          text: T('valArchetypeUnitNotAllowed', { archetype: cleanArchetypeName(state.archetype), unit: item.unitName }),
        });
      }
    }

    // Whitelist — only specific units allowed (e.g. Krumpa Kompany, Tempestus Scions)
    if (rule.allowedUnitsOnly.length > 0) {
      for (const item of state.army) {
        if (!item.factionSource && !rule.allowedUnitsOnly.includes(item.unitName)) {
          items.push({
            type: 'error',
            text: T('valArchetypeNotInAllowedList', { archetype: cleanArchetypeName(state.archetype), unit: item.unitName }),
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
            text: T('valArchetypeSlotNotAllowed', { archetype: cleanArchetypeName(state.archetype), slot: item.slot, unit: item.unitName }),
          });
        }
      }
    }

    // Required HQ unit type (e.g. LIIVI needs a Farseer, The First Curse needs a Patriarch)
    if (rule.requiresHqUnit) {
      const hasRequiredHq = state.army.some(item => {
        if (item.factionSource) return false;
        const effSlot = getEffectiveSlot(item.unitName, item.slot, rule);
        return effSlot === 'HQ' && item.unitName.toLowerCase().includes(rule!.requiresHqUnit!.toLowerCase());
      });
      if (!hasRequiredHq) {
        items.push({
          type: 'error',
          text: T('valArchetypeRequiresHqUnit', { archetype: cleanArchetypeName(state.archetype), hqUnit: rule.requiresHqUnit! }),
        });
      }
    }

    // Required HQ unit WITH a specific upgrade choice selected (e.g. AdMech Cybernetica Cohort
    // needs a Magos/Archmagos with the Datasmith upgrade, not just any Magos) OR a specific
    // Armory item bought (e.g. Tau Stealth Cadre's Commander with an XV22 Stalker battlesuit —
    // that upgrade is sold through the Armory, not the unit's own option_groups).
    if (rule.requiresHqUpgrade) {
      const { unitNameContains, choiceName } = rule.requiresHqUpgrade;
      const hasRequiredHqUpgrade = state.army.some(item => {
        if (item.factionSource) return false;
        const effSlot = getEffectiveSlot(item.unitName, item.slot, rule);
        if (effSlot !== 'HQ' || !item.unitName.toLowerCase().includes(unitNameContains.toLowerCase())) return false;
        if (item.armory.some(a => a.itemName === choiceName)) return true;
        const u = resolveUnit(item, data);
        if (!u) return false;
        return u.option_groups.some((g, gi) => g.choices.some((c, ci) =>
          c.name === choiceName && (item.optionQty?.[gi]?.[ci] ?? 0) > 0,
        ));
      });
      if (!hasRequiredHqUpgrade) {
        items.push({
          type: 'error',
          text: T('valArchetypeRequiresHqUpgrade', { archetype: cleanArchetypeName(state.archetype), hqUnit: rule.requiresHqUpgrade.unitNameContains, upgrade: rule.requiresHqUpgrade.choiceName }),
        });
      }
    }

    // Troops selections OTHER than the anchor unit, capped by how many copies of the anchor are
    // in the army (e.g. IG Whiteshields: 1 other Troop selection per Conscript Infantry Platoon).
    if (rule.troopsRatioCap) {
      const { anchorUnit, perAnchor } = rule.troopsRatioCap;
      let anchorCount = 0;
      let otherCount = 0;
      for (const item of state.army) {
        if (item.factionSource) continue;
        if (getEffectiveSlot(item.unitName, item.slot, rule) !== 'Troops') continue;
        if (item.unitName === anchorUnit) anchorCount++;
        else otherCount++;
      }
      const allowed = anchorCount * perAnchor;
      if (otherCount > allowed) {
        items.push({
          type: 'error',
          text: T('valArchetypeTroopsRatioCap', { archetype: cleanArchetypeName(state.archetype), allowed, have: otherCount, anchorCount, anchorUnit }),
        });
      }
    }

    // Requires >=1 escortUnit selection per troopsUnit selection counted as Troops (e.g. AdMech
    // Servitor Maniple: "For each Servitor unit taken as Troops, the army must also take a
    // Tech-priest"). Distinct from computeServitorFreeSlots, which grants the Tech-priest its OWN
    // free Elite slot unconditionally — this is the mandatory count requirement on top.
    if (rule.requiresEscortPerTroopsUnit) {
      const { troopsUnit, escortUnit } = rule.requiresEscortPerTroopsUnit;
      let troopsCount = 0;
      let escortCount = 0;
      for (const item of state.army) {
        if (item.factionSource) continue;
        if (item.unitName === escortUnit) escortCount++;
        else if (item.unitName === troopsUnit && getEffectiveSlot(item.unitName, item.slot, rule) === 'Troops') troopsCount++;
      }
      if (troopsCount > escortCount) {
        items.push({
          type: 'error',
          text: T('valArchetypeRequiresEscort', { archetype: cleanArchetypeName(state.archetype), troopsUnit, escortUnit, troopsCount, escortCount }),
        });
      }
    }

    // Units that count as Troops only up to a MODEL-count ratio against another unit (e.g.
    // Sororitas Penitent Crusade: 1 Penitent Engines per 10 Arco-flagellant models; Tau Stealth
    // Cadre: 1 Ghostkeel Battlesuits per 6 Stealth Shas'ui/Shas've models). troopsRemap already
    // lets cappedUnit count as Troops unconditionally; this adds the ratio ceiling as an error.
    if (rule.troopsModelRatioCap) {
      const { sourceUnits, modelsPerUnit, cappedUnit } = rule.troopsModelRatioCap;
      let sourceModels = 0;
      let cappedCount = 0;
      for (const item of state.army) {
        if (item.factionSource) continue;
        if (sourceUnits.includes(item.unitName)) sourceModels += item.size;
        else if (item.unitName === cappedUnit) cappedCount++;
      }
      const allowed = Math.floor(sourceModels / modelsPerUnit);
      if (cappedCount > allowed) {
        items.push({
          type: 'error',
          text: T('valArchetypeTroopsModelRatioCap', { archetype: cleanArchetypeName(state.archetype), allowed, cappedUnit, have: cappedCount, sourceModels, sourceUnits: sourceUnits.join('/'), modelsPerUnit }),
        });
      }
    }

    // Units banned because they have no vet abilities (Legionnaire Warband)
    if (rule.requireVetAbilities) {
      for (const item of state.army) {
        if (item.factionSource) continue;
        const u = resolveUnit(item, data);
        if (u && !u.has_veteran_abilities) {
          items.push({
            type: 'error',
            text: T('valArchetypeNoVetAbilities', { unit: item.unitName }),
          });
        }
      }
    }

    // Forced mark: validate all units have the correct mark
    if (rule.forcedMark) {
      for (const item of state.army) {
        if (item.factionSource) continue;
        const u = resolveUnit(item, data);
        if (!u) continue;
        const lockedMark = u.locked_mark;
        const chosenMark = item.mark;
        const hasMarkGroup = u.option_groups.some(g => g.constraint?.type === 'mark');
        if (lockedMark && lockedMark !== rule.forcedMark) {
          items.push({
            type: 'error',
            text: T('valArchetypeForcedMarkConflict', { archetype: cleanArchetypeName(state.archetype), unit: item.unitName, lockedMark, forcedMark: rule.forcedMark! }),
          });
        } else if (!lockedMark && chosenMark && chosenMark !== rule.forcedMark) {
          items.push({
            type: 'error',
            text: T('valArchetypeForcedMarkConflict', { archetype: cleanArchetypeName(state.archetype), unit: item.unitName, lockedMark: chosenMark, forcedMark: rule.forcedMark! }),
          });
        } else if (!lockedMark && hasMarkGroup && !chosenMark) {
          items.push({
            type: 'warn',
            text: `${cleanArchetypeName(state.archetype)}: ${item.unitName} must select the Mark of ${rule.forcedMark}.`,
          });
        }
      }
    }

    // HQ unit restrictions (Sorcerer Circle)
    if (rule.hqAllowed.length > 0) {
      for (const item of state.army) {
        if (item.factionSource) continue;
        const effSlot = getEffectiveSlot(item.unitName, item.slot, rule);
        if (effSlot === 'HQ') {
          const allowed = rule.hqAllowed.some(name =>
            item.unitName.toLowerCase().includes(name.toLowerCase()),
          );
          if (!allowed) {
            items.push({
              type: 'error',
              text: T('valArchetypeHqNotAllowed', { archetype: cleanArchetypeName(state.archetype), unit: item.unitName, allowed: rule.hqAllowed.join(', ') }),
            });
          }
        }
      }
    }

    // Abaddon's Chosen: each HQ must have a different mark
    if (state.archetype === "Abaddon's Chosen") {
      const hqMarks: string[] = [];
      for (const item of state.army) {
        if (item.factionSource) continue;
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
        if (item.factionSource) continue;
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
        if (item.factionSource) continue;
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
      items.push({ type: 'error', text: T('valNoLegacyAllowed', { archetype: cleanArchetypeName(state.archetype) }) });
    }
    if (rule.noTraits && state.traitPool.length > 0) {
      items.push({ type: 'error', text: T('valNoTraitsAllowed', { archetype: cleanArchetypeName(state.archetype) }) });
    }

    // Daemonkin: all units must share the same Chaos Mark
    // Only check PRIMARY units — allied Daemon units can have different gods' marks
    // (e.g. Bloodletters=Khorne alongside Plaguebearers=Nurgle is valid for the Daemon side).
    if (state.archetype === 'Daemonkin') {
      const marks = new Set<string>();
      for (const item of state.army) {
        if (item.factionSource) continue;
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
      const alliedRule = getArchetypeRule(state.alliedArchetype);
      const hasMainHq = state.army.some(i =>
        !i.factionSource && getEffectiveSlot(i.unitName, i.slot, rule) === 'HQ',
      );
      const hasAlliedHq = state.army.some(i =>
        !!i.factionSource && getEffectiveSlot(i.unitName, i.slot, alliedRule) === 'HQ',
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
      if (item.factionSource && !isSupplItem(item)) continue; // trait applies only to primary army units (+ integrated supplement)
      const u = resolveUnit(item, data) ?? (isSupplItem(item) && alliedData ? resolveUnit(item, alliedData) : null);
      if (!u || u.is_vehicle) continue; // vehicles use the Iron Repair effect, not inv save
      // Check datasheet abilities for inv save — uses parseInvSaveFromAbilities for consistency
      // with the InvSv stat display (same source of truth).
      const hasInvFromDatasheet = parseInvSaveFromAbilities(u.abilities ?? []) !== null;
      // Check armory selections for inv-save items
      const hasInvFromArmory = item.armory.some(a => INV_SAVE_ARMORY_ITEMS.has(a.itemName));
      if (hasInvFromDatasheet || hasInvFromArmory) {
        items.push({
          type: 'warn',
          text: T('valIronWithin', { unit: item.unitName }),
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
            text: T('valChoiceMarkRestriction', { unit: item.unitName, choice: c.name, requiredMark: restriction, currentMark: mark ?? 'none' }),
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
          ? T('valOptionNotAvailableMark', { unit: item.unitName, header: g.header, mark: g.available_if.keyword })
          : g.available_if.scope === 'archetype'
            ? T('valOptionRequiresArchetype', { unit: item.unitName, header: g.header, archetype: g.available_if.keyword })
            : T('valOptionOnlyInArmy', { unit: item.unitName, header: g.header, keyword: g.available_if.keyword });
        items.push({ type: 'error', text: reason });
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
        text: T('valBlackCrusadeNoChampion'),
      });
    } else if (bcChampions.length > 1) {
      items.push({
        type: 'error',
        text: T('valBlackCrusadeTooMany', { count: bcChampions.length }),
      });
    } else {
      const champion = bcChampions[0];
      const u = resolveUnit(champion, data);
      if (u?.locked_mark) {
        items.push({
          type: 'error',
          text: T('valBlackCrusadeLockedMark', { unit: champion.unitName }),
        });
      } else {
        items.push({
          type: 'ok',
          text: T('valBlackCrusadeChampionOk', { unit: champion.unitName }),
        });
      }
    }
  }

  // 2nd legacy requires a "enables_second_legacy" trait to be active
  if (state.legacy2 && !state.traitPool.some(n => data.traits.find(t => t.name === n)?.enables_second_legacy)) {
    items.push({ type: 'error', text: T('val2ndLegacyRequiresTrait') });
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
          text: T('valMixedWarbandMultiLegacy', { unit: entry.unitName }),
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
        text: T('valChamberMilitantNoLegacy'),
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

  // Inquisition: the old per-model "Ordo Hereticus/Malleus/Xenos" armory-item pick (and its
  // mutual-exclusivity validator, ki-inquisition-ordo-exclusivity-01) was REMOVED 2026-06-23
  // per ki-inquisition-army-customisation-replace-01 — the canonical Inquisition.ods has no
  // such items at all; the army-wide Legacy (Ordo Hereticus/Malleus/Xenos/Minoris) is the sole
  // mechanism now, via inquisitionLegacyOrdoUnlocks() (engine/keywords.ts). Nothing to validate
  // here anymore — a single `legacy` field is structurally exclusive by construction.

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
          text: T('valOrdoMinorisExcess', { unit: item.customName || item.unitName, items: picked.map(a => a.itemName).join(', ') }),
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
          text: T(hasInquisitorLord ? 'valHenchmanWarbandCapLord' : 'valHenchmanWarbandCap', { cap, count: item.size }),
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
            items.push({ type: 'error', text: T('valCsmLegacyKhorne', { armory: armoryKey, item: itemName, unit: entry.unitName, mark: effMark ?? 'none' }) });
          }
          continue;
        }
        // Unit-name restriction (Only for Warpsmiths / Only for Dark Apostles)
        if (!unitFilter(entry.unitName)) {
          items.push({ type: 'error', text: T('valCsmLegacyUnitRestrict', { armory: armoryKey, item: itemName, restriction, unit: entry.unitName }) });
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

  // Votann Hearthfyre Arsenal: "1 free HQ slot per 500pts of game size" (archetype-specific)
  const archetypeHqFree = computeArchetypeHqFreeSlots(state.army, rule, state.pointLimit);
  for (const note of archetypeHqFree.notes) {
    items.push({ type: 'ok', text: note });
  }

  // Sororitas Crusaders: "1 free Elite slot per Preacher" (Crusaders.ods Concession ability)
  const crusadersFree = computeCrusadersFreeSlots(state.army, data);
  for (const note of crusadersFree.notes) {
    items.push({ type: 'ok', text: note });
  }

  // AdMech Servitors: "1 free Elite slot per Magos/Archmagos/Tech-Priest" (servitors.ts' own option_group)
  const servitorFree = computeServitorFreeSlots(state.army, data);
  for (const note of servitorFree.notes) {
    items.push({ type: 'ok', text: note });
  }

  // GSC: "1 free Elite slot per 500pts of game size" for 8 named characters (own ability text each)
  const gscEliteFree = computeGscEliteFreeSlots(state.army, data, state.pointLimit);
  for (const note of gscEliteFree.notes) {
    items.push({ type: 'ok', text: note });
  }

  // Votann Einhyr Champion: "1 free Elite slot per Einhyr Hearthguard" (own ability text)
  const einhyrChampionFree = computeEinhyrChampionFreeSlots(state.army, data);
  for (const note of einhyrChampionFree.notes) {
    items.push({ type: 'ok', text: note });
  }

  // Tyranids Tyrant Guard Brood: "1 free HQ slot per Hive Tyrant/Swarmlord" (own ability text)
  const tyrantGuardFree = computeTyrantGuardFreeSlots(state.army, data);
  for (const note of tyrantGuardFree.notes) {
    items.push({ type: 'ok', text: note });
  }

  // CSM Cultist Firebrand: "1 free Elite slot per Cultists unit" (own ability text)
  const cultistFirebrandFree = computeCultistFirebrandFreeSlots(state.army, data);
  for (const note of cultistFirebrandFree.notes) {
    items.push({ type: 'ok', text: note });
  }

  // IG Commissar: "1 free Elite slot per Infantry-type selection" (own ability text — NOT a
  // per-HQ advisor ratio, see computeCommissarFreeSlots' doc comment)
  const commissarFree = computeCommissarFreeSlots(state.army, data, state);
  for (const note of commissarFree.notes) {
    items.push({ type: 'ok', text: note });
  }

  // T'au Sub-Commander/Ethereal Guard/Kroot Carnivores escorts: wrong-anchor advisor fixes
  const subCommanderFree = computeSubCommanderFreeSlots(state.army, data);
  for (const note of subCommanderFree.notes) {
    items.push({ type: 'ok', text: note });
  }
  const etherealGuardFree = computeEtherealGuardFreeSlots(state.army, data);
  for (const note of etherealGuardFree.notes) {
    items.push({ type: 'ok', text: note });
  }
  const krootEscortFree = computeKrootCarnivoreEscortFreeSlots(state.army, data);
  for (const note of krootEscortFree.notes) {
    items.push({ type: 'ok', text: note });
  }
  const krootShaperFree = computeKrootShaperFreeSlots(state.army, data);
  for (const note of krootShaperFree.notes) {
    items.push({ type: 'ok', text: note });
  }

  // Necrons Plasmacyte: "1 free Elite slot per 500pts of game size" (own ability text)
  const plasmacyteFree = computeNecronPlasmacyteFreeSlots(state.army, data, state.pointLimit);
  for (const note of plasmacyteFree.notes) {
    items.push({ type: 'ok', text: note });
  }

  // Necrons Cryptothralls: "1 free Elite slot per Cryptek" (option_group header rule)
  const cryptothrallsFree = computeCryptothrallsFreeSlots(state.army, data);
  for (const note of cryptothrallsFree.notes) {
    items.push({ type: 'ok', text: note });
  }

  // Necrons Hexmark Destroyer: "1 free Elite slot per Lord/Skorpekh Lord" (Royal Assassin ability)
  const hexmarkFree = computeHexmarkDestroyerFreeSlots(state.army, data);
  for (const note of hexmarkFree.notes) {
    items.push({ type: 'ok', text: note });
  }

  // Eldar Spiritseer: "1 free HQ slot per Wraithblades/Wraithguard/Wraithlord" (own ability text)
  const spiritseerFree = computeSpiritseerFreeSlots(state.army, data);
  for (const note of spiritseerFree.notes) {
    items.push({ type: 'ok', text: note });
  }

  // Necrons Royal Court: Crypteks/Royal Wardens/Lords free HQ when Overlord/Lord present
  const royalCourtFree = computeRoyalCourtFreeSlots(state.army, data);
  for (const note of royalCourtFree.notes) {
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
        text: T('valAssassinSelectionRule', { ruleName }),
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
    // For integrated supplements (HH Legion), count both primary and supplement units toward the primary AOP.
    const rawUsed = getSlotUsage(state.army, data, slot, rule, state.alliedFaction, isIntegratedSuppl ? undefined : false, state.engagement, summoningExcl);
    const slotAdj = slot === 'HQ' ? cdFree.hq + geminaeSuperiaFree.hq + archetypeHqFree.hq + tyrantGuardFree.hq + subCommanderFree.hq + etherealGuardFree.hq + spiritseerFree.hq + royalCourtFree.hq
      : slot === 'Fast Attack' ? cdFree.fa + krootEscortFree.fa
      : slot === 'Heavy Support' ? krootEscortFree.hs
      : slot === 'Elites' ? assassinFree.elites + warlockFree.elites + crusadersFree.elites + servitorFree.elites + gscEliteFree.elites + einhyrChampionFree.elites + cultistFirebrandFree.elites + commissarFree.elites + krootEscortFree.elites + krootShaperFree.elites + plasmacyteFree.elites + cryptothrallsFree.elites + hexmarkFree.elites
      : 0;
    const used = Math.max(0, rawUsed - slotAdj);
    const scaledMin = eng.multiAop ? min * aopMult : min;
    if (scaledMin > 0 && used < scaledMin) {
      items.push({ type: 'error', text: T('valNeedAtLeastSlot', { min: scaledMin, slot, used }) });
    }
  }

  // Troops 25% — archetype may restrict which Troops count (main faction only)
  if (state.army.length > 0 && total > 0) {
    const baseTroopsPts = state.army
      .filter(i => {
        // Exclude true allied units (not integrated supplement) from the 25% Troops calculation
        if (state.alliedFaction && i.factionSource === state.alliedFaction && !isSupplItem(i)) return false;
        const u = resolveUnit(i, data) ?? (isSupplItem(i) && alliedData ? resolveUnit(i, alliedData) : null);
        if (!u) return false;
        if (getEffectiveSlot(i.unitName, i.slot, rule) !== 'Troops') return false;
        return countsTroops(i.unitName, u.locked_mark, rule);
      })
      .reduce((s, i) => {
        const u = resolveUnit(i, data) ?? (isSupplItem(i) && alliedData ? resolveUnit(i, alliedData) : null);
        return s + (u ? computeUnitPoints(i, u, state.archetype) : 0);
      }, 0);
    // Mechanised Company: Dedicated Transports count at 50% toward the Troops 25%
    const transportBonus = state.archetype === 'Mechanised Company'
      ? state.army
          .filter(i => {
            if (state.alliedFaction && i.factionSource === state.alliedFaction && !isSupplItem(i)) return false;
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
        text: T('valTroopsRatioFail', { label, pct: (ratio * 100).toFixed(1), needPts: Math.ceil(total * eng.minTroopsRatio) }),
      });
    } else {
      items.push({ type: 'ok', text: T('valTroopsRatioOk', { label, pct: (ratio * 100).toFixed(1) }) });
    }
  }

  // ── Allied Detachment's OWN archetype composition rules ──────────────────
  // The primary army's archetype validation above (forcedMark, Troops 25%, noLegacy/noTraits)
  // only ever ran against `state.archetype`/`state.army` as a whole, with no equivalent pass for
  // the ally's OWN `state.alliedArchetype` against its own units (`item.factionSource ===
  // state.alliedFaction`) — so picking e.g. Plaguehost as the ALLY's archetype never enforced
  // "all units must carry the Mark of Nurgle" or "only Mark-of-Nurgle units count towards the
  // ally's own 25% Troops requirement" at all. Mirrors the primary checks, scoped to the ally's
  // own sub-army and its own points total (the ally is excluded from the PRIMARY's 25% Troops
  // calculation above, so it needs this separate calculation against its own total, not the
  // combined one). Reported live 2026-06-23.
  // FOLLOW-UP (2026-06-23): added the remaining primary-side archetype rule types this block
  // used to skip — bannedUnits/bannedSlots/allowedUnitsOnly/requiresHqUnit/hqAllowed — mirroring
  // their primary equivalents above 1:1, scoped to `allyItems`/`allyRule` instead of the whole
  // army/primary rule.
  if (state.alliedFaction && state.alliedArchetype) {
    const allyRule = getArchetypeRule(state.alliedArchetype);
    const allyItems = state.army.filter(i => i.factionSource === state.alliedFaction);
    const allyLabel = cleanArchetypeName(state.alliedArchetype);

    if (allyRule) {
      for (const item of allyItems) {
        if (allyRule.bannedUnits.includes(item.unitName)) {
          items.push({ type: 'error', text: T('valAllyArchetypeUnitNotAllowed', { archetype: allyLabel, unit: item.unitName }) });
        }
      }
      if (allyRule.allowedUnitsOnly.length > 0) {
        for (const item of allyItems) {
          if (!allyRule.allowedUnitsOnly.includes(item.unitName)) {
            items.push({ type: 'error', text: T('valAllyArchetypeNotInAllowedList', { archetype: allyLabel, unit: item.unitName }) });
          }
        }
      }
      if (allyRule.bannedSlots.length > 0) {
        for (const item of allyItems) {
          if (allyRule.bannedSlots.includes(item.slot)) {
            items.push({ type: 'error', text: T('valAllyArchetypeSlotNotAllowed', { archetype: allyLabel, slot: item.slot, unit: item.unitName }) });
          }
        }
      }
      if (allyRule.requiresHqUnit) {
        const hasRequiredHq = allyItems.some(item => {
          const effSlot = getEffectiveSlot(item.unitName, item.slot, allyRule);
          return effSlot === 'HQ' && item.unitName.toLowerCase().includes(allyRule.requiresHqUnit!.toLowerCase());
        });
        if (!hasRequiredHq) {
          items.push({ type: 'error', text: T('valAllyArchetypeRequiresHqUnit', { archetype: allyLabel, hqUnit: allyRule.requiresHqUnit }) });
        }
      }
      if (allyRule.hqAllowed.length > 0) {
        for (const item of allyItems) {
          const effSlot = getEffectiveSlot(item.unitName, item.slot, allyRule);
          if (effSlot === 'HQ') {
            const allowed = allyRule.hqAllowed.some(name => item.unitName.toLowerCase().includes(name.toLowerCase()));
            if (!allowed) {
              items.push({ type: 'error', text: T('valAllyArchetypeHqNotAllowed', { archetype: allyLabel, unit: item.unitName, allowed: allyRule.hqAllowed.join(', ') }) });
            }
          }
        }
      }
      if (allyRule.requiresHqUpgrade) {
        const { unitNameContains, choiceName } = allyRule.requiresHqUpgrade;
        const hasRequiredHqUpgrade = allyItems.some(item => {
          const effSlot = getEffectiveSlot(item.unitName, item.slot, allyRule!);
          if (effSlot !== 'HQ' || !item.unitName.toLowerCase().includes(unitNameContains.toLowerCase())) return false;
          if (item.armory.some(a => a.itemName === choiceName)) return true;
          const u = resolveUnit(item, data);
          if (!u) return false;
          return u.option_groups.some((g, gi) => g.choices.some((c, ci) =>
            c.name === choiceName && (item.optionQty?.[gi]?.[ci] ?? 0) > 0,
          ));
        });
        if (!hasRequiredHqUpgrade) {
          items.push({ type: 'error', text: `${allyLabel}: requires an HQ "${unitNameContains}" with the "${choiceName}" upgrade.` });
        }
      }
      if (allyRule.requireVetAbilities) {
        for (const item of allyItems) {
          const u = resolveUnit(item, data);
          if (u && !u.has_veteran_abilities) {
            items.push({ type: 'error', text: T('valAllyArchetypeNoVetAbilities', { archetype: allyLabel, unit: item.unitName }) });
          }
        }
      }
    }

    if (allyRule?.forcedMark) {
      for (const item of allyItems) {
        const u = resolveUnit(item, data);
        if (!u) continue;
        const lockedMark = u.locked_mark;
        const chosenMark = item.mark;
        const hasMarkGroup = u.option_groups.some(g => g.constraint?.type === 'mark');
        if (lockedMark && lockedMark !== allyRule.forcedMark) {
          items.push({
            type: 'error',
            text: T('valAllyArchetypeForcedMarkConflict', { archetype: allyLabel, unit: item.unitName, lockedMark, forcedMark: allyRule.forcedMark }),
          });
        } else if (!lockedMark && chosenMark && chosenMark !== allyRule.forcedMark) {
          items.push({
            type: 'error',
            text: T('valAllyArchetypeForcedMarkConflict', { archetype: allyLabel, unit: item.unitName, lockedMark: chosenMark, forcedMark: allyRule.forcedMark }),
          });
        } else if (!lockedMark && hasMarkGroup && !chosenMark) {
          items.push({
            type: 'warn',
            text: `${allyLabel}: ${item.unitName} must select the Mark of ${allyRule.forcedMark}.`,
          });
        }
      }
    }

    if (allyRule?.noLegacy && state.alliedLegacy) {
      items.push({ type: 'error', text: T('valAllyNoLegacy', { archetype: allyLabel }) });
    }
    if (allyRule?.noTraits && state.alliedTraitPool.length > 0) {
      items.push({ type: 'error', text: T('valAllyNoTraits', { archetype: allyLabel }) });
    }

    if (allyItems.length > 0) {
      const allyTotal = allyItems.reduce((s, i) => {
        const u = resolveUnit(i, data);
        return s + (u ? computeUnitPoints(i, u, state.alliedArchetype) : 0);
      }, 0);
      if (allyTotal > 0) {
        const allyTroopsPts = allyItems
          .filter(i => {
            const u = resolveUnit(i, data);
            if (!u) return false;
            if (getEffectiveSlot(i.unitName, i.slot, allyRule) !== 'Troops') return false;
            return countsTroops(i.unitName, u.locked_mark, allyRule);
          })
          .reduce((s, i) => {
            const u = resolveUnit(i, data);
            return s + (u ? computeUnitPoints(i, u, state.alliedArchetype) : 0);
          }, 0);
        const allyRatio = allyTroopsPts / allyTotal;
        const allyTroopsLabel = (allyRule && allyRule.troopsCount !== 'all')
          ? `Qualifying Troops (${allyRule.troopsCount === 'locked' ? 'locked mark' : allyRule.troopsRemap.join('/')})`
          : 'Troops';
        if (allyRatio < eng.minTroopsRatio) {
          items.push({
            type: 'error',
            text: T('valAllyTroopsRatioFail', { archetype: allyLabel, label: allyTroopsLabel, pct: (allyRatio * 100).toFixed(1), needPts: Math.ceil(allyTotal * eng.minTroopsRatio) }),
          });
        } else {
          items.push({ type: 'ok', text: T('valAllyTroopsRatioOk', { archetype: allyLabel, label: allyTroopsLabel, pct: (allyRatio * 100).toFixed(1) }) });
        }
      }
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
      items.push({ type: 'error', text: T('valSkirmishUniqueLimit', { count: totalUnique, names }) });
    }

    for (const item of state.army) {
      const u = resolveUnit(item, data);
      if (!u) continue;
      const pts = computeUnitPoints(item, u, effectiveArchetypeFor(item, state));
      const effSlot = getEffectiveSlot(item.unitName, item.slot, effectiveRuleFor(item, state));
      if (effSlot === 'HQ' && pts > 150) {
        items.push({ type: 'error', text: T('valSkirmishHqExceeds', { unit: item.unitName, pts }) });
      }
      if (effSlot !== 'Troops' && pts > 300) {
        items.push({ type: 'error', text: T('valSkirmishUnitExceeds', { unit: item.unitName, pts }) });
      }
      if (u.is_squadron && item.size > 1) {
        items.push({ type: 'error', text: T('valSkirmishSquadronMax', { unit: item.unitName, size: item.size }) });
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
          items.push({ type: 'error', text: T('valSkirmishCombinedArmour', { unit: item.unitName, combined, front: vStats.FRONT, side: vStats.SIDE, rear: vStats.REAR }) });
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
          items.push({ type: 'error', text: T('valSkirmishArmourSaveGain', { unit: item.unitName, culprit: culprit?.itemName ?? 'equipment' }) });
        }

        // 4+ or better invuln save gained from equipment
        if (mods.invulnSave !== null && mods.invulnSave <= 4) {
          const culprit = item.armory.find(a => {
            const ai = findArmoryItem(data, a);
            return ai?.desc && /(\d)\+\s+invulnerable/i.test(ai.desc ?? '') &&
              parseInt((ai.desc.match(/(\d)\+\s+invulnerable/i)?.[1] ?? '9')) <= 4;
          });
          items.push({ type: 'error', text: T('valSkirmishInvSaveGain', { unit: item.unitName, culprit: culprit?.itemName ?? 'equipment' }) });
        }

        // Toughness 8+ from equipment delta
        const baseT = parseInt(String(u.models[0]?.stats?.T ?? '0'));
        const gainedT = mods.statDeltas['T'] ?? 0;
        if (baseT > 0 && baseT + gainedT >= 8) {
          items.push({ type: 'error', text: T('valSkirmishToughnessGain', { unit: item.unitName, t: baseT + gainedT }) });
        }

        // Weapon Damage 3+ from any bought weapon item
        for (const sel of item.armory.filter(a => a.section === 'weapons')) {
          const ai = findArmoryItem(data, sel);
          if (!ai) continue;
          const checkD = (d: string | undefined) => d && parseInt(d) >= 3;
          if (checkD(ai.d) || (ai.profiles ?? []).some(p => checkD(p.d))) {
            items.push({ type: 'error', text: T('valSkirmishDamageGain', { unit: item.unitName, item: sel.itemName }) });
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
            text: T('valPerNExceeded', { unit: item.unitName, header: g.header.substring(0, 50), used, max, size: item.size }),
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
            text: T('valFixedMaxExceeded', { unit: item.unitName, header: g.header.substring(0, 50), used, max: g.constraint.max ?? 0 }),
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
        text: T('valDisjointSquadSize', { unit: item.unitName, min: u!.models[0].min, squadMin, max: u!.models[0].max, size: item.size }),
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
          text: T('valRatioPerNExceeded', { unit: item.unitName, model: m.name, ratioPerN: m.ratio_per_n, ratioOf: m.ratio_of, have, max: ratioMax, primaryCount }),
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
          text: T('valCrossGroupPoolExceeded', { unit: item.unitName, used, weapon: g.replaces![0], pool: poolSize }),
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
      const effSlot = applyVariantSlotOverride(i, u ?? undefined, getEffectiveSlot(i.unitName, i.slot, effectiveRuleFor(i, state)));
      return effSlot === 'Lords of War';
    });
    if (lowUnits.length > 0) {
      if (state.engagement !== 'epic') {
        items.push({
          type: 'error',
          text: T('valLowEpicOnly', { count: lowUnits.length }),
        });
      } else {
        const lowPts = lowUnits.reduce((s, i) => {
          const u = resolveUnit(i, data);
          return s + (u ? computeUnitPoints(i, u, effectiveArchetypeFor(i, state)) : 0);
        }, 0);
        const cap = Math.floor(total * 0.33);
        if (lowPts > cap) {
          items.push({
            type: 'error',
            text: T('valLowExceeds33', { pts: lowPts, cap }),
          });
        } else {
          items.push({
            type: 'ok',
            text: T('valLowOk', { pts: lowPts, cap }),
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
            text: T('valPlatoonLinkedCount', { pcs: `${pcs.unitName} (${pcs.customName ?? pcs.id.slice(0, 6)})`, count: linkedCount, member: memberName, min, max }),
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
    const rawUsed = getSlotUsage(state.army, data, slot, rule, state.alliedFaction, isIntegratedSuppl ? undefined : false, state.engagement, summoningExcl);
    const slotAdj = slot === 'HQ' ? cdFree.hq + geminaeSuperiaFree.hq + archetypeHqFree.hq + tyrantGuardFree.hq + subCommanderFree.hq + etherealGuardFree.hq + spiritseerFree.hq + royalCourtFree.hq
      : slot === 'Fast Attack' ? cdFree.fa + krootEscortFree.fa
      : slot === 'Heavy Support' ? krootEscortFree.hs
      : slot === 'Elites' ? assassinFree.elites + warlockFree.elites + crusadersFree.elites + servitorFree.elites + gscEliteFree.elites + einhyrChampionFree.elites + cultistFirebrandFree.elites + commissarFree.elites + krootEscortFree.elites + krootShaperFree.elites + plasmacyteFree.elites + cryptothrallsFree.elites + hexmarkFree.elites
      : 0;
    const used = Math.max(0, rawUsed - slotAdj);
    // Dedicated Transport's Pitched/Epic cap is dynamic ("1 per Infantry-type selection"), not
    // the flat eng.aop value (Skirmish's flat "0-1" is correct as-is and untouched).
    const rawEffMax = (slot === 'Dedicated Transport' && (state.engagement === 'pitched' || state.engagement === 'epic'))
      ? countInfantrySelections(state, data, false)
      : (slot === 'HQ' && rule?.hqOverride)
        ? engMax
        : (eng.multiAop ? engMax * aopMult : engMax);
    const effMax = (rule?.slotCapOverride?.slot === slot) ? Math.min(rawEffMax, rule.slotCapOverride.max) : rawEffMax;
    if (used > effMax) {
      items.push({ type: 'error', text: T('valSlotOverMax', { slot, used, max: effMax }) });
    }
  }
  if (eng.multiAop && aopMult > 1) {
    items.push({ type: 'ok', text: T('valUsingAops', { n: aopMult }) });
  }

  // Allied detachment AOP validation — skip for integrated supplements (HH Legion); their units
  // are already counted in the primary AOP block above.
  if (state.alliedFaction && !isIntegratedSuppl) {
    const alliedUnits = state.army.filter(e => e.factionSource === state.alliedFaction);
    if (alliedUnits.length > 0) {
      // The ALLY's own archetype rule (e.g. a troopsRemap-style slot effect) governs how its OWN
      // units' slots resolve here, never the primary's `rule` — getSlotUsage's getEffectiveSlot
      // call needs the matching rule for whichever side it's counting.
      const allyRuleForAop = getArchetypeRule(state.alliedArchetype);
      for (const slot of SLOT_ORDER) {
        const [min, max] = ALLIED_AOP[slot];
        const used = getSlotUsage(state.army, data, slot, allyRuleForAop, state.alliedFaction, true, state.engagement);
        if (min > 0 && used < min) {
          items.push({ type: 'error', text: T('valAlliedNeedAtLeast', { min, slot, used }) });
        }
        if (slot === 'Dedicated Transport') {
          const alliedMax = countInfantrySelections(state, data, true);
          if (used > alliedMax) {
            items.push({ type: 'error', text: T('valAlliedTransportOverMax', { used, max: alliedMax }) });
          }
        } else if (max === 0 && used > 0) {
          items.push({ type: 'error', text: T('valAlliedSlotNotAllowed', { slot, used }) });
        } else if (max > 0 && used > max) {
          items.push({ type: 'error', text: T('valAlliedSlotOverMax', { slot, used, max }) });
        }
      }
      // Elites / Fast Attack / Heavy Support limited to 1 each, but +1 per Troop unit beyond 1
      const alliedTroops = getSlotUsage(state.army, data, 'Troops', allyRuleForAop, state.alliedFaction, true, state.engagement);
      for (const slot of ['Elites', 'Fast Attack', 'Heavy Support'] as const) {
        const used = getSlotUsage(state.army, data, slot, allyRuleForAop, state.alliedFaction, true, state.engagement);
        if (used > alliedTroops) {
          items.push({ type: 'error', text: T('valAlliedRatioExceedsTroops', { slot, used, troops: alliedTroops }) });
        }
      }
    }
  }

  // Animosity / mark checks — skipped for Black Crusade (it has its own 4-mark validation above).
  // Animosity of the Gods is a CSM/CD-only mechanic (it only exists where `data.animosity` is
  // populated) — this used to run unconditionally against EVERY army's `data.animosity` (empty
  // `{}` for any other faction), which made `allowedMarks` return `[]` and falsely flag every
  // unit with a mark as "not allowed" — including Imperial Guard's Traitor Guard archetype, which
  // legitimately grants its own units a Mark of Chaos with no Animosity restriction at all (it's
  // purely a cost/ability mechanic for IG, never gated by the rivalry table). Guard on the table
  // actually existing before running this PRIMARY-scoped pass, restricted to primary-scope units.
  if (!rule?.noAnimosity && !blackCrusadeActive && Object.keys(data.animosity).length > 0) {
    const allowed = allowedMarksFor(state.hqMark, data);
    for (const item of state.army) {
      if (item.factionSource) continue;
      if (item.mark && !allowed.includes(item.mark)) {
        items.push({
          type: 'error',
          text: T('valMarkNotAllowedHq', { unit: item.unitName, mark: item.mark, hqMark: state.hqMark }),
        });
      }
      const u = resolveUnit(item, data);
      if (u?.locked_mark && !allowed.includes(u.locked_mark)) {
        if (!rule?.requireForcedMarkOnly) {
          items.push({
            type: 'error',
            text: T('valLockedMarkIncompatibleHq', { unit: item.unitName, mark: u.locked_mark, hqMark: state.hqMark }),
          });
        }
      }
    }
  }

  // Same check, scoped to the Allied Detachment's OWN units against ITS OWN army mark — only
  // meaningful when the ally's own faction is CSM/CD (has its own animosity table). An Allied
  // Detachment with Black Crusade isn't a thing (that trait is primary-archetype-only), so no
  // equivalent exemption is needed here.
  if (state.alliedFaction && alliedData && Object.keys(alliedData.animosity).length > 0) {
    const allyRuleForAnimosity = getArchetypeRule(state.alliedArchetype);
    if (!allyRuleForAnimosity?.noAnimosity) {
      const allyAllowed = allowedMarksFor(state.alliedHqMark ?? 'Undivided', alliedData);
      for (const item of state.army) {
        if (item.factionSource !== state.alliedFaction) continue;
        if (item.mark && !allyAllowed.includes(item.mark)) {
          items.push({
            type: 'error',
            text: T('valMarkNotAllowedAllyHq', { unit: item.unitName, mark: item.mark, hqMark: state.alliedHqMark ?? 'Undivided' }),
          });
        }
        const u = resolveUnit(item, data);
        if (u?.locked_mark && !allyAllowed.includes(u.locked_mark) && !allyRuleForAnimosity?.requireForcedMarkOnly) {
          items.push({
            type: 'error',
            text: T('valLockedMarkIncompatibleAllyHq', { unit: item.unitName, mark: u.locked_mark, hqMark: state.alliedHqMark ?? 'Undivided' }),
          });
        }
      }
    }
  }

  // Army trait limit (max 2)
  if (state.traitPool.length > 2) {
    items.push({ type: 'error', text: T('valOnlyTwoTraits', { count: state.traitPool.length }) });
  }

  // veteran_required: unit must have at least 1 veteran ability bought from the armory
  for (const item of state.army) {
    const u = resolveUnit(item, data);
    if (u?.veteran_required) {
      const hasVetItem = item.armory.some(sel => findArmoryItem(data, sel)?.category === 'veteran');
      if (!hasVetItem) {
        items.push({ type: 'error', text: T('valVeteranRequired', { unit: item.unitName }) });
      }
    }
  }

  // Legacy mark restriction (Hydra, Iron Lord, Night Haunter = Undivided only)
  const undividedLegacies = ['Legacy of the Hydra', 'Legacy of the Iron Lord', 'Legacy of the Night Haunter'];
  const legacies = [state.legacy, state.legacy2].filter(Boolean);
  const hasUndividedLegacy = legacies.some(l => undividedLegacies.includes(l));
  if (hasUndividedLegacy) {
    for (const item of state.army) {
      if (item.factionSource) continue; // allied units are not subject to the primary army's legacy mark restriction
      const u = resolveUnit(item, data);
      const m = u?.locked_mark ?? item.mark;
      if (m && m !== 'Undivided') {
        const restrictingLegacy = legacies.find(l => undividedLegacies.includes(l));
        items.push({
          type: 'error',
          text: T('valUndividedLegacyRestriction', { legacy: restrictingLegacy!, unit: item.unitName, mark: m }),
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
    items.push({ type: 'error', text: T('valSkirmishNoArchetypes') });
  }
  if (state.engagement === 'skirmish' && state.alliedFaction) {
    items.push({ type: 'error', text: T('valSkirmishNoAllies') });
  }

  // ── F1: Psychic discipline-scope validation ───────────────────────────────
  // Guards against pasted/imported JSON with powers on non-psykers or from
  // disciplines the unit cannot access (scope mirrors PsychicModal filtering).
  for (const entry of state.army) {
    if (!entry.powers.length) continue;
    const isAlliedEntry = !!entry.factionSource;
    const entryData = isAlliedEntry ? (alliedData ?? data) : data;
    const entryArchetype = isAlliedEntry ? (state.alliedArchetype ?? '') : state.archetype;
    const entryLegacy  = isAlliedEntry ? (state.alliedLegacy ?? '') : state.legacy;
    const entryLegacy2 = isAlliedEntry ? '' : state.legacy2;

    const u = resolveUnit(entry, entryData);
    if (!u) continue;

    if (!u.is_psyker) {
      items.push({ type: 'error', text: `${entry.unitName}: has psychic powers selected but is not a psyker.` });
      continue;
    }

    const allowedKeys = _getAllowedDiscKeys(u, entry, entryData, entryArchetype, entryLegacy, entryLegacy2);
    for (const pw of entry.powers) {
      if (!allowedKeys.has(pw.disciplineName)) {
        items.push({
          type: 'error',
          text: pw.powerName === '__discipline__'
            ? `${entry.unitName}: discipline "${pw.disciplineName}" is not available to this unit.`
            : `${entry.unitName}: power "${pw.powerName}" (discipline "${pw.disciplineName}") is not available to this unit.`,
        });
      }
    }
  }

  // ── Faction-specific validators ──────────────────────────────────────────
  if (state.faction === 'Space Marines') {
    items.push(...validateSpaceMarines(state, data, language));
  }
  if (state.faction === 'Dark Eldar') {
    items.push(...validateDarkEldar(state, data, language));
  }

  if (items.length === 0) items.push({ type: 'ok', text: T('valArmyValid') });
  return items;
}

export { getSlotUsage, allowedMarksFor, countInfantrySelections };
