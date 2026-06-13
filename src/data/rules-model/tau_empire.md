# Rules-model digest — T'au Empire

> Built from scratch 2026-06-11, grounded in the **`.ods` (structured canon)** per the user's
> standing directive ("básate en el .ods"), with production JSON for rules-semantics. T'au was
> 🔴/partial (no prior digest). Prerequisite for its Fase 4 migration. Datasheet spot-check done
> (Crisis Battlesuits + Hammerhead Gunship vs production — both match).

**Sources read** (2026-06-11, ALL `.ods` structural sheets read + 2 datasheet spot-checks):
- `Informacion/Tau Empire ENG.ods` — Index, Army Customisation, Armory, Sept Armory, Invocations of
  the Ethereals, Tau Drones, + 45 unit datasheets (STRUCTURED CANON)
- `Informacion/Custom40k Core Rules.txt` + `Custom40k Missions.txt`
- `data/parsed/tau_empire/` production: `units.json` (42 units + `slot_to_units`),
  `armory/general.json` (60 equipment + 6 weapons), `armory/legion_sept.json`, `archetypes.json`
  (3 archetypes / 7 legacies / 17 traits)
- `src/data/loaders.ts:tau_empire` (units + general + archetypes + Sept armory; NO psychic file)

---

## Faction: T'au Empire

### 1. Keyword vocabulary

- **Armour / Infantry axis: the ᴵ glyph gate.** The `.ods` Armory states "Infantry models may only
  use equipment marked with ᵀ" (twice — for general equipment and again for Support Systems with a
  single-pick limit). Production encodes this via the **ᴵ glyph** suffixed to the Infantry-usable
  item names (e.g. "Repulsor impact fieldᴵ", "Shield generatorᴵ"). CAVEAT (§6.2): glyph-encoded (ᴵ
  in the name), NOT an `armourKeyword` field nor `term_compat` (both absent). A glyph-encoded
  Infantry-restriction axis (same family as Orks ᴹ / Votann ᴱ glyphs).
