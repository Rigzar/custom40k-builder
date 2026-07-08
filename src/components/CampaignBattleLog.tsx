import { useEffect, useState } from 'react';
import * as api from '../lib/api';
import { useT } from '../i18n';

interface Props {
  campaign: api.CampaignSummary;
  isGm: boolean;
  onSectorChanged?: () => void;
}

const FACTION_PALETTE = ['#f59e0b','#38bdf8','#34d399','#fb7185','#a78bfa','#fb923c'];

function factionDot(faction: string, factions: string[]) {
  const idx = factions.indexOf(faction);
  const color = idx >= 0 ? FACTION_PALETTE[idx % FACTION_PALETTE.length] : '#a1a1aa';
  return <span className="inline-block w-2 h-2 rounded-full mr-1 shrink-0" style={{ background: color }} />;
}

const ENGAGEMENT_TYPES: { key: api.EngagementType; label: string; cost: number }[] = [
  { key: 'kill-team', label: 'KILL TEAM',    cost: 0 },
  { key: 'skirmish',  label: 'SKIRMISH',     cost: 1 },
  { key: 'pitched',   label: 'PITCHED',      cost: 3 },
  { key: 'epic',      label: 'EPIC BATTLE',  cost: 6 },
];

const ENGAGEMENT_COLORS: Record<api.EngagementType, string> = {
  'kill-team': '#39d353',
  skirmish:    '#ffb020',
  pitched:     '#fb7185',
  epic:        '#a78bfa',
};

