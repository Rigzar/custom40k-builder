import { useCallback, useEffect, useState } from 'react';
import * as api from '../lib/api';

export function useAuth() {
  const [username, setUsername] = useState<string | null>(null);
  const [isAdmin, setIsAdmin]   = useState(false);
  const [loading, setLoading]    = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await api.getMe();
      setUsername(res.loggedIn ? res.username ?? null : null);
      setIsAdmin(res.loggedIn ? res.isAdmin === true : false);
    } catch {
      setUsername(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  async function doLogout() {
    await api.logout();
    setUsername(null);
    setIsAdmin(false);
  }

  return { username, loggedIn: !!username, isAdmin, loading, refresh, logout: doLogout };
}
