import { useMemo, useState } from 'react';
import type { FactionData } from '../types/data';
import { collectOccurrences, groupRules, type RuleOccurrence } from '../engine/repeatedRules';

interface Props {
  factions: { key: string; name: string }[];
  load: (key: string) => Promise<FactionData>;
}

/**
 * Inquisitor panel, "Repeated rules": the unit-ability texts that come back again and again across the game, so the
 * authors can see what could become one universal ability in the Core Rules. Read-only. Bare ability names (already a
 * set ability) are ignored; only "Name: description" abilities count.
 */
export function RepeatedRulesTab({ factions, load }: Props) {
  const [occ, setOcc] = useState<RuleOccurrence[] | null>(null);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState('');
  const [ignoreNumbers, setIgnoreNumbers] = useState(true);
  const [mergeSimilar, setMergeSimilar] = useState(true);
  const [minCount, setMinCount] = useState(3);
  const [filter, setFilter] = useState('');
  const [open, setOpen] = useState<Set<string>>(new Set());

  async function run() {
    setRunning(true);
    const sets: { name: string; data: FactionData }[] = [];
    for (const f of factions) {
      setProgress(f.name);
      await new Promise(r => setTimeout(r, 0));
      try { sets.push({ name: f.name, data: await load(f.key) }); } catch { /* a dataset that cannot load is skipped */ }
    }
    setOcc(collectOccurrences(sets));
    setProgress(''); setRunning(false);
  }

  const groups = useMemo(() => {
    if (!occ) return [];
    const all = groupRules(occ, { ignoreNumbers, mergeSimilar, minCount });
    const q = filter.trim().toLowerCase();
    return q ? all.filter(g => g.key.includes(q) || g.names.some(n => n.toLowerCase().includes(q))) : all;
  }, [occ, ignoreNumbers, mergeSimilar, minCount, filter]);

  function toggle(key: string) {
    setOpen(prev => { const n = new Set(prev); if (n.has(key)) n.delete(key); else n.add(key); return n; });
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify({
      generated: new Date().toISOString(), ignoreNumbers, mergeSimilar, minCount,
      groups: groups.map(g => ({ count: g.count, names: g.names, factions: g.factions, variants: g.variants, units: g.occurrences.map(o => `${o.faction}: ${o.unit}`) })),
    }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `custom40k-repeated-rules-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const inp = 'bg-zinc-900 border border-zinc-800 px-2 py-1 text-[11px] font-mono text-zinc-200 focus:outline-none focus:border-amber-800';
  return (
    <div>
      <p className="text-zinc-500 text-[11px] font-mono mb-2">
        Ability texts that repeat across the game, to find rules that could become one universal ability in the Core Rules.
        Only abilities with a description count; bare ability names (already a set ability) are ignored.
      </p>
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <button onClick={run} disabled={running} className="px-3 py-1 text-[11px] font-mono bg-amber-900/40 border border-amber-800 text-amber-300 hover:bg-amber-900/60 disabled:opacity-50">
          {running ? `Reading… ${progress}` : occ ? 'Read again' : 'Find repeated rules'}
        </button>
        {occ && (
          <>
            <label className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
              <input type="checkbox" checked={ignoreNumbers} onChange={e => setIgnoreNumbers(e.target.checked)} /> ignore numbers (5+ and 4+ count as the same)
            </label>
            <label className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
              <input type="checkbox" checked={mergeSimilar} onChange={e => setMergeSimilar(e.target.checked)} /> merge near-identical wording
            </label>
            <label className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
              min. uses <input type="number" min={2} value={minCount} onChange={e => setMinCount(Math.max(2, Number(e.target.value) || 2))} className={`${inp} w-14`} />
            </label>
            <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="filter by word or ability name" className={`${inp} min-w-[200px]`} />
            <button onClick={exportJson} className="px-2 py-1 text-[10px] font-mono bg-zinc-900 border border-zinc-700 text-zinc-300 hover:border-amber-800">Export JSON</button>
          </>
        )}
      </div>
      {occ && (
        <p className="text-zinc-500 text-[10px] font-mono mb-2">
          {occ.length} ability texts read · {groups.length} repeated groups shown
        </p>
      )}
      <div className="space-y-2">
        {groups.map(g => {
          const isOpen = open.has(g.key);
          return (
            <div key={g.key} className="border border-zinc-800 bg-zinc-950">
              <button onClick={() => toggle(g.key)} className="w-full text-left px-3 py-2 flex items-start gap-3 hover:bg-zinc-900">
                <span className="shrink-0 bg-amber-900/40 border border-amber-800 text-amber-300 text-[11px] font-mono px-2 py-0.5">{g.count}×</span>
                <span className="flex-1 min-w-0">
                  <span className="block text-zinc-200 text-[12px]">{g.variants[0].text}</span>
                  <span className="block text-[10px] font-mono text-zinc-500 mt-1">
                    {g.names.slice(0, 6).join(' · ')}{g.names.length > 6 ? ` · +${g.names.length - 6} more names` : ''}
                    {' — '}{g.factions.length} {g.factions.length === 1 ? 'faction' : 'factions'}
                    {g.variants.length > 1 ? ` — ${g.variants.length} wordings` : ''}
                  </span>
                </span>
                <span className="text-zinc-600 text-[11px]">{isOpen ? '▾' : '▸'}</span>
              </button>
              {isOpen && (
                <div className="px-3 pb-3 border-t border-zinc-800 text-[11px]">
                  {g.variants.length > 1 && (
                    <div className="mt-2">
                      <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Wordings</div>
                      {g.variants.map(v => <div key={v.text} className="text-zinc-400 mb-1"><span className="font-mono text-amber-600">{v.count}×</span> {v.text}</div>)}
                    </div>
                  )}
                  <div className="mt-2">
                    <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Where</div>
                    {g.factions.map(f => (
                      <div key={f} className="text-zinc-400 mb-0.5">
                        <span className="text-zinc-300">{f}:</span>{' '}
                        {g.occurrences.filter(o => o.faction === f).map(o => `${o.unit} (${o.name})`).join(', ')}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
