# Plan del Proyecto — Custom40k Builder

> Este archivo es el **mapa central**: qué estamos construyendo, en qué fase vamos, qué bugs
> conocemos, cómo va cada facción, y dónde nos quedamos. Se actualiza al final de cada sesión
> de trabajo (parte del wrap-up). Si empiezas una sesión nueva, léelo primero — junto con el
> briefing de `CLAUDE.md` — para saber exactamente dónde retomar.

---

## 1. La visión — qué estamos construyendo ahora mismo

**El problema:** las reglas de cada facción están repartidas en archivos `.ts` y `.json` sueltos,
con mini-reglas que se repiten o se contradicen entre sí. Es difícil saber qué se ha auditado,
qué falta, y de dónde sale cada dato.

**La solución que estamos construyendo:** un archivo `data/codex/<facción>.ts` por facción que
junte TODO (las reglas del Index + las de Army Customisation) en un solo sitio, con:
- Los datos de reglas organizados por **5 categorías base** (modelo afinado 2026-06-08):
  1. **Unit type** — Infantry / Vehicle / Monster / Character / etc.
  2. **Keyword** — paraguas de varias etiquetas: tipo de armadura (Power/Terminator/
     Cataphractii/Gravis), Marcas, facción (situacional — solo cuando algo referencia la
     facción completa), y el keyword propio del datasheet (Cultist, Chaos Marine, etc.)
  3. **Special ability** — habilidades especiales del modelo, **incluye Psyker** (rectificado:
     aunque tiene mecánica propia, sigue siendo habilidad especial, no keyword de unidad)
  4. **Weapon ability** — habilidades de arma
  5. **Slot** — HQ / Troops / Elite / Fast Attack / Heavy Support / etc.
  No por flags sueltos inventados ítem a ítem.
- Un **motor general** (reglas core, válido para todas las facciones).
- Un **motor por facción** que puede sobreescribir al general cuando el Codex de esa facción
  dice algo distinto (FAQ #5: el Codex siempre gana sobre las Core Rules).

**⚠️ Pendiente de aplicar al código:** la reclasificación de Psyker (special ability, no
keyword de unidad) todavía NO está reflejada en el motor — en `engine/keywords.ts`
(líneas 116-143) "Psyker" sigue viviendo en el mismo saco plano `unit.keywords[]` que
"Vehicle", "Monster", "Terminator", "Priest". Es un refinamiento conceptual confirmado pero
sin trasladar al código — se aplicará cuando toquemos esa parte del motor/`codex.ts`.

Esto sustituye a los digests en prosa `rules-model/<facción>.md` — pasamos de "chuleta para leer"
a "dato estructurado que el motor consulta directamente".

**Antes de construir eso**, había que asegurarse de que la base (Core Rules + Missions) estuviera
bien auditada — si la base tiene huecos, el `codex.ts` los heredaría. Esa auditoría ya se hizo
(ver Fase 1 abajo).

---

## 2. Fases del plan

### ✅ Fase 1 — Auditoría sistemática Core Rules + Missions — COMPLETA (v0.57, 2026-06-08)
Repaso sección por sección de `Custom40k Core Rules.txt` + `Custom40k Missions.txt` contra el
motor (no contra los digests — directo contra el canon). Resultado: 6 huecos reales encontrados,
2 arreglados en el momento, 4 registrados como known issues. Detalle completo en
`memory/project_core_missions_audit_0608.md` y en el changelog v0.57.

### 🔄 Fase 2 — Auditoría HTML×HTML por facción (en curso, desigual según facción)
Cada facción se audita comparando su `Index.html` + `Army Customisation.html` canónico contra
los datos/motor (`production JSON` + `rules-model/<facción>.md`). Ver tabla de estado en §4.

### ✅ Fase 3 — Construir el piloto `codex_csm` (CSM primero) — COMPLETA (2026-06-08)
Decidido (2026-06-08): será una **carpeta** `codex_csm/` que consolide Index + Archetypes +
Legacies/Traits/Resolver/Engine de CSM, dividida en varios archivos organizados dentro (no un
solo archivo gigante) — para que revisar y programar se haga desde un único sitio.

**Paso 1 — COMPLETO (2026-06-08):** los 6 archivos dispersos (`engine/legacies/`,
`engine/traits/`, `engine/resolvers/`, `engine/archetypes/chaos_space_marines/`) + el digest
`rules-model/chaos_space_marines.md` ya están todos juntos en `engine/codex_csm/`
(legacies.ts, traits.ts, resolver.ts, digest.md, archetypes/{index,rules,weapon-overrides}.ts).
Solo reorganización de archivos — sin cambios de comportamiento. Build ✓.

**Paso 2 — COMPLETO (2026-06-08):** esqueletos de los 5 ficheros del modelo de categorías,
creados dentro de `engine/codex_csm/`: `unit-types.ts`, `keywords.ts`, `special-abilities.ts`,
`weapon-abilities.ts`, `slots.ts`. Cada uno trae su interfaz, un catálogo vacío exportado, y
comentarios de cabecera apuntando a las secciones exactas de `digest.md` a migrar (con número
de línea). `index.ts` documenta el mapeo completo. **Sin datos movidos todavía** — el digest
sigue siendo la referencia de auditoría; build ✓.

Mapeo acordado (digest → categoría):
| Categoría | Fichero | Secciones del digest |
|---|---|---|
| Unit type | `unit-types.ts` | §4d–§4i (datasheets por slot) |
| Keyword | `keywords.ts` | §1 (armadura), §4b (Marks), keywords de datasheet |
| Special ability | `special-abilities.ts` | §4, §4b (reglas army), §6 (disciplinas/plegarias/pactos — incl. Psyker) |
| Weapon ability | `weapon-abilities.ts` | §2 (gating wargear), §3 (perfiles múltiples) |
| Slot | `slots.ts` | §4c (roster slot→unidades) |

**Quedan fuera del modelo de 5 categorías** (transversales — no se mueven): §5 Archetypes/
Legacies/Traits (ya viven en `legacies.ts`/`traits.ts`/`archetypes/`), §3 modelo de puntos
(mecánica de motor), §7 + bitácora de fuentes (se quedan en `digest.md`).

**Hallazgo importante:** la reclasificación "Psyker = Special ability, no Keyword" (acordada
2026-06-08) **NO es un cambio trivial** — items reales de armería (ej.
`space_marines/armory/general.json`) gatean con `requires_keywords: ["Psyker"]` vía
`engine/keywords.ts effectiveKeywords()`. Separarlo sin romper esos ~67 usos requiere rediseñar
el gating; queda correctamente pospuesto al pase de motor de `codex.ts` (como ya decía el plan).

**Pasos 3-7 — COMPLETOS (2026-06-08), los 5 catálogos rellenados con datos reales validados
contra `digest.md` + fuentes canónicas:**
- Paso 3: `CSM_SLOTS` — roster completo §4c (8 HQ/8 Troops/22 Elites/9 FA/9 HS/2 DT/2 Fort/1 Flyer)
- Paso 4: `CSM_KEYWORDS` — eje armadura (Terminator/Cataphractii), eje marca (5 marcas + grants
  verbatim + números sagrados + rivalidades Animosity), eje facción, eje datasheet (6 keywords
  legión/identidad)
- Paso 5: `CSM_UNIT_TYPES` — los 61 datasheets del roster, extraídos programáticamente de los
  `.ts` de producción (no transcritos a mano)
- Paso 6: `CSM_SPECIAL_ABILITIES` — General Armory rules (§4), mecánicas army-rule de §4b
  (Favored Units/Summoning/Animosity/Mark of Chaos Undivided), mecánicas de los 3 cast-systems
  de §6 (Psyker/Disciplinas/Plegarias/Pactos) — sin duplicar grants de marca (ya en
  CSM_KEYWORDS) ni las 36+10+6 powers/prayers/pacts (ya canónicas en `disciplines.json`)
- Paso 7: `CSM_WEAPON_ABILITIES` — mecánicas de gating de §2/§3 (ᵀ/term_compat, perfiles
  múltiples `profiles[]`, texto de restricción no estructurado, semántica de columnas de
  puntos) — sin duplicar el glosario de ~50 weapon abilities (ya en `coreRules.ts`) ni el eje
  de keyword Terminator/Cataphractii (ya en `keywords.ts`)

**PILOTO COMPLETO — 5/5 categorías rellenas, listo para informar el rediseño del motor
`codex.ts`.** Build ✓ en cada paso. Todo local, sin pushear. Detalle completo en
`memory/project_codex_csm_pilot.md`.

**Siguiente paso natural (a decidir con el usuario):** usar estos 5 catálogos para diseñar y
construir el motor `codex.ts` real (el "archivo por facción que junte TODO" descrito en §1) —
incluye por fin abordar la reclasificación de Psyker (special ability, no keyword), que requiere
ese rediseño para no romper los ~67 usos de `requires_keywords: ["Psyker"]`.

### 🔄 Fase 4 — Migrar el resto de facciones al modelo de 5 categorías (receta optimizada)
Sustituir los digests en prosa uno por uno, facción por facción, una vez validado el piloto CSM.

**Receta de bajo coste (destilada de las 7 lecciones del piloto CSM, pensada para gastar menos
tokens sin perder rigor):**
1. **Reusar el digest existente si lo hay** (`rules-model/<facción>.md`) — ya está validado
   contra los canónicos; no releer Index.html/Army Customisation desde cero.
2. **Extraer roster/unit-types/keywords PROGRAMÁTICAMENTE** de los `.ts`/`.json` de producción
   (no transcribir a mano) — un único script de extracción por categoría, limpiar el `.cjs` al
   terminar. Evita errores de transcripción y relecturas.
3. **Orden por coste creciente:** Slot (lista de roster, trivial) → Unit type (campo programático)
   → Keyword (deriva de armadura/marcas del datasheet + digest) → Special ability (reglas de
   ejército del digest) → Weapon ability (solo MECÁNICA de gating, no el catálogo de ~50
   habilidades — eso ya vive en `coreRules.ts`).
4. **Disciplina anti-duplicación:** si el dato ya es canónico en otro sitio (poderes psíquicos en
   `disciplines.json`, glosario de habilidades de arma en `coreRules.ts`, matriz de Animosity en
   `keywords.ts`), NO copiarlo — solo referenciarlo. Una sola fuente de verdad.
5. **Build solo en checkpoints** (al cerrar cada categoría), no tras cada micro-edición.
6. **No perseguir fantasmas:** si un script de conteo muestra "duplicados" raros, leer la fuente
   real antes de loguear un bug — pueden ser artefactos de regex/comentarios (pasó 2 veces en el
   piloto CSM, ninguna era un bug real).

**Candidata recomendada para empezar:** Chaos Daemons — ya tiene digest completo
(`rules-model/chaos_daemons.md`, §1-§7) y auditoría HTML×HTML COMPLETA, roster más pequeño
(6 slots vs 8 de CSM) → menor coste de "puesta a tierra" inicial.

**Sesión 2026-06-08 (cont. 16) — arrancó Fase 4 con Chaos Daemons, Paso 1 (Slot) COMPLETO:**
creada `engine/codex_chaos_daemons/` (slots.ts + index.ts, mismo patrón que `codex_csm/`).
`CD_SLOTS` migrado directo del digest §4a (37 unidades, 6 slots poblados — HQ 12/Troops 6/
Elites 5/FA 8/HS 5/Fortifications 1; DT y Flyers vacíos, omitidos). Verificado contra los 37
ficheros reales en `data/parsed/chaos_daemons/units/<slot>/` — cuenta exacta, sin drift.
**Hallazgo de paso (GOLDEN RULE en acción):** el digest tiene un typo — "Feculan**t** Gnarlmaw"
— el nombre canónico real (HTML fuente `Feculent Gnarlmaw.html` + producción) es "Feculen**t**
Gnarlmaw"; corregido en `CD_SLOTS` con nota explicando la discrepancia (no se tocó el digest,
solo se documentó en el catálogo nuevo — más barato que editar prosa). Build ✓ (3.12s).

