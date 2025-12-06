// Mock builder for setting up mock responses

import type nock from "nock";
import { MockServer } from "../server/mock-server.js";

export interface MockRequest {
  method: string;
  path: string;
  headers?: Record<string, string>;
  queryParams?: Record<string, string>;
  body?: unknown;
  jsonPathMatchers?: Array<{ path: string; value: unknown }>;
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
   * Set expected query parameters
   */
  withQueryParams(params: Record<string, string>): this {
    this.request.queryParams = params;
    return this;
  }

  /**
   * Add a single query parameter
   */
  withQueryParam(name: string, value: string): this {
    if (!this.request.queryParams) {
      this.request.queryParams = {};
    }
    this.request.queryParams[name] = value;
    return this;
  }

  /**
   * Add a JSONPath matcher for request body validation
   */
  withJsonPathMatch(path: string, value: unknown): this {
    if (!this.request.jsonPathMatchers) {
      this.request.jsonPathMatchers = [];
    }
    this.request.jsonPathMatchers.push({ path, value });
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

    // Build path with query params
    let path = this.request.path;
    if (this.request.queryParams) {
      const queryString = Object.entries(this.request.queryParams)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join("&");
      path = `${path}?${queryString}`;
    }

    let interceptor: ReturnType<typeof scope.get>;

    switch (method) {
      case "get":
        interceptor = scope.get(path);
        break;
      case "post":
        interceptor = this.request.body !== undefined
          ? scope.post(path, this.request.body as nock.RequestBodyMatcher)
          : scope.post(path);
        break;
      case "put":
        interceptor = this.request.body !== undefined
          ? scope.put(path, this.request.body as nock.RequestBodyMatcher)
          : scope.put(path);
        break;
      case "delete":
        interceptor = scope.delete(path);
        break;
      case "patch":
        interceptor = this.request.body !== undefined
          ? scope.patch(path, this.request.body as nock.RequestBodyMatcher)
          : scope.patch(path);
        break;
      default:
        interceptor = scope.intercept(path, method);
    }

    // Match all headers
    if (this.request.headers) {
      for (const [name, value] of Object.entries(this.request.headers)) {
        interceptor = interceptor.matchHeader(name, value);
      }
    }

    interceptor.reply(
      this.response.status,
      this.response.body as nock.Body,
      this.response.headers
    );
  }
}
