import { useMemo, useState } from 'react';
import {
  creaturePoints, vehiclePoints, rangedPoints, meleePoints, CALC_NOTES,
} from '../data/pointsCalculator';
import { SPECIAL_RULE_COSTS } from '../data/specialRuleCosts';

/**
 * The author's points calculator, inside the app.
 *
 * Same four formulas as `Points calculator_v5.4.xlsx`, each verified against the sample row he
 * left in his own sheet — creature 94.375, vehicle 106.667, ranged 136 (90.667 at BS 3+), melee
 * 30 (20 at WS 3+). It is his arithmetic, not an approximation of it.
 *
 * Admin-only, like the rest of this panel.
 */

type Tab = 'creature' | 'vehicle' | 'ranged' | 'melee' | 'rules';

const box = 'bg-zinc-900 border border-zinc-700 px-1.5 py-0.5 text-[11px] font-mono text-zinc-200 w-16 focus:outline-none focus:border-amber-700';

function Field({ label, value, set, step = 1, min = 0, hint }:
  { label: string; value: number; set: (n: number) => void; step?: number; min?: number; hint?: string }) {
  return (
    <label className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
      <span className="w-24 shrink-0 text-right">{label}</span>
      <input type="number" value={value} step={step} min={min} className={box}
        onChange={e => set(Number(e.target.value))} />
      {hint && <span className="text-zinc-600 text-[10px]">{hint}</span>}
    </label>
  );
}

function Toggle({ label, value, set }: { label: string; value: boolean; set: (b: boolean) => void }) {
  return (
    <label className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
      <span className="w-24 shrink-0 text-right">{label}</span>
      <input type="checkbox" checked={value} onChange={e => set(e.target.checked)} />
    </label>
  );
}

function Result({ n }: { n: number }) {
  return (
    <div className="mt-3 border-t border-zinc-800 pt-2 flex items-baseline gap-3">
      <span className="text-[10px] uppercase tracking-widest text-zinc-500">points</span>
      <span className="text-amber-400 text-2xl font-mono">{n.toFixed(2)}</span>
      <span className="text-zinc-600 text-[10px] font-mono">rounded: {Math.round(n)}</span>
    </div>
  );
}

