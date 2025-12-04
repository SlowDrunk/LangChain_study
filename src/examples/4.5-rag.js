/**
 * 4.5 RAG检索生成示例
 * 演示如何使用 RAG (Retrieval-Augmented Generation) 检索增强生成
 * 使用 Faiss 作为向量存储
 * RAG = 向量存储检索 + 大模型生成
 * 本示例中：大模型仍使用 OpenAI Chat 模型，嵌入模型改为本地 HuggingFace Transformers
 */
import { ChatOpenAI } from "@langchain/openai";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/hf_transformers";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { convertToTextDocuments } from "../data/chinese-food-data.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

async function example5() {
  console.log("=== 示例 4.5: RAG检索生成（使用 Faiss）===\n");

  try {
    // 检查 OpenAI API Key（用于 Chat 模型）
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

    // 2. 获取嵌入模型（使用本地 HuggingFace Transformers）
    const hfEmbeddingModel =
      process.env.HF_EMBEDDING_MODEL || "Xenova/all-MiniLM-L6-v2";

    const embeddings = new HuggingFaceTransformersEmbeddings({
      model: hfEmbeddingModel,
    });

    // 3. 创建或加载 Faiss 向量存储
    const faissIndexPath = path.join(__dirname, "../../faiss_index_rag");
    let vectorStore;

    // 检查是否已有保存的索引
    if (fs.existsSync(faissIndexPath)) {
      console.log("📂 发现已存在的向量索引，正在加载...\n");
      vectorStore = await FaissStore.load(faissIndexPath, embeddings);
      console.log("✅ 已从磁盘加载向量存储\n");
    } else {
      console.log("📚 正在创建 Faiss 向量存储并加载文档...\n");
      
      const documents = convertToTextDocuments();
      vectorStore = await FaissStore.fromDocuments(
        documents,
        embeddings
      );

      console.log(`✅ Faiss 向量存储已创建，包含 ${documents.length} 条文档\n`);
      
      // 保存向量存储到磁盘
      console.log(`💾 保存向量索引到: ${faissIndexPath}\n`);
      await vectorStore.save(faissIndexPath);
      console.log("✅ 向量索引已保存\n");
    }

    // 4. 创建检索器
    const retriever = vectorStore.asRetriever({
      k: 3  // 检索最相似的3条文档
    });

    console.log("✅ 检索器已创建\n");

    // 5. 创建 RAG 提示词模板
    // 这个模板包含：上下文（从向量存储检索到的）和用户问题
    const promptTemplate = ChatPromptTemplate.fromMessages([
      [
        "system",
        `你是一个中国美食专家。根据以下上下文信息回答问题。
如果上下文中没有相关信息，可以结合你的知识回答，但要说明信息来源。

上下文信息：
{context}`
      ],
      ["human", "{question}"]
    ]);

    console.log("✅ RAG 提示词模板已创建\n");

    // 6. 创建 RAG 链
    // 链的流程：检索 -> 格式化上下文 -> 提示词 -> 模型生成
    console.log("🔗 创建 RAG 链（检索 + 生成）...\n");

    const ragChain = async (question) => {
      // 步骤1: 从 Faiss 向量存储检索相关文档
      console.log(`🔍 正在从 Faiss 检索与 "${question}" 相关的文档...\n`);
      const docs = await retriever.invoke(question);
      
      console.log(`✅ 检索到 ${docs.length} 条相关文档\n`);
      
      // 步骤2: 将检索到的文档合并为上下文
      const context = docs.map((doc) => doc.pageContent).join("\n\n");
      
      console.log("📄 检索到的上下文:");
      console.log(context.substring(0, 200) + "...\n");

      // 步骤3: 使用上下文和问题调用模型
      const chain = promptTemplate.pipe(model);
      
      console.log("🤖 正在生成回答...\n");
      
      const response = await chain.invoke({
        context: context,
        question: question
      });

      return response.content;
    };

    // 7. 使用 RAG 链回答问题
    console.log("=" .repeat(50));
    console.log("📝 测试查询 1: 四川省有哪些特色美食？");
    console.log("=" .repeat(50) + "\n");

    const answer1 = await ragChain("四川省有哪些特色美食？");
    
    console.log("💬 RAG 回答:");
    console.log(answer1);
    console.log("\n");

    // 8. 再次测试
    console.log("=" .repeat(50));
    console.log("📝 测试查询 2: 广东省和四川省的美食有什么区别？");
    console.log("=" .repeat(50) + "\n");

    const answer2 = await ragChain("广东省和四川省的美食有什么区别？");
    
    console.log("💬 RAG 回答:");
    console.log(answer2);
    console.log("\n");

    console.log("✅ RAG 检索生成示例完成！");
    console.log("\n💡 说明:");
    console.log("RAG 的优势在于：");
    console.log("1. 能够从 Faiss 向量存储中检索相关信息");
    console.log("2. 将检索到的信息作为上下文提供给模型");
    console.log("3. 模型基于上下文生成更准确的回答");
    console.log("4. Faiss 提供高性能的向量搜索，速度快");
    console.log("5. 向量索引已保存，下次运行可以直接加载，无需重新创建");

  } catch (error) {
    console.error("❌ 发生错误:", error.message);
    if (error.message.includes("faiss") || error.message.includes("FAISS")) {
      console.error("\n💡 提示: 可能需要安装 faiss-node 包");
      console.error("运行: npm install faiss-node");
    }
    console.error(error.stack);
  }
}

// 运行示例
example5();
