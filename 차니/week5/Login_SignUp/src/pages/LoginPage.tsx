import { useNavigate } from "react-router-dom";
import ChevronIcon from "../assets/chevron.svg";
import GoogleIcon from "../assets/google.svg";

import useForm from "../hooks/useForm";
import { validateSignin, type UserSigninImformation } from "../utils/validate";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

export default function LoginPage() {
  const { login, accessToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      navigate("/");
    }
  }, [accessToken, navigate]);

  const { values, errors, touched, getInPutProps } =
    useForm<UserSigninImformation>({
      initialValues: {
        email: "",
        password: "",
      },
      validate: validateSignin,
    });

  const handleSubmit = async () => {
    await login(values);
  };

  const handleGoogleLogin = () => {
    window.location.href = `${
      import.meta.env.VITE_SERVER_API_URL
    }/v1/auth/google/login`;
  };

  // 오류가 하나라도 있거나, 입력값이 비어있으면 버튼을 비활성화
  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) || // 오류가 있다면 true
    Object.values(values).some((value) => value === ""); // 입력값이 비어있다면 true

  return (
    <div className="w-full h-[calc(100%-90px)] flex flex-col justify-center items-center text-white bg-black">
      {/* 로그인 박스 */}
      <div className="w-[400px] flex flex-col items-center gap-8">
        {/* 타이틀 */}
        <div className="relative flex justify-center items-center w-full">
          <button
            className="absolute left-0 text-white text-xl cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={ChevronIcon} alt="chevron" className="w-8 h-8" />
          </button>
          <h1 className="text-2xl font-medium mx-auto">로그인</h1>
        </div>

        {/* 구글 로그인 버튼 */}
        <button
          className="w-full flex items-center justify-center gap-2 border border-white rounded-md py-4 hover:bg-gray-50 hover:text-black transition"
          onClick={handleGoogleLogin}
        >
          <img src={GoogleIcon} alt="Google" className="w-5 h-5" />
          <span>구글 로그인</span>
        </button>

        {/* OR 구분선 */}
        <div className="flex items-center w-full gap-2 text-white">
          <hr className="flex-1 border-white" />
          <span>OR</span>
          <hr className="flex-1 border-white" />
        </div>

        {/* 이메일 / 비밀번호 입력 */}
        <div className="flex flex-col w-full gap-5">
          <div className="flex flex-col gap-1">
            <input
              {...getInPutProps("email")}
              type="email"
              className={`w-full px-3 py-4 bg-transparent border rounded-md placeholder-gray focus:outline-none ${
                errors?.email && touched?.email
                  ? "border-red-500 focus:border-red-500"
                  : "border-white focus:border-pink-500"
              }`}
              placeholder="이메일을 입력해주세요!"
            />
            {errors?.email && touched?.email && (
              <div className="text-red-500 text-sm">{errors.email}</div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <input
              {...getInPutProps("password")}
              type="password"
              className={`w-full px-3 py-4 bg-transparent border rounded-md placeholder-gray focus:outline-none ${
                errors?.password && touched?.password
                  ? "border-red-500 focus:border-red-500"
                  : "border-white focus:border-pink-500"
              }`}
              placeholder="비밀번호를 입력해주세요!"
            />
            {errors?.password && touched?.password && (
              <div className="text-red-500 text-sm">{errors.password}</div>
            )}
          </div>
          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={isDisabled}
            className={`w-full py-4 bg-pink-500 disabled:bg-gray-500 hover:bg-pink-600 transition rounded-md`}
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
}
