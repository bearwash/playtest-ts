// Scenario data store for sharing data between steps

const store = new Map<string, unknown>();

/**
 * Store for sharing data between Gauge steps within a scenario
 */
export const ScenarioStore = {
  /**
   * Store a value with the given key
   */
  set<T>(key: string, value: T): void {
    store.set(key, value);
  },

  /**
   * Retrieve a value by key
   */
  get<T>(key: string): T | undefined {
    return store.get(key) as T | undefined;
  },

  /**
   * Check if a key exists
   */
  has(key: string): boolean {
    return store.has(key);
  },

  /**
   * Remove a value by key
   */
  delete(key: string): boolean {
    return store.delete(key);
  },

  /**
   * Clear all stored values
   */
  clear(): void {
    store.clear();
  },
};
