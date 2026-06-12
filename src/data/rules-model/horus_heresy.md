# Rules-model digest — Horus Heresy Space Marine Supplement

> Validated against the user's canonical sources. Never filled from training memory.
> **This is a SUPPLEMENT / injectable catalog, NOT a faction** — see [[project-hh-supplement-source]].
> It is unlocked from a host army (Space Marines OR Chaos Space Marines), not built standalone.
> Companion to [[chaos_space_marines]] (§5a "Legion" archetype) and the cross-faction `_engine.md`.

**Sources read to build this digest** (all on disk, 2026-06-03):
- `Informacion/core_rules_text.txt` (v1.252 / Balance 5.03) + `Informacion/missions_text.txt` — for
  weapon abilities / special rules / the 25% Troops AOP limitation.
- `data/source/Horus Heresy Space Marine Supplement/Index.html` — roster (slot→units) + the host-codex
  note — read from disk.
- `data/source/Horus Heresy Space Marine Supplement/Armory.html` — 4 selectable weapons + 8 equipment;
  the **ᵀ terminator-gating rule** (stated twice); columns POINTS / POINTS CHARACTER MODELS — read.
- `data/source/Horus Heresy Space Marine Supplement/` — 12 unit datasheets.
- Production `data/parsed/horus_heresy.json` (canonical).

**Roster (Index):** 12 units, **no HQ**. Troops ×3 (Legion Breacher / Tactical / Tactical Support);
Elite ×3 (Legion Contemptor Dreadnought / Legion Terminator Cataphractii Squad / Palatine Blade
Squad); Fast Attack ×1 (Legion Sky-hunter Squadron); Heavy Support ×5 (Kakophoni Squad / Kharybdis
Assault Claw / Legion Heavy Support Squad / Legion Leviathan Dreadnought / Legion Sicaran Battle
Tank). No Transports / Fortifications / Flyers entries.

**Host-codex note (Index row 4, verbatim):** *"The following rules can only be used in conjunction
with the Space Marines or Chaos Space Marines Codex."* → the supplement is injected by **either** SM
or CSM, not CSM-only (refines the earlier memory note).

---

## 1. Keyword vocabulary

HH gating runs on an **armour-type axis** (like CSM/SM — **unlike CD**) plus unit-type. There are
**no Marks** (this is loyalist/legion-neutral HH wargear).

- **Armour types:** **Power** (default) / **Terminator** / **Cataphractii**. The armory's central rule
  keys off "wearing **Cataphractii or Terminator** armor" → these two are treated as one
  *terminator-class* bucket for gating (§2). Cataphractii armor is itself a buyable upgrade (char-only,
  infantry-only) that grants the Cataphractii keyword + 2+/4++ + Deep strike + Massive(1) + Unyielding.
- **Unit types:** Infantry / Vehicle (Dreadnoughts, tanks, Kharybdis) / Character (squad Sergeants /
  characters with the p_char column). Movement keywords granted by armory: **Jet Bike** (Legion
  Scimitar Jetbike, infantry-only). No Monster keyword in this supplement.
- **Faction keyword: Legion.** All units are Legiones Astartes / Legion units. The host archetype that
  injects this source ("Legion") matches on it; only **HH Troops** count toward the host army's 25%
  Troops minimum (§5).
- **ᵀ superscript (armory):** marks an item as **terminator-compatible** (see §2). Not a unit keyword —
  it is a property of the *item*, consumed by the armour-axis gate.
  - ⚠️ **GLYPH COLLISION (critical for the engine).** The **same ᵀ glyph** means **Mark of Tzeentch**
    in the CD/CSM armories ([[chaos_cd_armory]] / [[rules_csm_armory]]). Here in HH it means
    **Terminator**, NOT Tzeentch. Because HH units are *injected into a CSM host* (where Tzeentch
    marks really exist via the `[mark]` group, §4/§5), the parser/engine must scope the ᵀ glyph **per
    source**: HH-armory ᵀ → armour-axis gate; CSM/CD-armory ᵀ → Mark-of-Tzeentch gate. Do not collapse
    them into one superscript lookup. (Coincidence of fate: Terminator and Tzeentch share the letter.)

