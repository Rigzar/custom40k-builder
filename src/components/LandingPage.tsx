import { useState, useEffect, Fragment } from 'react';
import * as api from '../lib/api';
import { ChangelogModal } from './ChangelogModal';
import { LanguageSelector } from './LanguageSelector';
import { ThemeToggle } from './ThemeToggle';
import { TextSizeToggle } from './TextSizeToggle';
import { SupplementModal, type SupplementKey } from './SupplementModal';
import { FactionSymbol } from './FactionSymbol';
import { Avatar } from './Avatar';
import { MessagesModal, InquisitorBadge } from './MessagesModal';
import { useT, useLanguage, type Language } from '../i18n';
import { useAuth } from '../hooks/useAuth';
import type { SavedArmy } from '../hooks/useSavedArmies';
import { CHANGELOG, versionLabel } from '../data/changelog';
import { DiscordIcon, DISCORD_INVITE_URL } from './DiscordLink';

const ANNOUNCEMENT_KEY = 'c40k_announcement_v187g_dismissed';

// v1.80 (2026-09-30) is a REAL version cut, so per [[feedback_version_cut_banner_scope]] this
// banner is RESET to ONLY v1.80's own content. Everything v1.78 announced lives on in the
// changelog modal; a reader who dismissed that card must not be shown its fixes again.
//
// LAYOUT (unchanged from v1.77, and it took two rounds to get there). Rigzar: "el banner da mucha
// info basura, da ladilla leerlo... GH#xxx ahora puede hacer tal cosa, resuelto", then "que se vea
// mas ordenado", then "es posible que los titulos sean pestanas desplegables? asi pueden estar
// todas compactas y la gente abre el que quiere".
//
// So: COLLAPSIBLE SECTIONS, each a two-column list, one clause per row, and the count on the
// header so a closed section still says how much is behind it. Keep each line to a single clause;
// anything needing a "because" belongs in the changelog.
//
// THE SECTIONS ARE BY SOURCE, and that is the whole point of having them. v1.78 first shipped
// with one "What changed" block holding everything, and Rigzar: "si antes estaba ordenado lo de
// las pestanitas del banner, ahora lo cambiaste? la gente tiene que saber que se reparo de
// github, que de discord etc... no todo en un mismo bloque, por algo creamos solapar pestanas".
// Right: a reader who filed an issue wants to know whether THEIRS was fixed, and someone who
// reported on Discord wants the same, and "we re-read the codices" is a different kind of news
// from either. One block answers none of those questions. Keep a section per source.
//
// A SECTION THAT ASKS, not just tells. Rigzar posted three open questions to the Discord bug
// channel to reach the people who filed them, and: "en el discord no lo van a ver... mi idea, una
// pequena pregunta con un link directo al github o al canal de los bugs". A question buried in a
// chat scrolls away in an hour and nobody opens a GitHub issue they did not file, so the ask goes
// where the reporter already is — on the front page, with the issue one click away. A row with a
// third element renders its source cell as a link.
//
// KEEP THIS SECTION EMPTY WHEN THERE IS NOTHING TO ASK. It only works while it is short and every
// line is genuinely blocked on a reader; a standing list of five is furniture.
//
// Append follow-ups to the right section while v1.78 stays open and bump ANNOUNCEMENT_KEY, or
// readers who dismissed the card never see the new ones.
/** `[source, what changed]`, or `[source, what we need, href]` for a row that asks the reader
 *  something. The href turns the source cell into a link — see the note beside ANNOUNCEMENT_TEXT. */
