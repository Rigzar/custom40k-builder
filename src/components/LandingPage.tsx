import { useState, useEffect } from 'react';
import * as api from '../lib/api';
import { ChangelogModal } from './ChangelogModal';
import { LanguageSelector } from './LanguageSelector';
import { SupplementModal, type SupplementKey } from './SupplementModal';
import { FactionSymbol } from './FactionSymbol';
import { Avatar } from './Avatar';
import { MessagesModal, InquisitorBadge } from './MessagesModal';
import { useT, useLanguage, type Language } from '../i18n';
import { useAuth } from '../hooks/useAuth';
import type { SavedArmy } from '../hooks/useSavedArmies';
import { CHANGELOG } from '../data/changelog';

const ANNOUNCEMENT_KEY = 'c40k_announcement_v165k_dismissed';

type AnnouncementLang = { title: string; intro: string; install: string; line1: string; line2: string; line3: string; line4: string; line5: string; line6: string; line7: string; line8: string; line9: string; line10: string; line11: string; line12: string; line13: string; line14: string; line15: string; line16: string; contrib: string; };
const ANNOUNCEMENT_TEXT: Record<Language, AnnouncementLang> = {
  en: {
    title: "v1.65: Grey Knights — the power you couldn't find",
    intro: "The Dreadnought (and 6 other vehicles) \"know Smite and Fortitude\" — Fortitude just had nowhere to live. It does now.",
    install: "🔮 Fortitude and Eldar's Craftsong are datasheet-only powers, printed on their own sheet instead of a shared discipline list. They now show as Always Known, exactly like Smite, and these units no longer offer a free pick from every other discipline they had no business seeing.",
    line1: "🧬 Tyranids — every Biomorph now actually does something. Winged adds +6\" Movement, Anti-Grav and Deep Strike; Toxin Sacs adds +1 Strength; Hardened Carapace improves the armor save — and 24 more. Before, taking one only changed the points total.",
    line2: "🔫 Psy-ammunition (and its Inquisition/Tau/Tyranid cousins) boosted the model's own Strength stat, invisible on any weapon with a flat printed Strength — buying it changed nothing. It now raises the qualifying weapons' own Strength instead.",
    line3: "⚖️ 29 units across every faction — Chaplains, Librarians, Lords, Autarchs and more — showed their promoted-only bonus (a second use of a signature ability, an extra power) whether or not anyone paid for the promotion. Now tied to actually buying it.",
    line4: "🔩 Rubric Marines' Sorcerer no longer counts toward the squad's own Warpflamer swap (8 max in a 9-model squad, not 9). Stormtroopers' special-weapon swaps now remove the old lasgun, and Deep Strike/Infiltrator cost their printed point per model and actually do something. A 2-Manticore squadron can now upgrade both Manticores, not just one.",
    line5: "⚪ Adepta Sororitas — promoting a Sisters Novitiate squad's Sister Superior to a Veteran Superior no longer shows 10 Sister Novitiate instead of 9.",
    line6: "👥 Sharing an army privately is now possible — hit \"Share\" on any of your armies and pick a friend or any other player by username; only they can see and copy it, no need to make it fully public. Friend requests now go through Accept/Decline instead of adding both ways silently.",
    line7: "🛡️ Any bought option that improves a unit's Save (Tyranid Hardened Carapace being the most common one) silently did nothing — the code applying it had no case for a save value like \"3+\". Fixed for all 33 places that use it.",
    line8: "🧬🔮 Tyranids and Grey Knights codex sync: Squadron removed from 5 Tyranid units, Feeder Tendrils fixed to \"Favoured Enemy\", a Hive Fleet Legacy now grants only its own gear instead of all 5 at once; Grey Knights gained a third psychic discipline (\"Legacy\", 8 powers) and updated wording on Cleanse Soul, Refrain of Convergence and Force Field.",
    line9: "🛡️ Tyranids — a Tyrant Guard Brood next to a Hive Tyrant, Neurotyrant or Swarmlord was always exempted from an HQ slot with no way to turn it off. Each one now has its own toggle to decline the exemption instead.",
    line10: "⚔️ CSM/SM \"Legion\" and AdMech \"Taghmata\" — units from these supplement archetypes (Horus Heresy, Legio Titanicus) had zero access to the army's own Legacy armory, trait pool or forced mark; they were wrongly treated as a separate Allied Detachment. Fixed — a Legion Tactical Squad can now buy from e.g. the Black Legion Armoury like any other unit.",
    line11: "🛠️ Horus Heresy/Legio Titanicus follow-up audit: their units could buy the ENTIRE host codex's General armory instead of just the Veteran/vehicle items they actually need, and \"Crusade weapon\" had no way to pick which of its 5 named bonuses applies — it just charged 10 points for nothing. Both fixed.",
    line12: "📜 Cheat Sheets re-checked line-by-line against the Core Rules: the Morale card was missing Explosive's -1 Suppression penalty, and the Melee card's Charge order skipped the normal move before the 6\" charge move. Both fixed — and Cheat Sheets now has its own button on the home screen, next to Wiki and Glossary.",
    line13: "🕵️ Inquisitor — the card said it \"cannot be the mandatory choice for the HQ slot\". That restriction is gone from the codex (confirmed on Discord); the warning is gone too. An Inquisitor can be your mandatory HQ pick like any other HQ unit.",
    line14: "⚙️ Supplement armories (Horus Heresy, Legio Titanicus) and Authority of the Inquisition always showed every weapon AND equipment item in one list, ignoring the Weapons/Equipment tabs — and Horus Heresy's \"Crusade weapon\" never let you pick which of its 5 bonuses applies on this path. Both fixed: these tabs now behave like every other armory tab, pickers included.",
    line15: "🔫 A weapon bought from the Armory for one specific model, on a squad where several ordinary models can each buy their own gear (no single Champion), always showed the whole squad's size instead of how many models actually have it — one Plasma pistol and one Thunder hammer on a 5-model Kill Team Veterans showed \"5x\" of each. Fixed. Separately, Inquisitorial Stormtroopers' plasma gun swap had a lowercase typo that broke the same count for that one item.",
    line16: "🩺 Inquisition — a Henchman Warband showed EVERY specialist's weapon (Jokaero digital weapons, Ranger long rifle, Arco flail…) whether or not that specialist was actually in the unit, since its equipment text doesn't use the format the engine expects everywhere else. A Warband with just an Acolyte and an Exorcist now correctly shows only their own gear.",
    contrib: "👁️ Six of these came straight from the in-app bug report form — keep using it. Anything still wrong: unit, engagement, archetype and a picture.",
  },
  de: {
    title: "v1.65: Grey Knights — die Kraft, die ihr nicht finden konntet",
    intro: "Der Dreadnought (und 6 weitere Fahrzeuge) \"kennt Smite und Fortitude\" — Fortitude hatte einfach keinen Platz. Jetzt hat es einen.",
    install: "🔮 Fortitude und das Craftsong der Eldar sind reine Datenblatt-Kräfte, gedruckt auf dem eigenen Blatt statt in einer gemeinsamen Disziplinliste. Sie erscheinen jetzt als „Immer bekannt“, genau wie Smite, und diese Einheiten bieten nicht mehr die freie Wahl aus jeder anderen Disziplin an, die ihnen gar nicht zustand.",
    line1: "🧬 Tyraniden — jeder Biomorph tut jetzt wirklich etwas. Winged bringt +6\" Bewegung, Anti-Grav und Deep Strike; Toxin Sacs +1 Stärke; Hardened Carapace verbessert den Rüstungswurf — und 24 weitere. Vorher änderte die Wahl nur die Punktzahl.",
    line2: "🔫 Psy-Munition (und ihre Verwandten bei Inquisition/Tau/Tyraniden) erhöhte den eigenen Stärkewert des Modells — unsichtbar bei jeder Waffe mit fest gedruckter Stärke. Der Kauf änderte nichts. Jetzt erhöht sie die Stärke der betroffenen Waffen selbst.",
    line3: "⚖️ 29 Einheiten aus jeder Fraktion — Kapläne, Bibliothekare, Lords, Autarchen und mehr — zeigten ihren Beförderungs-Bonus (zweite Nutzung einer Signaturfähigkeit, zusätzliche Kraft) unabhängig davon, ob die Beförderung bezahlt wurde. Jetzt an den tatsächlichen Kauf gebunden.",
    line4: "🔩 Der Sorcerer der Rubric Marines zählt nicht mehr zum eigenen Warpflamer-Tausch des Trupps (max. 8 bei 9 Modellen, nicht 9). Sturmtruppen-Spezialwaffentausch entfernt jetzt das alte Lasgewehr, und Deep Strike/Infiltrator kosten den gedruckten Punkt pro Modell und tun tatsächlich etwas. Ein 2-Manticore-Geschwader kann jetzt beide Manticores aufrüsten, nicht nur eine.",
    line5: "⚪ Adepta Sororitas — wird die Sister Superior eines Sisters-Novitiate-Trupps zur Veteran Superior befördert, zeigt der Trupp nicht mehr 10 statt 9 Sister Novitiate.",
    line6: "👥 Eine Armee privat teilen ist jetzt möglich — „Teilen“ bei einer eigenen Armee anklicken und einen Freund oder beliebigen Spieler per Benutzernamen wählen; nur diese Person kann sie sehen und kopieren, ohne sie komplett öffentlich zu machen. Freundschaftsanfragen laufen jetzt über Annehmen/Ablehnen statt beide Seiten stillschweigend hinzuzufügen.",
    line7: "🛡️ Optionen, die den Rettungswurf verbessern (meistens Tyraniden-Hardened-Carapace), taten stillschweigend nichts — der Code dafür kannte keinen Wert wie „3+“. Jetzt für alle 33 betroffenen Stellen behoben.",
    line8: "🧬🔮 Codex-Abgleich Tyraniden & Grey Knights: Squadron bei 5 Tyraniden-Einheiten entfernt, Feeder Tendrils zu „Favoured Enemy“ korrigiert, eine Hive-Fleet-Legacy gewährt jetzt nur noch ihre eigene Ausrüstung statt aller 5 auf einmal; Grey Knights erhalten eine dritte Psi-Disziplin („Legacy“, 8 neue Kräfte) sowie aktualisierten Text bei Cleanse Soul, Refrain of Convergence und Force Field.",
    line9: "🛡️ Tyraniden — ein Tyrant Guard Brood neben einem Hive Tyrant, Neurotyrant oder Swarmlord war immer von einem HQ-Slot befreit, ohne Möglichkeit das abzuschalten. Jeder hat jetzt einen eigenen Umschalter, um auf die Befreiung zu verzichten.",
    line10: "⚔️ CSM/SM „Legion“ und AdMech „Taghmata“ — Einheiten aus diesen Supplement-Archetypen (Horus Heresy, Legio Titanicus) hatten keinerlei Zugriff auf die eigene Legacy-Armory, den Trait-Pool oder ein erzwungenes Mal; sie wurden fälschlich wie eine eigenständige verbündete Streitmacht behandelt. Behoben — ein Legion Tactical Squad kann jetzt z. B. aus der Black-Legion-Armory kaufen wie jede andere Einheit.",
    line11: "🛠️ Horus Heresy/Legio Titanicus Nachaudit: ihre Einheiten konnten die GESAMTE General-Armory des Wirtscodex kaufen statt nur die Veteran-/Fahrzeug-Gegenstände, die sie tatsächlich brauchen, und „Crusade weapon“ ließ nicht wählen, welcher der 5 benannten Boni gilt — es kostete einfach 10 Punkte für nichts. Beides behoben.",
    line12: "📜 Cheat Sheets Zeile für Zeile gegen die Core Rules geprüft: der Moral-Karte fehlte die -1-Suppression-Strafe von Explosive, und die Nahkampf-Karte übersprang bei „Charge“ die normale Bewegung vor der 6\"-Charge-Bewegung. Beides behoben — Cheat Sheets hat jetzt einen eigenen Button auf dem Startbildschirm, neben Wiki und Glossar.",
    line13: "🕵️ Inquisitor — die Karte sagte, er könne „nicht die verpflichtende Wahl für den HQ-Slot sein“. Diese Einschränkung gibt es im Codex nicht mehr (auf Discord bestätigt); die Warnung ist jetzt auch weg. Ein Inquisitor kann eure verpflichtende HQ-Wahl sein wie jede andere HQ-Einheit.",
    line14: "⚙️ Supplement-Armories (Horus Heresy, Legio Titanicus) und „Authority of the Inquisition“ zeigten immer jede Waffe UND jede Ausrüstung in einer Liste, ohne die Waffen-/Ausrüstungs-Tabs zu beachten — und „Crusade weapon“ der Horus Heresy ließ auf diesem Weg nie wählen, welcher der 5 Boni gilt. Beides behoben: diese Tabs verhalten sich jetzt wie jeder andere Armory-Tab, inklusive Auswahlmenü.",
    line15: "🔫 Eine für ein bestimmtes Modell aus der Armory gekaufte Waffe zeigte bei einem Trupp, in dem mehrere gewöhnliche Modelle jeweils eigene Ausrüstung kaufen können (kein einzelner Champion), immer die Größe des ganzen Trupps statt der tatsächlichen Anzahl — eine Plasma-Pistole und ein Donnerhammer bei fünf Kill Team Veterans zeigten jeweils „5x\". Behoben. Separat hatte der Plasmagewehr-Tausch der Inquisitorial Stormtroopers einen Kleinschreibungs-Tippfehler, der dieselbe Zählung für genau dieses Item kaputt machte.",
    line16: "🩺 Inquisition — ein Henchman Warband zeigte IMMER die Waffe jedes Spezialisten (Jokaero-Digitalwaffen, Ranger-Scharfschützengewehr, Arco-Dreschflegel…), egal ob dieser Spezialist tatsächlich in der Einheit war, weil sein Ausrüstungstext nicht das Format nutzt, das die Engine sonst überall erwartet. Ein Warband mit nur einem Akolyth und einem Exorzisten zeigt jetzt korrekt nur deren eigene Ausrüstung.",
    contrib: "👁️ Sechs davon kamen direkt aus dem Bug-Report-Formular in der App — nutzt es weiter. Was noch falsch aussieht: Einheit, Engagement, Archetyp und ein Bild.",
  },
  es: {
    title: "v1.65: Grey Knights — el poder que no encontrabais",
    intro: "El Dreadnought (y otros 6 vehículos) \"conoce Smite y Fortitude\" — Fortitude simplemente no tenía dónde vivir. Ahora sí.",
    install: "🔮 Fortitude y el Craftsong de los Eldar son poderes exclusivos de su propia ficha, impresos ahí en vez de en una lista de disciplina compartida. Ahora aparecen como \"Siempre conocido\", igual que Smite, y estas unidades ya no ofrecen elegir libremente entre disciplinas que no les correspondían.",
    line1: "🧬 Tiránidos — cada Biomorfo hace ahora algo de verdad. Winged suma +6\" de Movimiento, Anti-Grav y Deep Strike; Toxin Sacs suma +1 de Fuerza; Hardened Carapace mejora la salvación — y 24 más. Antes, elegir uno solo cambiaba los puntos.",
    line2: "🔫 La munición psíquica (y sus primas de Inquisición/Tau/Tiránidos) subía la Fuerza propia del modelo, invisible en cualquier arma con Fuerza fija impresa — comprarla no cambiaba nada. Ahora sube la Fuerza de las armas que corresponde.",
    line3: "⚖️ 29 unidades de todas las facciones — Capellanes, Bibliotecarios, Lores, Autarcas y más — mostraban su bonus de ascenso (un segundo uso de una habilidad de firma, un poder extra) se hubiera pagado o no el ascenso. Ahora depende de comprarlo de verdad.",
    line4: "🔩 El Sorcerer de los Rubric Marines ya no cuenta para el propio cambio de Warpflamer de la escuadra (máximo 8 en una escuadra de 9, no 9). Los cambios de arma especial de los Stormtroopers ahora retiran el lasgun viejo, y Deep Strike/Infiltrator cuestan el punto impreso por modelo y hacen algo de verdad. Un escuadrón de 2 Manticores ya puede mejorar los dos, no solo uno.",
    line5: "⚪ Adepta Sororitas — ascender a la Sister Superior de una escuadra de Sisters Novitiate a Veteran Superior ya no muestra 10 Sister Novitiate en vez de 9.",
    line6: "👥 Ahora se puede compartir un ejército en privado — pulsa \"Compartir\" en cualquiera de tus ejércitos y elige un amigo o cualquier jugador por su nombre de usuario; solo esa persona podrá verlo y copiarlo, sin necesidad de hacerlo público del todo. Las solicitudes de amistad ahora pasan por Aceptar/Rechazar en vez de añadirse en ambos sentidos en silencio.",
    line7: "🛡️ Cualquier opción comprada que mejora la Salvación (Hardened Carapace de Tiránidos, la más común) no hacía nada — el código que la aplica no sabía manejar un valor tipo \"3+\". Arreglado en los 33 sitios que lo usan.",
    line8: "🧬🔮 Sincronización de códex Tiránidos y Grey Knights: Squadron quitado de 5 unidades Tiránidas, Feeder Tendrils corregido a \"Favoured Enemy\", una Legacy de Hive Fleet ahora solo da acceso a su propio equipo en vez de los 5 a la vez; Grey Knights gana una tercera disciplina psíquica (\"Legacy\", 8 poderes nuevos) y texto actualizado en Cleanse Soul, Refrain of Convergence y Force Field.",
    line9: "🛡️ Tiránidos — un Tyrant Guard Brood junto a un Hive Tyrant, Neurotyrant o Swarmlord siempre quedaba exento de ocupar un slot de HQ, sin forma de desactivarlo. Ahora cada uno tiene su propio interruptor para renunciar a la exención.",
    line10: "⚔️ CSM/SM \"Legion\" y AdMech \"Taghmata\" — las unidades de estos arquetipos de suplemento (Horus Heresy, Legio Titanicus) no tenían ningún acceso a la armería de Legacy del ejército, a su pool de rasgos ni a su marca forzada; se trataban por error como un Allied Detachment separado. Arreglado — un Legion Tactical Squad ya puede comprar de, por ejemplo, la Black Legion Armoury como cualquier otra unidad.",
    line11: "🛠️ Auditoría de seguimiento de Horus Heresy/Legio Titanicus: sus unidades podían comprar TODA la armería general del códex anfitrión en vez de solo los ítems de Veterano/vehículo que realmente necesitan, y \"Crusade weapon\" no dejaba elegir cuál de sus 5 bonos con nombre aplica — solo cobraba 10 puntos por nada. Ambos arreglados.",
    line12: "📜 Cheat Sheets revisadas línea por línea contra el Core Rules: a la ficha de Moral le faltaba la penalización -1 de Explosive en armas con Suppression, y la ficha de Combate Cuerpo a Cuerpo se saltaba el movimiento normal antes del movimiento de 6\" de Charge. Ambos arreglados — y Cheat Sheets ahora tiene su propio botón en la pantalla principal, junto a Wiki y Glosario.",
    line13: "🕵️ Inquisitor — la ficha decía que \"no puede ser la elección obligatoria para el slot de HQ\". Esa restricción ya no existe en el códex (confirmado en Discord); el aviso también desaparece. Un Inquisitor puede ser tu elección obligatoria de HQ como cualquier otra unidad de HQ.",
    line14: "⚙️ Las armerías de suplemento (Horus Heresy, Legio Titanicus) y \"Authority of the Inquisition\" mostraban siempre todas las armas Y todo el equipo juntos en una lista, ignorando las pestañas Weapons/Equipment — y \"Crusade weapon\" de Horus Heresy nunca dejaba elegir cuál de sus 5 bonos aplica por esta vía. Ambos arreglados: estas pestañas ahora se comportan como cualquier otra pestaña de armería, con su selector incluido.",
    line15: "🔫 Un arma comprada de la Armería para un modelo concreto, en una unidad donde varios modelos normales pueden comprar cada uno lo suyo (sin un Campeón único), siempre mostraba el tamaño de toda la escuadra en vez de cuántos modelos la tienen de verdad — una Plasma pistol y un Thunder hammer en 5 Kill Team Veterans mostraban \"5x\" de cada una. Arreglado. Aparte, el cambio de plasma gun de los Inquisitorial Stormtroopers tenía un typo en minúscula que rompía ese mismo conteo solo para ese ítem.",
    line16: "🩺 Inquisición — un Henchman Warband mostraba SIEMPRE el arma de cada especialista (armas digitales del Jokaero, rifle largo del Ranger, mayal del Arco-flagellant…) aunque ese especialista no estuviera en la unidad, porque su texto de equipo no usa el formato que el motor espera en el resto del juego. Un Warband con solo un Acolyte y un Exorcist ahora muestra correctamente solo lo suyo.",
    contrib: "👁️ Seis de estos llegaron directo del formulario de reporte de bugs de la app — seguid usándolo. Lo que siga pareciendo mal: unidad, engagement, arquetipo y una imagen.",
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
          {/* line16/line15/line14/line13/line12/line11/line10/line9/line8/line7/line6/line5 are
              prepend slots: a follow-up batch of fixes added after the original release leads
              with the newest slot, without renumbering anything below it. 2026-08-24: line7
              (Save-bonus engine fix), line8 (Tyranids/GK codex sync), line9 (Tyrant Guard Brood
              HQ-slot toggle), line10 (Legion/Taghmata Legacy-armory access), line11 (HH/Legio
              Titanicus armory-scope + Crusade weapon picker) and line12 (Cheat Sheets fixes +
              home-screen button) added this way. 2026-08-25: line13 (Inquisitor stale
              mandatory-HQ warning removed), line14 (archetypeArmory/authority tabs now sectioned
              + picker-aware), line15 (non-Champion Armory weapon purchase count + Stormtrooper
              plasma gun typo) and line16 (Henchman Warband weapon list not gated by which
              specialists are present) added the same way, keeping v1.65's own banner intact. */}
          {[tx.line16, tx.line15, tx.line14, tx.line13, tx.line12, tx.line11, tx.line10, tx.line9, tx.line8, tx.line7, tx.line6, tx.line5, tx.line1, tx.line2, tx.line3, tx.line4]
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
  onShowCheatSheets: () => void;
}

export function LandingPage({
  saves, announcement, canResume,
  onStart, onResume, onLoadArmy, onShowAuth, onShowCloudSaves, onShowCommunity, onShowCheatSheets,
  // onShowCampaign intentionally unused for now — the button below is disabled (alpha, not open
  // to players yet); kept in Props so App.tsx's pass-through stays valid without an extra edit
  // there when the button is re-enabled.
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
  const { loggedIn, username, avatar } = useAuth();
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
          <LanguageSelector />
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
              Wiki
            </a>

            <button
              onClick={() => loggedIn ? onShowCloudSaves?.() : onShowAuth()}
              className="btn-sweep flex items-center justify-center gap-2 py-3 px-4 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-zinc-100 text-[12px] uppercase tracking-wider transition-colors"
            >
              {loggedIn && username
                ? <Avatar username={username} avatar={avatar} size={18} />
                : <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              }
              {loggedIn ? (username ?? 'Account') : 'Login / Sign in'}
            </button>

            {loggedIn && (
              <button
                onClick={() => setShowMessages(true)}
                className="btn-sweep relative flex items-center justify-center gap-2 py-3 px-4 border border-zinc-700 hover:border-amber-700 text-zinc-300 hover:text-amber-300 text-[12px] uppercase tracking-wider transition-colors"
              >
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                Messages
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
              Glossary
            </a>

            <button
              onClick={onShowCheatSheets}
              className="btn-sweep flex items-center justify-center gap-2 py-3 px-4 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-zinc-100 text-[12px] uppercase tracking-wider transition-colors"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
              Cheat Sheets
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
              Community Armies
            </button>

            {/* Campaign (Planetary Assault) is built but not yet opened up to players — the
                button stays visible so people know it's coming, but does nothing when clicked. */}
            <button
              disabled
              title="Campaign mode is still in alpha testing"
              className="col-span-2 flex items-center justify-center gap-2 py-3 px-4 border border-zinc-800 text-zinc-600 text-[12px] uppercase tracking-wider cursor-not-allowed"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v4.083M17.91 3.5A9 9 0 0121 12a9 9 0 01-9 9m0-18a9 9 0 00-9 9m9-9c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm0 18v-4a2 2 0 012-2h2.599" /></svg>
              Campaign — Coming Soon (Alpha)
            </button>
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
            Discord
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
              <img src="/faction-symbols/horus-heresy.svg" alt="" className="relative z-10 shrink-0" style={{ width: 54, height: 54, filter: 'brightness(0) invert(1) opacity(0.75)' }} draggable={false} />
              <div className="relative z-10 flex-1 min-w-0">
                <div className="text-zinc-100 text-[13px] font-bold uppercase tracking-wide mb-0.5">Horus Heresy</div>
                <div className="text-zinc-500 text-[10px] leading-relaxed">Space Marine legions of the Age of Darkness</div>
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
              <img src="/faction-symbols/horus-heresy.svg" alt="" className="relative z-10 shrink-0" style={{ width: 54, height: 54, filter: 'brightness(0) invert(1) opacity(0.75)' }} draggable={false} />
              <div className="relative z-10 flex-1 min-w-0">
                <div className="text-zinc-100 text-[13px] font-bold uppercase tracking-wide mb-0.5">Forces of the Machine God</div>
                <div className="text-zinc-500 text-[10px] leading-relaxed">Secutarii of the Collegia Titanica</div>
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
              <img src="/faction-symbols/escalation.svg" alt="" className="relative z-10 shrink-0" style={{ width: 54, height: 54, filter: 'brightness(0) invert(1) opacity(0.75)' }} draggable={false} />
              <div className="relative z-10 flex-1 min-w-0">
                <div className="text-zinc-100 text-[13px] font-bold uppercase tracking-wide mb-0.5">Escalation</div>
                <div className="text-zinc-500 text-[10px] leading-relaxed">Super-heavy vehicles and Gargantuan Creatures</div>
                <div className="text-amber-800 group-hover:text-amber-600 text-[10px] uppercase tracking-widest mt-1.5 transition-colors">Lords of War</div>
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
              <img src="/faction-symbols/assassins.svg" alt="" className="relative z-10 shrink-0" style={{ width: 54, height: 54, filter: 'brightness(0) invert(1) opacity(0.75)' }} draggable={false} />
              <div className="relative z-10 flex-1 min-w-0">
                <div className="text-zinc-100 text-[13px] font-bold uppercase tracking-wide mb-0.5">Assassins</div>
                <div className="text-zinc-500 text-[10px] leading-relaxed">Operatives of the Officio Assassinorum</div>
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
