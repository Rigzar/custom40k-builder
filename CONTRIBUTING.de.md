# Beitragen zum Custom 40k Builder

**Andere Sprachen:** [English](CONTRIBUTING.md) · [Español](CONTRIBUTING.es.md)

Danke, dass du den Builder verbesserst. Diese Anleitung erklärt alles, was du brauchst – egal ob du Datenfehler korrigierst, Übersetzungen verbesserst, Artwork einreichst, Bugs meldest oder neuen Code schreibst.

---

## Inhaltsverzeichnis

1. [Schnellstart](#schnellstart)
2. [Fehler melden](#fehler-melden)
3. [Datenkorrekturen (kein Code nötig)](#datenkorrekturen-kein-code-nötig)
4. [Übersetzungen](#übersetzungen)
5. [Artwork beitragen](#artwork-beitragen)
6. [Code-Beiträge](#code-beiträge)
7. [Pull-Request-Checkliste](#pull-request-checkliste)

---

## Schnellstart

```bash
git clone https://github.com/Rigzar/custom40k-builder.git
cd custom40k-builder
npm install
npm run build   # muss ohne Fehler durchlaufen
```

> **`npm run dev` nicht ausführen** – nutze `npm run build`, um Fehler zu prüfen. Die App kannst du anschließend über `dist/index.html` aufrufen oder direkt unter https://custom40k-builder.vercel.app testen.

---

## Fehler melden

Nutze GitHub Issues und wähle die passende Vorlage:

- **Bug report** – etwas funktioniert falsch (falsche Punkte, Option wird nicht angezeigt, Absturz)
- **Data correction** – Werte einer Einheit stimmen nicht mit den Regeln überein

Gib dabei immer an:
- Fraktion und Einheitenname
- Was du erwartet hast und was stattdessen passiert
- Bei Datenfehlern: die Seite oder den Abschnitt im Regelwerk als Quelle

---

## Datenkorrekturen (kein Code nötig)

Das ist die wirkungsvollste Art beizutragen. Jede Fraktion liegt in einem eigenen Ordner:

```
data/parsed/<fraktion>/
  units/              <- eine .ts pro Einheit (alle 19 Fraktionen)
    troops/
      traitor_guard.ts   <- eine Einheit, exportiert als `Unit`
      index.ts           <- reexportiert alle Einheiten dieses Slots
    hq/  elites/  ...     <- ein Ordner pro Slot, je mit eigener index.ts
    index.ts          <- baut slot_to_units + units der Fraktion zusammen
  armory/
    general.json      <- allgemeine Ruestkammer (alle Modelle)
    mark_khorne.json  <- zeichenspezifische Ruestkammer (Chaos-Fraktionen)
    legion_*.json     <- Kapitel-/Legacy-Ruestkammer (eine pro Legacy)
  archetypes.json     <- Archetypen, Legacies, Traits
  animosity.json      <- Mal-Animositaets-Tabelle / Verbuendeten-Matrix (nur Fraktionen mit Malen: CSM, CD)
  psychic/            <- Disziplinen, Gebete, Daemonkin
```

> Alle 19 Fraktionen verwenden das `units/`-Layout pro Slot. Jede Einheit
> liegt in einer eigenen `.ts`-Datei unter `units/<slot>/<einheit>.ts`.
> Gegenueber `.ods` geprueft Einheiten haben einen Quell-Kommentarblock im
> Header; automatisch generierte Einheiten tragen einen `TODO`-Kommentar.

### Vorgehensweise

1. Navigiere zu `data/parsed/<fraktion>/units/<slot>/` und oeffne die passende `.ts`-Datei.
2. Das exportierte Objekt verwendet die Feldnamen der untenstehenden Tabelle. Der Kommentarblock im Kopf dokumentiert die kanonische Quelle -- halte ihn synchron, wenn du einen Wert aenderst.
3. Vergleiche die Felder mit deinem Regelwerk.
4. Korrigiere, was falsch ist, und fuehre dann `npm run build` aus.
5. Erstelle einen Pull Request.

### Zu pruefende Felder

| Feld | Was pruefen |
|---|---|
| `models[].points` | Punktekosten pro Modell |
| `models[].min` / `models[].max` | Mindest- und Hoechstanzahl an Modellen |
| `models[].stats` | M / WS / BS / S / T / W / A / Ld / Ruestung |
| `weapons[]` | Alle Waffenprofile vorhanden; korrekte S / DS / SW / Faehigkeiten |
| `option_groups[]` | Beschriftung passt zum Regelwerk; alle Optionen vorhanden; korrekte Punktekosten |
| `option_groups[].per_model` | `true` setzen wenn Header sagt "for +X points **per model**" oder "the entire squad may receive one of the following... **per model**" — gilt sowohl für Inline-Optionen (`inline_pts`) als auch für normale `choices[]`-Gruppen; ohne es wird der Preis einmalig für die ganze Einheit berechnet statt mit der Truppgröße zu skalieren |
| `option_groups[].replaces` | Den/die exakten Waffennamen angeben, die durch diesen Tausch entfernt werden. Erforderlich bei jeder Gruppe, die die alte Waffe aus der Waffentabelle entfernen soll -- ohne dieses Feld werden BEIDE Waffen angezeigt. Bei einer Waffe mit mehreren Profilen (z.B. "Taser lance - Charge" / "Taser lance - Melee") jeden Profilnamen einzeln angeben, nicht das gemeinsame Praefix -- der Abgleich erfolgt exakt, nicht gekuerzt. **Falle**: Eine Auswahl, deren Name exakt dem einer immer angezeigten Basiswaffe entspricht, blendet diese Waffe standardmaessig aus -- einer rein additiven Auswahl (die zusaetzliche Exemplare einer bereits in `equipped_with` vorhandenen Waffe gewaehrt) niemals denselben Namen wie dieser Basiswaffe geben. |
| `option_groups[].choices[].name` (mit Mengenpraefix) | **Niemals** eine Auswahl "two X" / "2 X" / "four X" usw. benennen -- die Waffentabellen-Filterung vergleicht den Namen der Auswahl exakt mit dem Waffennamen, ein Mengenpraefix passt also nie, und die Waffe wird unbedingt angezeigt, selbst wenn sie nicht gekauft wurde. Die Auswahl auf den blossen Einzahl-Waffennamen umbenennen (der Header-Text vermittelt "beide"/"zwei"/usw. bereits); der Preis bleibt unveraendert. |
| `is_character` / `is_vehicle` / `is_psyker` | Klassifizierungsflags der Einheit |
| `champion_has_armory` | Nur `true`, wenn der Champion eigenstaendig auf die Ruestkammer zugreifen kann |
| `advisor` | Nur `true` fuer Berater-Einheiten (z.B. Kommissar) |
| `abilities[]` | Faehigkeitentext vollstaendig und korrekt |
| `unit_type` | Kanonische Schreibweise der Kernregeln verwenden: `Infantry`, `Bike`, `Character Model`, `Jet Bike`, `Jump Pack Infantry`, `Monstrous Creature`, `Monstrous Infantry`, `Walker`, `Flyer`, `Vehicle` |

### Einschraenkungstypen fuer `option_groups`

| `constraint.type` | Bedeutung |
|---|---|
| `one` | 0 oder 1 Auswahl aus der Liste (haeufigster Typ) |
| `every` | Jedes Modell waehlt unabhaengig -- Kosten pro Modell |
| `per_n` | M Auswahlen pro N Modelle (`constraint.per_n` gibt N an, `constraint.count_per_n` gibt M an -- z.B. "fuer je 3 Modelle darf 1 tauschen" ist `per_n:3, count_per_n:1`) |
| `fixed_max` | Bis zu N Auswahlen insgesamt (`constraint.max` gibt N an) |
| `mark` | Auswahl des Chaos-Zeichens |
| `veteran` | Veteranen-Faehigkeitsslot |
| `unique_upgrade` | Einheitenbezogene Einzigartigkeitsbeschraenkung |

### Ruestkammer-Dateistruktur

`armory/general.json` enthaelt Waffen, Ausruestung und Daemonwaffen. Zeichenspezifische Ruestkammern (`armory/mark_khorne.json` usw.) und Kapitel-/Legacy-Ruestkammern (`armory/legion_*.json`) folgen derselben Struktur:

```json
{
  "name": "Ruestkammername",
  "weapons": [...],
  "equipment": [...],
  "daemon_weapons": []
}
```

Das Feld `armory_key` in jedem Legacy-Eintrag in `archetypes.json` **muss** mit dem Schluessel in `src/data/loaders.ts` fuer das `armory_legions`-Objekt dieser Fraktion uebereinstimmen -- wenn sie abweichen, wird der Legacy-Ruestkammer-Tab nicht angezeigt.

---

## Übersetzungen

Die App unterstützt drei Sprachen: **Englisch (EN)**, **Deutsch (DE)** und **Spanisch (ES)**. Übersetzbare Texte befinden sich an zwei verschiedenen Orten – lies beide Abschnitte, bevor du anfängst.

### 1. UI-Texte — `src/i18n/index.ts`

Alle Beschriftungen, Schaltflächentexte und Abschnittsüberschriften befinden sich hier. Jeder Eintrag ist ein Objekt mit den Schlüsseln `en`, `de` und `es`:

```ts
appTitle: {
  en: 'Custom 40k Army Builder',
  de: 'Custom 40k Armeeliste',
  es: 'Creador de Ejércitos Custom 40k',
},
```

**Nicht übersetzte Texte finden:**
Suche nach Einträgen, bei denen der `de`-Wert identisch mit dem `en`-Wert ist – das sind maschinell übersetzte oder fehlende Einträge. Korrekturen durch Muttersprachler sind immer willkommen.

**UI-Übersetzung hinzufügen oder korrigieren:**
1. Öffne `src/i18n/index.ts`.
2. Finde den Text (suche nach dem englischen Begriff).
3. Bearbeite den `de`-Wert.
4. Führe `npm run build` aus – die Datei ist TypeScript, ein Tippfehler führt zu einem Build-Fehler.
5. Erstelle einen Pull Request. Du musst nicht alle Texte auf einmal übersetzen – Teilverbesserungen sind willkommen.

> **Deutsche Terminologie:** offizielle Games-Workshop-Terminologie verwenden, keine wörtlichen Übersetzungen. Slot-Namen: `Standard` (Troops), `Elite` (Elites), `Sturm` (Fast Attack), `Unterstützung` (Heavy Support). Stat-Abkürzungen: `Reichw.` (Range), `DS` (AP), `SW` (Damage). Rüstkammer, nicht Waffenkammer.

### 2. Regelbeschreibungen — Engine-Dateien und Daten

Regeltexte in der Engine (Trait-Beschreibungen, Archetyp-Hinweise, Fähigkeitsbeschreibungen) sind derzeit **nur auf Englisch**. Sie werden als einfache Strings in TypeScript-Engine-Dateien und in `src/data/changelog.ts` / `src/data/known-issues.ts` gespeichert.

**Wie das kanonische Kommentar-Muster beim Übersetzen hilft:**
Jede Engine-Datei (Archetypen, Traits, Legacies) hat den Originalregeltext als Kommentar direkt über dem Code, der ihn implementiert:

```ts
// QUELLE: CSM Heeresanpassung — Traits
// Blood Feud: Wenn die Einheit einen Angriffs-Befehl nutzt oder angegriffen wird,
// erhält sie bis zum Ende der aktuellen Schlachtrunde +1 auf Nahkampf-Trefferproben.
// KOSTEN: 5 normal · 0 Charakter · 5 Kreatur/Fahrzeug
'Blood Feud': [
  { type: 'unit_ability', name: 'Blood Feud', desc: '...', applies_to: 'all' },
],
```

Der Kommentar gibt dir genau den englischen Ausgangstext, den du übersetzen musst – ohne die HTML-Quelldateien öffnen zu müssen.

**Regelbeschreibung übersetzen — ein Feld mehrsprachig machen:**

Regel-`desc`-Felder sind derzeit einfache englische Strings. Um ein Feld mehrsprachig zu machen, ändere den Typ von `string` auf `I18nString` (definiert in `src/data/changelog.ts`):

```ts
// Vorher — nur Englisch:
desc: 'The unit gains +1 to melee hit rolls when charging or charged.',

// Nachher — drei Sprachen:
desc: {
  en: 'The unit gains +1 to melee hit rolls when charging or charged.',
  de: 'Die Einheit erhält +1 auf Nahkampf-Trefferproben, wenn sie angreift oder angegriffen wird.',
  es: 'La unidad gana +1 a las tiradas de golpe en cuerpo a cuerpo al cargar o ser cargada.',
},
```

Der `useT()`-Hook in der UI löst `I18nString` automatisch zur aktiven Sprache auf – keine UI-Änderungen notwendig, nur die Datenänderung. Sobald du den Typ änderst, zeigt TypeScript alle Stellen an, die das Feld lesen, damit du keine vergisst.

**Schritte zur Konvertierung eines desc-Feldes:**
1. Ändere den Typ des Feldes in `types/data.ts` oder der entsprechenden Schnittstelle von `string` auf `I18nString` (importieren aus `'../data/changelog'`).
2. Aktualisiere den Wert in der Engine-Datei auf die Objektform `{ en, de, es }`.
3. Führe `npm run build` aus – TypeScript markiert alle verbleibenden Plain-String-Verwendungen dieses Feldes, damit du keine übersiehst.
4. Wenn du zunächst nur eine englische Übersetzung hast, kannst du denselben Text als Platzhalter für alle drei verwenden: `{ en: '...', de: '...', es: '...' }` – ein Muttersprachler kann DE/ES später verbessern.

**Changelog und Known Issues** (`src/data/changelog.ts`, `src/data/known-issues.ts`) verwenden bereits `I18nString` – Einträge haben `en`-, `de`- und `es`-Schlüssel. Wenn du einen Changelog-Eintrag hinzufügst, fülle alle drei Sprachen aus.

### Hinweise zu Übersetzungs-PRs

- Für PRs, die nur `i18n/index.ts` betreffen, musst du die vollständige Entwicklungsumgebung nicht einrichten. Bearbeite einfach die Datei und stelle sicher, dass der Build durchläuft.
- Wenn du dir bei einer Übersetzung unsicher bist, hinterlasse einen Hinweis in der PR-Beschreibung.
- Maschinelle Übersetzungen sind als Ausgangspunkt akzeptabel; Muttersprachler-Reviews werden bevorzugt.

---

## Artwork beitragen

Die App zeigt in der Druckansicht ein fraktionsspezifisches Hintergrundbild an. Jedes Bild ist eine PNG-Datei im Verzeichnis `src/assets/`.

### Was gebraucht wird

Die folgenden Fraktionen verwenden aktuell ein geteiltes oder allgemeines Hintergrundbild:

| Fraktion | Aktuelles Bild |
|---|---|
| Space Marines | geteilt (Imperium) |
| Grey Knights | geteilt (Imperium) |
| Inquisition | geteilt (Imperium) |
| Assassins | geteilt (Imperium) |
| Eldar | allgemeines Fallback |
| Dark Eldar | allgemeines Fallback |
| Harlequins | allgemeines Fallback |
| Leagues of Votann | allgemeines Fallback |

### Anforderungen

- **Format:** PNG
- **Mindestgröße:** 1600 × 900 px (das Bild wird als Vollbreiten-Hintergrund verwendet)
- **Stil:** dunkel, atmosphärisch, passend für Warhammer 40k
- **Urheberrecht:** Nur Fan-Art und Originalkunstwerke. Keine Scans oder Fotos offizieller Games-Workshop-Artworks. Das Bild muss dein eigenes Werk sein oder unter einer Creative-Commons-Lizenz stehen, die mit CC BY-NC-SA 4.0 kompatibel ist.

### Namenskonvention

Benenne deine Datei `<fraktionsschlüssel>Background.png` gemäß dem camelCase-Fraktionsschlüssel aus dem Code. Beispiele: `eldarBackground.png`, `darkEldarBackground.png`, `harlequinsBackground.png`.

### Neues Hintergrundbild registrieren

1. PNG-Datei zu `src/assets/` hinzufügen.
2. `src/components/PrintView.tsx` öffnen.
3. Das Bild oben in der Datei importieren (nach dem Muster der vorhandenen Importe).
4. Einen Eintrag im `FACTION_BG`-Objekt hinzufügen, der den Fraktionsnamen dem importierten Bild zuordnet.
5. `npm run build` ausführen und prüfen, ob das Bild korrekt geladen wird.

### Artwork einreichen

Erstelle einen Pull Request mit der PNG-Datei und der Änderung an `PrintView.tsx`. Füge einen Hinweis auf die Quelle oder Urheberschaft des Bildes hinzu, damit die CC-Kompatibilität geprüft werden kann.

---

## Code-Beiträge

### Architekturüberblick

```
src/engine/     Spiellogik – hier für Regeln, Punkte und Validierung
src/components/ UI – hier für visuelle Änderungen
src/store/      Zustand-Zustand – Armeelisten-CRUD und Auswahlen
src/types/      TypeScript-Typen – Unit, Weapon, RosterEntry usw.
src/data/       Statische Daten – Changelog, Fraktionsmetadaten
src/i18n/       Übersetzungstexte (EN / DE / ES)
```

### Engine-Dateien

| Datei | Zuständigkeit |
|---|---|
| `points.ts` | Punkteberechnung – Grundkosten + Optionen + Eigenschaften + Rüstkammer |
| `resolver.ts` | Einheitenprofil-Auflösung – wendet Zeichen, Varianten und Archetypen an, dispatcht an `FACTION_RESOLVERS` |
| `validators.ts` | Armeevalidierung – Slot-Limits, Archetypen-Einschränkungen, Engagement-Limits |
| `archetypes/base.ts` | `ArchetypeRule`-Form (jedes Flag, das ein Archetyp setzen kann) + der `BASE`-Standard |
| `archetypes/index.ts` | `ARCHETYPE_RULES` – jeder Archetyp jeder Fraktion, nach Namen indiziert |
| `legacies.ts` | `getLegacyStructuredNotes(faction, name)` / `getLegacyExtraPower(faction, name)` – fraktionsübergreifender Dispatcher, der das `codex_<fraktion>/legacies.ts` jeder Fraktion liest |
| `codex_<fraktion>/` | Fraktionsspezifisches Engine-Modul (eines pro Fraktion) – hier lebt der gesamte Engine-Code dieser Fraktion: `legacies.ts`, `traits.ts`, `resolver.ts`, `validator.ts`, `archetypes/{index.ts,rules.ts}` (falls benötigt), plus die Referenzkataloge `keywords.ts`, `slots.ts`, `unit-types.ts`, `special-abilities.ts`, `weapon-abilities.ts` und eine `digest.md`-Audit-Referenz |
| `equipMods.ts` | Parst Ausrüstungsstatmodifikatoren (z. B. „+1 S") |
| `keywords.ts` | Schlüsselwort-Ableitungsschicht für die Wargear-Freischaltung — leitet an einer Stelle die Chaos-Mal-Anforderungen (`itemRequiredMark`), die Terminator-Rüstungskompatibilität (`modelRestrictsToTermSubset`), die Gravis-Kompatibilität (`modelRestrictsToGravisSubset`) und die Inquisition-Ordo/Legacy-Freischalt-Helfer (`inquisitionLegacyOrdoUnlocks`, `chamberMilitantOrdo`) ab. Hier bearbeiten (nicht in `ArmoryModal`), wenn sich ändert, wie die Rüstungs-/Mal-/Ordo-Freischaltung abgeleitet wird. **Glyphen-Konvention:** `ᵀ` = Terminator-kompatibel (NICHT Mal des Tzeentch); die Mal-Glyphen sind nur `ᴷ`/`ᴺ`/`ˢ` (Khorne/Nurgle/Slaanesh) — Tzeentch ist sektionsbasiert (`armory_marks.Tzeentch`), und `ᶻ` ist reserviert, falls je ein Glyph nötig wird. **Wenn Arbeit die Tzeentch-vs-Terminator-Unterscheidung berührt, frage den Maintainer — nicht annehmen.** |

### Wann die Legacy-Dateien bearbeitet werden müssen

`legacies.ts` (oberste Ebene) ist ein dünner fraktionsübergreifender Dispatcher – er steuert, **welche Disziplinen und Gebete das Psionik-Modal anzeigt**, abhängig vom aktiven Legacy, und welche Extra-Kraft ein Legacy immer gewährt. Die eigenen Legacy-Daten jeder Fraktion (Rüstkammer-Zugriff, Markierungsbeschränkungen, Disziplin-/Gebets-Maps) leben in ihrer `codex_<fraktion>/legacies.ts`, gelesen über den Dispatcher.

- **`codex_space_marines/legacies.ts`** – Diese Datei bearbeiten, wenn:
  - Eine neue SM-Legacy-Disziplin hinzugefügt wird, die gesperrt sein soll (in `SM_LEGACY_DISC_MAP` eintragen: Disziplinname → erforderlicher Legacy-Name).
  - Ein neues Gebet hinzugefügt wird, das nur mit dem Legacy of the Crusader erscheinen soll (zu `SM_CRUSADER_PRAYERS` hinzufügen).
  - Ein bestehendes SM-Legacy oder eine Disziplin umbenannt wird.
- **`codex_grey_knights/legacies.ts`** – Diese Datei bearbeiten, wenn sich ändert, welche Kraft ein Legacy GK-Psykern immer gewährt (`getGKLegacyPower`).
- **`codex_<fraktion>/legacies.ts`** – Diese Datei bearbeiten für Legacy-Rüstkammer-Zugriffsregeln oder Markierungsbeschränkungen einer Fraktion (z. B. `CSM_LEGACY_NOTES` in `codex_csm/legacies.ts`).

Wenn eine neue Fraktion mit Legacy-gesperrten Disziplinen hinzugefügt wird, eine Datei `codex_<fraktion>/legacies.ts` nach demselben Muster erstellen, in `PsychicModal.tsx` einbinden, und – falls auch eine strukturierte Notiz angezeigt werden soll – in der `FACTION_LEGACY_NOTES`-Map von `legacies.ts` (oberste Ebene) registrieren.

### Datenstruktur (fraktionseigene Ordner)

Fraktionsdaten liegen in `data/parsed/<fraktion>/` -- ein Ordner pro Fraktion. Inhalt: `units/` (Struktur siehe oben), `armory/general.json`, `armory/mark_*.json`, `armory/legion_*.json`, `psychic/`, `archetypes.json`, `animosity.json` (nur CSM/CD). Supplemente in `_supplements/`, Parser-Audit-Dateien in `_scratch/` (werden nie von der App geladen).

Der Loader, der jede `FactionData` zusammensetzt, ist **`src/data/loaders.ts`** -- er importiert die Einzeldateien mit statischen Pfaden (von Vite gefordert) und fuegt sie zusammen. Das Engine erhalt dasselbe Objekt wie vorher; nur die Dateiorganisation hat sich geandert.

**Neue Fraktion hinzufuegen:** Ordner + Dateien erstellen → `case` in `loaders.ts` hinzufuegen → zu `FACTION_LOADERS` hinzufuegen → in `LandingPage.tsx` registrieren und Abkuerzung/Kategorie in `FactionSymbol.tsx` eintragen → (optional) `engine/factions/<fraktion>/` fuer eigene Resolver/Traits/Validatoren.

### Wo anfangen / wie helfen

- **`OPEN_QUESTIONS.md`** (Repo-Wurzel) listet, wo das Projekt Hilfe braucht: **Regelfragen** (eine
  mehrdeutige Regel, die eine kanonische Antwort braucht, bevor sie programmiert werden kann — du
  musst nicht coden, um zu helfen) und **Code-Probleme** (Engine-/UI-Bugs, die ein Entwickler beheben kann).
- Öffne ein GitHub-Issue mit der passenden Vorlage — **Rules question**, **Code issue**, **Data
  correction** oder **Bug report** (`.github/ISSUE_TEMPLATE/`). Eine Regelfrage zu beantworten gibt
  die Umsetzung frei; der Maintainer baut sie ein.
- Das In-App-**Known-Issues**-Panel (`src/data/known-issues.ts`) ist der nutzerseitige Tracker; es
  überschneidet sich mit `OPEN_QUESTIONS.md` bei den Code-Problemen, aber Letzteres enthält zusätzlich
  die unbeantworteten Regelfragen.

### Strukturierte Regel-Effekte & Kosten-Primitive (hinzugefügt v0.51–v0.52)

Manche Regeln lassen sich nicht allein über den Beschreibungstext ausdrücken — sie brauchen strukturierte Felder, die die Engine liest. **Achte beim Wählen des Feldes auf das VERB des Datenblatts.**

- **`OptionEffect`** (`types/data.ts`) — getragen von einem `Choice`, einer `OptionGroup` **oder einem `ArmoryItem`** (`item.effect`). Felder:
  - `stat_mod: [{ stat, delta }]` — z.B. `+6" M` durch ein Sprungmodul.
  - `adds_unit_types: string[]` — **additiver** Typgewinn. Verb "**gains** the unit type X". Das Modell behält seine vorhandenen Typen.
  - `set_unit_type: string` — **Ersetzung** der ganzen Typzeile. Verb "**change** unit type **to** X".
  - `grants_abilities: string[]` — gewährte Sonderregeln (nur was das Datenblatt nennt).
  - Effekte werden in `resolver.ts` (`applyEffect`) angewendet und **gegen das Basisprofil des Modells dedupliziert** — ein bereits vorhandener Typ/eine Fähigkeit wird nie erneut hinzugefügt. Stats und Fähigkeiten in Anführungszeichen eines Armory-Gegenstands kommen weiterhin aus `equipMods` (Beschreibungs-Parsing); `item.effect` trägt nur die Typänderung.
  - **Typ und Fähigkeit sind nicht dasselbe.** `"Jump Pack Infantry"` ist ein Einheiten-TYP (gibt Deep Strike); `"Jump pack"` ist eine FÄHIGKEIT (nicht). Modelliere, was das Datenblatt wörtlich sagt.
- **`OptionGroup.per_model`** — auf `true` setzen bei einer Inline-Option ODER einer normalen `choices[]`-Gruppe, deren Datenblatt "for +X points **per model**" sagt (oder "...receive one of the following upgrades **per model**"). Die Punkte-Engine berechnet dann `inline_pts × Einheitengröße` (inline) bzw. `choice.points × qty × Einheitengröße` (choices) statt einmalig für die ganze Einheit. Flache Einmal-Inline-Optionen (einen Sergeant befördern) und "every model may swap X"-Gruppen (deren `qty` schon der gewählten Anzahl entspricht) lassen es ungesetzt.
- **`equipMods.ts`** — parst `+Stat`, Rettungswürfe und Fähigkeiten in Anführungszeichen aus dem `desc` eines Armory-Gegenstands. Es überspringt zitierte Einheitentyp-Wörter (die das Typsystem behandelt) und dedupliziert gewährte Fähigkeiten gegen die Basis-Fähigkeiten der Einheit.
- **Skirmish-Ausrüstungs-Caps** liegen in `validators.ts` (im `eng.statCaps`-Block). Sie setzen die Beschränkungen des Missions-Supplements durch: kein Erlangen eines 2+ Rüstungswurfs, 4+ oder besseren Rettungswurfs, T8+, einer Schaden-3-Waffe oder mehr als eines Unique-Armory-Gegenstands — alles fundiert in `Informacion/missions_text.txt` und `core_rules_text.txt`. Neue Caps hier hinzufügen, nicht in der UI.

> **Kodierung (Mojibake):** Beim manuellen Bearbeiten von JSON oder TS die Dateien UTF-8 halten. Verstümmelte Sequenzen wie `â€"` (sollte `—` sein) schleichen sich beim Kopieren ein; `scripts/_scan_mojibake.cjs` erkennt sie. Nicht aus Rich-Text-Editoren einfügen.

### Changelog vs. Known Issues (wichtig – seit v0.47 getrennt)

Diese beiden Dateien haben unterschiedliche Zwecke und dürfen nicht verwechselt werden:

| Datei | Was hier hineingehört |
|---|---|
| `src/data/changelog.ts` | Versionshistorie – ein Eintrag pro Release mit Änderungsbeschreibungen auf EN/DE/ES |
| `src/data/known-issues.ts` | Bug- und Einschränkungs-Tracking – Status kann `known`, `investigating`, `fixed`, `by_design` oder `planned` sein |

**Vor v0.47** lagen beide in `changelog.ts`. Sie sind jetzt getrennt. Wenn ein bekannter Bug behoben wird:
1. `src/data/known-issues.ts` öffnen, das Issue anhand seiner `id` finden und `status: 'fixed'` setzen.
2. Eine Zeile in den aktuellen Versions-Eintrag in `src/data/changelog.ts` einfügen, die den Fix beschreibt.

**Nicht** `changelog.ts` bearbeiten, um Issue-Status zu aktualisieren – die Datei enthält `KNOWN_ISSUES` nicht mehr.

### TypeScript-Konventionen

- Kein `any` – die Typen aus `src/types/` verwenden
- Null TypeScript-Fehler erforderlich – `npm run build` muss durchlaufen
- Schmale Typen gegenüber breiten bevorzugen; bei wiederkehrenden Strukturen zu `src/types/` hinzufügen
- Keine neuen Abhängigkeiten ohne vorherige Diskussion in einem Issue

### Fehlende Datei zu einer bestehenden Fraktion hinzufügen

Viele Fraktionen haben noch leere oder fehlende Dateien. Wenn du Daten für eine Fraktion ergänzen möchtest – z. B. ihre psychischen Disziplinen, eine Legacy-Rüstkammer oder ihre Archetypen – verwende die untenstehenden Templates. Führe nach dem Erstellen oder Bearbeiten einer Datei `npm run build` aus, um die JSON-Gültigkeit zu bestätigen.

**`archetypes.json`** — Archetypen, Legacies und Traits der Fraktion:
```json
{
  "archetypes": [
    {
      "name": "Name des Archetyps",
      "desc": "Vollständiger Regeltext aus dem Heeresanpassungs-Blatt, genau wie geschrieben."
    }
  ],
  "legacies": [
    {
      "name": "Name des Legacy",
      "desc": "Vollständiger Regeltext."
    }
  ],
  "traits": [
    {
      "name": "Name des Traits",
      "desc": "Vollständiger Regeltext.",
      "pts_unit": "5",
      "pts_char": "0",
      "pts_monster": "5",
      "pts_veh": "5"
    }
  ]
}
```
> Kostenspalten: `pts_unit` = normale Modelle, `pts_char` = Charaktermodelle, `pts_monster` / `pts_veh` = Monströse Kreaturen & Fahrzeuge (gemeinsame Spalte). `"-"` für nicht verfügbar, `"5*"` für Kosten pro Wunde/Rumpfpunkt.

**`animosity.json`** — Mal-Animositäts-Tabelle / Verbündeten-Kompatibilitätsmatrix (nur Fraktionen mit Malen: CSM, CD):
```json
{
  "animosity": {},
  "allied": {}
}
```

**`armory/legion_<name>.json`** — Kapitel-, Legacy- oder Sept-Rüstkammer:
```json
{
  "name": "Legacy of the Example",
  "weapons": [],
  "equipment": [],
  "daemon_weapons": []
}
```
Registriere die Datei anschließend in `src/data/loaders.ts` – finde den `case` der Fraktion und füge den neuen Import und Schlüssel im `legions`-Objekt hinzu, das an `asm()` übergeben wird.

**`armory/mark_<gott>.json`** — Mal-spezifische Rüstkammer (nur Chaos-Fraktionen):
```json
{
  "name": "Rüstkammer Mal des Khorne",
  "weapons": [],
  "equipment": [],
  "daemon_weapons": []
}
```
In `loaders.ts` unter dem `marks`-Objekt der Fraktion registrieren.

**`psychic/disciplines.json`** — Psychische Disziplinen:
```json
[]
```

**`psychic/prayers.json`** — Gebete / Beschwörungen:
```json
[]
```

**`psychic/daemonkin.json`** — Daemonkin-Tabelle im Spiel (Chaos-Fraktionen):
```json
{}
```

> **Nach dem Hinzufügen einer Datei:** öffne `src/data/loaders.ts`, finde den `case` der Fraktion und stelle sicher, dass die neue Datei importiert und an `asm()` übergeben wird. Dateien, die nie vom Loader importiert werden, werden nie von der App geladen – die Datei allein reicht nicht.

### Regelmodell-Digests (`src/data/rules-model/<faction>.md`)

Jede geprüfte Fraktion hat ein Markdown-Digest in `src/data/rules-model/` (Vorlage:
`_TEMPLATE.md`). Es hält das Keyword-Vokabular der Fraktion, die Wargear-Gating-Regeln, das
Punktemodell, die Option-Semantik je Datasheet-Slot sowie eine Engine-Lückenprüfung fest — alles
gegen das kanonische Quell-HTML und die Produktions-JSON validiert. Es sind Referenzdokumente für
Mitwirkende und die Engine — die App lädt sie nicht. Wenn du die Daten einer Fraktion prüfst oder
korrigierst, aktualisiere ihr Digest, damit es synchron bleibt.
Fraktionsübergreifende Supplements nutzen denselben Ordner und dieselbe Namensgebung
(z. B. `escalation.md` für das Escalation- / Lords-of-War-Supplement).

### Übersetzungen

Wenn du einen neuen UI-Text hinzufügst, füge Einträge für alle drei Sprachen (EN / DE / ES) in `src/i18n/index.ts` hinzu. Maschinelle Übersetzungen sind für ES und DE akzeptabel; Muttersprachler-Review ist willkommen.

> **Deutsche Übersetzungen:** offizielle Games-Workshop-Terminologie verwenden, keine wörtlichen Übersetzungen. Slot-Namen folgen der GW-Konvention: `Standard` (Troops), `Elite` (Elites), `Sturm` (Fast Attack), `Unterstützung` (Heavy Support). Stat-Abkürzungen: `Reichw.` (Reichweite), `DS` (Durchschlag), `SW` (Schadenswert). Rüstkammer heißt `Rüstkammer`, nicht `Waffenkammer`.

---

## Pull-Request-Checkliste

Vor dem Erstellen eines PR sicherstellen:

- [ ] `npm run build` läuft ohne TypeScript-Fehler durch
- [ ] Die Änderung ist auf eine Sache beschränkt (eine Einheit, ein Bug, ein Feature)
- [ ] Neue UI-Texte haben Übersetzungen in allen drei Sprachen
- [ ] Wenn ein bekanntes Problem behoben wurde, ist der `status` in `src/data/known-issues.ts` auf `'fixed'` gesetzt
- [ ] Die PR-Beschreibung erklärt, was und warum geändert wurde (ein Link zum jeweiligen Issue reicht)

PRs, die den Build-Check nicht bestehen, werden erst nach der Behebung überprüft.

---

## Lizenz

Mit deinem Beitrag stimmst du zu, dass deine Änderungen unter der gleichen Lizenz [CC BY-NC-SA 4.0](LICENSE) wie der Rest des Projekts veröffentlicht werden.
