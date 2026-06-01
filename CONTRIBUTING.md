# Contributing to Custom 40k Builder

Thanks for helping improve the builder. This guide covers everything you need to contribute, whether it's a data correction, a bug fix, or a new feature.

---

## Table of contents

1. [Quick start](#quick-start)
2. [Reporting issues](#reporting-issues)
3. [Data corrections (no coding required)](#data-corrections-no-coding-required)
4. [Code contributions](#code-contributions)
5. [Pull request checklist](#pull-request-checklist)

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

Translation strings live in `src/i18n/index.ts`. If you add a UI string, add entries for all three languages (EN / DE / ES). Machine translation is acceptable for ES and DE; native speaker review is welcome.

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
