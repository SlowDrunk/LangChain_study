// 为 Node 环境统一提供部分 Web API polyfill（全局可用）
// 1. ReadableStream：部分 LangChain 代码默认假设存在
// 2. fetch / Headers / Request / Response：@xenova/transformers 依赖这些全局对象

import { ReadableStream } from "node:stream/web";
import { fetch, Headers, Request, Response } from "undici";

if (typeof globalThis.ReadableStream === "undefined") {
  globalThis.ReadableStream = ReadableStream;
}

if (typeof globalThis.fetch === "undefined") {
  globalThis.fetch = fetch;
}

if (typeof globalThis.Headers === "undefined") {
  globalThis.Headers = Headers;
}

if (typeof globalThis.Request === "undefined") {
  globalThis.Request = Request;
}

if (typeof globalThis.Response === "undefined") {
  globalThis.Response = Response;
}



