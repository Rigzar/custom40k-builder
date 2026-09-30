# Tyranids — notes that used to live in the unit files

Unit files are pure JSON so the codex tooling can rewrite them from the sheets, and JSON has no
comments. Anything worth remembering about a unit goes here instead.

## Hive Crone (units/flyers/hive_crone.json)

Was the only unit whose header said more than the "SOURCE: TODO" stub. Kept verbatim because it
records how the datasheet was first transcribed.

> SOURCE: Codex/Tyranids 1.05.ods, sheet "Hive Crone" (new in the September 2026 update).
>
>     1  Hive Crone  12"  3+ 3+  S6 T6 W5 I5 A4 Ld7 Sv4+   166 pts
>     A Hive Crone is equipped with: Drool cannon; Monstrous scything talons; 4 Tentaclids.
>
>     Drool cannon                18"  Assault 6  6  -2  1   Auto Hit, Sunder(1), Monofilament
>     Monstrous scything talons   -    Melee      U  -2  2   Extra Attack(1)
>     Stinger salvo               24"  Assault 2  5   0  1   Blast(4)
>     Tentaclids                  36"  Assault 1  5  -1  1   Ammo(1), Haywire, Seeking
>
>     OPTIONS
>     - May be equipped with one of the following: Stinger salvo +22
>     - May select one Special Biomorph: Resonator +13 / Synaptic Node +15 / Regeneration +25 /
>       Hardened Carapace +28
>     - May additionally select any number of Basic and Advanced Biomorphs (see Armory).
>
>     ABILITIES: Hover Mode.  UNIT TYPE: Flyer, Monstrous Creature.  KEYWORDS: Advanced Bioform

**Stale as of 2026-09-30:** the ability-vocabulary caveat in that header (the datasheet stored in the
pre-clean-up names "until the atomic rename") was resolved in v1.72, and the October sheet
(Tyranids 1.08) replaces the Hive Crone's "Monstrous scything talons" with "Bladed spurs",
"Wing tips" and a "Stinger tail".
