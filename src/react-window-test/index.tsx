import React from "react";
// import { List } from "react-window";
import { List } from "./lib/components/list/List";

// 生成 1000 条示例数据
const items = Array.from({ length: 1000 }, (_, i) => `Item ${i + 1}`);

// 单行渲染组件
const Row = ({
  index,
  style,
}: {
  index: number;
  style: React.CSSProperties;
}) => {
  return (
    <div
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        padding: "0 10px",
        borderBottom: "1px solid #eee",
        boxSizing: "border-box",
      }}
    >
      {items[index]}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <div
      style={{
        height: 300,
      }}
    >
      <List
        rowComponent={Row}
        rowCount={101}
        rowHeight={20}
        rowProps={{}}
      ></List>
    </div>
  );
};

export { App as InfiniteVirtualList };
