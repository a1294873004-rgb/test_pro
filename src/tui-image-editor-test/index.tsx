import React, { useEffect, useRef } from "react";
// import ImageEditor from "tui-image-editor";
import ImageEditor from "./libs/image-editor/src/index.js";
import "tui-image-editor/dist/tui-image-editor.css";
// import "tui-code-snippet/dist/tui-code-snippet.css";

// 导入默认样式（包含图标）
// const iconStyles = require("tui-image-editor/dist/svg/icon-a.svg");
// const iconStylesB = require("tui-image-editor/dist/svg/icon-b.svg");

const TuiEditor: React.FC = () => {
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorInstance = useRef<ImageEditor | null>(null);

  useEffect(() => {
    if (editorContainerRef.current) {
      // 初始化编辑器实例
      editorInstance.current = new ImageEditor(editorContainerRef.current, {
        includeUI: {
          loadImage: {
            path: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=400",
            name: "SampleImage",
          },
          theme: {
            "common.bi.image": "", // 隐藏右上角 Logo
            "common.bisize.width": "0",
            "common.bisize.height": "0",
          },
          menu: [
            "filter",
            "draw",
            "text",
            "mask",
            "icon",
            "shape",
            "crop",
            "flip",
            "rotate",
          ],
          initMenu: "filter",
          uiSize: {
            width: "100%",
            height: "700px",
          },
          menuBarPosition: "bottom",
        },
        includeUI: false,
        cssMaxWidth: 700,
        cssMaxHeight: 500,
        selectionStyle: {
          cornerSize: 20,
          rotatingPointOffset: 70,
        },
      });
      editorInstance.current.loadImageFromURL(
        "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=400",
        "12",
      );
    }
    // 组件卸载时销毁实例
    return () => {
      if (editorInstance.current) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, []);

  const handleSave = () => {
    if (editorInstance.current) {
      const dataUrl = editorInstance.current.toDataURL();
      console.log("保存的图片数据:", dataUrl);
      // 这里可以执行下载或上传逻辑
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>TUI Image Editor + React (TSX)</h2>
      <button
        onClick={handleSave}
        style={{ marginBottom: "10px", padding: "8px 16px", cursor: "pointer" }}
      >
        获取图片 Base64
      </button>

      {/* 编辑器挂载点 */}
      <div
        ref={editorContainerRef}
        style={{
          width: 200,
          height: 300,
        }}
      />
    </div>
  );
};

export { TuiEditor };
