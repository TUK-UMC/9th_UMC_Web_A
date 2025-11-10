import type {
  ResponseCommentDto,
  ResponseCommentListDto,
} from "../types/comment.types";
import type { CommentDto, CommentPaginationDto } from "../types/common.types";
import { axiosInstance } from "./axios";

// 댓글 목록 조회 API
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

// 댓글 생성 API
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

// 댓글 수정 API
export const patchComment = async ({
  lpId,
  commentId,
  content,
}: {
  lpId: number;
  commentId: number;
  content: string;
}) => {
  const { data } = await axiosInstance.patch(
    `/v1/lps/${lpId}/comments/${commentId}`,
    { content }
  );
  return data;
};

// 댓글 삭제 API
export const removeComment = async ({
  lpId,
  commentId,
}: {
  lpId: number;
  commentId: number;
}) => {
  const { data } = await axiosInstance.delete(
    `/v1/lps/${lpId}/comments/${commentId}`
  );
  return data;
};
