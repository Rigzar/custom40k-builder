import type { Unit, Model, Weapon, ArmoryItem, FactionData, OptionCondition, OptionEffect } from '../types/data';
import type { RosterEntry, ArmyState, Mark, ArmorySelection } from '../types/army';
import type { EquipMods } from './equipMods';
import { computeUnitPoints, getActiveVariant, getPromotedModel } from './points';
import { getArchetypeRule, getEffectiveSlot } from './archetypes';
import { parseEquipMods, isWeaponTrait, extractWeaponGains, isGrantWeapon, extractGrantedWeaponName } from './equipMods';
import { mergeWeaponAbilities } from './abilityMerge';
import { getTraitEffects } from './traitEffects';
import { csmResolve } from './codex_csm/resolver';
import { cdResolve } from './resolvers/chaos_daemons';
import { smResolve } from './resolvers/space_marines';

// ── Output type ───────────────────────────────────────────────────────────────

export interface WeaponGroup {
  /** Model-group name (e.g. "Traitor Guardsman", "Chaos Ogryn", or a built-in Champion's
   * name); null when the unit has only one weapon group. */
  label: string | null;
  /** "[N]x" prefix to show for every weapon in this group; null = no prefix. */
  count: number | null;
  weapons: Weapon[];
  /** Weapon-ability injections to apply when rendering this group's rows; defaults to the
   * profile's overall weaponTraitMap when absent (set when a group needs its own, e.g. a
   * Character-only daemon weapon trait that only modifies the Champion's copy). */
  traitMap?: Map<string, string[]>;
  /** Per-weapon-name count override, keyed by exact weapon name — takes priority over `count`
   * for that one row. Set when independent option groups (e.g. "every model's Lasgun may be
   * replaced" + a separate "per 10 models, one Lasgun may become a Flamer") let only a SUBSET
   * of this group's models take a swap, so the base weapon and the swapped-in weapon each need
   * their own count instead of sharing the group's full model count. */
  countOverrides?: Map<string, number>;
}

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
  /** Per-entry count to show as an "Nx" prefix alongside the model name; null = no prefix
   * (single/fixed model). Set when a promotion (e.g. Traitor Sergeant) splits the base
   * model's count from the promoted variant — parallel array to modelsToShow. */
  modelCounts: (number | null)[];
  squadLeaderIdx: number;

  // Psyker
  isTzeentchPsyker: boolean;
  isOptionalPsyker: boolean;
  psykerGroupIdx: number;
  effectivePsyker: boolean;

  // Display
  isFavored: boolean;
  /** True when unit.has_veteran_abilities OR archetype.grantVetAbilities includes this unit. */
  effectiveHasVetAbilities: boolean;
  equippedWith: string;
  weapons: Weapon[];
  /**
   * The weapons to actually display: built-in gear plus only the optional/choice
   * weapons that were selected. A weapon that also appears as a choice in an option
   * group is "optional" and is hidden until picked. Computed once here so UnitCard
   * and PrintView render identical lists.
   */
  weaponsToShow: Weapon[];
  /**
   * weaponsToShow split into per-model-group tables (e.g. Traitor Guardsman vs Chaos Ogryn,
   * or a built-in Champion's Armory-bought weapons kept out of the squad's shared table).
   * `label`/`count` are null when there's only one group, so single-group units render
   * identically to a flat weaponsToShow list.
   */
  weaponGroups: WeaponGroup[];
  /** Names of weapons added to `weapons` via an Armory item that "grants" a weapon
   * (daemon weapons, Hunter-killer missile, etc.) — used to route them into the
   * built-in Champion's own weapon group when the unit gates Armory access to them. */
  armoryGrantedWeapons: string[];
  weaponTraitMap: Map<string, string[]>;
  /** Like weaponTraitMap, but for Character-only (p_char-priced) daemon weapon traits on a
   * squad that has a built-in Champion/Sergeant — these modify only the Champion's personal
   * copy of the named weapon, not every copy the squad carries. Applied by computeWeaponGroups
   * to the Champion's weapon group only. */
  championWeaponTraitMap: Map<string, string[]>;
  /** Mark-derived ability injections (e.g. Warded, Warpflamer) — shown with "Mark" badge. */
  injectedAbilities: string[];
  /** Archetype / variant rule notes (e.g. Ascended DP, Goretide) — shown with "Rule" badge. */
  injectedRuleNotes: string[];
  equipMods: EquipMods;

  // Trait effects
  traitStatMods: Array<{ stat: string; delta: number }>;
  traitAbilities: Array<{ traitName: string; name: string; desc?: string }>;
  traitWeaponAbilities: Array<{ traitName: string; name: string; weapon_type?: string }>;

  /** True when this HQ is the Black Crusade champion bearing all four Chaos god marks. */
  blackCrusadeChampion: boolean;

  // Option effects (ki-parser-02) — stat/type/ability changes a selected wargear option confers.
  /** Stat deltas from selected options (e.g. Daemon Prince wings M +6), stacked over base. */
  optionStatMods: Array<{ stat: string; delta: number }>;
  /** Unit types ADDED by selected options (additive), e.g. "Jump pack infantry". */
  optionAddedUnitTypes: string[];
  /** Unit-type line REPLACED by a selected option (datasheet "change type to X"); null if none. */
  optionSetUnitType: string | null;
  /** Special rules granted by selected options (e.g. "Deep strike") — shown with "Option" badge. */
  optionAbilities: string[];
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

