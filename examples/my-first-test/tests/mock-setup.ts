// モックサーバーを使用したテスト環境のセットアップ
import { BeforeSuite, AfterSuite, BeforeScenario } from "gauge-ts";
import { initHttpClient } from "@playtest-ts/http";
import { initMockServer, stopAllMockServers } from "@playtest-ts/wiremock";

// PlayTest-TSのステップを再エクスポート
export * from "@playtest-ts/core";
export * from "@playtest-ts/http";
export * from "@playtest-ts/wiremock";

/**
 * モック環境でのテストセットアップ
 */
export class MockSetup {
  @BeforeSuite()
  public async beforeSuite(): Promise<void> {
    // HTTPクライアントの初期化（モックサーバーのURL）
    initHttpClient("http://localhost:3000");

    // モックサーバーの初期化
    initMockServer("TestAPI", "http://localhost:3000");

    console.log("モックサーバーの準備が完了しました");
  }

  @BeforeScenario()
  public async beforeScenario(): Promise<void> {
    // 各シナリオの前にモックを設定
    await this.setupMocks();
  }

  private async setupMocks(): Promise<void> {
    // ヘルスチェックのモック
    // これはステップで設定することも可能ですが、
    // 共通のモックはここで設定しておくと便利です

    // Note: 実際のモック設定は各テストシナリオ内で
    // 日本語ステップを使って設定します
  }

  @AfterSuite()
  public async afterSuite(): Promise<void> {
    // モックサーバーのクリーンアップ
    stopAllMockServers();
    console.log("モックサーバーのクリーンアップが完了しました");
  }
}