import { useState } from 'react';
import { useArmyStore } from '../store/army';
import { validateArmy } from '../engine/validators';
import { useT, useLanguage } from '../i18n';

export function ValidationPanel() {
  const t = useT();
  const { language } = useLanguage();
  const { data, ...state } = useArmyStore();
  const [open, setOpen] = useState(true);
  if (!data) return null;

  const items = validateArmy(state, data, state.alliedData, language);
  const hasErrors = items.some(i => i.type === 'error');
  const hasWarns  = items.some(i => i.type === 'warn');

  const accentColor = hasErrors ? 'border-l-red-600' : hasWarns ? 'border-l-amber-500' : 'border-l-green-600';
  const statusDot   = hasErrors ? 'bg-red-500' : hasWarns ? 'bg-amber-400' : 'bg-green-500';
  const statusCount = hasErrors
    ? `${items.filter(i => i.type === 'error').length} ${t('errorsSuffix')}`
    : hasWarns
    ? `${items.filter(i => i.type === 'warn').length} ${t('warningsSuffix')}`
    : t('ready');

  return (
    <div className={`border border-zinc-800 bg-zinc-900/50 border-l-4 ${accentColor}`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800/60 transition-colors"
      >
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot}`} />
        <span className="font-cinzel text-[11px] uppercase tracking-widest text-amber-400 flex-1 text-left">{t('validation')}</span>
        <span className="text-zinc-600 text-[10px]">{statusCount}</span>
        <span className="text-zinc-600 text-[10px] ml-1">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="p-3 space-y-1">
          {items.map((it, i) => {
            const cls    = it.type === 'error' ? 'text-red-400' : it.type === 'warn' ? 'text-amber-400' : 'text-green-400';
            const prefix = it.type === 'error' ? '✗' : it.type === 'warn' ? '⚠' : '✓';
            return (
              <div key={i} className={`flex items-start gap-2 text-[11px] ${cls}`}>
                <span className="shrink-0 mt-px">{prefix}</span>
                <span className="leading-relaxed">{it.text}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
