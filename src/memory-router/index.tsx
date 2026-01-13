import React, { useLayoutEffect, useMemo } from "react";
import {
  createMemoryRouter,
  RouterProvider,
  type RouteObject,
  useNavigate,
} from "react-router-dom";
import { BehaviorSubject } from "rxjs";

/**
 * ======================
 * View Model
 * ======================
 * 外部可控的路由状态
 */
class ViewModel {
  location$ = new BehaviorSubject<string>("/");

  navigate(path: string) {
    this.location$.next(path);
  }
}
const viewInstance = new ViewModel();

/**
 * ======================
 * ViewRouter（Memory Router）
 * ======================
 */
interface ViewRouterProps {
  view: ViewModel;
  routes: RouteObject[];
}

function ViewRouter({ view, routes }: ViewRouterProps) {
  const router = useMemo(() => createMemoryRouter(routes), [routes]);

  useLayoutEffect(() => {
    const sub = view.location$.subscribe((location) => {
      router.navigate(location).catch((err) => {
        console.error("navigate error", err);
      });
    });

    return () => sub.unsubscribe();
  }, [router, view]);

  return <RouterProvider router={router} />;
}

/**
 * ======================
 * Pages
 * ======================
 */

function Home({ view }: { view: ViewModel }) {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 16 }}>
      <h2>Home</h2>

      <button onClick={() => view.navigate("/detail")}>
        Go Detail（外部驱动）
      </button>

      <br />
      <br />

      <button onClick={() => navigate("/detail")}>
        Go Detail（内部 navigate）
      </button>
    </div>
  );
}

function Detail() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 16 }}>
      <h2>Detail</h2>
      <button onClick={() => navigate("/")}>Back Home</button>
    </div>
  );
}

/**
 * ======================
 * Routes
 * ======================
 */
const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home view={viewInstance} />,
  },
  {
    path: "/detail",
    element: <Detail />,
  },
];

/**
 * ======================
 * App Entry
 * ======================
 */

export function MemoryViewApp() {
  return (
    <div style={{ border: "1px solid #ccc", width: 320 }}>
      <ViewRouter view={viewInstance} routes={routes} />
    </div>
  );
}