## 2. Wargear gating — how to derive

ONE armory (`armory_general`), shared by every unit that has armory access. Two gate axes:

| Item / group | Requires keyword | Excludes keyword | Notes |
|---|---|---|---|
| Items **with ᵀ** (Breacher shieldᵀ, Crusade weaponᵀ, Grenade harnessᵀ) | — (any armour) | — | terminator-SAFE: the only equipment a Terminator/Cataphractii model may take |
| Items **without ᵀ** (Augury scanner, Cataphractii armor, Legion Scimitar Jetbike, Legion vexilla, Nuncio-vox + all weapons) | model **NOT** wearing Cataphractii/Terminator armour | Cataphractii, Terminator | **the central rule** (Armory rows 11 & 22, verbatim twice): *"Models wearing Cataphractii or Terminator armor can only receive equipment with ᵀ."* |
| Cataphractii armor, Legion Scimitar Jetbike | **Infantry** | non-infantry | "Only for infantry" in the item description |

**The armour gate is the inverse of a normal allow-list:** terminator-class models are *restricted*
to the ᵀ subset. So a Power-armour model sees everything; a Cataphractii/Terminator model sees only
the 3 ᵀ items. **This is the live use of the `term_compat` field** — `term_compat:true` in the JSON
== the ᵀ superscript (Breacher shield / Crusade weapon / Grenade harness all `true`; everything else
`false`). Contrast CD where `term_compat` is dead/always-false (no armour axis).

**Per-unit vs character-only (the two cost columns gate availability too):**
- `p_char` = "-" → **unit/non-character-only** (Augury scanner, Legion vexilla, Nuncio-vox).
- `p_unit` = "-" → **character-only** (Nemesis-Bolter, Cataphractii armor).
- `p_unit` = `p_char` = "-" → **not selectable**, omitted from production (Heavy bolter — present in the
  Armory HTML but unselectable; see §7).

