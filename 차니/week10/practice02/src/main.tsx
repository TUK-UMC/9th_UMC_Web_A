import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  // StrictMode를 사용하지 않는 방식으로 최적화할 수도 있긴 함.
  <StrictMode>
    <App />
  </StrictMode>
);