- **Kroot sub-faction: encoded in `unit_type`, not `keywords[]`.** ~9 units carry "Kroot" inside
  their `unit_type` string (e.g. "Character, Infantry, Kroot", "Bike, Kroot", "Monstrous Creature,
  Kroot"). The Kroot Hunting Pack archetype gates on Kroot. So Kroot is a sub-type living in
  `unit_type`, NOT a `keywords[]` axis (which is empty on all 42 units). A different encoding from
  Dark Eldar's keywords[] sub-factions.
- **Marks: NONE.** No `locked_mark`. (Septs are the Legacy axis, §5.)
- **Datasheet keywords[]: EMPTY.** All 42 units `keywords: []` (Kroot lives in unit_type, §above).
- **Unit types**: very varied — many "Jump pack, Monstrous Infantry/Creature" (battlesuits), "...,
  Kroot" composites, `Vehicle` (8 base + Tidewall fortifications), `Flyer` (3). Battlesuits are
  Jump-pack Monstrous types, not vehicles.

### 2. Wargear gating

| Item / group | Gate mechanism | Notes |
|---|---|---|
| ᴵ-glyph items | Infantry-usable (ᴵ name-glyph) | ".ods: Infantry models may only use equipment marked with ᵀ" |
| Battlesuit upgrades (XV22/XV81/XV84/XV85/XV86 Coldstar/Supernova/Enforcer) | "Can't be combined with other battlesuits" prose | each transforms the suit (type/stats); mutually exclusive |
| SUPPORT SYSTEMS (14: Blacksun filter/Command and control node/Counterfire defence/Early warning override/Earth caste pilot array/Multi-tracker/Neuroweb jammer/Photon caster/Positional relay/Repulsor impact field/Shield generator/Target lock/Vectored retro-thrusters/Velocity tracker) | per-unit (POINTS + POINTS HQ); infantry pick ONE | a DISTINCT Tau mechanic (like Orks Kustom Jobs). Left `category: none` (NOT vehicle-only) |
| Tau Drones | drone catalogue (`Tau Drones` sheet) | bought by models "with access to drones" (Swarm Controllers trait raises the cap) |
| Vehicle Equipment (11: Blacksun filter/Decoy launchers/Disruption pod/Failsafe detonator/Flechette discharger/Jammer/Landing gear/Multi-tracker/Seeker missile/Smoke Launcher/Target lock) | `is_vehicle` + `category: 'vehicle'` | **FIXED §6.1**: tagged (POINTS already in `p_unit`) |
| **NO Veteran-Ability tier** | — | no VETERAN ABILITIES section; 0 `has_veteran_abilities` units |

### 3. Points model

- **Standard equipment**: `p_unit` / `p_char` ("POINTS" + "POINTS CHARACTER"). Support Systems have
  a "POINTS HQ" second column (HQ override). Mirrors the cross-faction `getItemPts`.
- **Vehicle Equipment**: single "POINTS" column, flat `p_unit × size`. Already in `p_unit`.
- **Traits**: 3-column "NORMAL / CHARACTER / MC&V" with `*` = per Wound/Hull, per-unit army-wide.
- **NO veteran/per-Wound-or-Hull tier**.

### 4. Army rules / special rules

- **Markerlight** (signature mechanic, Index): a token economy — units place Markerlight tokens on
  enemies; tokens are spent (1-3 each) for benefits (auto-hit Seeker missiles / -Ld / Sunder /
  -Defensive-Fire penalty / re-roll 1s / Battleshock test / off-board Seeker missile hit). Max 4
  tokens per enemy unit. The defining Tau targeting mechanic.
- **Supporting Fire** (Index): a friendly unit within 6" of a charged unit may also use Defensive
  Fire at the charger (uses its own order token). (The Demiurg/Votann ally + Defenders of the Cause
  trait extend this.)
- **Tactical philosophies** (equipment, army-wide, Unique): pick Kauyon / Mont'ka / Rinyon / Rip'yka
  at deployment (10p per 500p game size).
- **Psykers**: NONE in the base roster (0 `is_psyker`). The Kroot Hunting Pack archetype can upgrade
  a Kroot Master Shaper to a Shaman (psyker, Biomancy/Divination). Ethereals have **Invocations of
  the Ethereals** (a prayer-like system, `.ods` sheet). **⚠ Neither wired into the loader — see
  §6.4.**

### 5. Archetypes / Legacies / Traits

Budget: **0-1 Archetype, 0-1 Legacy, 0-2 Traits**. Production cross-check CLEAN: 3 archetypes /
7 legacies / 17 traits — matches the `.ods` exactly.

**3 Archetypes**: Farsight Enclave (Crisis Battlesuits→Troops; no Ethereals; Broadside/Riptide can
take an HQ slot as singles), Kroot Hunting Pack (Kroot Farstalkers→Objective Secured; Master Shaper→
Shaman psyker; only Kroot count to mandatory minimums + 25% Troops), Stealth Cadre (Stealth
Battlesuits→Troops; Ghostkeel→Troops per 6 Stealth models; must take a Commander w/ XV22 Stalker).

**7 Legacies** — each = one Sept, granting that Sept's Armory (loaded as the 'Sept' legacy):
Devastating Counterstrike→Farsight Enclaves / Hunter's Instincts→Kroot Kindred / Masters of Urban
Warfare→Sa'cea / Strength of Conviction→T'au / Strike Fast→Vior'la / Superior Craftsmanship→Bork'an
/ Unifying Influence→Dal'yth.

**17 Traits** (3-column pricing): Advanced Miniaturization / Blacklight Markers / Calm under Pressure
/ Camouflage Experts / Combined Expansion (→"2nd Legacy") / Defenders of the Cause / Defensive
Doctrines / Disengagement Protocols / Evasive Maneuvers / Fire Caste Marksman / Fire Saturation /
Loyal to the End / Reliable Weaponry / Signature Evolutionary Adaption (Kroot adaptation pick) /
Strike Swiftly / Swarm Controllers (more drones) / Turbo Jets. Canonical in `archetypes.json`.

### 6. Open questions / discrepancies found

1. **Vehicle Equipment untagged — FIXED** (`ki-tau-empire-vetvehcategory-01`): the 11 Vehicle
   Equipment items (idx 49-59) were `category: none`; tagged `category: 'vehicle'`. POINTS already
   in `p_unit` (no value-move). The 14 Support Systems were deliberately LEFT `category: none` — a
   distinct per-unit mechanic (infantry pick one; the "POINTS HQ" column applies), NOT vehicle-only.
   Several names appear in BOTH Support Systems and Vehicle Equipment (Blacksun filter / Multi-
   tracker / Target lock / Jammer) — only the vehicle block (idx 49-59) was tagged. NO veteran-side
   fix: 0 `has_veteran_abilities` units.
2. **Infantry gate via ᴵ name-glyph** (keyword-seam note): the ".ods: Infantry may only use ᵀ-marked
   equipment" gate is encoded via the ᴵ glyph in production, not `armourKeyword`/`term_compat` —
   same pre-keyword-seam family as Orks ᴹ / Votann ᴱ. Left as-is.
3. **Kroot sub-faction in `unit_type`, not `keywords[]`**: ~9 Kroot units carry "Kroot" inside their
   `unit_type` string; the Kroot Hunting Pack archetype gates on it. A different encoding from Dark
   Eldar's keywords[] sub-factions — worth noting for any future keyword-engine refactor (Kroot
   could be promoted to a `keywords[]` entry to match the Dark Eldar model).
