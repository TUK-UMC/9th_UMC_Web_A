import type { CommonResponse, CursorBasedResponse } from "./common";
import type { Author } from "./lp";

export type Comment = {
  id: number;
  content: string;
  lpId: number;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  author: Author;
};

export type ResponseCommentListDto = CursorBasedResponse<Comment[]>;

export type ResponseCommentDto = CommonResponse<Comment>;

export type UpdateCommentDto = {
  lpId: string;
  commentId: string;
  content: string;
};

export type DeleteCommentDto = {
  lpId: string;
  commentId: string;
};

export type ResponseDeleteCommentDto = CommonResponse<{
  message: string;
}>;
