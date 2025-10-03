import { API_CONFIG } from '../config';
import type { MoviesResponse } from '../../entities/movie/model';

// API 클라이언트
class MovieAPI {
  private baseUrl: string;
  private accessToken: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.accessToken = API_CONFIG.ACCESS_TOKEN || '';
  }

  // 공통 헤더 생성
  private getHeaders(): HeadersInit {
    return {
      'Authorization': `Bearer ${this.accessToken}`,
      'accept': 'application/json'
    };
  }

  // 현재 상영중인 영화 조회
  async getNowPlaying(page = 1): Promise<MoviesResponse> {
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
  async getPopular(page = 1): Promise<MoviesResponse> {
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
  async getTopRated(page = 1): Promise<MoviesResponse> {
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
  async getUpcoming(page = 1): Promise<MoviesResponse> {
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
}

export const movieApi = new MovieAPI();
