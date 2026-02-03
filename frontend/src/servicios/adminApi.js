import { request, API_URL } from "./api";

// Dashboard
export function obtenerKpisReservas() {
  return request("/index.php/api/admin/dashboard/reservas");
}

// Platos
export function listarPlatos() {
  return request("/index.php/api/platos");
}

export async function subirFotoPlato(platoId, archivo) {
  const formData = new FormData();
  formData.append("foto", archivo);

  const res = await fetch(
    `${API_URL}/index.php/api/platos/${platoId}/foto`,
    {
      method: "POST",
      body: formData,
    }
  );

  let data = null;
  try { data = await res.json(); } catch {}

  if (!res.ok) throw new Error(data?.error || "Error subiendo imagen");
  return data;
}
