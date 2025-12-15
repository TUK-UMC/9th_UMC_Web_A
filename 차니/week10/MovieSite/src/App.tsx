import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import HomePage from "./assets/pages/HomePage";
import MovieDetailPage from "./assets/pages/MovieDetailPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/:id",
    element: <MovieDetailPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
