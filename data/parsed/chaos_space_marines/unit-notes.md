# chaos_space_marines - notes kept from the unit files

These were the header comments of the old .ts unit files. The unit files are pure JSON now, which cannot carry a comment.

## dedicated_transport/chaos_rhino.json

CHAOS RHINO — Dedicated Transport

SOURCE: Chaos Space Marines ENG / Chaos Rhino.html (canonical datasheet)
───────────────────────────────────────────────────────────────────────────

PROFILE:
  No.  NAME         M    WS  BS  S  FRONT  SIDE  REAR  I  A  HP  PTS
  1    Chaos Rhino  12"   -  3+  5    11    11    10   4  1   2  111

EQUIPPED WITH: A Rhino is equipped with: Combi bolter.

WEAPONS:
  Combi-bolter            24"  Rapid Fire 2  S4  AP-1  D1  -
  Combi-flamer - Bolter   24"  Rapid Fire 1  S4  AP-1  D1  -
  Combi-flamer - Flamer    9"  Assault 4     S4  AP 0  D1  Flames
  Combi-melta - Bolter    24"  Rapid Fire 1  S4  AP-1  D1  -
  Combi-melta - Melta     12"  Assault 1     S8  AP-5  D1  AT(1), Melta
  Havoc launcher          48"  Heavy 1       S5  AP-1  D1  Anti-Air, Explosive

OPTIONS:
  • May receive a Mark of Chaos: Khorne/Nurgle/Slaanesh/Tzeentch +10 points (each)
  • May be equipped with one of the following: Combi-flamer +8 / Combi-bolter +11 /
    Combi-melta +18
  • May be equipped with a Havoc launcher for +29pts
  • May have up to 2 veteran abilities
  • Has access to vehicle equipment from the Armory

ABILITIES (verbatim):
  Fire hatches(2)
  Transport: This model has a transport capacity of 10 infantry models, excluding
  models in Terminator armor.

UNIT TYPE: Vehicle
KEYWORDS: Chaos Space Marine

ENGINE STATUS:
  ✓ stats, pts, weapons, options, abilities all match HTML verbatim (combi-weapon
    sub-profiles correctly split into separate "<weapon> - <profile>" entries, same
    convention as Land Raider/Predator/Defiler)
  ✓ option_groups: "mark" (flat unit-level pick, +10pts uniform per god) / "one"
    additive combi-weapon pick (+8/+11/+18) / "one" inline_pts:29 Havoc launcher add
  ✓ has_veteran_abilities: true / veteran_max: 2
  🔴 has_armory_access: false — CORRECTED 2026-06-07 (was true). Verbatim text reads "Has access
    to vehicle equipment from the Armory" — a DISTINCT, narrower grant than "weapons and gear
    from the Armory" (the phrase used on CSM characters like Sorcerer/Dark Apostle). "Vehicle
    equipment" = the Vehicle Upgrades list ONLY, already shown automatically via is_vehicle +
    category:'vehicle' items (UnitCard.tsx hasFactionVehicleItems — independent of this flag);
    it does NOT grant the general armory (Daemon weapon/Daemonic armor/Familiar/etc.). The old
    `true` value wrongly opened that general armory tab. (This session's earlier SOURCE-pass
    note "vehicle equipment only" assumed the flag itself was vehicle-scoped — it isn't; fixed
    after cross-referencing engine code + verbatim text comparison across all CSM vehicles.)
  ✓ keywords: ["Chaos Space Marine", "Vehicle"] — "Vehicle" appended to the source's
    single "Chaos Space Marine" keyword, consistent with the vehicle-keyword convention
  ✓ is_vehicle: true / unit_type: "Vehicle" / default_size: 1 / min_cost: 111
  🟡 Transport(10)/Fire hatches text-only — no transport-capacity primitive on the
    engine side (same gap class noted on Land Raider; consistent treatment, not a
    unique bug here)
  (Fixed mojibake in the old header comment: "â€”" → "—", encoding artefact from migration)

## dedicated_transport/dreadclaw_drop_pod.json

DREADCLAW DROP POD — Dedicated Transport

SOURCE: Chaos Space Marines ENG / Dreadclaw Drop Pod.html (canonical datasheet)
───────────────────────────────────────────────────────────────────────────

PROFILE:
  No.  NAME                M    WS  BS  S  FRONT  SIDE  REAR  I  A  HP  PTS
  1    Dreadclaw Drop Pod  12"  4+  4+  5    11    11    11   4  4   2  154

EQUIPPED WITH: A Dreadclaw Drop Pod is equipped with: Blade struts; Thermal jets.

WEAPONS:
  Blade struts   -   Melee     SU  AP-2  D1  -
  Thermal jets  9"  Assault 4  S6  AP-2  D1  Flames

OPTIONS:
  • May receive a Mark of Chaos: Khorne/Nurgle/Slaanesh/Tzeentch +10 points (each)
  • May have up to 2 veteran abilities
  • Has access to vehicle equipment from the Armory

ABILITIES (verbatim):
  Anti-Grav, Deep strike
  Control Jets: The Drop Pod must land at least 6" away from other units (friendly
  or enemy) and can never stray closer than 1" to another unit, terrain, or the edge
  of the field. Reduce the deviation only enough to place the Drop Pod.
  Drop Pod Assault: Drop Pods always start the game as reserves and are always set
  up via Deep strike. Even if the played mission does not allow reinforcements
  and/or Deep strike!
  Transport: This model has a transport capacity of 10 models or 1 Helbrute.

UNIT TYPE: Vehicle
KEYWORDS: Chaos Space Marine

ENGINE STATUS:
  ✓ stats, pts, weapons, options, abilities all match HTML verbatim
  ✓ option_groups: "mark" (flat unit-level pick, +10pts uniform per god — no weapon
    swap groups; this datasheet has none)
  ✓ has_veteran_abilities: true / veteran_max: 2
  🔴 has_armory_access: false — CORRECTED 2026-06-07 (was true). Verbatim text reads "Has access
    to vehicle equipment from the Armory" — a DISTINCT, narrower grant than "weapons and gear
    from the Armory" (the phrase used on CSM characters like Sorcerer/Dark Apostle). "Vehicle
    equipment" = the Vehicle Upgrades list ONLY, already shown automatically via is_vehicle +
    category:'vehicle' items (UnitCard.tsx hasFactionVehicleItems — independent of this flag);
    it does NOT grant the general armory (Daemon weapon/Daemonic armor/Familiar/etc.). The old
    `true` value wrongly opened that general armory tab. (This session's earlier SOURCE-pass
    note "vehicle equipment only" assumed the flag itself was vehicle-scoped — it isn't; fixed
    after cross-referencing engine code + verbatim text comparison across all CSM vehicles.)
  ✓ keywords: ["Chaos Space Marine", "Vehicle"] — "Vehicle" appended to the source's
    single "Chaos Space Marine" keyword, consistent with the vehicle-keyword convention
  ✓ is_vehicle: true / unit_type: "Vehicle" / default_size: 1 / min_cost: 154
  🟡 Anti-Grav/Control Jets/Drop Pod Assault/Transport(10 or 1 Helbrute) all text-only
    — no deep-strike-restriction or transport-capacity primitives on the engine side
    (same gap class as Land Raider/Chaos Rhino; consistent treatment)
  (Fixed mojibake in the old header comment: "â€”" → "—", encoding artefact from migration)

## elites/big_mutants.json

BIG MUTANTS — Elites

SOURCE: Chaos Space Marines ENG / Big Mutants.html (canonical datasheet)
─────────────────────────────────────────────────────────────────────────

PROFILE:
  No.   NAME         M    WS  BS  S  T  W  I  A  LD  SV  PTS
  3-10  Big Mutant   6”   3+  5+  6  4  3  3  3   6  5+   26
  0-1   Boss Mutant  6”   3+  5+  6  4  3  3  3   7  5+   36
  (Boss Mutant is an optional upgrade: +10 pts, gains armory access)

EQUIPPED WITH: Every model is equipped with: Big crude melee weapon.

WEAPONS:
  Big crude melee weapon  —    Melee        U   AP-1  D1  —
  Machine gun             24”  Rapid Fire 1  3   AP0   D1  —         [+1 pt/model]
  Flamer                   9”  Assault 4     4   AP0   D1  Flames    [+8 pts, max 2]
  Heavy machine gun        36” Heavy 3       4   AP0   D1  Suppression [+8 pts, max 2]

OPTIONS:
  • Entire unit may receive: Bloated +11 pts/model (gains 4+ armor save)
  • Any model may be equipped with: Machine gun +1
  • Up to two models may be equipped with: Flamer+8 / Heavy machine gun+8
  • One Big Mutant may be upgraded to Boss Mutant +10 (armory access)

ABILITIES (verbatim):
  Bloated: The model gains a 4+ armor save.

UNIT TYPE: Monstrous Infantry
KEYWORDS: Cultist

ENGINE STATUS:
  ✓ stats, pts match HTML exactly
  ✓ all weapons match HTML exactly
  ✓ Bloated: effect stat_mod SV delta:-1 (5+→4+) ✓
  ✓ Boss Mutant in variant_models / champion_has_armory: true ✓
  ✓ unit_type: “Monstrous Infantry” ✓
  ✓ keywords: [“Cultist”] (no “Chaos Space Marine”) ✓
  ✓ has_veteran_abilities: false / veteran_max: null ✓
  ✓ locked_mark: null (no mark restriction) ✓
  ✓ default_size: 3 / min_cost: 78 (3×26 = 78) ✓

## elites/blightlord_terminators.json

BLIGHTLORD TERMINATORS — Elites

SOURCE: Chaos Space Marines ENG / Blightlord Terminators.html (canonical datasheet)
──────────────────────────────────────────────────────────────────────────────────────

PROFILE:
  No.   NAME                  M    WS  BS  S  T  W  I  A  LD  SV  PTS
  4-13  Terminator            6"   3+  3+  4  6  3  4  3   8  2+  109
  1     Terminator Champion   6"   3+  3+  4  6  3  4  3   8  2+  114

EQUIPPED WITH: Every model is equipped with: Balesword; Combi-bolter.

OPTIONS:
  • Every Terminator may swap their Combi-bolter (points per model):
    - Combi-flamer +0 / Combi-melta +6 / Combi-plasma +10
  • Every Terminator may swap their Balesword (points per model):
    - Bubonic axe +0 / Power fist +8
  • For every 5 models, two Terminators may swap their Combi-flamers (points per model):
    - Plague spewer +5 / Reaper autocannon +19 / Blight launcher +34
  • For every 5 models, two Terminators may swap their Combi-flamers and Baleswords (points per model):
    - Heavy plague weapon -6
  • The Terminator Champion has access to weapons and gear from the Armory.
  • The unit can gain a Veteran ability.

ABILITIES (verbatim):
  Deep strike, Mark of Nurgle, Massive(1), Unyielding
  Cataphractii armor: The model has a 4+ ward save.

UNIT TYPE: Infantry
KEYWORDS: Death Guard

ARMOUR KEYWORD: Cataphractii — triggers ᵀ-gate (only ᵀ armory items allowed).
  SOURCE (Armory.html): "Models wearing Cataphractii or Terminator armor can only
  receive equipment with ᵀ." → armourKeyword: "Cataphractii" ✅

ENGINE STATUS:
  ✓ armourKeyword: "Cataphractii" → ᵀ-gate enforced via modelRestrictsToTermSubset()
  ✓ locked_mark: "Nurgle" → no mark selector shown
  ✓ veteran_max: 1 → only 1 veteran ability
  ✓ champion_has_armory: true → Terminator Champion gets armory access
  ✓ per_n:5/count_per_n:2 for heavy-weapon swaps (options 3 & 4)
  ❌ options 3 & 4 are conditional on having chosen Combi-flamer in option 1 — cross-option
     available_if not modeled (same gap as Noise Marines / Rubric Marines)
  ❌ replace drop-side: options name the dropped weapon in the header text only

## elites/chaos_terminators.json

CHAOS TERMINATORS — Elites

SOURCE: Chaos Space Marines ENG / Chaos Terminators.html (canonical datasheet)
──────────────────────────────────────────────────────────────────────────────

PROFILE:
  No.  NAME                M    WS  BS  S  T  W  I  A  LD  SV  PTS
  4-9  Chaos Terminator    6"   3+  3+  4  5  2  4  3   8  2+   68
  1    Terminator Champion 6"   3+  3+  4  5  2  4  3   8  2+   73

EQUIPPED WITH: Each model is equipped with: Combi-Bolter; Power sword.

OPTIONS:
  • All models may receive a Mark of Chaos (pts per model):
    Khorne +2 / Slaanesh +2 / Nurgle +2 / Tzeentch +5  (NO Undivided option)
  • Every Chaos Terminator may swap their Combi-bolter with:
    Combi-flamer +0 / Combi-melta +5 / Combi-plasma +10
  • Every Chaos Terminator may swap their Power sword with:
    Power axe +0 / Power maul +0 / Lightning claw +1 / Power fist +9 / Chainfist +17
  • Every Chaos Terminator may swap their Combi-bolter and Power sword with:
    Pair of lightning claws -13
  • For each 5 models, two Terminators may swap their Combi-bolters with:
    Heavy flamer +2 / Reaper autocannon +20
  • The Terminator Champion has access to weapons and gear from the Armory.
  • May have up to 2 veteran abilities.

ABILITIES (verbatim):
  Deep strike, Massive(1), Unyielding
  Crux Terminatus: This unit has a 5+ ward save.

UNIT TYPE: Infantry
KEYWORDS: Chaos Space Marine

ARMOUR KEYWORD: Terminator — triggers ᵀ-gate (Crux Terminatus = 5+ inv).
  SOURCE (Armory.html): "Models wearing Cataphractii or Terminator armor can only
  receive equipment with ᵀ." → armourKeyword: "Terminator" ✅

