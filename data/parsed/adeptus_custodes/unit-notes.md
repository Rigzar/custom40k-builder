# adeptus_custodes - notes kept from the unit files

These were the header comments of the old .ts unit files. The unit files are pure JSON now, which cannot carry a comment.

## fast_attack/venatari_custodians.json

VENATARI CUSTODIANS — Fast Attack

SOURCE: Codex/Adeptus Custodes 1.01.ods, sheet "Venatari Custodians" (new in the September 2026
update). Verbatim:

  3-6  Venatari Custodian  12"  2+ 2+  S5 T5 W2 I4 A3 Ld9 Sv3+   75 pts
  All models are equipped with: Venatari lance.

  Kinetic destroyer   18"   Pistol 3   6   -2  1   -
  Tarsus buckler      -     Melee      U   -2  1   -
  Venatari lance *
   - Melee            -     Melee      +1  -2  1   Quick(+1)
   - Shooting         12"   Pistol 2   6   -2  1   -
  * Choose one of the following profiles

  OPTIONS
  • Every model may swap their Venatari lance:
    - Kinetic destroyer and Tarsus buckler   +5 points
  • The unit can gain a Veteran ability.

  ABILITIES: Shield Host · Custodian armor (5+ ward) · Tarsus buckler ("Deflect")
  UNIT TYPE: Jump Pack Infantry

NOTE ON THE NAME: the codex Index lists this unit as "Venatari Custodes" while its own datasheet
tab is titled "Venatari Custodians". The DATASHEET name is used here, as everywhere else.

The swap choice grants TWO weapons in one pick. computeWeaponsToShow already splits a compound
choice on "and" (and keeps the full string as a candidate), so both the Kinetic destroyer and the
Tarsus buckler unlock from it — no special handling needed.
