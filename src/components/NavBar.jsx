import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useDebounce from "../hooks/useDebounce";
import { useTheme } from "../context/ThemeContext"; // ✅ 다크모드 상태 가져오기

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useTheme(); // ✅ 다크모드 상태, 토글함수 사용

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // ✅ 검색어 처리 로직 생략...

  return (
    <nav
      className={`flex flex-wrap items-center justify-between gap-4 px-7 py-10 bg-gray-900 text-white ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-gray-600 text-white"
      }`}
    >
      {/* 로고 */}
      <Link to="/" className="text-5xl font-bold flex items-center">
        <span className="text-white">OZ</span>
        <span className="mx-2"></span>
        <span className="text-purple-400">무비</span>
      </Link>
      <div className="flex items-center gap-2">
        {/* 검색창 */}
        <input
          type="text"
          placeholder="검색..."
          value={searchTerm}
          onKeyDown={(e) => {
            if (e.key === "Enter" && searchTerm.trim() !== "") {
              navigate(`/?search=${searchTerm}`);
              setSearchTerm(""); // ✅ 검색 후 초기화!
            }
          }}
          className={`w-64 px-4 py-2 rounded-lg outline-none transition-all duration-300
            ${
              isDarkMode
                ? "bg-gray-700 text-white placeholder-gray-400 border border-gray-400"
                : "bg-pink-100 text-pink-900 placeholder-pink-400 border border-pink-400"
            }`}
        />

        {/* 돋보기 버튼 */}
        <button
          onClick={() => {
            if (searchTerm.trim() !== "") {
              navigate(`/?search=${searchTerm}`); // 클릭하면 검색 실행
              setSearchTerm(""); // ✅ 입력창 초기화!
            }
          }}
          className={`p-2 rounded-lg text-sm font-semibold transition-all duration-300
            ${
              isDarkMode
                ? "bg-purple-600 hover:bg-purple-800 text-white"
                : "bg-purple-400 hover:bg-purple-600 text-white"
            }`}
        >
          🔍
        </button>
      </div>

      {/* 로그인 & 토글 */}
      <div className="flex gap-2">
        <button
          onClick={toggleDarkMode}
          className="bg-purple-400 hover:bg-purple-600 px-4 py-2 rounded-lg text-white text-sm"
        >
          {isDarkMode ? "라이트 모드" : "다크 모드"}
        </button>
        <button className="bg-purple-600 hover:bg-purple-800 px-4 py-2 rounded-lg text-white text-sm">
          로그인
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
