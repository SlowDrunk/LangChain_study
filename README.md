# LangChain Hello World 项目

这是一个用于学习 LangChain 的示例项目，包含一个简单的 Hello World 程序。

## 系统要求

- **Node.js**: 18.0.0 或更高版本
- **npm**: 6.0.0 或更高版本

## 安装步骤

1. **检查 Node.js 版本**
   ```bash
   node --version
   ```
   如果版本低于 18，请升级 Node.js。

2. **升级 Node.js（如果需要的話）**

   使用 nvm（推荐）:
   ```bash
   # 安装 Node.js 18 LTS
   nvm install 18
   nvm use 18
   
   # 或安装最新 LTS 版本
   nvm install --lts
   nvm use --lts
   ```

   或从 [Node.js 官网](https://nodejs.org/) 下载安装最新 LTS 版本。

3. **安装依赖**
   ```bash
   npm install
   ```

4. **配置环境变量**

   在项目根目录创建 `.env` 文件：
   ```bash
   # 必需配置
   OPENAI_API_KEY=your_openai_api_key_here
   
   # 可选配置
   # 模型名称（默认为 gpt-3.5-turbo）
   OPENAI_MODEL_NAME=gpt-3.5-turbo
   
   # 自定义 API 基础 URL（用于使用其他兼容 OpenAI API 的服务）
   OPENAI_BASE_URL=https://api.openai.com/v1
   
   # 温度参数（0-2，默认为 0.7）
   OPENAI_TEMPERATURE=0.7
   ```
   
   **说明**:
   - `OPENAI_API_KEY`: 必需，你的 OpenAI API Key
   - `OPENAI_MODEL_NAME`: 可选，要使用的模型名称，默认使用 `gpt-3.5-turbo`
   - `OPENAI_BASE_URL`: 可选，API 的基础 URL，如果使用兼容 OpenAI API 的其他服务（如本地部署的模型），可以设置此选项
   - `OPENAI_TEMPERATURE`: 可选，控制输出的随机性，范围 0-2，默认 0.7

## 运行程序

```bash
npm start
```

或使用开发模式（自动重启）：
```bash
npm run dev
```

## 程序说明

这个 Hello World 程序演示了：
- 如何使用 `ChatOpenAI` 创建 OpenAI 聊天模型实例
- 如何使用 `ChatPromptTemplate` 创建提示模板
- 如何将提示和模型组合成链（chain）
- 如何调用链并获取响应

## 常见问题

### 错误: ReadableStream is not defined
- **原因**: Node.js 版本过低（需要 18+）
- **解决**: 升级 Node.js 到 18 或更高版本

### 错误: 请设置 OPENAI_API_KEY 环境变量
- **原因**: 未配置 OpenAI API Key
- **解决**: 在项目根目录创建 `.env` 文件并添加你的 API Key

### 错误: API key 相关错误
- **原因**: API Key 无效或配置错误
- **解决**: 检查 `.env` 文件中的 API Key 是否正确

## 项目结构

```
langChain_study/
├── src/
│   └── index.js          # 主程序文件
├── .env                  # 环境变量文件（需要自己创建）
├── package.json          # 项目配置
└── README.md            # 本文件
```

## 学习资源

- [LangChain 官方文档](https://js.langchain.com/)
- [LangChain GitHub](https://github.com/langchain-ai/langchainjs)

