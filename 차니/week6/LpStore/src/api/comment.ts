import type {
  ResponseCommentDto,
  ResponseCommentListDto,
} from "../types/comment.types";
import type { CommentDto, CommentPaginationDto } from "../types/common.types";
import { axiosInstance } from "./axios";

export const getCommentList = async (
  commentPaginationDto: CommentPaginationDto
): Promise<ResponseCommentListDto> => {
  const { data } = await axiosInstance.get(
    `/v1/lps/${commentPaginationDto.lpId}/comments`,
    {
      params: commentPaginationDto,
    }
  );

  return data;
};

export const createComment = async (
  commentDto: CommentDto
): Promise<ResponseCommentDto> => {
  const { data } = await axiosInstance.post(
    `/v1/lps/${commentDto.lpId}/comments`,
    {
      content: commentDto.content,
    }
  );

  return data;
};
