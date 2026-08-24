/** Thin fetch wrappers for the account/cloud-saves backend (api/*.js). Cookie-based session —
 * every call sends credentials so the HttpOnly session cookie round-trips automatically. */
import type { DataOverrides } from '../engine/dataOverrides';
import type { SourceIgnores } from '../engine/sourceCompare';
export type { DataOverride, DataOverrides } from '../engine/dataOverrides';
export type { SourceIgnore, SourceIgnores } from '../engine/sourceCompare';

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

export interface MeResponse {
  loggedIn: boolean; username?: string; isAdmin?: boolean;
  avatar?: string | null; socialLinks?: Record<string, string>; socialPublic?: boolean;
}
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
  return call<{ ok: true; requestId: number }>('/api/account-recovery', {
    method: 'POST', body: JSON.stringify({ username, message }),
  });
}

export function checkRecoveryStatus(username: string, requestId: number) {
  return call<
    | { ok: true; status: 'pending'; created_at: string }
    | { ok: true; status: 'resolved'; tempPassword: string; newRecoveryCode: string; resolved_at: string }
  >(`/api/auth/recovery-status?username=${encodeURIComponent(username)}&requestId=${requestId}`);
}

export interface RecoveryRequest {
  id: number; username: string; message: string | null;
  status: 'pending' | 'resolved' | 'collected'; created_at: string; resolved_at: string | null;
}
export function adminListRecoveryRequests() {
  return call<{ ok: true; requests: RecoveryRequest[] }>('/api/admin/recovery-requests');
}
export function adminResolveRecovery(requestId: number) {
  return call<{ ok: true }>('/api/admin/resolve-recovery', {
    method: 'POST', body: JSON.stringify({ requestId }),
  });
}

export interface RosterSummary {
  id: number; name: string; updated_at: string; total_pts?: number; faction_label?: string;
  is_public?: boolean; source_roster_id?: number | null; source_username?: string | null;
  /** View-only share link token, or null if none has been generated yet. See generateShareLink. */
  share_token?: string | null;
  /** Set when this army was created from a Planetary Assault campaign's Roster tab. */
  campaign_id?: number | null; campaign_faction?: string | null; campaign_visible?: boolean;
}
export interface PublicArmySummary {
  id: number; name: string; updated_at: string; total_pts?: number; faction_label?: string;
  username: string; avatar?: string | null;
  upvotes: number; downvotes: number; user_vote: 1 | -1 | null;
}
export interface UserSearchResult {
  username: string; avatar: string | null; isFriend: boolean; publicArmyCount: number;
  /** I've sent them a request and they haven't answered yet. */
  requestPending: boolean;
  /** They've sent ME a request — adding them back accepts it immediately. */
  theyRequestedMe: boolean;
}
export interface FriendRow { username: string; avatar: string | null; publicArmyCount: number; }
export interface FriendRequestRow { username: string; avatar: string | null; createdAt: string; }
export interface RosterShareUser { username: string; avatar: string | null; }
export interface SharedArmySummary {
  id: number; name: string; updated_at: string; total_pts?: number; faction_label?: string;
  username: string; avatar?: string | null;
}
export function listRosters() {
  return call<{ rosters: RosterSummary[] }>('/api/rosters');
}

export function saveRoster(name: string, data: unknown, campaignId?: number | null, campaignFaction?: string | null) {
  return call<{ roster: RosterSummary }>('/api/rosters', {
    method: 'POST', body: JSON.stringify({ name, data, campaignId: campaignId ?? undefined, campaignFaction: campaignFaction ?? undefined }),
  });
}

export function updateRoster(id: number, fields: { name?: string; data?: unknown }) {
  return call<{ roster: RosterSummary }>(`/api/rosters/${id}`, {
    method: 'PUT', body: JSON.stringify(fields),
  });
}

export function loadRoster(id: number) {
  return call<{ roster: {
    id: number; name: string; data: unknown; updated_at: string;
    campaign_id: number | null; campaign_faction: string | null; campaign_visible: boolean;
  } }>(`/api/rosters/${id}`);
}

export function deleteRoster(id: number) {
  return call<{ ok: true }>(`/api/rosters/${id}`, { method: 'DELETE' });
}

export function toggleRosterPublic(id: number, isPublic: boolean) {
  return call<{ ok: true }>(`/api/rosters/${id}`, { method: 'PUT', body: JSON.stringify({ is_public: isPublic }) });
}

/** Generates (or returns the existing) view-only share link token for a roster — no account
 * needed to view it. Separate from is_public: this doesn't list the army anywhere, it's only
 * reachable by whoever has the exact link. */
