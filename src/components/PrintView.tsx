import { useState, Fragment } from 'react';
import type { ReactElement } from 'react';
import type { RosterEntry, Mark } from '../types/army';
import type { Unit, Weapon, ArmoryItem, FactionData } from '../types/data';
import { useLanguage, t as tFn } from '../i18n';
import { useArmyStore } from '../store/army';
import { resolveUnit } from '../engine/points';
import { getArchetypeRule } from '../engine/archetypes';
import { SLOT_ORDER, ENGAGEMENTS } from '../engine/engagements';
import { SLOT_ICONS } from '../assets/slotIcons';
import { lookupRuleGeneric, lookupWeaponType } from '../data/coreRules';
import { isWeaponTrait, extractWeaponGains } from '../engine/equipMods';
import type { EquipMods } from '../engine/equipMods';
import { resolveUnitProfile } from '../engine/resolver';

import genericBg       from '../assets/factionBackground.png';
import chaosMarine_bg  from '../assets/chaosMarinesBackground.png';
import deathGuard_bg   from '../assets/dgBackground.png';
import thousandSons_bg from '../assets/thousandBackground.png';
import worldEaters_bg  from '../assets/worldEatersBackground.png';
import chaosKnights_bg from '../assets/chaosKnightsBackground.png';
import imperium_bg     from '../assets/imperiumBackground.png';
import mechanicus_bg   from '../assets/mechanicusBackground.png';
import custodes_bg     from '../assets/custodesBackground.png';
import sisters_bg      from '../assets/sistersBackground.png';
import tau_bg          from '../assets/tauBackground.png';
import necron_bg       from '../assets/necronBackground.png';
import ork_bg          from '../assets/orkBackground.png';
import tyranid_bg      from '../assets/tyranidBackground.png';

const FACTION_BG: Record<string, string> = {
  'Chaos Space Marines':        chaosMarine_bg,
  'Chaos Daemons':              chaosMarine_bg,
  'Death Guard':                deathGuard_bg,
  'Thousand Sons':              thousandSons_bg,
  'World Eaters':               worldEaters_bg,
  'Chaos Knights':              chaosKnights_bg,
  'Space Marines':              imperium_bg,
  'Imperial Guard':             imperium_bg,
  'Grey Knights':               imperium_bg,
  'Inquisition':                imperium_bg,
  'Assassins':                  imperium_bg,
  'Horus Heresy Space Marines': imperium_bg,
  'Adeptus Mechanicus':         mechanicus_bg,
  'Adeptus Custodes':           custodes_bg,
  'Adeptus Sororitas':          sisters_bg,
  'Tau Empire':                 tau_bg,
  'Necrons':                    necron_bg,
  'Orks':                       ork_bg,
  'Genestealer Cults':          tyranid_bg,
  'Tyranids':                   tyranid_bg,
};

const MARK_COLOR: Record<string, string> = {
  Khorne: '#883531', Nurgle: '#5c672b', Slaanesh: '#634c74',
  Tzeentch: '#015d68', Undivided: '#3a3a3a',
};
const DEFAULT_COLOR = '#4a3a10';
function getMarkColor(mark: Mark | null): string {
  return mark ? (MARK_COLOR[mark] ?? DEFAULT_COLOR) : DEFAULT_COLOR;
}

const STAT_KEYS_INF = ['M','WS','BS','S','T','W','I','A','LD','SV'] as const;
const STAT_KEYS_VEH = ['M','BS','S','FR','SI','RE','I','A','HP'] as const;

