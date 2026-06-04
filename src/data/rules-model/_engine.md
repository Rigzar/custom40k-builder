# Rules-model digest — ENGINE (cross-faction base)

> The shared, faction-agnostic rules the **builder app** must enforce. Validated against the
> canonical files (already complete on disk — DO NOT re-paste, READ them):
> - `Informacion/core_rules_text.txt` — Core Rules v1.252 / Balance 5.03 (confirmed complete
>   2026-06-03, runs through the Experimental "Sniper" rule).
> - `Informacion/missions_text.txt` — Missions supplement (engagement types, scoring, mission list).
>
> This digest captures only the **list-building / enforcement** layer (what the app validates).
> In-game combat resolution (to-hit/wound tables, melee, vehicle damage chart, psychic) lives in
> the canonical file and is NOT duplicated here — cite it when needed.
> See [[reference-canonical-rules]] and [[project-pipeline-migration]].

---

## 0. ENGINE DEPENDENCY MAP — what connects, what limits what (reusable across all 19 factions)
Validated with the user 2026-06-03 after exhaustive read of both base files. The **structure of
gates is identical for every faction**; only the vocabulary changes (armour keywords, marks,
disciplines, in-description restrictions). This is the skeleton the per-faction digests plug into.

**A. List-composition chain (top-down overrides):**
`Engagement type → AOP (slot min/max) + extra caps → Archetype (0-1, may relocate roles) →
Legacy (0-1) + Traits (0-2)`.
- Engagement OVERRIDES the Core base AOP — Skirmish is not "Core with fewer points": it changes
  maxima AND adds caps that **override datasheet stats** (no 2+ Sv / 4+ inv / T8 / D3 from
  equipment; no allies; no archetypes). Top-down override.
- Mono-god + Daemonkin archetypes are **mutually exclusive** with Legacy/Traits.
- Min always: ≥1 HQ, ≥2 Troops, ≥25% pts on Troops. 2nd AOP only if 1st fully filled.

**B. Mark / animosity chain (limits which units coexist):**
`Most-expensive HQ → sets army mark → blocks RIVAL marks army-wide (incl. allies)`.
- Rivals: Khorne ✗ Slaanesh, Nurgle ✗ Tzeentch. Abaddon's Chosen turns this off (faction-specific).
- Unit mark = veteran ability (general) + unlocks its mark-armory + combat effect.
- NOT limited: legion-armories have NO mark gate (only ᵀ + in-description text gates).

**C. Armour chain (wargear gate = the KEYWORD model):**
`unit armour keyword (Terminator|Cataphractii|Power|Gravis…) → gates ᵀ-marked items`.
- Armour keyword can be **DYNAMIC** (bought as equipment, e.g. CSM Cataphractii armor).
- Engine DERIVES gating by keyword match — replaces `term_compat`/`gravis_compat` flags.

**D. Shooting chain (which weapon fires under which order):**
`Order → weapon-type×order table (§5) → unit-type exceptions relax it (Bike/Walker/Vehicle/
Monstrous/Unyielding fire Heavy on Move&Shoot, etc.)`.

**E. Psychic chain (which power casts under which order):**
`Psyker keyword → list-build: pick N from General + Codex disciplines → in-game: power category
(Basic/Normal/Complex) gates by order → Skirmish cap 1 power/turn`.

**F. Allies chain (what two factions share):**
`G/Y/R matrix → G shares auras/psychic/transports; Y/R separate; R adds Ld-1 at 12"`. Allied AOP
reduced; allied units NEVER get "Objective secured!". Skirmish = no allies (override).

**Master override — FAQ #5:** Codex beats Core. Faction rules win any clash → production JSON is
canonical (carries semantics Core lacks). See [[feedback-briefing-faq5]].

**What does NOT limit (avoid over-restricting):** Traits hit only the `Chaos Space Marine`
keyword (not allied Daemons / non-keyword vehicles); legion-armories ignore marks; no
Undivided-armory exists (Undivided = progressive kill benefits, not an armory).

---

## 1. AOP varies by Engagement type (Missions supplement)
The builder does NOT have one fixed AOP. Slot maxima depend on the chosen engagement:

| Slot | Skirmish (1000-1500) | Pitched (2500-3500) | Epic (4000+) |
|---|---|---|---|
| HQ | 0-1 | 1-2 | 1-2 |
| Troops | 1-3 | 2-6 | 2-6 |
| Elite | 0-1 | 0-3 | 0-3 |
| Fast Attack | 0-1 | 0-3 | 0-3 |
| Heavy Support | 0-1 | 0-3 | 0-3 |
| Dedicated Transport | 0-1 | 0-ᵀ (1 per Infantry) | 0-ᵀ (1 per Infantry) |
| Fortification | — | 0-1 | 0-1 |
| Flyer | — | 0-2 | 0-2 |
| Lords of War | — | — | 0+ (max 33% of points) |

