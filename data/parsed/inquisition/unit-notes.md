# inquisition - notes kept from the unit files

These were the header comments of the old .ts unit files. The unit files are pure JSON now, which cannot carry a comment.

## hq/inquisitor.json

INQUISITOR — HQ

SOURCE: Inquisition.ods (updated 2026-06-17)

ARMY SPECIAL RULE:
  "Authority of the Inquisition: Every model in the army with access to the Armory
   may select a single item from any Imperial faction."
  → Army-wide rule; replaces the old per-model "Inquisitorial requisition" ability.

PSYKER / PRIEST (optional upgrades):
  Both are optional +5 pt upgrades. Engine: is_psyker + is_priest both true (unit
  can be either; player picks one upgrade). This is a known approximation — the
  engine does not currently enforce "pick exactly one of psyker/priest".

## troops/henchman_warband.json

HENCHMAN WARBAND — Troops

SOURCE: Informacion/Inquisition.ods, sheet "Henchman Warband":
  "Every Inquisitor may select a single Henchman Warband and must start the game attached
  to it. A Henchman Warband consists of specialists, chosen from the Elite section in this
  codex. Each specialist unit may only be added once to the Warband, up to the specified
  amount of models. An Inquisitor may select up to 6 specialist models for their Warband.
  An Inquisitor Lord may select up to 12 specialist models for their Warband."

Replaces the old "Ordo Hereticus/Malleus/Xenos Warband" Troops units (3 separate, Ordo-gated,
18 specialists total). The new .ods has NO "Only for Ordo X" text on any individual specialist
sheet (only the "Army Customisation" sheet references Ordo Hereticus/Malleus/Xenos/Minoris,
for Legacies) — specialists are no longer Ordo-gated, any Inquisitor can pick any of them.

"Surgeon" (old Ordo Hereticus specialist, 10pts/max2) does not appear anywhere in the new
40-sheet .ods — dropped (no canonical basis remains). The two old "Psyker" entries (Ordo
Malleus + Ordo Xenos, both 10pts/max2) collapse into the single new "Psykers" sheet
(16pts/max1). Three new specialists added: Crusaders, Chirurgeons, Eldar Outcast (Ranger).

The dynamic 6/12 model cap (Inquisitor vs. Inquisitor Lord) is enforced by a validator in
src/engine/validators.ts, not by an option_group (it depends on the attached Inquisitor's
"Inquisitor Lord" unique_upgrade — see inquisitor.ts variant_models).

"The unit may gain one Veteran ability" (repeated on every specialist sheet) reads as a
PER-SPECIALIST-TYPE option: has_veteran_abilities: true, and ArmoryModal.tsx special-cases
"Henchman Warband" by name to size the veteran-slot pool to the number of distinct specialist
types currently present (modelSizes entries with count > 0) instead of the flat veteran_max
used by every other unit. Fixes ki-inquisition-henchman-veteran-per-specialist-01.
