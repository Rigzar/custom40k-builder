import { useState } from 'react';
import { LEGAL_DOCS, type LegalDocKey } from '../data/legalDocs';

interface Props {
  docKey: LegalDocKey;
  onClose: () => void;
}

export function LegalModal({ docKey, onClose }: Props) {
  const doc = LEGAL_DOCS[docKey];

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-start justify-center z-50 p-4 overflow-y-auto"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-zinc-900 border border-zinc-700 w-full max-w-2xl my-4">
        <div className="flex justify-between items-center px-5 py-3 bg-zinc-800 border-b border-zinc-700">
          <div>
            <h3 className="text-zinc-100 font-semibold text-sm">{doc.title}</h3>
            <p className="text-zinc-600 text-[11px] mt-0.5">Last updated: {doc.lastUpdated}</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-xl leading-none ml-4">✕</button>
        </div>

        <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
          {doc.sections.map((sec, i) => (
            <div key={i}>
              {sec.heading && (
                <h4 className="text-zinc-200 font-semibold text-sm mb-2">{sec.heading}</h4>
              )}
              <div className="text-zinc-400 text-[13px] leading-relaxed whitespace-pre-line">{sec.body}</div>
            </div>
          ))}
        </div>

        <div className="px-5 py-3 border-t border-zinc-700 flex justify-end bg-zinc-800">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-700 border border-zinc-600 text-zinc-200 text-sm hover:bg-zinc-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Footer link set used by both LandingPage and App ─────────────────────────
export function LegalFooter() {
  const [open, setOpen] = useState<LegalDocKey | null>(null);

  const links: { key: LegalDocKey; label: string }[] = [
    { key: 'privacy',        label: 'Privacy Policy' },
    { key: 'terms',          label: 'Terms of Use' },
    { key: 'cookies',        label: 'Cookie Policy' },
    { key: 'legal-notice',   label: 'Legal Notice' },
    { key: 'accessibility',  label: 'Accessibility' },
  ];

  return (
    <>
      <footer className="border-t border-zinc-800 bg-zinc-950 px-4 py-4 mt-auto">
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-zinc-600 text-[11px] text-center sm:text-left">
            © {new Date().getFullYear()} Custom40k Army Builder — Unofficial fan tool. Not affiliated with Games Workshop.
          </p>
          <nav className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            {links.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setOpen(key)}
                className="text-zinc-600 hover:text-zinc-400 text-[11px] transition-colors"
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </footer>

      {open && <LegalModal docKey={open} onClose={() => setOpen(null)} />}
    </>
  );
}
