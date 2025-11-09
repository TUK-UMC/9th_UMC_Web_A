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

/**
 * 프로필 수정 요청 타입
 */
export interface UpdateProfileRequest {
  name: string;
  bio?: string | null;
  avatar?: string | null;
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
 * 프로필 수정 API 함수
 */
export async function updateUserProfile(data: UpdateProfileRequest): Promise<ApiResponse<UserProfileData>> {
  try {
    const response = await apiClient.put('/users/me', data);
    return response.data;
  } catch (error) {
    console.error("Failed to update user profile:", error);
    throw error;
  }
}
