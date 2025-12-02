/**
 * 简化的内存向量存储实现
 * 用于演示向量存储的基本概念
 */
import { Document } from "@langchain/core/documents";

export class SimpleVectorStore {
  constructor(embeddings) {
    this.embeddings = embeddings;
    this.vectors = []; // 存储向量
    this.documents = []; // 存储对应的文档
  }

  /**
   * 从文档创建向量存储
   */
  static async fromDocuments(documents, embeddings) {
    const store = new SimpleVectorStore(embeddings);
    
    // 为每个文档生成向量
    for (const doc of documents) {
      const vector = await embeddings.embedQuery(doc.pageContent);
      store.vectors.push(vector);
      store.documents.push(doc);
    }
    
    return store;
  }

  /**
   * 计算两个向量的余弦相似度
   */
  cosineSimilarity(vecA, vecB) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * 相似度搜索
   */
  async similaritySearch(query, k = 4) {
    // 将查询转换为向量
    const queryVector = await this.embeddings.embedQuery(query);
    
    // 计算与所有文档的相似度
    const similarities = this.vectors.map((vector, index) => ({
      document: this.documents[index],
      similarity: this.cosineSimilarity(queryVector, vector),
      index: index
    }));
    
    // 按相似度排序并返回前 k 个
    similarities.sort((a, b) => b.similarity - a.similarity);
    
    return similarities.slice(0, k).map(item => item.document);
  }

  /**
   * 创建检索器
   */
  asRetriever(options = {}) {
    const k = options.k || 4;
    
    return {
      invoke: async (query) => {
        return await this.similaritySearch(query, k);
      }
    };
  }
}

