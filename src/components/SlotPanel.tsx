import { Fragment, useState } from 'react';
import { useArmyStore } from '../store/army';
import { SLOT_ORDER, ENGAGEMENTS, ALLIED_AOP } from '../engine/engagements';
import { getArchetypeRule, getEffectiveSlot, isUnitAllowed, getEffectiveHqLimits } from '../engine/archetypes';
import { applyVariantSlotOverride } from '../engine/slotOverrides';
import { applyPlatoonSlotOverride, countsTowardOwnSlot } from '../engine/codex_imperial_guard/platoon';
import { lowMoveEmbarkBlockReason } from '../engine/transportGate';
import { computeCdFreeSlots, computeAssassinFreeSlots, computeGeminaeSuperiaFreeSlots, computeCrusadersFreeSlots, computeServitorFreeSlots, computeArchetypeHqFreeSlots, computeGscEliteFreeSlots, computeEinhyrChampionFreeSlots, computeTyrantGuardFreeSlots, computeCultistFirebrandFreeSlots, computeCommissarFreeSlots, computeSubCommanderFreeSlots, computeEtherealGuardFreeSlots, computeKrootCarnivoreEscortFreeSlots, computeKrootShaperFreeSlots, computeNecronPlasmacyteFreeSlots, computeSpiritseerFreeSlots, computeEldarWarlockFreeSlots, ctanShardCapBlockReason, engagementGateBlockReason, countInfantrySelections, advisorExemptIds } from '../engine/validators';
import { isArmyItemGateBlocked, getAssassinAccessAlignment, assassinAccessGroupLabel, inquisitionLegacyOrdoUnlocks, chamberMilitantOrdo } from '../engine/keywords';
import type { FactionData } from '../types/data';
import type { RosterEntry } from '../types/army';
import { SLOT_ICONS } from '../assets/slotIcons';
import { useT, type TranslationKey } from '../i18n';

const SLOT_LABEL_KEY: Record<string, TranslationKey> = {
  'HQ': 'hq', 'Troops': 'troops', 'Elites': 'elites', 'Fast Attack': 'fastAttack',
  'Heavy Support': 'heavySupport', 'Dedicated Transport': 'transport',
  'Fortifications': 'fortifications', 'Flyers': 'flyers', 'Lords of War': 'lordsOfWar',
};

interface SlotEntry {
  name: string;
  factionSource?: string;
  /**
   * True when the unit is injected by the active archetype (e.g. Horus Heresy via Legion,
   * daemons via Daemonkin/Plaguehost/cult archetypes). These are OWN units of the army, not
   * an allied detachment — they share the AOP and carry no "[Allied]" badge. Distinguishes
   * rule.alliedFaction injection from a true allied source (base_allied / manual detachment).
   */
  injected?: boolean;
  /**
   * Optional sub-section label rendered as a header above this entry when it differs from
   * the previous entry's label (e.g. "Cults Abominatioe"/"Execution Force" grouping the
   * Assassins inside Elites — see getAssassinAccessAlignment). Mirrors how every other
   * unit's special rules display: a visible, named group, not a generic [Allied]-style badge.
   */
  groupLabel?: string;
  minCost: number;
  /** Set when this unit can never be added under the active archetype (e.g. Movement <12" with
   * no transport option) — rendered greyed-out with this text as a tooltip instead of removed,
   * so the player can see *why* it's blocked (rules-owner: "grey it out... mouse over tooltip"). */
  disabledReason?: string;
}

function getSlotUsage(
  army: RosterEntry[],
  data: FactionData,
  slot: string,
  rule: ReturnType<typeof getArchetypeRule>,
  alliedFaction?: string | null,
): number {
  // See validators.ts's advisorExemptIds doc comment: only the first N copies of an advisor
  // unit (N = HQ selections in the same scope) are exempt from slot occupancy, not every copy.
  const exemptIds = advisorExemptIds(army, data, rule, alliedFaction ?? undefined);
  return army.filter(i => {
    // Bug 4: exclude allied units from the main faction slot count
    if (alliedFaction && i.factionSource === alliedFaction) return false;
    if (exemptIds.has(i.id)) return false;
    const u = i.factionSource
      ? data.allied?.[i.factionSource]?.units[i.unitName]
      : data.units[i.unitName];
    const baseSlot = applyVariantSlotOverride(i, u ?? undefined, getEffectiveSlot(i.unitName, i.slot, rule));
    const effSlot = applyPlatoonSlotOverride(i, army, baseSlot);
    if (effSlot !== slot) return false;
    return countsTowardOwnSlot(i, army);
  }).length;
}

