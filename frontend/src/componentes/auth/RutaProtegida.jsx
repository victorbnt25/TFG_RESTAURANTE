import { Navigate, Outlet, useLocation } from "react-router-dom";

function RutaProtegida() {
  const location = useLocation();

  let usuario = null;

  try {
    const usuarioGuardado = sessionStorage.getItem("usuario");
    usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  } catch {
    usuario = null;
  }

  if (!usuario) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  if (usuario.rol !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default RutaProtegida;