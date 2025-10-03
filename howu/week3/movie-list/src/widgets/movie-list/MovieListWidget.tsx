import { useState, useEffect } from "react";
import { movieApi } from "../../shared/api";
import { MovieCard } from "../../entities/movie";
import { useMovieContext } from "../../shared/contexts";
import type { Movie } from "../../entities/movie";

// 카테고리 정보
const CATEGORIES = {
  now_playing: { label: '상영 중', api: movieApi.getNowPlaying },
  popular: { label: '인기 영화', api: movieApi.getPopular },
  top_rated: { label: '평점 높은', api: movieApi.getTopRated },
  upcoming: { label: '개봉 예정', api: movieApi.getUpcoming },
} as const;

export const MovieListWidget = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentCategory, currentPage, setTotalPages } = useMovieContext();

  const fetchMovies = async (category: keyof typeof CATEGORIES, page: number = 1) => {
    try {
      setLoading(true);
      const response = await CATEGORIES[category].api(page);
      setMovies(response.results);
      setTotalPages(response.total_pages);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "영화를 불러오는데 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(currentCategory, currentPage);
  }, [currentCategory, currentPage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">로딩중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 영화 목록 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};
