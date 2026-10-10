import type { ArmyState } from '../types/army';
import type { FactionData, Power, Unit, Weapon } from '../types/data';
import type { RosterEntry } from '../types/army';
import { resolveUnit } from '../engine/points';
import { resolveUnitProfile, findArmoryItem, type WeaponGroup, type ResolvedProfile } from '../engine/resolver';
import { applyEquipDeltas, applyStatMods } from './statMods';
import { GENERAL_DISCIPLINES } from '../data/generalDisciplines';
import { wardSave, ownWardAbilities, markWardedCount } from '../lib/wardSave';
import { isAttendantModel } from '../lib/battleProfile';

/**
 * Export the army as a SELF-CONTAINED, fully resolved document for Tabletop Simulator.
 *
 * WHY RESOLVED: the saved roster format stores unit NAMES plus option indices — the actual stats,
 * weapon profiles and rules text live in the app's faction data, which a TTS mod does not have and
 * should not have to carry. Shipping the whole codex inside the mod would mean re-uploading it on
 * every codex change. So the app does the resolving (the engine it already trusts) and TTS stays a
 * dumb renderer: everything below is final printed values, ready to display on a card.
 *
 * The payload deliberately mirrors what Print View shows, because that is the view that has always
 * been "the army as it actually plays".
 *
 * Consumed by `tts/Custom40k.lua`. Bump `schema` when the shape changes so the mod can refuse a
 * payload it does not understand instead of silently rendering half a datasheet.
 */

export const TTS_SCHEMA = 2;

export interface TtsWeapon {
  /** Stable within the unit: the name as a slug, `_2`, `_3`... when two rows share a name but not
      a profile. `modelWeapons[].weaponId` points here. */
  id: string;
  name: string; range: string; type: string; s: string; ap: string; d: string; abilities: string;
}
export interface TtsModelWeapon { weaponId: string; count?: number }
export interface TtsModel {
  name: string;
  /** Always an integer. The counts of every model entry of a unit add up to `unit.size`
      (`loadoutsExact` says whether they do). */
  count: number;
  /** Which of the unit's models this entry is: "Bolter", "Plague belcher", "Champion"... */
  loadoutName: string;
  /** What each of these `count` models carries. `count` is omitted when it is 1. */
  modelWeapons: TtsModelWeapon[];
  stats: Record<string, string>;
  /** Column order for `stats`. Lua's JSON.decode returns an unordered table, so the mod cannot
      recover M/WS/BS/S/T/... from the object itself — it has to be told. */
  statKeys: string[];
  /** The model's Ward Save as printed, "5+", or null when it has none. Same value as the unit's, except for
      attendants (drones...), which are not covered by the unit's own ward. */
  wardSave: string | null;
}
export interface TtsUnit {
  id: string; unitName: string; displayName: string; slot: string; size: number; points: number;
  unitType: string; keywords: string[];
  mark: string | null;
  models: TtsModel[];
  /** False when the loadouts could not be split without guessing (see `loadoutNotes`). */
  loadoutsExact: boolean;
  loadoutNotes: string[];
  /** The unit's best Ward Save as printed, "5+", or null: datasheet, Armory equipment, option choices, traits
      and a Mark's Warded all counted, the very derivation the unit card and Print View use. */
  wardSave: string | null;
  equippedWith: string;
  weapons: TtsWeapon[];
  abilities: string[];
  wargear: { name: string; desc: string }[];
  prayers: Power[]; pacts: Power[]; powers: Power[];
}
export interface TtsExport {
  schema: number;
  generatedAt: string;
  army: {
    name: string; faction: string; engagement: string; pointLimit: number; totalPoints: number;
    archetype: string; legacy: string; legacy2: string; traits: string[];
  };
  units: TtsUnit[];
  /** Units that could not be exported, and why. Empty when everything made it. */
  warnings: string[];
  /** Whole-faction reference, so the table can show rules for things not currently taken. */
  reference: { prayers: Power[]; pacts: Power[]; disciplines: Record<string, Power[]> };
}

/** Resolve a bare name against the faction's psychic pools, keeping every rules field. */
function lookupAll(names: string[] | undefined, pools: Power[][]): Power[] {
  const out: Power[] = [];
  for (const n of names ?? []) {
    let found: Power | undefined;
    for (const pool of pools) { found = pool.find(p => p.name === n); if (found) break; }
    out.push(found ?? { name: n });
  }
  return out;
}

