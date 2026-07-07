import type { Prefs, AutosaveInterval } from '../hooks/usePrefs';
import type { EngagementType } from '../types/army';

interface Props {
  prefs: Prefs;
  loggedIn: boolean;
  onSave: (patch: Partial<Prefs>) => void;
  onClose: () => void;
}

const AUTOSAVE_OPTIONS: { value: AutosaveInterval; label: string; desc: string }[] = [
  { value: 'off',        label: 'Off',           desc: 'No automatic saving' },
  { value: 'close-only', label: 'On close',       desc: 'Only when you close the tab' },
  { value: '30s',        label: 'Every 30 s',     desc: 'After 30 s of inactivity (recommended)' },
  { value: '5min',       label: 'Every 5 min',    desc: 'After 5 min of inactivity' },
];

const ENGAGEMENT_OPTIONS: { value: EngagementType | ''; label: string }[] = [
  { value: '',        label: 'No default (ask each time)' },
  { value: 'skirmish', label: 'Skirmish' },
  { value: 'pitched',  label: 'Pitched Battle' },
  { value: 'epic',     label: 'Epic Battle' },
];

const DEFAULT_POINTS_OPTIONS = [
  { value: '', label: 'No default' },
  { value: 500,  label: '500 pts' },
  { value: 750,  label: '750 pts' },
  { value: 1000, label: '1 000 pts' },
  { value: 1500, label: '1 500 pts' },
  { value: 2000, label: '2 000 pts' },
  { value: 2500, label: '2 500 pts' },
  { value: 3000, label: '3 000 pts' },
];

export function PrefsModal({ prefs, loggedIn, onSave, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-start justify-center z-50 p-4 overflow-y-auto"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-zinc-900 border-2 border-amber-800 w-full max-w-md my-8">
        <div className="flex justify-between items-center px-4 py-3 bg-zinc-800 border-b border-amber-800">
          <h3 className="text-amber-400 uppercase tracking-widest text-sm">Preferences</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-xl leading-none">✕</button>
        </div>

        <div className="p-5 space-y-6">

          {/* Autosave interval — only for logged-in users */}
          {loggedIn && (
            <section>
              <div className="text-[11px] uppercase tracking-widest text-amber-600 mb-2">Cloud autosave</div>
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
                      <div className="text-sm text-zinc-200 group-hover:text-amber-300 transition-colors">{opt.label}</div>
                      <div className="text-[11px] text-zinc-500">{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </section>
          )}

          {/* Default engagement */}
          <section>
            <div className="text-[11px] uppercase tracking-widest text-amber-600 mb-2">Default engagement</div>
            <p className="text-[11px] text-zinc-500 mb-2">Pre-selects the engagement type when you start a new army.</p>
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
                  <span className="text-sm text-zinc-200 group-hover:text-amber-300 transition-colors">{opt.label}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Default points */}
          <section>
            <div className="text-[11px] uppercase tracking-widest text-amber-600 mb-2">Default points limit</div>
            <p className="text-[11px] text-zinc-500 mb-2">Pre-fills the points limit when you start a new army.</p>
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
                  <span className="text-sm text-zinc-200 group-hover:text-amber-300 transition-colors">{opt.label}</span>
                </label>
              ))}
            </div>
          </section>

        </div>

        <div className="px-4 py-3 border-t border-zinc-700 flex justify-end bg-zinc-800">
          <button onClick={onClose} className="px-4 py-1.5 bg-zinc-700 border border-zinc-600 text-zinc-200 text-sm hover:bg-zinc-600 uppercase tracking-wide">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
