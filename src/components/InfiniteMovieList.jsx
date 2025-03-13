import React, { useEffect, useRef, useState, useCallback } from "react";
import MovieCard from "./MovieCard";
import SkeletonCard from "./SkeletonCard";
import { useTheme } from "../context/ThemeContext";

const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

const InfiniteMovieList = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const { isDarkMode } = useTheme();

  const observerRef = useRef(null); // 하단 감지용 ref

  // ✅ 영화 데이터 가져오기 (loading, hasMore는 내부에서만 체크)
  const fetchMovies = useCallback(
    async (pageToFetch) => {
      if (loading || !hasMore) return;

      setLoading(true);
      setError(null);

      try {
        console.log(`📡 페이지 ${pageToFetch} 영화 요청 중...`);

        const response = await fetch(
          `https://api.themoviedb.org/3/movie/top_rated?language=ko-KR&page=${pageToFetch}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${ACCESS_TOKEN}`,
              "Content-Type": "application/json;charset=utf-8",
            },
          },
        );

        if (!response.ok)
          throw new Error(`HTTP 오류! 상태 코드: ${response.status}`);

        const data = await response.json();
        console.log("✅ 영화 데이터 도착:", data);

        // 중복 제거 후 새로운 영화 추가
        setMovies((prev) => {
          const existingIds = new Set(prev.map((movie) => movie.id));
          const newMovies = data.results.filter(
            (movie) => !existingIds.has(movie.id),
          );
          return [...prev, ...newMovies];
        });

        // 마지막 페이지 확인
        if (data.results.length === 0 || pageToFetch >= data.total_pages) {
          console.log("🚫 더 이상 데이터 없음!");
          setHasMore(false);
        }
      } catch (err) {
        console.error("❌ 영화 가져오기 실패:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [loading, hasMore],
  );

  // ✅ 페이지가 바뀔 때만 fetch 실행 (무한 루프 방지!)
  useEffect(() => {
    if (hasMore) {
      fetchMovies(page);
    }
  }, [page]);

  // ✅ IntersectionObserver (하단에 닿으면 페이지 +1)
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading) {
          console.log("👇 하단 감지됨! 다음 페이지 요청 준비");
          setPage((prev) => prev + 1);
        }
      },
      {
        root: null,
        rootMargin: "100px", // 하단 여백 조정 가능
        threshold: 1.0,
      },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [loading, hasMore]);

  return (
    <div
      className={`min-h-screen p-10 transition-all duration-300
    ${isDarkMode ? "bg-gray-900 text-white" : "bg-pink-100 "}`}
    >
      <div className="flex flex-wrap justify-center gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {loading && (
        <div className="flex justify-center gap-4 mt-10">
          {[...Array(3)].map((_, index) => (
            <SkeletonCard key={`skeleton-${index}`} />
          ))}
        </div>
      )}

      {error && (
        <div className="text-center text-red-500 p-10">
          ❌ 오류 발생: {error}
        </div>
      )}

      {/* 감지용 트리거 */}
      {hasMore && (
        <div
          ref={observerRef}
          style={{
            height: "100px",
            backgroundColor: "transparent",
          }}
        />
      )}

      {!hasMore && (
        <div className="text-center text-gray-700 mt-10">
          ✅ 모든 페이지를 다 불러왔어요!
        </div>
      )}
    </div>
  );
};

export default InfiniteMovieList;
