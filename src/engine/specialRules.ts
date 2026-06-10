import { RULES, normaliseKey } from '../data/coreRules';

/**
 * Structured Special-Rules / Unit-Type query layer (pilot — 2026-06-07, "si arranca asi").
 *
 * `coreRules.ts` is the DISPLAY glossary: { name, description } with {X} placeholder
 * substitution, consumed by parseAbility() for UI/print rendering. It stays exactly as-is —
 * the source of truth for *display text*.
 *
 * This module is the QUERY layer the engine actually needs: "does this unit have Deep
 * Strike?", "what's its Rending value?", "is this a valid Anti-Air target?". It turns raw
 * `abilities[]` / `weapon.abilities` strings into structured `{ key, param }` data the
 * engine can reason about, instead of re-parsing display text or hand-rolled substring
 * matching (see resolver.ts `_norm`/`_baseAbilNorm` — exactly the kind of ad-hoc matching
 * this layer is meant to replace once it proves out).
 *
 * The key vocabulary is DERIVED from coreRules.ts RULES at runtime — NOT duplicated as a
 * hand-typed union. Same "ground in canonical files, don't decide from memory" principle
 * applied to the glossary itself: RULES is already grounded in Custom40k Core Rules.txt, so
 * deriving from it keeps both layers permanently in sync (one source of truth, ~120 entries
 * that would otherwise need manual mirroring and would drift).
 *
 * ── Pilot scope (user-approved 2026-06-07) ──────────────────────────────────────────────
 *
 * (a) Jump Pack Infantry -> intrinsically grants "Deep Strike"
 *     Core Rules L714-718: "Jump Pack Infantry — Acts like Infantry, with the following
 *     exceptions: * Movement — Ignores terrain and vertical movement costs. * Gains the
 *     'Deep Strike' special rule."
 *     Today CSM jump-pack options restate this by hand on every datasheet/option
 *     (`adds_unit_types: ['Jump Pack Infantry'], grants_abilities: ['Deep Strike']` —
 *     see changelog "Jump Pack wiring... adds_unit_types Jump Pack Infantry + grants_abilities
 *     Deep Strike"). That's error-prone — easy to add the type and forget the grant on a
 *     future unit/faction. `intrinsicAbilitiesForUnitType` encodes the TYPE -> ABILITY
 *     relationship once, grounded in the canonical text, so the engine can derive it instead
 *     of trusting every data entry to restate it. ("Ignores terrain and vertical movement
 *     costs" is a movement/battle-resolution detail the list-builder doesn't simulate — 🔴
 *     left as descriptive text only, same class as other battle-only mini-rules.)
 *
 * (b) Anti-Air target group
 *     Core Rules L1330-1331: "Anti-Air — Attacks made with this weapon against models with
 *     the Anti-Grav, Jet Bike, or Jump Pack special rules or the Flyer unit type gain +1 to
 *     hit rolls and +1 Strength."
 *     A cross-reference that mixes model ABILITIES (Anti-Grav, Jump pack — Core L1141,
 *     armory-granted "Jump pack" rule, distinct from the "Jump Pack Infantry" TYPE) and UNIT
 *     TYPES (Jet Bike — Core L701, Flyer). `isAntiAirTarget` proves the model can express a
 *     "group" that spans both vocabularies uniformly — exactly the shape the user pointed at
 *     ("muchas habilidades... modifican weapon/model abilities... noseria bueno tenerlas asi
 *     para cuando se necesiten llamar??").
 *
 * Scale-up: once these two prove out cleanly, the same { key, param } parse + intrinsic-
 * grant-map pattern extends to the rest of the glossary ON DEMAND — when an engine feature
 * actually needs to query a rule — not as a big-bang rewrite of all ~120 entries.
 */

export interface ParsedRule {
  /** Canonical lowercase glossary key, e.g. 'rending', 'deep strike', 'anti-air'. */
  key: string;
  /** Extracted parameter, e.g. '4+' from "Rending(4+)", '-2' from "Terrifying(-2)". */
  param: string | null;
  /** Original token, kept for fallback display / debugging. */
  raw: string;
}

/**
 * Parse one raw ability token into a structured rule — but ONLY if it matches a known
 * glossary entry (validated against coreRules.ts RULES, the canonical vocabulary). Returns
 * null for custom/non-glossary text (datasheet-specific abilities written as "Name:
 * description"), which callers should keep treating as opaque display text — same split as
 * parseAbility's `isCustom` branch.
 */
export function parseRuleToken(raw: string): ParsedRule | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const { key, param } = normaliseKey(trimmed);
  if (!Object.prototype.hasOwnProperty.call(RULES, key)) return null;
  return { key, param, raw: trimmed };
}

/**
 * Parse a raw abilities source — `unit.abilities` (string[]) or `weapon.abilities`
 * (comma-separated string) — into structured rules, silently dropping custom/unrecognised
 * tokens (they have no glossary key to query by; they remain display-only).
 */