export function generateShareLink(id: number) {
  return call<{ ok: true; shareToken: string }>(`/api/rosters/${id}`, { method: 'PUT', body: JSON.stringify({ shareToken: 'generate' }) });
}
/** Kills an existing share link — the only way to invalidate one that's been handed out. */
export function revokeShareLink(id: number) {
  return call<{ ok: true; shareToken: null }>(`/api/rosters/${id}`, { method: 'PUT', body: JSON.stringify({ shareToken: 'revoke' }) });
}
/** PUBLIC, no login required — resolves a share link token to its army data. */
export function getSharedRoster(token: string) {
  return call<{ roster: { name: string; data: Record<string, unknown>; updated_at: string } }>(`/api/rosters?token=${encodeURIComponent(token)}`);
}

// ── Profile / social / friends ───────────────────────────────────────────────

export function updateProfile(patch: { avatar?: string | null; socialLinks?: Record<string, string>; socialPublic?: boolean }) {
  return call<{ ok: true; avatar: string | null; socialLinks: Record<string, string>; socialPublic: boolean }>(
    '/api/profile/update', { method: 'POST', body: JSON.stringify(patch) },
  );
}

export function searchUsers(q: string) {
  return call<{ ok: true; users: UserSearchResult[] }>(`/api/profile/search?q=${encodeURIComponent(q)}`);
}

/** Sends a friend request, or immediately accepts if `username` already requested me. */
export function addFriend(username: string) {
  return call<{ ok: true; status: 'accepted' | 'pending' }>('/api/profile/friend-add', {
    method: 'POST', body: JSON.stringify({ username }),
  });
}

export function removeFriend(username: string) {
  return call<{ ok: true }>('/api/profile/friend-remove', { method: 'POST', body: JSON.stringify({ username }) });
}

/** Accept or reject a friend request that's pending FROM `username` TO me. */
export function respondToFriendRequest(username: string, accept: boolean) {
  return call<{ ok: true; accepted: boolean }>('/api/profile/friend-respond', {
    method: 'POST', body: JSON.stringify({ username, accept }),
  });
}

/** Requests pending FROM other people TO me. */
export function getFriendRequests() {
  return call<{ ok: true; requests: FriendRequestRow[] }>('/api/profile/friend-requests');
}

export function listFriends() {
  return call<{ ok: true; friends: FriendRow[] }>('/api/profile/friends');
}

export function getPublicArmies(type: 'all' | 'friends' = 'all') {
  return call<{ ok: true; armies: PublicArmySummary[] }>(`/api/profile/public-armies?type=${type}`);
}

export function copyPublicArmy(rosterId: number) {
  return call<{ ok: true; roster: RosterSummary }>('/api/profile/copy-army', {
    method: 'POST', body: JSON.stringify({ rosterId }),
  });
}

export function voteArmy(rosterId: number, vote: 1 | -1) {
  return call<{ ok: true; user_vote: 1 | -1 | null }>('/api/profile/vote-army', {
    method: 'POST', body: JSON.stringify({ rosterId, vote }),
  });
}

/** Share one of MY OWN rosters with a specific user — visible to them regardless of is_public. */
export function shareRoster(rosterId: number, username: string) {
  return call<{ ok: true }>('/api/profile/share-roster', {
    method: 'POST', body: JSON.stringify({ rosterId, username }),
  });
}

export function unshareRoster(rosterId: number, username: string) {
  return call<{ ok: true }>('/api/profile/unshare-roster', {
    method: 'POST', body: JSON.stringify({ rosterId, username }),
  });
}

/** Who a roster I own is currently shared with. */
export function getRosterShares(rosterId: number) {
  return call<{ ok: true; sharedWith: RosterShareUser[] }>(`/api/profile/roster-shares?rosterId=${rosterId}`);
}

