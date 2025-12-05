// Zoomable pattern for focusing on values

/**
 * Interface for objects that can be "zoomed" into to extract values
 */
export interface Zoomable<T> {
  /**
   * Zoom into a specific key/path and return the value
   */
  zoom(key: string): T;

  /**
   * Check if a key exists
   */
  has(key: string): boolean;

  /**
   * Get all available keys
   */
  keys(): string[];
}

/**
 * JSON Zoomable implementation
 */
export class JsonZoomable implements Zoomable<unknown> {
  constructor(private readonly data: Record<string, unknown>) {}

  zoom(key: string): unknown {
    const parts = key.split(".");
    let current: unknown = this.data;

    for (const part of parts) {
      if (current === null || current === undefined) {
        throw new Error(`Cannot zoom to "${key}": value is null or undefined`);
      }
      if (typeof current !== "object") {
        throw new Error(`Cannot zoom to "${key}": value is not an object`);
      }

      // Handle array access like "items[0]"
      const arrayMatch = part.match(/^(\w+)\[(\d+)\]$/);
      if (arrayMatch) {
        const [, arrayName, indexStr] = arrayMatch;
        const arr = (current as Record<string, unknown>)[arrayName];
        if (!Array.isArray(arr)) {
          throw new Error(`Cannot zoom to "${key}": "${arrayName}" is not an array`);
        }
        current = arr[parseInt(indexStr, 10)];
      } else {
        current = (current as Record<string, unknown>)[part];
      }
    }

    return current;
  }

  has(key: string): boolean {
    try {
      const value = this.zoom(key);
      return value !== undefined;
    } catch {
      return false;
    }
  }

  keys(): string[] {
    return Object.keys(this.data);
  }
}

/**
 * Array Zoomable implementation
 */
export class ArrayZoomable<T> implements Zoomable<T> {
  constructor(private readonly data: T[]) {}

  zoom(key: string): T {
    const index = parseInt(key, 10);
    if (isNaN(index)) {
      throw new Error(`Invalid array index: "${key}"`);
    }
    if (index < 0 || index >= this.data.length) {
      throw new Error(`Array index out of bounds: ${index} (length: ${this.data.length})`);
    }
    return this.data[index];
  }

  has(key: string): boolean {
    const index = parseInt(key, 10);
    return !isNaN(index) && index >= 0 && index < this.data.length;
  }

  keys(): string[] {
    return this.data.map((_, i) => i.toString());
  }
}

/**
 * Create a zoomable from a JSON object
 */
export function createJsonZoomable(data: Record<string, unknown>): Zoomable<unknown> {
  return new JsonZoomable(data);
}

/**
 * Create a zoomable from an array
 */
export function createArrayZoomable<T>(data: T[]): Zoomable<T> {
  return new ArrayZoomable(data);
}
