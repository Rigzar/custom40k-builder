import { useEffect, useState } from 'react';
import * as api from '../lib/api';

const BUILDING_DEFS: Record<string, { label: string; cost: number; upgradeable: boolean; effect: string }> = {
  'admech-forge':       { label: 'AdMech Forge',              cost: 4, upgradeable: false, effect: 'Upgrade 1 vehicle/MC per round' },
  'assassin-temple':    { label: 'Assassin Temple',           cost: 8, upgradeable: false, effect: 'Field 1 Assassin per 4 engagements (Imperium)' },
  'barracks':           { label: 'Barracks',                  cost: 4, upgradeable: false, effect: 'Upgrade 2 non-vehicle units per round' },
  'construction-center':{ label: 'Construction Center',       cost: 2, upgradeable: true,  effect: 'Unlocks Fortified Positions stratagem' },
  'deathstrike-silo':   { label: 'Deathstrike Silo',          cost: 6, upgradeable: false, effect: '5+: destroy random building in any sector once/round' },
  'hq':                 { label: 'Headquarter',               cost: 4, upgradeable: true,  effect: 'Losing sector = losing campaign (Lv2: Unique equip)' },
  'hospital':           { label: 'Hospital',                  cost: 1, upgradeable: true,  effect: 'Roll for 2 destroyed infantry 5+ keep upgrade (Lv2: 4+)' },
  'machine-workshop':   { label: 'Machine Workshop',          cost: 1, upgradeable: true,  effect: 'Roll for 2 destroyed MCs/Vehicles 5+ keep upgrade (Lv2: 4+)' },
  'outpost':            { label: 'Outpost',                   cost: 2, upgradeable: false, effect: '+1 building slot (permanent, does not occupy a slot)' },
  'pdc':                { label: 'Planetary Defense Cannon',  cost: 0, upgradeable: false, effect: 'Roll twice for Fleet Supremacy. Unique — cannot be rebuilt' },
  'plasteel-refinery':  { label: 'Plasteel Refinery',         cost: 0, upgradeable: false, effect: '+1D6 Supply per round. Unique — cannot be rebuilt' },
  'radio-tower':        { label: 'Radio Tower',               cost: 2, upgradeable: true,  effect: 'Unlocks Jammer stratagem' },
  'research-facility':  { label: 'Research Facility',         cost: 3, upgradeable: true,  effect: 'Unlock 1 bonus Army Trait ("Features of..") per round (Lv2: 2)' },
  'satlink':            { label: 'Satlink',                   cost: 2, upgradeable: true,  effect: 'Unlocks Blitz stratagem' },
  'sacrifice-altar':    { label: 'Sacrifice Altar',           cost: 8, upgradeable: false, effect: 'Demon weapon up to 15pts. Chaos only' },
  'siege-camp':         { label: 'Siege Camp',                cost: 2, upgradeable: true,  effect: 'Unlocks Artillery Strike stratagem' },
  'space-port':         { label: 'Space Port',                cost: 0, upgradeable: false, effect: 'Draw 2 weekly event cards, pick 1. Unique' },
  'spec-ops-compound':  { label: 'Spec Ops Compound',         cost: 2, upgradeable: true,  effect: 'Unlocks Spy Network stratagem' },
  'strategium':         { label: 'Strategium',                cost: 2, upgradeable: false, effect: 'Unlocks Nightly Raid stratagem' },
  'tauva-center':       { label: "Tau'va Unification Center", cost: 6, upgradeable: false, effect: '+1 positive weekly event per round. Tau only' },
  'void-shields':       { label: 'Void Shields',              cost: 4, upgradeable: false, effect: 'Sector immune to Deathstrike Silo' },
};
const BUILDING_KEYS = Object.keys(BUILDING_DEFS).sort((a, b) =>
  BUILDING_DEFS[a].label.localeCompare(BUILDING_DEFS[b].label)
);

// The 4 named units of codex Assassins (Assassins ENG.ods) — mirrors ASSASSIN_DEFS in
// api/campaign/[action].js.
const ASSASSIN_DEFS: Record<string, { label: string; pts: number }> = {
  callidus:  { label: 'Callidus',  pts: 142 },
  culexus:   { label: 'Culexus',   pts: 181 },
  eversor:   { label: 'Eversor',   pts: 125 },
  vindicare: { label: 'Vindicare', pts: 189 },
};

