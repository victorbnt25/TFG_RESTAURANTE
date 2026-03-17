export const API_URL = "http://localhost:8000";

export async function request(ruta, opciones = {}) {
  // Le pegamos el /index.php a la ruta porque si no Symfony se ralla en local
  const url = `${API_URL}${ruta.startsWith("/index.php") ? ruta : "/index.php" + ruta}`;

  const opcionesFinales = { ...opciones };

  // Si no nos pasan cabeceras, creamos el objeto vacío para no petar
  if (!opcionesFinales.headers) {
    opcionesFinales.headers = {};
  }

  // Si no es un formulario con archivos, le decimos al server que le mandamos JSON
  if (!(opcionesFinales.body instanceof FormData)) {
    opcionesFinales.headers["Content-Type"] = "application/json";
  }

  const respuesta = await fetch(url, opcionesFinales);

  let datos = null;

  // Intentamos convertir la respuesta a un objeto de JS
  try {
    datos = await respuesta.json();
  } catch (error) {
    datos = null;
  }

  if (!respuesta.ok) {
    // Miramos si la API nos ha dado algún mensaje de error que podamos enseñar
    const mensaje =
      datos?.error ||
      datos?.mensaje ||
      datos?.message ||
      "Error en la petición";

    // Si la respuesta no es un 200, lanzamos el error que nos mande el servidor
    throw new Error(mensaje);
  }

  return datos;
}

// Función para pillar todas las categorías para los filtros de la carta
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

// Esta es la función que manda la reserva nueva al servidor
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
