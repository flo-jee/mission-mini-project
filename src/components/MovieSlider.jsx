import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useTheme } from "../context/ThemeContext";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const BASE_IMG_URL = "https://image.tmdb.org/t/p/w500";

const MovieSlider = ({ movies }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className="">
      <h2
        className={`text-3xl font-bold mb-3 transition-colors duration-300
          ${isDarkMode ? "text-whith" : "text-[#4C4C4C]"}`}
      >
        🔥 인기 영화
      </h2>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={10}
        slidesPerView={2}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000, // 3초마다 자동으로 슬라이드 넘김
          disableOnInteraction: false, // 유저가 조작해도 자동 재시작
          pauseOnMouseEnter: true, // 마우스 올라가면 멈춤
        }}
        loop={true} // 끝에서 다시 처음으로 돌아가는 무한 루프
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 6 },
        }}
        className="w-full pb-14"
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id} className="flex flex-col items-center">
            <div className="relative w-[12rem] h-[18rem] rounded-lg overflow-hidden shadow-lg group">
              {/* ✅ 영화 포스터 */}
              <img
                src={
                  movie.poster_path
                    ? `${BASE_IMG_URL}${movie.poster_path}`
                    : "https://via.placeholder.com/500x750?text=No+Image"
                }
                alt={movie.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* ✅ 평점 배지 */}
              <div className="absolute top-2 right-2 bg-yellow-100/20 text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg backdrop-blur-sm">
                ⭐ {movie.vote_average}
              </div>

              {/* ✅ 제목 오버레이 */}
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2">
                <h3 className="text-white text-sm font-bold truncate">
                  {movie.title}
                </h3>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MovieSlider;
