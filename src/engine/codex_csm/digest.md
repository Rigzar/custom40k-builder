# Rules-model digest — Chaos Space Marines

> Validated against the user's canonical sources. Never filled from training memory.

**Where the actual data lives** (this folder only holds engine code + this digest — the
canonical unit/armory/archetype DATA stays in the shared per-faction layout, same pattern as
all 19 factions, so loaders/migration tools keep working uniformly):
- Units: `data/parsed/chaos_space_marines/units/<slot>/*.ts`
- Armory (general + marks + legions): `data/parsed/chaos_space_marines/armory/*.json`
- Animosity table: `data/parsed/chaos_space_marines/animosity.json`
- Archetypes: `data/parsed/chaos_space_marines/archetypes.json`

**Sources read so far:**
- CSM **General Armory** — **re-read from disk** (`data/source/.../Armory.html`) 2026-06-03 (plan B
  step 1); confirms earlier paste + surfaced buyable `Terminator armor` (see §1).
- CSM **Mark armories** Khorne / Nurgle / Slaanesh / **Tzeentch** — **re-read from disk** 2026-06-03
  (plan B step 1); all 4 match the digest.
- CSM **Legion armories** Alpha Legion / Black Legion / Iron Warriors / Night Lords / Word Bearers
  — **re-read from disk** 2026-06-03 (plan B step 2); all 5 match the digest §1 (no corrections).
  **Horus Heresy** armory raw text — pasted by user 2026-06-03.
- CSM **roster sheet** (slot → units) + **Army Specific Rules** (Marks, Favored Units, Mark of
  Chaos Undivided, Summoning) — **re-read from disk** (`Index.html`) 2026-06-03 (plan B); roster
  (8 HQ / 8 Troops / 22 Elites / 9 FA / 9 HS / 2 DT / 2 Fort / 1 Flyer) + rules verbatim match
  §4b/§4c, no corrections. (Animosity matrix is on a separate sheet — step 4.)
- CSM **Army Customisation** (12 archetypes, 5 legacies, 17 traits with costs) — pasted by user
  2026-06-03.
- CSM **Animosity of the Gods** mark-compatibility matrix — re-read from disk 2026-06-03 (plan B),
  matches the §4b matrix cell-for-cell (was pasted earlier; now disk-confirmed).
- Production `data/parsed/chaos_space_marines_armory.json` (cross-check of derived fields).
- PENDING: `core_rules_text.txt`, Undivided armory (if any), legion armories, unit→armour mapping
  (see §6).

---

## 1. Keyword vocabulary (armour axis — VALIDATED for general + mark armories)

The armory gates wargear on TWO armour keywords (both restrict to the ᵀ subset):

- **`Terminator`** (a model in Terminator armor). General armory rule, verbatim:
  > "Models in Terminator armor can only receive equipment marked with ᵀ."
- **`Cataphractii`** (a model in Cataphractii armor). CONFIRMED as a gate in the **Nurgle** mark
  armory, verbatim:
  > "Models wearing Cataphractii or Terminator armor can only receive equipment with ᵀ."
  - So both `Terminator` AND `Cataphractii` gate to ᵀ items. **This corrects the earlier §6 open
    question that assumed only Terminator gated.**
  - The gate is **one-directional**: only Terminator/Cataphractii-armored models are restricted
    (to the ᵀ subset). Other models have no armour restriction in this armory.
  - `Gravis` / `Power` armour do NOT appear as gates in CSM. (Gravis is a Space Marines concept.)
  - **Both ᵀ-gate keywords can be BOUGHT, not just innate (DYNAMIC armour — chain C).** Verified
    on disk 2026-06-03:
    - **`Terminator armor`** is an EQUIPMENT item in the **general armory** (p_unit 23 / p_char 46,
      "Only for infantry") → grants +1 T / +1 A / 2+ save / **5+ inv** / Deep strike / Massive(1) /
      Unyielding.
    - **`Cataphractii armor`** is an EQUIPMENT item in the **Nurgle armory** (p_char 76) and the
      **Horus Heresy armory** (p_char 80) → same profile but **4+ inv**, "Only for infantry".
    - So an infantry model that buys either acquires the corresponding keyword, which then ᵀ-gates
      the rest of its armory picks. The unit→armour mapping (§6) is therefore partly dynamic for
      BOTH keywords, not only Cataphractii.

**Marks** (Khorne / Nurgle / Slaanesh / Tzeentch / Undivided) gate the *mark armories*. Each mark
armory header confirms the **Mark keyword gate**, verbatim pattern:
  > "Any model with access to the Armory and the Mark of [God] equipped can buy as many items as
  > it wants."
- VALIDATED mark armories: **Khorne, Nurgle, Slaanesh, Tzeentch** (user pasted 2026-06-03).
- Mark armories carry WEAPON / EQUIPMENT / DAEMON WEAPONS sections only (no VETERAN / VEHICLE),
  same POINTS / POINTS CHARACTER columns, same ᵀ and "-" conventions as the general armory.
- **Tzeentch** restates only the `Terminator` ᵀ gate (no Cataphractii mention in its block); the
  Cataphractii gate is confirmed in Nurgle and is treated as armory-wide. Tzeentch weapons are
  "Inferno"-branded (Inferno boltpistol, Inferno combi-*, Warpflame pistol). Multi-profile combis
  use the `*` "Choose one of the following profiles" convention.
- No Undivided armory exists (user confirmed 2026-06-03).

