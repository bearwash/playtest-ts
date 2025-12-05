// @playtest-ts/core
// Core module for playtest-ts BDD testing framework

export type { PlaytestConfig } from "./config/configuration.js";
export { playtest } from "./config/configuration.js";
export { ScenarioStore } from "./store/scenario-store.js";

// Assertions
export type { Assertable, StringAssertable, NumberAssertable, DecimalAssertable } from "./assertion/assertable.js";
export { createAssertable, createDecimalAssertable } from "./assertion/assertable.js";

// Table
export type { Table, TableAssertable } from "./table/table.js";
export { createTable, createTableAssertable, parseGaugeTable } from "./table/table.js";

// Zoomable
export type { Zoomable } from "./zoom/zoomable.js";
export { JsonZoomable, ArrayZoomable, createJsonZoomable, createArrayZoomable } from "./zoom/zoomable.js";

// Gauge steps
export { setCurrentValue } from "./steps/assertion-steps.js";
export {
  IntegerAssertionSteps,
  StringAssertionSteps,
  BooleanAssertionSteps,
  NullAssertionSteps,
  DecimalAssertionSteps,
  TableAssertionSteps,
  ExistenceAssertionSteps,
  RegexAssertionSteps,
} from "./steps/assertion-steps.js";
