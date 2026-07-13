import { useState, Fragment } from 'react';
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

function RangedSheet() {
  const woundTable: [string, string][] = [
    ['S ≥ 2× T', '2+'],
    ['S > T', '3+'],
    ['S = T', '4+'],
    ['S < T', '5+'],
    ['S ≤ ½ T', '6+'],
  ];
  return (
    <Card>
      <div style={{
        textAlign: 'center', fontFamily: 'Cinzel, Georgia, serif', fontWeight: 700,
        fontSize: '2rem', letterSpacing: '0.2em', color: ACCENT, marginBottom: 2,
      }}>SHOOTING</div>
      <div style={{
        textAlign: 'center', fontSize: '0.72rem', textTransform: 'uppercase',
        letterSpacing: '0.18em', color: MUTED, marginBottom: 18,
      }}>Ranged Combat · Cover</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px 28px' }}>
        {/* SEQUENCE */}
        <div>
          <SectionTitle>Shooting sequence</SectionTitle>
          <Line lead="1.">Choose targets: at least one model visible &amp; in range; a model fires all its datasheet weapons OR one armoury weapon. Units in melee can&apos;t be targeted.</Line>
          <Line lead="2.">Hit rolls = the weapon type (Rapid Fire 1 = 1, Assault 2 = 2…); hit on <strong>≥ BS</strong>.</Line>
          <Line lead="3.">Wound: <strong>S vs T</strong> (table).</Line>
          <Line lead="4.">Saves: subtract <strong>AP</strong> from the roll; an <strong>Invulnerable</strong> save ignores AP and can be tried if the normal save fails.</Line>
          <Line lead="5.">Damage ≥ the model&apos;s Wounds removes it; excess does not carry over.</Line>
          <Line lead="6.">Below half strength (or losing a model while already below) → Leadership test or 2 tokens &amp; Fleeing.</Line>
        </div>

        {/* WOUND TABLE + COVER */}
        <div>
          <SectionTitle>Strength vs Toughness</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '2px 14px', marginBottom: 12, fontSize: '0.9rem' }}>
            {woundTable.map(([cond, roll]) => (
              <Fragment key={cond}>
                <div style={{ color: INK }}>{cond}</div>
                <div style={{ color: ACCENT, fontWeight: 700, textAlign: 'right' }}>{roll}</div>
              </Fragment>
            ))}
          </div>
          <SectionTitle>Cover</SectionTitle>
          <Line lead="Light —">+1 Armour Save.</Line>
          <Line lead="Heavy —">+2 Armour Save.</Line>
          <Line>Both also give the attacker <strong>−1 to hit</strong> and <strong>−1 AT</strong> (min 0).</Line>
        </div>
      </div>

      <div style={{
        marginTop: 16, borderTop: `1px solid ${ACCENT}55`, paddingTop: 10,
        fontSize: '0.82rem', lineHeight: 1.5, color: '#3a332e',
      }}>
        <strong style={{ color: ACCENT }}>Notes: </strong>
        cover needs <strong>50%+</strong> of the unit in it, only one type at a time, and none if both sides share the same terrain ·
        <strong>Obscuring</strong> terrain/units give only <strong>−1 to hit</strong> (no save/AP benefit) ·
        the <strong>Take Cover</strong> reaction gives +1 save &amp; −1 AT vs ranged ·
        <strong>6+ hits</strong> from non-Suppression weapons force a Morale test (see the Morale card).
      </div>
    </Card>
  );
}

