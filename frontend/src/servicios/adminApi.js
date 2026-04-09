import { request } from "./api";

// Dashboard
export function obtenerKpisReservas() {
  return request("/api/admin/dashboard/reservas");
}

// Platos

/**
 * Obtiene la lista completa de platos desde la base de datos
 */
export function listarPlatos() {
  return request("/api/platos");
}

/**
 * Crea un nuevo plato en la base de datos
 */
export function crearPlato(datos) {
  return request("/api/platos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
}

/**
 * Actualiza la información de un plato existente (Nombre, Precio, etc...)
 * Se utiliza el método PUT según la lógica de tu controlador en Symfony
 */
export function actualizarPlato(id, datos) {
  return request(`/api/platos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
}

/**
 * Elimina un plato de la base de datos y su imagen asociada.
 */
export function eliminarPlato(id) {
  return request(`/api/platos/${id}`, {
    method: "DELETE",
  });
}

/**
 * Sube o actualiza la fotografía de un plato específico.
 */
export async function subirFotoPlato(platoId, archivo) {
  const formData = new FormData();
  formData.append("foto", archivo);

  return request(`/api/platos/${platoId}/foto`, {
    method: "POST",
    body: formData,
    // Nota: No se pone Content-Type al enviar FormData; el navegador 
    // establece automáticamente el boundary necesario.
  });
}

// Mesas

/**
 * Obtiene la lista completa de mesas
 */
export function listarMesas() {
  return request("/api/mesas");
}

/**
 * Crea una nueva mesa
 */
export function crearMesa(datos) {
  return request("/api/mesas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
}

/**
 * Actualiza una mesa existente
 */
export function actualizarMesa(id, datos) {
  return request(`/api/mesas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
}

/**
 * Elimina una mesa
 */
export function eliminarMesa(id) {
  return request(`/api/mesas/${id}`, {
    method: "DELETE",
  });
  
}

// Reservas 

export function listarReservas() {
  return request("/api/reservas");
}

export function crearReservaAdmin(datos) {
  return request("/api/reservas", {
    method: "POST",
    body: JSON.stringify(datos),
  });
}

export function actualizarReservaAdmin(id, datos) {
  return request(`/api/reservas/${id}`, {
    method: "PUT",
    body: JSON.stringify(datos),
  });
}

export function cancelarReservaAdmin(id) {
  return request(`/api/reservas/${id}/cancelar`, {
    method: "PUT",
  });
}

export function eliminarReservaAdmin(id) {
  return request(`/api/reservas/${id}`, {
    method: "DELETE",
  });
}

export async function listarPedidos() {
  return await request("/api/pedidos");
}

export async function cambiarEstadoPedido(id, estado) {
  return await request(`/api/pedidos/${id}/estado`, {
    method: "PUT",
    body: JSON.stringify({ estado }),
  });
}

// Configuración

export function obtenerPoliticaPrivacidad() {
  return request("/api/public/politica");
}

export function guardarPoliticaPrivacidad(politica) {
  return request("/api/admin/politica", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ politica }),
  });
}
