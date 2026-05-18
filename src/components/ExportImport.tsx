import { useState } from 'react';
import { useArmyStore } from '../store/army';

type Mode = 'exportJson' | 'importJson' | 'exportCode' | 'importCode' | null;

function toCode(obj: unknown): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify(obj))));
}

function fromCode(code: string): unknown {
  return JSON.parse(decodeURIComponent(escape(atob(code.trim()))));
}

export function ExportImport() {
  const {
    army, engagement, hqMark, archetype, legacy, legacy2,
    traitPool, faction, pointLimit, armyName, importRoster, clearArmy,
  } = useArmyStore();

  const [text, setText]     = useState('');
  const [mode, setMode]     = useState<Mode>(null);
  const [copied, setCopied] = useState(false);

  const stateSnapshot = { armyName, faction, engagement, pointLimit, hqMark, archetype, legacy, legacy2, traitPool, army };

  function doExportJson() {
    setText(JSON.stringify(stateSnapshot, null, 2));
    setMode('exportJson');
  }

  function doExportCode() {
    const code = toCode(stateSnapshot);
    setText(code);
    setMode('exportCode');
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      (document.querySelector('#export-textarea') as HTMLTextAreaElement)?.select();
    }
  }

  function doImport() {
    try {
      const raw = mode === 'importCode' ? JSON.stringify(fromCode(text)) : text;
      importRoster(raw);
      setMode(null);
      setText('');
    } catch {
      alert('Invalid code or JSON.');
    }
  }

  return (
    <div className="mt-3 border-t border-zinc-700 pt-3 space-y-2">
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={doExportCode}
          className="text-[11px] px-3 py-1.5 bg-zinc-800 border border-amber-800/60 text-amber-500 hover:bg-zinc-700 uppercase tracking-wide"
        >
          Copy Code
        </button>
        <button
          onClick={() => { setText(''); setMode('importCode'); }}
          className="text-[11px] px-3 py-1.5 bg-zinc-800 border border-amber-800/60 text-amber-500 hover:bg-zinc-700 uppercase tracking-wide"
        >
          Import Code
        </button>
        <button
          onClick={doExportJson}
          className="text-[11px] px-3 py-1.5 bg-zinc-800 border border-zinc-600 text-zinc-500 hover:bg-zinc-700 uppercase tracking-wide"
        >
          JSON
        </button>
        <button
          onClick={() => { if (confirm('Clear the entire army?')) clearArmy(); }}
          className="text-[11px] px-3 py-1.5 bg-zinc-800 border border-red-800 text-red-400 hover:bg-red-900/30 uppercase tracking-wide"
        >
          Clear
        </button>
      </div>

      {/* Export: Code or JSON */}
      {(mode === 'exportCode' || mode === 'exportJson') && (
        <div className="space-y-2">
          <textarea
            id="export-textarea"
            readOnly
            value={text}
            onClick={e => (e.target as HTMLTextAreaElement).select()}
            className="w-full h-28 bg-zinc-900 border border-zinc-600 text-zinc-300 p-2 text-[11px] font-mono resize-none focus:outline-none"
          />
          <button
            onClick={copyToClipboard}
            className={`text-[11px] px-3 py-1.5 border uppercase tracking-wide transition-colors ${
              copied
                ? 'bg-green-900/30 border-green-700 text-green-400'
                : 'bg-zinc-800 border-zinc-600 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            {copied ? 'Copied!' : 'Copy to clipboard'}
          </button>
          <p className="text-[10px] text-zinc-600">
            {mode === 'exportCode'
              ? 'Share this code with anyone — paste it with "Import Code" on any device.'
              : 'Full JSON for backup or manual editing.'}
          </p>
        </div>
      )}

      {/* Import: Code or JSON */}
      {(mode === 'importCode' || mode === 'importJson') && (
        <div className="space-y-2">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={mode === 'importCode' ? 'Paste army code here…' : 'Paste exported JSON here…'}
            className="w-full h-28 bg-zinc-900 border border-zinc-600 text-zinc-300 p-2 text-[11px] font-mono resize-none focus:outline-none focus:border-amber-600"
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

      {/* Import JSON button — tucked away for power users */}
      {!mode && (
        <button
          onClick={() => { setText(''); setMode('importJson'); }}
          className="text-[10px] text-zinc-600 hover:text-zinc-400 underline underline-offset-2"
        >
          Import JSON
        </button>
      )}
    </div>
  );
}
