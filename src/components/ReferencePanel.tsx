import { useState } from 'react';
import { useArmyStore } from '../store/army';
import type { Power, DaemonkinEntry } from '../types/data';

type RefTab = 'pacts' | 'prayers' | 'daemonkin';
type DaemonTab = 'Khorne' | 'Nurgle' | 'Slaanesh' | 'Tzeentch';

const TAB_LABELS: Record<RefTab, string> = {
  pacts: 'Pacts',
  prayers: 'Prayers',
  daemonkin: 'Daemonkin',
};

export function ReferencePanel() {
  const { data } = useArmyStore();
  // All hooks must be called unconditionally, before any early returns
  const [dTab, setDTab] = useState<DaemonTab>('Khorne');
  const [tab, setTab] = useState<RefTab>('pacts');

  if (!data) return null;

  const hasPacts     = data.pacts.length > 0;
  const hasPrayers   = data.prayers.length > 0;
  const hasDaemonkin = Object.values(data.daemonkin).some(g => g?.items?.length > 0);

  if (!hasPacts && !hasPrayers && !hasDaemonkin) return null;

  const availableTabs: RefTab[] = [
    ...(hasPacts     ? (['pacts']     as RefTab[]) : []),
    ...(hasPrayers   ? (['prayers']   as RefTab[]) : []),
    ...(hasDaemonkin ? (['daemonkin'] as RefTab[]) : []),
  ];

  // Fallback: if current tab isn't in availableTabs (e.g., switched faction), use first available
  const activeTab = availableTabs.includes(tab) ? tab : availableTabs[0];

  return (
    <div className="bg-zinc-900 border border-zinc-700 border-l-4 border-l-amber-800">
      <div className="text-[11px] uppercase tracking-widest text-amber-600 px-3 py-2 border-b border-zinc-700">
        Reference
      </div>

      <div className="flex gap-1 p-2 border-b border-zinc-700 flex-wrap">
        {availableTabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-2 py-1 text-[10px] uppercase border transition-colors
              ${activeTab === t
                ? 'bg-amber-800 border-amber-600 text-white'
                : 'bg-zinc-800 border-zinc-600 text-zinc-400 hover:text-amber-400'
              }`}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      <div className="p-3 max-h-96 overflow-y-auto">
        {activeTab === 'pacts' && data.pacts.map((p: Power, i: number) => (
          <PowerBlock key={i} power={p} />
        ))}
        {activeTab === 'prayers' && data.prayers.map((p: Power, i: number) => (
          <PowerBlock key={i} power={p} />
        ))}
        {activeTab === 'daemonkin' && (
          <>
            <div className="flex gap-1 mb-3">
              {(['Khorne','Nurgle','Slaanesh','Tzeentch'] as DaemonTab[]).filter(g => data.daemonkin[g]?.items?.length > 0).map(g => (
                <button
                  key={g}
                  onClick={() => setDTab(g)}
                  className={`px-2 py-0.5 text-[10px] border transition-colors
                    ${dTab === g
                      ? 'bg-amber-800 border-amber-600 text-white'
                      : 'bg-zinc-800 border-zinc-600 text-zinc-400 hover:text-amber-400'
                    }`}
                >
                  {g}
                </button>
              ))}
            </div>
            {data.daemonkin[dTab]?.description && (
              <div className="text-[11px] text-zinc-500 mb-2 border-l-2 border-amber-800 pl-2">
                {data.daemonkin[dTab].description}
              </div>
            )}
            {data.daemonkin[dTab]?.items.map((it: DaemonkinEntry, i: number) => (
              <DaemonBlock key={i} item={it} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function PowerBlock({ power }: { power: Power }) {
  return (
    <div className="bg-zinc-800 border-l-2 border-amber-800 px-2 py-2 mb-2">
      <div className="text-amber-400 text-[12px] font-semibold">{power.name}</div>
      {(Object.entries(power) as [string, string | undefined][])
        .filter(([k]) => k !== 'name')
        .map(([k, v]) => v ? (
          <div key={k} className="text-[11px] text-zinc-400 mt-0.5">
            <span className="text-zinc-600 capitalize">{k.replace(/_/g, ' ')}: </span>{v}
          </div>
        ) : null)}
    </div>
  );
}

function DaemonBlock({ item }: { item: DaemonkinEntry }) {
  return (
    <div className="bg-zinc-800 border-l-2 border-amber-800 px-2 py-2 mb-2">
      <div className="text-amber-400 text-[12px] font-semibold">{item.name}</div>
      {Object.entries(item)
        .filter(([k]) => k !== 'name')
        .map(([k, v]) => (
          <div key={k} className="text-[11px] text-zinc-400 mt-0.5">
            <span className="text-zinc-600 capitalize">{k.replace(/_/g, ' ')}: </span>{v}
          </div>
        ))}
    </div>
  );
}
