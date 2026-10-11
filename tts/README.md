# Tabletop Simulator export

Puts a Custom40k army on a TTS table: one card per unit with its final stats, weapons, wargear and
abilities, plus the faction's prayers / infernal pacts / psychic disciplines in the notebook.

> **Status: not on the Steam Workshop yet.** The mod is still being worked on. To try it now, paste
> `Custom40k.lua` into any Tabletop Simulator object yourself — see *Using it* below. The Workshop
> item comes once the in-game layout has been checked on a real table.

## The two halves

| Half | File | Job |
|---|---|---|
| App | [`src/utils/ttsExport.ts`](../src/utils/ttsExport.ts) | Resolves the army and downloads it as JSON |
| Mod | [`Custom40k.lua`](Custom40k.lua) | Reads that JSON and spawns the cards |

**The mod carries no codex.** The app exports the army already **resolved** — stats after wargear
and army traits, the weapon profiles the unit actually ends up with, the real rules text — using
the same `resolveUnitProfile` the live card and Print View use. So the Lua never needs to know a
Custom40k rule, and a codex update never means re-uploading the Workshop item.

`TTS_SCHEMA` (app) and `SCHEMA` (Lua) must match. Bump both together when the payload shape
changes; the mod refuses a payload it does not understand rather than rendering half a datasheet.

## Using it

1. **App** — open an army, go to Print View, press **TTS**. A `.json` downloads.
2. **TTS** — open the Notes panel (top right), add a tab named exactly `Custom40k`, paste the whole
   file into its body. *(A plain `https://` URL to the JSON works too — the mod fetches it.)*
3. Put the Lua on any object (right-click → Scripting), save, then press **LOAD ARMY**.

Buttons: **LOAD ARMY** (spawn), **RULES → NOTEBOOK** (rules tabs only), **CLEAR ARMY** (removes
only the cards this loader spawned — they carry a `c40k_spawn` tag).

## Custom40k Table: the all-in-one table mod

[`Custom40kTable.lua`](Custom40kTable.lua) is a **Global** script (paste it into a table's Global script, or ship it in the
Workshop table) that does what the cards cannot: it keeps the state of a whole game. It reads the same export, one army
per side (`Custom40k` and `Custom40k 2` notebook tabs), and adds a **C40K** button (top right) with seven tabs:

| Tab | What it does |
|---|---|
| ARMY | Load a side from its notebook tab |
| RULES | The datasheet, **every rule the unit uses with its text** (abilities and weapon abilities), active statuses, and the game's own rules: phases, orders, reactions, Battleshock, weapon types, scoring |
| BINDER | Select miniatures on the table, **BIND** them to a unit: they take its name, colour and datasheet (model group by model group). Removing a bound miniature takes a casualty off the unit. Movement / advance / charge / weapon-range **rings** around every bound miniature |
| BATTLE | Round and phase tracker with the rules of the current phase, initiative roll (with the tie rule), Rally and Reinforcement rolls, Skip tokens, an order, Battleshock tokens, activation, reserve and models left per unit |
| ATTACK | Pick a weapon and a target: the rolls needed to hit / wound / save (cover, Take Cover, half range, vehicle facing, order legality, weapon abilities, ward), the **expected** result, or **ROLL IT** and apply the casualties |
| POWERS | Psychic powers (psychic test with Perils), prayers and pacts: pick a target, cast. Automatic hits are rolled, Battleshock tokens added, and lasting effects become **statuses** on the target (and on the unit the caster leads) that the attack calculator then uses |
| MISSION | The engagement's missions, a victory-point pad, secondary objectives, attrition from the models you removed, and the winner (100 VP lead) |

**Picking.** Every choice is a button you press: a column of units on the left (side buttons, then one button per unit), weapons, targets, orders, cover, powers and missions are all lists of buttons, and the selected one is highlighted. There are no spawned datasheet cards: the binder puts the datasheet on each miniature's description and the RULES tab shows it.

**Tokens on the table.** Choosing an order in BATTLE puts its token beside the unit (to its right; Battleshock tokens go to its left): face down ("ORDER") in the Command Phase, turned over when the Action Phase starts, cleared when a new round begins. Pressing a unit in the list lights up its miniatures. The artwork is ours (`public/tts/tokens/*.png`, drawn by `tts/build_tokens.cjs`) and is loaded from `https://custom40k-builder.vercel.app/tts/tokens/`, so the tokens appear once that folder is deployed. A unit needs its miniatures bound first.

