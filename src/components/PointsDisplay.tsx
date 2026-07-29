import { useArmyStore } from '../store/army';
import { computeUnitPoints, resolveUnit, effectiveArchetypeFor } from '../engine/points';
import { useT } from '../i18n';

export function PointsDisplay() {
  const t = useT();
  const store = useArmyStore();
  const { army, data, pointLimit } = store;
  if (!data) return null;

  const total = army.reduce((s, i) => {
    const u = resolveUnit(i, data);
    return s + (u ? computeUnitPoints(i, u, effectiveArchetypeFor(i, store)) : 0);
  }, 0);

  const pct = Math.min(100, (total / pointLimit) * 100);
  const over = total > pointLimit;

  return (
    <div className="bg-zinc-800 border border-zinc-700 p-3 text-center">
      <div className={`text-3xl font-bold tracking-wide ${over ? 'text-red-400' : 'text-amber-500'}`}>
        {total}
      </div>
      <div className="text-[11px] text-zinc-500">/ {pointLimit} pts</div>
      {/* The number a player is actually working with while adding units — what is still free to
          spend, or by how much the list is over. */}
      <div className={`text-[11px] mb-2 ${over ? 'text-red-400' : 'text-zinc-400'}`}>
        {over ? t('pointsOver').replace('{n}', String(total - pointLimit))
              : t('pointsLeft').replace('{n}', String(pointLimit - total))}
      </div>
      <div className="h-1.5 bg-zinc-900 overflow-hidden rounded">
        <div
          className={`h-full transition-all ${over ? 'bg-red-500' : 'bg-amber-600'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
