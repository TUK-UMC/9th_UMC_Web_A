import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import SignUp from "./SignUp";
import MyPage from "./MyPage";
import AuthGuard from "./components/AuthGuard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
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