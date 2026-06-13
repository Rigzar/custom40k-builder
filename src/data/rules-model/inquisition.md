# Rules-model digest — Inquisition

> Per-faction digest of rules + keyword model, validated against canonical files.
> Persistent "expert cheat-sheet" across sessions — never filled from training memory.

---

## Faction: Inquisition

**Sources read to build this digest:**
- `Informacion/core_rules_text.txt` (Custom40k Core Rules v1.252 / Balance 5.03, FAQ #5: Codex > Core)
- `Informacion/Inquisition.ods` (Index sheet — Designer's note, roster overview)
- `data/source/Inquisition/Index.html`, `Armory.html`, `Inquisitor.html`,
  `Inquisition psychic discipline.html`, `General psychic disciplines.html`
- `data/parsed/inquisition/{units/<slot>/*.ts, armory/general.json, psychic/disciplines.json}` (production — units migrated v0.56 from monolithic units.json to per-slot TS files, mirroring CSM/SM/GK/CD)

### 1. Keyword vocabulary

- **Armour types:** Power armor (3+), Plate armour (4+), Terminator armor (full stat block,
  Massive(1)/Shock Troops/Unyielding, infantry only). `term_compat` axis present (60 items).
  No Cataphractii/Gravis — Inquisition has no analogue.
- **Marks / sub-factions: NONE.** Instead, Inquisition has **Ordo allegiance**
  (Hereticus / Malleus / Xenos) — see §2, structurally different from Chaos marks: it's an
  *armory item pick* that unlocks an army-wide equipment pool, not a unit attribute.
- **Unit types:** Infantry / Vehicle / Monstrous Infantry (Throne of Judgement grants it) /
  Character / Psyker (Familiar, Gamma psyker, Psychic training restricted to "psykers").
- **No archetypes/legacies/traits** — `Index.html` confirmed no Army Customisation tab.
  Designer's note: GK / Adepta Sororitas / SM-with-Alien-Hunters may field Inquisition units
  "as if they were part of their own army" (grounded [[project_alien_hunters_fix|SM fix]]).

### 2. Wargear gating

| Item / group | Requires keyword | Excludes keyword | Notes |
|---|---|---|---|
| ᵀ-glyph items (60) | `term_compat: true` | — | Standard Terminator gate, engine-derived |
| Veteran Abilities (8) | `category: 'veteran'`, unit `has_veteran_abilities` | — | Counter-attack, Favoured enemy, Furious charge, Infiltrator, Outflank, Tank hunter, Terrain expert, Vanguard. p_unit/p_veh/p_char per model — **fixed v0.56, were misfiled in `weapons[]`** |
| Vehicle Equipment (5) | `category: 'vehicle'`, `isVehicle` | — | Additional armor, Hunter-killer missile, Improved targeting, Jammer, Smoke Launcher — **fixed v0.56, were untagged** |
| Ordo-restricted (15) | `requires_army_item: "Ordo Hereticus"/"Ordo Malleus"/"Ordo Xenos"` | — | **NEW primitive v0.56** (`isArmyItemGateBlocked`, engine/keywords.ts) — army-wide unlock-by-item-pick. Glyphs ᴴ/ᴹ/ˣ stripped from names (gate now enforced; restriction text remains in `desc`). See breakdown below. |

**Ordo allegiance — canonical text** (item desc, verbatim): *"The model and further units from
this codex get access to `<Ordo X>` equipment. Every model can only pick one Ordo allegiance.
Only for Inquisitors."* — structurally identical to the CSM/CD Mark pattern
("`<god>` equipment access army-wide"), but CSM/CD model marks as a **unit attribute**
(`selectedMark` gates `armory_marks[X]`), whereas Ordo is an **armory item pick** that gates
army-wide — no existing primitive fit, hence the new `requires_army_item`/`isArmyItemGateBlocked`.

- **Ordo Hereticus (ᴴ → 5 items):** Ignis Judicium, Hexagram warding runes, Liber Heresius,
  No escape, Praesidium Protectiva
- **Ordo Malleus (ᴹ → 5 items):** Psycannon, Grimoire of True Names, Psybolt ammunition,
  Purified weapon, Tesseract labyrinth
- **Ordo Xenos (ˣ → 5 items):** Phase sword, Esoteric knowledge, Empyrian brain mines,
  Uluméathi Plasma Syphon, Universal anathema

### 3. Points model

Standard `p_unit` / `p_char` / `p_veh` semantics (mirrors CSM/SM `getItemPts` + `ArmoryModal.add`):
- Regular equipment: flat `getItemPts` (no `× item.size`)
- `category: 'veteran'`: per-model (`p_unit × item.size`) for infantry/chars (`p_char ?? p_unit`
  flat), per-wound/hull-point (`p_veh × woundCount × item.size`) for vehicles/monsters — table
  footnote: *"Point costs must be paid for every model in the unit and per Wound or Hull point."*
  Items with no vehicle application (Infiltrator, Vanguard) → `p_veh: null`.
- `category: 'vehicle'`: flat `× item.size`

### 4. Army rules / special rules

- **Psyker:** "A psyker can cast 1 psychic power and dispel 1 psychic power per round. A psyker
  knows Smite, as well as one psychic power from a chosen psychic discipline." (`Inquisitor.html`
  row 17 — generic core-psyker text, confirms Heresius/Telethesia are the faction disciplines)
- **General psychic disciplines:** `General psychic disciplines.html` is a link-pointer to the
  shared Google Sheets content already covered codebase-wide by `GENERAL_DISCIPLINES`
  (`src/data/generalDisciplines.ts`, merged in `PsychicModal.tsx:87`) — no migration needed.
- **Faction disciplines (own):** Heresius + Telethesia, 6 powers each — shipped v0.56 in
  `psychic/disciplines.json` (His Will Be Done / Witchhammer / Word of the Emperor / Purgatus /
  Divine Pronouncement / Soul-lightning = Heresius; Psychic Fortitude / Warding Incantation /
  Castigation / Psychic Pursuit / Scouring / Terrify = Telethesia).

### 5. Archetypes / Legacies / Traits

None — `Index.html` confirmed no Army Customisation sheet for Inquisition.

**Note — Ordo Warband units (NOT archetypes, plain Troops datasheets):** the roster
includes 3 large Troops units gated the same way as the Ordo armory items —
"Ordo Hereticus/Malleus/Xenos Warband" (`units/troops/ordo_*_warband.ts`), each "Only for
armies with an Ordo X Inquisitor" and "max 12 models, one warband per army". 6-7 model
profiles each (Acolyte/Arco-flagellant/Penitent/Surgeon/Missionary/Servitor/Sage for
Hereticus; Acolyte/Daemonhost/Exorcist/Jokaero Weaponsmith/Mystic/Psyker/Servitor for
Malleus; Acolyte/Alien World Scout/Archaeotech Researcher/Psyker/Servitor/Xenologist for
Xenos) — present and complete in the migrated TS data. The army-side restriction
("only with Ordo X Inquisitor") is now ALSO engine-enforced (v0.56): generalised
`requires_army_item` from `ArmoryItem` to `Unit` (`isArmyItemGateBlocked` widened to a
minimal structural type), wired into `SlotPanel`'s unit-list filter via the same
`rosterArmoryItemNames` roster scan used by `ArmoryModal`. One mechanic — the Ordo
allegiance pick on an Inquisitor — now correctly cascades to BOTH equipment access and
unit availability, exactly mirroring the canonical text. `option_groups[].header` text
left as-is (still shown to the player; the gate is the enforcement layer on top).

### 6. Open questions / discrepancies found — all resolved this session (v0.56)

- ~~8 Veteran Abilities misfiled in `weapons[]`~~ → moved to `equipment[]`, `category:'veteran'`
- ~~5 Vehicle Equipment items untagged~~ → tagged `category:'vehicle'`
- ~~Missing "Hunter-killer missile" weapon profile~~ → added (120", Heavy 1, S8 AP-3 D2, Ammo(1) AT(2))
- ~~Ordo ᴴ/ᴹ/ˣ restriction unenforced (rules-bug: could build illegal lists)~~ → new
  `requires_army_item` primitive ships the gate (armory items)
- ~~"Ordo X Warband" units fieldable without the matching Ordo Inquisitor (text-only
  restriction, same class of bug)~~ → `requires_army_item` generalised from `ArmoryItem`
  to `Unit`, gate now also filters `SlotPanel`'s unit list

~~**Ordo allegiance items not mutually exclusive (`ki-inquisition-ordo-exclusivity-01`)**~~
→ FIXED: added explicit validator (`engine/validators.ts`) — error if a model has 2+ of
{Ordo Hereticus, Ordo Malleus, Ordo Xenos} in its armory, mirroring the canonical text
("Every model can only pick one Ordo allegiance").

**Side-finding (NOT in scope, logged as `ki-gk-inquisition-allied-badge-01`):** GK's existing
Inquisition access (`ki-10`) uses `[Allied]` — but the same Designer's note that grounded the SM
Alien Hunters "own army" fix names GK alongside SM as an "own army" case. Needs user confirmation
before touching (reads GK+Sororitas rules).

### 7. "Lo demás" pass (2026-06-13) — no fixes needed

- **Index "Special rules"**: Inquisition has no dedicated special-rules section — only the
  Designer's note (roster overview + ally access), already fully covered by §5/§6. Re-checked
  the 3-faction "own army" access grant against current code: GK and Adeptus Sororitas both
  carry `intrinsic_allies: ['inquisition']` (`src/data/loaders.ts`), and SM's "Legacy of the
  Alien Hunters" carries `grants_faction: "inquisition"` (`space_marines/archetypes.json`) — all
  three match the canonical text verbatim, nothing outstanding.
- **"Inquisition psychic discipline"** (Heresius + Telethesia, 12 powers) — re-dumped from the
  .ods and compared against `psychic/disciplines.json`: 1:1 match, no fixes. "General psychic
  disciplines" sheet is just a link, as in every other faction.

**Inquisition "lo demás" complete** — Armory/Ordo gating already covered by §1–§6 (v0.56); Index
and psychic disciplines now also re-audited. No discrepancies found.
