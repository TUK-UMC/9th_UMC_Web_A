import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { FormFields } from "../../pages/SignupPage";

export default function PasswordStep({
  register,
  errors,
  canNext,
  onNext,
}: {
  register: UseFormRegister<FormFields>;
  errors: FieldErrors<FormFields>;
  canNext: boolean;
  onNext: () => void;
}) {
  const [showPw, setShowPw] = useState(false);
  const [showPwCk, setShowPwCk] = useState(false);

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex flex-col w-full gap-1">
        <div className="relative">
          <input
            {...register("password")}
            className={`w-full px-3 py-4 bg-transparent border rounded-md placeholder-gray focus:outline-none ${
              errors.password
                ? "border-red-500 focus:border-red-500"
                : "border-white focus:border-pink-500"
            }`}
            type={showPw ? "text" : "password"}
            placeholder="비밀번호(8~20자)를 입력해주세요!"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPw((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300"
          >
            {showPw ? <EyeOff /> : <Eye />}
          </button>
        </div>
        {errors.password && (
          <div className="text-red-500 text-sm">{errors.password.message}</div>
        )}
      </div>

      <div className="flex flex-col w-full gap-1">
        <div className="relative">
          <input
            {...register("passwordCheck")}
            className={`w-full px-3 py-4 bg-transparent border rounded-md placeholder-gray focus:outline-none ${
              errors.passwordCheck
                ? "border-red-500 focus:border-red-500"
                : "border-white focus:border-pink-500"
            }`}
            type={showPwCk ? "text" : "password"}
            placeholder="비밀번호를 한 번 더 입력해주세요!"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPwCk((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300"
          >
            {showPwCk ? <EyeOff /> : <Eye />}
          </button>
        </div>
        {errors.passwordCheck && (
          <div className="text-red-500 text-sm">
            {errors.passwordCheck.message}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        className="w-full py-4 bg-pink-500 disabled:bg-gray-500 hover:bg-pink-600 transition rounded-md"
      >
        다음
      </button>
    </div>
  );
}
