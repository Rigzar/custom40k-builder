import { useState, useEffect } from 'react';
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

const ANNOUNCEMENT_KEY = 'c40k_announcement_v173f_dismissed';

// v1.72 (2026-09-12) is a REAL version cut (Rigzar: "este update seria nueva version"), so per
// [[feedback_version_cut_banner_scope]] this banner is RESET to ONLY v1.72's own content --
// v1.71's two lines (the GH#119 wargear sweep and the quoted damage results) shipped on
// 2026-09-11 and were already announced; they live on in the changelog modal.
//   line1 = Core Rules 1.261, led by the Skirmish one-Trait cap because it invalidates saved lists
//   line2 = all 22 codices are in; the two consolidations and the points moves players must check
//   line3 = the five wargear items found while closing the update, which granted nothing
//   line4 = the ability clean-up IS in as of 2026-09-13, with the new names spelled out.
//           Horus Heresy closed it out the same day — its sheet became readable again, so the
//           last three weapons without a Suppression value have one and NOTHING is outstanding.
//           The intro no longer says a part is missing; that is why the key was bumped to v172c.
//   line5 = the eight Extra Attack / Limit corrections found from one player report. It is
//           here rather than in the changelog alone because it changes weapons people are
//           already fielding, so they have to re-check a card — hence the bump to v172d.
//   line6 = light mode. In the banner because it is for everyone rather than for whoever
//           happens to open Preferences, which is why the key goes to v172e.
//
// 2026-09-13: line3 and line5 REWRITTEN and the key bumped to v172f. atypicalhero on the
// old line3: "I have literally no idea what this is supposed to mean". Both described what
// was repaired in the data rather than what a player sees when they open their list, which
// is the only thing a patch note is for. Lead with what happened to YOUR card.
//
//   line7 = Events & Leagues is open to everyone (key -> v172g)
//   line8 = Tyranid Advanced Biomorphs are paid per model, which moves list totals
//   line9 = the three fixes those changes needed the next day (key -> v172h)
// Append follow-ups here while v1.72 stays open. Bump ANNOUNCEMENT_KEY whenever these lines
// change materially, or readers who dismissed the previous card never see the new one.
type AnnouncementLang = { title: string; intro: string; install: string; line1: string; line2: string; line3: string; line4: string; line5: string; line6: string; line7: string; line8: string; line9: string; line10: string; line11: string; contrib: string; };
const ANNOUNCEMENT_TEXT: Record<Language, AnnouncementLang> = {
  en: {
    title: "v1.73: a full check of the app against the codices — first results",
    intro: "Every weapon, every psychic power, every stat and point cost, every Archetype, Legacy, Trait and Armoury has now been read against its own codex page. These are the first results. The check is still running.",
    install: "",
    line1: "🐛 TYRANID BIOMORPH PRICES ARE SETTLED, and this is the last change to them. Basic Biomorphs cost a flat price for the unit. Advanced and Special Biomorphs are paid PER MODEL — you buy them once and the price is multiplied by your model count. A 30-model Gargoyle Brood pays 5 for Pathogenesis, 30 for Infrasonic Roar and 150 for Endless. You also can no longer buy the same biomorph more than once. Open any Tyranid list with biomorphs and check the total.",
    line2: "💸 THREE THINGS YOU COULD PAY FOR DID NOTHING AT ALL. The Space Marine trait BLOOD HUNGER cost 5 points a unit and gave you nothing. The Imperial Guard trait CLOSE ORDER DRILL is free but also has a downside, and the app told you neither half. And ALL SIX GENESTEALER CULTS LEGACIES were dead — each one is meant to teach every Psyker an extra power, and taught them nothing. All three work now.",
    line3: "⚔️ WEAPONS WERE SHOWING ON CARDS THAT NEVER BOUGHT THEM: a Shock charger on every Servitor, all three weapons on an unupgraded Penal Legion Squad — whose two upgrades also did nothing at all — and the Horus Heresy Leviathan's built-in Melta before you had bought an arm. AND EVERY HORUS HERESY COMBI-WEAPON was missing the Combi ability, the one thing that makes it a combi-weapon.",
    line4: "💰 THE CHAOS ASCENDED DAEMON PRINCE moved 6\" instead of 8\", and one psychic power — Space Marine ENGULFING FEAR — was missing its entire effect. CORRECTION: this banner previously said the Tyranid Neurothrope had been overcharged. That was our mistake. The upgrade is 25 points, it shipped free for a day, and it is back to 25 — the check had read the price off the stat line and missed the upgrade line below it.",
    line5: "📖 THE RULES YOU TAP THROUGH TO WERE OUT OF DATE IN PLACES. The orders never told you your target gets to react — Take Cover against shooting, Defensive Fire or Hold your Ground against a charge. Escape was missing half its effect, Meta Orders never said when you may use one, and Fire Hatches was simply the wrong rule. Cheat sheets and wiki updated in all three languages.",
    line6: "🙂 REPORTED BY A PLAYER — THE APP NO LONGER TELLS YOU OFF FOR AN UNFINISHED LIST. A 2485-point Pitched Battle army used to show a red ✗ and \"1 errors\", when all that was happening is that the list was not done yet. It is now a plain note: \"15 points to go to reach 2500\". Going OVER the limit is still an error.",
    line7: "🔮 REPORTED ON GITHUB — SMITE'S DESCRIPTION WAS THE OLD ONE — it still said \"1D3 Mortal Wounds\" on a psyker's power list. Smite is three automatic hits at Strength 5, AP -1, Damage 1, Seeking, which is what the rest of the app already said.",
    line8: "🌤 LIGHT MODE: A LOT OF THINGS WERE INVISIBLE. Reported by one of you. The unit card's title sat dark-on-dark and was unreadable, and most of the small icons — the slot icons in the catalogue, the Chaos Mark icons, the stat and weapon-table icons — were being painted white onto a white panel. 41 of the 43 icons in the app were affected. Fixed by making the tints follow the theme, while the ones that sit on a deliberately dark badge stay light. If you use light mode, it should all be there now.",
    line9: "👁 SOMEONE ELSE'S LIST NOW OPENS LOCKED. Asked for by Dominic. Opening a community army used to drop you into the builder with everything clickable, so reading a list felt one wrong click away from wrecking it. It now opens in view mode, with a bar naming whose list it is and an EDIT MY COPY button. To be clear: nothing was ever at risk — what you open is a COPY, and the server has always refused any change to a list you do not own, Inquisitor rights included. It just never said so. AND YOU CAN NOW FILTER THE COMMUNITY LIST BY EVENT — also Dominic's idea — so \"show me every list in the league\" is one dropdown.",
    line10: "🛡 IMPERIAL GUARD UPDATE FOR THE LEAGUE. The author sent a new sheet, so there is a new archetype: RATLING COMPANY gives every creature unit +1 Ballistic Skill and costs them -1 Strength and -1 Toughness, and cannot take Bullgryns, Ogryns, Ogryn Bodyguard, Ogryn Brutes, Stormtroopers or Stormtrooper Command Squads. The stat changes are really applied — pick it and your cards change; vehicles are untouched, as the codex says. WAR HAWKS IS NOW AIRBORNE ASSAULT COMPANY: same rules, new name, and lists you already saved keep working. Also fixed: the HARDENED FIGHTERS trait was making Weapon Skill WORSE instead of better, and two archetype descriptions were wrong — Mechanised Company counts its transports at 75%, not 50% (the app always calculated it right, only the text was wrong).",
    line11: "🔍 THESE ARE THE FIRST RESULTS, NOT THE LAST. The check is still running, so expect more fixes in the next versions. Keep reporting anything that looks wrong — your reports are what tell us where to look first.",
    contrib: "👁️ Found something wrong? The in-app bug report form works — unit, engagement, archetype and a picture.",
  },
  de: {
    title: "v1.73: eine vollständige Prüfung der App gegen die Codices — erste Ergebnisse",
    intro: "Jede Waffe, jede Psi-Kraft, jeder Wert und Punktepreis, jeder Archetyp, jedes Vermächtnis, jede Eigenschaft und jedes Arsenal wurde gegen die eigene Codex-Seite gelesen. Das sind die ersten Ergebnisse. Die Prüfung läuft weiter.",
    install: "",
    line1: "🐛 DIE PREISE DER TYRANIDEN-BIOMORPHE STEHEN FEST, und das ist die letzte Änderung daran. Basis-Biomorphe kosten einen festen Preis für die Einheit. Fortgeschrittene und Spezielle Biomorphe werden PRO MODELL bezahlt — einmal gekauft, Preis mal Modellanzahl. Eine Gargoyle-Brut mit 30 Modellen zahlt 5 für Pathogenesis, 30 für Infrasonic Roar und 150 für Endless. Außerdem lässt sich dasselbe Biomorph nicht mehr mehrfach kaufen. Öffnet eine Tyraniden-Liste mit Biomorphen und prüft die Gesamtkosten.",
    line2: "💸 DREI DINGE, FÜR DIE IHR BEZAHLEN KONNTET, TATEN GAR NICHTS. Die Space-Marine-Eigenschaft BLOOD HUNGER kostete 5 Punkte pro Einheit und gab euch nichts. Die Eigenschaft CLOSE ORDER DRILL der Imperialen Armee ist kostenlos, hat aber auch einen Nachteil — die App nannte euch keine der beiden Hälften. Und ALLE SECHS VERMÄCHTNISSE DER GENESTEALER CULTS waren tot: jedes soll allen Psionikern eine zusätzliche Kraft beibringen und brachte ihnen nichts bei. Alle drei funktionieren jetzt.",
    line3: "⚔️ WAFFEN ERSCHIENEN AUF KARTEN, DIE SIE NIE GEKAUFT HATTEN: ein Shock charger auf jedem Servitor, alle drei Waffen auf einem nicht aufgewerteten Penal Legion Squad — dessen zwei Aufwertungen ebenfalls gar nichts taten — und die eingebaute Melta des Horus-Heresy-Leviathan, bevor ihr einen Arm gekauft hattet. UND ALLEN HORUS-HERESY-KOMBIWAFFEN fehlte die Combi-Fähigkeit, also genau das, was eine Kombiwaffe ausmacht.",
    line4: "💰 DER AUFGESTIEGENE DÄMONENPRINZ bewegte sich 6\" statt 8\", und einer Psi-Kraft — ENGULFING FEAR der Space Marines — fehlte ihre gesamte Wirkung. KORREKTUR: hier stand zuvor, der Tyraniden-Neurothrope sei zu teuer gewesen. Das war unser Fehler. Die Aufwertung kostet 25 Punkte, war einen Tag lang kostenlos und steht wieder bei 25 — die Prüfung hatte den Preis aus der Statzeile gelesen und die Aufwertungszeile darunter übersehen.",
    line5: "📖 DIE REGELTEXTE, DIE IHR ANTIPPT, WAREN STELLENWEISE VERALTET. Die Befehle sagten nie, dass euer Ziel reagieren darf — Take Cover gegen Beschuss, Defensive Fire oder Hold your Ground gegen einen Angriff. Escape fehlte die Hälfte seiner Wirkung, bei den Meta Orders stand nie, wann man eine nutzen darf, und Fire Hatches war schlicht die falsche Regel. Cheat Sheets und Wiki in allen drei Sprachen aktualisiert.",
    line6: "🙂 VON EINEM SPIELER GEMELDET — DIE APP SCHIMPFT NICHT MEHR ÜBER EINE UNFERTIGE LISTE. Eine Pitched-Battle-Armee mit 2485 Punkten zeigte ein rotes ✗ und \"1 errors\", obwohl die Liste einfach noch nicht fertig war. Jetzt steht dort schlicht: \"Noch 15 Punkte bis 2500\". ÜBER dem Limit bleibt ein Fehler.",
    line7: "🔮 AUF GITHUB GEMELDET — SMITES BESCHREIBUNG WAR DIE ALTE — in der Kräfteliste stand noch \"1D3 Mortal Wounds\". Smite sind drei automatische Treffer mit Stärke 5, AP -1, Schaden 1, Seeking, so wie es der Rest der App längst sagte.",
    line8: "🌤 LIGHT MODE: VIELES WAR UNSICHTBAR. Von einem von euch gemeldet. Der Titel der Einheitenkarte stand dunkel auf dunkel und war unlesbar, und die meisten kleinen Symbole — die Slot-Symbole im Katalog, die Chaos-Mal-Symbole, die Werte- und Waffentabellen-Symbole — wurden weiß auf weißem Panel gezeichnet. 41 der 43 Symbole waren betroffen. Die Tönungen folgen jetzt dem Theme, während die auf bewusst dunklem Grund hell bleiben. Im Light Mode sollte jetzt alles da sein.",
    line9: "👁 FREMDE LISTEN ÖFFNEN JETZT GESPERRT. Von Dominic gewünscht. Bisher landete man beim Öffnen einer Community-Armee direkt im Builder, alles anklickbar — Lesen fühlte sich wie ein Fehlklick vom Zerstören entfernt an. Jetzt öffnet sie im Ansichtsmodus, mit einer Leiste, die sagt, wessen Liste es ist, und einem Button MEINE KOPIE BEARBEITEN. Zur Klarstellung: es war nie etwas in Gefahr — ihr öffnet eine KOPIE, und der Server hat Änderungen an fremden Listen immer abgelehnt, Inquisitor-Rechte eingeschlossen. Es stand nur nirgends. UND DIE COMMUNITY-LISTE LÄSST SICH JETZT NACH EVENT FILTERN — ebenfalls Dominics Idee — \"zeig mir alle Listen der Liga\" ist damit ein Dropdown.",
    line10: "🛡 IMPERIALE-ARMEE-UPDATE FÜR DIE LIGA. Der Autor hat ein neues Tabellenblatt geschickt, also gibt es einen neuen Archetyp: RATLING COMPANY gibt jeder Kreatureneinheit +1 Ballistische Fähigkeit und kostet sie -1 Stärke und -1 Widerstand, und kann keine Bullgryns, Ogryns, Ogryn Bodyguard, Ogryn Brutes, Stormtroopers oder Stormtrooper Command Squads nehmen. Die Wertänderungen werden wirklich angewendet — wählt ihn und eure Karten ändern sich; Fahrzeuge bleiben unberührt, wie es der Codex sagt. WAR HAWKS HEISST JETZT AIRBORNE ASSAULT COMPANY: gleiche Regeln, neuer Name, gespeicherte Listen laufen weiter. Außerdem behoben: die Eigenschaft HARDENED FIGHTERS machte das Kampfgeschick SCHLECHTER statt besser, und zwei Archetyp-Beschreibungen waren falsch — Mechanised Company zählt seine Transporter mit 75%, nicht 50% (gerechnet wurde immer richtig, nur der Text war falsch).",
    line11: "🔍 DAS SIND DIE ERSTEN ERGEBNISSE, NICHT DIE LETZTEN. Die Prüfung läuft weiter, es kommen also weitere Korrekturen in den nächsten Versionen. Meldet weiterhin alles, was falsch aussieht — eure Meldungen sagen uns, wo wir zuerst hinschauen.",
    contrib: "👁️ Etwas falsch? Das Bug-Report-Formular in der App funktioniert — Einheit, Engagement, Archetyp und ein Bild.",
  },
  es: {
    title: "v1.73: una revisión completa de la app contra los códex — primeros resultados",
    intro: "Cada arma, cada poder psíquico, cada stat y cada coste en puntos, cada Arquetipo, Legacy, Trait y Armería se ha leído contra su propia página del códex. Estos son los primeros resultados. La revisión sigue en marcha.",
    install: "",
    line1: "🐛 LOS PRECIOS DE LOS BIOMORFOS TYRÁNIDOS QUEDAN CERRADOS, y este es el último cambio. Los Biomorfos Básicos cuestan un precio fijo para la unidad. Los Avanzados y los Especiales se pagan POR MODELO — los compras una vez y el precio se multiplica por el número de modelos. Una Gargoyle Brood de 30 paga 5 por Pathogenesis, 30 por Infrasonic Roar y 150 por Endless. Además ya no se puede comprar el mismo biomorfo más de una vez. Abre cualquier lista tyránida con biomorfos y mira el total.",
    line2: "💸 TRES COSAS QUE PODÍAS PAGAR NO HACÍAN NADA. El trait de Space Marines BLOOD HUNGER costaba 5 puntos por unidad y no daba nada. El trait de Guardia CLOSE ORDER DRILL es gratis pero también tiene un inconveniente, y la app no te contaba ninguna de las dos mitades. Y LAS SEIS LEGACIES DE GENESTEALER CULTS estaban muertas: cada una debe enseñar un poder extra a todos tus Psykers, y no enseñaba nada. Las tres funcionan ya.",
    line3: "⚔️ HABÍA ARMAS EN FICHAS QUE NUNCA LAS COMPRARON: un Shock charger en todos los Servitors, las tres armas en un Penal Legion Squad sin mejorar — cuyas dos mejoras tampoco hacían nada — y la Melta integrada del Leviathan de Horus Heresy antes de comprarle un brazo. Y A TODAS LAS COMBI DE HORUS HERESY les faltaba la habilidad Combi, que es justo lo que hace que sea un arma combi.",
    line4: "💰 EL PRÍNCIPE DEMONIO ASCENDIDO movía 6\" en vez de 8\", y a un poder psíquico — ENGULFING FEAR de Space Marines — le faltaba todo su efecto. CORRECCIÓN: aquí ponía antes que el Neurothrope tyránido estaba cobrando de más. Fue un error nuestro. La mejora cuesta 25 puntos, estuvo gratis un día y ya vuelve a costar 25 — la revisión había leído el precio de la línea de stats y se saltó la línea de mejora de justo debajo.",
    line5: "📖 LAS REGLAS QUE CONSULTAS AL TOCAR ESTABAN DESACTUALIZADAS EN VARIOS SITIOS. Las órdenes nunca te decían que tu objetivo puede reaccionar — Take Cover contra disparos, Defensive Fire o Hold your Ground contra una carga. A Escape le faltaba la mitad de su efecto, las Meta Orders nunca decían cuándo puedes usar una, y Fire Hatches era directamente la regla equivocada. Chuletas y wiki actualizados en los tres idiomas.",
    line6: "🙂 REPORTADO POR UN JUGADOR — LA APP YA NO TE RIÑE POR UNA LISTA SIN TERMINAR. Un ejército de 2485 puntos en Pitched Battle salía con una ✗ roja y \"1 errors\", cuando lo único que pasaba es que la lista aún no estaba acabada. Ahora es una nota normal: \"Faltan 15 puntos para 2500\". Pasarse del límite sigue siendo error.",
    line7: "🔮 REPORTADO EN GITHUB — LA DESCRIPCIÓN DE SMITE ERA LA VIEJA — en la lista de poderes seguía diciendo \"1D3 Heridas Mortales\". Smite son tres impactos automáticos con Fuerza 5, AP -1, Daño 1, Seeking, que es lo que ya decía el resto de la app.",
    line8: "🌤 MODO CLARO: HABÍA UN MONTÓN DE COSAS QUE NO SE VEÍAN. Reportado por uno de vosotros. El título de la ficha de unidad salía oscuro sobre oscuro e ilegible, y la mayoría de los iconos pequeños — los de slot del catálogo, los de Marca de Caos, los de stats y los de la tabla de armas — se pintaban en blanco sobre un panel blanco. Afectaba a 41 de los 43 iconos de la app. Ahora los tintes siguen al tema, y los que van sobre una chapa oscura a propósito se quedan claros. Si usas modo claro, ya debería estar todo.",
    line9: "👁 LA LISTA DE OTRO YA SE ABRE BLOQUEADA. Pedido por Dominic. Antes, al abrir un ejército de la comunidad caías en el builder con todo clicable, así que leer una lista parecía estar a un clic de cargártela. Ahora se abre en modo consulta, con una barra que dice de quién es y un botón EDITAR MI COPIA. Y que quede claro: nunca hubo nada en riesgo — lo que abres es una COPIA, y el servidor siempre ha rechazado cualquier cambio en una lista que no sea tuya, derechos de Inquisidor incluidos. Simplemente no se decía. Y LA LISTA DE LA COMUNIDAD YA SE PUEDE FILTRAR POR EVENTO — también idea de Dominic — así \"enséñame todas las listas de la liga\" es un desplegable.",
    line10: "🛡 UPDATE DE GUARDIA IMPERIAL PARA LA LIGA. El autor mandó hoja nueva, así que hay un arquetipo nuevo: RATLING COMPANY da a cada unidad criatura +1 a Habilidad de Proyectiles y le quita -1 Fuerza y -1 Resistencia, y no puede llevar Bullgryns, Ogryns, Ogryn Bodyguard, Ogryn Brutes, Stormtroopers ni Stormtrooper Command Squads. Los cambios de stats se aplican de verdad — lo eliges y tus fichas cambian; los vehículos no se tocan, como dice el códex. WAR HAWKS AHORA SE LLAMA AIRBORNE ASSAULT COMPANY: mismas reglas, nombre nuevo, y las listas que ya tengas guardadas siguen funcionando. También arreglado: el trait HARDENED FIGHTERS empeoraba la Habilidad de Armas en vez de mejorarla, y dos descripciones de arquetipo estaban mal — Mechanised Company cuenta sus transportes al 75%, no al 50% (la app siempre calculó bien, lo que estaba mal era el texto).",
    line11: "🔍 ESTOS SON LOS PRIMEROS RESULTADOS, NO LOS ÚLTIMOS. La revisión sigue, así que habrá más arreglos en las siguientes versiones. Seguid reportando cualquier cosa que parezca mal — vuestros reportes son lo que nos dice dónde mirar primero.",
    contrib: "👁️ ¿Algo mal? El formulario de reporte de bugs de la app funciona — unidad, engagement, arquetipo y una imagen.",
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
            className="text-zinc-600 hover:text-zinc-300 text-lg leading-none shrink-0 transition-colors"
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
              v1.71's lines were removed -- see [[feedback_version_cut_banner_scope]]. Append
              here while v1.72 is open; cut a fresh banner when a new version is cut. */}
          {[tx.line1, tx.line2, tx.line3, tx.line4, tx.line5, tx.line6, tx.line7, tx.line8, tx.line9, tx.line10, tx.line11]
            .filter(Boolean)
            .map((line, i) => <BoldSplitLine key={i} text={line} />)}
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
          className="text-zinc-600 hover:text-zinc-300 text-lg leading-none shrink-0 transition-colors"
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
              href="https://custom40k-wiki.vercel.app"
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
              href="https://custom40k-wiki.vercel.app/glossary"
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

          {/* Discord */}
          <a
            href="https://discord.com/invite/wnGAB3TYAY"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 flex items-center gap-2 text-[11px] text-zinc-600 hover:text-indigo-400 transition-colors uppercase tracking-wider anim-fade-up anim-delay-5"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            {t('navDiscord')}
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
