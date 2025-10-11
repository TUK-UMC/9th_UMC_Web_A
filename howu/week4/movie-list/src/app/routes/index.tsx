import { AppLayout } from "./layouts";
import { HomePage } from "../../pages/home";
import { MovieDetailPage } from "../../pages/movie-detail";
import { ROUTES } from "../../shared/config/routes";

export const AppRoutes = [
  {
    path: ROUTES.HOME,
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: ROUTES.POPULAR,
        element: <HomePage />,
      },
      {
        path: ROUTES.TOP_RATED,
        element: <HomePage />,
      },
      {
        path: ROUTES.UPCOMING,
        element: <HomePage />,
      },
      {
        path: ROUTES.NOW_PLAYING,
        element: <HomePage />,
      },
      {
        path: ROUTES.MOVIE_DETAIL,
        element: <MovieDetailPage />,
      },
    ],
  },
];
