import { CHANGELOG } from '../data/changelog';

interface Props { onClose: () => void; }

export function ChangelogModal({ onClose }: Props) {
  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-start justify-center z-50 p-4 overflow-y-auto"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-zinc-900 border-2 border-amber-800 w-full max-w-xl my-4">
        <div className="flex justify-between items-center px-4 py-3 bg-zinc-800 border-b border-amber-800">
          <h3 className="text-amber-400 uppercase tracking-widest text-sm">Changelog</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-xl leading-none">✕</button>
        </div>

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
