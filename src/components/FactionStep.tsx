import { useState } from 'react';
import type * as api from '../lib/api';
import { useArmyStore } from '../store/army';
import { FactionSymbol } from './FactionSymbol';
import { useT } from '../i18n';
import { CATEGORIES, STATUS_DOT, STATUS_I18N_KEY } from '../data/factionCatalog';
import { ENGAGEMENTS } from '../engine/engagements';
import type { SavedArmy } from '../hooks/useSavedArmies';
import type { EngagementType } from '../types/army';

function formatDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
}

/**
 * Step ① — Battle Setup, saved armies and the faction grid.
 *
 * This screen used to be a hidden `view === 'setup'` state inside LandingPage, reachable only by
 * pressing "Build Army" on the hero and leavable only through a "← Home" button that also wiped
 * the selected faction. It is a real step of the flow now, so the step bar is visible on it and
 * moving away from it costs nothing.
 */
export function FactionStep({
  selectedFaction, saves, factionFlags, codexVersions,
  onPickFaction, onLoadArmy, onDeleteArmy, onContinue,
}: {
  selectedFaction: string | null;
  saves: SavedArmy[];
  /** Admin overrides, fetched once in App — null keeps the versions compiled into this build. */
  factionFlags: api.FactionFlags | null;
  codexVersions: api.CodexVersions | null;
  onPickFaction: (key: string) => void;
  onLoadArmy: (save: SavedArmy) => void;
  onDeleteArmy: (id: string) => void;
  onContinue: () => void;
}) {
  const t = useT();
  const { engagement, pointLimit, setEngagement, setPointLimit } = useArmyStore();
  // Raw text of the points-limit box while it is being edited (null = show the store value).
  const [pointDraft, setPointDraft] = useState<string | null>(null);

  const engKeys = Object.keys(ENGAGEMENTS) as EngagementType[];
  const displaySaves = saves.filter(s => s.id !== 'autosave-session' && !s.id.startsWith('autosave'));

  function handleSetEngagement(e: EngagementType) {
    const eng = ENGAGEMENTS[e];
    setEngagement(e);
    if (pointLimit < eng.min) setPointLimit(eng.min);
    else if (pointLimit > eng.max) setPointLimit(eng.max);
  }

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-8 space-y-10 w-full">

      {/* ── Battle Setup ── */}
      <section>
        <h2 className="text-[11px] uppercase tracking-widest text-amber-700 mb-4">{t('battleSetup')}</h2>
        <div className="border border-zinc-800 bg-zinc-900/50">
          <div className="p-4 space-y-4">

            {/* Engagement type */}
            <div>
              <div className="text-[10px] text-zinc-400 uppercase tracking-widest mb-2">{t('battleType')}</div>
              <div className="grid grid-cols-3 gap-2">
                {engKeys.map(e => (
                  <button
                    key={e}
                    onClick={() => handleSetEngagement(e)}
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

            {/* Points limit */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest">{t('pointsLimit')}</span>
              <input
                type="number"
                inputMode="numeric"
                // Typing is kept as free text and only clamped on blur/Enter. Clamping inside
                // onChange re-clamped every keystroke, so typing "1500" turned the first "1"
                // into the minimum and the field could only ever end up at min or max — the
                // "can't change pts limit on mobile, it's just 1000 or 2499" Discord report.
                value={pointDraft ?? pointLimit}
                min={ENGAGEMENTS[engagement].min}
                max={ENGAGEMENTS[engagement].max}
                step={250}
                onChange={e => setPointDraft(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
                onBlur={e => {
                  const eng = ENGAGEMENTS[engagement];
                  const raw = e.target.value.trim();
                  const v = raw === '' ? pointLimit : Number(raw);
                  setPointLimit(Number.isFinite(v) ? Math.min(eng.max, Math.max(eng.min, v)) : pointLimit);
                  setPointDraft(null);
                }}
                className="w-28 bg-zinc-950 border border-zinc-700 text-amber-300 px-3 py-1.5 text-sm
                  focus:outline-none focus:border-amber-600 text-center tabular-nums"
              />
              <span className="text-[10px] text-zinc-600">pts</span>
              <span className="text-[10px] text-zinc-600">({ENGAGEMENTS[engagement].range})</span>
            </div>

          </div>
        </div>
      </section>

      {/* ── Saved armies ── */}
      {displaySaves.length > 0 && (
        <section>
          <h2 className="text-[11px] uppercase tracking-widest text-amber-700 mb-4">{t('savedArmies')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {displaySaves.map(save => (
              <div
                key={save.id}
                className="bg-zinc-900 border border-zinc-700 border-l-4 border-l-amber-800 p-3 flex flex-col gap-2 rounded-sm"
              >
                <div className="flex items-start justify-between gap-2 min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <FactionSymbol factionKey={save.factionKey} size={28} />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-zinc-100 truncate">{save.name}</div>
                      <div className="text-[10px] text-amber-700 uppercase tracking-wide mt-0.5">{save.factionLabel}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteArmy(save.id)}
                    className="text-zinc-600 hover:text-red-400 text-lg leading-none shrink-0 transition-colors"
                    title={t('delete')}
                  >
                    ×
                  </button>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                  <span>{save.unitCount} {t('models')}</span>
                  <span>·</span>
                  <span>{save.totalPts} {t('points')}</span>
                  <span>·</span>
                  <span>{formatDate(save.savedAt)}</span>
                </div>
                <button
                  onClick={() => onLoadArmy(save)}
                  className="mt-1 w-full text-center text-[11px] uppercase tracking-wide py-1.5 bg-amber-900/30 border border-amber-800/60 text-amber-400 hover:bg-amber-800/40 transition-colors"
                >
                  {t('loadArmy')}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Faction selection ── */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[11px] uppercase tracking-widest text-amber-700">{t('selectFaction')}</h2>
          <div className="hidden sm:flex items-center gap-3 text-[10px] text-zinc-500">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" />{t('fullyReviewed')}</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />{t('needsTesting')}</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />{t('inReview')}</span>
          </div>
        </div>

        <div className="space-y-7">
          {CATEGORIES.map(cat => (
            <div key={cat.name}>
              <div className="flex items-center gap-2.5 mb-3">
                <img
                  src={cat.icon}
                  alt={cat.name}
                  className="shrink-0"
                  style={{ width: cat.name === 'Imperium' ? 68 : 52, height: cat.name === 'Imperium' ? 68 : 52, filter: 'brightness(0) invert(1)', opacity: 0.60 }}
                />
                <span className="font-cinzel text-[11px] uppercase tracking-widest shrink-0" style={{ color: cat.pillFg }}>
                  {cat.name}
                </span>
                <div className="flex-1 h-px" style={{ background: cat.dividerColor }} />
              </div>

              <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))' }}>
                {cat.factions.map(fDef => {
                  // availability and codex version can be overridden by the admin settings
                  const over = codexVersions?.[fDef.key];
                  const f = { ...fDef,
                    available: factionFlags?.[fDef.key] ?? fDef.available,
                    version: over?.version ?? fDef.version,
                    status: over?.status ?? fDef.status };
                  const selected = selectedFaction === f.key;
                  return (
                    <button
                      key={f.key}
                      onClick={() => { if (f.available) onPickFaction(f.key); }}
                      disabled={!f.available}
                      onMouseMove={f.available ? (e) => {
                        const r = e.currentTarget.getBoundingClientRect();
                        const x = (e.clientX - r.left) / r.width - 0.5;
                        const y = (e.clientY - r.top) / r.height - 0.5;
                        e.currentTarget.style.setProperty('--tilt-x', `${y * -10}deg`);
                        e.currentTarget.style.setProperty('--tilt-y', `${x * 10}deg`);
                        e.currentTarget.style.setProperty('--shine-x', `${(x + 0.5) * 100}%`);
                        e.currentTarget.style.setProperty('--shine-y', `${(y + 0.5) * 100}%`);
                      } : undefined}
                      onMouseLeave={f.available ? (e) => {
                        e.currentTarget.style.setProperty('--tilt-x', '0deg');
                        e.currentTarget.style.setProperty('--tilt-y', '0deg');
                      } : undefined}
                      className={`
                        relative flex flex-col items-center gap-2 pt-4 pb-3 px-2 border rounded-lg text-center transition-all
                        ${!f.available
                          ? 'border-zinc-800 bg-zinc-900/50 cursor-not-allowed opacity-40'
                          : selected
                            ? 'border-amber-500 bg-amber-950/30 cursor-pointer faction-tilt'
                            : 'border-zinc-700 bg-zinc-900 hover:border-amber-600 hover:bg-zinc-800 cursor-pointer faction-tilt'
                        }
                      `}
                    >
                      {f.available && (
                        <div
                          className={`absolute top-2 right-2 w-2 h-2 rounded-full ${STATUS_DOT[f.status]}`}
                          title={t(STATUS_I18N_KEY[f.status])}
                        />
                      )}
                      <FactionSymbol factionKey={f.key} size={40} />
                      <span className={`text-[11px] leading-tight ${selected ? 'text-amber-200' : 'text-zinc-300'}`}>
                        {f.name}
                      </span>
                      {f.version && (
                        <span className="font-cinzel text-[8px] uppercase tracking-widest text-amber-600/80 -mt-1">
                          v{f.version}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Coming back to this step with a faction already picked must not be a dead end. */}
      {selectedFaction && (
        <div className="flex justify-center pb-4">
          <button
            onClick={onContinue}
            className="px-10 py-3 bg-amber-800 border-2 border-amber-600 text-white font-bold uppercase tracking-widest text-sm hover:bg-amber-700 transition-colors"
          >
            {t('continueLabel')} →
          </button>
        </div>
      )}

    </div>
  );
}
