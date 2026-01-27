import { Masonry } from "./react-masonry-css";
import "./App.less";
import data from "./test.json";
import { ImageCropper } from "src/ImageCropper";
import { useState } from "react";
import { ImageCropperTest } from "src/ImageCropper/test";
let images: string[] = [
  "//r.yidooo.com/images/oc_reference/1766831103578_9137d2b4.jpg",
  "https://r.yidooo.com/images/reference/1767096677282_83df6d9c.jpg",
  "//r.yidooo.com/images/oc_reference/1766831656713_9d5dbaff.jpg",
  "//r.yidooo.com/images/reference/1766828848121_ea80e34a.jpg",
  "//r.yidooo.com/images/reference/1766924991748_f8661f36.jpg",
  "//r.yidooo.com/images/reference/1766835238861_ae50f9aa.jpg",
  "//r.yidooo.com/images/oc_reference/1766831048261_a71f5d52.jpg",
  "//r.yidooo.com/images/reference/1766835074068_643baf24.jpg",
  "//r.yidooo.com/images/oc_reference/1766831096243_67269047.jpg",
  "https://r.yidooo.com/images/reference/1766835082321_73cbbcb7.jpg",
  "//r.yidooo.com/images/reference/1766829003171_c7ed7eeb.jpg",
  "//r.yidooo.com/images/oc_reference/1766830985702_8db8b300.jpg",
  "//r.yidooo.com/images/seededit/1766835786447_132491e6.jpg",
  "//r.yidooo.com/images/seededit/1766835801768_994747dc.jpg",
  "//r.yidooo.com/images/reference/1766925227402_30459a89.jpg",
  "//r.yidooo.com/images/oc_reference/1766830883145_adf20079.jpg",
  "//r.yidooo.com/images/oc_reference/1766827812483_11a89c7e.jpg",
  "//r.yidooo.com/images/reference/1766835189977_00e1a880.jpg",
];

images = [];
data.forEach((item) => {
  item.info = JSON.parse(item.info);
});
images = data
  // .filter((item) => item.info?.props?.url)
  .filter(
    (item) => item.info?.flavour === "yidooo:image" || item.info?.props?.url,
  )
  // .filter((item) => !item.info?.props?.url?.includes("data:image"))
  .map((item) => ({
    src: item.info?.props?.url,
    item,
  }));

const normalizeSrc = (src: string) => {
  if (src.startsWith("//")) {
    return `https:${src}`;
  }
  return src;
};

const ImageList: React.FC = () => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: 12,
      }}
    >
      <div>{images.length}</div>
      {images.map(({ src, item }, index) => (
        <div>
          <div style={{ fontSize: 30 }}>
            {index}

            {src.includes("data:image") ? "base64" : ""}
          </div>
          <div>{item.info?.flavour}</div>
          <div>{item.id}</div>
          <img
            key={index}
            src={normalizeSrc(src)}
            alt={`img-${index}`}
            loading="lazy"
            style={{
              width: "100%",
              height: 160,
              objectFit: "cover",
              borderRadius: 8,
            }}
          />
        </div>
      ))}
    </div>
  );
};

function App() {
  // 模拟 12 个卡片
  const items = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    height: 100 + Math.random() * 150, // 高度随机，用来演示瀑布流
    text: `Card ${i + 1}`,
  }));

  // 响应式列数
  const breakpoints = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Masonry Demo</h1>

      <ImageCropperTest />
      {/* <ImageList /> */}
    </div>
  );
}

export { App as ReactMasonryCss };
