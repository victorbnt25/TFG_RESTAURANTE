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

/*
CAMBIOS REALIZADOS EN ESTE ARCHIVO

1. Se protege el acceso a las rutas de administración.
2. Se lee el usuario guardado en localStorage.
3. Si no existe usuario autenticado, se redirige a /admin/login.
4. Si existe usuario pero no tiene rol ADMIN, se redirige al inicio.
5. Si el usuario sí es ADMIN, se permite acceder al contenido protegido.
6. Se utiliza Outlet para renderizar las rutas hijas de administración.
7. Con este cambio el panel de administración queda restringido solo a administradores.
*/