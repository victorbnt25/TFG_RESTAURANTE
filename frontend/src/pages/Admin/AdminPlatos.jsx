import { useEffect, useState } from "react";
import { listarPlatos, subirFotoPlato, crearPlato, eliminarPlato, actualizarPlato } from "../../servicios/adminApi";
import { API_URL } from "../../servicios/api";
import "./admin.css";

export default function AdminPlatos() {
  const [platos, setPlatos] = useState([]);
  const [platoSeleccionado, setPlatoSeleccionado] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [filtro, setFiltro] = useState("TODOS");

  const [editForm, setEditForm] = useState({ nombre: "", precio: "", descripcion: "", tipo: "" });

  useEffect(() => { fetchPlatos(); }, []);

  const fetchPlatos = async () => {
    try {
      const data = await listarPlatos();
      setPlatos(data);
    } catch (e) { setError(e.message); }
  };

  const seleccionarParaEditar = (plato) => {
    setPlatoSeleccionado(plato);
    setEditForm({
      nombre: plato.nombre,
      precio: plato.precio,
      descripcion: plato.descripcion || "",
      tipo: plato.tipo
    });
    setArchivo(null);
    setMensaje("");
    setError("");
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const onCrear = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje("");
    setError("");

    try {
      // CORRECCIÓN: Usamos una comprobación de seguridad para la descripción
      const body = {
        nombre: e.target.nombre.value,
        precio: e.target.precio.value,
        descripcion: e.target.descripcion ? e.target.descripcion.value : "", // Evita el error si no existe
        tipo: e.target.tipo.value,
      };
      
      await crearPlato(body);
      setMensaje("✅ Plato añadido correctamente");
      e.target.reset();
      await fetchPlatos();
    } catch (e) { 
      setError(e.message); 
    } finally { 
      setCargando(false); 
    }
  };

  const onActualizar = async () => {
    setCargando(true);
    try {
      await actualizarPlato(platoSeleccionado.id, editForm);
      setMensaje("✅ Cambios guardados");
      await fetchPlatos();
    } catch (e) { setError(e.message); } finally { setCargando(false); }
  };

  const onSubirFoto = async () => {
    if (!archivo) return;
    setCargando(true);
    try {
      await subirFotoPlato(platoSeleccionado.id, archivo);
      setMensaje("✅ Foto actualizada");
      await fetchPlatos();
    } catch (e) { setError(e.message); } finally { setCargando(false); }
  };

  const onEliminar = async () => {
    if (!window.confirm(`¿Eliminar ${platoSeleccionado.nombre}?`)) return;
    setCargando(true);
    try {
      await eliminarPlato(platoSeleccionado.id);
      setPlatoSeleccionado(null);
      await fetchPlatos();
    } catch (e) { setError(e.message); } finally { setCargando(false); }
  };

  return (
    <div className="platos-container">
      <section className="platos-main">
        <h2 className="admin-title-graffiti">Gestión de Carta</h2>
        
        {mensaje && <p className="mensaje-exito">{mensaje}</p>}
        {error && <p className="mensaje-error">{error}</p>}

        {/* Formulario de creación sin descripción según tu captura */}
        <form onSubmit={onCrear} className="platos-form">
          <h3 className="admin-subtitle">Nuevo Producto</h3>
          <div style={{display: 'flex', gap: '10px'}}>
            <input name="nombre" placeholder="Nombre" required />
            <input name="precio" type="number" step="0.01" placeholder="Precio" required />
          </div>
          <select name="tipo">
            <option value="PRINCIPAL">Hamburguesa</option>
            <option value="ENTRANTE">Entrante</option>
            <option value="POSTRE">Postre</option>
            <option value="BEBIDA">Bebida</option>
          </select>
          <button type="submit" disabled={cargando}>
            {cargando ? "CARGANDO..." : "CREAR PRODUCTO"}
          </button>
        </form>

        <div className="tabla-header">
           <h3 className="admin-subtitle">Lista de Productos</h3>
           <select value={filtro} onChange={(e) => setFiltro(e.target.value)} className="select-filtro">
              <option value="TODOS">Todos</option>
              <option value="PRINCIPAL">Hamburguesas</option>
              <option value="ENTRANTE">Entrantes</option>
              <option value="POSTRE">Postres</option>
              <option value="BEBIDA">Bebidas</option>
           </select>
        </div>

        <div className="contenedor-tabla">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Vista</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              {platos.filter(p => filtro === "TODOS" || p.tipo === filtro).map((p) => (
                <tr key={p.id} onClick={() => seleccionarParaEditar(p)} className={platoSeleccionado?.id === p.id ? "row-selected" : ""}>
                  <td>{p.foto_url ? <img className="img-mini" src={`${API_URL}${p.foto_url}`} width="40" alt="" /> : "—"}</td>
                  <td>{p.nombre}</td>
                  <td><span className={`badge ${p.tipo.toLowerCase()}`}>{p.tipo}</span></td>
                  <td>{p.precio}€</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <aside className="platos-aside">
        {platoSeleccionado ? (
          <div>
            <h3 className="admin-subtitle" style={{ color: 'var(--color-primary)' }}>{platoSeleccionado.nombre}</h3>
            <div className="img-preview-container">
              {platoSeleccionado.foto_url ? (
                <img src={`${API_URL}${platoSeleccionado.foto_url}?t=${Date.now()}`} alt="" />
              ) : <div className="no-photo">Sin imagen</div>}
            </div>
            <div className="edit-inputs">
              <input name="nombre" value={editForm.nombre} onChange={handleEditChange} placeholder="Nombre" />
              <input name="precio" value={editForm.precio} onChange={handleEditChange} type="number" step="0.01" />
              <textarea name="descripcion" value={editForm.descripcion} onChange={handleEditChange} placeholder="Descripción" />
              <select name="tipo" value={editForm.tipo} onChange={handleEditChange}>
                <option value="PRINCIPAL">Hamburguesa</option>
                <option value="ENTRANTE">Entrante</option>
                <option value="POSTRE">Postre</option>
                <option value="BEBIDA">Bebida</option>
              </select>
              <button onClick={onActualizar} className="btn-gold">GUARDAR CAMBIOS</button>
              <div style={{marginTop: '15px'}}>
                <label htmlFor="file-upload" className="custom-file-upload">
                  {archivo ? "ARCHIVO SELECCIONADO" : "CAMBIAR FOTO"}
                </label>
                <input id="file-upload" type="file" className="input-file-hidden" onChange={(e) => setArchivo(e.target.files[0])} />
                <button onClick={onSubirFoto} disabled={!archivo} className="btn-gold" style={{marginTop: '5px', width: '100%'}}>ACTUALIZAR FOTO</button>
              </div>
              <button onClick={onEliminar} className="btn-delete">ELIMINAR PRODUCTO</button>
            </div>
          </div>
        ) : (
          <p className="placeholder-text">Haz clic en un producto para editarlo.</p>
        )}
      </aside>
    </div>
  );
}