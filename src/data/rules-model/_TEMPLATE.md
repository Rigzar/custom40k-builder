# Rules-model digest — _TEMPLATE

> Per-faction digest of rules + keyword model, **validated against the canonical files**
> (`Informacion/core_rules_text.txt`, `missions_text.txt`, the faction's source HTML, and any
> extra rules the user mounts in `Informacion/factions/<faction>/`).
> This is both the source for the engine's keyword gating AND the persistent "expert cheat-sheet"
> across sessions. **Never fill this from training memory — only from the user's canonical files.**

Copy this file to `<faction>.md` (e.g. `chaos_space_marines.md`) when starting a faction.

---

## Faction: <name>

**Sources read to build this digest** (list exact files + date):
- `Informacion/core_rules_text.txt` (v1.252 / Balance 5.03)
- `data/source/<Faction> ENG/...`
- [any extra]

### 1. Keyword vocabulary
What keywords gate data in this faction. Validate each against the rules.

- **Armour types:** e.g. Power / Terminator / Cataphractii / Gravis — which units have which.
- **Marks / sub-factions:** e.g. Khorne / Nurgle / Slaanesh / Tzeentch / Undivided.
- **Unit types:** Infantry / Vehicle / Monster / Character / Mounted / Fly …
- **Other faction keywords:** (e.g. Cult, Daemon, Legion X …)

### 2. Wargear gating (replaces term_compat / gravis_compat / category)
For each armory section, which keyword a unit must HAVE / must NOT have to take an item.

| Item / group | Requires keyword | Excludes keyword | Notes |
|---|---|---|---|
| | | | |

### 3. Points model
How costs apply: per-model vs flat (character) vs per-wound/HP (veteran on vehicle/monster).
Map to `p_unit` / `p_char` / `p_veh` semantics. Note any conditional costs.

### 4. Army rules / marks / special rules
Faction-wide rules (e.g. marks count as veteran ability, summoning, favored units).
One line each, with the canonical wording reference.

### 5. Archetypes / Legacies / Traits
List + any keyword/slot interactions.

### 6. Open questions / discrepancies found
HTML vs production mismatches, things to confirm with the user, suspected errors.
