import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";

const LazyImage = ({ src, alt, className }) => {
  const wrapperRef = useRef(null); // ✅ 누락된 부분 복구!
  const imgRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const { isDarkMode } = useTheme();

  const fallbackSrc = isDarkMode
    ? "/icons/fallback-dark.png"
    : "/icons/fallback-light.png";

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    });

    if (wrapperRef.current) observer.observe(wrapperRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full h-full bg-gray-300 rounded-xl overflow-hidden"
    >
      {/* 이미지 정상 로딩 시 보여줄 실제 이미지 */}
      {isVisible && !hasError && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={`${className} ${loaded ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
          onLoad={() => setLoaded(true)}
          onError={() => setHasError(true)}
          loading="lazy"
        />
      )}

      {/* 에러거나 로딩 중일 때 fallback 이미지 표시 */}
      {(!loaded || hasError) && (
        <img
          src={fallbackSrc}
          alt="fallback"
          className={`${className} absolute top-0 left-0 w-full h-full object-cover`}
        />
      )}
    </div>
  );
};

export default LazyImage;
