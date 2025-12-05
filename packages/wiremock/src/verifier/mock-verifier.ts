// Mock verifier for checking request counts and content

import nock from "nock";

/**
 * Verifier for checking mock request expectations
 */
export class MockVerifier {
  /**
   * Verify that all expected mocks were called
   */
  static verifyAll(): void {
    if (!nock.isDone()) {
      const pending = nock.pendingMocks();
      throw new Error(`Pending mocks not satisfied: ${pending.join(", ")}`);
    }
  }

  /**
   * Clean up all mocks
   */
  static cleanAll(): void {
    nock.cleanAll();
  }

  /**
   * Enable or disable real HTTP connections
   */
  static allowRealConnections(allow: boolean): void {
    if (allow) {
      nock.enableNetConnect();
    } else {
      nock.disableNetConnect();
    }
  }

  /**
   * Check if there are any pending mocks
   */
  static hasPendingMocks(): boolean {
    return !nock.isDone();
  }

  /**
   * Get the list of pending mocks
   */
  static getPendingMocks(): string[] {
    return nock.pendingMocks();
  }
}
