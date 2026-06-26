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
import { getArmySymbolUrl } from '../utils/getArmySymbolUrl';

// ── Faction symbol map (CSS-only design — no background images) ───────────────
const FACTION_SYMBOL: Record<string, string> = {
  'Chaos Space Marines':        '/faction-symbols/chaos-space-marines.svg',
  'Chaos Daemons':              '/faction-symbols/chaos-daemons.svg',
  'Space Marines':              '/faction-symbols/space-marines.svg',
  'Imperial Guard':             '/faction-symbols/imperial-guard.svg',
  'Grey Knights':               '/faction-symbols/grey-knights.svg',
  'Inquisition':                '/faction-symbols/inquisition.svg',
  'Assassins':                  '/faction-symbols/assassins.svg',
  'Horus Heresy Space Marines': '/faction-symbols/horus-heresy.svg',
  'Adeptus Mechanicus':         '/faction-symbols/adeptus-mechanicus.svg',
  'Adeptus Custodes':           '/faction-symbols/adeptus-custodes.svg',
  'Adeptus Sororitas':          '/faction-symbols/adeptus-sororitas.svg',
  'Dark Eldar':                 '/faction-symbols/dark-eldar.svg',
  'Eldar':                      '/faction-symbols/eldar.svg',
  'Harlequins':                 '/faction-symbols/harlequins.svg',
  'Tau Empire':                 '/faction-symbols/tau-empire.svg',
  'Necrons':                    '/faction-symbols/necrons.svg',
  'Orks':                       '/faction-symbols/orks.svg',
  'Tyranids':                   '/faction-symbols/tyranids.svg',
  'Genestealer Cults':          '/faction-symbols/genestealer-cults.svg',
  'Leagues of Votann':          '/faction-symbols/leagues-of-votann.svg',
  'Escalation':                 '/faction-symbols/escalation.svg',
};

function getCardSymbol(faction: string, archetype: string | null, legacy: string | null, legacy2: string | null): string {
  return getArmySymbolUrl(faction, archetype, legacy, legacy2) ?? FACTION_SYMBOL[faction] ?? '';
}

const MARK_COLOR: Record<string, string> = {
  Khorne: '#883531', Nurgle: '#5c672b', Slaanesh: '#634c74',
  Tzeentch: '#015d68', Undivided: '#3a3a3a',
};
const DEFAULT_COLOR = '#4a3a10';
function getMarkColor(mark: Mark | null): string {
  return mark ? (MARK_COLOR[mark] ?? DEFAULT_COLOR) : DEFAULT_COLOR;
}

const MARK_ICON: Record<string, string> = {
  Khorne:   '/mark-icons/khorne.svg',
  Nurgle:   '/mark-icons/nurgle.svg',
  Slaanesh: '/mark-icons/slaanesh.svg',
  Tzeentch: '/mark-icons/tzeentch.svg',
};

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

const NON_RULE_TOKENS = new Set([
  'overcharged', 'standard', 'super-charged', 'supercharged',
]);

function findArmoryItem(data: FactionData, name: string): ArmoryItem | undefined {
  const sources = [data.armory_general, ...Object.values(data.armory_marks), ...Object.values(data.armory_legions)];
  for (const arm of sources)
    for (const sec of ['weapons', 'equipment', 'daemon_weapons'] as const) {
      const found = (arm[sec] as ArmoryItem[]).find(a => a.name === name);
      if (found) return found;
    }
  return undefined;
}

// ── Design tokens (pure CSS — no external images) ─────────────────────────────
const HDR_BG    = '#0f0e0d';   // card header background
const PARCHMENT = '#f7f3ec';   // body warm-white
const PARCH_ALT = '#ece7db';   // alternating weapon rows
const CONDUIT   = "'ConduitITCStd', 'Arial Narrow', Arial, sans-serif";

// ── FancyBox — octagonal stat block ──────────────────────────────────────────
function FancyBox({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <div style={{
      background: color, padding: 2.5, flexShrink: 0,
      clipPath: 'polygon(13% 0%, 100% 0%, 100% 87%, 87% 100%, 0% 100%, 0% 13%)',
    }}>
      <div style={{
        minWidth: '2.1rem', minHeight: '2.1rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: PARCHMENT,
        clipPath: 'polygon(11% 0%, 100% 0%, 100% 89%, 89% 100%, 0% 100%, 0% 11%)',
        fontSize: '1.02em', fontWeight: 900, color: '#1a0a0a',
        fontFamily: CONDUIT, padding: '2px 0',
      }}>
        {children}
      </div>
    </div>
  );
}

// ── FancyShield — invulnerable save ──────────────────────────────────────────
function FancyShield({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: 6 }}>
      <span style={{ fontSize: '.51em', fontWeight: 800, color: 'rgba(255,255,255,.65)', marginBottom: 2, letterSpacing: '.06em', fontFamily: CONDUIT }}>INV</span>
      <div style={{
        background: color, padding: 2.5,
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 62%, 50% 100%, 0% 62%)',
      }}>
        <div style={{
          minWidth: '2.1rem', minHeight: '2.25rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: PARCHMENT,
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 62%, 50% 100%, 0% 62%)',
          fontSize: '1.02em', fontWeight: 900, color, fontFamily: CONDUIT,
        }}>
          {value}+
        </div>
      </div>
    </div>
  );
}

