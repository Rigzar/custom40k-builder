/** Thin fetch wrappers for the account/cloud-saves backend (api/*.js). Cookie-based session —
 * every call sends credentials so the HttpOnly session cookie round-trips automatically. */

async function call<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `Request failed (${res.status})`);
  return json as T;
}

export interface MeResponse { loggedIn: boolean; username?: string }
export function getMe() {
  return call<MeResponse>('/api/auth/me');
}

export function register(
  username: string, password: string, secretQuestion?: string, secretAnswer?: string,
) {
  return call<{ username: string; recoveryCode: string }>('/api/auth/register', {
    method: 'POST', body: JSON.stringify({ username, password, secretQuestion, secretAnswer }),
  });
}

export function login(username: string, password: string) {
  return call<{ username: string }>('/api/auth/login', {
    method: 'POST', body: JSON.stringify({ username, password }),
  });
}

export function logout() {
  return call<{ ok: true }>('/api/auth/logout', { method: 'POST' });
}

export function resetPassword(
  username: string, recoveryCode: string, newPassword: string, secretAnswer?: string,
) {
  return call<{ recoveryCode: string }>('/api/auth/reset-password', {
    method: 'POST', body: JSON.stringify({ username, recoveryCode, newPassword, secretAnswer }),
  });
}

export type SecretQuestionInfo =
  | { hasSecretQuestion: true; question: string }
  | { hasSecretQuestion: false };

export function getSecretQuestion(username: string) {
  return call<SecretQuestionInfo>(`/api/auth/secret-question?username=${encodeURIComponent(username)}`);
}

export function setSecretQuestion(question: string | null, answer?: string) {
  return call<SecretQuestionInfo>('/api/auth/secret-question', {
    method: 'POST', body: JSON.stringify({ question, answer }),
  });
}

export type RecoveryCodeInfo = { hasCode: true; code: string } | { hasCode: false };
export function getRecoveryCode() {
  return call<RecoveryCodeInfo>('/api/auth/recovery-code');
}

export function requestAccountRecovery(username: string, message: string) {
  return call<{ url: string }>('/api/account-recovery', {
    method: 'POST', body: JSON.stringify({ username, message }),
  });
}

export interface RosterSummary { id: number; name: string; updated_at: string }
export function listRosters() {
  return call<{ rosters: RosterSummary[] }>('/api/rosters');
}

export function saveRoster(name: string, data: unknown) {
  return call<{ roster: RosterSummary }>('/api/rosters', {
    method: 'POST', body: JSON.stringify({ name, data }),
  });
}

export function updateRoster(id: number, fields: { name?: string; data?: unknown }) {
  return call<{ roster: RosterSummary }>(`/api/rosters/${id}`, {
    method: 'PUT', body: JSON.stringify(fields),
  });
}

export function loadRoster(id: number) {
  return call<{ roster: { id: number; name: string; data: unknown; updated_at: string } }>(`/api/rosters/${id}`);
}

export function deleteRoster(id: number) {
  return call<{ ok: true }>(`/api/rosters/${id}`, { method: 'DELETE' });
}

// ── Planetary Assault campaign module (ALPHA) ───────────────────────────────

export interface CampaignSummary {
  id: number; name: string; invite_code: string; factions: string[];
  gm_user_id: number; faction: string | null; role: 'gm' | 'player';
}
export function listCampaigns() {
  return call<{ campaigns: CampaignSummary[] }>('/api/campaign/list');
}

export function createCampaign(name: string, factions: string[]) {
  return call<{ campaign: CampaignSummary }>('/api/campaign/create', {
    method: 'POST', body: JSON.stringify({ name, factions }),
  });
}

export function joinCampaign(inviteCode: string, faction: string) {
  return call<{ campaignId: number }>('/api/campaign/join', {
    method: 'POST', body: JSON.stringify({ inviteCode, faction }),
  });
}

export interface CampaignPlayer { username: string; faction: string | null; role: 'gm' | 'player'; joined_at: string }
export function listCampaignPlayers(campaignId: number) {
  return call<{ players: CampaignPlayer[] }>(`/api/campaign/players?campaignId=${campaignId}`);
}
