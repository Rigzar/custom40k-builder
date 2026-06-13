# Rules-model digest — Imperial Guard

> Built from scratch 2026-06-11. IG was 🟠 audited (v0.17/v0.21 bug passes) but had NO
> `rules-model/imperial_guard.md` — prerequisite for its Fase 4 migration. Grounded primarily in
> the **`.ods` (structured canon)**, with production JSON for rules-semantics and HTML as
> secondary cross-check, per the user's correction (2026-06-11): the `.ods` is the source of
> truth for a data audit, not the HTML.

**Sources read to build this digest** (2026-06-11):
- `Informacion/Imperial Guard ENG.ods` (68 sheets: Index, Army Customisation, Armory, Orders,
  Hymns of Battle, both psychic-discipline sheets, + 60 unit datasheets) — STRUCTURED CANON
- `Informacion/Custom40k Core Rules.txt` + `Custom40k Missions.txt` (rules grounding)
- `data/parsed/imperial_guard/` production data: `units.json` (60 units, object keyed by name +
  `slot_to_units` index), `armory/general.json` (50 equipment items), `archetypes.json`
  (11 archetypes / 7 legacies / 16 traits) — cross-checked against the `.ods` per GOLDEN RULE
- `src/data/loaders.ts:123` (IG loader — imports units+general+archetypes only; NO psychic file)

---

## Faction: Imperial Guard

### 1. Keyword vocabulary

- **Armour types: NONE keyword-gated.** Grepped all 60 production units: `armourKeyword` is
  populated on ZERO units. IG has no Terminator/Cataphractii/Gravis analogue at all — its
  "armour" is purely a STAT-TIER purchase from the Armory (Plate armor → 4+ Sv, Master-crafted
  armor → 2+ Sv, Refractor field → 5+ inv, Bionics → 6+ inv), never a keyword that gates an
  equipment subset. This is the FIRST faction migrated with a completely empty armour axis —
  even Inquisition/GK had a single ᵀ-gate; IG has no gate whatsoever.
- **Marks / sub-factions: NONE intrinsic.** No `locked_mark` on any unit (grepped: zero). Marks
  of Chaos exist ONLY as a purchasable upgrade unlocked by the **Traitor Guard** archetype
  (+1 Khorne/Slaanesh, +2 Nurgle/Tzeentch per model & per Wound; +10 any mark per vehicle) —
  an archetype-gated option, NOT a unit-identity axis. Cross-ref [[project_traitor_guard_bugfix_0608]]
  (v0.58 fixed variant-pricing/Favored bugs on Traitor Guard).
- **Unit types** (from production `unit_type`, 60 units): `Vehicle` (22), `Infantry` (19),
  `Character Model, Infantry` (9), `Vehicle, Walker` (2), `Flyer, Vehicle` (2), plus singletons
  `Bike`, `Squadron, Vehicle`, `Vehicle, Character Model, Infantry`, `Character Model, Infantry,
  Squadron`. **TWO parser-artifact `unit_type` values** (§6.2): one IG unit carries
  `"Infantry, Battlemutt: Once per game, the unit can perform a Defensive reaction..."` (an
  ability sentence leaked into the type field) and another `"Character Model (Engineseer only),
  Infantry"` (a parenthetical restriction note leaked in). Both should be cleaned — same class as
  `ki-unittype-residuals-01` ([[project_sm_digest]]).
- **Datasheet keywords[]: EMPTY.** Grepped all 60 units: `keywords: []` everywhere. SIXTH
  confirmation (CSM=6, CD/SM/Inquisition/GK/now IG=0) that a populated datasheet axis is the
  per-faction EXCEPTION — CSM is increasingly the lone outlier.
- **Net:** IG has the SIMPLEST keyword vocabulary of any faction so far — ALL FOUR axes
  (armour / mark / faction / datasheet) are empty. Its entire wargear gating runs on prose
  ("Only for X") + boolean unit flags (`is_vehicle`/`is_character`/`is_psyker`/
  `has_veteran_abilities`), never a keyword. See §2.

### 2. Wargear gating (replaces term_compat / gravis_compat / category)

