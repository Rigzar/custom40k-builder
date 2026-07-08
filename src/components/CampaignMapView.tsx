import { useEffect, useState, useRef } from 'react';
import * as api from '../lib/api';
import { useT } from '../i18n';

interface Props {
  campaign: api.CampaignSummary;
  isGm: boolean;
  refreshTick?: number;
}

const EDGES: [number, number][] = [
  [0,1],[0,2],[0,3],[0,4],[0,5],[0,6],
  [1,2],[2,3],[3,4],[4,5],[5,6],[6,1],
];

const SECTOR_COLORS: Record<api.SectorType, string> = {
  city:       '#ffb020',
  industrial: '#39d353',
  wasteland:  '#6b7280',
  ruin:       '#ff3030',
};

const SECTOR_TYPE_LABELS: Record<api.SectorType, string> = {
  city:       'CITY',
  industrial: 'INDUSTRIAL',
  wasteland:  'WASTELAND',
  ruin:       'RUIN',
};

const FACTION_PALETTE = ['#ffb020','#38bdf8','#34d399','#fb7185','#a78bfa','#fb923c'];

function factionColor(faction: string, factions: string[]): string {
  const idx = factions.indexOf(faction);
  return idx >= 0 ? FACTION_PALETTE[idx % FACTION_PALETTE.length] : '#1a5c25';
}

