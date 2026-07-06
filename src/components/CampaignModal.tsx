import { useEffect, useState } from 'react';
import * as api from '../lib/api';
import { useT } from '../i18n';
import { CampaignMapView } from './CampaignMapView';
import { CampaignBattleLog } from './CampaignBattleLog';
import { CampaignRosterView } from './CampaignRosterView';

interface Props {
  onClose: () => void;
}

export function CampaignModal({ onClose }: Props) {
  const t = useT();
  const [campaigns, setCampaigns] = useState<api.CampaignSummary[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');

  const [openId, setOpenId]       = useState<number | null>(null);
  const [openTab, setOpenTab]     = useState<'players' | 'map' | 'battles' | 'roster'>('players');
  const [advancing, setAdvancing] = useState(false);
  const [players, setPlayers]     = useState<api.CampaignPlayer[]>([]);
  const [supply, setSupply]       = useState<api.CampaignSupplyRow[]>([]);
  const [adjusting, setAdjusting] = useState<string | null>(null);
  const [playersLoading, setPlayersLoading] = useState(false);

  // Create campaign form
  const [showCreate, setShowCreate]       = useState(false);
  const [newName, setNewName]             = useState('');
  const [newFactions, setNewFactions]     = useState('Chaos, Imperium');
  const [newMaxTurns, setNewMaxTurns]     = useState(0);
  const [newSectorsToWin, setNewSectorsToWin] = useState(4);
  const [creating, setCreating]           = useState(false);

  // Delete campaign confirmation
  const [deletingCampaign, setDeletingCampaign] = useState<api.CampaignSummary | null>(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState('');
  const [deleting, setDeleting] = useState(false);

  // Join campaign form
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
      // Supply refreshes after advance; re-fetch now that turn-advance credited new supply
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
      const [pRes, sRes] = await Promise.all([
        api.listCampaignPlayers(c.id),
        api.listSupply(c.id),
      ]);
      setPlayers(pRes.players);
      setSupply(sRes.supply);
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
      className="fixed inset-0 bg-black/80 flex items-start justify-center z-50 p-4 overflow-y-auto"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-zinc-900 border-2 border-amber-800 w-full max-w-xl my-4">
        <div className="flex justify-between items-center px-4 py-3 bg-zinc-800 border-b border-amber-800">
          <h3 className="text-amber-400 uppercase tracking-widest text-sm flex items-center gap-2">
            {t('campaignModalTitle')}
            <span className="text-[10px] px-1.5 py-0.5 bg-red-900/60 border border-red-700 text-red-300 tracking-wide normal-case">ALPHA</span>
          </h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-xl leading-none">✕</button>
        </div>

        <div className="p-4 space-y-4">
          <p className="text-zinc-500 text-[11px] italic">
            {t('campaignEarlyPreview')}
          </p>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <div className="flex gap-2">
            <button
              onClick={() => { setShowCreate(v => !v); setShowJoin(false); }}
              className="flex-1 text-[11px] px-3 py-2 bg-amber-800 border border-amber-600 text-white hover:bg-amber-700 uppercase tracking-wide"
            >
              {showCreate ? t('cancel') : t('campaignCreateToggle')}
            </button>
            <button
              onClick={() => { setShowJoin(v => !v); setShowCreate(false); }}
              className="flex-1 text-[11px] px-3 py-2 bg-zinc-700 border border-zinc-600 text-zinc-200 hover:bg-zinc-600 uppercase tracking-wide"
            >
              {showJoin ? t('cancel') : t('campaignJoinToggle')}
            </button>
          </div>

          {showCreate && (
            <div className="bg-zinc-800/60 border border-zinc-700 p-3 space-y-2">
              <input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder={t('campaignNamePlaceholder')}
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-amber-700 text-zinc-200 text-sm px-3 py-2 outline-none"
              />
              <input
                value={newFactions}
                onChange={e => setNewFactions(e.target.value)}
                placeholder={t('campaignFactionsPlaceholder')}
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-amber-700 text-zinc-200 text-sm px-3 py-2 outline-none"
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase tracking-wide block mb-1">{t('campaignMaxTurnsLabel')}</label>
                  <input type="number" min={0} value={newMaxTurns} onChange={e => setNewMaxTurns(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-zinc-800 border border-zinc-700 focus:border-amber-700 text-zinc-200 text-sm px-3 py-1.5 outline-none" />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase tracking-wide block mb-1">{t('campaignSectorsToWinLabel')}</label>
                  <input type="number" min={0} value={newSectorsToWin} onChange={e => setNewSectorsToWin(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-zinc-800 border border-zinc-700 focus:border-amber-700 text-zinc-200 text-sm px-3 py-1.5 outline-none" />
                </div>
              </div>
              <p className="text-[10px] text-zinc-600 italic">{t('campaignVictoryHint')}</p>
              <button
                disabled={creating || !newName.trim()}
                onClick={handleCreate}
                className="text-[11px] px-3 py-1.5 bg-amber-800 border border-amber-600 text-white hover:bg-amber-700 disabled:opacity-50 uppercase tracking-wide"
              >
                {t('createLabel')}
              </button>
            </div>
          )}

          {showJoin && (
            <div className="bg-zinc-800/60 border border-zinc-700 p-3 space-y-2">
              <input
                value={joinCode}
                onChange={e => setJoinCode(e.target.value.toUpperCase())}
                placeholder={t('campaignInviteCodePlaceholder')}
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-amber-700 text-zinc-200 text-sm px-3 py-2 outline-none font-mono tracking-widest"
              />
              <input
                value={joinFaction}
                onChange={e => setJoinFaction(e.target.value)}
                placeholder={t('campaignJoinFactionPlaceholder')}
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-amber-700 text-zinc-200 text-sm px-3 py-2 outline-none"
              />
              <button
                disabled={joining || !joinCode.trim() || !joinFaction.trim()}
                onClick={handleJoin}
                className="text-[11px] px-3 py-1.5 bg-amber-800 border border-amber-600 text-white hover:bg-amber-700 disabled:opacity-50 uppercase tracking-wide"
              >
                {t('joinLabel')}
              </button>
            </div>
          )}

          {loading ? (
            <p className="text-zinc-500 text-sm text-center py-6">{t('loadingEllipsis')}</p>
          ) : campaigns.length === 0 ? (
            <p className="text-zinc-500 italic text-sm text-center py-8">
              {t('campaignNoneYet')}
            </p>
          ) : (
            <div className="space-y-2">
              {campaigns.map(c => (
                <div key={c.id} className="bg-zinc-800 border border-zinc-700 border-l-4 border-l-amber-800">
                  <div className="p-3 flex items-center gap-3">
                    <div
                      onClick={() => toggleOpen(c)}
                      className="flex-1 min-w-0 cursor-pointer"
                    >
                      <div className="text-sm font-semibold text-zinc-100 truncate flex items-center gap-2">
                        {c.name}
                        {c.role === 'gm' && <span className="text-[10px] text-amber-500 normal-case">{t('campaignYouAreGm')}</span>}
                        {c.status === 'finished' && <span className="text-[10px] px-1.5 py-0.5 bg-emerald-900/60 border border-emerald-700 text-emerald-300 tracking-wide normal-case">{t('campaignStatusFinished')}</span>}
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-1">
                        {c.factions.join(' vs ')}
                        {c.faction && <span className="text-amber-600"> · {t('campaignPlayingPrefix')} {c.faction}</span>}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[11px] font-mono tracking-widest text-amber-500">{c.invite_code}</span>
                      <span className="text-[10px] text-zinc-500">{t('campaignTurnLabel')} {c.current_turn ?? 1}</span>
                    </div>
                    {c.role === 'gm' && (
                      <button
                        onClick={e => { e.stopPropagation(); setDeletingCampaign(c); setDeleteConfirmName(''); setError(''); }}
                        className="ml-1 text-zinc-600 hover:text-red-400 transition-colors shrink-0"
                        title="Delete campaign"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                  {openId === c.id && (
                    <div className="border-t border-zinc-700 bg-zinc-950/40">
                      {/* Turn bar (GM only) */}
                      {c.role === 'gm' && (
                        <div className="flex items-center justify-between px-3 py-2 bg-zinc-900/60 border-b border-zinc-700">
                          <span className="text-[11px] text-amber-500 font-semibold">{t('campaignTurnLabel')} {c.current_turn ?? 1}</span>
                          {c.status === 'finished' ? (
                            <span className="text-[10px] text-emerald-400">
                              {c.winner_faction
                                ? `${t('campaignWonBy')}: ${c.winner_faction}`
                                : t('campaignNoVictor')}
                            </span>
                          ) : (
                            <button onClick={() => handleAdvanceTurn(c)} disabled={advancing}
                              className="text-[10px] px-2 py-1 bg-zinc-700 border border-zinc-600 text-zinc-200 hover:bg-zinc-600 disabled:opacity-50 uppercase tracking-wide">
                              {advancing ? t('campaignAdvancing') : `${t('campaignAdvanceTurn')} ${(c.current_turn ?? 1) + 1} →`}
                            </button>
                          )}
                        </div>
                      )}
                      {/* Tab bar */}
                      <div className="flex border-b border-zinc-700">
                        {(['players', 'map', 'battles', 'roster'] as const).map(tab => (
                          <button key={tab}
                            onClick={() => setOpenTab(tab)}
                            className={`flex-1 text-[10px] py-2 uppercase tracking-wide ${openTab === tab ? 'text-amber-400 border-b-2 border-amber-600' : 'text-zinc-500 hover:text-zinc-300'}`}>
                            {tab === 'players' ? t('campaignTabPlayers') : tab === 'map' ? t('campaignTabMap') : tab === 'battles' ? t('campaignTabBattles') : t('campaignTabRoster')}
                          </button>
                        ))}
                      </div>
                      <div className="p-3">
                        {openTab === 'players' ? (
                          playersLoading ? (
                            <p className="text-zinc-500 text-xs">{t('campaignLoadingPlayers')}</p>
                          ) : (
                            <div className="space-y-3">
                              {/* Faction standings + supply */}
                              {supply.length > 0 && (
                                <div>
                                  <p className="text-[10px] text-zinc-500 uppercase tracking-wide mb-1.5">{t('campaignFactionStandings')}</p>
                                  <div className="space-y-1.5">
                                    {supply.map(s => (
                                      <div key={s.faction} className="flex items-center gap-2 text-[12px]">
                                        <span className="text-zinc-200 flex-1">{s.faction}</span>
                                        <span className="text-amber-400 font-mono font-semibold w-8 text-right">{s.amount}</span>
                                        <span className="text-zinc-500 text-[10px]">{t('campaignSupplyLabel')}</span>
                                        {c.role === 'gm' && (
                                          <div className="flex gap-1">
                                            <button onClick={() => handleAdjustSupply(c, s.faction, -1)}
                                              disabled={adjusting === s.faction || s.amount === 0}
                                              className="w-5 h-5 flex items-center justify-center bg-zinc-700 border border-zinc-600 text-zinc-300 hover:bg-zinc-600 disabled:opacity-40 text-xs leading-none">−</button>
                                            <button onClick={() => handleAdjustSupply(c, s.faction, 1)}
                                              disabled={adjusting === s.faction}
                                              className="w-5 h-5 flex items-center justify-center bg-zinc-700 border border-zinc-600 text-zinc-300 hover:bg-zinc-600 disabled:opacity-40 text-xs leading-none">+</button>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {/* Player list */}
                              <div>
                                <p className="text-[10px] text-zinc-500 uppercase tracking-wide mb-1.5">{t('campaignTabPlayers')}</p>
                                <div className="space-y-1">
                                  {players.map(p => (
                                    <div key={p.username} className="flex justify-between text-[12px]">
                                      <span className="text-zinc-300">{p.username}{p.role === 'gm' && <span className="text-amber-600"> {t('campaignGmSuffix')}</span>}</span>
                                      <span className="text-zinc-500">{p.faction ?? '—'}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )
                        ) : openTab === 'map' ? (
                          <CampaignMapView campaign={c} isGm={c.role === 'gm'} />
                        ) : openTab === 'battles' ? (
                          <CampaignBattleLog campaign={c} isGm={c.role === 'gm'} />
                        ) : (
                          <CampaignRosterView campaign={c} isGm={c.role === 'gm'} myFaction={c.faction ?? null} />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete campaign confirmation overlay */}
        {deletingCampaign && (
          <div className="border-t border-red-900/60 bg-red-950/30 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-red-400 text-[12px] font-semibold uppercase tracking-wide">
                Delete campaign permanently?
              </p>
              <button
                onClick={() => { setDeletingCampaign(null); setDeleteConfirmName(''); }}
                className="text-zinc-500 hover:text-zinc-300 text-lg leading-none"
              >×</button>
            </div>
            <p className="text-zinc-400 text-[11px]">
              Type <span className="text-amber-400 font-semibold">{deletingCampaign.name}</span> to confirm. This deletes all sectors, battles, rosters and players.
            </p>
            <input
              autoFocus
              value={deleteConfirmName}
              onChange={e => setDeleteConfirmName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && deleteConfirmName === deletingCampaign.name) handleDeleteCampaign(); }}
              placeholder="Campaign name…"
              className="w-full bg-zinc-900 border border-red-800/60 focus:border-red-600 text-zinc-200 text-sm px-3 py-2 outline-none"
            />
            <button
              disabled={deleteConfirmName !== deletingCampaign.name || deleting}
              onClick={handleDeleteCampaign}
              className="w-full text-[11px] px-3 py-2 bg-red-900 border border-red-700 text-red-200 hover:bg-red-800 disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-wide"
            >
              {deleting ? 'Deleting…' : 'Delete campaign permanently'}
            </button>
          </div>
        )}

        <div className="px-4 py-3 border-t border-zinc-700 flex justify-end bg-zinc-800">
          <button onClick={onClose} className="px-4 py-1.5 bg-zinc-700 border border-zinc-600 text-zinc-200 text-sm hover:bg-zinc-600 uppercase tracking-wide">
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
}
