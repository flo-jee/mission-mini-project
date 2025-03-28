import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput"; // 공통 input 컴포넌트
import { useSupabaseAuth } from "../supabase"; // Supabase 커스텀 훅
import { useTheme } from "../context/ThemeContext"; // ✅ 다크모드 context 가져오기

const Signup = () => {
  const navigate = useNavigate();
  const { signUp } = useSupabaseAuth();

  const { isDarkMode } = useTheme(); // ✅ 다크모드 상태값

  const [form, setForm] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    const nameRegex = /^[a-zA-Z0-9가-힣]{2,8}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

    if (!nameRegex.test(form.userName)) {
      newErrors.userName = "이름은 2~8자의 한글/영어/숫자만 가능합니다.";
    }

    if (!emailRegex.test(form.email)) {
      newErrors.email = "올바른 이메일 형식을 입력하세요.";
    }

    if (!passwordRegex.test(form.password)) {
      newErrors.password = "비밀번호는 영문자+숫자 조합 6자 이상이어야 합니다.";
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const { email, password, userName } = form;

    const { user, error } = await signUp({ email, password, userName });

    if (error) {
      setErrors({ form: error });
      alert(`회원가입 실패: ${error}`);
    } else {
      alert("회원가입 성공! 로그인 페이지로 이동합니다.");
      navigate("/login");
    }
  };

  return (
    <div
      className={`min-h-screen flex justify-center items-center transition-all duration-300
        ${isDarkMode ? "bg- text-white" : "bg-[#E5CACF] text-[#161616]"}`}
    >
      <form
        onSubmit={handleSubmit}
        className={`p-8 rounded-lg shadow-md w-full max-w-md relative transition-all duration-300
          ${isDarkMode ? "bg-[#333333] text-white" : "bg-[#FFF3F7] text-[#161616]"}`}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">회원가입</h2>

        {errors.form && (
          <div className="text-red-500 text-sm mb-4 text-center">
            {errors.form}
          </div>
        )}

        <FormInput
          label="이메일"
          name="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="이메일을 입력하세요"
          autoComplete="email"
        />

        <FormInput
          label="이름"
          name="userName"
          value={form.userName}
          onChange={handleChange}
          error={errors.userName}
          placeholder="이름을 입력하세요"
          autoComplete="username"
        />

        <FormInput
          label="비밀번호"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="비밀번호를 입력하세요"
          autoComplete="new-password"
        />

        <FormInput
          label="비밀번호 확인"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          placeholder="비밀번호를 다시 입력하세요"
          autoComplete="new-password"
        />

        <button
          type="submit"
          className="lex items-center justify-center gap-2 w-full py-3 rounded-full text-sm font-semibold bg-[#333333] text-white hover:bg-[#DDA026] font-semibold transition mt-3"
        >
          회원가입
        </button>
      </form>
    </div>
  );
};

export default Signup;
