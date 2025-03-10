import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useDebounce from "../hooks/useDebounce";

import MovieCard from "../components/MovieCard";
import MovieSlider from "../components/MovieSlider";
import SkeletonCard from "../components/SkeletonCard";

const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

const MovieList = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("search");

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = debouncedSearchTerm
          ? `https://api.themoviedb.org/3/search/movie?query=${debouncedSearchTerm}&language=ko-KR`
          : `https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1`;

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
  }, [debouncedSearchTerm]);

  if (loading) {
    return (
      <div className="text-center p-10">
        <h1 className="text-white text-2xl">로딩 중...</h1>
        <SkeletonCard />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">❌ 오류 발생: {error}</div>
    );
  }

  return (
    <div className="min-h-screen  text-pink-900 p-10">
      {!debouncedSearchTerm && <MovieSlider movies={movies} />}

      <h1 className="text-3xl font-bold mb-10 text-center">
        {debouncedSearchTerm
          ? `🔎 "${debouncedSearchTerm}" 검색 결과`
          : "🎬 인기 영화 목록"}
      </h1>

      <div className="flex flex-wrap justify-center gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default MovieList;
