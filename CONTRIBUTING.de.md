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

Das ist die wirkungsvollste Art beizutragen. Jede Fraktion liegt in einer einzigen JSON-Datei:

```
data/parsed/<fraktion>.json
```

### Vorgehensweise

1. Öffne die JSON-Datei deiner Fraktion in einem Texteditor.
2. Finde die Einheit – sie ist ein Schlüssel im Objekt `"units": { ... }`.
3. Vergleiche die Felder mit deinem Regelwerk.
4. Korrigiere, was falsch ist, und führe dann `npm run build` aus, um sicherzustellen, dass die JSON-Datei gültig ist und die App noch kompiliert.
5. Erstelle einen Pull Request.

### Zu prüfende Felder

| Feld | Was prüfen |
|---|---|
| `models[].points` | Punktekosten pro Modell |
| `models[].min` / `models[].max` | Mindest- und Höchstanzahl an Modellen |
| `models[].stats` | M / WS / BS / S / T / W / A / Ld / Rüstung |
| `weapons[]` | Alle Waffenprofile vorhanden; korrekte S / DS / S / Fähigkeiten |
| `option_groups[]` | Beschriftung passt zum Regelwerk; alle Optionen vorhanden; korrekte Punktekosten |
| `is_character` / `is_vehicle` / `is_psyker` | Klassifizierungsflags der Einheit |
| `champion_has_armory` | Nur `true`, wenn der Champion (Unteroffizier) eigenständig auf die Rüstkammer zugreifen kann |
| `advisor` | Nur `true` für Berater-Einheiten (z. B. Kommissar) |
| `abilities[]` | Fähigkeitentext vollständig und korrekt |

### Einschränkungstypen für `option_groups`

| `constraint.type` | Bedeutung |
|---|---|
| `one` | 0 oder 1 Auswahl aus der Liste (häufigster Typ) |
| `every` | Jedes Modell wählt unabhängig – Kosten pro Modell |
| `per_n` | Eine Auswahl pro N Modelle (`constraint.n` gibt N an) |
| `fixed_max` | Bis zu N Auswahlen insgesamt (`constraint.max` gibt N an) |
| `mark` | Auswahl des Chaos-Zeichens |
| `veteran` | Veteranen-Fähigkeitsslot |
| `unique_upgrade` | Einheitenbezogene Einzigartigkeitsbeschränkung |

### Rüstkammer-Felder

Die allgemeine Rüstkammer (Waffen, Ausrüstung, Dämonenwaffen für alle berechtigten Einheiten der Fraktion) liegt auf der obersten Ebene der Fraktions-JSON:

```json
"armory_general": {
  "weapons": [...],
  "equipment": [...],
  "daemon_weapons": []
}
```

Fraktionsspezifische Rüstkammern (z. B. zeichengebundene Gegenstände für CSM) können als `armory_marks`, `armory_vehicles` usw. erscheinen.

---

## Übersetzungen

Die App unterstützt drei Sprachen: **Englisch (EN)**, **Deutsch (DE)** und **Spanisch (ES)**. Alle UI-Texte befinden sich in einer einzigen Datei:

```
src/i18n/index.ts
```

Jeder Text ist ein Objekt mit den Schlüsseln `en`, `de` und `es`:

```ts
appTitle: {
  en: 'Custom 40k Army Builder',
  de: 'Custom 40k Armeeliste',
  es: 'Creador de Ejércitos Custom 40k',
},
```

### Nicht übersetzte Texte finden

Suche nach Texten, bei denen der `de`-Wert identisch mit dem `en`-Wert ist – das sind maschinell übersetzte oder noch fehlende Einträge. Korrekturen durch Muttersprachler sind immer willkommen.

### Übersetzung hinzufügen oder korrigieren

1. Öffne `src/i18n/index.ts`.
2. Finde den Text (suche nach dem englischen Begriff).
3. Bearbeite den `de`-Wert.
4. Führe `npm run build` aus – die Datei ist TypeScript, ein Tippfehler führt zu einem Build-Fehler.
5. Erstelle einen Pull Request. Du musst nicht alle Texte auf einmal übersetzen – Teilverbesserungen sind willkommen.