const slug = (n: string) => n.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'weapon';
const eqi = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();
const bareName = (n: string) => n.split(' - ')[0].replace(/\s*\([^)]*\)\s*$/, '').trim().toLowerCase();

interface Loadout { name: string; count: number; weapons: { w: Weapon; copies: number }[] }

/**
 * Split ONE weapon group into the loadouts its models actually carry.
 *
 * The group's `count` (and per-weapon `countOverrides`) say how many models carry each weapon:
 * a weapon at the full group size is standard kit, a weapon at less is somebody's swap. Standard
 * kit goes on every model; every swapped-in weapon (or "A and B" pair taken together) makes a
 * loadout of its own; whatever is left over carries the standard kit alone. A count ABOVE the
 * group size means several copies on each model (a vehicle's twin Plague spewers).
 *
 * `null` counts are NOT zero: fixed weapons come out of the resolver with no count at all, and mean
 * "every model in the group".
 */
function splitGroup(g: WeaponGroup, n: number, unit: Unit, label: string, notes: string[]): Loadout[] {
  if (n <= 0) return [];
  const countOf = (w: Weapon) => g.countOverrides?.get(w.name) ?? g.count ?? n;
  const live = g.weapons.filter(w => countOf(w) !== 0);
  const shared = live.filter(w => countOf(w) >= n);
  const variable = live.filter(w => countOf(w) < n);
  const copies = (w: Weapon) => (countOf(w) > n ? Math.ceil(countOf(w) / n) : 1);
  const asRows = (ws: Weapon[]) => ws.map(w => ({ w, copies: copies(w) }));
  if (!variable.length) return [{ name: label, count: n, weapons: asRows(shared) }];

  // The option choices that can put a weapon on a model, and the weapons each one takes away.
  const choiceParts = (c: { name: string }) => c.name.split(/\s*(?:&|\band\b)\s*/i).map(x => x.trim()).filter(Boolean);
  const choiceOf = (w: Weapon) => {
    for (const og of unit.option_groups ?? []) for (const c of og.choices ?? [])
      if (choiceParts(c).some(pt => pt.toLowerCase() === bareName(w.name))) return { og, c };
    return null;
  };
  // Kit named in the unit's own "equipped with" sentence comes standard, even when a choice also mentions it.
  const standardText = (unit.equipped_with ?? '').toLowerCase();
  const added = variable.filter(w => choiceOf(w) && !standardText.includes(bareName(w.name)));
  const base = variable.filter(w => !choiceOf(w));       // the weapons that got REDUCED by a swap

  // Rows that are profiles of one weapon ("Plasma gun - Standard" / "- Overcharged"), and weapons
  // bought together ("Shuriken pistol and Power sword"), are ONE taker.
  const parent = new Map<Weapon, Weapon>();
  const find = (w: Weapon): Weapon => { let r = w; while (parent.get(r) && parent.get(r) !== r) r = parent.get(r)!; return r; };
  const union = (x: Weapon, y: Weapon) => { const rx = find(x), ry = find(y); if (rx !== ry) parent.set(rx, ry); };
  for (const w of added) {
    const twin = added.find(x => x !== w && bareName(x.name) === bareName(w.name) && countOf(x) === countOf(w));
    if (twin) union(w, twin);
    const ch = choiceOf(w);
    if (ch) {
      const parts = choiceParts(ch.c);
      if (parts.length > 1) for (const pt of parts) { const m = added.find(x => bareName(x.name) === pt.toLowerCase()); if (m) union(w, m); }
    }
  }
  const bundles = new Map<Weapon, Weapon[]>();
  for (const w of added) { const r = find(w); bundles.set(r, [...(bundles.get(r) ?? []), w]); }

  const out: Loadout[] = [];
  let used = 0;
  for (const ws of bundles.values()) {
    const k = Math.min(...ws.map(countOf));
    used += k;
    const replaced = new Set((choiceOf(ws[0])?.og.replaces ?? []).map(r => bareName(r)));
    // With no `replaces` on the option, drop the base weapons cut by exactly this many models.
    const dropped = (w: Weapon) => (replaced.size ? replaced.has(bareName(w.name)) : countOf(w) === n - k);
    // Named after the OPTION taken ("Combi-flamer"), not after every sub-profile row it brought.
    const optName = [...new Set(ws.map(w => choiceOf(w)?.c.name ?? w.name))].join(' + ');
    out.push({ name: optName, count: k,
      weapons: [...asRows(shared), ...asRows(base.filter(w => !dropped(w))), ...asRows(ws)] });
  }
  if (used > n) {
    // More weapon-takers than models: the counts overlap and which model has what cannot be told.
    notes.push(`${label}: ${used} weapon takers for ${n} models, shown as one loadout`);
    return [{ name: label, count: n, weapons: asRows([...shared, ...variable]) }];
  }
  out.sort((x, y) => x.count - y.count);
  if (used < n) {
    const baseNames = [...new Set(base.map(w => bareName(w.name)))];
    out.push({ name: baseNames.length ? base.map(w => w.name.split(' - ')[0]).filter((v, i, arr) => arr.indexOf(v) === i).join(' + ') : (out.length ? 'Standard' : label),
      count: n - used, weapons: [...asRows(shared), ...asRows(base)] });
  }
  return out;
}

