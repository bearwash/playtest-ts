// Result set proxy for accessing query results

export interface QueryResult {
  rows: Record<string, unknown>[];
  rowCount: number;
}

/**
 * Proxy for accessing database query results
 */
export interface ResultSetProxy {
  /**
   * Get the number of rows
   */
  rowCount(): number;

  /**
   * Get all rows
   */
  rows(): Record<string, unknown>[];

  /**
   * Get a specific row by index
   */
  row(index: number): Record<string, unknown> | undefined;

  /**
   * Get a column value from the first row
   */
  column<T = unknown>(name: string): T | undefined;

  /**
   * Get all values from a column
   */
  columnValues<T = unknown>(name: string): T[];

  /**
   * Check if the result is empty
   */
  isEmpty(): boolean;

  /**
   * Get the first row
   */
  first(): Record<string, unknown> | undefined;
}

class ResultSetProxyImpl implements ResultSetProxy {
  constructor(private readonly data: Record<string, unknown>[]) {}

  rowCount(): number {
    return this.data.length;
  }

  rows(): Record<string, unknown>[] {
    return [...this.data];
  }

  row(index: number): Record<string, unknown> | undefined {
    return this.data[index];
  }

  column<T = unknown>(name: string): T | undefined {
    const firstRow = this.data[0];
    if (!firstRow) {
      return undefined;
    }
    return firstRow[name] as T | undefined;
  }

  columnValues<T = unknown>(name: string): T[] {
    return this.data.map((row) => row[name] as T);
  }

  isEmpty(): boolean {
    return this.data.length === 0;
  }

  first(): Record<string, unknown> | undefined {
    return this.data[0];
  }
}

/**
 * Create a result set proxy from query results
 */
export function createResultSetProxy(
  rows: Record<string, unknown>[]
): ResultSetProxy {
  return new ResultSetProxyImpl(rows);
}
