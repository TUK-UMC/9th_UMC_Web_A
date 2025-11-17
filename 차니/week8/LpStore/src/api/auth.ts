import type {
  RequestSigninDto,
  RequestSignupDto,
  RequestUpdateMeDto,
  ResponseMyInfoDto,
  ResponseSigninDto,
  ResponseSignupDto,
} from "../types/auth.types";
import { axiosInstance } from "./axios";

// 회원가입 API
export const postSignup = async (
  body: RequestSignupDto
): Promise<ResponseSignupDto> => {
  const { data } = await axiosInstance.post("/v1/auth/signup", body);

  return data;
};

// 로그인 API
export const postSignin = async (
  body: RequestSigninDto
): Promise<ResponseSigninDto> => {
  const { data } = await axiosInstance.post("/v1/auth/signin", body);

  return data;
};

// 내 정보 조회 API
export const getMyInfo = async (): Promise<ResponseMyInfoDto> => {
  const { data } = await axiosInstance.get("/v1/users/me");

  return data;
};

// 내 정보 수정 API
export const patchMyInfo = async (
  body: RequestUpdateMeDto
): Promise<ResponseMyInfoDto> => {
  const { data } = await axiosInstance.patch("/v1/users", body);
  return data;
};

// 로그아웃 API
export const postLogout = async () => {
  const { data } = await axiosInstance.post("/v1/auth/signout");

  return data;
};

// 회원 탈퇴 API
export const deleteUser = async (): Promise<void> => {
  await axiosInstance.delete("/v1/users");
};
