/**
 * 4.2 使用模板提示词示例
 * 演示如何使用提示词模板来格式化输入
 */
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import dotenv from "dotenv";

dotenv.config();

async function example2() {
  console.log("=== 示例 4.2: 使用模板提示词 ===\n");

  try {
    // 检查 API Key
    if (!process.env.OPENAI_API_KEY) {
      console.error("❌ 请设置 OPENAI_API_KEY 环境变量");
      return;
    }

    // 1. 获取大模型
    const model = new ChatOpenAI({
      modelName: process.env.OPENAI_MODEL_NAME || "gpt-3.5-turbo",
      temperature: 0.7,
      apiKey: process.env.OPENAI_API_KEY,
    });

    if (process.env.OPENAI_BASE_URL) {
      model.baseURL = process.env.OPENAI_BASE_URL;
    }

    // 2. 创建模板提示词
    // ChatPromptTemplate 用于创建可重复使用的提示模板
    const promptTemplate = ChatPromptTemplate.fromMessages([
      ["system", "你是一个中国美食专家，熟悉各个省份的特色美食。"],
      ["human", "请详细介绍{province}的特色美食，包括美食名称和简要描述。"]
    ]);

    console.log("✅ 提示词模板已创建");
    console.log("📋 模板内容: 请详细介绍{province}的特色美食\n");

    // 3. 使用模板格式化提示词
    const formattedPrompt = await promptTemplate.formatMessages({
      province: "四川省"
    });

    console.log("💬 格式化后的提示词:");
    console.log(JSON.stringify(formattedPrompt, null, 2));
    console.log("\n");

    // 4. 将模板和模型组合成链
    const chain = promptTemplate.pipe(model);

    console.log("🚀 开始调用模型...\n");

    // 5. 使用链进行调用
    const response = await chain.invoke({
      province: "四川省"
    });

    console.log("🤖 模型回答:");
    console.log(response.content);
    console.log("\n");

    // 可以重复使用模板查询其他省份
    console.log("🔄 使用同一个模板查询其他省份:\n");
    const response2 = await chain.invoke({
      province: "广东省"
    });

    console.log("🤖 模型回答:");
    console.log(response2.content);

  } catch (error) {
    console.error("❌ 发生错误:", error.message);
  }
}

// 运行示例
example2();

