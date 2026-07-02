import { useEffect, useState } from 'react';
import * as api from '../lib/api';
import { useT } from '../i18n';

interface Props {
  campaign: api.CampaignSummary;
  isGm: boolean;
}

const FACTION_PALETTE = ['#f59e0b','#38bdf8','#34d399','#fb7185','#a78bfa','#fb923c'];

function factionDot(faction: string, factions: string[]) {
  const idx = factions.indexOf(faction);
  const color = idx >= 0 ? FACTION_PALETTE[idx % FACTION_PALETTE.length] : '#a1a1aa';
  return <span className="inline-block w-2 h-2 rounded-full mr-1 shrink-0" style={{ background: color }} />;
}

export function CampaignBattleLog({ campaign, isGm }: Props) {
  const t = useT();
  const [battles, setBattles] = useState<api.CampaignBattle[]>([]);
  const [sectors, setSectors] = useState<api.CampaignSector[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Log-battle form state
  const [showForm, setShowForm] = useState(false);
  const [attacker, setAttacker] = useState(campaign.factions[0] ?? '');
  const [defender, setDefender] = useState(campaign.factions[1] ?? '');
  const [winner, setWinner] = useState<string>('draw');
  const [sectorId, setSectorId] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [logging, setLogging] = useState(false);

  async function load() {
    setLoading(true); setError('');
    try {
      const [bRes, sRes] = await Promise.all([
        api.listBattles(campaign.id),
        api.listCampaignSectors(campaign.id),
      ]);
      setBattles(bRes.battles);
      setSectors(sRes.sectors);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [campaign.id]);

  async function handleLog() {
    setLogging(true); setError('');
    try {
      const winnerFaction = winner === 'draw' ? null : winner;
      await api.logBattle(campaign.id, attacker, defender, winnerFaction, sectorId, notes);
      setShowForm(false);
      setNotes('');
      setSectorId(null);
      setWinner('draw');
      await load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLogging(false);
    }
  }

  const winnerOptions = [
    { value: attacker, label: attacker },
    { value: defender, label: defender },
    { value: 'draw', label: t('campaignDraw') },
  ];

  if (loading) return <p className="text-zinc-500 text-xs py-4 text-center">{t('loadingEllipsis')}</p>;

  return (
    <div className="space-y-3">
      {error && <p className="text-red-400 text-xs">{error}</p>}

      {isGm && (
        <div>
          <button
            onClick={() => setShowForm(v => !v)}
            className="text-[11px] px-3 py-1.5 bg-amber-800 border border-amber-600 text-white hover:bg-amber-700 uppercase tracking-wide"
          >
            {showForm ? t('cancel') : t('campaignLogBattle')}
          </button>

          {showForm && (
            <div className="mt-2 bg-zinc-800/60 border border-zinc-700 p-3 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase tracking-wide block mb-1">{t('campaignAttacker')}</label>
                  <select value={attacker} onChange={e => setAttacker(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs px-2 py-1.5 outline-none focus:border-amber-700">
                    {campaign.factions.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase tracking-wide block mb-1">{t('campaignDefender')}</label>
                  <select value={defender} onChange={e => setDefender(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs px-2 py-1.5 outline-none focus:border-amber-700">
                    {campaign.factions.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-wide block mb-1">{t('campaignWinner')}</label>
                <select value={winner} onChange={e => setWinner(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs px-2 py-1.5 outline-none focus:border-amber-700">
                  {winnerOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              {sectors.length > 0 && (
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase tracking-wide block mb-1">{t('campaignSectorContested')}</label>
                  <select value={sectorId ?? ''} onChange={e => setSectorId(e.target.value ? Number(e.target.value) : null)}
                    className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs px-2 py-1.5 outline-none focus:border-amber-700">
                    <option value="">{t('campaignNoneContested')}</option>
                    {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              )}

              <input
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder={t('campaignBattleNotes')}
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-amber-700 text-zinc-200 text-xs px-2 py-1.5 outline-none"
              />

              <button
                onClick={handleLog}
                disabled={logging || attacker === defender}
                className="text-[11px] px-3 py-1.5 bg-amber-800 border border-amber-600 text-white hover:bg-amber-700 disabled:opacity-50 uppercase tracking-wide"
              >
                {logging ? t('campaignLogging') : t('campaignLogBattle')}
              </button>
            </div>
          )}
        </div>
      )}

      {battles.length === 0 ? (
        <p className="text-zinc-500 italic text-xs">{t('campaignNoBattles')}</p>
      ) : (
        <div className="space-y-1.5">
          {battles.map(b => (
            <div key={b.id} className="bg-zinc-800 border border-zinc-700 px-3 py-2 text-[11px]">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-zinc-500 font-mono shrink-0">{t('campaignTurnLabel')} {b.turn}</span>
                <span className="text-zinc-400">·</span>
                <span className="flex items-center">{factionDot(b.attacker_faction, campaign.factions)}{b.attacker_faction}</span>
                <span className="text-zinc-500">vs</span>
                <span className="flex items-center">{factionDot(b.defender_faction, campaign.factions)}{b.defender_faction}</span>
                <span className="text-zinc-400">→</span>
                {b.winner_faction
                  ? <span className="flex items-center text-amber-400 font-semibold">{factionDot(b.winner_faction, campaign.factions)}{b.winner_faction}</span>
                  : <span className="text-zinc-400">{t('campaignDraw')}</span>
                }
                {b.sector_name && <span className="text-zinc-500 ml-1">({b.sector_name})</span>}
              </div>
              {b.notes && <p className="text-zinc-500 mt-1 italic">{b.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
