# Rules-model digest — Adeptus Sororitas

> Built from scratch 2026-06-11, grounded in the **`.ods` (structured canon)** per the user's
> standing directive ("básate en el .ods"), with production JSON for rules-semantics. Sororitas was
> 🔴 (no prior digest). Prerequisite for its Fase 4 migration.

**Sources read** (2026-06-11):
- `Informacion/Adeptus Sororitas ENG.ods` (33 sheets: Index, Army Customisation, Armory, Order
  Armory, Acts of Faith, Hymns of Battle, + 27 unit datasheets) — STRUCTURED CANON
- `Informacion/Custom40k Core Rules.txt` + `Custom40k Missions.txt`
- `data/parsed/adeptus_sororitas/` production: `units.json` (27 units + `slot_to_units`),
  `armory/general.json` (35 equipment items), `armory/` Order legacy armories, `archetypes.json`
  (3 archetypes / 7 legacies / 12 traits)
- prior work: Witch hunters (Inquisition + Assassins access) already SHIPPED — see
  [[project_inquisition_audit]] (Fase A `intrinsic_allies` + universal Assassins access) and
  [[project_alien_hunters_fix]]; Holy Trinity legacy already fixed — see [[project_features_v021]]

---

## Faction: Adeptus Sororitas

### 1. Keyword vocabulary

- **Armour types: NONE keyword-gated.** Grepped all 27 units: `armourKeyword` populated on ZERO.
  Armour is a STAT-TIER Armory purchase (Plate armor 4+ / Power armor 3+ / Master-crafted armor
  2+, all "Not combinable with other armors") + invuln items (Praesidium Protectiva 4+inv, Storm
  shield Deflect/Parry). THIRD faction (after IG, AdMech) with a fully empty armour axis.
- **Marks / sub-factions: NONE.** No `locked_mark`; no Marks-of-Chaos archetype (unlike IG's
  Traitor Guard / AdMech's Dark Mechanicum — Sororitas have no Chaos-defection archetype).
- **Orders Militant** are a LEGACY axis, not a base keyword: the 6 Orders (Valorous Heart / Ebon
  Chalice / Argent Shroud / Our Martyred Lady / Bloody Rose / Sacred Rose) are unlocked by the 6
  matching Legacies (§5), each granting that Order's Armory (the "Order Armory" sheet). Production:
  the Order legacy armories under `armory/`.
- **Unit types** (production, 27 units): `Infantry` (9), `Character Model, Infantry` (6), `Vehicle`
  (4), `Monstrous Infantry` (3, Canoness in Paragon Warsuit / Paragon Warsuits / Penitent Engines),
  `Infantry, Jump Pack Infantry` (3, Geminae Superia / Seraphim / Zephyrim — STATIC jump type),
  `Character Model, Jump Pack Infantry` (1, Living Saint), `Character Model, Infantry, Squadron`
  (1, Crusaders). No parser artifacts.
- **Datasheet keywords[]: EMPTY.** All 27 units `keywords: []`. EIGHTH confirmation (CSM=6, all
  others incl. Sororitas=0) that a populated datasheet axis is the CSM-only exception.
- **Net:** like IG/AdMech, ALL FOUR axes empty. Wargear gating runs on prose ("Only for X" —
  Missionary/Palatines/infantry) + boolean flags (`is_vehicle`/`is_psyker`). NO veteran-ability
  tier at all (see §2/§3 — Sororitas, like Chaos Daemons, lack the veteran/Doctrina pricing tier).

### 2. Wargear gating

| Item / group | Gate mechanism | Notes |
|---|---|---|
| All general Armory weapons + equipment | NONE keyword-based | `has_armory_access` opens the tab; no `armour_compat`/`term_compat` anywhere |
| "Only for X" / "Only for infantry" prose | free-text match | Eviscerator, Plasma gun "Only for Missionary"; Holy weapon "Only for Palatines"; Dominion/Jump pack "Only for infantry" |
| Order Armory relics | "Order X" Legacy unlock | 6 Orders Militant, each gated by its matching Legacy (§5) |
| Vehicle Upgrades (9: Additional armor/Anointment/Blessed ammunition/Holy icon/Holy promethium/Hunter-killer missile/Improved targeting/Jammer/Smoke Launcher) | `is_vehicle` flag + `category: 'vehicle'` | **FIXED §6.1**: were `category: none`; now tagged (POINTS already in `p_unit`, no move) |
| Witch hunters (Inquisition + Assassins access) | army-wide rule | already SHIPPED (`intrinsic_allies`, [[project_inquisition_audit]]) |
| **NO Veteran Abilities / Doctrina tier** | — | Sororitas armory has no veteran section at all (0 `has_veteran_abilities` units) — like Chaos Daemons |

### 3. Points model

- **Standard equipment**: `p_unit` (per-model) / `p_char` (flat CHARACTER override) — Armory
  columns "POINTS" + "POINTS CHARACTER MODELS". Mirrors the cross-faction `getItemPts`.
- **Vehicle Upgrades**: single "POINTS" column, flat `p_unit × size`. Production already had the
  value in `p_unit` (like AdMech, unlike IG) — only `category` tagging needed.
- **Traits**: 3-column "NORMAL / CHARACTER / MC&V" with `*` = per Wound/Hull, per-unit army-wide.
- **NO veteran/per-Wound-or-Hull tier** — Sororitas sit on the Chaos-Daemons side of the inverse-
  pair [[project_space_marines_codex_migration]] identified (no Veteran-Ability pricing tier at
  all), unlike IG/AdMech/GK/SM/Inquisition which all have it.

### 4. Army rules / special rules

- **Acts of Faith** (signature mechanic, Index verbatim): "The unit may perform an Act of Faith.
  Each unit can use as many Acts of Faith per battle round as the army has Faith points, but can
  only benefit from one effect at a time..." A Faith-point economy. (Acts listed on the "Acts of
  Faith" sheet; Faith generated by Pious units + Anointment equipment + The Blood of Martyrs trait.)
- **Pious** (Index): "generates the specified number of Faith Points... once during the first Rally
  phase and again immediately when removed as a casualty."
- **Shield of Faith** (Index): "The model receives a 6+ invulnerability save." Army-wide.
- **Witch hunters** (Index): "The army has access to Inquisition units (Inquisitors must select
  'Ordo Hereticus'). The army has access to assassins." Already SHIPPED via `intrinsic_allies` +
  the universal Assassins-access mechanism ([[project_inquisition_audit]] — `ki-sororitas-
  inquisition-missing-01` fixed; Assassins Pass 5 unified scope). Documented here, no further work.
