# Rules-model digest — Adeptus Custodes

> Built from scratch 2026-06-11, grounded in the **`.ods` (structured canon)** per the user's
> standing directive ("básate en el .ods"), with production JSON for rules-semantics. Custodes was
> 🔴 (no prior digest). Prerequisite for its Fase 4 migration.

**Sources read** (2026-06-11):
- `Informacion/Adeptus Custodes ENG.ods` (22 sheets: Index, Army Customisation, Armory, Shield
  Host Armory, + 18 unit datasheets) — STRUCTURED CANON
- `Informacion/Custom40k Core Rules.txt` + `Custom40k Missions.txt`
- `data/parsed/adeptus_custodes/` production: `units.json` (19 units + `slot_to_units`),
  `armory/general.json` (34 equipment items), `armory/legion_shield_host.json`, `archetypes.json`
  (2 archetypes / 5 legacies / 0 traits)

---

## Faction: Adeptus Custodes

### 1. Keyword vocabulary

- **Armour types: Terminator gate EXISTS** (unlike IG/AdMech/Sororitas). The `.ods` Armory states
  "Models wearing Terminator armor can only receive equipment with ᵀ", and production carries
  `term_compat: true` on 18 of 34 armory items — the standard ᵀ-gate. The Terminator-armour wearers
  are Allarus Custodians + Aquilon Custodians (per the `.ods` datasheets). **CAVEAT (§6.2):**
  production does NOT set an `armourKeyword: "Terminator"` field on any of the 19 units — the gate
  is currently keyed through the `term_compat` boolean + name-derivation (`isTerminatorArmourName`/
  `modelRestrictsToTermSubset`), the same pre-keyword shape CSM had before its keyword-seam pass
  (see [[project_pipeline_migration]]). So the armour axis is FUNCTIONALLY populated (a single ᵀ-
  gate, like GK/Inquisition) but not yet expressed as an `armourKeyword`. No Cataphractii/Gravis
  analogue.
