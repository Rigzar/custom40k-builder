import { useCallback, useEffect, useState } from 'react';
import * as api from '../lib/api';

export function useAuth() {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading]    = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await api.getMe();
      setUsername(res.loggedIn ? res.username ?? null : null);
    } catch {
      setUsername(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  async function doLogout() {
    await api.logout();
    setUsername(null);
  }

  return { username, loggedIn: !!username, loading, refresh, logout: doLogout };
}
