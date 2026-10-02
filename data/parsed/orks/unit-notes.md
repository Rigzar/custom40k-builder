# orks - notes kept from the unit files

These were the header comments of the old .ts unit files. The unit files are pure JSON now, which cannot carry a comment.

## troops/boyz.json

BOYZ — Troops

SOURCE (canonical — Orks ENG/Boyz.html)
────────────────────────────────────────────────────────────────────
PROFILES:
  10-30  Boy   M:6" WS:3+ BS:5+ S:4 T:4 W:1 I:3 A:2 LD:5 SV:6+ — 10 pts
  *      Nob   M:6" WS:3+ BS:5+ S:5 T:4 W:2 I:3 A:3 LD:6 SV:6+ — 25 pts
EQUIPPED WITH: Every model: Choppa; Slugga; Stikkbombz.
WEAPONS:
  Big shoota      36" Assault 3 S:5 AP:-1 D:1 -
  Burna - Melee    -  Melee     S:U AP:-3 D:1 Unwieldy
  Burna - Ranged   9" Assault 4 S:4 AP:0  D:1 Auto Hit, Sunder(1)
  Choppa           -  Melee     S:U AP:-1 D:1 -
  Rokkit launcha  24" Assault 1 S:8 AP:-3 D:2 AT(2), Anti-air
  Shoota          18" Assault 3 S:4 AP:0  D:1 -
  Slugga          12" Pistol 1  S:4 AP:0  D:1 -
  Stikkbombz       6" Grenade 1 S:3 AP:0  D:1 Blast(4)
OPTIONS (UPDATED 2026-09-24 per author's sheet):
  Squad-wide: 'Eavy armour +6 pts (per model)
  Any number of models may do ONE of: replace Choppa+Slugga with a Shoota (+0), OR keep
    Choppa+Slugga and be additionally equipped with a Shoota (+4) — two separate groups since
    one replaces gear and the other adds to it; both grant the "Shoota" choice `requires_choice`
    below reads for.
  For every 10 models, TWO Boyz already equipped with a Shoota may swap it for: Big shoota +8 /
    Burna +8 / Rokkit launcha +12 (gated on the Shoota option above — was wrongly modeled as a
    direct Choppa+Slugga swap for one Boy only, with no Burna choice and no Shoota prerequisite).
  One Boy → Nob +15 pts + armory. Can get one Kustom job.
ABILITIES: Dakka Dakka Dakka, Furious charge, Mob, Waaagh!
UNIT TYPE: Infantry

ENGINE STATUS (audited 2026-09-24): stats/points/weapons match sheet. Added Burna (2 profiles,
  same shape as Burna Boyz' own "Burna - Melee"/"Burna - Ranged"). Split the old single
  "swap Choppa+Slugga for a Shoota" group into two (replace vs. additional), and re-gated the
  heavy-weapon swap onto the Shoota choice via `requires_choice`, matching the sheet's two-step
  upgrade path (Choppa+Slugga → Shoota → Big shoota/Burna/Rokkit launcha).
