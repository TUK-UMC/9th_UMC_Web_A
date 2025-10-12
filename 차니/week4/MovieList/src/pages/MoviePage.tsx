import { useState } from "react";
import type { Movie, MovieResponse } from "../types/movie.types";
import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";
import Pagination from "../components/Pagination";
import { useCustomFetch } from "../hooks/useCustomFetch";

export default function MoviePage() {
  const [page, setPage] = useState(1);

  const { category } = useParams<{ category: string }>();

  const { data, isPending, isError } = useCustomFetch<MovieResponse>(
    category ? `/movie/${category}` : null,
    { language: "ko-KR", page },
    [page, category]
  );

  const movies: Movie[] = data?.results ?? [];

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
