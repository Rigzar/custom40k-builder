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

Esta es la forma de contribución con mayor impacto. Cada facción vive en un único archivo JSON:

```
data/parsed/<faccion>.json
```

### Proceso

1. Abrí el archivo JSON de tu facción en cualquier editor de texto.
2. Encontrá la unidad — es una clave dentro de `"units": { ... }`.
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
| `is_character` / `is_vehicle` / `is_psyker` | Flags de clasificación de la unidad |
| `champion_has_armory` | Solo `true` si el campeón (equivalente al sargento) puede acceder a la armería de forma independiente |
| `advisor` | Solo `true` para unidades asesoras (p. ej., Comisario) |
| `abilities[]` | Texto de habilidades completo y correcto |

### Tipos de restricción para `option_groups`

| `constraint.type` | Significado |
|---|---|
| `one` | Elegir 0 o 1 de la lista (el más común) |
| `every` | Cada modelo elige de forma independiente — costo por modelo |
| `per_n` | Una elección por cada N modelos (`constraint.n` especifica N) |
| `fixed_max` | Hasta N elecciones en total (`constraint.max` especifica N) |
| `mark` | Selección de Marca del Caos |
| `veteran` | Slot de habilidad veterana |
| `unique_upgrade` | Restricción de unicidad a nivel de unidad |

### Campos de armería

La armería general (armas, equipo, armas daemoníacas disponibles para todas las unidades elegibles de la facción) se encuentra en el nivel superior del JSON de facción:

```json
"armory_general": {
  "weapons": [...],
  "equipment": [...],
  "daemon_weapons": []
}
```

Las armerías específicas de facción (p. ej., ítems bloqueados por marca para CSM) pueden aparecer como `armory_marks`, `armory_vehicles`, etc.

---

## Traducciones

La app soporta tres idiomas: **Inglés (EN)**, **Alemán (DE)** y **Español (ES)**. Todos los textos de la interfaz viven en un único archivo:

```
src/i18n/index.ts
```

Cada texto es un objeto con las claves `en`, `de` y `es`:

```ts
appTitle: {
  en: 'Custom 40k Army Builder',
  de: 'Custom 40k Armeeliste',
  es: 'Creador de Ejércitos Custom 40k',
},
```

### Cómo encontrar textos sin traducir

Buscá textos donde el valor `es` es idéntico al valor `en` — esos son traducciones automáticas o entradas faltantes. Las correcciones de hablantes nativos son siempre bienvenidas.

### Agregar o corregir una traducción

1. Abrí `src/i18n/index.ts`.
2. Encontrá el texto (buscá el término en inglés).
3. Editá el valor `es`.
4. Ejecutá `npm run build` — el archivo es TypeScript, así que un error de tipeo causará un error de compilación.
5. Abrí un Pull Request con tu cambio. No necesitás corregir todos los textos — las mejoras parciales son bienvenidas.

### Sobre los PRs de traducción

- Para PRs que solo incluyan traducciones no necesitás configurar el entorno de desarrollo completo. Solo editá el archivo y verificá que el build pase.
- Si no estás seguro/a de una traducción, dejá una nota en la descripción del PR.
- La traducción automática es aceptable como punto de partida, pero se prefiere la revisión de hablantes nativos.

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
| `resolver.ts` | Resolución del perfil de unidad — aplica marcas, variantes, arquetipos |
| `validators.ts` | Validación del ejército — límites de slots, restricciones de arquetipos, límites de engagement |
| `archetypes.ts` | Definiciones y aplicación de reglas de arquetipos |
| `archetypes/csm.ts` | Definiciones de arquetipos CSM (flags del motor) |
| `archetypes/rules/csm-rules.ts` | Datos de reglas de arquetipos CSM (13 arquetipos con notas categorizadas para uso del motor) |
| `legacies/csm-legacies.ts` | Datos de reglas de legados CSM (5 legados — acceso a armería + restricciones de marca) |
| `legacies/sm-legacies.ts` | Datos de reglas de legados SM — mapa de gate de disciplinas y set de plegarias Cruzadas |
| `legacies/index.ts` | `getLegacyStructuredNotes(faction, name)` — dispatcher para consultas de reglas de legado |
| `equipMods.ts` | Parsea modificadores de estadísticas de equipo (p. ej., "+1 S") |
| `keywords.ts` | Capa de derivación por keyword para el gating de wargear — deriva en un solo sitio los requisitos de Marca de Caos (`itemRequiredMark`), la compatibilidad con armadura Terminator (`modelRestrictsToTermSubset`) y la compatibilidad Gravis (`modelRestrictsToGravisSubset`). Edita aquí (no en `ArmoryModal`) cuando cambies cómo se deriva el gating de armadura/marca. **Convención de glifos:** `ᵀ` = compatible con Terminator (NO Marca de Tzeentch); los glifos de marca son solo `ᴷ`/`ᴺ`/`ˢ` (Khorne/Nurgle/Slaanesh) — Tzeentch va por sección (`armory_marks.Tzeentch`) y `ᶻ` queda reservado si alguna vez hace falta un glifo. **Cuando el trabajo toque la distinción Tzeentch-vs-Terminator, pregunta al mantenedor — no asumas.** |

