import { Fragment } from 'react';
import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';
import { useLanguage, type Language } from '../i18n';
import { usePaperSize, PaperSizeCss, PaperSizeToggle } from './PaperSize';

/**
 * FIELD MANUAL — a single combined Quick Rules reference, viewable + printable/downloadable as
 * ONE file like the Print View (Rigzar: "conviertelo en un solo archivo de quick rules" — the
 * previous version made you pick one of 6 separate cards; now every section prints together in
 * one Print/PDF pass, each starting on its own page).
 *
 * Reuses the Print View's print isolation: the modal renders into a portal at <body> with
 * id="pv-root" and its printable area id="pv-printable", so the existing `@media print` block in
 * index.css (hide #root, flow #pv-root) prints ONLY this document — no new print CSS needed.
 *
 * Content is grounded in the canonical `Codex/Custom40k Core Rules.docx` (Battleshock, Suppressive
 * Fire, the Suppression weapon ability, Rally/test). NOT from memory — the community's hand-made
 * morale card had a rules error (Suppression counts WEAPONS fired, not hits scored) fixed here.
 * Re-verified 2026-08-24: the Suppression ability's own -1 (Explosive) / -2 (Barrage) modifiers and
 * the Charge order's full sequence (normal move up to M, max 12", THEN a separate 6" charge move)
 * were re-checked line-by-line against the current .docx and both cards updated to match exactly.
 *
 * 2026-08-31: audited the community's "Custom40k Quick Rules v0.3" PDF against this canon and
 * found real mechanical mismatches (AT(X) described as a flat table bonus instead of "roll X dice
 * and apply all", Stand & Shoot's hit-penalty REDUCTION shown as a penalty, Seeking's text swapped
 * with Grot-guided's, Soul Burn/Flames/Sunder rewritten into different effects, a "Grav" ability
 * that doesn't exist in current canon) — verdict: too unreliable to use as a reference. Added the
 * Turn Sequence section below to cover what it had and the others here didn't (phase overview,
 * Reinforcement chart, Initiative tiebreak, Movement), grounded straight in the .docx instead. The
 * community's printable order-card decks stay linked (OrderCardsCredit) but sit OUTSIDE this
 * document — separate downloads, not part of the Quick Rules print/PDF output.
 *
 * Same day, follow-up: Rigzar noticed the whole document was English-only regardless of the app's
 * selected language ("no se puede tambien que ellas tengan el idioma??"). Every section below now
 * carries its own EN/DE/ES text (a `*_TEXT: Record<Language, ...>` object per sheet), read via the
 * SAME `useLanguage()` store the rest of the app already uses — no separate language picker here.
 * Rule/mechanic PROPER NAMES (Battleshock, order names, Psyker, Ward save, stat abbreviations...)
 * are deliberately kept in English in all three languages, matching the convention already
 * established in LandingPage.tsx's own DE/ES banner text. Inline bold uses a lightweight `**text**`
 * marker parsed by `B()` below, so a translated line can carry its own emphasis without needing a
 * parallel JSX structure per language.
 *
 * Adding another section later = write a `*Sheet()` component (each is one `<Card>`) and stack it
 * into the printable column inside CheatSheetModal below.
 */

const ACCENT = '#731f2e';     // martial dark red
const INK = '#1a1614';
const MUTED = '#5c534e';
const PARCHMENT = '#f6f1e7';

/** Parses `**bold**` and `*italic*` markers in translated content strings into <strong>/<em> spans. */
function B({ text }: { text: string }): ReactNode {
  const nodes: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\*(.+?)\*/g;
  let last = 0, i = 0, m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) nodes.push(<Fragment key={i++}>{text.slice(last, m.index)}</Fragment>);
    nodes.push(m[1] !== undefined ? <strong key={i++}>{m[1]}</strong> : <em key={i++}>{m[2]}</em>);
    last = re.lastIndex;
  }
  if (last < text.length) nodes.push(<Fragment key={i++}>{text.slice(last)}</Fragment>);
  return <>{nodes}</>;
}

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

