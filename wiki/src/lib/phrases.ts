/**
 * Short labels and sentences that used to be typed straight into the wiki pages in English.
 * `wp('Army Rules')` gives the phrase in the language the wiki is being built in and falls back to
 * the English text, so a phrase that is not in this table is never blank and never wrong.
 *
 * Order in each row: de, es, ru, ja. Game terms printed on every datasheet stay in English where
 * the app keeps them in English (the wiki and the sheet in front of the reader must match).
 */
import type { WikiLang } from './i18n';

type Row = [de: string, es: string, ru: string, ja: string];
const COL: Record<Exclude<WikiLang, 'en'>, 0 | 1 | 2 | 3> = { de: 0, es: 1, ru: 2, ja: 3 };

const ROWS: Record<string, Row> = {
  // datasheet
  'Variants': ['Varianten', 'Variantes', 'Варианты', 'バリアント'],
  'free': ['kostenlos', 'gratis', 'бесплатно', '無料'],
  'Advisor': ['Berater', 'Asesor', 'Советник', 'アドバイザー'],
  'Codex': ['Codex', 'Códex', 'Кодекс', 'コデックス'],
  'FRONT': ['FRONT', 'FRONTAL', 'ЛОБ', '前面'],
  'SIDE': ['SEITE', 'LATERAL', 'БОРТ', '側面'],
  'REAR': ['HECK', 'TRASERA', 'КОРМА', '後面'],
  'HP': ['TP', 'PC', 'ОК', 'HP'],
  'Points': ['Punkte', 'Puntos', 'Очки', 'ポイント'],
  '/model': ['/Modell', '/modelo', '/модель', '/モデル'],
  '(char)': ['(Charakter)', '(personaje)', '(персонаж)', '（キャラクター）'],
  '(veh)': ['(Fahrzeug)', '(vehículo)', '(техника)', '（車両）'],
  // faction hub
  'Army Rules': ['Armeeregeln', 'Reglas de ejército', 'Правила армии', '軍ルール'],
  'Signature': ['Signatur', 'Distintiva', 'Фирменное', 'シグネチャー'],
  'Army-wide': ['Armeeweit', 'Todo el ejército', 'На всю армию', '軍全体'],
  'Alliance': ['Bündnis', 'Alianza', 'Союз', '同盟'],
  'Deployment': ['Aufstellung', 'Despliegue', 'Развёртывание', '展開'],
  'Weapon Rule': ['Waffenregel', 'Regla de arma', 'Правило оружия', '武器ルール'],
  'Litanies': ['Litaneien', 'Letanías', 'Литании', 'リタニー'],
  'Mantras': ['Mantras', 'Mantras', 'Мантры', 'マントラ'],
  'Prayers': ['Gebete', 'Oraciones', 'Молитвы', '祈り'],
  'Prayers & Pacts': ['Gebete & Pakte', 'Oraciones y pactos', 'Молитвы и пакты', '祈りと契約'],
  'Chaos Marks Animosity': ['Feindschaft der Chaosmale', 'Animosidad de las Marcas del Caos', 'Вражда Знаков Хаоса', '混沌の印の敵意'],
  'Units bearing rival Marks <strong>cannot share a squad</strong>. All other Mark combinations — and any unit with the Undivided / Without Mark — are freely compatible.': [
    'Einheiten mit verfeindeten Malen <strong>können sich keinen Trupp teilen</strong>. Alle anderen Malkombinationen — und jede Einheit mit dem Mal Undivided / Without — sind frei kombinierbar.',
    'Las unidades con Marcas rivales <strong>no pueden compartir escuadra</strong>. Todas las demás combinaciones de Marcas — y cualquier unidad con la Marca Undivided / Without — son libremente compatibles.',
    'Отряды со Знаками-соперниками <strong>не могут делить один отряд</strong>. Все остальные сочетания Знаков — и любой отряд со Знаком Undivided / Without — совместимы свободно.',
    '敵対する印を持つ部隊は<strong>同じスクワッドを共有できません</strong>。それ以外の印の組み合わせ、および Undivided / Without の印を持つ部隊は自由に組み合わせられます。',
  ],
  'Canticles of the Omnissiah': ['Canticles of the Omnissiah', 'Canticles of the Omnissiah', 'Canticles of the Omnissiah', 'カンティクル・オブ・ジ・オムニッシア'],
  'At the start of each battle round, roll a d6 for each AdMech unit. On a 4+ the unit may use one base canticle. Legacy canticles require the matching Legacy.': [
    'Zu Beginn jeder Kampfrunde wirf einen W6 für jede AdMech-Einheit. Bei 4+ darf die Einheit ein Basis-Canticle einsetzen. Legacy-Canticles erfordern das passende Legacy.',
    'Al inicio de cada ronda de batalla, tira un D6 por cada unidad AdMech. Con 4+ la unidad puede usar un canticle base. Los canticles de Legacy requieren el Legacy correspondiente.',
    'В начале каждого раунда боя бросьте D6 за каждый отряд AdMech. При 4+ отряд может использовать один базовый canticle. Canticles Legacy требуют соответствующего Legacy.',
    '各バトルラウンドの開始時、各 AdMech 部隊ごとに D6 を振ります。4+ でその部隊は基本カンティクルを1つ使えます。レガシー・カンティクルには対応するレガシーが必要です。',
  ],
  'Base Canticles': ['Basis-Canticles', 'Canticles base', 'Базовые canticles', '基本カンティクル'],
  'Legacy Canticles': ['Legacy-Canticles', 'Canticles de Legacy', 'Canticles Legacy', 'レガシー・カンティクル'],
  'Canticle': ['Canticle', 'Canticle', 'Canticle', 'カンティクル'],
  'Effect': ['Effekt', 'Efecto', 'Эффект', '効果'],
  'Granted by': ['Gewährt durch', 'Concedido por', 'Даётся', '付与元'],

  // psychic / prayers / customisation pages
  'Duration': ['Dauer', 'Duración', 'Длительность', '持続'],
  'Complexity': ['Komplexität', 'Complejidad', 'Сложность', '複雑さ'],
  'Normal': ['Normal', 'Normal', 'Обычная', '通常'],
  'Basic': ['Grundlegend', 'Básica', 'Базовая', '基本'],
  'Simple': ['Einfach', 'Simple', 'Простая', '単純'],
  'Complex': ['Komplex', 'Compleja', 'Сложная', '複雑'],
  'Pact': ['Pakt', 'Pacto', 'Пакт', '契約'],
  'Daemonic Pacts': ['Dämonische Pakte', 'Pactos demoníacos', 'Демонические пакты', 'デーモンの契約'],
  'Litany': ['Litanei', 'Letanía', 'Литания', 'リタニー'],
  'Mantra': ['Mantra', 'Mantra', 'Мантра', 'マントラ'],
  'Prayer': ['Gebet', 'Oración', 'Молитва', '祈り'],
  'Unit': ['Einheit', 'Unidad', 'Отряд', '部隊'],
  'Character': ['Charakter', 'Personaje', 'Персонаж', 'キャラクター'],
  'Monster': ['Monster', 'Monstruo', 'Монстр', 'モンスター'],
  'Vehicle': ['Fahrzeug', 'Vehículo', 'Техника', '車両'],
  'These are <strong>not</strong> psychic powers. They are spoken by specific non-psyker units (e.g. Dark Apostle, Chaplain) or represent pacts made with daemons. No Warp charge is required.': [
    'Dies sind <strong>keine</strong> Psikräfte. Sie werden von bestimmten Nicht-Psykern gesprochen (z. B. Dark Apostle, Chaplain) oder stehen für Pakte mit Dämonen. Es ist keine Warp-Ladung nötig.',
    'Estos <strong>no</strong> son poderes psíquicos. Los pronuncian unidades concretas que no son psíquicas (p. ej. Dark Apostle, Chaplain) o representan pactos con demonios. No se necesita carga de Warp.',
    'Это <strong>не</strong> психические силы. Их произносят определённые отряды без психических способностей (например, Dark Apostle, Chaplain) или они представляют пакты с демонами. Заряд Варпа не требуется.',
    'これらはサイキックパワーでは<strong>ありません</strong>。特定の非サイカー部隊（Dark Apostle、Chaplain など）が唱えるか、デーモンとの契約を表します。ワープチャージは不要です。',
  ],
  // lists and hubs
  'Chaos': ['Chaos', 'Caos', 'Хаос', '混沌'],
  'Imperium': ['Imperium', 'Imperio', 'Империум', '帝国'],
  'Xenos': ['Xenos', 'Xenos', 'Ксеносы', 'ゼノス'],
  'Factions': ['Fraktionen', 'Facciones', 'Фракции', '勢力'],
  'Units': ['Einheiten', 'Unidades', 'Отряды', '部隊'],
  'Army Customisation': ['Armeeanpassung', 'Personalización del ejército', 'Настройка армии', '軍のカスタマイズ'],
  'Psychic Powers': ['Psikräfte', 'Poderes psíquicos', 'Психические силы', 'サイキックパワー'],
  'Armory': ['Armory', 'Armory', 'Armory', 'アーマリー'],
  'Escalation supplement': ['Escalation-Supplement', 'Suplemento Escalation', 'Дополнение Escalation', 'エスカレーション補足'],
  'Unlocked via the Escalation supplement (Epic Battle engagement)': [
    'Freigeschaltet über das Escalation-Supplement (Epic Battle)', 'Se desbloquea con el suplemento Escalation (enfrentamiento Epic Battle)',
    'Открывается дополнением Escalation (сражение Epic Battle)', 'エスカレーション補足で解放（エピック・バトル）'],
  'Inquisitor Warbands': ['Inquisitor-Kriegstrupps', 'Bandas de guerra del Inquisidor', 'Боевые группы Инквизитора', '審問官ウォーバンド'],
  'Henchman Warband': ['Henchman Warband', 'Henchman Warband', 'Henchman Warband', 'ヘンチマン・ウォーバンド'],
  'Warband Specialists': ['Warband-Spezialisten', 'Especialistas de la banda de guerra', 'Специалисты боевой группы', 'ウォーバンドのスペシャリスト'],
  'Every Inquisitor may select a single <strong>Henchman Warband</strong> and must start the game attached to it. A Warband consists of specialists chosen from the list below. An Inquisitor may select up to <strong>6 specialist models</strong>; an <strong>Inquisitor Lord</strong> may select up to <strong>12</strong>. Each specialist type may only be added once.': [
    'Jeder Inquisitor darf einen einzelnen <strong>Henchman Warband</strong> wählen und beginnt das Spiel mit ihm verbunden. Ein Warband besteht aus Spezialisten aus der Liste unten. Ein Inquisitor darf bis zu <strong>6 Spezialistenmodelle</strong> wählen; ein <strong>Inquisitor Lord</strong> bis zu <strong>12</strong>. Jeder Spezialistentyp darf nur einmal hinzugefügt werden.',
    'Cada Inquisidor puede elegir una única <strong>Henchman Warband</strong> y debe empezar la partida unido a ella. Una Warband se compone de especialistas elegidos de la lista de abajo. Un Inquisidor puede elegir hasta <strong>6 modelos especialistas</strong>; un <strong>Inquisitor Lord</strong>, hasta <strong>12</strong>. Cada tipo de especialista solo puede añadirse una vez.',
    'Каждый Инквизитор может выбрать одну <strong>Henchman Warband</strong> и должен начать игру присоединённым к ней. Warband состоит из специалистов из списка ниже. Инквизитор может выбрать до <strong>6 моделей-специалистов</strong>; <strong>Inquisitor Lord</strong> — до <strong>12</strong>. Каждый тип специалиста можно добавить только один раз.',
    'すべての審問官は<strong>ヘンチマン・ウォーバンド</strong>を1つ選べ、ゲーム開始時にそれに付随していなければなりません。ウォーバンドは下のリストから選んだスペシャリストで構成されます。審問官は最大<strong>6体のスペシャリストモデル</strong>、<strong>Inquisitor Lord</strong> は最大<strong>12体</strong>まで選べます。各スペシャリストは1種類につき1回だけ追加できます。',
  ],
};

export function phrase(lang: WikiLang, text: string): string {
  if (lang === 'en') return text;
  const row = ROWS[text];
  return row ? row[COL[lang]] : text;
}