const MARK_STAT_MODS: Record<string, { stat: string; delta: number } | null> = {
  Khorne: { stat: 'A', delta: 1 }, Nurgle: { stat: 'T', delta: 1 },
  Slaanesh: { stat: 'I', delta: 1 }, Tzeentch: null, Undivided: null,
};
const MARK_CHAR_MODS: Record<string, { stat: string; delta: number } | null> = {
  Khorne: { stat: 'S', delta: 1 }, Nurgle: { stat: 'W', delta: 1 },
  Slaanesh: { stat: 'M', delta: 2 }, Tzeentch: null, Undivided: null,
};
function applyDelta(val: string, delta: number): string {
  if (!val || val === '-') return val;
  if (/^\d+$/.test(val)) return String(parseInt(val) + delta);
  const m = val.match(/^(\d+)"$/);
  if (m) return `${parseInt(m[1]) + delta}"`;
  return val;
}

// Highlights 8th ed weapon special rules in the accent color
const WEAPON_KEYWORDS_8TH = [
  'rapid fire', 'snap fire', 'entropic strike', 'instant death', 'soul blaze',
  'gets hot!', 'armourbane', 'fleshbane', 'ordnance', 'template', 'grenade',
  'barrage', 'salvo', 'assault', 'poisoned', 'concussive', 'haywire',
  'pinning', 'rending', 'scatter', 'corrosive', 'sniper', 'sunder',
  'heavy', 'blast', 'lance', 'melta', 'flame', 'shred', 'blind', 'pistol',
];
function highlightRules(text: string): string {
  if (!text || text === '-') return text;
  let out = text;
  for (const kw of WEAPON_KEYWORDS_8TH) {
    const esc = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    out = out.replace(
      new RegExp(`\\b${esc}\\b`, 'gi'),
      `<b style="color:var(--ac);text-transform:uppercase">${kw.toUpperCase()}</b>`,
    );
  }
  return out;
}

function findArmoryItem(data: FactionData, name: string): ArmoryItem | undefined {
  const sources = [data.armory_general, ...Object.values(data.armory_marks), ...Object.values(data.armory_legions)];
  for (const arm of sources)
    for (const sec of ['weapons', 'equipment', 'daemon_weapons'] as const) {
      const found = (arm[sec] as ArmoryItem[]).find(a => a.name === name);
      if (found) return found;
    }
  return undefined;
}

// ── Stat row ──────────────────────────────────────────────────────────────────
function StatRow({ keys, stats, mod, showLabels, modelLabel }: {
  keys: readonly string[];
  stats: Record<string, string>;
  mod: { stat: string; delta: number } | null;
  showLabels: boolean;
  modelLabel?: string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}>
      {modelLabel && (
        <div style={{
          display: 'flex', alignItems: 'center',
          minWidth: 72, paddingRight: 6, marginRight: 4,
          borderRight: '1px solid #ccc',
          fontSize: '.65em', fontWeight: 600, color: 'var(--ac)',
          lineHeight: 1.2,
        }}>
          {modelLabel}
        </div>
      )}
      {keys.map((k, i) => {
        const raw = stats[k] ?? '-';
        const boosted = !!(mod && mod.stat === k);
        const display = boosted ? applyDelta(raw, mod!.delta) + '*' : raw;
        return (
          <div key={k} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            borderLeft: i > 0 ? '1px solid #ddd' : 'none',
            padding: '1px 2px',
          }}>
            {showLabels && (
              <span style={{ fontSize: '.58em', fontWeight: 700, color: '#888', letterSpacing: '.04em', lineHeight: 1.3 }}>
                {k}
              </span>
            )}
            <span style={{ fontSize: '.92em', fontWeight: 800, color: boosted ? 'var(--ac)' : '#111', lineHeight: 1.2 }}>
              {display}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Weapons table ─────────────────────────────────────────────────────────────
function WeaponSection({ title, weapons }: { title: string; weapons: Weapon[] }) {
  if (!weapons.length) return null;
  return (
    <>
      <tr>
        <td colSpan={5} style={{
          backgroundColor: 'var(--ac)', color: '#fff',
          fontWeight: 700, fontSize: '.72em', letterSpacing: '.07em',
          textTransform: 'uppercase', padding: '2px 6px',
        }}>
          {title}
        </td>
      </tr>
      {weapons.map((w, i) => <WeaponRow key={i} weapon={w} shade={i % 2 === 1} />)}
    </>
  );
}

function WeaponRow({ weapon: w, shade }: { weapon: Weapon; shade: boolean }) {
  if (!w.range && !w.type && !w.s) return null;
  const typeTag = w.type && w.type !== '-'
    ? ` <span style="font-size:.78em;font-weight:700;color:var(--ac);text-transform:uppercase"> [${w.type}]</span>`
    : '';
  const bg = shade ? '#f0ece4' : '#fff';
  return (
    <>
      <tr style={{ backgroundColor: bg }}>
        <td style={{ textAlign: 'left', padding: '2px 6px', fontSize: '.8em', color: '#111' }}>
          <span dangerouslySetInnerHTML={{ __html: w.name + typeTag }} />
        </td>
        {[w.range ?? '-', w.s ?? '-', w.ap ?? '-', w.d ?? '-'].map((v, i) => (
          <td key={i} style={{ textAlign: 'center', padding: '2px 4px', fontSize: '.8em', color: '#333' }}>{v}</td>
        ))}
      </tr>
      {w.abilities && w.abilities !== '-' && (
        <tr style={{ backgroundColor: bg }}>
          <td colSpan={5} style={{ padding: '0 6px 3px 18px', fontSize: '.74em', color: '#444', lineHeight: 1.45 }}
            dangerouslySetInnerHTML={{ __html: highlightRules(w.abilities) }} />
        </tr>
      )}
    </>
  );
}

// ── Model count helper ────────────────────────────────────────────────────────
function buildModelCountLabel(item: RosterEntry, u: Unit): string {
  const models = u.models.filter(m => m.max > 0);
  if (models.length === 0) return '';
  if (models.length === 1) return `${item.size} ${models[0].name}`;
  // First model is usually the variable one; rest are fixed (min === max)
  const fixed = models.slice(1);
  const fixedCount = fixed.reduce((s, m) => s + m.min, 0);
  const mainCount = item.size - fixedCount;
  const parts: string[] = [];
  if (mainCount > 0) parts.push(`${mainCount} ${models[0].name}`);
  for (const m of fixed) {
    if (m.min > 0) parts.push(`${m.min} ${m.name}`);
  }
  return parts.join(' + ');
}

// ── Unit card ─────────────────────────────────────────────────────────────────
function UnitPrintCard({ item, data }: { item: RosterEntry; data: FactionData }) {
  const u = resolveUnit(item, data);
  if (!u) return null;

  const storeState = useArmyStore.getState();
  const { language: lang } = useLanguage();
  const rp = resolveUnitProfile(item, u, storeState, data);
  const { pts, variant, effectiveMark, statModMark, equipMods, weaponTraitMap, injectedAbilities, optionStatMods, optionAbilities } = rp;
  const color = getMarkColor(effectiveMark);

  const statKeys = u.is_vehicle ? STAT_KEYS_VEH : STAT_KEYS_INF;
  const modTable = u.is_character ? MARK_CHAR_MODS : MARK_STAT_MODS;
  const mod = statModMark ? modTable[statModMark] : null;

  const factionBg = FACTION_BG[data.faction] ?? genericBg;
  // Reuse the resolver's own modelsToShow/modelCounts so print matches the builder: optional
  // secondary models (e.g. Chaos Ogryn) only appear once bought, and a promotion (e.g. Traitor
  // Sergeant) splits its row from the base model's count instead of replacing it 1-for-1.
  const modelsToShow = rp.modelsToShow;
  const modelCounts = rp.modelCounts;

  const armRanged: Weapon[] = [];
  const armMelee: Weapon[] = [];
  const armEquip: { name: string; desc: string }[] = [];

  // Helper to merge weapon traits into a weapon's abilities string
  function mergeTraits(w: Weapon, traitMap: Map<string, string[]> = weaponTraitMap): Weapon {
    const extra = traitMap.get(w.name) ?? [];
    if (extra.length === 0) return w;
    const base = (w.abilities && w.abilities !== '-') ? w.abilities : '';
    return { ...w, abilities: [base, ...extra].filter(Boolean).join(', ') };
  }

  for (const sel of item.armory) {
    if (sel.section === 'equipment') {
      const arm = findArmoryItem(data, sel.itemName);
      armEquip.push({ name: sel.itemName, desc: arm?.desc ?? '' });
      continue;
    }
    if (sel.section === 'daemon_weapons') {
      const arm = findArmoryItem(data, sel.itemName);
      // Weapon-targeting daemon weapons don't show as equipment items — already applied to weapons
      if (!isWeaponTrait(arm?.desc)) {
        armEquip.push({ name: sel.itemName, desc: arm?.desc ?? '' });
      }
      continue;
    }
    const arm = findArmoryItem(data, sel.itemName);
    if (!arm) continue;
    if (arm.profiles && arm.profiles.length > 0) {
      for (const p of arm.profiles) {
        const w: Weapon = { name: `${arm.name} — ${p.name}`, range: p.range, type: p.type, s: p.s, ap: p.ap, d: p.d, abilities: p.abilities };
        (p.range === 'Melee' || p.type === 'Melee') ? armMelee.push(mergeTraits(w)) : armRanged.push(mergeTraits(w));
      }
    } else if (arm.range) {
      const w: Weapon = { name: arm.name, range: arm.range ?? '', type: arm.type ?? '', s: arm.s ?? '', ap: arm.ap ?? '', d: arm.d ?? '', abilities: arm.abilities };
      (arm.range === 'Melee' || arm.type === 'Melee') ? armMelee.push(mergeTraits(w)) : armRanged.push(mergeTraits(w));
    } else {
      armEquip.push({ name: sel.itemName, desc: arm?.desc ?? '' });
    }
  }

  // Also apply weapon traits to built-in weapons, split into per-model-group tables
  // (e.g. Traitor Guardsman vs Chaos Ogryn) with an "[N]x" name prefix where the resolver
  // reports a count. Single-group units get one unlabeled group, unchanged from before.
  const weaponGroupsPrint = rp.weaponGroups.map(g => {
    const prefix = g.count != null ? `${g.count}x ` : '';
    const tm = g.traitMap ?? weaponTraitMap;
    const ranged = g.weapons
      .filter(w => w.range && w.range !== 'Melee' && w.range !== '-' && w.range !== '')
      .map(w => ({ ...mergeTraits(w, tm), name: prefix + w.name }));
    const melee = g.weapons
      .filter(w => w.range === 'Melee' || w.type === 'Melee')
      .map(w => ({ ...mergeTraits(w, tm), name: prefix + w.name }));
    return { label: g.label, ranged, melee };
  });

  const abilitiesList = [
    ...u.abilities.filter(ab => !/^\d+$/.test(ab.trim())),
    ...injectedAbilities.filter(ab =>
      !u.abilities.some(a => a.toLowerCase().includes(ab.toLowerCase()))
    ),
    ...equipMods.grantedAbilities.filter(ab =>
      !u.abilities.some(a => (a.includes(':') ? a.split(':')[0] : a).trim().toLowerCase() === ab.toLowerCase())
    ),
    ...optionAbilities.filter(ab =>
      !u.abilities.some(a => a.toLowerCase().includes(ab.toLowerCase()))
    ),
  ];
  const traitList = item.traits.map(t => t.name);
  const powerList = item.powers.map(p => `${p.powerName} (${p.disciplineName})`);
  const prayerList = item.prayers;
  const hasAbilities = abilitiesList.length > 0 || traitList.length > 0 || powerList.length > 0 || prayerList.length > 0;

  return (
    <div style={{
      marginBottom: 20, pageBreakInside: 'avoid', breakInside: 'avoid',
      border: `2px solid ${color}`, backgroundColor: '#fff',
      fontFamily: "'Trebuchet MS', sans-serif",
      ['--ac' as string]: color,
    }}>
      {/* ── Header ── */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        backgroundImage: `url(${factionBg})`, backgroundSize: 'cover', backgroundPosition: 'center 25%',
        minHeight: 60,
      }}>
        {/* Gradient scrim so text is always readable over any background image */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(100deg, ${color}f0 0%, ${color}bb 55%, ${color}70 100%)`,
        }} />
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 14px 8px',
        }}>
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.45em', textTransform: 'uppercase', letterSpacing: '.05em', lineHeight: 1.05 }}>
              {item.customName || u.name}
              {item.customName && (
                <span style={{ fontWeight: 400, fontSize: '.45em', marginLeft: 8, opacity: .65 }}>
                  {u.name}
                </span>
              )}
              {variant && (
                <span style={{ fontWeight: 400, fontSize: '.52em', marginLeft: 10, opacity: .85 }}>
                  → {variant.name}
                </span>
              )}
            </div>
            <div style={{ color: 'rgba(255,255,255,.72)', fontSize: '.68em', marginTop: 3, letterSpacing: '.03em', display: 'flex', alignItems: 'center', gap: 5 }}>
              {SLOT_ICONS[item.slot] && (
                <img src={SLOT_ICONS[item.slot]} alt="" style={{ width: 14, height: 14, opacity: .75, filter: 'invert(1)' }} />
              )}
              {item.slot} · {buildModelCountLabel(item, u)}{effectiveMark ? ` · Mark of ${effectiveMark}` : ''}
              {rp.equippedWith ? ` — ${rp.equippedWith}` : ''}
              {(() => {
                if (!item.joinedToUnit) return null;
                const target = useArmyStore.getState().army.find(e => e.id === item.joinedToUnit);
                if (!target) return null;
                const tName = target.customName || target.unitName;
                return <span style={{ marginLeft: 6, opacity: .8 }}>↳ joins {tName}</span>;
              })()}
            </div>
          </div>
          <div style={{
            color: '#fff', fontWeight: 800, fontSize: '1.25em',
            backgroundColor: 'rgba(0,0,0,.3)', padding: '4px 12px',
            border: '1px solid rgba(255,255,255,.25)',
            whiteSpace: 'nowrap', letterSpacing: '.02em',
          }}>
            {pts} pts
          </div>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div style={{
        backgroundColor: '#f5f1ea',
        borderBottom: equipMods.invulnSave !== null ? 'none' : `2px solid ${color}`,
        padding: '5px 10px 4px',
      }}>
        {modelsToShow.map((m, mi) => {
          const modStats = applyEquipDeltas(m.stats as Record<string, string>, equipMods, u.is_vehicle);
          for (const sm of optionStatMods) {
            if (modStats[sm.stat] !== undefined) modStats[sm.stat] = applyDelta(modStats[sm.stat], sm.delta);
          }
          return (
            <StatRow
              key={mi}
              keys={statKeys}
              stats={modStats}
              mod={mod}
              showLabels={mi === 0}
              modelLabel={modelsToShow.length > 1 ? (modelCounts[mi] != null ? `${modelCounts[mi]}x ${m.name}` : m.name) : undefined}
            />
          );
        })}
      </div>
      {equipMods.invulnSave !== null && (
        <div style={{
          backgroundColor: '#f5f1ea', borderBottom: `2px solid ${color}`,
          padding: '2px 10px 3px', fontSize: '.72em', fontWeight: 700, color: color,
        }}>
          Invulnerable Save: {equipMods.invulnSave}+
        </div>
      )}

      {/* ── Body ── */}
      <div style={{ display: 'flex', alignItems: 'stretch' }}>

        {/* Weapons */}
        <div style={{
          flex: hasAbilities ? '1.35' : '1',
          display: 'flex', flexDirection: 'column',
          borderRight: hasAbilities ? `2px solid ${color}` : 'none',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${color}` }}>
                {[tFn(lang,'weapon'), tFn(lang,'range'), tFn(lang,'strength'), tFn(lang,'ap'), tFn(lang,'damage')].map((h, i) => (
                  <th key={h} style={{
                    textAlign: i === 0 ? 'left' : 'center',
                    padding: '2px 6px', fontSize: '.72em', fontWeight: 700,
                    color: '#555', letterSpacing: '.05em', textTransform: 'uppercase',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weaponGroupsPrint.map((g, gi) => (
                <Fragment key={gi}>
                  {g.label && weaponGroupsPrint.length > 1 && (
                    <tr>
                      <td colSpan={5} style={{
                        fontWeight: 700, fontSize: '.7em', textTransform: 'uppercase',
                        letterSpacing: '.05em', color: '#555', padding: '3px 6px 1px',
                      }}>
                        {g.label}
                      </td>
                    </tr>
                  )}
                  <WeaponSection title={tFn(lang, 'ranged')} weapons={gi === 0 ? [...g.ranged, ...armRanged] : g.ranged} />
                  <WeaponSection title={tFn(lang, 'melee')}  weapons={gi === 0 ? [...g.melee,  ...armMelee]  : g.melee}  />
                </Fragment>
              ))}
            </tbody>
          </table>

          {armEquip.length > 0 && (
            <div style={{ padding: '5px 8px', borderTop: `1px dotted ${color}` }}>
              <div style={{ fontWeight: 700, fontSize: '.68em', textTransform: 'uppercase', color: color, letterSpacing: '.06em', marginBottom: 3 }}>
                {tFn(lang, 'equipment')}
              </div>
              {armEquip.map((eq, i) => (
                <div key={i} style={{ fontSize: '.76em', lineHeight: 1.45, marginBottom: 2, color: '#222' }}>
                  <span style={{ fontWeight: 700 }}>{eq.name}</span>
                  {eq.desc && <span style={{ color: '#555', marginLeft: 4 }}>— {eq.desc}</span>}
                </div>
              ))}
            </div>
          )}

          {/* Keywords */}
          {u.keywords.length > 0 && (
            <div style={{
              marginTop: 'auto', padding: '4px 8px',
              borderTop: `1px solid ${color}`,
              backgroundColor: '#f5f1ea', fontSize: '.74em', color: '#222',
            }}>
              <span style={{ fontWeight: 700, color: color, textTransform: 'uppercase', letterSpacing: '.06em' }}>
                Keywords:{' '}
              </span>
              {u.keywords.join(', ')}
            </div>
          )}
        </div>

        {/* Abilities */}
        {hasAbilities && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{
              backgroundColor: color, color: '#fff',
              padding: '2px 8px', fontSize: '.72em', fontWeight: 700,
              letterSpacing: '.07em', textTransform: 'uppercase',
            }}>
              {tFn(lang, 'abilities')}
            </div>

            <div style={{ flex: 1, padding: '5px 8px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {abilitiesList.map((ab, i) => {
                const ci = ab.indexOf(':');
                const split = ci > 0 && ci < 40;
                return (
                  <div key={i} style={{ fontSize: '.77em', lineHeight: 1.45, color: '#222' }}>
                    {split
                      ? <>
                          <span style={{ fontWeight: 700 }}>{ab.slice(0, ci + 1)}</span>{' '}
                          <span dangerouslySetInnerHTML={{ __html: highlightRules(ab.slice(ci + 1).trim()) }} />
                        </>
                      : <span style={{ fontWeight: 700 }}>{ab}</span>
                    }
                  </div>
                );
              })}

              {traitList.length > 0 && (
                <div style={{ borderTop: `1px dotted ${color}`, paddingTop: 5, marginTop: 2 }}>
                  <div style={{ fontSize: '.7em', fontWeight: 700, textTransform: 'uppercase', color: color, letterSpacing: '.06em', marginBottom: 3 }}>
                    {tFn(lang, 'veteranAbilities')}
                  </div>
                  {traitList.map((t, i) => (
                    <div key={i} style={{ fontSize: '.77em', fontWeight: 600, color: '#222' }}>{t}</div>
                  ))}
                </div>
              )}

              {(powerList.length > 0 || prayerList.length > 0) && (
                <div style={{ borderTop: `1px dotted ${color}`, paddingTop: 5, marginTop: 2 }}>
                  <div style={{ fontSize: '.7em', fontWeight: 700, textTransform: 'uppercase', color: color, letterSpacing: '.06em', marginBottom: 3 }}>
                    {powerList.length > 0 ? 'Psychic Powers' : 'Prayers'}
                  </div>
                  {[...powerList, ...prayerList].map((p, i) => (
                    <div key={i} style={{ fontSize: '.77em', color: '#222' }}>{p}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Radar / spider chart (pure SVG) ──────────────────────────────────────────
function RadarChart({ labels, values, color, title, size = 190 }: {
  labels: string[]; values: number[]; color: string; title: string; size?: number;
}) {
  const n = labels.length;
  const cx = size / 2;
  const cy = size / 2;
  const rData  = size * 0.36;
  const rLabel = size * 0.48;
  const angle  = (i: number) => (Math.PI * 2 * i / n) - Math.PI / 2;
  const pt     = (i: number, frac: number) => [
    cx + frac * rData * Math.cos(angle(i)),
    cy + frac * rData * Math.sin(angle(i)),
  ] as [number, number];

  const fracs   = values.map(v => Math.min(Math.max(v, 0) / 10, 1));
  const dataPts = fracs.map((f, i) => pt(i, f));
  const poly    = dataPts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

  const gridPath = (level: number) =>
    Array.from({ length: n }, (_, i) => pt(i, level))
      .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`)
      .join(' ') + 'Z';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div style={{ fontWeight: 700, fontSize: '.72em', textTransform: 'uppercase', letterSpacing: '.06em', color: '#444' }}>
        {title}
      </div>
      <svg width={size} height={size} style={{ overflow: 'visible' }}>
        {/* Grid rings */}
        {[0.25, 0.5, 0.75, 1.0].map(lv => (
          <path key={lv} d={gridPath(lv)} fill="none"
            stroke={lv === 1 ? '#c8c0b4' : '#e0dbd0'}
            strokeWidth={lv === 1 ? 1.2 : 0.6} />
        ))}
        {/* Axis spokes */}
        {Array.from({ length: n }, (_, i) => {
          const [x, y] = pt(i, 1);
          return <line key={i} x1={cx.toFixed(1)} y1={cy.toFixed(1)} x2={x.toFixed(1)} y2={y.toFixed(1)} stroke="#d8d0c8" strokeWidth={0.6} />;
        })}
        {/* Data polygon */}
        <polygon points={poly} fill={`${color}28`} stroke={color} strokeWidth={2} strokeLinejoin="round" />
        {/* Data points */}
        {dataPts.map(([x, y], i) => (
          <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r={3} fill={color} />
        ))}
        {/* Labels */}
        {labels.map((label, i) => {
          const a = angle(i);
          const lx = cx + rLabel * Math.cos(a);
          const ly = cy + rLabel * Math.sin(a);
          return (
            <text key={i} x={lx.toFixed(1)} y={ly.toFixed(1)}
              textAnchor="middle" dominantBaseline="middle"
              fontSize="8.5" fontWeight="700" fontFamily="'Trebuchet MS', sans-serif" fill="#555">
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

// ── Stat helpers ───────────────────────────────────────────────────────────────
const parseMove    = (s: string) => { const m = (s ?? '').match(/(\d+)/); return m ? parseInt(m[1]) : 6; };
const parseNum     = (s: string) => { const m = (s ?? '').match(/(\d+)/); return m ? parseInt(m[1]) : 0; };
const parseSaveInv = (s: string) => { const m = (s ?? '').match(/(\d+)\+/); return m ? 7 - parseInt(m[1]) : 2; };

function unitStatValues(u: Unit): number[] {
  const st = u.models[0]?.stats ?? {};
  const move    = parseMove(st.M  ?? '6"');
  const attacks = parseNum(st.A   ?? '1');
  const tough   = u.is_vehicle
    ? Math.round((parseNum(st.FRONT ?? '10') + parseNum(st.SIDE ?? '10') + parseNum(st.REAR ?? '10')) / 3)
    : parseNum(st.T ?? '4');
  const wounds  = u.is_vehicle ? parseNum(st.HP ?? '3') * 2 : parseNum(st.W ?? '1');
  const save    = u.is_vehicle ? Math.min(parseSaveInv(st.FRONT ?? '3+'), 5) : parseSaveInv(st.SV ?? '4+');
  const shoot   = parseSaveInv(st.BS ?? '4+');
  return [move, attacks, tough, wounds, save, shoot];
}

// Normalize raw stat averages to 0-10
const POWER_MAX = [14, 6, 10, 16, 5, 5]; // Move, Attacks, Tough, Wounds, Save(inv), Shoot(inv)

// ── Equipment mod parsing ─────────────────────────────────────────────────────
// (parseEquipMods imported from ../engine/equipMods)

function applyEquipDeltas(stats: Record<string, string>, mods: EquipMods, isVehicle: boolean): Record<string, string> {
  const result = { ...stats };
  for (const [key, delta] of Object.entries(mods.statDeltas)) {
    if (result[key] !== undefined) result[key] = applyDelta(result[key], delta);
  }
  if (!isVehicle && mods.armorSave !== null) {
    const existing = result.SV?.match(/(\d+)\+/);
    if (!existing || mods.armorSave < parseInt(existing[1])) result.SV = `${mods.armorSave}+`;
  }
  return result;
}

// ── Summary page ──────────────────────────────────────────────────────────────
const COMP_SLOTS  = ['HQ', 'Troops', 'Elites', 'Fast Attack', 'Heavy Support', 'Transport', 'Flyers', 'Lords of War'] as const;
const COMP_LABELS = ['HQ', 'Troops', 'Elites', 'Fast Atk', 'Heavy', 'Transport', 'Flyers', 'LoW'];
const COMP_MAX    = [2, 6, 3, 3, 3, 3, 1, 3]; // pitched battle caps used as reference (LoW: ref only)

function SummaryPage({ army, data, color, factionName }: {
  army: RosterEntry[]; data: FactionData; color: string; factionName: string;
}) {
  const storeState = useArmyStore.getState();
  const units = army.flatMap(item => {
    const u = resolveUnit(item, data);
    if (!u) return [];
    const pts = resolveUnitProfile(item, u, storeState, data).pts;
    const wPerModel = u.is_vehicle
      ? parseInt(u.models[0]?.stats.HP ?? '1')
      : parseInt(u.models[0]?.stats.W  ?? '1');
    const totalW = item.size * (isNaN(wPerModel) ? 1 : wPerModel);
    return [{ item, u, pts, totalW }];
  });

  // Sort unit list by slot order
  const slotIdx = (slot: string) => { const i = SLOT_ORDER.indexOf(slot as typeof SLOT_ORDER[number]); return i === -1 ? 99 : i; };
  const sortedBySlot = [...units].sort((a, b) => slotIdx(a.item.slot) - slotIdx(b.item.slot));

  const grandPts = units.reduce((s, x) => s + x.pts, 0);
  const grandW   = units.reduce((s, x) => s + x.totalW, 0);

  // Chart 1 — Composition by slot
  const compValues = COMP_SLOTS.map((slot, i) => {
    const effectiveSlot = slot === 'Transport' ? 'Dedicated Transport' : slot;
    const count = army.filter(item => item.slot === effectiveSlot).length;
    return Math.min((count / COMP_MAX[i]) * 10, 10);
  });

  // Chart 2 — Army power (average stats normalized 0-10)
  const statSums = [0, 0, 0, 0, 0, 0];
  let statCount = 0;
  for (const { u } of units) {
    const vals = unitStatValues(u);
    vals.forEach((v, i) => { statSums[i] += v; });
    statCount++;
  }
  const powerValues = statCount === 0
    ? [0, 0, 0, 0, 0, 0]
    : statSums.map((s, i) => Math.min((s / statCount / POWER_MAX[i]) * 10, 10));

  return (
    <div style={{
      marginBottom: 24, pageBreakInside: 'avoid', breakInside: 'avoid',
      border: `2px solid ${color}`, backgroundColor: '#fff',
      ['--ac' as string]: color,
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: color, color: '#fff',
        padding: '8px 14px', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.05em',
      }}>
        <span style={{ fontSize: '1.15em' }}>{factionName}</span>
        <span style={{ fontSize: '.9em', opacity: .9 }}>{grandPts} pts — {units.length} units</span>
      </div>

      <div style={{ display: 'flex' }}>
        {/* Unit list */}
        <div style={{ flex: 1.4, borderRight: `2px solid ${color}` }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 2.6rem 3.2rem 3.2rem',
            backgroundColor: '#f5f1ea', fontWeight: 700, fontSize: '.74em',
            padding: '3px 10px', color: '#444', letterSpacing: '.05em', textTransform: 'uppercase',
            borderBottom: `1px solid ${color}`,
          }}>
            <span>Unit</span>
            <span style={{ textAlign: 'right' }}>W</span>
            <span style={{ textAlign: 'right' }}>Pts/W</span>
            <span style={{ textAlign: 'right' }}>Pts</span>
          </div>

          {sortedBySlot.map((x, i) => (
            <div key={x.item.id} style={{
              display: 'grid', gridTemplateColumns: '1fr 2.6rem 3.2rem 3.2rem',
              padding: '2px 10px', fontSize: '.8em',
              backgroundColor: i % 2 === 1 ? '#f5f1ea' : '#fff',
              borderBottom: '1px dotted #ccc', color: '#111',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: '.72em', color: color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', width: '4.2em', flexShrink: 0 }}>
                  {x.item.slot.replace('Dedicated Transport', 'Transport').replace('Fortifications', 'Forts')}
                </span>
                {x.item.customName || x.u.name}
              </span>
              <span style={{ textAlign: 'right', color: '#555' }}>{x.totalW}</span>
              <span style={{ textAlign: 'right', color: '#555' }}>{x.totalW > 0 ? (x.pts / x.totalW).toFixed(1) : '—'}</span>
              <span style={{ textAlign: 'right', fontWeight: 700 }}>{x.pts}</span>
            </div>
          ))}

          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 2.6rem 3.2rem 3.2rem',
            padding: '3px 10px', fontSize: '.8em',
            backgroundColor: color, color: '#fff', fontWeight: 700,
          }}>
            <span>Total</span>
            <span style={{ textAlign: 'right' }}>{grandW}</span>
            <span style={{ textAlign: 'right' }}>{grandW > 0 ? (grandPts / grandW).toFixed(1) : '—'}</span>
            <span style={{ textAlign: 'right' }}>{grandPts}</span>
          </div>
        </div>

        {/* Radar charts */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly', padding: '8px 4px', borderRight: `2px solid ${color}` }}>
          <RadarChart title="Unit Composition" labels={COMP_LABELS} values={compValues} color={color} size={185} />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly', padding: '8px 4px' }}>
          <RadarChart title="Army Power" labels={['Move', 'Attacks', 'Tough', 'Wounds', 'Save', 'Shoot']} values={powerValues} color={color} size={185} />
        </div>
      </div>
    </div>
  );
}

// ── Cover / muster sheet ──────────────────────────────────────────────────────
function CoverPage({ army, data, color, factionName, armyName, engagement, archetype, legacy, legacy2, totalPts, pointLimit }: {
  army: RosterEntry[]; data: FactionData; color: string; factionName: string;
  armyName: string; engagement: string; archetype: string | null;
  legacy: string | null; legacy2: string | null; totalPts: number; pointLimit: number;
}) {
  const factionBg = FACTION_BG[data.faction] ?? genericBg;
  const compCounts = COMP_SLOTS.map(slot => {
    const eff = slot === 'Transport' ? 'Dedicated Transport' : slot;
    return army.filter(i => i.slot === eff).length;
  });
  const configRows: [string, string][] = [
    ['Engagement', ENGAGEMENTS[engagement as keyof typeof ENGAGEMENTS]?.name ?? engagement],
    ['Points', `${totalPts} / ${pointLimit}`],
    ...(archetype ? [['Archetype', archetype] as [string, string]] : []),
    ...(legacy ? [['Legacy', legacy + (legacy2 ? ` / ${legacy2}` : '')] as [string, string]] : []),
  ];
  const fillIn = ['Player', 'Warlord', 'Reinforcement Points'];
  return (
    <div style={{
      marginBottom: 24, pageBreakInside: 'avoid', breakInside: 'avoid', pageBreakAfter: 'always',
      border: `2px solid ${color}`, backgroundColor: '#fff', ['--ac' as string]: color,
    }}>
      <div style={{
        position: 'relative', overflow: 'hidden',
        backgroundImage: `url(${factionBg})`, backgroundSize: 'cover', backgroundPosition: 'center 30%', minHeight: 130,
      }}>
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${color}f2 0%, ${color}cc 58%, ${color}80 100%)` }} />
        <div style={{ position: 'relative', zIndex: 1, padding: '24px 22px 20px' }}>
          <div style={{ color: 'rgba(255,255,255,.8)', fontSize: '.78em', textTransform: 'uppercase', letterSpacing: '.16em', fontWeight: 700 }}>{factionName}</div>
          <div style={{ color: '#fff', fontSize: '2.3em', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.03em', lineHeight: 1.04, marginTop: 5 }}>
            {armyName || 'Army Roster'}
          </div>
          <div style={{ color: '#fff', marginTop: 12, fontSize: '1.15em', fontWeight: 700, letterSpacing: '.02em' }}>
            {totalPts} / {pointLimit} pts · {army.length} units
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        <div style={{ flex: 1.2, borderRight: `2px solid ${color}`, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 9 }}>
          {configRows.map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dotted #ccc', paddingBottom: 3 }}>
              <span style={{ fontWeight: 700, fontSize: '.72em', textTransform: 'uppercase', color: '#666', letterSpacing: '.05em' }}>{label}</span>
              <span style={{ fontWeight: 700, fontSize: '.82em', color: '#111' }}>{value}</span>
            </div>
          ))}
          {fillIn.map(label => (
            <div key={label} style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
              <span style={{ fontWeight: 700, fontSize: '.72em', textTransform: 'uppercase', color: '#666', letterSpacing: '.05em', whiteSpace: 'nowrap' }}>{label}:</span>
              <span style={{ flex: 1, borderBottom: '1px solid #aaa', height: '1.1em' }} />
            </div>
          ))}
        </div>

        <div style={{ flex: 1, padding: '12px 16px', backgroundColor: '#f5f1ea' }}>
          <div style={{ fontWeight: 700, fontSize: '.7em', textTransform: 'uppercase', color: color, letterSpacing: '.08em', marginBottom: 7 }}>
            Force Composition
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', rowGap: 3, columnGap: 8 }}>
            {COMP_LABELS.map((label, i) => compCounts[i] > 0 ? (
              <Fragment key={label}>
                <span style={{ fontSize: '.78em', color: '#333' }}>{label}</span>
                <span style={{ fontSize: '.78em', fontWeight: 700, color: '#111', textAlign: 'right' }}>{compCounts[i]}</span>
              </Fragment>
            ) : null)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Slot divider (cards stream) ───────────────────────────────────────────────
function SlotDivider({ slot, color }: { slot: string; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '4px 0 10px', breakInside: 'avoid' }}>
      <span style={{ fontWeight: 800, fontSize: '.82em', textTransform: 'uppercase', letterSpacing: '.12em', color }}>{slot}</span>
      <div style={{ flex: 1, height: 2, backgroundColor: color, opacity: .3 }} />
    </div>
  );
}

// ── Compact list view ─────────────────────────────────────────────────────────
function CompactList({ army, data, color }: { army: RosterEntry[]; data: FactionData; color: string }) {
  const storeState = useArmyStore.getState();
  const slotIdx = (slot: string) => { const i = SLOT_ORDER.indexOf(slot as typeof SLOT_ORDER[number]); return i === -1 ? 99 : i; };
  const sorted = [...army].sort((a, b) => slotIdx(a.slot) - slotIdx(b.slot));
  let grand = 0;
  let lastSlot = '';
  const rows: ReactElement[] = [];
  for (const item of sorted) {
    const u = resolveUnit(item, data);
    if (!u) continue;
    const pts = resolveUnitProfile(item, u, storeState, data).pts;
    grand += pts;
    const wargear = [
      ...item.armory.map(a => a.itemName),
      ...item.traits.map(tr => tr.name),
      ...item.powers.map(p => p.powerName),
      ...item.prayers,
    ];
    if (item.slot !== lastSlot) {
      lastSlot = item.slot;
      rows.push(
        <div key={`s-${item.slot}`} style={{
          backgroundColor: color, color: '#fff', fontWeight: 700, fontSize: '.72em',
          textTransform: 'uppercase', letterSpacing: '.07em', padding: '3px 10px', marginTop: rows.length ? 6 : 0,
        }}>
          {item.slot}
        </div>
      );
    }
    rows.push(
      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '4px 10px', borderBottom: '1px dotted #ccc', breakInside: 'avoid' }}>
        <div style={{ flex: 1 }}>
          <span style={{ fontWeight: 700, fontSize: '.85em', color: '#111' }}>{item.customName || u.name}</span>
          <span style={{ fontSize: '.74em', color: '#666', marginLeft: 6 }}>{buildModelCountLabel(item, u)}</span>
          {wargear.length > 0 && (
            <div style={{ fontSize: '.72em', color: '#555', lineHeight: 1.4, marginTop: 1 }}>{wargear.join(', ')}</div>
          )}
        </div>
        <span style={{ fontWeight: 800, fontSize: '.85em', color: color, whiteSpace: 'nowrap' }}>{pts}</span>
      </div>
    );
  }
  return (
    <div style={{ marginBottom: 24, border: `2px solid ${color}`, backgroundColor: '#fff', ['--ac' as string]: color }}>
      {rows}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 10px', backgroundColor: color, color: '#fff', fontWeight: 800, fontSize: '.85em', textTransform: 'uppercase', letterSpacing: '.05em' }}>
        <span>Total</span><span>{grand} pts</span>
      </div>
    </div>
  );
}

// ── Print View root ───────────────────────────────────────────────────────────
export function PrintView({ onClose }: { onClose: () => void }) {
  const { data, army, archetype, legacy, legacy2, pointLimit, engagement, hqMark, armyName } = useArmyStore();
  const { language: rootLang } = useLanguage();
  const [mode, setMode] = useState<'cards' | 'list'>('cards');
  if (!data) return null;

  const rule = getArchetypeRule(archetype);
  const forcedMark = rule?.forcedMark ? rule.forcedMark as Mark : null;
  const dominantMark = forcedMark ?? (hqMark !== 'Undivided' ? hqMark : null);
  const primaryColor = getMarkColor(dominantMark);

  const storeState = useArmyStore.getState();
  const totalPts = army.reduce((s, item) => {
    const u = resolveUnit(item, data);
    return s + (u ? resolveUnitProfile(item, u, storeState, data).pts : 0);
  }, 0);

  // Collect all unique rules for the Special Rules reference section.
  // Uses the generic (non-parameterized) form so "Terrifying(-1)" and "Terrifying(-2)"
  // collapse into a single "Terrifying(X)" entry.
  // Map: generic display name → description (or null)
  const allSpecialRules = new Map<string, string | null>();
  const addRule = (name: string, desc: string | null) => {
    if (!allSpecialRules.has(name)) allSpecialRules.set(name, desc);
  };

  // Parse an ability string into generic (non-parameterized) parts for the reference section.
  const parseGeneric = (raw: string) => {
    const trimmed = raw.trim();
    const colonIdx = trimmed.indexOf(': ');
    if (colonIdx > 0 && colonIdx < 70 && trimmed.length - colonIdx > 10) {
      // "Name: description" custom rule — keep as-is
      addRule(trimmed.slice(0, colonIdx).trim(), trimmed.slice(colonIdx + 2).trim());
      return;
    }
    for (const token of trimmed.split(',')) {
      const t = token.trim();
      if (!t) continue;
      const found = lookupRuleGeneric(t);
      if (found) addRule(found.displayName, found.description);
      else addRule(t, null);
    }
  };

  for (const item of army) {
    const u = resolveUnit(item, data);
    if (!u) continue;

    // Unit abilities
    for (const ab of u.abilities) {
      if (/^\d+$/.test(ab.trim())) continue;
      parseGeneric(ab);
    }

    // Weapons this unit actually shows (mirrors UnitPrintCard logic)
    const optWpnNames = new Set<string>();
    for (const g of u.option_groups)
      for (const c of g.choices)
        if (u.weapons.some(w => w.name === c.name)) optWpnNames.add(c.name);
    const selWpnNames = new Set<string>();
    for (const [gi, ch] of Object.entries(item.optionQty ?? {})) {
      const g = u.option_groups[Number(gi)];
      if (!g) continue;
      for (const [ci, qty] of Object.entries(ch)) {
        if (ci === '__inline' || !qty) continue;
        const choice = g.choices[parseInt(ci)];
        if (choice && optWpnNames.has(choice.name)) selWpnNames.add(choice.name);
      }
    }
    const shownWeapons = resolveUnitProfile(item, u, storeState, data).weapons
      .filter(w => !optWpnNames.has(w.name) || selWpnNames.has(w.name));
    for (const w of shownWeapons) {
      if (w.abilities && w.abilities !== '-') parseGeneric(w.abilities);
      if (w.type) {
        const wt = lookupWeaponType(w.type);
        if (wt) addRule(wt.displayName, wt.description);
      }
    }

    // Armory items: weapon profiles → collect ability rules; equipment → collect description
    for (const sel of item.armory) {
      const arm = findArmoryItem(data, sel.itemName);
      if (!arm) continue;
      if (sel.section === 'daemon_weapons') {
        // Weapon-targeting traits: collect the granted abilities (they appear on the weapon)
        if (isWeaponTrait(arm.desc)) {
          for (const gain of extractWeaponGains(arm.desc)) parseGeneric(gain);
        } else {
          // Model-ability daemon weapon traits: collect as equipment rule
          if (arm.desc) addRule(sel.itemName, arm.desc);
        }
        continue;
      }
      if (sel.section === 'equipment') {
        if (arm.desc) addRule(sel.itemName, arm.desc);
        continue;
      }
      if (arm.profiles && arm.profiles.length > 0) {
        for (const p of arm.profiles) {
          if (p.abilities && p.abilities !== '-') parseGeneric(p.abilities);
        }
      } else if (arm.range) {
        if (arm.abilities && arm.abilities !== '-') parseGeneric(arm.abilities);
      } else {
        if (arm.desc) addRule(sel.itemName, arm.desc);
      }
    }
  }

  return (
    <div id="pv-root" className="fixed inset-0 z-50 overflow-y-auto" style={{ background: '#1a1a1e' }}>
      {/* Toolbar */}
      <div className="print:hidden sticky top-0 z-10 bg-zinc-900 border-b border-zinc-700 px-4 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-amber-400 font-bold text-sm uppercase tracking-widest">{data.faction}</span>
          <span className="text-zinc-400 text-sm">{totalPts} / {pointLimit} pts</span>
          {archetype && <span className="text-zinc-500 text-xs">{archetype}</span>}
          {legacy && <span className="text-zinc-500 text-xs">{legacy}{legacy2 ? ` · ${legacy2}` : ''}</span>}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 mr-1">
            {(['cards', 'list'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`px-3 py-1.5 text-xs uppercase tracking-wide border transition-colors ${mode === m ? 'bg-amber-800 border-amber-600 text-white' : 'bg-zinc-700 border-zinc-600 text-zinc-300 hover:bg-zinc-600'}`}>
                {m === 'cards' ? 'Cards' : 'List'}
              </button>
            ))}
          </div>
          <button onClick={() => {
              const el = document.getElementById('pv-printable');
              if (!el) return;
              const win = window.open('', '_blank');
              if (!win) return;
              win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Army Roster</title><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Trebuchet MS',sans-serif;background:#fff;padding:16px}@media print{body{padding:0}}</style></head><body>${el.innerHTML}</body></html>`);
              win.document.close();
              win.focus();
              setTimeout(() => { win.print(); }, 400);
            }}
            className="px-4 py-1.5 bg-amber-800 hover:bg-amber-700 border border-amber-600 text-white text-sm uppercase tracking-wide transition-colors">
            Print
          </button>
          <button onClick={onClose}
            className="px-4 py-1.5 bg-zinc-700 hover:bg-zinc-600 border border-zinc-600 text-zinc-200 text-sm uppercase tracking-wide transition-colors">
            ← Back
          </button>
        </div>
      </div>

      {/* Printable area */}
      <div id="pv-printable" className="max-w-3xl mx-auto px-4 py-6"
        style={{ background: '#fff', minHeight: '100vh' }}>

        {army.length > 0 && (
          <CoverPage
            army={army} data={data} color={primaryColor} factionName={data.faction}
            armyName={armyName} engagement={engagement} archetype={archetype}
            legacy={legacy} legacy2={legacy2} totalPts={totalPts} pointLimit={pointLimit}
          />
        )}

        {army.length > 0 && (
          <SummaryPage army={army} data={data} color={primaryColor} factionName={data.faction} />
        )}

        {mode === 'list' && army.length > 0 && (
          <CompactList army={army} data={data} color={primaryColor} />
        )}

        {mode === 'cards' && (() => {
          const sorted = [...army].sort((a, b) => {
            const ai = SLOT_ORDER.indexOf(a.slot as typeof SLOT_ORDER[number]);
            const bi = SLOT_ORDER.indexOf(b.slot as typeof SLOT_ORDER[number]);
            return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
          });
          let lastSlot = '';
          return sorted.map(item => {
            const showDivider = item.slot !== lastSlot;
            lastSlot = item.slot;
            return (
              <Fragment key={item.id}>
                {showDivider && <SlotDivider slot={item.slot} color={primaryColor} />}
                <UnitPrintCard item={item} data={data} />
              </Fragment>
            );
          });
        })()}

        {(archetype || legacy || engagement) && (
          <div style={{
            marginBottom: 24, pageBreakInside: 'avoid', breakInside: 'avoid',
            border: `2px solid ${primaryColor}`, backgroundColor: '#fff',
            ['--ac' as string]: primaryColor,
          }}>
            <div style={{
              backgroundColor: primaryColor, color: '#fff',
              padding: '6px 14px', fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '.06em', fontSize: '.85em',
            }}>
              {tFn(rootLang, 'armyConfiguration')}
            </div>
            <div style={{
              backgroundColor: '#f5f1ea', padding: '10px 14px',
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
            }}>
              {[
                engagement && ['Engagement', ENGAGEMENTS[engagement]?.name ?? engagement],
                archetype  && ['Archetype', archetype],
                legacy     && ['Legacy', legacy + (legacy2 ? ` / ${legacy2}` : '')],
                ['Points', `${totalPts} / ${pointLimit} pts · ${army.length} units`],
              ].filter(Boolean).map(([label, value]) => (
                <div key={label as string}>
                  <div style={{ fontWeight: 700, fontSize: '.68em', textTransform: 'uppercase', color: '#666', letterSpacing: '.05em', marginBottom: 2 }}>
                    {label}
                  </div>
                  <div style={{ fontWeight: 600, color: '#111', fontSize: '.85em' }}>{value}</div>
                </div>
              ))}
            </div>
            {rule?.notes && rule.notes.length > 0 && (
              <div style={{ padding: '8px 14px', borderTop: `1px solid ${primaryColor}` }}>
                <div style={{ fontWeight: 700, fontSize: '.68em', textTransform: 'uppercase', color: '#666', letterSpacing: '.05em', marginBottom: 5 }}>
                  Archetype Rules
                </div>
                {rule.notes.map((note, ni) => (
                  <div key={ni} style={{ fontSize: '.82em', color: '#111', lineHeight: 1.45, marginBottom: 3 }}>{note}</div>
                ))}
              </div>
            )}
          </div>
        )}

        {allSpecialRules.size > 0 && (
          <div style={{
            marginBottom: 24, pageBreakInside: 'avoid', breakInside: 'avoid',
            border: `2px solid ${primaryColor}`, backgroundColor: '#fff',
            ['--ac' as string]: primaryColor,
          }}>
            <div style={{
              backgroundColor: primaryColor, color: '#fff',
              padding: '6px 14px', fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '.06em', fontSize: '.85em',
            }}>
              {tFn(rootLang, 'specialRules')}
            </div>
            <div style={{
              padding: '8px 14px',
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 20px',
            }}>
              {[...allSpecialRules.entries()]
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([name, desc]) => (
                  <div key={name} style={{ breakInside: 'avoid', fontSize: '.77em', lineHeight: 1.45, color: '#222', paddingBottom: 4 }}>
                    {desc
                      ? <><span style={{ fontWeight: 700 }}>{name}:</span>{' '}<span style={{ color: '#444' }}>{desc}</span></>
                      : <span style={{ fontWeight: 700 }}>{name}</span>
                    }
                  </div>
                ))
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