/** A bulleted row of translated text (supports `**bold**` markers). */
function Line({ text }: { text: string }) {
  return (
    <div style={{ fontSize: '0.9rem', lineHeight: 1.42, marginBottom: 5, paddingLeft: 14, textIndent: -14 }}>
      <span style={{ color: ACCENT, fontWeight: 700 }}>▸ </span>
      <B text={text} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// TURN SEQUENCE
// ─────────────────────────────────────────────────────────────────────────

interface TurnSeqText {
  title: string; subtitle: string; phasesTitle: string;
  phases: [string, string][];
  reinforcementTitle: string; reinforcementIntro: string;
  colRound: string; colDice: string; colAuto: string;
  perDie: string; transports: string; arriving: string; above2500: string;
  initiativeTitle: string; initiativeRoll: string; tie: string; round1tie: string;
  movementTitle: string; horizontal: string; vertical: string; formation: string;
  enemyDistance: string; throughUnits: string; mixedUnits: string;
  notes: string;
}

const TURN_TEXT: Record<Language, TurnSeqText> = {
  en: {
    title: 'TURN SEQUENCE', subtitle: 'The Battle Round · Reinforcements · Movement',
    phasesTitle: 'The Battle Round — 5 phases, in order',
    phases: [
      ['1. Rally', 'Take a Leadership test for every unit carrying a Battleshock token.'],
      ['2. Reinforcement', 'Units held in reserve attempt to enter the battlefield.'],
      ['3. Command', 'Both players assign orders to all units by placing them face down.'],
      ['4. Initiative', 'Roll off to see who activates the first unit this battle round.'],
      ['5. Action', 'Players alternate activating units and resolving their assigned orders.'],
    ],
    reinforcementTitle: 'Reinforcement Phase',
    reinforcementIntro: 'Roll a number of dice equal to the current battle round number.',
    colRound: 'Round', colDice: 'Dice', colAuto: 'Automatic',
    perDie: '**4+ per die —** bring 1 unit from reserve.',
    transports: '**Transports —** the vehicle and its embarked unit count as one reserve; an attached character and its unit also roll just one die together.',
    arriving: '**Arriving units —** enter from your own board edge and may only be given an Advance or Move & Shoot order that Command Phase.',
    above2500: "**Above 2500 pts —** get the round's listed dice one extra time per additional 2500 points of game size.",
    initiativeTitle: 'Initiative Phase',
    initiativeRoll: 'Both players roll **2D6**; the higher result gains the initiative and activates the first unit in the Action Phase.',
    tie: '**Tie —** goes to the player who did **not** have initiative last round.',
    round1tie: '**Round 1 tie —** goes to the player who finished deploying their units first.',
    movementTitle: 'Movement',
    horizontal: "**Horizontal —** up to the unit's Movement value, measured from the model's base (vehicles: lowest point of the hull).",
    vertical: '**Vertical —** 3" per floor/level of a building or terrain change (cliffs, walls, slopes, stairs).',
    formation: '**Formation —** no model may end more than 2" (horiz.) / 5" (vert.) from another model in the same unit — not required while engaged in melee.',
    enemyDistance: '**Enemy distance —** stay at least 1" away from enemy models at all times.',
    throughUnits: '**Through other units —** Creatures may move through friendly models; Vehicles must be bypassed instead.',
    mixedUnits: "**Mixed units —** the whole unit uses its most restrictive model's movement limitations (e.g. a Terminator-armoured character joining Infantry stops the unit Advancing or pursuing in melee).",
    notes: "**Notes:** if both players have units in reserve, the player who won the roll to choose deployment zones resolves their Reinforcement rolls first · see the **Orders** sheet for the 6 Command Phase orders and 4 meta orders, and the **Shooting**/**Melee** sheets for resolving attacks.",
  },
  de: {
    title: 'RUNDENABLAUF', subtitle: 'Die Kampfrunde · Verstärkung · Bewegung',
    phasesTitle: 'Die Kampfrunde — 5 Phasen, in dieser Reihenfolge',
    phases: [
      ['1. Rally', 'Jede Einheit mit mindestens einem Battleshock-Marker macht einen Leadership-Test.'],
      ['2. Reinforcement', 'Einheiten in Reserve versuchen, das Schlachtfeld zu betreten.'],
      ['3. Command', 'Beide Spieler weisen allen Einheiten verdeckt Befehle zu.'],
      ['4. Initiative', 'Auswürfeln, wer diese Kampfrunde die erste Einheit aktiviert.'],
      ['5. Action', 'Die Spieler aktivieren abwechselnd Einheiten und lösen ihre zugewiesenen Befehle auf.'],
    ],
    reinforcementTitle: 'Reinforcement-Phase',
    reinforcementIntro: 'Würfle so viele Würfel, wie die aktuelle Kampfrundennummer angibt.',
    colRound: 'Runde', colDice: 'Würfel', colAuto: 'Automatisch',
    perDie: '**4+ pro Würfel —** eine Einheit kommt aus der Reserve.',
    transports: '**Transporter —** das Fahrzeug und die eingeschiffte Einheit zählen als eine Reserve; ein angeschlossener Charakter und seine Einheit würfeln ebenfalls nur einen gemeinsamen Würfel.',
    arriving: '**Ankommende Einheiten —** betreten das Feld von der eigenen Tischkante und können in dieser Command-Phase nur einen Advance- oder Move & Shoot-Befehl erhalten.',
    above2500: '**Über 2500 Punkte —** die für die Runde angegebenen Würfel gibt es pro weitere 2500 Punkte Spielgröße ein zusätzliches Mal.',
    initiativeTitle: 'Initiative-Phase',
    initiativeRoll: 'Beide Spieler würfeln **2D6**; das höhere Ergebnis erhält die Initiative und aktiviert die erste Einheit in der Action-Phase.',
    tie: '**Gleichstand —** geht an den Spieler, der die Initiative in der letzten Runde **nicht** hatte.',
    round1tie: '**Gleichstand in Runde 1 —** geht an den Spieler, der zuerst mit der Aufstellung fertig war.',
    movementTitle: 'Bewegung',
    horizontal: '**Horizontal —** bis zum Movement-Wert der Einheit, gemessen ab dem Sockel des Modells (Fahrzeuge: tiefster Punkt des Rumpfes).',
    vertical: '**Vertikal —** 3" pro Stockwerk/Ebene eines Gebäudes oder Geländewechsel (Klippen, Mauern, Rampen, Treppen).',
    formation: '**Formation —** kein Modell darf mehr als 2" (horiz.) / 5" (vert.) von einem anderen Modell derselben Einheit entfernt enden — nicht erforderlich, solange man im Nahkampf gebunden ist.',
    enemyDistance: '**Abstand zum Gegner —** jederzeit mindestens 1" Abstand zu gegnerischen Modellen einhalten.',
    throughUnits: '**Durch andere Einheiten —** Creatures dürfen durch befreundete Modelle hindurch bewegt werden; Vehicles müssen stattdessen umgangen werden.',
    mixedUnits: '**Gemischte Einheiten —** die gesamte Einheit übernimmt die Bewegungseinschränkungen ihres restriktivsten Modells (z. B. verhindert ein Charakter in Terminator-Rüstung, der sich einer Infantry-Einheit anschließt, dass diese Advance macht oder im Nahkampf verfolgt).',
    notes: '**Hinweise:** haben beide Spieler Einheiten in Reserve, löst zuerst der Spieler seine Reinforcement-Würfe aus, der den Wurf um die Aufstellungszonen gewonnen hat · die 6 Command-Phase-Befehle und 4 Meta-Befehle stehen im **Orders**-Blatt, das Auflösen von Angriffen in den Blättern **Shooting**/**Melee**.',
  },
  es: {
    title: 'SECUENCIA DE TURNO', subtitle: 'La Ronda de Batalla · Refuerzos · Movimiento',
    phasesTitle: 'La Ronda de Batalla — 5 fases, en orden',
    phases: [
      ['1. Rally', 'Cada unidad con al menos un token de Battleshock hace un test de Leadership.'],
      ['2. Reinforcement', 'Las unidades en reserva intentan entrar al campo de batalla.'],
      ['3. Command', 'Ambos jugadores asignan órdenes a todas las unidades boca abajo.'],
      ['4. Initiative', 'Se tira para ver quién activa la primera unidad esta ronda de batalla.'],
      ['5. Action', 'Los jugadores alternan activando unidades y resolviendo sus órdenes asignadas.'],
    ],
    reinforcementTitle: 'Fase de Reinforcement',
    reinforcementIntro: 'Tira tantos dados como el número de la ronda de batalla actual.',
    colRound: 'Ronda', colDice: 'Dados', colAuto: 'Automático',
    perDie: '**4+ por dado —** trae 1 unidad de la reserva.',
    transports: '**Transportes —** el vehículo y su unidad embarcada cuentan como una sola reserva; un personaje unido a una unidad también tira un solo dado junto con ella.',
    arriving: '**Unidades que llegan —** entran desde tu propio borde de mesa y esa Command Phase solo pueden recibir una orden de Advance o Move & Shoot.',
    above2500: '**Por encima de 2500 pts —** se obtienen los dados indicados para la ronda una vez más por cada 2500 puntos adicionales de tamaño de partida.',
    initiativeTitle: 'Fase de Initiative',
    initiativeRoll: 'Ambos jugadores tiran **2D6**; el resultado más alto obtiene la iniciativa y activa la primera unidad en la Action Phase.',
    tie: '**Empate —** va para el jugador que **no** tuvo la iniciativa la ronda anterior.',
    round1tie: '**Empate en la ronda 1 —** va para el jugador que terminó de desplegar sus unidades primero.',
    movementTitle: 'Movimiento',
    horizontal: '**Horizontal —** hasta el valor de Movement de la unidad, medido desde la base del modelo (vehículos: el punto más bajo del casco).',
    vertical: '**Vertical —** 3" por planta/nivel de un edificio o cambio de terreno (acantilados, muros, rampas, escaleras).',
    formation: '**Formation —** ningún modelo puede terminar a más de 2" (horiz.) / 5" (vert.) de otro modelo de la misma unidad — no es necesario mientras esté trabado en combate cuerpo a cuerpo.',
    enemyDistance: '**Distancia al enemigo —** mantente siempre a al menos 1" de los modelos enemigos.',
    throughUnits: '**A través de otras unidades —** las Creatures pueden moverse a través de modelos amigos; los Vehicles deben ser rodeados en su lugar.',
    mixedUnits: '**Unidades mixtas —** toda la unidad usa las limitaciones de movimiento de su modelo más restrictivo (p. ej., un personaje con armadura Terminator que se une a una unidad de Infantry le impide hacer Advance o perseguir en combate cuerpo a cuerpo).',
    notes: '**Notas:** si ambos jugadores tienen unidades en reserva, resuelve primero sus tiradas de Reinforcement el jugador que ganó la tirada para elegir zona de despliegue · las 6 órdenes de Command Phase y las 4 meta-órdenes están en la hoja **Orders**, y cómo resolver ataques en las hojas **Shooting**/**Melee**.',
  },
};

/** Phase-by-phase overview + Reinforcement/Initiative/Movement — the one thing none of the other
 *  sheets cover (Morale/Shooting/Melee/Psychic/Orders each own their own slice of a phase, but
 *  nothing shows the 5-phase shape of a battle round itself). Verbatim from Custom40k Core
 *  Rules.docx §"The Battle Round"/"2. Reinforcement Phase"/"4. Initiative Phase"/"Movement". */
const REINFORCEMENT_AUTO: Record<Language, [string, string, string, string]> = {
  en: ['—', '+1 unit', '+2 units', '+3 units'],
  de: ['—', '+1 Einheit', '+2 Einheiten', '+3 Einheiten'],
  es: ['—', '+1 unidad', '+2 unidades', '+3 unidades'],
};

function TurnSequenceSheet({ lang }: { lang: Language }) {
  const T = TURN_TEXT[lang];
  const [none, plus1, plus2, plus3] = REINFORCEMENT_AUTO[lang];
  const reinforcement: [string, string, string][] = [
    ['1', '1D6', none],
    ['2', '2D6', none],
    ['3', '3D6', plus1],
    ['4', '4D6', plus2],
    ['5', '5D6', plus3],
  ];
  return (
    <Card>
      <div style={{
        textAlign: 'center', fontFamily: 'Cinzel, Georgia, serif', fontWeight: 700,
        fontSize: '2rem', letterSpacing: '0.16em', color: ACCENT, marginBottom: 2,
      }}>{T.title}</div>
      <div style={{
        textAlign: 'center', fontSize: '0.72rem', textTransform: 'uppercase',
        letterSpacing: '0.18em', color: MUTED, marginBottom: 18,
      }}>{T.subtitle}</div>

      <SectionTitle>{T.phasesTitle}</SectionTitle>
      <div style={{ marginBottom: 14 }}>
        {T.phases.map(([n, desc]) => <Line key={n} text={`**${n}** ${desc}`} />)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px 28px' }}>
        {/* REINFORCEMENT */}
        <div>
          <SectionTitle>{T.reinforcementTitle}</SectionTitle>
          <Line text={T.reinforcementIntro} />
          <div style={{ display: 'grid', gridTemplateColumns: 'auto auto auto', gap: '2px 14px', margin: '6px 0 8px', fontSize: '0.86rem' }}>
            <div style={{ fontWeight: 700, color: MUTED, fontSize: '0.68rem', textTransform: 'uppercase' }}>{T.colRound}</div>
            <div style={{ fontWeight: 700, color: MUTED, fontSize: '0.68rem', textTransform: 'uppercase' }}>{T.colDice}</div>
            <div style={{ fontWeight: 700, color: MUTED, fontSize: '0.68rem', textTransform: 'uppercase' }}>{T.colAuto}</div>
            {reinforcement.map(([round, dice, auto]) => (
              <Fragment key={round}>
                <div>{round}</div>
                <div style={{ color: ACCENT, fontWeight: 700 }}>{dice}</div>
                <div>{auto}</div>
              </Fragment>
            ))}
          </div>
          <Line text={T.perDie} />
          <Line text={T.transports} />
          <Line text={T.arriving} />
          <Line text={T.above2500} />
        </div>

        {/* INITIATIVE */}
        <div>
          <SectionTitle>{T.initiativeTitle}</SectionTitle>
          <Line text={T.initiativeRoll} />
          <Line text={T.tie} />
          <Line text={T.round1tie} />
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <SectionTitle>{T.movementTitle}</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 28px' }}>
          <Line text={T.horizontal} />
          <Line text={T.vertical} />
          <Line text={T.formation} />
          <Line text={T.enemyDistance} />
        </div>
        <Line text={T.throughUnits} />
        <Line text={T.mixedUnits} />
      </div>

      <div style={{
        marginTop: 16, borderTop: `1px solid ${ACCENT}55`, paddingTop: 10,
        fontSize: '0.82rem', lineHeight: 1.5, color: '#3a332e',
      }}>
        <B text={T.notes} />
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// MORALE
// ─────────────────────────────────────────────────────────────────────────

interface MoraleText {
  title: string; subtitle: string;
  whenTitle: string; suppressiveFire: string; suppressionWeapon: string; casualties: string;
  penaltiesTitle: string; pen1: string; pen2: string; pen3: string; pen4: string; pen5: string; penNote: string;
  testTitle: string; test1: string; test2: string; test3: string; test4: string;
  tokensTitle: string; tok1: string; tok2: string;
  footer: string;
}

const MORALE_TEXT: Record<Language, MoraleText> = {
  en: {
    title: 'MORALE', subtitle: 'Battleshock · Suppressive Fire · Leadership',
    whenTitle: 'Take a Leadership test when…',
    suppressiveFire: "**Suppressive Fire —** the unit takes **6+ ranged hits** from weapons *without* the Suppression ability during the attacker's activation.",
    suppressionWeapon: '**Suppression weapon —** **a single hit** from any weapon with the Suppression ability.',
    casualties: '**Casualties —** the unit **falls below half** its Starting Strength, *or* loses a model **while already below half**.',
    penaltiesTitle: 'Cumulative Ld penalties',
    pen1: '**−1** for every **additional 6 hits** (Suppressive Fire).',
    pen2: '**−1** for every **additional Suppression weapon** fired at the same target that activation *(count weapons, not hits)*.',
    pen3: '**−1** extra **per** Suppression weapon that also has **Explosive**.',
    pen4: '**−2** extra **per** Suppression weapon that also has **Barrage**.',
    pen5: '**−1** permanent, while the squad is **below half** Starting Strength.',
    penNote: 'Everything is cumulative — add up every penalty above.',
    testTitle: 'The test',
    test1: "**Roll 2D6.** Pass if the result is **≤ the unit's Leadership**.",
    test2: '**Pass —** no token. In the Rally Phase, a pass removes *all* tokens.',
    test3: '**Fail (Suppression) —** gain **1 Battleshock token**.',
    test4: '**Fail (casualties) —** gain **2 tokens** → the unit is **Fleeing**.',
    tokensTitle: 'Battleshock tokens (max 2)',
    tok1: '**1 — Pinned:** −1 to all hit rolls; Movement halved; no Charge bonuses.',
    tok2: '**2 — Fleeing:** moves D6+6" to the nearest friendly edge; no orders, no objectives; off the edge = removed.',
    footer: '**One test only:** if a unit is forced to test for Suppressive Fire (or Suppression weapons) *and* for dropping below half Starting Strength at the same time, it tests **once** (applying all penalties) and, on a failure, receives **two Battleshock tokens**.',
  },
  de: {
    title: 'MORAL', subtitle: 'Battleshock · Suppressive Fire · Leadership',
    whenTitle: 'Ein Leadership-Test wird fällig, wenn …',
    suppressiveFire: '**Suppressive Fire —** die Einheit erhält während der Aktivierung des Angreifers **6+ Fernkampftreffer** von Waffen *ohne* die Suppression-Fähigkeit.',
    suppressionWeapon: '**Suppression-Waffe —** **ein einziger Treffer** von einer Waffe mit der Suppression-Fähigkeit.',
    casualties: '**Verluste —** die Einheit **fällt unter die Hälfte** ihrer Starting Strength, *oder* verliert ein Modell, **während sie bereits darunter liegt**.',
    penaltiesTitle: 'Kumulative Ld-Abzüge',
    pen1: '**−1** für jede **weiteren 6 Treffer** (Suppressive Fire).',
    pen2: '**−1** für jede **weitere Suppression-Waffe**, die in dieser Aktivierung auf dasselbe Ziel feuert *(gezählt werden Waffen, nicht Treffer)*.',
    pen3: '**−1** zusätzlich **pro** Suppression-Waffe, die zusätzlich **Explosive** hat.',
    pen4: '**−2** zusätzlich **pro** Suppression-Waffe, die zusätzlich **Barrage** hat.',
    pen5: '**−1** dauerhaft, solange der Trupp **unter der Hälfte** seiner Starting Strength liegt.',
    penNote: 'Alles ist kumulativ — alle obigen Abzüge werden addiert.',
    testTitle: 'Der Test',
    test1: '**Würfle 2D6.** Bestanden, wenn das Ergebnis **≤ dem Leadership-Wert der Einheit** ist.',
    test2: '**Bestanden —** kein Marker. In der Rally-Phase entfernt ein bestandener Test *alle* Marker.',
    test3: '**Fehlgeschlagen (Suppression) —** **1 Battleshock-Marker** wird erhalten.',
    test4: '**Fehlgeschlagen (Verluste) —** **2 Marker** werden erhalten → die Einheit ist **Fleeing**.',
    tokensTitle: 'Battleshock-Marker (max. 2)',
    tok1: '**1 — Pinned:** −1 auf alle Trefferwürfe; Movement halbiert; keine Charge-Boni.',
    tok2: '**2 — Fleeing:** bewegt sich D6+6" zur nächsten befreundeten Tischkante; keine Befehle, keine Objectives; verlässt die Kante = entfernt.',
    footer: '**Nur ein Test:** muss eine Einheit gleichzeitig wegen Suppressive Fire (oder Suppression-Waffen) *und* wegen Absinkens unter die halbe Starting Strength testen, testet sie **nur einmal** (alle Abzüge werden angewendet) und erhält bei einem Fehlschlag **zwei Battleshock-Marker**.',
  },
  es: {
    title: 'MORAL', subtitle: 'Battleshock · Suppressive Fire · Leadership',
    whenTitle: 'Se hace un test de Leadership cuando…',
    suppressiveFire: '**Suppressive Fire —** la unidad recibe **6+ impactos a distancia** de armas *sin* la habilidad Suppression durante la activación del atacante.',
    suppressionWeapon: '**Arma con Suppression —** **un solo impacto** de cualquier arma con la habilidad Suppression.',
    casualties: '**Bajas —** la unidad **cae por debajo de la mitad** de su Starting Strength, *o* pierde un modelo **estando ya por debajo de la mitad**.',
    penaltiesTitle: 'Penalizaciones acumulativas a Ld',
    pen1: '**−1** por cada **6 impactos adicionales** (Suppressive Fire).',
    pen2: '**−1** por cada **arma con Suppression adicional** que dispare al mismo objetivo en esa activación *(se cuentan armas, no impactos)*.',
    pen3: '**−1** extra **por** cada arma con Suppression que también tenga **Explosive**.',
    pen4: '**−2** extra **por** cada arma con Suppression que también tenga **Barrage**.',
    pen5: '**−1** permanente, mientras la unidad esté **por debajo de la mitad** de su Starting Strength.',
    penNote: 'Todo es acumulativo — suma todas las penalizaciones anteriores.',
    testTitle: 'El test',
    test1: '**Tira 2D6.** Se supera si el resultado es **≤ el Leadership de la unidad**.',
    test2: '**Superado —** sin token. En la Rally Phase, superarlo elimina *todos* los tokens.',
    test3: '**Fallado (Suppression) —** se gana **1 token de Battleshock**.',
    test4: '**Fallado (bajas) —** se ganan **2 tokens** → la unidad está **Fleeing**.',
    tokensTitle: 'Tokens de Battleshock (máx. 2)',
    tok1: '**1 — Pinned:** −1 a todas las tiradas para impactar; Movement a la mitad; sin bonos de Charge.',
    tok2: '**2 — Fleeing:** se mueve D6+6" hacia el borde amigo más cercano; sin órdenes, sin objectives; sale del borde = se retira.',
    footer: '**Un solo test:** si una unidad debe testear por Suppressive Fire (o armas con Suppression) *y* por caer bajo la mitad de su Starting Strength al mismo tiempo, testea **una sola vez** (aplicando todas las penalizaciones) y, si falla, recibe **dos tokens de Battleshock**.',
  },
};

function MoraleSheet({ lang }: { lang: Language }) {
  const T = MORALE_TEXT[lang];
  return (
    <Card>
      <div style={{
        textAlign: 'center', fontFamily: 'Cinzel, Georgia, serif', fontWeight: 700,
        fontSize: '2rem', letterSpacing: '0.22em', color: ACCENT, marginBottom: 2,
      }}>{T.title}</div>
      <div style={{
        textAlign: 'center', fontSize: '0.72rem', textTransform: 'uppercase',
        letterSpacing: '0.18em', color: MUTED, marginBottom: 18,
      }}>{T.subtitle}</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px 28px' }}>
        <div>
          <SectionTitle>{T.whenTitle}</SectionTitle>
          <Line text={T.suppressiveFire} />
          <Line text={T.suppressionWeapon} />
          <Line text={T.casualties} />
        </div>

        <div>
          <SectionTitle>{T.penaltiesTitle}</SectionTitle>
          <Line text={T.pen1} />
          <Line text={T.pen2} />
          <Line text={T.pen3} />
          <Line text={T.pen4} />
          <Line text={T.pen5} />
          <div style={{ fontSize: '0.78rem', color: MUTED, marginTop: 6, fontStyle: 'italic', paddingLeft: 14 }}>
            {T.penNote}
          </div>
        </div>

        <div>
          <SectionTitle>{T.testTitle}</SectionTitle>
          <Line text={T.test1} />
          <Line text={T.test2} />
          <Line text={T.test3} />
          <Line text={T.test4} />
        </div>

        <div>
          <SectionTitle>{T.tokensTitle}</SectionTitle>
          <Line text={T.tok1} />
          <Line text={T.tok2} />
        </div>
      </div>

      <div style={{
        marginTop: 16, borderTop: `1px solid ${ACCENT}55`, paddingTop: 10,
        fontSize: '0.82rem', lineHeight: 1.45, fontStyle: 'italic', color: '#3a332e',
      }}>
        <B text={T.footer} />
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// SHOOTING
// ─────────────────────────────────────────────────────────────────────────

interface RangedText {
  title: string; subtitle: string;
  seqTitle: string; seq1: string; seq2: string; seq3: string; seq4: string; seq5: string; seq6: string;
  woundTitle: string; coverTitle: string; cover1: string; cover2: string; cover3: string;
  notes: string;
}

const RANGED_TEXT: Record<Language, RangedText> = {
  en: {
    title: 'SHOOTING', subtitle: 'Ranged Combat · Cover',
    seqTitle: 'Shooting sequence',
    seq1: "**1.** Choose targets: at least one model visible & in range; a model fires all its datasheet weapons OR one armoury weapon. Units in melee can't be targeted.",
    seq2: '**2.** Hit rolls = the weapon type (Rapid Fire 1 = 1, Assault 2 = 2…); hit on **≥ BS**.',
    seq3: '**3.** Wound: **S vs T** (table).',
    seq4: '**4.** Saves: subtract **AP** from the roll; a **Ward** save ignores AP and can be tried if the normal save fails.',
    seq5: "**5.** Damage ≥ the model's Wounds removes it; excess does not carry over.",
    seq6: '**6.** Below half strength (or losing a model while already below) → Leadership test or 2 tokens & Fleeing.',
    woundTitle: 'Strength vs Toughness', coverTitle: 'Cover',
    cover1: '**Light —** +1 Armour Save.', cover2: '**Heavy —** +2 Armour Save.',
    cover3: 'Both also give the attacker **−1 to hit** and **−1 AT** (min 0).',
    notes: '**Notes:** cover needs **50%+** of the unit in it, only one type at a time, and none if both sides share the same terrain · **Obscuring** terrain/units give only **−1 to hit** (no save/AP benefit) · the **Take Cover** reaction gives +1 save & −1 AT vs ranged · **6+ hits** from non-Suppression weapons force a Morale test (see the Morale card).',
  },
  de: {
    title: 'FERNKAMPF', subtitle: 'Fernkampf · Deckung',
    seqTitle: 'Ablauf des Fernkampfs',
    seq1: '**1.** Ziele wählen: mindestens ein Modell muss sichtbar & in Reichweite sein; ein Modell feuert entweder alle Waffen seines Datasheets ODER eine Armoury-Waffe. Einheiten im Nahkampf können nicht angegriffen werden.',
    seq2: '**2.** Trefferwürfe = laut Waffentyp (Rapid Fire 1 = 1, Assault 2 = 2 …); Treffer bei **≥ BS**.',
    seq3: '**3.** Verwunden: **S vs. T** (Tabelle).',
    seq4: '**4.** Rettungswürfe: **AP** wird vom Wurf abgezogen; ein **Ward**-Save ignoriert AP und darf versucht werden, wenn der normale Save misslingt.',
    seq5: '**5.** Damage ≥ die Wounds des Modells entfernt es; überschüssiger Schaden geht nicht auf andere Modelle über.',
    seq6: '**6.** Unter halber Stärke (oder ein weiteres Modell verloren, während bereits darunter) → Leadership-Test oder 2 Marker & Fleeing.',
    woundTitle: 'Strength vs Toughness', coverTitle: 'Deckung',
    cover1: '**Leicht —** +1 Armour Save.', cover2: '**Schwer —** +2 Armour Save.',
    cover3: 'Beide geben dem Angreifer außerdem **−1 auf den Trefferwurf** und **−1 AT** (min. 0).',
    notes: '**Hinweise:** Cover braucht **50%+** der Einheit darin, nur eine Art gleichzeitig, und keins, wenn beide Seiten dasselbe Gelände teilen · **Obscuring**-Gelände/-Einheiten geben nur **−1 auf den Trefferwurf** (kein Save-/AP-Bonus) · die **Take Cover**-Reaktion gibt +1 Save & −1 AT gegen Fernkampf · **6+ Treffer** von Waffen ohne Suppression erzwingen einen Morale-Test (siehe die Morale-Karte).',
  },
  es: {
    title: 'DISPARO', subtitle: 'Combate a Distancia · Cobertura',
    seqTitle: 'Secuencia de disparo',
    seq1: '**1.** Elegir objetivos: al menos un modelo visible y al alcance; un modelo dispara todas sus armas del datasheet O una sola arma de la armoury. No se puede elegir como objetivo una unidad trabada en combate cuerpo a cuerpo.',
    seq2: '**2.** Tiradas para impactar = según el tipo de arma (Rapid Fire 1 = 1, Assault 2 = 2…); impacta con **≥ BS**.',
    seq3: '**3.** Herir: **S vs T** (tabla).',
    seq4: '**4.** Salvaciones: se resta el **AP** a la tirada; una salvación **Ward** ignora el AP y puede intentarse si falla la salvación normal.',
    seq5: '**5.** Damage ≥ los Wounds del modelo lo retira; el exceso no pasa a otros modelos.',
    seq6: '**6.** Por debajo de la mitad de la fuerza (o perder un modelo estando ya por debajo) → test de Leadership o 2 tokens y Fleeing.',
    woundTitle: 'Strength vs Toughness', coverTitle: 'Cobertura',
    cover1: '**Ligera —** +1 Armour Save.', cover2: '**Pesada —** +2 Armour Save.',
    cover3: 'Ambas además dan al atacante **−1 para impactar** y **−1 AT** (mín. 0).',
    notes: '**Notas:** la cobertura necesita **50%+** de la unidad dentro, solo un tipo a la vez, y ninguna si ambos bandos comparten el mismo terreno · el terreno/unidades **Obscuring** solo dan **−1 para impactar** (sin bono de salvación/AP) · la reacción **Take Cover** da +1 a la salvación y −1 AT contra disparo · **6+ impactos** de armas sin Suppression fuerzan un test de Moral (ver la carta de Morale).',
  },
};

function RangedSheet({ lang }: { lang: Language }) {
  const T = RANGED_TEXT[lang];
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
      }}>{T.title}</div>
      <div style={{
        textAlign: 'center', fontSize: '0.72rem', textTransform: 'uppercase',
        letterSpacing: '0.18em', color: MUTED, marginBottom: 18,
      }}>{T.subtitle}</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px 28px' }}>
        <div>
          <SectionTitle>{T.seqTitle}</SectionTitle>
          <Line text={T.seq1} />
          <Line text={T.seq2} />
          <Line text={T.seq3} />
          <Line text={T.seq4} />
          <Line text={T.seq5} />
          <Line text={T.seq6} />
        </div>

        <div>
          <SectionTitle>{T.woundTitle}</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '2px 14px', marginBottom: 12, fontSize: '0.9rem' }}>
            {woundTable.map(([cond, roll]) => (
              <Fragment key={cond}>
                <div style={{ color: INK }}>{cond}</div>
                <div style={{ color: ACCENT, fontWeight: 700, textAlign: 'right' }}>{roll}</div>
              </Fragment>
            ))}
          </div>
          <SectionTitle>{T.coverTitle}</SectionTitle>
          <Line text={T.cover1} />
          <Line text={T.cover2} />
          <Line text={T.cover3} />
        </div>
      </div>

      <div style={{
        marginTop: 16, borderTop: `1px solid ${ACCENT}55`, paddingTop: 10,
        fontSize: '0.82rem', lineHeight: 1.5, color: '#3a332e',
      }}>
        <B text={T.notes} />
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// MELEE
// ─────────────────────────────────────────────────────────────────────────

interface MeleeText {
  title: string; subtitle: string;
  chargeTitle: string; charge1: string; charge2: string; charge3: string;
  fightTitle: string; fight1: string; fight2: string; fight3: string; fight4: string; fight5: string; fight6: string;
  resultTitle: string; cr1: string; cr2: string; cr3: string; cr4: string; crNote: string;
  afterTitle: string; ac1: string; ac2: string; ac3: string; ac4: string;
  notes: string;
}

const MELEE_TEXT: Record<Language, MeleeText> = {
  en: {
    title: 'MELEE COMBAT', subtitle: 'Charge · Fight · Combat Result',
    chargeTitle: 'Charge order',
    charge1: 'First a **normal move** (up to Movement, max 12"); then declare Charge targets you can see and make a further **up-to-6" move** in a straight line into base contact.',
    charge2: 'Pick one Charge bonus for all models: **+1 Attack** or **+1 Initiative**.',
    charge3: '**Target may react —** Defensive Fire, Hold Your Ground (negates the charge bonus if ≥50% of charged units use it), or Counter-Attack.',
    fightTitle: 'Fight sequence',
    fight1: '**1.** Defender moves up to 6" into base contact (characters first).',
    fight2: '**2.** Act by **Initiative**, highest first; ties strike simultaneously (a slain model still hits back).',
    fight3: '**3.** In range = base contact, or within 1" of a friendly model in base contact.',
    fight4: '**4.** Attacks = the **A** stat, split across melee weapons; hit on **≥ WS**. No melee weapon → S, AP 0, D 1.',
    fight5: "**5.** Wound with the weapon's S (U = current S, or +x); same S-vs-T table as shooting.",
    fight6: '**6.** Saves as shooting; already-wounded and out-of-contact models are removed first.',
    resultTitle: 'Combat result (score points)',
    cr1: '**+1** to the side with more **Wounds remaining**.',
    cr2: '**+1** per **Wound lost caused** (only actual losses; excess damage ignored).',
    cr3: '**+1** per **penetrating hit**.',
    cr4: 'Apply unit modifiers. **Higher total wins.**',
    crNote: "A vehicle's Hull Points count as 5 Wounds each.",
    afterTitle: 'After combat',
    ac1: '**Winner —** if no enemy stays in base contact, **consolidate up to 3"**.',
    ac2: '**Loser —** Leadership test at **−(result difference)**; fail → 2 Battleshock tokens & Fleeing.',
    ac3: '**Pass —** melee ends; both sides pile in up to 6".',
    ac4: '**Pursue —** D6 + highest I each; pursuer ≥ fleeing → 1 auto hit per model, remove 1 token. Once per round.',
    notes: '**Melee notes:** a model with a **pistol + a melee weapon** gets **+1 Attack** in melee · Strength **7+** gives all melee attacks **AT(1)** (unless already better) · firing weapons during a Charge order is at **−1 to hit**.',
  },
  de: {
    title: 'NAHKAMPF', subtitle: 'Charge · Fight · Kampfergebnis',
    chargeTitle: 'Charge-Befehl',
    charge1: 'Zuerst eine **normale Bewegung** (bis Movement, max. 12"); dann sichtbare Charge-Ziele erklären und eine weitere **Bewegung von bis zu 6"** in gerader Linie bis zum Base Contact machen.',
    charge2: 'Ein Charge-Bonus für alle Modelle wählen: **+1 Attack** oder **+1 Initiative**.',
    charge3: '**Das Ziel darf reagieren —** Defensive Fire, Hold Your Ground (hebt den Charge-Bonus auf, wenn ≥50% der angegriffenen Einheiten es nutzen), oder Counter-Attack.',
    fightTitle: 'Ablauf des Fight',
    fight1: '**1.** Der Verteidiger bewegt sich bis zu 6" in Base Contact (Charaktere zuerst).',
    fight2: '**2.** Handeln nach **Initiative**, höchste zuerst; bei Gleichstand wird gleichzeitig zugeschlagen (ein getötetes Modell schlägt trotzdem noch zurück).',
    fight3: '**3.** In Reichweite = Base Contact, oder innerhalb 1" eines befreundeten Modells im Base Contact.',
    fight4: '**4.** Attacks = der **A**-Wert, aufgeteilt auf die Nahkampfwaffen; Treffer bei **≥ WS**. Keine Nahkampfwaffe → S, AP 0, D 1.',
    fight5: '**5.** Verwunden mit der S der Waffe (U = aktuelle S, oder +x); dieselbe S-vs-T-Tabelle wie beim Fernkampf.',
    fight6: '**6.** Rettungswürfe wie im Fernkampf; bereits verwundete und nicht im Kontakt stehende Modelle werden zuerst entfernt.',
    resultTitle: 'Kampfergebnis (Punkte)',
    cr1: '**+1** für die Seite mit mehr **verbleibenden Wounds**.',
    cr2: '**+1** pro **verursachtem Wound-Verlust** (nur tatsächliche Verluste; überschüssiger Schaden zählt nicht).',
    cr3: '**+1** pro **Penetrating Hit**.',
    cr4: 'Einheiten-Modifikatoren anwenden. **Die höhere Gesamtsumme gewinnt.**',
    crNote: 'Die Hull Points eines Vehicles zählen jeweils als 5 Wounds.',
    afterTitle: 'Nach dem Kampf',
    ac1: '**Sieger —** bleibt kein Gegner im Base Contact, **Consolidate um bis zu 3"**.',
    ac2: '**Verlierer —** Leadership-Test mit **−(Ergebnisunterschied)**; Fehlschlag → 2 Battleshock-Marker & Fleeing.',
    ac3: '**Bestanden —** der Nahkampf endet; beide Seiten machen Pile In um bis zu 6".',
    ac4: '**Verfolgen —** je D6 + höchste I; Verfolger ≥ Fliehender → 1 automatischer Treffer pro Modell, 1 Marker wird entfernt. Einmal pro Runde.',
    notes: '**Nahkampf-Hinweise:** ein Modell mit **Pistol + einer Nahkampfwaffe** erhält **+1 Attack** im Nahkampf · Strength **7+** gibt allen Nahkampfangriffen **AT(1)** (sofern nicht bereits besser) · das Abfeuern von Waffen während eines Charge-Befehls erfolgt mit **−1 auf den Trefferwurf**.',
  },
  es: {
    title: 'COMBATE CUERPO A CUERPO', subtitle: 'Charge · Fight · Resultado de Combate',
    chargeTitle: 'Orden Charge',
    charge1: 'Primero un **movimiento normal** (hasta Movement, máx. 12"); luego declarar objetivos de Charge visibles y hacer un **movimiento adicional de hasta 6"** en línea recta hasta el base contact.',
    charge2: 'Elegir un bono de Charge para todos los modelos: **+1 Attack** o **+1 Initiative**.',
    charge3: '**El objetivo puede reaccionar —** Defensive Fire, Hold Your Ground (anula el bono de Charge si ≥50% de las unidades cargadas lo usan), o Counter-Attack.',
    fightTitle: 'Secuencia de Fight',
    fight1: '**1.** El defensor se mueve hasta 6" hasta el base contact (los personajes primero).',
    fight2: '**2.** Se actúa por **Initiative**, la más alta primero; en caso de empate se golpea simultáneamente (un modelo muerto igual devuelve el golpe).',
    fight3: '**3.** Al alcance = base contact, o a menos de 1" de un modelo amigo en base contact.',
    fight4: '**4.** Attacks = el valor de **A**, repartido entre las armas de melee; impacta con **≥ WS**. Sin arma de melee → S, AP 0, D 1.',
    fight5: '**5.** Herir con la S del arma (U = S actual, o +x); la misma tabla S contra T que en el disparo.',
    fight6: '**6.** Salvaciones como en el disparo; se retiran primero los modelos ya heridos y los que no están en contacto.',
    resultTitle: 'Resultado de combate (puntos)',
    cr1: '**+1** para el bando con más **Wounds restantes**.',
    cr2: '**+1** por cada **Wound perdido causado** (solo pérdidas reales; el daño sobrante no cuenta).',
    cr3: '**+1** por cada **penetrating hit**.',
    cr4: 'Aplicar los modificadores de la unidad. **Gana el total más alto.**',
    crNote: 'Los Hull Points de un Vehicle cuentan como 5 Wounds cada uno.',
    afterTitle: 'Tras el combate',
    ac1: '**Ganador —** si no queda ningún enemigo en base contact, **consolidate hasta 3"**.',
    ac2: '**Perdedor —** test de Leadership con **−(diferencia de resultado)**; si falla → 2 tokens de Battleshock y Fleeing.',
    ac3: '**Superado —** el combate termina; ambos bandos hacen pile in hasta 6".',
    ac4: '**Perseguir —** D6 + I más alta cada uno; perseguidor ≥ el que huye → 1 impacto automático por modelo, se retira 1 token. Una vez por ronda.',
    notes: '**Notas de melee:** un modelo con **pistol + un arma de melee** obtiene **+1 Attack** en combate cuerpo a cuerpo · Strength **7+** da a todos los ataques de melee **AT(1)** (salvo que ya sea mejor) · disparar armas durante una orden de Charge es con **−1 para impactar**.',
  },
};

function MeleeSheet({ lang }: { lang: Language }) {
  const T = MELEE_TEXT[lang];
  return (
    <Card>
      <div style={{
        textAlign: 'center', fontFamily: 'Cinzel, Georgia, serif', fontWeight: 700,
        fontSize: '2rem', letterSpacing: '0.22em', color: ACCENT, marginBottom: 2,
      }}>{T.title}</div>
      <div style={{
        textAlign: 'center', fontSize: '0.72rem', textTransform: 'uppercase',
        letterSpacing: '0.18em', color: MUTED, marginBottom: 18,
      }}>{T.subtitle}</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px 28px' }}>
        <div>
          <SectionTitle>{T.chargeTitle}</SectionTitle>
          <Line text={T.charge1} />
          <Line text={T.charge2} />
          <Line text={T.charge3} />
        </div>

        <div>
          <SectionTitle>{T.fightTitle}</SectionTitle>
          <Line text={T.fight1} />
          <Line text={T.fight2} />
          <Line text={T.fight3} />
          <Line text={T.fight4} />
          <Line text={T.fight5} />
          <Line text={T.fight6} />
        </div>

        <div>
          <SectionTitle>{T.resultTitle}</SectionTitle>
          <Line text={T.cr1} />
          <Line text={T.cr2} />
          <Line text={T.cr3} />
          <Line text={T.cr4} />
          <div style={{ fontSize: '0.78rem', color: MUTED, marginTop: 6, fontStyle: 'italic', paddingLeft: 14 }}>
            {T.crNote}
          </div>
        </div>

        <div>
          <SectionTitle>{T.afterTitle}</SectionTitle>
          <Line text={T.ac1} />
          <Line text={T.ac2} />
          <Line text={T.ac3} />
          <Line text={T.ac4} />
        </div>
      </div>

      <div style={{
        marginTop: 16, borderTop: `1px solid ${ACCENT}55`, paddingTop: 10,
        fontSize: '0.82rem', lineHeight: 1.5, color: '#3a332e',
      }}>
        <B text={T.notes} />
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// PSYCHIC POWERS
// ─────────────────────────────────────────────────────────────────────────

interface PsychicText {
  title: string; subtitle: string;
  manifestTitle: string; man1: string; man2: string; man3: string; man4: string; man5: string;
  dispelTitle: string; dis1: string; dis2: string; dis3: string;
  perilsTitle: string; perils: [string, string, string][];
  notes: string;
}

const PSYCHIC_TEXT: Record<Language, PsychicText> = {
  en: {
    title: 'PSYCHIC POWERS', subtitle: 'Manifest · Dispel · Perils of the Warp',
    manifestTitle: 'Manifesting',
    man1: 'Only models with the **Psyker** rule. Line of sight is needed unless stated.',
    man2: "**Test —** roll **2D6 ≥ the power's cast value**.",
    man3: '**Repeat —** casting the same power again this turn is at a cumulative **−1**.',
    man4: '**Overchannel —** add a die (3D6); any **double** = **1D3 Mortal Wounds** (plus any Perils).',
    man5: "Known powers are on the profile — General Disciplines + your Codex's.",
    dispelTitle: 'Dispel & targets',
    dis1: '**Dispel —** an enemy psyker within **24"** rolls **2D6, must beat the cast result**. Dispelled = no effect (still counts as manifested for Force weapons).',
    dis2: '**In melee —** psykers in melee cast only **Basic** powers (Initiative phase); targets = self or units in that same melee.',
    dis3: '**Targets —** Self · Friendly unit (or the caster + attached) · Enemy unit (incl. attached characters).',
    perilsTitle: 'Perils of the Warp — on a double 1 or double 6, roll D6',
    perils: [
      ['1', 'Sucked into the Warp', 'Ld test: pass = 1 Mortal Wound; fail = psyker removed.'],
      ['2', 'Mindsteal', '1 MW; that power can no longer be used for the rest of the game.'],
      ['3', 'Power Drain', '1 MW; roll 1D3 — both players −that to all psychic tests this round (cumulative).'],
      ['4', 'Psionic Feedback', '1 MW.'],
      ['5', 'Empyrian Aftermath', 'Ld test: fail = 1 MW.'],
      ['6', 'Warp Boost', 'Ld test: pass = +1 to hit & +1 to wound until end of next activation; fail = 1 MW.'],
    ],
    notes: '**Notes:** use **Leadership 10** for Perils tests · **Brotherhood of Psykers** (2+ such models) gives **+1 to all cast and dispel rolls**.',
  },
  de: {
    title: 'PSIONISCHE KRÄFTE', subtitle: 'Manifest · Dispel · Perils of the Warp',
    manifestTitle: 'Manifestieren',
    man1: 'Nur Modelle mit der Regel **Psyker**. Sichtlinie ist erforderlich, sofern nicht anders angegeben.',
    man2: '**Test —** **2D6 ≥ dem Cast-Wert der Kraft** würfeln.',
    man3: '**Wiederholung —** dieselbe Kraft in diesem Zug erneut zu wirken erfolgt mit kumulativem **−1**.',
    man4: '**Overchannel —** ein weiterer Würfel (3D6); jeder **Pasch** = **1D3 Mortal Wounds** (plus eventuelle Perils).',
    man5: 'Bekannte Kräfte stehen im Profil — General Disciplines + die des eigenen Codex.',
    dispelTitle: 'Dispel & Ziele',
    dis1: '**Dispel —** ein gegnerischer Psyker innerhalb von **24"** würfelt **2D6 und muss das Cast-Ergebnis übertreffen**. Dispelled = keine Wirkung (zählt für Force weapons trotzdem als manifestiert).',
    dis2: '**Im Nahkampf —** Psyker im Nahkampf wirken nur **Basic**-Kräfte (Initiative-Phase); Ziele = sich selbst oder Einheiten in demselben Nahkampf.',
    dis3: '**Ziele —** sich selbst · befreundete Einheit (oder der Wirker + angeschlossen) · gegnerische Einheit (inkl. angeschlossener Charaktere).',
    perilsTitle: 'Perils of the Warp — bei einem Pasch aus 1en oder 6en, D6 würfeln',
    perils: [
      ['1', 'In den Warp gesogen', 'Ld-Test: bestanden = 1 Mortal Wound; fehlgeschlagen = Psyker wird entfernt.'],
      ['2', 'Gedankenraub', '1 MW; diese Kraft kann für den Rest des Spiels nicht mehr genutzt werden.'],
      ['3', 'Kraftentzug', '1 MW; 1D3 würfeln — beide Spieler erhalten diese Runde −diesen Wert auf alle psionischen Tests (kumulativ).'],
      ['4', 'Psionischer Rückschlag', '1 MW.'],
      ['5', 'Empyrisches Nachbeben', 'Ld-Test: fehlgeschlagen = 1 MW.'],
      ['6', 'Warp-Schub', 'Ld-Test: bestanden = +1 auf Treffer- & Verwundungswürfe bis zum Ende der nächsten Aktivierung; fehlgeschlagen = 1 MW.'],
    ],
    notes: '**Hinweise:** für Perils-Tests wird **Leadership 10** verwendet · **Brotherhood of Psykers** (2+ solche Modelle) gibt **+1 auf alle Cast- und Dispel-Würfe**.',
  },
  es: {
    title: 'PODERES PSÍQUICOS', subtitle: 'Manifest · Dispel · Perils of the Warp',
    manifestTitle: 'Manifestar',
    man1: 'Solo modelos con la regla **Psyker**. Se necesita línea de visión salvo que se indique lo contrario.',
    man2: '**Test —** tirar **2D6 ≥ el valor de cast del poder**.',
    man3: '**Repetición —** volver a lanzar el mismo poder este turno lleva un **−1** acumulativo.',
    man4: '**Overchannel —** se añade un dado (3D6); cualquier **par igual** = **1D3 Mortal Wounds** (más cualquier Perils).',
    man5: 'Los poderes conocidos están en el perfil — General Disciplines + los de tu Codex.',
    dispelTitle: 'Dispel y objetivos',
    dis1: '**Dispel —** un psyker enemigo a **24"** o menos tira **2D6 y debe superar el resultado de cast**. Dispelled = sin efecto (aun así cuenta como manifestado para las Force weapons).',
    dis2: '**En combate cuerpo a cuerpo —** los psykers en melee solo lanzan poderes **Basic** (fase de Initiative); objetivos = ellos mismos o unidades en ese mismo combate.',
    dis3: '**Objetivos —** él mismo · unidad amiga (o el lanzador + unido) · unidad enemiga (incl. personajes unidos).',
    perilsTitle: 'Perils of the Warp — con un doble 1 o doble 6, tira D6',
    perils: [
      ['1', 'Absorbido por el Warp', 'Test de Ld: superado = 1 Mortal Wound; fallado = se retira el psyker.'],
      ['2', 'Robo Mental', '1 MW; ese poder no puede volver a usarse en el resto de la partida.'],
      ['3', 'Drenaje de Poder', '1 MW; tira 1D3 — ambos jugadores reciben ese −valor a todos los tests psíquicos esta ronda (acumulativo).'],
      ['4', 'Retroalimentación Psiónica', '1 MW.'],
      ['5', 'Secuela Empírea', 'Test de Ld: fallado = 1 MW.'],
      ['6', 'Impulso del Warp', 'Test de Ld: superado = +1 para impactar y +1 para herir hasta el final de la próxima activación; fallado = 1 MW.'],
    ],
    notes: '**Notas:** para los tests de Perils se usa **Leadership 10** · **Brotherhood of Psykers** (2+ de esos modelos) da **+1 a todas las tiradas de cast y dispel**.',
  },
};

function PsychicSheet({ lang }: { lang: Language }) {
  const T = PSYCHIC_TEXT[lang];
  return (
    <Card>
      <div style={{
        textAlign: 'center', fontFamily: 'Cinzel, Georgia, serif', fontWeight: 700,
        fontSize: '2rem', letterSpacing: '0.18em', color: ACCENT, marginBottom: 2,
      }}>{T.title}</div>
      <div style={{
        textAlign: 'center', fontSize: '0.72rem', textTransform: 'uppercase',
        letterSpacing: '0.18em', color: MUTED, marginBottom: 18,
      }}>{T.subtitle}</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px 28px' }}>
        <div>
          <SectionTitle>{T.manifestTitle}</SectionTitle>
          <Line text={T.man1} />
          <Line text={T.man2} />
          <Line text={T.man3} />
          <Line text={T.man4} />
          <Line text={T.man5} />
        </div>

        <div>
          <SectionTitle>{T.dispelTitle}</SectionTitle>
          <Line text={T.dis1} />
          <Line text={T.dis2} />
          <Line text={T.dis3} />
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <SectionTitle>{T.perilsTitle}</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 24px' }}>
          {T.perils.map(([n, name, eff]) => (
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
        <B text={T.notes} />
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// ORDERS
// ─────────────────────────────────────────────────────────────────────────

interface OrderEntry { name: string; prerequisite: string | null; effect: string[]; }

const COMMAND_ORDERS: Record<Language, OrderEntry[]> = {
  en: [
    {
      name: 'Advance',
      prerequisite: 'The unit is not engaged in melee combat.',
      effect: [
        'It may move up to its Movement value.',
        'It may make a further, up to 1D6" Advance move.',
        'It must stay at least 1" from enemy models.',
        'It may declare any number of enemy units it can see as targets for ranged attacks.',
        'It may fire Assault, Pistol, or Grenade weapons with a –1 to hit penalty after moving.',
        'It may cast basic psychic powers and similar effects (incantations, prayers, …) during activation.',
      ],
    },
    {
      name: 'Charge',
      prerequisite: 'The unit is not engaged in melee combat.',
      effect: [
        'It may move up to its Movement value (but max 12").',
        'It may declare any number of enemy units it can see as targets for ranged attacks.',
        'It may fire Assault, Pistol, and Grenade weapons with a –1 to hit penalty after moving.',
        'It may declare any number of enemy units it can see as targets for a Charge move.',
        'It may make a further, up to 6" Charge move in a straight line, if it can get into direct base contact with any of these enemy units.',
        'It must select either +1 Attack or +1 Initiative for all models as a Charge bonus.',
        'It resolves the Fight order.',
        'It may cast basic psychic powers and similar effects (incantations, prayers, …) during activation.',
      ],
    },
    {
      name: 'Escape',
      prerequisite: 'The unit is already engaged in melee combat.',
      effect: [
        'It receives 1 automatic hit from each enemy model in attack range.',
        'It gains two Battleshock tokens and flees.',
      ],
    },
    {
      name: 'Fight',
      prerequisite: 'The unit is already engaged in melee combat.',
      effect: [
        'The melee is resolved as if all units involved had the Fight order.',
        'It may cast basic psychic powers and similar effects (incantations, prayers, …) during activation.',
        'It removes all orders from units participating in this melee.',
      ],
    },
    {
      name: 'Move & Shoot',
      prerequisite: 'The unit is not engaged in melee combat.',
      effect: [
        'It may move up to its Movement value.',
        'It may declare any number of enemy units it can see as targets for ranged attacks.',
        'It may fire any ranged weapon except Heavy types after moving.',
        'It may cast basic and normal psychic powers and similar effects (incantations, prayers, …) during activation.',
      ],
    },
    {
      name: 'Stand & Shoot',
      prerequisite: 'The unit is not engaged in melee combat.',
      effect: [
        'It may not move.',
        'It may declare any number of enemy units it can see as targets for ranged attacks.',
        'It may fire any ranged weapon, including Heavy types.',
        'It reduces the total hit penalty for ranged attacks by 1.',
        'It may cast all types of psychic powers and similar effects (incantations, prayers, …) during activation.',
      ],
    },
  ],
  de: [
    {
      name: 'Advance',
      prerequisite: 'Die Einheit ist nicht im Nahkampf gebunden.',
      effect: [
        'Sie darf sich bis zu ihrem Movement-Wert bewegen.',
        'Sie darf zusätzlich eine Advance-Bewegung von bis zu 1D6" machen.',
        'Sie muss mindestens 1" Abstand zu gegnerischen Modellen halten.',
        'Sie darf eine beliebige Anzahl sichtbarer gegnerischer Einheiten als Ziele für Fernkampfangriffe erklären.',
        'Sie darf nach der Bewegung Assault-, Pistol- oder Grenade-Waffen mit –1 auf den Trefferwurf abfeuern.',
        'Sie darf während ihrer Aktivierung Basic-psionische Kräfte und ähnliche Effekte (Beschwörungen, Gebete, …) wirken.',
      ],
    },
    {
      name: 'Charge',
      prerequisite: 'Die Einheit ist nicht im Nahkampf gebunden.',
      effect: [
        'Sie darf sich bis zu ihrem Movement-Wert bewegen (aber max. 12").',
        'Sie darf eine beliebige Anzahl sichtbarer gegnerischer Einheiten als Ziele für Fernkampfangriffe erklären.',
        'Sie darf nach der Bewegung Assault-, Pistol- und Grenade-Waffen mit –1 auf den Trefferwurf abfeuern.',
        'Sie darf eine beliebige Anzahl sichtbarer gegnerischer Einheiten als Ziele für eine Charge-Bewegung erklären.',
        'Sie darf zusätzlich eine Charge-Bewegung von bis zu 6" in gerader Linie machen, wenn sie dadurch direkten Base Contact mit einer dieser gegnerischen Einheiten erreichen kann.',
        'Sie muss für alle Modelle entweder +1 Attack oder +1 Initiative als Charge-Bonus wählen.',
        'Sie löst den Fight-Befehl auf.',
        'Sie darf während ihrer Aktivierung Basic-psionische Kräfte und ähnliche Effekte (Beschwörungen, Gebete, …) wirken.',
      ],
    },
    {
      name: 'Escape',
      prerequisite: 'Die Einheit ist bereits im Nahkampf gebunden.',
      effect: [
        'Sie erhält 1 automatischen Treffer von jedem gegnerischen Modell in Angriffsreichweite.',
        'Sie erhält zwei Battleshock-Marker und flieht.',
      ],
    },
    {
      name: 'Fight',
      prerequisite: 'Die Einheit ist bereits im Nahkampf gebunden.',
      effect: [
        'Der Nahkampf wird aufgelöst, als hätten alle beteiligten Einheiten den Fight-Befehl.',
        'Sie darf während ihrer Aktivierung Basic-psionische Kräfte und ähnliche Effekte (Beschwörungen, Gebete, …) wirken.',
        'Sie entfernt alle Befehle von den an diesem Nahkampf beteiligten Einheiten.',
      ],
    },
    {
      name: 'Move & Shoot',
      prerequisite: 'Die Einheit ist nicht im Nahkampf gebunden.',
      effect: [
        'Sie darf sich bis zu ihrem Movement-Wert bewegen.',
        'Sie darf eine beliebige Anzahl sichtbarer gegnerischer Einheiten als Ziele für Fernkampfangriffe erklären.',
        'Sie darf nach der Bewegung jede Fernkampfwaffe außer Heavy-Waffen abfeuern.',
        'Sie darf während ihrer Aktivierung Basic- und Normal-psionische Kräfte und ähnliche Effekte (Beschwörungen, Gebete, …) wirken.',
      ],
    },
    {
      name: 'Stand & Shoot',
      prerequisite: 'Die Einheit ist nicht im Nahkampf gebunden.',
      effect: [
        'Sie darf sich nicht bewegen.',
        'Sie darf eine beliebige Anzahl sichtbarer gegnerischer Einheiten als Ziele für Fernkampfangriffe erklären.',
        'Sie darf jede Fernkampfwaffe abfeuern, einschließlich Heavy-Waffen.',
        'Sie verringert den gesamten Trefferabzug für Fernkampfangriffe um 1.',
        'Sie darf während ihrer Aktivierung alle Arten von psionischen Kräften und ähnlichen Effekten (Beschwörungen, Gebete, …) wirken.',
      ],
    },
  ],
  es: [
    {
      name: 'Advance',
      prerequisite: 'La unidad no está trabada en combate cuerpo a cuerpo.',
      effect: [
        'Puede moverse hasta su valor de Movement.',
        'Puede hacer además un movimiento de Advance de hasta 1D6".',
        'Debe mantenerse a al menos 1" de los modelos enemigos.',
        'Puede declarar como objetivo de ataques a distancia a cualquier número de unidades enemigas que pueda ver.',
        'Puede disparar armas Assault, Pistol o Grenade con –1 para impactar tras moverse.',
        'Puede lanzar poderes psíquicos Basic y efectos similares (invocaciones, plegarias, …) durante su activación.',
      ],
    },
    {
      name: 'Charge',
      prerequisite: 'La unidad no está trabada en combate cuerpo a cuerpo.',
      effect: [
        'Puede moverse hasta su valor de Movement (pero máx. 12").',
        'Puede declarar como objetivo de ataques a distancia a cualquier número de unidades enemigas que pueda ver.',
        'Puede disparar armas Assault, Pistol y Grenade con –1 para impactar tras moverse.',
        'Puede declarar como objetivo de un movimiento de Charge a cualquier número de unidades enemigas que pueda ver.',
        'Puede hacer además un movimiento de Charge de hasta 6" en línea recta, si con ello puede entrar en base contact directo con alguna de esas unidades enemigas.',
        'Debe elegir +1 Attack o +1 Initiative para todos sus modelos como bono de Charge.',
        'Resuelve la orden Fight.',
        'Puede lanzar poderes psíquicos Basic y efectos similares (invocaciones, plegarias, …) durante su activación.',
      ],
    },
    {
      name: 'Escape',
      prerequisite: 'La unidad ya está trabada en combate cuerpo a cuerpo.',
      effect: [
        'Recibe 1 impacto automático de cada modelo enemigo dentro de su alcance de ataque.',
        'Gana dos tokens de Battleshock y huye (Fleeing).',
      ],
    },
    {
      name: 'Fight',
      prerequisite: 'La unidad ya está trabada en combate cuerpo a cuerpo.',
      effect: [
        'El combate se resuelve como si todas las unidades implicadas tuvieran la orden Fight.',
        'Puede lanzar poderes psíquicos Basic y efectos similares (invocaciones, plegarias, …) durante su activación.',
        'Elimina todas las órdenes de las unidades que participan en este combate.',
      ],
    },
    {
      name: 'Move & Shoot',
      prerequisite: 'La unidad no está trabada en combate cuerpo a cuerpo.',
      effect: [
        'Puede moverse hasta su valor de Movement.',
        'Puede declarar como objetivo de ataques a distancia a cualquier número de unidades enemigas que pueda ver.',
        'Puede disparar cualquier arma a distancia excepto las de tipo Heavy tras moverse.',
        'Puede lanzar poderes psíquicos Basic y Normal y efectos similares (invocaciones, plegarias, …) durante su activación.',
      ],
    },
    {
      name: 'Stand & Shoot',
      prerequisite: 'La unidad no está trabada en combate cuerpo a cuerpo.',
      effect: [
        'No puede moverse.',
        'Puede declarar como objetivo de ataques a distancia a cualquier número de unidades enemigas que pueda ver.',
        'Puede disparar cualquier arma a distancia, incluidas las de tipo Heavy.',
        'Reduce en 1 la penalización total para impactar en ataques a distancia.',
        'Puede lanzar cualquier tipo de poder psíquico y efectos similares (invocaciones, plegarias, …) durante su activación.',
      ],
    },
  ],
};

const META_ORDERS: Record<Language, OrderEntry[]> = {
  en: [
    {
      name: 'Counter-Attack',
      prerequisite: 'The unit has the Counter-Attack ability, is declared as a target for a charge move and after the charging unit has declared all charge targets.',
      effect: [
        'It is treated as having successfully executed a Charge order.',
        'It must choose a Charge bonus before the attacker does so and additionally gains effects from equipment or special rules triggered by a Charge.',
      ],
    },
    {
      name: 'Defensive Fire',
      prerequisite: 'The unit is declared as a target for a charge move and after the charging unit has declared all charge targets.',
      effect: [
        'It may fire ranged weapons at the attacking unit with a –1 to hit penalty.',
        'It may cast basic and normal psychic powers and similar effects (incantations, prayers, …) at the attacking unit or itself.',
        'The attacker automatically passes any Leadership test during Defensive Fire.',
      ],
    },
    {
      name: 'Hold Your Ground',
      prerequisite: 'The unit is declared as a target for a charge move and after the charging unit has declared all charge targets.',
      effect: [
        "It negates the attacker's Charge bonus.",
        'If multiple units are charged at the same time, at least 50% of them have to use Hold Your Ground in order to negate the attacker\'s Charge bonus.',
      ],
    },
    {
      name: 'Take Cover',
      prerequisite: 'The unit is selected as a target for a ranged attack, psychic power or similar effect (incantations, prayers, …) and after the shooting unit has declared all ranged targets.',
      effect: [
        "It gains a +1 bonus to Saving throws against ranged attacks until the enemy's activation ends.",
        'Ranged attacks against it reduce their AT by 1 (to a minimum of 0).',
      ],
    },
  ],
  de: [
    {
      name: 'Counter-Attack',
      prerequisite: 'Die Einheit hat die Counter-Attack-Fähigkeit, wird als Ziel einer Charge-Bewegung erklärt, und die angreifende Einheit hat bereits alle Charge-Ziele erklärt.',
      effect: [
        'Sie gilt, als hätte sie erfolgreich einen Charge-Befehl ausgeführt.',
        'Sie muss ihren Charge-Bonus wählen, bevor der Angreifer dies tut, und erhält zusätzlich Effekte von Ausrüstung oder Sonderregeln, die durch einen Charge ausgelöst werden.',
      ],
    },
    {
      name: 'Defensive Fire',
      prerequisite: 'Die Einheit wird als Ziel einer Charge-Bewegung erklärt, und die angreifende Einheit hat bereits alle Charge-Ziele erklärt.',
      effect: [
        'Sie darf mit –1 auf den Trefferwurf Fernkampfwaffen auf die angreifende Einheit abfeuern.',
        'Sie darf Basic- und Normal-psionische Kräfte und ähnliche Effekte (Beschwörungen, Gebete, …) auf die angreifende Einheit oder sich selbst wirken.',
        'Der Angreifer besteht während Defensive Fire automatisch jeden Leadership-Test.',
      ],
    },
    {
      name: 'Hold Your Ground',
      prerequisite: 'Die Einheit wird als Ziel einer Charge-Bewegung erklärt, und die angreifende Einheit hat bereits alle Charge-Ziele erklärt.',
      effect: [
        'Sie hebt den Charge-Bonus des Angreifers auf.',
        'Werden mehrere Einheiten gleichzeitig angegriffen, müssen mindestens 50% von ihnen Hold Your Ground nutzen, damit der Charge-Bonus des Angreifers aufgehoben wird.',
      ],
    },
    {
      name: 'Take Cover',
      prerequisite: 'Die Einheit wird als Ziel eines Fernkampfangriffs, einer psionischen Kraft oder eines ähnlichen Effekts (Beschwörungen, Gebete, …) ausgewählt, und die schießende Einheit hat bereits alle Fernkampfziele erklärt.',
      effect: [
        "Sie erhält bis zum Ende der gegnerischen Aktivierung einen +1-Bonus auf Rettungswürfe gegen Fernkampfangriffe.",
        'Fernkampfangriffe gegen sie verringern ihren AT-Wert um 1 (mindestens 0).',
      ],
    },
  ],
  es: [
    {
      name: 'Counter-Attack',
      prerequisite: 'La unidad tiene la habilidad Counter-Attack, es declarada objetivo de un movimiento de Charge, y la unidad que carga ya ha declarado todos sus objetivos de Charge.',
      effect: [
        'Se considera que ha ejecutado con éxito una orden de Charge.',
        'Debe elegir su bono de Charge antes que el atacante, y además obtiene los efectos de equipo o reglas especiales que se activan con un Charge.',
      ],
    },
    {
      name: 'Defensive Fire',
      prerequisite: 'La unidad es declarada objetivo de un movimiento de Charge, y la unidad que carga ya ha declarado todos sus objetivos de Charge.',
      effect: [
        'Puede disparar armas a distancia contra la unidad atacante con –1 para impactar.',
        'Puede lanzar poderes psíquicos Basic y Normal y efectos similares (invocaciones, plegarias, …) contra la unidad atacante o contra sí misma.',
        'El atacante supera automáticamente cualquier test de Leadership durante el Defensive Fire.',
      ],
    },
    {
      name: 'Hold Your Ground',
      prerequisite: 'La unidad es declarada objetivo de un movimiento de Charge, y la unidad que carga ya ha declarado todos sus objetivos de Charge.',
      effect: [
        'Anula el bono de Charge del atacante.',
        'Si varias unidades son cargadas al mismo tiempo, al menos el 50% de ellas debe usar Hold Your Ground para anular el bono de Charge del atacante.',
      ],
    },
    {
      name: 'Take Cover',
      prerequisite: 'La unidad es elegida como objetivo de un ataque a distancia, un poder psíquico o un efecto similar (invocaciones, plegarias, …), y la unidad que dispara ya ha declarado todos sus objetivos a distancia.',
      effect: [
        'Obtiene un bono de +1 a las salvaciones contra ataques a distancia hasta que termine la activación del enemigo.',
        'Los ataques a distancia contra ella reducen su AT en 1 (hasta un mínimo de 0).',
      ],
    },
  ],
};

interface OrdersUiText { title: string; subtitle: string; assignedTitle: string; metaTitle: string; notes: string; }

const ORDERS_UI_TEXT: Record<Language, OrdersUiText> = {
  en: {
    title: 'ORDERS', subtitle: 'Command Phase Orders · Meta Orders',
    assignedTitle: 'Assigned in the Command Phase — one per unit',
    metaTitle: 'Meta Orders — triggered, not assigned',
    notes: "**Notes:** a unit doesn't have to perform every part of its order (e.g. Move & Shoot may skip moving or shooting) · fewer orders than your opponent gives you **Skip tokens** (1 per 2 orders of difference, rounded up).",
  },
  de: {
    title: 'ORDERS', subtitle: 'Command Phase Orders · Meta Orders',
    assignedTitle: 'In der Command-Phase zugewiesen — eine pro Einheit',
    metaTitle: 'Meta Orders — ausgelöst, nicht zugewiesen',
    notes: '**Hinweise:** eine Einheit muss nicht jeden Teil ihres Befehls ausführen (z. B. kann Move & Shoot das Bewegen oder Schießen auslassen) · weniger Befehle als der Gegner geben **Skip-Marker** (1 pro 2 Befehle Unterschied, aufgerundet).',
  },
  es: {
    title: 'ORDERS', subtitle: 'Command Phase Orders · Meta Orders',
    assignedTitle: 'Asignadas en la Command Phase — una por unidad',
    metaTitle: 'Meta Orders — se activan, no se asignan',
    notes: '**Notas:** una unidad no tiene que ejecutar todas las partes de su orden (p. ej., Move & Shoot puede omitir moverse o disparar) · tener menos órdenes que el rival da **tokens de Skip** (1 por cada 2 órdenes de diferencia, redondeando hacia arriba).',
  },
};

/** One order's full canonical text (prerequisite + every effect bullet), reusing the SAME
 *  COMMAND_ORDERS/META_ORDERS data Print View's Officer Orders card sits next to — this sheet is
 *  the one place that text is actually meant to live (Rigzar: "las command phase orders solo
 *  deben aparecer en la cheat sheet"), so it's the canonical source, not a second hand-condensed
 *  copy that could drift from it. */
function OrderBlock({ o }: { o: OrderEntry }) {
  return (
    <div style={{ marginBottom: 8, breakInside: 'avoid' }}>
      <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>
        <span style={{ color: ACCENT }}>▸ </span>{o.name}
      </div>
      {o.prerequisite && (
        <div style={{ fontSize: '0.78rem', fontStyle: 'italic', color: MUTED, paddingLeft: 14, marginBottom: 1 }}>
          {o.prerequisite}
        </div>
      )}
      <ul style={{ margin: '1px 0 0', paddingLeft: 28, fontSize: '0.82rem', lineHeight: 1.35, color: INK }}>
        {o.effect.map((line, i) => <li key={i}>{line}</li>)}
      </ul>
    </div>
  );
}

function OrdersSheet({ lang }: { lang: Language }) {
  const T = ORDERS_UI_TEXT[lang];
  return (
    <Card>
      <div style={{
        textAlign: 'center', fontFamily: 'Cinzel, Georgia, serif', fontWeight: 700,
        fontSize: '2rem', letterSpacing: '0.22em', color: ACCENT, marginBottom: 2,
      }}>{T.title}</div>
      <div style={{
        textAlign: 'center', fontSize: '0.72rem', textTransform: 'uppercase',
        letterSpacing: '0.18em', color: MUTED, marginBottom: 18,
      }}>{T.subtitle}</div>

      <SectionTitle>{T.assignedTitle}</SectionTitle>
      {/* Multi-column (not grid): each order packs to its OWN height, so a short one (Escape) isn't
          stretched to match a tall row-partner (Charge) — a CSS grid's row height is the max of
          BOTH cells in that row, which left a big gap under Advance while it waited for Charge
          (its grid row-mate) to finish. Same fix as PrintView.tsx's Special Rules glossary. */}
      <div style={{ columnCount: 2, columnGap: 28, marginBottom: 10 }}>
        {COMMAND_ORDERS[lang].map(o => <OrderBlock key={o.name} o={o} />)}
      </div>

      <SectionTitle>{T.metaTitle}</SectionTitle>
      <div style={{ columnCount: 2, columnGap: 28 }}>
        {META_ORDERS[lang].map(o => <OrderBlock key={o.name} o={o} />)}
      </div>

      <div style={{
        marginTop: 16, borderTop: `1px solid ${ACCENT}55`, paddingTop: 10,
        fontSize: '0.82rem', lineHeight: 1.5, color: '#3a332e',
      }}>
        <B text={T.notes} />
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// COMMUNITY ORDER-CARD DOWNLOADS
// ─────────────────────────────────────────────────────────────────────────

const CREDIT_TEXT: Record<Language, string> = {
  en: 'High quality printable order cards by **Grimdark Gamers (Gregor)**',
  de: 'Hochwertige, ausdruckbare Befehlskarten von **Grimdark Gamers (Gregor)**',
  es: 'Cartas de órdenes imprimibles de alta calidad por **Grimdark Gamers (Gregor)**',
};

/**
 * Community print-and-play order cards — a physical, illustrated alternative to the text sheet
 * above (one card per order, themed per faction group: Chaos/Imperium/Xenos), by Grimdark Gamers
 * (Gregor). Screen-only (print:hidden): these are separate PDFs meant to be downloaded and
 * printed on card stock, not part of THIS sheet's own print/PDF output.
 */
function OrderCardsCredit({ lang }: { lang: Language }) {
  const decks: { key: string; label: string; icon: string; href: string }[] = [
    { key: 'chaos',    label: 'Chaos',    icon: '/category-icons/chaos.svg',    href: '/downloads/chaos-orders.pdf' },
    { key: 'imperium', label: 'Imperium', icon: '/category-icons/imperium.svg', href: '/downloads/imperial-orders.pdf' },
    { key: 'xenos',    label: 'Xenos',    icon: '/category-icons/xenos.svg',    href: '/downloads/xenos-orders.pdf' },
  ];
  return (
    <div className="print:hidden" style={{ maxWidth: 760, margin: '14px auto 0', textAlign: 'center' }}>
      <div style={{ fontSize: '0.78rem', color: MUTED, marginBottom: 8 }}>
        <B text={CREDIT_TEXT[lang]} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
        {decks.map(d => (
          <a key={d.key} href={d.href} target="_blank" rel="noopener noreferrer"
            className="relative faction-tilt border border-zinc-700 hover:border-amber-600 bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors"
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              const x = (e.clientX - r.left) / r.width - 0.5;
              const y = (e.clientY - r.top) / r.height - 0.5;
              e.currentTarget.style.setProperty('--tilt-x', `${y * -10}deg`);
              e.currentTarget.style.setProperty('--tilt-y', `${x * 10}deg`);
              e.currentTarget.style.setProperty('--shine-x', `${(x + 0.5) * 100}%`);
              e.currentTarget.style.setProperty('--shine-y', `${(y + 0.5) * 100}%`);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.setProperty('--tilt-x', '0deg');
              e.currentTarget.style.setProperty('--tilt-y', '0deg');
            }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textDecoration: 'none', padding: '10px 18px' }}>
            <img src={d.icon} alt="" aria-hidden="true" style={{ width: 40, height: 40, opacity: 0.9 }} />
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#e8a33d', fontWeight: 700 }}>
              {d.label}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// MODAL SHELL
// ─────────────────────────────────────────────────────────────────────────

const TOOLBAR_TEXT: Record<Language, { title: string; print: string; close: string }> = {
  en: { title: 'Field Manual · Quick Rules', print: 'Print / PDF', close: 'Close' },
  de: { title: 'Feldhandbuch · Schnellregeln', print: 'Drucken / PDF', close: 'Schließen' },
  es: { title: 'Manual de Campo · Reglas Rápidas', print: 'Imprimir / PDF', close: 'Cerrar' },
};

/** Every subsequent section starts on its own printed page, while still exporting as one file. */
function PageSection({ children }: { children: ReactNode }) {
  return <div style={{ pageBreakBefore: 'always', breakBefore: 'page' }}>{children}</div>;
}

export function CheatSheetModal({ onClose }: { onClose: () => void }) {
  const { language } = useLanguage();
  const T = TOOLBAR_TEXT[language];
  const [paperSize, setPaperSize] = usePaperSize();

  return createPortal((
    <div id="pv-root" className="fixed inset-0 z-50 overflow-y-auto" style={{ background: '#18171a' }}>
      {/* Toolbar */}
      <div className="print:hidden sticky top-0 z-10 bg-zinc-900 border-b border-zinc-700 px-4 py-2 flex items-center justify-between gap-4">
        <span className="text-amber-400 font-bold text-sm uppercase tracking-widest">
          {T.title}
        </span>
        <div className="flex items-center gap-2">
          <PaperSizeToggle size={paperSize} onChange={setPaperSize} />
          <button onClick={() => window.print()}
            className="px-4 py-1.5 bg-amber-800 hover:bg-amber-700 border border-amber-600 text-white text-sm uppercase tracking-wide transition-colors">
            {T.print}
          </button>
          <button onClick={onClose}
            className="px-4 py-1.5 bg-zinc-700 hover:bg-zinc-600 border border-zinc-600 text-zinc-200 text-sm uppercase tracking-wide transition-colors">
            {T.close}
          </button>
        </div>
      </div>

      <PaperSizeCss size={paperSize} />

      {/* Order-card downloads — screen-only, kept OUTSIDE the Quick Rules document below
          (Rigzar: "las ordenes printables djalas fuera"), but still one click away right here. */}
      <OrderCardsCredit lang={language} />

      {/* Printable area — the whole Quick Rules reference in one Print/PDF pass. */}
      <div id="pv-printable" className="px-4 py-8" style={{ background: '#fff', minHeight: '100vh' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <TurnSequenceSheet lang={language} />
          <PageSection><MoraleSheet lang={language} /></PageSection>
          <PageSection><RangedSheet lang={language} /></PageSection>
          <PageSection><MeleeSheet lang={language} /></PageSection>
          <PageSection><PsychicSheet lang={language} /></PageSection>
          <PageSection><OrdersSheet lang={language} /></PageSection>
        </div>
      </div>
    </div>
  ), document.body);
}
