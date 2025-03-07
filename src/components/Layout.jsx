import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
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
