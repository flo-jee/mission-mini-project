import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useDebounce from "../hooks/useDebounce";
import { useTheme } from "../context/ThemeContext";
import useUser from "../context/UserContext";
import { useAuth } from "../supabase/auth/useAuth";
import { Moon, Sun, Search, Menu } from "lucide-react";
import lightLogo from "/assets/movieLOGO_RGB_LI_Y.png";
import darkLogo from "/assets/movieLOGO_RGB_DK_L_Y.png";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (debouncedSearchTerm) {
      navigate(`/search?search=${debouncedSearchTerm}`);
    } else if (!debouncedSearchTerm && location.pathname === "/") {
      navigate(`/`);
    }
  }, [debouncedSearchTerm, navigate, location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
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
      className={`h-20 flex items-center justify-between px-4 shadow-md gap-3 ${
        isDarkMode ? "bg-[#333333] text-[#F7C8C9]" : "bg-white text-gray-500"
      }`}
    >
      {/* 왼쪽: 로고 */}
      <Link to="/" className="h-20 flex items-center">
        <img
          src={isDarkMode ? darkLogo : lightLogo}
          alt="FLOLIX 로고"
          className="w-auto h-20 object-contain shrink-0"
        />
      </Link>

      {/* 가운데: PC 메뉴 */}
      <div className="hidden md:flex items-center gap-4">
        {/* 검색창 */}
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
            className={`w-64 px-4 py-2 rounded-full outline-none text-sm transition-all duration-300 pr-10 ${
              isDarkMode
                ? "bg-[#4C4C4C] text-white placeholder-gray-400 border border-gray-500"
                : "bg-[#EFE1E4] text-[#F2BDC5] placeholder-[#808080] border border-[#F2BDC5]"
            }`}
          />
          <button
            type="submit"
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
              isDarkMode ? "text-[#E2AF3B]" : "text-[#DDA026]"
            }`}
            aria-label="검색"
          >
            <Search size={20} />
          </button>
        </form>

        {/* 다크모드 버튼 */}
        <button
          onClick={toggleDarkMode}
          aria-label="다크모드 전환"
          className={`p-2 rounded-full transition hover:scale-105 duration-300 ${
            isDarkMode
              ? "bg-[#4C4C4C] text-[#E2AF3B]"
              : "bg-[#EFE1E4] text-[#DDA026]"
          }`}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* 로그인/회원가입 or 프로필 */}
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <img
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(!isDropdownOpen);
              }}
              src={user.profileImageUrl || DEFAULT_PROFILE_IMAGE}
              alt="프로필 이미지"
              className="w-10 h-10 rounded-full cursor-pointer border-2 hover:scale-105 transition"
            />
            {isDropdownOpen && (
              <div
                className={`absolute right-0 mt-2 w-32 rounded-lg shadow-md z-10 transition-all duration-300 ${
                  isDarkMode
                    ? "bg-[#333333] text-white"
                    : "bg-white text-[#333333]"
                }`}
              >
                <button
                  onClick={() => {
                    navigate("/mypage");
                    setIsDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#4C4C4C]"
                >
                  마이페이지
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#4C4C4C]"
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
              className={`px-4 py-2 rounded-lg text-sm transition hover:scale-105 duration-300 font-semibold whitespace-nowrap ${
                isDarkMode
                  ? "bg-[#8F1D22] hover:bg-[#E2AF3B] text-white"
                  : "bg-[#F2BDC5] hover:bg-[#DDA026] hover:text-white text-[#323333]"
              }`}
            >
              로그인
            </button>
            <button
              onClick={() => navigate("/signup")}
              className={`px-4 py-2 rounded-lg text-sm transition hover:scale-105 duration-300 font-semibold whitespace-nowrap ${
                isDarkMode
                  ? "bg-[#8F1D22] hover:bg-[#E2AF3B] text-white"
                  : "bg-[#F2BDC5] hover:bg-[#DDA026] hover:text-white text-[#323333]"
              }`}
            >
              회원가입
            </button>
          </div>
        )}
      </div>

      {/* 오른쪽: 모바일 전용 다크모드 + 햄버거 메뉴 */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          onClick={toggleDarkMode}
          aria-label="다크모드 전환"
          className={`p-2 rounded-full transition hover:scale-105 duration-300 ${
            isDarkMode
              ? "bg-[#4C4C4C] text-[#E2AF3B]"
              : "bg-[#EFE1E4] text-[#333333]"
          }`}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="모바일 메뉴 열기"
          className={`text-2xl transition ${
            isDarkMode ? "text-[#E2AF3B]" : "text-[#333333]"
          }`}
        >
          <Menu />
        </button>
      </div>

      {/* 모바일 메뉴 드롭다운 */}
      {isMobileMenuOpen && (
        <div
          className={`absolute top-20 left-0 w-full px-4 py-4 md:hidden flex flex-col gap-4 z-50 ${
            isDarkMode ? "bg-[#333333] text-white" : "bg-white text-gray-900"
          }`}
        >
          {/* 모바일 검색창 */}
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
              className={`w-full px-4 py-2 rounded-full outline-none text-sm transition-all duration-300 pr-10 ${
                isDarkMode
                  ? "bg-[#4C4C4C] text-white placeholder-gray-400 border border-gray-500"
                  : "bg-[#EFE1E4] text-[#F2BDC5] placeholder-[#808080] border border-[#F2BDC5]"
              }`}
            />
            <button
              type="submit"
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                isDarkMode ? "text-[#E2AF3B]" : "text-[#333333]"
              }`}
              aria-label="검색"
            >
              <Search size={20} />
            </button>
          </form>

          {/* 로그인 상태에 따른 메뉴 표시 */}
          {user ? (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  navigate("/mypage");
                  setIsMobileMenuOpen(false);
                }}
                className={`px-4 py-2 rounded-lg text-sm transition hover:scale-105 duration-300 font-semibold whitespace-nowrap ${
                  isDarkMode
                    ? "bg-[#8F1D22] hover:bg-[#E2AF3B] text-white"
                    : "bg-[#F2BDC5] hover:bg-[#A06B00] hover:text-white text-[#323333]"
                }`}
              >
                마이페이지
              </button>
              <button
                onClick={handleLogout}
                className={`px-4 py-2 rounded-lg text-sm transition hover:scale-105 duration-300 font-semibold whitespace-nowrap ${
                  isDarkMode
                    ? "bg-[#8F1D22] hover:bg-[#E2AF3B] text-white"
                    : "bg-[#F2BDC5] hover:bg-[#A06B00] hover:text-white text-[#323333]"
                }`}
              >
                로그아웃
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate("/login")}
                className={`px-4 py-2 rounded-lg text-sm transition hover:scale-105 duration-300 font-semibold whitespace-nowrap ${
                  isDarkMode
                    ? "bg-[#8F1D22] hover:bg-[#E2AF3B] text-white"
                    : "bg-[#F2BDC5] hover:bg-[#A06B00] hover:text-white text-[#323333]"
                }`}
              >
                로그인
              </button>
              <button
                onClick={() => navigate("/signup")}
                className={`px-4 py-2 rounded-lg text-sm transition hover:scale-105 duration-300 font-semibold whitespace-nowrap ${
                  isDarkMode
                    ? "bg-[#8F1D22] hover:bg-[#E2AF3B] text-white"
                    : "bg-[#F2BDC5] hover:bg-[#A06B00] hover:text-white text-[#323333]"
                }`}
              >
                회원가입
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