/** Counts per model row, never null: the resolver's own, then the roster's, then the datasheet. */
function modelCountsOf(rp: ResolvedProfile, item: RosterEntry): number[] {
  const ms = rp.modelsToShow;
  const own = (m: { name: string }, i: number) => rp.modelCounts[i] ?? item.modelSizes?.[m.name] ?? null;
  const raw = ms.map((m, i) => own(m, i) ?? (ms.length === 1 ? item.size : (m.min > 0 ? m.min : m.max)));
  // One row with no count of its own takes whatever the others leave of the squad.
  const blank = ms.map((m, i) => (own(m, i) == null && ms.length > 1 ? i : -1)).filter(i => i >= 0);
  const total = raw.reduce((a, b) => a + b, 0);
  if (blank.length === 1 && total !== item.size) {
    const rest = item.size - (total - raw[blank[0]]);
    if (rest >= 0) raw[blank[0]] = rest;
  }
  return raw;
}

export function buildTtsExport(state: ArmyState, data: FactionData): TtsExport {
  // Includes the Core Rules general disciplines: a psyker's picked power can come from there
  // (Smite most of all), and without them the lookup falls through to a bare name on the card.
  // Non-arrays are filtered for the same reason as in psychicFormat.ts -- FactionData is built
  // behind a cast, so a field can be the wrong shape at runtime (GH#113).
  const pools: Power[][] = ([
    data.prayers, data.pacts,
    ...Object.values(data.disciplines ?? {}),
    ...Object.values(GENERAL_DISCIPLINES),
  ] as unknown[]).filter((p): p is Power[] => Array.isArray(p));
  const units: TtsUnit[] = [];
  const warnings: string[] = [];
  let total = 0;

  for (const item of state.army) {
    const unit = resolveUnit(item, data);
    // Never drop a unit without saying so: an Allied Detachment whose data was not loaded used to
    // vanish from the table with nothing to show for it.
    if (!unit) { warnings.push(`"${item.customName || item.unitName}" (${item.unitName}${item.factionSource ? ', ' + item.factionSource : ''}) could not be resolved and is not in this export`); continue; }
    const rp = resolveUnitProfile(item, unit, state, data);
    total += rp.pts;

    // Weapons first: one row per distinct profile, so a weapon several groups share keeps ONE id.
    const weapons: TtsWeapon[] = [];
    const idOf = new Map<string, string>();
    const taken = new Set<string>();
    const weaponId = (w: Weapon, traits: Map<string, string[]>): string => {
      const extra = traits.get(w.name) ?? [];
      const base = (w.abilities && w.abilities !== '-') ? w.abilities : '';
      const abil = [base, ...extra].filter(Boolean).join(', ') || '-';
      const key = [w.name, w.range, w.type, w.s, w.ap, w.d, abil].join('\u0001');
      const known = idOf.get(key);
      if (known) return known;
      let id = slug(w.name), i = 2;
      while (taken.has(id)) id = `${slug(w.name)}_${i++}`;
      taken.add(id); idOf.set(key, id);
      weapons.push({ id, name: w.name, range: w.range, type: w.type, s: w.s, ap: w.ap, d: w.d, abilities: abil });
      return id;
    };
    // From weaponGroups, NOT weaponsToShow. Targeted enhancements (a Regimental artefact's
    // +1 Strength, a Daemon weapon's bonus) are applied when the groups are built, and
    // granted abilities live in each group's traitMap -- neither reaches `weaponsToShow`,
    // so a TTS card built from that list showed the unmodified profile while the app's own
    // unit card showed the boosted one.
    const traitsOf = new Map<Weapon, Map<string, string[]>>();
    for (const g of rp.weaponGroups) for (const w of g.weapons) { traitsOf.set(w, g.traitMap ?? rp.weaponTraitMap); weaponId(w, g.traitMap ?? rp.weaponTraitMap); }

    // The ward save, derived exactly like the unit card and Print View do (src/lib/wardSave.ts).
    const wardValue = wardSave({
      abilities: ownWardAbilities(unit, item), equipInvSave: rp.equipMods.invulnSave,
      optionAbilities: rp.optionAbilities, traitAbilities: rp.traitAbilities,
      markWarded: markWardedCount(rp.statModMark, rp.blackCrusadeChampion, unit.abilities),
    });
    const ward = wardValue !== null ? `${wardValue}+` : null;

    // Final printed stats: base model -> equipment mods -> option/trait stat mods, the same order
    // the live card and the printed sheet apply them in.
    const rows = rp.modelsToShow.map(m => {
      let stats: Record<string, string> = { ...(m.stats as unknown as Record<string, string>) };
      stats = applyEquipDeltas(stats, rp.equipMods, unit.is_vehicle);
      stats = applyStatMods(stats, [...rp.optionStatMods, ...rp.traitStatMods]);
      return { name: m.name, stats, statKeys: Object.keys(stats), wardSave: isAttendantModel(unit, m) ? null : ward };
    });
    const rowCounts = modelCountsOf(rp, item);
    const notes: string[] = [];

    // Which weapon group belongs to which model row: by label (or span), else the one unlabelled
    // group covers every row.
    const rowsOfGroup = (g: WeaponGroup): number[] => {
      if (g.models?.length) return rows.map((r, i) => (g.models!.some(n => eqi(n, r.name)) ? i : -1)).filter(i => i >= 0);
      if (g.label) {
        let i = rows.findIndex(r => eqi(r.name, g.label!));
        // The model was promoted ("Sister Superior" -> "Veteran Superior"): its row now carries the
        // promoted name while the loadout clause still names the original.
        if (i < 0 && rp.variantActive && rp.variant && unit.models.some(m => eqi(m.name, g.label!))) {
          i = rows.findIndex(r => eqi(r.name, rp.variant!.name));
        }
        return i >= 0 ? [i] : [];
      }
      return rows.map((_, i) => i);
    };
    const loadoutsOf = new Map<number, { lo: Loadout; take: number }[]>();
    for (const g of rp.weaponGroups) {
      const idxs = rowsOfGroup(g).sort((a, b) => rowCounts[b] - rowCounts[a] || a - b);
      if (!idxs.length) { notes.push(`weapon group "${g.label}" matches no model row`); continue; }
      const room = idxs.map(i => rowCounts[i]);
      const n = room.reduce((x, y) => x + y, 0);
      let slot = 0;
      for (const lo of splitGroup(g, n, unit, g.label ?? rows[idxs[0]].name, notes)) {
        let left = lo.count;
        while (left > 0 && slot < idxs.length) {
          const t = Math.min(left, room[slot]);
          if (t > 0) {
            const arr = loadoutsOf.get(idxs[slot]) ?? [];
            arr.push({ lo, take: t });
            loadoutsOf.set(idxs[slot], arr);
            room[slot] -= t; left -= t;
          }
          if (room[slot] === 0) slot++;
        }
      }
    }
    const models: TtsModel[] = [];
    rows.forEach((r, i) => {
      const los = loadoutsOf.get(i);
      if (!los) { models.push({ ...r, count: rowCounts[i], loadoutName: r.name, modelWeapons: [] }); return; }
      for (const { lo, take } of los) {
        // One loadout spread over several model rows (4 Bolters = 3 Marines + the Champion): the
        // first row keeps the weapon's name, the others are named after their own row.
        const firstRow = rows.findIndex((_, k) => loadoutsOf.get(k)?.some(x => x.lo === lo));
        models.push({
          ...r, count: take, loadoutName: firstRow === i ? lo.name : r.name,
          modelWeapons: lo.weapons.map(x => ({
            weaponId: weaponId(x.w, traitsOf.get(x.w) ?? rp.weaponTraitMap),
            ...(x.copies > 1 ? { count: x.copies } : {}),
          })),
        });
      }
    });
    // Per ROW as well as in total: each model row must add up to what the player chose for it.
    rows.forEach((r, i) => {
      const got = models.filter(m => m.name === r.name).reduce((x, m) => x + m.count, 0);
      if (got !== rowCounts[i]) notes.push(`${r.name}: ${got} in the loadouts, ${rowCounts[i]} in the roster`);
    });
    const sum = models.reduce((x, m) => x + m.count, 0);
    if (sum !== item.size) notes.push(`model counts add up to ${sum}, unit size is ${item.size}`);
    const loadoutsExact = notes.length === 0;

    const abilities = [
      ...(unit.abilities ?? []),
      ...rp.injectedAbilities,
      ...rp.equipMods.grantedAbilities,
      ...rp.traitAbilities.map(t => (t.desc ? `${t.name}: ${t.desc}` : t.name)),
    ].filter((v, i, a) => v && a.indexOf(v) === i);

    const unitTypes = [unit.unit_type, ...rp.optionAddedUnitTypes].filter(Boolean).join(', ');

    units.push({
      id: item.id,
      // The unit's CURRENT name: a list saved before a rename keeps the old one in item.unitName.
      unitName: unit.name || item.unitName,
      displayName: item.customName || unit.name || item.unitName,
      slot: rp.effectiveSlot,
      size: item.size,
      points: rp.pts,
      unitType: unitTypes,
      keywords: unit.keywords ?? [],
      mark: rp.effectiveMark ?? null,
      models,
      loadoutsExact,
      loadoutNotes: notes,
      wardSave: ward,
      equippedWith: rp.equippedWith ?? '',
      weapons,
      abilities,
      // Carry each wargear item's own rules text, so the card explains what the item DOES rather
      // than just naming it. `findArmoryItem` searches every pool by name (source is cosmetic).
      wargear: (item.armory ?? []).map(a => ({
        name: a.itemName, desc: findArmoryItem(data, a)?.desc ?? '',
      })),
      prayers: lookupAll(item.prayers, pools),
      pacts: lookupAll(item.pacts, pools),
      // item.powers is PowerSelection[] ({ disciplineName, powerName }), not plain names.
      powers: lookupAll((item.powers ?? []).filter(p => p.powerName !== '__discipline__').map(p => p.powerName), pools),
    });
  }

  return {
    schema: TTS_SCHEMA,
    generatedAt: new Date().toISOString(),
    army: {
      name: state.armyName || 'Unnamed Army',
      faction: data.faction,
      engagement: state.engagement,
      pointLimit: state.pointLimit,
      totalPoints: total,
      archetype: state.archetype ?? '',
      legacy: state.legacy ?? '',
      legacy2: state.legacy2 ?? '',
      traits: state.traitPool ?? [],
    },
    units,
    warnings,
    reference: {
      prayers: data.prayers ?? [],
      pacts: data.pacts ?? [],
      // Core Rules: "Psykers have access to the list of General Psychic Disciplines as well as
      // those listed in their respective Codex." Necrons are the one faction-wide exception (their
      // psykers only ever know C'tan powers), matching PsychicModal's own gating.
      disciplines: {
        ...(data.faction !== 'Necrons' ? GENERAL_DISCIPLINES : {}),
        ...(data.disciplines ?? {}),
      },
    },
  };
}

