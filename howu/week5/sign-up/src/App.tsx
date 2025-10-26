import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import SignUp from "./SignUp";
import MyPage from "./MyPage";
import GoogleCallback from "./GoogleCallback";
import AuthGuard from "./components/AuthGuard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/v1/auth/google/callback" element={<GoogleCallback />} />
      <Route 
        path="/mypage" 
        element={
          <AuthGuard>
            <MyPage />
          </AuthGuard>
        } 
      />
    </Routes>
  );
}

export default App;