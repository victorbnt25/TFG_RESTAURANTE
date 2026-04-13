export const API_URL = "http://localhost:8000";

export async function request(ruta, opciones = {}) {
  const url = `${API_URL}${ruta}`;                                    // Crea la dirección completa añadiendo el servidor
  const headers = { "Content-Type": "application/json", ...opciones.headers }; // Prepara las etiquetas por defecto
  
  if (opciones.body instanceof FormData) delete headers["Content-Type"]; // Si enviamos fotos/archivos, quita la etiqueta JSON

  
  const respuesta = await fetch(url, { ...opciones, headers });       // Envía el paquete al servidor y espera respuesta
  const datos = await respuesta.json().catch(() => null);             // Lee el contenido del paquete (JSON) o da nulo si falla

  if (!respuesta.ok) {                                                // Si el servidor devuelve un error (404, 500, etc)
    const errorMsg = datos?.error || datos?.mensaje || "Error";       // Busca el mensaje de error en los datos
    throw new Error(errorMsg);                                        // Detiene todo y avisa del problema
  }

  return datos;                                                       // Todo OK: Devuelve los datos listos para usar
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

export async function obtenerMisReservas(email) {
  return await request(`/api/reservas/usuario/${encodeURIComponent(email)}`);
}

export async function cancelarReserva(id) {
  return await request(`/api/reservas/${id}/cancelar`, {
    method: "PUT",
  });
}

export async function actualizarReserva(id, datosActualizados) {
  return await request(`/api/reservas/${id}`, {
    method: "PUT",
    body: JSON.stringify(datosActualizados),
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
export async function crearPedido(datosPedido) {
  return await request("/api/pedidos", {
    method: "POST",
    body: JSON.stringify(datosPedido),
  });
}
export async function obtenerMesas() {
  return await request("/api/mesas");
}

export async function obtenerPolitica() {
  return await request("/api/public/politica");
}