| Item / group | Gate mechanism | Notes |
|---|---|---|
| All Armory weapons + equipment | NONE keyword-based | `has_armory_access` opens the general tab; no ᵀ/ᴳ-style keyword filter exists (no `armour_compat`/`term_compat` on any item — IG armour isn't a keyword) |
| "Only for X" prose restrictions | free-text match | Eviscerator → "Only for Preacher"; Force weapons/Familiar/Gamma psyker → "Only for Primaris Psykers"; Grav-chute/Mechanical steed → "Only for infantry"; many more. Same prose-match pattern as CSM/SM/GK/Inquisition (engine enforces via desc text, not a keyword axis) |
| Veteran Abilities (8: Counter-attack/Favoured enemy/Furious charge/Infiltrator/Outflank/Tank hunter/Terrain expert/Vanguard) | `has_veteran_abilities` flag + `category: 'veteran'` | **GAP — see §6.1**: production carries these UNTAGGED (`category: none`, no `p_veh`) — the EXACT twin of `ki-gk-vetvehcategory-01` |
| Vehicle Upgrades (16: Additional armor/Bulldozer blade/Camo net/Chain guard/Heavy stubber/Hunter-killer missile/Improved targeting/Jammer/Macharius cross/Purity seal/Regimental artefact/Seasoned officer/Smoke Launcher/Storm bolter/Twin heavy stubber/Vox) | `is_vehicle` flag + `category: 'vehicle'` | **Same GAP §6.1**: untagged in production |
| Mark of Chaos | Traitor Guard archetype only | purchasable upgrade, not a base gate (see §1 Marks) |

### 3. Points model

- **Standard equipment**: `p_unit` (flat per-model) / `p_char` (flat CHARACTER-MODEL override) —
  the Armory's two columns are literally "POINTS" and "POINTS CHARACTER MODELS". Mirrors
  CSM/SM/GK/Inquisition `getItemPts` shape exactly. No `× item.size` multiplier for regular gear.
- **Veteran Abilities**: the `.ods` VETERAN ABILITIES table has columns **"POINTS"** and
  **"POINTS MONSTROUS CREATUES & VEHICLES"** (1 / 2 for 6 items; 1 / "-" for Infiltrator &
  Vanguard) + the footnote *"Point costs must be paid for every model in the unit and per Wound
  or Hull point of the model."* → infantry/characters pay `p_unit × size`; vehicles/monsters pay
  `p_veh × woundCount × size`. **This is the IDENTICAL two-column shape GK has** — and the SAME
  richer per-Wound/Hull tier [[project_space_marines_codex_migration]] found CD lacks. IG sits on
  the SM/GK/Inquisition side of that inverse-pair (FOURTH faction confirming the split is real).
- **Vehicle Upgrades**: single "POINTS" column, flat `× item.size` — the simpler CD-style
  vehicle-equipment shape (no per-Wound scaling), same as GK/Inquisition's vehicle tier.
- **Traits**: 3-column pricing **"NORMAL | CHARACTER MODELS | MONSTROUS CREATURES & VEHICLES"**
  with `*` = "paid for every Wound or Hull point in the unit" (e.g. Bionic Improvement 1*/0/1*,
  Born Soldiers 5/0/5, Heavy Infantry 3*/0/-). A per-unit (not per-item) cost paid army-wide when
  the trait is taken (Army Customisation: "If a Trait is taken, all models/units in the army must
  be upgraded with it"). RICHEST trait-pricing shape of any faction migrated — CSM/SM traits are
  flat per-unit; IG's adds the character/MC&V split + the per-Wound `*` tier.

### 4. Army rules / marks / special rules

- **ORDERS** (IG's signature mechanic, Index sheet verbatim): "Each officer issues the army one or
  more orders, which can be selected or exchanged in the Reinforcement phase. Each of the army's
  own units can use one of the previously selected orders... as long as it is within 12" of an
  officer at the start of its activation. An order is not consumed and any number of units can use
  the same order in a turn... Each unit can only benefit from a single order per turn. An officer
  knows all orders from the list." Two base groups (Orders sheet):
  - **Infantry orders** (9): Fix bayonets! / Take cover! / First rank, fire! Second rank, fire! /
    Overcharge batteries! / Move! Move! Move! / Bring it down! / Forwards, for the Emperor! /
    Get back in the fight! / Fall back!
  - **Vehicle orders** (3): Gunners, kill on sight! / Fire and fade! / Scorched earth!
  - **Legacy orders** (6, each unlocked by a Legacy — see §5): Burn them out! / Fire on my
    command! / Form firing squad / Get around behind them! / Mount up! / Suppressive fire!
- **Weapon team crews** (Index): some units can form a "Heavy weapons team" using the "Heavy
  Weapon Squad" profile.
- **Hymns of Battle** (Hymns sheet, the Preacher's prayer-equivalent system, 5 hymns): Catechism
  of Repugnance / Chorus of Spiritual Fortitude / Psalm of Righteous Smiting / Refrain of Blazing
  Piety / War Hymn. NOT psychic powers — a Preacher-gated litany system (mirrors GK's Faithful/
  Prayers split, [[project_grey_knights_digest]]).
- **Psychic disciplines — Psikana** (Imperial Guard psychic discipline sheet): IG's own
  discipline (Psikana I/II tiers: Mental Strength / Gaze of the Emperor / Nightshroud / Psychic
  Barrier / Terrifying Visions / Psychic Maelstrom / ...). Carried by `is_psyker` units (Primaris
  Psyker, Sanctioned Psykers, Astropath). **⚠ NOT wired into the loader — see §6.3.**

### 5. Archetypes / Legacies / Traits (RICHEST customisation of any faction migrated)

Budget (Army Customisation sheet): **0-1 Archetype, 0-1 Legacy, 0-2 Traits** ("If a Trait is
taken, all models/units in the army must be upgraded with it"). Production cross-check CLEAN:
11 archetypes / 7 legacies / 16 traits — matches the `.ods` exactly.

**11 Archetypes** — several are cross-faction "ally-matrix" archetypes (grant access to another
codex's Armory + a shared ability, "May not select a Legacy"):
- **Brood Brothers** → treated as Genestealer Cults (creatures gain "Ambush" 1pt/W; access GSC
  Armory).
- **Gue'vesa** → treated as Tau (gain "Supporting Fire"; access Tau Armory; Lasgun→Pulse rifle).
- **Traitor Guard** → treated as CSM (buy Marks of Chaos; access CSM Armory) — §1 Marks; bugfix
  [[project_traitor_guard_bugfix_0608]].
- **Cavalry Regiment** (Rough Riders→Troops; <12"M units must start embarked), **Mechanised
  Company** (Mech-Inf transports count 50% toward Troops 25%; single Heavy Support),
  **Ogryn Regiment** (Bullgryns/Ogryns/Ogryn Brutes→Troops, other Troops→Elite), **Tempestus
  Scions** (roster restricted to Scion units; Stormtroopers→Troops; all gain Objective secured!),
  **Veteran Company** (Veterans→Troops; all units gain+must select a Veteran ability), **War
  Hawks** (double reserve entry; no Heavy Support), **Whiteshields** (Conscripts without Platoon
  Command; 1 other Troop per Conscript Platoon), **Jungle Fighters** (Move-through/Use cover +
  Infiltrate; -1 Sv).

**7 Legacies** — uniquely, each Legacy just **grants one Legacy Order** (§4), the simplest legacy
shape after GK's "one bonus power": Death World→Burn them out! / Desert World→Get around behind
them! / Fortress World→Suppressive fire! / Frozen World→Fire on my command! / Industrial
World→Mount up! / Macropol World→Form firing squad! / **Ministorum World→"must select a third
Trait"** (the lone structural-modifier legacy, not an order grant).

**16 Traits** — flat-per-unit army-wide upgrades with the 3-column pricing of §3: Abhuman
Auxiliaries / Bionic Improvement / Born Soldiers / Cameleolin / Close Combat Specialists /
Combined Regiments (→"must select a 2nd Legacy") / Disciplined Shooters / Fanatism / Hardened
Fighters / Heavy Infantry / Heirloom Weapons / Iron Discipline / Jury-rigged repairs / Las
Fusilade / Rapid Assault / Shock Troops. (Note the self-referential budget modifiers: Ministorum
World legacy → +1 Trait; Combined Regiments trait → +1 Legacy — interacting customisation caps.)

### 6. Open questions / discrepancies found

1. **CONFIRMED DATA GAP — Veteran/Vehicle armory items untagged** (twin of `ki-gk-vetvehcategory-01`,
   candidate new KI e.g. `ki-ig-vetvehcategory-01`): IG's `armory/general.json` (50 equipment
   items, ALL `category: none`) carries the 8 Veteran Abilities + 16 Vehicle Upgrades with NO
   `category: 'veteran'|'vehicle'` tag and NO `p_veh` (0 items have it). The 8 veteran items have
   the `.ods` "MONSTROUS CREATURES & VEHICLES" value (2, or "-" for Infiltrator/Vanguard) sitting
   in `p_char` — the EXACT same misplacement GK had. **Recommend fixing FIRST, before Fase 4
   migration**, mirroring the GK fix verbatim: tag 8 veteran (`category:'veteran'`, `p_veh:2` or
   `null` for Infiltrator/Vanguard, `p_char:null`) + 16 vehicle (`category:'vehicle'`). NOTE: for
   IG, regular equipment legitimately uses `p_char` (the Armory has a real "POINTS CHARACTER
   MODELS" column) — so the `p_char→p_veh` move applies ONLY to the 8 veteran-ability rows, not
   to regular gear.
2. **Two parser-artifact `unit_type` values** (§1): an ability sentence ("Battlemutt: Once per
   game...") and a parenthetical ("(Engineseer only)") leaked into `unit_type`. Cosmetic data-
   cleanliness fix, same family as `ki-unittype-residuals-01`.
3. **⚠ Psychic disciplines + Hymns NOT wired into the loader** (`loaders.ts:123` imports only
   units+general+archetypes, no psychic JSON; `data/parsed/imperial_guard/psychic/` is empty):
   IG has psyker units (Primaris Psyker/Sanctioned Psykers/Astropath) and a full Psikana
   discipline + a Preacher Hymns system in the `.ods` canon, but production ships NO faction
   psychic-powers file — so the builder likely falls back to General psychic disciplines only,
   and the Hymns may be unrepresented. **Needs user confirmation**: is this an intentional
   simplification (orders are IG's focus, psychic is minimal) or a genuine missing-data gap? Per
   "siempre puedo pedir ayuda" — flag, don't assume. (If a gap, it's larger than the §6.1 armory
   fix and should be scoped separately.)
4. **Roster cross-check**: production 60 units across 7 populated slots (HQ 5/Troops 6/Elites 20/
   Fast Attack 7/Heavy Support 16/Dedicated Transport 5/Flyers 1; Fortifications 0) vs Index sheet
   roster names — broadly aligned; the Index lists slightly fewer named rows (some production
   units are variants, e.g. Leman Russ family). No blocking drift, but a name-by-name reconcile is
   worth a pass during migration Step 1 (Slot extraction) to confirm every production unit maps to
   an Index roster entry.

### 7. "Lo demás" pass (2026-06-13)

1. **Index "Special rules" — Orders + Weapon team crews**: both already documented as
   `special-abilities.ts` entries (Orders as the faction's signature mechanic, gated on unit type
   Infantry/Creatures vs Vehicles, plus 6 Legacy Orders; Weapon team crews under the relevant
   datasheet abilities). Orders is a 18-entry named-order system (9 Infantry/Creatures + 3
   Vehicles + 6 Legacy) that is NOT implemented as an interactive in-builder mechanic (no
   `orders.json`, no Orders UI) — this is a structural/gameplay mechanic resolved at the table,
   analogous to phase simulation, not a missing-catalog-data issue. Confirmed-absence, OUT OF
   SCOPE for this pass.
2. **Psychic disciplines — Psikana I/II (12 powers)**: confirmed 1:1 match against
   `data/parsed/imperial_guard/psychic/disciplines.json` (already fixed v0.60).
3. **Hymns of Battle (5 hymns) — NEW FIX v0.65**: the "Hymns of Battle" sheet (Catechism of
   Repugnance, Chorus of Spiritual Fortitude, Psalm of Righteous Smiting, Refrain of Blazing
   Piety, War Hymn) was in canon but not wired anywhere. Created
   `data/parsed/imperial_guard/psychic/prayers.json` (mirrors GK's prayers.json shape), wired it
   into `src/data/loaders.ts` (`case 'imperial_guard'`), and added `"is_priest": true` to the
   Preacher (Elites) so its Prayers tab now appears, matching its "Faithful: ... Knows all Hymns
   of Battle" ability text. `ki-ig-psychic-unwired-01` is now FULLY RESOLVED.