/**
 * The squad's built-in Champion/Sergeant/etc. — the second model entry when it's a single
 * fixed model (min===1, max===1) alongside a variable-size squad model. Used both to keep
 * the Champion's own weapon group separate and to decide whether weapon-trait Armory items
 * scope to just this model.
 */
function getBuiltInChampion(unit: Unit): Model | null {
  return unit.models.length > 1 && unit.models[1].min === 1 && unit.models[1].max === 1 ? unit.models[1] : null;
}

/** True when the unit carries the given keyword (its Chaos Mark or any datasheet keyword). */
function unitHasKeyword(keyword: string, mark: string | null, keywords: string[]): boolean {
  const kw = keyword.toLowerCase();
  if ((mark ?? '').toLowerCase() === kw) return true;
  return keywords.some(k => {
    const lk = k.toLowerCase();
    return lk === kw || lk === `mark of ${kw}`;
  });
}

/**
 * Evaluate a BSData-style availability condition (see OptionCondition). Returns whether the
 * option group is available.
 *   scope 'unit'      → match the keyword against the model's own mark / keywords.
 *   scope 'force'     → match against the host army's faction name (exact, case-insensitive).
 *   scope 'archetype' → match against the army's selected archetype name (exact, case-insensitive).
 *   scope 'roster'    → reserved (treated as force match for now).
 */
export function isOptionAvailable(
  cond: OptionCondition | undefined,
  mark: string | null,
  keywords: string[],
  hostFaction?: string | null,
  archetype?: string | null,
): boolean {
  if (!cond) return true;
  let has: boolean;
  if (cond.scope === 'unit') {
    has = unitHasKeyword(cond.keyword, mark, keywords);
  } else if (cond.scope === 'archetype') {
    has = (archetype ?? '').toLowerCase() === cond.keyword.toLowerCase();
  } else {
    has = (hostFaction ?? '').toLowerCase() === cond.keyword.toLowerCase();
  }
  return cond.type === 'instanceOf' ? has : !has;
}

/**
 * Filter a weapon list down to what should be displayed: drop optional/choice
 * weapons that were not selected. A weapon counts as optional when it also appears
 * as a choice in some option group; built-in gear (not in any group) is always shown.
 */
export function computeWeaponsToShow(weapons: Weapon[], unit: Unit, item: RosterEntry): Weapon[] {
  // Multi-profile weapons are stored as several entries named "<Weapon> - <Profile>"
  // (e.g. "Plasma blastgun - Rapid"). An option choice names the parent weapon ("Plasma
  // blastgun"), so match a choice against the weapon name BEFORE the " - " profile suffix.
  const baseName = (n: string) => n.split(' - ')[0];

  // Map each weapon (by base name) granted by an option choice to the choice name(s) that
  // unlock it. Compound choices ("Chainsword & Laspistol") are split so both weapons are
  // recognised as optional, not just an exact name match against the whole choice.
  const optionalWeapons = new Map<string, Set<string>>();
  for (const g of unit.option_groups) {
    for (const c of g.choices) {
      const parts = c.name.split(/\s*(?:&|\band\b)\s*/i).filter(Boolean);
      for (const part of parts.length > 1 ? parts : [c.name]) {
        if (unit.weapons.some(w => baseName(w.name) === part)) {
          if (!optionalWeapons.has(part)) optionalWeapons.set(part, new Set());
          optionalWeapons.get(part)!.add(c.name);
        }
      }
    }
  }

  // Weapons exclusive to a secondary model that hasn't been bought yet (e.g. Chaos
  // Ogryn's Power maul before any Ogryn is added) aren't part of the starting loadout.
  const zeroCountModelWeapons = new Set<string>();
  for (const m of unit.models.slice(1)) {
    if (m.min > 0) continue;
    // Only applies to multi-group units with per-group size tracking (e.g. Traitor Guard's
    // Chaos Ogryn). Units without modelSizes aren't using this "buy extra models" pattern
    // for display purposes, so leave their datasheet weapons untouched.
    if (!item.modelSizes) continue;
    const count = item.modelSizes[m.name] ?? m.min;
    if (count > 0) continue;
    const equipMatch = unit.equipped_with.match(new RegExp(`Every ${m.name} is equipped with:\\s*([^.]+)\\.`, 'i'));
    const equipText = equipMatch?.[1];
    if (!equipText) continue;
    for (const name of equipText.split(/;|\band\b/i).map(s => s.trim()).filter(Boolean)) {
      zeroCountModelWeapons.add(name);
    }
  }

  const hasReplaceGroup = unit.option_groups.some(g => g.replaces && g.replaces.length > 0);
  if (optionalWeapons.size === 0 && !hasReplaceGroup && zeroCountModelWeapons.size === 0) return weapons;

  const selectedChoiceNames = new Set<string>();
  // Sum of qty taken across ALL groups that replace each weapon name — multiple independent
  // groups can each chip away at the same base weapon (e.g. Traitor Guard's "every model's
  // Lasgun may be replaced by Chainsword & Laspistol" AND its separate "per 10 models, one
  // Lasgun may become a Flamer/Melter/Plasma gun" both reduce the same Lasgun count). The
  // weapon is only fully removed once the combined qty reaches the full squad size; below
  // that it stays visible — computeWeaponGroups assigns the correct partial count to each
  // weapon (this function only decides presence, not the displayed "Nx" count).
  const replacedWeaponQty = new Map<string, number>();
  for (const [gi, ch] of Object.entries(item.optionQty ?? {})) {
    const g = unit.option_groups[Number(gi)];
    if (!g) continue;
    const groupQty = Object.entries(ch)
      .filter(([ci]) => ci !== '__inline')
      .reduce((sum, [, qty]) => sum + (Number(qty) || 0), 0);
    if (g.replaces?.length && groupQty > 0) {
      for (const name of g.replaces) replacedWeaponQty.set(name, (replacedWeaponQty.get(name) ?? 0) + groupQty);
    }
    for (const [ci, qty] of Object.entries(ch)) {
      if (ci === '__inline' || !qty) continue;
      const choice = g.choices[parseInt(ci)];
      if (choice) selectedChoiceNames.add(choice.name);
    }
  }
  const replacedWeaponNames = new Set<string>();
  for (const [name, qty] of replacedWeaponQty) {
    if (qty >= item.size) replacedWeaponNames.add(name);
  }
  return weapons.filter(w => {
    if (replacedWeaponNames.has(w.name)) return false;
    if (zeroCountModelWeapons.has(w.name)) return false;
    const owningChoices = optionalWeapons.get(baseName(w.name));
    if (!owningChoices) return true;
    return [...owningChoices].some(cn => selectedChoiceNames.has(cn));
  });
}

