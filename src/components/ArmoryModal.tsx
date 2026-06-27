import { useState, useEffect } from 'react';
import type { RosterEntry } from '../types/army';
import type { Unit, ArmoryItem, FactionData } from '../types/data';
import { useArmyStore } from '../store/army';
import { getArchetypeRule } from '../engine/archetypes';
import { isWeaponTrait, isUniqueItem, isUnwieldyItem, isMultipleAllowed, multiplesPerModel, requiresWeaponTarget, isOrkKustomJob } from '../engine/equipMods';
import { findArmoryItem } from '../engine/resolver';
import { getActiveVariant } from '../engine/points';
import { FACTION_LOADERS } from '../data/loaders';
import {
  itemRequiredMark, stripMarkGlyph, isTerminatorArmourName,
  modelRestrictsToTermSubset, modelRestrictsToGravisSubset, isItemMarkBlocked,
  effectiveKeywords, isItemRequirementsBlocked, isArmyItemGateBlocked,
  isItemTermCompat, isItemGravisCompat, inquisitionLegacyOrdoUnlocks, chamberMilitantOrdo,
} from '../engine/keywords';

// "Authority of the Inquisition" (Inquisition Index special rule, ki-inquisition-authority-
// unenforced-01): every model with Armory access may select a single item from any Imperial
// faction's general Armory. Rules-owner clarification 2026-06-22: "Imperial" here = these 6
// factions (Assassins also count per the rule's letter, but have no Armory of their own, so
// there's nothing to browse — omitted from the picker as moot).
const IMPERIAL_AUTHORITY_FACTIONS: { key: string; label: string }[] = [
  { key: 'adeptus_custodes',   label: 'Adeptus Custodes' },
  { key: 'adeptus_mechanicus', label: 'Adeptus Mechanicus' },
  { key: 'adeptus_sororitas',  label: 'Adeptus Sororitas' },
  { key: 'grey_knights',       label: 'Grey Knights' },
  { key: 'imperial_guard',     label: 'Imperial Guard' },
  { key: 'space_marines',      label: 'Space Marines' },
];
const AUTHORITY_SOURCE = 'Authority of the Inquisition';

/**
 * Eldar "Paragon of war" (general armory, p_char-only — ki-eldar-paragon-of-war-partial-stats-01):
 * "...It can chose a single Exarch power." Not scoped to one squad's own Exarch Power list — the
 * full pool, verified identical (same 16 names, same 5pt price) across all 10 Aspect Warrior/
 * Exarch-bearing squads (Dire Avengers, Fire Dragons, Howling Banshees, Shadow Spectres, Striking
 * Scorpions, Shining Spears, Swooping Hawks, Warp Spiders, Crimson Hunter, Dark Reapers).
 */
const ELDAR_EXARCH_POWERS = [
  'Bladestorm', 'Burning heat', 'Crack shot', 'Crushing blows', 'Defensive stance',
  "Dragon's bite", 'Graceful avoidance', 'Heartstrike', 'Lightning attacks', 'Piercing strike',
  'Rapid redeployment', "Reaper's reach", "Scorpion's sting", 'Skyhunter', 'Stand firm',
  'Surprise assault',
];

interface Props {
  item: RosterEntry;
  unit: Unit;
  onClose: () => void;
  filterCategory?: 'veteran' | 'vehicle';
  /** Overrides unit.has_veteran_abilities — used when an archetype grants vet access to a normally ineligible unit. */
  effectiveHasVetAbilities?: boolean;
  /** The unit's effective slot (post archetype/variant remap), as computed by resolveUnitProfile
   *  in UnitCard. Used for the Skirmish "HQ models may not take 'once per army' upgrades" check —
   *  see skirmishHqUniqueBlocked. */
  effectiveSlot?: string;
}

// Collision-proof id (same reasoning as newId in store/army.ts): a reset-on-reload counter would
// clash with armory-item ids from a persisted army, so removeArmoryItem could drop the wrong item.
function selId() {
  return 'arm-' + (globalThis.crypto?.randomUUID?.() ?? (Date.now().toString(36) + '-' + Math.random().toString(36).slice(2)));
}

type ArmoryTab = 'general' | 'mark' | 'legion' | 'authority' | 'archetypeArmory';
type Section = 'weapons' | 'equipment' | 'daemon_weapons';

function parsePrice(v: number | null | undefined | string): number | null {
  if (v === null || v === undefined || v === '') return null;
  const n = typeof v === 'number' ? v : parseInt(String(v), 10);
  return isNaN(n) ? null : n;
}

/**
 * Eldar's general Armory ("Armory" sheet, Eldar ENG.ods) prices character buyers from two
 * separate columns, "POINTS PSYKER"/"POINTS AUTARCH" (e.g. Witchblade is Psyker-only, Aspect
 * armor is Autarch-only) — the parser mapped these onto the generic `p_unit`/`p_char` fields
 * (Psyker→p_unit, Autarch→p_char) since that's all 2 numeric slots the schema had, which means
 * a SQUAD buyer (e.g. a Warlocks unit, is_psyker:true) already prices correctly off `p_unit` by
 * accident — but a lone CHARACTER buyer (Autarch/Farseer/Spiritseer/Wraithseer) needs to pick
 * the column matching ITS OWN role, not always prefer p_char (`cp ?? up`) like every other
 * faction does. Scoped to Eldar only — every other faction's p_unit/p_char keep their normal
 * squad/character meaning. Exarch Powers and Vehicle Equipment (single "POINTS" column, p_char
 * always null) are unaffected either way since `cp` is null for them regardless of role.
 */
function resolveEldarCharPrice(arm: ArmoryItem, unit: Unit): number | null {
  return parsePrice(unit.is_psyker ? arm.p_unit : arm.p_char);
}

// ── Mark restriction helpers ──────────────────────────────────────────────────
// The gating helpers (itemRequiredMark / stripMarkGlyph / isTerminatorArmourName /
// modelRestrictsToTermSubset / isItemMarkBlocked) live in engine/keywords.ts — the single
// keyword-derivation seam. Only the badge styling stays local here.
const MARK_BADGE: Record<string, string> = {
  Slaanesh: 'bg-pink-900/60 text-pink-300 border-pink-700',
  Khorne:   'bg-red-900/60 text-red-300 border-red-700',
  Tzeentch: 'bg-sky-900/60 text-sky-300 border-sky-700',
  Nurgle:   'bg-green-900/60 text-green-300 border-green-700',
};

