import { useEffect, useState } from 'react';
import * as api from '../lib/api';
import { useT } from '../i18n';
import { CampaignMapView } from './CampaignMapView';

interface Props {
  onClose: () => void;
}

export function CampaignModal({ onClose }: Props) {
  const t = useT();
  const [campaigns, setCampaigns] = useState<api.CampaignSummary[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');

  const [openId, setOpenId]       = useState<number | null>(null);
  const [openTab, setOpenTab]     = useState<'players' | 'map'>('players');
  const [players, setPlayers]     = useState<api.CampaignPlayer[]>([]);
  const [playersLoading, setPlayersLoading] = useState(false);

  // Create campaign form
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName]       = useState('');
  const [newFactions, setNewFactions] = useState('Chaos, Imperium');
  const [creating, setCreating]     = useState(false);

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

  async function toggleOpen(c: api.CampaignSummary) {
    if (openId === c.id) { setOpenId(null); return; }
    setOpenId(c.id);
    setOpenTab('players');
    setPlayersLoading(true);
    try {
      const res = await api.listCampaignPlayers(c.id);
      setPlayers(res.players);
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
      await api.createCampaign(newName.trim(), factions);
      setNewName(''); setNewFactions('Chaos, Imperium'); setShowCreate(false);
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
                  <div
                    onClick={() => toggleOpen(c)}
                    className="p-3 flex items-center gap-3 cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-zinc-100 truncate">
                        {c.name}
                        {c.role === 'gm' && <span className="ml-2 text-[10px] text-amber-500 normal-case">{t('campaignYouAreGm')}</span>}
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-1">
                        {c.factions.join(' vs ')}
                        {c.faction && <span className="text-amber-600"> · {t('campaignPlayingPrefix')} {c.faction}</span>}
                      </div>
                    </div>
                    <div className="text-[11px] font-mono tracking-widest text-amber-500 shrink-0">{c.invite_code}</div>
                  </div>
                  {openId === c.id && (
                    <div className="border-t border-zinc-700 bg-zinc-950/40">
                      {/* Tab bar */}
                      <div className="flex border-b border-zinc-700">
                        {(['players', 'map'] as const).map(tab => (
                          <button key={tab}
                            onClick={() => setOpenTab(tab)}
                            className={`flex-1 text-[10px] py-2 uppercase tracking-wide ${openTab === tab ? 'text-amber-400 border-b-2 border-amber-600' : 'text-zinc-500 hover:text-zinc-300'}`}>
                            {tab === 'players' ? t('campaignTabPlayers') : t('campaignTabMap')}
                          </button>
                        ))}
                      </div>
                      <div className="p-3">
                        {openTab === 'players' ? (
                          playersLoading ? (
                            <p className="text-zinc-500 text-xs">{t('campaignLoadingPlayers')}</p>
                          ) : (
                            <div className="space-y-1">
                              {players.map(p => (
                                <div key={p.username} className="flex justify-between text-[12px]">
                                  <span className="text-zinc-300">{p.username}{p.role === 'gm' && <span className="text-amber-600"> {t('campaignGmSuffix')}</span>}</span>
                                  <span className="text-zinc-500">{p.faction ?? '—'}</span>
                                </div>
                              ))}
                            </div>
                          )
                        ) : (
                          <CampaignMapView campaign={c} isGm={c.role === 'gm'} />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 py-3 border-t border-zinc-700 flex justify-end bg-zinc-800">
          <button onClick={onClose} className="px-4 py-1.5 bg-zinc-700 border border-zinc-600 text-zinc-200 text-sm hover:bg-zinc-600 uppercase tracking-wide">
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
}
