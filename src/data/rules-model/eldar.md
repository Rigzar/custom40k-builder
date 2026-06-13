# Rules-model digest — Eldar

> Built from scratch 2026-06-11, grounded in the **`.ods` (structured canon)** per the user's
> standing directive ("básate en el .ods"), with production JSON for rules-semantics. Eldar was 🔴
> (no prior digest). Prerequisite for its Fase 4 migration. LARGEST faction migrated (38 units).

**Sources read** (2026-06-11):
- `Informacion/Eldar ENG.ods` (44 sheets: Index, Army Customisation, Armory, Craftworld Armory,
  Ynnari Armory, Eldar psychic discipline, + 37 unit datasheets) — STRUCTURED CANON
- `Informacion/Custom40k Core Rules.txt` + `Custom40k Missions.txt`
- `data/parsed/eldar/` production: `units.json` (38 units + `slot_to_units`), `armory/general.json`
  (49 equipment items), Craftworld/Ynnari legacy armories, `archetypes.json` (6 archetypes /
  5 legacies / 15 traits)
- `src/data/loaders.ts:eldar` (imports units + general + archetypes + Craftworld + Ynnari armories;
  NO psychic-discipline file)

---

## Faction: Eldar

### 1. Keyword vocabulary

- **Armour types: NONE keyword-gated.** No `armourKeyword` on any unit. Armour is a stat-tier
  Armory buy. No ᵀ-gate.
