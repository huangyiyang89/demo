import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from "./error-page";
import App from "./page/App.jsx";
import Live from "./page/Live.jsx";
import Events from "./page/Events.jsx";
import { Config } from "./page/Config.jsx";
import EventVideoPlayer from "./page/EventVideoPlayer.jsx";
import Replay from "./page/Replay.jsx";
import Cameras from "./page/Cameras.jsx";
import Statistic from "./page/Statistic.jsx";

const router = createBrowserRouter([
  {
    path: "/",
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
        children: [
          {
            path: ":id",
            element: <EventVideoPlayer />,
          },
        ],
      },
      {
        path: "config",
        element: <Config />,
      },
      {
        path: "event",
        element: <EventVideoPlayer />,
      },
      {
        path: "replay",
        element: <Replay />,
      },
      {
        path: "cameras",
        element: <Cameras />,
      },
      {
        path: "statistic",
        element: <Statistic />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
