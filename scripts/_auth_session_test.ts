/**
 * useAuth must not sign a player out because a check FAILED. Only a definite "not logged in" from the server does.
 *   npx tsx scripts/_auth_session_test.ts
 */
const mem: Record<string, string> = {};
(globalThis as any).localStorage = { getItem: (k: string) => mem[k] ?? null, setItem: (k: string, v: string) => { mem[k] = v; }, removeItem: (k: string) => { delete mem[k]; } };
(globalThis as any).window = { addEventListener() {} }; (globalThis as any).document = { addEventListener() {}, visibilityState: 'visible', documentElement: {} };
let script: Array<'fail' | { loggedIn: boolean; username?: string }> = [];
let calls = 0;
(globalThis as any).fetch = async () => { calls++; const next = script.shift() ?? 'fail'; if (next === 'fail') throw new TypeError('Failed to fetch'); return { ok: true, status: 200, json: async () => ({ ok: true, ...next }) }; };
let pass = 0, fail = 0; const ok = (c: boolean, n: string, e = '') => { c ? pass++ : fail++; console.log(`${c ? 'PASS' : 'FAIL'}  ${n}${c ? '' : '  ' + e}`); };
(async () => {
  const auth: any = await import('../src/hooks/useAuth');
  const useAuthStore = () => (auth as any);
  // read the module state through logoutAuth-free path: refreshAuth then inspect via useAuth's snapshot is React-only, so use a tiny reader
  const snap = () => (auth.__snapshot ? auth.__snapshot() : null);
  // 1. the server answers: signed in
  script = [{ loggedIn: true, username: 'alice' }]; calls = 0;
  await auth.refreshAuth();
  ok(mem['c40k_last_user'] === 'alice' && calls === 1, 'a signed-in answer is used and remembered', JSON.stringify({ mem, calls }));
  // 2. two network errors, then the answer: still signed in, 3 calls
  script = ['fail', 'fail', { loggedIn: true, username: 'alice' }]; calls = 0;
  await auth.refreshAuth();
  ok(calls === 3, 'a failed check is retried instead of signing the player out', 'calls ' + calls);
  ok(auth.getAuthSnapshot().username === 'alice', 'signed in after the retries', JSON.stringify(auth.getAuthSnapshot().username));
  // 3. the server is unreachable for the whole check, the browser remembers alice: the page stays signed in
  script = ['fail', 'fail', 'fail', 'fail']; calls = 0;
  await auth.refreshAuth();
  ok(calls === 4 && auth.getAuthSnapshot().username === 'alice', 'an unreachable server does not sign the player out', JSON.stringify({ calls, u: auth.getAuthSnapshot().username }));
  // 4. the server says "not logged in": signed out and the hint cleared
  script = [{ loggedIn: false }]; calls = 0;
  await auth.refreshAuth();
  ok(auth.getAuthSnapshot().username === null && mem['c40k_last_user'] === undefined, 'a definite "not signed in" signs out and clears the hint', JSON.stringify({ u: auth.getAuthSnapshot().username, mem }));
  // 5. unreachable and nothing remembered: signed out, not stuck loading
  script = ['fail', 'fail', 'fail', 'fail'];
  await auth.refreshAuth();
  ok(auth.getAuthSnapshot().username === null && auth.getAuthSnapshot().loading === false, 'unreachable with no memory: signed out and not stuck loading');
  console.log(`
${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
})();
