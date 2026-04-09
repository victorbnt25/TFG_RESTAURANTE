import { useEffect, useState } from "react";
import { obtenerMisReservas, cancelarReserva, actualizarReserva } from "../../servicios/api";
import { Link, useNavigate } from "react-router-dom";
import "./misReservas.css";

export default function MisReservas() {
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  
  // Estados para edición
  const [reservaEditando, setReservaEditando] = useState(null);
  const [formEdicion, setFormEdicion] = useState({
    fecha: "",
    hora: "",
    numero_personas: 1,
    telefono: "",
    observaciones: ""
  });
  const [guardando, setGuardando] = useState(false);

  const usuarioGuardado = localStorage.getItem("usuario");
  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;

  useEffect(() => {
    if (!usuario) {
      navigate("/login");
      return;
    }
    cargarReservas();
  }, [usuario?.email, navigate]);

  async function cargarReservas() {
    try {
      setCargando(true);
      setError("");
      const datos = await obtenerMisReservas(usuario.email);
      setReservas(datos);
    } catch (e) {
      setError("No se pudieron cargar tus reservas.");
    } finally {
      setCargando(false);
    }
  }

  async function manejarCancelar(id) {
    if (!window.confirm("¿Seguro que quieres cancelar esta reserva?")) return;
    try {
      await cancelarReserva(id);
      await cargarReservas(); 
    } catch (e) {
      alert("Hubo un error al cancelar la reserva.");
    }
  }

  // LÓGICA DE EDICIÓN
  const abrirEdicion = (reserva) => {
    const [fecha, horaCompleta] = reserva.fechaHoraReserva.split(" ");
    const [h, m] = horaCompleta.split(":");
    
    setReservaEditando(reserva);
    setFormEdicion({
      fecha: fecha,
      hora: `${h}:${m}`,
      numero_personas: reserva.numeroPersonas,
      telefono: reserva.telefono || "",
      observaciones: reserva.observaciones || ""
    });
  };

  const cerrarEdicion = () => setReservaEditando(null);

  async function manejarGuardarEdicion(e) {
    e.preventDefault();
    try {
      setGuardando(true);
      await actualizarReserva(reservaEditando.id, formEdicion);
      cerrarEdicion();
      await cargarReservas();
      alert("¡Reserva actualizada con éxito!");
    } catch (e) {
      alert(e.message || "No hay disponibilidad para ese cambio.");
    } finally {
      setGuardando(false);
    }
  }

  if (!usuario) return null;

  return (
    <section className="mis-reservas-page">
      <div className="container">
        <h1 className="title">MIS RESERVAS</h1>
        <p className="text">Gestiona tus reservas, actualiza tus datos o cancela tu asistencia de manera personalizada.</p>

        <div className="reservas-header-acciones">
            <Link to="/reservas" className="btn-nueva-reserva">
                NUEVA RESERVA
            </Link>
        </div>

        {error && <p className="mensaje-error">{error}</p>}

        {cargando ? (
          <p style={{ textAlign: "center", color: "#aaa", padding: "40px" }}>Consultando base de datos...</p>
        ) : reservas.length === 0 ? (
          <div className="sin-reservas">
            <p>Aún no has realizado ninguna reserva con nosotros.</p>
            <Link to="/reservas" className="btn-reservar-ahora">RESERVAR AHORA</Link>
          </div>
        ) : (
          <div className="reservas-grid">
            {reservas.map((reserva) => {
              const dt = new Date(reserva.fechaHoraReserva.replace(" ", "T"));
              const fechaFmt = dt.toLocaleDateString("es-ES", {
                weekday: "long", day: "numeric", month: "long"
              });
              const horaFmt = dt.toLocaleTimeString("es-ES", {
                hour: "2-digit", minute: "2-digit"
              });
              const esCancelada = reserva.estado === "cancelada";

              return (
                <article key={reserva.id} className={`reserva-card ${esCancelada ? 'cancelada' : ''}`}>
                  <div className="reserva-header">
                    <h3>RESERVA #{reserva.id}</h3>
                    <span className={`estado-badge ${reserva.estado}`}>
                      {reserva.estado.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="reserva-body">
                    <p><strong>FECHA:</strong> <span style={{textTransform: "uppercase"}}>{fechaFmt}</span></p>
                    <p><strong>HORA:</strong> {horaFmt}</p>
                    <p><strong>TELÉFONO:</strong> {reserva.telefono || "SIN REGISTRAR"}</p>
                    <p><strong>COMENSALES:</strong> {reserva.numeroPersonas} PERSONAS</p>
                    <p><strong>MESA ASIGNADA:</strong> {reserva.mesa || "PENDIENTE DE ASIGNACIÓN"}</p>
                  </div>

                  {!esCancelada && (
                    <div className="reserva-footer">
                      <button className="btn-editar" onClick={() => abrirEdicion(reserva)}>
                        EDITAR
                      </button>
                      <button className="btn-cancelar" onClick={() => manejarCancelar(reserva.id)}>
                        CANCELAR
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL DE EDICIÓN */}
      {reservaEditando && (
        <div className="modal-overlay">
          <div className="modal-edicion">
            <h2>EDITAR RESERVA #{reservaEditando.id}</h2>
            <form className="form-edicion" onSubmit={manejarGuardarEdicion}>
              <div style={{display: "flex", gap: "10px"}}>
                  <div className="campo-edicion" style={{flex: 1}}>
                    <label>FECHA:</label>
                    <input 
                        type="date" 
                        value={formEdicion.fecha} 
                        onChange={e => setFormEdicion({...formEdicion, fecha: e.target.value})}
                        required
                    />
                  </div>
                  <div className="campo-edicion" style={{flex: 1}}>
                    <label>HORA:</label>
                    <input 
                        type="time" 
                        value={formEdicion.hora} 
                        onChange={e => setFormEdicion({...formEdicion, hora: e.target.value})}
                        required
                    />
                  </div>
              </div>
              <div style={{display: "flex", gap: "10px"}}>
                  <div className="campo-edicion" style={{flex: 1}}>
                    <label>TELÉFONO:</label>
                    <input 
                        type="tel" 
                        value={formEdicion.telefono} 
                        onChange={e => setFormEdicion({...formEdicion, telefono: e.target.value})}
                        required
                    />
                  </div>
                  <div className="campo-edicion" style={{flex: 1}}>
                    <label>PERSONAS:</label>
                    <input 
                        type="number" 
                        min="1" 
                        max="20"
                        value={formEdicion.numero_personas} 
                        onChange={e => setFormEdicion({...formEdicion, numero_personas: e.target.value})}
                        required
                    />
                  </div>
              </div>
              <div className="campo-edicion">
                <label>OBSERVACIONES TÉCNICAS:</label>
                <textarea 
                    rows="2"
                    value={formEdicion.observaciones} 
                    onChange={e => setFormEdicion({...formEdicion, observaciones: e.target.value})}
                    placeholder="Especifique alergias o necesidades especiales..."
                />
              </div>

              <div className="modal-acciones">
                <button type="button" className="btn-cerrar" onClick={cerrarEdicion}>DESCARTAR</button>
                <button type="submit" className="btn-guardar" disabled={guardando}>
                    {guardando ? "PROCESANDO..." : "GUARDAR CAMBIOS"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
