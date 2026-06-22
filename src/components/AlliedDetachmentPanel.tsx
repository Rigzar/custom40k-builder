import { useState } from 'react';
import { useArmyStore } from '../store/army';
import { ALLIED_AOP, SLOT_ORDER } from '../engine/engagements';
import {
  getAlliableWith,
  getRelationship,
  RELATIONSHIP_LABELS,
  RELATIONSHIP_COLORS,
  RELATIONSHIP_DESCRIPTIONS,
  type Relationship,
} from '../data/alliedMatrix';
import { getEffectiveSlot, getArchetypeRule, cleanArchetypeName } from '../engine/archetypes';
import { SLOT_ICONS } from '../assets/slotIcons';

const FACTION_NAMES: Record<string, string> = {
  chaos_space_marines:  'Chaos Space Marines',
  chaos_daemons:        'Chaos Daemons',
  space_marines:        'Space Marines',
  imperial_guard:       'Imperial Guard',
  adeptus_mechanicus:   'Adeptus Mechanicus',
  adeptus_custodes:     'Adeptus Custodes',
  adeptus_sororitas:    'Adeptus Sororitas',
  grey_knights:         'Grey Knights',
  inquisition:          'Inquisition',
  assassins:            'Assassins',
  tau_empire:           'Tau Empire',
  necrons:              'Necrons',
  orks:                 'Orks',
  eldar:                'Eldar',
  dark_eldar:           'Dark Eldar',
  genestealer_cults:    'Genestealer Cults',
  harlequins:           'Harlequins',
  leagues_of_votann:    'Leagues of Votann',
  tyranids:             'Tyranids',
  horus_heresy:         'Horus Heresy Space Marines',
};

function RelationshipBadge({ rel }: { rel: Relationship }) {
  return (
    <span className={`text-[10px] font-semibold uppercase tracking-wide ${RELATIONSHIP_COLORS[rel]}`}>
      {RELATIONSHIP_LABELS[rel]}
    </span>
  );
}