// ── Generic base resolver ─────────────────────────────────────────────────────

function resolveBase(item: RosterEntry, unit: Unit, state: ArmyState, data: FactionData): ResolvedProfile {
  const rule = getArchetypeRule(state.archetype);

  // Points & slot
  const pts = computeUnitPoints(item, unit, state.archetype);
  const effectiveSlot = getEffectiveSlot(item.unitName, item.slot, rule);

  // Variant model
  const activeVariant = getActiveVariant(item, unit);
  const variant = activeVariant?.variant ?? null;
  const variantActive = !!activeVariant;

  // Mark resolution
  const effectiveMark = (unit.locked_mark ?? (rule?.forcedMark as Mark | null) ?? item.mark) as Mark | null;
  const markIsForced = !unit.locked_mark && !!rule?.forcedMark;
  const markIsLocked = !!unit.locked_mark;
  const statModMark = unit.locked_mark
    ? null
    : (item.mark ?? (markIsForced ? ((rule!.forcedMark as Mark) ?? null) : null)) as Mark | null;
  const hasMarkGroup = unit.option_groups.some(g => g.constraint.type === 'mark');
  // The four god marks count as a veteran ability. Mark of Chaos Undivided does NOT (rule omits the clause).
  // Locked-mark units (e.g. Plague Marines) use veteran_max:1 in their data instead.
  const markUsesVetSlot = hasMarkGroup && !unit.locked_mark && !!effectiveMark && effectiveMark !== 'Undivided';
  const vetMax = Math.max(0, (unit.veteran_max ?? 2) - (markUsesVetSlot ? 1 : 0));
  const effectiveHasVetAbilities = unit.has_veteran_abilities || !!(rule?.grantVetAbilities?.includes(item.unitName));

  // Models to display — variant replaces the model group it's promoted from (derived from
  // the option group's own wording, since that group isn't always last in unit.models —
  // e.g. Traitor Guard's Traitor Sergeant promotes a Guardsman, but Ogryn is listed last).
  // Optional secondary models (e.g. Chaos Ogryn, min:0) only join the displayed Profile
  // once at least one has actually been bought via the squad-size controls.
  const visibleModels = unit.models.filter(m => {
    if (m.max === 0) return false;
    if (m.min > 0) return true;
    return (item.modelSizes?.[m.name] ?? m.min) > 0;
  });
  // When a promotion is active and the base model still has other members left (squad size
  // > 1), split its row into "Nx <base model>" + the promoted variant as its own row, instead
  // of replacing the whole row 1-for-1 — e.g. 10 Traitor Guardsmen → 9x Guardsman + 1x Sergeant.
  let modelsToShow: Model[];
  let modelCounts: (number | null)[];
  if (activeVariant) {
    const promoted = getPromotedModel(unit, activeVariant);
    const idx = visibleModels.indexOf(promoted);
    const rawCount = item.modelSizes?.[promoted.name] ?? item.size;
    const baseCount = Math.max(rawCount, promoted.min) - 1;
    if (idx >= 0 && baseCount > 0) {
      modelsToShow = [
        ...visibleModels.slice(0, idx),
        promoted,
        activeVariant.variant,
        ...visibleModels.slice(idx + 1),
      ];
      modelCounts = modelsToShow.map(m => m === promoted ? baseCount : null);
    } else if (idx >= 0) {
      modelsToShow = visibleModels.map((m, i) => i === idx ? activeVariant!.variant : m);
      modelCounts = modelsToShow.map(() => null);
    } else {
      modelsToShow = [...visibleModels.slice(0, -1), activeVariant.variant];
      modelCounts = modelsToShow.map(() => null);
    }
  } else {
    modelsToShow = visibleModels;
    modelCounts = visibleModels.map(() => null);
  }
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

  // Weapon-targeting daemon weapon traits. A trait bought with a Character-only price
  // (p_char, no p_unit) on a squad with a built-in Champion/Sergeant or a promoted
  // variant (e.g. Traitor Sergeant) only modifies THAT model's personal copy of the named
  // weapon, not every copy the squad carries — those go to championWeaponTraitMap instead,
  // applied later to just that model's own weapon group.
  const builtInChampionForTraits = getBuiltInChampion(unit);
  const hasCharacterScopedBuyer = (!!builtInChampionForTraits && unit.models[0].max > 1) || !!activeVariant;
  const weaponTraitMap = new Map<string, string[]>();
  const championWeaponTraitMap = new Map<string, string[]>();
  for (const sel of item.armory) {
    if (sel.section !== 'daemon_weapons' || !sel.targetWeapon) continue;
    const armItem = findArmoryItem(data, sel);
    if (!armItem?.desc || !isWeaponTrait(armItem.desc)) continue;
    const gains = extractWeaponGains(armItem.desc);
    if (gains.length === 0) continue;
    const isCharacterScoped = armItem.p_char != null && armItem.p_unit == null;
    const target = (isCharacterScoped && hasCharacterScopedBuyer) ? championWeaponTraitMap : weaponTraitMap;
    target.set(sel.targetWeapon, [...(target.get(sel.targetWeapon) ?? []), ...gains]);
  }

  // NOTE: global trait weapon abilities are injected into weaponTraitMap after traitWeaponAbilities
  // is populated below (see "Inject global trait weapon abilities" comment).

  // Items that GRANT a new weapon to the model — daemon weapons, vehicle upgrades, and plain
  // weapons bought from the Armory's "weapons" section (e.g. Boltgun on a Traitor Sergeant).
  // Patterns: "The model gains the 'X' weapon" (Kai), "The model gains a X" (Hunter-killer
  // missile), or a direct "weapons" section purchase (the item itself IS the weapon).
  const armoryGrantedWeapons: string[] = [];
  const pushGrantedWeapon = (granted: import('../types/data').ArmoryItem) => {
    if (weapons.find(w => w.name === granted.name)) return;
    if (granted.profiles && granted.profiles.length > 0) {
      for (const p of granted.profiles) {
        weapons.push({
          name: `${granted.name} - ${p.name}`,
          range: p.range ?? '',
          type: p.type ?? '',
          s: p.s ?? '',
          ap: p.ap ?? '',
          d: p.d ?? '',
          abilities: p.abilities ?? '-',
        });
        armoryGrantedWeapons.push(`${granted.name} - ${p.name}`);
      }
    } else {
      weapons.push({
        name: granted.name,
        range: granted.range ?? '',
        type: granted.type ?? '',
        s: granted.s ?? '',
        ap: granted.ap ?? '',
        d: granted.d ?? '',
        abilities: granted.abilities ?? '-',
      });
      armoryGrantedWeapons.push(granted.name);
    }
  };
  for (const sel of item.armory) {
    if (sel.section === 'weapons') {
      const armItem = findArmoryItem(data, sel);
      if (armItem) pushGrantedWeapon(armItem);
      continue;
    }
    if (sel.section !== 'daemon_weapons' && sel.section !== 'equipment') continue;
    const armItem = findArmoryItem(data, sel);
    if (!armItem?.desc || !isGrantWeapon(armItem.desc)) continue;
    const grantedName = extractGrantedWeaponName(armItem.desc);
    if (!grantedName) continue;
    // Find the weapon profile in armory_general.weapons
    const granted = (data.armory_general.weapons as import('../types/data').ArmoryItem[])
      .find(w => w.name.toLowerCase() === grantedName.toLowerCase());
    if (granted) pushGrantedWeapon(granted);
  }

  // Equipment mods
  const equipItems = item.armory
    .filter(a => {
      const ai = findArmoryItem(data, a);
      if (a.section === 'daemon_weapons') return !isWeaponTrait(ai?.desc) && !isGrantWeapon(ai?.desc);
      if (a.section === 'equipment') return !isGrantWeapon(ai?.desc); // exclude weapon-granting upgrades
      return false;
    })
    .map(a => {
      const found = findArmoryItem(data, a);
      return { name: a.itemName, desc: found?.desc ?? '', armourKeyword: found?.armourKeyword };
    });
  const equipMods: EquipMods = parseEquipMods(equipItems, unit.armourKeyword, unit.abilities);

  // Trait effects
  // CSM army traits only apply to models with the "Chaos Space Marine" keyword.
  // Subfaction units (World Eaters, Death Guard, Thousand Sons, Emperor's Children) are excluded.
  const isMainFaction = item.unitName in data.units;
  const hasCSMKeyword = unit.keywords?.includes('Chaos Space Marine') ?? false;
  const traitsApply = isMainFaction && (data.faction !== 'Chaos Space Marines' || hasCSMKeyword);
  const traitStatMods: Array<{ stat: string; delta: number }> = [];
  const traitAbilities: Array<{ traitName: string; name: string; desc?: string }> = [];
  const traitWeaponAbilities: Array<{ traitName: string; name: string; weapon_type?: string }> = [];
  if (traitsApply && item.traits.length > 0) {
    for (const t of item.traits) {
      for (const e of getTraitEffects(t.name, unit)) {
        if (e.type === 'stat_mod')      traitStatMods.push({ stat: e.stat, delta: e.delta });
        else if (e.type === 'inv_save') traitAbilities.push({ traitName: t.name, name: `${e.value}+ Invulnerability Save` });
        else if (e.type === 'unit_ability')   traitAbilities.push({ traitName: t.name, name: e.name, desc: e.desc });
        else if (e.type === 'weapon_ability') traitWeaponAbilities.push({ traitName: t.name, name: e.name, weapon_type: e.weapon_type });
      }
    }
  }

  // Inject global trait weapon abilities into weaponTraitMap so the WeaponTable shows them
  // directly on each weapon row (e.g. Siege Experts → Sunder(1) on every ranged weapon).
  if (traitWeaponAbilities.length > 0) {
    for (const weapon of unit.weapons) {
      const isMelee = weapon.range === '-' || /^melee/i.test(weapon.type ?? '');
      for (const wa of traitWeaponAbilities) {
        const applies =
          !wa.weapon_type ||
          (wa.weapon_type === 'melee'   &&  isMelee) ||
          (wa.weapon_type === 'ranged'  && !isMelee) ||
          (wa.weapon_type === 'bolt'    && /bolt/i.test(weapon.name));
        if (applies) {
          weaponTraitMap.set(weapon.name, [...(weaponTraitMap.get(weapon.name) ?? []), wa.name]);
        }
      }
    }
  }

  // Equipment items that grant weapon abilities globally: "All ranged/melee/all weapons gain 'X'."
  // Detected via desc text — same injection mechanism as trait weapon abilities above.
  // This covers: Plague ammunition (Poison), Seeking rounds (Anti-Air), Soul Burn swords, etc.
  // Pattern: All (ranged|melee|bolt)? weapons ... gain ['"]ABILITY['"]
  for (const sel of item.armory) {
    if (sel.section !== 'equipment') continue;
    const armItem = findArmoryItem(data, sel);
    if (!armItem?.desc) continue;
    const desc = armItem.desc;
    // Match "All [type] weapons ... gain 'X'" or "All [type] weapons ... gain "X""
    const m = desc.match(/\bAll\s+(ranged|melee|bolt|arc|rad|heavy)?\s*weapons?\b.*\bgain\b.*?["']([^"']+)["']/i);
    if (!m) continue;
    const rawType = (m[1] ?? '').toLowerCase();
    const ability = m[2];
    const wtype = rawType === 'ranged' ? 'ranged'
      : rawType === 'melee' ? 'melee'
      : rawType === 'bolt' ? 'bolt'
      : undefined; // 'all' or unspecified → applies to all weapons
    // A Character-only-priced item (p_char, no p_unit) on a squad with a Champion/promoted
    // Sergeant only affects THAT model's own weapons, not the whole squad's — same scoping
    // as the targeted daemon-weapon traits above.
    const isCharacterScoped = armItem.p_char != null && armItem.p_unit == null;
    const target = (isCharacterScoped && hasCharacterScopedBuyer) ? championWeaponTraitMap : weaponTraitMap;
    for (const weapon of weapons) {
      const isMelee = weapon.range === '-' || /^melee/i.test(weapon.type ?? '');
      const applies =
        !wtype ||
        (wtype === 'melee'  &&  isMelee) ||
        (wtype === 'ranged' && !isMelee) ||
        (wtype === 'bolt'   && /bolt/i.test(weapon.name + ' ' + (weapon.type ?? '')));
      if (applies) {
        target.set(weapon.name, [...(target.get(weapon.name) ?? []), ability]);
      }
    }
  }

  const blackCrusadeChampion = !!(item.blackCrusadeHQ);

  // Collect abilities from selected choices that have their own abilities array
  const choiceAbilities: string[] = [];
  // Option effects (ki-parser-02): stat/type/ability changes from selected wargear options.
  const optionStatMods: Array<{ stat: string; delta: number }> = [];
  const optionAddedUnitTypes: string[] = [];
  let optionSetUnitType: string | null = null;
  const optionAbilities: string[] = [];
  // De-dup helpers: an effect only grants what the model doesn't already have (a type/ability
  // already in its base profile is not re-added). Normalize so "Deepstrike" matches "Deep strike".
  const _norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const _baseTypeNorm = _norm(unit.unit_type);
  const _baseAbilNorm = (unit.abilities ?? []).flatMap(a => a.split(/[,;]/)).map(p => _norm(p.split(':')[0]));
  const applyEffect = (eff: OptionEffect | undefined) => {
    if (!eff) return;
    for (const sm of eff.stat_mod ?? []) optionStatMods.push({ stat: sm.stat, delta: sm.delta });
    for (const t of eff.adds_unit_types ?? [])
      if (!optionAddedUnitTypes.includes(t) && !_baseTypeNorm.includes(_norm(t))) optionAddedUnitTypes.push(t);
    if (eff.set_unit_type) optionSetUnitType = eff.set_unit_type;
    for (const ab of eff.grants_abilities ?? [])
      if (!optionAbilities.includes(ab) && !_baseAbilNorm.includes(_norm(ab))) optionAbilities.push(ab);
  };
  for (const [gi, ch] of Object.entries(item.optionQty ?? {})) {
    const g = unit.option_groups[Number(gi)];
    if (!g) continue;
    const hasAnySelection = Object.entries(ch).some(([ci, qty]) => (ci === '__inline' || !!qty) && !!qty);
    // Group-level effect applies whenever the group has a selection (covers inline toggles).
    if (hasAnySelection) applyEffect(g.effect);
    for (const [ci, qty] of Object.entries(ch)) {
      if (ci === '__inline' || !qty) continue;
      const choice = g.choices[parseInt(ci)];
      if (choice?.abilities?.length) {
        for (const ab of choice.abilities) {
          if (!choiceAbilities.includes(ab)) choiceAbilities.push(ab);
        }
      }
      applyEffect(choice?.effect);
    }
  }
  // Armory-item effects: a bought item may confer a UNIT-TYPE change ("Chaos Space Marine bike" →
  // "Bike"; "Daemonic stature" → "Monstrous Infantry"). Stats and quoted abilities for these items
  // still come from equipMods; this only adds the type, de-duplicated against what the model has.
  for (const sel of item.armory) {
    const ai = findArmoryItem(data, sel);
    if (ai?.effect) applyEffect(ai.effect);
    for (const grantedName of ai?.effect?.grants_weapons ?? []) {
      const granted = (data.armory_general.weapons as import('../types/data').ArmoryItem[])
        .find(w => w.name.toLowerCase() === grantedName.toLowerCase());
      if (granted) pushGrantedWeapon(granted);
    }
  }

  // Core Rules "Objective secured!" (L1320-1322, "Automatic Rule"): automatically conferred
  // to every Troop selection; units gain/lose it if their battlefield role switches via
  // Archetypes — `effectiveSlot` already reflects archetype slot-shifts (getEffectiveSlot),
  // so checking it here covers that clause for free. Allied-detachment units NEVER get it
  // (Allies section, L1833) — gated on factionSource matching the active allied faction
  // (NOT on factionSource alone: injected-supplement units like Assassins/HH carry their own
  // factionSource without being an "allied detachment" in the rules sense).
  const isAlliedDetachmentUnit = !!(state.alliedFaction && item.factionSource === state.alliedFaction);
  const ruleNotes: string[] = [];
  if (effectiveSlot === 'Troops' && !isAlliedDetachmentUnit) {
    ruleNotes.push('Objective secured!');
  }

  return {
    pts, effectiveSlot,
    effectiveMark, markIsForced, markIsLocked, statModMark, markUsesVetSlot, vetMax,
    variant, variantActive, modelsToShow, modelCounts, squadLeaderIdx,
    isTzeentchPsyker, isOptionalPsyker, psykerGroupIdx, effectivePsyker,
    isFavored: false,
    effectiveHasVetAbilities,
    equippedWith, weapons, weaponsToShow: weapons, weaponGroups: [], armoryGrantedWeapons, weaponTraitMap, championWeaponTraitMap,
    injectedAbilities: choiceAbilities,
    injectedRuleNotes: ruleNotes,
    equipMods,
    traitStatMods, traitAbilities, traitWeaponAbilities,
    blackCrusadeChampion,
    optionStatMods, optionAddedUnitTypes, optionSetUnitType, optionAbilities,
  };
}

