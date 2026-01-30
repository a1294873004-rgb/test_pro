import { createRoot } from "react-dom/client";
// import "./auto-gen-data/svg";
// import "./index.less";
import { App } from "./src";
// import { MarqueeTags } from "src/MarqueeTags";
// import { MasonryGrid } from "src/masonry-test";
// import { InfiniteVirtualList } from "src/react-window-test";
import { RxJsDemo } from "src/rxjs-test";
import { MySelect } from "src/antd-test";
import { ClickableBanner } from "src/ClickableBanner";
import { MemoryViewApp } from "src/memory-router";
import { TuiEditor } from "src/tui-image-editor-test";
// import "./src/lit-test";
// createRoot(document.getElementById("root")!).render(<App />);
createRoot(document.getElementById("root")!).render(<TuiEditor />);
// createRoot(document.getElementById("root")!).render(<MarqueeTags />);
// createRoot(document.getElementById("root")!).render(<MasonryGrid />);
// createRoot(document.getElementById("root")!).render(
//   <div>
//     {/* <MySelect /> */}
//     <RxJsDemo />
//     <MemoryViewApp />
//     {/* <ClickableBanner /> */}
//   </div>
// );
// createRoot(document.getElementById("root")!).render(<InfiniteVirtualList />);
