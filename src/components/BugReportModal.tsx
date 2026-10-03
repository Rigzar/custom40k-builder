import { useState } from 'react';
import { useT } from '../i18n';

const BUG_REPORT_ENDPOINT = '/api/bug-report';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const CONTACT_KEY = 'c40k_bug_contact';
// Remembered between reports so a second one is one field shorter. Browser storage can be
// blocked or throw (private windows), so it is only ever a convenience.
function readContact(): string {
  try { return localStorage.getItem(CONTACT_KEY) ?? ''; } catch { return ''; }
}

interface Props {
  onClose: () => void;
  currentFaction?: string;
}

export function BugReportModal({ onClose, currentFaction }: Props) {
  const t = useT();
  const [what, setWhat]         = useState('');
  const [expected, setExpected] = useState('');
  const [where, setWhere]       = useState(currentFaction ?? '');
  const [contact, setContact]   = useState(readContact);
  const [status, setStatus]     = useState<Status>('idle');

  async function handleSubmit() {
    if (!what.trim()) return;
    setStatus('sending');
    try { localStorage.setItem(CONTACT_KEY, contact.trim()); } catch { /* optional */ }
    try {
      const res = await fetch(BUG_REPORT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          what: what.trim(),
          expected: expected.trim() || '(not provided)',
          faction: where.trim() || '(not provided)',
          contact: contact.trim() || undefined,
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
          <h3 className="text-red-400 uppercase tracking-widest text-sm">{t('bugReportTitle')}</h3>
          <button onClick={onClose} disabled={status === 'sending'} className="text-zinc-400 hover:text-white text-xl leading-none disabled:opacity-40">✕</button>
        </div>

        {status === 'sent' ? (
          <div className="p-8 text-center space-y-3">
            <div className="text-green-400 text-3xl">✓</div>
            <p className="text-zinc-200 text-sm font-semibold">{t('bugSent')}</p>
            <p className="text-zinc-500 text-xs">{t('bugSentSub')}</p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 bg-zinc-700 border border-zinc-600 text-zinc-200 text-sm hover:bg-zinc-600 uppercase tracking-wide"
            >
              {t('close')}
            </button>
          </div>
        ) : (
          <>
            <div className="p-4 space-y-4">
              <p className="text-zinc-400 text-xs leading-relaxed">
                {t('bugIntro')}
              </p>

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-amber-600 mb-1">
                  {t('bugWhat')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={what}
                  onChange={e => setWhat(e.target.value)}
                  placeholder={t('bugWhatPh')}
                  rows={3}
                  className="w-full bg-zinc-800 border border-zinc-700 focus:border-amber-700 text-zinc-200 text-sm px-3 py-2 outline-none resize-none placeholder:text-zinc-600"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-amber-600 mb-1">
                  {t('bugExpected')}
                </label>
                <textarea
                  value={expected}
                  onChange={e => setExpected(e.target.value)}
                  placeholder={t('bugExpectedPh')}
                  rows={2}
                  className="w-full bg-zinc-800 border border-zinc-700 focus:border-amber-700 text-zinc-200 text-sm px-3 py-2 outline-none resize-none placeholder:text-zinc-600"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-amber-600 mb-1">
                  {t('bugWhere')}
                </label>
                <input
                  value={where}
                  onChange={e => setWhere(e.target.value)}
                  placeholder={t('bugWherePh')}
                  className="w-full bg-zinc-800 border border-zinc-700 focus:border-amber-700 text-zinc-200 text-sm px-3 py-2 outline-none placeholder:text-zinc-600"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-amber-600 mb-1">
                  {t('bugContact')} <span className="text-zinc-500 normal-case tracking-normal">{t('bugOptional')}</span>
                </label>
                <input
                  value={contact}
                  onChange={e => setContact(e.target.value)}
                  maxLength={64}
                  placeholder={t('bugContactPh')}
                  className="w-full bg-zinc-800 border border-zinc-700 focus:border-amber-700 text-zinc-200 text-sm px-3 py-2 outline-none placeholder:text-zinc-600"
                />
                <p className="text-zinc-500 text-[11px] mt-1 leading-snug">
                  {t('bugContactNote')}
                </p>
              </div>

              {status === 'error' && (
                <p className="text-red-400 text-xs">{t('bugError')}</p>
              )}
            </div>

            <div className="px-4 py-3 border-t border-zinc-700 flex justify-between items-center bg-zinc-800">
              <button
                onClick={onClose}
                disabled={status === 'sending'}
                className="px-4 py-1.5 text-zinc-400 text-sm hover:text-zinc-200 uppercase tracking-wide disabled:opacity-40"
              >
                {t('bugCancel')}
              </button>
              <button
                onClick={handleSubmit}
                disabled={!what.trim() || status === 'sending'}
                className="px-4 py-1.5 bg-red-900/60 border border-red-700 text-red-300 text-sm hover:bg-red-800/60 disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-wide transition-colors"
              >
                {status === 'sending' ? t('bugSending') : t('bugSend')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
