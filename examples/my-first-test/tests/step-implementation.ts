// Step implementations for my first test
import { BeforeSuite, AfterSuite } from "gauge-ts";
import { initHttpClient } from "@playtest-ts/http";

// PlayTest-TSのステップを再エクスポート
export * from "@playtest-ts/core";
export * from "@playtest-ts/http";

/**
 * テストの初期設定
 */
export class Setup {
  @BeforeSuite()
  public async beforeSuite(): Promise<void> {
    // HTTPクライアントの初期化
    // ここでテスト対象のAPIサーバーのURLを設定します
    initHttpClient("http://localhost:8080");

    console.log("テスト環境の準備が完了しました");
  }

  @AfterSuite()
  public async afterSuite(): Promise<void> {
    console.log("テスト環境のクリーンアップが完了しました");
  }
}