import { useArmyStore } from '../store/army';
import { ENGAGEMENTS } from '../engine/engagements';
import { getArchetypeRule, getEffectiveSlot, cleanArchetypeName } from '../engine/archetypes';
import { useT } from '../i18n';

import type { EngagementType, Mark } from '../types/army';

const PHASE_ICON_STYLE: React.CSSProperties = {
  filter: 'brightness(0) invert(1)',
  opacity: 0.75,
};

function SectionHeader({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-zinc-800 bg-zinc-900">
      <img src={icon} alt="" style={PHASE_ICON_STYLE} className="w-5 h-5 shrink-0" />
      <span className="font-cinzel text-[11px] uppercase tracking-widest text-amber-400">{label}</span>
    </div>
  );
}

export function ArmyConfig() {
  const {
    data, army, engagement, pointLimit, archetype, legacy, legacy2, traitPool,
    setEngagement, setPointLimit, setHqMark, setArchetype, setLegacy, setLegacy2, setTraitPool,
  } = useArmyStore();
  if (!data) return null;

  const rule = getArchetypeRule(archetype);
  const hasFullEngine = true;
  const t = useT();
  const engKeys = Object.keys(ENGAGEMENTS) as EngagementType[];

  const noLegacy = rule?.noLegacy ?? false;
  const noTraits = rule?.noTraits ?? false;
  const hasSecondLegacyTrait = traitPool.some(n => data.traits.find(t => t.name === n)?.enables_second_legacy);

  const ARCHETYPE_MARK: Record<string, string> = {
    'ˢ': 'Slaanesh', 'ᴷ': 'Khorne', 'ᵀ': 'Tzeentch', 'ᴺ': 'Nurgle',
  };
  function getArchetypeMark(name: string): string | null {
    return ARCHETYPE_MARK[name.slice(-1)] ?? null;
  }

  function handleSetArchetype(a: string) {
    setArchetype(a);
    const r = getArchetypeRule(a);
    if (r?.forcedMark) setHqMark(r.forcedMark as Mark);
  }

  const selectClass = `w-full bg-zinc-950 border border-zinc-700 text-zinc-100 px-3 py-2
    text-sm focus:outline-none focus:border-amber-600 transition-colors hover:border-zinc-600`;

  return (
    <div className="space-y-4">

      {/* ── BATTLE SETUP ─────────────────────────────────────── */}
      <div className="border border-zinc-800 bg-zinc-900/50">
        <SectionHeader icon="/phase-icons/rally.svg" label="Battle Setup" />
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

      {/* ── ARMY DOCTRINE + TRAITS ─────────────────────────────────────── */}
      {!hasFullEngine ? (
        <div className="border border-zinc-800 bg-zinc-900/50">
          <SectionHeader icon="/phase-icons/command.svg" label="Army Doctrine" />
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
              <SectionHeader icon="/phase-icons/command.svg" label="Army Doctrine" />
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
                      <div className="text-[10px] text-red-500/80 mt-1 pl-1">Not available in Skirmish.</div>
                    )}
                    {archetype && (
                      <div className="mt-2 border-l-2 border-amber-800 pl-3 space-y-0.5">
                        <div className="text-[10px] text-zinc-400 leading-relaxed">
                          {data.archetypes.find(a => a.name === archetype)?.desc}
                        </div>
                        {getArchetypeMark(archetype) && (
                          <div className="text-[10px] text-amber-600/80">
                            Only for armies with Mark of {getArchetypeMark(archetype)}.
                          </div>
                        )}
                      </div>
                    )}
                    {rule && rule.notes.length > 0 && (
                      <ul className="mt-2 space-y-0.5">
                        {rule.notes.map((n, i) => (
                          <li key={i} className="text-[10px] text-amber-700/80 pl-3 border-l border-amber-900">
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
                      Legacies not available with archetype <span className="text-amber-700">{cleanArchetypeName(archetype)}</span>.
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
                        <div className="mt-2 text-[10px] text-zinc-400 border-l-2 border-amber-800 pl-3 leading-relaxed">
                          {data.legacies.find(l => l.name === legacy)?.desc}
                        </div>
                      )}

                      {/* 2nd Legacy */}
                      {hasSecondLegacyTrait ? (
                        <div className="mt-2">
                          <select
                            value={legacy2}
                            onChange={e => setLegacy2(e.target.value)}
                            className={selectClass}
                          >
                            <option value="">— 2nd Legacy (none) —</option>
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
                          2nd Legacy unlocked by the second-legion trait.
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Army Traits */}
          {data.traits.length > 0 && (
            <div className="border border-zinc-800 bg-zinc-900/50">
              <SectionHeader icon="/phase-icons/action.svg" label="Army Traits" />
              <div className="p-4 space-y-3">
                {noTraits ? (
                  <div className="text-[10px] text-zinc-500 italic border border-zinc-800 px-3 py-2 bg-zinc-950/50">
                    Traits not available with archetype <span className="text-amber-700">{cleanArchetypeName(archetype)}</span>.
                  </div>
                ) : (
                  <>
                    <div className="text-[10px] text-zinc-500 leading-relaxed">
                      Choose up to 2. All main-faction units with veteran abilities receive the selected traits.
                    </div>

                    {[0, 1].map(slot => (
                      <select
                        key={slot}
                        value={traitPool[slot] ?? ''}
                        onChange={e => {
                          const val = e.target.value;
                          const newPool = [
                            slot === 0 ? val : (traitPool[0] ?? ''),
                            slot === 1 ? val : (traitPool[1] ?? ''),
                          ].filter(Boolean) as string[];
                          setTraitPool(newPool);
                        }}
                        className={selectClass}
                      >
                        <option value="">— Trait {slot + 1} (none) —</option>
                        {data.traits
                          .filter(t => t.name !== (slot === 0 ? traitPool[1] : traitPool[0]))
                          .map(t => (
                            <option key={t.name} value={t.name}>{t.name}</option>
                          ))
                        }
                      </select>
                    ))}

                    {/* Black Crusade champion */}
                    {traitPool.includes('Black Crusade') && (
                      <div className="border border-zinc-700 bg-zinc-950/60 p-3">
                        <div className="text-[10px] text-amber-700 uppercase tracking-widest mb-2">
                          Black Crusade — Champion required
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
                                  ⚜ Champion: <span className="font-semibold">{champion.unitName}</span>
                                </div>
                                <div className="flex gap-1 flex-wrap">
                                  {(['Khorne','Nurgle','Slaanesh','Tzeentch'] as const).map(god => (
                                    <span key={god} className="text-[10px] px-1.5 py-0.5 bg-amber-900/30 border border-amber-700/50 text-amber-300 uppercase tracking-wide">
                                      {god}
                                    </span>
                                  ))}
                                </div>
                                <div className="text-[10px] text-zinc-600 mt-1.5">
                                  Pays the combined mark cost for all four gods.
                                </div>
                              </div>
                            );
                          }
                          return (
                            <div className="text-[10px] text-amber-600/80 leading-relaxed">
                              ○ No champion designated. Open an HQ unit card and toggle{' '}
                              <span className="text-amber-400">Black Crusade Champion</span>{' '}
                              to assign one HQ to carry all four Chaos god marks.
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
