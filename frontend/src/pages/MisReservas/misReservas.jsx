import { useEffect, useState } from "react";
import { obtenerMisReservas, cancelarReserva } from "../../servicios/api";
import { Link, useNavigate } from "react-router-dom";
import "./misReservas.css";

export default function MisReservas() {
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const usuarioGuardado = localStorage.getItem("usuario");
  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;

  useEffect(() => {
    if (!usuario) {
      navigate("/login");
      return;
    }
    cargarReservas();
  }, [usuario, navigate]);

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
      await cargarReservas(); // Recargar para mostrar el cambio de estado
    } catch (e) {
      alert("Hubo un error al cancelar la reserva.");
    }
  }

  if (!usuario) return null;

  return (
    <section className="container mis-reservas-page">
      <h1 className="title">MIS RESERVAS</h1>
      <p className="text">Aquí puedes gestionar tus reservas activas y revisar tu historial.</p>

      {error && <p className="mensaje-error">{error}</p>}

      {cargando ? (
        <p style={{ textAlign: "center", color: "#aaa" }}>Cargando tus reservas...</p>
      ) : reservas.length === 0 ? (
        <div className="sin-reservas">
          <p>Aún no has realizado ninguna reserva con nosotros.</p>
          <Link to="/reservas" className="btn-reservar-ahora">Reservar ahora</Link>
        </div>
      ) : (
        <div className="reservas-grid">
          {reservas.map((reserva) => {
            const fecha = new Date(reserva.fechaHoraReserva).toLocaleDateString("es-ES", {
              weekday: "long", year: "numeric", month: "long", day: "numeric"
            });
            const hora = new Date(reserva.fechaHoraReserva).toLocaleTimeString("es-ES", {
              hour: "2-digit", minute: "2-digit"
            });
            const esCancelada = reserva.estado === "cancelada";

            return (
              <article key={reserva.id} className={`reserva-card ${esCancelada ? 'cancelada' : ''}`}>
                <div className="reserva-header">
                  <h3>Reserva #{reserva.id}</h3>
                  <span className={`estado-badge ${reserva.estado}`}>
                    {reserva.estado.toUpperCase()}
                  </span>
                </div>
                
                <div className="reserva-body">
                  <p><strong>Fecha:</strong> <span style={{textTransform: "capitalize"}}>{fecha}</span></p>
                  <p><strong>Hora:</strong> {hora}</p>
                  <p><strong>Comensales:</strong> {reserva.numeroPersonas} personas</p>
                  <p><strong>Mesa:</strong> {reserva.mesa || "Por asignar"}</p>
                </div>

                {!esCancelada && (
                  <div className="reserva-footer">
                    <button 
                      className="btn-cancelar" 
                      onClick={() => manejarCancelar(reserva.id)}
                    >
                      Cancelar reserva
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
