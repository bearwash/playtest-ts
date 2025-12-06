# PlayTest-TS

TypeScript製のBDDテストフレームワーク。Gaugeと統合し、日本語の自然言語でE2Eテストを記述できます。

## 目次

- [特徴](#特徴)
- [必要な環境](#必要な環境)
- [環境構築手順](#環境構築手順)
- [パッケージ構成](#パッケージ構成)
- [クイックスタート](#クイックスタート)
- [利用可能な機能一覧](#利用可能な機能一覧)
- [使用例](#使用例)
- [プログラムAPI](#プログラムapi)
- [開発者向け](#開発者向け)
- [トラブルシューティング](#トラブルシューティング)

## 特徴

- **日本語ステップ**: 自然な日本語でテストシナリオを記述
- **モジュラー設計**: 必要な機能だけをインストール可能
- **TypeScript**: 型安全なテスト実装
- **Gauge統合**: BDDスタイルのテスト実行
- **高度なJSONPath**: jsonpath-plusによる複雑なクエリ対応
- **テーブル比較**: 構造化データの検証機能
- **Zoomパターン**: オブジェクト/配列への直感的なアクセス
- **Decimal対応**: 高精度な数値アサーション
- **モック機能**: HTTPリクエストの偽装とテスト

## 必要な環境

- **Node.js**: v18.0.0以上
- **pnpm**: v9.0.0以上（開発時）
- **TypeScript**: v5.8.0以上
- **Gauge**: 最新版（E2Eテスト実行時）

## 環境構築手順

### 1. 前提条件の確認

```bash
# Node.jsのバージョン確認
node --version  # v18.0.0以上であること

# npmのバージョン確認
npm --version
```

### 2. Gaugeのインストール

```bash
# Gauge CLIをグローバルインストール
npm install -g @getgauge/cli

# インストール確認
gauge --version

# TypeScriptプラグインのインストール
gauge install ts
```

### 3. 新規プロジェクトのセットアップ

#### 方法A: PlayTest-TSを独立したパッケージとして使用（npmに公開後）

```bash
# プロジェクトディレクトリ作成
mkdir my-test-project
cd my-test-project

# package.jsonの初期化
npm init -y

# PlayTest-TSパッケージのインストール
npm install @playtest-ts/core gauge-ts
npm install @playtest-ts/http  # HTTPテスト用（オプション）
npm install @playtest-ts/wiremock  # モック用（オプション）
npm install @playtest-ts/jdbc  # DB用（オプション）

# TypeScript設定
npm install --save-dev typescript @types/node
npx tsc --init
```

#### 方法B: PlayTest-TSの開発環境として使用（現在の推奨方法）

```bash
# リポジトリをクローン
git clone https://github.com/your-org/playtest-ts.git
cd playtest-ts

# pnpmのインストール（未インストールの場合）
npm install -g pnpm

# 依存関係のインストール
pnpm install

# プロジェクトのビルド
pnpm build

# テストの実行（動作確認）
pnpm test
```

### 4. Gaugeプロジェクトの初期化

```bash
# 新規Gaugeプロジェクトを作成
gauge init ts

# プロジェクト構造
# ├── specs/           # テスト仕様ファイル（.spec）
# ├── tests/           # ステップ実装（.ts）
# ├── env/             # 環境設定
# └── manifest.json    # Gauge設定
```

### 5. PlayTest-TSの統合

`tests/step_implementation.ts`ファイルを作成：

```typescript
import { BeforeSuite, AfterSuite } from "gauge-ts";
import { initHttpClient, stopAllMockServers } from "@playtest-ts/http";
import { initMockServer } from "@playtest-ts/wiremock";
import { initDatabase, closeAllDatabases } from "@playtest-ts/jdbc";

// PlayTest-TSのステップを再エクスポート
export * from "@playtest-ts/core";
export * from "@playtest-ts/http";
export * from "@playtest-ts/wiremock";
export * from "@playtest-ts/jdbc";

export class Setup {
  @BeforeSuite()
  public async beforeSuite(): Promise<void> {
    // HTTPクライアントの初期化
    initHttpClient("http://localhost:8080");

    // モックサーバーの初期化（必要に応じて）
    initMockServer("ExternalAPI", "http://localhost:3000");

    // データベースの初期化（必要に応じて）
    initDatabase("TestDB", "postgresql://user:pass@localhost/testdb");
  }

  @AfterSuite()
  public async afterSuite(): Promise<void> {
    // クリーンアップ
    stopAllMockServers();
    await closeAllDatabases();
  }
}
```

### 6. TypeScript設定

`tsconfig.json`を編集：

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "outDir": "./dist",
    "rootDir": "./tests"
  },
  "include": ["tests/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## パッケージ構成

| パッケージ | 説明 | 主な機能 |
|-----------|------|---------|
| `@playtest-ts/core` | コア機能 | アサーション、データストア、テーブル処理、Zoom機能 |
| `@playtest-ts/http` | HTTPテスト | リクエスト送信、レスポンス検証、JSONPath |
| `@playtest-ts/wiremock` | HTTPモック | モックサーバー、リクエスト偽装、レスポンス定義 |
| `@playtest-ts/jdbc` | DBテスト | PostgreSQL接続、クエリ実行、結果検証 |

## クイックスタート

### 最初のテストを作成

1. **仕様ファイルを作成** (`specs/first_test.spec`)：

```markdown
# 初めてのAPIテスト

## ヘルスチェック

* パス"/health"に
* メソッド"GET"で
* リクエストを送る
* レスポンスのステータスコードが"200"である

## ユーザー情報の取得

* パス"/api/users/1"に
* メソッド"GET"で
* メディアタイプ"application/json"で
* リクエストを送る
* レスポンスのステータスコードが"200"である
* レスポンスのJSONパス"name"が
* 文字列の"田中太郎"である
```

2. **テストを実行**：

```bash
# 特定のspecファイルを実行
gauge run specs/first_test.spec

# すべてのテストを実行
gauge run specs/

# タグでフィルタリング
gauge run --tags "api,critical" specs/
```

## 利用可能な機能一覧

### 🔍 アサーション機能（@playtest-ts/core）

#### 数値検証
- `整数値の<expected>である` - 完全一致
- `整数値の<expected>ではない` - 不一致
- `整数値の<expected>より大きい` - より大きい
- `整数値の<expected>より小さい` - より小さい
- `整数値の<expected>以上である` - 以上
- `整数値の<expected>以下である` - 以下
- `小数値の<expected>である` - 小数の完全一致
- `小数値の<expected>に近い` - 精度指定の近似値
- `小数点以下<scale>桁である` - 桁数検証

#### 文字列検証
- `文字列の<expected>である` - 完全一致
- `文字列の<expected>ではない` - 不一致
- `文字列の<expected>を含んでいる` - 部分一致
- `文字列の<expected>で始まる` - 前方一致
- `文字列の<expected>で終わる` - 後方一致
- `正規表現<pattern>にマッチする` - 正規表現マッチ
- `正規表現の<pattern>に完全一致している` - 完全マッチ

#### 真偽値検証
- `真である` - trueであること
- `偽である` - falseであること

#### Null/Undefined検証
- `nullである` - nullであること
- `nullではない` - nullでないこと
- `undefinedである` - undefinedであること
- `undefinedではない` - undefinedでないこと

#### 存在検証
- `存在する` - 値が存在すること
- `存在しない` - 値が存在しないこと

#### テーブル検証
- `テーブル<tableString>である` - テーブル完全一致
- `以下のテーブルである <tableString>` - Gauge形式のテーブル
- `テーブルの行数が<expected>である` - 行数検証
- `テーブルが空である` - 空テーブル検証
- `テーブルが空ではない` - 非空テーブル検証

### 🌐 HTTP機能（@playtest-ts/http）

#### リクエスト構築
- `パス<path>に` - URLパス設定
- `メソッド<method>で` - HTTPメソッド設定（GET/POST/PUT/DELETE等）
- `メディアタイプ<mediaType>で` - Content-Type設定
- `ヘッダー<name>に<value>を設定して` - カスタムヘッダー追加
- `JSONボディ<json>で` - JSONリクエストボディ設定
- `ボディ<body>で` - テキストボディ設定
- `リクエストを送る` - HTTPリクエスト実行

#### レスポンス検証
- `レスポンスのステータスコードが` - ステータスコード取得
- `レスポンスのボディが` - ボディ全体取得
- `レスポンスのJSONボディが` - JSONとしてパース
- `レスポンスのJSONパス<path>が` - JSONPath単一値取得
- `レスポンスのJSONパスAll<path>が` - JSONPath複数値取得
- `レスポンスのヘッダー<name>が` - レスポンスヘッダー取得
- `レスポンスのステータスコードが<expected>である` - ステータスコード検証
- `レスポンスのボディが<expected>を含んでいる` - ボディ部分一致検証

### 🎭 モック機能（@playtest-ts/wiremock）

#### モック定義
- `モック<name>に<method>リクエスト<path>を設定する` - モック作成
- `モックのレスポンスステータスを<status>にする` - ステータス設定
- `モックのレスポンスボディを<body>にする` - ボディ設定
- `モックのクエリパラメータ<name>を<value>にする` - クエリパラメータマッチ
- `モックのJSONPathマッチ<path>が<value>を設定する` - JSONボディマッチ
- `モックを有効にする` - モック有効化
- `全てのモックが呼ばれた` - 呼び出し検証
- `モックをクリアする` - モッククリア

### 🗄️ データベース機能（@playtest-ts/jdbc）

#### クエリ実行と検証
- `DB<name>にSQL<sql>を実行した結果が` - SELECT実行と結果取得
- `DB<name>にSQL<sql>を実行する` - INSERT/UPDATE/DELETE実行
- `結果の行数が` - 結果行数取得
- `結果の<column>列が` - 特定列の最初の値取得
- `結果の<index>行目の<column>列が` - 特定セルの値取得
- `結果が空である` - 空結果検証
- `結果が空ではない` - 非空結果検証

## 使用例

### 例1: REST APIのCRUDテスト

```markdown
# ユーザー管理API

## ユーザーの作成

* パス"/api/users"に
* メソッド"POST"で
* メディアタイプ"application/json"で
* JSONボディ"{"name": "新規ユーザー", "email": "test@example.com"}"で
* リクエストを送る
* レスポンスのステータスコードが"201"である
* レスポンスのJSONパス"id"が
* 存在する

## 作成したユーザーの取得

* パス"/api/users/1"に
* メソッド"GET"で
* リクエストを送る
* レスポンスのステータスコードが"200"である
* レスポンスのJSONパス"name"が
* 文字列の"新規ユーザー"である

## ユーザー情報の更新

* パス"/api/users/1"に
* メソッド"PUT"で
* JSONボディ"{"name": "更新済みユーザー"}"で
* リクエストを送る
* レスポンスのステータスコードが"200"である

## ユーザーの削除

* パス"/api/users/1"に
* メソッド"DELETE"で
* リクエストを送る
* レスポンスのステータスコードが"204"である
```

### 例2: モックを使用した外部API連携テスト

```markdown
# 外部API連携テスト

## 天気情報APIのモック

* モック"WeatherAPI"に"GET"リクエスト"/weather/tokyo"を設定する
* モックのレスポンスステータスを"200"にする
* モックのレスポンスボディを"{"temperature": 25, "condition": "晴れ"}"にする
* モックを有効にする

## アプリケーションから天気情報取得

* パス"/dashboard/weather"に
* メソッド"GET"で
* リクエストを送る
* レスポンスのJSONパス"tokyo.temperature"が
* 整数値の"25"である
* 全てのモックが呼ばれた
```

### 例3: データベース連携テスト

```markdown
# データベーステスト

## テストデータの準備

* DB"TestDB"にSQL"INSERT INTO users (name, age) VALUES ('Alice', 30), ('Bob', 25)"を実行する

## データの検証

* DB"TestDB"にSQL"SELECT * FROM users WHERE age >= 25"を実行した結果が
* 結果の行数が
* 整数値の"2"である

## 特定データの確認

* 結果の"name"列が
* 文字列の"Alice"である
* 結果の"1"行目の"name"列が
* 文字列の"Bob"である

## クリーンアップ

* DB"TestDB"にSQL"DELETE FROM users"を実行する
```

## プログラムAPI

### JSONPath（高度なクエリ）

```typescript
import { ResponseProxy } from "@playtest-ts/http";

// 基本的な使用法
const name = response.jsonPath<string>("$.user.name");
const age = response.jsonPath<number>("$.user.age");

// 配列アクセス
const firstItem = response.jsonPath("$.items[0]");
const lastItem = response.jsonPath("$.items[-1]");

// 複数値の取得
const allNames = response.jsonPathAll<string>("$.users[*].name");

// フィルタリング
const adults = response.jsonPathAll("$.users[?(@.age >= 18)]");
const activeUsers = response.jsonPathAll("$.users[?(@.status == 'active')]");

// ネストしたクエリ
const cityNames = response.jsonPathAll("$.users[*].address.city");
```

### テーブル操作

```typescript
import { createTable, createTableAssertable, parseGaugeTable } from "@playtest-ts/core";

// プログラムでテーブル作成
const table = createTable(
  ["名前", "年齢", "部署"],
  [
    { 名前: "田中", 年齢: 30, 部署: "開発" },
    { 名前: "佐藤", 年齢: 25, 部署: "営業" },
    { 名前: "鈴木", 年齢: 35, 部署: "開発" }
  ]
);

// テーブル検証
const assertable = createTableAssertable(table);
assertable
  .shouldHaveRowCount(3)
  .shouldHaveHeaders(["名前", "年齢", "部署"])
  .shouldNotBeEmpty();

// Gauge形式のテーブルをパース
const gaugeTable = parseGaugeTable(`
  | 名前 | 年齢 |
  | 田中 | 30  |
  | 佐藤 | 25  |
`);
```

### Zoomパターン（ネストされたデータアクセス）

```typescript
import { createJsonZoomable, createArrayZoomable } from "@playtest-ts/core";

// 複雑なJSONデータ
const data = {
  users: [
    {
      id: 1,
      profile: {
        personal: {
          name: "田中太郎",
          address: {
            city: "東京",
            postal: "100-0001"
          }
        }
      }
    }
  ]
};

// Zoomableオブジェクト作成
const zoomable = createJsonZoomable(data);

// ドット記法でアクセス
const userName = zoomable.zoom("users[0].profile.personal.name"); // "田中太郎"
const city = zoomable.zoom("users[0].profile.personal.address.city"); // "東京"

// 配列のZoom
const items = ["apple", "banana", "orange"];
const arrayZoomable = createArrayZoomable(items);
const second = arrayZoomable.zoom("1"); // "banana"
```

### Decimal（高精度数値）

```typescript
import { createDecimalAssertable } from "@playtest-ts/core";

// 高精度な数値比較
const pi = 3.14159265359;
const assertable = createDecimalAssertable(pi);

// 精度を指定して比較
assertable.shouldBeCloseTo(3.14, 2);      // 小数点2桁まで一致
assertable.shouldBeCloseTo(3.1416, 4);    // 小数点4桁まで一致

// 桁数の検証
assertable.shouldHaveScale(11);           // 小数点以下11桁

// 金額計算での使用例
const price = 1999.99;
const tax = 199.99;
const total = 2199.98;

createDecimalAssertable(total)
  .shouldBe(2199.98)
  .shouldHaveScale(2);
```

### WireMock（高度なモック）

```typescript
import { MockBuilder, initMockServer } from "@playtest-ts/wiremock";

// モックサーバーの初期化
initMockServer("APIServer", "http://api.example.com");

// 複雑なモック定義
const builder = new MockBuilder(mockServer);

builder
  .forRequest("POST", "/api/users")
  .withRequestHeaders({ "Content-Type": "application/json" })
  .withRequestBody({ name: "test", email: "test@example.com" })
  .withQueryParam("validate", "true")
  .willRespondWith(201)
  .withResponseHeaders({ "Location": "/api/users/123" })
  .withResponseBody({ id: 123, status: "created" })
  .setup();

// JSONPathを使用したリクエストマッチング
builder
  .forRequest("PUT", "/api/orders")
  .withJsonPathMatch("$.items[*].quantity", value => value > 0)
  .willRespondWith(200)
  .setup();
```

## 開発者向け

### ローカル開発環境のセットアップ

```bash
# リポジトリクローン
git clone https://github.com/your-org/playtest-ts.git
cd playtest-ts

# pnpmインストール
npm install -g pnpm

# 依存関係インストール
pnpm install

# ビルド
pnpm build

# テスト実行
pnpm test

# 特定パッケージのテスト
pnpm --filter @playtest-ts/core test
pnpm --filter @playtest-ts/http test
```

### パッケージ構造

```
playtest-ts/
├── packages/
│   ├── core/          # コア機能
│   │   ├── src/
│   │   │   ├── assertion/    # アサーション実装
│   │   │   ├── store/        # ScenarioStore
│   │   │   ├── table/        # テーブル処理
│   │   │   ├── zoom/         # Zoomパターン
│   │   │   └── steps/        # Gaugeステップ定義
│   │   └── __tests__/
│   ├── http/          # HTTP機能
│   │   ├── src/
│   │   │   ├── client/       # HTTPクライアント
│   │   │   ├── proxy/        # ResponseProxy
│   │   │   └── steps/        # HTTPステップ
│   │   └── __tests__/
│   ├── wiremock/      # モック機能
│   │   └── src/
│   │       ├── server/       # MockServer
│   │       ├── builder/      # MockBuilder
│   │       └── steps/        # モックステップ
│   └── jdbc/          # データベース機能
│       └── src/
│           ├── client/       # DatabaseClient
│           ├── proxy/        # ResultSetProxy
│           └── steps/        # DBステップ
├── examples/          # 使用例
│   └── simple-api-test/
├── pnpm-workspace.yaml
└── package.json
```

### 新しいステップの追加方法

1. ステップクラスを作成：

```typescript
// packages/core/src/steps/custom-steps.ts
import { Step } from "gauge-ts";

export class CustomSteps {
  @Step("カスタムステップ<param>を実行する")
  public async executeCustomStep(param: string): Promise<void> {
    // ステップの実装
    console.log(`Custom step executed with: ${param}`);
  }
}
```

2. index.tsでエクスポート：

```typescript
// packages/core/src/index.ts
export * from "./steps/custom-steps.js";
```

3. ビルドして使用：

```bash
pnpm build
```

## トラブルシューティング

### よくある問題と解決方法

#### 1. Gauge CLIが見つからない

**エラー**: `gauge: command not found`

**解決方法**:
```bash
npm install -g @getgauge/cli
gauge install ts
```

#### 2. TypeScriptのデコレータエラー

**エラー**: `Experimental support for decorators is a feature that is subject to change`

**解決方法**:
`tsconfig.json`に以下を追加：
```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

#### 3. モジュールが見つからない

**エラー**: `Cannot find module '@playtest-ts/core'`

**解決方法**:
- npmに公開前の場合：
  ```bash
  cd packages/core
  npm link
  cd ../../my-project
  npm link @playtest-ts/core
  ```

- pnpmワークスペース内の場合：
  ```json
  {
    "dependencies": {
      "@playtest-ts/core": "workspace:*"
    }
  }
  ```

#### 4. JSONパースエラー

**エラー**: `Failed to parse response body as JSON`

**解決方法**:
- レスポンスがJSONであることを確認
- Content-Typeヘッダーを確認
- `レスポンスのボディが`ステップで生のボディを確認

#### 5. データベース接続エラー

**エラー**: `Connection refused`

**解決方法**:
- PostgreSQLが起動していることを確認
- 接続文字列が正しいことを確認
- ファイアウォール設定を確認

### デバッグ方法

#### Gaugeのデバッグモード

```bash
# 詳細なログを表示
gauge run specs/ --log-level=debug

# 特定のシナリオのみ実行
gauge run specs/test.spec:5

# ステップの実行を表示
gauge run specs/ --verbose
```

#### VSCodeでのデバッグ

`.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Gauge Tests",
      "program": "${workspaceFolder}/node_modules/.bin/gauge",
      "args": ["run", "specs/", "--simple-console"],
      "cwd": "${workspaceFolder}",
      "console": "integratedTerminal"
    }
  ]
}
```

### パフォーマンスチューニング

#### 並列実行

```bash
# 並列実行を有効化
gauge run specs/ --parallel

# 並列数を指定
gauge run specs/ --parallel -n=4
```

#### タイムアウト設定

```javascript
// gauge.properties
runner_connection_timeout = 60000
runner_request_timeout = 60000
```

## コントリビューション

プルリクエストを歓迎します。大きな変更の場合は、まずissueを開いて変更内容について議論してください。

### 開発ガイドライン

1. TypeScriptの型安全性を維持
2. すべての新機能にテストを追加
3. 日本語ステップの命名規則に従う
4. READMEとドキュメントを更新

## ライセンス

MIT

## サポート

- 🐛 バグ報告: [GitHub Issues](https://github.com/your-org/playtest-ts/issues)
- 💬 ディスカッション: [GitHub Discussions](https://github.com/your-org/playtest-ts/discussions)
- 📧 お問い合わせ: support@example.com