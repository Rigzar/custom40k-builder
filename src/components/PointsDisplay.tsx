import { useArmyStore } from '../store/army';
import { computeUnitPoints, resolveUnit } from '../engine/points';

export function PointsDisplay() {
  const { army, data, pointLimit } = useArmyStore();
  if (!data) return null;

  const total = army.reduce((s, i) => {
    const u = resolveUnit(i, data);
    return s + (u ? computeUnitPoints(i, u) : 0);
  }, 0);

  const pct = Math.min(100, (total / pointLimit) * 100);
  const over = total > pointLimit;

  return (
    <div className="bg-zinc-800 border border-zinc-700 p-3 text-center">
      <div className={`text-3xl font-bold tracking-wide ${over ? 'text-red-400' : 'text-amber-500'}`}>
        {total}
      </div>
      <div className="text-[11px] text-zinc-500 mb-2">/ {pointLimit} pts</div>
      <div className="h-1.5 bg-zinc-900 overflow-hidden rounded">
        <div
          className={`h-full transition-all ${over ? 'bg-red-500' : 'bg-amber-600'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
