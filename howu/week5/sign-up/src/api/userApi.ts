import type { ApiResponse, UserProfileData } from "../types/auth";

const API_BASE_URL = "http://localhost:8000/v1";

/**
 * 사용자 정보를 조회하는 API 함수
 */
export async function fetchUserProfile(accessToken: string): Promise<ApiResponse<UserProfileData>> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
    });

    const result: ApiResponse<UserProfileData> = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    throw new Error("사용자 정보를 불러오는데 실패했습니다.");
  }
}
