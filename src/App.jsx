import { Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import MovieList from "./pages/MovieList";
import MovieDetail from "./pages/MovieDetail";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<MovieList />} />
        <Route path="details/:id" element={<MovieDetail />} />
      </Route>
    </Routes>
  );
};

export default App;
