import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // ✅ BrowserRouter 추가!
import App from "./App"; // ✅ App.jsx 불러오기
import "./index.css"; // ✅ Tailwind CSS 스타일 적용 (선택)

// ✅ React 앱이 시작되는 부분
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* ✅ 라우터를 앱 최상단에 배치 → 한 번만! */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
