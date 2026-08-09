import { useArmyStore } from '../store/army';
import { validateArmy } from '../engine/validators';
import { computeUnitPoints, resolveUnit, effectiveArchetypeFor } from '../engine/points';
import { ExportImport } from './ExportImport';
import { FactionSymbol } from './FactionSymbol';
import { useT, useLanguage } from '../i18n';

/**
 * Step ④ — the army's report card.
 *
 * Validation used to live only in a collapsible in the builder's left sidebar, with a "✗ 3" chip
 * in the header that was not even clickable. Nothing ever told a player to go and look at it, so
 * an illegal list could be printed without ever seeing why. It is a step of its own now, and the
 * header chip jumps here.
 */
export function ReviewStep({ onPrint, onSave, savedMsg, onBack }: {
  onPrint: () => void;
  onSave: () => void;
  savedMsg: string;
  onBack: () => void;
}) {
  const t = useT();
  const { language } = useLanguage();
  const { data, ...state } = useArmyStore();
  if (!data) return null;

  const { army, alliedFaction, pointLimit } = state;

  const ptsOf = (item: typeof army[number]) => {
    const u = resolveUnit(item, data);
    return u ? computeUnitPoints(item, u, effectiveArchetypeFor(item, state)) : 0;
  };

  const alliedUnits  = alliedFaction ? army.filter(i => i.factionSource === alliedFaction) : [];
  const primaryUnits = alliedFaction ? army.filter(i => i.factionSource !== alliedFaction) : army;
  const primaryPts   = primaryUnits.reduce((s, i) => s + ptsOf(i), 0);
  const alliedPts    = alliedUnits.reduce((s, i) => s + ptsOf(i), 0);
  const total        = primaryPts + alliedPts;
  const over         = total > pointLimit;

  const items    = validateArmy(state, data, state.alliedData, language);
  const errors   = items.filter(i => i.type === 'error');
  const warns    = items.filter(i => i.type === 'warn');
  const oks      = items.filter(i => i.type !== 'error' && i.type !== 'warn');

  const headline = errors.length > 0
    ? { cls: 'border-red-700 text-red-400',     icon: '✗', text: `${errors.length} ${t('errorsSuffix')}` }
    : warns.length > 0
    ? { cls: 'border-amber-700 text-amber-400', icon: '⚠', text: `${warns.length} ${t('warningsSuffix')}` }
    : { cls: 'border-green-700 text-green-400', icon: '✓', text: t('ready') };

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-6 space-y-6 w-full">

      {/* ── Verdict ── */}
      <div className={`flex items-center gap-3 border-l-4 bg-zinc-900 border border-zinc-800 px-4 py-3 ${headline.cls}`}>
        <span className="text-xl leading-none">{headline.icon}</span>
        <span className="font-cinzel text-sm uppercase tracking-widest">{headline.text}</span>
      </div>

      {/* ── Points ── */}
      <section>
        <h2 className="text-[11px] uppercase tracking-widest text-amber-700 mb-3">{t('points')}</h2>
        <div className="border border-zinc-800 bg-zinc-900/50 p-4 space-y-3">
          <div className="flex items-end justify-between gap-3">
            <span className={`text-3xl font-bold tabular-nums ${over ? 'text-red-400' : 'text-amber-400'}`}>
              {total}
            </span>
            <span className="text-sm text-zinc-500 tabular-nums">/ {pointLimit} pts</span>
          </div>
          <div className="w-full h-2 bg-zinc-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${over ? 'bg-red-500' : 'bg-amber-600'}`}
              style={{ width: `${Math.min(100, (total / pointLimit) * 100)}%` }}
            />
          </div>
          {alliedFaction && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="border-l-2 border-amber-800 pl-3">
                <div className="text-[10px] uppercase tracking-widest text-zinc-500">{t('detachmentPrimary')}</div>
                <div className="text-sm text-amber-400 tabular-nums">{primaryPts} pts</div>
                <div className="text-[10px] text-zinc-600">{primaryUnits.length} {t('models')}</div>
              </div>
              <div className="border-l-2 border-emerald-800 pl-3">
                <div className="text-[10px] uppercase tracking-widest text-zinc-500 flex items-center gap-1">
                  🤝 <FactionSymbol factionKey={alliedFaction} size={12} naked /> {t('tabAllied')}
                </div>
                <div className="text-sm text-emerald-400 tabular-nums">{alliedPts} pts</div>
                <div className="text-[10px] text-zinc-600">{alliedUnits.length} {t('models')}</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Validation detail ── */}
      <section>
        <h2 className="text-[11px] uppercase tracking-widest text-amber-700 mb-3">{t('validation')}</h2>
        <div className="border border-zinc-800 bg-zinc-900/50 divide-y divide-zinc-800/70">
          {[...errors, ...warns, ...oks].map((it, i) => {
            const cls    = it.type === 'error' ? 'text-red-400' : it.type === 'warn' ? 'text-amber-400' : 'text-green-400';
            const prefix = it.type === 'error' ? '✗' : it.type === 'warn' ? '⚠' : '✓';
            return (
              <div key={i} className={`flex items-start gap-2.5 px-4 py-2.5 text-[12px] ${cls}`}>
                <span className="shrink-0 mt-px">{prefix}</span>
                <span className="leading-relaxed">{it.text}</span>
              </div>
            );
          })}
          {items.length === 0 && (
            <div className="px-4 py-3 text-[12px] text-zinc-500">{t('ready')}</div>
          )}
        </div>
        {errors.length > 0 && (
          <button
            onClick={onBack}
            className="mt-3 text-[11px] uppercase tracking-wide text-zinc-400 hover:text-amber-400 border border-zinc-700 hover:border-amber-800 px-3 py-1.5 transition-colors"
          >
            ← {t('backToUnits')}
          </button>
        )}
      </section>

      {/* ── Save / share ── */}
      <section>
        <h2 className="text-[11px] uppercase tracking-widest text-amber-700 mb-3">{t('saveAndExport')}</h2>
        <div className="border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={onSave}
              className={`text-[11px] uppercase tracking-wide border px-4 py-1.5 transition-colors
                ${savedMsg
                  ? 'text-green-400 border-green-700 bg-green-900/20'
                  : 'text-amber-400 border-amber-800 bg-amber-900/20 hover:bg-amber-800/30'
                }`}
            >
              {savedMsg || t('save')}
            </button>
            <button
              onClick={onPrint}
              className="text-[11px] uppercase tracking-wide border border-zinc-600 text-zinc-300 hover:border-amber-800 hover:text-amber-400 px-4 py-1.5 transition-colors"
            >
              {t('print')}
            </button>
          </div>
          <ExportImport />
        </div>
      </section>

    </div>
  );
}
