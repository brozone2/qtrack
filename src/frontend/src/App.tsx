import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { Layout } from "./components/Layout";
import { LoadingSpinner } from "./components/LoadingSpinner";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const CreateTemplate = lazy(() => import("./pages/CreateTemplate"));
const TemplateDetail = lazy(() => import("./pages/TemplateDetail"));

function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <LoadingSpinner size="lg" data-ocid="app.page_loading_state" />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Dashboard,
});

const newTemplateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/template/new",
  component: CreateTemplate,
});

const templateDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/template/$id",
  component: TemplateDetail,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  newTemplateRoute,
  templateDetailRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
