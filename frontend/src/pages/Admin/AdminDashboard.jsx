import { useEffect, useState } from "react";
import { obtenerKpisReservas, listarReservas } from "../../servicios/adminApi";

export default function AdminDashboard() {
  const [kpis, setKpis] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [errorKpis, setErrorKpis] = useState("");
  const [cargandoReservas, setCargandoReservas] = useState(true);
 
  useEffect(() => {
    // 1. Cargar KPIs
    obtenerKpisReservas()
      .then(setKpis)
      .catch((e) => setErrorKpis(e.message));

    // 2. Cargar Reservas
    listarReservas()
      .then((datos) => {
        // Mostramos solo las 10 más recientes o las de hoy
        setReservas(datos.slice(0, 10));
      })
      .catch((e) => console.error("Error al cargar reservas:", e))
      .finally(() => setCargandoReservas(false));
  }, []);

  return (
    <div className="admin-pedidos-wrapper">
      <div className="admin-pedidos-header">
        <div>
          <h2>Panel de Control</h2>
          <p className="admin-subtitle-text">Vista general de actividad y configuración del sistema</p>
        </div>
      </div>

      {errorKpis && <div className="mensaje-error">{errorKpis}</div>}
      
      {!kpis && !errorKpis ? (
        <p>Cargando métricas...</p>
      ) : kpis ? (
        <div className="admin-kpis-grid" style={{ marginBottom: "30px" }}>
          <div className="admin-kpi-card">
            <span className="admin-kpi-label">Reservas Hoy</span>
            <span className="admin-kpi-value">{kpis.reservas_hoy}</span>
          </div>
          <div className="admin-kpi-card">
            <span className="admin-kpi-label">Reservas (Esta Semana)</span>
            <span className="admin-kpi-value" style={{ color: "#7bc4ff" }}>{kpis.reservas_semana}</span>
          </div>
          <div className="admin-kpi-card">
            <span className="admin-kpi-label">Canceladas Hoy</span>
            <span className="admin-kpi-value" style={{ color: "#ff8d97" }}>{kpis.canceladas_hoy}</span>
          </div>
        </div>
      ) : null}

      <div className="admin-pedidos-header">
        <h3>Reservas Recientes</h3>
      </div>

      <div className="admin-pedidos-tabla-wrapper" style={{ marginTop: "10px" }}>
        {cargandoReservas ? (
          <p>Cargando lista de reservas...</p>
        ) : reservas.length === 0 ? (
          <p>No hay reservas recientes.</p>
        ) : (
          <table className="admin-tabla">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Email</th>
                <th>Personas</th>
                <th>Fecha/Hora</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((r) => (
                <tr key={r.id}>
                  <td style={{ fontWeight: "bold" }}>{r.nombre}</td>
                  <td>{r.email}</td>
                  <td style={{ textAlign: "center" }}>{r.numeroPersonas}</td>
                  <td>{new Date(r.fechaHoraReserva).toLocaleString()}</td>
                  <td>
                    <span className={`badge-estado ${r.estado}`}>
                      {r.estado.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