- **Base AOP** (Core Rules, used when no engagement override): 1-2 HQ / 2-6 Troops / 0-3 Elite /
  0-3 FA / 0-3 HS / 0-ᵀ Transports / 0-1 Fort / 0-2 Flyer.
- **Second AOP:** if a player fully uses their current AOP, they unlock a second identical AOP
  (must again meet the HQ/Troops minimums). A slot that *cannot* be filled due to restrictions
  counts as filled for second-AOP eligibility (Skirmish rule).
- **Minimums (all engagements):** ≥1 HQ, ≥2 Troops, **≥25% of points on Troops** (incl. upgrades).

## 2. Skirmish-only extra restrictions
- **No allies, no Archetypes.** One unique Armory item only.
- HQ models may not take "once per army" upgrades.
- HQ / Character ≤ 150 pts (with upgrades). No single unit > 300 pts (Troops exempt).
- "Squadron" units field one model per slot.
- **Stat & equipment caps (gained via equipment/abilities):** no 2+ armour save or better; no 4+
  inv or better; no Toughness 8+; no weapon Damage 3+; no combined armour value ≥ 34 (Front+Side+
  Rear, incl. Necron Quantum Shielding).
- Max 1 psychic power per turn (also prayers/incantations/etc.).

## 3. Allies (Core Rules — allied matrix)
Relationship from the matrix: **G** Battle Brothers / **Y** Allies of Convenience / **R** Desperate
Allies. Allies use a reduced AOP (0-1 HQ / 1-2 Troops / 0-1 each Elite/FA/HS per Troop / 0-ᵀ
Transports), may take their own Army Customisation, can't take a second AOP, and **allied units can
never use "Objective secured!"**. Self-allying = one army for "Unique"/"once per army" purposes.

- **G:** treated as friendly in all respects; auras/psychic cross over; shared transports.
- **Y / R:** separate armies; auras/psychic only on primary faction; transports primary-only.
- **R additionally:** a unit within 12" of an allied-faction unit must pass Ld test at -1 or lose
  its order that turn.
- Full 16×16 matrix lives in `core_rules_text.txt` ("Allies" section) — read it for the exact
  G/Y/R per faction pair. CSM row is relevant for [[project-pipeline-migration]] allied loaders.

## 4. "Objective secured!" — auto-rule
Automatically conferred to **every Troop selection**. Units gain/lose it if an Archetype switches
their battlefield role. Allied-detachment units never get it. (Core Rules.)

## 5. Weapon type × order compatibility (Core Rules)
Which weapon types may fire under each order — the builder/engine uses this for shooting validity:

| Type | Stand & Shoot | Move & Shoot | Advance | Charge | Fight |
|---|---|---|---|---|---|
| Assault | Y | Y | Y | Y | No |
| Grenade | Y | Y | Y | Y | Y |
| Heavy | Y | No | No | No | No |
| Melee | No | No | No | Y | Y |
| Pistol | Y | Y | Y | Y | No |
| Rapid Fire | Y | Y | No | No | No |

- Rapid Fire doubles shots at half range; only fires at half range unless under Stand & Shoot.
- Many unit types (Bike / Jet Bike / Monstrous / Walker / Vehicle / "Unyielding") relax these
  (e.g. fire Heavy on Move & Shoot). See the unit-type sections in the canonical file.

## 6. Keyword / armour-gate model (cross-faction)
The target data model is **keywords**, not pre-baked flags (`term_compat`/`gravis_compat`/
`category`). Armour-type keywords gate wargear to ᵀ-marked items. CSM uses `Terminator` +
`Cataphractii`; other factions may use `Power`/`Gravis`/etc. — validate per faction in each
`<faction>.md`. Armour type can be **dynamic** (bought as equipment — see CSM Horus Heresy
`Cataphractii armor`). See [[reference-canonical-rules]].

