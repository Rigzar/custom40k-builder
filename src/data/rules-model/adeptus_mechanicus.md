# Rules-model digest — Adeptus Mechanicus

> Built from scratch 2026-06-11, grounded in the **`.ods` (structured canon)** per the user's
> standing directive ("básate en el .ods"), with production JSON for rules-semantics. AdMech was
> 🔴 (no prior digest). Prerequisite for its Fase 4 migration.

**Sources read** (2026-06-11):
- `Informacion/Adeptus Mechanicus ENG.ods` (34 sheets: Index, Army Customisation, Armory, Forge
  World Armory, Canticles of the Omnissiah, + 29 unit datasheets) — STRUCTURED CANON
- `Informacion/Custom40k Core Rules.txt` + `Custom40k Missions.txt` (rules grounding)
- `data/parsed/adeptus_mechanicus/` production: `units.json` (29 units + `slot_to_units`),
  `armory/general.json` (42 equipment items), `armory/legion_forge_world.json`, `archetypes.json`
  (5 archetypes / 7 legacies / 16 traits) — cross-checked vs the `.ods` per GOLDEN RULE
- `src/data/loaders.ts:132` (AdMech loader: units + general + archetypes + Forge World legacy armory)

---

## Faction: Adeptus Mechanicus

### 1. Keyword vocabulary

- **Armour types: NONE keyword-gated.** Grepped all 29 units: `armourKeyword` populated on ZERO.
  Like Imperial Guard, AdMech armour is a STAT-TIER Armory purchase (Bionics 6+inv / Enhanced
  Bionics 5+inv / Conversion field 4+inv / Master-crafted armor 2+ Sv / Stasis field 2+inv
  one-shot), never a keyword gating an equipment subset. SECOND faction (after IG) with a fully
  empty armour axis.