- **Hymns of Battle** (Hymns sheet): the Preacher/Dogmata litany system (NOT psychic — Sororitas
  have no psykers). The "Blessing" equipment grants +1 Hymn known.

### 5. Archetypes / Legacies / Traits

Budget: **0-1 Archetype, 0-1 Legacy, 0-2 Traits**. Production cross-check CLEAN: 3 archetypes /
7 legacies / 12 traits — matches the `.ods` exactly.

**3 Archetypes** (all AOP-shuffle, no cross-faction ally-matrix — Sororitas have none):
- Holy Vanguard (Dominions→Troops, must start embarked; only Dominions count to 25%).
- Penitent Crusade (Arco-flagellants/Repentia→Troops; 1 Penitent Engine unit per 10 Arco models;
  Battle Sisters/Novitiate→Elite).
- Shrine Wardens (Celestian Squad→Troops; Battle Sisters/Novitiate→Elite; no Arco/Repentia/
  Penitent Engines at all). **Updated 2026-06-28**: text used to name the now-removed "Celestia
  Sacresantis" — fixed to the unified Celestian Squad (see note below).

**2026-06-28 re-audit (.ods fully replaced by user)**: added new HQ "Dogmata on Throne of
Condemnation" (246pts Monstrous Infantry, has_armory_access). Unified Celestian Squad/Celestian
Insidiants/Celestian Sacresants into ONE datasheet (the old 3-unit split is gone) — every model
independently picks one of Excruciants/Insidiants/Praesidiants/Sacresancts for +1pt
(`constraint.type:'every'`), WS/BS bumped to 2+, size 4-9, full per-model Armory access. Fixed
Geminae Superia points (44→43) + added missing "Bound by Faith" ability (removed an erroneous
"Hit & Run" that wasn't in the .ods). Fixed Arco-flagellants T/I/Ld/points (4/4/8/13 →
3/3/7/21). Fixed "Concession" text on Arco-flagellants/Crusaders to include Missionary.
**Did NOT remove Triumphant Procession** despite its absence from the new .ods — Escalation
supplement explicitly grants Sororitas Lords of War access and reads this exact unit; flagged to
user instead of guessing. Below sections referencing the old 3-way Celestian split or
Insidiants/Sacresants as separate units are now stale history, kept for context.

