import React, { useState } from "react";

interface ExportProps {
  resourceId?: string; // 比如某个作品的 ID
}

const ExportTool: React.FC<ExportProps> = ({
  resourceId = "4a4c7b09-828a-4ef0-99d2-58d359dfeeae",
}) => {
  const [loading, setLoading] = useState(false);

  const downloadFile = async (format: "image" | "pdf") => {
    setLoading(true);
    try {
      // 1. 获取本地存储的凭证和语言设置
      const token =
        localStorage.getItem("token") ||
        "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ7XCJhY2NvdW50XCI6XCJhMTI5NDg3MzAwNEBnbWFpbC5jb21cIixcInVzZXJJZFwiOlwiZmFjY2ZhN2YtNzNmZi00ZDUxLTg4YTctYWM1M2I5ZDE0NGMyXCJ9IiwiaWF0IjoxNzc0MjUwODA0LCJleHAiOjE3NzQ1MTAwMDR9.fpmupGUaegbMgidX5sC_VNJv3k84GUHYSg6M2lUPTJqMmNLRTsB6rEBvucAZCJSDZJUCwYSEVLyvnx5-Ct6zNg";
      const locale = localStorage.getItem("locale") || "en";

      // 2. 发起请求，并将凭证放入 Header
      const response = await fetch(
        `http://localhost:3020/export?id=${resourceId}&format=${format}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept-Language": locale,
          },
        },
      );

      if (!response.ok) throw new Error("Network response was not ok");

      // 3. 处理二进制流并触发下载
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `export_${resourceId}.${format === "pdf" ? "pdf" : "png"}`;
      document.body.appendChild(link);
      link.click();

      // 清理
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Export error:", error);
      alert("导出失败，请检查服务状态");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ padding: "16px", background: "#f5f5f5", borderRadius: "8px" }}
    >
      <p style={{ marginBottom: "12px", fontWeight: "bold" }}>
        导出选项 (ID: {resourceId})
      </p>
      <div style={{ display: "flex", gap: "12px" }}>
        <button
          disabled={loading}
          onClick={() => downloadFile("image")}
          style={btnStyle("#1677ff")}
        >
          {loading ? "生成中..." : "导出 PNG 图片"}
        </button>
        <button
          disabled={loading}
          onClick={() => downloadFile("pdf")}
          style={btnStyle("#ff4d4f")}
        >
          {loading ? "生成中..." : "导出 PDF 格式"}
        </button>
      </div>
    </div>
  );
};

// 简单的按钮样式
const btnStyle = (color: string) => ({
  padding: "8px 16px",
  backgroundColor: color,
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  opacity: 1,
});

export { ExportTool as ExportButton };
