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

export interface MeResponse { loggedIn: boolean; username?: string; isAdmin?: boolean }
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

export interface RosterSummary { id: number; name: string; updated_at: string; total_pts?: number; faction_label?: string }
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
  current_turn: number; max_turns: number; sectors_to_win: number;
  status: 'active' | 'finished'; winner_faction: string | null;
}
export function listCampaigns() {
  return call<{ campaigns: CampaignSummary[] }>('/api/campaign/list');
}

export function createCampaign(name: string, factions: string[], maxTurns = 0, sectorsToWin = 0) {
  return call<{ campaign: CampaignSummary }>('/api/campaign/create', {
    method: 'POST', body: JSON.stringify({ name, factions, maxTurns, sectorsToWin }),
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

export type SectorType = 'city' | 'industrial' | 'wasteland' | 'ruin';
export interface CampaignSector {
  id: number; campaign_id: number; name: string; sector_type: SectorType;
  owner_faction: string | null; x: number; y: number;
}
export function listCampaignSectors(campaignId: number) {
  return call<{ sectors: CampaignSector[] }>(`/api/campaign/sector-list?campaignId=${campaignId}`);
}
export function initCampaignSectors(campaignId: number) {
  return call<{ sectors: CampaignSector[] }>('/api/campaign/sector-init', {
    method: 'POST', body: JSON.stringify({ campaignId }),
  });
}
export function renameSector(campaignId: number, sectorId: number, name: string, sectorType: SectorType) {
  return call<{ ok: true }>('/api/campaign/sector-rename', {
    method: 'POST', body: JSON.stringify({ campaignId, sectorId, name, sectorType }),
  });
}
export function claimSector(campaignId: number, sectorId: number, ownerFaction: string | null) {
  return call<{ ok: true }>('/api/campaign/sector-claim', {
    method: 'POST', body: JSON.stringify({ campaignId, sectorId, ownerFaction }),
  });
}

export function advanceTurn(campaignId: number) {
  return call<{ ok: true; current_turn: number; status: string; winner_faction: string | null }>('/api/campaign/turn-advance', {
    method: 'POST', body: JSON.stringify({ campaignId }),
  });
}

export interface CampaignBattle {
  id: number; turn: number;
  attacker_faction: string; defender_faction: string; winner_faction: string | null;
  sector_id: number | null; sector_name: string | null; notes: string | null;
  recorded_at: string;
}
export function logBattle(
  campaignId: number,
  attackerFaction: string, defenderFaction: string, winnerFaction: string | null,
  sectorId: number | null, notes: string,
) {
  return call<{ ok: true; battleId: number }>('/api/campaign/battle-log', {
    method: 'POST', body: JSON.stringify({ campaignId, attackerFaction, defenderFaction, winnerFaction, sectorId, notes }),
  });
}
export function listBattles(campaignId: number) {
  return call<{ battles: CampaignBattle[] }>(`/api/campaign/battle-list?campaignId=${campaignId}`);
}

export interface CampaignSupplyRow { faction: string; amount: number; }
export function listSupply(campaignId: number) {
  return call<{ supply: CampaignSupplyRow[] }>(`/api/campaign/supply-list?campaignId=${campaignId}`);
}
export function adjustSupply(campaignId: number, faction: string, delta: number) {
  return call<{ ok: true; amount: number }>('/api/campaign/supply-adjust', {
    method: 'POST', body: JSON.stringify({ campaignId, faction, delta }),
  });
}

export interface CampaignRosterEntry {
  id: number;
  faction: string;
  unit_name: string;
  unit_slot: string;
  xp: number;
  wounds: number;
  status: 'active' | 'wounded' | 'dead';
  notes: string | null;
  created_at?: string;
}
export function listRoster(campaignId: number) {
  return call<{ roster: CampaignRosterEntry[] }>(`/api/campaign/roster-list?campaignId=${campaignId}`);
}
export function addRosterUnit(campaignId: number, faction: string, unitName: string, unitSlot: string, notes?: string) {
  return call<{ ok: true; unit: CampaignRosterEntry }>('/api/campaign/roster-add', {
    method: 'POST', body: JSON.stringify({ campaignId, faction, unitName, unitSlot, notes }),
  });
}
export function updateRosterUnit(campaignId: number, unitId: number, patch: Partial<Pick<CampaignRosterEntry, 'xp' | 'wounds' | 'status' | 'notes'> & { unitName: string }>) {
  return call<{ ok: true; unit: CampaignRosterEntry }>('/api/campaign/roster-update', {
    method: 'POST', body: JSON.stringify({ campaignId, unitId, ...patch }),
  });
}
export function removeRosterUnit(campaignId: number, unitId: number) {
  return call<{ ok: true }>('/api/campaign/roster-remove', {
    method: 'POST', body: JSON.stringify({ campaignId, unitId }),
  });
}
export function deleteCampaign(campaignId: number, confirmName: string) {
  return call<{ ok: true }>('/api/campaign/delete', {
    method: 'POST', body: JSON.stringify({ campaignId, confirmName }),
  });
}

export interface AdminUserRow {
  id: number; username: string; created_at: string;
  last_seen_at: string | null; last_login_at: string; is_admin: boolean; roster_count: number;
}
export interface AdminStats { totalUsers: number; totalRosters: number; users: AdminUserRow[] }
export function adminStats() { return call<{ ok: true } & AdminStats>('/api/admin/stats'); }
export function adminResetPw(userId: number) {
  return call<{ ok: true; tempPassword: string; recoveryCode: string }>('/api/admin/pw', {
    method: 'POST', body: JSON.stringify({ userId }),
  });
}
export function adminDelUser(userId: number) {
  return call<{ ok: true }>('/api/admin/del', { method: 'POST', body: JSON.stringify({ userId }) });
}
export function adminPromote(userId: number, makeAdmin: boolean) {
  return call<{ ok: true }>('/api/admin/promote', { method: 'POST', body: JSON.stringify({ userId, makeAdmin }) });
}
