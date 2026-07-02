import { useArmyStore } from '../store/army';
import { ENGAGEMENTS } from '../engine/engagements';
import { getArchetypeRule, getEffectiveSlot, cleanArchetypeName } from '../engine/archetypes';
import { useT } from '../i18n';

import type { EngagementType, Mark } from '../types/army';

const PHASE_ICON_STYLE: React.CSSProperties = {
  filter: 'brightness(0) invert(1)',
  opacity: 0.75,
};

function SectionHeader({ icon, label, accent = 'amber' }: { icon: string; label: string; accent?: 'amber' | 'emerald' }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-zinc-800 bg-zinc-900">
      <img src={icon} alt="" style={PHASE_ICON_STYLE} className="w-5 h-5 shrink-0" />
      <span className={`font-cinzel text-[11px] uppercase tracking-widest ${accent === 'emerald' ? 'text-emerald-400' : 'text-amber-400'}`}>{label}</span>
    </div>
  );
}

/**
 * Shared Army Customisation form (Battle Setup + Archetype/Legacy + Traits) for BOTH the
 * primary army and an Allied Detachment — `scope="allied"` hides the Battle Setup section
 * (engagement/points are shared with the primary army, not picked per-detachment) and reads/
 * writes the alliedArchetype/alliedLegacy/alliedTraitPool store fields instead, so the two
 * customisation flows can never drift out of sync with each other again.
 */