/** Other people's rosters shared with me. */
export function getSharedWithMe() {
  return call<{ ok: true; armies: SharedArmySummary[] }>('/api/profile/shared-with-me');
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

/** A saved army list created from a campaign's Roster tab — private to its owner and the GM
 * until the GM marks it campaign_visible. */
export interface CampaignArmy {
  id: number; name: string; updated_at: string; campaignFaction: string | null; campaignVisible: boolean;
  isOwn: boolean; username: string; total_pts?: number; faction_label?: string;
}
export function listCampaignArmies(campaignId: number) {
  return call<{ armies: CampaignArmy[] }>(`/api/campaign/army-list?campaignId=${campaignId}`);
}
export function setCampaignArmyVisibility(campaignId: number, rosterId: number, visible: boolean) {
  return call<{ ok: true }>('/api/campaign/army-visibility', {
    method: 'POST', body: JSON.stringify({ campaignId, rosterId, visible }),
  });
}
/** Fire an operational Deathstrike Silo at a target sector — 1D6, 5+ destroys a random building
 * there (v1.11), unless the sector has Void Shields. Each silo can fire once per round. */
export function fireDeathstrikeSilo(campaignId: number, buildingId: number, targetSectorId: number) {
  return call<{ ok: true; roll: number; destroyedBuilding: string | null }>('/api/campaign/deathstrike-fire', {
    method: 'POST', body: JSON.stringify({ campaignId, buildingId, targetSectorId }),
  });
}
/** Tau'va Unification Center's extra positive weekly effect — separate from the normal draw. */
export function drawTauvaBonus(campaignId: number, faction: string) {
  return call<{ ok: true; event: { id: number; event_name: string; event_effect: string } }>('/api/campaign/tauva-bonus-draw', {
    method: 'POST', body: JSON.stringify({ campaignId, faction }),
  });
}
export function listTauvaBonus(campaignId: number) {
  return call<{ ok: true; events: CampaignEvent[] }>(`/api/campaign/tauva-bonus-list?campaignId=${campaignId}`);
}
/** This round's Stratagem usage rows, for computing "X of Y uses left" against a building count.
 * Assassin Temple fieldings are logged here too, with stratagem_key `assassin-<key>` — filter for
 * that prefix rather than calling a separate endpoint. */
export function listStratagemUses(campaignId: number) {
  return call<{ ok: true; uses: { faction: string; stratagem_key: string }[] }>(`/api/campaign/stratagem-uses?campaignId=${campaignId}`);
}
/** Record an Assassin Temple fielding for the faction that controls it (v1.11: up to 4 per round,
 * no repeats). Returns which faction it was attributed to. */
export function useAssassin(campaignId: number, assassinKey: 'callidus' | 'culexus' | 'eversor' | 'vindicare') {
  return call<{ ok: true; assassin: string; faction: string }>('/api/campaign/assassin-use', {
    method: 'POST', body: JSON.stringify({ campaignId, assassinKey }),
  });
}

export type SectorType = 'city' | 'industrial' | 'wasteland' | 'ruin';
export interface CampaignSector {
  id: number; campaign_id: number; name: string; sector_type: SectorType;
  owner_faction: string | null; x: number; y: number;
  /** Won by a Skirmish over an uncontested sector — ownership unchanged, but neither faction can
   * use its Supply or buildings until someone wins a Skirmish/Pitched/Epic there (v1.11). */
  contested?: boolean;
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
  return call<{ ok: true; campaignEnded: boolean }>('/api/campaign/sector-claim', {
    method: 'POST', body: JSON.stringify({ campaignId, sectorId, ownerFaction }),
  });
}

export function advanceTurn(campaignId: number) {
  return call<{ ok: true; current_turn: number; status: string; winner_faction: string | null }>('/api/campaign/turn-advance', {
    method: 'POST', body: JSON.stringify({ campaignId }),
  });
}

export type EngagementType = 'kill-team' | 'skirmish' | 'pitched' | 'epic';
export interface CampaignBattle {
  id: number; turn: number;
  attacker_faction: string; defender_faction: string; winner_faction: string | null;
  engagement_type: EngagementType;
  sector_id: number | null; sector_name: string | null; notes: string | null;
  recorded_at: string;
}
export function logBattle(
  campaignId: number,
  attackerFaction: string, defenderFaction: string, winnerFaction: string | null,
  sectorId: number | null, notes: string,
  engagementType: EngagementType = 'pitched',
) {
  return call<{ ok: true; battleId: number; supplyCostDeducted: number; campaignEnded: boolean }>('/api/campaign/battle-log', {
    method: 'POST', body: JSON.stringify({ campaignId, attackerFaction, defenderFaction, winnerFaction, sectorId, notes, engagementType }),
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
  trait: string | null;
  /** Character models (HQ) only — starts at 25, +5 per engagement, -5 on a 1-3 roll if they die
   * (v1.11 "Character models"). Manually tracked, same as XP. */
  equipment_limit: number;
  /** "After taking part in an Epic battle, a CM may use 'once per army' upgrades" — informational. */
  epic_veteran: boolean;
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
export function updateRosterUnit(campaignId: number, unitId: number, patch: Partial<Pick<CampaignRosterEntry, 'xp' | 'wounds' | 'status' | 'notes' | 'trait'> & { unitName: string; equipmentLimit: number; epicVeteran: boolean }>) {
  return call<{ ok: true; unit: CampaignRosterEntry }>('/api/campaign/roster-update', {
    method: 'POST', body: JSON.stringify({ campaignId, unitId, ...patch }),
  });
}

// ── Buildings ────────────────────────────────────────────────────────────────
export interface CampaignBuilding {
  id: number; campaign_id: number; sector_id: number;
  building_type: string; level: number; is_active: boolean;
  /** The round it becomes operational — "constructions take one campaign round to finish" (v1.11). */
  available_from_turn: number;
  /** The round its level-2 benefit is recognised, separate from available_from_turn so an
   * in-progress upgrade doesn't take the building's existing level-1 effect offline too. */
  level2_from_turn: number;
  sector_name: string; owner_faction: string | null; created_at: string;
}
export function listBuildings(campaignId: number) {
  return call<{ buildings: CampaignBuilding[]; currentTurn: number }>(`/api/campaign/building-list?campaignId=${campaignId}`);
}
export function addBuilding(campaignId: number, sectorId: number, buildingType: string) {
  return call<{ ok: true; building: CampaignBuilding }>('/api/campaign/building-add', {
    method: 'POST', body: JSON.stringify({ campaignId, sectorId, buildingType }),
  });
}
export function upgradeBuilding(campaignId: number, buildingId: number) {
  return call<{ ok: true }>('/api/campaign/building-upgrade', {
    method: 'POST', body: JSON.stringify({ campaignId, buildingId }),
  });
}
export function removeBuilding(campaignId: number, buildingId: number) {
  return call<{ ok: true }>('/api/campaign/building-remove', {
    method: 'POST', body: JSON.stringify({ campaignId, buildingId }),
  });
}

// ── Weekly events ────────────────────────────────────────────────────────────
export interface CampaignEvent {
  id: number; campaign_id: number; faction: string; turn: number;
  event_id: number; event_name: string; event_effect: string;
  resolved: boolean; created_at: string;
}
export interface DrawEventResult {
  ok: true;
  requiresChoice: boolean;
  candidates: { id: number; name: string; effect: string }[] | null;
  event: { id: number; event_name: string; event_effect: string } | null;
}
export function drawEvent(campaignId: number, faction: string) {
  return call<DrawEventResult>('/api/campaign/event-draw', {
    method: 'POST', body: JSON.stringify({ campaignId, faction }),
  });
}
export function confirmEvent(campaignId: number, faction: string, eventId: number) {
  return call<{ ok: true; event: { id: number; event_name: string; event_effect: string } }>('/api/campaign/event-confirm', {
    method: 'POST', body: JSON.stringify({ campaignId, faction, eventId }),
  });
}
export function useStratagem(campaignId: number, faction: string, stratagemKey: string) {
  return call<{ ok: true; supplyCostDeducted: number; newSupply: number | null }>('/api/campaign/stratagem-use', {
    method: 'POST', body: JSON.stringify({ campaignId, faction, stratagemKey }),
  });
}
export function listEvents(campaignId: number, faction?: string) {
  const q = faction ? `&faction=${encodeURIComponent(faction)}` : '';
  return call<{ events: CampaignEvent[] }>(`/api/campaign/event-list?campaignId=${campaignId}${q}`);
}
export function resolveEvent(campaignId: number, eventId: number) {
  return call<{ ok: true }>('/api/campaign/event-resolve', {
    method: 'POST', body: JSON.stringify({ campaignId, eventId }),
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

export interface AdminAction {
  id: number; admin_username: string | null; action: string;
  target_username: string | null; detail: string | null; created_at: string;
}
export function adminActions() {
  return call<{ ok: true; actions: AdminAction[] }>('/api/admin/actions');
}

export interface AdminRosterRow {
  id: number; name: string; is_public: boolean;
  created_at: string; updated_at: string; faction: string | null;
}
export function adminUserRosters(userId: number) {
  return call<{ ok: true; rosters: AdminRosterRow[] }>(`/api/admin/user-rosters?userId=${userId}`);
}
export function adminDelRoster(rosterId: number) {
  return call<{ ok: true }>('/api/admin/del-roster', { method: 'POST', body: JSON.stringify({ rosterId }) });
}
/**
 * Full DB backup. `tables.users` includes password hashes and recovery-code columns — the file is
 * credential material, so it must be stored securely and never shared.
 */
export interface AdminExport {
  exported_at: string;
  full: true;
  warning: string;
  counts: Record<string, number | null>;
  tables: Record<string, unknown[] | null>;
}
export function adminExport() {
  return call<{ ok: true } & AdminExport>('/api/admin/export');
}

// ── App settings (announcement banner + faction availability) ──────────────────
export interface AnnouncementSetting {
  enabled: boolean;
  version: string;
  /** username of the admin who last saved it — shown with the Inquisitor badge on the banner */
  author?: string;
  text: Partial<Record<'en' | 'de' | 'es', { title: string; intro: string; lines: string[]; contrib: string }>>;
}
export type FactionFlags = Record<string, boolean>;
/**
 * Per-faction codex version and readiness, keyed by faction key. Lives in the DB rather than in
 * code so the game's author can publish "Imperial Guard 1.04" himself the moment he ships the
 * document — no commit, no deploy, no waiting for us.
 */
export type CodexStatus = 'complete' | 'testing' | 'inreview' | 'unreviewed';
export type CodexVersions = Record<string, { version: string; status: CodexStatus }>;
/** Per-language map of translation-key → overridden string. */
export type TranslationOverrides = Partial<Record<'en' | 'de' | 'es', Record<string, string>>>;
export interface PublicSettings {
  announcement: AnnouncementSetting | null;
  factionFlags: FactionFlags | null;
  translations: TranslationOverrides | null;
  /** Admin corrections applied on top of the bundled faction data (src/engine/dataOverrides.ts). */
  dataOverrides: DataOverrides | null;
  codexVersions: CodexVersions | null;
}
/** Public, fail-soft — the landing page uses this to override its defaults. */
export function getPublicSettings() {
  return call<{ ok: true } & PublicSettings>('/api/settings');
}
export function adminGetSettings() {
  return call<{ ok: true; settings: { announcement?: AnnouncementSetting; faction_flags?: FactionFlags; translations?: TranslationOverrides; source_sheets?: Record<string, string>; data_overrides?: DataOverrides; source_ignores?: SourceIgnores; codex_versions?: CodexVersions } }>('/api/admin/get-settings');
}
export function adminSetSetting(key: 'announcement' | 'faction_flags' | 'translations' | 'source_sheets' | 'data_overrides' | 'source_ignores' | 'codex_versions', value: unknown) {
  return call<{ ok: true }>('/api/admin/set-setting', { method: 'POST', body: JSON.stringify({ key, value }) });
}
/** Batch-fetch tabs of a public Google Sheet (server proxy) for the source-compare tool. */
export function adminSourceSheets(id: string, sheets: string[]) {
  return call<{ ok: true; data: Record<string, string | null>; fetched: number; total: number }>('/api/admin/source-sheets', { method: 'POST', body: JSON.stringify({ id, sheets }) });
}
/** Best-effort machine translation of short admin strings (announcement editor). */
export function adminTranslate(texts: string[], from: string, to: string) {
  return call<{ ok: true; translations: string[] }>('/api/admin/translate', { method: 'POST', body: JSON.stringify({ texts, from, to }) });
}
/** Reads each faction's Google Sheet's own title ("Chaos Space Marines 1.03") and pulls the
 * version number out, so the Factions tab can flag a version bump instead of it being typed by hand. */
export function adminCheckCodexVersions(ids: Record<string, string>) {
  return call<{ ok: true; results: Record<string, { title: string; version: string | null } | null> }>(
    '/api/admin/codex-versions-check', { method: 'POST', body: JSON.stringify({ ids }) },
  );
}

// ── Direct messages ────────────────────────────────────────────────────────────
export type MessageKind = 'text' | 'friend_request';
export interface Conversation {
  username: string; is_admin: boolean; last: string; lastKind: MessageKind; created_at: string; unread: number;
}
export interface Message {
  id: number; from_user_id: number; body: string; kind: MessageKind; created_at: string; read_at: string | null;
  from_username: string; from_admin: boolean;
}
export function getUnreadCount() {
  return call<{ ok: true; count: number }>('/api/messages/unread');
}
export function getInbox() {
  return call<{ ok: true; conversations: Conversation[] }>('/api/messages/inbox');
}
export function getThread(withUsername: string) {
  return call<{ ok: true; messages: Message[]; other: { username: string; is_admin: boolean } }>(`/api/messages/thread?with=${encodeURIComponent(withUsername)}`);
}
export function sendMessage(to: string, body: string) {
  return call<{ ok: true }>('/api/messages/send', { method: 'POST', body: JSON.stringify({ to, body }) });
}