**Leaders and attached units.** The export carries `joinedTo` (the unit a character is attached to) and `grantsToUnit`
(wargear text that says "the model and its attached unit gain ..."). The Battle View and the calculator add those to the
unit: Armor of Badab's Warded improves the unit's ward save by one, to a maximum of 4+.

**Where the numbers come from.** To-hit, the wound table, saves with AP, the armour penetration roll against Armour
Values, the Vehicle Damage Chart, cover, Take Cover, Battleshock and reinforcement dice are the Custom40k Core Rules
1.278 and live in the export's `game` field (`src/data/ttsGame.ts`), not in the Lua. Weapon abilities the calculator
models: Auto Hit, Blast, AT, Deadly, Decimate, Poison, Rending, Armor piercing, Armorbane, Lance, Melta, Shred, Grav,
Shield Breaker, Sunder, Seeking, Master-crafted, Soul Burn, Limit, Rapid Fire. Anything else is **listed in the result
as "not modelled, apply by hand"**, never silently ignored. Power texts are read for the same things; the result shows
what was understood ("Automated: ...") and there are manual hit / wound / AP modifiers for the rest.

**Tests.** `node tts/test/run_table.cjs army.json` runs the mod under `fengari` with the TTS API stubbed and a real
export, clicking the same element ids TTS would, and checks every XML string it emits is well formed. It has not run
inside a real Tabletop Simulator yet: the XML attribute names and the vector-line coordinates follow the TTS docs but
the first table test may need small adjustments.

**Installer object (any table, nothing replaced).** Loading a Workshop table replaces your whole table, so the mod also ships as a single object, `tts/Custom40k Installer.json` (a saved object; `node tts/build_installer.cjs --install` copies it into `Saved Objects`). Spawn it on any table and press its button: it downloads `https://custom40k-builder.vercel.app/tts/Custom40kTable.lua` and installs it as the table's Global script. Press it again to update, so a new version never needs a new Workshop upload: change `Custom40kTable.lua`, run `node tts/build_installer.cjs` (refreshes `public/tts/Custom40kTable.lua`), push. It refuses to overwrite a Global script that is not ours. `node tts/test/run_installer.cjs` tests it and fails when the public copy is stale. Not verified inside a real Tabletop Simulator yet: if `Global.setLuaScript` does not start the script by itself the object says to press Save & Play in the Global editor.

**Ready-made table.** `node tts/build_save.cjs` writes `tts/Custom40k Table.json`, a Tabletop Simulator save with the Global
script already embedded and the two army notebook tabs created (with instructions inside). `--install` also copies it into
`Documents/My Games/Tabletop Simulator/Saves`; then load it from Games > Save & Load, or upload it to the Workshop from
Modding > Workshop. Re-run it whenever `Custom40kTable.lua` changes. The mod also creates the two tabs itself on load, so
pasting the script into any table's Global script works too.

## Ward saves in the payload

Each unit has a `wardSave` field (`"5+"`, or `null` when it has none) and so does every entry of `models[]` (`null` for attendants such as drones). It is derived with `src/lib/wardSave.ts`, the same code the unit card and Print View use: datasheet abilities (Daemon 5+, Greater Daemon 4+, an explicit "X+ ward save"), Armory equipment, option choices, traits and a Mark's Warded. The field is additive, so `schema` was not bumped; a mod that ignores it keeps working.

## Publishing to the Steam Workshop

Build a table with the loader object on it, then Games → Save & Load → Upload to Workshop. The Lua
lives inside the save, so uploading the table publishes the mod.

## Changing the Lua

There is no Lua toolchain in this repo, but the script **is** tested — headlessly, through
[`fengari`](https://github.com/fengari-lua/fengari) with TTS's globals (`self`, `spawnObject`,
`Notes`, `JSON`, `printToAll`) stubbed, fed a real export. That harness caught four bugs the first
time it ran, including one that silently deleted every prayer's range/target/duration line — which
is exactly the thing the same release existed to fix. Do not change this file without running it.

The trap worth naming: **`ipairs` stops at the first `nil`.** A table literal like
`{ a, b, maybeNil, d }` loses `d` entirely when `maybeNil` is nil. `joinParts` is variadic and uses
`select('#', ...)` for that reason — keep it that way, and pass `''` rather than `nil`.
