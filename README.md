# playtest-ts

TypeScript製のBDDテストフレームワーク。Gaugeと統合し、日本語の自然言語でE2Eテストを記述できます。

## 特徴

- **日本語ステップ**: 自然な日本語でテストシナリオを記述
- **モジュラー設計**: 必要な機能だけをインストール
- **TypeScript**: 型安全なテスト実装
- **Gauge統合**: BDDスタイルのテスト実行

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
- `モックを有効にする`
- `全てのモックが呼ばれた`
- `モックをクリアする`

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
