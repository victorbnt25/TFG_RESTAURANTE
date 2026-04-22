import { useEffect, useState } from "react";
import { obtenerKpisReservas, obtenerKpisPedidos } from "../../servicios/adminApi";
import "./admin.css";

export default function AdminDashboard() {
  const [kpisReservas, setKpisReservas] = useState(null);
  const [kpisPedidos, setKpisPedidos] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    try {
      const reservas = await obtenerKpisReservas();
      const pedidos = await obtenerKpisPedidos();

      setKpisReservas(reservas);
      setKpisPedidos(pedidos);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <h2 className="admin-title-graffiti">Dashboard</h2>

      {/* ================= RESERVAS ================= */}
      {kpisReservas && (
        <>
          <h3 style={{ marginTop: "20px" }}>Reservas</h3>

          <div className="admin-kpis">
            <div className="kpi">
              <span>Total</span>
              <strong>{kpisReservas.total}</strong>
            </div>

            <div className="kpi">
              <span>Hoy</span>
              <strong>{kpisReservas.hoy}</strong>
            </div>

            <div className="kpi">
              <span>Pendientes</span>
              <strong>{kpisReservas.pendientes}</strong>
            </div>

            <div className="kpi">
              <span>Confirmadas</span>
              <strong>{kpisReservas.confirmadas}</strong>
            </div>

            <div className="kpi">
              <span>Canceladas</span>
              <strong>{kpisReservas.canceladas}</strong>
            </div>
          </div>
        </>
      )}

      {/* ================= PEDIDOS ================= */}
      {kpisPedidos && (
        <>
          <h3 style={{ marginTop: "40px" }}>Pedidos</h3>

          <div className="admin-kpis">
            <div className="kpi">
              <span>Total</span>
              <strong>{kpisPedidos.totalPedidos}</strong>
            </div>

            <div className="kpi">
              <span>Abiertos</span>
              <strong>{kpisPedidos.abiertos}</strong>
            </div>

            <div className="kpi">
              <span>En preparación</span>
              <strong>{kpisPedidos.preparando}</strong>
            </div>

            <div className="kpi">
              <span>Servidos</span>
              <strong>{kpisPedidos.servidos}</strong>
            </div>

            <div className="kpi">
              <span>Cancelados</span>
              <strong>{kpisPedidos.cancelados}</strong>
            </div>

            <div className="kpi">
              <span>Ingresos hoy</span>
              <strong>{kpisPedidos.ingresosHoy} €</strong>
            </div>

            <div className="kpi">
              <span>Ingresos total</span>
              <strong>{kpisPedidos.ingresosTotal} €</strong>
            </div>
          </div>
        </>
      )}
    </div>
  );
}