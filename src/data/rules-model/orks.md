# Rules-model digest — Orks

> Built from scratch 2026-06-11, grounded in the **`.ods` (structured canon)** per the user's
> standing directive ("básate en el .ods"), with production JSON for rules-semantics. Orks was 🔴
> (no prior digest). Prerequisite for its Fase 4 migration. Datasheet-level spot-checks done (Boyz +
> Battlewagon vs production — both match exactly).

**Sources read** (2026-06-11, ALL `.ods` structural sheets read + 2 datasheet spot-checks):
- `Informacion/Orks ENG.ods` — Index, Army Customisation, Armory, Clan Armory, Ork psychic
  discipline, + 41 unit datasheets (sampled Boyz/Battlewagon) (STRUCTURED CANON)
- `Informacion/Custom40k Core Rules.txt` + `Custom40k Missions.txt`
- `data/parsed/orks/` production: `units.json` (41 units + `slot_to_units`), `armory/general.json`
  (62 equipment items), `armory/legion_clan.json`, `archetypes.json` (2 archetypes / 6 legacies /
  14 traits)
- `src/data/loaders.ts:orks` (units + general + archetypes + Clan armory as the 'Klan' legacy; NO
  psychic file)

---

## Faction: Orks

### 1. Keyword vocabulary

- **Armour types: Mega armor gate EXISTS** (a populated armour axis — like Custodes/CSM, NOT the
  empty-armour group). The `.ods` Armory states "Models in Mega armor can only receive equipment
  with ᵀ", and production encodes this via the **ᴹ glyph** suffixed to item names (32 of 62 armory
  items carry ᴹ, e.g. "Ammo grotᴹ", "Boss poleᴹ", "Mega armorᴹ"-gated). CAVEAT (§6.2): the gate is
  keyed via the ᴹ name-glyph, NOT an `armourKeyword` field NOR `term_compat` (both absent: 0
  `term_compat`, 0 `armourKeyword`). Mega armor is itself a purchasable item (Mega armor, 22/42
  pts) that grants the ᴹ-armoured status. A glyph-encoded armour axis (the same family as CSM mark
  glyphs — see the ᵀ/ᴹ/marks glyph-collision policy in memory).
- **Marks: NONE.** No `locked_mark`.
- **Sub-faction-ish keywords `<Squig>` / `<Wildork>`**: referenced in equipment (Squighog steed /
  Squigosaur grant `<Squig>` + Bike type; Wildork grants `<Wildork>` + 6+inv) — GRANTED by armory
  options, NOT carried as base unit `keywords[]` (all 41 units `keywords: []`). Also `<Klan>` is the
  Legacy/Clan axis (§5), not a base keyword.
- **Unit types** (production, 41 units): `Infantry` (13), `Vehicle` (11), `Character Model,
  Infantry` (6), `Flyer` (3), `Bike` (2), `Walker` (2, Deff Dreads/Killa Kans), `Jetbike` (1,
  Deffkoptaz), `Jump Pack Infantry` (1, Stormboyz), `Super-heavy Vehicle` (1, Battle Fortress),
  `Monstrous Creature` (1, Squiggoth). No parser artifacts. FIRST faction migrated with a populated
  Fortifications slot.
- **Datasheet keywords[]: EMPTY.** All 41 units `keywords: []`.

### 2. Wargear gating

| Item / group | Gate mechanism | Notes |
|---|---|---|
| ᴹ-glyph items (32 of 62) | Mega armor (ᴹ name-glyph) | ".ods: Models in Mega armor can only receive equipment with ᵀ" — production uses the ᴹ glyph |
| "Only for X" prose (Gretchins/Flyers/Mek/Walker/infantry/<Wildork>) | free-text | per-item unit restrictions |
| Kustom Jobs (16: Bionik Oiler/Da Booma/Eavy armour cabin/.../Zzapkrumpaz) | unit-gated unique upgrades ("X only") | a DISTINCT Ork mechanic — each Kustom job is unique, gated to specific units (Vehicle/Mek/Walker/Spanna/Warbuggy only). Left `category: none` (NOT vehicle-only — many are Mek/character; gated by prose). The Waaagh! Coast Kustoms trait lets each be taken +1 time |
| Vehicle Upgrades (13: Additional armor/Armored hood/Boarding plank/Death roller/Grab claw/Grot mechanic/Nozzle drive/Red paint/Reinforced battering ram/Smoke launcher/Stikkbombz launcha/Target squig/Wrecking ball) | `is_vehicle` + `category: 'vehicle'` | **FIXED §6.1**: tagged (POINTS already in `p_unit`) |
| **NO Veteran-Ability tier** | — | no VETERAN ABILITIES armory section; 0 `has_veteran_abilities` units (the "Thinking cap" equipment grants a selectable Counter-attack/Favoured enemy/Tank hunter, but that is an item, not the veteran tier) |

### 3. Points model

- **Standard equipment**: `p_unit` / `p_char` ("POINTS" + "POINTS CHARACTER MODELS"). Mirrors the
  cross-faction `getItemPts`.
