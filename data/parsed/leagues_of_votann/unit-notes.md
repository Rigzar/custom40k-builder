# leagues_of_votann - notes kept from the unit files

These were the header comments of the old .ts unit files. The unit files are pure JSON now, which cannot carry a comment.

## fast_attack/hearthkyn_skyriggers.json

SOURCE: Informacion/Leagues of Votann 1.02.ods, sheet "Hearthkyn Skyriggers" (new in 1.02).

NOTE: the .ods option headers say "Hearthkyn Warriors" and "Autoch-pattern bolter" — copy-paste
from the Hearthkyn Warriors sheet, since a Skyrigger carries no bolter. The swap that is
actually available is against the model's Plasma axe, so the headers are reworded here and the
`replaces` targets the Plasma axe. Everything else is verbatim.

UNIT TYPE: Jump Pack Infantry — per Core Rules L714-718 this intrinsically grants Deep Strike
(see specialRules.ts intrinsicAbilitiesForUnitType), so it is NOT restated in `abilities`.
