/**
 * 4.4 使用向量存储示例
 * 演示如何使用 Faiss 向量数据库来保存和检索文档
 * 本示例使用本地 HuggingFace Transformers 嵌入模型（不依赖在线 API）
 */
import "../utils/polyfill-stream.js";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/hf_transformers";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { convertToTextDocuments } from "../data/chinese-food-data.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

async function example4() {
  console.log("=== 示例 4.4: 使用向量存储（Faiss）===\n");

  try {
    // 1. 获取嵌入模型（用于将文本转换为向量）
    // 这里使用本地 HuggingFace Transformers 模型（基于 @xenova/transformers）
    const hfEmbeddingModel =
      process.env.HF_EMBEDDING_MODEL || "Xenova/all-MiniLM-L6-v2";

    const embeddings = new HuggingFaceTransformersEmbeddings({
      model: hfEmbeddingModel,
    });

    console.log("✅ HuggingFace 嵌入模型已创建");
    console.log(`📋 使用模型: ${hfEmbeddingModel}`);
    console.log("📋 用途: 将文本转换为向量（数字数组）\n");

    // 2. 准备文档数据
    const documents = convertToTextDocuments();
    console.log(`📚 准备存储 ${documents.length} 条文档\n`);

    // 显示前几条文档示例
    console.log("📄 文档示例:");
    documents.slice(0, 2).forEach((doc, index) => {
      console.log(`${index + 1}. ${doc.pageContent}`);
      console.log(`   元数据: ${JSON.stringify(doc.metadata)}\n`);
    });

    // 3. 创建 Faiss 向量存储
    // Faiss 是 Facebook AI Similarity Search，高性能向量数据库
    const faissIndexPath = path.join(__dirname, "../../faiss_index");

    console.log("🔄 正在将文档转换为向量并存储到 Faiss...\n");

    // 从文档创建向量存储
    const vectorStore = await FaissStore.fromDocuments(
      documents,
      embeddings
    );

    console.log("✅ Faiss 向量存储已创建");
    console.log(embeddings,'=================>存储文本的emdeddings')
    console.log(`📊 已存储 ${documents.length} 条文档的向量表示\n`);

    // 保存向量存储到磁盘（可选，用于持久化）
    console.log(`💾 保存向量索引到: ${faissIndexPath}\n`);
    await vectorStore.save(faissIndexPath);
    console.log("✅ 向量索引已保存到磁盘\n");

    // 4. 使用向量存储进行相似性搜索
    console.log("🔍 开始相似性搜索...\n");

    const query = "四川省有哪些特色美食？";
    console.log(`💬 查询: ${query}\n`);

    // 搜索最相似的前3条文档
    const results = await vectorStore.similaritySearch(query, 3);

    console.log(`✅ 找到 ${results.length} 条相关文档:\n`);

    results.forEach((result, index) => {
      console.log(`${index + 1}. 相似度匹配结果:`);
      console.log(`   内容: ${result.pageContent}`);
      console.log(`   元数据: ${JSON.stringify(result.metadata)}\n`);
    });

    // 5. 使用检索器（Retriever）
    console.log("🔧 创建检索器...\n");

    const retriever = vectorStore.asRetriever({
      k: 2  // 返回最相似的2条结果
    });

    const retrievedDocs = await retriever.invoke("广东省美食");

    console.log("📥 通过检索器获取的文档:");
    retrievedDocs.forEach((doc, index) => {
      console.log(`${index + 1}. ${doc.pageContent.substring(0, 50)}...\n`);
    });

    // 6. 演示从磁盘加载已保存的向量存储
    console.log("=".repeat(50));
    console.log("📂 演示：从磁盘加载已保存的向量存储\n");

    const loadedVectorStore = await FaissStore.load(faissIndexPath, embeddings);
    console.log("✅ 成功从磁盘加载向量存储\n");

    const loadedResults = await loadedVectorStore.similaritySearch("湖南省美食", 2);
    console.log("📥 从加载的向量存储中检索结果:");
    loadedResults.forEach((doc, index) => {
      console.log(`${index + 1}. ${doc.pageContent.substring(0, 60)}...\n`);
    });

    console.log("\n💡 说明:");
    console.log("Faiss (Facebook AI Similarity Search) 是一个高性能向量数据库，具有以下优势:");
    console.log("1. 高性能：优化的向量搜索算法，速度快");
    console.log("2. 持久化存储：可以保存到磁盘，下次直接加载");
    console.log("3. 本地运行：不需要额外服务，直接在 Node.js 中运行");
    console.log("4. 易于使用：API 简洁，易于集成");
    console.log("5. 适合生产环境：被广泛使用，稳定可靠\n");

  } catch (error) {
    console.error("❌ 发生错误:", error.message);
    if (error.message.includes("404") || error.message.includes("MODEL_NOT_FOUND")) {
      console.error("\n💡 提示: 嵌入模型未找到，可能的原因：");
      console.error("1. 模型名称不正确");
      console.error("2. 自定义 baseURL 不支持该模型");
      console.error("\n解决方案：");
      console.error("在 .env 文件中设置正确的模型名称：");
      console.error("OPENAI_EMBEDDING_MODEL=text-embedding-ada-002");
      console.error("或者如果使用自定义 baseURL，请使用该服务支持的模型名称");
    }
    if (error.message.includes("faiss") || error.message.includes("FAISS")) {
      console.error("\n💡 提示: 可能需要安装 faiss-node 包");
      console.error("运行: npm install faiss-node");
    }
    console.error("\n详细错误:", error.stack);
  }
}

// 运行示例
example4();
