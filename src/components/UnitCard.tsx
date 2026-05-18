import { useState } from 'react';
import type { RosterEntry, Mark, ArmorySelection, TraitSelection } from '../types/army';
import type { Unit, Model, Weapon, Choice, ArmoryItem, FactionData } from '../types/data';
import { useArmyStore } from '../store/army';
import { computeUnitPoints, getActiveVariant, resolveUnit } from '../engine/points';
import { getArchetypeRule, getEffectiveSlot } from '../engine/archetypes';
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
  const markUsesVetSlot = hasMarkGroup && !u.locked_mark && !!effectiveMark;
  const vetMax = Math.max(0, (u.veteran_max ?? 2) - (markUsesVetSlot ? 1 : 0));
  const showArmory = u.has_armory_access || u.champion_has_armory || variantActive;

  // Army traits: apply to main-faction units (not allied) with veteran abilities
  const isMainFaction = item.unitName in data.units;
  const unitTraitsInPool = data.traits.filter(t => {
    if (!traitPool.includes(t.name)) return false;
    const hasNumericCost = [t.pts_unit, t.pts_char, t.pts_veh].some(
      v => v && v !== '-' && v.toLowerCase() !== 'special',
    );
    return hasNumericCost;
  });
  const showTraits = isMainFaction && u.has_veteran_abilities && unitTraitsInPool.length > 0;
  // Traits apply to all eligible units with no veteran_max cap — no conflict possible
  const hasTraitConflict = false;

  const modelsToShow: Model[] = variant
    ? [variant, ...u.models.filter((m: Model) => m.max > 0).slice(1)]
    : u.models.filter((m: Model) => m.max > 0);

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
              {statModMark && MARK_STAT_MODS[statModMark] && (
                u.is_character ? MARK_STAT_MODS[statModMark].char : MARK_STAT_MODS[statModMark].inf
              ) && (
                <span className="ml-2 text-blue-400 normal-case font-normal text-[10px]">* = mark bonus applied</span>
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
                        let boosted = false;
                        if (statModMark && MARK_STAT_MODS[statModMark]) {
                          const mod = u.is_character
                            ? MARK_STAT_MODS[statModMark].char
                            : MARK_STAT_MODS[statModMark].inf;
                          if (mod && mod.stat === k) {
                            const r = applyDelta(raw, mod.delta);
                            display = r.display;
                            boosted = r.modified;
                          }
                        }
                        return (
                          <td key={k} className={`text-center py-1 px-1 ${boosted ? 'text-blue-400 font-bold' : ''}`}>
                            {display}{boosted ? '*' : ''}
                          </td>
                        );
                      })}
                      <td className="text-right text-amber-600 py-1 pl-2">{m.points}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Built-in weapons */}
          {u.weapons.length > 0 && (
            <div>
              <div className="text-[10px] text-amber-700 uppercase tracking-widest mb-1">Weapons</div>
              <WeaponTable weapons={u.weapons} />
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

          {/* Mark selection — only for Chaos units with a mark option group */}
          {!u.locked_mark && !markIsForced && hasMarkGroup && (
            <div>
              <div className="text-[10px] text-amber-700 uppercase tracking-widest mb-1">Chaos Mark</div>
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
            {hasTraitConflict && (
              <button
                onClick={() => setTraitsOpen(true)}
                className="text-[11px] px-2 py-1 bg-zinc-900 border border-amber-800 text-amber-400 hover:bg-zinc-700 uppercase tracking-wide"
              >
                Traits ⚠ ({item.traits.length}/{vetMax})
              </button>
            )}
            {((u.is_psyker && Object.keys(data.disciplines ?? {}).length > 0) || (u.is_priest && (data.prayers ?? []).length > 0)) && (
              <button
                onClick={() => setPsyOpen(true)}
                className="text-[11px] px-2 py-1 bg-zinc-900 border border-zinc-600 text-amber-500 hover:bg-zinc-700 uppercase tracking-wide"
              >
                {u.is_psyker && u.is_priest
                  ? `Powers/Prayers (${item.powers.length + item.prayers.length})`
                  : u.is_priest
                    ? `Prayers (${item.prayers.length})`
                    : `Powers (${item.powers.length})`
                }
              </button>
            )}
          </div>

          {/* Equipped armory items — with weapon stats if applicable */}
          {item.armory.length > 0 && (
            <div className="space-y-1">
              <div className="text-[10px] text-amber-700 uppercase tracking-widest">Equipment</div>
              {item.armory.map((a: ArmorySelection) => {
                const armItem = findArmoryItemData(data, a);
                const isWeapon = a.section === 'weapons' || a.section === 'daemon_weapons';
                return (
                  <div key={a.id} className="bg-zinc-900 border border-zinc-700 px-2 py-1 text-[11px]">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-300 font-medium">{a.itemName}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-amber-600">{a.points >= 0 ? '+' : ''}{a.points} pts</span>
                        <button
                          onClick={() => useArmyStore.getState().removeArmoryItem(item.id, a.id)}
                          className="text-red-500 hover:text-red-300 text-[11px]"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    {/* Weapon stats inline */}
                    {isWeapon && armItem && (
                      <EquippedWeaponStats armItem={armItem} />
                    )}
                    {/* Equipment description */}
                    {!isWeapon && armItem?.desc && (
                      <div className="text-[10px] text-zinc-500 mt-0.5 pl-1 italic">{armItem.desc}</div>
                    )}
                    <div className="text-[9px] text-zinc-600 mt-0.5">{a.source}</div>
                  </div>
                );
              })}
            </div>
          )}

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
                item.traits.map((t: TraitSelection) => (
                  <div key={t.name} className="flex justify-between items-center bg-zinc-900 border border-zinc-700 px-2 py-1 text-[11px]">
                    <span className="text-zinc-300">{t.name}</span>
                    <span className="text-amber-600">+{t.points} pts</span>
                  </div>
                ))
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

          {/* Abilities */}
          {u.abilities.length > 0 && (
            <details>
              <summary className="text-[11px] text-amber-700 cursor-pointer select-none">
                Abilities ({u.abilities.length})
              </summary>
              <div className="mt-2 space-y-1">
                {u.abilities.map((a, i) => (
                  <div key={i} className="text-[11px] text-zinc-400 border-b border-zinc-700/40 py-1">{a}</div>
                ))}
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
      {traitsOpen && <TraitsModal item={item} unit={u} markUsesSlot={markUsesVetSlot} onClose={() => setTraitsOpen(false)} />}
      {psyOpen && <PsychicModal item={item} unit={u} onClose={() => setPsyOpen(false)} />}
    </div>
  );
}

function EquippedWeaponStats({ armItem }: { armItem: ArmoryItem }) {
  const cls = 'text-[10px] text-zinc-500 mt-0.5 pl-1 border-l border-amber-900/40';
  if (armItem.profiles && armItem.profiles.length > 0) {
    return (
      <div className={`${cls} space-y-0.5`}>
        {armItem.profiles.map((p, i) => (
          <div key={i}>
            <span className="text-zinc-600 italic">{p.name}:</span>{' '}
            {p.range} · {p.type} · S{p.s} AP{p.ap} D{p.d}
            {p.abilities && p.abilities !== '-' && (
              <span className="text-zinc-600"> · {p.abilities}</span>
            )}
          </div>
        ))}
      </div>
    );
  }
  if (armItem.range) {
    return (
      <div className={cls}>
        {armItem.range} · {armItem.type} · S{armItem.s} AP{armItem.ap} D{armItem.d}
        {armItem.abilities && armItem.abilities !== '-' && (
          <span className="text-zinc-600"> · {armItem.abilities}</span>
        )}
      </div>
    );
  }
  if (armItem.abilities) {
    return <div className={`${cls} italic`}>{armItem.abilities}</div>;
  }
  return <div className="text-[10px] text-zinc-600 mt-0.5 pl-1 italic">— see faction rules</div>;
}

function WeaponTable({ weapons }: { weapons: Weapon[] }) {
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
        {weapons.map((w: Weapon, i: number) => (
          <tr key={i} className="border-b border-zinc-700/40 text-zinc-300">
            <td className="py-1 pr-2">{w.name}</td>
            <td className="py-1 pr-2">{w.range}</td>
            <td className="py-1 pr-2">{w.type}</td>
            <td className="py-1 pr-2">{w.s}</td>
            <td className="py-1 pr-2">{w.ap}</td>
            <td className="py-1 pr-2">{w.d}</td>
            <td className="py-1 text-zinc-500 text-[10px]">{w.abilities}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
