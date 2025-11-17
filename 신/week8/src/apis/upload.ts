import type { ResponseUploadDto } from "../types/upload";
import { axiosInstance } from "./axios";

export const uploadImage = async (
  formData: FormData
): Promise<ResponseUploadDto> => {
  const { data } = await axiosInstance.post(`/v1/uploads`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};
