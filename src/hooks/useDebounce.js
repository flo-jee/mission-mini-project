import { useState, useEffect } from "react";

const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value); // 최종 디바운스 값 상태

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value); // delay 이후 최종 값 저장
    }, delay);

    // 만약 value가 변경되면 기존 타이머 취소하고 새로 등록!
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
export default useDebounce;
