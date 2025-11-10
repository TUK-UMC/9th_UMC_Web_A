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

/**
 * 로그아웃 API
 */
export async function logoutUser(): Promise<ApiResponse<null>> {
  const response = await apiClient.post('/auth/signout');
  return response.data;
}

/**
 * Google 로그인 시작 - Google 인증 페이지로 리다이렉트
 */
export function startGoogleLogin(): void {
  window.location.href = 'http://localhost:8000/v1/auth/google/login';
}

/**
 * 회원 탈퇴 API
 */
export async function deleteUser(): Promise<ApiResponse<null>> {
  const response = await apiClient.delete('/users/me');
  return response.data;
}

