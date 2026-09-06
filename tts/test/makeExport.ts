/**
 * Produce a real TTS export from a saved roster, for tts/test/run.cjs to chew on.
 *
 *   npx jiti tts/test/makeExport.ts "Codex/Host of the Incarnate Word.json" out.json
 */
import fs from 'fs';
import { FACTION_LOADERS } from '../../src/data/loaders';
import { buildTtsExport } from '../../src/utils/ttsExport';

const [rosterPath, outPath] = process.argv.slice(2);
if (!rosterPath || !outPath) {
  console.error('usage: npx jiti tts/test/makeExport.ts <roster.json> <out.json>');
  process.exit(2);
}

(async () => {
  const roster = JSON.parse(fs.readFileSync(rosterPath, 'utf-8'));
  const data = await FACTION_LOADERS[roster.faction]();
  // A saved roster is an ArmyState minus the faction data itself, which the store holds separately.
  const state = { ...roster, data } as never;
  const out = buildTtsExport(state, data);
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log(`${out.units.length} units, ${out.army.totalPoints}/${out.army.pointLimit} pts -> ${outPath}`);
})();