**Legions** (Alpha Legion, Black Legion, Iron Warriors, Night Lords, Word Bearers) gate the
*legion armories*. VALIDATED all 5 (user pasted 2026-06-03). Notes:
- Header has NO mark/keyword gate ("Any model with access to the Armory can buy as many items as
  it wants") — access is by legion membership, not a per-item keyword. Only the ᵀ `Terminator`
  gate applies.
- Sections: WEAPON / EQUIPMENT only (no DAEMON WEAPONS, no VETERAN / VEHICLE). Same POINTS /
  POINTS CHARACTER columns and ᵀ / "-" conventions.
- Most legion items are CHARACTER-only relics (POINTS `-`, only POINTS CHARACTER set) and "Unique".
- In-description unit-restriction texts found in legion armories (parser can't derive — §2):
  - **Iron Warriors:** "Only for Warpsmiths" (Axe of the Forgemaster, Nest of Mechaserpents).
  - **Word Bearers:** "Only for Dark Apostles" (Cursed Crozius).
  - **Black Legion:** "Only for models with the Mark of Khorne" (Heavy bolter).

**Horus Heresy armory** (VALIDATED 2026-06-03). A distinct legion-style armory with WEAPON +
EQUIPMENT sections. Key findings:
- Its gate text restates BOTH keywords verbatim — **second confirmation of the Cataphractii
  gate**: *"Models wearing Cataphractii or Terminator armor can only receive equipment with ᵀ."*
- **Armour type can be PURCHASED as an equipment item**: `Cataphractii armor` (p_char 80, "Only
  for infantry") grants +1 T / +1 A / 2+ save / 4+ inv / Deep strike / Massive(1) / Unyielding.
  → A model can ACQUIRE the `Cataphractii` keyword by buying this item, which then ᵀ-gates the rest
  of its armory picks. Relevant to the unit→armour mapping (§6): armour keyword is partly dynamic.
- Other "Only for infantry" items: `Legion Scimitar Jetbike`.
- `Crusade weapon` is an army-wide enhancement ("Every enhancement in the army must be the same").
- **Localization leak:** its EQUIPMENT points columns are labeled in German ("PUNKTE / PUNKTE
  CHARAKTERMODELL") in the source — same semantics, map to `p_unit` / `p_char`.

## 2. Wargear gating — how to derive (replaces `term_compat`)

> **GLYPH CONVENTION (ᵀ collision RESOLVED, verified 2026-06-04).** In Custom40k the **ᵀ** superscript
> means **Terminator-compatible**, NOT Mark of Tzeentch. The three glyph-encoded marks are **ᴷ Khorne,
> ᴺ Nurgle, ˢ Slaanesh** (e.g. "Blood throneᴷ", "Seeker of Slaaneshˢ"). **Tzeentch is NOT
> glyph-encoded** — its items live in the `armory_marks.Tzeentch` section. Verified: **zero** armory
> item names end in ᵀ across all factions (parser converts ᵀ → `term_compat`). The engine's
> `MARK_GLYPHS` (keywords.ts) therefore OMITS ᵀ and reserves `ᶻ` for Tzeentch if a name glyph is ever
> needed — never reuse ᵀ. **Policy: when work touches the Tzeentch-vs-Terminator distinction, ASK THE
> USER, don't assume.** The "Terminator armor"/"Cataphractii armor" items themselves carry NO ᵀ
> (term_compat:false) — you buy them to BECOME terminator, then the rule limits you to ᵀ items; so the
> armory self-filters and no per-item Terminator flag needs hand-marking.

- **`term_compat` ⇔ the `ᵀ` superscript on the item name.** Item has ᵀ → a Terminator-armored
  model may take it. (CONFIRMED vs production: `Astartes chainsword` no-ᵀ → term_compat:false;
  `Baleful tomeᵀ` → term_compat:true; `Chainaxe`(mark) ᵀ → true.)
  - **Correction to an earlier wrong assumption:** term_compat IS present in the source HTML (as ᵀ).
    The new parser ignores it; the old/production parser read it. So the parser *can* derive it.
- **`category`** ⇔ which section the item lives in:
  - `WEAPON` / `EQUIPMENT` / `DAEMON WEAPONS` → regular (no category).
  - `VETERAN ABILITIES` → `category:'veteran'`.
  - `VEHICLE UPGRADES` → `category:'vehicle'`.
- **Keyword model (target):** unit carries keyword `Terminator`; ᵀ items carry `terminator-allowed`.
  Engine rule: `if unit has Terminator → only items with terminator-allowed`.

### Unit-restriction text (NOT structured — lives in the item description)
These are finer gates the columns don't capture; parser can't derive cleanly, need rules logic:
- "Infantry only" — Chaos Space Marine bike, Daemonic flight / jump pack, Terminator armor.
- "Only for Lieutenants" — Cursed blade.
- "Only for Dark Apostles" — Demagogue.
- "Only for Sorcerers" — Familiar.
- "Unique" / "Can be taken multiple times" — purchase-count modifiers.
- **(Nurgle armory)** "Only for models in Cataphractii armor" — Manreaper.
- **(Nurgle armory)** "Only for models in Cataphractii or Terminator armor" — Twin plague spewer /
  Cataphractii armor equipment item.

## 3. Points model (VALIDATED)

- General **WEAPON / EQUIPMENT**: two columns → `p_unit` = "POINTS", `p_char` = "POINTS CHARACTER".
- **`"-"` in a column = NOT selectable from that column.** (e.g. `Force axeᵀ` POINTS `-` / CHAR `6`
  → p_unit:null, p_char:6; `Hunter-killer missile` `-`/`-` → not selectable here at all.)
- **DAEMON WEAPONS**: single "POINTS" column. Production maps this to `p_char` (e.g. `Dark` → p_char:5).
- **VETERAN ABILITIES**: `p_unit` = "POINTS" (per model), `p_veh` = "POINTS MONSTROUS CREATURES &
  VEHICLES". Note verbatim: *"Point costs must be paid for every model in the unit and per Wound or
  Hull point of the model."* → veteran on a monster/vehicle is priced per Wound/HP via p_veh.
  Items with p_veh `-` (Infiltrator, Vanguard) are NOT available to vehicles/monsters.
- **VEHICLE UPGRADES**: single "POINTS" column; paid per Hull point (confirm exact multiplier vs
  ArmoryModal — see §6).

### Multi-profile weapons (`*` → "Choose one of the following profiles")
`Combi-flamerᵀ`, `Combi-meltaᵀ`, `Combi-plasmaᵀ`, `Plasma pistol` have sub-rows (`- Bolter`,
`- Flamer`, `- Plasma (Standard/Overcharged)` …) → store as `profiles[]`, points on the parent row.

## 4. General armory-wide rules (VALIDATED, verbatim)
- "Unless stated otherwise, every item can only be purchased once by each model."
- "Any model with access to the Armory can buy as many items as it wants."
- "Items with a cost of '-' can not be selected."

## 4b. Army-specific rules (VALIDATED 2026-06-03, roster sheet)
- **Marks count as a veteran ability** for ALL units (the `*` note: "Counts as a veteran ability";
  "If a unit already is equipped with a mark, its benefits are included in the unit's profile").
  Verbatim effects:
  - **Khorne:** +1 Attack; character/Monstrous +1 Strength; Vehicles double hits on Tank Shock.
  - **Nurgle:** +1 Toughness; character/Monstrous +1 Wound; Vehicles roll 2D6 each Reinforcement,
    on 7+ remove a Crew Shaken / Engine Damage / Weapon Damage or restore 1 HP.
  - **Slaanesh:** +1 Initiative; character/Monstrous +2" Movement; Vehicles -1 Ld/CC result to
    hostiles within 18", -2 within 9".
  - **Tzeentch:** "Warded" ability; character/Monstrous becomes a psyker (1 power any discipline),
    or if already psyker manifests+denies +1 power/turn; Vehicles get a Warpflamer (9", Assault 4,
    S4, AP-1, D1, Flames).
  - **Undivided** (`Mark of Chaos Undivided`): progressive kill-based benefits — 1st kill = one
    Mark benefit (non-char level), 2nd = character-level benefit, 3rd = one Daemon weapon ability
    of chosen god, 4th = base stats replaced by a Daemon Prince of chosen god. If it loses its last
    Wound before any benefit → replaced by a Chaos Spawn under opponent's control.
- **Favored Units:** unit with a Mark that starts with model count = deity's sacred number (or a
  multiple) counts as favored → squad leaders get +1 Attack and a personal icon. Squad leaders are
  single models with sole armory access. Sacred numbers: **Tzeentch 9, Khorne 8, Nurgle 7,
  Slaanesh 6.**
- **Summoning:** if the army contains Chaos Daemons codex units, they must start in reserve (except
  Nurglings, deployable normally). Characters can't join Daemon units. Daemons can't fill mandatory
  AOP selections.
- **Animosity of the Gods**: the army's **most expensive HQ model** sets the "army mark". Its Mark
  of Chaos determines which marks/units may be used at all (table below — VALIDATED 2026-06-03,
  matches animosity.json + validators.ts allowedMarks cell-for-cell). A model with a Mark may only
  join units with the **same mark or none** — ⚠️ this join sub-clause is documented but NOT
  enforced in code (UnitCard.tsx joinableUnits never checks marks); see ki-csm-animosity-joinmark-01.
  - Compatibility matrix (HQ mark → which unit marks are allowed). Undivided/Without = always Yes.
    The two rival pairs are MUTUALLY EXCLUSIVE: **Khorne ✗ Slaanesh** and **Nurgle ✗ Tzeentch**.

    | HQ mark ↓ \ Unit mark → | Undiv/None | Khorne | Slaanesh | Nurgle | Tzeentch |
    |---|---|---|---|---|---|
    | Undivided / Without | Yes | Yes | Yes | Yes | Yes |
    | Khorne | Yes | Yes | **No** | Yes | Yes |
    | Slaanesh | Yes | **No** | Yes | Yes | Yes |
    | Nurgle | Yes | Yes | Yes | Yes | **No** |
    | Tzeentch | Yes | Yes | Yes | **No** | Yes |
  - A forbidden mark can't be used **even as allies** (e.g. Khorne HQ → no Slaanesh units/Mark, not
    even Daemonettes from the allied Daemons codex).
  - `Abaddon's Chosen` archetype switches this rule OFF (see §5a).

## 4c. Roster — slot → units (VALIDATED 2026-06-03)
- **HQ:** Adept of Possession, Chaos Lieutenant, Chaos Sorcerer, Dark Apostle, Daemon Prince,
  Infernal Acolyte, Lord Discordant, Warpsmith.
- **Troops:** Accursed Cultists, Chaos Space Marines, Cultists, Jakhals, Mutants, Poxwalkers,
  Traitor Guard, Tzaangors.
- **Elites:** Big Mutants, Blightlord Terminators, Chaos Terminators, Chosen, Cultist Firebrand,
  Dark Commune, Deathshroud Terminators, Eightbound, Exalted Plague Champion, Flawless Blades,
  Helbrute, Khorne Berzerkers, Legionnaires, Master of Execution, Noise Marines, Plague Marines,
  Possessed, Red Butcher Terminators, Rubric Marines, Scarab Occult Terminators, Sekhetar Robots,
  Tzaangor Shaman.
- **Fast Attack:** Chaos Bikers, Chaos Spawn, Foetid Bloat-Drone, Juggernaut Hellriders, Myphitic
  Blight-Hauler, Raptors, Tzaangor Enlightened, Venomcrawler, Warptalons.
- **Heavy Support:** Chaos Land Raider, Chaos Predator, Chaos Vindicator, Defiler, Forgefiend,
  Havocs, Maulerfiend, Obliterator, Plagueburst Crawler.
- **Dedicated Transport:** Chaos Rhino, Dreadclaw Drop Pod.
- **Fortifications:** Miasmic Malignifier, Noctilith Crown.
- **Flyers:** Heldrake.

## 4d. HQ datasheets — stats + engine mini-rules (VALIDATED 2026-06-03, unit HTML read)
All 8 HQ read from `data/source/Chaos Space Marines ENG/`. **None carry Terminator/Cataphractii**
→ armour keyword = standard (Power); only non-ᵀ armory items. All keyword `Chaos Space Marine`.
Stats: M/WS/BS/S/T/W/I/A/Ld/Sv. `*` line = the per-army upgrade variant.

| Unit | M | WS | BS | S | T | W | I | A | Ld | Sv | Pts | Upgrade (0-1/army) | Vet |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Adept of Possession | 6 | 3+ | 3+ | 4 | 4 | 4 | 5 | 2 | 8 | 3+ | 77 | Master of Possession +15 (→A3 Ld9; W4 unchanged) | 2 |
| Chaos Lieutenant | 6 | 2+ | 2+ | 4 | 4 | 4 | 5 | 2 | 8 | 3+ | 79 | Chaos Lord +15 | 2 |
| Chaos Sorcerer | 6 | 3+ | 3+ | 4 | 4 | 4 | 5 | 2 | 8 | 3+ | 92 | Master of Sorcery +15 | 2 |
| Dark Apostle | 6 | 2+ | 3+ | 4 | 4 | 4 | 5 | 2 | 8 | 3+ | 134 | Sinister Bishop +20 | 2 |
| Daemon Prince | 6 | 2+ | 2+ | 6 | 6 | 6 | 5 | 4 | 9 | 3+ | 184 | — (no upgrade variant) | 2 |
| Infernal Acolyte | 6 | 3+ | 3+ | 4 | 4 | 4 | 5 | 2 | 8 | 3+ | 92 | Infernal Master +15 | **1** |
| Lord Discordant | 12 | 2+ | 2+ | 4 | 6 | 5 | 5 | 4 | 9 | 2+ | 170 | — | 2 |
| Warpsmith | 6 | 3+ | 2+ | 4 | 4 | 4 | 5 | 2 | 8 | 2+ | 119 | Daemonforge Mastersmith +15 | 2 |

**Per-unit Mark pricing** (NOT global — each unit has its own table). Base infantry HQ:
Undivided +0 / Khorne +8 / Slaanesh +8 / Nurgle +20 / Tzeentch +15. Exceptions:
- **Chaos Sorcerer**: NO Khorne option (psyker). Undivided +0 / Slaanesh +8 / Nurgle +20 / Tzeentch +15.
- **Daemon Prince**: NO Undivided (must take a god mark). Khorne +11 / Slaanesh +11 / Nurgle +28 / Tzeentch +24.
- **Lord Discordant**: Undivided +0 / Khorne +8 / Slaanesh +8 / Nurgle +30 / Tzeentch +25.

**ENGINE rules surfaced from HQ (new — feed validators):**
- **Mark of Khorne ✗ Psyker.** Sorcerer has no Khorne; Daemon Prince psyker upgrade only "if no Mark
  of Khorne". Validator: Khorne mark blocks psyker status/upgrade. → links [[rules-csm-army]].
- **"One X per army can be upgraded to Y"** = roster-scope upgrade limit 0-1 (BSData `constraint
  max=1 scope=roster`). Upgrade variant = +A, +Ld, sometimes extra ability use.
- **veteran_max per unit** (Infernal Acolyte = 1, rest = 2). Marks count as a vet ability (army rule)
  → taking a mark consumes a vet slot.
- **Veterans of the Long War** (Lieutenant): grants a *free* vet ability to self + a friendly unit,
  same ability, **does NOT count against the veteran limit**. Chaos Lord uses it twice.
- **Per-model inv saves baked in datasheet** (Dark Apostle: Seal of corruption 4+ inv) — NOT from
  Daemon keyword. Distinguish datasheet inv from keyword-derived (Daemon 5+).
- **Psyker datasheet text defines power access**: Sorcerer knows Smite + ALL powers of a chosen
  discipline; Daemon Prince knows Smite + 1 power of a chosen discipline. → list-build power picker
  differs per unit. Master of Sorcery: +1 cast/+1 deny per round.
- **Faith/Pact casters** (Dark Apostle prayers 3+, Infernal Acolyte pacts 3+) = separate cast
  systems from Psyker, but share the Skirmish "1 per turn" cap (§ _engine.md E).
- **Weapon/equipment options with in-text gates**: Daemon Prince "Plague spewer (Nurgle only)",
  wings +37 → changes Unit type to Jump pack infantry (+6" M); Lord Discordant Technovirus-Injector
  grants Tank hunter to melee. These are per-unit option gates, not armory.
- **Unit types vary**: most Character/Infantry; Daemon Prince = Monstrous Creature; Lord Discordant =
  Character + Monstrous Creature. Drives weapon-type×order relaxations (_engine.md §5/D).
- **Daemon Prince**: Deep strike, Daemon, Daemonic instability, Terrifying(-1); armory access "like a
  character model".

## 4e. Troops datasheets — stats + option-semantics (VALIDATED 2026-06-03, unit HTML + prod JSON)
All 8 Troops read from `data/source/Chaos Space Marines ENG/`; option layer cross-checked vs
`data/parsed/chaos_space_marines_units.json`. **None carry Terminator/Cataphractii** → standard
(Power) armour. `*` line = the per-army upgrade variant (champion promotion). Stats M/WS/BS/S/T/W/I/A/Ld/Sv.

| Unit | base model | M | WS | BS | S | T | W | I | A | Ld | Sv | Pts | Champion upgrade | Keyword | Locked mark |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Accursed Cultists | Accursed Cultist (10-15) | 6 | 4+ | 4+ | 4 | 3 | 1 | 3 | 1 | 6 | 6+ | 6 | — (Torment 1-3 = 2nd profile, 16pts) | Cultist | — |
| Chaos Space Marines | Chaos Space Marine (4-19) | 6 | 3+ | 3+ | 4 | 4 | 2 | 4 | 2 | 7 | 3+ | 37 | Aspiring Champion +10 (Ld8, 47) | Chaos Space Marine | — |
| Cultists | Cultist (9-29) | 6 | 4+ | 4+ | 3 | 3 | 1 | 3 | 1 | 5 | 6+ | 5 | Aspiring Cultist Champion +5 (Ld6, 10) | Cultist | — |
| Jakhals | Jakhal (7-11) | 6 | 4+ | 4+ | 3 | 3 | 1 | 3 | 2 | 5 | 6+ | 7 | Aspiring Jakhal Champion +5 (12); Dishonored 0-4 = 2nd profile (S4, 7) | World Eaters | **Khorne** |
| Mutants | Mutant (15-30) | 6 | 4+ | 5+ | 3 | 4 | 1 | 3 | 2 | 5 | 5+ | 6 | Mutant Boss +5 (Ld6, 11) | Cultist | — |
| Poxwalkers | Poxwalker (10-21) | 6 | 4+ | 4+ | 3 | 4 | 1 | 2 | 1 | 5 | 6+ | 3 | — (no options at all) | Death Guard | **Nurgle** |
| Traitor Guard | Traitor Guardsman (10-30) | 6 | 4+ | 4+ | 3 | 3 | 1 | 3 | 1 | 6 | 5+ | 8 | Traitor Sergeant +5 (Ld7, 13); Chaos Ogryn 0-3 = 2nd profile (T5 W3, 28) | Cultist | — |
| Tzaangors | Tzaangor (8-17) | 6 | 4+ | 4+ | 4 | 4 | 1 | 4 | 2 | 6 | 5+ | 10 | Aspiring Twistbray +5 (Ld7, 15) | Thousand Sons | **Tzeentch** |

**Per-unit Mark pricing** (only the 4 non-locked units have a Mark group): Khorne/Slaanesh/Nurgle/Tzeentch =
+1/+1/+1/+2 for Accursed Cultists, Cultists, Traitor Guard; +2/+2/+2/+5 for Chaos Space Marines.
Jakhals/Poxwalkers/Tzaangors carry NO mark group — `locked_mark` + the mark as an innate ability
(Mark of Khorne/Nurgle/Tzeentch). ✓ matches keyword model (locked-mark unit ⇒ omit selector).

**Option-semantics — constraint vocabulary ACTUALLY implemented in prod JSON** (richer than I'd noted in
`_engine.md §10`; cross-checked here):
- `mark` — Mark-of-Chaos selector (choose-one god; gated by Animosity §4b; counts as a vet ability).
- `per_n` `{per_n:N, count_per_n:K}` — **ratio** swap/add: per N models, K may take. (CSM 5/1 weapon swaps;
  Cultists 10/1; Jakhals 8/1 Jakhal + 8/2 Dishonored; Traitor Guard 10/1 weapon + 10/1 Ogryn.)
- `every` — each model may individually swap (Cultists base-gun swap; Mutants; Traitor Guard Lasgun→CCW;
  Tzaangors Autopistol+Chainsword→Eldritch shield+Tzaangor blade).
- `fixed_max` `{max:N}` — up to N models total (Mutants: ≤3 swap to Flamer/HMG).
- `one` — single selection / single upgrade (champion promotions via `variant_link`+`inline_pts`;
  Mutants per-model upgrade pick; Tzaangors Icon +10 / Instrument +5 = single-model slots).

**Gaps still TEXT-ONLY (the LOGIC layer to build in ENGINE phase — see [[project-option-semantics]]):**
- **`replace` drop-side unstructured.** Added weapon is in `choices`, but the *dropped* weapons live only
  in the header string. E.g. CSM "swap Astartes Chainsword, Bolter AND Bolt pistol → Heavy chainaxe"
  (3 dropped); Traitor Guard "Lasgun → Chainsword & Laspistol"; Cultists "Machine gun → Crude melee & Machine pistol".
- **upgrade-choice → stat/ability linkage missing.** Mutants choices (Bloated/Burly/Leaping/Horrifying)
  are priced in `option_groups`, but the EFFECT lives in free-text `abilities[]` (Bloated→4+ save =
  stat-override; Burly→+1 S; Leaping→Anti-Grav+Haste(1"); Horrifying→Terrifying(-1)). Engine must link
  choice-name → ability text → equipMods. (equipMods regex catches "+1 Strength" / "4+ armor save" only
  if fed.) Same pattern: Tzaangors "Eldritch shield" choice → ability "gains Deflect & Parry".
- **cross-unit list-composition caps (chain A):** Poxwalkers "Slaves of Darkness" (Poxwalker units ≤
  Plague Marine units) is **IMPLEMENTED** ✅ (`validators.ts:401-413`) — corrected after foundation
  gap-check. STILL text-only: Accursed Cultists "per 5 → 1 Torment" is mapped to `one` w/ empty choices →
  the 1-per-5 ratio for the Torment 2nd profile is NOT enforced (only the model min/max 1-3 caps it);
  Traitor Guard "per 10 → 1 Chaos Ogryn" same (model max 0-3 caps it, but the per-10-base ratio isn't).
- **`single-slot` armour exclusivity** 🟡 v0.50 (no Troop carries Terminator armour; bought-armour single-slot now built — see §6d).

**DATA BUG — RESOLVED 2026-06-20:** the note below was stale. Re-checked `chaos_space_marines.ts`
(line 378) — `champion_has_armory: true` already, consistent with every other troop
champion-promotion (Cultists, Jakhals, Mutants, Traitor Guard, Tzaangors). No fix needed; this must
have been corrected in a prior session without updating this digest. Confirmed correct with the
designer 2026-06-20.

## 4f. Elites datasheets — stats + option-semantics (VALIDATED 2026-06-03, prod JSON canonical)

All 22 Elites cross-checked vs `data/parsed/chaos_space_marines_units.json` (key `units.<Name>`).
HTML spot-checked on Chaos Terminators / Big Mutants / Blightlord (JSON == HTML → JSON-only is
lossless for the rest). Stats M/WS/BS/S/T/W/I/A/Ld/Sv; `base` = base model pts. Helbrute is a
**Walker** (own stat shape, footnote ‡).

| Unit | base model (min-max) | M | WS | BS | S | T | W | I | A | Ld | Sv | Pts | Keyword | Locked mark | Armour |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Big Mutants | Big Mutant (3-10) | 6 | 3+ | 5+ | 6 | 4 | 3 | 3 | 3 | 6 | 5+ | 26 | Cultist | — | std |
| Blightlord Terminators | Terminator (4-13) | 6 | 3+ | 3+ | 4 | 6 | 3 | 4 | 3 | 8 | 2+ | 109 | Death Guard | **Nurgle** | **Cataphractii** (4+inv) |
| Chaos Terminators | Chaos Terminator (4-9) | 6 | 3+ | 3+ | 4 | 5 | 2 | 4 | 3 | 8 | 2+ | 68 | Chaos Space Marine | — | **Terminator** (Crux 5+inv) |
| Chosen | Chosen (1-10) | 6 | 2+ | 2+ | 4 | 4 | 2 | 4 | 2 | 8 | 3+ | 35 | Chaos Space Marine | — | std |
| Cultist Firebrand | Cultist Firebrand (1-1) | 6 | 4+ | 4+ | 3 | 3 | 2 | 3 | 1 | 7 | 5+ | 39 | Cultist | — | std |
| Dark Commune | Dark Executioner (1-2)† | 6 | 4+ | — | 4 | 3 | 1 | 3 | 2 | 6 | 4+ | 13 | Cultist | — | std |
| Deathshroud Terminators | Deathshroud Terminator (2-6) | 6 | 2+ | 3+ | 4 | 6 | 3 | 4 | 3 | 9 | 2+ | 117 | Death Guard | **Nurgle** | **Cataphractii** (4+inv) |
| Eightbound | Eightbound (2-7) | 6 | 3+ | 3+ | 6 | 5 | 2 | 4 | 4 | 8 | 3+ | 52 | World Eaters | **Khorne** | std |
| Exalted Plague Champion | Exalted Plague Champion (1-1) | 6 | 3+ | 3+ | 4 | 5 | 4 | 4 | 2 | 8 | 3+ | 62 | Death Guard | **Nurgle** | std |
| Flawless Blades | Flawless Blade (3-6) | 8 | 2+ | 3+ | 5 | 5 | 2 | 5 | 2 | 8 | 3+ | 54 | Emperor's Children | **Slaanesh** | std |
| Helbrute‡ | Helbrute (1-2) | 6 | 3+ | 3+ | 6 | — | — | 4 | 3 | — | — | 174 | Chaos Space Marine | — | vehicle |
| Khorne Berzerkers | Khorne Berzerker (4-7) | 6 | 3+ | 3+ | 5 | 4 | 2 | 4 | 3 | 8 | 3+ | 46 | World Eaters | **Khorne** | std |
| Legionnaires | Legionnaire (4-9) | 6 | 3+ | 3+ | 4 | 4 | 2 | 4 | 2 | 8 | 3+ | 38 | Chaos Space Marine | — | std |
| Master of Execution | Master of Execution (1-1) | 6 | 2+ | 3+ | 4 | 4 | 3 | 4 | 2 | 8 | 3+ | 70 | Chaos Space Marine | — | std |
| Noise Marines | Noise Marine (4-11) | 8 | 3+ | 3+ | 4 | 4 | 2 | 5 | 2 | 8 | 3+ | 37 | Emperor's Children | **Slaanesh** | std |
| Plague Marines | Plague Marine (4-13) | 6 | 3+ | 3+ | 4 | 5 | 3 | 4 | 2 | 8 | 3+ | 53 | Death Guard | **Nurgle** | std |
| Possessed | Possessed (5-10) | 8 | 3+ | 3+ | 5 | 5 | 2 | 4 | 3 | 8 | 3+ | 50 | Chaos Space Marine | — | std |
| Red Butcher Terminators | Red Butcher Terminator (4-8) | 6 | 2+ | 3+ | 5 | 5 | 2 | 4 | 4 | 8 | 2+ | 73 | World Eaters | **Khorne** | **Cataphractii** (4+inv) |
| Rubric Marines | Rubric Marine (4-8) | 6 | 3+ | 3+ | 4 | 4 | 2 | 4 | 2 | 8 | 3+ | 41 | Thousand Sons | **Tzeentch** | std |
| Scarab Occult Terminators | Scarab Occult Terminator (4-8) | 6 | 3+ | 3+ | 4 | 5 | 2 | 4 | 3 | 9 | 2+ | 79 | Thousand Sons | **Tzeentch** | **Terminator** (Crux 5+inv) |
| Sekhetar Robots | Sekhetar Robot (2-4) | 6 | 4+ | 4+ | 5 | 6 | 3 | 3 | 2 | 10 | 3+ | 148 | Thousand Sons | **Tzeentch** | std |
| Tzaangor Shaman | Tzaangor Shaman (1-1) | 6 | 3+ | 3+ | 4 | 4 | 2 | 4 | 2 | 7 | 5+ | 31 | Thousand Sons | **Tzeentch** | std |

† Dark Commune = 4 distinct 1-2 models (Dark Executioner / Cult Demagogue / Mindsorcerer / Cult
Bannerbearer); stat line shown is the Executioner. ‡ Helbrute Walker stats: M6" WS3+ BS3+ S6,
Front 12 / Side 12 / Rear 10, I4 A3, HP3.

**Armour keyword findings (resolves the §7 unit→armour PENDING for Elites):** 5 units carry
Terminator-class armour, split by inv source —
- **Cataphractii armor (4+inv)** → Blightlord, Deathshroud, Red Butcher. ᵀ-gated ✅.
- **Terminator / Crux Terminatus (5+inv)** → Chaos Terminators, Scarab Occult Terminators. Now
  ᵀ-gated ✅ (fixed v0.51 — see below).
  All other Elites = standard (Power) armour, no ᵀ restriction (correct).

**✅ ENGINE FIX (ki-csm-tgate-01, v0.51):** `modelRestrictsToTermSubset(unit, boughtArmourNames)`
in `engine/keywords.ts` now derives the ᵀ-gate from the armour **keyword**, not an inv-save ability
string. Grounded in `Armory.html`: *"Models wearing Cataphractii or Terminator armor can only
receive equipment with ᵀ."* — both keywords gate identically (they differ only in the inv save).
The gate fires when the model carries a Terminator-class keyword either INNATE (`unit.armourKeyword`
= Terminator/Cataphractii on the 5 innately-armoured units — now catches Chaos / Scarab Occult
Terminators) OR DYNAMICALLY BOUGHT (a `Terminator armor`/`Cataphractii armor` equipment item — the
rule applies whether the keyword is innate or purchased). `ArmoryModal` passes the bought-equipment
names and keeps already-bought items visible (`term_compat || boughtItemNames.has`) so the non-ᵀ
armour item itself stays removable. The legacy `"cataphractii armor"` ability-string match is kept
as a fallback. Minor edge (display-gate design, no validator): non-ᵀ gear bought BEFORE the armour
stays in the loadout (removable) rather than auto-flagged illegal.

**Per-unit Mark pricing:** locked-mark units (15 of 22 carry a god keyword) omit the selector and
inject the mark as an innate ability — matches the keyword model. Non-locked: Big Mutants, Chaos
Terminators, Chosen, Helbrute, Legionnaires, Master of Execution, Possessed carry a `mark` group
(Possessed = Nurgle/Tzeentch only; Chaos Terminators = no Undivided). Cultist Firebrand & Master of
Execution price marks on the HQ/Undivided scale. Mark pricing & animosity gating = ✅ (`points.ts` /
`validators.ts allowedMarks()`).

**Option-semantics — per unit** (literal text · primitive · status). ✅ enforced · 🟡 points-only,
logic text-only · ❌ not modeled.
- **Big Mutants** — `one` Bloated/Burly/Leaping/Horrifying per-model upgrade (Bloated +11 →4+save) ·
  primitive `one`+choice→ability ✅pts/🟡effect; `every` Machine gun +1 · `every` ✅; `fixed_max{2}`
  Flamer/Heavy machine gun +8 · ✅count; Boss Mutant variant +10 (armory) · `variant_link` ✅.
  Choice→stat-override (Bloated 4+sv) text-only ❌.
- **Blightlord Terminators** — `every` Combi-bolter↔Combi swap; `every` Balesword↔melee swap ·
  `every` ✅pts; `per_n{5,2}` Combi-flamer swap; `per_n{5,2}` combi+Balesword→Heavy plague weapon
  (-6) · `per_n`+`replace` ✅pts/❌drop-side. ᵀ-gate ✅ (Cataphractii).
- **Chaos Terminators** (sample) — `mark` (no Undivided) ✅; `every`×3 weapon swaps · ✅pts/❌drop;
  `per_n{5,2}` heavy-weapon swap · ✅count/❌drop. **ᵀ-gate NOT applied ❌ (bug above).**
- **Chosen** — Character/Infantry/Squadron, `has_armory_access` all models; `mark` incl Undivided ✅;
  `one` AOP (per-HQ) · advisor ✅; 6 squad upgrades each carrying ability text · `every`-ish +
  choice→ability 🟡 (pts ✅, effect text-only ❌). vet_max 2.
- **Cultist Firebrand** — Character, `mark` HQ-pricing (0/8/8/20/15) ✅; `one` "per Cultists unit,
  does NOT occupy an Elite slot" · slot-exemption primitive ❌ (not modeled — flag). armory ✅.
- **Dark Commune** — 4-model unit; `is_psyker` (Mindsorcerer) + Faithful prayer (Cult Demagogue);
  `mark` cheap (1/1/1/2) ✅; Command-squad / per-HQ link · advisor-ish ✅. Cast enforcement 🟡 (§6d).
- **Deathshroud Terminators** — NO option_groups (fixed loadout); Bodyguard / Eyes of Mortarion
  abilities; ᵀ-gate ✅ (Cataphractii). vet_max 1.
- **Eightbound** — locked Khorne; `one` Champion (Eightbound Goremonger) swap · ✅; `every` "upgrade
  to Exalted Eightbound +20" (→+1W +Daemon) · `every`+choice→stat/keyword 🟡 (pts ✅, +1W/Daemon
  injection ❌). No armory.
- **Exalted Plague Champion** — Character, advisor (5 per HQ) ✅; `one required:true` "Must be
  upgraded to one of" 5 specialisations, each with `abilities[]` · forced-`one`+choice→ability
  🟡 (forces pick & pts ✅; ability effects text-only ❌). armory ✅.
- **Flawless Blades** — locked Slaanesh; Daemon / Parry; NO options. vet_max 1.
- **Helbrute‡** — Walker/vehicle, `mark` (10 each) ✅; `mark`-group + 3×`one` weapon replaces ·
  `one`+`replace` ✅pts/❌drop; Furioso, Squadron; armory ✅ (vehicle tab, OLD `category:'vehicle'`
  flag 🟡). vet_max 2.
- **Khorne Berzerkers** — locked Khorne; `per_n{4,2}` Bolt pistol→Plasma/etc swap · ✅count/❌drop.
  champ armory ✅.
- **Legionnaires** — `mark` ✅; `per_n{5,2}` bolter swap (8 options); `per_n{5,2}` "other
  Legionnaires" 3-weapon→Heavy chainaxe (replace drops 3) · ✅count/❌drop-side (3 dropped).
  **`veteran_required:true`** (Legionnaire Warband relevance) — vet enforcement ✅ (§6d archetypes).
  vet_max 2.
- **Master of Execution** — Infantry (is_character false), advisor (1 per HQ) ✅; Command squad;
  `mark` Undivided-pricing ✅; armory ✅. vet_max 2.
- **Noise Marines** — locked Slaanesh; `every`×2 swaps · ✅; `fixed_max{2}`×2 (2nd gated **"if 12
  models"**) · ✅count / **conditional-unlock ❌**. champ armory ✅.
- **Plague Marines** — locked Nurgle; `per_n{5,2}`×2 special-weapon swaps · ✅count/❌drop; `one`
  Icon/banner single-slot · ✅. champ armory ✅.
- **Possessed** — `mark` (Nurgle 3 / Tzeentch 9 only) ✅; `every` Jump packs +11 (→Jump pack
  infantry, +Move) · `every`+unit-type change 🟡 (pts ✅, type/Move injection ❌); Daemon. vet_max 2.
- **Red Butcher Terminators** — locked Khorne; `one` Champion swap · ✅; ᵀ-gate ✅ (Cataphractii).
  champ armory ✅.
- **Rubric Marines** — locked Tzeentch; `is_psyker` (Aspiring Sorcerer); `every` + 2×`one`
  Soulreaper (2nd gated **"if 9 models"**) · ✅count / conditional-unlock ❌. cast 🟡. champ armory ✅.
- **Scarab Occult Terminators** — locked Tzeentch; `is_psyker`; 2×`one` combi-replace + 2×`one`
  Hellfyre (gated **"if 9 models"**; one has `inline_pts:64`) · ✅pts/❌drop/conditional-unlock ❌.
  **ᵀ-gate NOT applied ❌ (Crux bug above).** champ armory ✅.
- **Sekhetar Robots** — locked Tzeentch, Monstrous Infantry; `every` swap · ✅; Battle Protocols
  (select-one-per-activation) · in-game toggle, not list-build ❌ (display-only); Infiltrate. No armory.
- **Tzaangor Shaman** — Character, locked Tzeentch, `is_psyker`, advisor (1 per HQ) ✅; NO
  weapons/options. armory ✅.

**Recurring gaps across Elites (all already on the §6d / _engine.md §10 build-list — no NEW primitives):**
1. **`replace` drop-side** ❌ — dropped weapons live in header text only; Elites stress it harder than
   Troops (Blightlord/Scarab multi-weapon→single combos; Legionnaires drops 3).
2. **Conditional-unlock options** ❌ — "if N models" gating on a `fixed_max`/`one` (Noise Marines "if
   12", Rubric & Scarab "if 9"). Currently the extra slot is always offered; size-gate not enforced.
   *(New observation vs §4e — feed into _engine.md §10.)*
3. **choice→ability/stat/keyword linkage** ✅ PRIMITIVE EXISTS (ki-parser-02, v0.51) — `OptionEffect`
   on Choice/OptionGroup carries `grants_abilities` / `stat_mod` / `adds_unit_types` (ADDITIVE). Tagged:
   Possessed Jump packs (→Deep strike + Jump pack infantry) and Daemon Prince wings (+6" M + Jump pack
   infantry). STILL UNTAGGED (same primitive applies, just add `effect`): Big Mutants (Bloated→4+sv),
   Eightbound (Exalted→+1W+Daemon), Exalted Plague Champion & Chosen specialisations.
4. **Slot-exemption primitive** ❌ — Cultist Firebrand "does not occupy an Elite slot" (per Cultists
   unit). Not modeled; flag for AOP layer. *(New observation.)*
5. **forced `one required`** 🟡 — Exalted Plague Champion must pick a specialisation; pts/force ✅,
   effects text-only.
6. **ᵀ-gate via armour KEYWORD** ❌ — see bug; Crux-Terminatus units slip the gate.
7. **2nd-profile / advisor / Battle-Protocol caps** — advisor ✅ (validators); Battle Protocols are
   an in-game per-activation toggle, out of list-build scope.

## 4g. Fast Attack datasheets — stats + option-semantics (VALIDATED 2026-06-03, prod JSON canonical)

All 9 FA cross-checked vs `data/parsed/chaos_space_marines_units.json`. Stats pulled exact (PowerShell
ConvertFrom-Json). **None carry Terminator/Cataphractii armour** → all standard (Power) or vehicle;
**no ᵀ-gate applies to this slot.** Stats M/WS/BS/S/T/W/I/A/Ld/Sv; 3 vehicles use the Walker/Vehicle
shape (footnote ‡).

| Unit | base model (min-max) | type | M | WS | BS | S | T | W | I | A | Ld | Sv | Pts | Keyword | Locked mark |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Chaos Bikers | Chaos Biker (2-9) | Bike | 12 | 3+ | 3+ | 4 | 5 | 3 | 4 | 2 | 7 | 3+ | 66 | Chaos Space Marine | — |
| Chaos Spawn | Chaos Spawn (1-4) | Monst Inf | 12 | 4+ | — | 5 | 5 | 3 | 3 | 3 | 10 | 6+ | 22 | Cultist | — |
| Foetid Bloat-Drone‡ | Foetid Bloat-Drone (1-2) | Vehicle | 12 | — | 3+ | 5 | — | — | 4 | 1 | — | — | 136 | Death Guard | **Nurgle** |
| Juggernaut Hellriders | Hellrider (2-7) | Bike | 12 | 3+ | 3+ | 5 | 5 | 4 | 4 | 4 | 8 | 3+ | 104 | World Eaters | **Khorne** |
| Myphitic Blight-Hauler‡ | Myphitic Blight-Hauler (1-2) | Vehicle | 12 | 3+ | 3+ | 5 | — | — | 4 | 2 | — | — | 174 | Death Guard | **Nurgle** |
| Raptors | Raptor (4-14) | Jump pack inf | 12 | 3+ | 3+ | 4 | 4 | 2 | 4 | 2 | 7 | 3+ | 43 | Chaos Space Marine | — |
| Tzaangor Enlightened | Tzaangor Enlightened (2-8) | Jetbike | 12 | 3+ | 3+ | 4 | 4 | 2 | 4 | 3 | 8 | 5+ | 27 | Thousand Sons | **Tzeentch** |
| Venomcrawler‡ | Venomcrawler (1-2) | Walker | 12 | 3+ | 3+ | 5 | — | — | 4 | 3 | — | — | 156 | Chaos Space Marine | — |
| Warptalons | Warp Talon (4-9) | Jump pack inf | 12 | 3+ | 3+ | 4 | 4 | 2 | 4 | 2 | 8 | 3+ | 63 | Chaos Space Marine | — |

‡ Vehicle stat shape (M/WS/BS/S · Front/Side/Rear · I/A/HP): Foetid Bloat-Drone M12" WS– BS3+ S5,
11/11/10, I4 A1 HP2 · Myphitic Blight-Hauler M12" WS3+ BS3+ S5, 11/11/10, I4 A2 HP2 · Venomcrawler
M12" WS3+ BS3+ S5, 11/11/10, I4 A3 HP2.

**Mark pricing:** non-locked CSM-keyword units carry a `mark` group — Chaos Bikers 3/3/3/7,
Chaos Spawn 2/2/2/6, Raptors & Warptalons 2/2/2/5 (K/S/N/T); vehicles flat **+10 each god**
(Venomcrawler), Undivided = free default (not listed). 4 locked-mark units (Hellriders=Khorne,
Bloat-Drone & Blight-Hauler=Nurgle, Tzaangor Enlightened=Tzeentch) omit the selector + carry
`locked_mark` ✓. Mark pricing & animosity gating ✅ (`points.ts` / `validators.ts`).

**Option-semantics — per unit** (literal text · primitive · status). ✅ enforced · 🟡 points-only ·
❌ not modeled.
- **Chaos Bikers** — `mark` ✅; `fixed_max{2}` "Two Bikers may be equipped" Flamer/Melta/Plasma add ·
  ✅count; `fixed_max{2}` "**Alternatively** two may swap their Combi-bolter" Combi-flamer/melta/plasma ·
  ✅count/❌drop + **cross-group "Alternatively" exclusivity ❌** (same 2 models, two groups mutually
  exclusive — not enforced); `one` Champion→Aspiring Chaos Biker Champion +10 (`variant_link`, grants
  armory) · ✅. armAccess only via champion variant. vet_max 2.
- **Chaos Spawn** — Monstrous Infantry, Move through cover / Terrifying(-1); `mark` ✅; `every` one-of
  upgrade (Grasping Pseudopods +3A / Toxic Haemorrhage Poison(3+) / Subcutaneous Armor 5+sv) ·
  `every`+choice→ability/stat 🟡 (pts ✅, the +3A / Poison(3+) / 5+save effects text-only ❌). No armory.
- **Foetid Bloat-Drone‡** — locked Nurgle, Anti-Grav/Fast/Squadron; `one` **replace** Fleshmower →
  Two plague spewers (+41) / Heavy blight launcher (+74) · `one`+`replace` ✅pts/❌drop; "Fleshmower:
  WS3+ if it starts with this weapon" = **conditional stat tied to keeping the default** — reverts if
  replaced, not modeled ❌. armory ✅ (vehicle tab, OLD `category:'vehicle'` flag 🟡).
- **Juggernaut Hellriders** — locked Khorne, Berserk(5+)/Blind Rage; `per_n{4,2}` Bolt pistol →
  Plasma pistol (+8) / Eviscerator (+12) · ✅count/❌drop. champ armory ✅. vet_max 1.
- **Myphitic Blight-Hauler‡** — locked Nurgle, Squadron; `one` add Bile spurt +19 · ✅. armory ✅ (veh).
- **Raptors** — Deep strike; `mark` ✅; `fixed_max{2}` Bolt pistol→Plasma pistol · ✅count;
  `fixed_max{2}` "**Alternatively** swap Astartes chainsword AND Bolt pistol" → Flamer/Melta/Plasma ·
  ✅count/❌drop (2 dropped) + cross-group exclusivity ❌; `one` Champion→Aspiring Raptor Champion +10
  (`variant_link`, armory) · ✅. **Host Raptorial archetype** makes Raptors Troops (§5a) — slot remap ✅.
  vet_max 2.
- **Tzaangor Enlightened** — Jetbike, locked Tzeentch; `every` swap Autopistol+Chainsword → Divining
  spear (+2) / Fatecaster greatbow (+15) · `every`+`replace` ✅pts/❌drop (2 dropped); "Sniper:
  greatbow → +1 BS" = choice→ability ❌. No armory.
- **Venomcrawler‡** — Walker, Move through cover/Squadron; `mark` flat +10/god (no Undivided line =
  free default) ✅. armory ✅ (veh). vet_max 2.
- **Warptalons** — Jump pack inf, Deep strike / Daemon / Daemonic charge; `mark` ✅; **NO weapon
  options** (fixed Warp claws). champ armory ✅. vet_max 2.

**Recurring gaps across Fast Attack (all already on the §6d / _engine.md §10 build-list — no NEW
primitives beyond what §4f already flagged):**
1. **`replace` drop-side** ❌ — Bloat-Drone/Hellriders/Raptors/Tzaangor swaps drop weapons named only
   in header text (Raptors & Tzaangor drop 2 each).
2. **Cross-group "Alternatively" exclusivity** ❌ — Chaos Bikers & Raptors: the second `fixed_max{2}`
   group is mutually exclusive with the first on the SAME models; engine offers both independently.
   *(Same class as the Elites cross-option exclusivity gap.)*
3. **choice→ability/stat linkage** ❌ — Chaos Spawn (Grasping/Toxic/Subcutaneous), Tzaangor (greatbow
   →+1BS), Bloat-Drone Fleshmower conditional WS.
4. **Conditional stat tied to keeping a default weapon** ❌ — Bloat-Drone "WS3+ if it starts with the
   Fleshmower" reverts when the weapon is replaced. *(New flavour of the choice→stat gap; feed
   _engine.md §10.)*
No ᵀ-gate / armour-keyword issue in this slot (no Terminator armour present).

## 4h. Heavy Support datasheets — stats + option-semantics (VALIDATED 2026-06-03, prod JSON canonical)

All 9 HS cross-checked vs `data/parsed/chaos_space_marines_units.json`. 7 vehicles/walkers + 2
infantry. **No unit carries Terminator/Cataphractii armour** → no ᵀ-gate in this slot. **Obliterator
resolved** (was a §7 open item): its 2+ is a plain armour save, NO Crux/Cataphractii/Terminator
ability → NOT a Terminator-keyword unit, no ᵀ restriction.

**Infantry** (M/WS/BS/S/T/W/I/A/Ld/Sv):
| Unit | base model (min-max) | type | M | WS | BS | S | T | W | I | A | Ld | Sv | Pts | Keyword | Locked |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Havocs | Chaos Havoc (5-10) | Infantry | 6 | 3+ | 3+ | 4 | 4 | 2 | 4 | 2 | 7 | 3+ | 34 | Chaos Space Marine | — |
| Obliterator | Obliterator (1-3) | Monst Inf | 6 | 3+ | 3+ | 5 | 5 | 3 | 4 | 3 | 8 | 2+ | 141 | Chaos Space Marine | — |

**Vehicles/Walkers** (M/WS/BS/S · Front/Side/Rear · I/A/HP):
| Unit | (min-max) | type | M | WS | BS | S | F | Si | R | I | A | HP | Pts | Keyword | Locked |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Chaos Land Raider | (1-1) | Vehicle | 12" | — | 3+ | 7 | 14 | 14 | 14 | 4 | 1 | 4 | 558 | Chaos Space Marine | — |
| Chaos Predator | (1-1) | Vehicle | 12" | — | 3+ | 6 | 13 | 11 | 10 | 4 | 1 | 3 | 232 | Chaos Space Marine | — |
| Chaos Vindicator | (1-1) | Vehicle | 12" | — | 3+ | 6 | 13 | 11 | 10 | 4 | 1 | 3 | 373 | Chaos Space Marine | — |
| Defiler | (1-1) | Walker | 6" | 3+ | 3+ | 6 | 12 | 12 | 10 | 4 | 3 | 3 | 419 | Chaos Space Marine | — |
| Forgefiend | (1-1) | Walker | 6" | 3+ | 3+ | 6 | 12 | 12 | 10 | 3 | 1 | 3 | 269 | Chaos Space Marine | — |
| Maulerfiend | (1-1) | Walker | 6" | 3+ | 3+ | 6 | 12 | 12 | 11 | 4 | 5 | 3 | 187 | Chaos Space Marine | — |
| Plagueburst Crawler | (1-1) | Vehicle | 12" | — | 3+ | 7 | 13 | 12 | 11 | 4 | 2 | 3 | 324 | Death Guard | **Nurgle** |

**Mark pricing:** vehicles flat **+10/god** (Undivided free default, not listed); Havocs 2/2/2/5;
Obliterator 4/4/4/10 (K/S/N/T). Plagueburst Crawler = locked Nurgle (no mark group). Pricing +
animosity ✅.

**Option-semantics — per unit** (literal · primitive · status):
- **Chaos Land Raider** — Transport(10)+Assault Ramp innate; `mark` ✅; `one` combi add
  (flamer+8/bolter+11/melta+18) · ✅; `one` Havoc launcher +29 add · ✅. armory ✅ (veh tab, OLD flag 🟡).
- **Chaos Predator** — `mark` ✅; `one` **replace** Predator autocannon → Twin entropy cannon
  **(Nurgle only)** +50 / Twin lascannon +50 · `one`+`replace` ✅pts/❌drop + **option-level mark-gate
  "(Nurgle only)" text-only ❌**; `one` sponsons (two Heavy bolters+54 / two lascannons+138) add · ✅;
  `one` combi add · ✅; `one` Havoc launcher +29 · ✅. armory ✅(veh).
- **Chaos Vindicator** — `mark` ✅; `one` combi add · ✅; `one` Havoc launcher +29 · ✅; `one` Siege
  shield +15 · ✅pts, grants ability (terrain-immune + front cover) = choice→ability ❌. armory ✅(veh).
- **Defiler** — `mark` ✅; `one` combi add · ✅; `one` **replace** Heavy flamer → Power scourge+4 /
  Havoc launcher+20 · ✅/❌drop; `one` **replace** Reaper autocannon → Twin heavy bolter+0 / Twin
  lascannon+107 · ✅/❌drop. armory ✅(veh).
- **Forgefiend** — `mark` ✅; `one` **replace** two Hades autocannon → two Ectoplasma guns +21 ·
  ✅/❌drop; `one` additional Ectoplasma gun +75 add · ✅. armory ✅(veh).
- **Havocs** — Unyielding; `mark` ✅; `fixed_max{4}` Bolter → Heavy bolter/Reaper chaincannon/
  Autocannon/Missile launcher/Lascannon · ✅count/❌drop (Bolter dropped); `one` Champion→Aspiring
  Havoc Champion +10 (`variant_link`, armory) · ✅. armAccess via champion only. vet_max 2.
- **Maulerfiend** — Move through cover / Charge 12"; `mark` ✅; `one` **replace** Lasher tendrils →
  two Magma cutters +17 · ✅/❌drop. armory ✅(veh).
- **Obliterator** — Monstrous Inf, Deepstrike / Daemon / Unyielding; `mark` ✅; **NO weapon options**;
  "Fleshmetal guns: may not use same ranged weapon two consecutive rounds" = in-game restriction,
  out of list-build scope. 2+ = plain Sv (not Terminator). No armory. vet_max 2.
- **Plagueburst Crawler** — locked Nurgle; `one` **replace** Rothail volley gun → Heavy slugger +5 ·
  ✅/❌drop; `one` **replace** two Plague spewers → two Entropy cannons +27 · ✅/❌drop. armory ✅(veh).

**Recurring gaps across Heavy Support (all on the existing §6d / _engine.md §10 build-list):**
1. **`replace` drop-side** ❌ — dominant here (Predator/Defiler/Forgefiend/Maulerfiend/Plagueburst/
   Havocs all swap weapons named only in header text).
2. **Option-level mark-gate** ❌ — Chaos Predator "Twin entropy cannon **(Nurgle only)**": a single
   weapon choice gated by the army/unit mark. Currently shown regardless of mark. *(Same class as the
   HQ Daemon Prince "Plague spewer (Nurgle only)" gate — flag for the option layer.)*
3. **choice→ability linkage** ❌ — Vindicator Siege shield → terrain immunity + front cover.
4. **Vehicle armory gating on OLD `category:'vehicle'` flag** 🟡 — all 7 vehicles (the keyword
   migration target, §6d).
No ᵀ-gate issue in this slot.

## 4i. Dedicated Transport + Fortifications + Flyers — stats + option-semantics (VALIDATED 2026-06-03)

Last 5 CSM units (DT 2, Fort 2, Flyers 1), cross-checked vs prod JSON. **None carries Terminator/
Cataphractii armour.** All vehicle-type stats (M/WS/BS/S · Front/Side/Rear · I/A/HP); the 2 Fortifications
are immobile (M/WS/I/A = "–").

| Unit | slot | type | M | WS | BS | S | F | Si | R | I | A | HP | Pts | Keyword | Locked |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Chaos Rhino | DT | Vehicle | 12" | — | 3+ | 5 | 11 | 11 | 10 | 4 | 1 | 2 | 111 | Chaos Space Marine | — |
| Dreadclaw Drop Pod | DT | Vehicle | 12" | 4+ | 4+ | 5 | 11 | 11 | 11 | 4 | 4 | 2 | 154 | Chaos Space Marine | — |
| Miasmic Malignifier | Fort | Vehicle/Fort | — | — | 6+ | 6 | 12 | 12 | 12 | — | — | 3 | 125 | Death Guard, Fortification | **Nurgle** |
| Noctilith Crown | Fort | Vehicle/Fort | — | — | 6+ | 6 | 11 | 11 | 11 | — | — | 2 | 100 | Fortification | — |
| Heldrake | Flyers | Flyer/Vehicle | 12" | 3+ | 3+ | 6 | 12 | 12 | 10 | 4 | 3 | 3 | 240 | Chaos Space Marine | — |

**Mark pricing:** Rhino / Dreadclaw / Heldrake = flat **+10/god** (Undivided free default). Miasmic
Malignifier = locked Nurgle (no group). Noctilith Crown = NO mark group at all (neutral Fortification,
keyword `Fortification` only — no Chaos Space Marine keyword → also outside Trait eligibility §5c).

**Option-semantics — per unit:**
- **Chaos Rhino** — Fire hatches(2); Transport(10) **"excluding models in Terminator armor"**; `mark`
  ✅; `one` combi add (8/11/18) · ✅; `one` Havoc launcher +29 · ✅. armory ✅(veh tab, OLD flag 🟡).
- **Dreadclaw Drop Pod** — Anti-Grav / Deep strike / Control Jets; **Drop Pod Assault** (always starts
  in reserve + Deep strike even if mission forbids reinforcements — overrides AOP, FAQ#5 Codex>Core);
  Transport(10 or 1 Helbrute); `mark` ✅; NO weapon options. Drives the **Dreadclaw Assault**
  archetype (§5a). armory ✅(veh).
- **Miasmic Malignifier** — locked Nurgle, Infiltrator; **Unmanned** (can't capture/contest
  objectives); Pest explosion; Putrescent Fog (per-activation Stand&Shoot terrain marker, in-game).
  NO options, no armory.
- **Noctilith Crown** — Infiltrator; **Unmanned**; Unholy Conduit (friendly unit within 12" rolls 2D6,
  6+ = a Prayer effect, else Lashing warp energies) — links the Prayers cast system §6b; Warp
  explosion. NO mark, NO options, no armory.
- **Heldrake** — Anti-Grav / Fast / Hover mode / Vector strike; `mark` ✅; `one` **replace** Baleflamer
  → Hades autocannon +44 · ✅pts/❌drop. armory ✅(veh). vet_max 2.

**Notable for the engine:**
1. **ᵀ keyword used at the TRANSPORT layer** — Chaos Rhino "transport capacity 10 excluding models in
   Terminator armor". A real, non-armory use of the Terminator armour keyword → reinforces that a
   proper `Terminator` armour KEYWORD (not the ability-string hack, see ki-csm-tgate-01) pays off
   across transport rules too. Currently text-only ❌.
2. **AOP override** — Dreadclaw "Drop Pod Assault" forces reserve + deep strike regardless of mission
   (FAQ#5). Should bypass the normal reserves restriction in `validators.ts`. Verify enforced.
3. **`replace` drop-side** ❌ — Heldrake Baleflamer→Hades (same build-list gap).
4. **Unmanned / neutral Fortification** — both Forts can't score; Noctilith has no Chaos keyword so
   no marks/traits apply. Confirm the Trait keyword-gate (§5c) already excludes it.

### CSM ROSTER AUDIT COMPLETE (2026-06-03)
All 8 slots done in option-semantics mold: HQ §4d · Troops §4e · Elites §4f · Fast Attack §4g ·
Heavy Support §4h · DT+Fort+Flyers §4i. Total 62 units (8+8+22+9+9+2+2+1). **Next per linked scope:
Chaos Daemons (Daemonkin) + HH Space Marines supplement (Legion)** — see [[project-work-plan]].

## 5. Archetypes / Legacies / Traits (VALIDATED 2026-06-03)

**Selection limits:** 0-1 Archetype, 0-1 Legacy, 0-2 Traits. **If a Trait is taken, ALL
models/units in the army must be upgraded with it** (unless the trait states otherwise).

### 5a. Archetypes (0-1; move/expand AOP)
- **Abaddon's Chosen:** +3 HQ slots (5 total), must field ≥4 HQ each with a *different* Mark;
  Animosity of the Gods does not apply.
- **All is Dust** (Tzeentch mono): all units get + must take Mark of Tzeentch; access to Tzeentch
  Daemons; Rubric Marines as Troops; only already-Tzeentch models count to 25% Troops; Legionnaires
  banned; vehicles must upgrade combis to Inferno variants (+2 bolter / +4 warpflamer / +1 melta);
  **no Legacy or Traits.**
- **Ambition for Perfection** (Slaanesh mono): same mono-god pattern; Noise Marines as Troops;
  Legionnaires banned; **no Legacy or Traits.**
- **Blood for the Blood God!** (Khorne mono): same pattern; Khorne Berzerkers as Troops;
  Legionnaires banned; **no Legacy or Traits.**
- **Plaguehost** (Nurgle mono): same pattern; Plague Marines as Troops; Frag→Blight grenades free;
  vehicles must upgrade combis (+2/+4/+2, gain Poison); Legionnaires banned; **no Legacy or Traits.**
- **Daemonkin:** access to all Chaos Daemon units; may use the Daemonkin table for its god; ignores
  Summoning; ≥1 HQ from each codex (Daemons + CSM); all units same single Mark; all units must
  have/buy "Daemon"/"Greater Daemon"; CSM-vs-Daemon unit count may differ by at most +1; **no Legacy
  or Traits.**
- **Dreadclaw Assault:** all units start as passengers in Dreadclaw Drop Pods; half (round up)
  arrive battle round 1, the rest round 2.
- **Host Raptorial:** Raptors as Troops (only Raptors count to 25%); ≥half of Raptor models start
  in reserve even if mission forbids reserves.
- **Legion:** access to everything from the Horus Heresy Space Marines supplement; only HH Troops
  count to 25% Troops. NOTE: HH SM is a **shared supplement = injectable source** (own folder, own
  Index/Armory + 12 datasheets), NOT a faction. The archetype grants `source: HH`; engine injects
  that pool into the CSM army. Open = ordered catalog view, not a standalone army builder. Other
  factions' archetypes may unlock the same source. See [[project-hh-supplement-source]].
- **Legionnaire Warband:** Legionnaires as Troops; **all units must get ≥1 Veteran ability**; units
  that can't take a Veteran ability can't be selected; **Marks do NOT count as the Veteran ability**
  for this requirement (the archetype-only exception to the army-wide "Marks count as veteran" rule).
- **Sorcerer Circle:** 4 HQ total, only Chaos Sorcerers + Masters of Sorcery as HQ (Sorcerers gain
  "Command squad"); all set up within 12" of each other; Master of Sorcery within 12" of a Sorcerer
  shares its powers and gets +1 manifest/dispel.
- **Special Operations:** Cultists must pick two Veteran abilities, one of which must be
  "Infiltrator".
- **The Swift Blade:** Chaos Bikers as Troops; outflankers may deploy turn 1; all units <12" Move
  must start as transport passengers; units with no transport option and <12" Move can't be taken.

### 5b. Legacies (0-1; grant a legion armory)
- **Legacy of the Arch Traitor** → Word Bearers armory.
- **Legacy of the Hydra** → Alpha Legion armory. *Only units with no Mark or Mark of Undivided.*
- **Legacy of the Iron Lord** → Iron Warriors armory. *Only no-Mark / Undivided units.*
- **Legacy of the Night Haunter** → Night Lords armory. *Only no-Mark / Undivided units.*
- **Legacy of the Warmaster** → Black Legion armory.

### 5c. Traits (0-2; points per unit)
- **Keyword gate:** traits can only apply to models with the **`Chaos Space Marine` keyword.**
- **Cost columns:** `NORMAL` / `CHARACTER` / `MONSTROUS CREATURES & VEHICLES`. Paid **per unit**;
  if the cost is marked `*`, paid **per Wound or Hull point** in the unit.
- List (NORMAL / CHARACTER / MONSTROUS&VEH):
  - 10.000 Years of Horror (5/0/5) — ignore negative Ld mods. Creature units only.
  - Black Crusade (-/Special/-) — a single HQ model must get the Mark of each god.
  - Blood Feud (5/0/5) — +1 melee hit on charge/charged until end of round.
  - Desecration (5/0/-) — 5+ inv within 6" of objective; not vs S8+.
  - Fallen (5/0/5) — "They Shall Know No Fear". Creature units only.
  - Hatred Unleashed (5/0/5) — +1 to hit ranged vs nearest enemy.
  - Horrors of the Night (5/0/5) — +1 hit/+1 wound melee vs Battleshocked or outnumbered.
  - Iron Within, Iron Without (2*/0/5*) — 6+ inv (creatures) / vehicles repair 1 Engine or Weapon
    Damage each Rally. Only for creatures with no existing inv from datasheet/Armory. (`*` per W/HP.)
  - Laboratory Experiments (5/-/-) — "Berserk(5+)", +1 S, +1" Move; D6 per model each activation,
    each 1 = 1 Mortal Wound.
  - Malicious Volley (5/0/5) — "Deflagrate(5+)" with Bolt weapons.
  - Masters of Deception (3/0/3) — light cover until first activation.
  - Mixed Warband (-/-/-) — army must select a SECOND Legacy; each model picks items from one Legacy
    armory only. (See [[project-pending-csm-armory]].)
  - Profane Zeal (5/0/5) — "Blind Rage". Creature units only.
  - Siege Experts (5/0/5) — "Sunder(1)" for ranged.
  - Superior Battle Tactics (5/0/5) — reduce negative to-hit mods by 1.
  - Terror Tactics (5/0/5) — melee gains "Gruesome"; unit gains "Terrifying(-1)".
  - Warp Pirates (5/0/5) — "Frenzy(1\")".

## 6. Cast systems — Disciplines / Prayers / Pacts (VALIDATED 2026-06-03, disk read)

**THREE distinct cast systems, all sharing the Skirmish "max 1 cast per turn" cap (_engine.md §E):**
| System | Casters | Has Cast value? | Has Type? | Complexity values |
|---|---|---|---|---|
| **Psychic powers** (Disciplines of Chaos) | Psykers: Chaos Sorcerer, Daemon Prince (psyker upg.), Master of Sorcery | YES | YES (Augmentation/Witchfire/Malediction) | Basic / Normal / Complex |
| **Prayers** (Prayers to the Dark Gods) | Dark Apostle (faith) | NO | NO | Easy (all) |
| **Infernal Pacts** | Infernal Acolyte | NO | NO | Normal (all) |

Khorne ✗ Psyker still applies (§4d). Sorcerer knows Smite + ALL powers of ONE chosen discipline;
Daemon Prince knows Smite + 1 power of a chosen discipline (§4d power-picker note).

### 6a. Psychic Disciplines (6 disciplines)
**God-gating:** Change=Tzeentch only · Decay=Nurgle only · Excess=Slaanesh only ·
Dark Hereticus & Malefic = no god restriction · Cult Powers = Cult initiates only.

**Change (Tzeentch only)** — Type/Rng/Target/CV/Cmplx/Effect:
- Pyric Flux · Aug · 12" · Friendly unit · 5 · Basic · +2 Str for "Flames" weapons.
- Tzeentch's Firestorm · Witchfire · 18" · Enemy · 5 · Normal · 1D6/wound, 3+ = auto wound S4 DS0 D1 Seeking. Instant.
- Doombolt · Witchfire · 24" · Enemy · 6 · Normal · 1 auto hit S9 AP-3 D2; AT(3) Seeking Tank hunter. Instant.
- Glamour of Tzeentch · Aug · 12" · Friendly · 6 · Basic · gains "Deflect"+"Parry".
- Weaver of Fates · Aug · 18" · Friendly · 6 · Basic · re-roll 1s on inv saves.
- Temporal Manipulation · Aug · 12" · Friendly · 7 · Complex · heal a Mark-of-Tzeentch friendly (not self) 1D3 W, may revive (fully heal injured first); once/round/psyker. Instant.

**Dark Hereticus (general):**
- Diabolic Strength · Aug · 12" · Friendly model · 5 · Basic · +4 Str + "Decimate" melee.
- Warptime · Aug · 6" · Friendly unit · 5 · Basic · +6" Movement.
- Death Hex · Malediction · 18" · Enemy · 6 · Basic · attacks vs target gain cumulative Shieldbreaker(-1).
- Infernal Gaze · Witchfire · 18" · Enemy · 6 · Normal · 2D6, each 4+ = 1 MW. Instant.
- Prescience · Aug · 12" · Friendly · 6 · Basic · +1 to all hit rolls.
- Bastion of Chaos · Aug · 12" · Friendly (Creature) · 7 · Basic · attacks vs target -1 to wound.

**Decay (Nurgle only):**
- Gift of Contagion · Malediction · 18" · Enemy · 6 · Basic · -1 Toughness; "Poison(x+)" gains +1 to wound.
- Miasma of Pestilence · Aug · 18" · Friendly · 6 · Basic · enemy melee -1 Attacks (min 1).
- Decaying Touch · Malediction · 18" · Enemy · 7 · Basic · cumulative -1 Sv/AV.
- Plague Wind · Witchfire · 18" · Enemy · 7 · Normal · each model T-test or 1 MW. Immediately.
- Putrescent Vitality · Aug · 18" · Friendly · 6 · Basic · +2 Toughness.
- Nurgle's Dance · Aug · 12" · Friendly · 7 · Complex · heal a Mark-of-Nurgle friendly (not self) 1D3 W, revive; once/round/psyker.

**Excess (Slaanesh only):**
- Delightful Agonies · Aug · 12" · Friendly · 4 · Basic · gains "Warded".
- Pavane of Slaanesh · Witchfire · 18" · Enemy · 5 · Normal · 1D6/wound, 3+ = auto wound S4 DS0 D1 Seeking. Instant.
- Cacophonic Choir · Witchfire · 12" · Enemy (Creature) · 6 · Normal · 2D6 − target Ld = that many auto wounds S5 AP-6 D1 Seeking. Instant.
- Hysterical Frenzy · Aug · 12" · Friendly · 7 · Basic · +1 Attack/model + Precision(5+) melee. Instant.
- Siren · Malediction · 18" · Enemy · 7 · Basic · Ld test -1 or move 6" toward caster.
- Symphony of Pain · Malediction · 18" · Enemy · 7 · Basic · -1 WS and -1 Str.

**Malefic (general):**
- Cursed earth · Aug · — · Self + attached · 5 · Basic · gains "Aegis(4+)"+"Warded"; terrain within 6" is difficult+dangerous for enemies (even if normally ignored).
- Devour · Aug · 6" · Friendly model · 5 · Normal · target destroyed, caster +1 Str +1 W. Until end of game.
- Warp marked · Malediction · 24" · Enemy · 5 · Basic · friendly units +3" charge vs target.
- Infernal might · Aug · — · Self + attached · 6 · Basic · +2 Strength.
- Pact of flesh · Aug · 18" · Friendly (Creature) · 6 · Basic · regain 1 lost wound.
- Pact of steel · Aug · 18" · Friendly (Vehicle) · 7 · Basic · repair 1 permanent damage OR regain 1 Hull point.

**Cult Powers (Cult initiates only)** — 9 powers:
- Mutation: Warp Reality · Malediction · 24" · Enemy · 6 · Normal · Ld test -1 or 1 Battleshock token; treated as difficult+dangerous terrain.
- Prophecy: Divine the Future · Aug · — · — · 7 · Basic · roll 1D6, keep, use later instead of a roll; once/round/psyker. Until end of game.
- Time: Time Flux · Aug · 18" · Friendly · 7 · Complex · heal a friendly (not self) in range 2 W, revive; once/round/psyker. Instant.
- Scheming: Seeded Strategy · Aug · — · — · 7 · Complex · army +1 to Reinforcement & Initiative phase rolls; stacks. Instant.
- Magic: Astral Blast · Witchfire · 18" · Enemy · 7 · Normal · Creatures 1D6 auto wounds S10 AP-2 D1 Seeking; Vehicles 1D3 glancing hits AT(1). Instant.
- Knowledge: Empyric Trespass · Malediction · 18" · Enemy · 6 · Basic · caster + attached unit re-roll to-wound vs target.
- Change: Dysmanifestation · Malediction · 12" · Enemy · 7 · Basic · -1 Initiative, Attacks, Leadership (min 1 each).
- Duplicity: Sorcerous Facade · Aug · — · Self + attached · 8 · Complex · remove + redeploy anywhere ≥9" from any enemy; can't move afterwards. Instant.
- Manipulation: Attempted Possession · Malediction · 12" · Enemy · 7 · Normal · one enemy model (not Character) resolves its melee attacks against its own unit. Instant.

### 6b. Prayers to the Dark Gods (Dark Apostle) — Complexity Easy, no CV/Type
**Upper prayers (5):**
- Soultearer Portent · — · Self + Attached · melee weapons gain "Decimate".
- Unholy Blessing · — · Self + Attached · melee weapons gain additional -1 AP.
- Veil of Despair · 6" radius · Self · enemy models -2 Leadership.
- Illusory Supplication · — · Self + Attached · hit rolls of 1-3 against the unit always fail.
- Omen of Sacrifice · — · Self · caster suffers 1 wound; return one fallen model of attached unit. Instant.

**Lower prayers (5):**
- Heretical Visions · 18" · Friendly unit of Cultists · target is fearless.
- Will of the Chaos Gods · 12" · Friendly unit of <Cultists> · target gets all benefits of all marks of chaos.
- Warp Barrier · 18" · Self · enemy psykers re-roll successful psychic tests + suffer "Peril of the warp" on all doubles.
- Forsaken Resurrection · 12" · Friendly unit of <Cultists> · target regains 2D3 fallen models. Instant.
- Benediction of Darkness · 6" · Self + Attached · models count as in cover.
(All durations "until caster's next activation" except those marked Instant.)

### 6c. Infernal Pacts (Infernal Acolyte) — Complexity Normal, no CV/Type
- Bladed Maelstrom · 18" · Enemy · target gains 1 Battleshock token. Instant.
- Fires of the Abyss · 24" · Enemy · 4 auto hits S5 AP-2 D1 Seeking. Instant.
- Capering Imps · 18" · Enemy · target loses all benefits from cover. Until caster's next.
- Glimpse of Eternity · — · Friendly · target may re-roll any one die. Until caster's next.
- Malefic Maelstrom · 12" · Friendly · all ranged weapons +1 Strength. Until caster's next.
- Empyric Guidance · 12" · Friendly · re-roll to-hit rolls of 1. Until caster's next.

## 6d. FOUNDATION implementation gap-check (2026-06-03, vs actual engine code)
Per user request: separate from DATA validation (Plan B 1-5 = "is the digest right?"). This pass asks
**"is each foundation rule ENFORCED in the engine, or text-only / half-patched?"** — so when auditing
a unit we know which modifier rests on something real. ✅ implemented / 🟡 partial / ❌ text-only.
**Headline: far more is implemented than the digest implied.** Files cross-checked: `points.ts`,
`validators.ts`, `resolver-csm.ts`, `traits/csm.ts`, `traitEffects.ts`, `legacies/csm-legacies.ts`,
`archetypes.ts` + `archetypes/csm.ts`, `ArmoryModal.tsx`.

| Foundation system | Status | Where / note |
|---|---|---|
| **Point-adders (marks, options, armory, traits, variants)** | ✅ | `points.ts` sums variant upgrade, mark (locked or chosen), per-option `optionQty` (covers per_n/every/fixed_max counts), armory items, traits (incl. `perWound` × wounds × size), Black Crusade 4-mark, vehicle combi surcharge. |
| **Animosity / mark gating** | ✅ | `validators.ts` `allowedMarks()` (matrix lookup w/ compound-key prefix), validates chosen + locked marks vs HQ mark; forbidden even for allies; Undivided-only legacies enforced. |
| **AOP (slot min/max, multi-AOP, allies, advisor, Troops 25%)** | ✅ | `validators.ts` full: scaled mins/maxes, allied AOP table, advisor skirmish-only, Troops 25% with archetype remap/locked, Mechanised DT 50%. |
| **Archetypes** | ✅ | `archetypes/csm.ts` rules + `validators.ts` enforce banned units/slots, whitelist, requiresHqUnit, forcedMark, hqAllowed, vet requirements, slot remap (Troops unlocks), HQ-limit overrides, per-archetype specials (Abaddon, Daemonkin, Special Ops, Legionnaire Warband, Mechanised). |
| **Traits (all 17)** | ✅ | `traits/csm.ts` — every trait has structured effects (`stat_mod`/`inv_save`/`unit_ability`/`weapon_ability`) with `applies_to` filtering; per-wound cost; Black Crusade + Mixed Warband = army-level (validated separately). |
| **Marks (ability injection + Favored)** | ✅ | `resolver-csm.ts` injects per-unit-type mark bonuses (char/monster/vehicle/infantry), Favored (sacred-number squad size), Black Crusade 4-mark, Tzeentch-psyker. |
| **Legacies (grant legion armory + mark restriction)** | ✅ | `legacies/csm-legacies.ts` structured notes; `ArmoryModal.tsx` shows the legion tab only when a granting legacy is active; Mixed Warband per-unit single-armory lock enforced. |
| **Armory access (general / mark / legion / veteran / vehicle tabs)** | 🟡 | `ArmoryModal.tsx` fully wired and functional, BUT gates on the **OLD flag model** (`category:'veteran'|'vehicle'`, `term_compat` for Cataphractii) — NOT the target KEYWORDS-derived gating. This is the central pending architecture migration. See [[project-pipeline-migration]] / [[reference-canonical-rules]]. |
| **`single-slot` armour exclusivity / dynamic-armour keyword** | ✅ | v0.50: `Terminator armor`/`Cataphractii armor` carry `armourKeyword`; `equipMods` applies only the most-protective armour profile (no stacking) + validator flags 2 armours/model. v0.51: innate-armour override (bought armour treated as SWAP, no +1T/+1A double-count → ki-csm-armourslot-01 fixed) AND keyword-derived ᵀ-gating (`modelRestrictsToTermSubset` fires on innate `unit.armourKeyword` + dynamically-bought armour → ki-csm-tgate-01 fixed). (_engine.md §10.) |
| **Cast systems (Psychic / Prayers / Pacts)** | 🟡 | `PsychicModal.tsx` + `generalDisciplines.ts` let you VIEW/select powers, but NO rules enforcement: Skirmish "1 cast/turn" cap, per-unit power-count (Sorcerer all-of-discipline vs Prince 1), god-gating of Change/Decay/Excess are NOT validated. Display/selection only. |
| **`replace` drop-side / choice→stat linkage / 2nd-profile ratios** | ❌ | (Unit-option layer, see §4e + _engine.md §10 GAP SUMMARY.) |

**Net for unit audits going forward:** marks, traits, archetypes, animosity, AOP, points, legacy access
are all SOLID — when a unit references them I can assume enforcement. The real build-list is short:
(1) keyword-derived armory gating (replace category/term_compat flags), (2) `single-slot`/dynamic armour,
(3) structured `replace`, (4) cast-system rule enforcement, (5) 2nd-profile ratio caps.

## 7. Open questions / PENDING inputs from user
- **Mark armories**: Khorne / Nurgle / Slaanesh / Tzeentch = DONE (2026-06-03).
  **No Undivided armory exists** (user confirmed 2026-06-03).
- **Legion armories** (Iron Warriors, Word Bearers, Alpha Legion, Night Lords, Black Legion) = DONE
  (2026-06-03). See §1.
- **Unit → armour-type mapping**: ALL CSM SLOTS DONE (2026-06-03, §4d–§4i). Only 5 datasheets carry
  Terminator-class armour, all in Elites: **Cataphractii (4+inv)** = Blightlord / Deathshroud / Red
  Butcher (ᵀ-gated ✅); **Terminator / Crux Terminatus (5+inv)** = Chaos Terminators / Scarab Occult
  (ᵀ-gate **NOT** applied — bug ki-csm-tgate-01, §4f). **Obliterator RESOLVED**: its 2+ is a plain Sv,
  no inv/Terminator ability → not Terminator-keyword. All other 57 datasheets = standard (Power) or
  vehicle. ᵀ keyword also surfaces at the **transport layer** (Chaos Rhino excludes Terminator-armour
  passengers, §4i). REMAINS dynamic: models that BUY `Terminator armor` (general armory) or
  `Cataphractii armor` (Nurgle/HH) — both should ᵀ-gate (see §1); fix = keyword model, not string-match.
- **No `Power`/`Gravis` gate in CSM** — CONFIRMED across all 62 datasheets (2026-06-03): no unit gates
  wargear by Power or Gravis armour. Only ᵀ (Terminator/Cataphractii) gating exists in this faction.
- ~~**Animosity of the Gods** sheet~~ — DONE (2026-06-03, see §4b matrix).
- **Psychic powers / disciplines / prayers / pacts** — DONE 2026-06-03 (§6, all from disk).
- **General rules** ("reglas generales") — PENDING (user flagged I may have overlooked things).
- **Vehicle upgrade pricing**: confirm it's per Hull point (the verbatim note sits between VETERAN
  and VEHICLE sections; clarify which section the "per Wound/Hull point" note governs).
- ~~Confirm there is no `Cataphractii` gate~~ — RESOLVED: Cataphractii IS a gate (Nurgle armory).
- ~~Confirm no `Power`/`Gravis` gate anywhere in CSM~~ — RESOLVED 2026-06-03: none across 62 datasheets.
