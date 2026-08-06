import { useMemo, useState } from 'react';
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

interface Pick { id: number; op: string; equip: string }

export function KillTeamAlpha({ lang }: { lang: 'en' | 'de' | 'es' }) {
  const [teamKey, setTeamKey] = useState(KT_TEAMS[0].key);
  const [roster, setRoster] = useState<Pick[]>([]);
  const [seq, setSeq] = useState(1);
  const team = KT_TEAMS.find(t => t.key === teamKey) as KtTeam;

  const L = {
    en: { budget: 'budget', operatives: 'operatives', clear: 'Clear', once: 'once only',
          leader: 'leader', over: 'over budget', under: 'room left', tooFew: 'too few operatives',
          tooMany: 'too many operatives', ok: 'legal team', suggested: 'suggested size',
          abilities: 'Team rules', roster: 'Your kill team', pick: 'Add', none: '— no equipment —',
          taken: 'taken', available: 'Operatives', equipHead: 'Equipment — one per operative, never the same twice',
          armory: 'Leader: also has Armory access (general + Mark), same as in the builder.' },
    de: { budget: 'Budget', operatives: 'Operative', clear: 'Leeren', once: 'nur einmal',
          leader: 'Anführer', over: 'über Budget', under: 'Rest', tooFew: 'zu wenige Operative',
          tooMany: 'zu viele Operative', ok: 'gültiges Team', suggested: 'empfohlene Größe',
          abilities: 'Teamregeln', roster: 'Dein Kill Team', pick: 'Hinzufügen', none: '— keine Ausrüstung —',
          taken: 'vergeben', available: 'Operative', equipHead: 'Ausrüstung — eine je Operativem, nie zweimal dieselbe',
          armory: 'Anführer: hat zusätzlich Zugriff auf die Rüstkammer (allgemein + Mal), wie im Builder.' },
    es: { budget: 'presupuesto', operatives: 'operativos', clear: 'Vaciar', once: 'solo uno',
          leader: 'líder', over: 'te pasas', under: 'te queda', tooFew: 'faltan operativos',
          tooMany: 'sobran operativos', ok: 'equipo legal', suggested: 'tamaño sugerido',
          abilities: 'Reglas de equipo', roster: 'Tu kill team', pick: 'Añadir', none: '— sin equipo —',
          taken: 'cogido', available: 'Operativos', equipHead: 'Equipo — uno por operativo, nunca el mismo dos veces',
          armory: 'Líder: además tiene acceso a la Armería (general + Marca), igual que en el builder.' },
  }[lang];

  const opBy = useMemo(() => new Map(team.operatives.map(o => [o.name, o])), [team]);
  const total = useMemo(() => roster.reduce((s, p) => s + (opBy.get(p.op)?.value ?? 0), 0), [roster, opBy]);
  const count = roster.length;
  const suggested = ktTeamSize(team);
  const over = total > KT_BUDGET;
  const takenEquip = useMemo(() => new Set(roster.map(p => p.equip).filter(Boolean)), [roster]);

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
    setRoster(r => [...r, { id: seq, op: op.name, equip: '' }]);
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
                    <span className="text-zinc-600 text-[10px] font-mono ml-auto">{op.value.toFixed(1)}</span>
                  </div>
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
                  {op.leader && <p className="text-sky-400/80 text-[10px] mt-1 pl-3 border-l border-sky-900">{L.armory}</p>}
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
