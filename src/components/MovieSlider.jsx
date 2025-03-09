import React from "react";
// Swiper 핵심 컴포넌트 임포트
import { Swiper, SwiperSlide } from "swiper/react";
// Swiper 모듈 (네비게이션/페이지네이션 기능)
import { Navigation, Pagination } from "swiper/modules";

// Swiper 스타일 시트 임포트
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// TMDB 포스터 이미지 base URL
const BASE_IMG_URL = "https://image.tmdb.org/t/p/w500";

/* MovieSlider 컴포넌트
 * @param {Array} movies - 상위 컴포넌트(MovieList)에서 받아온 영화 리스트
 */
const MovieSlider = ({ movies }) => {
  return (
    <div className="w-full px-6 py-4">
      {/* 슬라이더 제목 */}
      <h2 className="text-3xl font-bold text-pink-800 mb-4">🔥 인기 영화</h2>

      {/* Swiper 슬라이더 설정 */}
      <Swiper
        modules={[Navigation, Pagination]} // 모듈 적용 (네비/페이지네이션)
        spaceBetween={10} // 슬라이드 간격
        slidesPerView={6} // 기본 슬라이드 개수
        navigation // 좌/우 화살표 버튼 활성화
        pagination={{ clickable: true }} // 하단 페이지네이션 활성화
        breakpoints={{
          // 반응형 설정
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 6 },
        }}
        className="w-full"
      >
        {/* 영화 목록 순회해서 슬라이드 생성 */}
        {movies.map((movie) => (
          <SwiperSlide key={movie.id} className="flex flex-col items-center">
            {/* 영화 포스터 이미지 */}
            <img
              src={
                movie.poster_path
                  ? `${BASE_IMG_URL}${movie.poster_path}` // 포스터 있을 경우
                  : "https://via.placeholder.com/500x750?text=No+Image" // 포스터 없을 경우 기본 이미지
              }
              alt={movie.title}
              className="w-[12rem] h-[18rem] object-cover rounded-lg shadow-lg"
            />

            {/* 영화 제목과 평점 */}
            <div className="text-center mt-2">
              <h3 className="text-pink-800 text-sm font-bold truncate w-[12rem]">
                {movie.title}
              </h3>
              <p className="text-yellow-600 text-xs">⭐ {movie.vote_average}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MovieSlider;
