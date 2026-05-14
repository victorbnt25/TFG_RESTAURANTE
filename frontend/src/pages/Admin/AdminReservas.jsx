import { useEffect, useState } from "react";
import { listarReservas, actualizarReservaAdmin, cancelarReservaAdmin, eliminarReservaAdmin, confirmarReservaAdmin } from "../../servicios/adminApi";
import { CheckCircle, Calendar, Edit, Trash2, XCircle, CheckSquare } from "lucide-react";
import "./admin.css";

export default function AdminReservas() {
  const [reservas, setReservas] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  
  // Estado para edición
  const [reservaEditando, setReservaEditando] = useState(null);
  const [formData, setFormData] = useState({ 
    fecha: "", 
    hora: "", 
    numero_personas: "",
    telefono: "",
    observaciones: ""
  });

  const [filtroTemporal, setFiltroTemporal] = useState("TODAS");

  useEffect(() => { 
    fetchReservas(); 
  }, []);

  const fetchReservas = async () => {
    try {
      setCargando(true);
      const data = await listarReservas();
      setReservas(data);
    } catch (e) { 
      setError(e.message || "No se pudieron cargar las reservas."); 
    } finally {
      setCargando(false);
    }
  };

  const isReservaPasada = (fechaHoraStr) => {
    const fechaReserva = new Date(fechaHoraStr);
    const ahora = new Date();
    return fechaReserva < ahora;
  };

  const reservasFiltradas = reservas.filter(r => {
    if (filtroTemporal === "TODAS") return true;
    
    const fechaReserva = new Date(r.fechaHoraReserva);
    const ahora = new Date();
    
    if (filtroTemporal === "HOY") {
      return fechaReserva.toDateString() === ahora.toDateString();
    }
    
    if (filtroTemporal === "SEMANA") {
      const hoy = new Date();
      const haceUnaSemana = new Date(hoy.setDate(hoy.getDate() - 7));
      const dentroDeUnaSemana = new Date(hoy.setDate(hoy.getDate() + 14));
      return fechaReserva >= haceUnaSemana && fechaReserva <= dentroDeUnaSemana;
    }

    if (filtroTemporal === "MES") {
      return fechaReserva.getMonth() === ahora.getMonth() && fechaReserva.getFullYear() === ahora.getFullYear();
    }

    if (filtroTemporal === "AÑO") {
      return fechaReserva.getFullYear() === ahora.getFullYear();
    }

    return true;
  }).sort((a, b) => new Date(b.fechaHoraReserva) - new Date(a.fechaHoraReserva));

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const prepararEdicion = (reserva) => {
    const dt = new Date(reserva.fechaHoraReserva);
    const fecha = dt.toISOString().split('T')[0];
    const hora = dt.toTimeString().split(' ')[0].substring(0, 5);

    setReservaEditando(reserva);
    setFormData({
      fecha: fecha,
      hora: hora,
      numero_personas: reserva.numeroPersonas,
      telefono: reserva.telefono || "",
      observaciones: reserva.observaciones || ""
    });
    setMensaje("");
    setError("");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicion = () => {
    setReservaEditando(null);
    setFormData({ fecha: "", hora: "", numero_personas: "", telefono: "", observaciones: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje("");
    setError("");

    try {
      if (reservaEditando) {
        await actualizarReservaAdmin(reservaEditando.id, formData);
        setMensaje(`Reserva #${reservaEditando.id} actualizada correctamente`);
        setReservaEditando(null);
        await fetchReservas();
      }
    } catch (e) {
      setError(e.message || "Error al actualizar la reserva.");
    } finally {
      setCargando(false);
    }
  };

  const handleConfirmarReserva = async (id) => {
    setCargando(true);
    try {
      await confirmarReservaAdmin(id);
      setMensaje(`Reserva #${id} aceptada correctamente`);
      await fetchReservas();
    } catch (e) {
      setError(e.message || "Error al aceptar la reserva.");
    } finally {
      setCargando(false);
    }
  };

  const handleCancelarReserva = async (id) => {
    if (!window.confirm(`¿Estás seguro de cancelar la reserva #${id}?`)) return;
    setCargando(true);
    try {
      await cancelarReservaAdmin(id);
      setMensaje(`Reserva #${id} cancelada correctamente`);
      await fetchReservas();
    } catch (e) {
      setError(e.message || "Error al cancelar la reserva.");
    } finally {
      setCargando(false);
    }
  };

  const handleEliminarReserva = async (id) => {
    if (!window.confirm(`¿Estás seguro de eliminar permanentemente la reserva #${id}?`)) return;
    setCargando(true);
    try {
      await eliminarReservaAdmin(id);
      setMensaje(`Reserva #${id} eliminada correctamente`);
      if (reservaEditando?.id === id) cancelarEdicion();
      await fetchReservas();
    } catch (e) {
      setError(e.message || "Error al eliminar la reserva.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="admin-pedidos-wrapper">
      <div className="admin-pedidos-header">
        <div>
          <h2 className="admin-title-graffiti">Gestión de Reservas</h2>
          <p className="admin-subtitle-text">
            Visualiza, edita o cancela las reservas de los clientes.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
            <select 
                className="select-filtro" 
                value={filtroTemporal} 
                onChange={(e) => setFiltroTemporal(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '6px', background: '#333', color: 'white', border: '1px solid #555' }}
            >
                <option value="TODAS">Todas las fechas</option>
                <option value="HOY">Hoy</option>
                <option value="SEMANA">Esta semana</option>
                <option value="MES">Este mes</option>
                <option value="AÑO">Este año</option>
            </select>
            <button className="btn-add" onClick={fetchReservas} disabled={cargando}>
                {cargando ? "..." : "Actualizar"}
            </button>
        </div>
      </div>

      {mensaje && (
        <p className="mensaje-exito" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={16} /> {mensaje}
        </p>
      )}
      {error && <p className="mensaje-error">{error}</p>}

      {reservaEditando && (
        <section className="admin-form-section" style={{ marginBottom: '30px', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
          <h3 className="admin-subtitle" style={{ color: 'var(--color-primary)' }}>Editando Reserva #{reservaEditando.id}</h3>
          <form onSubmit={handleSubmit} className="platos-form-horizontal">
            <div className="form-group">
              <label className="admin-label-small">Fecha</label>
              <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="admin-label-small">Hora</label>
              <input type="time" name="hora" value={formData.hora} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="admin-label-small">Personas</label>
              <input type="number" name="numero_personas" value={formData.numero_personas} onChange={handleChange} required min="1" />
            </div>
            <div className="form-group">
              <label className="admin-label-small">Teléfono</label>
              <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} />
            </div>
            <div className="form-group" style={{ flex: '1 1 100%' }}>
              <label className="admin-label-small">Observaciones</label>
              <textarea name="observaciones" value={formData.observaciones} onChange={handleChange} style={{ width: '100%', minHeight: '60px', background: '#222', border: '1px solid #444', color: 'white', padding: '8px', borderRadius: '4px' }} />
            </div>
            
            <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '10px' }}>
              <button type="submit" disabled={cargando} className="btn-add" style={{ flex: 1 }}>
                {cargando ? "Guardando..." : "Guardar Cambios"}
              </button>
              <button type="button" onClick={cancelarEdicion} className="btn-delete-link" style={{ padding: '0 20px' }}>
                Cancelar
              </button>
            </div>
          </form>
        </section>
      )}

      <div className="contenedor-tabla">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Fecha y Hora</th>
              <th>Personas</th>
              <th>Zona / Mesa</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservasFiltradas.map((r) => {
              const pasada = isReservaPasada(r.fechaHoraReserva);
              return (
                <tr 
                  key={r.id} 
                  style={{ 
                    borderLeft: r.id === reservaEditando?.id ? '4px solid var(--color-primary)' : '',
                    opacity: pasada ? 0.6 : 1,
                    background: pasada ? 'rgba(255,255,255,0.02)' : 'transparent',
                    color: pasada ? '#888' : 'inherit'
                  }}
                >
                  <td><strong>#{r.id}</strong></td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span>{r.nombre}</span>
                      <small style={{ color: '#888', fontSize: '0.7rem' }}>{r.email}</small>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} color={pasada ? "#666" : "var(--color-primary)"} />
                      {r.fechaHoraReserva}
                    </div>
                  </td>
                  <td>{r.numeroPersonas}</td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className={`badge ${r.zona.toLowerCase()}`} style={pasada ? { filter: 'grayscale(1) brightness(0.7)' } : {}}>{r.zona}</span>
                      <small style={{ color: '#aaa', marginTop: '2px' }}>Mesa: {r.mesa || '---'}</small>
                    </div>
                  </td>
                  <td>
                    <span 
                      className={`badge-estado ${pasada ? '' : (r.estado === 'CONFIRMADA' ? 'badge-servido' : r.estado === 'PENDIENTE' ? 'badge-abierto' : 'badge-cancelado')}`}
                      style={pasada ? { background: '#444', color: '#999' } : {}}
                    >
                      {pasada ? "PASADA" : r.estado}
                    </span>
                  </td>
                  <td>
                    <div className="pedido-acciones">
                      {!pasada && (
                        <>
                          {r.estado === 'PENDIENTE' && (
                            <button onClick={() => handleConfirmarReserva(r.id)} className="btn-estado btn-estado-preparar" style={{ background: '#28a745' }} title="Aceptar">
                              <CheckSquare size={16} />
                            </button>
                          )}
                          <button onClick={() => prepararEdicion(r)} className="btn-estado btn-estado-preparar" title="Editar">
                            <Edit size={16} />
                          </button>
                          {r.estado !== 'CANCELADA' && (
                            <button onClick={() => handleCancelarReserva(r.id)} className="btn-estado btn-estado-cancelar" title="Cancelar">
                              <XCircle size={16} />
                            </button>
                          )}
                        </>
                      )}
                      <button onClick={() => handleEliminarReserva(r.id)} className="btn-estado btn-estado-cancelar" style={{ background: '#444' }} title="Eliminar">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
