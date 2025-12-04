# LangChain 示例程序使用指南

本指南介绍如何使用项目中的6个示例程序，每个程序演示 LangChain 的一个核心功能点。

## 📁 项目结构

```
langChain_study/
├── src/
│   ├── examples/              # 示例程序目录
│   │   ├── 4.1-get-model.js        # 获取大模型
│   │   ├── 4.2-prompt-template.js  # 使用模板提示词
│   │   ├── 4.3-output-parser.js    # 使用输出解析器
│   │   ├── 4.4-vector-store.js     # 使用向量存储
│   │   ├── 4.5-rag.js              # RAG检索生成
│   │   ├── 4.6-agent.js            # 使用Agent
│   │   └── README.md               # 详细说明文档
│   ├── data/
│   │   └── chinese-food-data.js    # 示例数据（8个省份的美食信息）
│   └── index.js                    # 主程序
├── .env                          # 环境变量配置文件（需自己创建）
├── package.json
└── EXAMPLES_GUIDE.md            # 本文件
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

这会安装以下依赖（已在 `package.json` 中配置好）：
- `langchain` - LangChain v1 核心库（主要用于 Agent 能力）
- `@langchain/core` - LangChain 核心基础能力
- `@langchain/openai` - OpenAI 集成（对话大模型）
- `@langchain/community` - 向量存储、嵌入模型等社区组件（Faiss、本地 HuggingFace 等）
- `@xenova/transformers` - 在 Node.js 中本地运行 HuggingFace 文本嵌入模型
- `@langchain/classic` - 兼容旧版 Agent API（如 `AgentExecutor` 和 `createToolCallingAgent`）
- `zod` - 用于输出解析器的类型定义

### 2. 配置环境变量

在项目根目录创建 `.env` 文件（最小配置示例）：

```bash
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL_NAME=gpt-3.5-turbo  # 可选
OPENAI_BASE_URL=https://api.openai.com/v1  # 可选，自定义代理 / 兼容 OpenAI 协议服务

# 本地 HuggingFace Transformers 嵌入模型（可选，不写则使用默认值）
HF_EMBEDDING_MODEL=Xenova/all-MiniLM-L6-v2
```

### 3. 运行示例

按顺序运行各个示例：

```bash
# 4.1 获取大模型
node src/examples/4.1-get-model.js

# 4.2 使用模板提示词
node src/examples/4.2-prompt-template.js

# 4.3 使用输出解析器
node src/examples/4.3-output-parser.js

# 4.4 使用向量存储
node src/examples/4.4-vector-store.js

# 4.5 RAG检索生成
node src/examples/4.5-rag.js

# 4.6 使用Agent
node src/examples/4.6-agent.js
```

## 📚 示例详解

### 示例 4.1: 获取大模型

**最简单的示例**，展示如何创建和使用大语言模型。

```javascript
const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0.7
});
```

**学习要点**:
- 大模型的基本初始化
- 如何调用模型进行对话

---

### 示例 4.2: 使用模板提示词

**演示模板化提示词**，可以重复使用，方便维护。

```javascript
const promptTemplate = ChatPromptTemplate.fromMessages([
  ["system", "你是一个中国美食专家。"],
  ["human", "请详细介绍{province}的特色美食。"]
]);
```

**学习要点**:
- 使用模板提高代码复用性
- 如何传递变量到模板

---

### 示例 4.3: 使用输出解析器

**将模型输出转换为结构化数据**，方便程序处理。

```javascript
const outputSchema = z.object({
  province: z.string(),
  foods: z.array(...)
});
const parser = StructuredOutputParser.fromZodSchema(outputSchema);
```

**学习要点**:
- 如何定义输出结构
- 如何解析模型输出为 JSON

---

### 示例 4.4: 使用向量存储

**文档检索的基础**，将文档转换为向量并存储到 Faiss 向量数据库中。

示例中使用的是**本地 HuggingFace Transformers 嵌入模型 + Faiss 向量存储**：

```javascript
// 使用本地 HuggingFace Transformers 作为嵌入模型（无需 API Key）
const hfEmbeddingModel =
  process.env.HF_EMBEDDING_MODEL || "Xenova/all-MiniLM-L6-v2";

const embeddings = new HuggingFaceTransformersEmbeddings({
  model: hfEmbeddingModel,
});

// 从文档创建 Faiss 向量存储
const vectorStore = await FaissStore.fromDocuments(documents, embeddings);

