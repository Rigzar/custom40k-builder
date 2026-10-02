# imperial_guard - notes kept from the unit files

These were the header comments of the old .ts unit files. The unit files are pure JSON now, which cannot carry a comment.

## dedicated_transport/centaur_rsv.json

CENTAUR RSV — Dedicated Transport

SOURCE: Imperial Guard 1.01.ods (July 2026 update — new unit).
  Centaur RSV | M 12" | BS 4+ | S 5 | FRONT 10 | SIDE 10 | REAR 10 | I 3 | A 1 | HP 2 | 105 pts
  Equipped with: Heavy stubber.
  Abilities: Open; Transport capacity 12 infantry models.
  Options: access to vehicle equipment from the Armory.

## dedicated_transport/vigilator_rsv.json

VIGILATOR RSV — Dedicated Transport

SOURCE: Imperial Guard 1.01.ods (July 2026 update — new unit).
  Vigilator RSV | M 12" | BS 4+ | S 5 | FRONT 11 | SIDE 10 | REAR 10 | I 3 | A 1 | HP 2 | 147 pts
  Equipped with: Chiron gatling cannon; 2 Heavy stubbers.
  Abilities: Open; Aquiline Prow (front AV 13 vs 11 on Tank Shock); Transport capacity 6.
  Options: 1 per Commissar or Commissar Lord (build restriction — noted, not hard-gated);
           access to vehicle equipment from the Armory.

## elites/ambassador.json

AMBASSADOR — Elites

SOURCE: Imperial Guard 1.03 (sheet fetched 2026-08-13), "Ambassador".

## elites/company_hero.json

COMPANY HERO — Elites

SOURCE: Imperial Guard 1.03 (sheet fetched 2026-08-13), "Company Hero".

## elites/scribe_historicus.json

SCRIBE HISTORICUS — Elites

SOURCE: Imperial Guard 1.03 (sheet fetched 2026-08-13), "Scribe Historicus".

## elites/staff_officer.json

STAFF OFFICER — Elites

SOURCE: Imperial Guard 1.03 (sheet fetched 2026-08-13), "Staff Officer".

## fast_attack/hippogriff_afv.json

HIPPOGRIFF AFV — Fast Attack

SOURCE: Imperial Guard 1.01.ods (July 2026 update — new unit).
  Hippogriff AFV | M 12" | BS 4+ | S 5 | FRONT 11 | SIDE 10 | REAR 10 | I 3 | A 1 | HP 2 | 125 pts
  Squadron 1-2 (ODS date artifact 2022-02-01 → min 1 / max 2) — Squadron ability.
  Equipped with: Chiron gatling cannon; Heavy stubber.
  Options: swap Chiron gatling cannon (Vigilator cannon +15 / Lascannon +24 / Melta cannon +48);
           swap Heavy stubber (Melta +2); access to vehicle equipment from the Armory.

## fast_attack/tauros.json

TAUROS — Fast Attack

SOURCE: Imperial Guard ENG.ods, "Tauros" sheet (canonical datasheet)
───────────────────────────────────────────────────────────────────────────

EQUIPPED WITH: A Tauros is equipped with: Tauros grenade launcher.

WEAPONS:
  Tauros grenade launcher * (multi-profile):
    - Frag grenade   24"  Assault 2  S4  AP0   D1  Explosive
    - Krak grenade   24"  Assault 2  S6  AP-2  D1  -

OPTIONS:
  • A Tauros may swap its Tauros grenade launcher: Heavy flamer +4pts

ENGINE STATUS:
  🔴 "Tauros grenade launcher" had NO weapon profile in `weapons[]` at all (only mentioned in
     equipped_with) — found 2026-06-21 while auditing the unit's "may swap" option group for a
     missing `replaces` link. Added both multi-profile entries from the .ods above, and the
     `replaces` array on the swap group (engine does exact-name matching against weapons[],
     so a multi-profile weapon needs ALL its profile-suffixed names listed — same convention
     as Combi-weapons across CSM/SM/IG).
