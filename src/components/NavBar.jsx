import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useDebounce from "../hooks/useDebounce";
import { useTheme } from "../context/ThemeContext";
import useUser from "../context/UserContext";
import { useAuth } from "../supabase/auth/useAuth";
import { Moon, Sun, Search } from "lucide-react"; // 아이콘 추가!

const DEFAULT_PROFILE_IMAGE = "movie-clapperboard-part-2-svgrepo-com.png";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { isDarkMode, toggleDarkMode } = useTheme();
  const { user, setUser } = useUser();
  const { logout } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const dropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // ✅ 유저 상태 확인
  useEffect(() => {
    console.log("✅ NavBar 현재 유저 상태:", user);
  }, [user]);

  // ✅ 검색어가 바뀔 때 URL 업데이트
  useEffect(() => {
    if (debouncedSearchTerm) {
      navigate(`/search?search=${debouncedSearchTerm}`);
    } else if (!debouncedSearchTerm && location.pathname === "/") {
      navigate(`/`);
    }
  }, [debouncedSearchTerm, navigate, location.pathname]);

  // ✅ 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ 로그아웃 핸들러
  const handleLogout = async () => {
    console.log("🖱️ 로그아웃 버튼 클릭됨!");

    const { error } = await logout();

    if (error) {
      console.error("❌ 로그아웃 실패:", error);
      return;
    }

    alert("✅ 로그아웃 되었습니다!");
    setUser(null);
    localStorage.removeItem("userInfo");
    setIsDropdownOpen(false);
    navigate("/");
  };

  return (
    <nav
      className={`flex flex-wrap items-center justify-between px-7 py-5 transition-all duration-300
        ${isDarkMode ? "bg-gray-700 text-pink-100" : "bg-white text-gray-500"} shadow-md`}
    >
      {/* ✅ 로고 */}
      <Link to="/" className="text-3xl font-extrabold flex items-center">
        <span className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>
          OZ
        </span>
        <span className="mx-3 text-purple-400">Movie</span>
      </Link>

      {/* ✅ 검색창 */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (searchTerm.trim()) navigate(`/search?search=${searchTerm}`);
        }}
        className="relative flex items-center"
      >
        <input
          type="text"
          placeholder="검색어를 입력하세요..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-64 px-4 py-2 rounded-full outline-none text-sm transition-all duration-300 pr-10
            ${
              isDarkMode
                ? "bg-gray-700 text-white placeholder-gray-400 border border-gray-500"
                : "bg-pink-100 text-gray-600 placeholder-pink-400 border border-pink-300"
            }`}
        />

        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-pink-500 dark:text-pink-200"
          aria-label="검색"
        >
          <Search size={20} />
        </button>
      </form>

      {/* ✅ 다크모드 & 유저 영역 */}
      <div className="flex items-center gap-4">
        {/* 다크모드 버튼 */}
        <button
          onClick={toggleDarkMode}
          aria-label="다크모드 전환"
          className="p-2 rounded-full bg-pink-200 dark:bg-gray-400 transition hover:scale-105"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* 유저 드롭다운 */}
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <img
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(!isDropdownOpen);
              }}
              src={user.profileImageUrl || DEFAULT_PROFILE_IMAGE}
              alt="프로필 이미지"
              className="w-10 h-10 rounded-full cursor-pointer border-2 border-purple-500 hover:scale-105 transition"
            />

            {isDropdownOpen && (
              <div
                className={`absolute right-0 mt-2 w-32 rounded-lg shadow-md z-10 transition-all duration-300
      ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}
              >
                <button
                  onClick={() => {
                    navigate("/mypage");
                    setIsDropdownOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-300
        ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                >
                  마이페이지
                </button>

                <button
                  onClick={handleLogout}
                  className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-300
        ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/login")}
              className="bg-purple-600 hover:bg-purple-800 px-4 py-2 rounded-lg text-white text-sm transition"
            >
              로그인
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="bg-purple-400 hover:bg-purple-600 px-4 py-2 rounded-lg text-white text-sm transition"
            >
              회원가입
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