- **Marks / sub-factions: NONE intrinsic.** No `locked_mark` on any unit. Marks of Chaos exist
  ONLY via the **Dark Mechanicum** archetype (+1/+2 per model & Wound, +10 per vehicle) — an
  archetype-gated option, not a unit-identity axis (mirrors IG's Traitor Guard exactly).
- **Forge World** is a LEGACY axis, not a base keyword: the 7 Forge Worlds (Metalica/Lucius/Graia/
  Ryza/Mars/Agripinaa/Stygies VIII) are unlocked by the 7 Legacies (§5), each granting that Forge
  World's Armory (relic weapons gated "Forge World X only") + one Legacy Canticle. Production data
  for this is `armory/legion_forge_world.json` (loaded as the "Forge World" legacy armory).
- **Unit types** (production, 29 units): `Infantry` (13), `Vehicle` (5), `Character Model,
  Infantry` (3), `Jump Pack Infantry` (2, Pteraxii), `Bike` (2, Serberys), `Bike, Monstrous
  Creature` (2, Sydonian Dragoons/Dunecrawler-type), `Monstrous Infantry` (1), `Flyer, Vehicle`
  (1, Archaeopter). No parser-artifact junk (cleaner than IG).
- **Datasheet keywords[]: EMPTY.** Grepped all 29 units: `keywords: []` everywhere. SEVENTH
  confirmation (CSM=6, all others incl. AdMech=0) that a populated datasheet axis is the CSM-only
  exception.
- **Net:** like IG, ALL FOUR axes (armour/mark/faction/datasheet) are empty — wargear gating runs
  on prose ("Only for X" / "Forge World X only") + boolean flags + per-datasheet options (Doctrina
  Imperative, §2/§6). Plus faction-flavour keywords that are weapon ABILITIES not gates: Haywire,
  Tesla, Decimate (rad), Luminagen, Cognis, Soul burn, Beam/Lance (textual, in coreRules.ts).

### 2. Wargear gating (replaces term_compat / gravis_compat / category)

| Item / group | Gate mechanism | Notes |
|---|---|---|
| All general Armory weapons + equipment | NONE keyword-based | `has_armory_access` opens the tab; no ᵀ/ᴳ filter (no `armour_compat` anywhere) |
| "Only for X" / "Only for infantry" prose | free-text match | Pteraxii wings / Serberys steed "Only for infantry"; per-item restrictions |
| Forge World Armory relics | "Forge World X only" prose + Legacy unlock | The Adamantine Arm (Metalica), The Omnissiah's Hand (Stygies VIII), The Red Axe (Mars), etc. — gated by the matching Legacy (§5) AND a prose Forge-World restriction |
| Doctrina Imperatives (4: Aggressor/Bulwark/Conqueror/Protector) | per-datasheet "may select one Doctrina Imperative" option | **GAP §6.1**: 13 units have this datasheet line, but production carries NO per-unit flag and the 4 items are `category: none` (NOT `has_veteran_abilities` — 0 units have it; this is NOT the IG/GK veteran-ability shape) |
| Vehicle Equipment (9: Additional armor/Broad spectrum data-tether/Cognis manipulator/Improved targeting/Infoslave skull/Jammer/Machine spirit/Mindscanner probe/Smoke Launcher) | `is_vehicle` flag + `category: 'vehicle'` | **FIXED §6.2**: were `category: none`; now tagged (p_unit already correct, no move needed unlike IG) |
| Mark of Chaos | Dark Mechanicum archetype only | purchasable upgrade, not a base gate |

### 3. Points model

- **Standard equipment**: `p_unit` (per-model) / `p_char` (flat CHARACTER-MODEL override) — Armory
  columns "POINTS" + "POINTS CHARACTER MODEL". Mirrors IG/CSM/SM/GK. No `× item.size` for regular.
- **Doctrina Imperatives**: `.ods` table columns "POINTS" + "POINTS MONSTROUS CREATURES &
  VEHICLES" (Aggressor/Bulwark/Conqueror = 1/2; Protector = 0/0) + footnote "paid for every model
  and per Wound or Hull point". The SAME two-column per-model/per-Wound shape as IG/GK Veteran
  Abilities — but gated differently (per-datasheet option, not `has_veteran_abilities`; §6.1).
- **Vehicle Equipment**: single "POINTS" column, flat `× item.size`. Production already had the
  value in `p_unit` (UNLIKE IG, where it was misplaced in `p_char`) — so only `category` tagging
  was needed.
- **Traits**: 3-column "NORMAL / CHARACTER MODELS / MONSTROUS CREATURES & VEHICLES" with `*` =
  per Wound/Hull, per-unit army-wide cost. Same rich shape as IG.

### 4. Army rules / special rules

- **Canticles of the Omnissiah** (signature mechanic, Index verbatim): "At the start of the
  Command phase, choose a single Canticle. All units with this rule partially within 9" of a model
  with 'Choir Master' roll a D6; on a 4+ they gain the chosen Canticle until end of Battle Round."
  6 base Canticles: Benediction of Omniscience / Chant of the Remorseless Fist / Incantation of
  the Iron Soul / Invocation of Machine-might / Litany of the Electromancer / Shroudpsalm. Plus 7
  Legacy Canticles (one per Forge World legacy, §5): Citation in Savagery / Luminescent Blessing /
  Mantra of Discipline / Panegyric Procession / Plea of the Veiled Hunter / Tribute of Emphatic
  Veneration / Verse of Vengeance.
- **Choir Master** (Index): "Units containing this model automatically pass their Canticle roll."
- **Monotask** (Index): "This unit does not benefit from Canticles unless accompanied by a
  character with Choir Master." Carried by 5 units: Tech-thralls, Kataphron Breachers, Kataphron
  Destroyers, Servitors, Kastelan Robots.
- **Cognis / Luminagen / Tesla** (Index): weapon special rules (to-hit penalty reduction / cover &
  defensive-fire debuff / 5+ auto-hit + 2 extra hits) — textual abilities in coreRules.ts, not
  gates.
- 22 of 29 units carry Canticles (Magos/Skitarii/Secutarii/Electro-Priests/Sicaran/Pteraxii/
  Serberys/Sydonian/Ironstrider/Tech-Priest); the 5 Monotask units are the exception.

### 5. Archetypes / Legacies / Traits

Budget (Army Customisation): **0-1 Archetype, 0-1 Legacy, 0-2 Traits**. Production cross-check
CLEAN: 5 archetypes / 7 legacies / 16 traits — matches the `.ods` exactly.

**5 Archetypes**:
- **Dark Mechanicum** → cross-faction (Allies of Convenience for CSM; buy Marks of Chaos; access
  CSM Armory + 5 CSM daemon-engines; "May not select a Legacy") — direct analogue of IG's Traitor
  Guard ([[project_traitor_guard_bugfix_0608]]).
- **Cybernetica Cohort** (access HH Mechanicum Robots/Taghmata; Kastelan Robots→Troops; needs a
  Magos/Archmagos with Datasmith; only Robots count to 25% Troops).
- **Ordo Reductor Covenant** (access HH Mechanicum Ordo Reductor/Taghmata; needs a Magos/Archmagos
  with Myrmidax; only Ordo Reductor count to 25% Troops). Both Cybernetica/Ordo Reductor pull from
  the **Horus Heresy Mechanicum supplement** — cross-ref [[project_hh_supplement_source]].
- **Servitor Maniple** (Servitors→Troops, each needs an attached Tech-priest; Skitarii don't count
  to 25%), **Titan Legion** (Secutarii Hoplites/Peltasts→Troops; only Secutarii count to 25%).

**7 Legacies** — each = ONE Forge World, granting that Forge World's Armory + one Legacy Canticle
(simplest legacy shape after IG's order-grant / GK's power-grant): Gleaming Giant→Metalica /
Hollow World→Lucius / Morning Star→Graia / Omnissiah Igvita→Ryza / Red Planet→Mars / Thousand
Scars→Agripinaa / Xenarites→Stygies VIII.

**16 Traits** (3-column pricing, army-wide): Accelerated Actuators / Autosavant Spirits / Combined
Explorator Fleet (→"must select a 2nd Legacy") / Djinn Eyes / Masters of the Forge (+1 Canticle
roll) / Phased-Plasma Coils / Purgation Protocols / Refusal to Yield / Relentless March / Red in
Cog and Claw / Rugged Explorators / Scarifying Weaponry / Shroud Protocols / Solar Blessing /
Staunch Defenders / **Veteran Maniple** ("Any unit with the option to purchase a Doctrina
Imperative may purchase a second one" — the key cross-link to §2/§6.1's Doctrina gating).

### 6. Open questions / discrepancies found

1. **Doctrina Imperatives — gating NOT modelled** (candidate KI `ki-admech-doctrina-gating-01`,
   KNOWN): the 4 Doctrina Imperatives (Aggressor/Bulwark/Conqueror/Protector) are the AdMech
   veteran-ability analogue, but their gate is a per-datasheet line — **"The unit may select one
   Doctrina Imperative"** — present on 13 units (Skitarii Rangers/Vanguard, Secutarii Hoplites/
   Peltasts, Sicaran Infiltrators/Ruststalkers, Sydonian Skatros, Pteraxii Skystalkers/Sterylizors,
   Serberys Raiders/Sulphurhounds, Sydonian Dragoons, Ironstrider Ballistarii). Production carries
   ZERO `has_veteran_abilities` units, and the 4 items sit in general.json as `category: none` (so
   they currently show in the general tab to ANY armory unit — wrong scope). The clean model:
   `category: 'veteran'` + set `has_veteran_abilities: true` + `veteran_max: 1` on the 13 option-
   carrying units (+1 via the Veteran Maniple trait), then `p_veh` from the M&V column (2 for
   Aggressor/Bulwark/Conqueror, 0 for Protector), `p_char: null`. NOT applied this pass (multi-unit
   data change requiring per-datasheet confirmation of all 13 — scoped like IG's psychic gap);
   logged for a dedicated pass. The 4 items LEFT UNTAGGED for now (tagging `category:'veteran'`
   without the per-unit flag would HIDE them entirely, since 0 units have `has_veteran_abilities`).
2. **Vehicle Equipment untagged — FIXED** (`ki-admech-vetvehcategory-01`): the 9 Vehicle Equipment
   items were `category: none`; tagged `category: 'vehicle'`. Their POINTS value was ALREADY in
   `p_unit` (unlike IG's misplacement in `p_char`), so no value-move was needed — pure tagging.
   "Infoslave skull" appears twice (equipment-section character version idx 10 + vehicle-section
   version idx 37) — only the vehicle one was tagged.
3. **Roster cross-check**: production 29 units / 8 slots (HQ 2/Troops 3/Elites 11/Fast Attack 5/
   Heavy Support 5/Dedicated Transport 2/Flyers 1; Fortifications 0). The Index sheet lists Termite
   + Archaeopter under Transports/Flyers and Skorpius Dunerider/Disintegrator — production places
   them across DT(2)/Flyers(1)/HS — minor slot-placement reconcile worth a glance during migration
   Step 1, no blocking drift.

### 7. "Lo demás" pass (2026-06-13)

- **Index "Special rules"**: re-read raw `Index.html` — 6 verbatim entries (Canticles of the
  Omnissiah, Choir Master, Cognis, Luminagen, Monotask, Tesla), all present in
  `codex_adeptus_mechanicus/special-abilities.ts` §4. No gaps.
- **Psychic disciplines / prayers**: no "psychic discipline" sheet and no "Faithful"/prayers sheet
  exist in the `.ods` (34 sheets total, none); production confirms all 29 units
  `is_psyker: false`, none `is_priest`. AdMech is the first migrated faction with NO psychic/prayer
  axis at all — confirmed-absence, nothing to wire.
- **Found and fixed a stale gap-note**: `special-abilities.ts`'s §6 gap-note for
  `ki-admech-doctrina-gating-01` still described the Doctrina Imperatives gating as an OPEN
  problem, but it was actually resolved in v0.60 (13 units have `has_veteran_abilities: true` +
  `veteran_max: 1`, the 4 items in `armory/general.json` are tagged `category: 'veteran'` with the
  correct `p_veh`/`p_char`). Updated the entry to document the resolved state and point at the
  still-open follow-up `ki-admech-veteranmaniple-bonus-unmodelled-01`. Doc-only, build ✓.

**AdMech "lo demás" complete** — Index fully covered, no psychic/prayer axis (confirmed-absence),
one stale doc-comment corrected. Build ✓, local NOT pushed.
