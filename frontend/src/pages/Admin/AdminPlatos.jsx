import { useEffect, useState } from "react";
import { listarPlatos, subirFotoPlato } from "../../servicios/adminApi";
import { API_URL } from "../../servicios/api";

export default function AdminPlatos() {
  const [platos, setPlatos] = useState([]);
  const [platoSeleccionado, setPlatoSeleccionado] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargarPlatos();
  }, []);

  const cargarPlatos = async () => {
    try {
      const data = await listarPlatos();
      setPlatos(data);
    } catch (e) {
      setError(e.message);
    }
  };

  const crearPlato = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");
    setCargando(true);

    try {
      const res = await fetch(`${API_URL}/index.php/api/platos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: e.target.nombre.value,
          precio: e.target.precio.value,
          descripcion: e.target.descripcion.value, // NUEVO
          tipo: e.target.tipo.value, // NUEVO
        }),
      });

      if (!res.ok) throw new Error("Error al crear plato");

      setMensaje("✅ Plato creado correctamente");
      e.target.reset();
      cargarPlatos();
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  };

  const subirFoto = async () => {
    if (!platoSeleccionado || !archivo) {
      setError("Selecciona plato y archivo");
      return;
    }

    setMensaje("");
    setError("");
    setCargando(true);

    try {
      await subirFotoPlato(platoSeleccionado.id, archivo);
      setMensaje("✅ Foto subida correctamente");
      setArchivo(null);
      await cargarPlatos();
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ display: "flex", gap: 40, padding: 20 }}>
      {/* IZQUIERDA: LISTADO Y CREACIÓN */}
      <div>
        <h2>Gestión de Platos</h2>

        {mensaje && <p style={{ color: "green", fontWeight: "bold" }}>{mensaje}</p>}
        {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

        <form onSubmit={crearPlato} style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          <input name="nombre" placeholder="Nombre del plato" required disabled={cargando} />
          <input name="precio" type="number" step="0.01" placeholder="Precio (ej: 12.50)" required disabled={cargando} />
          <textarea name="descripcion" placeholder="Descripción breve..." disabled={cargando} />
          
          <select name="tipo" disabled={cargando}>
            <option value="PRINCIPAL">Principal</option>
            <option value="ENTRANTE">Entrante</option>
            <option value="POSTRE">Postre</option>
            <option value="BEBIDA">Bebida</option>
          </select>

          <button type="submit" disabled={cargando}>
            {cargando ? "Procesando..." : "Crear plato"}
          </button>
        </form>

        <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#b8860b" }}>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Tipo</th>
              <th>¿Foto?</th>
            </tr>
          </thead>
          <tbody>
            {platos.map((p) => (
              <tr
                key={p.id}
                onClick={() => setPlatoSeleccionado(p)}
                style={{
                  cursor: "pointer",
                  background: platoSeleccionado?.id === p.id ? "#b8860b" : "transparent",
                }}
              >
                <td>{p.id}</td>
                <td>{p.nombre}</td>
                <td>{p.precio} €</td>
                <td><small>{p.tipo}</small></td>
                <td>{p.foto_url ? "✅" : "❌"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DERECHA: EDICIÓN DE IMAGEN */}
      <div style={{ minWidth: 200 }}>
        <h3>Imagen del Plato</h3>
        {platoSeleccionado ? (
          <>
            <p>Editando: <strong>{platoSeleccionado.nombre}</strong></p>
            {platoSeleccionado.foto_url && (
              <div style={{ marginBottom: 10 }}>
                <img
                  src={`${API_URL}${platoSeleccionado.foto_url}?t=${Date.now()}`}
                  width="100%"
                  style={{ borderRadius: 8 }}
                  alt="Vista previa"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setArchivo(e.target.files[0])}
              disabled={cargando}
            />
            <button 
                onClick={subirFoto} 
                disabled={cargando || !archivo}
                style={{ marginTop: 10, width: "100%" }}
            >
              {cargando ? "Subiendo..." : "Actualizar Foto"}
            </button>
          </>
        ) : (
          <p style={{ fontStyle: "italic" }}>Selecciona un plato de la lista para gestionar su foto.</p>
        )}
      </div>
    </div>
  );
}