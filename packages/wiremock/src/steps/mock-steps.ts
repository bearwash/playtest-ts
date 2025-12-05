// Gauge mock verification steps in Japanese

import { Step } from "gauge-ts";
import { ScenarioStore } from "@playtest-ts/core";
import { MockServer } from "../server/mock-server.js";
import { MockBuilder } from "../builder/mock-builder.js";
import { MockVerifier } from "../verifier/mock-verifier.js";

const MOCK_SERVERS_KEY = "__mockServers__";
const CURRENT_MOCK_BUILDER_KEY = "__currentMockBuilder__";

/**
 * Get mock servers map
 */
function getMockServers(): Map<string, MockServer> {
  let servers = ScenarioStore.get<Map<string, MockServer>>(MOCK_SERVERS_KEY);
  if (!servers) {
    servers = new Map();
    ScenarioStore.set(MOCK_SERVERS_KEY, servers);
  }
  return servers;
}

/**
 * Get a specific mock server
 */
function getMockServer(name: string): MockServer {
  const servers = getMockServers();
  const server = servers.get(name);
  if (!server) {
    throw new Error(`Mock server "${name}" not configured. Call initMockServer first.`);
  }
  return server;
}

/**
 * Initialize a mock server
 */
export function initMockServer(name: string, baseUrl: string): void {
  const servers = getMockServers();
  const server = new MockServer({ name, baseUrl });
  server.start();
  servers.set(name, server);
}

/**
 * Stop all mock servers
 */
export function stopAllMockServers(): void {
  const servers = getMockServers();
  for (const server of servers.values()) {
    server.stop();
  }
  servers.clear();
  MockVerifier.cleanAll();
}

// ============================================
// Mock setup steps
// ============================================

export class MockSetupSteps {
  @Step("モック<name>に<method>リクエスト<path>を設定する")
  public async setupMock(name: string, method: string, path: string): Promise<void> {
    const server = getMockServer(name);
    const builder = new MockBuilder(server);
    builder.forRequest(method, path);
    ScenarioStore.set(CURRENT_MOCK_BUILDER_KEY, builder);
  }

  @Step("モックのレスポンスステータスを<status>にする")
  public async setMockStatus(status: string): Promise<void> {
    const builder = ScenarioStore.get<MockBuilder>(CURRENT_MOCK_BUILDER_KEY);
    if (!builder) {
      throw new Error("No mock builder available. Set up a mock first.");
    }
    builder.willRespondWith(parseInt(status, 10));
  }

  @Step("モックのレスポンスボディを<body>にする")
  public async setMockBody(body: string): Promise<void> {
    const builder = ScenarioStore.get<MockBuilder>(CURRENT_MOCK_BUILDER_KEY);
    if (!builder) {
      throw new Error("No mock builder available. Set up a mock first.");
    }
    try {
      // Try to parse as JSON
      const jsonBody = JSON.parse(body);
      builder.withResponseBody(jsonBody);
    } catch {
      // Use as plain text
      builder.withResponseBody(body);
    }
  }

  @Step("モックを有効にする")
  public async activateMock(): Promise<void> {
    const builder = ScenarioStore.get<MockBuilder>(CURRENT_MOCK_BUILDER_KEY);
    if (!builder) {
      throw new Error("No mock builder available. Set up a mock first.");
    }
    builder.setup();
    ScenarioStore.delete(CURRENT_MOCK_BUILDER_KEY);
  }
}

// ============================================
// Mock verification steps
// ============================================

export class MockVerificationSteps {
  @Step("モック<name>の<method>リクエスト<path>が呼ばれた")
  public async verifyMockCalled(name: string, _method: string, _path: string): Promise<void> {
    const server = getMockServer(name);
    server.verify();
  }

  @Step("全てのモックが呼ばれた")
  public async verifyAllMocksCalled(): Promise<void> {
    MockVerifier.verifyAll();
  }

  @Step("モックをクリアする")
  public async clearMocks(): Promise<void> {
    MockVerifier.cleanAll();
  }
}
