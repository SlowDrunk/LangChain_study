# 依赖安装说明

## ⚠️ 版本冲突问题

在使用 Faiss 时，可能会遇到以下依赖版本冲突：

- `@langchain/community@0.3.x` 与 `@langchain/core@1.1.x` 版本不兼容
- `dotenv` 版本冲突

## ✅ 解决方案：使用 --legacy-peer-deps

最简单有效的解决方案是使用 `--legacy-peer-deps` 标志安装依赖：

### 步骤 1: 清理旧的依赖

```bash
# 删除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json
```

### 步骤 2: 使用 --legacy-peer-deps 安装

```bash
npm install --legacy-peer-deps
```

这个标志会：
- ✅ 允许安装不兼容的对等依赖
- ✅ 通常不会影响实际功能
- ✅ 是处理这类版本冲突的标准做法

### 步骤 3: 验证安装

安装完成后，测试基础功能：

```bash
# 测试基础示例（不需要向量存储）
node src/examples/4.1-get-model.js

# 如果基础示例正常，再测试向量存储示例
node src/examples/4.4-vector-store.js
```

## 🔧 为什么需要这样做？

LangChain 生态系统正在快速发展，不同包之间的版本可能不完全同步。使用 `--legacy-peer-deps` 是一个常见且安全的做法，特别是当：

- 核心功能包的版本是新的（如 LangChain 1.1.x）
- 社区集成包的版本稍旧（如 @langchain/community 0.3.x）
- 功能上兼容，只是版本号不匹配

## 📝 后续建议

1. **保持使用 --legacy-peer-deps**: 后续添加新依赖时也使用此标志
2. **定期更新**: 关注 LangChain 和 @langchain/community 的更新
3. **测试功能**: 安装后测试示例程序确保功能正常

## 🚀 快速命令

```bash
# 一键清理和安装
rm -rf node_modules package-lock.json && npm install --legacy-peer-deps
```

如果遇到其他问题，请查看 `DEPENDENCY_FIX.md` 了解更多解决方案。

