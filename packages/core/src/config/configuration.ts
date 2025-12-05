// Configuration DSL for playtest-ts

export interface HttpConfig {
  baseUrl: string;
}

export interface WireMockConfig {
  name: string;
  url: string;
}

export interface JdbcConfig {
  connectionString: string;
}

export interface PlaytestConfig {
  http?: HttpConfig;
  wireMock?: WireMockConfig[];
  jdbc?: JdbcConfig;
}

/**
 * Create a playtest configuration
 * @example
 * const config = playtest({
 *   http: { baseUrl: "http://localhost:8080" },
 *   wireMock: [{ name: "InnerAPI", url: "http://localhost:3000" }],
 *   jdbc: { connectionString: "postgres://localhost:5432/test" }
 * });
 */
export function playtest(config: PlaytestConfig): PlaytestConfig {
  return config;
}