**Source localization artifact:** the EQUIPMENT columns in `Armory.html` are headed in **German**
("PUNKTE / PUNKTE CHARAKTERMODELL") while the WEAPON columns are English ("POINTS / POINTS CHARACTER
MODELS"). Same semantics; cosmetic only (§7).

## 3. Points model

Two columns: **POINTS** (`p_unit`) and **POINTS CHARACTER MODELS** (`p_char`). Same shape as CSM —
the character profile pays the dearer column. (Note the CD column was labelled "POINTS GREATER
DEMON"; here it is "POINTS CHARACTER MODELS" — same `p_char` role.) Unit base costs are **per-model**
(squads list a Legionary cost + a dearer Sergeant cost). A "-" in either column removes that buy path
for that profile (§2).

## 5. Injection model (replaces archetypes/legacies/traits)

HH has **no archetypes / legacies / traits / marks / disciplines of its own** — in
`horus_heresy.json` `armory_marks`, `armory_legions`, `archetypes`, `legacies`, `traits`,
`disciplines`, `pacts`, `prayers`, `allied` are all **empty** (and the `daemonkin` block is the empty
parser stub). It is a pure **catalog**: weapons + equipment + 12 datasheets.

- **Unlocked by:** the host codex (SM **or** CSM) — per the Index note. On the CSM side this is the
  **"Legion" archetype** ([[chaos_space_marines]] §5a) which "grants access to everything from the HH
  SM supplement". The archetype DECLARES `grants: source HH`; the engine INJECTS this pool into the
  active army's selectable units. The same source can be referenced by multiple host factions without
  duplication.
- **Troops limitation:** only **HH Troops** count toward the host army's **25% Troops** minimum (the
  AOP Troops floor in `missions_text.txt`). HH non-Troops do not satisfy that floor.
- **UX intent (past bug):** opening the supplement must show an **ordered read/catalog view** (its
  units + armory), NOT a separate army builder. The units then become selectable inside the host army.

## 6. Engine gap-check (vs `horus_heresy.json` + shared engine)
> Completed across the slot-by-slot audit (§4a–§4d). ✅ enforced · 🟡 points-only / partial · ❌ not
> modeled. HH's defining gaps are the **host-conditional option groups** and the **ᵀ glyph collision**
> — both stem from it being an *injected* catalog rather than a standalone faction.
- **Host-conditional option groups** (every unit) — SM host → *They Shall Know No Fear* +1/model;
  CSM host → Mark of Chaos. The right group must enable based on the **host army**; the mark pricing
  reuses the CSM path ✅, but the host-gate that picks which group applies is ❌ not modeled. **The #1
  HH-specific gap.** (Vehicles carry only the CSM-mark branch, flat +10.)
- **Armour-axis ᵀ gate** — terminator-class models (Cataphractii Sqd) restricted to ᵀ items. Confirm
  the engine derives this from an armour keyword, not an ability-string match (the CSM `ki-csm-tgate-01`
  bug is exactly this gate failing). 🟡
- **ᵀ glyph collision** (§1, §7.4) — HH ᵀ=Terminator vs CD/CSM ᵀ=Tzeentch; HH injects into a CSM host
  where both live. Engine must scope the superscript per source. ❌/🟡 — verify no cross-read.
- **"Only for infantry" gates** (Cataphractii armor, Legion Scimitar Jetbike) — confirm non-infantry
  excluded. 🟡
- **Jetbike / Cataphractii type+stat mounts** — change unit-type + stats; same unmodeled primitive as
  CSM/CD (`ki-parser-02`). ❌
- **replace drop-side** (Boltgun/Flamer/Heavy-flamer/Combi-bolter swaps across nearly every squad) —
  pts ✅, the "remove the original weapon" side 🟡; **`per_n(N,K)`** (Breacher per-5, Cataphractii
  per-5) ratio not enforced 🟡; **choose-exactly-two** (Contemptor, Leviathan ×2 slots) 🟡;
  **`fixed_max(N)`** (Leviathan Hunter-killer ×3) ✅; **negative-cost swap** (Cataphractii Volkite −10)
  — confirm the engine allows cost reductions 🟡.
- **single-choice mark** (Palatine / Kakophoni = Slaanesh-only) ✅; **flat-+10 vehicle mark** ✅.
- **Palatine melee-from-armory with Slow/Unwieldy exclusion** (§4b) — ability-keyword exclusion gate,
  per-model, not captured by `has_armory_access`. ❌
- **Vehicle "vehicle equipment" with no HH vehicle armory section** (§7.6) — all 3 HS vehicles +
  Contemptor reference vehicle equipment the HH armory doesn't contain; likely the host codex's
  vehicle armory. ❌/open.
- **Source injection** — archetype-declared `grants: source HH` + 25% Troops-only counting; confirm
  the host army actually injects HH units and counts only HH Troops. ❌/🟡
- **Unselectable Heavy bolter** — present in HTML, "-"/"-" cost; correctly absent from JSON. ✅

## 4. Datasheets — stats + option-semantics
> Per-slot, cross-checked vs `horus_heresy.json` + source HTML. (§4a Troops → §4d Heavy Support.)

## 4a. Troops datasheets — stats + option-semantics (VALIDATED 2026-06-03, prod JSON canonical)

3 Troops, all **Infantry** multi-model squads (Legionary + 1 Legion Sergeant, the Sergeant is the
`champion_has_armory` model). All have **armory access via the Sergeant** ("The Legion Sergeant has
access to weapons and gear from the Armory"). No psykers, no veteran tier, no marks baked in (marks
are a *host-conditional option*, see below). Sample-validated vs HTML: Legion Tactical Squad (full
option list + abilities) ✓ — production matches except one cost (Bayonet, fixed this session, §7.1).

| Unit | type | M | WS | BS | S | T | W | I | A | Ld | Sv | Legionary pts | Sgt pts | size |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Legion Breacher Squad | Inf | 6" | 3+ | 3+ | 4 | 4 | 2 | 4 | 2 | 7/8 | 3+ | 40 | 50 | 4–19 +1 Sgt |
| Legion Tactical Squad | Inf | 6" | 3+ | 3+ | 4 | 4 | 2 | 4 | 2 | 7/8 | 3+ | 39 | 49 | 4–19 +1 Sgt |
| Legion Tactical Support Squad | Inf | 6" | 3+ | 3+ | 4 | 4 | 2 | 4 | 2 | 7/8 | 3+ | 35 | 45 | 4 +1 Sgt |

(Ld 7 Legionary / 8 Sergeant. Breacher equipped w/ Boarding shield + Boltgun; Tactical w/ Boltgun;
Tactical Support w/ Flamer — base loadouts differ.)

**Host-conditional option groups (the injection model, concrete).** Every HH Troops unit carries the
**same two leading groups**, gated on which host codex injected it:
- `[every]` **"If part of a Space Marine army → all models must receive *They Shall Know No Fear*
  +1/model"** · **host-conditional `every`** — gated on host = SM. ❌ host-gate not modeled.
- `[mark]` **"If part of a Chaos Space Marine army → all models may receive a Mark of Chaos:
  Khorne/Slaanesh/Nurgle +2, Tzeentch +5 per model"** · **host-conditional `mark`** (per-model, T
  dearer — same shape as CSM/CD) — gated on host = CSM. mark pricing ✅ / the host-gate itself ❌.

