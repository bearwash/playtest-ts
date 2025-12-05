// Assertable interface and implementation for type-safe assertions

/**
 * Interface for assertable values
 */
export interface Assertable<T> {
  value: T;

  /**
   * Assert that the value equals the expected value
   */
  shouldBe(expected: T): void;

  /**
   * Assert that the value does not equal the expected value
   */
  shouldNotBe(expected: T): void;
}

/**
 * String-specific assertions
 */
export interface StringAssertable extends Assertable<string> {
  /**
   * Assert that the string contains the expected substring
   */
  shouldContain(expected: string): void;

  /**
   * Assert that the string starts with the expected prefix
   */
  shouldStartWith(expected: string): void;

  /**
   * Assert that the string ends with the expected suffix
   */
  shouldEndWith(expected: string): void;

  /**
   * Assert that the string matches the expected pattern
   */
  shouldMatch(pattern: RegExp): void;
}

/**
 * Number-specific assertions
 */
export interface NumberAssertable extends Assertable<number> {
  /**
   * Assert that the number is greater than the expected value
   */
  shouldBeGreaterThan(expected: number): void;

  /**
   * Assert that the number is less than the expected value
   */
  shouldBeLessThan(expected: number): void;

  /**
   * Assert that the number is greater than or equal to the expected value
   */
  shouldBeGreaterThanOrEqual(expected: number): void;

  /**
   * Assert that the number is less than or equal to the expected value
   */
  shouldBeLessThanOrEqual(expected: number): void;
}

/**
 * Decimal-specific assertions with precision support
 */
export interface DecimalAssertable extends NumberAssertable {
  /**
   * Assert that the decimal equals the expected value with given precision
   */
  shouldBeCloseTo(expected: number, precision?: number): void;

  /**
   * Assert that the decimal has the expected scale (decimal places)
   */
  shouldHaveScale(scale: number): void;
}

class AssertableImpl<T> implements Assertable<T> {
  constructor(public readonly value: T) {}

  shouldBe(expected: T): void {
    if (this.value !== expected) {
      throw new Error(
        `Assertion failed: expected ${JSON.stringify(expected)}, but got ${JSON.stringify(this.value)}`
      );
    }
  }

  shouldNotBe(expected: T): void {
    if (this.value === expected) {
      throw new Error(
        `Assertion failed: expected value to not be ${JSON.stringify(expected)}`
      );
    }
  }
}

class StringAssertableImpl
  extends AssertableImpl<string>
  implements StringAssertable
{
  shouldContain(expected: string): void {
    if (!this.value.includes(expected)) {
      throw new Error(
        `Assertion failed: expected "${this.value}" to contain "${expected}"`
      );
    }
  }

  shouldStartWith(expected: string): void {
    if (!this.value.startsWith(expected)) {
      throw new Error(
        `Assertion failed: expected "${this.value}" to start with "${expected}"`
      );
    }
  }

  shouldEndWith(expected: string): void {
    if (!this.value.endsWith(expected)) {
      throw new Error(
        `Assertion failed: expected "${this.value}" to end with "${expected}"`
      );
    }
  }

  shouldMatch(pattern: RegExp): void {
    if (!pattern.test(this.value)) {
      throw new Error(
        `Assertion failed: expected "${this.value}" to match ${pattern}`
      );
    }
  }
}

class NumberAssertableImpl
  extends AssertableImpl<number>
  implements NumberAssertable
{
  shouldBeGreaterThan(expected: number): void {
    if (this.value <= expected) {
      throw new Error(
        `Assertion failed: expected ${this.value} to be greater than ${expected}`
      );
    }
  }

  shouldBeLessThan(expected: number): void {
    if (this.value >= expected) {
      throw new Error(
        `Assertion failed: expected ${this.value} to be less than ${expected}`
      );
    }
  }

  shouldBeGreaterThanOrEqual(expected: number): void {
    if (this.value < expected) {
      throw new Error(
        `Assertion failed: expected ${this.value} to be greater than or equal to ${expected}`
      );
    }
  }

  shouldBeLessThanOrEqual(expected: number): void {
    if (this.value > expected) {
      throw new Error(
        `Assertion failed: expected ${this.value} to be less than or equal to ${expected}`
      );
    }
  }
}

class DecimalAssertableImpl
  extends NumberAssertableImpl
  implements DecimalAssertable
{
  shouldBeCloseTo(expected: number, precision: number = 10): void {
    const diff = Math.abs(this.value - expected);
    const epsilon = Math.pow(10, -precision);
    if (diff > epsilon) {
      throw new Error(
        `Assertion failed: expected ${this.value} to be close to ${expected} (precision: ${precision})`
      );
    }
  }

  shouldHaveScale(scale: number): void {
    const str = this.value.toString();
    const decimalIndex = str.indexOf(".");
    const actualScale = decimalIndex === -1 ? 0 : str.length - decimalIndex - 1;
    if (actualScale !== scale) {
      throw new Error(
        `Assertion failed: expected ${this.value} to have scale ${scale}, but got ${actualScale}`
      );
    }
  }
}

/**
 * Create an assertable wrapper for a value
 */
export function createAssertable(value: string): StringAssertable;
export function createAssertable(value: number): NumberAssertable;
export function createAssertable<T>(value: T): Assertable<T>;
export function createAssertable<T>(value: T): Assertable<T> {
  if (typeof value === "string") {
    return new StringAssertableImpl(value) as unknown as Assertable<T>;
  }
  if (typeof value === "number") {
    return new NumberAssertableImpl(value) as unknown as Assertable<T>;
  }
  return new AssertableImpl(value);
}

/**
 * Create a decimal assertable wrapper for a number with precision support
 */
export function createDecimalAssertable(value: number): DecimalAssertable {
  return new DecimalAssertableImpl(value);
}
