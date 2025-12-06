// Vitestを使ったPlayTest-TSのテスト例
import { describe, it, expect } from "vitest";
import { createAssertable, createDecimalAssertable, ScenarioStore } from "@playtest-ts/core";
import { createResponseProxy } from "@playtest-ts/http";

describe("PlayTest-TS 機能テスト", () => {
  describe("アサーション機能", () => {
    it("文字列の検証ができる", () => {
      const text = "こんにちは世界";
      const assertable = createAssertable(text);

      // エラーが発生しなければ成功
      expect(() => assertable.shouldContain("世界")).not.toThrow();
      expect(() => assertable.shouldStartWith("こんにちは")).not.toThrow();
      expect(() => assertable.shouldEndWith("世界")).not.toThrow();
    });

    it("数値の検証ができる", () => {
      const age = 25;
      const assertable = createAssertable(age);

      expect(() => assertable.shouldBe(25)).not.toThrow();
      expect(() => assertable.shouldBeGreaterThan(18)).not.toThrow();
      expect(() => assertable.shouldBeLessThan(30)).not.toThrow();
    });

    it("高精度数値の検証ができる", () => {
      const pi = 3.14159265359;
      const assertable = createDecimalAssertable(pi);

      expect(() => assertable.shouldBeCloseTo(3.14, 2)).not.toThrow();
      expect(() => assertable.shouldBeCloseTo(3.1416, 4)).not.toThrow();
    });
  });

  describe("ScenarioStore", () => {
    it("値を保存・取得できる", () => {
      ScenarioStore.set("testKey", "testValue");
      expect(ScenarioStore.get("testKey")).toBe("testValue");

      ScenarioStore.set("number", 42);
      expect(ScenarioStore.get("number")).toBe(42);

      ScenarioStore.clear();
      expect(ScenarioStore.get("testKey")).toBeUndefined();
    });
  });

  describe("HTTPレスポンス処理", () => {
    it("JSONPathでデータを取得できる", () => {
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

      const proxy = createResponseProxy(mockResponse);

      expect(proxy.statusCode()).toBe(200);
      expect(proxy.jsonPath("user.name")).toBe("田中太郎");
      expect(proxy.jsonPath("user.address.city")).toBe("東京");

      const prices = proxy.jsonPathAll<number>("items[*].price");
      expect(prices).toEqual([1000, 2000, 3000]);
    });
  });
});