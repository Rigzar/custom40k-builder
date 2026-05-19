import type { RosterEntry, Mark } from '../types/army';
import type { Unit, Weapon, ArmoryItem, FactionData } from '../types/data';
import { useArmyStore } from '../store/army';
import { computeUnitPoints, getActiveVariant, resolveUnit } from '../engine/points';
import { getArchetypeRule } from '../engine/archetypes';
import { SLOT_ORDER, ENGAGEMENTS } from '../engine/engagements';
import { SLOT_ICONS } from '../assets/slotIcons';
import { parseAbility, lookupRuleGeneric } from '../data/coreRules';

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

  // Weapons that appear as choices in any option group are optional — only show if selected.
  // Weapons not in any option group are always-equipped default gear.
  const optionalWeaponNames = new Set<string>();
  for (const g of u.option_groups) {
    for (const c of g.choices) {
      if (u.weapons.some(w => w.name === c.name)) optionalWeaponNames.add(c.name);
    }
  }
  const selectedWeaponNames = new Set<string>();
  for (const [gi, ch] of Object.entries(item.optionQty ?? {})) {
    const g = u.option_groups[Number(gi)];
    if (!g) continue;
    for (const [ci, qty] of Object.entries(ch)) {
      if (ci === '__inline' || !qty) continue;
      const choice = g.choices[parseInt(ci)];
      if (choice && optionalWeaponNames.has(choice.name)) selectedWeaponNames.add(choice.name);
    }
  }
  const weaponsToShow = u.weapons.filter(w =>
    !optionalWeaponNames.has(w.name) || selectedWeaponNames.has(w.name)
  );

  const defaultRanged = weaponsToShow.filter(w => w.range && w.range !== 'Melee' && w.range !== '-' && w.range !== '');
  const defaultMelee  = weaponsToShow.filter(w => w.range === 'Melee' || w.type === 'Melee');
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

  const equipMods = parseEquipMods(armEquip);
  const abilitiesList = [
    ...u.abilities.filter(ab => !/^\d+$/.test(ab.trim())),
    ...equipMods.grantedAbilities.filter(ab =>
      !u.abilities.some(a => (a.includes(':') ? a.split(':')[0] : a).trim().toLowerCase() === ab.toLowerCase())
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
              {u.name}
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
        borderBottom: equipMods.invulnSave !== null ? 'none' : `2px solid ${color}`,
        padding: '5px 10px 4px',
      }}>
        {modelsToShow.map((m, mi) => {
          const modStats = applyEquipDeltas(m.stats as Record<string, string>, equipMods, u.is_vehicle);
          return (
            <StatRow
              key={mi}
              keys={statKeys}
              stats={modStats}
              mod={mod}
              showLabels={mi === 0}
              modelLabel={modelsToShow.length > 1 ? m.name : undefined}
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
            <div style={{ padding: '5px 8px', borderTop: `1px dotted ${color}` }}>
              <div style={{ fontWeight: 700, fontSize: '.68em', textTransform: 'uppercase', color: color, letterSpacing: '.06em', marginBottom: 3 }}>
                Equipment
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
const EQUIP_STAT_MAP: [RegExp, string][] = [
  [/\+(\d+)\s+toughness/i, 'T'],
  [/\+(\d+)\s+attacks?/i,  'A'],
  [/\+(\d+)\s+strength/i,  'S'],
  [/\+(\d+)\s+wounds?/i,   'W'],
  [/\+(\d+)"\s+movement/i, 'M'],
  [/\+(\d+)\s+initiative/i,'I'],
  [/\+(\d+)\s+leadership/i,'LD'],
];

interface EquipMods {
  statDeltas: Partial<Record<string, number>>;
  armorSave: number | null;
  invulnSave: number | null;
  grantedAbilities: string[];
}

function parseEquipMods(items: { name: string; desc: string }[]): EquipMods {
  const mods: EquipMods = { statDeltas: {}, armorSave: null, invulnSave: null, grantedAbilities: [] };
  for (const { desc } of items) {
    if (!desc) continue;
    for (const [re, key] of EQUIP_STAT_MAP) {
      const m = desc.match(re);
      if (m) mods.statDeltas[key] = (mods.statDeltas[key] ?? 0) + parseInt(m[1]);
    }
    const armor = desc.match(/(\d)\+\s+armou?r\s+save/i);
    if (armor) { const v = parseInt(armor[1]); if (mods.armorSave === null || v < mods.armorSave) mods.armorSave = v; }
    const invuln = desc.match(/(\d)\+\s+invulnerable\s+save/i);
    if (invuln) { const v = parseInt(invuln[1]); if (mods.invulnSave === null || v < mods.invulnSave) mods.invulnSave = v; }
    for (const match of Array.from(desc.matchAll(/"([^"]+)"/g))) {
      const ab = match[1];
      if (!mods.grantedAbilities.includes(ab)) mods.grantedAbilities.push(ab);
    }
  }
  return mods;
}

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
const COMP_SLOTS  = ['HQ', 'Troops', 'Elites', 'Fast Attack', 'Heavy Support', 'Transport', 'Flyers'] as const;
const COMP_LABELS = ['HQ', 'Troops', 'Elites', 'Fast Atk', 'Heavy', 'Transport', 'Flyers'];
const COMP_MAX    = [2, 6, 3, 3, 3, 3, 1]; // pitched battle caps used as reference

function SummaryPage({ army, data, color, factionName }: {
  army: RosterEntry[]; data: FactionData; color: string; factionName: string;
}) {
  const units = army.flatMap(item => {
    const u = resolveUnit(item, data);
    if (!u) return [];
    const pts = computeUnitPoints(item, u);
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
                {x.u.name}
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
    const shownWeapons = u.weapons.filter(w => !optWpnNames.has(w.name) || selWpnNames.has(w.name));
    for (const w of shownWeapons) {
      if (w.abilities && w.abilities !== '-') parseGeneric(w.abilities);
    }

    // Armory items: weapon profiles → collect ability rules; equipment → collect description
    for (const sel of item.armory) {
      const isEquip = sel.section === 'equipment' || sel.section === 'daemon_weapons';
      const arm = findArmoryItem(data, sel.itemName);
      if (!arm) continue;
      if (isEquip) {
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
          <SummaryPage army={army} data={data} color={primaryColor} factionName={data.faction} />
        )}

        {[...army]
          .sort((a, b) => {
            const ai = SLOT_ORDER.indexOf(a.slot as typeof SLOT_ORDER[number]);
            const bi = SLOT_ORDER.indexOf(b.slot as typeof SLOT_ORDER[number]);
            return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
          })
          .map(item => <UnitPrintCard key={item.id} item={item} data={data} />)
        }

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
              Special Rules
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