type AnnouncementRow = [string, string] | [string, string, string];
type AnnouncementSection = { label: string; rows: AnnouncementRow[] };
type AnnouncementLang = { title: string; intro: string; install: string; sections: AnnouncementSection[]; contrib: string; };
const ANNOUNCEMENT_TEXT: Record<Language, AnnouncementLang> = {
  en: {
    title: "{v}: New faction Knight Households, Core Rules 1.40",
    intro: "Plus Save as copy, rule tips on unit types, and fixes from the new players.",
    install: "",
    sections: [
      { label: "General", rows: [
        ["Hover","Hover (or tap) a weapon type such as Pistol or Assault, or a rule named in quotes inside an ability, to read its rule."],
        ["Legacies","A list in the army setup shows what every Legacy does."],
        ["Text size","New A/A button on the front page: 115% or 130%, without breaking the layout."],
        ["Psychic powers","The General discipline is listed, with Smite as always known."],
        ["My Armies","New Duplicate button: keep the old list and carry on with a copy."],
        ["Unit types","Hover (or tap) Infantry, Bike, Walker... on a unit card to read its rule."],
        ["Thousand Sons","Lord of the Silver Tower now shows its Coruscating beam in print and battle view."],
        ["Knights","Reputations can be picked again: the Veteran button no longer opens an empty list."],
        ["Factions","The faction list under Build Army is alphabetical."],
        ["Build Army","It now always opens a window with a My Armies button that shows your lists; click one to keep editing."],
        ["Opening lists","Opening another list while one is open asks first: save, open without saving, or cancel."],
      ] },
      { label: "Knight Households", rows: [
        ["New","New: 15 units, Armory with Reputations and two Archetypes, Freeblade and Chaos Knights."],
      ] },
      { label: "Core Rules 1.40", rows: [
        ["1.40","Welcome introduction, Knight Households in the codex list, and the Leagues of Votann are Battle Brothers with themselves."],
      ] },
      { label: "Weapons", rows: [
        ["Options","A Cyclone missile launcher no longer adds a plain Missile launcher; \"X with Y\" options show both profiles."],
      ] },
      { label: "Imperial Guard", rows: [
        ["Bug reports","Abhuman Auxiliaries is a tick-box per creature unit; a bought Heavy stubber shows after a swap; the Sentinel chainsaw costs +15 per Sentinel."],
      ] },
      { label: "Genestealer Cults", rows: [
        ["Ringleader","Two different Ringleader units (Magus, Primus, Acolyte Iconward) share one HQ slot."],
        ["Primus","Synaptic Resonance is psykers only, so the Primus stays at 40 points."],
      ] },
      { label: "Wiki", rows: [
        ["Units button","Looks like the other buttons now."],
        ["Links","Seven broken unit links fixed, including the Corsairs; rules named in quotes show their text on hover."],
      ] },
    ],
    contrib: "\ud83d\udc41\ufe0f Found something wrong? The in-app bug report form works \u2014 unit, engagement, archetype and a picture.",
  },
  de: {
    title: "{v}: Neue Fraktion Knight Households, Core Rules 1.40",
    intro: "Dazu Als Kopie speichern, Regel-Tooltips für Einheitentypen und Korrekturen aus den Meldungen neuer Spieler.",
    install: "",
    sections: [
      { label: "Allgemein", rows: [
        ["Mauszeiger","Fahre über einen Waffentyp wie Pistol oder Assault (oder tippe darauf) oder über eine in Anführungszeichen genannte Regel in einer Fähigkeit, um die Regel zu lesen."],
        ["Vermächtnisse","Eine Liste in der Armee-Einrichtung zeigt, was jedes Vermächtnis bewirkt."],
        ["Textgröße","Neuer A/A-Knopf auf der Startseite: 115 % oder 130 %, ohne das Layout zu zerstören."],
        ["Psychische Kräfte","Die allgemeine Disziplin wird angezeigt, Smite als immer bekannt."],
        ["Meine Armeen","Neuer Button Duplizieren: die alte Liste behalten und mit einer Kopie weitermachen."],
        ["Einheitentypen","Fahre auf der Einheitenkarte über Infanterie, Bike, Läufer... (oder tippe darauf), um die Regel zu lesen."],
        ["Thousand Sons","Lord of the Silver Tower zeigt seinen Coruscating beam jetzt in Druck- und Schlachtansicht."],
        ["Knights","Reputationen lassen sich wieder wählen: Der Veteran-Knopf öffnet keine leere Liste mehr."],
        ["Fraktionen","Die Fraktionsliste unter Armee bauen ist alphabetisch."],
        ["Armee bauen","Öffnet jetzt immer ein Fenster mit dem Knopf Meine Armeen, der deine Listen zeigt; ein Klick zum Weiterbearbeiten."],
        ["Listen öffnen","Beim Öffnen einer anderen Liste wird gefragt: speichern, ohne Speichern öffnen oder abbrechen."],
      ] },
      { label: "Knight Households", rows: [
        ["Neu","Neu: 15 Einheiten, Arsenal mit Reputationen und zwei Archetypen, Freeblade und Chaos Knights."],
      ] },
      { label: "Kernregeln 1.40", rows: [
        ["1.40","Einleitung „Welcome“, Knight Households in der Codex-Liste, und die Leagues of Votann sind mit sich selbst Battle Brothers."],
      ] },
      { label: "Waffen", rows: [
        ["Optionen","Ein Cyclone missile launcher fügt keinen einfachen Missile launcher mehr hinzu; „X with Y“-Optionen zeigen beide Profile."],
      ] },
      { label: "Imperial Guard", rows: [
        ["Fehlerberichte","Abhuman Auxiliaries ist ein Kästchen je Kreatur-Einheit; ein gekaufter Heavy stubber erscheint nach einem Tausch; die Sentinel-Kettensäge kostet +15 pro Sentinel."],
      ] },
      { label: "Genestealer Cults", rows: [
        ["Ringleader","Zwei verschiedene Ringleader-Einheiten (Magus, Primus, Acolyte Iconward) teilen sich einen HQ-Platz."],
        ["Primus","Synaptic Resonance gibt es nur für Psyker, der Primus bleibt bei 40 Punkten."],
      ] },
      { label: "Wiki", rows: [
        ["Units-Knopf","Sieht jetzt aus wie die anderen Knöpfe."],
        ["Links","Sieben kaputte Einheiten-Links repariert, auch die Corsairs; in Anführungszeichen genannte Regeln zeigen ihren Text beim Darüberfahren."],
      ] },
    ],
    contrib: "\ud83d\udc41\ufe0f Etwas gefunden, das nicht stimmt? Das Fehlerformular in der App funktioniert \u2014 Einheit, Engagement, Archetyp und ein Bild.",
  },
  es: {
    title: "{v}: Nueva facción Knight Households, Core Rules 1.40",
    intro: "Además, Guardar como copia, reglas al pasar el ratón por los tipos de unidad y arreglos de los jugadores nuevos.",
    install: "",
    sections: [
      { label: "General", rows: [
        ["Ratón","Pasa el ratón (o toca) un tipo de arma como Pistol o Assault, o una regla nombrada entre comillas dentro de una habilidad, para leer su regla."],
        ["Legados","Una lista en la configuración del ejército muestra qué hace cada Legado."],
        ["Tamaño del texto","Botón nuevo A/A en la portada: 115 % o 130 %, sin romper el diseño."],
        ["Poderes psíquicos","Se muestra la disciplina General, con Smite siempre conocido."],
        ["Mis ejércitos","Nuevo botón Duplicar: conserva la lista antigua y sigue con una copia."],
        ["Tipos de unidad","Pasa el ratón (o toca) Infantería, Moto, Caminante... en la ficha para leer su regla."],
        ["Thousand Sons","Lord of the Silver Tower ya muestra su Coruscating beam en impresión y vista de batalla."],
        ["Knights","Las Reputations se pueden elegir otra vez: el botón Veteran ya no abre una lista vacía."],
        ["Facciones","La lista de facciones de Construir ejército está en orden alfabético."],
        ["Construir ejército","Ahora abre siempre una ventana con un botón Mis ejércitos que muestra tus listas; un clic para seguir editando."],
        ["Abrir listas","Al abrir otra lista con una abierta, pregunta: guardar, abrir sin guardar o cancelar."],
      ] },
      { label: "Knight Households", rows: [
        ["Nuevo","Nuevo: 15 unidades, Armería con Reputaciones y dos Arquetipos, Freeblade y Chaos Knights."],
      ] },
      { label: "Reglas Base 1.40", rows: [
        ["1.40","Introducción «Welcome», Knight Households en la lista de códices, y las Leagues of Votann son Battle Brothers consigo mismas."],
      ] },
      { label: "Armas", rows: [
        ["Opciones","Un Cyclone missile launcher ya no añade un Missile launcher normal; las opciones «X with Y» muestran los dos perfiles."],
      ] },
      { label: "Imperial Guard", rows: [
        ["Reportes de errores","Abhuman Auxiliaries es una casilla por unidad criatura; un Heavy stubber comprado se muestra tras un cambio; la sierra del Sentinel cuesta +15 por Sentinel."],
      ] },
      { label: "Genestealer Cults", rows: [
        ["Ringleader","Dos unidades Ringleader distintas (Magus, Primus, Acolyte Iconward) comparten un slot de HQ."],
        ["Primus","Synaptic Resonance es solo para psíquicos, así que el Primus se queda en 40 puntos."],
      ] },
      { label: "Wiki", rows: [
        ["Botón Units","Ahora se ve como los demás botones."],
        ["Enlaces","Siete enlaces de unidades rotos arreglados, incluidos los Corsairs; las reglas nombradas entre comillas muestran su texto al pasar el ratón."],
      ] },
    ],
    contrib: "\ud83d\udc41\ufe0f \u00bfEncontraste algo mal? El formulario de reporte de la app funciona \u2014 unidad, engagement, arquetipo y una foto.",
  },
  ru: {
    title: "{v}: Новая фракция Knight Households, Core Rules 1.40",
    intro: "А также «Сохранить как копию», подсказки о типах юнитов и исправления по сообщениям новых игроков.",
    install: "",
    sections: [
      { label: "Общее", rows: [
        ["Наведение","Наведите (или коснитесь) на тип оружия вроде Pistol или Assault либо на правило в кавычках внутри способности, чтобы прочитать его."],
        ["Наследия","Список в настройке армии показывает, что делает каждое Наследие."],
        ["Размер текста","Новая кнопка A/A на главной странице: 115 % или 130 %, раскладка не ломается."],
        ["Психические силы","Показана общая дисциплина, Smite — всегда известна."],
        ["Мои армии","Новая кнопка «Дублировать»: сохраните старый список и продолжайте с копией."],
        ["Типы юнитов","Наведите (или коснитесь) Пехота, Мотоцикл, Ходун... в карточке, чтобы прочитать правило."],
        ["Thousand Sons","Lord of the Silver Tower теперь показывает Coruscating beam в печати и в режиме боя."],
        ["Knights","Репутации снова можно выбрать: кнопка Veteran больше не открывает пустой список."],
        ["Фракции","Список фракций в «Собрать армию» отсортирован по алфавиту."],
        ["Собрать армию","Теперь всегда открывает окно с кнопкой «Мои армии», показывающей ваши списки; клик, чтобы продолжить правку."],
        ["Открытие списков","При открытии другого списка спрашивает: сохранить, открыть без сохранения или отменить."],
      ] },
      { label: "Knight Households", rows: [
        ["Новое","Новое: 15 юнитов, арсенал с Репутациями и два Архетипа — Freeblade и Chaos Knights."],
      ] },
      { label: "Основные правила 1.40", rows: [
        ["1.40","Вступление «Welcome», Knight Households в списке кодексов, Leagues of Votann с самими собой — Battle Brothers."],
      ] },
      { label: "Оружие", rows: [
        ["Опции","Cyclone missile launcher больше не добавляет обычный Missile launcher; опции «X with Y» показывают оба профиля."],
      ] },
      { label: "Imperial Guard", rows: [
        ["Отчёты об ошибках","Abhuman Auxiliaries — флажок на каждом юните-существе; купленный Heavy stubber виден после замены; цепная пила Sentinel стоит +15 за каждого Sentinel."],
      ] },
      { label: "Genestealer Cults", rows: [
        ["Ringleader","Два разных юнита с Ringleader (Magus, Primus, Acolyte Iconward) делят один слот HQ."],
        ["Primus","Synaptic Resonance только для псайкеров, поэтому Primus остаётся за 40 очков."],
      ] },
      { label: "Вики", rows: [
        ["Кнопка Units","Теперь выглядит как остальные кнопки."],
        ["Ссылки","Исправлены семь сломанных ссылок на юниты, включая Corsairs; правила в кавычках показывают текст при наведении."],
      ] },
    ],
    contrib: "👁️ Нашли ошибку? Форма отчёта об ошибках в приложении работает — отряд, формат боя, архетип и картинка.",
  },
  ja: {
    title: "{v}: 新勢力 Knight Households、Core Rules 1.40",
    intro: "さらに「コピーとして保存」、ユニットタイプのルール表示、新規プレイヤーからの報告の修正。",
    install: "",
    sections: [
      { label: "全般", rows: [
        ["ホバー","Pistol や Assault などの武器タイプ、または能力内の引用符付きルールに重ねる（タップする）と、そのルールが読めます。"],
        ["レガシー","軍の設定の一覧で、各レガシーの効果が分かります。"],
        ["文字サイズ","トップページに新しい A/A ボタン：115% または 130%、レイアウトは崩れません。"],
        ["サイキックパワー","一般ディシプリンが表示され、Smite は常に習得済みです。"],
        ["マイアーミー","新しい「複製」ボタン：古いリストを残して、コピーで作業を続けられます。"],
        ["ユニットタイプ","ユニットカードの歩兵・バイク・ウォーカーなどにカーソルを合わせる（またはタップ）とルールが読めます。"],
        ["Thousand Sons","Lord of the Silver Tower の Coruscating beam が印刷とバトルビューに表示されます。"],
        ["ナイト","Reputation を再び選べます。Veteran ボタンが空のリストを開かなくなりました。"],
        ["勢力","「軍勢を作る」の勢力リストがアルファベット順になりました。"],
        ["軍勢を作る","常にウィンドウが開き、リストを表示する「マイアーミー」ボタンから編集を続けられます。"],
        ["リストを開く","別のリストを開くときに、保存・保存せず開く・キャンセルを確認します。"],
      ] },
      { label: "Knight Households", rows: [
        ["新規","新規：15 ユニット、名声付きアーモリー、アーキタイプ 2 つ（Freeblade と Chaos Knights）。"],
      ] },
      { label: "基本ルール 1.40", rows: [
        ["1.40","導入「Welcome」、コデックス一覧に Knight Households、Leagues of Votann 同士は Battle Brothers に。"],
      ] },
      { label: "武器", rows: [
        ["オプション","Cyclone missile launcher が通常の Missile launcher を追加しなくなり、「X with Y」オプションは両方のプロファイルを表示します。"],
      ] },
      { label: "Imperial Guard", rows: [
        ["不具合報告","Abhuman Auxiliaries はクリーチャーユニットごとのチェックボックス。買った Heavy stubber は交換後も表示。Sentinel のチェーンソーは 1 体につき +15。"],
      ] },
      { label: "Genestealer Cults", rows: [
        ["Ringleader","異なる Ringleader ユニット 2 つ（Magus、Primus、Acolyte Iconward）が HQ 枠を 1 つ共有します。"],
        ["Primus","Synaptic Resonance はサイカー専用なので、Primus は 40 ポイントのままです。"],
      ] },
      { label: "Wiki", rows: [
        ["Units ボタン","他のボタンと同じ見た目になりました。"],
        ["リンク","壊れていたユニットのリンク 7 件（Corsairs を含む）を修正。引用符付きのルールは重ねると文章が表示されます。"],
      ] },
    ],
    contrib: "👁️ 間違いを見つけましたか？アプリ内の不具合報告フォームをご利用ください — 部隊、交戦規模、アーキタイプ、画像を添えられます。",
  },
};
/* canvas-smoke placeholder — wire up here when user provides the effect */

