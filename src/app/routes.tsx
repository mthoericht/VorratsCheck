import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Dashboard } from "./pages/Dashboard";
import { Inventory } from "./pages/Inventory";
import { MustHaveList } from "./pages/MustHaveList";
import { WishList } from "./pages/WishList";
import { Deals } from "./pages/Deals";
import { Recipes } from "./pages/Recipes";
import { Categories } from "./pages/Categories";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: Signup,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: Dashboard },
      { path: "inventory", Component: Inventory },
      { path: "must-have", Component: MustHaveList },
      { path: "wishlist", Component: WishList },
      { path: "deals", Component: Deals },
      { path: "recipes", Component: Recipes },
      { path: "categories", Component: Categories },
    ],
  },
]);
