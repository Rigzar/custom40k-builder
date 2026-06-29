# Contribuir al Custom 40k Builder

**Leer en otro idioma:** [English](CONTRIBUTING.md) · [Deutsch](CONTRIBUTING.de.md)

Gracias por ayudar a mejorar el builder. Esta guía cubre todo lo que necesitás saber para contribuir, ya sea corrigiendo datos, mejorando traducciones, enviando ilustraciones, reportando bugs o escribiendo código.

---

## Índice

1. [Inicio rápido](#inicio-rápido)
2. [Reportar problemas](#reportar-problemas)
3. [Correcciones de datos (sin código)](#correcciones-de-datos-sin-código)
4. [Traducciones](#traducciones)
5. [Contribuir con arte](#contribuir-con-arte)
6. [Contribuciones de código](#contribuciones-de-código)
7. [Checklist del Pull Request](#checklist-del-pull-request)

---

## Inicio rápido

```bash
git clone https://github.com/Rigzar/custom40k-builder.git
cd custom40k-builder
npm install
npm run build   # debe completarse sin errores
```

> **No ejecutes `npm run dev`** — usá `npm run build` para verificar errores. Podés previsualizar la app abriendo `dist/index.html` después de compilar, o acceder directamente en https://custom40k-builder.vercel.app.

---

## Reportar problemas

Usá GitHub Issues y elegí la plantilla correcta:

- **Bug report** — algo en la app funciona mal (puntos incorrectos, opción que no aparece, crash)
- **Data correction** — los datos de una unidad no coinciden con las reglas

Al reportar, siempre incluí:
- Nombre de la facción y de la unidad
- Qué esperabas ver y qué ocurrió
- Si es un error de datos: la página o sección del reglamento como referencia

---

## Correcciones de datos (sin código)

Esta es la forma de contribución con mayor impacto. Cada facción vive en su propia carpeta:

```
data/parsed/<faccion>/
  units/              ← un .ts por unidad (las 19 facciones)
    troops/
      traitor_guard.ts   ← una unidad, exportada como `Unit`
      index.ts           ← reexporta todas las unidades de ese slot
    hq/  elites/  ...     ← una carpeta por slot, cada una con su index.ts
    index.ts          ← arma el slot_to_units + units de la facción
  armory/
    general.json      ← armería general (todos los modelos)
    mark_khorne.json  ← armería por marca (facciones Chaos)
    legion_*.json     ← armería de capítulo/legado (una por legado)
  archetypes.json     ← arquetipos, legados, rasgos
  animosity.json      ← tabla de animosidad de marcas / matriz de aliados (solo facciones con marcas: CSM, CD)
  psychic/            ← disciplinas, plegarias, daemonkin
```

> Las 19 facciones usan el layout `units/` por slot. Cada unidad vive en su
> propio `.ts` bajo `units/<slot>/<unidad>.ts`. Las unidades auditadas contra
> el `.ods` canónico tienen un comentario de cabecera con la fuente; las
> generadas automáticamente traen un comentario `TODO`.

### Proceso

1. Navegá a `data/parsed/<faccion>/units/<slot>/` y abrí el `.ts` correspondiente.
2. El objeto exportado usa los nombres de campo de la tabla de abajo. El comentario de cabecera documenta la fuente canónica y el perfil — mantenelo sincronizado si cambiás un valor.
3. Compará cada campo con tu copia del reglamento.
4. Corregí lo que está mal y ejecutá `npm run build` para confirmar que el JSON es válido y la app sigue compilando.
5. Abrí un Pull Request.

### Campos a verificar por unidad

| Campo | Qué verificar |
|---|---|
| `models[].points` | Costo en puntos por modelo |
| `models[].min` / `models[].max` | Cantidad mínima y máxima de modelos |
| `models[].stats` | M / WS / BS / S / T / W / A / Ld / Armadura |
| `weapons[]` | Todos los perfiles de armas presentes; S / PA / D / Habilidades correctos |
| `option_groups[]` | El texto del encabezado coincide con las reglas; todas las opciones listadas; costos correctos |
| `option_groups[].per_model` | Poner `true` cuando el encabezado dice "for +X points **per model**" o "the entire squad may receive one of the following... **per model**" — aplica tanto a opciones inline (`inline_pts`) como a grupos `choices[]` normales; sin él, el coste se cobra una sola vez por toda la unidad en vez de escalar con el tamaño de la escuadra |
| `option_groups[].replaces` | Listar el/los nombre(s) exacto(s) del arma que se elimina con este intercambio. Obligatorio en cualquier grupo que deba quitar el arma vieja de la tabla de armas — sin esto, se muestran AMBAS armas. Para un arma con varios perfiles (p. ej. "Taser lance - Charge" / "Taser lance - Melee"), listar cada nombre de perfil, no el prefijo compartido — la coincidencia es por nombre exacto, no recortado. **Cuidado**: una opción cuyo nombre coincida exactamente con el de un arma base que se muestra siempre, ocultará esa arma por defecto — nunca le pongas a una opción puramente aditiva (que otorga MÁS copias de un arma ya presente en `equipped_with`) el mismo nombre exacto que esa arma base. |
| `option_groups[].choices[].name` (con prefijo de cantidad) | **Nunca** nombres una opción "two X" / "2 X" / "four X", etc. — el gating de la tabla de armas compara el nombre de la opción con el nombre del arma de forma exacta, así que un prefijo de cantidad nunca coincide y el arma se muestra incondicionalmente aunque no se haya comprado. Renombra la opción al nombre singular desnudo del arma (el texto del encabezado ya transmite "ambos"/"dos"/etc.); el precio no se ve afectado. |
| `is_character` / `is_vehicle` / `is_psyker` | Flags de clasificación de la unidad |
| `champion_has_armory` | Solo `true` si el campeón puede acceder a la armería de forma independiente |
| `advisor` | Solo `true` para unidades asesoras (p. ej., Comisario) |
| `abilities[]` | Texto de habilidades completo y correcto |
| `unit_type` | Usar la grafía canónica de las Core Rules: `Infantry`, `Bike`, `Character Model`, `Jet Bike`, `Jump Pack Infantry`, `Monstrous Creature`, `Monstrous Infantry`, `Walker`, `Flyer`, `Vehicle` |

### Tipos de restricción para `option_groups`

| `constraint.type` | Significado |
|---|---|
| `one` | Elegir 0 o 1 de la lista (el más común) |
| `every` | Cada modelo elige de forma independiente — costo por modelo |
| `per_n` | M elecciones por cada N modelos (`constraint.per_n` especifica N, `constraint.count_per_n` especifica M — p. ej. "por cada 3 modelos, 1 puede intercambiar" es `per_n:3, count_per_n:1`) |
| `fixed_max` | Hasta N elecciones en total (`constraint.max` especifica N) |
| `mark` | Selección de Marca del Caos |
| `veteran` | Slot de habilidad veterana |
| `unique_upgrade` | Restricción de unicidad a nivel de unidad |

### Estructura de archivos de armería

`armory/general.json` contiene armas, equipo y armas daemoníacas disponibles para todos los modelos elegibles. Las armerías por marca (`armory/mark_khorne.json`, etc.) y de capítulo/legado (`armory/legion_*.json`) siguen la misma estructura:

```json
{
  "name": "Nombre de Armería",
  "weapons": [...],
  "equipment": [...],
  "daemon_weapons": []
}
```

El campo `armory_key` en cada entrada de legado en `archetypes.json` **debe coincidir** con la clave usada en `src/data/loaders.ts` para el objeto `armory_legions` de esa facción — si divergen, la pestaña de armería del legado no aparecerá.

---

## Traducciones

La app soporta tres idiomas: **Inglés (EN)**, **Alemán (DE)** y **Español (ES)**. Los textos traducibles viven en dos lugares distintos — leé ambas secciones antes de empezar.

### 1. Textos de interfaz — `src/i18n/index.ts`

Todas las etiquetas, botones y encabezados de sección viven aquí. Cada entrada es un objeto con las claves `en`, `de` y `es`:

```ts
appTitle: {
  en: 'Custom 40k Army Builder',
  de: 'Custom 40k Armeeliste',
  es: 'Creador de Ejércitos Custom 40k',
},
```

**Cómo encontrar textos sin traducir:**
Buscá entradas donde el valor `es` es idéntico al valor `en` — esos son traducciones automáticas o entradas faltantes. Las correcciones de hablantes nativos son siempre bienvenidas.

**Agregar o corregir una traducción de interfaz:**
1. Abrí `src/i18n/index.ts`.
2. Encontrá el texto (buscá el término en inglés).
3. Editá el valor `es`.
4. Ejecutá `npm run build` — el archivo es TypeScript, así que un error de tipeo causará un error de compilación.
5. Abrí un Pull Request. No necesitás corregir todos los textos — las mejoras parciales son bienvenidas.

### 2. Descripciones de reglas — archivos del engine y datos

Los textos de reglas en el engine (descripciones de rasgos, notas de arquetipos, descripciones de habilidades) están actualmente **solo en inglés**. Se guardan como strings en los archivos TypeScript del engine y en `src/data/changelog.ts` / `src/data/known-issues.ts`.

**Cómo el patrón de comentario canónico ayuda a traducir:**
Cada archivo del engine (arquetipos, rasgos, legados) tiene el texto original de la regla como comentario directamente encima del código que la implementa:

```ts
// FUENTE: Personalización de ejército CSM — Rasgos
// Blood Feud: Si la unidad usa una orden de Carga o es cargada, gana +1 a
// las tiradas de golpe en combate cuerpo a cuerpo hasta el final del round.
// COSTE: 5 normal · 0 personaje · 5 criatura/vehículo
'Blood Feud': [
  { type: 'unit_ability', name: 'Blood Feud', desc: '...', applies_to: 'all' },
],
```

El comentario te da exactamente el texto en inglés que necesitás traducir, sin abrir los archivos HTML fuente.

**Para traducir una descripción de regla — convertir un campo a multiidioma:**

Los campos `desc` de las reglas son actualmente strings solo en inglés. Para hacerlos multiidioma, cambiá el tipo de `string` a `I18nString` (definido en `src/data/changelog.ts`):

```ts
// Antes — solo inglés:
desc: 'The unit gains +1 to melee hit rolls when charging or charged.',

// Después — tres idiomas:
desc: {
  en: 'The unit gains +1 to melee hit rolls when charging or charged.',
  de: 'Die Einheit erhält +1 auf Nahkampf-Trefferproben, wenn sie angreift oder angegriffen wird.',
  es: 'La unidad gana +1 a las tiradas de golpe en cuerpo a cuerpo al cargar o ser cargada.',
},
```

El hook `useT()` en la UI resuelve `I18nString` al idioma activo automáticamente — no hacen falta cambios en la UI, solo el cambio de dato. Una vez que cambiás el tipo, TypeScript te indica todos los lugares que leen ese campo para que no te pierdas ninguno.

**Pasos para convertir un campo desc:**
1. Cambiá el tipo del campo en `types/data.ts` o en la interfaz correspondiente de `string` a `I18nString` (importalo desde `'../data/changelog'`).
2. Actualizá el valor en el archivo del engine al formato objeto `{ en, de, es }`.
3. Ejecutá `npm run build` — TypeScript marcará cualquier uso restante como string plano para que no quede ninguno sin actualizar.
4. Si por ahora solo tenés la traducción en inglés, podés usar el mismo texto en los tres como placeholder: `{ en: '...', de: '...', es: '...' }` — un hablante nativo puede mejorar el DE/ES después.

**Changelog y Known Issues** (`src/data/changelog.ts`, `src/data/known-issues.ts`) ya usan `I18nString` — las entradas tienen claves `en`, `de` y `es`. Si añadís una entrada al changelog, completá los tres idiomas.

### Sobre los PRs de traducción

- Para PRs que solo modifiquen `i18n/index.ts` no necesitás el entorno de desarrollo completo. Solo editá el archivo y verificá que el build pase.
- Si no estás seguro/a de una traducción, dejá una nota en la descripción del PR.
- La traducción automática es aceptable como punto de partida; se prefiere la revisión de hablantes nativos.

---

## Contribuir con arte

La app muestra una imagen de fondo específica de cada facción en la vista de impresión. Cada imagen es un archivo PNG en `src/assets/`.

### Qué se necesita

Las siguientes facciones usan actualmente una imagen compartida o genérica:

| Facción | Imagen actual |
|---|---|
| Space Marines | compartida (Imperium) |
| Grey Knights | compartida (Imperium) |
| Inquisition | compartida (Imperium) |
| Assassins | compartida (Imperium) |
| Eldar | imagen genérica |
| Dark Eldar | imagen genérica |
| Harlequins | imagen genérica |
| Leagues of Votann | imagen genérica |

### Requisitos

- **Formato:** PNG
- **Tamaño mínimo:** 1600 × 900 px (la imagen se usa como fondo de ancho completo)
- **Estilo:** oscuro, atmosférico, apropiado para el universo Warhammer 40k
- **Derechos de autor:** solo fan art y obras originales. No envíes escaneos ni fotografías de ilustraciones oficiales de Games Workshop. La imagen debe ser tu propia obra o estar licenciada bajo una licencia Creative Commons compatible con CC BY-NC-SA 4.0.

### Convención de nombres

Nombrá tu archivo `<claveFacción>Background.png` usando el identificador camelCase de la facción. Ejemplos: `eldarBackground.png`, `darkEldarBackground.png`, `harlequinsBackground.png`.

### Cómo registrar una nueva imagen de fondo

1. Agregá el PNG a `src/assets/`.
2. Abrí `src/components/PrintView.tsx`.
3. Importá la imagen al inicio del archivo, siguiendo el patrón de los imports existentes.
4. Agregá una entrada en el objeto `FACTION_BG` que mapee el nombre de la facción a la imagen importada.
5. Ejecutá `npm run build` y confirmá que la imagen carga correctamente.

### Enviar arte

Abrí un Pull Request con el archivo PNG y el cambio en `PrintView.tsx`. Incluí una nota sobre el origen o autoría de la imagen para que pueda verificarse la compatibilidad con CC.

---

## Contribuciones de código

### Visión general de la arquitectura

```
src/engine/     Lógica del juego — editá aquí para reglas, puntos y validación
src/components/ UI — editá aquí para cambios visuales
src/store/      Estado Zustand — CRUD de lista de ejército y selecciones
src/types/      Tipos TypeScript — Unit, Weapon, RosterEntry, etc.
src/data/       Datos estáticos — changelog, metadatos de facciones
src/i18n/       Textos de traducción (EN / DE / ES)
```

### Archivos del motor

| Archivo | Responsabilidad |
|---|---|
| `points.ts` | Cálculo de puntos — costo base + opciones + rasgos + armería |
| `resolver.ts` | Resolución del perfil de unidad — aplica marcas, variantes, arquetipos, despacha a `FACTION_RESOLVERS` |
| `validators.ts` | Validación del ejército — límites de slots, restricciones de arquetipos, límites de engagement |
| `archetypes/base.ts` | Forma de `ArchetypeRule` (cada flag que un arquetipo puede setear) + el default `BASE` |
| `archetypes/index.ts` | `ARCHETYPE_RULES` — todos los arquetipos de todas las facciones, indexados por nombre |
| `legacies.ts` | `getLegacyStructuredNotes(faction, name)` / `getLegacyExtraPower(faction, name)` — dispatcher cross-facción que lee el `codex_<facción>/legacies.ts` de cada facción |
| `codex_<facción>/` | Módulo del motor por facción (uno por facción) — acá vive todo el código del motor de esa facción: `legacies.ts`, `traits.ts`, `resolver.ts`, `validator.ts`, `archetypes/{index.ts,rules.ts}` (cuando la facción los necesita), más los catálogos de referencia `keywords.ts`, `slots.ts`, `unit-types.ts`, `special-abilities.ts`, `weapon-abilities.ts` y un `digest.md` de referencia de auditoría |
| `equipMods.ts` | Parsea modificadores de estadísticas de equipo (p. ej., "+1 S") |
| `keywords.ts` | Capa de derivación por keyword para el gating de wargear — deriva en un solo sitio los requisitos de Marca de Caos (`itemRequiredMark`), la compatibilidad con armadura Terminator (`modelRestrictsToTermSubset`), la compatibilidad Gravis (`modelRestrictsToGravisSubset`) y los helpers de desbloqueo de Ordo/Legado de Inquisición (`inquisitionLegacyOrdoUnlocks`, `chamberMilitantOrdo`). Edita aquí (no en `ArmoryModal`) cuando cambies cómo se deriva el gating de armadura/marca/Ordo. **Convención de glifos:** `ᵀ` = compatible con Terminator (NO Marca de Tzeentch); los glifos de marca son solo `ᴷ`/`ᴺ`/`ˢ` (Khorne/Nurgle/Slaanesh) — Tzeentch va por sección (`armory_marks.Tzeentch`) y `ᶻ` queda reservado si alguna vez hace falta un glifo. **Cuando el trabajo toque la distinción Tzeentch-vs-Terminator, pregunta al mantenedor — no asumas.** |

### Cuándo editar los archivos de legado

`legacies.ts` (top-level) es un dispatcher fino cross-facción — controla **qué disciplinas y plegarias muestra el modal psíquico** según el legado activo, y qué poder extra otorga siempre un legado. Los datos propios de cada facción (acceso a armería, restricciones de marca, mapas de disciplina/plegaria) viven en su `codex_<facción>/legacies.ts`, leídos a través del dispatcher.

- **`codex_space_marines/legacies.ts`** — Editá este archivo si:
  - Añadís una nueva disciplina de legado SM que deba estar bloqueada (agregala a `SM_LEGACY_DISC_MAP` mapeando nombre de disciplina → nombre del legado requerido).
  - Añadís una nueva plegaria que solo aparezca con el Legacy of the Crusader (agregala a `SM_CRUSADER_PRAYERS`).
  - Renombrás un legado o disciplina SM existente.
- **`codex_grey_knights/legacies.ts`** — Editá este archivo si cambiás qué poder otorga siempre un Legado a los psykers GK (`getGKLegacyPower`).
- **`codex_<facción>/legacies.ts`** — Editá este archivo para las reglas de acceso a armería de Legados de una facción o restricciones de marca (p. ej. `CSM_LEGACY_NOTES` en `codex_csm/legacies.ts`).

Si añadís una nueva facción con disciplinas bloqueadas por legado, creá un archivo `codex_<facción>/legacies.ts` siguiendo el mismo patrón, conectalo en `PsychicModal.tsx`, y registralo en el mapa `FACTION_LEGACY_NOTES` de `legacies.ts` (top-level) si también necesita mostrarse como nota estructurada.

### Estructura de datos (carpetas por facción)

Los datos de facción viven en `data/parsed/<faccion>/` — una carpeta por facción. Dentro: `units/` (ver estructura arriba), `armory/general.json`, `armory/mark_*.json`, `armory/legion_*.json`, `psychic/`, `archetypes.json`, `animosity.json` (solo CSM/CD). Los suplementos van en `_supplements/` y los archivos de auditoría del parser en `_scratch/` (nunca los carga la app).

El loader que ensambla cada `FactionData` es **`src/data/loaders.ts`** — importa los archivos individuales con rutas estáticas (requerido por Vite) y los fusiona. El engine recibe exactamente el mismo objeto que antes; solo cambió la organización de archivos.

**Añadir una nueva facción:** crear la carpeta + archivos → añadir `case` en `loaders.ts` → añadir a `FACTION_LOADERS` → registrar en `LandingPage.tsx` y añadir abreviatura/categoría en `FactionSymbol.tsx` → (opcional) añadir `engine/factions/<faccion>/` si necesita resolver/rasgos/validadores propios.

### Por dónde empezar / cómo ayudar

- **`OPEN_QUESTIONS.md`** (raíz del repo) lista lo que el proyecto necesita: **preguntas de reglas**
  (una regla ambigua que necesita una respuesta canónica antes de poder programarse — no hace falta
  saber código para ayudar) y **problemas de código** (bugs de engine/UI que un dev puede arreglar).
- Abre un issue en GitHub con la plantilla correspondiente — **Rules question**, **Code issue**,
  **Data correction** o **Bug report** (`.github/ISSUE_TEMPLATE/`). Responder una pregunta de reglas
  desbloquea la implementación; el mantenedor la cablea.
- El panel **Known Issues** en la app (`src/data/known-issues.ts`) es el tracker de cara al usuario;
  se solapa con `OPEN_QUESTIONS.md` en los problemas de código, pero este último además guarda las
  preguntas de reglas sin responder.

### Efectos de reglas estructurados y primitivos de coste (añadidos v0.51–v0.52)

Algunas reglas no se pueden expresar solo con el texto de la descripción — necesitan campos estructurados que el engine lee. **Vigila el VERBO del datasheet al elegir el campo.**

- **`OptionEffect`** (`types/data.ts`) — va en un `Choice`, un `OptionGroup`, **o un `ArmoryItem`** (`item.effect`). Campos:
  - `stat_mod: [{ stat, delta }]` — p.ej. `+6" M` de una mochila de salto.
  - `adds_unit_types: string[]` — ganancia **aditiva** de tipo. Verbo "**gains** the unit type X". El modelo conserva sus tipos actuales.
  - `set_unit_type: string` — **reemplazo** de toda la línea de tipo. Verbo "**change** unit type **to** X".
  - `grants_abilities: string[]` — reglas especiales concedidas (solo lo que el datasheet dice).
  - Los efectos se aplican en `resolver.ts` (`applyEffect`) y se **deduplican contra el perfil base del modelo** — un tipo o ability que el modelo ya tiene nunca se re-añade. Los stats y abilities entre comillas de un ítem de armería siguen viniendo de `equipMods` (parseo de descripción); `item.effect` solo lleva el cambio de tipo.
  - **Tipo y ability no son lo mismo.** `"Jump Pack Infantry"` es un TIPO de unidad (da Deep Strike); `"Jump pack"` es una ABILITY (no lo da). Modela lo que el datasheet dice literalmente.
- **`OptionGroup.per_model`** — pon `true` en una opción inline O en un grupo `choices[]` normal cuyo datasheet diga "for +X points **per model**" (o "...receive one of the following upgrades **per model**"). El engine de puntos cobra entonces `inline_pts × tamaño de unidad` (inline) o `choice.points × qty × tamaño de unidad` (choices) en vez de una sola vez por toda la unidad. Las opciones inline planas de una sola vez (promover un Sargento) y los grupos "every model may swap X" (cuyo `qty` ya es igual a la cantidad elegida) lo dejan sin poner.
- **`equipMods.ts`** — parsea `+stat`, salvaciones y abilities entre comillas del `desc` de un ítem de armería. Excluye las palabras de tipo de unidad entre comillas (las maneja el sistema de tipos) y deduplica las abilities concedidas contra las abilities base de la unidad.
- **Los caps de equipo de Escaramuza** viven en `validators.ts` (dentro del bloque `eng.statCaps`). Enforzan las restricciones del suplemento de Misiones: no ganar 2+ de armadura, 4+ inv o mejor, T8+, arma de Daño 3, ni más de un ítem Único de armería — todo fundamentado en `Informacion/missions_text.txt` y `core_rules_text.txt`. Añade caps nuevos aquí, no en la UI.

> **Codificación (mojibake):** al editar JSON o TS a mano, mantén los ficheros en UTF-8. Secuencias corruptas como `â€"` (debería ser `—`) entran al copiar-pegar; `scripts/_scan_mojibake.cjs` las detecta. No pegues desde editores de texto enriquecido.

> **Barrido proactivo de bugs:** `scripts/sanity_sweep.ts` importa directamente los módulos reales de datos/engine de producción (ejecútalo con `npx tsx scripts/sanity_sweep.ts`, sin instalar nada) y señala inconsistencias estructurales sin esperar a que un jugador reporte el bug: option groups muertos (`choices: []` en un constraint que espera choices reales), contradicciones `is_character`/`unit_type`, referencias colgantes a nombres de unidad en `engine/archetypes`, entradas colgantes en `slot_to_units`, `replaces` que nombra un arma que no está en la unidad, `variant_link` colgante, y nombres de arma duplicados dentro de una misma unidad. Es un checker ESTRUCTURAL, no de reglas — cada hallazgo necesita revisión humana antes de tratarlo como bug confirmado (ver los comentarios del propio script para los falsos positivos conocidos). Vuelve a correrlo tras cualquier edición de datos que toque esos campos, y sobre todo antes de un push de release.

### Changelog vs Known Issues (importante — separados desde v0.47)

Estos dos archivos tienen propósitos distintos y no deben confundirse:

| Archivo | Qué va aquí |
|---|---|
| `src/data/changelog.ts` | Historial de versiones — una entrada por release con descripciones de cambios en EN/DE/ES |
| `src/data/known-issues.ts` | Seguimiento de bugs y limitaciones — el estado puede ser `known`, `investigating`, `fixed`, `by_design` o `planned` |

**Antes de v0.47** ambos vivían en `changelog.ts`. Ahora están separados. Si corregís un bug conocido:
1. Abrí `src/data/known-issues.ts`, encontrá el issue por su `id` y cambiá `status: 'fixed'`.
2. Añadí una línea en la entrada de la versión actual en `src/data/changelog.ts` describiendo el fix.

**No** editéis `changelog.ts` para actualizar estados de issues — ya no contiene `KNOWN_ISSUES`.

### Convenciones de TypeScript

- Sin `any` — usá los tipos de `src/types/`
- Cero errores de TypeScript requeridos — `npm run build` debe pasar
- Preferir tipos específicos sobre amplios; agregar a `src/types/` si una forma se repite
- Sin nuevas dependencias sin discusión previa en un issue

### Agregar un archivo de datos faltante a una facción existente

Muchas facciones tienen archivos todavía vacíos o faltantes. Si querés completar datos de una facción — por ejemplo agregar sus disciplinas psíquicas, una armería de legado o sus arquetipos — usá los templates de abajo. Después de crear o editar cualquier archivo, ejecutá `npm run build` para confirmar que el JSON es válido.

**`archetypes.json`** — arquetipos, legados y rasgos de la facción:
```json
{
  "archetypes": [
    {
      "name": "Nombre del arquetipo",
      "desc": "Texto completo de la regla tomado de la hoja de Personalización de ejército, tal como está escrito."
    }
  ],
  "legacies": [
    {
      "name": "Nombre del legado",
      "desc": "Texto completo de la regla."
    }
  ],
  "traits": [
    {
      "name": "Nombre del rasgo",
      "desc": "Texto completo de la regla.",
      "pts_unit": "5",
      "pts_char": "0",
      "pts_monster": "5",
      "pts_veh": "5"
    }
  ]
}
```
> Columnas de coste: `pts_unit` = modelos normales, `pts_char` = personajes, `pts_monster` / `pts_veh` = Criaturas Monstruosas y Vehículos (columna compartida). Usá `"-"` para no disponible, `"5*"` para costes por Herida/Punto de Casco.

**`animosity.json`** — tabla de animosidad de marcas / matriz de compatibilidad de aliados (solo facciones con marcas: CSM, CD):
```json
{
  "animosity": {},
  "allied": {}
}
```

**`armory/legion_<nombre>.json`** — armería de capítulo, legado o sept:
```json
{
  "name": "Legacy of the Example",
  "weapons": [],
  "equipment": [],
  "daemon_weapons": []
}
```
Después de crear este archivo, registralo en `src/data/loaders.ts` — encontrá el `case` de la facción y añadí la nueva importación y clave en el objeto `legions` que se pasa a `asm()`.

**`armory/mark_<dios>.json`** — armería específica de Marca de Caos (solo facciones Chaos):
```json
{
  "name": "Armería de la Marca de Khorne",
  "weapons": [],
  "equipment": [],
  "daemon_weapons": []
}
```
Registralo en `loaders.ts` bajo el objeto `marks` de la facción.

**`psychic/disciplines.json`** — disciplinas psíquicas:
```json
[]
```

**`psychic/prayers.json`** — plegarias / invocaciones:
```json
[]
```

**`psychic/daemonkin.json`** — tabla de daemonkin en juego (facciones Chaos):
```json
{}
```

> **Después de agregar cualquier archivo:** abrí `src/data/loaders.ts`, encontrá el `case` de la facción y asegurate de que el nuevo archivo esté importado y pasado a `asm()`. Los archivos que nunca son importados por el loader nunca son cargados por la app — el archivo solo no es suficiente.

### Digests de modelo de reglas (`src/data/rules-model/<faction>.md`)

Cada facción auditada tiene un digest Markdown en `src/data/rules-model/` (plantilla:
`_TEMPLATE.md`). Registra el vocabulario de keywords de la facción, las reglas de gating de
wargear, el modelo de puntos, la option-semantics por slot de cada datasheet, y un chequeo de huecos
del engine, todo validado contra el HTML fuente canónico y el JSON de producción. Son documentos de
referencia para contribuidores y para el engine — la app no los carga. Cuando audites o corrijas los
datos de una facción, actualizá su digest para que quede sincronizado.
Los suplementos multi-facción usan la misma carpeta y nomenclatura (p. ej. `escalation.md`
para el suplemento Escalation / Lords of War).

### Traducciones

Si agregás un nuevo texto de UI, incluí entradas para los tres idiomas (EN / DE / ES) en `src/i18n/index.ts`. La traducción automática es aceptable para ES y DE; la revisión de hablantes nativos es bienvenida.

> **Traducciones al alemán:** usá terminología oficial de Games Workshop en alemán, no traducciones literales. Los nombres de slots siguen la convención GW: `Standard` (Troops), `Elite` (Elites), `Sturm` (Fast Attack), `Unterstützung` (Heavy Support). Abreviaturas de estadísticas: `Reichw.` (Alcance), `DS` (FP), `SW` (Daño). Armería es `Rüstkammer`, no `Waffenkammer`.

---

## Checklist del Pull Request

Antes de abrir un PR, confirmá:

- [ ] `npm run build` pasa sin errores de TypeScript
- [ ] El cambio está acotado a una sola cosa (una unidad, un bug, una feature)
- [ ] Los nuevos textos de UI tienen traducciones en los tres idiomas
- [ ] Si se cerró un problema conocido, el `status` en `src/data/known-issues.ts` está actualizado a `'fixed'`
- [ ] La descripción del PR explica qué cambió y por qué (un enlace al issue correspondiente es suficiente)

Los PRs que no pasen el check del build no serán revisados hasta que se solucione.

---

## Licencia

Al contribuir, aceptás que tus aportes se publicarán bajo la misma licencia [CC BY-NC-SA 4.0](LICENSE) que el resto del proyecto.
