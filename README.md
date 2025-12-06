# PlayTest-TS

日本語で書ける、TypeScript製のE2Eテストフレームワーク 

```typescript
// こんな風に日本語でテストが書けます！
* パス"/api/users"に
* メソッド"GET"で
* リクエストを送る
* レスポンスのステータスコードが"200"である
```

## PlayTest-TSとは？

PlayTest-TSは、**日本語の自然な文章でテストシナリオを書ける**BDDテストフレームワークです。
Gaugeと統合し、プログラマーでなくても読めるテストを実現します。

## 📋 目次

- [30秒で始める](#30秒で始める)
- [インストール](#インストール)
- [基本的な使い方](#基本的な使い方)
- [機能一覧](#機能一覧)
- [実例](#実例)
- [トラブルシューティング](#トラブルシューティング)

## 30秒で始める

```bash
# 1. リポジトリをクローン
git clone https://github.com/your-org/playtest-ts.git
cd playtest-ts

# 2. 依存関係をインストール（pnpm必須）
npm install -g pnpm
pnpm install

# 3. ビルド
pnpm build

# 4. サンプルテストを実行
cd examples/my-first-test
npm run test:simple
```


## インストール

### 必要な環境

| ツール | バージョン | 用途 |
|--------|-----------|------|
| Node.js | v18.0.0以上 | 実行環境 |
| pnpm | v9.0.0以上 | パッケージ管理 |
| TypeScript | v5.8.0以上 | 型チェック |
| Gauge | 最新版 | BDDテスト実行（オプション） |

### セットアップ手順

#### ステップ1: 基本ツールのインストール

```bash
# Node.jsの確認
node --version  # v18以上であること

# pnpmのインストール
npm install -g pnpm
```

#### ステップ2: PlayTest-TSのセットアップ

```bash
# リポジトリをクローン
git clone https://github.com/your-org/playtest-ts.git
cd playtest-ts

# 依存関係をインストール
pnpm install

# プロジェクトをビルド
pnpm build
```

#### ステップ3: テストプロジェクトの作成

```bash
# サンプルプロジェクトへ移動
cd examples/my-first-test

# 依存関係をインストール
pnpm install

# テストを実行
npm run test:simple
```

### Gaugeを使う場合（オプション）

```bash
# Gauge CLIをインストール
npm install -g @getgauge/cli

# TypeScriptプラグインをインストール
gauge install ts
```

## 基本的な使い方

### 1. 簡単なテストを書く

`simple-test.ts`を作成:

```typescript
import { createAssertable } from "@playtest-ts/core";

// 文字列のテスト
const text = "こんにちは世界";
createAssertable(text).shouldContain("世界");  // ✅ 成功

// 数値のテスト
const age = 25;
createAssertable(age).shouldBeGreaterThan(18); // ✅ 成功
```

### 2. HTTPテストを書く

```typescript
import { createResponseProxy } from "@playtest-ts/http";

// APIレスポンスのモック
const mockResponse = {
  status: 200,
  body: JSON.stringify({
    user: { name: "田中太郎", age: 30 }
  })
};

// JSONPathで値を取得
const proxy = createResponseProxy(mockResponse);
console.log(proxy.jsonPath("user.name")); // "田中太郎"
```

### 3. 日本語でシナリオを書く（Gauge形式）

`test.spec`ファイル:

```markdown
# ユーザー管理テスト

## ユーザー情報の取得

* パス"/api/users/1"に
* メソッド"GET"で
* リクエストを送る
* レスポンスのJSONパス"name"が
* 文字列の"田中太郎"である
```

## 機能一覧

### 4つのコアパッケージ

| パッケージ | 用途 | 主な機能 |
|-----------|------|---------|
| **@playtest-ts/core** | 基本機能 | アサーション、データ保存、テーブル処理 |
| **@playtest-ts/http** | HTTPテスト | リクエスト送信、レスポンス検証、JSONPath |
| **@playtest-ts/wiremock** | モック | HTTPリクエストの偽装、テスト用サーバー |
| **@playtest-ts/jdbc** | DB接続 | PostgreSQL接続、クエリ実行、結果検証 |

### 60個以上の日本語ステップ

#### よく使うステップ（抜粋）

**HTTPリクエスト:**
- `パス<path>に`
- `メソッド<method>で`
- `JSONボディ<json>で`
- `リクエストを送る`

**レスポンス検証:**
- `レスポンスのステータスコードが<code>である`
- `レスポンスのJSONパス<path>が`
- `文字列の<expected>である`
- `整数値の<expected>より大きい`

**モック設定:**
- `モック<name>に<method>リクエスト<path>を設定する`
- `モックのレスポンスボディを<body>にする`
- `モックを有効にする`

[→ 全ステップ一覧はこちら](#利用可能なステップ一覧)

## 実例

### 例1: REST APIのテスト

```typescript
// HTTPクライアントを初期化
import { initHttpClient } from "@playtest-ts/http";
initHttpClient("http://localhost:8080");

// テストシナリオ（日本語）
```

```markdown
## ユーザー作成のテスト

* パス"/api/users"に
* メソッド"POST"で
* JSONボディ"{"name": "新規ユーザー", "email": "test@example.com"}"で
* リクエストを送る
* レスポンスのステータスコードが"201"である
```

### 例2: モックを使ったテスト

```typescript
import { initMockServer } from "@playtest-ts/wiremock";

// モックサーバーを初期化
initMockServer("TestAPI", "http://localhost:3000");
```

```markdown
## 外部APIのモック

* モック"TestAPI"に"GET"リクエスト"/weather"を設定する
* モックのレスポンスボディを"{"temp": 25, "weather": "晴れ"}"にする
* モックを有効にする
```

### 例3: JSONPathを使った複雑な検証

```typescript
const response = createResponseProxy(apiResponse);

// ネストされたデータを取得
response.jsonPath("user.profile.address.city"); // "東京"

// 配列の全要素を取得
response.jsonPathAll("items[*].price"); // [1000, 2000, 3000]

// 条件でフィルタリング
response.jsonPathAll("users[?(@.age >= 20)]"); // 20歳以上のユーザー
```

## プロジェクト構成

```
playtest-ts/
├── packages/           # 機能別パッケージ
│   ├── core/          # 基本機能
│   ├── http/          # HTTPテスト
│   ├── wiremock/      # モック
│   └── jdbc/          # データベース
├── examples/          # サンプルプロジェクト
│   └── my-first-test/ # すぐに試せるサンプル
└── README.md          # このファイル
```

## テストの実行方法

### 方法1: 簡単なスクリプト実行（推奨）

```bash
cd examples/my-first-test
npm run test:simple
```

### 方法2: Vitestを使った単体テスト

```bash
cd examples/my-first-test
npm run test:vitest
```

### 方法3: Gaugeを使ったBDDテスト

```bash
cd examples/my-first-test
gauge run specs/
```

## 利用可能なステップ一覧

<details>
<summary>クリックして全ステップを表示</summary>

### アサーション（@playtest-ts/core）

#### 数値
- `整数値の<expected>である`
- `整数値の<expected>ではない`
- `整数値の<expected>より大きい`
- `整数値の<expected>より小さい`
- `整数値の<expected>以上である`
- `整数値の<expected>以下である`
- `小数値の<expected>である`
- `小数値の<expected>に近い`

#### 文字列
- `文字列の<expected>である`
- `文字列の<expected>を含んでいる`
- `文字列の<expected>で始まる`
- `文字列の<expected>で終わる`
- `正規表現<pattern>にマッチする`

#### その他
- `真である` / `偽である`
- `nullである` / `nullではない`
- `存在する` / `存在しない`
- `テーブル<table>である`
- `テーブルの行数が<count>である`

### HTTP（@playtest-ts/http）

- `パス<path>に`
- `メソッド<method>で`
- `メディアタイプ<mediaType>で`
- `ヘッダー<name>に<value>を設定して`
- `JSONボディ<json>で`
- `リクエストを送る`
- `レスポンスのステータスコードが<code>である`
- `レスポンスのJSONパス<path>が`

### モック（@playtest-ts/wiremock）

- `モック<name>に<method>リクエスト<path>を設定する`
- `モックのレスポンスステータスを<status>にする`
- `モックのレスポンスボディを<body>にする`
- `モックを有効にする`
- `全てのモックが呼ばれた`

### データベース（@playtest-ts/jdbc）

- `DB<name>にSQL<sql>を実行した結果が`
- `結果の行数が`
- `結果の<column>列が`
- `結果が空である`

</details>

## トラブルシューティング

### よくある質問

#### Q: `pnpm: command not found`

```bash
npm install -g pnpm
```

#### Q: TypeScriptのエラーが出る

```bash
# TypeScriptのバージョンを確認
npx tsc --version

# tsconfig.jsonに以下を追加
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

#### Q: モジュールが見つからない

```bash
# プロジェクトルートでビルド
cd /path/to/playtest-ts
pnpm build
```

#### Q: Gaugeが動かない

Gaugeの代わりに、簡単なテストスクリプトかVitestを使用してください：

```bash
npm run test:simple  # または
npm run test:vitest
```

## 開発に参加

### 貢献方法

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチをプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

### 開発環境のセットアップ

```bash
# 開発環境の準備
git clone https://github.com/your-org/playtest-ts.git
cd playtest-ts
pnpm install
pnpm build

# テストの実行
pnpm test

# 特定パッケージのテスト
pnpm --filter @playtest-ts/core test
```