**Paso 2 (Unit type) COMPLETO mismo día:** `CD_UNIT_TYPES` extraído programáticamente de los 37
`.ts` (script `_tmp_extract_types.cjs`, limpiado tras usar). **Bug real de producción
encontrado y arreglado** (no del digest esta vez): la unidad Elite tenía `name: "Demon Brutes"`
(typo, falta la "a"), inconsistente con su PROPIO modelo en el mismo fichero ("Daemon Brute") y
con el canon (`Index.html` dice "Daemon Brutes" verbatim) — corregido `daemon_brutes.ts` +
comentario obsoleto en `resolvers/chaos_daemons.ts`. Build ✓ (2.96s).
**Paso 3 (Keyword) COMPLETO mismo día:** `CD_KEYWORDS` en `keywords.ts` — eje marca (4 dioses,
SIN Mark of Chaos Undivided en CD a diferencia de CSM; grants verbatim del digest §4b, números
sagrados, rivalidades de Animosity referenciadas no duplicadas) + eje facción ("Daemon"/"Greater
Daemon" — inv. saves, Daemonic Instability, tier de precio HQ, stacking de Heraldos). Dos ejes
deliberadamente vacíos y documentados como hechos arquitectónicos confirmados (no huecos):
`armour` (digest §1 dice verbatim que CD no tiene eje de tipo-armadura tipo Terminator/
Cataphractii/Gravis) y `datasheet` (grep confirmó las 37 unidades con `keywords: []` — CD no
tiene eje de identidad tipo Cultist/Death Guard de CSM). Build ✓ (2.93s).
**Paso 4 (Special ability) COMPLETO mismo día:** `CD_SPECIAL_ABILITIES` en `special-abilities.ts`
— reglas generales de armería (§4, 3 bullets verbatim), meta-reglas de ejército que montan sobre
las marcas (Marks=veteran ability, Favored Units, sub-cláusula join de Animosity, ausencia
confirmada de regla de Summoning propia — diferencia arquitectónica real vs CSM), los 6
arquetipos con su god-gating (CD solo permite 0-1 Arquetipo, sin legacies/traits — digest §5),
y mecánicas de §6 cast-system (solo psíquico, 3 disciplinas god-gated, sin disciplina de Khorne,
grants de disciplina general, psyker vía Mark of Tzeentch). Disciplina anti-duplicación
respetada: NO se repitieron grants/números sagrados/rivalidades (ya en CD_KEYWORDS) ni los 18
poderes nombrados (ya en disciplines.json). Build ✓ (2.94s).
**Hallazgo abierto marcado para Fase 5:** CD hereda el MISMO hueco sin arreglar de Animosity
("personaje con marca solo puede unirse a unidad de su marca o sin marca") que se encontró y
arregló para CSM esta sesión (`ki-csm-animosity-joinmark-01`) — ese fix se limitó a CSM
deliberadamente; CD queda con la misma brecha, documentada inline, sin KI propia aún.
**Paso 5 (Weapon ability) COMPLETO mismo día — CATEGORÍA FINAL:** `CD_WEAPON_ABILITIES` en
`weapon-abilities.ts` — tabla de armería única (sin split por marca, a diferencia de CSM),
gateo por superíndice de dios, la resolución by-design de la colisión de glifo ᵀ Tzeentch/
Terminator (re-documentada en la fuente nueva), equipo de acceso universal sin superíndice, el
gate de equipo de Vehículo, gates finos solo-en-prosa, ítems que mutan unit-type por elección,
el modelo de precios a dos columnas "POINTS"/"POINTS GREATER DEMON", y una simplificación
estructural genuina de CD vs CSM: NO existe ningún nivel de precio veteran-ability/vehicle-
upgrade (`p_veh` sin uso, `has_veteran_abilities` false en toda la facción). Build ✓ (3.03s).

## 🏁 FASE 4 — CHAOS DAEMONS: COMPLETA (2026-06-08)

5/5 categorías (Slot→Unit type→Keyword→Special ability→Weapon ability) migradas, build limpio
en cada checkpoint. Segunda facción migrada al modelo de 5 categorías tras el piloto CSM —
receta optimizada re-validada con cero fricción y otros 2 bugs reales atrapados (Feculant→
Feculent, Demon→Daemon Brutes). Hallazgo abierto: CD hereda el hueco de Animosity join-clause
de CSM (ki-csm-animosity-joinmark-01, fix limitado a CSM) — sin KI propia, documentado inline.
Local, sin pushear. Próxima facción candidata: cualquiera de las 🟠 auditadas con digest
existente (SM/CSM-engine/IG/GK) — el usuario decide por prioridad, no solo por coste.

**Bonus mismo cierre:** "tú elige, lo más eficiente" → arreglado el hallazgo abierto de Animosity
(no esperar a Fase 5): `chaos_daemons.md` §4b confirmó que la cláusula de join YA estaba en el
texto canónico PROPIO de CD (verbatim, no prestado de CSM) — el comentario original "CSM-only,
CD untouched" estaba mal. Extendido el guard en `UnitCard.tsx` a ambas facciones, KI
`ki-csm-animosity-joinmark-01` actualizada con la corrección. Build ✓ (3.16s).

---

### 🔄 Fase 4 — Space Marines (3ª facción migrada)

**Sesión 2026-06-08 (cont. continúa) — arrancó SM, Pasos 1-2 COMBINADOS:** creada
`engine/codex_space_marines/{slots,unit-types,index}.ts`. A diferencia de CD (dos pasadas
separadas), en SM los campos `name` y `unit_type` viven en el MISMO fichero `.ts` de
producción → un solo script de extracción rellenó `SM_SLOTS` (8 slots/74 unidades, incluyendo
Flyers — la única categoría que CD no tiene en absoluto) Y `SM_UNIT_TYPES` de una vez. Variante
aún más barata de la receta — reutilizar cuando roster+tipo co-localicen así.

Cruzado contra las menciones dispersas de roster en el digest (Deathwing Knights/Blood Claws/
Inceptor/Terminator Squad/Assault Squad) — **cero drift, sin typos esta vez** (pasada limpia, a
diferencia de los 2 bugs reales de CD — confirma que el "audit gratis" es un beneficio
ocasional, no garantizado; a veces el dato simplemente está limpio).

**Cuidado aplicado:** se preservó la distinción del digest §6 entre `unit_type` ESTÁTICO
(catalogado aquí = "Infantry" para Blood Claws) y la mutación dirigida por opción
(`OptionEffect.set_unit_type`, ya correcta en el engine desde v0.51, ki-jumppack) — NO se
"corrigió" lo que el motor ya hace bien en otro sitio. Build ✓ (2.90s).

Próximo: Paso 3 (Keyword — 3 ejes, los 3 poblados a diferencia de CD: armadura
Gravis/Terminator/Cataphractii ya gateada desde v0.51 solo documentar; marca VACÍO por diseño
— digest dice verbatim "SM has no marks"; capítulo/datasheet = 9 capítulos).

**Paso 3 (Keyword) COMPLETO mismo día:** `SM_KEYWORDS` en `keywords.ts` — hallazgo real: la
distribución de ejes de SM es la INVERSA exacta de CD (CD: 2 poblados/2 vacíos → SM: 1
poblado/3 vacíos):
- `armour` POBLADO (6 entradas — el eje más rico de SM): Gravis/Terminator/Cataphractii/
  Master-crafted/Phobos/Power armour, mecanismo de gateo ya enviado y verificado en v0.51
  (`modelRestrictsToGravisSubset`/`TermSubset` — se documenta, no se rederiva).
- `mark` VACÍO por diseño — digest §1 verbatim: "NONE. SM has no marks... la identidad de
  capítulo se expresa vía Legacy, no vía keyword por modelo".
- `faction` VACÍO por diseño — grep en armería+digest de cualquier keyword "Space Marine" que
  gatee algo: ninguna (solo el nombre literal "Space Marine bike"). "They Shall Know No Fear"
  es una regla de ejército aplicada directamente desde Index.html, no derivada de keyword —
  diferencia genuina con la "Daemon" de CD que sí gatea grants reales.
- `datasheet` VACÍO — grep de las 74 unidades: `keywords[]` = `[]` en todas. TERCERA
  confirmación (tras CSM=6/CD=0) de que un eje datasheet poblado es la EXCEPCIÓN, no la norma.

Tres ejes vacíos e independientemente fundamentados en una sola facción es en sí mismo un
hallazgo: el modelo de keywords de SM casi colapsa a un único eje rico (armadura) + el sistema
Legacy/capítulo (vive en SM_SPECIAL_ABILITIES, Paso 4) — una forma genuinamente más simple que
la de CSM, eco del patrón "menos primitivas distintas" que ya vimos en CD. Build ✓ (2.90s).

Próximo: Paso 4 (Special ability — digest §3-5: TSKNF, los 8 arquetipos, las 9 Legacies de
capítulo + disciplinas, los 19 traits con su tabla de costes de 3 columnas. Disciplina
anti-duplicación: comprobar primero si la tabla de traits ya vive como dato estructurado en
`traits/space-marines.ts` — el digest §6 confirma que está LIVE vía TRAIT_EFFECTS).

**Paso 4 (Special ability) COMPLETO mismo día:** `SM_SPECIAL_ABILITIES` en
`special-abilities.ts` (4 categorías: army-rule/archetype/legacy-system/trait-system). Cubre:
"They Shall Know No Fear" (verbatim, confirmado army-wide no derivado de keyword — eco del
hallazgo del Paso 3 sobre el eje `faction` vacío), la lista confirmada de ausencias "sin
marcas/sin summoning/sin favored" (el PORQUÉ de que el modelo de keywords de SM colapse a un
solo eje), los 8 arquetipos completos, las reglas de selección del sistema Legacy (tope 0-1/
0-2) + el mapa completo de los 9 capítulos↔Legacy↔disciplina incluyendo el caso especial de
Alien Hunters (acceso a Inquisición, ya enviado en v0.56), y las reglas del sistema Trait + sus
dos excepciones sin TraitEffect (Expanded Armory = solo levanta el tope, Path of Damnation =
especial de un modelo).

