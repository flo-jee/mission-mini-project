import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // ✅ BrowserRouter 추가!
import App from "./App"; // ✅ App.jsx 불러오기
import "./index.css"; // ✅ Tailwind CSS 스타일 적용 (선택)

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
