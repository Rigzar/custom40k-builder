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

export function ArmoryModal({ item, unit, onClose, filterCategory }: Props) {
  const { data, legacy, legacy2, archetype, addArmoryItem, army } = useArmyStore();
  const [tab, setTab] = useState<ArmoryTab>('general');
  const [section, setSection] = useState<Section>('weapons');
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  // Weapon picker for daemon-weapon traits: itemName → chosen weapon name
  const [dwTargetWeapon, setDwTargetWeapon] = useState<Record<string, string>>({});
  if (!data) return null;

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
  // Combined: is adding this item blocked for any reason?
  function isAddBlocked(arm: ArmoryItem, sec: Section): boolean {
    return oncePerModelBlocked(arm, sec) || uniqueArmyBlocked(arm, sec);
  }

  const rule = getArchetypeRule(archetype);
  const effectiveMark = unit.locked_mark ?? (rule?.forcedMark ?? null) ?? item.mark;
  const isChar = unit.is_character;
  const isVehicle = unit.is_vehicle;

  // Faction capability flags — only show tabs / sections that the faction actually has
  const hasMark = Object.keys(data.armory_marks).length > 0;
  const hasLegionData = Object.keys(data.armory_legions).length > 0;
  // Label for the legacy/legion/clan tab — use the first armory_legions key as the name
  // legionTabLabel kept as fallback reference (unused now that tab only shows when legacy is active)
  // const legionTabLabel = Object.keys(data.armory_legions)[0] ?? 'Legacy';
  // Only show Daemon Weapons section if any armory source has items for it
  const hasDaemonWeapons = [
    data.armory_general,
    ...Object.values(data.armory_marks),
    ...Object.values(data.armory_legions),
  ].some(src => (src.daemon_weapons as ArmoryItem[]).length > 0);

  // Veteran slot tracking for armory items — independent of whether the faction has traits
  const armoryVetEnabled = unit.has_veteran_abilities;
  // Marks use one veteran slot for units that can choose their mark (not locked marks)
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
          data.armory_general,
          ...Object.values(data.armory_marks),
          ...Object.values(data.armory_legions),
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
        if (!unit.has_veteran_abilities) return false;
        // Infiltrator / Vanguard etc. have p_veh:null — not available to vehicles/monsters
        if (isVehicle || unit.is_monster) return arm.p_veh != null;
        return true;
      }
      return true;
    });
  }

  const activeLegionKeys = [legacy, legacy2]
    .filter(Boolean)
    .map(name => data!.legacies.find(l => l.name === name)?.armory_key)
    .filter((k): k is string => !!k && k in data!.armory_legions);
  const hasLegion = activeLegionKeys.length > 0;

  function getArmory() {
    if (tab === 'mark' && effectiveMark) return data!.armory_marks[effectiveMark];
    if (tab === 'legion') return null;
    return data!.armory_general;
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
      const charPrice = parsePrice(arm.p_char);
      const unitPrice = parsePrice(arm.p_unit);
      pts = isChar ? (charPrice ?? unitPrice ?? 0) : (unitPrice ?? 0);
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
          {/* Mark tab — only shown when the unit actually has a mark */}
          {hasMark && effectiveMark && (
            <button
              onClick={() => setTab('mark')}
              className={`px-4 py-2 text-[11px] uppercase tracking-wide border-b-2 transition-colors
                ${tab === 'mark'
                  ? 'border-amber-600 text-amber-400'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
            >
              {effectiveMark} Armoury
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
          {tab === 'legion' ? (
            activeLegionKeys.length === 0 ? (
              <div className="text-zinc-500 italic text-sm text-center py-8">
                No active Legacy. Select a Legacy in army configuration.
              </div>
            ) : Object.entries(data.armory_legions)
              .filter(([legName]) => activeLegionKeys.includes(legName))
              .map(([legName, leg]) => {
                const legItems = filterByUnitType(filterTermCompat(leg[effectiveSection] as ArmoryItem[]));
                const legEq = effectiveSection === 'equipment' ? splitEquipment(legItems) : null;
                return (
                  <div key={legName}>
                    <div className="text-[11px] text-amber-700 uppercase tracking-widest mb-1 mt-2">{legName}</div>
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
                                blocked ? 'bg-zinc-800/40 border-zinc-700 opacity-50' : 'bg-zinc-800 border-zinc-700'
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
                                    {!blocked && (
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
              isUniqueSelected={arm => isAddBlocked(arm, 'equipment')}
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
                        blocked ? 'bg-zinc-800/40 border-zinc-700 opacity-50' : 'bg-zinc-800 border-zinc-700'
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
                            {!blocked && (
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
  isUniqueSelected?: (arm: ArmoryItem) => boolean;
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
  isUniqueSelected,
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
              <ArmoryItemRow key={i} arm={arm} isChar={isChar} justAdded={lastAdded === arm.name} priceLabel={vehPriceLabel(arm)} onAdd={() => onAdd(arm)} />
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
}: {
  arm: ArmoryItem;
  isChar: boolean;
  disabled?: boolean;
  justAdded?: boolean;
  priceLabel?: string;
  inProfile?: boolean;
  onAdd: () => void;
}) {
  const charPrice = parsePrice(arm.p_char);
  const unitPrice = parsePrice(arm.p_unit);
  const pts = isChar ? (charPrice ?? unitPrice) : unitPrice;
  const displayPrice = priceLabel ?? (pts != null ? `${pts >= 0 ? '+' : ''}${pts} pts` : '—');

  return (
    <button
      onClick={onAdd}
      disabled={disabled}
      className={`w-full flex justify-between items-start px-3 py-2 border text-left gap-2 transition-all duration-200
        ${inProfile
          ? 'bg-zinc-800/50 border-zinc-700 opacity-50 cursor-not-allowed'
          : disabled
            ? 'bg-zinc-800 border-zinc-700 opacity-40 cursor-not-allowed'
            : justAdded
              ? 'bg-green-900/30 border-green-600'
              : 'bg-zinc-800 border-zinc-700 hover:border-amber-700 hover:bg-zinc-700'
        }`}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-1 flex-wrap">
          <span className={`text-sm font-medium transition-colors ${justAdded ? 'text-green-400' : 'text-zinc-200'}`}>
            {arm.name}
          </span>
          {justAdded && <span className="text-green-500 text-xs font-bold">✓ Added</span>}
          {inProfile && <span className="text-[9px] bg-zinc-700 text-zinc-400 px-1 py-0.5 uppercase tracking-wide">In profile</span>}
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
      <span className={`font-bold text-sm whitespace-nowrap shrink-0 ${justAdded ? 'text-green-400' : inProfile ? 'text-zinc-500' : 'text-amber-500'}`}>
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
