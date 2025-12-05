// Database client for PostgreSQL

import pg from "pg";

const { Pool } = pg;

export interface DatabaseConfig {
  connectionString?: string;
  host?: string;
  port?: number;
  database?: string;
  user?: string;
  password?: string;
}

/**
 * Database client for executing SQL queries
 */
export class DatabaseClient {
  private pool: pg.Pool;

  constructor(config: DatabaseConfig) {
    this.pool = new Pool(config);
  }

  /**
   * Execute a SQL query and return results
   */
  async query<T extends Record<string, unknown> = Record<string, unknown>>(
    sql: string,
    params?: unknown[]
  ): Promise<T[]> {
    const result = await this.pool.query(sql, params);
    return result.rows as T[];
  }

  /**
   * Execute a SQL query and return the first result
   */
  async queryOne<T extends Record<string, unknown> = Record<string, unknown>>(
    sql: string,
    params?: unknown[]
  ): Promise<T | null> {
    const results = await this.query<T>(sql, params);
    return results[0] ?? null;
  }

  /**
   * Execute a SQL statement (INSERT, UPDATE, DELETE)
   */
  async execute(sql: string, params?: unknown[]): Promise<number> {
    const result = await this.pool.query(sql, params);
    return result.rowCount ?? 0;
  }

  /**
   * Close the database connection
   */
  async close(): Promise<void> {
    await this.pool.end();
  }
}
