import { useArmyStore } from '../store/army';
import { UnitCard } from './UnitCard';
import { SLOT_ORDER } from '../engine/engagements';
import { getArchetypeRule, getEffectiveSlotFor } from '../engine/archetypes';
import { applyVariantSlotOverride } from '../engine/slotOverrides';
import { applyPlatoonSlotOverride } from '../engine/codex_imperial_guard/platoon';
import { resolveUnit, computeUnitPoints } from '../engine/points';
import { SLOT_ICONS } from '../assets/slotIcons';
import { useT, type TranslationKey } from '../i18n';
import { removedUnitNote } from '../engine/unitRenames';
import type { RosterEntry } from '../types/army';

const SLOT_LABEL_KEY: Record<string, TranslationKey> = {
  'HQ': 'hq', 'Troops': 'troops', 'Elites': 'elites', 'Fast Attack': 'fastAttack',
  'Heavy Support': 'heavySupport', 'Dedicated Transport': 'transport',
  'Fortifications': 'fortifications', 'Flyers': 'flyers', 'Lords of War': 'lordsOfWar',
};

// Gold-tinted slot icons. The filter moved to `.symbol-tint-gold` (index.css) so light mode can
// use a dark gold instead of the bright one that disappears on white.
const SLOT_ICON_STYLE: React.CSSProperties = { opacity: 0.65 };
const SLOT_ICON_CLASS = 'symbol-tint-gold';

/**
 * A roster entry whose datasheet the codex no longer has.
 *
 * UnitCard bails out with `return null` when the unit does not resolve, so before this existed the
 * entry was simply INVISIBLE while still counting against its slot and contributing 0 points —
 * a slot header reading "1 unit · 0 pts" with nothing under it. Show it, say why, and give the one
 * action that helps. See engine/unitRenames.ts for the renames that are mapped forward instead.
 */
function MissingUnitCard({ item, faction }: { item: RosterEntry; faction: string }) {
  const t = useT();
  const removeUnit = useArmyStore(s => s.removeUnit);
  const note = removedUnitNote(faction, item.unitName);
  return (
    <div className="mb-2 border border-red-900/60 bg-red-950/20">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-red-900/40">
        <span className="text-red-500 text-[13px] leading-none" aria-hidden="true">⚠</span>
        <span className="font-cinzel text-[12px] uppercase tracking-wider text-zinc-200 flex-1">{item.unitName}</span>
        <span className="font-cinzel text-[9px] uppercase tracking-widest px-1.5 py-0.5 border border-red-800/70 text-red-400 shrink-0">
          {t('unitNotInCodexTitle')}
        </span>
      </div>
      <div className="px-3 py-2 space-y-2">
        <p className="text-[11px] text-zinc-400 leading-relaxed">{note ?? t('unitNotInCodexBody')}</p>
        <button
          onClick={() => removeUnit(item.id)}
          className="text-[11px] px-2 py-1 bg-zinc-900 border border-zinc-600 text-red-400 hover:bg-zinc-800 uppercase tracking-wide"
        >
          {t('removeFromList')}
        </button>
      </div>
    </div>
  );
}

/**
 * `scope` splits the roster view in two — "primary" (the main faction's own army, plus any
 * archetype/legacy-injected intrinsic ally, e.g. CSM's auto-unlocked Chaos Daemons, which shares
 * the primary's own AOP/Customisation) vs "allied" (the player-picked Allied Detachment, which
 * has its own AOP and its own Archetype/Legacy/Traits — Core Rules: "Allied units are treated as
 * separate armies on the battlefield"). Each scope uses its OWN archetype rule for slot-remapping
 * and points, so e.g. a unit promoted to Troops by the ally's own archetype is grouped correctly
 * here too, not by the primary's archetype.
 */
export function ArmyList({ scope = 'primary' }: { scope?: 'primary' | 'allied' }) {
  const t = useT();
  const { army, data, archetype, alliedFaction, alliedArchetype } = useArmyStore();
  if (!data) return null;

  const scopedArmy = scope === 'allied'
    ? army.filter(item => !!alliedFaction && item.factionSource === alliedFaction)
    : army.filter(item => !alliedFaction || item.factionSource !== alliedFaction);
  const effectiveArchetype = scope === 'allied' ? (alliedArchetype ?? '') : archetype;

  if (scopedArmy.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center select-none">
        <div className="text-[42px] mb-4 opacity-20">⚔</div>
        <div className="font-cinzel text-[11px] uppercase tracking-widest text-zinc-600">{t('noUnitsDeployed')}</div>
        <div className="text-zinc-700 text-[11px] mt-1.5">{t('addUnitsFromCatalogue')}</div>
      </div>
    );
  }

  const rule = getArchetypeRule(effectiveArchetype);

  return (
    <div>
      {SLOT_ORDER.map(slot => {
        const slotUnits = scopedArmy.filter(item => {
          const u = resolveUnit(item, data);
          const baseSlot = applyVariantSlotOverride(item, u, getEffectiveSlotFor(item, rule));
          return applyPlatoonSlotOverride(item, scopedArmy, baseSlot) === slot;
        });
        if (slotUnits.length === 0) return null;

        const slotPts = slotUnits.reduce((s, item) => {
          const u = resolveUnit(item, data);
          return s + (u ? computeUnitPoints(item, u, effectiveArchetype) : 0);
        }, 0);

        return (
          <div key={slot} className="mb-6">
            <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-amber-900/40">
              {SLOT_ICONS[slot] && (
                <img src={SLOT_ICONS[slot]} alt="" className={`w-4 h-4 shrink-0 ${SLOT_ICON_CLASS}`} style={SLOT_ICON_STYLE} />
              )}
              <span className="font-cinzel text-amber-600/90 uppercase tracking-widest text-[11px] flex-1">
                {t(SLOT_LABEL_KEY[slot] ?? 'hq')}
              </span>
              <span className="text-zinc-500 text-[11px] tabular-nums">
                {slotUnits.length} {slotUnits.length === 1 ? 'unit' : 'units'} · {slotPts} pts
              </span>
            </div>
            {slotUnits.map(item => (resolveUnit(item, data)
              ? <UnitCard key={item.id} item={item} />
              : <MissingUnitCard key={item.id} item={item} faction={data.faction} />))}
          </div>
        );
      })}
    </div>
  );
}
