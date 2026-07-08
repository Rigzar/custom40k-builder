# Rules-model digest — Inquisition

> Per-faction digest of rules + keyword model, validated against canonical files.
> Persistent "expert cheat-sheet" across sessions — never filled from training memory.

---

## Faction: Inquisition

**Sources read to build this digest:**
- `Informacion/core_rules_text.txt` (Custom40k Core Rules v1.252 / Balance 5.03, FAQ #5: Codex > Core)
- `Informacion/Inquisition.ods` (Index sheet — Designer's note, roster overview)
- `data/source/Inquisition/Index.html`, `Armory.html`, `Inquisitor.html`,
  `Inquisition psychic discipline.html`, `General psychic disciplines.html`
- `data/parsed/inquisition/{units/<slot>/*.ts, armory/general.json, psychic/disciplines.json}` (production — units migrated v0.56 from monolithic units.json to per-slot TS files, mirroring CSM/SM/GK/CD)

### 1. Keyword vocabulary

- **Armour types:** Power armor (3+), Plate armour (4+), Terminator armor (full stat block,
  Massive(1)/Shock Troops/Unyielding, infantry only). `term_compat` axis present (60 items).
  No Cataphractii/Gravis — Inquisition has no analogue.
- **Marks / sub-factions: NONE.** Instead, Inquisition has **Ordo allegiance**
  (Hereticus / Malleus / Xenos) — see §2, structurally different from Chaos marks: it's an
  *armory item pick* that unlocks an army-wide equipment pool, not a unit attribute.
- **Unit types:** Infantry / Vehicle / Monstrous Infantry (Throne of Judgement grants it) /
  Character / Psyker (Familiar, Gamma psyker, Psychic training restricted to "psykers").
- **No archetypes/legacies/traits** — `Index.html` confirmed no Army Customisation tab.
  Designer's note: GK / Adepta Sororitas / SM-with-Alien-Hunters may field Inquisition units
  "as if they were part of their own army" (grounded [[project_alien_hunters_fix|SM fix]]).

### 2. Wargear gating

| Item / group | Requires keyword | Excludes keyword | Notes |
|---|---|---|---|
| ᵀ-glyph items (60) | `term_compat: true` | — | Standard Terminator gate, engine-derived |
| Veteran Abilities (8) | `category: 'veteran'`, unit `has_veteran_abilities` | — | Counter-attack, Favoured enemy, Furious charge, Infiltrator, Outflank, Tank hunter, Terrain expert, Vanguard. p_unit/p_veh/p_char per model — **fixed v0.56, were misfiled in `weapons[]`** |
| Vehicle Equipment (5) | `category: 'vehicle'`, `isVehicle` | — | Additional armor, Hunter-killer missile, Improved targeting, Jammer, Smoke Launcher — **fixed v0.56, were untagged** |
| Ordo-restricted (15) | `requires_army_item: "Ordo Hereticus"/"Ordo Malleus"/"Ordo Xenos"` | — | **NEW primitive v0.56** (`isArmyItemGateBlocked`, engine/keywords.ts) — army-wide unlock-by-item-pick. Glyphs ᴴ/ᴹ/ˣ stripped from names (gate now enforced; restriction text remains in `desc`). See breakdown below. |

**Ordo allegiance — canonical text** (item desc, verbatim): *"The model and further units from
this codex get access to `<Ordo X>` equipment. Every model can only pick one Ordo allegiance.
Only for Inquisitors."* — structurally identical to the CSM/CD Mark pattern
("`<god>` equipment access army-wide"), but CSM/CD model marks as a **unit attribute**
(`selectedMark` gates `armory_marks[X]`), whereas Ordo is an **armory item pick** that gates
army-wide — no existing primitive fit, hence the new `requires_army_item`/`isArmyItemGateBlocked`.

- **Ordo Hereticus (ᴴ → 5 items):** Ignis Judicium, Hexagram warding runes, Liber Heresius,
  No escape, Praesidium Protectiva
- **Ordo Malleus (ᴹ → 5 items):** Psycannon, Grimoire of True Names, Psybolt ammunition,
  Purified weapon, Tesseract labyrinth
- **Ordo Xenos (ˣ → 5 items):** Phase sword, Esoteric knowledge, Empyrian brain mines,
  Uluméathi Plasma Syphon, Universal anathema

### 3. Points model

Standard `p_unit` / `p_char` / `p_veh` semantics (mirrors CSM/SM `getItemPts` + `ArmoryModal.add`):
- Regular equipment: flat `getItemPts` (no `× item.size`)
- `category: 'veteran'`: per-model (`p_unit × item.size`) for infantry/chars (`p_char ?? p_unit`
  flat), per-wound/hull-point (`p_veh × woundCount × item.size`) for vehicles/monsters — table
  footnote: *"Point costs must be paid for every model in the unit and per Wound or Hull point."*
  Items with no vehicle application (Infiltrator, Vanguard) → `p_veh: null`.
- `category: 'vehicle'`: flat `× item.size`

### 4. Army rules / special rules

- **Psyker:** "A psyker can cast 1 psychic power and dispel 1 psychic power per round. A psyker
  knows Smite, as well as one psychic power from a chosen psychic discipline." (`Inquisitor.html`
  row 17 — generic core-psyker text, confirms Heresius/Telethesia are the faction disciplines)
- **General psychic disciplines:** `General psychic disciplines.html` is a link-pointer to the
  shared Google Sheets content already covered codebase-wide by `GENERAL_DISCIPLINES`
  (`src/data/generalDisciplines.ts`, merged in `PsychicModal.tsx:87`) — no migration needed.
- **Faction disciplines (own):** Heresius + Telethesia, 6 powers each — shipped v0.56 in
  `psychic/disciplines.json` (His Will Be Done / Witchhammer / Word of the Emperor / Purgatus /
  Divine Pronouncement / Soul-lightning = Heresius; Psychic Fortitude / Warding Incantation /
  Castigation / Psychic Pursuit / Scouring / Terrify = Telethesia).

### 5. Archetypes / Legacies / Traits

None — `Index.html` confirmed no Army Customisation sheet for Inquisition.

**Note — Ordo Warband units (NOT archetypes, plain Troops datasheets):** the roster
includes 3 large Troops units gated the same way as the Ordo armory items —
"Ordo Hereticus/Malleus/Xenos Warband" (`units/troops/ordo_*_warband.ts`), each "Only for
armies with an Ordo X Inquisitor" and "max 12 models, one warband per army". 6-7 model
profiles each (Acolyte/Arco-flagellant/Penitent/Surgeon/Missionary/Servitor/Sage for
Hereticus; Acolyte/Daemonhost/Exorcist/Jokaero Weaponsmith/Mystic/Psyker/Servitor for
Malleus; Acolyte/Alien World Scout/Archaeotech Researcher/Psyker/Servitor/Xenologist for
Xenos) — present and complete in the migrated TS data. The army-side restriction
("only with Ordo X Inquisitor") is now ALSO engine-enforced (v0.56): generalised
`requires_army_item` from `ArmoryItem` to `Unit` (`isArmyItemGateBlocked` widened to a
minimal structural type), wired into `SlotPanel`'s unit-list filter via the same
`rosterArmoryItemNames` roster scan used by `ArmoryModal`. One mechanic — the Ordo
allegiance pick on an Inquisitor — now correctly cascades to BOTH equipment access and
unit availability, exactly mirroring the canonical text. `option_groups[].header` text
left as-is (still shown to the player; the gate is the enforcement layer on top).

### 6. Open questions / discrepancies found — all resolved this session (v0.56)

- ~~8 Veteran Abilities misfiled in `weapons[]`~~ → moved to `equipment[]`, `category:'veteran'`
- ~~5 Vehicle Equipment items untagged~~ → tagged `category:'vehicle'`
- ~~Missing "Hunter-killer missile" weapon profile~~ → added (120", Heavy 1, S8 AP-3 D2, Ammo(1) AT(2))
- ~~Ordo ᴴ/ᴹ/ˣ restriction unenforced (rules-bug: could build illegal lists)~~ → new
  `requires_army_item` primitive ships the gate (armory items)
- ~~"Ordo X Warband" units fieldable without the matching Ordo Inquisitor (text-only
  restriction, same class of bug)~~ → `requires_army_item` generalised from `ArmoryItem`
  to `Unit`, gate now also filters `SlotPanel`'s unit list

~~**Ordo allegiance items not mutually exclusive (`ki-inquisition-ordo-exclusivity-01`)**~~
→ FIXED v0.56: added explicit validator (`engine/validators.ts`) — error if a model has 2+ of
{Ordo Hereticus, Ordo Malleus, Ordo Xenos} in its armory, mirroring the canonical text
("Every model can only pick one Ordo allegiance"). **MOOT as of 2026-06-23**: the 3 items this
validator guarded were removed entirely (see §6 below) — the validator was removed alongside
them as dead code.

**Side-finding (NOT in scope, logged as `ki-gk-inquisition-allied-badge-01`):** GK's existing
Inquisition access (`ki-10`) uses `[Allied]` — but the same Designer's note that grounded the SM
Alien Hunters "own army" fix names GK alongside SM as an "own army" case. Needs user confirmation
before touching (reads GK+Sororitas rules).

### 7. "Lo demás" pass (2026-06-13) — no fixes needed

- **Index "Special rules"**: Inquisition has no dedicated special-rules section — only the
  Designer's note (roster overview + ally access), already fully covered by §5/§6. Re-checked
  the 3-faction "own army" access grant against current code: GK and Adeptus Sororitas both
  carry `intrinsic_allies: ['inquisition']` (`src/data/loaders.ts`), and SM's "Legacy of the
  Alien Hunters" carries `grants_faction: "inquisition"` (`space_marines/archetypes.json`) — all
  three match the canonical text verbatim, nothing outstanding.
- **"Inquisition psychic discipline"** (Heresius + Telethesia, 12 powers) — re-dumped from the
  .ods and compared against `psychic/disciplines.json`: 1:1 match, no fixes. "General psychic
  disciplines" sheet is just a link, as in every other faction.

**Inquisition "lo demás" complete** — Armory/Ordo gating already covered by §1–§6 (v0.56); Index
and psychic disciplines now also re-audited. No discrepancies found.

### 8. New `Informacion/Inquisition.ods` (2026-06-13) — 40-sheet codex expansion, findings

The user provided a new, much larger Inquisition.ods (40 sheets vs. the Index-only version
read for §1–§7). Read: `Index`, `Army Customisation`, `Inquisitor`, `Arbites`,
`Henchman Warband`, `Hymns of Battle`, `Acolytes`, `Land Raider`, `Sanctioned Bombardement`,
`Armory`, `Ordo Hereticus/Malleus/Xenos Armory`, plus spot-checks of
`ordo_malleus_warband.ts`/`ordo_xenos_warband.ts` against the new per-specialist sheets.

**Mostly already covered.** The bulk of the new sheets (Arbites, Stormtroopers, Inquisitor,
Chimera, Corvus Blackstar, Land Raider Prometheus, Rhino, Taurox, Valkyrie, Deathcult
Assassins, the 3 Ordo Warbands and all 18 Henchman specialist profiles split across them, the
general Armory incl. all 3 Ordo armories with `requires_army_item` gating) are **already
present and at parity** in production `data/parsed/inquisition/`. No re-migration needed for
these.

**Genuinely new / open items:**

1. **Army Customisation tab now EXISTS** (contradicts old §5 "None — no Army Customisation
   sheet"). Cap: "0-1 Archetype, 0-1 Legacy".
   - **Archetypes:** *Heretic* ("every model with Armory access may select a single item from
     any Chaos faction, instead of Imperial"); *Iconoclast* (same but Xenos faction).
   - **Legacies:** *Ordo Hereticus* / *Ordo Malleus* / *Ordo Xenos* ("the army has access to
     the Ordo X Armory and Ordo X Warbands"); *Ordo Minoris* ("every character may select a
     single item from Hereticus/Malleus/Xenos Armory; army may include a single Ordo
     Hereticus/Malleus/Xenos Warband").
   - **OPEN QUESTION:** these Legacies look like an army-wide version of the existing
     per-model "Ordo allegiance" ArmoryItem pick (§2 — each Inquisitor individually picks
     `Ordo Hereticus`/`Malleus`/`Xenos` to unlock that Ordo's gear/Warband for the whole
     army). Need to ask the user whether the new Legacy mechanic **replaces** the old
     per-model pick, or is an **additional/alternative** path (e.g. for non-Inquisitor-led
     builds) — before wiring `archetypes.json`.
2. **Hymns of Battle (NEW prayer sheet)** — 5 hymns, identical set to IG/Sororitas/Tau
   (Catechism of Repugnance, Chorus of Spiritual Fortitude, Psalm of Righteous Smiting,
   Refrain of Blazing Piety, War Hymn). The Inquisitor's "Priest" upgrade option and the Ordo
   Warband Missionary's "Devout" ability both already say "knows ... from the hymns of
   battle". **FIXED** — `ki-inquisition-hymns-unwired-01` closed: added
   `data/parsed/inquisition/psychic/prayers.json` (byte-identical 5-hymn set to IG/Sororitas),
   wired via `loaders.ts`, and set `is_priest: true` on `inquisitor.ts` and
   `ordo_hereticus_warband.ts` (the only Ordo Warband with a Missionary).
3. **Missing unit: plain "Land Raider"** (558pts, M12"/WS6+/BS3+/S7/F14/Sd14/R14/I4/A1/HP4,
   2x Twin lascannon + Twin heavy bolter, transport 10, Assault ramp, optional Multi-melta
   +35 / extra Storm bolter +11, vehicle-equipment armory access). **FIXED** — added
   `units/heavy_support/land_raider.ts` alongside the pre-existing "Land Raider Prometheus"
   (distinct vehicle, different stats/weapons/cost — both legitimate).
4. **New Heavy Support sheet "Sanctioned Bombardement"** — same "select up to one weapon per
   HQ selection" mechanic + "Plotting"/"(In)accuracy: hits on 5+, unmodifiable" abilities as
   the already-implemented "Massive Orbital Strike" option group on `inquisitor.ts` — but
   **different weapons/costs**: Barrage bomb (S6 AP-2 D1, Barrage/Suppression) +42, Melta
   artillery (S8 AP-5 D2, Armorbane/AT4/Explosive) +88, Precision lance strike (SD AP-6 D5,
   AT6/Shield breaker-3) +90 — vs. Massive Orbital Strike's Heavy ordinance/Melta
   torpedo/Lance strike at 161/184/247. **RESOLVED & FIXED** — checked
   `Informacion/Escalation.ods`'s "Massive Orbital Strike" sheet: it carries
   `KEYWORDS: Lord of War` and is the Escalation LoW-slot version (Epic-only, 33% cap),
   correctly implemented on `inquisitor.ts`. "Sanctioned Bombardement" is the separate
   BASE-CODEX Heavy Support entry (smaller profiles/costs, no LoW gating) — both coexist.
   Added the 3 weapon profiles, a new "Sanctioned Bombardement" option group, and a matching
   "Plotting" ability line to `inquisitor.ts`.
5. **Henchman Warband restructure — user-confirmed, NOT YET DONE.** New `Henchman Warband`
   sheet: "An Inquisitor may select up to 6 specialist models for their Warband. An
   Inquisitor Lord may select up to 12." All 18 individual specialist sheets match the model
   profiles already split across the 3 Ordo Warband units (Acolyte shared + 6 Hereticus-only
   + ~6 Malleus-only + ~6 Xenos-only). Canonical text says "An Inquisitor MAY select a single
   Henchman Warband" — user decided this should become an **optional Inquisitor-attached
   selection** (not a fixed Troops unit), pooling all 18 specialists subject to
   Ordo-allegiance/Legacy gating, capped at 6 (Inquisitor) / 12 (Inquisitor Lord).
   `ki-inquisition-henchman-warband-restructure-01` — **FIXED**, closed in known-issues.ts.

6. **Army Customisation Legacy mechanic — FULLY REPLACED (closing `ki-inquisition-army-
   customisation-replace-01`, 2026-06-23).** User decided ("sustituye sistema viejo") that the
   new Legacies (Ordo Hereticus/Malleus/Xenos/Minoris + Archetypes Heretic/Iconoclast) should
   replace the existing per-model "Ordo allegiance" `requires_army_item` pick (§2). Initially
   (v0.56) found what looked like a blocker: the SAME 3 "Ordo Hereticus/Malleus/Xenos" armory
   items (general.json, `p_char: 0`) were ALSO the mechanism by which 3 other factions'
   validators were satisfied — SM "Legacy of the Alien Hunters" (forced "Ordo Xenos"), GK
   "Demon Hunters" (forced "Ordo Malleus"), Sororitas "Witch hunters" (forced "Ordo
   Hereticus"). **That blocker was ALREADY resolved by v0.71**, separately from this item: the
   2026-06-14 .ods replaced all 3 of those Designer's-note Inquisition-access clauses with the
   opt-in "Chamber Militant" archetype (`chamberMilitantOrdo()`, `engine/keywords.ts`), which
   needs no per-model armory pick at all — the old "Demon Hunters"/"Witch hunters"/"must
   select Ordo Xenos" validators were removed at that point. Nobody revisited this item after
   that, so it sat additive for another ~9 days.
   **Read the full canonical `Inquisition.ods` again on 2026-06-23 (golden rule) before
   finishing the replace** — confirmed the current "Armory" sheet has NO "Ordo Hereticus/
   Malleus/Xenos" items at all; they were leftover from an older parser pass, not a real
   dual-mechanism the rules ever intended. **Removed the 3 items entirely** from
   `data/parsed/inquisition/armory/general.json` and their now-dead exclusivity validator
   (§1 above). `isArmyItemGateBlocked`'s gating already unioned `inquisitionLegacyOrdoUnlocks
   (legacy)` with the roster's actually-purchased item names, so removing the 3 items had ZERO
   effect on the 15 gated armory items + Henchman Warband they used to gate — the Legacy alone
   now drives availability, exactly as the .ods describes. `ki-inquisition-army-customisation-
   replace-01` is CLOSED.
   `inquisitionLegacyOrdoUnlocks(legacy)` (`engine/keywords.ts`) remains the mechanism: when
   the army's selected Legacy is "Ordo Hereticus/Malleus/Xenos", that name is added to
   `rosterArmoryItemNames` (ArmoryModal + SlotPanel), unlocking that Ordo's gated armory items
   AND Warband army-wide. "Ordo Minoris" unlocks all 3 Ordos' gating.
   `ki-inquisition-ordo-minoris-caps-unenforced-01` — **FIXED** (closed in known-issues.ts).

7. **New Inquisitor-sheet discrepancies found while implementing item 4 — RESOLVED (re-checked
   2026-06-22, full ODS audit pass).** `units/hq/inquisitor.ts` now matches the .ods exactly:
   Inquisitor Lord `inline_pts: 15` (36+15=51pts), separate Priest +5pts AND Psyker +5pts option
   groups both present, `has_veteran_abilities: true`/`veteran_max: 1`, and the
   Quarry/"Inquisitor Lord: may choose a second quarry" ability lines are both in `abilities[]`.
   Fixed in an earlier session not reflected when this note was written; KI
   `ki-inquisition-inquisitor-sheet-gaps-01` can be closed.

### 9. June 2026 changelog (external ruleset update) — Inquisition items

User provided the official June 2026 changelog. 6 Inquisition bullets cross-checked against the
new 40-sheet `Inquisition.ods`:

- "Changed Ordo selection into Legacies" / "Added Archetypes for Iconoclasts and Heretics" →
  already covered by item 6 (v0.64).
- "Added Land Raiders" → already covered by item 3 (v0.63).
- "Added a bunch of new equipment options to all Armories" / "Updated profile for
  Inquisitors" → not yet audited line-by-line, deferred.

**8. "Removed access to Storm shields for non-characters" — FIXED.** New `Armory` sheet shows
   Storm shield as `POINTS: -` / `POINTS CHARACTER: 6` (was `p_unit: 2, p_char: 6` in
   production, i.e. regular models could buy it for 2pts). Fixed: `general.json`'s "Storm
   shield" entry now has `p_unit: null` (character-only), `p_char: 6` unchanged.

**9. "Added the special rule 'Authority of the Inquisition'" — DOCUMENTED, not mechanically
   enforced.** New `Index` "Special rules" section: *"Authority of the Inquisition: Every
   model in the army with access to the Armory may select a single item from any Imperial
   faction."* Same shape as Heretic/Iconoclast (item 6) — an army-wide "pick 1 item from
   another faction's armory" grant, but ALWAYS ON (not an opt-in Archetype) and scoped to
   ALL ~8 Imperial factions (vs. Heretic/Iconoclast's single Chaos/Xenos pick). No existing
   UI surfaces "always-on special rules" text for any faction (special-abilities.ts files are
   migration/audit docs only, not rendered). Documented as a new `INQ_SPECIAL_ABILITIES`
   entry (`engine/codex_inquisition/special-abilities.ts`, category 'army-rule'). New KI
   `ki-inquisition-authority-unenforced-01` — no UI/engine support for cross-Imperial-faction
   armory access exists; would need a new "browse another Imperial faction's general armory"
   mechanism (bigger than the existing per-Legacy `armory_legions` tab, which is single-
   faction).

**10. "Added Repressors" — FIXED.** New `units/dedicated_transport/repressor.ts` (129pts,
   M12"/WS6+/BS3+/S6/F11/Sd11/R10/I4/A1/HP2, Heavy flamer + Storm bolter, optional 2nd Storm
   bolter +11, vehicle-equipment armory access, Fire hatches(7)/Dozer blade/Transport 10
   excl. Terminator armor) — same shape as Rhino but distinct stats/weapons/cost. Wired into
   `dedicated_transport/index.ts` and top-level `units/index.ts` (Dedicated Transport slot).

**11. "Updated profile for 'Corvus Blackstar'" — FIXED.** New Corvus Blackstar sheet deltas
   applied to `units/dedicated_transport/corvus_blackstar.ts`:
   - Points 343 → 341. WS "-" → "6+".
   - Split "Blackstar cluster launcher" into two fire-mode profiles (same convention as CSM's
     "Missile launcher - Frag/Krak missile"): "Blackstar cluster launcher - Frag cluster"
     (12", Assault 1, S4 AP0 D1, Bomb/Barrage) and "- Infernus cluster" (12", Assault 1, S5
     AP-2 D1, Bomb/Explosive/Sunder(1)); added to `equipped_with`.
   - Split "Twin Blackstar rocket launcher" into "- Corvid" (30", Heavy 2, S6 AP-2 D1,
     Anti-Air/Explosive) and "- Dracos" (30", Heavy 2, S4 AP-1 D1, Barrage/Seeking).
   - "Twin lascannon" ability AT(3) → AT(2).
   - Swap cost "Twin Blackstar rocket launcher → Stormstrike missile launcher" +18 → +37;
     renamed "Stormstrike missiles" → "Stormstrike missile launcher" (matches .ods + the
     option-group choice name).
   - "Infernum Halo-launcher" converted from a fixed ability into a purchasable option
     (+5pts), alongside new "Auspex array" option (+10pts), in a new option_group ("May be
     equipped with one of the following").
   - New abilities: "Auspex array: All ranged weapons equipped by this vehicle gain the
     'Sunder(1)' ability." and "Assault ramp: Passengers can still make a 6" charge move
     after the vehicle moves and they exit."

## §12 — Henchman Warband restructure (item 5) — FIXED v0.66

Full re-audit + structural merge, grounded in `Informacion/Inquisition.ods` (40 sheets: "Henchman
Warband" + 17 individual specialist sheets). User: "haz todo mientras este apegado al .ods y a
las reglas del juego" → "todo de una vez a traves del .ods" (do everything at once, grounded in
the .ods).

**Canonical text** (sheet "Henchman Warband"): *"Every Inquisitor may select a single Henchman
Warband and must start the game attached to it. A Henchman Warband consists of specialists,
chosen from the Elite section in this codex. Each specialist unit may only be added once to the
Warband, up to the specified amount of models. An Inquisitor may select up to 6 specialist
models for their Warband. An Inquisitor Lord may select up to 12 specialist models for their
Warband."*

**Key finding — Ordo gating REMOVED for specialists.** Full-text search across all 40 sheets for
"Ordo Hereticus/Malleus/Xenos/Minoris" found ONLY the "Army Customisation" sheet (Legacies). No
individual specialist sheet has "Only for Ordo X" text (unlike the old production 3-Warband
split, each `requires_army_item: "Ordo X"`). Any Inquisitor can now pick any specialist for
their Warband — no per-model gating needed.

**Stat/points audit — all 21 .ods specialists checked** (18 old + Crusaders/Chirurgeons/Eldar
Outcast new): systematic W1→W2, LD+1 (LD6→7 on most; Servitor LD5→10), higher points across the
board, some max-count changes (Arco-flagellant 6→10, Penitent 1→2, Missionary 2→1, Jokaero 2→3,
Alien World Scout/Archaeotech Researcher 1→2), updated equipment (Servitor "Paired shock
chargers" base + new swap costs 13/27/50 vs old 9/18/49; Missionary Eviscerator option +5→+6),
new multi-profile weapons (Jokaero "Jokaero digital weapons" — Beams/Bolts/Flames/Strike;
Servitor "Plasma cannon - Standard/Supercharge"). "Surgeon" (old Ordo Hereticus specialist,
10pts/max2) does NOT appear anywhere in the new 40-sheet .ods — DROPPED (no canonical basis
remains). The two old "Psyker" entries (Ordo Malleus + Ordo Xenos, both 10pts/max2) collapse
into the single new "Psykers" sheet (16pts/max1).

**Result: 17 unique specialist models** in the merged `henchman_warband.ts` (Acolyte, Servitor,
Arco-flagellant, Penitent, Missionary, Sage, Daemonhost, Exorcist, Jokaero Weaponsmith, Mystic,
Psyker, Alien World Scout, Archaeotech Researcher, Xenologist, Crusader, Chirurgeon, Ranger
[Eldar Outcast]) — full stats/points/equipment/abilities re-audited from the .ods.

**Dynamic 6/12 cap** — new validator in `engine/validators.ts`: finds the "Henchman Warband"
roster entry, checks `item.size` (sum of all specialist `modelSizes`) against 6, or 12 if any
"Inquisitor" entry in the army has the "Inquisitor Lord" `unique_upgrade` (`variant_link:
"Inquisitor Lord"`) active.

**Structural changes:**
- `data/parsed/inquisition/units/troops/henchman_warband.ts` — new merged unit, replaces the 3
  `ordo_*_warband.ts` files (deleted).
- `units/troops/index.ts`, `units/index.ts` (`units` map + `slot_to_units["Troops"]`),
  `engine/codex_inquisition/slots.ts`, `unit-types.ts` — updated 3→1 entry.
- `engine/keywords.ts`, `engine/codex_inquisition/keywords.ts`, `special-abilities.ts`,
  `SlotPanel.tsx` — doc comments updated (the old "Ordo X Warband" unit-gating references are
  stale; `requires_army_item`/`inquisitionLegacyOrdoUnlocks` now only matter for armory items).

`ki-inquisition-henchman-veteran-per-specialist-01` — **FIXED** (closed in known-issues.ts).

**Items 2, 3, 4, 8, 10, 11, 12 DONE (build ✓, local, NOT pushed). Item 9 documented (KI logged).
Item 6 (Army Customisation full replace) remains a large structural rework, user-confirmed but
not implemented. Item 7 logged, not fixed.**
