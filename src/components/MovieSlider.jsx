import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import movieList from "../data/movieListData.json";

const BASE_IMG_URL = "https://image.tmdb.org/t/p/w500";

const MovieSlider = () => {
  return (
    <div className="w-full px-6 py-4">
      <h2 className="text-3xl font-bold text-pink-800 mb-4">🔥 인기 영화</h2>

      {/* ✅ Swiper 설정 */}
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={10} // 슬라이드 간격
        slidesPerView={4} // 한 번에 4개 표시
        navigation // 화살표 버튼 추가
        pagination={{ clickable: true }} // 페이지네이션 추가
        breakpoints={{
          // 반응형 설정
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        className="w-full"
      >
        {movieList.results.map((movie) => (
          <SwiperSlide key={movie.id} className="flex justify-center">
            <img
              src={`${BASE_IMG_URL}${movie.poster_path}`}
              alt={movie.title}
              className="w-[12rem] h-[18rem] object-cover rounded-lg shadow-lg"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MovieSlider;
