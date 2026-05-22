import type { Unit, Model, Weapon, ArmoryItem, FactionData } from '../types/data';
import type { RosterEntry, ArmyState, Mark, ArmorySelection } from '../types/army';
import type { EquipMods } from './equipMods';
import { computeUnitPoints, getActiveVariant } from './points';
import { getArchetypeRule, getEffectiveSlot } from './archetypes';
import { parseEquipMods, isWeaponTrait, extractWeaponGains } from './equipMods';
import { getTraitEffects } from './traitEffects';
import { csmResolve } from './resolver-csm';

// ── Output type ───────────────────────────────────────────────────────────────

export interface ResolvedProfile {
  pts: number;
  effectiveSlot: string;

  // Mark
  effectiveMark: Mark | null;
  markIsForced: boolean;
  markIsLocked: boolean;
  statModMark: Mark | null;
  markUsesVetSlot: boolean;
  vetMax: number;

  // Models
  variant: Model | null;
  variantActive: boolean;
  modelsToShow: Model[];
  squadLeaderIdx: number;

  // Psyker
  isTzeentchPsyker: boolean;
  isOptionalPsyker: boolean;
  psykerGroupIdx: number;
  effectivePsyker: boolean;

  // Display
  isFavored: boolean;
  equippedWith: string;
  weapons: Weapon[];
  weaponTraitMap: Map<string, string[]>;
  injectedAbilities: string[];
  equipMods: EquipMods;

  // Trait effects
  traitStatMods: Array<{ stat: string; delta: number }>;
  traitAbilities: Array<{ traitName: string; name: string; desc?: string }>;
  traitWeaponAbilities: Array<{ traitName: string; name: string; weapon_type?: string }>;
}

// ── Shared utility ────────────────────────────────────────────────────────────

export function findArmoryItem(data: FactionData, sel: ArmorySelection): ArmoryItem | undefined {
  const section = sel.section as keyof typeof data.armory_general;
  const sources = [
    data.armory_general,
    ...Object.values(data.armory_marks),
    ...Object.values(data.armory_legions),
  ];
  for (const armory of sources) {
    const found = (armory[section] as ArmoryItem[]).find(a => a.name === sel.itemName);
    if (found) return found;
  }
  return undefined;
}

// ── Generic base resolver ─────────────────────────────────────────────────────

