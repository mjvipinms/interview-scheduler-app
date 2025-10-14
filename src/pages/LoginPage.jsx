import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import jwtDecode from "jwt-decode";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const routeByRole = (role) => {
    if (!role) return navigate("/");
    const normalized = role.toUpperCase();
    if (normalized === "ADMIN") navigate("/admin-dashboard");
    else if (normalized === "HR") navigate("/hr-dashboard");
    else if (normalized === "PANEL") navigate("/panel-dashboard");
    else navigate("/");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await login(username, password);
      const token = data?.token || data?.accessToken || data?.jwt;
      if (!token) {
        setError("No token returned from server");
        return;
      }
      localStorage.setItem("token", token);
      // decode to get role
      try {
        const role = data?.role;
        routeByRole(role);
        localStorage.setItem("role", role);
      } catch (err) {
        // if decode fails, go to default
        routeByRole(null);
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-primary">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-md w-80"
      >
        <h2 className="text-2xl font-semibold text-center mb-4 text-primary">
          Login
        </h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-primary text-white p-2 rounded hover:bg-sky-600"
        >
          Login
        </button>
      </form>
    </div>
  );
}
