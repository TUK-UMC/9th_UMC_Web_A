import { useEffect } from "react";
import { movieApi } from "../../shared/api";
import { MovieCard } from "../../entities/movie";
import { useMovieContext } from "../../shared/contexts";
import { useCustomFetch } from "../../shared/hooks";
import type { MoviesResponse } from "../../entities/movie/model";

// 카테고리 정보
const CATEGORIES = {
  now_playing: { label: '상영 중', api: movieApi.getNowPlaying },
  popular: { label: '인기 영화', api: movieApi.getPopular },
  top_rated: { label: '평점 높은', api: movieApi.getTopRated },
  upcoming: { label: '개봉 예정', api: movieApi.getUpcoming },
} as const;

export const MovieListWidget = () => {
  const { currentCategory, currentPage, setTotalPages } = useMovieContext();

  // 커스텀 훅 사용
  const { data: moviesResponse, loading, error } = useCustomFetch<MoviesResponse>(
    () => CATEGORIES[currentCategory].api(currentPage),
    { dependencies: [currentCategory, currentPage] }
  );

  // 총 페이지 수 업데이트
  useEffect(() => {
    if (moviesResponse) {
      setTotalPages(moviesResponse.total_pages);
    }
  }, [moviesResponse, setTotalPages]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-white text-xl">영화를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
          <p className="text-gray-400">잠시 후 다시 시도해주세요.</p>
        </div>
      </div>
    );
  }

  if (!moviesResponse || moviesResponse.results.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">영화 정보가 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 영화 목록 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {moviesResponse.results.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};
