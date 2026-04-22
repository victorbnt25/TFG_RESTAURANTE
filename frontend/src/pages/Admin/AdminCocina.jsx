import { useEffect, useMemo, useState } from "react";
import { listarPedidos, cambiarEstadoPedido } from "../../servicios/adminApi";
import "./admin.css";

export default function AdminCocina() {
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);
  const [actualizandoId, setActualizandoId] = useState(null);

  useEffect(() => {
    cargarPedidos();

    const intervalo = setInterval(() => {
      cargarPedidos(false);
    }, 10000);

    return () => clearInterval(intervalo);
  }, []);

  async function cargarPedidos(mostrarLoader = true) {
    try {
      if (mostrarLoader) setCargando(true);
      setError("");

      const data = await listarPedidos();
      setPedidos(data);
    } catch (e) {
      setError(e.message || "No se pudieron cargar los pedidos.");
    } finally {
      if (mostrarLoader) setCargando(false);
    }
  }

  async function actualizarEstado(id, estado) {
    try {
      setActualizandoId(id);
      setMensaje("");
      setError("");

      await cambiarEstadoPedido(id, estado);
      setMensaje(`✅ Pedido #${id} actualizado a ${estado}`);
      await cargarPedidos(false);
    } catch (e) {
      setError(e.message || "No se pudo actualizar el pedido.");
    } finally {
      setActualizandoId(null);
    }
  }

  const columnas = useMemo(() => {
    return {
      pendientes: pedidos.filter((p) => p.estado === "PENDIENTE"),
      pagados: pedidos.filter((p) => p.estado === "PAGADO"),
      entregados: pedidos.filter((p) => p.estado === "ENTREGADO"),
    };
  }, [pedidos]);

  const totalUnidades = (pedido) =>
    pedido.lineas.reduce(
      (acumulador, linea) => acumulador + Number(linea.cantidad),
      0
    );

  return (
    <div className="admin-cocina-page">
      <div className="admin-cocina-header">
        <div>
          <h2 className="admin-title-graffiti">Panel de cocina</h2>
          <p className="admin-subtitle-text">
            Vista rápida de pedidos para cocina y servicio.
          </p>
        </div>

        <button className="btn-add" onClick={() => cargarPedidos()} type="button">
          Actualizar
        </button>
      </div>

      {mensaje && <p className="mensaje-exito">{mensaje}</p>}
      {error && <p className="mensaje-error">{error}</p>}
      {cargando && <p>Cargando pedidos...</p>}

      <div className="cocina-board">
        <section className="cocina-columna">
          <div className="cocina-columna-header cocina-abiertos">
            <h3>Pendientes</h3>
            <span>{columnas.pendientes.length}</span>
          </div>

          <div className="cocina-columna-body">
            {columnas.pendientes.length === 0 ? (
              <p className="cocina-vacio">No hay pedidos pendientes.</p>
            ) : (
              columnas.pendientes.map((pedido) => (
                <article key={pedido.id} className="cocina-card">
                  <div className="cocina-card-top">
                    <div>
                      <h4>Pedido #{pedido.id}</h4>
                      <p>{pedido.fecha}</p>
                      <p>Mesa: {pedido.mesa || "Sin mesa"}</p>
                    </div>
                    <strong>{pedido.total} €</strong>
                  </div>

                  <div className="cocina-card-meta">
                    <span>Unidades: {totalUnidades(pedido)}</span>
                    <span>Productos: {pedido.lineas.length}</span>
                  </div>

                  <div className="cocina-lineas">
                    {pedido.lineas.map((linea, indice) => (
                      <div key={indice} className="cocina-linea">
                        <span>{linea.plato}</span>
                        <strong>x{linea.cantidad}</strong>
                      </div>
                    ))}
                  </div>

                  <div className="cocina-acciones">
                    <button
                      type="button"
                      className="btn-estado btn-estado-preparar"
                      onClick={() => actualizarEstado(pedido.id, "PAGADO")}
                      disabled={actualizandoId === pedido.id}
                    >
                      Pasar a pagado
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="cocina-columna">
          <div className="cocina-columna-header cocina-preparacion">
            <h3>Pagados</h3>
            <span>{columnas.pagados.length}</span>
          </div>

          <div className="cocina-columna-body">
            {columnas.pagados.length === 0 ? (
              <p className="cocina-vacio">No hay pedidos pagados.</p>
            ) : (
              columnas.pagados.map((pedido) => (
                <article key={pedido.id} className="cocina-card">
                  <div className="cocina-card-top">
                    <div>
                      <h4>Pedido #{pedido.id}</h4>
                      <p>{pedido.fecha}</p>
                      <p>Mesa: {pedido.mesa || "Sin mesa"}</p>
                    </div>
                    <strong>{pedido.total} €</strong>
                  </div>

                  <div className="cocina-card-meta">
                    <span>Unidades: {totalUnidades(pedido)}</span>
                    <span>Productos: {pedido.lineas.length}</span>
                  </div>

                  <div className="cocina-lineas">
                    {pedido.lineas.map((linea, indice) => (
                      <div key={indice} className="cocina-linea">
                        <span>{linea.plato}</span>
                        <strong>x{linea.cantidad}</strong>
                      </div>
                    ))}
                  </div>

                  <div className="cocina-acciones">
                    <button
                      type="button"
                      className="btn-estado btn-estado-servido"
                      onClick={() => actualizarEstado(pedido.id, "ENTREGADO")}
                      disabled={actualizandoId === pedido.id}
                    >
                      Marcar entregado
                    </button>

                    <button
                      type="button"
                      className="btn-estado btn-estado-cancelar"
                      onClick={() => actualizarEstado(pedido.id, "CANCELADO")}
                      disabled={actualizandoId === pedido.id}
                    >
                      Cancelar
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="cocina-columna">
          <div className="cocina-columna-header cocina-servidos">
            <h3>Entregados</h3>
            <span>{columnas.entregados.length}</span>
          </div>

          <div className="cocina-columna-body">
            {columnas.entregados.length === 0 ? (
              <p className="cocina-vacio">No hay pedidos entregados.</p>
            ) : (
              columnas.entregados.map((pedido) => (
                <article key={pedido.id} className="cocina-card cocina-card-servido">
                  <div className="cocina-card-top">
                    <div>
                      <h4>Pedido #{pedido.id}</h4>
                      <p>{pedido.fecha}</p>
                      <p>Mesa: {pedido.mesa || "Sin mesa"}</p>
                    </div>
                    <strong>{pedido.total} €</strong>
                  </div>

                  <div className="cocina-card-meta">
                    <span>Unidades: {totalUnidades(pedido)}</span>
                    <span>Productos: {pedido.lineas.length}</span>
                  </div>

                  <div className="cocina-lineas">
                    {pedido.lineas.map((linea, indice) => (
                      <div key={indice} className="cocina-linea">
                        <span>{linea.plato}</span>
                        <strong>x{linea.cantidad}</strong>
                      </div>
                    ))}
                  </div>

                  <div className="cocina-acciones">
                    <button
                      type="button"
                      className="btn-estado btn-estado-cerrar"
                      onClick={() => actualizarEstado(pedido.id, "ENTREGADO")}
                      disabled={actualizandoId === pedido.id}
                    >
                      Cerrar pedido
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}