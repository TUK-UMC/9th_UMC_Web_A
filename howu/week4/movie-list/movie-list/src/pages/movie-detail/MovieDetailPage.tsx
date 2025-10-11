import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getImageUrl } from '../../shared/config';
import { movieApi } from '../../shared/api';
import type { MovieDetails, Credits } from '../../entities/movie/model/types';

export const MovieDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      if (!id) {
        setError('영화 ID가 제공되지 않았습니다.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const movieId = parseInt(id);
        
        // 영화 상세 정보와 출연진/제작진 정보를 병렬로 가져오기
        const [movieDetails, movieCredits] = await Promise.all([
          movieApi.getMovieDetails(movieId),
          movieApi.getMovieCredits(movieId)
        ]);
        
        setMovie(movieDetails);
        setCredits(movieCredits);
        setError(null);
      } catch (err) {
        setError('영화 정보를 불러오는데 실패했습니다.');
        console.error('Error fetching movie:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetail();
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">로딩 중...</div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">{error || '영화를 찾을 수 없습니다.'}</div>
          <button
            onClick={handleGoBack}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  const backdropUrl = getImageUrl(movie.backdrop_path, 'LARGE');
  const posterUrl = getImageUrl(movie.poster_path, 'LARGE');

  return (
    <div className="min-h-screen bg-gray-900">
      {/* 배경 이미지 */}
      {backdropUrl && (
        <div className="absolute inset-0 z-0">
          <img
            src={backdropUrl}
            alt={movie.title}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
      )}

      {/* 콘텐츠 */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={handleGoBack}
          className="mb-6 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          ← 돌아가기
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* 포스터 */}
          <div className="flex-shrink-0">
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={movie.title}
                className="w-80 h-auto rounded-lg shadow-2xl"
              />
            ) : (
              <div className="w-80 h-[480px] bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
          </div>

          {/* 영화 정보 */}
          <div className="flex-1 text-white">
            <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400">⭐</span>
                <span className="text-xl font-semibold">
                  {movie.vote_average.toFixed(1)}
                </span>
                <span className="text-gray-400">
                  ({movie.vote_count.toLocaleString()}명 평가)
                </span>
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-gray-300">{movie.release_date}</span>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">줄거리</h3>
              <p className="text-gray-300 leading-relaxed">
                {movie.overview || '줄거리 정보가 없습니다.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
              <div>
                <span className="text-gray-400">원제:</span>
                <span className="ml-2 text-white">{movie.original_title}</span>
              </div>
              <div>
                <span className="text-gray-400">언어:</span>
                <span className="ml-2 text-white">{movie.original_language.toUpperCase()}</span>
              </div>
              <div>
                <span className="text-gray-400">인기도:</span>
                <span className="ml-2 text-white">{movie.popularity.toFixed(0)}</span>
              </div>
              <div>
                <span className="text-gray-400">성인 등급:</span>
                <span className="ml-2 text-white">{movie.adult ? '19+' : '전체관람가'}</span>
              </div>
              <div>
                <span className="text-gray-400">상영시간:</span>
                <span className="ml-2 text-white">{movie.runtime}분</span>
              </div>
              <div>
                <span className="text-gray-400">장르:</span>
                <span className="ml-2 text-white">
                  {movie.genres.map(genre => genre.name).join(', ')}
                </span>
              </div>
            </div>

            {/* 출연진 */}
            {credits && credits.cast.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">주요 출연진</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {credits.cast.slice(0, 12).map((actor) => (
                    <div key={actor.id} className="text-center">
                      <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                        {actor.profile_path ? (
                          <img
                            src={getImageUrl(actor.profile_path, 'SMALL')}
                            alt={actor.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-400 text-xs">No Image</span>
                        )}
                      </div>
                      <p className="text-white text-sm font-medium truncate">{actor.name}</p>
                      <p className="text-gray-400 text-xs truncate">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 제작진 */}
            {credits && credits.crew.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">제작진</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {credits.crew
                    .filter(member => ['Director', 'Producer', 'Writer', 'Screenplay'].includes(member.job))
                    .slice(0, 8)
                    .map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center flex-shrink-0">
                        {member.profile_path ? (
                          <img
                            src={getImageUrl(member.profile_path, 'SMALL')}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-400 text-xs">No Image</span>
                        )}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{member.name}</p>
                        <p className="text-gray-400 text-xs">{member.job}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
