import { apiClient } from './axiosInstance';
import type { ApiResponse, CommentListResponse, CommentListParams, Comment } from '../types/auth';

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

/**
 * 댓글 생성 요청 타입
 */
export interface CreateCommentRequest {
  content: string;
}

/**
 * 댓글 생성 API
 */
export async function createComment(
  lpId: number,
  data: CreateCommentRequest
): Promise<ApiResponse<Comment>> {
  const response = await apiClient.post(`/lps/${lpId}/comments`, data);
  return response.data;
}

/**
 * 댓글 수정 요청 타입
 */
export interface UpdateCommentRequest {
  content: string;
}

/**
 * 댓글 수정 API
 */
export async function updateComment(
  lpId: number,
  commentId: number,
  data: UpdateCommentRequest
): Promise<ApiResponse<Comment>> {
  const response = await apiClient.put(`/lps/${lpId}/comments/${commentId}`, data);
  return response.data;
}

/**
 * 댓글 삭제 API
 */
export async function deleteComment(
  lpId: number,
  commentId: number
): Promise<ApiResponse<void>> {
  const response = await apiClient.delete(`/lps/${lpId}/comments/${commentId}`);
  return response.data;
}