This is HH-specific and the crux of the supplement: the *same datasheet* gains TSKNF under SM or a
Mark under CSM. The engine must know the **host army** to enable the right group (§6).

**Option-semantics — per unit** (literal text · primitive · status). ✅ enforced · 🟡 points-only ·
❌ not modeled.
- **Legion Breacher Squad** — `per_n` **"For every 5 models, two Legionaries may swap their Boltgun"**
  → Flamer +0 / Volkite Charger +5 / Melta +12 / Graviton gun +31 / Lascutter +53 · **`per_n(5,2)`
  swap** (replace Boltgun) · count/pts 🟡 (the per-5 ratio + drop-Boltgun side not enforced).
  Boarding shield ability baked in (Deflect/Parry/Unyielding + Unwieldy melee + Hold Your Ground).
- **Legion Tactical Squad** — `one` **"Any model with a Boltgun may take Bayonet +1 / Chain bayonet
  +3"** · choose-one melee attach · pts ✅ (Bayonet corrected 0→+1 §7.1); `one` **"All Legionary
  models may take an Astartes chainsword +5 each"** · `every`-priced-as-one (+5/model) · pts 🟡.
  Abilities: *Heart of the Legion* (5++ within 6" of objective), *Wrath of the Legion* (all weapons
  Deflagrate(5+)).
- **Legion Tactical Support Squad** — fixed 4 Legionaries + Sgt (size 4, not 4–19). `every` **"All
  models may swap their Flamer"** → Volkite charger +5 / Melta +12 / Volkite caliver +12 / Rotor
  cannon +14 / Plasma gun +17 · **`every` swap** (replace Flamer) · pts 🟡; `one` **Astartes
  chainsword +5/model** (same as Tactical) · pts 🟡.

**Troops-slot gaps:** the headline gap is the **host-conditional group gate** (SM→TSKNF vs CSM→Mark)
❌ — needs host-army awareness, a CD/CSM-absent primitive. Plus the usual **replace drop-side**
(Boltgun/Flamer swaps) and **`per_n(N,K)` ratio** (Breacher per-5) not enforced — pts ✅, structure
🟡. Mark pricing path reused from CSM ✅.

## 4b. Elites datasheets — stats + option-semantics (VALIDATED 2026-06-03, prod JSON canonical)

3 Elites: one **Vehicle** (Contemptor Dreadnought) and two **Infantry** squads. All have armory
access and `veteran_max:1` (each may gain **one Veteran ability** — verbatim on every sheet).
Sample-validated vs HTML: Legion Terminator Cataphractii Squad (all swaps incl. −10 Volkite, per-5
group, marks) ✓, Palatine Blade Squad (Slaanesh-only mark, melee-from-armory rule) ✓.

