const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");
const app = express();
const port = 3020;

/**
 * 核心生成方法
 * @param {string} url - 目标地址
 * @param {string} type - 'image' | 'pdf'
 * @param {string} selector - 需要抓取的 DOM 选择器 (如 '#render-target')
 */
async function generateMedia(url, type = "image", selector = "#feedBackCard") {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    // 1. 设置视口，确保居中内容有足够展示空间
    await page.setViewport({
      width: 1280,
      height: 1200,
      deviceScaleFactor: 2, // 2倍清晰度，截图更细腻
    });

    await page.evaluateOnNewDocument(() => {
      window.__IS_PUPPETEER__ = true;
    });
    // 2. 创建 Promise 等待 React 的自定义事件
    const renderPromise = new Promise((resolve, reject) => {
      // 暴露函数给 window 对象
      page.exposeFunction("onReactCompleted", () => {
        resolve();
      });
      // 设置 30s 超时防止死等
      setTimeout(() => reject(new Error("Render timeout")), 30000);
    });

    // 3. 在页面加载前注入监听脚本
    await page.evaluateOnNewDocument(() => {
      window.addEventListener("completed", () => {
        window.onReactCompleted();
      });
    });

    // 4. 跳转页面
    await page.goto(url, { waitUntil: "networkidle2" });

    // 5. 等待 React 业务逻辑完成
    console.log('Waiting for "completed" event from React...');
    await renderPromise;

    // 6. 定位目标 DOM 元素
    const element = await page.$(selector);
    if (!element) throw new Error(`Selector ${selector} not found`);

    let result;
    if (type === "pdf") {
      // PDF 导出通常针对全页，但我们可以通过设置页面尺寸来匹配内容
      // 或者使用一些技巧只打印该元素
      result = await page.pdf({
        printBackground: true,
        width: "600px",
        height: "1000px",
        pageRanges: "1",
      });
    } else {
      // 直接对 DOM 元素进行截图（自动裁剪）
      result = await element.screenshot({
        type: "png",
        omitBackground: true, // 隐藏非元素区域的背景
        captureBeyondViewport: true, // 确保超出视口的部分也被捕获（默认即为 true）
      });
    }

    return result;
  } finally {
    await browser.close();
  }
}
/*
http://localhost:8090/feed-back-card/4a4c7b09-828a-4ef0-99d2-58d359dfeeae?token=Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ7XCJhY2NvdW50XCI6XCJhMTI5NDg3MzAwNEBnbWFpbC5jb21cIixcInVzZXJJZFwiOlwiZmFjY2ZhN2YtNzNmZi00ZDUxLTg4YTctYWM1M2I5ZDE0NGMyXCJ9IiwiaWF0IjoxNzc0MjUwODA0LCJleHAiOjE3NzQ1MTAwMDR9.fpmupGUaegbMgidX5sC_VNJv3k84GUHYSg6M2lUPTJqMmNLRTsB6rEBvucAZCJSDZJUCwYSEVLyvnx5-Ct6zNg&lang=zh
*/
// --- Express 路由 ---

// 假设你的前端基础页面地址
const BASE_FRONTEND_URL = "http://localhost:8090/feed-back-card";
app.use(
  cors({
    origin: "http://localhost:9181", // 允许你前端的来源地址
    methods: ["GET", "POST", "OPTIONS"], // 允许的方法
    allowedHeaders: ["Content-Type", "Authorization", "Accept-Language"], // 必须包含你自定义的 Header
    credentials: true, // 如果你需要跨域携带 cookie
  }),
);
app.get("/export", async (req, res) => {
  // 1. 获取前端传来的 ID
  const { id, format = "image" } = req.query;

  // 2. 从 Header 读取语言和 Token
  // 前端请求时需设置 headers: { 'Accept-Language': 'zh-CN', 'Authorization': 'Bearer ...' }
  const lang = req.headers["accept-language"]?.split(",")[0] || "en";
  const authHeader = req.headers["authorization"] || "";
  const token = authHeader.replace("Bearer ", "");

  if (!id) return res.status(400).send("Missing id");

  try {
    // 3. 按照你的逻辑拼接内部访问的 URL
    // 这里的 url 是 Puppeteer 真正去访问的地址
    const targetUrl = `${BASE_FRONTEND_URL}/${id}?token=${token}&lang=${lang}`;

    console.log(`Puppeteer is visiting: ${targetUrl}`);

    // 执行生成逻辑
    const buffer = await generateMedia(targetUrl, format);

    if (format === "pdf") {
      res.contentType("application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=export-${id}.pdf`,
      );
    } else {
      res.contentType("image/png");
    }

    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).send("Export failed");
  }
});
app.listen(port, () => {
  console.log(`Export service running at http://localhost:${port}`);
});
