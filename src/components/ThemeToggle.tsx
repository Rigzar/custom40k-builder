import { useTheme } from '../theme';
import { useT } from '../i18n';

/**
 * Dark / light switch. Sits wherever the language selector does, because it is the same kind of
 * choice — how the app is presented to you, not what it contains.
 */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const t = useT();
  const { theme, toggle } = useTheme();
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <button
      onClick={toggle}
      title={t(next === 'light' ? 'themeToLight' : 'themeToDark')}
      aria-label={t(next === 'light' ? 'themeToLight' : 'themeToDark')}
      className={`px-2 py-1 text-[11px] uppercase tracking-wide border transition-colors
        bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-amber-400 hover:border-zinc-600 ${className}`}
    >
      {theme === 'dark' ? '☀' : '☾'}
    </button>
  );
}
