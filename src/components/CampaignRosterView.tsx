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
    { key: 'grizzled',          label: 'Grizzled',            effect: '6+ ward save' },
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
    { key: 'blessed-hull',        label: 'Blessed Hull',         effect: '6+ ward save' },
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
  onCreateArmy: (campaignId: number, campaignFaction: string) => void;
  onViewArmy: (data: Record<string, unknown>) => void;
}

export function CampaignRosterView({ campaign, isGm, myFaction, onCreateArmy, onViewArmy }: Props) {
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

  // Army lists — real saved rosters tagged to this campaign, separate from the personnel/unit
  // tracker below. Private to their owner + the GM until the GM flips campaign_visible.
  const [armies, setArmies]         = useState<api.CampaignArmy[]>([]);
  const [armiesLoading, setArmiesLoading] = useState(true);
  const [armiesError, setArmiesError]     = useState('');
  const [createFaction, setCreateFaction] = useState(myFaction ?? campaign.factions[0] ?? '');
  const [viewingId, setViewingId]         = useState<number | null>(null);
  const [togglingId, setTogglingId]       = useState<number | null>(null);

  async function loadArmies() {
    setArmiesLoading(true); setArmiesError('');
    try {
      const res = await api.listCampaignArmies(campaign.id);
      setArmies(res.armies);
    } catch (e) { setArmiesError((e as Error).message); }
    finally { setArmiesLoading(false); }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadArmies(); }, [campaign.id]);

  async function handleViewArmy(armyId: number) {
    setViewingId(armyId); setArmiesError('');
    try {
      const res = await api.loadRoster(armyId);
      onViewArmy(res.roster.data as Record<string, unknown>);
    } catch (e) { setArmiesError((e as Error).message); }
    finally { setViewingId(null); }
  }

  async function handleToggleVisibility(army: api.CampaignArmy) {
    setTogglingId(army.id); setArmiesError('');
    try {
      await api.setCampaignArmyVisibility(campaign.id, army.id, !army.campaignVisible);
      setArmies(prev => prev.map(a => a.id === army.id ? { ...a, campaignVisible: !a.campaignVisible } : a));
    } catch (e) { setArmiesError((e as Error).message); }
    finally { setTogglingId(null); }
  }

  async function load() {
    setLoading(true); setError('');
    try {
      const res = await api.listRoster(campaign.id);
      setRoster(res.roster);
    } catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  }
  // `load` is redeclared on every render, so listing it here would re-fetch in a loop.
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  async function adjustEquipmentLimit(unit: api.CampaignRosterEntry, delta: number) {
    setBusy(unit.id); setError('');
    try {
      const res = await api.updateRosterUnit(campaign.id, unit.id, { equipmentLimit: Math.max(0, unit.equipment_limit + delta) });
      setRoster(prev => prev.map(u => u.id === unit.id ? res.unit : u));
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(null); }
  }

  async function toggleEpicVeteran(unit: api.CampaignRosterEntry) {
    setBusy(unit.id); setError('');
    try {
      const res = await api.updateRosterUnit(campaign.id, unit.id, { epicVeteran: !unit.epic_veteran });
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
      {/* ── ARMY LISTS — real saved rosters tagged to this campaign, distinct from the personnel/
           unit tracker below. Private to owner + GM until the GM makes one visible. ── */}
      <div>
        <p className="cog-text-bright text-[10px] tracking-widest mb-2">▌ ARMY LISTS ▐</p>
        {armiesError && <p className="cog-text-red text-[10px]">⚠ {armiesError}</p>}

        <div className="flex items-center gap-2 mb-2">
          {isGm ? (
            <select value={createFaction} onChange={e => setCreateFaction(e.target.value)}
              className="cog-select text-[10px]">
              {campaign.factions.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          ) : (
            <span className="cog-text-dim text-[10px] border border-[#1a5c25] px-2 py-1">{myFaction}</span>
          )}
          <button className="cog-btn cog-btn-amber text-[10px]"
            disabled={!isGm && !myFaction}
            onClick={() => onCreateArmy(campaign.id, isGm ? createFaction : (myFaction ?? ''))}>
            + CREATE ARMY
          </button>
        </div>

        {armiesLoading ? (
          <p className="cog-text-dim text-[10px] italic">— loading —</p>
        ) : armies.length === 0 ? (
          <p className="cog-text-dim text-[10px] italic">— no army lists yet —</p>
        ) : (
          <div className="space-y-1">
            {armies.map(a => (
              <div key={a.id} className="cog-panel flex items-center gap-2 px-2 py-1.5 cog-appear">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="cog-text text-[11px] tracking-wide">{a.name}</span>
                    <span className="cog-text-amber text-[9px]">[{a.campaignFaction ?? '—'}]</span>
                    {a.campaignVisible && <span className="cog-text-dim text-[9px] uppercase">◈ visible to campaign</span>}
                  </div>
                  <p className="cog-text-dim text-[9px]">
                    {a.username}{a.faction_label ? ` · ${a.faction_label}` : ''}{a.total_pts != null ? ` · ${a.total_pts} pts` : ''}
                  </p>
                </div>
                <button className="cog-btn text-[9px] py-0.5 px-1.5" disabled={viewingId === a.id}
                  onClick={() => handleViewArmy(a.id)}>
                  {viewingId === a.id ? '...' : 'VIEW'}
                </button>
                {isGm && (
                  <button className={`cog-btn text-[9px] py-0.5 px-1.5 ${a.campaignVisible ? 'cog-btn-active' : ''}`}
                    disabled={togglingId === a.id} onClick={() => handleToggleVisibility(a)}>
                    {togglingId === a.id ? '...' : a.campaignVisible ? 'HIDE' : 'REVEAL'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <hr className="cog-divider" />

      {/* ── PERSONNEL ROSTER — abstract unit tracking (XP, wounds, upgrade traits), independent
           of any actual saved army list ── */}
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
                  // Character models (HQ) don't take an Infantry/MC/Vehicle trait at all (v1.11)
                  // — they get their own equipment-limit upgrade instead, further down.
                  const isCharacterModel = unit.unit_slot === 'HQ';
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
                            {isCharacterModel ? (
                              <>
                                <span className="cog-text-amber text-[9px]">⚙ {unit.equipment_limit}pts</span>
                                {unit.epic_veteran && <span className="cog-text-amber text-[9px]">★ EPIC VET</span>}
                              </>
                            ) : unit.trait && (
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

                      {/* Expanded: Character models get their own equipment-limit upgrade instead
                          of a Trait picker (v1.11 "Character models") */}
                      {isExpanded && canEdit(unit) && isCharacterModel && (
                        <div className="border-t border-[#1a5c25] px-2 py-2 space-y-1.5 cog-appear">
                          <p className="cog-text-dim text-[9px] tracking-widest">
                            ◈ EQUIPMENT LIMIT — +5 per engagement fielded, base 25, −5 if killed on a 1D6 roll of 1-3 ◈
                          </p>
                          <div className="flex items-center gap-2">
                            <button disabled={busy === unit.id || unit.equipment_limit <= 0}
                              onClick={() => adjustEquipmentLimit(unit, -5)}
                              className="cog-btn text-[10px] py-0.5 px-2">−5</button>
                            <span className="cog-text-amber font-mono text-[12px] w-16 text-center">{unit.equipment_limit} pts</span>
                            <button disabled={busy === unit.id}
                              onClick={() => adjustEquipmentLimit(unit, 5)}
                              className="cog-btn text-[10px] py-0.5 px-2">+5</button>
                          </div>
                          <label className="flex items-center gap-1.5 text-[9px] cog-text-dim cursor-pointer">
                            <input type="checkbox" checked={unit.epic_veteran} disabled={busy === unit.id}
                              onChange={() => toggleEpicVeteran(unit)} />
                            Took part in an Epic Battle — may use "once per army" upgrades
                          </label>
                        </div>
                      )}

                      {/* Expanded: trait picker (everyone except Character models) */}
                      {isExpanded && canEdit(unit) && !isCharacterModel && (
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
