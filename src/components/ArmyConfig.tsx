import { useArmyStore } from '../store/army';
import { ENGAGEMENTS } from '../engine/engagements';
import { getArchetypeRule, getEffectiveSlot, cleanArchetypeName } from '../engine/archetypes';
import { useT } from '../i18n';

import type { EngagementType, Mark } from '../types/army';

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

  // Undivided-only legacies restrict which units can be used
  const undividedLegacies = ['Legacy of the Hydra', 'Legacy of the Iron Lord', 'Legacy of the Night Haunter'];

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

  return (
    <div className="space-y-3">
      {/* Engagement type */}
      <div>
        <div className="text-[11px] text-zinc-400 uppercase tracking-widest mb-1">{t('battleType')}</div>
        <div className="flex gap-1">
          {engKeys.map(e => (
            <button
              key={e}
              onClick={() => setEngagement(e)}
              className={`flex-1 py-1.5 text-[11px] uppercase tracking-wide border transition-colors
                ${engagement === e
                  ? 'bg-amber-800 border-amber-600 text-white'
                  : 'bg-zinc-800 border-zinc-600 text-zinc-400 hover:text-amber-400'
                }`}
            >
              {ENGAGEMENTS[e].name}
            </button>
          ))}
        </div>
        <div className="text-[10px] text-zinc-500 mt-1">{ENGAGEMENTS[engagement].notes}</div>
      </div>

      {/* Point limit */}
      <div className="flex items-center gap-2">
        <label className="text-[11px] text-zinc-400 w-24">{t('pointsLimit')}</label>
        <input
          type="number"
          value={pointLimit}
          onChange={e => setPointLimit(Number(e.target.value))}
          step={250}
          className="w-24 bg-zinc-900 border border-zinc-600 text-zinc-100 px-2 py-1 text-sm focus:outline-none focus:border-amber-600"
        />
      </div>


      {/* Archetype / Legacy / Traits */}
      {!hasFullEngine ? (
        <div className="px-3 py-3 bg-zinc-900 border border-zinc-700 border-l-4 border-l-amber-900 text-[11px] text-zinc-500 space-y-1">
          <div className="text-amber-700 font-semibold uppercase tracking-wide text-[10px]">Archetype · Legacy · Traits</div>
          <div>Full engine support is being built faction by faction — <span className="text-amber-600">Chaos Space Marines</span>, <span className="text-amber-600">Chaos Daemons</span> and <span className="text-amber-600">Space Marines</span> are already live.</div>
          <div>These options will be unlocked for this faction in a future update.</div>
        </div>
      ) : (
        <>
          {/* Archetype */}
          <div>
            <div className="text-[11px] text-zinc-400 uppercase tracking-widest mb-1">{t('archetype')}</div>
            <select
              value={archetype}
              onChange={e => handleSetArchetype(e.target.value)}
              disabled={engagement === 'skirmish'}
              className={`w-full bg-zinc-900 border border-zinc-600 text-zinc-100 px-2 py-1 text-sm focus:outline-none focus:border-amber-600
                ${engagement === 'skirmish' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <option value="">{t('noArchetype')}</option>
              {data.archetypes.map(a => <option key={a.name} value={a.name}>{cleanArchetypeName(a.name)}</option>)}
            </select>
            {engagement === 'skirmish' && (
              <div className="text-[10px] text-red-500 mt-1">Not available in Skirmish.</div>
            )}
            {archetype && (
              <div className="text-[10px] text-zinc-500 mt-1 border-l-2 border-amber-800 pl-2 space-y-0.5">
                <div>{data.archetypes.find(a => a.name === archetype)?.desc}</div>
                {getArchetypeMark(archetype) && (
                  <div className="text-amber-600/80">Only for armies with Mark of {getArchetypeMark(archetype)}.</div>
                )}
              </div>
            )}
            {rule && rule.notes.length > 0 && (
              <ul className="mt-1 space-y-0.5">
                {rule.notes.map((n, i) => (
                  <li key={i} className="text-[10px] text-amber-700/80 pl-2 border-l border-amber-900">
                    {n}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Legacy — hidden when faction has no legacies */}
          {data.legacies.length === 0 ? null : noLegacy ? (
            <div className="px-2 py-2 bg-zinc-900 border border-zinc-700 text-[11px] text-zinc-500 italic">
              Legacies not available with archetype <span className="text-amber-700">{cleanArchetypeName(archetype)}</span>.
            </div>
          ) : (
            <div>
              <div className="text-[11px] text-zinc-400 uppercase tracking-widest mb-1">{t('legacy')}</div>
              <select
                value={legacy}
                onChange={e => setLegacy(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-600 text-zinc-100 px-2 py-1 text-sm focus:outline-none focus:border-amber-600"
              >
                <option value="">{t('noLegacy')}</option>
                {data.legacies.map(l => <option key={l.name} value={l.name}>{l.name}</option>)}
              </select>
              {legacy && (
                <div className="text-[10px] text-zinc-500 mt-1 pl-2 border-l-2 border-amber-800 space-y-0.5">
                  <div>{data.legacies.find(l => l.name === legacy)?.desc}</div>
                  {undividedLegacies.includes(legacy) && (
                    <div className="text-amber-600/80">Requires all units to be Undivided.</div>
                  )}
                </div>
              )}

              {/* 2nd Legacy: only available when a trait that enables it is active */}
              {hasSecondLegacyTrait ? (
                <>
                  <select
                    value={legacy2}
                    onChange={e => setLegacy2(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-600 text-zinc-100 px-2 py-1 text-sm mt-1 focus:outline-none focus:border-amber-600"
                  >
                    <option value="">— 2nd legacy (none) —</option>
                    {data.legacies.filter(l => l.name !== legacy).map(l => (
                      <option key={l.name} value={l.name}>{l.name}</option>
                    ))}
                  </select>
                  {legacy2 && (
                    <div className="text-[10px] text-zinc-500 mt-1 pl-2 border-l-2 border-amber-800 space-y-0.5">
                      <div>{data.legacies.find(l => l.name === legacy2)?.desc}</div>
                      {undividedLegacies.includes(legacy2) && (
                        <div className="text-amber-600/80">Requires all units to be Undivided.</div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="mt-1 px-2 py-1 text-[10px] text-zinc-600 italic border border-zinc-700 bg-zinc-900">
                  2nd Legacy only available when the second-legion trait is active.
                </div>
              )}
            </div>
          )}

          {/* Army Traits — hidden when faction has no traits */}
          {data.traits.length === 0 ? null : noTraits ? (
            <div className="px-2 py-2 bg-zinc-900 border border-zinc-700 text-[11px] text-zinc-500 italic">
              Traits not available with archetype <span className="text-amber-700">{cleanArchetypeName(archetype)}</span>.
            </div>
          ) : (
            <div>
              <div className="text-[11px] text-zinc-400 uppercase tracking-widest mb-1">{t('armyTraits')}</div>
              <div className="text-[10px] text-zinc-500 mb-2">
                Max 2. All main-faction units with veteran abilities receive the selected traits.
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
                  className="w-full bg-zinc-900 border border-zinc-600 text-zinc-100 px-2 py-1 text-sm mb-1 focus:outline-none focus:border-amber-600"
                >
                  <option value="">— none —</option>
                  {data.traits
                    .filter(t => t.name !== (slot === 0 ? traitPool[1] : traitPool[0]))
                    .map(t => (
                      <option key={t.name} value={t.name}>{t.name}</option>
                    ))
                  }
                </select>
              ))}
              {/* Black Crusade status — shows which HQ is designated as champion */}
              {traitPool.includes('Black Crusade') && data && (
                <div className="mt-2 p-2 bg-zinc-900 border border-zinc-700">
                  <div className="text-[10px] text-amber-700 uppercase tracking-widest mb-1">
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
                          <div className="text-[11px] text-emerald-400 mb-1">
                            ⚜ Champion: <span className="font-semibold">{champion.unitName}</span>
                          </div>
                          <div className="flex gap-1">
                            {(['Khorne','Nurgle','Slaanesh','Tzeentch'] as const).map(god => (
                              <span key={god} className="text-[10px] px-1.5 py-0.5 bg-amber-900/30 border border-amber-700/50 text-amber-300 uppercase tracking-wide">
                                {god}
                              </span>
                            ))}
                          </div>
                          <div className="text-[10px] text-zinc-600 mt-1">
                            Pays the combined mark cost for all four gods.
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div className="text-[10px] text-amber-600/80">
                        ○ No champion designated yet. Open an HQ unit card and toggle{' '}
                        <span className="text-amber-400">Black Crusade Champion</span>{' '}
                        to assign one HQ to carry all four Chaos god marks.
                      </div>
                    );
                  })()}
                </div>
              )}

              {traitPool.length > 0 && (
                <div className="mt-1 space-y-1">
                  {traitPool.map(name => {
                    const t = data.traits.find(tr => tr.name === name);
                    if (!t) return null;
                    const fmtCost = (raw: string | null | undefined, label: string) => {
                      if (!raw || raw === '-' || raw.toLowerCase() === 'special') return null;
                      const perW = raw.trim().endsWith('*');
                      const num = raw.replace('*', '').trim();
                      if (num === '0') return `free (${label})`;
                      return `+${num}${perW ? ' pts/W' : ' pts'} ${label}`;
                    };
                    const costParts = [
                      fmtCost(t.pts_unit, 'per unit'),
                      fmtCost(t.pts_monster, 'per monster'),
                      fmtCost(t.pts_char, 'per char'),
                    ].filter(Boolean);
                    return (
                      <div key={name} className="text-[10px] pl-2 border-l border-amber-900">
                        <span className="text-amber-400 font-semibold">{name}</span>
                        {costParts.length === 0 ? (
                          <span className="text-blue-400 ml-1">(army effect)</span>
                        ) : (
                          <span className="text-amber-600 ml-1">{costParts.join(' · ')}</span>
                        )}
                        <span className="text-zinc-500 ml-1">— {t.desc}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
