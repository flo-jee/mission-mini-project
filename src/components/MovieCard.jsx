import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import LazyImage from "./LazyImage";
import { IMAGE_SIZE } from "../constants/imageSize"; // ✅ 이미지 사이즈 상수 import

const PLACEHOLDER_IMG_URL = "https://via.placeholder.com/500x750?text=No+Image";
const DETAILS_PATH = "/details";

const getPosterUrl = (posterPath) => {
  return posterPath
    ? `https://image.tmdb.org/t/p/${IMAGE_SIZE.MEDIUM}${posterPath}` // ✅ w342로 변경
    : PLACEHOLDER_IMG_URL;
};

const MovieCard = ({ movie }) => {
  const { isDarkMode } = useTheme();
  const posterUrl = getPosterUrl(movie.poster_path);
  const movieTitle = movie.title || "제목 없음";

  return (
    <Link
      to={`${DETAILS_PATH}/${movie.id}`}
      state={{ movie }}
      className={`relative w-full sm:w-[15rem] rounded-xl overflow-hidden flex flex-col justify-between shadow-lg transition-all duration-300 cursor-pointer
        ${isDarkMode ? "bg-[#1e1e1e] text-white" : "bg-[#A06B00] text-[#4C4C4C]"}
        hover:scale-105 hover:shadow-2xl`}
    >
      {/* ✅ 포스터 이미지 (Lazy Load + 고정 높이) */}
      <div className="relative w-full h-[22rem]">
        <LazyImage
          src={posterUrl}
          alt={movieTitle}
          className="w-full h-full object-cover rounded-xl"
        />

        {/* ✅ 평점 뱃지 */}
        <div
          className={`absolute top-2 right-2 px-2 py-1 text-xs rounded-full font-semibold shadow-md
          ${isDarkMode ? "bg-yellow-100/20 text-[#2D1B02]" : "bg-yellow-100/60 text-yellow-900"}`}
        >
          ⭐ {movie.vote_average?.toFixed(1)}
        </div>
      </div>

      {/* ✅ 텍스트 영역 */}
      <div className="bg-[#4C4C4C] flex flex-col gap-2 p-3 text-white">
        <h3 className="text-lg font-bold truncate">{movieTitle}</h3>
      </div>
    </Link>
  );
};

export default MovieCard;
