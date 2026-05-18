import { useState } from 'react';
import { useArmyStore } from '../store/army';
import { validateArmy } from '../engine/validators';

export function ValidationPanel() {
  const { data, ...state } = useArmyStore();
  const [open, setOpen] = useState(true);
  if (!data) return null;

  const items = validateArmy(state, data);
  const hasErrors = items.some(i => i.type === 'error');
  const hasWarns  = items.some(i => i.type === 'warn');

  const borderColor = hasErrors ? 'border-l-red-500' : hasWarns ? 'border-l-amber-400' : 'border-l-green-500';

  return (
    <div className={`bg-zinc-900 border border-zinc-700 border-l-4 ${borderColor}`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex justify-between items-center text-[11px] uppercase tracking-widest text-amber-600 px-3 py-2 border-b border-zinc-700 hover:bg-zinc-800 transition-colors"
      >
        <span>Validation</span>
        <span className="text-zinc-500 text-[10px]">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="p-3 space-y-0.5">
          {items.map((it, i) => {
            const cls    = it.type === 'error' ? 'text-red-400' : it.type === 'warn' ? 'text-amber-400' : 'text-green-400';
            const prefix = it.type === 'error' ? '✗ '           : it.type === 'warn' ? '⚠ '            : '✓ ';
            return (
              <div key={i} className={`text-[12px] py-0.5 ${cls}`}>{prefix}{it.text}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}
