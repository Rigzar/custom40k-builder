import { useCallback, useEffect, useSyncExternalStore } from 'react';
import * as api from '../lib/api';

/**
 * Session state, shared by every component that asks for it.
 *
 * This used to be plain `useState` inside the hook, which meant each caller got its OWN copy —
 * App.tsx, LandingPage.tsx and AdminPanel.tsx each held a separate idea of who was logged in.
 * Signing in refreshed only App's copy, so the landing page (where the account button lives) still
 * showed "Log in" until the page was reloaded and every copy re-fetched. Reported 2026-08-16:
 * "si me reconoce pero no entra de una a la cuenta, hay que refrescar la página".
 *
 * Kept as a module-level store rather than a context so the three call sites need no changes, and
 * so the first fetch happens once instead of once per component.
 */
interface AuthState {
  username: string | null;
  isAdmin: boolean;
  /** Limited admin rank ("Interrogator"): translations only, enforced server-side too. */
  isInterrogator: boolean;
  avatar: string | null;
  socialLinks: Record<string, string>;
  socialPublic: boolean;
  loading: boolean;
}

let state: AuthState = {
  username: null, isAdmin: false, isInterrogator: false, avatar: null,
  socialLinks: {}, socialPublic: false, loading: true,
};

const listeners = new Set<() => void>();
function setState(patch: Partial<AuthState>) {
  state = { ...state, ...patch };
  for (const l of listeners) l();
}
function subscribe(l: () => void) {
  listeners.add(l);
  return () => { listeners.delete(l); };
}
/** getSnapshot must return a stable reference — `state` is only replaced when something changes. */
function getSnapshot() { return state; }
/** The current session state outside React (tests, scripts). */
export function getAuthSnapshot() { return state; }

/** In-flight de-duplication: three components mounting at once should cause ONE /api/auth/me. */
let inflight: Promise<void> | null = null;
let everFetched = false;

/** The name this browser last saw logged in. Only a HINT for when /api/auth/me cannot be reached: the cookie is the proof. */
const HINT_KEY = 'c40k_last_user';
function readHint(): string | null { try { return localStorage.getItem(HINT_KEY); } catch { return null; } }
function writeHint(name: string | null) { try { name ? localStorage.setItem(HINT_KEY, name) : localStorage.removeItem(HINT_KEY); } catch { /* private window */ } }

/**
 * Asks the server who is signed in.
 *
 * ONLY a definite answer changes the session: `loggedIn: true` signs the page in, `loggedIn: false` (a 200 from the server) signs it out.
 * An error - the network dropping while the page reloads for an update, a cold serverless start, a 5xx, the database refusing -
 * says nothing about the cookie, which stays valid for 90 days. This used to treat every error as "logged out", so every update
 * (which reloads the page, right when /api/auth/me is most likely to fail) showed players the Log in button, with the session
 * perfectly alive. Now an error is retried a few times with a wait, and if it still fails the last known name stays on screen.
 */
const RETRY_WAITS_MS = [0, 1500, 4000, 10000];
export async function refreshAuth(): Promise<void> {
  if (inflight) return inflight;
  inflight = (async () => {
    let answered = false;
    for (const wait of RETRY_WAITS_MS) {
      if (wait) await new Promise(r => setTimeout(r, wait));
      try {
        const res = await api.getMe();
        setState({
          username: res.loggedIn ? res.username ?? null : null,
          isAdmin: res.loggedIn ? res.isAdmin === true : false,
          isInterrogator: res.loggedIn ? res.isInterrogator === true : false,
          avatar: res.loggedIn ? res.avatar ?? null : null,
          socialLinks: res.loggedIn ? res.socialLinks ?? {} : {},
          socialPublic: res.loggedIn ? res.socialPublic === true : false,
        });
        writeHint(res.loggedIn ? res.username ?? null : null);
        answered = true;
        break;
      } catch { /* try again */ }
    }
    if (!answered && !state.username) {
      // Nobody could be reached. Keep who we last knew rather than showing a Log in button over a live session.
      const hint = readHint();
      if (hint) setState({ username: hint });
      uncertain = true;
    } else uncertain = false;
    everFetched = true;
    setState({ loading: false });
    inflight = null;
  })();
  return inflight;
}

/** True after a check that could not reach the server; the next time the browser is back online or the tab is shown, ask again. */
let uncertain = false;
if (typeof window !== 'undefined') {
  const recheck = () => { if (uncertain && !inflight) void refreshAuth(); };
  window.addEventListener('online', recheck);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') recheck(); });
}

export async function logoutAuth(): Promise<void> {
  await api.logout();
  writeHint(null);
  setState({
    username: null, isAdmin: false, isInterrogator: false, avatar: null,
    socialLinks: {}, socialPublic: false,
  });
}

export function useAuth() {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  // Only the first mount fetches; later mounts read what is already there.
  useEffect(() => { if (!everFetched && !inflight) void refreshAuth(); }, []);
  const refresh = useCallback(() => refreshAuth(), []);
  const logout = useCallback(() => logoutAuth(), []);
  return { ...snap, loggedIn: !!snap.username, refresh, logout };
}