4. **Ethereal Invocations — RESOLVED v0.68, Kroot Shaman remains KNOWN**
   (`ki-tau-empire-psychic-unwired-01`): the v0.60 batch extracted "Invocations of the Ethereals"
   into `disciplines.json` under the key "Powers", but the Ethereal has `is_psyker: false` so it
   never rendered (dead data). v0.68 moved it to `data/parsed/tau_empire/psychic/prayers.json`
   (matches IG Hymns of Battle shape — the Ethereal's "Serene unifier" ability is Faithful-style)
   and set the Ethereal's `is_priest: true`. REMAINING (KNOWN): the Kroot Hunting Pack archetype's
   Shaman (Biomancy/Divination, archetype-granted psyker) is still unrepresented — separate scope.
5. **Roster cross-check**: production 42 units / 8 populated slots (HQ 5/Troops 4/Elites 7/Fast
   Attack 14/Heavy Support 5/Dedicated Transport 1/Fortifications 3/Flyers 3). Uses every slot
   (Fortifications = 3 Tidewall pieces). No phantoms; matches the Index roster. (Index "Great
   Knarloc" = production "Great Knarloc" in Fast Attack — Kroot beast.)

### 7. "Lo demás" pass (2026-06-13)

1. **Index "Special rules"**: §4 (Markerlight, Supporting Fire, Tactical philosophies) was already
   built directly from the `.ods` during the Fase 4 digest — [[feedback_lo_demas_ods_not_html]], no
   re-derivation needed. No gaps.
2. **Psychic disciplines / prayers**: §6.4 flagged a psychic gap (`ki-tau-empire-psychic-unwired-01`).
   Checking it revealed the v0.60 extraction was DEAD DATA (wired as `disciplines.Powers` but the
   Ethereal has `is_psyker: false`, so it never rendered). NEW FIX v0.68: moved the 2 Invocations
   (Sense of Stone, Zephyr's Grace) to `data/parsed/tau_empire/psychic/prayers.json`, wired as
   Prayers, and set the Ethereal's `is_priest: true` — same shape as IG Hymns of Battle. The Kroot
   Shaman remaining scope (archetype-granted Biomancy/Divination) stays KNOWN, untouched.

**T'au "lo demás" complete** — Index already grounded in .ods; Ethereal Invocations now actually
wired (was dead data). Build ✓, changelog v0.68, local NOT pushed.
