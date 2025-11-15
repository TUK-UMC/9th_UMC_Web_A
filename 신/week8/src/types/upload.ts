import type { CommonResponse } from "./common";

export type ResponseUploadDto = CommonResponse<{
  imageUrl: string;
}>;