// 相似性搜索
const results = await vectorStore.similaritySearch(query, 3);
```

**学习要点**:
- 什么是向量嵌入（embeddings）
- 如何使用本地 HuggingFace 模型生成嵌入
- 如何使用 Faiss 进行高性能相似性搜索

---

### 示例 4.5: RAG检索生成

**结合检索和生成**，提供更准确的回答。

示例中使用：**本地 HuggingFace Transformers 作为嵌入模型 + Faiss 作为向量存储 + OpenAI Chat 作为生成模型**。

核心流程简化如下：

```javascript
// 1. 创建/加载 Faiss 向量存储（使用本地嵌入）
const hfEmbeddingModel =
  process.env.HF_EMBEDDING_MODEL || "Xenova/all-MiniLM-L6-v2";

const embeddings = new HuggingFaceTransformersEmbeddings({
  model: hfEmbeddingModel,
});

const vectorStore = await FaissStore.fromDocuments(documents, embeddings);
const retriever = vectorStore.asRetriever({ k: 3 });

// 2. 检索相关文档
const docs = await retriever.invoke(question);
const context = docs.map((doc) => doc.pageContent).join("\n\n");

// 3. 将检索到的上下文与问题一起交给大模型
const chain = promptTemplate.pipe(model);
const response = await chain.invoke({ context, question });
```

**学习要点**:
- RAG 的工作原理：**检索 (Retrieve) + 生成 (Generate)**
- 如何将向量检索结果拼接成上下文
- 如何通过提示模板把上下文交给大模型

---

### 示例 4.6: 使用Agent

**智能选择工具完成任务**，可以处理复杂任务。

示例中使用的是 `@langchain/classic/agents` 中的 Agent 能力，结合：
- OpenAI Chat 作为大模型
- 本地 HuggingFace Transformers + Faiss 作为检索工具的数据源

核心创建 Agent 的代码（简化）如下：

```javascript
import { AgentExecutor, createToolCallingAgent } from "@langchain/classic/agents";

const tools = [searchFoodTool, compareFoodTool, listProvincesTool];

const agent = await createToolCallingAgent({
  llm: model,
  tools,
  prompt,
});

const agentExecutor = new AgentExecutor({
  agent,
  tools,
  verbose: true,
});
```

**学习要点**:
- 如何定义工具（`DynamicStructuredTool` 等）
- Agent 如何自动选择和调用工具完成任务
- 多步骤/多工具任务的执行流程

## 💡 功能对比

| 功能 | 复杂度 | 适用场景 | 依赖 |
|------|--------|----------|------|
| 获取大模型 | ⭐ | 简单问答 | 基础 |
| 模板提示词 | ⭐⭐ | 格式化提示 | 基础 |
| 输出解析器 | ⭐⭐ | 结构化输出 | zod |
| 向量存储 | ⭐⭐⭐ | 文档检索 | 嵌入模型 |
| RAG | ⭐⭐⭐⭐ | 知识库问答 | 向量存储 |
| Agent | ⭐⭐⭐⭐⭐ | 复杂任务 | 工具定义 |

## 🔧 常见问题

### 问题1: 导入错误

如果遇到类似 `Cannot find module` 的错误，可能是：
1. 未安装依赖：运行 `npm install`
2. 导入路径错误：检查 LangChain 版本和导入路径

### 问题2: API Key 错误

确保：
1. `.env` 文件在项目根目录
2. `OPENAI_API_KEY` 正确设置
3. API Key 有效且有足够的配额

### 问题3: Node.js 版本错误

确保 Node.js 版本 >= 18：
```bash
node --version
```

### 问题4: 依赖包问题

如果遇到依赖相关的错误，尝试：
```bash
rm -rf node_modules package-lock.json
npm install
```

## 🎯 学习路径建议

1. **基础阶段** (4.1 - 4.2)
   - 熟悉大模型的基本使用
   - 了解提示词工程

2. **进阶阶段** (4.3 - 4.4)
   - 学习结构化输出
   - 掌握向量存储概念

3. **高级阶段** (4.5 - 4.6)
   - 理解 RAG 架构
   - 掌握 Agent 编程

## 📖 扩展阅读

- [LangChain 官方文档](https://js.langchain.com/)
- [LangChain GitHub](https://github.com/langchain-ai/langchainjs)
- [OpenAI API 文档](https://platform.openai.com/docs)

## 🎓 实践建议

1. **修改示例**: 尝试改变省份、问题或参数
2. **组合功能**: 将多个功能组合使用
3. **添加数据**: 在 `chinese-food-data.js` 中添加更多省份
4. **创建工具**: 为 Agent 添加更多工具

## 📝 代码说明

所有示例代码都：
- ✅ 包含详细的中文注释
- ✅ 逐步展示每个功能
- ✅ 包含错误处理
- ✅ 输出友好的提示信息

代码设计追求**通俗易懂**，便于学习和理解，不追求过度优化。

祝你学习愉快！🎉

