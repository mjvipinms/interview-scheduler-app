import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/" replace />;
  try {
    const decoded = jwtDecode(token);
    const exp = decoded.exp;
    if (exp && Date.now() >= exp * 1000) {
      localStorage.removeItem('token');
      return <Navigate to="/" replace />;
    }
  } catch (e) {
    localStorage.removeItem('token');
    return <Navigate to="/" replace />;
  }
  return children;
}
