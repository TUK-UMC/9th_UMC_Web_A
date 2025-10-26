import { apiClient } from './axiosInstance';
import type { ApiResponse, UserProfileData } from "../types/auth";

/**
 * 사용자 정보를 조회하는 API 함수
 * Axios 인터셉터가 자동으로 토큰 갱신을 처리합니다.
 */
export async function fetchUserProfile(): Promise<ApiResponse<UserProfileData>> {
  try {
    const response = await apiClient.get('/users/me');
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    throw new Error("사용자 정보를 불러오는데 실패했습니다.");
  }
}
