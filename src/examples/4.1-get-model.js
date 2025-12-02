/**
 * 4.1 获取大模型示例
 * 演示如何初始化和使用 LangChain 的大语言模型
 */
import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";

dotenv.config();

async function example1() {
  console.log("=== 示例 4.1: 获取大模型 ===\n");

  try {
    // 检查 API Key
    if (!process.env.OPENAI_API_KEY) {
      console.error("❌ 请设置 OPENAI_API_KEY 环境变量");
      return;
    }

    // 创建大模型实例
    // 这里使用 ChatOpenAI，它支持对话模式
    const model = new ChatOpenAI({
      modelName: process.env.OPENAI_MODEL_NAME || "gpt-3.5-turbo",
      temperature: 0.7,
      apiKey: process.env.OPENAI_API_KEY,
    });

    // 如果配置了 baseURL，添加到配置中
    if (process.env.OPENAI_BASE_URL) {
      model.baseURL = process.env.OPENAI_BASE_URL;
    }

    console.log("✅ 大模型已成功创建");
    console.log(`📋 模型名称: ${process.env.OPENAI_MODEL_NAME || "gpt-3.5-turbo"}\n`);

    // 使用模型进行简单对话
    console.log("💬 提问: 请介绍一下四川省的特色美食\n");

    const response = await model.invoke([
      {
        role: "user",
        content: "请介绍一下四川省的特色美食"
      }
    ]);

    console.log("🤖 模型回答:");
    console.log(response.content);
    console.log("\n");

  } catch (error) {
    console.error("❌ 发生错误:", error.message);
  }
}

// 运行示例
example1();