**Disciplina anti-duplicación sostenida con fuerza**: NO se re-codificó la tabla de costes/
TraitEffect de los 19 traits (ya canónica y LIVE en `traits/space_marines.ts`
SM_TRAIT_EFFECTS, verificada cableada en v0.51 ki-22a) ni el mapa Legacy→disciplina (ya LIVE en
`legacies/space_marines.ts` SM_LEGACY_DISC_MAP) — ambas son dato estructurado real del motor;
referenciar en vez de copiar evita una segunda fuente de verdad que derivaría en el próximo
balance pass. El test anti-duplicación más limpio de toda la migración SM hasta ahora — a
diferencia de CD (donde special-abilities documentaba meta-reglas sobre datos de keyword), aquí
documentaba meta-reglas sobre OTROS FICHEROS DE MOTOR YA ESTRUCTURADOS (una prueba un nivel más
profunda, superada limpiamente). Build ✓ (2.94s).

Próximo: Paso 5 (Weapon ability — FINAL, digest §2-3: tabla de gateo ᴳ/ᵀ, ítems con gate de
texto — Auto boltstorm gauntlet/Absolvor bolt pistol/Relic blade/Selfless healer/Chapter
banner/Book of Malcador —, el modelo de puntos per-model vs columna-char-plana, la forma de
coste per-unit vs per-W/HP de las habilidades veteranas. Espejo de la disciplina anti-
duplicación del Paso 5 de CD: documentar solo MECÁNICAS de gateo, las habilidades de arma con
nombre quedan en coreRules.ts).

**Paso 5 (Weapon ability, FINAL) COMPLETO mismo día — FASE 4 SM 5/5 TERMINADA:**
`SM_WEAPON_ABILITIES` en `weapon-abilities.ts`. Hallazgo titular: el gateo por glifo ᴳ/ᵀ es la
INVERSA exacta del gateo por superíndice de dios de CD (los glifos de CD AÑADEN acceso vía
keyword de Marca; los de SM RECORTAN el pool de un modelo con armadura restringida — dirección
opuesta, mismo mecanismo). Cubre además: las 4 combinaciones de pools por glifo (el pool sin
glifo excluye por diseño a usuarios de Gravis/Terminator), exclusión mutua Gravis⟷Terminator,
6 ítems con gate de texto (misma CLASE de gate-en-prosa-no-modelado que CD — patrón
cross-facción, no peculiaridad de SM), el gate de equipo "Jump pack" (desambiguado de la
mecánica de reemplazo de tipo "Jump Pack Infantry", más rica), el modelo de puntos a 2
columnas, y — el segundo hallazgo titular — el split de coste per-unit vs per-Wound/Hull-point
de las habilidades veteranas: la INVERSA exacta de la simplificación de CD ("no existe ningún
nivel de precio para habilidades veteranas" — CD_WEAPON_ABILITIES "structural"). SM ejercita el
modelo más rico que CD omite por completo.

**Segundo par-inverso encontrado** (el primero fue en el Paso 3, ejes de keyword): CD y SM
parecen sentarse en extremos opuestos de un espectro "cuántas primitivas distintas ejercita
esta facción" — no es casualidad de plantillas parecidas, es un patrón estructural recurrente
entre estas dos facciones específicas. Disciplina anti-duplicación sostenida hasta el final:
el sufijo `*` de los Traits se documenta como mecánica de FORMA-DE-COSTE solamente, los valores
siguen viviendo en `traits/space_marines.ts`. Build ✓ (2.88s).

**FASE 4 — SPACE MARINES COMPLETA: 5/5 categorías** (Slot/Unit type/Keyword/Special
ability/Weapon ability), 3ª facción migrada tras el piloto CSM y Chaos Daemons (2ª, completa) —
receta validada a escala una tercera vez sin fricción de proceso. Local, sin pushear, build ✓
en todo momento. Próximo: elegir 4ª facción a migrar (o retomar el hallazgo abierto de CD —
el "join-gap" de Animosity propio de CD, aún sin KI registrado, ver memoria CD).

---

### 🔄 Fase 4 — Inquisition (4ª facción migrada)

**Sesión 2026-06-08 (cont. continúa) — arrancó Inquisition, Pasos 1-2 COMBINADOS:** elegida
deliberadamente como la facción más barata de migrar de las cuatro: el roster MÁS PEQUEÑO hasta
ahora (5 slots/13 unidades, frente a CSM 8/62, CD 6/37, SM 8/74) Y el digest §5 confirma que NO
tiene arquetipos/legacies/traits en absoluto (`Index.html` no tiene pestaña de Army
Customisation) — colapsa el Paso 4 a solo "reglas de ejército + alineación de Ordo". Además
tiene un digest reciente y completamente auditado/corregido (v0.56).

Creada `engine/codex_inquisition/{slots,unit-types,index}.ts`. Igual que SM (y a diferencia de
CD), `name` y `unit_type` co-localizan en el mismo fichero de producción → una sola pasada de
extracción rellenó `INQ_SLOTS` (HQ 1/Troops 5/Elites 1/Heavy Support 1/Dedicated Transport 5 —
sin Fast Attack, sin Fortifications, sin slot Flyers dedicado) y `INQ_UNIT_TYPES` (13 entradas)
de una vez. Cruzado contra las menciones del digest — **cero drift, sin typos** (segunda
facción limpia seguida tras SM).

**Hallazgo arquitectónico a recordar**: las 2 unidades tipo Flyer (Corvus Blackstar, Valkyrie —
`unit_type: "Flyer, Vehicle"`) viven dentro de Dedicated Transport, su slot real de producción —
NO en un slot Flyers dedicado (Inquisition no tiene ninguno, a diferencia de SM que sí tiene
categoría Flyers poblada). "Flyer" aparece aquí solo como etiqueta de unit_type, nunca como eje
de organización de slot — la taxonomía de slots y la de unit_type son ejes independientes que
pueden divergir por facción.

**Cuidado aplicado**: confirmado vía digest (§5: "No archetypes/legacies/traits" + sin opciones
estilo jump-pack en ninguna de las 13 unidades) que NO existe distinción estática-vs-mutada de
`unit_type` que preservar aquí — a diferencia de SM (4 unidades mutan tipo vía `OptionEffect.
set_unit_type`). Cada entrada en `INQ_UNIT_TYPES` es el tipo único, final y estático de su
unidad — documentado como ausencia confirmada, no omitido en silencio. Build ✓ (2.96s).

Próximo: Paso 3 (Keyword — 3 ejes candidatos: `armour` con Power/Plate/Terminator armor, ᵀ-gate
ya engine-derived, sin Cataphractii/Gravis "Inquisition has no analogue"; `Ordo allegiance`
Hereticus/Malleus/Xenos — estructuralmente NO es una marca, es un ARMORY-ITEM-PICK que gatea un
pool army-wide vía la nueva primitiva v0.56 `requires_army_item`/`isArmyItemGateBlocked`,
genuinamente su propio eje, no forzarlo en la plantilla `mark` de CSM/CD; `faction`/`datasheet`
probablemente vacíos — verificar con grep antes de declarar, siguiendo la disciplina de
3-confirmaciones ya establecida).

**Aviso del usuario, mid-Paso-3 (2026-06-08):** el creador le dijo que las reglas de Army
Customisation de Inquisición VAN A CAMBIAR en una futura actualización — el hecho "sin
arquetipos/legacies/traits" en el que se apoya esta migración (digest §5, basado en el
`Index.html` ACTUAL) puede quedar desactualizado. No bloquea el trabajo de hoy (GOLDEN RULE:
nos basamos en los ficheros canónicos como existen AHORA), pero el Paso 4
(`INQ_SPECIAL_ABILITIES`) será el primero a re-auditar cuando lleguen ficheros nuevos —
anotado en la memoria de la facción para no perderlo.

**Paso 3 (Keyword) COMPLETO mismo día:** `INQ_KEYWORDS` en `keywords.ts` (interfaz de 5 ejes:
armour/ordo/mark/faction/datasheet). Hallazgo titular: Inquisición tiene su PROPIA forma
genuina — no encaja limpiamente ni en la plantilla `mark` de CSM/CD ni en la de armadura pura
de SM:
- `armour` POBLADO (3): Power/Plate/Terminator armor — ᵀ-gate estándar ya engine-derived, con
  la ausencia interna explícita del digest §1 "sin análogo Cataphractii/Gravis".
- `ordo` POBLADO (4) — eje PROPIO de Inquisición, con su propio valor de eje dedicado en lugar
  de forzarlo en `mark`. Fundamentado en texto verbatim de descripción de ítem que prueba que
  la alineación de Ordo es estructuralmente un ARMORY-ITEM-PICK (nueva primitiva v0.56
  `requires_army_item`/`isArmyItemGateBlocked`, generalizada `ArmoryItem→Unit`) que gatea TANTO
  15 ítems de armería COMO las 3 unidades Ordo Warband — un solo mecanismo, dos superficies.
  Genuinamente NO es una marca: `locked_mark` confirmado `null` en las 13 unidades vía grep.
- `mark` VACÍO — pero por una razón DISTINTA a la de SM ("no existen marcas", verbatim
  "NONE"): aquí el equivalente funcional (Ordo) SÍ existe, pero deliberadamente modelado con
  otra primitiva. Lección a recordar: "eje vacío" puede significar "concepto ausente" (SM) o
  "concepto presente, modelado en otro sitio" (Inquisición) — no confundir las dos razones.
- `faction` VACÍO — grep en digest+armería de cualquier keyword "Inquisition"/"Inquisitorial":
  ninguna. La regla de Psyker es un grant genérico de core rules vía `is_psyker`, no derivado
  de keyword.
- `datasheet` VACÍO — grep de las 13 unidades: `keywords[]` = `[]` en todas. CUARTA
  confirmación (CSM=6, CD=0, SM=0, ahora Inquisición=0) de que un eje datasheet poblado es la
  EXCEPCIÓN, no la norma.

Build ✓ (2.97s).

Próximo: Paso 4 (Special ability — el más barato de cualquier facción migrada: solo la regla de
Psyker + las notas de disciplinas psíquicas + la ausencia confirmada de arquetipos/legacies/
traits + la nota estructural de las unidades Ordo Warband, ya cubiertas mecánicamente por el
eje `ordo`. ⚠ recordar el aviso del usuario arriba — esta es la categoría con más probabilidad
de necesitar re-auditoría si llegan ficheros actualizados con los cambios prometidos por el
creador).

