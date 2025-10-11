import { API_CONFIG } from '../config';
import type { MoviesResponse, MovieDetails, Credits } from '../../entities/movie/model/types';

// API 클라이언트
class MovieAPI {
  private baseUrl: string;
  private accessToken: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.accessToken = API_CONFIG.ACCESS_TOKEN || '';
  }

  // 공통 헤더 생성
  private getHeaders = (): HeadersInit => {
    return {
      'Authorization': `Bearer ${this.accessToken}`,
      'accept': 'application/json'
    };
  }

  // 현재 상영중인 영화 조회
  getNowPlaying = async (page = 1): Promise<MoviesResponse> => {
    const response = await fetch(
      `${this.baseUrl}/movie/now_playing?language=ko-KR&page=${page}`,
      {
        method: 'GET',
        headers: this.getHeaders()
      }
    );
    
    if (!response.ok) {
      throw new Error('영화 데이터를 불러오는데 실패했습니다.');
    }
    
    return response.json();
  }

  // 인기 영화 조회
  getPopular = async (page = 1): Promise<MoviesResponse> => {
    const response = await fetch(
      `${this.baseUrl}/movie/popular?language=ko-KR&page=${page}`,
      {
        method: 'GET',
        headers: this.getHeaders()
      }
    );
    
    if (!response.ok) {
      throw new Error('영화 데이터를 불러오는데 실패했습니다.');
    }
    
    return response.json();
  }

  // 평점 높은 영화 조회
  getTopRated = async (page = 1): Promise<MoviesResponse> => {
    const response = await fetch(
      `${this.baseUrl}/movie/top_rated?language=ko-KR&page=${page}`,
      {
        method: 'GET',
        headers: this.getHeaders()
      }
    );
    
    if (!response.ok) {
      throw new Error('영화 데이터를 불러오는데 실패했습니다.');
    }
    
    return response.json();
  }

  // 개봉 예정 영화 조회
  getUpcoming = async (page = 1): Promise<MoviesResponse> => {
    const response = await fetch(
      `${this.baseUrl}/movie/upcoming?language=ko-KR&page=${page}`,
      {
        method: 'GET',
        headers: this.getHeaders()
      }
    );
    
    if (!response.ok) {
      throw new Error('영화 데이터를 불러오는데 실패했습니다.');
    }
    
    return response.json();
  }

  // 영화 상세 정보 조회
  getMovieDetails = async (movieId: number): Promise<MovieDetails> => {
    const response = await fetch(
      `${this.baseUrl}/movie/${movieId}?language=ko-KR`,
      {
        method: 'GET',
        headers: this.getHeaders()
      }
    );
    
    if (!response.ok) {
      throw new Error('영화 상세 정보를 불러오는데 실패했습니다.');
    }
    
    return response.json();
  }

  // 영화 출연진/제작진 조회
  getMovieCredits = async (movieId: number): Promise<Credits> => {
    const response = await fetch(
      `${this.baseUrl}/movie/${movieId}/credits?language=ko-KR`,
      {
        method: 'GET',
        headers: this.getHeaders()
      }
    );
    
    if (!response.ok) {
      throw new Error('영화 출연진/제작진 정보를 불러오는데 실패했습니다.');
    }
    
    return response.json();
  }
}

export const movieApi = new MovieAPI();