### Hinweise zu Übersetzungs-PRs

- Für reine Übersetzungs-PRs musst du die vollständige Entwicklungsumgebung nicht einrichten. Bearbeite einfach die Datei und stelle sicher, dass der Build durchläuft.
- Wenn du dir bei einer Übersetzung unsicher bist, hinterlasse einen Hinweis in der PR-Beschreibung.
- Maschinelle Übersetzungen sind als Ausgangspunkt akzeptabel, aber Muttersprachlerkorrekturen werden bevorzugt.

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
| `resolver.ts` | Einheitenprofil-Auflösung – wendet Zeichen, Varianten und Archetypen an |
| `validators.ts` | Armeevalidierung – Slot-Limits, Archetypen-Einschränkungen, Engagement-Limits |
| `archetypes.ts` | Archetypen-Regeln und -Durchsetzung |
| `archetypes/csm.ts` | CSM-Archetypen-Definitionen (Engine-Flags) |
| `archetypes/rules/csm-rules.ts` | CSM-Archetypen-Regeldaten (13 Archetypen mit kategorisierten Notizen für den Engine-Einsatz) |
| `legacies/csm-legacies.ts` | CSM-Legacy-Regeldaten (5 Legacies – Rüstkammer-Zugang + Markierungsbeschränkungen) |
| `legacies/sm-legacies.ts` | SM-Legacy-Regeldaten – Disziplin-Gate-Map und Kreuzritter-Gebete-Set |
| `legacies/index.ts` | `getLegacyStructuredNotes(faction, name)` – Dispatcher für Legacy-Regel-Abfragen |
| `equipMods.ts` | Parst Ausrüstungsstatmodifikatoren (z. B. „+1 S") |
| `keywords.ts` | Schlüsselwort-Ableitungsschicht für die Wargear-Freischaltung — leitet an einer Stelle die Chaos-Mal-Anforderungen (`itemRequiredMark`) und die Terminator-Rüstungskompatibilität (`modelRestrictsToTermSubset`) ab. Hier bearbeiten (nicht in `ArmoryModal`), wenn sich ändert, wie die Rüstungs-/Mal-Freischaltung abgeleitet wird; die geplante fraktionsweise Schlüsselwort-Migration ändert die Interna dieses Moduls. |

### Wann die Legacy-Dateien bearbeitet werden müssen

Der Ordner `legacies/` enthält Engine-Regeln, die nicht im JSON leben können – sie steuern, **welche Disziplinen und Gebete das Psionik-Modal anzeigt**, abhängig vom aktiven Legacy.

- **`legacies/sm-legacies.ts`** – Diese Datei bearbeiten, wenn:
  - Eine neue SM-Legacy-Disziplin hinzugefügt wird, die gesperrt sein soll (in `SM_LEGACY_DISC_MAP` eintragen: Disziplinname → erforderlicher Legacy-Name).
  - Ein neues Gebet hinzugefügt wird, das nur mit dem Legacy of the Crusader erscheinen soll (zu `SM_CRUSADER_PRAYERS` hinzufügen).
  - Ein bestehendes SM-Legacy oder eine Disziplin umbenannt wird.
- **`legacies/csm-legacies.ts`** – Diese Datei bearbeiten, wenn CSM-Legacy-Rüstkammer-Zugriffsregeln oder Markierungsbeschränkungen hinzugefügt oder geändert werden.

Wenn eine neue Fraktion mit Legacy-gesperrten Disziplinen hinzugefügt wird, eine neue Datei `legacies/<fraktion>.ts` nach demselben Muster erstellen und in `PsychicModal.tsx` einbinden.

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

### Neue Fraktion hinzufügen

1. Die Fraktions-JSON zu `data/parsed/` hinzufügen (Schema in `README.md`).
2. In `src/data/alliedMatrix.ts` und `src/App.tsx` registrieren.
3. Sicherstellen, dass `npm run build` durchläuft und die Fraktion in der App geladen wird.

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