- **Kustom Jobs**: single "POINTS" column → `p_unit`, `p_char` null. Priced per-unit, gated by prose.
- **Vehicle Upgrades**: single "POINTS" column, flat `p_unit × size`. Already in `p_unit`.
- **Traits**: 3-column "NORMAL / CHARACTER / MC&V" with `*` = per Wound/Hull, per-unit army-wide.
- **NO veteran/per-Wound-or-Hull tier** — the CD/Sororitas/Aeldari/GSC side of the inverse-pair.

### 4. Army rules / special rules

- **Waaagh!** (signature mechanic, Index): "Declare a Waaagh! once per game at the start of the
  Command phase, lasting two battle rounds. Infantry and Walkers with the 'Waaagh!' rule gain +D6"
  Movement... Other vehicles/Bikes/Jump-pack infantry gain 'Deflect' instead if they moved their
  max (≥8"). In Skirmish the effect lasts one round." The defining Ork army-wide rule.
- **Mob** (Index): Leadership scaling by squad size (+1 Ld per 5 models; Fearless at 20+; depleted
  units may merge with another Mob unit). The Ork horde mechanic.
- **Dakka Dakka Dakka** (Index): "Reduce total ranged to-hit penalty by -1 (min 0). Not for Barrage/
  Explosive." Army-wide.
- **Tellyporta** (Index): "For every 1000 points, a unit may Deep Strike for +1/+4 per Wound/Hull
  Point. All Ork units have this rule." (Same shape as Custodes Lightning strike / GK Teleport
  strike — but on ALL units.)
- **Psykers** (2 units `is_psyker`: Weirdboy + Big Mek?): Orks have a faction discipline (`.ods`
  "Ork psychic discipline" = the Waaagh! discipline, 19 rows). **⚠ NOT wired into the loader — see
  §6.3** (same gap class as IG/Eldar/Harlequins/GSC).

### 5. Archetypes / Legacies / Traits

Budget: **0-1 Archetype, 0-1 Legacy, 0-2 Traits**. Production cross-check CLEAN: 2 archetypes /
6 legacies / 14 traits — matches the `.ods` exactly.

**2 Archetypes**: Krumpa Kompany (roster restricted to Boss/Mek/Painboy/Nobs/Battlewagons/Deff
Dreads; Nobs→Troops; all must take Mega armor; all gain Objective secured!), Speedfreaks (Stormboyz/
Warbikers→Troops; <12"M units must start embarked).

**6 Legacies** — each = one Klan (granting that Klan's Clan Armory, loaded as the 'Klan' legacy):
Da 'ardest Boyz→Goff / Da Rich Boyz→Bad Moons / Da Sneaky Gitz→Blood Axes / Da Speedfreaks→Evil
Sunz / Da Squig-Luvvas→Snakebites / Da Lootaz→Deathskulls.

**14 Traits** (3-column pricing; several keyword-prose-gated "Only for Gretchins/Flyers"): 'orrible
Gitz / Armed To Da Teeth / Big Krumpaz / Big Red Button / Boom Boyz / Flyboyz / Lucky Gitz / Mixed
Warband (→"2nd Legacy") / No messing around here / Pyromaniacs / Rascals / Taktiks / The Old Ways /
Waaagh! Coast Kustoms (each Kustom job +1 time). Canonical in `archetypes.json`.

### 6. Open questions / discrepancies found

1. **Vehicle Upgrades untagged — FIXED** (`ki-orks-vetvehcategory-01`): the 13 Vehicle Upgrades
   (idx 49-61) were `category: none`; tagged `category: 'vehicle'`. POINTS already in `p_unit` (no
   value-move). The 16 Kustom Jobs (idx 33-48) were deliberately LEFT `category: none` — they are a
   distinct unit-gated mechanic (not all vehicle-only; many are Mek/Walker/Spanna/character), gated
   by prose "X only", not by `is_vehicle`. NO veteran-side fix: Orks have no veteran tier (0
   `has_veteran_abilities`).
2. **Mega armor gated via ᴹ name-glyph, not `armourKeyword`/`term_compat`** (keyword-seam note, not
   a fix): the armour axis is real (Mega armor, 32 ᴹ-items + the `.ods` rule) but production keys it
   via the ᴹ glyph suffix, not an `armourKeyword: "Mega armor"` field. Same pre-keyword-seam family
   as CSM mark-glyphs / Custodes term_compat ([[project_pipeline_migration]]). Left as-is (the
   cross-faction keyword-engine refactor is out of this migration's scope).
3. **⚠ Ork (Waaagh!) psychic discipline not wired into the loader** (`ki-orks-psychic-unwired-01`,
   KNOWN): the `.ods` has an "Ork psychic discipline" (19 rows, the Waaagh! discipline), and Orks
   have psyker units (Weirdboy), but `loaders.ts` imports only units+general+archetypes+Clan armory
   (disciplines slot `{}`). Same gap class as IG/Eldar/Harlequins/GSC. Larger separate scope.
4. **Roster cross-check**: production 41 units / 8 populated slots (HQ 4/Troops 5/Elites 8/Fast
   Attack 7/Heavy Support 10/Dedicated Transport 4/Fortifications 1/Flyers 2). FIRST faction with a
   populated Fortifications slot (Big'ed Bossbunka). No phantoms; matches the Index roster. (Minor:
   Looted Valkyrie [Flyer] + Squiggoth [Monstrous Creature] sit in Dedicated Transport per
   production — looted/beast transports.)
