# Custom 40k Builder

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](LICENSE)

An army list builder for a custom Warhammer 40,000 / Horus Heresy ruleset, covering 19 factions with full unit data, weapons, options, archetypes, legacies, traits and psychic disciplines.

**[→ Open the app](https://custom40k-builder.vercel.app)**

---

## Features

- 19 factions with full unit datasheets (weapons, stats, options, abilities)
- Live points calculation — engagement limits, per-model and per-wound costs, Skirmish stat caps enforced
- Armory system — weapons, equipment, daemon weapons, chapter/legacy armories linked per faction
- Archetypes, Legacies and Army Traits with active rule enforcement
- Psychic disciplines, Prayers and Pacts per faction
- Veteran Abilities and Vehicle Upgrades
- Print view — formatted army sheet with cover page, list toggle and slot groupings
- Supplements — Horus Heresy (Beta) and Escalation/Lords of War (Alpha, Chaos only)
- Multi-language UI: English, Deutsch, Español
- Custom unit nicknames, model count display, Join Unit pre-assignment
- Export / Import army lists

---

## Stack

React · TypeScript · Vite · Zustand · Tailwind CSS

---

## Getting started locally

```bash
git clone https://github.com/Rigzar/custom40k-builder.git
cd custom40k-builder
npm install
npm run build        # verify — must pass with zero TypeScript errors
npm run preview      # serve the built app at http://localhost:4173
```

> **Do not use `npm run dev`** — always use `npm run build` to verify correctness and `npm run preview` to test the built output.

---

## Project structure

```
custom40k-builder/
├── src/
│   ├── components/         # React UI components
│   │   ├── LandingPage.tsx     # Faction selection + Developer Update announcement
│   │   ├── UnitCard.tsx        # Individual unit card (options, armory, traits)
│   │   ├── ArmyConfig.tsx      # Archetype / Legacy / Traits panel
│   │   ├── ArmoryModal.tsx     # Armory item picker
│   │   └── PrintView.tsx       # Printable army sheet
│   │
│   ├── engine/             # Game logic (points, validation, rules)
│   │   ├── core/               # Shared engine: points, resolver, validators, keywords
│   │   ├── archetypes/         # Per-faction archetype rule flags
│   │   │   ├── csm.ts              # 13 CSM archetypes (canonical rule text as comments)
│   │   │   ├── space-marines.ts    # 8 SM archetypes
│   │   │   └── chaos_daemons.ts    # 6 CD archetypes
│   │   ├── traits/             # Per-faction trait effects (stat mods, abilities)
│   │   │   ├── csm.ts              # 17 CSM traits — all wired
│   │   │   └── space-marines.ts    # 19 SM traits — all wired
│   │   ├── legacies/           # Legacy-gated discipline and prayer rules
│   │   ├── validators/         # Faction-specific validation (SM composition, etc.)
│   │   └── weapons/            # Vehicle weapon override helpers
│   │
│   ├── data/
│   │   ├── loaders.ts          # Assembles FactionData from per-faction folder files
│   │   ├── changelog.ts        # Version history (EN/DE/ES)
│   │   └── known-issues.ts     # Bug and limitation tracker
│   │
│   ├── store/
│   │   └── army.ts             # Zustand store — army state and actions
│   │
│   ├── types/
│   │   ├── data.ts             # Unit, Weapon, OptionGroup, FactionData, OptionEffect…
│   │   ├── army.ts             # RosterEntry, ArmyState, TraitSelection…
│   │   ├── unit-types.ts       # Canonical UnitType union (Infantry, Bike, Jump Pack Infantry…)
│   │   └── keywords.ts         # ChaosMark, ArmourKeyword, MARK_GLYPHS typed constants
│   │
│   └── i18n/
│       └── index.ts            # Translation strings (EN / DE / ES)
│
├── data/
│   ├── parsed/                 # ← FACTION DATA — one folder per faction
│   │   ├── chaos_space_marines/
│   │   │   ├── units.json          # { faction, slot_to_units, units }
│   │   │   ├── armory/
│   │   │   │   ├── general.json    # General armory
│   │   │   │   ├── mark_khorne.json
│   │   │   │   └── legion_*.json   # One per legacy (Black Legion, Iron Warriors…)
│   │   │   ├── psychic/
│   │   │   │   ├── pacts.json
│   │   │   │   └── prayers.json
│   │   │   ├── archetypes.json     # { archetypes[], legacies[], traits[] }
│   │   │   └── rules.json          # { animosity, allied }
│   │   ├── space_marines/      (same structure, no marks)
│   │   ├── chaos_daemons/
│   │   ├── ... (17 more factions)
│   │   ├── _supplements/       # horus_heresy.json, escalation/…
│   │   └── _scratch/           # Parser audit files — never loaded by the app
│   │
│   └── source/                 # Original HTML source files used for auditing
│       ├── Chaos Space Marines ENG/
│       └── ... (one folder per faction)
│
└── scripts/
    ├── _html2txt.cjs           # Strip HTML source to readable text for auditing
    ├── _scan_mojibake.cjs      # Detect encoding artifacts in JSON/TS files
    ├── _normalize_unit_types.cjs  # Cross-faction unit_type casing normalizer
    └── _scan_cost_bugs.cjs     # Scan for pricing bugs (per-model, fill-model)
```

---

## Faction data format

Each faction lives in `data/parsed/<faction>/`. The loader in `src/data/loaders.ts` assembles the
individual files into the `FactionData` shape the engine expects.

**`units.json`** — core unit data:
```json
{
  "faction": "chaos_space_marines",
  "slot_to_units": { "HQ": ["Chaos Lord", ...], "Troops": [...] },
  "units": {
    "Chaos Lord": {
      "name": "Chaos Lord",
      "slot": "HQ",
      "models": [{ "name": "Chaos Lord", "points": 65, "min": 1, "max": 1, "stats": { "M": "6\"", "WS": "2+", ... } }],
      "equipped_with": "Every model is equipped with: Bolt pistol; Power sword.",
      "weapons": [...],
      "option_groups": [
        {
          "header": "May replace Power sword with:",
          "constraint": { "type": "one" },
          "choices": [{ "name": "Power fist", "points": 10 }],
          "inline_pts": null,
          "per_model": false,
          "variant_link": null,
          "is_unique_per_army": false
        }
      ],
      "abilities": ["..."],
      "unit_type": "Character Model",
      "is_character": true,
      "is_vehicle": false,
      "is_psyker": false,
      "champion_has_armory": false,
      "has_veteran_abilities": true
    }
  }
}
```

**`archetypes.json`** — Army Customisation data:
```json
{
  "archetypes": [{ "name": "Legionnaire Warband", "desc": "Full canonical rule text..." }],
  "legacies":   [{ "name": "Legacy of the Warmaster", "desc": "...", "armory_key": "Black Legion" }],
  "traits":     [{ "name": "Siege Experts", "desc": "...", "pts_unit": "5", "pts_char": "0", "pts_monster": "5", "pts_veh": "5" }]
}
```

> **`armory_key` must match the key in `src/data/loaders.ts`** for that faction's `armory_legions` object. If they diverge the legacy armory tab will not appear.

### Key field reference

| Field | Type | Notes |
|---|---|---|
| `unit_type` | string | Must use Core Rules canonical spelling — see `src/types/unit-types.ts` |
| `option_groups[].per_model` | boolean | Set `true` when header says "for +X points **per model**" (inline options) |
| `option_groups[].effect` | OptionEffect | Structured rule change: `stat_mod`, `adds_unit_types`, `set_unit_type`, `grants_abilities` |
| `armourKeyword` | string | Innate armour class — drives ᵀ/ᴳ armory gating |
| `pts_monster` / `pts_veh` | string | Shared "Monstrous Creatures & Vehicles" column — must be equal |

---

## Data update workflow (Alpha — link-based review)

> ⚠️ This workflow is **Alpha**. The goal is to automate it, but it is not yet fully automatic.

The maintainer can review faction data directly from the canonical Google Sheets source by pasting the sheet URL. The process:

1. Maintainer pastes a link to the faction's source sheet (Google Sheets, HTML or text)
2. The engine reads the source and cross-checks it against the production JSON
3. Discrepancies are listed (wrong stats, missing weapons, wrong costs, unimplemented options)
4. Each discrepancy is grounded against the canonical rules files (`Informacion/core_rules_text.txt`, `missions_text.txt`) before a fix is applied
5. Fix is applied, build verified, and logged in the changelog

**If you have the source data for an unaudited faction**, open a GitHub Issue with the link or paste the data — that immediately unblocks a full audit. See `OPEN_QUESTIONS.md` for the current list of open items.

---

## Engine rules pattern

Each archetype, trait, and legacy in the engine files has the **canonical rule text as a comment**
directly above its code block:

```typescript
// SOURCE — Siege Experts:
// "The unit gains the 'Sunder(1)' ability for all ranged attacks."
// COST: 5 | 0 | 5
'Siege Experts': [
  { type: 'weapon_ability', name: 'Sunder(1)', weapon_type: 'ranged', applies_to: 'all' },
],
```

This makes it immediately visible if the code drifts from the rule. When the two diverge, fix the code — not the comment.

---

## How to contribute

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide. Short version:

### Fork and PR workflow

1. **Fork** this repo, clone it locally, run `npm install`
2. Make your changes
3. Run `npm run build` — must pass with zero TypeScript errors
4. Push to your fork and open a **Pull Request**

### Data fixes (no coding required)

Open `data/parsed/<faction>/units.json`, compare each unit against your copy of the rules, and fix whatever is wrong. See CONTRIBUTING.md for the fields to check and the file templates for adding missing armory/psychic/archetype files.

If you find an error but are not sure how to fix the JSON, open a **GitHub Issue** using the **Data correction** template.

### Rules questions (no coding required)

If you know the game and can answer an ambiguous rule, check `OPEN_QUESTIONS.md` — answering a rules question directly unblocks an engine implementation. Use the **Rules question** issue template on GitHub.

### Code contributions

- Game logic lives in `src/engine/` — see CONTRIBUTING.md for the engine file map
- UI components in `src/components/`
- App state in `src/store/army.ts`
- Zero TypeScript errors required — `npm run build` is the gate

---

## Changelog and known issues

See the **Changelog** button in the app, or read `src/data/changelog.ts` / `src/data/known-issues.ts` directly.

Open questions and help-wanted items: `OPEN_QUESTIONS.md`.
