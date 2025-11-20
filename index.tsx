import { createRoot } from "react-dom/client";
import "./auto-gen-data/svg";
import "./index.less";
import { App } from "./src";

createRoot(document.getElementById("root")!).render(<App />);
