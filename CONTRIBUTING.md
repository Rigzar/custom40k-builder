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
| `legacies/index.ts` | `getLegacyStructuredNotes(faction, name)` — dispatcher for legacy rule lookups |
| `equipMods.ts` | Parses equipment stat modifiers (e.g., "+1 S") |

### TypeScript conventions

- No `any` — use the types in `src/types/`
- Zero TypeScript errors required — `npm run build` must pass
- Prefer narrow types over wide ones; add to `src/types/` if a shape recurs
- No new dependencies without prior discussion in an issue

### Adding a new faction

1. Add the faction JSON to `data/parsed/` following the schema in `README.md`
2. Register it in `src/data/factions.ts`
3. Verify that `npm run build` passes and the faction loads in the app

### Translations

If you add a UI string, add entries for all three languages (EN / DE / ES) in `src/i18n/index.ts`. Machine translation is acceptable for ES and DE; native speaker review is welcome.

---

## Pull request checklist

Before opening a PR, confirm:

- [ ] `npm run build` passes with zero TypeScript errors
- [ ] The change is scoped to one thing (one unit, one bug, one feature)
- [ ] New UI strings have translations in all three languages
- [ ] If a known issue is fixed, the `status` in `src/data/changelog.ts` is updated to `'fixed'`
- [ ] The PR description explains what changed and why (a link to the relevant issue is enough)

PRs that do not pass the build check will not be reviewed until they do.

---

## License

By contributing, you agree that your contributions will be licensed under the same [CC BY-NC-SA 4.0](LICENSE) license as the rest of the project.
