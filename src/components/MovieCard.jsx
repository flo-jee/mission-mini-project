import React from "react";
import { Link } from "react-router-dom";

// ✅ 이미지 URL 기본값
const BASE_IMG_URL = "https://image.tmdb.org/t/p/w500";

const MovieCard = ({ movie }) => {
  return (
    <div className="w-full sm:w-[15rem] bg-pink-200 text-pink-900 rounded-lg overflow-hidden shadow-lg flex flex-col items-center p-2">
      {/* ✅ 영화 포스터 이미지 */}
      <img
        src={
          movie.poster_path
            ? `${BASE_IMG_URL}${movie.poster_path}` // 포스터가 있으면 출력
            : "https://via.placeholder.com/500x750?text=No+Image" // 없으면 기본 이미지
        }
        alt={movie.title}
        className="w-full h-[20rem] object-cover rounded-md"
      />

      {/* ✅ 영화 정보 텍스트 */}
      <div className="mt-2 text-center">
        <h3 className="text-[1rem] sm:text-lg font-bold">{movie.title}</h3>

        {/* ✅ 평점 */}
        <p className="text-yellow-900 text-[0.8rem] sm:text-sm">
          ⭐ {movie.vote_average}
        </p>

        {/* ✅ 상세 보기 버튼 (state로 영화 정보 전달) */}
        <Link
          to={`/details/${movie.id}`} // 동적 라우터로 이동
          state={{ movie }} // 영화 데이터를 함께 전달 (React Router state)
          className="text-blue-900 text-[0.7rem] hover:underline mt-1 inline-block"
        >
          상세 보기
        </Link>
      </div>
    </div>
  );
};

export default MovieCard;
