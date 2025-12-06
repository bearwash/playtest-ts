// Response proxy for accessing response data

import { JSONPath } from "jsonpath-plus";
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
   * Get a value from JSON body using JSONPath expression (e.g., "$.user.name", "$.users[0]")
   * Supports full JSONPath syntax including array access, wildcards, filters
   */
  jsonPath<T = unknown>(path: string): T;

  /**
   * Get all values matching a JSONPath expression (for indefinite paths)
   */
  jsonPathAll<T = unknown>(path: string): T[];

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
      try {
        this._jsonBody = JSON.parse(this.response.body);
      } catch (error) {
        throw new Error(
          `Failed to parse response body as JSON: ${error instanceof Error ? error.message : String(error)}\nResponse body: ${this.response.body.substring(0, 100)}${this.response.body.length > 100 ? '...' : ''}`
        );
      }
    }
    return this._jsonBody as T;
  }

  jsonPath<T = unknown>(path: string): T {
    // Normalize path to JSONPath format if needed
    const jsonPathExpr = path.startsWith("$") ? path : `$.${path}`;
    const results = JSONPath({ path: jsonPathExpr, json: this.jsonBody() });

    if (results.length === 0) {
      throw new Error(`JSONPath "${path}" returned no results`);
    }

    return results[0] as T;
  }

  jsonPathAll<T = unknown>(path: string): T[] {
    const jsonPathExpr = path.startsWith("$") ? path : `$.${path}`;
    return JSONPath({ path: jsonPathExpr, json: this.jsonBody() }) as T[];
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