function BoldSplitLine({ text }: { text: string }) {
  const parts = text.split(' — ');
  if (parts.length < 2) return <p>{text}</p>;
  return <p><strong className="text-emerald-400">{parts[0]}</strong> — {parts.slice(1).join(' — ')}</p>;
}

function ClipSvg() {
  return (
    <svg width="14" height="22" viewBox="0 0 14 22" fill="none" aria-hidden="true">
      <rect x="1.5" y="0.5" width="11" height="15" rx="2.5" stroke="#52525b" strokeWidth="1.5" fill="#27272a"/>
      <rect x="4"   y="7"   width="6"  height="15" rx="1.5" stroke="#3f3f46" strokeWidth="1.5" fill="#3f3f46"/>
    </svg>
  );
}

function CommunityAnnouncement() {
  const { language } = useLanguage();
  const tt = useT();
  const tClose = tt('close');
  const tx = ANNOUNCEMENT_TEXT[language];
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(ANNOUNCEMENT_KEY) === 'true'
  );
  // The announcement opens FOLDED to its title line and a "Show the changes (N)" button (Rigzar, 2026-10-25: "el banner puede salir
  // plegado, es lo mas sano": fourteen faction headers are a long block at the top of the page). If the reader opens it, that is
  // remembered for THIS announcement only (it stores the key it was opened for), so the next announcement is folded again.
  const [folded, setFolded] = useState(() => { try { return localStorage.getItem('c40k_announcement_open') !== ANNOUNCEMENT_KEY; } catch { return true; } });
  const toggleFolded = () => setFolded(f => { const n = !f; try { n ? localStorage.removeItem('c40k_announcement_open') : localStorage.setItem('c40k_announcement_open', ANNOUNCEMENT_KEY); } catch { /* private window */ } return n; });
  if (dismissed) return null;
  return (
    <div className="relative mb-6">
      {/* Space for skull above the card */}
      <div className="h-14" />

      {/* Servo skull — large, centered, appears to hold the card from above */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 pointer-events-none select-none">
        <div className="relative inline-block w-28 h-28">
          <img
            src="/servo-skull.png"
            alt=""
            className="w-28 h-28 object-contain drop-shadow-[0_4px_20px_rgba(180,83,9,0.45)]"
            draggable={false}
          />
          <div className="servo-eye" aria-hidden="true" />
        </div>
      </div>

      {/* Binder clips at card top edge, connecting skull to document */}
      <div className="absolute top-14 left-0 right-0 flex justify-between px-8 z-10 pointer-events-none select-none">
        <ClipSvg /><ClipSvg /><ClipSvg />
      </div>

      {/* Ordo card — pt-14 so content clears the skull overlap */}
      <div className="bg-zinc-900 border border-zinc-700 border-t-2 border-t-amber-900/80 px-5 pt-14 pb-4">
        <div className="flex justify-between items-start gap-4">
          <button
            onClick={toggleFolded}
            aria-expanded={!folded}
            title={folded ? tt('playExpandAll') : tt('playCollapseAll')}
            className="flex-1 text-left text-[10px] text-amber-600 hover:text-amber-500 uppercase tracking-widest font-semibold mb-2 flex items-center gap-1.5 transition-colors"
          >
            <span className="opacity-60">⚙</span>
            <span>{tx.title.replace('{v}', 'v' + versionLabel(CHANGELOG[0]?.version))}</span>
            {/* A visible button, not a bare arrow: it has to be obvious that the card folds, and that the changes are inside it. */}
            <span className="ml-auto shrink-0 border border-amber-700/70 bg-amber-900/20 px-2 py-0.5 text-[10px] normal-case tracking-normal text-amber-400">
              {folded ? `${tt('bannerShow')} (${tx.sections.reduce((n, sec) => n + sec.rows.length, 0)}) ▾` : `${tt('bannerHide')} ▴`}
            </span>
          </button>
          <button
            onClick={() => { localStorage.setItem(ANNOUNCEMENT_KEY, 'true'); setDismissed(true); }}
            className="text-red-500 hover:text-red-300 text-lg leading-none shrink-0 transition-colors"
            title={tClose}
          >
            ×
          </button>
        </div>
        {/* The subtitle is always shown, folded or not. */}
        <p className="text-[12px] text-zinc-400 mb-2">{tx.intro}</p>
        {!folded && <div className="text-[12px] text-zinc-300 leading-relaxed space-y-2">
          {/* `install` is a highlighted block used only when a release leads with the PWA/offline
              news; empty on releases that don't (skipped so it leaves no gap). */}
          {tx.install && (
            <p className="border-l-2 border-emerald-600/70 bg-emerald-950/20 pl-3 py-2 text-zinc-200">
              {tx.install}
            </p>
          )}
          {/* v1.72 is a REAL version cut, so this banner carries ONLY v1.72's own content;
              v1.75's lines were removed -- see [[feedback_version_cut_banner_scope]]. Append
              here while v1.76 is open; cut a fresh banner when a new version is cut. */}
          {/* Sections, each a COLLAPSED two-column list. Rigzar: "es posible que los titulos sean
              pestanas desplegables? asi pueden estar todas compactas y la gente abre el que quiere".
              So the card opens as three headers and nothing else, and you open the one you care
              about. The COUNT is on the header for that reason — a closed section still has to tell
              you how much is behind it, or there is no reason to open it.

              Native <details>, not React state: it keeps its own open/closed, it is keyboard- and
              screen-reader-operable for free, and Ctrl+F still finds text inside a closed one in
              Chrome. The marker is hidden explicitly rather than relying on `display:flex`
              dropping it, which only some browsers do. */}
          {tx.sections.map(sec => (
            <details key={sec.label} className="group pt-1">
              <summary className="cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden flex items-center gap-2 py-1">
                <span className="text-[10px] uppercase tracking-widest text-amber-600/90 font-semibold shrink-0 group-hover:text-amber-500 transition-colors">
                  {sec.label}
                </span>
                <span className="text-[10px] text-zinc-500 tabular-nums shrink-0">{sec.rows.length}</span>
                <span className="flex-1 h-px bg-zinc-700/60" />
                <span className="text-[10px] text-zinc-500 shrink-0 transition-transform group-open:rotate-180">▾</span>
              </summary>
              <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 items-baseline pt-1 pb-1">
                {sec.rows.map(([src, fix, href], i) => (
                  <Fragment key={i}>
                    {/* No `whitespace-nowrap`: a long label ("Close Combat Specialists") would hold the
                        column open and squeeze the fix into a sliver on a phone. A GH number has no
                        space in it, so it never wraps anyway. */}
                    {href
                      ? <a href={href} target="_blank" rel="noopener noreferrer"
                           className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold tabular-nums max-w-[9rem] underline decoration-amber-700/60 underline-offset-2 transition-colors">
                          {/* JSX TEXT IS NOT A JS STRING: a "\u2197" written here prints those six
                              characters, which is what the first version of this line did. Wrapped
                              in braces it is a real string literal and decodes. */}
                          {src} {'\u2197'}
                        </a>
                      : <span className="text-[11px] text-emerald-400 font-semibold tabular-nums max-w-[9rem]">{src}</span>}
                    <span className="text-[11.5px] text-zinc-300 leading-snug">{fix}</span>
                  </Fragment>
                ))}
              </div>
            </details>
          ))}
          <p className="text-zinc-400">{tx.contrib}</p>
        </div>}
      </div>
    </div>
  );
}

