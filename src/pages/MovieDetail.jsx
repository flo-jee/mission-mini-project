import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async"; // ✅ Helmet 추가
import { IMAGE_SIZE } from "../constants/imageSize"; // ✅ 사이즈 상수 import

const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
const BASE_IMG_URL = `https://image.tmdb.org/t/p/${IMAGE_SIZE.LARGE}`;
const BASE_BACKDROP_URL = `https://image.tmdb.org/t/p/${IMAGE_SIZE.BACKDROP}`;

const MovieDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const movieFromState = location.state?.movie || null;

  const [movie, setMovie] = useState(movieFromState);
  const [loading, setLoading] = useState(!movieFromState);
  const [error, setError] = useState(null);

  const fetchMovieDetail = async () => {
    try {
      setLoading(true);
      setError(null);

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
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!movie && id) {
      fetchMovieDetail();
    }
  }, [id, movie]);

  if (loading) {
    return (
      <>
        <Helmet>
          <title>FLOLIX | 영화 정보 로딩 중</title>
          <meta
            name="description"
            content="선택한 영화 정보를 불러오는 중입니다."
          />
        </Helmet>
        <p className="text-white text-center mt-10">로딩 중...</p>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>FLOLIX | 오류 발생</title>
          <meta
            name="description"
            content="영화 정보를 불러오는 중 오류가 발생했습니다."
          />
        </Helmet>
        <div className="text-center text-red-500 p-10">
          ❌ 오류 발생: {error}
        </div>
      </>
    );
  }

  if (!movie) {
    return (
      <>
        <Helmet>
          <title>FLOLIX | 영화 정보를 찾을 수 없음</title>
          <meta
            name="description"
            content="선택한 영화 정보를 찾을 수 없습니다."
          />
        </Helmet>
        <div className="text-center text-red-500 p-10">
          ❌ 영화 정보를 찾을 수 없습니다.
        </div>
      </>
    );
  }

  return (
    <>
      {/* ✅ SEO 메타 정보 설정 */}
      <Helmet>
        <title>{movie.title} | FLOLIX</title>
        <meta
          name="description"
          content={
            movie.overview
              ? movie.overview.slice(0, 100) + "..."
              : "영화 상세 정보를 확인해보세요."
          }
        />
      </Helmet>

      <div
        className="min-h-screen text-white"
        style={{
          backgroundImage: `url(${BASE_BACKDROP_URL}${movie.backdrop_path})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-black bg-opacity-80 min-h-screen flex flex-col md:flex-row p-10">
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
              className="mt-4 inline-block bg-[#4C4C4C] text-white px-4 py-2 rounded-lg hover:bg-[#161616]"
            >
              ⬅ 메인 페이지로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieDetail;
