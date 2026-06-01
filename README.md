# Custom 40k Builder

An army list builder for a custom Warhammer 40,000 / Horus Heresy ruleset, covering 19 factions with full unit data, weapons, options, archetypes, legacies, traits and psychic disciplines.

**[→ Open the app](https://custom40k-builder.vercel.app)**

---

## Features

- 19 factions with full unit datasheets (weapons, stats, options, abilities)
- Live points calculation — engagement limits, per-model and per-wound trait costs
- Armory system — weapons, equipment, daemon weapons per unit
- Archetypes, Legacies and Army Traits with active rule enforcement
- Psychic disciplines, Prayers and Pacts per faction
- Veteran Abilities and Vehicle Upgrades
- Print view — formatted army sheet ready for play
- Multi-language UI: English, Deutsch, Español (Beta)
- Custom unit nicknames, model count display, Join Unit pre-assignment

---

## Stack

React · TypeScript · Vite · Zustand · Tailwind CSS

---

## Getting started locally

```bash
git clone https://github.com/Rigzar/custom40k-builder.git
cd custom40k-builder
npm install
npm run dev
```

The app opens at `http://localhost:5173`.

To check for TypeScript errors without starting the server:

```bash
npm run build
```

---

## Project structure

```
custom40k-builder/
├── src/
│   ├── components/         # React UI components
│   │   ├── LandingPage.tsx     # Faction selection screen
│   │   ├── ArmyBuilder.tsx     # Main builder layout
│   │   ├── UnitCard.tsx        # Individual unit card (options, armory, traits)
│   │   ├── ArmyConfig.tsx      # Archetype / Legacy / Traits panel
│   │   ├── ArmoryModal.tsx     # Armory item picker
│   │   └── PrintView.tsx       # Printable army sheet
│   │
│   ├── engine/             # Game logic (points, validation, rules)
│   │   ├── points.ts           # Points calculation
│   │   ├── resolver.ts         # Unit profile resolution (marks, variants, abilities)
│   │   ├── validators.ts       # Army validation (slot limits, archetype rules)
│   │   ├── archetypes.ts       # Archetype rule definitions
│   │   └── equipMods.ts        # Equipment stat modifier parsing
│   │
│   ├── store/
│   │   └── army.ts             # Zustand store — army state and actions
│   │
│   ├── types/
│   │   ├── army.ts             # RosterEntry, ArmyState, etc.
│   │   └── data.ts             # Unit, Weapon, OptionGroup, FactionData, etc.
│   │
│   ├── data/
│   │   ├── changelog.ts        # Public changelog and known issues
│   │   └── factions.ts         # Faction list and metadata
│   │
│   └── i18n/
│       └── index.ts            # Translation strings (EN / DE / ES)
│
└── data/
    └── parsed/                 # ← FACTION DATA — one JSON per faction
        ├── chaos_space_marines_units.json
        ├── chaos_space_marines_rules.json
        ├── space_marines.json
        ├── imperial_guard.json
        ├── grey_knights.json
        └── ... (one file per faction)
```

---

## Faction data format

Each `data/parsed/<faction>.json` file follows this structure:

```json
{
  "faction": "Imperial Guard",
  "slot_to_units": { "HQ": ["Captain", ...], "Troops": [...] },
  "units": {
    "Captain": {
      "name": "Captain",
      "slot": "HQ",
      "models": [{ "name": "Captain", "points": 26, "min": 1, "max": 1, "stats": {...} }],
      "variant_models": [],
      "equipped_with": "A Captain is equipped with: Laspistol; Chainsword.",
      "weapons": [{ "name": "Laspistol", "range": "12\"", "type": "Pistol 1", "s": "3", "ap": "0", "d": "1", "abilities": "-" }],
      "option_groups": [
        {
          "header": "Can replace the Chainsword",
          "constraint": { "type": "one" },
          "choices": [{ "name": "Power sword", "points": 5 }],
          "inline_pts": null,
          "variant_link": null,
          "is_unique_per_army": false
        }
      ],
      "abilities": ["Iron Will: ...", "..."],
      "is_character": true,
      "is_vehicle": false,
      "is_psyker": false,
      "champion_has_armory": false,
      "has_veteran_abilities": true,
      "advisor": false
    }
  },
  "armory_general": { "weapons": [...], "equipment": [...], "daemon_weapons": [] },
  "archetypes": [{ "name": "Veteran Company", "desc": "..." }],
  "legacies":   [{ "name": "Death World", "desc": "..." }],
  "traits":     [{ "name": "Born Soldiers", "desc": "...", "pts_unit": "5", "pts_char": "0", "pts_veh": "5" }],
  "disciplines": { "Psikana I": [ { "name": "Smite", "cast_value": "5", "effect": "..." } ] },
  "prayers": [],
  "pacts": []
}
```

### Constraint types for `option_groups`

| Type | Meaning | Example |
|---|---|---|
| `one` | Pick 0 or 1 choice from the list | "Can replace X with one of:" |
| `every` | Each model picks independently (per-model cost) | "Each model may swap X" |
| `per_n` | One pick per N models | "For every 5 models, one may take:" |
| `fixed_max` | Up to N picks total | "Up to 2 models may swap:" |
| `mark` | Mark of Chaos selection | Mark choices |
| `veteran` | Veteran ability slot | Veteran abilities |
| `unique_upgrade` | Unit-level unique restriction | "Only one per army" |

---

## How to contribute

### Fork and PR workflow

1. **Fork** this repo to your own GitHub account
2. **Clone** your fork locally and run `npm install`
3. Make your changes
4. Run `npm run build` — must pass with zero errors
5. **Push** to your fork and open a **Pull Request**

### Data fixes (no coding required)

The most impactful contributions are data corrections. Each faction is stored in a single JSON file under `data/parsed/`. Open the file for your faction, compare each unit against your copy of the rules, and fix whatever is wrong — wrong stats, missing weapons, wrong points costs, wrong option constraints.

Common things to check per unit:
- Model points and min/max counts
- All weapon profiles present with correct S / AP / D / Abilities
- Option group headers and choice prices match the rules
- Flags: `is_character`, `is_vehicle`, `is_psyker`, `champion_has_armory`, `advisor`

If you find an error but are not sure how to fix the JSON, open a **GitHub Issue** with: faction name, unit name, and what's wrong vs what it should be.

### What to work on

The faction status is shown on the landing page of the app:

- 🟢 Green — fully audited and tested
- 🟡 Yellow — audited, needs player testing
- 🟠 Orange — audit in progress
- 🔴 Red — not yet reviewed, likely has errors

Red factions are the highest priority.

### Code contributions

- Game logic (points, validation, rule enforcement) lives in `src/engine/`
- UI components in `src/components/`
- App state in `src/store/army.ts`
- Run `npm run build` before submitting — zero TypeScript errors required

---

## Changelog and known issues

See the **Changelog** button in the app, or read `src/data/changelog.ts` directly.
