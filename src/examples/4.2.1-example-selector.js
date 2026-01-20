/**
 * 4.2.1 示例选择器（Example Selector）示例
 * 演示如何使用 LengthBasedExampleSelector 根据输入长度动态选择示例
 * 
 * 核心概念：
 * - 短输入 → 可以选择更多示例
 * - 长输入 → 只能选择少量示例（避免超出 token 限制）
 */

import { ChatOpenAI } from "@langchain/openai";
import {
  PromptTemplate,
  FewShotPromptTemplate
} from "@langchain/core/prompts";
import {
  LengthBasedExampleSelector
} from "@langchain/core/example_selectors";
import { HumanMessage } from "@langchain/core/messages";
import dotenv from "dotenv";

dotenv.config();

async function exampleSelectorDemo() {
  console.log("=== 示例 4.2.1: 示例选择器（LengthBasedExampleSelector）===\n");

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

    // 2. 准备示例数据（中国美食介绍）
    const allExamples = [
      {
        province: "四川",
        name: "张三",
        food: "火锅",
        description: "四川的张三爱吃火锅，火锅是麻辣鲜香的，非常好吃，是四川最具代表性的美食。"
      },
      {
        province: "广东",
        name: "李四",
        food: "煲仔饭",
        description: "广东的李四爱吃煲仔饭，煲仔饭是米饭和食材同煲，底部有焦香锅巴，非常好吃。"
      },
      {
        province: "湖南",
        name: "王五",
        food: "剁椒鱼头",
        description: "湖南的王五爱吃剁椒鱼头，鱼头鲜嫩，配上剁椒的香辣，味道层次丰富，非常好吃。"
      },
      {
        province: "山东",
        name: "赵六",
        food: "煎饼卷大葱",
        description: "山东的赵六爱吃煎饼卷大葱，煎饼香脆，大葱辛辣，是山东的传统美食，非常好吃。"
      },
      {
        province: "江苏",
        name: "孙七",
        food: "盐水鸭",
        description: "江苏的孙七爱吃盐水鸭，鸭肉鲜嫩，咸香适中，是南京的特色美食，非常好吃。"
      },
      {
        province: "浙江",
        name: "周八",
        food: "西湖醋鱼",
        description: "浙江的周八爱吃西湖醋鱼，鱼肉鲜嫩，酸甜可口，是杭州的传统名菜，非常好吃。"
      }
    ];

    // 3. 创建示例模板（用于格式化每个示例）
    const examplePrompt = new PromptTemplate({
      inputVariables: ["province", "name", "food", "description"],
      template: "省份：{province}\n姓名：{name}\n美食：{food}\n介绍：{description}"
    });

    // 4. 创建 LengthBasedExampleSelector
    const exampleSelector = await LengthBasedExampleSelector.fromExamples(
      allExamples,  // 所有可用的示例
      {
        examplePrompt: examplePrompt,
        maxLength: 200,  // 最大长度限制（字符数）
      }
    );
    // 5. 创建 FewShotPromptTemplate（使用选择器而不是固定示例）
    const fewShotPrompt = new FewShotPromptTemplate({
      exampleSelector: exampleSelector,  // 使用选择器
      examplePrompt: examplePrompt,
      prefix: "以下是一些中国美食介绍的示例，请按照相同的格式回答：",
      suffix: "现在请你按照上面的格式，介绍一下：\n省份：{province}\n姓名：{name}\n美食：{food}\n介绍：",
      inputVariables: ["province", "name", "food"],
      exampleSeparator: "\n\n---\n\n"  // 示例之间的分隔符
    });    
    const shortInput = {
      province: "北京",
      name: "小明",
      food: "烤鸭"
    };
    // 格式化提示词
    const shortPrompt = await fewShotPrompt.format(shortInput);
    // 调用模型
    console.log("\n🤖 正在调用模型生成回答...\n");
    const shortResponse = await model.invoke([new HumanMessage(shortPrompt)]);
    console.log("💬 模型回答：");
    console.log(shortResponse.content);
    console.log("\n");
  } catch (error) {
    console.error("❌ 发生错误:", error.message);
    console.error(error.stack);
  }
}

// 运行示例
exampleSelectorDemo();

