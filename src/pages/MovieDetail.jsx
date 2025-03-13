import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";

// ✅ TMDB API 설정
const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
const BASE_IMG_URL = "https://image.tmdb.org/t/p/w500";
const BASE_BACKDROP_URL = "https://image.tmdb.org/t/p/w1280";

const MovieDetail = () => {
  const { id } = useParams();
  const location = useLocation();

  const movieFromState = location.state?.movie || null;

  // ✅ 초기값: state에서 넘어오면 바로 넣고, 아니면 null로 시작!
  const [movie, setMovie] = useState(movieFromState);
  const [loading, setLoading] = useState(!movieFromState);
  const [error, setError] = useState(null);

  // ✅ 디버깅용 로그
  console.log("✅ [MovieDetail] URL Params id:", id);
  console.log("✅ [MovieDetail] location.state:", location.state);
  console.log("✅ [MovieDetail] movieFromState:", movieFromState);

  // ✅ 영화 상세 정보 불러오기
  const fetchMovieDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("📡 [MovieDetail] API 요청 시작! 영화 ID:", id);

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
      console.log("✅ [MovieDetail] fetch 성공:", data);

      setMovie(data);
    } catch (error) {
      console.error("❌ [MovieDetail] fetch 실패:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ movie가 없으면 fetch
  useEffect(() => {
    if (!movie && id) {
      console.log("🔔 [MovieDetail] movie가 없어서 fetchMovieDetail 실행");
      fetchMovieDetail();
    } else {
      console.log("👌 [MovieDetail] state에서 받은 movie 사용 중");
    }
  }, [id, movie]);

  // ✅ 로딩 중 화면
  if (loading) {
    return <p className="text-white text-center mt-10">로딩 중...</p>;
  }

  // ✅ 에러 화면
  if (error) {
    return (
      <div className="text-center text-red-500 p-10">❌ 오류 발생: {error}</div>
    );
  }

  // ✅ 영화 정보가 없을 경우
  if (!movie) {
    return (
      <div className="text-center text-red-500 p-10">
        ❌ 영화 정보를 찾을 수 없습니다.
      </div>
    );
  }

  // ✅ 정상적으로 데이터를 가져왔을 경우
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
        {/* ✅ 포스터 이미지 */}
        <div className="md:w-1/2 flex justify-center items-center">
          <img
            src={
              movie.poster_path
                ? `${BASE_IMG_URL}${movie.poster_path}`
                : "https://via.placeholder.com/500x750?text=No+Image"
            }
            alt={movie.title}
            className="rounded-lg shadow-lg w-[80%] aspect-[2/3] object-cover"
          />
        </div>

        {/* ✅ 영화 설명 */}
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
