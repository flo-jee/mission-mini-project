import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="bg-gray-900 text-white px-7 py-10 flex items-center justify-between">
      {/* ✅ 로고 */}
      <Link to="/" className="text-5xl font-bold flex items-center">
        <span className="text-white">OZ</span>
        <span className="mx-2"></span> {/* ✅ 여백 추가 */}
        <span className="text-purple-400">무비</span>
      </Link>

      {/* ✅ 검색창 */}
      <input
        type="text"
        placeholder="검색..."
        className="w-64 px-4 py-2 bg-gray-700 rounded-lg outline-none text-white"
      />

      {/* ✅ 로그인 & 회원가입 버튼 */}
      <div className="flex gap-2">
        <button className="bg-purple-600 hover:bg-purple-800 px-4 py-2 rounded-lg text-white text-sm">
          로그인
        </button>
        <button className="bg-purple-600 hover:bg-purple-800 px-4 py-2 rounded-lg text-white text-sm">
          회원가입
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
