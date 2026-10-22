/**
 * Which rule texts keep coming back under unit abilities? Used by the Inquisitor panel's "Repeated rules" tab, so the
 * authors can see where several datasheets spell out the same effect and could codify it as one universal ability in
 * the Core Rules (atypicalhero, 2026-10-22).
 *
 * Only abilities that carry a DESCRIPTION count ("Terminator armor: The model gains a 5+ ward save."). A bare list of
 * ability names ("Combat squads, Deep Strike, Massive(1)") is already a set ability and is ignored.
 */
import type { FactionData } from '../types/data';

export interface RuleOccurrence { faction: string; unit: string; name: string; text: string }
export interface RuleGroup {
  /** Normalised text the group was keyed on (the first member's, when near-identical texts were merged). */
  key: string;
  count: number;
  /** Distinct ability names used for this text, most used first. */
  names: string[];
  factions: string[];
  /** One entry per distinct original text, with how many times it appears. */
  variants: { text: string; count: number }[];
  occurrences: RuleOccurrence[];
}
export interface GroupOptions {
  /** "Regeneration(1)" and "Regeneration(2)" count as the same rule. */
  ignoreNumbers: boolean;
  /** Merge groups whose wording is almost the same (a word or two apart). */
  mergeSimilar: boolean;
  /** Fewer occurrences than this are left out. */
  minCount: number;
}

/** "Name: description" -> parts. Anything without a real description is not a rule text. */
export function splitAbility(raw: string): { name: string; text: string } | null {
  const m = /^([^:]{1,70}?):\s*([\s\S]+)$/.exec(String(raw).trim());
  if (!m) return null;
  const name = m[1].trim(), text = m[2].trim();
  if (!name || text.split(/\s+/).length < 3) return null;      // "Rosarius: Ward." is a label, not a rule text
  return { name, text };
}

export function normaliseRuleText(text: string, ignoreNumbers: boolean): string {
  let t = text.toLowerCase().replace(/[“”"‘’']/g, '').replace(/\s+/g, ' ').trim();
  if (ignoreNumbers) t = t.replace(/\d+([.,]\d+)?/g, '#');
  return t.replace(/[.;:]+$/, '');
}

/** Every unit-ability description in every faction. */
export function collectOccurrences(datasets: { name: string; data: FactionData }[]): RuleOccurrence[] {
  const out: RuleOccurrence[] = [];
  for (const { name: faction, data } of datasets) {
    for (const [unitName, unit] of Object.entries(data.units ?? {})) {
      for (const a of unit.abilities ?? []) {
        const s = splitAbility(a);
        if (s) out.push({ faction, unit: unitName, name: s.name, text: s.text });
      }
    }
  }
  return out;
}

const words = (t: string) => new Set(t.split(/[^a-z#0-9+]+/).filter(w => w.length > 1));
function jaccard(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0;
  let inter = 0; for (const w of a) if (b.has(w)) inter++;
  return inter / (a.size + b.size - inter);
}

export function groupRules(occ: RuleOccurrence[], opts: GroupOptions): RuleGroup[] {
  const byKey = new Map<string, RuleOccurrence[]>();
  for (const o of occ) {
    const k = normaliseRuleText(o.text, opts.ignoreNumbers);
    const arr = byKey.get(k); if (arr) arr.push(o); else byKey.set(k, [o]);
  }
  let groups = [...byKey.entries()].map(([key, list]) => ({ key, list }));
  groups.sort((a, b) => b.list.length - a.list.length);
  if (opts.mergeSimilar) {
    const merged: { key: string; list: RuleOccurrence[]; w: Set<string> }[] = [];
    for (const g of groups) {
      const w = words(g.key);
      const hit = merged.find(m => Math.abs(m.w.size - w.size) <= Math.max(3, m.w.size * 0.2) && jaccard(m.w, w) >= 0.82);
      if (hit) hit.list.push(...g.list); else merged.push({ key: g.key, list: [...g.list], w });
    }
    groups = merged;
  }
  const result: RuleGroup[] = [];
  for (const g of groups) {
    if (g.list.length < opts.minCount) continue;
    const tally = <T,>(items: T[], f: (x: T) => string) => { const m = new Map<string, number>(); for (const i of items) m.set(f(i), (m.get(f(i)) ?? 0) + 1); return [...m.entries()].sort((a, b) => b[1] - a[1]); };
    result.push({
      key: g.key, count: g.list.length,
      names: tally(g.list, o => o.name).map(([n]) => n),
      factions: tally(g.list, o => o.faction).map(([f]) => f),
      variants: tally(g.list, o => o.text).map(([text, count]) => ({ text, count })),
      occurrences: g.list,
    });
  }
  return result.sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));
}
