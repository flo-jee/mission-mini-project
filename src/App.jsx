import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout"; // ✅ Layout 추가
import MovieList from "./pages/MovieList";
import MovieDetail from "./pages/MovieDetail";

// ✅ 라우팅만 담당하는 컴포넌트
const App = () => {
  return (
    <Routes>
      {/* ✅ 모든 경로를 Layout으로 감싸서 NavBar 고정 */}
      <Route path="/" element={<Layout />}>
        {/* ✅ 메인 페이지 → index 사용! */}
        <Route index element={<MovieList />} />
        {/* ✅ 상세 페이지 → 상대경로만 작성! */}
        <Route path="details/:id" element={<MovieDetail />} />
      </Route>
    </Routes>
  );
};

export default App;
