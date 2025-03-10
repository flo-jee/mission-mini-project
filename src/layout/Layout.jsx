// 페이지 스켈레톤 담당
import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useTheme } from "../context/ThemeContext";

const Layout = () => {
  const { isDarkMode } = useTheme();
  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-pink-100 text-pink-900"
      }`}
    >
      {/* ✅ 상단 네비게이션 바 고정 */}
      <NavBar />

      {/* ✅ Outlet을 사용해 페이지별 콘텐츠 표시 */}
      <div className="p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
