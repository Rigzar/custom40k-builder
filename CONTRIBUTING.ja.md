# Custom 40k Builder への貢献

**他の言語で読む：** [English](CONTRIBUTING.md) · [Deutsch](CONTRIBUTING.de.md) · [Español](CONTRIBUTING.es.md) · [Русский](CONTRIBUTING.ru.md)

ビルダーの改善にご協力いただきありがとうございます。このガイドには、データの修正、翻訳の修正、新しいアートワーク、バグ修正、新機能など、貢献に必要なことがすべて載っています。

---

## 目次

1. [クイックスタート](#クイックスタート)
2. [問題の報告](#問題の報告)
3. [データの修正（コーディング不要）](#データの修正コーディング不要)
4. [翻訳](#翻訳)
5. [アートの貢献](#アートの貢献)
6. [コードの貢献](#コードの貢献)
7. [プルリクエストのチェックリスト](#プルリクエストのチェックリスト)

---

## クイックスタート

```bash
git clone https://github.com/Rigzar/custom40k-builder.git
cd custom40k-builder
npm install
npm run build   # エラーなしで完了すること
```

> **`scripts/` は `.gitignore` に入っています** — メンテナーの開発ツールが入っています。一部は意図的にリポジトリで管理されています（`git add -f scripts/<名前>`）：ガード（`check_*.ts` / `.cjs`）、シート用ツール（`fetch_codex.cjs`、`unit_sync.cjs`、`check_unit_update.cjs`、`sync_codex_versions.cjs`、`convert_*.cjs`）、いくつかのテスト（`_gitfinda_test.mjs`、`_gitfinda_time_test.ts`、`_headers_test.ts`、`_ja_names_test.ts`、`_tts_*.ts`）。このガイドに出てくるそれ以外のスクリプトはメンテナーのローカルにしかありません。必要ならissueで頼んでください。TypeScriptのスクリプトは `npx tsx scripts/<名前>.ts` で実行します。

> 変更中は **`npm run dev` を実行しないでください** — 正しさの確認には `npm run build` を使います。ビルド後に `dist/index.html` を開くか、https://custom40k-builder.vercel.app のライブアプリでプレビューできます。

---

## 問題の報告

GitHub Issues を使い、適切なテンプレートを選んでください：

- **Bug report** — アプリの動作がおかしい（ポイントが違う、オプションが表示されない、クラッシュ）
- **Data correction** — ユニットの能力値、武器、オプション、ポイントがルールと一致しない

issueを作るときは、必ず次を含めてください：
- 勢力名とユニット名
- 期待した結果と実際の結果
- データの問題なら、参照しているルールのページ／セクション

---

## データの修正（コーディング不要）

これは最も効果の高い貢献方法です。各勢力はそれぞれ専用のフォルダにあります：

```
data/parsed/<勢力>/
  units/              <- ユニットごとに純粋な .json を1つ（全勢力）
    troops/
      traitor_guard.json  <- 1ユニット：JSONのみ、import/export なし
    hq/  elites/  ...      <- スロットごとにフォルダ1つ
    index.ts           <- 唯一の .ts：すべての .json をimportし、faction、slot_to_units、units をexportする
  unit-notes.md       <- （一部の勢力）JSONに入れられない、昔のヘッダーコメント
  armory/
    general.json      <- 汎用アーモリー（全モデル）
    mark_khorne.json  <- マーク別アーモリー（ケイオス勢力）
    legion_*.json     <- チャプター／レガシーのアーモリー（レガシーごとに1つ）
  archetypes.json     <- アーキタイプ、レガシー、特性
  animosity.json      <- マークの敵対／同盟マトリクス（マークのある勢力のみ：CSM、CD）
  psychic/            <- ディシプリン、祈り、daemonkin
```

2つのホルス・ヘレシー補足も同じ構成です：`data/parsed/horus_heresy_legiones_astartes/` と
`data/parsed/horus_heresy_forces_of_the_machine_god/`（アーモリーとユニット以外の部分用に `supplement.json` もあります）。
**アプリ内の勢力キーはフォルダ名と一致するとは限りません**（`horus_heresy`、`legio_titanicus`）：
対応づけるのは `src/data/loaders.ts` だけです。

> **すべての勢力が同じ構成を使います：純粋なJSON。** 各ユニットは `import` も `export` もない `.json` ファイルで、
> フォルダにある `.ts` はちょうど1つ、それらをすべてimportする `units/index.ts` です。理由はツールです：
> コーデックス作者の協力者がシートからデータを自動更新しており、それができるのは100%JSONのファイルだけだからです。
> ユニットを編集するには `.json` を開きます。JSONにはコメントがないため、昔の `.ts` ファイルが持っていたヘッダーのメモは
> 今は `data/parsed/<勢力>/unit-notes.md` にあります（Tyranids：`units/NOTES.md`）。ユニットを追加するには
> 2つのものが必要です：その `.json` と、`units/index.ts` への `import` 1行と `units` のエントリ1つ（さらに `slot_to_units` の
> 正しいスロットの下にその名前）。`node scripts/convert_units_to_json.cjs <勢力>` は、まだ古い形式の勢力を変換します
> （デフォルトはドライラン。`--lenient --write` を `npx tsx` で実行すると、文字どおりのJSONでないファイルも読み込みます）。
> 確認なしに、変換スクリプトや更新スクリプトを自分のデータに対して実行しないでください。
>
> `node scripts/unit_sync.cjs "Codex/<勢力>.ods" <勢力>` は、更新したシートとユニットファイルを比較して、ポイント、能力値、武器のすべての差を表示します（`--write` で適用、`--equipped` はその中のすべてが既知の武器の場合に「equipped with」の文も書き換えます）。オプショングループや能力のテキストには一切触れません：それらは人が手で結び付ける必要があります。

### どのフィールドを誰が書くか — シートが間違っているときの対応

ユニットファイルは**すべてが手書きではありません**。作者のGoogleスプレッドシートがデータシートの事実の唯一の情報源で、
`UnwiseGetData/update_units.py`（末尾の*ユニット自動更新*を参照）がそれを書き換えます。分担は次のとおりです：

| シートの更新が書く（手で編集**しない**） | 人が書く（自由に編集してよい） |
|---|---|
| `name`、`models`（能力値、ポイント、min/max）、`variant_models`、`min_cost`、`default_size`、`equipped_with`、`weapons`、`abilities`、`unit_type`、`is_monster`、`keywords` | `option_groups`、フラグ `has_armory_access` / `champion_has_armory` / `is_character` / `is_psyker` / `advisor`、`armory/`、`archetypes.json`、`psychic/`、エンジンのルール |

**シートが書く値が間違っているなら、間違っているのはシートです：作者に知らせて、JSONにパッチを当てないでください。**
手で直しても次のユニット更新で上書きされますし、エンジン側の回避策は、作者がセル1つで直せる間違いを隠してしまいます。
タブと行を正確に伝えてください（*「Tau Hammerhead：Railgunの見出しに `*` がない」*）。issueかDiscordで送ります。
報告すべき例：`*` のない武器の見出し（モードが結び付かない）、1つのタブで2通りに書かれた名前（`Servoarm` / `Servo arm`）、
ユニットのWEAPON表にない武器を指す交換オプション、別の列に属すべき文字が入ったセル。
**データガード**（`check_*.ts`）は*私たちの*コードと*私たちの*フィールドのためのものです。シートのミスを許容するようにガードを教え込まないでください。

管理者の「データオーバーライド」（Inquisitorパネル）のうち、ポイント・能力値・武器の種類は、スクリプトが書く19勢力では無視されます
（`applyDataOverrides(data, list, sheetOwned)`）：そこではシートが優先されます。ホルス・ヘレシー補足、Legio Titanicus、Escalation には引き続き適用されます。

### 新しいユニットを追加する

ユニットが実在するのは、**2つ**の場所に現れるときだけです。片方にしかない名前には到達できません。

1. **`data/parsed/<勢力>/units/<スロット>/<ユニット>.json`** — データシートそのもの。
2. **`data/parsed/<勢力>/units/index.ts`** — **2つ**のエントリ。見落とされやすいのがこの手順です：
   - `import dactylis from './heavy_support/dactylis.json';` の行と、`units` マップ内の `"Dactylis": dactylis as Unit,`
   - `slot_to_units` の正しいスロットの下に `"Dactylis",`

**`slot_to_units` にあって `units` マップにエントリがない名前は、カタログには出ますが何にも解決されません。**
オークのLord of Warがこのせいで何か月も到達不能でした。

**名前はそのすべてで大文字小文字を含めて完全に一致していなければなりません** — ユニット自身の `"name"`、各モデル行の
`"name"`、`units` マップのキー、`slot_to_units` のエントリ。エンジンはこの文字列でユニットを探すので、大文字1文字で別のユニットになります。

**能力値の行を列の見出しと照らし合わせてください。** シートは
`No. | NAME | M | WS | BS | S | T | W | I | A | LD | SV | POINTS` の順で、`T W I A LD` は続けて並びます：
Dactylisは、Woundsと Leadershipが入れ替わった状態で入ってしまいました。`No.` は部隊の人数なので、`1-2` は
`min: 1, max: 2` を意味します。

**シートで `*` が付いた武器はその下にプロフィールがあり**、それぞれが `"<Weapon> - <Profile>"` という名前の別エントリです。
プロフィールは1つずつ、その行を横にそのまま写し、1つのプロフィールの能力リストを別のものに写さないでください —
2つのプロフィールが隣の能力を持って届いたせいで、`AT(2)` がまるごと抜けていました。閉じていない括弧のある能力
（`Suppression(3`）は、検索が完全一致のテキストで行われるため、何にも解決されません。

**「may select any number of Basic and Advanced Biomorphs (see Armory)」やそれに類する行を**ユニットのオプションにコピーしないでください。
それらは勢力のアーモリーにあり、アプリが追加します。`option_groups` に入れるのは、データシート自身が名前を挙げ、独自の価格を持つオプションだけです。

**Nodeなしでの確認：** 自分のファイルをシートの隣に置いてフィールドごとに読み、PRの「Files changed」タブを開いて上の3つのファイルがすべてあることを確認します。
`units/index.ts` が一覧にないなら、そのユニットは接続されていません。マージ前にコーデックス比較にかけたい場合はPRにそう書いてください —
そのツールはシートと食い違うフィールドごとに1行を出力します。


### 作業の流れ

1. `data/parsed/<勢力>/units/<スロット>/` に移動し、該当する `.json` ファイルを開きます。
2. オブジェクトは下の表のフィールド名を使います。JSONにはコメントがありません：ユニットにメモが必要なら `units/` の隣の `unit-notes.md` に書きます。
3. 各フィールドを手元のルールと照らし合わせます。
4. 間違いを直し、`npm run build` を実行してJSONが正しくアプリがコンパイルできることを確認します。
5. プルリクエストを開きます。

### ユニットごとに確認するフィールド

上の「シートが書く」列のフィールドは、シートをレビューするときに何を見ればよいかを知るためにここに載せています。
違いは報告し、編集はしないでください。`option_groups`、フラグ、`armory/`、`archetypes.json` は皆さんが直すものです。

| フィールド | 確認すること |
|---|---|
| `models[].points` | モデルごとのポイントコスト |
| `models[].min` / `models[].max` | モデル数の最小と最大 |
| `models[].stats` | M / WS / BS / S / T / W / A / Ld / Save |
| `weapons[]` | すべての武器プロフィールがある；S / AP / D / Abilities が正しい |
| `option_groups[]` | 見出しテキストがルールと一致；すべての選択肢が載っている；ポイントコストが正しい |
| `option_groups[].per_model` | 見出しが「for +X points **per model**」または「the entire squad may receive one of the following... **per model**」のとき `true` にする — インラインオプション（`inline_pts`）と通常の `choices[]` グループの両方に当てはまる；これがないとコストは部隊サイズに比例せず、ユニット全体で1回だけ課金される |
| `option_groups[].replaces` | この交換で外される武器の正確な名前を並べる。武器表から古い武器を外すグループには必須 — ないと古い武器と新しい武器の両方が表示される。複数プロフィールの武器（例：「Taser lance - Charge」/「Taser lance - Melee」）は、共通の接頭辞ではなく各プロフィール名をすべて並べる — 照合は完全一致で、削って比べることはしない。**落とし穴**：常に表示される基本武器の名前とたまたま完全に同じ選択肢名は、その武器をデフォルトで隠してしまう — 純粋に追加するだけの選択肢（`equipped_with` にすでにある武器をさらにもう1つ与える）に、基本武器とまったく同じ名前を付けないこと。 |
| `option_groups[].choices[].name`（数量の接頭辞付き） | 選択肢を「two X」/「2 X」/「four X」などと**決して**名付けない — 武器表の制御は選択肢名を武器自身の名前と完全一致で照合するため、数量の接頭辞は決して一致せず、未購入でも武器が常に表示される。選択肢を、飾りのない単数形の武器名に改名する（見出しのテキストがすでに「both」/「two」などを伝えている）；価格には影響しない。 |
| `is_character` / `is_vehicle` / `is_psyker` | ユニット分類のフラグ |
| `champion_has_armory` | チャンピオン（サージェント相当）が単独でアーモリーを使える場合のみ true |
| `advisor` | アドバイザーのユニット（例：Commissar）のみ true |
| `abilities[]` | 能力のテキストがあり正しい |
| `unit_type` | Core Rulesの正式な表記を使う：`Infantry`、`Bike`、`Character Model`、`Jet Bike`、`Jump Pack Infantry`、`Monstrous Creature`、`Monstrous Infantry`、`Walker`、`Flyer`、`Vehicle` |

### `option_groups` の制約タイプ

| `constraint.type` | 意味 |
|---|---|
| `one` | リストから0個または1個を選ぶ（最も一般的） |
| `every` | 各モデルが個別に選ぶ — コストはモデルごと |
| `per_n` | Nモデルごとに M 回の選択（`constraint.per_n` がN、`constraint.count_per_n` がM — 例：「for every 3 models, 1 may swap」は `per_n:3, count_per_n:1`） |
| `fixed_max` | 合計で最大N回の選択（`constraint.max` がN） |
| `fixed_max` + `reduced_when_selected` | 別のグループ（`if_group`、インデックスで指定）で選択があると、上限がより低い `max` に下がる — 例：Warbuggy：小型砲3つ、ただし大型砲を取ると1つ |
| 選択肢がなく `inline_pts` を持つグループの `per_n` | 数えるチェックボックス：Nモデルのブロック数までのステッパーで、数に応じて価格が付く — 例：Heavy Weapons Teamごとに1つのVox |
| `mark` | ケイオスのマーク選択 |
| `veteran` | ベテラン能力のスロット |
| `unique_upgrade` | ユニット単位の唯一制限 |

制約タイプではなく、グループ自身にある2つのフラグ：`per_model: true`（コストが部隊に比例する）と
`independent_choices: true`（各選択肢が1つのプールを共有せず、それぞれ独自の上限を持つ — Tyranidの
バイオモルフのリストで、古い共有の `max: 16` は規則ではなく選択肢の数でした）。
`variant_link` はグループを `variant_models` の昇格（Spanna、Overlord、Veteran Sergeant）に結び付けます。
`applies_to_model` は交換を1つのモデル行に限定します。**新しい選択肢はリストの末尾に追加してください**：
保存された軍勢は選択肢のインデックスを保存しているので、並べ替えると人々の選択が黙ってずれます。

### 武器、アーモリーのアイテム、アーキタイプ、特性、レガシーを追加する

**最初に理解すべき1点：ルールを書き留めても、それが何かをするようにはなりません。** その多くは2か所にあります — 現れて価格が付く元になるデータと、
働かせるエンジンです。書き留めてあった勢力ルールをすべて調べたところ、アプリのどこからも参照されていないものが56件ありました。
多くは卓上でのみ使う表で、散文のままで正しいものでしたが、4件は本物のバグでした：何も与えない遺物、13のデータシートが受け取れなかったウォード・セーブ、
無料になっていた軍全体のアップグレード、飾りでしかなかった条件。

`node scripts/audit_faction_rule_coverage.cjs <勢力>` は、エンジンが作用できないルールを一覧にします。

**データシートの武器**は、そのユニットの `weapons[]` に入れます。シートで `*` が付いていれば、各プロフィールが
`"<Weapon> - <Profile>"` という名前の別エントリです。オプションが武器を置き換える場合、そのオプショングループには
正確な武器名を（各プロフィールを書き出して）並べた `replaces` が必要です — ないと古い武器と新しい武器の両方が表示されます。
選択肢名に数量を入れないでください（「two Flamers」）：制御は選択肢名を武器名と完全一致で照合するので、購入したかどうかに関係なく武器が表示されてしまいます。

**アーモリーのアイテム**は `armory/general.json`（または `mark_*.json` / `legion_*.json`）に入れます。価格の列はシートのとおりに写します —
NORMAL / CHARACTER MODELS / MONSTROUS CREATURES & VEHICLES で、3番目はMonstrous **Creatures** と車両用で、Monstrous Infantryではありません。
説明は一字一句そのまま写します：エンジンがそれを読みます。大文字Uの `Unique` は軍に1つまで；
「can be taken multiple times」と「every enhancement is unique per army」も、そのテキストから読み取られます。
テキストが能力を二重引用符で引用しているアイテムは、その能力を自動的に与えます — だから言い回しは見た目以上に重要です。

**アーキタイプ**は `archetypes.json` のエントリ**と**、`src/engine/archetypes/index.ts` のルール（`ARCHETYPE_RULES`）です。
JSONだけでは選択可能になるだけで、他には何も起きません。その `notes` はプレイヤーに表示されるだけで何も与えません；
実際に起こすべきこと — スロットの付け替え、上限、付与される能力 — はルールオブジェクトのフィールドです。
3つのInquisitorアーキタイプは今もルールに解決されないので、アプリはそれらを提示しますが何も起きません。

**特性**は `archetypes.json` のエントリ**と**、その勢力の `traits.ts` の効果（`TRAIT_EFFECTS`）です。
3つの価格列はアーモリーのものと対応し、`*` はコストがWoundまたはHull pointごとという意味です。
各効果は `applies_to` — `all`、`creature`、`vehicle`、`character`、`infantry`、`monster`、`psyker` — を持ち、その範囲が誰が受け取るかを決めます。
`TRAIT_EFFECTS` にエントリのない特性は、選べてポイントも使いますが何も変えません。

**レガシー**は `archetypes.json` のエントリで、その `armory_key` は `src/data/loaders.ts` でその勢力に使われているキーと**一致していなければなりません**；
ずれるとアーモリーのタブは現れません。勢力がすべてのレガシー遺物を1つのファイルにまとめている場合、各遺物自身のテキストが制限
（「Alaitoc only.」「Ymyr Conglomerate only.」）を持ち、条件はレガシー自身の説明から導かれます — なので両方の文を書かれたとおりに正確に写す必要があります。

**勢力まるごと**はデータを置くだけでは済みません：専用のフォルダ、`src/data/loaders.ts` のローダーのエントリ、
`src/data/alliedMatrix.ts` の同盟マトリクスの行と列が必要です。始める前にissueを開いてください。

### アーモリーファイルの構造

`armory/general.json` には、対象のすべてのモデルが使える武器、装備、daemon武器が入ります。マーク別アーモリー（`armory/mark_khorne.json` など）とチャプター／レガシーのアーモリー（`armory/legion_*.json`）も同じ構造です：

```json
{
  "name": "Armory Name",
  "weapons": [...],
  "equipment": [...],
  "daemon_weapons": []
}
```

各 `archetypes.json` のレガシーエントリの `armory_key` フィールドは、`src/data/loaders.ts` でその勢力の `armory_legions` オブジェクトに使われているキーと**一致していなければなりません** — ずれると、レガシーのアーモリータブは現れません。経緯は `ki-legacy-armory-link-01` を参照してください。

---

## 翻訳

> **ロシア語（RU）と日本語（JA）は2026年10月に加わりました。** アプリとwikiは現在、EN、DE、ES、RU、JAの5言語です。
> - **UIのラベル：** `src/i18n/ru.json` と `src/i18n/ja.json` は英語の表のすべてのキーを持ちます（同じキー名、同じ `{placeholders}`）；`src/i18n/index.ts` がそれらを読み込みます。JSONを編集し、`npm run build` を実行します。
> - **用語集の説明（特殊ルール／武器能力）：** `src/data/ruleDescriptions.ru.json` と `.ja.json`、ルールのキーで引きます。ルールの*名前*は意図的に英語のままです — すべてのデータシートに印刷されるキーワードだからです。
> - **バナー、チートシート、補足カード、変更履歴のウィンドウ、メッセージ：** それぞれ自分のコンポーネントに言語別の表があります；`es` の隣に `ru`/`ja` のブロックを追加してください。
> - **Wiki：** `wiki/src/lib/i18n-builtin.ts`（UI＋ホームページ）が言語ごと；`wiki/` 内の `npm run build` が全言語を1つの `dist/` にビルドします（英語はルート、他は `/de`、`/es`、`/ru`、`/ja`）。長いCore RulesとMissionsのページは、ビルドした英語のHTMLからブロックごとに翻訳されます（`wiki/scripts/extract-page-strings.mjs` → `wiki/src/data/page-strings/`、翻訳は `wiki/src/data/page-translations/<言語>.json`）；これらの英語ページを編集したら、抽出スクリプトを再実行して新しい文字列を追加してください。データシートの能力テキストは `src/data/abilityTexts.<言語>.json`（`abilityKey` で引く）にあり、最新の変更履歴は `src/data/changelog.i18n.json` にあります。
> - Inquisitor管理パネルは英語のままです；その翻訳エディタは英語以外の4言語すべてを扱います。

アプリは5つの言語をサポートします：**英語（EN）**、**ドイツ語（DE）**、**スペイン語（ES）**、**ロシア語（RU）**、**日本語（JA）**。EN、DE、ESは `src/i18n/index.ts` の中にあり、RUとJAは `src/i18n/ru.json` と `ja.json` にあります（上の注を参照）。翻訳対象のテキストはいくつかの別々の場所にあります — 始める前に以下のセクションを読んでください。

### 1. UI文字列 — `src/i18n/index.ts`

インターフェースのラベル、ボタンのテキスト、セクションの見出しはすべてここにあります。`index.ts` では、表は言語ごとに1つのオブジェクト（`en`、`de`、`es`）で、それぞれ同じキーを持ちます：

```ts
// en: { ... appTitle: 'Custom 40k Army Builder', ... }
// de: { ... appTitle: 'Custom 40k Armeeliste', ... }
// es: { ... appTitle: 'Creador de Ejércitos Custom 40k', ... }
```
RUとJAは同じキー名のフラットなJSONファイルです。ある言語で欠けているキーは英語にフォールバックします；**新しいキーは `index.ts` の `TranslationKey` ユニオンと5つすべての表に追加しなければなりません**。

**未翻訳のUI文字列の見つけ方：**
ファイル（および `ru.json` / `ja.json`）で、値が英語と同一のエントリを探します — それは機械翻訳か欠落です。ネイティブスピーカーによる修正はいつでも歓迎です。

**UI翻訳の追加・修正：**
1. `src/i18n/index.ts` を開きます。
2. 文字列を見つけます（英語のテキストで検索）。
3. `de` / `es` の値（または `ru.json` / `ja.json` の行）を編集します。
4. `npm run build` を実行します — ファイルはTypeScriptなので、タイプミスはビルドエラーになります。
5. プルリクエストを開きます。すべての文字列を直す必要はありません — 一部の改善も歓迎します。

> **ドイツ語の用語：** 文字どおりの翻訳ではなく、Games Workshopの公式ドイツ語用語を使ってください。スロット名はGWの慣例に従います：`Standard`（Troops）、`Elite`（Elites）、`Sturm`（Fast Attack）、`Unterstützung`（Heavy Support）。能力値の略語：`Reichw.`（Range）、`DS`（AP）、`SW`（Damage）。アーモリーは `Rüstkammer` です。

### 2. ルールの説明 — 変更履歴、既知の問題、エンジンファイル

エンジン内のルールテキスト（特性の説明、アーキタイプのメモ、能力の説明）は現在**英語のみ**です。これらはTypeScriptのエンジンファイルと `src/data/changelog.ts` / `src/data/known-issues.ts` に通常の文字列として保存されています。

**標準のコメントパターンが翻訳者の助けになる理由：**
各エンジンファイル（アーキタイプ、特性、レガシー）では、実装するコードの直前に元のルールテキストがコメントとして置かれています。例：

```ts
// SOURCE: CSM Army Customisation — Traits
// Blood Feud: If the unit uses a Charge order or gets charged by an enemy
// unit, it gains +1 to melee hit rolls until the end of the current battle
// round. COST: 5 normal · 0 character · 5 monster/vehicle
'Blood Feud': [
  { type: 'unit_ability', name: 'Blood Feud', desc: '...', applies_to: 'all' },
],
```

このコメントは正確な英語の原文を示すので、`desc` がドイツ語やスペイン語で何と言うべきかが正確に分かります。元のHTMLソースファイルを開く必要はありません。

**ルールの説明を翻訳する — フィールドを多言語にする：**

ルールの `desc` フィールドは現在、通常の英語の文字列です。多言語にするには、型を `string` から `I18nString`（`src/data/changelog.ts` で定義）に変えます：

```ts
// 変更前 — 英語のみ：
desc: 'The unit gains +1 to melee hit rolls when charging or charged.',

// 変更後 — 3言語：
desc: {
  en: 'The unit gains +1 to melee hit rolls when charging or charged.',
  de: 'Die Einheit erhält +1 auf Nahkampf-Trefferproben, wenn sie angreift oder angegriffen wird.',
  es: 'La unidad gana +1 a las tiradas de golpe en cuerpo a cuerpo al cargar o ser cargada.',
},
```

UIの `useT()` フックは `I18nString` を現在の言語に自動で解決します — UIの変更は不要で、データを変えるだけです。型を変えると、TypeScriptがそのフィールドを読むすべての箇所の更新を教えてくれます。

**descフィールドを変換する手順：**
1. `types/data.ts` または該当のインターフェースでフィールドの型を `string` から `I18nString` に変更します（`'../data/changelog'` からimport）。
2. エンジンファイルの値を `{ en, de, es }` のオブジェクト形式に更新します。
3. `npm run build` を実行します — TypeScriptがそのフィールドの通常の文字列の使用箇所を残らず指摘するので、見落としません。
4. 今は英語訳しかない場合は、3つすべてに同じテキストをプレースホルダーとして使えます：`{ en: '...', de: '...', es: '...' }` — DE/ESは後でネイティブスピーカーが改善できます。

**変更履歴と既知の問題**（`src/data/changelog.ts`、`src/data/known-issues.ts`）はすでに `I18nString` を使っています。変更履歴は `changelog.ts` に英語で書かれます；最新の項目のドイツ語、スペイン語、ロシア語、日本語版は `src/data/changelog.i18n.json` にバージョンごとにあり、**各言語の配列は英語の項目とまったく同じ数の箇条書きを持たなければならず、そうでないと翻訳は黙って無視されます**（`scripts/_changelog_align_test.ts` が確認します）。英語の箇条書きと4つの翻訳を同じ変更で追加してください。トップページのお知らせ（`LandingPage.tsx` の `ANNOUNCEMENT_TEXT`）にも言語ごとのブロックがあります：同じ行を5言語すべてに追加してください。

### 翻訳のPR

- `i18n/index.ts` だけのPRなら、開発環境一式は不要です。ファイルを編集し、`npm run build` を実行して通ることを確認します。
- 翻訳に自信がない場合は、PRの説明にメモを残してください。
- 機械翻訳は出発点として許容されます；ネイティブスピーカーのレビューが望ましいです。

---

## アートの貢献

アプリは印刷ビューに勢力別の背景画像を表示します。各背景は `src/assets/` のPNGファイルです。

### 必要なもの

次の勢力は現在、共有またはプレースホルダーの背景を使っており、専用のアートワークがあると助かります：

| 勢力 | 現在の背景 |
|---|---|
| Space Marines | 共有（Imperium） |
| Grey Knights | 共有（Imperium） |
| Inquisition | 共有（Imperium） |
| Assassins | 共有（Imperium） |
| Eldar | 汎用のフォールバック |
| Dark Eldar | 汎用のフォールバック |
| Harlequins | 汎用のフォールバック |
| Leagues of Votann | 汎用のフォールバック |

### 要件

- **形式：** PNG
- **最小サイズ：** 1600 × 900 px（画像は全幅の背景として使われます）
- **スタイル：** 暗く雰囲気があり、Warhammer 40kの文脈に合うもの
- **著作権：** ファンアートとオリジナルのアートワークのみ。Games Workshop公式アートのスキャンや写真は提出しないでください。画像はご自身の作品か、CC BY-NC-SA 4.0と互換性のあるクリエイティブ・コモンズ・ライセンスのものでなければなりません。

### 命名規則

ファイル名は `<factionKey>Background.png` とし、コードベースで使われているキャメルケースの勢力キーに合わせます。例：`eldarBackground.png`、`darkEldarBackground.png`、`harlequisBackground.png`。

### 新しい背景の登録方法

1. PNGを `src/assets/` に追加します。
2. `src/components/PrintView.tsx` を開きます。
3. ファイルの先頭で、既存のimportに倣って画像をimportします。
4. 勢力名とimportした画像を対応づける `FACTION_BG` オブジェクトにエントリを追加します。
5. `npm run build` を実行し、画像が正しく読み込まれることを確認します。

### アートの提出

PNGファイルと `PrintView.tsx` の変更を含めたプルリクエストを開いてください。CC互換であることを確認できるよう、画像の出典または作者についてのメモを添えてください。

---

## コードの貢献

### アーキテクチャの概要

```
src/engine/     ゲームロジック — ルール、ポイント、検証はここを編集
src/components/ UI — 見た目の変更はここを編集
src/store/      Zustandの状態 — 軍勢リストのCRUDと選択
src/types/      TypeScriptの型 — Unit、Weapon、RosterEntry など
src/data/       静的データ — 変更履歴、勢力のメタデータ
src/i18n/       翻訳文字列（ENとDEとESは index.ts、RUとJAは ru.json / ja.json）
src/utils/      自前の状態を持たない共有ヘルパー — 能力値の計算、武器名、サイキックパワーの検索、エクスポート
src/lib/        クライアントのヘルパー：API呼び出し、Gitfindaのタイムゾーン、直接対決、マークの計算
api/            Vercelのサーバーレス関数（12個の上限）と共有コードの api/_lib/
data/parsed/    勢力のデータ（JSON）— 「データの修正」を参照
wiki/           Wiki（Astro、5言語）— wiki/ の中で `npm run build` を使って別にビルド
UnwiseGetData/  作者の協力者によるシート更新スクリプト（Python）— 「ユニット自動更新」を参照
scripts/        開発ツールとガード（.gitignore対象；中核部分は管理対象）
.github/        CI、CodeQL、ユニット更新のワークフロー（update-units.yml）
tts/            Tabletop Simulatorのmod（Lua）とそのヘッドレステスト
```

### ナビゲーション — 4つのステップ

軍勢の構築は、タブの集まりではなく4ステップの直線的な流れです。`App.tsx` がナビゲーションの状態をすべて持ちます：
`screen`（`'home'` | `'flow'`）、`step`、`detachment`（Unitsステップがどの軍を表示しているか）。
アプリ内でプレイヤーの居場所を決めるものは他にありません — 画面コンポーネントの中に2つ目のステートマシンを足そうとしているなら、それがこの構造が置き換えた間違いです。

| ファイル | 役割 |
|---|---|
| `components/StepBar.tsx` | ステップバー本体＋`Step` 型と `STEP_ORDER`。ステップ②〜④は勢力のデータが読み込まれるまでロックされる。スマホでは現在のステップだけがラベルを保つ。 |
| `components/LandingPage.tsx` | 玄関口だけ — ロゴ、リリースノート、管理者のお知らせ、クイックロード、補足。独自の画面を増やしてはならない。 |
| `components/FactionStep.tsx` | ① Battle Setup＋保存した軍勢＋勢力のグリッド。 |
| `components/ReviewStep.tsx` | ④ 判定、ポイント（デタッチメントごとに分割）、検証の全リスト、保存／印刷／エクスポート。 |
| `data/factionCatalog.ts` | `CATEGORIES` / `ALL_FACTIONS` / `DEFAULT_CODEX_VERSIONS` — 勢力グリッドと管理パネルで共有する単純なデータ。 |

ステップ②（Configuration）と③（Units）は `App.tsx` の中でインラインに描画されます。②はユニット以外の軍勢に関するすべて
（ドクトリン、レガシー、特性、同盟デタッチメント）を担当します。③はカタログとリストを担当し、同盟がある場合は Primary / Allied の切り替えがあります。

**ここに何かを足すときのルール：** ステップ間の移動でデータを失ってはなりません — 唯一の例外は卓上にユニットがある状態で別の勢力に切り替えるときで、その場合は先に確認します。
プレイヤーが到達できるどの画面にも、作業を壊さずに出られる目に見える出口が必要です。

### エンジンのファイル

| ファイル | 役割 |
|---|---|
| `points.ts` | ポイント計算 — 基本コスト＋オプション＋特性＋アーモリー |
| `resolver.ts` | ユニットプロフィールの解決 — マーク、バリアント、アーキタイプを適用し、`FACTION_RESOLVERS` に振り分ける；武器グループ（`computeWeaponGroups`）と数（`modelRowCounts`、`fillMissingWeaponCounts`）を作る |
| `validators.ts` | 軍勢の検証 — スロットの上限、アーキタイプの制約、形式の上限 |
| `archetypes/base.ts` | `ArchetypeRule` の形（アーキタイプが設定できるすべてのフラグ）＋デフォルトの `BASE` — 全勢力で共通 |
| `archetypes/index.ts` | `ARCHETYPE_RULES` — 全勢力の全アーキタイプを名前で引く |
| `legacies.ts` | `getLegacyStructuredNotes(faction, name)` / `getLegacyExtraPower(faction, name)` — 各勢力の `codex_<faction>/legacies.ts` を読む勢力横断のディスパッチャー |
| `codex_<faction>/` | 勢力ごとのエンジンモジュール（勢力に1つ） — その勢力のエンジンのファイルはすべてここにあります：`legacies.ts`、`traits.ts`、`resolver.ts`、`validator.ts`、`archetypes/{index.ts,rules.ts}`（勢力が必要とする場合）、さらに `special-abilities.ts`（勢力のルールを一字一句そのまま保持し、`scripts/audit_faction_rule_coverage.cjs` が読む）と監査用の参照 `digest.md` |
| `dataOverrides.ts` | 読み込み時に適用される管理者の修正；シートが書く勢力では無視される（シートが優先） |
| `slotOverrides.ts` | ロスターのエントリに依存するスロット／バリアントのルール（`hasAllMarksVariant`、`ascendedKeywordLine`、…） |
| `transportGate.ts`、`deploymentUpgrades.ts`、`traitEffects.ts`、`engagements.ts`、`sourceCompare.ts` | 輸送の可否；Webway strike / Lightning strike / Tellyportaの価格；特性の効果；Skirmish / Pitched / Epicの上限；ユニットを出典と比較 |
| `equipMods.ts` | 装備の能力値修正（例：「+1 S」）を解析する |
| `keywords.ts` | 装備の使用可否のためのキーワード導出の継ぎ目 — ケイオスのマーク要件（`itemRequiredMark`）、ターミネーター装甲との互換性（`modelRestrictsToTermSubset`）、Gravisとの互換性（`modelRestrictsToGravisSubset`）、InquisitionのOrdo/レガシー解放ヘルパー（`inquisitionLegacyOrdoUnlocks`、`chamberMilitantOrdo`）を一か所で導出します。装甲／マーク／Ordoの制限の導出方法を変えるときは、`ArmoryModal` ではなくここを編集してください。**グリフの規約：** `ᵀ` = ターミネーター互換（Tzeentchのマークでは「ない」）；マークのグリフは `ᴷ`/`ᴺ`/`ˢ`（Khorne/Nurgle/Slaanesh）だけ — Tzeentchはセクションで判定し（`armory_marks.Tzeentch`）、`ᶻ` はグリフが必要になったときのために予約されています。**TzeentchとTerminatorの区別に関わる作業では、メンテナーに確認してください — 推測しないこと。** |

### 武器名と射撃モード（`src/utils/weaponName.ts`）

複数プロフィールの武器はモードごとに1エントリで保存され、データには**2通りの書き方**があります：

```
Plasma pistol - Standard   /  Plasma pistol - Overcharged     （ダッシュ）
Plasma gun (Standard)      /  Plasma gun (Overheating)        （括弧）
```

`resolver.ts`、`PrintView.tsx`、`UnitCard.tsx` はそれぞれ `' - '` だけで分割していたため、括弧で書かれた武器はアプリから見ると
3つの別の武器になっていました — モードは別々の行として印刷され、正しい数が付くのはそのうち1つだけでした。必ずこのファイルの
`weaponBaseName` / `weaponMode` / `isModeRow` を使い、分割を再実装しないでください。

**これらは武器名専用です。** 末尾の `(...)` を取り除くのは、武器名では安全です — ゲーム内で括弧で終わる武器はモードでない限りありません — が、
オプションの選択肢名では安全では*ありません*：オークには `(counts as two arm weapons)` で終わる選択肢があります。

**交換の選択肢を武器の行に対応づける**（同じファイルの `weaponKey`、`resolveChoiceWeapons`）：オプションの選択肢は人が書き、武器の行はシートが書くので、
`Big Zzappa` / `Big zzappa` や `Two Grot bomms` / `Grot bomm` でも出会えなければなりません。ヘルパーは、完全一致の名前、次に `"X - "` の複数プロフィール行、
次にゆるいキー（大文字小文字、先頭の数、複数形の `s` は無視）、次に複合名（`A & B`）の順に試します。選択肢名を `weapons[]` から探すところではどこでも使い、
2つの文字列を自分で比較しないでください。`scripts/check_choice_weapons_match.ts` がこれを固定します。

### すべての行の数（`src/engine/resolver.ts`）

すべてのモデル行とすべての武器行は、**1であっても**数を表示します（`1x Overlord`、`9x Marine + 1x Sergeant`、`3x Spanna`）。2つのフィールドがそれを担います：

- `modelRowCounts[i]` — 常に数値で、`modelsToShow` と並行。**カード、印刷ビュー（両レイアウト）、バトルビューが印刷するのはこれです。**
  昇格したモデルは自分の数を持ちます（`variantCount`）；サイズを変えられるモデル行が1つだけの部隊は `item.size` で数えます；それ以外は、部隊自身の行が固定モデルの残りを取ります。
- `weaponGroups[].count` と `countOverrides` — 武器の「Nx」接頭辞。`fillMissingWeaponCounts` は、数を持たないグループを、それを持つモデル（に `equipped_with` が各モデルに与えるコピー数を掛けたもの）で埋めます。

`modelCounts`（null可）は引き続き存在し、**別の意味を持ちます**：「この行は昇格で分かれた」。武器の計算はそこでのnullを「分かれていない」と読むので、これを印刷しないでください。
サイズを変えられるモデル行が1つだけの部隊（Lootas、Burna Boyz、Dire Avengers…）は、武器をモデルの最小値ではなく `item.size` から数えなければなりません — これが直るまで、
Lootasは15モデルでも `5x Deffgun` と表示されていました。

```
npx tsx scripts/check_row_counts.ts        # モデル行と武器グループが数なしにならない
npx tsx scripts/check_sole_row_counts.ts   # Lootasの場合、Spannaあり・なし
```

**共有の計算を変える前に、スナップショットを取ってください。** `scripts/_snap_profiles.ts` は、各オプションを単独で取った場合の全ユニットの武器グループを出力します；`SNAPMAX=1` は部隊の最大サイズで同じことをします。
前後で出力を比較してください。報告されたユニットだけを確認すると、他の40のユニットでの退行を見逃します。

### アーモリーのウィンドウ（`src/components/ArmoryModal.tsx`）

- **チェックではなく数。** 複数回購入できるアイテムは `[-] n/max [+]` のステッパー（`CopyStepper`）です；単一の上限は `copyCap` で、`ArmoryCountsContext` で共有されます。
  上部の帯「持っているもの」は、各購入を✕付きで並べ、合計、ベテランのスロット `n/max`、「すべて外す」を表示します。
- **グレーアウトした行は理由を言います**（`blockReason`：上限到達、軍に1つまで、Kustom jobのスロットが埋まっている、装甲の競合、「Only for Mek」、価格なし、ベテランのスロットが満杯）。
  行を止めるルールの隣に理由を追加し、5言語すべてにキーを付けてください。
- **車両とユニットは `category` で分けられます**（`vehicle`、`veteran`、なし）。キャラクターでない車両は車両用装備（とオークのKustom jobs）だけが見えます；シートを確認せずに広げないでください。
- **昇格のブロックは、ユニットがすでにユニット全体のアクセス（`has_armory_access`）を持つ場合、アーモリーのボタンを繰り返しません**：Necron Lordでは、Overlordの称号がそれを解放するように見えていました。
  ブロックはチャンピオンだけのアクセスの場合にのみ現れます。
- **アーモリーのWEAPON表にある価格のない武器プロフィール**は、車両アップグレードやdaemon武器が与える武器です；「価格なし」としてグレーで表示されます。それはシートのレイアウトであり、パッチを当てるバグではありません。

### 名前が変わった・削除されたデータシート（`src/engine/unitRenames.ts`）

保存された軍勢は、各エントリをユニットの**名前**で保存しています。作者がデータシートの名前を変えたり削除したりすると、その名前は解決されなくなります — そしてアプリ内のすべての利用側が、解決できないユニットを同じように扱います：
`resolveUnit()` は `undefined` を返し、`UnitCard` は `null` を返し、ポイントの合計は `: 0` になります。結果は最悪の種類の失敗です：エントリは**何も**描画せず、**何も**費用がかからず、それでもスロットを占めます。
プレイヤーには「*1 unit · 0 pts*」というスロットの見出しだけが見え、その下にカードがなく、軍勢がこっそり安くなります。

そのため、ユニットの名前を変えたり削除したりするコーデックス更新には、次のどちらかが必要です：

- **名前変更** → `RENAMED_UNITS` に追加します（勢力の表示名で引く）。読み込み時に、`importRoster` と persist のマイグレーションの両方で新しい名前に移されるので、プレイヤーは気づきません。エントリは
  ずっと残してください；1つ消すと誰かの保存リストが壊れます。
- **削除** → `REMOVED_UNITS` に短いメモを追加します。これはメッセージを良くするだけです。検出は表に**依存しません**：バリデーターは解決に失敗したエントリをすべてフラグし、`ArmyList` は代わりに Remove ボタン付きの `MissingUnitCard` を描画します。

- **更新で削除されるオプションのグループ** → その古い番号でのインデックスを `REMOVED_OPTION_GROUPS` に追加します。`optionQty` は `[groupIndex][choiceIndex]` をキーにしているので、グループを消すと後ろのすべてのグループの番号が振り直され、保存したリストの選択が違うオプションにずれます。
  `applyOptionGroupRemovals()` は、読み込み時に削除されたキーを落とし、残りを前に詰めます。上の2つの名前変更の隣で行われます。Space Marines 1.04が実例です：Desolation SquadのKrak missile launcherの交換は、
  Krak missileが標準のランチャーの無料の2つ目のプロフィールになったため消えました。そのままでは、保存されたVeteran Sergeantのアップグレードがすべて Vengor launcher になっていたでしょう。新しい*選択肢*を追加するだけなら、リストの末尾に置く限りマイグレーションは不要です。

アーキタイプにも同じ問題と、1つ隣のファイルでの同じ解決策があります — `src/engine/archetypes/index.ts` の `RENAMED_ARCHETYPES` です。

### 武器の交換（`scripts/check_weapon_swaps.ts`）

`replaces: ["X"]` を持つオプショングループは、交換を購入したときにエンジンにXを取り除かせます。
これがないと新しい武器が単に**追加**され、カードは両方を表示し、部隊はモデル数より多い銃を持つことになります。エラーは出ず、ポイントも正しいまま — 武器のリストだけが間違います。

```
npx jiti scripts/check_weapon_swaps.ts
```

見出しに swap/replace/exchange の語があり、ユニットが持つ武器の名前を挙げ、選択肢を提示し、`replaces` がないグループをすべてフラグします。**ゼロ以外で終了する**ので、
push前のチェックに安全に組み込めます。GH#116はその1つで、それをきっかけにした調査で9勢力でさらに26件が見つかりました。

行動する前に見出しで確認すべき2つの形：

- **2つの武器が挙げられていても、手放すのは1つだけ。** Inquisition Servitors：*「swap their
  Paired shock chargers **for a** Shock charger and...」* — 受け取るのがShock chargerです。
- **連鎖した交換は、基本の装備ではなく直前の武器を置き換える。** Termagantの装備はSpinefistsで、グループ1はそれをFleshborerに交換し、グループ2が次に*Fleshborer*を交換します。

### 武器を名指しする装備（`scripts/check_weapon_grants.ts`）

アーモリーのアイテムが武器を渡す方法は2つあります：構造化された `effect.grants_weapons`、またはいくつかの文の形に一致するテキストパーサーです。
パーサーの対象から外れやすく、外れるとプレイヤーは黙って何も受け取れません：

```
"...+1 Wound, a twin shuriken catapult and the ability "Jet bike"."   複合文
"Additionally, it gains the "Cleansing flame" weapon."               「the model gains」ではない
"The model gains a Twin heavy stubber."                              「stubber」は既知の接尾辞ではない
```

これは9勢力の13アイテムでした（GH#119）。チェッカーは逆の方向から動きます — 勢力の**実際の武器名**を取り、アイテムの説明の中から探すので、
文の言い回しは関係ありません。

```
npx jiti scripts/check_weapon_grants.ts
```

**ヒットに基づいて行動する前に知っておくべき2点。** これは判決ではなく確認用のリストです：説明は、武器を強化するために合法的にその武器を挙げることがあります
（「the Immolator's Twin heavy flamer gains +1 Strength」）。そして `effect.grants_weapons` は `armory_general.weapons` に対してのみ解決されるので、
そのリストにない武器を挙げても何も与えません — 先にそこへ、付与専用のエントリ（両方の価格を `null`、「Ossific Blades」の慣例）として追加してください。チェッカーはそのケースもフラグします。

### 勢力データの形（`scripts/check_faction_shapes.ts`）

`loaders.ts` は約20個の動的JSONのimportから各勢力を組み立て、結果を `as unknown as FactionData` として返します。そのキャストは重要な役割を持っていますが、
**フィールドが実行時に間違った形でも、コンパイラは有効だと言い続ける**ことを意味します。

これは仮定の話ではありません。`pacts` は `pacts.json` のない18勢力でデフォルトが `{}` でしたが、型は `Power[]` を約束していたため、`data.pacts.find(...)` は `find is not a function` を投げ、
サイキックパワーを選んだすべての軍勢で印刷ビュー全体を落としました — 何週間も、黙って（GH#113）。

```
npx jiti scripts/check_faction_shapes.ts
```

21勢力すべてを実際のローダーに通し、コードが `.find()` を呼ぶすべて — `prayers`、`pacts`、各ディシプリン、すべてのアーモリーのセクション — が本当に配列であることを確認します。
**`loaders.ts`、`psychic/` や `armory/` のデータファイル、`FactionData` の型を触った後に実行してください。** 最初の問題でゼロ以外で終了します。

### 勢力ルールは配線されているか、書かれているだけか？（`scripts/audit_faction_rule_coverage.cjs`）

各 `codex_<faction>/special-abilities.ts` は、その勢力のルールを一字一句そのまま保持しています。これは、それぞれについて尋ねます：
その名前は、エンジンが作用できる場所のどこかに現れるか？ ドキュメント（`special-abilities.ts`、`keywords.ts`、`src/data/`、rules-modelのダイジェスト）は数えません。

```
node scripts/audit_faction_rule_coverage.cjs            # 勢力ごとの要約
node scripts/audit_faction_rule_coverage.cjs --list     # テキストだけのルールすべて
node scripts/audit_faction_rule_coverage.cjs necrons    # 1つの勢力
```

**名前が挙がっていることは何も証明しません。名前が挙がっていないことは、そのルールが発動し得ないことを証明します** — これが信頼できる唯一の方向です。
これは、プレイヤーがEldarの*Webway strike*を、正しく文書化され、正しく印刷され、何にも配線されていない状態で見つけたことから生まれました；データが正しかったため、どのデータ監査もそれを見つけられませんでした。

**出力は読むための作業リストであり、バグのリストではありません。** 大半の項目は卓上での処理で、散文のままで正しいものです。重要なカテゴリは `army-rule` です。

最初の調査から2つのガードが生まれ、どちらも形を真似る価値があります：

- `check_weapon_grants_unit_ability.ts` — 「1体のモデルがXを装備しているなら、ユニットはYを得る」。
  **「Equipped with」は、支給された、またはオプションで取ったという意味であり、データシートに印刷されているという意味では「ない」**；購入できる武器はすべて印刷されているため、ゆるい読み方はGrey Knightsのシート12枚中11枚で誤りになります。
- `check_named_ward_abilities.ts` — 数値を挙げずにウォード・セーブである能力（Sororitasの*Shield of Faith*、6+、Indexでのみ定義）。**最良の値が依然として優先されなければならず**、
  6+がより良いセーブを上書きしてはならず、`Aegis(X+)` は解析されないままでなければなりません — それはディスペルの判定です。

### 遺物の強化（`scripts/check_enhancement_uniqueness.ts`）

19個の遺物は、+6″射程 / +1強度 / -1 AP / +1 ATのいずれかで1つの武器を強化できます。
そのうち10個は**「Can be taken multiple times」**とも書かれ、19個すべてが強化は**軍に1つ**だと書いています。

```
npx tsx scripts/check_enhancement_uniqueness.ts
```

**唯一性の行には2通りの言い回しがあります。** 18個は「Every **enhancement** is unique per army」と書き、
Adeptus Custodesの*Vault weapon*は「Each **improvement** is unique per army」と書きます。最初の方だけに一致させると、その遺物のルールは黙って適用されません — `enhancementsUniquePerArmy()` は両方を受け付けます。

**複数回取れる遺物は、強化のピッカーだけでなく両方のピッカーが開いたままである必要があります**：2つ目のコピーも、どの武器を改良するかを指定しなければなりません。ガードは各条件を別々に指名しており、それは意図的です — 以前の版は共有ヘルパーを探して通過しましたが、
強化の条件はまだ壊れていました。1行上の武器対象の条件が一致してしまったからです。これは、チェックではなく実際のモーダルを操作して見つかりました。

**このルールは意図的に2回適用されます**：ピッカーは取得済みのものをグレーアウトし、バリデーターは重複をフラグします — 修正前に保存されたリストは重複を持っていて、どのピッカーも後からそれをフラグできないからです。

### ウーンドごとに購入する配置ルール（`scripts/check_deployment_upgrades.ts`）

5つの勢力は、Indexのタブで、ユニットを別の方法で配置できるルールをウーンドごとの価格で売っています：Eldar/Harlequinsの**Webway strike**、Dark Eldarの**Webway raid**（Infiltrators、+1/Wound、歩兵）、
Custodesの**Lightning strike**（Deep Strike、+1/Wound または +4/Hull Point、Infantry/Walker）、
Orksの**Tellyporta**（Deep Strike、+1/Wound、車両とモンストラス・クリーチャーは+4/Hull Point）。
これらは `src/engine/deploymentUpgrades.ts` にあり、ロスターのエントリごとに切り替えます。

```
npx tsx scripts/check_deployment_upgrades.ts
```

**「For each STARTED 1000 points」はCEILを意味します**。オークの「or part thereof」も同様です — 上限を1000と1001の*両方*で検証しているのは、このコードベースがfloor/ceilの組を取り違えたことがあるからです
（「for every 500 points」はfloorです）。

**`computeUnitPoints` は `faction` を必須のパラメータとして受け取り、これを続けなければなりません。** デフォルトを与えると、忘れた呼び出し箇所が黙って安く請求してしまいます；必須なら、コンパイラが12か所すべてを指摘します。
`data.faction` ではなく `factionForEntry(item, data)` を渡してください — 同盟デタッチメントは独自のArmy Customisationを選ぶので、同盟のエントリは同盟の勢力で価格が付きます。

**`points.ts` の `resolveUnit` はユニットの検索であり、価格計算の呼び出しではありません。** そのモデルはデータシートの基本コストを持ち、決して動かないので、これを通して価格の差を検証すると常にゼロになります。
価格は `computeUnitPoints` か、リゾルバーの `pts` で計算してください。

### 「Objective secured!」と同盟デタッチメント（`scripts/check_objective_secured_allies.ts`）

Core Rulesは絶対です：*「Units that are taken in an allied detachment can never make use of
the 'Objective secured!' rule.」* **この能力はユニットに3つの経路で届き**、そのうち1つを塞ぐだけでは足りません：

1. Troopsの選択すべてに自動的に付与される（`resolver.ts`）；
2. Eldar Exarchの力**Stand firm**、`EXARCH_POWER_EFFECTS.unitAbility` 経由；
3. **説明がその能力を引用しているすべてのアーモリーアイテム** — `equipMods` の汎用の引用能力パーサーがそれを拾うので、Grey KnightsのMandulian Reliquaryは、アイテムごとの配線なしにそれを与えます。

4つ目の見かけ上の経路は散文です：12のアーキタイプの `notes` がその能力を約束しますが何も与えません。
それらは残し、代わりに `ArmyConfig.tsx` が同盟デタッチメント向けの注意書きをその下に加えます。

```
npx tsx scripts/check_objective_secured_allies.ts
```

**条件は `factionSource` を有効な同盟勢力に対してテストしなければならず、`factionSource` 単独ではいけません：**
注入された補足のユニット（Assassins、Horus Heresy）は、ルール上の同盟デタッチメントでないまま自分の `factionSource` を持ち、能力を保ちます。ガードはそのケースを検証しており、
不注意な修正が壊すのは、他のすべての検証が通ったままのまさにそれです。

**ここにプローブを追加するときは、ロスターのエントリに `slot` を設定してください。** `RosterEntry` は自分のスロットを持ち、`effectiveSlot` は `unit.slot` ではなくそれを読みます —
このガードの最初の実行では、そのせいで自分のTroopsの対照が失敗しました。まさにそのための対照です。

### 同盟：マトリクスと同盟デタッチメント（`check_ally_matrix_vs_core.cjs`、`check_allied_rules.ts`）

Core Bookの「Allies」セクションがリストビルダーに渡すものは4つあります；残り（オーラ、どの輸送が誰を運べるか、Desperate AlliesのLeadership判定）は卓上で起こります。

```
node scripts/check_ally_matrix_vs_core.cjs "<core rules text dump>"
npx tsx scripts/check_allied_rules.ts
```

1つ目は `src/data/alliedMatrix.ts` の全289セルを、ルールブックの17×17の表と比較します。
**編集時は列のパターンに注意してください：** 左の境界がない `SM` は `CSM:'R'` の中にも一致し、そのせいで最初の実行は、正しいデータなのにSMの列で13個の誤ったセルを報告しました。
7つのアーキタイプはマトリクスの行を書き換えます；それらには専用のガード `check_ally_matrix_overrides.ts` があります。

2つ目は、同盟のミニAOPをCore Bookのリストと照らし、唯一／軍に1つの選択が、自分の勢力と同盟してもなお1回と数えられることを検証します。**同盟のエントリを使うプローブを書くときは、FactionDataに `allied` マップを与えてください** —
`resolveUnit` は同盟のアイテムを `data.allied[factionSource]` に送り、それがないとすべての同盟ユニットが `undefined` に解決され、チェックはそれらを飛ばして、黙った「エラーなし」がエンジンのバグに見えます。
そのガードの2つの対照はまさにこの理由で存在します：1つのコピーは合法でなければならず、本体の2つはフラグされなければなりません。

### サイキックパワーの表示（`scripts/check_psychic_display.ts`）

ロスターのエントリはパワー、祈り、パクトを**素の名前の文字列**として保存します；ルールの詳細（射程、ターゲット、キャスト値、持続、効果）はすべてサイキックのデータにあり、描画時に
`src/utils/psychicFormat.ts` が解決します。これを壊すものは2つあり、それぞれが他方だけをテストするチェックには見えません：

- **検索が見に行かないプール。** `GENERAL_DISCIPLINES`（`src/data/generalDisciplines.ts`）は**`FactionData` の一部ではありません** — ゲーム内のどのサイカーも選べる6つのディシプリンです。
  `findPowerByName` のプールに明示的に加える必要があります。以前は加えていなかったため、31のパワーすべてが19勢力すべてで何にも解決されませんでした。
- **フォーマッターを呼ばない描画箇所。** 4つあります：`PsychicModal`、`UnitCard`、`PrintView`、`PlayView`（バトルビュー）。ユニットカードは、祈りとパクトをフォーマットしながら、パワーを素の名前で印刷していたことがありました。

```
npx tsx scripts/check_psychic_display.ts
```

両方を検証します：選択可能な約808のパワーすべてが空でないメタ行に解決され、**かつ**各描画箇所が実際にフォーマッターを呼んでいること — 先にコメントを取り除いてから。コンポーネントのコメントが、チェックが探す関数そのものを名指ししているためです。
**ディシプリン、サイキックのデータファイル、パワーを表示する新しい場所を追加した後に実行してください。**

### Core Bookのユニットタイプ（`scripts/check_unit_types.ts`）

Core Rulesの「Unit Types」セクションは、ほとんどが**ゲーム中の処理**です — Tank Shock、射界、Vehicle Damage Chart、Hover Mode — そしてその部分は正しくwikiに散文として置かれています。
その記述のうち4つは**ロスタービルダーが担う**ものを変え、このガードは全670のデータシートでその4つを検証します：

- **Monstrous CreatureとMonstrous Infantryは輸送車両に入れない。** どちらもMovementの項でそう言っています。注意：`"Monstrous Infantry"` は**「Infantry」という語を含む**ので、
  `unit_type.includes('infantry')` のテストはそれを許可と読んでしまいます。これは33ユニットで起きた本物のバグでした。
- **`is_monster` はMonstrous *Creature*（またはGargantuan）を意味し**、Monstrous Infantryでは決してありません。正典は、各Army Customisationシートの価格の見出し
  `NORMAL | CHARACTER MODELS | MONSTROUS CREATURES & VEHICLES` です。このフラグはその3番目の列を選ぶので、Monstrous Infantryに付けると、そのユニットはクリーチャーとして価格付けとフィルターがされます。
- **どの車両もLeadershipの値を印刷しない** — 「Vehicles automatically pass Leadership tests as they do not have a Leadership value.」
- **すべてのWalkerは `is_vehicle` を持つ** — 「Walker: Acts like Vehicles.」これが重要なのは、エンジンのすべての車両の条件（アーモリーのアクセス、特性の範囲、HP対W、ポイント）が
  `unit_type` の文字列ではなく**フラグ**を読むからです。`unit_type` に「Vehicle」がなく `is_vehicle` が真のFlyerは、したがって**正しく**、欠陥ではありません。

```
npx tsx scripts/check_unit_types.ts
```

**データシートの `unit_type` や `is_vehicle`/`is_monster`/`is_character` のフラグを編集した後、または `transportGate.ts` を触った後に実行してください。**
ゼロ以外で終了し、違反したものすべてを名指しします。Jump Pack Infantryの「gains Deep Strike」はビルダーが担う5つ目の記述で、専用のガード `scripts/check_jump_pack_deep_strike.ts` があります。

### Tabletop Simulatorへのエクスポート

ここで作った軍勢はTabletop Simulatorのテーブルにエクスポートできます。2つの半分で、一緒に変更しなければなりません：

| ファイル | 役割 |
|---|---|
| `src/utils/ttsExport.ts` | ペイロードを作ってダウンロードする（印刷ビューの**TTS**ボタン） |
| `tts/Custom40k.lua` | mod：そのペイロードを読んでカードを生成する |

**modは意図的にコーデックスを持ちません。** アプリが先に軍勢を解決します — ユニットカードと印刷ビューが使うのと同じ `resolveUnitProfile` で — なので、出荷されるのは最終的な能力値、最終的な武器プロフィール、実際のルールテキストです。
LuaがCustom40kのルールを知る必要は決してなく、コーデックスの更新でWorkshopのアイテムを再アップロードする必要もありません。そのままにしてください：Luaにルールのロジックを足したくなったら、直すべきはエクスポート側です。

`TTS_SCHEMA`（TypeScript）と `SCHEMA`（Lua）は一致しなければなりません；ペイロードの形が変わるときは両方を一緒に上げてください。

**スキーマ2（ロードアウト）。** モデルが異なる装備を持つユニットは、ロードアウトごとに1つの `models[]` エントリとしてエクスポートされ、それぞれ整数の `count` と、`weapons[].id` を指す `modelWeapons` のリストを持ちます。分割は `ttsExport.ts` の `splitGroup()` が行います；リゾルバーの武器グループを読むので、そこでの数の誤りはリゾルバーかシートの問題であり、エクスポートの問題ではありません。触った後は `npx tsx scripts/_tts_sweep.ts`（全ユニット×単独のオプションすべて×2つのサイズ；どのユニットが `loadoutsExact: false` になるかと理由を出力します）と、1つを見るための `npx tsx scripts/_tts_one.ts <勢力> "<ユニット>" '<optionQty json>'` を実行してください。

**Luaはテストされています — 触る前にテストを実行してください。** TTSにはヘッドレスモードがないので、スクリプトは `fengari` のLua VMの下でTTSのグローバルをスタブにして、実際のエクスポートを与えて実行されます：

```
npx jiti tts/test/makeExport.ts "Codex/<保存した軍勢>.json" army.json
node tts/test/run.cjs army.json          # --dump を付けると描画されたカードを読めます
```

最初の実行で、ファイルがゲームに届く前に4つのバグが見つかりました。最悪だったのは、Luaの `ipairs` がテーブルリテラルの最初の `nil` の穴で止まることで — これが各祈りの射程／ターゲット／持続の行を黙って消し、v1.70が直したばかりのものをちょうど再び壊しました。`tts/README.md` を参照してください。

### ガード — どれを実行するか

| 触った後… | 実行 |
|---|---|
| モデル／武器の数、`computeWeaponGroups`、部隊サイズ | `check_row_counts.ts`、`check_sole_row_counts.ts` |
| 選択肢の名前または `replaces` | `check_choice_weapons_match.ts`、`check_weapon_swaps.ts`* |
| アーモリーのアクセス、付き添い、チャンピオンのアーモリー | `check_attendants_skip_armory.ts`、`check_equip_scoped_to_champion.ts` |
| Ascended Daemon Prince／全マークのバリアント | `check_ascended_dp.ts` |
| 管理者のオーバーライドとシートのデータ | `check_overrides_do_not_hide_sheet.ts` |
| スロット、2つ目のAOP、バリアントのHQ | `check_second_aop_needs_full_first.ts`、`check_unit_slot_moves.ts`、`check_variant_hq_slot.ts` |
| シートからのユニット更新 | `check_unit_update.cjs` |
| Gitfinda | `_gitfinda_test.mjs`、`_gitfinda_time_test.ts` |
| カタカナの名前、オプションの見出し、変更履歴の翻訳 | `_ja_names_test.ts`、`_headers_test.ts`、`_changelog_align_test.ts` |
| TTSエクスポート | `_tts_sweep.ts`、`_tts_one.ts`、`tts/test/run.cjs` |

\* 上のセクションにあるガードのうち、この表にないものはメンテナーのローカルにあります；それらが固定するルールはそのセクションに書かれています。

### カタカナの名前（`src/utils/localName.ts`、`src/data/names.ja.json`）

日本のプレイヤーから、名前をカタカナにしてほしいという要望がありました。**データは決して翻訳されません**：ユニット、武器、オプションの名前はエンジンが照合するキーなので、変えるとルールと保存リストが黙って壊れます。名前がカタカナになるのは、**描画する瞬間**だけで、言語が日本語のときだけです：名前には `nm(w.name)`、武器の種類と能力には `rl(w.type)` / `rl(w.abilities)`、装備の行には `eqText(equipped_with)` を使います。

- `names.ja.json` は `{ "小文字の英語": "カタカナ" }`（約4,500件）で、**独立した遅延読み込みのチャンク**です — 他の4言語は決してダウンロードしません。知らない名前は空欄でなく英語で表示されます。
- `jaName()` は `Plasma gun - Standard`、`Plasma gun (Standard)`、`A and B`、`Two lascannons`、`The X`、末尾のマーカーグリフ（`ᴹ`）も理解します。
- 装備の行は、文ごとではなく**テンプレート**で翻訳されます（98%が `Every X is equipped with: A; B.` という枠を持つ）。5言語すべてで；名前まで変えるのは日本語だけです。枠に合わない文は書かれたまま表示されます。
- 名前を追加するには、表に1行を足して `npx tsx scripts/_ja_names_test.ts` を実行します：ゲーム内のすべてのユニット、モデル、武器、オプションについて、まだ英語のままのものを報告します。
- 名前を描画する新しい場所には `nm()` を回す必要があります；それ以外は不要です。
- **Wiki**はビルド時に `wiki/src/lib/loc.ts`（`wn` 名前、`wr` 武器の種類と能力、`wp` ページに入力されたラベルと文、`wPhrase`、`wRange`、`wEquipped`、`wUnitType`、`wSlot`）とラベルの表 `wiki/src/lib/phrases.ts` を通して翻訳します。アプリの純粋なヘルパー（`src/utils/localName.ts`、`jaProse.ts`、`unitTypeLabel.ts`）と `src/data/names.ja.json` を再利用し、`wiki/scripts/vendor.mjs` がコピーします；サイキックの汎用ディシプリンもアプリからvendorされます（以前はwikiがコピーを持っていて、ずれていました）。`node wiki/scripts/build-all.mjs` の前に `node wiki/scripts/vendor.mjs` を実行しないと、wikiは前回のビルドのコピーでビルドされます。wikiのページに英語のテキストを直接入力しないでください：`phrases.ts` に行を追加してください。
- その他の英語のエンジンデータには専用の描画ヘルパーがあり、素の `{x.name}` は決して使いません：スロットは `slotLabel(lang, slot)`（`src/utils/slotLabel.ts`）、ユニットタイプは `unitTypeLabel(lang, type)`（`src/utils/unitTypeLabel.ts`）、形式の名前とルールの行は `engName`/`engNotes`（`src/utils/engagementText.ts`）、サイキックパワーの種類／ターゲット／持続は `powerMetaLine`（テキストの表を使う）、バリデーターのメッセージは `src/engine/validators.ts` の `T()` の中で `{slot}`/`{unit}` の値がローカライズされます。コンポーネントに直書きした英語のラベルはバグです：代わりに `src/i18n`（5言語すべて）にキーを追加してください。
- **オプショングループの見出し**（`g.header`、各オプションブロックの上の文）は、`localiseAbility()` と `src/data/abilityTexts.<言語>.json` を通して、英語テキストのハッシュをキーにして文ごとに翻訳されます — ルールのテキストとまったく同じです。シートが言い換えた見出しは、追加されるまで翻訳がありません；`npx tsx scripts/_headers_test.ts` は、ゲーム内で翻訳のない見出しを、4つの言語それぞれについて一覧にします。

### Gitfinda — 対戦相手探し（`api/_lib/gitfinda.js`、`src/components/GitfindaModal.tsx`）

プレイヤーが「対戦したい」（軍勢、Skirmish / Pitched / Epic、ポイント、IANAタイムゾーン、空いている時間）を投稿し、他の人が閲覧して**Match**を押すと、各マッチに非公開のチャットができる掲示板です。Dominicの要件ドキュメントに沿って作られました；**ベータ版** — 意図的にまだ行っていないこと（メールなし、ブロックなし）は `ki-gitfinda-beta-scope-01` を参照してください。

| ファイル | 役割 |
|---|---|
| `api/_lib/gitfinda.js` | **すべてのルールとすべてのSQL。** `sql` をimportせず引数で受け取るので、実際のPostgresに対してテストできる |
| `api/gitfinda/[action].js` | 薄いルート：呼び出し元をログインさせ、アクションを選び、`Refusal` をJSONに変える。Hobbyプランが許す**12番目で最後の**Vercel関数 — これ以上増やす前に、ほかのルートに統合すること |
| `src/components/GitfindaModal.tsx` | 閲覧、作成、自分の投稿、自分のマッチ＋チャット |
| `src/lib/gitfindaTime.ts` | タイムゾーン：枠は投稿者のゾーンの壁時計の時刻として入力され、時点として保存され、変換して表示される |
| `public/gitfinda/*.png` | モックアップパックの9つのクリーンなアイコン。パックの勢力エンブレムは使っていません（READMEが既存の図像に似る可能性を警告している）— 軍勢には `public/faction-symbols/` を使います |

間違えやすいこと：

- **保存されるのは `active` と `cancelled` だけ。** *Expired*（すべての枠が過ぎた）と*Matched*（誰かがマッチした）は読み取り時に導出されます — 実行するジョブも、同期を保つものもありません。
- **拒否には翻訳キーが付く**（`gfErrArmy`、…）ので、ブラウザがそれを引き、プレイヤーは自分の言語で読めます。新しい拒否には `src/i18n/index.ts`（en、de、es）と `ru.json` / `ja.json` にキーが必要です。
- **フックの依存配列に `t` やインラインのコールバックを決して入れないこと。** `useT()` は描画のたびに新しい関数を返します；入れるとエフェクトが永遠に再起動しました（終わりのないリクエストのループと、自分で空になるチャット）。コンポーネントは最新の値をrefに保持します（`useLatest`）。
- **ブラウザの軍勢リストはサーバーのコピーです**（`GITFINDA_ARMIES` / `ARMIES`）；ずれるとテストが失敗します。

**Discordのお知らせ。** 誰かが対戦を投稿すると、`discordNotifier` がWebhookを通してコミュニティのDiscordに短いメッセージを送れます（Vercelの `GITFINDA_DISCORD_WEBHOOK`；**未設定＝オフ**で、URLは秘密です：issueやチャットに貼り付けないこと）。メッセージのIDは `gitfinda_posts.discord_message_id` に保存されます；`discordRemover` は、対戦がキャンセル、マッチ、期限切れになったときにWebhook自身のメッセージを削除します（404は削除済みと見なす）。cronの枠はもう残っていないので、**スイープ**が、誰かが掲示板を使うたびに終わった対戦のメッセージを数件ずつ削除し（サーバーインスタンスごとに30秒に1回まで）、`dropUserAnnouncements` は管理者がアカウントを削除する前に実行されます（投稿はカスケードで消え、IDが失われるため）。メッセージ内のリンクは `/?gitfinda=<id>` です：`App.tsx` がログイン後にその対戦を開きます。

テスト — 何かを触った後は両方を実行してください：

```
npm i --no-save @electric-sql/pglite      # 一度だけ；メモリ上で動く開発専用のPostgres
node scripts/_gitfinda_test.mjs           # すべてのルールを実際のSQLで（Discordの通知、削除、スイープ、アカウント削除を含む118のチェック）
npx tsx scripts/_gitfinda_time_test.ts    # 夏時間の境目を含むタイムゾーンの計算
```

`_gitfinda_test.mjs` は、わざとコードを壊して（所有者チェックやユニークインデックスを外して…）確認され、あるべき場所で失敗しました；ルールを追加するときも同じようにしてください。

### レガシーのファイルを編集するとき

最上位の `legacies.ts` は薄い勢力横断のディスパッチャーです — 有効なレガシーに応じて**サイキックのモーダルが表示するディシプリンと祈り**、およびレガシーが常に与える追加のパワーを制御します。各勢力自身のレガシーデータ（アーモリーのアクセスルール、マークの制限、ディシプリン／祈りのマップ）は、その勢力の `codex_<faction>/legacies.ts` にあり、ディスパッチャー経由で読まれます。

- **`codex_space_marines/legacies.ts`** — 次の場合に編集します：
  - 制限をかけるべき新しいSMのレガシーのディシプリンを追加する（ディシプリン名→必要なレガシー名を対応づける `SM_LEGACY_DISC_MAP` に追加）。
  - Legacy of the Crusaderでのみ現れる新しい祈りを追加する（`SM_CRUSADER_PRAYERS` に追加）。
  - 既存のSMのレガシーやディシプリンの名前を変える。
- **`codex_grey_knights/legacies.ts`** — レガシーがGKのサイカーに常に与えるパワーを変えるときに編集します（`getGKLegacyPower`）。
- **`codex_genestealer_cults/legacies.ts`** — GSCの同じ仕組み：各レガシーは全サイカーに追加のパワーを1つ教えます（`getGSCLegacyPowerName`）。保存するのはレガシー→パワーの名前だけです；パワーのテキストはコーデックス自身の「Legacy Psychic Powers」ディシプリンから解決されるので、ここにテキストをコピーしないでください。
- **`codex_<faction>/legacies.ts`** — 勢力のレガシーのアーモリーのアクセスルールやマークの制限のために編集します（例：`codex_csm/legacies.ts` の `CSM_LEGACY_NOTES`）。

レガシーで制限されたディシプリンを持つ新しい勢力を追加するなら、同じパターンで `codex_<faction>/legacies.ts` ファイルを作り、`PsychicModal.tsx` に配線し、構造化されたメモの表示も必要なら最上位の `legacies.ts` の `FACTION_LEGACY_NOTES` マップに登録してください。

### データ構造（勢力ごとのフォルダ）

勢力のデータは `data/parsed/<faction>/` にあります — 勢力ごとに1フォルダで、巨大なファイルを平らに並べたディレクトリではありません。

```
data/parsed/
  chaos_space_marines/
    units/<スロット>/<ユニット>.json   ユニットごとに純粋なJSON1つ＋units/index.ts（唯一の.ts）
    armory/
      general.json       アーモリー（汎用 — 全モデルがアクセス可）
      mark_khorne.json   マーク別アーモリー（ケイオス勢力のみ）
      legion_*.json      レガシー／チャプターのアーモリー（レガシーごとに1ファイル）
    psychic/
      disciplines.json   サイキックのディシプリンの配列
      prayers.json       祈り／詠唱
      pacts.json         ゲーム内の仕組み（例：Blood Tithe、Daemonkinの表）
      daemonkin.json     Daemonkinの召喚の表
    archetypes.json      { archetypes[], legacies[], traits[] }
    animosity.json       { animosity, allied }   <- CSM/CDのみ（マークの敵対の表）
    unit-notes.md        昔の.tsファイルが持っていたヘッダーのコメント
  space_marines/         （同じ構造、marks/animosity.jsonなし）
  horus_heresy_legiones_astartes/, horus_heresy_forces_of_the_machine_god/   2つの補足（units/＋supplement.json）
  ...                    合計21フォルダ
```

各勢力の `FactionData` を組み立てるローダーは **`src/data/loaders.ts`** です — 個々のファイルを静的な文字列リテラルでimportし（Viteの要件）、統合します。エンジンは以前とまったく同じ `FactionData` の形を受け取ります；変わったのはファイルの配置だけです。

**新しい勢力を追加する：**
1. `data/parsed/<faction>/` を作り、`units/` フォルダ（上の構造を参照）と、最低限 `armory/general.json` を置きます。
2. 必要に応じて任意のファイル（`archetypes.json`、勢力にマークがあれば `animosity.json`、`psychic/`、追加のアーモリーのファイル）を追加します。
3. `src/data/loaders.ts` にファイルを読み込んで `asm(...)` を呼ぶ `case '<faction>'` を追加します。
4. `loaders.ts` の末尾の `FACTION_LOADERS` にキーを追加します。
5. `src/data/factionCatalog.ts`（カードのグリッド、管理者の利用可否の切り替え、コーデックスのバージョンバッジに使われる `CATEGORIES` リスト）に勢力を登録し、`src/components/FactionSymbol.tsx` に略称／カテゴリを追加します。
6. 必要ならエンジンのルールを追加します：`src/engine/codex_<faction>/`（resolver、archetypes、traits、legacies、validator）。さらに、勢力を `src/data/alliedMatrix.ts` に、シート更新のために `UnwiseGetData/factions.csv` にも追加してください。

### どこから始めるか／どう手伝うか

- **`OPEN_QUESTIONS.md`**（リポジトリのルート）は、プロジェクトが助けを必要としていることを一覧にしています：**ルールに関する質問**
  （コード化する前に正式な答えが必要な曖昧なルール — 手伝うのにコードは不要です）と、**コードの問題**（開発者が直せるエンジン／UIのバグ）。
- 該当するテンプレートでGitHubのissueを開いてください — **Rules question**、**Code issue**、**Data correction**、**Bug report**（`.github/ISSUE_TEMPLATE/`）。ルールの質問に答えると実装が進みます；メンテナーが組み込みます。
- アプリ内の**Known Issues**パネル（`src/data/known-issues.ts`）はユーザー向けのトラッカーです；それと `OPEN_QUESTIONS.md` はコードの問題で重なりますが、後者には未回答のルールの質問も含まれます。

### 構造化されたルール効果とコストのプリミティブ（v0.51〜v0.52で追加）

ルールの中には説明テキストだけでは表現できず、エンジンが読む構造化されたフィールドを必要とするものがあります。**フィールドを選ぶときは、データシートの動詞に注意してください。**

- **`OptionEffect`**（`types/data.ts`）— `Choice`、`OptionGroup`、**または `ArmoryItem`**（`item.effect`）に付きます。フィールド：
  - `stat_mod: [{ stat, delta }]` — 例：ジャンプパックの `+6" M`。
  - `adds_unit_types: string[]` — **追加の**タイプ獲得。動詞「**gains** the unit type X」。モデルは既存のタイプを保ちます。
  - `set_unit_type: string` — タイプの行全体の**置き換え**。動詞「**change** unit type **to** X」。
  - `grants_abilities: string[]` — 付与される特殊ルール（データシートが述べていることだけ）。
  - 効果は `resolver.ts`（`applyEffect`）で適用され、**モデルの基本プロフィールに対して重複排除されます** — モデルがすでに持つタイプや能力は再追加されません。アーモリーのアイテムの能力値と引用された能力は引き続き `equipMods`（説明の解析）から来ます；`item.effect` はタイプの変更だけを運びます。
  - **タイプと能力は同じものではありません。** `"Jump Pack Infantry"` はユニットの**タイプ**（Deep Strikeを与える）；`"Jump pack"` は**能力**（与えない）。データシートが文字どおり言っていることをモデル化してください。
- **`OptionGroup.per_model`** — データシートが「for +X points **per model**」（または「...receive one of the following upgrades **per model**」）と言うインラインオプション、または通常の `choices[]` グループで `true` にします。ポイントエンジンは、ユニット全体で1回ではなく、`inline_pts × ユニットのサイズ`（インライン）または `choice.points × qty × ユニットのサイズ`（選択肢）を課金します。1回限りのインラインオプション（サージェント1人の昇格）と、「every model may swap X」のグループ（`qty` がすでに選んだ数と等しい）は設定しないままにします。
- **`equipMods.ts`** — アーモリーのアイテムの `desc` から `+stat`、セーブ、引用された能力を解析します。引用されたユニットタイプの語はスキップし（タイプのシステムが扱う）、付与される能力をユニットの基本の能力に対して重複排除します。
- **Skirmishの装備の上限**は `validators.ts`（`eng.statCaps` ブロックの中）にあります。Missions補足の制限を強制します：2+のアーマーセーブ、4+以上のインヴァルン、T8+、Damage 3の武器、Uniqueのアーモリーアイテム2つ以上を得られない — すべてMissionsとCore Rulesのドキュメント（`Codex/*.docx`）に基づきます。新しい上限はUIではなくここに追加してください。

> **文字コード（文字化け）：** JSONやTSのデータを手で編集するときは、ファイルをUTF-8に保ってください。`â€"`（本来は `—`）のような文字化けはコピー＆ペーストで紛れ込みます；`scripts/_scan_mojibake.cjs` が検出します。リッチテキストのエディタから貼り付けないでください。

> **先回りのバグ調査：** `scripts/sanity_sweep.ts` は実際の本番のデータ／エンジンのモジュールを直接importし（`npx tsx scripts/sanity_sweep.ts` で実行、インストール不要）、プレイヤーのバグ報告を待たずに構造上の危険信号をフラグします：死んだオプショングループ（実際の選択肢を期待する制約で `choices: []`）、`is_character`/`unit_type` の矛盾、`engine/archetypes` 内の宙に浮いたユニット名の参照、宙に浮いた `slot_to_units` のエントリ、ユニットにない武器を指す `replaces`、宙に浮いた `variant_link` の参照、1つのユニット内の武器名の重複。これは構造のチェッカーであり、ルールのチェッカーではありません — ヒットは、確認済みのバグと見なす前に、必ず人が読む必要があります（既知の誤検出の形はスクリプト自身のヘッダーコメントを参照）。これらのフィールドに触れるデータ編集の後、特にリリースのpushの前に再実行してください。

> **正典を同期させる：** `scripts/fetch_codex.cjs` は、作者のGoogleスプレッドシートから直接、各勢力のスプレッドシートをダウンロードし（リンクは `Codex/Custom40k Core Rules.docx` 内のハイパーリンクの表にあります）、私たちの `Codex/*.ods` のコピーのうちどれが古いかを、タブごとに報告します。引数なしで全体を調べるか、勢力名を指定してそれだけを調べます。`--apply` を付けると私たちのコピーを上書きします — 意図的に任意で、勢力ごとです。**.odsを置き換えることは、その勢力が再び未監査になり、全面的な見直しが必要になることを意味する**からです（下のルールを参照）。一括適用は決してしないでください。

> **ルールのドキュメントを同期させる：** `fetch_codex.cjs` は勢力のシートだけを扱い、他は扱わないので、長い間、3冊のルールブックは何の知らせもなく古くなり得ました — 実際に古くなりました：私たちのCore Rulesのコピーは1.262のままで、ライブのドキュメントは1.264に進んでいました。`scripts/fetch_docs.cjs` がそれを塞ぎます。Core Rules、Missions、Planetary AssaultのドキュメントをそれぞれのライブのGoogle Docsから取得し、ファイルのバイトではなく**抽出したテキスト**を比較し（Googleは毎回異なるzipを書き出すので、バイトの一致では実行のたびに変更が報告される）、各ドキュメントの `Rules version` を表示し、どれかが違えばゼロ以外で終了します。`--write` は古いコピーを置き換えます。ルールのテキストに触れる作業の前には、`fetch_codex.cjs` と並べて実行してください — 古いドキュメントから引用したルールは、正しそうに見える分、答えがないより悪いのです。

> **勢力をそのシートと照らして監査する：** `scripts/ods_audit.cjs "Codex/<faction>.ods" <勢力のフォルダ>` は、スプレッドシートを本番データとユニットごとに比較し — モデル行（名前／min／max／能力値／ポイント）、武器プロフィール、`equipped_with` の文、オプショングループの選択肢名と価格 — 何も書き込まずに違いを表示します。3番目の引数にユニット名を足すと、その1つだけを確認します。すべての行を読み、1つずつ判断してください：**事実**ではシートが勝ち、**意味づけ**では本番が勝ち、作者自身のタイプミス（末尾の余計なピリオド、コピーされたユニット名）もここに現れます。すでに処理しているスプレッドシートの癖が1つあります：`4-19` という `No.` のセルは**日付**として保存されるので、ツールは生のシリアル値ではなく書式付きのテキストを読みます — シートでそれを「直さない」でください。


### 変更履歴と既知の問題（重要 — v0.47から分離）

この2つのファイルは目的が異なり、混同してはなりません：

| ファイル | ここに入れるもの |
|---|---|
| `src/data/changelog.ts` | バージョン履歴 — リリースごとに1項目；英語は `changelog.ts`、他の4言語は `changelog.i18n.json` |
| `src/data/known-issues.ts` | バグと制限の追跡 — ステータスは `known`、`investigating`、`fixed`、`by_design`、`planned` のいずれか |

**v0.47より前**は両方が `changelog.ts` にありました。今は別々です。既知のバグを直したら：
1. `src/data/known-issues.ts` を開き、`id` で問題を探して `status: 'fixed'` にします。
2. `src/data/changelog.ts` の現在のバージョンの項目に、その修正を説明する1行を追加します。

問題のステータスを更新するために `changelog.ts` を編集**しないで**ください — もう `KNOWN_ISSUES` は含まれていません。

PRがつまずかないように、メンテナーが従っているハウスルール：

- **新しいバージョンは、メンテナーがそう言ったときだけ切られます**；`CHANGELOG[0].version` がバージョン番号です。
  追加の修正は現在の項目に入ります（1日に最大2項目、テーマごとにまとめる）。
- **トップページのお知らせには、現在のバージョン自身の修正だけを載せます**。1行に1つの節で、5言語すべてで。`ANNOUNCEMENT_KEY` を上げると、閉じたすべての人に再表示されるので、スタイルの変更では上げません。
- **30日より古い変更履歴の項目は、ときどき整理されます**（gitが履歴を保持）；その古さの修正済みKnown Issuesは非表示になります。
- **変更履歴のテキストは常にまず英語**；プレイヤーが転送するもの（作者への質問）は、平易な英語で書きます。

### TypeScriptの規約

- `any` を使わない — `src/types/` の型を使う
- TypeScriptのエラーはゼロ — `npm run build` が通ること
- 広い型より狭い型を優先する；形が繰り返し現れるなら `src/types/` に追加する
- issueでの事前の議論なしに新しい依存関係を追加しない

### 既存の勢力に不足しているデータファイルを追加する

多くの勢力には、まだ空か欠けているファイルがあります。勢力のデータを埋めたい場合 — 例えばサイキックのディシプリン、レガシーのアーモリー、アーキタイプを追加するなど — 以下のテンプレートを使ってください。ファイルを作成・編集したら、`npm run build` を実行してJSONが正しいことを確認します。

**`archetypes.json`** — この勢力のアーキタイプ、レガシー、特性：
```json
{
  "archetypes": [
    {
      "name": "Archetype Name",
      "desc": "Full rule text from the Army Customisation sheet, exactly as written."
    }
  ],
  "legacies": [
    {
      "name": "Legacy Name",
      "desc": "Full rule text."
    }
  ],
  "traits": [
    {
      "name": "Trait Name",
      "desc": "Full rule text.",
      "pts_unit": "5",
      "pts_char": "0",
      "pts_monster": "5",
      "pts_veh": "5"
    }
  ]
}
```
> 特性のコスト列：`pts_unit` = 通常のモデル、`pts_char` = キャラクターモデル、`pts_monster` / `pts_veh` = モンストラス・クリーチャーと車両（共有の列）。利用不可には `"-"`、Wound/HPごとのコストには `"5*"` を使います。

**`animosity.json`** — マークの敵対／同盟の互換性の表（マークのある勢力のみ：CSM、CD）：
```json
{
  "animosity": {},
  "allied": {}
}
```

**`armory/legion_<name>.json`** — チャプター、レガシー、セプトのアーモリー：
```json
{
  "name": "Legacy of the Example",
  "weapons": [],
  "equipment": [],
  "daemon_weapons": []
}
```
このファイルを作った後、`src/data/loaders.ts` に登録します — 勢力の `case` を見つけ、`asm()` に渡す `legions` オブジェクトに新しいimportとキーを追加します。

**`armory/mark_<god>.json`** — ケイオスのマーク別アーモリー（ケイオス勢力のみ）：
```json
{
  "name": "Mark of Khorne Armory",
  "weapons": [],
  "equipment": [],
  "daemon_weapons": []
}
```
`loaders.ts` で勢力の `marks` オブジェクトに登録します。

**`psychic/disciplines.json`** — サイキックのディシプリンの定義：
```json
[]
```

**`psychic/prayers.json`** — 祈り／詠唱：
```json
[]
```

**`psychic/daemonkin.json`** — ゲーム内のdaemonkinの表（ケイオス勢力が使用）：
```json
{}
```

> **ファイルを追加した後：** `src/data/loaders.ts` を開き、勢力の `case` を見つけて、新しいファイルがimportされ `asm()` に渡されていることを確認してください。ローダーがimportしないファイルは、アプリが決して読み込みません — ファイルを置くだけでは足りません。
3. `npm run build` が通り、アプリで勢力が読み込まれることを確認します

### イベントとリーグ（`api/events/[action].js`、`src/components/EventsModal.tsx`）

主催者が運営するイベントとリーグで、作者の要件ドキュメントに沿って作られました。3つのテーブル：`events`、`event_players`、`event_games`。

設計が最初に決めている3つのこと（レビューで蒸し返さないように）：

- **イベントとリーグは同じ行です。** 順位表以外はすべて同じなので、`is_league` は順位表を生成するかどうかだけを決めます。別のテーブルにすると、登録、承認、リストの割り当てが重複していたでしょう。
- **報告された対戦は、対戦相手が確認するまで数えられません**。そして確認できるのは対戦相手だけです — 主催者ではありません。そうでないと確認が意味を持ちません。却下された報告は `disputed` になり、消えずに主催者に見え続けます。
- **順位表は導出され、保存されません。** 保存した表は、対戦が異議を唱えられたり訂正されたりした瞬間にずれますし、ここにキャッシュするほど高価なものはありません。

`is_test` と `reset-test` アクションがあるのは、この機能がまず非公開で、架空のプレイヤーとリストで運用され、公開前に消去されることを想定しているからです。その消去は、手作業のデータベースのクリーンアップではなく、初日から本物の操作です。

**このモジュールはアルファ版として制限されています**：トップページのボタンは管理者以外のすべてに対して無効で、Campaignと同じパターンです。

**⚠ `api/` の下にエンドポイントを追加する前に、下のVercel関数の上限についての注意を読んでください。**

### 12関数の上限（`api/`）

VercelのHobbyプランはデプロイを**12個のサーバーレス関数**に制限しており、`api/` はちょうど12個です。`api/_lib/` のファイルはルーティングされずimportされるだけなので、数えません。いくつかのルーターが、エンドポイントごとに1ファイルではなく、`switch` を持つ `[action].js` ファイルなのはこのためです。

新しいエンドポイントを追加するには、**まず枠を空ける**必要があります。確認は次のとおり：

```bash
find api -name "*.js" -not -path "api/_lib/*" | wc -l
```

### Rules-modelのダイジェスト（`src/data/rules-model/<faction>.md`）

監査済みの各勢力には、`src/data/rules-model/` にMarkdownのダイジェストがあります（テンプレート：`_TEMPLATE.md`）。
そこには、勢力のキーワードの語彙、装備の使用可否のルール、ポイントのモデル、スロットごとのデータシートのオプションの意味づけ、エンジンのギャップチェックが記録され、すべて正典のソースHTMLと本番のJSONに照らして検証されています。これらは貢献者とエンジンのための参照ドキュメントで、アプリは読み込みません。
勢力のデータを監査または修正するときは、ダイジェストを同期するよう更新してください。勢力横断の補足も同じフォルダと命名を使います（例：Escalation / Lords of War補足の `escalation.md`）。

### 翻訳

UI文字列を追加するなら、5言語すべてに追加してください：EN / DE / ES は `src/i18n/index.ts`（`TranslationKey` ユニオンのキーも）、RU / JA は `src/i18n/ru.json` と `ja.json` です。コンポーネントで、生の英語のエンジンの値（`{x.name}`、スロット、ユニットタイプ、バリデーターのメッセージ）を決して描画しないでください：`nm()`、`slotLabel`、`unitTypeLabel`、`T()`、*カタカナの名前*にあるヘルパーを使います。機械翻訳は許容されます；ネイティブスピーカーのレビューは歓迎です。

> **ドイツ語の翻訳：** 文字どおりの翻訳ではなく、Games Workshopの公式ドイツ語用語を使ってください。スロット名はGWの慣例に従います：`Standard`（Troops）、`Elite`（Elites）、`Sturm`（Fast Attack）、`Unterstützung`（Heavy Support）。能力値の略語：`Reichw.`（Range）、`DS`（AP）、`SW`（Damage）。アーモリーは `Rüstkammer` で、`Waffenkammer` ではありません。

---

## プルリクエストのチェックリスト

PRを開く前に確認してください：

- [ ] `npm run build` がTypeScriptのエラーなしで通る
- [ ] 変更は1つのことに絞られている（1ユニット、1バグ、1機能）
- [ ] 新しいUI文字列に5言語すべて（EN / DE / ES / RU / JA）の翻訳がある
- [ ] シートが書くユニットのフィールドを手で編集していない（*どのフィールドを誰が書くか*を参照）；シートのミスは作者に報告する
- [ ] リゾルバー、ポイント、データの形に触れたなら、対応するガードを実行した（*ガード*の表を参照）。共有の計算なら、`_snap_profiles.ts` を前後で比較した
- [ ] 残したい新しいスクリプトは `git add -f` で追加した（フォルダは `.gitignore` 対象）；コミット前に `git status` を確認し、`git stash` は決して使わない
- [ ] 既知の問題を直したなら、`src/data/known-issues.ts` の `status` を `'fixed'` に更新した
- [ ] PRの説明が、何を、なぜ変えたかを説明している（関連するissueへのリンクで十分）

ビルドチェックを通らないPRは、通るまでレビューされません。

---

## ライセンス

貢献することで、あなたの貢献がプロジェクトの他の部分と同じ [CC BY-NC-SA 4.0](LICENSE) ライセンスで提供されることに同意したものとみなされます。

## ユニット自動更新（Inquisitorのボタン）

`UnwiseGetData/update_units.py` は各勢力のGoogleスプレッドシートをダウンロードし（`factions.csv` がシートのIDを列挙）、`data/parsed/<faction>/units/` の各ユニットファイルの**シートが書く**キー — name、models、variant models、min cost、default size、equipped with、weapons、abilities、unit type、is_monster、keywords — を書き換えます。ユニットを作ることは決してなく、`option_groups`、フラグ（`has_armory_access`、`is_character`、…）、アーモリー、アーキタイプ、サイキックのパワー、祈りには決して触れません。

- **アプリから実行する：** Inquisitorパネル → Factions → *Unit auto-update* → **Run unit update**。これが `.github/workflows/update-units.yml`（GitHub Actions）を起動し、スクリプトを実行し、続いて `scripts/check_unit_update.cjs`（ブロックする問題：不正なJSON、テキストでない能力、失われた `variant_models` キー、空のモデル）と `scripts/sync_codex_versions.cjs`（シートのタイトルが変わったとき `src/data/factionCatalog.ts` のバージョンバッジを動かす）を実行し、アプリをビルドして**プルリクエスト**を開きます。人がマージしない限り、何も `main` には届きません。
- **サーバーの設定（一度だけ）：** Vercelのプロジェクトには `GITHUB_DISPATCH_TOKEN`（このリポジトリ向けで *Actions: read and write* を持つfine-grainedトークン）が必要です；リポジトリには *Settings → Actions → General → Allow GitHub Actions to create and approve pull requests* が必要です。
- **ローカルで実行する：** `cd UnwiseGetData && python update_units.py`（Python 3.12+；`pip install openpyxl pandas requests simplejson`）、続いて `node scripts/check_unit_update.cjs`。
- `data/parsed/.../units/` のファイルは、ユニットの名前（`foetid_virion.json`）を付けなければならず、さもないとスクリプトは見つけられません。
- 19のコーデックス**と**2つのホルス・ヘレシー補足（そのフォルダ；アプリのキーは `horus_heresy` / `legio_titanicus` のまま）を対象にします。各シートには `UnwiseGetData/factions.csv` に1行が必要で、31文字を超えるタブ名はスクリプトの長すぎる名前のリストに入れる必要があります。
- **プルリクエストのチェックは「action required」のまま止まります**。ボットが開いたからです：メンテナーが実行を承認し（または *Settings → Actions → General → Fork pull request workflows* を変更し）、その後マージします。PRの本文には、ユニットごとに何が変わったかが一覧になります。
- **カードを悪くするユニット更新は、シートへの質問です**（スクリプトがセルごとに1つの能力に分割する表、`*` のない武器の見出し、武器に行がない交換オプション）。タブと行を添えて作者に報告してください；ユニットのファイルを手で編集しないでください。次の更新で元に戻ります。オークの能力の表が実例です：今は、行が別々の行に並んだ1つの能力として届き、能力のテキストはカードと印刷ビューで改行を保ちます。
- `node scripts/fetch_codex.cjs --apply <faction>` は私たちのローカルの `Codex/*.ods` のコピーを上書きし、その勢力を未監査としてマークします；見るためだけに実行しないでください。
