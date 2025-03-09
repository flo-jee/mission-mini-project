import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
const BASE_IMG_URL = "https://image.tmdb.org/t/p/w500";
const BASE_BACKDROP_URL = "https://image.tmdb.org/t/p/w1280";

const MovieDetail = () => {
  const { id } = useParams(); // ✅ URL 파라미터로 영화 id 가져오기
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?language=ko-KR`,
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
        setMovie(data);
      } catch (error) {
        console.error("🔥 영화 상세 데이터 가져오기 실패:", error);
        setError(error.message);
      }

      setLoading(false);
    };

    fetchMovieDetail();
  }, [id]);

  if (loading) {
    return <p className="text-white text-center">로딩 중...</p>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-10">❌ 오류 발생: {error}</div>
    );
  }

  return (
    <div
      className="min-h-screen text-white"
      style={{
        backgroundImage: `url(${BASE_BACKDROP_URL}${movie.backdrop_path})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-black bg-opacity-80 min-h-screen flex flex-col md:flex-row p-10">
        <div className="md:w-1/3 flex justify-center">
          <img
            src={`${BASE_IMG_URL}${movie.poster_path}`}
            alt={movie.title}
            className="rounded-lg shadow-lg w-[300px]"
          />
        </div>

        <div className="md:w-2/3 p-6 flex flex-col gap-4">
          <h1 className="text-4xl font-bold">{movie.title}</h1>
          <p className="text-lg text-yellow-400">
            ⭐ 평점: {movie.vote_average}
          </p>
          <p className="text-sm">{movie.overview}</p>
          <div>
            <span className="font-bold">장르:</span>{" "}
            {movie.genres.map((genre) => genre.name).join(", ")}
          </div>
          <Link
            to="/"
            className="mt-4 inline-block bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
          >
            ⬅ 메인 페이지로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
