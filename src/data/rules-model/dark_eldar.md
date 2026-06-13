# Rules-model digest — Dark Eldar

> Built from scratch 2026-06-11, grounded in the **`.ods` (structured canon)** per the user's
> standing directive ("básate en el .ods"), with production JSON for rules-semantics. Dark Eldar was
> 🔴 (no prior digest). Prerequisite for its Fase 4 migration.

**Sources read** (2026-06-11):
- `Informacion/Dark Eldar ENG.ods` (24 sheets: Index, Army Customisation, Armory, Coven Armory,
  Kabal Armory, Wych Armory, + 20 unit datasheets) — STRUCTURED CANON
- `Informacion/Custom40k Core Rules.txt` + `Custom40k Missions.txt`
- `data/parsed/dark_eldar/` production: `units.json` (19 units + `slot_to_units`),
  `armory/general.json` (39 equipment items), Coven/Kabal/Wych legacy armories, `archetypes.json`
  (5 archetypes / 3 legacies / 22 traits)

---

## Faction: Dark Eldar

### 1. Keyword vocabulary

- **Sub-faction axis (Kabal / Coven / Cult): POPULATED datasheet `keywords[]`** — this is the
  HEADLINE finding. Dark Eldar is the **SECOND faction (after CSM) with a populated `keywords[]`
  datasheet axis** (CD/SM/Inquisition/GK/IG/AdMech/Sororitas/Custodes all had it empty). The three
  Dark Eldar sub-factions are modelled exactly via this array (the target keyword model, decision
  2026-06-03):
  - **Kabal** (2): Dracon, Kabalite Warriors
  - **Coven** (5): Haemonculus, Wracks, Grotesques, Cronos, Talos
  - **Cult** (4): Succubus, Wyches, Hellions, Reavers  (= the `.ods` `<Wyches>`/`<Cult>`)
  - **"-"** (3, no sub-faction): Incubi, Mandrakes, Scourges
  - **"Coven, Cult, Kabal"** (5, available to all): Ravager, Raider, Venom, Razorwing Jetfighter,
    Voidraven Bomber (the shared vehicles/flyers)
  This axis drives the archetype roster-restrictions (Trueborn = Kabal-only, Haemoxytes = Coven-only,
  Bloodbrides = Cult-only) AND the trait gating ("Only for <Coven>/<Cult>/<Kabal>", §5).