function MeleeSheet() {
  return (
    <Card>
      <div style={{
        textAlign: 'center', fontFamily: 'Cinzel, Georgia, serif', fontWeight: 700,
        fontSize: '2rem', letterSpacing: '0.22em', color: ACCENT, marginBottom: 2,
      }}>MELEE COMBAT</div>
      <div style={{
        textAlign: 'center', fontSize: '0.72rem', textTransform: 'uppercase',
        letterSpacing: '0.18em', color: MUTED, marginBottom: 18,
      }}>Charge · Fight · Combat Result</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px 28px' }}>
        {/* CHARGE */}
        <div>
          <SectionTitle>Charge order</SectionTitle>
          <Line>Declare any enemy units you can see; make a up-to-<strong>6&quot; move</strong> into base contact.</Line>
          <Line>Pick one Charge bonus for all models: <strong>+1 Attack</strong> or <strong>+1 Initiative</strong>.</Line>
          <Line lead="Target may react —">Defensive Fire, Hold Your Ground (negates the charge bonus if ≥50% of charged units use it), or Counter-Attack.</Line>
        </div>

        {/* FIGHT SEQUENCE */}
        <div>
          <SectionTitle>Fight sequence</SectionTitle>
          <Line lead="1.">Defender moves up to 6&quot; into base contact (characters first).</Line>
          <Line lead="2.">Act by <strong>Initiative</strong>, highest first; ties strike simultaneously (a slain model still hits back).</Line>
          <Line lead="3.">In range = base contact, or within 1&quot; of a friendly model in base contact.</Line>
          <Line lead="4.">Attacks = the <strong>A</strong> stat, split across melee weapons; hit on <strong>≥ WS</strong>. No melee weapon → S, AP 0, D 1.</Line>
          <Line lead="5.">Wound with the weapon&apos;s S (U = current S, or +x); same S-vs-T table as shooting.</Line>
          <Line lead="6.">Saves as shooting; already-wounded and out-of-contact models are removed first.</Line>
        </div>

        {/* COMBAT RESULT */}
        <div>
          <SectionTitle>Combat result (score points)</SectionTitle>
          <Line lead="+1">to the side with more <strong>Wounds remaining</strong>.</Line>
          <Line lead="+1">per <strong>Wound lost caused</strong> (only actual losses; excess damage ignored).</Line>
          <Line lead="+1">per <strong>penetrating hit</strong>.</Line>
          <Line>Apply unit modifiers. <strong>Higher total wins.</strong></Line>
          <div style={{ fontSize: '0.78rem', color: MUTED, marginTop: 6, fontStyle: 'italic', paddingLeft: 14 }}>
            A vehicle&apos;s Hull Points count as 5 Wounds each.
          </div>
        </div>

        {/* AFTER COMBAT */}
        <div>
          <SectionTitle>After combat</SectionTitle>
          <Line lead="Winner —">if no enemy stays in base contact, <strong>consolidate up to 3&quot;</strong>.</Line>
          <Line lead="Loser —">Leadership test at <strong>−(result difference)</strong>; fail → 2 Battleshock tokens &amp; Fleeing.</Line>
          <Line lead="Pass —">melee ends; both sides pile in up to 6&quot;.</Line>
          <Line lead="Pursue —">D6 + highest I each; pursuer ≥ fleeing → 1 auto hit per model, remove 1 token. Once per round.</Line>
        </div>
      </div>

      <div style={{
        marginTop: 16, borderTop: `1px solid ${ACCENT}55`, paddingTop: 10,
        fontSize: '0.82rem', lineHeight: 1.5, color: '#3a332e',
      }}>
        <strong style={{ color: ACCENT }}>Melee notes: </strong>
        a model with a <strong>pistol + a melee weapon</strong> gets <strong>+1 Attack</strong> in melee ·
        Strength <strong>7+</strong> gives all melee attacks <strong>AT(1)</strong> (unless already better) ·
        firing weapons during a Charge order is at <strong>−1 to hit</strong>.
      </div>
    </Card>
  );
}

function PsychicSheet() {
  const perils: [string, string, string][] = [
    ['1', 'Sucked into the Warp', 'Ld test: pass = 1 Mortal Wound; fail = psyker removed.'],
    ['2', 'Mindsteal', '1 MW; that power can no longer be used for the rest of the game.'],
    ['3', 'Power Drain', '1 MW; roll 1D3 — both players −that to all psychic tests this round (cumulative).'],
    ['4', 'Psionic Feedback', '1 MW.'],
    ['5', 'Empyrian Aftermath', 'Ld test: fail = 1 MW.'],
    ['6', 'Warp Boost', 'Ld test: pass = +1 to hit & +1 to wound until end of next activation; fail = 1 MW.'],
  ];
  return (
    <Card>
      <div style={{
        textAlign: 'center', fontFamily: 'Cinzel, Georgia, serif', fontWeight: 700,
        fontSize: '2rem', letterSpacing: '0.18em', color: ACCENT, marginBottom: 2,
      }}>PSYCHIC POWERS</div>
      <div style={{
        textAlign: 'center', fontSize: '0.72rem', textTransform: 'uppercase',
        letterSpacing: '0.18em', color: MUTED, marginBottom: 18,
      }}>Manifest · Dispel · Perils of the Warp</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px 28px' }}>
        {/* MANIFEST */}
        <div>
          <SectionTitle>Manifesting</SectionTitle>
          <Line>Only models with the <strong>Psyker</strong> rule. Line of sight is needed unless stated.</Line>
          <Line lead="Test —">roll <strong>2D6 ≥ the power&apos;s cast value</strong>.</Line>
          <Line lead="Repeat —">casting the same power again this turn is at a cumulative <strong>−1</strong>.</Line>
          <Line lead="Overchannel —">add a die (3D6); any <strong>double</strong> = <strong>1D3 Mortal Wounds</strong> (plus any Perils).</Line>
          <Line>Known powers are on the profile — General Disciplines + your Codex&apos;s.</Line>
        </div>

        {/* DISPEL + MELEE + TARGETS */}
        <div>
          <SectionTitle>Dispel &amp; targets</SectionTitle>
          <Line lead="Dispel —">an enemy psyker within <strong>24&quot;</strong> rolls <strong>2D6, must beat the cast result</strong>. Dispelled = no effect (still counts as manifested for Force weapons).</Line>
          <Line lead="In melee —">psykers in melee cast only <strong>Basic</strong> powers (Initiative phase); targets = self or units in that same melee.</Line>
          <Line lead="Targets —">Self · Friendly unit (or the caster + attached) · Enemy unit (incl. attached characters).</Line>
        </div>
      </div>

      {/* PERILS */}
      <div style={{ marginTop: 14 }}>
        <SectionTitle>Perils of the Warp — on a double 1 or double 6, roll D6</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 24px' }}>
          {perils.map(([n, name, eff]) => (
            <div key={n} style={{ fontSize: '0.84rem', lineHeight: 1.38, marginBottom: 4 }}>
              <span style={{ color: ACCENT, fontWeight: 700 }}>{n} </span>
              <strong>{name}: </strong>{eff}
            </div>
          ))}
        </div>
      </div>

      <div style={{
        marginTop: 14, borderTop: `1px solid ${ACCENT}55`, paddingTop: 10,
        fontSize: '0.82rem', lineHeight: 1.5, color: '#3a332e',
      }}>
        <strong style={{ color: ACCENT }}>Notes: </strong>
        use <strong>Leadership 10</strong> for Perils tests ·
        <strong>Brotherhood of Psykers</strong> (2+ such models) gives <strong>+1 to all cast and dispel rolls</strong>.
      </div>
    </Card>
  );
}

