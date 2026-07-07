import { useCallback, useEffect, useState } from 'react';
import * as api from '../lib/api';

export function useAuth() {
  const [username, setUsername]       = useState<string | null>(null);
  const [isAdmin, setIsAdmin]         = useState(false);
  const [avatar, setAvatar]           = useState<string | null>(null);
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});
  const [socialPublic, setSocialPublic] = useState(false);
  const [loading, setLoading]          = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await api.getMe();
      setUsername(res.loggedIn ? res.username ?? null : null);
      setIsAdmin(res.loggedIn ? res.isAdmin === true : false);
      setAvatar(res.loggedIn ? res.avatar ?? null : null);
      setSocialLinks(res.loggedIn ? res.socialLinks ?? {} : {});
      setSocialPublic(res.loggedIn ? res.socialPublic === true : false);
    } catch {
      setUsername(null);
      setIsAdmin(false);
      setAvatar(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  async function doLogout() {
    await api.logout();
    setUsername(null);
    setIsAdmin(false);
    setAvatar(null);
    setSocialLinks({});
    setSocialPublic(false);
  }

  return { username, loggedIn: !!username, isAdmin, avatar, socialLinks, socialPublic, loading, refresh, logout: doLogout };
}
