import { Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import MovieDetail from "./pages/MovieDetail";
import SearchResult from "./pages/SearchResult";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import MyPage from "./pages/MyPage";
import AuthCallback from "./pages/AuthCallback";
import HomePage from "./pages/HomePage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} /> {/* ✅ index가 홈 */}
        <Route path="details/:id" element={<MovieDetail />} />
        <Route path="search" element={<SearchResult />} />
        <Route path="signup" element={<Signup />} />
        <Route path="login" element={<Login />} />
        <Route path="mypage" element={<MyPage />} />
        <Route path="auth/callback" element={<AuthCallback />} />
      </Route>
    </Routes>
  );
};

export default App;
