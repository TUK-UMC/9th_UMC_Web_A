import { apiClient } from './axiosInstance';
import type { ApiResponse, CommentListResponse, CommentListParams } from '../types/auth';

/**
 * 댓글 목록 조회 API
 */
export async function fetchCommentList(
  lpId: number,
  params: CommentListParams = {}
): Promise<ApiResponse<CommentListResponse>> {
  const queryParams = new URLSearchParams();
  
  if (params.cursor !== undefined) {
    queryParams.append('cursor', params.cursor.toString());
  }
  if (params.limit !== undefined) {
    queryParams.append('limit', params.limit.toString());
  }
  if (params.order) {
    queryParams.append('order', params.order);
  }

  const queryString = queryParams.toString();
  const url = `/lps/${lpId}/comments${queryString ? `?${queryString}` : ''}`;
  
  const response = await apiClient.get(url);
  return response.data;
}

