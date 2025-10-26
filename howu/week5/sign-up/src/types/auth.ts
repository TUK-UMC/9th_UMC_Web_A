// API 응답 타입
export interface ApiResponse<T = any> {
  status: boolean;
  statusCode: number;
  message: string;
  data: T | null;
}

// 로그인 응답 타입
export interface LoginResponseData {
  id: number;
  name: string;
  accessToken: string;
  refreshToken: string;
}

// 회원가입 응답 타입
export interface SignupResponseData {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

// 회원가입 요청 타입
export interface SignupRequestData {
  name: string;
  email: string;
  password: string;
  bio?: string | null;
  avatar?: string | null;
}

// 로그인 요청 타입
export interface LoginRequestData {
  email: string;
  password: string;
}

// 로컬 스토리지에 저장될 사용자 정보 타입
export interface UserInfo {
  id: number;
  name: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}

// 회원가입 단계별 데이터 타입
export interface SignupStepData {
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
  avatar?: string;
}

// 마이페이지 사용자 정보 타입
export interface UserProfileData {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}
