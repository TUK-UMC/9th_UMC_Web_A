import { getImageUrl } from '../../../shared/config';
import type { Movie } from '../model';

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard = ({ movie }: MovieCardProps) => {
  const imageUrl = getImageUrl(movie.poster_path, 'MEDIUM');
  
  return (
    <div className="relative group cursor-pointer overflow-hidden rounded-lg transition-transform hover:scale-105">
      {/* 포스터 이미지 */}
      <div className="aspect-[2/3] w-full">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
      </div>

      {/* 호버 시 정보 표시 */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-80 transition-all duration-300 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100">
        <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
          {movie.title}
        </h3>
        <p className="text-gray-300 text-sm mb-2">
          개봉일: {movie.release_date}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-yellow-400">⭐</span>
          <span className="text-white font-semibold">
            {movie.vote_average.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
};

