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
  avatar: string | null;
  socialLinks: Record<string, string>;
  socialPublic: boolean;
  loading: boolean;
}

let state: AuthState = {
  username: null, isAdmin: false, avatar: null,
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

/** In-flight de-duplication: three components mounting at once should cause ONE /api/auth/me. */
let inflight: Promise<void> | null = null;
let everFetched = false;

export async function refreshAuth(): Promise<void> {
  if (inflight) return inflight;
  inflight = (async () => {
    try {
      const res = await api.getMe();
      setState({
        username: res.loggedIn ? res.username ?? null : null,
        isAdmin: res.loggedIn ? res.isAdmin === true : false,
        avatar: res.loggedIn ? res.avatar ?? null : null,
        socialLinks: res.loggedIn ? res.socialLinks ?? {} : {},
        socialPublic: res.loggedIn ? res.socialPublic === true : false,
      });
    } catch {
      setState({ username: null, isAdmin: false, avatar: null });
    } finally {
      everFetched = true;
      setState({ loading: false });
      inflight = null;
    }
  })();
  return inflight;
}

export async function logoutAuth(): Promise<void> {
  await api.logout();
  setState({
    username: null, isAdmin: false, avatar: null,
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
