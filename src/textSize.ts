import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Text size, remembered per device (a new player's suggestion: zooming the browser often breaks the page).
 *
 * The browser's own zoom shrinks the viewport in CSS pixels, so the layout jumps to a narrower breakpoint and
 * panels collapse. CSS `zoom` on <html> scales the content the same way but leaves the media-query viewport
 * alone, so the page keeps the layout the screen width calls for. Print is always 100% (see index.css).
 */
export const TEXT_SIZES = [100, 115, 130] as const;
export type TextSize = typeof TEXT_SIZES[number];

interface TextSizeState {
  size: TextSize;
  cycle: () => void;
}

function apply(size: number) {
  if (typeof document === 'undefined') return;
  const el = document.documentElement;
  if (size === 100) el.style.removeProperty('zoom'); else el.style.setProperty('zoom', String(size / 100));
}

export const useTextSize = create<TextSizeState>()(
  persist(
    (set, get) => ({
      size: 100,
      cycle: () => {
        const next = TEXT_SIZES[(TEXT_SIZES.indexOf(get().size) + 1) % TEXT_SIZES.length];
        apply(next); set({ size: next });
      },
    }),
    {
      name: 'c40k_text_size',
      onRehydrateStorage: () => (state) => apply(state?.size ?? 100),
    },
  ),
);

if (typeof localStorage !== 'undefined') {
  try {
    const saved = JSON.parse(localStorage.getItem('c40k_text_size') ?? '{}')?.state?.size;
    apply((TEXT_SIZES as readonly number[]).includes(saved) ? saved : 100);
  } catch { apply(100); }
}
