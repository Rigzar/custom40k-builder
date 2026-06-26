import { useRef, useState } from 'react';
import { useArmyStore } from '../store/army';

type Mode = 'importJson' | 'exportCode' | 'importCode' | null;

function toCode(obj: unknown): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify(obj))));
}

function fromCode(code: string): unknown {
  return JSON.parse(decodeURIComponent(escape(atob(code.trim()))));
}

export function ExportImport({ onPrint }: { onPrint?: () => void }) {
  const {
    army, engagement, hqMark, archetype, legacy, legacy2,
    traitPool, faction, pointLimit, armyName, importRoster, clearArmy,
    alliedFaction, alliedArchetype, alliedLegacy, alliedTraitPool, alliedHqMark,
  } = useArmyStore();

  const [text, setText]     = useState('');
  const [mode, setMode]     = useState<Mode>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFilePicked(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importRoster(reader.result as string);
      } catch {
        alert('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
  }

  // Must include the Allied Detachment's own state (faction/archetype/legacy/traits) — omitting
  // it used to silently delete the ally on every export+reimport, since importRoster spreads the
  // parsed JSON straight over defaultState and a missing `alliedFaction` resets it to undefined.
  const stateSnapshot = {
    armyName, faction, engagement, pointLimit, hqMark, archetype, legacy, legacy2, traitPool, army,
    alliedFaction, alliedArchetype, alliedLegacy, alliedTraitPool, alliedHqMark,
  };

  function doExportCode() {
    setText(toCode(stateSnapshot));
    setMode('exportCode');
  }

  function doDownloadJson() {
    const blob = new Blob([JSON.stringify(stateSnapshot, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `${armyName || faction || 'army'}.json`;
    a.click();
    URL.revokeObjectURL(url);
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
          onClick={doDownloadJson}
          className="text-[11px] px-3 py-1.5 bg-zinc-800 border border-zinc-600 text-zinc-500 hover:bg-zinc-700 uppercase tracking-wide"
        >
          ↓ JSON
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          onChange={handleFilePicked}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-[11px] px-3 py-1.5 bg-zinc-800 border border-zinc-600 text-zinc-500 hover:bg-zinc-700 uppercase tracking-wide"
        >
          ↑ JSON
        </button>
        {onPrint && (
          <button
            onClick={onPrint}
            className="text-[11px] px-3 py-1.5 bg-zinc-800 border border-zinc-600 text-zinc-500 hover:bg-zinc-700 uppercase tracking-wide"
          >
            Print
          </button>
        )}
        <button
          onClick={() => { if (confirm('Clear the entire army?')) clearArmy(); }}
          className="text-[11px] px-3 py-1.5 bg-zinc-800 border border-red-800 text-red-400 hover:bg-red-900/30 uppercase tracking-wide"
        >
          Clear
        </button>
      </div>

      {/* Export Code */}
      {mode === 'exportCode' && (
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
          <p className="text-[10px] text-zinc-600">Share this code with anyone — paste it with "Import Code" on any device.</p>
        </div>
      )}

      {/* Import Code or JSON */}
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

      {/* Footer links */}
      {!mode && (
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setText(''); setMode('importJson'); }}
            className="text-[10px] text-zinc-600 hover:text-zinc-400 underline underline-offset-2"
          >
            Import JSON
          </button>
          <span className="text-zinc-700 text-[10px]">·</span>
          <span className="text-[10px] text-zinc-600">
            Use the <span className="text-red-500/70">Bug</span> button in the header to report issues
          </span>
        </div>
      )}
    </div>
  );
}
