const axios = require("axios");
const { HttpProxyAgent, HttpsProxyAgent } = require("hpagent");

const proxyUrl = "http://127.0.0.1:7890";

async function getIpDetails() {
  console.log("--- 正在获取经由 Clash 转发的详细网络信息 ---");

  try {
    // 目标 URL
    const targetUrl = "http://ip-api.com/json/?lang=zh-CN";
    const isHttps = targetUrl.startsWith("https");

    // 根据目标协议自动选择 Agent
    const agent = isHttps
      ? new HttpsProxyAgent({ proxy: proxyUrl })
      : new HttpProxyAgent({ proxy: proxyUrl });

    const response = await axios.get(targetUrl, {
      // 根据协议挂载对应的 Agent
      httpAgent: isHttps ? undefined : agent,
      httpsAgent: isHttps ? agent : undefined,
      timeout: 10000,
    });

    const data = response.data;

    if (data.status === "success") {
      console.log("--------------------------------------");
      console.log(`📍 当前出口 IP:   ${data.query}`);
      console.log(`🌍 所属国家/地区: ${data.country} (${data.countryCode})`);
      console.log(`🏙️ 城市/省份:     ${data.regionName} ${data.city}`);
      console.log(`🏢 运营商 (ISP):  ${data.isp}`);
      console.log(`⏱️ 时区:          ${data.timezone}`);
      console.log("--------------------------------------");

      if (data.countryCode !== "CN") {
        console.log("✅ 状态：数据已成功通过【海外节点】发出。");
      } else {
        console.log("ℹ️ 状态：当前为【直连模式】，显示的是你本地真实信息。");
      }
    }
  } catch (error) {
    console.error("❌ 请求出错：");
    console.error("错误详情:", error.message);
  }
}

getIpDetails();
