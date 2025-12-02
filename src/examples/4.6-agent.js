/**
 * 4.6 使用Agent示例
 * 演示如何使用 Agent 来智能选择工具完成任务
 * 使用 Faiss 作为向量存储
 */
import { ChatOpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { convertToTextDocuments } from "../data/chinese-food-data.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

async function example6() {
  console.log("=== 示例 4.6: 使用Agent（使用 Faiss）===\n");

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

    console.log("✅ 大模型已创建\n");

    // 2. 创建或加载 Faiss 向量存储（用于工具1）
    const faissIndexPath = path.join(__dirname, "../../faiss_index_agent");
    let vectorStore;
    
    const embeddingModelName = process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-ada-002";
    
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: embeddingModelName,
      configuration: process.env.OPENAI_BASE_URL ? {
        baseURL: process.env.OPENAI_BASE_URL
      } : undefined
    });

    // 检查是否已有保存的索引
    if (fs.existsSync(faissIndexPath)) {
      console.log("📂 发现已存在的向量索引，正在加载...\n");
      vectorStore = await FaissStore.load(faissIndexPath, embeddings);
      console.log("✅ 已从磁盘加载向量存储\n");
    } else {
      console.log("📚 正在创建 Faiss 向量存储...\n");
      
      const documents = convertToTextDocuments();
      vectorStore = await FaissStore.fromDocuments(
        documents,
        embeddings
      );
      
      console.log(`✅ Faiss 向量存储已创建，包含 ${documents.length} 条文档\n`);
      
      // 保存向量存储到磁盘
      await vectorStore.save(faissIndexPath);
      console.log("✅ 向量索引已保存\n");
    }
    
    const retriever = vectorStore.asRetriever({ k: 3 });

    // 3. 定义工具（Tools）
    // Agent 可以使用这些工具来完成任务

    // 工具1: 搜索省份美食（使用 Faiss 向量存储）
    const searchFoodTool = new DynamicStructuredTool({
      name: "search_province_food",
      description: "根据省份名称搜索该省份的特色美食信息。输入省份名称，返回该省份的特色美食列表。使用 Faiss 向量数据库进行检索。",
      schema: z.object({
        province: z.string().describe("省份名称，例如：四川省、广东省")
      }),
      func: async ({ province }) => {
        console.log(`🔧 [工具调用] search_province_food: ${province}\n`);
        const docs = await retriever.invoke(`${province}特色美食`);
        return docs.map(doc => doc.pageContent).join("\n\n");
      }
    });

    // 工具2: 比较两个省份的美食
    const compareFoodTool = new DynamicStructuredTool({
      name: "compare_provinces_food",
      description: "比较两个省份的特色美食，找出它们的相同点和不同点。使用 Faiss 向量数据库检索信息。",
      schema: z.object({
        province1: z.string().describe("第一个省份名称"),
        province2: z.string().describe("第二个省份名称")
      }),
      func: async ({ province1, province2 }) => {
        console.log(`🔧 [工具调用] compare_provinces_food: ${province1} vs ${province2}\n`);
        const docs1 = await retriever.invoke(`${province1}特色美食`);
        const docs2 = await retriever.invoke(`${province2}特色美食`);
        const food1 = docs1.map(doc => doc.pageContent).join("\n");
        const food2 = docs2.map(doc => doc.pageContent).join("\n");
        return `省份1(${province1})的美食：\n${food1}\n\n省份2(${province2})的美食：\n${food2}`;
      }
    });

    // 工具3: 获取所有支持的省份列表
    const listProvincesTool = new DynamicStructuredTool({
      name: "list_provinces",
      description: "获取所有支持查询美食的省份列表。",
      schema: z.object({
        // 这个工具不需要参数
      }),
      func: async () => {
        console.log(`🔧 [工具调用] list_provinces\n`);
        const documents = convertToTextDocuments();
        const provinces = [...new Set(documents.map(doc => doc.metadata.province))];
        return `支持的省份列表：${provinces.join("、")}`;
      }
    });

    // 将所有工具组合成工具数组
    const tools = [searchFoodTool, compareFoodTool, listProvincesTool];

    console.log("✅ 已创建 3 个工具:");
    console.log("   1. search_province_food - 搜索省份美食（使用 Faiss）");
    console.log("   2. compare_provinces_food - 比较两个省份的美食（使用 Faiss）");
    console.log("   3. list_provinces - 获取省份列表\n");

    // 4. 创建 Agent 提示词模板
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", `你是一个智能的中国美食助手。你可以使用以下工具来帮助用户：

可用工具：
{tools}

工具使用说明：
- 使用 search_province_food 来查询特定省份的美食（从 Faiss 向量数据库检索）
- 使用 compare_provinces_food 来比较两个省份的美食（从 Faiss 向量数据库检索）
- 使用 list_provinces 来获取所有支持的省份列表

请根据用户的问题，智能地选择合适的工具来完成任务。如果用户的问题需要多个步骤，可以使用多个工具。`],
      ["placeholder", "{chat_history}"],
      ["human", "{input}"],
      ["placeholder", "{agent_scratchpad}"]
    ]);

    console.log("✅ Agent 提示词模板已创建\n");

    // 5. 创建 Agent
    const agent = await createToolCallingAgent({
      llm: model,
      tools: tools,
      prompt: prompt
    });

    console.log("✅ Agent 已创建\n");

    // 6. 创建 Agent 执行器
    const agentExecutor = new AgentExecutor({
      agent: agent,
      tools: tools,
      verbose: true  // 显示详细的执行过程
    });

    console.log("✅ Agent 执行器已创建\n");
    console.log("=" .repeat(60));
    console.log("🚀 开始使用 Agent 回答问题（使用 Faiss 向量存储）");
    console.log("=" .repeat(60) + "\n");

    // 7. 使用 Agent 执行任务
    // 任务1: 简单查询
    console.log("📝 任务 1: 查询四川省的特色美食\n");
    
    const result1 = await agentExecutor.invoke({
      input: "四川省有哪些特色美食？"
    });

    console.log("\n💬 Agent 回答:");
    console.log(result1.output);
    console.log("\n" + "=" .repeat(60) + "\n");

    // 任务2: 需要多个工具的任务
    console.log("📝 任务 2: 比较两个省份的美食\n");
    
    const result2 = await agentExecutor.invoke({
      input: "请比较一下四川省和广东省的美食特色有什么不同？"
    });

    console.log("\n💬 Agent 回答:");
    console.log(result2.output);
    console.log("\n" + "=" .repeat(60) + "\n");

    // 任务3: 复杂任务
    console.log("📝 任务 3: 获取省份列表并查询\n");
    
    const result3 = await agentExecutor.invoke({
      input: "告诉我都有哪些省份可以查询，然后查询一下陕西省的美食"
    });

    console.log("\n💬 Agent 回答:");
    console.log(result3.output);
  } catch (error) {
    console.error("❌ 发生错误:", error.message);
    if (error.message.includes("faiss") || error.message.includes("FAISS")) {
      console.error("\n💡 提示: 可能需要安装 faiss-node 包");
      console.error("运行: npm install faiss-node");
    }
    if (error.message.includes("zod")) {
      console.log("\n💡 提示: 需要安装 zod 包: npm install zod");
    }
    console.error(error.stack);
  }
}

// 运行示例
example6();
