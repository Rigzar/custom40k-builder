import { useEffect, useState } from 'react';
import * as api from '../lib/api';
import { useT } from '../i18n';

const SLOTS = ['HQ', 'Troops', 'Elites', 'Fast Attack', 'Heavy Support', 'Dedicated Transport', 'Flyers', 'Lords of War'];
const STATUSES: api.CampaignRosterEntry['status'][] = ['active', 'wounded', 'dead'];

const STATUS_COLOURS: Record<api.CampaignRosterEntry['status'], string> = {
  active:  'text-emerald-400',
  wounded: 'text-amber-400',
  dead:    'text-red-400',
};

interface Props {
  campaign: api.CampaignSummary;
  isGm: boolean;
  myFaction: string | null;
}

export function CampaignRosterView({ campaign, isGm, myFaction }: Props) {
  const t = useT();
  const [roster, setRoster]       = useState<api.CampaignRosterEntry[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [busy, setBusy]           = useState<number | null>(null);

  // Add form
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
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, [campaign.id]);

  async function handleAdd() {
    if (!addName.trim()) return;
    setAdding(true); setError('');
    try {
      const res = await api.addRosterUnit(campaign.id, addFaction, addName.trim(), addSlot);
      setRoster(prev => [...prev, res.unit]);
      setAddName(''); setShowAdd(false);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setAdding(false);
    }
  }

  async function cycleStatus(unit: api.CampaignRosterEntry) {
    const next = STATUSES[(STATUSES.indexOf(unit.status) + 1) % STATUSES.length];
    setBusy(unit.id); setError('');
    try {
      const res = await api.updateRosterUnit(campaign.id, unit.id, { status: next });
      setRoster(prev => prev.map(u => u.id === unit.id ? res.unit : u));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function adjustXp(unit: api.CampaignRosterEntry, delta: number) {
    setBusy(unit.id); setError('');
    try {
      const res = await api.updateRosterUnit(campaign.id, unit.id, { xp: Math.max(0, unit.xp + delta) });
      setRoster(prev => prev.map(u => u.id === unit.id ? res.unit : u));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function handleRemove(unit: api.CampaignRosterEntry) {
    setBusy(unit.id); setError('');
    try {
      await api.removeRosterUnit(campaign.id, unit.id);
      setRoster(prev => prev.filter(u => u.id !== unit.id));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  function canEdit(unit: api.CampaignRosterEntry) {
    return isGm || unit.faction === myFaction;
  }

  // Group by faction
  const factions = [...new Set(roster.map(u => u.faction))].sort();

  return (
    <div className="space-y-3">
      {error && <p className="text-red-400 text-xs">{error}</p>}

      <button
        onClick={() => setShowAdd(v => !v)}
        className="text-[10px] px-2 py-1 bg-zinc-700 border border-zinc-600 text-zinc-300 hover:bg-zinc-600 uppercase tracking-wide"
      >
        {showAdd ? t('cancel') : t('campaignRosterAddUnit')}
      </button>

      {showAdd && (
        <div className="bg-zinc-800/60 border border-zinc-700 p-3 space-y-2">
          <input
            value={addName}
            onChange={e => setAddName(e.target.value)}
            placeholder={t('campaignRosterUnitName')}
            className="w-full bg-zinc-800 border border-zinc-700 focus:border-amber-700 text-zinc-200 text-[12px] px-2 py-1.5 outline-none"
          />
          <div className="grid grid-cols-2 gap-2">
            {isGm ? (
              <select
                value={addFaction}
                onChange={e => setAddFaction(e.target.value)}
                className="bg-zinc-800 border border-zinc-700 focus:border-amber-700 text-zinc-200 text-[12px] px-2 py-1.5 outline-none"
              >
                {campaign.factions.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            ) : (
              <div className="bg-zinc-800 border border-zinc-700 text-zinc-400 text-[12px] px-2 py-1.5">
                {myFaction}
              </div>
            )}
            <select
              value={addSlot}
              onChange={e => setAddSlot(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 focus:border-amber-700 text-zinc-200 text-[12px] px-2 py-1.5 outline-none"
            >
              {SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button
            disabled={adding || !addName.trim()}
            onClick={handleAdd}
            className="text-[10px] px-2 py-1 bg-amber-800 border border-amber-600 text-white hover:bg-amber-700 disabled:opacity-50 uppercase tracking-wide"
          >
            {adding ? '…' : t('campaignRosterAddUnit')}
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-zinc-500 text-xs">{t('loadingEllipsis')}</p>
      ) : roster.length === 0 ? (
        <p className="text-zinc-500 text-xs italic">{t('campaignRosterEmpty')}</p>
      ) : (
        <div className="space-y-3">
          {factions.map(faction => (
            <div key={faction}>
              <p className="text-[10px] text-amber-600 uppercase tracking-widest mb-1">{faction}</p>
              <div className="space-y-1">
                {roster.filter(u => u.faction === faction).map(unit => (
                  <div key={unit.id} className="flex items-center gap-2 text-[11px] bg-zinc-900/50 border border-zinc-800 px-2 py-1.5">
                    <div className="flex-1 min-w-0">
                      <span className="text-zinc-100">{unit.unit_name}</span>
                      <span className="text-zinc-600 ml-1.5">{unit.unit_slot}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-zinc-500 text-[10px]">{t('campaignRosterXp')}</span>
                      {canEdit(unit) && (
                        <button disabled={busy === unit.id} onClick={() => adjustXp(unit, -1)}
                          className="w-4 h-4 flex items-center justify-center bg-zinc-700 border border-zinc-600 hover:bg-zinc-600 disabled:opacity-40 leading-none text-xs">−</button>
                      )}
                      <span className="text-amber-400 font-mono w-5 text-center">{unit.xp}</span>
                      {canEdit(unit) && (
                        <button disabled={busy === unit.id} onClick={() => adjustXp(unit, 1)}
                          className="w-4 h-4 flex items-center justify-center bg-zinc-700 border border-zinc-600 hover:bg-zinc-600 disabled:opacity-40 leading-none text-xs">+</button>
                      )}
                    </div>
                    {canEdit(unit) ? (
                      <button
                        disabled={busy === unit.id}
                        onClick={() => cycleStatus(unit)}
                        className={`text-[10px] w-14 text-center uppercase tracking-wide ${STATUS_COLOURS[unit.status]} disabled:opacity-40`}
                      >
                        {unit.status === 'active' ? t('campaignRosterActive') : unit.status === 'wounded' ? t('campaignRosterWounded') : t('campaignRosterDead')}
                      </button>
                    ) : (
                      <span className={`text-[10px] w-14 text-center uppercase tracking-wide ${STATUS_COLOURS[unit.status]}`}>
                        {unit.status === 'active' ? t('campaignRosterActive') : unit.status === 'wounded' ? t('campaignRosterWounded') : t('campaignRosterDead')}
                      </span>
                    )}
                    {canEdit(unit) && (
                      <button
                        disabled={busy === unit.id}
                        onClick={() => handleRemove(unit)}
                        className="text-zinc-600 hover:text-red-400 disabled:opacity-40 text-xs leading-none"
                        title="Remove"
                      >✕</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
