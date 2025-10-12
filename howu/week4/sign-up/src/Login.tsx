import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "./useForm";

const Login = () => {
  const navigate = useNavigate();

  const validations = {
    email: (value: string) => {
      const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      if (!re.test(value)) {
        return "유효하지 않은 이메일 형식입니다.";
      }
      return null;
    },
    password: (value: string) => {
      if (value.length < 6) {
        return "비밀번호는 최소 6자 이상이어야 합니다.";
      }
      return null;
    },
  };

  const { values, errors, handleChange, isButtonDisabled } = useForm({ email: "", password: "" }, validations);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center p-5">
      <button className="self-start text-2xl bg-transparent border-none cursor-pointer" onClick={handleBack}>
        &lt;
      </button>
      <h2 className="mt-5 text-lg">이메일과 비밀번호를 입력해주세요.</h2>
      <form className="flex flex-col w-full max-w-sm mt-5">
        <div className="flex flex-col">
          <label className="mt-2.5">이메일</label>
          <input
            type="email"
            name="email"
            className="p-2.5 mt-1.5 border border-gray-300 rounded"
            value={values.email}
            onChange={handleChange}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>
        <div className="flex flex-col mt-2.5">
          <label>비밀번호</label>
          <input
            type="password"
            name="password"
            className="p-2.5 mt-1.5 border border-gray-300 rounded"
            value={values.password}
            onChange={handleChange}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>
        <button type="submit" className="mt-5 p-2.5 bg-blue-500 text-white border-none rounded cursor-pointer disabled:bg-gray-400" disabled={isButtonDisabled()}>
          로그인
        </button>
      </form>
      <Link to="/signup" className="mt-5 text-blue-500 no-underline">
        회원가입
      </Link>
    </div>
  );
};

export default Login;