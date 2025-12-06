# My First Test - PlayTest-TSサンプルプロジェクト

このプロジェクトは、PlayTest-TSを使った最初のテストプロジェクトの例です。

## セットアップ方法

1. **依存関係のインストール**
```bash
pnpm install
```

2. **プロジェクトのビルド**
```bash
cd ../..
pnpm build
```

## テストの実行

### モックサーバーを使った実行（推奨）

実際のAPIサーバーがなくても、モックを使ってテストできます：

```bash
# モックサーバーを起動してテスト実行
npm run test:mock
```

### 実際のAPIサーバーに対する実行

1. テスト対象のAPIサーバーを起動（http://localhost:8080）
2. テストを実行：
```bash
npm test
```

### 特定のシナリオのみ実行

```bash
# ヘルスチェックのみ
gauge run specs/first_test.spec --scenario "ヘルスチェック"

# タグでフィルタリング（タグを追加した場合）
gauge run --tags "api" specs/
```

## プロジェクト構造

```
my-first-test/
├── specs/                    # テスト仕様ファイル
│   └── first_test.spec      # 日本語で書かれたテストシナリオ
├── tests/                    # ステップ実装
│   └── step-implementation.ts # PlayTest-TSの統合
├── env/                      # 環境設定
│   └── default/
│       └── default.properties
├── manifest.json            # Gauge設定
├── tsconfig.json           # TypeScript設定
└── package.json            # パッケージ定義
```

## テストシナリオ

### 1. ヘルスチェック
シンプルなGETリクエストのテスト

### 2. ユーザー情報の取得
JSONレスポンスの検証

### 3. ユーザーの作成
POSTリクエストとレスポンスの検証

### 4. 複数ユーザーの検索
配列データの検証

## カスタマイズ

### APIサーバーのURL変更

`tests/step-implementation.ts`の以下の部分を修正：

```typescript
initHttpClient("http://localhost:8080"); // ここを変更
```

### 新しいテストシナリオの追加

`specs/`フォルダに新しい`.spec`ファイルを作成し、日本語でシナリオを記述してください。

## トラブルシューティング

### Gauge CLIがインストールされていない場合

```bash
npm install -g @getgauge/cli
gauge install ts
```

### TypeScriptのコンパイルエラー

```bash
# TypeScriptの設定を確認
npx tsc --noEmit
```

### モジュールが見つからない

```bash
# ルートディレクトリでビルドを実行
cd ../..
pnpm build
cd examples/my-first-test
pnpm install
```