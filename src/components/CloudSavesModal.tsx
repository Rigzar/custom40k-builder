import { useEffect, useRef, useState } from 'react';
import * as api from '../lib/api';
import type { PublicArmySummary, FriendRow, UserSearchResult } from '../lib/api';
import { useArmyStore } from '../store/army';
import { resolveUnit, computeUnitPoints, effectiveArchetypeFor } from '../engine/points';
import { usePrefs, type AutosaveInterval } from '../hooks/usePrefs';
import { Avatar } from './Avatar';
import type { EngagementType } from '../types/army';

interface Props {
  username: string;
  avatar?: string | null;
  socialLinks?: Record<string, string>;
  socialPublic?: boolean;
  onClose: () => void;
  onLogout: () => void;
  activeRosterId: number | null;
  onActiveRosterIdChange: (id: number | null) => void;
  onOpenAdmin?: () => void;
  onProfileUpdate?: (patch: { avatar?: string | null; socialLinks?: Record<string, string>; socialPublic?: boolean }) => void;
  onLoadCommunityArmy?: (data: Record<string, unknown>) => void;
  defaultTab?: Tab;
}

type Tab = 'armies' | 'community' | 'friends' | 'preferences' | 'account';

const TAB_LABELS: { key: Tab; label: string }[] = [
  { key: 'armies',      label: 'My Armies' },
  { key: 'community',   label: 'Community' },
  { key: 'friends',     label: 'Friends' },
  { key: 'preferences', label: 'Prefs' },
  { key: 'account',     label: 'Account' },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
}

// ── Armies tab ───────────────────────────────────────────────────────────────

