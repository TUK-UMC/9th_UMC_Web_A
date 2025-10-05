import { useEffect, useState } from "react";
import { tmdbAPI } from "../api/api";
import type { Movie, MovieResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";

export default function MoviePage() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async (): Promise<void> => {
      const { data } = await tmdbAPI.get<MovieResponse>(
        "https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1"
      );

      setMovies(data.results);
    };

    fetchMovies();
  }, []);

  return (
    <div className="select-none grid p-10 gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {movies.map((movie) => {
        return <MovieCard key={movie.id} movie={movie} />;
      })}
    </div>
  );
}
