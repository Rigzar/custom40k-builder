import { useState, useEffect, Fragment } from 'react';
import * as api from '../lib/api';
import { ChangelogModal } from './ChangelogModal';
import { LanguageSelector } from './LanguageSelector';
import { ThemeToggle } from './ThemeToggle';
import { SupplementModal, type SupplementKey } from './SupplementModal';
import { FactionSymbol } from './FactionSymbol';
import { Avatar } from './Avatar';
import { MessagesModal, InquisitorBadge } from './MessagesModal';
import { useT, useLanguage, type Language } from '../i18n';
import { useAuth } from '../hooks/useAuth';
import type { SavedArmy } from '../hooks/useSavedArmies';
import { CHANGELOG } from '../data/changelog';
import { DiscordIcon, DISCORD_INVITE_URL } from './DiscordLink';

const ANNOUNCEMENT_KEY = 'c40k_announcement_v182t_dismissed';

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
    title: "v1.82: unit updates on a button, 45% of the game data refreshes itself",
    intro: "Inquisitors can now refresh every unit from the author's sheets with one button, and the codex rule texts are available in German, Spanish, Russian and Japanese.",
    install: "",
    sections: [
      { label: "New in this version", rows: [
        ["Auto-update button", "The Inquisitor panel has a Run unit update button. It downloads every faction's sheet, refreshes the units and opens a pull request for a person to read — nothing changes on the live site until it is merged."],
        ["What updates itself", "About 45% of the game data does today: every unit's models, stats, points, weapons, abilities and keywords. The other 55% is still by hand — option lists (22%), the Armory (18%), archetypes (5%), psychic powers and the rest. Roughly 35 of those 55 points are plain text and prices a script can read; about 20 need a person to wire what an option does."],
        ["Codex versions", "The update also checks every sheet's title and moves the version badge when the author ships a new codex number."],
        ["Rule texts translated", "Archetypes, the Armory, psychic powers, prayers, army rules and the faction introductions are now in German, Spanish, Russian and Japanese, in the app and on the wiki. Russian headings use a font that has Cyrillic."],
        ["Gitfinda (beta)", "A new board to find someone to play with: post your army, points and the times you are free, browse other players' posts with the times shown in your own time zone, match, and chat. Open it from the Gitfinda button on the start page."],
        ["Japanese in katakana", "On the Japanese version, unit, weapon, option and Armory names, the weapon types and abilities and the loadout line now appear in katakana, as a Japanese player asked. The headings above each option block are translated in all four languages too."],
      ] },
      { label: "Also fixed", rows: [
        ["Razorback", "The pairing \"Lascannon and Twin plasma gun\" shows its own name and one price, and the swap header says Twin heavy flamer."],
        ["Sheets", "Traitor Guard Meltagun, Harpy header, Foetid Virion options (Biologus Putrifier +10, Plague Surgeon +5) and the Chaos Decimator follow the sheets."],
        ["Armory button", "Opening the Armory on the Succubus or any other HQ sent you back to the main screen (GH#199). Fixed."],
        ["Cryptek", "A Cryptek showed no weapon at all, and the Abyssal lance bought from the Armoury never appeared (GH#204). Fixed."],
        ["Leviathan Dreadnought", "Its two weapon lists are alternatives (two arms): two weapons from one list or two from the other."],
        ["Imperial Guard orders", "The Officer Orders are grouped as the sheet files them (infantry and creatures / vehicles, plus your Legacy order) on the Print View, on a new Field Manual page and on every officer's unit card."],
        ["Gitfinda", "A game tied to a league or event can only be matched by that event's players, and a cancelled game now shows as Cancelled in Matches with its chat closed."],
        ["Gitfinda matches", "A Withdraw match button lets you take back a wrong match without the post's owner deleting the post, and the chat of a cancelled or finished game is now closed."],
        ["Second AOP", "It opens only once the whole first AOP is filled (2 HQ, 6 Troops, 3 Elites, 3 Fast Attack, 3 Heavy Support), not when one slot goes over. Then a third HQ or a seventh Troops is allowed."],
        ["Gitfinda times", "Time slots now say they are already converted to your time zone, and on a phone the Field Manual button no longer covers the chat's Send button."],
        ["Leader gear (GH#207, GH#208)", "A Lieutenant's Plate armor or a Gang Champion's Swordsman honours changes only that model on the printed card and the battle view, as on the unit card."],
        ["Light mode", "Gitfinda and the landing page's orange labels are readable in light mode."],
        ["Gitfinda filters", "The board can now be filtered by points (min and max), as well as by army, battle type and event."],
        ["Horus Heresy Legiones Astartes","Re-audited against the live sheet: Armorbane(3) on five weapons, Nemesis-Bolter Sniper, stray Augury scanner removed."],
        ["Core Rules PDF", "The work-in-progress PDF by Scoots is linked from the start screen and the wiki Core Rules page."],
        ["Ascended Daemon Prince, rest of its rule", "Greater Daemon, Fearless and Terrifying(-2) on its ability line, and no Animosity error from the army Mark."],
        ["Ascended Daemon Prince", "No Mark to pick or pay for (it has all of them) and no +5 psyker upgrade; it is a psyker through Tzeentch."],
        ["Daemon Prince and other Monstrous Creatures", "They get their Monstrous Creature rules back (Mark bonuses, armory prices); the Ascended upgrade reads +109."],
        ["Biovore at 110 points", "Old hand-made corrections no longer hide the values the sheet and the unit update give: the Biovore costs 41 again."],
        ["Tau Tactical Philosophies (GH#209)", "It shows its price (+50 in a 2500-point game) and any HQ can buy it."],
        ["Master of the Forge / Chief Apothecary (GH#210)", "Both now fill an HQ slot and count as an HQ selection."],
        ["Ascended Daemon Prince", "Its Armory has an All Marks tab with the four Mark armories, as it has all Marks."],
      ] },
    ],
    contrib: "\ud83d\udc41\ufe0f Found something wrong? The in-app bug report form works \u2014 unit, engagement, archetype and a picture.",
  },
  de: {
    title: "v1.82: Einheiten-Update auf Knopfdruck, 45 % der Spieldaten aktualisieren sich selbst",
    intro: "Inquisitoren können jetzt alle Einheiten mit einem Knopf aus den Datenblättern des Autors aktualisieren, und die Codex-Regeltexte gibt es auf Deutsch, Spanisch, Russisch und Japanisch.",
    install: "",
    sections: [
      { label: "Neu in dieser Version", rows: [
        ["Auto-Update-Knopf", "Das Inquisitor-Panel hat einen Knopf „Run unit update“. Er lädt das Blatt jeder Fraktion, aktualisiert die Einheiten und öffnet einen Pull Request zur Prüfung durch einen Menschen — die Live-Seite ändert sich erst nach dem Merge."],
        ["Was sich selbst aktualisiert", "Heute etwa 45 % der Spieldaten: Modelle, Werte, Punkte, Waffen, Fähigkeiten und Schlüsselwörter jeder Einheit. Die anderen 55 % sind noch Handarbeit — Optionslisten (22 %), das Armory (18 %), Archetypen (5 %), psychische Kräfte und der Rest. Etwa 35 dieser 55 Punkte sind einfacher Text und Preise, die ein Skript lesen kann; etwa 20 brauchen einen Menschen, der festlegt, was eine Option bewirkt."],
        ["Codex-Versionen", "Das Update prüft außerdem den Titel jedes Blatts und setzt das Versionsabzeichen um, wenn der Autor eine neue Codex-Nummer veröffentlicht."],
        ["Regeltexte übersetzt", "Archetypen, Armory, psychische Kräfte, Prayers, Armeeregeln und die Fraktionseinführungen gibt es jetzt auf Deutsch, Spanisch, Russisch und Japanisch, in der App und im Wiki. Russische Überschriften nutzen eine Schrift mit Kyrillisch."],
        ["Gitfinda (Beta)", "Eine neue Tafel, um Mitspieler zu finden: veröffentliche Armee, Punkte und freie Zeiten, durchsuche die Beiträge anderer mit Zeiten in deiner Zeitzone, matche und chatte. Du öffnest sie mit dem Gitfinda-Knopf auf der Startseite."],
        ["Japanisch in Katakana", "In der japanischen Version erscheinen Namen von Einheiten, Waffen, Optionen und Armory, Waffenarten, Fähigkeiten und die Ausrüstungszeile jetzt in Katakana, auf Wunsch eines japanischen Spielers. Auch die Überschriften über jedem Optionsblock sind in allen vier Sprachen übersetzt."],
      ] },
      { label: "Außerdem behoben", rows: [
        ["Razorback", "Die Paarung „Lascannon and Twin plasma gun“ zeigt ihren eigenen Namen und einen Preis, und die Tausch-Überschrift nennt den Twin heavy flamer."],
        ["Datenblätter", "Meltagun der Traitor Guard, Harpy-Überschrift, Optionen des Foetid Virion (Biologus Putrifier +10, Plague Surgeon +5) und der Chaos Decimator folgen den Blättern."],
        ["Armory-Knopf", "Das Öffnen des Armory bei der Succubus oder einem anderen HQ brachte dich zum Hauptbildschirm zurück (GH#199). Behoben."],
        ["Cryptek", "Ein Cryptek zeigte gar keine Waffe, und die aus der Rüstkammer gekaufte Abyssal lance erschien nie (GH#204). Behoben."],
        ["Leviathan-Dreadnought", "Seine zwei Waffenlisten sind Alternativen (zwei Arme): zwei Waffen aus einer Liste oder zwei aus der anderen."],
        ["Imperial-Guard-Befehle", "Die Offiziersbefehle sind so gruppiert wie im Blatt (Infanterie und Kreaturen / Fahrzeuge, dazu dein Legacy-Befehl): in der Druckansicht, auf einer neuen Field-Manual-Seite und auf der Einheitenkarte jedes Offiziers."],
        ["Gitfinda", "Ein an eine Liga oder ein Event gebundenes Spiel können nur Spieler dieses Events matchen, und ein abgesagtes Spiel erscheint unter Matches als Abgesagt, mit geschlossenem Chat."],
        ["Gitfinda-Matches", "Ein Knopf Match zurückziehen nimmt ein falsches Match zurück, ohne dass der Besitzer den Beitrag löschen muss, und der Chat eines abgesagten oder beendeten Spiels ist jetzt geschlossen."],
        ["Zweiter AOP", "Er öffnet sich erst, wenn der ganze erste AOP gefüllt ist (2 HQ, 6 Standard, 3 Elite, 3 Sturm, 3 Schwere Unterstützung), nicht wenn ein Slot überschritten wird. Dann sind ein drittes HQ oder eine siebte Standardeinheit erlaubt."],
        ["Gitfinda-Zeiten", "Die Zeitfenster nennen jetzt, dass sie schon in deine Zeitzone umgerechnet sind, und auf dem Handy verdeckt der Field-Manual-Knopf nicht mehr Senden."],
        ["Anführer-Ausrüstung (GH#207, GH#208)", "Plate armor eines Leutnants oder Swordsman honours eines Gang Champions ändert auf gedruckter Karte und Kampfansicht nur dieses Modell, wie auf der Einheitenkarte."],
        ["Heller Modus", "Gitfinda und die orangen Beschriftungen der Startseite sind im hellen Modus lesbar."],
        ["Gitfinda-Filter", "Die Tafel lässt sich jetzt auch nach Punkten (Minimum und Maximum) filtern, zusätzlich zu Armee, Schlachtart und Event."],
        ["Horus Heresy Legiones Astartes","Gegen das aktuelle Blatt neu geprüft: Armorbane(3) bei fünf Waffen, Sniper beim Nemesis-Bolter, überzähliger Augury scanner entfernt."],
        ["Grundregeln-PDF", "Das PDF von Scoots (in Arbeit) ist vom Startbildschirm und der Grundregeln-Seite des Wikis verlinkt."],
        ["Aufgestiegener Daemon Prince, Rest der Regel", "Greater Daemon, Fearless und Terrifying(-2) in der Fähigkeitenzeile, kein Animosity-Fehler durch das Mal der Armee."],
        ["Aufgestiegener Daemon Prince", "Kein Mal zu wählen oder zu zahlen (er hat alle) und kein Psioniker-Upgrade für +5; er ist über Tzeentch Psioniker."],
        ["Daemon Prince und andere Monstrous Creatures", "Sie haben ihre Monstrous-Creature-Regeln wieder (Mal-Boni, Armory-Preise); das Ascended-Upgrade zeigt +109."],
        ["Biovore mit 110 Punkten", "Alte Handkorrekturen verdecken nicht mehr die Werte aus Blatt und Einheiten-Update: Der Biovore kostet wieder 41."],
        ["Tau Tactical Philosophies (GH#209)", "Es zeigt seinen Preis (+50 bei 2500 Punkten), und jedes HQ kann es kaufen."],
        ["Master of the Forge / Chief Apothecary (GH#210)", "Beide belegen jetzt einen HQ-Slot und zählen als HQ-Auswahl."],
        ["Aufgestiegener Dämonenprinz", "Seine Armory hat einen Reiter Alle Male mit den vier Mal-Rüstkammern, da er alle Male hat."],
      ] },
    ],
    contrib: "\ud83d\udc41\ufe0f Etwas gefunden, das nicht stimmt? Das Fehlerformular in der App funktioniert \u2014 Einheit, Engagement, Archetyp und ein Bild.",
  },
  es: {
    title: "v1.82: actualización de unidades con un botón, el 45% de los datos se refresca solo",
    intro: "Los Inquisidores ya pueden refrescar todas las unidades desde las hojas del autor con un botón, y los textos de reglas de los códex están en alemán, español, ruso y japonés.",
    install: "",
    sections: [
      { label: "Novedades de esta versión", rows: [
        ["Botón de auto-actualización", "El panel de Inquisitor tiene un botón Run unit update. Descarga la hoja de cada facción, refresca las unidades y abre un pull request para que una persona lo lea — nada cambia en la web en vivo hasta que se fusiona."],
        ["Qué se actualiza solo", "Hoy, alrededor del 45% de los datos del juego: modelos, estadísticas, puntos, armas, habilidades y palabras clave de cada unidad. El otro 55% sigue siendo manual — listas de opciones (22%), la Armory (18%), arquetipos (5%), poderes psíquicos y el resto. Unos 35 de esos 55 puntos son texto y precios que un script puede leer; unos 20 necesitan a una persona que cablee lo que hace cada opción."],
        ["Versiones de códex", "La actualización también comprueba el título de cada hoja y mueve la insignia de versión cuando el autor publica un número nuevo de códex."],
        ["Textos de reglas traducidos", "Arquetipos, Armory, poderes psíquicos, prayers, reglas de ejército y las introducciones de facción están en alemán, español, ruso y japonés, en la app y en la wiki. Los títulos en ruso usan una fuente con cirílico."],
        ["Gitfinda (beta)", "Un tablón nuevo para encontrar con quién jugar: publica tu ejército, puntos y las horas en que estás libre, mira los anuncios de otros con las horas en tu zona horaria, haz match y chatea. Se abre con el botón de Gitfinda de la pantalla de inicio."],
        ["Japonés en katakana", "En la versión japonesa, los nombres de unidades, armas, opciones y Armory, los tipos y habilidades de arma y la línea de equipo salen ahora en katakana, como pidió un jugador japonés. Los encabezados sobre cada bloque de opciones también están traducidos en los cuatro idiomas."],
      ] },
      { label: "También corregido", rows: [
        ["Razorback", "La pareja «Lascannon and Twin plasma gun» muestra su propio nombre y un solo precio, y la cabecera del cambio dice Twin heavy flamer."],
        ["Hojas", "El Meltagun del Traitor Guard, la cabecera del Harpy, las opciones del Foetid Virion (Biologus Putrifier +10, Plague Surgeon +5) y el Chaos Decimator siguen las hojas."],
        ["Botón de Armory", "Abrir la Armory de la Succubus o de cualquier otro HQ te devolvía a la pantalla principal (GH#199). Corregido."],
        ["Cryptek", "Un Cryptek no mostraba ningún arma, y la Abyssal lance comprada en la armería nunca aparecía (GH#204). Corregido."],
        ["Leviathan Dreadnought", "Sus dos listas de armas son alternativas (dos brazos): dos armas de una lista o dos de la otra."],
        ["Órdenes de la Guardia Imperial", "Las órdenes de oficial están agrupadas como las archiva la hoja (infantería y criaturas / vehículos, más tu orden de Legacy) en la vista de impresión, en una página nueva del Field Manual y en la ficha de cada oficial."],
        ["Gitfinda", "Una partida ligada a una liga o evento solo la pueden aceptar los jugadores de ese evento, y una partida cancelada aparece como Cancelada en Matches con el chat cerrado."],
        ["Matches de Gitfinda", "Un botón Retirar match deshace un match equivocado sin que el dueño borre el anuncio, y el chat de una partida cancelada o terminada ahora se cierra."],
        ["Segundo AOP", "Se abre solo cuando el primer AOP está completo (2 HQ, 6 Tropas, 3 Élites, 3 Ataque Rápido, 3 Apoyo Pesado), no cuando un slot se pasa. Entonces se permiten un tercer HQ o una séptima Tropa."],
        ["Horas de Gitfinda", "Las franjas indican que ya están convertidas a tu zona horaria, y en el móvil el botón del Field Manual ya no tapa Enviar."],
        ["Equipo del líder (GH#207, GH#208)", "La Plate armor de un Lieutenant o los Swordsman honours de un Gang Champion cambian solo a ese modelo en la ficha impresa y la vista de batalla, como en la ficha de unidad."],
        ["Modo claro", "Gitfinda y las etiquetas naranjas de la portada se leen en modo claro."],
        ["Filtros de Gitfinda", "El tablón se puede filtrar ahora también por puntos (mínimo y máximo), además de por ejército, tipo de batalla y evento."],
        ["Horus Heresy Legiones Astartes","Revisado de nuevo con la hoja actual: Armorbane(3) en cinco armas, Sniper en el Nemesis-Bolter, Augury scanner sobrante retirado."],
        ["PDF de las reglas básicas", "El PDF de Scoots (en desarrollo) está enlazado desde la pantalla de inicio y la página de Core Rules del wiki."],
        ["Príncipe Demonio Ascendido, resto de su regla", "Greater Daemon, Fearless y Terrifying(-2) en su línea de habilidades, y sin error de Animosity por la Marca del ejército."],
        ["Príncipe Demonio Ascendido", "Sin Marca que elegir ni pagar (las tiene todas) ni mejora de psíquico de +5; es psíquico por Tzeentch."],
        ["Daemon Prince y otras criaturas monstruosas", "Recuperan sus reglas de criatura monstruosa (bonos de Marca, precios de armería); la mejora a Ascendido dice +109."],
        ["Biovore a 110 puntos", "Las correcciones manuales antiguas ya no tapan los valores de la hoja y la actualización de unidades: el Biovore vuelve a costar 41."],
        ["Tactical Philosophies de T'au (GH#209)", "Muestra su precio (+50 en una partida de 2500 puntos) y cualquier HQ puede comprarla."],
        ["Master of the Forge / Chief Apothecary (GH#210)", "Ambos ocupan ahora un slot de HQ y cuentan como selección de HQ."],
        ["Príncipe Demonio Ascendido", "Su armería tiene una pestaña Todas las marcas con las cuatro armerías de Marca, ya que tiene todas las Marcas."],
      ] },
    ],
    contrib: "\ud83d\udc41\ufe0f \u00bfEncontraste algo mal? El formulario de reporte de la app funciona \u2014 unidad, engagement, arquetipo y una foto.",
  },
  ru: {
    title: "v1.82: обновление юнитов по кнопке, 45% игровых данных обновляются сами",
    intro: "Инквизиторы теперь могут обновить все юниты из листов автора одной кнопкой, а тексты правил кодексов доступны на немецком, испанском, русском и японском.",
    install: "",
    sections: [
      { label: "Новое в этой версии", rows: [
        ["Кнопка автообновления", "В панели Inquisitor есть кнопка Run unit update. Она скачивает лист каждой фракции, обновляет юниты и открывает pull request для проверки человеком — живой сайт не меняется, пока его не примут."],
        ["Что обновляется само", "Сегодня около 45% игровых данных: модели, характеристики, очки, оружие, способности и ключевые слова каждого юнита. Остальные 55% пока вручную — списки опций (22%), Armory (18%), архетипы (5%), псионические силы и остальное. Примерно 35 из этих 55 пунктов — обычный текст и цены, которые скрипт может прочитать; около 20 требуют человека, который свяжет, что делает опция."],
        ["Версии кодексов", "Обновление также проверяет название каждого листа и меняет значок версии, когда автор выпускает новый номер кодекса."],
        ["Тексты правил переведены", "Архетипы, Armory, псионические силы, prayers, правила армии и описания фракций теперь на немецком, испанском, русском и японском — в приложении и на вики. Русские заголовки используют шрифт с кириллицей."],
        ["Gitfinda (бета)", "Новая доска, чтобы найти с кем сыграть: опубликуйте армию, очки и свободное время, смотрите объявления других со временем в вашем часовом поясе, нажимайте «Матч» и общайтесь в чате. Открывается кнопкой Gitfinda на стартовой странице."],
        ["Японский катаканой", "В японской версии названия юнитов, оружия, опций и Armory, типы и способности оружия и строка снаряжения теперь записаны катаканой — по просьбе японского игрока. Заголовки над каждым блоком опций тоже переведены на все четыре языка."],
      ] },
      { label: "Также исправлено", rows: [
        ["Razorback", "Пара «Lascannon and Twin plasma gun» показывает своё название и одну цену, а заголовок замены говорит Twin heavy flamer."],
        ["Листы", "Meltagun у Traitor Guard, заголовок Harpy, опции Foetid Virion (Biologus Putrifier +10, Plague Surgeon +5) и Chaos Decimator следуют листам."],
        ["Кнопка Armory", "Открытие Armory у Succubus или любого другого HQ возвращало на главный экран (GH#199). Исправлено."],
        ["Криптек", "У Криптека не показывалось никакого оружия, а купленное в арсенале Abyssal lance не появлялось (GH#204). Исправлено."],
        ["Левиафан-дредноут", "Два списка его оружия — альтернативы (две руки): два оружия из одного списка или два из другого."],
        ["Приказы Имперской Гвардии", "Приказы офицеров сгруппированы так же, как в листе (пехота и существа / техника, плюс приказ вашего Legacy): в печатном виде, на новой странице Field Manual и на карточке каждого офицера."],
        ["Gitfinda", "Игру, привязанную к лиге или событию, могут принять только игроки этого события, а отменённая игра в Matches помечена как Отменено, и её чат закрыт."],
        ["Матчи Gitfinda", "Кнопка Отозвать матч отменяет ошибочный матч, и владельцу не нужно удалять объявление; чат отменённой или завершённой игры теперь закрыт."],
        ["Второй AOP", "Он открывается, только когда полностью заполнен первый AOP (2 HQ, 6 Troops, 3 Elites, 3 Fast Attack, 3 Heavy Support), а не когда один слот превышен. Тогда разрешены третий HQ или седьмой Troops."],
        ["Время в Gitfinda", "В окнах времени теперь указано, что оно уже пересчитано в ваш пояс, а на телефоне кнопка Field Manual больше не закрывает «Отправить»."],
        ["Снаряжение лидера (GH#207, GH#208)", "Plate armor лейтенанта или Swordsman honours Gang Champion меняют только эту модель в печатной карточке и боевом виде, как в карточке юнита."],
        ["Светлая тема", "Gitfinda и оранжевые подписи на главной странице читаются в светлой теме."],
        ["Фильтры Gitfinda", "Доску теперь можно фильтровать и по очкам (минимум и максимум), помимо армии, типа битвы и события."],
        ["Horus Heresy Legiones Astartes","Перепроверено по актуальному листу: Armorbane(3) у пяти видов оружия, Sniper у Nemesis-Bolter, лишний Augury scanner убран."],
        ["PDF основных правил", "PDF от Scoots (в разработке) доступен по ссылке на стартовом экране и на странице Core Rules в вики."],
        ["Вознесённый Демон-принц, остальная часть правила", "Greater Daemon, Fearless и Terrifying(-2) в строке способностей и без ошибки Animosity из-за Метки армии."],
        ["Вознесённый Демон-принц", "Метку не нужно выбирать и оплачивать (у него есть все) и нет улучшения до псайкера за +5; он псайкер через Тзинч."],
        ["Daemon Prince и другие монстры", "Они снова получают правила монстра (бонусы Меток, цены арсенала); улучшение до Ascended показывает +109."],
        ["Биовор за 110 очков", "Старые ручные поправки больше не скрывают значения листа и обновления юнитов: Биовор снова стоит 41."],
        ["Tactical Philosophies тау (GH#209)", "Показывает цену (+50 в игре на 2500 очков), и любой HQ может её купить."],
        ["Master of the Forge / Chief Apothecary (GH#210)", "Оба теперь занимают слот HQ и считаются выбором HQ."],
        ["Вознесённый Демон-принц", "В его арсенале есть вкладка «Все Метки» с четырьмя арсеналами Меток, так как у него есть все Метки."],
      ] },
    ],
    contrib: "👁️ Нашли ошибку? Форма отчёта об ошибках в приложении работает — отряд, формат боя, архетип и картинка.",
  },
  ja: {
    title: "v1.82：ボタン1つでユニット更新、ゲームデータの45%が自動更新に",
    intro: "Inquisitorは、作者のシートからすべてのユニットをボタン1つで更新できるようになり、コデックスのルール文はドイツ語・スペイン語・ロシア語・日本語で読めます。",
    install: "",
    sections: [
      { label: "このバージョンの新機能", rows: [
        ["自動更新ボタン", "Inquisitorパネルに「Run unit update」ボタンがあります。各勢力のシートをダウンロードしてユニットを更新し、人が確認するためのプルリクエストを開きます。マージされるまで公開サイトは変わりません。"],
        ["自動で更新される範囲", "現在、ゲームデータの約45%：各ユニットのモデル、能力値、ポイント、兵器、アビリティ、キーワード。残りの55%は手作業です — オプション一覧（22%）、Armory（18%）、アーキタイプ（5%）、サイキックパワーなど。この55のうち約35は、スクリプトが読み取れる普通のテキストと価格で、約20は、オプションの効果を人が配線する必要があります。"],
        ["コデックスのバージョン", "更新では各シートのタイトルも確認し、作者が新しいコデックス番号を公開するとバージョンバッジを移します。"],
        ["ルール文を翻訳", "アーキタイプ、Armory、サイキックパワー、prayer、軍ルール、勢力紹介が、アプリとWikiでドイツ語・スペイン語・ロシア語・日本語になりました。ロシア語の見出しはキリル文字対応のフォントを使います。"],
        ["Gitfinda（ベータ）", "対戦相手を見つける新しい掲示板です。軍・ポイント・空いている時間を投稿し、ほかのプレイヤーの投稿を自分のタイムゾーンで見て、マッチしてチャットできます。スタートページのGitfindaボタンから開きます。"],
        ["日本語をカタカナで", "日本語版で、ユニット・武器・オプション・Armoryの名称、武器タイプとアビリティ、装備行がカタカナ表示になりました（日本のプレイヤーからの要望）。各オプションブロックの上の見出しも4言語すべてで翻訳しました。"],
      ] },
      { label: "その他の修正", rows: [
        ["Razorback", "「Lascannon and Twin plasma gun」の組み合わせは、自身の名前と1つの価格を表示し、交換の見出しはTwin heavy flamerになりました。"],
        ["シート", "Traitor GuardのMeltagun、Harpyの見出し、Foetid Virionのオプション（Biologus Putrifier +10、Plague Surgeon +5）、Chaos Decimatorがシートに従います。"],
        ["Armoryボタン", "SuccubusなどのHQでArmoryを開くとメイン画面に戻る問題 (GH#199) を修正しました。"],
        ["クリプテック", "クリプテックに武器が一切表示されず、武器庫で購入したアビサル・ランスも表示されませんでした (GH#204)。修正しました。"],
        ["リヴァイアサン・ドレッドノート", "2つの武器リストは択一です（腕は2本）：片方のリストから2つ、またはもう片方から2つ。"],
        ["インペリアルガードの命令", "士官の命令をシートの分類どおり（歩兵とクリーチャー／ビークル、およびレガシー命令）に整理し、印刷ビュー、新しいFieldManualページ、各士官のユニットカードで表示します。"],
        ["Gitfinda", "リーグやイベントに紐付いた対戦は、そのイベントの参加者だけがマッチできます。中止された対戦はMatchesで「中止」と表示され、チャットは閉じられます。"],
        ["Gitfindaのマッチ", "「マッチを取り消す」ボタンで、投稿の主が投稿を削除しなくても間違ったマッチを取り消せます。中止または終了した対戦のチャットは閉じられます。"],
        ["2つ目のAOP", "最初のAOP全体（HQ2、トゥループ6、エリート3、ファストアタック3、ヘビーサポート3）が埋まって初めて開きます。1つのスロットが上限を超えても開きません。開いた後は3つ目のHQや7つ目のトゥループが可能です。"],
        ["Gitfindaの時間", "時間帯があなたのタイムゾーンに変換済みと表示され、スマホではFieldManualボタンが送信ボタンを隠さなくなりました。"],
        ["リーダーの装備（GH#207、GH#208）", "ルテナントのプレートアーマーやギャング・チャンピオンのソードマンズ・オナーは、ユニットカードと同じく、印刷カードとバトルビューでもそのモデルだけを変えます。"],
        ["ライトモード", "Gitfindaとトップページのオレンジ色の表示がライトモードでも読めます。"],
        ["Gitfindaの絞り込み", "掲示板を、軍、戦闘タイプ、イベントに加えて、ポイント（最小・最大）でも絞り込めるようになりました。"],
        ["ホルス・ヘレシー レギオネス・アスタルテス","最新のシートで再監査：5つの武器にArmorbane(3)、ネメシス・ボルターにSniper、余分なオーギュリー・スキャナーを削除。"],
        ["コアルールPDF", "ScootsのPDF（作成中）へ、スタート画面とWikiのCore Rulesページからリンクしています。"],
        ["昇華したデーモンプリンス、ルールの残り", "能力欄にGreater Daemon、Fearless、Terrifying(-2)が入り、軍の印によるAnimosityエラーも出ません。"],
        ["昇華したデーモンプリンス", "印は選択も支払いも不要（全て持っています）で、+5のサイカー強化もありません。ティーンチによりサイカーです。"],
        ["デーモンプリンスなどのモンストラス・クリーチャー", "モンストラス・クリーチャーの特性（印のボーナス、アーモリー価格）が戻りました。昇華の強化は+109です。"],
        ["110ポイントのバイオボア", "古い手動修正がシートとユニット更新の値を隠さなくなりました：バイオボアは再び41ポイントです。"],
        ["タウのTactical Philosophies（GH#209）", "価格が表示され（2500ポイントの試合で+50）、どのHQでも購入できます。"],
        ["Master of the Forge／チーフ・アポセカリー（GH#210）", "どちらもHQスロットを使い、HQ選択として数えられます。"],
        ["昇華したデーモンプリンス", "全ての印を持つため、アーモリーに4つの印のアーモリーを含む「全ての印」タブがあります。"],
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
  const tClose = useT()('close');
  const tx = ANNOUNCEMENT_TEXT[language];
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(ANNOUNCEMENT_KEY) === 'true'
  );
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
          <div className="text-[10px] text-amber-600 uppercase tracking-widest font-semibold mb-2 flex items-center gap-1.5">
            <span className="opacity-60">⚙</span>
            {tx.title}
          </div>
          <button
            onClick={() => { localStorage.setItem(ANNOUNCEMENT_KEY, 'true'); setDismissed(true); }}
            className="text-red-500 hover:text-red-300 text-lg leading-none shrink-0 transition-colors"
            title={tClose}
          >
            ×
          </button>
        </div>
        <div className="text-[12px] text-zinc-300 leading-relaxed space-y-2">
          <p>{tx.intro}</p>
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
        </div>
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
  const { loggedIn, username, avatar, isAdmin, isInterrogator } = useAuth();
  const refreshUnread = () => { api.getUnreadCount().then(r => setUnread(r.count)).catch(() => {}); };
  useEffect(() => { if (loggedIn) refreshUnread(); else setUnread(0); }, [loggedIn]);
  // Gitfinda: how many unread chat messages / fresh matches are waiting, shown on its button.
  const [gfUnread, setGfUnread] = useState(0);
  useEffect(() => {
    if (!loggedIn) return;
    const load = () => api.gitfindaUnread().then(r => setGfUnread(r.unread)).catch(() => {});
    load();
    const id = setInterval(load, 60000);
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
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowChangelog(true)}
              className="text-[11px] uppercase tracking-wide text-zinc-500 hover:text-amber-400 transition-colors"
            >
              v{latestVersion}
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

            {/* Campaign (Planetary Assault) is built but not yet opened up to regular players —
                admins (both Inquisitor and Interrogator) get early access to it while logged in,
                everyone else still sees the disabled "Coming Soon" state. */}
            {loggedIn && (isAdmin || isInterrogator) ? (
              <button
                onClick={onShowCampaign}
                title={t('navCampaignAlphaAdmin')}
                className="col-span-2 btn-sweep flex items-center justify-center gap-2 py-3 px-4 border border-zinc-700 hover:border-amber-700 text-zinc-400 hover:text-amber-300 text-[12px] uppercase tracking-wider transition-colors"
              >
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v4.083M17.91 3.5A9 9 0 0121 12a9 9 0 01-9 9m0-18a9 9 0 00-9 9m9-9c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm0 18v-4a2 2 0 012-2h2.599" /></svg>
                {t('navCampaignAlphaAdmin')}
              </button>
            ) : (
              <button
                disabled
                title={t('navCampaignComingSoon')}
                className="col-span-2 flex items-center justify-center gap-2 py-3 px-4 border border-zinc-800 text-zinc-600 text-[12px] uppercase tracking-wider cursor-not-allowed"
              >
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v4.083M17.91 3.5A9 9 0 0121 12a9 9 0 01-9 9m0-18a9 9 0 00-9 9m9-9c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm0 18v-4a2 2 0 012-2h2.599" /></svg>
                {t('navCampaignComingSoon')}
              </button>
            )}

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
                <span className="border border-orange-500/70 text-orange-300 text-[9px] font-bold tracking-widest px-1 py-px rounded-sm leading-none">BETA</span>
                {gfUnread > 0 && <span className="bg-orange-500 text-black rounded-full px-1.5 text-[10px] font-bold">{gfUnread}</span>}
              </button>
            ) : (
              <button
                disabled
                title={t('gfButtonTitle')}
                className="col-span-2 flex items-center justify-center gap-2 py-3 px-4 border border-zinc-800 text-zinc-600 text-[12px] uppercase tracking-wider cursor-not-allowed"
              >
                {t('gfButtonSignIn')}
                <span className="border border-zinc-700 text-zinc-500 text-[9px] font-bold tracking-widest px-1 py-px rounded-sm leading-none">BETA</span>
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

          {/* Scoots' work-in-progress PDF of the Core Rules (shared on Discord 2026-10-07). */}
          <a
            href="https://drive.google.com/file/d/13rH4JzKDq3O4id3lCkfd8ixtXU0eza91/view?usp=drive_link"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 block text-center text-[11px] text-zinc-500 hover:text-zinc-300 underline underline-offset-4 transition-colors"
          >
            {t('navRulesPdf')} →
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
