# LangChain 功能示例程序

本目录包含了6个示例程序，每个程序演示 LangChain 的一个核心功能点。所有示例都围绕"询问中国各省份特色美食"这个主题。

**重要更新**: 示例 4.4、4.5、4.6 现在使用 **Faiss** 作为第三方向量数据库！

## 📦 第三方向量数据库设置

### 使用 Faiss（推荐）

示例 4.4、4.5、4.6 使用了 **Faiss (Facebook AI Similarity Search)** 作为向量数据库。Faiss 是一个高性能的本地向量数据库，无需额外服务。

#### 快速开始

```bash
# 1. 安装依赖（已包含在 package.json 中）
npm install

# 2. 直接运行示例即可
node src/examples/4.4-vector-store.js
```

**优势**:
- ✅ 本地运行，无需额外服务
- ✅ 高性能向量搜索
- ✅ 自动持久化存储
- ✅ 简单易用

详细安装说明请查看：[FAISS_SETUP.md](../../FAISS_SETUP.md)

---

## 示例列表

### 4.1 获取大模型 (`4.1-get-model.js`)
**功能**: 演示如何初始化和使用 LangChain 的大语言模型

**学习要点**:
- 如何使用 `ChatOpenAI` 创建大模型实例
- 如何配置模型参数（模型名称、温度等）
- 如何使用模型进行简单对话

**运行方式**:
```bash
node src/examples/4.1-get-model.js
```

**不需要额外依赖** ✅

---

### 4.2 使用模板提示词 (`4.2-prompt-template.js`)
**功能**: 演示如何使用提示词模板来格式化输入

**学习要点**:
- 如何使用 `ChatPromptTemplate` 创建可重复使用的提示模板
- 如何在模板中使用变量
- 如何将模板和模型组合成链

**运行方式**:
```bash
node src/examples/4.2-prompt-template.js
```

**不需要额外依赖** ✅

---

### 4.3 使用输出解析器 (`4.3-output-parser.js`)
**功能**: 演示如何使用输出解析器将模型的输出转换为结构化数据

**学习要点**:
- 如何使用 `zod` 定义输出结构
- 如何使用 `StructuredOutputParser` 解析模型输出
- 如何获取结构化的 JSON 数据

**运行方式**:
```bash
node src/examples/4.3-output-parser.js
```

**依赖**: `zod` 包（已在 package.json 中）

---

### 4.4 使用向量存储 (`4.4-vector-store.js`) 🆕
**功能**: 演示如何使用 **Faiss** 向量数据库来保存和检索文档

**学习要点**:
- 如何使用 `OpenAIEmbeddings` 创建嵌入模型
- 如何使用 **Faiss** 创建向量存储
- 如何进行相似性搜索和检索
- 如何保存和加载向量索引
- 了解第三方向量数据库的使用

**运行方式**:
```bash
# 直接运行即可，无需额外服务
node src/examples/4.4-vector-store.js
```

**依赖**: 
- `faiss-node` 包（已在 package.json 中）
- 查看 [FAISS_SETUP.md](../FAISS_SETUP.md) 了解详细设置

---

### 4.5 RAG检索生成 (`4.5-rag.js`) 🆕
**功能**: 演示如何使用 RAG (Retrieval-Augmented Generation) 检索增强生成
**使用 Faiss 作为向量存储**

**学习要点**:
- 如何将向量存储检索与大模型生成结合
- 如何创建 RAG 链
- RAG 如何提高回答的准确性
- 使用第三方向量数据库的优势
- 自动加载和保存向量索引

**运行方式**:
```bash
# 直接运行即可，无需额外服务
node src/examples/4.5-rag.js
```

**依赖**: 
- `faiss-node` 包（已在 package.json 中）
- 查看 [FAISS_SETUP.md](../FAISS_SETUP.md) 了解详细设置

---

### 4.6 使用Agent (`4.6-agent.js`) 🆕
**功能**: 演示如何使用 Agent 来智能选择工具完成任务
**使用 Faiss 作为向量存储**

**学习要点**:
- 如何定义工具（Tools）
- 如何创建 Agent
- Agent 如何根据问题智能选择工具
- 如何串联多个工具完成复杂任务
- 集成第三方向量数据库到 Agent 工具中
- 在工具中使用 Faiss 进行高效检索

**运行方式**:
```bash
# 直接运行即可，无需额外服务
node src/examples/4.6-agent.js
```

**依赖**: 
- `faiss-node` 包（已在 package.json 中）
- 查看 [FAISS_SETUP.md](../FAISS_SETUP.md) 了解详细设置

---

## 🚀 运行前的准备

### 1. 安装依赖

```bash
npm install
```

这会安装以下依赖：
- `@langchain/community` - LangChain 社区集成（包含 ChromaDB 集成）
- `langchain` - LangChain 核心库
- `@langchain/openai` - OpenAI 集成
- `@langchain/core` - 核心功能
- `zod` - 用于输出解析器的类型定义

### 2. 配置环境变量

在项目根目录创建 `.env` 文件：

```bash
# 必需配置
OPENAI_API_KEY=your_openai_api_key_here

# 可选配置
OPENAI_MODEL_NAME=gpt-3.5-turbo
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_TEMPERATURE=0.7
```

