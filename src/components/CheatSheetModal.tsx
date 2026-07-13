import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';

/**
 * CHEAT SHEETS — quick-reference cards, viewable + printable/downloadable like the Print View.
 *
 * Reuses the Print View's print isolation: the modal renders into a portal at <body> with
 * id="pv-root" and its printable area id="pv-printable", so the existing `@media print` block in
 * index.css (hide #root, flow #pv-root) prints ONLY the sheet — no new print CSS needed.
 *
 * Content is grounded in the canonical `Informacion/Custom40k Core Rules.txt` (Battleshock,
 * Suppressive Fire §336-340, Suppression weapon ability §1445-1452, Rally/test §82-105). NOT from
 * memory — the community's hand-made morale card had two rules errors (Suppression counts WEAPONS
 * not hits; there is no "-1 for explosive"), both corrected here.
 *
 * Adding another sheet later = append one entry to SHEETS; the tab bar appears automatically.
 */

const ACCENT = '#731f2e';     // martial dark red
const INK = '#1a1614';
const MUTED = '#5c534e';
const PARCHMENT = '#f6f1e7';

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div style={{
      fontFamily: 'Cinzel, Georgia, serif', fontWeight: 700, fontSize: '0.82rem',
      textTransform: 'uppercase', letterSpacing: '0.12em', color: ACCENT,
      borderBottom: `2px solid ${ACCENT}`, paddingBottom: 3, marginBottom: 8,
    }}>{children}</div>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <div style={{
      background: PARCHMENT, color: INK, border: `3px solid ${ACCENT}`,
      borderRadius: 6, padding: '22px 26px', maxWidth: 760, margin: '0 auto',
      boxShadow: '0 2px 10px rgba(0,0,0,0.25)', pageBreakInside: 'avoid', breakInside: 'avoid',
    }}>{children}</div>
  );
}

/** A labelled row: bold lead-in + descriptive text. */
function Line({ lead, children }: { lead?: string; children: ReactNode }) {
  return (
    <div style={{ fontSize: '0.9rem', lineHeight: 1.42, marginBottom: 5, paddingLeft: 14, textIndent: -14 }}>
      <span style={{ color: ACCENT, fontWeight: 700 }}>▸ </span>
      {lead && <strong>{lead} </strong>}
      {children}
    </div>
  );
}

