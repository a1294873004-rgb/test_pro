let imageUrl =
  "https://r.yidooo.com/cdn-cgi/image/width=452,height=452,dpr=1/https://r.yidooo.com/user/eaf5363c-5dbf-41ab-ae58-ce3eff4e1e0f/2026-01-30/images/generation/1769746033306_f0e3b300.jpg";

imageUrl =
  "https://r.yidooo.com/user/eaf5363c-5dbf-41ab-ae58-ce3eff4e1e0f/2026-01-30/images/generation/1769746033306_f0e3b300.jpg";

async function verifyCORS() {
  console.log("%c 开始验证图片跨域状态...", "color: blue; font-weight: bold;");

  // 1. 验证原始请求
  try {
    await fetch(imageUrl, { method: "GET", mode: "cors" });
    console.log("✅ 结果：原始链接访问正常。");
  } catch (err) {
    console.error("❌ 结果：原始链接报错（CORS Error）。");

    // 2. 验证是否为缓存导致的报错
    const cacheBusterUrl =
      imageUrl + "&cb=" + Math.random().toString(36).substring(7);
    try {
      await fetch(cacheBusterUrl, { method: "GET", mode: "cors" });
      console.log(
        "💡 发现：加了随机后缀后访问成功！确认是 Cloudflare 缓存了错误的 Header。",
      );
      console.log(
        "建议：在代码中临时给 URL 加随机参数，或在 CF 后台清除缓存。",
      );
    } catch (err2) {
      console.error(
        "💡 发现：加了随机后缀依然失败。确认是 CF Image Resizing 根本没配置跨域头。",
      );
      console.log("建议：需前往 CF 控制台配置 Response Header 规则。");
    }
  }
}

verifyCORS();
