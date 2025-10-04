// 라우트 경로 상수
export const ROUTES = {
  HOME: "/",
  POPULAR: "popular",
  TOP_RATED: "top-rated", 
  UPCOMING: "upcoming",
  NOW_PLAYING: "now-playing",
  MOVIE_DETAIL: "movie/:id",
} as const;

// 라우트 경로 생성 헬퍼 함수
export const createMovieDetailPath = (id: number | string) => `/movie/${id}`;
