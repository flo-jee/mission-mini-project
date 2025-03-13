import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // ✅ 현재 URL 정보 가져오기
import useDebounce from "../hooks/useDebounce"; // ✅ 디바운스 커스텀 훅
import MovieCard from "../components/MovieCard";
import SkeletonCard from "../components/SkeletonCard";
import { useTheme } from "../context/ThemeContext";

// ✅ TMDB API 토큰 (.env 파일에 저장한 값)
const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

const SearchResult = () => {
  const { isDarkMode } = useTheme(); // ✅ 다크모드 상태 가져오기
  const [movies, setMovies] = useState([]); // 영화 데이터
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  const location = useLocation(); // ✅ 현재 URL의 정보를 가져옴
  const queryParams = new URLSearchParams(location.search); // ✅ ?search= 값을 추출
  const searchTerm = queryParams.get("search");

  const debouncedSearchTerm = useDebounce(searchTerm, 500); // ✅ 검색어 디바운스 처리

  // ✅ 캐시 초기화 (검색어가 없을 때 캐시 삭제)
  useEffect(() => {
    if (!debouncedSearchTerm) {
      sessionStorage.removeItem(`search-${debouncedSearchTerm}`);
    }
  }, [debouncedSearchTerm]);

  // ✅ 검색 결과 API 호출 (검색어가 바뀔 때마다)
  useEffect(() => {
    const fetchSearchMovies = async () => {
      setLoading(true);
      setError(null);

      const cacheKey = `search-${debouncedSearchTerm}`;

      // ✅ 캐시 데이터 확인
      const cachedMovies = sessionStorage.getItem(cacheKey);
      if (cachedMovies) {
        setMovies(JSON.parse(cachedMovies));
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?query=${debouncedSearchTerm}&language=ko-KR`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${ACCESS_TOKEN}`,
              "Content-Type": "application/json;charset=utf-8",
            },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP 오류! 상태 코드: ${response.status}`);
        }

        const data = await response.json();

        const safeMovies = data.results.filter((movie) => !movie.adult);
        setMovies(safeMovies);

        // ✅ 캐시에 저장
        sessionStorage.setItem(cacheKey, JSON.stringify(safeMovies));

        // ✅ 검색 후 새로고침 (단, 한 번만 실행!)
        if (!sessionStorage.getItem("hasRefreshed")) {
          sessionStorage.setItem("hasRefreshed", "true");
          window.location.reload();
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (debouncedSearchTerm) {
      fetchSearchMovies();
    }
  }, [debouncedSearchTerm]);

  // ✅ 새로고침 후 플래그 초기화
  useEffect(() => {
    return () => {
      sessionStorage.removeItem("hasRefreshed");
    };
  }, []);

  // ✅ 로딩 중
  if (loading) {
    return (
      <div
        className={`min-h-screen p-10 transition-colors duration-300
        ${isDarkMode ? "bg-gray-800 text-white" : "bg-pink-100 text-pink-900"}`}
      >
        <h1 className="text-3xl font-bold mb-10 text-center">🔍 검색 중...</h1>
        <div className="flex flex-wrap justify-center gap-4">
          {[...Array(8)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  // ✅ 에러 발생 시
  if (error) {
    return (
      <div
        className={`text-center p-10 transition-colors duration-300 
        ${isDarkMode ? "text-red-400" : "text-red-500"}`}
      >
        ❌ 오류 발생: {error}
      </div>
    );
  }

  // ✅ 검색 결과 화면
  return (
    <div
      className={`min-h-screen p-10 transition-colors duration-300
      ${isDarkMode ? "bg-gray-800 text-white" : "bg-pink-100 text-pink-900"}`}
    >
      <h1 className="text-3xl font-bold mb-10 text-center">
        🔎 "{debouncedSearchTerm}" 검색 결과
      </h1>

      <div className="flex flex-wrap justify-center gap-4">
        {movies.length > 0 ? (
          movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
        ) : (
          <p
            className={`text-center text-lg ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            검색 결과가 없습니다.
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchResult;
