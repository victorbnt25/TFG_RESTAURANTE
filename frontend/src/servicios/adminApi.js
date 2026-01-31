import { request, API_URL } from "./api";

// Dashboard (ejemplo)
export function obtenerKpisReservas() {
  return request("/api/admin/dashboard/reservas");
}

// Platos
export function listarPlatos() {
  return request("/api/admin/platos");
}

export async function subirFotoPlato(platoId, archivo) {
  const formData = new FormData();
  formData.append("foto", archivo);

  const res = await fetch(`${API_URL}/api/admin/platos/${platoId}/foto`, {
    method: "POST",
    body: formData,
  });

  let data = null;
  try { data = await res.json(); } catch {}

  if (!res.ok) throw new Error(data?.error || "Error subiendo imagen");
  return data; // { mensaje, foto_url }
}