# Contributing to Custom 40k Builder

**Read this in another language:** [Deutsch](CONTRIBUTING.de.md) · [Español](CONTRIBUTING.es.md)

Thanks for helping improve the builder. This guide covers everything you need to contribute, whether it's a data correction, a translation fix, new artwork, a bug fix, or a new feature.

---

## Table of contents

1. [Quick start](#quick-start)
2. [Reporting issues](#reporting-issues)
3. [Data corrections (no coding required)](#data-corrections-no-coding-required)
4. [Translations](#translations)
5. [Art contributions](#art-contributions)
6. [Code contributions](#code-contributions)
7. [Pull request checklist](#pull-request-checklist)

---

## Quick start

```bash
git clone https://github.com/Rigzar/custom40k-builder.git
cd custom40k-builder
npm install
npm run build   # must pass with zero errors
```

> **Do not run `npm run dev`** while making changes — use `npm run build` to verify correctness. Preview the app by opening `dist/index.html` after building, or open the live app at https://custom40k-builder.vercel.app.

---

## Reporting issues

Use GitHub Issues. Choose the right template:

- **Bug report** — something in the app behaves incorrectly (wrong points, option not showing, crash)
- **Data correction** — a unit's stats, weapons, options, or points don't match the rules

When filing an issue, always include:
- Faction name and unit name
- What you expected vs. what you got
- If it's a data issue: the page / section in the rules you're referencing

---

## Data corrections (no coding required)

This is the highest-impact way to contribute. Each faction lives in its own folder:

```
data/parsed/<faction>/
  units/              ← one .ts file per unit (all 19 factions)
    troops/
      traitor_guard.ts   ← a single unit, exported as a `Unit`
      index.ts           ← re-exports every unit in this slot
    hq/  elites/  ...     ← one folder per slot, each with its own index.ts
    index.ts          ← assembles the faction's slot_to_units + units map
  armory/
    general.json      ← general armory (all models)
    mark_khorne.json  ← mark-specific armory (Chaos factions)
    legion_*.json     ← chapter / legacy armory (one per legacy)
  archetypes.json     ← archetypes, legacies, traits
  animosity.json      ← marks animosity/allied matrix (only factions with marks: CSM, CD)
  psychic/            ← disciplines, prayers, daemonkin
```

> All 19 factions use the `units/` per-slot layout. Each unit lives in its own
> `.ts` file under `units/<slot>/<unit>.ts`. To edit a unit, open that file
> directly. Units audited against the canonical `.ods` source have a source
> header comment; auto-generated units carry a `TODO` comment. To ADD a unit,
> see the section below — it takes THREE files, not two.

### Adding a NEW unit

A unit is only real when it appears in **three** places. This used to say "create the file and add
its export line", which is two of them, and the first unit contributed from outside the team landed
unreachable because of it — so it is spelled out now.

1. **`data/parsed/<faction>/units/<slot>/<unit>.ts`** — the datasheet itself.
2. **`data/parsed/<faction>/units/<slot>/index.ts`** — one line:
   `export { dactylis } from './dactylis';`
3. **`data/parsed/<faction>/units/index.ts`** — **TWO** entries, and this is the step that gets
   missed:
   - in the `units` map: `"Dactylis": heavySupport.dactylis,`
   - in `slot_to_units`, under the right slot: `"Dactylis",`

**A name in `slot_to_units` with no entry in the `units` map shows up in the catalogue and resolves
to nothing.** An Ork Lord of War sat unreachable that way for months.

**The name must match EXACTLY in all of them**, capitals included — the unit's own `"name"`, each
model row's `"name"`, the `units` map key and the `slot_to_units` entry. Everything in the engine
looks a unit up by that string, so one capital letter makes it a different unit.

**Read the stat row against its column headings.** The sheet runs
`No. | NAME | M | WS | BS | S | T | W | I | A | LD | SV | POINTS`, and `T W I A LD` run together:
the Dactylis went in with its Wounds and Leadership swapped. `No.` is the squad size, so `1-2`
means `min: 1, max: 2`.

**A weapon marked `*` on the sheet has profiles underneath it**, and each is its own entry named
`"<Weapon> - <Profile>"`. Copy one profile at a time, straight across that row, and never copy one
profile's ability list onto another — two profiles arrived with a neighbour's abilities and so were
missing their `AT(2)` entirely. An ability with an unclosed bracket (`Suppression(3`) resolves to
nothing at all, because lookup is by exact text.

**Do not copy "may select any number of Basic and Advanced Biomorphs (see Armory)"** or any
equivalent line into the unit's options. Those live in the faction's armoury and the app adds them.
Only options the datasheet itself names, with their own prices, belong in `option_groups`.

**Checking it without Node:** read your file next to the sheet field by field, then open the PR's
"Files changed" tab and confirm all three files above are there. If `units/index.ts` is not in the
list, the unit is not connected. Say so in the PR if you would like it run through the codex
comparison before merging — that tool prints one line per field that disagrees with the sheet.



### Workflow

1. Navigate to `data/parsed/<faction>/units/<slot>/` and open the relevant `.ts` file.
2. The exported object uses the field names in the table below. The header comment documents the canonical source and profile — keep it in sync if you change a value.
3. Compare each field against your copy of the rules.
4. Fix what's wrong, then run `npm run build` to confirm the JSON is valid and the app still compiles.
5. Open a Pull Request.

### Fields to check per unit

| Field | What to check |
|---|---|
| `models[].points` | Points cost per model |
| `models[].min` / `models[].max` | Minimum and maximum model count |
| `models[].stats` | M / WS / BS / S / T / W / A / Ld / Save |
| `weapons[]` | All weapon profiles present; correct S / AP / D / Abilities |
| `option_groups[]` | Header text matches rules; all choices listed; correct points costs |
| `option_groups[].per_model` | Set `true` when the header says "for +X points **per model**" or "the entire squad may receive one of the following... **per model**" — applies to both inline options (`inline_pts`) and regular `choices[]` groups; without it the cost is charged once for the whole unit instead of scaling with squad size |
| `option_groups[].replaces` | List the exact weapon name(s) being removed by this swap. Required on any group meant to drop the old weapon from the weapon table — without it, the old AND new weapon both show. For a multi-profile weapon (e.g. "Taser lance - Charge" / "Taser lance - Melee"), list every profile name, not the shared prefix — matching is exact-name, not stripped. **Gotcha**: a choice name that happens to exactly equal an unconditionally-shown base weapon's name will hide that weapon by default — never give a purely-additive choice (granting MORE of a weapon already in `equipped_with`) the exact same name as that base weapon. |
| `option_groups[].choices[].name` (quantity-prefixed) | **Never** name a choice "two X" / "2 X" / "four X" etc. — the weapon-table gating matches a choice's name against the weapon's own name exactly, so a quantity prefix never matches and the weapon shows unconditionally even when unpurchased. Rename the choice to the bare singular weapon name (the header text already conveys "both"/"two"/etc.); price is unaffected. |
| `is_character` / `is_vehicle` / `is_psyker` | Unit classification flags |
| `champion_has_armory` | True only if the champion (sergeant-equivalent) can access the armory independently |
| `advisor` | True only for units that are advisors (e.g., Commissar) |
| `abilities[]` | Ability text present and correct |
| `unit_type` | Must use the canonical spelling from Core Rules: `Infantry`, `Bike`, `Character Model`, `Jet Bike`, `Jump Pack Infantry`, `Monstrous Creature`, `Monstrous Infantry`, `Walker`, `Flyer`, `Vehicle` |

### Constraint types for `option_groups`

| `constraint.type` | Meaning |
|---|---|
| `one` | Pick 0 or 1 from the list (most common) |
| `every` | Every model picks independently — cost is per model |
| `per_n` | M picks per N models (`constraint.per_n` specifies N, `constraint.count_per_n` specifies M — e.g. "for every 3 models, 1 may swap" is `per_n:3, count_per_n:1`) |
| `fixed_max` | Up to N picks total (`constraint.max` specifies N) |
| `mark` | Mark of Chaos selection |
| `veteran` | Veteran ability slot |
| `unique_upgrade` | Unit-level unique restriction |

### Adding a weapon, an armoury item, an archetype, a trait or a legacy

**The one thing to understand first: writing a rule down does not make it do anything.** Most of
these live in TWO places — the DATA, which makes it appear and be priced, and the ENGINE, which
makes it act. A sweep of every faction rule we had written down found 56 that nothing in the app
ever looked at. Many were table-only and correctly prose, but four were real bugs: a relic that
granted nothing, a ward save 13 datasheets never got, an army-wide upgrade that was free, and a
condition that was decoration.

`node scripts/audit_faction_rule_coverage.cjs <faction>` lists the rules the engine cannot act on.

**A weapon on a datasheet** goes in that unit's `weapons[]`. If the sheet marks it `*`, each profile
is its own entry named `"<Weapon> - <Profile>"`. If an option REPLACES a weapon, the option group
needs `replaces` listing the exact weapon name(s), every profile spelled out — without it both the
old and the new weapon show. Never put a quantity in a choice name ("two Flamers"): gating matches
the choice name against the weapon name exactly, so the weapon then shows whether or not it was
bought.

**An armoury item** goes in `armory/general.json` (or `mark_*.json` / `legion_*.json`). Copy the
price columns as the sheet has them — they are NORMAL / CHARACTER MODELS / MONSTROUS CREATURES &
VEHICLES, and the third is for Monstrous **Creatures** and vehicles, not Monstrous Infantry. Copy
the description verbatim: the engine reads it. `Unique` with a capital U means once per army;
"can be taken multiple times" and "every enhancement is unique per army" are both read from that
text. An item whose text quotes an ability in double quotes grants that ability automatically —
which is why the wording matters more than it looks.

**An archetype** is an entry in `archetypes.json` AND a rule in
`src/engine/archetypes/index.ts` (`ARCHETYPE_RULES`). The JSON alone makes it selectable and does
nothing else. Its `notes` are shown to the player and grant nothing; anything that must actually
happen — a slot remap, a cap, a granted ability — is a field on the rule object. Three Inquisition
archetypes still resolve to no rule at all, so the app offers them and they do nothing.

**A trait** is an entry in `archetypes.json` AND effects in that faction's `traits.ts`
(`TRAIT_EFFECTS`). Its three price columns match the armoury's, and a `*` means the cost is per
Wound or Hull point. Each effect carries `applies_to` — `all`, `creature`, `vehicle`, `character`,
`infantry`, `monster` or `psyker` — and that scope decides who gets it. A trait with no entry in
`TRAIT_EFFECTS` is selectable, costs points and changes nothing.

**A legacy** is an entry in `archetypes.json` whose `armory_key` **must match** the key used for
that faction in `src/data/loaders.ts`; if they diverge the armoury tab never appears. Where a
faction keeps all its legacy relics in one file, each relic's own text carries its restriction
("Alaitoc only.", "Ymyr Conglomerate only.") and the gate is derived from the legacy's own
description — so both sentences have to be copied exactly as written.

**A whole faction** is not a data drop: it needs its folder, a loader entry in
`src/data/loaders.ts`, and a row and column in the allied matrix in `src/data/alliedMatrix.ts`.
Open an issue before starting one.

### Armory file structure

`armory/general.json` holds weapons, equipment and daemon weapons available to all eligible models. Mark-specific armories (`armory/mark_khorne.json`, etc.) and chapter/legacy armories (`armory/legion_*.json`) follow the same structure:

```json
{
  "name": "Armory Name",
  "weapons": [...],
  "equipment": [...],
  "daemon_weapons": []
}
```

The `armory_key` field in each `archetypes.json` legacy entry **must match** the key used in `src/data/loaders.ts` for that faction's `armory_legions` object — if they diverge, the legacy armory tab will not appear. See `ki-legacy-armory-link-01` for the history.

---

## Translations

The app supports three languages: **English (EN)**, **German (DE)**, and **Spanish (ES)**. There are two separate places where translatable text lives — read both sections before starting.

### 1. UI strings — `src/i18n/index.ts`

All interface labels, button text, and section headings live here. Each entry is an object with `en`, `de`, and `es` keys:

```ts
appTitle: {
  en: 'Custom 40k Army Builder',
  de: 'Custom 40k Armeeliste',
  es: 'Creador de Ejércitos Custom 40k',
},
```

**How to find untranslated UI strings:**
Search the file for entries where the `de` or `es` value is identical to the `en` value — those are machine-translated or missing. Native-speaker corrections are always welcome.

**Adding or fixing a UI translation:**
1. Open `src/i18n/index.ts`.
2. Find the string (search for the English text).
3. Edit the `de` or `es` value.
4. Run `npm run build` — the file is TypeScript, so a typo will cause a build error.
5. Open a Pull Request. You do not need to fix every string — partial improvements are welcome.

> **German terminology:** use official Games Workshop German terminology, not literal translations. Slot names follow GW convention: `Standard` (Troops), `Elite` (Elites), `Sturm` (Fast Attack), `Unterstützung` (Heavy Support). Stat abbreviations: `Reichw.` (Range), `DS` (AP), `SW` (Damage). Armory is `Rüstkammer`.

### 2. Rule descriptions — changelog, known issues, and engine files

Rule text in the engine (trait descriptions, archetype notes, ability descriptions) is currently in **English only**. These are stored as plain strings in TypeScript engine files and in `src/data/changelog.ts` / `src/data/known-issues.ts`.

**How the canonical comment pattern helps translators:**
Each engine file (archetypes, traits, legacies) has the original rule text as a comment directly above the code that implements it, for example:

```ts
// SOURCE: CSM Army Customisation — Traits
// Blood Feud: If the unit uses a Charge order or gets charged by an enemy
// unit, it gains +1 to melee hit rolls until the end of the current battle
// round. COST: 5 normal · 0 character · 5 monster/vehicle
'Blood Feud': [
  { type: 'unit_ability', name: 'Blood Feud', desc: '...', applies_to: 'all' },
],
```

The comment gives you the exact English source text so you know precisely what `desc` should say in German or Spanish. You do not need to open the original HTML source files.

**To translate a rule description — making a field multi-language:**

Rule `desc` fields are currently plain English strings. To make one multi-language, change it from a `string` to an `I18nString` (defined in `src/data/changelog.ts`):

```ts
// Before — English only:
desc: 'The unit gains +1 to melee hit rolls when charging or charged.',

// After — three languages:
desc: {
  en: 'The unit gains +1 to melee hit rolls when charging or charged.',
  de: 'Die Einheit erhält +1 auf Nahkampf-Trefferproben, wenn sie angreift oder angegriffen wird.',
  es: 'La unidad gana +1 a las tiradas de golpe en cuerpo a cuerpo al cargar o ser cargada.',
},
```

The `useT()` hook in the UI resolves `I18nString` to the active language automatically — no UI changes needed, just the data change. Once you change the type, TypeScript will tell you to update every place that reads the field.

**Steps to convert a desc field:**
1. Change the field type in `types/data.ts` or the relevant interface from `string` to `I18nString` (import it from `'../data/changelog'`).
2. Update the value in the engine file to the `{ en, de, es }` object form.
3. Run `npm run build` — TypeScript will flag any remaining plain-string usages of that field so you don't miss any.
4. If you only have an English translation for now, you can use the same text for all three as a placeholder: `{ en: '...', de: '...', es: '...' }` — a native speaker can improve the DE/ES later.

**Changelog and Known Issues** (`src/data/changelog.ts`, `src/data/known-issues.ts`) already use `I18nString` — entries have `en`, `de`, and `es` keys. If you add a changelog entry, fill in all three.

### Translation PRs

- For `i18n/index.ts`-only PRs you do not need the full dev environment. Edit the file, run `npm run build`, confirm it passes.
- If you are unsure about a translation, leave a note in the PR description.
- Machine translation is acceptable as a starting point; native speaker review is preferred.

---

## Art contributions

The app displays a faction-specific background image on the print view. Each background is a PNG file in `src/assets/`.

### What is needed

The following factions currently use a shared or placeholder background and could benefit from dedicated artwork:

| Faction | Current background |
|---|---|
| Space Marines | shared (Imperium) |
| Grey Knights | shared (Imperium) |
| Inquisition | shared (Imperium) |
| Assassins | shared (Imperium) |
| Eldar | generic fallback |
| Dark Eldar | generic fallback |
| Harlequins | generic fallback |
| Leagues of Votann | generic fallback |

### Requirements

- **Format:** PNG
- **Minimum size:** 1600 × 900 px (the image is used as a full-width background)
- **Style:** dark, atmospheric, suitable for a Warhammer 40k context
- **Copyright:** fan art and original artwork only. Do not submit scans or photographs of official Games Workshop artwork. The image must be your own work or licensed under a Creative Commons licence compatible with CC BY-NC-SA 4.0.

### Naming convention

Name your file `<factionKey>Background.png`, matching the camelCase faction key used in the codebase. Examples: `eldarBackground.png`, `darkEldarBackground.png`, `harlequisBackground.png`.

### How to register a new background

1. Add the PNG to `src/assets/`.
2. Open `src/components/PrintView.tsx`.
3. Import the image at the top of the file, following the pattern of existing imports.
4. Add an entry to the `FACTION_BG` object mapping the faction name to the imported image.
5. Run `npm run build` and confirm the image loads correctly.

### Submitting art

Open a Pull Request with the PNG file and the `PrintView.tsx` change. Include a note on the source or authorship of the image so it can be verified as CC-compatible.

---

## Code contributions

### Architecture overview

```
src/engine/     Game logic — edit here for rules, points, validation
src/components/ UI — edit here for visual changes
src/store/      Zustand state — army list CRUD and selections
src/types/      TypeScript types — Unit, Weapon, RosterEntry, etc.
src/data/       Static data — changelog, faction metadata
src/i18n/       Translation strings (EN / DE / ES)
src/utils/      Shared helpers with no state of their own — stat maths, psychic-power lookup, exports
tts/            Tabletop Simulator mod (Lua) + its headless test
```

### Navigation — the four steps

Building an army is a linear flow of four steps, not a set of tabs. `App.tsx` holds all of the
navigation state: `screen` (`'home'` | `'flow'`), `step`, and `detachment` (which army the Units
step is showing). Nothing else in the app decides where the player is — if you find yourself
adding a second state machine inside a screen component, that is the mistake this replaced.

| File | Responsibility |
|---|---|
| `components/StepBar.tsx` | The step bar itself + the `Step` type and `STEP_ORDER`. Steps ②-④ are locked until a faction's data has loaded. On a phone only the active step keeps its label. |
| `components/LandingPage.tsx` | ONLY the front door — logo, release notes, admin announcement, quick-load, supplements. It must not grow screens of its own. |
| `components/FactionStep.tsx` | ① Battle Setup + saved armies + the faction grid. |
| `components/ReviewStep.tsx` | ④ Verdict, points (split per detachment), the full validation list, save/print/export. |
| `data/factionCatalog.ts` | `CATEGORIES` / `ALL_FACTIONS` / `DEFAULT_CODEX_VERSIONS` — plain data shared by the faction grid and the admin panel. |

Steps ② (Configuration) and ③ (Units) are rendered inline in `App.tsx`. ② owns everything about
the army that is not a unit: doctrine, legacy, traits, and the Allied Detachment. ③ owns the
catalogue and the list, with a Primary / Allied switch when an ally exists.

**Rules for anything you add here:** moving between steps must never discard data — the one
exception is switching to a different faction with units on the table, and it asks first. Any
screen a player can reach must have a visible way out that does not destroy their work.

### Engine files

| File | Responsibility |
|---|---|
| `points.ts` | Points calculation — base cost + options + traits + armory |
| `resolver.ts` | Unit profile resolution — applies marks, variants, archetypes, dispatches to `FACTION_RESOLVERS` |
| `validators.ts` | Army validation — slot limits, archetype constraints, engagement limits |
| `archetypes/base.ts` | `ArchetypeRule` shape (every flag an archetype can set) + the `BASE` default — shared by every faction |
| `archetypes/index.ts` | `ARCHETYPE_RULES` — every archetype for every faction, keyed by name |
| `legacies.ts` | `getLegacyStructuredNotes(faction, name)` / `getLegacyExtraPower(faction, name)` — cross-faction dispatcher that reads each faction's `codex_<faction>/legacies.ts` |
| `codex_<faction>/` | Per-faction engine module (one per faction) — every engine file for that faction lives here: `legacies.ts`, `traits.ts`, `resolver.ts`, `validator.ts`, `archetypes/{index.ts,rules.ts}` (when the faction needs them), plus the reference catalogs `keywords.ts`, `slots.ts`, `unit-types.ts`, `special-abilities.ts`, `weapon-abilities.ts` and a `digest.md` audit reference |
| `equipMods.ts` | Parses equipment stat modifiers (e.g., "+1 S") |
| `keywords.ts` | Keyword-derivation seam for wargear gating — derives Chaos-Mark requirements (`itemRequiredMark`), Terminator-armour compatibility (`modelRestrictsToTermSubset`), Gravis compatibility (`modelRestrictsToGravisSubset`), and the Inquisition Ordo/Legacy unlock helpers (`inquisitionLegacyOrdoUnlocks`, `chamberMilitantOrdo`) in one place. Edit this (not `ArmoryModal`) when changing how armour/mark/Ordo gating is derived. **Glyph convention:** `ᵀ` = Terminator-compatible (NOT Mark of Tzeentch); the glyph marks are `ᴷ`/`ᴺ`/`ˢ` (Khorne/Nurgle/Slaanesh) only — Tzeentch is section-based (`armory_marks.Tzeentch`) and `ᶻ` is reserved if a glyph is ever needed. **When work touches the Tzeentch-vs-Terminator distinction, ask the maintainer — do not assume.** |

### Weapon names and firing modes (`src/utils/weaponName.ts`)

A multi-profile weapon is stored as one entry per mode, and the data uses **two spellings**:

```
Plasma pistol - Standard   /  Plasma pistol - Overcharged     (dash)
Plasma gun (Standard)      /  Plasma gun (Overheating)        (brackets)
```

`resolver.ts`, `PrintView.tsx` and `UnitCard.tsx` each split on `' - '` only, so every
bracket-spelled weapon was three different weapons as far as the app was concerned — the modes
printed as separate rows, and only one of them got the right quantity. Always use
`weaponBaseName` / `weaponMode` / `isModeRow` from this file; never re-implement the split.

**These are for WEAPON names only.** Stripping a trailing `(...)` is safe there — no weapon in the
game ends in brackets without it being a mode — but it is *not* safe on option-choice names, where
Orks have a choice ending `(counts as two arm weapons)`.

### Renamed and removed datasheets (`src/engine/unitRenames.ts`)

A saved army stores every entry by unit **NAME**. When the author renames or deletes a datasheet,
that name stops resolving — and every consumer in the app treats an unresolvable unit the same way:
`resolveUnit()` returns `undefined`, `UnitCard` returns `null`, and the points sum does `: 0`. The
result is the worst kind of failure: the entry renders **nothing**, costs **nothing**, and still
holds its slot. The player sees a slot header reading *"1 unit · 0 pts"* with no card under it, and
an army that quietly got cheaper.

So a codex update that renames or removes a unit needs one of two things:

- **Renamed** → add it to `RENAMED_UNITS` (keyed by faction display name). It is mapped forward on
  load, in both `importRoster` and the persist migration, so the player never notices. Keep entries
  forever; deleting one breaks somebody's saved list.
- **Removed** → add a short note to `REMOVED_UNITS`. This only improves the message. Detection does
  **not** depend on the table: the validator flags any entry that fails to resolve, and `ArmyList`
  renders a `MissingUnitCard` in its place with a Remove button.

- **An option GROUP the update deletes** → add its index, in the OLD numbering, to
  `REMOVED_OPTION_GROUPS`. `optionQty` is keyed `[groupIndex][choiceIndex]`, so dropping a group
  renumbers every group after it and a saved list's selections slide onto the wrong options.
  `applyOptionGroupRemovals()` drops the removed keys and shifts the survivors down on load, next
  to the two renames above. Space Marines 1.04 is the worked example: the Desolation Squad's Krak
  missile launcher swap disappeared because the Krak missile became a free second profile of the
  standard launcher, which would have turned every saved Veteran Sergeant upgrade into a Vengor
  launcher. Adding a new *choice* needs no migration as long as it goes on the END of the list.

Archetypes have the same problem and the same fix one file over — `RENAMED_ARCHETYPES` in
`src/engine/archetypes/index.ts`.

### Weapon swaps (`scripts/check_weapon_swaps.ts`)

An option group with `replaces: ["X"]` makes the engine take X away when the swap is bought.
Without it the new weapon is simply **added**, so the card shows both and a squad ends up with more
guns than models. Nothing errors and the points stay right — only the weapon list is wrong.

```
npx jiti scripts/check_weapon_swaps.ts
```

It flags any group whose header uses swap/replace/exchange wording, names a weapon the unit
carries, offers choices, and has no `replaces`. **Exits non-zero**, so it is safe in a pre-push
check. GH#116 was one of these and the sweep it prompted found 26 more across 9 factions.

Two shapes to read the header for before acting:

- **Only one weapon is given up even when two are named.** Inquisition Servitors: *"swap their
  Paired shock chargers **for a** Shock charger and..."* — the Shock charger is what you receive.
- **Chained swaps replace the PREVIOUS weapon, not the base loadout.** A Termagant is equipped with
  Spinefists; group 1 swaps those for a Fleshborer; group 2 then swaps *the Fleshborer*.

### Wargear that names a weapon (`scripts/check_weapon_grants.ts`)

An armoury item hands a weapon over in one of two ways: a structured `effect.grants_weapons`, or a
text parser that matches a few sentence shapes. The parser is easy to fall outside of, and when you
do, the player silently gets nothing:

```
"...+1 Wound, a twin shuriken catapult and the ability "Jet bike"."   compound sentence
"Additionally, it gains the "Cleansing flame" weapon."               not "the model gains"
"The model gains a Twin heavy stubber."                              "stubber" is no known suffix
```

That was 13 items in 9 factions (GH#119). The checker works the other way round — it takes the
faction's **real weapon names** and looks for them in item descriptions, which does not care how
the sentence is phrased.

```
npx jiti scripts/check_weapon_grants.ts
```

**Two things to know before you act on a hit.** It is a review list, not a verdict: a description
may legitimately mention a weapon in order to BOOST it ("the Immolator's Twin heavy flamer gains +1
Strength"). And `effect.grants_weapons` is resolved **only** against `armory_general.weapons`, so
naming a weapon that is not in that list grants nothing — add it there first as a granted-only
entry (both prices `null`, the "Ossific Blades" convention). The checker flags that case too.

### Faction data shapes (`scripts/check_faction_shapes.ts`)

`loaders.ts` stitches each faction together from ~20 dynamic JSON imports and returns the result
`as unknown as FactionData`. That cast is load-bearing, but it means **a field can have the wrong
shape at runtime and the compiler will still call it valid**.

That is not hypothetical. `pacts` defaulted to `{}` for the 18 factions with no `pacts.json` while
its type promised `Power[]`, so `data.pacts.find(...)` threw `find is not a function` and took down
the whole Print View for any army with a psychic power selected — for weeks, silently (GH#113).

```
npx jiti scripts/check_faction_shapes.ts
```

It walks all 21 factions through the real loader and asserts that everything the code calls
`.find()` on — `prayers`, `pacts`, each discipline, every armory section — really is an array.
**Run it after touching `loaders.ts`, any `psychic/` or `armory/` data file, or the `FactionData`
type.** Exits non-zero on the first problem.

### Is a faction rule WIRED, or only written down? (`scripts/audit_faction_rule_coverage.cjs`)

Every `codex_<faction>/special-abilities.ts` holds that faction's rules verbatim. This asks of each
one: does its NAME appear anywhere the engine could ACT on it? Documentation
(`special-abilities.ts`, `keywords.ts`, `src/data/`, the rules-model digests) does not count.

```
node scripts/audit_faction_rule_coverage.cjs            # summary per faction
node scripts/audit_faction_rule_coverage.cjs --list     # every text-only rule
node scripts/audit_faction_rule_coverage.cjs necrons    # one faction
```

**Being named proves nothing. NOT being named proves the rule cannot fire** — that is the only
direction this trusts. It exists because a player found the Eldar *Webway strike* documented
correctly, printed correctly and wired to nothing; no data audit could see it, because the data was
right.

**The output is a worklist to READ, not a bug list.** Most entries are table action and correctly
prose. The category that matters is `army-rule`.

Two guards came out of the first pass, both worth copying the shape of:

- `check_weapon_grants_unit_ability.ts` — "if one model is equipped with X, the unit gains Y".
  **"Equipped with" means issued or taken as an option, NOT printed on the datasheet**; every
  buyable weapon is printed, so the loose reading is wrong on 11 of 12 Grey Knights sheets.
- `check_named_ward_abilities.ts` — an ability that IS a ward save while naming no number
  (Sororitas *Shield of Faith*, 6+, defined only in the Index). **The best value must still win**,
  so a 6+ never overwrites a better save, and `Aegis(X+)` must stay unparsed — it is a dispel roll.

### Relic enhancements (`scripts/check_enhancement_uniqueness.ts`)

Nineteen relics let you improve one weapon with one of +6″ Range / +1 Strength / -1 AP / +1 AT.
Ten of them also say **"Can be taken multiple times"**, and all nineteen say the enhancement is
**unique per army**.

```
npx tsx scripts/check_enhancement_uniqueness.ts
```

**The uniqueness line has TWO wordings.** Eighteen say "Every **enhancement** is unique per army";
the Adeptus Custodes *Vault weapon* says "Each **improvement** is unique per army". Match only the
first and that relic's rule is silently unenforced — `enhancementsUniquePerArmy()` accepts both.

**A relic that may be taken multiple times needs BOTH pickers to stay open**, not just the
enhancement one: the second copy must also say which weapon it improves. The guard names each gate
separately, and that is deliberate — an earlier version searched for the shared helper and passed
while the enhancement gate was still broken, because the weapon-target gate one line above matched
it. It was caught by driving the real modal, not by the check.

**The rule is enforced twice on purpose**: the picker greys out what is already taken, and a
validator flags duplicates — a list saved before the fix carries one, and no picker can retro-flag
that.

### Deployment rules bought per Wound (`scripts/check_deployment_upgrades.ts`)

Five factions sell a rule on their Index tab that lets one unit be set up differently, paid for per
Wound: Eldar/Harlequins **Webway strike**, Dark Eldar **Webway raid** (Infiltrators, +1/Wound,
infantry), Custodes **Lightning strike** (Deep Strike, +1/Wound or +4/Hull Point, Infantry/Walker)
and Orks **Tellyporta** (Deep Strike, +1/Wound, +4/Hull Point for vehicles and monstrous creatures).
They live in `src/engine/deploymentUpgrades.ts` and are toggled per roster entry.

```
npx tsx scripts/check_deployment_upgrades.ts
```

**"For each STARTED 1000 points" means CEIL**, as does the Ork "or part thereof" — the cap is
asserted at 1000 *and* 1001 precisely because this codebase has mixed up the floor/ceil pair before
("for every 500 points" is floor).

**`computeUnitPoints` takes `faction` as a REQUIRED parameter and must keep doing so.** Giving it a
default would let a forgotten call site under-charge in silence; required, the compiler names all
twelve. Pass `factionForEntry(item, data)`, never `data.faction` — an allied entry is priced against
the ALLY's faction, because an allied detachment picks its own Army Customisation.

**`resolveUnit` in `points.ts` is the unit LOOKUP, not a pricing call.** Its models carry the
datasheet's base cost and never move, so asserting a price delta through it always reads zero. Price
through `computeUnitPoints`, or through the resolver's `pts`.

### "Objective secured!" and allied detachments (`scripts/check_objective_secured_allies.ts`)

The Core Rules are absolute: *"Units that are taken in an allied detachment can never make use of
the 'Objective secured!' rule."* **The ability reaches a unit by three routes**, and gating one of
them is not enough:

1. the automatic conferral on every Troops selection (`resolver.ts`);
2. the Eldar Exarch power **Stand firm**, via `EXARCH_POWER_EFFECTS.unitAbility`;
3. **any armoury item whose description quotes the ability** — the generic quoted-ability parser in
   `equipMods` picks those up, so the Grey Knights Mandulian Reliquary grants it without any
   per-item wiring.

A fourth apparent route is prose: twelve archetype `notes` promise the ability and grant nothing.
Those stay, and `ArmyConfig.tsx` adds a caveat under them for the allied detachment instead.

```
npx tsx scripts/check_objective_secured_allies.ts
```

**The gate must test `factionSource` against the ACTIVE allied faction, never `factionSource`
alone:** an injected-supplement unit (Assassins, Horus Heresy) carries its own `factionSource`
without being an allied detachment in the rules sense, and keeps the ability. The guard asserts
that case, and it is the one a careless fix breaks while every other assertion still passes.

**If you add a probe here, set `slot` on the roster entry.** A `RosterEntry` carries its own slot
and `effectiveSlot` reads that, not `unit.slot` — the first run of this guard failed its own
Troops control because of it, which is exactly what that control is for.

### Allies: the matrix and the allied detachment (`check_ally_matrix_vs_core.cjs`, `check_allied_rules.ts`)

The Core Book's "Allies" section hands the list builder four things; the rest of it (auras, which
transport may carry whom, the Desperate Allies Leadership test) happens at the table.

```
node scripts/check_ally_matrix_vs_core.cjs "<core rules text dump>"
npx tsx scripts/check_allied_rules.ts
```

The first compares all 289 cells of `src/data/alliedMatrix.ts` against the rulebook's 17×17 grid.
**Mind the column pattern when editing it:** `SM` without a left boundary matches inside `CSM:'R'`,
which made its first run report 13 wrong cells, all in the SM column, on data that was correct.
Seven archetypes REWRITE a row of the matrix; those have their own guard,
`check_ally_matrix_overrides.ts`.

The second asserts the allied mini-AOP against the Core Book's list and that a unique / once-per-army
selection still counts once when you ally with your own faction. **If you write a probe involving an
allied entry, give the FactionData an `allied` map** — `resolveUnit` sends an allied item to
`data.allied[factionSource]`, and without it every allied unit resolves to `undefined`, so checks
skip them and a silent "no error" reads as an engine bug. Both controls in that guard exist for
exactly that reason: one copy must be legal, and two in the primary must be flagged.

### Psychic power display (`scripts/check_psychic_display.ts`)

A roster entry stores powers, prayers and pacts as **bare name strings**; every rules detail
(range, target, cast value, duration, effect) lives in the psychic data and is resolved at render
time by `src/utils/psychicFormat.ts`. Two things can break that, and each is invisible to a check
that only tests the other:

- **A pool the lookup does not search.** `GENERAL_DISCIPLINES` (`src/data/generalDisciplines.ts`)
  is **not part of `FactionData`** — it is the six disciplines every psyker in the game may pick
  from. It has to be added to `findPowerByName`'s pools explicitly. It once was not, and all 31 of
  its powers resolved to nothing in all 19 factions.
- **A render site that never calls the formatter.** There are four: `PsychicModal`, `UnitCard`,
  `PrintView` and `PlayView` (the battle view). The unit card once formatted prayers and pacts and
  printed powers as a bare name.

```
npx tsx scripts/check_psychic_display.ts
```

It asserts both halves: every one of the ~808 selectable powers resolves to a non-empty meta line,
**and** each render site really calls the formatter — with comments stripped first, because the
components' comments name the very functions the check greps for. **Run it after adding a
discipline, a psychic data file, or a new place that displays a power.**

### Core Book unit types (`scripts/check_unit_types.ts`)

The Core Rules' "Unit Types" section is mostly **in-game action** — Tank Shock, firing arcs, the
Vehicle Damage Chart, Hover Mode — and that part correctly lives in the wiki as prose. Four of its
statements change something a **roster builder** owns, and this guard asserts those four across all
670 datasheets:

- **Monstrous Creature and Monstrous Infantry cannot enter transport vehicles.** Both say so under
  Movement. Watch out: `"Monstrous Infantry"` **contains the word "Infantry"**, so a
  `unit_type.includes('infantry')` test reads it as permission. That was a real bug, for 33 units.
- **`is_monster` means Monstrous *Creature*** (or Gargantuan), never Monstrous Infantry. The canon
  is the price header on every Army Customisation sheet: `NORMAL | CHARACTER MODELS | MONSTROUS
  CREATURES & VEHICLES`. The flag selects that third column, so putting it on Monstrous Infantry
  prices and filters the unit as a creature.
- **No vehicle prints a Leadership value** — "Vehicles automatically pass Leadership tests as they
  do not have a Leadership value."
- **Every Walker carries `is_vehicle`** — "Walker: Acts like Vehicles." This matters because every
  vehicle gate in the engine (armoury access, trait scope, HP-vs-W, points) reads the **flag**, not
  the `unit_type` string. A Flyer whose `unit_type` omits "Vehicle" while `is_vehicle` is true is
  therefore **correct**, not a fault.

```
npx tsx scripts/check_unit_types.ts
```

**Run it after editing any datasheet's `unit_type` or its `is_vehicle`/`is_monster`/`is_character`
flags, or after touching `transportGate.ts`.** Exits non-zero and names every offender. Jump Pack
Infantry's "gains Deep Strike" is the fifth builder-owned statement and has its own guard,
`scripts/check_jump_pack_deep_strike.ts`.

### Tabletop Simulator export

An army built here can be exported to a Tabletop Simulator table. It is two halves that must be
changed together:

| File | Job |
|---|---|
| `src/utils/ttsExport.ts` | Builds the payload and downloads it (the **TTS** button in Print View) |
| `tts/Custom40k.lua` | The mod: reads that payload and spawns the cards |

**The mod carries no codex, on purpose.** The app resolves the army first — through the same
`resolveUnitProfile` the unit card and Print View use — so what ships is final stats, final weapon
profiles and real rules text. The Lua never has to know a Custom40k rule, and a codex update never
means re-uploading the Workshop item. Keep it that way: if you find yourself adding rules logic to
the Lua, the fix belongs in the export instead.

`TTS_SCHEMA` (TypeScript) and `SCHEMA` (Lua) must match; bump both together when the payload shape
changes.

**The Lua is tested — run the test before you touch it.** TTS has no headless mode, so the script
runs under the `fengari` Lua VM with TTS's globals stubbed, fed a real export:

```
npx jiti tts/test/makeExport.ts "Codex/<a saved army>.json" army.json
node tts/test/run.cjs army.json          # add --dump to read the rendered cards
```

Its first run caught four bugs before the file ever reached the game, the worst being that Lua's
`ipairs` stops at the first `nil` hole in a table literal — which silently deleted every prayer's
range/target/duration line, re-breaking exactly what v1.70 had just fixed. See `tts/README.md`.

### When to edit legacy files

`legacies.ts` (top-level) is a thin cross-faction dispatcher — it controls **which disciplines and prayers the psychic modal shows** based on the active legacy, and which extra power a legacy always grants. Each faction's own legacy data (armory-access rules, mark restrictions, discipline/prayer maps) lives in that faction's `codex_<faction>/legacies.ts`, read through the dispatcher.

- **`codex_space_marines/legacies.ts`** — Edit this if:
  - You add a new SM legacy discipline that should be gated (add it to `SM_LEGACY_DISC_MAP` mapping discipline name → required legacy name).
  - You add a new prayer that only appears with Legacy of the Crusader (add it to `SM_CRUSADER_PRAYERS`).
  - You rename an existing SM legacy or discipline.
- **`codex_grey_knights/legacies.ts`** — Edit this if you change which power a Legacy always grants GK psykers (`getGKLegacyPower`).
- **`codex_genestealer_cults/legacies.ts`** — Same mechanic for GSC: each Legacy teaches every Psyker one extra power (`getGSCLegacyPowerName`). It stores only the legacy → power NAME; the power's text is resolved from the codex's own "Legacy Psychic Powers" discipline, so never copy the text in here.
- **`codex_<faction>/legacies.ts`** — Edit this for a faction's Legacy armory-access rules or mark restrictions (e.g. `codex_csm/legacies.ts`'s `CSM_LEGACY_NOTES`).

If you add a new faction with legacy-gated disciplines, create a `codex_<faction>/legacies.ts` file following the same pattern, wire it into `PsychicModal.tsx`, and register it in top-level `legacies.ts`'s `FACTION_LEGACY_NOTES` map if it also needs structured-note display.

### Data structure (per-faction folders)

Faction data lives in `data/parsed/<faction>/` — one folder per faction, not a flat directory of monoliths.

```
data/parsed/
  chaos_space_marines/
    units.json           { faction, slot_to_units, units }
    armory/
      general.json       Armory (general — all models access)
      mark_khorne.json   Mark-specific armory (Chaos factions only)
      legion_*.json      Legacy/chapter armory (one file per legacy)
    psychic/
      disciplines.json   Psychic disciplines array
      prayers.json       Prayers/incantations
      pacts.json         In-game mechanics (e.g. Blood Tithe, Daemonkin table)
      daemonkin.json     Daemonkin summoning table
    archetypes.json      { archetypes[], legacies[], traits[] }
    animosity.json       { animosity, allied }   ← only CSM/CD (marks animosity table)
  space_marines/         (same structure, no marks/animosity.json)
  chaos_daemons/
  ...
  _supplements/          Supplement JSON files (e.g. horus_heresy.json)
  _scratch/              Parser-audit files (*_html_*.json) — never loaded by the app
```

The loader that assembles each faction's `FactionData` is **`src/data/loaders.ts`** — it imports the individual files with static string literals (required by Vite) and merges them. The engine receives exactly the same `FactionData` shape as before; only the file layout changed.

**Adding a new faction:**
1. Create `data/parsed/<faction>/` with a `units/` folder (see structure above) + `armory/general.json` at minimum.
2. Add optional sub-files (`archetypes.json`, `animosity.json` if the faction has marks, `psychic/`, more armory files) as needed.
3. Add a `case '<faction>'` in `src/data/loaders.ts` that loads the files and calls `asm(...)`.
4. Add the key to `FACTION_LOADERS` at the bottom of `loaders.ts`.
5. Register the faction in `src/data/factionCatalog.ts` (the `CATEGORIES` list that feeds the card grid, the admin availability toggles and the codex-version badges) and add its abbreviation / category to `src/components/FactionSymbol.tsx`.
6. Add engine rules if needed: `src/engine/factions/<faction>/` (resolver, archetypes, traits, validators).

### Where to start / how to help

- **`OPEN_QUESTIONS.md`** (repo root) lists what the project needs help with: **rules questions**
  (an ambiguous rule that needs a canonical answer before it can be coded — you don't need to code to
  help) and **code issues** (engine/UI bugs a developer can fix).
- Open a GitHub issue with the matching template — **Rules question**, **Code issue**, **Data
  correction**, or **Bug report** (`.github/ISSUE_TEMPLATE/`). Answering a rules question unblocks the
  implementation; the maintainer wires it up.
- The in-app **Known Issues** panel (`src/data/known-issues.ts`) is the user-facing tracker; it and
  `OPEN_QUESTIONS.md` overlap on code issues but the latter also holds the unanswered rules questions.

### Structured rules effects & cost primitives (added v0.51–v0.52)

Some rules can't be expressed by the description text alone — they need structured fields the engine reads. **Watch the datasheet VERB when choosing the field.**

- **`OptionEffect`** (`types/data.ts`) — carried on a `Choice`, an `OptionGroup`, **or an `ArmoryItem`** (`item.effect`). Fields:
  - `stat_mod: [{ stat, delta }]` — e.g. `+6" M` from a jump pack.
  - `adds_unit_types: string[]` — **additive** type gain. Verb "**gains** the unit type X". The model keeps its existing type(s).
  - `set_unit_type: string` — **replacement** of the whole type line. Verb "**change** unit type **to** X".
  - `grants_abilities: string[]` — special rules granted (only what the datasheet states).
  - Effects are applied in `resolver.ts` (`applyEffect`) and are **de-duplicated against the model's base profile** — a type or ability the model already has is never re-added. Stats and quoted abilities of an armory item still come from `equipMods` (description parsing); `item.effect` only carries the type change.
  - **Type vs ability is not the same thing.** `"Jump Pack Infantry"` is a unit TYPE (gives Deep Strike); `"Jump pack"` is an ABILITY (does not). Model what the datasheet literally says.
- **`OptionGroup.per_model`** — set `true` on an inline option OR a regular `choices[]` group whose datasheet says "for +X points **per model**" (or "...receive one of the following upgrades **per model**"). The points engine then charges `inline_pts × unit size` (inline) or `choice.points × qty × unit size` (choices) instead of once for the whole unit. Flat one-off inline options (promote one Sergeant) and "every model may swap X" groups (whose `qty` already equals the chosen count) leave it unset.
- **`equipMods.ts`** — parses `+stat`, saves, and quoted abilities from an armory item's `desc`. It skips quoted unit-type words (they're handled by the type system) and de-duplicates granted abilities against the unit's base abilities.
- **Skirmish equipment caps** live in `validators.ts` (inside the `eng.statCaps` block). They enforce the Missions-supplement restrictions: no gaining a 2+ armour save, 4+ or better invuln, T8+, a Damage-3 weapon, or more than one Unique armory item — all grounded in `Codex/missions_text.txt` and `core_rules_text.txt`. Add new caps here, not in the UI.

> **Encoding (mojibake):** when editing JSON or TS data by hand, keep files UTF-8. Garbled sequences like `â€"` (should be `—`) creep in from copy-paste; `scripts/_scan_mojibake.cjs` detects them. Don't paste from rich-text editors.

> **Proactive bug sweep:** `scripts/sanity_sweep.ts` imports the real production data/engine modules directly (run with `npx tsx scripts/sanity_sweep.ts`, no install needed) and flags structural red flags without waiting for a player bug report: dead option groups (`choices: []` on a constraint that expects real choices), `is_character`/`unit_type` contradictions, dangling unit-name references in `engine/archetypes`, dangling `slot_to_units` entries, `replaces` naming a weapon not on the unit, dangling `variant_link` references, and duplicate weapon names within one unit. It's a structural checker, not a rules checker — every hit still needs a human read before treating it as a confirmed bug (see the script's own header comments for known false-positive shapes). Re-run it after any data edit touching those fields, and especially before a release push.

> **Keeping the canon in sync:** `scripts/fetch_codex.cjs` downloads every faction spreadsheet straight from the author's Google Sheets (the links live in the hyperlink table inside `Codex/Custom40k Core Rules.docx`) and reports which of our `Codex/*.ods` copies are out of date, tab by tab. Run it bare to survey everything, or name factions to check just those. Adding `--apply` overwrites our copy — deliberately opt-in and per-faction, because **replacing a .ods means that faction is un-audited again and owes a full pass** (see the rule below). Never bulk-apply.

> **Keeping the RULES DOCUMENTS in sync:** `fetch_codex.cjs` covers the faction sheets and nothing else, so for a long time the three rulebooks could go stale with no signal at all — and did: our Core Rules copy sat at 1.262 while the live document had moved to 1.264. `scripts/fetch_docs.cjs` closes that. It pulls the Core Rules, Missions and Planetary Assault documents from their live Google Docs, compares the EXTRACTED TEXT rather than the file bytes (Google re-exports a different zip every time, so byte equality would report a change on every run), prints each document's `Rules version`, and exits non-zero if any of them differ. `--write` replaces the stale copies. Run it next to `fetch_codex.cjs` before any work that touches rules text — a rule quoted from a stale document is worse than no answer, because it looks right.

> **Auditing a faction against its sheet:** `scripts/ods_audit.cjs "Codex/<faction>.ods" <faction dir>` compares the spreadsheet with production unit by unit — model rows (name / min / max / stats / points), weapon profiles, the `equipped_with` sentence, and option-group choice names and prices — and prints the differences without writing anything. Add a unit name as a third argument to check just one. Read every line and decide each one: the sheet wins on FACTS, production wins on SEMANTICS, and the author's own typos (a stray trailing period, a copy-pasted unit name) show up here too. One spreadsheet artefact it already handles: a `No.` cell of `4-19` is stored as a DATE, so the tool reads the formatted text rather than the raw serial number — do not "fix" that in the sheet.


### Changelog vs Known Issues (important — split since v0.47)

These two files serve different purposes and must not be confused:

| File | What goes here |
|---|---|
| `src/data/changelog.ts` | Version history — one entry per release with EN/DE/ES change descriptions |
| `src/data/known-issues.ts` | Bug and limitation tracking — status can be `known`, `investigating`, `fixed`, `by_design`, or `planned` |

**Before v0.47** both lived in `changelog.ts`. They are now separate. If you fix a known bug:
1. Open `src/data/known-issues.ts`, find the issue by its `id`, and set `status: 'fixed'`.
2. Add a line to the current version entry in `src/data/changelog.ts` describing the fix.

Do **not** edit `changelog.ts` to update issue statuses — it no longer contains `KNOWN_ISSUES`.

### TypeScript conventions

- No `any` — use the types in `src/types/`
- Zero TypeScript errors required — `npm run build` must pass
- Prefer narrow types over wide ones; add to `src/types/` if a shape recurs
- No new dependencies without prior discussion in an issue

### Adding a missing data file to an existing faction

Many factions have some files still empty or missing. If you want to fill in data for a faction — for example adding its psychic disciplines, a legacy armory, or its archetypes — use the templates below. After creating or editing any file, run `npm run build` to confirm the JSON is valid.

**`archetypes.json`** — archetypes, legacies, and traits for this faction:
```json
{
  "archetypes": [
    {
      "name": "Archetype Name",
      "desc": "Full rule text from the Army Customisation sheet, exactly as written."
    }
  ],
  "legacies": [
    {
      "name": "Legacy Name",
      "desc": "Full rule text."
    }
  ],
  "traits": [
    {
      "name": "Trait Name",
      "desc": "Full rule text.",
      "pts_unit": "5",
      "pts_char": "0",
      "pts_monster": "5",
      "pts_veh": "5"
    }
  ]
}
```
> Trait cost columns: `pts_unit` = normal models, `pts_char` = character models, `pts_monster` / `pts_veh` = Monstrous Creatures & Vehicles (shared column). Use `"-"` for unavailable, `"5*"` for per-Wound/HP costs.

**`animosity.json`** — marks animosity / allied compatibility table (only factions with marks: CSM, CD):
```json
{
  "animosity": {},
  "allied": {}
}
```

**`armory/legion_<name>.json`** — a chapter, legacy, or sept armory:
```json
{
  "name": "Legacy of the Example",
  "weapons": [],
  "equipment": [],
  "daemon_weapons": []
}
```
After creating this file, register it in `src/data/loaders.ts` — find the faction's `case` and add the new import + key to the `legions` object passed to `asm()`.

**`armory/mark_<god>.json`** — a Chaos mark-specific armory (Chaos factions only):
```json
{
  "name": "Mark of Khorne Armory",
  "weapons": [],
  "equipment": [],
  "daemon_weapons": []
}
```
Register it in `loaders.ts` under the faction's `marks` object.

**`psychic/disciplines.json`** — psychic discipline definitions:
```json
[]
```

**`psychic/prayers.json`** — prayers / incantations:
```json
[]
```

**`psychic/daemonkin.json`** — in-game daemonkin table (used by Chaos factions):
```json
{}
```

> **After adding any file:** open `src/data/loaders.ts`, find the faction's `case`, and make sure the new file is imported and passed to `asm()`. Files that are never imported by the loader are never loaded by the app — the file alone is not enough.
3. Verify that `npm run build` passes and the faction loads in the app

### Events & Leagues (`api/events/[action].js`, `src/components/EventsModal.tsx`)

Organiser-run events and leagues, built to the author's requirements doc. Three tables:
`events`, `event_players`, `event_games`.

Three things the design settles up front, so they are not re-argued in a review:

- **An event and a league are the same row.** Everything except the standings is identical, so
  `is_league` only decides whether standings are generated. A separate table would have duplicated
  registration, approval and list assignment.
- **A reported game does not count until the OPPONENT confirms it**, and only the opponent can —
  not the organiser, or the confirmation would mean nothing. A rejected report becomes `disputed`
  and stays visible to the organiser rather than disappearing.
- **Standings are derived, never stored.** A stored table drifts the moment a game is disputed or
  corrected, and nothing here is expensive enough to cache.

`is_test` + the `reset-test` action exist because the feature is meant to be run closed first, with
invented players and lists, then wiped before it opens. That wipe is a real operation from day one
rather than a manual database clean-up.

**The module is alpha-gated**: the landing-page button is disabled for everyone except admins, the
same pattern Campaign uses.

**⚠ Before adding any endpoint under `api/`, read the note on the Vercel function cap below.**

### The 12-function cap (`api/`)

Vercel's Hobby plan caps a deployment at **12 serverless functions** and `api/` sits exactly at 12.
Files under `api/_lib/` are imported, not routed, so they do not count. This is why several routers
are `[action].js` files with a `switch` instead of one file per endpoint.

Adding a new endpoint means **freeing a slot first**. Check with:

```bash
find api -name "*.js" -not -path "api/_lib/*" | wc -l
```

### Rules-model digests (`src/data/rules-model/<faction>.md`)

Each audited faction has a Markdown digest in `src/data/rules-model/` (template: `_TEMPLATE.md`).
It records the faction's keyword vocabulary, wargear-gating rules, points model, per-slot datasheet
option-semantics, and an engine gap-check, all validated against the canonical source HTML and the
production JSON. These are reference documents for contributors and the engine — not loaded by the
app. When you audit or correct a faction's data, update its digest so it stays in sync.
Cross-faction supplements use the same folder and naming (e.g. `escalation.md` for the
Escalation / Lords of War supplement).

### Translations

If you add a UI string, add entries for all three languages (EN / DE / ES) in `src/i18n/index.ts`. Machine translation is acceptable for ES and DE; native speaker review is welcome.

> **German translations:** use official Games Workshop German terminology, not literal translations. Slot names follow GW convention: `Standard` (Troops), `Elite` (Elites), `Sturm` (Fast Attack), `Unterstützung` (Heavy Support). Stat abbreviations: `Reichw.` (Range), `DS` (AP), `SW` (Damage). Armory is `Rüstkammer`, not `Waffenkammer`.

---

## Pull request checklist

Before opening a PR, confirm:

- [ ] `npm run build` passes with zero TypeScript errors
- [ ] The change is scoped to one thing (one unit, one bug, one feature)
- [ ] New UI strings have translations in all three languages
- [ ] If a known issue is fixed, the `status` in `src/data/known-issues.ts` is updated to `'fixed'`
- [ ] The PR description explains what changed and why (a link to the relevant issue is enough)

PRs that do not pass the build check will not be reviewed until they do.

---

## License

By contributing, you agree that your contributions will be licensed under the same [CC BY-NC-SA 4.0](LICENSE) license as the rest of the project.