interface StratagemDef { label: string; cost: number; building: string | null; usable: string; effect: string; }
const STRATAGEM_DEFS: Record<string, StratagemDef> = {
  'low-orbital-strike':  { label: 'Low Orbital Strike',   cost: 0, building: null,                  usable: 'Both',
    effect: 'Turn 1: 1D6 per enemy unit, 5+ deals 3 wounds (S:10 AP:-3 D:2; vehicles: 1 AT(3) penetrating hit). Stops after 3 hits.' },
  // Not a standing stratagem — granted once, for one engagement, by the Void Supremacy weekly
  // event (#18). Weapon profile is "Massive Orbital Strike" (Codex/Escalation.ods): the doc
  // itself never gives it a trigger roll or wound count like Artillery/Low Orbital Strike do —
  // the GM has to adjudicate how it's actually delivered.
  'lance-strike':        { label: 'Lance Strike',          cost: 0, building: null,                  usable: 'Both',
    effect: 'Granted once by Void Supremacy. Massive Orbital Strike weapon (Escalation): Unlimited, Assault 1, S:D AP:-6 D:5; AT(7), Explosive, Shield breaker(-3).' },
  'blitz':               { label: 'Blitz',                 cost: 2, building: 'satlink',             usable: 'Attacker',
    effect: '+1 to your Reinforcement phase rolls this battle. Lv2 Satlink: roll for one additional reinforcement unit.' },
  'fortified-positions': { label: 'Fortified Positions',   cost: 2, building: 'construction-center', usable: 'Defender',
    effect: 'Turn 1: pick 1 friendly unit — counts as in cover while it doesn\'t move. Lv2 Construction Center: 2 units.' },
  'jammer':              { label: 'Jammer',                cost: 2, building: 'radio-tower',         usable: 'Both',
    effect: 'Enemy takes -1 to Reinforcement phase rolls this battle. Lv2 Radio Tower: no enemy reinforcements arrive turn 1.' },
  'artillery-strike':    { label: 'Artillery Strike',      cost: 2, building: 'siege-camp',          usable: 'Both',
    effect: 'Turn 1: 1D6 per enemy unit, 5+ deals 3 wounds (S:7 AP:-2 D:1; vehicles: 1 AT(1) glancing hit). Stops after 3 hits. Lv2 Siege Camp: triggers on 4+.' },
  'nightly-raid':        { label: 'Nightly Raid',          cost: 2, building: 'strategium',          usable: 'Attacker',
    effect: 'Turn 1: all weapon and ability ranges capped at 18" for both players.' },
  'spy-network':         { label: 'Spy Network',           cost: 2, building: 'spec-ops-compound',   usable: 'Both',
    effect: '+1 or -1 to your own Initiative phase roll after seeing both dice. Lv2 Spec Ops Compound: a further +1/-1.' },
};

/** Lance strike only appears once its faction has an unresolved Void Supremacy (#18) event for
 * the current round — mirrors the server-side gate in stratagem-use's 'lance-strike' branch, so
 * the button doesn't show if the call would just 400. Everything else gates on building ownership. */
function availableStratagems(faction: string, buildings: api.CampaignBuilding[], events: api.CampaignEvent[], currentTurn: number): string[] {
  // "Constructions take one campaign round to finish" — a building still under construction
  // can't unlock its stratagem yet, mirrors the server-side gate in stratagem-use.
  const factionBuildings = new Set(
    buildings.filter(b => b.owner_faction === faction && b.available_from_turn <= currentTurn).map(b => b.building_type)
  );
  const hasLanceStrikeGrant = events.some(e =>
    e.faction === faction && e.turn === currentTurn && e.event_id === 18 && !e.resolved
  );
  return Object.entries(STRATAGEM_DEFS)
    .filter(([key, def]) => key === 'lance-strike' ? hasLanceStrikeGrant : (def.building === null || factionBuildings.has(def.building)))
    .map(([key]) => key);
}

/** How many times THIS round a building-gated stratagem can still be used — "once per (controlled)
 * related building per campaign round" (v1.11): count of operational buildings of that type, minus
 * uses already logged this round. Returns null for a building-less stratagem (no cap to show). */
function stratagemUsesLeft(
  faction: string, key: string, buildings: api.CampaignBuilding[], currentTurn: number,
  stratUses: { faction: string; stratagem_key: string }[],
): { used: number; cap: number } | null {
  const def = STRATAGEM_DEFS[key];
  if (!def.building) return null;
  const cap = buildings.filter(b => b.owner_faction === faction && b.building_type === def.building && b.available_from_turn <= currentTurn).length;
  const used = stratUses.filter(u => u.faction === faction && u.stratagem_key === key).length;
  return { used, cap };
}

