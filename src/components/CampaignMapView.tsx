import { useEffect, useState } from 'react';
import * as api from '../lib/api';
import { useT } from '../i18n';

interface Props {
  campaign: api.CampaignSummary;
  isGm: boolean;
}

// Connections between default sector indices (0=center, 1=N, 2=NE, 3=SE, 4=S, 5=SW, 6=NW)
const EDGES: [number, number][] = [
  [0,1],[0,2],[0,3],[0,4],[0,5],[0,6],
  [1,2],[2,3],[3,4],[4,5],[5,6],[6,1],
];

const SECTOR_COLORS: Record<api.SectorType, string> = {
  city:       '#f59e0b',
  industrial: '#38bdf8',
  wasteland:  '#a1a1aa',
  ruin:       '#f87171',
};

const FACTION_PALETTE = ['#f59e0b','#38bdf8','#34d399','#fb7185','#a78bfa','#fb923c'];

function factionColor(faction: string, factions: string[]): string {
  const idx = factions.indexOf(faction);
  return idx >= 0 ? FACTION_PALETTE[idx % FACTION_PALETTE.length] : '#a1a1aa';
}

export function CampaignMapView({ campaign, isGm }: Props) {
  const t = useT();
  const [sectors, setSectors] = useState<api.CampaignSector[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [initializing, setInitializing] = useState(false);
  const [selected, setSelected] = useState<api.CampaignSector | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true); setError('');
    try {
      const res = await api.listCampaignSectors(campaign.id);
      setSectors(res.sectors);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [campaign.id]);

  async function handleInit() {
    setInitializing(true); setError('');
    try {
      const res = await api.initCampaignSectors(campaign.id);
      setSectors(res.sectors);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setInitializing(false);
    }
  }

  async function handleClaim(ownerFaction: string | null) {
    if (!selected) return;
    setSaving(true); setError('');
    try {
      await api.claimSector(campaign.id, selected.id, ownerFaction);
      setSectors(prev => prev.map(s => s.id === selected.id ? { ...s, owner_faction: ownerFaction } : s));
      setSelected(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  const sectorTypeLabel = (t2: api.SectorType) => ({
    city: t('campaignSectorCity'),
    industrial: t('campaignSectorIndustrial'),
    wasteland: t('campaignSectorWasteland'),
    ruin: t('campaignSectorRuin'),
  }[t2]);

  if (loading) return <p className="text-zinc-500 text-xs py-4 text-center">{t('loadingEllipsis')}</p>;

  if (sectors.length === 0) {
    return (
      <div className="text-center py-6 space-y-3">
        <p className="text-zinc-500 text-xs italic">{t('campaignMapEmpty')}</p>
        {isGm && (
          <button
            onClick={handleInit}
            disabled={initializing}
            className="text-[11px] px-4 py-2 bg-amber-800 border border-amber-600 text-white hover:bg-amber-700 disabled:opacity-50 uppercase tracking-wide"
          >
            {initializing ? t('campaignInitializing') : t('campaignInitMap')}
          </button>
        )}
        {error && <p className="text-red-400 text-xs">{error}</p>}
      </div>
    );
  }

  // Build viewBox from sector positions
  const xs = sectors.map(s => s.x);
  const ys = sectors.map(s => s.y);
  const pad = 60;
  const minX = Math.min(...xs) - pad, maxX = Math.max(...xs) + pad;
  const minY = Math.min(...ys) - pad, maxY = Math.max(...ys) + pad;
  const vw = maxX - minX, vh = maxY - minY;

  return (
    <div className="space-y-3">
      {error && <p className="text-red-400 text-xs">{error}</p>}

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-[10px] text-zinc-400">
        {campaign.factions.map((f, i) => (
          <span key={f} className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: FACTION_PALETTE[i % FACTION_PALETTE.length] }} />
            {f}
          </span>
        ))}
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full inline-block bg-zinc-600" />
          {t('campaignUnclaimed')}
        </span>
      </div>

      {/* SVG map */}
      <div className="bg-zinc-950 border border-zinc-700 overflow-hidden">
        <svg viewBox={`${minX} ${minY} ${vw} ${vh}`} className="w-full" style={{ maxHeight: 340 }}>
          {/* Edges */}
          {EDGES.map(([a, b]) => {
            const sa = sectors[a], sb = sectors[b];
            if (!sa || !sb) return null;
            return (
              <line key={`${a}-${b}`}
                x1={sa.x} y1={sa.y} x2={sb.x} y2={sb.y}
                stroke="#3f3f46" strokeWidth="1.5"
              />
            );
          })}
          {/* Nodes */}
          {sectors.map(s => {
            const fill = s.owner_faction
              ? factionColor(s.owner_faction, campaign.factions)
              : '#3f3f46';
            const typeColor = SECTOR_COLORS[s.sector_type] ?? '#a1a1aa';
            const isSelected = selected?.id === s.id;
            return (
              <g key={s.id} onClick={() => isGm && setSelected(isSelected ? null : s)}
                className={isGm ? 'cursor-pointer' : ''}>
                {/* Outer ring = sector type color */}
                <circle cx={s.x} cy={s.y} r={22} fill={typeColor} opacity={0.3}
                  stroke={isSelected ? '#f59e0b' : typeColor} strokeWidth={isSelected ? 2 : 1}
                />
                {/* Inner fill = owner color */}
                <circle cx={s.x} cy={s.y} r={16} fill={fill} />
                {/* Sector name */}
                <text x={s.x} y={s.y + 34} textAnchor="middle"
                  fontSize="9" fill="#d4d4d8" className="select-none pointer-events-none">
                  {s.name}
                </text>
                <text x={s.x} y={s.y + 44} textAnchor="middle"
                  fontSize="7.5" fill="#71717a" className="select-none pointer-events-none">
                  {sectorTypeLabel(s.sector_type)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* GM claim panel */}
      {isGm && selected && (
        <div className="bg-zinc-800/60 border border-zinc-700 p-3 space-y-2">
          <p className="text-zinc-300 text-xs font-semibold">
            {selected.name} — {t('campaignClaimFor')}
          </p>
          <div className="flex flex-wrap gap-2">
            {campaign.factions.map(f => (
              <button key={f} onClick={() => handleClaim(f)} disabled={saving}
                className="text-[11px] px-3 py-1.5 bg-zinc-700 border border-zinc-600 text-zinc-200 hover:bg-zinc-600 disabled:opacity-50 uppercase tracking-wide">
                {saving ? t('campaignSaving') : f}
              </button>
            ))}
            <button onClick={() => handleClaim(null)} disabled={saving}
              className="text-[11px] px-3 py-1.5 bg-zinc-900 border border-zinc-600 text-zinc-400 hover:bg-zinc-700 disabled:opacity-50 uppercase tracking-wide">
              {t('campaignUnclaimed')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
