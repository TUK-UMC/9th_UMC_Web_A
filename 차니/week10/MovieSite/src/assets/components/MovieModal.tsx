import { XIcon } from "lucide-react";
import type { Movie } from "../types/movie";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const MovieModal = ({ movie, onClose }: MovieModalProps) => {
  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
  const backdropBaseUrl = "https://image.tmdb.org/t/p/original";
  const fallbackImage = "http://via.placeholder.com/640x480";

  const handleIMDbSearch = () => {
    const searchUrl = `https://www.imdb.com/find?q=${encodeURIComponent(
      movie.title
    )}`;
    window.open(searchUrl, "_blank");
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "개봉일 미정";
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${
      date.getMonth() + 1
    }월 ${date.getDate()}일`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-white transition-all hover:bg-gray-900 cursor-pointer"
        >
          <XIcon className="h-6 w-6" />
        </button>

        <div className="relative h-56 w-full overflow-hidden">
          <img
            src={
              movie.backdrop_path
                ? `${backdropBaseUrl}${movie.backdrop_path}`
                : fallbackImage
            }
            alt={`${movie.title} 배경`}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-2xl font-bold text-white drop-shadow-lg">
              {movie.title}
            </h2>
            {movie.original_title !== movie.title && (
              <p className="text-sm text-white/80">{movie.original_title}</p>
            )}
          </div>
        </div>

        <div className="flex gap-6 p-6">
          <div className="hidden flex-shrink-0 sm:block">
            <img
              src={
                movie.poster_path
                  ? `${imageBaseUrl}${movie.poster_path}`
                  : fallbackImage
              }
              alt={`${movie.title} 포스터`}
              className="h-64 w-44 rounded-lg object-cover shadow-lg"
            />
          </div>

          <div className="flex flex-1 flex-col">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-2xl font-bold text-blue-600">
                {movie.vote_average.toFixed(1)}
              </span>
              <span className="text-sm text-gray-500">
                ({movie.vote_count.toLocaleString()} 평가)
              </span>
            </div>

            <div className="mb-4 space-y-4">
              <div className="text-center">
                <p className="text-s font-semibold text-gray-700">개봉일</p>
                <p className="mt-1 text-sm text-gray-600">
                  {formatDate(movie.release_date)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-s font-semibold text-gray-700">인기도</p>
                <div className="mx-auto mt-1 h-2 w-32 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
                    style={{
                      width: `${Math.min(100, movie.popularity / 10)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex-1">
              <p className="mb-2 text-center text-s font-semibold text-gray-700">
                줄거리
              </p>
              <p className="max-h-32 overflow-y-auto text-sm leading-relaxed text-gray-600">
                {movie.overview || "줄거리 정보가 없습니다."}
              </p>
            </div>

            <div className="mt-4 flex justify-center gap-3">
              <button
                onClick={handleIMDbSearch}
                className="rounded-lg bg-blue-500 px-5 py-2 text-sm font-medium text-white transition-all hover:bg-blue-600 hover:shadow-lg cursor-pointer"
              >
                IMDb에서 검색
              </button>
              <button
                onClick={onClose}
                className="rounded-lg border border-blue-500 bg-white px-5 py-2 text-sm font-medium text-blue-500 transition-all hover:bg-gray-50 cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
