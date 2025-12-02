#!/usr/bin/env node

// 检查 Node.js 版本的启动脚本（使用 CommonJS 以确保兼容性）
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 18) {
  console.error("❌ 错误: LangChain v1.x 需要 Node.js 18 或更高版本");
  console.log(`   当前版本: ${nodeVersion}`);
  console.log("\n💡 解决方案:");
  console.log("   1. 使用 nvm 升级 Node.js:");
  console.log("      nvm install 18");
  console.log("      nvm use 18");
  console.log("\n   2. 或使用 nvm 升级到最新 LTS 版本:");
  console.log("      nvm install --lts");
  console.log("      nvm use --lts");
  console.log("\n   3. 或从 Node.js 官网下载: https://nodejs.org/");
  process.exit(1);
}

// 版本检查通过，使用动态导入运行主程序
import('./src/index.js').catch((error) => {
  if (error.message.includes('ReadableStream')) {
    console.error("\n❌ 加载 LangChain 模块失败");
    console.error("   虽然版本检查通过，但可能仍有兼容性问题");
    console.error("   请确保使用 Node.js 18 或更高版本");
  } else {
    console.error("❌ 加载程序失败:", error.message);
  }
  process.exit(1);
});
