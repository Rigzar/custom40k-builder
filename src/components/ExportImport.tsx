import { useState } from 'react';
import { useArmyStore } from '../store/army';

export function ExportImport() {
  const { army, engagement, hqMark, archetype, legacy, legacy2, traitPool, faction, pointLimit, importRoster, clearArmy } = useArmyStore();
  const [text, setText] = useState('');
  const [mode, setMode] = useState<'export' | 'import' | null>(null);

  function doExport() {
    const json = JSON.stringify({ faction, engagement, pointLimit, hqMark, archetype, legacy, legacy2, traitPool, army }, null, 2);
    setText(json);
    setMode('export');
  }

  function doImport() {
    try {
      importRoster(text);
      setMode(null);
    } catch { /* handled inside store */ }
  }

  return (
    <div className="mt-3 border-t border-zinc-700 pt-3 space-y-2">
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={doExport}
          className="text-[11px] px-3 py-1.5 bg-zinc-800 border border-zinc-600 text-amber-500 hover:bg-zinc-700 uppercase tracking-wide"
        >
          Export JSON
        </button>
        <button
          onClick={() => { setText(''); setMode('import'); }}
          className="text-[11px] px-3 py-1.5 bg-zinc-800 border border-zinc-600 text-amber-500 hover:bg-zinc-700 uppercase tracking-wide"
        >
          Import JSON
        </button>
        <button
          onClick={() => { if (confirm('Clear the entire army?')) clearArmy(); }}
          className="text-[11px] px-3 py-1.5 bg-zinc-800 border border-red-800 text-red-400 hover:bg-red-900/30 uppercase tracking-wide"
        >
          Clear
        </button>
      </div>

      {mode === 'export' && (
        <textarea
          readOnly
          value={text}
          className="w-full h-40 bg-zinc-900 border border-zinc-600 text-zinc-300 p-2 text-[11px] font-mono resize-none focus:outline-none"
          onClick={e => (e.target as HTMLTextAreaElement).select()}
        />
      )}
      {mode === 'import' && (
        <div className="space-y-2">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Paste exported JSON here..."
            className="w-full h-40 bg-zinc-900 border border-zinc-600 text-zinc-300 p-2 text-[11px] font-mono resize-none focus:outline-none focus:border-amber-600"
          />
          <div className="flex gap-2">
            <button
              onClick={doImport}
              className="text-[11px] px-3 py-1.5 bg-amber-800 border border-amber-600 text-white hover:bg-amber-700 uppercase tracking-wide"
            >
              Import
            </button>
            <button
              onClick={() => setMode(null)}
              className="text-[11px] px-3 py-1.5 bg-zinc-800 border border-zinc-600 text-zinc-400 hover:bg-zinc-700 uppercase tracking-wide"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
