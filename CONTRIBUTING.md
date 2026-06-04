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

This is the highest-impact way to contribute. Each faction lives in a single JSON file:

```
data/parsed/<faction>.json
```

### Workflow

1. Open the JSON file for your faction in any text editor.
2. Find the unit — it's a key inside `"units": { ... }`.
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
| `is_character` / `is_vehicle` / `is_psyker` | Unit classification flags |
| `champion_has_armory` | True only if the champion (sergeant-equivalent) can access the armory independently |
| `advisor` | True only for units that are advisors (e.g., Commissar) |
| `abilities[]` | Ability text present and correct |

### Constraint types for `option_groups`

| `constraint.type` | Meaning |
|---|---|
| `one` | Pick 0 or 1 from the list (most common) |
| `every` | Every model picks independently — cost is per model |
| `per_n` | One pick per N models (`constraint.n` specifies N) |
| `fixed_max` | Up to N picks total (`constraint.max` specifies N) |
| `mark` | Mark of Chaos selection |
| `veteran` | Veteran ability slot |
| `unique_upgrade` | Unit-level unique restriction |

### Armory fields

The general armory (weapons, equipment, daemon weapons available to all eligible units in the faction) lives at the top level of the faction JSON:

```json
"armory_general": {
  "weapons": [...],
  "equipment": [...],
  "daemon_weapons": []
}
```

Faction-specific armory sections (e.g., mark-locked items for CSM) may appear as `armory_marks`, `armory_vehicles`, etc.

---

## Translations

The app supports three languages: **English (EN)**, **German (DE)**, and **Spanish (ES)**. All UI strings live in a single file:

```
src/i18n/index.ts
```

Each string is an object with `en`, `de`, and `es` keys:

```ts
appTitle: {
  en: 'Custom 40k Army Builder',
  de: 'Custom 40k Armeeliste',
  es: 'Creador de Ejércitos Custom 40k',
},
```

### How to find untranslated strings

Search the file for strings where the `de` or `es` value is identical to `en` — those are machine-translated or missing. Native-speaker corrections are always welcome.

### Adding or fixing a translation

1. Open `src/i18n/index.ts`.
2. Find the string you want to fix (search for the English text).
3. Edit the `de` or `es` value.
4. Run `npm run build` — the file is TypeScript, so a typo will cause a build error.
5. Open a Pull Request with your change. You do not need to fix all strings — partial improvements are welcome.

### Translation PRs

- You do not need to set up the full dev environment for translation-only PRs. Just edit the file and verify the build passes.
- If you are not sure about a translation, leave a note in the PR description.
- Machine translation is acceptable as a starting point, but native speaker review is preferred.

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
```

### Engine files

| File | Responsibility |
|---|---|
| `points.ts` | Points calculation — base cost + options + traits + armory |
| `resolver.ts` | Unit profile resolution — applies marks, variants, archetypes |
| `validators.ts` | Army validation — slot limits, archetype constraints, engagement limits |
| `archetypes.ts` | Archetype rule definitions and enforcement |
| `archetypes/csm.ts` | CSM archetype definitions (engine flags) |
| `archetypes/rules/csm-rules.ts` | CSM archetype rule data (13 archetypes with categorised notes for engine use) |
| `legacies/csm-legacies.ts` | CSM legacy rule data (5 legacies — armory access + mark restrictions) |
| `legacies/sm-legacies.ts` | SM legacy rule data — discipline gate map and Crusader prayer set |
| `legacies/index.ts` | `getLegacyStructuredNotes(faction, name)` — dispatcher for legacy rule lookups |
| `equipMods.ts` | Parses equipment stat modifiers (e.g., "+1 S") |
| `keywords.ts` | Keyword-derivation seam for wargear gating — derives Chaos-Mark requirements (`itemRequiredMark`), Terminator-armour compatibility (`modelRestrictsToTermSubset`) and Gravis compatibility (`modelRestrictsToGravisSubset`) in one place. Edit this (not `ArmoryModal`) when changing how armour/mark gating is derived. **Glyph convention:** `ᵀ` = Terminator-compatible (NOT Mark of Tzeentch); the glyph marks are `ᴷ`/`ᴺ`/`ˢ` (Khorne/Nurgle/Slaanesh) only — Tzeentch is section-based (`armory_marks.Tzeentch`) and `ᶻ` is reserved if a glyph is ever needed. **When work touches the Tzeentch-vs-Terminator distinction, ask the maintainer — do not assume.** |

### When to edit legacy files

The `legacies/` folder holds engine-level rules that cannot live in the JSON — they control **which disciplines and prayers the psychic modal shows** based on the active legacy.

- **`legacies/sm-legacies.ts`** — Edit this if:
  - You add a new SM legacy discipline that should be gated (add it to `SM_LEGACY_DISC_MAP` mapping discipline name → required legacy name).
  - You add a new prayer that only appears with Legacy of the Crusader (add it to `SM_CRUSADER_PRAYERS`).
  - You rename an existing SM legacy or discipline.
- **`legacies/csm-legacies.ts`** — Edit this if you add or change CSM legacy armory access rules or mark restrictions.

If you add a new faction with legacy-gated disciplines, create a new `legacies/<faction>.ts` file following the same pattern and wire it into `PsychicModal.tsx`.

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
    rules.json           { animosity, allied }
  space_marines/         (same structure, no marks)
  chaos_daemons/
  ...
  _supplements/          Supplement JSON files (e.g. horus_heresy.json)
  _scratch/              Parser-audit files (*_html_*.json) — never loaded by the app
```

The loader that assembles each faction's `FactionData` is **`src/data/loaders.ts`** — it imports the individual files with static string literals (required by Vite) and merges them. The engine receives exactly the same `FactionData` shape as before; only the file layout changed.

**Adding a new faction:**
1. Create `data/parsed/<faction>/` with `units.json` + `armory/general.json` at minimum.
2. Add optional sub-files (`archetypes.json`, `rules.json`, `psychic/`, more armory files) as needed.
3. Add a `case '<faction>'` in `src/data/loaders.ts` that loads the files and calls `asm(...)`.
4. Add the key to `FACTION_LOADERS` at the bottom of `loaders.ts`.
5. Register the faction in `src/components/LandingPage.tsx` (the card grid).
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
- **`OptionGroup.per_model`** — set `true` on an inline option whose datasheet says "for +X points **per model**". The points engine then charges `inline_pts × unit size` instead of once. Flat one-off inline options (promote one Sergeant) leave it unset.
- **`equipMods.ts`** — parses `+stat`, saves, and quoted abilities from an armory item's `desc`. It skips quoted unit-type words (they're handled by the type system) and de-duplicates granted abilities against the unit's base abilities.
- **Skirmish equipment caps** live in `validators.ts` (inside the `eng.statCaps` block). They enforce the Missions-supplement restrictions: no gaining a 2+ armour save, 4+ or better invuln, T8+, a Damage-3 weapon, or more than one Unique armory item — all grounded in `Informacion/missions_text.txt` and `core_rules_text.txt`. Add new caps here, not in the UI.

> **Encoding (mojibake):** when editing JSON or TS data by hand, keep files UTF-8. Garbled sequences like `â€"` (should be `—`) creep in from copy-paste; `scripts/_scan_mojibake.cjs` detects them. Don't paste from rich-text editors.

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

### Adding a new faction

1. Add the faction JSON to `data/parsed/` following the schema in `README.md`
2. Register it in `src/data/factions.ts`
3. Verify that `npm run build` passes and the faction loads in the app

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
