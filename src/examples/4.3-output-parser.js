/**
 * 4.3 使用输出解析器示例
 * 演示如何使用输出解析器将模型的输出转换为结构化数据
 */
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

async function example3() {
  console.log("=== 示例 4.3: 使用输出解析器 ===\n");

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

    // 2. 定义输出结构（使用 zod schema）
    // 这里定义我们期望的输出格式：省份名称和美食列表
    const outputSchema = z.object({
      province: z.string().describe("省份名称"),
      foods: z.array(
        z.object({
          name: z.string().describe("美食名称"),
          description: z.string().describe("美食描述")
        })
      ).describe("该省份的特色美食列表")
    });

    // 3. 创建输出解析器
    const parser = StructuredOutputParser.fromZodSchema(outputSchema);

    console.log("✅ 输出解析器已创建");
    console.log("📋 期望的输出格式: JSON对象，包含省份名称和美食列表\n");

    // 4. 创建提示词模板，包含输出格式说明
    const promptTemplate = ChatPromptTemplate.fromMessages([
      ["system", "你是一个中国美食专家。\n{format_instructions}"],
      ["human", "请详细介绍{province}的特色美食。"]
    ]);

    // 5. 将解析器的格式说明添加到提示词中
    const promptWithParser = await promptTemplate.partial({
      format_instructions: parser.getFormatInstructions()
    });

    console.log("💬 提示词模板（包含格式说明）:");
    console.log(parser.getFormatInstructions());
    console.log("\n");

    // 6. 组合成链：提示词 -> 模型 -> 解析器
    const chain = promptWithParser.pipe(model).pipe(parser);

    console.log("🚀 开始调用模型并解析输出...\n");

    // 7. 调用链并获取解析后的结构化数据
    const result = await chain.invoke({
      province: "四川省"
    });

    console.log("✅ 解析后的结构化数据:");
    console.log(JSON.stringify(result, null, 2));
    console.log("\n");

    // 8. 使用解析后的数据
    console.log(`📍 省份: ${result.province}`);
    console.log(`🍜 特色美食数量: ${result.foods.length} 种\n`);
    
    result.foods.forEach((food, index) => {
      console.log(`${index + 1}. ${food.name}`);
      console.log(`   ${food.description}\n`);
    });

  } catch (error) {
    console.error("❌ 发生错误:", error.message);
    if (error.message.includes("zod")) {
      console.log("\n💡 提示: 需要安装 zod 包: npm install zod");
    }
  }
}

// 运行示例
example3();

