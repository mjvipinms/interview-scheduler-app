import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import HRDashboard from "./pages/HRDashboard";
import PanelDashboard from "./pages/PanelDashboard";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/ProtectedRoute";
import UserListPage from "./pages/UserListPage";
import UserFormPage from "./pages/UserFormPage";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr-dashboard"
          element={
            <ProtectedRoute>
              <HRDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/panel-dashboard"
          element={
            <ProtectedRoute>
              <PanelDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/admin/users" element={<Navigate to="/users/role/ADMIN" replace />} />

        <Route
          path="/users/role/:role"
          element={
            <ProtectedRoute>
              <UserListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users/new"
          element={
            <ProtectedRoute>
              <UserFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users/:id/edit"
          element={
            <ProtectedRoute>
              <UserFormPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
        <Route
          path="/users/role/:role/new"
          element={
            <ProtectedRoute>
              <UserFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/role/:role/:id/edit"
          element={
            <ProtectedRoute>
              <UserFormPage />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}
