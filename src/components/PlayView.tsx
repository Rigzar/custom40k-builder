/**
 * PlayView — the army as it is at the table, not as it is being built.
 *
 * Unwise, who plays with the app open beside the models: *"The app is very good for keeping track
 * of a unit's weapons and abilities. During games I scroll through my army and click to open my
 * units — to me it is much easier than the PDF. BUT when I am in a game, I do not care about what
 * I did not pick."*
 *
 * So this is the builder with the building taken out. No size steppers, no option groups, no
 * armoury buttons, no points arithmetic to re-check — one line per unit, tap to open, and inside
 * only what that unit actually has: its models and stats, the weapons it is carrying, and the
 * abilities, traits, powers and prayers it really owns.
 *
 * Deliberately NOT a wound or token tracker. Unwise asked for that to stay out — *"Tabletop
 * Simulator or real life models are good for that"* — and a half-tracker that disagrees with the
 * table is worse than none.
 *
 * Everything shown comes from `resolveUnitProfile` and `lib/battleProfile`, the same pair the
 * printed card reads, so this view and the printout can never disagree about your loadout.
 */
import { useState } from 'react';
import { useArmyStore } from '../store/army';
import { resolveUnit } from '../engine/points';
import { resolveUnitProfile } from '../engine/resolver';
import { selectedAbilities, battleWeapons, selectedExtras } from '../lib/battleProfile';
import { resolveStatValue } from '../lib/statPipeline';
import { wardSave, ownWardAbilities } from '../lib/wardSave';
import { getFactionCat, entryFaction, HDR_BG, HDR_BORDER } from '../lib/factionTheme';
import { powerMetaByName } from '../utils/psychicFormat';
import { useT } from '../i18n';
import type { RosterEntry } from '../types/army';
import type { FactionData, Weapon } from '../types/data';

const STAT_INF = ['M', 'WS', 'BS', 'S', 'T', 'W', 'I', 'A', 'LD', 'SV'];
const STAT_VEH = ['M', 'WS', 'BS', 'S', 'FRONT', 'SIDE', 'REAR', 'I', 'A', 'HP'];

