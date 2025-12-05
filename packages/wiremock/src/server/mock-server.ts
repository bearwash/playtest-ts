// Mock server using nock

import nock from "nock";

export interface MockServerConfig {
  name: string;
  baseUrl: string;
}

/**
 * Mock server for intercepting HTTP requests
 */
export class MockServer {
  private scope: nock.Scope | null = null;

  constructor(private readonly config: MockServerConfig) {}

  /**
   * Get the server name
   */
  get name(): string {
    return this.config.name;
  }

  /**
   * Get the base URL
   */
  get baseUrl(): string {
    return this.config.baseUrl;
  }

  /**
   * Start intercepting requests
   */
  start(): void {
    this.scope = nock(this.config.baseUrl);
  }

  /**
   * Stop intercepting and clean up
   */
  stop(): void {
    nock.cleanAll();
    this.scope = null;
  }

  /**
   * Get the nock scope for setting up mocks
   */
  getScope(): nock.Scope {
    if (!this.scope) {
      throw new Error("Mock server not started. Call start() first.");
    }
    return this.scope;
  }

  /**
   * Setup a mock response for a GET request
   */
  onGet(path: string): nock.Interceptor {
    return this.getScope().get(path);
  }

  /**
   * Setup a mock response for a POST request
   */
  onPost(path: string): nock.Interceptor {
    return this.getScope().post(path);
  }

  /**
   * Setup a mock response for a PUT request
   */
  onPut(path: string): nock.Interceptor {
    return this.getScope().put(path);
  }

  /**
   * Setup a mock response for a DELETE request
   */
  onDelete(path: string): nock.Interceptor {
    return this.getScope().delete(path);
  }

  /**
   * Setup a mock response for a PATCH request
   */
  onPatch(path: string): nock.Interceptor {
    return this.getScope().patch(path);
  }

  /**
   * Verify all expected requests were made
   */
  verify(): void {
    if (this.scope && !this.scope.isDone()) {
      const pending = this.scope.pendingMocks();
      throw new Error(`Pending mocks not satisfied: ${pending.join(", ")}`);
    }
  }
}
