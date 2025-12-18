// src/yjsDoc.ts
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

// 创建 Yjs 文档
export const ydoc = new Y.Doc();

// 创建 WebSocket 提供者
export const provider = new WebsocketProvider(
  "wss://demos.yjs.dev", // websocket 服务器地址
  "my-roomname", // 房间名称，房间内的用户共享同一文档
  ydoc
);

// 获取 Yjs 数据类型示例
export const yText = ydoc.getText("shared-text"); // 文本
export const yArray = ydoc.getArray<string>("shared-array"); // 数组
export const yMap = ydoc.getMap<any>("shared-map"); // Map
export const yXmlFragment = ydoc.getXmlFragment("shared-xml"); // XML
