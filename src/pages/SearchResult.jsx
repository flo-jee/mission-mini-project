import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // ✅ 현재 URL 정보 가져오기
import useDebounce from "../hooks/useDebounce"; // ✅ 디바운스 커스텀 훅
import MovieCard from "../components/MovieCard";
import SkeletonCard from "../components/SkeletonCard";

// ✅ TMDB API 토큰 (.env 파일에 저장한 값)
const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

const SearchResult = () => {
  // ✅ 상태 선언
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
      console.log("🗑️ 검색어가 비어있음 → 캐시 삭제");
      sessionStorage.removeItem(`search-${debouncedSearchTerm}`);
    }
  }, [debouncedSearchTerm]);

  // ✅ 검색 결과 API 호출 (검색어가 바뀔 때마다)
  useEffect(() => {
    const fetchSearchMovies = async () => {
      setLoading(true);
      setError(null);

      // ✅ 캐시 데이터가 있는지 먼저 확인
      const cacheKey = `search-${debouncedSearchTerm}`;
      const cachedMovies = sessionStorage.getItem(cacheKey);

      if (cachedMovies) {
        console.log("✅ 캐시에서 검색 결과 사용 중:", debouncedSearchTerm);
        setMovies(JSON.parse(cachedMovies));
        setLoading(false);
        return;
      }

      try {
        // ✅ TMDB 검색 API 호출
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

        // ✅ 성인 영화 제외
        const safeMovies = data.results.filter((movie) => !movie.adult);

        // ✅ 상태 업데이트 및 캐시 저장
        setMovies(safeMovies);
        sessionStorage.setItem(cacheKey, JSON.stringify(safeMovies));
      } catch (error) {
        console.error("🔥 검색 영화 데이터 가져오기 실패:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (debouncedSearchTerm) {
      fetchSearchMovies();
    }
  }, [debouncedSearchTerm]);

  // ✅ 로딩 중
  if (loading) {
    return (
      <div className="min-h-screen bg-pink-100 text-pink-900 p-10">
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
      <div className="text-center text-red-500 p-10">❌ 오류 발생: {error}</div>
    );
  }

  // ✅ 검색 결과 화면
  return (
    <div className="min-h-screen bg-pink-100 text-pink-900 p-10">
      {/* ✅ 페이지 타이틀 */}
      <h1 className="text-3xl font-bold mb-10 text-center">
        🔎 "{debouncedSearchTerm}" 검색 결과
      </h1>

      {/* ✅ 검색 결과 리스트 */}
      <div className="flex flex-wrap justify-center gap-4">
        {movies.length > 0 ? (
          movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
        ) : (
          <p className="text-center text-gray-700 text-lg">
            검색 결과가 없습니다.
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchResult;
