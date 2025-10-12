import { Routes, Route, Link, Navigate } from "react-router-dom";
import Login from "./Login";
import SignUp from "./SignUp";

function App() {
  return (
    <div className="container mx-auto">
      <nav className="p-5">
        <ul className="flex space-x-4">
          <li>
            <Link to="/login" className="text-blue-500 hover:text-blue-800">Login</Link>
          </li>
          <li>
            <Link to="/signup" className="text-blue-500 hover:text-blue-800">Sign Up</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </div>
  );
}

export default App;