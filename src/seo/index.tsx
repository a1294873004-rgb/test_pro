import { lazy, Suspense, useEffect, useState } from "react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, useRoutes } from "react-router";
import HomePage from "./HomePage";
import PricingPage from "./PricingPage";
import PreloadingPage from "./PreloadingPage";
const lazyLoad = (moduleName: string) => {
  const Component = lazy(() => import(`./${moduleName}/index.tsx`));
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Component />
    </Suspense>
  );
};

const routes = [
  {
    index: true,
    element: <HomePage />,
  },
  {
    path: "pricing",
    // element: lazyLoad("PricingPage"),
    element: <PricingPage />,
  },
  {
    path: "preloading-inspiration",
    // element: lazyLoad("PreloadingPage"),
    element: <PreloadingPage />,
  },
];
const AppRoutes: React.FC = () => {
  const element = useRoutes(routes);

  return <>{element}</>;
};

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </HelmetProvider>
  );
};

function AppWrapper() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // 这里可以等你所有关键数据加载完毕，比如 preloading svg
    const timer = setTimeout(() => setReady(true), 1000); // 或立即 setReady(true)
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (ready) {
      document.dispatchEvent(new Event("render-event"));
    }
  }, [ready]);

  return <App />;
}

export { AppWrapper as SEOApp };
