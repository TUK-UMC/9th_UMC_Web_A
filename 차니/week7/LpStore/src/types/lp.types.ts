import type { CommonResponse, CursorBasedResponse } from "./common.types";

export type Tag = {
  id: number;
  name: string;
};

export type Likes = {
  id: number;
  userId: number;
  lpId: number;
};

export type Author = {
  id: number;
  name: string;
  email: string;
  bio: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ResponseLpListDto = CursorBasedResponse<{
  data: {
    id: number;
    title: string;
    content: string;
    thumbnail: string;
    published: boolean;
    authorId: number;
    createdAt: Date;
    updatedAt: Date;
    tags: Tag[];
    likes: Likes[];
  }[];
}>;

export type ResponseLpDetailDto = CommonResponse<{
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  tags: Tag[];
  likes: Likes[];
  author: Author;
}>;

export type CreateLpBody = {
  title: string;
  content: string;
  thumbnail?: string; // 파일 업로드 서버가 없으면 dataURL 전송(데모용)
  tags: string[]; // 태그 문자열 배열
  published: boolean;
};

export type UpdateLpBody = {
  title?: string;
  content?: string;
  thumbnail?: string;
  tags?: string[]; // 서버가 문자열 배열 받으면 그대로, 아니면 서버 스펙에 맞춰 변환
  published?: boolean;
};
