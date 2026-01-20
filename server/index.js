import Koa from "koa";
import cors from "@koa/cors";
import bodyParser from "koa-bodyparser";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import dotenv from "dotenv";

dotenv.config();

const app = new Koa();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = { error: err.message || "服务器内部错误" };
    console.error("服务器错误:", err);
  }
});

app.use(async (ctx, next) => {
  if (ctx.path === "/api/chat" && ctx.method === "POST") {
    if (!process.env.OPENAI_API_KEY) {
      ctx.status = 500;
      ctx.body = { error: "OPENAI_API_KEY 未设置" };
      return;
    }

    const { message, systemMessage } = ctx.request.body || {};
    const model = new ChatOpenAI({
      modelName: process.env.OPENAI_MODEL_NAME || "gpt-3.5-turbo",
      temperature: process.env.OPENAI_TEMPERATURE ? parseFloat(process.env.OPENAI_TEMPERATURE) : 0.7,
      apiKey: process.env.OPENAI_API_KEY,
    });

    const messages = [
      new SystemMessage({ content: systemMessage || "我是一个人工智能助手，我的名字叫贾维斯" }),
      new HumanMessage({ content: message || "请简单介绍一下你自己！" }),
    ];

    ctx.status = 200;
    ctx.set("Content-Type", "text/event-stream");
    ctx.set("Cache-Control", "no-cache");
    ctx.set("Connection", "keep-alive");
    ctx.set("Access-Control-Allow-Origin", "*");
    ctx.set("X-Accel-Buffering", "no");

    try {
      const response = await model.stream(messages);
      
      for await (const chunk of response) {
        let content = '';
        if (chunk?.text !== undefined && chunk.text !== null) {
          content = String(chunk.text);
        } else if (chunk?.content !== undefined && chunk.content !== null) {
          content = typeof chunk.content === 'string' ? chunk.content : String(chunk.content);
        } else if (typeof chunk === 'string') {
          content = chunk;
        }

        const data = JSON.stringify({ content: content || '', done: false });
        ctx.res.write(`data: ${data}\n\n`);
      }

      ctx.res.write(`data: ${JSON.stringify({ content: "", done: true })}\n\n`);
    } catch (streamError) {
      ctx.res.write(`data: ${JSON.stringify({ error: streamError.message, done: true })}\n\n`);
    } finally {
      ctx.res.end();
    }
    return;
  }

  if (ctx.path === "/api/health" && ctx.method === "GET") {
    ctx.body = { status: "ok", message: "服务器运行正常" };
    return;
  }

  await next();
});

app.use(async (ctx) => {
  if (ctx.status === 404) {
    ctx.body = { error: "接口不存在" };
  }
});

app.listen(PORT, () => {
  console.log(`服务器已启动，监听端口: ${PORT}`);
});
