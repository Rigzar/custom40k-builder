import { useState } from 'react';
import { mergeWeaponAbilities } from '../engine/abilityMerge';
import type { RosterEntry, Mark, ArmorySelection, TraitSelection } from '../types/army';
import type { Unit, Weapon, Choice, ArmoryItem, FactionData, Model } from '../types/data';
import { useArmyStore } from '../store/army';
import { resolveUnit } from '../engine/points';
import { parseAbility } from '../data/coreRules';
import { isWeaponTrait, extractWeaponGains, parseInvSaveFromAbilities } from '../engine/equipMods';
import { resolveUnitProfile, isOptionAvailable } from '../engine/resolver';
import { getArchetypeRule } from '../engine/archetypes';
import { SACRED_NUMBERS } from '../engine/resolvers/chaos_daemons';
import { MarkBadge } from './MarkBadge';
import { ArmoryModal } from './ArmoryModal';
import { TraitsModal } from './TraitsModal';
import { PsychicModal } from './PsychicModal';

// NOTE: marks shown per unit come from the unit's mark option_group choices[], not this array.
// This array is kept only for the Black Crusade champion display which needs all 4 god marks.
const MARKS_ALL: Mark[] = ['Undivided', 'Khorne', 'Nurgle', 'Slaanesh', 'Tzeentch'];

const MARK_BONUSES: Record<string, { inf: string; char: string; veh: string }> = {
  Khorne:    { inf: '+1 Attack',       char: '+1 Strength (character)',          veh: 'Tank Shock: double hit' },
  Nurgle:    { inf: '+1 Toughness',    char: '+1 Wound (character)',             veh: 'Recover damage in Reinforce (2D6, 7+)' },
  Slaanesh:  { inf: '+1 Initiative',   char: '+2" Move (character)',             veh: '-1/-2 enemy Leadership (18"/9")' },
  Tzeentch:  { inf: '"Warded"',        char: 'Psyker +1 power/turn (character)', veh: 'Warpflamer 9" Assault4 S4 AP-1' },
  Undivided: { inf: 'Gains mark benefits when destroying enemy units', char: '', veh: '' },
};

interface StatMod { stat: string; delta: number; }
interface MarkMod { inf?: StatMod; char?: StatMod; }
const MARK_STAT_MODS: Record<string, MarkMod> = {
  Khorne:    { inf: { stat: 'A', delta: 1 }, char: { stat: 'S', delta: 1 } },
  Nurgle:    { inf: { stat: 'T', delta: 1 }, char: { stat: 'W', delta: 1 } },
  Slaanesh:  { inf: { stat: 'I', delta: 1 }, char: { stat: 'M', delta: 2 } },
  Tzeentch:  {},
  Undivided: {},
};

