// @playtest-ts/core
// Core module for playtest-ts BDD testing framework

export type { PlaytestConfig } from "./config/configuration.js";
export { playtest } from "./config/configuration.js";
export { ScenarioStore } from "./store/scenario-store.js";
export type { Assertable, StringAssertable, NumberAssertable } from "./assertion/assertable.js";
export { createAssertable } from "./assertion/assertable.js";
