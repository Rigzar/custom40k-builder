import { useState } from 'react';
import * as api from '../lib/api';

type Mode = 'login' | 'register' | 'forgot' | 'lostCode';

interface Props {
  onClose: () => void;
  onLoggedIn: () => void;
}

export function AuthModal({ onClose, onLoggedIn }: Props) {
  const [mode, setMode]         = useState<Mode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPassword, setNewPassword]   = useState('');
  const [message, setMessage]   = useState('');
  const [error, setError]       = useState('');
  const [busy, setBusy]         = useState(false);
  const [revealCode, setRevealCode] = useState<string | null>(null);
  const [recoveryUrl, setRecoveryUrl] = useState<string | null>(null);

  // Registration: optional secret question, an extra factor required (alongside the recovery
  // code) when resetting the password later.
  const [secretQuestion, setSecretQuestion] = useState('');
  const [secretAnswer, setSecretAnswer]     = useState('');

  // Forgot-password: looked up from the username once they've typed it, so the answer field
  // only appears (and is required) for accounts that actually set one up.
  const [resetSecretQuestion, setResetSecretQuestion] = useState<string | null>(null);
  const [resetSecretAnswer, setResetSecretAnswer]     = useState('');

  function reset() {
    setError(''); setRevealCode(null); setRecoveryUrl(null);
    setSecretQuestion(''); setSecretAnswer('');
    setResetSecretQuestion(null); setResetSecretAnswer('');
  }

  async function handleUsernameBlurForReset() {
    if (mode !== 'forgot' || !username.trim()) return;
    try {
      const info = await api.getSecretQuestion(username.trim());
      setResetSecretQuestion(info.hasSecretQuestion ? info.question : null);
    } catch {
      setResetSecretQuestion(null);
    }
  }

  async function handleLogin() {
    setError(''); setBusy(true);
    try {
      await api.login(username.trim(), password);
      onLoggedIn();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function handleRegister() {
    setError(''); setBusy(true);
    try {
      const res = await api.register(
        username.trim(), password,
        secretQuestion.trim() || undefined, secretAnswer.trim() || undefined,
      );
      setRevealCode(res.recoveryCode);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function handleResetPassword() {
    setError(''); setBusy(true);
    try {
      const res = await api.resetPassword(
        username.trim(), recoveryCode.trim(), newPassword,
        resetSecretQuestion ? resetSecretAnswer.trim() : undefined,
      );
      setRevealCode(res.recoveryCode);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function handleLostCode() {
    setError(''); setBusy(true);
    try {
      const res = await api.requestAccountRecovery(username.trim(), message.trim());
      setRecoveryUrl(res.url);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (revealCode) {
    return (
      <Shell onClose={onClose} title="Save your recovery code">
        <div className="p-4 space-y-3">
          <p className="text-zinc-300 text-sm">
            Write this down somewhere safe. It's the <strong>only</strong> way to reset your
            password if you forget it — it will not be shown again.
          </p>
          <div className="bg-zinc-950 border border-amber-700 text-amber-400 text-center font-mono text-lg py-3 tracking-widest select-all">
            {revealCode}
          </div>
          <button
            onClick={() => { setRevealCode(null); onLoggedIn(); }}
            className="w-full px-4 py-2 bg-amber-800 border border-amber-600 text-white hover:bg-amber-700 uppercase tracking-wide text-sm"
          >
            I've saved it — continue
          </button>
        </div>
      </Shell>
    );
  }

  if (recoveryUrl) {
    return (
      <Shell onClose={onClose} title="Recovery request sent">
        <div className="p-4 space-y-3">
          <p className="text-green-400 text-sm">✓ Request filed.</p>
          <p className="text-zinc-400 text-xs leading-relaxed">
            Keep this link — the repo owner will review your request and reply with a new
            recovery code on it.
          </p>
          <a
            href={recoveryUrl}
            target="_blank"
            rel="noreferrer"
            className="block text-amber-400 text-xs underline break-all"
          >
            {recoveryUrl}
          </a>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 text-zinc-200 hover:bg-zinc-600 uppercase tracking-wide text-sm"
          >
            Close
          </button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell onClose={onClose} title={
      mode === 'login' ? 'Log in' : mode === 'register' ? 'Create account' :
      mode === 'forgot' ? 'Reset password' : "Lost your recovery code?"
    }>
      <div className="p-4 space-y-3">
        {mode !== 'lostCode' && (
          <Field label="Username">
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              onBlur={mode === 'forgot' ? handleUsernameBlurForReset : undefined}
              className="w-full bg-zinc-800 border border-zinc-700 focus:border-amber-700 text-zinc-200 text-sm px-3 py-2 outline-none"
            />
          </Field>
        )}

        {mode === 'login' && (
          <Field label="Password">
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 focus:border-amber-700 text-zinc-200 text-sm px-3 py-2 outline-none" />
          </Field>
        )}

        {mode === 'register' && (
          <>
            <Field label="Password (min. 8 characters)">
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-amber-700 text-zinc-200 text-sm px-3 py-2 outline-none" />
            </Field>
            <Field label="Secret question (optional — extra recovery protection)">
              <input value={secretQuestion} onChange={e => setSecretQuestion(e.target.value)}
                placeholder="e.g. What was your first army's faction?"
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-amber-700 text-zinc-200 text-sm px-3 py-2 outline-none" />
            </Field>
            {secretQuestion.trim() && (
              <Field label="Answer">
                <input value={secretAnswer} onChange={e => setSecretAnswer(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 focus:border-amber-700 text-zinc-200 text-sm px-3 py-2 outline-none" />
              </Field>
            )}
          </>
        )}

        {mode === 'forgot' && (
          <>
            <Field label="Recovery code">
              <input value={recoveryCode} onChange={e => setRecoveryCode(e.target.value)}
                placeholder="XXXX-XXXX-XXXX"
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-amber-700 text-zinc-200 text-sm px-3 py-2 outline-none font-mono" />
            </Field>
            {resetSecretQuestion && (
              <Field label={resetSecretQuestion}>
                <input value={resetSecretAnswer} onChange={e => setResetSecretAnswer(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 focus:border-amber-700 text-zinc-200 text-sm px-3 py-2 outline-none" />
              </Field>
            )}
            <Field label="New password (min. 8 characters)">
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-amber-700 text-zinc-200 text-sm px-3 py-2 outline-none" />
            </Field>
          </>
        )}

        {mode === 'lostCode' && (
          <>
            <Field label="Username">
              <input value={username} onChange={e => setUsername(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-amber-700 text-zinc-200 text-sm px-3 py-2 outline-none" />
            </Field>
            <Field label="Anything that helps confirm it's your account (optional)">
              <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3}
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-amber-700 text-zinc-200 text-sm px-3 py-2 outline-none resize-none" />
            </Field>
            <p className="text-zinc-500 text-[11px] leading-relaxed">
              This files a GitHub issue (no password involved) for the repo owner to review and
              reply with a new recovery code.
            </p>
          </>
        )}

        {error && <p className="text-red-400 text-xs">{error}</p>}

        <button
          disabled={busy}
          onClick={
            mode === 'login' ? handleLogin :
            mode === 'register' ? handleRegister :
            mode === 'forgot' ? handleResetPassword : handleLostCode
          }
          className="w-full px-4 py-2 bg-amber-800 border border-amber-600 text-white hover:bg-amber-700 disabled:opacity-50 uppercase tracking-wide text-sm"
        >
          {busy ? 'Working…' :
            mode === 'login' ? 'Log in' :
            mode === 'register' ? 'Create account' :
            mode === 'forgot' ? 'Reset password' : 'Send request'}
        </button>

        <div className="flex flex-wrap justify-between gap-2 pt-1 text-[11px]">
          {mode === 'login' && (
            <>
              <button onClick={() => { reset(); setMode('register'); }} className="text-zinc-500 hover:text-amber-400 underline underline-offset-2">Create an account</button>
              <button onClick={() => { reset(); setMode('forgot'); }} className="text-zinc-500 hover:text-amber-400 underline underline-offset-2">Forgot password?</button>
            </>
          )}
          {mode === 'register' && (
            <button onClick={() => { reset(); setMode('login'); }} className="text-zinc-500 hover:text-amber-400 underline underline-offset-2">Already have an account? Log in</button>
          )}
          {mode === 'forgot' && (
            <>
              <button onClick={() => { reset(); setMode('login'); }} className="text-zinc-500 hover:text-amber-400 underline underline-offset-2">Back to login</button>
              <button onClick={() => { reset(); setMode('lostCode'); }} className="text-zinc-500 hover:text-amber-400 underline underline-offset-2">Lost your code?</button>
            </>
          )}
          {mode === 'lostCode' && (
            <button onClick={() => { reset(); setMode('forgot'); }} className="text-zinc-500 hover:text-amber-400 underline underline-offset-2">Back</button>
          )}
        </div>
      </div>
    </Shell>
  );
}

function Shell({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-zinc-900 border-2 border-amber-800 w-full max-w-sm">
        <div className="flex justify-between items-center px-4 py-3 bg-zinc-800 border-b border-amber-800">
          <h3 className="text-amber-400 uppercase tracking-widest text-sm">{title}</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-xl leading-none">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-widest text-amber-600 mb-1">{label}</label>
      {children}
    </div>
  );
}
