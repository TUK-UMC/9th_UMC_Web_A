import { useNavigate } from "react-router-dom";
import ChevronIcon from "../assets/chevron.svg";
import GoogleIcon from "../assets/google.svg";

import useForm from "../hooks/useForm";
import { validateSignin, type UserSigninImformation } from "../utils/validate";

export default function LoginPage() {
  const navigate = useNavigate();
  const { values, errors, touched, getInPutProps } =
    useForm<UserSigninImformation>({
      initialValues: {
        email: "",
        password: "",
      },
      validate: validateSignin,
    });

  const handleSubmit = async () => {
    console.log(values);
  };

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  // 오류가 하나라도 있거나, 입력값이 비어있으면 버튼을 비활성화
  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) || // 오류가 있다면 true
    Object.values(values).some((value) => value === ""); // 입력값이 비어있다면 true

  return (
    <div className="w-full h-[calc(100%-90px)] flex flex-col justify-center items-center text-white bg-black">
      <form
        noValidate
        onSubmit={handleSubmit}
        className="w-[400px] flex flex-col items-center gap-8"
      >
        {/* 로그인 박스 */}
        <div className="w-[400px] flex flex-col items-center gap-8">
          {/* 타이틀 */}
          <div className="flex items-center w-full">
            <button
              type="button"
              aria-label="뒤로가기"
              onClick={handleBack}
              className="text-white text-xl cursor-pointer"
            >
              <img src={ChevronIcon} alt="chevron" className="w-8 h-8" />
            </button>
            <span className="text-2xl font-medium mx-auto">로그인</span>
          </div>

          {/* 구글 로그인 버튼 */}
          <button className="w-full flex items-center justify-center gap-2 border border-white rounded-md py-4 hover:bg-gray-50 hover:text-black transition">
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
                className="w-full px-3 py-4 bg-transparent border border-white rounded-md placeholder-gray focus:outline-none focus:border-pink-500"
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
                className="w-full px-3 py-4 bg-transparent border border-white rounded-md placeholder-gray focus:outline-none focus:border-pink-500"
                placeholder="비밀번호를 입력해주세요!"
              />
              {errors?.password && touched?.password && (
                <div className="text-red-500 text-sm">{errors.password}</div>
              )}
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isDisabled}
              className={`w-full py-4 bg-pink-500 disabled:bg-gray-500 hover:bg-pink-600 transition rounded-md`}
            >
              로그인
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
