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

const ANNOUNCEMENT_KEY = 'c40k_announcement_v190j_dismissed';

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
    title: "{v}: the new Missions and no gaps in army size",
    intro: "Skirmish follows the new Missions, army sizes no longer have gaps, and a round of bugs reported on GitHub and Discord is fixed.",
    install: "",
    sections: [
      { label: "General", rows: [
        ["Army size", "No gaps between battle types: Skirmish 1000–1750, Pitched 1751–3500, Epic from 3501. Type any size or step by 50; a size from another band switches the battle type."],
        ["Skirmish", "Follows the new Missions: one unit may have Toughness 8 and one a combined armour value of 34 (the others may not), and \"once per army\" upgrades are barred for every unit, not only HQ."],
        ["Battle view", "Lists the deployment rule bought with Webway raid, Webway strike, Lightning strike or Tellyporta."],
        ["Sheets", "New sheet versions: hand flamers are Strength 3 and Pistol 2 and cheaper in the Armory; Genestealer Cults Magus and Patriarch cast and deny 1 power and the Armory has the Elder; Necron Scarabs carry the Disruptor field (Gauss); Knight Households, Imperial Navy, Inquisition and other Armory updates; Space Marines 1st Company needs 5 Honor Guard. The Black Crusade champion lists Psyker(1) with his Marks."],
      ] },
      { label: "Bugs (GitHub)", rows: [
        ["#288", "Skirmish: an upgrade that takes a unit to a 2+ save or Toughness 8 (Hardened Carapace) is flagged now."],
        ["#286", "Options that give an ability to weapons (Chosen Accursed Weaponry and 15 more) put it on the right weapons now."],
        ["Weapons", "An ability given by several sources is listed once, with the best value."],
      ] },
      { label: "Chaos Daemons", rows: [
        ["Chaos Daemons", "Flesh Hounds: only the Gore Hound carries the Burning roar. The Rune of brass no longer lists Perils of the Warp as an ability of the bearer, and neither do the Baleful tome or the Necron Empyric Overcharger (reported by Urza)."],
        ["Chaos Daemons", "Entourage frees the HQ slot again (one unit per Greater Daemon of the same god, as the sheet says) and Heralds can buy the Palanquin of Nurgle again (#282)."],
      ] },
      { label: "Chaos Space Marines", rows: [
        ["Chaos Space Marines", "Daemonic possession stops BS and WS at 4+, as the sheet says. Shamblerot has its own text again (it carried the Clavis one) and the Slaanesh pact Diabolic Majesty adds the Battleshock Token."],
        ["Chaos Space Marines", "Daemonkin shows an error when a unit does not have or buy the Daemon ability, and its unit-count message shows the real difference (#280, #285). Daemonic possession makes BS and WS worse, it improved them (#281). The Black Crusade champion also gets the Mark of Tzeentch's Psyker."],
        ["Chaos Space Marines", "Weapons that need Cataphractii armour (Manreaper, Twin plague spewer...) open once you buy it (#292). Daemonic venom gives Poison(4+) to the melee weapons (#287). A Horus Heresy unit with a Mark gets the army's Traits again."],
        ["Chaos Space Marines", "A Black Crusade champion can take the datasheet options marked (Nurgle only), (Khorne only)... as he has every Mark."],
        ["Chaos Space Marines", "Iron Warriors: the Siege Breaker no longer adds +5 Strength to the model by itself. The card lists it as a choice: some or all melee attacks at Initiative 1 with +5 Strength (#305, DemonGyro)."],
      ] },
      { label: "Space Marines", rows: [
        ["Space Marines", "Blood Claws are 5 to 15 models. Armory texts brought up to date: Crusader seals (Black Templars), Teleport homing beacon (Dark Angels) and Clavis (Death Watch)."],
        ["Space Marines", "The Death Watch Watch spear counts as a bolt weapon (its ranged profile is named Bolt Caster, as in the sheet)."],
      ] },
      { label: "Necrons", rows: [
        ["Necrons", "Vehicle-only traits (Interplanetary Invasors) no longer charge monsters, and trait costs read per unit / monster / vehicle / character. Fixed by DemonGyro. Necrons sheet 1.14: the Domination Staff works during each activation. The Yngir C'tan Shard is an HQ with +30 points and +6\" power range (also in the Print View and battle view), knows all its powers by itself, and only Yngir knows Time's Arrow. Fixed by DemonGyro. Warrior Nobles is now for HQ character infantry only, so monsters like the Ancient Destructor Lord no longer get it. Reported by DemonGyro."],
      ] },
      { label: "Knight Households", rows: [
        ["Knight Crusader", "The Knight Crusader is in: 579 points, 1 model, and the Freeblade archetype can take it."],
      ] },
      { label: "Tyranids", rows: [
        ["Tyranids", "Heightened Reflexes: the unit does not suffer the to hit penalty from Defensive Fire, as the sheet says."],
        ["Tyranids", "Winged moves the Tyranid Warrior Brood and the Ripper Swarms to Fast Attack (#278)."],
      ] },
      { label: "Imperial Guard", rows: [
        ["Imperial Guard", "The Command Squad's Heavy flamer shows 1x, not 4x (#284)."],
        ["Imperial Guard", "The Hive Gangers' Escher gives Poison(4+) to their weapons."],
      ] },
      { label: "Eldar", rows: [
        ["Eldar", "Striking Scorpions gain Hunter."],
        ["Eldar", "The Exarch's swapped weapon counts once (the Scorpion claw was shown x5) and his powers worded \"of the model\" no longer mark every weapon of the squad."],
      ] },
      { label: "Adeptus Mechanicus", rows: [
        ["Adeptus Mechanicus", "New archetype Xenarites: Allies of Convenience instead of Battle Brothers with the Imperial factions, and every model with Armory access may take one item from any Xenos faction. The Ordo Reductor Covenant left the sheet."],
      ] },
      { label: "Imperial Navy", rows: [
        ["Imperial Navy", "The Legendary Retinue needs a Rogue Trader in the army, and Heretic and Iconoclast can no longer include Adeptus Sororitas or Space Marines in it."],
      ] },
      { label: "Orks", rows: [
        ["Orks", "Wildork: melee hit rolls against vehicles and monstrous creatures gain Armorbane(1) and Decimate, as the sheet says."],
      ] },
      { label: "Genestealer Cults", rows: [
        ["Genestealer Cults", "The Pennant of Ascension is for the Acolyte Iconward only."],
      ] },
      { label: "T'au Empire", rows: [
        ["T'au Empire", "New unit: the Drone Swarm (Fast Attack, ten drone types, from 4 Gun Drones). The Academy Luminary gives 25% victory points."],
      ] },
      { label: "Inquisition", rows: [
        ["Inquisition", "A Heretic or Iconoclast Legendary Retinue can no longer include Adeptus Sororitas or Space Marines, and the Retinue needs an Inquisitor in the army. The Land Raider Prometheus' Multi-melta costs +11, as the sheet says."],
        ["Inquisition", "A Henchman Warband without Crusaders is no longer flagged 2+ in Skirmish, and the Inquisitor's Priest and Psyker upgrades are one choice."],
      ] },
    ],
    contrib: "\ud83d\udc41\ufe0f Found something wrong? The in-app bug report form works \u2014 unit, engagement, archetype and a picture.",
  },
  de: {
    title: "{v}: die neuen Missions und keine Lücken bei der Armeegröße",
    intro: "Skirmish folgt den neuen Missions, die Armeegrößen haben keine Lücken mehr, und eine Runde von Fehlern aus GitHub und Discord ist behoben.",
    install: "",
    sections: [
      { label: "Allgemein", rows: [
        ["Armeegröße", "Keine Lücken zwischen den Schlachttypen: Skirmish 1000–1750, Pitched 1751–3500, Epic ab 3501. Beliebige Größe eingeben oder in 50er-Schritten ändern; eine Größe aus einem anderen Bereich wechselt den Schlachttyp."],
        ["Skirmish", "Folgt den neuen Missions: eine Einheit darf Widerstand 8 und eine einen kombinierten Panzerungswert von 34 haben (alle anderen nicht), und „einmal pro Armee“-Upgrades sind für jede Einheit gesperrt, nicht nur für HQ."],
        ["Schlachtansicht", "Zeigt die Aufstellungsregel von Webway raid, Webway strike, Lightning strike oder Tellyporta."],
        ["Blätter", "Neue Blattversionen: Handflammenwerfer haben Stärke 3 und Pistol 2 und sind im Arsenal billiger; Magus und Patriarch der Genestealer Cults wirken und bannen 1 Kraft, das Arsenal hat den Elder; die Skarabäen der Necrons tragen das Disruptor field (Gauss); Updates für Knight Households, Imperial Navy, Inquisition und weitere Arsenale; Space Marines 1. Kompanie braucht 5 Honor Guard. Der Black-Crusade-Champion zeigt Psyker(1) bei seinen Malen."],
      ] },
      { label: "Fehler (GitHub)", rows: [
        ["#288", "Skirmish: ein Upgrade, das eine Einheit auf 2+-Rettungswurf oder Widerstand 8 bringt (Hardened Carapace), wird jetzt gemeldet."],
        ["#286", "Optionen, die Waffen eine Fähigkeit geben (Chosen Accursed Weaponry und 15 weitere), legen sie jetzt auf die richtigen Waffen."],
        ["Waffen", "Eine Fähigkeit aus mehreren Quellen wird einmal mit dem besten Wert aufgeführt."],
      ] },
      { label: "Chaos Daemons", rows: [
        ["Chaos Daemons", "Flesh Hounds: nur der Gore Hound trägt das Burning roar. Die Rune of brass führt Perils of the Warp nicht mehr als Fähigkeit des Trägers auf, ebenso wenig der Baleful tome und der Empyric Overcharger der Necrons (gemeldet von Urza)."],
        ["Chaos Daemons", "Entourage befreit den HQ-Slot wieder (eine Einheit pro Greater Daemon desselben Gottes, wie im Datenblatt) und Heralds können die Palanquin of Nurgle wieder kaufen (#282)."],
      ] },
      { label: "Chaos Space Marines", rows: [
        ["Chaos Space Marines", "Daemonic possession hält BS und WS bei 4+, wie im Blatt. Shamblerot hat wieder seinen eigenen Text (er trug den des Clavis) und der Slaanesh-Pakt Diabolic Majesty gibt den Battleshock-Marker."],
        ["Chaos Space Marines", "Daemonkin meldet einen Fehler, wenn eine Einheit die Fähigkeit Daemon weder hat noch kauft, und die Meldung zur Einheitenzahl zeigt den echten Unterschied (#280, #285). Daemonic possession verschlechtert BF und KG, statt sie zu verbessern (#281). Der Black-Crusade-Champion bekommt auch den Psyker des Mals des Tzeentch."],
        ["Chaos Space Marines", "Weapons that need Cataphractii armour (Manreaper, Twin plague spewer...) open once you buy it (#292). Daemonic venom gives Poison(4+) to the melee weapons (#287). A Horus Heresy unit with a Mark gets the army's Traits again."],
        ["Chaos Space Marines", "Ein Black-Crusade-Champion kann die Datenblatt-Optionen mit (Nurgle only), (Khorne only)... wählen, da er jedes Mal besitzt."],
        ["Chaos Space Marines", "Iron Warriors: Der Siege Breaker gibt dem Modell nicht mehr automatisch +5 Stärke. Die Karte zeigt ihn als Wahl: einige oder alle Nahkampfangriffe mit Initiative 1 und +5 Stärke (#305, DemonGyro)."],
      ] },
      { label: "Space Marines", rows: [
        ["Space Marines", "Blood Claws sind 5 bis 15 Modelle. Rüstkammertexte aktualisiert: Crusader seals (Black Templars), Teleport homing beacon (Dark Angels) und Clavis (Death Watch)."],
        ["Space Marines", "Der Watch spear der Death Watch zählt als Bolt-Waffe (sein Fernkampfprofil heißt Bolt Caster, wie im Blatt)."],
      ] },
      { label: "Necrons", rows: [
        ["Necrons", "Nur-für-Fahrzeuge-Eigenschaften (Interplanetary Invasors) berechnen für Monster nichts mehr, und die Kosten stehen pro Einheit / Monster / Fahrzeug / Charakter. Behoben von DemonGyro. Necrons-Blatt 1.14: Der Domination Staff wirkt bei jeder Aktivierung. Der C'tan Shard unter Yngir ist HQ mit +30 Punkten und +6\" Kraftreichweite (auch in Druck- und Schlachtansicht), kennt alle seine Kräfte von selbst, und nur Yngir kennt Time's Arrow. Behoben von DemonGyro. Warrior Nobles gilt jetzt nur für HQ-Charakter-Infanterie, Monster wie der Ancient Destructor Lord bekommen es nicht mehr. Gemeldet von DemonGyro."],
      ] },
      { label: "Knight Households", rows: [
        ["Knight Crusader", "Der Knight Crusader ist dabei: 579 Punkte, 1 Modell, und die Archetype Freeblade darf ihn nehmen."],
      ] },
      { label: "Tyranids", rows: [
        ["Tyranids", "Heightened Reflexes: Die Einheit erleidet den Trefferwurf-Malus der Defensive Fire nicht, wie im Blatt."],
        ["Tyranids", "Winged setzt die Tyranid Warrior Brood und die Ripper Swarms auf Fast Attack (#278)."],
      ] },
      { label: "Imperial Guard", rows: [
        ["Imperial Guard", "Der Heavy flamer des Command Squad zeigt 1x statt 4x (#284)."],
        ["Imperial Guard", "The Hive Gangers' Escher gives Poison(4+) to their weapons."],
      ] },
      { label: "Eldar", rows: [
        ["Eldar", "Striking Scorpions erhalten Hunter."],
        ["Eldar", "Die getauschte Waffe des Exarchen zählt einmal (die Scorpion claw wurde x5 angezeigt) und seine Kräfte mit „of the model“ markieren nicht mehr jede Waffe des Trupps."],
      ] },
      { label: "Adeptus Mechanicus", rows: [
        ["Adeptus Mechanicus", "Neuer Archetyp Xenarites: Allies of Convenience statt Battle Brothers mit den imperialen Fraktionen, und jedes Modell mit Rüstkammerzugriff darf einen Gegenstand aus einer beliebigen Xenos-Fraktion nehmen. Der Ordo Reductor Covenant ist aus dem Blatt verschwunden."],
      ] },
      { label: "Imperial Navy", rows: [
        ["Imperial Navy", "Die Legendary Retinue braucht einen Rogue Trader in der Armee, und Heretic und Iconoclast dürfen keine Adeptus Sororitas oder Space Marines mehr hineinnehmen."],
      ] },
      { label: "Orks", rows: [
        ["Orks", "Wildork: Nahkampf-Trefferwürfe gegen Fahrzeuge und Monstrous Creatures erhalten Armorbane(1) und Decimate, wie im Blatt."],
      ] },
      { label: "Genestealer Cults", rows: [
        ["Genestealer Cults", "Das Pennant of Ascension ist nur für den Acolyte Iconward."],
      ] },
      { label: "T'au Empire", rows: [
        ["T'au Empire", "Neue Einheit: der Drone Swarm (Fast Attack, zehn Drohnentypen, ab 4 Gun Drones). Der Academy Luminary gibt 25 % Siegpunkte."],
      ] },
      { label: "Inquisition", rows: [
        ["Inquisition", "Eine Legendary Retinue von Heretic oder Iconoclast darf keine Adeptus Sororitas oder Space Marines mehr enthalten, und die Retinue braucht einen Inquisitor in der Armee. Das Multi-melta des Land Raider Prometheus kostet +11, wie im Blatt."],
        ["Inquisition", "Ein Henchman Warband ohne Crusaders wird im Skirmish nicht mehr als 2+ gemeldet, und die Priester- und Psyker-Upgrades des Inquisitors sind eine Wahl."],
      ] },
    ],
    contrib: "\ud83d\udc41\ufe0f Etwas gefunden, das nicht stimmt? Das Fehlerformular in der App funktioniert \u2014 Einheit, Engagement, Archetyp und ein Bild.",
  },
  es: {
    title: "{v}: las nuevas Missions y sin huecos en el tamaño del ejército",
    intro: "Skirmish sigue las nuevas Missions, los tamaños de ejército ya no tienen huecos y se arregla una ronda de bugs de GitHub y Discord.",
    install: "",
    sections: [
      { label: "General", rows: [
        ["Tamaño del ejército", "Sin huecos entre tipos de batalla: Skirmish 1000–1750, Pitched 1751–3500, Epic desde 3501. Escribe cualquier tamaño o sube de 50 en 50; un tamaño de otra franja cambia el tipo de batalla."],
        ["Skirmish", "Sigue las nuevas Missions: una unidad puede tener Resistencia 8 y una un blindaje combinado de 34 (las demás no), y las mejoras “una vez por ejército” están prohibidas para toda unidad, no solo para HQ."],
        ["Vista de batalla", "Muestra la regla de despliegue comprada con Webway raid, Webway strike, Lightning strike o Tellyporta."],
        ["Hojas", "Nuevas versiones de las hojas: los lanzallamas de mano son Fuerza 3 y Pistol 2 y cuestan menos en la armería; el Magus y el Patriarca de Genestealer Cults lanzan y niegan 1 poder y la armería tiene el Elder; los Scarabs de Necrons llevan el Disruptor field (Gauss); actualizaciones de Knight Households, Imperial Navy, Inquisition y otras armerías; la 1.ª Compañía de Space Marines exige 5 Honor Guard. El campeón de Black Crusade muestra Psyker(1) con sus Marcas."],
      ] },
      { label: "Errores (GitHub)", rows: [
        ["#288", "Skirmish: una mejora que lleva a una unidad a salvación 2+ o Resistencia 8 (Hardened Carapace) se marca ahora."],
        ["#286", "Las opciones que dan una habilidad a las armas (Accursed Weaponry de los Chosen y 15 más) la ponen ahora en las armas correctas."],
        ["Armas", "Una habilidad dada por varias fuentes se muestra una vez, con el mejor valor."],
      ] },
      { label: "Chaos Daemons", rows: [
        ["Chaos Daemons", "Flesh Hounds: solo el Gore Hound lleva el Burning roar. La Rune of brass ya no muestra Perils of the Warp como habilidad de quien la lleva, ni el Baleful tome ni el Empyric Overcharger de los Necrons (avisó Urza)."],
        ["Chaos Daemons", "Entourage libera otra vez el slot de HQ (una unidad por Greater Daemon del mismo dios, como dice la hoja) y los Heralds pueden volver a comprar el Palanquin of Nurgle (#282)."],
      ] },
      { label: "Chaos Space Marines", rows: [
        ["Chaos Space Marines", "Daemonic possession deja BS y WS como máximo en 4+, como dice la hoja. Shamblerot vuelve a tener su texto (tenía el del Clavis) y el pacto de Slaanesh Diabolic Majesty añade el Battleshock Token."],
        ["Chaos Space Marines", "Daemonkin da error cuando una unidad no tiene ni compra la habilidad Daemon, y su mensaje de número de unidades muestra la diferencia real (#280, #285). Daemonic possession empeora BS y WS, antes los mejoraba (#281). El campeón de la Cruzada Negra también recibe el Psyker de la Marca de Tzeentch."],
        ["Chaos Space Marines", "Weapons that need Cataphractii armour (Manreaper, Twin plague spewer...) open once you buy it (#292). Daemonic venom gives Poison(4+) to the melee weapons (#287). A Horus Heresy unit with a Mark gets the army's Traits again."],
        ["Chaos Space Marines", "Un campeón de Black Crusade puede tomar las opciones de la hoja marcadas (Nurgle only), (Khorne only)... porque tiene todas las Marcas."],
        ["Chaos Space Marines", "Iron Warriors: el Siege Breaker ya no suma +5 de Fuerza al modelo por sí solo. La ficha lo muestra como una elección: algunos o todos los ataques cuerpo a cuerpo con Iniciativa 1 y +5 de Fuerza (#305, DemonGyro)."],
      ] },
      { label: "Space Marines", rows: [
        ["Space Marines", "Los Blood Claws son de 5 a 15 modelos. Textos de armería al día: Crusader seals (Black Templars), Teleport homing beacon (Dark Angels) y Clavis (Death Watch)."],
        ["Space Marines", "El Watch spear de la Death Watch cuenta como arma bolt (su perfil a distancia se llama Bolt Caster, como en la hoja)."],
      ] },
      { label: "Necrons", rows: [
        ["Necrons", "Los rasgos solo para vehículos (Interplanetary Invasors) ya no cobran a los monstruos, y el coste se lee por unidad / monstruo / vehículo / personaje. Arreglado por DemonGyro. Hoja de Necrons 1.14: el Domination Staff actúa en cada activación. El C'tan Shard de Yngir es HQ con +30 puntos y +6\" de alcance de poderes (también en la impresión y la vista de batalla), conoce todos sus poderes solo, y solo Yngir conoce Time's Arrow. Arreglado por DemonGyro. Warrior Nobles ahora es solo para infantería personaje HQ, así que monstruos como el Ancient Destructor Lord ya no lo reciben. Reportado por DemonGyro."],
      ] },
      { label: "Knight Households", rows: [
        ["Knight Crusader", "Añadido el Knight Crusader: 579 puntos, 1 modelo; el arquetipo Freeblade puede tomarlo."],
      ] },
      { label: "Tyranids", rows: [
        ["Tyranids", "Heightened Reflexes: la unidad no sufre el penalizador al impactar de Defensive Fire, como dice la hoja."],
        ["Tyranids", "Winged pasa el Tyranid Warrior Brood y los Ripper Swarms a Fast Attack (#278)."],
      ] },
      { label: "Imperial Guard", rows: [
        ["Imperial Guard", "El Heavy flamer del Command Squad sale 1x, no 4x (#284)."],
        ["Imperial Guard", "The Hive Gangers' Escher gives Poison(4+) to their weapons."],
      ] },
      { label: "Eldar", rows: [
        ["Eldar", "Los Striking Scorpions ganan Hunter."],
        ["Eldar", "El arma cambiada del Exarca cuenta una vez (la Scorpion claw salía x5) y sus poderes “of the model” ya no marcan todas las armas del escuadrón."],
      ] },
      { label: "Adeptus Mechanicus", rows: [
        ["Adeptus Mechanicus", "Nuevo arquetipo Xenarites: Allies of Convenience en vez de Battle Brothers con las facciones imperiales, y todo modelo con acceso a Armería puede elegir un objeto de cualquier facción Xenos. El Ordo Reductor Covenant salió de la hoja."],
      ] },
      { label: "Imperial Navy", rows: [
        ["Imperial Navy", "La Legendary Retinue necesita un Rogue Trader en el ejército, y Heretic e Iconoclast ya no pueden incluir Adeptus Sororitas ni Space Marines."],
      ] },
      { label: "Orks", rows: [
        ["Orks", "Wildork: las tiradas de impactar cuerpo a cuerpo contra vehículos y Monstrous Creatures ganan Armorbane(1) y Decimate, como dice la hoja."],
      ] },
      { label: "Genestealer Cults", rows: [
        ["Genestealer Cults", "El Pennant of Ascension es solo para el Acolyte Iconward."],
      ] },
      { label: "T'au Empire", rows: [
        ["T'au Empire", "Unidad nueva: el Drone Swarm (Fast Attack, diez tipos de dron, desde 4 Gun Drones). El Academy Luminary da un 25% de puntos de victoria."],
      ] },
      { label: "Inquisition", rows: [
        ["Inquisition", "Una Legendary Retinue de Heretic o Iconoclast ya no puede incluir Adeptus Sororitas ni Space Marines, y la Retinue necesita un Inquisitor en el ejército. El Multi-melta del Land Raider Prometheus cuesta +11, como dice la hoja."],
        ["Inquisition", "Un Henchman Warband sin Crusaders ya no sale como 2+ en Skirmish, y las mejoras de sacerdote y psíquico del Inquisitor son una sola elección."],
      ] },
    ],
    contrib: "\ud83d\udc41\ufe0f \u00bfEncontraste algo mal? El formulario de reporte de la app funciona \u2014 unidad, engagement, arquetipo y una foto.",
  },
  ru: {
    title: "{v}: новые Missions и размер армии без пропусков",
    intro: "Стычка следует новым Missions, размеры армии больше не имеют пропусков, исправлена серия ошибок из GitHub и Discord.",
    install: "",
    sections: [
      { label: "Общее", rows: [
        ["Размер армии", "Без пропусков между типами боя: Стычка 1000–1750, Pitched 1751–3500, Epic от 3501. Введите любой размер или меняйте шагом 50; размер из другого диапазона переключает тип боя."],
        ["Стычка", "Следует новым Missions: один отряд может иметь Стойкость 8 и один — суммарную броню 34 (остальные нет), а улучшения «раз за армию» запрещены любому отряду, не только Штабу."],
        ["Вид боя", "Показывает правило развёртывания, купленное через Webway raid, Webway strike, Lightning strike или Tellyporta."],
        ["Листы", "Новые версии листов: ручные огнемёты имеют Силу 3 и Pistol 2 и дешевле в арсенале; Magus и Patriarch Genestealer Cults накладывают и отрицают 1 силу, в арсенале появился Elder; Scarabs Necrons несут Disruptor field (Gauss); обновления Knight Households, Imperial Navy, Inquisition и других арсеналов; 1-я рота Space Marines требует 5 Honor Guard. Чемпион Black Crusade показывает Psyker(1) среди Меток."],
      ] },
      { label: "Ошибки (GitHub)", rows: [
        ["#288", "Стычка: улучшение, доводящее отряд до сейва 2+ или Стойкости 8 (Hardened Carapace), теперь отмечается."],
        ["#286", "Опции, дающие оружию способность (Accursed Weaponry у Chosen и ещё 15), теперь ставят её на нужное оружие."],
        ["Оружие", "Способность из нескольких источников показывается один раз, с лучшим значением."],
      ] },
      { label: "Chaos Daemons", rows: [
        ["Chaos Daemons", "Flesh Hounds: Burning roar есть только у Gore Hound. Rune of brass больше не показывает Perils of the Warp как способность владельца, так же как Baleful tome и Empyric Overcharger некронов (сообщил Urza)."],
        ["Chaos Daemons", "Entourage снова освобождает слот Штаба (один отряд на Greater Daemon того же бога, как в таблице), а Heralds снова могут купить Palanquin of Nurgle (#282)."],
      ] },
      { label: "Chaos Space Marines", rows: [
        ["Chaos Space Marines", "Daemonic possession останавливает BS и WS на 4+, как в листе. У Shamblerot снова свой текст (был текст Clavis), а пакт Слаанеш Diabolic Majesty добавляет жетон Battleshock."],
        ["Chaos Space Marines", "Daemonkin показывает ошибку, если у отряда нет и он не покупает способность Daemon, а сообщение о числе отрядов показывает реальную разницу (#280, #285). Daemonic possession ухудшает BS и WS, а не улучшал (#281). Чемпион Чёрного крестового похода получает и Psyker Метки Tzeentch."],
        ["Chaos Space Marines", "Weapons that need Cataphractii armour (Manreaper, Twin plague spewer...) open once you buy it (#292). Daemonic venom gives Poison(4+) to the melee weapons (#287). A Horus Heresy unit with a Mark gets the army's Traits again."],
        ["Chaos Space Marines", "Чемпион Black Crusade может брать опции датащита с пометкой (Nurgle only), (Khorne only)..., так как имеет все Метки."],
        ["Chaos Space Marines", "Iron Warriors: Siege Breaker больше не добавляет модели +5 к Силе сам по себе. На карточке это выбор: часть или все атаки в ближнем бою с Инициативой 1 и +5 к Силе (#305, DemonGyro)."],
      ] },
      { label: "Space Marines", rows: [
        ["Space Marines", "Blood Claws — от 5 до 15 моделей. Тексты арсенала обновлены: Crusader seals (Black Templars), Teleport homing beacon (Dark Angels) и Clavis (Death Watch)."],
        ["Space Marines", "Watch spear Death Watch считается болтерным оружием (его стрелковый профиль назван Bolt Caster, как в таблице)."],
      ] },
      { label: "Necrons", rows: [
        ["Necrons", "Черты только для машин (Interplanetary Invasors) больше не берут очки с монстров, а стоимость указана на отряд / монстра / машину / персонажа. Исправил DemonGyro. Лист Necrons 1.14: Domination Staff действует при каждой активации. C'tan Shard под Yngir — HQ с +30 очками и +6\" к дальности сил (также в печати и боевом виде), сам знает все свои силы, а Time's Arrow знает только Yngir. Исправил DemonGyro. Warrior Nobles теперь только для HQ-персонажей-пехоты, так что монстры вроде Ancient Destructor Lord его больше не получают. Сообщил DemonGyro."],
      ] },
      { label: "Knight Households", rows: [
        ["Knight Crusader", "Добавлен Knight Crusader: 579 очков, 1 модель; архетип Freeblade может его взять."],
      ] },
      { label: "Tyranids", rows: [
        ["Tyranids", "Heightened Reflexes: отряд не получает штраф к попаданию от Defensive Fire, как в листе."],
        ["Tyranids", "Winged переводит Tyranid Warrior Brood и Ripper Swarms в Fast Attack (#278)."],
      ] },
      { label: "Imperial Guard", rows: [
        ["Imperial Guard", "Heavy flamer у Command Squad показывается 1x, а не 4x (#284)."],
        ["Imperial Guard", "The Hive Gangers' Escher gives Poison(4+) to their weapons."],
      ] },
      { label: "Eldar", rows: [
        ["Eldar", "Striking Scorpions получают Hunter."],
        ["Eldar", "Заменённое оружие Эксарха считается один раз (Scorpion claw показывалась x5), а его силы «of the model» больше не отмечают всё оружие отряда."],
      ] },
      { label: "Adeptus Mechanicus", rows: [
        ["Adeptus Mechanicus", "Новый архетип Xenarites: Allies of Convenience вместо Battle Brothers с имперскими фракциями, и каждая модель с доступом к Арсеналу может взять один предмет любой фракции ксеносов. Ordo Reductor Covenant исчез из листа."],
      ] },
      { label: "Imperial Navy", rows: [
        ["Imperial Navy", "Legendary Retinue требует Rogue Trader в армии, а Heretic и Iconoclast больше не могут включать в неё Adeptus Sororitas и Space Marines."],
      ] },
      { label: "Orks", rows: [
        ["Orks", "Wildork: броски попадания в ближнем бою по машинам и Monstrous Creatures получают Armorbane(1) и Decimate, как в листе."],
      ] },
      { label: "Genestealer Cults", rows: [
        ["Genestealer Cults", "Pennant of Ascension — только для Acolyte Iconward."],
      ] },
      { label: "T'au Empire", rows: [
        ["T'au Empire", "Новый отряд: Drone Swarm (Fast Attack, десять типов дронов, от 4 Gun Drones). Academy Luminary даёт 25% очков победы."],
      ] },
      { label: "Inquisition", rows: [
        ["Inquisition", "Legendary Retinue у Heretic и Iconoclast больше не может включать Adeptus Sororitas и Space Marines, а Retinue требует Inquisitor в армии. Multi-melta у Land Raider Prometheus стоит +11, как в листе."],
        ["Inquisition", "Henchman Warband без Crusaders больше не помечается как 2+ в Стычке, а улучшения жреца и пси-силы Инквизитора — один выбор."],
      ] },
    ],
    contrib: "👁️ Нашли ошибку? Форма отчёта об ошибках в приложении работает — отряд, формат боя, архетип и картинка.",
  },
  ja: {
    title: "{v}：新しいMissionsと隙間のない軍のサイズ",
    intro: "スカーミッシュは新しいMissionsに従い、軍のサイズに隙間がなくなり、GitHubとDiscordで報告された不具合をまとめて修正しました。",
    install: "",
    sections: [
      { label: "全般", rows: [
        ["軍のサイズ", "戦闘タイプ間に隙間がありません：スカーミッシュ 1000–1750、ピッチド 1751–3500、エピック 3501以上。好きなサイズを入力するか50刻みで変更でき、別の範囲のサイズを入れると戦闘タイプが切り替わります。"],
        ["スカーミッシュ", "新しいMissionsに対応：耐久8は1ユニット、合計装甲値34も1ユニットのみ（他は不可）。「軍につき1回」のアップグレードはHQだけでなく全ユニットで禁止です。"],
        ["バトルビュー", "Webway raid、Webway strike、Lightning strike、Tellyportaで購入した展開ルールを表示します。"],
        ["シート", "新しいシート版：ハンドフレイマーは強さ3・Pistol 2になりアーモリーで安くなりました。Genestealer CultsのMagusとPatriarchは1つの能力を使用・否定でき、アーモリーにElderが追加。NecronのScarabsはDisruptor field（Gauss）を装備。Knight Households、Imperial Navy、Inquisitionなどのアーモリー更新。Space Marines第1中隊はHonor Guard 5体が必要。Black Crusadeのチャンピオンは印にPsyker(1)を表示します。"],
      ] },
      { label: "不具合 (GitHub)", rows: [
        ["#288", "スカーミッシュ：ユニットをセーブ2+や耐久8にするアップグレード（Hardened Carapace）が警告されるようになりました。"],
        ["#286", "武器に能力を与えるオプション（ChosenのAccursed Weaponryほか15件）が正しい武器に付くようになりました。"],
        ["武器", "複数の出典から与えられる能力は、最良の値で1回だけ表示されます。"],
      ] },
      { label: "Chaos Daemons", rows: [
        ["Chaos Daemons", "Flesh Hounds：Burning roarを持つのはGore Houndだけになりました。Rune of brass、Baleful tome、NecronのEmpyric Overchargerは、Perils of the Warpを所持者の能力として表示しなくなりました（Urza報告）。"],
        ["Chaos Daemons", "Entourageが再びHQ枠を空け（同じ神のGreater Daemonごとに1ユニット、シートどおり）、HeraldがPalanquin of Nurgleを再び購入できます（#282）。"],
      ] },
      { label: "Chaos Space Marines", rows: [
        ["Chaos Space Marines", "Daemonic possessionはシートどおりBSとWSを4+までで止めます。Shamblerotは自分の説明文に戻り（Clavisの文が入っていました）、スラーネッシュの誓約Diabolic MajestyはBattleshockトークンを与えます。"],
        ["Chaos Space Marines", "ユニットがDaemon能力を持たず購入もしない場合、Daemonkinがエラーを出し、ユニット数のメッセージは実際の差を表示します（#280、#285）。Daemonic possessionはBSとWSを悪化させます（以前は改善していました、#281）。ブラッククルセードのチャンピオンはティーンチの印のPsykerも得ます。"],
        ["Chaos Space Marines", "Weapons that need Cataphractii armour (Manreaper, Twin plague spewer...) open once you buy it (#292). Daemonic venom gives Poison(4+) to the melee weapons (#287). A Horus Heresy unit with a Mark gets the army's Traits again."],
        ["Chaos Space Marines", "Black Crusadeのチャンピオンは全ての印を持つため、(Nurgle only)、(Khorne only)などの選択肢を選べます。"],
        ["Chaos Space Marines", "Iron Warriors: Siege Breakerはモデルの強さを自動で+5しなくなりました。カードでは選択として表示されます：近接攻撃の一部または全部を主導値1で行い、強さ+5（#305、DemonGyro）。"],
      ] },
      { label: "Space Marines", rows: [
        ["Space Marines", "Blood Clawsは5〜15モデルになりました。武器庫の文を更新：Crusader seals（Black Templars）、Teleport homing beacon（Dark Angels）、Clavis（Death Watch）。"],
        ["Space Marines", "Death WatchのWatch spearはボルト武器として扱われます(射撃プロファイル名がシート通りBolt Casterになりました)。"],
      ] },
      { label: "Necrons", rows: [
        ["Necrons", "乗り物専用の特性(Interplanetary Invasors)はモンスターに課金されなくなり、コストはユニット/モンスター/車両/キャラクターごとに表示されます。修正：DemonGyro。Necronシート1.14：Domination Staffは各アクティベーションで使用できます。YngirのC'tan ShardはHQで+30点、パワーの射程+6\"(印刷ビューと戦闘ビューも)、全パワーを自動で習得し、Time's ArrowはYngirだけが使えます。修正：DemonGyro。 Warrior NoblesはHQのキャラクター歩兵専用になり、Ancient Destructor Lordのようなモンスターは使えなくなりました。報告：DemonGyro。"],
      ] },
      { label: "Knight Households", rows: [
        ["Knight Crusader", "Knight Crusader追加: 579ポイント、1モデル。Freebladeアーキタイプでも選べます。"],
      ] },
      { label: "Tyranids", rows: [
        ["Tyranids", "Heightened Reflexes：シートどおり、ユニットはDefensive Fireの命中ペナルティを受けません。"],
        ["Tyranids", "WingedでTyranid Warrior BroodとRipper SwarmsがFast Attackになります（#278）。"],
      ] },
      { label: "Imperial Guard", rows: [
        ["Imperial Guard", "Command SquadのHeavy flamerは4xではなく1xと表示されます（#284）。"],
        ["Imperial Guard", "The Hive Gangers' Escher gives Poison(4+) to their weapons."],
      ] },
      { label: "Eldar", rows: [
        ["Eldar", "Striking ScorpionsがHunterを得ます。"],
        ["Eldar", "エグザークが交換した武器は1回だけ数えられ（Scorpion clawはx5と表示されていました）、「of the model」の能力が分隊の全武器に付かなくなりました。"],
      ] },
      { label: "Adeptus Mechanicus", rows: [
        ["Adeptus Mechanicus", "新アーキタイプXenarites：帝国勢力とBattle BrothersではなくAllies of Convenienceになり、武器庫を使える各モデルはいずれかのゼノス勢力からアイテムを1つ選べます。Ordo Reductor Covenantはシートから消えました。"],
      ] },
      { label: "Imperial Navy", rows: [
        ["Imperial Navy", "Legendary Retinueには軍にRogue Traderが必要で、HereticとIconoclastはAdeptus SororitasとSpace Marinesを含められなくなりました。"],
      ] },
      { label: "Orks", rows: [
        ["Orks", "Wildork：シートどおり、車両とMonstrous Creaturesへの近接命中ロールがArmorbane(1)とDecimateを得ます。"],
      ] },
      { label: "Genestealer Cults", rows: [
        ["Genestealer Cults", "Pennant of AscensionはAcolyte Iconward専用です。"],
      ] },
      { label: "T'au Empire", rows: [
        ["T'au Empire", "新ユニット：Drone Swarm（Fast Attack、ドローン10種、Gun Drone 4体から）。Academy Luminaryは勝利点25%を与えます。"],
      ] },
      { label: "Inquisition", rows: [
        ["Inquisition", "HereticまたはIconoclastのLegendary RetinueにはAdeptus SororitasとSpace Marinesを含められなくなり、軍にInquisitorが必要です。Land Raider PrometheusのMulti-meltaはシートどおり+11です。"],
        ["Inquisition", "Crusadersのいないヘンチマンウォーバンドはスカーミッシュで2+と警告されなくなり、インクイジターの司祭とサイカーのアップグレードは1つの選択です。"],
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
