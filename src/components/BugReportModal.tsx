import { useState } from 'react';

const FORMSPREE = 'https://formspree.io/f/xojbvbej';

type Status = 'idle' | 'sending' | 'sent' | 'error';

interface Props {
  onClose: () => void;
  currentFaction?: string;
}

export function BugReportModal({ onClose, currentFaction }: Props) {
  const [what, setWhat]         = useState('');
  const [expected, setExpected] = useState('');
  const [where, setWhere]       = useState(currentFaction ?? '');
  const [status, setStatus]     = useState<Status>('idle');

  async function handleSubmit() {
    if (!what.trim()) return;
    setStatus('sending');
    try {
      const res = await fetch(FORMSPREE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          subject: `[Bug] ${what.trim().slice(0, 80)}`,
          what: what.trim(),
          expected: expected.trim() || '(not provided)',
          faction: where.trim() || '(not provided)',
        }),
      });
      setStatus(res.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={e => e.target === e.currentTarget && status !== 'sending' && onClose()}
    >
      <div className="bg-zinc-900 border-2 border-red-900 w-full max-w-lg">

        <div className="flex justify-between items-center px-4 py-3 bg-zinc-800 border-b border-red-900">
          <h3 className="text-red-400 uppercase tracking-widest text-sm">Report a bug</h3>
          <button onClick={onClose} disabled={status === 'sending'} className="text-zinc-400 hover:text-white text-xl leading-none disabled:opacity-40">✕</button>
        </div>

        {status === 'sent' ? (
          <div className="p-8 text-center space-y-3">
            <div className="text-green-400 text-3xl">✓</div>
            <p className="text-zinc-200 text-sm font-semibold">Report sent — thank you!</p>
            <p className="text-zinc-500 text-xs">We'll look into it as soon as possible.</p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 bg-zinc-700 border border-zinc-600 text-zinc-200 text-sm hover:bg-zinc-600 uppercase tracking-wide"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="p-4 space-y-4">
              <p className="text-zinc-400 text-xs leading-relaxed">
                Fill in what you can — no technical knowledge needed. We'll get back to you as soon as possible.
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

              {status === 'error' && (
                <p className="text-red-400 text-xs">Something went wrong — please try again.</p>
              )}
            </div>

            <div className="px-4 py-3 border-t border-zinc-700 flex justify-between items-center bg-zinc-800">
              <button
                onClick={onClose}
                disabled={status === 'sending'}
                className="px-4 py-1.5 text-zinc-400 text-sm hover:text-zinc-200 uppercase tracking-wide disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!what.trim() || status === 'sending'}
                className="px-4 py-1.5 bg-red-900/60 border border-red-700 text-red-300 text-sm hover:bg-red-800/60 disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-wide transition-colors"
              >
                {status === 'sending' ? 'Sending…' : 'Send report →'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
