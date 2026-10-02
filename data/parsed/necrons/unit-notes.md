# necrons - notes kept from the unit files

These were the header comments of the old .ts unit files. The unit files are pure JSON now, which cannot carry a comment.

## heavy_support/canoptek_tomb_stalker.json

CANOPTEK TOMB STALKER — Heavy Support

SOURCE: Necrons 1.1 (sheet fetched 2026-08-13), "Canoptek Tomb Stalker".
New datasheet — the Index lists it first in the Heavy Support column.

  1-2  Tomb Stalker  12"  4+ 4+ 6  T7 W5  I4 A4 LD10 Sv3+   180 pts
  Every model is equipped with: 2 Gauss flayers; Monstrous automaton claws.
  OPTIONS  • Any number of models can each be equipped with: - Dark Prison, +5 points
  ABILITIES  Acute Senses, Deep Strike, Move Through Cover, Regeneration(1), Squadron
             Dark prison: The model can dispel 1 psychic power per battle round.
  UNIT TYPE  Monstrous Creature      KEYWORD  Canoptek

The sheet writes the option as "Dark Prison" and the ability as "Dark prison"; the choice is
spelled to match the Armory item ("Dark prison", also on the Canoptek Spyders) so the purchase
resolves — a choice/item name mismatch here would be charged and grant nothing.

## hq/cryptek.json

CRYPTEK — HQ

SOURCE: Codex/Necrons 1.1.ods, "Cryptek" tab (2026-08-04 rework).

The specialisation is now MANDATORY ("Must be upgraded to one of the following") and there are
eight of them, each at its own price, each bringing its own weapon — the base Cryptek's
equipment line is literally "-", so without an upgrade the model has no weapon at all. That is
why `constraint.required` is set: an un-upgraded Cryptek is not a legal model, not just an
unfinished one.

Dynasty Scion is the odd one out: it is the only specialisation that changes the profile
(variant_models) and the only one with no weapon of its own.

Its cost is 44, NOT the 45 printed in the variant's POINTS cell. The sheet gives the figure
twice and the two disagree — base 30 + the "+14pts" option row is 44 — and the author confirmed
44 is correct (2026-08-05). engine/points.ts prices a `variant_link` choice off the variant's
own points and ignores the choice's, so the 44 has to live on the variant; the choice keeps its
"+14" so the option list still reads the way the datasheet prints it.