export function CampaignMapView({ campaign, isGm, refreshTick }: Props) {
  const t = useT();
  const [sectors, setSectors] = useState<api.CampaignSector[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [initializing, setInitializing] = useState(false);
  const [selected, setSelected] = useState<api.CampaignSector | null>(null);
  const [saving, setSaving] = useState(false);
  const [renameMode, setRenameMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState<api.SectorType>('wasteland');
  const [renaming, setRenaming] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => { load(); }, [campaign.id, refreshTick]);

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

  function openRename(s: api.CampaignSector) {
    setEditName(s.name);
    setEditType(s.sector_type);
    setRenameMode(true);
    setTimeout(() => nameInputRef.current?.focus(), 50);
  }

  async function handleRename() {
    if (!selected) return;
    setRenaming(true); setError('');
    try {
      await api.renameSector(campaign.id, selected.id, editName, editType);
      setSectors(prev => prev.map(s => s.id === selected.id ? { ...s, name: editName.trim(), sector_type: editType } : s));
      setSelected(s => s ? { ...s, name: editName.trim(), sector_type: editType } : s);
      setRenameMode(false);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setRenaming(false);
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

  if (loading) return (
    <div className="cog-text text-center py-8 text-sm cog-flicker">
      ▌ SCANNING PLANETARY SURFACE... ▐
    </div>
  );

  if (sectors.length === 0) {
    return (
      <div className="text-center py-6 space-y-3">
        <p className="cog-text-dim text-[11px] italic">[ NO SECTORS MAPPED ]</p>
        {isGm && (
          <button onClick={handleInit} disabled={initializing} className="cog-btn cog-btn-amber text-[10px]">
            {initializing ? '⌛ SCANNING...' : '◈ INITIALISE PLANETARY MAP'}
          </button>
        )}
        {error && <p className="cog-text-red text-xs">⚠ {error}</p>}
      </div>
    );
  }

  // Build viewBox
  const xs = sectors.map(s => s.x);
  const ys = sectors.map(s => s.y);
  const pad = 65;
  const minX = Math.min(...xs) - pad, maxX = Math.max(...xs) + pad;
  const minY = Math.min(...ys) - pad, maxY = Math.max(...ys) + pad;
  const vw = maxX - minX, vh = maxY - minY;

  return (
    <div className="space-y-3">
      {error && <p className="cog-text-red text-[10px]">⚠ {error}</p>}

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-[9px]">
        {campaign.factions.map((f, i) => (
          <span key={f} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full inline-block border border-[#39d353]"
              style={{ background: FACTION_PALETTE[i % FACTION_PALETTE.length] }} />
            <span className="cog-text tracking-wide">{f}</span>
          </span>
        ))}
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full inline-block bg-[#030a03] border border-[#1a5c25]" />
          <span className="cog-text-dim">UNCLAIMED</span>
        </span>
      </div>

      {/* SVG cogitator map */}
      <div className="relative border border-[#1a5c25] bg-[#020702] overflow-hidden cog-scanlines">
        {/* Corner brackets */}
        <div className="absolute top-1 left-1 w-4 h-4 border-t border-l border-[#57ff6a] pointer-events-none z-10" />
        <div className="absolute top-1 right-1 w-4 h-4 border-t border-r border-[#57ff6a] pointer-events-none z-10" />
        <div className="absolute bottom-1 left-1 w-4 h-4 border-b border-l border-[#57ff6a] pointer-events-none z-10" />
        <div className="absolute bottom-1 right-1 w-4 h-4 border-b border-r border-[#57ff6a] pointer-events-none z-10" />

        <svg viewBox={`${minX} ${minY} ${vw} ${vh}`} className="w-full" style={{ maxHeight: 340 }}>
          {/* Grid lines (cogitator aesthetic) */}
          <defs>
            <pattern id="cog-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#0d2410" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect x={minX} y={minY} width={vw} height={vh} fill="url(#cog-grid)" />

          {/* Edges — green scanline aesthetic */}
          {EDGES.map(([a, b]) => {
            const sa = sectors[a], sb = sectors[b];
            if (!sa || !sb) return null;
            return (
              <line key={`${a}-${b}`}
                x1={sa.x} y1={sa.y} x2={sb.x} y2={sb.y}
                stroke="#1a5c25" strokeWidth="1.5" strokeDasharray="4 3"
              />
            );
          })}

          {/* Sector nodes */}
          {sectors.map(s => {
            const ownerCol = s.owner_faction
              ? factionColor(s.owner_faction, campaign.factions)
              : 'none';
            const typeCol  = SECTOR_COLORS[s.sector_type] ?? '#39d353';
            const isSelected = selected?.id === s.id;

            return (
              <g key={s.id}
                onClick={() => {
                  if (!isGm) return;
                  if (isSelected) { setSelected(null); setRenameMode(false); }
                  else { setSelected(s); setRenameMode(false); }
                }}
                className={isGm ? 'cursor-pointer' : ''}>

                {/* Outer glow ring — selection */}
                {isSelected && (
                  <circle cx={s.x} cy={s.y} r={27}
                    fill="none" stroke="#57ff6a" strokeWidth="1.5" opacity="0.6"
                    style={{ animation: 'cog-glow-pulse 1.5s ease-in-out infinite' }} />
                )}

                {/* Sector type ring */}
                <circle cx={s.x} cy={s.y} r={22}
                  fill="#020702" stroke={typeCol} strokeWidth={isSelected ? 2 : 1.2} opacity={0.9} />

                {/* Owner fill */}
                {s.owner_faction && (
                  <circle cx={s.x} cy={s.y} r={16} fill={ownerCol} opacity={0.35} />
                )}

                {/* Inner hex shape (decorative) */}
                <circle cx={s.x} cy={s.y} r={10}
                  fill={s.owner_faction ? ownerCol : '#030a03'}
                  stroke={s.owner_faction ? ownerCol : '#1a5c25'}
                  strokeWidth="1" opacity={0.7} />

                {/* Type indicator dot */}
                <circle cx={s.x + 14} cy={s.y - 14} r={4}
                  fill={typeCol} opacity={0.8} />

                {/* Sector name */}
                <text x={s.x} y={s.y + 35} textAnchor="middle"
                  fontSize="9" fill="#57ff6a" fontFamily="'Courier New', monospace"
                  className="select-none pointer-events-none" style={{ letterSpacing: 1 }}>
                  {s.name.toUpperCase()}
                </text>
                <text x={s.x} y={s.y + 45} textAnchor="middle"
                  fontSize="7" fill="#1a5c25" fontFamily="'Courier New', monospace"
                  className="select-none pointer-events-none">
                  {SECTOR_TYPE_LABELS[s.sector_type]}
                  {s.owner_faction ? ` · ${s.owner_faction.toUpperCase().slice(0, 6)}` : ''}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Sector type legend */}
      <div className="flex flex-wrap gap-3 text-[9px]">
        {(Object.entries(SECTOR_COLORS) as [api.SectorType, string][]).map(([type, col]) => (
          <span key={type} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: col, opacity: 0.8 }} />
            <span className="cog-text-dim">{SECTOR_TYPE_LABELS[type]}</span>
          </span>
        ))}
      </div>

      {/* GM action panel */}
      {isGm && selected && (
        <div className="cog-panel cog-appear">
          <div className="flex border-b border-[#1a5c25]">
            {(['claim', 'rename'] as const).map(mode => (
              <button key={mode}
                onClick={() => {
                  if (mode === 'rename') openRename(selected);
                  else setRenameMode(false);
                }}
                className={`flex-1 text-[9px] py-1.5 uppercase tracking-widest ${renameMode === (mode === 'rename') ? 'cog-text-amber border-b border-[#ffb020]' : 'cog-text-dim hover:cog-text'}`}>
                {mode === 'claim' ? t('campaignClaimFor') : t('campaignRenameSector')}
              </button>
            ))}
          </div>

          <div className="p-3 space-y-2">
            {!renameMode ? (
              <>
                <p className="cog-text-bright text-[11px] tracking-wide">{selected.name.toUpperCase()}</p>
                <div className="flex flex-wrap gap-1.5">
                  {campaign.factions.map(f => (
                    <button key={f} onClick={() => handleClaim(f)} disabled={saving}
                      className="cog-btn text-[10px] py-1 px-2">
                      {saving ? '...' : f}
                    </button>
                  ))}
                  <button onClick={() => handleClaim(null)} disabled={saving}
                    className="cog-btn cog-btn-danger text-[10px] py-1 px-2">
                    {t('campaignUnclaimed')}
                  </button>
                </div>
              </>
            ) : (
              <>
                <input ref={nameInputRef} value={editName} onChange={e => setEditName(e.target.value)}
                  className="cog-input w-full text-[11px]"
                  placeholder={t('campaignSectorNameLabel')} />
                <select value={editType} onChange={e => setEditType(e.target.value as api.SectorType)}
                  className="cog-select w-full text-[11px]">
                  {(['city','industrial','wasteland','ruin'] as api.SectorType[]).map(tp => (
                    <option key={tp} value={tp}>{SECTOR_TYPE_LABELS[tp]}</option>
                  ))}
                </select>
                <button onClick={handleRename} disabled={renaming || !editName.trim()}
                  className="cog-btn cog-btn-amber text-[10px]">
                  {renaming ? 'UPDATING...' : t('createLabel')}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