export function parseRuleList(source: string[] | string | undefined | null): ParsedRule[] {
  if (!source) return [];
  const tokens = Array.isArray(source)
    ? source.flatMap(s => s.split(/[,;]/))
    : source.split(/[,;]/);
  const out: ParsedRule[] = [];
  for (const t of tokens) {
    const parsed = parseRuleToken(t);
    if (parsed) out.push(parsed);
  }
  return out;
}

/** Does this abilities source contain the given glossary rule (by canonical key)? */
export function hasRule(source: string[] | string | undefined | null, key: string): boolean {
  const target = key.trim().toLowerCase();
  return parseRuleList(source).some(r => r.key === target);
}

/** The parameter of the given glossary rule if present, e.g. getRuleParam(unit.abilities, 'rending') -> '4+'. */
export function getRuleParam(source: string[] | string | undefined | null, key: string): string | null {
  const target = key.trim().toLowerCase();
  const found = parseRuleList(source).find(r => r.key === target);
  return found ? found.param : null;
}

// ── Pilot (a): Unit-Type -> intrinsic abilities ───────────────────────────────────────────

/**
 * Abilities a unit TYPE grants intrinsically per Core Rules (not per-datasheet wording).
 * Keyed by the canonical type label exactly as stored in `unit.unit_type` /
 * `OptionEffect.set_unit_type` / `adds_unit_types` (Core-Rules title case — see
 * changelog "unit-type labels now use canonical Core-Rules title case").
 *
 * Only types whose intrinsic grant is a QUERYABLE special rule (glossary key) are listed —
 * "ignores terrain and vertical movement costs" etc. are battle-resolution mini-rules the
 * list-builder doesn't model (🔴), so they stay as descriptive text in coreRules.ts only.
 */
const UNIT_TYPE_INTRINSIC_ABILITIES: Record<string, string[]> = {
  // Core Rules L714-718: "Gains the 'Deep Strike' special rule."
  'Jump Pack Infantry': ['Deep Strike'],
};

/**
 * Abilities the given unit TYPE grants intrinsically (canonical display strings, ready to
 * merge into an abilities list — same shape as `OptionEffect.grants_abilities`).
 * Returns [] for types with no codeable intrinsic grant.
 */
export function intrinsicAbilitiesForUnitType(unitType: string | null | undefined): string[] {
  if (!unitType) return [];
  return UNIT_TYPE_INTRINSIC_ABILITIES[unitType.trim()] ?? [];
}

// ── Pilot (b): Anti-Air target group ──────────────────────────────────────────────────────

/**
 * Model special rules that make a unit a valid Anti-Air target (Core Rules L1330-1331).
 * Lowercase glossary keys — matched via hasRule (validated against coreRules.ts RULES).
 *
 * GAP (found while grounding this pilot, not invented): 'anti-grav' has a glossary entry
 * (Core L1141 — "ignores terrain, units, and vertical movement costs"), but 'jump pack' the
 * standalone special rule (referenced at Core L551 "...if they have the Anti-Grav or Jump
 * pack ability" and L1331 here, and granted by the GK Teleporter per the v0.51 changelog —
 * "+6\" Movement and the 'Jump pack' ability") has NO definition/description in the Core
 * Rules text available, so it has no RULES entry to validate against (distinct from "Jump
 * Pack Infantry" the unit TYPE, which IS defined at L714-718). Kept in this list — hasRule
 * will correctly return false until a glossary entry exists, rather than guess its
 * description. Needs the user to confirm/paste the canonical "Jump pack" rule text (likely
 * Codex-level) before coreRules.ts can gain that entry — flagged, not invented.
 */
const ANTI_AIR_TARGET_ABILITY_KEYS = ['anti-grav', 'jump pack'];

/**
 * Unit TYPES that make a unit a valid Anti-Air target (Core Rules L1330-1331).
 * Canonical Core-Rules title-case labels, matched against `unit_type` (and any
 * `adds_unit_types` / resolved `set_unit_type`, per caller).
 */
const ANTI_AIR_TARGET_UNIT_TYPES = ['Jet Bike', 'Flyer'];

/**
 * Is a model with this resolved unit-type + abilities a valid Anti-Air target?
 * Cross-references a UNIT-TYPE group with a MODEL-ABILITY group — the exact mixed shape
 * the Anti-Air rule uses ("...the Anti-Grav, Jet Bike, or Jump Pack special rules or the
 * Flyer unit type"). `unitTypes` should include the model's resolved type plus any
 * additive types (adds_unit_types) — callers decide how those are combined.
 */
export function isAntiAirTarget(unitTypes: string[], abilities: string[] | string | undefined): boolean {
  const norm = unitTypes.map(t => t.trim().toLowerCase());
  if (ANTI_AIR_TARGET_UNIT_TYPES.some(t => norm.includes(t.toLowerCase()))) return true;
  return ANTI_AIR_TARGET_ABILITY_KEYS.some(key => hasRule(abilities, key));
}
