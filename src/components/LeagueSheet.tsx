import { createPortal } from 'react-dom';
import type * as api from '../lib/api';
import { factionLabel } from '../utils/factionLabel';

/**
 * The printable league sheet — for paper, or for "save as PDF" and drop in Discord.
 *
 * It is a STANDINGS sheet, and that is deliberate. It used to list every confirmed game too, until
 * Dominic said the section was unnecessary and that he would use the sheet to post the standings on
 * Discord — a game-by-game log is a different document, and on a long league it pushes the table
 * everyone actually wants onto page two. The games are not lost: they stay on the Games tab and in
 * the .json backup, which is the thing meant to hold everything.
 *
 * Rendered into a portal as `#pv-root`, which is the id the print stylesheet in index.css already
 * keys on: it hides the whole app shell and flows this sheet through normal document flow so it
 * paginates properly. Reusing that rather than inventing a second print path means the known
 * WebKit page-break behaviour is handled here too.
 *
 * GOLD is sampled from public/custom40k-logo.png rather than chosen by eye — it is the logo's
 * dominant colour (2933 px of it), so the league name under the mark is literally the same gold.
 */
const GOLD = '#ca9626';
const GOLD_DIM = '#b97a15';

interface Props {
  event: api.EventSummary;
  standings: api.EventStanding[];
  players: api.EventPlayer[];
  games: api.EventGame[];
  onClose: () => void;
}

const n = (v: string | number | undefined) => Number(v ?? 0);
const dateOnly = (v: string | null) => (v ? String(v).slice(0, 10) : '');

export function LeagueSheet({ event, standings, players, games, onClose }: Props) {
  const confirmed = games.filter(g => g.status === 'confirmed');
  const approved = players.filter(p => p.status === 'approved');

  return createPortal((
    <div id="pv-root" className="fixed inset-0 z-50 overflow-y-auto" style={{ background: '#18171a' }}>
      {/* Toolbar — print:hidden so it never reaches the paper. */}
      <div className="sticky top-0 z-10 flex items-center justify-between gap-2 px-4 py-2 bg-zinc-950 border-b border-zinc-800 print:hidden">
        <span className="text-[11px] uppercase tracking-widest" style={{ color: GOLD }}>League sheet</span>
        <div className="flex gap-2">
          <button onClick={() => window.print()}
                  className="text-[11px] px-3 py-1 border transition-colors"
                  style={{ borderColor: GOLD_DIM, color: GOLD }}>
            Print / Save as PDF
          </button>
          <button onClick={onClose} className="text-[11px] px-3 py-1 border border-zinc-700 text-zinc-300 hover:text-zinc-100">
            Close
          </button>
        </div>
      </div>

      <div id="pv-printable" className="max-w-3xl mx-auto px-6 py-8 bg-white text-black">
        {/* Masthead: the mark, then the league's own name under it in the logo's gold. */}
        <header className="text-center border-b-2 pb-4 mb-6" style={{ borderColor: GOLD }}>
          <img src="/custom40k-logo.png" alt="Custom40k" className="w-40 mx-auto mb-3 object-contain" />
          <h1 className="text-2xl font-bold tracking-wide" style={{ color: GOLD }}>{event.name}</h1>
          <p className="text-[11px] text-neutral-600 mt-1">
            {event.organiser && <>organised by {event.organiser}</>}
            {event.starts_on && <> · {dateOnly(event.starts_on)}{event.ends_on ? ` → ${dateOnly(event.ends_on)}` : ''}</>}
          </p>
          {event.description && (
            <p className="text-[12px] text-neutral-700 mt-2 max-w-xl mx-auto whitespace-pre-wrap">{event.description}</p>
          )}
        </header>

        {event.is_league && (
          <section className="mb-6">
            <h2 className="text-[11px] uppercase tracking-widest mb-2" style={{ color: GOLD_DIM }}>Standings</h2>
            <table className="w-full text-[12px] border-collapse">
              <thead>
                <tr className="border-b border-neutral-300 text-[10px] uppercase tracking-wider text-neutral-500">
                  <th className="text-left py-1 w-6">#</th>
                  <th className="text-left">Player</th>
                  <th className="text-left">Faction</th>
                  <th className="text-right w-8">W</th>
                  <th className="text-right w-8">D</th>
                  <th className="text-right w-8">L</th>
                  <th className="text-right w-10">Pts</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((s, i) => (
                  <tr key={s.user_id} className="border-b border-neutral-100">
                    <td className="py-1 text-neutral-500">{i + 1}</td>
                    <td className="font-semibold">{s.username}</td>
                    <td className="text-neutral-600">{factionLabel(s.faction) || '—'}</td>
                    <td className="text-right tabular-nums">{n(s.wins)}</td>
                    <td className="text-right tabular-nums">{n(s.draws)}</td>
                    <td className="text-right tabular-nums">{n(s.losses)}</td>
                    <td className="text-right tabular-nums font-bold" style={{ color: GOLD_DIM }}>{n(s.points)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[9px] text-neutral-500 mt-1">
              3 points for a win, 1 for a draw. Worked out from the {confirmed.length} game{confirmed.length === 1 ? '' : 's'} both players confirmed.
            </p>
          </section>
        )}

        <section className="mb-6">
          <h2 className="text-[11px] uppercase tracking-widest mb-2" style={{ color: GOLD_DIM }}>
            Participants ({approved.length})
          </h2>
          <ul className="text-[12px] columns-2 gap-6">
            {approved.map(p => (
              <li key={p.user_id} className="mb-0.5 break-inside-avoid">
                <span className="font-semibold">{p.username}</span>
                <span className="text-neutral-600">
                  {p.faction ? ` — ${factionLabel(p.faction)}` : ''}{p.roster_name ? ` (${p.roster_name})` : ''}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <footer className="mt-8 pt-3 border-t text-[9px] text-neutral-500 text-center" style={{ borderColor: GOLD_DIM }}>
          custom40k-builder.vercel.app · generated {new Date().toISOString().slice(0, 10)}
        </footer>
      </div>
    </div>
  ), document.body);
}
