import { apiClient } from './axiosInstance';
import type { ApiResponse, LoginRequestData, LoginResponseData, SignupRequestData, SignupResponseData } from '../types/auth';

/**
 * 로그인 API
 */
export async function loginUser(data: LoginRequestData): Promise<ApiResponse<LoginResponseData>> {
  const response = await apiClient.post('/auth/signin', data);
  return response.data;
}

/**
 * 회원가입 API
 */
export async function signupUser(data: SignupRequestData): Promise<ApiResponse<SignupResponseData>> {
  const response = await apiClient.post('/auth/signup', data);
  return response.data;
}

/**
 * 토큰 갱신 API
 */
export async function refreshToken(refreshToken: string): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> {
  const response = await apiClient.post('/auth/refresh', { refreshToken });
  return response.data;
}
