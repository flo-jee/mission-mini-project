import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import movieDetailData from "../data/movieDetailData.json"; // ✅ JSON 데이터 가져오기

const BASE_IMG_URL = "https://image.tmdb.org/t/p/w500";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    setMovie(movieDetailData); // ✅ JSON 데이터를 상태에 저장
  }, []);

  if (!movie) return <div className="text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-pink-100 text-white p-8 flex flex-col md:flex-row gap-8">
      {/* ✅ 왼쪽 (화면 절반을 차지하는 포스터) */}
      <div className="w-full md:w-1/2 flex justify-center">
        <img
          src={`${BASE_IMG_URL}${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-auto object-cover rounded-lg shadow-lg"
        />
      </div>

      {/* ✅ 오른쪽 정보 (화면 절반 차지) */}
      <div className="w-full md:w-1/2 flex flex-col gap-4">
        {/* ✅ 제목 & 평점 (제목이 크고, 평점이 오른쪽) */}
        <div className="flex gap-2">
          <h1 className="bg-gray-600 text-white text-[2rem] font-bold p-4 rounded-lg flex-1">
            {movie.title}
          </h1>
          <p className="bg-yellow-100 text-black text-lg font-bold px-4 py-3 rounded-lg w-[5rem] flex items-center justify-center">
            ⭐ {movie.vote_average}
          </p>
        </div>

        {/* ✅ 장르 */}
        <div className="bg-gray-700 text-white p-3 rounded-lg">
          <p className="text-sm font-bold">
            {movie.genres?.map((g) => g.name).join(", ")}
          </p>
        </div>

        {/* ✅ 줄거리 */}
        <div className="bg-gray-500 text-white p-4 rounded-lg">
          <p className="text-sm leading-relaxed">{movie.overview}</p>
        </div>

        {/* ✅ 메인 페이지로 돌아가기 버튼 */}
        <Link
          to="/"
          className="mt-4 bg-gray-100 text-gray-900 px-4 py-2 text-sm rounded-lg shadow hover:bg-gray-400 w-max"
        >
          ⬅ 메인 페이지로 돌아가기
        </Link>
      </div>
    </div>
  );
};

export default MovieDetail;
