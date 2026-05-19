import { useState } from 'react';

const CONSENT_KEY = 'custom40k-cookie-consent';

export function CookieBanner() {
  const [visible, setVisible] = useState(() => !localStorage.getItem(CONSENT_KEY));

  function dismiss() {
    localStorage.setItem(CONSENT_KEY, '1');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900 border-t border-zinc-700 px-4 py-3">
      <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-zinc-400 text-[12px] leading-snug text-center sm:text-left">
          This app stores your army rosters in your browser's local storage to save your progress.
          No tracking or advertising cookies are used.{' '}
          <button
            onClick={() => {/* opens cookie policy — handled by footer */}}
            className="text-amber-600 hover:text-amber-400 underline"
          >
            Cookie Policy
          </button>
        </p>
        <button
          onClick={dismiss}
          className="shrink-0 px-5 py-1.5 bg-amber-800 border border-amber-600 text-white text-[12px] uppercase tracking-wide hover:bg-amber-700 transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
