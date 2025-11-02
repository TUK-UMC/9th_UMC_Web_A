import { apiClient } from './axiosInstance';
import type { ApiResponse, LpListResponse, LpListParams, LpDetail } from '../types/auth';

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