// ── Stat row ──────────────────────────────────────────────────────────────────
function StatRow({ keys, stats, mod, showLabels, modelLabel, color }: {
  keys: readonly string[];
  stats: Record<string, string>;
  mod: { stat: string; delta: number } | null;
  showLabels: boolean;
  modelLabel?: string;
  color: string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
      {modelLabel && (
        <div style={{
          display: 'flex', alignItems: 'center',
          minWidth: 54, paddingRight: 6, marginRight: 2,
          borderRight: '1px solid rgba(255,255,255,.18)',
          fontSize: '.58em', fontWeight: 700, color: 'rgba(255,255,255,.72)',
          lineHeight: 1.2,
        }}>
          {modelLabel}
        </div>
      )}
      {keys.map((k) => {
        const raw = stats[k] ?? '-';
        const boosted = !!(mod && mod.stat === k);
        const display = boosted ? applyDelta(raw, mod!.delta) + '*' : raw;
        return (
          <div key={k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {showLabels && (
              <span style={{ fontSize: '.52em', fontWeight: 800, color: 'rgba(255,255,255,.65)', marginBottom: 2, letterSpacing: '.05em', fontFamily: CONDUIT }}>
                {k}
              </span>
            )}
            <FancyBox color={boosted ? '#b44444' : color}>
              <span style={{ color: boosted ? '#6b1010' : '#1a0a0a' }}>{display}</span>
            </FancyBox>
          </div>
        );
      })}
    </div>
  );
}

// ── Weapon section header + rows ──────────────────────────────────────────────
function WeaponSection({ title, weapons, color, iconUrl }: {
  title: string; weapons: Weapon[]; color: string; iconUrl: string;
}) {
  if (!weapons.length) return null;
  return (
    <>
      <tr>
        <td colSpan={5} style={{ padding: '4px 8px 2px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <span style={{ display: 'inline-block', width: 7, height: 7, background: color, transform: 'rotate(45deg)', flexShrink: 0 }} />
            <img src={iconUrl} alt="" style={{ width: 10, height: 10, opacity: .6, verticalAlign: 'middle' }} />
            <span style={{ fontFamily: CONDUIT, fontSize: '.69em', fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color }}>
              {title}
            </span>
          </span>
        </td>
      </tr>
      {weapons.map((w, i) => <WeaponRow key={i} weapon={w} shade={i % 2 === 1} color={color} />)}
    </>
  );
}

function WeaponRow({ weapon: w, shade, color }: { weapon: Weapon; shade: boolean; color: string }) {
  if (!w.range && !w.type && !w.s) return null;
  const typeTag = w.type && w.type !== '-'
    ? ` <span style="font-size:.7em;font-weight:700;color:${color};opacity:.75;text-transform:uppercase"> [${w.type}]</span>`
    : '';
  const hasAbilities = !!w.abilities && w.abilities !== '-';
  // Short keyword tags (Rending, Twin-linked...) read inline next to the name; longer merged
  // trait text (from option-group abilities) stays in its own row so it isn't cut off.
  const inlineAbilities = hasAbilities && w.abilities.length <= 45;
  const abilityTag = inlineAbilities
    ? ` <span style="font-size:.7em;font-weight:700;color:${color};opacity:.75;text-transform:uppercase"> [${w.abilities}]</span>`
    : '';
  const bg = shade ? PARCH_ALT : PARCHMENT;
  return (
    <>
      <tr style={{ backgroundColor: bg }}>
        <td style={{ textAlign: 'left', padding: '2px 7px', fontSize: '.79em', color: '#111', borderLeft: `2px solid ${color}28` }}>
          <span dangerouslySetInnerHTML={{ __html: w.name + typeTag + abilityTag }} />
        </td>
        {[w.range ?? '-', w.s ?? '-', w.ap ?? '-', w.d ?? '-'].map((v, i) => (
          <td key={i} style={{ textAlign: 'center', padding: '2px 4px', fontSize: '.79em', color: '#444' }}>{v}</td>
        ))}
      </tr>
      {hasAbilities && !inlineAbilities && (
        <tr style={{ backgroundColor: bg }}>
          <td colSpan={5} style={{ padding: '0 7px 3px 22px', fontSize: '.71em', color: '#666', lineHeight: 1.4, fontStyle: 'italic' }}
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
  if (models.length === 1) return `${item.size} × ${models[0].name}`;
  const fixed = models.slice(1);
  const fixedCount = fixed.reduce((s, m) => s + m.min, 0);
  const mainCount = item.size - fixedCount;
  const parts: string[] = [];
  if (mainCount > 0) parts.push(`${mainCount} × ${models[0].name}`);
  for (const m of fixed) {
    if (m.min > 0) parts.push(`${m.min} × ${m.name}`);
  }
  return parts.join(' + ');
}

const pillBase: React.CSSProperties = {
  padding: '1px 8px', borderRadius: 2, fontSize: '.61em',
  fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase',
  display: 'inline-flex', alignItems: 'center', gap: 3, lineHeight: 1.7,
};

// ── Unit print card ───────────────────────────────────────────────────────────
function UnitPrintCard({ item, data }: { item: RosterEntry; data: FactionData }) {
  const u = resolveUnit(item, data);
  if (!u) return null;

  const storeState = useArmyStore.getState();
  const { archetype, legacy, legacy2 } = storeState;
  const { language: lang } = useLanguage();
  const rp = resolveUnitProfile(item, u, storeState, data);
  const { pts, variant, effectiveMark, statModMark, equipMods, weaponTraitMap,
          injectedAbilities, optionStatMods, optionAbilities,
          effectivePsyker, psykerGroupIdx } = rp;
  const color = getMarkColor(effectiveMark);

  const statKeys  = u.is_vehicle ? STAT_KEYS_VEH : STAT_KEYS_INF;
  const modTable  = u.is_character ? MARK_CHAR_MODS : MARK_STAT_MODS;
  const mod       = statModMark ? modTable[statModMark] : null;
  const symbolUrl = getCardSymbol(data.faction, archetype, legacy, legacy2);
  const modelsToShow = rp.modelsToShow;
  const modelCounts  = rp.modelCounts;

  const armRanged: Weapon[] = [];
  const armMelee:  Weapon[] = [];
  const armEquip:  { name: string; desc: string }[] = [];

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
      if (!isWeaponTrait(arm?.desc)) armEquip.push({ name: sel.itemName, desc: arm?.desc ?? '' });
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

  const weaponGroupsPrint = rp.weaponGroups.map(g => {
    const prefix = g.count != null ? `${g.count}x ` : '';
    const tm     = g.traitMap ?? weaponTraitMap;
    const ranged = g.weapons
      .filter(w => w.range && w.range !== 'Melee' && w.range !== '-' && w.range !== '')
      .map(w => ({ ...mergeTraits(w, tm), name: prefix + w.name }));
    const melee = g.weapons
      .filter(w => w.range === 'Melee' || w.type === 'Melee')
      .map(w => ({ ...mergeTraits(w, tm), name: prefix + w.name }));
    return { label: g.label, ranged, melee };
  });

  // Build filter sets for optional abilities
  const _shownWeaponBaseNames = new Set(rp.weaponsToShow.map((w: Weapon) => w.name.split(' - ')[0]));
  const _unselectedOptionalWeapons = new Set<string>();
  const _allChoiceAbilityTexts = new Set<string>();
  for (const g of u.option_groups) {
    for (const c of g.choices) {
      const parts = c.name.split(/\s*(?:&|\band\b)\s*/i).filter(Boolean);
      for (const part of (parts.length > 1 ? parts : [c.name])) {
        if (u.weapons.some((w: Weapon) => w.name.split(' - ')[0] === part) && !_shownWeaponBaseNames.has(part)) {
          _unselectedOptionalWeapons.add(part.toLowerCase());
        }
      }
      for (const ab of (c.abilities ?? [])) {
        _allChoiceAbilityTexts.add(ab.toLowerCase());
      }
    }
  }
  const _selectedChoiceAbilityTexts = new Set(
    (injectedAbilities as string[]).map((a: string) => a.toLowerCase())
  );
  // Psyker inline toggle: unit has an optional psyker upgrade but it hasn't been bought
  const _hasPsykerOption = psykerGroupIdx >= 0 && !effectivePsyker;

  const abilitiesList = [
    ...(u.abilities as string[])
      .filter((ab: string) => {
        if (/^\d+$/.test(ab.trim())) return false;
        const ci = ab.indexOf(':');
        const label = ci > 0 ? ab.substring(0, ci).trim().toLowerCase() : ab.trim().toLowerCase();
        // Weapon-named ability for an unselected optional weapon
        if (_unselectedOptionalWeapons.has(label)) return false;
        // Ability only granted by a choice that hasn't been selected
        if (_allChoiceAbilityTexts.has(ab.toLowerCase()) && !_selectedChoiceAbilityTexts.has(ab.toLowerCase())) return false;
        // Psyker ability when the inline psyker upgrade wasn't bought
        if (_hasPsykerOption && label === 'psyker') return false;
        return true;
      }),
    ...injectedAbilities.filter(ab =>
      !u.abilities.some((a: string) => a.toLowerCase().includes(ab.toLowerCase()))
    ),
    ...equipMods.grantedAbilities.filter(ab =>
      !u.abilities.some((a: string) => (a.includes(':') ? a.split(':')[0] : a).trim().toLowerCase() === ab.toLowerCase())
    ),
    ...optionAbilities.filter(ab =>
      !u.abilities.some((a: string) => a.toLowerCase().includes(ab.toLowerCase()))
    ),
  ];
  const traitList  = item.traits.map(t => t.name);
  const powerList  = item.powers.map(p => `${p.powerName} (${p.disciplineName})`);
  const prayerList = item.prayers;
  const hasAbilities = abilitiesList.length > 0 || traitList.length > 0 || powerList.length > 0 || prayerList.length > 0;

  let joinedName: string | null = null;
  if (item.joinedToUnit) {
    const target = storeState.army.find(e => e.id === item.joinedToUnit);
    if (target) joinedName = target.customName || target.unitName;
  }

  return (
    <div style={{
      marginBottom: 10, pageBreakInside: 'avoid', breakInside: 'avoid',
      border: `1px solid ${color}55`,
      boxShadow: `0 2px 8px rgba(0,0,0,.22), inset 0 0 0 1px ${color}18`,
      fontFamily: "'Trebuchet MS', sans-serif",
      ['--ac' as string]: color,
      overflow: 'hidden',
    }}>

      {/* ══ HEADER — dark, CSS-only ══ */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: HDR_BG,
        borderTop: `4px solid ${color}`,
        minHeight: 88,
      }}>
        {/* Diagonal color wash */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(142deg, ${color}58 0%, ${color}26 40%, transparent 62%)`,
          pointerEvents: 'none',
        }} />
        {/* Subtle noise texture via radial gradients */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at 10% 50%, ${color}22 0%, transparent 55%)`,
          pointerEvents: 'none',
        }} />
        {/* Faction / legion symbol — large watermark */}
        {symbolUrl && (
          <img src={symbolUrl} alt="" style={{
            position: 'absolute', right: -6, top: '50%', transform: 'translateY(-50%)',
            height: '118%', maxHeight: 108, opacity: .17,
            filter: 'invert(1) brightness(10)', pointerEvents: 'none',
          }} />
        )}

        <div style={{ position: 'relative', zIndex: 1, padding: '10px 115px 9px 15px', color: '#fff' }}>
          {/* Unit name + pts badge */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: CONDUIT, fontWeight: 800,
                fontSize: '1.92em', textTransform: 'uppercase',
                letterSpacing: '.04em', lineHeight: 1,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {item.customName || u.name}
              </div>
              {(item.customName || variant) && (
                <div style={{ fontSize: '.7em', color: `${color}cc`, fontWeight: 600, marginTop: 2, letterSpacing: '.02em' }}>
                  {item.customName ? u.name : ''}
                  {variant ? `  ›  ${variant.name}` : ''}
                </div>
              )}
            </div>
            {/* Points badge — clipped octagonal */}
            <div style={{
              background: color, flexShrink: 0,
              clipPath: 'polygon(10% 0%, 100% 0%, 100% 90%, 90% 100%, 0% 100%, 0% 10%)',
              padding: '5px 13px', textAlign: 'center', minWidth: 56,
            }}>
              <div style={{ fontFamily: CONDUIT, fontWeight: 800, fontSize: '1.78em', lineHeight: 1, color: '#fff' }}>
                {pts}
              </div>
              <div style={{ fontFamily: CONDUIT, fontSize: '.54em', fontWeight: 700, letterSpacing: '.1em', color: 'rgba(255,255,255,.68)', textTransform: 'uppercase' }}>
                pts
              </div>
            </div>
          </div>

          {/* Pill row */}
          <div style={{ display: 'flex', gap: 4, marginTop: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            {SLOT_ICONS[item.slot] && (
              <img src={SLOT_ICONS[item.slot]} alt="" style={{ width: 11, height: 11, opacity: .62, filter: 'invert(1)', flexShrink: 0 }} />
            )}
            <span style={{ ...pillBase, background: `${color}bb`, border: `1px solid ${color}`, color: '#fff' }}>
              {item.slot}
            </span>
            {u.unit_type && (
              <span style={{ ...pillBase, background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.17)', color: 'rgba(255,255,255,.88)' }}>
                {u.unit_type}
              </span>
            )}
            {effectiveMark && (
              <span style={{ ...pillBase, background: 'rgba(0,0,0,.3)', border: `1px solid ${color}88`, color: '#fff' }}>
                {MARK_ICON[effectiveMark] && (
                  <img src={MARK_ICON[effectiveMark]} alt="" style={{ width: 10, height: 10, filter: 'invert(1)', opacity: .9 }} />
                )}
                {effectiveMark}
              </span>
            )}
            {rp.equippedWith && (
              <span style={{ ...pillBase, background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.13)', color: 'rgba(255,255,255,.75)' }}>
                {rp.equippedWith}
              </span>
            )}
            {joinedName && (
              <span style={{ ...pillBase, background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.13)', color: 'rgba(255,255,255,.75)' }}>
                ↳ {joinedName}
              </span>
            )}
          </div>

          {/* Composition */}
          <div style={{ color: 'rgba(255,255,255,.38)', fontSize: '.63em', marginTop: 3, letterSpacing: '.03em', fontStyle: 'italic' }}>
            {buildModelCountLabel(item, u)}
          </div>

          {/* Stat rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
            {modelsToShow.map((m, mi) => {
              const modStats = applyEquipDeltas(m.stats as Record<string, string>, equipMods, u.is_vehicle);
              for (const sm of optionStatMods) {
                if (modStats[sm.stat] !== undefined) modStats[sm.stat] = applyDelta(modStats[sm.stat], sm.delta);
              }
              return (
                <div key={mi} style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <StatRow keys={statKeys} stats={modStats} mod={mod} showLabels={mi === 0}
                    modelLabel={modelsToShow.length > 1
                      ? (modelCounts[mi] != null ? `${modelCounts[mi]}× ${m.name}` : m.name)
                      : undefined}
                    color={color} />
                  {mi === 0 && equipMods.invulnSave !== null && (
                    <FancyShield value={equipMods.invulnSave} color={color} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══ BODY ══ */}
      <div style={{ display: 'flex', alignItems: 'stretch', background: PARCHMENT }}>

        {/* Weapons column */}
        <div style={{
          flex: hasAbilities ? '1.42' : '1',
          display: 'flex', flexDirection: 'column',
          borderRight: hasAbilities ? `2px solid ${color}44` : 'none',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: `${color}0e`, borderBottom: `1px solid ${color}44` }}>
                {[tFn(lang,'weapon'), tFn(lang,'range'), 'S', 'AP', 'D'].map((h, i) => (
                  <th key={h} style={{
                    textAlign: i === 0 ? 'left' : 'center',
                    padding: '3px 6px', fontSize: '.65em', fontWeight: 800,
                    color, letterSpacing: '.08em', textTransform: 'uppercase',
                    fontFamily: CONDUIT,
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
                        fontFamily: CONDUIT, fontWeight: 800, fontSize: '.65em',
                        textTransform: 'uppercase', letterSpacing: '.07em',
                        color, padding: '3px 8px 1px',
                        background: `${color}18`,
                      }}>
                        {g.label}
                      </td>
                    </tr>
                  )}
                  <WeaponSection
                    title={tFn(lang, 'ranged')}
                    weapons={gi === 0 ? [...g.ranged, ...armRanged] : g.ranged}
                    color={color} iconUrl="/weapon-type-icons/assault.svg"
                  />
                  <WeaponSection
                    title={tFn(lang, 'melee')}
                    weapons={gi === 0 ? [...g.melee, ...armMelee] : g.melee}
                    color={color} iconUrl="/weapon-type-icons/melee.svg"
                  />
                </Fragment>
              ))}
            </tbody>
          </table>

          {armEquip.length > 0 && (
            <div style={{ padding: '5px 8px', borderTop: `1px solid ${color}33` }}>
              <div style={{ fontFamily: CONDUIT, fontWeight: 800, fontSize: '.63em', textTransform: 'uppercase', color, letterSpacing: '.09em', marginBottom: 3 }}>
                {tFn(lang, 'equipment')}
              </div>
              {armEquip.map((eq, i) => (
                <div key={i} style={{ fontSize: '.76em', lineHeight: 1.45, marginBottom: 2, color: '#222' }}>
                  <span style={{ fontWeight: 700 }}>{eq.name}</span>
                  {eq.desc && <span style={{ color: '#666', marginLeft: 4, fontStyle: 'italic' }}>— {eq.desc}</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Abilities column */}
        {hasAbilities && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' }}>
            <div style={{
              background: `${color}0e`, borderBottom: `1px solid ${color}33`,
              padding: '3px 8px',
              fontFamily: CONDUIT, fontWeight: 800, fontSize: '.65em',
              textTransform: 'uppercase', letterSpacing: '.1em', color,
            }}>
              {tFn(lang, 'abilities')}
            </div>
            {abilitiesList.length > 1 && (
              <div style={{
                padding: '4px 8px', borderBottom: `1px dotted ${color}33`,
                display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center',
              }}>
                <span style={{ fontFamily: CONDUIT, fontSize: '.58em', fontWeight: 800, color: '#999', letterSpacing: '.06em', marginRight: 2 }}>
                  RULES:
                </span>
                {abilitiesList.map((ab, i) => {
                  const ci = ab.indexOf(':');
                  const ruleName = ci > 0 && ci < 52 ? ab.slice(0, ci) : ab;
                  return (
                    <span key={i} style={{
                      fontSize: '.66em', fontWeight: 700, color,
                      background: `${color}14`, padding: '1px 6px', borderRadius: 2,
                      whiteSpace: 'nowrap',
                    }}>
                      {ruleName}
                    </span>
                  );
                })}
              </div>
            )}
            <div style={{ flex: 1, padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {abilitiesList.map((ab, i) => {
                const ci = ab.indexOf(':');
                const split = ci > 0 && ci < 52;
                return (
                  <div key={i} style={{
                    fontSize: '.75em', lineHeight: 1.45, color: '#222',
                    paddingLeft: 7, borderLeft: `3px solid ${color}`,
                  }}>
                    {split
                      ? <><span style={{ fontWeight: 700 }}>{ab.slice(0, ci + 1)}</span>{' '}
                          <span dangerouslySetInnerHTML={{ __html: highlightRules(ab.slice(ci + 1).trim()) }} /></>
                      : <span style={{ fontWeight: 700 }}>{ab}</span>
                    }
                  </div>
                );
              })}

              {traitList.length > 0 && (
                <div style={{ borderTop: `1px solid ${color}28`, paddingTop: 4, marginTop: 2 }}>
                  <div style={{ fontFamily: CONDUIT, fontSize: '.6em', fontWeight: 800, textTransform: 'uppercase', color, letterSpacing: '.08em', marginBottom: 3 }}>
                    {tFn(lang, 'veteranAbilities')}
                  </div>
                  {traitList.map((t, i) => (
                    <div key={i} style={{ fontSize: '.75em', fontWeight: 600, color: '#333', paddingLeft: 7, borderLeft: `3px solid ${color}55` }}>{t}</div>
                  ))}
                </div>
              )}

              {(powerList.length > 0 || prayerList.length > 0) && (
                <div style={{ borderTop: `1px solid ${color}28`, paddingTop: 4, marginTop: 2 }}>
                  <div style={{ fontFamily: CONDUIT, fontSize: '.6em', fontWeight: 800, textTransform: 'uppercase', color, letterSpacing: '.08em', marginBottom: 3 }}>
                    {powerList.length > 0 ? 'Psychic Powers' : 'Prayers'}
                  </div>
                  {[...powerList, ...prayerList].map((p, i) => (
                    <div key={i} style={{ fontSize: '.75em', color: '#333', paddingLeft: 7, borderLeft: `3px solid ${color}55` }}>{p}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ══ KEYWORDS STRIP ══ */}
      {u.keywords.length > 0 && (
        <div style={{
          padding: '4px 12px',
          background: color, color: '#fff',
          fontFamily: CONDUIT, fontWeight: 700, fontSize: '.68em',
          letterSpacing: '.06em', textTransform: 'uppercase',
          display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0 2px',
        }}>
          <span style={{ opacity: .55, marginRight: 6, fontSize: '.85em', flexShrink: 0 }}>◆</span>
          {u.keywords.join(' · ')}
        </div>
      )}
    </div>
  );
}

// ── Radar / spider chart ──────────────────────────────────────────────────────
function RadarChart({ labels, values, color, title, size = 190, subLabels }: {
  labels: string[]; values: number[]; color: string; title: string; size?: number; subLabels?: string[];
}) {
  const n   = labels.length;
  const cx  = size / 2;
  const cy  = size / 2;
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
      <div style={{ fontFamily: CONDUIT, fontWeight: 800, fontSize: '.72em', textTransform: 'uppercase', letterSpacing: '.08em', color: '#555' }}>
        {title}
      </div>
      {subLabels && (
        <div style={{ fontSize: '.58em', color: '#999', fontStyle: 'italic' }}>
          Each axis scaled to its own cap — see values below labels
        </div>
      )}
      <svg width={size} height={size} style={{ overflow: 'visible' }}>
        {[0.25, 0.5, 0.75, 1.0].map(lv => (
          <path key={lv} d={gridPath(lv)} fill="none"
            stroke={lv === 1 ? '#c8c0b4' : '#e0dbd0'}
            strokeWidth={lv === 1 ? 1.2 : 0.6} />
        ))}
        {Array.from({ length: n }, (_, i) => {
          const [x, y] = pt(i, 1);
          return <line key={i} x1={cx.toFixed(1)} y1={cy.toFixed(1)} x2={x.toFixed(1)} y2={y.toFixed(1)} stroke="#d8d0c8" strokeWidth={0.6} />;
        })}
        <polygon points={poly} fill={`${color}2a`} stroke={color} strokeWidth={2} strokeLinejoin="round" />
        {dataPts.map(([x, y], i) => (
          <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r={3} fill={color} />
        ))}
        {labels.map((label, i) => {
          const a  = angle(i);
          const lx = cx + rLabel * Math.cos(a);
          const ly = cy + rLabel * Math.sin(a);
          return (
            <g key={i}>
              <text x={lx.toFixed(1)} y={(ly - (subLabels ? 5 : 0)).toFixed(1)}
                textAnchor="middle" dominantBaseline="middle"
                fontSize="8.5" fontWeight="700" fontFamily="'Trebuchet MS', sans-serif" fill="#555">
                {label}
              </text>
              {subLabels && (
                <text x={lx.toFixed(1)} y={(ly + 7).toFixed(1)}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize="7" fontWeight="400" fontFamily="'Trebuchet MS', sans-serif" fill="#999">
                  {subLabels[i]}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Stat helpers ──────────────────────────────────────────────────────────────
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

const POWER_MAX = [14, 6, 10, 16, 5, 5];

// ── Equipment mod parsing ─────────────────────────────────────────────────────
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
const COMP_MAX    = [2, 6, 3, 3, 3, 3, 1, 3];

function SummaryPage({ army, data, color, factionName, symbolUrl }: {
  army: RosterEntry[]; data: FactionData; color: string; factionName: string; symbolUrl: string;
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

  const slotIdx  = (slot: string) => { const i = SLOT_ORDER.indexOf(slot as typeof SLOT_ORDER[number]); return i === -1 ? 99 : i; };
  const sortedBySlot = [...units].sort((a, b) => slotIdx(a.item.slot) - slotIdx(b.item.slot));
  const grandPts = units.reduce((s, x) => s + x.pts, 0);
  const grandW   = units.reduce((s, x) => s + x.totalW, 0);

  const compCountsForRadar = COMP_SLOTS.map(slot => {
    const effectiveSlot = slot === 'Transport' ? 'Dedicated Transport' : slot;
    return army.filter(item => item.slot === effectiveSlot).length;
  });
  const compValues = compCountsForRadar.map((count, i) => Math.min((count / COMP_MAX[i]) * 10, 10));
  const compSubLabels = compCountsForRadar.map((count, i) => `${count}/${COMP_MAX[i]}`);

  const statSums = [0, 0, 0, 0, 0, 0];
  let statCount  = 0;
  for (const { u } of units) {
    const vals = unitStatValues(u);
    vals.forEach((v, i) => { statSums[i] += v; });
    statCount++;
  }
  const powerValues = statCount === 0
    ? [0, 0, 0, 0, 0, 0]
    : statSums.map((s, i) => Math.min((s / statCount / POWER_MAX[i]) * 10, 10));
  const powerAvgs = statCount === 0 ? [0, 0, 0, 0, 0, 0] : statSums.map(s => s / statCount);
  const powerSubLabels = [
    `${powerAvgs[0].toFixed(1)}"`,
    powerAvgs[1].toFixed(1),
    powerAvgs[2].toFixed(1),
    powerAvgs[3].toFixed(1),
    `${(7 - powerAvgs[4]).toFixed(1)}+`,
    `${(7 - powerAvgs[5]).toFixed(1)}+`,
  ];

  return (
    <div style={{
      marginBottom: 20, pageBreakInside: 'avoid', breakInside: 'avoid',
      border: `1px solid ${color}55`,
      boxShadow: `0 2px 8px rgba(0,0,0,.18)`,
      overflow: 'hidden',
      ['--ac' as string]: color,
    }}>
      {/* Header */}
      <div style={{
        background: HDR_BG, color: '#fff',
        position: 'relative', overflow: 'hidden',
        padding: '8px 16px', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', borderTop: `3px solid ${color}`,
      }}>
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${color}50 0%, transparent 55%)`, pointerEvents: 'none' }} />
        {symbolUrl && (
          <img src={symbolUrl} alt="" style={{
            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
            height: '140%', opacity: .12, filter: 'invert(1) brightness(10)', pointerEvents: 'none',
          }} />
        )}
        <span style={{ fontFamily: CONDUIT, fontWeight: 800, fontSize: '1.05em', textTransform: 'uppercase', letterSpacing: '.06em', position: 'relative', zIndex: 1 }}>
          {factionName} — Army Overview
        </span>
        <span style={{ fontSize: '.85em', opacity: .8, position: 'relative', zIndex: 1, fontFamily: CONDUIT, fontWeight: 700, letterSpacing: '.04em' }}>
          {grandPts} pts · {units.length} units
        </span>
      </div>

      <div style={{ display: 'flex', background: PARCHMENT }}>
        {/* Unit list */}
        <div style={{ flex: 1.4, borderRight: `2px solid ${color}33` }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 2.6rem 3.2rem 3.2rem',
            background: `${color}0e`, fontFamily: CONDUIT, fontWeight: 800, fontSize: '.65em',
            padding: '3px 10px', color, letterSpacing: '.07em', textTransform: 'uppercase',
            borderBottom: `1px solid ${color}33`,
          }}>
            <span>Unit</span>
            <span style={{ textAlign: 'right' }}>W</span>
            <span style={{ textAlign: 'right' }}>Pts/W</span>
            <span style={{ textAlign: 'right' }}>Pts</span>
          </div>

          {sortedBySlot.map((x, i) => (
            <div key={x.item.id} style={{
              display: 'grid', gridTemplateColumns: '1fr 2.6rem 3.2rem 3.2rem',
              padding: '2px 10px', fontSize: '.79em',
              background: i % 2 === 1 ? `${color}08` : '#fff',
              borderBottom: `1px dotted ${color}22`, color: '#111',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontFamily: CONDUIT, fontSize: '.68em', color, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.04em', width: '4.4em', flexShrink: 0 }}>
                  {x.item.slot.replace('Dedicated Transport', 'DT').replace('Fortifications', 'Fort')}
                </span>
                {x.item.customName || x.u.name}
              </span>
              <span style={{ textAlign: 'right', color: '#666' }}>{x.totalW}</span>
              <span style={{ textAlign: 'right', color: '#666' }}>{x.totalW > 0 ? (x.pts / x.totalW).toFixed(1) : '—'}</span>
              <span style={{ textAlign: 'right', fontWeight: 700 }}>{x.pts}</span>
            </div>
          ))}

          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 2.6rem 3.2rem 3.2rem',
            padding: '3px 10px', fontSize: '.79em',
            background: color, color: '#fff', fontWeight: 800, fontFamily: CONDUIT,
            letterSpacing: '.04em', textTransform: 'uppercase',
          }}>
            <span>Total</span>
            <span style={{ textAlign: 'right' }}>{grandW}</span>
            <span style={{ textAlign: 'right' }}>{grandW > 0 ? (grandPts / grandW).toFixed(1) : '—'}</span>
            <span style={{ textAlign: 'right' }}>{grandPts}</span>
          </div>
        </div>

        {/* Radar charts */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly', padding: '8px 4px', borderRight: `2px solid ${color}33`, background: '#fff' }}>
          <RadarChart title="Unit Composition" labels={COMP_LABELS} values={compValues} subLabels={compSubLabels} color={color} size={185} />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly', padding: '8px 4px', background: '#fff' }}>
          <RadarChart title="Army Power" labels={['Move', 'Attacks', 'Tough', 'Wounds', 'Save', 'Shoot']} values={powerValues} subLabels={powerSubLabels} color={color} size={185} />
        </div>
      </div>
    </div>
  );
}

// ── Cover / muster sheet (pure CSS — no background image) ────────────────────
function CoverPage({ army, color, factionName, armyName, engagement, archetype, legacy, legacy2, totalPts, pointLimit, symbolUrl }: {
  army: RosterEntry[]; color: string; factionName: string;
  armyName: string; engagement: string; archetype: string | null;
  legacy: string | null; legacy2: string | null; totalPts: number; pointLimit: number;
  symbolUrl: string;
}) {
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
      marginBottom: 20, pageBreakInside: 'avoid', breakInside: 'avoid', pageBreakAfter: 'always',
      border: `1px solid ${color}55`,
      boxShadow: `0 4px 16px rgba(0,0,0,.25)`,
      overflow: 'hidden',
      ['--ac' as string]: color,
    }}>

      {/* ══ HERO HEADER — CSS-only, no image ══ */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: HDR_BG,
        borderTop: `5px solid ${color}`,
        minHeight: 170,
      }}>
        {/* Bold diagonal color gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(130deg, ${color}72 0%, ${color}30 42%, transparent 68%)`,
          pointerEvents: 'none',
        }} />
        {/* Secondary atmosphere glow */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at 12% 60%, ${color}30 0%, transparent 60%)`,
          pointerEvents: 'none',
        }} />
        {/* Subtle horizontal scanline accent */}
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: '30%', height: 1,
          background: `linear-gradient(90deg, ${color}55, ${color}22, transparent)`,
          pointerEvents: 'none',
        }} />
        {/* Large faction symbol — right side */}
        {symbolUrl && (
          <img src={symbolUrl} alt="" style={{
            position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)',
            height: '82%', maxHeight: 140, opacity: .22,
            filter: 'invert(1) brightness(10)', pointerEvents: 'none',
          }} />
        )}
        <div style={{ position: 'relative', zIndex: 1, padding: '26px 190px 22px 26px' }}>
          <div style={{ fontFamily: CONDUIT, color: `${color}cc`, fontSize: '.74em', textTransform: 'uppercase', letterSpacing: '.24em', fontWeight: 800 }}>
            {factionName}
          </div>
          <div style={{ fontFamily: CONDUIT, color: '#fff', fontSize: '2.7em', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.02em', lineHeight: 1.01, marginTop: 7 }}>
            {armyName || 'Army Roster'}
          </div>
          {/* Colored accent bar under name */}
          <div style={{ width: 80, height: 3, background: color, marginTop: 10, marginBottom: 8, opacity: .85 }} />
          <div style={{ fontFamily: CONDUIT, color: 'rgba(255,255,255,.68)', fontSize: '.96em', fontWeight: 700, letterSpacing: '.05em' }}>
            {totalPts} / {pointLimit} pts  ·  {army.length} units
          </div>
        </div>
      </div>

      {/* ══ CONTENT ROW ══ */}
      <div style={{ display: 'flex', alignItems: 'stretch', background: PARCHMENT }}>

        {/* Config column */}
        <div style={{ flex: 1.2, borderRight: `2px solid ${color}33`, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 9 }}>
          <div style={{ fontFamily: CONDUIT, fontWeight: 800, fontSize: '.7em', textTransform: 'uppercase', letterSpacing: '.12em', color, marginBottom: 2 }}>
            Configuration
          </div>
          {configRows.map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: `1px dotted ${color}44`, paddingBottom: 4 }}>
              <span style={{ fontWeight: 700, fontSize: '.7em', textTransform: 'uppercase', color: '#777', letterSpacing: '.05em' }}>{label}</span>
              <span style={{ fontWeight: 700, fontSize: '.84em', color: '#111' }}>{value}</span>
            </div>
          ))}
          <div style={{ fontFamily: CONDUIT, fontWeight: 800, fontSize: '.7em', textTransform: 'uppercase', letterSpacing: '.12em', color, marginTop: 4, marginBottom: 2 }}>
            Match Info
          </div>
          {fillIn.map(label => (
            <div key={label} style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
              <span style={{ fontWeight: 700, fontSize: '.7em', textTransform: 'uppercase', color: '#777', letterSpacing: '.05em', whiteSpace: 'nowrap' }}>{label}:</span>
              <span style={{ flex: 1, borderBottom: `1px solid ${color}55`, height: '1.1em' }} />
            </div>
          ))}
        </div>

        {/* Force composition column */}
        <div style={{ flex: 1, padding: '14px 18px', background: '#fff' }}>
          <div style={{ fontFamily: CONDUIT, fontWeight: 800, fontSize: '.7em', textTransform: 'uppercase', letterSpacing: '.12em', color, marginBottom: 8 }}>
            Force Composition
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', rowGap: 5, columnGap: 10 }}>
            {COMP_LABELS.map((label, i) => compCounts[i] > 0 ? (
              <Fragment key={label}>
                <span style={{ fontSize: '.8em', color: '#333', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {SLOT_ICONS[COMP_SLOTS[i] === 'Transport' ? 'Dedicated Transport' : COMP_SLOTS[i]] && (
                    <img
                      src={SLOT_ICONS[COMP_SLOTS[i] === 'Transport' ? 'Dedicated Transport' : COMP_SLOTS[i]]}
                      alt="" style={{ width: 12, height: 12, opacity: .5 }}
                    />
                  )}
                  {label}
                </span>
                <span style={{ fontFamily: CONDUIT, fontSize: '.82em', fontWeight: 800, color, textAlign: 'right' }}>{compCounts[i]}</span>
              </Fragment>
            ) : null)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Slot divider ──────────────────────────────────────────────────────────────
function SlotDivider({ slot, color }: { slot: string; color: string }) {
  const iconSrc = SLOT_ICONS[slot];
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', margin: '16px 0 8px', breakInside: 'avoid' }}>
      {/* Left bookmark */}
      <div style={{ width: 5, background: color, borderRadius: '3px 0 0 3px', flexShrink: 0 }} />
      {/* Label chip */}
      <div style={{
        background: `${color}1a`, padding: '3px 14px 3px 11px',
        display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0,
      }}>
        {iconSrc && (
          <img src={iconSrc} alt="" style={{ width: 14, height: 14, opacity: .72 }} />
        )}
        <span style={{
          fontFamily: CONDUIT, fontWeight: 800, fontSize: '.9em',
          textTransform: 'uppercase', letterSpacing: '.15em', color,
        }}>
          {slot}
        </span>
      </div>
      {/* Fading line */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', paddingLeft: 0 }}>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${color}55, transparent)` }} />
      </div>
    </div>
  );
}

// ── Compact list view ─────────────────────────────────────────────────────────
function CompactList({ army, data, color }: { army: RosterEntry[]; data: FactionData; color: string }) {
  const storeState = useArmyStore.getState();
  const slotIdx = (slot: string) => { const i = SLOT_ORDER.indexOf(slot as typeof SLOT_ORDER[number]); return i === -1 ? 99 : i; };
  const sorted  = [...army].sort((a, b) => slotIdx(a.slot) - slotIdx(b.slot));
  let grand   = 0;
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
          background: color, color: '#fff',
          fontFamily: CONDUIT, fontWeight: 800, fontSize: '.7em',
          textTransform: 'uppercase', letterSpacing: '.08em',
          padding: '3px 10px', marginTop: rows.length ? 4 : 0,
        }}>
          {item.slot}
        </div>
      );
    }
    rows.push(
      <div key={item.id} style={{
        display: 'flex', justifyContent: 'space-between', gap: 10,
        padding: '4px 10px', borderBottom: `1px dotted ${color}33`,
        breakInside: 'avoid',
      }}>
        <div style={{ flex: 1 }}>
          <span style={{ fontWeight: 700, fontSize: '.85em', color: '#111' }}>{item.customName || u.name}</span>
          <span style={{ fontSize: '.74em', color: '#888', marginLeft: 6 }}>{buildModelCountLabel(item, u)}</span>
          {wargear.length > 0 && (
            <div style={{ fontSize: '.72em', color: '#666', lineHeight: 1.4, marginTop: 1 }}>{wargear.join(', ')}</div>
          )}
        </div>
        <span style={{ fontFamily: CONDUIT, fontWeight: 800, fontSize: '.88em', color, whiteSpace: 'nowrap' }}>{pts}</span>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 20, border: `1px solid ${color}55`, overflow: 'hidden', background: '#fff', ['--ac' as string]: color }}>
      {rows}
      <div style={{
        display: 'flex', justifyContent: 'space-between', padding: '5px 10px',
        background: color, color: '#fff',
        fontFamily: CONDUIT, fontWeight: 800, fontSize: '.88em',
        textTransform: 'uppercase', letterSpacing: '.06em',
      }}>
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

  const rule         = getArchetypeRule(archetype);
  const forcedMark   = rule?.forcedMark ? rule.forcedMark as Mark : null;
  const dominantMark = forcedMark ?? (hqMark !== 'Undivided' ? hqMark : null);
  const primaryColor = getMarkColor(dominantMark);
  const symbolUrl    = getCardSymbol(data.faction, archetype, legacy, legacy2);

  const storeState = useArmyStore.getState();
  const totalPts = army.reduce((s, item) => {
    const u = resolveUnit(item, data);
    return s + (u ? resolveUnitProfile(item, u, storeState, data).pts : 0);
  }, 0);

  const allSpecialRules = new Map<string, string | null>();
  const addRule = (name: string, desc: string | null) => {
    if (!allSpecialRules.has(name)) allSpecialRules.set(name, desc);
  };

  const parseGeneric = (raw: string) => {
    const trimmed  = raw.trim();
    const colonIdx = trimmed.indexOf(': ');
    if (colonIdx > 0 && colonIdx < 70 && trimmed.length - colonIdx > 10) {
      addRule(trimmed.slice(0, colonIdx).trim(), trimmed.slice(colonIdx + 2).trim());
      return;
    }
    for (const token of trimmed.split(',')) {
      const t = token.trim();
      if (!t) continue;
      if (NON_RULE_TOKENS.has(t.toLowerCase())) continue;
      const found = lookupRuleGeneric(t);
      if (found) addRule(found.displayName, found.description);
      else addRule(t, null);
    }
  };

  for (const item of army) {
    const u = resolveUnit(item, data);
    if (!u) continue;

    for (const ab of u.abilities) {
      if (/^\d+$/.test(ab.trim())) continue;
      parseGeneric(ab);
    }

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

    for (const sel of item.armory) {
      const arm = findArmoryItem(data, sel.itemName);
      if (!arm) continue;
      if (sel.section === 'daemon_weapons') {
        if (isWeaponTrait(arm.desc)) {
          for (const gain of extractWeaponGains(arm.desc)) parseGeneric(gain);
        } else {
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
    <div id="pv-root" className="fixed inset-0 z-50 overflow-y-auto" style={{ background: '#18171a' }}>
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
      <div id="pv-printable" className="max-w-3xl mx-auto px-4 py-6"
        style={{ background: '#fff', minHeight: '100vh' }}>

        {army.length > 0 && (
          <CoverPage army={army} color={primaryColor} factionName={data.faction}
            armyName={armyName} engagement={engagement} archetype={archetype}
            legacy={legacy} legacy2={legacy2} totalPts={totalPts} pointLimit={pointLimit}
            symbolUrl={symbolUrl} />
        )}

        {army.length > 0 && (
          <SummaryPage army={army} data={data} color={primaryColor} factionName={data.faction} symbolUrl={symbolUrl} />
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

        {/* Army configuration block */}
        {(archetype || legacy || engagement) && (
          <div style={{
            marginBottom: 20, pageBreakInside: 'avoid', breakInside: 'avoid',
            border: `1px solid ${primaryColor}55`, overflow: 'hidden',
            ['--ac' as string]: primaryColor,
          }}>
            <div style={{
              background: HDR_BG, color: '#fff',
              padding: '6px 14px', borderTop: `3px solid ${primaryColor}`,
              fontFamily: CONDUIT, fontWeight: 800, textTransform: 'uppercase',
              letterSpacing: '.08em', fontSize: '.85em', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${primaryColor}44 0%, transparent 55%)`, pointerEvents: 'none' }} />
              <span style={{ position: 'relative', zIndex: 1 }}>{tFn(rootLang, 'armyConfiguration')}</span>
            </div>
            <div style={{
              background: PARCHMENT, padding: '10px 14px',
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
            }}>
              {[
                engagement && ['Engagement', ENGAGEMENTS[engagement]?.name ?? engagement],
                archetype  && ['Archetype', archetype],
                legacy     && ['Legacy', legacy + (legacy2 ? ` / ${legacy2}` : '')],
                ['Points', `${totalPts} / ${pointLimit} pts · ${army.length} units`],
              ].filter(Boolean).map(([label, value]) => (
                <div key={label as string}>
                  <div style={{ fontFamily: CONDUIT, fontWeight: 800, fontSize: '.66em', textTransform: 'uppercase', color: '#777', letterSpacing: '.07em', marginBottom: 2 }}>
                    {label}
                  </div>
                  <div style={{ fontWeight: 600, color: '#111', fontSize: '.86em' }}>{value}</div>
                </div>
              ))}
            </div>
            {rule?.notes && rule.notes.length > 0 && (
              <div style={{ padding: '8px 14px', borderTop: `1px solid ${primaryColor}33`, background: '#fff' }}>
                <div style={{ fontFamily: CONDUIT, fontWeight: 800, fontSize: '.66em', textTransform: 'uppercase', color: '#777', letterSpacing: '.07em', marginBottom: 5 }}>
                  Archetype Rules
                </div>
                {rule.notes.map((note, ni) => (
                  <div key={ni} style={{ fontSize: '.82em', color: '#111', lineHeight: 1.45, marginBottom: 3 }}>{note}</div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Special rules reference */}
        {allSpecialRules.size > 0 && (
          <div style={{
            marginBottom: 20, pageBreakInside: 'avoid', breakInside: 'avoid',
            border: `1px solid ${primaryColor}55`, overflow: 'hidden',
            ['--ac' as string]: primaryColor,
          }}>
            <div style={{
              background: HDR_BG, color: '#fff',
              padding: '6px 14px', borderTop: `3px solid ${primaryColor}`,
              fontFamily: CONDUIT, fontWeight: 800, textTransform: 'uppercase',
              letterSpacing: '.08em', fontSize: '.85em', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${primaryColor}44 0%, transparent 55%)`, pointerEvents: 'none' }} />
              <span style={{ position: 'relative', zIndex: 1 }}>{tFn(rootLang, 'specialRules')}</span>
            </div>
            <div style={{
              padding: '8px 14px', background: PARCHMENT,
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 20px',
            }}>
              {[...allSpecialRules.entries()]
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([name, desc]) => (
                  <div key={name} style={{
                    breakInside: 'avoid', fontSize: '.77em', lineHeight: 1.45,
                    color: '#222', paddingBottom: 4,
                    paddingLeft: 6, borderLeft: `2px solid ${primaryColor}55`,
                  }}>
                    {desc
                      ? <><span style={{ fontWeight: 700 }}>{name}:</span>{' '}<span style={{ color: '#555' }}>{desc}</span></>
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
