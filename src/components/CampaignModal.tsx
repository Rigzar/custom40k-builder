import { useEffect, useState } from 'react';
import * as api from '../lib/api';
import { useT } from '../i18n';
import { CampaignMapView } from './CampaignMapView';
import { CampaignBattleLog } from './CampaignBattleLog';
import { CampaignRosterView } from './CampaignRosterView';
import { CampaignBuildingsView } from './CampaignBuildingsView';

type TabId = 'players' | 'map' | 'battles' | 'roster' | 'buildings';

const TABS: { key: TabId; label: string }[] = [
  { key: 'players',   label: 'COMMAND' },
  { key: 'map',       label: 'MAP' },
  { key: 'battles',   label: 'BATTLES' },
  { key: 'roster',    label: 'ROSTER' },
  { key: 'buildings', label: 'INFRA' },
];

interface Props {
  onClose: () => void;
}

export function CampaignModal({ onClose }: Props) {
  const t = useT();
  const [campaigns, setCampaigns] = useState<api.CampaignSummary[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');

  const [openId, setOpenId]       = useState<number | null>(null);
  const [openTab, setOpenTab]     = useState<TabId>('players');
  const [mapRefreshTick, setMapRefreshTick] = useState(0);
  const [advancing, setAdvancing] = useState(false);
  const [players, setPlayers]     = useState<api.CampaignPlayer[]>([]);
  const [supply, setSupply]       = useState<api.CampaignSupplyRow[]>([]);
  const [sectors, setSectors]     = useState<api.CampaignSector[]>([]);
  const [adjusting, setAdjusting] = useState<string | null>(null);
  const [playersLoading, setPlayersLoading] = useState(false);

  const [showCreate, setShowCreate]       = useState(false);
  const [newName, setNewName]             = useState('');
  const [newFactions, setNewFactions]     = useState('Chaos, Imperium');
  const [newMaxTurns, setNewMaxTurns]     = useState(0);
  const [newSectorsToWin, setNewSectorsToWin] = useState(4);
  const [creating, setCreating]           = useState(false);

  const [deletingCampaign, setDeletingCampaign] = useState<api.CampaignSummary | null>(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState('');
  const [deleting, setDeleting] = useState(false);

  const [showJoin, setShowJoin]     = useState(false);
  const [joinCode, setJoinCode]     = useState('');
  const [joinFaction, setJoinFaction] = useState('');
  const [joining, setJoining]       = useState(false);

  async function refresh() {
    setLoading(true); setError('');
    try {
      const res = await api.listCampaigns();
      setCampaigns(res.campaigns);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  async function handleAdvanceTurn(c: api.CampaignSummary) {
    setAdvancing(true); setError('');
    try {
      const turnRes = await api.advanceTurn(c.id);
      setCampaigns(prev => prev.map(x => x.id === c.id ? {
        ...x,
        current_turn: turnRes.current_turn,
        status: (turnRes.status as 'active' | 'finished'),
        winner_faction: turnRes.winner_faction,
      } : x));
      const fresh = await api.listSupply(c.id);
      setSupply(fresh.supply);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setAdvancing(false);
    }
  }

  async function handleAdjustSupply(c: api.CampaignSummary, faction: string, delta: number) {
    setAdjusting(faction); setError('');
    try {
      const res = await api.adjustSupply(c.id, faction, delta);
      setSupply(prev => prev.map(s => s.faction === faction ? { ...s, amount: res.amount } : s));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setAdjusting(null);
    }
  }

  async function toggleOpen(c: api.CampaignSummary) {
    if (openId === c.id) { setOpenId(null); return; }
    setOpenId(c.id);
    setOpenTab('players');
    setPlayersLoading(true);
    try {
      const [pRes, sRes, secRes] = await Promise.all([
        api.listCampaignPlayers(c.id),
        api.listSupply(c.id),
        api.listCampaignSectors(c.id),
      ]);
      setPlayers(pRes.players);
      setSupply(sRes.supply);
      setSectors(secRes.sectors);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setPlayersLoading(false);
    }
  }

  async function handleCreate() {
    const factions = newFactions.split(',').map(f => f.trim()).filter(Boolean);
    setCreating(true); setError('');
    try {
      await api.createCampaign(newName.trim(), factions, newMaxTurns, newSectorsToWin);
      setNewName(''); setNewFactions('Chaos, Imperium'); setNewMaxTurns(0); setNewSectorsToWin(4); setShowCreate(false);
      await refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setCreating(false);
    }
  }

  async function handleJoin() {
    setJoining(true); setError('');
    try {
      await api.joinCampaign(joinCode.trim(), joinFaction.trim());
      setJoinCode(''); setJoinFaction(''); setShowJoin(false);
      await refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setJoining(false);
    }
  }

  async function handleDeleteCampaign() {
    if (!deletingCampaign) return;
    setDeleting(true); setError('');
    try {
      await api.deleteCampaign(deletingCampaign.id, deleteConfirmName);
      setCampaigns(prev => prev.filter(c => c.id !== deletingCampaign.id));
      if (openId === deletingCampaign.id) setOpenId(null);
      setDeletingCampaign(null);
      setDeleteConfirmName('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/90 flex items-start justify-center z-50 p-4 overflow-y-auto"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="cog-bg border border-[#39d353] w-full max-w-xl my-4 cog-text relative overflow-hidden">
        {/* Scanline overlay */}
        <div className="absolute inset-0 pointer-events-none z-0 cog-scanlines" />

        {/* Header */}
        <div className="relative z-10 flex justify-between items-center px-4 py-3 border-b border-[#1a5c25]">
          <div className="flex items-center gap-2">
            <span className="cog-text-bright text-sm tracking-widest uppercase">⬡ PLANETARY ASSAULT</span>
            <span className="text-[9px] px-1.5 py-0.5 border border-[#ff3030] cog-text-red tracking-wide">ALPHA</span>
          </div>
          <button onClick={onClose} className="cog-text-dim hover:cog-text-red text-lg leading-none transition-colors">✕</button>
        </div>

        <div className="relative z-10 p-4 space-y-4">
          <p className="cog-text-dim text-[10px] italic">
            {t('campaignEarlyPreview')}
          </p>

          {error && <p className="cog-text-red text-xs">⚠ {error}</p>}

          <div className="flex gap-2">
            <button
              onClick={() => { setShowCreate(v => !v); setShowJoin(false); }}
              className={`flex-1 cog-btn cog-btn-amber text-[10px] ${showCreate ? 'cog-btn-active' : ''}`}>
              {showCreate ? t('cancel') : t('campaignCreateToggle')}
            </button>
            <button
              onClick={() => { setShowJoin(v => !v); setShowCreate(false); }}
              className={`flex-1 cog-btn text-[10px] ${showJoin ? 'cog-btn-active' : ''}`}>
              {showJoin ? t('cancel') : t('campaignJoinToggle')}
            </button>
          </div>

          {showCreate && (
            <div className="cog-panel cog-appear p-3 space-y-2">
              <p className="cog-text-dim text-[9px] tracking-widest">◈ NEW CAMPAIGN PARAMETERS ◈</p>
              <input value={newName} onChange={e => setNewName(e.target.value)}
                placeholder={t('campaignNamePlaceholder')}
                className="cog-input w-full text-[11px]" />
              <input value={newFactions} onChange={e => setNewFactions(e.target.value)}
                placeholder={t('campaignFactionsPlaceholder')}
                className="cog-input w-full text-[11px]" />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="cog-text-dim text-[9px] tracking-wide block mb-1">{t('campaignMaxTurnsLabel')}</label>
                  <input type="number" min={0} value={newMaxTurns}
                    onChange={e => setNewMaxTurns(Math.max(0, Number(e.target.value)))}
                    className="cog-input w-full text-[11px]" />
                </div>
                <div>
                  <label className="cog-text-dim text-[9px] tracking-wide block mb-1">{t('campaignSectorsToWinLabel')}</label>
                  <input type="number" min={0} value={newSectorsToWin}
                    onChange={e => setNewSectorsToWin(Math.max(0, Number(e.target.value)))}
                    className="cog-input w-full text-[11px]" />
                </div>
              </div>
              <p className="cog-text-dim text-[9px] italic">{t('campaignVictoryHint')}</p>
              <button disabled={creating || !newName.trim()} onClick={handleCreate}
                className="cog-btn cog-btn-amber text-[10px]">
                {t('createLabel')}
              </button>
            </div>
          )}

          {showJoin && (
            <div className="cog-panel cog-appear p-3 space-y-2">
              <p className="cog-text-dim text-[9px] tracking-widest">◈ ENTER CAMPAIGN UPLINK CODE ◈</p>
              <input value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())}
                placeholder={t('campaignInviteCodePlaceholder')}
                className="cog-input w-full text-[11px] tracking-widest" />
              <input value={joinFaction} onChange={e => setJoinFaction(e.target.value)}
                placeholder={t('campaignJoinFactionPlaceholder')}
                className="cog-input w-full text-[11px]" />
              <button disabled={joining || !joinCode.trim() || !joinFaction.trim()} onClick={handleJoin}
                className="cog-btn cog-btn-amber text-[10px]">
                {t('joinLabel')}
              </button>
            </div>
          )}

          {loading ? (
            <p className="cog-text text-sm text-center py-6 cog-flicker">▌ QUERYING CAMPAIGN DATABASE... ▐</p>
          ) : campaigns.length === 0 ? (
            <p className="cog-text-dim italic text-sm text-center py-8">[ NO ACTIVE CAMPAIGNS ]</p>
          ) : (
            <div className="space-y-2">
              {campaigns.map(c => (
                <div key={c.id} className="border border-[#1a5c25] border-l-2 border-l-[#57ff6a] bg-[#020702]">
                  <div className="p-3 flex items-center gap-3">
                    <div onClick={() => toggleOpen(c)} className="flex-1 min-w-0 cursor-pointer">
                      <div className="text-sm cog-text-bright truncate flex items-center gap-2 tracking-wide">
                        {c.name.toUpperCase()}
                        {c.role === 'gm' && <span className="text-[9px] cog-text-amber">[GM]</span>}
                        {c.status === 'finished' && (
                          <span className="text-[9px] px-1 border border-[#39d353] cog-text tracking-wide">COMPLETED</span>
                        )}
                      </div>
                      <div className="cog-text-dim text-[10px] mt-0.5">
                        {c.factions.join(' vs ')}
                        {c.faction && <span className="cog-text-amber"> · {c.faction}</span>}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-0.5 shrink-0">
                      <span className="cog-text-amber font-mono text-[11px] tracking-widest">{c.invite_code}</span>
                      <span className="cog-text-dim text-[9px]">T.{String(c.current_turn ?? 1).padStart(3, '0')}</span>
                    </div>
                    {c.role === 'gm' && (
                      <button
                        onClick={e => { e.stopPropagation(); setDeletingCampaign(c); setDeleteConfirmName(''); setError(''); }}
                        className="ml-1 cog-text-dim hover:cog-text-red transition-colors shrink-0"
                        title="Delete campaign">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {openId === c.id && (
                    <div className="border-t border-[#1a5c25]">
                      {/* Turn bar (GM only) */}
                      {c.role === 'gm' && (
                        <div className="flex items-center justify-between px-3 py-2 border-b border-[#1a5c25]">
                          <span className="cog-text-amber text-[10px] tracking-widest">
                            ◈ TURN {String(c.current_turn ?? 1).padStart(3, '0')}
                          </span>
                          {c.status === 'finished' ? (
                            <span className="cog-text text-[10px]">
                              {c.winner_faction
                                ? `VICTORY: ${c.winner_faction.toUpperCase()}`
                                : 'NO VICTOR'}
                            </span>
                          ) : (
                            <button onClick={() => handleAdvanceTurn(c)} disabled={advancing}
                              className="cog-btn text-[9px] py-0.5">
                              {advancing ? 'ADVANCING...' : `ADVANCE → T.${String((c.current_turn ?? 1) + 1).padStart(3,'0')}`}
                            </button>
                          )}
                        </div>
                      )}

                      {/* Tab bar */}
                      <div className="flex border-b border-[#1a5c25]">
                        {TABS.map(tab => (
                          <button key={tab.key}
                            onClick={() => setOpenTab(tab.key)}
                            className={`flex-1 text-[9px] py-1.5 tracking-widest transition-colors ${
                              openTab === tab.key
                                ? 'cog-text-amber border-b border-[#ffb020]'
                                : 'cog-text-dim hover:cog-text'
                            }`}>
                            {tab.label}
                          </button>
                        ))}
                      </div>

                      <div className="p-3">
                        {openTab === 'players' && (
                          playersLoading ? (
                            <p className="cog-text-dim text-xs cog-flicker">▌ LOADING... ▐</p>
                          ) : (
                            <div className="space-y-3">
                              {supply.length > 0 && (
                                <div>
                                  <p className="cog-text-dim text-[9px] tracking-widest uppercase mb-2">◈ FACTION SUPPLY ◈</p>
                                  <div className="space-y-1.5">
                                    {supply.map(s => (
                                      <div key={s.faction} className="flex items-center gap-2 text-[11px]">
                                        <span className="cog-text flex-1 tracking-wide">{s.faction}</span>
                                        <span className="cog-text-amber font-mono font-semibold w-8 text-right">{s.amount}</span>
                                        <span className="cog-text-dim text-[9px]">⊗</span>
                                        {c.role === 'gm' && (
                                          <div className="flex gap-1">
                                            <button onClick={() => handleAdjustSupply(c, s.faction, -1)}
                                              disabled={adjusting === s.faction || s.amount === 0}
                                              className="cog-btn text-[9px] py-0 px-1 w-4 h-4 flex items-center justify-center">−</button>
                                            <button onClick={() => handleAdjustSupply(c, s.faction, 1)}
                                              disabled={adjusting === s.faction}
                                              className="cog-btn text-[9px] py-0 px-1 w-4 h-4 flex items-center justify-center">+</button>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              <hr className="cog-divider" />
                              <div>
                                <p className="cog-text-dim text-[9px] tracking-widest uppercase mb-2">◈ PERSONNEL ◈</p>
                                <div className="space-y-1">
                                  {players.map(p => (
                                    <div key={p.username} className="flex justify-between text-[11px]">
                                      <span className="cog-text">
                                        {p.username}
                                        {p.role === 'gm' && <span className="cog-text-amber ml-1">[GM]</span>}
                                      </span>
                                      <span className="cog-text-dim">{p.faction ?? '—'}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )
                        )}
                        {openTab === 'map' && (
                          <CampaignMapView campaign={c} isGm={c.role === 'gm'} refreshTick={mapRefreshTick} />
                        )}
                        {openTab === 'battles' && (
                          <CampaignBattleLog campaign={c} isGm={c.role === 'gm'}
                            onSectorChanged={() => setMapRefreshTick(tick => tick + 1)} />
                        )}
                        {openTab === 'roster' && (
                          <CampaignRosterView campaign={c} isGm={c.role === 'gm'} myFaction={c.faction ?? null} />
                        )}
                        {openTab === 'buildings' && (
                          <CampaignBuildingsView campaign={c} sectors={sectors} isGm={c.role === 'gm'} />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete confirmation */}
        {deletingCampaign && (
          <div className="relative z-10 border-t border-[#ff3030]/40 bg-[#0a0202] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="cog-text-red text-[11px] tracking-widest">⚠ PURGE CAMPAIGN PERMANENTLY?</p>
              <button onClick={() => { setDeletingCampaign(null); setDeleteConfirmName(''); }}
                className="cog-text-dim hover:cog-text text-lg leading-none">×</button>
            </div>
            <p className="cog-text-dim text-[10px]">
              Type <span className="cog-text-amber">{deletingCampaign.name}</span> to confirm. Deletes all sectors, battles, rosters and players.
            </p>
            <input autoFocus value={deleteConfirmName}
              onChange={e => setDeleteConfirmName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && deleteConfirmName === deletingCampaign.name) handleDeleteCampaign(); }}
              placeholder="Campaign name…"
              className="cog-input w-full text-[11px]" />
            <button
              disabled={deleteConfirmName !== deletingCampaign.name || deleting}
              onClick={handleDeleteCampaign}
              className="cog-btn cog-btn-danger w-full text-[10px]">
              {deleting ? 'PURGING...' : 'CONFIRM PURGE'}
            </button>
          </div>
        )}

        <div className="relative z-10 px-4 py-3 border-t border-[#1a5c25] flex justify-end">
          <button onClick={onClose} className="cog-btn text-[10px]">{t('close')}</button>
        </div>
      </div>
    </div>
  );
}