NOTE — Combi sub-profiles: each Combi-* weapon is a combined weapon with two
  firing modes listed separately on the datasheet. Plasma Overcharged is
  "Overheat" on this sheet (not "Overheating" as on the Blightlord sheet —
  each datasheet is canonical for itself per FAQ #5).

ENGINE STATUS:
  ✓ armourKeyword: "Terminator" → ᵀ-gate enforced via modelRestrictsToTermSubset()
  ✓ Mark pricing: no Undivided option (choices[] has only 4 gods)
  ✓ veteran_max: 2
  ✓ champion_has_armory: true
  ✓ per_n:5/count_per_n:2 heavy-weapon swap
  ❌ replace drop-side: Combi swaps / lightning-claw dual swap — dropped weapons in header only
  ❌ cross-option mutual-exclusion: Combi swap (opt 2) and pair-of-claws (opt 4) both affect
     Combi-bolter — a model that took opt 4 can't also take opt 2, not enforced

## elites/chosen.json

CHOSEN — Elites

SOURCE: Chaos Space Marines ENG / Chosen.html (canonical datasheet)
─────────────────────────────────────────────────────────────────────────

PROFILE:
  No.   NAME    M    WS  BS  S  T  W  I  A  LD  SV  PTS
  1-10  Chosen  6”   2+  2+  4  4  2  4  2   8  3+   35
  (all models same stats; no champion model)

EQUIPPED WITH: A Chosen is equipped with: Krak grenades; Frag grenades.

WEAPONS:
  Frag grenade  6”  Grenade 1  4  AP0   D1  Explosive
  Krak grenade  6”  Grenade 1  6  AP-2  D1  —
  (all other weapons via armory)

OPTIONS:
  • For every HQ selection, army may include one Chosen unit (Command squad rule)
  • All models may receive a Mark of Chaos (per model):
    Undivided+0 / K+2 / S+2 / N+2 / T+5
  • Entire squad may receive ONE of the following upgrades (per model):
    Dark Crusaders+2 / Accursed Weaponry+3 / Monstrous Visages+3 /
    Malicious Ammuniton+5 / Tip of the Spear+5 / Clad in Midnight+10
    (NOTE: HTML typo “Malicious Ammuniton” — missing 'i'; preserved as-is in TS)
  • All models have armory access; up to 2 veteran abilities

ABILITIES (verbatim):
  Command squad
  Accursed Weaponry: gains “Deflagrate(5+)” for all melee attacks.
  Clad in Midnight: gains “Stealth”.
  Dark Crusaders: unit gains “Frenzy(1”)” and rolls 2D6 (pick highest) for Advance.
    (NOTE: HTML shows “Frenzy(1”)” with spurious closing quote — ability name is Frenzy(1”))
  Malicious Ammuniton: gains “Deflagrate(5+)” for all ranged attacks.
  Monstrous Visages: gains “Parry” + “Gruesome” for all melee weapons.
  Tip of the Spear: when Infiltrating, can always place outside 12” even with LoS.

UNIT TYPE: Command Squad, Infantry, Squadron  (.ods canonical; HTML had “character model” — wrong)
KEYWORDS: Chaos Space Marine

ENGINE STATUS:
  ✓ stats, pts match HTML exactly
  ✓ squad upgrades: effect.grants_abilities for Dark Crusaders / Monstrous Visages /
    Clad in Midnight ✓
  ✓ has_armory_access: true (all models) ✓
  ✓ has_veteran_abilities: true / veteran_max: 2 ✓
  ✓ is_squadron: true / is_character: true ✓
  ✓ locked_mark: null (has Undivided option) ✓
  ✓ default_size: 1 / min_cost: 35 ✓

## elites/cultist_firebrand.json

CULTIST FIREBRAND — Elites

SOURCE: Chaos Space Marines ENG / Cultist Firebrand.html (canonical datasheet)
─────────────────────────────────────────────────────────────────────────────

PROFILE:
  No.  NAME               M    WS  BS  S  T  W  I  A  LD  SV  PTS
  1    Cultist Firebrand  6"   4+  4+  3  3  2  3  1   7  5+   39

EQUIPPED WITH: A Cultist Firebrand is equipped with: Baleflamer; Frag grenades.

WEAPONS:
  Baleflamer     12"  Assault 4  S6  AP-2  D1  Flames
  Frag grenade    6"  Grenade 1  S4  AP 0  D1  Explosive

OPTIONS:
  • May receive a Mark of Chaos:
    Undivided +0 / Khorne +8 / Slaanesh +8 / Nurgle +20 / Tzeentch +15
  • Slot-exempt rule: "For each Cultists unit, one Cultist Firebrand unit may
    be selected that does not occupy an Elite slot."
  • Has access to weapons and gear from the Armory.

ABILITIES (verbatim): — (none listed on datasheet)

UNIT TYPE: Character model, Infantry
KEYWORDS: Cultist

ENGINE STATUS:
  ✓ stats, pts, weapons all match HTML exactly
  ✓ mark options: Undivided+0 / K+8 / S+8 / N+20 / T+15
  ✓ has_armory_access: true (single-model character — whole unit has armory)
  ✓ champion_has_armory: false (correct — no separate champion model)
  ✓ is_character: true
  ✓ slot-exempt rule as text-only option_group (constraint:"one", choices:[])
  ✓ abilities: [] — HTML shows "-"
  ✓ no armourKeyword (no Terminator/Cataphractii armour)

## elites/dark_commune.json

DARK COMMUNE — Elites

SOURCE: Chaos Space Marines ENG / Dark Commune.html (canonical datasheet)
─────────────────────────────────────────────────────────────────────────

PROFILE (4-model warband, all required):
  No.  NAME              M    WS  BS   S  T  W  I  A  LD  SV  PTS
  1-2  Dark Executioner  6”   4+  —    4  3  1  3  2   6  4+   13
  1    Cult Demagogue    6”   4+  4+   3  3  1  3  1   6  4+   42
  1    Mindsorcerer      6”   4+  4+   3  3  1  3  1   6  4+   20
  1    Cult Bannerbearer 6”   4+  4+   3  3  1  3  1   7  4+   15

EQUIPPED WITH:
  Every Dark Executioner: Executioners blade; Frag grenades.
  Cult Demagogue: Unholy stave; Laspistol; Frag grenade.
  Mindsorcerer: Witchcane; Balefire tome; Frag grenades.
  Cult Bannerbearer: Laspistol; Frag grenades.
  (HTML uses “Cult Standardbearer” in equipment section — TS correctly uses “Cult Bannerbearer”
   from the stats table)

WEAPONS:
  Executioners blade   —    Melee      +2  AP2   D1  Slow(-1)
  Unholy stave         —    Melee      +2  AP1   D1  —
  Laspistol            12”  Pistol 1    3  AP0   D1  —
  Witchcane - Sinister bolt  12”  Assault 1  5  AP-1  D1  —
  Witchcane - Melee    —    Melee      +2  AP-1  D1  Force weapon
  Frag grenade          6”  Grenade 1   4  AP0   D1  Explosive
  (NOTE: Executioners blade AP=”2” and Unholy stave AP=”1” match HTML exactly —
   no minus sign in source; values preserved as-is)

OPTIONS:
  • All models may receive a Mark of Chaos (per model): K+1 / S+1 / N+1 / T+2
    (NO Undivided option)

ABILITIES (verbatim):
  Faithful: A Cult Demagogue may pray once per turn (3+). Knows all prayers from a chosen list.
  Chaos banner: Cultists within 6” use the Ld of the bearer.
  Command squad: For every HQ choice you may buy one Dark Commune which doesn't take an Elite slot.

UNIT TYPE: Infantry
KEYWORDS: Cultist, Psyker

ENGINE STATUS:
  ✓ stats, pts match HTML exactly (4 models, mandatory warband composition)
  ✓ all weapons match HTML (AP values “2” and “1” without minus preserved from source)
  ✓ marks: K/S/N/T only — no Undivided ✓
  ✓ is_psyker: true (Mindsorcerer), is_priest: true (Cult Demagogue) ✓
  ✓ is_cult_initiate: true ✓
  ✓ has_armory_access: false / champion_has_armory: false ✓
  ✓ has_veteran_abilities: false / veteran_max: null ✓
  ✓ default_size: 4 / min_cost: 90 (13+42+20+15 = 90) ✓

## elites/deathshroud_terminators.json

DEATHSHROUD TERMINATORS — Elites

SOURCE: Chaos Space Marines ENG / Deathshroud Terminators.html (canonical datasheet)
──────────────────────────────────────────────────────────────────────────────────────

PROFILE:
  No.  NAME                            M    WS  BS  S  T  W  I  A  LD  SV  PTS
  2-6  Deathshroud Terminator          6"   2+  3+  4  6  3  4  3   9  2+  117
  1    Deathshroud Terminator Champion  6"   2+  3+  4  6  3  4  3   9  2+  122

EQUIPPED WITH: Every model is equipped with: Manreaper; Plaguespurt gauntlet.

WEAPONS:
  Manreaper * (choose one profile):
    Cleave  —  Melee  S+3  AP-3  D2  AT(1), Poison(4+), Slow(-1), Unwieldy
    Scythe  —  Melee  S+1  AP-3  D1  Poison(4+), Flurry(1), Unwieldy
  Plaguespurt gauntlet  6"  Pistol 4  S4  AP0  D1  Flames, Poison(4+)

OPTIONS:
  • The Terminator Champion has access to weapons and gear from the Armory.
  • The unit can gain a Veteran ability.

ABILITIES (verbatim):
  Bodyguard, Deepstrike, Mark of Nurgle, Massive(1), Unyielding
  Cataphractii armor: The model has a 4+ ward save.
  Eyes of Mortarion: Attached HQ models gain +1 attack in melee.

UNIT TYPE: Infantry
KEYWORDS: Death Guard

ARMOUR KEYWORD: Cataphractii — triggers ᵀ-gate (only ᵀ armory items allowed).
  SOURCE (Armory.html): "Models wearing Cataphractii or Terminator armor can only
  receive equipment with ᵀ." → armourKeyword: "Cataphractii" ✅

ENGINE STATUS:
  ✓ armourKeyword: "Cataphractii" → ᵀ-gate enforced
  ✓ locked_mark: "Nurgle" → no mark selector shown
  ✓ veteran_max: 1 → only 1 veteran ability
  ✓ champion_has_armory: true → Terminator Champion gets armory access
  ✓ Manreaper dual-profile (Cleave/Scythe) correctly encoded as separate weapon entries
  ✓ no option_groups needed — champion armory + vet ability encoded as flags
  ✓ default_size: 3 / min_cost: 356 (2×117 + 1×122 = 356) ✓

## elites/eightbound.json

EIGHTBOUND — Elites

SOURCE: Chaos Space Marines ENG / Eightbound.html (canonical datasheet)
─────────────────────────────────────────────────────────────────────────

PROFILE:
  No.  NAME                M    WS  BS  S  T  W  I  A  LD  SV  PTS
  2-7  Eightbound          6”   3+  3+  6  5  2  4  4   8  3+   52
  1    Eightbound Champion 6”   3+  3+  6  5  2  4  4   8  3+   52
  (Champion same points as regular model)

EQUIPPED WITH: Every model is equipped with: Eviscerating blades.

WEAPONS:
  Eviscerating blade  —  Melee  U   AP-3  D1  Shred
  Heavy chainglaive   —  Melee  +2  AP-2  D2  AT(1), Quick(1), Shred, Unwieldy

OPTIONS:
  • Eightbound Champion may swap Eviscerating blade → Heavy chainglaive +6
  • All models (incl. Champion) may upgrade to Exalted Eightbound +20:
    gains +1 W and “Daemon” ability

ABILITIES (verbatim):
  Berserk(5+), Blind Rage, Massive(1), Mark of Khorne
  Exalted Eightbound: The model gains +1 Wound and the “Daemon” ability.

UNIT TYPE: Infantry
KEYWORDS: World Eaters

ENGINE STATUS:
  ✓ stats, pts match HTML exactly (Champion same pts as regular ✓)
  ✓ Exalted upgrade: effect stat_mod W+1 + grants_abilities [“Daemon”] ✓
  ✓ locked_mark: “Khorne” (from Mark of Khorne ability) ✓
  ✓ keywords: [“World Eaters”] ✓
  ✓ has_veteran_abilities: true / veteran_max: 1 ✓
  ✓ has_armory_access: false / champion_has_armory: false ✓
  ✓ default_size: 3 / min_cost: 156 (3×52 = 156) ✓

## elites/exalted_plague_champion.json

EXALTED PLAGUE CHAMPION — Elites

SOURCE: Chaos Space Marines ENG / Foetid Virion.html (canonical datasheet)
─────────────────────────────────────────────────────────────────────────────────────

PROFILE:
  No.  NAME                    M    WS  BS  S  T  W  I  A  LD  SV  PTS
  1+   Foetid Virion 6”   3+  3+  4  5  4  4  2   8  3+   62

EQUIPPED WITH: Blight grenades; Krak grenades; Plague knife.
  Foul Blightspawn additionally equipped with: Plague sprayer.

WEAPONS:
  Blight grenades           6”   Grenade 1   4  AP0   D1  Explosive, Poison(4+)
  Enhanced blight grenades  6”   Grenade 1   4  AP-1  D2  Explosive, Poison(4+)
  Krak grenades             6”   Grenade 1   6  AP-2  D1  —
  Plague knife              —    Melee       U  AP0   D1  Poison(4+)
  Plague sprayer            12”  Assault 4   6  AP-2  D1  Flames, Poison(4+)

OPTIONS:
  • MUST upgrade to one of 5 specialisations (required: true):
    Tallyman+5 / Noxious Blightbringer+8 / Biologus Putrifier+17 /
    Foul Blightspawn+29 / Plague Surgeon+43
  • Has armory access; up to 1 veteran ability
  • Advisor: up to 5 per HQ unit (each specialisation once per HQ)

ABILITIES (verbatim):
  Command squad, Mark of Nurgle
  Advisor: For every HQ unit, up to 5 Foetid Virions without Elite slot.
  (NOTE: HTML typo “Foul Infiusion” in Biologus ability → corrected to “Foul Infusion” in TS)

UNIT TYPE: Character Model, Infantry
KEYWORDS: Death Guard

ENGINE STATUS:
  ✓ stats, pts match HTML exactly
  ✓ specialisation upgrade: required:true constraint ✓
  ✓ Plague Surgeon: effect.grants_abilities [“Warded”] ✓
  ✓ locked_mark: “Nurgle” ✓
  ✓ advisor: true ✓
  ✓ has_armory_access: true / veteran_max: 1 ✓
  ✓ default_size: 1 / min_cost: 62 ✓

## elites/flawless_blades.json

FLAWLESS BLADES — Elites

SOURCE: Chaos Space Marines ENG / Flawless Blades.html (canonical datasheet)
─────────────────────────────────────────────────────────────────────────────

PROFILE:
  No.  NAME           M    WS  BS  S  T  W  I  A  LD  SV  PTS
  3-6  Flawless Blade  8"   2+  3+  5  5  2  5  2   8  3+   54

EQUIPPED WITH: Each model is equipped with: Blissblade; Bolt pistol.

WEAPONS:
  Blissblade   —  Melee    S+1  AP-3  D1  Master-crafted, Precision(3+)
  Bolt pistol  12"  Pistol 1  S4  AP-1  D1  -

OPTIONS:
  • May have up to 1 veteran ability.
  (No armory access of any kind — no champion model)

ABILITIES (verbatim): Daemon, Mark of Slaanesh, Parry

UNIT TYPE: Infantry
KEYWORDS: Emperor's Children

ENGINE STATUS:
  ✓ stats, pts, weapons all match HTML exactly
  ✓ abilities: ["Daemon, Mark of Slaanesh, Parry"] ✓
  ✓ locked_mark: "Slaanesh" (from Mark of Slaanesh ability)
  ✓ has_veteran_abilities: true / veteran_max: 1
  ✓ champion_has_armory: false / has_armory_access: false (no armory on this datasheet)
  ✓ option_groups: [] (vet ability encoded as flag, no physical option choices)
  ✓ no armourKeyword (no Terminator/Cataphractii armour)

## elites/helbrute.json

HELBRUTE — Elites

SOURCE: Chaos Space Marines ENG / Helbrute.html (canonical datasheet)
─────────────────────────────────────────────────────────────────────────

PROFILE:
  No.  NAME     M    WS  BS  S  FRONT  SIDE  REAR  I  A  HP  PTS
  1-2  Helbrute 6”   3+  3+  6    12    12    10   4  3   3  174

EQUIPPED WITH: A Helbrute is equipped with: Helbrute fist; Power scourge.

WEAPONS:
  Combi-bolter              24”  Rapid Fire 2  4   AP-1  D1  —
  Heavy flamer               9”  Assault 4     5   AP-1  D1  Flames
  Helbrute fist              —   Melee        x2   AP-3  D2  AT(2)
  Helbrute hammer            —   Melee        x2   AP-3  D3  AT(3), Armorbane
  Helbrute plasma cannon    36”  Heavy 1       8   AP-4  D2  AT(2), Explosive, Overheat
  Multi-melta               24”  Assault 1     8   AP-5  D2  AT(2), Melta
  Missile launcher - Frag   48”  Heavy 1       4   AP0   D1  Explosive
  Missile launcher - Krak   48”  Heavy 1       8   AP-3  D2  AT(2), Anti-air
  Power scourge              —   Melee         U   AP-2  D1  Flurry(4)
  Reaper autocannon         36”  Heavy 4       7   AP-2  D1  AT(1)
  Twin heavy bolter         36”  Rapid Fire 4  5   AP-2  D1  —
  Twin lascannon            48”  Heavy 2       9   AP-4  D3  AT(3)

OPTIONS:
  • May receive a Mark of Chaos: K+10 / N+10 / S+10 / T+10 (NO Undivided)
  • May replace Helbrute fist:
    Reaper autocannon+15 / Twin heavy bolter+20 / Multi-melta+21 /
    Helbrute plasma cannon+86 / Twin lascannon+122
  • May replace Power scourge:
    Helbrute fist+0 / Helbrute hammer+7 / Missile launcher+24
  • For every Helbrute fist may add: Combi-bolter+11 / Heavy flamer+13
  • Has armory access; up to 2 veteran abilities

ABILITIES (verbatim):
  Squadron
  Furioso: If the model is equipped with two melee weapons, it gains +2 attacks.

UNIT TYPE: Walker
KEYWORDS: Chaos Space Marine

ENGINE STATUS:
  ✓ stats, pts, all weapons match HTML exactly
  ✓ marks: K/N/S/T only — no Undivided ✓
  ✓ Furioso: ability string (no mechanical support needed for display) ✓
  ✓ keywords: [“Chaos Space Marine”, “Vehicle”] — “Vehicle” is production semantic ✓
  ✓ is_vehicle: true / is_squadron: true (via “Squadron” ability) ✓
  🔴 has_armory_access: false — CORRECTED 2026-06-07 (was true; veteran_max: 2 stays correct).
    The OPTIONS line "Has access to vehicle equipment from the Armory" is a DISTINCT, narrower
    grant than "weapons and gear from the Armory" (used on CSM characters like Sorcerer/Dark
    Apostle) — despite Helbrute's unit_type being "Walker", its Armory access is vehicle-
    equipment-scoped (consistent with is_vehicle: true). "Vehicle equipment" = the Vehicle
    Upgrades list ONLY, already shown automatically via is_vehicle + category:'vehicle' items
    (UnitCard.tsx hasFactionVehicleItems — independent of this flag); it does NOT grant the
    general armory (Daemon weapon/Daemonic armor/Familiar/etc.). The old `true` value wrongly
    opened that general armory tab. (This session's earlier SOURCE-pass note glossed "Has armory
    access" without preserving the "vehicle equipment" qualifier — fixed after cross-referencing
    engine code + verbatim text comparison across all CSM vehicles.)
  ✓ default_size: 1 / min_cost: 174 ✓

## elites/khorne_berzerkers.json

KHORNE BERZERKERS — Elites

SOURCE: Chaos Space Marines ENG / Khorne Berzerkers.html (canonical datasheet)
───────────────────────────────────────────────────────────────────────────────

PROFILE:
  No.  NAME                 M    WS  BS  S  T  W  I  A  LD  SV  PTS
  4-7  Khorne Berzerker     6"   3+  3+  5  4  2  4  3   8  3+   46
  1    Berzerker Champion   6"   3+  3+  5  4  2  4  3   8  3+   51

EQUIPPED WITH: Each model is equipped with: Chainaxe; Bolt pistol; Frag grenades; Krak grenades.

WEAPONS:
  Bolt pistol                12"  Pistol 1   S4   AP-1  D1  -
  Eviscerator                 —   Melee      Sx2  AP-3  D2  AT(1), Armorbane, Slow(-2), Unwieldy
  Frag grenade               6"  Grenade 1  S4   AP 0  D1  Explosive
  Krak grenade               6"  Grenade 1  S6   AP-2  D1  -
  Chainaxe                   —   Melee      S+1  AP-1  D1  -
  Plasma pistol - Standard   12"  Pistol 1   S7   AP-3  D1  AT(1)
  Plasma pistol - Overcharged 12"  Pistol 1   S8   AP-4  D2  AT(2), Overheat

  NOTE: HTML source labels the Krak grenade row as "Frag grenade" (copy-paste error
  in source spreadsheet) and Chainaxe type as "Nahkampf" (German for Melee — locale
  artifact). Production JSON is canonical here — both corrected.

OPTIONS:
  • For each 4 models, two Berzerkers may swap their Bolt pistols:
    Plasma pistol +8 / Eviscerator +12
  • The Berzerker Champion has access to the armory.
  • This unit may receive one veteran ability.

ABILITIES (verbatim): Berserk(5+), Blind rage, Mark of Khorne

UNIT TYPE: Infantry
KEYWORDS: World Eaters

ENGINE STATUS:
  ✓ stats, pts, weapons all match HTML (correcting source artefacts above)
  ✓ locked_mark: "Khorne" (from Mark of Khorne ability)
  ✓ per_n:4/count_per_n:2 for bolt pistol swap
  ✓ champion_has_armory: true / has_veteran_abilities: true / veteran_max: 1
  ✓ default_size: 5 / min_cost: 235 (4×46 + 1×51 = 235) ✓
  ✓ no armourKeyword (no Terminator/Cataphractii armour)

## elites/legionnaires.json

LEGIONNAIRES — Elites

SOURCE: Chaos Space Marines ENG / Legionnaires.html (canonical datasheet)
─────────────────────────────────────────────────────────────────────────

PROFILE:
  No.   NAME                  M    WS  BS  S  T  W  I  A  LD  SV  PTS
  4-9   Legionnaire           6”   3+  3+  4  4  2  4  2   8  3+   38
  1     Legionnaire Champion  6”   3+  3+  4  4  2  4  2   8  3+   43

EQUIPPED WITH: Each model is equipped with: Astartes Chainsword; Bolter; Bolt pistol;
  Frag grenades; Krak grenades.

WEAPONS:
  Astartes Chainsword          —    Melee         U   AP-1  D1  —
  Autocannon                   48”  Heavy 2       7   AP-2  D1  AT(1)
  Bolt pistol                  12”  Pistol 1      4   AP-1  D1  —
  Bolter                       24”  Rapid Fire 1  4   AP-1  D1  —
  Flamer                        9”  Assault 4     4   AP0   D1  Flames
  Frag grenade                  6”  Grenade 1     4   AP0   D1  Explosive
  Heavy bolter                 36”  Rapid Fire 2  5   AP-2  D1  —
  Heavy chainaxe               —    Melee        +3   AP-3  D2  AT(1), Deadly(5+), Slow(-1), Unwieldy
  Krak grenade                  6”  Grenade 1     6   AP-2  D1  —
  Lascannon                    48”  Heavy 1       9   AP-4  D3  AT(3)
  Meltagun                     12”  Assault 1     8   AP-5  D1  AT(1), Melta
  Missile launcher - Frag      48”  Heavy 1       4   AP0   D1  Explosive
  Missile launcher - Krak      48”  Heavy 1       8   AP-3  D2  AT(2), Anti-Air
  Plasma gun - Standard        24”  Rapid Fire 1  7   AP-3  D1  AT(1)
  Plasma gun - Overcharged     24”  Rapid Fire 1  8   AP-4  D2  AT(2), Overheat
  Reaper chaincannon           24”  Assault 4     5   AP-1  D1  Suppression
  (NOTE: HTML shows Reaper chaincannon D=”-1” — production D=”1” is correct; HTML typo.)

OPTIONS:
  • All models may receive a Mark of Chaos (per model): K+2 / S+2 / N+2 / T+5
    (NO Undivided option)
  • For each 5 models, two Legionnaires may swap their Bolter:
    Flamer+0 / Heavy bolter+13 / Meltagun+13 / Plasma gun+17 / Reaper chaincannon+19 /
    Autocannon+21 / Missile launcher+35 / Lascannon+64
  • For each 5 models, two other Legionnaires may swap their Chainsword+Bolter+Bolt pistol:
    Heavy chainaxe+5
  • Legionnaire Champion has armory access.
  • Must have one veteran ability and can pick a second.

ABILITIES (verbatim): — (none listed)

UNIT TYPE: Infantry
KEYWORDS: Chaos Space Marine

ENGINE STATUS:
  ✓ stats, pts match HTML exactly
  ✓ all weapons match HTML (D=”1” for Reaper chaincannon corrects HTML typo D=”-1”)
  ✓ marks: K/S/N/T only — no Undivided ✓
  ✓ per_n:5 / count_per_n:2 for both bolter swap and heavy weapon swap ✓
  ✓ champion_has_armory: true ✓
  ✓ has_veteran_abilities: true / veteran_max: 2 ✓
  ✓ veteran_required: true — datasheet says “Must have one veteran ability” (fixed v0.54)
    NOTE: separate from Legionnaire Warband archetype (army-wide rule, different engine path)
  ✓ default_size: 5 / min_cost: 195 (4×38 + 1×43 = 195) ✓

## elites/master_of_execution.json

MASTER OF EXECUTION — Elites

SOURCE: Chaos Space Marines ENG / Master of Execution.html (canonical datasheet)
─────────────────────────────────────────────────────────────────────────────────

PROFILE:
  No.  NAME                  M    WS  BS  S  T  W  I  A  LD  SV  PTS
  1    Master of Execution   6"   2+  3+  4  4  3  4  2   8  3+   70

EQUIPPED WITH: A Master of Execution is equipped with: Axe of dismemberment; Frag grenades; Krak grenades.

WEAPONS:
  Axe of dismemberment  —  Melee     S+3  AP-3  D2  AT(1), Deadly(5+)
  Frag grenade          6"  Grenade 1  S4  AP 0  D1  Explosive
  Krak grenade          6"  Grenade 1  S6  AP-2  D1  -

OPTIONS:
  • May receive a Mark of Chaos:
    Undivided +0 / Khorne +6 / Slaanesh +6 / Nurgle +17 / Tzeentch +12
  • Has access to weapons and gear from the Armory.
  • Can gain up to 2 veteran abilities.

ABILITIES (verbatim):
  Command squad
  Advisor: For every HQ unit, you may select one Master of Execution without using up an Elite slot.
  Trophy-taker: The model can re-roll 1 hit roll and 1 wound roll per activation.

UNIT TYPE: Infantry  (note: NOT "Character model" — single-model non-character)
KEYWORDS: Chaos Space Marine

ENGINE STATUS:
  ✓ stats, pts, weapons all match HTML exactly
  ✓ mark options: Undivided+0 / K+6 / S+6 / N+17 / T+12
  ✓ advisor: true (Advisor ability = no Elite slot required per HQ unit)
  ✓ has_armory_access: true / has_veteran_abilities: true / veteran_max: 2
  ✓ is_character: false — HTML unit type is "Infantry" (not "Character model")
  ✓ champion_has_armory: false (single model, armory via has_armory_access)
  ✓ no armourKeyword (no Terminator/Cataphractii armour)

## elites/mutilator.json

MUTILATOR — Elites

SOURCE: Chaos Space Marines 1.02.ods / "Mutilator" (added CSM 1.02, 2026-07-24).
Monstrous Infantry, 1-3, 115 pts. Fleshmetal weapons = equipped with ALL 5 melee profiles.
Marks: K/S/N +4, T +10 per model. Up to 2 veteran abilities. No Armory access.

## elites/noise_marines.json

NOISE MARINES — Elites

SOURCE: Chaos Space Marines ENG / Noise Marines.html (canonical datasheet)
─────────────────────────────────────────────────────────────────────────────

PROFILE:
  No.   NAME           M    WS  BS  S  T  W  I  A  LD  SV  PTS
  4-11  Noise Marine   8"   3+  3+  4  4  2  5  2   8  3+   37
  1     Noise Champion  8"   3+  3+  4  4  2  5  2   8  3+   42

EQUIPPED WITH: Each model is equipped with: Astartes Chainsword; Bolt pistol; Frag grenades; Krak grenades.

WEAPONS:
  Astartes Chainsword            —   Melee         SU   AP-1  D1  -
  Bolt pistol                   12"  Pistol 1       S4   AP-1  D1  -
  Bolter                        24"  Rapid Fire 1   S4   AP-1  D1  -
  Blastmaster - Single freq.    36"  Heavy 1        S8   AP-2  D2  AT(2), Sunder(2), Suppression
  Blastmaster - Varied freq.    24"  Assault 1      S5   AP-1  D1  Explosive, Sunder(2), Suppression
  Duelling sabre                 —   Melee         SU   AP-2  D1  Parry
  Frag grenade                   6"  Grenade 1      S4   AP 0  D1  Explosive
  Krak grenade                   6"  Grenade 1      S6   AP-2  D1  -
  Meltagun                      12"  Assault 1      S8   AP-5  D1  AT(1), Melta
  Plasma gun - Standard         24"  Rapid Fire 1   S7   AP-3  D1  AT(1)
  Plasma gun - Overcharged      24"  Rapid Fire 1   S8   AP-4  D2  AT(2), Overheat
  Sonic blaster                 24"  Assault 2      S4   AP-1  D1  Sunder(2), Suppression

OPTIONS:
  • Each model's Bolt pistol may be replaced with:
    Bolter +3 / Sonic blaster +9
  • Each model's Astartes Chainsword may be replaced with:
    Duelling sabre +3
  • Two Noise Marines' Bolt pistols can be replaced with (max 2):
    Meltagun +15 / Plasma gun +20 / Blastmaster +30
  • If unit is 12 models, another two Bolt pistols may be replaced (max 2 additional)
  • The Noise Champion has access to the armory.
  • This unit may have 1 veteran ability.

SOURCE NOTES:
  - HTML keyword is "Emperor's Champion" — clear typo; should be "Emperor's Children".
    Production JSON has the correct value; canonical here.
  - HTML option points use "Punkte" (German locale artifact) → corrected to numeric in TS.

ABILITIES (verbatim): Mark of Slaanesh

UNIT TYPE: Infantry
KEYWORDS: Emperor's Children  (HTML erroneously says "Emperor's Champion")

ENGINE STATUS:
  ✓ stats, pts, weapons all match HTML (correcting source artefacts above)
  ✓ locked_mark: "Slaanesh" (from Mark of Slaanesh ability)
  ✓ champion_has_armory: true / has_veteran_abilities: true / veteran_max: 1
  ✓ fixed_max:2 heavy-weapon swap + conditional 12-model second swap
  ✓ replaces: ["Bolt pistol"] / replaces: ["Astartes Chainsword"] on every-swap groups
  ✓ default_size: 5 / min_cost: 190 (4×37 + 1×42 = 190) ✓
  ❌ 12-model second swap available_if unit_size==12 — not enforced (shown always)
  ✓ no armourKeyword (no Terminator/Cataphractii armour)

## elites/plague_marines.json

PLAGUE MARINES — Elites

SOURCE: Chaos Space Marines ENG / Plague Marines.html (canonical datasheet)
──────────────────────────────────────────────────────────────────────────────

PROFILE:
  No.   NAME             M    WS  BS  S  T  W  I  A  LD  SV  PTS
  4-13  Plague Marine    6"   3+  3+  4  5  3  4  2   8  3+   53
  1     Plague Champion  6"   3+  3+  4  5  3  4  2   8  3+   58

EQUIPPED WITH: Every model is equipped with: Blight grenades; Bolter; Krak grenades; Plague knife.

WEAPONS:
  Blight grenades          6"   Grenade 1     S4   AP 0  D1  Explosive, Poison(4+)
  Blight launcher         24"   Assault 2     S6   AP-2  D2  Poison(4+)
  Bolter                  24"   Rapid Fire 1  S4   AP-1  D1  Poison(4+)
  Heavy plague weapon      —    Melee         S+2  AP-3  D2  Poison(4+), Slow(-1), Unwieldy
  Krak grenades            6"   Grenade 1     S6   AP-2  D1  -
  Light plague weapon      —    Melee         S+1  AP-2  D1  Flurry(2), Poison(4+)
  Meltagun                12"   Assault 1     S8   AP-5  D1  AT(1), Melta
  Plague belcher           9"   Assault 4     S4   AP 0  D1  Flames, Poison(4+)
  Plague knife             —    Melee         SU   AP 0  D1  Poison(4+)
  Plague spewer            9"   Assault 4     S5   AP-1  D1  Flames, Poison(4+)
  Plasma gun - Standard   24"   Rapid Fire 1  S7   AP-3  D1  AT(1)
  Plasma gun - Overcharged 24"  Rapid Fire 1  S8   AP-4  D2  AT(2), Overheating

  NOTE: "Overheating" (not "Overheat") per this datasheet — per FAQ #5 each sheet is canonical.

OPTIONS:
  • For every 5 models, two Plague Marines may swap their Bolters (pts per model):
    Plague belcher +0 / Meltagun +11 / Plague spewer +11 / Heavy plague weapon +12 /
    Plasma gun +16 / Blight launcher +28
  • For every 5 models, two additional Plague Marines may swap their Bolters:
    Light plague weapon +3 / Heavy plague weapon +8
  • One model may be equipped with:
    Icon of Nurgle +10 / Plague banner +25
  • The Plague Champion has access to weapons and gear from the Armory.
  • The unit can gain a Veteran ability.

ABILITIES (verbatim):
  Mark of Nurgle
  Icon of Nurgle: A friendly Daemon unit arriving within 7" of the bearer via deepstrike does not scatter.
  Plague banner: The unit gains the effects of an Icon of Nurgle. Additionally it gains a bonus
    of +1 to Leadership and Combat resolutions. As long as the banner bearer is alive, Mission
    objectives that are held by this unit can not be contested by enemy units.

UNIT TYPE: Infantry
KEYWORDS: Death Guard

ENGINE STATUS:
  ✓ stats, pts, all 12 weapons match HTML exactly
  ✓ locked_mark: "Nurgle" (from Mark of Nurgle ability)
  ✓ champion_has_armory: true / veteran_max: 1
  ✓ per_n:5/count_per_n:2 for both heavy-weapon swap groups
  ✓ Icon of Nurgle / Plague banner as option_group constraint "one"
  ✓ conditional abilities (Icon/Banner) encoded as always-visible ability strings —
    functionally correct (they only apply when the option is purchased, engine doesn't filter)
  ✓ default_size: 5 / min_cost: 270 (4×53 + 1×58 = 270) ✓

## elites/possessed.json

POSSESSED — Elites

SOURCE: Chaos Space Marines ENG / Possessed.html (canonical datasheet)
─────────────────────────────────────────────────────────────────────────

PROFILE:
  No.   NAME       M    WS  BS  S  T  W  I  A  LD  SV  PTS
  5-10  Possessed  8"   3+  3+  5  5  2  4  3   8  3+   50

EQUIPPED WITH: Each model is equipped with: Malefic mutations

WEAPONS:
  Malefic mutations  —  Melee  SU  AP-3  D1  Armor piercing(5+)

OPTIONS:
  • All models may receive a Mark of Chaos (points per model):
    Khorne +3 / Slaanesh +3 / Nurgle +3 / Tzeentch +9
    (UPDATED 2026-09-24 per author's sheet: all four Marks now available — no Undivided)
  • All models may be equipped with Jump packs for +11 points per model.
  • May have up to 2 veteran abilities.

ABILITIES (verbatim): Daemon

UNIT TYPE: Infantry
KEYWORDS: Chaos Space Marine

ENGINE STATUS:
  ✓ stats, pts, weapon match HTML exactly
  ✓ mark options: Khorne+3 / Slaanesh+3 / Nurgle+3 / Tzeentch+9 — no Undivided
  ✓ locked_mark: null (has mark selector, all four gods, no Undivided)
  ✓ jump packs: adds_unit_types ["Jump Pack Infantry"] + grants_abilities ["Deep Strike"]
    per Core Rules lines 503-507 ("Jump Pack Infantry acts like Infantry, gains Deep Strike")
  ✓ champion_has_armory: false / has_armory_access: false (no armory mentioned in HTML)
  ✓ has_veteran_abilities: true / veteran_max: 2
  ✓ default_size: 5 / min_cost: 250 (5×50 = 250) ✓
  ✓ no armourKeyword (no Terminator/Cataphractii armour)

## elites/red_butcher_terminators.json

RED BUTCHER TERMINATORS — Elites

SOURCE: Chaos Space Marines ENG / Red Butcher Terminators.html (canonical datasheet)
────────────────────────────────────────────────────────────────────────────────────

PROFILE:
  No.  NAME                    M    WS  BS  S  T  W  I  A  LD  SV  PTS
  4-8  Red Butcher Terminator  6"   2+  3+  5  5  2  4  4   8  2+   73
  1    Red Butcher Champion    6"   2+  3+  5  5  2  4  4   8  2+   78

EQUIPPED WITH: Each model is equipped with: Twin Power axes.

WEAPONS:
  Twin power axe   —  Melee  S+2  AP-2  D1  Flurry(1)
  Twin chainfist   —  Melee  Sx2  AP-4  D3  Armorbane, AT(3), Flurry(1), Slow(-3)

OPTIONS:
  • The Red Butcher Champion may swap their Twin power axe:
    Twin chainfist +26 pts
  • The Red Butcher Champion has access to gear from the Armory.
  • May have up to 1 veteran ability.

ABILITIES (verbatim):
  Blind Rage, Deep strike, Mark of Khorne, Massive(1), Unyielding
  Cataphractii armor: The model has a 4+ ward save.

  NOTE: "Blind Rage" (capital R) on this sheet vs "Blind rage" on Khorne Berzerkers —
  per FAQ #5 each sheet is canonical for its own ability name.

UNIT TYPE: Infantry
KEYWORDS: World Eaters

ARMOUR KEYWORD: Cataphractii — triggers ᵀ-gate (only ᵀ armory items allowed).
  SOURCE (Armory.html): "Models wearing Cataphractii or Terminator armor can only
  receive equipment with ᵀ." → armourKeyword: "Cataphractii" ✅

ENGINE STATUS:
  ✓ armourKeyword: "Cataphractii" → ᵀ-gate enforced
  ✓ locked_mark: "Khorne" (from Mark of Khorne ability)
  ✓ champion-only swap: constraint "one" with Twin chainfist +26
  ✓ champion_has_armory: true / veteran_max: 1
  ✓ default_size: 5 / min_cost: 370 (4×73 + 1×78 = 370) ✓

## elites/rubric_marines.json

RUBRIC MARINES — Elites

SOURCE: Chaos Space Marines ENG / Rubric Marines.html (canonical datasheet)
─────────────────────────────────────────────────────────────────────────────

PROFILE:
  No.   NAME               M    WS  BS  S  T  W  I  A  LD  SV  PTS
  4-8   Rubric Marine      6”   3+  3+  4  4  2  4  2   8  3+   41
  1     Aspiring Sorcerer  6”   3+  3+  4  4  2  4  2   8  3+   51

EQUIPPED WITH: Every Rubric Marine: Inferno bolter.
  Aspiring Sorcerer: Inferno bolt pistol; Force staff.

WEAPONS:
  Inferno bolter       24”  Rapid Fire 1  4  AP-2  D1  —
  Inferno bolt pistol  12”  Pistol 1      4  AP-2  D1  —
  Force staff           —   Melee        +3  AP-1  D1  AT(1), Force weapon
  Soulreaper cannon    24”  Heavy 4       6  AP-2  D1  Armor piercing(5+)
  Warpflamer            9”  Assault 4     4  AP-1  D1  Flames

OPTIONS:
  • Each model’s Inferno bolter → Warpflamer +4
  • One Rubric Marine’s Inferno bolter → Soulreaper cannon +25
  • At 9 models: another Rubric Marine’s Inferno bolter → Soulreaper cannon +25
  • Aspiring Sorcerer has armory access; up to 1 veteran ability

ABILITIES (verbatim):
  Mark of Tzeentch, Unyielding
  Psyker: An Aspiring Sorcerer may cast and/or deny 1 psychic power.
    He knows smite as well as one psychic power of a chosen discipline.
  ENGINE TODO: enforce cast/deny limit and ‘chosen discipline’ mechanic.

UNIT TYPE: Infantry
KEYWORDS: Thousand Sons, Psyker

ENGINE STATUS:
  ✓ stats, pts, all weapons match HTML exactly
  ✓ locked_mark: “Tzeentch” ✓
  ✓ champion_has_armory: true (Aspiring Sorcerer) ✓
  ✓ has_veteran_abilities: true / veteran_max: 1 ✓
  ✓ veteran_required: false (HTML: “up to 1 veteran ability” — optional) ✓
  ✓ is_psyker: true ✓
  ✓ default_size: 5 / min_cost: 215 (4×41 + 1×51 = 215) ✓

## elites/scarab_occult_terminators.json

SCARAB OCCULT TERMINATORS — Elites

SOURCE: Chaos Space Marines ENG / Scarab Occult Terminators.html (canonical datasheet)
─────────────────────────────────────────────────────────────────────────────────────────

PROFILE:
  No.   NAME                     M    WS  BS  S  T  W  I  A  LD   SV  PTS
  4-8   Scarab Occult Terminator 6”   3+  3+  4  5  2  4  3   9   2+   79
  1     Scarab Occult Sorcerer   6”   3+  3+  4  5  2  4  3   9   2+   89

EQUIPPED WITH: Each Terminator: Inferno combi-bolter; Prosperine khopesh.
  Sorcerer: Force stave; Inferno combi-bolter.
  (NOTE: HTML equipment section typo “Infero combi-bolter” — missing ‘n’;
   weapons table has correct “Inferno combi-bolter”; TS uses correct name)

WEAPONS:
  Force stave              —    Melee        +3  AP-1  D1  Force weapon
  Heavy warpflamer          9”  Assault 4     5  AP-2  D1  Flames
  Hellfyre missile rack    36”  Heavy 2       8  AP-2  D2  AT(2), Anti-air
  Inferno combi-bolter     24”  Rapid Fire 2  4  AP-2  D1  —
  Prosperine khopesh        —   Melee        +2  AP-2  D1  Soul burn(5+)
  Soulreaper cannon        24”  Heavy 4       6  AP-2  D1  Armor piercing(5+)

OPTIONS:
  • One Terminator’s Inferno Combi-bolter → Heavy warpflamer+4 / Soulreaper cannon+19
  • At 9 models: another Terminator’s Inferno Combi-bolter → same swap
  • One model may receive Hellfyre Missile rack +64
  • At 9 models: additional Terminator may receive Hellfyre missile rack
  • Sorcerer has armory access; up to 1 veteran ability

ABILITIES (verbatim):
  Deep strike, Mark of Tzeentch, Massive(1), Unyielding
  Crux Terminatus: This unit has a 5+ ward save.
  Psyker: A Scarab Occult Sorcerer may cast and/or deny 1 psychic power.
    He knows smite as well as one psychic power of a chosen discipline.
  ENGINE TODO: enforce cast/deny limit and ‘chosen discipline’ mechanic.

UNIT TYPE: Infantry
KEYWORDS: Thousand Sons, Psyker

ENGINE STATUS:
  ✓ stats, pts, all weapons match HTML exactly
  ✓ armourKeyword: “Terminator” — enforces ᵀ-gate for armory ✓
  ✓ locked_mark: “Tzeentch” ✓
  ✓ champion_has_armory: true (Sorcerer) ✓
  ✓ has_veteran_abilities: true / veteran_max: 1 ✓
  ✓ veteran_required: false (HTML: “up to 1 veteran ability” — optional) ✓
  ✓ is_psyker: true ✓
  ✓ default_size: 5 / min_cost: 405 (4×79 + 1×89 = 405) ✓

## elites/sekhetar_robots.json

SEKHETAR ROBOTS — Elites

SOURCE: Chaos Space Marines ENG / Sekhetar Robots.html (canonical datasheet)
───────────────────────────────────────────────────────────────────────────────

PROFILE:
  No.  NAME            M    WS  BS  S  T  W  I  A  LD   SV  PTS
  2-4  Sekhetar Robot  6"   4+  4+  5  6  3  3  2  10   3+  148

EQUIPPED WITH: Every model is equipped with: Heavy warpflamer; Hellfyre missile rack; Pyreflux meltagun.

WEAPONS:
  Heavy warpflamer      9"   Assault 4  S5  AP-2  D1  Flames
  Hellfyre missile rack 36"  Heavy 2    S8  AP-2  D2  AT(2), Anti-air
  Pyreflux meltagun      9"  Assault 1  S9  AP-5  D1  AT(1), Melta
  Power claw             —   Melee      Sx2 AP-3  D2  AT(1)         [swap option]
  Warpflame projector    6"  Pistol 4   S4  AP-1  D1  Flames         [swap option]

OPTIONS:
  • Any model may swap their Pyreflux meltagun:
    Power claw and warpflame projector +5 pts

ABILITIES (verbatim):
  Infiltrate, Mark of Tzeentch, Unyielding
  Battle Protocols: Select one Battle Protocol during each activation:
  - Aegis: All models in the unit gain +1 Toughness. Default in first battle round.
  - Conqueror: All models in the unit gain +1 WS.
  - Protector: All models in the unit gain +1 BS.

UNIT TYPE: Monstrous infantry
KEYWORDS: Thousand Sons

ENGINE STATUS:
  ✓ stats, pts, all weapons match HTML exactly
  ✓ locked_mark: "Tzeentch" (from Mark of Tzeentch ability)
  ✓ unit_type: "Monstrous Infantry" ✓
  ✓ weapon swap: constraint "every", choices [Power claw and warpflame projector +5]
  ✓ Battle Protocols encoded as ability strings (no mechanichal engine support needed)
  ✓ champion_has_armory: false / has_armory_access: false (no armory in HTML)
  ✓ has_veteran_abilities: false / veteran_max: null (no veteran option in HTML)
  ✓ default_size: 2 / min_cost: 296 (2×148 = 296) ✓
  ✓ no armourKeyword (no Terminator/Cataphractii armour)

## elites/slaughterbound.json

SLAUGHTERBOUND — Elites

SOURCE: Chaos Space Marines 1.02.ods / "Slaughterbound" (added CSM 1.02, 2026-07-24).
Infantry, 1, 148 pts. World Eaters, baked-in Mark of Khorne, Armory (weapons + gear).
NOTE: "Possessed Lord" grants a free Elite slot per Eightbound unit — documented in the
ability text; per-Eightbound free-slot exemption is not engine-enforced yet (advisor:false).

## elites/tzaangor_shaman.json

TZAANGOR SHAMAN — Elites

SOURCE: Chaos Space Marines ENG / Tzaangor Shaman.html (canonical datasheet)
─────────────────────────────────────────────────────────────────────────────

PROFILE:
  No.  NAME             M    WS  BS  S  T  W  I  A  LD  SV  PTS
  1    Tzaangor Shaman  6”   3+  3+  4  4  2  4  2   7  5+   31

EQUIPPED WITH: A Tzaangor Shaman is a single character model equipped with: —.
  (HTML weapon table row shows all dashes — no weapons listed)

WEAPONS: (none)

OPTIONS:
  • Has armory access; up to 1 veteran ability

ABILITIES (verbatim):
  Mark of Tzeentch
  Advisor: For every HQ selection, one Tzaangor Shaman may be selected without
    taking up an Elite slot.
  Bestial Prophet: The model and an attached unit of Tzaangors or Tzaangor Enlighteneds
    gain “Deflagrate(5+)” for all weapons.
  Psyker: A Tzaangor Shaman may cast and/or deny 1 psychic power.
    He knows smite as well as one psychic power of a chosen discipline.
  ENGINE TODO: enforce cast/deny limit and ‘chosen discipline’ mechanic.

UNIT TYPE: Character model, Infantry (HTML lowercase ‘m’ → normalised “Character Model, Infantry”)
KEYWORDS: Thousand Sons, Psyker

ENGINE STATUS:
  ✓ stats, pts match HTML exactly
  ✓ weapons: [] (no weapons on datasheet) ✓
  ✓ locked_mark: “Tzeentch” ✓
  ✓ advisor: true ✓
  ✓ has_armory_access: true / veteran_max: 1 ✓
  ✓ is_psyker: true / is_character: true ✓
  ✓ default_size: 1 / min_cost: 31 ✓

## elites/war_dog.json

WAR DOG — Elites

SOURCE: Escalation supplement (no HTML in data/source/Chaos Space Marines ENG/)
─────────────────────────────────────────────────────────────────────────────────
Data derived from production JSON (canonical); HTML source not available locally.

PROFILE:
  No.  NAME                  M    WS  BS  S  FRONT  SIDE  REAR  I  A  HP  PTS
  1-2  War Dog Executioner   6”   3+  3+  6    12    11    11   4  3   3  196

EQUIPPED WITH: A War Dog Executioner is equipped with: 2 Reaper chaintalons; Heavy stubber.

WEAPONS:
  Avenger chaincannon    36”  Assault 10  6  AP-2  D1  Suppression
  Daemonbreath spear     24”  Heavy 1     9  AP-5  D3  AT(3), Armorbane
  Havoc launcher         48”  Heavy 1     5  AP-1  D1  Anti-Air, Explosive
  Heavy stubber          36”  Heavy 3     4  AP0   D1  Suppression
  Melta                  12”  Assault 1   8  AP-5  D1  AT(1), Melta
  Reaper chaintalon       —   Melee      +4  AP-3  D2  AT(2)
  Slaughterclaw           —   Melee      x2  AP-3  D3  AT(3)
  War Dog autocannon     48”  Heavy 2     7  AP-3  D2  Anti-Air, AT(1)

OPTIONS:
  • May receive a Mark of Chaos: K+10 / N+10 / S+10 / T+10 (no Undivided)
  • May swap first Reaper chaintalon:
    Slaughterclaw+2 / Daemonbreath spear+43 / War Dog autocannon+43 / Avenger chaincannon+75
  • May swap second Reaper chaintalon: same options
  • May swap Heavy stubber: Melta+2 / Havoc launcher+14

ABILITIES (verbatim):
  Squadron
  Elite: Chaos armies may select units of War Dogs as an Elite choice.
  Ion shield: The model gains a 5+ ward save against ranged attacks.
    During activation, select which facing the Ion shield covers (default: front).

UNIT TYPE: Walker
KEYWORDS: Chaos Space Marine, Vehicle

ENGINE STATUS:
  ✓ is_vehicle: true / is_squadron: true ✓
  ✓ marks: K/N/S/T — no Undivided ✓
  ✓ dual chaintalon swap: two separate option_groups (ki-escalation-wardog-dualswap-display-01
    cosmetic display issue pending)
  ✓ has_veteran_abilities: false / locked_mark: null ✓
  ✓ default_size: 1 / min_cost: 196 ✓
  ✓ requires_engagement: 'epic' — the unit's own ability text ("Elite: Chaos armies may
ENGAGEMENT (author ruling, Discord 2026-09-22): "Armigers are supposed to be available
in Pitched Battle, same as War Dogs." Both were gated to Epic Battle on OUR reasoning
that Escalation is an Epic supplement — an assumption written down as a comment and
never put to him. The sheets say nothing about an engagement; the "Elite" override is
the whole rule. Now ["pitched", "epic"]. Skirmish is still excluded: he named Pitched,
and guessing past a ruling is what caused this in the first place.
    select units of War Dogs as an Elite choice") grants Elite-slot access instead of the
    normal Lords of War slot used by its sibling Escalation units (Chaos Warhound etc.), but
    it's still an Escalation-supplement datasheet — was unconditionally selectable in any
    engagement before this fix, when Escalation content only exists in Epic Battle.

## fast_attack/chaos_bikers.json

CHAOS BIKERS — Fast Attack

SOURCE: Chaos Space Marines ENG / Chaos Biker.html (canonical datasheet)
───────────────────────────────────────────────────────────────────────────

PROFILE:
  No.  NAME                          M    WS  BS  S  T  W  I  A  LD  SV  PTS
  2-9  Chaos Biker                   12"  3+  3+  4  5  3  4  2   7  3+   66
  1    Chaos Biker Champion          12"  3+  3+  4  5  3  4  2   7  3+   66
  *    Aspiring Chaos Biker Champion 12"  3+  3+  4  5  3  4  2   8  3+   76  (variant, Champion upgrade)

EQUIPPED WITH: Each model is equipped with: Astartes chainsword; Bolt pistol;
  Combi-bolter; Frag grenades; Krak grenades.

WEAPONS:
  Astartes Chainsword          -    Melee         SU   AP-1  D1  -
  Bolt pistol                 12"  Pistol 1      S4   AP-1  D1  -
  Combi-bolter                24"  Rapid Fire 2  S4   AP-1  D1  -
  Combi-flamer - Bolter       24"  Rapid Fire 1  S4   AP-1  D1  -
  Combi-flamer - Flamer        9"  Assault 4     S4   AP 0  D1  Flames
  Combi-melta - Bolter        24"  Rapid Fire 1  S4   AP-1  D1  -
  Combi-melta - Melta         12"  Assault 1     S8   AP-5  D1  AT(1), Melta
  Combi-plasma - Bolter       24"  Rapid Fire 1  S4   AP-1  D1  -
  Combi-plasma - Standard     24"  Rapid Fire 1  S7   AP-3  D1  AT(1)
  Combi-plasma - Overcharged  24"  Rapid Fire 1  S8   AP-4  D2  AT(2), Overheat
  Flamer                       9"  Assault 4     S4   AP 0  D1  Flames
  Frag grenade                 6"  Grenade 1     S4   AP 0  D1  Explosive
  Krak grenade                 6"  Grenade 1     S6   AP-2  D1  -
  Melta                       12"  Assault 1     S8   AP-5  D1  AT(1), Melta
  Plasma gun - Standard       24"  Rapid Fire 1  S7   AP-3  D1  AT(1)
  Plasma gun - Overcharged    24"  Rapid Fire 1  S8   AP-4  D2  AT(2), Overheat

  NOTE: HTML source uses locale artefacts "Pistol 1"/"Granate 1" (German for
  "Pistol 1"/"Grenade 1") and labels combi-plasma sub-profiles "Plasma (Standard/
  Overcharged)". Production JSON is canonical here — both normalized; combi-weapon
  sub-profiles correctly split into separate "<combi> - <profile>" weapon entries.

OPTIONS:
  • All models may receive a Mark of Chaos (per model): Khorne/Slaanesh/Nurgle +3pts,
    Tzeentch +7pts
  • Two Chaos Biker may each be equipped with: Flamer +5 / Melta +17 / Plasma gun +22
  • Alternatively, two Chaos Biker may each swap their Combi-bolter for:
    Combi-flamer +0 / Combi-melta +5 / Combi-plasma +10
  • The Chaos Biker Champion may be upgraded to an Aspiring Chaos Biker Champion for
    +10pts and gains access to weapons and gear from the Armory
  • May have up to 2 veteran abilities

ABILITIES: -

UNIT TYPE: Bike
KEYWORDS: Chaos Space Marine

ENGINE STATUS:
  ✓ stats, pts, weapons all match HTML (normalizing locale artefacts above)
  ✓ variant_models: Aspiring Chaos Biker Champion (champion upgrade, variant_link)
  ✓ option_groups: mark (per-model) / fixed_max(2) weapon adds / fixed_max(2) combi-bolter
    swap / champion→variant "one" upgrade (inline_pts 10)
  ✓ champion_has_armory: true — matches "[Aspiring Champion] gains access to the Armory"
    (base Champion has no armory text; access only granted via the upgrade)
  ✓ has_veteran_abilities: true / veteran_max: 2
  ✓ unit_type: "Bike" / keywords: ["Chaos Space Marine"]
  ✓ default_size: 3 (2 Bikers + 1 Champion) / min_cost: 198 (2×66 + 1×66) ✓
  ✓ no armourKeyword (no Terminator/Cataphractii armour)

## fast_attack/chaos_spawn.json

CHAOS SPAWN — Fast Attack

SOURCE: Chaos Space Marines ENG / Chaos Spawn.html (canonical datasheet)
───────────────────────────────────────────────────────────────────────────

PROFILE:
  No.  NAME         M    WS  BS  S  T  W  I  A  LD  SV  PTS
  1-4  Chaos Spawn  12"  4+   -  5  5  3  3  3  10  6+   22

EQUIPPED WITH: Every model is equipped with: Warped mutations.

WEAPONS:
  Warped mutations    -    Melee   SU   AP-2  D1  -

OPTIONS:
  • All models may receive a Mark of Chaos (per model): Khorne/Slaanesh/Nurgle +2pts,
    Tzeentch +6pts
  • Each model may be upgraded with one of: Grasping Pseudopods +5 / Toxic Haemorrhage +5 /
    Subcutaneous Armor +16

ABILITIES (verbatim):
  Move through cover, Terrifying(-1)
  Grasping Pseudopods: The model gains +2 Attacks.
  Toxic Haemorrhage: The model gains the "Poison(3+)" ability for all melee attacks.
  Subcutaneous Armor: The model gains a 5+ armor save.

UNIT TYPE: Monstrous Infantry
KEYWORDS: Cultist

ENGINE STATUS:
  ✓ stats, pts, weapon, options, abilities all match HTML verbatim
  ✓ option_groups: mark / "every" (each model picks one mutation upgrade)
  🟡 is_monster: false despite unit_type "Monstrous Infantry" — consistent with the
    codebase convention that `is_monster` flags "Monstrous Creature" specifically
    (core_rules: Monstrous Infantry "Acts like Infantry" with exceptions, Monstrous
    Creature is its own type — see Helbrute/Big Mutants which are also Monstrous
    Infantry with is_monster:false). NOT a bug — same pattern faction-wide.
  ✓ no armourKeyword / no veteran abilities (text confirms no armory/veteran lines)
  ✓ default_size: 1 / min_cost: 23

## fast_attack/foetid_bloat_drone.json

FOETID BLOAT-DRONE — Fast Attack

SOURCE: Chaos Space Marines ENG / Foetid Bloat-Drone.html (canonical datasheet)
───────────────────────────────────────────────────────────────────────────

PROFILE:
  No.  NAME                M    WS  BS  S  FRONT  SIDE  REAR  I  A  HP  PTS
  1-2  Foetid Bloat-Drone  12"   -  3+  5    11    11    10   4  1   2  136

EQUIPPED WITH: A Foetid Bloat-Drone is equipped with: Fleshmower; Plague probe.

WEAPONS:
  Fleshmower             -    Melee      S+2  AP-2  D1  AT(1), Deflagrate(5+), Poison(4+), Flurry(4)
  Heavy blight launcher 36"  Assault 1  S7   AP-3  D2  Armorbane, AT(1), Explosive, Poison(4+)
  Plague probe           -    Melee      SU   AP-2  D1  Poison(4+)
  Plague spewer          9"  Assault 4  S5   AP-1  D1  Flames, Poison(4+)

OPTIONS:
  • Can replace the Fleshmower with: Two plague spewers +41 / Heavy blight launcher +74
  • Has access to vehicle equipment from the Armory

ABILITIES (verbatim):
  Anti-Grav, Fast, Mark of Nurgle, Squadron
  Fleshmower: The model gains WS 3+ if it starts the game with this weapon.
  Pest explosion: If the Foetid Bloat-Drone is destroyed, it always explodes.
    The explosion range is 6".

UNIT TYPE: Vehicle
KEYWORDS: Death Guard

ENGINE STATUS:
  ✓ stats, pts, weapons, options, abilities all match HTML verbatim
  ✓ option_groups: "every" with replaces:["Fleshmower"] — each model in the 1-2 model
    squadron can independently swap its own Fleshmower (verified against owners' reference
    army list: a 2-drone squad totalling 354pts only reconciles if both swap, i.e. per-model,
    not a single unit-wide swap; was "one" before 2026-06-20, undercharging multi-model squads)
  ✓ locked_mark: "Nurgle" (from "Mark of Nurgle" ability — locked, no mark choice offered)
  🔴 has_armory_access: false — CORRECTED 2026-06-07 (was true). Verbatim text reads "Has access
    to vehicle equipment from the Armory" — a DISTINCT, narrower grant than "weapons and gear
    from the Armory" (the phrase used on CSM characters like Sorcerer/Dark Apostle). "Vehicle
    equipment" = the Vehicle Upgrades list ONLY, already shown automatically via is_vehicle +
    category:'vehicle' items (UnitCard.tsx hasFactionVehicleItems — independent of this flag);
    it does NOT grant the general armory (Daemon weapon/Daemonic armor/Familiar/etc.). The old
    `true` value wrongly opened that general armory tab. (This session's earlier SOURCE-pass
    note "vehicle equipment only" assumed the flag itself was vehicle-scoped — it isn't; fixed
    after cross-referencing engine code + verbatim text comparison across all CSM vehicles.)
  ✓ keywords: ["Death Guard", "Vehicle"] — "Vehicle" appended to the source's single
    "Death Guard" keyword, consistent with the vehicle-keyword convention used faction-wide
  ✓ is_vehicle: true / unit_type: "Vehicle" / default_size: 1 / min_cost: 136
  (Fixed mojibake in the old header comment: "â€”" → "—", encoding artefact from migration)

## fast_attack/greater_blight_drone.json

GREATER BLIGHT DRONE — Fast Attack

SOURCE: Chaos Space Marines 1.03, "Greater Blight Drone". Listed in the Index under Fast Attack.

  1-2  Greater Blight Drone  12"  3+ 3+ 6  F12 S11 R10  I4 A1 HP3   231 pts
  Equipped with: Bile maw, Blightreaper cannon, Plague probe.
  OPTIONS  • Can replace the Bile maw: - Maw cannon, +92 points
           • Has access to vehicle equipment from the Armory.
  ABILITIES  Anti-Grav, Fast, Mark of Nurgle, Squadron
             Pest explosion: If the Greater Blight Drone is destroyed, it always explodes.
             The explosion range is 6".
  UNIT TYPE  Vehicle      KEYWORDS  Death Guard

Modelled on the Foetid Bloat-Drone, the other Death Guard drone: locked to the Mark of Nurgle
and carrying the Death Guard / Vehicle keywords. `has_armory_access` is true for the vehicle
equipment its sheet grants — a non-character vehicle sees only that section.

## fast_attack/juggernaut_hellriders.json

JUGGERNAUT HELLRIDERS — Fast Attack

SOURCE: Chaos Space Marines ENG / Juggernaut Hellriders.html (canonical datasheet)
───────────────────────────────────────────────────────────────────────────

PROFILE:
  No.  NAME                M    WS  BS  S  T  W  I  A  LD  SV  PTS
  2-7  Hellrider           12"  3+  3+  5  5  4  4  4   8  3+  104
  1    Hellrider Champion  12"  3+  3+  5  5  4  4  4   8  3+  109

EQUIPPED WITH: Each model is equipped with: Chainaxe; Bolt pistol; Frag grenades;
  Krak grenades.

WEAPONS:
  Bolt pistol               12"  Pistol 1  S4   AP-1  D1  -
  Eviscerator                -   Melee     Sx2  AP-3  D2  AT(2), Armorbane, Slow(-2), Unwieldy
  Frag grenade               6"  Grenade 1 S4   AP 0  D1  Explosive
  Krak grenade               6"  Grenade 1 S6   AP-2  D1  -
  Chainaxe                   -   Melee     S+1  AP-1  D1  -
  Plasma pistol - Standard  12"  Pistol 1  S7   AP-3  D1  AT(1)
  Plasma pistol - Overcharged 12" Pistol 1 S8   AP-4  D2  AT(2), Overheat

OPTIONS:
  • For each 4 models, two "Berzerkers" may swap their Bolt pistols for:
    Plasma pistol +8 / Eviscerator +12
  • The Hellrider Champion has access to the armory
  • This unit may receive one veteran ability

  NOTE: the source text literally says "two Berzerkers may swap their Bolt pistols" —
  this unit is "Hellrider", not "Berzerker"; reads as a copy-paste artefact from the
  Khorne Berzerkers datasheet (same per_n(4,2) swap shape/options). Per FAQ #5 the
  canonical text stands as written; production JSON correctly applies the swap to
  THIS unit's own models (per_n constraint targets "this unit", not Berzerkers).

ABILITIES (verbatim):
  Berserk(5+), Blind Rage, Mark of Khorne

UNIT TYPE: Bike
KEYWORDS: World Eaters

ENGINE STATUS:
  ✓ stats, pts, weapons, options, abilities all match HTML verbatim
  ✓ option_groups: per_n(4, count_per_n:2) Bolt pistol swap (Plasma pistol/Eviscerator)
  ✓ champion_has_armory: true (matches "Hellrider Champion has access to the armory")
  ✓ has_veteran_abilities: true / veteran_max: 1 ("may receive one veteran ability")
  ✓ locked_mark: "Khorne" (from "Mark of Khorne" ability — locked, no mark choice offered)
  ✓ unit_type: "Bike" / keywords: ["World Eaters"]
  ✓ default_size: 3 (2 Hellriders + 1 Champion) / min_cost: 317 (2×104 + 109) ✓
  ✓ no armourKeyword (no Terminator/Cataphractii armour)

## fast_attack/myphitic_blight_hauler.json

MYPHITIC BLIGHT-HAULER — Fast Attack

SOURCE: Chaos Space Marines ENG / Myphitic Blight-Hauler.html (canonical datasheet)
───────────────────────────────────────────────────────────────────────────

PROFILE:
  No.  NAME                    M    WS  BS  S  FRONT  SIDE  REAR  I  A  HP  PTS
  1-2  Myphitic Blight-Hauler  12"  3+  3+  5    11    11    10   4  2   2  174

EQUIPPED WITH: A Myphitic Blight-Hauler is equipped with: Gnashing maw;
  Missile launcher; Multi-melta.

WEAPONS:
  Bile spurt                       9"  Assault 4  S6   AP-1  D1  Flames, Poison(4+)
  Gnashing maw                     -   Melee      S+1  AP-2  D1  -
  Multi-melta                     24"  Assault 1  S8   AP-5  D2  AT(2), Melta
  Missile launcher - Frag missile 48"  Heavy 1    S4   AP 0  D1  Explosive
  Missile launcher - Krak missile 48"  Heavy 1    S8   AP-3  D2  Anti-Air, AT(2)

OPTIONS:
  • May be equipped with Bile spurt for +19 points
  • Has access to vehicle equipment from the Armory

ABILITIES (verbatim):
  Mark of Nurgle, Squadron

UNIT TYPE: Vehicle
KEYWORDS: Death Guard

ENGINE STATUS:
  ✓ stats, pts, weapons, options, abilities all match HTML verbatim
  ✓ option_groups: "one" inline_pts:19 add (Bile spurt — additive, not a replace)
  🔴 has_armory_access: false — CORRECTED 2026-06-07 (was true). Verbatim text reads "Has access
    to vehicle equipment from the Armory" — a DISTINCT, narrower grant than "weapons and gear
    from the Armory" (the phrase used on CSM characters like Sorcerer/Dark Apostle). "Vehicle
    equipment" = the Vehicle Upgrades list ONLY, already shown automatically via is_vehicle +
    category:'vehicle' items (UnitCard.tsx hasFactionVehicleItems — independent of this flag);
    it does NOT grant the general armory (Daemon weapon/Daemonic armor/Familiar/etc.). The old
    `true` value wrongly opened that general armory tab. (This session's earlier SOURCE-pass
    note "vehicle equipment only" assumed the flag itself was vehicle-scoped — it isn't; fixed
    after cross-referencing engine code + verbatim text comparison across all CSM vehicles.)
  ✓ locked_mark: "Nurgle" (from "Mark of Nurgle" ability — locked, no mark choice offered)
  ✓ keywords: ["Death Guard", "Vehicle"] — "Vehicle" appended to the source's single
    "Death Guard" keyword, consistent with the vehicle-keyword convention used faction-wide
  ✓ is_vehicle: true / unit_type: "Vehicle" / default_size: 1 / min_cost: 174
  (Fixed mojibake in the old header comment: "â€”" → "—", encoding artefact from migration)

## fast_attack/raptors.json

RAPTORS — Fast Attack

SOURCE: Chaos Space Marines ENG / Raptors.html (canonical datasheet)
───────────────────────────────────────────────────────────────────────────

PROFILE:
  No.    NAME                       M    WS  BS  S  T  W  I  A  LD  SV  PTS
  4-14   Raptor                     12"  3+  3+  4  4  2  4  2   7  3+   43
  1      Raptor Champion            12"  3+  3+  4  4  2  4  2   7  3+   43
  *      Aspiring Raptor Champion   12"  3+  3+  4  4  2  4  2   8  3+   53  (variant, Champion upgrade)

EQUIPPED WITH: Each model is equipped with: Astartes Chainsword; Bolt pistol;
  Frag grenades; Krak grenades.

WEAPONS:
  Astartes Chainsword          -    Melee         SU   AP-1  D1  -
  Bolt pistol                 12"  Pistol 1      S4   AP-1  D1  -
  Flamer                       9"  Assault 4     S4   AP 0  D1  Flames
  Frag grenade                 6"  Grenade 1     S4   AP 0  D1  Explosive
  Krak grenade                 6"  Grenade 1     S6   AP-2  D1  -
  Meltagun                    12"  Assault 1     S8   AP-5  D1  AT(1), Melta
  Plasma gun - Standard       24"  Rapid Fire 1  S7   AP-3  D1  AT(1)
  Plasma gun - Overcharged    24"  Rapid Fire 1  S8   AP-4  D2  AT(2), Overheat
  Plasma pistol - Standard    12"  Pistol 1      S7   AP-3  D1  AT(1)
  Plasma pistol - Overcharged 12"  Pistol 1      S8   AP-4  D2  AT(2), Overheat

OPTIONS:
  • All models may receive a Mark of Chaos (per model): Khorne/Slaanesh/Nurgle +2pts,
    Tzeentch +5pts
  • Two Raptors may swap their Bolt pistols each: Plasma pistol +8
  • Alternatively, two Raptors may swap their Astartes chainswords AND Bolt pistols each:
    Flamer +0 / Meltagun +12 / Plasma gun +17
  • The Raptor Champion may be upgraded to an Aspiring Raptor Champion for +10pts and
    gains access to weapons and gear from the Armory
  • May have up to 2 veteran abilities

ABILITIES (verbatim):
  Deep strike

UNIT TYPE: Jump pack infantry
KEYWORDS: Chaos Space Marine

ENGINE STATUS:
  ✓ stats, pts, weapons all match HTML verbatim (Flamer/Meltagun ranges keep source's
    "9''"/"12''" double-prime artefact, consistent with prod JSON convention elsewhere)
  ✓ variant_models: Aspiring Raptor Champion (champion upgrade, variant_link)
  ✓ option_groups: mark (per-model) / fixed_max(2) Bolt-pistol swap (Plasma pistol only —
    matches; only ONE choice listed in source for this group, unlike Chaos Biker' 3-choice
    analogue) / fixed_max(2) chainsword+pistol swap / champion→variant "one" (inline_pts 10)
  ✓ unit_type: "Jump Pack Infantry" — title-cased from source's "Jump pack infantry"
    (global unit_type casing normalization, ki-jumppack-otherfactions-01 fix, v0.51)
  ✓ champion_has_armory: true / has_veteran_abilities: true / veteran_max: 2
  ✓ keywords: ["Chaos Space Marine"] / default_size: 5 (4 Raptors + 1 Champion) /
    min_cost: 215 (4×43 + 43) ✓
  ✓ no armourKeyword (no Terminator/Cataphractii armour)

## fast_attack/tzaangor_enlightened.json

TZAANGOR ENLIGHTENED — Fast Attack

SOURCE: Chaos Space Marines ENG / Tzaangor Enlightened.html (canonical datasheet)
───────────────────────────────────────────────────────────────────────────

PROFILE:
  No.  NAME                  M    WS  BS  S  T  W  I  A  LD  SV  PTS
  2-8  Tzaangor Enlightened  12"  3+  3+  4  4  2  4  3   8  5+   27
  1    Aviarch               12"  3+  3+  4  4  2  4  3   8  5+   27

EQUIPPED WITH: Every model is equipped with: Autopistol; Chainsword.

WEAPONS:
  Autopistol            12"  Pistol 1   S3   AP 0  D1  -
  Chainsword             -   Melee      SU   AP-1  D1  -
  Divining spear         -   Melee      S+1  AP-2  D1  Quick(+1)
  Fatecaster greatbow   24"  Assault 1  S+1  AP-2  D2  Armor piercing(5+), Suppression

OPTIONS:
  • Each model may swap their Autopistol AND Chainsword for:
    Divining spear +2 / Fatecaster greatbow +15

ABILITIES (verbatim):
  Mark of Tzeentch
  Sniper: Models equipped with a Fatecaster greatbow get a +1 bonus to their BS.

UNIT TYPE: Jetbike
KEYWORDS: Thousand Sons

ENGINE STATUS:
  ✓ stats, pts, weapons, options, abilities all match HTML verbatim
  ✓ option_groups: "every" (each model swaps both Autopistol+Chainsword for one of two
    melee/ranged alternatives — combo-replace modeled as a flat choice list, no `replaces`
    array since both source weapons drop together for either pick)
  ✓ locked_mark: "Tzeentch" (from "Mark of Tzeentch" ability — locked, no mark choice offered)
  ✓ unit_type: "Jetbike" / keywords: ["Thousand Sons"]
  ✓ no armourKeyword / no champion/veteran lines in text
  ✓ default_size: 3 (2 Enlightened + 1 Aviarch) / min_cost: 81 (2×27 + 27) ✓

## fast_attack/venomcrawler.json

VENOMCRAWLER — Fast Attack

SOURCE: Chaos Space Marines ENG / Venomcrawler.html (canonical datasheet)
───────────────────────────────────────────────────────────────────────────

PROFILE:
  No.  NAME          M    WS  BS  S  FRONT  SIDE  REAR  I  A  HP  PTS
  1-2  Venomcrawler  12"  3+  3+  5    11    11    10   4  3   2  156

EQUIPPED WITH: A Venomcrawler is equipped with: 2 Excruciator cannons, Soulflayer tendrils.

WEAPONS:
  Excruciator cannon   36"  Assault 2  S7   AP-3  D1  AT(1)
  Soulflayer tendrils   -   Melee      S+2  AP-2  D2  AT(1), Flurry(2)

OPTIONS:
  • May receive a Mark of Chaos: Khorne/Nurgle/Slaanesh/Tzeentch +10 points (each)
  • May have up to 2 veteran abilities
  • Has access to vehicle equipment from the Armory

ABILITIES (verbatim):
  Move through cover, Squadron
  Soul-shredding Explosion: If the Venomcrawler is destroyed, it explodes
  automatically with a 6" radius.

UNIT TYPE: Walker
KEYWORDS: Chaos Space Marine

ENGINE STATUS:
  ✓ stats, pts, weapons, options, abilities all match HTML verbatim
  ✓ option_groups: "mark" (flat unit-level pick — uniform +10pts per god, unlike the
    per-model mark groups on Infantry/Bike units; matches "May receive a Mark of Chaos"
    phrasing with no "per model"/"all models" qualifier)
  ✓ has_veteran_abilities: true / veteran_max: 2
  🔴 has_armory_access: false — CORRECTED 2026-06-07 (was true). Verbatim text reads "Has access
    to vehicle equipment from the Armory" — a DISTINCT, narrower grant than "weapons and gear
    from the Armory" (the phrase used on CSM characters like Sorcerer/Dark Apostle). "Vehicle
    equipment" = the Vehicle Upgrades list ONLY, already shown automatically via is_vehicle +
    category:'vehicle' items (UnitCard.tsx hasFactionVehicleItems — independent of this flag);
    it does NOT grant the general armory (Daemon weapon/Daemonic armor/Familiar/etc.). The old
    `true` value wrongly opened that general armory tab. (This session's earlier SOURCE-pass
    note "vehicle equipment only" assumed the flag itself was vehicle-scoped — it isn't; fixed
    after cross-referencing engine code + verbatim text comparison across all CSM vehicles.)
  ✓ keywords: ["Chaos Space Marine", "Vehicle"] — "Vehicle" appended to the source's
    single "Chaos Space Marine" keyword, consistent with the vehicle-keyword convention
  ✓ is_vehicle: true / unit_type: "Walker" / default_size: 1 / min_cost: 156
  (Fixed mojibake in the old header comment: "â€”" → "—", encoding artefact from migration)

## fast_attack/warptalons.json

WARPTALONS — Fast Attack

SOURCE: Chaos Space Marines ENG / Warptalons.html (canonical datasheet)
───────────────────────────────────────────────────────────────────────────

PROFILE:
  No.  NAME                  M    WS  BS  S  T  W  I  A  LD  SV  PTS
  4-9  Warp Talon            12"  3+  3+  4  4  2  4  2   8  3+   63
  1    Warp Talon Champion   12"  3+  3+  4  4  2  4  2   8  3+   68

EQUIPPED WITH: Each model is equipped with: Warpclaws; Frag grenades; Krak grenades.

WEAPONS:
  Frag grenade   6"  Grenade 1  S4  AP 0  D1  Explosive
  Krak grenade   6"  Grenade 1  S6  AP-2  D1  -
  Warpclaws       -  Melee      SU  AP-3  D1  Flurry(2), Shred, Unwieldy

OPTIONS:
  • All models may receive a Mark of Chaos (per model): Khorne/Slaanesh/Nurgle +2pts,
    Tzeentch +5pts
  • The Warp Talon Champion has access to weapons and gear from the Armory
  • May have up to 2 veteran abilities

ABILITIES (verbatim):
  Deep strike, Daemon
  Daemonic charge: Enemy units suffer an additional -1 to hit penalty during
  Defensive fire.

UNIT TYPE: Jump pack infantry
KEYWORDS: Chaos Space Marine

ENGINE STATUS:
  ✓ stats, pts, weapons, options, abilities all match HTML verbatim
  ✓ option_groups: mark (per-model)
  ✓ champion_has_armory: true (matches "Warp Talon Champion has access to weapons and
    gear from the Armory" — full armory, not vehicle-only)
  ✓ has_veteran_abilities: true / veteran_max: 2
  ✓ unit_type: "Jump Pack Infantry" — title-cased from source's "Jump pack infantry"
    (global unit_type casing normalization, ki-jumppack-otherfactions-01 fix, v0.51)
  ✓ keywords: ["Chaos Space Marine"] / no armourKeyword
  ✓ default_size: 5 (4 Warp Talons + 1 Champion) / min_cost: 320 (4×63 + 68) ✓

## flyers/heldrake.json

HELDRAKE — Flyers

SOURCE: Chaos Space Marines ENG / Heldrake.html (canonical datasheet)
───────────────────────────────────────────────────────────────────────────

PROFILE:
  No.  NAME      M    WS  BS  S  FRONT  SIDE  REAR  I  A  HP  PTS
  1    Heldrake  12"  3+  3+  6    12    12    10   4  3   3  240

EQUIPPED WITH: A Heldrake is a single model and equipped with: Bale flamer; Heldrake claws.

WEAPONS:
  Baleflamer        12"  Assault 6  S6   AP-2  D1  Flames
  Heldrake claws     -   Melee      S+1  AP-3  D2  AT(1), Anti-air, Armorbane
  Hades autocannon  36"  Heavy 4    S8   AP-2  D1  AT(2), Suppression

OPTIONS:
  • May receive a Mark of Chaos: Khorne/Nurgle/Slaanesh/Tzeentch +10 points (each)
  • May replace its Baleflamer with: Hades autocannon +44
  • May have up to 2 veteran abilities
  • Has access to vehicle equipment from the Armory

ABILITIES (verbatim):
  Anti-Grav, Fast, Hover mode
  Vector strike: Each enemy unit which is passed by this model suffers 1D6
  automatic hits with the model's melee weapon.

UNIT TYPE: Flyer, Vehicle
KEYWORDS: Chaos Space Marine

ENGINE STATUS:
  ✓ stats, pts, weapons, options, abilities all match HTML verbatim (header text says
    "Bale flamer" with a space; the weapon-table row spells it "Baleflamer" — prod JSON
    follows the table-row spelling, the canonical weapon profile name)
  ✓ option_groups: "mark" (flat unit-level pick, +10pts uniform per god — single-model
    unit, no "per model"/"all models" qualifier) / "one" structured replace
    (replaces:["Baleflamer"], Hades autocannon +44)
  ✓ has_veteran_abilities: true / veteran_max: 2
  🔴 has_armory_access: false — CORRECTED 2026-06-07 (was true). Verbatim text reads "Has access
    to vehicle equipment from the Armory" — a DISTINCT, narrower grant than "weapons and gear
    from the Armory" (the phrase used on CSM characters like Sorcerer/Dark Apostle). "Vehicle
    equipment" = the Vehicle Upgrades list ONLY, already shown automatically via is_vehicle +
    category:'vehicle' items (UnitCard.tsx hasFactionVehicleItems — independent of this flag);
    it does NOT grant the general armory (Daemon weapon/Daemonic armor/Familiar/etc.). The old
    `true` value wrongly opened that general armory tab. (This session's earlier SOURCE-pass
    note "vehicle equipment only" assumed the flag itself was vehicle-scoped — it isn't; fixed
    after cross-referencing engine code + verbatim text comparison across all CSM vehicles.)
  ✓ unit_type: "Flyer, Vehicle" / keywords: ["Chaos Space Marine", "Vehicle"] —
    "Vehicle" appended to the source's single "Chaos Space Marine" keyword
  ✓ is_vehicle: true / default_size: 1 / min_cost: 240
  (Fixed mojibake in the old header comment: "â€”" → "—", encoding artefact from migration)

## fortifications/miasmic_malignifier.json

MIASMIC MALIGNIFIER — Fortifications

SOURCE: Chaos Space Marines ENG / Miasmic Malignifier.html (canonical datasheet)
───────────────────────────────────────────────────────────────────────────

PROFILE:
  No.  NAME                 M   WS  BS  S  FRONT  SIDE  REAR  I  A  HP  PTS
  1    Miasmic Malignifier  -    -  6+  6    12    12    12   -  -   3  125

EQUIPPED WITH: A Miasmic Malignifier is equipped with: Noxious stink.

WEAPONS:
  Noxious stink   6"  Assault 4  S4  AP 0  D1  Flames, Poison(4+)

OPTIONS: -  (none — source row is "-")

ABILITIES (verbatim):
  Infiltrator, Mark of Nurgle
  Unmanned: A Miasmic Malignifier can't contest or capture mission objectives.
  Pest explosion: If the model is destroyed, it always explodes. The explosion
  range is 6".
  Putrescent Fog: At the start of each activation, the model can create a Putrescent
  Fog with a "Stand & Shoot" command. To do so, place a Putrescent Fog marker
  (a 3" radius circle) within 7" of any friendly unit bearing the Mark of Nurgle.
  All enemy units treat the zone as difficult terrain and must take one Toughness
  test per model if they touch or move over the circle during their activation.
  For each failed test, the unit suffers one Mortal Wound.

UNIT TYPE: Vehicle
KEYWORDS: Death Guard, Fortification

ENGINE STATUS:
  ✓ stats (M/WS/I/A all "-" — static emplacement, no melee/movement profile),
    pts, weapons, abilities all match HTML verbatim
  ✓ option_groups: [] (source OPTIONS row is literal "-" — no purchasable options)
  ✓ has_veteran_abilities: false / has_armory_access: false (no such lines in text)
  ✓ locked_mark: "Nurgle" — sourced from the "Mark of Nurgle" entry inside the
    ABILITIES row (baked-in, not a purchasable option — same convention as
    Plagueburst Crawler's locked_mark)
  ✓ keywords: ["Death Guard", "Fortification", "Vehicle"] — "Vehicle" appended to
    the source's listed "Death Guard, Fortification" keywords, consistent with
    the vehicle-keyword convention
  ✓ is_vehicle: true / unit_type: "Vehicle" / default_size: 1 / min_cost: 125
  🟡 Unmanned/Pest explosion/Putrescent Fog all text-only special rules — no
    dedicated engine primitives (objective-denial, explosion-on-death, terrain-
    marker-creation); consistent with the established "verbatim text, no mechanical
    simulation" treatment seen across CSM vehicles and fortifications
  (Fixed mojibake in the old header comment: "â€”" → "—", encoding artefact from migration)

## fortifications/noctilith_crown.json

NOCTILITH CROWN — Fortifications

SOURCE: Chaos Space Marines ENG / Noctilith Crown.html (canonical datasheet)
───────────────────────────────────────────────────────────────────────────

PROFILE:
  No.  NAME             M   WS  BS  S  FRONT  SIDE  REAR  I  A  HP  PTS
  1    Noctilith Crown  -    -  6+  6    11    11    11   -  -   2  100

EQUIPPED WITH: A Noctilith Crown is equipped with: Lashing warp energies.

WEAPONS:
  Lashing warp energies  12"  Assault 4  S5  AP 0  D1  Flames

OPTIONS: -  (none — source row is "-")

ABILITIES (verbatim):
  Infiltrator
  Unholy Conduit: A friendly unit starting its activation within 12" of the
  Noctilith Crown can attempt to pray to the Dark Gods. Roll 2D6. On a roll of 6+,
  the unit gains the effect of a prayer from the sheet "Prayers to the Dark Gods".
  On any roll below 6 it gets hit with the Lashing warp energies profile.
  Unmanned: A Noctilith Crown can't contest or capture mission objectives.
  Warp explosion: If the model is destroyed, it always explodes. The explosion
  range is 6".

UNIT TYPE: Vehicle
KEYWORDS: Fortification

ENGINE STATUS:
  ✓ stats (M/WS/I/A all "-" — static emplacement, same convention as Miasmic
    Malignifier), pts, weapons, abilities all match HTML verbatim
  ✓ option_groups: [] (source OPTIONS row is literal "-" — no purchasable options)
  ✓ has_veteran_abilities: false / has_armory_access: false / locked_mark: null
    (no Mark line in ABILITIES, unlike the Death Guard-keyword Miasmic Malignifier
    — this is a faction-neutral Fortification)
  ✓ keywords: ["Fortification", "Vehicle"] — "Vehicle" appended to the source's
    single "Fortification" keyword, consistent with the vehicle-keyword convention
  ✓ is_vehicle: true / unit_type: "Vehicle" / default_size: 1 / min_cost: 100
  🟡 Unholy Conduit/Unmanned/Warp explosion all text-only special rules — no
    dedicated engine primitives (prayer-roll-on-proximity, objective-denial,
    explosion-on-death); consistent with the established "verbatim text, no
    mechanical simulation" treatment seen on Miasmic Malignifier and CSM vehicles
  (Fixed mojibake in the old header comment: "â€”" → "—", encoding artefact from migration)

## heavy_support/blood_slaughterer.json

BLOOD SLAUGHTERER — Heavy Support

SOURCE: Chaos Space Marines 1.02.ods / "Blood Slaughterer" (added CSM 1.02, 2026-07-24).
Walker, 1-2 models (Squadron), 195 pts. Baked-in Mark of Khorne. Vehicle equipment only.

## heavy_support/chaos_land_raider.json

CHAOS LAND RAIDER — Heavy Support

SOURCE: Chaos Space Marines ENG / Chaos Land Raider.html (canonical datasheet)
───────────────────────────────────────────────────────────────────────────

PROFILE:
  No.  NAME               M    WS  BS  S  FRONT  SIDE  REAR  I  A  HP  PTS
  1    Chaos Land Raider  12"   -  3+  7    14    14    14   4  1   4  558

EQUIPPED WITH: A Chaos Land Raider is equipped with: Twin heavy bolter; 2 Twin Lascannons.

WEAPONS:
  Combi-bolter            24"  Rapid Fire 2  S4   AP-1  D1  -
  Combi-flamer - Bolter   24"  Rapid Fire 1  S4   AP-1  D1  -
  Combi-flamer - Flamer    9"  Assault 4     S4   AP 0  D1  Flames
  Combi-melta - Bolter    24"  Rapid Fire 1  S4   AP-1  D1  -
  Combi-melta - Melta     12"  Assault 1     S8   AP-5  D1  AT(1), Melta
  Havoc launcher          48"  Heavy 1       S5   AP-1  D1  Anti-Air, Explosive
  Twin heavy bolter       36"  Rapid Fire 4  S5   AP-2  D1  -
  Twin lascannon          48"  Heavy 2       S9   AP-4  D3  AT(3)

OPTIONS:
  • May receive a Mark of Chaos: Khorne/Nurgle/Slaanesh/Tzeentch +10 points (each)
  • May be equipped with one of the following: Combi-flamer +8 / Combi-bolter +11 /
    Combi-melta +18
  • May be equipped with a Havoc launcher for +29pts
  • May have up to 2 veteran abilities
  • Has access to vehicle equipment from the Armory

ABILITIES (verbatim):
  Assault Ramp: Passengers may perform a Charge command, even if the vehicle
  moved up to 12".
  Transport: This model has a transport capacity of 10 infantry models.

UNIT TYPE: Vehicle
KEYWORDS: Chaos Space Marine

ENGINE STATUS:
  ✓ stats, pts, weapons, options, abilities all match HTML verbatim (combi-weapon
    sub-profiles correctly split into separate "<combi> - <profile>" weapon entries,
    same convention as Chaos Biker)
  ✓ option_groups: "mark" (flat unit-level pick, +10pts uniform per god) / "one"
    additive combi-weapon pick (Combi-flamer/-bolter/-melta — bonus weapon, no
    `replaces`, matches "May be equipped with" not "may swap") / "one" inline_pts:29
    Havoc launcher add
  ✓ has_veteran_abilities: true / veteran_max: 2
  🔴 has_armory_access: false — CORRECTED 2026-06-07 (was true). Verbatim text reads "Has access
    to vehicle equipment from the Armory" — a DISTINCT, narrower grant than "weapons and gear
    from the Armory" (the phrase used on CSM characters like Sorcerer/Dark Apostle). "Vehicle
    equipment" = the Vehicle Upgrades list ONLY, already shown automatically via is_vehicle +
    category:'vehicle' items (UnitCard.tsx hasFactionVehicleItems — independent of this flag);
    it does NOT grant the general armory (Daemon weapon/Daemonic armor/Familiar/etc.). The old
    `true` value wrongly opened that general armory tab. (This session's earlier SOURCE-pass
    note "vehicle equipment only" assumed the flag itself was vehicle-scoped — it isn't; fixed
    after cross-referencing engine code + verbatim text comparison across all CSM vehicles.)
  ✓ Transport (capacity 10 infantry) + Assault Ramp text-only (no transport-capacity
    primitive in engine — same class of gap as other transports, e.g. Chaos Rhino)
  ✓ is_vehicle: true / unit_type: "Vehicle" / default_size: 1 / min_cost: 558
  (Fixed mojibake in the old header comment: "â€”" → "—", encoding artefact from migration)

## heavy_support/chaos_predator.json

CHAOS PREDATOR — Heavy Support

SOURCE: Chaos Space Marines ENG / Chaos Predator.html (canonical datasheet)
───────────────────────────────────────────────────────────────────────────

PROFILE:
  No.  NAME      M    WS  BS  S  FRONT  SIDE  REAR  I  A  HP  PTS
  1    Predator  12"   -  3+  6    13    11    10   4  1   3  232

EQUIPPED WITH: A Predator is equipped with: Predator autocannon.

WEAPONS:
  Combi-bolter            24"  Rapid Fire 2  S4   AP-1  D1  -
  Combi-flamer - Bolter   24"  Rapid Fire 1  S4   AP-1  D1  -
  Combi-flamer - Flamer    9"  Assault 4     S4   AP 0  D1  Flames
  Combi-melta - Bolter    24"  Rapid Fire 1  S4   AP-1  D1  -
  Combi-melta - Melta     12"  Assault 1     S8   AP-5  D1  AT(1), Melta
  Havoc launcher          48"  Heavy 1       S5   AP-1  D1  Anti-Air, Explosive
  Heavy bolter            36"  Rapid Fire 2  S5   AP-2  D1  -
  Lascannon               48"  Heavy 1       S9   AP-4  D3  AT(3)
  Predator autocannon     48"  Heavy 3       S7   AP-3  D2  Armor piercing(5+), AT(1)
  Twin entropy cannon - Focused entropy  48"  Heavy 2  S8  AP-5  D3  AT(3)
  Twin entropy cannon - Entropic burst   48"  Heavy 2  S5  AP-1  D1  Explosive, Poison(4+)
  Twin lascannon          48"  Heavy 2       S9   AP-4  D3  AT(3)

OPTIONS:
  • May receive a Mark of Chaos: Khorne/Nurgle/Slaanesh/Tzeentch +10 points (each)
  • May replace the Predator autocannon: Twin entropy cannon (Nurgle only) +50 /
    Twin lascannon +50
  • May be equipped with one of the following: two Heavy bolters +54 / two lascannons +138
  • May be equipped with one of the following: Combi-flamer +8 / Combi-bolter +11 /
    Combi-melta +18
  • May be equipped with a Havoc launcher for +29pts
  • May have up to 2 veteran abilities
  • Has access to vehicle equipment from the Armory

ABILITIES (verbatim): -

UNIT TYPE: Vehicle
KEYWORDS: Chaos Space Marine

ENGINE STATUS:
  ✓ stats, pts, weapons, options match HTML verbatim (combi-weapon and twin entropy
    cannon sub-profiles correctly split into separate "<weapon> - <profile>" entries,
    same convention as Chaos Land Raider/Chaos Biker)
  ✓ option_groups: "mark" (flat unit-level pick, +10pts uniform per god) / "one"
    structured replace (replaces:["Predator autocannon"], Twin entropy cannon
    [Nurgle only — text-only restriction, no enforced gate] / Twin lascannon, both +50) /
    "one" additive sponson pick (two Heavy bolters +54 / two lascannons +138) / "one"
    additive combi-weapon pick (+8/+11/+18) / "one" inline_pts:29 Havoc launcher add
  ✓ has_veteran_abilities: true / veteran_max: 2
  🔴 has_armory_access: false — CORRECTED 2026-06-07 (was true). Verbatim text reads "Has access
    to vehicle equipment from the Armory" — a DISTINCT, narrower grant than "weapons and gear
    from the Armory" (the phrase used on CSM characters like Sorcerer/Dark Apostle). "Vehicle
    equipment" = the Vehicle Upgrades list ONLY, already shown automatically via is_vehicle +
    category:'vehicle' items (UnitCard.tsx hasFactionVehicleItems — independent of this flag);
    it does NOT grant the general armory (Daemon weapon/Daemonic armor/Familiar/etc.). The old
    `true` value wrongly opened that general armory tab. (This session's earlier SOURCE-pass
    note "vehicle equipment only" assumed the flag itself was vehicle-scoped — it isn't; fixed
    after cross-referencing engine code + verbatim text comparison across all CSM vehicles.)
  ✓ abilities: [] (source ABILITIES row is "-" — no abilities listed)
  ✓ keywords: ["Chaos Space Marine", "Vehicle"] — "Vehicle" appended to the source's
    single "Chaos Space Marine" keyword, consistent with the vehicle-keyword convention
  ✓ is_vehicle: true / unit_type: "Vehicle" / default_size: 1 / min_cost: 232
  🟡 "Twin entropy cannon (Nurgle only)" restriction is text-only in source — engine
    does not enforce a Mark-of-Nurgle prerequisite for this replace choice (same class
    of soft-restriction gap seen elsewhere; not a data bug, the choice/points are correct)
  (Fixed mojibake in the old header comment: "â€”" → "—", encoding artefact from migration)

## heavy_support/chaos_vindicator.json

CHAOS VINDICATOR — Heavy Support

SOURCE: Chaos Space Marines ENG / Chaos Vindicator.html (canonical datasheet)
───────────────────────────────────────────────────────────────────────────

PROFILE:
  No.  NAME              M    WS  BS  S  FRONT  SIDE  REAR  I  A  HP  PTS
  1    Chaos Vindicator  12"   -  3+  6    13    11    10   4  1   3  373

EQUIPPED WITH: A Chaos Vindicator is equipped with: Demolisher cannon.

WEAPONS:
  Combi-bolter            24"  Rapid Fire 2  S4   AP-1  D1  -
  Combi-flamer - Bolter   24"  Rapid Fire 1  S4   AP-1  D1  -
  Combi-flamer - Flamer    9"  Assault 4     S4   AP 0  D1  Flames
  Combi-melta - Bolter    24"  Rapid Fire 1  S4   AP-1  D1  -
  Combi-melta - Melta     12"  Assault 1     S8   AP-5  D1  AT(1), Melta
  Demolisher cannon       24"  Heavy 1       S10  AP-4  D3  AT(4), Barrage, Tank hunter
  Havoc launcher          48"  Heavy 1       S5   AP-1  D1  Anti-Air, Explosive

OPTIONS:
  • May receive a Mark of Chaos: Khorne/Nurgle/Slaanesh/Tzeentch +10 points (each)
  • May be equipped with one of the following: Combi-flamer +8 / Combi-bolter +11 /
    Combi-melta +18
  • May be equipped with a Havoc launcher for +29pts
  • May be equipped with a Siege shield for +15 points
  • May have up to 2 veteran abilities
  • Has access to vehicle equipment from the Armory

ABILITIES (verbatim):
  Siege shield: The model automatically passes tests for difficult terrain and is
  not slowed down by it. Additionally, attacks from the front always treat the
  Vindicator as being in cover.

UNIT TYPE: Vehicle
KEYWORDS: Chaos Space Marine

ENGINE STATUS:
  ✓ stats, pts, weapons, options, abilities all match HTML verbatim (combi-weapon
    sub-profiles correctly split, same convention as Chaos Predator/Land Raider)
  ✓ option_groups: "mark" (flat unit-level pick, +10pts uniform per god) / "one"
    additive combi-weapon pick (+8/+11/+18) / "one" inline_pts:29 Havoc launcher add /
    "one" inline_pts:15 Siege shield add
  ✓ has_veteran_abilities: true / veteran_max: 2
  🔴 has_armory_access: false — CORRECTED 2026-06-07 (was true). Verbatim text reads "Has access
    to vehicle equipment from the Armory" — a DISTINCT, narrower grant than "weapons and gear
    from the Armory" (the phrase used on CSM characters like Sorcerer/Dark Apostle). "Vehicle
    equipment" = the Vehicle Upgrades list ONLY, already shown automatically via is_vehicle +
    category:'vehicle' items (UnitCard.tsx hasFactionVehicleItems — independent of this flag);
    it does NOT grant the general armory (Daemon weapon/Daemonic armor/Familiar/etc.). The old
    `true` value wrongly opened that general armory tab. (This session's earlier SOURCE-pass
    note "vehicle equipment only" assumed the flag itself was vehicle-scoped — it isn't; fixed
    after cross-referencing engine code + verbatim text comparison across all CSM vehicles.)
  🟡 "Siege shield" appears BOTH as a purchasable +15pt option AND as a verbatim
    ABILITIES entry describing what it does — prod JSON correctly lists it in
    `abilities` (canonical rules text describing the wargear's effect) while ALSO
    gating it behind the option pick; this is the source's own structure, not a bug
  ✓ keywords: ["Chaos Space Marine", "Vehicle"] — "Vehicle" appended to the source's
    single "Chaos Space Marine" keyword, consistent with the vehicle-keyword convention
  ✓ is_vehicle: true / unit_type: "Vehicle" / default_size: 1 / min_cost: 373
  (Fixed mojibake in the old header comment: "â€”" → "—", encoding artefact from migration)

## heavy_support/decimator.json

DECIMATOR — Heavy Support

SOURCE: Chaos Space Marines 1.02.ods / "Decimator" (added CSM 1.02, 2026-07-24).
Walker, 1, 182 pts. Base: 2 Siege claws with Heavy flamers. Marks +10 each. Vehicle equipment.

## heavy_support/defiler.json

DEFILER — Heavy Support

SOURCE: Chaos Space Marines 1.02.ods / "Defiler" — REWORKED in CSM 1.02 (2026-07-24).
───────────────────────────────────────────────────────────────────────────
Base cost 419 -> 293. Base loadout changed from "Battle cannon; Defiler claws; Heavy flamer;
Reaper autocannon" to "Defiler claws; Ectoplasma destructor; 2 Power scourges" — the heavy
guns are now paid for as options instead of being included.

PROFILE (unchanged):
  1  Defiler  6"  3+  3+  S6  FRONT 12  SIDE 12  REAR 10  I4  A3  HP3  — 293 pts

EQUIPPED WITH: Defiler claws; Ectoplasma destructor; 2 Power scourges.

OPTIONS (verbatim 1.02):
  • May receive a Mark of Chaos: K/N/S/T +10 each
  • May replace the Ectoplasma destructor: Battle cannon +115
  • May replace one Power scourge: Reaper autocannon +14 / Twin heavy bolter +19 /
    Missile launcher +24 / Twin lascannon +121
  • May replace the other Power scourge: Heavy baleflamer +9 / Twin heavy flamer +9 /
    Havoc launcher +13 / Reaper autocannon +14 / Twin lascannon +121
  • May be equipped with one of: Combi-flamer +8 / Combi-bolter +11 / Combi-melta +18 /
    Two Excruciator cannons +27 / Two Magma cutters +34
  • May have up to 2 veteran abilities · Has access to vehicle equipment from the Armory

ABILITIES: — (none)
UNIT TYPE: Walker · KEYWORDS: Chaos Space Marine

ENGINE NOTE: the .ods writes "AP(2)" in the ABILITIES column of Battle cannon and Ectoplasma
destructor; that is the author's long-standing typo for the Armour-Tear rule, recorded here as
AT(2) to match every other datasheet (same call as the v1.54 AP(x)->AT(x) sweep).
The two Power scourge swap groups are separate "one" groups so each scourge can be swapped
independently, exactly as the datasheet words it.

## heavy_support/forgefiend.json

FORGEFIEND — Heavy Support

SOURCE: Chaos Space Marines ENG / Forgefiend.html (canonical datasheet)
───────────────────────────────────────────────────────────────────────────

PROFILE:
  No.  NAME        M    WS  BS  S  FRONT  SIDE  REAR  I  A  HP  PTS
  1    Forgefiend  6"   3+  3+  6    12    12    10   3  1   3  269

EQUIPPED WITH: A Forgefiend is equipped with: two Hades autocannons.

WEAPONS:
  Ectoplasma gun     36"  Heavy 2  S8  AP-4  D2  AT(2)
  Hades autocannon   36"  Heavy 4  S8  AP-2  D1  AT(2), Suppression

OPTIONS:
  • May receive a Mark of Chaos: Khorne/Nurgle/Slaanesh/Tzeentch +10 points (each)
  • May replace the two Hades autocannon: two Ectoplasma guns +21
  • May be equipped with an additional Ectoplasma gun for +75pts
  • May have up to 2 veteran abilities
  • Has access to vehicle equipment from the Armory

ABILITIES (verbatim): -

UNIT TYPE: Walker
KEYWORDS: Chaos Space Marine

ENGINE STATUS:
  ✓ stats, pts, weapons, options, abilities all match HTML verbatim
  ✓ option_groups: "mark" (flat unit-level pick, +10pts uniform per god) / "one"
    structured replace (replaces:["Hades autocannon"], two Ectoplasma guns +21 —
    single choice list matching "May replace the two Hades autocannon") / "one"
    inline_pts:75 additional Ectoplasma gun add
  ✓ has_veteran_abilities: true / veteran_max: 2
  🔴 has_armory_access: false — CORRECTED 2026-06-07 (was true). Verbatim text reads "Has access
    to vehicle equipment from the Armory" — a DISTINCT, narrower grant than "weapons and gear
    from the Armory" (the phrase used on CSM characters like Sorcerer/Dark Apostle). "Vehicle
    equipment" = the Vehicle Upgrades list ONLY, already shown automatically via is_vehicle +
    category:'vehicle' items (UnitCard.tsx hasFactionVehicleItems — independent of this flag);
    it does NOT grant the general armory (Daemon weapon/Daemonic armor/Familiar/etc.). The old
    `true` value wrongly opened that general armory tab. (This session's earlier SOURCE-pass
    note "vehicle equipment only" assumed the flag itself was vehicle-scoped — it isn't; fixed
    after cross-referencing engine code + verbatim text comparison across all CSM vehicles.)
  ✓ abilities: [] (source ABILITIES row is "-" — no abilities listed)
  ✓ keywords: ["Chaos Space Marine", "Vehicle"] — "Vehicle" appended to the source's
    single "Chaos Space Marine" keyword, consistent with the vehicle-keyword convention
  ✓ is_vehicle: true / unit_type: "Walker" / default_size: 1 / min_cost: 269
  (Fixed mojibake in the old header comment: "â€”" → "—", encoding artefact from migration)

## heavy_support/havocs.json

HAVOCS — Heavy Support

SOURCE: Chaos Space Marines ENG / Havocs.html (canonical datasheet)
───────────────────────────────────────────────────────────────────────────

PROFILE:
  No.    NAME                     M   WS  BS  S  T  W  I  A  LD  SV  PTS
  5-10   Chaos Havoc              6"  3+  3+  4  4  2  4  2   7  3+   34
  *      Aspiring Havoc Champion  6"  3+  3+  4  4  2  4  2   8  3+   44

EQUIPPED WITH: Every model is equipped with: Bolt pistol; Bolter; Frag grenade; Krak grenade.

WEAPONS:
  Autocannon                       48"  Heavy 2       S7   AP-2  D1   AT(1)
  Bolt pistol                      12"  Pistol 1      S4   AP-1  D1   -
  Bolter                           24"  Rapid Fire 1  S4   AP-1  D1   -
  Frag grenade                      6"  Grenade 1     S4   AP 0  D1   Explosive
  Heavy bolter                     36"  Rapid Fire 2  S5   AP-2  D1   -
  Krak grenade                      6"  Grenade 1     S6   AP-2  D1   -
  Lascannon                        48''  Heavy 1      S9   AP-4  D3   AT(2)
  Missile launcher - Frag missile  48"  Heavy 1       S4   AP 0  D1   Explosive
  Missile launcher - Krak missile  48"  Heavy 1       S8   AP-3  D2   AT(1), Anti-air
  Reaper chaincannon               24"  Assault 4     S5   AP-1  D-1  Suppression

OPTIONS:
  • All models may receive a Mark of Chaos (per model): Khorne/Slaanesh/Nurgle +2pts,
    Tzeentch +5pts
  • Up to four Chaos Havocs may replace their Bolter each: Heavy bolter +13 /
    Reaper chaincannon +19 / Autocannon +21 / Missile launcher +35 / Lascannon +64
  • One model may be upgraded to an Aspiring Havoc Champion for +10pts and gains
    access to weapons and gear from the Armory
  • May have up to 2 veteran abilities

ABILITIES (verbatim): Unyielding

UNIT TYPE: Infantry
KEYWORDS: Chaos Space Marine

ENGINE STATUS:
  ✓ stats, pts, weapons, options, abilities all match HTML verbatim (Missile launcher
    sub-profiles correctly split into separate "<weapon> - <profile>" entries)
  ✓ option_groups: mark (per-model) / fixed_max(4) Bolter swap / "one" champion upgrade
    (variant_link: "Aspiring Havoc Champion", inline_pts:10)
  ✓ has_veteran_abilities: true / veteran_max: 2
  ✓ unit_type: "Infantry" / keywords: ["Chaos Space Marine"]
  ✓ default_size: 5 / min_cost: 170 (5×34)
  🟡 Lascannon weapon entry keeps the source's literal "48''" (double straight-quote,
    a Sheets typo for 48") rather than "48\"" — prod JSON copies the source artefact
    verbatim (not a data-entry bug; cosmetic, matches HTML exactly)
  ✓ champion_has_armory: false — VERIFIED NOT a bug 2026-06-07 (was flagged as candidate
    ki-havocs-championarmory-01). The OPTIONS line "gains access to weapons and gear from
    the Armory" (general-access phrase, correctly NOT "vehicle equipment" — see
    ki-csm-vehiclearmory-01) IS granted, but through a different, more precise mechanism:
    showArmory = has_armory_access || champion_has_armory || variantActive (UnitCard.tsx:145),
    and variantActive = !!getActiveVariant(item, unit) (engine/points.ts:17-26) fires exactly
    when the user toggles the "One model may be upgraded to an Aspiring Havoc Champion"
    variant_link option (__inline qty). So the armory tab opens precisely when — and only
    when — the champion is actually taken, matching the canonical text better than a blanket
    champion_has_armory:true would (that flag would show armory access to the whole unit
    even with no champion upgraded). Confirmed correct as-is; candidate KI closed, no fix
    needed. (Distinct from Warptalons/Chosen, whose champion options are NOT variant_link-
    gated — those genuinely need champion_has_armory:true.)

## heavy_support/maulerfiend.json

MAULERFIEND — Heavy Support

SOURCE: Chaos Space Marines ENG / Maulerfiend.html (canonical datasheet)
───────────────────────────────────────────────────────────────────────────

PROFILE:
  No.  NAME         M    WS  BS  S  FRONT  SIDE  REAR  I  A  HP  PTS
  1    Maulerfiend  6"   3+  3+  6    12    12    11   4  5   3  187

EQUIPPED WITH: A Maulerfiend is a single model and equipped with: Lasher tendrils;
  Maulerfiend fists.

WEAPONS:
  Lasher tendrils    -   Melee     SU   AP-2  D1  Flurry(4)
  Magma cutter      12"  Pistol 1  S8   AP-5  D2  AT(2), Melta
  Maulerfiend fists  -   Melee     Sx2  AP-3  D2  AT(2)

OPTIONS:
  • May receive a Mark of Chaos: Khorne/Nurgle/Slaanesh/Tzeentch +10 points (each)
  • May replace its Lasher tendrils: two Magma cutters +17
  • Has access to vehicle equipment from the Armory
  • May have up to 2 veteran abilities

ABILITIES (verbatim):
  Move through cover
  Charge: The unit has a 12" Charge move.

UNIT TYPE: Walker
KEYWORDS: Chaos Space Marine

ENGINE STATUS:
  ✓ stats, pts, weapons, options, abilities all match HTML verbatim
  ✓ option_groups: "mark" (flat unit-level pick, +10pts uniform per god) / "one"
    structured replace (replaces:["Lasher tendrils"], two Magma cutters +17 — single
    choice list matching "May replace its Lasher tendrils")
  ✓ has_veteran_abilities: true / veteran_max: 2
  🔴 has_armory_access: false — CORRECTED 2026-06-07 (was true). Verbatim text reads "Has access
    to vehicle equipment from the Armory" — a DISTINCT, narrower grant than "weapons and gear
    from the Armory" (the phrase used on CSM characters like Sorcerer/Dark Apostle). "Vehicle
    equipment" = the Vehicle Upgrades list ONLY, already shown automatically via is_vehicle +
    category:'vehicle' items (UnitCard.tsx hasFactionVehicleItems — independent of this flag);
    it does NOT grant the general armory (Daemon weapon/Daemonic armor/Familiar/etc.). The old
    `true` value wrongly opened that general armory tab. (This session's earlier SOURCE-pass
    note "vehicle equipment only" assumed the flag itself was vehicle-scoped — it isn't; fixed
    after cross-referencing engine code + verbatim text comparison across all CSM vehicles.)
  ✓ keywords: ["Chaos Space Marine", "Vehicle"] — "Vehicle" appended to the source's
    single "Chaos Space Marine" keyword, consistent with the vehicle-keyword convention
  ✓ is_vehicle: true / unit_type: "Walker" / default_size: 1 / min_cost: 187
  (Fixed mojibake in the old header comment: "â€”" → "—", encoding artefact from migration)

## heavy_support/obliterator.json

OBLITERATOR — Heavy Support

SOURCE: Chaos Space Marines ENG / Obliterator.html (canonical datasheet)
───────────────────────────────────────────────────────────────────────────

PROFILE:
  No.   NAME         M   WS  BS  S  T  W  I  A  LD  SV  PTS
  1-3   Obliterator  6"  3+  3+  5  5  3  4  3   8  2+  141

EQUIPPED WITH: An Oblierator [sic] is equipped with: An array of Fleshmetal guns; Power fist.

WEAPONS:
  Assault cannon                24"  Heavy 4       S6  AP-2  D1  Armor piercing(5+)
  Heavy flamer                   9"  Assault 4     S5  AP-1  D1  Flames
  Lascannon                     48"  Heavy 1       S9  AP-4  D3  AT(3)
  Multi-melta                   24"  Assault 1     S8  AP-5  D2  AT(2), Melta
  Plasma cannon - Standard      36"  Heavy 1       S7  AP-3  D1  AT(1), Explosive
  Plasma cannon - Overcharged   36"  Heavy 1       S8  AP-4  D2  AT(2), Explosive, Overheating
  Power fist                     -   Melee         Sx2 AP-3  D2  AT(2), Slow(-2)
  Twin flamer                    9"  Assault 8     S4  AP 0  D1  Flames
  Twin melta                    12"  Assault 2     S8  AP-5  D1  AT(1), Melta
  Twin plasma gun - Standard    24"  Rapid Fire 2  S7  AP-3  D1  AT(1)
  Twin plasma gun - Overheating 24"  Rapid Fire 2  S8  AP-4  D2  AT(2), Overheating

OPTIONS:
  • All models may receive a Mark of Chaos (per model): Khorne/Slaanesh/Nurgle +4pts,
    Tzeentch +10pts
  • May have up to 2 veteran abilities

ABILITIES (verbatim):
  Deepstrike, Daemon, Unyielding
  Fleshmetal guns: The model may not use the same ranged weapon in two consecutive
  battle rounds.

UNIT TYPE: Monstrous Infantry
KEYWORDS: Chaos Space Marine

ENGINE STATUS:
  ✓ stats, pts, weapons, options, abilities all match HTML verbatim (Plasma cannon /
    Twin plasma gun sub-profiles correctly split into separate "<weapon> - <profile>"
    entries; full multi-profile "array of Fleshmetal guns" weapon roster preserved —
    no swap option_groups in source, the unit simply HAS access to all these profiles
    per "Fleshmetal guns" ability text)
  ✓ option_groups: mark (per-model, Khorne/Slaanesh/Nurgle +4 vs Tzeentch +10 — an
    uneven tiered-pricing mark group, distinct from the uniform +10/god seen on
    single-model vehicles)
  ✓ has_veteran_abilities: true / veteran_max: 2
  ✓ has_armory_access: false / champion_has_armory: false (no armory line in text)
  ✓ unit_type: "Monstrous Infantry" / keywords: ["Chaos Space Marine"] (no "Vehicle"
    append — Monstrous Infantry, not a Vehicle, consistent with the convention)
  ✓ default_size: 1 (min "1-3") / min_cost: 141
  🟡 "An Oblierator is equipped with..." — source has a typo ("Oblierator" for
    "Obliterator"); prod JSON copies it verbatim in `equipped_with` (matches canonical
    text exactly per FAQ#5 — cosmetic, not a data bug)

## heavy_support/plagueburst_crawler.json

PLAGUEBURST CRAWLER — Heavy Support

SOURCE: Chaos Space Marines ENG / Plagueburst Crawler.html (canonical datasheet)
───────────────────────────────────────────────────────────────────────────

PROFILE:
  No.  NAME                  M    WS  BS  S  FRONT  SIDE  REAR  I  A  HP  PTS
  1    Plagueburst Crawler  12"   -   3+  7    13    12    11   4  2   3  324

EQUIPPED WITH: A Plagueburst Crawler is equipped with: Plagueburst mortar;
  two Plague spewers; Rothail volley gun.

WEAPONS:
  Entropy cannon - Focused entropy  48"  Heavy 1       S8  AP-5  D3  AT(3)
  Entropy cannon - Entropic burst   48"  Heavy 1       S5  AP-1  D1  Explosive, Poison(4+)
  Heavy slugger                     36"  Heavy 3       S5  AP-1  D1  -
  Plagueburst mortar                48"  Heavy 1       S7  AP-3  D2  AT(1), Barrage,
                                                                      Indirect, Poison(4+)
  Plague spewer                      9"  Assault 4     S5  AP-1  D1  Flames, Poison(4+)
  Rothail volley gun                24"  Rapid Fire 2  S6  AP-2  D1  Poison(4+)

OPTIONS (verbatim header "OPTIONEN" — German typo in source spreadsheet, preserved
  only as a structural label, not copied into prod JSON option_group headers):
  • Can replace the Rothail volley gun: Heavy slugger +5
  • Can replace two Plague spewers: two Entropy cannons +27
  • Has access to vehicle equipment from the Armory

ABILITIES (verbatim): Mark of Nurgle

UNIT TYPE: Vehicle
KEYWORDS: Death Guard

ENGINE STATUS:
  ✓ stats, pts, weapons, options, abilities all match HTML verbatim (Entropy cannon
    Focused entropy/Entropic burst sub-profiles correctly split into separate
    "<weapon> - <profile>" entries, same convention as Predator/PBC's own listing order)
  ✓ option_groups: "one" structured replace (replaces:["Rothail volley gun"], Heavy
    slugger +5) / "one" structured replace (replaces:["Plague spewer"], two Entropy
    cannons +27)
  🔴 has_armory_access: false — CORRECTED 2026-06-07 (was true). Verbatim text reads "Has access
    to vehicle equipment from the Armory" — a DISTINCT, narrower grant than "weapons and gear
    from the Armory" (the phrase used on CSM characters like Sorcerer/Dark Apostle). "Vehicle
    equipment" = the Vehicle Upgrades list ONLY, already shown automatically via is_vehicle +
    category:'vehicle' items (UnitCard.tsx hasFactionVehicleItems — independent of this flag);
    it does NOT grant the general armory (Daemon weapon/Daemonic armor/Familiar/etc.). The old
    `true` value wrongly opened that general armory tab. (This session's earlier SOURCE-pass
    note "vehicle equipment only" assumed the flag itself was vehicle-scoped — it isn't; fixed
    after cross-referencing engine code + verbatim text comparison across all CSM vehicles.)
  ✓ has_veteran_abilities: false (no veteran-ability line in source — unlike most
    CSM Heavy Support vehicles, this datasheet has none)
  ✓ locked_mark: "Nurgle" — sourced from the dedicated "Mark of Nurgle" ABILITIES
    row (this is a Death Guard unit with a baked-in mark, not a purchasable option;
    correctly modeled as a lock rather than an option_group choice)
  ✓ unit_type: "Vehicle" / keywords: ["Death Guard", "Vehicle"] — "Vehicle" appended
    to the source's single "Death Guard" keyword, consistent with vehicle convention
  ✓ is_vehicle: true / default_size: 1 / min_cost: 324
  🟡 source's own OPTIONS section header reads "OPTIONEN" (German for "options" —
    a copy-paste artefact in the spreadsheet); cosmetic, has no bearing on data
  (Fixed mojibake in the old header comment: "â€”" → "—", encoding artefact from migration)

## hq/adept_of_possession.json

ADEPT OF POSSESSION — HQ

SOURCE: Chaos Space Marines ENG / Adept of Possession.html (canonical datasheet)
──────────────────────────────────────────────────────────────────────────────

PROFILE:
  No.  NAME                  M    WS   BS   S  T  W  I  A  LD  SV  PTS
  1    Adept of Possession   6"   3+   3+   4  4  4  5  2   8  3+   77
  *    Master of Possession  6"   3+   3+   4  4  4  5  3   9  3+   92  (variant, unique per army)

EQUIPPED WITH: Frag grenades; Krak grenades.

OPTIONS:
  May receive a Mark of Chaos:
    Undivided +0 pts / Khorne +8 pts / Slaanesh +8 pts / Nurgle +20 pts / Tzeentch +15 pts
    NOTE: ALL 5 marks available (unlike Chaos Sorcerer which has no Khorne).
  One Adept of Possession per army can be upgraded to Master of Possession for +15 pts.
    Upgrade: +1A (2->3), +1LD (8->9). Total: 77 + 15 = 92 pts.
  Has access to weapons and gear from the Armory.
  May have up to 2 veteran abilities.

ABILITIES:
  Daemon: 5+ ward save (Core Rules, Daemon ability).

PSYKER: NOT a psyker — no "Psyker" ability on the datasheet.

KEYWORD: Chaos Space Marine
UNIT TYPE: Character Model, Infantry

ENGINE STATUS:
  All 5 marks wired in option_groups.
  Daemon ability (5+ inv save) shown as text in UnitCard.
  <Legion> ability is informational text only; no engine action needed.
  Daemonic corruption is informational; no builder-side engine effect.
  is_psyker: false.

## hq/chaos_lieutenant.json

CHAOS LIEUTENANT — HQ

SOURCE: Chaos Space Marines ENG / Chaos Lieutenant.html (canonical datasheet)
─────────────────────────────────────────────────────────────────────────────

PROFILE:
  No.  NAME              M    WS  BS  S  T  W  I  A  LD  SV   PTS
  1    Chaos Lieutenant  6"   2+  2+  4  4  4  5  2   8  3+    79
  *    Chaos Lord        6"   2+  2+  4  4  4  5  3   9  3+    94  [upgrade]

EQUIPPED WITH: A Chaos Lieutenant is equipped with: Frag grenades; Krak grenades.

WEAPONS:
  Frag grenade  6"  Grenade 1  4  AP0   D1  Explosive
  Krak grenade  6"  Grenade 1  6  AP-2  D1  —

OPTIONS:
  • May receive a Mark of Chaos: Undivided+0 / K+8 / S+8 / N+20 / T+15
  • One Chaos Lieutenant per army can be upgraded to a Chaos Lord for +15 points
  • Has armory access; up to 2 veteran abilities

ABILITIES (verbatim):
  Veterans of the Long War: The Chaos Lieutenant can assign a free Veteran ability to
    himself and a friendly unit at the start of the deployment. Both units must be able
    to gain the veteran ability and it must be the same ability. It does not count
    against the limit on how many veteran abilities a unit can have.
  Chaos Lord: A Chaos Lord may use Veterans of the Long War a second time.

UNIT TYPE: Character model, Infantry
KEYWORDS: Chaos Space Marine

ENGINE STATUS:
  ✓ stats, pts match HTML exactly (base + Chaos Lord variant)
  ✓ weapons: 2 grenades match HTML exactly
  ✓ marks: all 5 including Undivided+0 ✓
  ✓ variant_link: "Chaos Lord", is_unique_per_army: true ✓
  ✓ abilities text verbatim match ✓
  ✓ is_character: true / has_armory_access: true / veteran_max: 2 ✓
  ✓ default_size: 1 / min_cost: 79 ✓

## hq/chaos_sorcerer.json

CHAOS SORCERER — HQ

SOURCE: Chaos Space Marines ENG / Chaos Sorcerer.html (canonical datasheet)
──────────────────────────────────────────────────────────────────────────────

PROFILE:
  No.  NAME              M    WS   BS   S  T  W  I  A  LD  SV  PTS
  1    Chaos Sorcerer    6"   3+   3+   4  4  4  5  2   8  3+   92
  *    Master of Sorcery 6"   3+   3+   4  4  5  5  3   9  3+  107  (variant, unique per army)

EQUIPPED WITH: Frag grenades; Krak grenades.

OPTIONS:
  • May receive a Mark of Chaos:
    - Undivided +0 pts / Slaanesh +8 pts / Nurgle +20 pts / Tzeentch +15 pts
  • One Chaos Sorcerer per army can be upgraded to Master of Sorcery for +15 pts.
  • Has access to weapons and gear from the Armory.
  • May have up to 2 veteran abilities.

ABILITIES:
  Master of Sorcery: The model can cast and deny 1 additional power per battle round.

  Psyker: The model can cast 1 power and deny 1 power per battle round.
    It knows Smite and all powers from a chosen discipline.

PSYKER RULES (grounded in core_rules_text.txt L1009-1012):
  "If a psyker is limited in the number of powers it knows, they must be selected
   when creating the army list."
  "Psykers have access to the list of General Psychic Disciplines as well as those
   listed in their respective Codex."

  AVAILABLE DISCIPLINES for Chaos Sorcerer:
    ALWAYS available (no mark required):
      - General Psychic Disciplines  (Core Rules: all psykers)
      - Dark Hereticus               (CSM codex, no mark restriction)
      - Malefic                      (CSM codex, no mark restriction)
    CONDITIONAL (requires matching mark):
      - Change           → Mark of Tzeentch only
      - Decay            → Mark of Nurgle only
      - Excess           → Mark of Slaanesh only
    NEVER available:
      - Cult Powers      → Cult initiates only (Dark Commune)

  POWER SELECTION:
    "knows Smite" → Smite is always known (fixed, not counted against the limit)
    "all powers from a chosen discipline" → player chooses 1 discipline,
      knows ALL 6 powers from it.
    NOTE: Master of Sorcery variant adds +1 cast/deny per round (informational).

ARMORY ACCESS — KEY RULES (grounded in Armory.html + datasheet OPTIONS):
  - ᵀ weapons (Combi-*, Force weapons, Power weapons…) are gated: only available
    AFTER the model buys Terminator armor. Sorcerer has no innate armourKeyword
    so the ᵀ gate only fires when Terminator armor is purchased.
  - Force axe/staff/sword: pU=null (character price only) — these are Psyker weapons.
    ENGINE TODO: enforce Psyker-only restriction for Force weapons.
  - Hunter-killer missile / Kai gun / Living vehicle: p=null — shown in armory
    but not purchasable (cost "-"). They appear equipped on specific units.

ARMORY ACCESS (grounded in Armory.html + datasheet OPTIONS):

  SOURCE — Armory.html global rule (applies to ALL units with armory access):
  "Unless stated otherwise, every item can only be purchased once by each model.
   Any model with access to the Armory can buy as many items as it wants.
   Items with a cost of '-' can not be selected."

  SOURCE — Chaos Sorcerer.html OPTIONS:
  "Has access to weapons and gear from the Armory."  → has_armory_access: true
  "May have up to 2 veteran abilities."              → veteran_max: 2

  NOTE — Armory.html gating rules (apply globally):
  "Models wearing Gravis armor can only receive equipment with ᴳ."  → filterGravisCompat()
  "Models wearing Cataphractii or Terminator armor can only receive equipment with ᵀ."
    → modelRestrictsToTermSubset() — Chaos Sorcerer has no innate armourKeyword,
      so this only fires if the player buys Terminator armor from the general armory.

  VETERAN ABILITY COST RULE (Armory.html footer, verbatim):
  "Point costs must be paid for every model in the unit and per Wound or Hull point
   of the model." → p_veh field on veteran items; charged ×wounds for monsters/vehicles.
    The Chaos Sorcerer is a CHARACTER MODEL → pays the flat p_char column (0 for most).

KEYWORD: Chaos Space Marine, Psyker
UNIT TYPE: Character Model, Infantry

ENGINE STATUS:
  ✓ Discipline access by mark: enforced in PsychicModal (isMarkOnlyDisc filter)
  ✓ Cult Powers blocked: enforced in PsychicModal (isCultOnlyDisc filter)
  ✓ Smite always known: TODO — not yet shown as fixed known power in UI
  ✓ "all powers from chosen discipline" logic: TODO — currently picks individual
    powers freely; needs "choose 1 discipline → unlock all" mechanic

## hq/daemon_prince.json

DAEMON PRINCE — HQ

SOURCE: Chaos Space Marines ENG / Daemon Prince.html (canonical datasheet)
─────────────────────────────────────────────────────────────────────────

PROFILE:
  No.  NAME           M    WS  BS  S  T  W  I  A  LD  SV   PTS
  1    Daemon Prince  6”   2+  2+  6  6  6  5  4   9  3+   184

EQUIPPED WITH: A Daemon prince is equipped with: Malefic talons.

WEAPONS:
  Hellforged blade    —   Melee     +2  AP-4  D2  AT(2)               [option]
  Malefic talons      —   Melee      U  AP-2  D1  Flurry(2)           [default]
  Plague spewer      9”   Assault 4  5  AP-1  D1  Flames, Poison(4+)  [option, Nurgle only]

OPTIONS:
  • May receive a Mark of Chaos: K+11 / S+11 / N+28 / T+24
    (NO Undivided option — only 4 marks available)
  • Can get one of the following weapons: Plague spewer (Nurgle only) +13
  • Can get the following weapon: Hellforged blade +18
  • If no Mark of Khorne, can be upgraded to a psyker +5
  • Can be equipped with wings +37: gain +6” M and “Jump pack infantry” unit type
  • Has armory access; up to 2 veteran abilities

ABILITIES (verbatim):
  Deep strike, Daemon, Daemonic instability, Terrifying(-1)
  Psyker: The model can cast 1 power and deny 1 power per battle round.
    He knows Smite and 1 power from a chosen discipline.

UNIT TYPE: Monstrous Creature
KEYWORDS: Chaos Space Marine
  (TS also has “Monster” — production semantic for is_monster: true)

ENGINE STATUS:
  ✓ stats, pts match HTML exactly
  ✓ all 3 weapons match HTML exactly
  ✓ marks: K/S/N/T only — no Undivided (correct per HTML) ✓
  ✓ Plague spewer available_if: instanceOf Nurgle ✓
  ✓ Plague spewer option choice name == weapon name "Plague spewer" (NOT "... (Nurgle only)")
    so computeWeaponsToShow hides it until picked — a mismatch made it a phantom default that
    always showed in the live profile for any mark (v1.55 fix).
  ✓ Wings effect: stat_mod M+6 + adds_unit_types [“Jump pack infantry”] ✓
  ⚠ Wings effect missing grants_abilities: [“Deep Strike”] — armory jump-pack and
    possessed.ts include this; Daemon Prince wings option should too (ENGINE TODO)
  ✓ is_psyker: false (psyker is conditional option — base unit is not a psyker) ✓
  ✓ is_monster: true / is_character: true / has_armory_access: true / veteran_max: 2 ✓
  ✓ unit_type: “Monstrous Creature” / default_size: 1 / min_cost: 184 ✓

## hq/dark_apostle.json

DARK APOSTLE — HQ

SOURCE: Chaos Space Marines ENG / Dark Apostle.html (canonical datasheet)
────────────────────────────────────────────────────────────────────────────

PROFILE:
  No.  NAME             M    WS  BS  S  T  W  I  A  LD  SV   PTS
  1    Dark Apostle     6”   2+  3+  4  4  4  5  2   8  3+   134
  1    Sinister Bishop  6”   2+  3+  4  4  4  5  3   9  3+   154  [upgrade, unique per army]
  (HTML row 5 has No.=1 for Sinister Bishop, not “*” — alternate profile for same single model)

EQUIPPED WITH: A Dark Apostle is equipped with: Crozius Maleficum; Frag grenades; Krak grenades.

WEAPONS:
  Crozius Maleficum  —   Melee     +2  AP-2  D2  —
  Frag grenade       6”  Grenade 1  4  AP0   D1  Explosive
  Krak grenade       6”  Grenade 1  6  AP-2  D1  —

OPTIONS:
  • May receive a Mark of Chaos: Undivided+0 / K+8 / S+8 / N+20 / T+15
  • One Dark Apostle per army can be upgraded to a Sinister Bishop for +20 points (→A3, LD9)
  • Has armory access; up to 2 veteran abilities

ABILITIES (verbatim):
  Faithful: A Dark Apostle may pray once per turn. A prayer is successful at a roll of 3+.
    A Dark Apostle knows all prayers from the Exalted Prayers discipline.
  Seal of corruption: This model has a 4+ ward save.
  Sinister Bishop: A Sinister Bishop may pray one additional time per battle round.

UNIT TYPE: Character model, Infantry
KEYWORDS: Chaos Space Marine
  (TS also has “Priest” — production semantic; is_priest: true activates prayer modal)

ENGINE STATUS:
  ✓ stats, pts match HTML exactly (base + Sinister Bishop variant)
  ✓ all 3 weapons match HTML exactly
  ✓ marks: all 5 including Undivided+0 ✓
  ✓ variant_link: “Sinister Bishop”, is_unique_per_army: true ✓
  ✓ abilities text verbatim match ✓
  ✓ is_priest: true / is_psyker: false ✓
  ✓ is_character: true / has_armory_access: true / veteran_max: 2 ✓
  ✓ default_size: 1 / min_cost: 134 ✓

## hq/infernal_acolyte.json

INFERNAL ACOLYTE — HQ

SOURCE: Chaos Space Marines ENG / Infernal Acolyte.html (canonical datasheet)
─────────────────────────────────────────────────────────────────────────────

PROFILE:
  No.  NAME              M    WS  BS  S  T  W  I  A  LD  SV   PTS
  1    Infernal Acolyte  6"   3+  3+  4  4  4  5  2   8  3+    92
  *    Infernal Master   6"   3+  3+  4  4  4  5  3   9  3+   107  [upgrade]

EQUIPPED WITH: An Infernal Acolyte is a single model equipped with: Frag grenades; Krak grenades.

WEAPONS:
  Frag grenade  6"  Grenade 1  4  AP0   D1  Explosive
  Krak grenade  6"  Grenade 1  6  AP-2  D1  —

OPTIONS:
  • May receive a Mark of Chaos: Undivided+0 / K+8 / S+8 / N+20 / T+15
  • One Infernal Acolyte per army can be upgraded to an Infernal Master for +15 points
  • Has armory access; up to 1 veteran ability

ABILITIES (verbatim):
  Infernal Pact: An Infernal Acolyte may attempt to make one pact per activation.
    A pact is successful on a 3+. An Infernal Acolyte knows all Infernal Pacts.
  Infernal Master: An Infernal Master may attempt to make one additional pact each activation.

UNIT TYPE: Character model, Infantry
KEYWORDS: Chaos Space Marine

ENGINE STATUS:
  ✓ stats, pts match HTML exactly (base + Infernal Master variant)
  ✓ weapons: 2 grenades match HTML exactly
  ✓ marks: all 5 including Undivided+0 ✓
  ✓ variant_link: "Infernal Master", is_unique_per_army: true ✓
  ✓ abilities text verbatim match ✓
  ✓ veteran_max: 1 (HTML: "up to 1 veteran ability") ✓
  ✓ uses_pacts: true (production semantic) ✓
  ✓ is_character: true / has_armory_access: true ✓
  ✓ default_size: 1 / min_cost: 92 ✓

## hq/lord_discordant.json

LORD DISCORDANT — HQ

SOURCE: Chaos Space Marines ENG / Lord Discordant.html (canonical datasheet)
──────────────────────────────────────────────────────────────────────────────

PROFILE:
  No.  NAME             M     WS  BS  S  T  W  I  A  LD  SV   PTS
  1    Lord Discordant  12”   2+  2+  4  6  5  5  4   9  2+   170

EQUIPPED WITH: A Lord Discordant is equipped with: Baleflamer; Bladed limbs;
  Impaler chainglaive; Frag grenades; Krak grenades.
  (HTML weapon-row header typo: “Imapaler chainglaive” — correct name is “Impaler chainglaive”)

WEAPONS:
  Baleflamer                     12”  Assault 4   6  AP-2  D1  Flames                              [default]
  Bladed limbs                    —   Melee       6  AP-2  D1  Flurry(2)    [fixed S=6, not S+X]
  Frag grenade                   6”   Grenade 1   4  AP0   D1  Explosive
  Impaler chainglaive - Charge    —   Melee      x2  AP-3  D2  AT(2), Charge
  Impaler chainglaive - Melee     —   Melee      +2  AP-3  D1  —
  Krak grenade                   6”   Grenade 1   6  AP-2  D1  —
  Magma cutter                   12”  Pistol 1    8  AP-5  D2  AT(2), Melta  [option]
  Reaper autocannon              36”  Heavy 3     7  AP-2  D1  AT(1)         [option]

OPTIONS:
  • May receive a Mark of Chaos: Undivided+0 / K+8 / S+8 / N+30 / T+25
  • May replace its Baleflamer with: Reaper Autocannon +26
  • May be equipped with one of: Technovirus-Injector+10 / Magma cutter+26
  • Has armory access; up to 2 veteran abilities

ABILITIES (verbatim):
  Move through cover
  Technovirus-Injector: Melee attacks gain the “Tank hunter” ability.

UNIT TYPE: Character model, Monstrous Creature
KEYWORDS: Chaos Space Marine
  (TS also has “Monster” — production semantic for is_monster: true)

ENGINE STATUS:
  ✓ stats, pts match HTML exactly
  ✓ all 8 weapons match HTML exactly (dual Impaler profile + fixed S=6 on Bladed limbs) ✓
  ✓ marks: all 5 including Undivided+0 ✓
  ✓ Baleflamer replace option with replaces: [“Baleflamer”] ✓
  ✓ Technovirus-Injector/Magma cutter choose-one group ✓
  ✓ is_monster: true / is_character: true / has_armory_access: true / veteran_max: 2 ✓
  ✓ default_size: 1 / min_cost: 170 ✓

## hq/warpsmith.json

WARPSMITH — HQ

SOURCE: Chaos Space Marines ENG / Warpsmith.html (canonical datasheet)
────────────────────────────────────────────────────────────────────────

PROFILE:
  No.  NAME                    M    WS  BS  S  T  W  I  A  LD  SV   PTS
  1    Warpsmith               6”   3+  2+  4  4  4  5  2   8  2+   119
  *    Daemonforge Mastersmith  6”   3+  2+  4  4  4  5  3   9  2+   134  [upgrade]

EQUIPPED WITH: A Warpsmith is equipped with: Flamer tendril; Meltagun tendril;
  Omnissiah power axe; Frag grenades; Krak grenades.

WEAPONS:
  Frag grenade          6”   Grenade 1   4  AP0   D1  Explosive
  Flamer tendril        9”   Assault 4   4  AP0   D1  Flames
  Krak grenade          6”   Grenade 1   6  AP-2  D1  —
  Meltagun tendril      12”  Assault 1   8  AP-5  D1  AT(1), Melta, Flurry(1)
  Omnissiah power axe    —   Melee      +2  AP-2  D2  —

OPTIONS:
  • May receive a Mark of Chaos: Undivided+0 / K+8 / S+8 / N+20 / T+15
  • One Warpsmith per army can be upgraded to a Daemonforge Mastersmith for +15 points
  • Has armory access; up to 2 veteran abilities

ABILITIES (verbatim):
  Blessing of the Omnissiah: At the end of its move, the model may attempt to repair a
    vehicle within 6”. On a 4+, one “Weapon destroyed” or “Engine damage” result is removed
    from the vehicle, or 1 hull point is restored. Alternatively, a vehicle within 6” can
    reroll a hit roll and a wound or armor penetration roll.
  Daemonforge Mastersmith: A Daemonforge Mastersmith may use the “Blessing of the
    Omnissiah” twice.

UNIT TYPE: Character model, Infantry
KEYWORDS: Chaos Space Marine
  (TS also has “Warpsmith” — production semantic used by engine for faction rules)

ENGINE STATUS:
  ✓ stats, pts match HTML exactly (base + Daemonforge Mastersmith variant)
  ✓ all 5 weapons match HTML exactly
  ✓ marks: all 5 including Undivided+0 ✓
  ✓ variant_link: “Daemonforge Mastersmith”, is_unique_per_army: true ✓
  ✓ abilities text verbatim match ✓
  ✓ is_character: true / has_armory_access: true / veteran_max: 2 ✓
  ✓ default_size: 1 / min_cost: 119 ✓

## lords_of_war/chaos_fellblade.json

CHAOS FELLBLADE — Lords of War

SOURCE: Informacion/Escalation.ods, sheet "Chaos Fellblade" (canonical datasheet —
  NOT in the Chaos Space Marines ENG HTML folder; this unit comes from the Escalation
  cross-faction Lords of War supplement, sheet "Chaos Fellblade")
───────────────────────────────────────────────────────────────────────────

PROFILE:
  No.  NAME       M    WS  BS  S  FRONT  SIDE  REAR  I  A  HP  PTS
  1    Fellblade  12"   -  3+  8    14    13    12   4  1   5  1042

EQUIPPED WITH: A Chaos Fellblade is equipped with: 2 Laser destroyers; Twin Fellblade
  accelerator cannon; Twin heavy flamer.

WEAPONS:
  Heavy bolter                          36"   Rapid Fire 2  S5   AP-2  D1  -
  Heavy flamer                            9"  Assault 4     S5   AP-1  D1  Flames
  Laser destroyer                        72"  Heavy 1       S10  AP-6  D4  AT(4), Lance(1), Tank hunter
  Multi-melta                            24"  Heavy 1       S8   AP-5  D2  AT(2), Melta
  Quad lascannon                         48"  Heavy 4       S9   AP-4  D3  AP(3)
  Storm bolter                           24"  Assault 2     S4   AP-1  D1  -
  Twin Fellblade accelerator cannon - AP shell  100"  Heavy 2  S9  AP-4  D3  AT(3), Armorbane
  Twin Fellblade accelerator cannon - HP shell  100"  Heavy 2  S8  AP-3  D2  AT(2), Barrage
  Twin heavy bolter                      36"  Rapid Fire 4  S5   AP-2  D1  -
  Twin heavy flamer                       9"  Assault 8     S5   AP-1  D1  Flames

OPTIONS:
  • May receive a Mark of Chaos: Khorne/Nurgle/Slaanesh/Tzeentch +20 points (each)
  • May swap their Twin heavy flamer: Twin heavy bolter +10
  • May swap their 2 Laser destroyers: 2 Quad lascannons +272
  • Can be equipped with one of the following: Storm bolter +11 / Heavy flamer +13 /
    Heavy bolter +18 / Multi-melta +35

ABILITIES (verbatim): -

UNIT TYPE: Super-heavy Vehicle
KEYWORDS: Lord of War

ENGINE STATUS:
  ✓ stats, pts, weapons, options, abilities all match the .ods sheet verbatim
    (Twin Fellblade accelerator cannon AP shell/HP shell sub-profiles correctly
    split into separate "<weapon> - <profile>" entries, same convention as the
    CSM-native vehicles)
  ✓ option_groups: "mark" (flat unit-level pick, +20pts uniform per god — pricier
    than the standard +10 seen on CSM-native vehicles, consistent with Lord of War
    scale) / "one" structured replace (replaces:["Twin heavy flamer"], Twin heavy
    bolter +10) / "one" structured replace (replaces:["Laser destroyer"], 2 Quad
    lascannons +272) / "one" additive weapon pick (+11/+13/+18/+35)
  ✓ abilities: [] (source ABILITIES row is "-" — no abilities listed)
  ✓ has_armory_access: false / has_veteran_abilities: false (no such lines in text)
  ✓ keywords: ["Chaos Space Marine", "Lord of War", "Vehicle"] — engine appends both
    "Chaos Space Marine" (faction tie-in for the per-faction LoW injection route,
    per the Escalation LoW "Route 2: native unit per faction" model) and "Vehicle"
    to the source's single "Lord of War" keyword; correct per the cross-faction
    supplement architecture (not a data error — the canonical sheet itself is
    faction-neutral, and the per-faction copy adds the faction keyword)
  ✓ is_vehicle: true / unit_type: "Super-heavy Vehicle" / default_size: 1 /
    min_cost: 1042
  (Fixed mojibake in the old header comment: "â€”" → "—", encoding artefact from migration)

## lords_of_war/chaos_spartan.json

CHAOS SPARTAN — Lords of War

SOURCE: Informacion/Escalation.ods, sheet "Chaos Spartan" (canonical datasheet —
  NOT in the Chaos Space Marines ENG HTML folder; this unit comes from the Escalation
  cross-faction Lords of War supplement, sheet "Chaos Spartan")
───────────────────────────────────────────────────────────────────────────

PROFILE:
  No.  NAME           M    WS  BS  S  FRONT  SIDE  REAR  I  A  HP  PTS
  1    Chaos Spartan  12"   -  3+  6    14    14    14   4  1   5  641

EQUIPPED WITH: A Chaos Spartan is equipped with: 2 Laser destroyers; Twin heavy flamer.

WEAPONS:
  Combi-bolter        24"  Rapid Fire 2  S4   AP-1  D1  -
  Heavy bolter        36"  Heavy 3       S5   AP-2  D1  -
  Heavy flamer         9"  Assault 4     S5   AP-1  D1  Flames
  Laser destroyer     72"  Heavy 1       S10  AP-6  D4  AT(4), Lance(1), Tank hunter
  Multi-melta         24"  Heavy 1       S8   AP-5  D2  AT(2), Melta
  Quad lascannon      48"  Heavy 4       S9   AP-4  D3  AP(3)
  Storm bolter        24"  Assault 2     S4   AP-1  D1  -
  Twin heavy bolter   36"  Heavy 6       S5   AP-2  D1  -
  Twin heavy flamer    9"  Assault 8     S5   AP-1  D1  Flames

OPTIONS:
  • May receive a Mark of Chaos: Khorne/Nurgle/Slaanesh/Tzeentch +20 points (each)
  • May swap their Twin heavy flamer: Twin heavy bolter +10
  • May swap their 2 Laser destroyers: 2 Quad lascannons +272
  • Can be equipped with one of the following: Storm bolter +11 / Heavy flamer +13 /
    Heavy bolter +18 / Multi-melta +35

ABILITIES (verbatim):
  Assault ramp: Passengers can still make a 6" charge move after the vehicle moves
  and they exit.
  Transport: This model has a transport capacity of 25 infantry models.

UNIT TYPE: Super-heavy Vehicle
KEYWORDS: Lord of War

ENGINE STATUS:
  ✓ stats, pts, weapons, options, abilities all match the .ods sheet verbatim
    (note this datasheet has no sub-profile weapons, unlike the Fellblade)
  ✓ option_groups: "mark" (flat unit-level pick, +20pts uniform per god) / "one"
    structured replace (replaces:["Twin heavy flamer"], Twin heavy bolter +10) /
    "one" structured replace (replaces:["Laser destroyer"], 2 Quad lascannons +272)
    / "one" additive weapon pick (+11/+13/+18/+35) — identical OPTIONS block to
    the Chaos Fellblade (sister datasheet sharing the same supplement template)
  ✓ has_armory_access: false / has_veteran_abilities: false (no such lines in text)
  ✓ keywords: ["Chaos Space Marine", "Lord of War", "Vehicle"] — engine appends
    both "Chaos Space Marine" (faction tie-in for the per-faction LoW injection
    route) and "Vehicle" to the source's single "Lord of War" keyword; correct
    per the cross-faction supplement architecture (canonical sheet is faction-
    neutral; per-faction copy adds the faction keyword) — same pattern as Fellblade
  ✓ is_vehicle: true / unit_type: "Super-heavy Vehicle" / default_size: 1 /
    min_cost: 641
  🟡 Assault ramp/Transport(25) text-only — no transport-capacity primitive on the
    engine side (same gap class as Land Raider/Chaos Rhino/Dreadclaw; consistent
    treatment, not a unique bug here)
  🟡 source sheet has a duplicate "KEYWORDS" header row (rows 22 and 24, with row 23
    containing only "-") — a copy-paste artefact in the spreadsheet; the actual
    keyword value "Lord of War" appears once and is correctly extracted
  (Fixed mojibake in the old header comment: "â€”" → "—", encoding artefact from migration)

## lords_of_war/chaos_warhound.json

CHAOS WARHOUND — Lords of War

SOURCE: Informacion/Escalation.ods, sheet "Chaos Warhound" (canonical datasheet —
  NOT in the Chaos Space Marines ENG HTML folder; this unit comes from the Escalation
  cross-faction Lords of War supplement, sheet "Chaos Warhound")
───────────────────────────────────────────────────────────────────────────

PROFILE:
  No.  NAME      M    WS  BS  S   FRONT  SIDE  REAR  I  A  HP  PTS
  1    Warhound  12"   -  3+  10    14    13    12   1  1   8  524

EQUIPPED WITH: A Warhound is equipped with: -.

WEAPONS:
  Apocalypse missile launcher  240"  Heavy 5   S7   AP-3  D1  AT(1), Colossal blast, Indirect
  Inferno gun                   18"  Assault 12 S7  AP-3  D1  AT(1), Flames
  Plasma blastgun - Rapid       72"  Heavy 2   S8   AP-4  D2  AT(2), Barrage
  Plasma blastgun - Overload    96"  Heavy 1   S10  AP-4  D3  AT(3), Colossal blast
  Twin turbo-laser destructor   96"  Heavy 2   SD   AP-4  D4  AT(4), Barrage
  Vulcan mega-bolter            60"  Heavy 15  S6   AP-3  D1  -
  (* "Choose one of the following profiles" — Plasma blastgun Rapid/Overload)

OPTIONS:
  • May receive a Mark of Chaos: Khorne/Nurgle/Slaanesh/Tzeentch +20 points (each)
  • Must pick two weapons from this list: Inferno gun +84 / Vulcan mega-bolter +270 /
    Plasma blastgun +549 / Apocalypse missile launcher +649 / Twin turbo-laser
    destructor +1024

ABILITIES (verbatim):
  Void Shields (2): The model has two Void shields. Each hit scored against it will
  instead hit a Void shield (while at least one remains active). Close combat attacks
  come from inside the shield and therefore are not stopped. Void shields have an
  Armour value of 12. A Glancing hit or Penetrating hit (or any hit from a Destroyer
  weapon) scored against a Void shield causes it to collapse. After all Void shields
  have collapsed, further hits strike the model instead. In the Rally Phase, roll 1D6
  for each collapsed Void shield. Each roll of 5+ instantly restores one collapsed shield.

UNIT TYPE: Super-heavy Vehicle
KEYWORDS: Lord of War

ENGINE STATUS:
  ✓ stats, weapons, abilities all match the .ods sheet verbatim (Plasma blastgun
    Rapid/Overload sub-profiles correctly split into separate "<weapon> - <profile>"
    entries per the source's own "* Choose one of the following profiles" note)
  ✓ model name "Warhound" (not "Chaos Warhound") — matches the .ods NAME cell and
    the "A Warhound is equipped with: -" equipped_with line verbatim; the unit's
    display name "Chaos Warhound" is the per-faction LoW slot label, the model
    itself is named "Warhound" in the canonical text — both correctly preserved
  ✓ option_groups: "mark" (flat unit-level pick, +20pts uniform per god) / TWO
    "one" required:true weapon picks ("Must pick two weapons (1st)"/"(2nd)"),
    each offering the full 5-weapon list — correct modeling of "Must pick two
    weapons from this list" as two independent mandatory single-picks (the same
    weapon CAN be picked twice, e.g. two Inferno guns, since source text doesn't
    forbid repeats)
  ✓ has_armory_access: false / has_veteran_abilities: false (no such lines in text)
  ✓ keywords: ["Chaos Space Marine", "Lord of War", "Vehicle"] — engine appends
    both "Chaos Space Marine" (faction tie-in for the per-faction LoW injection
    route) and "Vehicle" to the source's single "Lord of War" keyword; correct
    per the cross-faction supplement architecture — same pattern as Fellblade/Spartan
  ✓ is_vehicle: true / unit_type: "Super-heavy Vehicle" / default_size: 1
  ✓ min_cost: 692 = base 524 + cheapest mandatory pick (Inferno gun, +84) ×2 — both
    "Must pick two weapons" groups are required:true and the engine correctly sums
    the floor cost of both mandatory picks (the source datasheet equips the unit
    with NO weapons by default — "equipped with: -" — so both picks are baked into
    the minimum cost; this is NOT a bug, the 524 base alone is unplayable per the
    canonical text)
  (Fixed mojibake in the old header comment: "â€”" → "—", encoding artefact from migration)

## lords_of_war/knight_desecrator.json

KNIGHT DESECRATOR — Lords of War

SOURCE: Informacion/Escalation.ods, sheet "Knight Desecrator" (canonical datasheet —
  NOT in the Chaos Space Marines ENG HTML folder; this unit comes from the Escalation
  cross-faction Lords of War supplement, sheet "Knight Desecrator")
───────────────────────────────────────────────────────────────────────────

PROFILE:
  No.  NAME               M    WS  BS  S  FRONT  SIDE  REAR  I  A  HP  PTS
  1    Knight Desecrator  12"  3+  3+  7    13    12    12   4  3   4  547

EQUIPPED WITH: A Knight Desecrator is equipped with: Heavy stubber; Knight melee
  weapon; Laser destructor.

WEAPONS:
  Heavy stubber                  36"  Heavy 3  S4   AP 0  D1  Suppression
  Knight melee weapon - Strike    -   Melee    SD   AP-4  D3  AT(3)
  Knight melee weapon - Sweep     -   Melee    SU   AP-3  D2  AT(1), Flurry(3)
  Laser destructor               72"  Heavy 2  S10  AP-5  D3  AT(4), Tank hunter

OPTIONS:
  • May receive a Mark of Chaos: Khorne/Nurgle/Slaanesh/Tzeentch +20 points (each)

ABILITIES (verbatim):
  Ion shield: The model gains a 4+ ward save against ranged attacks.
  During the activation, you have to select wether the Ion shield covers attacks
  from the front, the left side, the right side or the back. The default side is
  always the front.

UNIT TYPE: Super-heavy Vehicle
KEYWORDS: Lord of War

ENGINE STATUS:
  ✓ stats, pts, weapons, options, abilities all match the .ods sheet verbatim
    (Knight melee weapon Strike/Sweep sub-profiles correctly split into separate
    "<weapon> - <profile>" entries, same convention used across CSM melee weapons
    with multiple profiles e.g. Power fist; the source's own typo "wether" in the
    Ion shield ability text is preserved verbatim — not corrected to "whether",
    correct per FAQ#5/golden-rule, canonical text stands even with typos)
  ✓ option_groups: "mark" (flat unit-level pick, +20pts uniform per god — pricier
    than the standard +10 seen on CSM-native vehicles, consistent with Lord of
    War scale; this is the ONLY option on this datasheet — no weapon swaps)
  ✓ has_armory_access: false / has_veteran_abilities: false (no such lines in text)
  ✓ keywords: ["Chaos Space Marine", "Lord of War", "Vehicle"] — engine appends
    both "Chaos Space Marine" (faction tie-in for the per-faction LoW injection
    route) and "Vehicle" to the source's single "Lord of War" keyword; correct
    per the cross-faction supplement architecture — same pattern as Fellblade/Spartan
  ✓ is_vehicle: true / unit_type: "Super-heavy Vehicle" / default_size: 1 /
    min_cost: 547
  🟡 Ion shield is a text-only special rule (situational ward save with
    a player-chosen facing) — no dedicated engine primitive for directional saves;
    consistent with the established "verbatim text, no mechanical simulation"
    treatment seen across CSM vehicles
  (Fixed mojibake in the old header comment: "â€”" → "—", encoding artefact from migration)

## lords_of_war/knight_rampager.json

KNIGHT RAMPAGER — Lords of War

SOURCE: Informacion/Escalation.ods, sheet "Knight Rampager" (canonical datasheet —
  NOT in the Chaos Space Marines ENG HTML folder; this unit comes from the Escalation
  cross-faction Lords of War supplement, sheet "Knight Rampager")
───────────────────────────────────────────────────────────────────────────

PROFILE:
  No.  NAME              M    WS  BS  S  FRONT  SIDE  REAR  I  A  HP  PTS
  1    Knight Rampager   12"  3+  3+  7    13    12    12   4  3   4  385

EQUIPPED WITH: A Knight Rampager is equipped with: Heavy stubber; 2 Knight melee
  weapons.

WEAPONS:
  Heavy stubber                  36"  Heavy 3  S4   AP 0  D1  Suppression
  Knight melee weapon - Strike    -   Melee    SD   AP-4  D3  AT(3)
  Knight melee weapon - Sweep     -   Melee    SU   AP-3  D2  AT(1), Flurry(3)

OPTIONS:
  • May receive a Mark of Chaos: Khorne/Nurgle/Slaanesh/Tzeentch +20 points (each)

ABILITIES (verbatim):
  Ion shield: The model gains a 4+ ward save against ranged attacks.
  During the activation, you have to select wether the Ion shield covers attacks
  from the front, the left side, the right side or the back. The default side is
  always the front.

UNIT TYPE: Super-heavy Vehicle
KEYWORDS: Lord of War

ENGINE STATUS:
  ✓ stats, pts, weapons, options, abilities all match the .ods sheet verbatim —
    this is the "sister datasheet" to the Knight Desecrator: identical chassis
    stats (M12" WS3+ BS3+ S7 FRONT13 SIDE12 REAR12 I4 A3 HP4) but a simpler,
    cheaper melee-focused loadout — NO Laser destructor (the Desecrator's ranged
    anti-tank weapon is absent here), and "2 Knight melee weapons" replaces the
    Desecrator's single "Knight melee weapon" in the equipped_with line; this
    loadout difference accounts for the 547→385pts gap (162pts cheaper)
  ✓ Knight melee weapon Strike/Sweep sub-profiles correctly split into separate
    "<weapon> - <profile>" entries (same convention as Desecrator); the source's
    own typo "wether" in the Ion shield ability text is preserved verbatim — not
    corrected to "whether", correct per FAQ#5/golden-rule (canonical text stands
    even with typos)
  ✓ option_groups: "mark" (flat unit-level pick, +20pts uniform per god — the
    ONLY option on this datasheet, identical to Desecrator)
  ✓ has_armory_access: false / has_veteran_abilities: false (no such lines in text)
  ✓ keywords: ["Chaos Space Marine", "Lord of War", "Vehicle"] — engine appends
    both "Chaos Space Marine" (faction tie-in for the per-faction LoW injection
    route) and "Vehicle" to the source's single "Lord of War" keyword; correct
    per the cross-faction supplement architecture — same pattern as Desecrator
  ✓ is_vehicle: true / unit_type: "Super-heavy Vehicle" / default_size: 1 /
    min_cost: 385
  🟡 Ion shield is a text-only special rule (situational ward save with
    a player-chosen facing) — no dedicated engine primitive for directional saves;
    consistent treatment with Desecrator and CSM vehicles generally
  (Fixed mojibake in the old header comment: "â€”" → "—", encoding artefact from migration)

## lords_of_war/lord_of_skulls.json

LORD OF SKULLS — Lords of War

SOURCE: Informacion/Escalation.ods, sheet "Lord of Skulls" (canonical datasheet —
  NOT in the Chaos Space Marines ENG HTML folder; this unit comes from the Escalation
  cross-faction Lords of War supplement, sheet "Lord of Skulls")
───────────────────────────────────────────────────────────────────────────

PROFILE:
  No.  NAME            M    WS  BS  S   FRONT  SIDE  REAR  I  A  HP  PTS
  1    Lord of Skulls  12"  3+  3+  10    13    13    11   4  4   5  680

EQUIPPED WITH: A Lord of Skulls is equipped with: Great cleaver of Khorne; Hades
  gatling cannon; Ichor cannon.

WEAPONS:
  Daemongore cannon                15"  Heavy 4   S9   AP-3  D3  AT(3), Flames, Overheating
  Gorestorm cannon                 15"  Heavy 6   S8   AP-3  D2  AT(2), Flames
  Great cleaver of Khorne - Strike  -   Melee     SD   AP-4  D3  AT(5)
  Great cleaver of Khorne - Sweep   -   Melee     SU   AP-3  D2  AT(3), Flurry(3)
  Hades gatling cannon             48"  Heavy 12  S8   AP-3  D1  AT(2), Suppression
  Ichor cannon                     48"  Heavy 1   S7   AP-4  D1  AT(1), Barrage, Seeking
  Skullhurler                      60"  Heavy 1   S9   AP-4  D2  AT(3), Colossal blast

OPTIONS:
  • May swap the Ichor cannon: Gorestorm cannon +49 / Daemongore cannon +61
  • May swap the Hades gatling cannon: Skullhurler +171

ABILITIES (verbatim): Mark of Khorne

UNIT TYPE: Super-heavy Vehicle
KEYWORDS: Lord of War

ENGINE STATUS:
  ✓ stats, pts, weapons, options all match the .ods sheet verbatim (Great Cleaver
    of Khorne Strike/Sweep sub-profiles correctly split into separate
    "<weapon> - <profile>" entries, same convention as the Knight datasheets)
  ✓ option_groups: TWO "one" structured replace groups — "May swap the Ichor cannon"
    (replaces:["Ichor cannon"], choices Gorestorm cannon +49 / Daemongore cannon +61)
    and "May swap the Hades gatling cannon" (replaces:["Hades gatling cannon"],
    choice Skullhurler +171) — both correctly modeled as optional single-target swaps
  ✓ locked_mark: "Khorne" — derived from the bare ABILITIES-section text "Mark of
    Khorne" (the source datasheet's entire ABILITIES line is just this one mark
    name, with no other compound rule text alongside it — DIFFERENT from Plagueburst
    Crawler/Miasmic Malignifier where "Mark of Nurgle" appears as part of a larger
    multi-rule ABILITIES block; here the mark consumes the whole field, correctly
    leaving abilities:[] empty rather than storing "Mark of Khorne" as a freestanding
    ability string)
  ✓ has_armory_access: false / has_veteran_abilities: false / no Mark-of-Chaos
    option_group (the mark is locked, not purchasable — consistent with how
    locked_mark units across CSM omit the "May receive a Mark of Chaos" picker)
  ✓ keywords: ["Chaos Space Marine", "Lord of War", "Vehicle"] — engine appends
    both "Chaos Space Marine" (faction tie-in for the per-faction LoW injection
    route) and "Vehicle" to the source's single "Lord of War" keyword; correct
    per the cross-faction supplement architecture — same pattern as the other 5 LoW units
  ✓ is_vehicle: true / unit_type: "Super-heavy Vehicle" / default_size: 1 /
    min_cost: 680 (no mandatory paid options — both swaps are optional single-picks)
  (Fixed mojibake in the old header comment: "â€”" → "—", encoding artefact from migration)

## troops/accursed_cultists.json

ACCURSED CULTISTS — Troops

SOURCE: Chaos Space Marines ENG / Accursed Cultists.html (canonical datasheet)
────────────────────────────────────────────────────────────────────────────────

PROFILE:
  No.    NAME              M    WS  BS  S  T  W  I  A  LD  SV   PTS
  10-15  Accursed Cultist  6"   4+  4+  4  3  1  3  1   6  6+     6
  1-3    Torment           6"   4+  4+  5  4  3  4  2   6  6+    16  [1 per 5 Accursed Cultist]

EQUIPPED WITH: Every Accursed Cultist is equipped with: Vile mutation.
  Every Torment is equipped with: Daemonic mutation.

WEAPONS:
  Vile mutation     —  Melee  U  AP-1  D1  —   [Accursed Cultist]
  Daemonic mutation —  Melee  U  AP-2  D1  —   [Torment]

OPTIONS:
  • All models may receive a Mark of Chaos (per model): K+1 / S+1 / N+1 / T+2
    (NO Undivided)
  • Per 5 Accursed Cultist models you may set up 1 Torment (HTML No. 1-3: min 1, max 3)

ABILITIES (verbatim):
  Unpredictable mutations: At the start of each battle round, before any unit activates,
    roll a D6 for each unit of Accursed Cultists. On a 4+, the controlling player may select
    one of the following until the end of the battle round: +1 Strength, +1 Toughness, or +1
    to ward saves (to a minimum of 4+).

UNIT TYPE: Infantry
KEYWORDS: Cultist

ENGINE STATUS:
  ✓ stats, pts match HTML exactly (Accursed S4/T3 + Torment S5/T4 W3) ✓
  ✓ both weapons match HTML exactly ✓
  ✓ marks: K/S/N+1 / T+2 only — no Undivided ✓
  ✓ Torment as separate model_type (min 1, max 3) per per_5 rule ✓
  ✓ default_size: 11 / min_cost: 76 (10×6 + 1×16) ✓
  ✓ has_veteran_abilities: false / no champion ✓

## troops/chaos_space_marines.json

CHAOS SPACE MARINES — Troops

SOURCE: Chaos Space Marines ENG / Chaos Space Marines.html (canonical datasheet)
──────────────────────────────────────────────────────────────────────────────────

PROFILE:
  No.   NAME                          M    WS  BS  S  T  W  I  A  LD  SV   PTS
  4-19  Chaos Space Marine            6”   3+  3+  4  4  2  4  2   7  3+    37
  1     Chaos Space Marine Champion   6”   3+  3+  4  4  2  4  2   7  3+    37
  *     Aspiring Champion             6”   3+  3+  4  4  2  4  2   8  3+    47  [upgrade]

EQUIPPED WITH: Every model is equipped with: Astartes Chainsword; Bolter; Bolt pistol;
  Frag grenades; Krak grenades.

WEAPONS:
  Astartes Chainsword          —    Melee         U  AP-1  D1  —
  Autocannon                  48”   Heavy 2       7  AP-2  D1  AT(1)
  Bolt pistol                 12”   Pistol 1      4  AP-1  D1  —
  Bolter                      24”   Rapid Fire 1  4  AP-1  D1  —
  Flamer                       9”   Assault 4     4  AP0   D1  Flames
  Frag grenade                 6”   Grenade 1     4  AP0   D1  Explosive
  Heavy bolter                36”   Rapid Fire 2  5  AP-2  D1  —
  Heavy chainaxe               —    Melee        +3  AP-3  D2  AT(1), Deadly(5+), Slow(-1), Unwieldy
  Krak grenade                 6”   Grenade 1     6  AP-2  D1  —
  Lascannon                   48”   Heavy 1       9  AP-4  D3  AT(3)
  Missile launcher - Frag     48”   Heavy 1       4  AP0   D1  Explosive
  Missile launcher - Krak     48”   Heavy 1       8  AP-3  D2  AT(2), Anti-Air
  Meltagun                    12”   Assault 1     8  AP-5  D1  AT(1), Melta
  Plasma gun - Standard       24”   Rapid Fire 1  7  AP-3  D1  AT(1)
  Plasma gun - Overcharged    24”   Rapid Fire 1  8  AP-4  D2  AT(2), Overheat
  Reaper chaincannon          24”   Assault 4     5  AP-1  D-1 Suppression

OPTIONS:
  • All models may receive a Mark of Chaos (per model): K+2 / S+2 / N+2 / T+5
    (NO Undivided for Troops, only 4 marks)
  • For each 5 models, 1 CSM may swap Bolter: Flamer+0 / Heavy bolter+13 / Meltagun+13 /
    Plasma gun+17 / Reaper chaincannon+19 / Autocannon+21 / Missile launcher+35 / Lascannon+64
    (HTML typo row 41: “Missle launcher” — TS correctly uses “Missile launcher”)
  • For each 5 models, 1 other CSM may swap Chainsword+Bolter+Bolt pistol: Heavy chainaxe +4
  • Champion may upgrade to Aspiring Champion +10 (armory access)
  • Up to 2 veteran abilities

ABILITIES: — (none)

UNIT TYPE: Infantry
KEYWORDS: Chaos Space Marine

ENGINE STATUS:
  ✓ stats, pts match HTML exactly (3 model profiles) ✓
  ✓ all 16 weapons match HTML exactly ✓
  ✓ marks: K/S/N/T only — no Undivided (correct for Troops) ✓
  ✓ per_n weapon swap groups ✓
  ✓ champion_has_armory: true / has_veteran_abilities: true / veteran_max: 2 ✓
  ✓ default_size: 5 / min_cost: 185 (5 × 37) ✓

## troops/cultists.json

CULTISTS — Troops

SOURCE: Chaos Space Marines ENG / Cultists.html (canonical datasheet)
──────────────────────────────────────────────────────────────────────

PROFILE:
  No.   NAME                       M    WS  BS  S  T  W  I  A  LD  SV   PTS
  9-29  Cultist                    6"   4+  4+  3  3  1  3  1   5  6+     5
  1     Cultist Champion           6"   4+  4+  3  3  1  3  1   5  6+     5
  *     Aspiring Cultist Champion  6"   4+  4+  3  3  1  3  1   6  6+    10  [upgrade]

EQUIPPED WITH: Every model is equipped with: Crude melee weapon; Machine pistol.

WEAPONS:
  Crude melee weapon  —    Melee         U  AP0  D1  —
  Flamer              9"   Assault 4     4  AP0  D1  Flames         [option, per 10 models]
  Frag grenade        6"   Grenade 1     4  AP0  D1  Explosive
  Grenade launcher   24"   Rapid Fire 1  4  AP0  D1  Explosive      [option, per 10 models]
  Heavy machine gun  36"   Heavy 3       4  AP0  D1  Suppression    [option, per 10 models]
  Machine gun        24"   Rapid Fire 1  3  AP0  D1  —              [option swap]
  Machine pistol     12"   Pistol 1      3  AP0  D1  —

OPTIONS:
  • All models may receive a Mark of Chaos (per model): K+1 / S+1 / N+1 / T+2
    (NO Undivided for Cultists)
  • Any model may swap Machine pistol: Machine gun +0
  • For each 10 models, 1 Cultist may replace Machine pistol with:
    Grenade launcher +4 / Flamer +5 / Heavy machine gun +9
  • Cultist Champion may upgrade to Aspiring Cultist Champion +5 (armory access)

ABILITIES: — (none)

UNIT TYPE: Infantry
KEYWORDS: Cultist

ENGINE STATUS:
  ✓ stats, pts match HTML exactly (3 model profiles) ✓
  ✓ all 7 weapons match HTML exactly ✓
  ✓ marks: K/S/N+1 / T+2 only — no Undivided ✓
  ✓ per_n weapon swap groups ✓
  ✓ champion_has_armory: true / has_veteran_abilities: false ✓
  ✓ default_size: 10 / min_cost: 50 ✓

## troops/jakhals.json

JAKHALS — Troops

SOURCE: Chaos Space Marines ENG / Jakhals.html (canonical datasheet)
────────────────────────────────────────────────────────────────────

PROFILE:
  No.   NAME                      M    WS  BS  S  T  W  I  A  LD  SV   PTS
  7-11  Jakhal                    6”   4+  4+  3  3  1  3  2   5  6+     7
  1     Jakhal Pack Leader        6”   4+  4+  3  3  1  3  2   5  6+     7
  *     Aspiring Jakhal Champion  6”   4+  4+  3  3  1  3  2   6  6+    12  [upgrade]
  0-4   Dishonored                6”   4+  4+  4  3  1  3  2   5  6+     7  [S4!]

EQUIPPED WITH: Every Jakhal and Jakhal Pack Leader is equipped with: Autopistol; Chainblades.
  Every Dishonored is equipped with: Chainblades.

WEAPONS:
  Autopistol       12”  Pistol 1  3  AP0   D1  —
  Chainblade        —   Melee     U  AP-1  D1  —
  Mauler chainblade —   Melee    +1  AP-1  D1  —       [option, per 8 Jakhal]
  Skullsmasher      —   Melee    +2  AP-1  D1  —       [option, per 8 Dishonored ×2]

OPTIONS:
  • For every 8 models in the unit, one Jakhal may swap Chainblade: Mauler chainblade +1
  • For every 8 models in the unit, two Dishonored may swap Chainblades: Skullsmasher +2
  • Pack Leader can be promoted to Aspiring Jakhal Champion +5 (armory access)

ABILITIES (verbatim):
  Berserk(5+), Mark of Khorne

UNIT TYPE: Infantry
KEYWORDS: World Eaters
  (locked_mark: “Khorne” — innate mark, no mark option group)

ENGINE STATUS:
  ✓ stats, pts match HTML exactly (3 model types + Dishonored sub-type) ✓
  ✓ all 4 weapons match HTML exactly ✓
  ✓ per_n swap groups with applies_to_model filter ✓
  ✓ locked_mark: “Khorne” / champion_has_armory: true ✓
  ✓ default_size: 8 (7 Jakhal + 1 Pack Leader) / min_cost: 56 ✓

## troops/mutants.json

MUTANTS — Troops

SOURCE: Chaos Space Marines ENG / Mutants.html (canonical datasheet)
────────────────────────────────────────────────────────────────────

PROFILE:
  No.    NAME         M    WS  BS  S  T  W  I  A  LD  SV   PTS
  15-30  Mutant       6”   4+  5+  3  4  1  3  2   5  5+     6
  *      Mutant Boss  6”   4+  5+  3  4  1  3  2   6  5+    11  [champion, armory access]

EQUIPPED WITH: Every model is equipped with: Crude melee weapon; Frag grenades.

WEAPONS:
  Crude melee weapon   —    Melee         U  AP0  D1  —
  Flamer              9''   Assault 4     4  AP0  D1  Flames          [option, 3 max]
  Frag grenade         6”   Grenade 1     4  AP0  D1  Explosive
  Heavy machine gun   36”   Heavy 3       4  AP0  D1  Suppression     [option, 3 max]
  Machine gun         24”   Rapid Fire 1  3  AP0  D1  —               [option, per model]
  Machine pistol      12”   Pistol 1      3  AP0  D1  —               [option, per model]

OPTIONS:
  • Entire unit may receive one of the following upgrades per model:
    Burly/brawny/goatheaded +1 / Horrifying/hypnotic/brightly coloured +1 /
    Leaping/floating/winged +2 / Bloated +3
  • Any model may swap Crude melee weapon: Crude melee weapon & Machine pistol +1 / Machine gun +1
  • Up to 3 models may swap Crude melee weapon: Flamer +8 / Heavy machine gun +8
  • Mutant Boss upgrade (1 per unit): armory access, +5 pts

ABILITIES (verbatim):
  Upgrades:
  Bloated: The model gains a 4+ armor save.
  Burly, brawny or goatheaded: The model gains +1 Strength.
  Horrifying, hypnotic or brightly coloured: The unit gains the cumulative ability “Terrifying(-1)”.
  Leaping, floating or winged: The model gains the “Anti-Grav” and “Haste(1”)” abilities.

UNIT TYPE: Infantry
KEYWORDS: Cultist
  (NO marks, no Chaos Space Marine keyword)

ENGINE STATUS:
  ✓ stats, pts match HTML exactly (min 15, max 30) ✓
  ✓ all 6 weapons match HTML exactly ✓
  ✓ 4 upgrade choices with stat_mod/grants_abilities effects ✓
  ✓ per-model and fixed_max swap groups ✓
  ✓ Mutant Boss as variant_model, champion_has_armory: true ✓
  ✓ no marks (locked_mark: null, no mark option_group) ✓
  ✓ default_size: 15 / min_cost: 90 ✓

## troops/poxwalkers.json

POXWALKERS — Troops

SOURCE: Chaos Space Marines ENG / Poxwalkers.html (canonical datasheet)
────────────────────────────────────────────────────────────────────────

PROFILE:
  No.    NAME        M    WS  BS  S  T  W  I  A  LD  SV   PTS
  10-21  Poxwalker   6"   4+  4+  3  4  1  2  1   5  6+     3

EQUIPPED WITH: Each model is equipped with: Improvised weapons.

WEAPONS:
  Improvised weapons  —  Melee  U  AP0  D1  —

OPTIONS: — (none)

ABILITIES (verbatim, confirmed against .ods 2026-06-14):
  Mark of Nurgle
  Mindless: The unit automatically passes every Leadership test. It can contest mission
    objectives, but never hold them.
  Slaves of Darkness: You may not select more Poxwalker units than Plague Marine units.

UNIT TYPE: Infantry
KEYWORDS: Death Guard
  (locked_mark: "Nurgle" — innate mark, no mark option group)

ENGINE STATUS:
  ✓ stats, pts match HTML exactly ✓
  ✓ weapon matches HTML exactly ✓
  ✓ no options ✓
  ✓ locked_mark: "Nurgle" / has_veteran_abilities: false ✓
  ✓ default_size: 10 / min_cost: 30 ✓
  ✓ abilities[] text confirmed verbatim-correct against .ods ✓

## troops/traitor_guard.json

TRAITOR GUARD — Troops

SOURCE: Chaos Space Marines ENG / Traitor Guard.html (canonical datasheet)
──────────────────────────────────────────────────────────────────────────────

PROFILE:
  No.   NAME                M    WS   BS   S  T  W  I  A  LD  SV  PTS
  10-30 Traitor Guardsman   6"   4+   4+   3  3  1  3  1   6  5+   8
  *     Traitor Sergeant    6"   4+   4+   3  3  1  3  1   7  5+  13  (variant, +5pts)
  0-3   Chaos Ogryn         6"   4+   -    5  5  3  3  4   6  5+  28  (per 10 models)

EQUIPPED WITH:
  Every Traitor Guardsman: Lasgun, Frag grenades.
  Every Chaos Ogryn: Power maul.

OPTIONS:
  Marks (per model): Khorne+1 / Slaanesh+1 / Nurgle+1 / Tzeentch+2 (NO Undivided)
  Each model Lasgun -> Chainsword + Laspistol (free)
  Per 10 models: 1 Guardsman -> Flamer+5 / Meltagun+11 / Plasma gun+15
  For each 10 models: 1 Chaos Ogryn (0-3 max)
  Traitor Sergeant: armory access (+5pts)

ABILITIES:
  Bodyguard (Chaos Ogryn only): wounds allocated to Ogryn first; Precision attacks -1 hit.

KEYWORDS: Cultist
UNIT TYPE: Infantry

ENGINE STATUS:
  Multi-group: Guardsmen (10-30) + Sergeant (variant) + Ogryn (0-3).
  Per-10 rule for Ogryn enforced via applies_to_model cap.
  Bug2 (ki-bug-mixedmodel-pricing-01): Traitor Guard additional-model cost uses Ogryn price — deferred.

## troops/tzaangors.json

TZAANGORS — Troops

SOURCE: Chaos Space Marines ENG / Tzaangors.html (canonical datasheet)
────────────────────────────────────────────────────────────────────────

PROFILE:
  No.   NAME               M    WS  BS  S  T  W  I  A  LD  SV   PTS
  8-17  Tzaangor           6"   4+  4+  3  3  1  3  2   6  6+    10
  1     Twistbray          6"   4+  4+  3  3  1  3  2   6  6+    10
  *     Aspiring Twistbray 6"   4+  4+  3  3  1  3  2   7  6+    15  [upgrade]

EQUIPPED WITH: Each model is equipped with: Chainsword; Autopistol.
  (HTML row 7 equipped text says "Machine pistol" but weapon table names it "Autopistol" —
  HTML internal inconsistency; TS correctly uses "Autopistol" per the weapon table.)

WEAPONS:
  Autopistol      12"  Pistol 1  3  AP0   D1  —
  Chainsword       —   Melee     U  AP-1  D1  —
  Eldritch shield  —   Melee     U  AP-1  D1  Deflect, Parry  [replaces Autopistol+Chainsword]

OPTIONS:
  • One model may take an Icon of Chaos +10
  • One model may take an Instrument of Chaos +5
  • All models may replace Autopistol and Chainsword: Eldritch shield +2 per model
  • Twistbray can be promoted to Aspiring Twistbray +5 (armory access)

ABILITIES (verbatim):
  Mark of Tzeentch
  Eldritch Shield: The model gains the abilities "Deflect" and "Parry".

UNIT TYPE: Infantry
KEYWORDS: Thousand Sons
  (locked_mark: "Tzeentch" — innate mark, no mark option group)

ENGINE STATUS:
  ✓ stats, pts match HTML exactly (3 profiles) ✓
  ✓ all 3 weapons match HTML exactly ✓
  ✓ locked_mark: "Tzeentch" / champion_has_armory: true ✓
  ✓ Icon+Instrument fixed_max groups ✓
  ✓ Eldritch shield every-model replace group ✓
  ✓ default_size: 9 (8 Tzaangor + 1 Twistbray) / min_cost: 90 ✓
