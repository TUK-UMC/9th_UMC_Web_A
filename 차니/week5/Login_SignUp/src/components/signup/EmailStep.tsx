import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { FormFields } from "../../pages/SignupPage";

export default function EmailStep({
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
  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex flex-col gap-1">
        <input
          {...register("email")}
          className={`w-full px-3 py-4 bg-transparent border rounded-md placeholder-gray focus:outline-none ${
            errors.email
              ? "border-red-500 focus:border-red-500"
              : "border-white focus:border-pink-500"
          }`}
          type="email"
          placeholder="이메일을 입력해주세요!"
        />
        {errors.email && (
          <div className="text-red-500 text-sm">{errors.email.message}</div>
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
