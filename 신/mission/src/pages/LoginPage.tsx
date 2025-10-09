import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import { validateSignin, type UserSigninInformation } from "../utils/validate";
import { ChevronLeftIcon } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const { values, touched, errors, getInputProps } =
    useForm<UserSigninInformation>({
      initialValues: {
        email: "",
        password: "",
      },
      validate: validateSignin,
    });

  const handleSubmit = () => {
    console.log(values);
  };

  // 오류가 하나라도 있거나, 입력값이 비어있으면 버튼을 비활성화
  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) || // 오류가 있으면 true
    Object.values(values).some((value) => value === ""); // 입력값이 비어있으면 true

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="w-full max-w-[400px] px-6">
        {/* 헤더 */}
        <div className="flex items-center gap-4 mb-12">
          <button
            onClick={() => navigate(-1)}
            className="hover:text-gray-300 transition-colors cursor-pointer"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-semibold">로그인</h1>
        </div>

        {/* 구글 로그인 버튼 */}
        <button className="w-full flex items-center justify-center gap-3 py-3 rounded-lg border border-gray-700 mb-8 transition-colors cursor-pointer">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="font-medium">구글 로그인</span>
        </button>

        {/* OR 구분선 */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-gray-700"></div>
          <span className="text-gray-400 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>

        {/* 로그인 폼 */}
        <div className="flex flex-col gap-4">
          <input
            {...getInputProps("email")}
            className={`w-full bg-transparent border ${
              errors?.email && touched?.email
                ? "border-red-500"
                : "border-gray-700"
            } rounded-lg px-4 py-3 placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors`}
            type="email"
            placeholder="이메일을 입력해주세요!"
          />
          {errors?.email && touched?.email && (
            <div className="text-red-500 text-sm -mt-2">{errors.email}</div>
          )}

          <input
            {...getInputProps("password")}
            className={`w-full bg-transparent border ${
              errors?.password && touched?.password
                ? "border-red-500"
                : "border-gray-700"
            } rounded-lg px-4 py-3 placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors`}
            type="password"
            placeholder="비밀번호를 입력해주세요!"
          />
          {errors?.password && touched?.password && (
            <div className="text-red-500 text-sm -mt-2">{errors.password}</div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isDisabled}
            className="w-full bg-[#e91e63] py-3 rounded-lg font-medium hover:bg-[#c2185b] transition-colors disabled:bg-gray-900 disabled:text-gray-600 disabled:cursor-not-allowed mt-2"
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