export function CampaignBattleLog({ campaign, isGm, onSectorChanged }: Props) {
  const t = useT();
  const [battles, setBattles] = useState<api.CampaignBattle[]>([]);
  const [sectors, setSectors] = useState<api.CampaignSector[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  const [showForm, setShowForm]       = useState(false);
  const [attacker, setAttacker]       = useState(campaign.factions[0] ?? '');
  const [defender, setDefender]       = useState(campaign.factions[1] ?? '');
  const [winner, setWinner]           = useState<string>('draw');
  const [engType, setEngType]         = useState<api.EngagementType>('pitched');
  const [sectorId, setSectorId]       = useState<number | null>(null);
  const [notes, setNotes]             = useState('');
  const [logging, setLogging]         = useState(false);
  const [lastCost, setLastCost]       = useState<number | null>(null);

  async function load() {
    setLoading(true); setError('');
    try {
      const [bRes, sRes] = await Promise.all([
        api.listBattles(campaign.id),
        api.listCampaignSectors(campaign.id),
      ]);
      setBattles(bRes.battles);
      setSectors(sRes.sectors);
    } catch (err) { setError((err as Error).message); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, [campaign.id]);

  async function handleLog() {
    setLogging(true); setError(''); setLastCost(null);
    try {
      const winnerFaction = winner === 'draw' ? null : winner;
      const res = await api.logBattle(campaign.id, attacker, defender, winnerFaction, sectorId, notes, engType);
      setLastCost(res.supplyCostDeducted);
      setShowForm(false);
      setNotes('');
      setSectorId(null);
      setWinner('draw');
      if (winnerFaction && sectorId) onSectorChanged?.();
      await load();
    } catch (err) { setError((err as Error).message); }
    finally { setLogging(false); }
  }

  const selectedEng = ENGAGEMENT_TYPES.find(e => e.key === engType)!;

  if (loading) return (
    <div className="cog-text text-center py-8 text-sm cog-flicker">
      ▌ RETRIEVING ENGAGEMENT RECORDS... ▐
    </div>
  );

  return (
    <div className="space-y-3">
      {error && <p className="cog-text-red text-[10px]">⚠ {error}</p>}

      {lastCost !== null && lastCost > 0 && (
        <div className="cog-panel cog-appear px-3 py-2">
          <p className="cog-text-amber text-[10px]">
            ◈ SUPPLY DEDUCTED: −{lastCost} ⊗ from {attacker}
          </p>
        </div>
      )}

      {isGm && (
        <div>
          <button className={`cog-btn cog-btn-amber text-[10px] ${showForm ? 'cog-btn-active' : ''}`}
            onClick={() => setShowForm(v => !v)}>
            {showForm ? '× ABORT' : '+ LOG ENGAGEMENT'}
          </button>

          {showForm && (
            <div className="cog-panel cog-appear mt-2 p-3 space-y-2.5">
              <p className="cog-text-dim text-[9px] tracking-widest">◈ ENGAGEMENT LOG ENTRY ◈</p>

              {/* Engagement type */}
              <div>
                <p className="cog-text-dim text-[9px] tracking-wide mb-1">ENGAGEMENT TYPE</p>
                <div className="grid grid-cols-4 gap-1">
                  {ENGAGEMENT_TYPES.map(e => (
                    <button key={e.key}
                      onClick={() => setEngType(e.key)}
                      className={`cog-btn text-[9px] py-1 ${engType === e.key ? 'cog-btn-active' : ''}`}
                      style={engType === e.key ? { borderColor: ENGAGEMENT_COLORS[e.key], color: ENGAGEMENT_COLORS[e.key] } : {}}
                    >
                      {e.label}
                      {e.cost > 0 && <span className="block text-[8px] opacity-60">−{e.cost} ⊗</span>}
                      {e.cost === 0 && <span className="block text-[8px] opacity-60">FREE</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Attacker / Defender */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="cog-text-dim text-[9px] tracking-wide mb-1">{t('campaignAttacker').toUpperCase()}</p>
                  <select value={attacker} onChange={e => setAttacker(e.target.value)}
                    className="cog-select w-full text-[11px]">
                    {campaign.factions.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <p className="cog-text-dim text-[9px] tracking-wide mb-1">{t('campaignDefender').toUpperCase()}</p>
                  <select value={defender} onChange={e => setDefender(e.target.value)}
                    className="cog-select w-full text-[11px]">
                    {campaign.factions.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>

              {/* Winner */}
              <div>
                <p className="cog-text-dim text-[9px] tracking-wide mb-1">{t('campaignWinner').toUpperCase()}</p>
                <div className="grid grid-cols-3 gap-1">
                  {[attacker, defender, 'draw'].map(opt => (
                    <button key={opt} onClick={() => setWinner(opt)}
                      className={`cog-btn text-[10px] py-1 ${winner === opt ? 'cog-btn-active' : ''}`}>
                      {opt === 'draw' ? t('campaignDraw').toUpperCase() : opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sector */}
              {sectors.length > 0 && (
                <div>
                  <p className="cog-text-dim text-[9px] tracking-wide mb-1">CONTESTED SECTOR</p>
                  <select value={sectorId ?? ''}
                    onChange={e => setSectorId(e.target.value ? Number(e.target.value) : null)}
                    className="cog-select w-full text-[11px]">
                    <option value="">— none —</option>
                    {sectors.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name}{s.owner_faction ? ` [${s.owner_faction}]` : ''}
                      </option>
                    ))}
                  </select>
                  {sectorId && winner !== 'draw' && (
                    <p className="cog-text-amber text-[9px] mt-1">
                      ◈ Sector will be AUTO-CLAIMED by {winner} on submit
                    </p>
                  )}
                </div>
              )}

              {/* Notes */}
              <input value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="Battle notes..."
                className="cog-input w-full text-[11px]" />

              <button className="cog-btn cog-btn-amber w-full text-[10px]"
                disabled={logging || attacker === defender}
                onClick={handleLog}>
                {logging ? 'TRANSMITTING...' : `SUBMIT ENGAGEMENT REPORT${selectedEng.cost > 0 ? ` (−${selectedEng.cost} ⊗)` : ''}`}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Battle history */}
      {battles.length === 0 ? (
        <p className="cog-text-dim text-[10px] italic">— no engagements recorded —</p>
      ) : (
        <div className="space-y-1.5">
          {battles.map((b, i) => {
            const engColor = ENGAGEMENT_COLORS[b.engagement_type] ?? '#39d353';
            return (
              <div key={b.id} className="cog-panel cog-appear p-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="cog-text-dim text-[9px] shrink-0">
                    T.{String(b.turn).padStart(3,'0')}.{String(i + 1).padStart(2,'0')}
                  </span>
                  <span className="text-[9px] font-bold tracking-widest shrink-0"
                    style={{ color: engColor }}>
                    [{b.engagement_type.toUpperCase()}]
                  </span>
                  <span className="text-[10px] cog-text flex items-center">
                    {factionDot(b.attacker_faction, campaign.factions)}{b.attacker_faction}
                  </span>
                  <span className="cog-text-dim text-[9px]">▸</span>
                  <span className="text-[10px] cog-text flex items-center">
                    {factionDot(b.defender_faction, campaign.factions)}{b.defender_faction}
                  </span>
                  <span className="cog-text-dim text-[9px]">→</span>
                  {b.winner_faction
                    ? <span className="text-[10px] cog-text-amber font-bold flex items-center">
                        {factionDot(b.winner_faction, campaign.factions)}{b.winner_faction}
                      </span>
                    : <span className="cog-text-dim text-[10px]">DRAW</span>
                  }
                  {b.sector_name && (
                    <span className="cog-text-dim text-[9px] ml-1">({b.sector_name})</span>
                  )}
                </div>
                {b.notes && <p className="cog-text-dim text-[9px] mt-0.5 italic pl-4">› {b.notes}</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
