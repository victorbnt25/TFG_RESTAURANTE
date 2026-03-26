import { useEffect, useMemo, useState } from "react";
import { listarPedidos, cambiarEstadoPedido } from "../../servicios/adminApi";
import "./admin.css";

const ESTADOS = [
  "TODOS",
  "ABIERTO",
  "EN_PREPARACION",
  "SERVIDO",
  "CERRADO",
  "CANCELADO",
];

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [busqueda, setBusqueda] = useState("");
  const [pedidoExpandido, setPedidoExpandido] = useState(null);
  const [actualizandoId, setActualizandoId] = useState(null);

  const cargarPedidos = async (mostrarLoader = true) => {
    try {
      if (mostrarLoader) {
        setCargando(true);
      }

      setError("");
      const data = await listarPedidos();
      setPedidos(data);
    } catch (e) {
      setError(e.message || "No se pudieron cargar los pedidos.");
    } finally {
      if (mostrarLoader) {
        setCargando(false);
      }
    }
  };

  useEffect(() => {
    cargarPedidos();

    const intervalo = setInterval(() => {
      cargarPedidos(false);
    }, 15000);

    return () => clearInterval(intervalo);
  }, []);

  const cambiarEstado = async (id, estado) => {
    try {
      setActualizandoId(id);
      setMensaje("");
      setError("");

      await cambiarEstadoPedido(id, estado);
      setMensaje(`✅ Estado del pedido #${id} actualizado a ${estado}`);
      await cargarPedidos(false);
    } catch (e) {
      setError(e.message || "No se pudo actualizar el estado del pedido.");
    } finally {
      setActualizandoId(null);
    }
  };

  const pedidosFiltrados = useMemo(() => {
    return pedidos.filter((pedido) => {
      const cumpleEstado =
        filtroEstado === "TODOS" || pedido.estado === filtroEstado;

      const textoBusqueda = busqueda.trim().toLowerCase();

      const cumpleBusqueda =
        textoBusqueda === "" ||
        String(pedido.id).includes(textoBusqueda) ||
        String(pedido.total).toLowerCase().includes(textoBusqueda) ||
        pedido.lineas.some((linea) =>
          linea.plato.toLowerCase().includes(textoBusqueda)
        );

      return cumpleEstado && cumpleBusqueda;
    });
  }, [pedidos, filtroEstado, busqueda]);

  const resumen = useMemo(() => {
    return {
      total: pedidos.length,
      abiertos: pedidos.filter((p) => p.estado === "ABIERTO").length,
      preparando: pedidos.filter((p) => p.estado === "EN_PREPARACION").length,
      servidos: pedidos.filter((p) => p.estado === "SERVIDO").length,
      cancelados: pedidos.filter((p) => p.estado === "CANCELADO").length,
    };
  }, [pedidos]);

  const obtenerClaseEstado = (estado) => {
    switch (estado) {
      case "ABIERTO":
        return "badge-estado badge-abierto";
      case "EN_PREPARACION":
        return "badge-estado badge-preparacion";
      case "SERVIDO":
        return "badge-estado badge-servido";
      case "CERRADO":
        return "badge-estado badge-cerrado";
      case "CANCELADO":
        return "badge-estado badge-cancelado";
      default:
        return "badge-estado";
    }
  };

  return (
    <div className="admin-pedidos-wrapper">
      <div className="admin-pedidos-header">
        <div>
          <h2 className="admin-title-graffiti">Pedidos</h2>
          <p className="admin-subtitle-text">
            Gestiona el flujo de cocina y controla el estado de cada pedido.
          </p>
        </div>

        <button
          className="btn-add"
          onClick={() => cargarPedidos()}
          type="button"
        >
          Actualizar
        </button>
      </div>

      <div className="admin-kpis-grid">
        <div className="admin-kpi-card">
          <span className="admin-kpi-label">Total pedidos</span>
          <strong className="admin-kpi-value">{resumen.total}</strong>
        </div>

        <div className="admin-kpi-card">
          <span className="admin-kpi-label">Abiertos</span>
          <strong className="admin-kpi-value">{resumen.abiertos}</strong>
        </div>

        <div className="admin-kpi-card">
          <span className="admin-kpi-label">En preparación</span>
          <strong className="admin-kpi-value">{resumen.preparando}</strong>
        </div>

        <div className="admin-kpi-card">
          <span className="admin-kpi-label">Servidos</span>
          <strong className="admin-kpi-value">{resumen.servidos}</strong>
        </div>

        <div className="admin-kpi-card">
          <span className="admin-kpi-label">Cancelados</span>
          <strong className="admin-kpi-value">{resumen.cancelados}</strong>
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="filtros-container">
          <span>Filtrar por estado:</span>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="select-filtro"
          >
            {ESTADOS.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-busqueda-box">
          <input
            type="text"
            placeholder="Buscar por ID, total o plato..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="admin-busqueda-input"
          />
        </div>
      </div>

      {mensaje && <p className="mensaje-exito">{mensaje}</p>}
      {error && <p className="mensaje-error">{error}</p>}
      {cargando && <p>Cargando pedidos...</p>}

      {!cargando && pedidosFiltrados.length === 0 && (
        <p>No hay pedidos que coincidan con el filtro actual.</p>
      )}

      {!cargando && pedidosFiltrados.length > 0 && (
        <div className="contenedor-tabla">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Unidades</th>
                <th>Productos</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {pedidosFiltrados.map((pedido) => {
                const totalUnidades = pedido.lineas.reduce(
                  (acumulador, linea) => acumulador + Number(linea.cantidad),
                  0
                );

                const expandido = pedidoExpandido === pedido.id;

                return (
                  <tr key={pedido.id}>
                    <td>
                      <strong>#{pedido.id}</strong>
                    </td>
                    <td>{pedido.fecha}</td>
                    <td>{pedido.total} €</td>
                    <td>
                      <span className={obtenerClaseEstado(pedido.estado)}>
                        {pedido.estado}
                      </span>
                    </td>
                    <td>{totalUnidades}</td>
                    <td>
                      <button
                        type="button"
                        className="btn-edit-table"
                        onClick={() =>
                          setPedidoExpandido(expandido ? null : pedido.id)
                        }
                      >
                        {expandido ? "Ocultar" : "Ver productos"}
                      </button>

                      {expandido && (
                        <div className="pedido-lineas-box">
                          {pedido.lineas.map((linea, indice) => (
                            <div key={indice} className="pedido-linea-item">
                              <span>
                                {linea.plato} x{linea.cantidad}
                              </span>
                              <span>{linea.precio} €</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="pedido-acciones">
                        <button
                          type="button"
                          className="btn-estado btn-estado-preparar"
                          onClick={() =>
                            cambiarEstado(pedido.id, "EN_PREPARACION")
                          }
                          disabled={actualizandoId === pedido.id}
                        >
                          Preparar
                        </button>

                        <button
                          type="button"
                          className="btn-estado btn-estado-servido"
                          onClick={() => cambiarEstado(pedido.id, "SERVIDO")}
                          disabled={actualizandoId === pedido.id}
                        >
                          Servido
                        </button>

                        <button
                          type="button"
                          className="btn-estado btn-estado-cerrar"
                          onClick={() => cambiarEstado(pedido.id, "CERRADO")}
                          disabled={actualizandoId === pedido.id}
                        >
                          Cerrar
                        </button>

                        <button
                          type="button"
                          className="btn-estado btn-estado-cancelar"
                          onClick={() => cambiarEstado(pedido.id, "CANCELADO")}
                          disabled={actualizandoId === pedido.id}
                        >
                          Cancelar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}