| Unit | type | M | WS | BS | S | T | W | I | A | Ld | Sv | Pts | size | vet |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Legion Contemptor Dreadnought‡ | Vehicle, Walker | 6" | 3+ | 3+ | 6 | — | — | 4 | 3 | — | — | 192 | 1–2 | 1 |
| Legion Terminator Cataphractii Squad | Inf (**Cataphractii**) | 6" | 3+ | 3+ | 4 | 4 | 2 | 4 | 2 | 8 | **2+** | 85 | 4–9 +Sgt | 1 |
| Palatine Blade Squad | Inf | 6" | **2+** | **2+** | 4 | 4 | 2 | 4 | 2 | 8 | **2+** | 45 | 4–9 +Pref | 1 |

‡ Contemptor vehicle shape (Front/Side/Rear · HP): **12/12/10 · HP3** (M6" WS3+ BS3+ S6 I4 A3).

**Host-conditional groups** (§4a) apply to the **Infantry** Elites (SM→TSKNF / CSM→Mark). The
**Contemptor (Vehicle)** has **only** the CSM `mark` group, **no SM-TSKNF** group — and its mark is
priced **flat +10 per god** (single-model vehicle pricing), unlike the +2/+5 per-model infantry mark.

**Option-semantics — per unit** (literal text · primitive · status). ✅ enforced · 🟡 points-only ·
❌ not modeled.
- **Legion Contemptor Dreadnought** — `mark` CSM-only, all gods **+10 flat** · ✅pts; `one` **"Must
  pick two weapons from this list"** (Dreadnought claw w/ Storm bolter +27 … Twin lascannon +138) ·
  **choose-TWO** primitive — count "pick exactly 2" not modeled (it's a single `one` group) 🟡; `one`
  **swap Storm bolter** → Heavy flamer +2 / Graviton blaster +5 / Plasma blaster +31 · replace 🟡;
  `one` **Cyclone missile launcher +80** · add ✅pts. Abilities: Squadron, Atomantic Shielding (5++),
  Furioso (+2A with two melee weapons). Multi-profile weapons (Conversion beamer ×3 / Cyclone missile
  launcher ×2 / Missile launcher ×2 / Plasma blaster ×2 / Plasma cannon ×2 = 11 profiles) — **FIXED
  2026-06-12**: all 11 were absent from `weapons[]` until this audit pass (§7.8), display now ✅.
  Conversion beamer's "Only for Techmarines" note (.ods header row) is not gated —
  `ki-hh-contemptor-conversionbeamer-techmarine-01`.
- **Legion Terminator Cataphractii Squad** — **the ᵀ-gate test unit:** wears **Cataphractii armor**
  (2+ save baked; abilities Deep strike / Massive(1) / Unyielding + *Cataphractii Terminator armor*
  4++) → its Sergeant's armory access is **restricted to ᵀ items only** (§2; and the ᵀ-vs-Tzeentch
  collision §1/§7.4 bites here when injected into a CSM host). Groups: host `[every]`/`[mark]`;
  `every` **swap Combi-bolter** → Volkite charger **−10** / Combi-flamer 0 / Combi-melta +10 /
  Combi-plasma +15 (note **negative cost**) · replace 🟡; `every` **swap Power sword** → Power axe 0 /
  Lightning claw +1 / Power fist +9 / Chainfist +17 · replace 🟡; `every` **swap Combi-bolter → Pair
  of lightning claws +0** (separate group) · replace 🟡; `per_n` **"for each 5 models, two may swap
  Combi-bolters"** → Heavy flamer 0 / Plasma Blaster +20 / Reaper autocannon +20 · `per_n(5,2)` 🟡.
  Veteran ×1 ✅.
- **Palatine Blade Squad** — WS/BS **2+**, Sv 2+ (elite swordsmen). Groups: host `[every]` TSKNF;
  `[mark]` **CSM = Slaanesh ONLY +2** (single-choice mark — Palatines are Slaanesh-flavoured) · ✅.
  **Special armory rule (finer gate, HTML row 15):** *"Every model got access to melee weapons from
  the Armory. May not select weapons with the 'Slow' or 'Unwieldy' rule."* → **all models** (not just
  the Prefector) buy melee from the Armory, **excluding any weapon with `Slow`/`Unwieldy`** — that's
  why the sheet lists no melee. This is an **ability-keyword exclusion gate** not captured by plain
  `has_armory_access`; flag (§7). Prefector also has full armory access. Veteran ×1. Ability: *Skill
  Unmatched* (re-roll one 1-to-hit + one 1-to-wound per model/activation).

