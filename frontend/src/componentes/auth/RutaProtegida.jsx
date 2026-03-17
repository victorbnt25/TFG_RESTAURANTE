import { Navigate, Outlet, useLocation } from "react-router-dom";

function RutaProtegida() {
  const location = useLocation();

  const usuarioGuardado = localStorage.getItem("usuario");
  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;

  // Si no hay sesión, mandar al login admin
  if (!usuario) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  // Si hay sesión pero no es admin, mandar al inicio
  if (usuario.rol !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  // Si es admin, permitir acceso a las rutas hijas
  return <Outlet />;
}

export default RutaProtegida;