function ArmiesTab({ onClose, activeRosterId, onActiveRosterIdChange }: {
  onClose: () => void;
  activeRosterId: number | null; onActiveRosterIdChange: (id: number | null) => void;
}) {
  const {
    army, engagement, hqMark, archetype, legacy, legacy2, traitPool,
    faction, pointLimit, armyName, importRoster,
    alliedFaction, alliedArchetype, alliedLegacy, alliedTraitPool, alliedHqMark,
  } = useArmyStore();

  const [rosters, setRosters] = useState<api.RosterSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [saving, setSaving]   = useState(false);
  const [newName, setNewName] = useState('');

  const store = useArmyStore();
  const totalPts = store.data
    ? army.reduce((sum, e) => {
        const u = resolveUnit(e, store.data!);
        return sum + (u ? computeUnitPoints(e, u, effectiveArchetypeFor(e, store)) : 0);
      }, 0)
    : 0;

  const stateSnapshot = {
    armyName, faction, engagement, pointLimit, hqMark, archetype, legacy, legacy2, traitPool, army,
    alliedFaction, alliedArchetype, alliedLegacy, alliedTraitPool, alliedHqMark, totalPts,
  };

  async function refresh() {
    setLoading(true);
    try { const res = await api.listRosters(); setRosters(res.rosters); }
    catch (err) { setError((err as Error).message); }
    finally { setLoading(false); }
  }

  useEffect(() => { refresh(); }, []);

  async function handleSaveNew() {
    const name = newName.trim() || armyName.trim() || faction || 'Army';
    setSaving(true); setError('');
    try {
      const res = await api.saveRoster(name, stateSnapshot);
      onActiveRosterIdChange(res.roster.id);
      setNewName('');
      await refresh();
    } catch (err) { setError((err as Error).message); }
    finally { setSaving(false); }
  }

  async function handleOverwrite(id: number) {
    setSaving(true); setError('');
    try {
      const name = armyName.trim() || faction || 'Army';
      await api.updateRoster(id, { name, data: stateSnapshot });
      onActiveRosterIdChange(id);
      await refresh();
    } catch (err) { setError((err as Error).message); }
    finally { setSaving(false); }
  }

  async function handleLoad(id: number) {
    setError('');
    try {
      const res = await api.loadRoster(id);
      importRoster(JSON.stringify(res.roster.data));
      onActiveRosterIdChange(id);
      onClose();
    } catch (err) { setError((err as Error).message); }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this saved army? This cannot be undone.')) return;
    setError('');
    try { await api.deleteRoster(id); await refresh(); }
    catch (err) { setError((err as Error).message); }
  }

  async function handleTogglePublic(id: number, cur: boolean) {
    try { await api.toggleRosterPublic(id, !cur); await refresh(); }
    catch (err) { setError((err as Error).message); }
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-2">
        <input
          value={newName}
          onChange={e => setNewName(e.target.value)}
          placeholder={armyName.trim() || 'Name this save…'}
          className="flex-1 bg-zinc-800 border border-zinc-700 focus:border-amber-700 text-zinc-200 text-sm px-3 py-2 outline-none"
        />
        <button
          disabled={saving}
          onClick={handleSaveNew}
          className="text-[11px] px-3 py-2 bg-amber-800 border border-amber-600 text-white hover:bg-amber-700 disabled:opacity-50 uppercase tracking-wide"
        >
          Save
        </button>
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
      {loading ? (
        <p className="text-zinc-500 text-sm text-center py-6">Loading…</p>
      ) : rosters.length === 0 ? (
        <p className="text-zinc-500 italic text-sm text-center py-8">No cloud saves yet.</p>
      ) : (
        <div className="space-y-2">
          {rosters.map(r => (
            <div key={r.id} className={`bg-zinc-800 border border-zinc-700 border-l-4 p-3 flex items-center gap-3 ${
              r.id === activeRosterId ? 'border-l-amber-500' : r.is_public ? 'border-l-emerald-600' : 'border-l-zinc-600'
            }`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-zinc-100 truncate">
                    {r.name}
                    {r.id === activeRosterId && <span className="ml-2 text-[10px] text-amber-500 normal-case">(open)</span>}
                  </span>
                  {r.source_username && (
                    <span className="text-[10px] text-zinc-600 shrink-0">copy of {r.source_username}</span>
                  )}
                </div>
                {r.faction_label && (
                  <div className="text-[10px] text-amber-700 uppercase tracking-wide mt-0.5">{r.faction_label}</div>
                )}
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[11px] text-zinc-500">{r.total_pts != null ? `${r.total_pts} pts · ` : ''}{formatDate(r.updated_at)}</span>
                  <button
                    onClick={() => handleTogglePublic(r.id, r.is_public ?? false)}
                    className={`text-[10px] px-1.5 py-0.5 border uppercase tracking-wide transition-colors ${
                      r.is_public
                        ? 'border-emerald-700/60 text-emerald-500 hover:text-red-400 hover:border-red-700/50'
                        : 'border-zinc-700 text-zinc-600 hover:text-zinc-300'
                    }`}
                    title={r.is_public ? 'Public — click to make private' : 'Private — click to share'}
                  >
                    {r.is_public ? '🌐 Public' : '🔒 Private'}
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button onClick={() => handleLoad(r.id)} className="text-[11px] px-2.5 py-1.5 bg-amber-900/40 border border-amber-700 text-amber-400 hover:bg-amber-800/50 uppercase tracking-wide">Load</button>
                <button disabled={saving} onClick={() => handleOverwrite(r.id)} className="text-[11px] px-2.5 py-1.5 bg-zinc-700 border border-zinc-600 text-zinc-300 hover:bg-zinc-600 disabled:opacity-50 uppercase tracking-wide">Save</button>
                <button onClick={() => handleDelete(r.id)} className="text-zinc-600 hover:text-red-400 text-xl leading-none">×</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Community tab ────────────────────────────────────────────────────────────

function CommunityTab({ loggedIn, onClose, onLoadCommunityArmy }: {
  loggedIn: boolean;
  onClose: () => void;
  onLoadCommunityArmy?: (data: Record<string, unknown>) => void;
}) {
  const [filter, setFilter] = useState<'all' | 'friends'>('all');
  const [armies, setArmies] = useState<PublicArmySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copying, setCopying] = useState<number | null>(null);
  const [copied, setCopied] = useState<number | null>(null);

  async function load(type: 'all' | 'friends') {
    setLoading(true); setError('');
    try { const res = await api.getPublicArmies(type); setArmies(res.armies); }
    catch (err) { setError((err as Error).message); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(filter); }, [filter]);

  async function handleCopy(army: PublicArmySummary) {
    if (!loggedIn) return;
    setCopying(army.id); setError('');
    try {
      await api.copyPublicArmy(army.id);
      setCopied(army.id);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) { setError((err as Error).message); }
    finally { setCopying(null); }
  }

  async function handleLoad(army: PublicArmySummary) {
    try {
      const res = await api.loadRoster(army.id);
      if (onLoadCommunityArmy) {
        onLoadCommunityArmy(res.roster.data as Record<string, unknown>);
      } else {
        onClose();
      }
    } catch (err) { setError((err as Error).message); }
  }

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-[11px] text-zinc-500">Community armies — view and copy</div>
        {loggedIn && (
          <div className="flex gap-1">
            {(['all', 'friends'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-[10px] px-2.5 py-1 uppercase tracking-wide border transition-colors ${
                  filter === f ? 'bg-amber-900/40 border-amber-700 text-amber-400' : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {f === 'all' ? 'All' : 'Friends'}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
      {loading ? (
        <p className="text-zinc-500 text-sm text-center py-6">Loading…</p>
      ) : armies.length === 0 ? (
        <p className="text-zinc-500 italic text-sm text-center py-8">
          {filter === 'friends' ? 'No public armies from your friends yet.' : 'No public armies yet.'}
        </p>
      ) : (
        <div className="space-y-2">
          {armies.map(a => (
            <div key={a.id} className="bg-zinc-800 border border-zinc-700 border-l-4 border-l-zinc-600 p-3 flex items-center gap-3">
              <Avatar username={a.username} avatar={a.avatar} size={30} />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-zinc-100 font-semibold truncate">{a.name}</div>
                <div className="text-[10px] text-zinc-500">
                  <span className="text-amber-700">{a.username}</span>
                  {a.faction_label ? ` · ${a.faction_label}` : ''}
                  {a.total_pts != null ? ` · ${a.total_pts} pts` : ''}
                  <span className="ml-1">· {formatDate(a.updated_at)}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleLoad(a)}
                  className="text-[11px] px-2 py-1 border border-zinc-600 text-zinc-400 hover:text-zinc-200 uppercase tracking-wide"
                  title="Load (view only — not saved to your account)"
                >
                  View
                </button>
                {loggedIn && (
                  <button
                    onClick={() => handleCopy(a)}
                    disabled={copying === a.id}
                    className="text-[11px] px-2 py-1 bg-amber-900/30 border border-amber-800 text-amber-400 hover:bg-amber-800/40 disabled:opacity-50 uppercase tracking-wide"
                  >
                    {copied === a.id ? '✓ Copied' : copying === a.id ? '…' : 'Copy'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {!loggedIn && (
        <p className="text-[11px] text-zinc-600 text-center mt-2">Log in to copy armies to your account.</p>
      )}
    </div>
  );
}

// ── Friends tab ──────────────────────────────────────────────────────────────

function FriendsTab() {
  const [friends, setFriends] = useState<FriendRow[]>([]);
  const [search, setSearch]   = useState('');
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [busy, setBusy]       = useState('');
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function loadFriends() {
    setLoading(true);
    try { const r = await api.listFriends(); setFriends(r.friends); }
    catch (err) { setError((err as Error).message); }
    finally { setLoading(false); }
  }

  useEffect(() => { loadFriends(); }, []);

  function onSearchChange(v: string) {
    setSearch(v);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (v.trim().length < 2) { setResults([]); return; }
    searchTimer.current = setTimeout(async () => {
      setSearching(true);
      try { const r = await api.searchUsers(v.trim()); setResults(r.users); }
      catch { setResults([]); }
      finally { setSearching(false); }
    }, 400);
  }

  async function handleAdd(username: string) {
    setBusy(username); setError('');
    try { await api.addFriend(username); await loadFriends(); setResults(r => r.map(u => u.username === username ? { ...u, isFriend: true } : u)); }
    catch (err) { setError((err as Error).message); }
    finally { setBusy(''); }
  }

  async function handleRemove(username: string) {
    setBusy(username); setError('');
    try { await api.removeFriend(username); await loadFriends(); setResults(r => r.map(u => u.username === username ? { ...u, isFriend: false } : u)); }
    catch (err) { setError((err as Error).message); }
    finally { setBusy(''); }
  }

  return (
    <div className="p-4 space-y-4">
      {/* Search */}
      <div>
        <input
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search players by username…"
          className="w-full bg-zinc-800 border border-zinc-700 focus:border-amber-700 text-zinc-200 text-sm px-3 py-2 outline-none"
        />
        {searching && <p className="text-zinc-500 text-xs mt-1">Searching…</p>}
        {results.length > 0 && (
          <div className="mt-2 space-y-1.5">
            {results.map(u => (
              <div key={u.username} className="flex items-center gap-3 bg-zinc-800 border border-zinc-700 px-3 py-2">
                <Avatar username={u.username} avatar={u.avatar} size={28} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-zinc-200">{u.username}</div>
                  {u.publicArmyCount > 0 && (
                    <div className="text-[10px] text-zinc-500">{u.publicArmyCount} public {u.publicArmyCount === 1 ? 'army' : 'armies'}</div>
                  )}
                </div>
                <button
                  disabled={busy === u.username}
                  onClick={() => u.isFriend ? handleRemove(u.username) : handleAdd(u.username)}
                  className={`text-[11px] px-2.5 py-1 border uppercase tracking-wide disabled:opacity-50 transition-colors ${
                    u.isFriend
                      ? 'border-red-900/50 text-red-600 hover:text-red-400 hover:border-red-700'
                      : 'border-amber-800 text-amber-600 hover:text-amber-400 hover:border-amber-600'
                  }`}
                >
                  {u.isFriend ? 'Remove' : '+ Add'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      {/* Friends list */}
      <div>
        <div className="text-[11px] uppercase tracking-widest text-zinc-600 mb-2">
          {loading ? 'Loading…' : friends.length === 0 ? 'No friends yet — search above to add players' : `${friends.length} friend${friends.length !== 1 ? 's' : ''}`}
        </div>
        <div className="space-y-1.5">
          {friends.map(f => (
            <div key={f.username} className="flex items-center gap-3 bg-zinc-800/50 border border-zinc-700 px-3 py-2">
              <Avatar username={f.username} avatar={f.avatar} size={28} />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-zinc-200">{f.username}</div>
                {f.publicArmyCount > 0 && (
                  <div className="text-[10px] text-zinc-500">{f.publicArmyCount} public {f.publicArmyCount === 1 ? 'army' : 'armies'}</div>
                )}
              </div>
              <button
                disabled={busy === f.username}
                onClick={() => handleRemove(f.username)}
                className="text-zinc-600 hover:text-red-400 text-sm disabled:opacity-50"
                title="Remove friend"
              >×</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Preferences tab ──────────────────────────────────────────────────────────

const AUTOSAVE_OPTIONS: { value: AutosaveInterval; label: string; desc: string }[] = [
  { value: 'off',        label: 'Off',         desc: 'No automatic saving' },
  { value: 'close-only', label: 'On close',     desc: 'Only when you close the tab' },
  { value: '30s',        label: 'Every 30 s',   desc: 'After 30 s of inactivity (recommended)' },
  { value: '5min',       label: 'Every 5 min',  desc: 'After 5 min of inactivity' },
];

const ENGAGEMENT_OPTIONS: { value: EngagementType | ''; label: string }[] = [
  { value: '',         label: 'No default' },
  { value: 'skirmish', label: 'Skirmish' },
  { value: 'pitched',  label: 'Pitched Battle' },
  { value: 'epic',     label: 'Epic Battle' },
];

const DEFAULT_POINTS_OPTIONS = [
  { value: '' as const,  label: 'No default' },
  { value: 500,  label: '500 pts' }, { value: 750,  label: '750 pts' },
  { value: 1000, label: '1 000 pts' }, { value: 1500, label: '1 500 pts' },
  { value: 2000, label: '2 000 pts' }, { value: 2500, label: '2 500 pts' },
  { value: 3000, label: '3 000 pts' },
];

function PrefsTab() {
  const { prefs, setPrefs } = usePrefs();
  return (
    <div className="p-5 space-y-5">
      <section>
        <div className="text-[11px] uppercase tracking-widest text-amber-600 mb-1">Cloud autosave</div>
        <p className="text-[11px] text-zinc-500 mb-3">How often your army is saved automatically while building.</p>
        <div className="space-y-2">
          {AUTOSAVE_OPTIONS.map(opt => (
            <label key={opt.value} className="flex items-start gap-3 cursor-pointer group">
              <input type="radio" name="autosave" value={opt.value} checked={prefs.autosaveInterval === opt.value}
                onChange={() => setPrefs({ autosaveInterval: opt.value })} className="mt-0.5 accent-amber-500" />
              <div>
                <div className="text-sm text-zinc-200 group-hover:text-amber-300 transition-colors">{opt.label}</div>
                <div className="text-[11px] text-zinc-500">{opt.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </section>
      <div className="border-t border-zinc-800" />
      <section>
        <div className="text-[11px] uppercase tracking-widest text-amber-600 mb-1">Default engagement</div>
        <div className="space-y-2">
          {ENGAGEMENT_OPTIONS.map(opt => (
            <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
              <input type="radio" name="engagement" value={opt.value} checked={prefs.defaultEngagement === opt.value}
                onChange={() => setPrefs({ defaultEngagement: opt.value as EngagementType | '' })} className="accent-amber-500" />
              <span className="text-sm text-zinc-200 group-hover:text-amber-300 transition-colors">{opt.label}</span>
            </label>
          ))}
        </div>
      </section>
      <div className="border-t border-zinc-800" />
      <section>
        <div className="text-[11px] uppercase tracking-widest text-amber-600 mb-1">Default points limit</div>
        <div className="grid grid-cols-2 gap-1.5">
          {DEFAULT_POINTS_OPTIONS.map(opt => (
            <label key={String(opt.value)} className="flex items-center gap-2 cursor-pointer group">
              <input type="radio" name="points" value={String(opt.value)} checked={prefs.defaultPoints === opt.value}
                onChange={() => setPrefs({ defaultPoints: opt.value as number | '' })} className="accent-amber-500" />
              <span className="text-sm text-zinc-200 group-hover:text-amber-300 transition-colors">{opt.label}</span>
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}

// ── Account tab ──────────────────────────────────────────────────────────────

const AVATAR_GROUPS: { label: string; items: { key: string; label: string }[] }[] = [
  { label: 'Space Marines', items: [
    { key: 'faction-symbols/space-marines',   label: 'Space Marines' },
    { key: 'legion-symbols/blood-angels',     label: 'Blood Angels' },
    { key: 'legion-symbols/dark-angels',      label: 'Dark Angels' },
    { key: 'legion-symbols/imperial-fists',   label: 'Imperial Fists' },
    { key: 'legion-symbols/black-templars',   label: 'Black Templars' },
    { key: 'legion-symbols/white-scars',      label: 'White Scars' },
    { key: 'legion-symbols/space-wolves',     label: 'Space Wolves' },
    { key: 'legion-symbols/blood-ravens',     label: 'Blood Ravens' },
    { key: 'legion-symbols/deathwatch',       label: 'Deathwatch' },
  ]},
  { label: 'Chaos Space Marines', items: [
    { key: 'faction-symbols/chaos-space-marines', label: 'Chaos SM' },
    { key: 'legion-symbols/black-legion',     label: 'Black Legion' },
    { key: 'legion-symbols/alpha-legion',     label: 'Alpha Legion' },
    { key: 'legion-symbols/iron-warriors',    label: 'Iron Warriors' },
    { key: 'legion-symbols/night-lords',      label: 'Night Lords' },
    { key: 'legion-symbols/word-bearers',     label: 'Word Bearers' },
    { key: 'legion-symbols/world-eaters',     label: 'World Eaters' },
    { key: 'legion-symbols/death-guard',      label: 'Death Guard' },
    { key: 'legion-symbols/thousand-sons',    label: 'Thousand Sons' },
    { key: 'legion-symbols/emperors-children',label: "Emperor's Children" },
  ]},
  { label: 'Chaos Daemons', items: [
    { key: 'faction-symbols/chaos-daemons',   label: 'Chaos Daemons' },
    { key: 'legion-symbols/khorne-god',       label: 'Khorne' },
    { key: 'legion-symbols/nurgle-god',       label: 'Nurgle' },
    { key: 'legion-symbols/slaanesh-god',     label: 'Slaanesh' },
    { key: 'legion-symbols/tzeentch-god',     label: 'Tzeentch' },
  ]},
  { label: 'Imperial Guard', items: [
    { key: 'faction-symbols/imperial-guard',        label: 'Imperial Guard' },
    { key: 'legion-symbols/ig-catachan',            label: 'Catachan' },
    { key: 'legion-symbols/ig-brood-brothers',      label: 'Brood Brothers' },
    { key: 'legion-symbols/ig-lost-and-damned',     label: 'Lost & Damned' },
    { key: 'legion-symbols/ig-gueVesa',             label: "Gue'vesa" },
    { key: 'legion-symbols/renegade-and-heretics',  label: 'Renegades' },
  ]},
  { label: 'Adeptus Mechanicus', items: [
    { key: 'faction-symbols/adeptus-mechanicus',      label: 'AdMech' },
    { key: 'legion-symbols/admech-mars',              label: 'Mars' },
    { key: 'legion-symbols/admech-lucius',            label: 'Lucius' },
    { key: 'legion-symbols/admech-ryza',              label: 'Ryza' },
    { key: 'legion-symbols/admech-metalica',          label: 'Metalica' },
    { key: 'legion-symbols/admech-graia',             label: 'Graia' },
    { key: 'legion-symbols/admech-agripinaa',         label: 'Agripinaa' },
    { key: 'legion-symbols/admech-stygies-viii',      label: 'Stygies VIII' },
    { key: 'legion-symbols/admech-cybernetica',       label: 'Cybernetica' },
    { key: 'legion-symbols/admech-dark-mechanicum',   label: 'Dark Mech' },
    { key: 'legion-symbols/admech-collegia-titanica', label: 'Titanica' },
  ]},
  { label: 'Adeptus Sororitas', items: [
    { key: 'faction-symbols/adeptus-sororitas',           label: 'Sororitas' },
    { key: 'legion-symbols/sororitas-sacred-rose',        label: 'Sacred Rose' },
    { key: 'legion-symbols/sororitas-valorous-heart',     label: 'Valorous Heart' },
    { key: 'legion-symbols/sororitas-ebon-chalice',       label: 'Ebon Chalice' },
    { key: 'legion-symbols/sororitas-argent-shroud',      label: 'Argent Shroud' },
    { key: 'legion-symbols/sororitas-our-martyred-lady',  label: 'Martyred Lady' },
    { key: 'legion-symbols/sororitas-bloody-rose',        label: 'Bloody Rose' },
  ]},
  { label: 'Eldar', items: [
    { key: 'faction-symbols/eldar',           label: 'Eldar' },
    { key: 'legion-symbols/eldar-iyanden',    label: 'Iyanden' },
    { key: 'legion-symbols/eldar-saim-hann',  label: 'Saim-Hann' },
    { key: 'legion-symbols/eldar-biel-tan',   label: 'Biel-Tan' },
    { key: 'legion-symbols/eldar-alaitoc',    label: 'Alaitoc' },
    { key: 'legion-symbols/eldar-altansar',   label: 'Altansar' },
    { key: 'legion-symbols/ynnari',           label: 'Ynnari' },
  ]},
  { label: 'Harlequins',       items: [{ key: 'faction-symbols/harlequins',       label: 'Harlequins' }] },
  { label: 'Dark Eldar',       items: [{ key: 'faction-symbols/dark-eldar',        label: 'Dark Eldar' }] },
  { label: 'Tau Empire', items: [
    { key: 'faction-symbols/tau-empire',      label: 'Tau Empire' },
    { key: 'legion-symbols/tau-farsight',     label: 'Farsight' },
    { key: 'legion-symbols/tau-kroot',        label: 'Kroot' },
  ]},
  { label: 'Orks', items: [
    { key: 'faction-symbols/orks',            label: 'Orks' },
    { key: 'legion-symbols/orks-goffs',       label: 'Goffs' },
    { key: 'legion-symbols/orks-bad-moons',   label: 'Bad Moons' },
    { key: 'legion-symbols/orks-snakebites',  label: 'Snakebites' },
    { key: 'legion-symbols/orks-evil-sunz',   label: 'Evil Sunz' },
    { key: 'legion-symbols/orks-blood-axes',  label: 'Blood Axes' },
    { key: 'legion-symbols/orks-deathskulls', label: 'Deathskulls' },
  ]},
  { label: 'Necrons',           items: [
    { key: 'faction-symbols/necrons',         label: 'Necrons' },
    { key: 'legion-symbols/necrons-ctan',     label: "C'tan" },
  ]},
  { label: 'Tyranids',          items: [{ key: 'faction-symbols/tyranids',          label: 'Tyranids' }] },
  { label: 'Genestealer Cults', items: [{ key: 'faction-symbols/genestealer-cults', label: 'GSC' }] },
  { label: 'Grey Knights',      items: [{ key: 'faction-symbols/grey-knights',      label: 'Grey Knights' }] },
  { label: 'Adeptus Custodes',  items: [{ key: 'faction-symbols/adeptus-custodes',  label: 'Custodes' }] },
  { label: 'Inquisition',       items: [{ key: 'faction-symbols/inquisition',       label: 'Inquisition' }] },
  { label: 'Assassins',         items: [{ key: 'faction-symbols/assassins',         label: 'Assassins' }] },
  { label: 'Leagues of Votann', items: [{ key: 'faction-symbols/leagues-of-votann', label: 'Votann' }] },
  { label: 'Supplements', items: [
    { key: 'faction-symbols/horus-heresy',    label: 'Horus Heresy' },
    { key: 'faction-symbols/escalation',      label: 'Escalation' },
    { key: 'legion-symbols/skull-01',         label: 'Skull' },
  ]},
];

const AVATAR_PALETTE = [
  { label: 'White',  hex: '#ffffff' },
  { label: 'Gold',   hex: '#d4af37' },
  { label: 'Red',    hex: '#ef4444' },
  { label: 'Blue',   hex: '#3b82f6' },
  { label: 'Green',  hex: '#22c55e' },
  { label: 'Purple', hex: '#a855f7' },
  { label: 'Orange', hex: '#f97316' },
  { label: 'Cyan',   hex: '#06b6d4' },
  { label: 'Pink',   hex: '#f43f5e' },
  { label: 'Bone',   hex: '#e8dcc8' },
];

const SOCIAL_PLATFORMS: { key: string; label: string; placeholder: string }[] = [
  { key: 'discord',   label: 'Discord',   placeholder: 'username' },
  { key: 'twitter',   label: 'X / Twitter', placeholder: '@handle' },
  { key: 'instagram', label: 'Instagram', placeholder: '@handle' },
  { key: 'twitch',    label: 'Twitch',    placeholder: 'handle' },
  { key: 'youtube',   label: 'YouTube',   placeholder: 'channel' },
  { key: 'reddit',    label: 'Reddit',    placeholder: 'u/handle' },
  { key: 'github',    label: 'GitHub',    placeholder: 'username' },
];

function AccountTab({ username, avatar: initAvatar, socialLinks: initLinks, socialPublic: initPublic, onLogout, onClose, onProfileUpdate }: {
  username: string;
  avatar?: string | null;
  socialLinks?: Record<string, string>;
  socialPublic?: boolean;
  onLogout: () => void;
  onClose: () => void;
  onProfileUpdate?: (patch: { avatar?: string | null; socialLinks?: Record<string, string>; socialPublic?: boolean }) => void;
}) {
  // Avatar state: faction key + tint color, OR custom image, OR null (initials)
  const initParsed = (() => {
    const av = initAvatar;
    if (!av) return { key: null as string|null, color: '#d4af37', custom: null as string|null };
    if (av.startsWith('data:')) return { key: null as string|null, color: '#d4af37', custom: av };
    const hi = av.indexOf('#');
    if (hi >= 0) return { key: av.slice(0, hi), color: av.slice(hi), custom: null as string|null };
    return { key: av, color: '#ffffff', custom: null as string|null };
  })();
  const [selKey,    setSelKey]    = useState<string|null>(initParsed.key);
  const [selColor,  setSelColor]  = useState(initParsed.color);
  const [selCustom, setSelCustom] = useState<string|null>(initParsed.custom);
  const curAvatar = selCustom ?? (selKey ? `${selKey}${selColor}` : null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initGroup = AVATAR_GROUPS.find(g => g.items.some(i => i.key === selKey))?.label;
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(initGroup ? [initGroup] : []));
  function toggleGroup(label: string) {
    setExpandedGroups(prev => { const n = new Set(prev); n.has(label) ? n.delete(label) : n.add(label); return n; });
  }

  const [links, setLinks]           = useState<Record<string, string>>(initLinks ?? {});
  const [linksPublic, setLinksPublic] = useState(initPublic ?? false);
  const [saving, setSaving]         = useState(false);
  const [msg, setMsg]               = useState('');

  // Security
  const [showSecurity, setShowSecurity]   = useState(false);
  const [recoveryCode, setRecoveryCode]   = useState<string | null>(null);
  const [codeRevealed, setCodeRevealed]   = useState(false);
  const [codeLoading, setCodeLoading]     = useState(false);
  const [secQuestion, setSecQuestion]     = useState<string | null>(null);
  const [editQuestion, setEditQuestion]   = useState('');
  const [editAnswer, setEditAnswer]       = useState('');
  const [secBusy, setSecBusy]             = useState(false);
  const [secError, setSecError]           = useState('');
  const [secMsg, setSecMsg]               = useState('');

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    e.target.value = '';
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 128;
        const ctx = canvas.getContext('2d')!;
        const min = Math.min(img.width, img.height);
        ctx.drawImage(img, (img.width - min) / 2, (img.height - min) / 2, min, min, 0, 0, 128, 128);
        const dataURL = canvas.toDataURL('image/jpeg', 0.75);
        if (dataURL.length > 180000) { setMsg('Image too large after compression. Try a smaller or lower-res file.'); return; }
        setSelCustom(dataURL); setSelKey(null);
      };
      img.src = ev.target!.result as string;
    };
    reader.readAsDataURL(file);
  }

  async function handleSaveProfile() {
    setSaving(true); setMsg('');
    try {
      const res = await api.updateProfile({ avatar: curAvatar, socialLinks: links, socialPublic: linksPublic });
      onProfileUpdate?.({ avatar: res.avatar, socialLinks: res.socialLinks, socialPublic: res.socialPublic });
      setMsg('Saved!');
      setTimeout(() => setMsg(''), 2000);
    } catch (err) { setMsg((err as Error).message); }
    finally { setSaving(false); }
  }

  async function loadSecurity() {
    setCodeLoading(true);
    try {
      const codeRes = await api.getRecoveryCode();
      setRecoveryCode(codeRes.hasCode ? codeRes.code : null);
      const qRes = await api.getSecretQuestion(username);
      setSecQuestion(qRes.hasSecretQuestion ? qRes.question : null);
    } catch (err) { setSecError((err as Error).message); }
    finally { setCodeLoading(false); }
  }

  function toggleSecurity() {
    const next = !showSecurity;
    setShowSecurity(next);
    if (next && recoveryCode === null && secQuestion === null) loadSecurity();
  }

  async function handleSaveSecretQuestion() {
    setSecBusy(true); setSecError(''); setSecMsg('');
    try {
      if (!editQuestion.trim()) {
        await api.setSecretQuestion(null);
        setSecQuestion(null);
      } else {
        if (!editAnswer.trim()) { setSecError('Answer is required.'); return; }
        await api.setSecretQuestion(editQuestion.trim(), editAnswer.trim());
        setSecQuestion(editQuestion.trim());
      }
      setEditQuestion(''); setEditAnswer('');
      setSecMsg('Saved!');
      setTimeout(() => setSecMsg(''), 2000);
    } catch (err) { setSecError((err as Error).message); }
    finally { setSecBusy(false); }
  }

  return (
    <div className="p-4 space-y-5">
      {/* Avatar */}
      <section>
        <div className="text-[11px] uppercase tracking-widest text-amber-600 mb-2">Avatar</div>
        <div className="flex items-center gap-3 mb-3">
          <Avatar username={username} avatar={curAvatar} size={44} />
          <div className="text-sm text-zinc-200 font-semibold">{username}</div>
          {selCustom && (
            <button onClick={() => setSelCustom(null)} className="text-[10px] text-zinc-500 hover:text-red-400 underline underline-offset-2 ml-auto">Remove image</button>
          )}
        </div>

        {/* Color palette — shown when a faction symbol is selected */}
        {selKey && !selCustom && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wide shrink-0">Color</span>
            <div className="flex flex-wrap gap-1.5">
              {AVATAR_PALETTE.map(c => (
                <button key={c.hex} onClick={() => setSelColor(c.hex)} title={c.label}
                  className={`w-5 h-5 rounded-full border-2 transition-transform ${selColor === c.hex ? 'border-amber-400 scale-110' : 'border-transparent hover:border-zinc-400'}`}
                  style={{ background: c.hex }} />
              ))}
            </div>
          </div>
        )}

        {/* Faction symbol picker — grouped, collapsible */}
        <div className="border border-zinc-800 mb-3">
          {/* "None" row */}
          <button
            onClick={() => { setSelKey(null); setSelCustom(null); }}
            className={`w-full flex items-center gap-2 px-2 py-1.5 text-[11px] text-left transition-colors ${
              !selKey && !selCustom ? 'bg-amber-900/30 text-amber-400' : 'text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            <Avatar username={username} avatar={null} size={20} />
            <span>None (initials)</span>
          </button>
          <div className="border-t border-zinc-800" />
          {AVATAR_GROUPS.map(group => {
            const open = expandedGroups.has(group.label);
            const groupHasSel = group.items.some(i => i.key === selKey) && !selCustom;
            return (
              <div key={group.label} className="border-t border-zinc-800 first:border-t-0">
                <button
                  onClick={() => toggleGroup(group.label)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 text-[11px] uppercase tracking-wide transition-colors ${
                    groupHasSel ? 'text-amber-400 bg-amber-900/20' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                  }`}
                >
                  <span>{group.label}</span>
                  <span className="text-zinc-600">{open ? '▾' : '▸'}</span>
                </button>
                {open && (
                  <div className="grid grid-cols-7 gap-1 p-2 bg-zinc-900/40">
                    {group.items.map(item => (
                      <button
                        key={item.key}
                        onClick={() => { setSelKey(item.key); setSelCustom(null); }}
                        title={item.label}
                        className={`aspect-square flex items-center justify-center rounded border ${
                          selKey === item.key && !selCustom
                            ? 'border-amber-500 bg-amber-900/30'
                            : 'border-zinc-700 bg-zinc-800 hover:border-zinc-500'
                        }`}
                      >
                        <div style={{
                          width: 20, height: 20,
                          backgroundColor: selColor,
                          WebkitMaskImage: `url(/${item.key}.svg)`,
                          maskImage:        `url(/${item.key}.svg)`,
                          WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
                          WebkitMaskSize:   'contain',   maskSize:   'contain',
                          WebkitMaskPosition: 'center',  maskPosition: 'center',
                        }} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Custom image upload */}
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-[11px] px-3 py-1.5 border border-zinc-700 bg-zinc-800 hover:border-zinc-500 text-zinc-300 uppercase tracking-wide"
        >
          {selCustom ? 'Replace image' : '+ Upload image'}
        </button>
        <span className="text-[10px] text-zinc-600 ml-2">Max ~150 KB · auto-compressed</span>
      </section>

      <div className="border-t border-zinc-800" />

      {/* Social links */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <div className="text-[11px] uppercase tracking-widest text-amber-600">Social links</div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={linksPublic} onChange={e => setLinksPublic(e.target.checked)} className="accent-amber-500" />
            <span className="text-[11px] text-zinc-400">Visible to others</span>
          </label>
        </div>
        <div className="space-y-2">
          {SOCIAL_PLATFORMS.map(p => (
            <div key={p.key} className="flex items-center gap-2">
              <span className="text-[11px] text-zinc-500 w-20 shrink-0">{p.label}</span>
              <input
                value={links[p.key] ?? ''}
                onChange={e => setLinks(prev => ({ ...prev, [p.key]: e.target.value }))}
                placeholder={p.placeholder}
                className="flex-1 bg-zinc-800 border border-zinc-700 focus:border-amber-700 text-zinc-200 text-sm px-2 py-1.5 outline-none"
              />
            </div>
          ))}
        </div>
      </section>

      <div className="flex items-center gap-3">
        <button
          disabled={saving}
          onClick={handleSaveProfile}
          className="text-[11px] px-4 py-1.5 bg-amber-800 border border-amber-600 text-white hover:bg-amber-700 disabled:opacity-50 uppercase tracking-wide"
        >
          {msg || 'Save profile'}
        </button>
      </div>

      <div className="border-t border-zinc-800" />

      {/* Security */}
      <div className="border border-zinc-800 bg-zinc-900/40">
        <button onClick={toggleSecurity} className="w-full flex items-center justify-between px-4 py-3 text-[11px] text-zinc-400 hover:text-amber-400 uppercase tracking-wide transition-colors">
          <span>Account security</span>
          <span className="text-zinc-600">{showSecurity ? '▾' : '▸'}</span>
        </button>
        {showSecurity && (
          <div className="px-4 pb-4 space-y-4 border-t border-zinc-800">
            {secError && <p className="text-red-400 text-xs pt-3">{secError}</p>}
            <div className="pt-3">
              <div className="text-[11px] uppercase tracking-widest text-amber-600 mb-1">Recovery code</div>
              {codeLoading ? <p className="text-zinc-500 text-xs">Loading…</p> : recoveryCode ? (
                <div className="flex items-center gap-2">
                  <div className={`bg-zinc-950 border border-amber-700 text-amber-400 font-mono text-sm px-3 py-2 tracking-widest flex-1 select-all ${codeRevealed ? '' : 'blur-sm'}`}>{recoveryCode}</div>
                  <button onClick={() => setCodeRevealed(v => !v)} className="text-lg px-2 text-zinc-400 hover:text-amber-400">{codeRevealed ? '🙈' : '👁'}</button>
                </div>
              ) : (
                <p className="text-zinc-500 text-xs italic">No code on file yet — reset your password once to get one.</p>
              )}
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-widest text-amber-600 mb-1">Secret question</div>
              {secQuestion && !editQuestion && (
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-zinc-300 text-sm">{secQuestion}</span>
                  <button onClick={() => setEditQuestion(secQuestion)} className="text-[11px] text-zinc-500 hover:text-amber-400 underline underline-offset-2 shrink-0">Change</button>
                </div>
              )}
              {(!secQuestion || editQuestion) && (
                <div className="space-y-2">
                  {!secQuestion && <p className="text-zinc-500 text-[11px] italic">Optional — required with recovery code to reset password.</p>}
                  <input value={editQuestion} onChange={e => setEditQuestion(e.target.value)} placeholder="e.g. What was your first army's faction?" className="w-full bg-zinc-800 border border-zinc-700 focus:border-amber-700 text-zinc-200 text-sm px-3 py-2 outline-none" />
                  {editQuestion.trim() && <input value={editAnswer} onChange={e => setEditAnswer(e.target.value)} placeholder="Answer" className="w-full bg-zinc-800 border border-zinc-700 focus:border-amber-700 text-zinc-200 text-sm px-3 py-2 outline-none" />}
                  <div className="flex gap-2">
                    <button disabled={secBusy} onClick={handleSaveSecretQuestion} className="text-[11px] px-3 py-1.5 bg-amber-800 border border-amber-600 text-white hover:bg-amber-700 disabled:opacity-50 uppercase tracking-wide">{secMsg || 'Save'}</button>
                    {secQuestion && <button onClick={() => { setEditQuestion(''); setEditAnswer(''); }} className="text-[11px] px-3 py-1.5 bg-zinc-700 border border-zinc-600 text-zinc-300 hover:bg-zinc-600 uppercase tracking-wide">Cancel</button>}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={async () => { await onLogout(); onClose(); }}
        className="w-full text-center text-[11px] text-red-500/70 hover:text-red-400 uppercase tracking-wide py-2 border border-red-900/40 hover:border-red-700/60 transition-colors"
      >
        Log out
      </button>
    </div>
  );
}

// ── Main modal ───────────────────────────────────────────────────────────────

export function CloudSavesModal({
  username, avatar, socialLinks, socialPublic,
  onClose, onLogout, activeRosterId, onActiveRosterIdChange, onOpenAdmin, onProfileUpdate,
  onLoadCommunityArmy, defaultTab,
}: Props) {
  const [tab, setTab] = useState<Tab>(defaultTab ?? 'armies');

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-start justify-center z-50 p-4 overflow-y-auto"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-zinc-900 border-2 border-amber-800 w-full max-w-xl my-4">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 bg-zinc-800 border-b border-amber-800">
          <div className="flex items-center gap-2.5">
            <Avatar username={username} avatar={avatar} size={28} />
            <h3 className="text-amber-400 uppercase tracking-widest text-sm">{username}</h3>
            {onOpenAdmin && (
              <button
                onClick={() => { onClose(); onOpenAdmin(); }}
                className="text-[10px] px-2 py-0.5 border border-amber-900/60 text-amber-700 hover:text-amber-400 hover:border-amber-600 uppercase tracking-widest transition-colors"
              >Admin</button>
            )}
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-xl leading-none">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-700">
          {TAB_LABELS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2.5 text-[10px] uppercase tracking-widest transition-colors ${
                tab === t.key
                  ? 'text-amber-400 border-b-2 border-amber-500 bg-zinc-800/50'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto">
          {tab === 'armies' && (
            <ArmiesTab onClose={onClose} activeRosterId={activeRosterId} onActiveRosterIdChange={onActiveRosterIdChange} />
          )}
          {tab === 'community' && <CommunityTab loggedIn={true} onClose={onClose} onLoadCommunityArmy={onLoadCommunityArmy} />}
          {tab === 'friends' && <FriendsTab />}
          {tab === 'preferences' && <PrefsTab />}
          {tab === 'account' && (
            <AccountTab
              username={username} avatar={avatar} socialLinks={socialLinks} socialPublic={socialPublic}
              onLogout={onLogout} onClose={onClose} onProfileUpdate={onProfileUpdate}
            />
          )}
        </div>
      </div>
    </div>
  );
}