**Elites-slot gaps:** the **ᵀ armour gate + glyph collision** (Cataphractii) ❌/🟡 is the key one;
**choose-exactly-two** (Contemptor weapons) 🟡; **negative-cost swap** (−10 Volkite — confirm engine
allows cost reductions) 🟡; **melee-from-armory with Slow/Unwieldy exclusion** (Palatine) ❌ finer
gate; per-model **veteran ability** on all three (incl. a Vehicle) ✅. Host-conditional groups as
§4a; the Vehicle skips the SM-TSKNF branch.

## 4c. Fast Attack datasheets — stats + option-semantics (VALIDATED 2026-06-03, prod JSON canonical)

1 unit. **Jet Bike** squadron (the `Legion Scimitar Jetbike` is baked into the base loadout, giving
T5/W3 + 12" move). Armory via Sergeant; **no veteran option**. Sample-validated vs HTML (mark +3/+7,
both swaps, stats) ✓.

| Unit | type | M | WS | BS | S | T | W | I | A | Ld | Sv | Pts | size |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Legion Sky-hunter Squadron | Jet Bike | 12" | 3+ | 3+ | 4 | 5 | 3 | 4 | 2 | 7/8 | 3+ | 81 | 2–8 +Sgt |

**Option-semantics** (✅ enforced · 🟡 points-only · ❌ not modeled).
- **Legion Sky-hunter Squadron** — host `[every]` SM→TSKNF; `[mark]` CSM all gods **+3 / Tzeentch +7
  per model** (jetbike pricing, dearer than infantry's +2/+5 — confirms mark cost scales per unit) ·
  ✅pts; `every` **swap Heavy bolter** → Volkite culverin +16 / Multi-melta +19 / Plasma cannon +80 ·
  replace 🟡; `every` **swap Bolt pistol** → Hand flamer +2 / Volkite serpenta +2 · replace 🟡. No
  abilities. Plasma cannon multi-profile (Standard/Overcharged) — **FIXED 2026-06-12**: both profiles
  were absent from `weapons[]` until this audit pass (§7.8), display now ✅.

**FA-slot gaps:** same `every` replace drop-side 🟡; host-conditional groups as §4a. Nothing new.

## 4d. Heavy Support datasheets — stats + option-semantics (VALIDATED 2026-06-03, prod JSON canonical)

5 units: 2 **Infantry** squads + 3 **Vehicles** (Kharybdis transport, Leviathan Walker, Sicaran tank).
None have a veteran option here. Armory via Sergeant (infantry) / vehicle-equipment (vehicles).
Sample-validated vs HTML: Leviathan (two pick-two groups + Hunter-killer + 13/13/12 HP3) ✓, Kharybdis
(transport 20 / drop pod / 12/12/12 HP3) ✓.

| Unit | type | M | WS | BS | S | T/Armour | W/HP | I | A | Ld | Sv | Pts | size |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Kakophoni Squad | Inf | 6" | 3+ | 3+ | 4 | T4 | 2 | 4 | 2 | 7/8 | 3+ | 59 (Chora) / 69 (Orch.) | 4 +Orch. |
| Legion Heavy Support Squad | Inf | 6" | 3+ | 3+ | 4 | T4 | 2 | 4 | 2 | 7/8 | 3+ | 45 | 4–9 +Sgt |
| Kharybdis Assault Claw | Vehicle | 12" | 6+ | 3+ | 6 | **12/12/12** | **HP3** | 4 | 1 | — | — | 351 | 1–1 |
| Legion Leviathan Dreadnought | Vehicle, Walker | 6" | 3+ | 3+ | 6 | **13/13/12** | **HP3** | 4 | 3 | — | — | 208 | 1–1 |
| Legion Sicaran Battle Tank | Vehicle | 12" | 6+ | 3+ | 6 | **13/12/12** | **HP3** | 4 | 1 | — | — | 305 | 1–1 |

(Vehicle armour = Front/Side/Rear. Infantry use the host-conditional groups §4a; **all three vehicles
have ONLY the CSM `mark` group at flat +10/god, no SM-TSKNF** — same as the Contemptor §4b.)

**Option-semantics — per unit** (✅ enforced · 🟡 points-only · ❌ not modeled).
- **Kakophoni Squad** — fixed 4 Chora + Orchestrator. host `[every]` TSKNF; `[mark]` CSM = **Slaanesh
  ONLY +2** (Kakophoni are Slaanesh-flavoured, like Palatine §4b) · ✅. **No weapon options** (Cacophony
  sonic weapon baked: 36" Assault 3, Deflagrate/Sunder(2)/Suppression).
- **Legion Heavy Support Squad** — host `[every]`/`[mark]` (full 4 marks +2/+5); `every` **"All models
  may swap their Heavy flamer for the same weapon"** → Heavy bolter +5 / Volkite caliver +9 /
  Autocannon +14 / Multi-melta +24 / Missile launcher +28 / Lascannon +56 / Plasma cannon +85 ·
  **`every`-same-weapon swap** (whole squad takes one identical heavy weapon) · pts 🟡, the
  "all-identical" constraint not enforced.
- **Kharybdis Assault Claw** — `mark` CSM +10 flat. **No weapon options.** Transport 20 infantry / 2
  Dreadnoughts; Anti-Grav, Deep Strike, **Drop Pod Assault** (always reserves + Deep Strike, even when
  the mission forbids it), Assault ramp, Control Jets, Melta-ram auto-hit. Armory = **"vehicle
  equipment"** (see §7.6 — HH armory has no vehicle section). Deployment-phase rules ❌ (outside engine).
- **Legion Leviathan Dreadnought** — `mark` CSM +10 flat; **TWO separate `one` "Must pick two weapons
  from this list" groups** — slot A (Grav-flux +31 … Cyclonic melta lance +141) and slot B (Heavy
  flamer +13 / Twin volkite culverin +68) · **choose-TWO ×2 arm-slots** 🟡; `fixed_max` **up to three
  Hunter-killer missiles +5 each** · **`fixed_max(3)`** add ✅pts. Atomantic Shielding 5++, Furioso.
  Armory = vehicle equipment (§7.6).
- **Legion Sicaran Battle Tank** — `mark` CSM +10 flat; `one` **sponsons**: two Heavy flamers +26 /
  two Heavy bolters +36 / two Lascannons +138 (choose-one pair) · ✅pts; `one` **Storm bolter +11** ·
  add ✅pts. Equipped Heracles autocannon. Armory = vehicle equipment (§7.6).

**HS-slot gaps:** **choose-exactly-two ×2 slots** (Leviathan) 🟡; **`fixed_max(N)`** (Hunter-killer
×3) ✅; **`every`-same-weapon** squad-wide identical heavy (Heavy Support Sqd) 🟡; **single-choice
mark** (Kakophoni Slaanesh-only) ✅; **vehicle "vehicle equipment" with no HH vehicle armory section**
(all 3 vehicles) — open (§7.6). Vehicles skip the SM-TSKNF branch (host-conditional, §4a).

## 7. Open questions / discrepancies found
1. **Heavy bolter unselectable** — listed in `Armory.html` (row 6) with "-"/"-" cost; correctly
   omitted from `horus_heresy.json`. Confirm it's intentional (it duplicates the unit-mounted Heavy
   bolter on Legion Scimitar Jetbike / Heavy Support squads).
