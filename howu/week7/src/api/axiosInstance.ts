import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';

const API_BASE_URL = "http://localhost:8000/v1";

// 토큰 갱신 중인지 확인하는 플래그
let isRefreshing = false;
// 토큰 갱신 대기 중인 요청들을 저장하는 배열
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

// 대기 중인 요청들을 처리하는 함수
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// Axios 인스턴스 생성
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 요청 인터셉터 - 토큰을 헤더에 추가
  instance.interceptors.request.use(
    (config) => {
      const userInfo = JSON.parse(localStorage.getItem('user_info') || 'null');
      if (userInfo?.accessToken) {
        config.headers.Authorization = `Bearer ${userInfo.accessToken}`;
      }
      
      // FormData를 사용하는 경우 Content-Type 헤더를 제거
      // 브라우저가 자동으로 boundary를 포함한 Content-Type을 설정함
      if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
      } else {
        // JSON 요청의 경우 Content-Type을 application/json으로 설정
        config.headers['Content-Type'] = 'application/json';
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 응답 인터셉터 - 토큰 만료 시 자동 갱신
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // 401 에러이고, 아직 재시도하지 않은 요청인 경우
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // 이미 토큰 갱신 중이면 대기열에 추가
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return instance(originalRequest);
          }).catch((err) => {
            return Promise.reject(err);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const userInfo = JSON.parse(localStorage.getItem('user_info') || 'null');
          if (!userInfo?.refreshToken) {
            throw new Error('No refresh token available');
          }

          // Refresh Token으로 새로운 Access Token 요청
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken: userInfo.refreshToken,
          });

          const { accessToken, refreshToken } = response.data.data;
          
          // 새로운 토큰을 로컬 스토리지에 저장
          const updatedUserInfo = {
            ...userInfo,
            accessToken,
            refreshToken,
          };
          localStorage.setItem('user_info', JSON.stringify(updatedUserInfo));

          // 대기 중인 요청들을 처리
          processQueue(null, accessToken);

          // 원래 요청을 새로운 토큰으로 재시도
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return instance(originalRequest);

        } catch (refreshError) {
          // 토큰 갱신 실패 시 로그아웃 처리
          processQueue(refreshError, null);
          localStorage.removeItem('user_info');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// Axios 인스턴스 내보내기
export const apiClient = createAxiosInstance();
