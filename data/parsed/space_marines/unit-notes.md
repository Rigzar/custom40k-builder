# space_marines - notes kept from the unit files

These were the header comments of the old .ts unit files. The unit files are pure JSON now, which cannot carry a comment.

## elites/armiger.json

ARMIGER — Elites
SOURCE: Informacion/Escalation.ods, sheet "Armiger" (Escalation cross-faction
  Lords of War supplement; not in the Space Marines ENG HTML).

SLOT FIX (2026-06-22, user-reported): the .ods sheet for Armiger has NO trailing
"KEYWORDS / Lord of War" row (unlike Knight Castellan/Knight Paladin/Warhound, which
all do) — instead its own ABILITIES carry "Elite: Imperial armies may select units of
Armigers as an Elite choice.", the exact same override pattern as CSM's "War Dog"
(ki-escalation-wardog-engagement-gate-01). Was previously filed under the Lords of War
slot (with a guessed `keywords: ["Lord of War"]` — see escalation.md §7, "Armiger ...
given keywords: ['Lord of War'] for consistency", a guess that turned out wrong given
this override). Moved to Elites, `keywords: []`, and gated to Epic Battle via
`requires_engagement` since it's still an Escalation-supplement datasheet.
ENGAGEMENT (author ruling, Discord 2026-09-22): "Armigers are supposed to be available
in Pitched Battle, same as War Dogs." Both were gated to Epic Battle on OUR reasoning
that Escalation is an Epic supplement — an assumption written down as a comment and
never put to him. The sheets say nothing about an engagement; the "Elite" override is
the whole rule. Now ["pitched", "epic"]. Skirmish is still excluded: he named Pitched,
and guessing past a ruling is what caused this in the first place.

## elites/deathwing_knights.json

DEATHWING KNIGHTS — Elites

SOURCE: Space Marines ENG.ods, "Deathwing Knights" sheet (canonical datasheet)
───────────────────────────────────────────────────────────────────────────

EQUIPPED WITH: Every model is equipped with: Power sword; Storm shield.

OPTIONS:
  • Each model may replace their Power sword: Mace of Absolution +1pt
  • The Knight Master may replace his Power sword: Relic blade +7pts / Flail of the Unforgiven +8pts
  • The Knight Master has access to weapons and gear from the Armory.
  • The unit may gain one Veteran ability.

