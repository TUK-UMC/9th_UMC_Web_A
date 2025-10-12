import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { FormFields } from "../../pages/SignupPage";
import UserImg from "../../assets/user.png";

export default function ProfileStep({
  register,
  errors,
  canSubmit,
  submitting,
  onSubmit,
}: {
  register: UseFormRegister<FormFields>;
  errors: FieldErrors<FormFields>;
  canSubmit: boolean;
  submitting: boolean;
  onSubmit: () => void;
}) {
  return (
    <div className="flex flex-col w-full gap-5 items-center">
      <div className="w-64 flex items-center justify-center select-none">
        <img src={UserImg} alt="user" />
      </div>

      <div className="w-full flex flex-col gap-1">
        <input
          {...register("name")}
          className={`w-full px-3 py-4 bg-transparent border rounded-md placeholder-gray focus:outline-none ${
            errors.name
              ? "border-red-500 focus:border-red-500"
              : "border-white focus:border-pink-500"
          }`}
          type="text"
          placeholder="이름을 입력해주세요!"
        />
        {errors.name && (
          <div className="text-red-500 text-sm">{errors.name.message}</div>
        )}
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={!canSubmit || submitting}
        className="w-full py-4 bg-pink-500 disabled:bg-gray-500 hover:bg-pink-600 transition rounded-md"
      >
        회원가입 완료
      </button>
    </div>
  );
}