export function ArmoryModal({ item, unit, onClose, filterCategory, effectiveHasVetAbilities, effectiveSlot }: Props) {
  const { data, alliedData, legacy, legacy2, archetype, traitPool, alliedTraitPool, engagement, addArmoryItem, removeArmoryItem, setLegacyArmoryLock, army } = useArmyStore();
  const [tab, setTab] = useState<ArmoryTab>('general');
  const [section, setSection] = useState<Section>('weapons');
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  // Weapon picker for daemon-weapon traits: itemName → chosen weapon name
  const [dwTargetWeapon, setDwTargetWeapon] = useState<Record<string, string>>({});
  // Weapon picker for equipment items that target a specific weapon (Chaos artifact, Obsidian blade, etc.)
  const [eqTargetWeapon, setEqTargetWeapon] = useState<Record<string, string>>({});
  // Eldar "Paragon of war" Exarch Power picker (ki-eldar-paragon-of-war-partial-stats-01)
  const [eqExarchPower, setEqExarchPower] = useState<Record<string, string>>({});
  // "Authority of the Inquisition" tab state — which foreign faction is browsed + its lazy-loaded data
  const [authorityFaction, setAuthorityFaction] = useState<string | null>(null);
  const [authorityCache, setAuthorityCache]     = useState<Record<string, FactionData>>({});
  const [authorityLoading, setAuthorityLoading] = useState(false);
  useEffect(() => {
    if (!authorityFaction || authorityCache[authorityFaction]) return;
    setAuthorityLoading(true);
    FACTION_LOADERS[authorityFaction]()
      .then(fd => setAuthorityCache(prev => ({ ...prev, [authorityFaction]: fd })))
      .finally(() => setAuthorityLoading(false));
  }, [authorityFaction, authorityCache]);
  // Archetype-granted cross-faction armory (ki-ig-traitor-guard-archetype-01) — a FIXED foreign
  // faction (no player choice, unlike Authority of the Inquisition), uncapped use. Lazy-loaded
  // once per archetype the same way.
  const archetypeRuleForArmory = getArchetypeRule(archetype);
  const [archetypeArmoryData, setArchetypeArmoryData] = useState<FactionData | null>(null);
  const [archetypeArmoryLoading, setArchetypeArmoryLoading] = useState(false);
  useEffect(() => {
    const fk = archetypeRuleForArmory?.armoryOnlyFaction;
    if (!fk) { setArchetypeArmoryData(null); return; }
    setArchetypeArmoryLoading(true);
    FACTION_LOADERS[fk]()
      .then(fd => setArchetypeArmoryData(fd))
      .finally(() => setArchetypeArmoryLoading(false));
  }, [archetypeRuleForArmory?.armoryOnlyFaction]);
  if (!data) return null;

  // Bug 3: for allied units use the allied faction's armory data
  const isAllied = !!item.factionSource;
  const activeData = (isAllied && alliedData) ? alliedData : data;

  // Always read armory from the live store so Unique checks stay current after additions
  const currentArmory = (army.find(e => e.id === item.id) ?? item).armory;

  // "Authority of the Inquisition" — Inquisition-only, capped at 1 item per model regardless
  // of which faction/section it came from.
  const isInquisition = data.faction === 'Inquisition';
  const authorityCapReached = currentArmory.some(a => a.source === AUTHORITY_SOURCE);

  // Level 1 — once per model: blocked once the squad already holds one copy per model (item.size),
  // unless desc says "Can be taken multiple times". For a true Character (is_character:true) or any
  // single-model entry, item.size is 1 so this still means "can't add the same item twice" as before.
  // For a multi-model squad where every model individually has Armory access (canonical OPTIONS text
  // "All models got access to weapons and gear from the Armory", e.g. Orks Nobz — GitHub #3), each
  // model may carry its own copy, so the cap scales with squad size instead of being hardcoded to 1.
  // Safe to apply uniformly: a unit with `is_character: false` never gets access to true-Character-
  // only (p_char-exclusive, two-column) items in the first place (see getItemPts below / ki-armory-
  // pchar-truechar-only-01), so every item purchasable here by a multi-model squad is already a
  // squad-wide p_unit allowance, never a single Champion's personal one-off.
  // "Waaagh! Coast Kustoms" Army Trait (ki-orks-waaaghcoastkustoms-unmodelled-01): "Each Kustom
  // job can be taken one additional time" — raises the per-vehicle cap on the 16 named Kustom Job
  // items by +1. Uses the allied trait pool when this item belongs to an allied Orks detachment.
  const effectiveTraitPool = (isAllied && alliedData) ? alliedTraitPool : traitPool;
  function oncePerModelBlocked(arm: ArmoryItem, sec: Section): boolean {
    if (isMultipleAllowed(arm.desc)) return false;
    const owned = currentArmory.filter(a => a.itemName === arm.name && a.section === sec).length;
    const cap = (isOrkKustomJob(arm.name) && effectiveTraitPool.includes('Waaagh! Coast Kustoms'))
      ? item.size + 1
      : item.size * multiplesPerModel(arm.desc);
    return owned >= cap;
  }
  // Level 2 — Unique: once per army; blocked if any OTHER unit in the army already has it
  function uniqueArmyBlocked(arm: ArmoryItem, sec: Section): boolean {
    if (!isUniqueItem(arm.desc)) return false;
    return army.filter(e => e.id !== item.id).some(e => e.armory.some(a => a.itemName === arm.name && a.section === sec));
  }
  // Level 2b — Unwieldy: once per MODEL (Core Rules glossary, ki-unwieldy-permodel-unenforced-01).
  // Blocked if this model's own armory already carries a (different) Unwieldy item.
  function unwieldyModelBlocked(arm: ArmoryItem, sec: Section): boolean {
    if (!isUnwieldyItem(arm.desc)) return false;
    return currentArmory.some(a => {
      if (a.itemName === arm.name && a.section === sec) return false; // same item — oncePerModelBlocked already covers it
      const found = findArmoryItem(activeData, a);
      return !!found && isUnwieldyItem(found.desc);
    });
  }
  // Skirmish Unit Restriction #1 (Missions.txt L72, ki-skirmish-restrictions-unenforced-01):
  // "HQ models may not take 'once per army' upgrades" — the canonical glossary defines a
  // "once per army" upgrade as exactly what the "Unique" ability means ("This weapon or
  // wargear may only be included once per army", coreRules.ts). So in Skirmish, an HQ-slot
  // unit's models may not select Unique items at all (a stricter, engagement-scoped ban —
  // distinct from uniqueArmyBlocked's normal "only if another unit already has it" gate).
  function skirmishHqUniqueBlocked(arm: ArmoryItem): boolean {
    return engagement === 'skirmish' && effectiveSlot === 'HQ' && isUniqueItem(arm.desc);
  }
  // Level 3 — terminator armor conflict: can't stack two Terminator-type armors
  function isTerminatorArmor(arm: ArmoryItem): boolean {
    return isTerminatorArmourName(arm.name);
  }
  function armorConflict(arm: ArmoryItem): boolean {
    if (!isTerminatorArmor(arm)) return false;
    const allSrcs = [activeData.armory_general, ...Object.values(activeData.armory_marks), ...Object.values(activeData.armory_legions)];
    return currentArmory.some(sel => {
      if (sel.section !== 'equipment') return false;
      for (const src of allSrcs) {
        const found = (src.equipment as ArmoryItem[]).find(x => x.name === sel.itemName);
        if (found && found.name !== arm.name && isTerminatorArmor(found)) return true;
      }
      return false;
    });
  }
  // Collect armour-class keywords from already-bought equipment (for effectiveKeywords).
  function getBoughtArmourKws(): string[] {
    const kw: string[] = [];
    const allSrcs = [activeData.armory_general, ...Object.values(activeData.armory_marks), ...Object.values(activeData.armory_legions)];
    for (const sel of currentArmory) {
      if (sel.section !== 'equipment') continue;
      for (const src of allSrcs) {
        const found = (src?.equipment ?? []).find((x: ArmoryItem) => x.name === sel.itemName);
        if (found?.armourKeyword) { kw.push(found.armourKeyword); break; }
      }
    }
    return kw;
  }

  // effectiveKeywords: single source of truth for all keyword-based gating (instanceOf).
  // Combines unit.keywords + unit_type tokens + selected mark + bought armour keywords.
  const _effectiveKws = effectiveKeywords(unit, item.mark, getBoughtArmourKws());

  // Combined: is adding this item blocked for any reason?
  function isAddBlocked(arm: ArmoryItem, sec: Section): boolean {
    if (oncePerModelBlocked(arm, sec)) return true;
    if (uniqueArmyBlocked(arm, sec)) return true;
    if (unwieldyModelBlocked(arm, sec)) return true;
    if (skirmishHqUniqueBlocked(arm)) return true;
    if (sec === 'equipment' && armorConflict(arm)) return true;
    if (sec === 'equipment' && daemonGatewayConflict(arm)) return true;
    // instanceOf gate: requires_keywords checked against effectiveKeywords (BSData model)
    if (isItemRequirementsBlocked(arm, _effectiveKws)) return true;
    // For regular (non-veteran/vehicle) equipment: enforce mark restriction and null price
    if (!arm.category) {
      if (isMarkBlocked(arm)) return true;
      if (getItemPts(arm) === null) return true;
    }
    return false;
  }
  function getSelId(itemName: string, sec: Section): string | undefined {
    return currentArmory.find(a => a.itemName === itemName && a.section === sec)?.id;
  }
  function removeItem(armId: string) { removeArmoryItem(item.id, armId); }

  const rule = getArchetypeRule(archetype);
  const effectiveMark = unit.locked_mark ?? (rule?.forcedMark ?? null) ?? item.mark;
  const isChar = unit.is_character;
  const isVehicle = unit.is_vehicle;

  const activeVariant = getActiveVariant(item, unit);

  // CD-specific: Greater Daemons pay from the p_char column ("POINTS GREATER DEMON");
  // all other units (Heralds, Daemon Prince, Soul Grinder) pay from p_unit ("POINTS").
  const isCD = activeData.faction === 'Chaos Daemons';
  // The Horus Heresy supplement has NO Chaos Marks: a trailing ᵀ on an HH item means
  // Terminator-compat (term_compat), not Mark of Tzeentch. When the active unit's armory IS
  // the HH supplement, every item is mark-less. The host's HH legion tab is handled per-armory
  // below via legMarkless(). See ki-hh-tcollision-01.
  const isMarklessFaction = activeData.faction === 'Horus Heresy Space Marines';
  /** True when the given legion-armory key is the archetype-granted supplement (e.g. Horus Heresy). */
  const legMarkless = (legName: string): boolean =>
    isMarklessFaction || legName === rule?.sharedSupplementArmory;
  // Use is_monster as the CD proxy for Greater Daemon (avoids false-positive on Heralds whose
  // Entourage ability text references "Greater Daemon" without the unit being one).
  const isGreaterDaemon = isCD && unit.is_monster;

  /** Returns the correct pts for this unit, or null if the item cannot be purchased ("-"). */
  function getItemPts(arm: ArmoryItem): number | null {
    const cp = parsePrice(arm.p_char);
    const up = parsePrice(arm.p_unit);
    if (isCD) return isGreaterDaemon ? cp : up;
    // Eldar: a lone character buyer (Autarch/Farseer/Spiritseer/Wraithseer) prices off the
    // column matching its own role — see resolveEldarCharPrice. A squad buyer (e.g. Warlocks)
    // still falls through to the generic `up` branch below, which already happens to be correct.
    if (activeData.faction === 'Eldar' && isChar) return resolveEldarCharPrice(arm, unit);
    // Necrons Cryptek: "POINTS CRYPTEK" (p_unit) / "POINTS LORD" (p_char) are mutually exclusive
    // tiers, not a character/squad split — most rows only have ONE of the two columns filled in
    // (Lord-exclusive gear like "War scythe"/"Lord of the Storm" has no Cryptek price at all).
    // "Dynasty Scion: ...has access to Lord equipment in the Armory, instead of Cryptek" means a
    // base Cryptek must price off p_unit only (and Lord-exclusive items become unbuyable, since
    // their p_unit is null), while Dynasty Scion flips to p_char only (ki-necrons-cryptek-
    // dynastyscion-novariant-01). Without this, `isChar` alone (true either way) always preferred
    // p_char, wrongly letting a base Cryptek buy Lord-exclusive gear.
    if (activeData.faction === 'Necrons' && unit.name === 'Cryptek') return activeVariant ? cp : up;
    // Single-column tables (e.g. "DAEMON WEAPONS": one "POINTS" header, no "POINTS CHARACTER
    // MODELS" split at all) have no `p_unit` key in the data — anyone with access (gated
    // separately, e.g. by already owning the "Daemon weapon" gateway item) pays the one listed
    // price, regardless of is_character. Must check the KEY's presence, not parsePrice's result
    // (parsePrice already collapses null and undefined to the same `null`).
    if (arm.p_unit === undefined && cp != null) return cp;
    // Two-column tables ("POINTS" / "POINTS CHARACTER MODELS"): true Character models
    // (`is_character: true`) use p_char; everyone else uses p_unit ONLY. Confirmed against the
    // canonical .ods itself: a "-" in the unit column (e.g. Cataphractii armor, p_unit: null,
    // p_char: 76) means truly unavailable outside true Characters — NOT a fallback to the
    // Character price for a squad's built-in Champion or promoted variant (Plague Champion,
    // Traitor Sergeant, etc.), even though those have their own Armory access; they aren't
    // Character models, just squad leaders with a personal wargear allowance
    // (ki-armory-pchar-truechar-only-01 — this reverts the v0.66 "Force axe on Traitor Sergeant"
    // decision, which incorrectly treated a squad's character-scoped buyer as equivalent to
    // is_character for this column).
    return isChar ? (cp ?? up) : up;
  }

  /** True when the item requires a mark the unit doesn't have. markless (HH supplement) carries no
   *  marks — a trailing ᵀ is Terminator-compat, never Tzeentch (ki-hh-tcollision-01). */
  function isMarkBlocked(arm: ArmoryItem): boolean {
    return isItemMarkBlocked(arm, { markless: isMarklessFaction, effectiveMark });
  }

  // Faction capability flags — use activeData (allied faction's armory for allied units)
  const hasMark = Object.keys(activeData.armory_marks).length > 0;
  const hasLegionData = Object.keys(activeData.armory_legions).length > 0;
  // Label for the legacy/legion/clan tab — use the first armory_legions key as the name
  // legionTabLabel kept as fallback reference (unused now that tab only shows when legacy is active)
  // const legionTabLabel = Object.keys(data.armory_legions)[0] ?? 'Legacy';
  // Daemon weapon abilities ("Dark"/"Kai"/"Unstoppable" etc.): the gateway items "Daemon weapon"
  // (pick 1) / "Greater Daemon weapon" (pick 2, mutually exclusive with the first) live in
  // armory_general's equipment list, but the ability pool itself is split across general.json
  // PLUS each mark's own json — the gateway's desc text ("the Daemon weapons section") treats it
  // as one combined pool, so aggregate general + the unit's active mark here rather than making
  // the player hunt across tabs for it.
  function getDaemonWeaponPool(): ArmoryItem[] {
    const sources = [
      activeData.armory_general,
      ...(effectiveMark && activeData.armory_marks[effectiveMark] ? [activeData.armory_marks[effectiveMark]] : []),
    ];
    const pool = sources.flatMap(src => src.daemon_weapons as ArmoryItem[]);
    return filterByUnitType(filterGravisCompat(filterTermCompat(pool)))
      .filter(arm => !isArmyItemGateBlocked(arm, rosterArmoryItemNames));
  }
  const daemonWeaponSelections = currentArmory.filter(a => a.section === 'daemon_weapons');
  /** "Daemon weapon" and "Greater Daemon weapon" can't be combined — each gateway's own desc says so. */
  function daemonGatewayConflict(arm: ArmoryItem): boolean {
    if (arm.name !== 'Daemon weapon' && arm.name !== 'Greater Daemon weapon') return false;
    const other = arm.name === 'Daemon weapon' ? 'Greater Daemon weapon' : 'Daemon weapon';
    return currentArmory.some(a => a.section === 'equipment' && a.itemName === other);
  }

  // Veteran slot tracking for armory items — independent of whether the faction has traits
  const armoryVetEnabled = effectiveHasVetAbilities ?? unit.has_veteran_abilities;
  // Marks count as 1 veteran ability for ALL units — locked-mark units use veteran_max:1 in data instead
  const hasMarkGroup = unit.option_groups.some(g => g.constraint.type === 'mark') || !!rule?.grantsMarkPurchase;
  const markUsesVetSlot = !!(hasMarkGroup && !unit.locked_mark && effectiveMark);
  // Henchman Warband: every specialist sheet grants "one Veteran ability" PER SPECIALIST TYPE
  // present in the unit, not a flat per-unit pool — count distinct model types with count > 0.
  const isHenchmanWarband = unit.name === 'Henchman Warband';
  const henchmanVetSlots = isHenchmanWarband
    ? Object.values(item.modelSizes ?? {}).filter(n => n > 0).length
    : null;
  const armoryVetMax = armoryVetEnabled
    ? (isHenchmanWarband ? (henchmanVetSlots ?? 0) : Math.max(0, (unit.veteran_max ?? 2) - (markUsesVetSlot ? 1 : 0)))
    : null;

  // Abilities already baked into the unit's profile — these don't consume a veteran slot
  const profileAbilityNames: Set<string> = new Set(
    (unit.abilities ?? []).map(a => a.split(':')[0].trim().toLowerCase())
  );

  const veteranItemsUsed = armoryVetMax !== null
    ? item.armory.filter(a => {
        // Abilities already in the unit's profile don't count toward the slot limit
        if (profileAbilityNames.has(a.itemName.toLowerCase())) return false;
        const sources = [
          activeData.armory_general,
          ...Object.values(activeData.armory_marks),
          ...Object.values(activeData.armory_legions),
        ];
        for (const src of sources) {
          for (const sec of ['weapons', 'equipment', 'daemon_weapons'] as const) {
            const found = (src[sec] as ArmoryItem[]).find(x => x.name === a.itemName && x.category === 'veteran');
            if (found) return true;
          }
        }
        return false;
      }).length
    : 0;
  const veteranSlotsFull = armoryVetMax !== null && veteranItemsUsed >= armoryVetMax;

  // Wound/HP count for per-wound cost calculation (veteran abilities on vehicles/monsters)
  const baseModel = unit.models.find(m => m.max > 0) ?? unit.models[0];
  const woundCount = isVehicle
    ? (parseInt(String(baseModel?.stats?.HP ?? '1'), 10) || 1)
    : (parseInt(String(baseModel?.stats?.W ?? '1'), 10) || 1);

  // Terminator / Cataphractii armour restriction — fires on the innate armour keyword OR on a
  // dynamically-bought Terminator/Cataphractii armor equipment item (both gate to the ᵀ subset).
  const boughtArmourNames = currentArmory.filter(a => a.section === 'equipment').map(a => a.itemName);
  const termRestricted = modelRestrictsToTermSubset(unit, boughtArmourNames);
  // Gravis armour gates to the ᴳ subset, exactly like Terminator gates to ᵀ (SM Armory.html L69:
  // "Models wearing Gravis armor can only receive equipment with ᴳ"). Mutually exclusive with ᵀ.
  const gravisRestricted = modelRestrictsToGravisSubset(unit, boughtArmourNames);
  // Keep already-bought items visible even when non-ᵀ/ᴳ, so they stay removable (the armour item
  // that triggers the gate is itself non-ᵀ/ᴳ and would otherwise vanish from the list).
  const boughtItemNames = new Set(currentArmory.map(a => a.itemName));
  function filterTermCompat(armItems: ArmoryItem[]): ArmoryItem[] {
    return termRestricted ? armItems.filter(a => isItemTermCompat(a) || boughtItemNames.has(a.name)) : armItems;
  }
  function filterGravisCompat(armItems: ArmoryItem[]): ArmoryItem[] {
    return gravisRestricted ? armItems.filter(a => isItemGravisCompat(a) || boughtItemNames.has(a.name)) : armItems;
  }

  // Filter items by unit type and category
  function filterByUnitType(armItems: ArmoryItem[]): ArmoryItem[] {
    return armItems.filter(arm => {
      if (arm.category === 'vehicle') return isVehicle;
      if (arm.category === 'veteran') {
        if (!armoryVetEnabled) return false;
        // Infiltrator / Vanguard etc. have p_veh:null — not available to vehicles/monsters
        if (isVehicle || unit.is_monster) return arm.p_veh != null;
        return true;
      }
      return true;
    });
  }

  // Allied units don't have access to the main army's legacy armories
  const legacyLegionKeys = [legacy, legacy2]
    .filter(Boolean)
    .map(name => data.legacies.find(l => l.name === name)?.armory_key)
    .filter((k): k is string => !!k && k in data.armory_legions);
  // A supplement-granting archetype (e.g. Legion → 'Horus Heresy') exposes its armory to the
  // whole army as a legion tab — gated by access only, no mark. Mirrors a Legacy grant.
  const archetypeArmoryKey = rule?.sharedSupplementArmory;
  const grantedArchetypeKeys = archetypeArmoryKey && archetypeArmoryKey in data.armory_legions
    ? [archetypeArmoryKey] : [];
  const activeLegionKeys = isAllied ? [] : [...legacyLegionKeys, ...grantedArchetypeKeys];
  const hasLegion = activeLegionKeys.length > 0;

  // Mixed Warband: when 2 legacy armories are active, each unit may only use ONE
  const isMixedWarband = traitPool.some(n =>
    data!.traits.find(t => t.name === n)?.enables_second_legacy
  );
  const hasTwoLegacies = activeLegionKeys.length >= 2;
  const mixedWarbandActive = isMixedWarband && hasTwoLegacies;

  // The lock for THIS unit (reads from live store entry)
  const liveItem = army.find(e => e.id === item.id) ?? item;
  const unitLegacyLock = liveItem.legacyArmoryLock ?? null;

  // Black Crusade champion: has all 4 marks → show all 4 mark armories
  const isBlackCrusadeChampion = !!(liveItem.blackCrusadeHQ);
  const BC_MARKS = ['Khorne', 'Nurgle', 'Slaanesh', 'Tzeentch'] as const;

  function getArmory() {
    if (tab === 'mark') {
      if (isBlackCrusadeChampion) return null; // rendered inline as 4 sections
      if (effectiveMark) return activeData.armory_marks[effectiveMark];
    }
    if (tab === 'legion') return null;
    return activeData.armory_general;
  }

  // All weapons available to this unit (built-in + already-selected armory weapons)
  const availableWeapons: string[] = [
    ...unit.weapons.map(w => w.name),
    ...item.armory.filter(a => a.section === 'weapons').map(a => a.itemName),
  ];

  function add(arm: ArmoryItem, src: string, sec: Section, targetWeapon?: string, chosenPower?: string) {
    let pts: number;
    let scaling: 'perWound' | 'perModel' | undefined;
    if (arm.category === 'veteran') {
      // Cost is per wound per model for all non-character units (rule verbatim:
      // "paid for every model in the unit and per Wound or Hull point of the model"). Store the
      // BASE rate + scaling flag — liveArmoryPoints() multiplies by the CURRENT size/wounds on
      // every render, so resizing the squad after buying doesn't leave a stale stored cost.
      if (isVehicle || unit.is_monster) {
        pts = parsePrice(arm.p_veh) ?? 0;
        scaling = 'perWound';
      } else if (isChar) {
        pts = parsePrice(arm.p_char) ?? parsePrice(arm.p_unit) ?? 0;
      } else {
        pts = parsePrice(arm.p_unit) ?? 0;
        scaling = 'perWound';
      }
    } else if (arm.category === 'vehicle') {
      // Flat cost per vehicle (squadron size, no wound scaling)
      pts = parsePrice(arm.p_unit) ?? 0;
      scaling = 'perModel';
    } else {
      pts = getItemPts(arm) ?? 0;
    }
    addArmoryItem(item.id, {
      id: selId(),
      itemName: arm.name,
      source: src,
      section: sec,
      points: pts,
      scaling,
      isCharacter: isChar,
      targetWeapon: targetWeapon,
      chosenPower: chosenPower,
    });
    setLastAdded(arm.name);
    setTimeout(() => setLastAdded(null), 1500);
  }

  const armory = getArmory();

  // Flattened item names across the WHOLE roster — backs the army-wide gate (requires_army_item):
  // e.g. picking "Ordo Xenos" on any Inquisitor unlocks Ordo Xenos equipment for every model.
  // Plus any "Ordo X" names unlocked by the selected Army Customisation Legacy (Inquisition),
  // or by the "Chamber Militant" archetype's fixed Ordo Legacy-equivalent unlock.
  const chamberMilitantOrdoName = chamberMilitantOrdo(data.faction, archetype);
  const rosterArmoryItemNames = [
    ...army.flatMap(e => e.armory.map(a => a.itemName)),
    ...inquisitionLegacyOrdoUnlocks(legacy),
    ...(chamberMilitantOrdoName ? inquisitionLegacyOrdoUnlocks(chamberMilitantOrdoName) : []),
  ];

  function getItems(sec: Section): ArmoryItem[] {
    if (!armory) return [];
    return filterByUnitType(filterGravisCompat(filterTermCompat(armory[sec] as ArmoryItem[])))
      .filter(arm => !isArmyItemGateBlocked(arm, rosterArmoryItemNames));
  }

  // Split equipment into groups
  function splitEquipment(items: ArmoryItem[]) {
    return {
      regular: items.filter(a => !a.category),
      veteran: items.filter(a => a.category === 'veteran'),
      vehicle: items.filter(a => a.category === 'vehicle'),
    };
  }

  // When opened via a category button, always show the equipment section filtered to that category
  const effectiveSection: Section = filterCategory ? 'equipment' : section;

  const equipItems = getItems('equipment');
  const { regular: regularEquip, veteran: veteranEquip, vehicle: vehicleEquip } = splitEquipment(equipItems);

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-start justify-center z-50 p-6 overflow-y-auto"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-zinc-900 border-2 border-amber-800 w-full max-w-2xl flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 bg-zinc-800 border-b border-amber-800">
          <h3 className="text-amber-400 uppercase tracking-widest text-sm">
            {filterCategory === 'veteran'
              ? `Veteran Abilities — ${unit.name}`
              : filterCategory === 'vehicle'
                ? `Vehicle Upgrades — ${unit.name}`
                : `Armoury — ${unit.name}`
            }
          </h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-xl">✕</button>
        </div>

        {/* Armory tabs — hidden when opened via a category button (veteran/vehicle) */}
        {!filterCategory && <div className="flex border-b border-zinc-700">
          {/* General tab — always shown */}
          {(['general'] as ArmoryTab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-[11px] uppercase tracking-wide border-b-2 transition-colors
                ${tab === t
                  ? 'border-amber-600 text-amber-400'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
            >
              General
            </button>
          ))}
          {/* Mark tab — shown when unit has a mark WITH data in armory_marks, OR when it's the BC champion */}
          {(isBlackCrusadeChampion || (hasMark && effectiveMark && activeData.armory_marks[effectiveMark])) && (
            <button
              onClick={() => setTab('mark')}
              className={`px-4 py-2 text-[11px] uppercase tracking-wide border-b-2 transition-colors
                ${tab === 'mark'
                  ? 'border-amber-600 text-amber-400'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
            >
              {isBlackCrusadeChampion ? '⚜ All Marks' : `${effectiveMark} Armoury`}
            </button>
          )}
          {/* Legion/Clan tab — only shown when a legacy that grants armory access is active */}
          {hasLegionData && hasLegion && (
            <button
              onClick={() => setTab('legion')}
              className={`px-4 py-2 text-[11px] uppercase tracking-wide border-b-2 transition-colors
                ${tab === 'legion'
                  ? 'border-amber-600 text-amber-400'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
            >
              {activeLegionKeys[0]} Armoury
            </button>
          )}
          {/* Authority of the Inquisition tab — Inquisition only */}
          {isInquisition && (
            <button
              onClick={() => setTab('authority')}
              className={`px-4 py-2 text-[11px] uppercase tracking-wide border-b-2 transition-colors
                ${tab === 'authority'
                  ? 'border-amber-600 text-amber-400'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
            >
              Authority of the Inquisition
            </button>
          )}
          {/* Archetype-granted cross-faction armory — e.g. IG Traitor Guard → Chaos Space Marines */}
          {rule?.armoryOnlyFaction && (
            <button
              onClick={() => setTab('archetypeArmory')}
              className={`px-4 py-2 text-[11px] uppercase tracking-wide border-b-2 transition-colors
                ${tab === 'archetypeArmory'
                  ? 'border-amber-600 text-amber-400'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
            >
              {archetypeArmoryData?.faction ?? '…'} Armoury
            </button>
          )}
        </div>}

        {/* Terminator / Cataphractii armour restriction */}
        {termRestricted && (
          <div className="px-4 py-1.5 bg-amber-900/30 border-b border-amber-800 text-[10px] text-amber-400">
            Terminator armour — showing only Terminator-compatible items (ᵀ).
          </div>
        )}

        {/* Section tabs — hidden when opened via a specific category button */}
        {!filterCategory && (
          <div className="flex gap-1 p-2 bg-zinc-800 border-b border-zinc-700">
            {(['weapons','equipment'] as Section[]).map(s => (
              <button
                key={s}
                onClick={() => setSection(s)}
                className={`px-3 py-1 text-[11px] uppercase border transition-colors
                  ${section === s
                    ? 'bg-amber-800 border-amber-600 text-white'
                    : 'bg-zinc-900 border-zinc-600 text-zinc-400 hover:text-amber-400'
                  }`}
              >
                {s === 'weapons' ? 'Weapons' : 'Equipment'}
              </button>
            ))}
          </div>
        )}

        {/* Items */}
        <div className="overflow-y-auto flex-1 p-3 space-y-1">
          {tab === 'mark' && isBlackCrusadeChampion ? (
            /* BC champion — show all 4 mark armories */
            <div className="space-y-2">
              <div className="px-2 py-1.5 bg-amber-900/20 border border-amber-800 text-[10px] text-amber-400 uppercase tracking-wide">
                ⚜ Black Crusade Champion — access to all four mark armories
              </div>
              {BC_MARKS.map(markName => {
                const markArm = activeData.armory_marks[markName];
                if (!markArm) return null;
                const markItems = filterByUnitType(filterGravisCompat(filterTermCompat(markArm[effectiveSection] as ArmoryItem[])));
                const markEq = effectiveSection === 'equipment' ? splitEquipment(markItems) : null;
                return (
                  <div key={markName}>
                    <div className="text-[11px] text-amber-700 uppercase tracking-widest mb-1 mt-2">{markName} Armoury</div>
                    {markEq ? (
                      <EquipmentGroups
                        regular={markEq.regular} veteran={markEq.veteran} vehicle={markEq.vehicle}
                        isChar={isChar} isVehicle={isVehicle} isMonster={unit.is_monster}
                        unitSize={item.size} unitWounds={woundCount}
                        profileAbilityNames={profileAbilityNames}
                        armoryVetMax={armoryVetMax} veteranItemsUsed={veteranItemsUsed} veteranSlotsFull={veteranSlotsFull}
                        filterCategory={filterCategory}
                        lastAdded={lastAdded}
                        isUniqueSelected={arm => isAddBlocked(arm, 'equipment')}
                        getSelId={name => getSelId(name, 'equipment')}
                        onRemove={removeItem}
                        onAdd={arm => {
                          if (isAddBlocked(arm, 'equipment')) return;
                          const tw = requiresWeaponTarget(arm.desc) ? (eqTargetWeapon[arm.name] || undefined) : undefined;
                          add(arm, `${markName} Armoury`, effectiveSection, tw);
                        }}
                        availableWeapons={availableWeapons}
                        eqTargetWeapon={eqTargetWeapon}
                        onSetEqTargetWeapon={(n, w) => setEqTargetWeapon(prev => ({ ...prev, [n]: w }))}
                      />
                    ) : (
                      markItems.length === 0
                        ? <div className="text-zinc-500 italic text-sm text-center py-2">No items in this section</div>
                        : markItems.map((arm, i) => (
                          <ArmoryItemRow
                            key={i} arm={arm} isChar={isChar}
                            justAdded={lastAdded === arm.name}
                            disabled={isAddBlocked(arm, effectiveSection)}
                            selectedArmoryId={getSelId(arm.name, effectiveSection)}
                            ptsOverride={getItemPts(arm)}
                            onRemove={removeItem}
                            onAdd={() => !isAddBlocked(arm, effectiveSection) && add(arm, `${markName} Armoury`, effectiveSection)}
                          />
                        ))
                    )}
                  </div>
                );
              })}
            </div>
          ) : tab === 'legion' ? (
            activeLegionKeys.length === 0 ? (
              <div className="text-zinc-500 italic text-sm text-center py-8">
                No active Legacy. Select a Legacy in army configuration.
              </div>
            ) : mixedWarbandActive && !unitLegacyLock ? (
              /* Mixed Warband: unit hasn't chosen a legacy armory yet */
              <div className="space-y-3 py-4 px-2">
                <div className="px-2 py-2 bg-amber-900/20 border border-amber-800 text-[11px] text-amber-400 space-y-1">
                  <div className="font-semibold uppercase tracking-wide">Mixed Warband — Choose Legacy Armory</div>
                  <div className="text-zinc-400">This unit may only purchase items from <em>one</em> legacy armory. Choose which one applies to this unit. This cannot be changed without clearing all existing legion armory items from this unit.</div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {activeLegionKeys.map(lk => (
                    <button
                      key={lk}
                      onClick={() => setLegacyArmoryLock(item.id, lk)}
                      className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-600 text-zinc-200 hover:border-amber-600 hover:text-amber-300 uppercase tracking-wide text-[11px] transition-colors"
                    >
                      {lk}
                    </button>
                  ))}
                </div>
              </div>
            ) : Object.entries(activeData.armory_legions)
              .filter(([legName]) => {
                // If Mixed Warband is active and a lock is set, only show the locked armory
                if (mixedWarbandActive && unitLegacyLock) return legName === unitLegacyLock;
                return activeLegionKeys.includes(legName);
              })
              .map(([legName, leg]) => {
                const legItems = filterByUnitType(filterGravisCompat(filterTermCompat(leg[effectiveSection] as ArmoryItem[])));
                const legEq = effectiveSection === 'equipment' ? splitEquipment(legItems) : null;
                return (
                  <div key={legName}>
                    <div className="flex items-center justify-between mb-1 mt-2">
                      <div className="text-[11px] text-amber-700 uppercase tracking-widest">{legName}</div>
                      {mixedWarbandActive && unitLegacyLock && (
                        <button
                          onClick={() => setLegacyArmoryLock(item.id, null)}
                          className="text-[10px] text-red-400 hover:text-red-300 border border-red-800 px-1.5 py-0.5 uppercase tracking-wide transition-colors"
                          title="Clears this unit's legacy armory lock and removes all legion armory items"
                        >
                          Change Armory
                        </button>
                      )}
                    </div>
                    {legEq ? (
                      <EquipmentGroups
                        regular={legEq.regular} veteran={legEq.veteran} vehicle={legEq.vehicle}
                        isChar={isChar} isVehicle={isVehicle} isMonster={unit.is_monster}
                        unitSize={item.size} unitWounds={woundCount}
                        profileAbilityNames={profileAbilityNames}
                        armoryVetMax={armoryVetMax} veteranItemsUsed={veteranItemsUsed} veteranSlotsFull={veteranSlotsFull}
                        filterCategory={filterCategory}
                        lastAdded={lastAdded}
                        markless={legMarkless(legName)}
                        isUniqueSelected={arm => isAddBlocked(arm, 'equipment')}
                        getSelId={name => getSelId(name, 'equipment')}
                        onRemove={removeItem}
                        onAdd={arm => {
                          if (isAddBlocked(arm, 'equipment')) return;
                          const tw = requiresWeaponTarget(arm.desc) ? (eqTargetWeapon[arm.name] || undefined) : undefined;
                          add(arm, legName, effectiveSection, tw);
                        }}
                        availableWeapons={availableWeapons}
                        eqTargetWeapon={eqTargetWeapon}
                        onSetEqTargetWeapon={(n, w) => setEqTargetWeapon(prev => ({ ...prev, [n]: w }))}
                      />
                    ) : (
                      legItems.length === 0
                        ? <div className="text-zinc-500 italic text-sm text-center py-4">No items in this section</div>
                        : legItems.map((arm, i) => (
                          <ArmoryItemRow
                            key={i} arm={arm} isChar={isChar} markless={legMarkless(legName)}
                            justAdded={lastAdded === arm.name}
                            disabled={isAddBlocked(arm, effectiveSection)}
                            selectedArmoryId={getSelId(arm.name, effectiveSection)}
                            ptsOverride={getItemPts(arm)}
                            onRemove={removeItem}
                            onAdd={() => !isAddBlocked(arm, effectiveSection) && add(arm, legName, effectiveSection)}
                          />
                        ))
                    )}
                  </div>
                );
              })
          ) : tab === 'authority' ? (
            <div className="space-y-2">
              <div className="px-2 py-1.5 bg-amber-900/20 border border-amber-800 text-[10px] text-amber-400">
                Every model with Armory access may select a single item from any Imperial faction's Armory.
              </div>
              {authorityCapReached && (
                <div className="px-2 py-1.5 bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-400">
                  This model already used its Authority of the Inquisition pick. Remove it below to choose a different one.
                </div>
              )}
              {!authorityFaction ? (
                <div className="flex flex-wrap gap-2 py-2">
                  {IMPERIAL_AUTHORITY_FACTIONS.map(f => (
                    <button
                      key={f.key}
                      onClick={() => setAuthorityFaction(f.key)}
                      className="px-3 py-2 bg-zinc-800 border border-zinc-600 text-zinc-200 hover:border-amber-600 hover:text-amber-300 text-[11px] uppercase tracking-wide transition-colors"
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              ) : authorityLoading || !authorityCache[authorityFaction] ? (
                <div className="text-zinc-500 italic text-sm text-center py-8">
                  Loading {IMPERIAL_AUTHORITY_FACTIONS.find(f => f.key === authorityFaction)?.label}…
                </div>
              ) : (() => {
                const fd = authorityCache[authorityFaction];
                const foreignWeapons = (fd.armory_general.weapons ?? []) as ArmoryItem[];
                const foreignEquip = ((fd.armory_general.equipment ?? []) as ArmoryItem[]).filter(a => !a.category);
                return (
                  <div className="space-y-3">
                    <button
                      onClick={() => setAuthorityFaction(null)}
                      className="text-[10px] text-amber-500 hover:text-amber-300 uppercase tracking-wide"
                    >
                      ← Choose a different faction
                    </button>
                    {([['weapons', foreignWeapons], ['equipment', foreignEquip]] as [Section, ArmoryItem[]][]).map(([sec, items]) => (
                      <div key={sec}>
                        <div className="text-[11px] text-amber-700 uppercase tracking-widest mb-1">{sec === 'weapons' ? 'Weapons' : 'Equipment'}</div>
                        {items.length === 0
                          ? <div className="text-zinc-500 italic text-sm text-center py-2">No items in this section</div>
                          : items.map((arm, i) => {
                            const pts = getItemPts(arm);
                            const blocked = authorityCapReached || pts === null;
                            return (
                              <ArmoryItemRow
                                key={i} arm={arm} isChar={isChar}
                                justAdded={lastAdded === arm.name}
                                disabled={blocked}
                                selectedArmoryId={getSelId(arm.name, sec)}
                                ptsOverride={pts}
                                onRemove={removeItem}
                                onAdd={() => !blocked && add(arm, AUTHORITY_SOURCE, sec)}
                              />
                            );
                          })
                        }
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          ) : tab === 'archetypeArmory' ? (
            <div className="space-y-3">
              <div className="px-2 py-1.5 bg-amber-900/20 border border-amber-800 text-[10px] text-amber-400">
                Models with Armory access may also use the {archetypeArmoryData?.faction ?? 'allied faction'} Armory.
              </div>
              {archetypeArmoryLoading || !archetypeArmoryData ? (
                <div className="text-zinc-500 italic text-sm text-center py-8">
                  Loading {archetypeArmoryData?.faction ?? 'faction'} Armoury…
                </div>
              ) : (() => {
                const foreignWeapons = (archetypeArmoryData.armory_general.weapons ?? []) as ArmoryItem[];
                const foreignEquip = ((archetypeArmoryData.armory_general.equipment ?? []) as ArmoryItem[]).filter(a => !a.category);
                return ([['weapons', foreignWeapons], ['equipment', foreignEquip]] as [Section, ArmoryItem[]][]).map(([sec, items]) => (
                  <div key={sec}>
                    <div className="text-[11px] text-amber-700 uppercase tracking-widest mb-1">{sec === 'weapons' ? 'Weapons' : 'Equipment'}</div>
                    {items.length === 0
                      ? <div className="text-zinc-500 italic text-sm text-center py-2">No items in this section</div>
                      : items.map((arm, i) => {
                        const pts = getItemPts(arm);
                        const blocked = pts === null;
                        return (
                          <ArmoryItemRow
                            key={i} arm={arm} isChar={isChar}
                            justAdded={lastAdded === arm.name}
                            disabled={blocked}
                            selectedArmoryId={getSelId(arm.name, sec)}
                            ptsOverride={pts}
                            onRemove={removeItem}
                            onAdd={() => !blocked && add(arm, `${archetype} — ${archetypeArmoryData.faction} Armoury`, sec)}
                          />
                        );
                      })
                    }
                  </div>
                ));
              })()}
            </div>
          ) : effectiveSection === 'equipment' ? (
            <EquipmentGroups
              regular={regularEquip} veteran={veteranEquip} vehicle={vehicleEquip}
              isChar={isChar} isVehicle={isVehicle} isMonster={unit.is_monster}
              unitSize={item.size} unitWounds={woundCount}
              profileAbilityNames={profileAbilityNames}
              armoryVetMax={armoryVetMax} veteranItemsUsed={veteranItemsUsed} veteranSlotsFull={veteranSlotsFull}
              filterCategory={filterCategory}
              lastAdded={lastAdded}
              markless={isMarklessFaction}
              getPts={getItemPts}
              isUniqueSelected={arm => isAddBlocked(arm, 'equipment')}
              getSelId={name => getSelId(name, 'equipment')}
              onRemove={removeItem}
              onAdd={arm => {
                if (isAddBlocked(arm, 'equipment')) return;
                const tw = requiresWeaponTarget(arm.desc) ? (eqTargetWeapon[arm.name] || undefined) : undefined;
                const cp = arm.name === 'Paragon of war' ? (eqExarchPower[arm.name] || undefined) : undefined;
                add(arm, tab === 'mark' ? `${effectiveMark} Armoury` : 'General', effectiveSection, tw, cp);
              }}
              availableWeapons={availableWeapons}
              eqTargetWeapon={eqTargetWeapon}
              onSetEqTargetWeapon={(name, w) => setEqTargetWeapon(prev => ({ ...prev, [name]: w }))}
              eqExarchPower={eqExarchPower}
              onSetEqExarchPower={(name, p) => setEqExarchPower(prev => ({ ...prev, [name]: p }))}
              daemonWeapon={{
                pool: getDaemonWeaponPool(),
                selections: daemonWeaponSelections,
                dwTargetWeapon,
                onSetTargetWeapon: (n, w) => setDwTargetWeapon(prev => ({ ...prev, [n]: w })),
                isTakenElsewhere: arm => uniqueArmyBlocked(arm, 'daemon_weapons'),
                onAdd: (arm, tw) => add(arm, tab === 'mark' ? `${effectiveMark} Armoury` : 'General', 'daemon_weapons', tw),
                onRemove: removeItem,
              }}
            />
          ) : (
            (() => {
              const items = getItems(effectiveSection);
              return items.length === 0
                ? <div className="text-zinc-500 italic text-sm text-center py-8">No items in this section</div>
                : items.map((arm, i) => (
                  <ArmoryItemRow
                    key={i} arm={arm} isChar={isChar} markless={isMarklessFaction}
                    justAdded={lastAdded === arm.name}
                    disabled={isAddBlocked(arm, effectiveSection)}
                    selectedArmoryId={getSelId(arm.name, effectiveSection)}
                    ptsOverride={getItemPts(arm)}
                    onRemove={removeItem}
                    onAdd={() => !isAddBlocked(arm, effectiveSection) && add(arm, tab === 'mark' ? `${effectiveMark} Armoury` : 'General', effectiveSection)}
                  />
                ));
            })()
          )}
        </div>

        <div className="px-4 py-3 border-t border-zinc-700 flex justify-end bg-zinc-800">
          <button onClick={onClose} className="px-4 py-1.5 bg-zinc-700 border border-zinc-600 text-zinc-200 text-sm hover:bg-zinc-600 uppercase tracking-wide">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Equipment groups renderer ────────────────────────────────────────────────

interface EquipGroupsProps {
  regular: ArmoryItem[];
  veteran: ArmoryItem[];
  vehicle: ArmoryItem[];
  isChar: boolean;
  isVehicle: boolean;
  isMonster: boolean;
  unitSize: number;
  unitWounds: number;
  profileAbilityNames: Set<string>;
  armoryVetMax: number | null;
  veteranItemsUsed: number;
  veteranSlotsFull: boolean;
  filterCategory?: 'veteran' | 'vehicle';
  lastAdded: string | null;
  /** When true, the items come from a mark-less armory (the Horus Heresy supplement): a
   * trailing ᵀ means Terminator-compat (term_compat), NOT Mark of Tzeentch, so no mark gating
   * or mark badge must be derived from the item name. See ki-hh-tcollision-01. */
  markless?: boolean;
  /** Computes the correct price for this unit type (handles CD Greater Daemon vs regular). */
  getPts?: (arm: ArmoryItem) => number | null;
  isUniqueSelected?: (arm: ArmoryItem) => boolean;
  getSelId?: (name: string) => string | undefined;
  onRemove?: (id: string) => void;
  onAdd: (arm: ArmoryItem) => void;
  /** Weapons available on this unit — used for the weapon-target picker */
  availableWeapons?: string[];
  /** Current weapon target selections for equipment that requires a target */
  eqTargetWeapon?: Record<string, string>;
  onSetEqTargetWeapon?: (itemName: string, weaponName: string) => void;
  /** Eldar "Paragon of war" — chosen Exarch Power, keyed by item name */
  eqExarchPower?: Record<string, string>;
  onSetEqExarchPower?: (itemName: string, powerName: string) => void;
  /** Inline "Daemon weapon"/"Greater Daemon weapon" ability picker — only passed by the one
   *  EquipmentGroups call site whose armory source can actually contain those gateway items
   *  (CSM's General/Mark tab); the row-name check below is a no-op everywhere else. */
  daemonWeapon?: {
    pool: ArmoryItem[];
    selections: { id: string; itemName: string; targetWeapon?: string }[];
    dwTargetWeapon: Record<string, string>;
    onSetTargetWeapon: (itemName: string, weaponName: string) => void;
    isTakenElsewhere: (arm: ArmoryItem) => boolean;
    onAdd: (arm: ArmoryItem, targetWeapon?: string) => void;
    onRemove: (id: string) => void;
  };
}

function EquipmentGroups({
  regular, veteran, vehicle,
  isChar, isVehicle, isMonster,
  unitSize, unitWounds,
  profileAbilityNames,
  armoryVetMax, veteranItemsUsed, veteranSlotsFull,
  filterCategory,
  lastAdded,
  markless = false,
  getPts,
  isUniqueSelected,
  getSelId, onRemove,
  onAdd,
  daemonWeapon,
  availableWeapons = [],
  eqTargetWeapon = {},
  onSetEqTargetWeapon,
  eqExarchPower = {},
  onSetEqExarchPower,
}: EquipGroupsProps) {
  // Build a per-model/per-wound price label for veteran abilities
  function vetPriceLabel(arm: ArmoryItem): string {
    if (isVehicle || isMonster) {
      const vp = parsePrice(arm.p_veh);
      if (vp == null) return '—';
      const total = vp * unitWounds * unitSize;
      return `+${total} pts (${vp}/wound)`;
    }
    if (isChar) {
      const cp = parsePrice(arm.p_char) ?? parsePrice(arm.p_unit);
      return cp != null ? `+${cp} pts` : '—';
    }
    const up = parsePrice(arm.p_unit);
    return up != null ? `+${up * unitWounds * unitSize} pts (${up}/wound)` : '—';
  }

  function vehPriceLabel(arm: ArmoryItem): string {
    const p = parsePrice(arm.p_unit);
    return p != null ? `+${p * unitSize} pts` : '—';
  }
  // Regular equipment only in full armory; veteran/vehicle only via their dedicated buttons
  const showRegular = !filterCategory && regular.length > 0;
  const showVeteran = filterCategory === 'veteran' && veteran.length > 0;
  const showVehicle = filterCategory === 'vehicle' && vehicle.length > 0 && isVehicle;

  const hasAnything = showRegular || showVeteran || showVehicle;
  if (!hasAnything) {
    return <div className="text-zinc-500 italic text-sm text-center py-8">No items in this section</div>;
  }

  return (
    <div className="space-y-3">
      {/* Regular equipment — hidden when opened via category button */}
      {showRegular && (
        <div className="space-y-1">
          {regular.map((arm, i) => {
            const uniqueSel = isUniqueSelected ? isUniqueSelected(arm) : false;
            const needsTarget = requiresWeaponTarget(arm.desc) && availableWeapons.length > 0;
            const chosenTarget = eqTargetWeapon[arm.name] ?? '';
            const needsPower = arm.name === 'Paragon of war';
            const chosenPower = eqExarchPower[arm.name] ?? '';
            const canAdd = !uniqueSel && (!needsTarget || chosenTarget !== '') && (!needsPower || chosenPower !== '');
            return (
              <div key={i}>
                <ArmoryItemRow
                  arm={arm} isChar={isChar} markless={markless}
                  justAdded={lastAdded === arm.name}
                  disabled={!canAdd}
                  selectedArmoryId={getSelId ? getSelId(arm.name) : undefined}
                  ptsOverride={getPts ? getPts(arm) : undefined}
                  onRemove={onRemove}
                  onAdd={() => canAdd && onAdd(arm)}
                />
                {/* Weapon target picker — shown when item needs to target a specific weapon */}
                {needsTarget && !uniqueSel && !(getSelId?.(arm.name)) && (
                  <div className="px-3 pb-2 flex items-center gap-2 bg-zinc-800/40 border-l border-r border-b border-zinc-700">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wide shrink-0">Apply to:</span>
                    <select
                      value={chosenTarget}
                      onChange={e => onSetEqTargetWeapon?.(arm.name, e.target.value)}
                      className="flex-1 bg-zinc-900 border border-zinc-600 text-zinc-200 text-[11px] px-2 py-0.5 focus:outline-none focus:border-amber-600"
                    >
                      <option value="">— select a weapon —</option>
                      {availableWeapons.map(wn => (
                        <option key={wn} value={wn}>{wn}</option>
                      ))}
                    </select>
                  </div>
                )}
                {/* Exarch Power picker — shown for Eldar's "Paragon of war" */}
                {needsPower && !uniqueSel && !(getSelId?.(arm.name)) && (
                  <div className="px-3 pb-2 flex items-center gap-2 bg-zinc-800/40 border-l border-r border-b border-zinc-700">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wide shrink-0">Exarch power:</span>
                    <select
                      value={chosenPower}
                      onChange={e => onSetEqExarchPower?.(arm.name, e.target.value)}
                      className="flex-1 bg-zinc-900 border border-zinc-600 text-zinc-200 text-[11px] px-2 py-0.5 focus:outline-none focus:border-amber-600"
                    >
                      <option value="">— select a power —</option>
                      {ELDAR_EXARCH_POWERS.map(pn => (
                        <option key={pn} value={pn}>{pn}</option>
                      ))}
                    </select>
                  </div>
                )}
                {/* Daemon weapon ability picker — shown inline right under whichever gateway
                    item ("Daemon weapon" / "Greater Daemon weapon") this unit has bought, so
                    picking the abilities doesn't require hunting down a separate tab. */}
                {daemonWeapon && (arm.name === 'Daemon weapon' || arm.name === 'Greater Daemon weapon') && getSelId?.(arm.name) && (
                  <DaemonWeaponPicker
                    pool={daemonWeapon.pool}
                    cap={arm.name === 'Greater Daemon weapon' ? 2 : 1}
                    selections={daemonWeapon.selections}
                    lastAdded={lastAdded}
                    availableWeapons={availableWeapons}
                    dwTargetWeapon={daemonWeapon.dwTargetWeapon}
                    onSetTargetWeapon={daemonWeapon.onSetTargetWeapon}
                    isTakenElsewhere={daemonWeapon.isTakenElsewhere}
                    onAdd={daemonWeapon.onAdd}
                    onRemove={daemonWeapon.onRemove}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Veteran abilities */}
      {showVeteran && (
        <div>
          {!filterCategory && (
            <div className="flex items-center gap-2 mb-1 border-t border-zinc-700 pt-2">
              <span className="text-[10px] text-amber-600 uppercase tracking-widest">Veteran Abilities</span>
              {armoryVetMax !== null && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 border ${
                  veteranSlotsFull
                    ? 'bg-red-900/40 border-red-700 text-red-400'
                    : 'bg-amber-900/30 border-amber-700 text-amber-400'
                }`}>
                  {veteranItemsUsed}/{armoryVetMax}
                </span>
              )}
            </div>
          )}
          {filterCategory === 'veteran' && armoryVetMax !== null && (
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest">Slots used:</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 border ${
                veteranSlotsFull
                  ? 'bg-red-900/40 border-red-700 text-red-400'
                  : 'bg-amber-900/30 border-amber-700 text-amber-400'
              }`}>
                {veteranItemsUsed}/{armoryVetMax}
              </span>
            </div>
          )}
          <div className="space-y-1">
            {veteran.map((arm, i) => {
              const inProfile = profileAbilityNames.has(arm.name.toLowerCase());
              return (
                <ArmoryItemRow
                  key={i} arm={arm} isChar={isChar} markless={markless}
                  disabled={(armoryVetMax !== null && veteranSlotsFull && !inProfile) || inProfile}
                  justAdded={lastAdded === arm.name}
                  priceLabel={vetPriceLabel(arm)}
                  inProfile={inProfile}
                  selectedArmoryId={getSelId ? getSelId(arm.name) : undefined}
                  onRemove={onRemove}
                  onAdd={() => !inProfile && onAdd(arm)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Vehicle upgrades */}
      {showVehicle && (
        <div>
          {!filterCategory && (
            <div className="text-[10px] text-amber-600 uppercase tracking-widest mb-1 border-t border-zinc-700 pt-2">
              Vehicle Upgrades
            </div>
          )}
          <div className="space-y-1">
            {vehicle.map((arm, i) => (
              <ArmoryItemRow key={i} arm={arm} isChar={isChar} markless={markless} justAdded={lastAdded === arm.name} priceLabel={vehPriceLabel(arm)} selectedArmoryId={getSelId ? getSelId(arm.name) : undefined} onRemove={onRemove} onAdd={() => onAdd(arm)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Daemon weapon ability picker ────────────────────────────────────────────

function DaemonWeaponPicker({
  pool, cap, selections, lastAdded, availableWeapons,
  dwTargetWeapon, onSetTargetWeapon, isTakenElsewhere, onAdd, onRemove,
}: {
  pool: ArmoryItem[];
  cap: number;
  selections: { id: string; itemName: string; targetWeapon?: string }[];
  lastAdded: string | null;
  availableWeapons: string[];
  dwTargetWeapon: Record<string, string>;
  onSetTargetWeapon: (itemName: string, weaponName: string) => void;
  isTakenElsewhere: (arm: ArmoryItem) => boolean;
  onAdd: (arm: ArmoryItem, targetWeapon?: string) => void;
  onRemove: (id: string) => void;
}) {
  const capReached = selections.length >= cap;
  return (
    <div className="px-3 pb-2 pt-1.5 bg-zinc-800/40 border-l border-r border-b border-zinc-700 space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-amber-600 uppercase tracking-widest">Daemon Weapon Abilities</span>
        <span className={`text-[10px] font-bold px-1.5 py-0.5 border ${
          capReached ? 'bg-amber-900/30 border-amber-700 text-amber-400' : 'bg-zinc-800 border-zinc-600 text-zinc-400'
        }`}>
          {selections.length}/{cap}
        </span>
      </div>
      {pool.length === 0 ? (
        <div className="text-zinc-500 italic text-[11px] py-1">No daemon weapon traits available</div>
      ) : pool.map((arm, i) => {
        const sel = selections.find(s => s.itemName === arm.name);
        const takenElsewhere = isTakenElsewhere(arm);
        const unique = isUniqueItem(arm.desc);
        const needsWeapon = isWeaponTrait(arm.desc);
        const chosenWeapon = dwTargetWeapon[arm.name] ?? '';
        const canAdd = !sel && !takenElsewhere && !capReached && (!needsWeapon || chosenWeapon !== '');
        return (
          <div key={i} className={`border text-left ${takenElsewhere ? 'bg-zinc-800/40 border-zinc-700 opacity-50' : 'bg-zinc-900 border-zinc-700'}`}>
            <div className="flex justify-between items-start px-2 py-1.5 gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1 flex-wrap">
                  <span className={`text-[12px] font-medium ${lastAdded === arm.name ? 'text-green-400' : 'text-zinc-200'}`}>{arm.name}</span>
                  {lastAdded === arm.name && <span className="text-green-500 text-[10px] font-bold">✓ Added</span>}
                  {unique && <span className="text-[9px] bg-amber-900/60 text-amber-300 border border-amber-700 px-1 py-0.5 uppercase tracking-wide">Unique</span>}
                  {sel && <span className="text-[9px] bg-zinc-700 text-zinc-400 px-1 py-0.5 uppercase">Selected</span>}
                  {takenElsewhere && !sel && <span className="text-[9px] bg-red-900/50 text-red-400 border border-red-800 px-1 py-0.5 uppercase">Taken by another unit</span>}
                </div>
                {arm.desc && <div className="text-[10px] text-zinc-500 mt-0.5">{arm.desc}</div>}
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                {arm.p_char != null && (
                  <span className="text-amber-500 font-bold text-[11px] whitespace-nowrap">{arm.p_char >= 0 ? '+' : ''}{arm.p_char} pts</span>
                )}
                {sel ? (
                  <button
                    onClick={() => onRemove(sel.id)}
                    className="text-[10px] px-1.5 py-0.5 border uppercase tracking-wide bg-red-900/60 border-red-700 text-red-300 hover:bg-red-800"
                  >
                    Remove
                  </button>
                ) : !takenElsewhere && (
                  <button
                    onClick={() => onAdd(arm, needsWeapon ? (chosenWeapon || undefined) : undefined)}
                    disabled={!canAdd}
                    className={`text-[10px] px-1.5 py-0.5 border uppercase tracking-wide transition-colors ${
                      canAdd
                        ? 'bg-amber-900/60 border-amber-700 text-amber-300 hover:bg-amber-800'
                        : 'bg-zinc-700 border-zinc-600 text-zinc-500 cursor-not-allowed'
                    }`}
                  >
                    {needsWeapon && !chosenWeapon ? 'Pick weapon ↓' : capReached ? 'Cap reached' : 'Add'}
                  </button>
                )}
              </div>
            </div>
            {needsWeapon && !sel && !takenElsewhere && !capReached && (
              <div className="px-2 pb-1.5 flex items-center gap-2">
                <span className="text-[10px] text-zinc-400 uppercase tracking-wide">Apply to:</span>
                <select
                  value={chosenWeapon}
                  onChange={e => onSetTargetWeapon(arm.name, e.target.value)}
                  className="flex-1 bg-zinc-900 border border-zinc-600 text-zinc-200 text-[11px] px-2 py-0.5 focus:outline-none focus:border-amber-600"
                >
                  <option value="">— select a weapon —</option>
                  {availableWeapons.map(wn => (
                    <option key={wn} value={wn}>{wn}</option>
                  ))}
                </select>
              </div>
            )}
            {sel?.targetWeapon && (
              <div className="px-2 pb-1.5 text-[10px] text-zinc-500 italic">Applied to: {sel.targetWeapon}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Item rows ────────────────────────────────────────────────────────────────

function ArmoryItemRow({
  arm, isChar, disabled = false, justAdded = false, priceLabel, inProfile = false, onAdd,
  selectedArmoryId, onRemove,
  ptsOverride, markless = false,
}: {
  arm: ArmoryItem;
  isChar: boolean;
  disabled?: boolean;
  justAdded?: boolean;
  priceLabel?: string;
  inProfile?: boolean;
  onAdd: () => void;
  selectedArmoryId?: string;
  onRemove?: (id: string) => void;
  /** Override the price display. null = show "—" (cannot be purchased). undefined = use existing isChar logic. */
  ptsOverride?: number | null;
  /** True for Horus Heresy supplement items: a trailing ᵀ is Terminator-compat, not Mark of Tzeentch. */
  markless?: boolean;
}) {
  const requiredMark = markless ? null : itemRequiredMark(arm.name);
  const displayName = markless ? arm.name : stripMarkGlyph(arm.name);
  const markBadgeClass = requiredMark ? (MARK_BADGE[requiredMark] ?? 'bg-zinc-800 text-zinc-300 border-zinc-600') : '';

  const charPrice = parsePrice(arm.p_char);
  const unitPrice = parsePrice(arm.p_unit);
  // Use ptsOverride when explicitly provided (including null); fall back to isChar logic
  const pts = ptsOverride !== undefined ? ptsOverride : (isChar ? (charPrice ?? unitPrice) : unitPrice);
  const priceIsNull = pts === null;
  const displayPrice = priceLabel ?? (priceIsNull ? '—' : (pts != null ? `${pts >= 0 ? '+' : ''}${pts} pts` : '—'));

  if (selectedArmoryId && onRemove) {
    return (
      <div className="w-full flex justify-between items-start px-3 py-2 border text-left gap-2 bg-zinc-800/50 border-zinc-600">
        <div className="min-w-0">
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-sm font-medium text-zinc-400">{displayName}</span>
            <span className="text-[9px] bg-zinc-700 text-zinc-400 px-1 py-0.5 uppercase">Selected</span>
            {requiredMark && (
              <span className={`text-[9px] border px-1 py-0.5 uppercase tracking-wide ${markBadgeClass}`}>{requiredMark}</span>
            )}
            {isItemGravisCompat(arm) && (
              <span className="text-[9px] bg-blue-800 text-white px-1 py-0.5 uppercase">Gravis</span>
            )}
            {isItemTermCompat(arm) && (
              <span className="text-[9px] bg-amber-800 text-white px-1 py-0.5 uppercase">Term</span>
            )}
          </div>
          {arm.desc && <div className="text-[11px] text-zinc-500 mt-0.5">{arm.desc}</div>}
          <ArmoryWeaponStats arm={arm} />
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="font-bold text-sm whitespace-nowrap text-zinc-500">{displayPrice}</span>
          <button
            onClick={() => onRemove(selectedArmoryId)}
            className="text-[11px] px-2 py-0.5 border uppercase tracking-wide bg-red-900/60 border-red-700 text-red-300 hover:bg-red-800"
          >
            Remove
          </button>
          {/* A multi-model squad where every model has its own Armory access (e.g. Orks Nobz,
              GitHub #3) may take more than one copy of the same item — `disabled` already
              reflects whether the per-model cap (item.size) has been reached, so once an item
              is selected this still offers another pick until that cap is hit. */}
          {!disabled && (
            <button
              onClick={onAdd}
              className="text-[11px] px-2 py-0.5 border uppercase tracking-wide bg-emerald-900/40 border-emerald-700 text-emerald-300 hover:bg-emerald-800/60"
            >
              + Add another
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={onAdd}
      disabled={disabled || priceIsNull}
      className={`w-full flex justify-between items-start px-3 py-2 border text-left gap-2 transition-all duration-200
        ${inProfile
          ? 'bg-zinc-800/50 border-zinc-700 opacity-50 cursor-not-allowed'
          : (disabled || priceIsNull)
            ? 'bg-zinc-800 border-zinc-700 opacity-40 cursor-not-allowed'
            : justAdded
              ? 'bg-green-900/30 border-green-600'
              : 'bg-zinc-800 border-zinc-700 hover:border-amber-700 hover:bg-zinc-700'
        }`}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-1 flex-wrap">
          <span className={`text-sm font-medium transition-colors ${justAdded ? 'text-green-400' : 'text-zinc-200'}`}>
            {displayName}
          </span>
          {justAdded && <span className="text-green-500 text-xs font-bold">✓ Added</span>}
          {inProfile && <span className="text-[9px] bg-zinc-700 text-zinc-400 px-1 py-0.5 uppercase tracking-wide">In profile</span>}
          {requiredMark && (
            <span className={`text-[9px] border px-1 py-0.5 uppercase tracking-wide ${markBadgeClass}`}>{requiredMark}</span>
          )}
          {arm.gravis_compat && (
            <span className="text-[9px] bg-blue-800 text-white px-1 py-0.5 uppercase">Gravis</span>
          )}
          {arm.term_compat && (
            <span className="text-[9px] bg-amber-800 text-white px-1 py-0.5 uppercase">Term</span>
          )}
        </div>
        {arm.desc && <div className="text-[11px] text-zinc-500 mt-0.5">{arm.desc}</div>}
        <ArmoryWeaponStats arm={arm} />
      </div>
      <span className={`font-bold text-sm whitespace-nowrap shrink-0 ${justAdded ? 'text-green-400' : inProfile ? 'text-zinc-500' : priceIsNull ? 'text-zinc-500' : 'text-amber-500'}`}>
        {inProfile ? '(free slot)' : displayPrice}
      </span>
    </button>
  );
}

function ArmoryWeaponStats({ arm }: { arm: ArmoryItem }) {
  if (arm.profiles && arm.profiles.length > 0) {
    return (
      <div className="mt-0.5 space-y-0.5">
        {arm.profiles.map((p, i) => (
          <div key={i} className="text-[10px] text-zinc-600">
            <span className="text-zinc-500 italic">{p.name}:</span>{' '}
            {p.range} · {p.type} · S{p.s} AP{p.ap} D{p.d}
            {p.abilities && p.abilities !== '-' && <span> · {p.abilities}</span>}
          </div>
        ))}
      </div>
    );
  }
  if (arm.range) {
    return (
      <div className="text-[10px] text-zinc-600 mt-0.5">
        {arm.range} · {arm.type} · S{arm.s} AP{arm.ap} D{arm.d}
        {arm.abilities && arm.abilities !== '-' && <span> · {arm.abilities}</span>}
      </div>
    );
  }
  if (arm.abilities) {
    return <div className="text-[10px] text-zinc-600 italic mt-0.5">{arm.abilities}</div>;
  }
  return <div className="text-[10px] text-zinc-600 italic mt-0.5">— see faction rules for profile</div>;
}
