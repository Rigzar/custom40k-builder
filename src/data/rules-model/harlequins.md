# Rules-model digest — Harlequins

> Built from scratch 2026-06-11, grounded in the **`.ods` (structured canon)** per the user's
> standing directive ("básate en el .ods"), with production JSON for rules-semantics. Harlequins was
> 🔴 (no prior digest). Prerequisite for its Fase 4 migration. SMALLEST faction (9 units).

**Sources read** (2026-06-11):
- `Informacion/Harlequins.ods` (13 sheets: Index, Armory, Harlequins psychic discipline, + 9 unit
  datasheets — NOTE no "Army Customisation" sheet) — STRUCTURED CANON
- `Informacion/Custom40k Core Rules.txt` + `Custom40k Missions.txt`
- `data/parsed/harlequins/` production: `units.json` (9 units + `slot_to_units`),
  `armory/general.json` (21 equipment items). NO `archetypes.json` (none exists).
- `src/data/loaders.ts:harlequins` (imports units + general armory ONLY — `noArch`, no psychic file)

---

## Faction: Harlequins

### 1. Keyword vocabulary

- **Armour types: NONE keyword-gated.** No `armourKeyword`. No ᵀ-gate.
- **Marks: NONE.** No `locked_mark`.
- **Datasheet keywords[]: EMPTY.** All 9 units `keywords: []`.
- **Unit types** (production, 9 units): `Character Model, Infantry` (3, Great Harlequin/Death
  Jester/Shadowseer), `Infantry` (2, Troupe/Solitaire), `Vehicle` (2, Voidweaver/Starweaver),
  `Jetbike` (1, Skyweavers), `Monstrous Creature` (1, Harlequin Wraithlord). No parser artifacts.
- **Net:** all four axes empty — the IG/AdMech/Sororitas/Eldar group. The simplest keyword
  vocabulary alongside Inquisition.

### 2. Wargear gating

| Item / group | Gate mechanism | Notes |
|---|---|---|
| General Armory items | `has_armory_access` | no `armour_compat`/`term_compat` |
| "Only for infantry" prose | free-text | e.g. Eldar jetbike |
| Vehicle Equipment (6: Holo-field/Improved targeting/Jammer/Night shield/Smoke Launcher/Spirit stones) | `is_vehicle` + `category: 'vehicle'` | **FIXED §6.1**: tagged (POINTS already in `p_unit`) |
| **NO Veteran-Ability tier** | — | no VETERAN ABILITIES armory section; 0 `has_veteran_abilities` units — like CD/Sororitas/Dark Eldar/Eldar |

### 3. Points model

- **Standard equipment**: `p_unit` / `p_char` ("POINTS" + "POINTS CHARACTER" columns). Mirrors the
  cross-faction `getItemPts`.
- **Vehicle Equipment**: single "POINTS" column, flat `p_unit × size`. Already in `p_unit`.
- **NO veteran/per-Wound-or-Hull tier** — CD/Sororitas/Dark-Eldar/Eldar side of the inverse-pair.
- **NO traits** (no Army Customisation — see §5).

### 4. Army rules / special rules

- **Shuriken** (Index): "To wound rolls of 5+ gain additional -2 AP." (Same as Eldar.)
- **Webway strike** (Index): "For each started 1000 points, one infantry unit may be set up using
  Infiltrators for +1 point per Wound." (Same as Eldar.)
- **Psyker** (1 unit `is_psyker`: Shadowseer): Harlequins have a faction psychic discipline (`.ods`
  "Harlequins psychic discipline", 19 rows). **⚠ NOT wired into the loader — see §6.2** (same gap
  class as IG `ki-ig-psychic-unwired-01` / Eldar `ki-eldar-psychic-unwired-01`).
- **Ally faction**: Harlequins are accessed by BOTH Eldar and Dark Eldar via their "Visitors of the
  Black Library" army rule ("Harlequins cannot be the mandatory HQ selection") — Harlequins are a
  small standalone faction that doubles as a native ally for the two Aeldari codices.

### 5. Archetypes / Legacies / Traits

**NONE — confirmed absence.** There is NO "Army Customisation" sheet in `Harlequins.ods`, and
production has NO `archetypes.json` (the loader passes `noArch`). Same structural shape as
Inquisition ([[project_inquisition_codex_migration]] — "no archetypes/legacies/traits, Army
Customisation tab absent"). Harlequins is the second faction (after Inquisition) with a genuinely
absent Army Customisation tab.

### 6. Open questions / discrepancies found

1. **Vehicle Equipment untagged — FIXED** (`ki-harlequins-vetvehcategory-01`): the 6 Vehicle
   Equipment items (idx 15-20) were `category: none`; tagged `category: 'vehicle'`. POINTS already
   in `p_unit` (no value-move). NO veteran-side fix: Harlequins have no veteran tier (0
   `has_veteran_abilities`).
2. **⚠ Harlequins psychic discipline not wired into the loader** (`ki-harlequins-psychic-unwired-01`,
   KNOWN): the `.ods` has a "Harlequins psychic discipline" (19 rows), and the Shadowseer is a
   psyker, but `loaders.ts:harlequins` imports only units + general armory (disciplines slot `{}`).
   Same gap class as IG/Eldar. Larger separate scope (parse discipline + wire loader). NOTE: when
   Harlequins are fielded as an Eldar/Dark-Eldar ally, the discipline gap compounds with those
   factions' own psychic gaps.
3. **Roster cross-check**: production 9 units / 6 populated slots (HQ 1/Troops 1/Elites 3/Fast
   Attack 1/Heavy Support 2/Dedicated Transport 1; Fortifications 0, Flyers 0) — exact match to the
   Index roster. Clean, no phantoms.
