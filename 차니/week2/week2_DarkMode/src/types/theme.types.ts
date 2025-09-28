// 타입은 런타임에 없어지므로 Fast Refresh에 안전
export type Theme = "LIGHT" | "DARK";

// 필요하면 상수 객체를 별도 파일로 (enum 대신)
export const THEME = {
  LIGHT: "LIGHT",
  DARK: "DARK",
} as const;
