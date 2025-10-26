import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { loginSchema } from "./schemas/authSchemas";
import type { LoginFormData } from "./schemas/authSchemas";
import { useAuth } from "./hooks/useAuth";
import type { LoginRequestData, LoginResponseData, ApiResponse } from "./types/auth";

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();

  // 이미 로그인한 사용자는 마이페이지로 리다이렉트
  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/mypage", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const handleBack = () => {
    navigate(-1);
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await fetch("http://localhost:8000/v1/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data as LoginRequestData),
      });

      const result: ApiResponse<LoginResponseData> = await response.json();
      
      if (response.ok && response.status === 201) {
        // 로그인 성공 시 토큰을 로컬 스토리지에 저장
        if (result.data) {
          login({
            id: result.data.id,
            name: result.data.name,
            email: data.email,
            accessToken: result.data.accessToken,
            refreshToken: result.data.refreshToken,
          });
          
          alert("로그인에 성공했습니다!");
          // 마이페이지로 이동
          navigate("/mypage");
        }
      } else {
        const errorMessage = result.message || "로그인에 실패했습니다.";
        alert(`로그인 실패: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <button 
          onClick={handleBack}
          className="text-2xl text-white hover:text-gray-300 mb-8"
        >
          ←
        </button>
        
        <h2 className="text-2xl font-bold mb-8 text-center">로그인</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <span className="text-gray-400 mr-3">✉️</span>
              <input
                type="email"
                placeholder="이메일을 입력해주세요"
                className="w-full bg-transparent border-b border-gray-600 py-3 text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none"
                {...register("email")}
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm ml-8">{errors.email.message}</p>}
          </div>
          
          <div className="mb-8">
            <div className="flex items-center mb-2">
              <span className="text-gray-400 mr-3">🔒</span>
              <input
                type="password"
                placeholder="비밀번호를 입력해주세요"
                className="w-full bg-transparent border-b border-gray-600 py-3 text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none"
                {...register("password")}
              />
            </div>
            {errors.password && <p className="text-red-500 text-sm ml-8">{errors.password.message}</p>}
          </div>
          
          <button 
            type="submit" 
            disabled={!isValid || isSubmitting}
            className="w-full py-4 bg-pink-500 text-white rounded-lg font-medium disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed hover:bg-pink-600 transition-colors mb-6"
          >
            {isSubmitting ? "로그인 중..." : "로그인"}
          </button>
        </form>
        
        <div className="text-center">
          <Link to="/signup" className="text-pink-400 hover:text-pink-300 no-underline">
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;