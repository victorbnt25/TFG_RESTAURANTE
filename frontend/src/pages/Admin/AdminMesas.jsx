import { useEffect, useState } from "react";
import { listarMesas, crearMesa, actualizarMesa, eliminarMesa } from "../../servicios/adminApi";
import Modal from "../../componentes/Admin/Modal";
import "./admin.css";

export default function AdminMesas() {
  const [mesas, setMesas] = useState([]);
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const [editForm, setEditForm] = useState({ codigo: "", capacidad: "", zona: "SALA", activo: true });

  useEffect(() => { fetchMesas(); }, []);

  const fetchMesas = async () => {
    try {
      const data = await listarMesas();
      setMesas(data);
    } catch (e) { setError(e.message); }
  };

  const getNextMesaCode = () => {
    const codes = mesas
      .map(m => m.codigo)
      .filter(c => c.startsWith("M-"))
      .map(c => parseInt(c.split("-")[1]))
      .filter(n => !isNaN(n));
    
    const maxNum = codes.length > 0 ? Math.max(...codes) : 0;
    return `M-${maxNum + 1}`;
  };

  const seleccionarParaEditar = (mesa) => {
    setMesaSeleccionada(mesa);
    setEditForm({
      codigo: mesa.codigo,
      capacidad: mesa.capacidad,
      zona: mesa.zona,
      activo: mesa.activo
    });
    setMensaje("");
    setError("");
    setIsModalOpen(true);
  };

  const handleEditChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setEditForm({ ...editForm, [e.target.name]: value });
  };

  const onCrear = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje("");
    setError("");

    try {
      const body = {
        codigo: e.target.codigo.value,
        capacidad: e.target.capacidad.value,
        zona: e.target.zona.value,
      };

      await crearMesa(body);
      setMensaje("✅ Mesa añadida correctamente");
      e.target.reset();
      await fetchMesas();
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
      await actualizarMesa(mesaSeleccionada.id, editForm);
      setMensaje("✅ Mesa actualizada correctamente");
      setIsModalOpen(false);
      await fetchMesas();
    } catch (e) { 
      setError(e.message); 
    } finally { 
      setCargando(false); 
    }
  };

  const onEliminar = async () => {
    if (!window.confirm(`¿Estás seguro de eliminar la mesa "${mesaSeleccionada.codigo}"?`)) return;
    setCargando(true);
    try {
      await eliminarMesa(mesaSeleccionada.id);
      setIsModalOpen(false);
      setMesaSeleccionada(null);
      await fetchMesas();
      setMensaje("✅ Mesa eliminada");
    } catch (e) { setError(e.message); } finally { setCargando(false); }
  };

  return (
    <div className="platos-container">
      <section className="platos-main full-width">
        <h2 className="admin-title-graffiti">Gestión de Mesas</h2>

        {mensaje && <p className="mensaje-exito">{mensaje}</p>}
        {error && <p className="mensaje-error">{error}</p>}

        {/* Formulario de creación horizontal */}
        <form onSubmit={onCrear} className="platos-form-horizontal">
          <div className="form-group">
            <input 
              name="codigo" 
              placeholder="Código (ej: T-01)" 
              key={mesas.length}
              defaultValue={getNextMesaCode()}
              required 
            />
          </div>
          <div className="form-group">
            <input name="capacidad" type="number" placeholder="Capacidad" required />
          </div>
          <div className="form-group">
            <select name="zona">
              <option value="SALA">Sala</option>
              <option value="TERRAZA">Terraza</option>
              <option value="BARRA">Barra</option>
              <option value="PRIVADO">Privado</option>
            </select>
          </div>
          <button type="submit" disabled={cargando} className="btn-add">
            {cargando ? "AÑADIENDO..." : "+ AÑADIR MESA"}
          </button>
        </form>

        <div className="tabla-header">
          <h3 className="admin-subtitle">Lista de Mesas</h3>
        </div>

        <div className="contenedor-tabla">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Capacidad</th>
                <th>Zona</th>
                <th>Estado</th>
                <th>Activo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {mesas.map((m) => (
                <tr key={m.id}>
                  <td><strong>{m.codigo}</strong></td>
                  <td>{m.capacidad} pers.</td>
                  <td><span className={`badge ${m.zona.toLowerCase()}`}>{m.zona}</span></td>
                  <td>{m.estado}</td>
                  <td>{m.activo ? "✅" : "❌"}</td>
                  <td>
                    <button onClick={() => seleccionarParaEditar(m)} className="btn-edit-table">Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* MODAL DE EDICIÓN */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={`Editar Mesa: ${mesaSeleccionada?.codigo}`}
      >
        <div className="edit-modal-content">
          <div className="edit-inputs">
            <div className="input-row">
                <div className="input-col">
                    <label>Código de Mesa</label>
                    <input name="codigo" value={editForm.codigo} onChange={handleEditChange} placeholder="Código" />
                </div>
                <div className="input-col">
                    <label>Capacidad</label>
                    <input name="capacidad" value={editForm.capacidad} onChange={handleEditChange} type="number" />
                </div>
            </div>

            <label>Zona</label>
            <select name="zona" value={editForm.zona} onChange={handleEditChange}>
              <option value="SALA">Sala</option>
              <option value="TERRAZA">Terraza</option>
              <option value="BARRA">Barra</option>
              <option value="PRIVADO">Privado</option>
            </select>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                <input 
                    type="checkbox" 
                    name="activo" 
                    checked={editForm.activo} 
                    onChange={handleEditChange} 
                    style={{ width: 'auto' }}
                />
                <label style={{ margin: 0 }}>Mesa Activa (Disponible para reservas)</label>
            </div>

            <div className="modal-actions">
                <button onClick={onGuardarTodo} className="btn-gold" disabled={cargando}>
                    {cargando ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
                </button>
                <button onClick={onEliminar} className="btn-delete-link" disabled={cargando}>
                    Eliminar Mesa
                </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
