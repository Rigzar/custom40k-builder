import { useEffect, useRef, useState } from 'react';
import * as api from '../lib/api';
import { useLanguage, type Language } from '../i18n';
import { FactionSymbol } from './FactionSymbol';

interface Props { onClose: () => void; initialTo?: string }

interface MsgTx {
  title: string; inbox: string; noConversations: string; newMessage: string; back: string;
  to: string; recipientPlaceholder: string; bodyPlaceholder: string; send: string; sending: string;
  you: string; inquisitor: string; loading: string; emptyThread: string;
}
const MSG_I18N: Record<Language, MsgTx> = {
  en: {
    title: 'Messages', inbox: 'Inbox', noConversations: 'No conversations yet.', newMessage: '+ New message', back: '← Inbox',
    to: 'To', recipientPlaceholder: 'username', bodyPlaceholder: 'Write a message…', send: 'Send', sending: 'Sending…',
    you: 'You', inquisitor: 'Inquisitor', loading: 'Loading…', emptyThread: 'No messages yet — say hello.',
  },
  de: {
    title: 'Nachrichten', inbox: 'Posteingang', noConversations: 'Noch keine Unterhaltungen.', newMessage: '+ Neue Nachricht', back: '← Posteingang',
    to: 'An', recipientPlaceholder: 'Benutzername', bodyPlaceholder: 'Nachricht schreiben…', send: 'Senden', sending: 'Sende…',
    you: 'Du', inquisitor: 'Inquisitor', loading: 'Lädt…', emptyThread: 'Noch keine Nachrichten — sag Hallo.',
  },
  es: {
    title: 'Mensajes', inbox: 'Bandeja', noConversations: 'Aún no hay conversaciones.', newMessage: '+ Nuevo mensaje', back: '← Bandeja',
    to: 'Para', recipientPlaceholder: 'usuario', bodyPlaceholder: 'Escribe un mensaje…', send: 'Enviar', sending: 'Enviando…',
    you: 'Tú', inquisitor: 'Inquisidor', loading: 'Cargando…', emptyThread: 'Aún no hay mensajes — saluda.',
  },
};

/** Admin marker: Inquisition glyph + "Inquisitor" badge, shown next to an admin's name. */
export function InquisitorBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 align-middle" title={label}>
      <FactionSymbol factionKey="inquisition" size={14} naked />
      <span className="text-[8px] uppercase tracking-widest text-amber-500 border border-amber-800/70 px-1 rounded">{label}</span>
    </span>
  );
}

