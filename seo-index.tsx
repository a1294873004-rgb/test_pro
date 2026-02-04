import { createRoot, hydrateRoot } from "react-dom/client";
import { SEOApp } from "./src/seo";

const rootElement = document.getElementById("root")!;
const shouldHydrate = rootElement.hasChildNodes();

if (shouldHydrate) {
  hydrateRoot(rootElement, <SEOApp />);
} else {
  const root = createRoot(rootElement);
  root.render(<SEOApp />);
}

// if (true) {
//   // emit webpack build
//   setTimeout(() => {
//     document.dispatchEvent(new Event("render-event"));
//   }, 5000);
// }
