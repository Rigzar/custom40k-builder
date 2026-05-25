import { useState } from 'react';
import type { RosterEntry } from '../types/army';
import type { Unit, Power } from '../types/data';
import { useArmyStore } from '../store/army';
import { getArchetypeRule } from '../engine/archetypes';
import { GENERAL_DISCIPLINES } from '../data/generalDisciplines';

interface Props { item: RosterEntry; unit: Unit; onClose: () => void; }

type ModalTab = 'powers' | 'prayers' | 'pacts';

const MARK_NAMES = ['khorne', 'tzeentch', 'nurgle', 'slaanesh'] as const;

function isMarkOnlyDisc(name: string): boolean {
  const lc = name.toLowerCase();
  return MARK_NAMES.some(m => lc.includes(m) && lc.includes('only'));
}

function isCultOnlyDisc(name: string): boolean {
  const lc = name.toLowerCase();
  return lc.includes('cult') && lc.includes('only');
}

function isLegacyDisc(name: string): boolean {
  return name.includes('(Legacy)');
}

export function PsychicModal({ item, unit, onClose }: Props) {
  const {
    data, archetype, legacy, legacy2,
    addPower, removePower, addPrayer, removePrayer, addPact, removePact,
  } = useArmyStore();
  if (!data) return null;

  const rule = getArchetypeRule(archetype);
  const effectiveMark = unit.locked_mark ?? (rule?.forcedMark ?? null) ?? item.mark;
  const hasActiveLegacy = !!(legacy || legacy2);

  const hasPowers = unit.is_psyker;
  const hasPrayers = unit.is_priest && (data.prayers ?? []).length > 0;
  const hasPacts = !!(unit.uses_pacts) && (data.pacts ?? []).length > 0;
  const isCultInitiate = !!(unit.is_cult_initiate);

  const defaultTab: ModalTab = hasPowers ? 'powers' : hasPrayers ? 'prayers' : 'pacts';
  const [tab, setTab] = useState<ModalTab>(defaultTab);

  // ── Discipline filtering ──────────────────────────────────────────────────
  // Cult initiates (Dark Commune) see ONLY Cult Powers — no General, no other faction discs
  // All other psykers see General + faction discs EXCLUDING cult-only ones
  const factionDiscs = Object.entries(data.disciplines ?? {}).filter(([name]) => {
    if (isCultOnlyDisc(name)) return isCultInitiate;  // Cult Powers only for cult initiates
    if (isCultInitiate) return false;                 // Cult initiates see ONLY Cult Powers
    if (isMarkOnlyDisc(name)) {
      if (!effectiveMark || effectiveMark === 'Undivided') return false;
      const lc = name.toLowerCase();
      return MARK_NAMES.some(m => lc.includes(m) && effectiveMark.toLowerCase() === m);
    }
    if (isLegacyDisc(name)) return hasActiveLegacy;
    return true;
  });

  const generalDiscs = isCultInitiate ? [] : Object.entries(GENERAL_DISCIPLINES);
  let allowedDiscs = [...generalDiscs, ...factionDiscs];

  // CD: per-unit discipline access derived from psyker ability text.
  // Each unit lists exactly which disciplines it knows — enforce that here.
  if (data.faction === 'Chaos Daemons' && hasPowers) {
    const psykerLine = (unit.abilities ?? []).find(a => /^psyker:/i.test(a)) ?? '';
    const lc = psykerLine.toLowerCase();
    // "chosen discipline" (Daemon Prince) = no restriction — can pick any
    if (!lc.includes('chosen discipline')) {
      const allowsGenerals = lc.includes('all general disciplines');
      allowedDiscs = allowedDiscs.filter(([discName]) => {
        // Is it a general discipline?
        if (Object.prototype.hasOwnProperty.call(GENERAL_DISCIPLINES, discName)) return allowsGenerals;
        // Faction (god-specific) discipline — check unit ability mentions it
        const dn = discName.toLowerCase();
        if (dn.includes('change')) return lc.includes('discipline of change');
        if (dn.includes('decay'))  return lc.includes('discipline of decay');
        if (dn.includes('excess')) return lc.includes('discipline of excess');
        return true;
      });
    }
  }

  function isPowerSelected(disc: string, power: string) {
    return item.powers.some(p => p.disciplineName === disc && p.powerName === power);
  }
  function togglePower(disc: string, power: string) {
    if (isPowerSelected(disc, power)) removePower(item.id, disc, power);
    else addPower(item.id, disc, power);
  }

  function isPrayerSelected(prayerName: string) {
    return item.prayers.includes(prayerName);
  }
  function togglePrayer(prayerName: string) {
    if (isPrayerSelected(prayerName)) removePrayer(item.id, prayerName);
    else addPrayer(item.id, prayerName);
  }

  function isPactSelected(pactName: string) {
    return (item.pacts ?? []).includes(pactName);
  }
  function togglePact(pactName: string) {
    if (isPactSelected(pactName)) removePact(item.id, pactName);
    else addPact(item.id, pactName);
  }

  const tabCount = [hasPowers, hasPrayers, hasPacts].filter(Boolean).length;

  // Label for the powers button — "Cult Powers" for cult initiates, "Psychic Powers" otherwise
  const powersLabel = isCultInitiate ? 'Cult Powers' : 'Psychic Powers';

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-start justify-center z-50 p-6 overflow-y-auto"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-zinc-900 border-2 border-amber-800 w-full max-w-2xl flex flex-col max-h-[85vh]">
        <div className="flex justify-between items-center px-4 py-3 bg-zinc-800 border-b border-amber-800">
          <h3 className="text-amber-400 uppercase tracking-widest text-sm">
            {hasPowers && hasPrayers ? `${powersLabel} & Prayers`
              : hasPowers && hasPacts ? `${powersLabel} & Pacts`
              : hasPrayers && hasPacts ? 'Prayers & Pacts'
              : hasPrayers ? 'Prayers'
              : hasPacts ? 'Infernal Pacts'
              : powersLabel} — {unit.name}
          </h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-xl">✕</button>
        </div>

        {/* Tab selector — shown when the unit has more than one type */}
        {tabCount > 1 && (
          <div className="flex border-b border-zinc-700">
            {hasPowers && (
              <button
                onClick={() => setTab('powers')}
                className={`px-4 py-2 text-[11px] uppercase tracking-wide border-b-2 transition-colors
                  ${tab === 'powers' ? 'border-amber-600 text-amber-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
              >
                {powersLabel} ({item.powers.length})
              </button>
            )}
            {hasPrayers && (
              <button
                onClick={() => setTab('prayers')}
                className={`px-4 py-2 text-[11px] uppercase tracking-wide border-b-2 transition-colors
                  ${tab === 'prayers' ? 'border-amber-600 text-amber-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
              >
                Prayers ({item.prayers.length})
              </button>
            )}
            {hasPacts && (
              <button
                onClick={() => setTab('pacts')}
                className={`px-4 py-2 text-[11px] uppercase tracking-wide border-b-2 transition-colors
                  ${tab === 'pacts' ? 'border-amber-600 text-amber-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
              >
                Infernal Pacts ({(item.pacts ?? []).length})
              </button>
            )}
          </div>
        )}

        <div className="overflow-y-auto flex-1 p-3 space-y-4">
          {/* ── Psychic / Cult Powers ── */}
          {tab === 'powers' && hasPowers && (
            allowedDiscs.length === 0 ? (
              <div className="text-zinc-500 italic text-sm text-center py-8">
                No disciplines available for this unit.
              </div>
            ) : (
              allowedDiscs.map(([discName, powers]) => (
                <div key={discName}>
                  <div className="text-[11px] text-amber-700 uppercase tracking-widest border-b border-zinc-700 pb-1 mb-2">
                    {discName}
                  </div>
                  <div className="space-y-1">
                    {(powers as Power[]).map(p => {
                      const sel = isPowerSelected(discName, p.name);
                      return (
                        <button
                          key={p.name}
                          onClick={() => togglePower(discName, p.name)}
                          className={`w-full text-left px-3 py-2 border transition-colors
                            ${sel
                              ? 'bg-amber-900/30 border-amber-700 text-amber-300'
                              : 'bg-zinc-800 border-zinc-700 hover:border-amber-700 hover:bg-zinc-700 text-zinc-200'
                            }`}
                        >
                          <div className="text-sm font-medium">{p.name}</div>
                          <div className="text-[10px] text-zinc-500 mt-0.5">
                            {[p.type, p.range, p.cast_value ? `Cast: ${p.cast_value}` : null]
                              .filter(Boolean).join(' · ')}
                          </div>
                          {p.effect && (
                            <div className="text-[11px] text-zinc-400 mt-1">{p.effect}</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )
          )}

          {/* ── Prayers ── */}
          {tab === 'prayers' && hasPrayers && (
            <div className="space-y-1">
              {(data.prayers as Power[]).map(p => {
                const sel = isPrayerSelected(p.name);
                return (
                  <button
                    key={p.name}
                    onClick={() => togglePrayer(p.name)}
                    className={`w-full text-left px-3 py-2 border transition-colors
                      ${sel
                        ? 'bg-amber-900/30 border-amber-700 text-amber-300'
                        : 'bg-zinc-800 border-zinc-700 hover:border-amber-700 hover:bg-zinc-700 text-zinc-200'
                      }`}
                  >
                    <div className="text-sm font-medium">{p.name}</div>
                    {p.effect && (
                      <div className="text-[11px] text-zinc-400 mt-1">{p.effect}</div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* ── Infernal Pacts ── */}
          {tab === 'pacts' && hasPacts && (
            <div className="space-y-1">
              {(data.pacts as Power[]).map(p => {
                const sel = isPactSelected(p.name);
                return (
                  <button
                    key={p.name}
                    onClick={() => togglePact(p.name)}
                    className={`w-full text-left px-3 py-2 border transition-colors
                      ${sel
                        ? 'bg-amber-900/30 border-amber-700 text-amber-300'
                        : 'bg-zinc-800 border-zinc-700 hover:border-amber-700 hover:bg-zinc-700 text-zinc-200'
                      }`}
                  >
                    <div className="text-sm font-medium">{p.name}</div>
                    {p.effect && (
                      <div className="text-[11px] text-zinc-400 mt-1">{p.effect}</div>
                    )}
                  </button>
                );
              })}
            </div>
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
