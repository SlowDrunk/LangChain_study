// 导入模块
import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage, AIMessage } from 'langchain'
import { ChatPromptTemplate } from "@langchain/core/prompts";
import dotenv from "dotenv";

// 加载环境变量
dotenv.config();

async function helloWorld() {
  try {
    // 构建模型配置对象
    const modelConfig = {
      modelName: process.env.OPENAI_MODEL_NAME || "gpt-3.5-turbo",
      temperature: process.env.OPENAI_TEMPERATURE ? parseFloat(process.env.OPENAI_TEMPERATURE) : 0.7,
      apiKey: process.env.OPENAI_API_KEY,
    };
    // 创建 OpenAI 聊天模型实例
    const model = new ChatOpenAI(modelConfig);

    const messages1 = [
      new SystemMessage({
        content: '我是一个人工智能助手，我的名字叫贾维斯'
      }),
      new HumanMessage({
        content: '请简单介绍一下你自己！'
      })
    ]
    const messages2 = [
      new SystemMessage({
        content: '我是一个美食专家，我叫柯南'
      }),
      new HumanMessage({
        content: '请简单介绍一下蛋炒饭的做法！'
      })
    ]
    const messages3 = [
      new SystemMessage({
        content: '我是一个音乐家，我的名字叫汤姆'
      }),
      new HumanMessage({
        content: '请简单介绍一下贝多芬的《月光》！'
      })
    ]
    const messages = [messages1, messages2, messages3]
    const response = await model.batch(messages)
    response.forEach((res,index) => {
      console.log(res.content,'==================>res',index)
    })
  } catch (error) {
    console.error("❌ 发生错误:", error.message);
    if (error.message.includes("API key")) {
      console.log("\n💡 提示: 请检查你的 OPENAI_API_KEY 是否正确配置");
    }
  }
}

// 运行程序
helloWorld();
