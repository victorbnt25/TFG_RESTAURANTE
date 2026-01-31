export const API_URL = "http://localhost:8000";

export async function request(ruta, opciones = {}) {
  const res = await fetch(API_URL + ruta, opciones);

  let data = null;
  try { data = await res.json(); } catch { /* vacío */ }

  if (!res.ok) {
    const msg = data?.error || data?.message || "Error en la petición";
    throw new Error(msg);
  }

  return data;
}