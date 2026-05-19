import { useState } from 'react';
import type { RosterEntry } from '../types/army';
import type { Unit, ArmoryItem } from '../types/data';
import { useArmyStore } from '../store/army';
import { getArchetypeRule } from '../engine/archetypes';

interface Props {
  item: RosterEntry;
  unit: Unit;
  onClose: () => void;
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

export function ArmoryModal({ item, unit, onClose }: Props) {
  const { data, legacy, legacy2, archetype, addArmoryItem } = useArmyStore();
  const [tab, setTab] = useState<ArmoryTab>('general');
  const [section, setSection] = useState<Section>('weapons');
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  if (!data) return null;

  const rule = getArchetypeRule(archetype);
  const effectiveMark = unit.locked_mark ?? (rule?.forcedMark ?? null) ?? item.mark;
  const isChar = unit.is_character;
  const isVehicle = unit.is_vehicle;

  // Veteran slot tracking for armory items — independent of whether the faction has traits
  const armoryVetEnabled = unit.has_veteran_abilities;
  // Marks use one veteran slot for units that can choose their mark (not locked marks)
  const hasMarkGroup = unit.option_groups.some(g => g.constraint.type === 'mark');
  const markUsesVetSlot = !!(hasMarkGroup && !unit.locked_mark && effectiveMark);
  const armoryVetMax = armoryVetEnabled ? Math.max(0, (unit.veteran_max ?? 2) - (markUsesVetSlot ? 1 : 0)) : null;
  const veteranItemsUsed = armoryVetMax !== null
    ? item.armory.filter(a => {
        // look up category from all armory sources
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

  // Cataphractii armor restriction
  const isCataphractii = (unit.abilities ?? []).some(a => a.toLowerCase().startsWith('cataphractii armor'));
  function filterTermCompat(armItems: ArmoryItem[]): ArmoryItem[] {
    return isCataphractii ? armItems.filter(a => a.term_compat) : armItems;
  }

  // Filter items by unit type and category
  function filterByUnitType(armItems: ArmoryItem[]): ArmoryItem[] {
    return armItems.filter(arm => {
      if (arm.category === 'vehicle') return isVehicle;
      if (arm.category === 'veteran') return unit.has_veteran_abilities;
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

  function add(arm: ArmoryItem, src: string, sec: Section) {
    const charPrice = parsePrice(arm.p_char);
    const unitPrice = parsePrice(arm.p_unit);
    const pts = isChar
      ? (charPrice ?? unitPrice ?? 0)
      : (unitPrice ?? 0);
    addArmoryItem(item.id, {
      id: selId(),
      itemName: arm.name,
      source: src,
      section: sec,
      points: pts,
      isCharacter: isChar,
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
            Armoury — {unit.name}
          </h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-xl">✕</button>
        </div>

        {/* Armory tabs */}
        <div className="flex border-b border-zinc-700">
          {(['general','mark','legion'] as ArmoryTab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              disabled={(t === 'mark' && !effectiveMark) || (t === 'legion' && !hasLegion)}
              className={`px-4 py-2 text-[11px] uppercase tracking-wide border-b-2 transition-colors
                ${tab === t
                  ? 'border-amber-600 text-amber-400'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300 disabled:opacity-30'
                }`}
            >
              {t === 'mark' ? `${effectiveMark ?? 'Mark'} Armoury` : t === 'legion' ? `Legion${hasLegion ? ` (${activeLegionKeys.join(', ')})` : ''}` : 'General'}
            </button>
          ))}
        </div>

        {/* Cataphractii restriction */}
        {isCataphractii && (
          <div className="px-4 py-1.5 bg-amber-900/30 border-b border-amber-800 text-[10px] text-amber-400">
            Cataphractii Armour — showing only Terminator-compatible items (ᵀ).
          </div>
        )}

        {/* Section tabs */}
        <div className="flex gap-1 p-2 bg-zinc-800 border-b border-zinc-700">
          {(['weapons','equipment','daemon_weapons'] as Section[]).map(s => (
            <button
              key={s}
              onClick={() => setSection(s)}
              className={`px-3 py-1 text-[11px] uppercase border transition-colors
                ${section === s
                  ? 'bg-amber-800 border-amber-600 text-white'
                  : 'bg-zinc-900 border-zinc-600 text-zinc-400 hover:text-amber-400'
                }`}
            >
              {s === 'daemon_weapons' ? 'Daemon Weapons' : s === 'weapons' ? 'Weapons' : 'Equipment'}
            </button>
          ))}
        </div>

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
                const legItems = filterByUnitType(filterTermCompat(leg[section] as ArmoryItem[]));
                const legEq = section === 'equipment' ? splitEquipment(legItems) : null;
                return (
                  <div key={legName}>
                    <div className="text-[11px] text-amber-700 uppercase tracking-widest mb-1 mt-2">{legName}</div>
                    {legEq ? (
                      <EquipmentGroups
                        regular={legEq.regular} veteran={legEq.veteran} vehicle={legEq.vehicle}
                        isChar={isChar} isVehicle={isVehicle}
                        armoryVetMax={armoryVetMax} veteranItemsUsed={veteranItemsUsed} veteranSlotsFull={veteranSlotsFull}
                        lastAdded={lastAdded}
                        onAdd={arm => add(arm, legName, section)}
                      />
                    ) : (
                      legItems.length === 0
                        ? <div className="text-zinc-500 italic text-sm text-center py-4">No items in this section</div>
                        : legItems.map((arm, i) => (
                          <ArmoryItemRow key={i} arm={arm} isChar={isChar} justAdded={lastAdded === arm.name} onAdd={() => add(arm, legName, section)} />
                        ))
                    )}
                  </div>
                );
              })
          ) : section === 'equipment' ? (
            <EquipmentGroups
              regular={regularEquip} veteran={veteranEquip} vehicle={vehicleEquip}
              isChar={isChar} isVehicle={isVehicle}
              armoryVetMax={armoryVetMax} veteranItemsUsed={veteranItemsUsed} veteranSlotsFull={veteranSlotsFull}
              lastAdded={lastAdded}
              onAdd={arm => add(arm, tab === 'mark' ? `${effectiveMark} Armoury` : 'General', section)}
            />
          ) : (
            (() => {
              const items = getItems(section);
              return items.length === 0
                ? <div className="text-zinc-500 italic text-sm text-center py-8">No items in this section</div>
                : items.map((arm, i) => (
                  <ArmoryItemRow
                    key={i} arm={arm} isChar={isChar}
                    justAdded={lastAdded === arm.name}
                    onAdd={() => add(arm, tab === 'mark' ? `${effectiveMark} Armoury` : 'General', section)}
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
  armoryVetMax: number | null;
  veteranItemsUsed: number;
  veteranSlotsFull: boolean;
  lastAdded: string | null;
  onAdd: (arm: ArmoryItem) => void;
}

function EquipmentGroups({
  regular, veteran, vehicle,
  isChar, isVehicle,
  armoryVetMax, veteranItemsUsed, veteranSlotsFull,
  lastAdded,
  onAdd,
}: EquipGroupsProps) {
  const hasAnything = regular.length > 0 || veteran.length > 0 || vehicle.length > 0;
  if (!hasAnything) {
    return <div className="text-zinc-500 italic text-sm text-center py-8">No items in this section</div>;
  }

  return (
    <div className="space-y-3">
      {/* Regular equipment */}
      {regular.length > 0 && (
        <div className="space-y-1">
          {regular.map((arm, i) => (
            <ArmoryItemRow key={i} arm={arm} isChar={isChar} justAdded={lastAdded === arm.name} onAdd={() => onAdd(arm)} />
          ))}
        </div>
      )}

      {/* Veteran abilities */}
      {veteran.length > 0 && (
        <div>
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
          <div className="space-y-1">
            {veteran.map((arm, i) => (
              <ArmoryItemRow
                key={i} arm={arm} isChar={isChar}
                disabled={armoryVetMax !== null && veteranSlotsFull}
                justAdded={lastAdded === arm.name}
                onAdd={() => onAdd(arm)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Vehicle upgrades */}
      {vehicle.length > 0 && isVehicle && (
        <div>
          <div className="text-[10px] text-amber-600 uppercase tracking-widest mb-1 border-t border-zinc-700 pt-2">
            Vehicle Upgrades
          </div>
          <div className="space-y-1">
            {vehicle.map((arm, i) => (
              <ArmoryItemRow key={i} arm={arm} isChar={isChar} justAdded={lastAdded === arm.name} onAdd={() => onAdd(arm)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Item rows ────────────────────────────────────────────────────────────────

function ArmoryItemRow({
  arm, isChar, disabled = false, justAdded = false, onAdd,
}: {
  arm: ArmoryItem;
  isChar: boolean;
  disabled?: boolean;
  justAdded?: boolean;
  onAdd: () => void;
}) {
  const charPrice = parsePrice(arm.p_char);
  const unitPrice = parsePrice(arm.p_unit);
  const pts = isChar ? (charPrice ?? unitPrice) : unitPrice;

  return (
    <button
      onClick={onAdd}
      disabled={disabled}
      className={`w-full flex justify-between items-start px-3 py-2 border text-left gap-2 transition-all duration-200
        ${disabled
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
          {arm.term_compat && (
            <span className="text-[9px] bg-amber-800 text-white px-1 py-0.5 uppercase">Term</span>
          )}
        </div>
        {arm.desc && <div className="text-[11px] text-zinc-500 mt-0.5">{arm.desc}</div>}
        <ArmoryWeaponStats arm={arm} />
      </div>
      <span className={`font-bold text-sm whitespace-nowrap shrink-0 ${justAdded ? 'text-green-400' : 'text-amber-500'}`}>
        {pts != null ? `${pts >= 0 ? '+' : ''}${pts} pts` : '—'}
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
