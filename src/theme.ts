import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'dark' | 'light';

/**
 * Dark or light, remembered per device.
 *
 * Asked for by atypicalhero, 2026-09-13. The whole app is written dark-first, and it stays that
 * way: light mode is not a second set of styles but a reassignment of Tailwind v4's colour
 * variables under `[data-theme="light"]` (see the generated block in index.css), so every screen
 * flips at once and no component knows which theme it is in.
 *
 * `dark` is the default and is stamped explicitly rather than left blank, so the attribute is
 * always a statement about what the user chose rather than about what we forgot to set.
 */
interface ThemeState {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
}

export const useTheme = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      setTheme: (theme) => { apply(theme); set({ theme }); },
      toggle: () => get().setTheme(get().theme === 'dark' ? 'light' : 'dark'),
    }),
    {
      name: 'c40k_theme',
      onRehydrateStorage: () => (state) => apply(state?.theme ?? 'dark'),
    },
  ),
);

/**
 * Stamp the choice on <html>, and tell the browser too.
 *
 * `color-scheme` is what makes the form controls, scrollbars and the space outside the page follow
 * the theme — without it a light page keeps dark native widgets and looks half-converted.
 */
function apply(theme: Theme) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.style.colorScheme = theme;
}

// The store rehydrates asynchronously, so stamp whatever is already in storage straight away and
// avoid a flash of the wrong theme on load.
if (typeof localStorage !== 'undefined') {
  try {
    const saved = JSON.parse(localStorage.getItem('c40k_theme') ?? '{}')?.state?.theme;
    apply(saved === 'light' ? 'light' : 'dark');
  } catch { apply('dark'); }
}
