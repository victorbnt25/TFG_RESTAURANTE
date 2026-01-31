import { Navigate, Outlet } from "react-router-dom";

export default function RutaProtegida() {
  const token = localStorage.getItem("token_admin");
  if (!token) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}