interface Sheet { key: string; label: string; blurb: string; render: () => ReactNode; }

const SHEETS: Sheet[] = [
  { key: 'morale',  label: 'Morale',   blurb: 'Battleshock, Suppressive Fire, the Ld test and tokens.', render: () => <MoraleSheet /> },
  { key: 'ranged',  label: 'Shooting', blurb: 'The ranged sequence, Strength-vs-Toughness, cover.',      render: () => <RangedSheet /> },
  { key: 'melee',   label: 'Melee',    blurb: 'Charge, the fight sequence, combat result, pursue.',       render: () => <MeleeSheet /> },
  { key: 'psychic', label: 'Psychic',  blurb: 'Casting, dispelling, and the Perils of the Warp table.',   render: () => <PsychicSheet /> },
];

export function CheatSheetModal({ onClose }: { onClose: () => void }) {
  // Start on the chooser (active = null) so the user picks ONE sheet; only that one is ever
  // rendered into #pv-printable, so Print/PDF only ever outputs the chosen sheet — never all of them.
  const [active, setActive] = useState<string | null>(null);
  const sheet = active ? SHEETS.find(s => s.key === active) ?? null : null;

  return createPortal((
    <div id="pv-root" className="fixed inset-0 z-50 overflow-y-auto" style={{ background: '#18171a' }}>
      {/* Toolbar */}
      <div className="print:hidden sticky top-0 z-10 bg-zinc-900 border-b border-zinc-700 px-4 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {sheet && (
            <button onClick={() => setActive(null)}
              className="px-3 py-1.5 text-xs uppercase tracking-wide border border-zinc-600 bg-zinc-700 text-zinc-300 hover:bg-zinc-600 transition-colors">
              ← Sheets
            </button>
          )}
          <span className="text-amber-400 font-bold text-sm uppercase tracking-widest">
            Cheat Sheets{sheet ? ` · ${sheet.label}` : ''}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {sheet && (
            <button onClick={() => window.print()}
              className="px-4 py-1.5 bg-amber-800 hover:bg-amber-700 border border-amber-600 text-white text-sm uppercase tracking-wide transition-colors">
              Print / PDF
            </button>
          )}
          <button onClick={onClose}
            className="px-4 py-1.5 bg-zinc-700 hover:bg-zinc-600 border border-zinc-600 text-zinc-200 text-sm uppercase tracking-wide transition-colors">
            Close
          </button>
        </div>
      </div>

      {sheet ? (
        // Printable area — ONLY the chosen sheet, so printing outputs just this one.
        <div id="pv-printable" className="px-4 py-8" style={{ background: '#fff', minHeight: '100vh' }}>
          {sheet.render()}
        </div>
      ) : (
        // Chooser — pick which sheet to view/print (never printed itself).
        <div className="print:hidden max-w-2xl mx-auto px-4 py-10">
          <p className="text-zinc-400 text-sm uppercase tracking-widest mb-4">Choose a cheat sheet</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SHEETS.map(s => (
              <button key={s.key} onClick={() => setActive(s.key)}
                className="text-left bg-zinc-900 border border-zinc-700 hover:border-amber-600 hover:bg-zinc-800/70 px-4 py-3 transition-colors">
                <div className="text-amber-400 font-bold uppercase tracking-widest text-sm mb-1">{s.label}</div>
                <div className="text-zinc-500 text-xs leading-relaxed">{s.blurb}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  ), document.body);
}
