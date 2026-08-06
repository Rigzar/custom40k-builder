import { useMemo, useState } from 'react';
import {
  KT_TEAMS, KT_RULES, KT_ALPHA, KT_BUDGET, KT_MIN_OPERATIVES, KT_MAX_OPERATIVES,
  ktIsUnique, ktTeamSize, type KtTeam,
} from '../data/killteam';

/**
 * Kill Team alpha — the whole mode, admin-only.
 *
 * Deliberately its own component and its own admin tab rather than anything wired into the
 * builder: nothing here touches a roster, a saved list or the faction data. It is a place to read
 * the draft and try a team, and that is all it should be until the rules have been played.
 *
 * The point totals are shown here because THIS screen is for the two of us. The rule is that a
 * player picks operatives and never sees a number; the number is how we check that two teams meet
 * on even terms before anyone plays them.
 */
export function KillTeamAlpha({ lang }: { lang: 'en' | 'de' | 'es' }) {
  const [teamKey, setTeamKey] = useState(KT_TEAMS[0].key);
  const [picks, setPicks] = useState<Record<string, number>>({});
  const team = KT_TEAMS.find(t => t.key === teamKey) as KtTeam;

  const L = {
    en: { budget: 'budget', operatives: 'operatives', clear: 'Clear', once: 'once only',
          leader: 'leader', over: 'over budget', under: 'room left', tooFew: 'too few operatives',
          tooMany: 'too many operatives', ok: 'legal team', suggested: 'suggested size',
          abilities: 'Team rules', equip: 'Equipment (one per operative, no repeats)' },
    de: { budget: 'Budget', operatives: 'Operative', clear: 'Leeren', once: 'nur einmal',
          leader: 'Anführer', over: 'über Budget', under: 'Rest', tooFew: 'zu wenige Operative',
          tooMany: 'zu viele Operative', ok: 'gültiges Team', suggested: 'empfohlene Größe',
          abilities: 'Teamregeln', equip: 'Ausrüstung (eine je Operativem, keine Dopplung)' },
    es: { budget: 'presupuesto', operatives: 'operativos', clear: 'Vaciar', once: 'solo uno',
          leader: 'líder', over: 'te pasas', under: 'te queda', tooFew: 'faltan operativos',
          tooMany: 'sobran operativos', ok: 'equipo legal', suggested: 'tamaño sugerido',
          abilities: 'Reglas de equipo', equip: 'Equipo (uno por operativo, sin repetir)' },
  }[lang];

  const { total, count } = useMemo(() => {
    let total = 0, count = 0;
    for (const op of team.operatives) {
      const n = picks[op.name] ?? 0;
      total += op.value * n;
      count += n;
    }
    return { total, count };
  }, [picks, team]);

  /** The number a player would actually be told: "your team is N operatives". */
  const suggested = ktTeamSize(team);

  function bump(name: string, by: number, unique: boolean, isLeader: boolean) {
    setPicks(p => {
      const cap = isLeader ? 1 : unique ? 1 : KT_MAX_OPERATIVES;
      const next = Math.max(0, Math.min(cap, (p[name] ?? 0) + by));
      return { ...p, [name]: next };
    });
  }

  const over = total > KT_BUDGET;
  const status = count === 0 ? '' :
    count < KT_MIN_OPERATIVES ? L.tooFew :
    count > KT_MAX_OPERATIVES ? L.tooMany :
    over ? L.over : L.ok;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <h2 className="text-amber-400 text-sm font-mono uppercase tracking-widest">Kill Team</h2>
        <span className="text-zinc-600 text-[10px] font-mono">{KT_ALPHA}</span>
        <span className="text-[9px] uppercase px-1 border border-amber-800 text-amber-500">alpha · admin only</span>
      </div>

      {/* ── team picker + running total ─────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <select
          value={teamKey}
          onChange={e => { setTeamKey(e.target.value); setPicks({}); }}
          className="bg-zinc-900 border border-zinc-800 px-2 py-1 text-[11px] font-mono text-zinc-200 focus:outline-none focus:border-amber-800"
        >
          {KT_TEAMS.map(t => <option key={t.key} value={t.key}>{t.name} — {t.subtitle}</option>)}
        </select>
        <button onClick={() => setPicks({})} className="text-[11px] px-2 py-1 border border-zinc-700 text-zinc-300 hover:text-amber-400 hover:border-amber-800 font-mono uppercase">{L.clear}</button>
        <span className={`text-[11px] font-mono ${over ? 'text-red-400' : 'text-zinc-400'}`}>
          {total.toFixed(1)} / {KT_BUDGET} {L.budget}
        </span>
        <span className={`text-[11px] font-mono ${count < KT_MIN_OPERATIVES || count > KT_MAX_OPERATIVES ? 'text-amber-500' : 'text-zinc-400'}`}>
          {count} {L.operatives} ({KT_MIN_OPERATIVES}–{KT_MAX_OPERATIVES})
        </span>
        <span className="text-zinc-600 text-[10px] font-mono">{L.suggested}: {suggested}</span>
        {status && <span className={`text-[11px] font-mono ${status === L.ok ? 'text-green-500' : 'text-red-400'}`}>{status}</span>}
        {!over && count > 0 && <span className="text-zinc-600 text-[10px] font-mono">{L.under} {(KT_BUDGET - total).toFixed(1)}</span>}
      </div>

      <p className="text-zinc-500 text-[11px] font-mono mb-1">{team.source} · body {team.body.toFixed(1)}</p>
      <p className="text-zinc-500 text-[11px] font-mono mb-3">{team.stats}</p>

      {/* ── operatives ──────────────────────────────────────────────────── */}
      <div className="border border-zinc-800 mb-4">
        {team.operatives.map(op => {
          const unique = ktIsUnique(team, op);
          const n = picks[op.name] ?? 0;
          return (
            <div key={op.name} className={`flex items-start gap-2 px-2 py-1.5 border-b border-zinc-900 last:border-b-0 ${n > 0 ? 'bg-amber-950/15' : ''}`}>
              <div className="flex items-center gap-1 shrink-0 pt-0.5">
                <button onClick={() => bump(op.name, -1, unique, !!op.leader)} className="w-5 h-5 border border-zinc-700 text-zinc-400 hover:text-amber-400 text-[11px] leading-none">−</button>
                <span className={`w-5 text-center text-[11px] font-mono ${n > 0 ? 'text-amber-400' : 'text-zinc-600'}`}>{n}</span>
                <button onClick={() => bump(op.name, +1, unique, !!op.leader)} className="w-5 h-5 border border-zinc-700 text-zinc-400 hover:text-amber-400 text-[11px] leading-none">+</button>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-zinc-100 text-[12px] font-semibold">{op.name}</span>
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

      <section className="mb-4">
        <h3 className="text-zinc-200 text-[12px] font-mono uppercase tracking-wider border-b border-zinc-800 pb-1 mb-2">{L.abilities}</h3>
        {team.abilities.map((a, i) => <p key={i} className="text-zinc-400 text-[12px] leading-relaxed mb-1 pl-3 border-l border-zinc-800">{a}</p>)}
      </section>

      <section className="mb-5">
        <h3 className="text-zinc-200 text-[12px] font-mono uppercase tracking-wider border-b border-zinc-800 pb-1 mb-2">{L.equip}</h3>
        {team.equipment.map((e, i) => <p key={i} className="text-zinc-400 text-[12px] leading-relaxed mb-1 pl-3 border-l border-zinc-800">{e}</p>)}
      </section>

      {/* ── the rules ───────────────────────────────────────────────────── */}
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