**注意**: Faiss 是本地运行的，无需额外的环境变量配置。

### 4. 确保 Node.js 版本 >= 18

```bash
node --version
```

如果版本低于 18，请使用 nvm 升级：
```bash
nvm install 18
nvm use 18
```

---

## 🎯 快速开始

### 运行所有示例

可以按顺序运行所有示例，逐步了解 LangChain 的各个功能：

```bash
# 示例 1: 获取大模型（不需要额外设置）
node src/examples/4.1-get-model.js

# 示例 2: 使用模板提示词（不需要额外设置）
node src/examples/4.2-prompt-template.js

# 示例 3: 使用输出解析器（不需要额外设置）
node src/examples/4.3-output-parser.js

# 示例 4: 使用向量存储（使用 Faiss，无需额外服务）
node src/examples/4.4-vector-store.js

# 示例 5: RAG检索生成（使用 Faiss）
node src/examples/4.5-rag.js

# 示例 6: 使用Agent（使用 Faiss）
node src/examples/4.6-agent.js
```

---

## 📊 功能对比

| 功能 | 复杂度 | 适用场景 | 依赖 |
|------|--------|----------|------|
| 获取大模型 | ⭐ | 简单问答 | 基础 |
| 模板提示词 | ⭐⭐ | 格式化提示 | 基础 |
| 输出解析器 | ⭐⭐ | 结构化输出 | zod |
| 向量存储 | ⭐⭐⭐ | 文档检索 | Faiss |
| RAG | ⭐⭐⭐⭐ | 知识库问答 | Faiss |
| Agent | ⭐⭐⭐⭐⭐ | 复杂任务 | Faiss |

---

## 🗄️ 向量存储说明

### 为什么使用 Faiss？

示例 4.4、4.5、4.6 使用 **Faiss** 作为第三方向量数据库，而不是简单的内存存储。原因包括：

1. ✅ **高性能**: Facebook 优化的向量搜索算法，速度快
2. ✅ **本地运行**: 直接在 Node.js 进程中运行，无需额外服务
3. ✅ **持久化存储**: 可以保存索引到磁盘，下次直接加载
4. ✅ **生产级**: 被广泛使用，稳定可靠
5. ✅ **易于使用**: 简单的 API，易于集成

### 其他向量数据库选择

除了 Faiss，你还可以使用：
- **ChromaDB**: 独立服务的向量数据库
- **Pinecone**: 云端托管向量数据库
- **Weaviate**: 开源向量数据库
- **Milvus**: 开源向量数据库（适合大规模）

选择哪个取决于你的具体需求。Faiss 适合本地应用和高性能需求。

---

## 📚 数据说明

所有示例使用的数据文件位于 `src/data/chinese-food-data.js`，包含了8个省份的特色美食信息：
- 四川省
- 广东省
- 湖南省
- 山东省
- 江苏省
- 浙江省
- 陕西省
- 云南省

你可以修改这个数据文件来添加更多省份或更新美食信息。

---

## ❓ 常见问题

### Q: 运行示例 4.4/4.5/4.6 时出现错误
**A**: 请确保已安装 `faiss-node` 包。运行 `npm install` 安装所有依赖。

### Q: 如何安装 Faiss？
**A**: Faiss 已包含在依赖中，运行 `npm install` 即可。查看 [FAISS_SETUP.md](../FAISS_SETUP.md) 了解详细的安装说明。

### Q: 可以使用其他向量数据库吗？
**A**: 可以！LangChain 支持多种向量数据库。你可以修改代码使用其他数据库，如 ChromaDB、Pinecone 等。

### Q: Faiss 索引文件存储在哪里？
**A**: 默认情况下，索引存储在项目根目录的相应文件夹中：
- `faiss_index/` - 示例 4.4
- `faiss_index_rag/` - 示例 4.5
- `faiss_index_agent/` - 示例 4.6

### Q: 运行示例时出现 "ReadableStream is not defined" 错误
**A**: 需要升级 Node.js 到 18 或更高版本。

### Q: 如何修改示例中的省份或问题？
**A**: 直接编辑对应的示例文件，修改相关的字符串即可。

---

## 🔗 相关资源

- [LangChain 官方文档](https://js.langchain.com/)
- [LangChain GitHub](https://github.com/langchain-ai/langchainjs)
- [Faiss 官方文档](https://github.com/facebookresearch/faiss)
- [FAISS_SETUP.md](../FAISS_SETUP.md) - Faiss 安装和配置指南

---

## 🎓 学习建议

1. **按顺序学习**: 从 4.1 开始，逐步了解每个功能
2. **动手实践**: 尝试修改代码，改变问题或参数
3. **组合使用**: 理解如何将多个功能组合使用
4. **查看文档**: 参考 LangChain 和 ChromaDB 的官方文档
5. **实验不同数据库**: 尝试使用不同的向量数据库

---

## 🚀 下一步

掌握这些基础功能后，你可以：
- 尝试使用其他向量数据库（FAISS、Pinecone 等）
- 创建更复杂的 Agent 工具链
- 集成到实际的应用程序中
- 探索 LangChain 的其他高级功能
- 优化向量存储的性能和准确性

祝你学习愉快！🎉
