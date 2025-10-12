import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordSchema } from "../schemas/authSchemas";
import type { PasswordFormData } from "../schemas/authSchemas";

interface PasswordStepProps {
  onNext: (data: { password: string; confirmPassword: string }) => void;
  onPrev: () => void;
  initialData?: { password: string; confirmPassword: string };
  email?: string;
}

const PasswordStep: React.FC<PasswordStepProps> = ({ onNext, onPrev, initialData = { password: "", confirmPassword: "" }, email }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    mode: "onChange",
    defaultValues: initialData,
  });

  const handleBack = () => {
    onPrev();
  };

  const onSubmit = (data: PasswordFormData) => {
    onNext(data);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <button 
          onClick={handleBack}
          className="text-2xl text-white hover:text-gray-300"
        >
          ←
        </button>
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
          <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
        </div>
        <div></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-8 text-center">비밀번호 설정</h2>
          
          {/* Email Display */}
          {email && (
            <div className="mb-6 p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center">
                <span className="text-gray-400 mr-3">✉️</span>
                <span className="text-white">{email}</span>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            {/* Password Field */}
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <span className="text-gray-400 mr-3">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호를 입력해주세요!"
                  className="w-full bg-transparent border-b border-gray-600 py-3 text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-white ml-2"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm ml-8">{errors.password.message}</p>}
            </div>

            {/* Confirm Password Field */}
            <div className="mb-8">
              <div className="flex items-center mb-2">
                <span className="text-gray-400 mr-3">🔒</span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="비밀번호를 다시 한 번 입력해주세요!"
                  className="w-full bg-transparent border-b border-gray-600 py-3 text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none"
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-400 hover:text-white ml-2"
                >
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm ml-8">{errors.confirmPassword.message}</p>}
            </div>

            {/* Next Button */}
            <button
              type="submit"
              disabled={!isValid}
              className="w-full py-4 bg-pink-500 text-white rounded-lg font-medium disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed hover:bg-pink-600 transition-colors"
            >
              다음
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordStep;
