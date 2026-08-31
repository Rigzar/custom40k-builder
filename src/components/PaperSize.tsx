import { useState } from 'react';

/**
 * Paper-size control for Print View / Field Manual's Print/PDF button (player-survey request:
 * "the ability to choose paper size is a must"). `window.print()` alone hands the choice to the
 * OS print dialog — fine on desktop, but iOS Safari's Print/"Save to Files as PDF" sheet doesn't
 * expose a paper-size picker at all, so a phone user has no way to get anything but the device
 * default. Rendering our own `@page { size }` rule takes that decision back from the OS dialog,
 * so the choice made here is what actually prints regardless of platform.
 */
export type PaperSize = 'A4' | 'Letter';

const STORAGE_KEY = 'c40k_print_paper_size';

export function usePaperSize(): [PaperSize, (s: PaperSize) => void] {
  const [size, setSize] = useState<PaperSize>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === 'Letter' ? 'Letter' : 'A4';
    } catch {
      return 'A4';
    }
  });
  const update = (s: PaperSize) => {
    setSize(s);
    try { localStorage.setItem(STORAGE_KEY, s); } catch { /* private browsing, ignore */ }
  };
  return [size, update];
}

/** Renders the actual `@page` rule driving what paper size the browser prints at. */
export function PaperSizeCss({ size }: { size: PaperSize }) {
  return <style>{`@page { size: ${size === 'A4' ? 'A4' : 'letter'}; margin: 12mm; }`}</style>;
}

/** Small A4 / Letter toggle for the Print View / Field Manual toolbar. */
export function PaperSizeToggle({ size, onChange }: { size: PaperSize; onChange: (s: PaperSize) => void }) {
  return (
    <div className="print:hidden flex items-center gap-1">
      {(['A4', 'Letter'] as const).map(s => (
        <button key={s} onClick={() => onChange(s)} title={`Print at ${s} size`}
          className={`px-2 py-1.5 text-[10px] sm:text-xs uppercase tracking-wide border transition-colors ${size === s ? 'bg-amber-800 border-amber-600 text-white' : 'bg-zinc-700 border-zinc-600 text-zinc-300 hover:bg-zinc-600'}`}>
          {s}
        </button>
      ))}
    </div>
  );
}
