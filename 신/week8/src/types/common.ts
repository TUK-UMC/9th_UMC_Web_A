import type { PaginationOrder } from "../enums/common";

export type CommonResponse<T> = {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
};

export type CursorBasedResponse<T> = CommonResponse<{
  data: T;
  nextCursor: number | null;
  hasNext: boolean;
}>;

export type PaginationDto = {
  cursor?: number;
  limit?: number;
  search?: string;
  order?: PaginationOrder;
};

export type CommentPaginationDto = {
  lpId: string;
  cursor?: number;
  limit?: number;
  order?: PaginationOrder;
};

export type CommentDto = {
  lpId: string;
  content: string;
};
