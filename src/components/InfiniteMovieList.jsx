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

  const observerRef = useRef(null);

  const fetchMovies = useCallback(
    async (pageToFetch) => {
      if (loading || !hasMore) return;

      setLoading(true);
      setError(null);

      try {
        console.log(`📱 페이지 ${pageToFetch} 영화 요청 중...`);

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

        if (!response.ok) {
          throw new Error(`HTTP 오류! 상태 코드: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ 영화 데이터 도착:", data);

        setMovies((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const newMovies = data.results.filter((m) => !existingIds.has(m.id));
          return [...prev, ...newMovies];
        });

        if (data.results.length === 0 || pageToFetch >= data.total_pages) {
          console.log("🚫 더 이상 데이터 없음");
          setHasMore(false);
        }
      } catch (err) {
        console.error("❌ 에러 발생:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [loading, hasMore],
  );

  useEffect(() => {
    if (hasMore) {
      fetchMovies(page);
    }
  }, [page]);

  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading) {
          console.log("👇 하단 감지됨 → 페이지 +1");
          setPage((prev) => prev + 1);
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0,
      },
    );

    const currentRef = observerRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [loading, hasMore]);

  return (
    <div
      className={`min-h-screen p-10 transition-all duration-300 ${
        isDarkMode ? "bg-[#161616] text-white" : "bg-[#F7C8C9] text-[#4C4C4C]"
      }`}
    >
      <div className="w-full max-w-screen-xl px-4 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex flex-wrap justify-start gap-4 mt-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={`skeleton-${i}`} />
          ))}
        </div>
      )}

      {error && (
        <div className="text-center text-red-500 p-10">
          ❌ 오류 발생: {error}
        </div>
      )}

      {hasMore && (
        <div
          ref={observerRef}
          style={{ height: "100px", backgroundColor: "transparent" }}
        />
      )}

      {!hasMore && (
        <div className="text-center text-sm text-gray-500 mt-10">
          ✅ 모든 영화를 다 불러왔어요!
        </div>
      )}
    </div>
  );
};

export default InfiniteMovieList;
