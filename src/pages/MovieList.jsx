import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useDebounce from "../hooks/useDebounce";
import MovieCard from "../components/MovieCard";
import MovieSlider from "../components/MovieSlider";
import SkeletonCard from "../components/SkeletonCard";
import { useTheme } from "../context/ThemeContext"; // ✅ 다크모드 상태 불러오기

const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

const MovieList = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("search");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { isDarkMode } = useTheme(); // ✅ 다크모드 상태 가져오기

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = `https://api.themoviedb.org/3/movie/popular?language=ko-KR`;
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            "Content-Type": "application/json;charset=utf-8",
          },
        });

        const data = await response.json();
        const safeMovies = data.results.filter((movie) => !movie.adult);
        setMovies(safeMovies);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div
        className={`min-h-screen p-10 text-center transition-all duration-300 
        ${isDarkMode ? "bg-[#161616] text-white" : "bg-[#E5CACF] text-[#333333]"}`}
      >
        <h1 className="text-3xl mb-5">로딩 중...</h1>
        <SkeletonCard />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen p-10 text-center transition-all duration-300 
        ${isDarkMode ? "bg-[#161616] text-white" : "bg-[#F7C8C9] text-[#4C4C4C]"}`}
      >
        ❌ 오류 발생: {error}
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-5 transition-all duration-300 
      ${isDarkMode ? "bg-[#161616] text-white" : "bg-[#E5CACF] text-[#4C4C4C]"}`}
    >
      {/* 슬라이더 */}
      <MovieSlider movies={movies} />

      <h1 className="text-3xl font-bold p-6 text-center">🎬 인기 영화 목록</h1>

      {/* 카드 리스트 */}
      <div className="flex flex-wrap justify-center gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default MovieList;
