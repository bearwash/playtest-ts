// Step implementations for simple API test

import { BeforeSuite, AfterSuite } from "gauge-ts";
import { initHttpClient } from "@playtest-ts/http";
import { initMockServer, stopAllMockServers, MockBuilder } from "@playtest-ts/wiremock";

// Re-export all steps from playtest-ts packages
export * from "@playtest-ts/core";
export * from "@playtest-ts/http";
export * from "@playtest-ts/wiremock";

/**
 * Setup before all tests
 */
export class Setup {
  @BeforeSuite()
  public async beforeSuite(): Promise<void> {
    // Initialize HTTP client with base URL
    initHttpClient("http://localhost:8080");

    // Initialize mock server for external API
    initMockServer("ExternalAPI", "http://localhost:3000");

    // Setup mock responses
    const mockServer = new MockBuilder(
      { name: "ExternalAPI", baseUrl: "http://localhost:3000" } as any
    );
  }

  @AfterSuite()
  public async afterSuite(): Promise<void> {
    // Cleanup mock servers
    stopAllMockServers();
  }
}
