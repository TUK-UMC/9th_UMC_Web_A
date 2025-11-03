import type { PaginationDto } from "../types/common.types";
import type { ResponseLpDetailDto, ResponseLpListDto } from "../types/lp.types";
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
