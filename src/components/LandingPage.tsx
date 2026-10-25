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

const ANNOUNCEMENT_KEY = 'c40k_announcement_v186t_dismissed';

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
    title: "v1.86: The October sheet update",
    intro: "The sheets changed a lot this month; the app now reads the new spellings.",
    install: "",
    sections: [
      { label: "General", rows: [
        ["Campaign","The Planetary Assault campaign is open as an alpha: sign in and press Campaign on the front page. Its rules are linked inside."],
        ["Rules","Hover (or tap, on a phone) an ability in a weapon table to read its rule."],
        ["Phones","Saved lists fit a narrow screen, and an update no longer looks like you were signed out."],
        ["Accounts","You can change your own username from Account security."],
        ["Print","Psychic powers, prayers and pacts are printed once, in a book after the last unit (and at the bottom of the battle view). Abilities a trait gives are explained in the Special Rules."],
        ["Sheets","New prices, options and Armory items from the October sheets; the Perfect Timing power and 44 trait and legacy texts follow them."],
      ] },
      { label: "Space Marines", rows: [
        ["New","The Legion of the Damned archetype with its own 7-unit supplement, and the Stormfang Gunship."],
        ["Legacy","Legacy of the Damned is now Legacy of the Relic Hunters."],
        ["Purity above All","Paid only when you tick the Apothecary option on the unit."],
      ] },
      { label: "Chaos Space Marines", rows: [
        ["New","Fellgors, Chaos Land Raider Sonic and Giant Chaos Spawn."],
        ["Poxwalkers","Mindless is listed as a rule."],
        ["Helbrute","Each Helbrute of a squad can swap its weapons and take its own combi-bolter or heavy flamer."],
      ] },
      { label: "Dark Eldar", rows: [
        ["New","Incubi Bloodstone, Murderous Assault and Onslaught, the Grotesque Aberration and the Mindphase gauntlet."],
      ] },
      { label: "Eldar", rows: [
        ["New","The Hemlock Wraithfighter."],
        ["Aspect Focus","Makes the Dark Reapers Elite choices; Sun pistols and Sun rifles can be swapped in on the Aspect Warriors."],
      ] },
      { label: "Necrons", rows: [
        ["Tesla","The Night Scythe and Doom Scythe tesla guns no longer show AT(1)."],
        ["Scarabs","The Scarab explosion now prints."],
      ] },
      { label: "T'au Empire", rows: [
        ["Sheet 1.9","More Wounds, Strength and Toughness on the battlesuits, new points, Shield, Missile and Stealth Drones changed, Armory items repriced."],
        ["XV85 Enforcer","Gets its extra weapon (and extra support system), for the Crisis Honor Guard and the Crisis Battlesuits."],
        ["Kroot","Every Lone-Spear and Great Knarloc can take its own options."],
      ] },
      { label: "Adeptus Mechanicus", rows: [
        ["Dark Mechanicum","Treated as Chaos Space Marines in the Ally matrix."],
        ["Rule texts","Monotask, Choir Master and the Magos and Tech-Priest upgrades now show their text."],
      ] },
      { label: "Assassins", rows: [
        ["Callidus, Vindicare","Both gain Hunter; the Callidus loses Polymorphine."],
      ] },
      { label: "Imperial Guard", rows: [
        ["New","Rogal Dorn Tank Commander (640 pts); only one Leman Russ or Rogal Dorn Tank Commander per army."],
        ["Updated","Leman Russ Tank Commander costs 294; Rogal Dorn costs 527 and has Strength 7."],
        ["Platoons","Special and Heavy Weapon Squads taken in a platoon count toward the Troops points requirement."],
        ["Tauros","Any Tauros can become a Venator, and the Venator stubber swap works. Combat Engineers no longer show a lasgun swap. Vulture, Valkyrie, Vendetta and the other flyers show 2x Hellstrike missiles and 3x Tactical bombs when the option says two or three."],
      ] },
      { label: "Grey Knights", rows: [
        ["Paladins","Paladin Squads start knowing every General and Grey Knight power, so there is nothing to pick."],
      ] },
      { label: "Genestealer Cults", rows: [
        ["Atalan Jackals","Every Jackal and Wolfquad can take its own options."],
      ] },
      { label: "Leagues of Votann", rows: [
        ["Demiurg","Can only be an allied detachment for the T’au Empire."],
      ] },
      { label: "Escalation", rows: [
        ["War Dogs, Armigers","War Dogs for every Chaos army and Armigers for every Imperial army (Chaos Daemons excluded)."],
      ] },
    ],
    contrib: "\ud83d\udc41\ufe0f Found something wrong? The in-app bug report form works \u2014 unit, engagement, archetype and a picture.",
  },
  de: {
    title: "v1.86: Das Oktober-Update der Datenblätter",
    intro: "Die Blätter haben sich diesen Monat stark geändert; die App liest jetzt die neuen Schreibweisen.",
    install: "",
    sections: [
      { label: "Allgemein", rows: [
        ["Feldzug","Die Planetary-Assault-Kampagne ist als Alpha offen: melde dich an und drücke auf der Startseite auf Feldzug. Die Regeln sind dort verlinkt."],
        ["Regeln","Fahre (oder tippe, auf dem Handy) in einer Waffentabelle auf eine Fähigkeit, um ihre Regel zu lesen."],
        ["Handy","Gespeicherte Listen passen auf schmale Bildschirme, und ein Update sieht nicht mehr wie eine Abmeldung aus."],
        ["Konten","Du kannst deinen Benutzernamen unter Kontosicherheit selbst ändern."],
        ["Druck","Psikräfte, Gebete und Pakte stehen einmal in einem Buch hinter der letzten Einheit (und unten in der Kampfansicht). Fähigkeiten eines Wesenszugs werden in den Spezialregeln erklärt."],
        ["Blätter","Neue Preise, Optionen und Rüstkammer-Gegenstände aus den Oktober-Blättern; die Kraft Perfect Timing und 44 Texte zu Wesenszügen und Legacys folgen ihnen."],
      ] },
      { label: "Space Marines", rows: [
        ["Neu","Der Archetyp Legion of the Damned mit eigener Ergänzung (7 Einheiten) und das Stormfang Gunship."],
        ["Legacy","Legacy of the Damned heißt jetzt Legacy of the Relic Hunters."],
        ["Purity above All","Kostet nur noch, wenn du die Apothekar-Option bei der Einheit ankreuzt."],
      ] },
      { label: "Chaos Space Marines", rows: [
        ["Neu","Fellgors, Chaos Land Raider Sonic und Giant Chaos Spawn."],
        ["Poxwalkers","Mindless steht als Regel da."],
        ["Helbrute","Jeder Helbrute eines Trupps kann seine Waffen tauschen und seinen eigenen Combi-bolter oder Heavy flamer nehmen."],
      ] },
      { label: "Dark Eldar", rows: [
        ["Neu","Incubi-Bloodstone, Murderous Assault und Onslaught, die Grotesque-Aberration und der Mindphase gauntlet."],
      ] },
      { label: "Eldar", rows: [
        ["Neu","Der Hemlock Wraithfighter."],
        ["Aspect Focus","Macht die Dark Reapers zu Elite-Auswahlen; Sun pistol und Sun rifle können bei den Aspektkriegern getauscht werden."],
      ] },
      { label: "Necrons", rows: [
        ["Tesla","Die Tesla-Waffen von Night Scythe und Doom Scythe zeigen kein AT(1) mehr."],
        ["Scarabs","Die Scarab-Explosion wird jetzt gedruckt."],
      ] },
      { label: "T'au", rows: [
        ["Tabelle 1.9","Mehr Wunden, Stärke und Widerstand bei den Kampfanzügen, neue Punkte, Schild-, Raketen- und Tarndrohnen geändert, Rüstkammer neu bepreist."],
        ["XV85 Enforcer","Bekommt seine zusätzliche Waffe (und sein zusätzliches Unterstützungssystem), bei Crisis-Ehrengarde und Crisis-Kampfanzügen."],
        ["Kroot","Jeder Lone-Spear und jeder Great Knarloc kann seine eigenen Optionen nehmen."],
      ] },
      { label: "Adeptus Mechanicus", rows: [
        ["Dark Mechanicum","Werden in der Alliiertenmatrix wie Chaos Space Marines behandelt."],
        ["Regeltexte","Monotask, Choir Master und die Upgrades von Magos und Tech-Priest zeigen jetzt ihren Text."],
      ] },
      { label: "Assassinen", rows: [
        ["Callidus, Vindicare","Beide erhalten Hunter; der Callidus verliert Polymorphine."],
      ] },
      { label: "Imperiale Armee", rows: [
        ["Neu","Rogal Dorn Tank Commander (640 Pkt.); nur ein Leman Russ oder Rogal Dorn Tank Commander pro Armee."],
        ["Aktualisiert","Leman Russ Tank Commander kostet 294; Rogal Dorn kostet 527 und hat Stärke 7."],
        ["Platoons","Special und Heavy Weapon Squads in einem Platoon zählen jetzt für die Truppen-Mindestpunkte."],
        ["Tauros","Jeder Tauros kann ein Venator werden, und der Stubber-Tausch des Venator funktioniert. Combat Engineers zeigen keinen Lasgun-Tausch mehr. Vulture, Valkyrie, Vendetta und die anderen Flieger zeigen 2x Hellstrike-Raketen und 3x Tactical bombs, wenn die Option zwei oder drei sagt."],
      ] },
      { label: "Grey Knights", rows: [
        ["Paladine","Paladin Squads kennen von Anfang an jede allgemeine und Grey-Knight-Kraft, es gibt nichts zu wählen."],
      ] },
      { label: "Genestealer Cults", rows: [
        ["Atalan Jackals","Jeder Jackal und jeder Wolfquad kann seine eigenen Optionen nehmen."],
      ] },
      { label: "Leagues of Votann", rows: [
        ["Demiurg","Kann nur ein verbündetes Kontingent für die T’au sein."],
      ] },
      { label: "Escalation", rows: [
        ["War Dogs, Armigers","War Dogs für jede Chaos-Armee und Armigers für jede imperiale Armee (ohne Chaos Daemons)."],
      ] },
    ],
    contrib: "\ud83d\udc41\ufe0f Etwas gefunden, das nicht stimmt? Das Fehlerformular in der App funktioniert \u2014 Einheit, Engagement, Archetyp und ein Bild.",
  },
  es: {
    title: "v1.86: La actualización de hojas de octubre",
    intro: "Las hojas han cambiado mucho este mes; la app ya lee las grafías nuevas.",
    install: "",
    sections: [
      { label: "General", rows: [
        ["Campaña","La campaña Planetary Assault está abierta como alpha: inicia sesión y pulsa Campaña en la portada. Las reglas están enlazadas dentro."],
        ["Reglas","Pasa el ratón (o toca, en el móvil) sobre una habilidad de una tabla de armas para leer su regla."],
        ["Móvil","Las listas guardadas caben en pantallas estrechas, y una actualización ya no parece un cierre de sesión."],
        ["Cuentas","Puedes cambiar tu nombre de usuario en Seguridad de la cuenta."],
        ["Impresión","Los poderes psíquicos, plegarias y pactos se imprimen una vez, en un libro tras la última unidad (y al final de la vista de batalla). Las habilidades que da un rasgo se explican en las Reglas especiales."],
        ["Hojas","Precios, opciones y objetos de Armería nuevos de las hojas de octubre; el poder Perfect Timing y 44 textos de rasgos y legados los siguen."],
      ] },
      { label: "Space Marines", rows: [
        ["Nuevo","El arquetipo Legion of the Damned con su propio suplemento de 7 unidades, y el Stormfang Gunship."],
        ["Legado","Legacy of the Damned ahora es Legacy of the Relic Hunters."],
        ["Purity above All","Solo se paga si marcas la opción del Apothecary en la unidad."],
      ] },
      { label: "Chaos Space Marines", rows: [
        ["Nuevo","Fellgors, Chaos Land Raider Sonic y Giant Chaos Spawn."],
        ["Poxwalkers","Mindless aparece como regla."],
        ["Helbrute","Cada Helbrute de un escuadrón puede cambiar sus armas y tomar su propio combi-bolter o heavy flamer."],
      ] },
      { label: "Dark Eldar", rows: [
        ["Nuevo","Incubi Bloodstone, Murderous Assault y Onslaught, la Grotesque Aberration y el Mindphase gauntlet."],
      ] },
      { label: "Eldar", rows: [
        ["Nuevo","El Hemlock Wraithfighter."],
        ["Aspect Focus","Convierte a los Dark Reapers en Élites; en los Guerreros Aspecto se pueden cambiar a Sun pistol y Sun rifle."],
      ] },
      { label: "Necrones", rows: [
        ["Tesla","Las armas tesla de la Night Scythe y la Doom Scythe ya no muestran AT(1)."],
        ["Escarabajos","La explosión del Scarab ya se imprime."],
      ] },
      { label: "T'au", rows: [
        ["Hoja 1.9","Más Heridas, Fuerza y Resistencia en los trajes, puntos nuevos, Drones Escudo, de Misiles y Sigilo cambiados, Armería con precios nuevos."],
        ["XV85 Enforcer","Recibe su arma extra (y su sistema de apoyo extra), en la Guardia de Honor Crisis y los Trajes de Combate Crisis."],
        ["Kroot","Cada Lone-Spear y cada Great Knarloc puede tomar sus propias opciones."],
      ] },
      { label: "Adeptus Mechanicus", rows: [
        ["Dark Mechanicum","Se tratan como Chaos Space Marines en la matriz de aliados."],
        ["Textos de reglas","Monotask, Choir Master y las mejoras de Magos y Tech-Priest ya muestran su texto."],
      ] },
      { label: "Asesinos", rows: [
        ["Callidus, Vindicare","Ambos ganan Hunter; el Callidus pierde Polymorphine."],
      ] },
      { label: "Guardia Imperial", rows: [
        ["Nuevo","Rogal Dorn Tank Commander (640 pts); solo un Leman Russ o Rogal Dorn Tank Commander por ejército."],
        ["Actualizado","El Leman Russ Tank Commander cuesta 294; el Rogal Dorn cuesta 527 y tiene Fuerza 7."],
        ["Pelotones","Los Special y Heavy Weapon Squads de un pelotón ya cuentan para los puntos mínimos de Tropas."],
        ["Tauros","Cualquier Tauros puede ser un Venator, y el cambio de stubber del Venator funciona. Los Combat Engineers ya no muestran un cambio de lasgun. El Vulture, la Valkyrie, el Vendetta y los demás voladores muestran 2x misiles Hellstrike y 3x Tactical bombs cuando la opción dice dos o tres."],
      ] },
      { label: "Grey Knights", rows: [
        ["Paladines","Los Paladin Squads empiezan conociendo todos los poderes generales y de Grey Knights, así que no hay nada que elegir."],
      ] },
      { label: "Genestealer Cults", rows: [
        ["Atalan Jackals","Cada Jackal y cada Wolfquad puede tomar sus propias opciones."],
      ] },
      { label: "Leagues of Votann", rows: [
        ["Demiurg","Solo puede ser un destacamento aliado de los T’au."],
      ] },
      { label: "Escalation", rows: [
        ["War Dogs, Armigers","War Dogs para todo ejército del Caos y Armigers para todo ejército imperial (sin Chaos Daemons)."],
      ] },
    ],
    contrib: "\ud83d\udc41\ufe0f \u00bfEncontraste algo mal? El formulario de reporte de la app funciona \u2014 unidad, engagement, arquetipo y una foto.",
  },
  ru: {
    title: "v1.86: Октябрьское обновление таблиц",
    intro: "В этом месяце таблицы сильно изменились; приложение теперь читает новые написания.",
    install: "",
    sections: [
      { label: "Общее", rows: [
        ["Кампания","Кампания Planetary Assault открыта как альфа: войдите и нажмите «Кампания» на главной странице. Правила — по ссылке внутри."],
        ["Правила","Наведите курсор (или коснитесь, на телефоне) на способность в таблице оружия, чтобы прочитать правило."],
        ["Телефон","Сохранённые списки помещаются на узкий экран, а обновление больше не выглядит как выход из аккаунта."],
        ["Аккаунты","Имя пользователя можно сменить в разделе «Безопасность аккаунта»."],
        ["Печать","Психические силы, молитвы и пакты печатаются один раз, в книге после последнего юнита (и внизу боевого режима). Способности от черт объяснены в особых правилах."],
        ["Таблицы","Новые цены, опции и предметы Арсенала из октябрьских таблиц; сила Perfect Timing и 44 текста черт и наследий идут следом."],
      ] },
      { label: "Space Marines", rows: [
        ["Новое","Архетип Legion of the Damned с собственным дополнением из 7 отрядов и Stormfang Gunship."],
        ["Наследие","Legacy of the Damned теперь называется Legacy of the Relic Hunters."],
        ["Purity above All","Оплачивается, только если отметить опцию Apothecary у отряда."],
      ] },
      { label: "Chaos Space Marines", rows: [
        ["Новое","Fellgors, Chaos Land Raider Sonic и Giant Chaos Spawn."],
        ["Poxwalkers","Mindless указан как правило."],
        ["Helbrute","Каждый Helbrute отряда может заменить своё оружие и взять свой combi-bolter или heavy flamer."],
      ] },
      { label: "Dark Eldar", rows: [
        ["Новое","Incubi Bloodstone, Murderous Assault и Onslaught, Grotesque Aberration и Mindphase gauntlet."],
      ] },
      { label: "Eldar", rows: [
        ["Новое","Hemlock Wraithfighter."],
        ["Aspect Focus","Делает Dark Reapers Элитой; воинам Аспектов можно менять оружие на Sun pistol и Sun rifle."],
      ] },
      { label: "Некроны", rows: [
        ["Тесла","У тесла-оружия Night Scythe и Doom Scythe больше нет AT(1)."],
        ["Скарабеи","Взрыв Scarab теперь печатается."],
      ] },
      { label: "T'au", rows: [
        ["Таблица 1.9","Больше Ран, Силы и Стойкости у костюмов, новые очки, изменены щитовые, ракетные и stealth-дроны, новые цены в Арсенале."],
        ["XV85 Enforcer","Получает дополнительное оружие (и систему поддержки) у Crisis Honor Guard и Crisis Battlesuits."],
        ["Kroot","Каждый Lone-Spear и Great Knarloc может взять свои опции."],
      ] },
      { label: "Adeptus Mechanicus", rows: [
        ["Dark Mechanicum","В матрице союзников считаются Chaos Space Marines."],
        ["Тексты правил","Monotask, Choir Master и улучшения Magos и Tech-Priest теперь показывают текст."],
      ] },
      { label: "Ассасины", rows: [
        ["Callidus, Vindicare","Оба получают Hunter; Callidus теряет Polymorphine."],
      ] },
      { label: "Имперская гвардия", rows: [
        ["Новое","Rogal Dorn Tank Commander (640 очков); в армии только один Leman Russ или Rogal Dorn Tank Commander."],
        ["Обновлено","Leman Russ Tank Commander стоит 294; Rogal Dorn стоит 527 и имеет Силу 7."],
        ["Взводы","Special и Heavy Weapon Squads во взводе теперь учитываются в минимуме очков Troops."],
        ["Tauros","Любой Tauros может стать Venator, замена станкового пулемёта у Venator работает. Combat Engineers больше не показывают замену лазгана. Vulture, Valkyrie, Vendetta и другие летательные аппараты показывают 2x ракеты Hellstrike и 3x Tactical bombs, когда в опции указано два или три."],
      ] },
      { label: "Grey Knights", rows: [
        ["Паладины","Paladin Squads сразу знают все общие силы и силы Grey Knights, выбирать нечего."],
      ] },
      { label: "Genestealer Cults", rows: [
        ["Atalan Jackals","Каждый Jackal и Wolfquad может взять свои опции."],
      ] },
      { label: "Leagues of Votann", rows: [
        ["Demiurg","Может быть только союзным отрядом для T’au."],
      ] },
      { label: "Escalation", rows: [
        ["War Dogs, Armigers","War Dogs для каждой армии Хаоса и Armigers для каждой имперской армии (без Chaos Daemons)."],
      ] },
    ],
    contrib: "👁️ Нашли ошибку? Форма отчёта об ошибках в приложении работает — отряд, формат боя, архетип и картинка.",
  },
  ja: {
    title: "v1.86: 10月のシート更新",
    intro: "今月はシートが大きく変わりました。アプリは新しい表記を読み取ります。",
    install: "",
    sections: [
      { label: "全般", rows: [
        ["キャンペーン","Planetary Assaultキャンペーンがアルファとして公開されました。サインインして、トップページのキャンペーンを押してください。ルールへのリンクが中にあります。"],
        ["ルール","武器表のアビリティにカーソルを合わせる（スマホではタップ）と、ルールを読めます。"],
        ["スマホ","保存リストが狭い画面に収まり、アップデートでサインアウトされたように見えなくなりました。"],
        ["アカウント","アカウントのセキュリティからユーザー名を変更できます。"],
        ["印刷","サイキックパワー、祈り、協定は最後のユニットの後の「本」に1回だけ印刷されます（戦闘ビューの下にもあります）。特性が与えるアビリティは特殊ルール欄で説明されます。"],
        ["シート","10月のシートの新しい価格、オプション、アーモリー品目。Perfect Timingのパワーと44の特性・レガシー文がそれに続きます。"],
      ] },
      { label: "スペースマリーン", rows: [
        ["新規","Legion of the Damnedアーキタイプ（7ユニットの専用サプリメント）とStormfang Gunship。"],
        ["レガシー","Legacy of the DamnedはLegacy of the Relic Huntersになりました。"],
        ["Purity above All","ユニットのApothecaryオプションにチェックしたときだけ支払います。"],
      ] },
      { label: "ケイオス・スペースマリーン", rows: [
        ["新規","Fellgors、Chaos Land Raider Sonic、Giant Chaos Spawn。"],
        ["Poxwalkers","Mindlessがルールとして載ります。"],
        ["Helbrute","分隊の各Helbruteが自分の武器を交換し、自分のcombi-bolterまたはheavy flamerを取れます。"],
      ] },
      { label: "ダークエルダー", rows: [
        ["新規","Incubi Bloodstone、Murderous AssaultとOnslaught、Grotesque Aberration、Mindphase gauntlet。"],
      ] },
      { label: "エルダー", rows: [
        ["新規","Hemlock Wraithfighter。"],
        ["Aspect Focus","Dark Reapersがエリート枠になります。アスペクトウォリアーはSun pistolとSun rifleに交換できます。"],
      ] },
      { label: "ネクロン", rows: [
        ["テスラ","Night ScytheとDoom Scytheのテスラ砲にAT(1)が表示されなくなりました。"],
        ["スカラブ","Scarabの爆発が印刷されるようになりました。"],
      ] },
      { label: "タウ", rows: [
        ["シート1.9","バトルスーツのWound・強さ・耐久が増加、ポイント変更、シールド／ミサイル／ステルスドローンの変更、アーモリーの価格改定。"],
        ["XV85 Enforcer","Crisis Honor GuardとCrisis Battlesuitsで追加武器（と追加サポートシステム）を使えます。"],
        ["Kroot","各Lone-SpearとGreat Knarlocが自分のオプションを取れます。"],
      ] },
      { label: "アデプトゥス・メカニカス", rows: [
        ["Dark Mechanicum","同盟マトリクスでChaos Space Marinesとして扱われます。"],
        ["ルール文","Monotask、Choir Master、MagosとTech-Priestのアップグレードがテキストを表示します。"],
      ] },
      { label: "アサシン", rows: [
        ["Callidus、Vindicare","両方がHunterを得て、CallidusはPolymorphineを失います。"],
      ] },
      { label: "インペリアル・ガード", rows: [
        ["新規","Rogal Dorn Tank Commander（640ポイント）。Leman RussまたはRogal Dorn Tank Commanderは軍に1体のみ。"],
        ["更新","Leman Russ Tank Commanderは294、Rogal Dornは527で強さ7。"],
        ["小隊","小隊に入れたSpecial・Heavy Weapon Squadがトループスの最低ポイントに数えられます。"],
        ["Tauros","任意のTaurosをVenatorにでき、Venatorのスタブ交換が動きます。Combat Engineersはラスガン交換を表示しません。 Vulture、Valkyrie、Vendetta、ほかのフライヤーは、オプションが2または3のとき、Hellstrikeミサイル2xとTactical bombs 3xを表示します。"],
      ] },
      { label: "グレイナイト", rows: [
        ["パラディン","Paladin Squadは最初から一般とグレイナイトの全パワーを知っているため、選ぶ必要はありません。"],
      ] },
      { label: "ジェネスティーラー・カルト", rows: [
        ["Atalan Jackals","各JackalとWolfquadが自分のオプションを取れます。"],
      ] },
      { label: "Leagues of Votann", rows: [
        ["Demiurg","タウの同盟部隊としてのみ使えます。"],
      ] },
      { label: "Escalation", rows: [
        ["War Dogs、Armigers","全ケイオス軍にWar Dogs、全帝国軍にArmiger（Chaos Daemons除く）。"],
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
  // The whole card folds to its title line (Rigzar, 2026-10-25: fourteen faction headers are a long block at the top of the
  // page, "debe poder recogerse todo"). The fold is remembered FOR THIS ANNOUNCEMENT only: it stores the key it was folded for, so
  // the next announcement opens unfolded. Remembering it across versions hid every later announcement behind the fold, and the
  // same day's new banner looked as if it had not been updated at all.
  const [folded, setFolded] = useState(() => { try { return localStorage.getItem('c40k_announcement_folded') === ANNOUNCEMENT_KEY; } catch { return false; } });
  const toggleFolded = () => setFolded(f => { const n = !f; try { n ? localStorage.setItem('c40k_announcement_folded', ANNOUNCEMENT_KEY) : localStorage.removeItem('c40k_announcement_folded'); } catch { /* private window */ } return n; });
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
            <span>{tx.title}</span>
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
        {!folded && <div className="text-[12px] text-zinc-300 leading-relaxed space-y-2">
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
