import { request } from "./api";

// =======================
// DASHBOARD
// =======================

export function obtenerKpisReservas(periodo = 'todo') {
  return request(`/api/admin/dashboard/reservas?periodo=${periodo}`);
}

export function obtenerKpisPedidos(periodo = 'todo') {
  return request(`/api/admin/dashboard/pedidos?periodo=${periodo}`);
}

// =======================
// PLATOS
// =======================

export function listarPlatos() {
  return request("/api/platos");
}

export function crearPlato(datos) {
  return request("/api/platos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
}

export function actualizarPlato(id, datos) {
  return request(`/api/platos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
}

export function eliminarPlato(id) {
  return request(`/api/platos/${id}`, {
    method: "DELETE",
  });
}

export async function subirFotoPlato(platoId, archivo) {
  const formData = new FormData();
  formData.append("foto", archivo);

  return request(`/api/platos/${platoId}/foto`, {
    method: "POST",
    body: formData,
  });
}

// =======================
// MESAS
// =======================

export function listarMesas() {
  return request("/api/mesas");
}

export function crearMesa(datos) {
  return request("/api/mesas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
}

export function actualizarMesa(id, datos) {
  return request(`/api/mesas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
}

export function eliminarMesa(id) {
  return request(`/api/mesas/${id}`, {
    method: "DELETE",
  });
}

// =======================
// RESERVAS
// =======================

export function listarReservas() {
  return request("/api/reservas");
}

export function crearReservaAdmin(datos) {
  return request("/api/reservas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
}

export function actualizarReservaAdmin(id, datos) {
  return request(`/api/reservas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
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

// =======================
// PEDIDOS
// =======================

export async function listarPedidos() {
  return await request("/api/pedidos");
}

export async function cambiarEstadoPedido(id, estado) {
  return await request(`/api/pedidos/${id}/estado`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estado }),
  });
}

export async function eliminarPedido(id) {
  return await request(`/api/pedidos/${id}`, {
    method: "DELETE",
  });
}

// =======================
// CONFIGURACIÓN
// =======================

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