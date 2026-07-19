import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useLanguage, type Language } from '../i18n';

/**
 * Service-worker update prompt + first-install confirmation.
 *
 * WHY A PROMPT AND NOT A SILENT AUTO-UPDATE: every faction's points and rules are compiled into
 * the JS bundle, so the cached copy IS the codex. A silent updater would leave someone building a
 * list against yesterday's points with no way to tell, which is the one failure mode this project
 * cannot afford — codex data changes most days. So the app says a new version is ready and lets
 * the player finish what they are doing before reloading.
 *
 * Self-contained strings, same pattern as the landing announcement: this is a two-line widget, not
 * worth adding to the global i18n key union.
 */
type Tx = { ready: string; update: string; later: string; offline: string };

const TEXT: Record<Language, Tx> = {
  en: {
    ready: 'A new version is available — it may include codex changes.',
    update: 'Update now',
    later: 'Later',
    offline: 'Ready to work offline.',
  },
  de: {
    ready: 'Eine neue Version ist verfügbar — sie kann Codex-Änderungen enthalten.',
    update: 'Jetzt aktualisieren',
    later: 'Später',
    offline: 'Bereit für die Offline-Nutzung.',
  },
  es: {
    ready: 'Hay una versión nueva — puede incluir cambios de códex.',
    update: 'Actualizar ahora',
    later: 'Más tarde',
    offline: 'Listo para funcionar sin conexión.',
  },
};

export function PwaUpdatePrompt() {
  const { language } = useLanguage();
  const tx = TEXT[language] ?? TEXT.en;
  const [dismissed, setDismissed] = useState(false);

  const {
    needRefresh: [needRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      // Re-check hourly: a tab left open all evening should still notice a codex push.
      if (registration) setInterval(() => registration.update().catch(() => {}), 60 * 60 * 1000);
    },
  });

  // The "ready offline" note is informational — retire it on its own so it never lingers.
  useEffect(() => {
    if (!offlineReady) return;
    const t = setTimeout(() => setOfflineReady(false), 6000);
    return () => clearTimeout(t);
  }, [offlineReady, setOfflineReady]);

  const show = (needRefresh && !dismissed) || offlineReady;
  if (!show) return null;

  return (
    <div
      className="print:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-[200] w-[min(92vw,30rem)]
                 bg-zinc-900 border border-amber-800 shadow-xl px-4 py-3 flex items-center gap-3"
      role="status"
      aria-live="polite"
    >
      <img src="/custom40k-logo.png" alt="" width="28" height="28" className="shrink-0" />
      {needRefresh && !dismissed ? (
        <>
          <span className="text-[12px] text-zinc-200 flex-1 leading-snug">{tx.ready}</span>
          <button
            onClick={() => updateServiceWorker(true)}
            className="shrink-0 px-3 py-1.5 bg-amber-800 hover:bg-amber-700 border border-amber-600
                       text-white text-[11px] uppercase tracking-wide transition-colors"
          >
            {tx.update}
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="shrink-0 px-2 py-1.5 text-zinc-400 hover:text-zinc-200 text-[11px]
                       uppercase tracking-wide transition-colors"
          >
            {tx.later}
          </button>
        </>
      ) : (
        <span className="text-[12px] text-zinc-300 flex-1">{tx.offline}</span>
      )}
    </div>
  );
}
