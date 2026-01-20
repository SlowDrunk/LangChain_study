/**
 * 4.2.2 语义相似度示例选择器（SemanticSimilarityExampleSelector）示例
 * 演示如何使用 SemanticSimilarityExampleSelector 根据语义相似度动态选择最相关的示例
 * 
 * 核心概念：
 * - 使用嵌入模型将文本转换为向量
 * - 使用向量存储进行相似度搜索
 * - 根据输入与示例的语义相似度选择最相关的示例
 * - 不同查询会选择不同的示例（基于语义相似度）
 */

import { ChatOpenAI } from "@langchain/openai";
import {
  PromptTemplate,
  FewShotPromptTemplate,
  
} from "@langchain/core/prompts";
import {
  SemanticSimilarityExampleSelector
} from "@langchain/core/example_selectors";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/hf_transformers";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { HumanMessage } from "@langchain/core/messages";
import dotenv from "dotenv";

dotenv.config();

async function semanticSimilaritySelectorDemo() {
  console.log("=== 示例 4.2.2: 语义相似度示例选择器（SemanticSimilarityExampleSelector）===\n");

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
      },
      {
        province: "新疆",
        name: "阿依古丽",
        food: "大盘鸡",
        description: "新疆的阿依古丽爱吃大盘鸡，鸡肉鲜嫩，配土豆和宽面，香辣浓郁，非常好吃。"
      },
      {
        province: "云南",
        name: "小芳",
        food: "过桥米线",
        description: "云南的小芳爱吃过桥米线，汤鲜味美，配菜丰富，是云南的特色小吃，非常好吃。"
      }
    ];

    console.log(`📚 准备 ${allExamples.length} 个示例\n`);

    // 3. 创建嵌入模型（用于将文本转换为向量）
    const hfEmbeddingModel =
      process.env.HF_EMBEDDING_MODEL || "Xenova/all-MiniLM-L6-v2";

    console.log("🔄 正在加载嵌入模型...");
    const embeddings = new HuggingFaceTransformersEmbeddings({
      model: hfEmbeddingModel,
    });
    console.log(`✅ 嵌入模型已加载: ${hfEmbeddingModel}\n`);

    // 4. 创建示例模板（用于格式化每个示例）
    const examplePrompt = new PromptTemplate({
      inputVariables: ["province", "name", "food", "description"],
      template: "省份：{province}\n姓名：{name}\n美食：{food}\n介绍：{description}"
    });

    // 5. 创建 SemanticSimilarityExampleSelector
    // 它会将示例转换为向量并存储，然后根据查询的语义相似度选择最相关的示例
    console.log("🔄 正在创建语义相似度示例选择器...");
    console.log("   - 将示例转换为向量...");
    console.log("   - 构建向量索引...\n");

    const exampleSelector = await SemanticSimilarityExampleSelector.fromExamples(
      allExamples,  // 所有可用的示例
      embeddings,    // 嵌入模型
      FaissStore,   // 向量存储类（FaissStore 是高性能的本地向量数据库，项目中已在使用）
      {
        k: 3,  // 选择最相似的 3 个示例
        // inputKeys: ["province", "name", "food"],  // 可选：指定用于相似度搜索的键
      }
    );

    console.log("✅ 语义相似度示例选择器已创建");
    console.log(`   - 总示例数：${allExamples.length}`);
    console.log(`   - 向量存储：FaissStore`);
    console.log(`   - 每次选择：最相似的 ${3} 个示例\n`);

    // 6. 创建 FewShotPromptTemplate（使用语义相似度选择器）
    const fewShotPrompt = new FewShotPromptTemplate({
      exampleSelector: exampleSelector,  // 使用语义相似度选择器
      examplePrompt: examplePrompt,
      prefix: "以下是一些中国美食介绍的示例，请按照相同的格式回答：",
      suffix: "现在请你按照上面的格式，介绍一下：\n省份：{province}\n姓名：{name}\n美食：{food}\n介绍：",
      inputVariables: ["province", "name", "food"],
      exampleSeparator: "\n\n---\n\n"  // 示例之间的分隔符
    });

    console.log("✅ FewShotPromptTemplate 已创建（使用 SemanticSimilarityExampleSelector）\n");

    // 7. 测试场景 1: 查询四川相关的美食（应该会选择四川相关的示例）
    console.log("=".repeat(60));
    console.log("📝 测试场景 1: 查询四川相关美食");
    console.log("=".repeat(60));
    
    const query1 = {
      province: "四川",
      name: "小明",
      food: "麻婆豆腐"
    };

    console.log(`\n输入参数：`);
    console.log(`  省份：${query1.province}`);
    console.log(`  姓名：${query1.name}`);
    console.log(`  美食：${query1.food}\n`);

    // 选择最相似的示例
    const selectedExamples1 = await exampleSelector.selectExamples(query1);
    console.log(`✅ 根据语义相似度选择了 ${selectedExamples1.length} 个最相关的示例：`);
    selectedExamples1.forEach((example, index) => {
      console.log(`\n   ${index + 1}. 省份：${example.province}，美食：${example.food}`);
    });
    console.log();

    // 格式化提示词
    const prompt1 = await fewShotPrompt.format(query1);
    
    console.log("📄 格式化后的提示词：");
    console.log("-".repeat(60));
    console.log(prompt1);
    console.log("-".repeat(60));

    // 调用模型
    console.log("\n🤖 正在调用模型生成回答...\n");
    const response1 = await model.invoke([new HumanMessage(prompt1)]);
    console.log("💬 模型回答：");
    console.log(response1.content);
    console.log("\n");

    // 8. 测试场景 2: 查询广东相关的美食（应该会选择广东相关的示例）
    console.log("=".repeat(60));
    console.log("📝 测试场景 2: 查询广东相关美食");
    console.log("=".repeat(60));
    
    const query2 = {
      province: "广东",
      name: "小红",
      food: "白切鸡"
    };

    console.log(`\n输入参数：`);
    console.log(`  省份：${query2.province}`);
    console.log(`  姓名：${query2.name}`);
    console.log(`  美食：${query2.food}\n`);

    // 选择最相似的示例
    const selectedExamples2 = await exampleSelector.selectExamples(query2);
    console.log(`✅ 根据语义相似度选择了 ${selectedExamples2.length} 个最相关的示例：`);
    selectedExamples2.forEach((example, index) => {
      console.log(`\n   ${index + 1}. 省份：${example.province}，美食：${example.food}`);
    });
    console.log();

    // 格式化提示词
    const prompt2 = await fewShotPrompt.format(query2);
    
    console.log("📄 格式化后的提示词：");
    console.log("-".repeat(60));
    console.log(prompt2);
    console.log("-".repeat(60));

    // 调用模型
    console.log("\n🤖 正在调用模型生成回答...\n");
    const response2 = await model.invoke([new HumanMessage(prompt2)]);
    console.log("💬 模型回答：");
    console.log(response2.content);
    console.log("\n");

    // 9. 测试场景 3: 查询面食相关的美食（应该会选择面食相关的示例）
    console.log("=".repeat(60));
    console.log("📝 测试场景 3: 查询面食相关美食");
    console.log("=".repeat(60));
    
    const query3 = {
      province: "陕西",
      name: "小刚",
      food: "肉夹馍"
    };

    console.log(`\n输入参数：`);
    console.log(`  省份：${query3.province}`);
    console.log(`  姓名：${query3.name}`);
    console.log(`  美食：${query3.food}\n`);

    // 选择最相似的示例
    const selectedExamples3 = await exampleSelector.selectExamples(query3);
    console.log(`✅ 根据语义相似度选择了 ${selectedExamples3.length} 个最相关的示例：`);
    selectedExamples3.forEach((example, index) => {
      console.log(`\n   ${index + 1}. 省份：${example.province}，美食：${example.food}`);
    });
    console.log();

    // 格式化提示词
    const prompt3 = await fewShotPrompt.format(query3);
    
    console.log("📄 格式化后的提示词：");
    console.log("-".repeat(60));
    console.log(prompt3);
    console.log("-".repeat(60));

    // 调用模型
    console.log("\n🤖 正在调用模型生成回答...\n");
    const response3 = await model.invoke([new HumanMessage(prompt3)]);
    console.log("💬 模型回答：");
    console.log(response3.content);
    console.log("\n");

    // 10. 对比总结
    console.log("=".repeat(60));
    console.log("📊 对比总结");
    console.log("=".repeat(60));
    console.log(`\n💡 SemanticSimilarityExampleSelector 的工作原理：`);
    console.log(`   1. 将所有示例转换为向量并存储在向量数据库中`);
    console.log(`   2. 当有查询时，将查询也转换为向量`);
    console.log(`   3. 在向量数据库中进行相似度搜索`);
    console.log(`   4. 选择最相似的 k 个示例（这里 k=${3}）`);
    console.log(`\n✨ 优势：`);
    console.log(`   - 不同查询会自动选择最相关的示例`);
    console.log(`   - 基于语义理解，不仅仅是关键词匹配`);
    console.log(`   - 可以处理同义词和相似概念`);
    console.log(`\n📝 观察：`);
    console.log(`   - 查询"四川"时，选择了四川相关的示例`);
    console.log(`   - 查询"广东"时，选择了广东相关的示例`);
    console.log(`   - 查询"面食"时，选择了面食相关的示例（如过桥米线、大盘鸡配宽面）`);
    console.log(`\n`);

  } catch (error) {
    console.error("❌ 发生错误:", error.message);
    console.error(error.stack);
  }
}

// 运行示例
semanticSimilaritySelectorDemo();