- **Marks / sub-factions: NONE.** No `locked_mark`; no Marks-of-Chaos archetype.
- **Shield Hosts** are a LEGACY axis, not a base keyword: the 5 Shield Hosts (Solar Watch / Aquilan
  Shield / Dread Host / Emperor's Chosen / Shadowkeepers) are unlocked by the 5 matching Legacies
  (§5), each granting that Host's Armory. Production: `armory/legion_shield_host.json`.
- **Unit types** (production, 19 units): `Infantry` (6), `Character Model, Infantry` (3), `Vehicle`
  (4), `Vehicle, Walker` (3, Contemptor/Telemon Dreadnoughts), `Jetbike` (2, Vertus Praetor +
  Jetbike Custodians), `Character Model, Jetbike` (1, Shield-Captain on Jetbike). No parser
  artifacts.
- **Datasheet keywords[]: EMPTY.** All 19 units `keywords: []`. NINTH confirmation (CSM=6, all
  others=0) that a populated datasheet axis is the CSM-only exception.
- **Net:** Custodes is structurally a GK/Inquisition sibling (single ᵀ-gate armour axis + veteran
  abilities), NOT an IG/AdMech/Sororitas sibling (all-empty). Mark/faction/datasheet axes empty.

### 2. Wargear gating

| Item / group | Gate mechanism | Notes |
|---|---|---|
| ᵀ-glyph items (18 of 34, `term_compat: true`) | Terminator armour (Allarus/Aquilon) | Standard ᵀ-gate; ".ods: Models wearing Terminator armor can only receive equipment with ᵀ" |
| Non-ᵀ items | none | universally available (e.g. Master-crafted armor, Storm shield) |
| "Only for models in Terminator armor" prose | ᵀ-derived | e.g. Balistus grenade launcher |
| Veteran Abilities (8: Counter-attack/Favoured enemy/Furious charge/Infiltrator/Outflank/Tank hunter/Terrain expert/Vanguard) | `has_veteran_abilities` (17/19 units) + `category: 'veteran'` | **FIXED §6.1**: were untagged; now tagged + `p_veh` |
| Vehicle Equipment (6: Additional armor/Hunter-killer missile/Improved targeting/Jammer/Magos-class machine spirit/Smoke Launcher) | `is_vehicle` + `category: 'vehicle'` | **FIXED §6.1**: tagged (POINTS already in `p_unit`) |

### 3. Points model

- **Standard equipment**: SINGLE "POINTS" column in the `.ods` (NO "POINTS CHARACTER MODELS"
  column — unlike IG/AdMech/Sororitas) → `p_unit` only, `p_char` mostly null. A simpler, single-
  price equipment shape (Custodes are all elite single-wound-profile models, so no character/
  squad split needed).
- **Veteran Abilities**: `.ods` "POINTS" + "POINTS MONSTROUS CREATURES & VEHICLES" columns (1/2 for
  six; 1/"-" for Infiltrator & Vanguard) + the per-model/per-Wound-or-Hull footnote → infantry pay
  `p_unit × size`, vehicles/monsters pay `p_veh × woundCount × size`. Same two-column shape as
  GK/IG/AdMech. Custodes HAS this veteran tier (17/19 units) — sits on the SM/GK side of the
  inverse-pair, NOT the CD/Sororitas side.
- **Vehicle Equipment**: single "POINTS" column, flat `p_unit × size`. Already in `p_unit`.

### 4. Army rules / special rules

- **Lightning strike** (Index): "For each started 1000 points of game size, one Infantry/Walker
  unit (incl. attached characters) may be set up using Deep Strike for +1/+4 point(s) per Wound/
  Hull Point." A points-scaled Deep-Strike grant (cf. GK's Teleport strike token economy).
- **Shield Host** (Index, army-wide): contest objectives by table-quarter + hold within 12" +
  "Objective secured!" + Battleshock cap (two tokens → one) + all attacks gain "Precision(5+)".
  The defining Custodes army rule, present on Shield-Host models.

### 5. Archetypes / Legacies / Traits

Budget (Army Customisation): **0-1 Archetype, 0-1 Legacy** — NO Traits offered at all (the budget
line omits Traits, and there is no TRAITS section). Production cross-check CLEAN: 2 archetypes /
5 legacies / 0 traits — matches the `.ods` exactly. (Traits genuinely absent — a stronger absence
than GK's "tab present, category empty"; Custodes' budget line never mentions Traits.)

**2 Archetypes** (both AOP-shuffle, no cross-faction ally-matrix):
- Kataphraktoi (Jetbike Custodians→Troops; <12"M units must start embarked; no-transport <12"M
  units can't be taken).
- Tharanatoi (Allarus + Aquilon Custodians→Troops; Custodian Guard + Sisters of Silence→Elite).

**5 Legacies** — each = one Shield Host, granting that Host's Armory: Castellans of the Blessed
Worlds→Solar Watch / Gilded Guardians→Aquilan Shield / Instruments of His Wrath→Dread Host / The
Hostless→Emperor's Chosen / Warders of the Dark Cells→Shadowkeepers. Shield Host armories in
`armory/legion_shield_host.json`.

**0 Traits** — none exist (confirmed §5 above).

### 6. Open questions / discrepancies found

1. **Veteran/Vehicle armory items untagged — FIXED** (`ki-custodes-vetvehcategory-01`): the 8
   Veteran Abilities + 6 Vehicle Equipment items were `category: none`. Tagged: veteran →
   `category: 'veteran'` + `p_veh` from the `.ods` M&V column (2 for the six, null for Infiltrator/
   Vanguard) + `p_char: null` (the value previously in `p_char` was the misplaced M&V figure, same
   as the GK/IG twins); vehicle → `category: 'vehicle'` (POINTS already in `p_unit`, like AdMech/
   Sororitas — no value-move). 17/19 units carry `has_veteran_abilities`, so the veteran tagging is
   correct (unlike AdMech, where 0 units had the flag). Build ✓.
2. **`term_compat` used but no `armourKeyword`** (keyword-seam note, not a fix): the ᵀ-gate is real
   (18 items + the `.ods` rule) but production keys it via the `term_compat` boolean + name-
   derivation, not an `armourKeyword: "Terminator"` field on Allarus/Aquilon. This is the same
   pre-keyword-seam state CSM had ([[project_pipeline_migration]]) — left as-is (the cross-faction
   keyword-engine refactor, not this migration's scope). GK, by contrast, already uses the
   `armour_compat: string[]` array shape ([[project_grey_knights_digest]]).
3. **"Vigilators" — phantom slot reference** (candidate KI `ki-custodes-vigilators-phantom-01`,
   KNOWN): `slot_to_units.Elites` lists "Vigilators" (the melee Sisters of Silence build) but there
   is NO `units["Vigilators"]` datasheet entry — a dangling roster reference (20 slot names vs 19
   unit entries). Likely a Sisters-of-Silence variant that was never split into its own datasheet,
   or a leftover roster row. Excluded from the Fase 4 codex (slots/unit-types catalogue only the 19
   real units). Needs the user to confirm whether Vigilators should be its own datasheet or removed
   from the slot index.
4. **Roster cross-check**: production 19 units / 7 populated slots (HQ 4/Troops 3/Elites 7 [6 real
   + Vigilators phantom]/Fast Attack 1/Heavy Support 3/Dedicated Transport 2; Fortifications 0,
   Flyers 0). Matches the Index roster apart from the Vigilators phantom (§6.3) and "Vertus Praetor"
   (production) vs "Vertus Praetors" (sheet name) — cosmetic singular/plural.