2. **German column headers** in the EQUIPMENT block ("PUNKTE / PUNKTE CHARAKTERMODELL") — cosmetic
   source artifact; production stores them as `p_unit`/`p_char`. No data impact.
3. **Host-codex scope** — Index says SM **or** CSM. Earlier memory said CSM-only via Legion archetype;
   confirm the SM side has an equivalent unlock and whether the 25%-Troops rule applies identically.
4. **ᵀ glyph collision** (§1) — HH armory ᵀ = *Terminator-compatible*; CD/CSM armory ᵀ = *Mark of
   Tzeentch*. Same glyph, different meaning, and HH is injected into a CSM host where Tzeentch marks
   coexist. Confirm the engine scopes the superscript **per source** and never reads an HH terminator-ᵀ
   item as a Tzeentch-gated one (or vice-versa).
5. Per-unit option_groups cross-checked vs HTML — **DONE for all 12 units (§4a–§4d)**. One fact bug
   found and fixed in production: Legion Tactical Squad **Bayonet** was `points: 0` in
   `horus_heresy.json` but HTML says "+1 point" → corrected 0→1.
6. **Vehicle "vehicle equipment" with no HH vehicle armory section** — all 3 HS vehicles (Kharybdis,
   Sicaran, Leviathan) + the Contemptor reference "vehicle equipment from the Armory", but
   `Armory.html` has no vehicle section (only the 4 weapons + 8 infantry equipment). The referenced
   equipment is almost certainly the **host codex's** vehicle armory (SM or CSM), not an HH-local one.
   Confirm the engine resolves vehicle equipment against the host, not the HH supplement.