- **Armour types: NONE keyword-gated.** No `armourKeyword` on any unit. Armour = stat-tier Armory
  buy (Ghostplate 5+inv, Executioner's armour 2+, Shadow field 2+inv one-shot, etc.).
- **Marks: NONE.** No `locked_mark` (the sub-faction axis is the `keywords[]` array, NOT the
  `locked_mark` mark-attribute that CSM/CD use — a different primitive for a mark-like concept).
- **Unit types** (production, 19 units): `Infantry` (6), `Character Model, Infantry` (3), `Vehicle`
  (3), `Monstrous Creature` (2, Cronos/Talos), `Jump Pack Infantry` (2, Hellions/Scourges), `Flyer`
  (2), `Jetbike` (1, Reavers). No parser artifacts in the types.
- **Net:** armour/mark axes empty, but the `datasheet` axis is POPULATED with the sub-faction —
  structurally the closest faction to CSM so far (both have a real datasheet keyword axis).

### 2. Wargear gating

| Item / group | Gate mechanism | Notes |
|---|---|---|
| General Armory items | `has_armory_access` | no `armour_compat`/`term_compat` (no ᵀ-gate) |
| "Only for <Coven>/<Cult>/<Kabal>" prose+glyph | sub-faction `keywords[]` match | items/traits restricted to a sub-faction (the `?`/`??` glyphs in the `.ods` map to the sub-factions) |
| Sub-faction legacy armories (Coven/Kabal/Wych) | Legacy unlock | the 3 Legacies each grant one sub-faction's armory (§5) |
| Combat Drugs (6: Adrenalight/Grave lotus/Hypex/Serpentin/Painbringer/Splintermind) | per-unit pick (Combat drugs army rule) | NOT vehicle/veteran — a separate selectable pool (idx 26-31, left `category: none`) |
| Vehicle Equipment (7: Additional armor/Bladevanes/Flickerfield/Improved targeting/Night shield/Smoke Launcher/Trophy) | `is_vehicle` + `category: 'vehicle'` | **FIXED §6.1**: tagged (POINTS already in `p_unit`) |
| **NO Veteran-Ability tier** | — | no VETERAN ABILITIES armory section; 0 `has_veteran_abilities` units — like Chaos Daemons/Sororitas |

### 3. Points model

- **Standard equipment**: `p_unit` (per-model) / `p_char` (flat CHARACTER override) — two columns.
  Mirrors the cross-faction `getItemPts`.
- **Vehicle Equipment**: single "POINTS" column, flat `p_unit × size`. Already in `p_unit`
  (Flickerfield = "-" / null, can't be selected). No value-move needed.
- **Traits**: 3-column "NORMAL / CHARACTER / MC&V" with `*` = per Wound/Hull, per-unit army-wide.
- **NO veteran/per-Wound-or-Hull tier** — Dark Eldar sit on the Chaos-Daemons/Sororitas side of the
  veteran-pricing inverse-pair ([[project_space_marines_codex_migration]]).

### 4. Army rules / special rules

- **Combat drugs** (Index): "After all units have been set up, you may pick a combat drug for the
  unit. Its effect lasts for the remaining battle." 6 drugs (§2). The Stimulant supply equipment +
  Splintermind drug interact.
- **Power through Pain** (Index): a token economy — "Each time an enemy unit is destroyed, the army
  gains a 'Power Through Pain' token, assigned a special rule from the list, distributed to any
  friendly PtP unit." 6 bonuses: Aegis(4+) / Berserk(4+) / Furious Charge / +1 Initiative / +1
  Leadership / +1 Strength. (NOTE: "Furious Charge" — a PtP bonus NAME — leaked into the Elites slot
  index as a phantom unit, §6.2.)
- **Visitors of the Black Library** (Index): "The army has access to Harlequin units. Harlequins
  cannot be the mandatory HQ selection." A native-ally grant (cross-ref Harlequins faction).
- **Webway raid** (Index): "For each started 1000 points, one infantry unit may be set up using
  Infiltrators for +1 point per wound." A points-scaled Infiltrate grant (cf. Custodes Lightning
  strike / GK Teleport strike).

### 5. Archetypes / Legacies / Traits

Budget: **0-1 Archetype, 0-1 Legacy, 0-2 Traits**. Production cross-check CLEAN: 5 archetypes /
3 legacies / 22 traits — matches the `.ods` exactly.

**5 Archetypes** — three are SUB-FACTION-PURITY archetypes (army restricted to one sub-faction's
`keywords[]`), gating directly on the §1 datasheet axis:
- Trueborn (Kabal-only), Haemoxytes (Coven-only), Bloodbrides (Cult-only) — each "+1 Ld + double
  weapon-swap allowance".
- Coordinated Raid (3rd HQ slot, must field one Dracon + Haemonculus + Succubus; 3rd trait, one
  each for <Coven>/<Kabal>/<Wyches>).
- Ynnari → cross-faction (Battle Brothers for Eldar; access Ynnari Armory + Revenant discipline;
  "no Legacy").

**3 Legacies** — each grants one sub-faction's armory: Butchers of Flesh→Coven / Spectacle of
Murder→Wych / Thirst for Power→Kabal.

**22 Traits** — ALL sub-faction-gated via the `?`/`??` glyph → "Only for <Coven>/<Cult>/<Kabal>"
(the most granular trait-gating of any faction migrated; many are additionally "Only for
creatures"). Examples: Acrobatic Display / Dark Technomancers / Masters of Mutagens / Merciless
Razorkin / Splinter Blades / The Art of Pain (re-triggers the Power-through-Pain table in melee) /
Toxin Crafters. Canonical in `archetypes.json`.

### 6. Open questions / discrepancies found

1. **Vehicle Equipment untagged — FIXED** (`ki-dark-eldar-vetvehcategory-01`): the 7 Vehicle
   Equipment items (idx 32-38) were `category: none`; tagged `category: 'vehicle'`. POINTS already
   in `p_unit` (like AdMech/Sororitas/Custodes — no value-move). Flickerfield is "-"/null (can't be
   selected). Combat Drugs (idx 26-31) deliberately left `category: none` — they are a separate
   selectable pool (the Combat drugs army rule), not vehicle/veteran items. NO veteran-side fix:
   Dark Eldar have no veteran tier (like CD/Sororitas).
2. **"Furious Charge" — phantom slot reference** (candidate KI `ki-dark-eldar-furiouscharge-phantom-01`,
   KNOWN): `slot_to_units.Elites` lists "Furious Charge" but there is NO `units["Furious Charge"]`
   datasheet — it is a Power-through-Pain BONUS name (Index special-rules list: "Aegis(4+) /
   Berserk(4+) / Furious Charge / +1 Initiative / ...") that leaked into the Elites slot index (20
   slot names vs 19 unit entries). Excluded from the Fase 4 codex. Same class as the Custodes
   "Vigilators" phantom (`ki-custodes-vigilators-phantom-01`). Needs the user to confirm removal
   from the slot index.
3. **Roster cross-check**: production 19 units / 7 populated slots (HQ 3/Troops 3/Elites 3 [+1
   "Furious Charge" phantom]/Fast Attack 3/Heavy Support 3/Dedicated Transport 2/Flyers 2;
   Fortifications 0). Matches the Index roster apart from the phantom. Clean.

### 7. "Lo demás" pass (2026-06-13)

1. **Index "Special rules"**: re-read raw `Index.html` — 4 verbatim entries (Combat drugs, Power
   through Pain with its 6 PtP bonuses, Visitors of the Black Library, Webway raid), all already
   present in §4. No gaps.
2. **Psychic disciplines / prayers**: no "psychic discipline" sheet and no "Faithful"/prayers/hymns
   sheet in the `.ods` (24 sheets total, none). Production confirms all 19 units `is_psyker: false`,
   none `is_priest`, no `psychic/` folder. Confirmed-absence, like AdMech/Custodes (the Ynnari
   archetype's "Revenant discipline" grant is a cross-faction reference into Eldar, not a DE-native
   axis — out of scope here).

**Dark Eldar "lo demás" complete** — Index fully covered, no psychic/prayer axis (confirmed-absence),
no fixes needed. Doc-only, no build required.
