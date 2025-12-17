import { ChatOpenAI } from "@langchain/openai";
// import { OpenAI } from "@langchain/openai";
import dotenv from "dotenv";

dotenv.config();

async function exampleNonChatModel() {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error("❌ 请设置 OPENAI_API_KEY 环境变量");
      return;
    }
    const model = new ChatOpenAI({
      modelName: process.env.OPENAI_MODEL_NAME || "gpt-3.5-turbo",
      temperature: 0.7,
      apiKey: process.env.OPENAI_API_KEY,
    });
    if (process.env.OPENAI_BASE_URL) {
      model.baseURL = process.env.OPENAI_BASE_URL;
    }

    const messageList = [
      {
        role: "user",
        content: "请介绍一下陕西省的特色美食"
      }
    ]
    const response = await model.invoke(messageList);

    console.log("🧾 模型输出:");
    console.log(response);
    console.log(typeof response.content);
    console.log("\n");
  } catch (error) {
    console.error("❌ 发生错误:", error.message);
  }
}

// 运行示例
exampleNonChatModel();


