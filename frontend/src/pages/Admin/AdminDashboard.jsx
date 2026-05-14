import { useEffect, useState } from "react";
import { obtenerKpisReservas, obtenerKpisPedidos } from "../../servicios/adminApi";
import {
  ShoppingBag,
  Clock,
  CreditCard,
  CheckCircle,
  XCircle,
  TrendingUp,
  Euro,
  CalendarDays,
  Users,
  AlertCircle,
} from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import "./admin.css";

function KpiCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="admin-kpi-card" style={accent ? { borderColor: accent } : {}}>
      <div className="admin-kpi-icon" style={accent ? { color: accent } : {}}>
        <Icon size={22} strokeWidth={2} />
      </div>
      <span className="admin-kpi-label">{label}</span>
      <strong className="admin-kpi-value">{value ?? "—"}</strong>
    </div>
  );
}

export default function AdminDashboard() {
  const [kpisReservas, setKpisReservas] = useState(null);
  const [kpisPedidos, setKpisPedidos]   = useState(null);
  const [error, setError]               = useState(null);
  const [periodo, setPeriodo]           = useState("todo"); // 'todo', 'semana', 'mes', 'ano'

  useEffect(() => {
    cargarDatos();
  }, [periodo]);

  async function cargarDatos() {
    try {
      const [reservas, pedidos] = await Promise.all([
        obtenerKpisReservas(periodo),
        obtenerKpisPedidos(periodo),
      ]);
      setKpisReservas(reservas);
      setKpisPedidos(pedidos);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los datos del dashboard.");
    }
  }

  return (
    <div className="admin-dashboard-wrapper">
      <div className="admin-dashboard-header">
        <div>
          <h2 className="admin-title-graffiti">Dashboard</h2>
          <p className="admin-subtitle-text">Resumen general del restaurante en tiempo real.</p>
        </div>
        <div className="admin-dashboard-actions" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <select 
            className="admin-select" 
            value={periodo} 
            onChange={(e) => setPeriodo(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '4px', background: '#111', color: '#fff', border: '1px solid #333' }}
          >
            <option value="todo">Desde siempre</option>
            <option value="hoy">Hoy</option>
            <option value="semana">Esta semana</option>
            <option value="mes">Este mes</option>
            <option value="ano">Este año</option>
          </select>
          <button className="btn-add" onClick={cargarDatos} type="button">
            Actualizar
          </button>
        </div>
      </div>

      {error && (
        <div className="dashboard-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* ===== PEDIDOS ===== */}
      {kpisPedidos && (
        <section className="admin-dashboard-section">
          <h3 className="admin-section-title">
            <ShoppingBag size={18} /> Pedidos
          </h3>
          <div className="admin-kpis">
            <KpiCard icon={ShoppingBag} label="Total pedidos"   value={kpisPedidos.totalPedidos} />
            <KpiCard icon={Clock}       label="Pendientes"       value={kpisPedidos.pendientes}   accent="#e77e23" />
            <KpiCard icon={CreditCard}  label="Pagados"          value={kpisPedidos.pagados}      accent="#0d6efd" />
            <KpiCard icon={CheckCircle} label="Entregados"       value={kpisPedidos.entregados}   accent="#28a745" />
            <KpiCard icon={XCircle}     label="Cancelados"       value={kpisPedidos.cancelados}   accent="#dc3545" />
            <KpiCard icon={Euro}        label="Ingresos hoy"     value={`${kpisPedidos.ingresosHoy} €`}   accent="#ffd700" />
            <KpiCard icon={TrendingUp}  label={periodo === 'todo' ? "Ingresos totales" : "Ingresos periodo"} value={`${kpisPedidos.ingresosTotal} €`} accent="#ffd700" />
          </div>
        </section>
      )}

      {/* ===== VISUALIZACIÓN DE DATOS ===== */}
      {(kpisPedidos || kpisReservas) && (
        <section className="admin-dashboard-section" style={{ marginTop: '20px' }}>
          <h3 className="admin-section-title">
            <TrendingUp size={18} /> Análisis de Rendimiento
          </h3>
          <div className="dashboard-charts-grid">
            {/* Gráfico de Pedidos (Donut) */}
            <div className="admin-chart-card">
              <h4>Distribución de Pedidos</h4>
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Pendientes', value: kpisPedidos?.pendientes || 0 },
                        { name: 'Pagados', value: kpisPedidos?.pagados || 0 },
                        { name: 'Entregados', value: kpisPedidos?.entregados || 0 },
                        { name: 'Cancelados', value: kpisPedidos?.cancelados || 0 },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      <Cell fill="#e77e23" />
                      <Cell fill="#0d6efd" />
                      <Cell fill="#28a745" />
                      <Cell fill="#dc3545" />
                    </Pie>
                    <Tooltip 
                      contentStyle={{ background: '#111', border: '1px solid #333', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Gráfico de Barras: Actividad General */}
            <div className="admin-chart-card">
              <h4>Actividad: Pedidos vs Reservas</h4>
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                  <BarChart
                    data={[
                      { name: 'Total', pedidos: kpisPedidos?.totalPedidos || 0, reservas: kpisReservas?.total || 0 },
                      { name: 'Pendientes', pedidos: kpisPedidos?.pendientes || 0, reservas: kpisReservas?.pendientes || 0 },
                    ]}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                    <XAxis dataKey="name" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip 
                      contentStyle={{ background: '#111', border: '1px solid #333', borderRadius: '8px' }}
                    />
                    <Legend />
                    <Bar dataKey="pedidos" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="reservas" fill="#ffd700" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== RESERVAS ===== */}
      {kpisReservas && (
        <section className="admin-dashboard-section">
          <h3 className="admin-section-title">
            <CalendarDays size={18} /> Reservas
          </h3>
          <div className="admin-kpis">
            <KpiCard icon={CalendarDays} label="Total reservas" value={kpisReservas.total} />
            <KpiCard icon={Clock}        label="Hoy"            value={kpisReservas.hoy}         accent="#e77e23" />
            <KpiCard icon={AlertCircle}  label="Pendientes"     value={kpisReservas.pendientes}  accent="#ffd700" />
            <KpiCard icon={CheckCircle}  label="Confirmadas"    value={kpisReservas.confirmadas} accent="#28a745" />
            <KpiCard icon={XCircle}      label="Canceladas"     value={kpisReservas.canceladas}  accent="#dc3545" />
          </div>
        </section>
      )}

      {!kpisPedidos && !kpisReservas && !error && (
        <div className="dashboard-loading">
          <div className="spinner" />
          <span>Cargando datos...</span>
        </div>
      )}
    </div>
  );
}