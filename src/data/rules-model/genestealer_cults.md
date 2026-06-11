# Rules-model digest — Genestealer Cults

> Built from scratch 2026-06-11, grounded in the **`.ods` (structured canon)** per the user's
> standing directive ("básate en el .ods"), with production JSON for rules-semantics. GSC was 🔴
> (no prior digest). Prerequisite for its Fase 4 migration.

**Sources read** (2026-06-11, ALL `.ods` sheets read before deciding anything):
- `Informacion/Genestealer Cults.ods` — Index, Army Customisation, Armory, GSC psychic discipline,
  + 20 unit datasheets (STRUCTURED CANON)
- `Informacion/Custom40k Core Rules.txt` + `Custom40k Missions.txt`
- `data/parsed/genestealer_cults/` production: `units.json` (20 units + `slot_to_units`),
  `armory/general.json` (29 equipment items), `archetypes.json` (2 archetypes / 6 legacies /
  15 traits)
- `src/data/loaders.ts:genestealer_cults` (units + general + archetypes; NO psychic file)

---

## Faction: Genestealer Cults

### 1. Keyword vocabulary

- **Armour types: NONE keyword-gated.** No `armourKeyword`. GSC have no stat-tier armour items
  even — defence is via invuln items (Amulet of the Voidwyrm 4+inv, Preternatural senses 5+inv,
  Shadow stalker Deflect/Parry). No ᵀ-gate.
- **Marks: NONE.** No `locked_mark`.
- **Datasheet keywords[]: EMPTY.** All 20 units `keywords: []`.
- **Unit types** (production, 20 units): `Character Model, Infantry` (11 — GSC is very character-
  heavy), `Infantry` (3), `Vehicle` (3), `Monstrous Infantry` (1, Aberrants), `Character Model,
  Monstrous Infantry` (1, Abominant), `Bike` (1, Atalan Jackals). No parser artifacts.
- **Net:** all four axes empty — the IG/AdMech/Sororitas/Eldar/Harlequins group.

### 2. Wargear gating

| Item / group | Gate mechanism | Notes |
|---|---|---|
| General Armory items | `has_armory_access` | no `armour_compat`/`term_compat` |
| "Only for X" / "Only for infantry" / "Psykers only" / "Cult icon" prose | free-text | e.g. Atalan bike / Pervasion veil (infantry); Familiar (psykers); Pennant of Ascension (Cult icon) |
| Vehicle Equipment (7: Additional armor/Flare launcher/Improved targeting/Jammer/Smoke Launcher/Spotter/Survey augur) | `is_vehicle` + `category: 'vehicle'` | **FIXED §6.1**: tagged (POINTS already in `p_unit`) |
| **NO Veteran-Ability tier** | — | no VETERAN ABILITIES armory section; 0 `has_veteran_abilities` units — like CD/Sororitas/Dark Eldar/Eldar/Harlequins |

### 3. Points model

- **Standard equipment**: `p_unit` / `p_char` ("POINTS" + "POINTS CHARACTER MODELS"). Mirrors the
  cross-faction `getItemPts`.
- **Vehicle Equipment**: single "POINTS" column, flat `p_unit × size`. Already in `p_unit`.
- **Traits**: 3-column "NORMAL / CHARACTER / MC&V" with `*` = per Wound/Hull, per-unit army-wide.
- **NO veteran/per-Wound-or-Hull tier** — CD/Sororitas/Dark-Eldar/Eldar/Harlequins side.

### 4. Army rules / special rules

- **Ambush** (signature mechanic, Index): "For each started 500 points, one 'Ambush marker' may be
  set up after all Infiltrators deploy, 12" from any enemy. Units with 'Ambush' may be set up
  within 3" of it with any order; or 'embark' into a marker like a transport and re-enter from
  reserves next round." The defining GSC deployment/reserve mechanic (the Subterranean Ambushers
  trait grants extra markers, scaling by engagement type).
- **Psykers** (2 units `is_psyker`: Magus, Patriarch — + Crown of Ascendancy grants the Broodmind
  discipline): GSC has a faction discipline (`.ods` "GSC psychic discipline", 37 rows). **⚠ NOT
  wired into the loader — see §6.2** (same gap class as IG/Eldar/Harlequins).

### 5. Archetypes / Legacies / Traits

Budget: **0-1 Archetype, 0-1 Legacy, 0-2 Traits**. Production cross-check CLEAN: 2 archetypes /
6 legacies / 15 traits — matches the `.ods` exactly.

**2 Archetypes** (AOP-shuffle): The First Curse (Purestrain Genestealers → Troops; must take a
Patriarch; only Purestrains count to 25%), Outlander Claw (Atalan Jackals → Troops; Outflank on
turn 1; <12"M units must start embarked).

**6 Legacies** — each grants a bonus psychic power to ALL Psykers (the GK legacy shape, NOT the
armory-access shape of IG/AdMech/Sororitas/Eldar/Dark Eldar): Chancer's Vale→Last Gasp / Feinminster
Gamma→Broodvolt Surge / New Gidlam→Synaptic Blast / Newseam→Inescapable Decay / Trysst Dynasty→
Undermine / Vejovium III→Mutagenic Deviation. (These 6 named powers + the Broodmind discipline live
in the GSC psychic discipline — see §6.2 gap.)

**15 Traits** (3-column pricing): Agile Guerillas / Alien Fury / Cyborgised Hybrids / Deep Supplies
/ Devoted Zealots / Disciplined Militants / Experimental Subjects / Hunter's Instincts / Martial /
Nomadic Survivalists / Splinter Cult (→"2nd Legacy") / Subterranean Ambushers (extra Ambush
markers) / Synaptic Resonance (psyker re-roll) / Toxin Agents / War Convoy. Canonical in
`archetypes.json`.

### 6. Open questions / discrepancies found

1. **Vehicle Equipment untagged — FIXED** (`ki-genestealer-cults-vetvehcategory-01`): the 7 Vehicle
   Equipment items (idx 22-28) were `category: none`; tagged `category: 'vehicle'`. POINTS already
   in `p_unit` (no value-move). NO veteran-side fix: GSC have no veteran tier (0
   `has_veteran_abilities`).
2. **⚠ GSC psychic discipline + Legacy bonus powers not wired into the loader**
   (`ki-genestealer-cults-psychic-unwired-01`, KNOWN): the `.ods` has a "GSC psychic discipline"
   (37 rows, the Broodmind discipline) and the 6 Legacies each grant a named bonus power, and GSC
   has 2 psyker units + the Crown of Ascendancy, but `loaders.ts` imports only units+general+
   archetypes (disciplines slot `{}`). Same gap class as IG (`ki-ig-psychic-unwired-01`). The 6
   Legacy powers AND the Broodmind discipline are unrepresented. Larger separate scope.
3. **Roster cross-check**: production 20 units / 6 populated slots (HQ 4/Troops 2/Elites 10/Fast
   Attack 2/Heavy Support 1/Dedicated Transport 1; Fortifications 0, Flyers 0). The Index sheet's
   Elite column visually showed 8 names but production has 10 (the Index undercounts Kelermorph +
   Locus, present in both the sheet tab list and production). No blocking drift, no phantoms.