function resolveBase(item: RosterEntry, unit: Unit, state: ArmyState, data: FactionData): ResolvedProfile {
  const rule = getArchetypeRule(state.archetype);

  // Points & slot
  const pts = computeUnitPoints(item, unit, state.archetype);
  const effectiveSlot = getEffectiveSlot(item.unitName, item.slot, rule);

  // Variant model
  const variant = getActiveVariant(item, unit);
  const variantActive = !!variant;

  // Mark resolution
  const effectiveMark = (unit.locked_mark ?? (rule?.forcedMark as Mark | null) ?? item.mark) as Mark | null;
  const markIsForced = !unit.locked_mark && !!rule?.forcedMark;
  const markIsLocked = !!unit.locked_mark;
  const statModMark = unit.locked_mark
    ? null
    : (item.mark ?? (markIsForced ? ((rule!.forcedMark as Mark) ?? null) : null)) as Mark | null;
  const hasMarkGroup = unit.option_groups.some(g => g.constraint.type === 'mark');
  const markUsesVetSlot = hasMarkGroup && !unit.locked_mark && !!effectiveMark;
  const vetMax = Math.max(0, (unit.veteran_max ?? 2) - (markUsesVetSlot ? 1 : 0));

  // Models to display
  const modelsToShow: Model[] = variant
    ? [variant, ...unit.models.filter(m => m.max > 0).slice(1)]
    : unit.models.filter(m => m.max > 0);
  const squadLeaderIdx = modelsToShow.length <= 1 ? 0 : (() => {
    const idx = modelsToShow.findIndex(m => m.min === 0);
    return idx >= 0 ? idx : modelsToShow.length - 1;
  })();

  // Psyker flags
  const psykerGroupIdx = unit.option_groups.findIndex(
    g => /psyker/i.test(g.header) && g.inline_pts != null,
  );
  const isOptionalPsyker = !unit.is_psyker && psykerGroupIdx >= 0 &&
    (item.optionQty[psykerGroupIdx]?.['__inline'] ?? 0) > 0;
  const isTzeentchPsyker = unit.is_character && !unit.is_psyker && statModMark === 'Tzeentch';
  const effectivePsyker = unit.is_psyker || isTzeentchPsyker || isOptionalPsyker;

  // Weapons & loadout (unmodified — faction resolvers apply overrides)
  const equippedWith = unit.equipped_with ?? '';
  const weapons: Weapon[] = [...unit.weapons];

  // Weapon-targeting daemon weapon traits
  const weaponTraitMap = new Map<string, string[]>();
  for (const sel of item.armory) {
    if (sel.section !== 'daemon_weapons' || !sel.targetWeapon) continue;
    const armItem = findArmoryItem(data, sel);
    if (!armItem?.desc || !isWeaponTrait(armItem.desc)) continue;
    const gains = extractWeaponGains(armItem.desc);
    if (gains.length > 0) {
      weaponTraitMap.set(sel.targetWeapon, [...(weaponTraitMap.get(sel.targetWeapon) ?? []), ...gains]);
    }
  }

  // Equipment mods
  const equipItems = item.armory
    .filter(a => a.section === 'equipment' ||
      (a.section === 'daemon_weapons' && !isWeaponTrait(findArmoryItem(data, a)?.desc)))
    .map(a => ({ name: a.itemName, desc: findArmoryItem(data, a)?.desc ?? '' }));
  const equipMods: EquipMods = parseEquipMods(equipItems);

  // Trait effects
  const isMainFaction = item.unitName in data.units;
  const traitStatMods: Array<{ stat: string; delta: number }> = [];
  const traitAbilities: Array<{ traitName: string; name: string; desc?: string }> = [];
  const traitWeaponAbilities: Array<{ traitName: string; name: string; weapon_type?: string }> = [];
  if (isMainFaction && item.traits.length > 0) {
    for (const t of item.traits) {
      for (const e of getTraitEffects(t.name, unit)) {
        if (e.type === 'stat_mod')      traitStatMods.push({ stat: e.stat, delta: e.delta });
        else if (e.type === 'inv_save') traitAbilities.push({ traitName: t.name, name: `${e.value}+ Invulnerability Save` });
        else if (e.type === 'unit_ability')   traitAbilities.push({ traitName: t.name, name: e.name, desc: e.desc });
        else if (e.type === 'weapon_ability') traitWeaponAbilities.push({ traitName: t.name, name: e.name, weapon_type: e.weapon_type });
      }
    }
  }

  return {
    pts, effectiveSlot,
    effectiveMark, markIsForced, markIsLocked, statModMark, markUsesVetSlot, vetMax,
    variant, variantActive, modelsToShow, squadLeaderIdx,
    isTzeentchPsyker, isOptionalPsyker, psykerGroupIdx, effectivePsyker,
    isFavored: false,
    equippedWith, weapons, weaponTraitMap,
    injectedAbilities: [],
    equipMods,
    traitStatMods, traitAbilities, traitWeaponAbilities,
  };
}

// ── Faction resolver registry ─────────────────────────────────────────────────

export type FactionResolverFn = (
  base: ResolvedProfile,
  item: RosterEntry,
  unit: Unit,
  state: ArmyState,
  data: FactionData,
) => ResolvedProfile;

const FACTION_RESOLVERS: Partial<Record<string, FactionResolverFn>> = {
  'Chaos Space Marines': csmResolve,
};

// ── Public API ────────────────────────────────────────────────────────────────

export function resolveUnitProfile(
  item: RosterEntry,
  unit: Unit,
  state: ArmyState,
  data: FactionData,
): ResolvedProfile {
  const base = resolveBase(item, unit, state, data);
  const factionFn = FACTION_RESOLVERS[state.faction];
  return factionFn ? factionFn(base, item, unit, state, data) : base;
}
