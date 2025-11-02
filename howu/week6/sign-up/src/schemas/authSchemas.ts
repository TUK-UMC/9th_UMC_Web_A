import { z } from "zod";

// 이메일 스키마
export const emailSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요.")
    .email("유효하지 않은 이메일 형식입니다."),
});

// 비밀번호 스키마
export const passwordSchema = z.object({
  password: z
    .string()
    .min(6, "비밀번호는 최소 6자 이상이어야 합니다.")
    .max(50, "비밀번호는 최대 50자까지 입력 가능합니다."),
  confirmPassword: z.string().min(1, "비밀번호 확인을 입력해주세요."),
}).refine((data) => data.password === data.confirmPassword, {
  message: "비밀번호가 일치하지 않습니다.",
  path: ["confirmPassword"],
});

// 닉네임 스키마
export const nicknameSchema = z.object({
  nickname: z
    .string()
    .min(2, "닉네임은 최소 2자 이상이어야 합니다.")
    .max(10, "닉네임은 최대 10자까지 입력 가능합니다.")
    .regex(/^[가-힣a-zA-Z0-9]+$/, "닉네임은 한글, 영문, 숫자만 사용 가능합니다."),
});

// 로그인 스키마
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요.")
    .email("유효하지 않은 이메일 형식입니다."),
  password: z
    .string()
    .min(1, "비밀번호를 입력해주세요.")
    .min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
});

// 전체 회원가입 스키마
export const signupSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요.")
    .email("유효하지 않은 이메일 형식입니다."),
  password: z
    .string()
    .min(6, "비밀번호는 최소 6자 이상이어야 합니다.")
    .max(50, "비밀번호는 최대 50자까지 입력 가능합니다."),
  confirmPassword: z.string().min(1, "비밀번호 확인을 입력해주세요."),
  nickname: z
    .string()
    .min(2, "닉네임은 최소 2자 이상이어야 합니다.")
    .max(10, "닉네임은 최대 10자까지 입력 가능합니다.")
    .regex(/^[가-힣a-zA-Z0-9]+$/, "닉네임은 한글, 영문, 숫자만 사용 가능합니다."),
}).refine((data) => data.password === data.confirmPassword, {
  message: "비밀번호가 일치하지 않습니다.",
  path: ["confirmPassword"],
});

// 타입 추출
export type EmailFormData = z.infer<typeof emailSchema>;
export type PasswordFormData = z.infer<typeof passwordSchema>;
export type NicknameFormData = z.infer<typeof nicknameSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