**Paso 4/5 — Special ability — COMPLETO mismo día (2026-06-08):** `INQ_SPECIAL_ABILITIES`
escrito en `special-abilities.ts` (4 categorías: army-rule/cast-system/confirmed-absence/
unit-shape). Confirmado: el Paso 4 MÁS BARATO de cualquier facción migrada — solo 5 entradas
(vs 30+ en CSM/SM). Cubre: la regla Psyker (verbatim, llevada por `is_psyker` en exactamente
3/13 unidades — Inquisitor + 2 Ordo Warbands — confirma que NO se deriva de keyword, coherente
con el eje `faction` vacío del Paso 3), la nota de disciplinas generales (pool compartido, sin
migración), la nota de acceso a Heresius+Telethesia (los 12 poderes nombrados se quedan en
`disciplines.json`, disciplina anti-duplicación respetada), la propia entrada de "ausencia
confirmada de arquetipos/legacies/traits", y la nota estructural de las 3 unidades Ordo
Warband (NO son arquetipos — son datasheets de Tropas con gating normal; el mecanismo de
gating ya vive en el eje `ordo` de INQ_KEYWORDS, esta entrada documenta solo su NATURALEZA
textual).

**El aviso del usuario del 2026-06-08 queda embebido directamente en el fichero** como
comentario de cabecera de advertencia: toda la forma de esta categoría depende de la AUSENCIA
ACTUAL de una pestaña Army Customisation, y el creador le dijo al usuario que eso va a cambiar.
La propia entrada "confirmed-absence" lleva un ⚠ inline señalando a futuros lectores que
revisen `Index.html` antes de confiar en ella. Build ✓ (2.93s).

Próximo: Paso 5/5 (Weapon ability — FINAL, §2-3 del digest: tabla de gating ᵀ, gating Ordo
ᴴ/ᴹ/ˣ, Veteran Abilities, Vehicle Equipment, modelo de puntos). Completaría Inquisición 5/5 —
4ª facción migrada al completo.

**Paso 5/5 — Weapon ability — COMPLETO, FINAL (2026-06-08, mismo día):** `INQ_WEAPON_ABILITIES`
escrito en `weapon-abilities.ts` (3 categorías: gating/points/structural) — cierra Inquisición
en 5/5. Cubre: gating ᵀ (el más SIMPLE de cualquier facción — gate binario único, sin split
ᴳ/ᵀ porque Inquisición no tiene análogo Cataphractii/Gravis), gating Ordo ᴴ/ᴹ/ˣ (15 ítems vía
`requires_army_item`/`isArmyItemGateBlocked` — documentado el MECANISMO solamente, la
semántica de concesión ya vive en el eje `ordo` de INQ_KEYWORDS desde el Paso 3, anti-
duplicación respetada), los gates de Veteran Abilities (8) y Vehicle Equipment (5) (ambos
arreglados en v0.56), y el modelo de puntos §3 — `getItemPts` estándar, el split de precio
veteran por-modelo / por-Wound-o-Hull-point, y precio plano `× item.size` para equipo de
vehículo.

**Confirma que el par-inverso de pricing SM/CD es real, no un caso aislado de SM**:
Inquisición SÍ tiene el split de precio veteran más rico (per-unit-vs-per-Wound/Hull-point)
que CD no tiene en absoluto — cae del lado de SM en esa división estructural. Una segunda
facción aterrizando del mismo lado refuerza la teoría del "espectro de cantidad de
primitivas". Build ✓ (3.19s).

## 🟢 INQUISICIÓN — FASE 4 COMPLETA 5/5 (2026-06-08)

Cuarta facción migrada al completo al modelo de 5 categorías (Slot/Unit type/Keyword/Special
ability/Weapon ability), tras codex_csm (piloto) + Chaos Daemons (2ª) + Space Marines (3ª).
Confirmada como la facción MÁS BARATA de migrar de principio a fin (roster más pequeño + sin
arquetipos/legacies/traits) — valida la decisión delegada "tú elige, lo más eficiente". El
aviso del usuario del 2026-06-08 sobre cambios futuros en Army Customisation queda embebido
directamente en `special-abilities.ts` como comentario de advertencia + ⚠ inline, listo para
señalar la necesidad de re-auditoría cuando lleguen ficheros fuente actualizados. Local, sin
pushear.

### 🟢 Grey Knights — digest construido desde cero (2026-06-08)

A diferencia de CSM/CD/SM/Inquisición, GK no tenía `rules-model/grey_knights.md` — paso previo
obligatorio antes de poder migrarla a Fase 4. Construido completo (6 secciones) y aterrizado en
Index/Armory/Army Customisation/disciplinas psíquicas/Prayers/datasheets de muestra + cruzado
contra los 22 ficheros de producción. Build ✓ (3.14s). Detalle completo en
[[project_grey_knights_digest]] (memoria).

**Hallazgo importante a tener en cuenta antes de migrar GK**: el armory de GK tiene 18 ítems
(8 Habilidades de Veterano + 10 Equipo de Vehículo) sin etiquetar con `category`/`p_veh` —
exactamente el mismo bug que tuvo Inquisición antes de v0.56. Recomendado arreglarlo en datos de
producción ANTES de empezar la migración Fase 4 de GK (candidato a `ki-gk-vetvehcategory-01`).

---

### 🟢 Fase 4 — Grey Knights (5ª facción migrada, 2026-06-11)

**Pre-requisito resuelto primero**: `ki-gk-vetvehcategory-01` arreglado (status `fixed`) —
los 18 ítems (8 Veteran Abilities + 10 Vehicle Equipment) ahora llevan `category: 'veteran'|
'vehicle'`. Además, comparando contra el Armory.html propio de GK (GOLDEN RULE), se vio que la
columna "POINTS MONSTROUS CREATURES & VEHICLES" había quedado mal mapeada a `p_char` en vez de
`p_veh` — corregido: `p_veh` = 2 (o `null` para Infiltrator/Vanguard, que en el HTML muestran
"-"), `p_char: null` para los 8 (el motor cae a `p_unit` cuando `p_char` es null).

**5/5 categorías completadas** (`engine/codex_grey_knights/`), mismo orden que Inquisition:
- `slots.ts` → `GK_SLOTS` (22 unidades / 7 slots, extracción combinada nombre+unit_type)
- `unit-types.ts` → `GK_UNIT_TYPES` (sin `set_unit_type` dinámico — Interceptor Squad es estático)
- `keywords.ts` → `GK_KEYWORDS` (eje `armour` con 2 entradas — Power armor + Terminator, único
  ᵀ-gate binario sin Cataphractii/Gravis, igual forma que Inquisition; ejes `mark`/`faction`/
  `datasheet` vacíos)
- `special-abilities.ts` → `GK_SPECIAL_ABILITIES` (7 reglas de ejército §4 + Psyker/Faithful +
  2 Archetypes [Chamber of Purity, Hall of Champions] + 8 Legacies de un solo poder bono +
  ausencia confirmada de Traits)
- `weapon-abilities.ts` → `GK_WEAPON_ABILITIES` (gating ᵀ + "Only for X" + veteran/vehicle gates +
  modelo de puntos, incl. nota de que `armour_compat: string[]` ya está en formato array-keyword,
  por delante de las otras 4 facciones migradas en ese eje)

Disciplina anti-duplicación mantenida: los 12 poderes Sanctity/Dominus + 8 poderes de Legacy
siguen en `psychic/disciplines.json`, las 8 Prayers en `psychic/prayers.json`, los AOP-shuffles
de Archetypes/Legacies en `archetypes.json` — este módulo solo documenta acceso/estructura.

Build ✓ (422ms). Changelog v0.59 + known-issues actualizados. Local, sin pushear.

---

### 🟢 Imperial Guard — digest construido desde el .ods (2026-06-11)

IG estaba 🟠 auditada (pasadas de bugs v0.17/v0.21) pero **sin digest**. Construido desde cero
aterrizando en el **`.ods` como canon** (corrección del usuario: para auditar datos, el `.ods`
manda, no el HTML). Digest completo (6 secciones) en `rules-model/imperial_guard.md`.

**Hallazgos clave:**
- **Vocabulario de keywords más simple de todas**: los 4 ejes (armour/mark/faction/datasheet)
  VACÍOS. Sin Terminator/Gravis — la "armadura" de IG son compras de stat (Plate 4+/Master-crafted
  2+/Refractor 5+inv/Bionics 6+inv). Marks solo vía archetype Traitor Guard. Gating de wargear
  100% prose ("Only for X") + flags (`is_vehicle`/`is_character`/`is_psyker`/`has_veteran_abilities`).
- **…pero la customización más rica**: 11 Archetypes (3 cross-facción ally-matrix: Brood
  Brothers→GSC, Gue'vesa→Tau, Traitor Guard→CSM), 7 Legacies (cada una concede una Order; salvo
  Ministorum World = "+1 Trait"), 16 Traits con pricing de 3 columnas (NORMAL/CHARACTER/MC&V, `*`
  = por Wound/Hull). Cross-check producción 11/7/16 — limpio.
- **Mecánica estrella = Orders** (oficiales reparten órdenes; unidades ≤12" las usan; 9 infantry
  + 3 vehicle + 6 legacy). Más Hymns of Battle (Preacher, 5) y disciplina Psikana.

**Fixes/gaps pre-migración (§6):**
- `ki-ig-vetvehcategory-01` **ARREGLADO** (gemelo exacto de GK): 8 Veteran Abilities + 16 Vehicle
  Upgrades sin `category`. Aterrizado en el `.ods`: veteran → `category:'veteran'`, `p_veh` de la
  columna M&V (2, o null Infiltrator/Vanguard), `p_char:null`; vehicle → `category:'vehicle'` +
  mover POINTS de `p_char`→`p_unit` (el motor cobra vehicle desde `p_unit`; el parser lo había
  puesto en `p_char` con `p_unit:null` → habrían costado 0). Matiz IG: el equipo normal SÍ usa
  `p_char` (columna real "POINTS CHARACTER MODELS"), así que el clear de `p_char` solo tocó las 8
  filas de veteranía; el "Vox" duplicado de equipo (no el de vehicle upgrades) quedó intacto.
- `ki-ig-psychic-unwired-01` **PENDIENTE**: el `.ods` tiene disciplina Psikana + Hymns, pero el
  loader (`loaders.ts:123`) solo carga units+armory+archetypes y `psychic/` está vacío → gap real
  (no simplificación, el canon las tiene). Alcance mayor, pasada dedicada aparte.
- 2 artefactos de parser en `unit_type` (frase "Battlemutt..." y "(Engineseer only)") — cosmético.

Build ✓ (430ms). Digest + `ki-ig-vetvehcategory-01` fix + changelog v0.59 + known-issues +
plan + memoria. Local, sin pushear.

**Migración Fase 4 COMPLETA 5/5** (`engine/codex_imperial_guard/`, 6ª facción, mismo día):
- `slots.ts` → `IG_SLOTS` (60 unidades / 7 slots, desde `units.json` `slot_to_units`)
- `unit-types.ts` → `IG_UNIT_TYPES` (estático; 2 artefactos de parser documentados verbatim:
  Ratlings "Battlemutt...", Engineseer "(Engineseer only)" — no corregidos en silencio)
- `keywords.ts` → `IG_KEYWORDS` (los 4 ejes VACÍOS — primera facción sin gate de armadura;
  ausencia documentada eje por eje)
