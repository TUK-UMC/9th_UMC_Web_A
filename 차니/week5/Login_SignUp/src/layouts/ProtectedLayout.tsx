import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const ProtectedLayout = () => {
  const { accessToken } = useAuth();

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="select-none bg-black h-screen">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default ProtectedLayout;
