export const API_URL = "http://localhost:8000";

export async function request(ruta, opciones = {}) {
  const url = `${API_URL}${ruta}`;
  const headers = { "Content-Type": "application/json", ...opciones.headers };

  if (opciones.body instanceof FormData) {
    delete headers["Content-Type"];
  }

  const respuesta = await fetch(url, { ...opciones, headers });

  const texto = await respuesta.text();
  let datos;

  try {
    datos = JSON.parse(texto);
  } catch {
    datos = texto;
  }

  if (!respuesta.ok) {
    console.error("ERROR BACKEND:", datos);
    throw new Error(typeof datos === "string" ? datos : datos?.error || "Error");
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

export async function obtenerMisPedidos(email) {
  return await request(`/api/pedidos/mis-pedidos?email=${encodeURIComponent(email)}`);
}

export async function obtenerKpisPedidos() {
  return await request("/api/admin/dashboard/pedidos");
}

export async function obtenerMesasDisponiblesPedido() {
  return await request("/api/mesas");
}