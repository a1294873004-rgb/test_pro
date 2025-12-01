// src/components/MasonryGrid.tsx
import React, { useState } from "react";
import Masonry from "react-masonry-component";

type MasonryItem = {
  id: number;
  src: string;
  title?: string;
};

type MasonryGridProps = {
  items?: MasonryItem[];
};

// 默认生成 20 张随机图片
const defaultItems: MasonryItem[] = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  src: `https://picsum.photos/200/${200 + (i % 10) * 10}?random=${i}`,
  title: `图片 ${i + 1}`,
}));

const masonryOptions = {
  transitionDuration: "0.5s", // 布局动画时间
  gutter: 16, // 列间距
  fitWidth: true, // 居中
  resize: true, // 容器 resize 自动布局
};

const MasonryGrid: React.FC<MasonryGridProps> = ({ items = defaultItems }) => {
  const [currentItems, setCurrentItems] = useState(items);

  return (
    <Masonry
      className="my-masonry-grid"
      options={masonryOptions}
      disableImagesLoaded={false} // 确保图片加载完再布局
      updateOnEachImageLoad={true} // 图片加载完成触发布局动画
    >
      {currentItems.map((item) => (
        <div
          key={item.id}
          style={{
            width: 200,
            marginBottom: 16,
            borderRadius: 8,
            overflow: "hidden",
            background: "#f0f0f0",
            boxSizing: "border-box",
          }}
        >
          <img
            src={item.src}
            alt={item.title}
            style={{
              width: "100%",
              display: "block",
              objectFit: "cover",
              transition: "transform 0.3s", // 小动画优化
            }}
          />
          {item.title && (
            <div style={{ padding: 8, textAlign: "center" }}>{item.title}</div>
          )}
        </div>
      ))}
    </Masonry>
  );
};

export { MasonryGrid };