/** Separate, admin-authored announcement banner (from the DB), shown BELOW the release-notes card. */
/** Stable 32-bit hash of a string — used to key an announcement's dismissal by its CONTENT. */
/** Single key holding the content-hash of the admin announcement this browser dismissed. */
const ADMIN_ANN_DISMISSED_KEY = 'c40k_admin_ann_dismissed_hash';

/** Shown at the foot of every admin announcement — see the comment where it is rendered. */
const BROKEN_LIST_NOTE: Record<Language, string> = {
  en: '⚠️ A unit renamed to match the codex can disappear from a list that already contained it. If one of your lists comes back wrong, tell us on Discord and send us its .json — we will repair it and send it back.',
  de: '⚠️ Eine Einheit, die an den Codex angeglichen und dabei umbenannt wurde, kann aus einer Liste verschwinden, die sie bereits enthielt. Falls eine deiner Listen falsch zurückkommt, sag uns auf Discord Bescheid und schick uns ihre .json — wir reparieren sie und schicken sie zurück.',
  es: '⚠️ Una unidad renombrada para cuadrar con el códex puede desaparecer de una lista que ya la tenía. Si alguna de tus listas vuelve mal, dínoslo en Discord y mándanos su .json — te la arreglamos y te la devolvemos.',
  ru: '⚠️ Отряд, переименованный в соответствии с кодексом, может исчезнуть из списка, где он уже был. Если какой-то из ваших списков вернулся неправильным, сообщите нам в Discord и пришлите его .json — мы починим его и вернём.',
  ja: '⚠️ コデックスに合わせて名称変更された部隊が、すでにそれを含んでいたリストから消えることがあります。リストが正しく戻らなかった場合は、Discordでお知らせのうえ .json を送ってください — 修復してお返しします。',
};

