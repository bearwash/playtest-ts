import { describe, it, expect } from "vitest";
import { createAssertable } from "../assertion/assertable.js";

describe("createAssertable", () => {
  describe("string assertions", () => {
    it("shouldBe passes when values are equal", () => {
      const assertable = createAssertable("hello");
      expect(() => assertable.shouldBe("hello")).not.toThrow();
    });

    it("shouldBe throws when values are not equal", () => {
      const assertable = createAssertable("hello");
      expect(() => assertable.shouldBe("world")).toThrow(/Assertion failed/);
    });

    it("shouldNotBe passes when values are different", () => {
      const assertable = createAssertable("hello");
      expect(() => assertable.shouldNotBe("world")).not.toThrow();
    });

    it("shouldNotBe throws when values are equal", () => {
      const assertable = createAssertable("hello");
      expect(() => assertable.shouldNotBe("hello")).toThrow(/Assertion failed/);
    });

    it("shouldContain passes when string contains substring", () => {
      const assertable = createAssertable("hello world");
      expect(() => assertable.shouldContain("world")).not.toThrow();
    });

    it("shouldContain throws when string does not contain substring", () => {
      const assertable = createAssertable("hello world");
      expect(() => assertable.shouldContain("foo")).toThrow(/Assertion failed/);
    });

    it("shouldStartWith passes when string starts with prefix", () => {
      const assertable = createAssertable("hello world");
      expect(() => assertable.shouldStartWith("hello")).not.toThrow();
    });

    it("shouldStartWith throws when string does not start with prefix", () => {
      const assertable = createAssertable("hello world");
      expect(() => assertable.shouldStartWith("world")).toThrow(/Assertion failed/);
    });

    it("shouldEndWith passes when string ends with suffix", () => {
      const assertable = createAssertable("hello world");
      expect(() => assertable.shouldEndWith("world")).not.toThrow();
    });

    it("shouldEndWith throws when string does not end with suffix", () => {
      const assertable = createAssertable("hello world");
      expect(() => assertable.shouldEndWith("hello")).toThrow(/Assertion failed/);
    });

    it("shouldMatch passes when string matches pattern", () => {
      const assertable = createAssertable("hello123");
      expect(() => assertable.shouldMatch(/\d+/)).not.toThrow();
    });

    it("shouldMatch throws when string does not match pattern", () => {
      const assertable = createAssertable("hello");
      expect(() => assertable.shouldMatch(/\d+/)).toThrow(/Assertion failed/);
    });
  });

  describe("number assertions", () => {
    it("shouldBe passes when values are equal", () => {
      const assertable = createAssertable(42);
      expect(() => assertable.shouldBe(42)).not.toThrow();
    });

    it("shouldBe throws when values are not equal", () => {
      const assertable = createAssertable(42);
      expect(() => assertable.shouldBe(43)).toThrow(/Assertion failed/);
    });

    it("shouldBeGreaterThan passes when value is greater", () => {
      const assertable = createAssertable(10);
      expect(() => assertable.shouldBeGreaterThan(5)).not.toThrow();
    });

    it("shouldBeGreaterThan throws when value is not greater", () => {
      const assertable = createAssertable(5);
      expect(() => assertable.shouldBeGreaterThan(10)).toThrow(/Assertion failed/);
    });

    it("shouldBeLessThan passes when value is less", () => {
      const assertable = createAssertable(5);
      expect(() => assertable.shouldBeLessThan(10)).not.toThrow();
    });

    it("shouldBeLessThan throws when value is not less", () => {
      const assertable = createAssertable(10);
      expect(() => assertable.shouldBeLessThan(5)).toThrow(/Assertion failed/);
    });

    it("shouldBeGreaterThanOrEqual passes when value is greater or equal", () => {
      const assertable = createAssertable(10);
      expect(() => assertable.shouldBeGreaterThanOrEqual(10)).not.toThrow();
      expect(() => assertable.shouldBeGreaterThanOrEqual(5)).not.toThrow();
    });

    it("shouldBeLessThanOrEqual passes when value is less or equal", () => {
      const assertable = createAssertable(5);
      expect(() => assertable.shouldBeLessThanOrEqual(5)).not.toThrow();
      expect(() => assertable.shouldBeLessThanOrEqual(10)).not.toThrow();
    });
  });

  describe("generic assertions", () => {
    it("shouldBe works with boolean values", () => {
      const assertable = createAssertable(true);
      expect(() => assertable.shouldBe(true)).not.toThrow();
      expect(() => assertable.shouldBe(false)).toThrow(/Assertion failed/);
    });

    it("shouldNotBe works with boolean values", () => {
      const assertable = createAssertable(false);
      expect(() => assertable.shouldNotBe(true)).not.toThrow();
    });
  });
});