- `special-abilities.ts` → `IG_SPECIAL_ABILITIES` (Orders signature + Weapon team crews + Hymns +
  Psikana + 11 Archetypes [3 cross-facción] + 7 Legacies [order-grant] + 16 Traits [3-col] +
  nota de gap psíquico)
- `weapon-abilities.ts` → `IG_WEAPON_ABILITIES` (sin gate de keyword — el caso más puro; prose
  "Only for X" + flags; veteran/vehicle gates; modelo de puntos incl. trait pricing de 3 columnas)

Anti-dup mantenida: archetypes/legacies/traits siguen en `archetypes.json`; Psikana/Hymns
documentadas pero pendientes de producción (`ki-ig-psychic-unwired-01`). Build ✓ (475ms). Local,
sin pushear.

---

### 🟢 Adeptus Mechanicus — digest desde el .ods + Fase 4 (7ª facción, 2026-06-11)

AdMech era 🔴. Digest construido desde el `.ods` (`rules-model/adeptus_mechanicus.md`).
**Hermana estructural de IG**: los 4 ejes de keyword VACÍOS (armadura = stat-tier; sin marks salvo
archetype Dark Mechanicum), pero customización rica + mecánica estrella propia.

**Hallazgos:**
- 29 units / 7 slots. Sin `armourKeyword`, sin marks, sin `keywords[]` (7ª confirmación: eje
  datasheet = excepción solo-CSM).
- **Mecánica estrella = Canticles of the Omnissiah** (elige 1 canticle/Command phase; unidades ≤9"
  de un Choir Master la ganan a 4+; Monotask = excepción). 6 canticles base + 7 de Legacy.
- 5 Archetypes (Dark Mechanicum→CSM/Marks; Cybernetica Cohort + Ordo Reductor tiran del
  suplemento HH Mechanicum), 7 Legacies (= los 7 Forge Worlds, cada uno da Armory + 1 canticle),
  16 Traits (3 columnas, como IG). Cross-check 5/7/16 limpio.
