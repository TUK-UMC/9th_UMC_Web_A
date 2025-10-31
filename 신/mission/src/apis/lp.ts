import type { PaginationDto } from "../types/common";
import { axiosInstance } from "./axios";
import type { ResponseLpListDto, ResponseLpDetailDto } from "../types/lp";

export const getLpList = async (
  paginationDto: PaginationDto
): Promise<ResponseLpListDto> => {
  const { data } = await axiosInstance.get("/v1/lps", {
    params: paginationDto,
  });

  return data;
};

export const getLpDetail = async (
  lpId: string
): Promise<ResponseLpDetailDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}`);

  return data;
};
