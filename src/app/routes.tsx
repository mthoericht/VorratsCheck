import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RouteErrorBoundary } from "./components/RouteErrorBoundary";
import { Dashboard } from "./pages/Dashboard";
import { Inventory } from "./pages/Inventory";
import { MustHaveList } from "./pages/MustHaveList";
import { WishList } from "./pages/WishList";
import { Deals } from "./pages/Deals";
import { Recipes } from "./pages/Recipes";
import { SettingsCategories } from "./components/settings/SettingsCategories";
import { Settings } from "./pages/Settings";
import { SettingsAppearance } from "./components/settings/SettingsAppearance";
import { SettingsLanguage } from "./components/settings/SettingsLanguage";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/signup",
    Component: Signup,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, Component: Dashboard },
      { path: "inventory", Component: Inventory },
      { path: "must-have", Component: MustHaveList },
      { path: "wishlist", Component: WishList },
      { path: "deals", Component: Deals },
      { path: "recipes", Component: Recipes },
      {
        path: "settings",
        Component: Settings,
        children: [
          { index: true, element: <Navigate to="/settings/categories" replace /> },
          { path: "categories", Component: SettingsCategories },
          { path: "appearance", Component: SettingsAppearance },
          { path: "language", Component: SettingsLanguage },
        ],
      },
    ],
  },
]);
