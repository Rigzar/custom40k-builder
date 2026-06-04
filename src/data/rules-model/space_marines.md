# Rules-model digest — Space Marines

> Per-faction digest of rules + keyword model, validated against the canonical files.
> Source of truth for engine keyword gating + persistent expert cheat-sheet. Never filled
> from training memory — only from the user's canonical files. FAQ #5: Codex > Core.

---

## Faction: Space Marines

**Sources read to build this digest** (2026-06-04):
- `Informacion/core_rules_text.txt` (v1.252 / Balance 5.03), `Informacion/missions_text.txt`
- `data/source/Space Marines ENG/Index.html` — slot org table + army special rule
- `data/source/Space Marines ENG/Army Customisation.html` — 8 archetypes, 9 legacies, 19 traits
- `data/source/Space Marines ENG/Armory.html` — weapons/equipment/veteran/vehicle + ᴳ/ᵀ gating
- 9 chapter armories (`Blood Ravens / Death Watch / Blood Angels / Black Templars / Relictors /
  White Scars / Dark Angels / Imperial Fists / Space Wolves Armory.html`)
- Production JSON `data/parsed/space_marines.json` (canonical for rules semantics)

### 1. Keyword vocabulary
What keywords gate data in this faction.

- **Armour types (equipment items, not pre-baked categories):**
  - **Gravis armor** — +1T, 6+ inv, Massive(1), Unyielding. *Not combinable with other armors.*
    Native Gravis units: Heavy Intercessor, Aggressor, Inceptor, Eradicator.
  - **Terminator armor** — +1T/+1A, 2+ Sv, 5+ inv, Massive(1), Deep Strike, Unyielding.
    *Only for infantry. Not combinable.* (Armory item #100.) Native: Terminator Squad,
    Deathwing Knights, Captain/Chaplain/Librarian variants that take it.
  - **Cataphractii armor** — treated like Terminator for gating (ᵀ). (HH supplement mainly.)
  - **Master-crafted armor** (2+ Sv), **Phobos armor** (Move Through Cover + Infiltrator),
    **Power armour** (default, no keyword) — all *not combinable with other armors*.
- **Marks / sub-factions:** **NONE.** SM has no marks (`armory_marks` empty). Chapter identity is
  expressed via **Legacy** (chapter armory + discipline), not a per-model keyword.
- **Unit types:** Infantry / Vehicle / Monster(Creature) / Character / Bike / Fly. Jump pack adds
  movement+Jump pack rule, *infantry only*.
- **Chapters (9, each = one Legacy + one chapter Armory + sometimes a discipline):**
  Blood Ravens (Aurelia), Death Watch (Alien Hunters), Blood Angels (Angel→Sanguine),
  Black Templars (Crusader→Prayers), Relictors (Damned), White Scars (Khan→Stormspeaking),
  Dark Angels (Lion→Interromancy), Imperial Fists (Praetorian→Geokinesis),
  Space Wolves (Wolf→Tempestus).

### 2. Wargear gating (replaces term_compat / gravis_compat / category)
Armor-gate rules verbatim (Armory.html L69-70):
- **Models wearing Gravis armor can only receive equipment with ᴳ.**
- **Models wearing Cataphractii or Terminator armor can only receive equipment with ᵀ.**

| Item / group | Requires keyword | Excludes keyword | Notes |
|---|---|---|---|
| Items tagged **ᴳ** | (purchasable by Gravis models) | — | Gravis models restricted to ᴳ-only set |
| Items tagged **ᵀ** | (purchasable by Term/Cataphractii) | — | Term models restricted to ᵀ-only set |
| Items tagged **ᴳ ᵀ** | both | — | usable by Gravis AND Terminator |
| Items with no glyph | Power-armour models | Gravis, Terminator | excluded from Gravis/Term restricted sets |
| Jump pack | Infantry | — | "Only for infantry" |
| Terminator armor (item) | Infantry | — | "Only for infantry. Not combinable." |
| Auto boltstorm gauntlet | "Gravis armor only" | — | text gate |
| Absolvor bolt pistol | Apothecary, Chaplain only | — | text gate |
| Relic blade | Lieutenants only | — | text gate |
| Selfless healer | Apothecaries only | — | text gate |
| Chapter banner | Ancients only | — | text gate |
| Book of Malcador / Familiar | Librarians only | — | text gate |

**Engine status (DONE v0.51):** both gates enforced via the keyword seam. ᵀ via
`modelRestrictsToTermSubset` → `filterTermCompat` (filters `a.term_compat`); ᴳ via
`modelRestrictsToGravisSubset` → `filterGravisCompat` (filters `a.gravis_compat`), composed into all
three armory tabs. Each fires on innate `armourKeyword`, a bought armour item, or the baked armour
ability. The 4 native-Gravis units carry `armourKeyword:"Gravis"`. Gravis/Terminator are mutually
exclusive, so at most one subset gate applies. Bought items stay visible (removable). See §6.

### 3. Points model
Two columns in Armory: **POINTS** (normal model) and **POINTS CHARACTER MODELS** (flat for chars).
- Weapons/equipment: per-model purchase. Character column = flat char price.
- **Veteran abilities** (Counter-attack, Favoured enemy, Furious charge, Infiltrator, Outflank,
  Tank hunter, Terrain expert, Vanguard): per unit on infantry; **per Wound / Hull point** on
  Monstrous Creatures & Vehicles.
- **Traits:** paid **per unit**. Costs marked `*` are paid **per Wound or Hull point**
  (The Flesh is Weak = 2*/5*). Three columns: NORMAL / CHARACTER MODELS / MONSTROUS&VEHICLES.
- Map: `p_unit` (normal), `p_char` (character column), `p_veh` (per-W·HP veteran/trait).

### 4. Army rules / special rules
- **They Shall Know No Fear** (army-wide, Index.html): a pinned/fleeing unit auto-regroups at
  start of turn or on reaching board edge; can never use the "Take cover" Defensive reaction.
- **No marks**, no summoning, no favored-unit mechanic (unlike CSM/CD).
- Designer note: chapter-specific units (e.g. Deathwing Knights) are usable by ANY SM army with
  no archetype/legacy/trait required — they are just regular slot entries.

### 5. Archetypes / Legacies / Traits
**8 Archetypes** (0-1): 1st Company (only listed units; Honor Guard+Terminators→Troops; "Objective
secured!"; HQ gain once-per-army upgrade), Death from Above (Assault Squad→Troops, half in
reserve), Drop Pod Assault (all start in Drop Pods; staged arrival), Forlorn Brothers (only Black
Rage creatures + listed vehicles; Death Company→Troops, unlimited), Legion (full HH supplement
access; only HH Troops count to 25%), Librarian Conclave (4 HQ slots, Librarians only, +1 manifest
near Chief Librarian), Renegades (treated as CSM in ally matrix; may take 1 CSM trait), Swift as
the Wind (Bikes/Outriders→Troops; outflank turn 1; <12"M must ride transport).

**9 Legacies** (0-1) → chapter armory (+ discipline where noted):
Aurelia=Blood Ravens · Alien Hunters=Death Watch + Inquisition units (Ordo Xenos) + "Special
ammunition" to any model · Angel=Blood Angels + Sanguine · Crusader=Black Templars + Prayers of
the Faithful · Damned=Relictors · Khan=White Scars + Stormspeaking · Lion=Dark Angels +
Interromancy · Praetorian=Imperial Fists + Geokinesis · Wolf=Space Wolves + Tempestus.

**19 Traits** (0-2, all models must take it unless noted). Costs NORMAL/CHAR/MON&VEH:
Blitz Attack 5/0/5 · Bolter Drill (Deflagrate 5+ on Bolt, not Heavy) 5/0/5 · Codex Discipline
(+1 Ld) 5/0/5 · **Expanded Armory** (forces 2nd Legacy; one-armory-per-model) 0/0/0 · Cursed
Founding (pick 1 creature improvement) 5/0/5 · Forged in Battle (reroll 1 pen/wound) 5/0/5 ·
Knowledge is Power (reroll psychic, Psykers only) -/0/5 · Path of Damnation (one model gains CSM
Demon weapon) -/Special/- · Purity above All (1 non-char/squad → Apothecary) 5/-/- · Rapid
Deployment (Haste 2") 5/0/5 · Red Thirst (+1 S on charge) 5/0/5 · Righteous Wrath (Frenzy 1") 5/0/5
· Siege Experts (Sunder 1 ranged) 5/0/5 · Sons of Mars (1 non-char/squad → Techmarine) 5/-/- ·
Stalwart (reroll 1 save/round) 5/0/5 · Stoic (no Defensive Fire penalty) 5/0/5 · Strike from the
Shadows (light cover until 1st activation) 3/0/3 · The Flesh is Weak (6+ inv creatures / vehicle
repair) 2*/0/5* · Unleashed Hunters (+1 melee hit on charge) 5/0/5.

### 6. Open questions / discrepancies found
- **Gravis (ᴳ) gating — DONE v0.51 (ki-sm-gravisgate-01 fixed).** Mirror of the ᵀ gate:
  `modelRestrictsToGravisSubset` (engine/keywords.ts) + `filterGravisCompat` (ArmoryModal), composed
  into general/mark/legion tabs. 4 native-Gravis units tagged `armourKeyword:"Gravis"` (Heavy
  Intercessor, Aggressor, Inceptor, Eradicator); also fires on a bought "Gravis armor" item. 53
  ᴳ-tagged items in the data feed the subset. See [[pipeline-migration]].
- **Jump-pack unit-type options — DONE canonically (v0.51, grounded in datasheet VERBS).** Core
  rule: "Jump Pack Infantry" is a distinct unit TYPE (replaces Infantry; gains Deep Strike +
  ignores terrain — core L503-507), separate from the "Jump pack" RULE the armory item grants
  (+6" M only, no Deep Strike, no type change). So the verb on each sheet decides the model:
  - **Blood Claws** — sheet "change unit type TO Jump pack infantry" → REPLACEMENT.
    `effect.set_unit_type: "Jump Pack Infantry"` + `stat_mod M+6`. (The "count as Fast Attack"
    slot-shift is a separate rule, NOT a type change — left unmodelled, same gap class as
    ki-cd-slotshift-01.)
  - **Death Company** — sheet says ONLY "+9 pts" → nothing extra granted, left faithful (no effect).
  - **Assault Squad** — innate Jump Pack Infantry; remove option → `set_unit_type: "Infantry"` +
    `stat_mod M−6`.
  - **Inceptor / Suppressor** — innate; relabelled from "Infantry, Jump pack" shorthand to the
    canonical "Jump Pack Infantry".
  Engine: added `OptionEffect.set_unit_type` (replacement) alongside `adds_unit_types` (additive
  "gain"). See [[option-semantics]] and ki-parser-02. (Cross-faction casing + GK Teleporter =
  ki-jumppack-otherfactions-01.)
- **resolver-space-marines.ts — INTENTIONAL passthrough (DONE v0.51).** A faction resolver injects
  army-state-derived per-unit profile changes (CSM: mark abilities, vehicle weapon overrides,
  favored). SM has none of those triggers (no marks, no favored, no archetype weapon/stat rewrite),
  so the passthrough is correct, not missing work. The misleading "planned rules / fill in after
  audit" header was replaced with an honest pointer map (rules live in archetypes/legacies/traits/
  validators/keywords seam + static "TSKNF" in data). If a future SM rule must change the resolved
  profile from army state (chapter combat doctrine, army-wide legacy stat buff), it belongs here.
- **Stale "skeleton" comments — CLEANED v0.51.** `traits/space-marines.ts` (19 traits filled & LIVE
  via TRAIT_EFFECTS spread + resolver faction-agnostic pass) and `validators/space-marines.ts`
  (archetype composition + 3 uniqueness checks) both had "skeleton — fill in after audit" headers;
  rewritten to accurate status. Verified SM traits ARE applied live → known-issue ki-22a corrected
  (CSM **and** SM wired; remaining factions still display-only). Non-SM placeholders left intact.
