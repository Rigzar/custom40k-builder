/**
 * Password hashing, recovery-code generation, and signed session cookies.
 * No external auth provider — everything here is self-contained (bcryptjs + Node's built-in
 * crypto for HMAC signing), so there's no third-party service or cost involved.
 */
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const SESSION_COOKIE = 'c40k_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 90; // 90 days

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error('SESSION_SECRET env var is not set');
  return secret;
}

export function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/** Human-typeable recovery code, e.g. "K7QX-4MPT-9RZL" — shown once, only its hash is stored. */
export function generateRecoveryCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I — avoids transcription errors
  const groups = [];
  for (let g = 0; g < 3; g++) {
    let group = '';
    for (let i = 0; i < 4; i++) {
      group += alphabet[crypto.randomInt(alphabet.length)];
    }
    groups.push(group);
  }
  return groups.join('-');
}

export function hashRecoveryCode(code) {
  return bcrypt.hash(code.trim().toUpperCase(), 10);
}

export function verifyRecoveryCode(code, hash) {
  return bcrypt.compare(code.trim().toUpperCase(), hash);
}

function sign(value) {
  return crypto.createHmac('sha256', getSessionSecret()).update(value).digest('hex');
}

/** Builds the `Set-Cookie` header value for a session tied to userId, signed so it can't be forged. */
export function createSessionCookie(userId) {
  const expires = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const payload = `${userId}.${expires}`;
  const token = `${payload}.${sign(payload)}`;
  return `${SESSION_COOKIE}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${SESSION_MAX_AGE_SECONDS}`;
}

export function clearSessionCookie() {
  return `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
}

function parseCookies(header) {
  const out = {};
  if (!header) return out;
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    out[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
  }
  return out;
}

/** Returns the authenticated userId (number) from the request's session cookie, or null. */
export function getSessionUserId(req) {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies[SESSION_COOKIE];
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [userId, expires, signature] = parts;
  const payload = `${userId}.${expires}`;
  if (sign(payload) !== signature) return null;
  if (Date.now() > Number(expires)) return null;
  const id = Number(userId);
  return Number.isInteger(id) ? id : null;
}

export function isValidUsername(username) {
  return typeof username === 'string' && /^[a-zA-Z0-9_-]{3,24}$/.test(username);
}

export function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 8 && password.length <= 200;
}
