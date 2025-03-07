import React from "react";
import { Link } from "react-router-dom";

const BASE_IMG_URL = "https://image.tmdb.org/t/p/w500";

const MovieCard = ({ movie }) => {
  console.log(movie); // ✅ movie 객체 확인 (id가 있는지 체크)

  return (
    <div className="w-150 bg-pink-200 text-pink-900 rounded-lg overflow-hidden shadow-lg flex flex-col items-center p-2">
      {/* ✅ 카드 전체를 클릭하면 상세 페이지로 이동 */}
      <Link to={`/details/${movie.id}`} className="block w-full">
        <img
          src={`${BASE_IMG_URL}${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-[18rem] object-cover"
        />
      </Link>

      {/* ✅ 텍스트 크기 & 여백 조정 */}
      <div className="mt-2 text-center">
        <h3 className="text-[1rem] font-bold">{movie.title}</h3>
        <p className="text-yellow-900 text-[0.8rem]">⭐ {movie.vote_average}</p>
        <Link
          to={`/details/${movie.id}`}
          className="text-blue-900 text-[0.8rem] font-semibold hover:underline"
        >
          상세 보기
        </Link>
      </div>
    </div>
  );
};

export default MovieCard;
