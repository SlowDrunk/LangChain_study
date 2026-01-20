/**
 * 4.2 使用模板提示词示例 - FewShotChatMessagePromptTemplate
 * 演示如何使用 FewShotChatMessagePromptTemplate 创建包含示例的聊天消息模板
 */
import { ChatOpenAI } from "@langchain/openai";
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  FewShotChatMessagePromptTemplate,
  PromptTemplate
} from "@langchain/core/prompts";
import { HumanMessage, SystemMessage, ToolMessage } from "@langchain/core/messages";
import dotenv from "dotenv";

dotenv.config();

async function example2() {
  console.log("=== 示例 4.2: FewShotChatMessagePromptTemplate ===\n");
  try {
    // 检查 API Key
    if (!process.env.OPENAI_API_KEY) {
      console.error("❌ 请设置 OPENAI_API_KEY 环境变量");
      return;
    }
    const modelConfig = {
      modelName: process.env.OPENAI_MODEL_NAME || "gpt-3.5-turbo",
      temperature: process.env.OPENAI_TEMPERATURE ? parseFloat(process.env.OPENAI_TEMPERATURE) : 0.7,
      apiKey: process.env.OPENAI_API_KEY,
    };
    // 创建 OpenAI 聊天模型实例
    const model = new ChatOpenAI(modelConfig);

    const sysMsg = new SystemMessage({
      content: '我是一个人工智能助手，我的名字叫贾维斯'
    })
    const humanMsg1 = new HumanMessage({
      content: '请简单介绍一下你自己！'
    })

    const messages = [
      sysMsg,
      humanMsg1
    ]
    console.log("💡开始流式传输......")
    const response = await model.invoke(messages)
    // for await (const chunk of response) {
    //   console.log(chunk.text)
    // }
    console.log("💡流式传输完成......")


    // console.log("\n💬 模型回答:");
    console.log(response.content);
  } catch (error) {
    console.error("❌ 发生错误:", error.message);
    console.error(error.stack);
  }
}

// 运行示例
example2();
