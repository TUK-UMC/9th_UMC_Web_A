import { apiClient } from './axiosInstance';
import type { ApiResponse, LpListResponse, LpListParams, LpDetail, LpItem } from '../types/auth';

/**
 * LP 목록 조회 API
 */
export async function fetchLpList(params: LpListParams = {}): Promise<ApiResponse<LpListResponse>> {
  const queryParams = new URLSearchParams();
  
  if (params.cursor !== undefined) {
    queryParams.append('cursor', params.cursor.toString());
  }
  if (params.limit !== undefined) {
    queryParams.append('limit', params.limit.toString());
  }
  if (params.search) {
    queryParams.append('search', params.search);
  }
  if (params.order) {
    queryParams.append('order', params.order);
  }

  const queryString = queryParams.toString();
  const url = `/lps${queryString ? `?${queryString}` : ''}`;
  
  const response = await apiClient.get(url);
  return response.data;
}

/**
 * LP 상세 조회 API
 */
export async function fetchLpDetail(lpId: number): Promise<ApiResponse<LpDetail>> {
  const response = await apiClient.get(`/lps/${lpId}`);
  return response.data;
}

/**
 * LP 생성 요청 타입
 */
export interface CreateLpRequest {
  title: string;
  content: string;
  thumbnail: string; // URL 문자열 (스펙에 맞춤)
  tags?: string[];
  published?: boolean;
}

/**
 * 파일을 base64 데이터 URL로 변환하는 유틸리티 함수
 */
export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * LP 생성 API
 * 스펙: application/json 형식으로 요청
 */
export async function createLp(data: CreateLpRequest): Promise<ApiResponse<LpItem>> {
  // 스펙에 맞게 JSON 형식으로 요청
  const requestBody = {
    title: data.title,
    content: data.content,
    thumbnail: data.thumbnail, // URL 문자열
    tags: data.tags || [],
    published: data.published ?? true,
  };

  // 디버깅: 요청 본문 확인 (개발 환경에서만)
  if (process.env.NODE_ENV === 'development') {
    console.log('LP 생성 요청:', {
      ...requestBody,
      thumbnail: requestBody.thumbnail.substring(0, 50) + '...', // 긴 데이터 URL 일부만 표시
    });
  }

  const response = await apiClient.post('/lps', requestBody);
  return response.data;
}

/**
 * LP 업데이트 요청 타입
 */
export interface UpdateLpRequest {
  title?: string;
  content?: string;
  thumbnail?: string;
  tags?: string[];
  published?: boolean;
}

/**
 * LP 정보 업데이트 API
 */
export async function updateLp(lpId: number, data: UpdateLpRequest): Promise<ApiResponse<LpItem>> {
  const response = await apiClient.patch(`/lps/${lpId}`, data);
  return response.data;
}

/**
 * LP 삭제 API
 */
export async function deleteLp(lpId: number): Promise<ApiResponse<boolean>> {
  const response = await apiClient.delete(`/lps/${lpId}`);
  return response.data;
}

/**
 * LP 좋아요 추가 API
 */
export async function likeLp(lpId: number): Promise<ApiResponse<any>> {
  const response = await apiClient.post(`/lps/${lpId}/likes`);
  return response.data;
}

/**
 * LP 좋아요 취소 API
 */
export async function unlikeLp(lpId: number): Promise<ApiResponse<any>> {
  const response = await apiClient.delete(`/lps/${lpId}/likes`);
  return response.data;
}

