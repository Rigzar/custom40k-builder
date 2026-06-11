# Rules-model digest — Tyranids

> Built from scratch 2026-06-11, grounded in the **`.ods` (structured canon)** per the user's
> standing directive ("básate en el .ods"), with production JSON for rules-semantics. Tyranids was
> 🔴 (no prior digest). Prerequisite for its Fase 4 migration. Datasheet spot-check done (Hive
> Tyrant vs production — matches; biomorphs confirmed as per-unit options).

**Sources read** (2026-06-11, ALL `.ods` structural sheets read + Hive Tyrant datasheet spot-check):
- `Informacion/Tyranids.ods` (no " ENG") — Index, Army Customisation, Armory, Hive Fleet Armory,
  Tyranid psychic discipline, + 40 unit datasheets (STRUCTURED CANON)
- `Informacion/Custom40k Core Rules.txt` + `Custom40k Missions.txt`
- `data/parsed/tyranids/` production: `units.json` (40 units + `slot_to_units`),
  `armory/general.json` (EMPTY — see §2), `armory/legion_hive_fleet.json`, `archetypes.json`
  (3 archetypes / 5 legacies / 0 traits)
- `src/data/loaders.ts:tyranids` (units + general[empty] + archetypes + Hive Fleet armory; NO
  psychic file)

---

## Faction: Tyranids

### 1. Keyword vocabulary

- **Datasheet `keywords[]`: POPULATED — uniform "Tyranid" on ALL 40 units.** The THIRD faction (after
  CSM and Dark Eldar) with a non-empty `keywords[]` axis — but UNLIKE those two (which carry sub-
  faction/legion keywords), Tyranids carry a single UNIFORM faction-identity keyword "Tyranid" on
  every unit (not a discriminating sub-faction). It gates faction-wide effects / "Tyranid only"
  references, not an in-faction split.
- **Armour types: NONE keyword-gated.** No `armourKeyword`. Tyranid defence is biology (carapace
  saves on the datasheet + the Hardened Carapace special biomorph), not an armour keyword.
- **Marks: NONE.** No `locked_mark`. (Hive Fleets are a Legacy axis, §5, not a base keyword.)
- **NO vehicles at all** (`is_vehicle: 0` across all 40 units): Tyranids are entirely Monstrous
  Creatures / Infantry / Monstrous Infantry / bio-constructs. UNIQUE so far — the only faction with
  zero vehicles (hence no Vehicle Equipment armory, §2).
- **Unit types** (production, 40 units): `Monstrous Creature` (16), `Infantry` (14), `Monstrous
  Infantry` (3), `Jump Pack Infantry` (3), `Character Model, Monstrous Infantry` (1), `Character
  Model, Infantry` (1), `Bike` (1, Ravener Brood), `Flyer, Monstrous Creature` (1, Harpy). No
  parser artifacts. Monster-heavy (17 of 40 are some Monstrous type).

### 2. Wargear gating — the BIOMORPH system (unique to Tyranids)

