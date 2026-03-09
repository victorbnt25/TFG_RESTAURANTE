import { useEffect, useState } from "react";
import { listarPlatos, subirFotoPlato, crearPlato, eliminarPlato, actualizarPlato } from "../../servicios/adminApi";
import { API_URL } from "../../servicios/api";
import Modal from "../../componentes/Admin/Modal";
import "./admin.css";

export default function AdminPlatos() {
  const [platos, setPlatos] = useState([]);
  const [platoSeleccionado, setPlatoSeleccionado] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    setIsModalOpen(true);
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
      const body = {
        nombre: e.target.nombre.value,
        precio: e.target.precio.value,
        descripcion: e.target.descripcion ? e.target.descripcion.value : "",
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

  const onGuardarTodo = async () => {
    setCargando(true);
    setMensaje("");
    setError("");
    try {
      await actualizarPlato(platoSeleccionado.id, editForm);
      if (archivo) {
        await subirFotoPlato(platoSeleccionado.id, archivo);
      }
      setMensaje("✅ Producto actualizado correctamente");
      setIsModalOpen(false);
      await fetchPlatos();
    } catch (e) { 
      setError(e.message); 
    } finally { 
      setCargando(false); 
    }
  };

  const onEliminar = async () => {
    if (!window.confirm(`¿Estás seguro de eliminar "${platoSeleccionado.nombre}"?`)) return;
    setCargando(true);
    try {
      await eliminarPlato(platoSeleccionado.id);
      setIsModalOpen(false);
      setPlatoSeleccionado(null);
      await fetchPlatos();
      setMensaje("✅ Producto eliminado");
    } catch (e) { setError(e.message); } finally { setCargando(false); }
  };

  return (
    <div className="platos-container">
      <section className="platos-main full-width">
        <h2 className="admin-title-graffiti">Gestión de Carta</h2>

        {mensaje && <p className="mensaje-exito">{mensaje}</p>}
        {error && <p className="mensaje-error">{error}</p>}

        <form onSubmit={onCrear} className="platos-form-horizontal">
          <div className="form-group">
            <input name="nombre" placeholder="Nombre del producto" required />
          </div>
          <div className="form-group">
            <input name="precio" type="number" step="0.01" placeholder="Precio" required />
          </div>
          <div className="form-group">
            <select name="tipo">
              <option value="PRINCIPAL">Hamburguesa</option>
              <option value="ENTRANTE">Entrante</option>
              <option value="POSTRE">Postre</option>
              <option value="BEBIDA">Bebida</option>
            </select>
          </div>
          <button type="submit" disabled={cargando} className="btn-add">
            {cargando ? "AÑADIENDO..." : "+ AÑADIR"}
          </button>
        </form>

        <div className="tabla-header">
          <h3 className="admin-subtitle">Lista de Productos</h3>
          <div className="filtros-container">
             <span>Filtrar por:</span>
             <select value={filtro} onChange={(e) => setFiltro(e.target.value)} className="select-filtro">
              <option value="TODOS">Todos</option>
              <option value="PRINCIPAL">Hamburguesas</option>
              <option value="ENTRANTE">Entrantes</option>
              <option value="POSTRE">Postres</option>
              <option value="BEBIDA">Bebidas</option>
            </select>
          </div>
        </div>

        <div className="contenedor-tabla">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Vista</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {platos.filter(p => filtro === "TODOS" || p.tipo === filtro).map((p) => (
                <tr key={p.id}>
                  <td>{p.foto_url ? <img className="img-mini" src={`${API_URL}${p.foto_url}`} width="50" height="50" alt="" /> : <div className="no-img-mini">?</div>}</td>
                  <td><strong>{p.nombre}</strong></td>
                  <td><span className={`badge ${p.tipo.toLowerCase()}`}>{p.tipo}</span></td>
                  <td>{p.precio}€</td>
                  <td>
                    <button onClick={() => seleccionarParaEditar(p)} className="btn-edit-table">Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={`Editar: ${platoSeleccionado?.nombre}`}
      >
        <div className="edit-modal-content">
          <div className="img-preview-container big">
            {platoSeleccionado?.foto_url ? (
              <img src={`${API_URL}${platoSeleccionado.foto_url}`} alt="" />
            ) : <div className="no-photo">Sin imagen corporativa</div>}
            
            <div className="upload-section">
                <label htmlFor="file-upload" className="custom-file-upload">
                  {archivo ? "✅ IMAGEN SELECCIONADA" : "CAMBIAR IMAGEN"}
                </label>
                <input id="file-upload" type="file" className="input-file-hidden" onChange={(e) => setArchivo(e.target.files[0])} />
            </div>
          </div>

          <div className="edit-inputs">
            <div className="input-row">
                <div className="input-col">
                    <label>Nombre del Plato</label>
                    <input name="nombre" value={editForm.nombre} onChange={handleEditChange} placeholder="Nombre" />
                </div>
                <div className="input-col">
                    <label>Precio (€)</label>
                    <input name="precio" value={editForm.precio} onChange={handleEditChange} type="number" step="0.01" />
                </div>
            </div>

            <label>Categoría</label>
            <select name="tipo" value={editForm.tipo} onChange={handleEditChange}>
              <option value="PRINCIPAL">Hamburguesa</option>
              <option value="ENTRANTE">Entrante</option>
              <option value="POSTRE">Postre</option>
              <option value="BEBIDA">Bebida</option>
            </select>

            <label>Descripción</label>
            <textarea name="descripcion" value={editForm.descripcion} onChange={handleEditChange} placeholder="Descripción detallada del plato..." rows="4" />

            <div className="modal-actions">
                <button onClick={onGuardarTodo} className="btn-gold" disabled={cargando}>
                    {cargando ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
                </button>
                <button onClick={onEliminar} className="btn-delete-link" disabled={cargando}>
                    Eliminar Producto
                </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}