**7 Legacies** — 6 = one Order Militant each (granting that Order's Armory): Blind Faith→Valorous
Heart / Cleansing Flames→Ebon Chalice / Faith Is Our Shield→Argent Shroud / Honour The Martyrs→Our
Martyred Lady / Tear Them Down→Bloody Rose / The Emperor's Judgement→Sacred Rose. The 7th, **The
Holy Trinity**, is structurally special: grants a 3rd Trait slot AND forces three specific traits
(Raging Fervour + Rites of Fire + Unshakeable Vengeance), all combined costing 10 pts per
non-character unit. Already fixed — [[project_features_v021]] (Holy Trinity fix + 4-marks-style
validation analogue).

**12 Traits** (3-column pricing): Combined Conviction (→"must select a 2nd Legacy") / Deeds, not
Words / Devout Fanaticism / Guided by the Emperor's Will / Holy Wrath / Raging Fervour / Rites of
Fire / Shield of Aversion / The Blood of Martyrs (+1 Faith Point on death) / The Emperor's
Judgement (5+ refunds a spent Faith Point) / Unbridled Valour / Unshakable Vengeance. (Note the
Faith-economy traits — Blood of Martyrs / Emperor's Judgement — tie into the Acts of Faith engine.)

### 6. Open questions / discrepancies found

1. **Vehicle Upgrades untagged — FIXED** (`ki-sororitas-vetvehcategory-01`): the 9 Vehicle Upgrades
   were `category: none`; tagged `category: 'vehicle'`. POINTS already in `p_unit` (like AdMech, no
   value-move). Duplicate names exist (Anointment + Blessed ammunition each appear as an equipment-
   section character version AND a vehicle-section version) — only the vehicle block (idx 26-34)
   was tagged, identified by array position.
2. **No Veteran-Ability tier — by design** (not a gap): Sororitas armory has no VETERAN ABILITIES /
   DOCTRINA section, and 0 units carry `has_veteran_abilities`. This is a genuine faction
   characteristic (shared with Chaos Daemons), NOT an unaudited omission — so no `category:'veteran'`
   work applies here, unlike IG/GK/AdMech.
3. **Roster cross-check**: production 27 units / 6 populated slots (HQ 5/Troops 2/Elites 11/Fast
   Attack 3/Heavy Support 4/Dedicated Transport 2; Fortifications 0, Flyers 0) — exact match to the
   Index sheet's 8-column table (Flyers + Fortifications columns empty). Clean, no drift.

### 7. "Lo demás" pass (2026-06-13)

1. **Index "Special rules"**: re-read raw `Index.html` — 4 verbatim entries (Acts of Faith, Pious,
   Shield of Faith, Witch hunters) all present in §4. No gaps.
2. **Psychic disciplines**: N/A — Sororitas have 0 psykers (`is_psyker: false` everywhere). No
   "psychic discipline" sheet in the `.ods`, as expected.
3. **Hymns of Battle (5 hymns) — NEW FIX v0.66**: §4 already documented the "Hymns of Battle" sheet
   but it was never wired into production. Three units carry "Faithful: ... Knows one/all Hymn(s)
   of Battle" (Missionary — knows ALL, recites 2/round; Dogmata and Preacher — knows ONE, recites
   1/round). Created `data/parsed/adeptus_sororitas/psychic/prayers.json` (identical 5 hymns to
   IG's, confirmed via `.ods`), wired into `src/data/loaders.ts` (`case 'adeptus_sororitas'`), and
   added `"is_priest": true` to all 3 units. The "knows one vs all" cap is NOT modelled anywhere in
   the engine (no faction enforces a prayer-selection limit — pre-existing simplification, out of
   scope, consistent with how IG/GK/SM/CSM Faithful units already work). New
   `ki-sororitas-hymns-unwired-01`, FIXED.

**Sororitas "lo demás" complete** — Index fully covered, no psychic axis (by design), Hymns of
Battle now wired. Build ✓, changelog v0.66, local NOT pushed.

### 8. Full field-by-field ODS audit (v0.95, 2026-06-20)

A deeper re-audit than §1-7 above, against a NEWER `.ods` than the one this digest was originally
built from (2026-06-11) — the `.ods` has since picked up a 12th Elite unit (Celestian Insidiants),
a Crusaders datasheet, and replaced Witch Hunters with a **Chamber Militant** archetype (see below).
Went per-unit, per-field (stats, points, min/max, weapon profiles, option groups, flags) across all
28 units + Armory/Order Armory/Army Customisation. **28 fixes** found, full list in `changelog.ts`
v0.95. By root cause:

1. **9 units had `has_armory_access: true` at the unit level when the .ods grants it to the
   Superior/champion only**: Celestian Sacresants, Celestian Insidiants, Celestian Squad, Paragon
   Warsuits, Repentia Squad, Seraphim Squad, Zephyrim Squad — same cross-faction pattern as AdMech/
   Inquisition/Dark Eldar this week.
2. **4 vehicles had `has_armory_access: false` despite the .ods granting vehicle-equipment Armory
   access**: Castigator, Exorcist, Immolator, Rhino.
3. **4 units missing the `advisor` flag** despite carrying the literal "Advisor: For every HQ
   selection, one X may be selected without taking up an Elite slot" text: Dialogus, Dogmata,
   Hospitaller, Imagifier.
4. **Crusaders — 5 separate bugs on one datasheet**: WS 3+→2+, W 1→2, points 23→44 (min_cost
   40→44), `unit_type` had spurious "Character Model"/"Squadron" appended (.ods says plain
   "Infantry"; kept "Squadron" in ability text only, matching the AdMech Onager Dunecrawler
   convention of NOT mirroring ability-only special-rule names into `unit_type`), ability text
   missing "Squadron", and `has_armory_access`/`champion_has_armory` both wrongly true (the .ods
   grants no Armory access to this unit at all).
5. **Geminae Superia — 3 bugs**: squad size was min:2/max:4 instead of the .ods's fixed 2 (the "No."
   column was a literal "2", not a range); the option header had a spurious "or Palatine selection"
   clause not present anywhere in the .ods; abilities text was missing "Bodyguard, Command Squad".
6. **Living Saint missing the "Resurrection" ability** — present in the .ods as its own named
   mechanic (Name/When/Cost/Effect/Duration table, same format the Acts of Faith sheet uses) but
   never transcribed into the unit's `abilities[]`.
7. **Quantity-prefixed choice names breaking weapon gating** (same bug class independently found in
   Necrons and AdMech this week): Seraphim Squad's "2 Hand flamers"/"2 Inferno pistols" — renamed to
   the exact singular weapon names + added `replaces: ["Bolt pistol"]`.
8. **12 units missing `replaces`** on functional weapon-swap groups: Canoness in Paragon Warsuit,
   Battle Sisters Squad, Sisters Novitiate, Celestian Sacresants, Celestian Insidiants, Celestian
   Squad, Paragon Warsuits, Castigator, Penitent Engines (one of its two groups — see open question
   below), Retributor Squad, Dominion Squad, Immolator.
9. **Multi-profile weapon caught wrong in `replaces`**: Celestian Insidiants' Condemnor bolt pistol
   swaps needed both `"Condemnor Bolt pistol - Bolt"` and `"Condemnor Bolt pistol - Stake"` listed
   (exact-match, not prefix-stripped) — same rule confirmed for AdMech's Sydonian Dragoons this week.

**Open question — NOT fixed**: Penitent Engines' "Each model may swap both Penitent flails" group
has two choices: "Penitent buzz-blade and Penitent flail" (keeps one flail) and "2 Penitent
buzz-blades" (fully swaps both). The second choice has the quantity-prefix naming bug, but renaming
it to exactly "Penitent buzz-blade" would make the weapon-table gating treat the FIRST choice's grant
of one buzz-blade as invisible (only the renamed second choice would register as an "owning choice"
in `optionalWeapons`). Left both names as-is (the .ods's literal text) rather than risk hiding a
weapon for players who pick the first option — a genuinely ambiguous case the simple exact-name
gating model doesn't handle when one choice's grant is a SUBSET combo of another's name.

**Digest itself was stale on two points, now corrected by this note**: the faction has had a 4th
Archetype (**Chamber Militant** — grants Codex: Assassins + Codex: Inquisition access, replacing the
old "Witch hunters" mechanic) since a 2026-06-14 `.ods` update; §4's "Witch hunters... already
SHIPPED" entry and §5's "3 Archetypes" count are both outdated. The ENGINE code (`special-
abilities.ts`, `archetypes.json`) was already current with this change — only this digest lagged.
Production cross-check against the CURRENT .ods: 4 Archetypes / 7 Legacies / 12 Traits — all match
exactly, including the newer Chamber Militant archetype and all 3-column trait pricing.

**New Known Issue logged**: `ki-sororitas-crusaders-veteranability-unmodelled-01` — Crusaders' "may
gain one Veteran ability" option has no Veteran Abilities armory section anywhere in the faction's
Armory to draw from (confirmed via a full re-read: only WEAPON/EQUIPMENT/VEHICLE UPGRADES sections
exist, no veteran section) — left `has_veteran_abilities: false` rather than open an empty tab.

**Verified clean**: Magos-equivalent units (Missionary, Palatine, Preacher, Arco-flagellants),
Triumphant Procession (sourced from `Informacion/Escalation.ods`, not the main Sororitas sheet —
matches exactly), Hymns of Battle (5 hymns, already wired since v0.66), the entire general Armory
(already correctly `category:'vehicle'`-tagged from a prior pass).

Build ✓. **LOCAL NOT PUSHED at time of writing** (no live preview verification this session per the
user's 2026-06-20 instruction to stop using the preview server — see
[[feedback_no_preview_server]]).
