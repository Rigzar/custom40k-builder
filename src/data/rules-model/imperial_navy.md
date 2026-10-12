# Imperial Navy — digest de reglas + modelo de keywords

Fuente: `Codex/Imperial Navy 1.0.ods` (Core Rules 1.279). Facción añadida 2026-10-12.

## Estructura
- 38 hojas. Índice: HQ (Rogue Trader, Voidmaster) · Troops (Ratings, Voidsmen, Henchman Warband) ·
  Elite (22: 18 henchmen compartidos con la Inquisición + Arch-Militant, Breachers, Explorator,
  Impressed Ogryns) · Fast Attack (Valkyrie) · Heavy Support (Vendetta) · Transports (Arvus) ·
  Flyers (Avenger, Lightning, Thunderbolt, Vulture).
- Los henchmen (Acolytes ... Xenologists) son los de `data/parsed/inquisition/units/elites/`, con la
  sola diferencia de las `keywords` (Specialist) y el Ranger long rifle (+Sniper) del Eldar Outcast.
- **Daemonhosts** figura en el índice pero la hoja no existe: la unidad es copia de la Inquisición
  (sin verificar). Preguntar al autor.

## Reglas especiales (hoja Index)
- **Skyhammer Doctrine** — el ejército dobla sus huecos de AOP para Flyers; los Flyers llegan ya en
  el turno 1. Implementado: `engine/navyRules.ts` (`slotCapFactor`) en validador, SlotPanel y radar
  de la impresión. El turno 1 es regla de mesa.
- **Warrant of Trade** — mientras el ejército principal tenga más puntos que el aliado, las Troops
  aliadas de "Allies of Convenience" conservan Objective Secured!; además cada modelo con acceso a la
  Armería puede elegir UN objeto de cualquier facción Imperial. Implementado: pestaña "Warrant of
  Trade" en `ArmoryModal` (misma maquinaria que "Authority of the Inquisition"). Lo de Objective
  Secured NO está implementado (regla de mesa).

## Customisation
- Archetypes: Heretic / Iconoclast (ambos YES en Skirmish): un objeto de cualquier facción Chaos /
  Xenos en vez de Imperial. Legacies: ninguna. Traits: ninguno.

## Reglas de selección propias de la hoja
- Rogue Trader → Majoris (+15, uno por ejército); un Henchman Warband por Rogue Trader (6 modelos,
  12 con Majoris) — `validators.ts` (cap) + `valNavyWarbandPerTrader`.
- Voidmaster fuera de HQ y Explorator fuera de Elite, uno por Rogue Trader — `computeNavyFreeSlots`.
- Armería: hoja propia (`armory/general.json`, 49 armas, 39 objetos de equipo/veterano/vehículo).
- Matriz de aliados: fila/columna IN en `data/alliedMatrix.ts` (Core Rules 1.279).
