import React from "react";
import { useLocation } from "react-router-dom";
import MovieList from "./MovieList";
import SearchResult from "./SearchResult";

const HomePage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const search = queryParams.get("search");

  return <>{search ? <SearchResult /> : <MovieList />}</>;
};

export default HomePage;