function hashString(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

function AdminAnnouncement({ setting }: { setting: api.AnnouncementSetting | null }) {
  const { language } = useLanguage();
  const tClose = useT()('close');
  // Dismissal is keyed off the announcement's CONTENT, and stored as the hash of the announcement
  // that was dismissed under ONE stable key. Earlier versions wrote a separate `..._<hash>_dismissed`
  // flag per announcement, which meant a browser that had dismissed anything under the older
  // scheme (where the key fell back to the literal 'default') kept a permanent "true" lying around
  // and could keep hiding banners. Storing the dismissed hash instead makes it self-healing: the
  // banner is hidden only while the CURRENT content hash equals the stored one, so writing a new
  // announcement — or editing an existing one — always shows it again, on every existing browser.
  const contentHash = setting
    ? hashString((setting.version || '') + JSON.stringify(setting.text ?? {}))
    : null;
  const [dismissedHash, setDismissedHash] = useState<string | null>(null);

  // The setting arrives asynchronously from /api/settings, so the hash is unknown on first render.
  // Re-read the stored value whenever it changes, or the initial (empty) state would stick.
  useEffect(() => {
    setDismissedHash(localStorage.getItem(ADMIN_ANN_DISMISSED_KEY));
  }, [contentHash]);
  const dismissed = !!contentHash && dismissedHash === contentHash;

  if (!setting || setting.enabled === false) return null;
  const t = setting.text?.[language] ?? setting.text?.en;
  const lines = (t?.lines ?? []).filter(Boolean);
  if (!t || (!t.title && !t.intro && lines.length === 0)) return null;   // nothing to show
  if (dismissed) return null;
  return (
    <div className="relative mb-6 bg-zinc-900 border border-sky-900/70 border-l-2 border-l-sky-500/80 px-5 py-4">
      <div className="flex justify-between items-start gap-4">
        <div className="text-[10px] text-sky-400 uppercase tracking-widest font-semibold mb-2 flex items-center gap-1.5">
          <span className="opacity-80">📣</span>
          {t.title}
        </div>
        <button
          onClick={() => {
            if (contentHash) localStorage.setItem(ADMIN_ANN_DISMISSED_KEY, contentHash);
            setDismissedHash(contentHash);
          }}
          className="text-red-500 hover:text-red-300 text-lg leading-none shrink-0 transition-colors"
          title={tClose}
        >×</button>
      </div>
      <div className="text-[12px] text-zinc-300 leading-relaxed space-y-2">
        {t.intro && <p>{t.intro}</p>}
        {lines.map((line, i) => <BoldSplitLine key={i} text={line} />)}
        {t.contrib && <p className="text-zinc-400">{t.contrib}</p>}
        {/* Standing support note, carried by every admin announcement: renaming a unit to match the
            codex orphans it in lists that already contain it, and the player can't tell that's what
            happened. Say so once, in the place everyone reads, with the way to get it fixed. */}
        <p className="text-[11px] text-zinc-500 border-t border-zinc-800 pt-2">{BROKEN_LIST_NOTE[language] ?? BROKEN_LIST_NOTE.en}</p>
        {setting.author && (
          <p className="text-[11px] text-zinc-500 flex items-center gap-1.5 pt-1">
            — <span className="text-amber-400">{setting.author}</span>
            <InquisitorBadge label="Inquisitor" />
          </p>
        )}
      </div>
    </div>
  );
}

function formatDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
}

