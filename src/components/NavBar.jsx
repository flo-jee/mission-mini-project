import React, { useState, useEffect } from "react"; // ✅ useEffect 추가!
import { Link, useNavigate, useLocation } from "react-router-dom";
import useDebounce from "../hooks/useDebounce";
import { useTheme } from "../context/ThemeContext"; // ✅ 다크모드 상태 가져오기

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // ✅ 디바운스된 값이 바뀌면 navigate 실행
  useEffect(() => {
    if (debouncedSearchTerm) {
      navigate(`/?search=${debouncedSearchTerm}`);
    }

    // ✅ 검색어가 완전히 지워졌다면 인기 영화 목록 보여주기
    if (!debouncedSearchTerm && location.pathname === "/") {
      navigate(`/`);
    }
  }, [debouncedSearchTerm, navigate, location.pathname]);

  return (
    <nav
      className={`flex flex-wrap items-center justify-between gap-4 px-7 py-10 transition-all duration-300
        ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}
      `}
    >
      {/* ✅ 로고 */}
      <Link to="/" className="text-5xl font-bold flex items-center">
        <span className={isDarkMode ? "text-white" : "text-gray-900"}>OZ</span>
        <span className="mx-2"></span>
        <span className="text-purple-400">무비</span>
      </Link>

      {/* ✅ 검색창 */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-64 px-4 py-2 rounded-lg outline-none transition-all duration-300
            ${
              isDarkMode
                ? "bg-gray-700 text-white placeholder-gray-400 border border-gray-400"
                : "bg-pink-100 text-pink-900 placeholder-pink-400 border border-pink-400"
            }`}
        />

        {/* ✅ 돋보기 버튼은 입력 초기화 전용 */}
        <button
          onClick={() => {
            setSearchTerm(""); // 검색어 초기화
            navigate(`/`); // 인기 영화로 리셋
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

      {/* ✅ 로그인 & 다크모드 토글 */}
      <div className="flex gap-2">
        <button
          onClick={toggleDarkMode}
          className={`px-4 py-2 rounded-lg text-sm transition-all duration-300
            ${
              isDarkMode
                ? "bg-yellow-500 hover:bg-yellow-700 text-black"
                : "bg-purple-400 hover:bg-purple-600 text-white"
            }`}
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
