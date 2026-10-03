import { serializeTtsExport } from '../src/utils/ttsExport';
import { createHash } from 'node:crypto';
(async () => {
  const t = await serializeTtsExport({ schema: 2, generatedAt: 'x', army: {}, units: [{ a: 'é' }], warnings: [], reference: {} } as any);
  const m = t.match(/,"checksum":\{"alg":"sha256","value":"([0-9a-f]{64})"\}\}$/)!;
  const body = t.slice(0, m.index!) + '}';
  console.log(JSON.parse(t).checksum.alg, createHash('sha256').update(body, 'utf8').digest('hex') === m[1] ? 'MATCH' : 'MISMATCH');
})();
