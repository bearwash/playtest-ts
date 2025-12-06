// simple-test.tsを実行するためのスクリプト
import("./dist/simple-test.js")
  .then(() => {
    console.log("\nテスト実行完了！");
  })
  .catch((error) => {
    console.error("エラーが発生しました:", error);
  });