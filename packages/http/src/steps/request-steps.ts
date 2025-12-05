// Gauge HTTP request steps in Japanese

import { Step } from "gauge-ts";
import { ScenarioStore } from "@playtest-ts/core";
import { HttpClient } from "../client/http-client.js";
import { RequestBuilder } from "../client/request-builder.js";
import { createResponseProxy } from "../proxy/response-proxy.js";

const REQUEST_BUILDER_KEY = "__requestBuilder__";
const HTTP_CLIENT_KEY = "__httpClient__";
const RESPONSE_KEY = "__response__";

/**
 * Get or create the request builder
 */
function getRequestBuilder(): RequestBuilder {
  let builder = ScenarioStore.get<RequestBuilder>(REQUEST_BUILDER_KEY);
  if (!builder) {
    const client = ScenarioStore.get<HttpClient>(HTTP_CLIENT_KEY);
    if (!client) {
      throw new Error("HTTP client not configured. Call initHttpClient first.");
    }
    builder = new RequestBuilder(client);
    ScenarioStore.set(REQUEST_BUILDER_KEY, builder);
  }
  return builder;
}

/**
 * Initialize HTTP client with base URL
 */
export function initHttpClient(baseUrl: string): void {
  const client = new HttpClient(baseUrl);
  ScenarioStore.set(HTTP_CLIENT_KEY, client);
}

// ============================================
// Request building steps
// ============================================

export class RequestSteps {
  @Step("パス<path>に")
  public async setPath(path: string): Promise<void> {
    getRequestBuilder().path(path);
  }

  @Step("メソッド<method>で")
  public async setMethod(method: string): Promise<void> {
    getRequestBuilder().method(method);
  }

  @Step("メディアタイプ<mediaType>で")
  public async setContentType(mediaType: string): Promise<void> {
    getRequestBuilder().contentType(mediaType);
  }

  @Step("ヘッダー<name>に<value>を設定して")
  public async setHeader(name: string, value: string): Promise<void> {
    getRequestBuilder().header(name, value);
  }

  @Step("JSONボディ<json>で")
  public async setJsonBody(json: string): Promise<void> {
    const body = JSON.parse(json);
    getRequestBuilder().jsonBody(body);
  }

  @Step("ボディ<body>で")
  public async setBody(body: string): Promise<void> {
    getRequestBuilder().body(body);
  }

  @Step("リクエストを送る")
  public async sendRequest(): Promise<void> {
    const builder = getRequestBuilder();
    const response = await builder.send();
    const proxy = createResponseProxy(response);
    ScenarioStore.set(RESPONSE_KEY, proxy);
    // Clear builder for next request
    ScenarioStore.delete(REQUEST_BUILDER_KEY);
  }
}
