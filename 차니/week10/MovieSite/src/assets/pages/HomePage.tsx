import { useCallback, useMemo, useState } from "react";
import MovieFilter from "../components/MovieFilter";
import MovieList from "../components/MovieList";
import useFetch from "../hooks/useFetch";
import type { MovieFilters, MovieResponse } from "../types/movie";

export default function HomePage() {
  const [filters, setFilters] = useState<MovieFilters>({
    query: "어벤져스",
    include_adult: false,
    language: "ko-KR",
  });

  const axiosRequestConfig = useMemo(
    () => ({
      params: filters,
    }),
    [filters]
  );

  const { data, error, isLoading } = useFetch<MovieResponse>(
    "/search/movie",
    axiosRequestConfig
  );

  const handleMovieFilters = useCallback(
    (filters: MovieFilters) => {
      setFilters(filters);
    },
    [setFilters]
  );

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto mt-10 mb-10 space-y-10">
      <MovieFilter onChange={handleMovieFilters} />
      {isLoading ? (
        <div>로딩 중 입니다...</div>
      ) : (
        <MovieList movies={data?.results || []} />
      )}
    </div>
  );
}
