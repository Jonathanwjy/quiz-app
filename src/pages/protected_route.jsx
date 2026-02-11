import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  // Ambil langsung dari localStorage untuk sinkronisasi instan
  const token = localStorage.getItem("token");

  const isAuthenticated = token && token.length > 0;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
