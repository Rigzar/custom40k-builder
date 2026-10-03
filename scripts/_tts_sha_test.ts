import { serializeTtsExport } from '../src/utils/ttsExport';
import { createHash } from 'node:crypto';
(async () => {
  const payload = { army: 'Ünïcode ″ — “quotes” \u2028 end 😀', n: [1, 2.5, 'x"y\z'] };
  const t = await serializeTtsExport(payload as any);
  const m = t.match(/,"checksum":\{"alg":"sha256","value":"([0-9a-f]{64})"\}\}$/)!;
  const body = t.slice(0, m.index!) + '}';
  const hashOk = createHash('sha256').update(body, 'utf8').digest('hex') === m[1];
  const ascii = !/[^\x00-\x7f]/.test(t);
  const roundTrip = JSON.parse(t).army === payload.army;
  console.log(hashOk && ascii && roundTrip ? 'sha256 MATCH, ASCII only, round trip OK' : `FAIL hash=${hashOk} ascii=${ascii} roundTrip=${roundTrip}`);
})();
