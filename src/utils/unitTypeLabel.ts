import type { Language } from '../i18n';

/**
 * The unit type line ("Character model, Infantry", "Jump pack Infantry", "Bike (Khymaerae only)") in the
 * reader's language. The strings are engine data, so this is a drawing-time translation only: the
 * rules look unit types up by their English names.
 */
type Row = [en: string, de: string, es: string, ru: string, ja: string];
const TYPES: Row[] = [
  ['super-heavy vehicle', 'Superschweres Fahrzeug', 'Vehículo superpesado', 'Сверхтяжёлая техника', '超重量級車両'],
  ['super-heavy flyer', 'Superschwerer Flieger', 'Volador superpesado', 'Сверхтяжёлый летательный аппарат', '超重量級フライヤー'],
  ['super-heavy walker', 'Superschwerer Läufer', 'Caminante superpesado', 'Сверхтяжёлый ходун', '超重量級ウォーカー'],
  ['monstrous creature', 'Monströse Kreatur', 'Criatura monstruosa', 'Монстр', 'モンストラス・クリーチャー'],
  ['monstrous infantry', 'Monströse Infanterie', 'Infantería monstruosa', 'Монструозная пехота', 'モンストラス歩兵'],
  ['gargantuan creature', 'Gigantische Kreatur', 'Criatura gigantesca', 'Гигантский монстр', 'ガルガンチュアン・クリーチャー'],
  ['jump pack infantry', 'Sprungmodul-Infanterie', 'Infantería con mochila de salto', 'Пехота с ранцами', 'ジャンプパック歩兵'],
  ['character model', 'Charaktermodell', 'Modelo de personaje', 'Модель-персонаж', 'キャラクターモデル'],
  ['jump pack', 'Sprungmodul', 'Mochila de salto', 'Ранец', 'ジャンプパック'],
  ['jet bike', 'Jetbike', 'Moto a reacción', 'Реактивный байк', 'ジェットバイク'],
  ['jetbike', 'Jetbike', 'Moto a reacción', 'Реактивный байк', 'ジェットバイク'],
  ['infantry', 'Infanterie', 'Infantería', 'Пехота', '歩兵'],
  ['vehicle', 'Fahrzeug', 'Vehículo', 'Техника', '車両'],
  ['character', 'Charakter', 'Personaje', 'Персонаж', 'キャラクター'],
  ['walker', 'Läufer', 'Caminante', 'Ходун', 'ウォーカー'],
  ['flyer', 'Flieger', 'Volador', 'Летательный аппарат', 'フライヤー'],
  ['bike', 'Bike', 'Moto', 'Мотоцикл', 'バイク'],
  ['squadron', 'Squadron', 'Escuadrón', 'Эскадрон', 'スクワッドロン'],
  ['only', 'nur', 'solo', 'только', 'のみ'],
];
const COL: Record<string, number> = { de: 1, es: 2, ru: 3, ja: 4 };
const RES = TYPES.map(r => ({ row: r, re: new RegExp(`(?<![A-Za-z])${r[0].replace(/[-]/g, '[- ]?')}(?![A-Za-z])`, 'gi') }));

export function unitTypeLabel(language: Language, raw: string): string {
  const c = COL[language];
  if (!c || !raw) return raw;
  let out = raw;
  // longest names first (the table is ordered that way), each only on text not already replaced
  for (const { row, re } of RES) out = out.replace(re, row[c]);
  return out;
}
