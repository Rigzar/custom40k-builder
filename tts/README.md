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
