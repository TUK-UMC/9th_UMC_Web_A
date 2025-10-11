// 영화 데이터 타입
export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult: boolean;
  genre_ids: number[];
  original_language: string;
  original_title: string;
  video: boolean;
}

// 영화 상세 정보 타입
export interface MovieDetails extends Movie {
  genres: Genre[];
  runtime: number;
  budget: number;
  revenue: number;
  status: string;
  tagline: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
}

// 장르 타입
export interface Genre {
  id: number;
  name: string;
}

// 제작사 타입
export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

// 제작 국가 타입
export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

// 언어 타입
export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

// 출연진/제작진 타입
export interface Credits {
  id: number;
  cast: Cast[];
  crew: Crew[];
}

// 배우 타입
export interface Cast {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

// 제작진 타입
export interface Crew {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  credit_id: string;
  department: string;
  job: string;
}

// API 응답 타입
export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}
