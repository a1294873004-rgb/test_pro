import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

type Item = {
  id: number;
  title: string;
  img: string;
};

// 模拟 API 请求
const fetchMockData = async (page: number, limit = 10): Promise<Item[]> => {
  await new Promise((res) => setTimeout(res, 800)); // 模拟网络延迟

  return Array.from({ length: limit }, (_, i) => ({
    id: page * limit + i,
    title: `Item #${page * limit + i}`,
    img: `https://picsum.photos/300/200?random=${page * limit + i}`,
  }));
};

const InfiniteScrollDemo: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    const newData = await fetchMockData(page);

    // 假设最多 5 页
    if (page >= 4) {
      setHasMore(false);
    }

    setItems((prev) => [...prev, ...newData]);
    setPage((p) => p + 1);
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h2>react-infinite-scroll-component Example</h2>

      <InfiniteScroll
        dataLength={items.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<p style={{ textAlign: "center" }}>Loading...</p>}
        endMessage={<p style={{ textAlign: "center" }}>No more data</p>}
        style={{ overflow: "visible" }} // 重要：不让它强制内部滚动
      >
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              marginBottom: 16,
              borderRadius: 8,
              boxShadow: "0 2px 6px #0001",
              overflow: "hidden",
            }}
          >
            <img src={item.img} style={{ width: "100%", display: "block" }} />
            <div style={{ padding: 12 }}>{item.title}</div>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export { InfiniteScrollDemo };
