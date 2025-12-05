// Mock builder for setting up mock responses

import { MockServer } from "../server/mock-server.js";

export interface MockRequest {
  method: string;
  path: string;
  headers?: Record<string, string>;
  body?: unknown;
}

export interface MockResponse {
  status: number;
  headers?: Record<string, string>;
  body?: unknown;
}

/**
 * Builder for setting up mock request/response pairs
 */
export class MockBuilder {
  private request: MockRequest = {
    method: "GET",
    path: "/",
  };
  private response: MockResponse = {
    status: 200,
  };

  constructor(private readonly server: MockServer) {}

  /**
   * Set the request method and path
   */
  forRequest(method: string, path: string): this {
    this.request.method = method.toUpperCase();
    this.request.path = path;
    return this;
  }

  /**
   * Set expected request headers
   */
  withRequestHeaders(headers: Record<string, string>): this {
    this.request.headers = headers;
    return this;
  }

  /**
   * Set expected request body
   */
  withRequestBody(body: unknown): this {
    this.request.body = body;
    return this;
  }

  /**
   * Set the response status code
   */
  willRespondWith(status: number): this {
    this.response.status = status;
    return this;
  }

  /**
   * Set response headers
   */
  withResponseHeaders(headers: Record<string, string>): this {
    this.response.headers = headers;
    return this;
  }

  /**
   * Set response body
   */
  withResponseBody(body: unknown): this {
    this.response.body = body;
    return this;
  }

  /**
   * Register the mock
   */
  setup(): void {
    const scope = this.server.getScope();
    const method = this.request.method.toLowerCase();

    let interceptor: ReturnType<typeof scope.get>;

    switch (method) {
      case "get":
        interceptor = scope.get(this.request.path);
        break;
      case "post":
        interceptor = scope.post(this.request.path, this.request.body as nock.RequestBodyMatcher);
        break;
      case "put":
        interceptor = scope.put(this.request.path, this.request.body as nock.RequestBodyMatcher);
        break;
      case "delete":
        interceptor = scope.delete(this.request.path);
        break;
      case "patch":
        interceptor = scope.patch(this.request.path, this.request.body as nock.RequestBodyMatcher);
        break;
      default:
        interceptor = scope.intercept(this.request.path, method);
    }

    if (this.request.headers) {
      interceptor = interceptor.matchHeader(
        Object.keys(this.request.headers)[0],
        Object.values(this.request.headers)[0]
      );
    }

    interceptor.reply(
      this.response.status,
      this.response.body as nock.Body,
      this.response.headers
    );
  }
}

// Type import for nock
import type nock from "nock";