interface Props {
  campaign: api.CampaignSummary;
  sectors: api.CampaignSector[];
  isGm: boolean;
}

export function CampaignBuildingsView({ campaign, sectors, isGm }: Props) {
  const [buildings, setBuildings]   = useState<api.CampaignBuilding[]>([]);
  const [events, setEvents]         = useState<api.CampaignEvent[]>([]);
  const [bonusEvents, setBonusEvents] = useState<api.CampaignEvent[]>([]);
  const [drawingTauvaFor, setDrawingTauvaFor] = useState<string | null>(null);
  const [stratUses, setStratUses]   = useState<{ faction: string; stratagem_key: string }[]>([]);
  const [supply, setSupply]         = useState<api.CampaignSupplyRow[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [busy, setBusy]             = useState<number | null>(null);
  const [feedback, setFeedback]     = useState('');

  // Build form
  const [showAdd, setShowAdd]       = useState(false);
  const [addSector, setAddSector]   = useState<number>(sectors[0]?.id ?? 0);
  const [addType, setAddType]       = useState('barracks');
  const [adding, setAdding]         = useState(false);

  // Weekly events
  const [drawingFor, setDrawingFor] = useState<string | null>(null);
  const [resolving, setResolving]   = useState<number | null>(null);
  // Space Port: pick from 2 candidates
  const [spacePortChoice, setSpacePortChoice] = useState<{ faction: string; candidates: { id: number; name: string; effect: string }[] } | null>(null);
  const [confirming, setConfirming] = useState(false);

  // Stratagems
  const [usingStrat, setUsingStrat] = useState<string | null>(null);

  // Deathstrike Silo — pick a target sector, fire, show the roll
  const [targetingSiloId, setTargetingSiloId] = useState<number | null>(null);
  const [siloTarget, setSiloTarget] = useState<number | null>(null);
  const [firing, setFiring] = useState(false);

  // Assassin Temple — pick which of the 4 to field this round
  const [fieldingTempleId, setFieldingTempleId] = useState<number | null>(null);
  const [fielding, setFielding] = useState(false);

  async function load() {
    setLoading(true); setError('');
    try {
      const [bRes, eRes, sRes, tRes, uRes] = await Promise.all([
        api.listBuildings(campaign.id),
        api.listEvents(campaign.id),
        api.listSupply(campaign.id),
        api.listTauvaBonus(campaign.id),
        api.listStratagemUses(campaign.id),
      ]);
      setBuildings(bRes.buildings);
      setEvents(eRes.events);
      setSupply(sRes.supply);
      setBonusEvents(tRes.events);
      setStratUses(uRes.uses);
    } catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  }
  // `load` is redeclared on every render, so listing it here would re-fetch in a loop.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [campaign.id]);

  async function handleAdd() {
    if (!addSector) return;
    setAdding(true); setError(''); setFeedback('');
    try {
      const res = await api.addBuilding(campaign.id, addSector, addType) as any;
      setBuildings(prev => [...prev, res.building]);
      if (res.supplyCostDeducted > 0) {
        setFeedback(`◈ CONSTRUCTED — −${res.supplyCostDeducted} ⊗ deducted`);
        const fresh = await api.listSupply(campaign.id);
        setSupply(fresh.supply);
      }
      setShowAdd(false);
    } catch (e) { setError((e as Error).message); }
    finally { setAdding(false); }
  }

  async function handleUpgrade(b: api.CampaignBuilding) {
    setBusy(b.id); setError(''); setFeedback('');
    try {
      const res = await api.upgradeBuilding(campaign.id, b.id) as any;
      // level2_from_turn = currentTurn+1 too — the upgrade's own "constructions take a round"
      // delay, mirrored locally so bonusTraitsFor() doesn't count it a round early.
      setBuildings(prev => prev.map(x => x.id === b.id ? { ...x, level: 2, level2_from_turn: currentTurn + 1 } : x));
      if (res.supplyCostDeducted > 0) {
        setFeedback(`◈ UPGRADED — −${res.supplyCostDeducted} ⊗ deducted`);
        const fresh = await api.listSupply(campaign.id);
        setSupply(fresh.supply);
      }
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(null); }
  }

  async function handleFireSilo(silo: api.CampaignBuilding) {
    if (siloTarget == null) return;
    setFiring(true); setError('');
    try {
      const res = await api.fireDeathstrikeSilo(campaign.id, silo.id, siloTarget);
      const targetName = sectors.find(s => s.id === siloTarget)?.name ?? `sector ${siloTarget}`;
      setFeedback(res.roll >= 5
        ? `◈ DEATHSTRIKE SILO FIRED at ${targetName} — rolled ${res.roll}: ${res.destroyedBuilding ? `${BUILDING_DEFS[res.destroyedBuilding]?.label ?? res.destroyedBuilding} DESTROYED` : 'no building there to destroy'}`
        : `◈ DEATHSTRIKE SILO FIRED at ${targetName} — rolled ${res.roll}: no effect`);
      setTargetingSiloId(null); setSiloTarget(null);
      await load();
    } catch (e) { setError((e as Error).message); }
    finally { setFiring(false); }
  }

  async function handleFieldAssassin(assassinKey: string) {
    setFielding(true); setError('');
    try {
      const res = await api.useAssassin(campaign.id, assassinKey as any);
      setFeedback(`◈ ${ASSASSIN_DEFS[assassinKey].label} FIELDED for ${res.faction}`);
      setStratUses(prev => [...prev, { faction: res.faction, stratagem_key: `assassin-${assassinKey}` }]);
      setFieldingTempleId(null);
    } catch (e) { setError((e as Error).message); }
    finally { setFielding(false); }
  }

  async function handleRemove(b: api.CampaignBuilding) {
    setBusy(b.id); setError('');
    try {
      await api.removeBuilding(campaign.id, b.id);
      setBuildings(prev => prev.filter(x => x.id !== b.id));
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(null); }
  }

  async function handleDrawEvent(faction: string) {
    setDrawingFor(faction); setError(''); setFeedback('');
    try {
      const res = await api.drawEvent(campaign.id, faction);
      if (res.requiresChoice && res.candidates) {
        setSpacePortChoice({ faction, candidates: res.candidates });
      } else {
        setFeedback(`◈ EVENT DRAWN for ${faction}: ${res.event?.event_name}`);
        await load();
      }
    } catch (e) { setError((e as Error).message); }
    finally { setDrawingFor(null); }
  }

  async function handleDrawTauvaBonus(faction: string) {
    setDrawingTauvaFor(faction); setError(''); setFeedback('');
    try {
      const res = await api.drawTauvaBonus(campaign.id, faction);
      setFeedback(`◈ TAU'VA BONUS EVENT for ${faction}: ${res.event.event_name}`);
      await load();
    } catch (e) { setError((e as Error).message); }
    finally { setDrawingTauvaFor(null); }
  }

  async function handleConfirmEvent(eventId: number) {
    if (!spacePortChoice) return;
    setConfirming(true); setError('');
    try {
      const res = await api.confirmEvent(campaign.id, spacePortChoice.faction, eventId);
      setFeedback(`◈ EVENT CHOSEN for ${spacePortChoice.faction}: ${res.event.event_name}`);
      setSpacePortChoice(null);
      await load();
    } catch (e) { setError((e as Error).message); }
    finally { setConfirming(false); }
  }

  async function handleResolve(ev: api.CampaignEvent) {
    setResolving(ev.id); setError('');
    try {
      await api.resolveEvent(campaign.id, ev.id);
      setEvents(prev => prev.map(e => e.id === ev.id ? { ...e, resolved: true } : e));
    } catch (e) { setError((e as Error).message); }
    finally { setResolving(null); }
  }

  async function handleUseStratagem(faction: string, stratagemKey: string) {
    setUsingStrat(`${faction}:${stratagemKey}`); setError(''); setFeedback('');
    try {
      const res = await api.useStratagem(campaign.id, faction, stratagemKey);
      const def = STRATAGEM_DEFS[stratagemKey];
      const costText = res.supplyCostDeducted > 0 ? ` — −${res.supplyCostDeducted} ⊗` : ' (free)';
      setFeedback(`◈ ${def.label} ACTIVATED for ${faction}${costText}`);
      setStratUses(prev => [...prev, { faction, stratagem_key: stratagemKey }]);
      if (res.supplyCostDeducted > 0) {
        const fresh = await api.listSupply(campaign.id);
        setSupply(fresh.supply);
      }
    } catch (e) { setError((e as Error).message); }
    finally { setUsingStrat(null); }
  }

  // Group buildings by sector
  const bySector = new Map<number, api.CampaignBuilding[]>();
  for (const b of buildings) {
    if (!bySector.has(b.sector_id)) bySector.set(b.sector_id, []);
    bySector.get(b.sector_id)!.push(b);
  }
  for (const s of sectors) {
    if (!bySector.has(s.id)) bySector.set(s.id, []);
  }
  const allSectorIds = sectors.map(s => s.id);
  const currentTurn = campaign.current_turn ?? 1;

  // "Features of.." = an extra Army Trait slot in the list builder (Dominic, 2026-08-23) — Research
  // Facility grants 1/round (Lv2: 2), Breakthrough! grants a one-off 1 for the round it's drawn.
  // Purely informational here — players enter the number themselves in Army Customisation.
  function bonusTraitsFor(faction: string): number {
    // A Research Facility still under construction grants nothing yet; one whose upgrade is still
    // pending only grants the level-1 amount until level2_from_turn arrives.
    const fromFacilities = buildings
      .filter(b => b.owner_faction === faction && b.building_type === 'research-facility' && b.is_active && b.available_from_turn <= currentTurn)
      .reduce((sum, b) => sum + (b.level === 2 && b.level2_from_turn <= currentTurn ? 2 : 1), 0);
    const fromBreakthrough = events.some(e => e.faction === faction && e.turn === currentTurn && e.event_id === 4 && !e.resolved) ? 1 : 0;
    return fromFacilities + fromBreakthrough;
  }

  if (loading) return (
    <div className="cog-text text-center py-8 text-sm cog-flicker">▌ ACCESSING COGITATOR DATABANKS... ▐</div>
  );

  return (
    <div className="space-y-4">
      {error && <p className="cog-text-red text-[10px]">⚠ {error}</p>}
      {feedback && <p className="cog-text-amber text-[10px] cog-appear">{feedback}</p>}

      {/* ── SUPPLY SUMMARY ── */}
      {supply.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {supply.map(s => (
            <span key={s.faction} className="cog-text-dim text-[9px]">
              {s.faction}: <span className="cog-text-amber font-mono">{s.amount} ⊗</span>
            </span>
          ))}
        </div>
      )}

      {/* ── BONUS ARMY TRAITS ("Features of..") — informational, players enter it themselves in
           Army Customisation's campaign-bonus stepper ── */}
      {campaign.factions.some(f => bonusTraitsFor(f) > 0) && (
        <div className="flex flex-wrap gap-3">
          {campaign.factions.filter(f => bonusTraitsFor(f) > 0).map(f => (
            <span key={f} className="cog-text-dim text-[9px]">
              {f}: <span className="cog-text-amber font-mono">+{bonusTraitsFor(f)}</span> 🎖 bonus Army Trait{bonusTraitsFor(f) > 1 ? 's' : ''} this round
            </span>
          ))}
        </div>
      )}

      {/* ── BUILDINGS ── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="cog-text-bright text-[10px] tracking-widest">▌ SECTOR INFRASTRUCTURE ▐</p>
          {isGm && (
            <button className={`cog-btn cog-btn-amber text-[10px] ${showAdd ? 'cog-btn-active' : ''}`}
              onClick={() => setShowAdd(v => !v)}>
              {showAdd ? '× CANCEL' : '+ CONSTRUCT'}
            </button>
          )}
        </div>

        {isGm && showAdd && (
          <div className="cog-panel cog-appear p-3 mb-3 space-y-2">
            <p className="cog-text-dim text-[10px] tracking-wide">◈ SELECT SECTOR AND BUILDING TYPE ◈</p>
            <div className="grid grid-cols-2 gap-2">
              <select value={addSector} onChange={e => setAddSector(Number(e.target.value))}
                className="cog-select text-[11px] w-full">
                {sectors.filter(s => s.owner_faction).map(s => (
                  <option key={s.id} value={s.id}>{s.name} [{s.owner_faction}]</option>
                ))}
              </select>
              <select value={addType} onChange={e => setAddType(e.target.value)}
                className="cog-select text-[11px] w-full">
                {BUILDING_KEYS.map(k => (
                  <option key={k} value={k}>
                    {BUILDING_DEFS[k].label}{BUILDING_DEFS[k].cost > 0 ? ` (${BUILDING_DEFS[k].cost} ⊗)` : ' (free)'}
                  </option>
                ))}
              </select>
            </div>
            {addType && BUILDING_DEFS[addType] && (
              <p className="cog-text-dim text-[10px] italic">› {BUILDING_DEFS[addType].effect}</p>
            )}
            <button className="cog-btn cog-btn-amber text-[10px]" disabled={adding || !addSector}
              onClick={handleAdd}>
              {adding ? 'CONSTRUCTING...' : `CONSTRUCT — ${BUILDING_DEFS[addType]?.cost > 0 ? `${BUILDING_DEFS[addType].cost} ⊗ SUPPLY` : 'FREE'}`}
            </button>
          </div>
        )}

        <div className="space-y-2">
          {allSectorIds.map(sid => {
            const sector = sectors.find(s => s.id === sid);
            if (!sector) return null;
            const sBuildings = bySector.get(sid) ?? [];
            const usedSlots = sBuildings.filter(b => b.building_type !== 'outpost').length;
            const totalSlots = (sector as any).building_slots ?? 2 + sBuildings.filter(b => b.building_type === 'outpost').length;
            return (
              <div key={sid} className="cog-panel p-2 cog-appear">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="cog-text-bright text-[10px] tracking-wide uppercase">{sector.name}</span>
                  {sector.owner_faction
                    ? <span className="cog-text-amber text-[10px]">[{sector.owner_faction}]</span>
                    : <span className="cog-text-dim text-[10px]">[NEUTRAL]</span>
                  }
                  <span className="cog-text-dim text-[10px] ml-auto">{usedSlots}/{totalSlots} SLOTS</span>
                </div>
                {sBuildings.length === 0 ? (
                  <p className="cog-text-dim text-[10px] italic pl-2">— no structures —</p>
                ) : (
                  <div className="space-y-1">
                    {sBuildings.map(b => {
                      const def = BUILDING_DEFS[b.building_type];
                      const underConstruction = b.available_from_turn > currentTurn;
                      const upgradePending = b.level === 2 && b.level2_from_turn > currentTurn;
                      const isSilo = b.building_type === 'deathstrike-silo';
                      const isTemple = b.building_type === 'assassin-temple';
                      const templeFaction = b.owner_faction;
                      const templeUsedThisRound = isTemple
                        ? stratUses.filter(u => u.faction === templeFaction && u.stratagem_key.startsWith('assassin-')).map(u => u.stratagem_key.slice('assassin-'.length))
                        : [];
                      return (
                        <div key={b.id}>
                        <div className="flex items-center gap-2 text-[10px] border-t border-[#1a5c25] pt-1">
                          <span className={`cog-text tracking-wide flex-1 ${!b.is_active ? 'opacity-40 line-through' : ''}`}>
                            {def?.label ?? b.building_type}
                            {b.level === 2 && <span className="cog-text-amber ml-1">[LV.2{upgradePending ? ' PENDING' : ''}]</span>}
                            {underConstruction && <span className="cog-text-dim ml-1 italic">— constructing, ready T.{String(b.available_from_turn).padStart(3,'0')}</span>}
                          </span>
                          {isGm && (
                            <div className="flex gap-1 shrink-0">
                              {isSilo && (
                                <button className={`cog-btn text-[9px] py-0.5 px-1.5 ${targetingSiloId === b.id ? 'cog-btn-active' : ''}`}
                                  disabled={busy === b.id || underConstruction} title={underConstruction ? 'Still under construction' : undefined}
                                  onClick={() => { setTargetingSiloId(t => t === b.id ? null : b.id); setSiloTarget(null); }}>
                                  ☢ FIRE
                                </button>
                              )}
                              {isTemple && (
                                <button className={`cog-btn text-[9px] py-0.5 px-1.5 ${fieldingTempleId === b.id ? 'cog-btn-active' : ''}`}
                                  disabled={busy === b.id || underConstruction || templeUsedThisRound.length >= 4}
                                  title={underConstruction ? 'Still under construction' : templeUsedThisRound.length >= 4 ? 'All 4 fielded this round' : undefined}
                                  onClick={() => setFieldingTempleId(t => t === b.id ? null : b.id)}>
                                  ☠ FIELD
                                </button>
                              )}
                              {def?.upgradeable && b.level < 2 && (
                                <button className="cog-btn text-[9px] py-0.5 px-1.5"
                                  disabled={busy === b.id || underConstruction} title={underConstruction ? 'Still under construction' : undefined}
                                  onClick={() => handleUpgrade(b)}>
                                  ↑ UPG ({def.cost} ⊗)
                                </button>
                              )}
                              <button className="cog-btn cog-btn-danger text-[9px] py-0.5 px-1.5"
                                disabled={busy === b.id} onClick={() => handleRemove(b)}>
                                ✕
                              </button>
                            </div>
                          )}
                        </div>
                        {targetingSiloId === b.id && (
                          <div className="flex items-center gap-1.5 py-1.5 pl-2 cog-appear">
                            <select value={siloTarget ?? ''} onChange={e => setSiloTarget(Number(e.target.value))}
                              className="cog-select text-[9px]">
                              <option value="" disabled>— target sector —</option>
                              {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                            <button className="cog-btn cog-btn-amber text-[9px] py-0.5 px-1.5"
                              disabled={firing || siloTarget == null} onClick={() => handleFireSilo(b)}>
                              {firing ? 'FIRING...' : 'CONFIRM — ROLL 1D6'}
                            </button>
                          </div>
                        )}
                        {fieldingTempleId === b.id && (
                          <div className="flex flex-wrap items-center gap-1.5 py-1.5 pl-2 cog-appear">
                            {Object.entries(ASSASSIN_DEFS).map(([key, def]) => {
                              const used = templeUsedThisRound.includes(key);
                              return (
                                <button key={key} className="cog-btn text-[9px] py-0.5 px-1.5"
                                  disabled={fielding || used} title={used ? 'Already fielded this round' : `${def.pts} pts`}
                                  onClick={() => handleFieldAssassin(key)}>
                                  {used ? `${def.label} ✓` : def.label}
                                </button>
                              );
                            })}
                          </div>
                        )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <hr className="cog-divider" />

      {/* ── STRATAGEMS ── */}
      <div>
        <p className="cog-text-bright text-[10px] tracking-widest mb-2">▌ STRATAGEMS ▐</p>
        {campaign.factions.map(faction => {
          const avail = availableStratagems(faction, buildings, events, currentTurn);
          if (!isGm && avail.length === 0) return null;
          return (
            <div key={faction} className="mb-3">
              <p className="cog-text-dim text-[9px] uppercase tracking-widest mb-1">◈ {faction}</p>
              {avail.length === 0 ? (
                <p className="cog-text-dim text-[9px] italic pl-2">— no stratagems available —</p>
              ) : (
                <div className="grid grid-cols-2 gap-1">
                  {avail.map(key => {
                    const def = STRATAGEM_DEFS[key];
                    const isBusy = usingStrat === `${faction}:${key}`;
                    const usage = stratagemUsesLeft(faction, key, buildings, currentTurn, stratUses);
                    const exhausted = !!usage && usage.used >= usage.cap;
                    return (
                      <div key={key} className="cog-panel p-1.5 flex items-center gap-1.5 cog-appear">
                        <div className="flex-1 min-w-0">
                          <span className="cog-text text-[10px] tracking-wide">{def.label}</span>
                          <span className="cog-text-dim text-[9px] ml-1">({def.usable})</span>
                          {usage && <span className="cog-text-dim text-[9px] ml-1">[{usage.used}/{usage.cap} used]</span>}
                          <p className="cog-text-dim text-[9px] italic mt-0.5">{def.effect}</p>
                        </div>
                        {isGm && (
                          <button className="cog-btn cog-btn-amber text-[9px] py-0.5 px-1.5 shrink-0"
                            disabled={!!usingStrat || exhausted} title={exhausted ? 'Already used up this round' : undefined}
                            onClick={() => handleUseStratagem(faction, key)}>
                            {isBusy ? '...' : exhausted ? 'USED UP' : def.cost > 0 ? `USE −${def.cost} ⊗` : 'USE FREE'}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <hr className="cog-divider" />

      {/* ── WEEKLY EVENTS ── */}
      <div>
        <p className="cog-text-bright text-[10px] tracking-widest uppercase mb-2">▌ WEEKLY EVENTS — T.{String(currentTurn).padStart(3, '0')} ▐</p>

        {/* Space Port choice modal */}
        {spacePortChoice && (
          <div className="cog-panel cog-appear p-3 mb-3 border-[#ffb020]">
            <p className="cog-text-dim text-[9px] tracking-widest mb-2">◈ SPACE PORT — PICK ONE TRANSMISSION ◈</p>
            <p className="cog-text-dim text-[9px] mb-2">Faction: <span className="cog-text-amber">{spacePortChoice.faction}</span></p>
            <div className="space-y-2">
              {spacePortChoice.candidates.map(ev => (
                <div key={ev.id} className="cog-panel p-2 flex items-center gap-2">
                  <div className="flex-1">
                    <p className="cog-text-amber text-[10px] font-bold">{ev.name}</p>
                    <p className="cog-text text-[9px] italic">{ev.effect}</p>
                  </div>
                  <button className="cog-btn cog-btn-amber text-[9px] py-1 px-2 shrink-0"
                    disabled={confirming} onClick={() => handleConfirmEvent(ev.id)}>
                    {confirming ? '...' : 'CHOOSE'}
                  </button>
                </div>
              ))}
              <button className="cog-btn text-[9px]" onClick={() => setSpacePortChoice(null)}>
                CANCEL
              </button>
            </div>
          </div>
        )}

        {isGm && (
          <div className="flex flex-wrap gap-2 mb-3">
            {campaign.factions.map(f => {
              const hasEvent = events.some(e => e.faction === f && e.turn === currentTurn);
              return (
                <button key={f}
                  className={`cog-btn cog-btn-amber text-[10px] ${hasEvent ? 'opacity-60' : ''}`}
                  disabled={drawingFor === f || !!spacePortChoice}
                  onClick={() => handleDrawEvent(f)}>
                  {drawingFor === f ? 'DRAWING...' : `DRAW → ${f}`}{hasEvent && ' ✓'}
                </button>
              );
            })}
          </div>
        )}

        {/* Tau'va Unification Center — an ADDITIONAL positive event, separate draw/list from the
            normal one above (v1.11, Tau only) */}
        {isGm && campaign.factions.some(f =>
          buildings.some(b => b.owner_faction === f && b.building_type === 'tauva-center' && b.available_from_turn <= currentTurn)
        ) && (
          <div className="flex flex-wrap gap-2 mb-3">
            {campaign.factions.filter(f =>
              buildings.some(b => b.owner_faction === f && b.building_type === 'tauva-center' && b.available_from_turn <= currentTurn)
            ).map(f => {
              const hasBonus = bonusEvents.some(e => e.faction === f && e.turn === currentTurn);
              return (
                <button key={f}
                  className={`cog-btn text-[10px] ${hasBonus ? 'opacity-60' : ''}`}
                  disabled={drawingTauvaFor === f || hasBonus}
                  onClick={() => handleDrawTauvaBonus(f)}>
                  {drawingTauvaFor === f ? 'DRAWING...' : `☯ TAU'VA BONUS → ${f}`}{hasBonus && ' ✓'}
                </button>
              );
            })}
          </div>
        )}

        {bonusEvents.filter(e => e.turn === currentTurn).length > 0 && (
          <div className="space-y-1 mb-3">
            {bonusEvents.filter(e => e.turn === currentTurn).map(ev => (
              <div key={`bonus-${ev.id}`} className="cog-panel p-2 border-l-2 border-[#ffb020]">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="cog-text-amber text-[10px] tracking-wide">[{ev.faction}]</span>
                  <span className="cog-text-bright text-[10px]">☯ {ev.event_name}</span>
                  <span className="cog-text-dim text-[9px]">(Tau'va bonus)</span>
                </div>
                <p className="cog-text text-[10px] mt-0.5 italic">{ev.event_effect}</p>
              </div>
            ))}
          </div>
        )}

        {events.length === 0 ? (
          <p className="cog-text-dim text-[10px] italic">— no events drawn this round —</p>
        ) : (
          <div className="space-y-1.5">
            {events.map(ev => (
              <div key={ev.id} className={`cog-panel p-2 cog-appear ${ev.resolved ? 'opacity-50' : ''}`}>
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="cog-text-dim text-[9px]">T.{String(ev.turn).padStart(3,'0')}</span>
                      <span className="cog-text-amber text-[10px] tracking-wide">[{ev.faction}]</span>
                      <span className="cog-text-bright text-[10px]">{ev.event_name}</span>
                      {ev.resolved && <span className="cog-text-dim text-[9px]">RESOLVED</span>}
                    </div>
                    <p className="cog-text text-[10px] mt-0.5 italic">{ev.event_effect}</p>
                  </div>
                  {isGm && !ev.resolved && (
                    <button className="cog-btn text-[9px] py-0.5 px-1.5 shrink-0"
                      disabled={resolving === ev.id} onClick={() => handleResolve(ev)}>
                      RESOLVE
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
