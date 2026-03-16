export const API_URL = "http://localhost:8000";

export async function request(ruta, opciones = {}) {
  const url = `${API_URL}${ruta.startsWith("/index.php") ? ruta : "/index.php" + ruta}`;

  const opcionesFinales = { ...opciones };

  if (!opcionesFinales.headers) {
    opcionesFinales.headers = {};
  }

  if (!(opcionesFinales.body instanceof FormData)) {
    opcionesFinales.headers["Content-Type"] = "application/json";
  }

  const respuesta = await fetch(url, opcionesFinales);

  let datos = null;

  try {
    datos = await respuesta.json();
  } catch (error) {
    datos = null;
  }

  if (!respuesta.ok) {
    const mensaje =
      datos?.error ||
      datos?.mensaje ||
      datos?.message ||
      "Error en la petición";

    throw new Error(mensaje);
  }

  return datos;
}

export async function obtenerCategorias() {
  return await request("/api/categorias");
}

export async function obtenerPlatos(idCategoria = null) {
  let ruta = "/api/platos";

  if (idCategoria) {
    ruta += `?categoria=${idCategoria}`;
  }

  return await request(ruta);
}

export async function obtenerDetallePlato(idPlato) {
  return await request(`/api/platos/${idPlato}`);
}

export async function crearReserva(datosReserva) {
  return await request("/api/reservas", {
    method: "POST",
    body: JSON.stringify(datosReserva),
  });
}

export async function registrarUsuario(datosUsuario) {
  return await request("/api/register", {
    method: "POST",
    body: JSON.stringify(datosUsuario),
  });
}

export async function iniciarSesion(datosLogin) {
  return await request("/api/login", {
    method: "POST",
    body: JSON.stringify(datosLogin),
  });
}

export async function enviarContacto(datosContacto) {
  return await request("/api/contacto", {
    method: "POST",
    body: JSON.stringify(datosContacto),
  });
}

/*
CAMBIOS REALIZADOS EN ESTE ARCHIVO

1. Se mantiene una función base llamada request() para centralizar todas las peticiones al backend.
2. Se configura la URL base apuntando a Symfony en http://localhost:8000.
3. Se añade automáticamente /index.php a las rutas para evitar problemas con Symfony.
4. Se controla el Content-Type:
   - Si se envía JSON, se usa application/json.
   - Si se envía FormData, no se fuerza Content-Type.
5. Se mejora el control de errores:
   - Si la respuesta no es correcta, se intenta leer el mensaje devuelto por la API.
   - Si no existe mensaje, se lanza un error genérico.
6. Se crean funciones específicas para:
   - carta
   - reservas
   - registro de usuario
   - login
   - contacto
7. Con esto el frontend ya queda preparado para consumir la API real de Symfony
   sin repetir llamadas request() directamente en cada página.
*/