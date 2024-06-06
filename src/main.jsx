import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Landing from "./Landing.jsx";
import ErrorPage from "./error-page";
import App from "./page/App.jsx";
import "./index.css";
import Live from "./page/Live.jsx";
import Events from "./page/Events.jsx";
import { Config } from "./page/Config.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/app",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <Navigate to="live" />,
      },
      {
        path: "live",
        element: <Live />,
      },
      {
        path: "events",
        element: <Events />,
      },
      {
        path: "events",
        element: <Events />,
      },
      {
        path: "config",
        element: <Config />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