function FactionPicker({
  primaryFaction,
  onSelect,
  onCancel,
}: {
  primaryFaction: string;
  onSelect: (key: string) => void;
  onCancel: () => void;
}) {
  const options = getAlliableWith(primaryFaction);
  const groups: Relationship[] = ['G', 'Y', 'R'];

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-[11px] text-zinc-400">Select an allied faction:</span>
        <button
          onClick={onCancel}
          className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          Cancel
        </button>
      </div>
      {groups.map(rel => {
        const inGroup = options.filter(o => o.relationship === rel);
        if (inGroup.length === 0) return null;
        return (
          <div key={rel}>
            <div className={`text-[10px] uppercase tracking-widest mb-1 ${RELATIONSHIP_COLORS[rel]}`}>
              {RELATIONSHIP_LABELS[rel]}
            </div>
            <div className="space-y-0.5">
              {inGroup.map(({ key }) => (
                <button
                  key={key}
                  onClick={() => onSelect(key)}
                  className="w-full flex justify-between items-center px-2 py-1.5 text-left text-[12px] border border-zinc-700/50 hover:border-amber-800 hover:bg-zinc-700 hover:text-amber-400 transition-colors group"
                >
                  <span className="text-zinc-200 group-hover:text-amber-400">
                    {FACTION_NAMES[key] ?? key}
                  </span>
                  <RelationshipBadge rel={rel} />
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function AlliedCatalogue({ alliedFactionKey }: { alliedFactionKey: string }) {
  const { alliedData, alliedArchetype, army, addUnit } = useArmyStore();
  const [openSlots, setOpenSlots] = useState<Record<string, boolean>>({ Troops: true, HQ: true });

  if (!alliedData) {
    return (
      <div className="text-[11px] text-zinc-500 italic py-2">
        Loading allied faction data...
      </div>
    );
  }

  // Group by EFFECTIVE slot, same as the primary catalogue (SlotPanel.tsx) — the allied
  // detachment's own Archetype can remap a unit's battlefield role (e.g. Space Marines' "1st
  // Company": "Honor Guard and Terminators can be taken as Troops"), so the catalogue must use
  // the ally's archetype rule, not its native slot, both for listing and for counting slot usage.
  const rule = getArchetypeRule(alliedArchetype ?? '');
  const effectiveSlotUnits: Record<string, string[]> = {};
  const nestedUnitNames = new Set<string>();
  for (const s of SLOT_ORDER) effectiveSlotUnits[s] = [];
  for (const [originalSlot, names] of Object.entries(alliedData.slot_to_units)) {
    for (const name of names) {
      if (!alliedData.units[name]) continue;
      const effSlot = getEffectiveSlot(name, originalSlot, rule);
      if (effectiveSlotUnits[effSlot]) effectiveSlotUnits[effSlot].push(name);
    }
  }

  // The ally's OWN archetype can grant it an intrinsic ally of its own (e.g. Chaos Space
  // Marines' "Plaguehost" → Chaos Daemons units with the Mark of Nurgle) — mirrors the primary
  // catalogue's rule.alliedFaction injection (SlotPanel.tsx), one level deeper.
  if (rule?.alliedFaction && alliedData.allied?.[rule.alliedFaction]) {
    const nestedData = alliedData.allied[rule.alliedFaction];
    for (const [originalSlot, names] of Object.entries(nestedData.slot_to_units)) {
      for (const name of names) {
        const u = nestedData.units[name];
        if (!u) continue;
        if (rule.alliedMarkFilter === 'forced') {
          if (!u.locked_mark || u.locked_mark !== rule.forcedMark) continue;
        }
        const effSlot = getEffectiveSlot(name, originalSlot, rule);
        if (effectiveSlotUnits[effSlot]) {
          effectiveSlotUnits[effSlot].push(name);
          nestedUnitNames.add(name);
        }
      }
    }
  }

  return (
    <div className="space-y-1 mt-2">
      {SLOT_ORDER.map(slot => {
        const [min, max] = ALLIED_AOP[slot];
        const slotUnits = effectiveSlotUnits[slot] ?? [];
        // Skip slots with 0 max capacity that also have no units
        if (max === 0 && slotUnits.length === 0) return null;

        // Count how many allied units of this effective slot are in the army
        const used = army.filter(e => {
          if (e.factionSource !== alliedFactionKey) return false;
          return getEffectiveSlot(e.unitName, e.slot, rule) === slot;
        }).length;

        const effectiveMax = slot === 'Dedicated Transport' ? 3 : max;
        const isFull = effectiveMax > 0 && used >= effectiveMax;
        const isUnder = min > 0 && used < min;
        const countColor = isFull ? 'text-red-400' : isUnder ? 'text-amber-400' : 'text-zinc-400';
        const isOpen = openSlots[slot] ?? false;

        return (
          <div key={slot} className="bg-zinc-800 border border-zinc-700 border-l-2 border-l-zinc-600">
            <button
              className="w-full flex justify-between items-center px-3 py-1.5 text-left hover:bg-zinc-700 transition-colors"
              onClick={() => setOpenSlots(o => ({ ...o, [slot]: !o[slot] }))}
            >
              <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-zinc-400">
                {SLOT_ICONS[slot] && (
                  <img src={SLOT_ICONS[slot]} alt="" className="w-3.5 h-3.5 opacity-50" style={{ filter: 'invert(1)' }} />
                )}
                {slot}
              </span>
              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] ${countColor}`}>
                  {used}/{effectiveMax > 0 ? effectiveMax : '—'}
                  {min > 0 && <span className="text-zinc-600"> (min {min})</span>}
                </span>
                <span className="text-zinc-600 text-[9px]">{isOpen ? '▲' : '▼'}</span>
              </div>
            </button>

            {isOpen && (
              <div className="border-t border-zinc-700 py-0.5">
                {slotUnits.length === 0 ? (
                  <div className="text-[11px] text-zinc-600 px-3 py-1 italic">No units</div>
                ) : (
                  slotUnits.map(name => {
                    const isNested = nestedUnitNames.has(name);
                    const u = isNested ? alliedData.allied?.[rule!.alliedFaction!]?.units[name] : alliedData.units[name];
                    if (!u) return null;
                    // Store the unit's TRUE native slot (e.g. Terminators are natively Elites,
                    // even while "1st Company" displays/counts them here under Troops) — same
                    // convention as the primary catalogue (SlotPanel.tsx) — so the remap stays
                    // reversible if the allied Archetype is changed or cleared later.
                    return (
                      <button
                        key={name}
                        onClick={() => addUnit(name, u.slot, alliedFactionKey, isNested ? rule!.alliedFaction! : undefined)}
                        disabled={isFull}
                        className={`w-full flex justify-between items-center px-3 py-1.5 text-left text-[12px] border-b border-zinc-700/50 transition-colors group
                          ${isFull
                            ? 'opacity-40 cursor-not-allowed'
                            : 'hover:bg-zinc-700 hover:text-amber-400'
                          }`}
                      >
                        <span className="text-zinc-200 group-hover:text-amber-400">
                          {name}{isNested && <span className="text-zinc-500 ml-1">[{FACTION_NAMES[rule!.alliedFaction!] ?? rule!.alliedFaction}]</span>}
                        </span>
                        <span className="text-zinc-500 text-[11px]">{u.min_cost ?? '?'} pts</span>
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

/**
 * Allied Detachment's OWN Army Customisation (Core Rules L1834: "Allies may select their own
 * Army Customisation options") — independent of the primary faction's archetype/legacy/traits.
 * Lives in its own "Allied: <faction>" tab (App.tsx), full-width like the primary's ArmyConfig,
 * not squeezed into the sidebar — reinforces that this is a second, separate army, not a
 * sub-section of the primary's. Deliberately scoped down from the primary's full ArmyConfig: a
 * single Legacy slot (no 2nd-legacy-via-trait unlock) and generic trait costing only (no Holy
 * Trinity / Black Crusade style legacy-specific auto-behaviour — CSM-primary-only mechanics).
 */
export function AlliedCustomisation({ alliedFactionKey }: { alliedFactionKey: string }) {
  const {
    alliedData, alliedArchetype, alliedLegacy, alliedTraitPool,
    setAlliedArchetype, setAlliedLegacy, setAlliedTraitPool,
  } = useArmyStore();

  if (!alliedData) return null;
  if (!alliedData.archetypes.length && !alliedData.legacies.length && !alliedData.traits.length) {
    return (
      <div className="text-[11px] text-zinc-500 italic border border-zinc-800 px-3 py-2 bg-zinc-950/50">
        {FACTION_NAMES[alliedFactionKey] ?? alliedFactionKey} has no Army Customisation options.
      </div>
    );
  }

  const selectClass = `w-full bg-zinc-950 border border-zinc-700 text-zinc-100 px-3 py-2
    text-sm focus:outline-none focus:border-emerald-600 transition-colors hover:border-zinc-600`;
  const pool = alliedTraitPool ?? [];
  const rule = getArchetypeRule(alliedArchetype ?? '');
  const noLegacy = rule?.noLegacy ?? false;
  const noTraits = rule?.noTraits ?? false;

  return (
    <div className="border border-zinc-800 bg-zinc-900/50">
      <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-zinc-800 bg-zinc-900">
        <span className="text-[12px]">🤝</span>
        <span className="font-cinzel text-[11px] uppercase tracking-widest text-emerald-400">
          {FACTION_NAMES[alliedFactionKey] ?? alliedFactionKey} — Army Customisation
        </span>
      </div>
      <div className="p-4 space-y-4">
        {alliedData.archetypes.length > 0 && (
          <div>
            <div className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1.5">Archetype</div>
            <select value={alliedArchetype ?? ''} onChange={e => setAlliedArchetype(e.target.value)} className={selectClass}>
              <option value="">— none —</option>
              {alliedData.archetypes.map(a => (
                <option key={a.name} value={a.name}>{cleanArchetypeName(a.name)}</option>
              ))}
            </select>
            {alliedArchetype && (
              <div className="mt-2 text-[10px] text-zinc-400 border-l-2 border-emerald-800 pl-3 leading-relaxed">
                {alliedData.archetypes.find(a => a.name === alliedArchetype)?.desc}
              </div>
            )}
          </div>
        )}

        {alliedData.legacies.length > 0 && (
          noLegacy ? (
            <div className="text-[10px] text-zinc-500 italic border border-zinc-800 px-3 py-2 bg-zinc-950/50">
              Legacies not available with archetype <span className="text-emerald-600">{cleanArchetypeName(alliedArchetype ?? '')}</span>.
            </div>
          ) : (
          <div>
            <div className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1.5">Legacy</div>
            <select value={alliedLegacy ?? ''} onChange={e => setAlliedLegacy(e.target.value)} className={selectClass}>
              <option value="">— none —</option>
              {alliedData.legacies.map(l => <option key={l.name} value={l.name}>{l.name}</option>)}
            </select>
            {alliedLegacy && (
              <div className="mt-2 text-[10px] text-zinc-400 border-l-2 border-emerald-800 pl-3 leading-relaxed">
                {alliedData.legacies.find(l => l.name === alliedLegacy)?.desc}
              </div>
            )}
          </div>
          )
        )}

        {alliedData.traits.length > 0 && (
          noTraits ? (
            <div className="text-[10px] text-zinc-500 italic border border-zinc-800 px-3 py-2 bg-zinc-950/50">
              Traits not available with archetype <span className="text-emerald-600">{cleanArchetypeName(alliedArchetype ?? '')}</span>.
            </div>
          ) : (
          <div>
            <div className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1.5">Traits (up to 2)</div>
            <div className="space-y-2">
              {[0, 1].map(slot => (
                <select
                  key={slot}
                  value={pool[slot] ?? ''}
                  onChange={e => {
                    const val = e.target.value;
                    const newPool = [
                      slot === 0 ? val : (pool[0] ?? ''),
                      slot === 1 ? val : (pool[1] ?? ''),
                    ].filter(Boolean) as string[];
                    setAlliedTraitPool(newPool);
                  }}
                  className={selectClass}
                >
                  <option value="">— Trait {slot + 1} (none) —</option>
                  {alliedData.traits
                    .filter(t => t.name !== (slot === 0 ? pool[1] : pool[0]))
                    .map(t => <option key={t.name} value={t.name}>{t.name}</option>)
                  }
                </select>
              ))}
            </div>
            {pool.length > 0 && (
              <div className="space-y-1.5 pt-2">
                {pool.map(name => {
                  const tr = alliedData.traits.find(t => t.name === name);
                  if (!tr) return null;
                  return (
                    <div key={name} className="pl-3 border-l-2 border-emerald-900 text-[10px]">
                      <span className="text-emerald-400 font-semibold">{name}</span>
                      <span className="text-zinc-500 ml-1.5">— {tr.desc}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          )
        )}
      </div>
    </div>
  );
}

/**
 * Sidebar widget: lets the player attach/detach the allied detachment and shows the relationship
 * at a glance. Once attached, its own Army Customisation and unit catalogue live in the dedicated
 * "Allied: <faction>" tab (App.tsx) — not here — so the two armies stay visually separate.
 */
export function AlliedDetachmentPanel({ primaryFaction }: { primaryFaction: string | null }) {
  const { alliedFaction, setAlliedFaction, engagement } = useArmyStore();
  const [showPicker, setShowPicker] = useState(false);

  if (!primaryFaction) return null;

  // Missions.txt (Skirmish): "No allies may be included. No Archetypes may be selected."
  if (engagement === 'skirmish') {
    return (
      <div className="text-[11px] text-zinc-500 italic border border-zinc-800 px-3 py-2 bg-zinc-950/50 text-center">
        Allied Detachments are not available in Skirmish.
      </div>
    );
  }

  // ── No allied faction selected ───────────────────────────────────────────
  if (!alliedFaction) {
    if (showPicker) {
      return (
        <FactionPicker
          primaryFaction={primaryFaction}
          onSelect={key => {
            setAlliedFaction(key);
            setShowPicker(false);
          }}
          onCancel={() => setShowPicker(false)}
        />
      );
    }

    return (
      <button
        onClick={() => setShowPicker(true)}
        className="w-full text-[12px] text-zinc-400 hover:text-amber-400 border border-dashed border-zinc-600 hover:border-amber-800 py-2 transition-colors text-center"
      >
        + Add Allied Detachment
      </button>
    );
  }

  // ── Allied faction selected ──────────────────────────────────────────────
  const rel = getRelationship(primaryFaction, alliedFaction);
  const factionLabel = FACTION_NAMES[alliedFaction] ?? alliedFaction;

  return (
    <div className="space-y-2">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex items-center gap-1.5">
          <span className="text-[12px]">🤝</span>
          <div>
            <div className="text-[12px] text-zinc-200 font-medium truncate">{factionLabel}</div>
            {rel && <RelationshipBadge rel={rel} />}
          </div>
        </div>
        <button
          onClick={() => setAlliedFaction(null)}
          title="Remove allied detachment"
          className="text-[11px] text-zinc-500 hover:text-red-400 border border-zinc-700 hover:border-red-800 px-2 py-0.5 transition-colors shrink-0"
        >
          Remove
        </button>
      </div>

      {/* Relationship description */}
      {rel && (
        <p className="text-[11px] text-zinc-500 leading-snug">
          {RELATIONSHIP_DESCRIPTIONS[rel]}
        </p>
      )}

      <p className="text-[11px] text-emerald-500/80 leading-snug border-l-2 border-emerald-800 pl-2">
        Its own Army Customisation and unit catalogue are in the <span className="font-semibold">🤝 Allied: {factionLabel}</span> tab above — independent from {FACTION_NAMES[primaryFaction] ?? primaryFaction}'s.
      </p>
    </div>
  );
}
