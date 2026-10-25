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
type Tx = { ready: string; update: string; updating: string; later: string; offline: string };

const TEXT: Record<Language, Tx> = {
  en: {
    ready: 'A new version is available — it may include codex changes.',
    update: 'Update now',
    updating: 'Updating…',
    later: 'Later',
    offline: 'Ready to work offline.',
  },
  de: {
    ready: 'Eine neue Version ist verfügbar — sie kann Codex-Änderungen enthalten.',
    update: 'Jetzt aktualisieren',
    updating: 'Wird aktualisiert…',
    later: 'Später',
    offline: 'Bereit für die Offline-Nutzung.',
  },
  es: {
    ready: 'Hay una versión nueva — puede incluir cambios de códex.',
    update: 'Actualizar ahora',
    updating: 'Actualizando…',
    later: 'Más tarde',
    offline: 'Listo para funcionar sin conexión.',
  },
  ru: {
    ready: 'Доступна новая версия — она может включать изменения кодекса.',
    update: 'Обновить сейчас',
    updating: 'Обновление…',
    later: 'Позже',
    offline: 'Готово к работе офлайн.',
  },
  ja: {
    ready: '新しいバージョンが利用可能です — コデックスの変更が含まれている場合があります。',
    update: '今すぐ更新',
    updating: '更新中…',
    later: 'あとで',
    offline: 'オフラインで使用する準備ができました。',
  },
};

/**
 * "Later" used to live only in component state, so it was forgotten on every page load: a waiting service worker stays waiting until
 * it is applied, and the prompt came back each time the page was opened, which reads as "it asks to update several times for ONE
 * push" (reported 2026-10-25). Now "Later" snoozes the prompt for a few hours in the browser.
 */
const SNOOZE_KEY = 'c40k_update_snoozed_until';
const SNOOZE_MS = 6 * 60 * 60 * 1000;
const snoozed = () => { try { return Number(localStorage.getItem(SNOOZE_KEY) ?? 0) > Date.now(); } catch { return false; } };
const snooze = () => { try { localStorage.setItem(SNOOZE_KEY, String(Date.now() + SNOOZE_MS)); } catch { /* private window */ } };

export function PwaUpdatePrompt() {
  const { language } = useLanguage();
  const tx = TEXT[language] ?? TEXT.en;
  const [dismissed, setDismissed] = useState(snoozed);
  const [updating, setUpdating] = useState(false);
  // 'same' = the waiting worker is for the build this page already is (no update); 'newer' = a different build; null = not asked yet.
  const [buildCheck, setBuildCheck] = useState<null | { same: boolean; latest: string }>(null);

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

  // A waiting worker is only an UPDATE if the live build differs from the one this page is. Never prompt for the build you run.
  useEffect(() => {
    if (!needRefresh) { setBuildCheck(null); return; }
    const running = document.querySelector('meta[name="c40k-build"]')?.getAttribute('content') ?? '';
    let cancelled = false;
    fetch(`/version.json?t=${Date.now()}`, { cache: 'no-store' })
      .then(r => (r.ok ? r.json() : null))
      .then((v: { build?: string } | null) => {
        if (cancelled) return;
        const latest = v?.build ?? '';
        console.info('[update] waiting worker:', { running, latest });
        setBuildCheck({ same: !!latest && !!running && latest === running, latest });
      })
      .catch(() => { if (!cancelled) setBuildCheck({ same: false, latest: '' }); });   // offline / blocked: ask, as before
    return () => { cancelled = true; };
  }, [needRefresh]);

  // The "ready offline" note is informational — retire it on its own so it never lingers.
  useEffect(() => {
    if (!offlineReady) return;
    const t = setTimeout(() => setOfflineReady(false), 6000);
    return () => clearTimeout(t);
  }, [offlineReady, setOfflineReady]);

  /**
   * Apply the waiting service worker, then make sure the page actually reloads.
   *
   * `updateServiceWorker(true)` tells the waiting worker to skip waiting and reloads when the
   * browser fires `controllerchange`. That event never arrives in two ordinary situations — the
   * waiting worker was already activated (a second tab took it first), or this page has no
   * controller at all — and then nothing happens and the button looks broken. So: show that the
   * click registered, and reload ourselves if the event has not done it for us. A reload is safe
   * to do twice; leaving the user on a stale codex is not.
   */
  async function applyUpdate() {
    if (updating) return;
    setUpdating(true);
    try { localStorage.removeItem(SNOOZE_KEY); } catch { /* ignore */ }
    try { await updateServiceWorker(true); } catch { /* fall through to the reload */ }
    setTimeout(() => window.location.reload(), 1500);
  }

  const realUpdate = needRefresh && !(buildCheck?.same);
  const show = (realUpdate && !dismissed) || offlineReady;
  if (!show) return null;

  return (
    <div
      className="print:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-[200] w-[min(92vw,30rem)]
                 bg-zinc-900 border border-amber-800 shadow-xl px-4 py-3 flex items-center gap-3"
      role="status"
      aria-live="polite"
    >
      <img src="/custom40k-logo.png" alt="" width="28" height="28" className="shrink-0" />
      {realUpdate && !dismissed ? (
        <>
          <span className="text-[12px] text-zinc-200 flex-1 leading-snug">{tx.ready}{buildCheck?.latest ? <span className="text-zinc-500"> ({buildCheck.latest})</span> : null}</span>
          <button
            onClick={applyUpdate}
            disabled={updating}
            className="shrink-0 px-3 py-1.5 bg-amber-800 hover:bg-amber-700 border border-amber-600
                       text-white text-[11px] uppercase tracking-wide transition-colors
                       disabled:opacity-60 disabled:cursor-wait"
          >
            {updating ? tx.updating : tx.update}
          </button>
          <button
            onClick={() => { snooze(); setDismissed(true); }}
            disabled={updating}
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
