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

const ANNOUNCEMENT_KEY = 'c40k_announcement_v191b_dismissed';

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
    title: "{v}: item and option stats fixed, Core Rules 1.49, free Veteran abilities",
    intro: "Every item and option that changes a stat was bought and checked against its text: a dozen bonuses were missing and a dozen temporary ones showed as permanent. Also Core Rules 1.49, a picker for the free Veteran abilities and a round of GitHub bugs.",
    install: "",
    sections: [
      { label: "General", rows: [
        ["Items", "A bonus next to a sentence about enemies or an attached unit used to be lost: Shard of the Monolith, Lord of Death, Banner of the Eagle, Crusade of Wrath, Chalice of Blood, the banners, Enhanced data-tether and more show it now. Once-per-game and conditional bonuses no longer show as permanent (Moment Shackle, Shield Bearer, Bone Shard, Starmist Raiment, Gyrotemporal vault...)."],
        ["Options", "15 upgrades now give the stat they cost points for: Chaos Spawn (Grasping Pseudopods, Subcutaneous Armor), Hive Gangers, Hybrid Metamorphs, Bulwark strain, Knarloc armor, the Custodian Guard and Plague Marine banners."],
        ["Vehicles", "Movement upgrades show on vehicles now (Refined power cores, Red paint, Stompamatic Pistons), and the Print View follows the same rule as the card."],
        ["Free Veteran abilities", "Battle Tactics (Custodes Shield-Captain), Veterans of the Long War, Combat tactics...: choose the free Veteran abilities on the character's card; they show in the card, the print and the battle view (suggested by Dave). The friendly unit that gets them is not tracked."],
        ["Core Rules 1.49", "The model and weapon ability texts are read from the rulebook now, and a dated changelog records every change. Updated: Bomb, Stealth, Swarm, Vanguard, Ammo, Graviton and more. Tyranid Synapse follows sheet 1.15."],
        ["Sheets", "Dark Eldar 1.8: the Agonizer costs 4 / 5 points."],
      ] },
      { label: "Bugs (GitHub)", rows: [
        ["#309", "Favoured units: the squad leader needs Armory access, so take the Aspiring Champion, Traitor Sergeant or Mutant Boss first (Chosen have no single leader). The leader's Mark and +1 Attack show in the options, the Print View and the battle view."],
        ["#308", "Locked Tzeentch Marks give Warded now (Rubric Marines, Changecaster, Pink Horrors...)."],
        ["#307", "The Dark Eldar Flickerfield gives its 5+ ward save."],
        ["#306", "Dark Eldar units with a fixed Kabal, Coven or Cult no longer offer the sub-faction picker; \"Swords for hire\" units get the sub-faction they pick as a keyword."],
        ["#305", "The Iron Warriors Siege Breaker no longer adds +5 Strength by itself; the card lists it as a choice."],
      ] },
      { label: "Inquisition", rows: [
        ["Arbites", "Swapping the combat shotgun for the shield and shock maul now lets you choose how many models swap, not only one (barney)."],
      ] },
      { label: "Chaos Daemons", rows: [
        ["Entourage", "Under a Chaos Space Marines archetype that reaches the Daemons (All is Dust, Daemonkin...), a Herald takes no HQ slot next to its Greater Daemon now: a Lord of Change and a Changecaster were counted as 2 HQ (Sophtym)."],
        ["Changecaster", "Interdimensional Knowledge lets a Changecaster pick its two extra powers from the general disciplines (Sophtym)."],
      ] },
      { label: "Adeptus Mechanicus", rows: [
        ["Magos and Tech-Priest", "The card and the print show only the focus that was bought (Datasmith, Enginseer...), not all six. The line \"Can select one Doctrina Imperative\" has a Veteran button that opens the picker (DemonGyro)."],
      ] },
      { label: "Bugs (Discord)", rows: [
        ["Allied detachments", "A unit whose rule says it takes no slot (a Hexmark Destroyer with a Lord, Royal Court, Commissar...) now takes none inside an allied detachment too, counted within that detachment (Sophtym). Skirmish still gives none."],
        ["Allied slots", "A full slot in an allied detachment no longer blocks adding units: the count turns red and the validator flags a real overflow (the Royal Court could not be added after the Lord)."],
        ["Allies", "Assassins are no longer offered as an allied detachment (DemonGyro)."],
      ] },
    ],
    contrib: "\ud83d\udc41\ufe0f Found something wrong? The in-app bug report form works \u2014 unit, engagement, archetype and a picture.",
  },
  de: {
    title: "{v}: Werte von Gegenständen und Optionen korrigiert, Core Rules 1.49, kostenlose Veteranenfähigkeiten",
    intro: "Jeder Gegenstand und jede Option, die einen Wert ändert, wurde gekauft und mit ihrem Text verglichen: ein Dutzend Boni fehlte, ein Dutzend zeitlich begrenzte galt als dauerhaft. Dazu Core Rules 1.49, eine Auswahl für kostenlose Veteranenfähigkeiten und eine Runde GitHub-Fehler.",
    install: "",
    sections: [
      { label: "Allgemein", rows: [
        ["Gegenstände", "Ein Bonus neben einem Satz über Feinde oder eine angeschlossene Einheit ging verloren: Shard of the Monolith, Lord of Death, Banner of the Eagle, Crusade of Wrath, Chalice of Blood, die Banner, Enhanced data-tether und mehr zeigen ihn jetzt. Einmal-pro-Spiel- und bedingte Boni erscheinen nicht mehr als dauerhaft (Moment Shackle, Shield Bearer, Bone Shard, Starmist Raiment, Gyrotemporal vault...)."],
        ["Optionen", "15 Aufwertungen geben jetzt den Wert, für den sie Punkte kosten: Chaos Spawn (Grasping Pseudopods, Subcutaneous Armor), Hive Gangers, Hybrid Metamorphs, Bulwark strain, Knarloc armor, die Banner der Custodian Guard und der Plague Marines."],
        ["Fahrzeuge", "Bewegungs-Aufwertungen erscheinen jetzt bei Fahrzeugen (Refined power cores, Red paint, Stompamatic Pistons), und die Druckansicht folgt derselben Regel wie die Karte."],
        ["Kostenlose Veteranenfähigkeiten", "Battle Tactics (Custodes Shield-Captain), Veterans of the Long War, Combat tactics...: Wähle die kostenlosen Veteranenfähigkeiten auf der Karte des Charakters; sie erscheinen auf der Karte, im Druck und in der Schlachtansicht (Vorschlag von Dave). Die verbündete Einheit, die sie bekommt, wird nicht verfolgt."],
        ["Core Rules 1.49", "Die Texte der Modell- und Waffenfähigkeiten werden jetzt aus dem Regelwerk gelesen, und ein datiertes Änderungsprotokoll hält jede Änderung fest. Aktualisiert: Bomb, Stealth, Swarm, Vanguard, Ammo, Graviton und mehr. Die Synapse der Tyraniden folgt Tabelle 1.15."],
        ["Tabellen", "Dark Eldar 1.8: Der Agonizer kostet 4 / 5 Punkte."],
      ] },
      { label: "Fehler (GitHub)", rows: [
        ["#309", "Favored units: Der Trupp-Anführer braucht Zugang zur Armory, also zuerst den Aspiring Champion, Traitor Sergeant oder Mutant Boss nehmen (Chosen haben keinen einzelnen Anführer). Marke und +1 Angriff des Anführers erscheinen in den Optionen, der Druckansicht und der Schlachtansicht."],
        ["#308", "Feste Tzeentch-Marken geben jetzt Warded (Rubric Marines, Changecaster, Pink Horrors...)."],
        ["#307", "Das Flickerfield der Dark Eldar gibt seinen 5+-Ward-Save."],
        ["#306", "Dark-Eldar-Einheiten mit festem Kabal, Coven oder Cult bieten die Unterfraktionsauswahl nicht mehr an; \"Swords for hire\"-Einheiten erhalten die gewählte Unterfraktion als Schlüsselwort."],
        ["#305", "Der Siege Breaker der Iron Warriors gibt nicht mehr von selbst +5 Stärke; die Karte listet ihn als Wahl."],
      ] },
      { label: "Inquisition", rows: [
        ["Arbites", "Beim Tausch der Kampfschrotflinte gegen Schild und Schockhammer wählst du jetzt, wie viele Modelle tauschen, nicht nur eines (barney)."],
      ] },
      { label: "Chaos Daemons", rows: [
        ["Entourage", "Unter einem Chaos-Space-Marines-Archetyp, der die Daemons erreicht (All is Dust, Daemonkin...), belegt ein Herald neben seinem Greater Daemon jetzt keinen HQ-Slot: ein Lord of Change und ein Changecaster wurden als 2 HQ gezählt (Sophtym)."],
        ["Changecaster", "Interdimensional Knowledge lässt einen Changecaster seine zwei zusätzlichen Kräfte aus den allgemeinen Disziplinen wählen (Sophtym)."],
      ] },
      { label: "Adeptus Mechanicus", rows: [
        ["Magos und Tech-Priest", "Die Karte und der Druck zeigen nur den gekauften Fokus (Datasmith, Enginseer...), nicht alle sechs. Die Zeile \"Can select one Doctrina Imperative\" hat einen Veteranen-Knopf, der die Auswahl öffnet (DemonGyro)."],
      ] },
      { label: "Fehler (Discord)", rows: [
        ["Verbündete Abteilungen", "Eine Einheit, deren Regel sagt, dass sie keinen Slot belegt (Hexmark Destroyer mit einem Lord, Royal Court, Commissar...), belegt auch in einer verbündeten Abteilung keinen mehr, gezählt innerhalb dieser Abteilung (Sophtym). Skirmish gibt weiterhin keine."],
        ["Verbündete Slots", "Ein voller Slot in einer verbündeten Abteilung sperrt das Hinzufügen nicht mehr: die Zahl wird rot, und die Prüfung meldet einen echten Überschuss (der Royal Court ließ sich nach dem Lord nicht hinzufügen)."],
        ["Verbündete", "Assassins werden nicht mehr als verbündete Abteilung angeboten (DemonGyro)."],
      ] },
    ],
    contrib: "\ud83d\udc41\ufe0f Etwas gefunden, das nicht stimmt? Das Fehlerformular in der App funktioniert \u2014 Einheit, Engagement, Archetyp und ein Bild.",
  },
  es: {
    title: "{v}: stats de objetos y opciones corregidos, Core Rules 1.49, habilidades de veterano gratis",
    intro: "Cada objeto y opción que cambia una característica se compró y se comprobó contra su texto: faltaban una docena de bonus y otra docena de temporales se veían como permanentes. También Core Rules 1.49, un selector de habilidades de veterano gratis y una tanda de bugs de GitHub.",
    install: "",
    sections: [
      { label: "General", rows: [
        ["Objetos", "Un bonus junto a una frase sobre enemigos o una unidad unida se perdía: Shard of the Monolith, Lord of Death, Banner of the Eagle, Crusade of Wrath, Chalice of Blood, los estandartes, Enhanced data-tether y más lo muestran ya. Los bonus de una vez por partida o condicionales ya no salen como permanentes (Moment Shackle, Shield Bearer, Bone Shard, Starmist Raiment, Gyrotemporal vault...)."],
        ["Opciones", "15 mejoras dan ahora la característica por la que cuestan puntos: Chaos Spawn (Grasping Pseudopods, Subcutaneous Armor), Hive Gangers, Hybrid Metamorphs, Bulwark strain, Knarloc armor, los estandartes de Custodian Guard y Plague Marines."],
        ["Vehículos", "Las mejoras de Movimiento se ven ya en los vehículos (Refined power cores, Red paint, Stompamatic Pistons), y la vista de impresión sigue la misma regla que la ficha."],
        ["Habilidades de veterano gratis", "Battle Tactics (Shield-Captain de los Custodes), Veterans of the Long War, Combat tactics...: elige las habilidades de veterano gratis en la ficha del personaje; salen en la ficha, la impresión y la vista de batalla (sugerido por Dave). La unidad aliada que las recibe no se registra."],
        ["Core Rules 1.49", "Los textos de habilidades de modelo y de arma se leen ahora del reglamento, y un registro con fecha anota cada cambio. Actualizadas: Bomb, Stealth, Swarm, Vanguard, Ammo, Graviton y más. La Synapse de Tyranids sigue la hoja 1.15."],
        ["Hojas", "Dark Eldar 1.8: el Agonizer cuesta 4 / 5 puntos."],
      ] },
      { label: "Bugs (GitHub)", rows: [
        ["#309", "Unidades Favoured: el líder de escuadra necesita acceso a la armería, así que toma antes el Aspiring Champion, el Traitor Sergeant o el Mutant Boss (los Chosen no tienen un líder único). La Marca y el +1 Ataque del líder salen en las opciones, la impresión y la vista de batalla."],
        ["#308", "Las Marcas de Tzeentch fijas dan ahora Warded (Rubric Marines, Changecaster, Pink Horrors...)."],
        ["#307", "El Flickerfield de Dark Eldar da su salvación de ward 5+."],
        ["#306", "Las unidades Dark Eldar con Kabal, Coven o Cult fijos ya no ofrecen el selector de subfacción; las de \"Swords for hire\" reciben la subfacción elegida como palabra clave."],
        ["#305", "El Siege Breaker de los Iron Warriors ya no suma +5 de Fuerza por sí solo; la ficha lo muestra como una elección."],
      ] },
      { label: "Inquisition", rows: [
        ["Arbites", "Al cambiar la escopeta de combate por el escudo y la maza de choque ya eliges cuántos modelos cambian, no solo uno (barney)."],
      ] },
      { label: "Chaos Daemons", rows: [
        ["Entourage", "Con un arquetipo de Chaos Space Marines que alcanza a los Daemons (All is Dust, Daemonkin...), un Herald ya no ocupa slot de HQ junto a su Greater Daemon: un Lord of Change y un Changecaster se contaban como 2 HQ (Sophtym)."],
        ["Changecaster", "Interdimensional Knowledge permite al Changecaster elegir sus dos poderes extra de las disciplinas generales (Sophtym)."],
      ] },
      { label: "Adeptus Mechanicus", rows: [
        ["Magos y Tech-Priest", "La ficha y la impresión muestran solo el foco comprado (Datasmith, Enginseer...), no los seis. La línea \"Can select one Doctrina Imperative\" tiene un botón Veterano que abre el selector (DemonGyro)."],
      ] },
      { label: "Bugs (Discord)", rows: [
        ["Destacamentos aliados", "Una unidad cuya regla dice que no ocupa slot (un Hexmark Destroyer con un Lord, Royal Court, Commissar...) tampoco lo ocupa ya dentro de un destacamento aliado, contando dentro de ese destacamento (Sophtym). Skirmish sigue sin dar ninguno."],
        ["Slots aliados", "Un slot lleno en un destacamento aliado ya no impide añadir unidades: el contador se pone rojo y el validador avisa de un desbordamiento real (el Royal Court no se podía añadir tras el Lord)."],
        ["Aliados", "Los Assassins ya no se ofrecen como destacamento aliado (DemonGyro)."],
      ] },
    ],
    contrib: "\ud83d\udc41\ufe0f \u00bfEncontraste algo mal? El formulario de reporte de la app funciona \u2014 unidad, engagement, arquetipo y una foto.",
  },
  ru: {
    title: "{v}: исправлены характеристики предметов и опций, Core Rules 1.49, бесплатные способности ветерана",
    intro: "Каждый предмет и опция, меняющие характеристику, были куплены и сверены с текстом: десяток бонусов отсутствовал, а десяток временных показывался как постоянный. Также Core Rules 1.49, выбор бесплатных способностей ветерана и серия ошибок с GitHub.",
    install: "",
    sections: [
      { label: "Общее", rows: [
        ["Предметы", "Бонус рядом с предложением о врагах или присоединённом отряде терялся: Shard of the Monolith, Lord of Death, Banner of the Eagle, Crusade of Wrath, Chalice of Blood, знамёна, Enhanced data-tether и другие теперь его показывают. Бонусы «раз за игру» и условные больше не выглядят постоянными (Moment Shackle, Shield Bearer, Bone Shard, Starmist Raiment, Gyrotemporal vault...)."],
        ["Опции", "15 улучшений теперь дают характеристику, за которую берутся очки: Chaos Spawn (Grasping Pseudopods, Subcutaneous Armor), Hive Gangers, Hybrid Metamorphs, Bulwark strain, Knarloc armor, знамёна Custodian Guard и Plague Marines."],
        ["Техника", "Улучшения Движения теперь видны у техники (Refined power cores, Red paint, Stompamatic Pistons), а печатная версия следует тому же правилу, что и карточка."],
        ["Бесплатные способности ветерана", "Battle Tactics (Shield-Captain Кустодов), Veterans of the Long War, Combat tactics...: выбирайте бесплатные способности ветерана на карточке персонажа; они видны на карточке, в печати и в боевом режиме (предложил Dave). Дружественный отряд, который их получает, не отслеживается."],
        ["Core Rules 1.49", "Тексты способностей моделей и оружия теперь читаются из свода правил, а датированный журнал записывает каждое изменение. Обновлены: Bomb, Stealth, Swarm, Vanguard, Ammo, Graviton и другие. Synapse тиранидов следует таблице 1.15."],
        ["Таблицы", "Dark Eldar 1.8: Agonizer стоит 4 / 5 очков."],
      ] },
      { label: "Ошибки (GitHub)", rows: [
        ["#309", "Favoured-отряды: лидеру отряда нужен доступ к Арсеналу, поэтому сначала возьмите Aspiring Champion, Traitor Sergeant или Mutant Boss (у Chosen нет единственного лидера). Метка и +1 к Атакам лидера видны в опциях, в печати и в боевом режиме."],
        ["#308", "Фиксированные метки Tzeentch теперь дают Warded (Rubric Marines, Changecaster, Pink Horrors...)."],
        ["#307", "Flickerfield Dark Eldar даёт защиту 5+ ward."],
        ["#306", "Отряды Dark Eldar с фиксированным Kabal, Coven или Cult больше не предлагают выбор подфракции; отряды «Swords for hire» получают выбранную подфракцию как ключевое слово."],
        ["#305", "Siege Breaker Iron Warriors больше не добавляет +5 к Силе сам по себе; карточка показывает его как выбор."],
      ] },
      { label: "Inquisition", rows: [
        ["Arbites", "При замене боевого дробовика на щит и шоковую дубинку теперь можно выбрать, сколько моделей меняют оружие, а не только одну (barney)."],
      ] },
      { label: "Chaos Daemons", rows: [
        ["Entourage", "При архетипе Chaos Space Marines, открывающем доступ к Daemons (All is Dust, Daemonkin...), Herald теперь не занимает слот HQ рядом со своим Greater Daemon: Lord of Change и Changecaster считались за 2 HQ (Sophtym)."],
        ["Changecaster", "Interdimensional Knowledge позволяет Changecaster выбрать две дополнительные силы из общих дисциплин (Sophtym)."],
      ] },
      { label: "Adeptus Mechanicus", rows: [
        ["Magos и Tech-Priest", "Карточка и печать показывают только купленный фокус (Datasmith, Enginseer...), а не все шесть. У строки \"Can select one Doctrina Imperative\" есть кнопка «Ветеран», открывающая выбор (DemonGyro)."],
      ] },
      { label: "Ошибки (Discord)", rows: [
        ["Союзные контингенты", "Отряд, чьё правило гласит, что он не занимает слот (Hexmark Destroyer при Lord, Royal Court, Commissar...), теперь не занимает его и в союзном контингенте; считается внутри этого контингента (Sophtym). В Skirmish такого по-прежнему нет."],
        ["Союзные слоты", "Заполненный слот в союзном контингенте больше не мешает добавлять отряды: счётчик краснеет, а проверка отмечает реальное превышение (Royal Court нельзя было добавить после Lord)."],
        ["Союзники", "Assassins больше не предлагаются как союзный контингент (DemonGyro)."],
      ] },
    ],
    contrib: "👁️ Нашли ошибку? Форма отчёта об ошибках в приложении работает — отряд, формат боя, архетип и картинка.",
  },
  ja: {
    title: "{v}：アイテムとオプションの能力値を修正、Core Rules 1.49、無料のベテラン能力",
    intro: "能力値を変えるすべてのアイテムとオプションを実際に購入して文面と照合しました。十数件のボーナスが抜けており、同じくらいの一時的なボーナスが恒久的に表示されていました。Core Rules 1.49、無料のベテラン能力の選択欄、GitHubの不具合修正もあります。",
    install: "",
    sections: [
      { label: "全般", rows: [
        ["アイテム", "敵や随伴ユニットに関する文の隣にあるボーナスが失われていました。Shard of the Monolith、Lord of Death、Banner of the Eagle、Crusade of Wrath、Chalice of Blood、各種バナー、Enhanced data-tetherなどで表示されます。1ゲームに1回や条件付きのボーナスは恒久的には表示されません（Moment Shackle、Shield Bearer、Bone Shard、Starmist Raiment、Gyrotemporal vaultなど）。"],
        ["オプション", "15件のアップグレードが、ポイントを払った能力値を実際に与えます。Chaos Spawn（Grasping Pseudopods、Subcutaneous Armor）、Hive Gangers、Hybrid Metamorphs、Bulwark strain、Knarloc armor、Custodian GuardとPlague Marinesのバナー。"],
        ["車両", "移動力のアップグレードが車両にも表示されます（Refined power cores、Red paint、Stompamatic Pistons）。印刷表示もカードと同じ規則になりました。"],
        ["無料のベテラン能力", "Battle Tactics（カストーデスのShield-Captain）、Veterans of the Long War、Combat tacticsなど：キャラクターのカードで無料のベテラン能力を選べます。カード、印刷、戦闘表示に出ます（Daveの提案）。それを受ける味方ユニットは記録されません。"],
        ["Core Rules 1.49", "モデル能力と武器能力の文面をルールブックから読み込み、変更のたびに日付付きの記録を残します。更新：Bomb、Stealth、Swarm、Vanguard、Ammo、Graviton など。タイラニッドのSynapseはシート1.15に従います。"],
        ["シート", "Dark Eldar 1.8：Agonizerは4 / 5ポイント。"],
      ] },
      { label: "不具合（GitHub）", rows: [
        ["#309", "Favoredユニット：分隊長はアーモリーへのアクセスが必要です。先にAspiring Champion、Traitor Sergeant、Mutant Bossを選んでください（Chosenには単独の分隊長がいません）。分隊長のマークと+1攻撃が、オプション、印刷、戦闘表示に出ます。"],
        ["#308", "固定のTzeentchマークがWardedを与えるようになりました（Rubric Marines、Changecaster、Pink Horrorsなど）。"],
        ["#307", "Dark EldarのFlickerfieldが5+のウォードセーブを与えます。"],
        ["#306", "KabalやCoven、Cultが固定のDark Eldarユニットは、サブ派閥の選択欄を出さなくなりました。「Swords for hire」ユニットは選んだサブ派閥をキーワードとして得ます。"],
        ["#305", "Iron WarriorsのSiege Breakerは自動で強さ+5を与えなくなり、カードでは選択として表示されます。"],
      ] },
      { label: "Inquisition", rows: [
        ["Arbites", "戦闘用ショットガンをシールドとショックメイスに交換するとき、1体だけでなく何体交換するか選べるようになりました (barney)。"],
      ] },
      { label: "Chaos Daemons", rows: [
        ["Entourage", "Daemonsを使えるChaos Space Marinesのアーキタイプ（All is Dust、Daemonkinなど）で、HeraldがGreater Daemonの隣でHQスロットを使わなくなりました。Lord of ChangeとChangecasterが2 HQと数えられていました (Sophtym)。"],
        ["Changecaster", "Interdimensional Knowledgeで、Changecasterが一般ディシプリンから追加の2つの能力を選べるようになりました (Sophtym)。"],
      ] },
      { label: "Adeptus Mechanicus", rows: [
        ["MagosとTech-Priest", "カードと印刷には、購入したフォーカス（Datasmith、Enginseerなど）だけが表示され、6つ全部は出なくなりました。「Can select one Doctrina Imperative」の行に、選択画面を開くベテランボタンが付きました (DemonGyro)。"],
      ] },
      { label: "不具合（Discord）", rows: [
        ["同盟分遣隊", "「スロットを使わない」というルールを持つユニット（Lordと一緒のHexmark Destroyer、Royal Court、Commissarなど）は、同盟分遣隊の中でもスロットを使わなくなりました。その分遣隊の中で数えます (Sophtym)。Skirmishでは引き続き適用されません。"],
        ["同盟スロット", "同盟分遣隊のスロットがいっぱいでも、ユニットを追加できるようになりました。数が赤くなり、本当の超過は検証が知らせます（Lordの後にRoyal Courtを追加できませんでした）。"],
        ["同盟", "Assassinsは同盟分遣隊として選べなくなりました (DemonGyro)。"],
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
