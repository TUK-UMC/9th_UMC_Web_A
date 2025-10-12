import { useMemo } from "react";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import type { MovieDetails } from "../types/movieDetails.types";
import type { Credits, CastMember, CrewMember } from "../types/credit.types";
import PersonCard from "../components/PersonCard";
import { useCustomFetch } from "../hooks/useCustomFetch";

type PersonItem = {
  id: string;
  name: string;
  role?: string;
  profilePath: string | null;
  sort: number;
};

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();

  const {
    data: movieDetails,
    isPending: pendingDetails,
    isError: errorDetails,
  } = useCustomFetch<MovieDetails>(
    movieId ? `/movie/${movieId}` : null,
    { language: "ko-KR" },
    [movieId]
  );
  const {
    data: movieCredits,
    isPending: pendingCredits,
    isError: errorCredits,
  } = useCustomFetch<Credits>(
    movieId ? `/movie/${movieId}/credits` : null,
    { language: "ko-KR" },
    [movieId]
  );

  const isPending = pendingDetails || pendingCredits;
  const isError = errorDetails || errorCredits;

  const year = useMemo(
    () =>
      movieDetails?.release_date ? movieDetails.release_date.slice(0, 4) : "",
    [movieDetails]
  );

  const people: PersonItem[] = useMemo(() => {
    const directors: PersonItem[] = (movieCredits?.crew ?? [])
      .filter((c: CrewMember) => c.job === "Director")
      .map((d) => ({
        id: d.credit_id,
        name: d.name,
        role: d.job,
        profilePath: d.profile_path,
        sort: 0,
      }));

    const cast: PersonItem[] = (movieCredits?.cast ?? [])
      .slice(0, 30)
      .map((c: CastMember) => ({
        id: c.credit_id,
        name: c.name,
        role: c.character,
        profilePath: c.profile_path,
        sort: 1,
      }));

    return [...directors, ...cast];
  }, [movieCredits]);

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-red-500 text-2xl">에러가 발생했습니다.</span>
      </div>
    );
  }

  if (isPending || !movieDetails || !movieCredits) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black text-white flex flex-col p-10 gap-8">
      <div className="relative h-[400px] w-full overflow-hidden">
        <img
          src={`https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}`}
          alt={`${movieDetails.title} 배경`}
          className="absolute inset-0 w-full h-full object-cover rounded-xl"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative h-full w-full flex flex-col items-start justify-center">
          <div className="w-full flex flex-col gap-4 p-6">
            <span className="text-4xl font-extrabold tracking-tight">
              {movieDetails.title}
            </span>
            <div className="flex text-lg">
              <span>평균 {movieDetails.vote_average.toFixed(1)}</span>
              <span>ㆍ{year}년ㆍ</span>
              {movieDetails.runtime ? (
                <span>{movieDetails.runtime}분</span>
              ) : null}
            </div>
            {movieDetails.tagline ? (
              <span className="text-3xl font-bold font-style: italic">
                {movieDetails.tagline}
              </span>
            ) : null}
            {movieDetails.overview ? (
              <span className="text-base font-medium mt-4 line-clamp-1 sm:line-clamp-4 md:line-clamp-5 lg:line-clamp-6 xl:line-clamp-none 2xl:line-clamp-none">
                {movieDetails.overview}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="h-full w-full flex flex-col gap-6">
          <span className="text-4xl font-bold">감독 / 출연</span>

          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-x-4 gap-y-10">
              {people
                .sort((a, b) => a.sort - b.sort)
                .map((p) => (
                  <PersonCard
                    key={p.id}
                    name={p.name}
                    role={p.role}
                    profilePath={p.profilePath}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
