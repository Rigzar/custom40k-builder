import { useState } from 'react';

const GITHUB_ISSUES = 'https://github.com/Rigzar/custom40k-builder/issues/new';

interface Props {
  onClose: () => void;
  currentFaction?: string;
}

export function BugReportModal({ onClose, currentFaction }: Props) {
  const [what, setWhat]         = useState('');
  const [expected, setExpected] = useState('');
  const [where, setWhere]       = useState(currentFaction ?? '');

  function buildAndOpen() {
    const title = what.trim().slice(0, 80) || 'Bug report';

    const body = [
      '## What happened?',
      what.trim() || '(not provided)',
      '',
      '## What did you expect to happen?',
      expected.trim() || '(not provided)',
      '',
      '## Which faction or unit?',
      where.trim() || '(not provided)',
      '',
      '## Steps to reproduce',
      '1. ',
      '2. ',
      '3. ',
      '',
      '---',
      `*Reported from the app — v${import.meta.env.VITE_APP_VERSION ?? '?'}*`,
    ].join('\n');

    const url = `${GITHUB_ISSUES}?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}&labels=bug`;
    window.open(url, '_blank', 'noopener');
    onClose();
  }

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-zinc-900 border-2 border-red-900 w-full max-w-lg">

        <div className="flex justify-between items-center px-4 py-3 bg-zinc-800 border-b border-red-900">
          <h3 className="text-red-400 uppercase tracking-widest text-sm">Report a bug</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-xl leading-none">✕</button>
        </div>

        <div className="p-4 space-y-4">
          <p className="text-zinc-400 text-xs leading-relaxed">
            Fill in what you can — no technical knowledge needed. Clicking{' '}
            <span className="text-amber-400">Send report</span> will open GitHub with everything already written.
          </p>

          <div>
            <label className="block text-[11px] uppercase tracking-widest text-amber-600 mb-1">
              What happened? <span className="text-red-500">*</span>
            </label>
            <textarea
              value={what}
              onChange={e => setWhat(e.target.value)}
              placeholder="e.g. When I add a Rhino, the points stay at 0 and I can't save the army."
              rows={3}
              className="w-full bg-zinc-800 border border-zinc-700 focus:border-amber-700 text-zinc-200 text-sm px-3 py-2 outline-none resize-none placeholder:text-zinc-600"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-widest text-amber-600 mb-1">
              What did you expect to happen?
            </label>
            <textarea
              value={expected}
              onChange={e => setExpected(e.target.value)}
              placeholder="e.g. The Rhino should show its correct points (80 pts)."
              rows={2}
              className="w-full bg-zinc-800 border border-zinc-700 focus:border-amber-700 text-zinc-200 text-sm px-3 py-2 outline-none resize-none placeholder:text-zinc-600"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-widest text-amber-600 mb-1">
              Which faction or unit?
            </label>
            <input
              value={where}
              onChange={e => setWhere(e.target.value)}
              placeholder="e.g. Space Marines — Rhino"
              className="w-full bg-zinc-800 border border-zinc-700 focus:border-amber-700 text-zinc-200 text-sm px-3 py-2 outline-none placeholder:text-zinc-600"
            />
          </div>

          <p className="text-zinc-600 text-[11px]">
            You'll need a free GitHub account to submit the report. If you don't have one, you can create one at{' '}
            <a
              href="https://github.com/join"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-700 hover:text-amber-400 underline"
            >
              github.com
            </a>
            .
          </p>
        </div>

        <div className="px-4 py-3 border-t border-zinc-700 flex justify-between items-center bg-zinc-800">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-zinc-400 text-sm hover:text-zinc-200 uppercase tracking-wide"
          >
            Cancel
          </button>
          <button
            onClick={buildAndOpen}
            disabled={!what.trim()}
            className="px-4 py-1.5 bg-red-900/60 border border-red-700 text-red-300 text-sm hover:bg-red-800/60 disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-wide transition-colors"
          >
            Send report →
          </button>
        </div>
      </div>
    </div>
  );
}
