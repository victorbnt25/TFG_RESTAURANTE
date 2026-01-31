import { useState } from "react";
import { subirFotoPlato } from "../../servicios/adminApi";

export default function AdminSubirFoto() {
  const [platoId, setPlatoId] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const subir = async () => {
    setMensaje("");
    if (!platoId) return setMensaje("Escribe el ID del plato.");
    if (!archivo) return setMensaje("Selecciona una imagen.");

    try {
      const data = await subirFotoPlato(platoId, archivo);
      setMensaje(`OK: ${data.foto_url}`);
    } catch (e) {
      setMensaje(e.message);
    }
  };

  return (
    <div>
      <h2>Subir foto</h2>

      <div style={{ marginBottom: 8 }}>
        <label>ID del plato</label><br />
        <input value={platoId} onChange={(e) => setPlatoId(e.target.value)} />
      </div>

      <div style={{ marginBottom: 8 }}>
        <input type="file" accept="image/*" onChange={(e) => setArchivo(e.target.files?.[0] || null)} />
      </div>

      <button onClick={subir}>Subir</button>

      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}