/**
 * The front door — logo, release notes, the admin announcement, quick-load and the supplements.
 *
 * It used to be all three of those AND a hidden three-state machine (`hero` → `setup` → `config`)
 * that carried Battle Setup, faction selection and Army Customisation, with the app's own
 * navigation bar switched off the whole time. Those two screens are real steps now
 * (`FactionStep` and App's Config step), so this component only owns the front door.
 */
interface Props {
  saves: SavedArmy[];
  /** Fetched once in App and passed down, so the settings endpoint is hit exactly once. */
  announcement: api.AnnouncementSetting | null;
  /** True when there is a faction picked and units on the table — offers "continue" over "start". */
  canResume: boolean;
  onStart: () => void;
  onResume: () => void;
  onLoadArmy: (save: SavedArmy) => void;
  onShowAuth: () => void;
  onShowCloudSaves?: () => void;
  onShowCommunity?: () => void;
  onShowCampaign?: () => void;
  onShowEvents?: () => void;
  onShowGitfinda?: () => void;
  onShowCheatSheets: () => void;
}

export function LandingPage({
  saves, announcement, canResume,
  onStart, onResume, onLoadArmy, onShowAuth, onShowCloudSaves, onShowCommunity, onShowCheatSheets,
  onShowCampaign,
  onShowEvents,
  onShowGitfinda,
}: Props) {
  const { language: wikiLang } = useLanguage();
  // The wiki is built once per language (en at the root, the others under /<code>).
  const wikiBase = 'https://custom40k-wiki.vercel.app' + (wikiLang === 'en' ? '' : '/' + wikiLang);
  const [showChangelog, setShowChangelog] = useState(false);
  // The fog is a pre-rendered image (see .fog-layer in index.css): no filter, no animation.
  const [openSupplement, setOpenSupplement] = useState<SupplementKey | null>(null);
  const [showMessages, setShowMessages] = useState(false);
  const [unread, setUnread] = useState(0);
  const latestVersion = CHANGELOG[0]?.version ?? '';
  const t = useT();
  const { loggedIn, username, avatar } = useAuth();
  const refreshUnread = () => { api.getUnreadCount().then(r => setUnread(r.count)).catch(() => {}); };
  useEffect(() => { if (loggedIn) refreshUnread(); else setUnread(0); }, [loggedIn]);
  // Gitfinda: how many unread chat messages / fresh matches are waiting, shown on its button.
  const [gfUnread, setGfUnread] = useState(0);
  useEffect(() => {
    if (!loggedIn) return;
    const load = () => api.gitfindaUnread().then(r => setGfUnread(r.unread)).catch(() => {});
    load();
    const id = setInterval(() => { if (!document.hidden) load(); }, 180000);
    return () => clearInterval(id);
  }, [loggedIn]);

  const displaySaves = saves.filter(s => s.id !== 'autosave-session' && !s.id.startsWith('autosave'));

  return (
      <div className="relative min-h-screen bg-zinc-950 text-zinc-100 flex flex-col overflow-hidden">
        <div className="fog-layer" />

        {/* Top bar */}
        <div className="relative z-10 flex justify-between items-center px-5 py-3 border-b border-zinc-900">
          <div className="flex items-center gap-1">
            <LanguageSelector />
            <ThemeToggle />
            <TextSizeToggle />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowChangelog(true)}
              className="text-[11px] uppercase tracking-wide text-zinc-500 hover:text-amber-400 transition-colors"
            >
              v{versionLabel(latestVersion)}
            </button>
          </div>
        </div>

        {showChangelog && <ChangelogModal onClose={() => setShowChangelog(false)} />}
        {showMessages && <MessagesModal onClose={() => { setShowMessages(false); refreshUnread(); }} />}

        {/* Center content */}
        <div className="relative z-10 flex flex-col items-center pt-14 pb-8 px-6">

          {/* Logo */}
          <img
            src="/custom40k-logo.png"
            alt="Custom40k"
            className="w-64 sm:w-80 mb-8 object-contain select-none logo-glitch"
            draggable={false}
          />

          {/* Ornamental divider */}
          <div className="flex items-center gap-3 w-full max-w-xs mb-8 anim-divider anim-delay-1">
            <div className="flex-1 h-px bg-amber-900/50" />
            <div className="w-1.5 h-1.5 bg-amber-800 rotate-45 shrink-0" />
            <div className="flex-1 h-px bg-amber-900/50" />
          </div>

          {/* Announcement — always first after title */}
          <div className="w-full mb-2 anim-fade-up anim-delay-2">
            <CommunityAnnouncement />
            <AdminAnnouncement setting={announcement} />
          </div>

          {/* Quick-load: saved armies */}
          {displaySaves.length > 0 && (
            <div className="w-full max-w-xs mb-6 anim-fade-up anim-delay-3">
              <div className="text-[10px] uppercase tracking-widest text-zinc-600 mb-2 text-center">
                {t('savedArmies')}
              </div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {displaySaves.slice(0, 4).map(save => (
                  <button
                    key={save.id}
                    onClick={() => onLoadArmy(save)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 bg-zinc-900 border border-zinc-800 hover:border-amber-800/60 hover:bg-zinc-800 transition-colors text-left"
                  >
                    <FactionSymbol factionKey={save.factionKey} size={22} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] text-zinc-200 truncate">{save.name}</div>
                      <div className="text-[10px] text-zinc-500">{save.totalPts} pts · {formatDate(save.savedAt)}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}


          {/* Action buttons 2×2 */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-xs anim-fade-up anim-delay-4">
            <a
              href={wikiBase}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-sweep flex items-center justify-center gap-2 py-3 px-4 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-zinc-100 text-[12px] uppercase tracking-wider transition-colors"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              {t('navWiki')}
            </a>

            <button
              onClick={() => loggedIn ? onShowCloudSaves?.() : onShowAuth()}
              className="btn-sweep flex items-center justify-center gap-2 py-3 px-4 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-zinc-100 text-[12px] uppercase tracking-wider transition-colors"
            >
              {loggedIn && username
                ? <Avatar username={username} avatar={avatar} size={18} />
                : <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              }
              {loggedIn ? (username ?? 'Account') : t('navLoginSignIn')}
            </button>

            {loggedIn && (
              <button
                onClick={() => setShowMessages(true)}
                className="btn-sweep relative flex items-center justify-center gap-2 py-3 px-4 border border-zinc-700 hover:border-amber-700 text-zinc-300 hover:text-amber-300 text-[12px] uppercase tracking-wider transition-colors"
              >
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                {t('navMessages')}
                {unread > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-amber-700 text-amber-100 text-[9px] rounded-full px-1.5 py-0.5 leading-none">{unread}</span>
                )}
              </button>
            )}

            <a
              href={`${wikiBase}/glossary`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-sweep flex items-center justify-center gap-2 py-3 px-4 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-zinc-100 text-[12px] uppercase tracking-wider transition-colors"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              {t('navGlossary')}
            </a>

            <button
              onClick={onShowCheatSheets}
              className="btn-sweep flex items-center justify-center gap-2 py-3 px-4 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-zinc-100 text-[12px] uppercase tracking-wider transition-colors"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
              {t('navFieldManual')}
            </button>

            <button
              onClick={onStart}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-amber-800 border-2 border-amber-600 hover:bg-amber-700 text-white text-[12px] uppercase tracking-wider font-bold transition-colors"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              {t('buildArmy')}
            </button>

            {/* Going Home never discards the list, so there has to be a way back into it. */}
            {canResume && (
              <button
                onClick={onResume}
                className="col-span-2 btn-sweep flex items-center justify-center gap-2 py-3 px-4 border border-emerald-800 hover:border-emerald-600 text-emerald-400 hover:text-emerald-300 text-[12px] uppercase tracking-wider transition-colors"
              >
                <span>↩</span>
                {t('continueArmy')}
              </button>
            )}

            <button
              onClick={() => onShowCommunity ? onShowCommunity() : (loggedIn ? onShowCloudSaves?.() : onShowAuth())}
              className="col-span-2 btn-sweep flex items-center justify-center gap-2 py-3 px-4 border border-zinc-700 hover:border-amber-700 text-zinc-400 hover:text-amber-300 text-[12px] uppercase tracking-wider transition-colors"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              {t('navCommunityArmies')}
            </button>

            {/* Campaign (Planetary Assault) is open to every player as an ALPHA since 2026-10-24, signed in (the sign-in
                dialog opens for a visitor): sectors, supply, buildings, roster, battle log and weekly events. */}
            <button
              onClick={onShowCampaign}
              title={t('navCampaignAlphaOpen')}
              className="col-span-2 btn-sweep flex items-center justify-center gap-2 py-3 px-4 border border-zinc-700 hover:border-amber-700 text-zinc-400 hover:text-amber-300 text-[12px] uppercase tracking-wider transition-colors"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v4.083M17.91 3.5A9 9 0 0121 12a9 9 0 01-9 9m0-18a9 9 0 00-9 9m9-9c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm0 18v-4a2 2 0 012-2h2.599" /></svg>
              {t('navCampaignAlphaOpen')}
            </button>

            {/* OPEN TO EVERYONE since 2026-09-14: the alpha gate came off once Dominic, Unwise and
                atypicalhero had run a league end to end and signed it off. Signing in is still
                required — an event needs an account to register, report and confirm against. */}
            {loggedIn ? (
              <button
                onClick={onShowEvents}
                title={t('navEvents')}
                className="col-span-2 btn-sweep flex items-center justify-center gap-2 py-3 px-4 border border-zinc-700 hover:border-amber-700 text-zinc-400 hover:text-amber-300 text-[12px] uppercase tracking-wider transition-colors"
              >
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21h8m-4-4v4m-7-9a7 7 0 0014 0V4H5v8zm0 0H3a2 2 0 01-2-2V6h4m14 6h2a2 2 0 002-2V6h-4" /></svg>
                {t('navEvents')}
              </button>
            ) : (
              <button
                disabled
                title={t('navEventsSignIn')}
                className="col-span-2 flex items-center justify-center gap-2 py-3 px-4 border border-zinc-800 text-zinc-600 text-[12px] uppercase tracking-wider cursor-not-allowed"
              >
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21h8m-4-4v4m-7-9a7 7 0 0014 0V4H5v8zm0 0H3a2 2 0 01-2-2V6h4m14 6h2a2 2 0 002-2V6h-4" /></svg>
                {t('navEventsSignIn')}
              </button>
            )}

            {/* Gitfinda — looking for a game. Open to every signed-in player. */}
            {loggedIn ? (
              <button
                onClick={onShowGitfinda}
                title={t('gfButtonTitle')}
                className="col-span-2 btn-sweep flex items-center justify-center gap-2 py-3 px-4 border border-orange-800/70 hover:border-orange-500 text-orange-400/90 hover:text-orange-300 text-[12px] uppercase tracking-wider transition-colors"
              >
                <img src="/gitfinda/matched_gits_users.png" alt="" aria-hidden className="w-4 h-4 object-contain" />
                {t('gfButton')}
                {gfUnread > 0 && <span className="bg-orange-500 text-black rounded-full px-1.5 text-[10px] font-bold">{gfUnread}</span>}
              </button>
            ) : (
              <button
                disabled
                title={t('gfButtonTitle')}
                className="col-span-2 flex items-center justify-center gap-2 py-3 px-4 border border-zinc-800 text-zinc-600 text-[12px] uppercase tracking-wider cursor-not-allowed"
              >
                {t('gfButtonSignIn')}
              </button>
            )}
          </div>

          {/* DISCORD — back where it always was, but a real button in Discord's own blurple
              instead of an 11px grey line nobody could see (atypicalhero, 2026-09-30: "If people
              find the app first, that should be obvious to them to join us"). The colours are
              Discord's published brand blurple (#5865F2) and its hover shade (#4752C4). */}
          <a
            href={DISCORD_INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center justify-center gap-2 w-full max-w-xs py-3 px-4 bg-[#5865F2] hover:bg-[#4752C4] border-2 border-[#7983F5] text-white text-[12px] uppercase tracking-wider font-bold transition-colors anim-fade-up anim-delay-5"
          >
            <DiscordIcon className="w-4 h-4" />
            {t('navDiscordJoin')}
          </a>

        </div>

        {/* Supplements */}
        <div className="px-6 pb-6 max-w-sm mx-auto w-full anim-fade-up anim-delay-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 shrink-0">{t('supplements')}</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setOpenSupplement('horus_heresy')}
              className="btn-sweep relative flex items-center gap-4 px-5 py-5 w-full bg-zinc-900 border border-zinc-800 border-l-[4px] border-l-red-900 hover:bg-zinc-800/70 hover:border-zinc-700 hover:border-l-red-700 transition-all text-left group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-950/30 to-transparent pointer-events-none" />
              <img src="/faction-symbols/horus-heresy.svg" alt="" className="relative z-10 shrink-0 symbol-tint" style={{ width: 54, height: 54, opacity: 0.75 }} draggable={false} />
              <div className="relative z-10 flex-1 min-w-0">
                <div className="text-zinc-100 text-[13px] font-bold uppercase tracking-wide mb-0.5">{t('suppHH')}</div>
                <div className="text-zinc-500 text-[10px] leading-relaxed">{t('hhCardDesc')}</div>
                <div className="text-red-900 group-hover:text-red-600 text-[10px] uppercase tracking-widest mt-1.5 transition-colors">{t('suppLegiones')}</div>
              </div>
              <svg className="relative z-10 w-4 h-4 text-red-900 group-hover:text-red-500 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => setOpenSupplement('legio_titanicus')}
              className="btn-sweep relative flex items-center gap-4 px-5 py-5 w-full bg-zinc-900 border border-zinc-800 border-l-[4px] border-l-orange-900 hover:bg-zinc-800/70 hover:border-zinc-700 hover:border-l-orange-700 transition-all text-left group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-950/30 to-transparent pointer-events-none" />
              <img src="/faction-symbols/horus-heresy.svg" alt="" className="relative z-10 shrink-0 symbol-tint" style={{ width: 54, height: 54, opacity: 0.75 }} draggable={false} />
              <div className="relative z-10 flex-1 min-w-0">
                <div className="text-zinc-100 text-[13px] font-bold uppercase tracking-wide mb-0.5">{t('mgCardTitle')}</div>
                <div className="text-zinc-500 text-[10px] leading-relaxed">{t('mgCardDesc')}</div>
                <div className="text-orange-900 group-hover:text-orange-600 text-[10px] uppercase tracking-widest mt-1.5 transition-colors">{t('suppTaghmata')}</div>
              </div>
              <svg className="relative z-10 w-4 h-4 text-orange-900 group-hover:text-orange-500 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => setOpenSupplement('escalation')}
              className="btn-sweep relative flex items-center gap-4 px-5 py-5 w-full bg-zinc-900 border border-zinc-800 border-l-[4px] border-l-amber-800 hover:bg-zinc-800/70 hover:border-zinc-700 hover:border-l-amber-600 transition-all text-left group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-950/30 to-transparent pointer-events-none" />
              <img src="/faction-symbols/escalation.svg" alt="" className="relative z-10 shrink-0 symbol-tint" style={{ width: 54, height: 54, opacity: 0.75 }} draggable={false} />
              <div className="relative z-10 flex-1 min-w-0">
                <div className="text-zinc-100 text-[13px] font-bold uppercase tracking-wide mb-0.5">{t('suppEsc')}</div>
                <div className="text-zinc-500 text-[10px] leading-relaxed">{t('escCardDesc')}</div>
                <div className="text-amber-800 group-hover:text-amber-600 text-[10px] uppercase tracking-widest mt-1.5 transition-colors">{t('lordsOfWar')}</div>
              </div>
              <svg className="relative z-10 w-4 h-4 text-amber-800 group-hover:text-amber-500 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => setOpenSupplement('assassins')}
              className="btn-sweep relative flex items-center gap-4 px-5 py-5 w-full bg-zinc-900 border border-zinc-800 border-l-[4px] border-l-zinc-600 hover:bg-zinc-800/70 hover:border-zinc-600 hover:border-l-zinc-400 transition-all text-left group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-800/40 to-transparent pointer-events-none" />
              <img src="/faction-symbols/assassins.svg" alt="" className="relative z-10 shrink-0 symbol-tint" style={{ width: 54, height: 54, opacity: 0.75 }} draggable={false} />
              <div className="relative z-10 flex-1 min-w-0">
                <div className="text-zinc-100 text-[13px] font-bold uppercase tracking-wide mb-0.5">{t('suppAss')}</div>
                <div className="text-zinc-500 text-[10px] leading-relaxed">{t('assCardDesc')}</div>
                <div className="text-zinc-500 group-hover:text-zinc-300 text-[10px] uppercase tracking-widest mt-1.5 transition-colors">{t('suppExec')}</div>
              </div>
              <svg className="relative z-10 w-4 h-4 text-zinc-600 group-hover:text-zinc-300 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Supplement drawer — rendered at root level to escape any container z-index/overflow */}
        {openSupplement && <SupplementModal supplement={openSupplement} onClose={() => setOpenSupplement(null)} />}

      </div>
  );
}
