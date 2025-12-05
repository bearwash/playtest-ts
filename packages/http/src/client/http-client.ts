// HTTP Client using native fetch

export interface HttpRequest {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
}

export interface HttpResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
}

/**
 * HTTP Client using native fetch API
 */
export class HttpClient {
  constructor(private readonly baseUrl: string) {}

  /**
   * Send an HTTP request
   */
  async send(request: HttpRequest): Promise<HttpResponse> {
    const url = new URL(request.url, this.baseUrl).toString();

    const response = await fetch(url, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });

    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    const body = await response.text();

    return {
      status: response.status,
      statusText: response.statusText,
      headers,
      body,
    };
  }
}