export function PointsCalculator({ lang }: { lang: 'en' | 'de' | 'es' }) {
  const [tab, setTab] = useState<Tab>('creature');
  const [q, setQ] = useState('');

  const [c, setC] = useState({ s: 4, t: 4, w: 1, i: 4, a: 2, ld: 8, sv: 3, ward: 0, move: 6, flying: false });
  const [v, setV] = useState({ s: 6, front: 12, side: 11, back: 10, i: 3, a: 1, hp: 3, ward: 0, move: 12, transport: 0, antiGrav: false });
  const [r, setR] = useState({ range: 24, shots: 1, s: 4, ap: 1, damage: 1, bs: 3 });
  const [m, setM] = useState({ s: 4, ap: 1, damage: 1, ws: 3 });

  const L = {
    en: { creature: 'Creature', vehicle: 'Vehicle', ranged: 'Ranged weapon', melee: 'Melee weapon',
          rules: 'Special rule costs', search: 'Search a rule…', normal: 'model', big: 'monster / vehicle',
          notes: 'His notes — apply these by hand', warn: 'The formula prices stats, it does not read a datasheet. A model with 1s everywhere, Toughness 10, Leadership 10 and a 4+ ward save comes to under twelve points and would be the worst roadblock in the game. Treat the number as a starting point.',
          rulesNote: 'Straight from his sheet, his wording, not parsed and not added automatically. "LP" is Wounds. A printed unit cost is its body PLUS its weapons PLUS these.' },
    de: { creature: 'Kreatur', vehicle: 'Fahrzeug', ranged: 'Fernkampfwaffe', melee: 'Nahkampfwaffe',
          rules: 'Sonderregel-Kosten', search: 'Regel suchen…', normal: 'Modell', big: 'Monster / Fahrzeug',
          notes: 'Seine Notizen — von Hand anwenden', warn: 'Die Formel bewertet Werte, sie liest kein Datenblatt. Ein Modell mit lauter 1en, Widerstand 10, Moral 10 und 4+ Ward Save kommt auf unter zwölf Punkte und wäre die schlimmste Blockade im Spiel. Die Zahl ist ein Ausgangspunkt.',
          rulesNote: 'Direkt aus seiner Tabelle, sein Wortlaut, nicht geparst und nicht automatisch addiert. „LP" sind Lebenspunkte. Gedruckte Punkte sind Körper PLUS Waffen PLUS diese.' },
    es: { creature: 'Criatura', vehicle: 'Vehículo', ranged: 'Arma de disparo', melee: 'Arma de cuerpo a cuerpo',
          rules: 'Coste de reglas especiales', search: 'Buscar una regla…', normal: 'modelo', big: 'monstruo / vehículo',
          notes: 'Sus notas — se aplican a mano', warn: 'La fórmula tasa características, no lee una hoja de unidad. Un modelo con todo 1, Resistencia 10, Liderazgo 10 y ward save de 4+ sale por menos de doce puntos y sería el peor tapón del juego. El número es un punto de partida.',
          rulesNote: 'Tal cual de su hoja, con sus palabras, sin interpretar y sin sumarse solo. "LP" son Heridas. Los puntos impresos son cuerpo MÁS armas MÁS esto.' },
  }[lang];

  const TABS: [Tab, string][] = [
    ['creature', L.creature], ['vehicle', L.vehicle], ['ranged', L.ranged], ['melee', L.melee], ['rules', L.rules],
  ];

  const rules = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return SPECIAL_RULE_COSTS;
    return SPECIAL_RULE_COSTS.filter(x =>
      x.name.toLowerCase().includes(s) || x.de.toLowerCase().includes(s));
  }, [q]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <h2 className="text-amber-400 text-sm font-mono uppercase tracking-widest">Points calculator</h2>
        <span className="text-zinc-600 text-[10px] font-mono">Points calculator_v5.4.xlsx</span>
        <span className="text-[9px] uppercase px-1 border border-amber-800 text-amber-500">admin only</span>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {TABS.map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider border ${
              tab === k ? 'border-amber-700 text-amber-400 bg-amber-950/30' : 'border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}
          >{label}</button>
        ))}
      </div>

      {tab === 'creature' && (
        <div className="max-w-md">
          <div className="grid gap-1">
            <Field label="Strength" value={c.s} set={n => setC({ ...c, s: n })} />
            <Field label="Toughness" value={c.t} set={n => setC({ ...c, t: n })} />
            <Field label="Wounds" value={c.w} set={n => setC({ ...c, w: n })} />
            <Field label="Initiative" value={c.i} set={n => setC({ ...c, i: n })} />
            <Field label="Attacks" value={c.a} set={n => setC({ ...c, a: n })} />
            <Field label="Leadership" value={c.ld} set={n => setC({ ...c, ld: n })} />
            <Field label="Save" value={c.sv} set={n => setC({ ...c, sv: n })} hint="3 = 3+, 1 = none" />
            <Field label="Ward save" value={c.ward} set={n => setC({ ...c, ward: n })} hint="4 = 4+, 0 = none" />
            <Field label="Movement" value={c.move} set={n => setC({ ...c, move: n })} step={2} hint="inches" />
            <Toggle label="Flying" value={c.flying} set={b => setC({ ...c, flying: b })} />
          </div>
          <Result n={creaturePoints(c)} />
        </div>
      )}

      {tab === 'vehicle' && (
        <div className="max-w-md">
          <div className="grid gap-1">
            <Field label="Strength" value={v.s} set={n => setV({ ...v, s: n })} />
            <Field label="Front" value={v.front} set={n => setV({ ...v, front: n })} />
            <Field label="Side" value={v.side} set={n => setV({ ...v, side: n })} />
            <Field label="Rear" value={v.back} set={n => setV({ ...v, back: n })} />
            <Field label="Initiative" value={v.i} set={n => setV({ ...v, i: n })} />
            <Field label="Attacks" value={v.a} set={n => setV({ ...v, a: n })} />
            <Field label="Hull points" value={v.hp} set={n => setV({ ...v, hp: n })} />
            <Field label="Ward save" value={v.ward} set={n => setV({ ...v, ward: n })} hint="5 = 5+, 0 = none" />
            <Field label="Movement" value={v.move} set={n => setV({ ...v, move: n })} step={2} hint="inches" />
            <Field label="Transport" value={v.transport} set={n => setV({ ...v, transport: n })} hint="models carried" />
            <Toggle label="Anti-Grav" value={v.antiGrav} set={b => setV({ ...v, antiGrav: b })} />
          </div>
          <p className="text-zinc-600 text-[10px] font-mono mt-2">Front / Side / Rear are added raw, not looked up — that is what his sheet does, and it is why armour dominates a vehicle's price.</p>
          <Result n={vehiclePoints(v)} />
        </div>
      )}

      {tab === 'ranged' && (
        <div className="max-w-md">
          <div className="grid gap-1">
            <Field label="Range" value={r.range} set={n => setR({ ...r, range: n })} step={3} hint="inches" />
            <Field label="Shots" value={r.shots} set={n => setR({ ...r, shots: n })} step={0.5} />
            <Field label="Strength" value={r.s} set={n => setR({ ...r, s: n })} />
            <Field label="AP" value={r.ap} set={n => setR({ ...r, ap: n })} hint="3 = AP-3" />
            <Field label="Damage" value={r.damage} set={n => setR({ ...r, damage: n })} />
            <Field label="Ballistic skill" value={r.bs} set={n => setR({ ...r, bs: n })} hint="3 = 3+" />
          </div>
          <Result n={rangedPoints(r)} />
        </div>
      )}

      {tab === 'melee' && (
        <div className="max-w-md">
          <div className="grid gap-1">
            <Field label="Strength" value={m.s} set={n => setM({ ...m, s: n })} />
            <Field label="AP" value={m.ap} set={n => setM({ ...m, ap: n })} hint="3 = AP-3" />
            <Field label="Damage" value={m.damage} set={n => setM({ ...m, damage: n })} />
            <Field label="Weapon skill" value={m.ws} set={n => setM({ ...m, ws: n })} hint="3 = 3+" />
          </div>
          <p className="text-zinc-600 text-[10px] font-mono mt-2">No range term at all — a melee weapon costs the same whatever the board size.</p>
          <Result n={meleePoints(m)} />
        </div>
      )}

      {tab === 'rules' && (
        <div>
          <p className="text-zinc-500 text-[11px] mb-2 max-w-3xl">{L.rulesNote}</p>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder={L.search}
            className="bg-zinc-900 border border-zinc-700 px-2 py-1 text-[11px] font-mono text-zinc-200 w-64 mb-2 focus:outline-none focus:border-amber-700" />
          <span className="text-zinc-600 text-[10px] font-mono ml-2">{rules.length} / {SPECIAL_RULE_COSTS.length}</span>
          <div className="border border-zinc-800 max-h-[26rem] overflow-y-auto">
            <table className="w-full text-[11px]">
              <thead className="sticky top-0 bg-zinc-900">
                <tr className="text-[9px] uppercase tracking-wider text-zinc-500">
                  <th className="text-left px-2 py-1 font-normal">rule</th>
                  <th className="text-left px-2 py-1 font-normal">{L.normal}</th>
                  <th className="text-left px-2 py-1 font-normal">{L.big}</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((x, i) => (
                  <tr key={`${x.name}-${i}`} className="border-t border-zinc-900">
                    <td className="px-2 py-1 text-zinc-200">
                      {x.name}
                      {x.de && <span className="text-zinc-600 text-[10px] block">{x.de}</span>}
                    </td>
                    <td className="px-2 py-1 text-zinc-400 font-mono">{x.pts || '—'}</td>
                    <td className="px-2 py-1 text-zinc-400 font-mono">{x.veh || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab !== 'rules' && (
        <section className="mt-4 max-w-3xl">
          <p className="text-amber-500/90 text-[11px] leading-relaxed border-l-2 border-amber-900 pl-3 mb-3">{L.warn}</p>
          <h3 className="text-zinc-200 text-[11px] font-mono uppercase tracking-wider border-b border-zinc-800 pb-1 mb-2">{L.notes}</h3>
          {CALC_NOTES.map((n, i) => (
            <p key={i} className="text-zinc-400 text-[11px] leading-relaxed mb-1 pl-3 border-l border-zinc-800">{n}</p>
          ))}
        </section>
      )}
    </div>
  );
}
