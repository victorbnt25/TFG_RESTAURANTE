import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerMisPedidos } from "../../servicios/api";
import { useCarrito } from "../../context/CarritoContext";
import "./misPedidos.css";

function MisPedidos() {
  const navigate = useNavigate();
  const { reemplazarCarrito } = useCarrito();

  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);
  const [pedidoExpandido, setPedidoExpandido] = useState(null);
  const [mensajeAccion, setMensajeAccion] = useState("");

  useEffect(() => {
    cargarPedidos();
  }, []);

  async function cargarPedidos() {
    try {
      setCargando(true);
      setError("");

      const data = await obtenerMisPedidos();
      setPedidos(data);
    } catch (e) {
      setError(e.message || "No se pudieron cargar tus pedidos.");
    } finally {
      setCargando(false);
    }
  }

  function repetirPedido(pedido) {
    const productos = pedido.lineas.map((linea) => ({
      id: linea.id,
      plato: linea.plato,
      precio: linea.precio,
      cantidad: linea.cantidad,
      imagen_url: linea.imagen_url || "",
    }));

    reemplazarCarrito(productos);
    setMensajeAccion(`✅ El pedido #${pedido.id} se ha cargado en tu carrito.`);

    setTimeout(() => {
      navigate("/carrito");
    }, 800);
  }

  const resumen = useMemo(() => {
    return {
      totalPedidos: pedidos.length,
      pendientes: pedidos.filter((p) => p.estado === "PENDIENTE").length,
      pagados: pedidos.filter((p) => p.estado === "PAGADO").length,
      entregados: pedidos.filter((p) => p.estado === "ENTREGADO").length,
      cancelados: pedidos.filter((p) => p.estado === "CANCELADO").length,
    };
  }, [pedidos]);

  function obtenerClaseEstado(estado) {
    switch (estado) {
      case "PENDIENTE":
        return "badge-estado badge-abierto";
      case "PAGADO":
        return "badge-estado badge-preparacion";
      case "ENTREGADO":
        return "badge-estado badge-servido";
      case "CANCELADO":
        return "badge-estado badge-cancelado";
      default:
        return "badge-estado";
    }
  }

  return (
    <section className="mis-pedidos-page container">
      <div className="mis-pedidos-header">
        <div>
          <h1 className="mis-pedidos-titulo">Mis pedidos</h1>
          <p className="mis-pedidos-subtitulo">
            Consulta el estado de tus pedidos y revisa el detalle de cada uno.
          </p>
        </div>

        <button
          type="button"
          className="btn-carta"
          onClick={cargarPedidos}
        >
          Actualizar
        </button>
      </div>

      {mensajeAccion && <p className="mis-pedidos-ok">{mensajeAccion}</p>}

      <div className="mis-pedidos-kpis">
        <div className="mis-pedidos-kpi">
          <span>Total pedidos</span>
          <strong>{resumen.totalPedidos}</strong>
        </div>

        <div className="mis-pedidos-kpi">
          <span>Pendientes</span>
          <strong>{resumen.pendientes}</strong>
        </div>

        <div className="mis-pedidos-kpi">
          <span>Pagados</span>
          <strong>{resumen.pagados}</strong>
        </div>

        <div className="mis-pedidos-kpi">
          <span>Entregados</span>
          <strong>{resumen.entregados}</strong>
        </div>

        <div className="mis-pedidos-kpi">
          <span>Cancelados</span>
          <strong>{resumen.cancelados}</strong>
        </div>
      </div>

      {cargando && <p className="mis-pedidos-info">Cargando pedidos...</p>}

      {error && <p className="mis-pedidos-error">{error}</p>}

      {!cargando && !error && pedidos.length === 0 && (
        <div className="mis-pedidos-vacio">
          <h2>Todavía no tienes pedidos</h2>
          <p>
            Cuando tramites tu primer pedido, podrás verlo aquí con su estado y
            su detalle completo.
          </p>
        </div>
      )}

      {!cargando && !error && pedidos.length > 0 && (
        <div className="mis-pedidos-grid">
          {pedidos.map((pedido) => {
            const totalUnidades = pedido.lineas.reduce(
              (acumulador, linea) => acumulador + Number(linea.cantidad),
              0
            );

            const expandido = pedidoExpandido === pedido.id;

            return (
              <article key={pedido.id} className="pedido-card">
                <div className="pedido-card-top">
                  <div>
                    <h3 className="pedido-card-id">Pedido #{pedido.id}</h3>
                    <p className="pedido-card-fecha">{pedido.fecha}</p>
                  </div>

                  <span className={obtenerClaseEstado(pedido.estado)}>
                    {pedido.estado}
                  </span>
                </div>

                <div className="pedido-card-resumen">
                  <div className="pedido-card-dato">
                    <span>Total</span>
                    <strong>{pedido.total} €</strong>
                  </div>

                  <div className="pedido-card-dato">
                    <span>Unidades</span>
                    <strong>{totalUnidades}</strong>
                  </div>

                  <div className="pedido-card-dato">
                    <span>Productos</span>
                    <strong>{pedido.lineas.length}</strong>
                  </div>
                </div>

                <div className="pedido-card-acciones pedido-card-acciones-dobles">
                  <button
                    type="button"
                    className="btn-carta"
                    onClick={() =>
                      setPedidoExpandido(expandido ? null : pedido.id)
                    }
                  >
                    {expandido ? "Ocultar detalle" : "Ver detalle"}
                  </button>

                  <button
                    type="button"
                    className="btn-repetir-pedido"
                    onClick={() => repetirPedido(pedido)}
                  >
                    Repetir pedido
                  </button>
                </div>

                {expandido && (
                  <div className="pedido-lineas-box">
                    <h4>Detalle del pedido</h4>

                    {pedido.lineas.map((linea, indice) => (
                      <div key={indice} className="pedido-linea-item">
                        <div>
                          <span className="pedido-linea-nombre">
                            {linea.plato}
                          </span>
                          <span className="pedido-linea-cantidad">
                            x{linea.cantidad}
                          </span>
                        </div>

                        <span className="pedido-linea-precio">
                          {linea.precio} €
                        </span>
                      </div>
                    ))}
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

export default MisPedidos;