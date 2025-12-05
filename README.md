# playtest-ts

TypeScript製のBDDテストフレームワーク。Gaugeと統合し、日本語の自然言語でE2Eテストを記述できます。

## 特徴

- **日本語ステップ**: 自然な日本語でテストシナリオを記述
- **モジュラー設計**: 必要な機能だけをインストール
- **TypeScript**: 型安全なテスト実装
- **Gauge統合**: BDDスタイルのテスト実行
- **高度なJSONPath**: jsonpath-plusによる複雑なクエリ対応
- **テーブル比較**: 構造化データの検証機能
- **Zoomパターン**: オブジェクト/配列への直感的なアクセス
- **Decimal対応**: 高精度な数値アサーション

## パッケージ

| パッケージ | 説明 |
|-----------|------|
| `@playtest-ts/core` | コア機能（設定、アサーション、ストア） |
| `@playtest-ts/http` | HTTPリクエスト/レスポンステスト |
| `@playtest-ts/wiremock` | HTTPモック（nock使用） |
| `@playtest-ts/jdbc` | PostgreSQLデータベーステスト |

## インストール

```bash
# 必須
npm install @playtest-ts/core

# 必要に応じて追加
npm install @playtest-ts/http
npm install @playtest-ts/wiremock
npm install @playtest-ts/jdbc
```

## 使用例

### Gauge仕様ファイル（.spec）

```markdown
# API テスト

## ユーザー情報取得

* パス"/api/users/1"に
* メソッド"GET"で
* メディアタイプ"application/json"で
* リクエストを送る
* レスポンスのステータスコードが"200"である
* レスポンスのJSONパス"name"が
* 文字列の"田中太郎"を含んでいる
```

### ステップ実装（TypeScript）

```typescript
import { BeforeSuite, AfterSuite } from "gauge-ts";
import { initHttpClient } from "@playtest-ts/http";

// playtest-tsのステップを再エクスポート
export * from "@playtest-ts/core";
export * from "@playtest-ts/http";

export class Setup {
  @BeforeSuite()
  public async beforeSuite(): Promise<void> {
    initHttpClient("http://localhost:8080");
  }
}
```

## 利用可能なステップ

### アサーション（@playtest-ts/core）

#### 整数値
- `整数値の<expected>である`
- `整数値の<expected>ではない`
- `整数値の<expected>より大きい`
- `整数値の<expected>より小さい`
- `整数値の<expected>以上である`
- `整数値の<expected>以下である`

#### 文字列
- `文字列の<expected>である`
- `文字列の<expected>ではない`
- `文字列の<expected>を含んでいる`
- `文字列の<expected>で始まる`
- `文字列の<expected>で終わる`
- `正規表現<pattern>にマッチする`

#### 真偽値
- `真である`
- `偽である`

#### Null/Undefined
- `nullである`
- `nullではない`
- `undefinedである`
- `undefinedではない`

#### 小数値（Decimal）
- `小数値の<expected>である`
- `小数値の<expected>に近い`
- `小数点以下<scale>桁である`

#### テーブル
- `テーブル<tableString>である`
- `以下のテーブルである <tableString>`
- `テーブルの行数が<expected>である`
- `テーブルが空である`
- `テーブルが空ではない`

#### 存在確認
- `存在する`
- `存在しない`

#### 正規表現
- `正規表現の<pattern>に完全一致している`

### HTTP（@playtest-ts/http）

#### リクエスト構築
- `パス<path>に`
- `メソッド<method>で`
- `メディアタイプ<mediaType>で`
- `ヘッダー<name>に<value>を設定して`
- `JSONボディ<json>で`
- `ボディ<body>で`
- `リクエストを送る`

#### レスポンス検証
- `レスポンスのステータスコードが`
- `レスポンスのボディが`
- `レスポンスのJSONボディが`
- `レスポンスのJSONパス<path>が`
- `レスポンスのJSONパスAll<path>が` （複数結果を配列で取得）
- `レスポンスのヘッダー<name>が`
- `レスポンスのステータスコードが<expected>である`
- `レスポンスのボディが<expected>を含んでいる`

### データベース（@playtest-ts/jdbc）

- `DB<name>にSQL<sql>を実行した結果が`
- `DB<name>にSQL<sql>を実行する`
- `結果の行数が`
- `結果の<column>列が`
- `結果の<index>行目の<column>列が`
- `結果が空である`
- `結果が空ではない`

### モック（@playtest-ts/wiremock）

- `モック<name>に<method>リクエスト<path>を設定する`
- `モックのレスポンスステータスを<status>にする`
- `モックのレスポンスボディを<body>にする`
- `モックのクエリパラメータ<name>を<value>にする`
- `モックのJSONPathマッチ<path>が<value>を設定する`
- `モックを有効にする`
- `全てのモックが呼ばれた`
- `モックをクリアする`

## プログラム API

### JSONPath（高度なクエリ）

```typescript
import { ResponseProxy } from "@playtest-ts/http";

// 単一値を取得
const name = response.jsonPath<string>("$.users[0].name");

// 複数値を取得（indefinite path）
const allNames = response.jsonPathAll<string>("$.users[*].name");

// フィルタリング
const adults = response.jsonPathAll<User>("$.users[?(@.age >= 18)]");
```

### テーブル比較

```typescript
import { createTable, createTableAssertable } from "@playtest-ts/core";

const table = createTable(
  ["name", "age"],
  [
    { name: "Alice", age: 30 },
    { name: "Bob", age: 25 }
  ]
);

createTableAssertable(table)
  .shouldHaveRowCount(2)
  .shouldHaveHeaders(["name", "age"]);
```

### Zoomパターン

```typescript
import { createJsonZoomable, createArrayZoomable } from "@playtest-ts/core";

// JSONオブジェクトへのズーム
const json = createJsonZoomable({ user: { name: "Alice", items: [1, 2, 3] } });
json.zoom("user.name");        // "Alice"
json.zoom("user.items[0]");    // 1

// 配列へのズーム
const arr = createArrayZoomable(["a", "b", "c"]);
arr.zoom("1");  // "b"
```

### Decimalアサーション

```typescript
import { createDecimalAssertable } from "@playtest-ts/core";

createDecimalAssertable(3.14159)
  .shouldBeCloseTo(3.14, 2)      // 精度2桁で比較
  .shouldHaveScale(5);           // 小数点以下5桁
```

### WireMock（拡張機能）

```typescript
import { createMockBuilder } from "@playtest-ts/wiremock";

createMockBuilder()
  .withMethod("POST")
  .withPath("/api/users")
  .withQueryParam("active", "true")
  .withJsonPathMatch("$.name", "Alice")
  .willReturn(201, { id: 1 });
```

## 開発

```bash
# 依存関係インストール
pnpm install

# ビルド
pnpm build

# テスト
pnpm -r test
```

## 要件

- Node.js 18+
- TypeScript 5.8+
- Gauge CLI（テスト実行時）

## ライセンス

MIT
