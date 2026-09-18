/**
 * headToHead.ts — "who have I already played in this event, and how did it go?"
 *
 * Dominic asked for a personal overview per player, event-specific. The arithmetic lives here
 * rather than inside the modal for one reason: a game's `result` is always stored from the
 * REPORTER's point of view, so every game the player did not report has to be mirrored before it
 * is counted. Get that backwards and a player reads their own losses as wins — a quiet, plausible
 * wrong answer, which is exactly the kind that needs a test rather than a careful glance.
 */
import type { EventGame } from './api';

export interface HeadToHeadGame {
  game: EventGame;
  /** The result from THIS player's point of view, not the reporter's. */
  result: 'win' | 'draw' | 'loss';
  myFaction: string | null;
  theirFaction: string | null;
}

export interface HeadToHeadRow {
  opponent: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  /** Games not yet confirmed. Counted in `played` but never in the W–D–L record. */
  pending: number;
  games: HeadToHeadGame[];
}

/** One game seen from `me`'s side. */
export function fromMySide(g: EventGame, me: string): HeadToHeadGame & { opponent: string } {
  const iReported = g.reporter === me;
  return {
    game: g,
    opponent: iReported ? g.opponent : g.reporter,
    myFaction: iReported ? g.reporter_faction : g.opponent_faction,
    theirFaction: iReported ? g.opponent_faction : g.reporter_faction,
    result: g.result === 'draw' ? 'draw' : iReported ? g.result : (g.result === 'win' ? 'loss' : 'win'),
  };
}

/**
 * Group this event's games by opponent, from `me`'s point of view, most-played first.
 *
 * Only CONFIRMED games move the W–D–L record: a pending game is one the opponent has not agreed
 * to yet, and showing it as a win would let the record disagree with the standings table two tabs
 * away. It still counts as a game played, because it did happen.
 */
export function headToHead(games: EventGame[], me: string): HeadToHeadRow[] {
  const by = new Map<string, HeadToHeadRow>();
  for (const g of games) {
    if (g.reporter !== me && g.opponent !== me) continue;
    const seen = fromMySide(g, me);
    const row = by.get(seen.opponent) ?? {
      opponent: seen.opponent, played: 0, wins: 0, draws: 0, losses: 0, pending: 0, games: [],
    };
    row.played++;
    if (g.status === 'confirmed') {
      if (seen.result === 'win') row.wins++;
      else if (seen.result === 'draw') row.draws++;
      else row.losses++;
    } else {
      row.pending++;
    }
    row.games.push(seen);
    by.set(seen.opponent, row);
  }
  return [...by.values()].sort((a, b) => b.played - a.played || a.opponent.localeCompare(b.opponent));
}
