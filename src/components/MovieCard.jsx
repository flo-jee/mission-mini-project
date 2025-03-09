import React from "react";
import { Link } from "react-router-dom";

const BASE_IMG_URL = "https://image.tmdb.org/t/p/w500";

const MovieCard = ({ movie }) => {
  return (
    <div className="w-[15rem] bg-pink-200 text-pink-900 rounded-lg overflow-hidden shadow-lg flex flex-col items-center p-2">
      <img
        src={
          movie.poster_path
            ? `${BASE_IMG_URL}${movie.poster_path}`
            : "https://via.placeholder.com/500x750?text=No+Image"
        }
        alt={movie.title}
        className="w-full h-[20rem] object-cover"
      />
      <div className="mt-2 text-center">
        <h3 className="text-[1rem] font-bold">{movie.title}</h3>
        <p className="text-yellow-900 text-[0.8rem]">⭐ {movie.vote_average}</p>

        {/* ✅ 상세 페이지 이동 */}
        <Link
          to={`/details/${movie.id}`}
          className="text-blue-900 text-[0.7rem] hover:underline"
        >
          상세 보기
        </Link>
      </div>
    </div>
  );
};

export default MovieCard;
