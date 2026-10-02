import { Fragment } from 'react';
import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';
import { useLanguage, type Language } from '../i18n';
import { usePaperSize, PaperSizeCss, PaperSizeToggle } from './PaperSize';
import { useArmyStore } from '../store/army';
import { GENERAL_DISCIPLINES } from '../data/generalDisciplines';
import type { Power } from '../types/data';

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
 * REWRITTEN 2026-09-13 for Core Rules 1.262: Suppressive Fire stopped being two mechanics. There is
 * no longer a separate "one hit from a Suppression weapon forces a test" trigger, and the ability's
 * own -1 (Explosive) / -2 (Barrage) modifiers are gone with those two ability names. It is now one
 * threshold - 6+ ranged hits in the activation, -1 per further 6 - and Suppression(x) simply makes
 * each of its hits count as x toward it. A failure in the double-test case now gives 2 tokens even
 * if the unit already had one.
 * Re-verified 2026-08-24: the Charge order's full sequence (normal move up to M, max 12", THEN a separate 6" charge move)
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
    reinforcementIntro: 'You MAY roll a number of dice equal to the current battle round number.',
    colRound: 'Round', colDice: 'Dice', colAuto: 'Automatic',
    perDie: '**4+ per die —** one unit from reserve **must** enter, if it can.',
    transports: '**Transports —** the vehicle and its embarked unit count as one reserve; an attached character and its unit also roll just one die together.',
    arriving: '**Arriving units —** enter from your own board edge and may only be given an Advance or Move & Shoot order that Command Phase, entering **during their activation**.',
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
    reinforcementIntro: 'Du DARFST so viele Würfel werfen, wie die aktuelle Kampfrundennummer angibt.',
    colRound: 'Runde', colDice: 'Würfel', colAuto: 'Automatisch',
    perDie: '**4+ pro Würfel —** eine Einheit aus der Reserve **muss** eintreffen, sofern möglich.',
    transports: '**Transporter —** das Fahrzeug und die eingeschiffte Einheit zählen als eine Reserve; ein angeschlossener Charakter und seine Einheit würfeln ebenfalls nur einen gemeinsamen Würfel.',
    arriving: '**Ankommende Einheiten —** betreten das Feld von der eigenen Tischkante und können in dieser Command-Phase nur einen Advance- oder Move & Shoot-Befehl erhalten und betreten das Feld **während ihrer Aktivierung**.',
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
    reinforcementIntro: 'PUEDES tirar tantos dados como el número de la ronda de batalla actual.',
    colRound: 'Ronda', colDice: 'Dados', colAuto: 'Automático',
    perDie: '**4+ por dado —** una unidad de la reserva **debe** entrar, si puede.',
    transports: '**Transportes —** el vehículo y su unidad embarcada cuentan como una sola reserva; un personaje unido a una unidad también tira un solo dado junto con ella.',
    arriving: '**Unidades que llegan —** entran desde tu propio borde de mesa y esa Command Phase solo pueden recibir una orden de Advance o Move & Shoot, y entran **durante su activación**.',
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
  ru: {
    title: 'ПОСЛЕДОВАТЕЛЬНОСТЬ ХОДА', subtitle: 'Раунд боя · Подкрепления · Движение',
    phasesTitle: 'Раунд боя — 5 фаз по порядку',
    phases: [
      ['1. Rally', 'Проведите проверку Leadership для каждого отряда с жетоном Battleshock.'],
      ['2. Reinforcement', 'Отряды в резерве пытаются выйти на поле боя.'],
      ['3. Command', 'Оба игрока назначают приказы всем отрядам, кладя их лицом вниз.'],
      ['4. Initiative', 'Бросок на то, кто активирует первый отряд в этом раунде боя.'],
      ['5. Action', 'Игроки по очереди активируют отряды и выполняют назначенные им приказы.'],
    ],
    reinforcementTitle: 'Фаза Reinforcement',
    reinforcementIntro: 'Вы МОЖЕТЕ бросить столько кубиков, каков номер текущего раунда боя.',
    colRound: 'Раунд', colDice: 'Кубики', colAuto: 'Автоматически',
    perDie: '**4+ на кубик —** один отряд из резерва **должен** выйти, если может.',
    transports: '**Транспорт —** машина и посаженный в неё отряд считаются одним резервом; присоединённый персонаж и его отряд тоже бросают один общий кубик.',
    arriving: '**Прибывающие отряды —** входят со своего края стола и в эту Command Phase могут получить только приказ Advance или Move & Shoot, входя на поле **во время своей активации**.',
    above2500: '**Свыше 2500 очк. —** кубики, указанные для раунда, бросаются ещё раз за каждые дополнительные 2500 очков размера игры.',
    initiativeTitle: 'Фаза Initiative',
    initiativeRoll: 'Оба игрока бросают **2D6**; больший результат получает инициативу и активирует первый отряд в Action Phase.',
    tie: '**Ничья —** достаётся игроку, у которого **не** было инициативы в прошлом раунде.',
    round1tie: '**Ничья в раунде 1 —** достаётся игроку, который первым закончил расстановку отрядов.',
    movementTitle: 'Движение',
    horizontal: '**По горизонтали —** до значения Movement отряда, измеряется от подставки модели (техника: от нижней точки корпуса).',
    vertical: '**По вертикали —** 3" на этаж/уровень здания или перепад местности (скалы, стены, склоны, лестницы).',
    formation: '**Построение —** ни одна модель не может закончить движение дальше чем в 2" (гор.) / 5" (верт.) от другой модели того же отряда — не требуется, пока отряд связан боем.',
    enemyDistance: '**Дистанция до врага —** всегда держитесь минимум в 1" от вражеских моделей.',
    throughUnits: '**Сквозь другие отряды —** Creatures могут проходить сквозь дружественные модели; Vehicles нужно обходить.',
    mixedUnits: '**Смешанные отряды —** весь отряд использует ограничения движения своей самой ограниченной модели (напр., персонаж в терминаторской броне, присоединившийся к Infantry, не даёт отряду делать Advance или преследовать в ближнем бою).',
    notes: '**Примечания:** если у обоих игроков есть отряды в резерве, первым бросает на Reinforcement игрок, выигравший бросок на выбор зон расстановки · 6 приказов Command Phase и 4 мета-приказа смотрите на листе **Orders**, а розыгрыш атак — на листах **Shooting**/**Melee**.',
  },
  ja: {
    title: 'ターンの流れ', subtitle: 'バトルラウンド · 増援 · 移動',
    phasesTitle: 'バトルラウンド — 5つのフェイズ（順番どおり）',
    phases: [
      ['1. Rally', 'Battleshock トークンを持つ各部隊は Leadership テストを行う。'],
      ['2. Reinforcement', '予備に置かれた部隊が戦場への進入を試みる。'],
      ['3. Command', '両プレイヤーが全部隊に命令を伏せて割り当てる。'],
      ['4. Initiative', 'このバトルラウンドで最初に部隊を起動する側をロールで決める。'],
      ['5. Action', 'プレイヤーが交互に部隊を起動し、割り当てられた命令を解決する。'],
    ],
    reinforcementTitle: 'Reinforcement フェイズ',
    reinforcementIntro: '現在のバトルラウンド数と同じ数のダイスを振ることが「できる」。',
    colRound: 'ラウンド', colDice: 'ダイス', colAuto: '自動',
    perDie: '**ダイス1個につき4+ —** 予備の部隊1つが、可能であれば進入**しなければならない**。',
    transports: '**輸送 —** 車両と搭乗中の部隊は1つの予備として数える。合流したキャラクターとその部隊も、合わせて1個のダイスを振る。',
    arriving: '**到着する部隊 —** 自軍のテーブル端から進入し、その Command Phase には Advance または Move & Shoot の命令のみ与えられ、**起動中に**進入する。',
    above2500: '**2500pts超 —** ゲーム規模が2500ポイント増えるごとに、そのラウンドに記載されたダイスをもう1回得る。',
    initiativeTitle: 'Initiative フェイズ',
    initiativeRoll: '両プレイヤーが **2D6** を振る。高い方がイニシアチブを得て、Action Phase で最初の部隊を起動する。',
    tie: '**同値 —** 前のラウンドでイニシアチブを**持っていなかった**プレイヤーのものになる。',
    round1tie: '**ラウンド1の同値 —** 先に部隊の配置を終えたプレイヤーのものになる。',
    movementTitle: '移動',
    horizontal: '**水平 —** 部隊の Movement 値まで。モデルのベースから測る（車両は船体の最下点から）。',
    vertical: '**垂直 —** 建物の1階層／地形の段差（崖、壁、斜面、階段）ごとに3"。',
    formation: '**隊形 —** どのモデルも、同じ部隊の別のモデルから水平2"／垂直5"を超えて離れて終了してはならない — 近接戦闘で交戦中は不要。',
    enemyDistance: '**敵との距離 —** 常に敵モデルから1"以上離れること。',
    throughUnits: '**他の部隊を通過 —** Creature は味方モデルを通過して移動できる。Vehicle は迂回しなければならない。',
    mixedUnits: '**混成部隊 —** 部隊全体が最も制限の厳しいモデルの移動制限に従う（例：Infantry に合流したターミネイター・アーマーのキャラクターは、部隊が Advance したり近接で追撃したりするのを妨げる）。',
    notes: '**備考：** 両プレイヤーに予備の部隊がある場合、配置エリアの選択ロールに勝ったプレイヤーが先に Reinforcement のロールを解決する · Command Phase の6つの命令と4つのメタ命令は **Orders** シート、攻撃の解決は **Shooting**／**Melee** シートを参照。',
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
  ru: ['—', '+1 отряд', '+2 отряда', '+3 отряда'],
  ja: ['—', '+1部隊', '+2部隊', '+3部隊'],
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
    suppressiveFire: "**Suppressive Fire —** the unit takes **6+ ranged hits** during the attacker's activation.",
    suppressionWeapon: '**Suppression(x) —** every hit from a weapon with this ability counts as **x hits** toward that total.',
    casualties: '**Casualties —** the unit **falls below half** its Starting Strength, *or* loses a model **while already below half**.',
    penaltiesTitle: 'Cumulative Ld penalties',
    pen1: '**−1** for every **additional 6 hits** (Suppressive Fire).',
    pen2: '',
    pen3: '',
    pen4: '',
    pen5: '**−1** permanent, while the squad is **below half** Starting Strength.',
    penNote: 'Everything is cumulative — add up every penalty above.',
    testTitle: 'The test',
    test1: "**Roll 2D6.** Pass if the result is **≤ the unit's Leadership**.",
    test2: '**Pass —** no token. In the Rally Phase, a pass removes *all* tokens.',
    test3: '**Fail (Suppressive Fire) —** gain **1 Battleshock token**.',
    test4: '**Fail (casualties) —** gain **2 tokens** → the unit is **Fleeing**.',
    tokensTitle: 'Battleshock tokens (max 2)',
    tok1: '**1 — Pinned:** −1 to all hit rolls; Movement halved; no Charge bonuses.',
    tok2: '**2 — Fleeing:** moves D6+6" to the nearest friendly edge; no orders, no objectives; off the edge = removed.',
    footer: '**Both at once:** if a unit would test for Suppressive Fire *and* for dropping below half Starting Strength in the same moment, it rolls **only for Suppressive Fire** — and on a failure it receives **two Battleshock tokens, even if it already had one**.',
  },
  de: {
    title: 'MORAL', subtitle: 'Battleshock · Suppressive Fire · Leadership',
    whenTitle: 'Ein Leadership-Test wird fällig, wenn …',
    suppressiveFire: '**Suppressive Fire —** die Einheit erhält während der Aktivierung des Angreifers **6+ Fernkampftreffer**.',
    suppressionWeapon: '**Suppression(x) —** jeder Treffer einer Waffe mit dieser Fähigkeit zählt als **x Treffer** für diese Summe.',
    casualties: '**Verluste —** die Einheit **fällt unter die Hälfte** ihrer Starting Strength, *oder* verliert ein Modell, **während sie bereits darunter liegt**.',
    penaltiesTitle: 'Kumulative Ld-Abzüge',
    pen1: '**−1** für jede **weiteren 6 Treffer** (Suppressive Fire).',
    pen2: '',
    pen3: '',
    pen4: '',
    pen5: '**−1** dauerhaft, solange der Trupp **unter der Hälfte** seiner Starting Strength liegt.',
    penNote: 'Alles ist kumulativ — alle obigen Abzüge werden addiert.',
    testTitle: 'Der Test',
    test1: '**Würfle 2D6.** Bestanden, wenn das Ergebnis **≤ dem Leadership-Wert der Einheit** ist.',
    test2: '**Bestanden —** kein Marker. In der Rally-Phase entfernt ein bestandener Test *alle* Marker.',
    test3: '**Fehlgeschlagen (Suppressive Fire) —** **1 Battleshock-Marker** wird erhalten.',
    test4: '**Fehlgeschlagen (Verluste) —** **2 Marker** werden erhalten → die Einheit ist **Fleeing**.',
    tokensTitle: 'Battleshock-Marker (max. 2)',
    tok1: '**1 — Pinned:** −1 auf alle Trefferwürfe; Movement halbiert; keine Charge-Boni.',
    tok2: '**2 — Fleeing:** bewegt sich D6+6" zur nächsten befreundeten Tischkante; keine Befehle, keine Objectives; verlässt die Kante = entfernt.',
    footer: '**Beides gleichzeitig:** müsste eine Einheit im selben Moment wegen Suppressive Fire *und* wegen Absinkens unter die halbe Starting Strength testen, würfelt sie **nur für Suppressive Fire** — und erhält bei einem Fehlschlag **zwei Battleshock-Marker, auch wenn sie bereits einen hatte**.',
  },
  es: {
    title: 'MORAL', subtitle: 'Battleshock · Suppressive Fire · Leadership',
    whenTitle: 'Se hace un test de Leadership cuando…',
    suppressiveFire: '**Suppressive Fire —** la unidad recibe **6+ impactos a distancia** durante la activación del atacante.',
    suppressionWeapon: '**Suppression(x) —** cada impacto de un arma con esta habilidad cuenta como **x impactos** para ese total.',
    casualties: '**Bajas —** la unidad **cae por debajo de la mitad** de su Starting Strength, *o* pierde un modelo **estando ya por debajo de la mitad**.',
    penaltiesTitle: 'Penalizaciones acumulativas a Ld',
    pen1: '**−1** por cada **6 impactos adicionales** (Suppressive Fire).',
    pen2: '',
    pen3: '',
    pen4: '',
    pen5: '**−1** permanente, mientras la unidad esté **por debajo de la mitad** de su Starting Strength.',
    penNote: 'Todo es acumulativo — suma todas las penalizaciones anteriores.',
    testTitle: 'El test',
    test1: '**Tira 2D6.** Se supera si el resultado es **≤ el Leadership de la unidad**.',
    test2: '**Superado —** sin token. En la Rally Phase, superarlo elimina *todos* los tokens.',
    test3: '**Fallado (Suppressive Fire) —** se gana **1 token de Battleshock**.',
    test4: '**Fallado (bajas) —** se ganan **2 tokens** → la unidad está **Fleeing**.',
    tokensTitle: 'Tokens de Battleshock (máx. 2)',
    tok1: '**1 — Pinned:** −1 a todas las tiradas para impactar; Movement a la mitad; sin bonos de Charge.',
    tok2: '**2 — Fleeing:** se mueve D6+6" hacia el borde amigo más cercano; sin órdenes, sin objectives; sale del borde = se retira.',
    footer: '**Ambos a la vez:** si una unidad tuviera que testear por Suppressive Fire *y* por caer por debajo de la mitad de su Starting Strength en el mismo momento, tira **solo por Suppressive Fire** — y si falla recibe **dos tokens de Battleshock, incluso si ya tenía uno**.',
  },
  ru: {
    title: 'МОРАЛЬ', subtitle: 'Battleshock · Suppressive Fire · Leadership',
    whenTitle: 'Проведите проверку Leadership, когда…',
    suppressiveFire: '**Suppressive Fire —** отряд получает **6+ попаданий из дальнобойного оружия** во время активации атакующего.',
    suppressionWeapon: '**Suppression(x) —** каждое попадание оружия с этой способностью считается за **x попаданий** в этой сумме.',
    casualties: '**Потери —** отряд **падает ниже половины** своего Starting Strength *или* теряет модель, **уже находясь ниже половины**.',
    penaltiesTitle: 'Накапливаемые штрафы к Ld',
    pen1: '**−1** за каждые **дополнительные 6 попаданий** (Suppressive Fire).',
    pen2: '',
    pen3: '',
    pen4: '',
    pen5: '**−1** постоянно, пока отряд **ниже половины** Starting Strength.',
    penNote: 'Всё накапливается — суммируйте все штрафы выше.',
    testTitle: 'Проверка',
    test1: '**Бросьте 2D6.** Успех, если результат **≤ Leadership отряда**.',
    test2: '**Успех —** жетона нет. В Rally Phase успешная проверка снимает *все* жетоны.',
    test3: '**Провал (Suppressive Fire) —** получите **1 жетон Battleshock**.',
    test4: '**Провал (потери) —** получите **2 жетона** → отряд **Fleeing**.',
    tokensTitle: 'Жетоны Battleshock (макс. 2)',
    tok1: '**1 — Pinned:** −1 ко всем броскам на попадание; Movement вдвое меньше; нет бонусов Charge.',
    tok2: '**2 — Fleeing:** бежит D6+6" к ближайшему дружественному краю; без приказов, без целей; ушёл за край = убран.',
    footer: '**Оба сразу:** если отряд должен проверяться и из-за Suppressive Fire, *и* из-за падения ниже половины Starting Strength в один и тот же момент, он бросает **только за Suppressive Fire** — а при провале получает **два жетона Battleshock, даже если у него уже был один**.',
  },
  ja: {
    title: '士気', subtitle: 'Battleshock · Suppressive Fire · Leadership',
    whenTitle: '次の場合に Leadership テストを行う…',
    suppressiveFire: '**Suppressive Fire —** 攻撃側の起動中に、部隊が**遠距離ヒットを6回以上**受けた。',
    suppressionWeapon: '**Suppression(x) —** この能力を持つ武器のヒット1回は、その合計に**x回のヒット**として数える。',
    casualties: '**損耗 —** 部隊が Starting Strength の**半分を下回った**、または**すでに半分未満の状態で**モデルを1体失った。',
    penaltiesTitle: 'Ld ペナルティ（累積）',
    pen1: '**追加の6ヒット**ごとに**−1**（Suppressive Fire）。',
    pen2: '',
    pen3: '',
    pen4: '',
    pen5: '分隊が Starting Strength の**半分未満**の間、**−1**（恒久）。',
    penNote: 'すべて累積します — 上記のペナルティをすべて合計してください。',
    testTitle: 'テスト',
    test1: '**2D6を振る。** 結果が**部隊の Leadership 以下**なら成功。',
    test2: '**成功 —** トークンなし。Rally Phase では、成功すると*すべての*トークンを取り除く。',
    test3: '**失敗（Suppressive Fire）—** **Battleshock トークン1個**を得る。',
    test4: '**失敗（損耗）—** **トークン2個**を得る → 部隊は **Fleeing**。',
    tokensTitle: 'Battleshock トークン（最大2）',
    tok1: '**1 — Pinned：** すべての命中ロール −1、Movement 半減、Charge ボーナスなし。',
    tok2: '**2 — Fleeing：** 最寄りの味方側の端へ D6+6" 移動。命令なし、目標確保なし、端から出たら除去。',
    footer: '**両方同時：** 同じ瞬間に Suppressive Fire と Starting Strength の半分未満への低下の両方でテストが必要になる場合、**Suppressive Fire の分だけ**振る — 失敗すると、**すでに1個持っていても Battleshock トークンを2個**受ける。',
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
    seq4: '**4.** Saves: subtract **AP** from the roll; a **Ward** save ignores AP and can be tried if the normal save fails. If the needed save would be **worse than 6+** and the Ward save is too (or absent), skip the roll and apply the damage.',
    seq5: "**5.** Damage ≥ the model's Wounds removes it; excess does not carry over.",
    seq6: '**6.** Below half strength (or losing a model while already below) → Leadership test or 2 tokens & Fleeing.',
    woundTitle: 'Strength vs Toughness', coverTitle: 'Cover',
    cover1: '**Light —** +1 Armour Save.', cover2: '**Heavy —** +2 Armour Save.',
    cover3: 'Both also give the attacker **−1 to hit** and **−1 AT** (min 0).',
    notes: '**Notes:** cover needs **50%+** of the unit in it, only one type at a time, and none if both sides share the same terrain · **Obscuring** terrain/units give only **−1 to hit** (no save/AP benefit) · the **Take Cover** reaction gives +1 save & −1 AT vs ranged · **6+ hits** force a Morale test (see the Morale card) · a unit **in cover that is charged** always benefits from **Hold Your Ground**, whatever its activation status.',
  },
  de: {
    title: 'FERNKAMPF', subtitle: 'Fernkampf · Deckung',
    seqTitle: 'Ablauf des Fernkampfs',
    seq1: '**1.** Ziele wählen: mindestens ein Modell muss sichtbar & in Reichweite sein; ein Modell feuert entweder alle Waffen seines Datasheets ODER eine Armoury-Waffe. Einheiten im Nahkampf können nicht angegriffen werden.',
    seq2: '**2.** Trefferwürfe = laut Waffentyp (Rapid Fire 1 = 1, Assault 2 = 2 …); Treffer bei **≥ BS**.',
    seq3: '**3.** Verwunden: **S vs. T** (Tabelle).',
    seq4: '**4.** Rettungswürfe: **AP** wird vom Wurf abgezogen; ein **Ward**-Save ignoriert AP und darf versucht werden, wenn der normale Save misslingt. Wäre der nötige Save **schlechter als 6+** und der Ward-Save ebenfalls (oder nicht vorhanden), entfällt der Wurf und der Schaden wird direkt angewendet.',
    seq5: '**5.** Damage ≥ die Wounds des Modells entfernt es; überschüssiger Schaden geht nicht auf andere Modelle über.',
    seq6: '**6.** Unter halber Stärke (oder ein weiteres Modell verloren, während bereits darunter) → Leadership-Test oder 2 Marker & Fleeing.',
    woundTitle: 'Strength vs Toughness', coverTitle: 'Deckung',
    cover1: '**Leicht —** +1 Armour Save.', cover2: '**Schwer —** +2 Armour Save.',
    cover3: 'Beide geben dem Angreifer außerdem **−1 auf den Trefferwurf** und **−1 AT** (min. 0).',
    notes: '**Hinweise:** Cover braucht **50%+** der Einheit darin, nur eine Art gleichzeitig, und keins, wenn beide Seiten dasselbe Gelände teilen · **Obscuring**-Gelände/-Einheiten geben nur **−1 auf den Trefferwurf** (kein Save-/AP-Bonus) · die **Take Cover**-Reaktion gibt +1 Save & −1 AT gegen Fernkampf · **6+ Treffer** erzwingen einen Morale-Test (siehe die Morale-Karte) · eine Einheit **in Deckung, die gechargt wird**, profitiert immer von **Hold Your Ground**, unabhängig von ihrem Aktivierungsstatus.',
  },
  es: {
    title: 'DISPARO', subtitle: 'Combate a Distancia · Cobertura',
    seqTitle: 'Secuencia de disparo',
    seq1: '**1.** Elegir objetivos: al menos un modelo visible y al alcance; un modelo dispara todas sus armas del datasheet O una sola arma de la armoury. No se puede elegir como objetivo una unidad trabada en combate cuerpo a cuerpo.',
    seq2: '**2.** Tiradas para impactar = según el tipo de arma (Rapid Fire 1 = 1, Assault 2 = 2…); impacta con **≥ BS**.',
    seq3: '**3.** Herir: **S vs T** (tabla).',
    seq4: '**4.** Salvaciones: se resta el **AP** a la tirada; una salvación **Ward** ignora el AP y puede intentarse si falla la salvación normal. Si la salvación necesaria fuese **peor que 6+** y la Ward también (o no la hay), no se tira: el daño se aplica directamente.',
    seq5: '**5.** Damage ≥ los Wounds del modelo lo retira; el exceso no pasa a otros modelos.',
    seq6: '**6.** Por debajo de la mitad de la fuerza (o perder un modelo estando ya por debajo) → test de Leadership o 2 tokens y Fleeing.',
    woundTitle: 'Strength vs Toughness', coverTitle: 'Cobertura',
    cover1: '**Ligera —** +1 Armour Save.', cover2: '**Pesada —** +2 Armour Save.',
    cover3: 'Ambas además dan al atacante **−1 para impactar** y **−1 AT** (mín. 0).',
    notes: '**Notas:** la cobertura necesita **50%+** de la unidad dentro, solo un tipo a la vez, y ninguna si ambos bandos comparten el mismo terreno · el terreno/unidades **Obscuring** solo dan **−1 para impactar** (sin bono de salvación/AP) · la reacción **Take Cover** da +1 a la salvación y −1 AT contra disparo · **6+ impactos** fuerzan un test de Moral (ver la carta de Morale) · una unidad **en cobertura que recibe una carga** siempre se beneficia de **Hold Your Ground**, sea cual sea su estado de activación.',
  },
  ru: {
    title: 'СТРЕЛЬБА', subtitle: 'Дальний бой · Укрытие',
    seqTitle: 'Последовательность стрельбы',
    seq1: '**1.** Выберите цели: хотя бы одна модель видна и в пределах дальности; модель стреляет из всего оружия своего датащита ИЛИ из одного оружия арсенала. Отряды в ближнем бою нельзя выбрать целью.',
    seq2: '**2.** Броски на попадание = тип оружия (Rapid Fire 1 = 1, Assault 2 = 2…); попадание на **≥ BS**.',
    seq3: '**3.** Ранение: **S против T** (таблица).',
    seq4: '**4.** Спасброски: вычтите **AP** из броска; **Ward**-спасбросок игнорирует AP и может быть брошен, если обычный провален. Если нужный спасбросок был бы **хуже 6+**, а Ward тоже (или его нет), бросок пропускается и урон наносится.',
    seq5: '**5.** Урон ≥ Wounds модели убирает её; избыток урона не переносится.',
    seq6: '**6.** Ниже половины состава (или потеря модели, уже будучи ниже) → проверка Leadership или 2 жетона и Fleeing.',
    woundTitle: 'Сила против Стойкости', coverTitle: 'Укрытие',
    cover1: '**Лёгкое —** +1 к броневому спасброску.', cover2: '**Тяжёлое —** +2 к броневому спасброску.',
    cover3: 'Оба также дают атакующему **−1 на попадание** и **−1 AT** (мин. 0).',
    notes: '**Примечания:** для укрытия нужно **50%+** отряда в нём, одновременно только один тип, и никакого, если обе стороны находятся в одной местности · **Obscuring** местность/отряды дают только **−1 на попадание** (без бонуса к спасброску/AP) · реакция **Take Cover** даёт +1 к спасброску и −1 AT против дальнего боя · **6+ попаданий** вызывают проверку морали (см. карточку Morale) · отряд **в укрытии, который атакуют в Charge**, всегда получает выгоду от **Hold Your Ground**, каким бы ни был его статус активации.',
  },
  ja: {
    title: '射撃', subtitle: '遠距離戦闘 · カバー',
    seqTitle: '射撃の手順',
    seq1: '**1.** 目標を選ぶ：少なくとも1体が視認でき射程内にいること。モデルはデータシートの全武器、または武器庫の武器1つを撃つ。近接戦闘中の部隊は目標にできない。',
    seq2: '**2.** 命中ロールの数＝武器の種類（Rapid Fire 1 = 1、Assault 2 = 2…）。**BS 以上**で命中。',
    seq3: '**3.** ウーンド：**S 対 T**（表）。',
    seq4: '**4.** セーヴ：ロールから **AP** を引く。**Ward** セーヴは AP を無視し、通常セーヴに失敗した場合に試せる。必要なセーヴが**6+より悪く**、Ward も同様（または無し）なら、ロールを省略してダメージを適用する。',
    seq5: '**5.** ダメージ ≥ モデルの Wounds でそのモデルを除去。超過分は持ち越さない。',
    seq6: '**6.** 規模が半分未満（またはすでに半分未満でモデルを失う）→ Leadership テスト、または2トークンと Fleeing。',
    woundTitle: 'ストレングス 対 タフネス', coverTitle: 'カバー',
    cover1: '**軽 —** アーマー・セーヴ +1。', cover2: '**重 —** アーマー・セーヴ +2。',
    cover3: 'どちらも攻撃側に**命中 −1**と **AT −1**（最小0）を与える。',
    notes: '**備考：** カバーには部隊の**50%以上**がその中にいる必要があり、同時に1種類のみ。双方が同じ地形にいる場合は無効 · **Obscuring** の地形／部隊は**命中 −1** のみ（セーヴ／AP の利益なし） · **Take Cover** リアクションは遠距離に対しセーヴ +1、AT −1 · **6ヒット以上**で士気テスト（Morale カード参照） · **カバー内でチャージされた**部隊は、起動状態にかかわらず常に **Hold Your Ground** の恩恵を受ける。',
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
    fight3: '**3.** In range = base contact, or within 1" of a friendly model in base contact. A unit directly above or below the enemy may fight **one elevation up or down**, counting as base contact.',
    fight4: '**4.** Attacks = the **A** stat, split across melee weapons; hit on **≥ WS**. No melee weapon → S, AP 0, D 1.',
    fight5: "**5.** Wound with the weapon's S (U = current S, or +x); same S-vs-T table as shooting.",
    fight6: '**6.** Saves as shooting; already-wounded and out-of-contact models are removed first.',
    resultTitle: 'Combat result (score points)',
    cr1: '**+1** to the side with more **Wounds remaining**.',
    cr2: '**+1** per **Wound lost caused** against **Creatures** (only actual losses; excess damage ignored).',
    cr3: '**+1** per **penetrating hit** against **Vehicles**.',
    cr4: 'Apply unit modifiers. **Higher total wins.**',
    crNote: "A vehicle's Hull Points count as 5 Wounds each. Only scored while enemy units are still in base contact — if none are, the remaining side simply wins.",
    afterTitle: 'After combat',
    ac1: '**Winner —** if no enemy stays in base contact, **consolidate up to 3"**. That move may reach another enemy unit, which counts as **Charging** it for all purposes (Meta Orders included).',
    ac2: '**Loser —** Leadership test at **−(result difference)**; fail → 2 Battleshock tokens & Fleeing.',
    ac3: '**Pass or draw —** melee ends; both sides pile in up to 6", the attacker first.',
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
    fight3: '**3.** In Reichweite = Base Contact, oder innerhalb 1" eines befreundeten Modells im Base Contact. Eine Einheit direkt über oder unter dem Gegner darf **eine Ebene höher oder tiefer** kämpfen und gilt dabei als im Base Contact.',
    fight4: '**4.** Attacks = der **A**-Wert, aufgeteilt auf die Nahkampfwaffen; Treffer bei **≥ WS**. Keine Nahkampfwaffe → S, AP 0, D 1.',
    fight5: '**5.** Verwunden mit der S der Waffe (U = aktuelle S, oder +x); dieselbe S-vs-T-Tabelle wie beim Fernkampf.',
    fight6: '**6.** Rettungswürfe wie im Fernkampf; bereits verwundete und nicht im Kontakt stehende Modelle werden zuerst entfernt.',
    resultTitle: 'Kampfergebnis (Punkte)',
    cr1: '**+1** für die Seite mit mehr **verbleibenden Wounds**.',
    cr2: '**+1** pro **verursachtem Wound-Verlust** gegen **Creatures** (nur tatsächliche Verluste; überschüssiger Schaden zählt nicht).',
    cr3: '**+1** pro **Penetrating Hit** gegen **Vehicles**.',
    cr4: 'Einheiten-Modifikatoren anwenden. **Die höhere Gesamtsumme gewinnt.**',
    crNote: 'Die Hull Points eines Vehicles zählen jeweils als 5 Wounds. Nur gewertet, solange noch gegnerische Einheiten im Base Contact sind — sonst gewinnt die verbleibende Seite automatisch.',
    afterTitle: 'Nach dem Kampf',
    ac1: '**Sieger —** bleibt kein Gegner im Base Contact, **Consolidate um bis zu 3"**. Diese Bewegung darf eine andere gegnerische Einheit erreichen und zählt dann in jeder Hinsicht als **Charge** (inklusive Meta-Befehle).',
    ac2: '**Verlierer —** Leadership-Test mit **−(Ergebnisunterschied)**; Fehlschlag → 2 Battleshock-Marker & Fleeing.',
    ac3: '**Bestanden oder unentschieden —** der Nahkampf endet; beide Seiten machen Pile In um bis zu 6", der Angreifer zuerst.',
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
    fight3: '**3.** Al alcance = base contact, o a menos de 1" de un modelo amigo en base contact. Una unidad justo encima o debajo del enemigo puede luchar **un nivel arriba o abajo**, y cuenta como base contact.',
    fight4: '**4.** Attacks = el valor de **A**, repartido entre las armas de melee; impacta con **≥ WS**. Sin arma de melee → S, AP 0, D 1.',
    fight5: '**5.** Herir con la S del arma (U = S actual, o +x); la misma tabla S contra T que en el disparo.',
    fight6: '**6.** Salvaciones como en el disparo; se retiran primero los modelos ya heridos y los que no están en contacto.',
    resultTitle: 'Resultado de combate (puntos)',
    cr1: '**+1** para el bando con más **Wounds restantes**.',
    cr2: '**+1** por cada **Wound perdido causado** contra **Creatures** (solo pérdidas reales; el daño sobrante no cuenta).',
    cr3: '**+1** por cada **penetrating hit** contra **Vehicles**.',
    cr4: 'Aplicar los modificadores de la unidad. **Gana el total más alto.**',
    crNote: 'Los Hull Points de un Vehicle cuentan como 5 Wounds cada uno. Solo se puntúa mientras queden unidades enemigas en base contact — si no queda ninguna, gana el bando que sigue en pie.',
    afterTitle: 'Tras el combate',
    ac1: '**Ganador —** si no queda ningún enemigo en base contact, **consolidate hasta 3"**. Ese movimiento puede alcanzar a otra unidad enemiga, y cuenta como **cargarla** a todos los efectos (órdenes Meta incluidas).',
    ac2: '**Perdedor —** test de Leadership con **−(diferencia de resultado)**; si falla → 2 tokens de Battleshock y Fleeing.',
    ac3: '**Superado o empate —** el combate termina; ambos bandos hacen pile in hasta 6", primero el atacante.',
    ac4: '**Perseguir —** D6 + I más alta cada uno; perseguidor ≥ el que huye → 1 impacto automático por modelo, se retira 1 token. Una vez por ronda.',
    notes: '**Notas de melee:** un modelo con **pistol + un arma de melee** obtiene **+1 Attack** en combate cuerpo a cuerpo · Strength **7+** da a todos los ataques de melee **AT(1)** (salvo que ya sea mejor) · disparar armas durante una orden de Charge es con **−1 para impactar**.',
  },
  ru: {
    title: 'БЛИЖНИЙ БОЙ', subtitle: 'Charge · Fight · Результат боя',
    chargeTitle: 'Приказ Charge',
    charge1: 'Сначала **обычное движение** (до Movement, макс. 12"); затем объявите видимые цели Charge и сделайте ещё **движение до 6"** по прямой до контакта баз.',
    charge2: 'Выберите один бонус Charge для всех моделей: **+1 Attack** или **+1 Initiative**.',
    charge3: '**Цель может отреагировать —** Defensive Fire, Hold Your Ground (отменяет бонус Charge, если ≥50% атакованных отрядов его используют) или Counter-Attack.',
    fightTitle: 'Последовательность Fight',
    fight1: '**1.** Защитник двигается до 6" до контакта баз (сначала персонажи).',
    fight2: '**2.** Действуйте по **Initiative**, от высшей; при равенстве бьют одновременно (убитая модель всё равно наносит ответный удар).',
    fight3: '**3.** В дальности = контакт баз или в пределах 1" от дружественной модели в контакте баз. Отряд прямо над или под врагом может драться **на один уровень выше или ниже**, считаясь в контакте баз.',
    fight4: '**4.** Атаки = характеристика **A**, распределённая по оружию ближнего боя; попадание на **≥ WS**. Нет оружия ближнего боя → S, AP 0, D 1.',
    fight5: '**5.** Ранение силой S оружия (U = текущая S или +x); та же таблица S против T, что и в стрельбе.',
    fight6: '**6.** Спасброски как в стрельбе; уже раненые и вышедшие из контакта модели убираются первыми.',
    resultTitle: 'Результат боя (подсчёт очков)',
    cr1: '**+1** стороне с большим числом **оставшихся Wounds**.',
    cr2: '**+1** за каждую **потерянную рану**, нанесённую **Creatures** (только реальные потери; избыток урона игнорируется).',
    cr3: '**+1** за каждое **пробивающее попадание** по **Vehicles**.',
    cr4: 'Примените модификаторы отряда. **Побеждает больший итог.**',
    crNote: 'Hull Points техники считаются за 5 Wounds каждый. Подсчёт только пока вражеские отряды остаются в контакте баз — если их нет, оставшаяся сторона просто побеждает.',
    afterTitle: 'После боя',
    ac1: '**Победитель —** если ни один враг не остался в контакте баз, **консолидация до 3"**. Это движение может достичь другого вражеского отряда, что считается **Charging** им во всех отношениях (включая Meta Orders).',
    ac2: '**Проигравший —** проверка Leadership со штрафом **−(разница результатов)**; провал → 2 жетона Battleshock и Fleeing.',
    ac3: '**Успех или ничья —** ближний бой заканчивается; обе стороны делают Pile In до 6", атакующий первым.',
    ac4: '**Pursue —** D6 + высшая I у каждого; преследователь ≥ бегущего → 1 автоматическое попадание на модель, снять 1 жетон. Раз за раунд.',
    notes: '**Примечания:** модель с **пистолетом + оружием ближнего боя** получает **+1 Attack** в ближнем бою · Сила **7+** даёт всем атакам ближнего боя **AT(1)** (если нет лучшего) · стрельба во время приказа Charge — со **−1 на попадание**.',
  },
  ja: {
    title: '近接戦闘', subtitle: 'Charge · Fight · 戦闘結果',
    chargeTitle: 'Charge 命令',
    charge1: 'まず**通常移動**（Movement まで、最大12"）。次に視認できる Charge 目標を宣言し、ベース接触まで直線で**さらに最大6"移動**する。',
    charge2: '全モデル共通で Charge ボーナスを1つ選ぶ：**+1 Attack** または **+1 Initiative**。',
    charge3: '**目標はリアクション可能 —** Defensive Fire、Hold Your Ground（チャージされた部隊の50%以上が使うと Charge ボーナスを打ち消す）、または Counter-Attack。',
    fightTitle: 'Fight の手順',
    fight1: '**1.** 防御側がベース接触まで最大6"移動する（キャラクター優先）。',
    fight2: '**2.** **Initiative** の高い順に行動。同値は同時に攻撃（倒されたモデルも反撃する）。',
    fight3: '**3.** 射程内＝ベース接触、またはベース接触中の味方モデルから1"以内。敵の真上または真下の部隊は**1段上または下**で戦え、ベース接触として扱う。',
    fight4: '**4.** Attack ＝ **A** 値、近接武器に割り振る。**WS 以上**で命中。近接武器なし → S、AP 0、D 1。',
    fight5: '**5.** 武器の S でウーンド判定（U = 現在の S、または +x）。射撃と同じ S 対 T 表。',
    fight6: '**6.** セーヴは射撃と同様。すでに負傷したモデルと接触していないモデルを先に除去。',
    resultTitle: '戦闘結果（得点）',
    cr1: '**残りウーンズ**が多い側に **+1**。',
    cr2: '**Creature** に与えた**失わせたウーンド**1つにつき **+1**（実際の損失のみ。超過ダメージは無視）。',
    cr3: '**Vehicle** への**貫通ヒット**1つにつき **+1**。',
    cr4: '部隊の修正値を適用。**合計が高い方が勝ち。**',
    crNote: '車両のハル・ポイントは1つにつき5ウーンズとして数える。敵部隊がまだベース接触している間だけ採点する — いなければ、残った側がそのまま勝ち。',
    afterTitle: '戦闘後',
    ac1: '**勝者 —** 敵がベース接触していなければ、**最大3"コンソリデート**できる。この移動で別の敵部隊に届いた場合、あらゆる目的でそれを**チャージ**したものとして扱う（メタ命令を含む）。',
    ac2: '**敗者 —** **−（結果の差）** の Leadership テスト。失敗 → Battleshock トークン2個と Fleeing。',
    ac3: '**成功または引き分け —** 近接は終了。双方が最大6"パイル・インし、攻撃側が先。',
    ac4: '**Pursue —** 各自 D6 + 最高の I。追撃側 ≥ 逃走側 → モデル1体につき自動ヒット1回、トークン1個を除去。ラウンドに1回。',
    notes: '**近接の備考：** **ピストル＋近接武器**を持つモデルは近接で **+1 Attack** · ストレングス **7+** はすべての近接攻撃に **AT(1)** を与える（すでに上回る場合を除く） · Charge 命令中の射撃は**命中 −1**。',
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
    man2: "**Psychic Test —** roll **2D6 ≥ the power's cast value**.",
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
    man2: '**Psychic Test —** **2D6 ≥ dem Cast-Wert der Kraft** würfeln.',
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
    man2: '**Psychic Test —** tirar **2D6 ≥ el valor de cast del poder**.',
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
  ru: {
    title: 'ПСИОНИЧЕСКИЕ СИЛЫ', subtitle: 'Manifest · Dispel · Perils of the Warp',
    manifestTitle: 'Проявление',
    man1: 'Только модели с правилом **Psyker**. Нужна линия видимости, если не сказано иное.',
    man2: '**Psychic Test —** бросьте **2D6 ≥ значения сотворения силы**.',
    man3: '**Повтор —** повторное сотворение той же силы в этом ходу идёт с накопительным **−1**.',
    man4: '**Overchannel —** добавьте кубик (3D6); любой **дубль** = **1D3 Mortal Wounds** (плюс любые Perils).',
    man5: 'Известные силы указаны в профиле — General Disciplines + силы вашего Кодекса.',
    dispelTitle: 'Dispel и цели',
    dis1: '**Dispel —** вражеский псайкер в пределах **24"** бросает **2D6 и должен превзойти результат сотворения**. Развеяно = нет эффекта (для оружия Force всё равно считается проявленным).',
    dis2: '**В ближнем бою —** псайкеры в ближнем бою творят только **Basic** силы (фаза Initiative); цели = он сам или отряды в том же ближнем бою.',
    dis3: '**Цели —** Сам · Дружественный отряд (или заклинатель + присоединённые) · Вражеский отряд (включая присоединённых персонажей).',
    perilsTitle: 'Perils of the Warp — при дубле 1 или дубле 6 бросьте D6',
    perils: [
      ['1', 'Втянут в Варп', 'Проверка Ld: успех = 1 Mortal Wound; провал = псайкер убран.'],
      ['2', 'Mindsteal', '1 MW; эту силу больше нельзя использовать до конца игры.'],
      ['3', 'Power Drain', '1 MW; бросьте 1D3 — оба игрока получают −эта величина ко всем псионическим проверкам в этом раунде (накопительно).'],
      ['4', 'Psionic Feedback', '1 MW.'],
      ['5', 'Empyrian Aftermath', 'Проверка Ld: провал = 1 MW.'],
      ['6', 'Warp Boost', 'Проверка Ld: успех = +1 на попадание и +1 на ранение до конца следующей активации; провал = 1 MW.'],
    ],
    notes: '**Примечания:** для проверок Perils используйте **Leadership 10** · **Brotherhood of Psykers** (2+ таких моделей) даёт **+1 ко всем броскам сотворения и развеивания**.',
  },
  ja: {
    title: 'サイキック・パワー', subtitle: 'Manifest · Dispel · Perils of the Warp',
    manifestTitle: '発動',
    man1: '**Psyker** ルールを持つモデルのみ。特記がない限り視線が必要。',
    man2: '**Psychic Test —** **2D6 ≥ そのパワーの発動値** を振る。',
    man3: '**重ねがけ —** このターンに同じパワーを再度発動すると、累積で **−1**。',
    man4: '**Overchannel —** ダイスを1個追加（3D6）。**ゾロ目**が出ると **1D3 Mortal Wound**（Perils も別途）。',
    man5: '習得済みのパワーはプロファイルに記載 — General Disciplines とコデックスのもの。',
    dispelTitle: 'Dispel と目標',
    dis1: '**Dispel —** **24"**以内の敵サイカーが **2D6 を振り、発動の結果を上回らねばならない**。打ち消された場合は効果なし（Force 武器にとっては発動済みとして扱う）。',
    dis2: '**近接戦闘中 —** 近接中のサイカーは **Basic** パワーのみ発動可（Initiative フェイズ）。目標は自身か同じ近接戦闘内の部隊。',
    dis3: '**目標 —** 自身 · 味方部隊（または術者＋合流中のキャラクター）· 敵部隊（合流中のキャラクターを含む）。',
    perilsTitle: 'Perils of the Warp — ゾロ目の1または6で D6 を振る',
    perils: [
      ['1', 'ワープに吸い込まれる', 'Ld テスト：成功 = 1 Mortal Wound、失敗 = サイカー除去。'],
      ['2', 'Mindsteal', '1 MW。そのパワーはゲーム中二度と使用不可。'],
      ['3', 'Power Drain', '1 MW。1D3 を振る — 両プレイヤーはこのラウンド、すべてのサイキック・テストにその値のマイナス（累積）。'],
      ['4', 'Psionic Feedback', '1 MW。'],
      ['5', 'Empyrian Aftermath', 'Ld テスト：失敗 = 1 MW。'],
      ['6', 'Warp Boost', 'Ld テスト：成功 = 次の起動終了まで命中 +1 とウーンド +1、失敗 = 1 MW。'],
    ],
    notes: '**備考：** Perils のテストには **Leadership 10** を使用 · **Brotherhood of Psykers**（該当モデル2体以上）は**すべての発動・Dispel ロールに +1**。',
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
        'Ranged targets may make use of the "Take Cover" meta order.',
        'It may fire Assault, Pistol, or Grenade weapons with a –1 to hit penalty after moving.',
        'It may cast basic psychic powers and similar effects (incantations, prayers, …) at any point during the activation.',
      ],
    },
    {
      name: 'Charge',
      prerequisite: 'The unit is not engaged in melee combat.',
      effect: [
        'It may move up to its Movement value (but max 12").',
        'It may declare any number of enemy units it can see as targets for ranged attacks.',
        'Ranged targets may make use of the "Take Cover" meta order.',
        'It may fire Assault, Pistol, and Grenade weapons with a –1 to hit penalty after moving.',
        'It may declare any number of enemy units it can see as targets for a Charge move.',
        'Charge targets may make use of "Defensive Fire" or "Hold your Ground" meta orders.',
        'It may make a further, up to 6" Charge move in a straight line, if it can get into direct base contact with any of these enemy units.',
        'It must select either +1 Attack or +1 Initiative for all models as a Charge bonus.',
        'It resolves the Fight order.',
        'It may cast basic psychic powers and similar effects (incantations, prayers, …) at any point during the activation.',
      ],
    },
    {
      name: 'Escape',
      prerequisite: 'The unit is already engaged in melee combat.',
      effect: [
        'It receives 1 automatic hit from each enemy model in attack range.',
        'It gains two Battleshock tokens and flees.',
        'Instead of being allowed to pursue as normal, enemy units have to remain in melee combat if there are other units of yours remaining in base contact with them and resolve the melee as if all units involved had the Fight order.',
        'If there are no friendly units anymore, enemy units lose their order, count as activated and may only consolidate.',
      ],
    },
    {
      name: 'Fight',
      prerequisite: 'The unit is already engaged in melee combat.',
      effect: [
        'The melee is resolved (see Melee combat) as if all units involved had the Fight order.',
        'It may cast basic psychic powers and similar effects (incantations, prayers, …) during its initiative step.',
        'It removes all orders from units participating in this melee.',
      ],
    },
    {
      name: 'Move & Shoot',
      prerequisite: 'The unit is not engaged in melee combat.',
      effect: [
        'It may move up to its Movement value.',
        'It may declare any number of enemy units it can see as targets for ranged attacks.',
        'Ranged targets may make use of the "Take Cover" meta order.',
        'It may fire any ranged weapon except Heavy types after moving.',
        'It may cast basic and normal psychic powers and similar effects (incantations, prayers, …) at any point during the activation.',
      ],
    },
    {
      name: 'Stand & Shoot',
      prerequisite: 'The unit is not engaged in melee combat.',
      effect: [
        'It may not move.',
        'It may declare any number of enemy units it can see as targets for ranged attacks.',
        'Ranged targets may make use of the "Take Cover" meta order.',
        'It may fire any ranged weapon, including Heavy types.',
        'It reduces the total hit penalty for ranged attacks by 1.',
        'It may cast all types of psychic powers and similar effects (incantations, prayers, …) at any point during the activation.',
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
        'Fernkampfziele dürfen den Meta-Befehl "Take Cover" nutzen.',
        'Sie darf nach der Bewegung Assault-, Pistol- oder Grenade-Waffen mit –1 auf den Trefferwurf abfeuern.',
        'Sie darf zu jedem Zeitpunkt ihrer Aktivierung Basic-psionische Kräfte und ähnliche Effekte (Beschwörungen, Gebete, …) wirken.',
      ],
    },
    {
      name: 'Charge',
      prerequisite: 'Die Einheit ist nicht im Nahkampf gebunden.',
      effect: [
        'Sie darf sich bis zu ihrem Movement-Wert bewegen (aber max. 12").',
        'Sie darf eine beliebige Anzahl sichtbarer gegnerischer Einheiten als Ziele für Fernkampfangriffe erklären.',
        'Fernkampfziele dürfen den Meta-Befehl "Take Cover" nutzen.',
        'Sie darf nach der Bewegung Assault-, Pistol- und Grenade-Waffen mit –1 auf den Trefferwurf abfeuern.',
        'Sie darf eine beliebige Anzahl sichtbarer gegnerischer Einheiten als Ziele für eine Charge-Bewegung erklären.',
        'Charge-Ziele dürfen die Meta-Befehle "Defensive Fire" oder "Hold your Ground" nutzen.',
        'Sie darf zusätzlich eine Charge-Bewegung von bis zu 6" in gerader Linie machen, wenn sie dadurch direkten Base Contact mit einer dieser gegnerischen Einheiten erreichen kann.',
        'Sie muss für alle Modelle entweder +1 Attack oder +1 Initiative als Charge-Bonus wählen.',
        'Sie löst den Fight-Befehl auf.',
        'Sie darf zu jedem Zeitpunkt ihrer Aktivierung Basic-psionische Kräfte und ähnliche Effekte (Beschwörungen, Gebete, …) wirken.',
      ],
    },
    {
      name: 'Escape',
      prerequisite: 'Die Einheit ist bereits im Nahkampf gebunden.',
      effect: [
        'Sie erhält 1 automatischen Treffer von jedem gegnerischen Modell in Angriffsreichweite.',
        'Sie erhält zwei Battleshock-Marker und flieht.',
        'Statt normal verfolgen zu dürfen, müssen gegnerische Einheiten im Nahkampf gebunden bleiben, wenn weitere eigene Einheiten in Base Contact mit ihnen stehen, und der Nahkampf wird aufgelöst, als hätten alle beteiligten Einheiten den Fight-Befehl.',
        'Gibt es keine befreundeten Einheiten mehr, verlieren die gegnerischen Einheiten ihren Befehl, gelten als aktiviert und dürfen nur konsolidieren.',
      ],
    },
    {
      name: 'Fight',
      prerequisite: 'Die Einheit ist bereits im Nahkampf gebunden.',
      effect: [
        'Der Nahkampf wird aufgelöst (siehe Melee Combat), als hätten alle beteiligten Einheiten den Fight-Befehl.',
        'Sie darf in ihrem Initiative-Schritt Basic-psionische Kräfte und ähnliche Effekte (Beschwörungen, Gebete, …) wirken.',
        'Sie entfernt alle Befehle von den an diesem Nahkampf beteiligten Einheiten.',
      ],
    },
    {
      name: 'Move & Shoot',
      prerequisite: 'Die Einheit ist nicht im Nahkampf gebunden.',
      effect: [
        'Sie darf sich bis zu ihrem Movement-Wert bewegen.',
        'Sie darf eine beliebige Anzahl sichtbarer gegnerischer Einheiten als Ziele für Fernkampfangriffe erklären.',
        'Fernkampfziele dürfen den Meta-Befehl "Take Cover" nutzen.',
        'Sie darf nach der Bewegung jede Fernkampfwaffe außer Heavy-Waffen abfeuern.',
        'Sie darf zu jedem Zeitpunkt ihrer Aktivierung Basic- und Normal-psionische Kräfte und ähnliche Effekte (Beschwörungen, Gebete, …) wirken.',
      ],
    },
    {
      name: 'Stand & Shoot',
      prerequisite: 'Die Einheit ist nicht im Nahkampf gebunden.',
      effect: [
        'Sie darf sich nicht bewegen.',
        'Sie darf eine beliebige Anzahl sichtbarer gegnerischer Einheiten als Ziele für Fernkampfangriffe erklären.',
        'Fernkampfziele dürfen den Meta-Befehl "Take Cover" nutzen.',
        'Sie darf jede Fernkampfwaffe abfeuern, einschließlich Heavy-Waffen.',
        'Sie verringert den gesamten Trefferabzug für Fernkampfangriffe um 1.',
        'Sie darf zu jedem Zeitpunkt ihrer Aktivierung alle Arten von psionischen Kräften und ähnlichen Effekten (Beschwörungen, Gebete, …) wirken.',
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
        'Los objetivos a distancia pueden usar la meta orden "Take Cover".',
        'Puede disparar armas Assault, Pistol o Grenade con –1 para impactar tras moverse.',
        'Puede lanzar poderes psíquicos Basic y efectos similares (invocaciones, plegarias, …) en cualquier momento de su activación.',
      ],
    },
    {
      name: 'Charge',
      prerequisite: 'La unidad no está trabada en combate cuerpo a cuerpo.',
      effect: [
        'Puede moverse hasta su valor de Movement (pero máx. 12").',
        'Puede declarar como objetivo de ataques a distancia a cualquier número de unidades enemigas que pueda ver.',
        'Los objetivos a distancia pueden usar la meta orden "Take Cover".',
        'Puede disparar armas Assault, Pistol y Grenade con –1 para impactar tras moverse.',
        'Puede declarar como objetivo de un movimiento de Charge a cualquier número de unidades enemigas que pueda ver.',
        'Los objetivos de la Charge pueden usar las meta órdenes "Defensive Fire" o "Hold your Ground".',
        'Puede hacer además un movimiento de Charge de hasta 6" en línea recta, si con ello puede entrar en base contact directo con alguna de esas unidades enemigas.',
        'Debe elegir +1 Attack o +1 Initiative para todos sus modelos como bono de Charge.',
        'Resuelve la orden Fight.',
        'Puede lanzar poderes psíquicos Basic y efectos similares (invocaciones, plegarias, …) en cualquier momento de su activación.',
      ],
    },
    {
      name: 'Escape',
      prerequisite: 'La unidad ya está trabada en combate cuerpo a cuerpo.',
      effect: [
        'Recibe 1 impacto automático de cada modelo enemigo dentro de su alcance de ataque.',
        'Gana dos tokens de Battleshock y huye (Fleeing).',
        'En lugar de poder perseguir con normalidad, las unidades enemigas deben permanecer trabadas en combate si hay otras unidades tuyas en base contact con ellas, y el combate se resuelve como si todas las unidades implicadas tuvieran la orden Fight.',
        'Si ya no queda ninguna unidad amiga, las unidades enemigas pierden su orden, cuentan como activadas y solo pueden consolidar.',
      ],
    },
    {
      name: 'Fight',
      prerequisite: 'La unidad ya está trabada en combate cuerpo a cuerpo.',
      effect: [
        'El combate se resuelve (ver Melee Combat) como si todas las unidades implicadas tuvieran la orden Fight.',
        'Puede lanzar poderes psíquicos Basic y efectos similares (invocaciones, plegarias, …) en su paso de iniciativa.',
        'Elimina todas las órdenes de las unidades que participan en este combate.',
      ],
    },
    {
      name: 'Move & Shoot',
      prerequisite: 'La unidad no está trabada en combate cuerpo a cuerpo.',
      effect: [
        'Puede moverse hasta su valor de Movement.',
        'Puede declarar como objetivo de ataques a distancia a cualquier número de unidades enemigas que pueda ver.',
        'Los objetivos a distancia pueden usar la meta orden "Take Cover".',
        'Puede disparar cualquier arma a distancia excepto las de tipo Heavy tras moverse.',
        'Puede lanzar poderes psíquicos Basic y Normal y efectos similares (invocaciones, plegarias, …) en cualquier momento de su activación.',
      ],
    },
    {
      name: 'Stand & Shoot',
      prerequisite: 'La unidad no está trabada en combate cuerpo a cuerpo.',
      effect: [
        'No puede moverse.',
        'Puede declarar como objetivo de ataques a distancia a cualquier número de unidades enemigas que pueda ver.',
        'Los objetivos a distancia pueden usar la meta orden "Take Cover".',
        'Puede disparar cualquier arma a distancia, incluidas las de tipo Heavy.',
        'Reduce en 1 la penalización total para impactar en ataques a distancia.',
        'Puede lanzar cualquier tipo de poder psíquico y efectos similares (invocaciones, plegarias, …) en cualquier momento de su activación.',
      ],
    },
  ],
  ru: [
    {
      name: 'Advance',
      prerequisite: 'Отряд не связан ближним боем.',
      effect: [
        'Может двигаться до значения своего Movement.',
        'Может совершить дополнительное движение Advance до 1D6".',
        'Должен держаться минимум в 1" от вражеских моделей.',
        'Может объявить любое число видимых вражеских отрядов целями дальних атак.',
        'Цели дальних атак могут использовать мета-приказ «Take Cover».',
        'После движения может стрелять из оружия Assault, Pistol или Grenade со штрафом –1 на попадание.',
        'Может творить базовые псионические силы и подобные эффекты (заклинания, молитвы, …) в любой момент активации.',
      ],
    },
    {
      name: 'Charge',
      prerequisite: 'Отряд не связан ближним боем.',
      effect: [
        'Может двигаться до значения своего Movement (но не более 12").',
        'Может объявить любое число видимых вражеских отрядов целями дальних атак.',
        'Цели дальних атак могут использовать мета-приказ «Take Cover».',
        'После движения может стрелять из оружия Assault, Pistol и Grenade со штрафом –1 на попадание.',
        'Может объявить любое число видимых вражеских отрядов целями движения Charge.',
        'Цели Charge могут использовать мета-приказы «Defensive Fire» или «Hold your Ground».',
        'Может совершить дополнительное движение Charge до 6" по прямой, если сможет войти в прямой контакт баз с любым из этих вражеских отрядов.',
        'Должен выбрать для всех моделей бонус Charge: либо +1 Attack, либо +1 Initiative.',
        'Выполняет приказ Fight.',
        'Может творить базовые псионические силы и подобные эффекты (заклинания, молитвы, …) в любой момент активации.',
      ],
    },
    {
      name: 'Escape',
      prerequisite: 'Отряд уже связан ближним боем.',
      effect: [
        'Получает 1 автоматическое попадание от каждой вражеской модели в дальности атаки.',
        'Получает два жетона Battleshock и бежит.',
        'Вместо обычного преследования вражеские отряды обязаны остаться в ближнем бою, если ваши другие отряды остаются с ними в контакте баз, и разрешают бой так, как будто у всех участвующих отрядов приказ Fight.',
        'Если дружественных отрядов не осталось, вражеские отряды теряют приказ, считаются активированными и могут только консолидироваться.',
      ],
    },
    {
      name: 'Fight',
      prerequisite: 'Отряд уже связан ближним боем.',
      effect: [
        'Ближний бой разрешается (см. Ближний бой) так, как будто у всех участвующих отрядов приказ Fight.',
        'Может творить базовые псионические силы и подобные эффекты (заклинания, молитвы, …) во время своего шага инициативы.',
        'Снимает все приказы с отрядов, участвующих в этом ближнем бою.',
      ],
    },
    {
      name: 'Move & Shoot',
      prerequisite: 'Отряд не связан ближним боем.',
      effect: [
        'Может двигаться до значения своего Movement.',
        'Может объявить любое число видимых вражеских отрядов целями дальних атак.',
        'Цели дальних атак могут использовать мета-приказ «Take Cover».',
        'После движения может стрелять из любого дальнобойного оружия, кроме типа Heavy.',
        'Может творить базовые и обычные псионические силы и подобные эффекты (заклинания, молитвы, …) в любой момент активации.',
      ],
    },
    {
      name: 'Stand & Shoot',
      prerequisite: 'Отряд не связан ближним боем.',
      effect: [
        'Не может двигаться.',
        'Может объявить любое число видимых вражеских отрядов целями дальних атак.',
        'Цели дальних атак могут использовать мета-приказ «Take Cover».',
        'Может стрелять из любого дальнобойного оружия, включая тип Heavy.',
        'Уменьшает общий штраф на попадание для дальних атак на 1.',
        'Может творить все типы псионических сил и подобные эффекты (заклинания, молитвы, …) в любой момент активации.',
      ],
    },
  ],
  ja: [
    {
      name: 'Advance',
      prerequisite: '部隊が近接戦闘で交戦していない。',
      effect: [
        'Movement 値まで移動できる。',
        '追加で最大1D6"の Advance 移動を行える。',
        '敵モデルから1"以上離れていなければならない。',
        '視認できる任意の数の敵部隊を遠距離攻撃の目標に宣言できる。',
        '遠距離の目標はメタ命令「Take Cover」を使用できる。',
        '移動後、Assault、Pistol、Grenade 武器を命中 –1 のペナルティで撃てる。',
        '起動中いつでも、基本サイキック・パワーや類似の効果（詠唱、祈祷など）を発動できる。',
      ],
    },
    {
      name: 'Charge',
      prerequisite: '部隊が近接戦闘で交戦していない。',
      effect: [
        'Movement 値まで移動できる（ただし最大12"）。',
        '視認できる任意の数の敵部隊を遠距離攻撃の目標に宣言できる。',
        '遠距離の目標はメタ命令「Take Cover」を使用できる。',
        '移動後、Assault、Pistol、Grenade 武器を命中 –1 のペナルティで撃てる。',
        '視認できる任意の数の敵部隊を Charge 移動の目標に宣言できる。',
        'Charge の目標はメタ命令「Defensive Fire」または「Hold your Ground」を使用できる。',
        'これらの敵部隊のいずれかと直接ベース接触できるなら、直線で追加の最大6" Charge 移動を行える。',
        'Charge ボーナスとして、全モデルに +1 Attack か +1 Initiative のいずれかを選ばなければならない。',
        'Fight 命令を解決する。',
        '起動中いつでも、基本サイキック・パワーや類似の効果（詠唱、祈祷など）を発動できる。',
      ],
    },
    {
      name: 'Escape',
      prerequisite: '部隊がすでに近接戦闘で交戦している。',
      effect: [
        '攻撃範囲内の各敵モデルから自動ヒットを1回受ける。',
        'Battleshock トークンを2個得て、逃走する。',
        '通常の追撃を行う代わりに、自軍の他の部隊がまだベース接触している場合、敵部隊は近接戦闘に留まらなければならず、関与する全部隊が Fight 命令を持つものとして近接を解決する。',
        '味方部隊がもういない場合、敵部隊は命令を失い、起動済みとして扱われ、コンソリデートのみ可能。',
      ],
    },
    {
      name: 'Fight',
      prerequisite: '部隊がすでに近接戦闘で交戦している。',
      effect: [
        '関与する全部隊が Fight 命令を持つものとして近接戦闘を解決する（近接戦闘の項参照）。',
        'イニシアチブ・ステップ中に、基本サイキック・パワーや類似の効果（詠唱、祈祷など）を発動できる。',
        'この近接戦闘に参加している部隊の命令をすべて取り除く。',
      ],
    },
    {
      name: 'Move & Shoot',
      prerequisite: '部隊が近接戦闘で交戦していない。',
      effect: [
        'Movement 値まで移動できる。',
        '視認できる任意の数の敵部隊を遠距離攻撃の目標に宣言できる。',
        '遠距離の目標はメタ命令「Take Cover」を使用できる。',
        '移動後、Heavy タイプを除く任意の遠距離武器を撃てる。',
        '起動中いつでも、基本および通常のサイキック・パワーや類似の効果（詠唱、祈祷など）を発動できる。',
      ],
    },
    {
      name: 'Stand & Shoot',
      prerequisite: '部隊が近接戦闘で交戦していない。',
      effect: [
        '移動できない。',
        '視認できる任意の数の敵部隊を遠距離攻撃の目標に宣言できる。',
        '遠距離の目標はメタ命令「Take Cover」を使用できる。',
        'Heavy タイプを含む任意の遠距離武器を撃てる。',
        '遠距離攻撃の命中ペナルティの合計を1減らす。',
        '起動中いつでも、あらゆる種類のサイキック・パワーや類似の効果（詠唱、祈祷など）を発動できる。',
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
  ru: [
    {
      name: 'Counter-Attack',
      prerequisite: 'У отряда есть способность Counter-Attack, он объявлен целью движения Charge, и это происходит после того, как атакующий отряд объявил все цели Charge.',
      effect: [
        'Считается, что он успешно выполнил приказ Charge.',
        'Должен выбрать бонус Charge раньше атакующего и дополнительно получает эффекты снаряжения или особых правил, срабатывающих при Charge.',
      ],
    },
    {
      name: 'Defensive Fire',
      prerequisite: 'Отряд объявлен целью движения Charge, и это происходит после того, как атакующий отряд объявил все цели Charge.',
      effect: [
        'Может стрелять из дальнобойного оружия по атакующему отряду со штрафом –1 на попадание.',
        'Может творить базовые и обычные псионические силы и подобные эффекты (заклинания, молитвы, …) на атакующий отряд или на себя.',
        'Атакующий автоматически проходит любую проверку Leadership во время Defensive Fire.',
      ],
    },
    {
      name: 'Hold Your Ground',
      prerequisite: 'Отряд объявлен целью движения Charge, и это происходит после того, как атакующий отряд объявил все цели Charge.',
      effect: [
        'Отменяет бонус Charge атакующего.',
        'Если одновременно атакованы несколько отрядов, как минимум 50% из них должны использовать Hold Your Ground, чтобы отменить бонус Charge атакующего.',
      ],
    },
    {
      name: 'Take Cover',
      prerequisite: 'Отряд выбран целью дальней атаки, псионической силы или подобного эффекта (заклинания, молитвы, …), и это происходит после того, как стреляющий отряд объявил все дальние цели.',
      effect: [
        'Получает бонус +1 к спасброскам против дальних атак до конца активации противника.',
        'Дальние атаки по нему уменьшают свой AT на 1 (минимум 0).',
      ],
    },
  ],
  ja: [
    {
      name: 'Counter-Attack',
      prerequisite: '部隊が Counter-Attack 能力を持ち、チャージ移動の目標に宣言されており、かつチャージ側の部隊がすべての Charge 目標を宣言した後であること。',
      effect: [
        'Charge 命令を成功させたものとして扱われる。',
        '攻撃側より先に Charge ボーナスを選ばなければならず、さらに装備や特殊ルールの Charge 時の効果も得る。',
      ],
    },
    {
      name: 'Defensive Fire',
      prerequisite: '部隊がチャージ移動の目標に宣言されており、かつチャージ側の部隊がすべての Charge 目標を宣言した後であること。',
      effect: [
        '攻撃してきた部隊に対し、命中 –1 のペナルティで遠距離武器を撃てる。',
        '攻撃してきた部隊または自身に対し、基本および通常のサイキック・パワーや類似の効果（詠唱、祈祷など）を発動できる。',
        '攻撃側は Defensive Fire 中の Leadership テストに自動的に成功する。',
      ],
    },
    {
      name: 'Hold Your Ground',
      prerequisite: '部隊がチャージ移動の目標に宣言されており、かつチャージ側の部隊がすべての Charge 目標を宣言した後であること。',
      effect: [
        '攻撃側の Charge ボーナスを打ち消す。',
        '複数の部隊が同時にチャージされた場合、攻撃側の Charge ボーナスを打ち消すには、そのうち少なくとも50%が Hold Your Ground を使用しなければならない。',
      ],
    },
    {
      name: 'Take Cover',
      prerequisite: '部隊が遠距離攻撃、サイキック・パワー、または類似の効果（詠唱、祈祷など）の目標に選ばれており、かつ射撃側の部隊がすべての遠距離目標を宣言した後であること。',
      effect: [
        '敵の起動が終わるまで、遠距離攻撃に対するセーヴに +1 のボーナスを得る。',
        'それに対する遠距離攻撃は AT が1下がる（最小0）。',
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
    notes: "**Meta Orders are Defensive Reactions:** usable only if the unit has not been activated this round, and using one removes its order · never usable by a unit engaged in melee. **Notes:** a unit doesn't have to perform every part of its order (e.g. Move & Shoot may skip moving or shooting) · fewer orders than your opponent gives you **Skip tokens** (1 per 2 orders of difference, rounded up).",
  },
  de: {
    title: 'ORDERS', subtitle: 'Command Phase Orders · Meta Orders',
    assignedTitle: 'In der Command-Phase zugewiesen — eine pro Einheit',
    metaTitle: 'Meta Orders — ausgelöst, nicht zugewiesen',
    notes: '**Meta Orders sind Defensive Reactions:** nur nutzbar, wenn die Einheit in dieser Runde noch nicht aktiviert wurde, und die Nutzung entfernt ihren Befehl · nie nutzbar für eine im Nahkampf gebundene Einheit. **Hinweise:** eine Einheit muss nicht jeden Teil ihres Befehls ausführen (z. B. kann Move & Shoot das Bewegen oder Schießen auslassen) · weniger Befehle als der Gegner geben **Skip-Marker** (1 pro 2 Befehle Unterschied, aufgerundet).',
  },
  es: {
    title: 'ORDERS', subtitle: 'Command Phase Orders · Meta Orders',
    assignedTitle: 'Asignadas en la Command Phase — una por unidad',
    metaTitle: 'Meta Orders — se activan, no se asignan',
    notes: '**Las Meta Orders son Defensive Reactions:** solo se pueden usar si la unidad aún no se ha activado en esta ronda, y usarlas le quita su orden · nunca se pueden usar si está trabada en combate. **Notas:** una unidad no tiene que ejecutar todas las partes de su orden (p. ej., Move & Shoot puede omitir moverse o disparar) · tener menos órdenes que el rival da **tokens de Skip** (1 por cada 2 órdenes de diferencia, redondeando hacia arriba).',
  },
  ru: {
    title: 'ПРИКАЗЫ', subtitle: 'Приказы Command Phase · Мета-приказы',
    assignedTitle: 'Назначаются в Command Phase — один на отряд',
    metaTitle: 'Мета-приказы — срабатывают, не назначаются',
    notes: '**Мета-приказы — это Defensive Reactions:** используются, только если отряд ещё не был активирован в этом раунде, и использование снимает его приказ · никогда не используются отрядом, связанным ближним боем. **Примечания:** отряд не обязан выполнять каждую часть своего приказа (напр., Move & Shoot может пропустить движение или стрельбу) · меньшее число приказов, чем у соперника, даёт **жетоны Skip** (1 за каждые 2 приказа разницы, с округлением вверх).',
  },
  ja: {
    title: '命令', subtitle: 'Command Phase 命令 · メタ命令',
    assignedTitle: 'Command Phase に割り当てる — 部隊ごとに1つ',
    metaTitle: 'メタ命令 — 割り当てではなく発動',
    notes: '**メタ命令は Defensive Reaction：** そのラウンドにまだ起動していない部隊のみ使用でき、使用するとその部隊の命令は取り除かれる · 近接戦闘で交戦中の部隊は使用できない。**備考：** 部隊は命令のすべての部分を実行する必要はない（例：Move & Shoot で移動または射撃を省略可） · 相手より命令が少ない場合は **Skip トークン**を得る（命令の差2つにつき1個、端数切り上げ）。',
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
  ru: 'Высококачественные печатные карточки приказов от **Grimdark Gamers (Gregor)**',
  ja: '**Grimdark Gamers (Gregor)** による高品質な印刷用命令カード',
};

/**
 * Community print-and-play order cards — a physical, illustrated alternative to the text sheet
 * above (one card per order, themed per faction group: Chaos/Imperium/Xenos), by Grimdark Gamers
 * (Gregor). Screen-only (print:hidden): these are separate PDFs meant to be downloaded and
 * printed on card stock, not part of THIS sheet's own print/PDF output.
 */
function OrderCardsCredit({ lang }: { lang: Language }) {
  const decks: { key: string; label: string; icon: string; href: string; file: string }[] = [
    { key: 'chaos',    label: 'Chaos',    icon: '/category-icons/chaos.svg',    href: '/downloads/chaos-orders.pdf',    file: 'chaos-orders.pdf' },
    { key: 'imperium', label: 'Imperium', icon: '/category-icons/imperium.svg', href: '/downloads/imperial-orders.pdf', file: 'imperial-orders.pdf' },
    { key: 'xenos',    label: 'Xenos',    icon: '/category-icons/xenos.svg',    href: '/downloads/xenos-orders.pdf',    file: 'xenos-orders.pdf' },
  ];
  return (
    <div className="print:hidden" style={{ maxWidth: 760, margin: '14px auto 0', textAlign: 'center' }}>
      <div style={{ fontSize: '0.78rem', color: MUTED, marginBottom: 8 }}>
        <B text={CREDIT_TEXT[lang]} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
        {decks.map(d => (
          <a key={d.key} href={d.href} download={d.file}
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
  ru: { title: 'Полевое руководство · Быстрые правила', print: 'Печать / PDF', close: 'Закрыть' },
  ja: { title: 'フィールドマニュアル · クイックルール', print: '印刷 / PDF', close: '閉じる' },
};

/** Every subsequent section starts on its own printed page, while still exporting as one file. */
// ─────────────────────────────────────────────────────────────────────────
// FACTION REFERENCE — Prayers / Infernal Pacts / Psychic Disciplines
//
// Unlike every sheet above, these are NOT core rules: they are the loaded army's OWN psychic
// data, read live from the store (Rigzar, after a game: "hay que revisar bien las prayers...
// creemos unas hojas nuevas donde esten por separado prayers, pactos, poderes psiquicos etc
// para que haya facil acceso a ellas"). They render only when the army actually has that data,
// so a faction with no priest simply gets no Prayers page.
//
// Headings are translated; the entries themselves are printed verbatim from the codex data and
// stay in English, matching the convention used for every other datasheet in the app.
// ─────────────────────────────────────────────────────────────────────────

const FACTION_REF_TEXT: Record<Language, {
  prayersTitle: string; prayersSub: string;
  pactsTitle: string; pactsSub: string;
  discTitle: string; discSub: string;
  genTitle: string; genSub: string;
  range: string; target: string; duration: string; cast: string; complexity: string;
  noArmy: string;
}> = {
  en: {
    prayersTitle: 'PRAYERS', prayersSub: 'PRAYERS TO THE DARK GODS · YOUR ARMY',
    pactsTitle: 'INFERNAL PACTS', pactsSub: 'PACTS · YOUR ARMY',
    discTitle: 'PSYCHIC DISCIPLINES', discSub: 'POWERS · YOUR ARMY',
    genTitle: 'GENERAL PSYCHIC DISCIPLINES', genSub: 'CORE RULES · AVAILABLE TO EVERY PSYKER',
    range: 'Range', target: 'Target', duration: 'Duration', cast: 'Cast', complexity: 'Complexity',
    noArmy: 'Load an army to see its prayers, pacts and psychic powers here.',
  },
  de: {
    prayersTitle: 'GEBETE', prayersSub: 'GEBETE AN DIE DUNKLEN GÖTTER · DEINE ARMEE',
    pactsTitle: 'INFERNALISCHE PAKTE', pactsSub: 'PAKTE · DEINE ARMEE',
    discTitle: 'PSIONISCHE DISZIPLINEN', discSub: 'KRÄFTE · DEINE ARMEE',
    genTitle: 'ALLGEMEINE PSIONISCHE DISZIPLINEN', genSub: 'CORE RULES · FÜR JEDEN PSIONIKER',
    range: 'Reichweite', target: 'Ziel', duration: 'Dauer', cast: 'Cast', complexity: 'Komplexität',
    noArmy: 'Lade eine Armee, um hier ihre Gebete, Pakte und psionischen Kräfte zu sehen.',
  },
  es: {
    prayersTitle: 'REZOS', prayersSub: 'REZOS A LOS DIOSES OSCUROS · TU EJÉRCITO',
    pactsTitle: 'PACTOS INFERNALES', pactsSub: 'PACTOS · TU EJÉRCITO',
    discTitle: 'DISCIPLINAS PSÍQUICAS', discSub: 'PODERES · TU EJÉRCITO',
    genTitle: 'DISCIPLINAS PSÍQUICAS GENERALES', genSub: 'CORE RULES · DISPONIBLES PARA TODO PSÍQUICO',
    range: 'Alcance', target: 'Objetivo', duration: 'Duración', cast: 'Cast', complexity: 'Complejidad',
    noArmy: 'Carga un ejército para ver aquí sus rezos, pactos y poderes psíquicos.',
  },
  ru: {
    prayersTitle: 'МОЛИТВЫ', prayersSub: 'МОЛИТВЫ ТЁМНЫМ БОГАМ · ВАША АРМИЯ',
    pactsTitle: 'ИНФЕРНАЛЬНЫЕ ДОГОВОРЫ', pactsSub: 'ДОГОВОРЫ · ВАША АРМИЯ',
    discTitle: 'ПСИОНИЧЕСКИЕ ДИСЦИПЛИНЫ', discSub: 'СИЛЫ · ВАША АРМИЯ',
    genTitle: 'ОБЩИЕ ПСИОНИЧЕСКИЕ ДИСЦИПЛИНЫ', genSub: 'CORE RULES · ДОСТУПНЫ КАЖДОМУ ПСАЙКЕРУ',
    range: 'Дальность', target: 'Цель', duration: 'Длительность', cast: 'Сотворение', complexity: 'Сложность',
    noArmy: 'Загрузите армию, чтобы увидеть здесь её молитвы, договоры и псионические силы.',
  },
  ja: {
    prayersTitle: '祈祷', prayersSub: '暗黒の神々への祈祷 · あなたの軍',
    pactsTitle: '地獄の契約', pactsSub: '契約 · あなたの軍',
    discTitle: 'サイキック系統', discSub: 'パワー · あなたの軍',
    genTitle: '汎用サイキック系統', genSub: 'CORE RULES · すべてのサイカーが使用可能',
    range: '射程', target: '目標', duration: '持続', cast: '発動', complexity: '難度',
    noArmy: '軍を読み込むと、ここに祈祷、契約、サイキック・パワーが表示されます。',
  },
};

/** One prayer / pact / power, printed with every field the codex gives it. */
function PowerEntry({ p, T }: { p: Power; T: typeof FACTION_REF_TEXT['en'] }) {
  const meta = [
    p.type,
    p.range && p.range !== '-' ? `${T.range}: ${p.range}` : null,
    p.cast_value ? `${T.cast}: ${p.cast_value}` : null,
    p.target ? `${T.target}: ${p.target}` : null,
    p.duration ? `${T.duration}: ${p.duration}` : null,
    p.complexity ? `${T.complexity}: ${p.complexity}` : null,
  ].filter(Boolean).join('  ·  ');
  return (
    <div style={{ marginBottom: 10, paddingLeft: 12, borderLeft: `3px solid ${ACCENT}44`, breakInside: 'avoid' }}>
      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: ACCENT }}>{p.name}</div>
      {meta && (
        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: MUTED, marginTop: 1 }}>
          {meta}
        </div>
      )}
      {p.effect && <div style={{ fontSize: '0.86rem', lineHeight: 1.4, marginTop: 3 }}>{p.effect}</div>}
    </div>
  );
}

function RefCard({ title, sub, children }: { title: string; sub: string; children: ReactNode }) {
  return (
    <Card>
      <div style={{
        textAlign: 'center', fontFamily: 'Cinzel, Georgia, serif', fontWeight: 700,
        fontSize: '2rem', letterSpacing: '0.22em', color: ACCENT, marginBottom: 2,
      }}>{title}</div>
      <div style={{
        textAlign: 'center', fontSize: '0.72rem', textTransform: 'uppercase',
        letterSpacing: '0.18em', color: MUTED, marginBottom: 18,
      }}>{sub}</div>
      {children}
    </Card>
  );
}

function PrayersSheet({ lang, prayers }: { lang: Language; prayers: Power[] }) {
  const T = FACTION_REF_TEXT[lang];
  return (
    <RefCard title={T.prayersTitle} sub={T.prayersSub}>
      {prayers.map(p => <PowerEntry key={p.name} p={p} T={T} />)}
    </RefCard>
  );
}

function PactsSheet({ lang, pacts }: { lang: Language; pacts: Power[] }) {
  const T = FACTION_REF_TEXT[lang];
  return (
    <RefCard title={T.pactsTitle} sub={T.pactsSub}>
      {pacts.map(p => <PowerEntry key={p.name} p={p} T={T} />)}
    </RefCard>
  );
}

/**
 * One discipline page. `general` marks the Core Rules disciplines (Smite, Biomancy, Divination,
 * Pyromancy, Telekinesis, Telepathy) that every psyker may draw on -- they are titled apart from
 * the codex ones so a player can see at a glance which list a power came from.
 */
function DisciplineSheet({ lang, name, powers, general }:
    { lang: Language; name: string; powers: Power[]; general?: boolean }) {
  const T = FACTION_REF_TEXT[lang];
  return (
    <RefCard title={general ? T.genTitle : T.discTitle} sub={name}>
      {powers.map(p => <PowerEntry key={p.name} p={p} T={T} />)}
    </RefCard>
  );
}

function PageSection({ children }: { children: ReactNode }) {
  return <div style={{ pageBreakBefore: 'always', breakBefore: 'page' }}>{children}</div>;
}

export function CheatSheetModal({ onClose }: { onClose: () => void }) {
  const { language } = useLanguage();
  const T = TOOLBAR_TEXT[language];
  const [paperSize, setPaperSize] = usePaperSize();
  // The faction reference pages below are driven by whatever army is currently loaded, so the
  // Field Manual carries YOUR prayers/pacts/powers to the table alongside the core rules.
  const data = useArmyStore(s => s.data);
  const prayers = data?.prayers ?? [];
  const pacts = data?.pacts ?? [];
  const disciplines = Object.entries(data?.disciplines ?? {}).filter(([, ps]) => ps.length > 0);
  // Core Rules: "Psykers have access to the list of General Psychic Disciplines as well as those
  // listed in their respective Codex." These pages were missing at first -- the sheets only read
  // the faction's own disciplines, so the ~31 powers nearly every psyker shares had no page at all.
  // Necrons are the sole faction-wide exception (every psyker there is "knows all the powers from
  // the list of C'tan powers", with no generic-discipline wording anywhere) -- same rule the psychic
  // picker enforces in PsychicModal.tsx.
  const generalDisciplines = data && data.faction !== 'Necrons'
    ? Object.entries(GENERAL_DISCIPLINES).filter(([, ps]) => ps.length > 0)
    : [];

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
          {/* Faction reference — only the pages the loaded army actually has. */}
          {prayers.length > 0 && (
            <PageSection><PrayersSheet lang={language} prayers={prayers} /></PageSection>
          )}
          {pacts.length > 0 && (
            <PageSection><PactsSheet lang={language} pacts={pacts} /></PageSection>
          )}
          {generalDisciplines.map(([name, powers]) => (
            <PageSection key={`gen-${name}`}>
              <DisciplineSheet lang={language} name={name} powers={powers} general />
            </PageSection>
          ))}
          {disciplines.map(([name, powers]) => (
            <PageSection key={name}><DisciplineSheet lang={language} name={name} powers={powers} /></PageSection>
          ))}
        </div>
      </div>
    </div>
  ), document.body);
}