**SEAM SHIPPED (v0.51): `src/engine/keywords.ts`** — the single keyword-derivation point. Centralises
the ᵀ + Chaos-Mark gating that was duplicated in `ArmoryModal` (`itemRequiredMark`, `stripMarkGlyph`,
`isTerminatorArmourName`, `modelRestrictsToTermSubset`, `isItemMarkBlocked`). `ArmoryModal` now routes
through it; behaviour unchanged. v1 still DERIVES from the current encoding (name glyph + `term_compat`
flag + Cataphractii ability) — the Phase-3 migration swaps the module *internals* to read explicit
`keywords[]` arrays per faction without touching consumers. The remaining rules fixes are tracked, NOT
folded into the refactor: `ki-csm-tgate-01` (gate Crux-Terminatus / generic Terminator units + dynamic
armour) and the `category:'vehicle'` flag still being the old model.

## 7. Psychic powers — ENGINE rule (Core Rules L653-697)
Psychic mechanics ARE engine rules the builder/engine must model — not just flavour:
- **Psyker rule:** only models with "Psyker" manifest powers (vehicles use Ld 10 for Perils).
- **Power categories Basic / Normal / Complex** determine WHICH order lets you cast:
  - Basic → castable on Advance / Charge / Move&Shoot / Fight / Stand&Shoot.
  - Normal → Move&Shoot, Stand&Shoot (and Defensive Fire).
  - Complex → Stand&Shoot only.
  (Cross-check each order's "may cast … psychic powers" clause in the Command-phase section.)
- **List-building hook (builder-relevant):** powers known are listed in the unit profile; if a
  psyker is *limited* in how many it knows, **those are chosen when creating the army list.**
  Every psyker has access to the **General Psychic Disciplines** PLUS its Codex disciplines. → the
  builder must offer general + faction disciplines and enforce the "select N powers" limit.
- **Caps that interact with army-building:** max 1 power/turn under Skirmish (§2); applies equally
  to prayers/incantations/invocations.
- In-game resolution (manifest 2D6 vs cast value, dispel, Overchannel 3D6, Perils table, melee
  restrictions, duration) lives in the canonical file — cite L653-697, don't recite from memory.
- **Hymns / Invocations / Prayers (L694-697):** cannot be dispelled, once per battle round per
  unit, effects persist to next Rally if the user dies. CSM pacts/prayers map here.

## 8. Cross-references to weapon abilities / special rules (Core Rules)
Faction armory items reference Core-Rules abilities (e.g. CSM legion items use Deflagrate(x+),
Flurry(x), Soul Burn(x+), Armorbane, Rending(x+), AT(x), Master-crafted). Exact canonical sections:
- **Unit Types** (Infantry/Bike/Character/Jet Bike/Jump Pack/Monstrous/Walker/Vehicle/Flyer):
  `core_rules_text.txt` **L460-652**.
- **Special Rules / Model abilities** (Daemon 5+ inv, Greater Daemon 4+ inv, Warded, Fearless,
  Deep Strike, Infiltrator, Unyielding, Counter-Attack, Stealth, Swarm, Unique, …): **L711-894**.
- **Weapon abilities** (the full ~50 weapon keywords): **L895-1181**.
When auditing a faction's weapon/unit profiles, cite those lines rather than reciting from memory
(GOLDEN RULE). These keyword definitions are what the data model attaches to weapons/units.

## 9. FAQ #5 (load-bearing)
**Specific Codex rules override general Core Rules.** Never apply official 40k mechanics — Custom40k
is homebrew. See [[feedback-briefing-faq5]].

## 10. Option semantics — the LOGIC layer (not rules, but the engine must enforce it)
Decided 2026-06-03. There are two layers per unit option: (a) the **rule** = literal HTML text
(captured verbatim in `<faction>.md`), and (b) the **semantics** = the implicit logic of what the
option *does* to the build (swap vs add, what it excludes, what stat it rewrites). Layer (b) is
NOT written anywhere — it is obvious to a human, but the engine must model it. Define it ONCE here
as a small primitive vocabulary; during a unit audit just TAG each option with its primitive(s)
instead of re-deriving the logic per unit.

**Primitive vocabulary** (every option maps to ≥1):
| Primitive | Meaning | Current model status (CSM, verified 2026-06-03) |
|---|---|---|
| `add` | option adds wargear/ability/stat on top (additive). +N pts. | ✅ `equipMods.ts` regex parses "+X Strength/Wounds/Toughness/Attacks/Move/Init/Ld" onto bearer (skips aura phrases). |
| `replace(A→B)` | take B ⇒ remove A. The classic "May replace its X with Y". | 🟡 option group exists (`header` "May replace its Baleflamer" + `constraint:{type:"one"}` + `choices`), but the removed item A lives ONLY in the header TEXT — not a structured ref to the weapon being dropped. Engine doesn't actually remove A's profile. |
| `choose-one` | a group where exactly one (or 0-1) may be picked (mutually exclusive). | ✅ `constraint:{type:"one"}` (e.g. "May be equipped with one of the following"). |
| `fixed_max(N)` | up to N models in the unit may take it. | ✅ `constraint:{type:"fixed_max", max:N}` (e.g. Mutants "Up to three models may swap"). |
| `per_n(N,K)` | **ratio**: for each N models, K may take/swap (scales with unit size). | ✅ `constraint:{type:"per_n", per_n:N, count_per_n:K}` (verified Troops 2026-06-03: CSM 5/1, Cultists 10/1, Jakhals 8/1 & 8/2, Traitor Guard 10/1). |
| `every` | each model may individually swap/take (not capped). | ✅ `constraint:{type:"every"}` (Cultists/Mutants/Traitor Guard base-gun swaps, Tzaangors). |
| `mark` | Mark-of-Chaos selector: choose-one god, gated by Animosity, costs a vet slot. | ✅ `constraint:{type:"mark"}` (per-unit pricing in `choices`). Locked-mark units OMIT the group + carry `locked_mark`. |
| `single-slot` | only ONE keyword of a class may be active; selecting one excludes the others. | 🟡 v0.50: BOUGHT armour single-slotted. Items carry `armourKeyword` (`Terminator`/`Cataphractii`); `equipMods` applies only the most-protective armour's profile (no stacking of +stats/saves), and a validator flags 2 armours on one model. Remaining: innate-armour override (a Terminator datasheet that buys Cataphractii still double-adds +1T/+1A) — needs unit-level innate `armourKeyword` (ki-csm-armourslot-01). |
| `stat-override` | the option REWRITES a datasheet stat (not additive): armour→Sv/inv; wings→+Move & change unit type. | 🟡 `equipMods` infers Sv/inv from description by regex and takes the lowest (best) — works for display but is text-driven and doesn't truly "replace" (interacts badly with `single-slot`). |
| `gated` | option only available if a condition holds (keyword / mark / character type / "Warpsmith-only"). | 🟡 partial: `locked_mark`, `veteran_max`, `is_psyker`/keyword flags + in-text gates exist, but free-text gates ("Only for Dark Apostles") aren't structured. |

**The "weird logic" the user flagged = combinations of the above**, defined once, never per-unit:
- *Terminator armour example* = `single-slot` (excludes other armour keywords) + `stat-override`
  (its Sv/inv profile replaces the datasheet's). Ties to chain **C** (armour = dynamic keyword).
- *Wings / jump pack* = `stat-override` (+Move) + unit-type change (Infantry→Jump pack infantry).
- *"replace X with Y"* = `replace` — must structurally link the dropped item, not infer from header.

**Audit protocol going forward:** for each unit option capture `{literal text, primitive(s), cost,
effect, gate}`. If the text is **ambiguous** (replace vs add unclear, or two options interact in a
non-obvious way), STOP and ask the user — never guess (cheap to ask, expensive to get a datum
wrong). See [[feedback-precise-and-optimal]] and [[feedback-user-can-help]].

**GAP SUMMARY (what to build in ENGINE phase):** `single-slot` (armour exclusivity) PARTLY built
v0.50 — bought armours no longer stack (keyword-driven), validator flags 2 armours; still missing is
the innate-armour override (ki-csm-armourslot-01). Remaining big primitives: a structured `replace`
(link the dropped weapon); `stat-override` needs to
graduate from regex-on-description to a structured field, AND choices must LINK to their effect text
(Troops case: Mutants "Bloated/Burly" choices are priced but the stat effect lives in free-text
`abilities[]` — engine must map choice-name → ability → equipMods). Also still text-only: **cross-unit
list-composition caps** (chain A — e.g. Poxwalkers ≤ Plague Marine units; "per 5 → 1 Torment" /
"per 10 → 1 Ogryn" 2nd-profile ratios). Already in the data model: `add`/`choose-one`/`fixed_max`/
`per_n`/`every`/`mark` (constraint vocabulary is richer than first thought — verified on Troops
2026-06-03). This gap map is reused for every faction. See [[project-pipeline-migration]].

### VERIFIED ENGINE IMPLEMENTATION MAP (2026-06-03, read from code — not memory)
Full read of `src/engine/*` over the linked scope CSM + Chaos Daemons + HH supplement. Each
primitive/chain tagged 🟢 clean · 🟡 partial-or-patched · 🔴 missing · ⚪ N/A by design, with the
exact code site. This is the per-primitive build-status the user asked for ("esto ya está, esto es
parche, esto falta y por qué").

**Primitives:**
- `add` 🟢 — `equipMods.ts:10-18` (regex stat map), `:48-52` applies deltas & skips auras (`:21`);
  cost `points.ts:71-85`. Faction-agnostic; same for CSM/CD/HH.
- `choose-one` 🟡 — type `'one'` (`data.ts:33`); cost/resolve handle it, but **no validator enforces
  "exactly one"** — exclusivity is UI-only (radio). Only `required` groups are checked
  (`validators.ts:166-179`).
- `fixed_max(N)` 🟢 — validated `validators.ts:718-728`.
- `per_n(N,K)` 🟢 — validated `validators.ts:705-717`.
- `every` 🟢 — type `'every'`; per-qty cost `points.ts:75-82`; no cap needed.
- `mark` 🟢 (richest) — resolve `resolver.ts:90-100`; cost `points.ts:50-69`; injection
  `resolver-csm.ts:45-112` / `resolver-chaos-daemons.ts:41-84`; animosity `validators.ts:777-797`;
  vet-slot `resolver.ts:99-100`; Black Crusade (4 marks) own branch in cost + injection.
- `single-slot` (armour) 🟡 — BOUGHT only: `equipMods.ts:36-43` applies only most-protective profile;
  2-armour validator `validators.ts:184-195`. `armourKeyword` is on `ArmoryItem` (`data.ts:104`) but
  **NOT on `Unit`** → innate-armour override still missing (ki-csm-armourslot-01).
- `stat-override` 🟡 — TWO mechanisms: (a) regex on desc `equipMods.ts:24-28` + `:54-57` (fragile,
  text-driven, collides with single-slot); (b) full-profile swap via `variant_models` (clean, but
  only for named variants e.g. Ascended DP). No structured stat-override field.
- `gated` 🟡 — locked_mark, `veteran_max`, `(X only)` choice gate `validators.ts:455-473`, "no Mark
  of Khorne" header gate `:475-491`, archetype gates `:198-353`, psyker `resolver.ts:113-119`. Many
  via regex-on-text (patch). Armory ᵀ-gate still on old `term_compat`/`category` flags, not keyword
  (ki-csm-tgate-01). Free-text gates ("Warpsmith-only") unstructured.
- `replace(A→B)` 🔴 — **not modelled.** `ConstraintType` has no `replace`; "May replace X with Y"
  uses a `one` group with dropped item A living only in header TEXT. No code removes A's profile (you
  pay for Y, X still shows). Real weapon swaps exist only by ARCHETYPE (`weapons/csm.ts:51`,
  `applyVehicleWeaponOverrides`), never by option selection. **Biggest engine gap.**

**Dependency chains (§0):** A (composition) 🟢 `validators.ts:626-748` + `:38-51` 2nd-AOP + `:800`
trait cap + `:356-361` noLegacy/noTraits + `:530` 2nd-legacy; B (mark/animosity) 🟢 `:53-58`,
`:777-797`, `:294-309` Abaddon exception; C (armour keyword) 🟡 single-slot partial + ᵀ-gate not
keyword-derived (ki-csm-tgate-01); D (shooting weapon×order) ⚪ in-game, builder doesn't validate;
E (psychic) 🟡 psyker flags resolved but "pick N powers from General+Codex" NOT enforced, cast-order
in-game; F (allies) 🟢 list-build AOP `:750-775`, skirmish-no-allies `:850` (G/Y/R Ld-1/Obj-secured
are in-game).

**Per-faction engine coverage:** CSM 🟢 fullest resolver (`resolver-csm.ts`: per-type mark injection,
Favored, vehicle weapon overrides, Plaguehost, combi-surcharge, Black Crusade). CD 🟢 `cdResolve`
(Favored, Ascended DP HS→HQ, mark injection, 4 archetype notes) + own slot math Entourage/Herald/
Bound Beast `validators.ts:69-135`. HH 🟡 = injectable catalog, **no own resolver** — units load via
the CSM resolver; dynamic Cataphractii applies.

**Ranked remaining ENGINE work (by impact):** 1) 🔴 structured `replace` (remove dropped profile);
2) 🟡 innate `single-slot` = `Unit.armourKeyword` (ki-csm-armourslot-01); 3) 🟡 structured
`stat-override` field (fixes single-slot collision); 4) 🟡 keyword-derived ᵀ-gate (ki-csm-tgate-01);
5) 🟡 `choose-one` validator; 6) 🟡 enforce psychic "pick N powers". Assume-enforced (solid): `add`,
`fixed_max`, `per_n`, `every`, `mark`, AOP/slots, animosity, allies, CD slot math.