ENGINE STATUS:
  🔴 The Knight Master's own "replace his Power sword" group had NO `replaces` link (found
     2026-06-21, global replaces audit) — added `replaces: ["Power sword"]`. Safe to sum with
     the squad-wide group above (both share one Power-sword-per-model pool across the unit's
     single combined `item.size`, unlike Carnifex Brood/Talos which have 2 weapon COPIES per
     model — same accumulation pattern already used for Traitor Guard's dual-group Lasgun swap).

## heavy_support/desolation_squad.json

DESOLATION SQUAD — Heavy Support

SOURCE: Codex/Space Marines 1.04.ods, sheet "Desolation Squad". Verbatim:

  5-10  Desolation Marine            6" 3+ 3+ S4 T4 W2 I4 A2 Ld7 Sv3+   70 pts
  1     Desolation Sergeant          6" 3+ 3+ S4 T4 W2 I4 A2 Ld7 Sv3+   70 pts
  *     Veteran Desolation Sergeant  6" 3+ 3+ S4 T4 W2 I4 A2 Ld8 Sv3+   80 pts
  Every model is equipped with: Castellan missile launcher; Bolt pistol; Frag grenades;
  Krak grenades.

  Castellan missile launcher *
  - Castellan missile   36"  Assault 1  4  -1  1   Blast(4), Indirect
  - Krak missile        48"  Heavy 1    8  -3  2   AT(2), Anti-air
  Vengor launcher *
  - Castellan missile   36"  Assault 1  5  -1  1   Blast(4), Seeking
  - Vengor missile      48"  Heavy 1    9  -3  2   AT(2), Anti-air

  OPTIONS
  • The Desloation Sergeant may swap their Castellan missile launcher: Vengor launcher +3
  • The Desolation Sergeant may be upgraded to a Veteran Desolation Sergeant for +10 points
    and gains access to weapons and gear from the Armory.

THE 1.03 -> 1.04 RESTRUCTURE (September 2026) — this is not just a re-price:
  · 51/51/61 -> 70/70/80 pts, and the Vengor swap 22 -> 3.
  · The separate "Krak missile launcher" weapon is GONE, and with it the "Every model may
    swap their Castellan missile launcher -> Krak missile launcher +19" option. The Krak missile
    is now simply the SECOND PROFILE of the standard Castellan missile launcher, so every model
    has it for free.
  · Both launchers lose their "Frag missile" profile; the Castellan profile becomes Assault 1
    with Indirect (Seeking survives only on the Vengor launcher's Castellan profile, at S5).
Dropping an option group renumbers the ones after it, and `optionQty` is keyed by group INDEX -
so the removal is registered in engine/unitRenames.ts (REMOVED_OPTION_GROUPS) and saved lists
are shifted on load. Without that, a saved squad's Veteran upgrade would come back as a Vengor.

ABILITY VOCABULARY: the sheet is written in the POST-clean-up names (Blast(4)); stored here in
the pre-clean-up vocabulary the other ~1400 profiles still use (Explosive), to be renamed with
everything else when that lands atomically.

## heavy_support/eradicator_squad.json

ERADICATOR SQUAD — Heavy Support

SOURCE (canonical — Space Marines ENG/Eradicator Squad.html)
────────────────────────────────────────────────────────────────────
PROFILES:
  2-5  Eradicator Marine       M:6" WS:3+ BS:3+ S:4 T:5 W:2 I:4 A:2 LD:7 SV:3+ — 53 pts
  1    Eradicator Sergeant     M:6" WS:3+ BS:3+ S:4 T:5 W:2 I:4 A:2 LD:7 SV:3+ — 53 pts
  *    Veteran Eradicator Sgt  M:6" WS:3+ BS:3+ S:4 T:5 W:2 I:4 A:2 LD:8 SV:3+ — 63 pts
  (Gravis armour; T:5.)
EQUIPPED WITH: Every model: Melta rifle; Bolt pistol; Frag grenades; Gravis armor; Krak grenades.
WEAPONS:
  Bolt pistol         12" Pistol 1  S:4 AP:-1 D:1 -
  Heavy bolter        36" Rapid Fire 2 S:5 AP:-2 D:1 -
  Heavy melta rifle   18" Assault 1 S:8 AP:-5 D:2 AT(2), Melta
  Melta rifle         18" Assault 1 S:8 AP:-5 D:1 AT(1), Melta
  Multi-melta         24" Assault 1 S:8 AP:-5 D:2 AT(2), Melta
OPTIONS:
  For every 3 models, one Marine may swap Melta rifle: Multi-melta +19
  All remaining models may swap Melta rifle: Heavy bolter +0 / Heavy melta rifle +18
  Eradicator Sergeant → Veteran Eradicator Sergeant +10 pts + armory.
ABILITIES:
  Combat squads, Massive(1), They Shall Know No Fear, Unyielding
  Gravis armor: The model gains a 6+ ward save.
UNIT TYPE: Infantry

ENGINE STATUS (audited 2026-09-24): ✓ all data matches sheet exactly — no changes needed.
  armourKeyword:"Gravis" ✓. champion_has_armory:true (vet upgrade grants armory).
  default_size:3 (2 Marines + 1 Sergeant) / min_cost:159 (3×53) ✓.

## hq/captain_dreadnought.json

CAPTAIN DREADNOUGHT — HQ

SOURCE (canonical — Space Marines ENG/Captain Dreadnought.html)
──────────────────────────────────────────────────────────────
PROFILE: 1 Captain Dreadnought — M:6" WS:2+ BS:2+ S:6 FRONT:12 SIDE:12 REAR:10 I:5 A:3 HP:3 — 241 pts
EQUIPPED WITH: Dreadnought close combat weapon; Heavy flamer.
WEAPONS:
  Assault cannon         24" Heavy 4  S:6  AP:-2 D:1  Armor piercing(5+)
  Dreadnought cccw        -  Melee    S:x2 AP:-3 D:2  AT(2)
  Heavy flamer           9" Assault 4 S:5  AP:-1 D:1  Flames
  Plasma cannon - Standard  36" Heavy 1 S:7  AP:-3 D:1  AT(1), Explosive
  Plasma cannon - Overcharged 36" Heavy 1 S:8 AP:-4 D:2  AT(2), Explosive, Overheating
  Storm bolter           24" Rapid Fire 2 S:4 AP:-1 D:1  -
  Twin lascannon         48" Heavy 2  S:9  AP:-4 D:3  AT(3)
OPTIONS:
  Must pick one weapon: DCCW+Heavy flamer +29, DCCW+Storm bolter +33, Assault cannon +40,
    Plasma cannon +123, Twin lascannon +173
  May swap the Heavy flamer: Storm bolter +5
  Only one Captain or Captain Dreadnought per army.
  Has access to vehicle equipment from the Armory.
  Can gain one Veteran ability.
ABILITIES:
  Combat Tactics: assigns 2 free Vet abilities at deployment (self + 1 friendly unit, same ability).
  Furioso: two melee weapons → +2A.
  Refractor field: 5+ inv save.
UNIT TYPE: Vehicle, Walker

ENGINE STATUS: ✓ all data matches HTML. is_vehicle:true → vehicle armory access correct.

## hq/chaplain.json

CHAPLAIN — HQ

SOURCE (canonical — Space Marines ENG/Chaplain.html)
──────────────────────────────────────────────────
PROFILE:
  1 Chaplain          M:6" WS:2+ BS:3+ S:4 T:4 W:4 I:5 A:2 LD:8 SV:3+ — 131 pts
  * Master of Sanctity M:6" WS:2+ BS:3+ S:4 T:4 W:4 I:5 A:3 LD:9 SV:3+ — 146 pts
EQUIPPED WITH: Crozius Arcanum; Frag grenades; Krak grenades.
WEAPONS:
  Frag grenade   6"  Grenade 1  S:4  AP:0  D:1  Explosive
  Krak grenade   6"  Grenade 1  S:6  AP:-2 D:1  -
  Crozius Arcanum  - Melee      S:+2 AP:-2 D:2  -
OPTIONS:
  One Chaplain per army can be upgraded to a Master of Sanctity for +15 points.
  Only one Master of Sanctity or Chaplain Dreadnought per army.
  Has access to weapons and gear from the Armory.
  Can gain one Veteran ability.
ABILITIES:
  They Shall Know No Fear
  Faithful: recite 1 prayer/round on 3+; knows all prayers of a selected list.
  Master of Sanctity: recite 1 additional prayer per turn.
  Rosarius: 4+ inv save.
UNIT TYPE: Character model, Infantry

ENGINE STATUS: ✓ all data matches HTML. is_priest:true correct (Faithful ability).

## hq/chaplain_dreadnought.json

CHAPLAIN DREADNOUGHT — HQ

SOURCE (canonical — Space Marines ENG/Chaplain Dreadnought.html)
────────────────────────────────────────────────────────────────
PROFILE: 1 Chaplain Dreadnought — M:6" WS:2+ BS:2+ S:6 FRONT:12 SIDE:12 REAR:10 I:5 A:3 HP:3 — 251 pts
EQUIPPED WITH: Dreadnought close combat weapon; Heavy flamer.
WEAPONS:
  Assault cannon          24" Heavy 4   S:6  AP:-2 D:1  Armor piercing(5+)
  Dreadnought cccw         -  Melee     S:x2 AP:-3 D:2  AT(2)
  Heavy flamer            9"  Assault 4 S:5  AP:-1 D:1  Flames
  Inferno cannon          12" Heavy 6   S:6  AP:-2 D:1  Flames
  Multi-melta             24" Assault 1 S:8  AP:-5 D:2  AT(2), Melta
  Plasma cannon - Standard  36" Heavy 1 S:7  AP:-3 D:1  AT(1), Explosive
  Plasma cannon - Overcharged 36" Heavy 1 S:8 AP:-4 D:2 AT(2), Explosive, Overheating
  Storm bolter            24" Rapid Fire 2 S:4 AP:-1 D:1  -
  Twin lascannon          48" Heavy 2   S:9  AP:-4 D:3  AT(3)
OPTIONS:
  Must pick one weapon: Inferno cannon +20, DCCW+Heavy flamer +29, DCCW+Storm bolter +33,
    Assault cannon +40, Multi-melta +46, Plasma cannon +123, Twin lascannon +173
  May swap the Heavy flamer: Storm bolter +5
  Only one Master of Sanctity or Chaplain Dreadnought per army.
  Has access to vehicle equipment from the Armory.
  Can gain one Veteran ability.
ABILITIES:
  Faithful: recite 2 prayers/round on 3+; knows all prayers of a selected list.
    (NOTE: Chaplain Dreadnought recites 2/round vs Chaplain's 1/round — correct.)
  Furioso: two melee weapons → +2A.
  Reliquary: 5+ inv save.
  (No TSKNF — Vehicle unit type, not creature.)
UNIT TYPE: Vehicle, Walker

ENGINE STATUS: ✓ all data matches HTML. is_priest:true correct. is_vehicle:true → vehicle armory.

## hq/emperors_champion.json

EMPEROR'S CHAMPION — HQ

SOURCE (canonical — Space Marines ENG/Emperor's Champion.html)
──────────────────────────────────────────────────────────────
PROFILE: 1 Emperor's Champion — M:6" WS:2+ BS:3+ S:4 T:4 W:4 I:5 A:3 LD:8 SV:2+ — 139 pts
EQUIPPED WITH: The Black Sword; Frag grenades; Krak grenades.
WEAPONS:
  The Black Sword — Swing attack:    - Melee S:+1 AP:-3 D:2  Flurry(1)
  The Black Sword — Piercing strike: - Melee S:x2 AP:-3 D:2  AT(2), Slow(-2)
  Frag grenade  6"  Grenade 1  S:4  AP:0  D:1  Explosive
  Krak grenade  6"  Grenade 1  S:6  AP:-2 D:1  -
OPTIONS:
  An army may only contain 1 Emperor's Champion. He also counts as a Chapter champion.
  Has access to weapons and gear from the Armory.
  Can gain one Veteran ability.
ABILITIES:
  They Shall Know No Fear
  The Armor of Faith: 4+ inv save.
  Honor or Death: enemy HQ/Character within 10" → Order forced to Charge (must engage).
  Martial superiority: re-roll 1 hit and 1 wound.
  Oath: choose at start of combat round 1 — affects all SM creatures army-wide:
    Abhor the Witch: all units get Aegis(5+); no psykers allowed.
    Accept any Challenge: all units +1S +1LD; must charge enemy within 12"; no flee.
    Uphold the Honour of the Emperor: +1 armour save vs ranged; no cover.
UNIT TYPE: Character model, Infantry

ENGINE STATUS: ✓ all data matches HTML. The "Oath" ability contains three sub-choices — informational
  only in builder (no engine enforcement of oath effects at runtime yet).

## hq/librarian.json

LIBRARIAN — HQ

SOURCE (canonical — Space Marines ENG/Librarian.html)
─────────────────────────────────────────────────────
PROFILE:
  1 Librarian       M:6" WS:3+ BS:3+ S:4 T:4 W:4 I:5 A:2 LD:8 SV:3+ — 99 pts
  * Chief Librarian M:6" WS:3+ BS:3+ S:4 T:4 W:4 I:5 A:3 LD:9 SV:3+ — 114 pts
EQUIPPED WITH: Frag grenades; Krak grenades.
WEAPONS:
  Frag grenade  6"  Grenade 1  S:4  AP:0  D:1  Explosive
  Krak grenade  6"  Grenade 1  S:6  AP:-2 D:1  -
OPTIONS:
  One Librarian per army can be upgraded to a Chief Librarian for +15 points.
  Only one Chief Librarian or Librarian Dreadnought per army.
  Has access to weapons and gear from the Armory.
  Can gain one Veteran ability.
ABILITIES:
  They Shall Know No Fear
  Chief Librarian: cast and deny 1 additional power per battle round.
  Psychic hood: +1 to deny enemy psychic powers.
  Psyker: cast 1 / deny 1 per round; knows Smite + all powers from a chosen discipline.
UNIT TYPE: Character model, Infantry

ENGINE STATUS: ✓ all data matches HTML. is_psyker:true. Disciplines gated in PsychicModal
  via SM_LEGACY_DISC_MAP (legacy-specific disciplines) + Librarius (general). Chief Librarian
  upgrade via variant_link; validator enforces "only one Chief Librarian or Librarian Dreadnought".

## hq/librarian_dreadnought.json

LIBRARIAN DREADNOUGHT — HQ

SOURCE (canonical — Space Marines ENG/Librarian Dreadnought.html)
─────────────────────────────────────────────────────────────────
PROFILE: 1 Librarian Dreadnought — M:6" WS:2+ BS:2+ S:6 FRONT:12 SIDE:12 REAR:10 I:5 A:3 HP:3 — 278 pts
EQUIPPED WITH: Dreadnought close combat weapon; Furioso psy halberd; Heavy flamer.
WEAPONS:
  Dreadnought cccw    -   Melee     S:x2 AP:-3 D:2  AT(2)
  Furioso psy halberd -   Melee     S:+2 AP:-4 D:2  AT(2), Extra attack, Force weapon
  Melta               12" Assault 1 S:8  AP:-5 D:1  AT(1), Melta
  Heavy flamer        9"  Assault 4 S:5  AP:-1 D:1  Flames
  Storm bolter        24" Rapid Fire 2 S:4 AP:-1 D:1  -
OPTIONS:
  May swap the Heavy flamer: Storm bolter +5, Melta +13
  Only one Chief Librarian or Librarian Dreadnought per army.
  Has access to vehicle equipment from the Armory.
  Can gain one Veteran ability.
ABILITIES:
  Psionic shield: 5+ inv save.
  Psychic hood: +1 to deny enemy psychic powers.
  Psyker: cast 2 / deny 2 per round; knows Smite + all powers from a chosen discipline.
  (No TSKNF — Vehicle unit type, not creature.)
UNIT TYPE: Vehicle, Walker

ENGINE STATUS: ✓ all data matches HTML. is_psyker:true, is_vehicle:true → vehicle armory.
  Disciplines gated via SM_LEGACY_DISC_MAP same as Librarian. Validator enforces uniqueness.

## hq/lieutenant.json

LIEUTENANT — HQ

SOURCE (canonical — Space Marines ENG/Lieutenant.html)
──────────────────────────────────────────────────────
PROFILE:
  1 Lieutenant M:6" WS:2+ BS:2+ S:4 T:4 W:4 I:5 A:2 LD:8 SV:3+ — 79 pts
  * Captain    M:6" WS:2+ BS:2+ S:4 T:4 W:4 I:5 A:3 LD:9 SV:3+ — 94 pts
EQUIPPED WITH: Frag grenades; Krak grenades.
WEAPONS:
  Frag grenade  6"  Grenade 1  S:4  AP:0  D:1  Explosive
  Krak grenade  6"  Grenade 1  S:6  AP:-2 D:1  -
OPTIONS:
  One Lieutenant per army can be upgraded to a Captain for +15 points.
  Has access to weapons and gear from the Armory.
  Can gain one Veteran ability.
ABILITIES:
  They Shall Know No Fear
  Combat Tactics: assigns 1 free Vet ability at deployment (self + 1 friendly unit, same ability).
  Captain: may use Combat Tactics a second time.
UNIT TYPE: Character model, Infantry

ENGINE STATUS: ✓ all data matches HTML. Captain upgrade via variant_link correct.
  Validator checks Captain variant for "only one Captain or Captain Dreadnought per army" rule.

## lords_of_war/fellblade.json

FELLBLADE — Lords of War
SOURCE: Informacion/Escalation.ods, sheet "Fellblade" (Escalation cross-faction
  Lords of War supplement; not in the Space Marines ENG HTML).

## lords_of_war/knight_castellan.json

KNIGHT CASTELLAN — Lords of War
SOURCE: Informacion/Escalation.ods, sheet "Knight Castellan" (Escalation
  cross-faction Lords of War supplement; not in the Space Marines ENG HTML).
"wether" preserved verbatim from the canonical Ion shield ability text
  (FAQ #5 / golden rule — same typo as the CSM Knight Desecrator).

## lords_of_war/knight_paladin.json

KNIGHT PALADIN — Lords of War
SOURCE: Informacion/Escalation.ods, sheet "Knight Paladin" (Escalation
  cross-faction Lords of War supplement; not in the Space Marines ENG HTML).
"wether" and "canon" preserved verbatim from the canonical text
  (FAQ #5 / golden rule — same typo as the CSM Knight Desecrator).

## lords_of_war/spartan.json

SPARTAN — Lords of War
SOURCE: Informacion/Escalation.ods, sheet "Spartan" (Escalation cross-faction
  Lords of War supplement; not in the Space Marines ENG HTML).

## lords_of_war/warhound.json

WARHOUND — Lords of War
SOURCE: Informacion/Escalation.ods, sheet "Warhound" (Escalation cross-faction
  Lords of War supplement; not in the Space Marines ENG HTML).
min_cost = 524 base + cheapest mandatory pick (Inferno gun, +84) ×2, since
  "equipped with: -" and both "Must pick two weapons" groups are required.

## troops/assault_intercessor_squad.json

ASSAULT INTERCESSOR SQUAD — Troops

SOURCE (canonical — Space Marines ENG/Assault Intercessor Squad.html)
───────────────────────────────────────────────────────────────────────
PROFILES:
  4-9  Intercessor Marine      M:6" WS:3+ BS:3+ S:4 T:4 W:2 I:4 A:2 LD:7 SV:3+ — 35 pts
  1    Intercessor Sergeant    M:6" WS:3+ BS:3+ S:4 T:4 W:2 I:4 A:2 LD:7 SV:3+ — 35 pts
  *    Veteran Intercessor Sgt M:6" WS:3+ BS:3+ S:4 T:4 W:2 I:4 A:2 LD:8 SV:3+ — 45 pts
EQUIPPED WITH: Every model: Astartes chainsword; Frag grenades; Heavy bolt pistol; Krak grenades.
WEAPONS:
  Astartes chainsword  -   Melee    S:U  AP:-1 D:1  -
  Heavy bolt pistol   12" Pistol 1  S:4  AP:-2 D:1  -
  Frag grenade         6" Grenade 1 S:4  AP:0  D:1  Explosive
  Krak grenade         6" Grenade 1 S:6  AP:-2 D:1  -
OPTIONS:
  Two Intercessor Marines may swap their Astartes chainsword: Power sword +2 / Power fist +11
  (NEW 2026-09-24 per author's sheet — this squad had no weapon options before.)
  Intercessor Sergeant → Veteran Intercessor Sergeant +10 pts + armory.
ABILITIES: Combat squads, They Shall Know No Fear
UNIT TYPE: Infantry

ENGINE STATUS: ✓ all data matches sheet. champion_has_armory:true (vet upgrade grants armory).
  Chainsword swap modeled as fixed_max{2}, shared pool across both choices, matching Big
  Mutants' own "Up to two models" shape.

## troops/blood_claws.json

BLOOD CLAWS — Troops

SOURCE (canonical — Space Marines ENG/Blood Claws.html)
────────────────────────────────────────────────────────
PROFILES:
  9  Blood Claw            M:6" WS:4+ BS:4+ S:4 T:4 W:2 I:4 A:2 LD:6 SV:3+ — 35 pts
  1  Blood Claw Pack Leader M:6" WS:4+ BS:4+ S:4 T:4 W:2 I:4 A:2 LD:6 SV:3+ — 35 pts
     (Fixed unit size: exactly 10 models — 9 Blood Claws + 1 Pack Leader.)
EQUIPPED WITH: Every model: Astartes Chainsword; Bolt pistol; Frag grenades; Krak grenades.
WEAPONS:
  Astartes chainsword    -   Melee        S:U  AP:-1 D:1  -
  Bolt pistol           12" Pistol 1      S:4  AP:-1 D:1  -
  Flamer                 9" Assault 4     S:4  AP:0  D:1  Flames
  Melta                 12" Assault 1     S:8  AP:-5 D:1  AT(1), Melta
  Plasma gun (Standard) 24" Rapid Fire 1  S:7  AP:-3 D:1  AT(1)
  Plasma gun (Overheating) 24" Rapid Fire 1 S:8 AP:-4 D:2 AT(2), Overheating
  Plasma pistol (Standard)   12" Pistol 1 S:7  AP:-3 D:1  AT(1)
  Plasma pistol (Overcharged) 12" Pistol 1 S:8 AP:-4 D:2  AT(2), Overheating
  Frag grenade           6" Grenade 1     S:4  AP:0  D:1  Explosive
  Krak grenade           6" Grenade 1     S:6  AP:-2 D:1  -
OPTIONS:
  All models may gain Jump packs +8 pts/model → +6"M, unit type becomes Jump Pack Infantry,
    counts as Fast Attack.
  Two Blood Claws may swap their Astartes chainsword: Flamer+3, Melta+9, Plasma gun+13
  One Blood Claw may swap their Bolt pistol: Plasma pistol+4
  Pack Leader has direct armory access (no veteran upgrade required).
ABILITIES: Blind Rage, Furious Charge, They Shall Know No Fear
UNIT TYPE: Infantry (Jump Pack Infantry if jump packs taken)

ENGINE STATUS: ✓ all data matches ODS. champion_has_armory:true + armory_weapons_only:true
  (Pack Leader has weapons-only access; not all models). set_unit_type "Jump Pack Infantry"
  + stat_mod M+6 on jump pack option correct.

## troops/grey_hunters.json

GREY HUNTERS — Troops

SOURCE (canonical — Space Marines ENG/Grey Hunters.html)
─────────────────────────────────────────────────────────
PROFILES:
  4-9  Grey Hunter            M:6" WS:3+ BS:3+ S:4 T:4 W:2 I:4 A:2 LD:7 SV:3+ — 40 pts
  1    Grey Hunter Pack Leader M:6" WS:3+ BS:3+ S:4 T:4 W:2 I:4 A:2 LD:7 SV:3+ — 40 pts
  *    Wolf Guard Pack Leader  M:6" WS:3+ BS:3+ S:4 T:4 W:2 I:4 A:2 LD:8 SV:3+ — 50 pts
EQUIPPED WITH: Every model: Astartes Chainsword; Boltgun; Bolt pistol; Frag grenades; Krak grenades.
WEAPONS:
  Astartes chainsword      -   Melee        S:U  AP:-1 D:1  -
  Bolt pistol             12" Pistol 1      S:4  AP:-1 D:1  -
  Boltgun                 24" Rapid Fire 1  S:4  AP:-1 D:1  -
  Flamer                   9" Assault 4     S:4  AP:0  D:1  Flames
  Melta                   12" Assault 1     S:8  AP:-5 D:1  AT(1), Melta
  Plasma gun (Standard)   24" Rapid Fire 1  S:7  AP:-3 D:1  AT(1)
  Plasma gun (Overheating) 24" Rapid Fire 1 S:8  AP:-4 D:2  AT(2), Overheating
  Plasma pistol (Standard)    12" Pistol 1  S:7  AP:-3 D:1  AT(1)
  Plasma pistol (Overcharged) 12" Pistol 1  S:8  AP:-4 D:2  AT(2), Overheating
  Frag grenade             6" Grenade 1     S:4  AP:0  D:1  Explosive
  Krak grenade             6" Grenade 1     S:6  AP:-2 D:1  -
OPTIONS:
  For every 5 models, two Grey Hunters may swap their Boltgun:
    Flamer+0, Melta+12, Plasma gun+17
  One Grey Hunter may swap their Bolt pistol: Plasma pistol+8
  Grey Hunter Pack Leader → Wolf Guard Pack Leader +10 pts + armory.
ABILITIES: Combat squads, They Shall Know No Fear
UNIT TYPE: Infantry

ENGINE STATUS: ✓ all data matches HTML. champion_has_armory:true (Wolf Guard upgrade grants armory).

## troops/heavy_intercessor_squad.json

HEAVY INTERCESSOR SQUAD — Troops

SOURCE (canonical — Space Marines ENG/Heavy Intercessor Squad.html)
────────────────────────────────────────────────────────────────────
PROFILES:
  2-9  Intercessor Marine      M:6" WS:3+ BS:3+ S:4 T:5 W:2 I:4 A:2 LD:7 SV:3+ — 44 pts
  1    Intercessor Sergeant    M:6" WS:3+ BS:3+ S:4 T:5 W:2 I:4 A:2 LD:7 SV:3+ — 44 pts
  *    Veteran Intercessor Sgt M:6" WS:3+ BS:3+ S:4 T:5 W:2 I:4 A:2 LD:8 SV:3+ — 54 pts
  (NOTE: T:5 — not T:4 like regular Intercessors; Gravis armour.)
  (UPDATED 2026-09-24 per author's sheet: Marine min squad size 4 → 2; default_size/min_cost
   recomputed 2 Marines + 1 Sergeant = 3 models, matching the Eradicator Squad's own shape.)
EQUIPPED WITH: Every model: Heavy bolt rifle; Bolt pistol; Frag grenades; Gravis armor; Krak grenades.
WEAPONS:
  Bolt pistol                   12" Pistol 1     S:4  AP:-1 D:1  -
  Heavy bolt rifle (Bolt ammo)  30" Rapid Fire 1 S:5  AP:-1 D:1  -
  Heavy bolt rifle (Stalker)    36" Heavy 1      S:5  AP:-2 D:1  -
  Heavy bolt rifle (Assault)    24" Assault 2    S:5  AP:0  D:1  -
  Heavy bolter (Bolt ammo)      36" Rapid Fire 2 S:5  AP:-2 D:1  -
  Heavy bolter (Stalker ammo)   42" Heavy 2      S:5  AP:-3 D:1  -
  Heavy bolter (Assault ammo)   30" Assault 4    S:5  AP:-1 D:1  -
  Multi-melta                  24" Assault 1     S:8  AP:-5 D:2  AT(2), Melta
  Frag grenade                   6" Grenade 1    S:4  AP:0  D:1  Explosive
  Krak grenade                   6" Grenade 1    S:6  AP:-2 D:1  -
OPTIONS:
  For every 5 models, TWO Marines may swap Heavy bolt rifle: Heavy bolter +15 / Multi-melta +28
  (UPDATED 2026-09-24: was one Marine / Heavy bolter only — now two Marines, and Multi-melta
   joins the swap list, matching the Eradicator Squad's own Multi-melta option.)
  Intercessor Sergeant → Veteran Intercessor Sergeant +10 pts + armory.
ABILITIES:
  Combat squads, Massive(1), They Shall Know No Fear, Unyielding
  Gravis armor: The model gains a 6+ ward save.
UNIT TYPE: Infantry

ENGINE STATUS: ✓ all data matches sheet. armourKeyword:"Gravis" ✓. T:5 ✓.
  champion_has_armory:true (vet upgrade grants armory).

## troops/indomitus_crusader_squad.json

INDOMITUS CRUSADER SQUAD — Troops

SOURCE (canonical — Space Marines ENG/Indomitus Crusader Squad.html)
─────────────────────────────────────────────────────────────────────
PROFILES:
  0-10  Neophyte      M:6" WS:4+ BS:4+ S:4 T:4 W:1 I:4 A:2 LD:6 SV:4+ — 15 pts
  4-9   Initiate      M:6" WS:3+ BS:3+ S:4 T:4 W:2 I:4 A:2 LD:7 SV:3+ — 35 pts
  1     Sword Brother M:6" WS:3+ BS:3+ S:4 T:4 W:2 I:4 A:2 LD:8 SV:3+ — 36 pts
EQUIPPED WITH:
  Every Neophyte:    Astartes chainsword; Frag grenades; Bolt pistol; Krak grenades.
  Every Initiate:    Astartes chainsword; Frag grenades; Heavy bolt pistol; Krak grenades.
  Sword Brother:     Frag grenades; Krak grenades.
WEAPONS:
  Astartes shotgun  18" Assault 2    S:4  AP:0  D:1  -
  Bolt carbine      24" Rapid Fire 1 S:4  AP:-1 D:1  -   (no Seeking ability — different from Infiltrators)
  Bolt pistol       12" Pistol 1     S:4  AP:-1 D:1  -
  Bolt rifle (Bolt ammo)    30" Rapid Fire 1 S:4 AP:-1 D:1  -
  Bolt rifle (Stalker ammo) 36" Heavy 1      S:4 AP:-2 D:1  -
  Bolt rifle (Assault ammo) 24" Assault 2    S:4 AP:0  D:1  -
  Heavy bolt pistol  12" Pistol 1    S:4  AP:-2 D:1  -
  Pyreblaster        12" Assault 4   S:4  AP:0  D:1  Flames
  Pyre pistol         9" Pistol 4    S:4  AP:0  D:1  Flames
  Frag grenade        6" Grenade 1   S:4  AP:0  D:1  Explosive
  Krak grenade        6" Grenade 1   S:6  AP:-2 D:1  -
OPTIONS:
  All Neophytes may swap Astartes chainsword: Astartes shotgun+1, Bolt carbine+1
  Each Initiate may swap Astartes chainsword: Bolt rifle+2
  Per-10 models, two Initiates swap Astartes chainsword: Pyreblaster+1, Power fist+11
  Per-10 models, two Initiates swap Heavy bolt pistols: Pyre pistol+2, Plasma pistol+7
  Sword Brother has access to weapons and gear from the Armory.
ABILITIES: Combat squads, They Shall Know No Fear; Squires (Neophytes removed first as
  casualties, use own defensive profile even if not the majority) — added SM 1.01.
UNIT TYPE: Infantry

ENGINE STATUS: equipped_with field only stores Neophyte line (string limitation); Initiate/Sword
  Brother gear deduced from option groups. has_armory_access:true (Sword Brother direct access).
  BUGS FIXED: Neophyte Astartes shotgun 0→1 pt, Bolt carbine 0→1 pt, Pyreblaster 0→1 pt.

## troops/infiltrator_squad.json

INFILTRATOR SQUAD — Troops

SOURCE (canonical — Space Marines ENG/Infiltrator Squad.html)
─────────────────────────────────────────────────────────────
PROFILES:
  4-9  Infiltrator Marine      M:6" WS:3+ BS:3+ S:4 T:4 W:2 I:4 A:2 LD:7 SV:3+ — 42 pts
  1    Infiltrator Sergeant    M:6" WS:3+ BS:3+ S:4 T:4 W:2 I:4 A:2 LD:7 SV:3+ — 42 pts
  *    Veteran Infiltrator Sgt M:6" WS:3+ BS:3+ S:4 T:4 W:2 I:4 A:2 LD:8 SV:3+ — 52 pts
EQUIPPED WITH: Every model: Bolt carbine; Bolt pistol; Combat knife; Frag grenades; Krak grenades; Smoke grenades.
WEAPONS:
  Bolt carbine  24" Rapid Fire 1 S:4  AP:-1 D:1  Seeking   (NOTE: has Seeking — different from Indomitus Bolt carbine)
  Bolt pistol   12" Pistol 1     S:4  AP:-1 D:1  -
  Combat knife   -  Melee        S:U  AP:0  D:1  -
  Frag grenade   6" Grenade 1    S:4  AP:0  D:1  Explosive
  Krak grenade   6" Grenade 1    S:6  AP:-2 D:1  -
OPTIONS:
  For each 5 models: Haywire mine+10 and/or Omni scrambler+10
  For each 5 models: one Infiltrator Marine → Helix Adept +5 pts
  Infiltrator Sergeant → Veteran Infiltrator Sergeant +10 pts + armory.
ABILITIES:
  Infiltrator, Move through cover, They Shall Know No Fear
  Helix Adept: once/turn reduce damage of a wound by 1; doesn't apply to S:8+.
  Haywire mine: once/battle, place while moving; 1D3+1 wounds S:4 AP:-4 D:1 to first unit in 3".
  Smoke grenades: once/game, gain "Deflect" ability during activation or when targeted.
  Omni scrambler: icons/homing beacons don't function within 6"; deepstrike within 12" scatters 4D6.
UNIT TYPE: Infantry

ENGINE STATUS: ✓ all data matches HTML. Bolt carbine has Seeking ✓ (Indomitus variant has no Seeking).
  champion_has_armory:true (vet upgrade grants armory). Haywire/Omni per_n modeling noted.

## troops/intercessor_squad.json

INTERCESSOR SQUAD — Troops

SOURCE: Codex/Space Marines 1.04.ods, sheet "Intercessor Squad". Verbatim:

  4-9  Intercessor Marine            6" 3+ 3+ S4 T4 W2 I4 A2 Ld7 Sv3+   38 pts
  1    Intercessor Sergeant          6" 3+ 3+ S4 T4 W2 I4 A2 Ld7 Sv3+   38 pts
  *    Veteran Intercessor Sergeant  6" 3+ 3+ S4 T4 W2 I4 A2 Ld8 Sv3+   48 pts
  Every model is equipped with: Bolt rifle; Bolt pistol; Frag grenades; Krak grenades.

  Bolt pistol                 12"  Pistol 1      4  -1  1   -
  Bolt rifle *
  - Bolt ammo                 30"  Rapid Fire 1  4  -1  1   -
  - Stalker ammo              36"  Heavy 1       4  -2  1   -
  - Assault ammo              24"  Assault 2     4   0  1   -
  Frag grenade                 6"  Grenade 1     4   0  1   Blast(4)
  Heavy bolter                36"  Rapid Fire 2  5  -2  1   -
  Krak grenade                 6"  Grenade 1     6  -2  1   -
  Plasma incinerator *
  - Standard                  30"  Rapid Fire 1  7  -3  1   AT(1)
  - Overheating               30"  Rapid Fire 1  8  -4  2   AT(2), Overheating
  Pyreblaster                 12"  Assault 4     4   0  1   Auto Hit, Sunder(1)
  Pyrecannon                  15"  Assault 4     5  -1  1   Auto Hit, Sunder(1)
  Castellan missile launcher *
  - Castellan missile         36"  Assault 1     4  -1  1   Blast(4), Indirect
  - Krak missile              48"  Heavy 1       8  -3  2   AT(2), Anti-air

  OPTIONS
  • For every 5 models, two Intercessor Marines may be equipped with:
    Grenade launcher +1
  • Alternatively, for every 5 models, two Intercessor Marines may swap their Bolt rifle:
    Pyreblaster +0 / Pyrecannon +7 / Heavy bolter +10 / Plasma incinerator +12 / Castellan missile launcher +32
  • The Intercessor Sergeant may be upgraded to a Veteran Intercessor Sergeant for +10 points
    and gains access to weapons and gear from the Armory.

  ABILITIES: Combat squads, They Shall Know No Fear
             Grenade launcher: Grenades carried by the model gain a range of 24".
  UNIT TYPE: Infantry

1.03 -> 1.04: 37/37/47 -> 38/38/48, BOTH special-weapon groups go from one model per five to
two, and the swap list grows from Pyreblaster alone to five weapons. The new choices are
appended AFTER Pyreblaster because `optionQty` is keyed by choice index. The Pyrecannon,
added 2026-09-19, is appended for the same reason even though the sheet prints it second.

ABILITY VOCABULARY: the sheet is written in the POST-clean-up names (Blast(4), Auto Hit +
Sunder(1)); stored here in the pre-clean-up vocabulary the rest of the app still uses
(Explosive, Flames), to be renamed with everything else when that lands atomically.

## troops/scout_squad.json

SCOUT SQUAD — Troops

SOURCE (canonical — Space Marines ENG/Scout Squad.html)
───────────────────────────────────────────────────────
PROFILES:
  4-9  Scout          M:6" WS:4+ BS:4+ S:4 T:4 W:1 I:4 A:2 LD:6 SV:4+ — 15 pts
  1    Scout Sergeant M:6" WS:3+ BS:3+ S:4 T:4 W:2 I:4 A:2 LD:8 SV:4+ — 35 pts
EQUIPPED WITH: Every model: Bolt pistol; Combat knife; Frag grenades; Krak grenades.
WEAPONS:
  Combat knife             -   Melee        S:U  AP:0  D:1  -
  Astartes shotgun        18" Assault 2     S:4  AP:0  D:1  -
  Bolt pistol             12" Pistol 1      S:4  AP:-1 D:1  -
  Boltgun                 24" Rapid Fire 1  S:4  AP:-1 D:1  -
  Sniper rifle            36" Heavy 1       S:5  AP:-2 D:2  Armor piercing(5+), Suppression
  Heavy bolter            36" Rapid Fire 2  S:5  AP:-2 D:1  -
  Missile launcher - Frag 48" Heavy 1       S:4  AP:0  D:1  Explosive
  Missile launcher - Krak 48" Heavy 1       S:8  AP:-3 D:2  AT(2), Anti-air
  Frag grenade             6" Grenade 1     S:4  AP:0  D:1  Explosive
  Krak grenade             6" Grenade 1     S:6  AP:-2 D:1  -
OPTIONS:
  Every Scout may swap their Combat knife: Astartes shotgun+2, Boltgun+2, Sniper rifle+16
  One Scout may swap their Combat knife: Heavy bolter+11, Missile launcher+28
  Whole squad: Camo cloaks +11 pts/model
  Scout Sergeant has direct armory access (no upgrade required).
ABILITIES:
  Combat squads, Infiltrator, They Shall Know No Fear
  Camo cloak: The model gains the "Stealth" ability.
  Sniper: A model with Sniper rifle improves BS by +1.
UNIT TYPE: Infantry

ENGINE STATUS: ✓ all data matches HTML. has_armory_access:true (Sergeant direct, no vet upgrade).

## troops/tactical_squad.json

TACTICAL SQUAD — Troops

SOURCE (canonical — Space Marines ENG/Tactical Squad.html)
──────────────────────────────────────────────────────────
PROFILES:
  4-9  Tactical Marine       M:6" WS:3+ BS:3+ S:4 T:4 W:2 I:4 A:2 LD:7 SV:3+ — 36 pts
  1    Tactical Sergeant     M:6" WS:3+ BS:3+ S:4 T:4 W:2 I:4 A:2 LD:7 SV:3+ — 36 pts
  *    Veteran Tactical Sgt  M:6" WS:3+ BS:3+ S:4 T:4 W:2 I:4 A:2 LD:8 SV:3+ — 46 pts
EQUIPPED WITH: Every model: Boltgun; Bolt pistol; Frag grenades; Krak grenades.
WEAPONS:
  Bolt pistol                 12" Pistol 1      S:4  AP:-1 D:1  -
  Boltgun                     24" Rapid Fire 1  S:4  AP:-1 D:1  -
  Flamer                       9" Assault 4     S:4  AP:0  D:1  Flames
  Grav gun                    24" Rapid Fire 1  S:5  AP:-3 D:1  Grav
  Grav cannon                 30" Assault 1     S:5  AP:-3 D:1  Explosive, Grav
  Heavy bolter                36" Rapid Fire 2  S:5  AP:-2 D:1  -
  Heavy flamer                 9" Assault 4     S:5  AP:-1 D:1  Flames
  Lascannon                   48" Heavy 1       S:9  AP:-4 D:3  AT(2)
  Melta                       12" Assault 1     S:8  AP:-5 D:1  AT(1), Melta
  Multi-melta                 24" Assault 1     S:8  AP:-5 D:2  AT(2), Melta
  Missile launcher - Frag     48" Heavy 1       S:4  AP:0  D:1  Explosive
  Missile launcher - Krak     48" Heavy 1       S:8  AP:-3 D:2  AT(2), Anti-air
  Plasma gun (Standard)       24" Rapid Fire 1  S:7  AP:-3 D:1  AT(1)
  Plasma gun (Overheating)    24" Rapid Fire 1  S:8  AP:-4 D:2  AT(2), Overheating
  Plasma cannon - Standard    36" Heavy 1       S:7  AP:-3 D:1  AT(1), Explosive
  Plasma cannon - Overheating 36" Heavy 1       S:8  AP:-4 D:2  AT(2), Explosive, Overheating
  Frag grenade                 6" Grenade 1     S:4  AP:0  D:1  Explosive
  Krak grenade                 6" Grenade 1     S:6  AP:-2 D:1  -
OPTIONS:
  For every 5 models, one Tactical Marine may swap their Boltgun:
    Flamer+0, Grav gun+3, Melta+12, Plasma gun+17
  For every 5 models, one Tactical Marine may swap their Boltgun (heavy):
    Heavy flamer+8, Heavy bolter+13, Grav cannon+20, Multi-melta+31,
    Missile launcher+35, Lascannon+64, Plasma cannon+93
  Tactical Sergeant → Veteran Tactical Sergeant +10 pts + armory.
ABILITIES: Combat squads, They Shall Know No Fear
UNIT TYPE: Infantry

ENGINE STATUS: ✓ all data matches HTML. champion_has_armory:true (vet upgrade grants armory).
