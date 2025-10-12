import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmailStep from "./components/EmailStep";
import PasswordStep from "./components/PasswordStep";
import NicknameStep from "./components/NicknameStep";

import type { SignupStepData } from "./types/auth";

interface SignUpData extends SignupStepData {}

const SignUp = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [signUpData, setSignUpData] = useState<SignUpData>({
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    avatar: undefined
  });

  const handleEmailNext = (data: { email: string }) => {
    setSignUpData(prev => ({ ...prev, ...data }));
    setCurrentStep(2);
  };

  const handlePasswordNext = (data: { password: string; confirmPassword: string }) => {
    setSignUpData(prev => ({ ...prev, ...data }));
    setCurrentStep(3);
  };

  const handlePasswordPrev = () => {
    setCurrentStep(1);
  };

  const handleNicknamePrev = () => {
    setCurrentStep(2);
  };

  const handleNicknameComplete = async (data: { nickname: string; avatar?: string }) => {
    const finalData = { ...signUpData, ...data };
    
    try {
      const response = await fetch("http://localhost:8000/v1/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: finalData.nickname,
          email: finalData.email,
          password: finalData.password,
          bio: null,
          avatar: finalData.avatar || null
        }),
      });
      
      const result = await response.json();
      console.log(result);
      
      if (response.ok && response.status === 201) {
        alert("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
        navigate("/login");
      } else {
        // API에서 반환하는 구체적인 오류 메시지 표시
        const errorMessage = result.message || "회원가입에 실패했습니다.";
        alert(`회원가입 실패: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Signup failed:", error);
      alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {currentStep === 1 && (
        <EmailStep 
          onNext={handleEmailNext}
          initialData={{
            email: signUpData.email
          }}
        />
      )}
      
      {currentStep === 2 && (
        <PasswordStep 
          onNext={handlePasswordNext}
          onPrev={handlePasswordPrev}
          initialData={{
            password: signUpData.password,
            confirmPassword: signUpData.confirmPassword
          }}
          email={signUpData.email}
        />
      )}
      
      {currentStep === 3 && (
        <NicknameStep 
          onComplete={handleNicknameComplete}
          onPrev={handleNicknamePrev}
          initialData={{
            nickname: signUpData.nickname
          }}
          email={signUpData.email}
          password={signUpData.password}
        />
      )}
    </div>
  );
};

export default SignUp;