/** The abilities string a weapon would render with, after merging in a trait map's extra
 * abilities for it — used to compare whether two model-groups' copies of a weapon are
 * actually identical or have diverged (e.g. a Character-only daemon weapon trait). */
function renderedAbilities(w: Weapon, traitMap: Map<string, string[]>): string {
  const extra = traitMap.get(w.name) ?? [];
  if (extra.length === 0) return (w.abilities && w.abilities !== '-') ? w.abilities : '-';
  const base = (w.abilities && w.abilities !== '-') ? w.abilities : '';
  return mergeWeaponAbilities(base, extra).merged;
}

/**
 * Split weaponsToShow into per-model-group tables.
 *   - Units whose `equipped_with` has more than one "Every X is equipped with: ..." clause
 *     (e.g. Traitor Guard: Traitor Guardsman vs Chaos Ogryn) get one group per clause, each
 *     tagged with the model count for an "[N]x" prefix. Weapons not claimed by any clause
 *     (e.g. selected special/heavy-weapon options) join the first group.
 *   - Units with a single equipped_with clause but a built-in Champion/Sergeant (squad model
 *     + a min:1/max:1 model) get one group per model, each with an "[N]x" prefix (squad count
 *     / 1). If the Champion's copy of every weapon renders identically to the squad's (the
 *     vast majority — no Character-only weapon trait bought), the two groups collapse back
 *     into a single one with the combined count. The Champion's Armory-bought weapons (if
 *     any) join their own group's table.
 *   - Everything else (units with no built-in Champion) returns a single unlabeled,
 *     uncounted group — unchanged from the previous flat weaponsToShow rendering.
 */
