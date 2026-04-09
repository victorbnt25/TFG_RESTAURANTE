import { useEffect, useState } from "react";
import { 
  obtenerKpisReservas, 
  listarReservas, 
  actualizarReservaAdmin, 
  cancelarReservaAdmin,
  eliminarReservaAdmin,
  crearReservaAdmin 
} from "../../servicios/adminApi";
import ConfirmModal from "../../componentes/Modales/ConfirmModal";

export default function AdminDashboard() {
  const [kpis, setKpis] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [cargandoReservas, setCargandoReservas] = useState(true);
  
  // Modales
  const [mostrarModalNuevo, setMostrarModalNuevo] = useState(false);
  const [reservaEditando, setReservaEditando] = useState(null);
  
  // Formularios
  const [formDatos, setFormDatos] = useState({
    nombre: "",
    email: "",
    telefono: "",
    fecha: "",
    hora: "",
    numero_personas: 2,
    observaciones: ""
  });

  const [procesando, setProcesando] = useState(false);

  // Estado para el Modal de Confirmación Genérico
  const [confirmConfig, setConfirmConfig] = useState({
    titulo: "",
    mensaje: "",
    targetId: null,
    actionType: null, // "cancelar" o "eliminar"
    tipo: "normal"
  });

  // Estado para un pequeño feedback de éxito (Opcional, pero mejor que alert)
  const [mensajeExito, setMensajeExito] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    try {
      setCargandoReservas(true);
      const [datosKpis, datosReservas] = await Promise.all([
        obtenerKpisReservas(),
        listarReservas()
      ]);
      setKpis(datosKpis);
      setReservas(datosReservas);
    } catch (e) {
      console.error("Error al cargar datos:", e);
    } finally {
      setCargandoReservas(false);
    }
  }

  // ACCIONES
  // ACCIONES CON MODAL PERSONALIZADO
  async function ejecutarConfirmacion() {
    const { targetId, actionType } = confirmConfig;
    if (!targetId || !actionType) return;

    try {
      if (actionType === "cancelar") {
        await cancelarReservaAdmin(targetId);
        mostrarExito("Reserva anulada correctamente.");
      } else if (actionType === "eliminar") {
        await eliminarReservaAdmin(targetId);
        mostrarExito("Reserva eliminada de la base de datos.");
      }
      cerrarConfirm();
      await cargarDatos();
    } catch (e) {
      alert("Error en la operación: " + (e.message || "Error desconocido"));
    }
  }

  // FUNCIONES AUXILIARES PARA EL MODAL
  const abrirConfirmCancelar = (id) => {
    setConfirmConfig({
      isOpen: true,
      titulo: "Anular Reserva",
      mensaje: "¿Seguro que quieres marcar esta reserva como CANCELADA? El cliente podrá ver el nuevo estado.",
      targetId: id,
      actionType: "cancelar",
      tipo: "normal"
    });
  };

  const abrirConfirmEliminar = (id) => {
    setConfirmConfig({
      isOpen: true,
      titulo: "Eliminar Reserva",
      mensaje: "¡ATENCIÓN! Esta acción borrará la reserva DEFINITIVAMENTE. ¿Estás seguro?",
      targetId: id,
      actionType: "eliminar",
      tipo: "peligro"
    });
  };

  const cerrarConfirm = () => {
    setConfirmConfig(prev => ({ ...prev, isOpen: false }));
  };

  const mostrarExito = (msg) => {
    setMensajeExito(msg);
    setTimeout(() => setMensajeExito(""), 3000);
  };

  const abrirEdicion = (r) => {
    const [fecha, horaCompleta] = r.fechaHoraReserva.split(" ");
    const [h, m] = horaCompleta.split(":");
    setReservaEditando(r);
    setFormDatos({
        nombre: r.nombre || "",
        email: r.email || "",
        telefono: r.telefono || "",
        fecha: fecha,
        hora: `${h}:${m}`,
        numero_personas: r.numeroPersonas,
        observaciones: r.observaciones || ""
    });
  };

  const abrirNuevo = () => {
    setFormDatos({
        nombre: "",
        email: "",
        telefono: "",
        fecha: new Date().toISOString().split('T')[0],
        hora: "20:00",
        numero_personas: 2,
        observaciones: ""
    });
    setMostrarModalNuevo(true);
  };

  async function guardarReserva(e) {
    e.preventDefault();
    setProcesando(true);
    try {
      if (reservaEditando) {
        await actualizarReservaAdmin(reservaEditando.id, formDatos);
      } else {
        await crearReservaAdmin(formDatos);
      }
      setMostrarModalNuevo(false);
      setReservaEditando(null);
      await cargarDatos();
      mostrarExito("Operación realizada con éxito.");
    } catch (e) {
      alert(e.message || "Error al guardar los datos.");
    } finally {
      setProcesando(false);
    }
  }

  return (
    <div className="admin-pedidos-wrapper">
      {/* Toast de Éxito */}
      {mensajeExito && (
        <div className="admin-toast-success">
          {mensajeExito}
        </div>
      )}

      <div className="admin-pedidos-header">
        <div>
          <h2>Panel de Control</h2>
          <p className="admin-subtitle-text">Gestión total de reservas y actividad del restaurante</p>
        </div>
        <button className="btn-gold" onClick={abrirNuevo}>
          NUEVA RESERVA
        </button>
      </div>

      {/* KPIs PREMIUM */}
      <div className="admin-kpis-grid" style={{ marginBottom: "30px" }}>
        <div className="admin-kpi-card">
          <span className="admin-kpi-label">Reservas Hoy</span>
          <span className="admin-kpi-value">{kpis?.reservas_hoy || 0}</span>
        </div>
        <div className="admin-kpi-card">
          <span className="admin-kpi-label">Semana Actual</span>
          <span className="admin-kpi-value" style={{ color: "#7bc4ff" }}>{kpis?.reservas_semana || 0}</span>
        </div>
        <div className="admin-kpi-card">
          <span className="admin-kpi-label">Canceladas Hoy</span>
          <span className="admin-kpi-value" style={{ color: "#ff8d97" }}>{kpis?.canceladas_hoy || 0}</span>
        </div>
      </div>

      <div className="admin-pedidos-header">
        <h3>Listado de Reservas</h3>
      </div>

      <div className="admin-pedidos-tabla-wrapper">
        {cargandoReservas ? (
          <p style={{textAlign: "center", padding: "40px", color: "#888"}}>Consultando reservas...</p>
        ) : reservas.length === 0 ? (
          <p className="placeholder-text">No hay reservas registradas en el sistema.</p>
        ) : (
          <table className="admin-tabla">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Teléfono</th>
                <th>Personas</th>
                <th>Zona</th>
                <th>Mesa(s)</th>
                <th>Fecha/Hora</th>
                <th>Estado</th>
                <th style={{textAlign: "center"}}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((r) => (
                <tr key={r.id}>
                  <td style={{color: "#e77e23", fontWeight: "bold"}}>#{r.id}</td>
                  <td>
                    <div style={{fontWeight: "bold"}}>{r.nombre}</div>
                    <div style={{fontSize: "0.8rem", color: "#777"}}>{r.email}</div>
                  </td>
                  <td>{r.telefono || "---"}</td>
                  <td style={{ textAlign: "center" }}>{r.numeroPersonas}</td>
                  <td><span className="badge-zona">{r.zona}</span></td>
                  <td style={{ fontWeight: "600", color: "#e77e23" }}>{r.mesa}</td>
                  <td>{new Date(r.fechaHoraReserva.replace(" ", "T")).toLocaleString("es-ES")}</td>
                  <td>
                    <span className={`badge-estado ${r.estado}`}>
                      {r.estado.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <div style={{display: "flex", gap: "8px", justifyContent: "center"}}>
                        <button className="btn-accion-tabla btn-accion-editar" title="Editar datos" onClick={() => abrirEdicion(r)}>
                            EDITAR
                        </button>
                        {r.estado !== "cancelada" && (
                            <button className="btn-accion-tabla btn-accion-cancelar" title="Anular reserva" onClick={() => abrirConfirmCancelar(r.id)}>
                                ANULAR
                            </button>
                        )}
                        <button className="btn-accion-tabla btn-accion-eliminar" title="Borrar de la DB" onClick={() => abrirConfirmEliminar(r.id)}>
                            ELIMINAR
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL PARA NUEVO / EDITAR */}
      {(mostrarModalNuevo || reservaEditando) && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <h2>{reservaEditando ? `EDITAR RESERVA #${reservaEditando.id}` : "CREAR NUEVA RESERVA"}</h2>
            <form onSubmit={guardarReserva}>
              <div className="admin-form-group">
                <label>Nombre del Cliente</label>
                <input 
                  type="text" 
                  value={formDatos.nombre} 
                  onChange={e => setFormDatos({...formDatos, nombre: e.target.value})}
                  required
                />
              </div>
              <div style={{display: "flex", gap: "15px"}}>
                  <div className="admin-form-group" style={{flex: 1}}>
                    <label>Email</label>
                    <input 
                      type="email" 
                      value={formDatos.email} 
                      onChange={e => setFormDatos({...formDatos, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="admin-form-group" style={{flex: 1}}>
                    <label>Teléfono</label>
                    <input 
                      type="tel" 
                      value={formDatos.telefono} 
                      onChange={e => setFormDatos({...formDatos, telefono: e.target.value})}
                      required
                    />
                  </div>
              </div>
              <div style={{display: "flex", gap: "15px"}}>
                  <div className="admin-form-group" style={{flex: 1}}>
                    <label>Fecha</label>
                    <input 
                      type="date" 
                      value={formDatos.fecha} 
                      onChange={e => setFormDatos({...formDatos, fecha: e.target.value})}
                      required
                    />
                  </div>
                  <div className="admin-form-group" style={{flex: 1}}>
                    <label>Hora</label>
                    <input 
                      type="time" 
                      value={formDatos.hora} 
                      onChange={e => setFormDatos({...formDatos, hora: e.target.value})}
                      required
                    />
                  </div>
              </div>
              <div className="admin-form-group">
                <label>Nº de Personas</label>
                <input 
                  type="number" 
                  min="1"
                  value={formDatos.numero_personas} 
                  onChange={e => setFormDatos({...formDatos, numero_personas: e.target.value})}
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Observaciones (Opcional)</label>
                <textarea 
                  value={formDatos.observaciones} 
                  onChange={e => setFormDatos({...formDatos, observaciones: e.target.value})}
                  rows="2"
                />
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="btn-admin-secundario" onClick={() => {
                  setMostrarModalNuevo(false);
                  setReservaEditando(null);
                }}>
                  DESCARTAR
                </button>
                <button type="submit" className="btn-admin-primario" disabled={procesando}>
                  {procesando ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN INTEGRADO */}
      <ConfirmModal 
        isOpen={confirmConfig.isOpen}
        titulo={confirmConfig.titulo}
        mensaje={confirmConfig.mensaje}
        tipo={confirmConfig.tipo}
        onConfirm={ejecutarConfirmacion}
        onCancel={cerrarConfirm}
        textoConfirmar={confirmConfig.tipo === "peligro" ? "SÍ, ELIMINAR" : "SÍ, ANULAR"}
      />
    </div>
  );
}
