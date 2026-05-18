import { useSavedArmies, type SavedArmy } from '../hooks/useSavedArmies';

interface Props {
  onLoad: (save: SavedArmy) => void;
  onClose: () => void;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export function SavedArmiesModal({ onLoad, onClose }: Props) {
  const { saves, deleteArmy } = useSavedArmies();

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-start justify-center z-50 p-4 overflow-y-auto"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-zinc-900 border-2 border-amber-800 w-full max-w-xl my-4">
        <div className="flex justify-between items-center px-4 py-3 bg-zinc-800 border-b border-amber-800">
          <h3 className="text-amber-400 uppercase tracking-widest text-sm">My Armies</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-xl leading-none">✕</button>
        </div>

        <div className="p-4">
          {saves.length === 0 ? (
            <p className="text-zinc-500 italic text-sm text-center py-8">
              No saved armies yet. Use "Save Army" in the header to save the current army.
            </p>
          ) : (
            <div className="space-y-3">
              {saves.map(save => (
                <div
                  key={save.id}
                  className="bg-zinc-800 border border-zinc-700 border-l-4 border-l-amber-800 p-3 flex items-center gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-zinc-100 truncate">{save.name}</div>
                    <div className="text-[10px] text-amber-700 uppercase tracking-wide mt-0.5">{save.factionLabel}</div>
                    <div className="text-[11px] text-zinc-500 mt-1">
                      {save.unitCount} units · {save.totalPts} pts · {formatDate(save.savedAt)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => { onLoad(save); onClose(); }}
                      className="text-[11px] px-3 py-1.5 bg-amber-900/40 border border-amber-700 text-amber-400 hover:bg-amber-800/50 uppercase tracking-wide transition-colors"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => deleteArmy(save.id)}
                      className="text-zinc-600 hover:text-red-400 text-xl leading-none transition-colors"
                      title="Delete"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