/**
 * The file text, with an integrity check at the very end. The check is SHA-256 (lowercase hex) of the
 * compact, ASCII-only JSON text of everything before it: remove the trailing `,"checksum":{...}` and put the
 * closing `}` back, and what is left is exactly the text that was hashed. Because it is the text that
 * is hashed, a line damaged while copying into Tabletop Simulator shows up, and the check itself is
 * never part of what it covers. The army and the units come first; the faction reference comes last.
 */
export async function serializeTtsExport(payload: TtsExport): Promise<string> {
  // ASCII only: every non-ASCII character (the inch mark ″, accents) is written as a \uXXXX escape,
  // which any JSON reader turns back into the same character. Tabletop Simulator's input box
  // normalises non-ASCII characters while you paste, which changed the text and broke the hash
  // although the game itself read the data fine (reported by the Russian translator).
  const body = JSON.stringify(payload).replace(/[\u007f-\uffff]/g, c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'));
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(body));
  const hex = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
  return `${body.slice(0, -1)},"checksum":{"alg":"sha256","value":"${hex}"}}`;
}

/** Trigger a browser download of the export. */
export async function downloadTtsExport(state: ArmyState, data: FactionData) {
  const payload = buildTtsExport(state, data);
  const blob = new Blob([await serializeTtsExport(payload)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(payload.army.name || 'army').replace(/[^\w\-]+/g, '_')}-tts.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
