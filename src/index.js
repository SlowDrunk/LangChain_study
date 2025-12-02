// 导入模块
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import dotenv from "dotenv";

// 加载环境变量
dotenv.config();

/**
 * LangChain Hello World 示例
 * 这是一个简单的 LangChain 程序，演示如何使用 LangChain 与 OpenAI 进行对话
 * 
 * 要求: Node.js 18+ 版本
 */
async function helloWorld() {
  try {
    // 检查 API Key 是否配置
    if (!process.env.OPENAI_API_KEY) {
      console.error("❌ 错误: 请设置 OPENAI_API_KEY 环境变量");
      console.log("💡 提示: 在项目根目录创建 .env 文件，并添加: OPENAI_API_KEY=your_api_key_here");
      return;
    }

    console.log("🚀 LangChain Hello World 程序启动...\n");

    // 构建模型配置对象
    const modelConfig = {
      modelName: process.env.OPENAI_MODEL_NAME || "gpt-3.5-turbo",
      temperature: process.env.OPENAI_TEMPERATURE ? parseFloat(process.env.OPENAI_TEMPERATURE) : 0.7,
      apiKey: process.env.OPENAI_API_KEY,
    };

    // 如果配置了 baseURL，则添加到配置中
    if (process.env.OPENAI_BASE_URL) {
      modelConfig.baseURL = process.env.OPENAI_BASE_URL;
    }

    // 显示配置信息
    console.log("📋 模型配置:");
    console.log(`   模型名称: ${modelConfig.modelName}`);
    if (modelConfig.baseURL) {
      console.log(`   Base URL: ${modelConfig.baseURL}`);
    }
    console.log("");

    // 创建 OpenAI 聊天模型实例
    const model = new ChatOpenAI(modelConfig);

    // 创建提示模板
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", "你是一个友好的助手，会使用中文回答问题。"],
      ["human", "{input}"],
    ]);

    // 将提示模板和模型组合成链
    const chain = prompt.pipe(model);

    // 调用链
    const input = "请用一句话介绍你自己，然后说 'Hello, LangChain!'";
    console.log(`📝 输入: ${input}\n`);

    const response = await chain.invoke({
      input: input,
    });

    console.log("🤖 AI 响应:");
    console.log(response.content);
    console.log("\n✅ Hello World 程序执行完成！");

  } catch (error) {
    console.error("❌ 发生错误:", error.message);
    if (error.message.includes("API key")) {
      console.log("\n💡 提示: 请检查你的 OPENAI_API_KEY 是否正确配置");
    }
  }
}

// 运行程序
helloWorld();
