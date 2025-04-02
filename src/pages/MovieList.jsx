import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useDebounce from "../hooks/useDebounce";
import MovieCard from "../components/MovieCard";
import MovieSlider from "../components/MovieSlider";
import SkeletonCard from "../components/SkeletonCard";
import { useTheme } from "../context/ThemeContext";
import { Helmet } from "react-helmet-async";

const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

const MovieList = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("search");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { isDarkMode } = useTheme();

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
        className={`min-h-screen p-10 transition-all duration-300 
        ${isDarkMode ? "bg-[#161616] text-white" : "bg-[#E5CACF] text-[#333333]"}`}
      >
        <Helmet>
          <title>FLOLIX | 인기 영화 로딩 중</title>
          <meta
            name="description"
            content="지금 인기 있는 영화를 불러오고 있습니다."
          />
        </Helmet>

        <h1 className="text-2xl font-semibold mb-6 text-center">
          🎬 인기 영화를 불러오는 중...
        </h1>

        <div className="flex flex-wrap justify-start gap-4">
          {Array.from({ length: 12 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen p-10 text-center transition-all duration-300 
        ${isDarkMode ? "bg-[#161616] text-white" : "bg-[#F7C8C9] text-[#4C4C4C]"}`}
      >
        <Helmet>
          <title>FLOLIX | 오류 발생</title>
          <meta
            name="description"
            content="인기 영화 데이터를 불러오는 중 오류가 발생했습니다."
          />
        </Helmet>
        ❌ 오류 발생: {error}
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-5 transition-all duration-300 
      ${isDarkMode ? "bg-[#161616] text-white" : "bg-[#E5CACF] text-[#4C4C4C]"}`}
    >
      <Helmet>
        <title>FLOLIX | 인기 영화 목록</title>
        <meta
          name="description"
          content="지금 가장 인기 있는 영화들을 FLOLIX에서 확인해보세요. 슬라이더와 카드 형식으로 제공됩니다."
        />
      </Helmet>

      <MovieSlider movies={movies} />

      <h1 className="text-3xl font-bold p-6 text-center">🎬 인기 영화 목록</h1>
      <div className="w-full max-w-screen-xl px-4 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieList;
