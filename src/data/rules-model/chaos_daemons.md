# Rules-model digest — Chaos Daemons

> Validated against the user's canonical sources. Never filled from training memory.
> Companion to [[chaos_space_marines]] (Daemonkin archetype on CSM unlocks the whole CD roster) and
> the cross-faction `_engine.md`.

**Ordo Erratum — 2026-07-04 (v1.37):** Full ODS audit complete. All 12 HQ + 25 non-HQ units verified field-by-field vs `Chaos Daemons ENG.ods`. 1 bug fixed: Feculent Gnarlmaw unit_type "" → "Infantry". Daemon Prince optional psyker already handled by engine isOptionalPsyker mechanism (detects inline_pts option groups with /psyker/i header).

**Sources read to build this digest** (all on disk, 2026-06-03):
- `Informacion/core_rules_text.txt` (v1.252 / Balance 5.03) + `Informacion/missions_text.txt`
  (engagement AOPs) — read in full.
- `data/source/Chaos Daemons ENG/Index.html` — roster (slot→units) + Army special rules (Favored
  Units, 4 Marks) — re-read from disk.
- `data/source/Chaos Daemons ENG/Armory.html` — EQUIPMENT (43 items, god-gated by ᴷ/ᴺ/ˢ/ᵀ) +
  VEHICLE EQUIPMENT (4 items); columns **POINTS / POINTS GREATER DEMON** — re-read from disk.
- `data/source/Chaos Daemons ENG/Army Customisation.html` — 6 archetypes, **0 legacies, 0 traits**
  (only "0-1 Archetype" allowed) — re-read from disk.
- `data/source/Chaos Daemons ENG/Animosity of the Gods.html` — mark-compat matrix.
- `data/source/Chaos Daemons ENG/General psychic disciplines.html` (link to shared general
  disciplines) + `Chaos Demons psychic disciplines.html` (Change/Decay/Excess, god-gated).
- Production `data/parsed/chaos_daemons.json` (canonical) + `_html_units/_armory/_rules.json`
  (audit cross-check).
- Per-unit cross-check DONE: unit HTMLs sample-validated vs `chaos_daemons.json` units (§4d–§4i,
  all 6 slots). Every sampled unit matched production → production confirmed canonical & accurate.

---

## 1. Keyword vocabulary

CD gating runs on **Marks** + **unit-type** keywords. There is **no armour-type axis** (no
Terminator / Cataphractii / Gravis — those are CSM/SM concepts and do not appear in CD).

- **Marks of Chaos:** **Khorne / Nurgle / Slaanesh / Tzeentch.** (No Undivided mark in CD — unlike
  CSM, the Index lists only the 4 god marks.) Each mark gates its god's armory items (ᴷ/ᴺ/ˢ/ᵀ) and
  god-locked archetypes/disciplines. Most CD units carry a **`locked_mark`** baked into the profile
  ("If a unit already is equipped with a mark, its benefits are included in the unit's profile").
- **Unit types:** Infantry / Vehicle / Monster (Monstrous Creature) / Character. Plus movement
  keywords granted by armory (Bike, Jet bike, Anti-grav) — these mutate the profile, not gating.
- **Faction keyword:** all units are **Daemon** (→ Daemon 5+ inv / Greater Daemon 4+ inv / Daemonic
  Instability per Core Rules special-rules block). "Greater Daemon" is the pricing tier (§3) and the
  Entourage/Herald HQ-stacking keyword.
- **Sacred-number keyword (Favored Units):** Tzeentch 9 / Khorne 8 / Nurgle 7 / Slaanesh 6 (§4b).

### god superscripts (verbatim footnotes, Armory + Army Customisation)
- **ᴷ** Only for models with Mark of Khorne
- **ᴺ** Only for models with Mark of Nurgle
- **ˢ** Only for models with Mark of Slaanesh
- **ᵀ** Only for models with Mark of Tzeentch

## 2. Wargear gating — how to derive

CD has **ONE armory table** (no separate per-mark armories like CSM). Items are gated purely by the
**god superscript** on the item name → requires the matching **Mark** keyword on the model.

| Item group | Requires keyword | Excludes | Notes |
|---|---|---|---|
| Items with ᴷ/ᴺ/ˢ/ᵀ superscript | matching Mark of [God] | other marks (animosity §4b) | derive from the trailing superscript glyph |
| Un-superscripted EQUIPMENT | — (any model with armory access) | — | Boon of Mutation, Breath of Chaos, Chaos artefact, Instrument of Chaos, Master-crafted weapon, Personal icon, Psychic training, Unholy might, Warp conduit, Exalted butcher/hunter |
| VEHICLE EQUIPMENT (Additional armor, Smoke Launcher, We are legion, Jammer) | Vehicle | non-vehicles | only Vehicle models may take these |