7. **German weapon names** leaking into datasheets/armory ("Laserkanone", "Quad Maschinenkanone") —
   localization artifact in the source HTML. **FIXED 2026-06-12** (§7.8): renamed to their English
   equivalents ("Lascannon", "Quad autocannon") in production, matching `weapons[]`/.ods.
8. **Multi-profile weapon audit pass (2026-06-12), .ods×production "desde 0"** — found and fixed in
   `horus_heresy.json`:
   - **31 missing multi-profile `weapons[]` entries** across 6 units, sourced row-by-row from the
     .ods weapon tables (sub-profile order preserved — Standard before Overcharged, Frag before
     Krak, Bolter before Flamer/Melta/Plasma, Short/Mid/Long range): Legion Breacher Squad (Lascutter
     ×2), Legion Tactical Support Squad (Plasma gun ×2), Legion Contemptor Dreadnought (Conversion
     beamer ×3, Cyclone missile launcher ×2, Missile launcher ×2, Plasma blaster ×2, Plasma cannon
     ×2 = 11), Legion Terminator Cataphractii Squad (Combi-flamer/melta/plasma ×7, Plasma blaster ×2,
     Power axe = 10), Legion Sky-hunter Squadron (Plasma cannon ×2), Legion Heavy Support Squad
     (Missile launcher ×2, Plasma cannon ×2).
   - **Power axe** (Cataphractii swap option) is absent from HH's own .ods weapon table — stats
     sourced via 6-faction armory consensus (CSM/SM/AdMech/Sororitas/IG/Inquisition all agree:
     melee, +2S/-2AP/D1).
   - **3 name fixes**: "Vulkite caliver"→"Volkite caliver" (Heavy Support Squad option choice),
     "Laserkanone"→"Lascannon" and "Quad Maschinenkanone"→"Quad autocannon" (item 7, above).
     Leviathan needed no new `weapons[]` entries — its "Quad autocannon" entry already matched.
   - **New known issue**: Contemptor's Conversion beamer "Only for Techmarines" note (.ods header
     row) is not repeated in OPTIONS text and not gated by the engine —
     `ki-hh-contemptor-conversionbeamer-techmarine-01`.
   - §4b/§4c corrected accordingly (Contemptor + Sky-hunter multi-profile display claims).
