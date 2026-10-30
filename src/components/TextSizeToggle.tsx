import { useTextSize } from '../textSize';
import { useT } from '../i18n';

/** Cycles the text size 100% / 115% / 130%. Sits next to the language and theme switches: how the app is shown, not what it holds. */
export function TextSizeToggle({ className = '' }: { className?: string }) {
  const t = useT();
  const { size, cycle } = useTextSize();
  return (
    <button
      onClick={cycle}
      title={`${t('textSizeTitle')}: ${size}%`}
      aria-label={`${t('textSizeTitle')}: ${size}%`}
      className={`px-2 py-1 text-[11px] tracking-wide border transition-colors
        bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-amber-400 hover:border-zinc-600 ${className}`}
    >
      <span className="text-[10px]">A</span><span className="text-[14px] leading-none">A</span>
      {size !== 100 && <span className="ml-1 text-[10px] text-amber-500">{size}%</span>}
    </button>
  );
}
