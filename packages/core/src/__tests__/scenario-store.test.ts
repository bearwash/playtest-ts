import { describe, it, expect, beforeEach } from "vitest";
import { ScenarioStore } from "../store/scenario-store.js";

describe("ScenarioStore", () => {
  beforeEach(() => {
    ScenarioStore.clear();
  });

  it("set and get a value", () => {
    ScenarioStore.set("key", "value");
    expect(ScenarioStore.get("key")).toBe("value");
  });

  it("get returns undefined for non-existent key", () => {
    expect(ScenarioStore.get("nonexistent")).toBeUndefined();
  });

  it("has returns true for existing key", () => {
    ScenarioStore.set("key", "value");
    expect(ScenarioStore.has("key")).toBe(true);
  });

  it("has returns false for non-existent key", () => {
    expect(ScenarioStore.has("nonexistent")).toBe(false);
  });

  it("delete removes a key", () => {
    ScenarioStore.set("key", "value");
    expect(ScenarioStore.delete("key")).toBe(true);
    expect(ScenarioStore.has("key")).toBe(false);
  });

  it("delete returns false for non-existent key", () => {
    expect(ScenarioStore.delete("nonexistent")).toBe(false);
  });

  it("clear removes all keys", () => {
    ScenarioStore.set("key1", "value1");
    ScenarioStore.set("key2", "value2");
    ScenarioStore.clear();
    expect(ScenarioStore.has("key1")).toBe(false);
    expect(ScenarioStore.has("key2")).toBe(false);
  });

  it("stores complex objects", () => {
    const obj = { name: "test", nested: { value: 123 } };
    ScenarioStore.set("object", obj);
    expect(ScenarioStore.get("object")).toEqual(obj);
  });

  it("stores arrays", () => {
    const arr = [1, 2, 3];
    ScenarioStore.set("array", arr);
    expect(ScenarioStore.get("array")).toEqual(arr);
  });

  it("overwrites existing values", () => {
    ScenarioStore.set("key", "value1");
    ScenarioStore.set("key", "value2");
    expect(ScenarioStore.get("key")).toBe("value2");
  });
});
