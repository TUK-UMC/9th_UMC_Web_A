import type { CommonResponse, CursorBasedResponse } from "./common.types";
import type { Author } from "./lp.types";

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
