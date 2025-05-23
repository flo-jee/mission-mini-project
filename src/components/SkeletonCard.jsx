import React, { useEffect, useRef, useState } from "react";

const LazyImage = ({ src, alt, className }) => {
  const imgRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    });

    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative w-full h-full bg-gray-300 animate-pulse rounded-xl overflow-hidden">
      {isVisible && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={`${className} ${loaded ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
        />
      )}
      {/* 로딩 완료되면 배경 스켈레톤 제거 */}
      {loaded && <div className="absolute inset-0 bg-transparent" />}
    </div>
  );
};

export default LazyImage;