export function ArmyConfig({ scope = 'primary', alliedFactionLabel }: { scope?: 'primary' | 'allied'; alliedFactionLabel?: string }) {
  const store = useArmyStore();
  const isAllied = scope === 'allied';
  const accent: 'amber' | 'emerald' = isAllied ? 'emerald' : 'amber';

  const data = isAllied ? store.alliedData : store.data;
  const army = store.army;
  const { engagement, setEngagement, setPointLimit, pointLimit, setHqMark } = store;
  const archetype = (isAllied ? store.alliedArchetype : store.archetype) ?? '';
  const legacy = (isAllied ? store.alliedLegacy : store.legacy) ?? '';
  const legacy2 = isAllied ? '' : store.legacy2;
  const traitPool = (isAllied ? store.alliedTraitPool : store.traitPool) ?? [];
  const setArchetype = isAllied ? store.setAlliedArchetype : store.setArchetype;
  const setLegacy = isAllied ? store.setAlliedLegacy : store.setLegacy;
  const setLegacy2 = store.setLegacy2;
  const setTraitPool = isAllied ? store.setAlliedTraitPool : store.setTraitPool;

  const t = useT();

  if (!data) return null;
  if (isAllied && !data.archetypes.length && !data.legacies.length && !data.traits.length) {
    return (
      <div className="text-[11px] text-zinc-500 italic border border-zinc-800 px-3 py-2 bg-zinc-950/50">
        {alliedFactionLabel ?? 'This faction'} {t('noCustomisationOptions')}
      </div>
    );
  }

  const rule = getArchetypeRule(archetype);
  const hasFullEngine = true;
  const engKeys = Object.keys(ENGAGEMENTS) as EngagementType[];

  const noLegacy = rule?.noLegacy ?? false;
  const noTraits = rule?.noTraits ?? false;
  const hasSecondLegacyTrait = !isAllied && traitPool.some(n => data.traits.find(t => t.name === n)?.enables_second_legacy);
  const traitSlotBonus = (data.legacies.find(l => l.name === legacy)?.trait_slot_bonus ?? 0) + (rule?.archetypeTraitBonus ?? 0);
  const traitSlots = [0, 1, ...Array.from({ length: traitSlotBonus }, (_, i) => i + 2)];

  const ARCHETYPE_MARK: Record<string, string> = {
    'ˢ': 'Slaanesh', 'ᴷ': 'Khorne', 'ᵀ': 'Tzeentch', 'ᴺ': 'Nurgle',
  };
  function getArchetypeMark(name: string): string | null {
    return ARCHETYPE_MARK[name.slice(-1)] ?? null;
  }

  function handleSetArchetype(a: string) {
    setArchetype(a);
    if (!isAllied) {
      const r = getArchetypeRule(a);
      if (r?.forcedMark) setHqMark(r.forcedMark as Mark);
    }
  }

  const selectClass = `w-full bg-zinc-950 border border-zinc-700 text-zinc-100 px-3 py-2
    text-sm focus:outline-none ${isAllied ? 'focus:border-emerald-600' : 'focus:border-amber-600'} transition-colors hover:border-zinc-600`;
  const accentText = isAllied ? 'text-emerald-600' : 'text-amber-700';
  const accentBorder = isAllied ? 'border-emerald-800' : 'border-amber-800';

  return (
    <div className="space-y-4">

      {/* ── BATTLE SETUP (primary only — the ally shares engagement/points) ── */}
      {!isAllied && (
      <div className="border border-zinc-800 bg-zinc-900/50">
        <SectionHeader icon="/phase-icons/rally.svg" label={t('battleSetup')} />
        <div className="p-4 space-y-4">

          {/* Engagement type */}
          <div>
            <div className="text-[10px] text-zinc-400 uppercase tracking-widest mb-2">{t('battleType')}</div>
            <div className="grid grid-cols-3 gap-2">
              {engKeys.map(e => (
                <button
                  key={e}
                  onClick={() => setEngagement(e)}
                  className={`py-2.5 font-cinzel text-[10px] uppercase tracking-wide border transition-colors
                    ${engagement === e
                      ? 'bg-amber-900/50 border-amber-600 text-amber-300'
                      : 'bg-zinc-800/60 border-zinc-700 text-zinc-400 hover:text-amber-400 hover:border-zinc-600'
                    }`}
                >
                  {ENGAGEMENTS[e].name}
                </button>
              ))}
            </div>
            {ENGAGEMENTS[engagement].notes && (
              <div className="mt-2 text-[10px] text-zinc-500 border-l-2 border-amber-900/50 pl-2 leading-relaxed">
                {ENGAGEMENTS[engagement].notes}
              </div>
            )}
          </div>

          {/* Point limit */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest">{t('pointsLimit')}</span>
            <input
              type="number"
              value={pointLimit}
              onChange={e => setPointLimit(Number(e.target.value))}
              step={250}
              className="w-28 bg-zinc-950 border border-zinc-700 text-amber-300 px-3 py-1.5 text-sm
                focus:outline-none focus:border-amber-600 text-center tabular-nums"
            />
            <span className="text-[10px] text-zinc-600">pts</span>
          </div>
        </div>
      </div>
      )}

      {/* ── ARMY DOCTRINE + TRAITS ─────────────────────────────────────── */}
      {!hasFullEngine ? (
        <div className="border border-zinc-800 bg-zinc-900/50">
          <SectionHeader icon="/phase-icons/command.svg" label={t('armyDoctrine')} />
          <div className="p-4">
            <div className="text-[11px] text-zinc-500 border-l-4 border-amber-900/50 pl-3 space-y-1">
              <div className="text-amber-700 font-semibold uppercase tracking-wide text-[10px]">Engine support coming soon</div>
              <div>Archetype, Legacy and Traits are available for <span className="text-amber-600">Chaos Space Marines</span>, <span className="text-amber-600">Chaos Daemons</span> and <span className="text-amber-600">Space Marines</span>. More factions are being added.</div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Archetype + Legacy */}
          {(data.archetypes.length > 0 || data.legacies.length > 0) && (
            <div className="border border-zinc-800 bg-zinc-900/50">
              <SectionHeader icon="/phase-icons/command.svg" label={t('armyDoctrine')} accent={accent} />
              <div className="p-4 space-y-4">

                {/* Archetype */}
                {data.archetypes.length > 0 && (
                  <div>
                    <div className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1.5">{t('archetype')}</div>
                    <select
                      value={archetype}
                      onChange={e => handleSetArchetype(e.target.value)}
                      disabled={engagement === 'skirmish'}
                      className={`${selectClass} ${engagement === 'skirmish' ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      <option value="">{t('noArchetype')}</option>
                      {data.archetypes.map(a => <option key={a.name} value={a.name}>{cleanArchetypeName(a.name)}</option>)}
                    </select>
                    {engagement === 'skirmish' && (
                      <div className="text-[10px] text-red-500/80 mt-1 pl-1">{t('notAvailableInSkirmish')}</div>
                    )}
                    {archetype && (
                      <div className={`mt-2 border-l-2 ${accentBorder} pl-3 space-y-0.5`}>
                        <div className="text-[10px] text-zinc-400 leading-relaxed">
                          {data.archetypes.find(a => a.name === archetype)?.desc}
                        </div>
                        {getArchetypeMark(archetype) && (
                          <div className={`text-[10px] ${isAllied ? 'text-emerald-600/80' : 'text-amber-600/80'}`}>
                            {t('onlyForArmiesWithMarkOf')} {getArchetypeMark(archetype)}.
                          </div>
                        )}
                      </div>
                    )}
                    {rule && rule.notes.length > 0 && (
                      <ul className="mt-2 space-y-0.5">
                        {rule.notes.map((n, i) => (
                          <li key={i} className={`text-[10px] ${accentText}/80 pl-3 border-l ${isAllied ? 'border-emerald-900' : 'border-amber-900'}`}>
                            {n}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {/* Legacy */}
                {data.legacies.length > 0 && (
                  noLegacy ? (
                    <div className="text-[10px] text-zinc-500 italic border border-zinc-800 px-3 py-2 bg-zinc-950/50">
                      {t('legaciesNotAvailableWithArchetype')} <span className={accentText}>{cleanArchetypeName(archetype)}</span>.
                    </div>
                  ) : (
                    <div>
                      <div className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1.5">{t('legacy')}</div>
                      <select
                        value={legacy}
                        onChange={e => setLegacy(e.target.value)}
                        className={selectClass}
                      >
                        <option value="">{t('noLegacy')}</option>
                        {data.legacies.map(l => <option key={l.name} value={l.name}>{l.name}</option>)}
                      </select>
                      {legacy && (
                        <div className={`mt-2 text-[10px] text-zinc-400 border-l-2 ${accentBorder} pl-3 leading-relaxed`}>
                          {data.legacies.find(l => l.name === legacy)?.desc}
                        </div>
                      )}

                      {/* 2nd Legacy (primary only — second-legion traits aren't modeled for allies) */}
                      {!isAllied && (hasSecondLegacyTrait ? (
                        <div className="mt-2">
                          <select
                            value={legacy2}
                            onChange={e => setLegacy2(e.target.value)}
                            className={selectClass}
                          >
                            <option value="">{t('secondLegacyNone')}</option>
                            {data.legacies.filter(l => l.name !== legacy).map(l => (
                              <option key={l.name} value={l.name}>{l.name}</option>
                            ))}
                          </select>
                          {legacy2 && (
                            <div className="mt-2 text-[10px] text-zinc-400 border-l-2 border-amber-800 pl-3 leading-relaxed">
                              {data.legacies.find(l => l.name === legacy2)?.desc}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="mt-2 text-[10px] text-zinc-600 italic border border-zinc-800 px-3 py-1.5 bg-zinc-950/50">
                          {t('secondLegacyUnlockedByTrait')}
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Army Traits */}
          {data.traits.length > 0 && (
            <div className="border border-zinc-800 bg-zinc-900/50">
              <SectionHeader icon="/phase-icons/action.svg" label={t('armyTraits')} accent={accent} />
              <div className="p-4 space-y-3">
                {noTraits ? (
                  <div className="text-[10px] text-zinc-500 italic border border-zinc-800 px-3 py-2 bg-zinc-950/50">
                    {t('traitsNotAvailableWithArchetype')} <span className={accentText}>{cleanArchetypeName(archetype)}</span>.
                  </div>
                ) : (
                  <>
                    <div className="text-[10px] text-zinc-500 leading-relaxed">
                      {t('chooseUpToTraitsPrefix')} {traitSlots.length}{t('chooseUpToTraitsSuffix')}
                    </div>

                    {traitSlots.map(slot => (
                      <select
                        key={slot}
                        value={traitPool[slot] ?? ''}
                        onChange={e => {
                          const val = e.target.value;
                          const newPool = traitSlots.map(s => (s === slot ? val : (traitPool[s] ?? ''))).filter(Boolean) as string[];
                          setTraitPool(newPool);
                        }}
                        className={selectClass}
                      >
                        <option value="">{t('traitSlotPrefix')} {slot + 1} {t('traitSlotSuffix')}</option>
                        {data.traits
                          .filter(t => !traitSlots.some(s => s !== slot && traitPool[s] === t.name))
                          .map(t => (
                            <option key={t.name} value={t.name}>{t.name}</option>
                          ))
                        }
                      </select>
                    ))}

                    {/* Black Crusade champion (primary only — relies on the main army's HQ items) */}
                    {!isAllied && traitPool.includes('Black Crusade') && (
                      <div className="border border-zinc-700 bg-zinc-950/60 p-3">
                        <div className="text-[10px] text-amber-700 uppercase tracking-widest mb-2">
                          {t('blackCrusadeChampionRequired')}
                        </div>
                        {(() => {
                          const champion = army.find(item => {
                            if (item.factionSource) return false;
                            const effSlot = getEffectiveSlot(item.unitName, item.slot, getArchetypeRule(archetype));
                            return effSlot === 'HQ' && item.blackCrusadeHQ;
                          });
                          if (champion) {
                            return (
                              <div>
                                <div className="text-[11px] text-emerald-400 mb-2">
                                  {t('championLabel')} <span className="font-semibold">{champion.unitName}</span>
                                </div>
                                <div className="flex gap-1 flex-wrap">
                                  {(['Khorne','Nurgle','Slaanesh','Tzeentch'] as const).map(god => (
                                    <span key={god} className="text-[10px] px-1.5 py-0.5 bg-amber-900/30 border border-amber-700/50 text-amber-300 uppercase tracking-wide">
                                      {god}
                                    </span>
                                  ))}
                                </div>
                                <div className="text-[10px] text-zinc-600 mt-1.5">
                                  {t('paysCombinedMarkCost')}
                                </div>
                              </div>
                            );
                          }
                          return (
                            <div className="text-[10px] text-amber-600/80 leading-relaxed">
                              {t('noChampionPart1')}{' '}
                              <span className="text-amber-400">{t('blackCrusadeChampionToggle')}</span>{' '}
                              {t('noChampionPart2')}
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* Active trait descriptions */}
                    {traitPool.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        {traitPool.map(name => {
                          const tr = data.traits.find(t => t.name === name);
                          if (!tr) return null;
                          const fmtCost = (raw: string | null | undefined, label: string) => {
                            if (!raw || raw === '-' || raw.toLowerCase() === 'special') return null;
                            const perW = raw.trim().endsWith('*');
                            const num = raw.replace('*', '').trim();
                            if (num === '0') return `free (${label})`;
                            return `+${num}${perW ? ' pts/W' : ' pts'} ${label}`;
                          };
                          const costParts = [
                            fmtCost(tr.pts_unit, 'per unit'),
                            fmtCost(tr.pts_monster, 'per monster'),
                            fmtCost(tr.pts_char, 'per char'),
                          ].filter(Boolean);
                          return (
                            <div key={name} className="pl-3 border-l-2 border-amber-900 text-[10px]">
                              <span className="text-amber-400 font-semibold">{name}</span>
                              {costParts.length === 0 ? (
                                <span className="text-blue-400 ml-1.5">(army effect)</span>
                              ) : (
                                <span className="text-amber-600 ml-1.5">{costParts.join(' · ')}</span>
                              )}
                              <span className="text-zinc-500 ml-1.5">— {tr.desc}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
