# Imperial Navy — digest de reglas + modelo de keywords

Fuente: `Codex/Imperial Navy 1.0.ods` (contenido de la versión 1.1; Core Rules 1.279). Facción añadida
2026-10-12, reescrita a 1.1 el 2026-10-14.

## Estructura (Index 1.1)
- HQ: Legendary Retinue (virtual, ver abajo), Rogue Trader (solo uno por ejército), Voidmaster.
- Troops: Henchman Warband, Ratings (20 modelos fijos a 4 pts), Voidsmen.
- Elite (21): los henchmen de la Inquisición + Arch-Militant, Breachers, Impressed Ogryns. **Sin Explorator.**
- Transports: Arvus, Valkyrie. Flyers: Avenger, Lightning, Thunderbolt, Vendetta, Vulture.
  No hay Fast Attack ni Heavy Support.
- Los henchmen son los de `data/parsed/inquisition/units/elites/`; la Warband acepta TODAS las Elites del
  códice (Unwise: "all elites in the navy codex"). Las mejoras propias de Breachers/Ogryns/Deathcult no
  están dentro de la Warband.

## Reglas especiales
- **Warrant of Trade** — las Troops aliadas de "Allies of Convenience" conservan Objective Secured!
  (regla de mesa, no implementada) y el ejército dobla sus huecos para destacamentos aliados
  (`engine/navyRules.ts`: `alliedSlotFactor`, usado en validators, SlotPanel y límites de aliados en Skirmish).
- Skyhammer Doctrine y la elección de un objeto de cualquier facción Imperial **desaparecieron en 1.1**.
- **Legendary Retinue** (también en la Inquisición, ver `engine/legendaryRetinue.ts`): hasta 4 modelos de
  HQ Infantry de AdM/AdS/IG/SM (+Heretic: CD/CSM/GSC; +Iconoclast: DaE/Eld/LoV/Orks/Tau), uno por códice,
  ninguno único por ejército, solo su propia armería y nada único. Ocupan UN hueco de HQ en total.

## Customisation
- Archetypes Heretic / Iconoclast (ambos YES en Skirmish): solo amplían la Retinue. Legacies: ninguna.

## Selección propia de la hoja
- Rogue Trader → Majoris (+15, uno por ejército); un Henchman Warband por Rogue Trader (6 modelos,
  12 con Majoris) — `validators.ts` + `valNavyWarbandPerTrader`.
- Voidmaster fuera de HQ, uno por Rogue Trader — `computeNavyFreeSlots`.
- Armería: la de la Inquisición (con marcas ᵀ), `armory/general.json` (43 armas, 41 objetos).
- Matriz de aliados: fila/columna IN en `data/alliedMatrix.ts` (Core Rules 1.279).