- **Marks: NONE.** No `locked_mark`.
- **Datasheet keywords[]: EMPTY** in production (all 38 units `keywords: []`). BUT the `.ods`
  archetypes reference TWO sub-type keywords — `<Aspect>` (Aspect Focus archetype: "<Aspect> units
  can be taken as Troops") and `<Wraith>` (Wraithhost archetype: "Wraithblades and Wraithguard...
  Non-<Wraith> Troops become Elite"). These are NOT carried as production `keywords[]` — see §6.2.
  So unlike Dark Eldar (whose Kabal/Coven/Cult sub-factions ARE in `keywords[]`), Eldar's Aspect/
  Wraith sub-types are currently IMPLICIT (by unit identity), not keyword-tagged.
- **Unit types** (production, 38 units): `Infantry` (11), `Vehicle` (6), `Character Model, Infantry`
  (4), `Monstrous Creature` (4, Avatar/Wraithseer/Yncarne/Wraithlord), `Jetbike` (3), `Flyer` (3),
  `Walker` (2, Wasps/War Walkers), `Jump Pack Infantry` (2, Shadow Spectres/Warp Spiders),
  `Monstrous Infantry` (2, Wraithblades/Wraithguard), `Jump pack` (1, Swooping Hawks — a unit_type
  ARTIFACT, should be "Jump Pack Infantry"; §6.4).
- **Net:** armour/mark/datasheet axes empty (the Aspect/Wraith sub-types referenced in archetypes
  aren't keyword-modelled). Back to the "empty datasheet axis" group (Dark Eldar remains the only
  non-CSM faction with a populated one).

### 2. Wargear gating

| Item / group | Gate mechanism | Notes |
|---|---|---|
| General Armory items | `has_armory_access` | no `armour_compat`/`term_compat` (no ᵀ-gate) |
| "Only for X" prose | free-text match | per-item unit restrictions |
| Craftworld + Ynnari legacy armories | Legacy / Ynnari archetype unlock | the 5 Craftworld armories (one per Legacy) + the Ynnari armory (via Ynnari archetype) |
| Vehicle Equipment (8: Crystal targeting matrix/Ghostwalk matrix/Holo-field/Improved targeting/Jammer/Spirit stones/Smoke Launcher/Star engines) | `is_vehicle` + `category: 'vehicle'` | **FIXED §6.1**: tagged (POINTS already in `p_unit`) |
| **NO Veteran-Ability tier** | — | no VETERAN ABILITIES armory section; 0 `has_veteran_abilities` units — like Chaos Daemons/Sororitas/Dark Eldar |

### 3. Points model

- **Standard equipment**: `p_unit` (per-model) / `p_char` (flat CHARACTER override). Mirrors the
  cross-faction `getItemPts`.
- **Vehicle Equipment**: single "POINTS" column, flat `p_unit × size`. Already in `p_unit`.
- **Traits**: 3-column "NORMAL / CHARACTER / MC&V" with `*` = per Wound/Hull, per-unit army-wide.
- **NO veteran/per-Wound-or-Hull tier** — Eldar on the CD/Sororitas/Dark-Eldar side of the
  veteran-pricing inverse-pair.

### 4. Army rules / special rules

- **Battle Focus** (Index): "'Assault', 'Grenade' and 'Pistol' weapons ignore the to-hit penalty
  for 'Advance' and 'Charge' orders. 'Heavy' weapons can be used without penalty with 'Move &
  Shoot' and at -1 with 'Advance'/'Charge'. All psychic powers are treated as 'Basic'." The
  defining Eldar army-wide mobility/psychic rule.
- **Shuriken** (Index): "To wound rolls of 5+ gain additional -2 AP." The signature Eldar weapon
  rule (the Hail of Doom trait boosts it further).
- **Visitors of the Black Library** (Index): "Access to Harlequin units. Harlequins cannot be the
  mandatory HQ." Native-ally grant (same as Dark Eldar).
- **Webway strike** (Index): "For each started 1000 points, one infantry unit may be set up using
  Infiltrators for +1 point per Wound." (Same shape as Dark Eldar's Webway raid.)
- **Psykers** (6 units `is_psyker`: Farseer / Spiritseer / Wraithseer / Warlocks / Yncarne / +1):
  Eldar has a large faction psychic discipline (`.ods` "Eldar psychic discipline", 64 rows) PLUS
  the Ynnari "Revenant" discipline (via the Ynnari archetype). **⚠ NOT wired into the loader — see
  §6.3** (same gap class as IG `ki-ig-psychic-unwired-01`).

### 5. Archetypes / Legacies / Traits

Budget: **0-1 Archetype, 0-1 Legacy, 0-2 Traits**. Production cross-check CLEAN: 6 archetypes /
5 legacies / 15 traits — matches the `.ods` exactly.

**6 Archetypes**:
- Aspect Focus (<Aspect> units → Troops; non-<Aspect> Troops → Elite) — gates on the §1 Aspect
  sub-type (currently not keyword-modelled, §6.2).
- Wraithhost (Wraithblades/Wraithguard → Troops; non-<Wraith> Troops → Elite) — same, on <Wraith>.
- Exemplars of the Shrines (all Exarchs gain two Exarch powers, no longer unique).
- LIIVI (access a single Vindicare assassin; one HQ must be a Farseer) — a named-character
  archetype granting an Assassin (cross-ref the universal Assassins system, [[project_inquisition_audit]]).
- Windhost (Windriders → Troops; <12"M units must start embarked).
- Ynnari → cross-faction (Battle Brothers for Dark Eldar; access Ynnari Armory + Revenant
  discipline; "no Legacy") — the mirror of Dark Eldar's Ynnari archetype.

**5 Legacies** — each = one Craftworld, granting that Craftworld's Armory: Fieldcraft→Alaitoc /
Foresight of the Damned→Ulthwé / Stoic Endurance→Iyanden / Swordwind→Biel-Tan / Wild Host→Saim-Hann.

**15 Traits** (3-column pricing): Black Guardians / Children of Khaine / Children of Morai-Heg /
Children of Prophecy (psyker re-roll) / Children of the Open Skies / Combined War Host (→"2nd
Legacy") / Elite Citizenry / Expert Crafters / Grim / Hail of Doom (boosts Shuriken) / Masterful
Shots / Masters of Concealment / Mobile Fighters / Savage Blades / Students of Vaul. Canonical in
`archetypes.json`.

### 6. Open questions / discrepancies found

1. **Vehicle Equipment untagged — FIXED** (`ki-eldar-vetvehcategory-01`): the 8 Vehicle Equipment
   items (idx 41-48) were `category: none`; tagged `category: 'vehicle'`. POINTS already in
   `p_unit` (no value-move). "Spirit stones" also appears as an equipment-section version (idx 19,
   46) — only the vehicle block (idx 41-48) was tagged. NO veteran-side fix: Eldar have no veteran
   tier (0 `has_veteran_abilities`).
2. **`<Aspect>` / `<Wraith>` sub-types not in production `keywords[]`** (candidate KI
   `ki-eldar-aspect-wraith-keyword-01`, KNOWN): the Aspect Focus + Wraithhost archetypes gate on
   `<Aspect>` / `<Wraith>` (per the `.ods`), but production carries `keywords: []` on all 38 units —
   so these sub-types are not keyword-tagged (the archetype slot-remap must be resolving them by
   unit name/identity instead, or the gating is incomplete). UNLIKE Dark Eldar, whose Kabal/Coven/
   Cult sub-factions ARE in `keywords[]`. Worth tagging the Aspect Warriors (Dire Avengers/Fire
   Dragons/Howling Banshees/Striking Scorpions/Dark Reapers/Swooping Hawks/Warp Spiders/Shining
   Spears/Shadow Spectres) with "Aspect" and the Wraith units (Wraithblades/Wraithguard/Wraithlord/
   Wraithseer) with "Wraith" so the archetype gating is keyword-driven (matching the Dark Eldar
   model). Needs a per-unit data pass + user confirm of the exact Aspect/Wraith membership.
3. **⚠ Eldar psychic discipline + Revenant not wired into the loader** (`ki-eldar-psychic-unwired-01`,
   KNOWN): the `.ods` has a large "Eldar psychic discipline" (64 rows) + the Ynnari "Revenant"
   discipline, and Eldar has 6 psyker units, but `loaders.ts` imports only units+general+archetypes+
   Craftworld+Ynnari armories — NO psychic-discipline file (the disciplines slot is `{}`). Same gap
   class as IG (`ki-ig-psychic-unwired-01`). Larger separate scope (parse the discipline into JSON +
   wire into the loader).
4. **"Swooping Hawks" `unit_type` artifact**: production has `unit_type: "Jump pack"` (should be
   "Jump Pack Infantry"). Cosmetic, `ki-unittype-residuals-01` family.
5. **Roster cross-check**: production 38 units / 7 populated slots (HQ 6/Troops 5/Elites 10/Fast
   Attack 7/Heavy Support 6/Dedicated Transport 1/Flyers 3; Fortifications 0). Matches the Index
   roster (Index shows 6 Troops incl. an extra; production 5 — minor, the Index "Wasps" Walker is in
   Troops in both). No blocking drift, no phantoms (cleaner than Custodes/Dark Eldar).

### 7. "Lo demás" pass (2026-06-13)

1. **Index "Special rules"**: re-read raw `Index.html` — 4 verbatim entries (Battle Focus, Shuriken,
   Visitors of the Black Library, Webway strike), all already present in §4. No gaps.
2. **Psychic disciplines / prayers**: no "Faithful"/prayers sheet in the `.ods`. The "Eldar psychic
   discipline" (64 rows) + Ynnari "Revenant" discipline gap was already found and documented in §6.3
   (`ki-eldar-psychic-unwired-01`, KNOWN) — a much larger scope than the IG/Sororitas hymn fixes
   (single 5-row prayer table copy-paste). Not tackled in this lighter "lo demás" pass; remains a
   separate follow-up item.

**Eldar "lo demás" complete** — Index fully covered, psychic gap already tracked (no new findings).
Doc-only, no build required.
