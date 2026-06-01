import { useLanguage, type Language } from '../i18n';

const LANGS: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'de', label: 'DE', flag: '🇩🇪' },
  { code: 'es', label: 'ES', flag: '🇪🇸' },
];

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  return (
    <div className="flex items-center gap-1">
      {LANGS.map(l => (
        <button
          key={l.code}
          onClick={() => setLanguage(l.code)}
          title={l.label}
          className={`px-2 py-1 text-[11px] uppercase tracking-wide border transition-colors
            ${language === l.code
              ? 'bg-amber-800 border-amber-600 text-white'
              : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-amber-400 hover:border-zinc-600'
            }`}
        >
          {l.flag} {l.label}
        </button>
      ))}
    </div>
  );
}