function fmt(iso: string) {
  return new Date(iso).toLocaleString(undefined, { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export function MessagesModal({ onClose, initialTo }: Props) {
  const { language } = useLanguage();
  const L = MSG_I18N[language] ?? MSG_I18N.en;

  const [view, setView] = useState<'inbox' | 'thread' | 'compose'>(initialTo ? 'compose' : 'inbox');
  const [conversations, setConversations] = useState<api.Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [activeUser, setActiveUser] = useState<string | null>(null);
  const [otherAdmin, setOtherAdmin] = useState(false);
  const [messages, setMessages] = useState<api.Message[]>([]);
  const [composeTo, setComposeTo] = useState(initialTo ?? '');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function loadInbox() {
    setLoading(true);
    try { const r = await api.getInbox(); setConversations(r.conversations); }
    catch (e) { setErr(String(e)); }
    finally { setLoading(false); }
  }
  useEffect(() => { loadInbox(); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView(); }, [messages]);

  async function openThread(username: string) {
    setActiveUser(username); setView('thread'); setMessages([]);
    try {
      const r = await api.getThread(username);
      setMessages(r.messages); setOtherAdmin(r.other.is_admin);
    } catch (e) { setErr(String(e)); }
  }

  async function handleSend(to: string) {
    if (!to.trim() || !body.trim()) return;
    setSending(true); setErr('');
    try {
      await api.sendMessage(to.trim(), body.trim());
      setBody('');
      await openThread(to.trim());
      loadInbox();
    } catch (e) { setErr(String(e)); }
    finally { setSending(false); }
  }

  const btn = 'text-[11px] px-3 py-1 border border-zinc-700 text-zinc-300 hover:text-amber-400 hover:border-amber-800 disabled:opacity-50';

  return (
    <div className="fixed inset-0 bg-black/90 flex items-start justify-center z-[60] p-4 overflow-y-auto" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-zinc-950 border border-zinc-700 w-full max-w-lg my-4 flex flex-col" style={{ maxHeight: '85vh' }}>
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 bg-zinc-900 border-b border-zinc-700 shrink-0">
          <div className="flex items-center gap-3">
            {view !== 'inbox' && <button onClick={() => { setView('inbox'); loadInbox(); }} className="text-zinc-400 hover:text-amber-400 text-xs font-mono">{L.back}</button>}
            <span className="text-zinc-300 text-sm font-mono uppercase tracking-widest">
              {view === 'thread' && activeUser ? (
                <span className="flex items-center gap-1.5">{activeUser}{otherAdmin && <InquisitorBadge label={L.inquisitor} />}</span>
              ) : L.title}
            </span>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white text-xl">✕</button>
        </div>

        {err && <div className="mx-4 mt-3 text-red-400 text-xs font-mono bg-red-950/30 border border-red-800/50 px-3 py-2 shrink-0">{err}</div>}

        {/* Inbox */}
        {view === 'inbox' && (
          <div className="flex-1 overflow-y-auto p-3">
            <button onClick={() => { setComposeTo(''); setBody(''); setView('compose'); }} className={`${btn} mb-3`}>{L.newMessage}</button>
            {loading ? (
              <p className="text-zinc-600 text-xs font-mono p-2">{L.loading}</p>
            ) : conversations.length === 0 ? (
              <p className="text-zinc-600 text-xs font-mono italic p-2">{L.noConversations}</p>
            ) : (
              <div className="space-y-1">
                {conversations.map(c => (
                  <button key={c.username} onClick={() => openThread(c.username)}
                    className="w-full text-left flex items-center gap-2 p-2 border border-zinc-800 hover:border-amber-800/60 hover:bg-zinc-900/60">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className={c.is_admin ? 'text-amber-400' : 'text-zinc-200'}>{c.username}</span>
                        {c.is_admin && <InquisitorBadge label={L.inquisitor} />}
                      </div>
                      <p className="text-zinc-500 text-[11px] truncate">{c.last}</p>
                    </div>
                    <span className="text-zinc-600 text-[9px] font-mono shrink-0">{fmt(c.created_at)}</span>
                    {c.unread > 0 && <span className="bg-amber-700 text-amber-100 text-[9px] rounded-full px-1.5 py-0.5 shrink-0">{c.unread}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Thread */}
        {view === 'thread' && (
          <>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {messages.length === 0 ? (
                <p className="text-zinc-600 text-xs font-mono italic">{L.emptyThread}</p>
              ) : messages.map(m => {
                const mine = m.from_username !== activeUser;
                return (
                  <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-3 py-1.5 text-[12px] border ${mine ? 'border-amber-900/50 bg-amber-950/20' : 'border-zinc-800 bg-zinc-900'}`}>
                      {!mine && m.from_admin && <div className="mb-0.5"><InquisitorBadge label={L.inquisitor} /></div>}
                      <p className="whitespace-pre-wrap break-words text-zinc-200">{m.body}</p>
                      <div className="text-[9px] text-zinc-600 mt-0.5 text-right">{fmt(m.created_at)}</div>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>
            <div className="p-3 border-t border-zinc-800 flex gap-2 shrink-0">
              <textarea
                value={body} onChange={e => setBody(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(activeUser!); } }}
                placeholder={L.bodyPlaceholder} rows={1}
                className="flex-1 bg-zinc-900 border border-zinc-800 px-2 py-1 text-xs text-zinc-200 resize-none focus:outline-none focus:border-amber-800"
              />
              <button onClick={() => handleSend(activeUser!)} disabled={sending || !body.trim()} className={btn}>{sending ? L.sending : L.send}</button>
            </div>
          </>
        )}

        {/* Compose */}
        {view === 'compose' && (
          <div className="p-3 space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-zinc-500 text-[10px] font-mono w-10">{L.to}</label>
              <input value={composeTo} onChange={e => setComposeTo(e.target.value)} placeholder={L.recipientPlaceholder}
                className="flex-1 bg-zinc-900 border border-zinc-800 px-2 py-1 text-xs text-zinc-200 focus:outline-none focus:border-amber-800" />
            </div>
            <textarea value={body} onChange={e => setBody(e.target.value)} placeholder={L.bodyPlaceholder} rows={4}
              className="w-full bg-zinc-900 border border-zinc-800 px-2 py-1 text-xs text-zinc-200 resize-y focus:outline-none focus:border-amber-800" />
            <button onClick={() => handleSend(composeTo)} disabled={sending || !composeTo.trim() || !body.trim()} className={btn}>{sending ? L.sending : L.send}</button>
          </div>
        )}
      </div>
    </div>
  );
}
