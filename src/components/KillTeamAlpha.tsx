import { useEffect, useMemo, useState } from 'react';
import { FACTION_LOADERS } from '../data/loaders';
import type { ArmoryItem } from '../types/data';
import {
  KT_TEAMS, KT_RULES, KT_ALPHA, KT_BUDGET, KT_MIN_OPERATIVES, KT_MAX_OPERATIVES,
  ktIsUnique, ktTeamSize, type KtTeam, type KtOperative,
} from '../data/killteam';

/**
 * Kill Team alpha — the whole mode, admin-only.
 *
 * Its own component and its own admin tab rather than anything wired into the builder: nothing
 * here touches a roster, a saved list or the faction data. A place to read the draft and try a
 * team, and nothing more until the rules have been played.
 *
 * The roster is a LIST of picked operatives, not a count per type, because each one carries its
 * own equipment — the same shape the real builder uses, and the only shape in which "no two
 * operatives may take the same item" can be enforced or shown.
 *
 * Point totals are on screen because this screen is for the two of us. The rule is that a player
 * picks operatives and never sees a number; the number is how we check two teams meet on even
 * terms before anyone plays them.
 */

interface Pick { id: number; op: string; equip: string; weapon?: string; armory: string[] }

export function KillTeamAlpha({ lang }: { lang: 'en' | 'de' | 'es' }) {
  const [teamKey, setTeamKey] = useState(KT_TEAMS[0].key);
  const [roster, setRoster] = useState<Pick[]>([]);
  const [seq, setSeq] = useState(1);
  const team = KT_TEAMS.find(t => t.key === teamKey) as KtTeam;

  /**
   * The leader's Armory, pulled from the real faction data rather than restated here — general
   * plus its Mark's, which is exactly what the builder gives a squad champion. Loaded lazily
   * because a faction dataset is megabytes and most of this screen does not need it.
   */
  const [armory, setArmory] = useState<ArmoryItem[]>([]);
  useEffect(() => {
    let alive = true;
    // The clear happens inside the promise, not before it: emptying the list synchronously here
    // makes React re-render twice for every team change and the linter is right to say so.
    FACTION_LOADERS[team.faction]?.().then(d => {
      if (!alive) return;
      const gen = (d.armory_general?.equipment ?? []) as ArmoryItem[];
      const mk = (team.mark ? (d.armory_marks?.[team.mark]?.equipment ?? []) : []) as ArmoryItem[];
      // A squad champion pays the unit column, not the character one (ArmoryModal, ki-armory-
      // pchar-truechar-only-01), so an item with no p_unit is not for it.
      // Curated for this scale rather than handed over whole: an item is out if it prices only
      // for vehicles, if it works on "the attached unit" (there are no squads here), or if it is
      // a psychic hook (powers are out of the alpha). Armours stay in, Terminator plate included —
      // it is one of the few upgrades that visibly changes an operative, which is the point.
      const OUT = /only for (vehicle|warpsmith|lord|sorcerer|dark apostle)|attached unit|psychic|psyker|daemon unit|deep ?strike.*scatter/i;
      setArmory([...gen, ...mk]
        .filter((i: ArmoryItem) => i.p_unit != null && i.p_unit !== 0)
        .filter((i: ArmoryItem) => !i.category)
        .filter((i: ArmoryItem) => !OUT.test(String(i.desc ?? '')))
        .sort((a: ArmoryItem, b: ArmoryItem) => (a.p_unit ?? 0) - (b.p_unit ?? 0)));
    }).catch(() => {});
    return () => { alive = false; };
  }, [team]);

  const L = {
    en: { budget: 'budget', operatives: 'operatives', clear: 'Clear', once: 'once only',
          leader: 'leader', over: 'over budget', under: 'room left', tooFew: 'too few operatives',
          tooMany: 'too many operatives', ok: 'legal team', suggested: 'suggested size',
          abilities: 'Team rules', roster: 'Your kill team', pick: 'Add', none: '— no equipment —',
          taken: 'taken', available: 'Operatives', equipHead: 'Equipment — one per operative; only “Unique” items are one per team',
          keepWeapon: 'keep', addArmory: 'Add from the Armory…',
          armory: 'Leader: also has Armory access (general + Mark), same as in the builder.' },
    de: { budget: 'Budget', operatives: 'Operative', clear: 'Leeren', once: 'nur einmal',
          leader: 'Anführer', over: 'über Budget', under: 'Rest', tooFew: 'zu wenige Operative',
          tooMany: 'zu viele Operative', ok: 'gültiges Team', suggested: 'empfohlene Größe',
          abilities: 'Teamregeln', roster: 'Dein Kill Team', pick: 'Hinzufügen', none: '— keine Ausrüstung —',
          taken: 'vergeben', available: 'Operative', equipHead: 'Ausrüstung — eine je Operativem; nur „Unique“-Gegenstände einmal pro Team',
          keepWeapon: 'behalten', addArmory: 'Aus der Rüstkammer…',
          armory: 'Anführer: hat zusätzlich Zugriff auf die Rüstkammer (allgemein + Mal), wie im Builder.' },
    es: { budget: 'presupuesto', operatives: 'operativos', clear: 'Vaciar', once: 'solo uno',
          leader: 'líder', over: 'te pasas', under: 'te queda', tooFew: 'faltan operativos',
          tooMany: 'sobran operativos', ok: 'equipo legal', suggested: 'tamaño sugerido',
          abilities: 'Reglas de equipo', roster: 'Tu kill team', pick: 'Añadir', none: '— sin equipo —',
          taken: 'cogido', available: 'Operativos', equipHead: 'Equipo — uno por operativo; solo los “Unique” son uno por equipo',
          keepWeapon: 'mantener', addArmory: 'Añadir de la Armería…',
          armory: 'Líder: además tiene acceso a la Armería (general + Marca), igual que en el builder.' },
  }[lang];

  const opBy = useMemo(() => new Map(team.operatives.map(o => [o.name, o])), [team]);
  const armBy = useMemo(() => new Map(armory.map(i => [i.name, i])), [armory]);
  /** An operative costs its own value, or the value of the weapon its leader swapped to, plus
   *  whatever it bought from the Armory. */
  function pickValue(p: Pick): number {
    const base = p.weapon ? (opBy.get(p.weapon)?.value ?? 0) : (opBy.get(p.op)?.value ?? 0);
    return base + p.armory.reduce((s, n) => s + (armBy.get(n)?.p_unit ?? 0), 0);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- pickValue is rebuilt each render from opBy/armBy, which ARE listed
  const total = useMemo(() => roster.reduce((s, p) => s + pickValue(p), 0), [roster, opBy, armBy]);
  const count = roster.length;
  const suggested = ktTeamSize(team);
  const over = total > KT_BUDGET;
  /**
   * Only equipment the Armory itself marks "Unique" is one per team. Everything else may be taken
   * by as many operatives as want it — a squad where only one man may carry blessed ammunition is
   * a rule nobody would write, and the data already says which items are actually one-of.
   */
  const takenEquip = useMemo(
    () => new Set(roster.map(p => p.equip).filter(e => e && e.includes('Unique'))),
    [roster],
  );

  const status = count === 0 ? '' :
    count < KT_MIN_OPERATIVES ? L.tooFew :
    count > KT_MAX_OPERATIVES ? L.tooMany :
    over ? L.over : L.ok;

  function canAdd(op: KtOperative): boolean {
    const have = roster.filter(p => p.op === op.name).length;
    if (op.leader) return have < 1;
    return !ktIsUnique(team, op) || have < 1;
  }
  function add(op: KtOperative) {
    if (!canAdd(op)) return;
    setRoster(r => [...r, { id: seq, op: op.name, equip: '', armory: [] }]);
    setSeq(n => n + 1);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <h2 className="text-amber-400 text-sm font-mono uppercase tracking-widest">Kill Team</h2>
        <span className="text-zinc-600 text-[10px] font-mono">{KT_ALPHA}</span>
        <span className="text-[9px] uppercase px-1 border border-amber-800 text-amber-500">alpha · admin only</span>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <select
          value={teamKey}
          onChange={e => { setTeamKey(e.target.value); setRoster([]); }}
          className="bg-zinc-900 border border-zinc-800 px-2 py-1 text-[11px] font-mono text-zinc-200 focus:outline-none focus:border-amber-800"
        >
          {KT_TEAMS.map(t => <option key={t.key} value={t.key}>{t.name} — {t.subtitle}</option>)}
        </select>
        <button onClick={() => setRoster([])} className="text-[11px] px-2 py-1 border border-zinc-700 text-zinc-300 hover:text-amber-400 hover:border-amber-800 font-mono uppercase">{L.clear}</button>
        <span className={`text-[11px] font-mono ${over ? 'text-red-400' : 'text-zinc-400'}`}>{total.toFixed(1)} / {KT_BUDGET} {L.budget}</span>
        <span className={`text-[11px] font-mono ${count < KT_MIN_OPERATIVES || count > KT_MAX_OPERATIVES ? 'text-amber-500' : 'text-zinc-400'}`}>
          {count} {L.operatives} ({KT_MIN_OPERATIVES}–{KT_MAX_OPERATIVES})
        </span>
        <span className="text-zinc-600 text-[10px] font-mono">{L.suggested}: {suggested}</span>
        {status && <span className={`text-[11px] font-mono ${status === L.ok ? 'text-green-500' : 'text-red-400'}`}>{status}</span>}
        {!over && count > 0 && <span className="text-zinc-600 text-[10px] font-mono">{L.under} {(KT_BUDGET - total).toFixed(1)}</span>}
      </div>

      <p className="text-zinc-500 text-[11px] font-mono mb-3">{team.source} · body {team.body.toFixed(1)} · {team.stats}</p>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* ── the catalogue ────────────────────────────────────────────── */}
        <div>
          <h3 className="text-zinc-200 text-[12px] font-mono uppercase tracking-wider border-b border-zinc-800 pb-1 mb-2">{L.available}</h3>
          <div className="border border-zinc-800">
            {team.operatives.map(op => {
              const unique = ktIsUnique(team, op);
              const have = roster.filter(p => p.op === op.name).length;
              const blocked = !canAdd(op);
              return (
                <div key={op.name} className="flex items-start gap-2 px-2 py-1.5 border-b border-zinc-900 last:border-b-0">
                  <button
                    onClick={() => add(op)}
                    disabled={blocked}
                    className="shrink-0 mt-0.5 px-2 py-0.5 border border-zinc-700 text-zinc-300 text-[10px] font-mono uppercase
                               hover:text-amber-400 hover:border-amber-800 disabled:opacity-30 disabled:cursor-not-allowed"
                  >{L.pick}</button>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="text-zinc-100 text-[12px] font-semibold">{op.name}</span>
                      {have > 0 && <span className="text-amber-400 text-[10px] font-mono">×{have}</span>}
                      <span className="text-zinc-500 text-[11px]">{op.weapon}</span>
                      {op.leader && <span className="text-[9px] uppercase px-1 border border-sky-800 text-sky-400">{L.leader}</span>}
                      {unique && !op.leader && <span className="text-[9px] uppercase px-1 border border-amber-800 text-amber-500">{L.once}</span>}
                      <span className="text-zinc-600 text-[10px] font-mono ml-auto">{op.value.toFixed(1)}</span>
                    </div>
                    <p className="text-zinc-500 text-[10px] font-mono">{op.profile}</p>
                    {op.note && <p className="text-zinc-600 text-[10px] italic">{op.note}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── the roster, each operative with its own equipment ─────────── */}
        <div>
          <h3 className="text-zinc-200 text-[12px] font-mono uppercase tracking-wider border-b border-zinc-800 pb-1 mb-2">{L.roster}</h3>
          {roster.length === 0 && <p className="text-zinc-600 text-[11px] font-mono">—</p>}
          <div className={roster.length ? 'border border-zinc-800' : ''}>
            {roster.map(p => {
              const op = opBy.get(p.op) as KtOperative;
              return (
                <div key={p.id} className="px-2 py-1.5 border-b border-zinc-900 last:border-b-0">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <button
                      onClick={() => setRoster(r => r.filter(x => x.id !== p.id))}
                      className="shrink-0 w-5 h-5 border border-zinc-700 text-zinc-500 hover:text-red-400 hover:border-red-800 text-[11px] leading-none"
                    >×</button>
                    <span className="text-zinc-100 text-[12px] font-semibold">{op.name}</span>
                    {op.leader && <span className="text-[9px] uppercase px-1 border border-sky-800 text-sky-400">{L.leader}</span>}
                    <span className="text-zinc-500 text-[11px]">{op.weapon}</span>
                    <span className="text-zinc-600 text-[10px] font-mono ml-auto">{pickValue(p).toFixed(1)}</span>
                  </div>
                  {op.leader && (
                    <select
                      value={p.weapon ?? ''}
                      onChange={e => setRoster(r => r.map(x => (x.id === p.id ? { ...x, weapon: e.target.value || undefined } : x)))}
                      className="mt-1 w-full bg-zinc-900 border border-sky-900 px-2 py-1 text-[11px] text-sky-300 focus:outline-none focus:border-sky-700"
                    >
                      <option value="">{L.keepWeapon} — {op.weapon}</option>
                      {team.operatives.filter(o => !o.leader).map(o => (
                        <option key={o.name} value={o.name}>{o.weapon} ({o.value.toFixed(1)})</option>
                      ))}
                    </select>
                  )}
                  <select
                    value={p.equip}
                    onChange={e => setRoster(r => r.map(x => (x.id === p.id ? { ...x, equip: e.target.value } : x)))}
                    className="mt-1 w-full bg-zinc-900 border border-zinc-800 px-2 py-1 text-[11px] text-zinc-300 focus:outline-none focus:border-amber-800"
                  >
                    <option value="">{L.none}</option>
                    {team.equipment.map(item => {
                      const label = item.split(' — ')[0];
                      const taken = takenEquip.has(item) && p.equip !== item;
                      return <option key={item} value={item} disabled={taken}>{label}{taken ? ` (${L.taken})` : ''}</option>;
                    })}
                  </select>
                  {p.equip && <p className="text-amber-500/90 text-[11px] mt-1 pl-3 border-l border-amber-900">{p.equip}</p>}
                  {op.leader && (
                    <div className="mt-1">
                      <p className="text-sky-400/80 text-[10px] mb-1">{L.armory}{armory.length ? ` (${armory.length})` : '…'}</p>
                      <select
                        value=""
                        onChange={e => { const v = e.target.value; if (!v) return;
                          setRoster(r => r.map(x => (x.id === p.id && !x.armory.includes(v) ? { ...x, armory: [...x.armory, v] } : x))); }}
                        className="w-full bg-zinc-900 border border-zinc-800 px-2 py-1 text-[11px] text-zinc-300 focus:outline-none focus:border-sky-700"
                      >
                        <option value="">{L.addArmory}</option>
                        {armory.map(i => (
                          <option key={i.name} value={i.name} disabled={p.armory.includes(i.name)}>
                            {i.name} — {i.p_unit} pts
                          </option>
                        ))}
                      </select>
                      {p.armory.map(n => (
                        <p key={n} className="text-sky-300/90 text-[11px] mt-1 pl-3 border-l border-sky-900 flex gap-2">
                          <button onClick={() => setRoster(r => r.map(x => (x.id === p.id ? { ...x, armory: x.armory.filter(a => a !== n) } : x)))}
                            className="text-zinc-600 hover:text-red-400">×</button>
                          <span>{n} <span className="text-zinc-600 font-mono">{armBy.get(n)?.p_unit} pts</span></span>
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <section className="my-4">
        <h3 className="text-zinc-200 text-[12px] font-mono uppercase tracking-wider border-b border-zinc-800 pb-1 mb-2">{L.abilities}</h3>
        {team.abilities.map((a, i) => <p key={i} className="text-zinc-400 text-[12px] leading-relaxed mb-1 pl-3 border-l border-zinc-800">{a}</p>)}
      </section>

      <section className="mb-5">
        <h3 className="text-zinc-200 text-[12px] font-mono uppercase tracking-wider border-b border-zinc-800 pb-1 mb-2">{L.equipHead}</h3>
        {team.equipment.map((e, i) => (
          <p key={i} className={`text-[12px] leading-relaxed mb-1 pl-3 border-l ${takenEquip.has(e) ? 'text-zinc-600 border-zinc-800 line-through' : 'text-zinc-400 border-zinc-800'}`}>{e}</p>
        ))}
      </section>

      <div className="max-w-3xl">
        {KT_RULES.map(sec => (
          <section key={sec.title} className="mb-4">
            <h3 className="text-zinc-200 text-[12px] font-mono uppercase tracking-wider border-b border-zinc-800 pb-1 mb-2">{sec.title}</h3>
            {sec.body.map((p, i) => <p key={i} className="text-zinc-400 text-[12px] leading-relaxed mb-2">{p}</p>)}
          </section>
        ))}
      </div>
    </div>
  );
}
