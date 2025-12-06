// PlayTest-TSを直接使う簡単なテスト例
import { createAssertable, createDecimalAssertable } from "@playtest-ts/core";
import { RequestBuilder, HttpClient, createResponseProxy } from "@playtest-ts/http";

// テスト例1: アサーション機能のテスト
console.log("=== アサーション機能のテスト ===");

// 文字列の検証
const text = "こんにちは世界";
const textAssertable = createAssertable(text);
try {
  textAssertable.shouldContain("世界");
  console.log("✅ 文字列テスト: '世界'を含んでいます");
} catch (e: any) {
  console.log("❌ 文字列テスト失敗:", e.message);
}

// 数値の検証
const age = 25;
const numberAssertable = createAssertable(age);
try {
  numberAssertable.shouldBeGreaterThan(18);
  console.log("✅ 数値テスト: 18より大きいです");
} catch (e: any) {
  console.log("❌ 数値テスト失敗:", e.message);
}

// 高精度数値の検証
console.log("\n=== Decimal（高精度数値）のテスト ===");
const pi = 3.14159;
const decimalAssertable = createDecimalAssertable(pi);
try {
  decimalAssertable.shouldBeCloseTo(3.14, 2);
  console.log("✅ 高精度数値テスト: 3.14に近い値（小数点2桁）");
} catch (e: any) {
  console.log("❌ 高精度数値テスト失敗:", e.message);
}

// テスト例2: HTTPクライアントのモック応答
console.log("\n=== HTTPレスポンスのモック例 ===");

// モックレスポンスを作成
const mockResponse = {
  status: 200,
  statusText: "OK",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    user: {
      id: 1,
      name: "田中太郎",
      email: "tanaka@example.com",
      address: {
        city: "東京",
        postal: "100-0001"
      }
    },
    items: [
      { id: 101, name: "商品A", price: 1000 },
      { id: 102, name: "商品B", price: 2000 },
      { id: 103, name: "商品C", price: 3000 }
    ]
  })
};

// ResponseProxyを使ってJSONPathで値を取得
const responseProxy = createResponseProxy(mockResponse);

console.log("ステータスコード:", responseProxy.statusCode());
console.log("ユーザー名:", responseProxy.jsonPath("user.name"));
console.log("メールアドレス:", responseProxy.jsonPath("user.email"));
console.log("都市:", responseProxy.jsonPath("user.address.city"));

// 配列データの取得
const allPrices = responseProxy.jsonPathAll<number>("items[*].price");
console.log("全商品の価格:", allPrices);

const firstItemName = responseProxy.jsonPath<string>("items[0].name");
console.log("最初の商品名:", firstItemName);

console.log("\n✨ PlayTest-TSの機能テストが完了しました！");