Tyranids do NOT use the standard shared-Armory model. Production `armory/general.json` is EMPTY
(`weapons[]`/`equipment[]`/`daemon_weapons[]` all length 0), and `has_armory_access: false` on the
units. Instead, the `.ods` Armory is a **Biomorph catalogue**, and biomorphs are modelled as
**per-unit `option_groups`** (verified on Hive Tyrant: "May select one Special Biomorph", "May
additionally select any number of Basic and Advanced Biomorphs").

| Biomorph tier | Count | Cost basis | Examples |
|---|---|---|---|
| **Basic Biomorphs** | 7 | per UNIT (flat) | Acid Maw / Adrenal Glands / Enhanced Senses / Heightened Reflexes / Pathogenesis / Relentless Hunger / Toxin Sacs |
| **Advanced Biomorphs** | 9 | per MODEL | Acid Blood / Extremely Volatile / Implant Attack / Infrasonic Roar / Resonance Barb / Symbiote Rippers / Thornback / Tusked / Warped |
| **Special Biomorphs** | 9 | "See datasheet" (per-unit, datasheet-priced) | Endless / Feeder Tendrils / Hardened Carapace / Leaping / Norn Crown / Regeneration / Scuttlers / Synaptic Node (1 per army) / **Winged** (gates the Flying Death archetype, §5) |

- **NO Vehicle Equipment section** (no vehicles) and **NO Veteran Abilities section** (0
  `has_veteran_abilities` units). So there is NO `category:'vehicle'`/`'veteran'` tagging work for
  Tyranids — the ONLY migrated faction with nothing to fix in the armory (§6).
- **Hive Fleet Armory** (legacy): the 5 Hive Fleets each grant their armory via a Legacy (§5),
  loaded as the 'Hive Fleet' legacy.

### 3. Points model

- **Biomorphs**: Basic = flat per-unit; Advanced = per-model; Special = "See datasheet" (priced on
  the unit's own datasheet). Modelled via the units' `option_groups`, not a shared-armory
  `p_unit`/`p_char`.
- **NO standard armory pricing** (general.json empty), **NO veteran tier**, **NO traits** (§5).
- The cleanest points model of any faction — everything is on the datasheets + biomorph options.

### 4. Army rules / special rules

- **Synapse** (signature mechanic, Index): units within 12" of a Synapse model are "in Synapse
  range" — ignore Ld modifiers, count as full strength, convert failed Ld tests into Mortal Wounds
  (no Battleshock token), and clear Battleshock at Rally. Synapse models explode like a vehicle on
  death. The defining Tyranid command-and-control web.
- **Instinctive Behaviour** (Index): a unit outside Synapse range gains a Battleshock marker (only
  removable by re-entering Synapse range); fleeing units move toward the nearest Synapse unit.
- **Shadow in the Warp** (Index): enemy psykers suffer -1 to manifest/deny in rounds 2-3, -2 in
  rounds 4-5.
- **Psychic Feedback** (Index): instead of rolling Perils of the Warp, the model suffers 1 Mortal
  Wound.
- **Psykers** (7 units `is_psyker` — Tyranids are very psyker-dense): the `.ods` has a "Tyranid
  psychic discipline" (19 rows). **⚠ NOT wired into the loader — see §6.2** (same gap class as
  IG/Eldar/Harlequins/GSC/Orks).

### 5. Archetypes / Legacies / Traits

Budget: **0-1 Archetype, 0-1 Legacy** — NO Traits (the budget line omits Traits; no TRAITS
section). Production cross-check CLEAN: 3 archetypes / 5 legacies / 0 traits — matches the `.ods`.
(Traits genuinely absent, like Custodes/Harlequins.)

**3 Archetypes**: Flying Death (Gargoyle/Tyranid Warrior Broods with the **Winged** biomorph →
Troops; half must start in reserves), Megafauna (Carnifex Broods → Troops), Tyrannocyte Assault
(all units start embarked in Tyrannocytes; arrive automatically rounds 1-2).

**5 Legacies** — each = one Hive Fleet, granting that Fleet's Hive Armory (loaded as the 'Hive
Fleet' legacy): Adaptive Toxins→Gorgon / Bio-Barrage→Kronos / Hyper-Aggression→Behemoth / Questing
Tendrils→Kraken / Synaptic Control→Leviathan.

**0 Traits** — none exist.

### 6. Open questions / discrepancies found

1. **NO armory category fix needed — by design** (NOT a gap): Tyranids' `armory/general.json` is
   EMPTY, they have 0 vehicles and 0 `has_veteran_abilities` units, and their wargear is the
   per-unit Biomorph system (`option_groups`). So there is NO Vehicle-Equipment / Veteran-Ability
   tagging to do — the only migrated faction with nothing to fix in the armory. (Confirmed the
   biomorphs render via `option_groups`, verified on Hive Tyrant.)
2. **⚠ Tyranid psychic discipline not wired into the loader** (`ki-tyranids-psychic-unwired-01`,
   KNOWN): the `.ods` has a "Tyranid psychic discipline" (19 rows), and Tyranids have 7 psyker units
   (the most psyker-dense faction), but `loaders.ts` imports only units+general[empty]+archetypes+
   Hive Fleet armory (disciplines slot `{}`). Same gap class as IG/Eldar/Harlequins/GSC/Orks.
   Larger separate scope.
3. **"Tyranid" uniform datasheet keyword**: all 40 units carry `keywords: ["Tyranid"]` — a faction-
   identity keyword (not a discriminating sub-faction). Documented in the codex `keywords.ts` as a
   single datasheet entry; no per-unit gating splits on it.
4. **Roster cross-check**: production 40 units / 8 populated slots (HQ 7/Troops 7/Elites 9/Fast
   Attack 9/Heavy Support 5/Dedicated Transport 1/Fortifications 1/Flyers 1). Uses every slot. No
   phantoms; matches the Index roster. (Source datasheet "Montrous Creature" typo is corrected to
   "Monstrous Creature" in production — production canonical.)
