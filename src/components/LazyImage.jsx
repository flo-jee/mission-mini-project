import React, { useEffect, useRef, useState } from "react";

const LazyImage = ({ src, alt, className }) => {
  const containerRef = useRef(null); // ✅ div에 붙일 ref
  const [isVisible, setIsVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    });

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full h-full`}>
      {!loaded && (
        <div className="absolute inset-0 bg-gray-300 animate-pulse rounded-xl z-0" />
      )}
      {isVisible && (
        <img
          src={src}
          alt={alt}
          className={`transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
        />
      )}
    </div>
  );
};

export default LazyImage;
