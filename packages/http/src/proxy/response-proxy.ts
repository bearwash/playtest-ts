// Response proxy for accessing response data

import { HttpResponse } from "../client/http-client.js";

/**
 * Proxy for accessing HTTP response data
 */
export interface ResponseProxy {
  /**
   * Get the status code
   */
  statusCode(): number;

  /**
   * Get the response body as string
   */
  body(): string;

  /**
   * Get the response body parsed as JSON
   */
  jsonBody<T = unknown>(): T;

  /**
   * Get a value from JSON body using a path (e.g., "user.name")
   */
  jsonPath<T = unknown>(path: string): T;

  /**
   * Get a header value
   */
  header(name: string): string | undefined;

  /**
   * Get all headers
   */
  headers(): Record<string, string>;
}

class ResponseProxyImpl implements ResponseProxy {
  private _jsonBody?: unknown;

  constructor(private readonly response: HttpResponse) {}

  statusCode(): number {
    return this.response.status;
  }

  body(): string {
    return this.response.body;
  }

  jsonBody<T = unknown>(): T {
    if (this._jsonBody === undefined) {
      this._jsonBody = JSON.parse(this.response.body);
    }
    return this._jsonBody as T;
  }

  jsonPath<T = unknown>(path: string): T {
    const parts = path.split(".");
    let current: unknown = this.jsonBody();

    for (const part of parts) {
      if (current === null || current === undefined) {
        throw new Error(`Cannot access path "${path}": value is null or undefined`);
      }
      if (typeof current !== "object") {
        throw new Error(`Cannot access path "${path}": value is not an object`);
      }
      current = (current as Record<string, unknown>)[part];
    }

    return current as T;
  }

  header(name: string): string | undefined {
    // Headers are case-insensitive
    const lowerName = name.toLowerCase();
    for (const [key, value] of Object.entries(this.response.headers)) {
      if (key.toLowerCase() === lowerName) {
        return value;
      }
    }
    return undefined;
  }

  headers(): Record<string, string> {
    return { ...this.response.headers };
  }
}

/**
 * Create a response proxy from an HTTP response
 */
export function createResponseProxy(response: HttpResponse): ResponseProxy {
  return new ResponseProxyImpl(response);
}
