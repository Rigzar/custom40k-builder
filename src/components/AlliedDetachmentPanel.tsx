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
import { getEffectiveSlot } from '../engine/archetypes';
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

function AlliedCatalogue({ alliedFactionKey }: { alliedFactionKey: string }) {
  const { alliedData, army, addUnit } = useArmyStore();
  const [openSlots, setOpenSlots] = useState<Record<string, boolean>>({ Troops: true, HQ: true });

  if (!alliedData) {
    return (
      <div className="text-[11px] text-zinc-500 italic py-2">
        Loading allied faction data...
      </div>
    );
  }

  return (
    <div className="space-y-1 mt-2">
      {SLOT_ORDER.map(slot => {
        const [min, max] = ALLIED_AOP[slot];
        const slotUnits = alliedData.slot_to_units[slot] ?? [];
        // Skip slots with 0 max capacity that also have no units
        if (max === 0 && slotUnits.length === 0) return null;

        // Count how many allied units of this effective slot are in the army
        const used = army.filter(e => {
          if (e.factionSource !== alliedFactionKey) return false;
          return getEffectiveSlot(e.unitName, e.slot, null) === slot;
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
                    const u = alliedData.units[name];
                    if (!u) return null;
                    return (
                      <button
                        key={name}
                        onClick={() => addUnit(name, slot, alliedFactionKey)}
                        disabled={isFull}
                        className={`w-full flex justify-between items-center px-3 py-1.5 text-left text-[12px] border-b border-zinc-700/50 transition-colors group
                          ${isFull
                            ? 'opacity-40 cursor-not-allowed'
                            : 'hover:bg-zinc-700 hover:text-amber-400'
                          }`}
                      >
                        <span className="text-zinc-200 group-hover:text-amber-400">{name}</span>
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

export function AlliedDetachmentPanel({ primaryFaction }: { primaryFaction: string | null }) {
  const { alliedFaction, setAlliedFaction } = useArmyStore();
  const [showPicker, setShowPicker] = useState(false);

  if (!primaryFaction) return null;

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
        <div className="min-w-0">
          <div className="text-[12px] text-zinc-200 font-medium truncate">{factionLabel}</div>
          {rel && <RelationshipBadge rel={rel} />}
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

      {/* Allied unit catalogue */}
      <AlliedCatalogue alliedFactionKey={alliedFaction} />
    </div>
  );
}
