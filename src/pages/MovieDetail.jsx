import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";

// ✅ TMDB 인증 토큰과 이미지 URL
const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
const BASE_IMG_URL = "https://image.tmdb.org/t/p/w500";
const BASE_BACKDROP_URL = "https://image.tmdb.org/t/p/w1280";

const MovieDetail = () => {
  const { id } = useParams(); // URL에서 영화 id 가져오기
  const location = useLocation(); // state로 movie 데이터를 전달받기 위해
  const [movie, setMovie] = useState(location.state?.movie || null); // state에 movie가 있으면 바로 사용
  const [loading, setLoading] = useState(!movie); // movie가 없으면 로딩 true
  const [error, setError] = useState(null);

  // ✅ movie 데이터가 없을 때만 fetch
  useEffect(() => {
    if (movie) return; // 이미 데이터가 있으면 fetch 안 함

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
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetail();
  }, [id, movie]);

  // ✅ 로딩 상태일 때
  if (loading) {
    return <p className="text-white text-center mt-10">로딩 중...</p>;
  }

  // ✅ 에러 상태일 때
  if (error) {
    return (
      <div className="text-center text-red-500 p-10">❌ 오류 발생: {error}</div>
    );
  }

  // ✅ movie 데이터가 없을 경우 (예외 처리)
  if (!movie) {
    return (
      <div className="text-center text-red-500 p-10">
        ❌ 영화 정보를 찾을 수 없습니다.
      </div>
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
      <div className="bg-black bg-opacity-80 min-h-screen flex flex-col md:flex-row p-10 gap-10">
        {/* ✅ 왼쪽: 포스터 */}
        <div className="md:w-1/2 flex justify-center items-center">
          <img
            src={
              movie.poster_path
                ? `${BASE_IMG_URL}${movie.poster_path}`
                : "https://via.placeholder.com/500x750?text=No+Image"
            }
            alt={movie.title}
            className="rounded-lg shadow-lg md:w-[300px] aspect-[2/3] object-cover"
          />
        </div>

        {/* ✅ 오른쪽: 영화 정보 */}
        <div className="md:w-1/2 p-6 flex flex-col justify-center gap-4">
          <h1 className="text-4xl font-bold">{movie.title}</h1>
          <p className="text-lg text-yellow-400">
            ⭐ 평점: {movie.vote_average}
          </p>
          <p className="text-sm">{movie.overview}</p>

          <div>
            <span className="font-bold">장르:</span>{" "}
            {movie.genres?.map((genre) => genre.name).join(", ")}
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
