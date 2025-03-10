import React, { createContext, useContext, useState, useEffect } from "react";

// ✅ Context 생성
const ThemeContext = createContext();

// ✅ ThemeProvider 컴포넌트 생성
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // 로컬스토리지에서 값 가져오기 (기본값은 false)
    const savedTheme = localStorage.getItem("darkMode");
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  // ✅ 다크모드 상태 변경 시 로컬스토리지에 저장
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // ✅ 토글 함수
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ✅ 커스텀 훅으로 쉽게 접근
export const useTheme = () => useContext(ThemeContext);
