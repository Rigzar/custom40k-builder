/**
 * Time zones for Gitfinda.
 *
 * The rule from the requirements document: store an IANA zone ("Europe/Berlin"), never a bare
 * offset, because "UTC+1" has no idea about summer time. A time slot is therefore entered as a
 * wall-clock time IN THE POSTER'S ZONE, turned into a real instant (UTC) here, and shown to every
 * reader converted into whichever zone they chose.
 *
 * No library: Intl already knows every zone and every daylight-saving rule.
 */

/** The zone this browser is in. */
export function myZone(): string {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'; } catch { return 'UTC'; }
}

/** Every zone the browser knows, falling back to a short list on browsers that cannot enumerate. */
export function allZones(): string[] {
  try {
    const f = (Intl as unknown as { supportedValuesOf?: (k: string) => string[] }).supportedValuesOf;
    const list = f ? f('timeZone') : [];
    if (list.length) return list.includes('UTC') ? list : ['UTC', ...list];
  } catch { /* fall through */ }
  return ['UTC', 'Europe/London', 'Europe/Berlin', 'Europe/Madrid', 'Europe/Moscow', 'America/New_York',
    'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'America/Sao_Paulo', 'Asia/Tokyo',
    'Asia/Shanghai', 'Australia/Sydney', 'Pacific/Auckland'];
}

/** The offset of `zone` at `at`, in minutes east of UTC (Berlin in summer = +120). */
export function offsetMinutes(zone: string, at: Date): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: zone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(at);
  const get = (t: string) => Number(parts.find(p => p.type === t)?.value);
  const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour') % 24, get('minute'), get('second'));
  return Math.round((asUtc - Math.floor(at.getTime() / 1000) * 1000) / 60000);
}

/** "UTC+2" / "UTC-4:30" for a zone at a moment — shown next to the zone name. */
export function offsetLabel(zone: string, at: Date = new Date()): string {
  const m = offsetMinutes(zone, at);
  const sign = m < 0 ? '-' : '+';
  const abs = Math.abs(m);
  const h = Math.floor(abs / 60), mm = abs % 60;
  return `UTC${sign}${h}${mm ? ':' + String(mm).padStart(2, '0') : ''}`;
}

/**
 * Wall-clock `YYYY-MM-DD` + `HH:MM` in `zone` -> the instant it names. Two passes, because the
 * offset depends on the instant and the instant on the offset; the second pass settles it on
 * either side of a daylight-saving change. Returns null for a time that does not exist (the hour
 * skipped when clocks go forward).
 */
export function zonedToUtc(date: string, time: string, zone: string): Date | null {
  const [y, mo, d] = date.split('-').map(Number);
  const [h, mi] = time.split(':').map(Number);
  if ([y, mo, d, h, mi].some(n => !Number.isFinite(n))) return null;
  const naive = Date.UTC(y, mo - 1, d, h, mi);
  let guess = naive - offsetMinutes(zone, new Date(naive)) * 60000;
  guess = naive - offsetMinutes(zone, new Date(guess)) * 60000;
  const out = new Date(guess);
  // The round trip must give the same wall clock back, or the time was in the skipped hour.
  const back = new Intl.DateTimeFormat('en-CA', {
    timeZone: zone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
  }).formatToParts(out);
  const g = (t: string) => back.find(p => p.type === t)?.value;
  const roundTrip = `${g('year')}-${g('month')}-${g('day')} ${g('hour') === '24' ? '00' : g('hour')}:${g('minute')}`;
  return roundTrip === `${date} ${time}` ? out : null;
}

/**
 * "Fri 19 Oct, 19:00–22:00" for a slot, in `zone`, in the reader's language. If the slot runs past
 * midnight in that zone the end carries its own day.
 */
export function formatSlot(startIso: string, endIso: string, zone: string, locale: string): string {
  const s = new Date(startIso), e = new Date(endIso);
  const day = new Intl.DateTimeFormat(locale, { timeZone: zone, weekday: 'short', day: 'numeric', month: 'short' });
  const hm = new Intl.DateTimeFormat(locale, { timeZone: zone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  const sameDay = day.format(s) === day.format(e);
  return sameDay
    ? `${day.format(s)}, ${hm.format(s)}–${hm.format(e)}`
    : `${day.format(s)} ${hm.format(s)} – ${day.format(e)} ${hm.format(e)}`;
}

/** A short "3 h ago" / "2 d ago" for the post's creation time. */
export function ago(iso: string, now: Date = new Date()): { n: number; unit: 'm' | 'h' | 'd' } {
  const mins = Math.max(0, Math.round((now.getTime() - new Date(iso).getTime()) / 60000));
  if (mins < 60) return { n: Math.max(1, mins), unit: 'm' };
  if (mins < 60 * 48) return { n: Math.round(mins / 60), unit: 'h' };
  return { n: Math.round(mins / 1440), unit: 'd' };
}