### Cuándo editar los archivos de legado

La carpeta `legacies/` contiene reglas del motor que no pueden vivir en el JSON — controlan **qué disciplinas y plegarias muestra el modal psíquico** según el legado activo.

- **`legacies/sm-legacies.ts`** — Editá este archivo si:
  - Añadís una nueva disciplina de legado SM que deba estar bloqueada (agregala a `SM_LEGACY_DISC_MAP` mapeando nombre de disciplina → nombre del legado requerido).
  - Añadís una nueva plegaria que solo aparezca con el Legacy of the Crusader (agregala a `SM_CRUSADER_PRAYERS`).
  - Renombrás un legado o disciplina SM existente.
- **`legacies/csm-legacies.ts`** — Editá este archivo si añadís o cambiás reglas de acceso a armería de legados CSM o restricciones de marca.

Si añadís una nueva facción con disciplinas bloqueadas por legado, creá un nuevo archivo `legacies/<faccion>.ts` siguiendo el mismo patrón y conectalo en `PsychicModal.tsx`.

### Estructura de datos (carpetas por facción)

Los datos de facción viven en `data/parsed/<faccion>/` — una carpeta por facción, no un directorio plano con monolitos. Dentro: `units.json`, `armory/general.json`, `armory/mark_*.json`, `armory/legion_*.json`, `psychic/`, `archetypes.json`, `rules.json`. Los suplementos van en `_supplements/` y los archivos de auditoría del parser en `_scratch/` (nunca los carga la app).

El loader que ensambla cada `FactionData` es **`src/data/loaders.ts`** — importa los archivos individuales con rutas estáticas (requerido por Vite) y los fusiona. El engine recibe exactamente el mismo objeto que antes; solo cambió la organización de archivos.

**Añadir una nueva facción:** crear la carpeta + archivos → añadir `case` en `loaders.ts` → añadir a `FACTION_LOADERS` → registrar en `LandingPage.tsx` → (opcional) añadir `engine/factions/<faccion>/` si necesita resolver/rasgos/validadores propios.

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
- **`OptionGroup.per_model`** — pon `true` en una opción inline cuyo datasheet diga "for +X points **per model**". El engine de puntos cobra entonces `inline_pts × tamaño de unidad` en vez de una sola vez. Las opciones inline planas de una sola vez (promover un Sargento) lo dejan sin poner.
- **`equipMods.ts`** — parsea `+stat`, salvaciones y abilities entre comillas del `desc` de un ítem de armería. Excluye las palabras de tipo de unidad entre comillas (las maneja el sistema de tipos) y deduplica las abilities concedidas contra las abilities base de la unidad.
- **Los caps de equipo de Escaramuza** viven en `validators.ts` (dentro del bloque `eng.statCaps`). Enforzan las restricciones del suplemento de Misiones: no ganar 2+ de armadura, 4+ inv o mejor, T8+, arma de Daño 3, ni más de un ítem Único de armería — todo fundamentado en `Informacion/missions_text.txt` y `core_rules_text.txt`. Añade caps nuevos aquí, no en la UI.

> **Codificación (mojibake):** al editar JSON o TS a mano, mantén los ficheros en UTF-8. Secuencias corruptas como `â€"` (debería ser `—`) entran al copiar-pegar; `scripts/_scan_mojibake.cjs` las detecta. No pegues desde editores de texto enriquecido.

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

### Agregar una nueva facción

1. Agregá el JSON de la facción a `data/parsed/` siguiendo el esquema en `README.md`.
2. Registrala en `src/data/alliedMatrix.ts` y `src/App.tsx`.
3. Verificá que `npm run build` pase y que la facción cargue en la app.

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
