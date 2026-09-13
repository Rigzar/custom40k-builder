import type { Prefs, AutosaveInterval } from '../hooks/usePrefs';
import type { EngagementType } from '../types/army';
import { useT, type TranslationKey } from '../i18n';
import { useTheme } from '../theme';

interface Props {
  prefs: Prefs;
  loggedIn: boolean;
  onSave: (patch: Partial<Prefs>) => void;
  onClose: () => void;
}

const AUTOSAVE_OPTIONS: { value: AutosaveInterval; label: TranslationKey; desc: TranslationKey }[] = [
  { value: 'off',        label: 'prefsAutosaveOff',   desc: 'prefsAutosaveOffDesc' },
  { value: 'close-only', label: 'prefsAutosaveClose', desc: 'prefsAutosaveCloseDesc' },
  { value: '30s',        label: 'prefsAutosave30',    desc: 'prefsAutosave30Desc' },
  { value: '5min',       label: 'prefsAutosave5',     desc: 'prefsAutosave5Desc' },
];

const ENGAGEMENT_OPTIONS: { value: EngagementType | ''; label: TranslationKey }[] = [
  { value: '',         label: 'prefsEngNoDefault' },
  { value: 'skirmish', label: 'prefsEngSkirmish' },
  { value: 'pitched',  label: 'prefsEngPitched' },
  { value: 'epic',     label: 'prefsEngEpic' },
];

const DEFAULT_POINTS_OPTIONS: { value: number | ''; label: string }[] = [
  { value: '', label: '' },   // label filled from i18n (prefsPointsNoDefault)
  { value: 500,  label: '500 pts' },
  { value: 750,  label: '750 pts' },
  { value: 1000, label: '1 000 pts' },
  { value: 1500, label: '1 500 pts' },
  { value: 2000, label: '2 000 pts' },
  { value: 2500, label: '2 500 pts' },
  { value: 3000, label: '3 000 pts' },
];

export function PrefsModal({ prefs, loggedIn, onSave, onClose }: Props) {
  const t = useT();
  // Kept in its own store rather than in `prefs`: the theme has to be applied to <html> before
  // React renders anything, so it cannot wait for a hook to mount.
  const { theme, setTheme } = useTheme();
  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-start justify-center z-50 p-4 overflow-y-auto"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-zinc-900 border-2 border-amber-800 w-full max-w-md my-8">
        <div className="flex justify-between items-center px-4 py-3 bg-zinc-800 border-b border-amber-800">
          <h3 className="text-amber-400 uppercase tracking-widest text-sm">{t('prefsTitle')}</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-xl leading-none">✕</button>
        </div>

        <div className="p-5 space-y-6">

          {/* Appearance — above autosave on purpose: it is the only setting here that applies to
              everyone, signed in or not, and it is the one people come looking for. */}
          <section>
            <div className="text-[11px] uppercase tracking-widest text-amber-600 mb-2">{t('themeLabel')}</div>
            <div className="flex gap-2">
              {(['dark', 'light'] as const).map(v => (
                <button key={v} onClick={() => setTheme(v)}
                        className={`flex-1 py-2 text-[11px] uppercase tracking-wide border transition-colors ${
                          theme === v
                            ? 'bg-amber-800 border-amber-600 text-white'
                            : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-amber-400 hover:border-zinc-600'}`}>
                  {v === 'dark' ? `☾ ${t('themeDark')}` : `☀ ${t('themeLight')}`}
                </button>
              ))}
            </div>
            <p className="text-zinc-500 text-[10px] mt-1.5">{t('themeHint')}</p>
          </section>

          {/* Autosave interval — only for logged-in users */}
          {loggedIn && (
            <section>
              <div className="text-[11px] uppercase tracking-widest text-amber-600 mb-2">{t('prefsCloudAutosave')}</div>
              <div className="space-y-1">
                {AUTOSAVE_OPTIONS.map(opt => (
                  <label key={opt.value} className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="autosave"
                      value={opt.value}
                      checked={prefs.autosaveInterval === opt.value}
                      onChange={() => onSave({ autosaveInterval: opt.value })}
                      className="mt-0.5 accent-amber-500"
                    />
                    <div>
                      <div className="text-sm text-zinc-200 group-hover:text-amber-300 transition-colors">{t(opt.label)}</div>
                      <div className="text-[11px] text-zinc-500">{t(opt.desc)}</div>
                    </div>
                  </label>
                ))}
              </div>
            </section>
          )}

          {/* Default engagement */}
          <section>
            <div className="text-[11px] uppercase tracking-widest text-amber-600 mb-2">{t('prefsDefaultEngagement')}</div>
            <p className="text-[11px] text-zinc-500 mb-2">{t('prefsDefaultEngagementHint')}</p>
            <div className="space-y-1">
              {ENGAGEMENT_OPTIONS.map(opt => (
                <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="engagement"
                    value={opt.value}
                    checked={prefs.defaultEngagement === opt.value}
                    onChange={() => onSave({ defaultEngagement: opt.value as EngagementType | '' })}
                    className="accent-amber-500"
                  />
                  <span className="text-sm text-zinc-200 group-hover:text-amber-300 transition-colors">{t(opt.label)}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Default points */}
          <section>
            <div className="text-[11px] uppercase tracking-widest text-amber-600 mb-2">{t('prefsDefaultPoints')}</div>
            <p className="text-[11px] text-zinc-500 mb-2">{t('prefsDefaultPointsHint')}</p>
            <div className="grid grid-cols-2 gap-1">
              {DEFAULT_POINTS_OPTIONS.map(opt => (
                <label key={String(opt.value)} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="points"
                    value={String(opt.value)}
                    checked={prefs.defaultPoints === opt.value}
                    onChange={() => onSave({ defaultPoints: opt.value as number | '' })}
                    className="accent-amber-500"
                  />
                  <span className="text-sm text-zinc-200 group-hover:text-amber-300 transition-colors">{opt.label || t('prefsPointsNoDefault')}</span>
                </label>
              ))}
            </div>
          </section>

        </div>

        <div className="px-4 py-3 border-t border-zinc-700 flex justify-end bg-zinc-800">
          <button onClick={onClose} className="px-4 py-1.5 bg-zinc-700 border border-zinc-600 text-zinc-200 text-sm hover:bg-zinc-600 uppercase tracking-wide">
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
}
