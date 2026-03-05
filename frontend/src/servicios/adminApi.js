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