import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";
import useUser from "../context/UserContext";
import { useOAuth } from "../supabase/auth/useOauth.auth";
import { useEmailAuth } from "../supabase/auth/useEmail.auth";
import { useTheme } from "../context/ThemeContext"; // ✅ 다크모드 테마 가져오기

const Login = () => {
  const navigate = useNavigate();
  const { login } = useEmailAuth();
  const { loginWithGoogle, loginWithKakao } = useOAuth();
  const { setUser } = useUser();

  const { isDarkMode } = useTheme(); // ✅ 다크모드 상태 가져오기

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email)) {
      newErrors.email = "올바른 이메일 형식을 입력하세요.";
    }

    if (!form.password) {
      newErrors.password = "비밀번호를 입력하세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError("");

    if (!validate()) return;

    const { email, password } = form;

    try {
      const userInfo = await login({ email, password });

      if (userInfo.user) {
        setUser(userInfo.user);
        navigate("/");
      } else {
        setGeneralError("❌ 아이디나 비밀번호가 틀렸습니다.");
      }
    } catch (error) {
      console.error("❌ 로그인 에러:", error.message);
      setGeneralError(
        "❌ 로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      );
    }
  };

  const handleKakaoLogin = async () => {
    setGeneralError("");

    try {
      await loginWithKakao(`${window.location.origin}/auth/callback`);
    } catch (error) {
      console.error("❌ 카카오 로그인 에러:", error.message);
      setGeneralError("❌ 카카오 로그인 실패! 잠시 후 다시 시도해주세요.");
    }
  };

  const handleGoogleLogin = async () => {
    setGeneralError("");

    try {
      await loginWithGoogle(`${window.location.origin}/auth/callback`);
    } catch (error) {
      console.error("❌ 구글 로그인 에러:", error.message);
      setGeneralError("❌ 구글 로그인 실패! 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <div
      className={`min-h-screen flex justify-center items-center transition-all duration-300
        ${isDarkMode ? "bg-gray-900 text-white" : "bg-pink-100 text-gray-900"}`}
    >
      <form
        onSubmit={handleSubmit}
        className={`p-8 rounded-lg shadow-md w-full max-w-md relative transition-all duration-300
          ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">로그인</h2>

        {generalError && (
          <div className="mb-5 flex items-center justify-center gap-2 p-3 rounded-lg border border-red-400 bg-red-50 text-red-600 text-sm font-semibold transition-all duration-300">
            <svg
              className="w-5 h-5 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M12 5.5a6.5 6.5 0 110 13 6.5 6.5 0 010-13z"
              />
            </svg>
            {generalError}
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
          label="비밀번호"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="비밀번호를 입력하세요"
          autoComplete="current-password"
        />

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-800 transition mt-4 font-semibold"
        >
          로그인
        </button>

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleKakaoLogin}
            className="w-full bg-yellow-400 text-black py-2 rounded-lg hover:bg-yellow-500 font-semibold"
          >
            카카오로 시작하기
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 font-semibold"
          >
            구글로 시작하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
