import { useState } from 'react';
import * as api from '../lib/api';
import { useT } from '../i18n';

type Mode = 'login' | 'register' | 'forgot' | 'lostCode';

interface Props {
  onClose: () => void;
  onLoggedIn: () => void;
}

export function AuthModal({ onClose, onLoggedIn }: Props) {
  const t = useT();
  const [mode, setMode]         = useState<Mode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPassword, setNewPassword]   = useState('');
  const [message, setMessage]   = useState('');
  const [error, setError]       = useState('');
  const [busy, setBusy]         = useState(false);
  const [revealCode, setRevealCode] = useState<string | null>(null);
  const [recoveryPending, setRecoveryPending] = useState<{ requestId: number; username: string } | null>(null);
  const [recoveryResolved, setRecoveryResolved] = useState<{ tempPassword: string; newRecoveryCode: string } | null>(null);

  // Registration: optional secret question, an extra factor required (alongside the recovery
  // code) when resetting the password later.
  const [secretQuestion, setSecretQuestion] = useState('');
  const [secretAnswer, setSecretAnswer]     = useState('');

  // Forgot-password: looked up from the username once they've typed it, so the answer field
  // only appears (and is required) for accounts that actually set one up.
  const [resetSecretQuestion, setResetSecretQuestion] = useState<string | null>(null);
  const [resetSecretAnswer, setResetSecretAnswer]     = useState('');

  function reset() {
    setError(''); setRevealCode(null); setRecoveryPending(null); setRecoveryResolved(null);
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
      setRecoveryPending({ requestId: res.requestId, username: username.trim() });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function handleCheckStatus() {
    if (!recoveryPending) return;
    setError(''); setBusy(true);
    try {
      const res = await api.checkRecoveryStatus(recoveryPending.username, recoveryPending.requestId);
      if (res.status === 'resolved') {
        setRecoveryResolved({ tempPassword: res.tempPassword, newRecoveryCode: res.newRecoveryCode });
        setRecoveryPending(null);
      } else {
        setError('Solicitud aún pendiente. El Inquisidor no la ha procesado todavía.');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (revealCode) {
    return (
      <Shell onClose={onClose} title={t('authSaveCodeTitle')}>
        <div className="p-4 space-y-3">
          <p className="text-zinc-300 text-sm">
            {t('authSaveCodeWarningPart1')} <strong>{t('authSaveCodeWarningStrong')}</strong> {t('authSaveCodeWarningPart2')}
          </p>
          <div className="bg-zinc-950 border border-amber-700 text-amber-400 text-center font-mono text-lg py-3 tracking-widest select-all">
            {revealCode}
          </div>
          <button
            onClick={() => { setRevealCode(null); onLoggedIn(); }}
            className="w-full px-4 py-2 bg-amber-800 border border-amber-600 text-white hover:bg-amber-700 uppercase tracking-wide text-sm"
          >
            {t('authSavedContinue')}
          </button>
        </div>
      </Shell>
    );
  }

  if (recoveryResolved) {
    return (
      <Shell onClose={onClose} title="Cuenta reactivada">
        <div className="p-4 space-y-3">
          <p className="text-green-400 text-sm">El Inquisidor ha procesado tu solicitud. Guarda estas credenciales — solo se muestran una vez.</p>
          <div>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Contraseña temporal</p>
            <div className="bg-zinc-950 border border-amber-700 text-amber-400 text-center font-mono text-base py-2 tracking-widest select-all">
              {recoveryResolved.tempPassword}
            </div>
          </div>
          <div>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Nuevo código de recuperación</p>
            <div className="bg-zinc-950 border border-amber-700 text-amber-400 text-center font-mono text-base py-2 tracking-widest select-all">
              {recoveryResolved.newRecoveryCode}
            </div>
          </div>
          <p className="text-zinc-500 text-xs">Inicia sesión con la contraseña temporal y cámbiala desde tu cuenta.</p>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-amber-800 border border-amber-600 text-white hover:bg-amber-700 uppercase tracking-wide text-sm"
          >
            Entendido
          </button>
        </div>
      </Shell>
    );
  }

  if (recoveryPending) {
    return (
      <Shell onClose={onClose} title="Solicitud enviada">
        <div className="p-4 space-y-3">
          <p className="text-green-400 text-sm">Solicitud registrada. El Inquisidor la revisará en breve.</p>
          <p className="text-zinc-400 text-xs leading-relaxed">
            Vuelve aquí y pulsa "Comprobar estado" cuando hayas esperado un rato. Cuando esté resuelta recibirás una contraseña temporal y un nuevo código de recuperación.
          </p>
          {error && <p className="text-amber-400 text-xs">{error}</p>}
          <button
            onClick={handleCheckStatus}
            disabled={busy}
            className="w-full px-4 py-2 bg-amber-800 border border-amber-600 text-white hover:bg-amber-700 disabled:opacity-50 uppercase tracking-wide text-sm"
          >
            {busy ? '…' : 'Comprobar estado'}
          </button>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 text-zinc-200 hover:bg-zinc-600 uppercase tracking-wide text-sm"
          >
            {t('close')}
          </button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell onClose={onClose} title={
      mode === 'login' ? t('login') : mode === 'register' ? t('authCreateAccountTitle') :
      mode === 'forgot' ? t('authResetPasswordTitle') : t('authLostCodeTitle')
    }>
      <div className="p-4 space-y-3">
        {mode !== 'lostCode' && (
          <Field label={t('fieldUsername')}>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              onBlur={mode === 'forgot' ? handleUsernameBlurForReset : undefined}
              className="w-full bg-zinc-800 border border-zinc-700 focus:border-amber-700 text-zinc-200 text-sm px-3 py-2 outline-none"
            />
          </Field>
        )}

        {mode === 'login' && (
          <Field label={t('fieldPassword')}>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 focus:border-amber-700 text-zinc-200 text-sm px-3 py-2 outline-none" />
          </Field>
        )}

        {mode === 'register' && (
          <>
            <Field label={t('fieldPasswordMin')}>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-amber-700 text-zinc-200 text-sm px-3 py-2 outline-none" />
            </Field>
            <Field label={t('fieldSecretQuestion')}>
              <input value={secretQuestion} onChange={e => setSecretQuestion(e.target.value)}
                placeholder={t('secretQuestionPlaceholder')}
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-amber-700 text-zinc-200 text-sm px-3 py-2 outline-none" />
            </Field>
            {secretQuestion.trim() && (
              <Field label={t('fieldAnswer')}>
                <input value={secretAnswer} onChange={e => setSecretAnswer(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 focus:border-amber-700 text-zinc-200 text-sm px-3 py-2 outline-none" />
              </Field>
            )}
          </>
        )}

        {mode === 'forgot' && (
          <>
            <Field label={t('fieldRecoveryCode')}>
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
            <Field label={t('fieldNewPasswordMin')}>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-amber-700 text-zinc-200 text-sm px-3 py-2 outline-none" />
            </Field>
          </>
        )}

        {mode === 'lostCode' && (
          <>
            <Field label={t('fieldUsername')}>
              <input value={username} onChange={e => setUsername(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-amber-700 text-zinc-200 text-sm px-3 py-2 outline-none" />
            </Field>
            <Field label={t('fieldLostCodeHelp')}>
              <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3}
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-amber-700 text-zinc-200 text-sm px-3 py-2 outline-none resize-none" />
            </Field>
            <p className="text-zinc-500 text-[11px] leading-relaxed">
              {t('authLostCodeNote')}
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
          {busy ? t('authWorking') :
            mode === 'login' ? t('login') :
            mode === 'register' ? t('authCreateAccountTitle') :
            mode === 'forgot' ? t('authResetPasswordTitle') : t('authSendRequest')}
        </button>

        <div className="flex flex-wrap justify-between gap-2 pt-1 text-[11px]">
          {mode === 'login' && (
            <>
              <button onClick={() => { reset(); setMode('register'); }} className="text-zinc-500 hover:text-amber-400 underline underline-offset-2">{t('authCreateAccountLink')}</button>
              <button onClick={() => { reset(); setMode('forgot'); }} className="text-zinc-500 hover:text-amber-400 underline underline-offset-2">{t('authForgotPassword')}</button>
            </>
          )}
          {mode === 'register' && (
            <button onClick={() => { reset(); setMode('login'); }} className="text-zinc-500 hover:text-amber-400 underline underline-offset-2">{t('authAlreadyHaveAccount')}</button>
          )}
          {mode === 'forgot' && (
            <>
              <button onClick={() => { reset(); setMode('login'); }} className="text-zinc-500 hover:text-amber-400 underline underline-offset-2">{t('authBackToLogin')}</button>
              <button onClick={() => { reset(); setMode('lostCode'); }} className="text-zinc-500 hover:text-amber-400 underline underline-offset-2">{t('authLostYourCode')}</button>
            </>
          )}
          {mode === 'lostCode' && (
            <button onClick={() => { reset(); setMode('forgot'); }} className="text-zinc-500 hover:text-amber-400 underline underline-offset-2">{t('backSimple')}</button>
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
