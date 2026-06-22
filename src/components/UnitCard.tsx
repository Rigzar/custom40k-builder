import { useState } from 'react';
import { mergeWeaponAbilities } from '../engine/abilityMerge';
import type { RosterEntry, Mark, ArmorySelection, TraitSelection } from '../types/army';
import type { Unit, Weapon, Choice, ArmoryItem, FactionData, Model } from '../types/data';
import { useArmyStore } from '../store/army';
import { resolveUnit, liveArmoryPoints } from '../engine/points';
import { parseAbility } from '../data/coreRules';
import { isWeaponTrait, extractWeaponGains, parseInvSaveFromAbilities } from '../engine/equipMods';
import { resolveUnitProfile, isOptionAvailable } from '../engine/resolver';
import { getArchetypeRule } from '../engine/archetypes';
import { isPlatoonMemberUnit, listPlatoonAnchors, PLATOON_ANCHOR_UNIT } from '../engine/codex_imperial_guard/platoon';
import { getArmySymbolUrl } from '../utils/getArmySymbolUrl';
import { SACRED_NUMBERS } from '../engine/resolvers/chaos_daemons';
import { MarkBadge } from './MarkBadge';
import { ArmoryModal } from './ArmoryModal';
import { TraitsModal } from './TraitsModal';
import { PsychicModal } from './PsychicModal';

// NOTE: marks shown per unit come from the unit's mark option_group choices[], not this array.
// This array is kept only for the Black Crusade champion display which needs all 4 god marks.
const MARKS_ALL: Mark[] = ['Undivided', 'Khorne', 'Nurgle', 'Slaanesh', 'Tzeentch'];

const MARK_ICON: Record<string, string> = {
  Khorne:    '/mark-icons/khorne.svg',
  Nurgle:    '/mark-icons/nurgle.svg',
  Slaanesh:  '/mark-icons/slaanesh.svg',
  Tzeentch:  '/mark-icons/tzeentch.svg',
  Undivided: '/mark-icons/undivided.svg',
};
const MARK_STYLE: Record<string, { idle: string; active: string; filter: string }> = {
  Khorne:    { idle: 'border-red-900    text-red-400/70',    active: 'border-red-600    bg-red-900/50    text-red-300',    filter: 'brightness(0) invert(1) sepia(1) saturate(8) hue-rotate(300deg)' },
  Nurgle:    { idle: 'border-green-900  text-green-400/70',  active: 'border-green-700  bg-green-900/50  text-green-300',  filter: 'brightness(0) invert(1) sepia(1) saturate(4) hue-rotate(80deg)' },
  Slaanesh:  { idle: 'border-purple-900 text-purple-400/70', active: 'border-purple-700 bg-purple-900/50 text-purple-300', filter: 'brightness(0) invert(1) sepia(1) saturate(4) hue-rotate(220deg)' },
  Tzeentch:  { idle: 'border-blue-900   text-blue-400/70',   active: 'border-blue-700   bg-blue-900/50   text-blue-300',   filter: 'brightness(0) invert(1) sepia(1) saturate(4) hue-rotate(180deg)' },
  Undivided: { idle: 'border-zinc-700   text-zinc-400/70',   active: 'border-amber-700  bg-amber-900/30  text-amber-300',  filter: 'brightness(0) invert(1) sepia(1) saturate(2) hue-rotate(-15deg)' },
};

const STAT_ICONS: Partial<Record<string, string>> = {
  M:    '/stat-icons/move.svg',
  WS:   '/stat-icons/weapon-skill.svg',
  BS:   '/stat-icons/ballistic-skill.svg',
  S:    '/stat-icons/strength.svg',
  STR:  '/stat-icons/strength.svg',
  T:    '/stat-icons/toughness.svg',
  W:    '/stat-icons/wounds.svg',
  HP:   '/stat-icons/wounds.svg',
  A:    '/stat-icons/attacks.svg',
  LD:   '/stat-icons/leadership.svg',
  SV:   '/stat-icons/save.svg',
  I:    '/stat-icons/initiative.svg',
  AP:   '/stat-icons/armour-penetration.svg',
  D:    '/stat-icons/damage.svg',
  Range: '/stat-icons/range.svg',
};

const WEAPON_TYPE_ICONS: Partial<Record<string, string>> = {
  'Rapid Fire': '/weapon-type-icons/rapid-fire.svg',
  Assault:      '/weapon-type-icons/assault.svg',
  Heavy:        '/weapon-type-icons/heavy.svg',
  Pistol:       '/weapon-type-icons/pistol.svg',
  Grenade:      '/weapon-type-icons/grenade.svg',
  Melee:        '/weapon-type-icons/melee.svg',
};

const STAT_ICON_FILTER = 'brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(-15deg)';
const TYPE_ICON_FILTER  = 'brightness(0) invert(1)';

function getFactionCat(faction: string): 'chaos' | 'imperium' | 'xenos' | 'supp' {
  if (/chaos/i.test(faction)) return 'chaos';
  if (/space marines|imperial|mechanicus|custodes|sororitas|grey knights|inquisition/i.test(faction)) return 'imperium';
  if (/tau|necron|ork|eldar|genestealer|harlequin|votann|tyranid/i.test(faction)) return 'xenos';
  return 'supp';
}
const HDR_BG: Record<string, string> = {
  chaos:   'linear-gradient(135deg, #311212 0%, #1d0a0a 100%)',
  imperium:'linear-gradient(135deg, #27220f 0%, #18150a 100%)',
  xenos:   'linear-gradient(135deg, #0e2016 0%, #090f0c 100%)',
  supp:    'linear-gradient(135deg, #191828 0%, #0f0e1a 100%)',
};
const HDR_BORDER: Record<string, string> = {
  chaos:   '#8b1c1c',
  imperium:'#8b7a1c',
  xenos:   '#1c7a42',
  supp:    '#42427a',
};

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
function resolveChoiceWeapons(weapons: Weapon[], choiceName: string): { weapons: Weapon[]; compound: boolean } {
  const exact = weapons.find(w => w.name === choiceName);
  if (exact) return { weapons: [exact], compound: false };
  const multiProfile = weapons.filter(w => w.name.startsWith(`${choiceName} - `));
  if (multiProfile.length > 0) return { weapons: multiProfile, compound: false };
  const parts = choiceName.split(/\s*(?:&|\band\b)\s*/i).filter(Boolean);
  if (parts.length > 1) {
    const resolved = parts.map(p => resolveChoiceWeapons(weapons, p));
    if (resolved.every(r => r.weapons.length > 0)) {
      return { weapons: resolved.flatMap(r => r.weapons), compound: true };
    }
  }
  return { weapons: [], compound: false };
}

