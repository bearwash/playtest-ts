// Gauge assertion steps in Japanese
// These steps are used to verify values in BDD tests

import { Step } from "gauge-ts";
import { ScenarioStore } from "../store/scenario-store.js";
import { createAssertable } from "../assertion/assertable.js";

const CURRENT_VALUE_KEY = "__currentValue__";

/**
 * Get the current value from the scenario store
 */
function getCurrentValue<T>(): T {
  const value = ScenarioStore.get<T>(CURRENT_VALUE_KEY);
  if (value === undefined) {
    throw new Error("No current value set. Make sure to focus on a value first.");
  }
  return value;
}

/**
 * Set the current value in the scenario store
 */
export function setCurrentValue<T>(value: T): void {
  ScenarioStore.set(CURRENT_VALUE_KEY, value);
}

// ============================================
// Integer assertions (整数値)
// ============================================

export class IntegerAssertionSteps {
  @Step("整数値の<expected>である")
  public async shouldBeInteger(expected: string): Promise<void> {
    const actual = getCurrentValue<number>();
    const expectedNum = parseInt(expected, 10);
    createAssertable(actual).shouldBe(expectedNum);
  }

  @Step("整数値の<expected>ではない")
  public async shouldNotBeInteger(expected: string): Promise<void> {
    const actual = getCurrentValue<number>();
    const expectedNum = parseInt(expected, 10);
    createAssertable(actual).shouldNotBe(expectedNum);
  }

  @Step("整数値の<expected>より大きい")
  public async shouldBeGreaterThan(expected: string): Promise<void> {
    const actual = getCurrentValue<number>();
    const expectedNum = parseInt(expected, 10);
    createAssertable(actual).shouldBeGreaterThan(expectedNum);
  }

  @Step("整数値の<expected>より小さい")
  public async shouldBeLessThan(expected: string): Promise<void> {
    const actual = getCurrentValue<number>();
    const expectedNum = parseInt(expected, 10);
    createAssertable(actual).shouldBeLessThan(expectedNum);
  }

  @Step("整数値の<expected>以上である")
  public async shouldBeGreaterThanOrEqual(expected: string): Promise<void> {
    const actual = getCurrentValue<number>();
    const expectedNum = parseInt(expected, 10);
    createAssertable(actual).shouldBeGreaterThanOrEqual(expectedNum);
  }

  @Step("整数値の<expected>以下である")
  public async shouldBeLessThanOrEqual(expected: string): Promise<void> {
    const actual = getCurrentValue<number>();
    const expectedNum = parseInt(expected, 10);
    createAssertable(actual).shouldBeLessThanOrEqual(expectedNum);
  }
}

// ============================================
// String assertions (文字列)
// ============================================

export class StringAssertionSteps {
  @Step("文字列の<expected>である")
  public async shouldBeString(expected: string): Promise<void> {
    const actual = getCurrentValue<string>();
    createAssertable(actual).shouldBe(expected);
  }

  @Step("文字列の<expected>ではない")
  public async shouldNotBeString(expected: string): Promise<void> {
    const actual = getCurrentValue<string>();
    createAssertable(actual).shouldNotBe(expected);
  }

  @Step("文字列の<expected>を含んでいる")
  public async shouldContain(expected: string): Promise<void> {
    const actual = getCurrentValue<string>();
    createAssertable(actual).shouldContain(expected);
  }

  @Step("文字列の<expected>で始まる")
  public async shouldStartWith(expected: string): Promise<void> {
    const actual = getCurrentValue<string>();
    createAssertable(actual).shouldStartWith(expected);
  }

  @Step("文字列の<expected>で終わる")
  public async shouldEndWith(expected: string): Promise<void> {
    const actual = getCurrentValue<string>();
    createAssertable(actual).shouldEndWith(expected);
  }

  @Step("正規表現<pattern>にマッチする")
  public async shouldMatchPattern(pattern: string): Promise<void> {
    const actual = getCurrentValue<string>();
    createAssertable(actual).shouldMatch(new RegExp(pattern));
  }
}

// ============================================
// Boolean assertions (真偽値)
// ============================================

export class BooleanAssertionSteps {
  @Step("真である")
  public async shouldBeTrue(): Promise<void> {
    const actual = getCurrentValue<boolean>();
    createAssertable(actual).shouldBe(true);
  }

  @Step("偽である")
  public async shouldBeFalse(): Promise<void> {
    const actual = getCurrentValue<boolean>();
    createAssertable(actual).shouldBe(false);
  }
}

// ============================================
// Null/Undefined assertions
// ============================================

export class NullAssertionSteps {
  @Step("nullである")
  public async shouldBeNull(): Promise<void> {
    const actual = getCurrentValue<unknown>();
    if (actual !== null) {
      throw new Error(`Assertion failed: expected null, but got ${JSON.stringify(actual)}`);
    }
  }

  @Step("nullではない")
  public async shouldNotBeNull(): Promise<void> {
    const actual = getCurrentValue<unknown>();
    if (actual === null) {
      throw new Error("Assertion failed: expected value to not be null");
    }
  }

  @Step("undefinedである")
  public async shouldBeUndefined(): Promise<void> {
    const actual = getCurrentValue<unknown>();
    if (actual !== undefined) {
      throw new Error(`Assertion failed: expected undefined, but got ${JSON.stringify(actual)}`);
    }
  }

  @Step("undefinedではない")
  public async shouldNotBeUndefined(): Promise<void> {
    const actual = getCurrentValue<unknown>();
    if (actual === undefined) {
      throw new Error("Assertion failed: expected value to not be undefined");
    }
  }
}
