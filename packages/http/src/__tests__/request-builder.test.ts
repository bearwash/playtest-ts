import { describe, it, expect, vi, beforeEach } from "vitest";
import { RequestBuilder } from "../client/request-builder.js";
import { HttpClient } from "../client/http-client.js";

describe("RequestBuilder", () => {
  let mockClient: HttpClient;
  let builder: RequestBuilder;

  beforeEach(() => {
    mockClient = {
      send: vi.fn().mockResolvedValue({
        status: 200,
        statusText: "OK",
        headers: {},
        body: "",
      }),
    } as unknown as HttpClient;
    builder = new RequestBuilder(mockClient);
  });

  describe("building requests", () => {
    it("builds a simple GET request", () => {
      const request = builder.path("/api/users").method("GET").build();

      expect(request).toEqual({
        url: "/api/users",
        method: "GET",
        headers: {},
        body: undefined,
      });
    });

    it("builds a POST request with JSON body", () => {
      const request = builder
        .path("/api/users")
        .method("POST")
        .jsonBody({ name: "Test" })
        .build();

      expect(request).toEqual({
        url: "/api/users",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: '{"name":"Test"}',
      });
    });

    it("sets custom headers", () => {
      const request = builder
        .path("/api/users")
        .header("Authorization", "Bearer token")
        .header("X-Custom", "value")
        .build();

      expect(request.headers).toEqual({
        Authorization: "Bearer token",
        "X-Custom": "value",
      });
    });

    it("sets multiple headers at once", () => {
      const request = builder
        .path("/api/users")
        .headers({
          Authorization: "Bearer token",
          "X-Custom": "value",
        })
        .build();

      expect(request.headers).toEqual({
        Authorization: "Bearer token",
        "X-Custom": "value",
      });
    });

    it("sets content type", () => {
      const request = builder
        .path("/api/users")
        .contentType("application/xml")
        .build();

      expect(request.headers["Content-Type"]).toBe("application/xml");
    });

    it("sets plain text body", () => {
      const request = builder
        .path("/api/users")
        .method("POST")
        .body("plain text")
        .build();

      expect(request.body).toBe("plain text");
    });

    it("method is case-insensitive and converts to uppercase", () => {
      expect(builder.method("get").build().method).toBe("GET");
      expect(builder.method("Post").build().method).toBe("POST");
      expect(builder.method("DELETE").build().method).toBe("DELETE");
    });
  });

  describe("sending requests", () => {
    it("sends request through client", async () => {
      await builder.path("/api/users").method("GET").send();

      expect(mockClient.send).toHaveBeenCalledWith({
        url: "/api/users",
        method: "GET",
        headers: {},
        body: undefined,
      });
    });

    it("returns response from client", async () => {
      const expectedResponse = {
        status: 201,
        statusText: "Created",
        headers: { "Content-Type": "application/json" },
        body: '{"id": 1}',
      };
      (mockClient.send as any).mockResolvedValue(expectedResponse);

      const response = await builder.path("/api/users").method("POST").send();

      expect(response).toEqual(expectedResponse);
    });
  });

  describe("method chaining", () => {
    it("supports fluent chaining", () => {
      const result = builder
        .path("/api/users")
        .method("POST")
        .contentType("application/json")
        .header("Authorization", "Bearer token")
        .jsonBody({ name: "Test" });

      expect(result).toBe(builder);
    });
  });
});