function MoraleSheet() {
  return (
    <Card>
      {/* Banner */}
      <div style={{
        textAlign: 'center', fontFamily: 'Cinzel, Georgia, serif', fontWeight: 700,
        fontSize: '2rem', letterSpacing: '0.22em', color: ACCENT, marginBottom: 2,
      }}>MORALE</div>
      <div style={{
        textAlign: 'center', fontSize: '0.72rem', textTransform: 'uppercase',
        letterSpacing: '0.18em', color: MUTED, marginBottom: 18,
      }}>Battleshock · Suppressive Fire · Leadership</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px 28px' }}>
        {/* WHEN TO TEST */}
        <div>
          <SectionTitle>Take a Leadership test when…</SectionTitle>
          <Line lead="Suppressive Fire —">
            the unit takes <strong>6+ ranged hits</strong> from weapons <em>without</em> the
            Suppression ability during the attacker's activation.
          </Line>
          <Line lead="Suppression weapon —">
            <strong>a single hit</strong> from any weapon with the Suppression ability.
          </Line>
          <Line lead="Casualties —">
            the unit <strong>falls below half</strong> its Starting Strength, <em>or</em> loses a
            model <strong>while already below half</strong>.
          </Line>
        </div>

        {/* PENALTIES */}
        <div>
          <SectionTitle>Cumulative Ld penalties</SectionTitle>
          <Line lead="−1">for every <strong>additional 6 hits</strong> (Suppressive Fire).</Line>
          <Line lead="−1">
            for every <strong>additional Suppression weapon</strong> fired at the same target that
            activation <em>(count weapons, not hits)</em>.
          </Line>
          <Line lead="−2">extra if a Suppression weapon has <strong>Barrage</strong>.</Line>
          <Line lead="−1">permanent, while <strong>below half</strong> Starting Strength.</Line>
          <div style={{ fontSize: '0.78rem', color: MUTED, marginTop: 6, fontStyle: 'italic', paddingLeft: 14 }}>
            Suppressive Fire and Suppression penalties stack.
          </div>
        </div>

        {/* THE TEST */}
        <div>
          <SectionTitle>The test</SectionTitle>
          <Line><strong>Roll 2D6.</strong> Pass if the result is <strong>≤ the unit's Leadership</strong>.</Line>
          <Line lead="Pass —">no token. In the Rally Phase, a pass removes <em>all</em> tokens.</Line>
          <Line lead="Fail (Suppression) —">gain <strong>1 Battleshock token</strong>.</Line>
          <Line lead="Fail (casualties) —">gain <strong>2 tokens</strong> → the unit is <strong>Fleeing</strong>.</Line>
        </div>

        {/* TOKENS */}
        <div>
          <SectionTitle>Battleshock tokens (max 2)</SectionTitle>
          <Line lead="1 — Pinned:">−1 to all hit rolls; Movement halved; no Charge bonuses.</Line>
          <Line lead="2 — Fleeing:">
            moves D6+6&quot; to the nearest friendly edge; no orders, no objectives; off the edge = removed.
          </Line>
        </div>
      </div>

      {/* Combined-test note */}
      <div style={{
        marginTop: 16, borderTop: `1px solid ${ACCENT}55`, paddingTop: 10,
        fontSize: '0.82rem', lineHeight: 1.45, fontStyle: 'italic', color: '#3a332e',
      }}>
        <strong style={{ color: ACCENT, fontStyle: 'normal' }}>One test only: </strong>
        if a unit is forced to test for Suppressive Fire (or Suppression weapons) <em>and</em> for
        dropping below half Starting Strength at the same time, it tests <strong>once</strong>
        (applying all penalties) and, on a failure, receives <strong>two Battleshock tokens</strong>.
      </div>
    </Card>
  );
}

interface Sheet { key: string; label: string; render: () => ReactNode; }

const SHEETS: Sheet[] = [
  { key: 'morale', label: 'Morale', render: () => <MoraleSheet /> },
];

export function CheatSheetModal({ onClose }: { onClose: () => void }) {
  const [active, setActive] = useState(SHEETS[0].key);
  const sheet = SHEETS.find(s => s.key === active) ?? SHEETS[0];

  return createPortal((
    <div id="pv-root" className="fixed inset-0 z-50 overflow-y-auto" style={{ background: '#18171a' }}>
      {/* Toolbar */}
      <div className="print:hidden sticky top-0 z-10 bg-zinc-900 border-b border-zinc-700 px-4 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-amber-400 font-bold text-sm uppercase tracking-widest">Cheat Sheets</span>
          {SHEETS.length > 1 && (
            <div className="flex items-center gap-1">
              {SHEETS.map(s => (
                <button key={s.key} onClick={() => setActive(s.key)}
                  className={`px-3 py-1.5 text-xs uppercase tracking-wide border transition-colors ${active === s.key ? 'bg-amber-800 border-amber-600 text-white' : 'bg-zinc-700 border-zinc-600 text-zinc-300 hover:bg-zinc-600'}`}>
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => window.print()}
            className="px-4 py-1.5 bg-amber-800 hover:bg-amber-700 border border-amber-600 text-white text-sm uppercase tracking-wide transition-colors">
            Print / PDF
          </button>
          <button onClick={onClose}
            className="px-4 py-1.5 bg-zinc-700 hover:bg-zinc-600 border border-zinc-600 text-zinc-200 text-sm uppercase tracking-wide transition-colors">
            ← Back
          </button>
        </div>
      </div>

      {/* Printable area */}
      <div id="pv-printable" className="px-4 py-8" style={{ background: '#fff', minHeight: '100vh' }}>
        {sheet.render()}
      </div>
    </div>
  ), document.body);
}
