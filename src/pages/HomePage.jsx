import React from "react";
import { useLocation } from "react-router-dom";
import MovieList from "./MovieList";
import SearchResult from "./SearchResult";
import InfiniteMovieList from "../components/InfiniteMovieList";
import { useTheme } from "../context/ThemeContext";
import { Helmet } from "react-helmet-async"; // ✅ Helmet 추가

const HomePage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const search = queryParams.get("search");

  const { isDarkMode } = useTheme();

  return (
    <>
      {/* ✅ Helmet으로 SEO 메타 설정 */}
      <Helmet>
        <title>
          {search
            ? `FLOLIX | '${search}' 검색 결과`
            : "FLOLIX | 인기 영화 둘러보기"}
        </title>
        <meta
          name="description"
          content={
            search
              ? `'${search}'에 대한 영화 검색 결과를 확인해보세요.`
              : "지금 가장 인기 있는 영화를 FLOLIX에서 확인하고 즐겨찾기 해보세요!"
          }
        />
      </Helmet>

      <div
        className={`min-h-screen p-5 transition-all duration-300 ${
          isDarkMode ? " text-white" : "bg-[#E5CACF] text-[#4C4C4C]"
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
    </>
  );
};

export default HomePage;
