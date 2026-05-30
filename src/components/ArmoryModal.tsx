import { useState } from 'react';
import type { RosterEntry } from '../types/army';
import type { Unit, ArmoryItem } from '../types/data';
import { useArmyStore } from '../store/army';
import { getArchetypeRule } from '../engine/archetypes';
import { isWeaponTrait, isUniqueItem, isMultipleAllowed } from '../engine/equipMods';

interface Props {
  item: RosterEntry;
  unit: Unit;
  onClose: () => void;
  filterCategory?: 'veteran' | 'vehicle';
  /** Overrides unit.has_veteran_abilities — used when an archetype grants vet access to a normally ineligible unit. */
  effectiveHasVetAbilities?: boolean;
}

let _selId = 1;
function selId() { return 'arm-' + (_selId++); }

type ArmoryTab = 'general' | 'mark' | 'legion';
type Section = 'weapons' | 'equipment' | 'daemon_weapons';

function parsePrice(v: number | null | undefined | string): number | null {
  if (v === null || v === undefined || v === '') return null;
  const n = typeof v === 'number' ? v : parseInt(String(v), 10);
  return isNaN(n) ? null : n;
}

// ── Mark restriction helpers ──────────────────────────────────────────────────
const MARK_SUPERSCRIPTS: Record<string, string> = {
  'ˢ': 'Slaanesh', 'ᴷ': 'Khorne', 'ᵀ': 'Tzeentch', 'ᴺ': 'Nurgle',
};
const MARK_BADGE: Record<string, string> = {
  Slaanesh: 'bg-pink-900/60 text-pink-300 border-pink-700',
  Khorne:   'bg-red-900/60 text-red-300 border-red-700',
  Tzeentch: 'bg-sky-900/60 text-sky-300 border-sky-700',
  Nurgle:   'bg-green-900/60 text-green-300 border-green-700',
};
/** Return which mark the item requires, or null if unrestricted. */
function getRequiredMark(name: string): string | null {
  return MARK_SUPERSCRIPTS[name.slice(-1)] ?? null;
}
/** Strip trailing god superscripts from item names for display. */
function cleanItemName(name: string): string {
  return name.replace(/[ˢᴷᵀᴺ]$/, '');
}