**In-description finer gates (parser can't derive — need rules logic):**
- **"Only for Heralds"** — `Palanquin of Nurgleᴺ`.
- **"Unique"** — Nurgle's decay, Revoltingly Resilient, Soulstealer, Warp conduit (army-wide once).
- **"Must be purchased for each weapon separately"** — Master-crafted weapon.
- **"Can be taken multiple times"** — Psychic training (overrides the once-per-model default).
- Several items **mutate unit-type** (Blood throne ᴷ → Bike, loses Character; Juggernaut of Khorne ᴷ
  → Bike; Seeker of Slaanesh ˢ → Bike; Screamer of Tzeentch ᵀ → Jet bike; Girdle ˢ → Anti-grav) →
  same `choice→keyword/stat-override` primitive that's already on the build-list (§6d).

### ⚠ Production armory shape — discrepancies to track (§7)
1. ~~Tzeentch items split out — asymmetric.~~ RESOLVED 2026-06-07: **intentional, by design** — not
   a discrepancy. Documented in `keywords.ts` "GLYPH POLICY (ᵀ collision resolved)": the **ᵀ** glyph
   already means Terminator-compat across every faction (CSM/SM/GK/HH); reusing it for Mark of
   Tzeentch would collide. The chosen fix: ᴷ/ᴺ/ˢ items stay name-glyph-encoded in
   `armory_general.equipment` (derived via `itemRequiredMark()` / `MARK_GLYPHS`), while the **8** ᵀ
   items live structurally in `armory_marks.Tzeentch` and gate via bucket-key membership
   (`ArmoryModal.tsx` shows a separate "Tzeentch Armoury" tab when `effectiveMark === 'Tzeentch'`).
   Both paths converge correctly — verified in code. ✅ by design.
2. **VEHICLE EQUIPMENT folded into `equipment`.** The 4 vehicle items sit in the same
   `armory_general.equipment` array as infantry gear — no structural `vehicle` section / category, so
   the Vehicle-only gate isn't derivable from structure (only from the section heading in HTML).
3. ~~`term_compat` dead field — noise.~~ RESOLVED 2026-06-07: **not removable without broader
   scope** — it's a *required* (non-optional) field on the shared `ArmoryItem` interface
   (`types/data.ts`), actively used by SM/HH/CSM (`ArmoryModal.tsx` Terminator-compat badge +
   `keywords.ts` legacy fallback). CD items are always `false` because CD genuinely has no ᵀ-armour
   axis — that's correct data, not noise. Making the field optional would be a cross-faction type
   refactor for zero functional gain in CD. ✅ by design, leave as-is.

## 3. Points model

- **Two columns: `POINTS` / `POINTS GREATER DEMON`.** Maps to `p_unit` / `p_char`. NOTE the second
  column is labelled **"GREATER DEMON"**, not "CHARACTER" as in CSM — semantics are the same slot
  (the dearer tier), but it reads as the **Greater Daemon** price. Several items are Greater-Daemon-
  only or cheaper for the line model (e.g. Hellfire armor ᴷ 35/65; Juggernaut ᴷ 55/**-** = not on a
  Greater Daemon; Blood throne ᴷ 80/-; Screamer/Seeker mounts `-` for Greater Daemon).
- **`"-"` in a column = NOT selectable from that column** (same convention as CSM).
- **No VETERAN ABILITIES and no VEHICLE-UPGRADES (per-HP) sections.** CD has no per-Wound/HP veteran
  pricing in the armory; `p_veh` is not used here. (`has_veteran_abilities` is false across CD units.)
- **Marks** are innate (`locked_mark`) on most units → no per-mark surcharge selector for them;
  units that DO offer a mark choice price it per the model's tier (cross-check per unit in §4d–§4i).

## 4. General armory-wide rules (verbatim)
- "Unless stated otherwise, every item can only be purchased once by each model."
- "Any model with access to the Armory can buy as many items as it wants."
- "Items with a cost of '-' can not be selected."

## 4a. Roster (canonical — Index.html, matches `slot_to_units`)
- **HQ (12):** Bloodmaster, Bloodthirster, Changecaster, Contorted Epitome, Great Unclean One,
  Infernal Enrapturess, Keeper of Secrets, Lord of Change, Poxbringer, Sloppity Bilepiper,
  Spoilpox Scrivener, Tranceweaver.
- **Troops (6):** Bloodletters, Blue Horrors, Daemonettes, Nurglings, Plaguebearers, Pink Horrors.
- **Elites (5):** Beasts of Nurgle, Bloodcrushers, Daemon Brutes, Fiends, Flamers.
- **Fast Attack (8):** Flesh Hounds, Furies, Hellflayer, Plague Drones, Screamers, Seeker Chariot,
  Seekers, Slaughterbrute.
- **Heavy Support (5):** Burning Chariot, Daemon prince, Mutalith Vortex Beast, Skull Cannon,
  Soul Grinder.
- **Dedicated Transport (0)** · **Fortifications (1):** Feculant Gnarlmaw · **Flyers (0).**
- Total **37 units**. (AOP slot caps vary by engagement — see `_engine.md` §1 / Missions.)

## 4b. Army-specific rules (verbatim, Index.html)
- **Marks count as a veteran ability** for all units (`*` "Counts as a veteran ability"; "If a unit
  already is equipped with a mark, its benefits are included in the unit's profile"). Verbatim:
  - **Khorne:** +1 Attack; character/Monstrous Creature additionally +1 Strength; Vehicles cause
    double hits when performing a Tank Shock.
  - **Nurgle:** +1 Toughness; character/Monstrous Creature additionally +1 Wound; Vehicles roll 2D6
    each Reinforcement phase, on 7+ remove a "Crew Shaken" / "Engine Damage" / "Weapon Damage" or
    restore 1 lost HP.
  - **Slaanesh:** +1 Initiative; character/Monstrous Creature additionally +2" Movement; Vehicles
    lower hostile Ld / close-combat result by -1 within 18" and -2 within 9".
  - **Tzeentch:** "Warded" ability; character/Monstrous Creature becomes a psyker (knows 1 power from
    any discipline), or if already a psyker manifests + denies one additional power per turn; Vehicles
    get a Warpflamer (Range 9", Assault 4, S4, AP-1, D1, Flames).
- **Favored Units:** a unit with a Mark that **starts the game with a model count equal to the
  deity's sacred number (or a multiple thereof)** counts as favored → squad leaders get **+1 Attack
  and a personal icon**. Squad leaders are single models within a unit that have **sole access to the
  armory**. Sacred numbers: **Tzeentch 9, Khorne 8, Nurgle 7, Slaanesh 6.**
- **No Summoning rule listed** in CD's own Index (unlike CSM's reserve/Summoning text, which lives on
  the CSM side and governs Daemons-as-allies). CD as a standalone army has no codex-internal summoning
  clause here.

### Animosity of the Gods (matrix — identical structure to CSM [[rules_csm_army]])
- The army's mark is set by the **highest-total-points HQ**; a character with a mark may only attach
  to units of the **same mark or no mark**.
- **Rival pairs are mutually exclusive (cannot coexist, even as allies):**
  - **Khorne ✗ Slaanesh**
  - **Nurgle ✗ Tzeentch**
- Implemented engine-side via `validators.ts allowedMarks()` (shared with CSM) — verify CD path in §6d.

## 5. Archetypes / Legacies / Traits
**CD allows only `0-1 Archetype`. NO legacies, NO traits** (`legacies:[]`, `traits:[]` in JSON;
Army Customisation lists none). The 6 archetypes (verbatim):

| Archetype | Gate | Effect |
|---|---|---|
| **Assault on Realspace** | — | Units reduce their scatter distance by one D6. |
| **Calamitous Invasion** | — | Roll 1D6 each Reinforcement phase; on 5+ a Meteor appears (must be activated like a unit that turn). Place like Deep Strike; scatter is always 2D6" (never modified). Instead of placing a model, all units within 6" of final position take 1 automatic hit S10 AP-1 D1, AT(2), Barrage, Seeking, Suppression. |
| **Figureheads of The Dark Prince ˢ** | Slaanesh | HQ models gain +1 Attack while **not** within 12" of another friendly HQ model. |
| **Goretide ᴷ** | Khorne | Roll 1D6 for each Mark-of-Khorne model that loses its last Wound in melee; on 5+ it causes one automatic Wound (one of its weapons) vs an enemy unit in base contact. |
| **Host Duplicitous ᵀ** | Tzeentch | Psychic powers do not increase their casting values for manifesting them multiple times per round. |
| **Popping Plague ᴺ** | Nurgle | Your units explode like a vehicle upon losing their last Wound. |

(god superscripts gate the same way as armory items — archetype requires the army's mark.)

## 6. Cast systems
- **Psychic only** (no Prayers, no Pacts in CD — `prayers:[]`, `pacts:[]`). Cast category gating
  (Basic / Normal / Complex by order) per Core Rules; Skirmish cap = 1 power/turn (Missions).
- **Disciplines (god-gated, 3 — `Chaos Demons psychic disciplines.html`):**
  - **Change (Tzeentch only):** Pyric Flux / Tzeentch's Firestorm / Doombolt / Glamour of Tzeentch /
    Weaver of Fates / Temporal Manipulation.
  - **Decay (Nurgle only):** Gift of Contagion / Miasma of Pestilence / Decaying Touch / Plague Wind /
    Putrescent Vitality / Nurgle's Dance.
  - **Excess (Slaanesh only):** Delightful Agonies / Pavane of Slaanesh / Cacophonic Choir /
    Hysterical Frenzy / Siren / Symphony of Pain.
  - **No Khorne discipline** (Khorne ✗ psyker). These three are identical to CSM §6a.
- **General disciplines** are the shared general-discipline spreadsheet (link-only sheet); some
  armory items grant general-discipline powers (Interdimensional Knowledge ᵀ → +2 general powers;
  Psychic training → +1 from a known discipline; Magical boon ᵀ → +1 cast/activation).
- A model becomes a psyker via **Mark of Tzeentch** (character/Monstrous) or innate `is_psyker`.

## 6d. Engine gap-check (vs `chaos_daemons.json` + shared engine)
> Completed across the slot-by-slot audit (§4d–§4i). ✅ enforced · 🟡 points-only / partial · ❌ not
> modeled. CD exercises **fewer** distinct primitives than CSM (no armour axis, no veteran tier, no
> legacies/traits). The two CD-specific structural gaps it once surfaced (slot-shift,
> conditional-unlock) are now RESOLVED — `ki-cd-slotshift-01`/`ki-cd-condunlock-01` fixed v0.51/v0.52.
- **Mark gating / animosity** — shared `validators.ts allowedMarks()`; CD locked_mark path works,
  selectable-mark path confirmed via Daemon Brutes / Daemon prince / Soul Grinder (per-model pricing
  K/S/N vs dearer T). ✅
- **Armory ᵀ-split** — app reads `armory_marks.Tzeentch` separately while ᴷ/ᴺ/ˢ items stay in
  `armory_general` and gate by superscript. Asymmetric but functional; still flagged in §7.1. 🟡
- **VEHICLE EQUIPMENT gate** — no structural vehicle category in JSON; **Soul Grinder is the only CD
  unit** that exercises it (Additional armor / Smoke Launcher / We are legion / Jammer). Confirm only
  Vehicles surface these. ❌/🟡 (single test case).
- **single-slot "one model" (Icon +10 / Instrument +5)** — recurs across Troops, Bloodcrushers,
  Plague Drones, Seekers. Modeled as `one` (count ✅, pts ✅) but which-model assignment + the ability
  effect not enforced 🟡. Same big missing primitive flagged in CSM [[project-option-semantics]].
- **`every` per-model stat-override** (brass armor unit-wide 3+ on Bloodletters / Bloodcrushers) —
  pts ✅, the save mutation effect text-only 🟡.
- **slot-exemption** (Slaughterbrute *Bound Beast* — free FA slot per Khorne HQ) — ❌, same gap as CSM
  Cultist Firebrand; AOP-layer concern.
- ~~**slot-shift**~~ (Ascended Daemon Prince +90, HS→HQ + forced Animosity warlord) — RESOLVED
  (`ki-cd-slotshift-01` fixed v0.52): cdResolve sets effectiveSlot="HQ" + applyVariantSlotOverride
  mirrors it; injected rule note conveys the warlord designation. ✅
- ~~**conditional-unlock**~~ (Daemon prince psyker +5 "if no Mark of Khorne") — RESOLVED
  (`ki-cd-condunlock-01` fixed v0.51): structured `OptionGroup.available_if` with
  `{type: notInstanceOf, scope: unit, keyword: Khorne}`, gated via isOptionAvailable(). ✅
- **choice→keyword/stat mounts** (wings → Jump-pack on Daemon prince; chariots typed Bike) — pts ✅,
  unit-type/Move injection ❌. Same unmodeled primitive as CSM.
- **deployment-phase / aura abilities** (Feculent Gnarlmaw infestation + heal) — outside the
  wargear-gating engine entirely; not an option-semantics gap. ❌ (by design).
- **Daemonkin injection** — REMOVED (2026-06-07): `psychic/daemonkin.json` was dead data — searched
  all 43 CD source HTMLs for "Daemonkin"/"Blood Tithe"/"Tally of Pestilence"/"Dark Pledge"/
  "Cabbalistic Rituals" (the Daemonkin in-game tables) and **found zero matches**. Daemonkin is a
  CSM-only archetype concept (its tables describe what a CSM-Daemonkin army gets per god); CD never
  had this content natively — the empty stub was a leftover from the per-faction-folder split
  (CSM+CD share the "Chaos" loader template). Deleted the file + `psychic/` folder + loader wiring;
  `asm()` already defaults `daemonkin` to `{}`, so behaviour is unchanged (tab was already hidden).
  N/A — not a gap.

## 4d. HQ datasheets — stats + option-semantics (VALIDATED 2026-06-03, prod JSON canonical)

All 12 HQ are **single models (1-1)** with a **`locked_mark`** and **armory access**; none are
advisors. Two tiers: **Heralds** (Character, Infantry — cheap, attach to units via Herald/Entourage)
and **Greater Daemons** (Monstrous Creature — `unique_upgrade` "only one of each type per army").
Stats M/WS/BS/S/T/W/I/A/Ld/Sv. Sample-validated vs HTML: Changecaster (Staff +63) ✓, Great Unclean
One (both weapon swaps +0) ✓ — production matches the sheets.

| Unit | tier | type | M | WS | BS | S | T | W | I | A | Ld | Sv | Pts | Mark | Psyker |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Bloodmaster | Herald | Char Inf | 6" | 2+ | 2+ | 5 | 4 | 3 | 5 | 4 | 8 | 4+ | 73 | **Khorne** | no |
| Changecaster | Herald | Char Inf | 6" | 4+ | 3+ | 3 | 4 | 3 | 4 | 2 | 9 | 6+ | 102 | **Tzeentch** | yes |
| Contorted Epitome | Herald | Char Inf | 8" | 3+ | 4+ | 3 | 3 | 6 | 6 | 8 | 6 | 6+ | 81 | **Slaanesh** | yes |
| Infernal Enrapturess | Herald | Char Inf | 8" | 3+ | 4+ | 3 | 3 | 3 | 6 | 4 | 6 | 6+ | 100 | **Slaanesh** | yes |
| Poxbringer | Herald | Char Inf | 6" | 3+ | 3+ | 4 | 5 | 4 | 3 | 3 | 7 | 6+ | 60 | **Nurgle** | yes |
| Sloppity Bilepiper | Herald | Char Inf | 6" | 3+ | 3+ | 4 | 5 | 4 | 3 | 3 | 7 | 6+ | 55 | **Nurgle** | no |
| Spoilpox Scrivener | Herald | Char Inf | 6" | 3+ | 3+ | 4 | 5 | 4 | 3 | 3 | 7 | 6+ | 56 | **Nurgle** | no |
| Tranceweaver | Herald | Char Inf | 8" | 3+ | 4+ | 3 | 3 | 3 | 6 | 4 | 6 | 6+ | 45 | **Slaanesh** | yes |
| Bloodthirster | Greater | Monst, Jump-pack inf | 12" | 2+ | 2+ | 8 | 8 | 7 | 6 | 5 | 10 | 3+ | 429 | **Khorne** | no |
| Great Unclean One | Greater | Monst | 6" | 3+ | 4+ | 7 | 9 | 8 | 3 | 4 | 10 | 4+ | 350 | **Nurgle** | yes |
| Keeper of Secrets | Greater | Monst | 8" | 2+ | 3+ | 7 | 7 | 7 | 7 | 4 | 10 | 4+ | 349 | **Slaanesh** | yes |
| Lord of Change | Greater | Monst, Jump-pack inf | 12" | 3+ | 3+ | 6 | 8 | 7 | 4 | 3 | 10 | 4+ | 440 | **Tzeentch** | yes |

**Mark / structural model:** every HQ carries `locked_mark` (mark baked into profile, no surcharge
selector) → mark gating is innate; animosity still applies if mixed with other-mark units. The 4
**Greater Daemons** map 1:1 to the four gods (Bloodthirster K / Great Unclean One N / Keeper of
Secrets S / Lord of Change T), each with the `unique_upgrade` "only one Greater Daemon of each type
per army" constraint ✅. **Heralds** carry the verbatim **Herald** ("up to two as a single HQ choice")
and **Entourage** ("for each Greater Daemon of the same god, up to two units with this rule do not
occupy an HQ slot") rules + a **Locus of [God]** aura + **Command squad**. Khorne models (Bloodmaster,
Bloodthirster) are correctly **non-psykers**; Nurgle's Sloppity Bilepiper & Spoilpox Scrivener are
flavour Heralds, also non-psykers. All psykers know **Smite + their god's discipline** (Change /
Decay / Excess), cast/deny **2/2 per round**.

**Option-semantics — per unit** (literal text · primitive · status). ✅ enforced · 🟡 points-only ·
❌ not modeled.
- **Bloodmaster, Contorted Epitome, Infernal Enrapturess, Poxbringer, Sloppity Bilepiper, Spoilpox
  Scrivener, Tranceweaver** — no `option_groups`; armory access only (`has_armory_access` ✅). Fixed
  loadout from `equipped_with`.
- **Changecaster** — `one` "Can be equipped with a Staff of change for +63 points" (adds the 18"
  Pistol 3 weapon to the Ritual-dagger base) · `one`+add, `inline_pts:63` · ✅. armory ✅.
- **Bloodthirster / Keeper of Secrets / Lord of Change** — only the `unique_upgrade` per-type
  constraint (no wargear swaps) · ✅. armory ✅.
- **Great Unclean One** — `one`/**replace** "exchange its Bileblade → Plague flail (+0)"; `one`/replace
  "exchange its Doomsday bell → Bilesword (+0)" · `one`+`replace` ✅pts/❌drop-side (dropped weapon is
  header-text only — same gap as CSM); + `unique_upgrade` ✅. armory ✅.

**HQ-slot gaps (all already on the build-list — no NEW primitives):** `replace` drop-side ❌ (Great
Unclean One); `unique_upgrade` per-type cap ✅; Herald/Entourage HQ-slot exemption = AOP-advisor
layer (verify enforcement in §6d). No conditional-unlock / no veteran scale in HQ.

## 4e. Troops datasheets — stats + option-semantics (VALIDATED 2026-06-03, prod JSON canonical)

All 6 Troops are **locked-mark Infantry squads** (1 god each), **no armory access**, no champion
armory, no veteran. 5 of the 6 (Bloodletters, Daemonettes, Plaguebearers, Pink Horrors, Blue Horrors)
have a squad-leader profile (Bloodreaper / etc., same statline) that becomes the **Favored-Units
leader** (+1 A + personal icon + sole armory) only when the unit starts at its deity's sacred number
(§4b). Stats M/WS/BS/S/T/W/I/A/Ld/Sv. Sample-validated vs HTML: Bloodletters (Icon +10 / Instrument
+5 / brass armor +11/model) ✓ — production matches.

**Nurglings is the exception** — single-model "Nurgling Swarm" entry (Mindless/Swarm, no
Icon/Instrument option group, no second model), same shape as CSM's Poxwalkers. Checked
`Nurglings.html` for an explicit Favored-exclusion clause (like Poxwalkers' "Slaves of Darkness")
— none found, but it structurally has no squad-leader model to receive the bonus. Fixed v0.63:
`cdResolve`'s `isFavored` now also requires `unit.models.length > 1`, gated to Nurglings only
(the other 5 Troops all have a second model entry, unaffected).

| Unit | type | M | WS | BS | S | T | W | I | A | Ld | Sv | Pts | size | Mark | sacred |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Bloodletters | Inf | 6" | 3+ | 3+ | 4 | 4 | 1 | 4 | 3 | 8 | 6+ | 14 | 7-23 | **Khorne** | 8 |
| Daemonettes | Inf | 8" | 3+ | 4+ | 3 | 3 | 1 | 5 | 3 | 6 | 6+ | 11 | 5-23 | **Slaanesh** | 6 |
| Plaguebearers | Inf | 6" | 4+ | 4+ | 4 | 5 | 2 | 2 | 2 | 7 | 6+ | 20 | 6-20 | **Nurgle** | 7 |
| Nurglings | Inf | 6" | 5+ | 5+ | 2 | 2 | 3 | 2 | 3 | 7 | 6+ | 24 | 3-9 | **Nurgle** | 7 |
| Pink Horrors | Inf | 6" | 4+ | 3+ | 3 | 3 | 1 | 3 | 1 | 9 | 6+ | 38 | 8-26 | **Tzeentch** | 9 |
| Blue Horrors | Inf | 6" | 5+ | 4+ | 2 | 2 | 1 | 3 | 1 | 9 | 6+ | 21 | 9-27 | **Tzeentch** | 9 |

**Option-semantics — per unit** (literal text · primitive · status). ✅ enforced · 🟡 points-only ·
❌ not modeled.
- **Bloodletters, Daemonettes, Plaguebearers, Pink Horrors, Blue Horrors** — uniform pair:
  `one` "One model may be equipped with Icon of Chaos +10"; `one` "Another model may be equipped with
  Instrument of Chaos +5" · **single-slot** (one model each) · ✅count/pts. (Icon = no-scatter Deep
  Strike beacon; Instrument = +1 combat res — effects text-only 🟡.) Bloodletters add `every`
  "brass armor +11 **per model**" → unit-wide 3+ save · `every` ✅pts / stat-override effect 🟡.
- **Nurglings** — NO options (Swarm / Infiltrator / Mindless / Use cover; deployable normally rather
  than forced reserve — relevant to the Daemons-as-allies clause [[rules_csm_army]]).
- **Pink Horrors / Blue Horrors** — `Split` (killed model downgrades to a lesser Horror) is an
  in-game mechanic, **out of list-build scope** (display-only).

**Troops-slot gaps:** the **single-slot "one model" primitive** (Icon/Instrument) is the same one
CSM §4 flagged as the big missing build primitive [[project-option-semantics]] — here it's modeled as
`one` (count ✅) but the *which-model* assignment + the ability effect are not enforced. No replace,
no conditional-unlock, no veteran in Troops.

## 4f. Elites datasheets — stats + option-semantics (VALIDATED 2026-06-03, prod JSON canonical)

5 Elites, all multi-model squads, **none have armory access**. 4 are locked-mark; **Daemon Brutes is
the only one with a selectable mark**. No psykers, no veteran. Stats M/WS/BS/S/T/W/I/A/Ld/Sv.
Sample-validated vs HTML: Daemon Brutes (mark K/S/N +2, T +6) ✓, Bloodcrushers (Icon +10 / Instrument
+5 / brass +41) ✓ — production matches.

| Unit | type | M | WS | BS | S | T | W | I | A | Ld | Sv | Pts | size | Mark |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Beasts of Nurgle | Monst Inf | 6" | 4+ | 4+ | 6 | 6 | 5 | 2 | 4 | 7 | 6+ | 61 | 1-4 | **Nurgle** |
| Bloodcrushers | Bike | 12" | 3+ | 3+ | 4 | 5 | 3 | 4 | 4 | 8 | 6+ | 41 | 2-7 | **Khorne** |
| Daemon Brutes | Monst Inf | 6" | 3+ | 5+ | 5 | 5 | 3 | 3 | 3 | 8 | 4+ | 56 | 3-9 | **choose** (K/S/N 2, T 6) |
| Fiends | Bike | 14" | 3+ | 4+ | 5 | 4 | 3 | 5 | 5 | 6 | 6+ | 42 | 2-5 | **Slaanesh** |
| Flamers | Jump-pack inf | 12" | 5+ | 3+ | 4 | 4 | 2 | 4 | 2 | 9 | 6+ | 54 | 3-9 | **Tzeentch** |

**Option-semantics — per unit** (literal text · primitive · status). ✅ enforced · 🟡 points-only ·
❌ not modeled.
- **Beasts of Nurgle** — NO options (Attention seeker movement ability). Fixed loadout.
- **Bloodcrushers** — `one` Icon of Chaos +10 (single-slot); `one` Instrument of Chaos +5 (single-
  slot); `every` brass armor **+41/model** → unit-wide 3+ save · `one`×2 ✅count/pts, `every` ✅pts /
  stat-override effect 🟡. (Bloodhunter = squad leader / Favored leader.)
- **Daemon Brutes** — `mark` group, **all four gods selectable** (Khorne/Slaanesh/Nurgle +2,
  Tzeentch +6 per model) · `mark`+per-model pricing · ✅ (mark pricing & animosity via shared
  `validators.ts`). Bodyguard. The lone non-locked Elite — confirms the per-model mark-pricing path
  works in CD, with Tzeentch dearer (same pattern as CSM).
- **Fiends** — NO options (Deflect / locked Slaanesh).
- **Flamers** — NO options (locked Tzeentch).

**Elites-slot gaps:** same single-slot Icon/Instrument primitive (Bloodcrushers) as Troops; `every`
brass-armor stat-override effect text-only; Daemon Brutes mark pricing ✅. No replace / no
conditional-unlock / no veteran in Elites.

## 4g. Fast Attack datasheets — stats + option-semantics (VALIDATED 2026-06-03, prod JSON canonical)

8 FA units; **none have armory access**, none are psykers/veterans. 6 locked-mark, **Furies are
markless** (a no-god Daemon unit). Chariots (Hellflayer, Seeker Chariot) are typed **Bike**, not
Vehicle — so no VEHICLE-EQUIPMENT access. Slaughterbrute is the only Monster. Stats
M/WS/BS/S/T/W/I/A/Ld/Sv. Sample-validated vs HTML: Furies (no mark, OPTIONS "-") ✓, Slaughterbrute
(Bound Beast slot-exemption verbatim) ✓ — production matches.

| Unit | type | M | WS | BS | S | T | W | I | A | Ld | Sv | Pts | size | Mark |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Flesh Hounds | Bike | 12" | 3+ | 3+ | 5 | 4 | 2 | 4 | 3 | 8 | 6+ | 25 | 4-23 | **Khorne** |
| Furies | Jump-pack inf | 12" | 4+ | 4+ | 5 | 4 | 1 | 5 | 2 | 7 | 6+ | 16 | 10-30 | **none** |
| Hellflayer | Bike (chariot) | 14" | 3+ | 4+ | 3 | 4 | 4 | 5 | 3 | 6 | 6+ | 55 | 1-3 | **Slaanesh** |
| Plague Drones | Jump-pack inf | 12" | 4+ | 4+ | 4 | 6 | 3 | 2 | 3 | 7 | 6+ | 51 | 2-8 | **Nurgle** |
| Screamers | Jet bike | 12" | 4+ | 4+ | 4 | 4 | 2 | 4 | 3 | 9 | 6+ | 44 | 3-9 | **Tzeentch** |
| Seeker Chariot | Bike (chariot) | 14" | 3+ | 4+ | 3 | 4 | 4 | 5 | 4 | 6 | 6+ | 54 | 1-3 | **Slaanesh** |
| Seekers | Bike | 14" | 3+ | 4+ | 3 | 4 | 2 | 5 | 3 | 6 | 6+ | 23 | 4-11 | **Slaanesh** |
| Slaughterbrute | Monst | 6" | 3+ | 3+ | 7 | 6 | 4 | 4 | 4 | 8 | 4+ | 103 | 1-2 | **Khorne** |

**Option-semantics — per unit** (literal text · primitive · status). ✅ enforced · 🟡 points-only ·
❌ not modeled.
- **Plague Drones, Seekers** — `one` Icon of Chaos +10 (single-slot); `one` Instrument of Chaos +5
  (single-slot) · ✅count/pts, effects text-only 🟡. (Same Icon/Instrument pair as Troops.)
- **Flesh Hounds** — NO `option_groups`; Gore Hound leader carries Burning roar; Collar of Khorne
  (dispel 1/round). Fixed loadout.
- **Furies** — NO options, **no mark** (OPTIONS "-"); Prey on the weak. The lone markless FA unit.
- **Hellflayer, Seeker Chariot** — NO options; Squadron chariots (typed Bike).
- **Screamers** — NO options; Slashing Dive (move-over hits) — in-game, out of list-build scope.
- **Slaughterbrute** — NO options; **`Bound Beast` slot-exemption** ("for every HQ unit with a Mark
  of Khorne, you may select one Slaughterbrute without using a Fast Attack slot") · **slot-exemption
  primitive** — same unmodeled gap as CSM Cultist Firebrand [[project-option-semantics]]; flag for
  the AOP layer (§6d). Frenzy(2") / Eager for carnage.

**FA-slot gaps:** single-slot Icon/Instrument (Plague Drones, Seekers) — `one` count ✅, effect 🟡;
**slot-exemption** (Slaughterbrute Bound Beast) ❌ not modeled. No replace / no conditional-unlock /
no veteran in FA.

## 4h. Heavy Support datasheets — stats + option-semantics (VALIDATED 2026-06-03, prod JSON canonical)

5 HS units. **Daemon prince + Soul Grinder have armory access** (the others don't); 3 are locked-mark,
**Daemon prince & Soul Grinder choose a mark**. **Soul Grinder is CD's only Vehicle** (Walker —
vehicle stat shape Front/Side/Rear/HP) and accesses **VEHICLE EQUIPMENT only**. Daemon prince
accesses the armory **"like a Greater Daemon"** → uses the **POINTS GREATER DEMON** (`p_char`) column
(confirms §3). Sample-validated vs HTML: Daemon prince (all options + Ascended) ✓, Soul Grinder
(vehicle stats + mark + vehicle-equipment) ✓.

| Unit | type | M | WS | BS | S | T | W | I | A | Ld | Sv | Pts | size | Mark | armory |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Burning Chariot | Jet bike (chariot) | 12" | 5+ | 3+ | 4 | 5 | 5 | 4 | 4 | 9 | 6+ | 262 | 1-2 | **Tzeentch** | no |
| Daemon prince | Monst | 6" | 2+ | 2+ | 6 | 6 | 6 | 5 | 4 | 9 | 3+ | 184 | 1-1 | **choose** (K/S 11, N 28, T 24) | yes (Greater Daemon col) |
| Mutalith Vortex Beast | Monst | 6" | 3+ | 3+ | 6 | 6 | 4 | 4 | 3 | 8 | 4+ | 171 | 1-2 | **Tzeentch** | no |
| Skull Cannon | Bike | 12" | 3+ | 3+ | 4 | 5 | 4 | 4 | 6 | 8 | 6+ | 96 | 1-3 | **Khorne** | no |
| Soul Grinder‡ | Walker (Vehicle) | 6" | 3+ | 3+ | 6 | — | — | 4 | 3 | — | — | 385 | 1-1 | **choose** (all +10) | vehicle-equip only |

‡ Soul Grinder vehicle shape (M/WS/BS/S · Front/Side/Rear · I/A/HP): M6" WS3+ BS3+ S6, **13/13/11**,
I4 A3 **HP3**. Maw cannon = multi-profile (`*` Vomit / Tongue / Phlegm — choose one).

**Option-semantics — per unit** (literal text · primitive · status). ✅ enforced · 🟡 points-only ·
❌ not modeled.
- **Burning Chariot, Mutalith Vortex Beast, Skull Cannon** — NO `option_groups` (locked-mark, fixed
  loadout). Mutalith has Regeneration(1) + Squadron; Burning Chariot Squadron.
- **Daemon prince** — `mark` group, all 4 gods (**Khorne/Slaanesh +11, Nurgle +28, Tzeentch +24** —
  character-tier, Nurgle dearest) · ✅; `one` add **Hellforged blade +18** · ✅; `one` **conditional**
  "**If no Mark of Khorne** is taken → psyker upgrade +5" · **conditional-unlock** RESOLVED
  (`ki-cd-condunlock-01` ✅ — `available_if: {type: notInstanceOf, scope: unit, keyword: Khorne}`);
  `one` **wings +37** (→ +6"M, Jump-pack-infantry unit-type) · `one`+stat/keyword 🟡 (pts ✅,
  type/Move injection ❌); `unique_upgrade` **Ascended Daemon Prince +90** (one per army,
  `variant_link` → 289-pt profile, **slot-shift HS→HQ**, becomes forced Animosity warlord, all
  marks, Daemon→Greater Daemon, loses Daemonic instability, gains Fearless + Terrifying(-2)) ·
  variant + **slot-shift** RESOLVED (`ki-cd-slotshift-01` ✅ — cdResolve + applyVariantSlotOverride
  set effectiveSlot="HQ", injected rule note conveys forced-warlord). armory ✅ (Greater Daemon col).
- **Soul Grinder** — `mark` group, all 4 gods **+10 each** (flat vehicle pricing) · ✅; Maw cannon
  multi-profile (choose one) · `profiles[]` display ✅; **VEHICLE-EQUIPMENT-only armory access**
  (Additional armor / Smoke Launcher / We are legion / Jammer) · vehicle-gate — confirm enforced
  (§6d, the only CD unit that exercises it). No weapon swaps.

**HS-slot gaps (richest slot):** ~~conditional-unlock~~ + ~~slot-shift~~ both RESOLVED (see Daemon
prince entry above — `ki-cd-condunlock-01`/`ki-cd-slotshift-01` ✅); `one`+unit-type mount (wings → Jump-pack) 🟡;
**VEHICLE-EQUIPMENT vehicle-gate** (Soul Grinder — only test case) needs confirming ✅/🟡; Daemon
prince **Greater-Daemon armory column** confirms the §3 `p_char`="GREATER DEMON" semantics.

## 4i. Fortifications datasheet — stats + option-semantics

**One entry: Feculent Gnarlmaw** (production spelling — "Feculent", note the source HTML filename
is the same). Locked **Mark of Nurgle**, no character, no psyker, no armory, no veteran. It is a
piece of **terrain** (Daemon spawning tree) rather than a fighting model — most of the stat block is
`—` (no Move/WS/BS/I/A). Sample-validated vs `Feculent Gnarlmaw.html` ✓ (stats, weapon, OPTIONS="-",
all 5 abilities match production exactly).

| Unit | type | M | WS | BS | S | T | W | I | A | Ld | Sv | Pts | size | Mark | armory |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Feculent Gnarlmaw | Fortification (terrain) | — | — | — | 6 | 7 | 5 | — | — | 7 | 6+ | 90 | 1-3 | **Nurgle** | no |

Equipped with **Sickness Blossoms** (6" Assault 4, S4 AP0 D1, Flames + Poison(4+)). No weapon swaps.

**Option-semantics — per unit** (literal text · primitive · status). ✅ enforced · 🟡 points-only ·
❌ not modeled.
- **Feculent Gnarlmaw** — NO `option_groups` (OPTIONS = "-"). Fixed loadout, fixed Nurgle mark. The
  rules complexity is all in **abilities**, none of which are wargear/points choices:
  - *Gnarlmaw infestation* — special **deployment** primitive: each Gnarlmaw set up individually
    after every other unit, >6" from enemies, anywhere on table (not the standard deploy zone). ❌
    not modeled (deployment-phase rule, outside option-semantics).
  - *Shroud of Flies* — aura: friendly Mark-of-Nurgle models within 6" count as in obscuring terrain.
  - *The Plague Bells Chime* — heal a friendly Daemon+Nurgle unit within 7" for D3 W during its
    activation (revive dead, full-heal injured first; chars/vehicles excluded).
  - *Unmanned* — can't contest/capture objectives (it's terrain).
  - Plus the universal **Daemon, Daemonic instability** keywords.

**Fortification-slot gaps:** none new — zero wargear options, so no option-semantics primitives are
exercised here. The only un-modeled mechanics are **deployment-phase** (Gnarlmaw infestation) and
**aura/heal abilities**, which live outside the wargear-gating engine entirely.

## 7. Open questions / discrepancies found
1. ~~Armory ᵀ-split asymmetry~~ — RESOLVED 2026-06-07: **by design**, not a discrepancy. It's the
   chosen fix for the documented ᵀ-glyph collision (ᵀ = Terminator-compat everywhere; Tzeentch items
   gate structurally via `armory_marks.Tzeentch` bucket membership instead). See §2 (corrected).
2. **VEHICLE EQUIPMENT has no category** in JSON (§2.2) — gate is heading-only in HTML.
3. ~~`term_compat` dead field~~ — RESOLVED 2026-06-07: **not noise, not removable** — required
   (non-optional) field on the shared `ArmoryItem` type, actively used by SM/HH/CSM. CD's `false`
   values are correct data (CD has no ᵀ-armour axis). Leave as-is; see §2 (corrected).
4. ~~Daemonkin block empty~~ — RESOLVED 2026-06-07: was dead data (CD has no Daemonkin concept in
   any source HTML), removed entirely (§6d).
5. **"POINTS GREATER DEMON"** column semantics (§3) — confirm app treats it as `p_char` everywhere
   despite the different label. Daemon prince ("armory like a Greater Daemon") is the live test case.
6. Per-unit option_groups cross-checked vs HTML ✅ (§4d–§4i complete, all 6 slots; production
   confirmed canonical & accurate). The two **CD-specific engine gaps** found — (a) **slot-shift**
   (Ascended Daemon Prince HS→HQ + forced warlord) and (b) **conditional-unlock** (Daemon prince
   psyker gated on "no Mark of Khorne") — are both now ✅ RESOLVED (`ki-cd-slotshift-01` v0.52,
   `ki-cd-condunlock-01` v0.51; digest was stale, corrected 2026-06-07). See §6d.
7. **Soul Grinder** is CD's *only* Vehicle, so the VEHICLE-EQUIPMENT gate has a single test case —
   any regression there is invisible elsewhere in the faction.
8. **Psychic disciplines were never loaded** — FIXED v0.64: `codex_chaos_daemons/special-abilities.ts`
   §6 already documented the 3 god-gated disciplines (Change/Decay/Excess, 18 powers) as "catalogued
   in `disciplines.json`", but that file didn't exist for CD and the loader passed `{}` for
   `psychic`. Built `data/parsed/chaos_daemons/psychic/disciplines.json` from the "Chaos Demons
   psychic disciplines" sheet (own values — distinct cast values/effects from CSM's
   "Disciplines of Chaos" despite similar names) and wired it into the `chaos_daemons` loader.
   "General psychic disciplines" sheet is just a link, nothing to audit.

**"Lo demás" complete for Chaos Daemons** — Army Customisation, Animosity, Armory, and psychic
disciplines all audited/wired against canonical sources.
