import { useEffect, useState } from 'react';
import * as api from '../lib/api';
import { useT } from '../i18n';

const SLOTS = ['HQ', 'Troops', 'Elites', 'Fast Attack', 'Heavy Support', 'Dedicated Transport', 'Flyers', 'Lords of War'];
const STATUSES: api.CampaignRosterEntry['status'][] = ['active', 'wounded', 'dead'];

// Traits from Planetary Assault supplement, by unit class
const TRAITS_BY_CLASS: Record<string, { key: string; label: string; effect: string }[]> = {
  Infantry: [
    { key: 'battle-tested',     label: 'Battle-Tested',     effect: 'Gains Objective Secured (or ignores enemy contesting)' },
    { key: 'cool-headed',       label: 'Cool-Headed',        effect: 'Re-roll failed Leadership tests' },
    { key: 'fleet-of-foot',     label: 'Fleet of Foot',      effect: 'Roll 2D6 Advance, take highest + Move through cover' },
    { key: 'grizzled',          label: 'Grizzled',            effect: '6+ invulnerability save' },
    { key: 'rapid-deployment',  label: 'Rapid Deployment',   effect: 'Gains Vanguard + +1 to Reinforcement arrival roll' },
    { key: 'veteran-warriors',  label: 'Veteran Warriors',   effect: 'Re-roll one to-hit die per activation' },
  ],
  MC: [
    { key: 'apex-predator',    label: 'Apex Predator',   effect: 'Re-roll one to-hit die per activation' },
    { key: 'frenzied',         label: 'Frenzied',         effect: 'Gains Furious Charge' },
    { key: 'regeneration',     label: 'Regeneration',     effect: 'Gains Regeneration(1)' },
    { key: 'terrifying',       label: 'Terrifying',       effect: 'Gains Terrifying(−2) — stacks with existing' },
    { key: 'thickened-hide',   label: 'Thickened Hide',   effect: '+1 to armour save' },
    { key: 'unstoppable',      label: 'Unstoppable',      effect: 'Roll 2D6 Advance, take highest + Move through cover' },
  ],
  Vehicle: [
    { key: 'expert-gunnery',      label: 'Expert Gunnery',      effect: 'Re-roll one to-hit die per activation' },
    { key: 'blessed-hull',        label: 'Blessed Hull',         effect: '6+ invulnerability save' },
    { key: 'hardened-crew',       label: 'Hardened Crew',        effect: 'Ignore one temporary vehicle damage per round' },
    { key: 'enhanced-engines',    label: 'Enhanced Engines',     effect: 'Gains Fast' },
    { key: 'improved-shielding',  label: 'Improved Shielding',   effect: 'Reduce first damage roll each round by 1 (min 1)' },
    { key: 'repair-system',       label: 'Repair System',        effect: 'Roll 1D6 at activation start: on 5+ remove Weapon Destroyed/Engine Damage or regain 1 HP' },
  ],
};

function traitClassForSlot(slot: string): string {
  if (slot === 'Heavy Support' || slot === 'Dedicated Transport' || slot === 'Flyers' || slot === 'Lords of War') return 'Vehicle';
  if (slot === 'Elites') return 'MC'; // default — player can choose
  return 'Infantry';
}

const STATUS_STYLE: Record<api.CampaignRosterEntry['status'], string> = {
  active:  'cog-text',
  wounded: 'cog-text-amber',
  dead:    'cog-text-red',
};

interface Props {
  campaign: api.CampaignSummary;
  isGm: boolean;
  myFaction: string | null;
}

