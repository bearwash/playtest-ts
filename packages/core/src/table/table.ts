// Table type for structured data comparison

/**
 * Table interface for row/column data
 */
export interface Table {
  headers: string[];
  rows: Record<string, unknown>[];
}

/**
 * Table assertion interface
 */
export interface TableAssertable {
  /**
   * Assert that the table equals the expected table
   */
  shouldEqual(expected: Table): void;

  /**
   * Assert that the table contains the expected rows (order-independent)
   */
  shouldContainRows(expected: Record<string, unknown>[]): void;

  /**
   * Assert that the table has the expected row count
   */
  shouldHaveRowCount(expected: number): void;

  /**
   * Assert that the table has the expected headers
   */
  shouldHaveHeaders(expected: string[]): void;

  /**
   * Assert that the table is empty
   */
  shouldBeEmpty(): void;

  /**
   * Assert that the table is not empty
   */
  shouldNotBeEmpty(): void;
}

class TableAssertableImpl implements TableAssertable {
  constructor(private readonly table: Table) {}

  shouldEqual(expected: Table): void {
    // Check headers
    if (!this.arraysEqual(this.table.headers, expected.headers)) {
      throw new Error(
        `Table headers mismatch: expected ${JSON.stringify(expected.headers)}, but got ${JSON.stringify(this.table.headers)}`
      );
    }

    // Check row count
    if (this.table.rows.length !== expected.rows.length) {
      throw new Error(
        `Table row count mismatch: expected ${expected.rows.length}, but got ${this.table.rows.length}`
      );
    }

    // Check each row
    for (let i = 0; i < this.table.rows.length; i++) {
      const actualRow = this.table.rows[i];
      const expectedRow = expected.rows[i];

      for (const header of this.table.headers) {
        if (actualRow[header] !== expectedRow[header]) {
          throw new Error(
            `Table mismatch at row ${i}, column "${header}": expected ${JSON.stringify(expectedRow[header])}, but got ${JSON.stringify(actualRow[header])}`
          );
        }
      }
    }
  }

  shouldContainRows(expected: Record<string, unknown>[]): void {
    for (const expectedRow of expected) {
      const found = this.table.rows.some((actualRow) =>
        this.rowsEqual(actualRow, expectedRow)
      );
      if (!found) {
        throw new Error(
          `Table does not contain expected row: ${JSON.stringify(expectedRow)}`
        );
      }
    }
  }

  shouldHaveRowCount(expected: number): void {
    if (this.table.rows.length !== expected) {
      throw new Error(
        `Table row count mismatch: expected ${expected}, but got ${this.table.rows.length}`
      );
    }
  }

  shouldHaveHeaders(expected: string[]): void {
    if (!this.arraysEqual(this.table.headers, expected)) {
      throw new Error(
        `Table headers mismatch: expected ${JSON.stringify(expected)}, but got ${JSON.stringify(this.table.headers)}`
      );
    }
  }

  shouldBeEmpty(): void {
    if (this.table.rows.length !== 0) {
      throw new Error(
        `Expected table to be empty, but it has ${this.table.rows.length} rows`
      );
    }
  }

  shouldNotBeEmpty(): void {
    if (this.table.rows.length === 0) {
      throw new Error("Expected table to not be empty");
    }
  }

  private arraysEqual(a: string[], b: string[]): boolean {
    if (a.length !== b.length) return false;
    return a.every((val, idx) => val === b[idx]);
  }

  private rowsEqual(
    a: Record<string, unknown>,
    b: Record<string, unknown>
  ): boolean {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    return keysA.every((key) => a[key] === b[key]);
  }
}

/**
 * Create a table from headers and rows
 */
export function createTable(
  headers: string[],
  rows: Record<string, unknown>[]
): Table {
  return { headers, rows };
}

/**
 * Create a table assertable for table comparisons
 */
export function createTableAssertable(table: Table): TableAssertable {
  return new TableAssertableImpl(table);
}

/**
 * Parse a Gauge table format to Table
 * Format: | header1 | header2 |
 *         | value1  | value2  |
 */
export function parseGaugeTable(tableString: string): Table {
  const lines = tableString
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  const parseRow = (line: string): string[] => {
    return line
      .split("|")
      .map((cell) => cell.trim())
      .filter((cell) => cell.length > 0);
  };

  const headers = parseRow(lines[0]);
  const rows = lines.slice(1).map((line) => {
    const values = parseRow(line);
    const row: Record<string, unknown> = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx];
    });
    return row;
  });

  return { headers, rows };
}