/** Mirrors the validator's AOP multiplier so the slot panel shows correct limits. */
function computeAopMult(
  army: RosterEntry[],
  data: FactionData,
  aop: Record<string, [number, number]>,
  multiAop: boolean,
  rule: ReturnType<typeof getArchetypeRule>,
  alliedFaction?: string | null,
): number {
  if (!multiAop) return 1;
  let aops = 1;
  for (const slot of SLOT_ORDER) {
    if (slot === 'HQ') continue;
    const max = aop[slot][1];
    if (max <= 0) continue;
    const used = getSlotUsage(army, data, slot, rule, alliedFaction);
    if (used > max) aops = Math.max(aops, Math.ceil(used / max));
  }
  return aops;
}

/**
 * Shared unit catalogue for BOTH the primary army and an Allied Detachment —
 * `scope="allied"` reads from `data.allied[alliedFactionKey]` instead of `data` directly, uses
 * the ally's OWN archetype (alliedArchetype) for slot remap/nested-ally injection, and the fixed
 * ALLIED_AOP instead of the engagement's AOP (Core Rules L1834: allies get their own catalogue
 * and AOP, sharing only the point limit). The ally's OWN `base_allied` grant and the Assassins
 * universal grant DO carry over (the ally is its own faction with its own always-on rules,
 * independent of which archetype it picked) — but the PRIMARY-only mechanics below (Chamber
 * Militant, legacy-granted factions, CD/Assassin free-slot adjustments, multi-AOP scaling) are
 * genuinely primary-army-only concepts and stay skipped for the allied-detachment scope.
 */
