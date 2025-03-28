import React from "react";
import useUser from "../context/UserContext"; // 전역 유저 정보 가져오기
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext"; // ✅ 다크모드 상태 가져오기

const DEFAULT_PROFILE_IMAGE = "movie-clapperboard-part-2-svgrepo-com.png";

const MyPage = () => {
  const { user } = useUser(); // 현재 로그인한 유저 정보
  const navigate = useNavigate();
  const { isDarkMode } = useTheme(); // ✅ 다크모드 상태 가져오기

  // 로그인 안 된 경우 홈으로 리디렉션
  if (!user) {
    alert("로그인이 필요합니다.");
    navigate("/login");
    return null;
  }

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-300
      ${isDarkMode ? "bg-[#333333] text-white" : "bg-[#FFF3F7] text-[#333333]"}`}
    >
      <h1 className="text-3xl font-bold mb-8">👤 마이페이지</h1>

      <div
        className={`rounded-lg shadow-lg p-6 w-full max-w-md transition-colors duration-300
      ${isDarkMode ? "bg-[#4C4C4C] text-white" : "bg-white text-[#333333]"}`}
      >
        <div
          className={`flex flex-col items-center border-4 gap-4
        ${isDarkMode ? "border-[#841724]" : "border-[#F2BDC5]"}`}
        >
          <img
            src={user.profileImageUrl || DEFAULT_PROFILE_IMAGE}
            alt="프로필 이미지"
            className={"w-32 h-32 rounded-full object-cover"}
          />

          <p className="text-xl font-semibold">✉️ 이메일: {user.email}</p>

          <p className="text-lg">
            📝 이름: {user.user_metadata?.userName || "이름 정보 없음"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
