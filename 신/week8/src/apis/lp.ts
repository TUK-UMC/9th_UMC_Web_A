import type { CommonResponse, PaginationDto } from "../types/common";
import { axiosInstance } from "./axios";
import type {
  ResponseLpListDto,
  ResponseLpDetailDto,
  RequestLpDto,
  ResponseLikeLpDto,
  RequestPostLpDto,
  ResponsePostLpDto,
  RequestPatchLpDto,
  ResponsePatchLpDto,
} from "../types/lp";

export const getLpList = async (
  paginationDto: PaginationDto
): Promise<ResponseLpListDto> => {
  const { data } = await axiosInstance.get("/v1/lps", {
    params: paginationDto,
  });

  return data;
};

export const getLpDetail = async ({
  lpId,
}: RequestLpDto): Promise<ResponseLpDetailDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}`);

  return data;
};

export const postLike = async ({
  lpId,
}: RequestLpDto): Promise<ResponseLikeLpDto> => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/likes`);

  return data;
};

export const deleteLike = async ({
  lpId,
}: RequestLpDto): Promise<ResponseLikeLpDto> => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);

  return data;
};

export const postLp = async ({
  title,
  content,
  thumbnail,
  tags,
  published,
}: RequestPostLpDto): Promise<ResponsePostLpDto> => {
  const { data } = await axiosInstance.post(`/v1/lps`, {
    title,
    content,
    thumbnail,
    tags,
    published,
  });

  return data;
};

export const patchLp = async ({
  lpId,
  title,
  content,
  thumbnail,
  tags,
  published,
}: RequestPatchLpDto): Promise<ResponsePatchLpDto> => {
  const { data } = await axiosInstance.patch(`/v1/lps/${lpId}`, {
    title,
    content,
    thumbnail,
    tags,
    published,
  });

  return data;
};

export const deleteLp = async ({
  lpId,
}: RequestLpDto): Promise<CommonResponse<boolean>> => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}`);

  return data;
};
