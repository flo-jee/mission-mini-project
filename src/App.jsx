import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import MovieList from "./pages/MovieList";
import MovieDetail from "./pages/MovieDetail";

const App = () => {
  return (
    <Routes>
      {/* ✅ Layout을 감싸서 모든 페이지에 NavBar 적용 */}
      <Route path="/" element={<Layout />}>
        <Route index element={<MovieList />} />
        <Route path="details/:id" element={<MovieDetail />} />
      </Route>
    </Routes>
  );
};

export default App;