function applyDelta(value: string, delta: number): { display: string; modified: boolean } {
  if (!value || value === '-') return { display: value, modified: false };
  if (/^\d+$/.test(value)) return { display: String(parseInt(value) + delta), modified: true };
  const inch = value.match(/^(\d+)"$/);
  if (inch) return { display: `${parseInt(inch[1]) + delta}"`, modified: true };
  return { display: value, modified: false };
}
const STAT_KEYS_INF = ['M','WS','BS','S','T','W','I','A','LD','SV'] as const;
const STAT_KEYS_VEH = ['M','BS','S','FRONT','SIDE','REAR','I','A','HP'] as const;

interface Props { item: RosterEntry; }

function isMarkGroup(g: { constraint: { type: string } }) {
  return g.constraint.type === 'mark';
}

function unitMinSize(u: Unit) {
  if (!u.models.length) return 1;
  return Math.max(1, u.models.reduce((s, m) => s + m.min, 0));
}
function unitMaxSize(u: Unit) {
  if (!u.models.length) return 1;
  return u.models.reduce((s, m) => s + m.max, 0) || 1;
}

/** Look up an armory item's full data (range, type, stats) across all armory sources. */
function findArmoryItemData(data: FactionData, sel: ArmorySelection): ArmoryItem | undefined {
  const section = sel.section as 'weapons' | 'equipment' | 'daemon_weapons';
  const sources: { name: string; weapons: ArmoryItem[]; equipment: ArmoryItem[]; daemon_weapons: ArmoryItem[] }[] = [
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

/** Resolve an option choice's display name to one or more weapon profiles from the unit's
 * weapons[] — handles exact matches, multi-profile weapons ("Plasma gun" → "Plasma gun -
 * Standard"/"- Overcharged"), and compound choices ("X and Y" / "X & Y"). `compound` is true
 * when the choice resolves to several DIFFERENT weapons (each row gets its own Pts), as
 * opposed to several fire-mode profiles of the same weapon (Pts shown once, rowSpan'd). */
function resolveChoiceWeapons(u: Unit, choiceName: string): { weapons: Weapon[]; compound: boolean } {
  const exact = u.weapons.find(w => w.name === choiceName);
  if (exact) return { weapons: [exact], compound: false };
  const multiProfile = u.weapons.filter(w => w.name.startsWith(`${choiceName} - `));
  if (multiProfile.length > 0) return { weapons: multiProfile, compound: false };
  const parts = choiceName.split(/\s*(?:&|\band\b)\s*/i).filter(Boolean);
  if (parts.length > 1) {
    const resolved = parts.map(p => resolveChoiceWeapons(u, p));
    if (resolved.every(r => r.weapons.length > 0)) {
      return { weapons: resolved.flatMap(r => r.weapons), compound: true };
    }
  }
  return { weapons: [], compound: false };
}

export function UnitCard({ item }: Props) {
  const store = useArmyStore();
  const { data, alliedData, traitPool, removeUnit, updateUnit, updateModelSize, setOptionQty, setUnitCustomName, setUnitJoinTarget, army, legacy, legacy2, archetype, addArmoryItem, removeArmoryItem } = store;
  const [armoryOpen, setArmoryOpen] = useState(false);
  const [vetOpen, setVetOpen] = useState(false);
  const [vehOpen, setVehOpen] = useState(false);
  const [traitsOpen, setTraitsOpen] = useState(false);
  const [psyOpen, setPsyOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [editingName, setEditingName] = useState(false);

  if (!data) return null;
  const u = resolveUnit(item, data);
  if (!u) return null;

  const rp = resolveUnitProfile(item, u, store, data);
  const {
    pts, effectiveSlot,
    effectiveMark, markIsForced, statModMark, markUsesVetSlot, vetMax,
    variant, variantActive, modelsToShow, modelCounts, squadLeaderIdx,
    effectivePsyker,
    isFavored, effectiveHasVetAbilities, equippedWith, weaponsToShow, weaponGroups, weaponTraitMap,
    injectedAbilities, injectedRuleNotes, equipMods,
    traitStatMods, traitAbilities,
    blackCrusadeChampion,
    optionStatMods, optionAddedUnitTypes, optionSetUnitType, optionAbilities,
  } = rp;
  const baseTypeDisplay = optionSetUnitType ?? u.unit_type;
  const unitTypeDisplay = [baseTypeDisplay, ...optionAddedUnitTypes].filter(Boolean).join(', ');

  // Bug 1: vehicles with WS (e.g. Soul Grinder) need WS in the stat display
  const vehicleHasWS = u.is_vehicle && modelsToShow.some(m => m.stats?.WS && m.stats.WS !== '-');
  // InvSv stat: best of base-ability + equipment + ACTIVE TRAITS inv saves.
  // SOURCE (core_rules_text.txt): Invulnerability Save is unaffected by AP, used after armor save fails.
  // Unconditional sources all update the stat column:
  //   - base abilities (Daemon=5+, Greater Daemon=4+, Seal of corruption=4+…)
  //   - equipment (Terminator armor=5+, Cataphractii=4+…)
  //   - traits: Iron Within inv_save effect, Berserk(5+) from Laboratory Experiments
  // Conditional ones (Desecration "near objectives") stay only in Abilities section text.
  const baseInvSave = parseInvSaveFromAbilities(u.abilities ?? []);
  const equipInvSave = equipMods.invulnSave;
  // Trait inv saves: "X+ Invulnerability Save" in traitAbilities (from inv_save effect)
  // + Berserk(X+) ability name (gives X+ inv per core rules)
  const traitInvSave: number | null = traitAbilities.reduce<number | null>((best, ta) => {
    const m1 = ta.name.match(/^(\d)\+\s+Invulnerability/i);
    if (m1) { const v = parseInt(m1[1]); return best === null || v < best ? v : best; }
    const m2 = ta.name.match(/^Berserk\((\d)\+\)/i);
    if (m2) { const v = parseInt(m2[1]); return best === null || v < best ? v : best; }
    return best;
  }, null);
  const allInvCandidates = [baseInvSave, equipInvSave, traitInvSave].filter((v): v is number => v !== null);
  const effectiveInvSv: number | null = allInvCandidates.length > 0 ? Math.min(...allInvCandidates) : null;
  // Source markers for ◆ indicator
  const invSvFromEquip = equipInvSave !== null && (baseInvSave === null || equipInvSave <= (baseInvSave ?? 99)) && equipInvSave === effectiveInvSv;
  const invSvFromTrait = traitInvSave !== null && traitInvSave === effectiveInvSv && equipInvSave !== effectiveInvSv;

  const statKeys: readonly string[] = u.is_vehicle
    ? (vehicleHasWS ? ['M','WS','BS','S','FRONT','SIDE','REAR','I','A','HP'] : STAT_KEYS_VEH)
    : [...STAT_KEYS_INF, ...(effectiveInvSv !== null ? ['InvSv'] : [])];
  const minSize = unitMinSize(u);
  const maxSize = unitMaxSize(u);
  // Only count mark groups whose host condition holds — a Horus Heresy unit's Mark-of-Chaos
  // group (available_if: Chaos Space Marines force) must not show under a Space Marine host.
  const hasMarkGroup = u.option_groups.some(g =>
    g.constraint.type === 'mark' &&
    isOptionAvailable(g.available_if, effectiveMark ?? null, u.keywords, data.faction, archetype));
  const hasMarks = Object.keys(data.animosity).length > 0;
  // Armory access gated behind a variant promotion (e.g. Traitor Sergeant, Aspiring Champion —
  // header says "...gains access to [weapons and gear from] the Armory") is shown inside that
  // variant's own collapsible block, not in the global action row.
  const armoryGatedByVariant = u.option_groups.some(g => g.variant_link && /armory/i.test(g.header));
  // A built-in champion/leader model (e.g. Plague Champion: min===1, max===1 in models[1]) with
  // its own Armory access gets a dedicated profile+Armory block (see squad-size section below)
  // instead of the generic bottom Armory button.
  const builtInChampion = u.models.length > 1 && u.models[1].min === 1 && u.models[1].max === 1 ? u.models[1] : null;
  const championArmoryInOwnBlock = !!builtInChampion && u.champion_has_armory && !armoryGatedByVariant;
  const showArmory = u.has_armory_access || (u.champion_has_armory && !armoryGatedByVariant && !championArmoryInOwnBlock) || (variantActive && !armoryGatedByVariant);

  // Legacy of the Alien Hunters: "Each model can receive the 'Special ammunition' equipment,
  // regardless of whether it has access to the armory." — universal toggle bypassing showArmory.
  // SOURCE: space_marines/archetypes.json "Legacy of the Alien Hunters" desc.
  const alienHuntersActive = [legacy, legacy2].includes('Legacy of the Alien Hunters');
  const specialAmmunition = alienHuntersActive
    ? Object.values(data.armory_legions).flatMap(l => l.equipment as ArmoryItem[]).find(a => a.name === 'Special ammunition')
    : undefined;
  const specialAmmoSelection = specialAmmunition
    ? item.armory.find(a => a.itemName === 'Special ammunition')
    : undefined;

  // Bug 3: for allied units, use the allied faction's armory for capability checks
  const isAllied = !!item.factionSource;
  const effectiveArmData = (isAllied && alliedData) ? alliedData : data;
  const allArmories = [effectiveArmData.armory_general, ...Object.values(effectiveArmData.armory_marks), ...Object.values(effectiveArmData.armory_legions)];
  const hasFactionVeteranItems = effectiveHasVetAbilities &&
    allArmories.some(src => (src.equipment as ArmoryItem[]).some(a => a.category === 'veteran'));
  const hasFactionVehicleItems = u.is_vehicle &&
    allArmories.some(src => (src.equipment as ArmoryItem[]).some(a => a.category === 'vehicle'));

  const vetItemsCount = item.armory.filter(a => findArmoryItemData(effectiveArmData, a)?.category === 'veteran').length;
  const vehItemsCount = item.armory.filter(a => findArmoryItemData(effectiveArmData, a)?.category === 'vehicle').length;

  const isMainFaction = item.unitName in data.units;
  const showTraits = isMainFaction && item.traits.length > 0;
  const hasTraitConflict = false;

  const hasEquipEffects = Object.keys(equipMods.statDeltas).length > 0 || equipMods.armorSave !== null || equipMods.invulnSave !== null;

  function setQty(gi: number, ci: string | number, qty: number) {
    setOptionQty(item.id, gi, ci, qty);
  }

  return (
    <div className="bg-zinc-900 border border-zinc-700 mb-3 overflow-hidden">
      {/* ── Header ── */}
      <div className="flex justify-between items-start px-3 py-2.5 bg-zinc-800 border-b-2 border-amber-800/60">
        <div className="flex-1 min-w-0">
          {/* Unit name */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {editingName ? (
              <input
                autoFocus
                type="text"
                defaultValue={item.customName ?? ''}
                placeholder={u.name}
                onBlur={(e) => { setUnitCustomName(item.id, e.target.value); setEditingName(false); }}
                onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); if (e.key === 'Escape') setEditingName(false); }}
                className="bg-zinc-700 border border-amber-600 text-amber-200 px-1.5 py-0 text-base font-bold rounded focus:outline-none w-48"
              />
            ) : (
              <>
                <span className="text-amber-200 font-bold text-base uppercase tracking-wide leading-tight">
                  {item.customName || u.name}
                </span>
                {item.customName && (
                  <span className="text-zinc-500 font-normal text-[10px]">({u.name})</span>
                )}
                {variant && (
                  <span className="text-amber-600 font-normal text-xs">→ {variant.name}</span>
                )}
                <button
                  onClick={() => setEditingName(true)}
                  className="text-zinc-600 hover:text-amber-400 text-[11px] leading-none"
                  title="Set custom name"
                >✎</button>
              </>
            )}
          </div>
          {/* Slot · Type · Marks */}
          <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest">
              {effectiveSlot !== item.slot
                ? <><span className="line-through text-zinc-600">{item.slot}</span> → {effectiveSlot}</>
                : effectiveSlot}
            </span>
            <span className="text-zinc-600 text-[10px]">·</span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wide">
              {optionSetUnitType && optionSetUnitType !== u.unit_type
                ? <><span className="line-through text-zinc-600">{u.unit_type}</span> → <span className="text-violet-400">{[optionSetUnitType, ...optionAddedUnitTypes].join(', ')}</span></>
                : optionAddedUnitTypes.length > 0
                  ? <><span>{u.unit_type}</span><span className="text-violet-400">, {optionAddedUnitTypes.join(', ')}</span></>
                  : unitTypeDisplay}
            </span>
            {blackCrusadeChampion ? (
              <span className="inline-flex items-center gap-0.5 ml-1">
                {(['Khorne','Nurgle','Slaanesh','Tzeentch'] as const).map(m => (
                  <MarkBadge key={m} mark={m} />
                ))}
                <span className="text-[10px] text-amber-400 ml-0.5">⚜</span>
              </span>
            ) : effectiveMark ? (
              <span className="ml-1">
                <MarkBadge
                  mark={effectiveMark}
                  suffix={u.locked_mark ? '(locked)' : markIsForced ? '(archetype)' : undefined}
                />
              </span>
            ) : null}
            {isFavored && (
              <span className="text-[9px] bg-amber-900/60 text-amber-300 border border-amber-700/60 px-1.5 py-px uppercase tracking-wide font-semibold rounded-sm">
                ★ Favored
              </span>
            )}
          </div>
        </div>
        {/* Right: pts + controls */}
        <div className="flex items-center gap-2 ml-2 shrink-0">
          <span className="text-amber-400 font-bold text-base">{pts}<span className="text-amber-700 text-[11px] font-normal ml-0.5">pts</span></span>
          <button
            onClick={() => setCollapsed(c => !c)}
            className="text-zinc-500 hover:text-zinc-200 text-xs px-1 py-0.5 border border-zinc-700 hover:border-zinc-500"
          >
            {collapsed ? '▼' : '▲'}
          </button>
          <button
            onClick={() => removeUnit(item.id)}
            className="text-zinc-500 hover:text-red-400 border border-zinc-700 hover:border-red-800 px-2 py-0.5 text-[11px]"
          >✕</button>
        </div>
      </div>

      {/* ── Join Unit (Character Models only) ── */}
      {u.is_character && !u.is_vehicle && (() => {
        // Animosity of the Gods join sub-clause — present VERBATIM in BOTH factions' own
        // Index/Army Customisation text (each codex carries its own copy, not a shared Core
        // rule): CSM digest §4b "a model with a Mark of Chaos may only join a unit that has
        // the same Mark, or no Mark" / CD digest §4b "a character with a mark may only attach
        // to units of the same mark or no mark" (ki-csm-animosity-joinmark-01, extended to CD
        // — both factions' marks gate this identically; the original CSM-only scoping comment
        // here was wrong about CD's text, corrected after re-reading chaos_daemons.md §4b).
        const rule = getArchetypeRule(store.archetype);
        const joinableUnits = army.filter(e => {
          if (e.id === item.id || e.factionSource) return false;
          const eu = data?.units[e.unitName];
          if (!eu || eu.is_character || eu.is_vehicle || eu.is_monster) return false;
          if (data.faction === 'Chaos Space Marines' || data.faction === 'Chaos Daemons') {
            const unitMark = (eu.locked_mark ?? rule?.forcedMark ?? e.mark ?? null) as Mark | null;
            if (effectiveMark && unitMark && effectiveMark !== unitMark) return false;
          }
          return true;
        });
        if (joinableUnits.length === 0) return null;
        return (
          <div className="px-3 py-1.5 bg-zinc-900 border-b border-zinc-700 flex items-center gap-2">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest shrink-0">↳ Joins</span>
            <select
              value={item.joinedToUnit ?? ''}
              onChange={e => setUnitJoinTarget(item.id, e.target.value || null)}
              className="flex-1 bg-zinc-800 border border-zinc-600 text-zinc-300 text-[11px] px-1.5 py-0.5 focus:outline-none focus:border-amber-700"
            >
              <option value="">— no unit —</option>
              {joinableUnits.map(e => {
                const eu = data?.units[e.unitName];
                return (
                  <option key={e.id} value={e.id}>
                    {e.customName || eu?.name || e.unitName}
                  </option>
                );
              })}
            </select>
          </div>
        );
      })()}

      {!collapsed && (
        <div className="space-y-0">
          {/* Default loadout */}
          {equippedWith && (
            <div className="px-3 py-1.5 bg-zinc-800/50 border-b border-zinc-700/60 text-[11px] text-zinc-400">
              <span className="text-zinc-500 text-[10px] uppercase tracking-widest mr-1.5">Default loadout:</span>
              {equippedWith}
            </div>
          )}

          {/* ── Stat profile ── */}
          <div className="border-b border-zinc-700/60">
            <div className="px-3 pt-2 pb-0">
            <div className="text-[10px] text-amber-700/80 uppercase tracking-widest mb-1 flex items-center gap-3">
              <span>Profile</span>
              {(isFavored || blackCrusadeChampion || (statModMark && MARK_STAT_MODS[statModMark] && (
                u.is_character ? MARK_STAT_MODS[statModMark].char : MARK_STAT_MODS[statModMark].inf
              ))) && (
                <span className="ml-2 text-blue-400 normal-case font-normal text-[10px]">* = mark bonus</span>
              )}
              {traitStatMods.length > 0 && (
                <span className="ml-2 text-emerald-400 normal-case font-normal text-[10px]">† = trait bonus</span>
              )}
              {hasEquipEffects && (
                <span className="ml-2 text-violet-400 normal-case font-normal text-[10px]">◆ = equipment</span>
              )}
            </div>
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-700/50 border-b border-zinc-600">
                  <th className="text-left text-zinc-300 font-semibold py-2 px-2 text-[11px] uppercase tracking-wide">Model</th>
                  {statKeys.map(k => (
                    <th key={k} className={`font-bold text-center py-2 px-2 text-[11px] uppercase tracking-wide min-w-[2rem] ${k === 'InvSv' ? 'text-violet-400' : 'text-amber-500'}`}>
                      {k === 'InvSv' ? 'Inv' : k}
                    </th>
                  ))}
                  <th className="text-right text-zinc-500 font-normal py-2 pr-2 text-[10px] uppercase">Pts</th>
                </tr>
              </thead>
              <tbody>
                {modelsToShow.map((m, i) => {
                  const isVar = variant && m === variant;
                  return (
                    <tr key={i} className={`border-b border-zinc-700/40 ${i % 2 !== 0 ? 'bg-zinc-800/40' : ''} ${isVar ? 'text-amber-300' : 'text-zinc-100'}`}>
                      <td className="font-semibold py-2 px-2 whitespace-nowrap text-xs">{modelCounts[i] != null ? `${modelCounts[i]}x ` : ''}{m.name}{isVar ? ' ★' : ''}</td>
                      {statKeys.map(k => {
                        // InvSv is a derived stat — not in m.stats, computed at unit level
                        if (k === 'InvSv') {
                          const marker = invSvFromEquip ? '◆' : invSvFromTrait ? '†' : '';
                          return (
                            <td key="InvSv" className={`text-center py-2 px-2 text-xs font-mono ${invSvFromEquip ? 'text-violet-300' : invSvFromTrait ? 'text-emerald-300' : 'text-amber-200'}`}>
                              {effectiveInvSv}+{marker}
                            </td>
                          );
                        }
                        const raw = (m.stats as Record<string, string>)[k] ?? '-';
                        let display = raw;
                        let markBoosted = false;
                        let traitBoosted = false;
                        let equipBoosted = false;
                        let optionBoosted = false;

                        // Apply mark stat bonuses (vehicles get ability-based bonuses only, no stat deltas)
                        const marksToApply: string[] = blackCrusadeChampion
                          ? ['Khorne', 'Nurgle', 'Slaanesh', 'Tzeentch']
                          : statModMark ? [statModMark] : [];
                        if (!u.is_vehicle) {
                          for (const m of marksToApply) {
                            const mods = MARK_STAT_MODS[m];
                            if (!mods) continue;
                            if (mods.inf && mods.inf.stat === k) {
                              const r = applyDelta(display, mods.inf.delta);
                              display = r.display;
                              if (r.modified) markBoosted = true;
                            }
                            if (u.is_character && mods.char && mods.char.stat === k) {
                              const r = applyDelta(display, mods.char.delta);
                              display = r.display;
                              if (r.modified) markBoosted = true;
                            }
                          }
                        }

                        // Favored: squad leader gains +1 Attack
                        if (isFavored && i === squadLeaderIdx && k === 'A') {
                          const r = applyDelta(display, 1);
                          display = r.display;
                          if (r.modified) markBoosted = true;
                        }

                        // Apply trait stat mods (stacked delta on top of current display)
                        const traitDelta = traitStatMods
                          .filter(sm => sm.stat === k)
                          .reduce((acc, sm) => acc + sm.delta, 0);
                        if (traitDelta !== 0) {
                          const r = applyDelta(display, traitDelta);
                          if (r.modified) { display = r.display; traitBoosted = true; }
                        }

                        // Apply equipment stat mods
                        if (!u.is_vehicle) {
                          const equipDelta = equipMods.statDeltas[k] ?? 0;
                          if (equipDelta !== 0) {
                            const r = applyDelta(display, equipDelta);
                            if (r.modified) { display = r.display; equipBoosted = true; }
                          }
                          // Equipment armor save (SV)
                          if (k === 'SV' && equipMods.armorSave !== null) {
                            const existing = display.match(/(\d+)\+/);
                            if (!existing || equipMods.armorSave < parseInt(existing[1])) {
                              display = `${equipMods.armorSave}+`;
                              equipBoosted = true;
                            }
                          }
                        }

                        // Apply equipment stat SETS (e.g. Living vehicle "WS → 4+")
                        // Only applied if the set value is better (lower number) than current.
                        const setVal = equipMods.statSets[k];
                        if (setVal) {
                          const currentNum = display.match(/^(\d+)\+/)?.[1];
                          const setNum = setVal.match(/^(\d+)\+/)?.[1];
                          if (currentNum && setNum && parseInt(setNum) < parseInt(currentNum)) {
                            display = setVal;
                            equipBoosted = true;
                          } else if (!currentNum || display === '-') {
                            // No current value or "-" → always set
                            display = setVal;
                            equipBoosted = true;
                          }
                        }

                        // Apply option stat mods (e.g. Daemon Prince wings M +6)
                        const optionDelta = optionStatMods
                          .filter(sm => sm.stat === k)
                          .reduce((acc, sm) => acc + sm.delta, 0);
                        if (optionDelta !== 0) {
                          const r = applyDelta(display, optionDelta);
                          if (r.modified) { display = r.display; optionBoosted = true; }
                        }

                        const cellClass = markBoosted
                          ? 'text-blue-400 font-bold'
                          : traitBoosted
                            ? 'text-emerald-400 font-bold'
                            : equipBoosted
                              ? 'text-violet-400 font-bold'
                              : optionBoosted
                                ? 'text-cyan-400 font-bold'
                                : '';
                        const suffix = markBoosted ? '*' : traitBoosted ? '†' : equipBoosted ? '◆' : optionBoosted ? '‡' : '';
                        return (
                          <td key={k} className={`text-center py-2 px-2 font-mono text-xs ${cellClass || 'text-zinc-100'}`}>
                            {display}{suffix}
                          </td>
                        );
                      })}
                      <td className="text-right text-amber-700 py-2 pr-2 text-xs">{m.points}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {/* Equipment granted abilities (inv save now shown in stats table) */}
            {(!u.is_vehicle && false) && (
              <div className="mt-1 text-[10px] text-violet-400/90 border-l-2 border-violet-900 pl-2">
                <span className="font-semibold">Equipment:</span> {equipMods.invulnSave}+ Invulnerable Save
              </div>
            )}
            {/* Equipment-granted abilities are shown in the Abilities section below */}
            </div>{/* close px-3 */}
          </div>{/* close stat section */}

          {/* ── Weapons ── */}
          {weaponsToShow.length > 0 && (() => {
            const showGroupLabels = weaponGroups.length > 1;
            return (
              <div className="border-b border-zinc-700/60">
                {weaponGroups.map((g, gi) => {
                  if (g.weapons.length === 0) return null;
                  const ranged = g.weapons.filter(w => w.range && w.range !== '-' && w.type !== 'Melee');
                  const melee  = g.weapons.filter(w => !w.range || w.range === '-' || w.type === 'Melee');
                  return (
                    <div key={gi}>
                      {showGroupLabels && (
                        <div className="px-3 pt-2.5 text-[11px] text-zinc-300 font-semibold uppercase tracking-wide">
                          {g.label}
                        </div>
                      )}
                      {ranged.length > 0 && (
                        <div>
                          <div className="px-3 pt-2.5 pb-1 text-[10px] text-amber-600 uppercase tracking-widest font-bold flex items-center gap-2">
                            <span className="w-3 h-px bg-amber-800 inline-block" />
                            Ranged Weapons
                            <span className="flex-1 h-px bg-zinc-700/60 inline-block" />
                          </div>
                          <WeaponTable weapons={ranged} traitMap={g.traitMap ?? weaponTraitMap} count={g.count} />
                        </div>
                      )}
                      {melee.length > 0 && (
                        <div>
                          <div className="px-3 pt-2.5 pb-1 text-[10px] text-amber-600 uppercase tracking-widest font-bold flex items-center gap-2">
                            <span className="w-3 h-px bg-amber-800 inline-block" />
                            Melee Weapons
                            <span className="flex-1 h-px bg-zinc-700/60 inline-block" />
                          </div>
                          <WeaponTable weapons={melee} traitMap={g.traitMap ?? weaponTraitMap} count={g.count} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })()}

          {/* ── Builder section (interactive) ── */}
          <div className="px-3 py-2 space-y-3">

          {/* Squad size — per-group when modelSizes is available, single slider otherwise */}
          {item.modelSizes ? (
            <div className="space-y-1">
              {u.models.slice(0, 1).map(m => {
                const count = item.modelSizes![m.name] ?? m.min;
                const isFixed = m.min === m.max;
                return (
                  <div key={m.name} className="flex items-center gap-2 text-[12px] text-zinc-400">
                    <span className="w-40 truncate text-zinc-300">{m.name}:</span>
                    {isFixed ? (
                      <span className="text-zinc-500">{m.min} <span className="text-zinc-600 text-[11px]">(fixed)</span></span>
                    ) : (
                      <>
                        <input
                          type="number"
                          min={m.min}
                          max={m.max}
                          value={count}
                          onChange={e => updateModelSize(item.id, m.name, Math.max(m.min, Math.min(m.max, Number(e.target.value))))}
                          className="w-14 bg-zinc-900 border border-zinc-600 px-2 py-0.5 text-zinc-100 text-sm focus:outline-none focus:border-amber-600"
                        />
                        <span className="text-zinc-600 text-[11px]">({m.min}–{m.max})</span>
                      </>
                    )}
                  </div>
                );
              })}
              <div className="text-[11px] text-zinc-500 pt-0.5">Total: {item.size} models</div>
              {variantActive && (
                <div className="text-[11px] text-amber-600/90">
                  {modelsToShow.map((m, i) => {
                    if (modelCounts[i] != null) return `${modelCounts[i]}x ${m.name}`;
                    if (m === variant) return `1x ${m.name}`;
                    if (item.modelSizes?.[m.name]) return `${item.modelSizes[m.name]}x ${m.name}`;
                    return null;
                  }).filter(Boolean).join(' + ')}
                </div>
              )}
            </div>
          ) : null}

          {/* Built-in champion/leader (e.g. Plague Champion) with its own Armory access — profile
              is already shown in the table above, this block just surfaces the Armory link. */}
          {championArmoryInOwnBlock && builtInChampion && (
            <details open className="text-[12px] border border-zinc-700 bg-zinc-900/40">
              <summary className="cursor-pointer px-2 py-1 select-none text-zinc-300">▲ {builtInChampion.name}</summary>
              <div className="px-2 pb-2 text-[11px] text-zinc-400 flex items-center gap-2 flex-wrap">
                <span>The {builtInChampion.name} has access to weapons and gear from the Armory.</span>
                <button
                  onClick={() => setArmoryOpen(true)}
                  className="text-[11px] px-2 py-1 bg-zinc-900 border border-zinc-600 text-amber-500 hover:bg-zinc-700 uppercase tracking-wide"
                >
                  Armory ({item.armory.length})
                </button>
              </div>
            </details>
          )}

          {/* Optional extra models (e.g. Chaos Ogryn, min:0) — collapsible profile/abilities/weapons block.
              Built-in models (min>0, e.g. Plague Champion) are already shown in the Profile table above
              and are not rendered here — there's no "buy more of these" rule to show for them. */}
          {item.modelSizes && u.models.slice(1).filter(m => m.min === 0 && m.max > 0).map(m => {
            const count = item.modelSizes![m.name] ?? m.min;
            const equipMatch = u.equipped_with.match(new RegExp(`Every ${m.name} is equipped with:\\s*([^.]+)\\.`, 'i'));
            const equipText = equipMatch?.[1]?.trim();
            const equipNames = equipText ? equipText.split(/;|\band\b/i).map(s => s.trim()).filter(Boolean) : [];
            const mWeapons = equipNames
              .map(n => u.weapons.find(w => w.name.toLowerCase() === n.toLowerCase()))
              .filter((w): w is Weapon => !!w);
            const mRanged = mWeapons.filter(w => w.range && w.range !== '-' && w.type !== 'Melee');
            const mMelee = mWeapons.filter(w => !w.range || w.range === '-' || w.type === 'Melee');
            const mAbilities = u.abilities.filter(a => a.includes(`(${m.name}`));
            const headerText = m.name;
            return (
              <details key={m.name} className="border border-zinc-700 bg-zinc-900/40 text-[12px]">
                <summary className="cursor-pointer px-2 py-1 text-amber-600 text-[11px] uppercase tracking-wide select-none flex items-center gap-2">
                  <span>▲ {headerText}</span>
                  <input
                    type="number"
                    min={m.min}
                    max={m.max}
                    value={count}
                    onClick={e => e.stopPropagation()}
                    onChange={e => updateModelSize(item.id, m.name, Math.max(m.min, Math.min(m.max, Number(e.target.value))))}
                    className="w-12 bg-zinc-900 border border-zinc-600 px-1 py-0.5 text-zinc-100 text-[11px] normal-case focus:outline-none focus:border-amber-600"
                  />
                  <span className="text-zinc-500 normal-case">max {m.max}</span>
                </summary>
                <div className="px-2 pb-2 space-y-2">
                  {equipText && (
                    <div className="text-zinc-400 text-[11px]">Every {m.name} is equipped with: {equipText}.</div>
                  )}
                  <ModelProfileRow m={m} statKeys={STAT_KEYS_INF} />
                  {mAbilities.length > 0 && (
                    <div>
                      <div className="text-[10px] text-amber-700 uppercase tracking-widest mb-0.5">Abilities</div>
                      {mAbilities.map((a, i) => (
                        <div key={i} className="text-[11px] text-zinc-400">{a}</div>
                      ))}
                    </div>
                  )}
                  {mRanged.length > 0 && (
                    <div>
                      <div className="text-[10px] text-amber-600 uppercase tracking-widest mb-0.5">Ranged Weapons</div>
                      <WeaponTable weapons={mRanged} />
                    </div>
                  )}
                  {mMelee.length > 0 && (
                    <div>
                      <div className="text-[10px] text-amber-600 uppercase tracking-widest mb-0.5">Melee Weapons</div>
                      <WeaponTable weapons={mMelee} />
                    </div>
                  )}
                </div>
              </details>
            );
          })}

          {maxSize > 1 && !item.modelSizes && (
            <div className="flex items-center gap-2 text-[12px] text-zinc-400">
              <span>Size:</span>
              <input
                type="number"
                min={minSize}
                max={maxSize}
                value={item.size}
                onChange={e => updateUnit(item.id, { size: Math.max(minSize, Math.min(maxSize, Number(e.target.value))) })}
                className="w-16 bg-zinc-900 border border-zinc-600 px-2 py-0.5 text-zinc-100 text-sm focus:outline-none focus:border-amber-600"
              />
              <span className="text-zinc-600 text-[11px]">(min {minSize}, max {maxSize})</span>
            </div>
          )}

          {/* Mark selection — units with a mark group, OR any HQ in a chaos faction */}
          {!u.locked_mark && !markIsForced && hasMarks && (hasMarkGroup || effectiveSlot === 'HQ') && (
            <div>
              {/* Black Crusade Champion toggle — only shown for non-locked HQs when BC is active */}
              {traitPool.includes('Black Crusade') && effectiveSlot === 'HQ' && (
                <div className="mb-2">
                  <button
                    onClick={() => store.setBlackCrusadeHQ(item.id, !item.blackCrusadeHQ)}
                    className={`w-full text-left text-[11px] px-3 py-1.5 border transition-colors
                      ${item.blackCrusadeHQ
                        ? 'bg-amber-900/40 border-amber-600 text-amber-300 font-semibold'
                        : 'bg-zinc-900 border-zinc-600 text-zinc-400 hover:border-amber-700 hover:text-amber-400'
                      }`}
                  >
                    {item.blackCrusadeHQ
                      ? '⚜ Black Crusade Champion — carries all four Chaos god marks'
                      : '○ Designate as Black Crusade Champion (all four god marks)'}
                  </button>
                  {item.blackCrusadeHQ && (
                    <div className="text-[10px] text-zinc-500 mt-0.5 pl-2 border-l border-amber-900">
                      This HQ simultaneously bears Khorne, Nurgle, Slaanesh and Tzeentch.
                      Pays the combined mark cost for all four gods.
                    </div>
                  )}
                </div>
              )}

              {/* Regular mark buttons — derived from the unit's mark option_group choices[].
                  SOURCE: each unit's datasheet lists exactly which marks it can take.
                  e.g. Chaos Sorcerer has Undivided/Slaanesh/Nurgle/Tzeentch but NOT Khorne. */}
              {!item.blackCrusadeHQ && (() => {
                const markGroup = u.option_groups.find(g => g.constraint.type === 'mark');
                const availableMarks = markGroup?.choices.map(c => c.name as Mark) ?? MARKS_ALL;
                return (
                  <div>
                    <div className="text-[10px] text-amber-700 uppercase tracking-widest mb-1">Chaos Mark</div>
                    <div className="flex flex-wrap gap-1">
                      {availableMarks.map(m => (
                        <button
                          key={m}
                          onClick={() => updateUnit(item.id, { mark: item.mark === m ? null : m })}
                          className={`text-[11px] px-2 py-0.5 border transition-colors
                            ${item.mark === m
                              ? 'bg-amber-800 border-amber-600 text-white'
                              : 'bg-zinc-900 border-zinc-600 text-zinc-400 hover:text-amber-400'
                            }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
          {markIsForced && (
            <div className="text-[10px] text-amber-700/60 border-l-2 border-amber-900 pl-2 italic">
              Mark forced by archetype: {effectiveMark}
            </div>
          )}
          {/* Mark stat bonus — shown for player-chosen or archetype-forced marks (never for locked) */}
          {blackCrusadeChampion ? (
            <div className="text-[10px] text-blue-400/80 border-l-2 border-blue-900 pl-2 mt-0.5">
              <span className="font-semibold">⚜ All Chaos Marks:</span>{' '}
              {u.is_vehicle
                ? 'Tank Shock (double hit) · Recover damage 2D6/7+ · -1/-2 LD (18″/9″) · Warpflamer'
                : u.is_character
                  ? '+1A +1S · +1T +1W · +1I +2″M · Warded'
                  : '+1 A · +1 T · +1 I · Warded'
              }
            </div>
          ) : statModMark && MARK_BONUSES[statModMark] ? (
            <div className="text-[10px] text-blue-400/80 border-l-2 border-blue-900 pl-2 mt-0.5">
              <span className="font-semibold">Mark {statModMark}:</span>{' '}
              {u.is_vehicle
                ? MARK_BONUSES[statModMark].veh
                : u.is_character
                  ? `${MARK_BONUSES[statModMark].inf}${MARK_BONUSES[statModMark].char ? ` · ${MARK_BONUSES[statModMark].char}` : ''}`
                  : MARK_BONUSES[statModMark].inf
              }
              {item.mark && !markIsForced && (
                <span className="text-zinc-500"> · counts as 1 veteran ability slot</span>
              )}
            </div>
          ) : statModMark === 'Undivided' ? (
            <div className="text-[10px] text-zinc-400/80 border-l-2 border-zinc-600 pl-2 mt-0.5">
              <span className="font-semibold">Mark of Chaos Undivided:</span>{' '}
              Kill-based progression (in-game rule): 1st kill → one Mark benefit (infantry); 2nd kill → additional character benefit; 3rd kill → Daemon weapon ability; 4th kill → Daemon Prince stats. If slain before the 1st benefit, replaced with a Chaos Spawn (opponent controls).
            </div>
          ) : null}
          {isFavored && effectiveMark && SACRED_NUMBERS[effectiveMark] && (
            <div className="text-[10px] text-amber-400/80 border-l-2 border-amber-700 pl-2 mt-0.5">
              <span className="font-semibold">★ Favored of {effectiveMark}</span>{' '}
              (size {SACRED_NUMBERS[effectiveMark]}×): squad leader gains +1 Attack + Personal icon (Daemon units deep striking within 3″ of the bearer do not scatter).
            </div>
          )}

          {/* Option groups */}
          {u.option_groups.filter(g => !isMarkGroup(g) && !g.variant_link || g.variant_link).map((g) => {
            const realGi = u.option_groups.indexOf(g);
            if (isMarkGroup(g)) return null;
            // Host-gated branches (BSData condition, scope:'force') — e.g. a Horus Heresy squad's
            // "if part of a Space Marine army" option is hidden under a Chaos Space Marine host.
            // Unit-scope conditions stay visible-but-disabled below (validated UX); force-scope is hidden.
            if ((g.available_if?.scope === 'force' || g.available_if?.scope === 'archetype') &&
                !isOptionAvailable(g.available_if, effectiveMark ?? null, u.keywords, data.faction, archetype)) return null;

            // Required OG warning: show if nothing is selected
            const isRequired = g.constraint.required;
            const hasSelection = isRequired && g.choices.some((_, ci) => (item.optionQty?.[realGi]?.[ci] ?? 0) > 0);

            // True when the header already states the cost (e.g. "…for +15 points.") — avoids showing pts twice.
            const headerHasPts = (pts: number) =>
              new RegExp(`\\+?${pts}\\s+points?`, 'i').test(g.header);

            if (g.variant_link) {
              const active = !!(item.optionQty?.[realGi]?.['__inline']);
              const variantModel = u.variant_models.find(vm => vm.name === g.variant_link);
              return (
                <details key={realGi} open className="text-[12px] border border-zinc-700 bg-zinc-900/40">
                  <summary className="cursor-pointer px-2 py-1 flex items-center gap-2 select-none">
                    <input
                      type="checkbox"
                      checked={active}
                      onClick={e => e.stopPropagation()}
                      onChange={() => setQty(realGi, '__inline', active ? 0 : 1)}
                    />
                    <span className="text-zinc-300">▲ {g.header}</span>
                    {g.inline_pts != null && !headerHasPts(g.inline_pts) && (
                      <span className="text-amber-600 text-[11px]">
                        {g.inline_pts >= 0 ? '+' : ''}{g.inline_pts} pts
                      </span>
                    )}
                  </summary>
                  {variantModel && (
                    <div className="px-2 pb-2 space-y-2">
                      <ModelProfileRow m={variantModel} statKeys={STAT_KEYS_INF} />
                      {(u.champion_has_armory || u.has_armory_access) && (
                        <div className="text-[11px] text-zinc-400 flex items-center gap-2 flex-wrap">
                          <span>The {variantModel.name} has access to weapons and gear from the Armory.</span>
                          {active ? (
                            <button
                              onClick={() => setArmoryOpen(true)}
                              className="text-[11px] px-2 py-1 bg-zinc-900 border border-zinc-600 text-amber-500 hover:bg-zinc-700 uppercase tracking-wide"
                            >
                              Armory ({item.armory.length})
                            </button>
                          ) : (
                            <span className="text-zinc-600 italic">(select to enable Armory)</span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </details>
              );
            }

            // Option group with a cost but no sub-choices (e.g. "Can be equipped with
            // a Storm bolter for +11 pts.") — render as a simple on/off toggle.
            if (g.choices.length === 0 && g.inline_pts != null) {
              const active = !!(item.optionQty?.[realGi]?.['__inline']);
              // Keyword-gated availability (BSData condition primitive). effectiveMark is the
              // resolver output — covers locked mark, archetype-forced mark, and chosen mark.
              const blocked = !isOptionAvailable(g.available_if, effectiveMark ?? null, u.keywords, data.faction, archetype);
              return (
                <div key={realGi} className="text-[12px]">
                  <label className={`flex items-center gap-2 ${blocked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                    <input
                      type="checkbox"
                      checked={active}
                      disabled={blocked}
                      onChange={() => { if (!blocked) setQty(realGi, '__inline', active ? 0 : 1); }}
                    />
                    <span className="text-zinc-300">{g.header}</span>
                    {!headerHasPts(g.inline_pts) && (
                      <span className="text-amber-600 text-[11px]">
                        {g.inline_pts >= 0 ? '+' : ''}{g.inline_pts} pts
                      </span>
                    )}
                  </label>
                  {blocked && g.available_if && (
                    <div className="text-[10px] text-red-400/80 mt-0.5 pl-6">Not available with Mark of {g.available_if.keyword}.</div>
                  )}
                </div>
              );
            }

            const isPerN = g.constraint.type === 'per_n';
            // per_n max = slots from total size, capped by applies_to_model count when set.
            // e.g. "2 Dishonored may swap per 8 models" → max = min(slots×2, dishonored_count)
            const perNRaw = isPerN
              ? (g.constraint.count_per_n ?? 1) * Math.floor(item.size / (g.constraint.per_n ?? 1))
              : null;
            const modelGroupCap = (g.applies_to_model && item.modelSizes)
              ? (item.modelSizes[g.applies_to_model] ?? 0)
              : null;
            const groupMax = perNRaw !== null
              ? (modelGroupCap !== null ? Math.min(perNRaw, modelGroupCap) : perNRaw)
              : null;
            const groupUsed = isPerN
              ? Object.entries(item.optionQty?.[realGi] ?? {}).reduce(
                  (s, [k, v]) => k === '__inline' ? s : s + (v ?? 0), 0
                )
              : null;
            const groupRemaining = groupMax !== null && groupUsed !== null ? groupMax - groupUsed : null;

            // Choices that map to actual weapon profiles get rendered as a weapon-stat
            // table (Range/Type/S/AP/D/Abilities/Pts) instead of a plain chip — lets the
            // player compare the swap options without opening the Armory.
            const choiceWeaponsList = g.choices.map(c => resolveChoiceWeapons(u, c.name));
            const groupHasWeapons = choiceWeaponsList.some(ws => ws.weapons.length > 0);
            // "Every model's X may be replaced by Y" — a single choice applying to the whole
            // unit gets ONE quantity control in the group header, not per-row.
            const singleChoiceEvery = g.constraint.type === 'every' && g.choices.length === 1 && groupHasWeapons;

            function qtyControl(ci: number, c: Choice) {
              const qty = item.optionQty?.[realGi]?.[ci] ?? 0;
              const canUseQty = ['per_n', 'fixed_max', 'every'].includes(g.constraint.type);
              const inputMax = isPerN && groupRemaining !== null
                ? qty + groupRemaining
                : g.constraint.type === 'every'
                  ? item.size
                  : undefined;
              // Detect "(X only)" mark restrictions embedded in choice names
              const choiceMarkReq = c.name.match(/\((\w+)\s+only\)/i)?.[1] ?? null;
              const choiceMarkBlocked = choiceMarkReq != null
                && choiceMarkReq.toLowerCase() !== (effectiveMark ?? '').toLowerCase();
              const control = canUseQty ? (
                <input
                  type="number"
                  min={0}
                  max={inputMax}
                  value={qty}
                  disabled={choiceMarkBlocked}
                  onClick={e => e.stopPropagation()}
                  onChange={e => {
                    if (choiceMarkBlocked) return;
                    const v = Math.max(0, Number(e.target.value));
                    const capped = inputMax !== undefined ? Math.min(v, inputMax) : v;
                    setQty(realGi, ci, capped);
                  }}
                  className="w-12 bg-zinc-900 border border-zinc-600 px-1 py-0.5 text-zinc-100 text-[11px] text-center focus:outline-none focus:border-amber-600"
                />
              ) : (
                <input
                  type="checkbox"
                  checked={qty > 0}
                  disabled={choiceMarkBlocked}
                  onChange={() => { if (!choiceMarkBlocked) setQty(realGi, ci, qty > 0 ? 0 : 1); }}
                />
              );
              return { control, choiceMarkBlocked, choiceMarkReq };
            }

            const headerQty = singleChoiceEvery ? qtyControl(0, g.choices[0]) : null;

            return (
              <details key={realGi} open className="border border-zinc-700 bg-zinc-900/40 text-[12px]">
                <summary className="cursor-pointer px-2 py-1 text-[11px] text-zinc-300 flex items-center gap-2 flex-wrap select-none">
                  <span>▲ {g.header}</span>
                  {headerQty?.control}
                  {isPerN && groupMax !== null && (
                    <span className={`text-[10px] font-semibold ${groupUsed! >= groupMax ? 'text-red-400' : 'text-amber-600'}`}>
                      [{groupUsed}/{groupMax}]
                    </span>
                  )}
                  {isRequired && !hasSelection && (
                    <span className="text-[10px] font-semibold text-red-400 animate-pulse">⚠ required</span>
                  )}
                </summary>
                <div className="px-2 pb-2">
                {groupHasWeapons ? (
                  <div className="overflow-x-auto bg-zinc-900 border border-zinc-600">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-600">
                          <th className="text-left text-zinc-400 font-semibold py-1.5 pl-2 pr-2 text-[10px] uppercase tracking-wide w-[26%]">Weapon</th>
                          <th className="text-center text-zinc-400 font-semibold py-1.5 px-1 text-[10px] uppercase tracking-wide w-[9%]">Range</th>
                          <th className="text-left text-zinc-400 font-semibold py-1.5 px-1 text-[10px] uppercase tracking-wide w-[13%]">Type</th>
                          <th className="text-center text-zinc-400 font-semibold py-1.5 px-1 text-[10px] uppercase tracking-wide w-[6%]">S</th>
                          <th className="text-center text-zinc-400 font-semibold py-1.5 px-1 text-[10px] uppercase tracking-wide w-[6%]">AP</th>
                          <th className="text-center text-zinc-400 font-semibold py-1.5 px-1 text-[10px] uppercase tracking-wide w-[6%]">D</th>
                          <th className="text-left text-zinc-400 font-semibold py-1.5 pl-2 text-[10px] uppercase tracking-wide">Abilities</th>
                          <th className="text-right text-zinc-500 font-normal py-1.5 px-2 text-[10px] uppercase w-[8%]">Pts</th>
                        </tr>
                      </thead>
                      <tbody>
                        {g.choices.map((c: Choice, ci: number) => {
                          const { weapons, compound } = choiceWeaponsList[ci];
                          const { control, choiceMarkBlocked, choiceMarkReq } = qtyControl(ci, c);
                          const ptsLabel = `${c.points >= 0 ? '+' : ''}${c.points}`;
                          const rowClass = `border-b border-zinc-700/40 ${choiceMarkBlocked ? 'opacity-50' : ''}`;
                          const showRowControl = !singleChoiceEvery;
                          if (weapons.length === 0) {
                            return (
                              <tr key={ci} className={rowClass} title={choiceMarkBlocked ? `Requires Mark of ${choiceMarkReq}` : undefined}>
                                <td colSpan={7} className="py-1.5 pl-2 pr-2 font-medium text-zinc-100">
                                  {showRowControl ? (
                                    <span className="inline-flex items-center gap-1.5">{control}<span>{c.name}</span></span>
                                  ) : c.name}
                                </td>
                                <td className="py-1.5 px-2 text-right text-amber-600">{ptsLabel}</td>
                              </tr>
                            );
                          }
                          // Multi-profile weapons ("Plasma gun - Standard"/"- Overcharged") get a
                          // banner row with the shared base name + counter + total Pts, then each
                          // fire-mode profile gets its own full stat row beneath it.
                          const profileName = (w: Weapon) =>
                            (weapons.length > 1 && w.name.startsWith(`${c.name} - `))
                              ? w.name.slice(c.name.length + 3)
                              : w.name;
                          const rows = weapons.map((w, wi) => (
                            <tr key={`${ci}-${wi}`} className={rowClass} title={choiceMarkBlocked ? `Requires Mark of ${choiceMarkReq}` : undefined}>
                              <td className="py-1.5 pl-2 pr-2 font-medium text-zinc-100 whitespace-nowrap">
                                {weapons.length > 1 ? <span className="text-zinc-400 pl-2">{profileName(w)}</span> : (
                                  <span className="inline-flex items-center gap-1.5">{showRowControl && control}<span>{profileName(w)}</span></span>
                                )}
                              </td>
                              <td className="py-1.5 px-1 font-mono text-center text-zinc-300">{w.range || '—'}</td>
                              <td className="py-1.5 px-1 text-zinc-400 text-[11px]">{w.type}</td>
                              <td className="py-1.5 px-1 font-mono text-center text-zinc-200">{w.s}</td>
                              <td className="py-1.5 px-1 font-mono text-center text-zinc-200">{w.ap}</td>
                              <td className="py-1.5 px-1 font-mono text-center text-zinc-200">{w.d}</td>
                              <td className="py-1.5 pl-2 text-[11px] text-zinc-500">{(w.abilities && w.abilities !== '-') ? w.abilities : '—'}</td>
                              {compound ? (
                                <td className="py-1.5 px-2 text-right text-amber-600">{ptsLabel}</td>
                              ) : weapons.length === 1 ? (
                                <td className="py-1.5 px-2 text-right text-amber-600">{ptsLabel}</td>
                              ) : null}
                            </tr>
                          ));
                          if (weapons.length > 1) {
                            rows.unshift(
                              <tr key={`${ci}-banner`} className="border-b border-zinc-700/40 bg-zinc-800/60">
                                <td colSpan={7} className="py-1 pl-2 pr-2 font-semibold text-zinc-200">
                                  <span className="inline-flex items-center gap-1.5">{showRowControl && control} {c.name}</span>
                                </td>
                                <td className="py-1 px-2 text-right text-amber-600">{ptsLabel}</td>
                              </tr>
                            );
                          }
                          return rows;
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {g.choices.map((c: Choice, ci: number) => {
                      const { control, choiceMarkBlocked, choiceMarkReq } = qtyControl(ci, c);
                      return (
                        <div
                          key={ci}
                          className={`flex items-center gap-1 bg-zinc-900 border px-2 py-1 text-[11px]
                            ${choiceMarkBlocked ? 'border-zinc-700 opacity-50 cursor-not-allowed' : 'border-zinc-600'}`}
                          title={choiceMarkBlocked ? `Requires Mark of ${choiceMarkReq}` : undefined}
                        >
                          {control}
                          <span className="text-zinc-300">{c.name}</span>
                          {c.points !== 0 && (
                            <span className="text-amber-600">
                              {c.points >= 0 ? '+' : ''}{c.points}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                </div>
              </details>
            );
          })}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-1 pt-1 border-t border-zinc-700">
            {showArmory && (
              <button
                onClick={() => setArmoryOpen(true)}
                className="text-[11px] px-2 py-1 bg-zinc-900 border border-zinc-600 text-amber-500 hover:bg-zinc-700 uppercase tracking-wide"
              >
                Armory ({item.armory.length})
              </button>
            )}
            {specialAmmunition && !showArmory && (() => {
              const ammoPts = (u.is_character ? (specialAmmunition.p_char ?? specialAmmunition.p_unit) : specialAmmunition.p_unit) ?? 0;
              return (
                <button
                  onClick={() => {
                    if (specialAmmoSelection) {
                      removeArmoryItem(item.id, specialAmmoSelection.id);
                    } else {
                      addArmoryItem(item.id, {
                        id: 'arm-' + (globalThis.crypto?.randomUUID?.() ?? (Date.now().toString(36) + '-' + Math.random().toString(36).slice(2))),
                        itemName: specialAmmunition.name,
                        source: 'Death Watch',
                        section: 'equipment',
                        points: ammoPts,
                        isCharacter: u.is_character,
                      });
                    }
                  }}
                  className={`text-[11px] px-2 py-1 bg-zinc-900 border uppercase tracking-wide ${specialAmmoSelection ? 'border-amber-600 text-amber-400' : 'border-zinc-600 text-amber-500 hover:bg-zinc-700'}`}
                >
                  Special ammunition {specialAmmoSelection ? '✓' : `(+${ammoPts})`}
                </button>
              );
            })()}
            {hasFactionVeteranItems && (
              <button
                onClick={() => setVetOpen(true)}
                className="text-[11px] px-2 py-1 bg-zinc-900 border border-zinc-600 text-amber-500 hover:bg-zinc-700 uppercase tracking-wide"
              >
                Veteran ({vetItemsCount}/{vetMax})
              </button>
            )}
            {hasFactionVehicleItems && (
              <button
                onClick={() => setVehOpen(true)}
                className="text-[11px] px-2 py-1 bg-zinc-900 border border-zinc-600 text-amber-500 hover:bg-zinc-700 uppercase tracking-wide"
              >
                Upgrades ({vehItemsCount})
              </button>
            )}
            {hasTraitConflict && (
              <button
                onClick={() => setTraitsOpen(true)}
                className="text-[11px] px-2 py-1 bg-zinc-900 border border-amber-800 text-amber-400 hover:bg-zinc-700 uppercase tracking-wide"
              >
                Traits ⚠ ({item.traits.length}/{vetMax})
              </button>
            )}
            {(() => {
              const hasDiscs = Object.keys(data.disciplines ?? {}).length > 0;
              const hasPowers = effectivePsyker && hasDiscs;
              const hasPrayers = u.is_priest && (data.prayers ?? []).length > 0;
              const hasPacts = u.uses_pacts && (data.pacts ?? []).length > 0;
              if (!hasPowers && !hasPrayers && !hasPacts) return null;
              const pactCount = (item.pacts ?? []).length;
              // Count real powers (exclude __discipline__ marker), then add Smite if always known
              const realPowers = item.powers.filter(p => p.powerName !== '__discipline__').length;
              const hasChosenDisc = item.powers.some(p => p.powerName === '__discipline__');
              const chosenDiscName = item.powers.find(p => p.powerName === '__discipline__')?.disciplineName;
              const knowsSmiteUnit = u.is_psyker && (u.abilities ?? []).some(a => /psyker:/i.test(a) && a.toLowerCase().includes('smite'));
              const totalCount = realPowers + item.prayers.length + pactCount;
              const label = hasPacts && !hasPowers && !hasPrayers
                ? `Pacts (${pactCount})`
                : u.is_cult_initiate
                  ? `Cult Powers (${realPowers})`
                  : hasPowers && hasPrayers
                    ? `Powers/Prayers (${totalCount})`
                    : hasPrayers
                      ? `Prayers (${item.prayers.length})`
                      : hasChosenDisc
                        ? `Powers (Smite + all ${chosenDiscName})`
                        : knowsSmiteUnit
                          ? `Powers (Smite${realPowers > 0 ? ` +${realPowers}` : ''})`
                          : `Powers (${realPowers})`;
              return (
                <button
                  onClick={() => setPsyOpen(true)}
                  className="text-[11px] px-2 py-1 bg-zinc-900 border border-zinc-600 text-amber-500 hover:bg-zinc-700 uppercase tracking-wide"
                >
                  {label}
                </button>
              );
            })()}
          </div>

          {/* Equipped armory items — split by category */}
          {item.armory.length > 0 && (() => {
            const regular = item.armory.filter(a => {
              const d = findArmoryItemData(effectiveArmData, a);
              return !d?.category;
            });
            const veterans = item.armory.filter(a => findArmoryItemData(effectiveArmData, a)?.category === 'veteran');
            const vehicles = item.armory.filter(a => findArmoryItemData(effectiveArmData, a)?.category === 'vehicle');

            function ArmoryRow({ a }: { a: ArmorySelection }) {
              const armItem = findArmoryItemData(effectiveArmData, a);
              const isDaemonWeaponTrait = a.section === 'daemon_weapons';
              const isArmoryWeapon = a.section === 'weapons';
              // Daemon weapon traits that target a weapon: show on the weapon, not as standalone item
              const weaponTargetingTrait = isDaemonWeaponTrait && isWeaponTrait(armItem?.desc) && a.targetWeapon;
              // Extra traits applied to this armory weapon
              const extraTraitsForWeapon = isArmoryWeapon ? (weaponTraitMap.get(a.itemName) ?? []) : [];
              return (
                <div key={a.id} className="bg-zinc-900 border border-zinc-700 px-2 py-1 text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className={`font-medium ${weaponTargetingTrait ? 'text-violet-300' : 'text-zinc-300'}`}>{a.itemName}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-600">{a.points >= 0 ? '+' : ''}{a.points} pts</span>
                      <button
                        onClick={() => useArmyStore.getState().removeArmoryItem(item.id, a.id)}
                        className="text-red-500 hover:text-red-300 text-[11px]"
                      >✕</button>
                    </div>
                  </div>
                  {/* Armory weapon: show stats + any extra daemon weapon traits applied to it */}
                  {isArmoryWeapon && armItem && (
                    <>
                      <EquippedWeaponStats armItem={armItem} extraTraits={extraTraitsForWeapon} />
                    </>
                  )}
                  {/* Daemon weapon trait targeting a weapon: show which weapon + what it grants */}
                  {weaponTargetingTrait && (
                    <div className="text-[10px] text-violet-400/80 mt-0.5 pl-1">
                      → {a.targetWeapon}: gains {extractWeaponGains(armItem?.desc ?? '').join(', ')}
                    </div>
                  )}
                  {/* Daemon weapon trait / equipment: show description (only if not a weapon-targeting trait already displayed) */}
                  {isDaemonWeaponTrait && !weaponTargetingTrait && armItem?.desc && (
                    <div className="text-[10px] text-zinc-500 mt-0.5 pl-1 italic">{armItem.desc}</div>
                  )}
                  {!isArmoryWeapon && !isDaemonWeaponTrait && armItem?.desc && (
                    <div className="text-[10px] text-zinc-500 mt-0.5 pl-1 italic">{armItem.desc}</div>
                  )}
                  <div className="text-[9px] text-zinc-600 mt-0.5">{a.source}</div>
                </div>
              );
            }

            return (
              <div className="space-y-2">
                {regular.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-[10px] text-amber-700 uppercase tracking-widest">Equipment</div>
                    {regular.map(a => <ArmoryRow key={a.id} a={a} />)}
                  </div>
                )}
                {veterans.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-[10px] text-amber-700 uppercase tracking-widest">Veteran Abilities</div>
                    {veterans.map(a => <ArmoryRow key={a.id} a={a} />)}
                  </div>
                )}
                {vehicles.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-[10px] text-amber-700 uppercase tracking-widest">Vehicle Upgrades</div>
                    {vehicles.map(a => <ArmoryRow key={a.id} a={a} />)}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Auto-applied army traits (read-only) */}
          {showTraits && (
            <div className="space-y-1">
              <div className="text-[10px] text-amber-700 uppercase tracking-widest flex items-center gap-2">
                Army Traits
                {hasTraitConflict && (
                  <span className="text-amber-500 normal-case">
                    ({item.traits.length}/{vetMax} — click ⚠ to choose)
                  </span>
                )}
              </div>
              {item.traits.length > 0 ? (
                item.traits.map((t: TraitSelection) => {
                  const traitDef = data.traits.find(def => def.name === t.name);
                  return (
                    <div key={t.name} className="bg-zinc-900 border border-zinc-700 px-2 py-1 text-[11px]">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-zinc-300">{t.name}</span>
                        <span className="text-amber-600 whitespace-nowrap">+{t.points}{t.perWound ? '/W' : ''} pts</span>
                      </div>
                      {traitDef?.desc && (
                        <div className="text-[10px] text-zinc-500 mt-0.5 leading-relaxed">{traitDef.desc}</div>
                      )}
                    </div>
                  );
                })
              ) : (
                hasTraitConflict && (
                  <div className="text-[10px] text-amber-600 italic px-2">
                    This unit cannot take all army traits — choose which to apply.
                  </div>
                )
              )}
            </div>
          )}

          {/* Powers list */}
          {(u.is_psyker || item.powers.length > 0) && (
            <div className="space-y-1">
              <div className="text-[10px] text-amber-700 uppercase tracking-widest">Psychic Powers</div>
              {/* Smite — always known, shown as fixed (not removable) */}
              {u.is_psyker && (u.abilities ?? []).some(a => /psyker:/i.test(a) && a.toLowerCase().includes('smite')) && (
                <div className="flex justify-between items-center bg-amber-900/20 border border-amber-800/40 px-2 py-1 text-[11px]">
                  <span className="text-amber-400">Smite <span className="text-amber-700">(always known)</span></span>
                </div>
              )}
              {/* Selected powers — filter out internal __discipline__ marker */}
              {item.powers.filter(p => p.powerName !== '__discipline__').map((p, i) => (
                <div key={i} className="flex justify-between items-center bg-zinc-900 border border-zinc-700 px-2 py-1 text-[11px]">
                  <span className="text-zinc-300">{p.powerName} <span className="text-zinc-600">({p.disciplineName})</span></span>
                  <button
                    onClick={() => useArmyStore.getState().removePower(item.id, p.disciplineName, p.powerName)}
                    className="text-red-500 hover:text-red-300"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {/* For all_from_one mode: show chosen discipline */}
              {item.powers.find(p => p.powerName === '__discipline__') && (() => {
                const disc = item.powers.find(p => p.powerName === '__discipline__')!;
                return (
                  <div className="flex justify-between items-center bg-zinc-900 border border-zinc-700 px-2 py-1 text-[11px]">
                    <span className="text-violet-300">All of: <span className="text-zinc-300">{disc.disciplineName}</span></span>
                    <button
                      onClick={() => useArmyStore.getState().removePower(item.id, disc.disciplineName, '__discipline__')}
                      className="text-red-500 hover:text-red-300"
                    >✕</button>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Prayers list */}
          {item.prayers.length > 0 && (
            <div className="space-y-1">
              <div className="text-[10px] text-amber-700 uppercase tracking-widest">Prayers</div>
              {item.prayers.map((prayer, i) => (
                <div key={i} className="flex justify-between items-center bg-zinc-900 border border-zinc-700 px-2 py-1 text-[11px]">
                  <span className="text-zinc-300">{prayer}</span>
                  <button
                    onClick={() => useArmyStore.getState().removePrayer(item.id, prayer)}
                    className="text-red-500 hover:text-red-300"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Pacts list */}
          {(item.pacts ?? []).length > 0 && (
            <div className="space-y-1">
              <div className="text-[10px] text-amber-700 uppercase tracking-widest">Infernal Pacts</div>
              {(item.pacts ?? []).map((pact, i) => (
                <div key={i} className="flex justify-between items-center bg-zinc-900 border border-zinc-700 px-2 py-1 text-[11px]">
                  <span className="text-zinc-300">{pact}</span>
                  <button
                    onClick={() => useArmyStore.getState().removePact(item.id, pact)}
                    className="text-red-500 hover:text-red-300"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Abilities */}
          {(() => {
            // Equipment-granted abilities (veterans, daemonic items) — deduplicated vs base abilities
            const equipAbilities = equipMods.grantedAbilities.filter(
              ab => !u.abilities.some(a => a.toLowerCase().includes(ab.toLowerCase()))
            );
            const totalAbilityCount = u.abilities.length + traitAbilities.length + injectedAbilities.length + injectedRuleNotes.length + optionAbilities.length + equipAbilities.length;
            if (totalAbilityCount === 0) return null;
            return (
            <details>
              <summary className="text-[10px] text-amber-600 uppercase tracking-widest cursor-pointer select-none flex items-center gap-2 py-2 border-t border-zinc-700/40 hover:text-amber-400 transition-colors">
                <span className="w-3 h-px bg-amber-800 inline-block" />
                <span className="font-bold">Abilities</span>
                <span className="text-zinc-600 font-normal normal-case tracking-normal text-[10px]">
                  ({totalAbilityCount})
                </span>
                <span className="flex-1 h-px bg-zinc-700/60 inline-block" />
                <span className="text-zinc-600 text-[10px]">▾</span>
              </summary>
              <div className="mt-2 space-y-2">
                {u.abilities.flatMap((a, i) =>
                  parseAbility(a).map((part, j) => (
                    <div key={`n-${i}-${j}`} className="border-b border-zinc-700/40 pb-1.5">
                      <div className="text-[11px] text-zinc-200 font-medium">{part.displayName}</div>
                      {part.description && (
                        <div className="text-[10px] text-zinc-500 mt-0.5 leading-relaxed">{part.description}</div>
                      )}
                    </div>
                  ))
                )}
                {traitAbilities.map((ta, i) => (
                  <div key={`ta-${i}`} className="border-b border-zinc-700/40 pb-1.5">
                    <div className="text-[11px] text-zinc-200 font-medium flex items-center gap-1.5">
                      {ta.name}
                      <span className="text-[9px] bg-emerald-900/50 text-emerald-400 border border-emerald-800/50 px-1 py-px rounded-sm font-normal uppercase tracking-wide">Trait</span>
                    </div>
                    {ta.desc && (
                      <div className="text-[10px] text-zinc-500 mt-0.5 leading-relaxed">{ta.desc}</div>
                    )}
                  </div>
                ))}
                {/* traitWeaponAbilities are now shown directly in the weapon table rows (◆ marker).
                    No separate Abilities section entry — avoids duplicate display. */}
                {injectedAbilities.flatMap((a, i) =>
                  parseAbility(a).map((part, j) => (
                    <div key={`ma-${i}-${j}`} className="border-b border-zinc-700/40 pb-1.5">
                      <div className="text-[11px] text-zinc-200 font-medium flex items-center gap-1.5">
                        {part.displayName}
                        <span className="text-[9px] bg-blue-900/50 text-blue-400 border border-blue-800/50 px-1 py-px rounded-sm font-normal uppercase tracking-wide">Mark</span>
                      </div>
                      {part.description && (
                        <div className="text-[10px] text-zinc-500 mt-0.5 leading-relaxed">{part.description}</div>
                      )}
                    </div>
                  ))
                )}
                {injectedRuleNotes.flatMap((a, i) =>
                  parseAbility(a).map((part, j) => (
                    <div key={`rn-${i}-${j}`} className="border-b border-zinc-700/40 pb-1.5">
                      <div className="text-[11px] text-zinc-200 font-medium flex items-center gap-1.5">
                        {part.displayName}
                        <span className="text-[9px] bg-amber-900/50 text-amber-400 border border-amber-800/50 px-1 py-px rounded-sm font-normal uppercase tracking-wide">Rule</span>
                      </div>
                      {part.description && (
                        <div className="text-[10px] text-zinc-500 mt-0.5 leading-relaxed">{part.description}</div>
                      )}
                    </div>
                  ))
                )}
                {optionAbilities.flatMap((a, i) =>
                  parseAbility(a).map((part, j) => (
                    <div key={`oa-${i}-${j}`} className="border-b border-zinc-700/40 pb-1.5">
                      <div className="text-[11px] text-zinc-200 font-medium flex items-center gap-1.5">
                        {part.displayName}
                        <span className="text-[9px] bg-cyan-900/50 text-cyan-400 border border-cyan-800/50 px-1 py-px rounded-sm font-normal uppercase tracking-wide">Option</span>
                      </div>
                      {part.description && (
                        <div className="text-[10px] text-zinc-500 mt-0.5 leading-relaxed">{part.description}</div>
                      )}
                    </div>
                  ))
                )}
                {/* Equipment-granted abilities (veteran abilities, daemonic items) */}
                {equipAbilities.flatMap((ab, i) =>
                  parseAbility(ab).map((part, j) => (
                    <div key={`eq-${i}-${j}`} className="border-b border-zinc-700/40 pb-1.5">
                      <div className="text-[11px] text-zinc-200 font-medium flex items-center gap-1.5">
                        {part.displayName}
                        <span className="text-[9px] bg-violet-900/50 text-violet-400 border border-violet-800/50 px-1 py-px rounded-sm font-normal uppercase tracking-wide">Equip</span>
                      </div>
                      {part.description && (
                        <div className="text-[10px] text-zinc-500 mt-0.5 leading-relaxed">{part.description}</div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </details>
            );
          })()}

          </div>{/* close px-3 builder section */}

          {/* ── Keywords ── */}
          {u.keywords.length > 0 && (
            <div className="px-3 py-2.5 border-t border-zinc-700 bg-zinc-800/50">
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest shrink-0 font-semibold">Keywords</span>
                <span className="text-zinc-700 text-[9px]">|</span>
                {u.keywords.map((kw, i) => (
                  <span key={i} className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">
                    {i > 0 && <span className="text-zinc-700 mr-1.5">·</span>}{kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {armoryOpen && <ArmoryModal item={item} unit={u} effectiveHasVetAbilities={effectiveHasVetAbilities} effectiveSlot={effectiveSlot} onClose={() => setArmoryOpen(false)} />}
      {vetOpen && <ArmoryModal item={item} unit={u} effectiveHasVetAbilities={effectiveHasVetAbilities} effectiveSlot={effectiveSlot} filterCategory="veteran" onClose={() => setVetOpen(false)} />}
      {vehOpen && <ArmoryModal item={item} unit={u} effectiveSlot={effectiveSlot} filterCategory="vehicle" onClose={() => setVehOpen(false)} />}
      {traitsOpen && <TraitsModal item={item} unit={u} markUsesSlot={markUsesVetSlot} onClose={() => setTraitsOpen(false)} />}
      {psyOpen && <PsychicModal item={item} unit={effectivePsyker && !u.is_psyker ? { ...u, is_psyker: true } : u} onClose={() => setPsyOpen(false)} />}
    </div>
  );
}

function EquippedWeaponStats({ armItem, extraTraits = [] }: { armItem: ArmoryItem; extraTraits?: string[] }) {
  const cls = 'text-[10px] text-zinc-500 mt-0.5 pl-1 border-l border-amber-900/40';
  function appendTraits(base: string | undefined): string {
    const b = (base && base !== '-') ? base : '';
    return extraTraits.length > 0
      ? [b, ...extraTraits.map(t => `${t} ◆`)].filter(Boolean).join(', ')
      : b;
  }
  if (armItem.profiles && armItem.profiles.length > 0) {
    return (
      <div className={`${cls} space-y-0.5`}>
        {armItem.profiles.map((p, i) => (
          <div key={i}>
            <span className="text-zinc-600 italic">{p.name}:</span>{' '}
            {p.range} · {p.type} · S{p.s} AP{p.ap} D{p.d}
            {(p.abilities && p.abilities !== '-' || extraTraits.length > 0) && (
              <span className={extraTraits.length > 0 ? 'text-violet-400' : 'text-zinc-600'}> · {appendTraits(p.abilities)}</span>
            )}
          </div>
        ))}
      </div>
    );
  }
  if (armItem.range) {
    const merged = appendTraits(armItem.abilities);
    return (
      <div className={cls}>
        {armItem.range} · {armItem.type} · S{armItem.s} AP{armItem.ap} D{armItem.d}
        {merged && (
          <span className={extraTraits.length > 0 ? 'text-violet-400' : 'text-zinc-600'}> · {merged}</span>
        )}
      </div>
    );
  }
  if (armItem.abilities) {
    return <div className={`${cls} italic`}>{appendTraits(armItem.abilities)}</div>;
  }
  return <div className="text-[10px] text-zinc-600 mt-0.5 pl-1 italic">— see faction rules</div>;
}

/** Single-row stat table for a supplementary model (Chaos Ogryn, Traitor Sergeant, etc.) —
 * same columns as the main Profile table but without mark/trait/equip bonus annotations. */
function ModelProfileRow({ m, statKeys }: { m: Model; statKeys: readonly string[] }) {
  return (
    <table className="w-full text-xs border-collapse">
      <thead>
        <tr className="bg-zinc-700/50 border-b border-zinc-600">
          <th className="text-left text-zinc-300 font-semibold py-2 px-2 text-[11px] uppercase tracking-wide">Model</th>
          {statKeys.map(k => (
            <th key={k} className="font-bold text-center py-2 px-2 text-[11px] uppercase tracking-wide min-w-[2rem] text-amber-500">
              {k}
            </th>
          ))}
          <th className="text-right text-zinc-500 font-normal py-2 pr-2 text-[10px] uppercase">Pts</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-zinc-700/40 text-zinc-100">
          <td className="font-semibold py-2 px-2 whitespace-nowrap text-xs">{m.name}</td>
          {statKeys.map(k => (
            <td key={k} className="text-center py-2 px-2 font-mono text-xs text-zinc-100">
              {(m.stats as Record<string, string>)[k] ?? '-'}
            </td>
          ))}
          <td className="text-right text-amber-700 py-2 pr-2 text-xs">{m.points}</td>
        </tr>
      </tbody>
    </table>
  );
}

function WeaponTable({ weapons, traitMap, count }: { weapons: Weapon[]; traitMap?: Map<string, string[]>; count?: number | null }) {
  return (
    <div className="px-3 pb-2">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="border-b border-zinc-600">
            <th className="text-left text-zinc-400 font-semibold py-1.5 pr-2 text-[10px] uppercase tracking-wide w-[32%]">Weapon</th>
            <th className="text-center text-zinc-400 font-semibold py-1.5 px-1 text-[10px] uppercase tracking-wide w-[10%]">Range</th>
            <th className="text-left text-zinc-400 font-semibold py-1.5 px-1 text-[10px] uppercase tracking-wide w-[14%]">Type</th>
            <th className="text-center text-zinc-400 font-semibold py-1.5 px-1 text-[10px] uppercase tracking-wide w-[6%]">S</th>
            <th className="text-center text-zinc-400 font-semibold py-1.5 px-1 text-[10px] uppercase tracking-wide w-[6%]">AP</th>
            <th className="text-center text-zinc-400 font-semibold py-1.5 px-1 text-[10px] uppercase tracking-wide w-[6%]">D</th>
            <th className="text-left text-zinc-400 font-semibold py-1.5 pl-2 text-[10px] uppercase tracking-wide">Abilities</th>
          </tr>
        </thead>
        <tbody>
          {weapons.map((w: Weapon, i: number) => {
            const extraTraits = traitMap?.get(w.name) ?? [];
            const baseAbilities = (w.abilities && w.abilities !== '-') ? w.abilities : '';
            // Merge: keeps best value per ability type. Returns improved (replaced) + added (new).
            // Both get ◆ marker so the player knows the source.
            const { merged: allAbilities, improved, added } = mergeWeaponAbilities(baseAbilities, extraTraits);
            const hasTraitEffect = extraTraits.length > 0;
            const markedSet = new Set([...improved, ...added].map(s => s.toLowerCase().trim()));
            const displayAbilities = hasTraitEffect
              ? allAbilities
                  .split(', ')
                  .map(ab => markedSet.has(ab.toLowerCase().trim()) ? `${ab} ◆` : ab)
                  .join(', ') || '—'
              : allAbilities || '—';
            return (
              <tr key={i} className={`border-b border-zinc-700/40 ${i % 2 !== 0 ? 'bg-zinc-800/30' : ''}`}>
                <td className="py-1.5 pr-2 font-medium text-zinc-100">{count != null ? `${count}x ` : ''}{w.name}</td>
                <td className="py-1.5 px-1 font-mono text-center text-zinc-300">{w.range || '—'}</td>
                <td className="py-1.5 px-1 text-zinc-400 text-[11px]">{w.type}</td>
                <td className="py-1.5 px-1 font-mono text-center text-zinc-200">{w.s}</td>
                <td className="py-1.5 px-1 font-mono text-center text-zinc-200">{w.ap}</td>
                <td className="py-1.5 px-1 font-mono text-center text-zinc-200">{w.d}</td>
                <td className={`py-1.5 pl-2 text-[11px] ${hasTraitEffect ? 'text-violet-300' : 'text-zinc-500'}`}>{displayAbilities}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