export function computeWeaponGroups(unit: Unit, item: RosterEntry, profile: ResolvedProfile): WeaponGroup[] {
  const baseName = (n: string) => n.split(' - ')[0];

  const builtInChampion = getBuiltInChampion(unit);
  const armoryGatedByVariant = unit.option_groups.some(g => g.variant_link && /armory/i.test(g.header));
  const championArmoryInOwnBlock = !!builtInChampion && unit.champion_has_armory && !armoryGatedByVariant;

  // A promoted variant (e.g. Traitor Sergeant) with its own variant_link-gated Armory access
  // gets its Armory-bought weapons (e.g. Boltgun) extracted into its own group too, same as a
  // built-in Champion. `profile.modelsToShow` places the promoted base model immediately
  // before the variant when both are shown (see resolveBase).
  const variantIdx = profile.variantActive ? profile.modelsToShow.findIndex(m => m === profile.variant) : -1;
  const variantArmoryActive = variantIdx > 0 && armoryGatedByVariant;
  const promotedModelName = variantArmoryActive ? profile.modelsToShow[variantIdx - 1].name : null;

  const grantedSet = new Set(profile.armoryGrantedWeapons);
  const extractGranted = championArmoryInOwnBlock || variantArmoryActive;
  const championExtraWeapons = extractGranted
    ? profile.weaponsToShow.filter(w => grantedSet.has(w.name))
    : [];
  const remaining = extractGranted
    ? profile.weaponsToShow.filter(w => !grantedSet.has(w.name))
    : profile.weaponsToShow;

  const clauses = [...unit.equipped_with.matchAll(/Every ([^.]+?) is equipped with:\s*([^.]+)\./g)];

  let groups: WeaponGroup[];
  if (clauses.length > 1) {
    groups = [];
    const used = new Set<string>();
    let variantGroup: WeaponGroup | null = null;
    let variantSplitFromFirstClause = false;
    for (const [ci, c] of clauses.entries()) {
      const label = c[1].trim();
      const names = c[2].split(/;|\band\b/i).map(s => s.trim()).filter(Boolean).map(baseName);
      const gWeapons = remaining.filter(w => names.includes(baseName(w.name)));
      gWeapons.forEach(w => used.add(w.name));
      const idx = profile.modelsToShow.findIndex(m => m.name === label);
      const m = idx >= 0 ? profile.modelsToShow[idx] : null;
      const count = m
        ? profile.modelCounts[idx] ?? (item.modelSizes?.[m.name] ?? (m.min > 0 ? m.min : m.max))
        : null;
      groups.push({ label, count, weapons: gWeapons, traitMap: profile.weaponTraitMap });

      // The promoted variant (e.g. Traitor Sergeant) shares this clause's base loadout. If
      // Character-only Armory purchases (Boltgun, "all ranged weapons gain X", etc.) make its
      // copy render differently, give it its own table; otherwise fold its one model into
      // this clause's count (fixes the count also being off-by-one in the common case).
      if (variantArmoryActive && label === promotedModelName) {
        const champTraitMap = new Map(profile.weaponTraitMap);
        for (const [k, v] of profile.championWeaponTraitMap) {
          champTraitMap.set(k, [...(champTraitMap.get(k) ?? []), ...v]);
        }
        const identical = championExtraWeapons.length === 0 &&
          gWeapons.every(w => renderedAbilities(w, profile.weaponTraitMap) === renderedAbilities(w, champTraitMap));
        if (identical) {
          groups[groups.length - 1].count = (count ?? 0) + 1;
        } else {
          variantGroup = {
            label: profile.variant!.name,
            count: 1,
            weapons: [...gWeapons, ...championExtraWeapons],
            traitMap: champTraitMap,
          };
          variantSplitFromFirstClause = ci === 0;
          groups.push(variantGroup);
        }
      }
    }
    const unclaimed = remaining.filter(w => !used.has(w.name));
    if (unclaimed.length > 0 && groups.length > 0) {
      groups[0].weapons.push(...unclaimed);
      if (variantGroup && variantSplitFromFirstClause) variantGroup.weapons.push(...unclaimed);
    }
    if (championExtraWeapons.length > 0 && builtInChampion) {
      groups.push({ label: builtInChampion.name, count: null, weapons: championExtraWeapons, traitMap: profile.weaponTraitMap });
    }
  } else if (builtInChampion && unit.models[0].max > 1) {
    const championCount = 1;
    const squadCount = Math.max(0, item.size - championCount);

    const champTraitMap = new Map(profile.weaponTraitMap);
    for (const [k, v] of profile.championWeaponTraitMap) {
      champTraitMap.set(k, [...(champTraitMap.get(k) ?? []), ...v]);
    }

    const identical = championExtraWeapons.length === 0 &&
      remaining.every(w => renderedAbilities(w, profile.weaponTraitMap) === renderedAbilities(w, champTraitMap));

    if (squadCount <= 0) {
      groups = [{ label: null, count: null, weapons: [...remaining, ...championExtraWeapons], traitMap: champTraitMap }];
    } else if (identical) {
      groups = [{ label: null, count: squadCount + championCount, weapons: remaining, traitMap: profile.weaponTraitMap }];
    } else {
      groups = [
        { label: unit.models[0].name, count: squadCount, weapons: remaining, traitMap: profile.weaponTraitMap },
        { label: builtInChampion.name, count: championCount, weapons: [...remaining, ...championExtraWeapons], traitMap: champTraitMap },
      ];
    }
  } else {
    groups = [{ label: null, count: null, weapons: remaining, traitMap: profile.weaponTraitMap }];
    if (championExtraWeapons.length > 0 && builtInChampion) {
      groups.push({ label: builtInChampion.name, count: null, weapons: championExtraWeapons, traitMap: profile.weaponTraitMap });
    }
  }

  // Per-weapon count overrides: when independent option groups let only a SUBSET of a group's
  // models take a swap (e.g. Traitor Guard's "every model's Lasgun -> Chainsword & Laspistol"
  // and its separate "per 10 models, one Lasgun -> Flamer/Melter/Plasma gun"), the group's flat
  // `count` is wrong for both the base weapon (should shrink) and the swapped-in weapon (should
  // be its own qty, not the whole group). Sum qty per replaced weapon across ALL groups that
  // target it (each model decides independently, so qtys from different groups add up), and
  // give each swapped-in choice's weapon(s) their own qty.
  for (const grp of groups) {
    if (grp.count == null || !grp.label) continue;
    const replacedQty = new Map<string, number>();
    const grantedQty  = new Map<string, number>();
    for (const [gi, g] of unit.option_groups.entries()) {
      if (!g.replaces?.length) continue;
      if (g.applies_to_model && g.applies_to_model !== grp.label) continue;
      const ch = item.optionQty[gi] ?? {};
      let groupQty = 0;
      for (const [ci, qty] of Object.entries(ch)) {
        if (ci === '__inline' || !qty) continue;
        const n = Number(qty);
        groupQty += n;
        const choice = g.choices[parseInt(ci)];
        if (!choice) continue;
        const parts = choice.name.split(/\s*(?:&|\band\b)\s*/i).filter(Boolean);
        for (const part of (parts.length > 1 ? parts : [choice.name])) {
          if (grp.weapons.some(w => baseName(w.name) === part)) {
            grantedQty.set(part, (grantedQty.get(part) ?? 0) + n);
          }
        }
      }
      if (groupQty === 0) continue;
      for (const replaced of g.replaces) {
        replacedQty.set(replaced, (replacedQty.get(replaced) ?? 0) + groupQty);
      }
    }
    if (replacedQty.size === 0 && grantedQty.size === 0) continue;
    const overrides = new Map<string, number>();
    for (const w of grp.weapons) {
      const bn = baseName(w.name);
      if (replacedQty.has(bn)) {
        overrides.set(w.name, Math.max(0, grp.count - replacedQty.get(bn)!));
      } else if (grantedQty.has(bn)) {
        overrides.set(w.name, grantedQty.get(bn)!);
      }
    }
    if (overrides.size > 0) grp.countOverrides = overrides;
  }

  // Drop groups with nothing to show (e.g. Chaos Ogryn before any are bought) — a group that
  // exists in the data but has no weapons yet shouldn't force the others into labeled tables.
  const nonEmpty = groups.filter(g => g.weapons.length > 0);
  if (nonEmpty.length <= 1) {
    const g = nonEmpty[0];
    return [{ label: null, count: g?.count ?? null, weapons: g?.weapons ?? [], traitMap: g?.traitMap ?? profile.weaponTraitMap, countOverrides: g?.countOverrides }];
  }
  return nonEmpty;
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
  'Chaos Daemons':       cdResolve,
  'Space Marines':       smResolve,
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
  const profile = factionFn ? factionFn(base, item, unit, state, data) : base;
  // Faction resolvers may rewrite `weapons`; derive the display list from the final set.
  profile.weaponsToShow = computeWeaponsToShow(profile.weapons, unit, item);
  profile.weaponGroups = computeWeaponGroups(unit, item, profile);
  return profile;
}
