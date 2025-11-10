import type { PaginationDto } from "../types/common.types";
import type {
  CreateLpBody,
  ResponseLpDetailDto,
  ResponseLpListDto,
  UpdateLpBody,
} from "../types/lp.types";
import { axiosInstance } from "./axios";

// LP 목록 조회 API
export const getLpList = async (
  paginationDto: PaginationDto
): Promise<ResponseLpListDto> => {
  const { data } = await axiosInstance.get("/v1/lps", {
    params: paginationDto,
  });

  return data;
};

// LP 상세 조회 API
export const getLpDetail = async (
  lpId: string
): Promise<ResponseLpDetailDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}`);

  return data;
};

// LP 생성 API
export const createLp = async (body: CreateLpBody) => {
  const { data } = await axiosInstance.post("/v1/lps", body);
  return data;
};

// LP 수정 API
export const updateLp = async (
  lpId: number,
  body: UpdateLpBody
): Promise<ResponseLpDetailDto> => {
  const { data } = await axiosInstance.patch(`/v1/lps/${lpId}`, body);
  return data;
};

// LP 삭제 API
export const deleteLp = async (lpId: number): Promise<boolean> => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}`);
  return Boolean(data?.data);
};

// 이미지 업로드(인증) API
export const uploadImage = async (file: File): Promise<string> => {
  const form = new FormData();
  form.append("file", file);

  const { data } = await axiosInstance.post("/v1/uploads", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  const url = data?.data?.imageUrl;
  if (!url) throw new Error("imageUrl이 응답에 없습니다.");
  return url as string;
};

// 좋아요 추가
export const postLike = async (lpId: number) => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/likes`);
  return data as {
    status: boolean;
    statusCode: number;
    message: string;
    data: { id: number; userId: number; lpId: number };
  };
};

// 좋아요 취소
export const deleteLike = async (lpId: number) => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);
  return data as {
    status: boolean;
    statusCode: number;
    message: string;
    data: { id: number; userId: number; lpId: number };
  };
};
