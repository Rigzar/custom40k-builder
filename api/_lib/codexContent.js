/**
 * Shared content-hash checker for the author's canonical Google Sheets — used by both the admin
 * panel's on-demand "CHECK CONTENT" button (api/admin/[action].js) and the daily cron job
 * (api/cron/cleanup.js), so a codex change gets flagged even if no admin happens to click the
 * button that day.
 *
 * Same id list as scripts/fetch_codex.cjs (the local terminal tool) — mirrored here since that
 * script isn't reachable from a Vercel function. Re-sync this list if a sheet link ever moves
 * (see fetch_codex.cjs's own header comment for how those ids were sourced).
 */
export const CODEX_SHEET_IDS = {
  chaos_space_marines: '1Tj4zAtpprqI2W5VeIoV_HsuzhX_3XGhDMMgM2axOiBw',
  chaos_daemons: '1t4UjzvS44a2h-x5KJGM-GyIou66yt0XfpOqqjAE1zl8',
  space_marines: '16Ri3G9Jx1NAzguMbTKtxsL8uaOq6hik3h7NVuU85mZA',
  imperial_guard: '1nii7VyPLnNHlRlpJTxsh79P7qo1WT3D-yJM0g88CbZM',
  adeptus_mechanicus: '1uufTN0BOMRNtjSWfFJzEtfXUmpHdU8WTdKDUoXNLs8w',
  adeptus_custodes: '1Ic420krL5mcf3_E_vwmwLnGoT1hZ9Qzl0IxWeJ79yoI',
  adeptus_sororitas: '1t6sB5Ls5UdXu5LE61Ab_2OOgxD4m2TC6hFvsEy0bP3k',
  grey_knights: '1XkDkdshwkySGDwBaF4sQblDcE4xITkm1iSSlZSUE_mk',
  inquisition: '1krDncaF0CSf6bDIeA-j20dAo3tqkphkeDd2weq56MN4',
  assassins: '1NZepq8IfXgWs9mmZMxg4emgOxTPP5VfVNfRZ3ryh5f4',
  tau_empire: '1S1Uub6VvvlBuxlqh61S5DhZYIKtdRHvkRs1CsIRgu8s',
  necrons: '1hkc7MKcM4NrWr3GWIKcF9lYBx55CfQ9pBI6srKuzwOA',
  orks: '1gt2q98cnPczVyaujVWX56r2F_GJXBFp8IW9VpAWZ6qI',
  eldar: '139EqmDtxDjDZ4t6tllqHKjATrTpKQgJks7UzmKkUSkw',
  dark_eldar: '1SGc2WinOPa4gy66gICT4KiczzOgugDMe-v5JGz-bPQ8',
  genestealer_cults: '1s0RwILJINi2QcCYnpjQ8und3QRoTDZWp83UJGlo8hqQ',
  harlequins: '1E_9Vy6kWaAUXVBV-BiyJK4GD7_r72cYwEa115_G2Dec',
  leagues_of_votann: '1lZ6MxdCM710N-d4ba9RUSdhmeN8iJjzM5hlpVf73iPY',
  tyranids: '1Os-J6QK4quRtd0K6ocOsbaRMHd7PimPaQpRZw8kR_5M',
  horus_heresy: '1vRRoUGkH3HhzZYQk6_3Hp0pSlWGWb9BKaz3VrYfYmFU',
  legio_titanicus: '1SrBhi_8b77QwqoI03xNDxgOwgt-ePmqRQvA5dyquYtM',
  escalation: '1i9o9KowRslsN4e1UXjzqME5OzcH5A9nR78LjvTVwXRY',
};

/** Downloads one live sheet as .ods and returns { [tabName]: sha256HexOfItsCsv }. Throws on any
 *  failure (bad response, not a spreadsheet) — callers decide how to report that per-key. */
export async function hashLiveSheet(id) {
  const { createHash } = await import('crypto');
  const XLSX = await import('xlsx');
  const r = await fetch(`https://docs.google.com/spreadsheets/d/${id}/export?format=ods`, { headers: { 'User-Agent': 'Mozilla/5.0 custom40k-builder' } });
  if (!r.ok) throw new Error(`download failed (${r.status})`);
  const buf = Buffer.from(await r.arrayBuffer());
  if (buf.slice(0, 2).toString('latin1') !== 'PK') throw new Error('not a spreadsheet — sheet may no longer be public');
  const wb = XLSX.read(buf, { type: 'buffer' });
  const hashes = {};
  for (const name of wb.SheetNames) {
    const csv = XLSX.utils.sheet_to_csv(wb.Sheets[name], { blankrows: false });
    hashes[name] = createHash('sha256').update(csv).digest('hex');
  }
  return hashes;
}

/** Compares a freshly-hashed sheet against its last-accepted baseline. `prev` is undefined the
 *  first time a faction is ever checked. Never mutates anything — purely a diff. */
export function diffAgainstBaseline(hashes, prev) {
  if (!prev) return { status: 'no_baseline', tabCount: Object.keys(hashes).length, hashes };
  const newTabs = Object.keys(hashes).filter(t => !prev[t]);
  const removedTabs = Object.keys(prev).filter(t => !hashes[t]);
  const changedTabs = Object.keys(hashes).filter(t => prev[t] && prev[t] !== hashes[t]);
  return (newTabs.length || removedTabs.length || changedTabs.length)
    ? { status: 'changed', newTabs, removedTabs, changedTabs, hashes }
    : { status: 'unchanged', hashes };
}

/**
 * Checks every known sheet (or a given subset of `ids`) against the stored baseline and returns
 * per-faction results, WITHOUT writing anything — same read-only contract as the admin button.
 * `concurrency` kept modest (sheets are tiny, ~50-120KB, but this still hits 20+ external hosts).
 */
export async function checkAllCodexContent(sql, ids = CODEX_SHEET_IDS, concurrency = 3) {
  const baselineRow = await sql`SELECT value FROM app_settings WHERE key = 'codex_content_hashes'`;
  const baseline = baselineRow.rows[0]?.value ?? {};
  const entries = Object.entries(ids);
  const results = {};
  let cursor = 0;
  const worker = async () => {
    while (cursor < entries.length) {
      const [key, id] = entries[cursor++];
      try {
        const hashes = await hashLiveSheet(id);
        results[key] = diffAgainstBaseline(hashes, baseline[key]);
      } catch (e) {
        results[key] = { status: 'error', error: String(e.message ?? e) };
      }
    }
  };
  await Promise.all(Array.from({ length: Math.min(concurrency, entries.length) }, worker));
  return results;
}
