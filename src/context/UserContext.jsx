import React, { createContext, useState, useContext, useEffect } from "react";

// ✅ 1. Context 생성
export const UserContext = createContext(null);

// ✅ 2. Context Provider 컴포넌트
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ 3. 마운트 시 로컬스토리지에서 user 정보 불러오기
  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");

    console.log("✅ UserContext 초기 로딩 userInfo:", storedUserInfo);

    if (storedUserInfo) {
      setUser(JSON.parse(storedUserInfo));
    } else {
      setUser(null); // ❗ 혹시 없을 경우 명확하게 초기화
    }
  }, []);

  // ✅ 마운트 확인용 로그 (선택 사항)
  useEffect(() => {
    console.log("✅✅✅ UserProvider 마운트됨!");
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// ✅ 4. Context 훅 만들어서 쉽게 사용하기
const useUser = () => {
  return useContext(UserContext);
};

export default useUser;
