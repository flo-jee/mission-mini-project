import React, { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import MovieSlider from "../components/MovieSlider";
import SkeletonCard from "../components/SkeletonCard"; // ✅ 로딩 스켈레톤 카드

const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

const MovieList = () => {
  // ✅ 상태값 선언
  const [movies, setMovies] = useState([]); // 영화 데이터 저장
  const [loading, setLoading] = useState(true); // 로딩 여부
  const [error, setError] = useState(null); // 에러 여부

  // ✅ TMDB 인기 영화 API 호출 (마운트될 때 실행)
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true); // 로딩 시작
      setError(null); // 에러 초기화

      try {
        const response = await fetch(
          "https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1",
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

        // ✅ 성인 영화 제외 (adult: false만 필터링)
        const safeMovies = data.results.filter((movie) => !movie.adult);

        // ✅ 영화 데이터 상태에 저장
        setMovies(safeMovies);
      } catch (error) {
        console.error("🔥 영화 데이터 가져오기 실패:", error);
        setError(error.message);
      }

      setLoading(false); // 로딩 완료
    };

    fetchMovies();
  }, []);

  // ✅ 로딩 중일 때 스켈레톤 카드 출력
  if (loading) {
    return (
      <div className="min-h-screen bg-pink-100 text-pink-900 p-10">
        <h1 className="text-3xl font-bold mb-10 text-center">🎬 로딩 중...</h1>
        <div className="flex flex-wrap justify-center gap-4">
          {[...Array(8)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  // ✅ 에러 발생 시 에러 메시지 출력
  if (error) {
    return (
      <div className="text-center text-red-500 p-10">❌ 오류 발생: {error}</div>
    );
  }

  // ✅ 실제 화면 렌더링 (슬라이더 + 카드 리스트)
  return (
    <div className="min-h-screen bg-pink-100 text-pink-900 p-10">
      {/* ✅ 인기 영화 슬라이더 */}
      <MovieSlider movies={movies} />

      <h1 className="text-3xl font-bold mb-10 text-center">🎬 영화 목록</h1>

      {/* ✅ 영화 카드 리스트 */}
      <div className="flex flex-wrap justify-center gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default MovieList;
