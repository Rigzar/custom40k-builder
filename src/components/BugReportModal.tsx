import { useState } from 'react';

const BUG_REPORT_ENDPOINT = '/api/bug-report';

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
      const res = await fetch(BUG_REPORT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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

              {/* Unwise's suggestion (2026-09-11): the landing banner already carries this, but a
                  banner can be dismissed and only shows on the front page. THIS is the moment
                  someone is about to report a rules mismatch, so the notice belongs here too.
                  Rewritten 2026-09-12: it used to say the codex updates were not in, which stopped
                  being true once all 22 landed. It now scopes the "expected, not a bug" carve-out
                  down to the ONE thing still outside — the ability clean-up — and invites reports
                  on everything else. Keep it in step with LandingPage's line5. */}
              <div className="border-l-2 border-amber-700 bg-amber-950/25 pl-3 py-2 space-y-1">
                <p className="text-amber-500 text-[11px] uppercase tracking-widest font-semibold">
                  Before you send
                </p>
                <p className="text-zinc-300 text-xs leading-relaxed">
                  The September rules and codex update <strong>is</strong> in — Core Rules 1.261,
                  the Missions supplement and all 22 codices. If something in those looks wrong,
                  please <strong>do</strong> tell us.{' '}
                  <strong>One part is deliberately still out: the weapon-ability clean-up.</strong>{' '}
                  Unwise is rewriting those across every army (Flames becomes Auto Hit plus
                  Sunder(1), Flurry becomes Extra Attack, and Explosive, Barrage and Colossal Blast
                  all become Blast(x)), and they have to change everywhere at once, so your cards
                  still show the old names on purpose. A weapon ability that disagrees with the
                  newest rules document is expected and {' '}<strong>not a bug</strong>.
                </p>
              </div>

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