export function SlotPanel({ scope = 'primary', alliedFactionKey }: { scope?: 'primary' | 'allied'; alliedFactionKey?: string }) {
  const store = useArmyStore();
  const isAllied = scope === 'allied';
  const { army, engagement, hqMark, addUnit, alliedFaction, legacy, legacy2 } = store;
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const t = useT();

  const data = isAllied ? store.data?.allied?.[alliedFactionKey!] : store.data;
  const archetype = (isAllied ? store.alliedArchetype : store.archetype) ?? '';

  if (!data) return null;
  if (isAllied && !Object.keys(data.units).length) {
    return <div className="text-[11px] text-zinc-700 px-1 py-1.5 italic">{t('noUnitsAvailable')}</div>;
  }
  const eng = ENGAGEMENTS[engagement];
  const rule = getArchetypeRule(archetype);

  if (isAllied) {
    // Allied scope: the ally's own nested-ally injection (e.g. CSM "Plaguehost" granting Chaos
    // Daemons units), its own base_allied grant, and the Assassins universal grant all apply —
    // none of the genuinely primary-only mechanics (Chamber Militant, legacy-granted factions,
    // CD/Assassin free-slot adjustments, multi-AOP scaling).
    const effectiveSlotUnits: Record<string, SlotEntry[]> = {};
    for (const slot of SLOT_ORDER) effectiveSlotUnits[slot] = [];
    for (const [originalSlot, names] of Object.entries(data.slot_to_units)) {
      for (const name of names) {
        const u = data.units[name];
        if (!u) continue;
        if (!isUnitAllowed(name, u, rule, originalSlot)) continue;
        const effSlot = getEffectiveSlot(name, originalSlot, rule);
        if (effectiveSlotUnits[effSlot]) {
          const disabledReason = lowMoveEmbarkBlockReason(u, rule) ?? engagementGateBlockReason(u, engagement) ?? undefined;
          effectiveSlotUnits[effSlot].push({ name, minCost: u.min_cost, disabledReason });
        }
      }
    }
    if (rule?.alliedFaction && data.allied?.[rule.alliedFaction]) {
      const nestedData = data.allied[rule.alliedFaction];
      for (const [originalSlot, names] of Object.entries(nestedData.slot_to_units)) {
        for (const name of names) {
          const u = nestedData.units[name];
          if (!u) continue;
          if (rule.alliedUnitsOnly && rule.alliedUnitsOnly.length > 0 && !rule.alliedUnitsOnly.includes(name)) continue;
          if (rule.alliedMarkFilter === 'forced') {
            if (!u.locked_mark || u.locked_mark !== rule.forcedMark) continue;
          }
          const effSlot = getEffectiveSlot(name, originalSlot, rule);
          if (effectiveSlotUnits[effSlot]) {
            effectiveSlotUnits[effSlot].push({ name, factionSource: rule.alliedFaction, injected: true, minCost: u.min_cost });
          }
        }
      }
    }

    // The ally's own base_allied grant (e.g. Grey Knights + Inquisition) — always available
    // regardless of the ally's own archetype, same as the primary-scope version below.
    for (const baseKey of data.base_allied ?? []) {
      if (rule?.alliedFaction === baseKey) continue; // already handled above
      const baseData = data.allied?.[baseKey];
      if (!baseData) continue;
      for (const [originalSlot, names] of Object.entries(baseData.slot_to_units)) {
        for (const name of names) {
          const u = baseData.units[name];
          if (!u) continue;
          const effSlot = getEffectiveSlot(name, originalSlot, rule);
          if (effectiveSlotUnits[effSlot]) {
            effectiveSlotUnits[effSlot].push({ name, factionSource: baseKey, minCost: u.min_cost });
          }
        }
      }
    }

    // Assassins' OWN universal grant, same as the primary-scope version below — applies when
    // the ALLY's own faction is Chaos or Imperial (e.g. an allied Grey Knights detachment also
    // gets the "Execution Force" Assassin access).
    const allyAssassinAlignment = data.faction ? getAssassinAccessAlignment(data.faction) : null;
    if (allyAssassinAlignment && data.allied?.['assassins']) {
      const adata = data.allied['assassins'];
      const groupLabel = assassinAccessGroupLabel(allyAssassinAlignment);
      for (const name of adata.slot_to_units['Elites'] ?? []) {
        const u = adata.units[name];
        if (!u) continue;
        const effSlot = getEffectiveSlot(name, 'Elites', rule);
        if (effectiveSlotUnits[effSlot]) {
          effectiveSlotUnits[effSlot].push({ name, factionSource: 'assassins', injected: true, groupLabel, minCost: u.min_cost });
        }
      }
    }

    return (
      <div className="divide-y divide-zinc-800/50">
        {SLOT_ORDER.map(slot => {
          const [min, max] = ALLIED_AOP[slot];
          const units = effectiveSlotUnits[slot] ?? [];
          if (max === 0 && units.length === 0) return null;

          const used = army.filter(e => {
            if (e.factionSource !== alliedFactionKey) return false;
            return getEffectiveSlot(e.unitName, e.slot, rule) === slot;
          }).length;
          // Core Rules L1831: Allied Detachment AOP is "0-ᵀ Transports" — always dynamic
          // (one per Infantry-type selection), never the ALLIED_AOP placeholder's flat 3.
          const effectiveMax = slot === 'Dedicated Transport'
            ? countInfantrySelections(store, store.data as FactionData, true)
            : max;
          const isFull = effectiveMax > 0 && used >= effectiveMax;
          const isUnder = min > 0 && used < min;
          const countColor = isFull ? 'text-red-400' : isUnder ? 'text-amber-400' : 'text-zinc-400';

          return (
            <div key={slot} className="border-b border-zinc-800/70 last:border-b-0">
              <button
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-zinc-800/50 transition-colors"
                onClick={() => setOpen(o => ({ ...o, [slot]: !o[slot] }))}
              >
                {SLOT_ICONS[slot] && (
                  <img src={SLOT_ICONS[slot]} alt="" className="w-4 h-4 shrink-0"
                    style={{ filter: 'brightness(0) invert(1)', opacity: 0.5 }} />
                )}
                <span className="font-cinzel text-[10px] uppercase tracking-widest text-emerald-500/80 flex-1 text-left">
                  {t(SLOT_LABEL_KEY[slot] ?? 'hq')}
                </span>
                <span className={`text-[11px] tabular-nums ${countColor}`}>
                  {used}<span className="text-zinc-600">/{effectiveMax > 0 ? effectiveMax : '—'}</span>
                </span>
                <span className="text-zinc-700 text-[10px] ml-1.5">{open[slot] ? '▲' : '▼'}</span>
              </button>

              {open[slot] && (
                <div className="border-t border-zinc-800/60">
                  {units.length === 0 ? (
                    <div className="text-[11px] text-zinc-700 px-4 py-1.5 italic">{t('noUnitsAvailable')}</div>
                  ) : (
                    units.map((entry: SlotEntry) => {
                      const isNested = !!entry.factionSource;
                      const originalSlot = isNested
                        ? data.allied?.[entry.factionSource!]?.units[entry.name]?.slot ?? slot
                        : data.units[entry.name]?.slot ?? slot;
                      return (
                        <button
                          key={`${entry.factionSource ?? 'base'}::${entry.name}`}
                          onClick={() => addUnit(entry.name, originalSlot, alliedFactionKey, isNested ? entry.factionSource : undefined)}
                          disabled={isFull}
                          className={`w-full flex items-center gap-2 px-3 py-1.5 border-b border-zinc-800/40 last:border-b-0 transition-colors text-left ${
                            isFull ? 'opacity-40 cursor-not-allowed' : 'hover:bg-emerald-900/10 group'
                          }`}
                        >
                          <span className="text-[11px] text-emerald-900 group-hover:text-emerald-500 transition-colors w-3 shrink-0 text-center">+</span>
                          <span className="text-zinc-300 group-hover:text-emerald-300 text-[12px] flex-1 transition-colors">{entry.name}</span>
                          <span className="text-zinc-500 group-hover:text-emerald-700/70 text-[11px] tabular-nums transition-colors">{entry.minCost ?? '?'} pts</span>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  const primaryData = data as FactionData;

  // "Chamber Militant" (GK/Sororitas/SM, 2026-06-14 .ods Army Customisation): the army gains
  // Inquisition as its own units (no [Allied] badge) plus a fixed Ordo Legacy-equivalent
  // Armory unlock, independent of the army's own selected Legacy. See chamberMilitantOrdo().
  const chamberMilitantOrdoName = chamberMilitantOrdo(primaryData.faction, archetype);

  // A Legacy can grant the army its own units of another faction (e.g. Legacy of the Alien
  // Hunters → Inquisition), and some factions grant this via the "Chamber Militant" archetype
  // (e.g. GK/Sororitas/SM → Inquisition, "as if they were part of their own army"). Both share
  // the same own-army injection path (no [Allied] badge, shares AOP/slots) — mirrors
  // rule.alliedFaction injection.
  const legacyGrantedFaction = [legacy, legacy2]
    .map(name => primaryData.legacies.find(l => l.name === name)?.grants_faction)
    .find((k): k is string => !!k && k !== rule?.alliedFaction);
  const ownGrantedFaction = legacyGrantedFaction
    ?? (primaryData.intrinsic_allies ?? []).find(k => k !== rule?.alliedFaction)
    ?? (chamberMilitantOrdoName ? 'inquisition' : undefined);

  // Flattened item names across the WHOLE roster — backs the army-wide item gate
  // (ArmoryItem.requires_army_item): e.g. picking "Ordo Xenos" on any Inquisitor unlocks the
  // gated Ordo Xenos armory items for the army. Mirrors ArmoryModal's rosterArmoryItemNames.
  // Plus any "Ordo X" names unlocked by the selected Army Customisation Legacy (Inquisition),
  // or by the "Chamber Militant" archetype's fixed Ordo Legacy-equivalent unlock.
  // (v0.66: no Unit carries requires_army_item anymore — "Henchman Warband" replaced the
  // Ordo-gated Warbands and is available to any Inquisitor.)
  const rosterArmoryItemNames = [
    ...army.flatMap(e => e.armory.map(a => a.itemName)),
    ...inquisitionLegacyOrdoUnlocks(legacy),
    ...(chamberMilitantOrdoName ? inquisitionLegacyOrdoUnlocks(chamberMilitantOrdoName) : []),
  ];

  // Build effective slot→units map: filter banned units, remap slots
  const effectiveSlotUnits: Record<string, SlotEntry[]> = {};
  for (const slot of SLOT_ORDER) effectiveSlotUnits[slot] = [];

  // Primary faction units
  for (const [originalSlot, names] of Object.entries(primaryData.slot_to_units)) {
    for (const name of names) {
      const u = primaryData.units[name];
      if (!u) continue;
      if (!isUnitAllowed(name, u, rule, originalSlot)) continue;
      if (isArmyItemGateBlocked(u, rosterArmoryItemNames)) continue;
      const effSlot = getEffectiveSlot(name, originalSlot, rule);
      if (effectiveSlotUnits[effSlot]) {
        const disabledReason = lowMoveEmbarkBlockReason(u, rule) ?? ctanShardCapBlockReason(name, primaryData.faction, army) ?? engagementGateBlockReason(u, engagement) ?? undefined;
        effectiveSlotUnits[effSlot].push({ name, minCost: u.min_cost, disabledReason });
      }
    }
  }

  // Allied faction units (unlocked by archetype)
  if (rule?.alliedFaction && primaryData.allied?.[rule.alliedFaction]) {
    const alliedData = primaryData.allied[rule.alliedFaction];
    for (const [originalSlot, names] of Object.entries(alliedData.slot_to_units)) {
      for (const name of names) {
        const u = alliedData.units[name];
        if (!u) continue;
        if (rule.alliedUnitsOnly && rule.alliedUnitsOnly.length > 0 && !rule.alliedUnitsOnly.includes(name)) continue;

        if (rule.alliedMarkFilter === 'forced') {
          if (!u.locked_mark || u.locked_mark !== rule.forcedMark) continue;
        } else if (rule.alliedMarkFilter === 'hq_mark') {
          if (u.locked_mark && u.locked_mark !== hqMark) continue;
        }

        const effSlot = getEffectiveSlot(name, originalSlot, rule);
        if (effectiveSlotUnits[effSlot]) {
          effectiveSlotUnits[effSlot].push({ name, factionSource: rule.alliedFaction, injected: true, minCost: u.min_cost });
        }
      }
    }
  }

  // Own-army granted faction units — via selected Legacy (e.g. Legacy of the Alien Hunters →
  // Inquisition) or always-on intrinsic codex rule (e.g. GK Demon Hunters / Sororitas Witch
  // hunters → Inquisition). Either way: own units, not allied (no [Allied] badge).
  if (ownGrantedFaction && primaryData.allied?.[ownGrantedFaction]) {
    const grantedData = primaryData.allied[ownGrantedFaction];
    for (const [originalSlot, names] of Object.entries(grantedData.slot_to_units)) {
      for (const name of names) {
        const u = grantedData.units[name];
        if (!u) continue;
        const effSlot = getEffectiveSlot(name, originalSlot, rule);
        if (effectiveSlotUnits[effSlot]) {
          effectiveSlotUnits[effSlot].push({ name, factionSource: ownGrantedFaction, injected: true, minCost: u.min_cost });
        }
      }
    }
  }

  // Base allied factions — always available regardless of archetype (e.g. GK + Inquisition)
  for (const alliedKey of primaryData.base_allied ?? []) {
    if (rule?.alliedFaction === alliedKey || ownGrantedFaction === alliedKey) continue; // already handled above
    const alliedData = primaryData.allied?.[alliedKey];
    if (!alliedData) continue;
    for (const [originalSlot, names] of Object.entries(alliedData.slot_to_units)) {
      for (const name of names) {
        const u = alliedData.units[name];
        if (!u) continue;
        const effSlot = getEffectiveSlot(name, originalSlot, rule);
        if (effectiveSlotUnits[effSlot]) {
          effectiveSlotUnits[effSlot].push({ name, factionSource: alliedKey, minCost: u.min_cost });
        }
      }
    }
  }

  // Assassins' OWN universal grant — "Cults Abominatioe" (any Chaos army) / "Execution
  // Force" (any Imperial army), verbatim from data/source/Assassins ENG/Index.html (see
  // getAssassinAccessAlignment for full grounding/citation, confirmed against the user
  // 2026-06-07 — Inquisition counts as Imperial, HH/Escalation supplements do not). Own
  // units (no [Allied] badge), injected into Elites from the single shared catalog
  // `data.allied['assassins']` — NOT copied natively per faction (avoids ~9-faction data
  // duplication; corrects the earlier GK/Sororitas-only native-copy design).
  const assassinAlignment = getAssassinAccessAlignment(primaryData.faction);
  if (assassinAlignment && primaryData.allied?.['assassins']) {
    const adata = primaryData.allied['assassins'];
    const groupLabel = assassinAccessGroupLabel(assassinAlignment);
    for (const name of adata.slot_to_units['Elites'] ?? []) {
      const u = adata.units[name];
      if (!u) continue;
      const effSlot = getEffectiveSlot(name, 'Elites', rule);
      if (effectiveSlotUnits[effSlot]) {
        effectiveSlotUnits[effSlot].push({ name, factionSource: 'assassins', injected: true, groupLabel, minCost: u.min_cost });
      }
    }
  }

  const aopMult = computeAopMult(army, primaryData, eng.aop as unknown as Record<string, [number, number]>, eng.multiAop, rule, alliedFaction);
  const cdFree = computeCdFreeSlots(army, primaryData, rule);
  // "Cults Abominatioe"/"Execution Force": Assassin selection collapses to a single Elite slot
  const assassinFree = computeAssassinFreeSlots(army, primaryData);
  // Same ratio-against-a-sibling-unit shape, mirrored here so the catalogue's slot-full gating
  // matches what validators.ts actually allows (otherwise the picker would show "Elites full"
  // for a unit the validator considers exempt).
  const geminaeSuperiaFree = computeGeminaeSuperiaFreeSlots(army, primaryData);
  const crusadersFree = computeCrusadersFreeSlots(army, primaryData);
  const servitorFree = computeServitorFreeSlots(army, primaryData);
  const archetypeHqFree = computeArchetypeHqFreeSlots(army, rule, store.pointLimit);
  const gscEliteFree = computeGscEliteFreeSlots(army, primaryData, store.pointLimit);
  const einhyrChampionFree = computeEinhyrChampionFreeSlots(army, primaryData);
  const tyrantGuardFree = computeTyrantGuardFreeSlots(army, primaryData);
  const cultistFirebrandFree = computeCultistFirebrandFreeSlots(army, primaryData);
  const commissarFree = computeCommissarFreeSlots(army, primaryData, store);
  const subCommanderFree = computeSubCommanderFreeSlots(army, primaryData);
  const etherealGuardFree = computeEtherealGuardFreeSlots(army, primaryData);
  const krootEscortFree = computeKrootCarnivoreEscortFreeSlots(army, primaryData);
  const krootShaperFree = computeKrootShaperFreeSlots(army, primaryData);
  const plasmacyteFree = computeNecronPlasmacyteFreeSlots(army, primaryData, store.pointLimit);
  const spiritseerFree = computeSpiritseerFreeSlots(army, primaryData);
  const warlockFree = computeEldarWarlockFreeSlots(army, primaryData, store.pointLimit);

  return (
    <div className="divide-y divide-zinc-800/50">
      {SLOT_ORDER.map(slot => {
        const [engMin, engMax] = eng.aop[slot];
        const [min, rawMax] = slot === 'HQ'
          ? getEffectiveHqLimits(rule, eng.aop.HQ)
          : [engMin, engMax];
        // Scale by AOP multiplier (same logic as validators), except HQ with override.
        // Dedicated Transport's Pitched/Epic cap is dynamic ("1 per Infantry-type selection",
        // Custom40k Missions ᵟ footnote) — the flat eng.aop value is just a placeholder for that
        // case; Skirmish's flat "0-1" is the real, non-dynamic cap and stays untouched.
        const rawScaledMax = (slot === 'Dedicated Transport' && (engagement === 'pitched' || engagement === 'epic'))
          ? countInfantrySelections(store, primaryData, false)
          : (slot === 'HQ' && rule?.hqOverride)
            ? rawMax
            : eng.multiAop ? rawMax * aopMult : rawMax;
        const max = (rule?.slotCapOverride?.slot === slot) ? Math.min(rawScaledMax, rule.slotCapOverride.max) : rawScaledMax;

        const units = effectiveSlotUnits[slot] ?? [];
        if (rule?.bannedSlots.includes(slot)) return null;
        if (rawMax === 0 && units.length === 0) return null;
        // Lords of War (Escalation): only in Epic Battle, and only if the faction has any
        if (slot === 'Lords of War' && (engagement !== 'epic' || units.length === 0)) return null;
        const isLordsOfWar = slot === 'Lords of War';

        const slotAdj = slot === 'HQ' ? cdFree.hq + geminaeSuperiaFree.hq + archetypeHqFree.hq + tyrantGuardFree.hq + subCommanderFree.hq + etherealGuardFree.hq + spiritseerFree.hq
          : slot === 'Fast Attack' ? cdFree.fa + krootEscortFree.fa
          : slot === 'Heavy Support' ? krootEscortFree.hs
          : slot === 'Elites' ? assassinFree.elites + warlockFree.elites + crusadersFree.elites + servitorFree.elites + gscEliteFree.elites + einhyrChampionFree.elites + cultistFirebrandFree.elites + commissarFree.elites + krootEscortFree.elites + krootShaperFree.elites + plasmacyteFree.elites
          : 0;
        const used = Math.max(0, getSlotUsage(army, primaryData, slot, rule, alliedFaction) - slotAdj);
        const isFull = used >= max && max > 0;
        const isUnder = used < min;
        const countColor = isFull ? 'text-red-400' : isUnder ? 'text-amber-400' : 'text-zinc-400';

        return (
          <div key={slot} className="border-b border-zinc-800/70 last:border-b-0">
            <button
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-zinc-800/50 transition-colors"
              onClick={() => setOpen(o => ({ ...o, [slot]: !o[slot] }))}
            >
              {SLOT_ICONS[slot] && (
                <img src={SLOT_ICONS[slot]} alt="" className="w-4 h-4 shrink-0"
                  style={{ filter: 'brightness(0) invert(1)', opacity: 0.5 }} />
              )}
              <span className="font-cinzel text-[10px] uppercase tracking-widest text-amber-500/80 flex-1 text-left">
                {t(SLOT_LABEL_KEY[slot] ?? 'hq')}
              </span>
              <span className={`text-[11px] tabular-nums ${countColor}`}>
                {isLordsOfWar
                  ? <>{used} <span className="text-zinc-600 font-normal">≤33%</span></>
                  : <>{used}<span className="text-zinc-600">/{max}</span></>}
              </span>
              <span className="text-zinc-700 text-[10px] ml-1.5">{open[slot] ? '▲' : '▼'}</span>
            </button>

            {open[slot] && (
              <div className="border-t border-zinc-800/60">
                {units.length === 0 ? (
                  <div className="text-[11px] text-zinc-700 px-4 py-1.5 italic">{t('noUnitsAvailable')}</div>
                ) : (
                  units.map((entry: SlotEntry, idx: number) => {
                    const originalSlot = entry.factionSource
                      ? primaryData.allied?.[entry.factionSource]?.units[entry.name]?.slot ?? slot
                      : primaryData.units[entry.name]?.slot ?? slot;
                    const showGroupHeader = !!entry.groupLabel && entry.groupLabel !== units[idx - 1]?.groupLabel;
                    return (
                      <Fragment key={`${entry.factionSource ?? 'csm'}::${entry.name}`}>
                        {showGroupHeader && (
                          <div className="px-4 py-1 text-[10px] uppercase tracking-widest text-amber-800/70 bg-zinc-800/30 border-b border-zinc-800/60">
                            {entry.groupLabel}
                          </div>
                        )}
                        <button
                          onClick={() => !entry.disabledReason && addUnit(entry.name, originalSlot, entry.factionSource)}
                          disabled={!!entry.disabledReason}
                          title={entry.disabledReason}
                          className={`w-full flex items-center gap-2 px-3 py-1.5 border-b border-zinc-800/40 last:border-b-0 transition-colors text-left ${
                            entry.disabledReason ? 'opacity-40 cursor-not-allowed' : 'hover:bg-amber-900/10 group'
                          }`}
                        >
                          <span className="text-[11px] text-amber-900 group-hover:text-amber-500 transition-colors w-3 shrink-0 text-center">+</span>
                          <span className="text-zinc-300 group-hover:text-amber-300 text-[12px] flex-1 transition-colors">{entry.name}</span>
                          {entry.factionSource && !entry.injected && (
                            <span className="text-[10px] text-zinc-600">{t('alliedBadge')}</span>
                          )}
                          <span className="text-zinc-500 group-hover:text-amber-700/70 text-[11px] tabular-nums transition-colors">{entry.minCost ?? '?'} pts</span>
                        </button>
                      </Fragment>
                    );
                  })
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
