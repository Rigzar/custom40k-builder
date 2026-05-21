import { useState } from 'react';
import type { RosterEntry, Mark, ArmorySelection, TraitSelection } from '../types/army';
import type { Unit, Model, Weapon, Choice, ArmoryItem, FactionData } from '../types/data';
import { useArmyStore } from '../store/army';
import { computeUnitPoints, getActiveVariant, resolveUnit } from '../engine/points';
import { getArchetypeRule, getEffectiveSlot } from '../engine/archetypes';
import { parseAbility } from '../data/coreRules';
import { getTraitEffects } from '../engine/traitEffects';
import { parseEquipMods, isWeaponTrait, extractWeaponGains } from '../engine/equipMods';
import type { EquipMods } from '../engine/equipMods';
import { MarkBadge } from './MarkBadge';
import { ArmoryModal } from './ArmoryModal';
import { TraitsModal } from './TraitsModal';
import { PsychicModal } from './PsychicModal';

const MARKS: Mark[] = ['Undivided', 'Khorne', 'Nurgle', 'Slaanesh', 'Tzeentch'];

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

const SACRED_NUMBERS: Record<string, number> = { Khorne: 8, Nurgle: 7, Slaanesh: 6, Tzeentch: 9 };

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

export function UnitCard({ item }: Props) {
  const { data, archetype, traitPool, removeUnit, updateUnit, setOptionQty } = useArmyStore();
  const [armoryOpen, setArmoryOpen] = useState(false);
  const [vetOpen, setVetOpen] = useState(false);
  const [vehOpen, setVehOpen] = useState(false);
  const [traitsOpen, setTraitsOpen] = useState(false);
  const [psyOpen, setPsyOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  if (!data) return null;
  const u = resolveUnit(item, data);
  if (!u) return null;

  const rule = getArchetypeRule(archetype);
  const effectiveSlot = getEffectiveSlot(item.unitName, item.slot, rule);

  const pts = computeUnitPoints(item, u);
  const variant = getActiveVariant(item, u);
  const variantActive = !!variant;
  const effectiveMark = u.locked_mark ?? (rule?.forcedMark as Mark | null) ?? item.mark;
  const markIsForced = !u.locked_mark && !!rule?.forcedMark;
  // statModMark: the mark whose bonus should be ADDED to the displayed stats.
  // Locked-mark units already have the bonus baked into their base stats, so we skip them.
  const statModMark = u.locked_mark
    ? null
    : (item.mark ?? (markIsForced ? (rule!.forcedMark ?? null) : null));
  const statKeys = u.is_vehicle ? STAT_KEYS_VEH : STAT_KEYS_INF;
  const minSize = unitMinSize(u);
  const maxSize = unitMaxSize(u);
  const hasMarkGroup = u.option_groups.some(g => g.constraint.type === 'mark');
  const hasMarks = Object.keys(data.animosity).length > 0;

  // Favored: unit size is a non-zero multiple of the mark's sacred number (Khorne 8, Nurgle 7, Slaanesh 6, Tzeentch 9)
  const isFavored = !!effectiveMark && effectiveMark !== 'Undivided' &&
    SACRED_NUMBERS[effectiveMark] != null && item.size > 0 &&
    item.size % SACRED_NUMBERS[effectiveMark] === 0;

  // Non-psyker characters with Tzeentch mark become psykers (gain 1 power from any discipline)
  const isTzeentchPsyker = u.is_character && !u.is_psyker && statModMark === 'Tzeentch';

  // Optional psyker: some units (e.g. Daemon Prince) have an inline upgrade "become a psyker for +X pts"
  const psykerGroupIdx = u.option_groups.findIndex(
    g => /psyker/i.test(g.header) && g.inline_pts != null
  );
  const isOptionalPsyker = !u.is_psyker && psykerGroupIdx >= 0 &&
    (item.optionQty[psykerGroupIdx]?.['__inline'] ?? 0) > 0;
  const effectivePsyker = u.is_psyker || isTzeentchPsyker || isOptionalPsyker;

  // Inject "Warded" into abilities for non-locked Tzeentch units that don't already have it
  const markInjectedAbilities: string[] = statModMark === 'Tzeentch' &&
    !u.abilities.some(a => a.toLowerCase().includes('warded')) ? ['Warded'] : [];
  const markUsesVetSlot = hasMarkGroup && !u.locked_mark && !!effectiveMark;
  const vetMax = Math.max(0, (u.veteran_max ?? 2) - (markUsesVetSlot ? 1 : 0));
  const showArmory = u.has_armory_access || u.champion_has_armory || variantActive;

  // Check if the faction armory has veteran / vehicle items for this unit
  const allArmories = [data.armory_general, ...Object.values(data.armory_marks), ...Object.values(data.armory_legions)];
  const hasFactionVeteranItems = u.has_veteran_abilities &&
    allArmories.some(src => (src.equipment as ArmoryItem[]).some(a => a.category === 'veteran'));
  const hasFactionVehicleItems = u.is_vehicle &&
    allArmories.some(src => (src.equipment as ArmoryItem[]).some(a => a.category === 'vehicle'));

  // Count selected armory items by category for badge labels
  const vetItemsCount = item.armory.filter(a => {
    const found = findArmoryItemData(data, a);
    return found?.category === 'veteran';
  }).length;
  const vehItemsCount = item.armory.filter(a => {
    const found = findArmoryItemData(data, a);
    return found?.category === 'vehicle';
  }).length;

  // Army traits: show section whenever the unit actually has traits applied
  const isMainFaction = item.unitName in data.units;
  const showTraits = isMainFaction && item.traits.length > 0;
  // Traits apply to all eligible units with no veteran_max cap — no conflict possible
  const hasTraitConflict = false;

  // Collect structured trait effects for this unit (stat mods, abilities, weapon abilities)
  const traitStatMods: Array<{ stat: string; delta: number }> = [];
  const traitAbilities: Array<{ traitName: string; name: string; desc?: string }> = [];
  const traitWeaponAbilities: Array<{ traitName: string; name: string; weapon_type?: string }> = [];
  if (showTraits) {
    for (const t of item.traits) {
      for (const e of getTraitEffects(t.name, u)) {
        if (e.type === 'stat_mod') {
          traitStatMods.push({ stat: e.stat, delta: e.delta });
        } else if (e.type === 'inv_save') {
          traitAbilities.push({ traitName: t.name, name: `${e.value}+ Invulnerability Save`, desc: `This unit gains a ${e.value}+ invulnerability save.` });
        } else if (e.type === 'unit_ability') {
          traitAbilities.push({ traitName: t.name, name: e.name, desc: e.desc });
        } else if (e.type === 'weapon_ability') {
          traitWeaponAbilities.push({ traitName: t.name, name: e.name, weapon_type: e.weapon_type });
        }
      }
    }
  }

  const modelsToShow: Model[] = variant
    ? [variant, ...u.models.filter((m: Model) => m.max > 0).slice(1)]
    : u.models.filter((m: Model) => m.max > 0);

  // Squad leader = the optional model (min===0); fallback to last model if none
  const squadLeaderIdx = modelsToShow.length <= 1 ? 0 :
    (() => { const idx = modelsToShow.findIndex(m => m.min === 0); return idx >= 0 ? idx : modelsToShow.length - 1; })();

  // Equipment stat/ability mods — all equipment + daemon_weapons that affect the model (not weapon-targeting ones)
  const equipItems = item.armory
    .filter(a => a.section === 'equipment' || (a.section === 'daemon_weapons' && !isWeaponTrait(findArmoryItemData(data, a)?.desc)))
    .map(a => ({ name: a.itemName, desc: findArmoryItemData(data, a)?.desc ?? '' }));
  const equipMods: EquipMods = parseEquipMods(equipItems);

  // Weapon-targeting daemon_weapon traits: weaponName → extra ability tokens
  const weaponTraitMap = new Map<string, string[]>();
  for (const sel of item.armory) {
    if (sel.section === 'daemon_weapons' && sel.targetWeapon) {
      const armItem = findArmoryItemData(data, sel);
      if (armItem?.desc && isWeaponTrait(armItem.desc)) {
        const gains = extractWeaponGains(armItem.desc);
        if (gains.length > 0) {
          const existing = weaponTraitMap.get(sel.targetWeapon) ?? [];
          weaponTraitMap.set(sel.targetWeapon, [...existing, ...gains]);
        }
      }
    }
  }

  const hasEquipEffects = Object.keys(equipMods.statDeltas).length > 0 || equipMods.armorSave !== null || equipMods.invulnSave !== null;

  function setQty(gi: number, ci: string | number, qty: number) {
    setOptionQty(item.id, gi, ci, qty);
  }

  return (
    <div className="bg-zinc-800 border border-zinc-700 border-l-4 border-l-amber-700 mb-3">
      {/* Header */}
      <div className="flex justify-between items-center px-3 py-2 bg-gradient-to-r from-zinc-800 to-zinc-900 border-b border-zinc-700">
        <div>
          <div className="text-amber-400 font-semibold text-sm">
            {u.name}
            {variant && (
              <span className="text-amber-600 font-normal text-xs ml-1">→ {variant.name}</span>
            )}
          </div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-wide mt-0.5">
            {effectiveSlot !== item.slot
              ? <><span className="line-through text-zinc-600">{item.slot}</span> → {effectiveSlot}</>
              : item.slot
            } · {u.unit_type}
            {effectiveMark && (
              <span className="ml-1">
                <MarkBadge
                  mark={effectiveMark}
                  suffix={u.locked_mark ? '(locked)' : markIsForced ? '(archetype)' : undefined}
                />
              </span>
            )}
            {isFavored && (
              <span className="ml-1 text-[9px] bg-amber-900/50 text-amber-300 border border-amber-700/60 px-1 py-px uppercase tracking-wide font-semibold">
                ★ Favored
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-amber-500 font-bold">{pts} pts</span>
          <button
            onClick={() => setCollapsed(c => !c)}
            className="text-zinc-500 hover:text-zinc-300 text-xs px-1"
          >
            {collapsed ? '▼' : '▲'}
          </button>
          <button
            onClick={() => removeUnit(item.id)}
            className="text-red-500 border border-red-800 hover:bg-red-900 px-2 py-0.5 text-[11px] uppercase"
          >
            ✕
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="p-3 space-y-3">
          {/* Default loadout */}
          {u.equipped_with && (
            <div className="text-[11px] text-zinc-400 border-l-2 border-amber-800 pl-2 py-0.5">
              <span className="text-amber-700 text-[10px] uppercase tracking-widest mr-1">Default:</span>
              {u.equipped_with}
            </div>
          )}

          {/* Stat profile */}
          <div>
            <div className="text-[10px] text-amber-700 uppercase tracking-widest mb-1">
              Profile
              {(isFavored || (statModMark && MARK_STAT_MODS[statModMark] && (
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
            <table className="w-full text-[11px] border-collapse">
              <thead>
                <tr className="border-b border-zinc-600">
                  <th className="text-left text-zinc-500 font-normal py-1 pr-2">Model</th>
                  {statKeys.map(k => (
                    <th key={k} className="text-amber-700 font-normal text-center py-1 px-1">{k}</th>
                  ))}
                  <th className="text-right text-zinc-500 font-normal py-1 pl-2">Pts</th>
                </tr>
              </thead>
              <tbody>
                {modelsToShow.map((m, i) => {
                  const isVar = variant && m === variant;
                  return (
                    <tr key={i} className={`border-b border-zinc-700/50 ${isVar ? 'text-amber-400' : 'text-zinc-200'}`}>
                      <td className="font-semibold py-1 pr-2 whitespace-nowrap">{m.name}{isVar ? ' ★' : ''}</td>
                      {statKeys.map(k => {
                        const raw = (m.stats as Record<string, string>)[k] ?? '-';
                        let display = raw;
                        let markBoosted = false;
                        let traitBoosted = false;
                        let equipBoosted = false;

                        // Apply mark stat bonus (vehicles get ability-based bonuses only, no stat deltas)
                        if (statModMark && MARK_STAT_MODS[statModMark] && !u.is_vehicle) {
                          const mods = MARK_STAT_MODS[statModMark];
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

                        const cellClass = markBoosted
                          ? 'text-blue-400 font-bold'
                          : traitBoosted
                            ? 'text-emerald-400 font-bold'
                            : equipBoosted
                              ? 'text-violet-400 font-bold'
                              : '';
                        const suffix = markBoosted ? '*' : traitBoosted ? '†' : equipBoosted ? '◆' : '';
                        return (
                          <td key={k} className={`text-center py-1 px-1 ${cellClass}`}>
                            {display}{suffix}
                          </td>
                        );
                      })}
                      <td className="text-right text-amber-600 py-1 pl-2">{m.points}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {/* Equipment invuln save note */}
            {!u.is_vehicle && equipMods.invulnSave !== null && (
              <div className="mt-1 text-[10px] text-violet-400/90 border-l-2 border-violet-900 pl-2">
                <span className="font-semibold">Equipment:</span> {equipMods.invulnSave}+ Invulnerable Save
              </div>
            )}
            {/* Equipment-granted abilities (quoted in item descriptions) */}
            {equipMods.grantedAbilities.filter(ab =>
              !u.abilities.some(a => a.toLowerCase().includes(ab.toLowerCase()))
            ).length > 0 && (
              <div className="mt-1 text-[10px] text-violet-400/90 border-l-2 border-violet-900 pl-2">
                <span className="font-semibold">Equipment grants:</span>{' '}
                {equipMods.grantedAbilities
                  .filter(ab => !u.abilities.some(a => a.toLowerCase().includes(ab.toLowerCase())))
                  .join(', ')}
              </div>
            )}
          </div>

          {/* Built-in weapons */}
          {u.weapons.length > 0 && (
            <div>
              <div className="text-[10px] text-amber-700 uppercase tracking-widest mb-1">Weapons</div>
              <WeaponTable weapons={u.weapons} traitMap={weaponTraitMap} />
            </div>
          )}

          {/* Squad size */}
          {maxSize > 1 && (
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
            <div className={traitPool.includes('Black Crusade') && effectiveSlot === 'HQ' && !item.mark ? 'border border-amber-900/60 p-1.5' : ''}>
              <div className="text-[10px] text-amber-700 uppercase tracking-widest mb-1">
                Chaos Mark
                {traitPool.includes('Black Crusade') && effectiveSlot === 'HQ' && (
                  <span className="ml-1 text-amber-600 normal-case font-normal">(Black Crusade: assign a different god mark to each HQ)</span>
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                {MARKS.map(m => (
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
          )}
          {markIsForced && (
            <div className="text-[10px] text-amber-700/60 border-l-2 border-amber-900 pl-2 italic">
              Mark forced by archetype: {rule?.forcedMark}
            </div>
          )}
          {/* Mark stat bonus — shown for player-chosen or archetype-forced marks (never for locked) */}
          {statModMark && MARK_BONUSES[statModMark] && (
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
          )}
          {isFavored && effectiveMark && SACRED_NUMBERS[effectiveMark] && (
            <div className="text-[10px] text-amber-400/80 border-l-2 border-amber-700 pl-2 mt-0.5">
              <span className="font-semibold">★ Favored of {effectiveMark}</span>{' '}
              (size {SACRED_NUMBERS[effectiveMark]}×): squad leader gains +1 Attack and a personal icon.
            </div>
          )}

          {/* Option groups */}
          {u.option_groups.filter(g => !isMarkGroup(g) && !g.variant_link || g.variant_link).map((g) => {
            const realGi = u.option_groups.indexOf(g);
            if (isMarkGroup(g)) return null;

            if (g.variant_link) {
              const active = !!(item.optionQty?.[realGi]?.['__inline']);
              return (
                <div key={realGi} className="text-[12px]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => setQty(realGi, '__inline', active ? 0 : 1)}
                    />
                    <span className="text-zinc-300">{g.header}</span>
                    {g.inline_pts != null && (
                      <span className="text-amber-600 text-[11px]">
                        {g.inline_pts >= 0 ? '+' : ''}{g.inline_pts} pts
                      </span>
                    )}
                  </label>
                </div>
              );
            }

            // Option group with a cost but no sub-choices (e.g. "Can be equipped with
            // a Storm bolter for +11 pts.") — render as a simple on/off toggle.
            if (g.choices.length === 0 && g.inline_pts != null) {
              const active = !!(item.optionQty?.[realGi]?.['__inline']);
              return (
                <div key={realGi} className="text-[12px]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => setQty(realGi, '__inline', active ? 0 : 1)}
                    />
                    <span className="text-zinc-300">{g.header}</span>
                    <span className="text-amber-600 text-[11px]">
                      {g.inline_pts >= 0 ? '+' : ''}{g.inline_pts} pts
                    </span>
                  </label>
                </div>
              );
            }

            const isPerN = g.constraint.type === 'per_n';
            const groupMax = isPerN
              ? (g.constraint.count_per_n ?? 1) * Math.floor(item.size / (g.constraint.per_n ?? 1))
              : null;
            const groupUsed = isPerN
              ? Object.entries(item.optionQty?.[realGi] ?? {}).reduce(
                  (s, [k, v]) => k === '__inline' ? s : s + (v ?? 0), 0
                )
              : null;
            const groupRemaining = groupMax !== null && groupUsed !== null ? groupMax - groupUsed : null;

            return (
              <div key={realGi}>
                <div className="text-[11px] text-zinc-400 mb-1 flex items-center gap-2">
                  {g.header}
                  {isPerN && groupMax !== null && (
                    <span className={`text-[10px] font-semibold ${groupUsed! >= groupMax ? 'text-red-400' : 'text-amber-600'}`}>
                      [{groupUsed}/{groupMax}]
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  {g.choices.map((c: Choice, ci: number) => {
                    const qty = item.optionQty?.[realGi]?.[ci] ?? 0;
                    const canUseQty = ['per_n', 'fixed_max', 'every'].includes(g.constraint.type);
                    const inputMax = isPerN && groupRemaining !== null
                      ? qty + groupRemaining
                      : g.constraint.type === 'every'
                        ? item.size
                        : undefined;
                    return (
                      <div
                        key={ci}
                        className="flex items-center gap-1 bg-zinc-900 border border-zinc-600 px-2 py-1 text-[11px]"
                      >
                        {canUseQty ? (
                          <input
                            type="number"
                            min={0}
                            max={inputMax}
                            value={qty}
                            onChange={e => {
                              const v = Math.max(0, Number(e.target.value));
                              const capped = inputMax !== undefined ? Math.min(v, inputMax) : v;
                              setQty(realGi, ci, capped);
                            }}
                            className="w-10 bg-transparent text-zinc-100 text-center focus:outline-none"
                          />
                        ) : (
                          <input
                            type="checkbox"
                            checked={qty > 0}
                            onChange={() => setQty(realGi, ci, qty > 0 ? 0 : 1)}
                          />
                        )}
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
              </div>
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
              const totalCount = item.powers.length + item.prayers.length + pactCount;
              const label = hasPacts && !hasPowers && !hasPrayers
                ? `Pacts (${pactCount})`
                : u.is_cult_initiate
                  ? `Cult Powers (${item.powers.length})`
                  : hasPowers && hasPrayers
                    ? `Powers/Prayers (${totalCount})`
                    : hasPrayers
                      ? `Prayers (${item.prayers.length})`
                      : `Powers (${item.powers.length})`;
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
              const d = findArmoryItemData(data, a);
              return !d?.category;
            });
            const veterans = item.armory.filter(a => findArmoryItemData(data, a)?.category === 'veteran');
            const vehicles = item.armory.filter(a => findArmoryItemData(data, a)?.category === 'vehicle');

            function ArmoryRow({ a }: { a: ArmorySelection }) {
              const armItem = findArmoryItemData(data, a);
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
          {item.powers.length > 0 && (
            <div className="space-y-1">
              <div className="text-[10px] text-amber-700 uppercase tracking-widest">Psychic Powers</div>
              {item.powers.map((p, i) => (
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

          {/* Abilities (native + trait + mark-injected) */}
          {(u.abilities.length > 0 || traitAbilities.length > 0 || traitWeaponAbilities.length > 0 || markInjectedAbilities.length > 0) && (
            <details>
              <summary className="text-[11px] text-amber-700 cursor-pointer select-none">
                Abilities ({u.abilities.length + traitAbilities.length + traitWeaponAbilities.length + markInjectedAbilities.length})
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
                {traitWeaponAbilities.map((wa, i) => (
                  <div key={`wa-${i}`} className="border-b border-zinc-700/40 pb-1.5">
                    <div className="text-[11px] text-zinc-200 font-medium flex items-center gap-1.5">
                      {wa.name}
                      <span className="text-[9px] bg-emerald-900/50 text-emerald-400 border border-emerald-800/50 px-1 py-px rounded-sm font-normal uppercase tracking-wide">
                        Trait · {wa.weapon_type === 'bolt' ? 'Bolt weapons' : wa.weapon_type === 'melee' ? 'Melee weapons' : 'Ranged weapons'}
                      </span>
                    </div>
                  </div>
                ))}
                {markInjectedAbilities.flatMap((a, i) =>
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
              </div>
            </details>
          )}

          {/* Keywords */}
          {u.keywords.length > 0 && (
            <div className="text-[10px] text-zinc-600 italic border-l-2 border-zinc-700 pl-2">
              {u.keywords.join(', ')}
            </div>
          )}
        </div>
      )}

      {armoryOpen && <ArmoryModal item={item} unit={u} onClose={() => setArmoryOpen(false)} />}
      {vetOpen && <ArmoryModal item={item} unit={u} filterCategory="veteran" onClose={() => setVetOpen(false)} />}
      {vehOpen && <ArmoryModal item={item} unit={u} filterCategory="vehicle" onClose={() => setVehOpen(false)} />}
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

function WeaponTable({ weapons, traitMap }: { weapons: Weapon[]; traitMap?: Map<string, string[]> }) {
  return (
    <table className="w-full text-[11px] mt-2 border-collapse">
      <thead>
        <tr className="border-b border-zinc-600">
          {['Name','Range','Type','S','AP','D','Abilities'].map(h => (
            <th key={h} className="text-left text-amber-700 font-normal py-1 pr-2 uppercase text-[10px] tracking-wide">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {weapons.map((w: Weapon, i: number) => {
          const extraTraits = traitMap?.get(w.name) ?? [];
          const baseAbilities = (w.abilities && w.abilities !== '-') ? w.abilities : '';
          const allAbilities = extraTraits.length > 0
            ? [baseAbilities, ...extraTraits.map(t => `${t} ◆`)].filter(Boolean).join(', ')
            : baseAbilities || '-';
          return (
            <tr key={i} className="border-b border-zinc-700/40 text-zinc-300">
              <td className="py-1 pr-2">{w.name}</td>
              <td className="py-1 pr-2">{w.range}</td>
              <td className="py-1 pr-2">{w.type}</td>
              <td className="py-1 pr-2">{w.s}</td>
              <td className="py-1 pr-2">{w.ap}</td>
              <td className="py-1 pr-2">{w.d}</td>
              <td className={`py-1 text-[10px] ${extraTraits.length > 0 ? 'text-violet-300' : 'text-zinc-500'}`}>{allAbilities}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
