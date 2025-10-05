import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import type { MovieDetailResponse, CreditResponse } from "../types/movie";
import { LoadingSpinner } from "../components/LoadingSpinner";

export default function MovieDetailPage() {
  const [movieDetail, setMovieDetail] = useState<MovieDetailResponse>();
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [credits, setCredits] = useState<CreditResponse>();
  const { movieId } = useParams<{ movieId: string }>();

  const directors =
    credits?.crew.filter((person) => person.job === "Director") || [];
  const cast = credits?.cast.slice(0, 20) || [];
  const allPeople = [...directors, ...cast];

  useEffect(() => {
    const fetchMovieData = async () => {
      setIsPending(true);

      try {
        const [detailResponse, creditsResponse] = await Promise.all([
          axios.get<MovieDetailResponse>(
            `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
            {
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
              },
            }
          ),
          axios.get<CreditResponse>(
            `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
            {
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
              },
            }
          ),
        ]);

        setMovieDetail(detailResponse.data);
        setCredits(creditsResponse.data);
      } catch {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchMovieData();
  }, [movieId]);

  if (isError) {
    return (
      <div className="flex justify-center items-center h-dvh">
        <span className="text-red-500 text-2xl">오류가 발생했습니다.</span>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-dvh">
        <LoadingSpinner />
      </div>
    );
  }

  if (!movieDetail) return null;

  return (
    <div className="relative">
      {/* 배경 이미지 */}
      <div
        className="relative h-[400px] bg-cover bg-center"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movieDetail.backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black"></div>

        {/* 영화 정보 오버레이 */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">{movieDetail.title}</h1>
          <div className="flex gap-4 text-sm mb-3">
            <span>평점 {movieDetail.vote_average.toFixed(1)}</span>
            <span>{new Date(movieDetail.release_date).getFullYear()}</span>
            <span>{movieDetail.runtime}분</span>
          </div>
          <p className="text-lg italic mb-4">{movieDetail.tagline}</p>
          <p className="text-white leading-relaxed mb-8">
            {movieDetail.overview}
          </p>
        </div>
      </div>

      {/* 영화 설명 */}
      <div className="p-8 mx-auto">
        {/* 감독/출연 섹션 */}
        <h2 className="text-2xl font-bold mb-6">감독/출연</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-6">
          {allPeople.map((person) => (
            <div key={person.credit_id} className="flex flex-col items-center">
              <div className="size-24 rounded-full overflow-hidden bg-gray-700 mb-2">
                {person.profile_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                    alt={person.name}
                    className="object-cover"
                  />
                ) : (
                  <svg
                    className="size-24 text-gray-400 object-cover"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <p className="text-sm font-medium text-center">{person.name}</p>
              <p className="text-gray-400 text-xs text-center">
                {"character" in person ? person.character : person.job}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
