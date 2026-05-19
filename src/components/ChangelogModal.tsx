import { useState } from 'react';
import { CHANGELOG, KNOWN_ISSUES, type IssueStatus } from '../data/changelog';

interface Props { onClose: () => void; }

const STATUS_LABEL: Record<IssueStatus, string> = {
  known:         'Known',
  investigating: 'Investigating',
  fixed:         'Fixed',
};

const STATUS_COLOR: Record<IssueStatus, string> = {
  known:         'text-amber-400 border-amber-700',
  investigating: 'text-blue-400 border-blue-700',
  fixed:         'text-green-500 border-green-700',
};

export function ChangelogModal({ onClose }: Props) {
  const [tab, setTab] = useState<'changelog' | 'issues'>('changelog');

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-start justify-center z-50 p-4 overflow-y-auto"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-zinc-900 border-2 border-amber-800 w-full max-w-xl my-4">
        <div className="flex justify-between items-center px-4 py-3 bg-zinc-800 border-b border-amber-800">
          <div className="flex gap-1">
            <button
              onClick={() => setTab('changelog')}
              className={`text-xs uppercase tracking-widest px-3 py-1 transition-colors ${
                tab === 'changelog'
                  ? 'text-amber-400 bg-zinc-700 border border-amber-800'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Changelog
            </button>
            <button
              onClick={() => setTab('issues')}
              className={`text-xs uppercase tracking-widest px-3 py-1 transition-colors ${
                tab === 'issues'
                  ? 'text-amber-400 bg-zinc-700 border border-amber-800'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Known Issues
            </button>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-xl leading-none">✕</button>
        </div>

        {tab === 'changelog' && (
          <div className="p-4 space-y-6">
            {CHANGELOG.map(entry => (
              <div key={entry.version}>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-amber-500 font-bold text-sm">v{entry.version}</span>
                  <span className="text-zinc-100 text-sm font-semibold">{entry.title}</span>
                  <span className="text-zinc-600 text-[11px] ml-auto">{entry.date}</span>
                </div>
                <ul className="space-y-1 pl-3 border-l border-zinc-700">
                  {entry.changes.map((c, i) => {
                    const isAdded   = c.startsWith('Added:');
                    const isRemoved = c.startsWith('Removed:');
                    const isFixed   = c.startsWith('Fixed:');
                    const color = isAdded ? 'text-green-500' : isRemoved ? 'text-red-500' : isFixed ? 'text-blue-400' : 'text-amber-800';
                    return (
                      <li key={i} className="text-[12px] text-zinc-400 leading-snug">
                        <span className={`${color} mr-1`}>—</span>{c}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}

        {tab === 'issues' && (
          <div className="p-4 space-y-4">
            <p className="text-zinc-500 text-[12px]">
              Check here before reporting a bug — if it's listed as Fixed or Known we already have it covered.
            </p>

            {/* Open issues */}
            <div className="space-y-2">
              <h4 className="text-[10px] uppercase tracking-widest text-zinc-600 border-b border-zinc-800 pb-1">Open</h4>
              {KNOWN_ISSUES.filter(i => i.status !== 'fixed').map(issue => (
                <div key={issue.id} className="bg-zinc-800 border border-zinc-700 p-3">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-zinc-200 text-sm font-semibold leading-snug">{issue.title}</span>
                    <span className={`text-[10px] uppercase tracking-wide border px-1.5 py-0.5 shrink-0 ${STATUS_COLOR[issue.status]}`}>
                      {STATUS_LABEL[issue.status]}
                    </span>
                  </div>
                  <p className="text-zinc-500 text-[12px] leading-snug">{issue.description}</p>
                </div>
              ))}
            </div>

            {/* Fixed issues */}
            <div className="space-y-2">
              <h4 className="text-[10px] uppercase tracking-widest text-zinc-600 border-b border-zinc-800 pb-1">Already Fixed</h4>
              {KNOWN_ISSUES.filter(i => i.status === 'fixed').map(issue => (
                <div key={issue.id} className="bg-zinc-900 border border-zinc-800 p-3 opacity-70">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-zinc-400 text-sm font-semibold leading-snug line-through">{issue.title}</span>
                    <span className={`text-[10px] uppercase tracking-wide border px-1.5 py-0.5 shrink-0 ${STATUS_COLOR[issue.status]}`}>
                      {STATUS_LABEL[issue.status]}
                    </span>
                  </div>
                  <p className="text-zinc-600 text-[12px] leading-snug">{issue.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="px-4 py-3 border-t border-zinc-700 flex justify-end bg-zinc-800">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-700 border border-zinc-600 text-zinc-200 text-sm hover:bg-zinc-600 uppercase tracking-wide"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
