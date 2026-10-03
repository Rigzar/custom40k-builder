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

const ANNOUNCEMENT_KEY = 'c40k_announcement_v181b_dismissed';

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
    title: "v1.81: October sheets in every army, Russian and Japanese, a squad that shrinks properly",
    intro: "All 21 codices re-read against the live October sheets and wired, the app and the wiki now in Russian and Japanese, plus the Discord and GitHub reports.",
    install: "",
    sections: [
      { label: "New in this version", rows: [
        ["Languages", "Interface, front-page banner, Field Manual, supplement cards, messages and the rules glossary are available in Russian and Japanese. Pick the language at the top of the page."],
        ["Fixed squads", "A bad data update had shrunk fixed-size squads to 1 Guardsman + 1 Sergeant (Infantry Squad, Veterans, Command Squads and units in several armies, GH#194). They are back to full size. Veteran abilities now also print their rule text in the Special Rules section, and Russian headings use a font that has Cyrillic."],
        ["Wiki", "One site in five languages \u2014 a language switcher in the header, translated navigation, headings, slots, badges and home page. The Core Rules and Missions pages are translated too."],
        ["Still English", "The Known Issues entries."],
        ["Native speakers wanted", "The Russian and Japanese texts were written by Claude and nobody native has read them yet \u2014 corrections on Discord are very welcome."],
      ] },
      { label: "October rules, wired in the app", rows: [
        ["New archetypes", "Megafauna, Swarming Masses and Wraithhost do what they say: the promoted units move to Troops, ratios and requirements are enforced, and Heretic / Iconoclast change which Armory the Inquisition\u2019s Authority borrows from."],
        ["Legion", "The Space Marines and Chaos Space Marines archetypes are now called Legion SM and Legion CSM; saved lists convert on their own."],
        ["Core rules", "Blank, Disorderly Charge, the new Deep Strike text, Sniper, Narthecium and the general psychic disciplines follow the October Core Rules (1.278), in the Field Manual and the wiki glossary."],
        ["Assassins and Necrons", "Assassins cost 5 more, Eversor carries a Melta bomb, Culexus has Blank; Pariahs 56 points, Ophydian Destroyers 53, Scarab upgrades read as printed."],
        ["Thallax and Wraithhost", "Thallax Cohort for the Forces of the Machine God, Wraithlords as Troops in a Wraithhost, Null-Maiden Rhino, Furies\u2019 Marks, Chaos Bikers, Outrider melee swaps."],
        ["Bug reports", "The form has an optional Discord name, so a report that is hard to follow can be answered where you already are."],
        ["Data", "Every faction\u2019s unit files are pure JSON now \u2014 nothing changes on screen; it makes community corrections easier."],
      ] },
      { label: "Reported on GitHub", rows: [
        ["October sheets, every army", "All 21 codices re-read against the live October sheets and wired: new points, weapons and options, Blank, Disorderly Charge, Sniper, each army’s own Auspex / homer / Jammer."],
        ["New in the builder", "Thallax Cohort, Saturnine armor, Wraithhost Wraithlords as Troops, Null-Maiden Rhino, Furies marks, Outrider melee swaps, Chaos Bikers."],
        ["GH#186", "A list can no longer be saved under the wrong faction — a slow phone could relabel it."],
        ["GH#185", "Warbuggy: Up to three small guns when no big gun is taken; with a big gun, one."],
        ["GH#169", "The Ork Shoota shows on the profile again, swapped in or bought as an extra."],
        ["GH#168", "The four Tyranid archetypes move units between roles: Carnifex, Ravener and Von Ryan\u2019s to Troops, Genestealers and Warriors to Elites, and the named HQ promotions."],
        ["GH#170, GH#171", "The armory buys more than one copy again \u2014 the box counts them, and \u201c\u2212\u201d gives one back."],
        ["GH#167", "Special Biomorphs can be selected and kept again \u2014 opening a saved Tyranid list no longer wipes them."],
      ] },
      { label: "Reported on Discord", rows: [
        ["Discord", "The Discord link is a proper button now \u2014 suggested by atypicalhero, so newcomers can find us."],
        ["I.O.U", "Blood Ravens can take it: it costs whatever item you pick from another army\u2019s Legacy Armory."],
        ["Build army", "Asks before discarding the open list, instead of silently dropping you back into it."],
        ["Necron Warriors", "Shrinking a squad trims the swaps that scale with its size \u2014 no more 15 Gauss reapers in a squad of 10."],
        ["Field Ordnance Battery, Heavy Weapon Squad", "One weapon and one Vox per battery or team, not one for the whole squadron."],
        ["Honor Guard", "Each model can take its own upgrade, so a squad can mix them."],
        ["Captain’s Plasma pistol", "The Armory box toggles it off at the per-model limit instead of counting past it."],
        ["Tyranid biomorphs", "Extremely Volatile, Camouflage, Acid Maw, Resonance Barb, Thornback and Tusked now show their rule on the unit sheet."],
        ["Print, simple view", "Armory equipment and bought gear now print on every card, HQs included."],
        ["Necron Atomic Energy Manipulator, The Stars Are Right", "No longer change the bearer’s own stats — one boosts another unit, the other triggers on a random turn."],
      ] },
      { label: "From the new sheets", rows: [
        ["Harpy", "New option from the October codex: swap its Twin stranglethorn cannon for a Twin heavy venom cannon (+151)."],
        ["Imperial Guard 1.05", "Valkyrie costs 175; every sniper rifle gets the Sniper ability."],
        ["Space Marines 1.05", "New points on a dozen characters and squads, Judicar 63, Razorback with a Twin heavy flamer, Reiver Marines reworked, Honor Guard 35."],
        ["Auspex scanner", "Grants Acute Senses in every army that has it. The Guard\u2019s old \u201cScanner\u201d is renamed and costs 10."],
        ["Jammer, Teleport homer", "New wording in every army: 12\u2033 Jammer range, homer needs a bearer that stayed put."],
        ["Trophy", "Stacks: each one adds another Terrifying(-1)."],
        ["Guard veteran abilities", "Cost 2 for monstrous creatures and vehicles, as printed."],
        ["Retribution", "Now inflicts automatic hits, not wounds. Telekinetic Blast is renamed Telekinetic Push."],
      ] },
    ],
    contrib: "\ud83d\udc41\ufe0f Found something wrong? The in-app bug report form works \u2014 unit, engagement, archetype and a picture.",
  },
  de: {
    title: "v1.81: Oktober-Tabellen in jeder Armee, Russisch und Japanisch, ein Trupp, der richtig schrumpft",
    intro: "Alle 21 Codizes mit den aktuellen Oktober-Tabellen abgeglichen und eingebaut, App und Wiki jetzt auch auf Russisch und Japanisch, dazu die Discord- und GitHub-Meldungen.",
    install: "",
    sections: [
      { label: "Neu in dieser Version", rows: [
        ["Sprachen", "Oberfl\u00e4che, Banner, Feldhandbuch, Erweiterungskarten, Nachrichten und das Regelglossar gibt es auf Russisch und Japanisch. Die Sprache oben auf der Seite w\u00e4hlen."],
        ["Reparierte Trupps", "Ein fehlerhaftes Daten-Update hatte Trupps mit fester Größe auf 1 Guardsman + 1 Sergeant schrumpfen lassen (Infantry Squad, Veterans, Command Squads und Einheiten in mehreren Armeen, GH#194). Sie haben wieder ihre volle Größe. Veteranenfähigkeiten drucken jetzt auch ihren Regeltext bei den Sonderregeln, und russische Überschriften nutzen eine Schrift mit Kyrillisch."],
        ["Wiki", "Eine Seite in f\u00fcnf Sprachen \u2014 Sprachumschalter im Kopf, \u00fcbersetzte Navigation, \u00dcberschriften, Slots, Abzeichen und Startseite. Grundregeln und Missionen sind ebenfalls übersetzt."],
        ["Noch englisch", "Die Einträge unter Bekannte Probleme."],
        ["Muttersprachler gesucht", "Die russischen und japanischen Texte hat Claude geschrieben, kein Muttersprachler hat sie bisher gelesen \u2014 Korrekturen auf Discord sind sehr willkommen."],
      ] },
      { label: "Oktober-Regeln, in der App verdrahtet", rows: [
        ["Neue Archetypen", "Megafauna, Swarming Masses und Wraithhost tun, was sie sagen: die beförderten Einheiten wandern zu Troops, Verhältnisse und Voraussetzungen werden erzwungen, und Heretic / Iconoclast ändern, aus welcher Armory die Authority der Inquisition leiht."],
        ["Legion", "Die Archetypen der Space Marines und Chaos Space Marines heißen jetzt Legion SM und Legion CSM; gespeicherte Listen werden automatisch umgestellt."],
        ["Grundregeln", "Blank, Disorderly Charge, der neue Deep-Strike-Text, Sniper, Narthecium und die allgemeinen psionischen Disziplinen folgen den Oktober-Grundregeln (1.278), im Feldhandbuch und im Wiki-Glossar."],
        ["Assassins und Necrons", "Assassins kosten 5 mehr, Eversor trägt eine Melta bomb, Culexus hat Blank; Pariahs 56 Punkte, Ophydian Destroyers 53, Scarab-Upgrades wie gedruckt."],
        ["Thallax und Wraithhost", "Thallax Cohort für die Forces of the Machine God, Wraithlords als Troops im Wraithhost, Null-Maiden Rhino, Marks der Furies, Chaos Bikers, Nahkampf-Tausch der Outrider."],
        ["Fehlermeldungen", "Das Formular hat einen optionalen Discord-Namen, damit eine schwer nachvollziehbare Meldung dort beantwortet werden kann, wo du ohnehin bist."],
        ["Daten", "Die Einheitendateien jeder Fraktion sind jetzt reines JSON \u2014 auf dem Bildschirm ändert sich nichts; Korrekturen aus der Community werden einfacher."],
      ] },
      { label: "Auf GitHub gemeldet", rows: [
        ["Oktober-Tabellen, jede Armee", "Alle 21 Codizes mit den aktuellen Oktober-Tabellen abgeglichen und eingebaut: neue Punkte, Waffen und Optionen, Blank, Disorderly Charge, Sniper, das eigene Auspex / Homer / Jammer jeder Armee."],
        ["Neu im Builder", "Thallax Cohort, Saturnine-Ruestung, Wraithlords als Truppen im Wraithhost, Null-Maiden Rhino, Mal-Wahl der Furies, Nahkampf-Tausch der Outrider, Chaos Bikers."],
        ["GH#186", "Eine Liste kann nicht mehr unter der falschen Fraktion gespeichert werden — ein langsames Handy konnte sie umetikettieren."],
        ["GH#185", "Warbuggy: Bis zu drei kleine Waffen ohne grosse Waffe; mit grosser Waffe eine."],
        ["GH#169", "Die Ork-Shoota erscheint wieder im Profil \u2014 getauscht oder zusaetzlich gekauft."],
        ["GH#168", "Die vier Tyraniden-Archetypen verschieben Einheiten: Carnifex, Ravener und Von Ryan\u2019s zu Troops, Genestealer und Krieger zu Elite, dazu die HQ-Bef\u00f6rderungen."],
        ["GH#170, GH#171", "Die Armory kauft wieder mehrere Exemplare \u2014 das K\u00e4stchen z\u00e4hlt sie, \u201e\u2212\u201c gibt eines zur\u00fcck."],
        ["GH#167", "Spezial-Biomorphe lassen sich wieder waehlen und behalten \u2014 das Oeffnen einer gespeicherten Tyraniden-Liste loescht sie nicht mehr."],
      ] },
      { label: "Auf Discord gemeldet", rows: [
        ["Discord", "Der Discord-Link ist jetzt ein richtiger Button \u2014 Vorschlag von atypicalhero, damit Neue uns finden."],
        ["I.O.U", "Blood Ravens koennen es nehmen: es kostet, was der gewaehlte Gegenstand aus dem Legacy-Armory einer anderen Armee kostet."],
        ["Build army", "Fragt nach, bevor die offene Liste verworfen wird."],
        ["Necron Warriors", "Ein kleinerer Trupp kuerzt die mit der Groesse skalierenden Tauschoptionen \u2014 keine 15 Gauss reapers mehr bei 10 Modellen."],
        ["Field Ordnance Battery, Heavy Weapon Squad", "Eine Waffe und ein Vox pro Batterie bzw. Team, nicht eines fuer den ganzen Trupp."],
        ["Honor Guard", "Jedes Modell kann sein eigenes Upgrade nehmen, ein Trupp kann sie mischen."],
        ["Plasmapistole des Captains", "Die Armory-Box schaltet sie am Limit pro Modell ab, statt weiterzuzaehlen."],
        ["Tyraniden-Biomorphe", "Extremely Volatile, Camouflage, Acid Maw, Resonance Barb, Thornback und Tusked zeigen ihre Regel jetzt auf dem Datenblatt."],
        ["Druck, einfache Ansicht", "Armory-Ausruestung und gekaufte Ausruestung wird jetzt auf jeder Karte gedruckt, auch bei HQs."],
        ["Necron Atomic Energy Manipulator, The Stars Are Right", "Aendern die Werte des Traegers nicht mehr — der eine verstaerkt eine andere Einheit, der andere wirkt erst in einer zufaelligen Runde."],
      ] },
      { label: "Aus den neuen Blaettern", rows: [
        ["Harpyie", "Neue Option aus dem Oktober-Codex: Twin stranglethorn cannon gegen Twin heavy venom cannon tauschen (+151)."],
        ["Imperial Guard 1.05", "Valkyrie kostet 175; jedes Scharfschuetzengewehr bekommt die Faehigkeit Sniper."],
        ["Space Marines 1.05", "Neue Punkte bei einem Dutzend Charakteren und Trupps, Judicar 63, Razorback mit Twin heavy flamer, Reiver Marines ueberarbeitet, Honor Guard 35."],
        ["Auspex scanner", "Gibt in jeder Armee Acute Senses. Der alte \u201eScanner\u201c der Garde ist umbenannt und kostet 10."],
        ["Jammer, Teleport homer", "Neuer Wortlaut in allen Armeen: Jammer 12\u2033, Homer braucht einen Traeger, der stehen blieb."],
        ["Trophy", "Ist kumulativ: jede gibt ein weiteres Terrifying(-1)."],
        ["Veteranenfaehigkeiten der Garde", "Kosten 2 fuer Monstroese Kreaturen und Fahrzeuge, wie gedruckt."],
        ["Retribution", "Verursacht jetzt automatische Treffer statt Verwundungen. Telekinetic Blast heisst jetzt Telekinetic Push."],
      ] },
    ],
    contrib: "\ud83d\udc41\ufe0f Etwas gefunden, das nicht stimmt? Das Fehlerformular in der App funktioniert \u2014 Einheit, Engagement, Archetyp und ein Bild.",
  },
  es: {
    title: "v1.81: hojas de octubre en todos los ejércitos, ruso y japonés, una escuadra que encoge bien",
    intro: "Los 21 códex revisados contra las hojas vivas de octubre y cableados, la app y la wiki ahora en ruso y japonés, más los reportes de Discord y GitHub.",
    install: "",
    sections: [
      { label: "Nuevo en esta versi\u00f3n", rows: [
        ["Idiomas", "Interfaz, banner, Manual de Campo, tarjetas de suplemento, mensajes y el glosario de reglas est\u00e1n en ruso y japon\u00e9s. Elige el idioma arriba en la p\u00e1gina."],
        ["Escuadras reparadas", "Una actualización de datos defectuosa había reducido las escuadras de tamaño fijo a 1 Guardsman + 1 Sergeant (Infantry Squad, Veterans, Command Squads y unidades de varios ejércitos, GH#194). Vuelven a su tamaño completo. Las habilidades de veterano ahora también imprimen su texto en Reglas especiales, y los títulos en ruso usan una fuente con cirílico."],
        ["Wiki", "Un solo sitio en cinco idiomas \u2014 selector de idioma en la cabecera, navegaci\u00f3n, t\u00edtulos, slots, insignias y portada traducidos. Reglas b\u00e1sicas y Misiones tambi\u00e9n est\u00e1n traducidas."],
        ["Sigue en ingl\u00e9s", "Las entradas de Problemas conocidos."],
        ["Se buscan nativos", "Los textos en ruso y japon\u00e9s los escribi\u00f3 Claude y ning\u00fan nativo los ha le\u00eddo todav\u00eda \u2014 las correcciones en Discord son muy bienvenidas."],
      ] },
      { label: "Reglas de octubre, cableadas en la app", rows: [
        ["Arquetipos nuevos", "Megafauna, Swarming Masses y Wraithhost hacen lo que dicen: las unidades promovidas pasan a Troops, se aplican las proporciones y los requisitos, y Heretic / Iconoclast cambian de qué Armory toma prestado Authority of the Inquisition."],
        ["Legion", "Los arquetipos de Space Marines y Chaos Space Marines ahora se llaman Legion SM y Legion CSM; las listas guardadas se convierten solas."],
        ["Reglas básicas", "Blank, Disorderly Charge, el nuevo texto de Deep Strike, Sniper, Narthecium y las disciplinas psíquicas generales siguen las Core Rules de octubre (1.278), en el Manual de Campo y el glosario de la wiki."],
        ["Assassins y Necrons", "Los Assassins cuestan 5 más, Eversor lleva una Melta bomb, Culexus tiene Blank; Pariahs 56 puntos, Ophydian Destroyers 53, las mejoras de Scarabs como impreso."],
        ["Thallax y Wraithhost", "Thallax Cohort para las Forces of the Machine God, Wraithlords como Troops en un Wraithhost, Null-Maiden Rhino, Marks de las Furies, Chaos Bikers, cambios cuerpo a cuerpo de los Outriders."],
        ["Reportes de errores", "El formulario tiene un nombre de Discord opcional, para poder responder un reporte difícil de seguir donde ya estás."],
        ["Datos", "Los archivos de unidades de todas las facciones ahora son JSON puro \u2014 en pantalla no cambia nada; facilita las correcciones de la comunidad."],
      ] },
      { label: "Reportado en GitHub", rows: [
        ["Hojas de octubre, todos los ejercitos", "Los 21 codex revisados contra las hojas vivas de octubre y cableados: puntos, armas y opciones nuevos, Blank, Disorderly Charge, Sniper, el Auspex / homer / Jammer propio de cada ejercito."],
        ["Nuevo en el builder", "Thallax Cohort, armadura Saturnine, Wraithlords como Tropas en Wraithhost, Null-Maiden Rhino, marcas de las Furies, cambios cuerpo a cuerpo de los Outriders, Chaos Bikers."],
        ["GH#186", "Una lista ya no se puede guardar con la facción equivocada — un móvil lento podia cambiarle la etiqueta."],
        ["GH#185", "Warbuggy: Hasta tres armas pequenas si no lleva arma grande; con arma grande, una."],
        ["GH#169", "La Shoota de los Orks vuelve a salir en el perfil, cambiada o comprada aparte."],
        ["GH#168", "Los cuatro arquetipos tyr\u00e1nidos mueven unidades de rol: Carnifex, Ravener y Von Ryan\u2019s a Troops, Genestealers y Guerreros a Elites, y las promociones a HQ."],
        ["GH#170, GH#171", "La armer\u00eda vuelve a comprar m\u00e1s de una copia \u2014 la casilla las cuenta y \u201c\u2212\u201d devuelve una."],
        ["GH#167", "Los biomorfos especiales se pueden elegir y conservar otra vez \u2014 abrir una lista guardada de Tiranidos ya no los borra."],
      ] },
      { label: "Reportado en Discord", rows: [
        ["Discord", "El enlace de Discord ahora es un bot\u00f3n de verdad \u2014 idea de atypicalhero, para que los nuevos nos encuentren."],
        ["I.O.U", "Los Blood Ravens pueden llevarlo: cuesta lo que cueste el objeto que elijas del Legacy Armory de otro ejercito."],
        ["Build army", "Pregunta antes de descartar la lista abierta, en vez de devolverte a ella sin avisar."],
        ["Necron Warriors", "Reducir una escuadra recorta los cambios que escalan con su tamano \u2014 se acabaron los 15 Gauss reapers en 10 modelos."],
        ["Field Ordnance Battery, Heavy Weapon Squad", "Un arma y un Vox por bateria o equipo, no uno para toda la escuadra."],
        ["Honor Guard", "Cada modelo puede tomar su propia mejora, asi que una escuadra puede mezclarlas."],
        ["Pistola de plasma del Captain", "La casilla de la Armeria la quita al llegar al limite por modelo, en vez de seguir contando."],
        ["Biomorfos tiranidos", "Extremely Volatile, Camouflage, Acid Maw, Resonance Barb, Thornback y Tusked muestran ahora su regla en la ficha."],
        ["Impresion, vista simple", "El equipo de la Armeria y el equipamiento comprado ahora se imprimen en cada carta, tambien en los HQ."],
        ["Necron Atomic Energy Manipulator, The Stars Are Right", "Ya no cambian las estadisticas del portador: uno mejora a otra unidad y el otro actua en un turno aleatorio."],
      ] },
      { label: "De las hojas nuevas", rows: [
        ["Harpy", "Opci\u00f3n nueva del c\u00f3dice de octubre: cambiar la Twin stranglethorn cannon por una Twin heavy venom cannon (+151)."],
        ["Imperial Guard 1.05", "La Valkyrie cuesta 175; todos los rifles de francotirador reciben la habilidad Sniper."],
        ["Space Marines 1.05", "Puntos nuevos en una docena de personajes y escuadras, Judicar 63, Razorback con Twin heavy flamer, Reiver Marines reformados, Honor Guard 35."],
        ["Auspex scanner", "Da Acute Senses en todos los ejercitos que lo tienen. El \u201cScanner\u201d viejo de la Guardia se renombra y cuesta 10."],
        ["Jammer, Teleport homer", "Texto nuevo en todos los ejercitos: Jammer a 12\u2033, el homer exige portador que no se movio."],
        ["Trophy", "Es acumulativo: cada uno suma otro Terrifying(-1)."],
        ["Habilidades de veterano de la Guardia", "Cuestan 2 para criaturas monstruosas y vehiculos, como impreso."],
        ["Retribution", "Ahora causa impactos automaticos, no heridas. Telekinetic Blast pasa a llamarse Telekinetic Push."],
      ] },
    ],
    contrib: "\ud83d\udc41\ufe0f \u00bfEncontraste algo mal? El formulario de reporte de la app funciona \u2014 unidad, engagement, arquetipo y una foto.",
  },
  ru: {
    title: "v1.81: октябрьские листы во всех армиях, русский и японский, отряд, который правильно уменьшается",
    intro: "Все 21 кодекса перечитаны по актуальным октябрьским листам и подключены, приложение и вики теперь на русском и японском, плюс сообщения из Discord и GitHub.",
    install: "",
    sections: [
      { label: "Новое в этой версии", rows: [
        ["Языки", "Интерфейс, баннер, Полевое руководство, карточки дополнений, сообщения и глоссарий правил доступны на русском и японском. Выберите язык вверху страницы."],
        ["Исправленные отряды", "Неудачное обновление данных сократило отряды фиксированного размера до 1 Guardsman + 1 Sergeant (Infantry Squad, Veterans, Command Squads и юниты в нескольких армиях, GH#194). Теперь они снова полного размера. Способности ветерана теперь печатают и текст правила в разделе особых правил, а русские заголовки используют шрифт с кириллицей."],
        ["Вики", "Один сайт на пяти языках — переключатель языка в шапке, переведены навигация, заголовки, слоты, значки и главная. Основные правила и Миссии тоже переведены."],
        ["Пока на английском", "Записи раздела «Известные проблемы»."],
        ["Нужны носители языка", "Русские и японские тексты написал Claude, и ни один носитель их ещё не читал — исправления в Discord очень приветствуются."],
      ] },
      { label: "Октябрьские правила, подключённые в приложении", rows: [
        ["Новые архетипы", "Megafauna, Swarming Masses и Wraithhost делают то, что написано: повышенные отряды переходят в Войска, пропорции и требования соблюдаются, а Heretic / Iconoclast меняют, из какого Арсенала берёт Authority of the Inquisition."],
        ["Legion", "Архетипы Space Marines и Chaos Space Marines теперь называются Legion SM и Legion CSM; сохранённые списки конвертируются сами."],
        ["Основные правила", "Blank, Disorderly Charge, новый текст Deep Strike, Sniper, Narthecium и общие псионические дисциплины соответствуют октябрьским Core Rules (1.278) — в Полевом руководстве и глоссарии вики."],
        ["Assassins и Necrons", "Assassins стоят на 5 больше, у Eversor есть Melta bomb, у Culexus — Blank; Pariahs 56 очков, Ophydian Destroyers 53, улучшения Scarabs как напечатано."],
        ["Thallax и Wraithhost", "Thallax Cohort для Forces of the Machine God, Wraithlords как Войска в Wraithhost, Null-Maiden Rhino, метки Furies, Chaos Bikers, замены ближнего боя у Outriders."],
        ["Отчёты об ошибках", "В форме есть необязательное имя в Discord, чтобы на трудный для понимания отчёт можно было ответить там, где вы уже находитесь."],
        ["Данные", "Файлы отрядов всех фракций теперь чистый JSON — на экране ничего не меняется; так проще вносить правки от сообщества."],
      ] },
      { label: "Сообщено на GitHub", rows: [
        ["Октябрьские листы, все армии", "Все 21 кодекса перечитаны по актуальным октябрьским листам и подключены: новые очки, оружие и опции, Blank, Disorderly Charge, Sniper, собственные Auspex / homer / Jammer каждой армии."],
        ["Новое в конструкторе", "Thallax Cohort, броня Saturnine, Wraithlords как Войска в Wraithhost, Null-Maiden Rhino, метки Furies, замены ближнего боя у Outriders, Chaos Bikers."],
        ["GH#186", "Список больше нельзя сохранить под неверной фракцией — медленный телефон мог его перемаркировать."],
        ["GH#185", "Warbuggy: до трёх малых орудий, если большое не взято; с большим орудием — одно."],
        ["GH#169", "Orc Shoota снова показывается в профиле — и когда заменена, и когда куплена отдельно."],
        ["GH#168", "Четыре архетипа тиранидов перемещают отряды между ролями: Carnifex, Ravener и Von Ryan’s — в Войска, Genestealers и Warriors — в Элиту, плюс названные повышения до Штаба."],
        ["GH#170, GH#171", "Арсенал снова покупает несколько копий — окошко считает их, а «−» возвращает одну."],
        ["GH#167", "Особые биоморфы снова можно выбирать и сохранять — открытие сохранённого списка тиранидов их больше не стирает."],
      ] },
      { label: "Сообщено в Discord", rows: [
        ["Discord", "Ссылка на Discord теперь настоящая кнопка — идея atypicalhero, чтобы новички нас находили."],
        ["I.O.U", "Blood Ravens могут её взять: она стоит столько, сколько стоит предмет, выбранный из Арсенала Наследия другой армии."],
        ["Build army", "Спрашивает перед тем, как отбросить открытый список, а не молча возвращает вас в него."],
        ["Necron Warriors", "Уменьшение отряда обрезает замены, зависящие от его размера — больше никаких 15 Gauss reapers в отряде из 10."],
        ["Field Ordnance Battery, Heavy Weapon Squad", "Одно оружие и один Vox на батарею или расчёт, а не на весь отряд."],
        ["Honor Guard", "Каждая модель может взять своё улучшение, так что отряд может их смешивать."],
        ["Plasma pistol капитана", "Окошко Арсенала отключает её на лимите на модель, а не считает дальше."],
        ["Биоморфы тиранидов", "Extremely Volatile, Camouflage, Acid Maw, Resonance Barb, Thornback и Tusked теперь показывают своё правило в карточке отряда."],
        ["Печать, простой вид", "Снаряжение из Арсенала и купленное снаряжение теперь печатаются на каждой карточке, включая Штабы."],
        ["Necron Atomic Energy Manipulator, The Stars Are Right", "Больше не меняют характеристики владельца — один усиливает другой отряд, другой срабатывает в случайный ход."],
      ] },
      { label: "Из новых листов", rows: [
        ["Harpy", "Новая опция из октябрьского кодекса: заменить Twin stranglethorn cannon на Twin heavy venom cannon (+151)."],
        ["Imperial Guard 1.05", "Valkyrie стоит 175; каждая снайперская винтовка получает способность Sniper."],
        ["Space Marines 1.05", "Новые очки у дюжины персонажей и отрядов, Judicar 63, Razorback с Twin heavy flamer, Reiver Marines переработаны, Honor Guard 35."],
        ["Auspex scanner", "Даёт Acute Senses в каждой армии, где он есть. Старый «Scanner» Гвардии переименован и стоит 10."],
        ["Jammer, Teleport homer", "Новая формулировка во всех армиях: дальность Jammer 12″, homer требует носителя, который не двигался."],
        ["Trophy", "Суммируется: каждый добавляет ещё одно Terrifying(-1)."],
        ["Способности ветеранов Гвардии", "Стоят 2 для монструозных существ и техники, как напечатано."],
        ["Retribution", "Теперь наносит автоматические попадания, а не раны. Telekinetic Blast переименована в Telekinetic Push."],
      ] },
    ],
    contrib: "👁️ Нашли ошибку? Форма отчёта об ошибках в приложении работает — отряд, формат боя, архетип и картинка.",
  },
  ja: {
    title: "v1.81：全軍の10月シート、ロシア語と日本語、正しく縮む分隊",
    intro: "全21コデックスを最新の10月シートと突き合わせて反映。アプリとWikiがロシア語と日本語に対応し、DiscordとGitHubの報告も含みます。",
    install: "",
    sections: [
      { label: "このバージョンの新機能", rows: [
        ["言語", "インターフェース、バナー、フィールドマニュアル、サプリメントカード、メッセージ、ルール用語集がロシア語と日本語で利用できます。ページ上部で言語を選んでください。"],
        ["スクワッドの修正", "データ更新の不具合で、固定サイズのスクワッドが Guardsman 1 + Sergeant 1 に縮んでいました（Infantry Squad、Veterans、Command Squads など複数の軍のユニット、GH#194）。元のサイズに戻りました。ベテランアビリティは印刷時にスペシャルルールへ本文も載るようになり、ロシア語の見出しはキリル文字対応のフォントを使います。"],
        ["Wiki", "5言語の1サイト — ヘッダーの言語切り替え、翻訳されたナビゲーション、見出し、枠、バッジ、ホームページ。基本ルールとミッションのページも翻訳済みです。"],
        ["まだ英語", "既知の問題の項目。"],
        ["ネイティブの方募集", "ロシア語と日本語のテキストはClaudeが書いたもので、ネイティブの方はまだ誰も読んでいません — Discordでの修正を大歓迎します。"],
      ] },
      { label: "10月のルール、アプリに反映", rows: [
        ["新アーキタイプ", "Megafauna、Swarming Masses、Wraithhost が記載どおりに動作：昇格した部隊は主力部隊に移り、比率と必要条件が強制され、Heretic / Iconoclast は Authority of the Inquisition が借りる武器庫を変えます。"],
        ["Legion", "スペースマリーンとケイオス・スペースマリーンのアーキタイプは Legion SM と Legion CSM に名称変更。保存済みリストは自動で変換されます。"],
        ["基本ルール", "Blank、Disorderly Charge、新しい Deep Strike の文面、Sniper、Narthecium、汎用サイキック系統が10月の Core Rules（1.278）に従います（フィールドマニュアルとWiki用語集）。"],
        ["Assassins と Necrons", "Assassin は5pts増、Eversor は Melta bomb を所持、Culexus は Blank を持ちます。Pariah 56pts、Ophydian Destroyer 53pts、Scarab のアップグレードは記載どおり。"],
        ["Thallax と Wraithhost", "Forces of the Machine God に Thallax Cohort、Wraithhost で主力部隊として扱える Wraithlord、Null-Maiden Rhino、Furies の印、Chaos Bikers、Outrider の近接武器の交換。"],
        ["不具合報告", "フォームに任意の Discord 名を追加。追いにくい報告に、すでにいる場所で返信できます。"],
        ["データ", "全勢力の部隊ファイルが純粋なJSONになりました — 画面上の変化はありませんが、コミュニティからの修正がしやすくなります。"],
      ] },
      { label: "GitHubで報告", rows: [
        ["10月のシート、全軍", "全21コデックスを最新の10月シートと突き合わせて反映：新しいポイント、武器、オプション、Blank、Disorderly Charge、Sniper、各軍固有の Auspex / homer / Jammer。"],
        ["ビルダーの新機能", "Thallax Cohort、Saturnine アーマー、Wraithhost で主力部隊として扱える Wraithlord、Null-Maiden Rhino、Furies の印、Outrider の近接武器の交換、Chaos Bikers。"],
        ["GH#186", "リストが誤った勢力で保存されることはなくなりました — 動作の遅いスマホでラベルが書き換わることがありました。"],
        ["GH#185", "Warbuggy：大型武器を取らない場合は小型武器を最大3つ、大型武器を取る場合は1つ。"],
        ["GH#169", "オルクの Shoota が再びプロファイルに表示されます — 交換した場合も、追加購入した場合も。"],
        ["GH#168", "ティラニッドの4つのアーキタイプが部隊の役割を移動させます：Carnifex、Ravener、Von Ryan’s は主力部隊へ、Genestealer と Warrior は精鋭へ、さらに名前付きの司令部昇格。"],
        ["GH#170, GH#171", "武器庫で複数個を購入できるようになりました — ボックスが個数を数え、「−」で1つ戻せます。"],
        ["GH#167", "特殊バイオモルフを再び選択・保持できます — 保存済みのティラニッドのリストを開いても消えなくなりました。"],
      ] },
      { label: "Discordで報告", rows: [
        ["Discord", "Discordのリンクが本物のボタンになりました — 新規の人が見つけやすいよう atypicalhero さんが提案。"],
        ["I.O.U", "Blood Ravens が取得可能：他軍のレガシー武器庫から選んだアイテムの価格がそのままコストになります。"],
        ["Build army", "開いているリストを破棄する前に確認します。黙ってそのリストに戻されることはなくなりました。"],
        ["Necron Warriors", "分隊を縮めると、規模に比例する交換が削られます — 10体の分隊に Gauss reaper が15丁、はもうありません。"],
        ["Field Ordnance Battery, Heavy Weapon Squad", "武器と Vox は分隊全体ではなく、砲兵隊またはチームごとに1つです。"],
        ["Honor Guard", "各モデルが個別にアップグレードを取れるため、分隊内で混在できます。"],
        ["キャプテンのプラズマ・ピストル", "武器庫ボックスは、モデルごとの上限に達するとカウントを続けず切り替わります。"],
        ["ティラニッドのバイオモルフ", "Extremely Volatile、Camouflage、Acid Maw、Resonance Barb、Thornback、Tusked のルールがユニットシートに表示されます。"],
        ["印刷（シンプル表示）", "武器庫の装備と購入した装備が、司令部を含むすべてのカードに印刷されます。"],
        ["Necron Atomic Energy Manipulator, The Stars Are Right", "保持者自身の能力値は変わらなくなりました — 一方は別の部隊を強化し、もう一方はランダムなターンに発動します。"],
      ] },
      { label: "新しいシートから", rows: [
        ["Harpy", "10月コデックスの新オプション：Twin stranglethorn cannon を Twin heavy venom cannon に交換（+151）。"],
        ["Imperial Guard 1.05", "Valkyrie は175pts、すべてのスナイパーライフルが Sniper 能力を得ます。"],
        ["Space Marines 1.05", "十数体のキャラクターと分隊のポイント変更、Judicar 63、Twin heavy flamer 付き Razorback、Reiver Marines の再設計、Honor Guard 35。"],
        ["Auspex scanner", "所持するすべての軍で Acute Senses を付与。ガードの旧「Scanner」は名称変更され、10ptsです。"],
        ["Jammer, Teleport homer", "全軍で文言が新しくなりました：Jammer の範囲は12″、homer は動かなかった保持者が必要です。"],
        ["Trophy", "累積します：1つにつきTerrifying(-1)がもう1つ加わります。"],
        ["ガードのベテラン能力", "印刷どおり、モンストラス・クリーチャーと車両ではコスト2です。"],
        ["Retribution", "ウーンズではなく自動ヒットを与えるようになりました。Telekinetic Blast は Telekinetic Push に名称変更。"],
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
            title="Dismiss"
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
          title="Dismiss"
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
  onShowCheatSheets: () => void;
}

export function LandingPage({
  saves, announcement, canResume,
  onStart, onResume, onLoadArmy, onShowAuth, onShowCloudSaves, onShowCommunity, onShowCheatSheets,
  onShowCampaign,
  onShowEvents,
}: Props) {
  const { language: wikiLang } = useLanguage();
  // The wiki is built once per language (en at the root, the others under /<code>).
  const wikiBase = 'https://custom40k-wiki.vercel.app' + (wikiLang === 'en' ? '' : '/' + wikiLang);
  const [showChangelog, setShowChangelog] = useState(false);
  // The fog is now STATIC. Animating the feTurbulence baseFrequency re-rendered a full-screen
  // fractalNoise + displacement filter every update — even throttled it kept the CPU at ~12% idle
  // and spun up fans. The static turbulence renders once and then just composites, so idle CPU
  // drops to ~0 while the fog still looks the same. (No rAF loop, no per-frame recompute.)
  const [openSupplement, setOpenSupplement] = useState<SupplementKey | null>(null);
  const [showMessages, setShowMessages] = useState(false);
  const [unread, setUnread] = useState(0);
  const latestVersion = CHANGELOG[0]?.version ?? '';
  const t = useT();
  const { loggedIn, username, avatar, isAdmin, isInterrogator } = useAuth();
  const refreshUnread = () => { api.getUnreadCount().then(r => setUnread(r.count)).catch(() => {}); };
  useEffect(() => { if (loggedIn) refreshUnread(); else setUnread(0); }, [loggedIn]);

  const displaySaves = saves.filter(s => s.id !== 'autosave-session' && !s.id.startsWith('autosave'));

  return (
      <div className="relative min-h-screen bg-zinc-950 text-zinc-100 flex flex-col overflow-hidden">
        {/* SVG fog filter */}
        <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
          <defs>
            <filter id="c40k-fog" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="3" />
              <feDisplacementMap in="SourceGraphic" scale="55" />
            </filter>
          </defs>
        </svg>
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
                title="Campaign mode — alpha access (admin)"
                className="col-span-2 btn-sweep flex items-center justify-center gap-2 py-3 px-4 border border-zinc-700 hover:border-amber-700 text-zinc-400 hover:text-amber-300 text-[12px] uppercase tracking-wider transition-colors"
              >
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v4.083M17.91 3.5A9 9 0 0121 12a9 9 0 01-9 9m0-18a9 9 0 00-9 9m9-9c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm0 18v-4a2 2 0 012-2h2.599" /></svg>
                {t('navCampaignAlphaAdmin')}
              </button>
            ) : (
              <button
                disabled
                title="Campaign mode is still in alpha testing"
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
                title="Events & Leagues"
                className="col-span-2 btn-sweep flex items-center justify-center gap-2 py-3 px-4 border border-zinc-700 hover:border-amber-700 text-zinc-400 hover:text-amber-300 text-[12px] uppercase tracking-wider transition-colors"
              >
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21h8m-4-4v4m-7-9a7 7 0 0014 0V4H5v8zm0 0H3a2 2 0 01-2-2V6h4m14 6h2a2 2 0 002-2V6h-4" /></svg>
                EVENTS &amp; LEAGUES
              </button>
            ) : (
              <button
                disabled
                title="Sign in to join an event or a league"
                className="col-span-2 flex items-center justify-center gap-2 py-3 px-4 border border-zinc-800 text-zinc-600 text-[12px] uppercase tracking-wider cursor-not-allowed"
              >
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21h8m-4-4v4m-7-9a7 7 0 0014 0V4H5v8zm0 0H3a2 2 0 01-2-2V6h4m14 6h2a2 2 0 002-2V6h-4" /></svg>
                EVENTS &amp; LEAGUES — SIGN IN
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
                <div className="text-zinc-100 text-[13px] font-bold uppercase tracking-wide mb-0.5">Horus Heresy</div>
                <div className="text-zinc-500 text-[10px] leading-relaxed">{t('hhCardDesc')}</div>
                <div className="text-red-900 group-hover:text-red-600 text-[10px] uppercase tracking-widest mt-1.5 transition-colors">Legiones Astartes</div>
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
                <div className="text-orange-900 group-hover:text-orange-600 text-[10px] uppercase tracking-widest mt-1.5 transition-colors">Taghmata</div>
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
                <div className="text-zinc-100 text-[13px] font-bold uppercase tracking-wide mb-0.5">Escalation</div>
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
                <div className="text-zinc-100 text-[13px] font-bold uppercase tracking-wide mb-0.5">Assassins</div>
                <div className="text-zinc-500 text-[10px] leading-relaxed">{t('assCardDesc')}</div>
                <div className="text-zinc-500 group-hover:text-zinc-300 text-[10px] uppercase tracking-widest mt-1.5 transition-colors">Execution Force</div>
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