export function ArmoryModal({ item, unit, onClose, filterCategory, effectiveHasVetAbilities }: Props) {
  const { data, alliedData, legacy, legacy2, archetype, traitPool, addArmoryItem, removeArmoryItem, setLegacyArmoryLock, army } = useArmyStore();
  const [tab, setTab] = useState<ArmoryTab>('general');
  const [section, setSection] = useState<Section>('weapons');
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  // Weapon picker for daemon-weapon traits: itemName → chosen weapon name
  const [dwTargetWeapon, setDwTargetWeapon] = useState<Record<string, string>>({});
  if (!data) return null;

  // Bug 3: for allied units use the allied faction's armory data
  const isAllied = !!item.factionSource;
  const activeData = (isAllied && alliedData) ? alliedData : data;

  // Always read armory from the live store so Unique checks stay current after additions
  const currentArmory = (army.find(e => e.id === item.id) ?? item).armory;

  // Level 1 — once per model: can't add the same item twice unless desc says "Can be taken multiple times"
  function oncePerModelBlocked(arm: ArmoryItem, sec: Section): boolean {
    if (isMultipleAllowed(arm.desc)) return false;
    return currentArmory.some(a => a.itemName === arm.name && a.section === sec);
  }
  // Level 2 — Unique: once per army; blocked if any OTHER unit in the army already has it
  function uniqueArmyBlocked(arm: ArmoryItem, sec: Section): boolean {
    if (!isUniqueItem(arm.desc)) return false;
    return army.filter(e => e.id !== item.id).some(e => e.armory.some(a => a.itemName === arm.name && a.section === sec));
  }
  // Level 3 — terminator armor conflict: can't stack two Terminator-type armors
  function isTerminatorArmor(arm: ArmoryItem): boolean {
    return /terminator/i.test(arm.name) || /cataphractii/i.test(arm.name) || /tartaros/i.test(arm.name);
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
  // Combined: is adding this item blocked for any reason?
  function isAddBlocked(arm: ArmoryItem, sec: Section): boolean {
    if (oncePerModelBlocked(arm, sec)) return true;
    if (uniqueArmyBlocked(arm, sec)) return true;
    if (sec === 'equipment' && armorConflict(arm)) return true;
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

  // CD-specific: Greater Daemons pay from the p_char column ("POINTS GREATER DEMON");
  // all other units (Heralds, Daemon Prince, Soul Grinder) pay from p_unit ("POINTS").
  const isCD = activeData.faction === 'Chaos Daemons';
  const isGreaterDaemon = (unit.abilities ?? []).some(a => /\bgreater daemon\b/i.test(a));

  /** Returns the correct pts for this unit, or null if the item cannot be purchased ("-"). */
  function getItemPts(arm: ArmoryItem): number | null {
    const cp = parsePrice(arm.p_char);
    const up = parsePrice(arm.p_unit);
    if (isCD) return isGreaterDaemon ? cp : up;
    // Other factions: characters use p_char (flat cost), squads use p_unit (per-model)
    return isChar ? (cp ?? up) : up;
  }

  /** True when the item requires a mark the unit doesn't have. */
  function isMarkBlocked(arm: ArmoryItem): boolean {
    const req = getRequiredMark(arm.name);
    if (!req) return false;
    // No mark at all, or wrong mark
    return req !== effectiveMark;
  }

  // Faction capability flags — use activeData (allied faction's armory for allied units)
  const hasMark = Object.keys(activeData.armory_marks).length > 0;
  const hasLegionData = Object.keys(activeData.armory_legions).length > 0;
  // Label for the legacy/legion/clan tab — use the first armory_legions key as the name
  // legionTabLabel kept as fallback reference (unused now that tab only shows when legacy is active)
  // const legionTabLabel = Object.keys(data.armory_legions)[0] ?? 'Legacy';
  // Only show Daemon Weapons section if any armory source has items for it
  const hasDaemonWeapons = [
    activeData.armory_general,
    ...Object.values(activeData.armory_marks),
    ...Object.values(activeData.armory_legions),
  ].some(src => (src.daemon_weapons as ArmoryItem[]).length > 0);

  // Veteran slot tracking for armory items — independent of whether the faction has traits
  const armoryVetEnabled = effectiveHasVetAbilities ?? unit.has_veteran_abilities;
  // Marks count as 1 veteran ability for ALL units — locked-mark units use veteran_max:1 in data instead
  const hasMarkGroup = unit.option_groups.some(g => g.constraint.type === 'mark');
  const markUsesVetSlot = !!(hasMarkGroup && !unit.locked_mark && effectiveMark);
  const armoryVetMax = armoryVetEnabled ? Math.max(0, (unit.veteran_max ?? 2) - (markUsesVetSlot ? 1 : 0)) : null;

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

  // Cataphractii armor restriction
  const isCataphractii = (unit.abilities ?? []).some(a => a.toLowerCase().startsWith('cataphractii armor'));
  function filterTermCompat(armItems: ArmoryItem[]): ArmoryItem[] {
    return isCataphractii ? armItems.filter(a => a.term_compat) : armItems;
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
  const activeLegionKeys = isAllied ? [] : [legacy, legacy2]
    .filter(Boolean)
    .map(name => data.legacies.find(l => l.name === name)?.armory_key)
    .filter((k): k is string => !!k && k in data.armory_legions);
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

  function add(arm: ArmoryItem, src: string, sec: Section, targetWeapon?: string) {
    let pts: number;
    if (arm.category === 'veteran') {
      // Cost is per-model for infantry/characters; per-wound for vehicles & monsters
      if (isVehicle || unit.is_monster) {
        pts = (parsePrice(arm.p_veh) ?? 0) * woundCount * item.size;
      } else if (isChar) {
        pts = parsePrice(arm.p_char) ?? parsePrice(arm.p_unit) ?? 0;
      } else {
        pts = (parsePrice(arm.p_unit) ?? 0) * item.size;
      }
    } else if (arm.category === 'vehicle') {
      // Flat cost per vehicle
      pts = (parsePrice(arm.p_unit) ?? 0) * item.size;
    } else {
      pts = getItemPts(arm) ?? 0;
    }
    addArmoryItem(item.id, {
      id: selId(),
      itemName: arm.name,
      source: src,
      section: sec,
      points: pts,
      isCharacter: isChar,
      targetWeapon: targetWeapon,
    });
    setLastAdded(arm.name);
    setTimeout(() => setLastAdded(null), 1500);
  }

  const armory = getArmory();

  function getItems(sec: Section): ArmoryItem[] {
    if (!armory) return [];
    return filterByUnitType(filterTermCompat(armory[sec] as ArmoryItem[]));
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
        </div>}

        {/* Cataphractii restriction */}
        {isCataphractii && (
          <div className="px-4 py-1.5 bg-amber-900/30 border-b border-amber-800 text-[10px] text-amber-400">
            Cataphractii Armour — showing only Terminator-compatible items (ᵀ).
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
            {/* Daemon Weapons only shown for factions that have them */}
            {hasDaemonWeapons && (
              <button
                onClick={() => setSection('daemon_weapons')}
                className={`px-3 py-1 text-[11px] uppercase border transition-colors
                  ${section === 'daemon_weapons'
                    ? 'bg-amber-800 border-amber-600 text-white'
                    : 'bg-zinc-900 border-zinc-600 text-zinc-400 hover:text-amber-400'
                  }`}
              >
                Daemon Weapons
              </button>
            )}
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
                const markItems = filterByUnitType(filterTermCompat(markArm[effectiveSection] as ArmoryItem[]));
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
                        onAdd={arm => !isAddBlocked(arm, 'equipment') && add(arm, `${markName} Armoury`, effectiveSection)}
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
                const legItems = filterByUnitType(filterTermCompat(leg[effectiveSection] as ArmoryItem[]));
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
                        isUniqueSelected={arm => isAddBlocked(arm, 'equipment')}
                        getSelId={name => getSelId(name, 'equipment')}
                        onRemove={removeItem}
                        onAdd={arm => !isAddBlocked(arm, 'equipment') && add(arm, legName, effectiveSection)}
                      />
                    ) : effectiveSection === 'daemon_weapons' ? (
                      legItems.length === 0
                        ? <div className="text-zinc-500 italic text-sm text-center py-4">No daemon weapon traits in this section</div>
                        : <div className="space-y-1">
                          {legItems.map((arm, i) => {
                            const alreadyOnThisUnit = currentArmory.some(a => a.itemName === arm.name && a.section === 'daemon_weapons');
                            const takenElsewhere = uniqueArmyBlocked(arm, 'daemon_weapons');
                            const blocked = alreadyOnThisUnit || takenElsewhere;
                            const unique = isUniqueItem(arm.desc);
                            const needsWeapon = isWeaponTrait(arm.desc);
                            const chosenWeapon = dwTargetWeapon[arm.name] ?? '';
                            const canAdd = !blocked && (!needsWeapon || chosenWeapon !== '');
                            return (
                              <div key={i} className={`border text-left transition-all ${
                                takenElsewhere ? 'bg-zinc-800/40 border-zinc-700 opacity-50' : 'bg-zinc-800 border-zinc-700'
                              }`}>
                                <div className="flex justify-between items-start px-3 py-2 gap-2">
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1 flex-wrap">
                                      <span className={`text-sm font-medium ${lastAdded === arm.name ? 'text-green-400' : 'text-zinc-200'}`}>
                                        {arm.name}
                                      </span>
                                      {lastAdded === arm.name && <span className="text-green-500 text-xs font-bold">✓ Added</span>}
                                      {unique && <span className="text-[9px] bg-amber-900/60 text-amber-300 border border-amber-700 px-1 py-0.5 uppercase tracking-wide">Unique</span>}
                                      {alreadyOnThisUnit && <span className="text-[9px] bg-zinc-700 text-zinc-400 px-1 py-0.5 uppercase">Selected</span>}
                                      {takenElsewhere && !alreadyOnThisUnit && <span className="text-[9px] bg-red-900/50 text-red-400 border border-red-800 px-1 py-0.5 uppercase">Taken by another unit</span>}
                                    </div>
                                    {arm.desc && <div className="text-[11px] text-zinc-500 mt-0.5">{arm.desc}</div>}
                                  </div>
                                  <div className="flex flex-col items-end gap-1 shrink-0">
                                    {arm.p_char != null && (
                                      <span className="text-amber-500 font-bold text-sm whitespace-nowrap">
                                        {arm.p_char >= 0 ? '+' : ''}{arm.p_char} pts
                                      </span>
                                    )}
                                    {alreadyOnThisUnit ? (
                                      <button
                                        onClick={() => { const sel = currentArmory.find(a => a.itemName === arm.name && a.section === 'daemon_weapons'); if (sel) removeItem(sel.id); }}
                                        className="text-[11px] px-2 py-0.5 border uppercase tracking-wide bg-red-900/60 border-red-700 text-red-300 hover:bg-red-800"
                                      >
                                        Remove
                                      </button>
                                    ) : !takenElsewhere && (
                                      <button
                                        onClick={() => add(arm, legName, 'daemon_weapons', needsWeapon ? chosenWeapon || undefined : undefined)}
                                        disabled={!canAdd}
                                        className={`text-[11px] px-2 py-0.5 border uppercase tracking-wide transition-colors ${
                                          canAdd
                                            ? 'bg-amber-900/60 border-amber-700 text-amber-300 hover:bg-amber-800'
                                            : 'bg-zinc-700 border-zinc-600 text-zinc-500 cursor-not-allowed'
                                        }`}
                                      >
                                        {needsWeapon && !chosenWeapon ? 'Pick weapon ↓' : 'Add'}
                                      </button>
                                    )}
                                  </div>
                                </div>
                                {needsWeapon && !blocked && (
                                  <div className="px-3 pb-2 flex items-center gap-2">
                                    <span className="text-[10px] text-zinc-400 uppercase tracking-wide">Apply to:</span>
                                    <select
                                      value={chosenWeapon}
                                      onChange={e => setDwTargetWeapon(prev => ({ ...prev, [arm.name]: e.target.value }))}
                                      className="flex-1 bg-zinc-900 border border-zinc-600 text-zinc-200 text-[11px] px-2 py-0.5 focus:outline-none focus:border-amber-600"
                                    >
                                      <option value="">— select a weapon —</option>
                                      {availableWeapons.map(wn => (
                                        <option key={wn} value={wn}>{wn}</option>
                                      ))}
                                    </select>
                                  </div>
                                )}
                                {alreadyOnThisUnit && (() => {
                                  const sel = currentArmory.find(a => a.itemName === arm.name && a.section === 'daemon_weapons');
                                  return sel?.targetWeapon
                                    ? <div className="px-3 pb-2 text-[10px] text-zinc-500 italic">Applied to: {sel.targetWeapon}</div>
                                    : null;
                                })()}
                              </div>
                            );
                          })}
                        </div>
                    ) : (
                      legItems.length === 0
                        ? <div className="text-zinc-500 italic text-sm text-center py-4">No items in this section</div>
                        : legItems.map((arm, i) => (
                          <ArmoryItemRow
                            key={i} arm={arm} isChar={isChar}
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
          ) : effectiveSection === 'equipment' ? (
            <EquipmentGroups
              regular={regularEquip} veteran={veteranEquip} vehicle={vehicleEquip}
              isChar={isChar} isVehicle={isVehicle} isMonster={unit.is_monster}
              unitSize={item.size} unitWounds={woundCount}
              profileAbilityNames={profileAbilityNames}
              armoryVetMax={armoryVetMax} veteranItemsUsed={veteranItemsUsed} veteranSlotsFull={veteranSlotsFull}
              filterCategory={filterCategory}
              lastAdded={lastAdded}
              getPts={getItemPts}
              isUniqueSelected={arm => isAddBlocked(arm, 'equipment')}
              getSelId={name => getSelId(name, 'equipment')}
              onRemove={removeItem}
              onAdd={arm => !isAddBlocked(arm, 'equipment') && add(arm, tab === 'mark' ? `${effectiveMark} Armoury` : 'General', effectiveSection)}
            />
          ) : effectiveSection === 'daemon_weapons' ? (
            (() => {
              const srcLabel = tab === 'mark' ? `${effectiveMark} Armoury` : 'General';
              const dwItems = getItems('daemon_weapons');
              if (dwItems.length === 0)
                return <div className="text-zinc-500 italic text-sm text-center py-8">No daemon weapon traits in this section</div>;
              return (
                <div className="space-y-1">
                  {dwItems.map((arm, i) => {
                    const alreadyOnThisUnit = currentArmory.some(a => a.itemName === arm.name && a.section === 'daemon_weapons');
                    const takenElsewhere = uniqueArmyBlocked(arm, 'daemon_weapons');
                    const blocked = alreadyOnThisUnit || takenElsewhere;
                    const unique = isUniqueItem(arm.desc);
                    const needsWeapon = isWeaponTrait(arm.desc);
                    const chosenWeapon = dwTargetWeapon[arm.name] ?? '';
                    const canAdd = !blocked && (!needsWeapon || chosenWeapon !== '');
                    return (
                      <div key={i} className={`border text-left transition-all ${
                        takenElsewhere ? 'bg-zinc-800/40 border-zinc-700 opacity-50' : 'bg-zinc-800 border-zinc-700'
                      }`}>
                        <div className="flex justify-between items-start px-3 py-2 gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1 flex-wrap">
                              <span className={`text-sm font-medium ${lastAdded === arm.name ? 'text-green-400' : 'text-zinc-200'}`}>
                                {arm.name}
                              </span>
                              {lastAdded === arm.name && <span className="text-green-500 text-xs font-bold">✓ Added</span>}
                              {unique && <span className="text-[9px] bg-amber-900/60 text-amber-300 border border-amber-700 px-1 py-0.5 uppercase tracking-wide">Unique</span>}
                              {alreadyOnThisUnit && <span className="text-[9px] bg-zinc-700 text-zinc-400 px-1 py-0.5 uppercase">Selected</span>}
                              {takenElsewhere && !alreadyOnThisUnit && <span className="text-[9px] bg-red-900/50 text-red-400 border border-red-800 px-1 py-0.5 uppercase">Taken by another unit</span>}
                            </div>
                            {arm.desc && <div className="text-[11px] text-zinc-500 mt-0.5">{arm.desc}</div>}
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            {arm.p_char != null && (
                              <span className="text-amber-500 font-bold text-sm whitespace-nowrap">
                                {arm.p_char >= 0 ? '+' : ''}{arm.p_char} pts
                              </span>
                            )}
                            {alreadyOnThisUnit ? (
                              <button
                                onClick={() => { const sel = currentArmory.find(a => a.itemName === arm.name && a.section === 'daemon_weapons'); if (sel) removeItem(sel.id); }}
                                className="text-[11px] px-2 py-0.5 border uppercase tracking-wide bg-red-900/60 border-red-700 text-red-300 hover:bg-red-800"
                              >
                                Remove
                              </button>
                            ) : !takenElsewhere && (
                              <button
                                onClick={() => add(arm, srcLabel, 'daemon_weapons', needsWeapon ? chosenWeapon || undefined : undefined)}
                                disabled={!canAdd}
                                className={`text-[11px] px-2 py-0.5 border uppercase tracking-wide transition-colors ${
                                  canAdd
                                    ? 'bg-amber-900/60 border-amber-700 text-amber-300 hover:bg-amber-800'
                                    : 'bg-zinc-700 border-zinc-600 text-zinc-500 cursor-not-allowed'
                                }`}
                              >
                                {needsWeapon && !chosenWeapon ? 'Pick weapon ↓' : 'Add'}
                              </button>
                            )}
                          </div>
                        </div>
                        {needsWeapon && !blocked && (
                          <div className="px-3 pb-2 flex items-center gap-2">
                            <span className="text-[10px] text-zinc-400 uppercase tracking-wide">Apply to:</span>
                            <select
                              value={chosenWeapon}
                              onChange={e => setDwTargetWeapon(prev => ({ ...prev, [arm.name]: e.target.value }))}
                              className="flex-1 bg-zinc-900 border border-zinc-600 text-zinc-200 text-[11px] px-2 py-0.5 focus:outline-none focus:border-amber-600"
                            >
                              <option value="">— select a weapon —</option>
                              {availableWeapons.map(wn => (
                                <option key={wn} value={wn}>{wn}</option>
                              ))}
                            </select>
                          </div>
                        )}
                        {alreadyOnThisUnit && (() => {
                          const sel = currentArmory.find(a => a.itemName === arm.name && a.section === 'daemon_weapons');
                          return sel?.targetWeapon
                            ? <div className="px-3 pb-2 text-[10px] text-zinc-500 italic">Applied to: {sel.targetWeapon}</div>
                            : null;
                        })()}
                      </div>
                    );
                  })}
                </div>
              );
            })()
          ) : (
            (() => {
              const items = getItems(effectiveSection);
              return items.length === 0
                ? <div className="text-zinc-500 italic text-sm text-center py-8">No items in this section</div>
                : items.map((arm, i) => (
                  <ArmoryItemRow
                    key={i} arm={arm} isChar={isChar}
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
  /** Computes the correct price for this unit type (handles CD Greater Daemon vs regular). */
  getPts?: (arm: ArmoryItem) => number | null;
  isUniqueSelected?: (arm: ArmoryItem) => boolean;
  getSelId?: (name: string) => string | undefined;
  onRemove?: (id: string) => void;
  onAdd: (arm: ArmoryItem) => void;
}

function EquipmentGroups({
  regular, veteran, vehicle,
  isChar, isVehicle, isMonster,
  unitSize, unitWounds,
  profileAbilityNames,
  armoryVetMax, veteranItemsUsed, veteranSlotsFull,
  filterCategory,
  lastAdded,
  getPts,
  isUniqueSelected,
  getSelId, onRemove,
  onAdd,
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
    return up != null ? `+${up * unitSize} pts (${up}/model)` : '—';
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
            return (
              <ArmoryItemRow
                key={i} arm={arm} isChar={isChar}
                justAdded={lastAdded === arm.name}
                disabled={uniqueSel}
                selectedArmoryId={getSelId ? getSelId(arm.name) : undefined}
                ptsOverride={getPts ? getPts(arm) : undefined}
                onRemove={onRemove}
                onAdd={() => !uniqueSel && onAdd(arm)}
              />
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
                  key={i} arm={arm} isChar={isChar}
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
              <ArmoryItemRow key={i} arm={arm} isChar={isChar} justAdded={lastAdded === arm.name} priceLabel={vehPriceLabel(arm)} selectedArmoryId={getSelId ? getSelId(arm.name) : undefined} onRemove={onRemove} onAdd={() => onAdd(arm)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Item rows ────────────────────────────────────────────────────────────────

function ArmoryItemRow({
  arm, isChar, disabled = false, justAdded = false, priceLabel, inProfile = false, onAdd,
  selectedArmoryId, onRemove,
  ptsOverride,
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
}) {
  const requiredMark = getRequiredMark(arm.name);
  const displayName = cleanItemName(arm.name);
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
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="font-bold text-sm whitespace-nowrap text-zinc-500">{displayPrice}</span>
          <button
            onClick={() => onRemove(selectedArmoryId)}
            className="text-[11px] px-2 py-0.5 border uppercase tracking-wide bg-red-900/60 border-red-700 text-red-300 hover:bg-red-800"
          >
            Remove
          </button>
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
