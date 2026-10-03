/** npx tsx scripts/_gitfinda_time_test.ts — the time zone maths of Gitfinda, against known answers. */
import { zonedToUtc, offsetMinutes, offsetLabel, formatSlot, ago } from '../src/lib/gitfindaTime';

let pass = 0, fail = 0;
const eq = (got: unknown, want: unknown, name: string) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  ok ? pass++ : fail++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : `  got ${JSON.stringify(got)} want ${JSON.stringify(want)}`}`);
};

// Berlin: UTC+2 in summer, UTC+1 in winter. This is exactly why a bare "UTC+1" is not enough.
eq(zonedToUtc('2026-07-10', '19:00', 'Europe/Berlin')?.toISOString(), '2026-07-10T17:00:00.000Z', 'Berlin summer 19:00 = 17:00 UTC');
eq(zonedToUtc('2026-01-10', '19:00', 'Europe/Berlin')?.toISOString(), '2026-01-10T18:00:00.000Z', 'Berlin winter 19:00 = 18:00 UTC');
eq(zonedToUtc('2026-07-10', '19:00', 'America/New_York')?.toISOString(), '2026-07-10T23:00:00.000Z', 'New York summer 19:00 = 23:00 UTC');
eq(zonedToUtc('2026-07-10', '19:00', 'UTC')?.toISOString(), '2026-07-10T19:00:00.000Z', 'UTC is itself');
eq(zonedToUtc('2026-07-10', '19:00', 'Asia/Kolkata')?.toISOString(), '2026-07-10T13:30:00.000Z', 'India UTC+5:30');
eq(zonedToUtc('2026-07-10', '09:00', 'Pacific/Auckland')?.toISOString(), '2026-07-09T21:00:00.000Z', 'Auckland is a day ahead');
// daylight-saving edges (EU: 2026-03-29 02:00 -> 03:00, and 2026-10-25 03:00 -> 02:00)
eq(zonedToUtc('2026-03-29', '02:30', 'Europe/Berlin'), null, 'the hour skipped in spring does not exist');
eq(zonedToUtc('2026-03-29', '03:30', 'Europe/Berlin')?.toISOString(), '2026-03-29T01:30:00.000Z', 'just after the spring jump');
eq(zonedToUtc('2026-03-29', '01:30', 'Europe/Berlin')?.toISOString(), '2026-03-29T00:30:00.000Z', 'just before the spring jump');
eq(zonedToUtc('2026-10-25', '12:00', 'Europe/Berlin')?.toISOString(), '2026-10-25T11:00:00.000Z', 'after the autumn change it is UTC+1');
eq(zonedToUtc('2026-13-45', '19:00', 'Europe/Berlin')?.toISOString?.(), undefined, 'an impossible date is refused');
eq(zonedToUtc('nonsense', 'x', 'Europe/Berlin'), null, 'garbage is refused');

eq(offsetMinutes('Europe/Berlin', new Date('2026-07-10T12:00:00Z')), 120, 'Berlin offset in July');
eq(offsetMinutes('Europe/Berlin', new Date('2026-01-10T12:00:00Z')), 60, 'Berlin offset in January');
eq(offsetLabel('Asia/Kolkata', new Date('2026-07-10T12:00:00Z')), 'UTC+5:30', 'offset label with minutes');
eq(offsetLabel('America/New_York', new Date('2026-07-10T12:00:00Z')), 'UTC-4', 'offset label negative');

// the example in the requirements document: Friday 19:00-22:00 UTC+2, read from UTC-4, is 13:00-16:00
const fri = zonedToUtc('2026-07-10', '19:00', 'Europe/Berlin')!, fri2 = zonedToUtc('2026-07-10', '22:00', 'Europe/Berlin')!;
eq(formatSlot(fri.toISOString(), fri2.toISOString(), 'America/New_York', 'en-GB'), 'Fri 10 Jul, 13:00–16:00', 'spec example: UTC+2 Fri 19:00-22:00 shown in UTC-4');
eq(formatSlot(fri.toISOString(), fri2.toISOString(), 'UTC', 'en-GB'), 'Fri 10 Jul, 17:00–20:00', 'same slot in UTC');
const late = zonedToUtc('2026-07-10', '23:00', 'Europe/Berlin')!, lateEnd = zonedToUtc('2026-07-11', '01:00', 'Europe/Berlin')!;
eq(formatSlot(late.toISOString(), lateEnd.toISOString(), 'Europe/Berlin', 'en-GB'), 'Fri 10 Jul 23:00 – Sat 11 Jul 01:00', 'a slot past midnight names both days');

const now = new Date('2026-07-10T12:00:00Z');
eq(ago('2026-07-10T11:30:00Z', now), { n: 30, unit: 'm' }, 'ago minutes');
eq(ago('2026-07-10T09:00:00Z', now), { n: 3, unit: 'h' }, 'ago hours');
eq(ago('2026-07-07T12:00:00Z', now), { n: 3, unit: 'd' }, 'ago days');

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
