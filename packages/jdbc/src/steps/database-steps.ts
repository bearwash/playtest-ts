// Gauge database steps in Japanese

import { Step } from "gauge-ts";
import { ScenarioStore } from "@playtest-ts/core";
import { setCurrentValue } from "@playtest-ts/core";
import { DatabaseClient } from "../client/database-client.js";
import { createResultSetProxy } from "../proxy/result-set-proxy.js";
import type { ResultSetProxy } from "../proxy/result-set-proxy.js";

const DB_CLIENTS_KEY = "__dbClients__";
const RESULT_SET_KEY = "__resultSet__";

/**
 * Get database clients map
 */
function getDbClients(): Map<string, DatabaseClient> {
  let clients = ScenarioStore.get<Map<string, DatabaseClient>>(DB_CLIENTS_KEY);
  if (!clients) {
    clients = new Map();
    ScenarioStore.set(DB_CLIENTS_KEY, clients);
  }
  return clients;
}

/**
 * Get a specific database client
 */
function getDbClient(name: string): DatabaseClient {
  const clients = getDbClients();
  const client = clients.get(name);
  if (!client) {
    throw new Error(`Database "${name}" not configured. Call initDatabase first.`);
  }
  return client;
}

/**
 * Initialize a database connection
 */
export function initDatabase(name: string, connectionString: string): void {
  const clients = getDbClients();
  const client = new DatabaseClient({ connectionString });
  clients.set(name, client);
}

/**
 * Close all database connections
 */
export async function closeAllDatabases(): Promise<void> {
  const clients = getDbClients();
  for (const client of clients.values()) {
    await client.close();
  }
  clients.clear();
}

// ============================================
// Database query steps
// ============================================

export class DatabaseSteps {
  @Step("DB<name>にSQL<sql>を実行した結果が")
  public async executeQuery(name: string, sql: string): Promise<void> {
    const client = getDbClient(name);
    const rows = await client.query(sql);
    const resultSet = createResultSetProxy(rows);
    ScenarioStore.set(RESULT_SET_KEY, resultSet);
  }

  @Step("DB<name>にSQL<sql>を実行する")
  public async executeStatement(name: string, sql: string): Promise<void> {
    const client = getDbClient(name);
    await client.execute(sql);
  }
}

// ============================================
// Result set focus steps
// ============================================

export class ResultSetSteps {
  @Step("結果の行数が")
  public async focusRowCount(): Promise<void> {
    const resultSet = ScenarioStore.get<ResultSetProxy>(RESULT_SET_KEY);
    if (!resultSet) {
      throw new Error("No result set available. Execute a query first.");
    }
    setCurrentValue(resultSet.rowCount());
  }

  @Step("結果の<column>列が")
  public async focusColumn(column: string): Promise<void> {
    const resultSet = ScenarioStore.get<ResultSetProxy>(RESULT_SET_KEY);
    if (!resultSet) {
      throw new Error("No result set available. Execute a query first.");
    }
    setCurrentValue(resultSet.column(column));
  }

  @Step("結果の<index>行目の<column>列が")
  public async focusCell(index: string, column: string): Promise<void> {
    const resultSet = ScenarioStore.get<ResultSetProxy>(RESULT_SET_KEY);
    if (!resultSet) {
      throw new Error("No result set available. Execute a query first.");
    }
    const row = resultSet.row(parseInt(index, 10));
    if (!row) {
      throw new Error(`Row ${index} not found in result set.`);
    }
    setCurrentValue(row[column]);
  }

  @Step("結果が空である")
  public async resultShouldBeEmpty(): Promise<void> {
    const resultSet = ScenarioStore.get<ResultSetProxy>(RESULT_SET_KEY);
    if (!resultSet) {
      throw new Error("No result set available. Execute a query first.");
    }
    if (!resultSet.isEmpty()) {
      throw new Error(`Result set is not empty. Row count: ${resultSet.rowCount()}`);
    }
  }

  @Step("結果が空ではない")
  public async resultShouldNotBeEmpty(): Promise<void> {
    const resultSet = ScenarioStore.get<ResultSetProxy>(RESULT_SET_KEY);
    if (!resultSet) {
      throw new Error("No result set available. Execute a query first.");
    }
    if (resultSet.isEmpty()) {
      throw new Error("Result set is empty.");
    }
  }
}
