import type { ArmyState } from '../types/army';
import type { FactionData, Power } from '../types/data';
import { resolveUnit } from '../engine/points';
import { resolveUnitProfile, findArmoryItem } from '../engine/resolver';
import { applyEquipDeltas, applyStatMods } from './statMods';
import { GENERAL_DISCIPLINES } from '../data/generalDisciplines';

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

export const TTS_SCHEMA = 1;

export interface TtsWeapon {
  name: string; range: string; type: string; s: string; ap: string; d: string; abilities: string;
}
export interface TtsModel {
  name: string; count: number | null; stats: Record<string, string>;
  /** Column order for `stats`. Lua's JSON.decode returns an unordered table, so the mod cannot
      recover M/WS/BS/S/T/... from the object itself — it has to be told. */
  statKeys: string[];
}
export interface TtsUnit {
  id: string; unitName: string; displayName: string; slot: string; size: number; points: number;
  unitType: string; keywords: string[];
  mark: string | null;
  models: TtsModel[];
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
  let total = 0;

  for (const item of state.army) {
    const unit = resolveUnit(item, data);
    if (!unit) continue;
    const rp = resolveUnitProfile(item, unit, state, data);
    total += rp.pts;

    // Final printed stats: base model -> equipment mods -> option/trait stat mods, the same order
    // the live card and the printed sheet apply them in.
    const models: TtsModel[] = rp.modelsToShow.map((m, i) => {
      let stats: Record<string, string> = { ...(m.stats as unknown as Record<string, string>) };
      stats = applyEquipDeltas(stats, rp.equipMods, unit.is_vehicle);
      stats = applyStatMods(stats, [...rp.optionStatMods, ...rp.traitStatMods]);
      return { name: m.name, count: rp.modelCounts[i] ?? null, stats, statKeys: Object.keys(stats) };
    });

    const abilities = [
      ...(unit.abilities ?? []),
      ...rp.injectedAbilities,
      ...rp.equipMods.grantedAbilities,
      ...rp.traitAbilities.map(t => (t.desc ? `${t.name}: ${t.desc}` : t.name)),
    ].filter((v, i, a) => v && a.indexOf(v) === i);

    const unitTypes = [unit.unit_type, ...rp.optionAddedUnitTypes].filter(Boolean).join(', ');

    units.push({
      id: item.id,
      unitName: item.unitName,
      displayName: item.customName || item.unitName,
      slot: rp.effectiveSlot,
      size: item.size,
      points: rp.pts,
      unitType: unitTypes,
      keywords: unit.keywords ?? [],
      mark: rp.effectiveMark ?? null,
      models,
      equippedWith: rp.equippedWith ?? '',
      weapons: rp.weaponsToShow.map(w => ({
        name: w.name, range: w.range, type: w.type, s: w.s, ap: w.ap, d: w.d,
        abilities: w.abilities ?? '-',
      })),
      abilities,
      // Carry each wargear item's own rules text, so the card explains what the item DOES rather
      // than just naming it. `findArmoryItem` searches every pool by name (source is cosmetic).
      wargear: (item.armory ?? []).map(a => ({
        name: a.itemName, desc: findArmoryItem(data, a)?.desc ?? '',
      })),
      prayers: lookupAll(item.prayers, pools),
      pacts: lookupAll(item.pacts, pools),
      // item.powers is PowerSelection[] ({ disciplineName, powerName }), not plain names.
      powers: lookupAll((item.powers ?? []).map(p => p.powerName), pools),
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

/** Trigger a browser download of the export. */
export function downloadTtsExport(state: ArmyState, data: FactionData) {
  const payload = buildTtsExport(state, data);
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(payload.army.name || 'army').replace(/[^\w\-]+/g, '_')}-tts.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
