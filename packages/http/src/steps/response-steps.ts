// Gauge HTTP response steps in Japanese

import { Step } from "gauge-ts";
import { ScenarioStore } from "@playtest-ts/core";
import { setCurrentValue } from "@playtest-ts/core";
import type { ResponseProxy } from "../proxy/response-proxy.js";

const RESPONSE_KEY = "__response__";

/**
 * Get the current response proxy
 */
function getResponse(): ResponseProxy {
  const response = ScenarioStore.get<ResponseProxy>(RESPONSE_KEY);
  if (!response) {
    throw new Error("No response available. Make sure to send a request first.");
  }
  return response;
}

// ============================================
// Response focus steps
// ============================================

export class ResponseSteps {
  @Step("レスポンスのステータスコードが")
  public async focusStatusCode(): Promise<void> {
    const response = getResponse();
    setCurrentValue(response.statusCode());
  }

  @Step("レスポンスのボディが")
  public async focusBody(): Promise<void> {
    const response = getResponse();
    setCurrentValue(response.body());
  }

  @Step("レスポンスのJSONボディが")
  public async focusJsonBody(): Promise<void> {
    const response = getResponse();
    setCurrentValue(response.jsonBody());
  }

  @Step("レスポンスのJSONパス<path>が")
  public async focusJsonPath(path: string): Promise<void> {
    const response = getResponse();
    setCurrentValue(response.jsonPath(path));
  }

  @Step("レスポンスのヘッダー<name>が")
  public async focusHeader(name: string): Promise<void> {
    const response = getResponse();
    setCurrentValue(response.header(name));
  }
}

// ============================================
// Response assertion steps (convenience)
// ============================================

export class ResponseAssertionSteps {
  @Step("レスポンスのステータスコードが<expected>である")
  public async statusCodeShouldBe(expected: string): Promise<void> {
    const response = getResponse();
    const actual = response.statusCode();
    const expectedNum = parseInt(expected, 10);
    if (actual !== expectedNum) {
      throw new Error(`Status code assertion failed: expected ${expectedNum}, but got ${actual}`);
    }
  }

  @Step("レスポンスのボディが<expected>を含んでいる")
  public async bodyShouldContain(expected: string): Promise<void> {
    const response = getResponse();
    const actual = response.body();
    if (!actual.includes(expected)) {
      throw new Error(`Body assertion failed: expected body to contain "${expected}"`);
    }
  }

  @Step("レスポンスのヘッダー<name>が<expected>である")
  public async headerShouldBe(name: string, expected: string): Promise<void> {
    const response = getResponse();
    const actual = response.header(name);
    if (actual !== expected) {
      throw new Error(`Header assertion failed: expected "${name}" to be "${expected}", but got "${actual}"`);
    }
  }
}
