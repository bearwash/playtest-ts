// @playtest-ts/jdbc
// JDBC module for playtest-ts BDD testing framework

export { DatabaseClient } from "./client/database-client.js";
export type { DatabaseConfig } from "./client/database-client.js";
export type { QueryResult, ResultSetProxy } from "./proxy/result-set-proxy.js";
export { createResultSetProxy } from "./proxy/result-set-proxy.js";

// Gauge steps
export {
  initDatabase,
  closeAllDatabases,
  DatabaseSteps,
  ResultSetSteps,
} from "./steps/database-steps.js";