function WeaponTable({ rows, title }: { rows: Weapon[]; title: string }) {
  if (!rows.length) return null;
  return (
    <div className="mt-2">
      <div className="text-[9px] uppercase tracking-widest text-amber-700 mb-1">{title}</div>
      <div className="overflow-x-auto">
        <table className="w-full text-[11px] border-collapse">
          <thead>
            <tr className="text-zinc-600 text-[9px] uppercase tracking-wide">
              <th className="text-left font-normal pb-0.5">·</th>
              <th className="text-right font-normal px-1">Rng</th>
              <th className="text-left  font-normal px-1">Type</th>
              <th className="text-right font-normal px-1">S</th>
              <th className="text-right font-normal px-1">AP</th>
              <th className="text-right font-normal px-1">D</th>
              <th className="text-left  font-normal px-1">Abilities</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((w, i) => (
              <tr key={`${w.name}-${i}`} className="border-t border-zinc-800/70 align-top">
                <td className="text-zinc-200 py-0.5 pr-1">{w.name}</td>
                <td className="text-zinc-400 text-right px-1 tabular-nums">{w.range}</td>
                <td className="text-zinc-400 px-1">{w.type}</td>
                <td className="text-zinc-300 text-right px-1 tabular-nums">{w.s}</td>
                <td className="text-zinc-300 text-right px-1 tabular-nums">{w.ap}</td>
                <td className="text-zinc-300 text-right px-1 tabular-nums">{w.d}</td>
                <td className="text-zinc-500 px-1">{w.abilities && w.abilities !== '-' ? w.abilities : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PlayCard({ item, data, armoryData, defaultOpen }: {
  item: RosterEntry; data: FactionData; armoryData?: FactionData; defaultOpen: boolean;
}) {
  const t = useT();
  // Seeded from the header's expand-all, and free to diverge afterwards: the card is remounted
  // (its key carries the flag) whenever that toggle changes, so the seed is re-applied then and
  // a card the player opened by hand in between is not fought over on every render.
  const [open, setOpen] = useState(defaultOpen);
  const u = resolveUnit(item, data);
  if (!u) return null;

  const store = useArmyStore.getState();
  const rp: any = resolveUnitProfile(item, u, store, armoryData ?? data);
  const abilities = selectedAbilities(u, item, rp);
  const groups = battleWeapons(rp);
  const extras = selectedExtras(item);
  const models = rp.modelsToShow ?? [];
  const statKeys = u.is_vehicle ? STAT_VEH : STAT_INF;
  // A ward save is the other number you roll at the table, and this view showed none at
  // all: the derivation lived inside the unit card, so a Daemon, a Custodian or a C'tan
  // came here with nothing. 163 of 666 datasheets state one.
  const ward = wardSave({
    abilities: ownWardAbilities(u, item), equipInvSave: rp.equipMods?.invulnSave,
    optionAbilities: rp.optionAbilities, traitAbilities: rp.traitAbilities,
  });
  // At the table the number you roll against is the FINAL one, so this runs the whole chain the
  // unit card runs — Marks, traits, wargear and options — not just the Marks. Reported the day
  // this view shipped: Toxin Sacs raised Strength on the unit card and not here.
  const marks: string[] = rp.blackCrusadeChampion
    ? ['Khorne', 'Nurgle', 'Slaanesh', 'Tzeentch']
    : rp.statModMark ? [rp.statModMark] : [];
  const statOf = (m: any, i: number, k: string) => resolveStatValue(m.stats?.[k] ?? '-', k, {
    unit: u,
    marks,
    favouredLeader: !!rp.isFavored && i === rp.squadLeaderIdx,
    traitStatMods: rp.traitStatMods ?? [],
    optionStatMods: rp.optionStatMods ?? [],
    optionStatSets: rp.optionStatSets ?? {},
    equipMods: rp.equipMods,
    traitEquipMods: rp.traitEquipMods,
    // Every row in this view is the unit as fielded; a champion's own purchases already sit on
    // the champion's model row, which is the row this renders.
    isEquipTarget: true,
    ctanYngirActive: rp.ctanYngirActive,
  });

  // `modelCounts` is an array PARALLEL to modelsToShow, not a map keyed by model name, and its
  // entries are null for a model whose count is simply the unit size. Reading it as a map printed
  // every unit's size as 0.
  const counts: (number | null)[] = rp.modelCounts ?? [];
  const counted = counts.reduce<number>((a, b) => a + (b ?? 0), 0);
  const size = counted > 0 ? counted : item.size;

  // Each unit wears ITS OWN faction's colour, not the army's: an allied detachment is the whole
  // reason to tint a card at all. Asked for on this view — the builder already does it and losing
  // it here cost the one cue that says which detachment a unit belongs to while scrolling mid-game.
  const cat = getFactionCat(entryFaction(item, data.faction));

  return (
    <div className="border border-zinc-800 border-l-2" style={{ borderLeftColor: HDR_BORDER[cat] }}>
      <button
        className="w-full flex items-baseline gap-2 px-3 py-2 text-left hover:brightness-125 transition-all"
        style={{ background: HDR_BG[cat] }}
        onClick={() => setOpen(o => !o)}
      >
        <span className="text-zinc-600 text-[10px] w-3 shrink-0">{open ? '−' : '+'}</span>
        <span className="text-zinc-100 text-[13px] font-semibold flex-1 truncate">
          {item.customName || item.unitName}
        </span>
        <span className="text-zinc-500 text-[10px] tabular-nums shrink-0">{size}</span>
        <span className="text-[10px] tabular-nums shrink-0" style={{ color: HDR_BORDER[cat] }}>{rp.pts} pts</span>
      </button>

      {open && (
        <div className="px-3 pb-3 bg-zinc-950/40" style={{ borderTop: `1px solid ${HDR_BORDER[cat]}55` }}>
          {/* stats */}
          {models.length > 0 && (
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-[11px] border-collapse">
                <thead>
                  <tr className="text-zinc-600 text-[9px] uppercase tracking-wide">
                    <th className="text-left font-normal pb-0.5">Model</th>
                    {statKeys.map(k => <th key={k} className="text-right font-normal px-1">{k}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {models.map((m: any, i: number) => (
                    <tr key={`${m.name}-${i}`} className="border-t border-zinc-800/70">
                      <td className="text-zinc-200 py-0.5 pr-1">
                        {counts[i] != null ? `${counts[i]}x ` : ''}{m.name}
                      </td>
                      {statKeys.map(k => {
                        const { display, source } = statOf(m, i, k);
                        // Same colour language as the unit card: blue Mark, green trait,
                        // violet wargear, cyan option.
                        const tone = source.mark ? 'text-blue-300'
                          : source.trait ? 'text-emerald-300'
                          : source.equip ? 'text-violet-300'
                          : source.option ? 'text-cyan-300' : 'text-zinc-300';
                        return (
                          <td key={k} className={`text-right px-1 tabular-nums ${tone}`}>{display}</td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {ward !== null && (
            <div className="mt-1 text-[10px] text-amber-300/90">
              <span className="uppercase tracking-wide text-zinc-500">Ward save</span>{' '}
              <span className="font-mono font-semibold">{ward}+</span>
            </div>
          )}

          {groups.map((g, gi) => (
            <div key={gi}>
              {g.label && groups.length > 1 && (
                <div className="text-[9px] uppercase tracking-widest text-zinc-600 mt-2">{g.label}</div>
              )}
              <WeaponTable rows={g.ranged} title={t('playRanged')} />
              <WeaponTable rows={g.melee} title={t('playMelee')} />
            </div>
          ))}

          {abilities.length > 0 && (
            <div className="mt-3">
              <div className="text-[9px] uppercase tracking-widest text-amber-700 mb-1">{t('playAbilities')}</div>
              <ul className="space-y-1">
                {abilities.map((ab, i) => {
                  const ci = ab.indexOf(':');
                  const name = ci > 0 ? ab.slice(0, ci) : ab;
                  const body = ci > 0 ? ab.slice(ci + 1).trim() : '';
                  return (
                    <li key={i} className="text-[11px] leading-snug">
                      <span className="text-zinc-200">{name}</span>
                      {body && <span className="text-zinc-500"> — {body}</span>}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {(extras.traits.length > 0 || extras.powers.length > 0 || extras.prayers.length > 0) && (
            <div className="mt-3 space-y-0.5 text-[11px]">
              {extras.traits.length > 0 && (
                <p><span className="text-zinc-600 uppercase text-[9px] tracking-widest mr-1">{t('playTraits')}</span>
                   <span className="text-zinc-300">{extras.traits.join(' · ')}</span></p>
              )}
              {/* The one view you actually read DURING a game, and it listed powers and prayers by
                  NAME only — so the range and cast value of the thing you are about to cast were
                  the one detail it did not have. Each entry now carries its meta line (type,
                  range, cast value, target, duration) from the shared formatter. The effect text
                  stays out on purpose: this view's whole point is a compact card, and the full
                  rules text is one tap away on the unit card and on the printed sheet. */}
              {extras.powers.length > 0 && (
                <div><span className="text-zinc-600 uppercase text-[9px] tracking-widest mr-1">{t('playPowers')}</span>
                  {extras.powers.map((name, i) => {
                    const meta = powerMetaByName(name, data);
                    return (
                      <span key={i} className="text-zinc-300">
                        {i > 0 && <span className="text-zinc-600"> · </span>}
                        {name}
                        {meta && <span className="text-amber-600/90"> ({meta})</span>}
                      </span>
                    );
                  })}
                </div>
              )}
              {extras.prayers.length > 0 && (
                <div><span className="text-zinc-600 uppercase text-[9px] tracking-widest mr-1">{t('playPrayers')}</span>
                  {extras.prayers.map((name, i) => {
                    const meta = powerMetaByName(name, data);
                    return (
                      <span key={i} className="text-zinc-300">
                        {i > 0 && <span className="text-zinc-600"> · </span>}
                        {name}
                        {meta && <span className="text-amber-600/90"> ({meta})</span>}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function PlayView({ onClose }: { onClose: () => void }) {
  const t = useT();
  const { data, army, alliedData } = useArmyStore() as any;
  const [allOpen, setAllOpen] = useState(false);
  if (!data) return null;

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950 overflow-y-auto">
      <div className="sticky top-0 z-10 bg-zinc-950/95 backdrop-blur border-b border-zinc-800
                      px-4 py-2 flex items-center gap-2">
        <span className="text-amber-500 text-[11px] uppercase tracking-widest flex-1">{t('playTitle')}</span>
        <button
          className="text-[10px] uppercase tracking-wide px-2 py-1 border border-zinc-700 text-zinc-400 hover:text-zinc-200"
          onClick={() => setAllOpen(o => !o)}
        >
          {allOpen ? t('playCollapseAll') : t('playExpandAll')}
        </button>
        <button
          className="text-[10px] uppercase tracking-wide px-2 py-1 border border-amber-700 text-amber-400 hover:bg-amber-900/30"
          onClick={onClose}
        >
          {t('playClose')}
        </button>
      </div>

      <div className="p-3 space-y-1.5 max-w-3xl mx-auto">
        <p className="text-zinc-600 text-[10px] leading-snug pb-1">{t('playHint')}</p>
        {army.length === 0 && <p className="text-zinc-500 italic text-[12px]">{t('playEmpty')}</p>}
        {army.map((item: RosterEntry) => (
          <PlayCard
            key={`${item.id}-${allOpen}`}
            item={item}
            data={data}
            defaultOpen={allOpen}
            armoryData={item.factionSource && alliedData ? alliedData : undefined}
          />
        ))}
      </div>
    </div>
  );
}