- **Doctrina Imperatives** (4) = análogo de veteranía, pero gated por opción de datasheet ("may
  select one Doctrina Imperative", 13 unidades), NO por `has_veteran_abilities` (0 unidades).

**Fixes/gaps:**
- `ki-admech-vetvehcategory-01` **ARREGLADO**: 9 Vehicle Equipment etiquetados `category:'vehicle'`.
  A diferencia de IG, el POINTS ya estaba en `p_unit` → solo tagging, sin move.
- `ki-admech-doctrina-gating-01` **PENDIENTE**: los 4 Doctrina Imperatives sin gate por-unidad
  (salen a cualquier unidad con armory en vez de a las 13 con la opción). No tocado a ciegas
  (etiquetar `category:'veteran'` sin flag por-unidad los ocultaría, ya que 0 unidades tienen
  `has_veteran_abilities`). Pasada multi-unidad dedicada.

**Migración Fase 4 COMPLETA 5/5** (`engine/codex_adeptus_mechanicus/`): slots (29/7) · unit-types
(estáticos, sin artefactos) · keywords (4 ejes vacíos) · special-abilities (Canticles + Choir
Master + Monotask + 5/7/16 + gap-note Doctrina) · weapon-abilities (sin keyword gate + prose +
"Forge World X only" + puntos). Anti-dup: archetypes/legacies/traits en `archetypes.json`, Forge
World armories en `legion_forge_world.json`. Build ✓ (413ms). Local, sin pushear.

---

### 🟢 Adeptus Sororitas — digest desde el .ods + Fase 4 (8ª facción, 2026-06-11)

Sororitas era 🔴. Digest desde el `.ods` (`rules-model/adeptus_sororitas.md`). **Hermana de IG/
AdMech** en keywords (4 ejes vacíos, sin gate de armadura) pero **única (con CD) en no tener tier
de veteranía** — su armory no tiene sección Veteran Abilities/Doctrina, 0 unidades con
`has_veteran_abilities`.

**Hallazgos:**
- 27 units / 6 slots (sin Flyers/Fortifications). Sin `armourKeyword`, sin marks, sin `keywords[]`
  (8ª confirmación eje datasheet = excepción solo-CSM).
- **Mecánica estrella = Acts of Faith** (economía de Faith points: Pious genera, Anointment/Blood
  of Martyrs suman, Emperor's Judgement reembolsa). + Shield of Faith (6+inv army-wide) + Witch
  hunters (Inquisition Ordo Hereticus + Assassins — YA shippeado vía `intrinsic_allies`).
- 3 Archetypes (AOP-shuffle, sin ally-matrix), 7 Legacies (6 = Orders Militant → Order Armory;
  "The Holy Trinity" = grant especial de 3 traits, ya fijado), 12 Traits (3 columnas). Cross-check
  3/7/12 limpio.

**Fix:** `ki-sororitas-vetvehcategory-01` ARREGLADO — 9 Vehicle Upgrades etiquetados (POINTS ya en
`p_unit`, como AdMech → solo tagging). Sin gap de veteranía (no aplica, como CD).

**Migración Fase 4 COMPLETA 5/5** (`engine/codex_adeptus_sororitas/`): slots (27/6) · unit-types
(estáticos; Seraphim/Zephyrim/Geminae/Living Saint son Jump Pack Infantry estático) · keywords
(4 ejes vacíos) · special-abilities (Acts of Faith + Pious + Shield of Faith + Witch hunters +
3/7/12) · weapon-abilities (sin keyword gate; sin tier de veteranía). Build ✓ (482ms). Local, sin
pushear.

---

### 🟢 Adeptus Custodes — digest desde el .ods + Fase 4 (9ª facción, 2026-06-11)

Custodes era 🔴. Digest desde el `.ods` (`rules-model/adeptus_custodes.md`). **Hermana de GK/
Inquisition** (NO de IG/AdMech/Sororitas): tiene eje de armadura poblado (ᵀ-gate Terminator único)
+ tier de veteranía (17/19 unidades).

**Hallazgos:**
- 19 units / 6 slots (sin Flyers/Fortifications). Eje `armour` = Terminator ᵀ-gate (18 items
  `term_compat`, los visten Allarus/Aquilon). **Caveat**: producción NO setea `armourKeyword` — el
  gate va por `term_compat` boolean + derivación por nombre (estado pre-keyword-seam, como CSM).
  Ejes mark/faction/datasheet vacíos (9ª confirmación datasheet = solo-CSM).
- **Mecánica estrella = Shield Host** (objetivos por cuadrante + 12" + Objective secured! + cap de
  Battleshock + Precision(5+) army-wide). + Lightning strike (Deep Strike por 1000pts).
- 2 Archetypes (AOP-shuffle), 5 Legacies (= los 5 Shield Hosts → Host Armory), **0 Traits**
  (ausencia genuina, el budget ni los menciona). Cross-check 2/5/0 limpio.
- Equipo regular = **una sola columna POINTS** (sin "POINTS CHARACTER MODELS", a diferencia de
  IG/AdMech/Sororitas) → solo `p_unit`. Encaja con que los Custodes son todos modelos élite.

**Fixes/gaps:**
- `ki-custodes-vetvehcategory-01` **ARREGLADO**: 8 Veteran (category:'veteran' + p_veh de M&V,
  p_char:null — como GK) + 6 Vehicle (category:'vehicle', POINTS ya en p_unit). El fix de veteranía
  SÍ aplica (17/19 unidades con `has_veteran_abilities`), a diferencia de AdMech.
- `ki-custodes-vigilators-phantom-01` **PENDIENTE**: "Vigilators" está en `slot_to_units.Elites`
  pero sin datasheet en `units` (referencia fantasma). Excluido del codex.

**Migración Fase 4 COMPLETA 5/5** (`engine/codex_adeptus_custodes/`): slots (19/6, Vigilators
excluido) · unit-types (estáticos) · keywords (armour: Terminator; resto vacío) · special-abilities
(Shield Host + Lightning strike + 2/5/0) · weapon-abilities (ᵀ-gate + veteran + vehicle + puntos +
nota pre-keyword-seam). Build ✓ (549ms). Local, sin pushear.

---

### 🟢 Dark Eldar — digest desde el .ods + Fase 4 (10ª facción, 2026-06-11)

Dark Eldar era 🔴. Digest desde el `.ods` (`rules-model/dark_eldar.md`). **HEADLINE: 2ª facción
(tras CSM) con eje `datasheet` POBLADO** — las 3 sub-facciones Kabal/Coven/Cult se modelan vía el
array `keywords[]` (el modelo objetivo de keywords).

**Hallazgos:**
- 19 units / 7 slots. Sub-facción vía `keywords[]`: Kabal(2)/Coven(5)/Cult(4)/ninguna(3, "-")/
  las-tres(5, "Coven, Cult, Kabal"). Ejes armour/mark/faction vacíos. Sin armourKeyword, 0 veteran.
- **Mecánicas estrella = Combat drugs** (6, pick por unidad) + **Power through Pain** (token
  economy, 6 bonuses) + Visitors of the Black Library (acceso Harlequins) + Webway raid (Infiltrate
  por 1000pts).
- 5 Archetypes (3 de pureza de sub-facción: Trueborn=Kabal/Haemoxytes=Coven/Bloodbrides=Cult, que
  filtran el roster por el eje datasheet; + Coordinated Raid + Ynnari→Eldar), 3 Legacies (armerías
  Coven/Wych/Kabal), **22 Traits TODOS gated por sub-facción** ("Only for <Coven>/<Cult>/<Kabal>",
  el gating de traits más granular visto). Cross-check 5/3/22 limpio.

**Fixes/gaps:**
- `ki-dark-eldar-vetvehcategory-01` **ARREGLADO**: 7 Vehicle Equipment etiquetados (POINTS ya en
  p_unit). Combat Drugs (idx 26-31) intactos (pool aparte). Sin fix de veteranía (no aplica).
- `ki-dark-eldar-furiouscharge-phantom-01` **PENDIENTE**: "Furious Charge" (un bonus de
  Power-through-Pain) coló en el slot Elites sin datasheet. Excluido del codex.

**Migración Fase 4 COMPLETA 5/5** (`engine/codex_dark_eldar/`): slots (19/7, phantom excluido) ·
unit-types (estáticos) · **keywords (datasheet POBLADO: Kabal/Coven/Cult + "all" + "none")** ·
special-abilities (Combat drugs + PtP + Harlequins + Webway + 5/3/22) · weapon-abilities (gating
por sub-facción + vehicle + drugs; sin tier de veteranía). Build ✓ (471ms). Local, sin pushear.

---

### 🟢 Eldar — digest desde el .ods + Fase 4 (11ª facción, mayor roster, 2026-06-11)

Eldar era 🔴. Digest desde el `.ods` (`rules-model/eldar.md`). **Roster más grande migrado (38
unidades).** Vuelve al grupo de "eje datasheet vacío" (Dark Eldar sigue siendo la única no-CSM con
eje poblado).

**Hallazgos:**
- 38 units / 7 slots (sin phantoms). Ejes armour/mark/datasheet vacíos. Sin veteran (0).
- **Mecánicas estrella = Battle Focus** (movilidad + psíquica army-wide) + Shuriken (regla de arma)
  + Visitors of the Black Library (Harlequins) + Webway strike.
- 6 Archetypes (Aspect Focus→`<Aspect>`, Wraithhost→`<Wraith>`, LIIVI→Vindicare, Windhost, Exemplars
  of the Shrines, Ynnari→Dark Eldar), 5 Legacies (= 5 Craftworlds), 15 Traits. Cross-check 6/5/15.

**Fixes/gaps:**
- `ki-eldar-vetvehcategory-01` **ARREGLADO**: 8 Vehicle Equipment etiquetados (POINTS ya en p_unit).
- `ki-eldar-aspect-wraith-keyword-01` **PENDIENTE**: los archetypes Aspect Focus/Wraithhost gatean
  por `<Aspect>`/`<Wraith>` pero producción tiene `keywords:[]` en las 38 unidades (a diferencia de
  Dark Eldar). Recomendado etiquetar los Aspect Warriors + las unidades Wraith para alinear con el
  modelo de Dark Eldar.
- `ki-eldar-psychic-unwired-01` **PENDIENTE**: disciplina psíquica (64 filas) + Revenant en el .ods
  pero el loader no las carga (gap tipo IG).
- "Swooping Hawks" `unit_type: "Jump pack"` (artefacto, debería ser "Jump Pack Infantry").

**Migración Fase 4 COMPLETA 5/5** (`engine/codex_eldar/`): slots (38/7) · unit-types (estáticos;
1 artefacto Swooping Hawks) · keywords (4 ejes vacíos; nota Aspect/Wraith) · special-abilities
(Battle Focus + Shuriken + Harlequins + Webway + 6/5/15 + 2 gap-notes) · weapon-abilities (sin
keyword gate + vehicle; sin tier de veteranía). Build ✓ (427ms). Local, sin pushear.

---

### 🟢 Assassins — corregidos a su alcance canónico real (v0.56)

Se modeló primero como acceso exclusivo de Grey Knights ("Demon Hunters")/Sororitas ("Witch
hunters"), copiando las 4 unidades (Callidus/Culexus/Eversor/Vindicare) nativamente en cada una
(estilo Lords of War). Al re-aterrizar en el `Index.html` propio de Assassins (regla "Cults
Abominatioe"/"Execution Force"), el usuario detectó DOS VECES que el alcance real es mucho más
amplio: CUALQUIER ejército Caos (CSM/CD) o Imperial (SM/IG/AdMech/Custodes/Sororitas/GK/
Inquisición — 9 facciones) puede coger 1 Asesino o 1 de cada por un único slot de Elites; HH/
Escalation quedan excluidos (inyección propia de archetype). Solución final unificada: catálogo
único en `data.allied['assassins']`, inyectado en runtime (sin badge [Allied], cuenta como propio)
en cualquier facción que cualifique vía `getAssassinAccessAlignment`/`assassinAccessGroupLabel`
(`engine/keywords.ts`) + `computeAssassinFreeSlots` + validador de composición; sección agrupada
"Cults Abominatioe"/"Execution Force" dentro de Elites. Cero duplicación de datos. Página de
inicio actualizada: Assassins pasa de "facción jugable" a tarjeta de Suplemento de solo-lectura
(como HH/Escalation). Detalle completo en [[project_inquisition_audit]] (memoria, Fase B).

---

## 3. Bugs conocidos — resumen

> Lista completa y técnica en `src/data/known-issues.ts` (panel "Known Issues" dentro de la app).
> Aquí solo el resumen para tener contexto rápido sin tener que leer código.

**Encontrados en la auditoría del 2026-06-08 (Fase 1):**
- ✅ `ki-missions-transportcap-hardcoded-01` — el límite de Transportes Dedicados está fijo en 3,
  cuando la regla real dice "1 por cada unidad tipo Infantería". **RESUELTO (2026-06-08):**
  confirmaste que es el tipo "Infantry" exacto — Bike/Jump Pack Infantry/Monstrous Infantry/etc
  "cuentan como Infantería para otras reglas, pero NO para transporte". Listo para implementar
  en la pasada de `codex.ts`.
- ✅ `ki-skirmish-secondaop-textcontradiction-01` — el texto de Skirmish menciona "elegibilidad
  para una segunda AOP", pero el motor bloquea esa posibilidad por completo en Skirmish.
  **RESUELTO (2026-06-08):** confirmaste que el concepto de "segunda AOP/AOC" en este reglamento
  se realiza específicamente trayendo un destacamento Aliado (que trae su propia AOP reducida —
  eso ES la "segunda AOP"). Como Skirmish prohíbe Aliados por completo, ese mecanismo no puede
  existir ahí — el texto es residuo de la plantilla de Pitched/Epic. `multiAop: false` está bien
  como está; cambiado a `status: 'by_design'`.
- 🟡 `ki-allies-owncustomisation-unmodelled-01` — la regla dice que los aliados pueden elegir su
  propia Archetype/Legacy/Traits, pero el motor solo permite UNA selección global para todo el
  ejército (no una para tu facción y otra para el aliado).
- 🟡 `ki-skirmish-restrictions-unenforced-01` — 3 restricciones de Skirmish no se comprueban en
  ningún sitio: que el HQ no pueda llevar mejoras "una vez por ejército", el límite de blindaje
  combinado ≥34, y el máximo de 1 poder psíquico por turno.

**Otros bugs abiertos relevantes (de sesiones anteriores — lista no exhaustiva, ver el panel):**
- `ki-bug-mixedmodel-pricing-01` — precio de escuadras con modelo mixto (ej. Traitor Guard)
- `ki-csm-summoning-mandatoryaop-01` — si Chaos Daemons puede ocupar slots obligatorios de la AOP
- `ki-corerules-jumppack-ability-undefined-01` — la regla "Jump pack" (no el tipo "Jump Pack
  Infantry") nunca se definió en el texto canónico que tenemos — **puede que necesitemos que
  pegues el texto de esa regla** si la encuentras en algún Codex/datasheet.
- `ki-unittype-residuals-01` — variantes de escritura de tipos de unidad (Jetbike/Jet Bike, etc.)

---

## 4. Estado — matriz completa (general + por facción/suplemento)

**General (motor / base — aplica a TODO el proyecto, no a una facción):**

| Ítem | Estado |
|---|---|
| Motor general (engine base) | ✅ codeado |
| Auditoría Core Rules | ✅ x (v0.57, 2026-06-08) |
| Auditoría Misiones | ✅ x (v0.57, 2026-06-08) |
| Modelo de keywords (5 categorías) | 🟡 acordado, Psyker pendiente de aplicar al código |

**Por facción / suplemento** (🟢 completo · 🟠 parcial/con detalles · 🔴 sin empezar · ⬜ no iniciado):

| Facción / Suplemento | Auditoría HTML×ODS | Digest `rules-model/*.md` | `codex_<x>` | Notas |
|---|---|---|---|---|
| Chaos Space Marines | 🟠 mayor cobertura, errores conocidos | ✅ (movido a codex_csm/digest.md) | 🔄 archivos juntos en engine/codex_csm/, falta organizar contenido | **piloto en marcha** |
| Chaos Daemons | 🟠 auditada | ✅ | ⬜ | |
| Space Marines | 🟠 auditada | ✅ | ⬜ | |
| Imperial Guard | 🟠 auditada | ✅ (2026-06-11, desde el .ods) | ✅ (2026-06-11, 5/5) | 6ª facción; `ki-ig-vetvehcategory-01` fijado; `ki-ig-psychic-unwired-01` pendiente |
| Grey Knights | 🟠 auditada | ✅ (2026-06-08, construido desde cero) | ✅ (2026-06-11, 5/5) | `ki-gk-vetvehcategory-01` fijado antes de migrar (5ª facción) |
| Inquisition | 🟢 completa+ (v0.56) | — | ⬜ | varias pasadas, ver memoria |
| Adeptus Mechanicus | 🟠 auditada (.ods) | ✅ (2026-06-11, desde el .ods) | ✅ (2026-06-11, 5/5) | 7ª facción; `ki-admech-vetvehcategory-01` fijado; `ki-admech-doctrina-gating-01` pendiente |
| Adeptus Sororitas | 🟠 auditada (.ods) | ✅ (2026-06-11, desde el .ods) | ✅ (2026-06-11, 5/5) | 8ª facción; `ki-sororitas-vetvehcategory-01` fijado; sin tier de veteranía (como CD) |
| Adeptus Custodes | 🟠 auditada (.ods) | ✅ (2026-06-11, desde el .ods) | ✅ (2026-06-11, 5/5) | 9ª facción; `ki-custodes-vetvehcategory-01` fijado; `ki-custodes-vigilators-phantom-01` pendiente; ᵀ-gate vía term_compat (sin armourKeyword) |
| Dark Eldar | 🟠 auditada (.ods) | ✅ (2026-06-11, desde el .ods) | ✅ (2026-06-11, 5/5) | 10ª facción; eje datasheet POBLADO (sub-facción Kabal/Coven/Cult, 2ª tras CSM); `ki-dark-eldar-vetvehcategory-01` fijado; `ki-dark-eldar-furiouscharge-phantom-01` pendiente |
| Eldar | 🟠 auditada (.ods) | ✅ (2026-06-11, desde el .ods) | ✅ (2026-06-11, 5/5) | 11ª facción (mayor roster, 38); `ki-eldar-vetvehcategory-01` fijado; pendientes `ki-eldar-aspect-wraith-keyword-01` + `ki-eldar-psychic-unwired-01` |
| Harlequins | 🟠 auditada (.ods) | ✅ (2026-06-11, desde el .ods) | ✅ (2026-06-11, 5/5) | 12ª facción (menor roster, 9; sin Army Customisation como Inquisition); `ki-harlequins-vetvehcategory-01` fijado; `ki-harlequins-psychic-unwired-01` pendiente |
| Genestealer Cults | 🟠 auditada (.ods) | ✅ (2026-06-11, desde el .ods) | ✅ (2026-06-11, 5/5) | 13ª facción; mecánica Ambush; legacies tipo GK (bonus-power); `ki-genestealer-cults-vetvehcategory-01` fijado; `ki-genestealer-cults-psychic-unwired-01` pendiente |
| Orks | 🟠 auditada (.ods) | ✅ (2026-06-11, desde el .ods) | ✅ (2026-06-11, 5/5) | 14ª facción; eje armadura Mega armor (glifo ᴹ); Kustom Jobs; mecánica Waaagh!; `ki-orks-vetvehcategory-01` fijado; `ki-orks-psychic-unwired-01` pendiente |
| Tyranids | 🟠 auditada (.ods) | ✅ (2026-06-11, desde el .ods) | ✅ (2026-06-11, 5/5) | 15ª facción; sistema de Biomorfos (sin armory compartido), 0 vehículos → SIN fix de vetveh; mecánica Synapse; keyword uniforme "Tyranid"; `ki-tyranids-psychic-unwired-01` pendiente |
| Leagues of Votann | 🟠 auditada (.ods) | ✅ (2026-06-11, desde el .ods) | ✅ (2026-06-11, 5/5) | 16ª facción; eje armadura Exo-armor (glifo ᴱ); mecánica Eye of the Ancestors (Judgement tokens); Demiurg→aliado Tau; `ki-leagues-of-votann-vetvehcategory-01` fijado; `ki-leagues-of-votann-psychic-unwired-01` pendiente |
| Tau Empire | 🟠 auditada (.ods) | ✅ (2026-06-11, desde el .ods) | ✅ (2026-06-11, 5/5) | 17ª facción; gate Infantry (glifo ᴵ); Kroot en unit_type; Support Systems + Drones; mecánica Markerlight; `ki-tau-empire-vetvehcategory-01` fijado; `ki-tau-empire-psychic-unwired-01` pendiente |
| Necrons | 🟠 auditada (.ods) | ✅ (2026-06-11, desde el .ods) | ✅ (2026-06-11, 5/5) | 18ª y ÚLTIMA facción; Necron/Canoptek en unit_type; mecánica Reanimation Protocols (RPoints); `ki-necrons-vetvehcategory-01` fijado; `ki-necrons-psychic-unwired-01` pendiente — **19/19 facciones migradas** |
| Assassins | 🟢 corregido (v0.56) | — | ⬜ | suplemento universal Caos/Imperio (no facción independiente) — ver nota abajo |
| Horus Heresy | 🟢 digest completo | ✅ | ⬜ | suplemento — Fase 1 chaos shippeada v0.51 |
| Escalation (Lords of War) | 🟠 fase chaos completa | — | ⬜ | suplemento cross-facción |

Leyenda: 🟢 completa · 🟠 auditada (pueden quedar detalles) · 🔴 sin empezar/parcial · ⬜ no iniciado

---

## 5. ¿Dónde nos quedamos? (clave para retomar tras limpiar contexto)

**Última sesión (2026-06-08):**
1. Fase 1 (auditoría Core+Misiones) — ✅ COMPLETA, shippeada v0.57 (sin pushear).
2. Resolviste en vivo 2 de los 4 KIs nuevos: transporte=Infantry estricto, segunda-AOP=residuo
   de plantilla (`multiAop:false` está bien). Quedan 2 abiertos pero son de IMPLEMENTACIÓN, no
   de interpretación: `ki-allies-owncustomisation-unmodelled-01` y
   `ki-skirmish-restrictions-unenforced-01`.
3. Afinamos el modelo de keywords → **5 categorías: Unit type / Keyword / Special ability
   (incluye Psyker, rectificado) / Weapon ability / Slot**. Acordado pero NO aplicado al
   código todavía (Psyker sigue en `unit.keywords[]` plano en `engine/keywords.ts` L116-143).
4. Decidimos la estructura del piloto: carpeta `codex_csm/` con varios archivos (no uno
   gigante) que consolide Index+Archetypes+Legacies/Traits/Resolver/Engine de CSM. Migrar lo
   disperso (`engine/legacies/`, `engine/traits/`, `engine/resolvers/`, `engine/archetypes/
   chaos_space_marines/`) queda PENDIENTE — preguntar antes de mover nada.
5. Para verificar datos de CSM: usar **`Informacion/Chaos Space Marines ENG.ods`** directamente
   (no pedir HTML — el .ods ya está disponible y es más cómodo de leer).

**Sesión 2026-06-08 (cont.):** Paso 1 del piloto `codex_csm` completo — los 6 archivos
dispersos + el digest ya están juntos en `engine/codex_csm/` (build ✓, sin cambios de
comportamiento, solo reorganización). Limpieza general también hecha: borrados ~145 archivos
basura (scripts/logs sueltos en la raíz de `handoff/`, `_scratch/` con 60 JSON viejos).

**Sesión 2026-06-08 (cont. 2):** creado `engine/codex_csm/index.ts` (un único punto de entrada
que reexporta legacies/traits/archetypes/resolver). Investigamos la regla "Animosity of the
Gods" (la pediste tú): la tabla de marcas rivales SÍ está bien implementada (coincide con tu
tabla al 100%); pero encontramos un hueco real — la sub-regla "un modelo con marca solo puede
unirse a una unidad con la misma marca o sin marca" NO está comprobada en ningún sitio.
Registrado como `ki-csm-animosity-joinmark-01`. Tu ejemplo (Jakhals Khorne bajo HQ Nurgle) es
correcto, no es bug — Khorne y Nurgle no son rivales en la tabla.

**Sesión 2026-06-08 (cont. 3):** Paso 2 del piloto `codex_csm` — creados los 5 esqueletos
(`unit-types.ts`, `keywords.ts`, `special-abilities.ts`, `weapon-abilities.ts`, `slots.ts`)
con el mapeo digest→categoría documentado (ver tabla en Fase 3 arriba). Antes de esto,
intentamos aplicar el fix de "Psyker → Special ability" (acordado el 2026-06-08) pero
descubrimos que NO es trivial — ~67 usos reales de la keyword "Psyker" en gating de armería
(`requires_keywords`), correctamente pospuesto al pase de motor de `codex.ts`.

**Sesión 2026-06-08 (cont. 4):** Paso 3 — rellenado `CSM_SLOTS` en `slots.ts` con el roster
completo de §4c del digest (8 HQ / 8 Troops / 22 Elites / 9 Fast Attack / 9 Heavy Support /
2 Dedicated Transport / 2 Fortifications / 1 Flyer, nombres verbatim, validado 2026-06-03).

**Sesión 2026-06-08 (cont. 5):** Paso 4 — rellenado `CSM_KEYWORDS` en `keywords.ts`: eje
armadura (Terminator/Cataphractii, ambas ᵀ-gate y comprables, §1), eje marca (las 5 marcas con
sus efectos verbatim, números sagrados y rivalidades de Animosity of the Gods, §4b), y eje
facción (Chaos Space Marine). El eje `datasheet` se deja vacío a propósito, pendiente de
`unit-types.ts`. Build ✓.

**Sesión 2026-06-08 (cont. 6):** Paso 5 — rellenado `CSM_UNIT_TYPES` en `unit-types.ts`: las
61 datasheets del roster con su `unit_type` estático, sacado directo de producción (no
retranscrito a mano), cruzado contra los ejemplos de §4d del digest (Daemon Prince/Lord
Discordant/Helbrute, los 3 cuadran). Excluido "War Dog" (unidad de Escalation Lords-of-War
inyectada en Elites, no forma parte del roster validado de 22). Con eso desbloqueado, completado
el eje `datasheet` de `CSM_KEYWORDS`: las 6 keywords de identidad de legión/warband de las
columnas "Keyword | Locked mark" de §4d-4i — Cultist (sin marca fija), Death Guard/World
Eaters/Thousand Sons/Emperor's Children (marca fija Nurgle/Khorne/Tzeentch/Slaanesh, como
habilidad innata) y Warpsmith (identidad única, gatea ítems "Only for Warpsmiths" de Iron
Warriors) — contadas programáticamente sobre los 61 ficheros de unidad. Investigadas dos
señales de alarma de calidad de datos del conteo (keywords con comillas curvas duplicadas y un
"Emperors Children" sin apóstrofe) — ambas resultaron ser artefactos del propio script de
conteo, no bugs reales de datos (el primero capturaba texto de comentarios de auditoría que
contenían literalmente "keywords: […]"; el segundo era la regex de strip-comillas del script
comiéndose el apóstrofe de "Emperor's Children"). **3 de 5 categorías con datos reales** (Slot +
Keyword + Unit type); quedan Special ability, Weapon ability. Build ✓. Limpiados los ficheros
sueltos de extracción (`_extract_*`/`_gen_*`/`_check_*`.cjs/.txt).

**Sesión 2026-06-08 (cont. 7) — Detour:** el usuario detectó que faltaba la categoría
canónica "Weapon types" (Core Rules.txt L1072-1128 — tabla de compatibilidad de órdenes
Assault/Grenade/Heavy/Melee/Pistol/Rapid Fire) en `coreRules.ts`. Añadidas las 6 entradas
verbatim + `lookupWeaponType()`, conectada en `PrintView.tsx`. También investigada la pregunta
"¿Unwieldy también pone límites como Unique?" — Unique SÍ está bien aplicado (UI-block +
validador Skirmish); Unwieldy's "máx. 1 por modelo" NO tiene ninguna comprobación en el motor
(aparece en 43 ficheros de datos) → registrado `ki-unwieldy-permodel-unenforced-01`, pospuesto
a petición del usuario.

**Sesión 2026-06-08 (cont. 8) — Paso 6, PILOTO 4/5:** rellenado `CSM_SPECIAL_ABILITIES` en
`special-abilities.ts` — General Armory rules (§4), mecánicas army-rule de §4b que NO viven ya
en `CSM_KEYWORDS` (Favored Units, Summoning, Animosity of the Gods incl. la sub-cláusula de
unión sin aplicar, Mark of Chaos Undivided), y mecánicas de los 3 cast-systems de §6
(Psyker/Disciplinas/Plegarias/Pactos — sin duplicar las 36+10+6 powers/prayers/pacts, ya
canónicas en `disciplines.json`). Build ✓.

**Sesión 2026-06-08 (cont. 9) — Paso 7, PILOTO COMPLETO 5/5:** rellenado `CSM_WEAPON_ABILITIES`
en `weapon-abilities.ts` (categoría final) — mecánicas de gating de §2/§3: Terminator-
compatibilidad (ᵀ ⇔ term_compat + convención de glifos resuelta), perfiles múltiples
(`profiles[]`, Combi-armas/Plasma pistol), texto de restricción no estructurado (Infantry only/
Only for Lieutenants/Dark Apostles/Sorcerers/Cataphractii-or-Terminator-only), semántica de
columnas de puntos (`p_unit`/`p_char`/`p_veh`). Sin duplicar el glosario de ~50 weapon
abilities (ya en `coreRules.ts`) ni el eje Terminator/Cataphractii (ya en `keywords.ts`).
Build ✓ (2.94s). **PILOTO `codex_csm` COMPLETO — los 5 catálogos están rellenos y validados.**

**Sesión 2026-06-08 (cont. 10) — Fix ki-csm-animosity-joinmark-01:** revisé el "hilo
Archetypes-Legacies-Traits" que propuse como alternativa — resultó que ya estaba COMPLETO
(§4b y §5 del digest "VALIDATED 2026-06-03", cobertura ✅ en Archetypes/Traits/Legacies).
En su lugar, el usuario aceptó arreglar el known issue más barato y concreto que sí seguía
abierto: `joinableUnits` en `UnitCard.tsx` nunca comprobaba Marcas — un personaje Khorne
podía unirse a una unidad Slaanesh sin aviso, pese a la sub-cláusula de Animosity of the Gods
"solo puede unirse a una unidad con la misma marca o sin marca" (digest §4b). Añadido un
check de marca al unirse, resolviendo la marca efectiva de cada candidata igual que el motor
(`locked_mark ?? marca forzada por arquetipo ?? marca elegida`, espejo de `effectiveMark` en
resolver.ts), acotado a `data.faction === 'Chaos Space Marines'` (la sub-cláusula es propia
de CSM — las marcas de Chaos Daemons no se rigen por ella). Build ✓ (2.97s). KI cerrado.

**Sesión 2026-06-08 (cont. 11) — Fix ki-csm-summoning-mandatoryaop-01:** investigación
solicitada por el usuario ("siguiente") confirmó un bug REAL — lo contrario de la hipótesis
"redundante con el Allied Matrix" que planteaba el KI. Los arquetipos de culto (Blood for the
Blood God!/All is Dust/Ambition for Perfection/Plaguehost/Daemonkin) dan acceso nativo a Chaos
Daemons vía `rule.alliedFaction: 'chaos_daemons'` — son unidades PROPIAS del ejército (sin
badge [Allied], comparten el AOP, ver SlotPanel.tsx), marcadas `factionSource: 'chaos_daemons'`.
El check de mínimos-AOP-obligatorios excluye unidades aliadas comparando contra
`state.alliedFaction` — una selección manual SEPARADA de "Allied Detachment" que nunca se
sincroniza con el `alliedFaction` del arquetipo activo (confirmado leyendo `setArchetype` en
store/army.ts y el useEffect de App.tsx que solo carga `rule?.alliedFaction` en `data.allied`).
Resultado: las unidades Daemon nativas del culto se contaban como CSM normales — un HQ Daemon
podía cumplir "se necesita al menos 1 HQ", violando "Daemons can't fill mandatory AOP
selections" (digest §4b Summoning). Fix: `getSlotUsage` (validators.ts) ahora acepta
`excludeFactionSources`; para ejércitos CSM se excluye siempre `factionSource ===
'chaos_daemons'` del conteo de mínimos obligatorios — EXCEPTO bajo Daemonkin, que
explícitamente "ignora Summoning" (su propia regla de ≥1 HQ por códex necesita que el HQ
Daemon cuente). Build ✓ (2.95s). KI cerrado.

**Sesión 2026-06-08 (cont. 12) — Fix ki-unwieldy-permodel-unenforced-01 (general, no solo CSM):**
el usuario dijo "te hago caso" y tomé el fix concreto que ya estaba acotado y listo desde el
audit. "Unwieldy" — "cada modelo solo puede llevar un ítem Unwieldy" (Core Rules.txt L1447-1449,
texto correcto en coreRules.ts pero sin aplicar en ningún sitio; aparece en 43 archivos de datos
de casi todas las facciones) — arreglado espejando exactamente cómo funciona "Unique": añadido
`isUnwieldyItem(desc)` en equipMods.ts (regex `/\bUnwieldy\b/`, hermano de `isUniqueItem`) y
`unwieldyModelBlocked(arm, sec)` en ArmoryModal.tsx junto a `uniqueArmyBlocked` — resuelve cada
selección de armería propia del modelo a su `ArmoryItem` (vía el resolver `findArmoryItem`,
recién importado) y bloquea un segundo ítem Unwieldy. Acotado a la armería PROPIA del modelo
(cap por modelo) a diferencia de "Unique" (cap por ejército) — el alcance más estrecho que dice
el texto canónico. Conectado a `isAddBlocked` para que el selector lo bloquee igual que
Unique/once-per-model. Build ✓ (2.91s). KI cerrado.

**Sesión 2026-06-08 (cont. 13) — Fix ki-skirmish-restrictions-unenforced-01 #1 (HQ "once per
army" upgrades):** de las 3 restricciones de Skirmish sin aplicar elegí la #1 por ser la más
parecida al patrón Unique/Unwieldy ya tocado hoy. Aterricé el texto ambiguo de Missions.txt L72
en la propia definición canónica del glosario: `coreRules.ts` define "Unique" como "solo se
puede incluir una vez por ejército" — exactamente lo que significa una "upgrade once per army".
Confirmé que ningún ítem de armería usa la frase literal "once per army" — Unique es el único
mecanismo. Añadido `skirmishHqUniqueBlocked(arm)` en ArmoryModal.tsx: en Skirmish, si la unidad
ocupa el slot HQ (`effectiveSlot === 'HQ'`, ahora pasado desde `resolveUnitProfile` de UnitCard
vía nuevo prop), los ítems Unique quedan bloqueados sin excepción — más estricto que el
`uniqueArmyBlocked` normal (que solo bloquea si OTRA unidad ya lo tiene). Build ✓ (2.94s). KI
#1 de 3 cerrado; #2 (armadura combinada ≥34) y #3 (1 poder psíquico/turno) siguen abiertos —
son de mayor alcance.

**Sesión 2026-06-08 (cont. 14) — Fix ki-skirmish-restrictions-unenforced-01 #2 (armadura
combinada ≥34) + investigación #3:** seguí directo desde el #1 ("sigue"). Para #2, confirmé que
no existía infraestructura para sumar Front+Side+Rear: `StatBlock.FRONT/SIDE/REAR` son strings
numéricos simples, cero `stat_mod` apunta a ellos y "Quantum Shielding" no existe como ítem/
ability en ninguna facción — la cláusula canónica "incluir Quantum Shielding" es un no-op
verificado (las stats base son siempre finales). Añadí un check estático en el bloque validador
de Skirmish (`validators.ts`, justo después del check de Squadron) que suma
`u.models[0].stats.FRONT/SIDE/REAR` y da error en ≥34. Lo verifiqué contra datos reales (Lord of
Skulls 13+13+11=37, Chaos Fellblade 14+13+12=39 — ambos disparan el check, confirmando que no es
código muerto). Build ✓ (2.89s). Para #3 ("ningún personaje puede lanzar más de 1 poder psíquico
por turno", Missions.txt L84): investigado y determinado que es un BATTLE-MECHANIC (límite de
lanzamiento durante la partida), no una restricción de selección de lista — igual que otras
mecánicas de juego ya descartadas (p.ej. "Narthecium una vez por turno"). Recomendación: cerrar
como "by design / fuera de alcance del list builder", pendiente de confirmación del usuario (lo
dejé documentado en el KI y el changelog, sin cerrarlo unilateralmente).

**Usuario confirmó el cierre de #3** ("cerramos 3 es una mecanica in game") — KI
`ki-skirmish-restrictions-unenforced-01` queda CERRADO (`status: 'fixed'`): #1 fijo, #2 fijo,
#3 cerrado como fuera de alcance (mecánica de partida, no de construcción de lista).

**Sesión 2026-06-08 (cont. 15) — intento de "primera porción" del rediseño `codex.ts`, pivote:**
probé migrar 2 piezas ya catalogadas en el piloto como prueba de concepto: (a) gating Terminator
(ᵀ) — resultó ya estar bien implementado de forma genérica y cross-facción en `keywords.ts`
(`isTerminatorArmourName`/`modelRestrictsToTermSubset`/`isItemTermCompat`, deriva de keywords no
de flags); migrarlo al catálogo sería redundante. (b) roster `CSM_SLOTS` — lo verifiqué contra
los 61 ficheros reales en `data/parsed/chaos_space_marines/units/<slot>/`: coincide exacto (8 HQ/
8 Troops/22 Elites excl. War Dog/9 FA/9 HS/2 DT/2 Fort/1 Flyer), sin drift. Conclusión: el
rediseño real de `codex.ts` (consolidar Index+Army Customisation por facción en
`data/codex/<facción>.ts`, motor general+por-facción con override) es un trabajo de arquitectura
grande que necesita su propia sesión de DISEÑO dedicada — no es algo que se pueda trocear en una
porción de prueba sin invertir antes ese diseño. Usuario de acuerdo ("vale") en aparcarlo así.

**PRÓXIMO PASO (a decidir con el usuario):** el rediseño `codex.ts` queda anotado como "gran
tarea futura — necesita sesión de diseño dedicada" (no una porción suelta). Mientras tanto,
opciones más acotadas: Fase 4 (migrar otra facción al modelo de 5 categorías) o continuar las
auditorías HTML×HTML pendientes (ver tabla §4 — AdMech/Sororitas/Custodes/Dark Eldar/Eldar/
Harlequins/GSC/Orks/Tyranids/LoV/Inquisition/Tau/Necrons/Assassins siguen 🔴).

**No pushear nada todavía** — sigue pendiente de confirmación explícita.

**🧹 LIMPIEZA PENDIENTE (detectada 2026-06-08, no tocada — revisar con calma, no a las prisas):**
`custom40k-builder/data/parsed/_scratch/` contiene ~60 archivos JSON
(`<facción>_html_armory/_rules/_units.json` — uno por cada una de las 19 facciones +
suplementos). Son salidas de pasadas del script de auditoría `parse_html_faction.cjs`
(herramienta de auditoría, NO el pipeline de producción — CLAUDE.md), probablemente residuos
de las migraciones repetidas. Candidato fuerte a "basura inservible que confunde", pero
**antes de borrar nada hay que confirmar que ningún script/proceso vivo los lee** (podrían ser
el output de la última pasada de auditoría de alguna facción, útil como referencia momentánea).
Revisar uno por uno o en bloque cuando tengamos un momento sin presión — preguntar antes de
borrar cualquier cosa.

---

## 6. Cómo puedes ayudar — SIN programar

Tú eres el experto en las reglas; yo soy el que traduce eso a código. Esto es lo que más me
ayuda de tu parte (puedes hacerlo en cualquier momento, no hace falta que sepas programar):

1. **Responder las preguntas marcadas "necesita tu confirmación"** (ver §3 arriba y el panel
   Known Issues). Son dudas puntuales de interpretación de regla — normalmente puedo resolverlas
   en segundos si me confirmas qué dice el canon.

2. **Pegar bloques de HTML/texto cuando te los pida.** Cuando audito una facción unidad por
   unidad y tengo dudas de un dato concreto, te pido el bloque del `Index.html`/`Army
   Customisation.html`/armería — tú lo tienes a mano y yo no debo "inventar" ni adivinar.

3. **Decirme qué facción auditar después.** La tabla de §4 es la lista de prioridades — tú
   decides el orden según lo que más te interese jugar/probar primero.

4. **Probar la app localmente y avisarme de lo que veas raro.** Cuando termine una tarea te
   pregunto si quieres probar — si algo no cuadra con las reglas que tú conoces, dímelo aunque
   no sepas explicar el "por qué" técnico; yo investigo el resto.

5. **Montar los inputs que te pida en `Informacion/factions/<facción>/`** cuando empecemos una
   facción nueva — te diré exactamente qué archivos necesito (HTML de unidades, de armería, de
   reglas de facción) antes de arrancar.

6. **Revisar y corregir este archivo.** Si ves que la tabla de §4 está desactualizada, o que
   un bug ya no aplica, o que el orden de prioridades no es el que quieres — dímelo y lo ajusto.
   Este archivo es tuyo tanto como mío.

No necesitas "rellenar" nada técnico — tu aporte es siempre el mismo: **el conocimiento de las
reglas**. Eso es lo que hace que todo lo demás cuadre.
