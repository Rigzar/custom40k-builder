import type { KnownIssue } from './changelog';

export const KNOWN_ISSUES: KnownIssue[] = [
  // ── In progress ───────────────────────────────────────────────────────────
  {
    id: 'ki-46d',
    status: 'known',
    title: {
      en: 'Space Marines — Imperial Fists Gravis armory items have a stray "`3" suffix and missing Gravis tag',
      de: 'Space Marines — Imperiale Fäuste Gravis-Rüstkammer-Items haben ein falsches „`3"-Suffix und fehlendes Gravis-Tag',
      es: 'Space Marines — ítems Gravis de la armería de los Puños Imperiales tienen un sufijo "`3" erróneo y falta la etiqueta Gravis',
    },
    description: {
      en: 'Gravis armory items in the Imperial Fists chapter armory display a stray "`3" at the end of their name (parser artefact from the source document). They also lack the Gravis keyword tag that should restrict them to Gravis models only. Reported via bug form 2026-06-02.',
      de: 'Gravis-Rüstkammer-Items in der Imperialen-Fäuste-Kapitel-Rüstkammer zeigen ein falsches „`3" am Ende ihres Namens (Parser-Artefakt aus dem Quelldokument). Außerdem fehlt das Gravis-Schlüsselwort-Tag, das sie auf Gravis-Modelle beschränken sollte. Gemeldet über das Bug-Formular am 02.06.2026.',
      es: 'Los ítems de armería Gravis en la armería del capítulo Puños Imperiales muestran un "`3" erróneo al final de su nombre (artefacto del parser del documento fuente). También les falta la etiqueta de palabra clave Gravis que debería restringirlos a modelos Gravis. Reportado mediante formulario de bugs el 02-06-2026.',
    },
  },
  {
    id: 'ki-46c',
    status: 'known',
    title: {
      en: 'Space Marines — "Bolter Drill" trait not applied to vehicles',
      de: 'Space Marines — Eigenschaft „Bolter Drill" wird nicht auf Fahrzeuge angewendet',
      es: 'Space Marines — el rasgo "Bolter Drill" no se aplica a vehículos',
    },
    description: {
      en: 'The Bolter Drill army trait should grant its bonus to vehicles equipped with bolt weapons, but the trait effect is currently only applied to non-vehicle units. Vehicles that would benefit from this trait receive no bonus. Reported via bug form 2026-06-02.',
      de: 'Der Heeresrasgo „Bolter Drill" sollte Fahrzeugen mit Bolterwaffen seinen Bonus gewähren, aber der Eigenschaftseffekt wird derzeit nur auf Nicht-Fahrzeug-Einheiten angewendet. Fahrzeuge, die von diesem Rasgo profitieren würden, erhalten keinen Bonus. Gemeldet über das Bug-Formular am 02.06.2026.',
      es: 'El rasgo de ejército Bolter Drill debería otorgar su bonificación a vehículos equipados con armas de bolter, pero el efecto del rasgo solo se aplica actualmente a unidades que no son vehículos. Los vehículos que se beneficiarían de este rasgo no reciben ninguna bonificación. Reportado mediante formulario de bugs el 02-06-2026.',
    },
  },
  {
    id: 'ki-46b',
    status: 'known',
    title: {
      en: 'Space Marines — vehicles see general armory items instead of vehicle equipment',
      de: 'Space Marines — Fahrzeuge sehen allgemeine Rüstkammer-Items statt Fahrzeugausrüstung',
      es: 'Space Marines — los vehículos ven ítems de armería general en lugar de equipamiento de vehículo',
    },
    description: {
      en: 'Vehicle units in Space Marines currently show regular (non-vehicle) armory items and do not have access to the vehicle equipment category. Expected behaviour: vehicles should only see vehicle equipment items. Reported via bug form 2026-06-02.',
      de: 'Fahrzeug-Einheiten bei den Space Marines zeigen derzeit reguläre (Nicht-Fahrzeug-)Rüstkammer-Items und haben keinen Zugang zur Fahrzeugausrüstungs-Kategorie. Erwartetes Verhalten: Fahrzeuge sollten nur Fahrzeugausrüstungs-Items sehen. Gemeldet über das Bug-Formular am 02.06.2026.',
      es: 'Las unidades de vehículo en los Space Marines actualmente muestran ítems de armería generales (no de vehículo) y no tienen acceso a la categoría de equipamiento de vehículo. Comportamiento esperado: los vehículos solo deberían ver ítems de equipamiento de vehículo. Reportado mediante formulario de bugs el 02-06-2026.',
    },
  },
  {
    id: 'ki-46a',
    status: 'known',
    title: {
      en: 'Space Marines — Wolf Companions unit not confirmed in source document',
      de: 'Space Marines — Einheit „Wolf Companions" nicht in Quelldokument bestätigt',
      es: 'Space Marines — unidad "Wolf Companions" no confirmada en el documento fuente',
    },
    description: {
      en: 'Wolf Companions appears in the Space Marines unit list (Fast Attack, 1–4 models, 6 pts each) but is absent from the rulebook source provided. It may be a valid Space Wolves unit or a parser artefact. Pending designer confirmation.',
      de: '„Wolf Companions" erscheint in der Space-Marines-Einheitenliste (Schnellstoß, 1–4 Modelle, je 6 Pkt.), fehlt aber im bereitgestellten Regelquellen-Dokument. Möglicherweise eine gültige Space-Wolves-Einheit oder ein Parser-Artefakt. Bestätigung durch den Designer ausstehend.',
      es: '"Wolf Companions" aparece en la lista de unidades de los Space Marines (Ataque rápido, 1–4 modelos, 6 pts cada uno) pero no está en el documento fuente del reglamento. Puede ser una unidad válida de los Space Wolves o un artefacto del parser. Pendiente de confirmación del diseñador.',
    },
  },
  {
    id: 'ki-22a',
    status: 'planned',
    title: {
      en: 'Trait stat and ability effects shown as text only for most factions',
      de: 'Eigenschaft-Effekte für die meisten Fraktionen nur als Text angezeigt',
      es: 'Los efectos de rasgos se muestran solo como texto para la mayoría de facciones',
    },
    description: {
      en: 'For Chaos Space Marines all 17 traits are fully wired into the engine (stat changes, ability injections, weapon bonuses all calculate live). For every other faction traits are displayed and priced correctly, but their in-game effects (e.g. +1 Strength, gaining Furious Charge) are shown as description text rather than applied automatically to the unit card. This will be rolled out faction by faction.',
      de: 'Für Chaos Space Marines sind alle 17 Eigenschaften vollständig in die Engine integriert (Statuswertänderungen, Fähigkeitsinjektionen, Waffenboni werden live berechnet). Für alle anderen Fraktionen werden Eigenschaften korrekt angezeigt und bewertet, aber ihre spielerischen Effekte (z.B. +1 Stärke, Furious Charge) werden nur als Beschreibungstext angezeigt statt automatisch auf die Einheitenkarte angewendet. Dies wird Fraktion für Fraktion umgesetzt.',
      es: 'Para los Chaos Space Marines, los 17 rasgos están totalmente integrados en el motor (cambios de características, habilidades y bonificaciones de armas se calculan en tiempo real). Para el resto de facciones, los rasgos se muestran y valoran correctamente, pero sus efectos en juego (por ejemplo, +1 a la Fuerza, obtener Ataque Furioso) aparecen solo como texto descriptivo, no se aplican automáticamente a la tarjeta de unidad. Se implementará facción por facción.',
    },
  },
  {
    id: 'ki-26a',
    status: 'planned',
    title: {
      en: 'Veteran Abilities and Vehicle Upgrades only fully supported for CSM',
      de: 'Veteranenfähigkeiten und Fahrzeug-Upgrades nur vollständig für CSM unterstützt',
      es: 'Habilidades de veterano y mejoras de vehículo solo totalmente compatibles para CSM',
    },
    description: {
      en: 'Standard Veteran Abilities (Counter-attack, Favoured enemy, Furious charge, Infiltrator, Outflank, Tank hunter, Terrain expert, Vanguard) and Vehicle Upgrades are built into the CSM armory and priced correctly. Other factions can select veteran and vehicle upgrades from their own armories, but the underlying ability logic (e.g. granting the Infiltrator rule to the unit) is not yet wired up.',
      de: 'Veteranenfähigkeiten (Gegenangriff, Begünstigter Feind, Wutangriff, Infiltrator, Flankenmanöver, Panzerjäger, Geländeexperte, Vorhut) und Fahrzeug-Upgrades sind vollständig für CSM implementiert. Andere Fraktionen können zwar Veteranen- und Fahrzeug-Upgrades aus ihren Waffenkammern auswählen, aber die zugrunde liegende Regellogik (z.B. das Verleihen der Infiltrator-Regel) ist noch nicht vollständig verdrahtet.',
      es: 'Las Habilidades de Veterano estándar (Contraataque, Enemigo favorito, Carga furiosa, Infiltrador, Flanqueo, Cazacarros, Experto en terreno, Vanguardia) y las Mejoras de Vehículo están completamente integradas en la armería CSM. Las demás facciones pueden seleccionarlas desde sus propias armerías, pero la lógica interna (por ejemplo, conceder la regla Infiltrador a la unidad) aún no está completamente programada.',
    },
  },
  {
    id: 'ki-40a',
    status: 'known',
    title: {
      en: 'Archetypes show their rules but not all restrictions are enforced',
      de: 'Archetypen zeigen ihre Regeln, aber nicht alle Einschränkungen werden durchgesetzt',
      es: 'Los arquetipos muestran sus reglas pero no todas las restricciones se aplican',
    },
    description: {
      en: 'Archetypes, Legacies and Traits are now active for all factions and their descriptions are shown. However, some archetype-specific restrictions (e.g. "all units must start inside a transport", mandatory unit compositions, keyword filters) are only enforced for Chaos Space Marines, Chaos Daemons and Space Marines. For other factions the archetype notes are informational — the builder will not currently block you from breaking them.',
      de: 'Archetypen, Vermächtnisse und Eigenschaften sind jetzt für alle Fraktionen aktiv und ihre Beschreibungen werden angezeigt. Einige archetyp-spezifische Einschränkungen (z.B. "alle Einheiten müssen in einem Transport beginnen", Pflicht-Einheitenzusammensetzungen, Schlüsselwortfilter) werden jedoch nur für Chaos Space Marines, Chaos Dämonen und Space Marines durchgesetzt. Für andere Fraktionen sind die Archetyp-Hinweise informativer Natur — der Builder blockiert aktuell keine Regelverstöße.',
      es: 'Los arquetipos, legados y rasgos están activos para todas las facciones y sus descripciones se muestran. Sin embargo, algunas restricciones específicas de arquetipo (por ejemplo, "todas las unidades deben comenzar dentro de un transporte", composiciones de unidades obligatorias, filtros de palabras clave) solo se aplican para Chaos Space Marines, Chaos Demonios y Space Marines. Para el resto de facciones, las notas de arquetipo son informativas — el constructor no bloqueará actualmente que las incumplas.',
    },
  },
  {
    id: 'ki-26b',
    status: 'fixed',
    title: 'Psychic power access rules not yet enforced per psyker',
    description: 'Fixed in v0.32 — Chaos Daemons psyker discipline access enforced per unit from ability text. CSM/other factions enforce mark-based discipline filtering (only see god discipline when matching mark is active). General factions: discipline tabs already filtered by mark and legacy.',
  },
  // ── Planned (v0.22+) ──────────────────────────────────────────────────────
  {
    id: 'ki-21a',
    status: 'planned',
    title: {
      en: 'Dark Eldar keyword archetypes (Bloodbrides, Haemoxytes, Trueborn) and trait keyword filters not yet implemented',
      de: 'Dark Eldar Schlüsselwort-Archetypen (Blutbräute, Hämoxyten, Trueborn) und Eigenschaft-Schlüsselwortfilter noch nicht implementiert',
      es: 'Arquetipos de palabras clave Dark Eldar (Novias de Sangre, Hemóxitos, Trueborn) y filtros de palabras clave de rasgos aún no implementados',
    },
    description: {
      en: 'These archetypes restrict the army to units with specific keywords (<Cult>, <Coven>, <Kabal>). Trait superscripts (ᶜᵒ, ᶜᵘ, ᴷ) mark traits that apply only to those keyword groups. The builder does not yet filter units or traits by keyword.',
      de: 'Diese Archetypen schränken die Armee auf Einheiten mit bestimmten Schlüsselwörtern (<Kult>, <Zirkel>, <Kabal>) ein. Hochgestellte Zeichen bei Eigenschaften (ᶜᵒ, ᶜᵘ, ᴷ) markieren Eigenschaften, die nur für diese Schlüsselwortgruppen gelten. Der Builder filtert Einheiten und Eigenschaften noch nicht nach Schlüsselwort.',
      es: 'Estos arquetipos restringen el ejército a unidades con palabras clave específicas (<Culto>, <Covén>, <Kabal>). Los superíndices de rasgos (ᶜᵒ, ᶜᵘ, ᴷ) marcan rasgos que solo se aplican a esos grupos de palabras clave. El constructor aún no filtra unidades ni rasgos por palabra clave.',
    },
  },
  {
    id: 'ki-21b',
    status: 'fixed',
    title: 'CSM traits should only apply to units with the "Chaos Space Marine" keyword',
    description: 'Fixed in v0.22 — CSM traits now only apply to units carrying the "Chaos Space Marine" keyword. Cultists, Chaos Spawn, World Eaters, Death Guard, Thousand Sons, and daemon engines are excluded.',
  },
  {
    id: 'ki-21c',
    status: 'planned',
    title: {
      en: 'Coordinated Raid (Dark Eldar): 3-HQ requirement with specific roles and 3 keyword-based traits not yet enforced',
      de: 'Koordinierter Überfall (Dark Eldar): 3-HQ-Anforderung und schlüsselwortbasierte Eigenschaften noch nicht durchgesetzt',
      es: 'Ataque Coordinado (Dark Eldar): requisito de 3 HQ con roles específicos y 3 rasgos por palabra clave aún sin aplicar',
    },
    description: {
      en: 'Coordinated Raid grants a 3rd HQ slot and requires one Dracon, one Haemoncolus and one Succubus. It also grants a 3rd trait, one per keyword group. These mechanics require new engine support.',
      de: 'Koordinierter Überfall gewährt einen 3. HQ-Slot und erfordert einen Dracon, einen Hämonkolus und eine Sukkubus. Es gewährt auch eine 3. Eigenschaft, eine pro Schlüsselwortgruppe. Diese Mechaniken erfordern neue Engine-Unterstützung.',
      es: 'El Ataque Coordinado concede un 3.er slot de HQ y requiere un Dracon, un Haemoncolus y una Súcubo. También concede un 3.er rasgo, uno por grupo de palabras clave. Estas mecánicas requieren nuevo soporte del motor.',
    },
  },
  {
    id: 'ki-21d',
    status: 'fixed',
    title: 'Mechanised Company: max 1 Heavy Support selection not enforced',
    description: 'Fixed in v0.22 — a validator now raises an error if more than 1 Heavy Support unit is added under the Mechanised Company archetype.',
  },
  // ── Known ─────────────────────────────────────────────────────────────────
  {
    id: 'ki-45a',
    status: 'known',
    title: {
      en: 'Trait costs not applied for Imperial Guard (and other non-CSM factions with traits)',
      de: 'Eigenschaftskosten für die Imperiale Garde (und weitere Nicht-CSM-Fraktionen) nicht angewendet',
      es: 'Costes de rasgos no aplicados en Guardia Imperial (y otras facciones no-CSM con rasgos)',
    },
    description: {
      en: 'Selecting traits for Imperial Guard units does not add any points to the unit total. Affects all non-CSM factions that have a trait system. Under investigation.',
      de: 'Das Auswählen von Eigenschaften für Imperiale Garde-Einheiten addiert keine Punkte zum Einheitentotal. Betrifft alle Nicht-CSM-Fraktionen mit einem Eigenschaftssystem. Wird untersucht.',
      es: 'Seleccionar rasgos para unidades de la Guardia Imperial no añade puntos al total de la unidad. Afecta a todas las facciones no-CSM que tienen sistema de rasgos. En investigación.',
    },
  },
  {
    id: 'ki-45b',
    status: 'known',
    title: {
      en: 'Platoon Command Squad (Imperial Guard) counts as a Troops slot',
      de: 'Zugsquadkommando (Imperiale Garde) zählt als Troops-Slot',
      es: 'El Escuadrón de Mando de Pelotón (Guardia Imperial) cuenta como slot de Tropas',
    },
    description: {
      en: 'The Platoon Command Squad occupies a Troops slot. Per the rules it should not — the full Platoon group (PCS + Infantry Squads) counts as a single slot.',
      de: 'Das Zugsquadkommando belegt einen Troops-Slot. Gemäß den Regeln sollte es das nicht — die gesamte Zuggruppe (ZSK + Infanterietrupps) zählt als ein einziger Slot.',
      es: 'El Escuadrón de Mando de Pelotón ocupa un slot de Tropas. Según las reglas no debería — todo el grupo de pelotón (EMP + Escuadrones de Infantería) cuenta como un único slot.',
    },
  },
  // ── Fixed (v0.20) ─────────────────────────────────────────────────────────
  {
    id: 'ki-20a',
    status: 'fixed',
    title: 'Space Marines armory: Gravis-compatible items showed a raw "ᴳ" character instead of a keyword badge',
    description: 'Fixed in v0.20 — items available to Gravis-armored models now show a "Gravis" keyword badge, matching the existing "Term" badge for Terminator-compatible items.',
  },
  {
    id: 'ki-20b',
    status: 'fixed',
    title: 'Adeptus Sororitas — "The Holy Trinity" legacy applied no traits and added no points',
    description: 'Fixed in v0.20 — selecting The Holy Trinity now automatically grants Raging Fervour, Rites of Fire and Unshakable Vengeance to all eligible units at a combined cost of 10 pts per non-character unit.',
  },
  // ── Fixed (v0.19) ─────────────────────────────────────────────────────────
  {
    id: 'ki-19a',
    status: 'fixed',
    title: '20+ faction rules showed name only with no description',
    description: 'Fixed in v0.19 — Supporting Fire (Tau), Dakka Dakka Dakka / Waaagh! / Mob (Orks), Battle Focus (Eldar), Acts of Faith / Shield of Faith (Sororitas), Ambush (GSC), Canticles of the Omnissiah (AdMech), Instinctive Behaviour / Synapse (Tyranids), Void Armor / Eye of the Ancestors / Steady Advance (LoV), Shield Host (Custodes), Power Through Pain / Combat Drugs (Dark Eldar), Reanimation Protocols (Necrons), and all four Chaos Marks now show their full descriptions.',
  },
  {
    id: 'ki-19b',
    status: 'fixed',
    title: 'Orks vehicles — Ramshackle table results and Shokk Attack Gun scatter table were missing',
    description: 'Fixed in v0.19 — the Ramshackle table results (Kaboom! / Kareen! / Kerrunch!) and the full Shokk Attack Gun doubles table are now shown in unit cards.',
  },
  {
    id: 'ki-19c',
    status: 'fixed',
    title: 'Students of Vaul, Interplanetary Invasors and Big Red Button vehicle traits had no points cost',
    description: 'Fixed in v0.19 — these three vehicle-only traits were showing a +0 pts cost due to a data import miss. All now correctly apply +5 pts per vehicle.',
  },
  // ── Fixed (v0.18) ─────────────────────────────────────────────────────────
  {
    id: 'ki-18a',
    status: 'fixed',
    title: 'Junk text entries appeared in ability list for several Grey Knights, Eldar and Sororitas units',
    description: 'Fixed in v0.18 — "Name:", "Range:", "Cast value:", "Effect:", "Duration:", "Complexity:", "When:", "Cost:" were showing up as fake abilities on GK vehicles (Dreadnought, Land Raiders, Razorback, Rhino, Stormraven), the Eldar Spiritseer, and the Sororitas Living Saint.',
  },
  {
    id: 'ki-18b',
    status: 'fixed',
    title: 'Equipment options missing on Blood Claws, Assault Squad, Tankbustas, Deffkoptaz, Big\'ed Bossbunka',
    description: 'Fixed in v0.18 — Jump pack for Blood Claws, jump pack removal and Heavy bolt pistol for Assault Squad, Bomb squig for Tankbustas, Big bomb for Deffkoptaz, and Big shoota for Big\'ed Bossbunka were not showing up in the unit card. All options now appear with the correct points cost.',
  },
  {
    id: 'ki-18c',
    status: 'fixed',
    title: 'Incorrect ability entries on Orks vehicles and several other factions',
    description: 'Fixed in v0.18 — minor bug fix affecting 10+ factions: various incorrect, duplicate, or corrupted ability entries were showing up in unit cards and the printed summary (e.g. date strings, dice notation, typos, placeholder text). All cleaned up.',
  },
  // ── Fixed (v0.17) ─────────────────────────────────────────────────────────
  {
    id: 'ki-17a',
    status: 'fixed',
    title: 'Armory shows CSM-only tabs (Mark, Legion, Daemon Weapons) for all factions',
    description: 'Fixed in v0.17 — Mark Armoury tab is now hidden for factions with no marks; Daemon Weapons section is hidden when the faction has none; the legacy/clan tab uses the faction\'s own key name (e.g. "Clan Armoury" for Orks instead of "Legion Armoury").',
  },
  {
    id: 'ki-17b',
    status: 'fixed',
    title: 'Grey Knights — Shrouding, They Shall Know No Fear, True Grit show no description',
    description: 'Fixed in v0.17 — these three Grey Knights special rules were stored as bare names in the unit data and had no entry in the core rules glossary. Full descriptions added.',
  },
  // ── Fixed (v0.16) ─────────────────────────────────────────────────────────
  {
    id: 'ki-16c',
    status: 'fixed',
    title: '"Jury-rigged repairs" trait not applying cost to vehicles',
    description: 'Fixed in v0.16 — the trait\'s pts_veh field was null due to a parser miss, so vehicles (including Chimera) did not receive the +5 pts cost. Fixed to 5 pts per vehicle.',
  },
  {
    id: 'ki-16a',
    status: 'fixed',
    title: 'Bullgryns equipment swap options were invisible',
    description: 'Fixed in v0.16 — the Plate shield and Grenadier gauntlet swap options now appear as numeric inputs on the Bullgryns unit card. Previously the parser produced empty choices lists, so the options were not rendered.',
  },
  {
    id: 'ki-16b',
    status: 'fixed',
    title: 'Mechanised Company — transports not counted toward 25% Troops',
    description: 'Fixed in v0.16 — when the Mechanised Company archetype is active, Dedicated Transports now contribute 50% of their points toward the 25% Troops requirement, matching the archetype rules.',
  },
  // ── Open ──────────────────────────────────────────────────────────────────
  {
    id: 'ki-1',
    status: 'fixed',
    title: 'Some units are missing from certain factions',
    description: 'Unit coverage has been verified for Chaos Space Marines — all Daemon Engines and subfaction units are now present. Other factions have been audited progressively. Report a specific missing unit with the Bug button if you find a gap.',
  },
  {
    id: 'ki-2',
    status: 'known',
    title: {
      en: 'Army data saves only in this browser',
      de: 'Armeeedaten werden nur in diesem Browser gespeichert',
      es: 'Los datos del ejército se guardan solo en este navegador',
    },
    description: {
      en: 'Armies are stored in your browser\'s local storage. Clearing browser data or switching devices will lose your saves. Use Export JSON to back up rosters. A full account/cloud system is being considered for a future update.',
      de: 'Armeen werden im lokalen Speicher deines Browsers gespeichert. Das Löschen von Browserdaten oder der Gerätewechsel führt zum Datenverlust. Nutze Export JSON, um Armeelisten zu sichern. Ein vollständiges Konto-/Cloud-System wird für eine zukünftige Aktualisierung in Betracht gezogen.',
      es: 'Los ejércitos se almacenan en el almacenamiento local del navegador. Borrar los datos del navegador o cambiar de dispositivo hará que pierdas tus guardados. Usa Exportar JSON para hacer copias de seguridad. Se está considerando un sistema completo de cuenta/nube para una actualización futura.',
    },
  },
  {
    id: 'ki-3',
    status: 'known',
    title: {
      en: 'Print layout and app not optimised for mobile or non-Chrome browsers',
      de: 'Drucklayout und App nicht für Mobilgeräte oder Nicht-Chrome-Browser optimiert',
      es: 'El diseño de impresión y la app no están optimizados para móviles ni navegadores que no sean Chrome',
    },
    description: {
      en: 'The app is currently built and tested on desktop Chrome/Edge. Mobile layout and Firefox/Safari support will be improved once the core feature set is stable.',
      de: 'Die App wird derzeit für Desktop Chrome/Edge entwickelt und getestet. Das mobile Layout und die Unterstützung für Firefox/Safari werden verbessert, sobald der Kernfunktionsumfang stabil ist.',
      es: 'La app está actualmente desarrollada y probada en Chrome/Edge de escritorio. El diseño móvil y el soporte para Firefox/Safari se mejorarán una vez que el conjunto de funciones principal sea estable.',
    },
  },
  // ── Open / Investigating ──────────────────────────────────────────────────
  {
    id: 'ki-10',
    status: 'fixed',
    title: 'Grey Knights could not select Inquisition units',
    description: 'Fixed in v0.10 — all 13 Inquisition units now appear in the Grey Knights unit catalogue under their respective slots, with [Allied] label.',
  },
  {
    id: 'ki-11',
    status: 'fixed',
    title: 'Special rule descriptions show name only — no rules text',
    description: 'Fixed in v0.12 — a Core Rules glossary now covers all standard weapon abilities (AT, Barrage, Poison, etc.) and model special rules (Fearless, Deep Strike, Daemon, etc.). Each rule in the unit abilities list now shows its full description.',
  },
  {
    id: 'ki-12',
    status: 'fixed',
    title: 'Trait costs marked with * were not calculated per Wound',
    description: 'Fixed in v0.11 — all trait costs now multiply by unit size (a 5-pt trait on 5 models = 25 pts). Traits marked with * additionally multiply by Wounds per model (e.g. "Iron Within, Iron Without" CSM: 2* = 2 × W × size).',
  },
  // ── Planned ───────────────────────────────────────────────────────────────
  {
    id: 'ki-p3',
    status: 'fixed',
    title: 'Allied detachment — add a second faction as allies in the same list',
    description: 'Implemented in v0.13 — a full Allied Detachment panel lets you pick a second faction as allies, shows their relationship (Battle Brothers / Allies of Convenience / Desperate Allies), and provides a mini force org (0–1 HQ, 1–2 Troops, 0–1 Elites/FA/HS). Allied units are validated separately from the main force org.',
  },
  {
    id: 'ki-p1',
    status: 'planned',
    title: {
      en: 'Account system & cloud army storage',
      de: 'Kontosystem & Cloud-Armeespeicher',
      es: 'Sistema de cuentas y almacenamiento de ejércitos en la nube',
    },
    description: {
      en: 'A login/account system that lets you save armies in the cloud and access them from any device. Currently being designed — no release date yet.',
      de: 'Ein Anmelde-/Kontosystem, mit dem du Armeen in der Cloud speichern und von jedem Gerät aus darauf zugreifen kannst. Wird derzeit entwickelt — noch kein Veröffentlichungsdatum.',
      es: 'Un sistema de inicio de sesión/cuenta que te permite guardar ejércitos en la nube y acceder a ellos desde cualquier dispositivo. Actualmente en diseño — sin fecha de lanzamiento.',
    },
  },
  {
    id: 'ki-p2',
    status: 'planned',
    title: {
      en: 'Escalation supplement — Lords of War',
      de: 'Eskalations-Supplement — Kriegsherren',
      es: 'Suplemento de Escalada — Señores de la Guerra',
    },
    description: {
      en: 'A new supplement adding Lords of War, super-heavy vehicles and Titans across all factions. Will introduce a dedicated slot and special engagement rules. Coming in a future update.',
      de: 'Ein neues Supplement fügt Kriegsherren, überschwere Fahrzeuge und Titanen für alle Fraktionen hinzu. Es wird einen eigenen Slot und besondere Gefechtsregeln einführen. In einem zukünftigen Update verfügbar.',
      es: 'Un nuevo suplemento que añade Señores de la Guerra, vehículos superpesados y Titanes para todas las facciones. Introducirá un slot dedicado y reglas de combate especiales. Disponible en una futura actualización.',
    },
  },
  // ── Fixed ─────────────────────────────────────────────────────────────────
  {
    id: 'ki-13',
    status: 'fixed',
    title: 'Chaos Daemons archetype dropdown showed footnote constraints as selectable entries',
    description: 'Fixed in v0.11 — the four footnote lines ("ᴷ Only for models with Mark of Khorne", etc.) that annotate mark-locked archetypes in the source data were being parsed as archetypes. They have been removed from the archetype list.',
  },
  {
    id: 'ki-f7',
    status: 'fixed',
    title: 'No visual feedback when adding an item in the Armory',
    description: 'Fixed in v0.7 — the row now flashes green and shows ✓ Added when an item is selected.',
  },
  {
    id: 'ki-f8',
    status: 'fixed',
    title: 'Unit print card showed all possible weapons, not just equipped ones',
    description: 'Fixed in v0.7 — cards now show only default equipment plus whatever optional weapons were selected.',
  },
  {
    id: 'ki-f9',
    status: 'fixed',
    title: 'Print view showed "pitched" instead of "Pitched Battle"',
    description: 'Fixed in v0.7 — Engagement Type now shows the full display name for all engagement types.',
  },
  {
    id: 'ki-f3',
    status: 'fixed',
    title: 'Pitched Battle default was 3000 pts instead of 2500',
    description: 'Fixed in v0.7 — a store migration corrects saved rosters that still had 3000 pts stored in the browser.',
  },
  {
    id: 'ki-f1',
    status: 'fixed',
    title: 'Print view showed a blank page',
    description: 'Fixed in v0.6 — the roster now opens in a new window and prints correctly.',
  },
  {
    id: 'ki-f2',
    status: 'fixed',
    title: 'Refreshing the page sent you back to the home screen',
    description: 'Fixed in v0.6 — refreshing now returns you to the builder with your faction and army intact.',
  },
  {
    id: 'ki-f4',
    status: 'fixed',
    title: 'Army name from previous faction appeared in new faction',
    description: 'Fixed in v0.6 — switching factions now clears the army name.',
  },
  {
    id: 'ki-f5',
    status: 'fixed',
    title: 'Troops slot showed "Raptors/Legionnaires" for non-CSM factions',
    description: 'Fixed in v0.6 — the label now only appears for Chaos Space Marines.',
  },
  {
    id: 'ki-f6',
    status: 'fixed',
    title: 'Daemon ability numbers (1–6) appeared as unit abilities in print',
    description: 'Fixed in v0.6 — standalone dice-result numbers are filtered out from the ability list.',
  },
];
