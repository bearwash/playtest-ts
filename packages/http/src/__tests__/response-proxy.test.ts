import { describe, it, expect } from "vitest";
import { createResponseProxy } from "../proxy/response-proxy.js";
import type { HttpResponse } from "../client/http-client.js";

describe("ResponseProxy", () => {
  const createMockResponse = (
    overrides: Partial<HttpResponse> = {}
  ): HttpResponse => ({
    status: 200,
    statusText: "OK",
    headers: { "content-type": "application/json" },
    body: '{"name": "test", "age": 25}',
    ...overrides,
  });

  describe("statusCode", () => {
    it("returns the status code", () => {
      const response = createMockResponse({ status: 201 });
      const proxy = createResponseProxy(response);
      expect(proxy.statusCode()).toBe(201);
    });
  });

  describe("body", () => {
    it("returns the raw body", () => {
      const response = createMockResponse({ body: "raw content" });
      const proxy = createResponseProxy(response);
      expect(proxy.body()).toBe("raw content");
    });
  });

  describe("jsonBody", () => {
    it("parses and returns JSON body", () => {
      const response = createMockResponse();
      const proxy = createResponseProxy(response);
      expect(proxy.jsonBody()).toEqual({ name: "test", age: 25 });
    });

    it("caches parsed JSON", () => {
      const response = createMockResponse();
      const proxy = createResponseProxy(response);
      const first = proxy.jsonBody();
      const second = proxy.jsonBody();
      expect(first).toBe(second); // Same reference
    });
  });

  describe("jsonPath", () => {
    it("extracts value from simple path", () => {
      const response = createMockResponse();
      const proxy = createResponseProxy(response);
      expect(proxy.jsonPath("name")).toBe("test");
    });

    it("extracts value from nested path", () => {
      const response = createMockResponse({
        body: '{"user": {"profile": {"name": "John"}}}',
      });
      const proxy = createResponseProxy(response);
      expect(proxy.jsonPath("user.profile.name")).toBe("John");
    });

    it("throws for invalid path", () => {
      const response = createMockResponse({ body: '{"name": "test"}' });
      const proxy = createResponseProxy(response);
      expect(() => proxy.jsonPath("invalid.path.here")).toThrow();
    });
  });

  describe("header", () => {
    it("returns header value (case-insensitive)", () => {
      const response = createMockResponse({
        headers: { "Content-Type": "application/json" },
      });
      const proxy = createResponseProxy(response);
      expect(proxy.header("content-type")).toBe("application/json");
      expect(proxy.header("Content-Type")).toBe("application/json");
      expect(proxy.header("CONTENT-TYPE")).toBe("application/json");
    });

    it("returns undefined for missing header", () => {
      const response = createMockResponse();
      const proxy = createResponseProxy(response);
      expect(proxy.header("X-Missing")).toBeUndefined();
    });
  });

  describe("headers", () => {
    it("returns copy of all headers", () => {
      const originalHeaders = { "Content-Type": "application/json", "X-Custom": "value" };
      const response = createMockResponse({ headers: originalHeaders });
      const proxy = createResponseProxy(response);
      const headers = proxy.headers();

      expect(headers).toEqual(originalHeaders);
      // Verify it's a copy
      headers["New-Header"] = "new value";
      expect(proxy.headers()).not.toHaveProperty("New-Header");
    });
  });
});
