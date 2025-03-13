import React from "react";
import { useLocation } from "react-router-dom";
import MovieList from "./MovieList";
import SearchResult from "./SearchResult";
import InfiniteMovieList from "../components/InfiniteMovieList"; // ✅ 무한스크롤 컴포넌트 import
import { useTheme } from "../context/ThemeContext";

const HomePage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const search = queryParams.get("search");

  const { isDarkMode } = useTheme(); // ✅ 다크모드 상태 가져오기

  return (
    <div
      className={`min-h-screen p-5 transition-all duration-300 ${
        isDarkMode
          ? "bg-gray-900 text-white" // ✅ 다크모드 스타일
          : "bg-pink-100 text-gray-700" // ✅ 라이트모드 스타일
      }`}
    >
      {search ? (
        <SearchResult />
      ) : (
        <>
          <MovieList />
          <h2 className="text-2xl font-bold my-7 text-center">
            🎬 추가 영화 더 보기
          </h2>
          <InfiniteMovieList />
        </>
      )}
    </div>
  );
};

export default HomePage;
