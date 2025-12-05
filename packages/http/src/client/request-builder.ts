// Fluent request builder

import { HttpClient, HttpRequest, HttpResponse } from "./http-client.js";

/**
 * Fluent builder for HTTP requests
 */
export class RequestBuilder {
  private _path: string = "/";
  private _method: string = "GET";
  private _headers: Record<string, string> = {};
  private _body?: string;

  constructor(private readonly client: HttpClient) {}

  /**
   * Set the request path
   */
  path(path: string): this {
    this._path = path;
    return this;
  }

  /**
   * Set the HTTP method
   */
  method(method: string): this {
    this._method = method.toUpperCase();
    return this;
  }

  /**
   * Set the Content-Type header
   */
  contentType(mediaType: string): this {
    this._headers["Content-Type"] = mediaType;
    return this;
  }

  /**
   * Set a header
   */
  header(name: string, value: string): this {
    this._headers[name] = value;
    return this;
  }

  /**
   * Set multiple headers
   */
  headers(headers: Record<string, string>): this {
    Object.assign(this._headers, headers);
    return this;
  }

  /**
   * Set the request body as JSON
   */
  jsonBody(body: unknown): this {
    this._body = JSON.stringify(body);
    if (!this._headers["Content-Type"]) {
      this._headers["Content-Type"] = "application/json";
    }
    return this;
  }

  /**
   * Set the request body as string
   */
  body(body: string): this {
    this._body = body;
    return this;
  }

  /**
   * Build the request object
   */
  build(): HttpRequest {
    return {
      url: this._path,
      method: this._method,
      headers: this._headers,
      body: this._body,
    };
  }

  /**
   * Send the request
   */
  async send(): Promise<HttpResponse> {
    return this.client.send(this.build());
  }
}
