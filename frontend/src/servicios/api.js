export const API_URL = "http://localhost:8000";

export async function request(ruta, opciones = {}) {
  // Aseguramos que la ruta empiece por /index.php/api si no lo trae
  const url = `${API_URL}${ruta.startsWith('/index.php') ? ruta : '/index.php' + ruta}`;
  
  const res = await fetch(url, opciones);

  let data = null;
  try { 
    data = await res.json(); 
  } catch (e) { 
    /* Respuesta vacía o no JSON */ 
  }

  if (!res.ok) {
    const msg = data?.error || data?.message || "Error en la petición";
    throw new Error(msg);
  }

  return data;
}