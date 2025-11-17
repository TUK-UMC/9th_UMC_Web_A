import type {
  DeleteCommentDto,
  ResponseCommentDto,
  ResponseCommentListDto,
  ResponseDeleteCommentDto,
  UpdateCommentDto,
} from "../types/comment";
import type { CommentDto, CommentPaginationDto } from "../types/common";
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

export const updateComment = async (
  updateCommentDto: UpdateCommentDto
): Promise<ResponseCommentDto> => {
  const { data } = await axiosInstance.patch(
    `/v1/lps/${updateCommentDto.lpId}/comments/${updateCommentDto.commentId}`,
    {
      content: updateCommentDto.content,
    }
  );

  return data;
};

export const deleteComment = async (
  deleteCommentDto: DeleteCommentDto
): Promise<ResponseDeleteCommentDto> => {
  const { data } = await axiosInstance.delete(
    `/v1/lps/${deleteCommentDto.lpId}/comments/${deleteCommentDto.commentId}`
  );

  return data;
};