export function CampaignRosterView({ campaign, isGm, myFaction }: Props) {
  const t = useT();
  const [roster, setRoster]   = useState<api.CampaignRosterEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [busy, setBusy]       = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [traitFeedback, setTraitFeedback] = useState('');

  const [showAdd, setShowAdd]       = useState(false);
  const [addName, setAddName]       = useState('');
  const [addFaction, setAddFaction] = useState(myFaction ?? campaign.factions[0] ?? '');
  const [addSlot, setAddSlot]       = useState('HQ');
  const [adding, setAdding]         = useState(false);

  async function load() {
    setLoading(true); setError('');
    try {
      const res = await api.listRoster(campaign.id);
      setRoster(res.roster);
    } catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, [campaign.id]);

  async function handleAdd() {
    if (!addName.trim()) return;
    setAdding(true); setError('');
    try {
      const res = await api.addRosterUnit(campaign.id, addFaction, addName.trim(), addSlot);
      setRoster(prev => [...prev, res.unit]);
      setAddName(''); setShowAdd(false);
    } catch (e) { setError((e as Error).message); }
    finally { setAdding(false); }
  }

  async function cycleStatus(unit: api.CampaignRosterEntry) {
    const next = STATUSES[(STATUSES.indexOf(unit.status) + 1) % STATUSES.length];
    setBusy(unit.id); setError('');
    try {
      const res = await api.updateRosterUnit(campaign.id, unit.id, { status: next });
      setRoster(prev => prev.map(u => u.id === unit.id ? res.unit : u));
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(null); }
  }

  async function adjustXp(unit: api.CampaignRosterEntry, delta: number) {
    setBusy(unit.id); setError('');
    try {
      const res = await api.updateRosterUnit(campaign.id, unit.id, { xp: Math.max(0, unit.xp + delta) });
      setRoster(prev => prev.map(u => u.id === unit.id ? res.unit : u));
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(null); }
  }

  async function setTrait(unit: api.CampaignRosterEntry, trait: string | null) {
    setBusy(unit.id); setError(''); setTraitFeedback('');
    try {
      const res = await api.updateRosterUnit(campaign.id, unit.id, { trait }) as any;
      setRoster(prev => prev.map(u => u.id === unit.id ? res.unit : u));
      if (res.traitCostDeducted > 0) {
        setTraitFeedback(`◈ TRAIT ASSIGNED — −${res.traitCostDeducted} ⊗ deducted`);
      }
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(null); }
  }

  async function handleRemove(unit: api.CampaignRosterEntry) {
    setBusy(unit.id); setError('');
    try {
      await api.removeRosterUnit(campaign.id, unit.id);
      setRoster(prev => prev.filter(u => u.id !== unit.id));
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(null); }
  }

  function canEdit(unit: api.CampaignRosterEntry) {
    return isGm || unit.faction === myFaction;
  }

  const factions = [...new Set(roster.map(u => u.faction))].sort();

  if (loading) return (
    <div className="cog-text text-center py-8 text-sm cog-flicker">
      ▌ ACCESSING PERSONNEL FILES... ▐
    </div>
  );

  return (
    <div className="space-y-3">
      {error && <p className="cog-text-red text-[10px]">⚠ {error}</p>}
      {traitFeedback && <p className="cog-text-amber text-[10px] cog-appear">{traitFeedback}</p>}

      <button className={`cog-btn cog-btn-amber text-[10px] ${showAdd ? 'cog-btn-active' : ''}`}
        onClick={() => setShowAdd(v => !v)}>
        {showAdd ? '× CANCEL' : '+ ENLIST UNIT'}
      </button>

      {showAdd && (
        <div className="cog-panel cog-appear p-3 space-y-2">
          <p className="cog-text-dim text-[9px] tracking-widest">◈ UNIT ENLISTMENT FORM ◈</p>
          <input value={addName} onChange={e => setAddName(e.target.value)}
            placeholder={t('campaignUnitDesignationPlaceholder')}
            className="cog-input w-full text-[11px]" />
          <div className="grid grid-cols-2 gap-2">
            {isGm ? (
              <select value={addFaction} onChange={e => setAddFaction(e.target.value)}
                className="cog-select text-[11px] w-full">
                {campaign.factions.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            ) : (
              <div className="cog-text text-[11px] border border-[#1a5c25] px-2 py-1.5 bg-[#020702]">
                {myFaction}
              </div>
            )}
            <select value={addSlot} onChange={e => setAddSlot(e.target.value)}
              className="cog-select text-[11px] w-full">
              {SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button className="cog-btn cog-btn-amber text-[10px]"
            disabled={adding || !addName.trim()} onClick={handleAdd}>
            {adding ? 'ENLISTING...' : 'CONFIRM ENLISTMENT'}
          </button>
        </div>
      )}

      {roster.length === 0 ? (
        <p className="cog-text-dim text-[10px] italic">— no units enlisted —</p>
      ) : (
        <div className="space-y-3">
          {factions.map(faction => (
            <div key={faction}>
              <p className="cog-text-amber text-[9px] uppercase tracking-widest mb-1.5">
                ▌ {faction} ▐
              </p>
              <div className="space-y-1">
                {roster.filter(u => u.faction === faction).map(unit => {
                  const traitClass = traitClassForSlot(unit.unit_slot);
                  const traitOptions = TRAITS_BY_CLASS[traitClass] ?? [];
                  const currentTrait = traitOptions.find(tr => tr.key === unit.trait);
                  const isExpanded = expandedId === unit.id;

                  return (
                    <div key={unit.id}
                      className={`cog-panel cog-appear ${unit.status === 'dead' ? 'opacity-50' : ''}`}>
                      {/* Main row */}
                      <div className="flex items-center gap-2 px-2 py-1.5">
                        <div className="flex-1 min-w-0 cursor-pointer"
                          onClick={() => setExpandedId(isExpanded ? null : unit.id)}>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="cog-text text-[11px] tracking-wide">{unit.unit_name}</span>
                            <span className="cog-text-dim text-[9px]">[{unit.unit_slot.toUpperCase()}]</span>
                            {unit.trait && (
                              <span className="cog-text-amber text-[9px]">★ {currentTrait?.label ?? unit.trait}</span>
                            )}
                          </div>
                        </div>

                        {/* XP */}
                        <div className="flex items-center gap-0.5 shrink-0">
                          {canEdit(unit) && (
                            <button disabled={busy === unit.id}
                              onClick={() => adjustXp(unit, -1)}
                              className="cog-btn text-[9px] py-0 px-1 w-4 h-4 flex items-center justify-center">−</button>
                          )}
                          <span className="cog-text-amber font-mono text-[10px] w-6 text-center">{unit.xp}</span>
                          {canEdit(unit) && (
                            <button disabled={busy === unit.id}
                              onClick={() => adjustXp(unit, 1)}
                              className="cog-btn text-[9px] py-0 px-1 w-4 h-4 flex items-center justify-center">+</button>
                          )}
                          <span className="cog-text-dim text-[8px] ml-0.5">XP</span>
                        </div>

                        {/* Status */}
                        {canEdit(unit) ? (
                          <button disabled={busy === unit.id}
                            onClick={() => cycleStatus(unit)}
                            className={`text-[9px] uppercase tracking-wide w-14 text-center ${STATUS_STYLE[unit.status]} disabled:opacity-40`}>
                            {unit.status}
                          </button>
                        ) : (
                          <span className={`text-[9px] uppercase tracking-wide w-14 text-center ${STATUS_STYLE[unit.status]}`}>
                            {unit.status}
                          </span>
                        )}

                        {/* Remove */}
                        {canEdit(unit) && (
                          <button disabled={busy === unit.id}
                            onClick={() => handleRemove(unit)}
                            className="cog-btn cog-btn-danger text-[9px] py-0 px-1.5">✕</button>
                        )}
                      </div>

                      {/* Expanded: trait picker */}
                      {isExpanded && canEdit(unit) && (
                        <div className="border-t border-[#1a5c25] px-2 py-2 space-y-1.5 cog-appear">
                          <p className="cog-text-dim text-[9px] tracking-widest">
                            ◈ UNIT TRAIT [{traitClass.toUpperCase()}] — FIRST ASSIGN: {traitClass === 'Infantry' ? 2 : 4} ⊗ ◈
                          </p>
                          <div className="grid grid-cols-2 gap-1">
                            <button
                              className={`cog-btn text-[9px] py-1 ${!unit.trait ? 'cog-btn-active' : ''}`}
                              disabled={busy === unit.id}
                              onClick={() => setTrait(unit, null)}>
                              — NO TRAIT —
                            </button>
                            {traitOptions.map(tr => (
                              <button key={tr.key}
                                className={`cog-btn text-[9px] py-1 text-left px-2 ${unit.trait === tr.key ? 'cog-btn-active' : ''}`}
                                disabled={busy === unit.id}
                                onClick={() => setTrait(unit, tr.key)}
                                title={tr.effect}>
                                {tr.label}
                              </button>
                            ))}
                          </div>
                          {unit.trait && currentTrait && (
                            <p className="cog-text-dim text-[9px] italic">› {currentTrait.effect}</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