export function UnitCard({ item }: Props) {
  const store = useArmyStore();
  const { data, alliedData, traitPool, removeUnit, updateUnit, updateModelSize, setOptionQty, setUnitCustomName, setUnitJoinTarget, setPlatoonLink, army, legacy, legacy2, archetype, addArmoryItem, removeArmoryItem } = store;
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
    effectivePsyker, psykerGroupIdx,
    isFavored, effectiveHasVetAbilities, equippedWith, weaponsToShow, weaponGroups, weaponTraitMap,
    injectedAbilities, injectedRuleNotes, equipMods,
    traitStatMods, traitAbilities,
    blackCrusadeChampion,
    ctanYngirActive,
    optionStatMods, optionAddedUnitTypes, optionSetUnitType, optionAbilities,
  } = rp;
  const baseTypeDisplay = optionSetUnitType ?? u.unit_type;
  const unitTypeDisplay = [baseTypeDisplay, ...optionAddedUnitTypes].filter(Boolean).join(', ');
  const factionCat = getFactionCat(data.faction);

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
  // Option-granted abilities (e.g. Dire Avenger Exarch's purchased Shimmershield) are gated on
  // the option actually being selected (see resolver.ts's optionAbilities/effect.grants_abilities),
  // unlike u.abilities — which is why they need their own scan rather than folding into baseInvSave.
  const optionInvSave = parseInvSaveFromAbilities(optionAbilities);
  // Trait inv saves: "X+ Invulnerability Save" in traitAbilities (from inv_save effect)
  // + Berserk(X+) ability name (gives X+ inv per core rules)
  const traitInvSave: number | null = traitAbilities.reduce<number | null>((best, ta) => {
    const m1 = ta.name.match(/^(\d)\+\s+Invulnerability/i);
    if (m1) { const v = parseInt(m1[1]); return best === null || v < best ? v : best; }
    const m2 = ta.name.match(/^Berserk\((\d)\+\)/i);
    if (m2) { const v = parseInt(m2[1]); return best === null || v < best ? v : best; }
    return best;
  }, null);
  const allInvCandidates = [baseInvSave, equipInvSave, optionInvSave, traitInvSave].filter((v): v is number => v !== null);
  const effectiveInvSv: number | null = allInvCandidates.length > 0 ? Math.min(...allInvCandidates) : null;
  // Source markers for ◆ indicator
  const invSvFromEquip = equipInvSave !== null && (baseInvSave === null || equipInvSave <= (baseInvSave ?? 99)) && equipInvSave === effectiveInvSv;
  const invSvFromTrait = traitInvSave !== null && traitInvSave === effectiveInvSv && equipInvSave !== effectiveInvSv;

  const statKeys: readonly string[] = u.is_vehicle
    ? (vehicleHasWS ? ['M','WS','BS','S','FRONT','SIDE','REAR','I','A','HP'] : STAT_KEYS_VEH)
    : [...STAT_KEYS_INF, ...(effectiveInvSv !== null ? ['InvSv'] : [])];
  const minSize = unitMinSize(u);
  const maxSize = unitMaxSize(u);
  // Disjoint legal range ("1 or 4-10", e.g. Necrons Lychguard) — see Model.squad_min. Only
  // meaningful for single-model-group units; multi-group units use the modelSizes stepper instead.
  const squadMin = u.models.length === 1 ? u.models[0].squad_min : undefined;
  // Dynamic ratio cap for a secondary model group (e.g. Traitor Guard "1 Chaos Ogryn per 10
  // Traitor Guardsman") — see Model.ratio_per_n/ratio_of. Falls back to the static max when unset.
  const effectiveModelMax = (m: typeof u.models[number]) => {
    if (!m.ratio_per_n || !m.ratio_of) return m.max;
    const primaryCount = item.modelSizes?.[m.ratio_of] ?? 0;
    return Math.min(m.max, Math.floor(primaryCount / m.ratio_per_n));
  };
  // Only count mark groups whose host condition holds — a Horus Heresy unit's Mark-of-Chaos
  // group (available_if: Chaos Space Marines force) must not show under a Space Marine host.
  const hasMarkGroup = u.option_groups.some(g =>
    g.constraint.type === 'mark' &&
    isOptionAvailable(g.available_if, effectiveMark ?? null, u.keywords, data.faction, archetype));
  const hasMarks = Object.keys(data.animosity).length > 0;
  // Armory access gated behind a variant promotion (e.g. Traitor Sergeant, Aspiring Champion —
  // header says "...gains access to [weapons and gear from] the Armory") is shown inside that
  // variant's own collapsible block, not in the global action row.
  // Armory in a variant block is surfaced inside that block — the global action-row button
  // must not also appear. Detect: any variant_link group when champion_has_armory is true,
  // OR a variant_link whose header explicitly mentions "armory".
  const armoryGatedByVariant = u.option_groups.some(g =>
    g.variant_link && (/armory/i.test(g.header) || u.champion_has_armory)
  );
  // A built-in champion/leader model (e.g. Plague Champion: min===1, max===1 in models[1]) with
  // its own Armory access gets a dedicated profile+Armory block (see squad-size section below)
  // instead of the generic bottom Armory button.
  const builtInChampion = u.models.length > 1 && u.models[1].min === 1 && u.models[1].max === 1 ? u.models[1] : null;
  const championArmoryInOwnBlock = !!builtInChampion && u.champion_has_armory && !armoryGatedByVariant;
  // NOTE: a bare `variantActive` fallback (any promoted variant model gets Armory access,
  // regardless of has_armory_access/champion_has_armory) used to live here. Audited 2026-06-21
  // against every faction's variant_models units: zero genuinely need it — Eldar Exarchs/Klaivex
  // etc. have their own fixed-cost option_groups for wargear, no Armory mechanic. Removed; if a
  // promoted variant genuinely needs Armory, set champion_has_armory/has_armory_access explicitly.
  const showArmory = u.has_armory_access || (u.champion_has_armory && !armoryGatedByVariant && !championArmoryInOwnBlock);

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
    // "one" constraint = exclusive pick (radio), not independent checkboxes — selecting a new
    // choice must clear any other choice already on in this group, or the player ends up able
    // to buy every option in a "may be equipped with one of the following" group at once.
    const g = u.option_groups[gi];
    if (g?.constraint.type === 'one' && qty > 0 && ci !== '__inline') {
      const current = item.optionQty?.[gi] ?? {};
      for (const otherCi of Object.keys(current)) {
        if (otherCi !== String(ci) && otherCi !== '__inline' && current[Number(otherCi)]) {
          setOptionQty(item.id, gi, Number(otherCi), 0);
        }
      }
    }
    setOptionQty(item.id, gi, ci, qty);
  }

  return (
    <div className="bg-zinc-900 border border-zinc-700 mb-3 overflow-hidden">
      {/* ── Header ── */}
      <div className="flex justify-between items-start px-3 py-2.5 border-b-2"
        style={{ background: HDR_BG[factionCat], borderBottomColor: HDR_BORDER[factionCat] }}
      >
        <div className="flex-1 min-w-0 flex items-start gap-2">
          {/* Army symbol */}
          {(() => {
            const sym = getArmySymbolUrl(data.faction, archetype ?? null, legacy ?? null, legacy2 ?? null);
            const src = sym ?? `/faction-symbols/${data.faction.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.svg`;
            return (
              <img src={src} alt="" aria-hidden="true" className="shrink-0 mt-0.5 opacity-60"
                style={{ width: 44, height: 44, filter: 'brightness(0) invert(1)' }} />
            );
          })()}
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
                <span className="font-cinzel text-white font-bold text-base uppercase tracking-wider leading-tight">
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
          </div>{/* /flex-1 inner */}
        </div>
        {/* Right: slot badge + controls + pts */}
        <div className="flex flex-col items-end gap-1.5 ml-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="font-cinzel text-[9px] uppercase tracking-widest px-2 py-0.5 border bg-black/30 text-amber-400"
              style={{ borderColor: HDR_BORDER[factionCat] }}
            >
              {effectiveSlot !== item.slot ? effectiveSlot : effectiveSlot}
            </span>
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
          <span className="text-amber-400 font-bold text-base">{pts}<span className="text-amber-700 text-[11px] font-normal ml-0.5">pts</span></span>
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
        // Core Rules glossary, "Command Squad": only models with this ability may join a unit
        // that already has another character attached — see the matching validator in
        // validators.ts. Block it here too, not just as a post-hoc warning, so the player can't
        // pick an already-occupied unit in the first place unless they actually have the ability.
        const hasCommandSquad =
          !!u.abilities?.some(a => /Command Squad/i.test(a)) ||
          !!rule?.grantsCommandSquad?.includes(item.unitName);
        const joinableUnits = army.filter(e => {
          if (e.id === item.id || e.factionSource) return false;
          const eu = data?.units[e.unitName];
          if (!eu || eu.is_character || eu.is_vehicle || eu.is_monster) return false;
          if (data.faction === 'Chaos Space Marines' || data.faction === 'Chaos Daemons') {
            const unitMark = (eu.locked_mark ?? rule?.forcedMark ?? e.mark ?? null) as Mark | null;
            if (effectiveMark && unitMark && effectiveMark !== unitMark) return false;
          }
          if (!hasCommandSquad && e.id !== item.joinedToUnit) {
            const alreadyJoined = army.some(other => other.id !== item.id && other.joinedToUnit === e.id);
            if (alreadyJoined) return false;
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

      {/* ── Platoon link (Imperial Guard "Platoon" grouping, ki-45b) ──
           Infantry Squad / Conscript Infantry Platoon / Special Weapon Squad / Heavy Weapon
           Squad linked to a live Platoon Command Squad fold into that PCS's single Troops
           slot instead of each costing their own. */}
      {data?.faction === 'Imperial Guard' && !item.factionSource && isPlatoonMemberUnit(item.unitName) && (() => {
        const anchors = listPlatoonAnchors(army);
        if (anchors.length === 0) return null;
        return (
          <div className="px-3 py-1.5 bg-zinc-900 border-b border-zinc-700 flex items-center gap-2">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest shrink-0">↳ Platoon</span>
            <select
              value={item.platoonId ?? ''}
              onChange={e => setPlatoonLink(item.id, e.target.value || null)}
              className="flex-1 bg-zinc-800 border border-zinc-600 text-zinc-300 text-[11px] px-1.5 py-0.5 focus:outline-none focus:border-amber-700"
            >
              <option value="">— independent (own slot) —</option>
              {anchors.map(a => (
                <option key={a.id} value={a.id}>
                  {a.customName || PLATOON_ANCHOR_UNIT} ({a.id.slice(0, 6)})
                </option>
              ))}
            </select>
          </div>
        );
      })()}

      {/* ── Traitor Guard Mark of Chaos (IG units have no native mark group of their own) ──
           ods-verbatim "point cost per model and per Wound": Khorne/Slaanesh +1, Nurgle/Tzeentch
           +2 per model per Wound; vehicles flat +10 any mark. Counts as the unit's veteran
           ability (rules owner, 2026-06-20) — already wired via grantsMarkPurchase in
           resolver.ts/ArmoryModal.tsx's hasMarkGroup, no extra UI needed for that part. */}
      {data?.faction === 'Imperial Guard' && archetype === 'Traitor Guard' && !item.factionSource && !u.locked_mark && (
        <div className="px-3 py-1.5 bg-zinc-900 border-b border-zinc-700 flex items-center gap-2">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest shrink-0">↳ Mark of Chaos</span>
          <select
            value={item.mark ?? ''}
            onChange={e => updateUnit(item.id, { mark: (e.target.value || null) as typeof item.mark })}
            className="flex-1 bg-zinc-800 border border-zinc-600 text-zinc-300 text-[11px] px-1.5 py-0.5 focus:outline-none focus:border-amber-700"
          >
            <option value="">— none —</option>
            {u.is_vehicle ? (
              <>
                <option value="Khorne">Khorne (+10pts flat)</option>
                <option value="Slaanesh">Slaanesh (+10pts flat)</option>
                <option value="Nurgle">Nurgle (+10pts flat)</option>
                <option value="Tzeentch">Tzeentch (+10pts flat)</option>
              </>
            ) : (
              <>
                <option value="Khorne">Khorne (+1pt/model/Wound)</option>
                <option value="Slaanesh">Slaanesh (+1pt/model/Wound)</option>
                <option value="Nurgle">Nurgle (+2pts/model/Wound)</option>
                <option value="Tzeentch">Tzeentch (+2pts/model/Wound)</option>
              </>
            )}
          </select>
        </div>
      )}

      {/* ── Yngir: "One C'tan shard (any kind) counts as an HQ selection" (ods-verbatim) ──
           Only ONE entry in the whole army may take this — hard-enforced by disabling the
           toggle (not just a warning note) once another C'tan Shard entry already has it. */}
      {data?.faction === 'Necrons' && archetype === 'Yngir' && !item.factionSource && /^C'tan Shard/.test(u.name) && (() => {
        const otherActive = army.some(e => e.id !== item.id && e.ctanYngirUpgrade && /^C'tan Shard/.test(e.unitName));
        const checked = !!item.ctanYngirUpgrade;
        return (
          <div className="px-3 py-1.5 bg-zinc-900 border-b border-zinc-700 flex items-center gap-2">
            <label
              onClick={() => { if (!otherActive || checked) updateUnit(item.id, { ctanYngirUpgrade: !checked }); }}
              className={`flex items-center gap-2 text-[11px] ${otherActive && !checked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
              <div className={`w-3.5 h-3.5 border flex-shrink-0 flex items-center justify-center transition-colors ${checked ? 'bg-amber-700 border-amber-600' : 'bg-zinc-900 border-zinc-600'}`}>
                {checked && <span className="text-[8px] text-white leading-none">✓</span>}
              </div>
              <span className="text-zinc-300">↳ Yngir's chosen C'tan Shard (HQ slot, +1 S/T/I/A, 2+ Sv, +85pts)</span>
            </label>
            {otherActive && !checked && (
              <span className="text-[10px] text-red-400/80">Another C'tan Shard already has this</span>
            )}
          </div>
        );
      })()}

      {/* ── Gue'vesa Lasgun/Hot-shot lasgun → Pulse rifle swap (per model, ods-verbatim) ── */}
      {data?.faction === 'Imperial Guard' && archetype === 'Gue\'vesa' && !item.factionSource && !u.is_vehicle && (() => {
        const hasLasgun = (u.equipped_with ?? '').includes('Lasgun');
        const hasHotshot = (u.equipped_with ?? '').includes('Hot-shot lasgun');
        if (!hasLasgun && !hasHotshot) return null;
        return (
          <div className="px-3 py-1.5 bg-zinc-900 border-b border-zinc-700 flex flex-col gap-1">
            {hasLasgun && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest shrink-0 flex-1">↳ Lasgun → Pulse rifle (+3pt/model)</span>
                <input
                  type="number" min={0} max={item.size}
                  value={item.gueVesaLasgunSwaps ?? 0}
                  onChange={e => updateUnit(item.id, { gueVesaLasgunSwaps: Math.max(0, Math.min(item.size, parseInt(e.target.value, 10) || 0)) })}
                  className="w-14 bg-zinc-800 border border-zinc-600 text-zinc-300 text-[11px] px-1.5 py-0.5 focus:outline-none focus:border-amber-700"
                />
              </div>
            )}
            {hasHotshot && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest shrink-0 flex-1">↳ Hot-shot lasgun → Pulse rifle (+2pt/model)</span>
                <input
                  type="number" min={0} max={item.size}
                  value={item.gueVesaHotshotSwaps ?? 0}
                  onChange={e => updateUnit(item.id, { gueVesaHotshotSwaps: Math.max(0, Math.min(item.size, parseInt(e.target.value, 10) || 0)) })}
                  className="w-14 bg-zinc-800 border border-zinc-600 text-zinc-300 text-[11px] px-1.5 py-0.5 focus:outline-none focus:border-amber-700"
                />
              </div>
            )}
          </div>
        );
      })()}

      {!collapsed && (
        <div className="space-y-0 md:grid md:grid-cols-2 md:items-start">
          {/* Default loadout */}
          {equippedWith && (
            <div className="md:col-span-2 px-3 py-1.5 bg-zinc-800/50 border-b border-zinc-700/60 text-[11px] text-zinc-400">
              <span className="text-zinc-500 text-[10px] uppercase tracking-widest mr-1.5">Default loadout:</span>
              {equippedWith}
            </div>
          )}

          {/* ── Live profile (stat block + weapons) — right column on wide screens ── */}
          <div className="md:col-start-2 md:row-start-2 md:border-l md:border-zinc-700/60">
          <div className="px-2 pt-1.5 hidden md:block">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Live profile</span>
          </div>
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
            <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-700/50 border-b border-zinc-600">
                  <th className="text-left text-zinc-300 font-semibold py-2 px-2 text-[11px] uppercase tracking-wide">Model</th>
                  {statKeys.map(k => {
                    const label = k === 'InvSv' ? 'Inv' : k;
                    const icon = STAT_ICONS[k];
                    return (
                      <th key={k} className={`font-bold text-center py-1.5 px-1 text-[10px] uppercase tracking-wide min-w-[2rem] ${k === 'InvSv' ? 'text-violet-400' : 'text-amber-500'}`}>
                        {icon ? (
                          <div className="flex flex-col items-center gap-0.5">
                            <img src={icon} alt="" aria-hidden="true"
                              style={{ filter: STAT_ICON_FILTER, opacity: 0.85, width: 14, height: 14 }}
                            />
                            <span>{label}</span>
                          </div>
                        ) : label}
                      </th>
                    );
                  })}
                  <th className="text-right text-zinc-500 font-normal py-2 pr-2 text-[10px] uppercase">Pts</th>
                </tr>
              </thead>
              <tbody>
                {modelsToShow.map((m, i) => {
                  const isVar = variant && m === variant;
                  // Row count: variant-split count (modelCounts) takes priority, then per-group
                  // size for multi-model units (Traitor Guard's Guardsman/Ogryn), then the plain
                  // squad-size stepper for a single-model-row unit (e.g. Chaos Space Marines).
                  // Single fixed-size characters (m.max === 1) stay uncounted — "1x" adds no value.
                  const rowCount = modelCounts[i] ?? item.modelSizes?.[m.name] ??
                    (modelsToShow.length === 1 && m.max > 1 ? item.size : null);
                  return (
                    <tr key={i} className={`border-b border-zinc-700/40 ${i % 2 !== 0 ? 'bg-zinc-800/40' : ''} ${isVar ? 'text-amber-300' : 'text-zinc-100'}`}>
                      <td className="font-semibold py-2 px-2 whitespace-nowrap text-xs">{rowCount != null ? `${rowCount}x ` : ''}{m.name}{isVar ? ' ★' : ''}</td>
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

                        // Yngir: C'tan Shard upgrade floors the save at 2+ (ods-verbatim) — same
                        // "set if better" pattern as equipMods.armorSave above.
                        if (k === 'SV' && ctanYngirActive) {
                          const existing = display.match(/(\d+)\+/);
                          if (!existing || 2 < parseInt(existing[1])) {
                            display = '2+';
                            optionBoosted = true;
                          }
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
            </div>
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
                          <WeaponTable weapons={ranged} traitMap={g.traitMap ?? weaponTraitMap} count={g.count} countOverrides={g.countOverrides} />
                        </div>
                      )}
                      {melee.length > 0 && (
                        <div>
                          <div className="px-3 pt-2.5 pb-1 text-[10px] text-amber-600 uppercase tracking-widest font-bold flex items-center gap-2">
                            <span className="w-3 h-px bg-amber-800 inline-block" />
                            Melee Weapons
                            <span className="flex-1 h-px bg-zinc-700/60 inline-block" />
                          </div>
                          <WeaponTable weapons={melee} traitMap={g.traitMap ?? weaponTraitMap} count={g.count} countOverrides={g.countOverrides} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })()}
          </div>{/* close live profile column */}

          {/* ── Builder section (interactive) — left column on wide screens ── */}
          <div className="md:col-start-1 md:row-start-2 px-3 py-2 space-y-3">
          <div className="hidden md:block -mx-3 -mt-2 mb-1 px-2 pt-1.5">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Build</span>
          </div>

          {/* Squad size — per-group when modelSizes is available, single slider otherwise */}
          {item.modelSizes ? (
            <div className="space-y-1">
              {u.models.filter(m => m.min > 0).map(m => {
                const count = item.modelSizes![m.name] ?? m.min;
                const max = effectiveModelMax(m);
                const isFixed = m.min === max;
                return (
                  <div key={m.name} className="flex items-center gap-2 text-[12px] text-zinc-400">
                    <span className="w-40 truncate text-zinc-300">{m.name}:</span>
                    {isFixed ? (
                      <span className="text-zinc-500">{m.min} <span className="text-zinc-600 text-[11px]">(fixed)</span></span>
                    ) : (
                      <>
                        <div className="flex items-center">
                          <button onClick={() => updateModelSize(item.id, m.name, Math.max(m.min, count - 1))} disabled={count <= m.min}
                            className="w-6 h-6 flex items-center justify-center bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-amber-400 disabled:opacity-30 disabled:cursor-not-allowed text-base leading-none">−</button>
                          <span className="w-7 text-center text-zinc-100 font-mono text-[12px]">{count}</span>
                          <button onClick={() => updateModelSize(item.id, m.name, Math.min(max, count + 1))} disabled={count >= max}
                            className="w-6 h-6 flex items-center justify-center bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-amber-400 disabled:opacity-30 disabled:cursor-not-allowed text-base leading-none">+</button>
                        </div>
                        <span className="text-zinc-600 text-[10px]">{m.min}–{max}</span>
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
            const max = effectiveModelMax(m);
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
                <summary className="cursor-pointer px-2 py-1.5 select-none flex items-center gap-2 bg-zinc-800/40 border-b border-zinc-700/60">
                  <span className="font-cinzel text-[11px] text-zinc-100 uppercase tracking-wider flex-1">{headerText}</span>
                  <span className="font-cinzel text-[9px] uppercase tracking-widest px-1.5 py-0.5 border border-emerald-700/60 bg-emerald-900/20 text-emerald-400 shrink-0">Add-on</span>
                  <div className="flex items-center shrink-0" onClick={e => e.stopPropagation()}>
                    <button onClick={() => updateModelSize(item.id, m.name, Math.max(m.min, count - 1))} disabled={count <= m.min}
                      className="w-5 h-5 flex items-center justify-center bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-amber-400 disabled:opacity-30 disabled:cursor-not-allowed text-sm leading-none">−</button>
                    <span className="w-6 text-center text-zinc-100 font-mono text-[11px]">{count}</span>
                    <button onClick={() => updateModelSize(item.id, m.name, Math.min(max, count + 1))} disabled={count >= max}
                      className="w-5 h-5 flex items-center justify-center bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-amber-400 disabled:opacity-30 disabled:cursor-not-allowed text-sm leading-none">+</button>
                  </div>
                  <span className="text-zinc-500 normal-case text-[10px]">/{max}</span>
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
            <div className="flex items-center gap-3">
              <span className="font-cinzel text-[10px] uppercase tracking-widest text-zinc-500">Size</span>
              <div className="flex items-center">
                <button
                  onClick={() => updateUnit(item.id, { size: squadMin && item.size === squadMin ? minSize : Math.max(minSize, item.size - 1) })}
                  disabled={item.size <= minSize}
                  className="w-6 h-6 flex items-center justify-center bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-amber-400 disabled:opacity-30 disabled:cursor-not-allowed text-base leading-none">−</button>
                <span className="w-8 text-center text-zinc-100 font-mono text-sm">{item.size}</span>
                <button
                  onClick={() => updateUnit(item.id, { size: squadMin && item.size === minSize ? squadMin : Math.min(maxSize, item.size + 1) })}
                  disabled={item.size >= maxSize}
                  className="w-6 h-6 flex items-center justify-center bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-amber-400 disabled:opacity-30 disabled:cursor-not-allowed text-base leading-none">+</button>
              </div>
              <span className="text-zinc-600 text-[10px]">{squadMin ? `${minSize} or ${squadMin}–${maxSize}` : `${minSize}–${maxSize}`}</span>
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
                    <div className="text-[10px] text-amber-700/80 uppercase tracking-widest mb-1.5 font-cinzel">Chaos Mark</div>
                    <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${Math.min(availableMarks.length, 5)}, minmax(0, 1fr))` }}>
                      {availableMarks.map(m => {
                        const active = item.mark === m;
                        const st = MARK_STYLE[m] ?? MARK_STYLE['Undivided'];
                        return (
                          <button
                            key={m}
                            onClick={() => updateUnit(item.id, { mark: active ? null : m })}
                            className={`flex flex-col items-center gap-1 py-1.5 px-1 border transition-colors ${active ? st.active : `bg-zinc-950 ${st.idle} hover:bg-zinc-800/60`}`}
                          >
                            {MARK_ICON[m] && (
                              <img src={MARK_ICON[m]} alt="" aria-hidden="true"
                                style={{ width: 18, height: 18, filter: active ? st.filter : 'brightness(0) invert(1) opacity(0.3)' }} />
                            )}
                            <span className="font-cinzel text-[9px] uppercase tracking-wide leading-none">{m}</span>
                          </button>
                        );
                      })}
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
                  <summary className="cursor-pointer px-2 py-1.5 flex items-center gap-2 select-none bg-zinc-800/60 border-b border-zinc-700/60">
                    <input
                      type="checkbox"
                      checked={active}
                      onClick={e => e.stopPropagation()}
                      onChange={() => setQty(realGi, '__inline', active ? 0 : 1)}
                    />
                    <span className="font-cinzel text-[11px] text-zinc-100 uppercase tracking-wider flex-1">{g.variant_link ?? g.header}</span>
                    {(u.champion_has_armory || /armory|champion|sergeant|leader/i.test(g.header)) && (
                      <span className="font-cinzel text-[9px] uppercase tracking-widest px-1.5 py-0.5 border border-amber-700/60 bg-amber-900/20 text-amber-400 shrink-0">Champion</span>
                    )}
                    {g.inline_pts != null && !headerHasPts(g.inline_pts) && (
                      <span className="text-amber-600 text-[11px]">
                        {g.inline_pts >= 0 ? '+' : ''}{g.inline_pts} pts
                      </span>
                    )}
                  </summary>
                  {variantModel && (
                    <div className="px-2 pb-2 space-y-2">
                      <ModelProfileRow m={variantModel} statKeys={STAT_KEYS_INF} />
                      {(u.champion_has_armory || u.has_armory_access || /armory/i.test(g.header)) && (
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
                <div key={realGi} className={`border-l-2 ${active ? 'border-amber-700/70' : 'border-zinc-700/50'} ${blocked ? 'opacity-50' : ''} transition-colors`}>
                  <label
                    onClick={() => { if (!blocked) setQty(realGi, '__inline', active ? 0 : 1); }}
                    className={`flex items-center gap-2 px-2.5 py-1.5 text-[12px] ${blocked ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-zinc-800/40'} transition-colors`}
                  >
                    <div className={`w-3.5 h-3.5 border flex-shrink-0 flex items-center justify-center transition-colors ${active ? 'bg-amber-700 border-amber-600' : 'bg-zinc-900 border-zinc-600'}`}>
                      {active && <span className="text-[8px] text-white leading-none">✓</span>}
                    </div>
                    <span className="text-zinc-300 flex-1">{g.header}</span>
                    {!headerHasPts(g.inline_pts) && (
                      <span className={`text-[11px] font-mono shrink-0 ${active ? 'text-amber-400' : 'text-zinc-500'}`}>
                        {g.inline_pts >= 0 ? '+' : ''}{g.inline_pts}
                      </span>
                    )}
                  </label>
                  {blocked && g.available_if && (
                    <div className="text-[10px] text-red-400/80 pb-1 pl-8">Not available with Mark of {g.available_if.keyword}.</div>
                  )}
                </div>
              );
            }

            const isPerN = g.constraint.type === 'per_n';
            const isEvery = g.constraint.type === 'every';
            const isFixedMax = g.constraint.type === 'fixed_max';
            const applyModelNames = Array.isArray(g.applies_to_model)
              ? g.applies_to_model
              : g.applies_to_model ? [g.applies_to_model] : null;
            const sumModelGroups = (names: string[] | null) => (names && item.modelSizes)
              ? names.reduce((s, n) => s + (item.modelSizes![n] ?? 0), 0)
              : null;
            // per_n max = slots from the per_n pool (total size, or a named subset of model
            // groups when the datasheet's "for every N X models" explicitly excludes others —
            // e.g. Kroot Farstalkers' "every 5 NON-Kroot-hound models"), capped by
            // applies_to_model count when set. e.g. "2 Dishonored may swap per 8 models" →
            // max = min(slots×2, dishonored_count)
            const perNPoolSize = isPerN ? (sumModelGroups(g.per_n_pool ?? null) ?? item.size) : null;
            const perNRaw = isPerN
              ? (g.constraint.count_per_n ?? 1) * Math.floor((perNPoolSize ?? 0) / (g.constraint.per_n ?? 1))
              : null;
            const modelGroupCap = sumModelGroups(applyModelNames);
            const groupMax = perNRaw !== null
              ? (modelGroupCap !== null ? Math.min(perNRaw, modelGroupCap) : perNRaw)
              : isEvery
                ? (modelGroupCap !== null ? modelGroupCap : item.size)
                : isFixedMax
                  ? (modelGroupCap !== null ? Math.min(g.constraint.max ?? item.size, modelGroupCap) : (g.constraint.max ?? item.size))
                  : null;
            // "every"/"fixed_max" groups (not just per_n) share a combined budget across all their
            // choices — e.g. Kroot Farstalkers' Kroot pistol/Kroot scattergun swap, or Raptors'
            // "two Raptors may swap their chainsword+pistol for Flamer/Meltagun/Plasma gun" can't
            // independently hit the cap on each choice, they must add up to no more than the max.
            const groupUsed = (isPerN || isEvery || isFixedMax)
              ? Object.entries(item.optionQty?.[realGi] ?? {}).reduce(
                  (s, [k, v]) => k === '__inline' ? s : s + (v ?? 0), 0
                )
              : null;
            // Independent sibling groups that replace the SAME base weapon, on the SAME scoped
            // model group, also draw from one shared pool — e.g. Traitor Guard's "every model's
            // Lasgun may be replaced" and "for each 10 models, one Lasgun may be replaced by a
            // special weapon" both consume Lasgun-carrying Traitor Guardsmen; together they must
            // not exceed that model count, even though each group's OWN max allows it alone.
            const sameApplyScope = (otherNames: string[] | null) =>
              (applyModelNames === null && otherNames === null) ||
              (applyModelNames !== null && otherNames !== null &&
                applyModelNames.length === otherNames.length &&
                applyModelNames.every(n => otherNames.includes(n)));
            const siblingGroups = (g.replaces?.length && (isPerN || isEvery))
              ? u.option_groups.filter((other, oi) => oi !== realGi && other.replaces?.some(w => g.replaces!.includes(w)) &&
                  sameApplyScope(Array.isArray(other.applies_to_model) ? other.applies_to_model : other.applies_to_model ? [other.applies_to_model] : null))
              : [];
            const siblingUsed = siblingGroups.reduce((s, other) => {
              const oi = u.option_groups.indexOf(other);
              return s + Object.entries(item.optionQty?.[oi] ?? {}).reduce(
                (s2, [k, v]) => k === '__inline' ? s2 : s2 + (v ?? 0), 0
              );
            }, 0);
            const sharedPoolSize = modelGroupCap !== null ? modelGroupCap : item.size;
            const groupRemainingOwn = groupMax !== null && groupUsed !== null ? groupMax - groupUsed : null;
            const groupRemainingShared = siblingGroups.length > 0 && groupUsed !== null
              ? sharedPoolSize - groupUsed - siblingUsed
              : null;
            const groupRemaining = groupRemainingOwn !== null && groupRemainingShared !== null
              ? Math.min(groupRemainingOwn, groupRemainingShared)
              : groupRemainingOwn;

            // Choices that map to actual weapon profiles get rendered as a weapon-stat
            // table (Range/Type/S/AP/D/Abilities/Pts) instead of a plain chip — lets the
            // player compare the swap options without opening the Armory.
            // Match choice names against the unit's ORIGINAL catalog weapons (u.weapons), never
            // the archetype-renamed rp.weapons — renamed names ("Combi-plague belcher") no longer
            // equal the choice's generic name ("Combi-flamer"), which would silently zero out the
            // match. Apply the same display-only rename/ability injection AFTER resolving, so the
            // picker shows the renamed weapon with its bonus ability without breaking the match.
            const choiceWeaponsList = g.choices.map(c => {
              const resolved = resolveChoiceWeapons(u.weapons, c.name);
              const weapons = rp.weaponDisplayOverride ? rp.weaponDisplayOverride(resolved.weapons) : resolved.weapons;
              return { weapons, compound: resolved.compound };
            });
            const groupHasWeapons = choiceWeaponsList.some(ws => ws.weapons.length > 0);
            // "Every model's X may be replaced by Y" — a single choice applying to the whole
            // unit gets ONE quantity control in the group header, not per-row.
            const singleChoiceEvery = g.constraint.type === 'every' && g.choices.length === 1 && groupHasWeapons;

            function qtyControl(ci: number, c: Choice) {
              const qty = item.optionQty?.[realGi]?.[ci] ?? 0;
              const canUseQty = ['per_n', 'fixed_max', 'every'].includes(g.constraint.type);
              const inputMax = groupRemaining !== null ? qty + groupRemaining : undefined;
              // Detect "(X only)" mark restrictions embedded in choice names
              const choiceMarkReq = c.name.match(/\((\w+)\s+only\)/i)?.[1] ?? null;
              const choiceMarkBlocked = choiceMarkReq != null
                && choiceMarkReq.toLowerCase() !== (effectiveMark ?? '').toLowerCase();
              const control = canUseQty ? (
                <div className="flex items-center shrink-0" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => { if (!choiceMarkBlocked) setQty(realGi, ci, Math.max(0, qty - 1)); }}
                    disabled={choiceMarkBlocked || qty <= 0}
                    className="w-5 h-5 flex items-center justify-center bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-amber-400 disabled:opacity-30 disabled:cursor-not-allowed text-sm leading-none"
                  >−</button>
                  <span className="w-6 text-center text-zinc-100 font-mono text-[11px]">{qty}</span>
                  <button
                    onClick={() => { if (!choiceMarkBlocked) setQty(realGi, ci, inputMax !== undefined ? Math.min(inputMax, qty + 1) : qty + 1); }}
                    disabled={choiceMarkBlocked || (inputMax !== undefined && qty >= inputMax)}
                    className="w-5 h-5 flex items-center justify-center bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-amber-400 disabled:opacity-30 disabled:cursor-not-allowed text-sm leading-none"
                  >+</button>
                </div>
              ) : (
                <div
                  onClick={e => { e.stopPropagation(); if (!choiceMarkBlocked) setQty(realGi, ci, qty > 0 ? 0 : 1); }}
                  className={`w-4 h-4 border flex-shrink-0 flex items-center justify-center cursor-pointer transition-colors
                    ${qty > 0 ? 'bg-amber-700 border-amber-600' : 'bg-zinc-900 border-zinc-600 hover:border-zinc-400'}
                    ${choiceMarkBlocked ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}`}
                >
                  {qty > 0 && <span className="text-[8px] text-white leading-none">✓</span>}
                </div>
              );
              return { control, choiceMarkBlocked, choiceMarkReq };
            }

            const headerQty = singleChoiceEvery ? qtyControl(0, g.choices[0]) : null;

            return (
              <details key={realGi} open className="border border-zinc-800 bg-zinc-900/30 text-[12px]">
                <summary className="cursor-pointer px-2.5 py-1.5 flex items-center gap-2 select-none hover:bg-zinc-800/50 transition-colors border-l-2 border-amber-800/50 group">
                  <span className="font-cinzel text-[10px] uppercase tracking-wide text-zinc-300 flex-1 group-open:text-amber-300/80 transition-colors">{g.header}</span>
                  {headerQty?.control}
                  {(isPerN || isFixedMax) && groupMax !== null && (
                    <span className={`font-mono text-[10px] px-1.5 py-0.5 border shrink-0 ${groupUsed! >= groupMax ? 'border-red-800 text-red-400 bg-red-900/20' : 'border-amber-900/60 text-amber-600 bg-amber-900/10'}`}>
                      {groupUsed}/{groupMax}
                    </span>
                  )}
                  {isRequired && !hasSelection && (
                    <span className="text-[10px] font-semibold text-red-400 animate-pulse shrink-0">⚠</span>
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
                          // fire-mode profile gets its own full stat row beneath it. The base name
                          // is read off the resolved weapon itself, not the choice's generic c.name
                          // — an archetype override (e.g. Plaguehost's "Combi-flamer" → "Combi-plague
                          // belcher") renames the weapon but not the choice, so they can differ.
                          const resolvedBaseName = weapons.length > 0 ? weapons[0].name.split(' - ')[0] : c.name;
                          const profileName = (w: Weapon) =>
                            (weapons.length > 1 && w.name.startsWith(`${resolvedBaseName} - `))
                              ? w.name.slice(resolvedBaseName.length + 3)
                              : w.name;
                          const rows = weapons.map((w, wi) => (
                            <tr key={`${ci}-${wi}`} className={rowClass} title={choiceMarkBlocked ? `Requires Mark of ${choiceMarkReq}` : undefined}>
                              <td className="py-1.5 pl-2 pr-2 font-medium text-zinc-100 whitespace-nowrap">
                                {weapons.length > 1 ? <span className="text-zinc-400 pl-2">{profileName(w)}</span> : (
                                  <span className="inline-flex items-center gap-1.5">{showRowControl && control}<span>{profileName(w)}</span></span>
                                )}
                              </td>
                              <td className="py-1.5 px-1 font-mono text-center text-zinc-300">{w.range || '—'}</td>
                              <td className="py-1.5 px-1 text-zinc-400 text-[11px]">
                                {(() => {
                                  const typeKey = Object.keys(WEAPON_TYPE_ICONS).find(k => w.type?.toLowerCase().startsWith(k.toLowerCase()));
                                  const icon = typeKey ? WEAPON_TYPE_ICONS[typeKey] : undefined;
                                  return (
                                    <span className="flex items-center gap-1">
                                      {icon && <img src={icon} alt="" aria-hidden="true" style={{ filter: TYPE_ICON_FILTER, opacity: 0.6, width: 13, height: 13, flexShrink: 0 }} />}
                                      <span>{w.type}</span>
                                    </span>
                                  );
                                })()}
                              </td>
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
                                  <span className="inline-flex items-center gap-1.5">{showRowControl && control} {resolvedBaseName}</span>
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
                  <div className="divide-y divide-zinc-800/60 -mx-2 -mb-2">
                    {g.choices.map((c: Choice, ci: number) => {
                      const { control, choiceMarkBlocked, choiceMarkReq } = qtyControl(ci, c);
                      const active = (item.optionQty?.[realGi]?.[ci] ?? 0) > 0;
                      return (
                        <div
                          key={ci}
                          className={`flex items-center gap-2.5 px-2.5 py-1.5 transition-colors
                            ${choiceMarkBlocked ? 'opacity-40 cursor-not-allowed' : 'hover:bg-zinc-800/40 cursor-pointer'}
                            ${active ? 'bg-amber-900/10' : ''}`}
                          title={choiceMarkBlocked ? `Requires Mark of ${choiceMarkReq}` : undefined}
                          onClick={() => { if (!choiceMarkBlocked && !['per_n','fixed_max','every'].includes(g.constraint.type)) setQty(realGi, ci, active ? 0 : 1); }}
                        >
                          {control}
                          <span className={`flex-1 text-[12px] ${active ? 'text-zinc-100' : 'text-zinc-300'}`}>{c.name}</span>
                          {c.points !== 0 && (
                            <span className={`font-mono text-[11px] shrink-0 ${active ? 'text-amber-400' : 'text-zinc-500'}`}>
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
          <div className="flex flex-wrap gap-1.5 pt-2 border-t-2 border-zinc-800/80 mt-1">
            {showArmory && (
              <button onClick={() => setArmoryOpen(true)}
                className={`inline-flex items-center gap-1.5 font-cinzel text-[10px] uppercase tracking-widest px-2.5 py-1.5 border transition-colors
                  ${item.armory.filter(a => !['veteran','vehicle'].includes(findArmoryItemData(effectiveArmData,a)?.category??'')).length > 0
                    ? 'border-amber-700 bg-amber-900/20 text-amber-300 hover:bg-amber-900/40'
                    : 'border-zinc-700 bg-zinc-900 text-amber-500/80 hover:border-amber-700 hover:text-amber-400'}`}
              >
                <span className="text-[11px] opacity-70">⚔</span>
                Armory
                {item.armory.filter(a => !['veteran','vehicle'].includes(findArmoryItemData(effectiveArmData,a)?.category??'')).length > 0 && (
                  <span className="text-[9px] bg-amber-800/60 text-amber-200 px-1 py-px rounded-sm">
                    {item.armory.filter(a => !['veteran','vehicle'].includes(findArmoryItemData(effectiveArmData,a)?.category??'')).length}
                  </span>
                )}
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
                  className={`inline-flex items-center gap-1.5 font-cinzel text-[10px] uppercase tracking-widest px-2.5 py-1.5 border transition-colors
                    ${specialAmmoSelection ? 'border-amber-600 bg-amber-900/30 text-amber-300' : 'border-zinc-700 bg-zinc-900 text-amber-500/80 hover:border-amber-700 hover:text-amber-400'}`}
                >
                  <span className="text-[11px] opacity-70">◎</span>
                  Ammo {specialAmmoSelection ? '✓' : `+${ammoPts}`}
                </button>
              );
            })()}
            {hasFactionVeteranItems && (
              <button onClick={() => setVetOpen(true)}
                className={`inline-flex items-center gap-1.5 font-cinzel text-[10px] uppercase tracking-widest px-2.5 py-1.5 border transition-colors
                  ${vetItemsCount > 0
                    ? 'border-yellow-700 bg-yellow-900/20 text-yellow-300 hover:bg-yellow-900/30'
                    : 'border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-yellow-800 hover:text-yellow-400'}`}
              >
                <span className="text-[11px] opacity-70">★</span>
                Veteran
                <span className="flex gap-0.5 ml-0.5">
                  {Array.from({ length: vetMax }).map((_, i) => (
                    <span key={i} className={`inline-block w-1.5 h-1.5 rounded-full ${i < vetItemsCount ? 'bg-yellow-400' : 'bg-zinc-700'}`} />
                  ))}
                </span>
              </button>
            )}
            {hasFactionVehicleItems && (
              <button onClick={() => setVehOpen(true)}
                className={`inline-flex items-center gap-1.5 font-cinzel text-[10px] uppercase tracking-widest px-2.5 py-1.5 border transition-colors
                  ${vehItemsCount > 0
                    ? 'border-blue-700 bg-blue-900/20 text-blue-300 hover:bg-blue-900/30'
                    : 'border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-blue-800 hover:text-blue-400'}`}
              >
                <span className="text-[11px] opacity-70">⚙</span>
                Upgrades {vehItemsCount > 0 && <span className="text-[9px] bg-blue-800/60 text-blue-200 px-1 py-px rounded-sm">{vehItemsCount}</span>}
              </button>
            )}
            {hasTraitConflict && (
              <button onClick={() => setTraitsOpen(true)}
                className="inline-flex items-center gap-1.5 font-cinzel text-[10px] uppercase tracking-widest px-2.5 py-1.5 border border-red-800 bg-red-900/20 text-red-400 hover:bg-red-900/30 transition-colors"
              >
                <span className="text-[11px]">⚠</span>
                Traits ({item.traits.length}/{vetMax})
              </button>
            )}
            {(() => {
              const hasDiscs = Object.keys(data.disciplines ?? {}).length > 0;
              const hasPowers = effectivePsyker && hasDiscs;
              const hasPrayers = u.is_priest && (data.prayers ?? []).length > 0;
              const hasPacts = u.uses_pacts && (data.pacts ?? []).length > 0;
              if (!hasPowers && !hasPrayers && !hasPacts) return null;
              const pactCount = (item.pacts ?? []).length;
              const realPowers = item.powers.filter(p => p.powerName !== '__discipline__').length;
              const hasChosenDisc = item.powers.some(p => p.powerName === '__discipline__');
              const chosenDiscName = item.powers.find(p => p.powerName === '__discipline__')?.disciplineName;
              const knowsSmiteUnit = u.is_psyker && (u.abilities ?? []).some(a => /psyker:/i.test(a) && a.toLowerCase().includes('smite'));
              const totalCount = realPowers + item.prayers.length + pactCount;
              const hasAny = totalCount > 0;
              const label = hasPacts && !hasPowers && !hasPrayers
                ? `Pacts (${pactCount})`
                : u.is_cult_initiate
                  ? `Cult Powers (${realPowers})`
                  : hasPowers && hasPrayers
                    ? `Powers/Prayers (${totalCount})`
                    : hasPrayers
                      ? `Prayers (${item.prayers.length})`
                      : hasChosenDisc
                        ? `Powers · ${chosenDiscName}`
                        : knowsSmiteUnit
                          ? `Powers (Smite${realPowers > 0 ? ` +${realPowers}` : ''})`
                          : `Powers (${realPowers})`;
              return (
                <button onClick={() => setPsyOpen(true)}
                  className={`inline-flex items-center gap-1.5 font-cinzel text-[10px] uppercase tracking-widest px-2.5 py-1.5 border transition-colors
                    ${hasAny
                      ? 'border-cyan-700 bg-cyan-900/20 text-cyan-300 hover:bg-cyan-900/30'
                      : 'border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-cyan-800 hover:text-cyan-400'}`}
                >
                  <span className="text-[11px] opacity-70">✦</span>
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
              const livePts = liveArmoryPoints(a, item, u);
              return (
                <div key={a.id} className="bg-zinc-900 border border-zinc-700 px-2 py-1 text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className={`font-medium ${weaponTargetingTrait ? 'text-violet-300' : 'text-zinc-300'}`}>{a.itemName}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-600">{livePts >= 0 ? '+' : ''}{livePts} pts</span>
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
            // Filter base abilities: hide unselected-weapon abilities, choice-gated abilities not yet
            // purchased, and psyker ability when the optional psyker upgrade hasn't been bought.
            const _shownWeaponBaseNames = new Set(weaponsToShow.map(w => w.name.split(' - ')[0]));
            const _unselectedOptionalWeapons = new Set<string>();
            const _allChoiceAbilityTexts = new Set<string>();
            for (const g of u.option_groups) {
              for (const c of g.choices) {
                const parts = c.name.split(/\s*(?:&|\band\b)\s*/i).filter(Boolean);
                for (const part of (parts.length > 1 ? parts : [c.name])) {
                  if (u.weapons.some(w => w.name.split(' - ')[0] === part) && !_shownWeaponBaseNames.has(part)) {
                    _unselectedOptionalWeapons.add(part.toLowerCase());
                  }
                }
                for (const ab of (c.abilities ?? [])) {
                  _allChoiceAbilityTexts.add(ab.toLowerCase());
                }
              }
            }
            const _selectedChoiceAbilityTexts = new Set(injectedAbilities.map(a => a.toLowerCase()));
            const _hasPsykerOption = psykerGroupIdx >= 0 && !effectivePsyker;
            const filteredAbilities = u.abilities.filter(ab => {
              if (/^\d+$/.test(ab.trim())) return false;
              const ci = ab.indexOf(':');
              const label = ci > 0 ? ab.substring(0, ci).trim().toLowerCase() : ab.trim().toLowerCase();
              if (_unselectedOptionalWeapons.has(label)) return false;
              if (_allChoiceAbilityTexts.has(ab.toLowerCase()) && !_selectedChoiceAbilityTexts.has(ab.toLowerCase())) return false;
              if (_hasPsykerOption && label === 'psyker') return false;
              return true;
            });
            const totalAbilityCount = filteredAbilities.length + traitAbilities.length + injectedAbilities.length + injectedRuleNotes.length + optionAbilities.length + equipAbilities.length;
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
                {filteredAbilities.flatMap((a, i) =>
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
            <div className="md:col-span-2 px-3 py-2.5 border-t border-zinc-700 bg-zinc-800/50">
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
    <div className="overflow-x-auto">
    <table className="w-full text-xs border-collapse">
      <thead>
        <tr className="bg-zinc-700/50 border-b border-zinc-600">
          <th className="text-left text-zinc-300 font-semibold py-2 px-2 text-[11px] uppercase tracking-wide">Model</th>
          {statKeys.map(k => {
            const icon = STAT_ICONS[k];
            return (
              <th key={k} className="font-bold text-center py-1.5 px-1 text-[10px] uppercase tracking-wide min-w-[2rem] text-amber-500">
                {icon ? (
                  <div className="flex flex-col items-center gap-0.5">
                    <img src={icon} alt="" aria-hidden="true"
                      style={{ filter: STAT_ICON_FILTER, opacity: 0.85, width: 14, height: 14 }}
                    />
                    <span>{k}</span>
                  </div>
                ) : k}
              </th>
            );
          })}
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
    </div>
  );
}

function WeaponTable({ weapons, traitMap, count, countOverrides }: { weapons: Weapon[]; traitMap?: Map<string, string[]>; count?: number | null; countOverrides?: Map<string, number> }) {
  return (
    <div className="px-3 pb-2 overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="border-b border-zinc-600">
            <th className="text-left text-zinc-400 font-semibold py-1.5 pr-2 text-[10px] uppercase tracking-wide w-[32%]">Weapon</th>
            <th className="text-center text-zinc-400 font-semibold py-1.5 px-1 text-[10px] uppercase tracking-wide w-[10%]">
              <div className="flex flex-col items-center gap-0.5">
                <img src={STAT_ICONS['Range']} alt="" aria-hidden="true" style={{ filter: TYPE_ICON_FILTER, opacity: 0.5, width: 12, height: 12 }} />
                <span>Range</span>
              </div>
            </th>
            <th className="text-left text-zinc-400 font-semibold py-1.5 px-1 text-[10px] uppercase tracking-wide w-[14%]">
              <div className="flex flex-col items-start gap-0.5">
                <img src="/weapon-type-icons/type.svg" alt="" aria-hidden="true" style={{ filter: TYPE_ICON_FILTER, opacity: 0.5, width: 12, height: 12 }} />
                <span>Type</span>
              </div>
            </th>
            <th className="text-center text-zinc-400 font-semibold py-1.5 px-1 text-[10px] uppercase tracking-wide w-[6%]">
              <div className="flex flex-col items-center gap-0.5">
                <img src={STAT_ICONS['S']} alt="" aria-hidden="true" style={{ filter: TYPE_ICON_FILTER, opacity: 0.5, width: 12, height: 12 }} />
                <span>S</span>
              </div>
            </th>
            <th className="text-center text-zinc-400 font-semibold py-1.5 px-1 text-[10px] uppercase tracking-wide w-[6%]">
              <div className="flex flex-col items-center gap-0.5">
                <img src={STAT_ICONS['AP']} alt="" aria-hidden="true" style={{ filter: TYPE_ICON_FILTER, opacity: 0.5, width: 12, height: 12 }} />
                <span>AP</span>
              </div>
            </th>
            <th className="text-center text-zinc-400 font-semibold py-1.5 px-1 text-[10px] uppercase tracking-wide w-[6%]">
              <div className="flex flex-col items-center gap-0.5">
                <img src={STAT_ICONS['D']} alt="" aria-hidden="true" style={{ filter: TYPE_ICON_FILTER, opacity: 0.5, width: 12, height: 12 }} />
                <span>D</span>
              </div>
            </th>
            <th className="text-left text-zinc-400 font-semibold py-1.5 pl-2 text-[10px] uppercase tracking-wide">Abilities</th>
          </tr>
        </thead>
        <tbody>
          {weapons.map((w: Weapon, i: number) => {
            const rowCount = countOverrides?.get(w.name) ?? count;
            if (rowCount === 0) return null;
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
                <td className="py-1.5 pr-2 font-medium text-zinc-100">{rowCount != null ? `${rowCount}x ` : ''}{w.name}</td>
                <td className="py-1.5 px-1 font-mono text-center text-zinc-300">{w.range || '—'}</td>
                <td className="py-1.5 px-1 text-zinc-400 text-[11px]">
                  {(() => {
                    const typeKey = Object.keys(WEAPON_TYPE_ICONS).find(k => w.type?.toLowerCase().startsWith(k.toLowerCase()));
                    const icon = typeKey ? WEAPON_TYPE_ICONS[typeKey] : undefined;
                    return (
                      <span className="flex items-center gap-1">
                        {icon && <img src={icon} alt="" aria-hidden="true" style={{ filter: TYPE_ICON_FILTER, opacity: 0.6, width: 13, height: 13, flexShrink: 0 }} />}
                        <span>{w.type}</span>
                      </span>
                    );
                  })()}
                </td>
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
