import React, { useState, useEffect } from "react";
import movieList from "../data/movieListData.json"; // ✅ JSON 데이터 불러오기
import MovieCard from "../components/MovieCard";
import MovieSlider from "../components/MovieSlider";

const MovieList = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    setMovies(movieList.results); // ✅ JSON 데이터 상태에 저장
  }, []);

  return (
    <div className="min-h-screen bg-pink-100 text-pink-900 p-10">
      <MovieSlider />
      <h1 className="text-3xl font-bold mb-10">🎬 영화 목록</h1>
      {/* ✅ 가로로 배치, 넘치면 자동 줄바꿈 */}
      <div className="flex flex-wrap justify-center gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default MovieList;
