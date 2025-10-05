import { useEffect, useState } from "react";
import { tmdbAPI } from "../api/api";
import type { Movie, MovieResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";
import Pagination from "../components/Pagination";

export default function MoviePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  // 로딩 상태
  const [isPending, setIsPending] = useState(false);
  // 에러 상태
  const [isError, setIsError] = useState(false);
  // 페이지 상태
  const [page, setPage] = useState(1);

  const { category } = useParams<{ category: string }>();

  useEffect(() => {
    const fetchMovies = async (): Promise<void> => {
      setIsPending(true);

      try {
        const { data } = await tmdbAPI.get<MovieResponse>(
          `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`
        );

        setMovies(data.results);
      } catch {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchMovies();
  }, [page, category]);

  if (isError) {
    return (
      <div>
        <span className="text-red-500 text-2xl">에러가 발생했습니다.</span>
      </div>
    );
  }

  return (
    <>
      <Pagination page={page} onChange={setPage} disabled={isPending} />

      {isPending && (
        <div className="flex items-center justify-center h-dvh">
          <LoadingSpinner />
        </div>
      )}

      {!isPending && (
        <div className="select-none grid p-10 gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {movies.map((movie) => {
            return <MovieCard key={movie.id} movie={movie} />;
          })}
        </div>
      )}
    </>
  );
}
