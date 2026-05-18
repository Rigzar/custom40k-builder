import type { RosterEntry, Mark } from '../types/army';
import type { Unit, Weapon, ArmoryItem, FactionData } from '../types/data';
import { useArmyStore } from '../store/army';
import { computeUnitPoints, getActiveVariant, resolveUnit } from '../engine/points';
import { getArchetypeRule } from '../engine/archetypes';

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

// ── Unit card ─────────────────────────────────────────────────────────────────
function UnitPrintCard({ item, data }: { item: RosterEntry; data: FactionData }) {
  const rule = getArchetypeRule(useArmyStore.getState().archetype);
  const u = resolveUnit(item, data);
  if (!u) return null;

  const pts = computeUnitPoints(item, u);
  const variant = getActiveVariant(item, u);
  const effectiveMark = (u.locked_mark as Mark | null) ?? (rule?.forcedMark as Mark | null) ?? item.mark;
  const color = getMarkColor(effectiveMark);

  const statKeys = u.is_vehicle ? STAT_KEYS_VEH : STAT_KEYS_INF;
  const statModMark = u.locked_mark ? null : item.mark ?? (rule?.forcedMark ? rule.forcedMark as Mark : null);
  const modTable = u.is_character ? MARK_CHAR_MODS : MARK_STAT_MODS;
  const mod = statModMark ? modTable[statModMark] : null;

  const factionBg = FACTION_BG[data.faction] ?? genericBg;
  const modelsToShow = variant
    ? [variant, ...u.models.filter(m => m.max > 0).slice(1)]
    : u.models.filter(m => m.max > 0);

  const defaultRanged = u.weapons.filter(w => w.range && w.range !== 'Melee' && w.range !== '-' && w.range !== '');
  const defaultMelee  = u.weapons.filter(w => w.range === 'Melee' || w.type === 'Melee');
  const armRanged: Weapon[] = [];
  const armMelee: Weapon[] = [];
  const armEquip: { name: string; desc: string }[] = [];

  for (const sel of item.armory) {
    if (sel.section === 'equipment' || sel.section === 'daemon_weapons') {
      const arm = findArmoryItem(data, sel.itemName);
      armEquip.push({ name: sel.itemName, desc: arm?.desc ?? '' });
      continue;
    }
    const arm = findArmoryItem(data, sel.itemName);
    if (!arm) continue;
    if (arm.profiles && arm.profiles.length > 0) {
      for (const p of arm.profiles) {
        const w: Weapon = { name: `${arm.name} — ${p.name}`, range: p.range, type: p.type, s: p.s, ap: p.ap, d: p.d, abilities: p.abilities };
        (p.range === 'Melee' || p.type === 'Melee') ? armMelee.push(w) : armRanged.push(w);
      }
    } else if (arm.range) {
      const w: Weapon = { name: arm.name, range: arm.range ?? '', type: arm.type ?? '', s: arm.s ?? '', ap: arm.ap ?? '', d: arm.d ?? '', abilities: arm.abilities };
      (arm.range === 'Melee' || arm.type === 'Melee') ? armMelee.push(w) : armRanged.push(w);
    } else {
      armEquip.push({ name: sel.itemName, desc: arm?.desc ?? '' });
    }
  }

  const abilitiesList = u.abilities;
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
              {u.name}
              {variant && (
                <span style={{ fontWeight: 400, fontSize: '.52em', marginLeft: 10, opacity: .85 }}>
                  → {variant.name}
                </span>
              )}
            </div>
            <div style={{ color: 'rgba(255,255,255,.72)', fontSize: '.68em', marginTop: 3, letterSpacing: '.03em' }}>
              {item.slot} · {u.unit_type}{effectiveMark ? ` · Mark of ${effectiveMark}` : ''}
              {u.equipped_with ? ` — ${u.equipped_with}` : ''}
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
        borderBottom: `2px solid ${color}`,
        padding: '5px 10px 4px',
      }}>
        {modelsToShow.map((m, mi) => (
          <StatRow
            key={mi}
            keys={statKeys}
            stats={m.stats as Record<string, string>}
            mod={mod}
            showLabels={mi === 0}
            modelLabel={modelsToShow.length > 1 ? m.name : undefined}
          />
        ))}
      </div>

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
                {['Weapon', 'Rng', 'S', 'AP', 'D'].map((h, i) => (
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
              <WeaponSection title="Ranged" weapons={[...defaultRanged, ...armRanged]} />
              <WeaponSection title="Melee"  weapons={[...defaultMelee,  ...armMelee]}  />
            </tbody>
          </table>

          {armEquip.length > 0 && (
            <div style={{ padding: '4px 8px', borderTop: `1px dotted ${color}`, fontSize: '.78em', color: '#333' }}>
              <span style={{ fontWeight: 700 }}>Equipment: </span>
              {armEquip.map((eq, i) => (
                <span key={i}>{eq.name}{eq.desc ? ` (${eq.desc})` : ''}{i < armEquip.length - 1 ? ', ' : ''}</span>
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
              Abilities
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
                    Veteran Abilities
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

// ── Bar chart ─────────────────────────────────────────────────────────────────
function BarChart({ title, data, suffix = '' }: {
  title: string; data: [number | string, number][]; suffix?: string;
}) {
  const max = Math.max(...data.map(d => d[1]), 1);
  return (
    <div>
      <div style={{ fontWeight: 700, fontSize: '.72em', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.06em', color: '#444' }}>
        {title}
      </div>
      {data.map(([key, pts]) => (
        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '.75em', marginBottom: 3 }}>
          <span style={{ width: '2.6em', textAlign: 'right', fontWeight: 700, flexShrink: 0, color: '#333' }}>{key}{suffix}</span>
          <div style={{ flex: 1, background: '#ddd8ce', height: 11, overflow: 'hidden' }}>
            <div style={{ width: `${(pts / max) * 100}%`, height: '100%', backgroundColor: 'var(--ac)' }} />
          </div>
          <span style={{ width: '3em', color: '#555', flexShrink: 0 }}>{pts}p</span>
        </div>
      ))}
    </div>
  );
}

// ── Summary page ──────────────────────────────────────────────────────────────
function SummaryPage({ army, data, color, factionName }: {
  army: RosterEntry[]; data: FactionData; color: string; factionName: string;
}) {
  const units = army.flatMap(item => {
    const u = resolveUnit(item, data);
    if (!u) return [];
    const pts = computeUnitPoints(item, u);
    const primaryModel = u.models[0];
    const wPerModel = u.is_vehicle
      ? parseInt(primaryModel?.stats.HP ?? '1')
      : parseInt(primaryModel?.stats.W ?? '1');
    const totalW = item.size * (isNaN(wPerModel) ? 1 : wPerModel);
    return [{ item, u, pts, totalW }];
  });

  const sorted = [...units].sort((a, b) => b.pts - a.pts);
  const grandPts = units.reduce((s, x) => s + x.pts, 0);
  const grandW   = units.reduce((s, x) => s + x.totalW, 0);

  const parseStatNum = (u: Unit, stat: string): number => {
    const raw = (u.models[0]?.stats as Record<string, string>)?.[stat] ?? '';
    const m = raw.match(/\d+/);
    return m ? parseInt(m[0]) : 0;
  };

  const buildBar = (getter: (x: typeof units[0]) => number): [number, number][] => {
    const map = new Map<number, number>();
    for (const x of units) {
      const v = getter(x);
      map.set(v, (map.get(v) ?? 0) + x.pts);
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  };

  return (
    <div style={{
      marginBottom: 24, pageBreakInside: 'avoid', breakInside: 'avoid',
      border: `2px solid ${color}`, backgroundColor: '#fff',
      ['--ac' as string]: color,
    }}>
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
        <div style={{ flex: 1, borderRight: `2px solid ${color}` }}>
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

          {sorted.map((x, i) => (
            <div key={x.item.id} style={{
              display: 'grid', gridTemplateColumns: '1fr 2.6rem 3.2rem 3.2rem',
              padding: '2px 10px', fontSize: '.8em',
              backgroundColor: i % 2 === 1 ? '#f5f1ea' : '#fff',
              borderBottom: '1px dotted #ccc', color: '#111',
            }}>
              <span>{x.u.name}</span>
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

        {/* Charts */}
        <div style={{ flex: 1, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <BarChart title="Toughness" data={buildBar(x => parseStatNum(x.u, 'T'))} />
          <BarChart title="Movement"  data={buildBar(x => parseStatNum(x.u, 'M'))} suffix='"' />
          <BarChart title="Save"      data={buildBar(x => parseStatNum(x.u, 'SV'))} suffix="+" />
        </div>
      </div>
    </div>
  );
}

// ── Print View root ───────────────────────────────────────────────────────────
export function PrintView({ onClose }: { onClose: () => void }) {
  const { data, army, archetype, legacy, legacy2, pointLimit, engagement, hqMark } = useArmyStore();
  if (!data) return null;

  const rule = getArchetypeRule(archetype);
  const forcedMark = rule?.forcedMark ? rule.forcedMark as Mark : null;
  const dominantMark = forcedMark ?? (hqMark !== 'Undivided' ? hqMark : null);
  const primaryColor = getMarkColor(dominantMark);

  const totalPts = army.reduce((s, item) => {
    const u = resolveUnit(item, data);
    return s + (u ? computeUnitPoints(item, u) : 0);
  }, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ background: '#1a1a1e' }}>

      {/* Toolbar — hidden on print */}
      <div className="print:hidden sticky top-0 z-10 bg-zinc-900 border-b border-zinc-700 px-4 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-amber-400 font-bold text-sm uppercase tracking-widest">{data.faction}</span>
          <span className="text-zinc-400 text-sm">{totalPts} / {pointLimit} pts</span>
          {archetype && <span className="text-zinc-500 text-xs">{archetype}</span>}
          {legacy && <span className="text-zinc-500 text-xs">{legacy}{legacy2 ? ` · ${legacy2}` : ''}</span>}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => window.print()}
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
      <div className="max-w-3xl mx-auto px-4 py-6 print:px-0 print:py-0 print:max-w-none"
        style={{ background: '#fff', minHeight: '100vh' }}>

        {army.length > 0 && (
          <SummaryPage army={army} data={data} color={primaryColor} factionName={data.faction} />
        )}

        {army.map(item => (
          <UnitPrintCard key={item.id} item={item} data={data} />
        ))}

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
              Army Configuration
            </div>
            <div style={{
              backgroundColor: '#f5f1ea', padding: '10px 14px',
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
            }}>
              {[
                engagement && ['Engagement', engagement],
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
          </div>
        )}
      </div>
    </div>
  );
}
