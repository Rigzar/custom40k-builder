import { useState } from 'react';
import { useT } from '../i18n';
import type { Trait } from '../types/data';

/** "5*" -> "+5 pts/W per unit", "0" -> "free (per unit)", "-"/null -> not shown at all. */
export function formatTraitCost(raw: string | null | undefined, label: string): string | null {
  if (!raw || raw === '-' || raw.toLowerCase() === 'special') return null;
  const perW = raw.trim().endsWith('*');
  const num = raw.replaceAll('*', '').trim();
  if (num === '0') return `free (${label})`;
  return `+${num}${perW ? ' pts/W' : ' pts'} ${label}`;
}

export function traitCostParts(tr: Trait): string[] {
  return [
    formatTraitCost(tr.pts_unit, 'per unit'),
    formatTraitCost(tr.pts_monster, 'per monster'),
    formatTraitCost(tr.pts_char, 'per char'),
  ].filter((s): s is string => s !== null);
}

interface Props {
  traits: Trait[];
  /** Names already picked in OTHER slots — greyed out and unpickable here. */
  excludedNames: string[];
  /** This slot's current pick, '' if none. */
  currentValue: string;
  slotLabel: string;
  accent: 'amber' | 'emerald';
  onPick: (name: string) => void;
  onClose: () => void;
}

/**
 * Browse every Army Trait's full rule text before picking one — the plain <select> forced
 * picking blind and reading the description only after, which got unworkable for factions with
 * a long trait list. Mirrors ArmoryModal's card-list pattern (name + cost + description, click
 * to take) rather than inventing a new one.
 */
export function TraitPickerModal({ traits, excludedNames, currentValue, slotLabel, accent, onPick, onClose }: Props) {
  const t = useT();
  const [query, setQuery] = useState('');

  const accentText = accent === 'emerald' ? 'text-emerald-400' : 'text-amber-400';
  const accentBorderStrong = accent === 'emerald' ? 'border-emerald-800' : 'border-amber-800';
  const accentFocus = accent === 'emerald' ? 'focus:border-emerald-600' : 'focus:border-amber-600';
  const rowActiveBorder = accent === 'emerald' ? 'border-emerald-600 bg-emerald-900/20' : 'border-amber-600 bg-amber-900/20';
  const rowHoverBorder = accent === 'emerald' ? 'hover:border-emerald-700' : 'hover:border-amber-700';

  const q = query.trim().toLowerCase();
  const filtered = traits.filter(tr =>
    !q || tr.name.toLowerCase().includes(q) || tr.desc.toLowerCase().includes(q)
  );

  function pick(name: string) {
    onPick(name);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-start justify-center z-50 p-6 overflow-y-auto"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className={`bg-zinc-900 border-2 ${accentBorderStrong} w-full max-w-2xl flex flex-col max-h-[80vh]`}>
        <div className="flex justify-between items-center px-4 py-3 bg-zinc-800 border-b border-zinc-700 shrink-0">
          <h3 className={`${accentText} uppercase tracking-widest text-sm`}>
            {t('armyTraits')} — {slotLabel}
          </h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-xl">✕</button>
        </div>

        <div className="px-4 py-2.5 border-b border-zinc-800 shrink-0">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t('traitSearchPlaceholder')}
            autoFocus
            className={`w-full bg-zinc-950 border border-zinc-700 text-zinc-100 px-3 py-1.5 text-sm focus:outline-none ${accentFocus} transition-colors`}
          />
        </div>

        <div className="overflow-y-auto flex-1 p-3 space-y-1.5">
          <div
            onClick={() => pick('')}
            className={`border cursor-pointer transition-colors px-3 py-2 ${
              currentValue === '' ? rowActiveBorder : `bg-zinc-900 border-zinc-700 ${rowHoverBorder}`
            }`}
          >
            <span className="text-[12px] text-zinc-400 italic">{t('traitPickerClearSlot')}</span>
          </div>

          {filtered.length === 0 ? (
            <div className="text-zinc-500 italic text-[11px] py-4 text-center">{t('noResultsFound')}</div>
          ) : filtered.map(tr => {
            const isCurrent = tr.name === currentValue;
            const isExcluded = !isCurrent && excludedNames.includes(tr.name);
            const costParts = traitCostParts(tr);
            return (
              <div
                key={tr.name}
                onClick={() => !isExcluded && pick(tr.name)}
                className={`border transition-colors px-3 py-2 ${
                  isExcluded
                    ? 'bg-zinc-900/40 border-zinc-800 opacity-50 cursor-not-allowed'
                    : isCurrent
                      ? `${rowActiveBorder} cursor-pointer`
                      : `bg-zinc-900 border-zinc-700 ${rowHoverBorder} cursor-pointer`
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[12px] font-semibold text-zinc-100">{tr.name}</span>
                    {isCurrent && (
                      <span className="text-[9px] bg-zinc-700 text-zinc-300 px-1 py-0.5 uppercase tracking-wide">{t('selectedBadge')}</span>
                    )}
                    {isExcluded && (
                      <span className="text-[9px] bg-red-900/50 text-red-400 border border-red-800 px-1 py-0.5 uppercase tracking-wide">{t('traitTakenByOtherSlot')}</span>
                    )}
                  </div>
                  {/* Own line rather than floated beside the name — a trait's cost can be three
                      joined segments ("+5 pts per unit · +5 pts per monster · free (per char)"),
                      much longer than an Armory item's flat "+9 pts", and nowrap-beside-the-name
                      overflowed off narrow screens and overlapped the row below it (reported on
                      mobile, Discord). */}
                  {costParts.length > 0 && (
                    <div className={`text-[10px] font-mono mt-0.5 ${accent === 'emerald' ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {costParts.join(' · ')}
                    </div>
                  )}
                  <div className="text-[10px] text-zinc-500 mt-0.5 leading-relaxed">{tr.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
